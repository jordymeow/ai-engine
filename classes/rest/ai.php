<?php

class Meow_MWAI_Rest_AI extends Meow_MWAI_Rest_Base {
  public function register_routes() {
    register_rest_route( $this->namespace, '/ai/models', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_ai_models' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
    register_rest_route( $this->namespace, '/ai/completions', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_ai_completions' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
    register_rest_route( $this->namespace, '/ai/images', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_ai_images' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
    register_rest_route( $this->namespace, '/ai/image_edit', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_ai_image_edit' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
    register_rest_route( $this->namespace, '/ai/copilot', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_ai_copilot' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );

    register_rest_route( $this->namespace, '/ai/magic_wand', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_ai_magic_wand' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
    register_rest_route( $this->namespace, '/ai/moderate', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_ai_moderate' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
    register_rest_route( $this->namespace, '/ai/transcribe_audio', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_ai_transcribe_audio' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
    register_rest_route( $this->namespace, '/ai/transcribe_image', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_ai_transcribe_image' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
    register_rest_route( $this->namespace, '/ai/json', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_ai_json' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
  }

  public function rest_ai_models( $request ) {
    try {
      $params = $request->get_json_params();
      $envId = $params['envId'];
      $query = new Meow_MWAI_Query_Text( '', 1024 );
      $query->env = $envId;
      $models = $this->core->get_engine_models( $query );
      return $this->create_rest_response( [ 'success' => true, 'models' => $models ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_ai_completions( $request ) {
    try {
      $params = $request->get_json_params();
      $message = $this->retrieve_message( $params['message'] );
      if ( empty( $message ) ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Message cannot be empty.' ], 500 );
      }
      $query = apply_filters( 'mwai_ai_completions', null, $message, $params );
      if ( !is_null( $query ) && $query instanceof Meow_MWAI_Query_Base ) {
        // We got back a query.
      }
      else if ( is_string( $query ) ) {
        // We got back a string.
        return $this->create_rest_response( [ 'success' => true, 'data' => $query ], 200 );
      }
      else {
        $query = new Meow_MWAI_Query_Text( $message );
        $query->set_max_tokens( $params['maxTokens'] );
        $query->set_temperature( $params['temperature'] );
        if ( !empty( $params['stop'] ) ) {
          $query->set_stop( $params['stop'] );
        }
      }
      $query->set_env( $params['envId'] );
      $query->set_model( $params['model'] );
      $query->session = $params['sessionId'];
      $query->user = $this->core->get_user_by( 'id', get_current_user_id() );
      $reply = $this->core->run_query( $query );
      return $this->create_rest_response( [ 'success' => true, 'data' => $reply->result ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_ai_images( $request ) {
    try {
      $params = $request->get_json_params();
      $message = $this->retrieve_message( $params['message'] );
      $query = new Meow_MWAI_Query_Image( $message );
      $query->set_resolution( isset( $params['resolution'] ) ? $params['resolution'] : '1024x1024' );
      $query->set_quality( isset( $params['quality'] ) ? $params['quality'] : 'standard' );
      $query->set_style( isset( $params['style'] ) ? $params['style'] : null );
      $query->set_env( $params['envId'] );
      $query->set_model( $params['model'] );
      $query->user = $this->core->get_user_by( 'id', get_current_user_id() );
      $reply = $this->core->run_query( $query );
      $images = [];
      foreach ( $reply->get_images() as $image ) {
        $images[] = [ 'url' => $image, 'caption' => $reply->get_caption(), 'alt' => $reply->get_alt() ];
      }
      return $this->create_rest_response( [ 'success' => true, 'images' => $images ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_ai_image_edit( $request ) {
    try {
      $params = $request->get_json_params();
      $imageId = $params['imageId'];
      $maskId = isset( $params['maskId'] ) ? $params['maskId'] : null;
      if ( !$imageId ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Image ID is required.' ], 500 );
      }
      if ( $maskId ) {
        $maskInfo = $this->core->files->get_attachment_info( $maskId );
        $maskFile = $maskInfo['path'];
      }
      else {
        $maskFile = null;
      }
      $imageInfo = $this->core->files->get_attachment_info( $imageId );
      $imageFile = $imageInfo['path'];
      $message = $this->retrieve_message( $params['message'] );
      $query = new Meow_MWAI_Query_EditImage( $message, $imageFile, $maskFile );
      $query->set_resolution( isset( $params['resolution'] ) ? $params['resolution'] : '1024x1024' );
      $query->set_env( $params['envId'] );
      $query->set_model( $params['model'] );
      $query->user = $this->core->get_user_by( 'id', get_current_user_id() );
      $reply = $this->core->run_query( $query );
      $images = [];
      foreach ( $reply->get_images() as $image ) {
        $images[] = [ 'url' => $image, 'caption' => $reply->get_caption(), 'alt' => $reply->get_alt() ];
      }
      return $this->create_rest_response( [ 'success' => true, 'images' => $images ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_ai_copilot( $request ) {
    try {
      $params = $request->get_json_params();
      $message = $this->retrieve_message( $params['message'] );
      if ( empty( $message ) ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Message cannot be empty.' ], 500 );
      }
      $query = apply_filters( 'mwai_ai_copilot', null, $message, $params );
      if ( !is_null( $query ) && $query instanceof Meow_MWAI_Query_Base ) {
        // We got back a query.
      }
      else if ( is_string( $query ) ) {
        // We got back a string.
        return $this->create_rest_response( [ 'success' => true, 'data' => $query ], 200 );
      }
      else {
        $query = new Meow_MWAI_Query_Text( $message );
        $query->set_max_tokens( $params['maxTokens'] );
        $query->set_temperature( $params['temperature'] );
        if ( !empty( $params['stop'] ) ) {
          $query->set_stop( $params['stop'] );
        }
      }
      $query->set_env( $params['envId'] );
      $query->set_model( $params['model'] );
      $query->session = $params['sessionId'];
      $query->user = $this->core->get_user_by( 'id', get_current_user_id() );
      if ( isset( $params['context'] ) ) {
        $context = $params['context'];
        $query->set_context( $context );
      }
      $reply = $this->core->run_query( $query );
      return $this->create_rest_response( [ 'success' => true, 'data' => $reply->result ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_ai_magic_wand( $request ) {
    try {
      global $mwai;
      $params = $request->get_json_params();
      $message = $this->retrieve_message( $params['message'] );
      $context = isset( $params['context'] ) ? $params['context'] : null;
      $action = $params['action'];
      $options = $params['options'];
      $data = null;
      if ( !$mwai->magicWand ) {
        throw new Exception( 'Magic Wand is not enabled.' );
      }
      $data = $mwai->magicWand->run( $action, $message, $context, $options );
      return $this->create_rest_response( [ 'success' => true, 'data' => $data ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_ai_moderate( $request ) {
    try {
      $params = $request->get_json_params();
      $message = $this->retrieve_message( $params['message'] );
      if ( empty( $message ) ) {
        $message = $params['message'];
      }
      $query = new Meow_MWAI_Query_Moderate( $message );
      $query->set_env( $params['envId'] );
      $query->user = $this->core->get_user_by( 'id', get_current_user_id() );
      $reply = $this->core->run_query( $query );
      return $this->create_rest_response( [ 'success' => true, 'data' => $reply->result ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_ai_transcribe_audio( $request ) {
    try {
      $params = $request->get_json_params();
      if ( empty( $params['attachmentId'] ) ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Attachment ID is required.' ], 500 );
      }
      $attachmentId = intval( $params['attachmentId'] );
      $attachment = get_post( $attachmentId );
      if ( !$attachment ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Attachment not found.' ], 500 );
      }
      $mimeType = get_post_mime_type( $attachmentId );
      if ( strpos( $mimeType, 'audio' ) === false ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Attachment is not an audio file.' ], 500 );
      }
      $url = wp_get_attachment_url( $attachmentId );
      $query = new Meow_MWAI_Query_Transcribe( $url );
      $query->set_env( $params['envId'] );
      $query->set_model( $params['model'] );
      $query->user = $this->core->get_user_by( 'id', get_current_user_id() );
      $reply = $this->core->run_query( $query );
      return $this->create_rest_response( [ 'success' => true, 'data' => $reply->result ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_ai_transcribe_image( $request ) {
    try {
      $params = $request->get_json_params();
      $message = $this->retrieve_message( $params['message'] );
      if ( empty( $params['attachmentId'] ) ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Attachment ID is required.' ], 500 );
      }
      $attachmentId = intval( $params['attachmentId'] );
      $attachment = get_post( $attachmentId );
      if ( !$attachment ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Attachment not found.' ], 500 );
      }
      $mimeType = get_post_mime_type( $attachmentId );
      if ( !$this->core->is_image( $mimeType ) ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Attachment is not an image file.' ], 500 );
      }
      $url = wp_get_attachment_url( $attachmentId );
      $query = new Meow_MWAI_Query_Text( $message );
      $query->set_max_tokens( !empty( $params['maxTokens'] ) ? $params['maxTokens'] : 1024 );
      $query->set_env( $params['envId'] );
      $query->set_model( $params['model'] );
      $query->add_image( $url );
      $query->user = $this->core->get_user_by( 'id', get_current_user_id() );
      $reply = $this->core->run_query( $query );
      return $this->create_rest_response( [ 'success' => true, 'data' => $reply->result ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_ai_json( $request ) {
    try {
      $params = $request->get_json_params();
      $message = $this->retrieve_message( $params['message'] );
      if ( empty( $message ) ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Message cannot be empty.' ], 500 );
      }
      $query = new Meow_MWAI_Query_Text( $message );
      $query->set_max_tokens( !empty( $params['maxTokens'] ) ? $params['maxTokens'] : 1024 );
      $query->set_temperature( !empty( $params['temperature'] ) ? $params['temperature'] : 0 );
      if ( !empty( $params['stop'] ) ) {
        $query->set_stop( $params['stop'] );
      }
      $query->responseFormat = 'json_object';
      $query->set_env( $params['envId'] );
      $query->set_model( $params['model'] );
      $query->session = $params['sessionId'];
      $query->user = $this->core->get_user_by( 'id', get_current_user_id() );
      $reply = $this->core->run_query( $query );
      $json = json_decode( $reply->result );
      return $this->create_rest_response( [ 'success' => true, 'data' => $json ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }
}
