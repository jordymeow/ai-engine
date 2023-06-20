<?php

class Meow_MWAI_Rest
{
	private $core = null;
	private $namespace = 'mwai/v1';

	public function __construct( $core ) {
		$this->core = $core;
		add_action( 'rest_api_init', array( $this, 'rest_init' ) );
	}

	function rest_init() {
		try {
			// Settings Endpoints
			register_rest_route( $this->namespace, '/settings/update', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_settings_update' )
			) );
			register_rest_route( $this->namespace, '/settings/list', array(
				'methods' => 'GET',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_settings_list' ),
			) );
			register_rest_route( $this->namespace, '/settings/reset', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_settings_reset' ),
			) );
			register_rest_route( $this->namespace, '/settings/chatbots', array(
				'methods' => ['GET', 'POST'],
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_settings_chatbots' ),
			) );
			register_rest_route( $this->namespace, '/settings/themes', array(
				'methods' => ['GET', 'POST'],
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_settings_themes' ),
			) );

			// System Endpoints
			register_rest_route( $this->namespace, '/system/logs/list', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_system_logs_list' ),
			) );
			register_rest_route( $this->namespace, '/system/logs/delete', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_system_logs_delete' ),
			) );
			register_rest_route( $this->namespace, '/system/logs/meta', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_system_logs_meta_get' ),
			) );
			register_rest_route( $this->namespace, '/system/templates', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'rest_system_templates_save' ),
			) );
			register_rest_route( $this->namespace, '/system/templates', array(
				'methods' => 'GET',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'rest_system_templates_get' ),
			) );

			// AI Endpoints
			register_rest_route( $this->namespace, '/ai/completions', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'rest_ai_completions' ),
			) );
			register_rest_route( $this->namespace, '/ai/images', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'rest_ai_images' ),
			) );
			register_rest_route( $this->namespace, '/ai/copilot', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'rest_ai_copilot' ),
			) );

			register_rest_route( $this->namespace, '/ai/magic_wand', array(
				'methods' => 'POST',
				'callback' => array( $this, 'rest_ai_magic_wand' ),
				'permission_callback' => array( $this->core, 'can_access_features' ),
			) );
			register_rest_route( $this->namespace, '/ai/moderate', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_ai_moderate' ),
			) );
			register_rest_route( $this->namespace, '/ai/transcribe', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_ai_transcribe' ),
			) );

			// Helpers Endpoints
			register_rest_route( $this->namespace, '/helpers/update_post_title', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'rest_helpers_update_title' ),
			) );
			register_rest_route( $this->namespace, '/helpers/update_post_excerpt', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'rest_helpers_update_excerpt' ),
			) );
			register_rest_route( $this->namespace, '/helpers/create_post', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'rest_helpers_create_post' ),
			) );
			register_rest_route( $this->namespace, '/helpers/create_image', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'rest_helpers_create_images' ),
			) );
			register_rest_route( $this->namespace, '/helpers/count_posts', array(
				'methods' => 'GET',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'rest_helpers_count_posts' ),
			) );
			register_rest_route( $this->namespace, '/helpers/post_types', array(
				'methods' => 'GET',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'rest_helpers_post_types' ),
			) );
			register_rest_route( $this->namespace, '/helpers/post_content', array(
				'methods' => 'GET',
				'permission_callback' => array( $this->core, 'can_access_features' ),
				'callback' => array( $this, 'rest_helpers_post_content' ),
			) );

			// OpenAI Endpoints
			register_rest_route( $this->namespace, '/openai/files/list', array(
				'methods' => 'GET',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_openai_files_get' ),
			) );
			register_rest_route( $this->namespace, '/openai/files/upload', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_openai_files_upload' ),
			) );
			register_rest_route( $this->namespace, '/openai/files/delete', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_openai_files_delete' ),
			) );
			register_rest_route( $this->namespace, '/openai/files/download', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_openai_files_download' ),
			) );
			register_rest_route( $this->namespace, '/openai/files/finetune', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_openai_files_finetune' ),
			) );
			register_rest_route( $this->namespace, '/openai/finetunes/list_deleted', array(
				'methods' => 'GET',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_openai_deleted_finetunes_get' ),
			) );
			register_rest_route( $this->namespace, '/openai/finetunes/list', array(
				'methods' => 'GET',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_openai_finetunes_get' ),
			) );
			register_rest_route( $this->namespace, '/openai/finetunes/delete', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_openai_finetunes_delete' ),
			) );
			register_rest_route( $this->namespace, '/openai/finetunes/cancel', array(
				'methods' => 'POST',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_openai_finetunes_cancel' ),
			) );
			register_rest_route( $this->namespace, '/openai/incidents', array(
				'methods' => 'GET',
				'permission_callback' => array( $this->core, 'can_access_settings' ),
				'callback' => array( $this, 'rest_openai_incidents' ),
			) );	
		}
		catch ( Exception $e ) {
			var_dump( $e );
		}
	}

	function rest_settings_list() {
		return new WP_REST_Response( [
			'success' => true,
			'options' => $this->core->get_all_options()
		], 200 );
	}

	function rest_settings_update( $request ) {
		try {
			$params = $request->get_json_params();
			$value = $params['options'];
			$options = $this->core->update_options( $value );
			$success = !!$options;
			$message = __( $success ? 'OK' : "Could not update options.", 'ai-engine' );
			return new WP_REST_Response([ 'success' => $success, 'message' => $message, 'options' => $options ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_settings_reset() {
		try {
			$options = $this->core->reset_options();
			$success = !!$options;
			$message = __( $success ? 'OK' : "Could not reset options.", 'ai-engine' );
			return new WP_REST_Response([ 'success' => $success, 'message' => $message, 'options' => $options ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
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

	function rest_ai_completions( $request ) {
		try {
			$params = $request->get_json_params();
			$prompt = $params['prompt'];
			$query = new Meow_MWAI_Query_Text( $prompt );
			$query->injectParams( $params );

			// Handle streaming
			$stream = $params['stream'] ?? false;
			$streamCallback = null;
			if ( $stream ) { 
				$streamCallback = function( $reply ) {
					//$raw = _wp_specialchars( $reply, ENT_NOQUOTES, 'UTF-8', true );
					$raw = $reply;
					$this->core->stream_push( [ 'type' => 'live', 'data' => $raw ] );
					if ( ob_get_level() > 0 ) {
						ob_flush();
					}
					flush();
				};
				header( 'Cache-Control: no-cache' );
				header( 'Content-Type: text/event-stream' );
				header( 'X-Accel-Buffering: no' ); // This is useful to disable buffering in nginx through headers.
				ob_implicit_flush( true );
				ob_end_flush();
			}

			// Process Reply
			$reply = $this->core->ai->run( $query, $streamCallback );
			$restRes = [
				'success' => true,
				'data' => $reply->result,
				'usage' => $reply->usage
			];
			if ( $stream ) {
				$this->core->stream_push( [ 'type' => 'end', 'data' => json_encode( $restRes ) ] );
				die();
			}
			return new WP_REST_Response( $restRes, 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			if ( $stream ) { 
				$this->core->stream_push( [ 'type' => 'error', 'data' => $message ] );
			}
			else {
				return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
			}
		}
	}

	function rest_ai_images( $request ) {
		try {
			$params = $request->get_json_params();
			$prompt = $params['prompt'];
			$query = new Meow_MWAI_Query_Image( $prompt );
			$query->injectParams( $params );
			$reply = $this->core->ai->run( $query );
			return new WP_REST_Response([ 'success' => true, 'data' => $reply->results, 'usage' => $reply->usage ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_ai_magic_wand( $request ) {
		try {
			$params = $request->get_json_params();
			$action = isset( $params['action'] ) ? $params['action'] : null;
			$data = isset( $params['data'] ) ? $params['data'] : null;
			if ( empty( $data ) || empty( $action ) ) {
				return new WP_REST_Response([ 'success' => false, 'message' => "An action and some data are required." ], 500 );
			}
			$postId = isset( $data['postId'] ) ? $data['postId'] : null;
			$text = isset( $data['text'] ) ? $data['text'] : null;
			$selectedText = isset( $data['selectedText'] ) ? $data['selectedText'] : null;

			// NOTE: As soon as we have a wide range of usages and possibilities,
			// let's refactor this into a nice and extensible UI/API.
			$query = new Meow_MWAI_Query_Text( "", 1024 );
			$query->setEnv( 'admin-tools' );
			$model = $this->core->get_option( 'assistants_model' );
			if ( !empty( $model ) ) {
				$query->setModel( $model );
			}
			$mode = 'replace';

			$language = "";
			$keepLanguage = "";
			if ( !empty( $postId ) ) {
				$language = $this->core->get_post_language( $postId );
				$keepLanguage = " Ensure the reply is in the same language as the original text ({$language}).";
			}

			if ( $action === 'correctText' ) {
				$query->setPrompt( "Correct the typos and grammar mistakes in this text without altering its content. Return only the corrected text, without explanations or additional content.{$keepLanguage}\n\n" . $text );
			}
			else if ( $action === 'enhanceText' ) {
				$query->setPrompt( "Enhance this text by eliminating redundancies, utilizing a more suitable vocabulary, and refining its structure. Provide only the revised text, without explanations or any additional content.{$keepLanguage}\n\n" . $text );
			}
			else if ( $action === 'longerText' ) {
				$query->setPrompt( "Expand the subsequent text to a minimum of three times its original length, integrating relevant and accurate information to enrich its content. If the text is a story, amplify its charm by elaborating on essential aspects, enhancing readability, and creating a sense of engagement for the reader. Maintain consistency in tone and vocabulary throughout the expansion process.{$keepLanguage}\n\n" . $text );
			}
			else if ( $action === 'shorterText' ) {
				$query->setPrompt( "Condense the following text by reducing its length to half, while retaining the core elements of the original narrative. Focus on maintaining the essence of the story and its key details.{$keepLanguage}\n\n" . $text );
			}
			else if ( $action === 'suggestSynonyms' ) {
				$mode = 'suggest';
				$query->setPrompt( "Provide a synonym or rephrase the given word or sentence while retaining the original meaning and preserving the initial and final punctuation. Offer only the resulting word or expression, without additional context. If a suitable synonym or alternative cannot be identified, ensure that a creative response is still provided.{$keepLanguage}\n\n" . $selectedText );
				$query->setTemperature( 1 );
				$query->setMaxResults( 5 );
			}
			else if ( $action === 'translateText' ) {
				$query->setPrompt( "Translate the text into {$language}, preserving the tone, mood, and nuance, while staying as true as possible to the original meaning. Provide only the translated text, without any additional content.\n\n" . $text );
			}
			else if ( $action === 'suggestExcerpts' ) {
				$text = $this->core->getCleanPostContent( $postId );
				$query->setPrompt( "Craft a clear, SEO-optimized introduction for the following text, using 120 to 170 characters. Ensure the introduction is concise and relevant, without including any URLs.{$keepLanguage}\n\n" . $text );
				$query->setMaxResults( 5 );
			}
			else if ( $action === 'suggestTitles' ) {
				$text = $this->core->getCleanPostContent( $postId );
				$query->setPrompt( "Generate a concise, SEO-optimized title for the following text, without using quotes or any other formatting. Focus on clarity and relevance to the content.{$keepLanguage}\n\n" . $text );
				$query->setMaxResults( 5 );
			}
			$reply = $this->core->ai->run( $query );
			return new WP_REST_Response([ 'success' => true, 'data' => [
				'mode' => $mode,
				'result' => $reply->result,
				'results' => $reply->results
			] ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_ai_copilot( $request ) {
		try {
			$params = $request->get_json_params();
			$action = sanitize_text_field( $params['action'] );
			$prompt = sanitize_text_field( $params['prompt'] );
			if ( empty( $action ) || empty( $prompt ) ) {
				return new WP_REST_Response([ 'success' => false, 'message' => "Copilot needs an action and a prompt." ], 500 );
			}
			$query = new Meow_MWAI_Query_Text( $prompt, 2048 );
			$query->setEnv( 'admin-tools' );
			$model = $this->core->get_option( 'assistants_model' );
			if ( !empty( $model ) ) {
				$query->setModel( $model );
			}
			$reply = $this->core->ai->run( $query );
			return new WP_REST_Response([ 'success' => true, 'data' => $reply->result ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_helpers_update_title( $request ) {
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
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_helpers_update_excerpt( $request ) {
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
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_helpers_create_post( $request ) {
		try {
			$params = $request->get_json_params();
			$title = sanitize_text_field( $params['title'] );
			$content = sanitize_textarea_field( $params['content'] );
			$excerpt = sanitize_text_field( $params['excerpt'] );
			$postType = sanitize_text_field( $params['postType'] );
			$post = new stdClass();
			$post->post_title = $title;
			$post->post_excerpt = $excerpt;
			$post->post_content = $content;
			$post->post_status = 'draft';
			$post->post_type = isset( $postType ) ? $postType : 'post';
			$post->post_content = $this->core->markdown_to_html( $post->post_content );
			$postId = wp_insert_post( $post );
			return new WP_REST_Response([ 'success' => true, 'postId' => $postId ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function image_download( $url ) {
		$args = array( 'timeout' => 60, );
		$response = wp_remote_get( $url, $args );
		if ( is_wp_error( $response ) ) {
			throw new Exception( $response->get_error_message() );
		}
		$output = wp_remote_retrieve_body( $response );
		if ( is_wp_error( $output ) ) {
			throw new Exception( $output->get_error_message() );
		}
		return $output;
	}

	function rest_helpers_create_images( $request ) {
		try {
			$params = $request->get_json_params();
			$title = sanitize_text_field( $params['title'] );
			$caption = sanitize_text_field( $params['caption'] );
			$alt = sanitize_text_field( $params['alt'] );
			$description = sanitize_text_field( $params['description'] );
			$url = $params['url'];
			$filename = sanitize_text_field( $params['filename'] );
			$image_data = $this->image_download( $url );
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
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_openai_files_get() {
		try {
			//$params = $request->get_json_params();
			$openai = new Meow_MWAI_Engines_OpenAI( $this->core );
			$files = $openai->listFiles();
			return new WP_REST_Response([ 'success' => true, 'files' => $files ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_openai_deleted_finetunes_get() {
		try {
			$openai = new Meow_MWAI_Engines_OpenAI( $this->core );
			$finetunes = $openai->listDeletedFineTunes();
			return new WP_REST_Response([ 'success' => true, 'finetunes' => $finetunes ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_openai_finetunes_get() {
		try {
			$openai = new Meow_MWAI_Engines_OpenAI( $this->core );
			$finetunes = $openai->listFineTunes();
			return new WP_REST_Response([ 'success' => true, 'finetunes' => $finetunes ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_openai_files_upload( $request ) {
		try {
			$params = $request->get_json_params();
			$filename = sanitize_text_field( $params['filename'] );
			$data = $params['data'];
			$openai = new Meow_MWAI_Engines_OpenAI( $this->core );
			$file = $openai->uploadFile( $filename, $data );
			return new WP_REST_Response([ 'success' => true, 'file' => $file ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_openai_files_delete( $request ) {
		try {
			$params = $request->get_json_params();
			$fileId = $params['fileId'];
			$openai = new Meow_MWAI_Engines_OpenAI( $this->core );
			$openai->deleteFile( $fileId );
			return new WP_REST_Response([ 'success' => true ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_openai_finetunes_cancel( $request ) {
		try {
			$params = $request->get_json_params();
			$finetuneId = $params['finetuneId'];
			$openai = new Meow_MWAI_Engines_OpenAI( $this->core );
			$openai->cancelFineTune( $finetuneId );
			return new WP_REST_Response([ 'success' => true ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_openai_finetunes_delete( $request ) {
		try {
			$params = $request->get_json_params();
			$modelId = $params['modelId'];
			$openai = new Meow_MWAI_Engines_OpenAI( $this->core );
			$openai->deleteFineTune( $modelId );
			return new WP_REST_Response([ 'success' => true ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_openai_files_download( $request ) {
		try {
			$params = $request->get_json_params();
			$fileId = $params['fileId'];
			$openai = new Meow_MWAI_Engines_OpenAI( $this->core );
			$data = $openai->downloadFile( $fileId );
			return new WP_REST_Response([ 'success' => true, 'data' => $data ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_openai_files_finetune( $request ) {
		try {
			$params = $request->get_json_params();
			$fileId = $params['fileId'];
			$model = $params['model'];
			$suffix = $params['suffix'];
			$hyperparams = [
				"nEpochs" => $params['nEpochs'],
				"batchSize" => $params['batchSize']
			];
			$openai = new Meow_MWAI_Engines_OpenAI( $this->core );
			$finetune = $openai->fineTuneFile( $fileId, $model, $suffix, $hyperparams );
			return new WP_REST_Response([ 'success' => true, 'finetune' => $finetune ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_openai_incidents() {
		try {
			$transient = get_transient( 'mwai_openai_incidents' );
			if ( $transient ) {
				return new WP_REST_Response([ 'success' => true, 'incidents' => $transient ], 200 );
			}
			$openai = new Meow_MWAI_Engines_OpenAI( $this->core );
			$incidents = $openai->getIncidents();
			set_transient( 'mwai_openai_incidents', $incidents, 60 * 10 );
			return new WP_REST_Response([ 'success' => true, 'incidents' => $incidents ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_helpers_count_posts( $request ) {
		try {
			$params = $request->get_query_params();
			$postType = $params['postType'];
			$postStatus = $params['postStatus'];
			$postStatus = !empty( $params['postStatus'] ) ? explode( ',', $postStatus ) : [ 'publish' ];
			$count = wp_count_posts( $postType );
			$count = array_sum( array_intersect_key( (array)$count, array_flip( $postStatus ) ) );
			return new WP_REST_Response([ 'success' => true, 'count' => $count ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_helpers_post_content( $request ) {
		try {
			$params = $request->get_query_params();
			$offset = (int)$params['offset'];
			$postType = $params['postType'];
			$postStatus = $params['postStatus'];
			$postStatus = !empty( $params['postStatus'] ) ? explode( ',', $postStatus ) : [ 'publish' ];
			$postId = (int)$params['postId'];

			$post = null;
			if ( !empty( $postId ) ) {
				$post = get_post( $postId );
				if ( $post->post_status !== 'publish' && $post->post_status !== 'future'
					&& $post->post_status !== 'draft' && $post->post_status !== 'private' ) {
					$post = null;
				}
			}
			else {
				$posts = get_posts( [
					'posts_per_page' => 1,
					'post_type' => $postType,
					'offset' => $offset,
					'post_status' => $postStatus,
				] );
				$post = count( $posts ) === 0 ? null : $posts[0];
			}
			if ( !$post ) {
				return new WP_REST_Response([ 'success' => false, 'message' => 'Post not found' ], 404 );
			}
			$cleanPost = $this->core->getCleanPost( $post );
			return new WP_REST_Response([ 'success' => true, 'content' => $cleanPost['content'],
				'checksum' => $cleanPost['checksum'], 'language' => $cleanPost['language'], 'excerpt' => $cleanPost['excerpt'],
				'postId' => $cleanPost['postId'], 'title' => $cleanPost['title'], 'url' => $cleanPost['url'] ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_system_templates_get( $request ) {
		try {
			$params = $request->get_query_params();
			$category = $params['category'];
			$templates = [];
			$templates_option = get_option( 'mwai_templates', [] );
			if ( !is_array( $templates_option ) ) {
				update_option( 'mwai_templates', [] );
			}
			$categories = array_column( $templates_option, 'category' );
			$index = array_search( $category, $categories );
			$templates = [];
			if ( $index !== false ) {
				$templates = $templates_option[$index]['templates'];
			}
			return new WP_REST_Response([ 'success' => true, 'templates' => $templates ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_system_templates_save( $request ) {
		try {
			$params = $request->get_json_params();
			$category = $params['category'];
			$templates = $params['templates'];
			$templates_option = get_option( 'mwai_templates', [] );
			$categories = array_column( $templates_option, 'category' );
			$index = array_search( $category, $categories );
			if ( $index !== false && $index >= 0 ) {
				$templates_option[$index]['templates'] = $templates;
			}
			else {
				$group = [ 'category' => $category, 'templates' => $templates ];
				$templates_option[] = $group;
			}

			update_option( 'mwai_templates', $templates_option );
			return new WP_REST_Response([ 'success' => true ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_system_logs_list( $request ) {
		try {
			$params = $request->get_json_params();
			$offset = $params['offset'];
			$limit = $params['limit'];
			$filters = $params['filters'];
			$sort = $params['sort'];
			$logs = apply_filters( 'mwai_stats_logs', [], $offset, $limit, $filters, $sort );
			return new WP_REST_Response([ 'success' => true, 'total' => $logs['total'], 'logs' => $logs['rows'] ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_system_logs_delete( $request ) {
		try {
			$params = $request->get_json_params();
			$logIds = $params['logIds'];
			$success = apply_filters( 'mwai_stats_logs_delete', true, $logIds );
			return new WP_REST_Response([ 'success' => $success ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_system_logs_meta_get( $request ) {
		try {
			$params = $request->get_json_params();
			$logId = $params['logId'];
			$metaKeys = $params['metaKeys'];
			$data = apply_filters( 'mwai_stats_logs_meta', [], $logId, $metaKeys );
			return new WP_REST_Response([ 'success' => true, 'data' => $data ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_ai_moderate( $request ) {
		try {
			$params = $request->get_json_params();
			$text = $params['text'];
			if ( !$text ) {
				return new WP_REST_Response([ 'success' => false, 'message' => 'Text not found.' ], 404 );
			}
			$openai = new Meow_MWAI_Engines_OpenAI( $this->core );
			$results = $openai->moderate( $text );
			return new WP_REST_Response([ 'success' => true, 'results' => $results ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}

	}
	
	function rest_ai_transcribe( $request ) {
		try {
			$params = $request->get_json_params();
			$query = new Meow_MWAI_Query_Transcribe();
			$query->injectParams( $params );
			$query->setEnv('admin-tools');
			$reply = $this->core->ai->run( $query );
			return new WP_REST_Response([ 'success' => true, 'data' => $reply->result ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_helpers_post_types() {
		try {
			$postTypes = $this->core->getPostTypes();
			return new WP_REST_Response([ 'success' => true, 'postTypes' => $postTypes ], 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_settings_themes( $request ) {
		try {
			$method = $request->get_method();
			if ( $method === 'GET' ) {
				$themes = $this->core->getThemes();
				return new WP_REST_Response([ 'success' => true, 'themes' => $themes ], 200 );
			}
			else if ( $method === 'POST' ) {
				$params = $request->get_json_params();
				$themes = $params['themes'];
				$themes = $this->core->updateThemes( $themes );
				return new WP_REST_Response([ 'success' => true, 'themes' => $themes ], 200 );
			}
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}

	function rest_settings_chatbots( $request ) {
		try {
			$method = $request->get_method();
			if ( $method === 'GET' ) {
				$chatbots = $this->core->getChatbots();
				return new WP_REST_Response([ 'success' => true, 'chatbots' => $chatbots ], 200 );
			}
			else if ( $method === 'POST' ) {
				$params = $request->get_json_params();
				$chatbots = $params['chatbots'];
				$chatbots = $this->core->updateChatbots( $chatbots );
				return new WP_REST_Response([ 'success' => true, 'chatbots' => $chatbots ], 200 );
			}
			return new WP_REST_Response([ 'success' => false, 'message' => 'Method not allowed' ], 405 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response([ 'success' => false, 'message' => $message ], 500 );
		}
	}
}
