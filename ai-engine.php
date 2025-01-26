<?php
/*
Plugin Name: AI Engine
Plugin URI: https://wordpress.org/plugins/ai-engine/
Description: Kick off your AI journey with a brilliant chatbot, then take advantage of AI-driven content, automation, and multi-model support.
Version: 2.7.4
Author: Jordy Meow
Author URI: https://jordymeow.com
Text Domain: ai-engine

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

define( 'MWAI_VERSION', '2.7.4' );
define( 'MWAI_PREFIX', 'mwai' );
define( 'MWAI_DOMAIN', 'ai-engine' );
define( 'MWAI_ENTRY', __FILE__ );
define( 'MWAI_PATH', dirname( __FILE__ ) );
define( 'MWAI_URL', plugin_dir_url( __FILE__ ) );
define( 'MWAI_ITEM_ID', 17631833 );
define( 'MWAI_TIMEOUT', 60 * 5 );
define( 'MWAI_FALLBACK_MODEL', 'gpt-4o-mini' );
define( 'MWAI_FALLBACK_MODEL_VISION', 'gpt-4o-mini' );
define( 'MWAI_FALLBACK_MODEL_JSON', 'gpt-4o-mini' );

require_once( MWAI_PATH . '/classes/init.php' );

add_filter( 'mwai_ai_exception', function ( $exception ) {
  try {
    if ( strpos( $exception, "OpenAI" ) !== false ) {
      if ( strpos( $exception, "API URL was not found" ) !== false ) {
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
