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

  public function simpleTextQuery( $prompt, $params = [] ) {
    global $mwai_core;
		$query = new Meow_MWAI_Query_Text( $prompt );
		$query->injectParams( $params );
		$reply = $mwai_core->ai->run( $query );
		return $reply->result;
	}

	public function moderationCheck( $text ) {
		global $mwai_core;
		$openai = new Meow_MWAI_Engines_OpenAI( $mwai_core );
		$res = $openai->moderate( $text );
		if ( !empty( $res ) && !empty( $res['results'] ) ) {
			return (bool)$res['results'][0]['flagged'];
		}
	}
}