<?php
/*
Plugin Name: AI Engine: ChatGPT Chatbot, GPT Content Generator, Custom Playground & Features
Plugin URI: https://wordpress.org/plugins/ai-engine/
Description: GPT AI for WordPress. ChatGPT-style chatbot, image/content generator, finetune and train models, etc. Customizable and sleek UI. Extensible features. Your AI Engine for WP!
Version: 1.3.34
Author: Jordy Meow
Author URI: https://jordymeow.com
Text Domain: ai-engine

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

define( 'MWAI_VERSION', '1.3.34' );
define( 'MWAI_PREFIX', 'mwai' );
define( 'MWAI_DOMAIN', 'ai-engine' );
define( 'MWAI_ENTRY', __FILE__ );
define( 'MWAI_PATH', dirname( __FILE__ ) );
define( 'MWAI_URL', plugin_dir_url( __FILE__ ) );

require_once( 'classes/init.php' );

// TODO: Avoid AI Engine JS to load on Rank Math.
// https://wordpress.org/support/topic/conflict-with-another-plugin-rank-math-seo-breaks-image-uploads/
// When used together, it breaks on Rank Math. Not idea where, their JS is compiled and they didn't 
// look into the matter more and repeatedly asked to disable AI Engine on their page. 
// I don't have the force to push them to look where and why it breaks and no time to debug their plugin.

add_action( 'admin_enqueue_scripts', function() { 
  if ( is_admin() && isset( $_GET['page'] ) && strpos( $_GET['page'], 'rank-math' ) !== false ) { 
    wp_dequeue_script( 'mwai_meow_plugin' );
    wp_dequeue_script( 'mwai_meow_plugin-vendor' );
  }
}, 20 );

?>
