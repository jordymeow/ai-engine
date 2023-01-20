<?php

require_once( MWAI_PATH . '/vendor/autoload.php' );

define( 'MWAI_CHATBOT_PARAMS', [
	// UI Parameters
	'id' => null,
	'context' => "Converse as if you were an AI assistant. Be friendly, creative.",
	'ai_name' => "AI: ",
	'user_name' => "User: ",
	'sys_name' => "System: ",
	'start_sentence' => "Hi! How can I help you?",
	'text_send' => 'Send',
	'text_input_placeholder' => 'Type your message...',
	'style' => 'chatgpt',
	'window' => false,
	'fullscreen' => false,
	// Chatbot System Parameters
	'casually_fined_tuned' => false,
	'prompt_ending' => null,
	'completion_ending' => null,
	// AI Parameters
	'model' => 'text-davinci-003',
	'temperature' => 0.8,
	'max_tokens' => 1024,
	'api_key' => null
] );

define( 'MWAI_OPTIONS', [
	'module_titles' => true,
	'module_excerpts' => true,
	'module_blocks' => false,
	'shortcode_chat' => true,
	'shortcode_chat_params' => MWAI_CHATBOT_PARAMS,
	'shortcode_chat_default_params' => MWAI_CHATBOT_PARAMS,
	'shortcode_chat_html' => true,
	'shortcode_chat_formatting' => true,
	'shortcode_chat_syntax_highlighting' => false,
	'shortcode_chat_inject' => false,
	'shortcode_imagesbot' => false,
	'openai_apikey' => false,
	'openai_usage' => [],
	'openai_finetunes' => [],
	'openai_finetunes_deleted' => [],
	'extra_models' => ""
]);

class Meow_MWAI_Core
{
	public $admin = null;
	public $is_rest = false;
	public $is_cli = false;
	public $site_url = null;
	public $ai = null;
	private $option_name = 'mwai_options';
	public $defaultChatbotParams = MWAI_CHATBOT_PARAMS;

	public function __construct() {
		$this->site_url = get_site_url();
		$this->is_rest = MeowCommon_Helpers::is_rest();
		$this->is_cli = defined( 'WP_CLI' ) && WP_CLI;
		$this->ai = new Meow_MWAI_AI( $this );
		add_action( 'plugins_loaded', array( $this, 'init' ) );
	}

	function init() {
		if ( $this->is_rest ) {
			new Meow_MWAI_Rest( $this );
		}
		if ( is_admin() ) {
			new Meow_MWAI_Admin( $this );
		}
		else {
			new Meow_MWAI_UI( $this );
		}

		// Modules
		if ( $this->get_option( 'shortcode_chat' ) ) {
			new Meow_MWAI_Modules_Chatbot();
		}
		if ( $this->get_option( 'shortcode_imagesbot' ) ) {
			new Meow_MWAI_Modules_ImagesBot();
		}
		//if ( $this->get_option( 'module_titles' ) ) {
			new Meow_MWAI_Modules_ContentAware();
		//}
	}

	#region Helpers
	function can_access_settings() {
		return apply_filters( 'mwai_allow_setup', current_user_can( 'manage_options' ) );
	}

	function can_access_features() {
		return apply_filters( 'mwai_allow_usage', current_user_can( 'administrator' ) );
	}

	function get_text_from_postId( $postId ) {
		$post = get_post( $postId );
		if ( !$post ) {
			return false;
		}
		$post->post_content = apply_filters( 'the_content', $post->post_content );
		$text = strip_tags( $post->post_content );
		$text = preg_replace( '/^\h*\v+/m', '', $text );
		$text = html_entity_decode( $text );
		return $text;
	}
	#endregion

	#region Options
	function get_all_options() {
		$options = get_option( $this->option_name, null );
		foreach ( MWAI_OPTIONS as $key => $value ) {
			if ( !isset( $options[$key] ) ) {
				$options[$key] = $value;
			}
		}
		return $options;
	}

	// Validate and keep the options clean and logical.
	function sanitize_options() {
		$options = $this->get_all_options();
		$needs_update = false;

		// We can sanitize our future options here, let's always remember it.
		// Now, it is empty...

		if ( $needs_update ) {
			update_option( $this->option_name, $options, false );
		}
		return $options;
	}

	function update_options( $options ) {
		if ( !update_option( $this->option_name, $options, false ) ) {
			return false;
		}
		$options = $this->sanitize_options();
		return $options;
	}

	function update_option( $option, $value ) {
		$options = $this->get_all_options();
		$options[$option] = $value;
		return $this->update_options( $options );
	}

	function get_option( $option, $default = null ) {
		$options = $this->get_all_options();
		return $options[$option] ?? $default;
	}
	#endregion

	function markdown_to_html( $content ) {
		$Parsedown = new Parsedown();
		$content = $Parsedown->text( $content );
		return $content;
	}
}

?>