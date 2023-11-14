<?php

class Meow_MWAI_API {
	public $core;
	private $chatbot_module;
	private $discussions_module;

	public function __construct( $chatbot_module, $discussions_module ) {
		global $mwai_core;
		$this->core = $mwai_core;
		$this->chatbot_module = $chatbot_module;
		$this->discussions_module = $discussions_module;
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
	}

	#region REST API
	function rest_api_init() {
		$public_api = $this->core->get_option( 'public_api' );
		if ( !$public_api ) {
			return;
		}
		register_rest_route( 'mwai/v1', '/simpleTextQuery', array(
			'methods' => 'POST',
			'callback' => array( $this, 'rest_simpleTextQuery' ),
			'permission_callback' => function( $request ) {
				return $this->core->can_access_public_api( 'simpleTextQuery', $request );
			},
		) );
		register_rest_route( 'mwai/v1', '/simpleVisionQuery', array(
			'methods' => 'POST',
			'callback' => array( $this, 'rest_simpleVisionQuery' ),
			'permission_callback' => function( $request ) {
				return $this->core->can_access_public_api( 'simpleVisionQuery', $request );
			},
		) );
		register_rest_route( 'mwai/v1', '/simpleJsonQuery', array(
			'methods' => 'POST',
			'callback' => array( $this, 'rest_simpleJsonQuery' ),
			'permission_callback' => function( $request ) {
				return $this->core->can_access_public_api( 'simpleJsonQuery', $request );
			},
		) );
		register_rest_route( 'mwai/v1', '/moderationCheck', array(
			'methods' => 'POST',
			'callback' => array( $this, 'rest_moderationCheck' ),
			'permission_callback' => function( $request ) {
				return $this->core->can_access_public_api( 'moderationCheck', $request );
			},
		) );

		if ( $this->chatbot_module ) {
			register_rest_route( 'mwai/v1', '/simpleChatbotQuery', array(
				'methods' => 'POST',
				'callback' => array( $this, 'rest_simpleChatbotQuery' ),
				'permission_callback' => function( $request ) {
					return $this->core->can_access_public_api( 'simpleChatbotQuery', $request );
				},
			) );
		}
	}

	public function rest_simpleChatbotQuery( $request ) {
		try {
			$params = $request->get_params();
			$botId = isset( $params['botId'] ) ? $params['botId'] : '';
			$prompt = isset( $params['prompt'] ) ? $params['prompt'] : '';
			$chatId = isset( $params['chatId'] ) ? $params['chatId'] : null;
			$params = null;
			if ( !empty( $chatId ) ) {
				$params = array( 'chatId' => $chatId );
			}
			if ( empty( $botId ) || empty( $prompt ) ) {
				throw new Exception( 'The botId and prompt are required.' );
			}
			$reply = $this->simpleChatbotQuery( $botId, $prompt, $params );
			return new WP_REST_Response([ 'success' => true, 'data' => $reply ], 200 );
		}
		catch (Exception $e) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	public function rest_simpleTextQuery( $request ) {
		try {
			$params = $request->get_params();
			$prompt = isset( $params['prompt'] ) ? $params['prompt'] : '';
			$options = isset( $params['options'] ) ? $params['options'] : [];
			$env = isset( $params['env'] ) ? $params['env'] : 'public-api';
			if ( !empty( $env ) ) {
				$options['env'] = $env;
			}
			if ( empty( $prompt ) ) {
				throw new Exception( 'The prompt is required.' );
			}
			$reply = $this->simpleTextQuery( $prompt, $options );
			return new WP_REST_Response([ 'success' => true, 'data' => $reply ], 200 );
		}
		catch (Exception $e) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	public function rest_simpleVisionQuery( $request ) {
		try {
			$params = $request->get_params();
			$prompt = isset( $params['prompt'] ) ? $params['prompt'] : '';
			$url = isset( $params['url'] ) ? $params['url'] : '';
			$path = isset( $params['path'] ) ? $params['path'] : '';
			$options = isset( $params['options'] ) ? $params['options'] : [];
			$env = isset( $params['env'] ) ? $params['env'] : 'public-api';
			if ( !empty( $env ) ) {
				$options['env'] = $env;
			}
			if ( empty( $prompt ) ) {
				throw new Exception( 'The prompt is required.' );
			}
			if ( empty( $url ) && empty( $path ) ) {
				throw new Exception( 'The url or path is required.' );
			}
			$reply = $this->simpleVisionQuery( $prompt, $url, $path, $options );
			return new WP_REST_Response([ 'success' => true, 'data' => $reply ], 200 );
		}
		catch (Exception $e) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	public function rest_simpleJsonQuery( $request ) {
		try {
			$params = $request->get_params();
			$prompt = isset( $params['prompt'] ) ? $params['prompt'] : '';
			$options = isset( $params['options'] ) ? $params['options'] : [];
			$env = isset( $params['env'] ) ? $params['env'] : 'public-api';
			if ( !empty( $env ) ) {
				$options['env'] = $env;
			}
			if ( empty( $prompt ) ) {
				throw new Exception( 'The prompt is required.' );
			}
			$reply = $this->simpleJsonQuery( $prompt, $options );
			return new WP_REST_Response([ 'success' => true, 'data' => $reply ], 200 );
		}
		catch (Exception $e) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	public function rest_moderationCheck( $request ) {
		try {
			$params = $request->get_params();
			$text = $params['text'];
			$reply = $this->moderationCheck( $text );
			return new WP_REST_Response([ 'success' => true, 'data' => $reply ], 200 );
		}
		catch (Exception $e) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}
	#endregion
	
	#region Simple API
	/**
	 * Executes a vision query.`
	 *
	 * @param string $prompt The prompt for the AI.
	 * @param string $url The URL of the image to analyze.
	 * @param string|null $path The path to the image file. If provided, the image data will be read from this file.
	 * @param array $params Additional parameters for the AI query.
	 *
	 * @return string The result of the AI query.
	 */
	public function simpleVisionQuery( $prompt, $url, $path = null, $params = [] ) {
		global $mwai_core;
		$query = new Meow_MWAI_Query_Text( $prompt );
		$query->injectParams( $params );
		$query->setModel( MWAI_FALLBACK_MODEL_VISION );
		$remote_upload = $this->core->get_option( 'image_remote_upload' );
		$preferURL = $remote_upload === 'url';

		if ( $preferURL && $url ) {
			$query->setNewImage( $url );
		}
		else if ( !$preferURL && !empty( $path ) ) {
			$data = base64_encode( file_get_contents( $path ) );
			$query->setNewImageData( $data );
		}
		else if ( $url ) {
			$query->setNewImage( $url );
		}
		else if ( !empty($path ) ) {
			$data = base64_encode( file_get_contents( $path ) );
			$query->setNewImageData( $data );
		}

		$reply = $mwai_core->ai->run( $query );
		return $reply->result;
	}

	/**
	 * Executes a chatbot query.
	 * It will use the discussion if chatId is provided in the parameters.
	 * 
	 * @param string $botId The ID of the chatbot.
	 * @param string $prompt The prompt for the AI.
	 * @param array $params Additional parameters for the AI query.
	 * 
	 * @return string The result of the AI query.
	 */
	public function simpleChatbotQuery( $botId, $prompt, $params = [] ) {
		if ( !isset( $params['messages'] ) && isset( $params['chatId'] ) ) {
			$discussion = $this->discussions_module->get_discussion( $botId, $params['chatId'] );
			if ( !empty( $discussion ) ) {
				$params['messages'] = $discussion->messages;
			}
		}
		$data = $this->chatbot_module->chat_submit( $botId, $prompt, $params );
		return $data['reply'];
	}

	/**
	 * Executes a text query.
	 * 
	 * @param string $prompt The prompt for the AI.
	 * @param array $params Additional parameters for the AI query.
	 * 
	 * @return string The result of the AI query.
	 */
  public function simpleTextQuery( $prompt, $params = [] ) {
    global $mwai_core;
		$query = new Meow_MWAI_Query_Text( $prompt );
		$query->injectParams( $params );
		$reply = $mwai_core->ai->run( $query );
		return $reply->result;
	}

	/**
	 * Executes a query that will have to return a JSON result.
	 * 
	 * @param string $prompt The prompt for the AI.
	 * @param array $params Additional parameters for the AI query.
	 * 
	 * @return array The result of the AI query.
	 */
	public function simpleJsonQuery( $prompt, $url = null, $path = null, $params = [] ) {
		if ( !empty( $url ) || !empty( $path ) ) {
			throw new Exception( 'The url and path are not supported yet by the simpleJsonQuery.' );
		} 
		global $mwai_core;
		$query = new Meow_MWAI_Query_Text( $prompt . "\nYour reply must be a formatted JSON." );
		$query->injectParams( $params );
		$query->setResponseFormat( 'json' );
		$query->setModel( MWAI_FALLBACK_MODEL_JSON );
		$reply = $mwai_core->ai->run( $query );
		try {
			$json = json_decode( $reply->result, true );
			return $json;
		}
		catch ( Exception $e ) {
			throw new Exception( 'The result is not a valid JSON.' );
		}
	}

	/**
	 * Checks if a text is safe or not.
	 * 
	 * @param string $text The text to check.
	 * 
	 * @return bool True if the text is safe, false otherwise.
	 */
	public function moderationCheck( $text ) {
		global $mwai_core;
		$openai = new Meow_MWAI_Engines_OpenAI( $mwai_core );
		$res = $openai->moderate( $text );
		if ( !empty( $res ) && !empty( $res['results'] ) ) {
			return (bool)$res['results'][0]['flagged'];
		}
	}
	#endregion
}