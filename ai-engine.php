<?php
/*
Plugin Name: AI Engine
Plugin URI: https://wordpress.org/plugins/ai-engine/
Description: AI meets WordPress. Your site can now chat, write poetry, solve problems, and maybe make you coffee.
Version: 2.8.4
Author: Jordy Meow
Author URI: https://jordymeow.com
Text Domain: ai-engine
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
*/

define( 'MWAI_VERSION', '2.8.4' );
define( 'MWAI_PREFIX', 'mwai' );
define( 'MWAI_DOMAIN', 'ai-engine' );
define( 'MWAI_ENTRY', __FILE__ );
define( 'MWAI_PATH', dirname( __FILE__ ) );
define( 'MWAI_URL', plugin_dir_url( __FILE__ ) );
define( 'MWAI_ITEM_ID', 17631833 );
if ( !defined( 'MWAI_TIMEOUT' ) ) {
  define( 'MWAI_TIMEOUT', 60 * 5 );
}
define( 'MWAI_FALLBACK_MODEL', 'gpt-4.1-nano' );
define( 'MWAI_FALLBACK_MODEL_VISION', 'gpt-4.1-nano' );
define( 'MWAI_FALLBACK_MODEL_JSON', 'gpt-4.1-nano' );

require_once( MWAI_PATH . '/classes/init.php' );

add_filter( 'mwai_ai_exception', function ( $exception ) {
  try {
    // Remove the service prefix if present
    if ( strpos( $exception, 'OpenAI:' ) === 0 ) {
      $exception = trim( substr( $exception, strlen( 'OpenAI:' ) ) );
    }

    // If the remaining string looks like JSON, try to decode it
    $json = json_decode( $exception, true );
    if ( is_array( $json ) && isset( $json['error']['message'] ) ) {
      $exception = $json['error']['message'];
    }

    if ( strpos( $exception, 'OpenAI' ) !== false ) {
      if ( strpos( $exception, 'API URL was not found' ) !== false ) {
        return "Received the 'API URL was not found' error from OpenAI. This actually means that your OpenAI account has not been enabled for the Chat API. You need to either add some credits to OpenAI account, or link a credit card to it.";
      }
    }
    return $exception;
  }
  catch ( Exception $e ) {
    error_log( $e->getMessage() );
  }
  return $exception;
} );

?>
