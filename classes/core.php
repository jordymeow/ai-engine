<?php

require_once( MWAI_PATH . '/vendor/autoload.php' );
require_once( MWAI_PATH . '/constants/init.php' );

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
	public $files = null;
	public $tasks = null;
	private $option_name = 'mwai_options';
	private $themes_option_name = 'mwai_themes';
	private $chatbots_option_name = 'mwai_chatbots';
	private $nonce = null;

	public $chatbot = null;
	public $discussions = null;

	public function __construct() {
		$this->site_url = get_site_url();
		$this->is_rest = MeowCommon_Helpers::is_rest();
		$this->is_cli = defined( 'WP_CLI' );
		$this->files = new Meow_MWAI_Modules_Files( $this );
		$this->tasks = new Meow_MWAI_Modules_Tasks( $this );

		add_action( 'plugins_loaded', array( $this, 'init' ) );
		add_action( 'wp_register_script', array( $this, 'register_scripts' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'register_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	#region Init & Scripts
	function init() {
		global $mwai;
		$this->chatbot = null;
		$this->discussions = null;
		new Meow_MWAI_Modules_Security( $this );
		if ( $this->is_rest ) {
			new Meow_MWAI_Rest( $this );
		}
		if ( is_admin() ) {
			new Meow_MWAI_Admin( $this );
			new Meow_MWAI_Modules_Utilities( $this );
		}
		if ( $this->get_option( 'shortcode_chat' ) ) {
			$this->chatbot = new Meow_MWAI_Modules_Chatbot();
			$this->discussions = new Meow_MWAI_Modules_Discussions();
		}

		// Advanced core
		if ( class_exists( 'MeowPro_MWAI_Core' ) ) {
			new MeowPro_MWAI_Core( $this );
		}

		$mwai = new Meow_MWAI_API( $this->chatbot, $this->discussions );
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

	#region AI-Related Helpers
	function run_query( $query, $streamCallback = null, $markdown = false ) {
		$envId = !empty( $query->envId ) ? $query->envId : null;
		$engine = Meow_MWAI_Engines_Factory::get( $this, $envId );

		// If the engine is not set, we need to set it to the default one.
		if ( !$envId || !$engine->retrieve_model_info( $query->model ) ) {
			if ( $query instanceof Meow_MWAI_Query_Text ) {
				$this->set_if_empty_defaults( $query, 'ai_default_env', 'ai_default_model' );
			}
			if ( $query instanceof Meow_MWAI_Query_Embed ) {
				$this->set_if_empty_defaults( $query, 'ai_embeddings_default_env', 'ai_embeddings_default_model' );
			}
			else if ( $query instanceof Meow_MWAI_Query_Image ) {
				$this->set_if_empty_defaults( $query, 'ai_images_default_env', 'ai_images_default_model' );
			}
			else if ( $query instanceof Meow_MWAI_Query_Transcribe ) {
				$this->set_if_empty_defaults( $query, 'ai_audio_default_env', 'ai_audio_default_model' );
			}
			$engine = Meow_MWAI_Engines_Factory::get( $this, $query->envId );
		}

		// Let's run the query.
		$reply = $engine->run( $query, $streamCallback );
		
		// Let's allow to modify the reply before it is sent.
		if ( $markdown ) {
			if ( $query instanceof Meow_MWAI_Query_Image ) {
				$reply->result = "";
				foreach ( $reply->results as $result ) {
					$reply->result .= "![Image]($result)\n";
				}
			}
		}

		return $reply;
	}
	
	private function set_if_empty_defaults( $query, $envOption, $modelOption ) {
		$defaultEnv = $this->get_option( $envOption );
		$defaultModel = $this->get_option( $modelOption );
		if ( empty( $defaultEnv ) || empty( $defaultModel ) ) {
			throw new Exception( 'AI Engine: The default environment and model are not set.' );
		}
		$query->set_env_id( $defaultEnv );
		$query->set_model( $defaultModel );
	}	
	#endregion

	#region Text-Related Helpers

	// Clean the text perfectly, resolve shortcodes, etc, etc.
  function clean_text( $rawText = "" ) {
		$text = html_entity_decode( $rawText );
		$text = wp_strip_all_tags( $text );
		$text = preg_replace( '/[\r\n]+/', "\n", $text );
		$text = preg_replace( '/\n+/', "\n", $text );
		$text = preg_replace( '/\t+/', "\t", $text );
		return $text . " ";
  }

  // Make sure there are no duplicate sentences, and keep the length under a maximum length.
  function clean_sentences( $text, $maxLength = null ) {
		$maxLength = (int)($maxLength ? $maxLength : $this->get_option( 'context_max_length', 4096 ));
		$sentences = preg_split('/(?<=[.?!。．！？])+/u', $text);
    $hashes = array();
    $uniqueSentences = array();
    $total = 0;
    foreach ( $sentences as $sentence ) {
      $sentence = preg_replace( '/^[\pZ\pC]+|[\pZ\pC]+$/u', '', $sentence );
      $hash = md5( $sentence );
      if ( !in_array( $hash, $hashes ) ) {
				$length = strlen( $sentence );
        if ( $total + $length > $maxLength ) {
          continue;
        }
        $hashes[] = $hash;
        $uniqueSentences[] = $sentence;
        $total += $length;
      }
    }
    $freshText = implode( " ", $uniqueSentences );
    $freshText = preg_replace( '/^[\pZ\pC]+|[\pZ\pC]+$/u', '', $freshText );
    return $freshText;
  }

	function get_post_content( $postId ) {
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
		$text = $this->clean_text( $text );
		$text = $this->clean_sentences( $text );
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

 	#region Image-Related Helpers
	function get_mime_type( $file ) {
		$mimeType = null;

		// Let's try to use mime_content_type if the function exists
		if ( function_exists( 'mime_content_type' ) ) {
			$mimeType = mime_content_type( $file );
		}

		// Otherwise, let's check the file extension (which can actually also be an URL)
		if ( !$mimeType ) {
			$extension = pathinfo( $file, PATHINFO_EXTENSION );
			$extension = strtolower( $extension );
			$mimeTypes = [
				'jpg' => 'image/jpeg',
				'jpeg' => 'image/jpeg',
				'png' => 'image/png',
				'gif' => 'image/gif',
				'webp' => 'image/webp',
				'bmp' => 'image/bmp',
				'tiff' => 'image/tiff',
				'tif' => 'image/tiff',
				'svg' => 'image/svg+xml',
				'ico' => 'image/x-icon',
				'pdf' => 'application/pdf',
			];
			$mimeType = isset( $mimeTypes[$extension] ) ? $mimeTypes[$extension] : null;
		}

		return $mimeType;
	}

	function download_image( $url ) {
		$args = array( 'timeout' => 60, );
		$response = wp_safe_remote_get( $url, $args );
		if ( is_wp_error( $response ) ) {
			throw new Exception( $response->get_error_message() );
		}
		$output = wp_remote_retrieve_body( $response );
		if ( is_wp_error( $output ) ) {
			throw new Exception( $output->get_error_message() );
		}
		return $output;
	}

	/**
	 * Add an image from a URL to the Media Library.
	 * @param string $url The URL of the image to be downloaded.
	 * @param string $filename The filename of the image, if not set, it will be the basename of the URL.
	 * @param string $title The title of the image.
	 * @param string $description The description of the image.
	 * @param string $caption The caption of the image.
	 * @param string $alt The alt text of the image.
	 * @return int The attachment ID of the image.
	 */
	public function add_image_from_url( $url, $filename = null, $title = null,
		$description = null, $caption = null, $alt = null ) {
		$path_parts = pathinfo( parse_url( $url, PHP_URL_PATH ) );
		$url_filename = $path_parts['basename'];
		$file_type = wp_check_filetype( $url_filename, null );
		$allowed_types = get_allowed_mime_types();
		if ( !$file_type || !in_array( $file_type['type'], $allowed_types ) ) {
			throw new Exception( 'Invalid file type.' );
		}
		$extension = $file_type['ext'];
		$image_data = $this->download_image( $url );
		if ( !$image_data ) {
			throw new Exception( 'Could not download the image.' );
		}
		$upload_dir = wp_upload_dir();

		// If filename is not set or starts with 'generated_', we will generate a new filename.
		if ( empty( $filename ) ) {
			$filename = sanitize_file_name( $url_filename );
			$extension = pathinfo( $filename, PATHINFO_EXTENSION );
			if ( empty( $extension ) ) {
				$extension = $file_type['ext'];
			}
			if ( strlen( $filename ) > 32 || strlen( $filename ) < 4 || strpos( $filename, 'generated_' ) === 0 ) {
				$filename = $this->get_random_id( 16 ) . '.' . $extension;
			}
			if ( strpos( $filename, '.' ) === false ) {
				$filename .= '.' . $extension;
			}
		}
		if ( wp_mkdir_p( $upload_dir['path'] ) ) {
			$file = $upload_dir['path'] . '/' . $filename;
		}
		else {
			$file = $upload_dir['basedir'] . '/' . $filename;
		}
		
		// Make sure the file is unique, if not, add a number to the end of the file before the extension
		$i = 1;
		$parts = pathinfo( $file );
		while ( file_exists( $file ) ) {
			$file = $parts['dirname'] . '/' . $parts['filename'] . '-' . $i . '.' . $parts['extension'];
			$i++;
		}

		// Write the file
		file_put_contents( $file, $image_data );
		$attachment = [
			'post_mime_type' => $file_type['type'],
			'post_title' => $title ?? '',
			'post_content' => $description ?? '',
			'post_excerpt' => $caption ?? '',
			'post_status' => 'inherit'
		];
		// Register the file as a Media Library attachment
		$attachmentId = wp_insert_attachment( $attachment, $file );
		require_once( ABSPATH . 'wp-admin/includes/image.php' );
		$attachment_data = wp_generate_attachment_metadata( $attachmentId, $file );
		wp_update_attachment_metadata( $attachmentId, $attachment_data );
		update_post_meta( $attachmentId, '_wp_attachment_image_alt', $alt );
		return $attachmentId;
	}
 	#endregion

	#region Context-Related Helpers
	function retrieve_context( $params, $query ) {
		$contextMaxLength = $params['contextMaxLength'] ?? $this->get_option( 'context_max_length', 4096 );
    $embeddingsEnvId = $params['embeddingsEnvId'] ?? null;
		$context = apply_filters( 'mwai_context_search', [], $query, [
			'embeddingsEnvId' => $embeddingsEnvId
		]);
		if ( empty( $context ) ) {
			return null;
		}
		else if ( !isset( $context['content'] ) ) {
			error_log( "AI Engine: A context without content was returned." );
			return null;
		}
		$context['content'] = $this->clean_sentences( $context['content'], $contextMaxLength );
		$context['length'] = strlen( $context['content'] );
		return $context;
	}
	#endregion

	#region Users/Sessions Helpers

	function get_nonce() {
		// if ( !is_user_logged_in() ) {
		// 	return null;
		// }
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
		// TODO: Not sure if that's the best way, but we should probably use an admin user as a fallback for CRON.
		if ( defined( 'DOING_CRON' ) && DOING_CRON ) {
			$admin = get_users( [ 'role' => 'administrator' ] );
			if ( !empty( $admin ) ) {
				return $admin[0]->ID;
			}
		}
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

	function get_admin_user() {
		$admin = get_users( [ 'role' => 'administrator' ] );
		if ( !empty( $admin ) ) {
			return $admin[0];
		}
		return null;
	}

	function get_user_data() {
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

	public function check_rest_nonce( $request ) {
    $nonce = $request->get_header( 'X-WP-Nonce' );
    $rest_nonce = wp_verify_nonce( $nonce, 'wp_rest' );
		return apply_filters( 'mwai_rest_authorized', $rest_nonce, $request );
  }

	function get_random_id( $length = 8, $excludeIds = [] ) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyz';
		$charactersLength = strlen( $characters );
		$randomId = '';
		for ( $i = 0; $i < $length; $i++ ) {
			$randomId .= $characters[rand( 0, $charactersLength - 1 )];
		}
		if ( in_array( $randomId, $excludeIds ) ) {
			return $this->get_random_id( $length, $excludeIds );
		}
		return $randomId;
	}

	function is_url( $url ) {
		return strpos( $url, 'http' ) === 0 ? true : false;
	}

	function get_post_types() {
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

	function get_post( $post ) {
		if ( is_numeric( $post ) ) {
			$post = get_post( $post );
		}
		if ( is_object( $post ) ) {
			$post = (array)$post;
		}
		if ( !is_array( $post ) ) {
			return null;
		}
		$language = $this->get_post_language( $post['ID'] );
		$content = $this->get_post_content( $post['ID'] );
		$title = $post['post_title'];
		$excerpt = $post['post_excerpt'];
		$url = get_permalink( $post['ID'] );
		$checksum = wp_hash( $content . $title . $url );
		return [
			'postId' => (int)$post['ID'],
			'title' => $title,
			'content' => $content,
			'excerpt' => $excerpt,
			'url' => $url,
			'language' => $language ?? 'english',
			'checksum' => $checksum,
		];
	}
	#endregion

	#region Usage & Costs

	// Quick and dirty token estimation
  // Let's keep this synchronized with Helpers in JS
  static function estimate_tokens( ...$args ): int {
    $text = "";
    foreach ( $args as $arg ) {
			if ( is_array( $arg ) ) {
				foreach ( $arg as $message ) {
					$text .= isset( $message['content']['text'] ) ? $message['content']['text'] : "";
					$text .= isset( $message['content'] ) && is_string( $message['content'] ) ? $message['content'] : "";
				}
			}
			else if ( is_string( $arg ) ) {
				$text .= $arg;
			}
    }
    $averageTokenLength = 4;
    $words = preg_split( '/\s+/', trim( $text ) );
    $tokenCount = 0;
    foreach ( $words as $word ) {
      $tokenCount += ceil( strlen( $word ) / $averageTokenLength );
    }
    return apply_filters( 'mwai_estimate_tokens', $tokenCount, $text );
	}

  public function record_tokens_usage( $model, $in_tokens, $out_tokens = 0, $returned_price = null ) {
    if ( !is_numeric( $in_tokens ) ) {
      throw new Exception( 'AI Engine: in_tokens must be a number.' );
    }
    if ( !is_numeric( $out_tokens ) ) {
      $out_tokens = 0;
    }
    if ( !$model ) {
      throw new Exception( 'AI Engine: model is required.' );
    }
    $usage = $this->get_option( 'openai_usage' );
    $month = date( 'Y-m' );
    if ( !isset( $usage[$month] ) ) {
      $usage[$month] = array();
    }
    if ( !isset( $usage[$month][$model] ) ) {
      $usage[$month][$model] = array( 'prompt_tokens' => 0, 'completion_tokens' => 0, 'total_tokens' => 0 );
    }
    $usage[$month][$model]['prompt_tokens'] += $in_tokens;
    $usage[$month][$model]['completion_tokens'] += $out_tokens;
    $usage[$month][$model]['total_tokens'] += $in_tokens + $out_tokens;
    $this->update_option( 'openai_usage', $usage );
    $usageInfo = [
      'prompt_tokens' => $in_tokens,
      'completion_tokens' => $out_tokens,
      'total_tokens' => $in_tokens + $out_tokens,
    ];
		if ( $returned_price !== null ) {
			$usageInfo['price'] = $returned_price;
		}
		return $usageInfo;
  }

	public function record_audio_usage( $model, $seconds ) {
		if ( !is_numeric( $seconds ) ) {
			throw new Exception( 'AI Engine: seconds must be a number.' );
		}
		if ( !$model ) {
			throw new Exception( 'AI Engine: model is required.' );
		}
		$usage = $this->get_option( 'openai_usage' );
		$month = date( 'Y-m' );
		if ( !isset( $usage[$month] ) ) {
			$usage[$month] = array();
		}
		if ( !isset( $usage[$month][$model] ) ) {
			$usage[$month][$model] = array( 'seconds' => 0 );
		}
		$usage[$month][$model]['seconds'] += $seconds;
		$this->update_option( 'openai_usage', $usage );
		return [ 'seconds' => $seconds ];
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
      $usage[$month][$model] = array( 'resolution' => array(), 'images' => 0 );
    }
    if ( !isset( $usage[$month][$model]['resolution'][$resolution] ) ) {
      $usage[$month][$model]['resolution'][$resolution] = 0;
    }
    $usage[$month][$model]['resolution'][$resolution] += $images;
    $usage[$month][$model]['images'] += $images;
    $this->update_option( 'openai_usage', $usage );
    return [ 'resolution' => $resolution, 'images' => $images ];
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
	function get_themes() {
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

	function update_themes( $themes ) {
		update_option( $this->themes_option_name, $themes );
		return $themes;
	}

	function get_chatbots() {
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
			// if ( isset( $chatbot['chatId'] ) ) {
			// 	$chatbot['botId'] = $chatbot['chatId'];
			// 	unset( $chatbot['chatId'] );
			// 	$hasChanges = true;
			// }
			// After September 2023, let's remove this if statement.
			// if ( empty( $chatbot['botId'] ) && $chatbot['name'] === 'default' ) {
			// 	$chatbot['botId'] = sanitize_title( $chatbot['name'] );
			// 	$hasChanges = true;
			// }
		}
		if ( $hasChanges ) {
			update_option( $this->chatbots_option_name, $chatbots );
		}
		return $chatbots;
	}

	function get_chatbot( $botId ) {
		$chatbots = $this->get_chatbots();
		foreach ( $chatbots as $chatbot ) {
			if ( $chatbot['botId'] === (string)$botId ) {
				return $chatbot;
			}
		}
		return null;
	}

	function get_embeddings_env( $envId ) {
		$envs = $this->get_option( 'embeddings_envs' );
		foreach ( $envs as $env ) {
			if ( $env['id'] === $envId ) {
				return $env;
			}
		}
		return null;
	}

	function get_ai_env( $envId ) {
		$envs = $this->get_option( 'ai_envs' );
		foreach ( $envs as $env ) {
			if ( $env['id'] === $envId ) {
				return $env;
			}
		}
		return null;
	}

	function get_assistant( $envId, $assistantId ) {
		$env = $this->get_ai_env( $envId );
		if ( !$env ) {
			return null;
		}
		$assistants = $env['assistants'];
		foreach ( $assistants as $assistant ) {
			if ( $assistant['id'] === $assistantId ) {
				return $assistant;
			}
		}
		return null;
	}

	function get_theme( $themeId ) {
		$themes = $this->get_themes();
		foreach ( $themes as $theme ) {
			if ( $theme['themeId'] === $themeId ) {
				return $theme;
			}
		}
		return null;
	}

	function update_chatbots( $chatbots ) {
		$deprecatedFields = [ 'env', 'embeddingsIndex', 'embeddingsNamespace', 'service' ];
		$htmlFields = [ 'textCompliance', 'aiName', 'userName', 'startSentence' ];
		$whiteSpacedFields = [ 'context' ];
		foreach ( $chatbots as &$chatbot ) {
			foreach ( $chatbot as $key => &$value ) {
				if ( in_array( $key, $deprecatedFields ) ) {
					unset( $chatbot[$key] );
					continue;
				}
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
		if ( !update_option( $this->chatbots_option_name, $chatbots ) ) {
			error_log( 'AI Engine: Could not update chatbots.' );
			$chatbots = get_option( $this->chatbots_option_name, [] );
			return $chatbots;
		}
		return $chatbots;
	}

	function get_all_options( $force = false ) {
		// We could cache options this way, but if we do, the apply_filters seems to be called too early.
		// That causes issues with the mwai_languages filter.
		// if ( !$force && !is_null( $this->options ) ) {
		// 	return $this->options;
		// }
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
		$options['chatbot_defaults'] = MWAI_CHATBOT_DEFAULT_PARAMS;
		$options['default_limits'] = MWAI_LIMITS;
		$options['openai_models'] = apply_filters( 
			'mwai_openai_models',
			Meow_MWAI_Engines_OpenAI::get_models_static()
		);
		$options['anthropic_models'] = apply_filters( 
			'mwai_anthropic_models',
			Meow_MWAI_Engines_Anthropic::get_models_static()
		);
		$options['fallback_model'] = MWAI_FALLBACK_MODEL;

		//$this->options = $options;
		return $options;
	}

	// Sanitize options when we update the plugi or perform some updates
	// if we change the structure of the options.
	function sanitize_options( $options ) {
		$needs_update = false;

		// This list was updated on December 11, 2023. After May 2024, let's remove this.
		$old_options = [
			'shortcode_chat_default_params',
			'shortcode_chat_params_override',
			'module_legacy_finetunes',
			'shortcode_chat_legacy',
			'shortcode_chat_inject',
			'shortcode_chat_styles',
			'dynamic_max_tokens',
			'shortcode_chat_formatting',
			'shortcode_forms_legacy',
		];
		foreach ( $old_options as $old_option ) {
			if ( isset( $options[$old_option] ) ) {
				unset( $options[$old_option] );
				$needs_update = true;
			}
		}

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
			$default_id = $this->get_random_id();
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
			$default_openai_id = $this->get_random_id();
			$default_azure_id = $this->get_random_id();
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
					$env['id'] = $this->get_random_id();
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
					$env['id'] = $this->get_random_id();
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
		delete_option( $this->themes_option_name );
		delete_option( $this->chatbots_option_name );
		delete_option( $this->option_name );
		return $this->get_all_options( true );
	}
	#endregion
}

?>