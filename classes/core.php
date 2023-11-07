<?php

require_once( MWAI_PATH . '/vendor/autoload.php' );
require_once( MWAI_PATH . '/constants/init.php' );

use Rahul900day\Gpt3Encoder\Encoder;

define( 'MWAI_IMG_WAND', MWAI_URL . '/images/wand.png' );
define( 'MWAI_IMG_WAND_HTML', "<img style='height: 22px; margin-bottom: -5px; margin-right: 8px;'
  src='" . MWAI_IMG_WAND . "' alt='AI Wand' />" );
define( 'MWAI_IMG_WAND_HTML_XS', "<img style='height: 16px; margin-bottom: -2px;'
  src='" . MWAI_IMG_WAND . "' alt='AI Wand' />" );
	
class Meow_MWAI_Core
{
	public $admin = null;
	public $is_rest = false;
	public $is_cli = false;
	public $site_url = null;
	public $ai = null;
	private $option_name = 'mwai_options';
	private $themes_option_name = 'mwai_themes';
	private $chatbots_option_name = 'mwai_chatbots';
	private $nonce = null;
	public $defaultChatbotParams = MWAI_CHATBOT_PARAMS;

	// Cached
	private $options = null;

	public function __construct() {
		$this->site_url = get_site_url();
		$this->is_rest = MeowCommon_Helpers::is_rest();
		$this->is_cli = defined( 'WP_CLI' );
		$this->ai = new Meow_MWAI_Engines_Core( $this );
		add_action( 'plugins_loaded', array( $this, 'init' ) );
		add_action( 'wp_register_script', array( $this, 'register_scripts' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'register_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	#region Init & Scripts
	function init() {
		global $mwai;
		$chatbot_module = null;
		$discussions_module = null;
		new Meow_MWAI_Modules_Security( $this );
		if ( $this->is_rest ) {
			new Meow_MWAI_Rest( $this );
		}
		if ( is_admin() ) {
			new Meow_MWAI_Admin( $this );
			new Meow_MWAI_Modules_Assistants( $this );
		}
		if ( $this->get_option( 'shortcode_chat' ) ) {
			$chatbot_module = new Meow_MWAI_Modules_Chatbot();
			$discussions_module = new Meow_MWAI_Modules_Discussions();
			// new Meow_MWAI_Modules_Chatbot_Legacy();
		}

		// Advanced core
		if ( class_exists( 'MeowPro_MWAI_Core' ) ) {
			new MeowPro_MWAI_Core( $this );
		}

		// Dynamic max tokens
		if ( $this->get_option( 'dynamic_max_tokens' ) ) {
			add_filter( 'mwai_estimate_tokens', array( $this, 'dynamic_max_tokens' ), 10, 2 );
		}

		$mwai = new Meow_MWAI_API( $chatbot_module, $discussions_module );
	}

	public function register_scripts() {
		wp_register_script( 'mwai_highlight', MWAI_URL . 'vendor/highlightjs/highlight.min.js', [], '11.7', false );
	}

	public function enqueue_scripts() {
		$this->register_scripts();
		wp_enqueue_script( "mwai_highlight" );
	}

	#endregion

	#region Roles & Capabilities

	function can_access_settings() {
		return apply_filters( 'mwai_allow_setup', current_user_can( 'manage_options' ) );
	}

	function can_access_features() {
		$editor_or_admin = current_user_can( 'editor' ) || current_user_can( 'administrator' );
		return apply_filters( 'mwai_allow_usage', $editor_or_admin );
	}
	
	function can_access_public_api( $feature, $extra ) {
		$logged_in = is_user_logged_in();
		return apply_filters( 'mwai_allow_public_api', $logged_in, $feature, $extra );
	}

	#endregion

	#region Text-Related Helpers

	// Clean the text perfectly, resolve shortcodes, etc, etc.
  function cleanText( $rawText = "" ) {
		$text = html_entity_decode( $rawText );
		$text = wp_strip_all_tags( $text );
		$text = preg_replace( '/[\r\n]+/', "\n", $text );
		$text = preg_replace( '/\n+/', "\n", $text );
		$text = preg_replace( '/\t+/', "\t", $text );
		return $text . " ";
  }

  // Make sure there are no duplicate sentences, and keep the length under a maximum length.
  function cleanSentences( $text, $maxTokens = null ) {
    //$sentences = preg_split( '/(?<=[.?!])(?=[a-zA-Z ])/', $text );
		$maxTokens = $maxTokens ? $maxTokens : $this->get_option( 'context_max_tokens', 1024 );
		$sentences = preg_split('/(?<=[.?!。．！？])+/u', $text);
    $hashes = array();
    $uniqueSentences = array();
    $length = 0;
    foreach ( $sentences as $sentence ) {
      $sentence = preg_replace( '/^[\pZ\pC]+|[\pZ\pC]+$/u', '', $sentence );
      $hash = md5( $sentence );
      if ( !in_array( $hash, $hashes ) ) {
				$tokensCount = apply_filters( 'mwai_estimate_tokens', 0, $sentence );
        if ( $length + $tokensCount > $maxTokens ) {
          continue;
        }
        $hashes[] = $hash;
        $uniqueSentences[] = $sentence;
        $length += $tokensCount;
      }
    }
    $freshText = implode( " ", $uniqueSentences );
    $freshText = preg_replace( '/^[\pZ\pC]+|[\pZ\pC]+$/u', '', $freshText );
    return $freshText;
  }

	function getCleanPostContent( $postId ) {
		$post = get_post( $postId );
		if ( !$post ) {
			return false;
		}
		$text = apply_filters( 'mwai_pre_post_content', $post->post_content, $postId );
		$pattern = '/\[mwai_.*?\]/';
    $text = preg_replace( $pattern, '', $text );
		if ( $this->get_option( 'resolve_shortcodes' ) ) {
			$text = apply_filters( 'the_content', $text );
		}
		else {
			$pattern = "/\[[^\]]+\]/";
    	$text = preg_replace( $pattern, '', $text );
			$pattern = "/<!--\s*\/?wp:[^\>]+-->/";
			$text = preg_replace( $pattern, '', $text );
		}
		$text = $this->cleanText( $text );
		$text = $this->cleanSentences( $text );
		$text = apply_filters( 'mwai_post_content', $text, $postId );
		return $text;
	}

	function markdown_to_html( $content ) {
		$Parsedown = new Parsedown();
		$content = $Parsedown->text( $content );
		return $content;
	}

	function get_post_language( $postId ) {
		$locale = get_locale();
		$code = strtolower( substr( $locale, 0, 2 ) );
		$humanLanguage = strtr( $code, MWAI_ALL_LANGUAGES );
		$lang = apply_filters( 'wpml_post_language_details', null, $postId );
		if ( !empty( $lang ) ) {
			$locale = $lang['locale'];
			$humanLanguage = $lang['display_name'];
		}
		return strtolower( "$locale ($humanLanguage)" );
	}
	#endregion

	#region Users/Sessions Helpers

	function get_nonce() {
		if ( !is_user_logged_in() ) {
			return null;
		}
		if ( isset( $this->nonce ) ) {
			return $this->nonce;
		}
		$this->nonce = wp_create_nonce( 'wp_rest' );
		return $this->nonce;
	}

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

	function getUserData() {
		$user = wp_get_current_user();
		if ( empty( $user ) || empty( $user->ID ) ) {
			return null;
		}
		$placeholders = array(
			'FIRST_NAME' => get_user_meta( $user->ID, 'first_name', true ),
			'LAST_NAME' => get_user_meta( $user->ID, 'last_name', true ),
			'USER_LOGIN' => isset( $user ) && isset($user->data) && isset( $user->data->user_login ) ? 
				$user->data->user_login : null,
			'DISPLAY_NAME' => isset( $user ) && isset( $user->data ) && isset( $user->data->display_name ) ?
				$user->data->display_name : null,
			'AVATAR_URL' => get_avatar_url( get_current_user_id() ),
		);
		return $placeholders;
	}		

	function get_ip_address( $params = null ) {
		$ip = '127.0.0.1';
		$headers = [
			'HTTP_TRUE_CLIENT_IP',
			'HTTP_CF_CONNECTING_IP',
			'HTTP_X_REAL_IP',
			'HTTP_CLIENT_IP',
			'HTTP_X_FORWARDED_FOR',
			'HTTP_X_FORWARDED',
			'HTTP_X_CLUSTER_CLIENT_IP',
			'HTTP_FORWARDED_FOR',
			'HTTP_FORWARDED',
			'REMOTE_ADDR',
		];
	
		if ( isset( $params ) && isset( $params[ 'ip' ] ) ) {
			$ip = ( string )$params[ 'ip' ];
		} else {
			foreach ( $headers as $header ) {
				if ( array_key_exists( $header, $_SERVER ) && !empty( $_SERVER[ $header ] && $_SERVER[ $header ] != '::1' ) ) {
					$address_chain = explode( ',', wp_unslash( $_SERVER [ $header ] ) );
					$ip = filter_var( trim( $address_chain[ 0 ] ), FILTER_VALIDATE_IP );
					break;
				}
			}
		}
	
		return filter_var( apply_filters( 'mwai_get_ip_address', $ip ), FILTER_VALIDATE_IP );
  	}

	#endregion

	#region Other Helpers

	function generateRandomId( $length = 8, $excludeIds = [] ) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyz';
		$charactersLength = strlen( $characters );
		$randomId = '';
		for ( $i = 0; $i < $length; $i++ ) {
			$randomId .= $characters[rand( 0, $charactersLength - 1 )];
		}
		if ( in_array( $randomId, $excludeIds ) ) {
			return $this->generateRandomId( $length, $excludeIds );
		}
		return $randomId;
	}

	function isUrl( $url ) {
		return strpos( $url, 'http' ) === 0 ? true : false;
	}

	function getPostTypes() {
		$excluded = array( 'attachment', 'revision', 'nav_menu_item' );
		$post_types = array();
		$types = get_post_types( [], 'objects' );

		// Let's get the Post Types that are enabled for Embeddings Sync
		$embeddingsSettings = $this->get_option( 'embeddings' );
    $syncPostTypes = isset( $embeddingsSettings['syncPostTypes'] ) ? $embeddingsSettings['syncPostTypes'] : [];
		
		foreach ( $types as $type ) {
			$forced = in_array( $type->name, $syncPostTypes );
			// Should not be excluded.
			if ( !$forced && in_array( $type->name, $excluded ) ) {
				continue;
			}
			// Should be public.
			if ( !$forced && !$type->public ) {
				continue;
			}
			$post_types[] = array(
				'name' => $type->labels->name,
				'type' => $type->name,
			);
		}

		// Let's get the Post Types that are enabled for Embeddings Sync
		$embeddingsSettings = $this->get_option( 'embeddings' );
    $syncPostTypes = isset( $embeddingsSettings['syncPostTypes'] ) ? $embeddingsSettings['syncPostTypes'] : [];

		return $post_types;
	}

	function getCleanPost( $post ) {
		if ( is_object( $post ) ) {
			$post = (array)$post;
		}
		$language = $this->get_post_language( $post['ID'] );
		$content = $this->getCleanPostContent( $post['ID'] );
		$title = $post['post_title'];
		$excerpt = $post['post_excerpt'];
		$url = get_permalink( $post['ID'] );
		$checksum = wp_hash( $content . $title . $url );
		return [
			'postId' => $post['ID'],
			'title' => $title,
			'content' => $content,
			'excerpt' => $excerpt,
			'url' => $url,
			'language' => $language,
			'checksum' => $checksum,
		];
	}
	#endregion

	#region Usage & Costs

	public function dynamic_max_tokens( $tokens, $text ) {
		// Approximation (fast, no lib)
    $asciiCount = 0;
    $nonAsciiCount = 0;
    for ( $i = 0; $i < mb_strlen( $text ); $i++ ) {
      $char = mb_substr( $text, $i, 1 );
      if ( ord( $char ) < 128 ) {
        $asciiCount++;
      }
      else {
        $nonAsciiCount++;
      }
    }
    $asciiTokens = $asciiCount / 3.5;
    $nonAsciiTokens = $nonAsciiCount * 2.5;
    $tokens = $asciiTokens + $nonAsciiTokens;

    // More exact (slower, and lib)
    if ( PHP_VERSION_ID >= 70400 && function_exists( 'mb_convert_encoding' ) ) {
      try {
        $token_array = Encoder::encode( $text );
        if ( !empty( $token_array ) ) {
          $tokens = count( $token_array );
        }
      }
      catch ( Exception $e ) {
        error_log( $e->getMessage() );
      }
    }

		$tokens = $tokens;
		return (int)$tokens;
	}

  public function recordTokensUsage( $model, $prompt_tokens, $completion_tokens = 0 ) {
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

	public function record_audio_usage( $model, $seconds ) {
		if ( !is_numeric( $seconds ) ) {
			throw new Exception( 'Record usage: seconds is not a number.' );
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
				'seconds' => 0
			);
		}
		$usage[$month][$model]['seconds'] += $seconds;
		$this->update_option( 'openai_usage', $usage );
		return [
			'seconds' => $seconds
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

	#region Streaming
	public function stream_push( $data ) {
		$out = "data: " . json_encode( $data );
		echo $out;
		echo "\n\n";
		if ( ob_get_level() > 0 ) {
			ob_end_flush();
		}
		flush();
	}
	#endregion

	#region Options
	function getThemes() {
		$themes = get_option( $this->themes_option_name, [] );
		$themes = empty( $themes ) ? [] : $themes;

		$internalThemes = [
			'chatgpt' => [
				'type' => 'internal', 'name' => 'ChatGPT', 'themeId' => 'chatgpt',
				'settings' => [], 'style' => ""
			],
			'messages' => [
				'type' => 'internal', 'name' => 'Messages', 'themeId' => 'messages',
				'settings' => [], 'style' => ""
			],
		];
		$customThemes = [];
		foreach ( $themes as $theme ) {
			if ( isset( $internalThemes[$theme['themeId']] ) ) {
				$internalThemes[$theme['themeId']] = $theme;
				continue;
			}
			$customThemes[] = $theme;
		}
		return array_merge(array_values($internalThemes), $customThemes);
	}

	function updateThemes( $themes ) {
		update_option( $this->themes_option_name, $themes );
		return $themes;
	}

	function getChatbots() {
		$chatbots = get_option( $this->chatbots_option_name, [] );
		$hasChanges = false;
		if ( empty( $chatbots ) ) {
			$chatbots = [ array_merge( MWAI_CHATBOT_DEFAULT_PARAMS, ['name' => 'Default', 'botId' => 'default' ] ) ];
		}
		foreach ( $chatbots as &$chatbot ) {
			foreach ( MWAI_CHATBOT_DEFAULT_PARAMS as $key => $value ) {
				// Use default value if not set.
				if ( !isset( $chatbot[$key] ) ) {
					$chatbot[$key] = $value;
				}
			}
			// After September 2023, let's remove this if statement.
			if ( isset( $chatbot['chatId'] ) ) {
				$chatbot['botId'] = $chatbot['chatId'];
				unset( $chatbot['chatId'] );
				$hasChanges = true;
			}
			// After September 2023, let's remove this if statement.
			if ( empty( $chatbot['botId'] ) && $chatbot['name'] === 'default' ) {
				$chatbot['botId'] = sanitize_title( $chatbot['name'] );
				$hasChanges = true;
			}
		}
		if ( $hasChanges ) {
			update_option( $this->chatbots_option_name, $chatbots );
		}
		return $chatbots;
	}

	function getChatbot( $botId ) {
		$chatbots = $this->getChatbots();
		foreach ( $chatbots as $chatbot ) {
			if ( $chatbot['botId'] === (string)$botId ) {
				// Somehow, the default was set to "openai" when creating a new chatbot, but that overrided
				// the default value in the Settings. It should be always empty here (except if we add this
				// into the Settings of the chatbot).
				$chatbot['service'] = null;
				return $chatbot;
			}
		}
		return null;
	}

	function getTheme( $themeId ) {
		$themes = $this->getThemes();
		foreach ( $themes as $theme ) {
			if ( $theme['themeId'] === $themeId ) {
				return $theme;
			}
		}
		return null;
	}

	function updateChatbots( $chatbots ) {
		$htmlFields = [ 'textCompliance', 'aiName', 'userName', 'startSentence' ];
		$whiteSpacedFields = [ 'context' ];
		foreach ( $chatbots as &$chatbot ) {
			foreach ( $chatbot as $key => &$value ) {
				if ( in_array( $key, $htmlFields ) ) {
					$value = wp_kses_post( $value );
				}
				else if ( in_array( $key, $whiteSpacedFields ) ) {
					$value = sanitize_textarea_field( $value );
				}
				else {
					$value = sanitize_text_field( $value );
				}
			}
		}

		update_option( $this->chatbots_option_name, $chatbots );
		return $chatbots;
	}

	function get_all_options( $force = false ) {
		// We could cache options this way, but if we do, the apply_filters seems to be called too early.
		// That causes issues with the mwai_languages filter.
		if ( !$force && !is_null( $this->options ) ) {
			return $this->options;
		}
		$options = get_option( $this->option_name, [] );
		$options = $this->sanitize_options( $options );
		foreach ( MWAI_OPTIONS as $key => $value ) {
			if ( !isset( $options[$key] ) ) {
				$options[$key] = $value;
			}
			if ( $key === 'languages' ) {
				// NOTE: If we decide to make a set of options for languages, we can keep it in the settings
				$options[$key] = apply_filters( 'mwai_languages', MWAI_LANGUAGES );
			}
		}
		$options['shortcode_chat_default_params'] = MWAI_CHATBOT_PARAMS;
		$options['chatbot_defaults'] = MWAI_CHATBOT_DEFAULT_PARAMS;
		$options['default_limits'] = MWAI_LIMITS;
		$options['openai_models'] = Meow_MWAI_Engines_OpenAI::get_openai_models();
		$options['fallback_model'] = MWAI_FALLBACK_MODEL;

		$this->options = $options;
		return $options;
	}

	// Sanitize options when we update the plugi or perform some updates
	// if we change the structure of the options.
	function sanitize_options( $options ) {
		$needs_update = false;

		// This upgrades namespace to multi-namespaces (June 2023)
		// After January 2024, let's remove this.
		if ( isset( $options['pinecone'] ) && isset( $options['pinecone']['namespace'] ) ) {
			$options['pinecone']['namespaces'] = [ $options['pinecone']['namespace'] ];
			unset( $options['pinecone']['namespace'] );
			$needs_update = true;
		}

		// Support for Multi Vector DB Environments
		// After June 2024, let's remove this.
		if ( !isset( $options['embeddings_envs'] ) ) {
			$options['embeddings_envs'] = [];
			$default_id = $this->generateRandomId();
			$pinecone = isset( $options['pinecone'] ) ? $options['pinecone'] : [];
			$options['embeddings_envs'][] = [
				'id' => $default_id,
				'name' => 'Pinecone',
				'type' => 'pinecone',
				'apikey' => isset( $pinecone['apikey'] ) ? $pinecone['apikey'] : '',
				'server' => isset( $pinecone['server'] ) ? $pinecone['server'] : 'gcp-starter',
				'indexes' => isset( $pinecone['indexes'] ) ? $pinecone['indexes'] : [],
				'namespaces' => isset( $pinecone['namespaces'] ) ? $pinecone['namespaces'] : [],
				'index' => isset( $pinecone['index'] ) ? $pinecone['index'] : null,
			];
			$options['embeddings_default_env'] = $default_id;
			$needs_update = true;
		}
		if ( isset( $options['pinecone'] ) ) {
			unset( $options['pinecone'] );
			$needs_update = true;
		}

		// Support for Multi AI Environments
		// After June 2024, let's remove this.
		if ( !isset( $options['ai_envs'] ) ) {
			$options['ai_envs'] = [];
			$default_openai_id = $this->generateRandomId();
			$default_azure_id = $this->generateRandomId();
			$openai_service = isset( $options['openai_service'] ) ? $options['openai_service'] : 'openai';
			$openai_apikey = isset( $options['openai_apikey'] ) ? $options['openai_apikey'] : '';
			$azure_endpoint = isset( $options['openai_azure_endpoint'] ) ? $options['openai_azure_endpoint'] : '';

			// OpenAI
			// We create a default OpenAI environment if the API Key is set, or if the Azure Endpoint is not set.
			if ( !empty( $openai_apikey ) || empty( $azure_endpoint )  ) {
				$openai_finetunes = isset( $options['openai_finetunes'] ) ? $options['openai_finetunes'] : [];
				$openai_finetunes_deleted = isset( $options['openai_finetunes_deleted'] ) ?
					$options['openai_finetunes_deleted'] : [];
				$openai_legacy_finetunes = isset( $options['openai_legacy_finetunes'] ) ?
					$options['openai_legacy_finetunes'] : [];
				$openai_legacy_finetunes_deleted = isset( $options['openai_legacy_finetunes_deleted'] ) ?
					$options['openai_legacy_finetunes_deleted'] : [];
				$options['ai_envs'][] = [
					'id' => $default_openai_id,
					'name' => 'OpenAI',
					'type' => 'openai',
					'apikey' => $openai_apikey,
					'finetunes' => $openai_finetunes,
					'finetunes_deleted' => $openai_finetunes_deleted,
					'legacy_finetunes' => $openai_legacy_finetunes,
					'legacy_finetunes_deleted' => $openai_legacy_finetunes_deleted
				];
			}

			// Azure
			if ( !empty( $azure_endpoint ) ) {
				$azure_apikey = isset( $options['openai_azure_apikey'] ) ? $options['openai_azure_apikey'] : '';
				$azure_deployments = isset( $options['openai_azure_deployments'] ) ? $options['openai_azure_deployments'] : [];
				$options['ai_envs'][] = [
					'id' => $default_azure_id,
					'name' => 'Azure',
					'type' => 'azure',
					'apikey' => $azure_apikey,
					'endpoint' => $azure_endpoint,
					'deployments' => $azure_deployments,
				];
			}

			$options['ai_default_env'] = $default_openai_id;
			if ( $openai_service === 'azure' ) {
				$options['ai_default_env'] = $default_azure_id;
			}
			$needs_update = true;
		}

		if ( !empty( $options['openai_apikey'] ) || !empty( $options['openai_azure_apikey'] ) ) {
			unset( $options['openai_apikey'] );
			unset( $options['openai_finetunes'] );
			unset( $options['openai_finetunes_deleted'] );
			unset( $options['openai_legacy_finetunes'] );
			unset( $options['openai_legacy_finetunes_deleted'] );
			unset( $options['openai_azure_apikey'] );
			unset( $options['openai_azure_endpoint'] );
			unset( $options['openai_azure_deployments'] );
			unset( $options['openai_service'] );
			$needs_update = true;
		}

		// The IDs for the embeddings environments are generated here.
		// TODO: We should handle this more gracefully via an option in the Embeddings Settings.
		$embeddings_default_exists = false;
		if ( isset( $options['embeddings_envs'] ) ) {
			foreach ( $options['embeddings_envs'] as &$env ) {
				if ( !isset( $env['id'] ) ) {
					$env['id'] = $this->generateRandomId();
					$needs_update = true;
				}
				if ( $env['id'] === $options['embeddings_default_env'] ) {
					$embeddings_default_exists = true;
				}
			}
		}
		if ( !$embeddings_default_exists ) {
			$options['embeddings_default_env'] = $options['embeddings_envs'][0]['id'] ?? null;
			$needs_update = true;
		}

		// The IDs for the AI environments are generated here.
		$ai_default_exists = false;
		if ( isset( $options['ai_envs'] ) ) {
			foreach ( $options['ai_envs'] as &$env ) {
				if ( !isset( $env['id'] ) ) {
					$env['id'] = $this->generateRandomId();
					$needs_update = true;
				}
				if ( $env['id'] === $options['ai_default_env'] ) {
					$ai_default_exists = true;
				}
			}
		}
		if ( !$ai_default_exists ) {
			$options['ai_default_env'] = $options['ai_envs'][0]['id'] ?? null;
			$needs_update = true;
		}

		if ( $needs_update ) {
			update_option( $this->option_name, $options, false );
		}

		return $options;
	}

	function update_options( $options ) {
		if ( !update_option( $this->option_name, $options, false ) ) {
			return false;
		}
		$options = $this->get_all_options( true );
		return $options;
	}

	function update_option( $option, $value ) {
		$options = $this->get_all_options( true );
		$options[$option] = $value;
		return $this->update_options( $options );
	}

	function get_option( $option, $default = null ) {
		$options = $this->get_all_options();
		return $options[$option] ?? $default;
	}

	function update_ai_env( $env_id, $option, $value ) {
		$options = $this->get_all_options( true );
		foreach ( $options['ai_envs'] as &$env ) {
			if ( $env['id'] === $env_id ) {
				$env[$option] = $value;
				break;
			}
		}
		return $this->update_options( $options );
	}

	function reset_options() {
		return $this->update_options( MWAI_OPTIONS );
	}
	#endregion
}

?>