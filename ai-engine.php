<?php
/*
Plugin Name: AI Engine: ChatGPT Chatbot, GPT Content Generator, Custom Playground & Features
Plugin URI: https://wordpress.org/plugins/ai-engine/
Description: GPT AI for WordPress. ChatGPT-style chatbot, image/content generator, finetune and train models, etc. Customizable and sleek UI. Extensible features. Your AI Engine for WP!
Version: 0.9.7
Author: Jordy Meow
Author URI: https://jordymeow.com
Text Domain: ai-engine

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

define( 'MWAI_VERSION', '0.9.7' );
define( 'MWAI_PREFIX', 'mwai' );
define( 'MWAI_DOMAIN', 'ai-engine' );
define( 'MWAI_ENTRY', __FILE__ );
define( 'MWAI_PATH', dirname( __FILE__ ) );
define( 'MWAI_URL', plugin_dir_url( __FILE__ ) );

require_once( 'classes/init.php' );

?>
