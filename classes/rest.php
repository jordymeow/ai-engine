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
			register_rest_route( $this->namespace, '/make_images', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'make_images' ),
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
			register_rest_route( $this->namespace, '/create_post', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'create_post' ),
			) );
			register_rest_route( $this->namespace, '/create_image', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'create_image' ),
			) );
			register_rest_route( $this->namespace, '/openai_files', array(
				'methods' => 'GET',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'openai_files_get' ),
			) );
			register_rest_route( $this->namespace, '/openai_files', array(
				'methods' => 'DELETE',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'openai_files_delete' ),
			) );
			register_rest_route( $this->namespace, '/openai_files', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'openai_files_upload' ),
			) );
			register_rest_route( $this->namespace, '/openai_files_download', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'openai_files_download' ),
			) );
			register_rest_route( $this->namespace, '/openai_files_finetune', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'openai_files_finetune' ),
			) );
			register_rest_route( $this->namespace, '/openai_finetunes', array(
				'methods' => 'GET',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'openai_finetunes_get' ),
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

	function setup_query_based_on_params( $query, $params ) {
		if ( isset( $params['model'] ) ) {
			$query->setModel( $params['model'] );
		}
		if ( isset( $params['temperature'] ) ) {
			$query->setTemperature( $params['temperature'] );
		}
		if ( isset( $params['apiKey'] ) ) {
			$query->setApiKey( $params['apiKey'] );
		}
		if ( isset( $params['maxResults'] ) ) {
			$query->setMaxResults( $params['maxResults'] );
		}
		return $query;
	}

	function make_completions( $request ) {
		try {
			$params = $request->get_json_params();
			$prompt = $params['prompt'];
			$query = new Meow_MWAI_QueryText( $prompt, 2048 );
			$query = $this->setup_query_based_on_params( $query, $params );
			$answer = $this->core->ai->run( $query );
			return new WP_REST_Response([ 'success' => true, 'data' => $answer->result, 'usage' => $answer->usage ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function make_images( $request ) {
		try {
			$params = $request->get_json_params();
			$prompt = $params['prompt'];
			$query = new Meow_MWAI_QueryImage( $prompt );
			$query = $this->setup_query_based_on_params( $query, $params );
			$answer = $this->core->ai->run( $query );
			return new WP_REST_Response([ 'success' => true, 'data' => $answer->results, 'usage' => $answer->usage ], 200 );
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
			$query = new Meow_MWAI_QueryText( $prompt, 40 );
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
			$query = new Meow_MWAI_QueryText( $prompt, 140 );
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

	function create_post( $request ) {
		try {
			$params = $request->get_json_params();
			$title = sanitize_text_field( $params['title'] );
			// Sanitize content that contains line returns and HTML tags
			$content = sanitize_textarea_field( $params['content'] );
			$excerpt = sanitize_text_field( $params['excerpt'] );
			//$postType = sanitize_text_field( $params['postType'] );
			$post = new stdClass();
			$post->post_title = $title;
			$post->post_excerpt = $excerpt;
			$post->post_content = $content;
			$post->post_status = 'draft';
			$post->post_type = 'post';
			$post->post_content = $this->core->markdown_to_html( $post->post_content );
			$postId = wp_insert_post( $post );
			return new WP_REST_Response([ 'success' => true, 'postId' => $postId ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function curl_download( $Url ) {
		if ( !function_exists( 'curl_init' ) ) {
			die( 'CURL is not installed!' );
		}
		$ch = curl_init();
		curl_setopt( $ch, CURLOPT_URL, $Url );
		curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
		$output = curl_exec( $ch );
		curl_close( $ch );
		return $output;
	}

	function create_image( $request ) {
		try {
			$params = $request->get_json_params();
			$title = sanitize_text_field( $params['title'] );
			$caption = sanitize_text_field( $params['caption'] );
			$alt = sanitize_text_field( $params['alt'] );
			$description = sanitize_text_field( $params['description'] );
			$url = $params['url'];
			$filename = sanitize_text_field( $params['filename'] );
			$image_data = $this->curl_download( $url );
			if ( !$image_data ) {
				throw new Exception( 'Could not download the image.' );
			}
			$upload_dir = wp_upload_dir();
			if ( empty( $filename ) ) {
				$filename = basename( $url );
			}
			$wp_filetype = wp_check_filetype( $filename );
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
				'post_mime_type' => $wp_filetype['type'],
				'post_title' => $title,
				'post_content' => $description,
				'post_excerpt' => $caption,
				'post_status' => 'inherit'
			];
			// Register the file as a Media Library attachment
			$attachmentId = wp_insert_attachment( $attachment, $file );
			require_once( ABSPATH . 'wp-admin/includes/image.php' );
			$attachment_data = wp_generate_attachment_metadata( $attachmentId, $file );
			wp_update_attachment_metadata( $attachmentId, $attachment_data );
			update_post_meta( $attachmentId, '_wp_attachment_image_alt', $alt );
			return new WP_REST_Response([ 'success' => true, 'attachmentId' => $attachmentId ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function openai_files_get( $request ) {
		try {
			//$params = $request->get_json_params();
			$openai = new Meow_MWAI_OpenAI( $this->core );
			$files = $openai->listFiles();
			return new WP_REST_Response([ 'success' => true, 'files' => $files ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function openai_finetunes_get( $request ) {
		try {
			//$params = $request->get_json_params();
			$openai = new Meow_MWAI_OpenAI( $this->core );
			$finetunes = $openai->listFineTunes();
			return new WP_REST_Response([ 'success' => true, 'finetunes' => $finetunes ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function openai_files_upload( $request ) {
		try {
			$params = $request->get_json_params();
			$filename = sanitize_text_field( $params['filename'] );
			$data = $params['data'];
			$openai = new Meow_MWAI_OpenAI( $this->core );
			$file = $openai->uploadFile( $filename, $data );
			return new WP_REST_Response([ 'success' => true, 'file' => $file ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function openai_files_delete( $request ) {
		try {
			$params = $request->get_json_params();
			$fileId = $params['fileId'];
			$openai = new Meow_MWAI_OpenAI( $this->core );
			$openai->deleteFile( $fileId );
			return new WP_REST_Response([ 'success' => true ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function openai_files_download( $request ) {
		try {
			$params = $request->get_json_params();
			$fileId = $params['fileId'];
			$openai = new Meow_MWAI_OpenAI( $this->core );
			$data = $openai->downloadFile( $fileId );
			return new WP_REST_Response([ 'success' => true, 'data' => $data ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	function openai_files_finetune( $request ) {
		try {
			$params = $request->get_json_params();
			$fileId = $params['fileId'];
			$model = $params['model'];
			$suffix = $params['suffix'];
			$openai = new Meow_MWAI_OpenAI( $this->core );
			$finetune = $openai->fineTuneFile( $fileId, $model, $suffix );
			return new WP_REST_Response([ 'success' => true, 'finetune' => $finetune ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}
}
