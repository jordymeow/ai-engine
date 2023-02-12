<?php

require_once( MWAI_PATH . '/vendor/autoload.php' );

#region Constants

// Price as of January 2023: https://openai.com/api/pricing/
define( 'MWAI_OPENAI_PRICING', [
  // Base models:
  [ "model" => "davinci", "price" => 0.02, "type" => "token", "unit" => 1 / 1000 ],
  [ "model" => "curie", "price" => 0.002, "type" => "token", "unit" => 1 / 1000 ],
  [ "model" => "babbage", "price" => 0.0005, "type" => "token", "unit" => 1 / 1000 ],
  [ "model" => "ada", "price" => 0.0004, "type" => "token", "unit" => 1 / 1000 ],
  // Image models:
  [ "model" => "dall-e", "type" => "image", "unit" => 1, "options" => [
      [ "option" => "1024x1024", "price" => 0.02 ],
      [ "option" => "512x512", "price" => 0.018 ],
      [ "option" => "256x256", "price" => 0.016 ]
    ],
  ],
  // Fine-tuned models:
  [ "model" => "fn-davinci", "price" => 0.12, "type" => "token", "unit" => 1 / 1000 ],
  [ "model" => "fn-curie", "price" => 0.012, "type" => "token", "unit" => 1 / 1000 ],
  [ "model" => "fn-babbage", "price" => 0.0024, "type" => "token", "unit" => 1 / 1000 ],
  [ "model" => "fn-ada", "price" => 0.0016, "type" => "token", "unit" => 1 / 1000 ],
]);

define( 'MWAI_CHATBOT_PARAMS', [
	// UI Parameters
	'id' => '',
	'env' => 'chatbot',
	'mode' => 'chat',
	'context' => "Converse as if you were an AI assistant. Be friendly, creative.",
	'ai_name' => "AI: ",
	'user_name' => "User: ",
	'guest_name' => "Guest: ",
	'sys_name' => "System: ",
	'start_sentence' => "Hi! How can I help you?",
	'text_send' => 'Send',
	'text_clear' => 'Clear',
	'text_input_placeholder' => 'Type your message...',
	'style' => 'chatgpt',
	'window' => false,
	'icon' => null,
	'icon_text' => '',
	'icon_position' => 'bottom-right',
	'fullscreen' => false,
	// Chatbot System Parameters
	'casually_fine_tuned' => false,
	'content_aware' => false, 
	'prompt_ending' => null,
	'completion_ending' => null,
	// AI Parameters
	'model' => 'text-davinci-003',
	'temperature' => 0.8,
	'max_tokens' => 1024,
	'max_results' => 3,
	'api_key' => null
] );

define( 'MWAI_LANGUAGES', [
  'en' => 'English',
  'es' => 'Spanish',
  'fr' => 'French',
  'de' => 'German',
  'it' => 'Italian',
  'pt' => 'Portuguese',
  'ru' => 'Russian',
  'ja' => 'Japanese',
  'zh' => 'Chinese',
] );

define ( 'MWAI_LIMITS', [
	'enabled' => true,
	'guests' => [
		'credits' => 3,
		'creditType' => 'queries',
		'timeFrame' => 'day',
		'isAbsolute' => false,
		'overLimitMessage' => "You have reached the limit.",
	],
	'users' => [
		'credits' => 10,
		'creditType' => 'price',
		'timeFrame' => 'month',
		'isAbsolute' => false,
		'overLimitMessage' => "You have reached the limit.",
		'ignoredUsers' => "administrator,editor",
	],
] );

define( 'MWAI_OPTIONS', [
	'module_titles' => true,
	'module_excerpts' => true,
	'module_woocommerce' => true,
	'module_forms' => false,
	'module_blocks' => false,
	'module_playground' => true,
	'module_generator_content' => true,
	'module_generator_images' => true,
	'shortcode_chat' => true,
	'shortcode_chat_params' => MWAI_CHATBOT_PARAMS,
	'shortcode_chat_params_override' => false,
	'shortcode_chat_html' => true,
	'shortcode_chat_formatting' => true,
	'shortcode_chat_syntax_highlighting' => false,
	'shortcode_chat_logs' => '', // 'file', 'db', 'file,db'
	'shortcode_chat_inject' => false,
	'limits' => MWAI_LIMITS,
	'openai_apikey' => false,
	'openai_usage' => [],
	'openai_finetunes' => [],
	'openai_finetunes_deleted' => [],
	'extra_models' => "",
	'debug_mode' => true,
	'languages' => MWAI_LANGUAGES
]);
#endregion

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
			new Meow_MWAI_Modules_Assistants( $this );
		}
		else {
			//new Meow_MWAI_UI( $this );
			if ( $this->get_option( 'shortcode_chat' ) ) {
				new Meow_MWAI_Modules_Chatbot();
			}
		}

		// Advanced core
		if ( class_exists( 'MeowPro_MWAI_Core' ) ) {
			new MeowPro_MWAI_Core( $this );
		}
	}

	#region Helpers
	function can_access_settings() {
		return apply_filters( 'mwai_allow_setup', current_user_can( 'manage_options' ) );
	}

	function can_access_features() {
		$editor_or_admin = current_user_can( 'editor' ) || current_user_can( 'administrator' );
		return apply_filters( 'mwai_allow_usage', $editor_or_admin );
	}

	function isUrl( $url ) {
		return strpos( $url, 'http' ) === 0 ? true : false;
	}

	// Clean the text perfectly, resolve shortcodes, etc, etc.
  function clean_text( $rawText = "" ) {
    $text = strip_tags( $rawText );
    $text = strip_shortcodes( $text );
    $text = html_entity_decode( $text );
    $text = str_replace( array( "\r", "\n" ), "", $text );
    $sentences = preg_split( '/(?<=[.?!])(?=[a-zA-Z ])/', $text );
    foreach ( $sentences as $key => $sentence ) {
      $sentences[$key] = trim( $sentence );
    }
    $text = implode( " ", $sentences );
    $text = preg_replace( '/^[\pZ\pC]+|[\pZ\pC]+$/u', '', $text );
    return $text . " ";
  }

  // Make sure there are no duplicate sentences, and keep the length under a maximum length.
  function clean_sentences( $text, $maxLength = 1024 ) {
    $sentences = preg_split( '/(?<=[.?!])(?=[a-zA-Z ])/', $text );
    $hashes = array();
    $uniqueSentences = array();
    $length = 0;
    foreach ( $sentences as $sentence ) {
      $sentence = preg_replace( '/^[\pZ\pC]+|[\pZ\pC]+$/u', '', $sentence );
      $hash = md5( $sentence );
      if ( !in_array( $hash, $hashes ) ) {
        if ( $length + strlen( $sentence ) > $maxLength ) {
          continue;
        }
        $hashes[] = $hash;
        $uniqueSentences[] = $sentence;
        $length += strlen( $sentence );
      }
    }
    $text = implode( " ", $uniqueSentences );
    $text = preg_replace( '/^[\pZ\pC]+|[\pZ\pC]+$/u', '', $text );
    return $text;
  }

	function get_text_from_postId( $postId ) {
		$post = get_post( $postId );
		if ( !$post ) {
			return false;
		}
		$post->post_content = apply_filters( 'the_content', $post->post_content );
		$text = $this->clean_text( $post->post_content );
		$text = $this->clean_sentences( $text );
		return $text;
	}

	function get_session_id() {
		if ( !isset( $_SESSION ) ) {
			error_log("AI Engine: There is no session.");
			return uniqid();
		}
		if ( isset( $_SESSION['mwai_session_id'] ) ) {
			return $_SESSION['mwai_session_id'];
		}
		else {
			$session_id = uniqid();
			$_SESSION['mwai_session_id'] = $session_id;
			return $session_id;
		}
	}

	// Get the UserID from the data, or from the current user
  function get_user_id( $data = null ) {
    if ( isset( $data ) && isset( $data['userId'] ) ) {
      return (int)$data['userId'];
    }
    if ( is_user_logged_in() ) {
      $current_user = wp_get_current_user();
      if ( $current_user->ID > 0 ) {
        return $current_user->ID;
      }
    }
    return null;
  }

	function get_ip_address( $data = null ) {
    if ( isset( $data ) && isset( $data['ip'] ) ) {
      $data['ip'] = (string)$data['ip'];
    }
    else {
      if ( isset( $_SERVER['REMOTE_ADDR'] ) ) {
        $data['ip'] = $_SERVER['REMOTE_ADDR'];
      }
      else if ( isset( $_SERVER['HTTP_CLIENT_IP'] ) ) {
        $data['ip'] = $_SERVER['HTTP_CLIENT_IP'];
      }
      else if ( isset( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
        $data['ip'] = $_SERVER['HTTP_X_FORWARDED_FOR'];
      }
    }
    return $data['ip'];
  }

	function markdown_to_html( $content ) {
		$Parsedown = new Parsedown();
		$content = $Parsedown->text( $content );
		return $content;
	}
	#endregion

	#region Options
	function get_all_options() {
		$options = get_option( $this->option_name, null );
		foreach ( MWAI_OPTIONS as $key => $value ) {
			if ( !isset( $options[$key] ) ) {
				$options[$key] = $value;
			}
			if ( $key === 'languages' ) {
				$options[$key] = apply_filters( 'mwai_languages', $options[$key] );
			}
		}
		$options['shortcode_chat_default_params'] = MWAI_CHATBOT_PARAMS;
		$options['default_limits'] = MWAI_LIMITS;
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
}

?>