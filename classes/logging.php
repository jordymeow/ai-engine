<?php

class Meow_MWAI_Logging {
  private static $plugin_name;
  private static $option_name;
  private static $log_file_path;
  private static $log_count = 0;
  private static $rotate_check_frequency = 10;
  private static $max_log_size = 5 * 1024 * 1024; // 5 MB

  /**
   * Initializes the Meow Logging class.
   *
   * @param string $option_name The name of the option where logging settings are stored.
   * @param string $plugin_name The name of the plugin, used in the PHP Error Logs.
   */
  public static function init( $option_name, $plugin_name ) {
    self::$plugin_name = $plugin_name;
    self::$option_name = $option_name;
    self::$log_file_path = self::get_logs_path();
  }

  private static function add( $message = null, $icon = '', $error_log = false ) {
    // Log to a local file
    if ( self::is_logging_enabled() && self::$log_file_path ) {
      $fh = @fopen( self::$log_file_path, 'a' );
      if ( $fh ) {
        $date = date( "Y-m-d H:i:s" );
        $message = self::sanitize_message( $message );
        if ( empty( $message ) ) {
          fwrite( $fh, "\n" );
        }
        else {
          if ( !empty( $icon ) ) {
            fwrite( $fh, "$date: $icon $message\n" );
          }
          else {
            fwrite( $fh, "$date: $message\n" );
          }
        }
        fclose( $fh );
      } else {
        error_log( self::$plugin_name . ": Failed to open log file for writing." );
      }
    }
    // Log to the PHP Error Logs
    if ( $error_log === true && !empty( $message ) ) {
      error_log( self::$plugin_name . ": $message" );
    }
    self::$log_count++;
    if ( self::$log_count >= self::$rotate_check_frequency ) {
      self::maybe_rotate_log();
      self::$log_count = 0;
    }
  }

  /**
   * Logs an error message.
   * It will also be logged to the PHP Error Logs.
   *
   * @param string $message The error message to log.
   * @param string $icon An optional icon to prepend to the log message. Default is '❌'.
   */
  public static function error( $message = null, $icon = '❌' ) {
    self::add( $message, $icon, true );
  }

  /**
   * Logs a warning message.
   *
   * @param string $message The warning message to log.
   * @param string $icon An optional icon to prepend to the log message. Default is '⚠️'.
   */
  public static function warn( $message = null, $icon = '🥲' ) {
    self::add( $message, $icon );
  }
 
  /**
   * Logs a general message.
   *
   * @param string $message The message to log.
   * @param string $icon An optional icon to prepend to the log message. Default is empty.
   */
  public static function log( $message = null, $icon = '' ) {
    self::add( $message, $icon );
  }

  /**
   * Logs a notice of a deprecated feature.
   *
   * @param string $message The message to log.
   * @param string $icon An optional icon to prepend to the log message. Default is '🐞'.
   */
  public static function deprecated( $message = null ) {
    self::add( $message, '🚨', true );
  }

  private static function is_logging_enabled() {
    $options = get_option( self::$option_name, null );
    if ( is_null( $options ) ) {
      return false;
    }
    $module_devtools = empty( $options['module_devtools'] ) ? false : $options['module_devtools'];
    $server_debug_mode = empty( $options['server_debug_mode'] ) ? false : $options['server_debug_mode'];
    return $module_devtools && $server_debug_mode;
  }

  private static function get_logs_path() {
    $uploads_dir = wp_upload_dir();
    $uploads_dir_path = trailingslashit( $uploads_dir['basedir'] );
    $options = get_option( self::$option_name, null );
    if ( is_null( $options ) ) {
      return null;
    }
    $path = empty( $options['logs_path'] ) ? null : $options['logs_path'];
    if ( $path && file_exists( $path ) ) {
      // Ensure the path is legal (within the uploads directory with the MWAI_PREFIX and log extension)
      if ( strpos( $path, $uploads_dir_path ) !== 0 ||
        strpos( $path, MWAI_PREFIX ) === false || substr( $path, -4 ) !== '.log' ) {
        $path = null;
      }
      else {
        return $path;
      }
    }
    if ( !$path ) {
      $path = $uploads_dir_path . MWAI_PREFIX . "_" . self::random_ascii_chars() . ".log";
      if ( !file_exists( $path ) ) {
        touch( $path );
      }
      $options['logs_path'] = $path;
      update_option( self::$option_name, $options );
    }
    return $path;
  }

  private static function random_ascii_chars( $length = 8 ) {
    $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $result = '';
    for ( $i = 0; $i < $length; $i++ ) {
      $result .= $characters[rand( 0, strlen( $characters ) - 1 )];
    }
    return $result;
  }

  /**
   * Clears the log file and resets the log path.
   */
  public static function clear() {
    if ( self::$log_file_path ) {
      if ( substr( self::$log_file_path, -4 ) === '.log' ) {
        unlink( self::$log_file_path );
      }
      $options = get_option( self::$option_name, null );
      if ( $options ) {
        $options['logs_path'] = null;
        update_option( self::$option_name, $options );
        self::$log_file_path = null;
      }
    }
  }

  /**
   * Retrieves the contents of the log file.
   * The lines are returned in reverse order (newest first).
   */
  public static function get() {
    if ( self::$log_file_path && file_exists( self::$log_file_path ) ) {
      $content = file_get_contents( self::$log_file_path );
      $lines = explode( "\n", $content );
      $lines = array_filter( $lines );
      $lines = array_reverse( $lines );
      $content = implode( "\n", $lines );
      return $content;
    }
    return 'Empty log file.';
  }

  private static function maybe_rotate_log() {
    if ( file_exists( self::$log_file_path ) && filesize( self::$log_file_path ) > self::$max_log_size ) {
      $info = pathinfo( self::$log_file_path );
      $new_name = $info['dirname'] . '/' . $info['filename'] . '_' . date( 'Y-m-d_H-i-s' ) . '.' . $info['extension'];
      rename( self::$log_file_path, $new_name );
      touch( self::$log_file_path );
    }
  }

  private static function sanitize_message( $message ) {
    return is_string( $message ) ? strip_tags( $message ) : $message;
  }
}