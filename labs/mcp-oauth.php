<?php

if ( !defined( 'ABSPATH' ) ) {
  exit;
}

/**
 * AI Engine MCP OAuth 2.1 module.
 *
 * Implements OAuth 2.1 with Dynamic Client Registration (RFC 7591),
 * PKCE (RFC 7636, S256 only), Authorization Server Metadata (RFC 8414),
 * Protected Resource Metadata (RFC 9728), and Token Revocation (RFC 7009),
 * matching the MCP authorization specification.
 *
 * This module is additive: the legacy static bearer token continues to work
 * for developer tooling. OAuth is the consumer-facing path used by clients
 * like Claude Desktop that drive the user through a browser authorize flow.
 */
class Meow_MWAI_Labs_MCP_OAuth {

  const DB_VERSION = '1.0.0';
  const ACCESS_TOKEN_TTL = 3600;       // 1 hour
  const REFRESH_TOKEN_TTL = 2592000;   // 30 days
  const AUTH_CODE_TTL = 60;            // seconds
  const NONCE_ACTION = 'mwai_mcp_oauth_consent';

  private $core;
  private $mcp;
  private $namespace = 'mcp/v1';
  private $logging = false;
  private $table_clients;
  private $table_tokens;

  public function __construct( $core, $mcp ) {
    global $wpdb;
    $this->core = $core;
    $this->mcp = $mcp;
    $this->logging = method_exists( $mcp, 'is_logging_enabled' ) ? $mcp->is_logging_enabled() : false;
    $this->table_clients = $wpdb->prefix . 'mwai_mcp_oauth_clients';
    $this->table_tokens = $wpdb->prefix . 'mwai_mcp_oauth_tokens';

    $this->maybe_upgrade_db();

    add_action( 'rest_api_init', [ $this, 'register_routes' ] );
    add_filter( 'rest_post_dispatch', [ $this, 'add_www_authenticate_header' ], 10, 3 );
    // WP's REST cookie nonce check silently downgrades cookie-authed users to guest
    // when no X-WP-Nonce is sent. The browser-driven authorize flow needs the user's
    // identity from the cookie without a REST nonce, so we re-validate the auth cookie
    // for that route. CSRF is enforced separately via our own consent nonce on POST.
    add_filter( 'rest_authentication_errors', [ $this, 'reauth_for_authorize' ], 200 );
    // Serve well-known metadata at the host root too. RFC 9728/8414 specify the
    // well-known URI is built by inserting /.well-known/<suffix> between the host
    // and the path of the resource/issuer, so strict clients query the host root
    // rather than the nested REST path. Run very early to short-circuit WP's 404.
    add_action( 'parse_request', [ $this, 'handle_host_root_wellknown' ], 1 );
  }

  /**
   * Serve OAuth well-known metadata from the host root. Handles all three URL
   * shapes that clients use in the wild: bare host-root, host-root + resource
   * path (RFC strict), and the nested REST path is already covered by the REST
   * route registration.
   */
  public function handle_host_root_wellknown() {
    $uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) $_SERVER['REQUEST_URI'] : '';
    $path = strtok( $uri, '?' );
    if ( $path === false || strpos( $path, '/.well-known/' ) !== 0 ) {
      return;
    }
    if ( strpos( $path, '/.well-known/oauth-protected-resource' ) === 0 ) {
      if ( $this->logging ) {
        error_log( '[AI Engine MCP OAuth] Host-root PRM hit: ' . $path );
      }
      $this->emit_json( $this->protected_resource_metadata() );
    }
    if ( strpos( $path, '/.well-known/oauth-authorization-server' ) === 0 ) {
      if ( $this->logging ) {
        error_log( '[AI Engine MCP OAuth] Host-root ASM hit: ' . $path );
      }
      $this->emit_json( $this->authorization_server_metadata() );
    }
  }

  private function emit_json( $payload ) {
    status_header( 200 );
    nocache_headers();
    header( 'Content-Type: application/json; charset=utf-8' );
    header( 'Access-Control-Allow-Origin: *' );
    echo wp_json_encode( $payload );
    exit;
  }

  private function protected_resource_metadata() {
    $issuer = rest_url( $this->namespace );
    return [
      'resource' => rest_url( $this->namespace . '/http' ),
      'authorization_servers' => [ $issuer ],
      'bearer_methods_supported' => [ 'header' ],
      'scopes_supported' => [ 'mcp' ],
      'resource_documentation' => 'https://meowapps.com/ai-engine/',
    ];
  }

  private function authorization_server_metadata() {
    $issuer = rest_url( $this->namespace );
    return [
      'issuer' => $issuer,
      'authorization_endpoint' => rest_url( $this->namespace . '/oauth/authorize' ),
      'token_endpoint' => rest_url( $this->namespace . '/oauth/token' ),
      'registration_endpoint' => rest_url( $this->namespace . '/oauth/register' ),
      'revocation_endpoint' => rest_url( $this->namespace . '/oauth/revoke' ),
      'response_types_supported' => [ 'code' ],
      'grant_types_supported' => [ 'authorization_code', 'refresh_token' ],
      'token_endpoint_auth_methods_supported' => [ 'none', 'client_secret_basic', 'client_secret_post' ],
      'code_challenge_methods_supported' => [ 'S256' ],
      'scopes_supported' => [ 'mcp' ],
    ];
  }

  public function reauth_for_authorize( $result ) {
    $uri = isset( $_SERVER['REQUEST_URI'] ) ? (string) $_SERVER['REQUEST_URI'] : '';
    if ( strpos( $uri, '/' . $this->namespace . '/oauth/authorize' ) === false ) {
      return $result;
    }
    if ( !is_user_logged_in() ) {
      $user_id = wp_validate_auth_cookie( '', 'logged_in' );
      if ( $user_id ) {
        wp_set_current_user( (int) $user_id );
      }
    }
    return $result;
  }

  #region DB schema
  private function maybe_upgrade_db() {
    if ( get_option( 'mwai_mcp_oauth_db_version' ) === self::DB_VERSION ) {
      return;
    }

    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();

    $sql_clients = "CREATE TABLE {$this->table_clients} (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      client_id VARCHAR(64) NOT NULL,
      client_secret_hash VARCHAR(64) NULL,
      client_name VARCHAR(255) NULL,
      redirect_uris LONGTEXT NOT NULL,
      grant_types VARCHAR(255) NOT NULL DEFAULT 'authorization_code,refresh_token',
      token_endpoint_auth_method VARCHAR(32) NOT NULL DEFAULT 'none',
      scope VARCHAR(255) NULL,
      created DATETIME NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY client_id (client_id)
    ) {$charset_collate};";

    $sql_tokens = "CREATE TABLE {$this->table_tokens} (
      id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      client_id VARCHAR(64) NOT NULL,
      user_id BIGINT(20) UNSIGNED NOT NULL,
      access_token_hash VARCHAR(64) NOT NULL,
      refresh_token_hash VARCHAR(64) NULL,
      access_expires DATETIME NOT NULL,
      refresh_expires DATETIME NULL,
      scope VARCHAR(255) NULL,
      created DATETIME NOT NULL,
      last_used DATETIME NULL,
      revoked TINYINT(1) NOT NULL DEFAULT 0,
      PRIMARY KEY (id),
      KEY access_token_hash (access_token_hash),
      KEY refresh_token_hash (refresh_token_hash),
      KEY client_id (client_id),
      KEY user_id (user_id)
    ) {$charset_collate};";

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';
    dbDelta( $sql_clients );
    dbDelta( $sql_tokens );

    update_option( 'mwai_mcp_oauth_db_version', self::DB_VERSION );
  }
  #endregion

  #region Route registration
  public function register_routes() {
    // RFC 9728 — Protected Resource Metadata
    register_rest_route( $this->namespace, '/.well-known/oauth-protected-resource', [
      'methods' => 'GET',
      'callback' => [ $this, 'handle_resource_metadata' ],
      'permission_callback' => '__return_true',
    ] );

    // RFC 8414 — Authorization Server Metadata
    register_rest_route( $this->namespace, '/.well-known/oauth-authorization-server', [
      'methods' => 'GET',
      'callback' => [ $this, 'handle_as_metadata' ],
      'permission_callback' => '__return_true',
    ] );

    // RFC 7591 — Dynamic Client Registration
    register_rest_route( $this->namespace, '/oauth/register', [
      'methods' => 'POST',
      'callback' => [ $this, 'handle_register' ],
      'permission_callback' => '__return_true',
    ] );

    // Authorization endpoint (browser-driven, returns HTML or 302)
    register_rest_route( $this->namespace, '/oauth/authorize', [
      'methods' => [ 'GET', 'POST' ],
      'callback' => [ $this, 'handle_authorize' ],
      'permission_callback' => '__return_true',
    ] );

    // Token endpoint
    register_rest_route( $this->namespace, '/oauth/token', [
      'methods' => 'POST',
      'callback' => [ $this, 'handle_token' ],
      'permission_callback' => '__return_true',
    ] );

    // RFC 7009 — Token Revocation
    register_rest_route( $this->namespace, '/oauth/revoke', [
      'methods' => 'POST',
      'callback' => [ $this, 'handle_revoke' ],
      'permission_callback' => '__return_true',
    ] );

    // Admin-only: list active grants
    register_rest_route( $this->namespace, '/oauth/apps', [
      'methods' => 'GET',
      'callback' => [ $this, 'handle_apps_list' ],
      'permission_callback' => function () {
        return current_user_can( 'manage_options' );
      },
    ] );

    // Admin-only: revoke a grant by id
    register_rest_route( $this->namespace, '/oauth/apps/(?P<id>\d+)', [
      'methods' => 'DELETE',
      'callback' => [ $this, 'handle_apps_revoke' ],
      'permission_callback' => function () {
        return current_user_can( 'manage_options' );
      },
    ] );
  }
  #endregion

  #region Discovery (well-known)
  public function handle_resource_metadata() {
    return new WP_REST_Response( $this->protected_resource_metadata(), 200 );
  }

  public function handle_as_metadata() {
    return new WP_REST_Response( $this->authorization_server_metadata(), 200 );
  }
  #endregion

  #region Dynamic Client Registration (RFC 7591)
  public function handle_register( WP_REST_Request $request ) {
    $body = json_decode( $request->get_body(), true );
    if ( !is_array( $body ) ) {
      return $this->oauth_error( 'invalid_client_metadata', 'Request body must be JSON.', 400 );
    }

    $redirect_uris = $body['redirect_uris'] ?? null;
    if ( !is_array( $redirect_uris ) || empty( $redirect_uris ) ) {
      return $this->oauth_error( 'invalid_redirect_uri', 'redirect_uris is required and must be a non-empty array.', 400 );
    }
    foreach ( $redirect_uris as $uri ) {
      if ( !is_string( $uri ) || $uri === '' ) {
        return $this->oauth_error( 'invalid_redirect_uri', 'Each redirect_uri must be a non-empty string.', 400 );
      }
      // Light validation — allow http(s) and custom schemes (desktop clients use them).
      if ( !preg_match( '#^[a-z][a-z0-9+.\-]*://#i', $uri ) ) {
        return $this->oauth_error( 'invalid_redirect_uri', "redirect_uri must include a scheme: {$uri}", 400 );
      }
    }

    $auth_method = isset( $body['token_endpoint_auth_method'] ) ? (string) $body['token_endpoint_auth_method'] : 'none';
    if ( !in_array( $auth_method, [ 'none', 'client_secret_basic', 'client_secret_post' ], true ) ) {
      return $this->oauth_error( 'invalid_client_metadata', "Unsupported token_endpoint_auth_method: {$auth_method}", 400 );
    }

    $grant_types = $body['grant_types'] ?? [ 'authorization_code', 'refresh_token' ];
    if ( !is_array( $grant_types ) ) {
      $grant_types = [ 'authorization_code', 'refresh_token' ];
    }
    foreach ( $grant_types as $gt ) {
      if ( !in_array( $gt, [ 'authorization_code', 'refresh_token' ], true ) ) {
        return $this->oauth_error( 'invalid_client_metadata', "Unsupported grant_type: {$gt}", 400 );
      }
    }

    $client_id = $this->random_token( 32 );
    $client_secret = null;
    $client_secret_hash = null;
    if ( $auth_method !== 'none' ) {
      $client_secret = $this->random_token( 48 );
      $client_secret_hash = hash( 'sha256', $client_secret );
    }

    $client_name = isset( $body['client_name'] ) ? sanitize_text_field( (string) $body['client_name'] ) : 'Unnamed MCP Client';

    global $wpdb;
    $inserted = $wpdb->insert( $this->table_clients, [
      'client_id' => $client_id,
      'client_secret_hash' => $client_secret_hash,
      'client_name' => $client_name,
      'redirect_uris' => wp_json_encode( array_values( $redirect_uris ) ),
      'grant_types' => implode( ',', $grant_types ),
      'token_endpoint_auth_method' => $auth_method,
      'scope' => 'mcp',
      'created' => current_time( 'mysql', 1 ),
    ] );
    if ( !$inserted ) {
      return $this->oauth_error( 'server_error', 'Could not persist client registration.', 500 );
    }

    if ( $this->logging ) {
      error_log( '[AI Engine MCP OAuth] Registered client: ' . $client_name . ' (' . $client_id . ')' );
    }

    $response = [
      'client_id' => $client_id,
      'client_name' => $client_name,
      'redirect_uris' => array_values( $redirect_uris ),
      'grant_types' => $grant_types,
      'token_endpoint_auth_method' => $auth_method,
      'client_id_issued_at' => time(),
    ];
    if ( $client_secret !== null ) {
      $response['client_secret'] = $client_secret;
      $response['client_secret_expires_at'] = 0; // never
    }
    return new WP_REST_Response( $response, 201 );
  }
  #endregion

  #region Authorize (browser flow)
  public function handle_authorize( WP_REST_Request $request ) {
    $method = $request->get_method();

    if ( $method === 'POST' ) {
      $this->handle_authorize_submit( $request );
      exit;
    }

    // GET — render consent page or redirect to login
    $params = [
      'response_type' => (string) ( $request->get_param( 'response_type' ) ?? '' ),
      'client_id' => (string) ( $request->get_param( 'client_id' ) ?? '' ),
      'redirect_uri' => (string) ( $request->get_param( 'redirect_uri' ) ?? '' ),
      'state' => (string) ( $request->get_param( 'state' ) ?? '' ),
      'scope' => (string) ( $request->get_param( 'scope' ) ?? 'mcp' ),
      'code_challenge' => (string) ( $request->get_param( 'code_challenge' ) ?? '' ),
      'code_challenge_method' => (string) ( $request->get_param( 'code_challenge_method' ) ?? '' ),
    ];

    if ( $params['response_type'] !== 'code' ) {
      $this->render_error_page( 'Unsupported response_type. Only "code" is supported.' );
      exit;
    }
    if ( $params['code_challenge'] === '' || $params['code_challenge_method'] !== 'S256' ) {
      $this->render_error_page( 'PKCE is required: provide code_challenge and code_challenge_method=S256.' );
      exit;
    }

    $client = $this->get_client( $params['client_id'] );
    if ( !$client ) {
      $this->render_error_page( 'Unknown client_id. The client must register via Dynamic Client Registration first.' );
      exit;
    }
    if ( !$this->redirect_uri_registered( $client, $params['redirect_uri'] ) ) {
      $this->render_error_page( 'redirect_uri does not match any registered URI for this client.' );
      exit;
    }

    // Authentication gate — bounce to wp-login.php if not logged in.
    if ( !is_user_logged_in() ) {
      $current_url = rest_url( $this->namespace . '/oauth/authorize' );
      $current_url = add_query_arg( $params, $current_url );
      wp_safe_redirect( wp_login_url( $current_url ) );
      exit;
    }

    $user = wp_get_current_user();
    $this->render_consent_page( $client, $params, $user );
    exit;
  }

  private function handle_authorize_submit( WP_REST_Request $request ) {
    if ( !is_user_logged_in() ) {
      wp_safe_redirect( wp_login_url() );
      exit;
    }

    $nonce = (string) $request->get_param( '_mwai_nonce' );
    if ( !wp_verify_nonce( $nonce, self::NONCE_ACTION ) ) {
      $this->render_error_page( 'Security check failed. Please try again from your application.' );
      exit;
    }

    $client_id = (string) $request->get_param( 'client_id' );
    $redirect_uri = (string) $request->get_param( 'redirect_uri' );
    $state = (string) ( $request->get_param( 'state' ) ?? '' );
    $code_challenge = (string) $request->get_param( 'code_challenge' );
    $code_challenge_method = (string) $request->get_param( 'code_challenge_method' );
    $scope = (string) ( $request->get_param( 'scope' ) ?? 'mcp' );
    $action = (string) ( $request->get_param( 'action' ) ?? 'deny' );

    $client = $this->get_client( $client_id );
    if ( !$client || !$this->redirect_uri_registered( $client, $redirect_uri ) ) {
      $this->render_error_page( 'Invalid client or redirect_uri.' );
      exit;
    }

    if ( $action !== 'approve' ) {
      $params = [ 'error' => 'access_denied', 'error_description' => 'User denied the request.' ];
      if ( $state !== '' ) {
        $params['state'] = $state;
      }
      wp_redirect( $this->append_params( $redirect_uri, $params ) );
      exit;
    }

    // Generate authorization code and stash everything needed to mint a token later.
    $code = $this->random_token( 48 );
    $code_data = [
      'client_id' => $client_id,
      'user_id' => get_current_user_id(),
      'redirect_uri' => $redirect_uri,
      'code_challenge' => $code_challenge,
      'code_challenge_method' => $code_challenge_method,
      'scope' => $scope,
    ];
    set_transient( $this->auth_code_key( $code ), $code_data, self::AUTH_CODE_TTL );

    $params = [ 'code' => $code ];
    if ( $state !== '' ) {
      $params['state'] = $state;
    }

    if ( $this->logging ) {
      error_log( '[AI Engine MCP OAuth] Authorized user ' . get_current_user_id() . ' for client ' . $client_id );
    }

    wp_redirect( $this->append_params( $redirect_uri, $params ) );
    exit;
  }

  private function auth_code_key( $code ) {
    return 'mwai_mcp_oauth_code_' . hash( 'sha256', $code );
  }
  #endregion

  #region Token endpoint
  public function handle_token( WP_REST_Request $request ) {
    $grant_type = (string) ( $request->get_param( 'grant_type' ) ?? '' );

    if ( $grant_type === 'authorization_code' ) {
      return $this->handle_token_auth_code( $request );
    }
    if ( $grant_type === 'refresh_token' ) {
      return $this->handle_token_refresh( $request );
    }
    return $this->oauth_error( 'unsupported_grant_type', 'Supported: authorization_code, refresh_token.', 400 );
  }

  private function handle_token_auth_code( WP_REST_Request $request ) {
    $code = (string) ( $request->get_param( 'code' ) ?? '' );
    $redirect_uri = (string) ( $request->get_param( 'redirect_uri' ) ?? '' );
    $code_verifier = (string) ( $request->get_param( 'code_verifier' ) ?? '' );
    $client_id = (string) ( $request->get_param( 'client_id' ) ?? '' );

    if ( $code === '' || $redirect_uri === '' || $code_verifier === '' ) {
      return $this->oauth_error( 'invalid_request', 'Missing code, redirect_uri, or code_verifier.', 400 );
    }

    $key = $this->auth_code_key( $code );
    $code_data = get_transient( $key );
    if ( !is_array( $code_data ) ) {
      return $this->oauth_error( 'invalid_grant', 'Authorization code is invalid or expired.', 400 );
    }
    // Single-use: delete immediately to prevent replay.
    delete_transient( $key );

    if ( $code_data['redirect_uri'] !== $redirect_uri ) {
      return $this->oauth_error( 'invalid_grant', 'redirect_uri mismatch.', 400 );
    }

    $client = $this->get_client( $code_data['client_id'] );
    if ( !$client ) {
      return $this->oauth_error( 'invalid_client', 'Client not found.', 401 );
    }
    if ( $client_id !== '' && $client_id !== $client->client_id ) {
      return $this->oauth_error( 'invalid_client', 'client_id mismatch.', 401 );
    }
    if ( !$this->authenticate_client_if_required( $client, $request ) ) {
      return $this->oauth_error( 'invalid_client', 'Client authentication failed.', 401 );
    }

    // Verify PKCE.
    $expected_challenge = rtrim( strtr( base64_encode( hash( 'sha256', $code_verifier, true ) ), '+/', '-_' ), '=' );
    if ( !hash_equals( (string) $code_data['code_challenge'], $expected_challenge ) ) {
      return $this->oauth_error( 'invalid_grant', 'PKCE verification failed.', 400 );
    }

    return $this->issue_token_pair( $client->client_id, (int) $code_data['user_id'], (string) $code_data['scope'] );
  }

  private function handle_token_refresh( WP_REST_Request $request ) {
    $refresh_token = (string) ( $request->get_param( 'refresh_token' ) ?? '' );
    $client_id = (string) ( $request->get_param( 'client_id' ) ?? '' );
    if ( $refresh_token === '' ) {
      return $this->oauth_error( 'invalid_request', 'Missing refresh_token.', 400 );
    }

    global $wpdb;
    $hash = hash( 'sha256', $refresh_token );
    $row = $wpdb->get_row(
      $wpdb->prepare(
        "SELECT * FROM {$this->table_tokens} WHERE refresh_token_hash = %s AND revoked = 0 LIMIT 1",
        $hash
      )
    );
    if ( !$row ) {
      return $this->oauth_error( 'invalid_grant', 'Refresh token is invalid or revoked.', 400 );
    }
    if ( $row->refresh_expires && strtotime( $row->refresh_expires . ' UTC' ) < time() ) {
      return $this->oauth_error( 'invalid_grant', 'Refresh token expired.', 400 );
    }

    $client = $this->get_client( $row->client_id );
    if ( !$client ) {
      return $this->oauth_error( 'invalid_client', 'Client not found.', 401 );
    }
    if ( $client_id !== '' && $client_id !== $client->client_id ) {
      return $this->oauth_error( 'invalid_client', 'client_id mismatch.', 401 );
    }
    if ( !$this->authenticate_client_if_required( $client, $request ) ) {
      return $this->oauth_error( 'invalid_client', 'Client authentication failed.', 401 );
    }

    // Refresh-token rotation (OAuth 2.1 best practice): revoke the old grant and issue a new pair.
    $wpdb->update( $this->table_tokens, [ 'revoked' => 1 ], [ 'id' => $row->id ] );

    return $this->issue_token_pair( $row->client_id, (int) $row->user_id, (string) $row->scope );
  }

  private function issue_token_pair( $client_id, $user_id, $scope ) {
    global $wpdb;
    $access_token = $this->random_token( 48 );
    $refresh_token = $this->random_token( 48 );
    $now = time();

    $wpdb->insert( $this->table_tokens, [
      'client_id' => $client_id,
      'user_id' => $user_id,
      'access_token_hash' => hash( 'sha256', $access_token ),
      'refresh_token_hash' => hash( 'sha256', $refresh_token ),
      'access_expires' => gmdate( 'Y-m-d H:i:s', $now + self::ACCESS_TOKEN_TTL ),
      'refresh_expires' => gmdate( 'Y-m-d H:i:s', $now + self::REFRESH_TOKEN_TTL ),
      'scope' => $scope,
      'created' => gmdate( 'Y-m-d H:i:s', $now ),
    ] );

    $response = new WP_REST_Response( [
      'access_token' => $access_token,
      'token_type' => 'Bearer',
      'expires_in' => self::ACCESS_TOKEN_TTL,
      'refresh_token' => $refresh_token,
      'scope' => $scope,
    ], 200 );
    $response->header( 'Cache-Control', 'no-store' );
    $response->header( 'Pragma', 'no-cache' );
    return $response;
  }

  private function authenticate_client_if_required( $client, WP_REST_Request $request ) {
    if ( $client->token_endpoint_auth_method === 'none' ) {
      return true;
    }
    $provided_secret = '';
    if ( $client->token_endpoint_auth_method === 'client_secret_basic' ) {
      $auth = $request->get_header( 'authorization' );
      if ( $auth && preg_match( '#^Basic\s+(.+)$#i', $auth, $m ) ) {
        $decoded = base64_decode( $m[1], true );
        if ( $decoded && strpos( $decoded, ':' ) !== false ) {
          [ $cid, $secret ] = explode( ':', $decoded, 2 );
          if ( $cid === $client->client_id ) {
            $provided_secret = $secret;
          }
        }
      }
    }
    else {
      $provided_secret = (string) ( $request->get_param( 'client_secret' ) ?? '' );
    }
    if ( $provided_secret === '' || !$client->client_secret_hash ) {
      return false;
    }
    return hash_equals( $client->client_secret_hash, hash( 'sha256', $provided_secret ) );
  }
  #endregion

  #region Revocation
  public function handle_revoke( WP_REST_Request $request ) {
    $token = (string) ( $request->get_param( 'token' ) ?? '' );
    if ( $token === '' ) {
      // RFC 7009: return 200 even on unknown tokens to avoid information leakage.
      return new WP_REST_Response( null, 200 );
    }
    global $wpdb;
    $hash = hash( 'sha256', $token );
    $wpdb->query( $wpdb->prepare(
      "UPDATE {$this->table_tokens} SET revoked = 1 WHERE access_token_hash = %s OR refresh_token_hash = %s",
      $hash, $hash
    ) );
    return new WP_REST_Response( null, 200 );
  }
  #endregion

  #region Token validation (called from MCP auth path)
  /**
   * Validate an access token for protected resource access.
   * Returns [ 'user_id' => N, 'client_id' => '...', 'scope' => '...' ] on success, null on failure.
   * Also touches last_used so the admin UI can show recent activity.
   */
  public function validate_token( $token ) {
    if ( !is_string( $token ) || $token === '' ) {
      return null;
    }
    global $wpdb;
    $hash = hash( 'sha256', $token );
    $row = $wpdb->get_row(
      $wpdb->prepare(
        "SELECT * FROM {$this->table_tokens} WHERE access_token_hash = %s AND revoked = 0 LIMIT 1",
        $hash
      )
    );
    if ( !$row ) {
      return null;
    }
    if ( strtotime( $row->access_expires . ' UTC' ) < time() ) {
      return null;
    }
    // Touch last_used (non-blocking, single UPDATE).
    $wpdb->update(
      $this->table_tokens,
      [ 'last_used' => current_time( 'mysql', 1 ) ],
      [ 'id' => $row->id ]
    );
    return [
      'user_id' => (int) $row->user_id,
      'client_id' => $row->client_id,
      'scope' => $row->scope,
    ];
  }
  #endregion

  #region Admin: list / revoke grants
  public function handle_apps_list() {
    global $wpdb;
    $rows = $wpdb->get_results(
      "SELECT t.id, t.client_id, t.user_id, t.created, t.last_used, t.access_expires, t.refresh_expires, t.revoked,
              c.client_name
       FROM {$this->table_tokens} t
       LEFT JOIN {$this->table_clients} c ON c.client_id = t.client_id
       WHERE t.revoked = 0
       ORDER BY t.created DESC"
    );
    $out = [];
    foreach ( $rows as $r ) {
      $user = get_userdata( (int) $r->user_id );
      $out[] = [
        'id' => (int) $r->id,
        'client_id' => $r->client_id,
        'client_name' => $r->client_name ?: 'Unknown app',
        'user_id' => (int) $r->user_id,
        'user_login' => $user ? $user->user_login : 'deleted',
        'user_display' => $user ? $user->display_name : 'Deleted user',
        'created' => $r->created,
        'last_used' => $r->last_used,
        'access_expires' => $r->access_expires,
        'refresh_expires' => $r->refresh_expires,
      ];
    }
    return new WP_REST_Response( [ 'apps' => $out ], 200 );
  }

  public function handle_apps_revoke( WP_REST_Request $request ) {
    $id = (int) $request->get_param( 'id' );
    if ( $id <= 0 ) {
      return new WP_REST_Response( [ 'error' => 'Invalid id.' ], 400 );
    }
    global $wpdb;
    $wpdb->update( $this->table_tokens, [ 'revoked' => 1 ], [ 'id' => $id ] );
    return new WP_REST_Response( [ 'revoked' => true ], 200 );
  }
  #endregion

  #region Helpers
  private function get_client( $client_id ) {
    if ( !is_string( $client_id ) || $client_id === '' ) {
      return null;
    }
    global $wpdb;
    return $wpdb->get_row( $wpdb->prepare(
      "SELECT * FROM {$this->table_clients} WHERE client_id = %s LIMIT 1",
      $client_id
    ) );
  }

  private function redirect_uri_registered( $client, $redirect_uri ) {
    if ( !$client || !is_string( $redirect_uri ) || $redirect_uri === '' ) {
      return false;
    }
    $registered = json_decode( $client->redirect_uris, true );
    if ( !is_array( $registered ) ) {
      return false;
    }
    foreach ( $registered as $uri ) {
      if ( hash_equals( (string) $uri, $redirect_uri ) ) {
        return true;
      }
    }
    return false;
  }

  private function append_params( $url, $params ) {
    $sep = strpos( $url, '?' ) === false ? '?' : '&';
    return $url . $sep . http_build_query( $params );
  }

  private function random_token( $bytes = 32 ) {
    return bin2hex( random_bytes( (int) $bytes ) );
  }

  private function oauth_error( $code, $description, $status = 400 ) {
    $response = new WP_REST_Response( [
      'error' => $code,
      'error_description' => $description,
    ], $status );
    $response->header( 'Cache-Control', 'no-store' );
    $response->header( 'Pragma', 'no-cache' );
    return $response;
  }

  /**
   * Add WWW-Authenticate header to 401 responses on the protected MCP route,
   * pointing clients at the resource metadata document so they can discover
   * the authorization server automatically.
   */
  public function add_www_authenticate_header( $response, $server, $request ) {
    if ( !( $response instanceof WP_HTTP_Response ) ) {
      return $response;
    }
    $route = $request instanceof WP_REST_Request ? $request->get_route() : '';
    if ( $route !== '/' . $this->namespace . '/http' ) {
      return $response;
    }
    $status = $response->get_status();
    if ( $status !== 401 && $status !== 403 ) {
      return $response;
    }
    $resource_metadata = rest_url( $this->namespace . '/.well-known/oauth-protected-resource' );
    $response->header(
      'WWW-Authenticate',
      sprintf( 'Bearer realm="MCP", resource_metadata="%s"', $resource_metadata )
    );
    return $response;
  }
  #endregion

  #region HTML rendering (consent + error pages)
  private function render_consent_page( $client, $params, $user ) {
    $nonce = wp_create_nonce( self::NONCE_ACTION );
    $action_url = rest_url( $this->namespace . '/oauth/authorize' );
    $site_name = get_bloginfo( 'name' );
    $client_name = $client->client_name ?: 'Unnamed MCP Client';
    $role_label = $this->describe_user_role( $user );

    status_header( 200 );
    nocache_headers();
    header( 'Content-Type: text/html; charset=utf-8' );

    $hidden_fields = [
      'client_id' => $params['client_id'],
      'redirect_uri' => $params['redirect_uri'],
      'state' => $params['state'],
      'scope' => $params['scope'],
      'code_challenge' => $params['code_challenge'],
      'code_challenge_method' => $params['code_challenge_method'],
      '_mwai_nonce' => $nonce,
    ];

    echo '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">';
    echo '<meta name="viewport" content="width=device-width, initial-scale=1">';
    echo '<title>' . esc_html( sprintf( 'Authorize %s', $client_name ) ) . '</title>';
    echo $this->consent_styles();
    echo '</head><body><main class="mwai-oauth-card">';

    echo '<h1>Authorize this app</h1>';
    echo '<p class="mwai-oauth-app"><strong>' . esc_html( $client_name ) . '</strong> wants to connect to <strong>' . esc_html( $site_name ) . '</strong>.</p>';

    echo '<div class="mwai-oauth-meta">';
    echo '<div><span class="mwai-oauth-label">Signed in as</span><span class="mwai-oauth-value">' . esc_html( $user->display_name ) . ' (' . esc_html( $user->user_login ) . ')</span></div>';
    echo '<div><span class="mwai-oauth-label">Permissions</span><span class="mwai-oauth-value">' . esc_html( $role_label ) . '</span></div>';
    echo '</div>';

    echo '<p class="mwai-oauth-note">The app will be able to call MCP tools using your account. You can revoke access at any time from AI Engine settings.</p>';

    echo '<form method="POST" action="' . esc_url( $action_url ) . '">';
    foreach ( $hidden_fields as $name => $value ) {
      echo '<input type="hidden" name="' . esc_attr( $name ) . '" value="' . esc_attr( $value ) . '">';
    }
    echo '<div class="mwai-oauth-buttons">';
    echo '<button type="submit" name="action" value="approve" class="mwai-oauth-approve">Approve</button>';
    echo '<button type="submit" name="action" value="deny" class="mwai-oauth-deny">Deny</button>';
    echo '</div>';
    echo '</form>';

    echo '</main></body></html>';
  }

  private function render_error_page( $message ) {
    status_header( 400 );
    nocache_headers();
    header( 'Content-Type: text/html; charset=utf-8' );
    echo '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">';
    echo '<title>Authorization error</title>';
    echo $this->consent_styles();
    echo '</head><body><main class="mwai-oauth-card">';
    echo '<h1>Authorization error</h1>';
    echo '<p class="mwai-oauth-note">' . esc_html( $message ) . '</p>';
    echo '</main></body></html>';
  }

  private function describe_user_role( $user ) {
    if ( !$user || empty( $user->roles ) ) {
      return 'No role';
    }
    $role = $user->roles[0];
    $names = [
      'administrator' => 'Administrator (full access)',
      'editor' => 'Editor',
      'author' => 'Author',
      'contributor' => 'Contributor',
      'subscriber' => 'Subscriber',
    ];
    return $names[ $role ] ?? ucfirst( $role );
  }

  private function consent_styles() {
    return '<style>
      body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f1f2f5; color: #1d2330; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
      .mwai-oauth-card { background: #fff; border-radius: 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.08); padding: 36px 36px 28px; max-width: 440px; width: 100%; }
      .mwai-oauth-card h1 { font-size: 22px; margin: 0 0 16px; font-weight: 600; }
      .mwai-oauth-app { font-size: 15px; line-height: 1.5; margin: 0 0 24px; }
      .mwai-oauth-meta { background: #f7f8fa; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px; }
      .mwai-oauth-meta > div { display: flex; justify-content: space-between; align-items: baseline; padding: 6px 0; font-size: 14px; }
      .mwai-oauth-label { color: #6b7280; }
      .mwai-oauth-value { color: #1d2330; font-weight: 500; text-align: right; }
      .mwai-oauth-note { font-size: 13px; color: #6b7280; line-height: 1.5; margin: 0 0 24px; }
      .mwai-oauth-buttons { display: flex; gap: 10px; }
      .mwai-oauth-buttons button { flex: 1; padding: 11px 14px; border-radius: 8px; border: 1px solid transparent; font-size: 14px; font-weight: 600; cursor: pointer; transition: background .15s; }
      .mwai-oauth-approve { background: #2271b1; color: #fff; }
      .mwai-oauth-approve:hover { background: #135e96; }
      .mwai-oauth-deny { background: #fff; color: #1d2330; border-color: #d0d4da; }
      .mwai-oauth-deny:hover { background: #f1f2f5; }
    </style>';
  }
  #endregion
}
