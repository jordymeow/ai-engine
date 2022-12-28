<?php
/*
Plugin Name: AI Engine: AI-Powered Tools for WP & Playground (GPT-3, ChatGPT)
Plugin URI: https://meowapps.com
Description: Want to give your WordPress site a boost with some AI magic? AI Engine is here to help! It suggests new titles, excerpts, add a chatbot, and open the door to a whole new AI world through the AI Playground! It keeps track of your API usage stats too.
Version: 0.0.3
Author: Jordy Meow
Author URI: https://jordymeow.com
Text Domain: ai-engine

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

define( 'MWAI_VERSION', '0.0.3' );
define( 'MWAI_PREFIX', 'mwai' );
define( 'MWAI_DOMAIN', 'ai-engine' );
define( 'MWAI_ENTRY', __FILE__ );
define( 'MWAI_PATH', dirname( __FILE__ ) );
define( 'MWAI_URL', plugin_dir_url( __FILE__ ) );

require_once( 'classes/init.php' );

?>
