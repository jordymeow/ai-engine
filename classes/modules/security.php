<?php

class Meow_MWAI_Modules_Security {
  public $core = null;
  public $banned_ips = [];
  public $banned_words = [];

  public function __construct( $core ) {
    $this->core = $core;
    $this->banned_ips = $this->core->get_option( 'banned_ips' );
    $this->banned_words = $this->core->get_option( 'banned_words' );

    if ( !empty( $this->banned_ips ) ) {
      add_filter( 'mwai_ai_allowed', [ $this, 'check_banned_ips' ], 5, 3 );
    }
    if ( !empty( $this->banned_words ) ) {
      add_filter( 'mwai_ai_allowed', [ $this, 'check_banned_words' ], 5, 3 );
    }
  }

  function check_banned_ips( $ok, $query, $limits ) {
    if ( $ok !== true || empty( $this->banned_ips ) ) {
      return $ok;
    }
    if ( is_a( $query, 'Meow_MWAI_Query_Embed' ) ) {
      if ( $this->core->can_access_settings() ) {
        return $ok;
      }
    }
    $ip = $this->core->get_ip_address( true );
    if ( $this->is_blocked_ip( $ip, $this->banned_ips ) ) {
      Meow_MWAI_Logging::warn( "Blocked IP: $ip", '🔒' );
      throw new Exception( "Your query has been rejected." );
    }
    return $ok;
  }

  function check_banned_words( $ok, $query, $limits ) {
    if ( $ok !== true || empty( $this->banned_words ) ) {
      return $ok;
    }
    if ( is_a( $query, 'Meow_MWAI_Query_Embed' ) ) {
      if ( $this->core->can_access_settings() ) {
        return $ok;
      }
    }
    $text = $query->get_message();
    $is_substring_match = $this->core->get_option( 'ignore_word_boundaries' );
    foreach ( $this->banned_words as $word ) {
      // Use preg_quote to escape any special characters in the word
      // This is necessary to safely include $word in the regex pattern
      // Add the 'u' modifier to enable Unicode support
      if ( $is_substring_match ) {
        $pattern = '/' . preg_quote( $word, '/' ) . '/iu'; // no \b
      }
      else {
        $pattern = '/\b' . preg_quote( $word, '/' ) . '\b/iu';
      }
      if ( preg_match( $pattern, $text ) ) {
        Meow_MWAI_Logging::warn( "Blocked word: $word", '🔒' );
        throw new Exception( "Your query has been rejected." );
      }
    }
    return $ok;
  }  

  function ip_in_range( $ip, $range ) {
    if ( strpos( $range, '/' ) === false ) {
      $range .= '/32'; // Convert single IP to CIDR notation
    }
    list($range_ip, $subnet) = explode('/', $range, 2);
    if (filter_var($range_ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
      $ip_bin = ip2long($ip);
      $range_ip_bin = ip2long($range_ip);
      $subnet_mask = 0xFFFFFFFF << (32 - $subnet);
      return ($ip_bin & $subnet_mask) == ($range_ip_bin & $subnet_mask);
    }
    elseif (filter_var($range_ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
      $ip_bin = inet_pton($ip);
      $range_ip_bin = inet_pton($range_ip);
      $subnet_mask = str_repeat("\xFF", $subnet >> 3) . str_repeat("\x00", 16 - ($subnet >> 3));
      $subnet_mask[($subnet >> 3)] = chr(0xFF << (8 - ($subnet & 7)));
      return ($ip_bin & $subnet_mask) == ($range_ip_bin & $subnet_mask);
    }
    return false;
  }

  function is_blocked_ip( $ip, $blocked_ips) {
    foreach ( $blocked_ips as $range ) {
      if ( $this->ip_in_range( $ip, $range ) ) {
        return true;
      }
    }
    return false;
  }
}