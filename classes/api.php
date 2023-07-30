<?php

class Meow_MWAI_API {
	public $core;

	public function __construct() {
		global $mwai_core;
		$this->core = $mwai_core;
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
			'permission_callback' => array( $this->core, 'can_access_public_api' ),
		) );
		register_rest_route( 'mwai/v1', '/moderationCheck', array(
			'methods' => 'POST',
			'callback' => array( $this, 'rest_moderationCheck' ),
			'permission_callback' => array( $this->core, 'can_access_public_api' ),
		) );
	}

	public function rest_simpleTextQuery( $request ) {
		try {
			$params = $request->get_params();
			$prompt = $params['prompt'];
			$options = isset( $params['options'] ) ? $params['options'] : [];
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

  public function simpleTextQuery( $prompt, $options = [] ) {
    global $mwai_core;
		$query = new Meow_MWAI_Query_Text( $prompt );
		$query->injectParams( $options );
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