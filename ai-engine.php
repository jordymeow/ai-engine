<?php
/*
Plugin Name: AI Engine: ChatGPT, GPT-3 Content & Image Generator, Playground
Plugin URI: https://wordpress.org/plugins/ai-engine/
Description: AI for WordPress. ChatGPT-style chatbot, image & content generator, train AI models, etc. Lot of features, extensible, customizable, sleek UI. Enjoy it! :)
Version: 0.7.3
Author: Jordy Meow
Author URI: https://jordymeow.com
Text Domain: ai-engine

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

define( 'MWAI_VERSION', '0.7.3' );
define( 'MWAI_PREFIX', 'mwai' );
define( 'MWAI_DOMAIN', 'ai-engine' );
define( 'MWAI_ENTRY', __FILE__ );
define( 'MWAI_PATH', dirname( __FILE__ ) );
define( 'MWAI_URL', plugin_dir_url( __FILE__ ) );

require_once( 'classes/init.php' );

?>
