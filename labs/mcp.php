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
  private $protocol_version = '2025-06-18';
  private $supported_protocol_versions = [ '2024-11-05', '2025-06-18' ];
  private $queue_key = 'mwai_mcp_msg';
  private $session_id = null;
  private $logging = false;
  private $last_action_time = 0;
  private $bearer_token = null;
  private $mcp_role = 'admin';
  private $tool_access_levels = [];
  // Placeholder for OAuth integration. Currently unused and kept for
  // future implementation once the security model is revised.
  private $oauth = null;
  // Resolved during auth so the MCP Logs feature can attribute tool calls
  // to a specific connector (Claude, ChatGPT, Claude Code, …) or 'bearer'.
  // Lives on the instance for the duration of one HTTP request.
  private $auth_client_id = null;
  private $auth_client_name = null;
  private $auth_method = null; // 'oauth' | 'bearer' | null

  #region Initialize
  public function __construct( $core ) {
    $this->core = $core;

    // Set logging based on option
    $this->logging = $this->core->get_option( 'mcp_debug_mode', false );

    // OAuth 2.1 with Dynamic Client Registration. Lives alongside the bearer
    // token: bearer is for dev tools (Claude Code, scripts), OAuth is for
    // browser-driven clients like Claude Desktop. The new module enforces
    // strict redirect_uri matching, PKCE S256, and refresh-token rotation.
    require_once __DIR__ . '/mcp-oauth.php';
    $this->oauth = new Meow_MWAI_Labs_MCP_OAuth( $core, $this );

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
    $this->mcp_role = $this->core->get_option( 'mcp_role', 'admin' );

    // Auth filter runs for both bearer token and OAuth token paths; register
    // unconditionally so that OAuth-only deployments (no static bearer set) work.
    static $filter_added = false;
    if ( !$filter_added ) {
      add_filter( 'mwai_allow_mcp', [ $this, 'auth_via_bearer_token' ], 10, 2 );
      $filter_added = true;
    }

    // Extend the CORS allow-headers list for our MCP routes. The Streamable HTTP
    // transport sends Mcp-Protocol-Version and Mcp-Session-Id on every request;
    // WP core's default allow-list does not include them, so the browser-side
    // preflight from claude.ai (and similar web connectors) was rejecting the
    // actual POST and the client reported "Couldn't reach the MCP server".
    add_filter( 'rest_allowed_cors_headers', function ( $headers ) {
      $uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) $_SERVER['REQUEST_URI'] : '';
      if ( strpos( $uri, '/' . $this->namespace . '/' ) === false ) {
        return $headers;
      }
      foreach ( [ 'Mcp-Protocol-Version', 'Mcp-Session-Id', 'Accept' ] as $h ) {
        if ( !in_array( $h, $headers, true ) ) {
          $headers[] = $h;
        }
      }
      return $headers;
    } );

    // Streamable HTTP endpoint (modern MCP transport). Always registered when
    // the MCP module is enabled — auth is enforced by can_access_mcp(), which
    // accepts either a bearer token or an OAuth access token.
    register_rest_route( $this->namespace, '/http', [
      'methods' => [ 'GET', 'POST', 'DELETE' ],
      'callback' => [ $this, 'handle_streamable_http' ],
      'permission_callback' => function ( $request ) {
        return $this->can_access_mcp( $request );
      },
      'show_in_index' => false,
    ] );

    // Alternative endpoint with bearer token embedded in URL path, for clients
    // that cannot send Authorization headers. Only registered when a bearer
    // token is configured. The token is high-entropy (wp_generate_password),
    // compared with hash_equals, and the route is hidden (show_in_index=false).
    // Kept because Claude Code and other MCP connectors currently work more
    // reliably this way when proxies strip the Authorization header.
    // TODO: Re-evaluate after 2026-12-27. Check whether connectors still need
    // the URL-token fallback, or if header/OAuth auth has become reliable enough
    // to deprecate it (flagged by WP.org automated security review, Jun 2026).
    if ( !empty( $this->bearer_token ) ) {
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
          // Defense in depth: even if a token was issued (or stored from before
          // the authorize-time admin gate landed), only accept it if the linked
          // user still holds administrator capability. Otherwise a Subscriber's
          // OAuth token would inherit the global mcp_role and reach admin tools.
          if ( !$this->oauth->user_can_authorize( $token_data['user_id'] ) ) {
            if ( $this->logging ) {
              error_log( '[AI Engine MCP] ❌ OAuth token rejected: user ' . $token_data['user_id'] . ' is not an administrator.' );
            }
            return false;
          }
          // Set current user based on OAuth token
          wp_set_current_user( $token_data['user_id'] );
          $auth_result = 'oauth';
          $this->auth_method = 'oauth';
          $this->auth_client_id = $token_data['client_id'] ?? null;
          $this->auth_client_name = $token_data['client_name'] ?? null;
          return true;
        }
      }

      // Fall back to static bearer token if configured
      if ( !empty( $this->bearer_token ) && hash_equals( $this->bearer_token, $token ) ) {
        if ( $admin = $this->core->get_admin_user() ) {
          wp_set_current_user( $admin->ID, $admin->user_login );
        }
        $auth_result = 'static';
        $this->auth_method = 'bearer';
        $this->auth_client_id = 'bearer';
        $this->auth_client_name = null;
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
        $this->auth_method = 'bearer';
        $this->auth_client_id = 'bearer';
        return true;
      }
    }

    // If bearer token is configured but no valid auth provided, deny access
    if ( !empty( $this->bearer_token ) ) {
      return false;
    }

    return $allow;
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
    $this->auth_method = 'bearer';
    $this->auth_client_id = 'bearer';
    return true;
  }

  #endregion

  #region Helpers (log / JSON-RPC utils)
  /**
   * Release the PHP session lock as early as possible. Long MCP calls (e.g. content
   * mutations on large posts) can otherwise serialize behind any other request from the
   * same client that opened a session, since PHP holds an exclusive write lock on the
   * session file for the lifetime of the request. The result is the ~max_execution_time
   * hangs operators see on busy sites. Closing the session is idempotent and safe — if
   * no session is active the call is a no-op.
   */
  private function release_session_lock(): void {
    if ( function_exists( 'session_status' ) && session_status() === PHP_SESSION_ACTIVE ) {
      session_write_close();
    }
  }

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

  #region Handle direct JSON-RPC
  /**
  * Shared JSON-RPC processor: takes a decoded request body, dispatches the method,
  * and returns an immediate WP_REST_Response. Used by the Streamable HTTP POST handler
  * (the modern transport for Claude Desktop, Claude.ai, ChatGPT, Claude Code).
  */
  private function handle_direct_jsonrpc( WP_REST_Request $request, $data ) {
    $this->release_session_lock();
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

          // Negotiate protocol version: use client's version if supported
          $negotiated_version = $this->protocol_version;
          if ( $requested_version && in_array( $requested_version, $this->supported_protocol_versions, true ) ) {
            $negotiated_version = $requested_version;
          }
          else if ( $requested_version && $requested_version !== $this->protocol_version ) {
            if ( $this->logging ) {
              Meow_MWAI_Logging::warn( "[AI Engine MCP] Client requested unsupported protocol version {$requested_version}" );
            }
          }

          $reply = [
            'jsonrpc' => '2.0',
            'id' => $id,
            'result' => [
              'protocolVersion' => $negotiated_version,
              'serverInfo' => (object) [
                'name' => 'AI Engine - ' . get_bloginfo( 'name' ),
                'version' => $this->server_version,
              ],
              'capabilities' => (object) [
                'tools' => new stdClass(),
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

  #region Session helpers
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
    $this->release_session_lock();
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

  #region Access Control
  private function role_has_access( string $toolLevel ): bool {
    if ( $this->mcp_role === 'admin' ) {
      return true;
    }
    if ( $this->mcp_role === 'readwrite' ) {
      return in_array( $toolLevel, [ 'read', 'write' ] );
    }
    if ( $this->mcp_role === 'readonly' ) {
      return $toolLevel === 'read';
    }
    return false;
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
        'accessLevel' => 'read',
      ],
    ];

    if ( $this->logging ) {
      error_log( '[AI Engine MCP] 🔧 get_tools_list() - Starting with ' . count( $base_tools ) . ' base tools' );
    }

    $filtered_tools = apply_filters( 'mwai_mcp_tools', $base_tools );

    if ( $this->logging ) {
      error_log( '[AI Engine MCP] 🔧 get_tools_list() - After filters: ' . count( $filtered_tools ) . ' tools' );
    }

    // Build access level map for defense-in-depth checks in execute_tool()
    foreach ( $filtered_tools as $tool ) {
      if ( isset( $tool['name'] ) ) {
        $this->tool_access_levels[ $tool['name'] ] = $tool['accessLevel'] ?? 'admin';
      }
    }

    // Filter tools by access level based on the MCP role
    if ( $this->mcp_role !== 'admin' ) {
      $filtered_tools = array_filter( $filtered_tools, function ( $tool ) {
        $level = $tool['accessLevel'] ?? 'admin';
        return $this->role_has_access( $level );
      } );
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
    // NOTE: tool-registration warnings below are always emitted (no $this->logging
    // gate). Each fires only when a tool is silently auto-fixed or auto-skipped at
    // registration — exactly the case where the author needs to know. They're rare
    // in normal operation and the only reliable diagnostic when something is off.
    if ( !is_array( $tool ) ) {
      error_log( '[AI Engine MCP] ⚠️ Tool definition at index ' . $index . ' skipped (expected array).' );
      return null;
    }

    $name = isset( $tool['name'] ) ? trim( (string) $tool['name'] ) : '';
    if ( $name === '' ) {
      error_log( '[AI Engine MCP] ⚠️ Tool skipped due to missing name at index ' . $index );
      return null;
    }

    $normalized_schema = $this->normalize_input_schema( $tool['inputSchema'] ?? null, $name );
    if ( !$normalized_schema ) {
      error_log( '[AI Engine MCP] ⚠️ Tool "' . $name . '" skipped due to invalid input schema.' );
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

    return $normalized;
  }

  private function normalize_input_schema( $schema, string $tool_name ) {
    if ( !is_array( $schema ) ) {
      return null;
    }

    $type = isset( $schema['type'] ) ? (string) $schema['type'] : 'object';
    if ( $type !== 'object' ) {
      error_log( '[AI Engine MCP] ⚠️ Tool "' . $tool_name . '" has unsupported schema type: ' . $type );
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
              error_log(
                '[AI Engine MCP] ⚠️ Tool "' . $tool_name . '" property "' . $prop_name .
                '" has problematic union type with complex types: [' . implode( ', ', $type_array ) .
                ']. This breaks ChatGPT. Auto-fixing by removing type constraint.'
              );
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
    $start = microtime( true );
    $response = null;
    $status = 'error';
    $error_msg = null;
    try {
      // Ensure tool access levels are populated (each HTTP request starts fresh)
      if ( empty( $this->tool_access_levels ) ) {
        $this->get_tools_list();
      }

      // Defense in depth: verify tool access even if it wasn't filtered from the listing
      $tool_level = $this->tool_access_levels[ $tool ] ?? 'admin';
      if ( !$this->role_has_access( $tool_level ) ) {
        $error_msg = "Access denied: tool '{$tool}' requires '{$tool_level}' access.";
        $response = $this->rpc_error( $id, -32600, $error_msg );
        return $response;
      }

      // Handle built-in tools first
      if ( $tool === 'mcp_ping' ) {
        if ( $this->logging ) {
          $this->log( '🛠️ Tool: mcp_ping' );
        }
        $ping_data = [
          'time' => gmdate( 'Y-m-d H:i:s' ),
          'name' => get_bloginfo( 'name' ),
        ];
        $response = [
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
        $status = 'success';
        return $response;
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
          $response = $filtered;
          $status = isset( $filtered['error'] ) ? 'error' : 'success';
          if ( $status === 'error' ) {
            $error_msg = $filtered['error']['message'] ?? null;
          }
          return $response;
        }

        // Otherwise, wrap the result in proper JSON-RPC format
        $response = [
          'jsonrpc' => '2.0',
          'id' => $id,
          'result' => $this->format_tool_result( $filtered ),
        ];
        $status = 'success';
        return $response;
      }

      throw new Exception( "Unknown tool: {$tool}" );
    }
    catch ( Exception $e ) {
      $error_msg = $e->getMessage();
      $response = $this->rpc_error( $id, -32603, $error_msg );
      return $response;
    }
    finally {
      $duration_ms = (int) round( ( microtime( true ) - $start ) * 1000 );
      // Fire the action even on access denials and errors so admins can see
      // attempted-but-blocked tool calls in MCP Logs.
      do_action( 'mwai_mcp_tool_called', [
        'tool'         => $tool,
        'args'         => $args,
        'result'       => $response,
        'status'       => $status,
        'error_msg'    => $error_msg,
        'duration_ms'  => $duration_ms,
        'client_id'    => $this->auth_client_id,
        'client_name'  => $this->auth_client_name,
        'auth_method'  => $this->auth_method,
        'request_id'   => $id,
        'user_id'      => get_current_user_id(),
      ] );
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
