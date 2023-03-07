<?php

require_once( MWAI_PATH . '/vendor/autoload.php' );
require_once( MWAI_PATH . '/constants/init.php' );

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

	#region Roles & Capabilities

	function can_access_settings() {
		return apply_filters( 'mwai_allow_setup', current_user_can( 'manage_options' ) );
	}

	function can_access_features() {
		$editor_or_admin = current_user_can( 'editor' ) || current_user_can( 'administrator' );
		return apply_filters( 'mwai_allow_usage', $editor_or_admin );
	}

	#endregion

	#region Text-Related Helpers

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

	function markdown_to_html( $content ) {
		$Parsedown = new Parsedown();
		$content = $Parsedown->text( $content );
		return $content;
	}
	#endregion

	#region Users/Sessions Helpers

	function get_session_id() {
		if ( isset( $_COOKIE['mwai_session_id'] ) ) {
			return $_COOKIE['mwai_session_id'];
		}
		return "N/A";
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
        $data['ip'] = sanitize_text_field( $_SERVER['REMOTE_ADDR'] );
      }
      else if ( isset( $_SERVER['HTTP_CLIENT_IP'] ) ) {
        $data['ip'] = sanitize_text_field( $_SERVER['HTTP_CLIENT_IP'] );
      }
      else if ( isset( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
        $data['ip'] = sanitize_text_field( $_SERVER['HTTP_X_FORWARDED_FOR'] );
      }
    }
    return $data['ip'];
  }

	#endregion

	#region Other Helpers

	function isUrl( $url ) {
		return strpos( $url, 'http' ) === 0 ? true : false;
	}

	#endregion

	#region Usage & Costs

  public function record_tokens_usage( $model, $prompt_tokens, $completion_tokens = 0 ) {
    if ( !is_numeric( $prompt_tokens ) ) {
      throw new Exception( 'Record usage: prompt_tokens is not a number.' );
    }
    if ( !is_numeric( $completion_tokens ) ) {
      $completion_tokens = 0;
    }
    if ( !$model ) {
      throw new Exception( 'Record usage: model is missing.' );
    }
    $usage = $this->get_option( 'openai_usage' );
    $month = date( 'Y-m' );
    if ( !isset( $usage[$month] ) ) {
      $usage[$month] = array();
    }
    if ( !isset( $usage[$month][$model] ) ) {
      $usage[$month][$model] = array(
        'prompt_tokens' => 0,
        'completion_tokens' => 0,
        'total_tokens' => 0
      );
    }
    $usage[$month][$model]['prompt_tokens'] += $prompt_tokens;
    $usage[$month][$model]['completion_tokens'] += $completion_tokens;
    $usage[$month][$model]['total_tokens'] += $prompt_tokens + $completion_tokens;
    $this->update_option( 'openai_usage', $usage );
    return [
      'prompt_tokens' => $prompt_tokens,
      'completion_tokens' => $completion_tokens,
      'total_tokens' => $prompt_tokens + $completion_tokens
    ];
  }

  public function record_images_usage( $model, $resolution, $images ) {
    if ( !$model || !$resolution || !$images ) {
      throw new Exception( 'Missing parameters for record_image_usage.' );
    }
    $usage = $this->get_option( 'openai_usage' );
    $month = date( 'Y-m' );
    if ( !isset( $usage[$month] ) ) {
      $usage[$month] = array();
    }
    if ( !isset( $usage[$month][$model] ) ) {
      $usage[$month][$model] = array(
        'resolution' => array(),
        'images' => 0
      );
    }
    if ( !isset( $usage[$month][$model]['resolution'][$resolution] ) ) {
      $usage[$month][$model]['resolution'][$resolution] = 0;
    }
    $usage[$month][$model]['resolution'][$resolution] += $images;
    $usage[$month][$model]['images'] += $images;
    $this->update_option( 'openai_usage', $usage );
    return [
      'resolution' => $resolution,
      'images' => $images
    ];
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
				// TODO: If we decide to make a set of options for languages, we can keep it in the settings
				$options[$key] = MWAI_LANGUAGES;
				$options[$key] = apply_filters( 'mwai_languages', $options[$key] );
			}
		}
		$options['shortcode_chat_default_params'] = MWAI_CHATBOT_PARAMS;
		$options['default_limits'] = MWAI_LIMITS;
		$options['openai_models'] = MWAI_OPENAI_MODELS;
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