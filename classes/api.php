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

		register_rest_route( 'mwai/v1', '/simpleAuthCheck', array(
			'methods' => 'GET',
			'callback' => array( $this, 'rest_simpleAuthCheck' ),
			'permission_callback' => function( $request ) {
				return $this->core->can_access_public_api( 'simpleAuthCheck', $request );
			},
		) );
		register_rest_route( 'mwai/v1', '/simpleTextQuery', array(
			'methods' => 'POST',
			'callback' => array( $this, 'rest_simpleTextQuery' ),
			'permission_callback' => function( $request ) {
				return $this->core->can_access_public_api( 'simpleTextQuery', $request );
			},
		) );
		register_rest_route( 'mwai/v1', '/simpleImageQuery', array(
			'methods' => 'POST',
			'callback' => array( $this, 'rest_simpleImageQuery' ),
			'permission_callback' => function( $request ) {
				return $this->core->can_access_public_api( 'simpleImageQuery', $request );
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

	public function rest_simpleAuthCheck( $request ) {
		try {
			$params = $request->get_params();
			$current_user = wp_get_current_user();
			$current_email = $current_user->user_email;
			return new WP_REST_Response([ 'success' => true, 'data' => [ 
				'type' => 'email',
				'value' => $current_email
			] ], 200 );
		}
		catch (Exception $e) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	public function rest_simpleChatbotQuery( $request ) {
		try {
			$params = $request->get_params();
			$botId = isset( $params['botId'] ) ? $params['botId'] : '';
			$message = isset( $params['message'] ) ? $params['message'] : '';
			if ( empty( $message ) ) {
				$message = isset( $params['prompt'] ) ? $params['prompt'] : '';
			}
			$chatId = isset( $params['chatId'] ) ? $params['chatId'] : null;
			$params = null;
			if ( !empty( $chatId ) ) {
				$params = array( 'chatId' => $chatId );
			}
			if ( empty( $botId ) || empty( $message ) ) {
				throw new Exception( 'The botId and message are required.' );
			}
			$reply = $this->simpleChatbotQuery( $botId, $message, $params );
			return new WP_REST_Response([ 'success' => true, 'data' => $reply ], 200 );
		}
		catch (Exception $e) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}


	public function rest_simpleTextQuery( $request ) {
		try {
			$params = $request->get_params();
			$message = isset( $params['message'] ) ? $params['message'] : '';
			if ( empty( $message ) ) {
				$message = isset( $params['prompt'] ) ? $params['prompt'] : '';
			}
			$options = isset( $params['options'] ) ? $params['options'] : [];
			$scope = isset( $params['scope'] ) ? $params['scope'] : 'public-api';
			if ( !empty( $scope ) ) {
				$options['scope'] = $scope;
			}
			if ( empty( $message ) ) {
				throw new Exception( 'The message is required.' );
			}
			$reply = $this->simpleTextQuery( $message, $options );
			return new WP_REST_Response([ 'success' => true, 'data' => $reply ], 200 );
		}
		catch (Exception $e) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	public function rest_simpleImageQuery( $request ) {
		try {
			$params = $request->get_params();
			$message = isset( $params['message'] ) ? $params['message'] : '';
			if ( empty( $message ) ) {
				$message = isset( $params['prompt'] ) ? $params['prompt'] : '';
			}
			$options = isset( $params['options'] ) ? $params['options'] : [];
			$resolution = isset( $params['resolution'] ) ? $params['resolution'] : '';
			$scope = isset( $params['scope'] ) ? $params['scope'] : 'public-api';
			if ( !empty( $scope ) ) {
				$options['scope'] = $scope;
			}
			if ( empty( $message ) ) {
				throw new Exception( 'The message is required.' );
			}
			if ( !empty( $resolution ) ) {
				$options['resolution'] = $resolution;
			}
			$reply = $this->simpleImageQuery( $message, $options );
			return new WP_REST_Response([ 'success' => true, 'data' => $reply ], 200 );
		}
		catch (Exception $e) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	public function rest_simpleVisionQuery( $request ) {
		try {
			$params = $request->get_params();
			$message = isset( $params['message'] ) ? $params['message'] : '';
			if ( empty( $message ) ) {
				$message = isset( $params['prompt'] ) ? $params['prompt'] : '';
			}
			$url = isset( $params['url'] ) ? $params['url'] : '';
			$path = isset( $params['path'] ) ? $params['path'] : '';
			$options = isset( $params['options'] ) ? $params['options'] : [];
			$scope = isset( $params['scope'] ) ? $params['scope'] : 'public-api';
			if ( !empty( $scope ) ) {
				$options['scope'] = $scope;
			}
			if ( empty( $message ) ) {
				throw new Exception( 'The message is required.' );
			}
			if ( empty( $url ) && empty( $path ) ) {
				throw new Exception( 'The url or path is required.' );
			}
			$reply = $this->simpleVisionQuery( $message, $url, $path, $options );
			return new WP_REST_Response([ 'success' => true, 'data' => $reply ], 200 );
		}
		catch (Exception $e) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	public function rest_simpleJsonQuery( $request ) {
		try {
			$params = $request->get_params();
			$message = isset( $params['message'] ) ? $params['message'] : '';
			if ( empty( $message ) ) {
				$message = isset( $params['prompt'] ) ? $params['prompt'] : '';
			}
			$options = isset( $params['options'] ) ? $params['options'] : [];
			$scope = isset( $params['scope'] ) ? $params['scope'] : 'public-api';
			if ( !empty( $scope ) ) {
				$options['scope'] = $scope;
			}
			if ( empty( $message ) ) {
				throw new Exception( 'The message is required.' );
			}
			$reply = $this->simpleJsonQuery( $message, $options );
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
	 * @param string $message The prompt for the AI.
	 * @param string $url The URL of the image to analyze.
	 * @param string|null $path The path to the image file. If provided, the image data will be read from this file.
	 * @param array $params Additional parameters for the AI query.
	 *
	 * @return string The result of the AI query.
	 */
	public function simpleVisionQuery( $message, $url, $path = null, $params = [] ) {
		global $mwai_core;
		$ai_vision_default_env = $this->core->get_option( 'ai_vision_default_env' );
		$ai_vision_default_model = $this->core->get_option( 'ai_vision_default_model' );
		if ( empty( $ai_vision_default_model ) ) {
			$ai_vision_default_model = MWAI_FALLBACK_MODEL_VISION;
		}
		$query = new Meow_MWAI_Query_Text( $message );
		if ( !empty( $ai_vision_default_env ) ) {
			$query->set_env_id( $ai_vision_default_env );
		}
		if ( !empty( $ai_vision_default_model ) ) {
			$query->set_model( $ai_vision_default_model );
		}
		$query->inject_params( $params );
		$remote_upload = $this->core->get_option( 'image_remote_upload' );
		$preferURL = $remote_upload === 'url';

		if ( $preferURL && $url ) {
			$query->set_file( $url, 'url', 'vision' );
		}
		else if ( !$preferURL && !empty( $path ) ) {
			$binary = file_get_contents( $path );
			// Check if there is an error and what
			if ( $binary === false ) {
				throw new Exception( 'The file could not be read.' );
			}
			$data = base64_encode( $binary );
			$query->set_file( $data, 'data', 'vision' );
		}
		else if ( $url ) {
			$query->set_file( $url, 'url', 'vision' );
		}
		else if ( !empty($path ) ) {
			$data = base64_encode( file_get_contents( $path ) );
			$query->set_file( $data, 'data', 'vision' );
		}

		$reply = $mwai_core->run_query( $query );
		return $reply->result;
	}

	/**
	 * Executes a chatbot query.
	 * It will use the discussion if chatId is provided in the parameters.
	 * 
	 * @param string $botId The ID of the chatbot.
	 * @param string $message The prompt for the AI.
	 * @param array $params Additional parameters for the AI query.
	 * 
	 * @return string The result of the AI query.
	 */
	public function simpleChatbotQuery( $botId, $message, $params = [] ) {
		if ( !isset( $params['messages'] ) && isset( $params['chatId'] ) ) {
			$discussion = $this->discussions_module->get_discussion( $botId, $params['chatId'] );
			if ( !empty( $discussion ) ) {
				$params['messages'] = $discussion->messages;
			}
		}
		$data = $this->chatbot_module->chat_submit( $botId, $message, $params );
		return $data['reply'];
	}

	/**
	 * Executes a text query.
	 * 
	 * @param string $message The prompt for the AI.
	 * @param array $params Additional parameters for the AI query.
	 * 
	 * @return string The result of the AI query.
	 */
  public function simpleTextQuery( $message, $params = [] ) {
    global $mwai_core;
		$query = new Meow_MWAI_Query_Text( $message );
		$query->inject_params( $params );
		$reply = $mwai_core->run_query( $query );
		return $reply->result;
	}

	public function simpleImageQuery( $message, $params = [] ) {
		global $mwai_core;
		$query = new Meow_MWAI_Query_Image( $message );
		$query->inject_params( $params );
		$reply = $mwai_core->run_query( $query );
		return $reply->result;
	}

	/**
	 * Executes a query that will have to return a JSON result.
	 * 
	 * @param string $message The prompt for the AI.
	 * @param array $params Additional parameters for the AI query.
	 * 
	 * @return array The result of the AI query.
	 */
	public function simpleJsonQuery( $message, $url = null, $path = null, $params = [] ) {
		if ( !empty( $url ) || !empty( $path ) ) {
			throw new Exception( 'The url and path are not supported yet by the simpleJsonQuery.' );
		} 
		global $mwai_core;
		$query = new Meow_MWAI_Query_Text( $message . "\nYour reply must be a formatted JSON." );
		$query->inject_params( $params );
		$query->set_response_format( 'json' );
		$ai_json_default_env = $mwai_core->get_option( 'ai_json_default_env' );
		$ai_json_default_model = $mwai_core->get_option( 'ai_json_default_model' );
		if ( !empty( $ai_json_default_env ) ) {
			$query->set_env_id( $ai_json_default_env );
		}
		if ( !empty( $ai_json_default_model ) ) {
			$query->set_model( $ai_json_default_model );
		}
		else {
			$query->set_model( MWAI_FALLBACK_MODEL_JSON );
		}
		$reply = $mwai_core->run_query( $query );
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
		$openai = Meow_MWAI_Engines_Factory::get_openai( $mwai_core );
		$res = $openai->moderate( $text );
		if ( !empty( $res ) && !empty( $res['results'] ) ) {
			return (bool)$res['results'][0]['flagged'];
		}
	}
	#endregion
}