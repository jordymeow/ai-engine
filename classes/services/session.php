<?php

class Meow_MWAI_Services_Session {
  private $core;
  private $nonce = null;

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
      if ( !strpos( $request_uri, '/mwai/' ) && !strpos( $request_uri, 'rest_route=/mwai/' ) ) {
        return false;
      }
    }
    
    // Allow developers to override
    return apply_filters( 'mwai_allow_session', true );
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

  public function get_session_id() {
    // Check if we have the session cookie
    if ( isset( $_COOKIE['mwai_session_id'] ) ) {
      return $_COOKIE['mwai_session_id'];
    }

    // If no cookie exists and we can set one, create it now (lazy initialization)
    if ( !headers_sent() && !wp_doing_cron() ) {
      $sessionId = uniqid();
      @setcookie( 'mwai_session_id', $sessionId, [
        'expires' => 0,
        'path' => '/',
        'secure' => is_ssl(),
        'httponly' => true,
      ] );
      return $sessionId;
    }

    // For cron jobs or when headers are sent, return a temporary session ID
    return wp_doing_cron() ? 'wp-cron' : 'N/A';
  }

  public function get_ip_address() {
    $ip_keys = [ 'HTTP_CF_CONNECTING_IP', 'HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR',
      'HTTP_X_FORWARDED', 'HTTP_X_CLUSTER_CLIENT_IP', 'HTTP_X_REAL_IP', 'HTTP_FORWARDED_FOR',
      'HTTP_FORWARDED', 'REMOTE_ADDR' ];
    foreach ( $ip_keys as $key ) {
      if ( array_key_exists( $key, $_SERVER ) === true ) {
        $ips = explode( ',', $_SERVER[$key] );
        foreach ( $ips as $ip ) {
          $ip = trim( $ip );
          if ( $this->validate_ip( $ip ) ) {
            return $ip;
          }
        }
      }
    }
    return isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '127.0.0.1';
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

  public function get_admin_user() {
    $users = get_users( [ 'role' => 'administrator' ] );
    if ( !empty( $users ) ) {
      return $users[0];
    }
    return null;
  }

  // Private helper methods
  private function validate_ip( $ip ) {
    if ( filter_var( $ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 | FILTER_FLAG_IPV6 | FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE ) === false ) {
      return false;
    }
    return true;
  }

}
