<?php

class Meow_MWAI_API {
  public $core;
  private $chatbot_module;
  private $discussions_module;
  private $bearer_token;
  private $debug = false;

  public function __construct( $chatbot_module, $discussions_module ) {
    global $mwai_core;
    $this->core = $mwai_core;
    $this->chatbot_module = $chatbot_module;
    $this->discussions_module = $discussions_module;
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
    $this->debug = $this->core->get_option( 'server_debug_mode' );
  }

  #region REST API
  function rest_api_init() {
    $public_api = $this->core->get_option( 'public_api' );
    if ( !$public_api ) { return; }
    $this->bearer_token = $this->core->get_option( 'public_api_bearer_token' );
    if ( !empty( $this->bearer_token ) ) {
      add_filter( 'mwai_allow_public_api', [ $this, 'auth_via_bearer_token' ], 10, 3 );
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
    register_rest_route( 'mwai/v1', '/simpleImageEditQuery', array(
      'methods' => 'POST',
      'callback' => array( $this, 'rest_simpleImageEditQuery' ),
      'permission_callback' => function( $request ) {
        return $this->core->can_access_public_api( 'simpleImageEditQuery', $request );
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

  public function auth_via_bearer_token( $allow, $feature, $extra ) {
    if ( !empty( $extra ) && !empty( $extra->get_header( 'Authorization' ) ) ) {    
      $token = $extra->get_header( 'Authorization' );
      $token = str_replace( 'Bearer ', '', $token );
      if ( $token === $this->bearer_token ) {
        // We set the current user to the first admin.
        $admin = $this->core->get_admin_user();
        wp_set_current_user( $admin->ID, $admin->user_login );
        return true;
      }
    }
    return $allow;
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

      if ( $this->debug ) {
        $shortMessage = Meow_MWAI_Logging::shorten( $message, 64 );
        $debug = sprintf( 'REST [SimpleChatbotQuery]: %s, %s', $shortMessage, json_encode( $params ) );
        Meow_MWAI_Logging::log( $debug );
      }

      $reply = $this->simpleChatbotQuery( $botId, $message, $params, false );
      return new WP_REST_Response([ 
        'success' => true,
        'data' => $reply['reply'],
        'extra' => [
          'actions' => $reply['actions'],
          'chatId' => $reply['chatId']
        ]
      ], 200 );
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

      if ( $this->debug ) {
        $shortMessage = Meow_MWAI_Logging::shorten( $message, 64 );
        $debug = sprintf( 'REST [SimpleTextQuery]: %s, %s', $shortMessage, json_encode( $options ) );
        Meow_MWAI_Logging::log( $debug );
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

      if ( $this->debug ) {
        $shortMessage = Meow_MWAI_Logging::shorten( $message, 64 );
        $debug = sprintf( 'REST [SimpleImageQuery]: %s, %s', $shortMessage, json_encode( $options ) );
        Meow_MWAI_Logging::log( $debug );
      }

      $reply = $this->simpleImageQuery( $message, $options );
      return new WP_REST_Response([ 'success' => true, 'data' => $reply ], 200 );
    }
    catch (Exception $e) {
      return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
                }
        }

    public function rest_simpleImageEditQuery( $request ) {
        try {
          $params = $request->get_params();
          $message = isset( $params['message'] ) ? $params['message'] : '';
          if ( empty( $message ) ) {
                  $message = isset( $params['prompt'] ) ? $params['prompt'] : '';
          }
          $mediaId = isset( $params['mediaId'] ) ? intval( $params['mediaId'] ) : 0;
          $options = isset( $params['options'] ) ? $params['options'] : [];
          $resolution = isset( $params['resolution'] ) ? $params['resolution'] : '';
          $scope = isset( $params['scope'] ) ? $params['scope'] : 'public-api';
          if ( !empty( $scope ) ) {
                  $options['scope'] = $scope;
          }
          if ( empty( $message ) ) {
                  throw new Exception( 'The message is required.' );
          }
          if ( empty( $mediaId ) ) {
                  throw new Exception( 'The mediaId is required.' );
          }
          if ( !empty( $resolution ) ) {
                  $options['resolution'] = $resolution;
          }

          if ( $this->debug ) {
            $shortMessage = Meow_MWAI_Logging::shorten( $message, 64 );
            $debug = sprintf( 'REST [SimpleImageEditQuery]: %s, %s', $shortMessage, json_encode( $options ) );
            Meow_MWAI_Logging::log( $debug );
          }

          $reply = $this->simpleImageEditQuery( $message, $mediaId, $options );
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
      $options = isset( $params['options'] ) ? $params['options'] : [];
      $scope = isset( $params['scope'] ) ? $params['scope'] : 'public-api';
      if ( !empty( $scope ) ) {
        $options['scope'] = $scope;
      }
      if ( empty( $message ) ) {
        throw new Exception( 'The message is required.' );
      }
      if ( empty( $url ) ) {
        throw new Exception( 'The url is required.' );
      }

      if ( $this->debug ) {
        $shortMessage = Meow_MWAI_Logging::shorten( $message, 64 );
        $debug = sprintf( 'REST [SimpleVisionQuery]: %s, %s', $shortMessage, json_encode( $options ) );
        Meow_MWAI_Logging::log( $debug );
      }

      $reply = $this->simpleVisionQuery( $message, $url, null, $options );
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

      if ( $this->debug ) {
        $shortMessage = Meow_MWAI_Logging::shorten( $message, 64 );
        $debug = sprintf( 'REST [SimpleJsonQuery]: %s, %s', $shortMessage, json_encode( $options ) );
        Meow_MWAI_Logging::log( $debug );
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
      if ( empty( $text ) ) {
        throw new Exception( 'The text is required.' );
      }

      if ( $this->debug ) {
        $shortText = Meow_MWAI_Logging::shorten( $text, 64 );
        $debug = sprintf( 'REST [ModerationCheck]: %s', $shortText );
        Meow_MWAI_Logging::log( $debug );
      }

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
    if ( isset( $params['image_remote_upload'] ) ) {
      $query->image_remote_upload = $params['image_remote_upload'];
    }
    if ( !empty( $url ) ) {
      $query->set_file( Meow_MWAI_Query_DroppedFile::from_url( $url, 'vision' ) );
    }
    else if ( !empty( $path ) ) {
      $query->set_file( Meow_MWAI_Query_DroppedFile::from_path( $path, 'vision' ) );
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
  public function simpleChatbotQuery( $botId, $message, $params = [], $onlyReply = true ) {
    if ( !isset( $params['messages'] ) && isset( $params['chatId'] ) ) {
      if ( $this->core->get_option( 'chatbot_discussions' ) ) {
        $discussion = $this->discussions_module->get_discussion( $botId, $params['chatId'] );
        if ( !empty( $discussion ) ) {
          $params['messages'] = $discussion['messages'];
        }
      }
      else {
        $this->core->log( 'The chatId was provided; but the discussions are not enabled.' );
      }
    }
    $data = $this->chatbot_module->chat_submit( $botId, $message, null, $params );
    return $onlyReply ? $data['reply'] : $data;
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

  public function simpleImageEditQuery( $message, $mediaId, $params = [] ) {
    global $mwai_core;
    $query = new Meow_MWAI_Query_EditImage( $message );
    $query->inject_params( $params );
    $path = get_attached_file( $mediaId );
    if ( empty( $path ) ) {
      throw new Exception( 'The media cannot be found.' );
    }
    // TODO: Maybe 'vision' should be 'edit'.
    $query->set_file( Meow_MWAI_Query_DroppedFile::from_path( $path, 'vision' ) );
    $reply = $mwai_core->run_query( $query );
    return $reply->result;
  }

  /**
   * Generates an image relevant to the text.
   */
  public function imageQueryForMediaLibrary( $message, $params = [], $postId = null ) {
    $query = new Meow_MWAI_Query_Image( $message );
    $query->inject_params( $params );
    $query->set_local_download( null );
    $reply = $this->core->run_query( $query );
    preg_match( '/\!\[Image\]\((.*?)\)/', $reply->result, $matches );
    $url = $matches[1] ?? $reply->result;
    
    // Check if the URL is already a WordPress attachment URL to avoid duplicates
    $attachmentId = null;
    $upload_dir = wp_upload_dir();
    if ( strpos( $url, $upload_dir['baseurl'] ) === 0 ) {
      // This is already a local WordPress upload, try to find the attachment ID
      // First try by GUID
      global $wpdb;
      $attachmentId = $wpdb->get_var( $wpdb->prepare( 
        "SELECT ID FROM {$wpdb->posts} WHERE guid = %s AND post_type = 'attachment'", 
        $url 
      ) );
      
      // If not found by GUID, try by attachment URL (more reliable)
      if ( empty( $attachmentId ) ) {
        $attachmentId = attachment_url_to_postid( $url );
      }
    }
    
    // If not found or not a local URL, add it to the media library
    if ( empty( $attachmentId ) ) {
      $attachmentId = $this->core->add_image_from_url( $url, null, null, null, null, null, $postId );
      if ( empty( $attachmentId ) ) {
        throw new Exception( 'Could not add the image to the Media Library.' );
      }
    }
    
    // TODO: We should create a nice title, caption, and alt.
    $media = [
      'id' => $attachmentId,
      'url' => wp_get_attachment_url( $attachmentId ),
      'title' => get_the_title( $attachmentId ),
      'caption' => wp_get_attachment_caption( $attachmentId ),
      'alt' => get_post_meta( $attachmentId, '_wp_attachment_image_alt', true )
    ];
    return $media;
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
  #endregion

  #region Standard API
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

  #region Standard API (No REST API)

  /**
   * Checks the status of the AI environments.
   * 
   * @return array The types of environments that are available.
   */
  public function checkStatus() {
    $env_types = [];
    $ai_envs = $this->core->get_option( 'ai_envs' );
    if ( empty( $ai_envs ) ) {
      throw new Exception( 'There are no AI environments yet.' );
    }
    foreach ( $ai_envs as $env ) {
      if ( !empty( $env['apikey'] ) ) {
        if ( !in_array( $env['type'], $env_types ) ) {
          $env_types[] = $env['type'];
        }
      }
    }
    if ( empty( $env_types ) ) {
      throw new Exception( 'There are no AI environments with an API key yet.' );
    }
    return $env_types;
  }
  #endregion
}