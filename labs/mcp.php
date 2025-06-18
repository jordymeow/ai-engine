<?php

/**
 * AI Engine MCP Server
 * 
 * This class implements a Model Context Protocol (MCP) server for AI Engine.
 * 
 * Current Implementation:
 * - Works reliably with Claude App through the mcp.js relay
 * - The mcp.js relay handles proper disconnection, mwai/kill signals, and other AI Engine-specific features
 * - Supports OAuth authentication flow alongside static bearer tokens
 * - Works with OpenAI/ChatGPT, but OpenAI limits MCP to only 'search' and 'fetch' tools for their Deep Research feature
 *   (these tools are provided by AI Engine's Tuned Core module and search through WordPress posts/pages)
 * 
 * Direct Connection Challenges:
 * The goal is to support direct connections from Claude.ai and OpenAI to this MCP server without 
 * requiring the mcp.js relay. However, this is challenging due to:
 * - PHP's blocking nature causing threads to freeze during long-running SSE connections
 * - Difficulty in properly handling connection termination and cleanup
 * - Protocol version differences between clients (e.g., Claude.ai uses 2024-11-05)
 * - Multiple rapid reconnection attempts from AI services overwhelming the PHP server
 * 
 * OpenAI Limitations:
 * - OpenAI's MCP implementation is limited to Deep Research functionality only
 * - Only 'search' and 'fetch' tools are supported (no other WordPress management tools)
 * - This significantly limits the MCP capabilities compared to Claude's full implementation
 * 
 * The mcp.js relay remains the recommended approach for production use until these 
 * direct connection issues are resolved.
 */

class Meow_MWAI_Labs_MCP {
  private $core = null;
  private $namespace = 'mcp/v1';
  private $server_version = '0.0.1';
  private $protocol_version = '2024-11-05';
  private $queue_key = 'mwai_mcp_msg';
  private $session_id = null;
  private $logging = false;
  private $last_action_time = 0;
  private $bearer_token = null;
  private $oauth = null;

  #region Initialize
  public function __construct( $core ) {
    $this->core = $core;
    
    // Set logging based on option
    $this->logging = $this->core->get_option( 'mcp_debug_mode', false );
    
    // Initialize OAuth if enabled
    if ( $this->core->get_option( 'module_mcp' ) ) {
      require_once( __DIR__ . '/oauth.php' );
      $this->oauth = new Meow_MWAI_Labs_OAuth( $core, $this->logging );
      
      // Handle OAuth callback
      add_action( 'init', [ $this->oauth, 'handle_oauth_callback' ] );
      
      // Cleanup expired tokens periodically
      add_action( 'mwai_cleanup_oauth', [ $this->oauth, 'cleanup_expired' ] );
      if ( ! wp_next_scheduled( 'mwai_cleanup_oauth' ) ) {
        wp_schedule_event( time(), 'hourly', 'mwai_cleanup_oauth' );
      }
    }
    
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
    
    // Log MCP-related requests when logging is enabled
    if ( $this->logging ) {
      add_action( 'init', [ $this, 'log_requests' ], 1 );
    }
  }
  
  public function log_requests() {
    if ( ! $this->logging || empty( $_SERVER['REQUEST_METHOD'] ) || empty( $_SERVER['REQUEST_URI'] ) ) {
      return;
    }
    
    $uri = $_SERVER['REQUEST_URI'];
    
    // Only log MCP-related requests
    if ( strpos( $uri, '/mcp/' ) === false && strpos( $uri, '/mwai/' ) === false && strpos( $uri, '/.well-known/oauth' ) === false ) {
      return;
    }
    
    // Skip patterns we don't want to log
    $skip_patterns = [
      '/wp-admin/',
      '/wp-cron.php',
      '/favicon.ico',
    ];
    
    foreach ( $skip_patterns as $pattern ) {
      if ( strpos( $uri, $pattern ) !== false ) {
        return;
      }
    }
    
    // Get user agent (shortened)
    $user_agent = isset( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : 'Unknown';
    if ( strpos( $user_agent, 'Mozilla' ) !== false ) {
      $user_agent = 'Mozilla/5.0';
    } elseif ( strpos( $user_agent, 'python-httpx' ) !== false ) {
      $user_agent = 'python-httpx/0.27.0';
    } elseif ( strpos( $user_agent, 'node' ) !== false ) {
      $user_agent = 'node';
    }
    
    // Get IP address (considering proxies)
    $ip = 'Unknown';
    if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
      $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
      // X-Forwarded-For can contain multiple IPs, get the first one
      $ips = explode( ',', $_SERVER['HTTP_X_FORWARDED_FOR'] );
      $ip = trim( $ips[0] );
    } elseif ( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
      $ip = $_SERVER['REMOTE_ADDR'];
    }
    
    // Simplify URI for readability
    $uri_parts = parse_url( $_SERVER['REQUEST_URI'] );
    $path = $uri_parts['path'] ?? $_SERVER['REQUEST_URI'];
    $simple_path = str_replace( '/wp-json', '', $path );
    
    // Only show session ID for /messages requests
    if ( strpos( $path, '/messages' ) !== false && !empty( $uri_parts['query'] ) ) {
      parse_str( $uri_parts['query'], $query_params );
      if ( isset( $query_params['session_id'] ) ) {
        $simple_path .= ' (' . substr( $query_params['session_id'], 0, 8 ) . '...)';
      }
    }
    
    // Uncomment the line below to see ALL HTTP requests in logs (useful when debugging Claude, ChatGPT, etc)
    // This shows every request made by AI services to understand their connection patterns
    // error_log( '[MCP] ' . $_SERVER['REQUEST_METHOD'] . ' ' . $simple_path );
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
      'methods' => 'GET',
      'callback' => [ $this, 'handle_sse' ],
      'permission_callback' => function( $request ) {
				return $this->can_access_mcp( $request );
			},
    ] );

    register_rest_route( $this->namespace, '/sse', [
      'methods' => 'POST',
      'callback' => [ $this, 'handle_sse' ],
      'permission_callback' => function( $request ) {
				return $this->can_access_mcp( $request );
			},
    ] );

    register_rest_route( $this->namespace, '/messages', [
      'methods' => 'POST',
      'callback' => [ $this, 'handle_message' ],
      'permission_callback' => function( $request ) {
				return $this->can_access_mcp( $request );
			},
    ] );

    // No-Auth URL endpoints (with token in path)
    $noauth_enabled = $this->core->get_option( 'mcp_noauth_url' );
    if ( $noauth_enabled && !empty( $this->bearer_token ) ) {
      register_rest_route( $this->namespace, '/' . $this->bearer_token . '/sse', [
        'methods' => 'GET',
        'callback' => [ $this, 'handle_sse' ],
        'permission_callback' => function( $request ) {
          return $this->handle_noauth_access( $request );
        },
      ] );

      register_rest_route( $this->namespace, '/' . $this->bearer_token . '/sse', [
        'methods' => 'POST',
        'callback' => [ $this, 'handle_sse' ],
        'permission_callback' => function( $request ) {
          return $this->handle_noauth_access( $request );
        },
      ] );

      register_rest_route( $this->namespace, '/' . $this->bearer_token . '/messages', [
        'methods' => 'POST',
        'callback' => [ $this, 'handle_message' ],
        'permission_callback' => function( $request ) {
          return $this->handle_noauth_access( $request );
        },
      ] );
    }
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
  function can_access_mcp( $request ) {
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
        error_log( '[MCP] ❌ No authorization header provided.' );
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
            error_log( '[MCP] 🔐 OAuth OK (user: ' . $token_data['user_id'] . ')' );
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
        // Only log auth for SSE endpoint
        if ( $this->logging && strpos( $request->get_route(), '/sse' ) !== false ) {
          error_log( '[MCP] 🔐 Auth OK' );
        }
        return true;
      }
      
      if ( $this->logging && $auth_result === 'none' ) {
        error_log( '[MCP] ❌ Bearer token invalid.' );
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
        error_log( '[MCP] ❌ Invalid no-auth URL access attempt.' );
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
        Meow_MWAI_Logging::log( "[MCP] {$msg}" );
      }
    }
  }

  /** Wrap a JSON-RPC error object */
  private function rpc_error( $id, int $code, string $msg, $extra = null ): array {
    $err = [ 'code' => $code, 'message' => $msg ];
    if ( $extra !== null ) $err['data'] = $extra;
    return [ 'jsonrpc' => '2.0', 'id' => $id, 'error' => $err ];
  }

  /** Queue an error for SSE delivery */
  private function queue_error( $sess, $id, int $code, string $msg, $extra = null ): void {
    $this->store_message( $sess, $this->rpc_error( $id, $code, $msg, $extra ) );
  }
  
  /** Format tool result for MCP protocol */
  private function format_tool_result( $result ) : array {
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
      return new WP_REST_Response( [
        'jsonrpc' => '2.0',
        'id' => null,
        'error' => [ 'code' => -32700, 'message' => 'Parse error: invalid JSON' ]
      ], 200 );
    }
    
    if ( ! is_array( $data ) || !$method ) {
      return new WP_REST_Response( [
        'jsonrpc' => '2.0',
        'id' => $id,
        'error' => [ 'code' => -32600, 'message' => 'Invalid Request' ]
      ], 200 );
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
            error_log( "[MCP] Client: {$client_name} v{$client_version}" );
          }
          
          if ( $requested_version && $requested_version !== $this->protocol_version ) {
            if ( $this->logging ) {
              Meow_MWAI_Logging::warn( "[MCP] Client requested protocol version {$requested_version}, but we only support {$this->protocol_version}" );
            }
          }
          
          $reply = [
            'jsonrpc' => '2.0',
            'id'      => $id,
            'result'  => [
              'protocolVersion' => $this->protocol_version,
              'serverInfo'      => (object)[
                'name'    => get_bloginfo( 'name' ) . ' MCP',
                'version' => $this->server_version,
              ],
              'capabilities'    => [
                'tools'     => [ 'listChanged' => true ],
                'prompts'   => [ 'subscribe'   => false, 'listChanged' => false ],
                'resources' => [ 'subscribe'   => false, 'listChanged' => false ],
              ],
            ],
          ];
          break;

        case 'tools/list':
          // Don't log every tools/list request as it's too repetitive
          
          // Check if this is OpenAI by checking the User-Agent
          $user_agent = isset( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : '';
          $is_openai = strpos( $user_agent, 'openai-mcp' ) !== false;
          
          if ( $is_openai && $this->logging ) {
            error_log( '[MCP] 🎯 OpenAI client detected - filtering tools for deep research only.' );
          }
          
          $tools = $this->get_tools_list();
          
          // Filter tools for OpenAI - they only support search and fetch for deep research
          if ( $is_openai ) {
            $filtered_tools = [];
            foreach ( $tools as $tool ) {
              if ( in_array( $tool['name'], ['search', 'fetch'] ) ) {
                $filtered_tools[] = $tool;
              }
            }
            $tools = $filtered_tools;
            
            if ( $this->logging && count( $filtered_tools ) === 0 ) {
              error_log( '[MCP] ⚠️ Warning: No search or fetch tools found for OpenAI!' );
            }
          }
          
          $reply = [
            'jsonrpc' => '2.0',
            'id'      => $id,
            'result'  => [ 'tools' => $tools ],
          ];
          if ( $this->logging ) {
            error_log( '[MCP] 📤 Returning ' . count( $tools ) . ' tools.' );
          }
          break;

        case 'tools/call':
          $params    = $data['params']      ?? [];
          $tool      = $params['name']     ?? '';
          $arguments = $params['arguments']?? [];
          $reply     = $this->execute_tool( $tool, $arguments, $id );
          break;

        case 'notifications/initialized':
          // This is a notification from the client indicating it has initialized
          // No response needed for notifications
          // Client initialized - no need to log
          return new WP_REST_Response( null, 204 );
          break;

        default:
          // Check if it's a notification (no id)
          if ( $id === null && strpos( $method, 'notifications/' ) === 0 ) {
            if ( $this->logging ) {
              error_log( '[MCP] 📨 Notification received: ' . $method );
            }
            return new WP_REST_Response( null, 204 );
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
      return $response;

    } catch ( Exception $e ) {
      $error_response = new WP_REST_Response( [
        'jsonrpc' => '2.0',
        'id' => $id,
        'error' => [ 'code' => -32603, 'message' => 'Internal error', 'data' => $e->getMessage() ]
      ], 200 );
      $error_response->set_headers( [ 'Content-Type' => 'application/json' ] );
      return $error_response;
    }
  }
  #endregion

  #region Handle SSE (stream loop)
  private function reply( string $event, $data = null, string $enc = 'json' ) {
    // Handle special events
    if ( $event === 'bye' ) {
      echo "event: bye\ndata: \n\n";
      if ( ob_get_level() ) ob_end_flush();
      flush();
      $this->last_action_time = time();
      $this->log( "Clean disconnection" );
      return;
    }
    
    if ( $enc === 'json' && $data === null ) {
      $this->log( "no data for {$event}");
      return;
    }
    echo "event: {$event}\n";
    if ( $enc === 'json' )
      $data = $data === null ? '{}' : wp_json_encode( $data, JSON_UNESCAPED_UNICODE );
    echo 'data: ' . $data . "\n\n";

    if ( ob_get_level() ) ob_end_flush();
    flush();

    $this->last_action_time = time();
    // Only log endpoint announcements
    if ( $event === 'endpoint' ) {
      $this->log( "SSE endpoint ready" );
    }
  }

  private function generate_sse_id( $req ) {
    $last = $req ? $req->get_header( 'last-event-id' ) : '';
    return $last ?: str_replace( '-', '', wp_generate_uuid4() );
  }

  public function handle_sse( WP_REST_Request $request ) {

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
    @ini_set( 'output_buffering',        '0' );
    @ini_set( 'implicit_flush',          '1' );
    if ( function_exists( 'ob_implicit_flush' ) ) ob_implicit_flush( true );

    header( 'Content-Type: text/event-stream' );
    header( 'Cache-Control: no-cache' );
    header( 'X-Accel-Buffering: no' );
    header( 'Connection: keep-alive' );
    while ( ob_get_level() ) ob_end_flush();

    /* — greet client —*/
    $this->session_id       = $this->generate_sse_id( $request );
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
      error_log( '[MCP] ✅ SSE connected (' . substr($this->session_id, 0, 8) . '...)' );
    }

    /* — main loop —*/
    while ( true ) {
      // Use shorter timeout in debug mode for easier testing
      $max_time = $this->logging ? 30 : 60 * 5; // 30 seconds in debug, 5 minutes in production
      $idle = ( time() - $this->last_action_time ) >= $max_time;
      if ( connection_aborted() || $idle ) {
        $this->reply( 'bye' );
        if ( $this->logging ) {
          error_log( '[MCP] 🔚 SSE closed (' . ( $idle ? 'idle' : 'abort' ) . ')' );
        }
        break;
      }

      foreach ( $this->fetch_messages( $this->session_id ) as $p ) {
        // Check for kill signal in the message queue
        if ( isset( $p['method'] ) && $p['method'] === 'mwai/kill' ) {
          if ( $this->logging ) {
            error_log( '[MCP] Kill signal - terminating' );
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

  #region Handle /messages (JSON-RPC ingress)
  public function handle_message( WP_REST_Request $request ) {
    $sess = sanitize_text_field( $request->get_param( 'session_id' ) );
    $raw  = $request->get_body();
    $dat  = json_decode( $raw, true );
    
    // Only log important methods in detail
    if ( $this->logging && $dat && isset( $dat['method'] ) ) {
      $method = $dat['method'];
      // Skip logging for repetitive/less important notifications
      if ( !in_array( $method, ['notifications/initialized', 'notifications/cancelled'] ) ) {
        error_log( '[MCP] ↓ ' . $method );
      }
    }

    if ( json_last_error() !== JSON_ERROR_NONE ) {
      $this->queue_error( $sess, null, -32700, 'Parse error: invalid JSON' );
      return new WP_REST_Response( null, 204 );
    }
    if ( ! is_array( $dat ) ) {
      $this->queue_error( $sess, null, -32600, 'Invalid Request' );
      return new WP_REST_Response( null, 204 );
    }

    $id = $dat['id'] ?? null;
    $method = $dat['method'] ?? null;

    /* — notifications —*/
    if ( $method === 'initialized' ) return new WP_REST_Response( null, 204 );
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
            error_log( "[MCP] Client: {$client_name} v{$client_version}" );
          }
          
          if ( $requested_version && $requested_version !== $this->protocol_version ) {
            if ( $this->logging ) {
              Meow_MWAI_Logging::warn( "[MCP] Client requested protocol version {$requested_version}, but we only support {$this->protocol_version}" );
            }
          }
          
          $reply = [
            'jsonrpc' => '2.0',
            'id'      => $id,
            'result'  => [
              'protocolVersion' => $this->protocol_version,
              'serverInfo'      => (object)[
                'name'    => get_bloginfo( 'name' ) . ' MCP',
                'version' => $this->server_version,
              ],
              'capabilities'    => [
                'tools'     => [ 'listChanged' => true ],
                'prompts'   => [ 'subscribe'   => false, 'listChanged' => false ],
                'resources' => [ 'subscribe'   => false, 'listChanged' => false ],
              ],
            ],
          ];
          break;

        case 'tools/list':
          // Don't log every tools/list request as it's too repetitive
          
          // Check if this is OpenAI by checking the User-Agent
          $user_agent = isset( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : '';
          $is_openai = strpos( $user_agent, 'openai-mcp' ) !== false;
          
          if ( $is_openai && $this->logging ) {
            error_log( '[MCP] 🎯 OpenAI client detected - filtering tools for deep research only.' );
          }
          
          $tools = $this->get_tools_list();
          
          // Filter tools for OpenAI - they only support search and fetch for deep research
          if ( $is_openai ) {
            $filtered_tools = [];
            foreach ( $tools as $tool ) {
              if ( in_array( $tool['name'], ['search', 'fetch'] ) ) {
                $filtered_tools[] = $tool;
              }
            }
            $tools = $filtered_tools;
            
            if ( $this->logging && count( $filtered_tools ) === 0 ) {
              error_log( '[MCP] ⚠️ Warning: No search or fetch tools found for OpenAI!' );
            }
          }
          
          $reply = [
            'jsonrpc' => '2.0',
            'id'      => $id,
            'result'  => [ 'tools' => $tools ],
          ];
          break;

        case 'resources/list':
          $reply = [
            'jsonrpc' => '2.0',
            'id'      => $id,
            'result'  => [ 'resources' => $this->get_resources_list() ],
          ];
          break;

        case 'prompts/list':
          $reply = [
            'jsonrpc' => '2.0',
            'id'      => $id,
            'result'  => [ 'prompts' => $this->get_prompts_list() ],
          ];
          break;

        case 'tools/call':
          $params    = $dat['params']      ?? [];
          $tool      = $params['name']     ?? '';
          $arguments = $params['arguments']?? [];
          $reply     = $this->execute_tool( $tool, $arguments, $id );
          break;

        default:
          $reply = $this->rpc_error( $id, -32601, "Method not found: {$method}" );
      }
      #endregion

      if ( $reply ) {
        // Don't log response queuing - it's too noisy
        $this->store_message( $sess, $reply );
      }

    } catch ( Exception $e ) {
      $this->queue_error( $sess, $id, -32603, 'Internal error', $e->getMessage() );
    }

    return new WP_REST_Response( null, 204 );
  }
  #endregion

  #region Tools Definitions
  private function get_tools_list() {
    $base_tools = [
      [
        'name'        => 'mcp_ping',
        'description' => 'Simple connectivity check. Returns the current GMT time and the WordPress site name. Whenever a tool call fails (error or timeout), immediately invoke mcp_ping to verify the server; if mcp_ping itself does not respond, assume the server is temporarily unreachable and pause additional tool calls.',
        'inputSchema' => [ 
          'type' => 'object', 
          'properties' => (object) [],
          'required' => []
        ],
      ],
    ];
    return apply_filters( 'mwai_mcp_tools', $base_tools );
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
          } elseif ( isset( $args['query'] ) ) {
            $args_preview = ' (query: "' . substr( $args['query'], 0, 30 ) . '...")';
          } elseif ( isset( $args['message'] ) ) {
            $args_preview = ' (message: "' . substr( $args['message'], 0, 30 ) . '...")';
          }
        }
        // Log to both error log and UI
        error_log( '[MCP] 🛠️ ' . $tool . $args_preview );
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
    } catch ( Exception $e ) {
      return $this->rpc_error( $id, -32603, $e->getMessage() );
    }
  }
  #endregion

  #region Message Queue (per-message transient)
  private function transient_key( $sess, $id ) {
    return "{$this->queue_key}_{$sess}_{$id}";
  }

  private function store_message( $sess, $payload ) {
    if ( !$sess ) return;
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
    usort( $msgs, fn( $a,$b ) => ( $a['id'] ?? 0 ) <=> ( $b['id'] ?? 0 ) );
    if ( $msgs ) $this->log( 'flush '.count($msgs).' msg(s)' );
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
