<?php
/*
Plugin Name: AI Engine: ChatGPT, GPT3 Content & Image Generator, Playground
Plugin URI: https://wordpress.org/plugins/ai-engine/
Description: AI for WordPress! ChatGPT-style chatbot, Image & Content Generator, Train AI Models, etc. Lot of features + Extensible + Customizable + Sleek UI = 💕
Version: 0.4.3
Author: Jordy Meow
Author URI: https://jordymeow.com
Text Domain: ai-engine

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

define( 'MWAI_VERSION', '0.4.3' );
define( 'MWAI_PREFIX', 'mwai' );
define( 'MWAI_DOMAIN', 'ai-engine' );
define( 'MWAI_ENTRY', __FILE__ );
define( 'MWAI_PATH', dirname( __FILE__ ) );
define( 'MWAI_URL', plugin_dir_url( __FILE__ ) );

require_once( 'classes/init.php' );

?>
