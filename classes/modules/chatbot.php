<?php

// Params for the chatbot (front and server)

define( 'MWAI_CHATBOT_FRONT_PARAMS', [ 'id', 'customId', 'aiName', 'userName', 'guestName',
	'textSend', 'textClear', 'imageUpload', 'fileUpload',
	'textInputPlaceholder', 'textInputMaxLength', 'textCompliance', 'startSentence', 'localMemory',
	'themeId', 'window', 'icon', 'iconText', 'iconAlt', 'iconPosition', 'fullscreen', 'copyButton'
] );
// TODO: Actually, 'env' is being replaced by 'scope', so we need to really remove it from here
// after, February 2024.
define( 'MWAI_CHATBOT_SERVER_PARAMS', [ 'id', 'envId', 'env', 'scope', 'mode', 'contentAware', 'context',
	'embeddingsEnvId', 'embeddingsIndex', 'embeddingsNamespace', 'assistantId',
	'model', 'temperature', 'maxTokens', 'contextMaxLength', 'maxResults', 'apiKey'
] );

// Params for the discussions (front and server)

define( 'MWAI_DISCUSSIONS_FRONT_PARAMS', [ 'themeId', 'textNewChat' ] );
define( 'MWAI_DISCUSSIONS_SERVER_PARAMS', [ 'customId' ] );

class Meow_MWAI_Modules_Chatbot {
	private $core = null;
	private $namespace = 'mwai-ui/v1';
	private $siteWideChatId = null;

	public function __construct() {
		global $mwai_core;
		$this->core = $mwai_core;
		add_shortcode( 'mwai_chatbot', array( $this, 'chat_shortcode' ) );
		add_shortcode( 'mwai_chatbot_v2', array( $this, 'chat_shortcode' ) );
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
		$this->siteWideChatId = $this->core->get_option( 'botId' );
		add_action( 'wp_enqueue_scripts', array( $this, 'register_scripts' ) );

		if ( $this->core->get_option( 'shortcode_chat_discussions' ) ) {
      add_shortcode( 'mwai_discussions', [ $this, 'shortcode_chat_discussions' ] );
    }
	}

	public function register_scripts() {
		$physical_file = trailingslashit( MWAI_PATH ) . 'app/chatbot.js';	
		$cache_buster = file_exists( $physical_file ) ? filemtime( $physical_file ) : MWAI_VERSION;
		wp_register_script( 'mwai_chatbot', trailingslashit( MWAI_URL ) . 'app/chatbot.js',
			[ 'wp-element' ], $cache_buster, false );
		if ( !empty( $this->siteWideChatId ) && $this->siteWideChatId !== 'none' ) {
			$this->enqueue_scripts();
			add_action( 'wp_footer', array( $this, 'inject_chat' ) );
		}
	}

	public function enqueue_scripts() {
		wp_enqueue_script( "mwai_chatbot" );
		if ( $this->core->get_option( 'shortcode_chat_syntax_highlighting' ) ) {
			wp_enqueue_script( "mwai_highlight" );
		}
	}

	public function rest_api_init() {
		register_rest_route( $this->namespace, '/chats/submit', array(
			'methods' => 'POST',
			'callback' => [ $this, 'rest_chat' ],
			'permission_callback' => array( $this->core, 'check_rest_nonce' )
		) );
	}

	public function basics_security_check( $botId, $customId, $newMessage ) {
		if ( empty( $newMessage ) ) {
			error_log("AI Engine: The query was rejected - message was empty.");
			return false;
		}
		if ( !$botId && !$customId ) {
			error_log("AI Engine: The query was rejected - no botId nor id was specified.");
			return false;
		}

		$length = strlen( $newMessage );
		if ( $length < 1 || $length > ( 4096 * 16 ) ) {
			error_log("AI Engine: The query was rejected - message was too short or too long.");
			return false;
		}
		return true;
	}

	public function rest_chat( $request ) {
		$params = $request->get_json_params();
		$botId = $params['botId'] ?? null;
		$customId = $params['customId'] ?? null;
		$stream = $params['stream'] ?? false;
		$newMessage = trim( $params['newMessage'] ?? '' );
		$newFileId = $params['newFileId'] ?? null;

		if ( !$this->basics_security_check( $botId, $customId, $newMessage )) {
			return new WP_REST_Response( [ 
				'success' => false, 
				'message' => apply_filters( 'mwai_ai_exception', 'Sorry, your query has been rejected.' )
			], 403 );
		}

		try {
			$data = $this->chat_submit( $botId, $newMessage, $newFileId, $params, $stream );
			return new WP_REST_Response( [
				'success' => true,
				'reply' => $data['reply'],
				'images' => $data['images'],
				'usage' => $data['usage']
			], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response( [ 
				'success' => false, 
				'message' => $message
			], 500 );
		}
	}

	public function chat_submit( $botId, $newMessage, $newFileId, $params = [], $stream = false ) {
		try {
			$chatbot = null;
			$customId = $params['customId'] ?? null;

			// Custom Chatbot
			if ( $customId ) {
				$chatbot = get_transient( 'mwai_custom_chatbot_' . $customId );
			}
			// Registered Chatbot
			if ( !$chatbot && $botId ) {
				$chatbot = $this->core->get_chatbot( $botId );
			}

			if ( !$chatbot ) {
				error_log("AI Engine: No chatbot was found for this query.");
				throw new Exception( 'Sorry, your query has been rejected.' );
			}

			$textInputMaxLength = $chatbot['textInputMaxLength'] ?? null;
			if ( $textInputMaxLength && strlen( $newMessage ) > (int)$textInputMaxLength ) {
				throw new Exception( 'Sorry, your query has been rejected.' );
			}
			
			// Create QueryText
			$context = null;
			$mode = $chatbot['mode'] ?? 'chat';

			if ( $mode === 'images' ) {
				$query = new Meow_MWAI_Query_Image( $newMessage );

				// Handle Params
				$newParams = [];
				foreach ( $chatbot as $key => $value ) {
					$newParams[$key] = $value;
				}
				foreach ( $params as $key => $value ) {
					$newParams[$key] = $value;
				}
				$params = apply_filters( 'mwai_chatbot_params', $newParams );
				$params['scope'] = empty( $params['scope'] ) ? 'chatbot' : $params['scope'];
				$query->inject_params( $params );
			}
			else {
				$query = $mode === 'assistant' ? new Meow_MWAI_Query_Assistant( $newMessage ) : 
					new Meow_MWAI_Query_Text( $newMessage, 1024 );
				$streamCallback = null;

				// Handle Params
				$newParams = [];
				foreach ( $chatbot as $key => $value ) {
					$newParams[$key] = $value;
				}
				foreach ( $params as $key => $value ) {
					$newParams[$key] = $value;
				}
				$params = apply_filters( 'mwai_chatbot_params', $newParams );
				$params['scope'] = empty( $params['scope'] ) ? 'chatbot' : $params['scope'];
				$query->inject_params( $params );

				// Support for Uploaded Image
				if ( !empty( $newFileId ) ) {

					if ( $mode === 'assistant' ) {
						// This is for Assistant
						$url = $this->core->files->get_path( $newFileId );
						$data = $this->core->files->get_data( $newFileId );
						$openai = Meow_MWAI_Engines_Factory::get_openai( $this->core, $query->envId );
						$filename = basename( $url );
						$file = $openai->upload_file( $filename, $data, 'assistants' );
						$openAiRefId = $file['id'];
						$internalFileId = $this->core->files->get_id_from_refId( $newFileId );
        		$this->core->files->update_refId( $internalFileId, $openAiRefId );
						$this->core->files->update_envId( $internalFileId, $query->envId );
						$newFileId = $openAiRefId;
						$scope = $params['fileUpload'];
						if ( $scope === 'discussion' || $scope === 'user' || $scope === 'assistant' ) {
							$id = $this->core->files->get_id_from_refId( $newFileId );
							$this->core->files->add_metadata( $id, 'assistant_scope', $scope );
						}
						$query->set_file( $openAiRefId, 'refId', 'assistant-in' );
					}
					else {
						// This is for Vision AI
						$remote_upload = $this->core->get_option( 'image_remote_upload' );
						if ( $remote_upload === 'data' ) {
							$data = $this->core->files->get_base64_data( $newFileId );
							$mimeType = $this->core->files->get_mime_type( $newFileId );
							$query->set_file( $data, 'data', 'vision', $mimeType );
						}
						else {
							$url = $this->core->files->get_url( $newFileId );
							$mimeType = $this->core->files->get_mime_type( $newFileId );
							$query->set_file( $url, 'url', 'vision', $mimeType );
						}
						$fileId = $this->core->files->get_id_from_refId( $newFileId );
						$this->core->files->update_envId( $fileId, $query->envId );
						$this->core->files->add_metadata( $fileId, 'query_envId', $query->envId );
						$this->core->files->add_metadata( $fileId, 'query_session', $query->session );
					}
				}

				// Takeover
				$takeoverAnswer = apply_filters( 'mwai_chatbot_takeover', null, $query, $params );
				if ( !empty( $takeoverAnswer ) ) {
					return [
						'reply' => $takeoverAnswer,
						'images' => null,
						'usage' => null
					];
				}

				// Moderation
				if ( $this->core->get_option( 'shortcode_chat_moderation' ) ) {
					global $mwai;
					$isFlagged = $mwai->moderationCheck( $query->get_message() );
					if ( $isFlagged ) {
						throw new Exception( 'Sorry, your message has been rejected by moderation.' );
					}
				}

				// Awareness & Embeddings
					$context = $this->core->retrieve_context( $params, $query );
				if ( !empty( $context ) ) {
					$query->set_context( $context['content'] );
				}
			}

			// Process Query
			if ( $stream ) { 
				$streamCallback = function( $reply ) {
					$raw = $reply;
					$this->stream_push( [ 'type' => 'live', 'data' => $raw ] );
					if (  ob_get_level() > 0 ) {
						ob_flush();
					}
					flush();
				};
				header( 'Cache-Control: no-cache' );
				header( 'Content-Type: text/event-stream' );
				// This is useful to disable buffering in nginx through headers.
				header( 'X-Accel-Buffering: no' );
				ob_implicit_flush( true );
				ob_end_flush();
			}

			$reply = $this->core->run_query( $query, $streamCallback, true );
			$rawText = $reply->result;
			$extra = [];
			if ( $context ) {
				$extra = [ 'embeddings' => $context['embeddings'] ];
			}
			$rawText = apply_filters( 'mwai_chatbot_reply', $rawText, $query, $params, $extra );

			$restRes = [
				'reply' => $rawText,
				'images' => $reply->get_type() === 'images' ? $reply->results : null,
				'usage' => $reply->usage
			];

			// Process Reply
			if ( $stream ) {
				$this->stream_push( [
					'type' => 'end',
					'data' => json_encode([
						'success' => true,
						'reply' => $restRes['reply'],
						'images' => $restRes['images'],
						'usage' => $restRes['usage']
					])
				] );
				die();
			}
			else {
				return $restRes;
			}

		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			if ( $stream ) { 
				$this->stream_push( [ 'type' => 'error', 'data' => $message ] );
				die();
			}
			else {
				throw $e;
			}
		}
	}

	public function stream_push( $data ) {
		$out = "data: " . json_encode( $data );
		echo $out;
		echo "\n\n";
		if (ob_get_level() > 0) {
			ob_end_flush();
		}
		flush();
	}

	public function inject_chat() {
		$params = $this->core->get_chatbot( $this->siteWideChatId );
		$clean_params = [];
		if ( !empty( $params ) ) {
			$clean_params['window'] = true;
			$clean_params['id'] = $this->siteWideChatId;
			echo $this->chat_shortcode( $clean_params );
		}
		return null;
	}

	public function build_front_params( $botId, $customId ) {
		$frontSystem = [
			'botId' => $customId ? null : $botId,
			'customId' => $customId,
			'userData' => $this->core->get_user_data(),
			'sessionId' => $this->core->get_session_id(),
			'restNonce' => $this->core->get_nonce(),
			'contextId' => get_the_ID(),
			'pluginUrl' => MWAI_URL,
			'restUrl' => untrailingslashit( get_rest_url() ),
			'debugMode' => $this->core->get_option( 'debug_mode' ),
			'typewriter' => $this->core->get_option( 'shortcode_chat_typewriter' ),
			'speech_recognition' => $this->core->get_option( 'speech_recognition' ),
			'speech_synthesis' => $this->core->get_option( 'speech_synthesis' ),
			'stream' => $this->core->get_option( 'shortcode_chat_stream' ),
		];
		return $frontSystem;
	}

  public function resolveBotInfo( &$atts )
  {
    $chatbot = null;
    $botId = $atts['id'] ?? null;
    $customId = $atts['custom_id'] ?? null;
    if (!$botId && !$customId) {
      $botId = "default";
    }
    if ( $botId ) {
      $chatbot = $this->core->get_chatbot( $botId );
      if (!$chatbot) {
        $botId = $botId ?: 'N/A';
        return [
          'error' => "AI Engine: Chatbot '{$botId}' not found. If you meant to set an ID for your custom chatbot, please use 'custom_id' instead of 'id'.",
        ];
      }
    }
    $chatbot = $chatbot ?: $this->core->get_chatbot( 'default' );
    if ( !empty( $customId ) ) {
      $botId = null;
    }
		unset( $atts['id'] );
    return [
      'chatbot' => $chatbot,
      'botId' => $botId,
      'customId' => $customId,
    ];
  }

	public function chat_shortcode( $atts ) {
		$atts = empty( $atts ) ? [] : $atts;

		// Let the user override the chatbot params
		$atts = apply_filters( 'mwai_chatbot_params', $atts );

    // Resolve the bot info
		$resolvedBot = $this->resolveBotInfo( $atts, 'chatbot' );
    if ( isset( $resolvedBot['error'] ) ) {
      return $resolvedBot['error'];
    }
    $chatbot = $resolvedBot['chatbot'];
    $botId = $resolvedBot['botId'];
    $customId = $resolvedBot['customId'];

		// Rename the keys of the atts into camelCase to match the internal params system.
		$atts = array_map( function( $key, $value ) {
			$key = str_replace( '_', ' ', $key );
			$key = ucwords( $key );
			$key = str_replace( ' ', '', $key );
			$key = lcfirst( $key );
			return [ $key => $value ];
		}, array_keys( $atts ), $atts );
		$atts = array_merge( ...$atts );

		$frontParams = [];
		foreach ( MWAI_CHATBOT_FRONT_PARAMS as $param ) {
			if ( isset( $atts[$param] ) ) {
				if ( $param === 'localMemory' ) {
					$frontParams[$param] = $atts[$param] === 'true';
				}
				else {
					$frontParams[$param] = $atts[$param];
				}
			}
			else if ( isset( $chatbot[$param] ) ) {
				$frontParams[$param] = $chatbot[$param];
			}
		}

		// Server Params
		// NOTE: We don't need the server params for the chatbot if there are no overrides, it means
		// we are using the default or a specific chatbot.
		$hasServerOverrides = count( array_intersect( array_keys( $atts ), MWAI_CHATBOT_SERVER_PARAMS ) ) > 0;
		$serverParams = [];
		if ( $hasServerOverrides ) {
			foreach ( MWAI_CHATBOT_SERVER_PARAMS as $param ) {
				if ( isset( $atts[$param] ) ) {
					$serverParams[$param] = $atts[$param];
				}
				else {
					$serverParams[$param] = $chatbot[$param] ?? null;
				}
			}
		}

		// Front Params
		$frontSystem = $this->build_front_params( $botId, $customId );

		// Clean Params
		$frontParams = $this->clean_params( $frontParams );
		$frontSystem = $this->clean_params( $frontSystem );
		$serverParams = $this->clean_params( $serverParams );

		// Server-side: Keep the System Params
		if ( $hasServerOverrides ) {
			if ( empty( $customId ) ) {
				$customId = md5( json_encode( $serverParams ) );
				$frontSystem['customId'] = $customId;
			}
			set_transient( 'mwai_custom_chatbot_' . $customId, $serverParams, 60 * 60 * 24 );
		}

		// Client-side: Prepare JSON for Front Params and System Params
		$theme = isset( $frontParams['themeId'] ) ? $this->core->get_theme( $frontParams['themeId'] ) : null;
		$jsonFrontParams = htmlspecialchars( json_encode( $frontParams ), ENT_QUOTES, 'UTF-8' );
		$jsonFrontSystem = htmlspecialchars( json_encode( $frontSystem ), ENT_QUOTES, 'UTF-8' );
		$jsonFrontTheme = htmlspecialchars( json_encode( $theme ), ENT_QUOTES, 'UTF-8' );
		//$jsonAttributes = htmlspecialchars(json_encode($atts), ENT_QUOTES, 'UTF-8');

		$this->enqueue_scripts();
		return "<div class='mwai-chatbot-container' data-params='{$jsonFrontParams}' data-system='{$jsonFrontSystem}' data-theme='{$jsonFrontTheme}'></div>";
	}

	function shortcode_chat_discussions( $atts ) {
    $atts = empty($atts) ? [] : $atts;

    // Resolve the bot info
		$resolvedBot = $this->resolveBotInfo( $atts );
    if ( isset( $resolvedBot['error'] ) ) {
      return $resolvedBot['error'];
    }
    $chatbot = $resolvedBot['chatbot'];
    $botId = $resolvedBot['botId'];
    $customId = $resolvedBot['customId'];

		// Rename the keys of the atts into camelCase to match the internal params system.
		$atts = array_map( function( $key, $value ) {
			$key = str_replace( '_', ' ', $key );
			$key = ucwords( $key );
			$key = str_replace( ' ', '', $key );
			$key = lcfirst( $key );
			return [ $key => $value ];
		}, array_keys( $atts ), $atts );
		$atts = array_merge( ...$atts );

		// Front Params
		$frontParams = [];
		foreach ( MWAI_DISCUSSIONS_FRONT_PARAMS as $param ) {
			if ( isset( $atts[$param] ) ) {
				$frontParams[$param] = $atts[$param];
			}
			else if ( isset( $chatbot[$param] ) ) {
				$frontParams[$param] = $chatbot[$param];
			}
		}

		// Server Params
		$serverParams = [];
		foreach ( MWAI_DISCUSSIONS_SERVER_PARAMS as $param ) {
			if ( isset( $atts[$param] ) ) {
				$serverParams[$param] = $atts[$param];
			}
		}

		// Front System
		$frontSystem = $this->build_front_params( $botId, $customId );

    // Clean Params
		$frontParams = $this->clean_params( $frontParams );
		$frontSystem = $this->clean_params( $frontSystem );
		$serverParams = $this->clean_params( $serverParams );

    $theme = isset( $frontParams['themeId'] ) ? $this->core->get_theme( $frontParams['themeId'] ) : null;
		$jsonFrontParams = htmlspecialchars( json_encode( $frontParams ), ENT_QUOTES, 'UTF-8' );
		$jsonFrontSystem = htmlspecialchars( json_encode( $frontSystem ), ENT_QUOTES, 'UTF-8' );
		$jsonFrontTheme = htmlspecialchars( json_encode( $theme ), ENT_QUOTES, 'UTF-8' );

    return "<div class='mwai-discussions-container' data-params='{$jsonFrontParams}' data-system='{$jsonFrontSystem}' data-theme='{$jsonFrontTheme}'></div>";
  }

	function clean_params( &$params ) {
		foreach ( $params as $param => $value ) {
			if ( empty( $value ) || is_array( $value ) ) {
				continue;
			}
			$lowerCaseValue = strtolower( $value );
			if ( $lowerCaseValue === 'true' || $lowerCaseValue === 'false' || is_bool( $value ) ) {
				$params[$param] = filter_var( $value, FILTER_VALIDATE_BOOLEAN );
			}
			else if ( is_numeric( $value ) ) {
				$params[$param] = filter_var( $value, FILTER_VALIDATE_FLOAT );
			}
		}
		return $params;
	}
	
}
