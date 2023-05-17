<?php

// Params for the chatbot (front and server)

define( 'MWAI_CHATBOT_FRONT_PARAMS', [ 'aiName', 'userName', 'guestName', 'textSend', 'textClear', 
	'textInputPlaceholder', 'textInputMaxLength', 'textCompliance', 'startSentence', 'localMemory',
	'themeId', 'window', 'icon', 'iconText', 'iconAlt', 'iconPosition', 'fullscreen', 'copyButton'
] );
define( 'MWAI_CHATBOT_SERVER_PARAMS', [ 'id', 'env', 'mode', 'contentAware', 'embeddingsIndex', 'context',
	'casuallyFineTuned', 'promptEnding', 'completionEnding', 'model', 'temperature', 'maxTokens',
	'maxResults', 'apiKey', 'service'
] );

// Params for the discussions (front and server)

define( 'MWAI_DISCUSSIONS_FRONT_PARAMS', [ 'themeId' ] );
define( 'MWAI_DISCUSSIONS_SERVER_PARAMS', [] );

class Meow_MWAI_Modules_Chatbot {
	private $core = null;
	private $namespace = 'mwai-ui/v1';
	private $siteWideChatId = null;

	public function __construct() {
		global $mwai_core;
		$this->core = $mwai_core;
		add_shortcode( 'mwai_chatbot_v2', array( $this, 'chat_shortcode' ) );
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
		$this->siteWideChatId = $this->core->get_option( 'chatId' );
		add_action( 'wp_enqueue_scripts', array( $this, 'register_scripts' ) );

		if ( $this->core->get_option( 'shortcode_chat_discussions' ) ) {
      add_shortcode( 'mwai_discussions', [ $this, 'shortcode_chat_discussions' ] );
    }
	}

	public function register_scripts() {
		wp_register_script( 'mwai_highlight', MWAI_URL . 'vendor/highlightjs/highlight.min.js', [], '11.7', false );
		$physical_file = MWAI_PATH . '/app/chatbot.js';	
		$cache_buster = file_exists( $physical_file ) ? filemtime( $physical_file ) : MWAI_VERSION;
		wp_register_script( 'mwai_chatbot', MWAI_URL . '/app/chatbot.js', [ 'wp-element' ], $cache_buster, false );
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
			'callback' => array( $this, 'rest_chat' ),
			'permission_callback' => '__return_true'
		) );
	}

	public function basics_security_check( $id, $chatId, $newMessage ) {
		if ( empty( $newMessage ) ) {
			error_log("AI Engine: The query was rejected - message was empty.");
			return false;
		}
		if ( !$chatId && !$id ) {
			error_log("AI Engine: The query was rejected - no chatId nor id was specified.");
			return false;
		}
		$length = strlen( $newMessage );
		if ( $length < 1 || $length > ( 4096 - 512 ) ) {
			error_log("AI Engine: The query was rejected - message was too short or too long.");
			return false;
		}
		return true;
	}

	public function rest_chat( $request ) {
		try {
			$params = $request->get_json_params();
			$id = $params['id'] ?? null;
			$chatId = $params['chatId'] ?? null;
			$newMessage = trim( $params['newMessage'] ?? '' );

			if ( !$this->basics_security_check( $id, $chatId, $newMessage )) {
				return new WP_REST_Response( [ 
					'success' => false, 
					'message' => 'Sorry, your query has been rejected.' ], 403
				);
			}

			// Custom Chatbot
			if ( $id ) {
				$chatbot = get_transient( 'mwai_custom_chatbot_' . $id );
			}
			// Registered Chatbot
			if ( !$chatbot && $chatId ) {
				$chatbot = $this->core->getChatbot( $chatId );
			}

			if ( !$chatbot ) {
				error_log("AI Engine: No chatbot was found for this query.");
				return new WP_REST_Response( [ 
					'success' => false, 
					'message' => 'Sorry, your query has been rejected.' ], 403
				);
			}
			
			// Create QueryText
			$context = null;
			$mode = $chatbot['mode'] ?? 'chat';

			if ( $mode === 'images' ) {
				$query = new Meow_MWAI_QueryImage( $newMessage );

				// Handle Params
				$newParams = [];
				foreach ( $chatbot as $key => $value ) {
					$newParams[$key] = $value;
				}
				foreach ( $params as $key => $value ) {
					$newParams[$key] = $value;
				}
				$params = apply_filters( 'mwai_chatbot_params', $newParams );
				$params['env'] = empty( $params['env'] ) ? 'chatbot' : $params['env'];
				$query->injectParams( $params );
			}
			else {
				$query = new Meow_MWAI_QueryText( $newMessage, 1024 );
				$query->setIsChat( true );

				// Handle Params
				$newParams = [];
				foreach ( $chatbot as $key => $value ) {
					$newParams[$key] = $value;
				}
				foreach ( $params as $key => $value ) {
					$newParams[$key] = $value;
				}
				$params = apply_filters( 'mwai_chatbot_params', $newParams );
				$params['env'] = empty( $params['env'] ) ? 'chatbot' : $params['env'];
				$query->injectParams( $params );

				// Takeover
				$takeoverAnswer = apply_filters( 'mwai_chatbot_takeover', null, $query, $params );
				if ( !empty( $takeoverAnswer ) ) {
					return new WP_REST_Response( [ 'success' => true, 'reply' => $takeoverAnswer,
						'html' => $takeoverAnswer, 'usage' => null ], 200 );
				}

				// Moderation
				if ( $this->core->get_option( 'shortcode_chat_moderation' ) ) {
					global $mwai;
					$isFlagged = $mwai->moderationCheck( $query->prompt );
					if ( $isFlagged ) {
						return new WP_REST_Response( [ 
							'success' => false, 
							'message' => 'Sorry, your message has been rejected by moderation.' ], 403
						);
					}
				}

				// Awareness & Embeddings
				$embeddingsIndex = $params['embeddingsIndex'] ?? null;
				if ( $query->mode === 'chat' && !empty( $embeddingsIndex ) ) {
					$context = apply_filters( 'mwai_context_search', $query, $embeddingsIndex );
					if ( !empty( $context ) ) {
						$content = $this->core->cleanSentences( $context['content'] );
						$query->injectContext( $content );
					}
				}
			}

			// Query the AI
			$reply = $this->core->ai->run( $query );
			$rawText = $reply->result;
			$extra = [];
			if ( $context ) {
				$extra = [ 'embeddings' => $context['embeddings'] ];
			}
			$html = apply_filters( 'mwai_chatbot_reply', $rawText, $query, $params, $extra );
			if ( $this->core->get_option( 'shortcode_chat_formatting' ) ) {
				$html = $this->core->markdown_to_html( $html );
			}

			return new WP_REST_Response( [
				'success' => true,
				'reply' => $rawText,
				'images' => $reply->getType() === 'images' ? $reply->results : null,
				'html' => $html,
				'usage' => $reply->usage
			], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	public function inject_chat() {
		$params = $this->core->getChatbot( $this->siteWideChatId );
		$cleanParams = [];
		if ( !empty( $params ) ) {
			$cleanParams['window'] = true;
			$cleanParams['id'] = $this->siteWideChatId;
			echo $this->chat_shortcode( $cleanParams );
		}
		return null;
	}

	public function build_front_params( $id, $chatId ) {
		$frontSystem = [
			'id' => $id,
			'chatId' => $chatId,
			'userData' => $this->core->getUserData(),
			'sessionId' => $this->core->get_session_id(),
			'restNonce' => $this->core->get_nonce(),
			'contextId' => get_the_ID(),
			'pluginUrl' => MWAI_URL,
			'restUrl' => untrailingslashit( rest_url() ),
			'debugMode' => $this->core->get_option( 'debug_mode' ),
			'typewriter' => $this->core->get_option( 'shortcode_chat_typewriter' ),
			'speech_recognition' => $this->core->get_option( 'speech_recognition' ),
			'speech_synthesis' => $this->core->get_option( 'speech_synthesis' ),
		];
		return $frontSystem;
	}

	public function chat_shortcode( $atts ) {
		$atts = empty($atts) ? [] : $atts;

		// Properly handle the id, chatId, and chatbot
		// We have the same in discussions.php
		$chatbot = null;
		$chatId = $atts['chat_id'] ?? null;
		$id = $atts['id'] ?? null;
		unset( $atts['chat_id'], $atts['id'] );
		if ( $chatId ) {
			$chatbot = $this->core->getChatbot( $chatId );
			if ( !$chatbot ) {
				return "AI Engine: Chatbot not found.";
			}
		}
		if ( $id && !$chatbot ) {
			$chatbot = $this->core->getChatbot( $id );
			$chatId = $chatbot ? $id : 'default';
		}
		$chatbot = $chatbot ?: $this->core->getChatbot( 'default' );
		$chatId = $chatId ?: 'default';
		$isCustom = $chatId == 'default' && isset( $atts['id'] );

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
		$serverParams = [];
		foreach ( MWAI_CHATBOT_SERVER_PARAMS as $param ) {
			if ( isset( $atts[$param] ) ) {
				$serverParams[$param] = $atts[$param];
			}
		}

		// Front Params
		$frontSystem = $this->build_front_params( $id, $chatId );

		// Clean Params
		$frontParams = $this->cleanParams( $frontParams );
		$frontSystem = $this->cleanParams( $frontSystem );
		$serverParams = $this->cleanParams( $serverParams );

		// Server-side: Keep the System Params
		if ( count( $serverParams ) > 0 ) {
			if ( !$isCustom ) {
				$id = md5( json_encode( $serverParams ) );
				$chatId = null;
				$frontSystem['id'] = $id;
				$frontSystem['chatId'] = $chatId;
			}
			set_transient( 'mwai_custom_chatbot_' . $id, $serverParams, 60 * 60 * 24 );
		}

		// Client-side: Prepare JSON for Front Params and System Params
		$theme = isset( $frontParams['themeId'] ) ? $this->core->getTheme( $frontParams['themeId'] ) : null;
		$jsonFrontParams = htmlspecialchars( json_encode( $frontParams ), ENT_QUOTES, 'UTF-8' );
		$jsonFrontSystem = htmlspecialchars( json_encode( $frontSystem ), ENT_QUOTES, 'UTF-8' );
		$jsonFrontTheme = htmlspecialchars( json_encode( $theme ), ENT_QUOTES, 'UTF-8' );
		//$jsonAttributes = htmlspecialchars(json_encode($atts), ENT_QUOTES, 'UTF-8');

		$this->enqueue_scripts();
		return "<div class='mwai-chatbot-container' data-params='{$jsonFrontParams}' data-system='{$jsonFrontSystem}' data-theme='{$jsonFrontTheme}'></div>";
	}

	function shortcode_chat_discussions( $atts ) {
    $atts = empty($atts) ? [] : $atts;

    // Properly handle the id, chatId, and chatbot
		// We have the same in chatbot.php
		$chatbot = null;
		$chatId = $atts['chat_id'] ?? null;
		$id = $atts['id'] ?? null;
		unset( $atts['chat_id'], $atts['id'] );
		if ( $chatId ) {
			$chatbot = $this->core->getChatbot( $chatId );
			if ( !$chatbot ) {
				return "AI Engine: Chatbot not found.";
			}
		}
		if ( $id && !$chatbot ) {
			$chatbot = $this->core->getChatbot( $id );
			$chatId = $chatbot ? $id : 'default';
		}
		$chatbot = $chatbot ?: $this->core->getChatbot( 'default' );
		$chatId = $chatId ?: 'default';
		$isCustom = $chatId == 'default' && isset( $atts['id'] );

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
		$frontSystem = $this->build_front_params( $id, $chatId );

    // Clean Params
		$frontParams = $this->cleanParams( $frontParams );
		$frontSystem = $this->cleanParams( $frontSystem );
		$serverParams = $this->cleanParams( $serverParams );

    $theme = isset( $frontParams['themeId'] ) ? $this->core->getTheme( $frontParams['themeId'] ) : null;
		$jsonFrontParams = htmlspecialchars( json_encode( $frontParams ), ENT_QUOTES, 'UTF-8' );
		$jsonFrontSystem = htmlspecialchars( json_encode( $frontSystem ), ENT_QUOTES, 'UTF-8' );
		$jsonFrontTheme = htmlspecialchars( json_encode( $theme ), ENT_QUOTES, 'UTF-8' );

    return "<div class='mwai-discussions-container' data-params='{$jsonFrontParams}' data-system='{$jsonFrontSystem}' data-theme='{$jsonFrontTheme}'></div>";
  }

	function cleanParams( &$params ) {
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
