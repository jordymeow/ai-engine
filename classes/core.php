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
	public $magicWand = null;
	private $options = null;
	private $option_name = 'mwai_options';
	private $themes_option_name = 'mwai_themes';
	private $chatbots_option_name = 'mwai_chatbots';
	private $nonce = null;

        public $chatbot = null;
        public $discussions = null;
        public $search = null;

	public function __construct() {
		Meow_MWAI_Logging::init( 'mwai_options', 'AI Engine' );
		$this->site_url = get_site_url();
		$this->is_rest = MeowCommon_Helpers::is_rest();
		$this->is_cli = defined( 'WP_CLI' );
		$this->files = new Meow_MWAI_Modules_Files( $this );
		$this->tasks = new Meow_MWAI_Modules_Tasks( $this );

		add_action( 'plugins_loaded', array( $this, 'init' ) );
		add_action( 'wp_register_script', array( $this, 'register_scripts' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'register_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'register_scripts' ) );
	}

	#region Init & Scripts
	function init() {
		global $mwai;
		$this->chatbot = null;
		$this->discussions = null;
		new Meow_MWAI_Modules_Security( $this );

		// REST API
		if ( $this->is_rest ) {
			new Meow_MWAI_Rest( $this );
		}

		// WP Admin
		if ( is_admin() ) {
			new Meow_MWAI_Admin( $this );
		}

		// GDPR Module
		if ( $this->get_option( 'chatbot_gdpr_consent' ) ) {
			new Meow_MWAI_Modules_GDPR( $this );
		}

		// Suggestions Module
		if ( $this->get_option( 'module_suggestions' ) && ( is_admin() || $this->is_rest ) ) {
			$this->magicWand = new Meow_MWAI_Modules_Wand( $this );
		}

		// Administrator in WP Admin
		if ( is_admin() && current_user_can( 'manage_options' ) ) {
			$module_advisor = $this->get_option( 'module_advisor' );
			if ( $module_advisor ) {
				new Meow_MWAI_Modules_Advisor( $this );
			}
		}

                // Chatbots & Discussions
                if ( $this->get_option( 'module_chatbots' ) ) {
                        $this->chatbot = new Meow_MWAI_Modules_Chatbot();
                        $this->discussions = new Meow_MWAI_Modules_Discussions();
                }

                // Search
                if ( $this->get_option( 'module_search' ) ) {
                        $this->search = new Meow_MWAI_Modules_Search( $this );
                }

		// Advanced Core
		if ( class_exists( 'MeowPro_MWAI_Core' ) ) {
			new MeowPro_MWAI_Core( $this );
		}

		// Simple API
		$mwai = new Meow_MWAI_API( $this->chatbot, $this->discussions );

		// MCP
		if ( $this->get_option( 'module_mcp' ) ) {
			new Meow_MWAI_Labs_MCP( $this );
			
			// Core - Core WordPress MCP tools
			if ( $this->get_option( 'mcp_core' ) ) {
				new Meow_MWAI_Labs_MCP_Core( $this );
			}
			
			// Dynamic REST - WordPress REST API MCP tools
			if ( $this->get_option( 'mcp_dynamic_rest' ) ) {
				require_once MWAI_PATH . '/labs/mcp_rest.php';
				new Meow_MWAI_Labs_MCP_Rest();
			}
			
			// Themes - Pro theme management MCP tools
			if ( $this->get_option( 'mcp_themes' ) && class_exists( 'MeowPro_MWAI_MCP_Theme' ) ) {
				new MeowPro_MWAI_MCP_Theme( $this );
			}

			// Plugins - Pro plugin management MCP tools
			if ( $this->get_option( 'mcp_plugins' ) && class_exists( 'MeowPro_MWAI_MCP_Plugin' ) ) {
				new MeowPro_MWAI_MCP_Plugin( $this );
			}
		}
	}

	public function register_scripts() {
		// Register Highlight.js
		wp_register_script( 'mwai_highlight', MWAI_URL . 'vendor/highlightjs/highlight.min.js', [], '11.7', false );
		// Register CSS for the themes
		$themes = $this->get_themes();
		foreach ( $themes as $theme ) {
			if ( $theme['type'] === 'internal' ) {
				$themeId = $theme['themeId'];
				$filename = $themeId . '.css';
				$physical_file = trailingslashit( MWAI_PATH ) . 'themes/' . $filename;
				$cache_buster = file_exists( $physical_file ) ? filemtime( $physical_file ) : MWAI_VERSION;
				wp_register_style( 'mwai_chatbot_theme_' . $themeId, trailingslashit( MWAI_URL )
					. 'themes/' . $filename, [], $cache_buster );
			}
		}
	}

       public function enqueue_theme( $themeId ) {
               if ( empty( $themeId ) ) {
                       return;
               }
               wp_enqueue_style( "mwai_chatbot_theme_$themeId" );
       }

       public function enqueue_themes() {
               $themes = $this->get_themes();
               foreach ( $themes as $theme ) {
                       if ( $theme['type'] === 'internal' ) {
                               $this->enqueue_theme( $theme['themeId'] );
                       }
               }
       }

	#endregion

	#region Roles & Capabilities
	function can_start_session() {
		return apply_filters( 'mwai_allow_session', true );
	}

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
		
		// Allow to modify the query before it is sent.
    // Embedding and Feedback queries are not allowed to be modified.
    if ( !( $query instanceof Meow_MWAI_Query_Embed ) && !( $query instanceof Meow_MWAI_Query_Feedback ) ) {
      $query = apply_filters( 'mwai_ai_query', $query );
    }

		// Let's check the default environment and model.
		$engine = $this->validate_env_model( $query );

		// Let's run the query.
		$reply = $engine->run( $query, $streamCallback );
		
		// Let's allow to modify the reply before it is sent.
		if ( $markdown ) {
			if ( $query instanceof Meow_MWAI_Query_Image || $query instanceof Meow_MWAI_Query_EditImage ) {
				$reply->result = "";
				foreach ( $reply->results as $result ) {
					$reply->result .= "![Image]($result)\n";
				}
			}
		}

		return $reply;
	}

	public function validate_env_model( $query ) {
		$envId = !empty( $query->envId ) ? $query->envId : null;
		$engine = Meow_MWAI_Engines_Factory::get( $this, $envId );

		if ( empty( $envId ) || !$engine->retrieve_model_info( $query->model ) ) {
			if ( !empty( $envId ) ) {
				$error = sprintf( 'The model %s is not available in the environment %s.', $query->model, $envId );
				Meow_MWAI_Logging::warn( $error );
			}
			if ( $query instanceof Meow_MWAI_Query_Text ) {
				$this->set_default_env_and_model( $query, 'ai_default_env', 'ai_default_model' );
			}
			if ( $query instanceof Meow_MWAI_Query_Embed ) {
				$this->set_default_env_and_model( $query, 'ai_embeddings_default_env', 'ai_embeddings_default_model' );
			}
                        else if ( $query instanceof Meow_MWAI_Query_Image || $query instanceof Meow_MWAI_Query_EditImage ) {
                                $this->set_default_env_and_model( $query, 'ai_images_default_env', 'ai_images_default_model' );
                        }
			else if ( $query instanceof Meow_MWAI_Query_Transcribe ) {
				$this->set_default_env_and_model( $query, 'ai_audio_default_env', 'ai_audio_default_model' );
			}
			$engine = Meow_MWAI_Engines_Factory::get( $this, $query->envId );
		}
		return $engine;
	}
	
	private function set_default_env_and_model( $query, $envOption, $modelOption ) {
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
		// Step 1: Identify URLs and replace them with a placeholder.
		$urlPattern = '/\bhttps?:\/\/[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/))/';
		preg_match_all($urlPattern, $text, $urls);
		$urlPlaceholders = array();
		foreach ($urls[0] as $index => $url) {
			$placeholder = "{urlPlaceholder" . $index . "}";
			$text = str_replace($url, $placeholder, $text);
			$urlPlaceholders[$placeholder] = $url;
		}
	
		$maxLength = (int)($maxLength ? $maxLength : $this->get_option( 'context_max_length', 4096 ));
		$sentences = preg_split('/(?<=[.?!。．！？])\s+/u', $text, -1, PREG_SPLIT_NO_EMPTY);
		$hashes = array();
		$uniqueSentences = array();
		$total = 0;
	
		foreach ( $sentences as $sentence ) {
			$sentence = preg_replace( '/^[\pZ\pC]+|[\pZ\pC]+$/u', '', $sentence );
			$hash = md5( $sentence );
			if ( !in_array( $hash, $hashes ) ) {
				$length = mb_strlen( $sentence, 'UTF-8' );
				if ( $total + $length > $maxLength ) {
					continue;
				}
				$hashes[] = $hash;
				$uniqueSentences[] = $sentence;
				$total += $length;
			}
		}
	
		$freshText = implode( " ", $uniqueSentences );
	
		// Step 3: Restore URLs in the final text.
		foreach ($urlPlaceholders as $placeholder => $url) {
			$freshText = str_replace($placeholder, $url, $freshText);
		}
	
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

	function do_placeholders( $text ) {
		$defaultPlaceholders = [];
		$dataPlaceholders = $this->get_user_data();
		if ( !empty( $dataPlaceholders ) ) {
			$defaultPlaceholders = array_merge( $defaultPlaceholders, $dataPlaceholders );
		}
		$placeholders = apply_filters( 'mwai_placeholders', $defaultPlaceholders );
		foreach ( $placeholders as $key => $value ) {
			$text = str_replace( '{' . $key . '}', $value, $text );
		}
		return $text;
	}
	#endregion

 	#region Image-Related Helpers
	static function is_image( $file ) {
		$mimeType = Meow_MWAI_Core::get_mime_type( $file );
		if ( strpos( $mimeType, 'image' ) !== false ) {
			return true;
		}
		return false;
	}

	static function get_image_resolution( $url ) {
		if ( empty( $url ) ) {
			return null;
		}
    $headers = get_headers( $url, 1 );
    if ( strpos( $headers[0], '200' ) === false ) {
      return null;
    }
    $image_info = getimagesize( $url );
    if ( $image_info === false ) {
      return null;
    }
    return [ 
			'width' => $image_info[0],
			'height' => $image_info[1]
		];
	}

	static function get_mime_type( $file ) {
		$mimeType = null;

		// Let's try to use mime_content_type if the function exists
		$isUrl = filter_var( $file, FILTER_VALIDATE_URL );
		if ( !$isUrl && function_exists( 'mime_content_type' ) ) {
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
		$response = wp_safe_remote_get( $url, [ 'timeout' => 60 ] );
		if ( is_wp_error( $response ) ) { 
			throw new Exception( $response->get_error_message() );
		}
		return wp_remote_retrieve_body( $response );
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
	public function add_image_from_url( $url, $filename = null, $title = null, $description = null, $caption = null, $alt = null, $attachedPost = null ) {
		$path_parts = pathinfo( parse_url( $url, PHP_URL_PATH ) );
		$url_filename = $path_parts['basename'];
		$file_type = wp_check_filetype( $url_filename, null );
		$allowed_types = get_allowed_mime_types();
		if ( !$file_type || !in_array( $file_type['type'], $allowed_types ) ) {
			throw new Exception( 'Invalid file type from URL.' );
		}
	
		// Initial extension from URL file name
		$extension = $file_type['ext'];
	
		if ( !empty( $filename ) ) {
			$custom_file_type = wp_check_filetype( $filename, null );
			if ( !$custom_file_type || !in_array( $custom_file_type['type'], $allowed_types ) ) {
				throw new Exception( 'Invalid custom file type.' );
			}
			// Use the extension from the custom filename if valid
			$extension = $custom_file_type['ext'];
		}
	
		$image_data = $this->download_image( $url );
		if ( !$image_data ) {
			throw new Exception( 'Could not download the image.' );
		}
		$upload_dir = wp_upload_dir();
	
		// Filename handling including 'generated_' prefix scenario
		if ( empty( $filename ) ) {
			$filename = sanitize_file_name( $url_filename );
			if ( empty( $extension ) ) { // This condition might now be redundant
				$extension = $file_type['ext'];
			}
			// Filename length check and prepend if conditions met
			if ( strlen( $filename ) > 32 || strlen( $filename ) < 4 || strpos( $filename, 'generated_' ) === 0 ) {
				$filename = $this->get_random_id( 16 ) . '.' . $extension;
			}
			if ( strpos( $filename, '.' ) === false ) {
				$filename .= '.' . $extension;
			}
		}
	
		// Directory and file path handling
		if ( wp_mkdir_p( $upload_dir['path'] ) ) {
			$file = $upload_dir['path'] . '/' . $filename;
		}
		else {
			$file = $upload_dir['basedir'] . '/' . $filename;
		}
		
		// Ensure file name uniqueness in the directory
		$i = 1;
		$parts = pathinfo( $file );
		while ( file_exists( $file ) ) {
			$file = $parts['dirname'] . '/' . $parts['filename'] . '-' . $i . '.' . $parts['extension'];
			$i++;
		}
	
		// Writing the file to disk
		file_put_contents( $file, $image_data );
	
		// Attachment and metadata handling in WP
		$attachment = [
			'post_mime_type' => $file_type['type'],
			'post_title' => $title ?? '',
			'post_content' => $description ?? '',
			'post_excerpt' => $caption ?? '',
			'post_status' => 'inherit'
		];
		$attachmentId = wp_insert_attachment( $attachment, $file );
		require_once( ABSPATH . 'wp-admin/includes/image.php' );
		$attachment_data = wp_generate_attachment_metadata( $attachmentId, $file );
		wp_update_attachment_metadata( $attachmentId, $attachment_data );
		update_post_meta( $attachmentId, '_wp_attachment_image_alt', $alt );

		// Attach the image to a post if needed
		if ( $attachedPost ) {
			wp_update_post( [ 'ID' => $attachmentId, 'post_parent' => $attachedPost ] );
		}
	
		return $attachmentId;
	}	
 	#endregion

	#region Context-Related Helpers
	function retrieve_context( $params, $query, $streamCallback = null ) {
		$contextMaxLength = $params['contextMaxLength'] ?? $this->get_option( 'context_max_length', 4096 );
    $embeddingsEnvId = $params['embeddingsEnvId'] ?? null;
		
		$context = apply_filters( 'mwai_context_search', [], $query, [
			'embeddingsEnvId' => $embeddingsEnvId,
			'streamCallback' => $streamCallback
		]);
		
		// Emit embeddings event if streaming and context was found
		if ( $streamCallback && !empty( $context ) ) {
			$count = 0;
			if ( isset( $context['embeddings'] ) && is_array( $context['embeddings'] ) ) {
				$count = count( $context['embeddings'] );
			} else if ( isset( $context['content'] ) ) {
				$count = 1;
			}
			if ( $count > 0 ) {
				$event = Meow_MWAI_Event::embeddings( $count );
				$streamCallback( $event );
			}
		}
		
		if ( empty( $context ) ) {
			return null;
		}
		else if ( !isset( $context['content'] ) ) {
			Meow_MWAI_Logging::warn( "A context without content was returned." );
			return null;
		}
		$context['content'] = $this->clean_sentences( $context['content'], $contextMaxLength );
		$context['length'] = strlen( $context['content'] );
		return $context;
	}
	#endregion

	#region Users/Sessions Helpers

	function get_nonce( $force = false ) {
		if ( !$force && !is_user_logged_in() ) {
			return null;
		}
		if ( isset( $this->nonce ) ) {
			return $this->nonce;
		}
		$this->nonce = wp_create_nonce( 'wp_rest' );
		return $this->nonce;
	}

	// This is a bit hacky, but chatId needs to be retrieved or generated.
	// Maybe we can clean this up later.
	function fix_chat_id( $query, $params ) {
		if ( isset( $query->chatId ) && $query->chatId !== 'N/A' ) {
			return $query->chatId;
		}
		$chatId = isset( $params['chatId'] ) ? $params['chatId'] : $query->session;
		if ( $chatId === 'N/A' ) {
			$chatId = $this->get_random_id( 8 );
		}
		$query->set_chat_id( $chatId );
		return $chatId;
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

	function get_ip_address( $force = false ) {
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
		}
		else {
			foreach ( $headers as $header ) {
				if ( array_key_exists( $header, $_SERVER ) && !empty( $_SERVER[ $header ] && $_SERVER[ $header ] != '::1' ) ) {
					$address_chain = explode( ',', wp_unslash( $_SERVER [ $header ] ) );
					$ip = filter_var( trim( $address_chain[ 0 ] ), FILTER_VALIDATE_IP );
					break;
				}
			}
		}
	
		$ip = filter_var( apply_filters( 'mwai_get_ip_address', $ip ), FILTER_VALIDATE_IP );

		// If privacy_first is enabled, we hash the IP address.
		if ( !$force && $this->get_option( 'privacy_first' ) && !empty( $ip ) ) {
			$hash = hash( 'sha256', $ip, true ); // binary output
			$ip = substr( rtrim( strtr( base64_encode( $hash ), '+/', '-_'), '=' ), 0, 12 );
		}		

		return $ip;
  }

	#endregion

	#region Sanitization
	function sanitize_sort( &$sort, $default_accessor = 'created', $default_order = 'DESC', 
		$allowed_columns = array( 'created', 'updated', 'name', 'id', 'time', 'units', 'price' )) {

    // Ensure $sort is an array
    if ( !is_array( $sort ) ) {
      $sort = [ "accessor" => $default_accessor, "by" => $default_order ];
    }
    // Extract and sanitize the accessor
    $sort_accessor = isset( $sort['accessor'] ) ? $sort['accessor'] : $default_accessor;
    if ( !in_array( $sort_accessor, $allowed_columns ) ) {
			Meow_MWAI_Logging::error( "This sort accessor is not allowed ($sort_accessor)." );
      $sort_accessor = $default_accessor;
    }
    // Extract and sanitize the sort order
    $sort_by = isset( $sort['by'] ) ? strtoupper( $sort['by'] ) : $default_order;
    if ( $sort_by !== 'ASC' && $sort_by !== 'DESC' ) {
			Meow_MWAI_Logging::error( "This sort order is not allowed ($sort_by)." );
      $sort_by = $default_order;
    }
    // Update the sort array with sanitized values
    $sort['accessor'] = $sort_accessor;
    $sort['by'] = $sort_by;
  }
	#endregion

	#region Other Helpers
	function safe_strlen( $string, $encoding = 'UTF-8' ) {
		if ( function_exists( 'mb_strlen' ) ) {
			return mb_strlen( $string, $encoding );
		}
		else {
			// Fallback implementation for environments without mbstring extension
			return preg_match_all( '/./u', $string, $matches );
		}
	}

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
			$randomId .= $characters[ mt_rand( 0, $charactersLength - 1 ) ];
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
    $usage = $this->get_option( 'ai_models_usage' );
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
    $this->update_option( 'ai_models_usage', $usage );
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
		$usage = $this->get_option( 'ai_models_usage' );
		$month = date( 'Y-m' );
		if ( !isset( $usage[$month] ) ) {
			$usage[$month] = array();
		}
		if ( !isset( $usage[$month][$model] ) ) {
			$usage[$month][$model] = array( 'seconds' => 0 );
		}
		$usage[$month][$model]['seconds'] += $seconds;
		$this->update_option( 'ai_models_usage', $usage );
		return [ 'seconds' => $seconds ];
	}

  public function record_images_usage( $model, $resolution, $images ) {
    if ( !$model || !$resolution || !$images ) {
      throw new Exception( 'Missing parameters for record_image_usage.' );
    }
    $usage = $this->get_option( 'ai_models_usage' );
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
    $this->update_option( 'ai_models_usage', $usage );
    return [ 'resolution' => $resolution, 'images' => $images ];
  }

	#endregion

	#region Streaming
	public function stream_push( $data, $query = null ) {
		// Handle new Event objects
		if ( is_object( $data ) && method_exists( $data, 'to_array' ) ) {
			$data = $data->to_array();
		}
		
		$data = apply_filters( 'mwai_stream_push', $data, $query );
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
				'type' => 'internal','name' => 'ChatGPT', 'themeId' => 'chatgpt',
				'settings' => [], 'style' => ""
			],
			'messages' => [
				'type' => 'internal', 'name' => 'Messages', 'themeId' => 'messages',
				'settings' => [], 'style' => ""
			],
			'timeless' => [
				'type' => 'internal', 'name' => 'Timeless', 'themeId' => 'timeless',
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
		$hasDefault = false;
		foreach ( $chatbots as &$chatbot ) {
			if ( $chatbot['botId'] === 'default' ) {
				$hasDefault = true;
			}
			foreach ( MWAI_CHATBOT_DEFAULT_PARAMS as $key => $value ) {
				// Use default value if not set.
				if ( !isset( $chatbot[$key] ) ) {
					$chatbot[$key] = $value;
				}
			}

			/*
				This is the best section to rename fields.
				We did this in 2024 for context to instructions, and fileUpload to fileSearch. fileSearch is for assistant file search, and fileUpload is now for chatbot file upload (similar to vision, but for files instead of images).
			*/

			// if ( isset( $chatbot['context'] ) ) {
			// 	$chatbot['instructions'] = $chatbot['context'];
			// 	unset( $chatbot['context'] );
			// 	$hasChanges = true;
			// }
		}
		if ( !$hasDefault ) {
			$defaultBot = array_merge( MWAI_CHATBOT_DEFAULT_PARAMS, ['name' => 'Default', 'botId' => 'default' ] );
			array_unshift( $chatbots, $defaultBot );
			$hasChanges = true;
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
		// TODO: I think some HTML fields are missing, guestName, maybe others.
		$htmlFields = [ 'instructions', 'textCompliance', 'aiName', 'userName', 'startSentence' ];
		$keepLineReturnsFields = [ 'instructions' ];
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
				else if ( $key === 'functions' ) {
					$functions = [];
					foreach ( $value as $function ) {
						if ( isset( $function['id'] ) && isset( $function['type'] ) ) {
							$functions[] = [
								'id' => sanitize_text_field( $function['id'] ),
								'type' => sanitize_text_field( $function['type'] ),
							];
						}
					}
					$value = $functions;
				}
				else if ( $key === 'mcpServers' ) {
					$mcpServers = [];
					foreach ( $value as $server ) {
						if ( isset( $server['id'] ) ) {
							$mcpServers[] = [
								'id' => sanitize_text_field( $server['id'] ),
							];
						}
					}
					$value = $mcpServers;
				}
				else if ( $key === 'tools' ) {
					// Sanitize tools array (web_search, image_generation, etc)
					$tools = [];
					if ( is_array( $value ) ) {
						foreach ( $value as $tool ) {
							$sanitized_tool = sanitize_text_field( $tool );
							if ( in_array( $sanitized_tool, ['web_search', 'image_generation'] ) ) {
								$tools[] = $sanitized_tool;
							}
						}
					}
					$value = $tools;
				}
				else {
					if ( in_array( $key, $keepLineReturnsFields ) ) {
						$value = preg_replace( '/\r\n/', "[==LINE_RETURN==]", $value );
						$value = preg_replace( '/\n/', "[==LINE_RETURN==]", $value );
					}
					$value = sanitize_text_field( $value );
					if ( in_array( $key, $keepLineReturnsFields ) ) {
						$value = preg_replace( '/\[==LINE_RETURN==\]/', "\n", $value );
					}
				}
			}
		}
		if ( !update_option( $this->chatbots_option_name, $chatbots ) ) {
			Meow_MWAI_Logging::warn( 'Could not update chatbots.' );
			$chatbots = get_option( $this->chatbots_option_name, [] );
			return $chatbots;
		}
		return $chatbots;
	}

	function populate_dynamic_options( $options ) {
		static $populating = false;
		
		// Prevent infinite recursion
		if ( $populating ) {
			return $options;
		}
		
		$populating = true;
		
		// Languages
		$options['languages'] = apply_filters( 'mwai_languages', MWAI_LANGUAGES );

		// Consolidate the Engines and their Models
		// PS: We should ABSOLUTELY AVOID to use ai_models directly (except for saving)
		// Engine Example: [ 'name' => 'Ollama', 'type' => 'ollama', inputs => ['apikey', 'endpoint'], models => [] ]
		$options['ai_engines'] = apply_filters( 'mwai_engines', MWAI_ENGINES );
		foreach ( $options['ai_engines'] as &$engine ) {
			if ( $engine['type'] === 'openai' ) {
				$engine['models'] = apply_filters(  'mwai_openai_models',
					Meow_MWAI_Engines_OpenAI::get_models_static()
				);
			}
			else if ( $engine['type'] === 'anthropic' ) {
				$engine['models'] = apply_filters(  'mwai_anthropic_models',
					Meow_MWAI_Engines_Anthropic::get_models_static()
				);
			}
			else if ( $engine['type'] === 'perplexity' ) {
				$engine['models'] = apply_filters(  'mwai_perplexity_models',
					Meow_MWAI_Engines_Perplexity::get_models_static()
				);
			}
			else {
				$engine['models'] = [];
				foreach ( $options['ai_models'] as $model ) {
					if ( $model['type'] === $engine['type'] ) {
						$engine['models'][] = $model;
					}
				}
			}
		}

		// Functions via Code Engine (or custom code)
		$json = [];
		$functions = apply_filters( 'mwai_functions_list', [] );
		foreach ( $functions as $function ) {
			$json[] = Meow_MWAI_Query_Function::toJson( $function );
		}
		$options['functions'] = $json;

		// Addons
		$options['addons'] = apply_filters( 'mwai_addons', [
			[
				"slug" => "mwai-notifications",
				"name" => "Notifications",
				"description" => "Get real-time alerts for new discussions in your chatbot, so you never miss a chance to engage.",
				"install_url" => "https://meowapps.com/products/mwai-notifications/",
				"settings_url" => null,
				"stars" => 4,
				"enabled" => false
			],
			[
				"slug" => "mwai-ollama",
				"name" => "Ollama",
				"description" => "Leverage local LLM integration through Ollama; refresh and use your own models for a flexible, cost-free approach.",
				"install_url" => "https://meowapps.com/products/mwai-ollama/",
				"settings_url" => null,
				"stars" => 3,
				"enabled" => false
			],
			[
				"slug" => "mwai-deepseek",
				"name" => "DeepSeek",
				"description" => "Support for DeepSeek, a Chinese AI company that provides extremely powerful LLM models.",
				"install_url" => "https://meowapps.com/products/deepseek/",
				"settings_url" => null,
				"stars" => 3,
				"enabled" => false
			],
			[
				"slug" => "mwai-websearch",
				"name" => "Web Search",
				"description" => "Enhance chatbot responses by pulling context from Google and Tavily, delivering more accurate answers.",
				"install_url" => "https://meowapps.com/products/mwai-websearch/",
				"settings_url" => null,
				"stars" => 5,
				"enabled" => false
			],
			[
				"slug" => "mwai-better-links",
				"name" => "Better Links",
				"description" => "Validate internal and external links and map specific terms to custom URLs, ensuring smoother navigation and references.",
				"install_url" => "https://meowapps.com/products/mwai-better-links/",
				"settings_url" => null,
				"stars" => 3,
				"enabled" => false
			],
			[
				"slug" => "mwai-woo-basics",
				"name" => "Woo Basics",
				"description" => "Access essential WooCommerce data so your chatbot can understand products, orders, and more for a richer shopping experience.",
				"install_url" => "https://meowapps.com/products/mwai-woo-basics/",
				"settings_url" => null,
				"stars" => 2,
				"enabled" => false
			],
			[
				"slug" => "mwai-quick-actions",
				"name" => "Quick Actions",
				"description" => "Enable dynamic quick actions at chat start or during events, helping users find what they need faster.",
				"install_url" => "https://meowapps.com/products/mwai-quick-actions/",
				"settings_url" => null,
				"stars" => 3,
				"enabled" => false
			],
			[
				"slug" => "mwai-content-parser",
				"name" => "Content Parser",
				"description" => "Parse complex website content, including ACF fields and page builders, for more precise embeddings and knowledge retrieval.",
				"install_url" => "https://meowapps.com/products/mwai-content-parser/",
				"settings_url" => null,
				"stars" => 2,
				"enabled" => false
			],
			[
				"slug" => "mwai-visitor-form",
				"name" => "Visitor Form",
				"description" => "Add a customizable form triggered by specific events in your chatbot to collect key visitor information seamlessly.",
				"install_url" => "https://meowapps.com/products/mwai-visitor-form/",
				"settings_url" => null,
				"stars" => 2,
				"enabled" => false
			],
			[
				"slug" => "mwai-dynamic-keys",
				"name" => "Dynamic Keys",
				"description" => "Rotate multiple API keys dynamically for any environment, balancing usage and ensuring smooth performance.",
				"install_url" => "https://meowapps.com/products/mwai-dynamic-keys/",
				"settings_url" => null,
				"stars" => 1,
				"enabled" => false
			],
		] );

		$populating = false;
		return $options;
	}

	function get_all_options( $force = false, $sanitize = false ) {
		if ( $force || is_null( $this->options ) ) {
			$options = get_option( $this->option_name, [] );
			$init_mode = empty( $options );
			foreach ( MWAI_OPTIONS as $key => $value ) {
				if ( !isset( $options[$key] ) ) {
					$options[$key] = $value;
				}
			}
			$options['chatbot_defaults'] = MWAI_CHATBOT_DEFAULT_PARAMS;
			$options['default_limits'] = MWAI_LIMITS;
			if ( $sanitize || $init_mode ) {
				$options = $this->sanitize_options( $options );
			}
			$this->options = $options;
		}
		$options = $this->populate_dynamic_options( $this->options );
		return $options;
	}

	// Sanitize options when we update the plugin or perform some updates
	// if we change the structure of the options.
	function sanitize_options( $options ) {
		$needs_update = false;

		// Removing old options of options renaming should be done here, as it was done before.
		// Check version 2.6.8 for an example.

		// Avoid the logs_path to be a PHP file.
		if ( isset( $options['logs_path'] ) ) {
			$logs_path = $options['logs_path'];
			if ( substr( $logs_path, -4 ) !== '.log' ) {
				$options['logs_path'] = '';
				$needs_update = true;
			}
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
		$allEnvIds = [];
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
				$allEnvIds[] = $env['id'];
			}
		}
		if ( !$ai_default_exists ) {
			$options['ai_default_env'] = $options['ai_envs'][0]['id'] ?? null;
			$needs_update = true;
		}

		// The IDs for the MCP environments are generated here.
		if ( isset( $options['mcp_envs'] ) ) {
			foreach ( $options['mcp_envs'] as &$env ) {
				if ( !isset( $env['id'] ) ) {
					$env['id'] = $this->get_random_id();
					$needs_update = true;
				}
			}
		}

		// All the models with an envId that does not exist anymore are removed.
		if ( isset( $options['ai_models'] ) ) {
			$options['ai_models'] = array_values( array_filter( $options['ai_models'], 
				function( $model ) use ( $allEnvIds, &$needs_update ) {
					if ( isset( $model['envId'] ) && !in_array( $model['envId'], $allEnvIds ) ) {
						$needs_update = true;
						return false;
					}
					return true;
				}
			) );
		}

		if ( $needs_update ) {
			ksort( $options );
			update_option( $this->option_name, $options, false );
		}

		return $options;
	}

	function update_options( $options ) {
		if ( !update_option( $this->option_name, $options, false ) ) {
			return false;
		}
		$options = $this->get_all_options( true, true );
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

	function get_engine_models( $engineType ) {
		$engines = $this->get_option( 'ai_engines' );
		foreach ( $engines as $engine ) {
			if ( $engine['type'] === $engineType ) {
				return isset( $engine['models'] ) ? $engine['models'] : [];
			}
		}
		return [];
	}

	function reset_options() {
		delete_option( $this->themes_option_name );
		delete_option( $this->chatbots_option_name );
		delete_option( $this->option_name );
		return $this->get_all_options( true );
	}
	#endregion
}
