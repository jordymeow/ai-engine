<?php

class Meow_MWAI_Services_Session {
  private $core;
  private $nonce = null;
  // Memoized guest session id for this request. Without it, a guest whose first
  // request has no cookie yet gets a fresh uniqid() on every call (setcookie
  // does not populate $_COOKIE mid-request), so two calls in the same request
  // disagree and guest-scoped checks (e.g. file ownership) mismatch.
  private $sessionId = null;

  public function __construct( $core ) {
    $this->core = $core;
  }

  public function can_start_session() {
    // Check if session already started
    if ( session_status() !== PHP_SESSION_NONE ) {
      return false;
    }

    // Check if we're in a context where sessions shouldn't be started
    if ( wp_doing_cron() || defined( 'DOING_AUTOSAVE' ) ) {
      return false;
    }

    // For AI Engine REST endpoints only - check if it's actually our endpoint
    if ( $this->core->is_rest ) {
      $request_uri = $_SERVER['REQUEST_URI'] ?? '';
      // Only start sessions for actual AI Engine endpoints
      if ( strpos( $request_uri, '/mwai/' ) === false && strpos( $request_uri, 'rest_route=/mwai/' ) === false ) {
        return false;
      }
    }

    // Off by default. Nothing in the plugin reads $_SESSION any more: the guest id moved
    // to the mwai_session_id cookie and the news flag was dropped. Starting one anyway
    // had two costs. It set a PHPSESSID cookie, so once a visitor used a chatbot every
    // later page request carried a session cookie and Varnish (and most page caches)
    // stopped serving them from cache. And PHP holds an exclusive write lock on the
    // session file for the whole request, which serializes concurrent calls: that is the
    // max_execution_time hang the MCP path had to work around with release_session_lock().
    //
    // Set this filter to true if your own code (a function-calling handler, for example)
    // needs $_SESSION on AI Engine's REST endpoints.
    return apply_filters( 'mwai_allow_session', false );
  }

  public function get_nonce( $force = false ) {
    // NONCE GENERATION LOGIC:
    // - For logged-out users (unless forced): Return null - they must use /start_session endpoint
    // - For logged-in users: Create user-specific nonce tied to their WP session
    // - With $force=true: Always create nonce (used by /start_session endpoint)
    //
    // This ensures logged-in users get a nonce matching their auth context on page load,
    // preventing rest_cookie_invalid_nonce errors when cookies are present.
    if ( !$force && !is_user_logged_in() ) {
      return null;
    }
    if ( isset( $this->nonce ) ) {
      return $this->nonce;
    }
    $this->nonce = wp_create_nonce( 'wp_rest' );
    return $this->nonce;
  }

  // ChatID
  public function fix_chat_id( $query, $params ) {
    if ( isset( $query->chatId ) && $query->chatId !== 'N/A' ) {
      return $query->chatId;
    }
    $chatId = isset( $params['chatId'] ) ? $params['chatId'] : $query->session;
    if ( $chatId === 'N/A' ) {
      $chatId = $this->core->get_random_id( 8 );
    }
    $query->set_chat_id( $chatId );
    return $chatId;
  }

  /**
  * The guest session id doubles as an ownership key ("session_<id>" owns uploaded
  * files), so it has to be unguessable AND unforgeable.
  *
  * It used to be uniqid(), which is microtime: knowing roughly when a session started
  * left about a million candidates, so another guest's id could be enumerated rather
  * than stolen. New ids are random_bytes() and carry an HMAC, so a guessed or invented
  * id is rejected before it can claim anything.
  *
  * 3.6.4 still accepted legacy uniqid-shaped cookies so that guests mid-session kept
  * their files. That branch is gone: it left the original hole open to anyone who simply
  * sent a uniqid-shaped value, which is the whole attack. Unsigned cookies are refused.
  *
  * Scope: this stops an id being guessed or invented. It does not stop someone who
  * already holds a visitor's cookie from acting as that visitor, which is true of any
  * session cookie and is why this one is HttpOnly, Secure and expires with the browser.
  * Guessability was the actual defect here, since uniqid() is microtime.
  */
  private function sign_session_id( $id ) {
    return hash_hmac( 'sha256', 'mwai_session|' . $id, wp_salt( 'auth' ) );
  }

  private function parse_session_cookie( $cookie ) {
    if ( !is_string( $cookie ) || $cookie === '' ) {
      return null;
    }
    // Signed format: "<id>.<signature>".
    if ( strpos( $cookie, '.' ) !== false ) {
      list( $id, $signature ) = array_pad( explode( '.', $cookie, 2 ), 2, '' );
      if ( $id !== '' && hash_equals( $this->sign_session_id( $id ), $signature ) ) {
        return $id;
      }
      // Claims to be signed but is not: refuse it rather than trust the raw value.
      return null;
    }
    // Unsigned values are refused, including the legacy uniqid() shape (13 hex chars)
    // that 3.6.4 still accepted for migration. Accepting them kept the original defect
    // alive: the id doubles as an ownership key, so anyone could invent or enumerate a
    // uniqid-shaped value and claim another guest's files. Re-signing such a cookie on
    // first sight would not have helped, since a forged one is indistinguishable from a
    // genuine one at that point. The cost of dropping it is that a guest still holding a
    // pre-3.6.4 cookie starts a new session and loses the files uploaded in the old one.
    // The cookie has no expiry, so it dies with the browser and that window is short.
    return null;
  }

  public function get_session_id() {
    // Check if we have the session cookie
    if ( isset( $_COOKIE['mwai_session_id'] ) ) {
      $sessionId = $this->parse_session_cookie( $_COOKIE['mwai_session_id'] );
      if ( $sessionId !== null ) {
        return $sessionId;
      }
      // An unusable cookie falls through so a fresh, signed one is issued below.
    }

    // Already generated one earlier in this request? Reuse it so repeated calls
    // stay consistent (setcookie above does not populate $_COOKIE mid-request).
    if ( $this->sessionId !== null ) {
      return $this->sessionId;
    }

    // If no cookie exists and we can set one, create it now (lazy initialization)
    if ( !headers_sent() && !wp_doing_cron() ) {
      $this->sessionId = bin2hex( random_bytes( 16 ) );
      @setcookie( 'mwai_session_id', $this->sessionId . '.' . $this->sign_session_id( $this->sessionId ), [
        'expires' => 0,
        'path' => '/',
        'secure' => is_ssl(),
        'httponly' => true,
      ] );
      return $this->sessionId;
    }

    // For cron jobs or when headers are sent, return a temporary session ID
    return wp_doing_cron() ? 'wp-cron' : 'N/A';
  }

  // Cloudflare's published ranges (cloudflare.com/ips), checked 2026-10-23.
  private const CLOUDFLARE_RANGES = [
    '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22', '141.101.64.0/18',
    '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22', '198.41.128.0/17',
    '162.158.0.0/15', '104.16.0.0/13', '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
    '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32', '2405:8100::/32',
    '2a06:98c0::/29', '2c0f:f248::/32',
  ];

  public function get_ip_address( $force = false ) {
    // Forwarded headers are only believed when the request comes from a proxy: a private
    // address (local proxy, load balancer, Cloudflare Tunnel), Cloudflare, or a proxy added
    // with the mwai_trusted_proxies filter. Before, anyone could send X-Forwarded-For
    // and get a fresh IP, and with it fresh guest limits.
    $remote = isset( $_SERVER['REMOTE_ADDR'] ) ? trim( $_SERVER['REMOTE_ADDR'] ) : '';
    $actual_ip = $remote;
    if ( $this->is_trusted_proxy( $remote ) ) {
      $forwarded = [];
      foreach ( [ 'HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP' ] as $key ) {
        if ( !empty( $_SERVER[ $key ] ) ) {
          // Proxies append, so the closest untrusted address (from the right) is the client.
          $forwarded = array_reverse( array_map( 'trim', explode( ',', $_SERVER[ $key ] ) ) );
          break;
        }
      }
      foreach ( $forwarded as $ip ) {
        if ( $this->validate_ip( $ip ) && !$this->is_trusted_proxy( $ip ) ) {
          $actual_ip = $ip;
          break;
        }
      }
    }
    if ( empty( $actual_ip ) ) {
      $actual_ip = '127.0.0.1';
    }

    // If privacy_first is enabled and not forced, return hashed IP
    if ( !$force && $this->core->get_option( 'privacy_first' ) ) {
      // Use a salt that's unique per site but consistent
      $salt = wp_salt( 'auth' );
      // Create a hash that's consistent for the same IP but anonymized
      return 'hashed_' . substr( hash( 'sha256', $actual_ip . $salt ), 0, 16 );
    }

    return $actual_ip;
  }

  public function get_user_data() {
    $user = wp_get_current_user();
    if ( empty( $user ) || empty( $user->ID ) ) {
      return null;
    }

    // Return both the new format (for frontend) and placeholder format (for do_placeholders)
    $userData = [
      'ID' => $user->ID,
      'name' => $user->display_name,
      'email' => $user->user_email,
      'avatar' => get_avatar_url( $user->ID ),
      'type' => 'logged-in',
      // Add placeholder keys for do_placeholders function
      'FIRST_NAME' => get_user_meta( $user->ID, 'first_name', true ),
      'LAST_NAME' => get_user_meta( $user->ID, 'last_name', true ),
      'USER_LOGIN' => isset( $user->data ) && isset( $user->data->user_login ) ?
        $user->data->user_login : null,
      'DISPLAY_NAME' => isset( $user->data ) && isset( $user->data->display_name ) ?
        $user->data->display_name : null,
      'AVATAR_URL' => get_avatar_url( $user->ID ),
    ];

    return $userData;
  }

  public function get_user_id() {
    // This function has to be re-thinked for all other API endpoints
    $userId = null;
    // If there is a current session, we probably know the current user
    if ( is_user_logged_in() ) {
      $userId = get_current_user_id();
    }
    // For guest users, return null instead of generating a string ID
    // This allows the database to store NULL for guests, which displays as "Guest" in the UI
    return $userId;
  }

  /**
   * Get session-based user ID for guest users
   * This creates a unique identifier based on session ID for tracking guest uploads
   *
   * @return string|null Session-based user ID or null if no session
   */
  public function get_session_user_id() {
    $sessionId = $this->get_session_id();
    if ( !$sessionId || $sessionId === 'N/A' ) {
      return null;
    }
    // Create a consistent user ID based on session
    // Prefix with 'session_' to distinguish from real user IDs
    return 'session_' . $sessionId;
  }

  public function get_admin_user() {
    $users = get_users( [ 'role' => 'administrator' ] );
    if ( !empty( $users ) ) {
      return $users[0];
    }
    return null;
  }

  // Private helper methods
  private function is_trusted_proxy( $ip ) {
    if ( empty( $ip ) || filter_var( $ip, FILTER_VALIDATE_IP ) === false ) {
      return false;
    }
    if ( !$this->validate_ip( $ip ) ) {
      return true; // Private or reserved: the request came through something local.
    }
    $ranges = apply_filters( 'mwai_trusted_proxies', self::CLOUDFLARE_RANGES );
    foreach ( (array) $ranges as $range ) {
      if ( $this->ip_in_range( $ip, $range ) ) {
        return true;
      }
    }
    return false;
  }

  private function ip_in_range( $ip, $range ) {
    [ $subnet, $bits ] = array_pad( explode( '/', (string) $range, 2 ), 2, null );
    $ipBin = @inet_pton( $ip );
    $subnetBin = @inet_pton( $subnet );
    if ( $ipBin === false || $subnetBin === false || strlen( $ipBin ) !== strlen( $subnetBin ) ) {
      return false;
    }
    $bits = $bits === null ? strlen( $ipBin ) * 8 : (int) $bits;
    $bytes = intdiv( $bits, 8 );
    if ( substr( $ipBin, 0, $bytes ) !== substr( $subnetBin, 0, $bytes ) ) {
      return false;
    }
    $rest = $bits % 8;
    if ( $rest === 0 ) {
      return true;
    }
    $mask = ( 0xFF << ( 8 - $rest ) ) & 0xFF;
    return ( ord( $ipBin[ $bytes ] ) & $mask ) === ( ord( $subnetBin[ $bytes ] ) & $mask );
  }

  private function validate_ip( $ip ) {
    if ( filter_var( $ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | FILTER_FLAG_IPV6 | FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE ) === false ) {
      return false;
    }
    return true;
  }

}
