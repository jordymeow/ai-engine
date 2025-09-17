<?php

class Meow_MWAI_Rest {
  private $core = null;
  private $namespace = 'mwai/v1';

  public function __construct( $core ) {
    $this->core = $core;
    add_action( 'rest_api_init', [ $this, 'rest_init' ] );
  }

  /**
  * Retrieve the message from the parameters and optionally sanitize it.
  *
  * @param array &$params The parameters array, passed by reference.
  * @param bool $sanitize Whether to sanitize the message using sanitize_text_field.
  * @return string The retrieved (and optionally sanitized) message.
  */
  public function retrieve_message( &$params, $sanitize = false ): string {
    if ( isset( $params['message'] ) ) {
      $message = $params['message'];
    }
    elseif ( isset( $params['prompt'] ) ) {
      $message = $params['prompt'];
      unset( $params['prompt'] );
      $params['message'] = $message;
      Meow_MWAI_Logging::deprecated( '"prompt" is deprecated, please use "message" instead.' );
    }
    else {
      $message = '';
    }

    if ( $sanitize ) {
      $message = sanitize_text_field( $message );
    }

    return $message;
  }

  /**
   * Helper method to create REST responses with automatic token refresh
   * 
   * @param array $data The response data
   * @param int $status HTTP status code
   * @return WP_REST_Response
   */
  protected function create_rest_response( $data, $status = 200 ) {
    // Always check if we need to provide a new nonce
    $current_nonce = $this->core->get_nonce( true );
    $request_nonce = isset( $_SERVER['HTTP_X_WP_NONCE'] ) ? $_SERVER['HTTP_X_WP_NONCE'] : null;
    
    // Check if nonce is approaching expiration (WordPress nonces last 12-24 hours)
    // We'll refresh if the nonce is older than 10 hours to be safe
    $should_refresh = false;
    
    if ( $request_nonce ) {
      // Try to determine the age of the nonce
      // WordPress uses a tick system where each tick is 12 hours
      // If we're in the second half of the nonce's life, refresh it
      $time = time();
      $nonce_tick = wp_nonce_tick();
      
      // Verify if the nonce is still valid but getting old
      $verify = wp_verify_nonce( $request_nonce, 'wp_rest' );
      if ( $verify === 2 ) {
        // Nonce is valid but was generated 12-24 hours ago
        $should_refresh = true;
        // Log will be written when token is included in response
      }
    }
    
    // If the nonce has changed or should be refreshed, include the new one
    if ( $should_refresh || ( $request_nonce && $current_nonce !== $request_nonce ) ) {
      $data['new_token'] = $current_nonce;
      
      // Log if server debug mode is enabled
      if ( $this->core->get_option( 'server_debug_mode' ) ) {
        error_log( '[AI Engine] Token refresh: Nonce refreshed (12-24 hours old)' );
      }
    }
    
    return new WP_REST_Response( $data, $status );
  }

  public function rest_init() {
    try {
      // Session Endpoint
      register_rest_route( $this->namespace, '/start_session', [
        'methods' => 'POST',
        'permission_callback' => '__return_true', // Public endpoint for guest users
        'callback' => [ $this, 'rest_start_session' ],
      ] );

      // Settings Endpoints
      register_rest_route( $this->namespace, '/settings/update', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_settings_update' ],
      ] );
      register_rest_route( $this->namespace, '/settings/options', [
        'methods' => 'GET',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_settings_list' ],
      ] );
      register_rest_route( $this->namespace, '/settings/reset', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_settings_reset' ],
      ] );
      register_rest_route( $this->namespace, '/settings/chatbots', [
        'methods' => ['GET', 'POST'],
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_settings_chatbots' ],
      ] );
      register_rest_route( $this->namespace, '/settings/themes', [
        'methods' => ['GET', 'POST'],
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_settings_themes' ],
      ] );

      // System Endpoints
      register_rest_route( $this->namespace, '/system/logs/list', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_system_logs_list' ],
      ] );
      register_rest_route( $this->namespace, '/system/logs/delete', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_system_logs_delete' ],
      ] );
      register_rest_route( $this->namespace, '/system/logs/meta', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_system_logs_meta_get' ],
      ] );
      register_rest_route( $this->namespace, '/system/logs/activity', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_system_logs_activity' ],
      ] );
      register_rest_route( $this->namespace, '/system/logs/activity_daily', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_system_logs_activity_daily' ],
      ] );
      register_rest_route( $this->namespace, '/system/templates', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_system_templates_save' ],
      ] );
      register_rest_route( $this->namespace, '/system/templates', [
        'methods' => 'GET',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_system_templates_get' ],
      ] );

      // AI Endpoints
      register_rest_route( $this->namespace, '/ai/models', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_ai_models' ],
      ] );
      register_rest_route( $this->namespace, '/ai/test_connection', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_ai_test_connection' ],
      ] );
      register_rest_route( $this->namespace, '/ai/completions', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_ai_completions' ],
      ] );
      register_rest_route( $this->namespace, '/ai/images', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_ai_images' ],
      ] );
      register_rest_route( $this->namespace, '/ai/image_edit', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_ai_image_edit' ],
      ] );
      register_rest_route( $this->namespace, '/ai/copilot', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_ai_copilot' ],
      ] );

      register_rest_route( $this->namespace, '/ai/magic_wand', [
        'methods' => 'POST',
        'callback' => [ $this, 'rest_ai_magic_wand' ],
        'permission_callback' => [ $this->core, 'can_access_features' ],
      ] );
      register_rest_route( $this->namespace, '/ai/moderate', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_ai_moderate' ],
      ] );
      register_rest_route( $this->namespace, '/ai/transcribe_audio', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_ai_transcribe_audio' ],
      ] );
      register_rest_route( $this->namespace, '/ai/transcribe_image', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_ai_transcribe_image' ],
      ] );
      register_rest_route( $this->namespace, '/ai/json', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_ai_json' ],
      ] );

      // MCP Endpoints
      register_rest_route( $this->namespace, '/mcp/functions', [
        'methods' => 'GET',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_mcp_functions' ],
      ] );

      // Helpers Endpoints
      register_rest_route( $this->namespace, '/helpers/update_post_title', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_update_title' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/update_post_excerpt', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_update_excerpt' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/create_post', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_create_post' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/create_image', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_create_images' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/generate_image_meta', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_generate_image_meta' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/count_posts', [
        'methods' => 'GET',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_count_posts' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/posts_ids', [
        'methods' => 'GET',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_posts_ids' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/post_types', [
        'methods' => 'GET',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_post_types' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/post_content', [
        'methods' => 'GET',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_post_content' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/run_tasks', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_run_tasks' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/optimize_database', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_helpers_optimize_database' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/cron_events', [
        'methods' => 'GET',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_cron_events' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/run_cron', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_run_cron' ],
      ] );

      // OpenAI Endpoints
      register_rest_route( $this->namespace, '/openai/files/list', [
        'methods' => 'GET',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_openai_files_get' ],
      ] );
      register_rest_route( $this->namespace, '/openai/files/upload', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_openai_files_upload' ],
      ] );
      register_rest_route( $this->namespace, '/openai/files/delete', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_openai_files_delete' ],
      ] );
      register_rest_route( $this->namespace, '/openai/files/download', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_openai_files_download' ],
      ] );
      register_rest_route( $this->namespace, '/openai/files/finetune', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_openai_files_finetune' ],
      ] );
      register_rest_route( $this->namespace, '/openai/finetunes/list_deleted', [
        'methods' => 'GET',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_openai_deleted_finetunes_get' ],
      ] );

      // register_rest_route( $this->namespace, '/openai/models', array(
      //   'methods' => 'GET',
      //   'permission_callback' => [ $this->core, 'can_access_settings' ],
      //   'callback' => [ $this, 'rest_openai_models_get' ],
      // ) );

      register_rest_route( $this->namespace, '/openai/finetunes/list', [
        'methods' => 'GET',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_openai_finetunes_get' ],
      ] );
      register_rest_route( $this->namespace, '/openai/finetunes/delete', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_openai_finetunes_delete' ],
      ] );
      register_rest_route( $this->namespace, '/openai/finetunes/cancel', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_openai_finetunes_cancel' ],
      ] );

      // Logging Endpoints
      register_rest_route( $this->namespace, '/get_logs', [
        'methods' => 'GET',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_get_logs' ]
      ] );
      register_rest_route( $this->namespace, '/clear_logs', [
        'methods' => 'GET',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_clear_logs' ]
      ] );

      // Forms Endpoints
      register_rest_route( $this->namespace, '/forms/list', [
        'methods' => 'GET',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_forms_list' ]
      ] );
      register_rest_route( $this->namespace, '/forms/get', [
        'methods' => 'GET',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_forms_get' ]
      ] );
      register_rest_route( $this->namespace, '/forms/create', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_forms_create' ]
      ] );
      register_rest_route( $this->namespace, '/forms/update', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_forms_update' ]
      ] );
      register_rest_route( $this->namespace, '/forms/delete', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_forms_delete' ]
      ] );
    }
    catch ( Exception $e ) {
      Meow_MWAI_Logging::error( 'REST API initialization failed: ' . $e->getMessage() );
    }
  }

  public function rest_start_session() {
    try {
      $sessionId = $this->core->get_session_id();
      $restNonce = $this->core->get_nonce( true );
      
      $response = [
        'success' => true,
        'sessionId' => $sessionId,
        'restNonce' => $restNonce
      ];
      
      // If in test mode and we have a new token, it will be added by create_rest_response
      // But we also want to ensure the restNonce matches the test token if available
      if ( get_option( 'mwai_token_test_mode' ) ) {
        $token_data = get_option( 'mwai_test_token_data' );
        if ( $token_data && isset( $token_data['token'] ) ) {
          $response['restNonce'] = $token_data['token'];
        }
      }
      
      return $this->create_rest_response( $response, 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_settings_list() {
    return $this->create_rest_response( [
      'success' => true,
      'options' => $this->core->get_all_options()
    ], 200 );
  }

  public function rest_helpers_cron_events( $request ) {
    try {
      // Only show AI Engine cron events (those starting with mwai_)
      $cron_events = [];
      $crons = _get_cron_array();
      
      // Get transient data for last run status (we'll store this when crons run)
      $last_run_data = get_transient( 'mwai_cron_last_run' ) ?: [];
      
      // Get all scheduled events and filter for AI Engine ones
      foreach ( $crons as $timestamp => $cron ) {
        foreach ( $cron as $hook => $details ) {
          // Only process AI Engine hooks (starting with mwai_)
          if ( strpos( $hook, 'mwai_' ) !== 0 ) {
            continue;
          }
          
          $schedule_key = array_keys( $details )[0];
          $schedule_info = $details[$schedule_key];
          
          // Get schedule display name
          $schedule = $schedule_info['schedule'];
          $schedules = wp_get_schedules();
          $schedule_display = isset( $schedules[$schedule]['display'] ) ? 
            $schedules[$schedule]['display'] : $schedule;
          
          $event_info = [
            'hook' => $hook,
            'name' => $this->get_cron_display_name( $hook ),
            'description' => $this->get_cron_description( $hook ),
            'next_run' => $timestamp,
            'next_run_human' => '',
            'last_run' => isset( $last_run_data[$hook]['time'] ) ? $last_run_data[$hook]['time'] : null,
            'last_run_human' => isset( $last_run_data[$hook]['time'] ) ? 
              human_time_diff( $last_run_data[$hook]['time'], time() ) . ' ago' : 
              'Never',
            'last_status' => isset( $last_run_data[$hook]['status'] ) ? $last_run_data[$hook]['status'] : 'unknown',
            'schedule' => $schedule_display,
            'is_running' => false,
            'is_scheduled' => true
          ];
          
          // Calculate next run time properly
          // If we have a last run time and schedule interval, calculate the actual next run
          if ( isset( $last_run_data[$hook]['time'] ) && isset( $schedules[$schedule]['interval'] ) ) {
            $interval = $schedules[$schedule]['interval'];
            $last_run = $last_run_data[$hook]['time'];
            $expected_next_run = $last_run + $interval;
            
            // If the scheduled timestamp is in the past but we ran recently, 
            // the next run should be based on the last actual run
            if ( $timestamp < time() && 
                 $last_run > ( time() - $interval ) ) {
              // Cron ran recently, calculate next run from last run time
              $event_info['next_run'] = $expected_next_run;
              $event_info['next_run_human'] = 'In ' . human_time_diff( time(), $expected_next_run );
            } else if ( $timestamp < time() ) {
              // Genuinely overdue
              $event_info['next_run_human'] = 'Overdue by ' . human_time_diff( time(), $timestamp );
            } else {
              // Future scheduled time
              $event_info['next_run_human'] = 'In ' . human_time_diff( time(), $timestamp );
            }
          } else {
            // No last run data, use the scheduled timestamp but be conservative about "overdue"
            if ( $timestamp < time() ) {
              // Only show as overdue if it's significantly past due (more than the schedule interval)
              // to avoid false positives for crons that might be running but not tracked
              $time_past_due = time() - $timestamp;
              $interval = isset( $schedules[$schedule]['interval'] ) ? $schedules[$schedule]['interval'] : 3600; // Default 1 hour
              
              if ( $time_past_due > $interval ) {
                $event_info['next_run_human'] = 'Overdue by ' . human_time_diff( time(), $timestamp );
              } else {
                $event_info['next_run_human'] = 'Due to run';
              }
            } else {
              $event_info['next_run_human'] = 'In ' . human_time_diff( time(), $timestamp );
            }
          }
          
          // Check if currently running (via transient)
          $running_transient = get_transient( 'mwai_cron_running_' . $hook );
          if ( $running_transient ) {
            $event_info['is_running'] = true;
          }
          
          $cron_events[] = $event_info;
        }
      }
      
      return $this->create_rest_response( [ 'success' => true, 'events' => $cron_events ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_helpers_run_cron( $request ) {
    try {
      $params = $request->get_json_params();
      $hook = isset( $params['hook'] ) ? $params['hook'] : null;
      
      if ( empty( $hook ) ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'No cron hook provided' ], 400 );
      }
      
      // Only allow running AI Engine crons (starting with mwai_)
      if ( strpos( $hook, 'mwai_' ) !== 0 ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Invalid cron hook' ], 400 );
      }
      
      // Check if the hook exists
      if ( !has_action( $hook ) ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Cron hook not found' ], 404 );
      }
      
      // Run the cron action
      do_action( $hook );
      
      // If this is a Tasks Runner cron, reschedule it
      if ( $hook === 'mwai_tasks_internal_run' || $hook === 'mwai_tasks_internal_dev_run' ) {
        wp_clear_scheduled_hook( $hook );
        
        if ( $hook === 'mwai_tasks_internal_run' ) {
          wp_schedule_event( time() + 60, 'one_minute', $hook );
        } else if ( $hook === 'mwai_tasks_internal_dev_run' ) {
          wp_schedule_event( time() + 5, 'five_seconds', $hook );
        }
      }
      
      return $this->create_rest_response( [ 
        'success' => true, 
        'message' => 'Cron executed successfully',
        'hook' => $hook
      ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }
  
  private function get_cron_display_name( $hook ) {
    $names = [
      'mwai_tasks_internal_run' => 'Tasks Runner',
      'mwai_tasks_internal_dev_run' => 'Tasks Runner (Dev)',
      'mwai_cleanup_oauth' => 'OAuth Cleanup',
      'mwai_files_cleanup' => 'Files Cleanup',
      'mwai_discussions' => 'Discussions Cleanup'
    ];
    return isset( $names[$hook] ) ? $names[$hook] : $hook;
  }
  
  private function get_cron_description( $hook ) {
    $descriptions = [
      'mwai_tasks_internal_run' => 'Processes background tasks and queued operations.',
      'mwai_tasks_internal_dev_run' => 'Processes tasks in development mode (every 5 seconds).',
      'mwai_cleanup_oauth' => 'Cleans up expired OAuth tokens and sessions.',
      'mwai_files_cleanup' => 'Removes temporary and orphaned files.',
      'mwai_discussions' => 'Maintains chat discussions database and removes old entries.'
    ];
    return isset( $descriptions[$hook] ) ? $descriptions[$hook] : '';
  }

  public function rest_settings_update( $request ) {
    try {
      $params = $request->get_json_params();
      $value = $params['options'];
      $options = $this->core->update_options( $value );
      $success = !!$options;
      $message = __( $success ? 'OK' : 'Could not update options.', 'ai-engine' );
      return $this->create_rest_response( [ 'success' => $success, 'message' => $message, 'options' => $options ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_settings_reset() {
    try {
      $options = $this->core->reset_options();
      $success = !!$options;
      $message = __( $success ? 'OK' : 'Could not reset options.', 'ai-engine' );
      return $this->create_rest_response( [ 'success' => $success, 'message' => $message, 'options' => $options ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_ai_models( $request ) {
    try {
      $params = $request->get_json_params();
      $envId = $params['envId'];
      $engine = Meow_MWAI_Engines_Factory::get( $this->core, $envId );
      $models = $engine->retrieve_models();
      return $this->create_rest_response( [ 'success' => true, 'models' => $models ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_ai_test_connection( $request ) {
    try {
      $params = $request->get_json_params();
      $envId = $params['env_id'];
      
      // Get the environment details
      $env = null;
      $envs = $this->core->get_option( 'ai_envs' );
      foreach ( $envs as $e ) {
        if ( $e['id'] === $envId ) {
          $env = $e;
          break;
        }
      }
      
      if ( !$env ) {
        throw new Exception( __( 'Environment not found.', 'ai-engine' ) );
      }
      
      // Get the engine and test connection
      $engine = Meow_MWAI_Engines_Factory::get( $this->core, $envId );
      $result = $engine->connection_check();
      
      // Format the response based on provider
      $response = [
        'success' => true,
        'provider' => $env['type'],
        'name' => $env['name'],
        'data' => $result
      ];
      
      return $this->create_rest_response( $response, 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 
        'success' => false, 
        'error' => $message,
        'provider' => isset( $env ) ? $env['type'] : 'unknown'
      ], 200 ); // Return 200 even on error for consistent modal display
    }
  }

  public function rest_ai_completions( $request ) {
    try {
      $params = $request->get_json_params();
      $message = $this->retrieve_message( $params );
      $query = new Meow_MWAI_Query_Text( $message );
      $query->inject_params( $params );

      // Handle streaming
      $stream = $params['stream'] ?? false;
      $streamCallback = null;
      if ( $stream ) {
        $streamCallback = function ( $reply ) use ( $query ) {
          //$raw = _wp_specialchars( $reply, ENT_NOQUOTES, 'UTF-8', true );
          $raw = $reply;
          $this->core->stream_push( [ 'type' => 'live', 'data' => $raw ], $query );
          if ( ob_get_level() > 0 ) {
            ob_flush();
          }
          flush();
        };
        if ( headers_sent( $filename, $linenum ) ) {
          throw new Exception( "Headers already sent in $filename on line $linenum. Cannot start streaming." );
        }
        header( 'Cache-Control: no-cache' );
        header( 'Content-Type: text/event-stream' );
        header( 'X-Accel-Buffering: no' ); // This is useful to disable buffering in nginx through headers.
        ob_implicit_flush( true );
        if ( ob_get_level() > 0 ) {
          ob_end_flush();
        }
      }

      // Process Reply
      $reply = $this->core->run_query( $query, $streamCallback );
      $restRes = [
        'success' => true,
        'data' => $reply->result,
        'usage' => $reply->usage
      ];
      if ( $stream ) {
        $this->core->stream_push( [ 'type' => 'end', 'data' => json_encode( $restRes ) ], $query );
        die();
      }
      return $this->create_rest_response( $restRes, 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      if ( $stream ) {
        $this->core->stream_push( [ 'type' => 'error', 'data' => $message ], $query );
      }
      else {
        return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
      }
    }
  }

  public function rest_ai_images( $request ) {
    try {
      $params = $request->get_json_params();
      $message = $this->retrieve_message( $params );
      $query = new Meow_MWAI_Query_Image( $message );
      $query->inject_params( $params );
      $reply = $this->core->run_query( $query );
      return $this->create_rest_response( [ 'success' => true, 'data' => $reply->results, 'usage' => $reply->usage ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_ai_image_edit( $request ) {
    try {
      // Check if this is a multipart request with files
      $files = $request->get_file_params();
      $params = null;

      // Debug logging
      if ( $this->core->get_option( 'queries_debug_mode' ) ) {
        error_log( '[AI Engine Queries] Image Edit Request - Method: ' . $request->get_method() );
        $content_type = $request->get_content_type();
        if ( is_array( $content_type ) ) {
          error_log( '[AI Engine Queries] Image Edit Request - Content-Type: ' . $content_type['value'] );
        }
        else {
          error_log( '[AI Engine Queries] Image Edit Request - Content-Type: ' . $content_type );
        }
        error_log( '[AI Engine Queries] Image Edit Request - Has files: ' . ( !empty( $files ) ? 'yes (' . count( $files ) . ')' : 'no' ) );
      }

      if ( !empty( $files ) ) {
        // Handle multipart form data - get all params including POST data
        $params = $request->get_params();
        if ( $this->core->get_option( 'queries_debug_mode' ) ) {
          error_log( '[AI Engine Queries] Image Edit Request - Using form data params' );
        }
      }
      else {
        // Try to get body params first (for form data without files)
        $body_params = $request->get_body_params();
        if ( !empty( $body_params ) ) {
          $params = $body_params;
          if ( $this->core->get_option( 'queries_debug_mode' ) ) {
            error_log( '[AI Engine Queries] Image Edit Request - Using body params' );
          }
        }
        else {
          // Handle JSON request
          $params = $request->get_json_params();
          if ( $this->core->get_option( 'queries_debug_mode' ) ) {
            error_log( '[AI Engine Queries] Image Edit Request - Using JSON params' );
          }
        }
      }

      // Ensure params is always an array
      if ( empty( $params ) ) {
        $params = [];
      }

      // Debug logging
      if ( $this->core->get_option( 'queries_debug_mode' ) ) {
        error_log( '[AI Engine Queries] Image Edit Request - Has files: ' . ( !empty( $files ) ? 'yes' : 'no' ) );
        error_log( '[AI Engine Queries] Image Edit Request - Params: ' . json_encode( $params ) );
      }

      $message = $this->retrieve_message( $params );
      $mediaId = isset( $params['mediaId'] ) ? intval( $params['mediaId'] ) : 0;
      $query = new Meow_MWAI_Query_EditImage( $message );

      // The inject_params method will handle setting the file from mediaId
      $query->inject_params( $params );

      // Handle mask file if provided
      if ( !empty( $files['mask'] ) ) {
        $mask_file = $files['mask'];
        if ( $mask_file['error'] === UPLOAD_ERR_OK ) {
          $mask_data = file_get_contents( $mask_file['tmp_name'] );
          $query->set_mask( Meow_MWAI_Query_DroppedFile::from_data( $mask_data, 'vision', $mask_file['type'] ) );
        }
      }

      $reply = $this->core->run_query( $query );
      return $this->create_rest_response( [ 'success' => true, 'data' => $reply->results, 'usage' => $reply->usage ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_ai_magic_wand( $request ) {
    try {
      $params = $request->get_json_params();
      $action = isset( $params['action'] ) ? $params['action'] : null;
      $data = isset( $params['data'] ) ? $params['data'] : null;
      if ( empty( $data ) || empty( $action ) ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'An action and some data are required.' ], 500 );
      }
      $data = apply_filters( 'mwai_magic_wand_' . $action, '', $data );
      return $this->create_rest_response( [  'success' => true, 'data' => $data ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_ai_copilot( $request ) {
    try {
      $params = $request->get_json_params();
      $action = sanitize_text_field( $params['action'] );
      $message = $this->retrieve_message( $params, true );
      $context = sanitize_text_field( $params['context'] );
      $postId = !empty( $params['postId'] ) ? intval( $params['postId'] ) : null;
      if ( empty( $action ) || empty( $message ) ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Copilot needs an action and a prompt.' ], 500 );
      }

      global $mwai;
      $result = null;
      $params = [ 'scope' => 'copilot' ];

      if ( $action === 'text' ) {
        $prompt = "Here is the current article: \n\n===\n\n" . $context . "\n\n===\n\nIn this article, instead of the [== CURRENT BLOCK ==] placeholder, the author needs additional content. This new content should use the same tone, style, context, it should naturally flow in the article. The author shared additional information for this request:\n\n===\n\n" . $message . "\n\n===\n\nPlease provide the additional content. Only output the additional content, not the entire article, no need for extra information, and no need for the placeholders. Only output the content that should be added.";
        if ( !empty( $model ) ) {
          $params['model'] = $model;
        }
        $result = $mwai->simpleTextQuery( $prompt, $params );
      }
      else if ( $action === 'image' ) {
        $prompt = "Here is the current article: \n\n===\n\n" . $context . "\n\n===\n\nIn this article, instead of the [== CURRENT BLOCK ==] placeholder, the author needs an image. Please write a detailed description (prompt) for that image that would fit this context. The image should be relevant to the article. The author shared additional information for this request:\n\n===\n\n" . $message . "\n\n===\n\nPlease only output the description for the image, not the entire article, no need for extra information, and no need for the placeholders. Only output the description.";

        // Create the image
        $simplifiedPrompt = $mwai->simpleTextQuery( $prompt, $params );
        $media = $mwai->imageQueryForMediaLibrary( $simplifiedPrompt, $params, $postId );
        $result = [ 'media' => $media ];
      }
      return $this->create_rest_response( [ 'success' => true, 'data' => $result ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_helpers_update_title( $request ) {
    try {
      $params = $request->get_json_params();
      $title = sanitize_text_field( $params['title'] );
      $postId = intval( $params['postId'] );
      $post = get_post( $postId );
      if ( !$post ) {
        throw new Exception( __( 'There is no post with this ID.', 'ai-engine' ) );
      }
      $post->post_title = $title;
      //$post->post_name = sanitize_title( $title );
      wp_update_post( $post );
      return $this->create_rest_response( [ 'success' => true, 'message' => 'Title updated.' ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_helpers_update_excerpt( $request ) {
    try {
      $params = $request->get_json_params();
      $excerpt = sanitize_text_field( $params['excerpt'] );
      $postId = intval( $params['postId'] );
      $post = get_post( $postId );
      if ( !$post ) {
        throw new Exception( __( 'There is no post with this ID.', 'ai-engine' ) );
      }
      $post->post_excerpt = $excerpt;
      wp_update_post( $post );
      return $this->create_rest_response( [ 'success' => true, 'message' => 'Excerpt updated.' ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_helpers_create_post( $request ) {
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
      // TODO: Let's try to avoid using Markdown to create the Post
      // Instead, we should create Gutenberg Blocks, or simple HTML.
      // Then, we can get rid of the library for Markdown.
      $post->post_content = $this->core->markdown_to_html( $post->post_content );
      $postId = wp_insert_post( $post );
      return $this->create_rest_response( [ 'success' => true, 'postId' => $postId ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_helpers_create_images( $request ) {
    try {
      $params = $request->get_json_params();
      $title = sanitize_text_field( $params['title'] );
      $caption = sanitize_text_field( $params['caption'] );
      $alt = sanitize_text_field( $params['alt'] );
      $description = sanitize_text_field( $params['description'] );
      $url = $params['url'];
      $filename = sanitize_text_field( $params['filename'] );
      $attachmentId = $this->core->add_image_from_url( $url, $filename, $title, $description, $caption, $alt );
      return $this->create_rest_response( [ 'success' => true, 'attachmentId' => $attachmentId ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_helpers_generate_image_meta( $request ) {
    try {
      global $mwai;
      $params = $request->get_json_params();
      $url = isset( $params['url'] ) ? esc_url_raw( $params['url'] ) : null;
      if ( empty( $url ) ) {
        throw new Exception( __( 'The url is required.', 'ai-engine' ) );
      }
      $prompt = 'Describe this image and suggest a short title, description and SEO-friendly (ASCII and lowercase) filename. '
      . 'Return a JSON with the keys title, description, alt, caption, filename.';
      $result = $mwai->simpleVisionQuery( $prompt, $url, null, [ 'image_remote_upload' => 'url', 'scope' => 'admin-tools' ] );
      $result = preg_replace( '/^```json\s*/', '', $result );
      $result = preg_replace( '/\s*```$/', '', $result );
      if ( is_string( $result ) ) {
        $data = json_decode( $result, true );
      }
      else {
        $data = $result;
      }
      if ( !is_array( $data ) ) {
        $data = [];
      }
      $data = array_merge( [ 'title' => '', 'description' => '', 'caption' => '', 'alt' => '', 'filename' => '' ], $data );
      return $this->create_rest_response( [ 'success' => true, 'data' => $data ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_openai_files_get() {
    try {
      $envId = isset( $_GET['envId'] ) ? $_GET['envId'] : null;
      $purposeFilter = isset( $_GET['purpose'] ) ? $_GET['purpose'] : null;
      $openai = Meow_MWAI_Engines_Factory::get_openai( $this->core, $envId );
      $files = $openai->list_files( $purposeFilter );
      return $this->create_rest_response( [ 'success' => true, 'files' => $files ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_openai_deleted_finetunes_get() {
    try {
      $envId = isset( $_GET['envId'] ) ? $_GET['envId'] : null;
      $legacy = isset( $_GET['legacy'] ) ? $_GET['legacy'] === 'true' : false;
      $openai = Meow_MWAI_Engines_Factory::get_openai( $this->core, $envId );
      $finetunes = $openai->list_deleted_finetunes( $legacy );
      return $this->create_rest_response( [ 'success' => true, 'finetunes' => $finetunes ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_openai_finetunes_get() {
    try {
      $envId = isset( $_GET['envId'] ) ? $_GET['envId'] : null;
      $legacy = isset( $_GET['legacy'] ) ? $_GET['legacy'] === 'true' : false;
      $openai = Meow_MWAI_Engines_Factory::get_openai( $this->core, $envId );
      $finetunes = $openai->list_finetunes( $legacy );
      return $this->create_rest_response( [ 'success' => true, 'finetunes' => $finetunes ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_openai_files_upload( $request ) {
    try {
      $params = $request->get_json_params();
      $envId = $params['envId'];
      ;
      $filename = sanitize_text_field( $params['filename'] );
      $data = $params['data'];
      $openai = Meow_MWAI_Engines_Factory::get_openai( $this->core, $envId );
      $file = $openai->upload_file( $filename, $data );
      return $this->create_rest_response( [ 'success' => true, 'file' => $file ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_openai_files_delete( $request ) {
    try {
      $params = $request->get_json_params();
      $envId = $params['envId'];
      ;
      $fileId = $params['fileId'];
      $openai = Meow_MWAI_Engines_Factory::get_openai( $this->core, $envId );
      $openai->delete_file( $fileId );
      return $this->create_rest_response( [ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_openai_finetunes_cancel( $request ) {
    try {
      $params = $request->get_json_params();
      $envId = $params['envId'];
      ;
      $finetuneId = $params['finetuneId'];
      $openai = Meow_MWAI_Engines_Factory::get_openai( $this->core, $envId );
      $openai->cancel_finetune( $finetuneId );
      return $this->create_rest_response( [ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_openai_finetunes_delete( $request ) {
    try {
      $params = $request->get_json_params();
      $envId = $params['envId'];
      ;
      $modelId = $params['modelId'];
      $openai = Meow_MWAI_Engines_Factory::get_openai( $this->core, $envId );
      $openai->delete_finetune( $modelId );
      return $this->create_rest_response( [ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_openai_files_download( $request ) {
    try {
      $params = $request->get_json_params();
      $envId = $params['envId'];
      ;
      $fileId = $params['fileId'];
      $openai = Meow_MWAI_Engines_Factory::get_openai( $this->core, $envId );
      $filename = $openai->download_file( $fileId );
      $data = file_get_contents( $filename );
      return $this->create_rest_response( [ 'success' => true, 'data' => $data ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_openai_files_finetune( $request ) {
    try {
      $params = $request->get_json_params();
      $envId = $params['envId'];
      ;
      $fileId = $params['fileId'];
      $model = $params['model'];
      $suffix = $params['suffix'];
      $hyperparams = [
        'nEpochs' => isset( $params['nEpochs'] ) ? $params['nEpochs'] : null,
        'batchSize' => isset( $params['batchSize'] ) ? $params['batchSize'] : null,
      ];
      $openai = Meow_MWAI_Engines_Factory::get_openai( $this->core, $envId );
      $finetune = $openai->run_finetune( $fileId, $model, $suffix, $hyperparams );
      return $this->create_rest_response( [ 'success' => true, 'finetune' => $finetune ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_helpers_count_posts( $request ) {
    try {
      $params = $request->get_query_params();
      $postType = $params['postType'];
      $postStatus = !empty( $params['postStatus'] ) ? explode( ',', $params['postStatus'] ) : [ 'publish' ];
      $count = wp_count_posts( $postType );
      $count = array_sum( array_intersect_key( (array) $count, array_flip( $postStatus ) ) );
      return $this->create_rest_response( [ 'success' => true, 'count' => $count ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_helpers_posts_ids( $request ) {
    try {
      $params = $request->get_query_params();
      $postType = $params['postType'];
      $postStatus = !empty( $params['postStatus'] ) ? explode( ',', $params['postStatus'] ) : [ 'publish' ];
      $posts = get_posts( [
        'posts_per_page' => -1,
        'post_type' => $postType,
        'post_status' => $postStatus,
        'fields' => 'ids'
      ] );
      return $this->create_rest_response( [ 'success' => true, 'postIds' => $posts ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_helpers_post_content( $request ) {
    try {
      $params = $request->get_query_params();
      $offset = (int) $params['offset'];
      $postType = $params['postType'];
      $postStatus = isset( $params['postStatus'] ) ? explode( ',', $params['postStatus'] ) : [ 'publish' ];
      $postId = (int) $params['postId'];

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
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Post not found' ], 404 );
      }
      $cleanPost = $this->core->get_post( $post );
      return $this->create_rest_response( [ 'success' => true, 'content' => $cleanPost['content'],
        'checksum' => $cleanPost['checksum'], 'language' => $cleanPost['language'], 'excerpt' => $cleanPost['excerpt'],
        'postId' => $cleanPost['postId'], 'title' => $cleanPost['title'], 'url' => $cleanPost['url'] ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_helpers_run_tasks( $request ) {
    try {
      do_action( 'mwai_tasks_run' );
      return $this->create_rest_response( [ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_helpers_optimize_database( $request ) {
    try {
      global $wpdb;
      $results = [];
      
      // Add indexes to optimize query performance
      $indexes = [
        // mwai_logs indexes
        [ 'table' => 'mwai_logs', 'name' => 'idx_mwai_logs_time', 'columns' => 'time' ],
        [ 'table' => 'mwai_logs', 'name' => 'idx_mwai_logs_userId', 'columns' => 'userId' ],
        [ 'table' => 'mwai_logs', 'name' => 'idx_mwai_logs_envId', 'columns' => 'envId' ],
        [ 'table' => 'mwai_logs', 'name' => 'idx_mwai_logs_refId', 'columns' => 'refId' ],
        [ 'table' => 'mwai_logs', 'name' => 'idx_mwai_logs_time_model', 'columns' => 'time, model' ],
        
        // mwai_logmeta indexes
        [ 'table' => 'mwai_logmeta', 'name' => 'idx_mwai_logmeta_log_id', 'columns' => 'log_id' ],
        
        // mwai_vectors indexes
        [ 'table' => 'mwai_vectors', 'name' => 'idx_mwai_vectors_envId_status_dbId', 'columns' => 'envId, status, dbId' ],
        [ 'table' => 'mwai_vectors', 'name' => 'idx_mwai_vectors_refId', 'columns' => 'refId' ],
        [ 'table' => 'mwai_vectors', 'name' => 'idx_mwai_vectors_status', 'columns' => 'status' ],
        [ 'table' => 'mwai_vectors', 'name' => 'idx_mwai_vectors_updated', 'columns' => 'updated' ],
        
        // mwai_files indexes
        [ 'table' => 'mwai_files', 'name' => 'idx_mwai_files_expires', 'columns' => 'expires' ],
        [ 'table' => 'mwai_files', 'name' => 'idx_mwai_files_userId', 'columns' => 'userId' ],
        [ 'table' => 'mwai_files', 'name' => 'idx_mwai_files_purpose', 'columns' => 'purpose' ],
        
        // mwai_filemeta indexes
        [ 'table' => 'mwai_filemeta', 'name' => 'idx_mwai_filemeta_file_id', 'columns' => 'file_id' ],
        
        // mwai_chats indexes
        [ 'table' => 'mwai_chats', 'name' => 'idx_mwai_chats_chatId_botId', 'columns' => 'chatId, botId' ],
        [ 'table' => 'mwai_chats', 'name' => 'idx_mwai_chats_chatId_userId', 'columns' => 'chatId, userId' ],
        [ 'table' => 'mwai_chats', 'name' => 'idx_mwai_chats_updated', 'columns' => 'updated' ],
      ];
      
      // Add indexes
      foreach ( $indexes as $index ) {
        $table = $wpdb->prefix . $index['table'];
        $index_name = $index['name'];
        $columns = $index['columns'];
        
        // Check if index already exists
        $existing = $wpdb->get_var( $wpdb->prepare(
          "SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
           WHERE table_schema = %s AND table_name = %s AND index_name = %s",
          DB_NAME, $table, $index_name
        ) );
        
        if ( !$existing ) {
          $wpdb->query( "ALTER TABLE `$table` ADD INDEX `$index_name` ($columns)" );
          $results[] = "Added index $index_name on $table";
        }
      }
      
      // Clean up old logs (older than 3 months)
      $three_months_ago = date( 'Y-m-d H:i:s', strtotime( '-3 months' ) );
      
      // Delete old logs
      $deleted_logs = $wpdb->query( $wpdb->prepare(
        "DELETE FROM {$wpdb->prefix}mwai_logs WHERE time < %s",
        $three_months_ago
      ) );
      $results[] = "Deleted $deleted_logs old log entries";
      
      // Delete orphaned logmeta
      $deleted_logmeta = $wpdb->query(
        "DELETE lm FROM {$wpdb->prefix}mwai_logmeta lm
         LEFT JOIN {$wpdb->prefix}mwai_logs l ON lm.log_id = l.id
         WHERE l.id IS NULL"
      );
      $results[] = "Deleted $deleted_logmeta orphaned logmeta entries";
      
      // Delete old chats (older than 3 months)
      $deleted_chats = $wpdb->query( $wpdb->prepare(
        "DELETE FROM {$wpdb->prefix}mwai_chats WHERE updated < %s",
        $three_months_ago
      ) );
      $results[] = "Deleted $deleted_chats old chat discussions";
      
      // Optimize tables
      $tables = [ 'mwai_logs', 'mwai_logmeta', 'mwai_vectors', 'mwai_files', 'mwai_filemeta', 'mwai_chats' ];
      foreach ( $tables as $table ) {
        $wpdb->query( "OPTIMIZE TABLE {$wpdb->prefix}$table" );
      }
      $results[] = "Optimized all AI Engine tables";
      
      $message = implode( "\n", $results );
      return $this->create_rest_response( [ 'success' => true, 'message' => $message ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_system_templates_get( $request ) {
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
      return $this->create_rest_response( [ 'success' => true, 'templates' => $templates ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_system_templates_save( $request ) {
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
      return $this->create_rest_response( [ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_system_logs_list( $request ) {
    try {
      $params = $request->get_json_params();
      $offset = $params['offset'];
      $limit = $params['limit'];
      $filters = $params['filters'];
      $sort = isset( $params['sort'] ) ? $params['sort'] : null;
      $logs = apply_filters( 'mwai_stats_logs_list', [], $offset, $limit, $filters, $sort );
      return $this->create_rest_response( [ 'success' => true, 'total' => $logs['total'], 'logs' => $logs['rows'] ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_system_logs_delete( $request ) {
    try {
      $params = $request->get_json_params();
      $logIds = $params['logIds'];
      $success = apply_filters( 'mwai_stats_logs_delete', true, $logIds );
      return $this->create_rest_response( [ 'success' => $success ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_system_logs_meta_get( $request ) {
    try {
      $params = $request->get_json_params();
      $logId = $params['logId'];
      $metaKeys = $params['metaKeys'];
      $data = apply_filters( 'mwai_stats_logs_meta', [], $logId, $metaKeys );
      return $this->create_rest_response( [ 'success' => true, 'data' => $data ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_system_logs_activity( $request ) {
    try {
      $params = $request->get_json_params();
      $hours = isset( $params['hours'] ) ? intval( $params['hours'] ) : 24;
      $data = apply_filters( 'mwai_stats_logs_activity', [], $hours );
      return $this->create_rest_response( [ 'success' => true, 'data' => $data ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_system_logs_activity_daily( $request ) {
    try {
      $params = $request->get_json_params();
      $days = isset( $params['days'] ) ? intval( $params['days'] ) : 31;
      $byModel = isset( $params['byModel'] ) ? (bool) $params['byModel'] : false;
      
      if ( $byModel ) {
        $data = apply_filters( 'mwai_stats_logs_activity_daily_by_model', [], $days );
      } else {
        $data = apply_filters( 'mwai_stats_logs_activity_daily', [], $days );
      }
      
      return $this->create_rest_response( [ 'success' => true, 'data' => $data ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_ai_moderate( $request ) {
    try {
      $params = $request->get_json_params();
      $envId = $params['envId'];
      $text = $params['text'];
      if ( !$text ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Text not found.' ], 404 );
      }
      $openai = Meow_MWAI_Engines_Factory::get_openai( $this->core, $envId );
      $results = $openai->moderate( $text );
      return $this->create_rest_response( [ 'success' => true, 'results' => $results ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_ai_transcribe_audio( $request ) {
    try {
      global $mwai;
      $params = $request->get_json_params();
      $url = !empty( $params['url'] ) ? $params['url'] : null;
      $mediaId = isset( $params['mediaId'] ) ? intval( $params['mediaId'] ) : 0;
      $path = !empty( $params['path'] ) ? $params['path'] : null;
      
      // If mediaId is provided, get the file path
      if ( !$path && $mediaId > 0 ) {
        $path = get_attached_file( $mediaId );
        if ( empty( $path ) ) {
          throw new Exception( __( 'The media file cannot be found.', 'ai-engine' ) );
        }
      }
      
      // Set the scope for admin tools
      if ( !isset( $params['scope'] ) ) {
        $params['scope'] = 'admin-tools';
      }
      
      $result = $mwai->simpleTranscribeAudio( $url, $path, $params );
      return $this->create_rest_response( [ 'success' => true, 'data' => $result ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_ai_transcribe_image( $request ) {
    try {
      global $mwai;
      $params = $request->get_json_params();
      $message = $this->retrieve_message( $params );
      $url = !empty( $params['url'] ) ? $params['url'] : null;
      // This could lead to a security issue, so let's avoid using path directly.
      //$path = !empty( $params['path'] ) ? $params['path'] : null;
      $result = $mwai->simpleVisionQuery( $message, $url );
      return $this->create_rest_response( [ 'success' => true, 'data' => $result ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_ai_json( $request ) {
    try {
      global $mwai;
      $params = $request->get_json_params();
      $message = $this->retrieve_message( $params );
      $result = $mwai->simpleJsonQuery( $message );
      return $this->create_rest_response( [ 'success' => true, 'data' => $result ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_mcp_functions( $request ) {
    try {
      // Get all registered MCP tools
      $tools = apply_filters( 'mwai_mcp_tools', [] );

      // Format the response
      $response = [
        'success' => true,
        'count' => count( $tools ),
        'functions' => $tools
      ];

      return $this->create_rest_response( $response, 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_helpers_post_types() {
    try {
      $postTypes = $this->core->get_post_types();
      return $this->create_rest_response( [ 'success' => true, 'postTypes' => $postTypes ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_settings_themes( $request ) {
    try {
      $method = $request->get_method();
      if ( $method === 'GET' ) {
        $themes = $this->core->get_themes();
        return $this->create_rest_response( [ 'success' => true, 'themes' => $themes ], 200 );
      }
      else if ( $method === 'POST' ) {
        $params = $request->get_json_params();
        $themes = $params['themes'];
        $themes = $this->core->update_themes( $themes );
        return $this->create_rest_response( [ 'success' => true, 'themes' => $themes ], 200 );
      }
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_settings_chatbots( $request ) {
    try {
      $method = $request->get_method();
      if ( $method === 'GET' ) {
        $chatbots = $this->core->get_chatbots();
        return $this->create_rest_response( [ 'success' => true, 'chatbots' => $chatbots ], 200 );
      }
      else if ( $method === 'POST' ) {
        $params = $request->get_json_params();
        $chatbots = $params['chatbots'];
        $chatbots = $this->core->update_chatbots( $chatbots );
        return $this->create_rest_response( [ 'success' => true, 'chatbots' => $chatbots ], 200 );
      }
      return $this->create_rest_response( [ 'success' => false, 'message' => 'Method not allowed' ], 405 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  #region Logs

  public function rest_get_logs() {
    $logs = Meow_MWAI_Logging::get();
    return $this->create_rest_response( [ 'success' => true, 'data' => $logs ], 200 );
  }

  public function rest_clear_logs() {
    Meow_MWAI_Logging::clear();
    return $this->create_rest_response( [ 'success' => true ], 200 );
  }

  #endregion

  #region Forms

  public function rest_forms_list( $request ) {
    try {
      $args = [
        'post_type' => 'mwai_form',
        'posts_per_page' => 100,
        'post_status' => 'any',
        'orderby' => 'date',
        'order' => 'DESC'
      ];
      
      $posts = get_posts( $args );
      $forms = array_map( function( $post ) {
        return [
          'id' => $post->ID,
          'title' => $post->post_title,
          'status' => $post->post_status
        ];
      }, $posts );
      
      return $this->create_rest_response( [ 'success' => true, 'forms' => $forms ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_forms_get( $request ) {
    try {
      $id = intval( $request->get_param( 'id' ) );
      if ( !$id ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Invalid form ID' ], 400 );
      }
      
      $post = get_post( $id );
      if ( !$post || $post->post_type !== 'mwai_form' ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Form not found' ], 404 );
      }
      
      $form = [
        'id' => $post->ID,
        'title' => [ 
          'raw' => $post->post_title,
          'rendered' => $post->post_title 
        ],
        'content' => [
          'raw' => $post->post_content,
          'rendered' => $post->post_content
        ],
        'status' => $post->post_status
      ];
      
      return $this->create_rest_response( [ 'success' => true, 'form' => $form ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_forms_create( $request ) {
    try {
      $params = $request->get_json_params();
      $title = isset( $params['title'] ) ? $params['title'] : 'Untitled Form';
      
      $post_data = [
        'post_title' => $title,
        'post_content' => '',
        'post_status' => 'draft',
        'post_type' => 'mwai_form'
      ];
      
      $post_id = wp_insert_post( $post_data );
      
      if ( is_wp_error( $post_id ) ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => $post_id->get_error_message() ], 500 );
      }
      
      $post = get_post( $post_id );
      $form = [
        'id' => $post->ID,
        'title' => [ 
          'raw' => $post->post_title,
          'rendered' => $post->post_title 
        ],
        'status' => $post->post_status
      ];
      
      return $this->create_rest_response( [ 'success' => true, 'form' => $form ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_forms_update( $request ) {
    try {
      $params = $request->get_json_params();
      $id = isset( $params['id'] ) ? intval( $params['id'] ) : 0;
      
      if ( !$id ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Invalid form ID' ], 400 );
      }
      
      $post = get_post( $id );
      if ( !$post || $post->post_type !== 'mwai_form' ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Form not found' ], 404 );
      }
      
      $post_data = [ 'ID' => $id ];
      
      if ( isset( $params['title'] ) ) {
        $post_data['post_title'] = $params['title'];
      }
      
      if ( isset( $params['content'] ) ) {
        $post_data['post_content'] = $params['content'];
      }
      
      if ( isset( $params['status'] ) ) {
        $post_data['post_status'] = $params['status'];
      }
      
      $result = wp_update_post( $post_data );
      
      if ( is_wp_error( $result ) ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => $result->get_error_message() ], 500 );
      }
      
      $post = get_post( $id );
      $form = [
        'id' => $post->ID,
        'title' => [ 
          'raw' => $post->post_title,
          'rendered' => $post->post_title 
        ],
        'content' => [
          'raw' => $post->post_content,
          'rendered' => $post->post_content
        ],
        'status' => $post->post_status
      ];
      
      return $this->create_rest_response( [ 'success' => true, 'form' => $form ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_forms_delete( $request ) {
    try {
      $params = $request->get_json_params();
      $id = isset( $params['id'] ) ? intval( $params['id'] ) : 0;
      
      if ( !$id ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Invalid form ID' ], 400 );
      }
      
      $post = get_post( $id );
      if ( !$post || $post->post_type !== 'mwai_form' ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Form not found' ], 404 );
      }
      
      $result = wp_delete_post( $id, true );
      
      if ( !$result ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Failed to delete form' ], 500 );
      }
      
      return $this->create_rest_response( [ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  #endregion
}
