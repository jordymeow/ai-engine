<?php

class Meow_MWAI_Labs_OAuth {
  private $core = null;
  private $namespace = 'mcp/oauth';
  private $codes_option = 'mwai_oauth_codes';
  private $tokens_option = 'mwai_oauth_tokens';
  private $code_lifetime = 600; // 10 minutes
  private $token_lifetime = 3600; // 1 hour
  private $logging = false;

  public function __construct( $core, $logging = false ) {
    $this->core = $core;
    $this->logging = $logging;
    
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
    add_action( 'init', [ $this, 'handle_well_known' ] );
  }

  public function rest_api_init() {
    // Authorization endpoint
    register_rest_route( $this->namespace, '/authorize', [
      'methods' => 'GET',
      'callback' => [ $this, 'handle_authorize' ],
      'permission_callback' => '__return_true',
    ] );

    // Token endpoint
    register_rest_route( $this->namespace, '/token', [
      'methods' => 'POST',
      'callback' => [ $this, 'handle_token' ],
      'permission_callback' => '__return_true',
    ] );
  }

  // Handle .well-known/oauth-authorization-server
  public function handle_well_known() {
    if ( $_SERVER['REQUEST_URI'] === '/.well-known/oauth-authorization-server' ) {
      if ( $this->logging ) {
        error_log( '[OAuth] 🌐 Discovery endpoint requested.' );
      }
      header( 'Content-Type: application/json' );
      $base_url = get_site_url();
      $discovery = [
        'issuer' => $base_url,
        'authorization_endpoint' => $base_url . '/wp-json/mcp/oauth/authorize',
        'token_endpoint' => $base_url . '/wp-json/mcp/oauth/token',
        'scopes_supported' => [ 'mcp' ],
        'response_types_supported' => [ 'code' ],
        'grant_types_supported' => [ 'authorization_code' ],
        'token_endpoint_auth_methods_supported' => [ 'none' ],
        'code_challenge_methods_supported' => [ 'S256' ]
      ];
      echo json_encode( $discovery, JSON_PRETTY_PRINT );
      exit;
    }
  }

  // Authorization endpoint
  public function handle_authorize( $request ) {
    if ( $this->logging ) {
      error_log( '[OAuth] 🔐 Authorize: ' . $request->get_param( 'client_id' ) );
    }
    
    $response_type = $request->get_param( 'response_type' );
    $client_id = $request->get_param( 'client_id' );
    $redirect_uri = $request->get_param( 'redirect_uri' );
    $state = $request->get_param( 'state' );
    $code_challenge = $request->get_param( 'code_challenge' );
    $code_challenge_method = $request->get_param( 'code_challenge_method' );
    $scope = $request->get_param( 'scope' );

    // Validate request
    if ( $response_type !== 'code' ) {
      return new WP_Error( 'invalid_request', 'Invalid response_type' );
    }

    if ( empty( $client_id ) || empty( $redirect_uri ) || empty( $code_challenge ) ) {
      return new WP_Error( 'invalid_request', 'Missing required parameters' );
    }

    if ( $code_challenge_method && $code_challenge_method !== 'S256' ) {
      return new WP_Error( 'invalid_request', 'Only S256 code challenge method is supported' );
    }

    // Check if user is logged in
    if ( ! is_user_logged_in() ) {
      // Store OAuth params in session/transient
      $session_key = 'oauth_' . wp_generate_password( 16, false );
      set_transient( $session_key, [
        'client_id' => $client_id,
        'redirect_uri' => $redirect_uri,
        'state' => $state,
        'code_challenge' => $code_challenge,
        'scope' => $scope ?: 'mcp'
      ], 600 );

      // Show login form
      $this->show_login_form( $session_key );
      exit;
    }

    // User is logged in, generate authorization code
    $code = $this->generate_authorization_code( 
      get_current_user_id(),
      $client_id,
      $redirect_uri,
      $code_challenge,
      $scope ?: 'mcp'
    );

    // Redirect back with code
    $redirect_params = [
      'code' => $code,
      'state' => $state
    ];
    
    $redirect_url = add_query_arg( $redirect_params, $redirect_uri );
    wp_redirect( $redirect_url );
    exit;
  }

  // Token endpoint
  public function handle_token( $request ) {
    if ( $this->logging ) {
      $params = $request->get_params();
      // Don't log sensitive data like code_verifier
      $safe_params = $params;
      if ( isset( $safe_params['code_verifier'] ) ) {
        $safe_params['code_verifier'] = '[REDACTED]';
      }
      error_log( '[OAuth] 🎫 Token exchange for client: ' . $request->get_param( 'client_id' ) );
    }
    
    $grant_type = $request->get_param( 'grant_type' );
    $code = $request->get_param( 'code' );
    $client_id = $request->get_param( 'client_id' );
    $redirect_uri = $request->get_param( 'redirect_uri' );
    $code_verifier = $request->get_param( 'code_verifier' );

    // Validate grant type
    if ( $grant_type !== 'authorization_code' ) {
      return new WP_Error( 'unsupported_grant_type', 'Only authorization_code grant type is supported', [ 'status' => 400 ] );
    }

    // Validate required parameters
    if ( empty( $code ) || empty( $client_id ) || empty( $redirect_uri ) || empty( $code_verifier ) ) {
      return new WP_Error( 'invalid_request', 'Missing required parameters', [ 'status' => 400 ] );
    }

    // Validate authorization code
    $codes = get_option( $this->codes_option, [] );
    if ( ! isset( $codes[ $code ] ) ) {
      return new WP_Error( 'invalid_grant', 'Invalid authorization code', [ 'status' => 400 ] );
    }

    $code_data = $codes[ $code ];

    // Check if code is expired
    if ( time() > $code_data['expires'] ) {
      unset( $codes[ $code ] );
      update_option( $this->codes_option, $codes );
      return new WP_Error( 'invalid_grant', 'Authorization code has expired', [ 'status' => 400 ] );
    }

    // Validate client_id and redirect_uri
    if ( $code_data['client_id'] !== $client_id || $code_data['redirect_uri'] !== $redirect_uri ) {
      return new WP_Error( 'invalid_grant', 'Invalid client_id or redirect_uri', [ 'status' => 400 ] );
    }

    // Verify PKCE
    $verifier_hash = base64_encode( hash( 'sha256', $code_verifier, true ) );
    $verifier_hash = rtrim( strtr( $verifier_hash, '+/', '-_' ), '=' ); // Base64 URL encoding

    if ( $verifier_hash !== $code_data['code_challenge'] ) {
      return new WP_Error( 'invalid_grant', 'Invalid code_verifier', [ 'status' => 400 ] );
    }

    // Code is valid, remove it (one-time use)
    unset( $codes[ $code ] );
    update_option( $this->codes_option, $codes );

    // Generate access token
    $access_token = $this->generate_access_token( $code_data['user_id'], $code_data['scope'] );

    // Return token response
    return [
      'access_token' => $access_token,
      'token_type' => 'Bearer',
      'expires_in' => $this->token_lifetime,
      'scope' => $code_data['scope']
    ];
  }

  // Generate authorization code
  private function generate_authorization_code( $user_id, $client_id, $redirect_uri, $code_challenge, $scope ) {
    if ( $this->logging ) {
      error_log( '[OAuth] ✅ Auth code generated for user ' . $user_id . '.' );
    }
    
    $code = wp_generate_password( 32, false );
    
    $codes = get_option( $this->codes_option, [] );
    $codes[ $code ] = [
      'user_id' => $user_id,
      'client_id' => $client_id,
      'redirect_uri' => $redirect_uri,
      'code_challenge' => $code_challenge,
      'scope' => $scope,
      'expires' => time() + $this->code_lifetime
    ];
    
    update_option( $this->codes_option, $codes );
    
    return $code;
  }

  // Generate access token
  private function generate_access_token( $user_id, $scope ) {
    if ( $this->logging ) {
      error_log( '[OAuth] ✅ Access token generated for user ' . $user_id . '.' );
    }
    
    $token = wp_generate_password( 40, false );
    
    $tokens = get_option( $this->tokens_option, [] );
    $tokens[ $token ] = [
      'user_id' => $user_id,
      'scope' => $scope,
      'expires' => time() + $this->token_lifetime
    ];
    
    update_option( $this->tokens_option, $tokens );
    
    return $token;
  }

  // Validate access token
  public function validate_token( $token ) {
    $tokens = get_option( $this->tokens_option, [] );
    
    if ( ! isset( $tokens[ $token ] ) ) {
      return false;
    }
    
    $token_data = $tokens[ $token ];
    
    // Check if expired
    if ( time() > $token_data['expires'] ) {
      if ( $this->logging ) {
        error_log( '[OAuth] ❌ Token validation failed: expired.' );
      }
      unset( $tokens[ $token ] );
      update_option( $this->tokens_option, $tokens );
      return false;
    }
    
    if ( $this->logging ) {
      error_log( '[OAuth] ✅ Token valid for user ' . $token_data['user_id'] . '.' );
    }
    
    return $token_data;
  }

  // Show login form
  private function show_login_form( $session_key ) {
    $login_url = wp_login_url( add_query_arg( 'oauth_session', $session_key, $_SERVER['REQUEST_URI'] ) );
    ?>
    <!DOCTYPE html>
    <html>
    <head>
      <title>Login Required</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          background: #f5f5f5;
        }
        .login-container {
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
          max-width: 400px;
        }
        h2 {
          margin-top: 0;
          color: #333;
        }
        p {
          color: #666;
          margin-bottom: 30px;
        }
        .login-button {
          display: inline-block;
          background: #0073aa;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 500;
        }
        .login-button:hover {
          background: #005a87;
        }
      </style>
    </head>
    <body>
      <div class="login-container">
        <h2>Authorization Required</h2>
        <p>Please log in to authorize access to your MCP connector.</p>
        <a href="<?php echo esc_url( $login_url ); ?>" class="login-button">Log In</a>
      </div>
    </body>
    </html>
    <?php
  }

  // Handle OAuth callback after login
  public function handle_oauth_callback() {
    if ( isset( $_GET['oauth_session'] ) && is_user_logged_in() ) {
      if ( $this->logging ) {
        error_log( '[OAuth] 🔄 Callback handling for session.' );
      }
      $session_key = sanitize_text_field( $_GET['oauth_session'] );
      $oauth_params = get_transient( $session_key );
      
      if ( $oauth_params ) {
        delete_transient( $session_key );
        
        // Generate authorization code
        $code = $this->generate_authorization_code(
          get_current_user_id(),
          $oauth_params['client_id'],
          $oauth_params['redirect_uri'],
          $oauth_params['code_challenge'],
          $oauth_params['scope']
        );
        
        // Redirect back with code
        $redirect_params = [
          'code' => $code,
          'state' => $oauth_params['state']
        ];
        
        $redirect_url = add_query_arg( $redirect_params, $oauth_params['redirect_uri'] );
        wp_redirect( $redirect_url );
        exit;
      }
    }
  }

  // Clean up expired tokens and codes
  public function cleanup_expired() {
    if ( $this->logging ) {
      error_log( '[OAuth] 🧹 Cleaning expired tokens.' );
    }
    
    $now = time();
    
    // Clean codes
    $codes = get_option( $this->codes_option, [] );
    foreach ( $codes as $code => $data ) {
      if ( $now > $data['expires'] ) {
        unset( $codes[ $code ] );
      }
    }
    update_option( $this->codes_option, $codes );
    
    // Clean tokens
    $tokens = get_option( $this->tokens_option, [] );
    foreach ( $tokens as $token => $data ) {
      if ( $now > $data['expires'] ) {
        unset( $tokens[ $token ] );
      }
    }
    update_option( $this->tokens_option, $tokens );
  }
}