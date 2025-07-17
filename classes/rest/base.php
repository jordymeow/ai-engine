<?php

abstract class Meow_MWAI_Rest_Base {
  protected $core;
  protected $namespace = 'mwai/v1';

  public function __construct( $core ) {
    $this->core = $core;
  }

  abstract public function register_routes();

  protected function retrieve_message( $content, $source = 'input' ) {
    if ( is_string( $content ) && preg_match( '/^data:(.*?);base64,/', $content ) ) {
      return null;
    }
    if ( !is_string( $content ) ) {
      throw new Exception( 'Message is not a string (' . $source . ').' );
    }
    $content = sanitize_textarea_field( $content );
    return $content;
  }

  protected function get_rest_nonce( $request, $key = 'restNonce' ) {
    $nonce = $request->get_param( $key );
    $nonce = $nonce ? $nonce : $request->get_header( 'X-Wp-Nonce' );
    $nonce = $nonce ? $nonce : ( isset( $_REQUEST['_wpnonce'] ) ? $_REQUEST['_wpnonce'] : null );
    return $nonce;
  }

  /**
   * Helper method to create REST responses with automatic token refresh
   * 
   * @param array $data The response data
   * @param int $status HTTP status code
   * @return WP_REST_Response
   */
  protected function create_rest_response( $data, $status = 200 ) {
    // Always check if we need to provide a new nonce
    $current_nonce = $this->core->get_nonce( true );
    $request_nonce = isset( $_SERVER['HTTP_X_WP_NONCE'] ) ? $_SERVER['HTTP_X_WP_NONCE'] : null;
    
    // Check if nonce is approaching expiration (WordPress nonces last 12-24 hours)
    // We'll refresh if the nonce is older than 10 hours to be safe
    $should_refresh = false;
    
    if ( $request_nonce ) {
      // Try to determine the age of the nonce
      // WordPress uses a tick system where each tick is 12 hours
      // If we're in the second half of the nonce's life, refresh it
      $time = time();
      $nonce_tick = wp_nonce_tick();
      
      // Verify if the nonce is still valid but getting old
      $verify = wp_verify_nonce( $request_nonce, 'wp_rest' );
      if ( $verify === 2 ) {
        // Nonce is valid but was generated 12-24 hours ago
        $should_refresh = true;
        // Log will be written when token is included in response
      }
    }
    
    // If the nonce has changed or should be refreshed, include the new one
    if ( $should_refresh || ( $request_nonce && $current_nonce !== $request_nonce ) ) {
      $data['new_token'] = $current_nonce;
      
      // Log if server debug mode is enabled
      if ( $this->core->get_option( 'server_debug_mode' ) ) {
        error_log( '[AI Engine] Token refresh: Nonce refreshed (12-24 hours old)' );
      }
    }
    
    return new WP_REST_Response( $data, $status );
  }
}
