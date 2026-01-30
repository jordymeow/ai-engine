<?php

/**
* AI Engine MCP Server
*
* This class implements a Model Context Protocol (MCP) server for AI Engine.
*
* Current Implementation:
* - Works reliably with Claude App through the mcp.js relay
* - Works directly with Claude.ai and ChatGPT via SSE connections
* - Properly handles agent cancellation signals (notifications/cancelled) to free workers immediately
* - Uses 30-second timeout to prevent worker exhaustion from abandoned connections
* - Sends heartbeat signals to detect dead connections quickly
* - OAuth authentication flow is currently disabled due to security concerns
*   (only static bearer tokens are supported)
*
* Connection Management:
* - Agents send notifications/cancelled when done, triggering immediate SSE closure
* - 30-second timeout ensures workers are freed even if agents forget to disconnect
* - Heartbeat comments (every 10s) help proxies and connection_aborted() detect dead sockets
* - Both the mcp.js relay and direct agent connections work reliably
*/

class Meow_MWAI_Labs_MCP {
  private $core = null;
  private $namespace = 'mcp/v1';
  private $server_version = '0.0.1';
  private $protocol_version = '2025-06-18'; // Updated to match official MCP SDK
  private $queue_key = 'mwai_mcp_msg';
  private $session_id = null;
  private $logging = false;
  private $last_action_time = 0;
  private $bearer_token = null;
  // Placeholder for OAuth integration. Currently unused and kept for
  // future implementation once the security model is revised.
  private $oauth = null;

  #region Initialize
  public function __construct( $core ) {
    $this->core = $core;

    // Set logging based on option
    $this->logging = $this->core->get_option( 'mcp_debug_mode', false );

    // OAuth support is temporarily disabled due to security concerns.
    // The previous implementation allowed unvalidated redirect URIs which
    // introduced an open redirect vulnerability and the possibility to
    // steal authorization codes. Until proper client registration with
    // strict redirect URI validation is implemented, the OAuth feature is
    // not loaded. See labs/oauth.php for the previous code and take care
    // when re‑enabling it in the future.

    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
  }

  public function is_logging_enabled() {
    return $this->logging;
  }

  public function rest_api_init() {
    // Load bearer token if not already loaded
    if ( $this->bearer_token === null ) {
      $this->bearer_token = $this->core->get_option( 'mcp_bearer_token' );
    }

    // Only add filter once
    static $filter_added = false;
    if ( !empty( $this->bearer_token ) && !$filter_added ) {
      add_filter( 'mwai_allow_mcp', [ $this, 'auth_via_bearer_token' ], 10, 2 );
      $filter_added = true;
    }
    register_rest_route( $this->namespace, '/sse', [
      'methods' => [ 'GET', 'POST', 'HEAD' ],  // Support HEAD for client endpoint checks
      'callback' => [ $this, 'handle_sse' ],
      'permission_callback' => function ( $request ) {
        return $this->can_access_mcp( $request );
      },
    ] );

    register_rest_route( $this->namespace, '/messages', [
      'methods' => 'POST',
      'callback' => [ $this, 'handle_message' ],
      'permission_callback' => function ( $request ) {
        return $this->can_access_mcp( $request );
      },
    ] );

    // No-Auth URL endpoints (with token in path) - Legacy SSE
    $noauth_enabled = $this->core->get_option( 'mcp_noauth_url' );
    if ( $noauth_enabled && !empty( $this->bearer_token ) ) {
      register_rest_route( $this->namespace, '/' . $this->bearer_token . '/sse', [
        'methods' => 'GET',
        'callback' => [ $this, 'handle_sse' ],
        'permission_callback' => function ( $request ) {
          return $this->handle_noauth_access( $request );
        },
        'show_in_index' => false,
      ] );

      register_rest_route( $this->namespace, '/' . $this->bearer_token . '/sse', [
        'methods' => 'POST',
        'callback' => [ $this, 'handle_sse' ],
        'permission_callback' => function ( $request ) {
          return $this->handle_noauth_access( $request );
        },
        'show_in_index' => false,
      ] );

      register_rest_route( $this->namespace, '/' . $this->bearer_token . '/messages', [
        'methods' => 'POST',
        'callback' => [ $this, 'handle_message' ],
        'permission_callback' => function ( $request ) {
          return $this->handle_noauth_access( $request );
        },
        'show_in_index' => false,
      ] );
    }

    // Streamable HTTP endpoint (Modern transport for Claude Code)
    // Uses Authorization: Bearer header for authentication
    // Automatically enabled when MCP module is active and bearer token is set
    if ( !empty( $this->bearer_token ) ) {
      // Main endpoint with Authorization header (at /http path)
      register_rest_route( $this->namespace, '/http', [
        'methods' => [ 'GET', 'POST', 'DELETE' ],
        'callback' => [ $this, 'handle_streamable_http' ],
        'permission_callback' => function ( $request ) {
          return $this->can_access_mcp( $request );
        },
        'show_in_index' => false,
      ] );

      // Alternative endpoint with token in URL (for clients that don't support headers)
      register_rest_route( $this->namespace, '/' . $this->bearer_token, [
        'methods' => [ 'GET', 'POST', 'DELETE' ],
        'callback' => [ $this, 'handle_streamable_http' ],
        'permission_callback' => function ( $request ) {
          return $this->handle_noauth_access_streamable( $request );
        },
        'show_in_index' => false,
      ] );
    }

    // File upload endpoint for wp_upload_request
    // Uses a one-time token in the URL for authentication (no bearer header needed from curl)
    register_rest_route( $this->namespace, '/upload/(?P<token>[a-zA-Z0-9]+)', [
      'methods' => 'POST',
      'callback' => [ $this, 'handle_upload' ],
      'permission_callback' => '__return_true',
      'show_in_index' => false,
    ] );
  }
  #endregion

  #region Auth (Bearer token)
  /**
  * SECURITY: MCP provides powerful WordPress management capabilities, so access must be strictly controlled.
  *
  * By default, only administrators can access MCP endpoints. This prevents lower-privileged users
  * (subscribers, contributors, etc.) from executing dangerous operations like creating admin users,
  * deleting content, or modifying settings.
  *
  * When a bearer token is configured, it overrides the default admin check, but access is DENIED
  * unless a valid token is provided. This ensures MCP is secure even with default settings.
  */
  public function can_access_mcp( $request ) {
    // Default to requiring administrator capability for security
    $is_admin = current_user_can( 'administrator' );
    return apply_filters( 'mwai_allow_mcp', $is_admin, $request );
  }

  public function auth_via_bearer_token( $allow, $request ) {
    // Skip if already authenticated as admin
    if ( $allow ) {
      return $allow;
    }

    $hdr = $request->get_header( 'authorization' );

    // If no authorization header but bearer token is configured, deny access
    if ( !$hdr && !empty( $this->bearer_token ) ) {
      if ( $this->logging ) {
        error_log( '[AI Engine MCP] ❌ No authorization header provided. Server may be stripping headers.' );
      }
      return false;
    }

    // Check for Bearer token in header
    if ( $hdr && preg_match( '/Bearer\s+(.+)/i', $hdr, $m ) ) {
      $token = trim( $m[1] );
      $auth_result = 'none';

      // Check if it's an OAuth token
      if ( $this->oauth ) {
        $token_data = $this->oauth->validate_token( $token );
        if ( $token_data ) {
          // Set current user based on OAuth token
          wp_set_current_user( $token_data['user_id'] );
          $auth_result = 'oauth';
          // Only log auth for SSE endpoint
          if ( $this->logging && strpos( $request->get_route(), '/sse' ) !== false ) {
            error_log( '[AI Engine MCP] 🔐 OAuth OK (user: ' . $token_data['user_id'] . ')' );
          }
          return true;
        }
      }

      // Fall back to static bearer token if configured
      if ( !empty( $this->bearer_token ) && hash_equals( $this->bearer_token, $token ) ) {
        if ( $admin = $this->core->get_admin_user() ) {
          wp_set_current_user( $admin->ID, $admin->user_login );
        }
        $auth_result = 'static';
        if ( $this->logging ) {
          error_log( '[AI Engine MCP] 🔐 Bearer token auth OK' );
        }
        return true;
      }

      if ( $this->logging && $auth_result === 'none' ) {
        error_log( '[AI Engine MCP] ❌ Bearer token invalid.' );
      }
      // Explicitly deny access for invalid tokens
      return false;
    }

    // ?token=xyz fallback (optional) - only for static bearer token
    if ( !empty( $this->bearer_token ) ) {
      $q = sanitize_text_field( $request->get_param( 'token' ) );
      if ( $q && hash_equals( $this->bearer_token, $q ) ) {
        if ( $admin = $this->core->get_admin_user() ) {
          wp_set_current_user( $admin->ID, $admin->user_login );
        }
        return true;
      }
    }

    // If bearer token is configured but no valid auth provided, deny access
    if ( !empty( $this->bearer_token ) ) {
      return false;
    }

    return $allow;
  }

  public function handle_noauth_access( $request ) {
    // For no-auth URLs, the token is already verified by being in the URL path
    // Double-check that the route actually contains the token
    $route = $request->get_route();
    if ( strpos( $route, '/' . $this->bearer_token . '/' ) === false ) {
      if ( $this->logging ) {
        error_log( '[AI Engine MCP] ❌ Invalid no-auth URL access attempt.' );
      }
      return false;
    }

    // Set the current user to admin since token is valid
    if ( $admin = $this->core->get_admin_user() ) {
      wp_set_current_user( $admin->ID, $admin->user_login );
    }
    return true;
  }

  public function handle_noauth_access_streamable( $request ) {
    // For Streamable HTTP with token in URL path (no trailing slash)
    $route = $request->get_route();
    $expected = '/' . $this->namespace . '/' . $this->bearer_token;
    if ( $route !== $expected ) {
      if ( $this->logging ) {
        error_log( '[AI Engine MCP] ❌ Invalid Streamable HTTP no-auth URL access attempt.' );
      }
      return false;
    }

    // Set the current user to admin since token is valid
    if ( $admin = $this->core->get_admin_user() ) {
      wp_set_current_user( $admin->ID, $admin->user_login );
    }
    return true;
  }

  #endregion

  #region Helpers (log / JSON-RPC utils)
  private function log( $msg ) {
    // This method is for internal UI logs - keep it minimal
    if ( $this->logging ) {
      // Only log important messages to UI
      if ( strpos( $msg, 'queued' ) === false && strpos( $msg, 'flush' ) === false ) {
        Meow_MWAI_Logging::log( "[AI Engine MCP] {$msg}" );
      }
    }
  }

  /** Wrap a JSON-RPC error object */
  private function rpc_error( $id, int $code, string $msg, $extra = null ): array {
    $err = [ 'code' => $code, 'message' => $msg ];
    if ( $extra !== null ) {
      $err['data'] = $extra;
    }
    return [ 'jsonrpc' => '2.0', 'id' => $id, 'error' => $err ];
  }

  /** Queue an error for SSE delivery */
  private function queue_error( $sess, $id, int $code, string $msg, $extra = null ): void {
    $this->store_message( $sess, $this->rpc_error( $id, $code, $msg, $extra ) );
  }

  /** Format tool result for MCP protocol */
  private function format_tool_result( $result ): array {
    // If result is a string, wrap it in the MCP content format
    if ( is_string( $result ) ) {
      return [
        'content' => [
          [
            'type' => 'text',
            'text' => $result,
          ],
        ],
      ];
    }

    // If result has 'content' key, assume it's already properly formatted
    if ( is_array( $result ) && isset( $result['content'] ) ) {
      return $result;
    }

    // If result is an array without 'content' key, wrap it as JSON
    if ( is_array( $result ) ) {
      return [
        'content' => [
          [
            'type' => 'text',
            'text' => wp_json_encode( $result, JSON_PRETTY_PRINT ),
          ],
        ],
        'data' => $result,
      ];
    }

    // For any other type, convert to string and wrap
    return [
      'content' => [
        [
          'type' => 'text',
          'text' => (string) $result,
        ],
      ],
    ];
  }
  #endregion

  #region Handle direct JSON-RPC (for Claude's MCP client)
  /**
  * Claude's MCP client (via Anthropic API) sends JSON-RPC requests directly to the SSE endpoint
  * as POST requests, rather than following the typical SSE flow:
  * - Normal flow: GET /sse → establish SSE stream → POST /messages for JSON-RPC
  * - Claude's flow: POST /sse with JSON-RPC body → expect immediate JSON response
  *
  * This method handles the direct JSON-RPC requests to maintain compatibility with Claude.
  */
  private function handle_direct_jsonrpc( WP_REST_Request $request, $data ) {
    $id = $data['id'] ?? null;
    $method = $data['method'] ?? null;

    if ( json_last_error() !== JSON_ERROR_NONE ) {
      $response = new WP_REST_Response( [
        'jsonrpc' => '2.0',
        'id' => null,
        'error' => [ 'code' => -32700, 'message' => 'Parse error: invalid JSON' ]
      ], 200 );
      $response->set_headers( [ 'Content-Type' => 'application/json' ] );
      $session_header = $request->get_header( 'mcp-session-id' );
      if ( !empty( $session_header ) ) {
        return $this->attach_session_header( $response, sanitize_text_field( $session_header ) );
      }
      return $response;
    }

    if ( !is_array( $data ) || !$method ) {
      $response = new WP_REST_Response( [
        'jsonrpc' => '2.0',
        'id' => $id,
        'error' => [ 'code' => -32600, 'message' => 'Invalid Request' ]
      ], 200 );
      $response->set_headers( [ 'Content-Type' => 'application/json' ] );
      $session_header = $request->get_header( 'mcp-session-id' );
      if ( !empty( $session_header ) ) {
        return $this->attach_session_header( $response, sanitize_text_field( $session_header ) );
      }
      return $response;
    }

    $session_header = $request->get_header( 'mcp-session-id' );
    $session_id = '';
    if ( !empty( $session_header ) ) {
      $session_id = sanitize_text_field( $session_header );
    }

    if ( $method === 'initialize' || empty( $session_id ) ) {
      $session_id = wp_generate_uuid4();
      if ( $this->logging ) {
        error_log( '[AI Engine MCP] 🆔 Direct session initialized: ' . $session_id );
      }
    }

    try {
      $reply = null;

      switch ( $method ) {
        case 'initialize':
          // Check if client requests a specific protocol version
          $params = $data['params'] ?? [];
          $requested_version = $params['protocolVersion'] ?? null;
          $client_info = $params['clientInfo'] ?? null;

          if ( $this->logging && $client_info ) {
            $client_name = $client_info['name'] ?? 'unknown';
            $client_version = $client_info['version'] ?? 'unknown';
            error_log( "[AI Engine MCP] Client: {$client_name} v{$client_version}" );
          }

          if ( $requested_version && $requested_version !== $this->protocol_version ) {
            if ( $this->logging ) {
              Meow_MWAI_Logging::warn( "[AI Engine MCP] Client requested protocol version {$requested_version}, but we only support {$this->protocol_version}" );
            }
          }

          $reply = [
            'jsonrpc' => '2.0',
            'id' => $id,
            'result' => [
              'protocolVersion' => $this->protocol_version,
              'serverInfo' => (object) [
                'name' => 'AI Engine - ' . get_bloginfo( 'name' ),
                'version' => $this->server_version,
              ],
              'capabilities' => (object) [
                'tools' => new stdClass(),  // Empty object, matching official SDK
              ],
            ],
          ];
          break;

        case 'tools/list':
          $tools = $this->get_tools_list();

          // Debug logging for tools/list
          if ( $this->logging ) {
            $user_agent = isset( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : 'unknown';
            error_log( '[AI Engine MCP Direct] 📋 tools/list requested by: ' . $user_agent );
            error_log( '[AI Engine MCP Direct] 📊 Returning ' . count( $tools ) . ' tools' );
            if ( count( $tools ) > 0 ) {
              $tool_names = array_column( $tools, 'name' );
              error_log( '[AI Engine MCP Direct] 🛠️ Tool names: ' . implode( ', ', $tool_names ) );
            }
            else {
              error_log( '[AI Engine MCP Direct] ⚠️ WARNING: No tools returned!' );
            }
          }

          $reply = [
            'jsonrpc' => '2.0',
            'id' => $id,
            'result' => [ 'tools' => $tools ],
          ];
          break;

        case 'tools/call':
          $params = $data['params'] ?? [];
          $tool = $params['name'] ?? '';
          $arguments = $params['arguments'] ?? [];

          if ( $this->logging ) {
            error_log( '[AI Engine MCP Direct] 🔧 tools/call - Tool: ' . $tool );
            error_log( '[AI Engine MCP Direct] 🔧 tools/call - Arguments: ' . wp_json_encode( $arguments ) );
          }

          try {
            $reply = $this->execute_tool( $tool, $arguments, $id );
            if ( $this->logging ) {
              error_log( '[AI Engine MCP Direct] ✅ tools/call - Success for tool: ' . $tool );
            }
          }
          catch ( Exception $e ) {
            if ( $this->logging ) {
              error_log( '[AI Engine MCP Direct] ❌ tools/call - Error: ' . $e->getMessage() );
            }
            throw $e;
          }
          break;

        case 'notifications/initialized':
          // This is a notification from the client indicating it has initialized
          // No response needed for notifications
          // Client initialized - no need to log
          return $this->attach_session_header( new WP_REST_Response( null, 204 ), $session_id );
          break;

        default:
          // Check if it's a notification (no id)
          if ( $id === null && strpos( $method, 'notifications/' ) === 0 ) {
            if ( $this->logging ) {
              error_log( '[AI Engine MCP] 📨 Notification received: ' . $method );
            }
            return $this->attach_session_header( new WP_REST_Response( null, 204 ), $session_id );
          }

          $reply = [
            'jsonrpc' => '2.0',
            'id' => $id,
            'error' => [ 'code' => -32601, 'message' => "Method not found: {$method}" ]
          ];
      }

      // Ensure proper JSON-RPC response
      $response = new WP_REST_Response( $reply, 200 );
      $response->set_headers( [ 'Content-Type' => 'application/json' ] );
      return $this->attach_session_header( $response, $session_id );

    }
    catch ( Exception $e ) {
      if ( $this->logging ) {
        error_log( '[AI Engine MCP] ❌ Exception in handle_direct_jsonrpc: ' . $e->getMessage() );
      }

      $error_response = new WP_REST_Response( [
        'jsonrpc' => '2.0',
        'id' => $id,
        'error' => [ 'code' => -32603, 'message' => 'Internal error', 'data' => $e->getMessage() ]
      ], 200 );
      $error_response->set_headers( [ 'Content-Type' => 'application/json' ] );
      return $this->attach_session_header( $error_response, $session_id );
    }
  }
  #endregion

  #region Handle SSE (stream loop)
  private function reply( string $event, $data = null, string $enc = 'json' ) {
    // Handle special events
    if ( $event === 'bye' ) {
      echo "event: bye\ndata: \n\n";
      if ( ob_get_level() ) {
        ob_end_flush();
      }
      flush();
      $this->last_action_time = time();
      $this->log( 'Clean disconnection' );
      return;
    }

    if ( $enc === 'json' && $data === null ) {
      $this->log( "no data for {$event}" );
      return;
    }
    echo "event: {$event}\n";
    if ( $enc === 'json' ) {
      $data = $data === null ? '{}' : wp_json_encode( $data, JSON_UNESCAPED_UNICODE );
    }
    echo 'data: ' . $data . "\n\n";

    if ( ob_get_level() ) {
      ob_end_flush();
    }
    flush();

    $this->last_action_time = time();
    // Only log endpoint announcements
    if ( $event === 'endpoint' ) {
      $this->log( 'SSE endpoint ready' );
    }
  }

  private function generate_sse_id( $req ) {
    $last = $req ? $req->get_header( 'last-event-id' ) : '';
    return $last ?: str_replace( '-', '', wp_generate_uuid4() );
  }

  private function attach_session_header( WP_REST_Response $response, string $session_id ) {
    if ( empty( $session_id ) ) {
      return $response;
    }

    $response->header( 'Mcp-Session-Id', $session_id );

    if ( $this->logging ) {
      error_log( '[AI Engine MCP] 🪪 Response session header: ' . $session_id );
    }

    return $response;
  }

  public function handle_sse( WP_REST_Request $request ) {
    // Handle HEAD request - just confirm endpoint exists
    if ( $request->get_method() === 'HEAD' ) {
      return new WP_REST_Response( null, 200, [
        'Content-Type' => 'text/event-stream',
        'Cache-Control' => 'no-cache',
      ] );
    }

    $raw_body = $request->get_body();

    // Handle POST request with JSON-RPC body (Direct MCP client behavior)
    // Both Claude.ai and OpenAI/ChatGPT send JSON-RPC requests directly to the SSE endpoint
    // instead of establishing an SSE connection first. This is non-standard but we need to support it.
    // Expected flow: GET /sse (establish stream) → POST /messages (send JSON-RPC)
    // Actual flow: POST /sse with JSON-RPC body → expects immediate JSON response
    if ( $request->get_method() === 'POST' && !empty( $raw_body ) ) {
      $data = json_decode( $raw_body, true );
      if ( $data && isset( $data['method'] ) ) {
        // Don't log here - it's already logged by log_requests()
        // Process as a direct JSON-RPC request instead of starting SSE stream
        return $this->handle_direct_jsonrpc( $request, $data );
      }
    }

    @ini_set( 'zlib.output_compression', '0' );
    @ini_set( 'output_buffering', '0' );
    @ini_set( 'implicit_flush', '1' );
    if ( function_exists( 'ob_implicit_flush' ) ) {
      ob_implicit_flush( true );
    }

    header( 'Content-Type: text/event-stream' );
    header( 'Cache-Control: no-cache' );
    header( 'X-Accel-Buffering: no' );
    header( 'Connection: keep-alive' );
    while ( ob_get_level() ) {
      ob_end_flush();
    }

    /* — greet client —*/
    $this->session_id = $this->generate_sse_id( $request );
    $this->last_action_time = time();
    echo "id: {$this->session_id}\n\n";
    flush();

    $msg_uri = sprintf(
      '%s/messages?session_id=%s',
      rest_url( $this->namespace ),
      $this->session_id
    );
    $this->reply( 'endpoint', $msg_uri, 'text' );
    if ( $this->logging ) {
      error_log( '[AI Engine MCP] ✅ SSE connected (' . substr( $this->session_id, 0, 8 ) . '...)' );
    }

    /* — main loop —*/
    while ( true ) {
      // Reduced timeout to free workers faster when agents disconnect
      $max_time = $this->logging ? 30 : 60 * 3; // 30 seconds in debug, 3 minutes in production
      $idle = ( time() - $this->last_action_time ) >= $max_time;
      if ( connection_aborted() || $idle ) {
        $this->reply( 'bye' );
        if ( $this->logging ) {
          error_log( '[AI Engine MCP] 🔚 SSE closed (' . ( $idle ? 'idle' : 'abort' ) . ')' );
        }
        break;
      }

      // Send heartbeat every 10 seconds to detect dead connections
      $time_since_last = time() - $this->last_action_time;
      if ( $time_since_last >= 10 && $time_since_last % 10 === 0 ) {
        echo ": heartbeat\n\n";
        if ( ob_get_level() ) {
          ob_end_flush();
        }
        flush();
      }

      foreach ( $this->fetch_messages( $this->session_id ) as $p ) {
        // Check for kill signal in the message queue
        if ( isset( $p['method'] ) && $p['method'] === 'mwai/kill' ) {
          if ( $this->logging ) {
            error_log( '[AI Engine MCP] Kill signal - terminating' );
          }
          $this->reply( 'bye' );
          exit;
        }

        // Don't log SSE responses - they clutter the logs
        $this->reply( 'message', $p );
      }

      usleep( 200000 ); // 200 ms
    }
    exit;
  }
  #endregion

  #region Handle Streamable HTTP (Modern MCP transport)
  /**
   * Handle Streamable HTTP requests per MCP specification.
   * This is the modern transport used by Claude Code and other MCP clients.
   *
   * - POST: Send JSON-RPC request, receive JSON response (or SSE for streaming)
   * - GET: Open SSE stream for server-initiated messages
   * - DELETE: Terminate the session
   *
   * @see https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http
   */
  public function handle_streamable_http( WP_REST_Request $request ) {
    $method = $request->get_method();

    switch ( $method ) {
      case 'POST':
        return $this->handle_streamable_http_post( $request );

      case 'GET':
        return $this->handle_streamable_http_get( $request );

      case 'DELETE':
        return $this->handle_streamable_http_delete( $request );

      default:
        return new WP_REST_Response( [
          'error' => 'Method not allowed'
        ], 405 );
    }
  }

  /**
   * Handle POST requests for Streamable HTTP.
   * This processes JSON-RPC requests and returns JSON responses.
   */
  private function handle_streamable_http_post( WP_REST_Request $request ) {
    $raw_body = $request->get_body();

    if ( empty( $raw_body ) ) {
      return new WP_REST_Response( [
        'jsonrpc' => '2.0',
        'id' => null,
        'error' => [ 'code' => -32700, 'message' => 'Parse error: empty body' ]
      ], 400 );
    }

    $data = json_decode( $raw_body, true );

    if ( json_last_error() !== JSON_ERROR_NONE ) {
      return new WP_REST_Response( [
        'jsonrpc' => '2.0',
        'id' => null,
        'error' => [ 'code' => -32700, 'message' => 'Parse error: invalid JSON' ]
      ], 400 );
    }

    // Log the request if debugging is enabled
    if ( $this->logging && isset( $data['method'] ) ) {
      error_log( '[AI Engine MCP HTTP] ↓ ' . $data['method'] );
    }

    // Reuse the existing direct JSON-RPC handler
    return $this->handle_direct_jsonrpc( $request, $data );
  }

  /**
   * Handle GET requests for Streamable HTTP.
   * This opens an SSE stream for server-to-client messages.
   * Used when the server needs to send notifications or progress updates.
   */
  private function handle_streamable_http_get( WP_REST_Request $request ) {
    // Check Accept header - must accept text/event-stream
    $accept = $request->get_header( 'accept' );
    if ( strpos( $accept, 'text/event-stream' ) === false ) {
      return new WP_REST_Response( [
        'error' => 'Accept header must include text/event-stream'
      ], 406 );
    }

    // Get or create session ID
    $session_header = $request->get_header( 'mcp-session-id' );
    $session_id = !empty( $session_header ) ? sanitize_text_field( $session_header ) : wp_generate_uuid4();

    if ( $this->logging ) {
      error_log( '[AI Engine MCP HTTP] 📡 SSE stream opened for session: ' . substr( $session_id, 0, 8 ) . '...' );
    }

    // Set up SSE output
    @ini_set( 'zlib.output_compression', '0' );
    @ini_set( 'output_buffering', '0' );
    @ini_set( 'implicit_flush', '1' );
    if ( function_exists( 'ob_implicit_flush' ) ) {
      ob_implicit_flush( true );
    }

    header( 'Content-Type: text/event-stream' );
    header( 'Cache-Control: no-cache' );
    header( 'X-Accel-Buffering: no' );
    header( 'Connection: keep-alive' );
    header( 'Mcp-Session-Id: ' . $session_id );

    while ( ob_get_level() ) {
      ob_end_flush();
    }

    $this->session_id = $session_id;
    $this->last_action_time = time();

    // Send initial connection event
    echo "event: open\n";
    echo 'data: {"session":"' . esc_js( $session_id ) . "\"}\n\n";
    flush();

    // Main SSE loop - listen for server-initiated messages
    while ( true ) {
      $max_time = $this->logging ? 30 : 60 * 3;
      $idle = ( time() - $this->last_action_time ) >= $max_time;

      if ( connection_aborted() || $idle ) {
        if ( $this->logging ) {
          error_log( '[AI Engine MCP HTTP] 🔚 SSE closed (' . ( $idle ? 'idle' : 'abort' ) . ')' );
        }
        break;
      }

      // Check for queued messages
      foreach ( $this->fetch_messages( $session_id ) as $msg ) {
        if ( isset( $msg['method'] ) && $msg['method'] === 'mwai/kill' ) {
          echo "event: close\ndata: {}\n\n";
          flush();
          exit;
        }

        echo "event: message\n";
        echo 'data: ' . wp_json_encode( $msg, JSON_UNESCAPED_UNICODE ) . "\n\n";
        flush();
        $this->last_action_time = time();
      }

      // Heartbeat every 10 seconds
      $time_since_last = time() - $this->last_action_time;
      if ( $time_since_last >= 10 && $time_since_last % 10 === 0 ) {
        echo ": heartbeat\n\n";
        flush();
      }

      usleep( 200000 ); // 200ms
    }

    exit;
  }

  /**
   * Handle DELETE requests for Streamable HTTP.
   * This terminates the session and cleans up any resources.
   */
  private function handle_streamable_http_delete( WP_REST_Request $request ) {
    $session_header = $request->get_header( 'mcp-session-id' );

    if ( empty( $session_header ) ) {
      return new WP_REST_Response( [
        'error' => 'Mcp-Session-Id header required'
      ], 400 );
    }

    $session_id = sanitize_text_field( $session_header );

    if ( $this->logging ) {
      error_log( '[AI Engine MCP HTTP] 🗑️ Session terminated: ' . substr( $session_id, 0, 8 ) . '...' );
    }

    // Queue kill signal for any active SSE streams
    $this->store_message( $session_id, [
      'jsonrpc' => '2.0',
      'method' => 'mwai/kill'
    ] );

    // Clean up any remaining transients for this session
    global $wpdb;
    $like = $wpdb->esc_like( '_transient_' . "{$this->queue_key}_{$session_id}_" ) . '%';
    $wpdb->query(
      $wpdb->prepare(
        "DELETE FROM {$wpdb->options} WHERE option_name LIKE %s",
        $like
      )
    );

    // Return 204 No Content on successful termination
    return new WP_REST_Response( null, 204 );
  }
  #endregion

  #region Handle /messages (JSON-RPC ingress)
  public function handle_message( WP_REST_Request $request ) {
    $sess = sanitize_text_field( $request->get_param( 'session_id' ) );
    $raw = $request->get_body();
    $dat = json_decode( $raw, true );

    // Only log important methods in detail
    if ( $this->logging && $dat && isset( $dat['method'] ) ) {
      $method = $dat['method'];
      // Skip logging for repetitive/less important notifications
      if ( !in_array( $method, ['notifications/initialized', 'notifications/cancelled'] ) ) {
        error_log( '[AI Engine MCP] ↓ ' . $method );
      }
    }

    if ( json_last_error() !== JSON_ERROR_NONE ) {
      $this->queue_error( $sess, null, -32700, 'Parse error: invalid JSON' );
      return new WP_REST_Response( null, 204 );
    }
    if ( !is_array( $dat ) ) {
      $this->queue_error( $sess, null, -32600, 'Invalid Request' );
      return new WP_REST_Response( null, 204 );
    }

    $id = $dat['id'] ?? null;
    $method = $dat['method'] ?? null;

    /* — notifications —*/
    if ( $method === 'initialized' ) {
      return new WP_REST_Response( null, 204 );
    }
    if ( $method === 'notifications/cancelled' ) {
      // Agent finished - queue kill signal to close SSE immediately
      if ( $this->logging ) {
        error_log( '[AI Engine MCP] Agent cancelled - closing SSE connection' );
      }
      $this->store_message( $sess, [
        'jsonrpc' => '2.0',
        'method' => 'mwai/kill'
      ] );
      return new WP_REST_Response( null, 204 );
    }
    if ( $method === 'mwai/kill' ) {
      // Kill signal received - no need for verbose logging
      // Queue the kill message for SSE to pick up before exiting
      $this->store_message( $sess, [
        'jsonrpc' => '2.0',
        'method' => 'mwai/kill'
      ] );
      // Give it a moment to be stored
      usleep( 100000 ); // 100ms
      return new WP_REST_Response( null, 204 );
    }

    // It's a notification, no ID = no reply
    if ( $id === null && $method !== null ) {
      return new WP_REST_Response( null, 204 );
    }

    if ( !$method ) {
      $this->queue_error( $sess, $id, -32600, 'Invalid Request: method missing' );
      return new WP_REST_Response( null, 204 );
    }

    try {

      $reply = null;

      #region Methods switch
      switch ( $method ) {

        case 'initialize':
          // Check if client requests a specific protocol version
          $params = $dat['params'] ?? [];
          $requested_version = $params['protocolVersion'] ?? null;
          $client_info = $params['clientInfo'] ?? null;

          if ( $this->logging && $client_info ) {
            $client_name = $client_info['name'] ?? 'unknown';
            $client_version = $client_info['version'] ?? 'unknown';
            error_log( "[AI Engine MCP] Client: {$client_name} v{$client_version}" );
          }

          if ( $requested_version && $requested_version !== $this->protocol_version ) {
            if ( $this->logging ) {
              Meow_MWAI_Logging::warn( "[AI Engine MCP] Client requested protocol version {$requested_version}, but we only support {$this->protocol_version}" );
            }
          }

          $reply = [
            'jsonrpc' => '2.0',
            'id' => $id,
            'result' => [
              'protocolVersion' => $this->protocol_version,
              'serverInfo' => (object) [
                'name' => 'AI Engine - ' . get_bloginfo( 'name' ),
                'version' => $this->server_version,
              ],
              'capabilities' => (object) [
                'tools' => new stdClass(),  // Empty object, matching official SDK
              ],
            ],
          ];
          break;

        case 'tools/list':
          $tools = $this->get_tools_list();

          // Debug logging for tools/list
          if ( $this->logging ) {
            $user_agent = isset( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : 'unknown';
            error_log( '[AI Engine MCP] 📋 tools/list requested by: ' . $user_agent );
            error_log( '[AI Engine MCP] 📊 Returning ' . count( $tools ) . ' tools' );
            if ( count( $tools ) > 0 ) {
              $tool_names = array_column( $tools, 'name' );
              error_log( '[AI Engine MCP] 🛠️ Tool names: ' . implode( ', ', $tool_names ) );
            }
            else {
              error_log( '[AI Engine MCP] ⚠️ WARNING: No tools returned!' );
            }
          }

          $reply = [
            'jsonrpc' => '2.0',
            'id' => $id,
            'result' => [ 'tools' => $tools ],
          ];
          break;

        case 'resources/list':
          $reply = [
            'jsonrpc' => '2.0',
            'id' => $id,
            'result' => [ 'resources' => $this->get_resources_list() ],
          ];
          break;

        case 'prompts/list':
          $reply = [
            'jsonrpc' => '2.0',
            'id' => $id,
            'result' => [ 'prompts' => $this->get_prompts_list() ],
          ];
          break;

        case 'tools/call':
          $params = $dat['params'] ?? [];
          $tool = $params['name'] ?? '';
          $arguments = $params['arguments'] ?? [];

          if ( $this->logging ) {
            error_log( '[AI Engine MCP SSE] 🔧 tools/call - Tool: ' . $tool );
            error_log( '[AI Engine MCP SSE] 🔧 tools/call - Arguments: ' . wp_json_encode( $arguments ) );
          }

          try {
            $reply = $this->execute_tool( $tool, $arguments, $id );
            if ( $this->logging ) {
              error_log( '[AI Engine MCP SSE] ✅ tools/call - Success for tool: ' . $tool );
            }
          }
          catch ( Exception $e ) {
            if ( $this->logging ) {
              error_log( '[AI Engine MCP SSE] ❌ tools/call - Error: ' . $e->getMessage() );
            }
            throw $e;
          }
          break;

        default:
          $reply = $this->rpc_error( $id, -32601, "Method not found: {$method}" );
      }
      #endregion

      if ( $reply ) {
        // Don't log response queuing - it's too noisy
        $this->store_message( $sess, $reply );
      }

    }
    catch ( Exception $e ) {
      $this->queue_error( $sess, $id, -32603, 'Internal error', $e->getMessage() );
    }

    return new WP_REST_Response( null, 204 );
  }
  #endregion

  #region Tools Definitions
  private function get_tools_list() {
    $base_tools = [
      [
        'name' => 'mcp_ping',
        'description' => 'Simple connectivity check. Returns the current GMT time and the WordPress site name. Whenever a tool call fails (error or timeout), immediately invoke mcp_ping to verify the server; if mcp_ping itself does not respond, assume the server is temporarily unreachable and pause additional tool calls.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => (object) [],
          'required' => []
        ],
        'annotations' => [
          'readOnlyHint' => true,
          'destructiveHint' => false,
          'openWorldHint' => false,
        ],
      ],
    ];

    if ( $this->logging ) {
      error_log( '[AI Engine MCP] 🔧 get_tools_list() - Starting with ' . count( $base_tools ) . ' base tools' );
    }

    $filtered_tools = apply_filters( 'mwai_mcp_tools', $base_tools );

    if ( $this->logging ) {
      error_log( '[AI Engine MCP] 🔧 get_tools_list() - After filters: ' . count( $filtered_tools ) . ' tools' );
    }

    $normalized_tools = [];
    foreach ( $filtered_tools as $tool_index => $tool_definition ) {
      $normalized = $this->normalize_tool_definition( $tool_definition, $tool_index );
      if ( $normalized ) {
        $normalized_tools[] = $normalized;
      }
    }

    if ( $this->logging ) {
      error_log( '[AI Engine MCP] 🔧 get_tools_list() - Normalized tools: ' . count( $normalized_tools ) );
    }

    return $normalized_tools;
  }
  #endregion

  #region Resources Definitions
  private function get_resources_list() {
    return [];
  }
  #endregion

  #region Prompts Definitions
  private function get_prompts_list() {
    return [];
  }
  #endregion

  #region Tool Normalization Helpers
  private function normalize_tool_definition( $tool, $index ) {
    if ( !is_array( $tool ) ) {
      if ( $this->logging ) {
        error_log( '[AI Engine MCP] ⚠️ Tool definition at index ' . $index . ' skipped (expected array).' );
      }
      return null;
    }

    $name = isset( $tool['name'] ) ? trim( (string) $tool['name'] ) : '';
    if ( $name === '' ) {
      if ( $this->logging ) {
        error_log( '[AI Engine MCP] ⚠️ Tool skipped due to missing name at index ' . $index );
      }
      return null;
    }

    $normalized_schema = $this->normalize_input_schema( $tool['inputSchema'] ?? null, $name );
    if ( !$normalized_schema ) {
      if ( $this->logging ) {
        error_log( '[AI Engine MCP] ⚠️ Tool "' . $name . '" skipped due to invalid input schema.' );
      }
      return null;
    }

    $normalized = [
      'name' => $name,
      'inputSchema' => $normalized_schema,
    ];

    if ( isset( $tool['description'] ) && $tool['description'] !== '' ) {
      $normalized['description'] = wp_strip_all_tags( (string) $tool['description'] );
    }

    if ( isset( $tool['annotations'] ) && is_array( $tool['annotations'] ) ) {
      $annotations = $this->normalize_annotations( $tool['annotations'], $name );
      if ( !empty( $annotations ) ) {
        $normalized['annotations'] = $annotations;
      }
    }

    if ( isset( $tool['category'] ) ) {
      $normalized['annotations'] = $normalized['annotations'] ?? [];
      if ( empty( $normalized['annotations']['title'] ) ) {
        $normalized['annotations']['title'] = wp_strip_all_tags( (string) $tool['category'] );
      }
    }

    return $normalized;
  }

  private function normalize_input_schema( $schema, string $tool_name ) {
    if ( !is_array( $schema ) ) {
      return null;
    }

    $type = isset( $schema['type'] ) ? (string) $schema['type'] : 'object';
    if ( $type !== 'object' ) {
      if ( $this->logging ) {
        error_log( '[AI Engine MCP] ⚠️ Tool "' . $tool_name . '" has unsupported schema type: ' . $type );
      }
      return null;
    }

    $properties = [];
    if ( isset( $schema['properties'] ) && ( is_array( $schema['properties'] ) || is_object( $schema['properties'] ) ) ) {
      foreach ( (array) $schema['properties'] as $prop_name => $definition ) {
        if ( !is_array( $definition ) ) {
          $definition = [];
        }

        if ( isset( $definition['type'] ) ) {
          // Validate type definition
          if ( is_array( $definition['type'] ) ) {
            // Array of types (union types) - validate they're compatible with MCP clients
            $type_array = array_map( 'strval', $definition['type'] );

            // Check for complex types that need additional schema details
            $complex_types = array_intersect( $type_array, [ 'object', 'array' ] );
            if ( !empty( $complex_types ) ) {
              if ( $this->logging ) {
                error_log(
                  '[AI Engine MCP] ⚠️ Tool "' . $tool_name . '" property "' . $prop_name .
                  '" has problematic union type with complex types: [' . implode( ', ', $type_array ) .
                  ']. This breaks ChatGPT. Auto-fixing by removing type constraint.'
                );
              }
              // Auto-fix: Remove the type constraint to accept any value
              unset( $definition['type'] );
              // Keep description if present, or add one
              if ( !isset( $definition['description'] ) ) {
                $definition['description'] = 'Value can be of any type';
              }
            }
            else {
              $definition['type'] = $type_array;
            }
          }
          else {
            $definition['type'] = (string) $definition['type'];
          }
        }

        $properties[ $prop_name ] = $definition;
      }
    }

    $required = [];
    if ( isset( $schema['required'] ) && is_array( $schema['required'] ) ) {
      foreach ( $schema['required'] as $field ) {
        $field_name = trim( (string) $field );
        if ( $field_name !== '' ) {
          $required[] = $field_name;
        }
      }
      $required = array_values( array_unique( $required ) );
    }

    $normalized = [
      'type' => 'object',
      'properties' => empty( $properties ) ? new stdClass() : $properties,
    ];

    if ( !empty( $required ) ) {
      $normalized['required'] = $required;
    }

    if ( array_key_exists( 'additionalProperties', $schema ) ) {
      $normalized['additionalProperties'] = (bool) $schema['additionalProperties'];
    }

    return $normalized;
  }

  private function normalize_annotations( array $annotations, string $tool_name ): array {
    $allowed_keys = [ 'title', 'readOnlyHint', 'destructiveHint', 'idempotentHint', 'openWorldHint' ];
    $normalized = [];

    foreach ( $annotations as $key => $value ) {
      if ( !in_array( $key, $allowed_keys, true ) ) {
        continue;
      }

      if ( in_array( $key, [ 'readOnlyHint', 'destructiveHint', 'idempotentHint', 'openWorldHint' ], true ) ) {
        $normalized[ $key ] = (bool) $value;
      }
      elseif ( $key === 'title' ) {
        $normalized['title'] = wp_strip_all_tags( (string) $value );
      }
    }

    if ( empty( $normalized ) && $this->logging && !empty( $annotations ) ) {
      error_log( '[AI Engine MCP] 🔎 Tool "' . $tool_name . '" included unsupported annotation keys.' );
    }

    return $normalized;
  }
  #endregion

  #region Tools Call (execute_tool)
  private function execute_tool( $tool, $args, $id ) {
    try {
      // Handle built-in tools first
      if ( $tool === 'mcp_ping' ) {
        if ( $this->logging ) {
          $this->log( '🛠️ Tool: mcp_ping' );
        }
        $ping_data = [
          'time' => gmdate( 'Y-m-d H:i:s' ),
          'name' => get_bloginfo( 'name' ),
        ];
        return [
          'jsonrpc' => '2.0',
          'id' => $id,
          'result' => [
            'content' => [
              [
                'type' => 'text',
                'text' => 'Ping successful: ' . wp_json_encode( $ping_data, JSON_PRETTY_PRINT ),
              ],
            ],
            'data' => $ping_data,
          ],
        ];
      }

      // Let other modules handle their tools
      if ( $this->logging ) {
        // Log tool calls with more context
        $args_preview = '';
        if ( !empty( $args ) ) {
          // Show key args for common tools
          if ( isset( $args['ID'] ) ) {
            $args_preview = ' (ID: ' . $args['ID'] . ')';
          }
          elseif ( isset( $args['query'] ) ) {
            $args_preview = ' (query: "' . substr( $args['query'], 0, 30 ) . '...")';
          }
          elseif ( isset( $args['message'] ) ) {
            $args_preview = ' (message: "' . substr( $args['message'], 0, 30 ) . '...")';
          }
        }
        // Log to both error log and UI
        error_log( '[AI Engine MCP] 🛠️ ' . $tool . $args_preview );
        $this->log( '🛠️ Tool: ' . $tool . $args_preview );
      }
      $filtered = apply_filters( 'mwai_mcp_callback', null, $tool, $args, $id, $this );

      if ( $filtered !== null ) {
        // Check if it's already a full JSON-RPC response (backward compatibility)
        if ( is_array( $filtered ) && isset( $filtered['jsonrpc'] ) && isset( $filtered['id'] ) ) {
          return $filtered;
        }

        // Otherwise, wrap the result in proper JSON-RPC format
        return [
          'jsonrpc' => '2.0',
          'id' => $id,
          'result' => $this->format_tool_result( $filtered ),
        ];
      }

      throw new Exception( "Unknown tool: {$tool}" );
    }
    catch ( Exception $e ) {
      return $this->rpc_error( $id, -32603, $e->getMessage() );
    }
  }
  #endregion

  #region Handle /upload (one-time file upload via token)
  public function handle_upload( WP_REST_Request $request ) {
    $token = $request->get_param( 'token' );
    if ( empty( $token ) ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Missing token.' ], 400 );
    }

    $transient_key = 'mwai_mcp_upload_' . $token;
    $data = get_transient( $transient_key );
    if ( empty( $data ) ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Invalid or expired upload token.' ], 403 );
    }

    // Immediately delete the transient so the token can only be used once
    delete_transient( $transient_key );

    $files = $request->get_file_params();
    if ( empty( $files['file'] ) ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'No file provided. Use: curl -X POST -F "file=@/path/to/file" "<url>"' ], 400 );
    }

    $uploaded = $files['file'];
    if ( $uploaded['error'] !== UPLOAD_ERR_OK ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Upload error code: ' . $uploaded['error'] ], 400 );
    }

    // Set admin context for media handling
    if ( !current_user_can( 'administrator' ) ) {
      wp_set_current_user( 1 );
    }

    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';
    require_once ABSPATH . 'wp-admin/includes/image.php';

    // Use the filename from the transient (sanitized at creation time)
    $file = [
      'name' => $data['filename'],
      'tmp_name' => $uploaded['tmp_name'],
    ];

    $attachment_id = media_handle_sideload( $file, 0, $data['description'] );
    if ( is_wp_error( $attachment_id ) ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $attachment_id->get_error_message() ], 500 );
    }

    if ( !empty( $data['title'] ) ) {
      wp_update_post( [ 'ID' => $attachment_id, 'post_title' => sanitize_text_field( $data['title'] ) ] );
    }
    if ( !empty( $data['alt'] ) ) {
      update_post_meta( $attachment_id, '_wp_attachment_image_alt', sanitize_text_field( $data['alt'] ) );
    }

    return new WP_REST_Response( [
      'success' => true,
      'attachment_id' => $attachment_id,
      'url' => wp_get_attachment_url( $attachment_id ),
    ], 200 );
  }
  #endregion

  #region Message Queue (per-message transient)
  private function transient_key( $sess, $id ) {
    return "{$this->queue_key}_{$sess}_{$id}";
  }

  private function store_message( $sess, $payload ) {
    if ( !$sess ) {
      return;
    }
    $idKey = array_key_exists( 'id', $payload ) ? ( $payload['id'] ?? 'NULL' ) : 'N/A';
    set_transient( $this->transient_key( $sess, $idKey ), $payload, 30 );
    $this->log( "queued #{$idKey}" );
  }

  private function fetch_messages( $sess ) {
    global $wpdb;
    $like = $wpdb->esc_like( '_transient_' . "{$this->queue_key}_{$sess}_" ) . '%';

    $rows = $wpdb->get_results(
      $wpdb->prepare(
        "SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE %s",
        $like
      ),
      ARRAY_A
    );

    $msgs = [];
    foreach ( $rows as $r ) {
      $msgs[] = maybe_unserialize( $r['option_value'] );
      delete_option( $r['option_name'] );
    }
    usort( $msgs, fn ( $a, $b ) => ( $a['id'] ?? 0 ) <=> ( $b['id'] ?? 0 ) );
    if ( $msgs ) {
      $this->log( 'flush ' . count( $msgs ) . ' msg(s)' );
    }
    return $msgs;
  }
  #endregion

  #region Resources (note)
  /*--------------------------------------------------*/
  /**
  * MCP also supports “resources” – static or dynamic data a client can
  * retrieve by URL (e.g. `mcp://resource/posts/123`).
  */
  #endregion
}
