<?php

/**
 * Class Meow_MWAI_Logging
 *
 * A logging utility that uses the WordPress Filesystem API for storage,
 * with fallback to PHP error_log when necessary.
 */
class Meow_MWAI_Logging {
  private static $plugin_name;
  private static $option_name;
  private static $log_file_path;
  private static $fs;
  private static $log_count               = 0;
  private static $rotate_check_frequency  = 10;
  private static $max_log_size            = 5 * 1024 * 1024; // 5 MB

  /**
   * Initialize the logger.
   *
   * @param string $option_name Option key for settings.
   * @param string $plugin_name Plugin identifier for error log prefix.
   */
  public static function init( $option_name, $plugin_name ) {
    self::$plugin_name = $plugin_name;
    self::$option_name = $option_name;

    // Attempt to use WP_Filesystem only if the 'direct' method is available.
    if ( ! function_exists( 'WP_Filesystem' ) ) {
      require_once ABSPATH . 'wp-admin/includes/file.php';
    }

    if ( function_exists( 'get_filesystem_method' ) && 'direct' === get_filesystem_method() ) {
      // If 'direct' is allowed, try to initialize the filesystem (no credentials prompt).
      if ( WP_Filesystem() ) {
        global $wp_filesystem;
        self::$fs = $wp_filesystem;
      } else {
        // Could not initialize
        error_log( self::$plugin_name . " : Could not init direct WP_Filesystem. Falling back to error_log only." );
        self::$fs = null;
      }
    } else {
      // Not 'direct' or not available; skip filesystem usage
      self::$fs = null;
    }

    // Attempt to determine or create the log file path
    self::$log_file_path = self::get_logs_path( true );
  }

  /**
   * Determine or create the log file path using WP_Filesystem.
   *
   * @param bool $create Whether to generate a new file if none exists.
   * @return string|false Path to log file or false if unavailable.
   */
  private static function get_logs_path( $create = false ) {
    $options = get_option( self::$option_name, null );
    if ( is_null( $options ) ) {
      return null;
    }

    // If we don't have a filesystem reference, we can't create or write a file
    if ( empty( self::$fs ) ) {
      return null;
    }

    $path = empty( $options['logs_path'] ) ? '' : $options['logs_path'];

    if ( $path && self::$fs->exists( $path ) ) {
      return $path;
    }

    if ( ! $create ) {
      return null;
    }

    $uploads  = wp_upload_dir();
    $base_dir = trailingslashit( $uploads['basedir'] );

    if ( ! self::$fs->is_dir( $base_dir ) ) {
      self::$fs->mkdir( $base_dir );
    }

    // Adjust MWAI_PREFIX to whatever your actual constant or value is
    $filename = MWAI_PREFIX . '_' . self::random_ascii_chars() . '.log';
    $new_path = $base_dir . $filename;

    self::$fs->put_contents( $new_path, '', FS_CHMOD_FILE );

    $options['logs_path'] = $new_path;
    update_option( self::$option_name, $options );

    return $new_path;
  }

  /**
   * Check if logging is enabled via plugin options and FS availability.
   *
   * @return bool
   */
  private static function is_logging_enabled() {
    $options           = get_option( self::$option_name, null );
    if ( is_null( $options ) ) {
      return false;
    }

    $module_devtools   = empty( $options['module_devtools'] ) ? false : $options['module_devtools'];
    $server_debug_mode = empty( $options['server_debug_mode'] ) ? false : $options['server_debug_mode'];

    return ( $module_devtools && $server_debug_mode && ! empty( self::$fs ) );
  }

  /**
   * Internal log writer. Appends to file and/or error_log.
   */
  private static function add( $message = null, $icon = '', $error_log = false ) {
    $date    = date( 'Y-m-d H:i:s' );
    $message = is_string( $message ) ? strip_tags( $message ) : $message;

    if ( empty( $message ) ) {
      $entry = "\n";
    }
    else if ( ! empty( $icon ) ) {
      $entry = "$date: $icon $message\n";
    }
    else {
      $entry = "$date: $message\n";
    }

    // Write to file if enabled and if a log file path exists
    if ( self::is_logging_enabled() && self::$log_file_path ) {
      if ( self::$fs->exists( self::$log_file_path ) ) {
        $current = self::$fs->get_contents( self::$log_file_path );
        self::$fs->put_contents( self::$log_file_path, $current . $entry, FS_CHMOD_FILE );
      }
      else {
        self::$fs->put_contents( self::$log_file_path, $entry, FS_CHMOD_FILE );
      }
    }

    // Always send to PHP error_log if $error_log is true
    if ( $error_log && ! empty( $message ) ) {
      \error_log( self::$plugin_name . " : $message" );
    }

    self::$log_count++;

    if ( self::$log_count >= self::$rotate_check_frequency ) {
      self::maybe_rotate_log();
      self::$log_count = 0;
    }
  }

  /**
   * Logs a general message.
   *
   * @param string $message The message to log.
   * @param string $icon Optional icon to prepend.
   */
  public static function log( $message = null, $icon = '' ) {
    self::add( $message, $icon );
  }

  /**
   * Logs a warning message.
   *
   * @param string $message The warning message to log.
   * @param string $icon Optional icon to prepend (default ⚠️).
   */
  public static function warn( $message = null, $icon = '⚠️' ) {
    self::add( $message, $icon );
  }

  /**
   * Logs an error message and sends to PHP error_log.
   *
   * @param string $message The error message to log.
   * @param string $icon Optional icon to prepend (default ❌).
   */
  public static function error( $message = null, $icon = '❌' ) {
    self::add( $message, $icon, true );
  }

  /**
   * Logs a deprecated feature notice.
   *
   * @param string $message The message to log.
   */
  public static function deprecated( $message = null ) {
    self::add( $message, '🚨', true );
  }

  /**
   * Clears the log file and resets the option.
   */
  public static function clear() {
    if ( self::$fs && self::$log_file_path && self::$fs->exists( self::$log_file_path ) ) {
      self::$fs->delete( self::$log_file_path );
      $options              = get_option( self::$option_name, null );
      $options['logs_path'] = '';
      update_option( self::$option_name, $options );
      self::$log_file_path  = '';
    }
  }

  /**
   * Retrieves the log contents in reverse order (newest first).
   *
   * @return string
   */
  public static function get() {
    if ( self::$fs && self::$log_file_path && self::$fs->exists( self::$log_file_path ) ) {
      $content = self::$fs->get_contents( self::$log_file_path );
      $lines   = explode( "\n", $content );
      $lines   = array_filter( $lines );
      $lines   = array_reverse( $lines );

      return implode( "\n", $lines );
    }

    return 'Empty log file.';
  }

  /**
   * Checks file size and rotates if exceeding maximum.
   */
  private static function maybe_rotate_log() {
    if ( empty( self::$fs ) || empty( self::$log_file_path ) ) {
      return;
    }

    if ( self::$fs->exists( self::$log_file_path ) ) {
      $size = self::$fs->size( self::$log_file_path );

      if ( $size > self::$max_log_size ) {
        $info     = pathinfo( self::$log_file_path );
        $archived = $info['dirname'] . '/' . $info['filename'] . '_' . date( 'Y-m-d_H-i-s' ) . '.' . $info['extension'];

        self::$fs->move( self::$log_file_path, $archived, true );
        self::$fs->put_contents( self::$log_file_path, '', FS_CHMOD_FILE );
      }
    }
  }

  /**
   * Generates a random ASCII string.
   *
   * @param int $length String length.
   * @return string
   */
  private static function random_ascii_chars( $length = 8 ) {
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $result     = '';

    for ( $i = 0; $i < $length; $i++ ) {
      $result .= $characters[ mt_rand( 0, strlen( $characters ) - 1 ) ];
    }

    return $result;
  }

  /**
   * Shortens a string to a specified length, adding ellipsis if needed.
   *
   * @param int $length String length.
   * @return string
   */
  public static function shorten( $string, $length = 50 ) {
    if ( strlen( $string ) > $length ) {
      $string = rtrim( $string, " \t\n\r\0\x0B,." );
      $string = substr( $string, 0, $length - 3 ) . '...';
    }

    return $string;
  }
}
