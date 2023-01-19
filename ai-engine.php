<?php
/*
Plugin Name: AI Engine: ChatGPT, GPT3 Content & Image Generator, Playground
Plugin URI: https://wordpress.org/plugins/ai-engine/
Description: Elevate your WordPress site with AI! Generate content and images, add a ChatGPT-style bot that can be trained with your data, fine-tune AI models, have fun in the AI Playground, and more! It also tracks the OpenAI usage and offers an internal API for other plugins.
Version: 0.2.7
Author: Jordy Meow
Author URI: https://jordymeow.com
Text Domain: ai-engine

Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

define( 'MWAI_VERSION', '0.2.7' );
define( 'MWAI_PREFIX', 'mwai' );
define( 'MWAI_DOMAIN', 'ai-engine' );
define( 'MWAI_ENTRY', __FILE__ );
define( 'MWAI_PATH', dirname( __FILE__ ) );
define( 'MWAI_URL', plugin_dir_url( __FILE__ ) );

require_once( 'classes/init.php' );

?>
