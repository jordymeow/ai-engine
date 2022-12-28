<?php

class Meow_MWAI_Rest
{
	private $core = null;
	private $namespace = 'ai-engine/v1';

	public function __construct( $core ) {
		if ( !current_user_can( 'administrator' ) ) {
			return;
		} 
		$this->core = $core;
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
	}

	function rest_api_init() {
		try {
			register_rest_route( $this->namespace, '/update_option', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_update_option' )
			) );
			register_rest_route( $this->namespace, '/all_settings', array(
				'methods' => 'GET',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_all_settings' ),
			) );
			register_rest_route( $this->namespace, '/make_completions', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'make_completions' ),
			) );
			register_rest_route( $this->namespace, '/make_titles', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'make_titles' ),
			) );
			register_rest_route( $this->namespace, '/make_excerpts', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'make_excerpts' ),
			) );
			register_rest_route( $this->namespace, '/update_post_title', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'update_post_title' ),
			) );
			register_rest_route( $this->namespace, '/update_post_excerpt', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'update_post_excerpt' ),
			) );
		}
		catch ( Exception $e ) {
			var_dump( $e );
		}
	}

	function rest_all_settings() {
		return new WP_REST_Response( [
			'success' => true,
			'data' => $this->core->get_all_options()
		], 200 );
	}

	function rest_update_option( $request ) {
		try {
			$params = $request->get_json_params();
			$value = $params['options'];
			$options = $this->core->update_options( $value );
			$success = !!$options;
			$message = __( $success ? 'OK' : "Could not update options.", 'ai-engine' );
			return new WP_REST_Response([ 'success' => $success, 'message' => $message, 'options' => $options ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function createValidationResult( $result = true, $message = null) {
		$message = $message ? $message : __( 'OK', 'ai-engine' );
		return [ 'result' => $result, 'message' => $message ];
	}

	function validate_updated_option( $option_name ) {
		$option_checkbox = get_option( 'mwai_option_checkbox', false );
		$option_text = get_option( 'mwai_option_text', 'Default' );
		if ( $option_checkbox === '' )
			update_option( 'mwai_option_checkbox', false );
		if ( $option_text === '' )
			update_option( 'mwai_option_text', 'Default' );
		return $this->createValidationResult();
	}

	function make_completions( $request ) {
		try {
			$params = $request->get_json_params();
			$prompt = $params['prompt'];
			$query = new Meow_MWAI_Query( $prompt, 2048 );
			$answer = $this->core->ai->run( $query );
			return new WP_REST_Response([ 'success' => true, 'data' => $answer->result, 'usage' => $answer->usage ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function make_titles( $request ) {
		try {
			$params = $request->get_json_params();
			$postId = intval( $params['postId'] );
			$text = $this->core->get_text_from_postId( $postId );
			$prompt = "Create short SEO-friendly title for this text: " . $text;
			$query = new Meow_MWAI_Query( $prompt, 40 );
			$query->setMaxResults( 5 );
			$answer = $this->core->ai->run( $query );
			return new WP_REST_Response([ 'success' => true, 'data' => $answer->results ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function make_excerpts( $request ) {
		try {
			$params = $request->get_json_params();
			$postId = intval( $params['postId'] );
			$text = $this->core->get_text_from_postId( $postId );
			$prompt = "Create SEO-friendly introduction to this text, 120 to 170 characters max, no URLs: " . $text;
			$query = new Meow_MWAI_Query( $prompt, 140 );
			$query->setMaxResults( 5 );
			$answer = $this->core->ai->run( $query );
			return new WP_REST_Response([ 'success' => true, 'data' => $answer->results ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function update_post_title( $request ) {
		try {
			$params = $request->get_json_params();
			$title = sanitize_text_field( $params['title'] );
			$postId = intval( $params['postId'] );
			$post = get_post( $postId );
			if ( !$post ) {
				throw new Exception( 'There is no post with this ID.' );
			}
			$post->post_title = $title;
			//$post->post_name = sanitize_title( $title );
			wp_update_post( $post );
			return new WP_REST_Response([ 'success' => true, 'message' => "Title updated." ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function update_post_excerpt( $request ) {
		try {
			$params = $request->get_json_params();
			$excerpt = sanitize_text_field( $params['excerpt'] );
			$postId = intval( $params['postId'] );
			$post = get_post( $postId );
			if ( !$post ) {
				throw new Exception( 'There is no post with this ID.' );
			}
			$post->post_excerpt = $excerpt;
			wp_update_post( $post );
			return new WP_REST_Response([ 'success' => true, 'message' => "Excerpt updated." ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}
}
