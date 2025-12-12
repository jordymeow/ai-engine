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
  /**
   * Sanitize REST API options to remove sensitive parameters
   * that should not be controlled by untrusted users
   */
  private function sanitize_rest_options( $options ) {
    if ( !is_array( $options ) ) {
      return [];
    }

    // List of sensitive parameters that should not be set via REST API
    $blocked_params = [
      'apiKey',
      'path', // Block path parameter to prevent PHAR deserialization attacks
    ];
    $blocked_params = apply_filters( 'mwai_blocked_rest_params', $blocked_params, $options );

    // Remove blocked parameters
    foreach ( $blocked_params as $param ) {
      unset( $options[$param] );
    }

    return $options;
  }

  public function rest_api_init() {
    $public_api = $this->core->get_option( 'public_api' );
    if ( !$public_api ) {
      return;
    }
    $this->bearer_token = $this->core->get_option( 'public_api_bearer_token' );
    if ( !empty( $this->bearer_token ) ) {
      add_filter( 'mwai_allow_public_api', [ $this, 'auth_via_bearer_token' ], 10, 3 );
    }

    register_rest_route( 'mwai/v1', '/simpleAuthCheck', [
      'methods' => 'GET',
      'callback' => [ $this, 'rest_simpleAuthCheck' ],
      'permission_callback' => function ( $request ) {
        return $this->core->can_access_public_api( 'simpleAuthCheck', $request );
      },
    ] );
    register_rest_route( 'mwai/v1', '/simpleTextQuery', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_simpleTextQuery' ],
      'permission_callback' => function ( $request ) {
        return $this->core->can_access_public_api( 'simpleTextQuery', $request );
      },
    ] );
    register_rest_route( 'mwai/v1', '/simpleFastTextQuery', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_simpleFastTextQuery' ],
      'permission_callback' => function ( $request ) {
        return $this->core->can_access_public_api( 'simpleFastTextQuery', $request );
      },
    ] );
    register_rest_route( 'mwai/v1', '/simpleImageQuery', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_simpleImageQuery' ],
      'permission_callback' => function ( $request ) {
        return $this->core->can_access_public_api( 'simpleImageQuery', $request );
      },
    ] );
    register_rest_route( 'mwai/v1', '/simpleImageEditQuery', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_simpleImageEditQuery' ],
      'permission_callback' => function ( $request ) {
        return $this->core->can_access_public_api( 'simpleImageEditQuery', $request );
      },
    ] );
    register_rest_route( 'mwai/v1', '/simpleVisionQuery', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_simpleVisionQuery' ],
      'permission_callback' => function ( $request ) {
        return $this->core->can_access_public_api( 'simpleVisionQuery', $request );
      },
    ] );
    register_rest_route( 'mwai/v1', '/simpleJsonQuery', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_simpleJsonQuery' ],
      'permission_callback' => function ( $request ) {
        return $this->core->can_access_public_api( 'simpleJsonQuery', $request );
      },
    ] );
    register_rest_route( 'mwai/v1', '/moderationCheck', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_moderationCheck' ],
      'permission_callback' => function ( $request ) {
        return $this->core->can_access_public_api( 'moderationCheck', $request );
      },
    ] );
    register_rest_route( 'mwai/v1', '/simpleTranscribeAudio', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_simpleTranscribeAudio' ],
      'permission_callback' => function ( $request ) {
        return $this->core->can_access_public_api( 'simpleTranscribeAudio', $request );
      },
    ] );
    register_rest_route( 'mwai/v1', '/simpleFileUpload', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_simpleFileUpload' ],
      'permission_callback' => function ( $request ) {
        return $this->core->can_access_public_api( 'simpleFileUpload', $request );
      },
    ] );

    if ( $this->chatbot_module ) {
      register_rest_route( 'mwai/v1', '/simpleChatbotQuery', [
        'methods' => 'POST',
        'callback' => [ $this, 'rest_simpleChatbotQuery' ],
        'permission_callback' => function ( $request ) {
          return $this->core->can_access_public_api( 'simpleChatbotQuery', $request );
        },
      ] );

      register_rest_route( 'mwai/v1', '/listChatbots', [
        'methods' => 'GET',
        'callback' => [ $this, 'rest_listChatbots' ],
        'permission_callback' => function ( $request ) {
          return $this->core->can_access_public_api( 'listChatbots', $request );
        },
      ] );
    }
  }

  public function rest_simpleAuthCheck( $request ) {
    try {
      $params = $request->get_params();
      $current_user = wp_get_current_user();
      $current_email = $current_user->user_email;
      return new WP_REST_Response( [ 'success' => true, 'data' => [
        'type' => 'email',
        'value' => $current_email
      ] ], 200 );
    }
    catch ( Exception $e ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
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
      $fileId = isset( $params['fileId'] ) ? $params['fileId'] : null;
      $fileIds = isset( $params['fileIds'] ) ? $params['fileIds'] : null;
      $queryParams = [];
      if ( !empty( $chatId ) ) {
        $queryParams['chatId'] = $chatId;
      }
      if ( !empty( $fileId ) ) {
        $queryParams['fileId'] = $fileId;
      }
      if ( !empty( $fileIds ) && is_array( $fileIds ) ) {
        $queryParams['fileIds'] = $fileIds;
      }
      if ( empty( $botId ) || empty( $message ) ) {
        throw new Exception( __( 'The botId and message are required.', 'ai-engine' ) );
      }

      if ( $this->debug ) {
        $shortMessage = Meow_MWAI_Logging::shorten( $message, 64 );
        $debug = sprintf( 'REST [SimpleChatbotQuery]: %s, %s', $shortMessage, json_encode( $queryParams ) );
        Meow_MWAI_Logging::log( $debug );
      }

      $reply = $this->simpleChatbotQuery( $botId, $message, $queryParams, false );
      return new WP_REST_Response( [
        'success' => true,
        'data' => $reply['reply'],
        'extra' => [
          'actions' => $reply['actions'],
          'chatId' => $reply['chatId']
        ]
      ], 200 );
    }
    catch ( Exception $e ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_listChatbots( $request ) {
    try {
      // Get all chatbots
      $chatbots = get_option( 'mwai_chatbots', [] );
      $environments = $this->core->get_option( 'ai_envs' );
      $mcp_envs = $this->core->get_option( 'mcp_envs', [] );

      // Get all models from all environments
      $all_models = [];
      foreach ( $environments as $env ) {
        try {
          $engine = Meow_MWAI_Engines_Factory::get( $this->core, $env['id'] );
          $env_models = $engine->retrieve_models();
          foreach ( $env_models as $model ) {
            $all_models[$model['model']] = $model;
          }
        }
        catch ( Exception $e ) {
          // Skip environments that fail
        }
      }

      // Debug: Log model info for gpt-4.1-mini
      if ( $this->debug && isset( $all_models['gpt-4.1-mini'] ) ) {
        error_log( '[AI Engine API] Model info for gpt-4.1-mini: ' . json_encode( $all_models['gpt-4.1-mini'] ) );
      }

      // Get registered functions
      $functions = apply_filters( 'mwai_functions_list', [] );
      $function_names = [];
      foreach ( $functions as $function ) {
        $function_names[] = $function->name ?? 'unknown';
      }

      $result = [];

      foreach ( $chatbots as $chatbotId => $chatbot ) {
        // Debug log the chatbot structure
        if ( $this->debug && ( $chatbot['name'] ?? '' ) === 'Jordy' ) {
          error_log( '[AI Engine API] Jordy chatbot structure: ' . json_encode( $chatbot ) );
        }

        // Basic info
        $info = [
          'id' => $chatbot['botId'] ?? $chatbotId, // Use botId if available, fallback to array index
          'name' => $chatbot['name'] ?? 'Unnamed',
          'type' => 'chat', // Default type
          'model' => null,
          'model_name' => null,
          'environment' => null,
          'environment_name' => null,
          'functions' => [],
          'tools' => [], // Add tools array
          'mcp_servers' => []
        ];

        // Determine chatbot type
        if ( !empty( $chatbot['type'] ) ) {
          $info['type'] = $chatbot['type'];
        }
        else {
          // Try to infer type from model or other properties
          if ( !empty( $chatbot['model'] ) ) {
            if ( strpos( $chatbot['model'], 'realtime' ) !== false ) {
              $info['type'] = 'realtime';
            }
            else if ( strpos( $chatbot['model'], 'image' ) !== false || strpos( $chatbot['model'], 'dall-e' ) !== false ) {
              $info['type'] = 'images';
            }
            else if ( !empty( $chatbot['assistantId'] ) ) {
              $info['type'] = 'assistant';
            }
          }
        }

        // Get model info
        if ( !empty( $chatbot['model'] ) ) {
          $info['model'] = $chatbot['model'];
          // Find model name
          if ( isset( $all_models[$chatbot['model']] ) ) {
            $info['model_name'] = $all_models[$chatbot['model']]['name'] ?? $chatbot['model'];
          }
          else {
            $info['model_name'] = $chatbot['model'];
          }
        }

        // Get environment info
        if ( !empty( $chatbot['envId'] ) ) {
          $info['environment'] = $chatbot['envId'];
          // Find environment name
          foreach ( $environments as $env ) {
            if ( $env['id'] === $chatbot['envId'] ) {
              $info['environment_name'] = $env['name'] ?? $chatbot['envId'];
              break;
            }
          }
        }

        // Check if it uses functions - get specific function names if available
        if ( !empty( $chatbot['functions'] ) ) {
          if ( is_array( $chatbot['functions'] ) ) {
            // Functions are stored as array of objects with id and type
            $chatbot_functions = [];
            foreach ( $chatbot['functions'] as $func ) {
              if ( isset( $func['id'] ) ) {
                // Try to find function name by ID
                $func_name = $this->get_function_name_by_id( $func['id'] );
                if ( $func_name ) {
                  $chatbot_functions[] = $func_name;
                }
                else {
                  // Fallback: include the ID if name not found
                  $chatbot_functions[] = 'function_' . $func['id'];
                }
              }
            }
            $info['functions'] = $chatbot_functions;
          }
          else if ( $chatbot['functions'] === true ) {
            // If functions is just true, it uses all registered functions
            $info['functions'] = $function_names;
          }
        }

        // Check for tools (Web Search, Image Generation)
        if ( !empty( $chatbot['tools'] ) && is_array( $chatbot['tools'] ) ) {
          // Filter tools based on model capabilities
          $supported_tools = [];
          if ( !empty( $chatbot['model'] ) ) {
            // Try exact match first
            $model_key = $chatbot['model'];
            $model_info = $all_models[$model_key] ?? null;

            // If not found and it's an OpenRouter model, try without prefix
            if ( !$model_info && strpos( $model_key, '/' ) !== false ) {
              $model_key = substr( $model_key, strpos( $model_key, '/' ) + 1 );
              $model_info = $all_models[$model_key] ?? null;
            }

            if ( $model_info ) {
              $model_tools = $model_info['tools'] ?? [];

              // Only include tools that are both configured AND supported by the model
              foreach ( $chatbot['tools'] as $tool ) {
                if ( in_array( $tool, $model_tools ) ) {
                  $supported_tools[] = $tool;
                }
              }
            }
            else {
              // If model not found in our list, keep all configured tools
              // This allows custom models to use tools
              $supported_tools = $chatbot['tools'];
            }
          }
          $info['tools'] = $supported_tools;
        }

        // Check for MCP servers
        if ( !empty( $chatbot['mcp_servers'] ) && is_array( $chatbot['mcp_servers'] ) ) {
          foreach ( $chatbot['mcp_servers'] as $mcpServer ) {
            if ( !empty( $mcpServer['id'] ) ) {
              // Find MCP server name
              foreach ( $mcp_envs as $mcp ) {
                if ( $mcp['id'] === $mcpServer['id'] ) {
                  $info['mcp_servers'][] = [
                    'id' => $mcp['id'],
                    'name' => $mcp['name'] ?? 'Unnamed MCP Server'
                  ];
                  break;
                }
              }
            }
          }
        }

        $result[] = $info;
      }

      return new WP_REST_Response( [
        'success' => true,
        'data' => $result
      ], 200 );
    }
    catch ( Exception $e ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
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
      $options = $this->sanitize_rest_options( $options );
      $scope = isset( $params['scope'] ) ? $params['scope'] : 'public-api';
      if ( !empty( $scope ) ) {
        $options['scope'] = $scope;
      }
      if ( empty( $message ) ) {
        throw new Exception( __( 'The message is required.', 'ai-engine' ) );
      }

      if ( $this->debug ) {
        $shortMessage = Meow_MWAI_Logging::shorten( $message, 64 );
        $debug = sprintf( 'REST [SimpleTextQuery]: %s, %s', $shortMessage, json_encode( $options ) );
        Meow_MWAI_Logging::log( $debug );
      }

      $reply = $this->simpleTextQuery( $message, $options );
      return new WP_REST_Response( [ 'success' => true, 'data' => $reply ], 200 );
    }
    catch ( Exception $e ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_simpleFastTextQuery( $request ) {
    try {
      $params = $request->get_params();
      $message = isset( $params['message'] ) ? $params['message'] : '';
      if ( empty( $message ) ) {
        $message = isset( $params['prompt'] ) ? $params['prompt'] : '';
      }
      $options = isset( $params['options'] ) ? $params['options'] : [];
      $options = $this->sanitize_rest_options( $options );
      $scope = isset( $params['scope'] ) ? $params['scope'] : 'public-api';
      if ( !empty( $scope ) ) {
        $options['scope'] = $scope;
      }
      if ( empty( $message ) ) {
        throw new Exception( __( 'The message is required.', 'ai-engine' ) );
      }

      if ( $this->debug ) {
        $shortMessage = Meow_MWAI_Logging::shorten( $message, 64 );
        $debug = sprintf( 'REST [SimpleFastTextQuery]: %s, %s', $shortMessage, json_encode( $options ) );
        Meow_MWAI_Logging::log( $debug );
      }

      $reply = $this->simpleFastTextQuery( $message, $options );
      return new WP_REST_Response( [ 'success' => true, 'data' => $reply ], 200 );
    }
    catch ( Exception $e ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
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
        throw new Exception( __( 'The message is required.', 'ai-engine' ) );
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
      return new WP_REST_Response( [ 'success' => true, 'data' => $reply ], 200 );
    }
    catch ( Exception $e ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
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
        throw new Exception( __( 'The message is required.', 'ai-engine' ) );
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
      return new WP_REST_Response( [ 'success' => true, 'data' => $reply ], 200 );
    }
    catch ( Exception $e ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
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

      // Check for common parameter mistakes and provide helpful guidance
      if ( empty( $url ) && isset( $params['imageUrl'] ) ) {
        throw new Exception( 'Parameter "url" is required. Did you mean to use "url" instead of "imageUrl"?' );
      }
      if ( empty( $url ) && isset( $params['image_url'] ) ) {
        throw new Exception( 'Parameter "url" is required. Did you mean to use "url" instead of "image_url"?' );
      }

      $options = isset( $params['options'] ) ? $params['options'] : [];
      $options = $this->sanitize_rest_options( $options );
      $scope = isset( $params['scope'] ) ? $params['scope'] : 'public-api';
      if ( !empty( $scope ) ) {
        $options['scope'] = $scope;
      }
      if ( empty( $message ) ) {
        throw new Exception( __( 'The message is required.', 'ai-engine' ) );
      }
      if ( empty( $url ) ) {
        throw new Exception( 'The "url" parameter is required for image analysis.' );
      }

      if ( $this->debug ) {
        $shortMessage = Meow_MWAI_Logging::shorten( $message, 64 );
        $debug = sprintf( 'REST [SimpleVisionQuery]: %s, %s', $shortMessage, json_encode( $options ) );
        Meow_MWAI_Logging::log( $debug );
      }

      $reply = $this->simpleVisionQuery( $message, $url, null, $options );
      return new WP_REST_Response( [ 'success' => true, 'data' => $reply ], 200 );
    }
    catch ( Exception $e ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
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
      $options = $this->sanitize_rest_options( $options );
      $scope = isset( $params['scope'] ) ? $params['scope'] : 'public-api';
      if ( !empty( $scope ) ) {
        $options['scope'] = $scope;
      }
      if ( empty( $message ) ) {
        throw new Exception( __( 'The message is required.', 'ai-engine' ) );
      }

      if ( $this->debug ) {
        $shortMessage = Meow_MWAI_Logging::shorten( $message, 64 );
        $debug = sprintf( 'REST [SimpleJsonQuery]: %s, %s', $shortMessage, json_encode( $options ) );
        Meow_MWAI_Logging::log( $debug );
      }

      $reply = $this->simpleJsonQuery( $message, null, null, $options );
      return new WP_REST_Response( [ 'success' => true, 'data' => $reply ], 200 );
    }
    catch ( Exception $e ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_moderationCheck( $request ) {
    try {
      $params = $request->get_params();
      $text = isset( $params['text'] ) ? $params['text'] : '';

      // Check for common parameter mistakes and provide helpful guidance
      if ( empty( $text ) && isset( $params['message'] ) ) {
        throw new Exception( 'Parameter "text" is required. Did you mean to use "text" instead of "message"?' );
      }
      if ( empty( $text ) && isset( $params['content'] ) ) {
        throw new Exception( 'Parameter "text" is required. Did you mean to use "text" instead of "content"?' );
      }

      if ( empty( $text ) ) {
        throw new Exception( 'The "text" parameter is required for content moderation.' );
      }

      if ( $this->debug ) {
        $shortText = Meow_MWAI_Logging::shorten( $text, 64 );
        $debug = sprintf( 'REST [ModerationCheck]: %s', $shortText );
        Meow_MWAI_Logging::log( $debug );
      }

      $reply = $this->moderationCheck( $text );
      return new WP_REST_Response( [ 'success' => true, 'data' => $reply ], 200 );
    }
    catch ( Exception $e ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_simpleTranscribeAudio( $request ) {
    try {
      $params = $request->get_params();
      $url = isset( $params['url'] ) ? $params['url'] : '';
      $mediaId = isset( $params['mediaId'] ) ? intval( $params['mediaId'] ) : 0;

      // Check for common parameter mistakes and provide helpful guidance
      if ( empty( $url ) && empty( $mediaId ) ) {
        if ( isset( $params['audioUrl'] ) ) {
          throw new Exception( 'Parameter "url" is required. Did you mean to use "url" instead of "audioUrl"?' );
        }
        if ( isset( $params['audio_url'] ) ) {
          throw new Exception( 'Parameter "url" is required. Did you mean to use "url" instead of "audio_url"?' );
        }
        if ( isset( $params['file'] ) ) {
          throw new Exception( 'Use "url" for remote files or "mediaId" for uploaded files. Found "file" parameter instead.' );
        }
      }

      $options = isset( $params['options'] ) ? $params['options'] : [];
      $options = $this->sanitize_rest_options( $options );
      $scope = isset( $params['scope'] ) ? $params['scope'] : 'public-api';

      if ( !empty( $scope ) ) {
        $options['scope'] = $scope;
      }

      // Get file path from mediaId if provided
      $path = null;
      if ( $mediaId > 0 ) {
        $path = get_attached_file( $mediaId );
        if ( empty( $path ) ) {
          throw new Exception( 'The media file cannot be found.' );
        }
      }

      if ( empty( $url ) && empty( $path ) ) {
        throw new Exception( 'Either a "url" parameter or a "mediaId" parameter is required for audio transcription.' );
      }

      if ( $this->debug ) {
        $debug = sprintf(
          'REST [SimpleTranscribeAudio]: url=%s, mediaId=%d, %s',
          $url ? 'provided' : 'none',
          $mediaId,
          json_encode( $options )
        );
        Meow_MWAI_Logging::log( $debug );
      }

      $reply = $this->simpleTranscribeAudio( $url, $path, $options );
      return new WP_REST_Response( [ 'success' => true, 'data' => $reply ], 200 );
    }
    catch ( Exception $e ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_simpleFileUpload( $request ) {
    try {
      $params = $request->get_params();
      $files = $request->get_file_params();

      // Check if file is provided
      if ( empty( $files['file'] ) ) {
        // Check for base64 encoded file data
        $base64 = isset( $params['base64'] ) ? $params['base64'] : '';
        $filename = isset( $params['filename'] ) ? $params['filename'] : '';

        if ( empty( $base64 ) ) {
          throw new Exception( 'Either a file upload or base64 encoded data is required.' );
        }

        // Handle base64 upload
        $options = isset( $params['options'] ) ? $params['options'] : [];
        $purpose = isset( $params['purpose'] ) ? $params['purpose'] : 'analysis';
        $ttl = isset( $params['ttl'] ) ? intval( $params['ttl'] ) : 3600;
        $target = isset( $params['target'] ) ? $params['target'] : null;
        $metadata = isset( $params['metadata'] ) ? $params['metadata'] : [];

        if ( empty( $filename ) ) {
          $filename = 'upload-' . time() . '.png'; // Default filename for base64
        }

        // Log the request if debug is enabled
        if ( $this->debug ) {
          $debug = sprintf(
            'REST [SimpleFileUpload]: base64 upload, filename=%s, purpose=%s',
            $filename,
            $purpose
          );
          Meow_MWAI_Logging::log( $debug );
        }

        $result = $this->simpleFileUpload( null, $base64, $filename, $purpose, $ttl, $target, $metadata );
      }
      else {
        // Handle regular file upload
        $file = $files['file'];
        $purpose = isset( $params['purpose'] ) ? $params['purpose'] : 'analysis';
        $ttl = isset( $params['ttl'] ) ? intval( $params['ttl'] ) : 3600;
        $target = isset( $params['target'] ) ? $params['target'] : null;
        $metadata = isset( $params['metadata'] ) ? $params['metadata'] : [];

        if ( $this->debug ) {
          $debug = sprintf(
            'REST [SimpleFileUpload]: file upload, name=%s, purpose=%s',
            $file['name'],
            $purpose
          );
          Meow_MWAI_Logging::log( $debug );
        }

        $result = $this->simpleFileUpload( $file, null, null, $purpose, $ttl, $target, $metadata );
      }

      return new WP_REST_Response( [ 'success' => true, 'data' => $result ], 200 );
    }
    catch ( Exception $e ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
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
      $query->add_file( Meow_MWAI_Query_DroppedFile::from_url( $url, 'vision' ) );
    }
    else if ( !empty( $path ) ) {
      $query->add_file( Meow_MWAI_Query_DroppedFile::from_path( $path, 'vision' ) );
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
      if ( $this->core->get_option( 'chatbot_discussions' ) && $this->discussions_module ) {
        $discussion = $this->discussions_module->get_discussion( $botId, $params['chatId'] );
        if ( !empty( $discussion ) ) {
          $params['messages'] = $discussion['messages'];

          // CRITICAL: Also pass the discussion metadata for Responses API support
          // The chatbot module needs the previousResponseId from discussion's extra field
          if ( !empty( $discussion['extra'] ) ) {
            $extra = json_decode( $discussion['extra'], true );

            // Check for both possible field names
            $responseId = $extra['previousResponseId'] ?? $extra['responseId'] ?? null;
            $responseDate = $extra['previousResponseDate'] ?? $extra['responseDate'] ?? null;

            if ( !empty( $responseId ) ) {
              // Check if the response ID is still valid (not older than 30 days)
              $responseDateTimestamp = !empty( $responseDate ) ? strtotime( $responseDate ) : 0;
              $thirtyDaysAgo = time() - ( 30 * 24 * 60 * 60 );

              if ( $responseDateTimestamp > $thirtyDaysAgo ) {
                // Pass the previousResponseId directly in params
                // This will be picked up by inject_params in the query
                $params['previousResponseId'] = $responseId;
              }
            }
          }
        }
      }
      else {
        Meow_MWAI_Logging::log( 'The chatId was provided; but the discussions are not enabled.' );
      }
    }
    $fileId = isset( $params['fileId'] ) ? $params['fileId'] : null;
    $fileIds = isset( $params['fileIds'] ) ? $params['fileIds'] : [];
    $data = $this->chatbot_module->chat_submit( $botId, $message, $fileId, $params, false, $fileIds );
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

  public function simpleFastTextQuery( $message, $params = [] ) {
    global $mwai_core;
    $query = new Meow_MWAI_Query_Text( $message );

    // Use the Default (Fast) model and environment
    $fastDefaultModel = $mwai_core->get_option( 'ai_fast_default_model' );
    if ( !empty( $fastDefaultModel ) ) {
      $query->set_model( $fastDefaultModel );
    }

    $fastDefaultEnv = $mwai_core->get_option( 'ai_fast_default_env' );
    if ( !empty( $fastDefaultEnv ) ) {
      $query->set_env_id( $fastDefaultEnv );
    }

    // Inject any additional params (which may override the defaults)
    $query->inject_params( $params );

    try {
      $reply = $mwai_core->run_query( $query );
      return $reply->result;
    }
    catch ( Exception $e ) {
      // If Fast Model fails, try with default model
      Meow_MWAI_Logging::warn( 'Fast Model failed: ' . $e->getMessage() . ' - Falling back to default model.' );

      // Create a new query with default model/env
      $fallbackQuery = new Meow_MWAI_Query_Text( $message );

      $defaultModel = $mwai_core->get_option( 'ai_default_model' );
      if ( !empty( $defaultModel ) ) {
        $fallbackQuery->set_model( $defaultModel );
      }

      $defaultEnv = $mwai_core->get_option( 'ai_default_env' );
      if ( !empty( $defaultEnv ) ) {
        $fallbackQuery->set_env_id( $defaultEnv );
      }

      // Inject params again (except model/env which we just set)
      $fallbackParams = $params;
      unset( $fallbackParams['model'] );
      unset( $fallbackParams['envId'] );
      $fallbackQuery->inject_params( $fallbackParams );

      $reply = $mwai_core->run_query( $fallbackQuery );
      return $reply->result;
    }
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
    $query->add_file( Meow_MWAI_Query_DroppedFile::from_path( $path, 'vision' ) );
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

  /**
   * Uploads a file to the system.
   *
   * @param array|null $file The file array from $_FILES.
   * @param string|null $base64 Base64 encoded file data.
   * @param string|null $filename The filename for base64 uploads.
   * @param string $purpose The purpose of the file upload (e.g., 'files', 'vision', 'assistant').
   * @param int $ttl Time to live in seconds. Default 3600 (1 hour).
   * @param string|null $target Target location: 'uploads' or 'library'.
   * @param array $metadata Additional metadata to store with the file.
   *
   * @return array Array with 'id' (refId) and 'url' of the uploaded file.
   */
  public function simpleFileUpload( $file = null, $base64 = null, $filename = null, $purpose = 'analysis', $ttl = 3600, $target = null, $metadata = [] ) {
    global $mwai_core;

    if ( !$this->core->files ) {
      throw new Exception( 'Files module is not available.' );
    }

    // Determine target from settings if not provided
    if ( empty( $target ) ) {
      $target = $this->core->get_option( 'image_local_upload', 'uploads' );
    }

    try {
      if ( !empty( $base64 ) ) {
        // Handle base64 upload
        if ( empty( $filename ) ) {
          $filename = 'upload-' . time() . '.dat';
        }

        // Validate filename extension for base64 uploads
        $validate = wp_check_filetype( $filename );
        if ( $validate['type'] == false ) {
          throw new Exception( 'File type is not allowed.' );
        }

        // For base64 uploads, we need to decode and create a temp file first
        $binary = base64_decode( $base64 );
        if ( !$binary ) {
          throw new Exception( 'Invalid base64 data.' );
        }

        // Create a temporary file
        $tmp_path = wp_tempnam( 'mwai-upload' );
        file_put_contents( $tmp_path, $binary );

        // Use the regular upload method
        $refId = $this->core->files->upload_file(
          $tmp_path,
          $filename,
          $purpose,
          $metadata,
          null, // envId
          $target,
          $ttl
        );

        // Clean up temp file if it was uploaded to library
        if ( $target === 'library' && file_exists( $tmp_path ) ) {
          @unlink( $tmp_path );
        }

        $url = $this->core->files->get_url( $refId );

        return [
          'id' => $refId,
          'url' => $url
        ];
      }
      else if ( !empty( $file ) && is_array( $file ) ) {
        // Handle regular file upload
        if ( !empty( $file['error'] ) ) {
          throw new Exception( 'File upload error: ' . $file['error'] );
        }

        $refId = $this->core->files->upload_file(
          $file['tmp_name'],
          $file['name'],
          $purpose,
          $metadata,
          null, // envId
          $target,
          $ttl
        );

        $url = $this->core->files->get_url( $refId );

        return [
          'id' => $refId,
          'url' => $url
        ];
      }
      else {
        throw new Exception( 'Either a file or base64 data must be provided.' );
      }
    }
    catch ( Exception $e ) {
      throw new Exception( 'File upload failed: ' . $e->getMessage() );
    }
  }

  /**
   * Executes an audio transcription query.
   *
   * @param string $url The URL of the audio file to transcribe.
   * @param string|null $path The path to the audio file. If provided, the audio data will be read from this file.
   * @param array $params Additional parameters for the transcription query.
   *
   * @return string The transcribed text.
   */
  public function simpleTranscribeAudio( $url = null, $path = null, $params = [] ) {
    global $mwai_core;
    $ai_audio_default_env = $this->core->get_option( 'ai_audio_default_env' );
    $ai_audio_default_model = $this->core->get_option( 'ai_audio_default_model' );

    if ( empty( $ai_audio_default_model ) ) {
      $ai_audio_default_model = 'whisper-1'; // Default transcription model
    }

    $query = new Meow_MWAI_Query_Transcribe();

    if ( !empty( $ai_audio_default_env ) ) {
      $query->set_env_id( $ai_audio_default_env );
    }
    if ( !empty( $ai_audio_default_model ) ) {
      $query->set_model( $ai_audio_default_model );
    }

    $query->inject_params( $params );

    if ( !empty( $url ) ) {
      $query->add_file( Meow_MWAI_Query_DroppedFile::from_url( $url, 'analysis' ) );
    }
    else if ( !empty( $path ) ) {
      $query->add_file( Meow_MWAI_Query_DroppedFile::from_path( $path, 'analysis' ) );
    }
    else {
      throw new Exception( 'Either a URL or a path must be provided for the audio file.' );
    }

    $reply = $mwai_core->run_query( $query );
    return $reply->result;
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
      return (bool) $res['results'][0]['flagged'];
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

  /**
  * Get function name by ID
  */
  private function get_function_name_by_id( $funcId ) {
    // Get function from registry using the static method
    $function = MeowPro_MWAI_FunctionAware::get_function( 'code-engine', $funcId );
    if ( $function && isset( $function->name ) ) {
      return $function->name;
    }

    // If not found, try snippet-vault type as well
    $function = MeowPro_MWAI_FunctionAware::get_function( 'snippet-vault', $funcId );
    if ( $function && isset( $function->name ) ) {
      return $function->name;
    }

    return null;
  }
  #endregion
}
