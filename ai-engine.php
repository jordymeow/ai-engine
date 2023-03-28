<?php
/*
Plugin Name: AI Engine: ChatGPT Chatbot, Content Generator, GPT 3 & 4, Ultra-Customizable
Plugin URI: https://wordpress.org/plugins/ai-engine/
Description: GPT for WordPress. ChatGPT chatbot, image & content generator, finetune/train models, etc. Ultra customizable, extensible, sleek UI. You will love it!
Version: 1.3.87
Author: Jordy Meow
Author URI: https://jordymeow.com
Text Domain: ai-engine

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

define( 'MWAI_VERSION', '1.3.87' );
define( 'MWAI_PREFIX', 'mwai' );
define( 'MWAI_DOMAIN', 'ai-engine' );
define( 'MWAI_ENTRY', __FILE__ );
define( 'MWAI_PATH', dirname( __FILE__ ) );
define( 'MWAI_URL', plugin_dir_url( __FILE__ ) );

require_once( MWAI_PATH . '/classes/init.php' );

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
