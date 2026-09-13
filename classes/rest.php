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
    $message = $params['message'] ?? '';

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

      // The Workspace module registers its own routes only when it is enabled.
      // The mobile apps probe auth-check to explain a failed connection, so
      // keep that one route answering when the module is off: otherwise the
      // app can only say "404" and the user cannot tell that a switch in
      // Settings → Modules is all that is missing.
      // (Not class_exists: the autoloader makes that true whether or not the
      // module was instantiated, so the option is the real switch.)
      if ( !$this->core->get_option( 'module_workspace' ) ) {
        register_rest_route( $this->namespace, '/workspace/auth-check', [
          'methods' => 'GET',
          'permission_callback' => '__return_true',
          'callback' => function () {
            return new WP_REST_Response( [
              'success' => true,
              'reason' => 'module_disabled',
              'message' => 'Workspace is not enabled on this site yet. In WordPress, go to AI Engine → Settings → Modules and enable Workspace, then connect again.',
            ], 200 );
          },
        ] );
      }

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
      register_rest_route( $this->namespace, '/mcp/self_test', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_mcp_self_test' ],
      ] );
      register_rest_route( $this->namespace, '/system/mcp_logs/top_tools', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_settings' ],
        'callback' => [ $this, 'rest_mcp_top_tools' ],
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
      register_rest_route( $this->namespace, '/helpers/update_media_metadata', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_update_media_metadata' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/create_video', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_create_video' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/video_status', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_video_status' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/download_video', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_download_video' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/delete_video', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_delete_video' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/save_video_to_library', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_save_video_to_library' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/delete_video_from_library', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_delete_video_from_library' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/list_draft_media', [
        'methods' => 'GET',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_list_draft_media' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/approve_media', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_approve_media' ],
      ] );
      register_rest_route( $this->namespace, '/helpers/reject_media', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_reject_media' ],
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
      register_rest_route( $this->namespace, '/helpers/check_posts_content', [
        'methods' => 'POST',
        'permission_callback' => [ $this->core, 'can_access_features' ],
        'callback' => [ $this, 'rest_helpers_check_posts_content' ],
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
      // TODO: Remove all the /openai/finetunes/* and /openai/files/finetune routes after 2027-02 (OpenAI ends fine-tune job creation on 2027-01-06).
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
            }
            else if ( $timestamp < time() ) {
              // Genuinely overdue
              $event_info['next_run_human'] = 'Overdue by ' . human_time_diff( time(), $timestamp );
            }
            else {
              // Future scheduled time
              $event_info['next_run_human'] = 'In ' . human_time_diff( time(), $timestamp );
            }
          }
          else {
            // No last run data, use the scheduled timestamp but be conservative about "overdue"
            if ( $timestamp < time() ) {
              // Only show as overdue if it's significantly past due (more than the schedule interval)
              // to avoid false positives for crons that might be running but not tracked
              $time_past_due = time() - $timestamp;
              $interval = isset( $schedules[$schedule]['interval'] ) ? $schedules[$schedule]['interval'] : 3600; // Default 1 hour

              if ( $time_past_due > $interval ) {
                $event_info['next_run_human'] = 'Overdue by ' . human_time_diff( time(), $timestamp );
              }
              else {
                $event_info['next_run_human'] = 'Due to run';
              }
            }
            else {
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

      // Prevent running the Tasks Runner hooks directly - they should only run via cron
      if ( $hook === 'mwai_tasks_internal_run' || $hook === 'mwai_tasks_internal_dev_run' ) {
        return $this->create_rest_response( [
          'success' => false,
          'message' => 'The Tasks Runner cannot be triggered manually. It runs automatically based on its schedule.'
        ], 403 );
      }

      // Check if the hook exists
      if ( !has_action( $hook ) ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Cron hook not found' ], 404 );
      }

      // Run the cron action
      do_action( $hook );

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
      'mwai_files_cleanup' => 'Removes expired files based on expiration dates.',
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

      // The engine reports its own verdict in $result['success']. This used to be
      // hardcoded to true, so anything short of a thrown exception was announced as
      // "Connection successful", including a refused or missing API key.
      $ok = !isset( $result['success'] ) || !empty( $result['success'] );
      $response = [
        'success' => $ok,
        'provider' => $env['type'],
        'name' => $env['name'],
        'data' => $result
      ];
      if ( !$ok ) {
        $reason = $result['error'] ?? __( 'The connection test failed.', 'ai-engine' );
        $response['error'] = $reason;
        // nekoFetch throws on success:false and reads 'message' for the text it shows,
        // so without this the modal only ever says "Unknown error".
        $response['message'] = $reason;
      }

      return $this->create_rest_response( $response, 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [
        'success' => false,
        'error' => $message,
        // Same reason as above: the modal reads 'message', or it shows "Unknown error".
        'message' => $message,
        'provider' => isset( $env ) ? $env['type'] : 'unknown'
      ], 200 ); // Return 200 even on error for consistent modal display
    }
  }

  public function rest_ai_completions( $request ) {
    try {
      // can_access_features is Editor-and-up (and filterable), so the payload is not
      // trusted: inject_params() honours a client-supplied apiKey for every query type,
      // which would run the site's completions against a key of the caller's choosing.
      $params = Meow_MWAI_Core::sanitize_rest_params( $request->get_json_params() );
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
        // Finish the request even if the client disconnects, so usage/credits are
        // still recorded after the stream completes. Otherwise an abort mid-stream
        // kills the script before accounting runs. See chat_submit for details.
        ignore_user_abort( true );
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
      // Same reasoning as rest_ai_completions(): Editor-reachable route, so the
      // client-controlled apiKey override has to leave the array.
      $params = Meow_MWAI_Core::sanitize_rest_params( $request->get_json_params() );
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

      // Ensure params is always an array, and strip the client-controlled keys. Done
      // here rather than at each read above so both the multipart and the JSON branch
      // are covered, and before the debug log so a blocked key is never written to it.
      $params = Meow_MWAI_Core::sanitize_rest_params( $params );

      // Debug logging
      if ( $this->core->get_option( 'queries_debug_mode' ) ) {
        error_log( '[AI Engine Queries] Image Edit Request - Has files: ' . ( !empty( $files ) ? 'yes' : 'no' ) );
        error_log( '[AI Engine Queries] Image Edit Request - Params: ' . json_encode( $params ) );
      }

      $message = $this->retrieve_message( $params );
      $mediaId = intval( $params['mediaId'] ?? $params['media_id'] ?? 0 );
      if ( $mediaId > 0 ) {
        Meow_MWAI_Core::get_readable_attachment_path( $mediaId );
      }
      $query = new Meow_MWAI_Query_EditImage( $message );

      // The inject_params method will handle setting the file from mediaId
      $query->inject_params( $params );

      // Handle mask file if provided
      if ( !empty( $files['mask'] ) ) {
        $mask_file = $files['mask'];
        if ( $mask_file['error'] === UPLOAD_ERR_OK ) {
          $mask_data = file_get_contents( $mask_file['tmp_name'] );
          $query->set_mask( Meow_MWAI_Query_DroppedFile::from_data( $mask_data, 'analysis', $mask_file['type'] ) );
        }
      }

      $reply = $this->core->run_query( $query );
      return $this->create_rest_response( [ 'success' => true, 'data' => $reply->results, 'usage' => $reply->usage ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      $status = $e->getCode() === 403 ? 403 : 500;
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], $status );
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

      // Prepare AI metadata
      $ai_metadata = [];
      if ( !empty( $params['model'] ) ) {
        $ai_metadata['model'] = $params['model'];
      }
      if ( !empty( $params['latency'] ) ) {
        $ai_metadata['latency'] = $params['latency'];
      }
      if ( !empty( $params['env_id'] ) ) {
        $ai_metadata['env_id'] = $params['env_id'];
      }

      // Debug logging
      if ( $this->core->get_option( 'queries_debug_mode' ) ) {
        error_log( '[AI Engine] create_image metadata: ' . json_encode( $ai_metadata ) );
      }

      // Create as mwai_image post type (draft image)
      $attachmentId = $this->core->add_image_from_url( $url, $filename, $title, $description, $caption, $alt, null, 'inherit', 'mwai_image', $ai_metadata );

      // Add to user's draft media
      $user_id = get_current_user_id();
      $draft_media = get_user_meta( $user_id, 'mwai_draft_media', true );
      if ( !is_array( $draft_media ) ) {
        $draft_media = [];
      }
      $draft_media[] = [
        'attachment_id' => $attachmentId,
        'type' => 'image',
        'created_at' => time()
      ];
      update_user_meta( $user_id, 'mwai_draft_media', $draft_media );

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
      $attachment_id = isset( $params['attachmentId'] ) ? intval( $params['attachmentId'] ) : null;

      if ( empty( $attachment_id ) ) {
        throw new Exception( __( 'The attachment ID is required.', 'ai-engine' ) );
      }

      // Get the file path from the attachment ID
      $file_path = get_attached_file( $attachment_id );
      if ( empty( $file_path ) || !file_exists( $file_path ) ) {
        throw new Exception( __( 'Could not find the attachment file.', 'ai-engine' ) );
      }

      $prompt = 'Describe this image and suggest a short title and description. '
      . 'Also suggest an SEO-friendly filename (lowercase, ASCII characters only, with hyphens instead of spaces). '
      . 'Return a JSON with the keys: title, description, filename.';

      // Use file path instead of URL to avoid network issues
      $result = $mwai->simpleVisionQuery( $prompt, null, $file_path, [ 'scope' => 'admin-tools' ] );
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
      $data = array_merge( [ 'title' => '', 'description' => '', 'filename' => '' ], $data );
      return $this->create_rest_response( [ 'success' => true, 'data' => $data ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_helpers_update_media_metadata( $request ) {
    try {
      $params = $request->get_json_params();
      $attachment_id = intval( $params['attachmentId'] );
      $title = sanitize_text_field( $params['title'] ?? '' );
      $description = sanitize_text_field( $params['description'] ?? '' );
      $caption = sanitize_text_field( $params['caption'] ?? '' );
      $alt = sanitize_text_field( $params['alt'] ?? '' );
      $filename = sanitize_file_name( $params['filename'] ?? '' );

      if ( !$attachment_id ) {
        throw new Exception( __( 'Attachment ID is required.', 'ai-engine' ) );
      }

      // Generate slug from filename (without extension)
      $slug = '';
      if ( !empty( $filename ) ) {
        $slug = pathinfo( $filename, PATHINFO_FILENAME );
      }

      // Update post title, content (description), caption, and slug
      $update_data = [
        'ID' => $attachment_id,
        'post_title' => $title,
        'post_content' => $description,
        'post_excerpt' => $caption
      ];

      if ( !empty( $slug ) ) {
        $update_data['post_name'] = $slug;
      }

      wp_update_post( $update_data );

      // Update alt text
      if ( !empty( $alt ) ) {
        update_post_meta( $attachment_id, '_wp_attachment_image_alt', $alt );
      }

      // Update filename if provided
      $new_url = null;
      if ( !empty( $filename ) ) {
        $file_path = get_attached_file( $attachment_id );
        if ( $file_path ) {
          // Security: Validate file extension to prevent arbitrary file upload attacks
          $original_ext = strtolower( pathinfo( $file_path, PATHINFO_EXTENSION ) );
          $new_ext = strtolower( pathinfo( $filename, PATHINFO_EXTENSION ) );

          // Allowlist of safe media extensions (no executable types)
          $allowed_extensions = [
            'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'ico', 'svg', 'avif',
            'mp4', 'webm', 'ogg', 'mov', 'avi', 'wmv', 'flv', 'm4v',
            'mp3', 'wav', 'flac', 'aac', 'm4a', 'wma',
            'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'rtf'
          ];

          // Extension must be in allowlist AND match original extension
          if ( !in_array( $new_ext, $allowed_extensions, true ) ) {
            throw new Exception( __( 'Invalid file extension. Only media file extensions are allowed.', 'ai-engine' ) );
          }
          if ( $new_ext !== $original_ext ) {
            throw new Exception( __( 'File extension must match the original file type.', 'ai-engine' ) );
          }

          $path_parts = pathinfo( $file_path );
          $new_file_path = $path_parts['dirname'] . '/' . $filename;
          if ( rename( $file_path, $new_file_path ) ) {
            update_attached_file( $attachment_id, $new_file_path );
            // Build new URL from file path for custom post types
            $upload_dir = wp_upload_dir();
            $new_url = str_replace( $upload_dir['basedir'], $upload_dir['baseurl'], $new_file_path );
          }
        }
      }

      $response = [ 'success' => true ];
      if ( $new_url ) {
        $response['url'] = $new_url;
      }

      return $this->create_rest_response( $response, 200 );
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

  // TODO: Remove all the rest_openai_*finetune* handlers below after 2027-02 (OpenAI ends fine-tune job creation on 2027-01-06).
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

  /**
   * Term joins mirroring the Sync settings, shared by the Push All count and the
   * Push All id list so the two never disagree.
   *
   * Push All must select exactly what Sync would maintain. Otherwise it seeds the
   * index with posts the lifecycle hooks never update or remove: a site syncing
   * only 'fr' was pushing every language. Semantics match
   * MeowPro_MWAI_Embeddings: an empty list means no filtering, a non-empty one
   * requires at least one match. The joins go before the WHERE clause, so their
   * arguments come first in the prepare() call.
   */
  private function sync_term_joins( $params, &$joinArgs ) {
    global $wpdb;
    $joinArgs = [];
    $joins = '';
    $csv = function ( $key ) use ( $params ) {
      if ( empty( $params[$key] ) ) {
        return [];
      }
      return array_values( array_filter( array_map( 'trim', explode( ',', $params[$key] ) ) ) );
    };
    $termJoin = function ( $alias, $taxonomy, $slugs ) use ( $wpdb, &$joins, &$joinArgs ) {
      $placeholders = implode( ',', array_fill( 0, count( $slugs ), '%s' ) );
      $joins .= " INNER JOIN {$wpdb->term_relationships} tr_{$alias}"
        . " ON tr_{$alias}.object_id = p.ID"
        . " INNER JOIN {$wpdb->term_taxonomy} tt_{$alias}"
        . " ON tt_{$alias}.term_taxonomy_id = tr_{$alias}.term_taxonomy_id"
        . " AND tt_{$alias}.taxonomy = '{$taxonomy}'"
        . " INNER JOIN {$wpdb->terms} t_{$alias}"
        . " ON t_{$alias}.term_id = tt_{$alias}.term_id AND t_{$alias}.slug IN ({$placeholders})";
      $joinArgs = array_merge( $joinArgs, $slugs );
    };
    $postCategories = $csv( 'postCategories' );
    if ( !empty( $postCategories ) ) {
      $termJoin( 'cat', 'category', $postCategories );
    }
    // Polylang stores the language as a 'language' term whose slug is the code,
    // which is what pll_get_post_language() returns. Without Polylang there is
    // nothing to filter on, exactly like is_post_language_synced().
    $postLanguages = $csv( 'postLanguages' );
    if ( !empty( $postLanguages ) && taxonomy_exists( 'language' ) ) {
      $termJoin( 'lang', 'language', $postLanguages );
    }
    return $joins;
  }

  public function rest_helpers_count_posts( $request ) {
    try {
      global $wpdb;
      $params = $request->get_query_params();
      $postType = $params['postType'];
      $postStatus = !empty( $params['postStatus'] ) ? explode( ',', $params['postStatus'] ) : [ 'publish' ];
      $joinArgs = [];
      $joins = $this->sync_term_joins( $params, $joinArgs );
      $statusPlaceholders = implode( ',', array_fill( 0, count( $postStatus ), '%s' ) );
      $ignored_ids = $wpdb->get_col(
        "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = '_mwai_embedding_ignore'"
      );
      $exclude_sql = '';
      if ( !empty( $ignored_ids ) ) {
        $ignored_ids = array_map( 'intval', $ignored_ids );
        $exclude_sql = ' AND p.ID NOT IN (' . implode( ',', $ignored_ids ) . ')';
      }
      $mimeFilter = '';
      if ( $postType === 'attachment' ) {
        $mimeFilter = " AND p.post_mime_type LIKE 'image/%'";
      }
      // COUNT(DISTINCT) because a post matching several joined terms would repeat.
      $query = "SELECT COUNT(DISTINCT p.ID) FROM {$wpdb->posts} p" . $joins . "
                WHERE p.post_type = %s
                AND p.post_status IN ($statusPlaceholders)" . $exclude_sql . $mimeFilter;
      $prepareArgs = array_merge( $joinArgs, [ $postType ], $postStatus );
      $count = (int) $wpdb->get_var( $wpdb->prepare( $query, ...$prepareArgs ) );
      return $this->create_rest_response( [ 'success' => true, 'count' => $count ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_helpers_posts_ids( $request ) {
    try {
      global $wpdb;
      $params = $request->get_query_params();
      $postType = $params['postType'];
      $postStatus = !empty( $params['postStatus'] ) ? explode( ',', $params['postStatus'] ) : [ 'publish' ];
      $joinArgs = [];
      $joins = $this->sync_term_joins( $params, $joinArgs );

      // Use direct SQL query instead of get_posts to avoid memory issues with large sites
      $statusPlaceholders = implode( ',', array_fill( 0, count( $postStatus ), '%s' ) );
      $ignored_ids = $wpdb->get_col(
        "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key = '_mwai_embedding_ignore'"
      );
      $exclude_sql = '';
      if ( !empty( $ignored_ids ) ) {
        $ignored_ids = array_map( 'intval', $ignored_ids );
        $exclude_sql = ' AND p.ID NOT IN (' . implode( ',', $ignored_ids ) . ')';
      }
      $mimeFilter = '';
      if ( $postType === 'attachment' ) {
        $mimeFilter = " AND p.post_mime_type LIKE 'image/%'";
      }
      // DISTINCT because a post matching several of the joined terms would repeat.
      $query = "SELECT DISTINCT p.ID FROM {$wpdb->posts} p" . $joins . "
                WHERE p.post_type = %s
                AND p.post_status IN ($statusPlaceholders)" . $exclude_sql . $mimeFilter . '
                ORDER BY p.ID ASC';

      $prepareArgs = array_merge( $joinArgs, [ $postType ], $postStatus );
      $postIds = $wpdb->get_col( $wpdb->prepare( $query, ...$prepareArgs ) );
      $postIds = array_map( 'intval', $postIds );

      return $this->create_rest_response( [ 'success' => true, 'postIds' => $postIds ], 200 );
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

  // Batch check which posts have content (for Push All optimization)
  public function rest_helpers_check_posts_content( $request ) {
    try {
      $params = $request->get_json_params();
      $postIds = isset( $params['postIds'] ) ? $params['postIds'] : [];

      if ( empty( $postIds ) || !is_array( $postIds ) ) {
        return $this->create_rest_response( [
          'success' => false,
          'message' => 'postIds array is required'
        ], 400 );
      }

      // Sanitize post IDs
      $postIds = array_map( 'intval', $postIds );

      // Check content using the mwai_pre_post_content filter to support page builders,
      // ACF, and other plugins that store content outside of post_content
      $postsWithContent = [];

      foreach ( $postIds as $postId ) {
        $post = get_post( $postId );
        if ( !$post ) {
          continue;
        }
        // Apply the same filter used by get_post_content() in core.php
        $content = apply_filters( 'mwai_pre_post_content', $post->post_content, $postId );
        $content = trim( strip_tags( $content ) );
        if ( !empty( $content ) ) {
          $postsWithContent[] = $postId;
        }
      }

      return $this->create_rest_response( [
        'success' => true,
        'postsWithContent' => $postsWithContent
      ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  public function rest_helpers_run_tasks( $request ) {
    try {
      // Prevent concurrent execution with a transient lock
      $lock_key = 'mwai_rest_run_tasks_lock';
      if ( get_transient( $lock_key ) ) {
        // Log excessive calls for debugging
        if ( $this->core->get_option( 'dev_mode' ) ) {
          error_log( '[AI Engine] WARNING: rest_helpers_run_tasks called while already running' );
        }
        return $this->create_rest_response( [
          'success' => false,
          'message' => 'Tasks are already running. Please wait.'
        ], 429 ); // 429 Too Many Requests
      }

      // Set lock for 30 seconds
      set_transient( $lock_key, true, 30 );

      // Log task execution start
      if ( $this->core->get_option( 'dev_mode' ) ) {
        error_log( '[AI Engine] rest_helpers_run_tasks triggered via REST API' );
      }

      try {
        do_action( 'mwai_tasks_run' );
        delete_transient( $lock_key );
        return $this->create_rest_response( [ 'success' => true ], 200 );
      }
      catch ( Exception $e ) {
        delete_transient( $lock_key );
        throw $e;
      }
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
          'SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS 
           WHERE table_schema = %s AND table_name = %s AND index_name = %s',
          DB_NAME,
          $table,
          $index_name
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
      $results[] = 'Optimized all AI Engine tables';

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
        $templates_option = [];
      }

      // Migration: DALL-E was removed (deprecated by OpenAI). Move templates to the image fallback.
      // TODO: Remove after 2027-04 (1 year after the shutdown on 2026-05-12).
      $deprecated = [ 'dall-e', 'dall-e-2', 'dall-e-3', 'dall-e-3-hd' ];
      $migrated = false;
      foreach ( $templates_option as &$group ) {
        if ( !empty( $group['templates'] ) && is_array( $group['templates'] ) ) {
          foreach ( $group['templates'] as &$template ) {
            if ( isset( $template['model'] ) && in_array( $template['model'], $deprecated, true ) ) {
              $template['model'] = MWAI_FALLBACK_MODEL_IMAGES;
              $migrated = true;
            }
          }
        }
      }
      unset( $group, $template );
      if ( $migrated ) {
        update_option( 'mwai_templates', $templates_option );
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
      $feature = isset( $params['feature'] ) ? sanitize_text_field( $params['feature'] ) : null;

      if ( $byModel ) {
        $data = apply_filters( 'mwai_stats_logs_activity_daily_by_model', [], $days );
      }
      else {
        $data = apply_filters( 'mwai_stats_logs_activity_daily', [], $days, $feature );
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
      // A client-supplied path is deliberately ignored. It used to reach
      // file_get_contents() with only a stream-wrapper blocklist in front of it, so an
      // absolute path or ../ went straight through and the bytes were forwarded to the
      // configured transcription endpoint. On multisite that let a subsite administrator
      // read the network wp-config.php and exfiltrate the auth salts off-host. This is
      // the same class as CVE-2024-38791, which the image handler below already dropped
      // its path for. mediaId stays: it resolves through get_attached_file() on a real
      // attachment instead of an arbitrary string.
      //
      // Dropping the local $path alone was not enough (the 3.6.4 fix, bypassed): $params
      // is forwarded to simpleTranscribeAudio(), whose inject_params() runs before the
      // "URL or path required" guard and repopulates $query->path from $params['path'],
      // which the engine then reads. The key has to leave the array itself.
      $params = Meow_MWAI_Core::sanitize_rest_params( $request->get_json_params() );
      $url = !empty( $params['url'] ) ? $params['url'] : null;
      $mediaId = isset( $params['mediaId'] ) ? intval( $params['mediaId'] ) : 0;
      $path = $mediaId > 0 ? Meow_MWAI_Core::get_readable_attachment_path( $mediaId ) : null;

      // Set the scope for admin tools
      if ( !isset( $params['scope'] ) ) {
        $params['scope'] = 'admin-tools';
      }

      $result = $mwai->simpleTranscribeAudio( $url, $path, $params );
      return $this->create_rest_response( [ 'success' => true, 'data' => $result ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      $status = $e->getCode() === 403 ? 403 : 500;
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], $status );
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
      // Get all registered MCP tools. Handlers key entries by tool name, so the
      // array is associative; array_values() forces a JSON array (not an object)
      // for the client, which groups them with functions.reduce().
      $tools = array_values( apply_filters( 'mwai_mcp_tools', [] ) );

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

  /**
   * Loopback test that mimics the way Anthropic's claude.ai connector reaches
   * the site, so admins can detect a hosting-layer block without waiting until
   * they try to connect from claude.ai. Two stages, because WAFs filter them
   * independently and real tickets showed both patterns:
   *
   * 1. GET on the OAuth discovery path with the python-httpx User-Agent
   *    (WP Engine's WAF blocks this one).
   * 2. POST on /wp-json/mcp/v1/http, python-httpx vs neutral User-Agent
   *    (Bluehost's mod_security lets discovery GETs through but 403s the
   *    POSTs, so OAuth client registration and every MCP call fail while
   *    stage 1 looks fine). Both POSTs are unauthenticated, so WordPress
   *    itself answers them identically: any python-only difference in
   *    status or content type is the firewall talking.
   */
  public function rest_mcp_self_test( $request ) {
    try {
      $resource_url = rest_url( 'mcp/v1/http' );
      $probe_url = home_url( '/.well-known/oauth-protected-resource' . wp_parse_url( $resource_url, PHP_URL_PATH ) );
      $reference_url = rest_url( 'mcp/v1/.well-known/oauth-protected-resource' );

      $args = [
        'timeout' => 10,
        'redirection' => 3,
        'sslverify' => apply_filters( 'mwai_mcp_self_test_sslverify', true ),
        'user-agent' => 'python-httpx/0.28.1',
        'headers' => [
          'Accept' => 'application/json',
        ],
      ];

      $probe_response = wp_remote_get( $probe_url, $args );
      $reference_args = $args;
      $reference_args['user-agent'] = 'AI-Engine-Self-Test/1.0';
      $reference_response = wp_remote_get( $reference_url, $reference_args );

      $build = function ( $url, $response ) {
        if ( is_wp_error( $response ) ) {
          return [
            'url' => $url,
            'reachable' => false,
            'error' => $response->get_error_message(),
            'status' => null,
            'content_type' => null,
          ];
        }
        return [
          'url' => $url,
          'reachable' => true,
          'status' => (int) wp_remote_retrieve_response_code( $response ),
          'content_type' => wp_remote_retrieve_header( $response, 'content-type' ),
        ];
      };

      $probe = $build( $probe_url, $probe_response );
      $reference = $build( $reference_url, $reference_response );

      // Stage 2: the POST pair. An unauthenticated initialize is harmless and
      // never reaches a tool; we only care whether the firewall lets it in.
      $post_body = wp_json_encode( [
        'jsonrpc' => '2.0',
        'id' => 1,
        'method' => 'initialize',
        'params' => [
          'protocolVersion' => '2025-03-26',
          'capabilities' => new stdClass(),
          'clientInfo' => [ 'name' => 'ai-engine-self-test', 'version' => '1.0' ],
        ],
      ] );
      $post_args = [
        'timeout' => 10,
        'redirection' => 3,
        'sslverify' => apply_filters( 'mwai_mcp_self_test_sslverify', true ),
        'user-agent' => 'python-httpx/0.28.1',
        'headers' => [
          'Accept' => 'application/json, text/event-stream',
          'Content-Type' => 'application/json',
        ],
        'body' => $post_body,
      ];
      $post_probe = $build( $resource_url, wp_remote_post( $resource_url, $post_args ) );
      $post_reference_args = $post_args;
      $post_reference_args['user-agent'] = 'AI-Engine-Self-Test/1.0';
      $post_reference = $build( $resource_url, wp_remote_post( $resource_url, $post_reference_args ) );

      // Stage 3: the name the real connector sends. Claude.ai identifies itself as
      // Claude-User, and Cloudflare's AI bot blocking (Security > Bots) matches that
      // name alongside ClaudeBot and GPTBot. A site can pass every python-httpx probe
      // above and still 403 the actual connector, so probe the crawler name too,
      // against the URL the reference has already proven answers fine.
      $ai_args = $reference_args;
      $ai_args['user-agent'] = 'Claude-User/1.0';
      $ai_probe = $build( $reference_url, wp_remote_get( $reference_url, $ai_args ) );
      $ai_blocked = $reference['reachable'] && (
        !$ai_probe['reachable']
        || ( $ai_probe['status'] !== $reference['status']
          && in_array( $ai_probe['status'], [ 403, 406, 418, 429 ], true ) )
      );

      // We run on the server, so we can answer directly what an HTTP probe can only infer:
      // is there a second .htaccess inside .well-known? Apache does not apply the rewrite
      // rules of the root file to a directory carrying its own .htaccess, so a perfectly
      // correct rule in the main file sits there doing nothing, and the user has no way to
      // see why. Hosts create that folder for SSL certificate renewals.
      $nested_htaccess = false;
      $wellknown_htaccess = ABSPATH . '.well-known/.htaccess';
      if ( @is_dir( ABSPATH . '.well-known' ) && @is_file( $wellknown_htaccess ) ) {
        $nested_htaccess = $wellknown_htaccess;
      }

      $is_json = function ( $probe ) {
        return $probe['content_type'] && strpos( $probe['content_type'], 'json' ) !== false;
      };
      // The firewall reveals itself by treating the python UA differently from
      // the neutral one: different status, or a block page instead of the JSON
      // that WordPress returns to both unauthenticated POSTs.
      $post_blocked = ( $post_reference['reachable'] && (
        ( !$post_probe['reachable'] )
        || ( $post_probe['status'] !== $post_reference['status'] && in_array( $post_probe['status'], [ 403, 406, 418, 429 ], true ) )
        || ( $is_json( $post_reference ) && !$is_json( $post_probe ) )
      ) );

      // A 404 on discovery has two very different causes, and they need opposite fixes.
      // Either the hosting layer never lets the path reach WordPress, or a page cache
      // stored a 404 from a moment when it legitimately was one (the plugin inactive,
      // mid-update) and now serves that hit forever. Repeating the request with a
      // throwaway query string separates them: same path, different cache key. If the
      // busted request answers properly, WordPress was always fine and the cache is the
      // problem. Seen on LiteSpeed, which returns x-litespeed-cache: hit on the stale
      // 404 while honouring our no-cache headers on the fresh response.
      $cache_probe = null;
      if ( $probe['reachable'] && $probe['status'] === 404 ) {
        $busted_url = add_query_arg( 'mwai_cb', (string) time(), $probe_url );
        $cache_probe = $build( $busted_url, wp_remote_get( $busted_url, $args ) );
      }
      $stale_404_cached = $cache_probe && $cache_probe['reachable'] && $cache_probe['status'] === 200;

      $verdict = 'unknown';
      $message = '';
      if ( $stale_404_cached ) {
        $verdict = 'wellknown_cached_404';
        $message = 'Your OAuth discovery path returns 404, but the same URL with a query string added returns the correct response. That means WordPress is answering fine and a cache is serving an old 404 in front of it, which is why connecting works sometimes and not others. Fix: purge your page cache and your CDN, then exclude /.well-known/ from caching. In LiteSpeed Cache that is Cache > Excludes > Do Not Cache URIs. Without the exclusion it will come back the next time a 404 gets cached.';
      }
      else if ( $probe['reachable'] && $probe['status'] === 403 ) {
        $verdict = 'waf_blocks_python_ua';
        $message = 'Your host returned 403 to a User-Agent containing "python" on the OAuth discovery path. Claude.ai uses python-httpx as its outbound HTTP client, so its connector will fail with "Couldn\'t reach the MCP server". This is a common default on WP Engine. Fix: add a Cloudflare Transform Rule that rewrites the User-Agent for /.well-known/oauth-* and /wp-json/mcp/v1/* paths before the request reaches your origin. See https://meowapps.com/fix-mcp-wordpress-connection for the full recipe.';
      }
      else if ( $probe['reachable'] && $probe['status'] === 404 ) {
        $verdict = 'wellknown_blocked';
        $verdict = $nested_htaccess ? 'wellknown_blocked_nested_htaccess' : 'wellknown_blocked';
        $message = 'Your host returned 404 for the host-root /.well-known/oauth-protected-resource path, so the request never reaches WordPress. ';
        if ( $nested_htaccess ) {
          $message .= 'We found why: there is a second .htaccess inside your .well-known folder, at ' . esc_html( $nested_htaccess ) . '. '
            . 'Apache stops applying the rules from your main .htaccess to a folder that has its own, so any rewrite you add to the main file is ignored for these paths, however correct it is. '
            . 'Your host created that folder for SSL certificate renewals. Fix: rename that file to htaccess-old. Renewals keep working, because those are real files that nothing rewrites.';
        }
        else {
          $message .= 'This usually means your hosting layer (.htaccess, nginx config, or a security plugin) intercepts /.well-known/* paths before WordPress sees them. Adjust rewrites so the path reaches index.php. '
            . 'We checked and there is no .htaccess inside your .well-known folder, so the interception is happening in your server or CDN configuration rather than in a file you can edit. Your host can fix it with one sentence: let /.well-known/* fall through to WordPress.';
        }
      }
      else if ( !$probe['reachable'] ) {
        $verdict = 'unreachable';
        $message = 'The loopback request could not reach the site at all (' . esc_html( $probe['error'] ) . '). Check that the site is publicly resolvable and that the server can reach itself over HTTPS.';
      }
      else if ( $probe['status'] === 200 && $post_blocked ) {
        $verdict = 'waf_blocks_python_post';
        $message = 'OAuth discovery works, but your host blocks POST requests from the python-httpx User-Agent on /wp-json/mcp/v1/*. Claude.ai\'s connector will pass discovery and then fail at client registration ("Couldn\'t register with your sign-in service") or on the first MCP call. This pattern is common with mod_security on shared hosts (seen on Bluehost). Fix: ask your host to whitelist POST requests on the /wp-json/mcp/v1/ path, or add a Cloudflare Transform Rule that rewrites the User-Agent for /.well-known/oauth-* and /wp-json/mcp/v1/* before the request reaches your origin. See https://meowapps.com/fix-mcp-wordpress-connection for the full recipe.';
      }
      else if ( $probe['status'] === 200 ) {
        $verdict = 'ok';
        $message = 'Your site accepts the python-httpx and Claude-User User-Agents on both the OAuth discovery path (GET) and the MCP endpoint (POST). Claude.ai\'s connector should be able to reach it. '
          . 'One caveat: these checks run from your server to itself, and many hosts resolve their own domain straight to the origin, so a block that lives at your CDN can pass here and still refuse the real connector. '
          . 'If connecting still fails, run the same requests from an external machine, and check whether your CDN blocks AI crawlers by name (in Cloudflare: Security > Bots). Blocking AI crawlers also blocks your own connector.';
      }
      else {
        $verdict = 'unexpected_status';
        $message = 'Got HTTP ' . $probe['status'] . ' from the loopback probe. Expected 200. Investigate the response in your CDN/origin logs.';
      }

      // A site that answers on both apex and www advertises only one of them in its OAuth
      // metadata, because everything there is built from home_url(). A user who types the
      // other spelling gets told the resource lives on a different origin than the one they
      // entered, which RFC 9728 requires the client to check, and strict clients stop there
      // with no error the user can see. Cheap to detect, impossible to guess from outside.
      $canonical_host = wp_parse_url( home_url(), PHP_URL_HOST );
      $other_host = $canonical_host && strpos( $canonical_host, 'www.' ) === 0
        ? substr( $canonical_host, 4 ) : 'www.' . $canonical_host;
      $other_probe = null;
      if ( $canonical_host ) {
        $other_url = str_replace( '//' . $canonical_host, '//' . $other_host, $reference_url );
        // Do NOT follow redirects here. A site that correctly sends www to its canonical
        // host would otherwise answer 200 at the end of the redirect and look exactly like
        // a site serving both, which is the opposite of the problem we are looking for.
        // Only a direct 200 on the other spelling means both hosts really serve the site.
        $other_args = $reference_args;
        $other_args['redirection'] = 0;
        $other_probe = $build( $other_url, wp_remote_get( $other_url, $other_args ) );
      }
      if ( $other_probe && $other_probe['reachable'] && $other_probe['status'] === 200 ) {
        $message .= ' Also worth knowing: your site answers on both ' . esc_html( $canonical_host )
          . ' and ' . esc_html( $other_host ) . ', but its OAuth metadata only ever advertises '
          . esc_html( $canonical_host ) . ', because that is your WordPress address. '
          . 'Connect your client using exactly that spelling, otherwise it is told the server lives somewhere else and may refuse without explaining why.';
      }

      // Reported on top of whatever else is wrong, because it is a separate blocker with a
      // separate fix: a site can have perfect discovery and still refuse the connector.
      if ( $ai_blocked ) {
        $ai_message = 'Your site answers the OAuth discovery URL normally to a neutral User-Agent but returns HTTP '
          . ( $ai_probe['reachable'] ? $ai_probe['status'] : 'no response' )
          . ' to "Claude-User". That is the name Claude.ai\'s connector sends, so it will be refused even once everything else works. '
          . 'The usual cause is Cloudflare\'s AI bot blocking (Security > Bots), which matches Claude-User, ClaudeBot and GPTBot. '
          . 'Fix: turn that off, or add a skip rule covering /.well-known/oauth-* and /wp-json/mcp/v1/*. '
          . 'Note that blocking AI crawlers also blocks your own connector.';
        if ( $verdict === 'ok' ) {
          $verdict = 'waf_blocks_ai_ua';
          $message = $ai_message;
        }
        else {
          $message .= ' ' . $ai_message;
        }
      }

      return $this->create_rest_response( [
        'success' => true,
        'verdict' => $verdict,
        'message' => $message,
        'probe' => $probe,
        'reference' => $reference,
        'post_probe' => $post_probe,
        'post_reference' => $post_reference,
        'ai_probe' => $ai_probe,
        'nested_htaccess' => $nested_htaccess,
        'cache_probe' => $cache_probe,
      ], 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      return $this->create_rest_response( [ 'success' => false, 'message' => $message ], 500 );
    }
  }

  /**
   * Top MCP tools by call count over the last N days. Powers the
   * "Top Tools" widget in the MCP Logs view of the Insights screen.
   * Returns rows shaped as { tool, count, success_count, error_count }.
   */
  public function rest_mcp_top_tools( $request ) {
    try {
      $params = $request->get_json_params();
      $days = isset( $params['days'] ) ? max( 1, intval( $params['days'] ) ) : 7;
      $limit = isset( $params['limit'] ) ? max( 1, min( 50, intval( $params['limit'] ) ) ) : 10;

      global $wpdb;
      $table = $wpdb->prefix . 'mwai_logs';
      $rows = $wpdb->get_results(
        $wpdb->prepare(
          "SELECT scope AS tool,
                  COUNT(*) AS count,
                  SUM(CASE WHEN stats LIKE %s THEN 1 ELSE 0 END) AS success_count,
                  SUM(CASE WHEN stats LIKE %s THEN 1 ELSE 0 END) AS error_count
           FROM $table
           WHERE feature = 'mcp_tool'
             AND time >= DATE_SUB(NOW(), INTERVAL %d DAY)
           GROUP BY scope
           ORDER BY count DESC
           LIMIT %d",
          '%"status":"success"%',
          '%"status":"error"%',
          $days,
          $limit
        ),
        ARRAY_A
      );

      foreach ( $rows as &$row ) {
        $row['count'] = (int) $row['count'];
        $row['success_count'] = (int) $row['success_count'];
        $row['error_count'] = (int) $row['error_count'];
      }
      unset( $row );

      return $this->create_rest_response( [ 'success' => true, 'tools' => $rows ?: [] ], 200 );
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
      $forms = array_map( function ( $post ) {
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

      // wp_insert_post expects slashed data - it calls wp_unslash() internally, which would
      // otherwise strip backslashes from block-comment JSON escapes (e.g. \n → n) and corrupt
      // the stored blocks.
      $post_data = wp_slash( [
        'post_title' => $title,
        'post_content' => '',
        'post_status' => 'draft',
        'post_type' => 'mwai_form'
      ] );

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

      // wp_update_post expects slashed data - it calls wp_unslash() internally, which would
      // otherwise strip backslashes from block-comment JSON escapes (e.g. \n → n) and break
      // Gutenberg blocks on reload.
      $result = wp_update_post( wp_slash( $post_data ) );

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

  #region Video Generation Helpers

  public function rest_helpers_create_video( $request ) {
    try {
      $params = $request->get_json_params();
      $prompt = sanitize_text_field( $params['prompt'] );
      $model = sanitize_text_field( $params['model'] ?? 'sora-2' );
      $size = sanitize_text_field( $params['size'] ?? '720x1280' );
      $seconds = absint( $params['seconds'] ?? 4 );
      $envId = sanitize_text_field( $params['envId'] ?? '' );

      // Check if envId is provided (defaults not supported for videos yet)
      if ( empty( $envId ) ) {
        throw new Exception( 'Please select a specific environment and model in the Video Generator. Default environments are not yet supported for video generation.' );
      }

      // Get API key from environment
      $env = $this->core->get_ai_env( $envId );
      $api_key = $env['apikey'] ?? '';

      if ( empty( $api_key ) ) {
        throw new Exception( 'OpenAI API key not found.' );
      }

      // Prepare multipart boundary
      $boundary = wp_generate_password( 24, false );
      $body = '';

      // Add model
      $body .= "--{$boundary}\r\n";
      $body .= "Content-Disposition: form-data; name=\"model\"\r\n\r\n";
      $body .= "{$model}\r\n";

      // Add prompt
      $body .= "--{$boundary}\r\n";
      $body .= "Content-Disposition: form-data; name=\"prompt\"\r\n\r\n";
      $body .= "{$prompt}\r\n";

      // Add size
      $body .= "--{$boundary}\r\n";
      $body .= "Content-Disposition: form-data; name=\"size\"\r\n\r\n";
      $body .= "{$size}\r\n";

      // Add seconds
      $body .= "--{$boundary}\r\n";
      $body .= "Content-Disposition: form-data; name=\"seconds\"\r\n\r\n";
      $body .= "{$seconds}\r\n";

      $body .= "--{$boundary}--\r\n";

      // Call OpenAI API to create video
      $response = wp_remote_post( 'https://api.openai.com/v1/videos', [
        'headers' => [
          'Authorization' => 'Bearer ' . $api_key,
          'Content-Type' => 'multipart/form-data; boundary=' . $boundary
        ],
        'body' => $body,
        'timeout' => 30
      ] );

      if ( is_wp_error( $response ) ) {
        throw new Exception( $response->get_error_message() );
      }

      $response_body = json_decode( wp_remote_retrieve_body( $response ), true );

      if ( isset( $response_body['error'] ) ) {
        throw new Exception( $response_body['error']['message'] ?? 'Unknown error' );
      }

      // Record usage (price is calculated per second)
      $usage = $this->core->record_videos_usage( $model, $size, $seconds );

      // Log to Query Logs (Statistics)
      try {
        if ( class_exists( 'MeowPro_MWAI_Stats' ) && class_exists( 'MeowPro_MWAI_Statistics' ) ) {
          $statsObject = new MeowPro_MWAI_Stats();
          $statsObject->session = $params['session'] ?? null;
          $statsObject->scope = 'admin-tools';
          $statsObject->feature = 'video-generator';
          $statsObject->model = $model;
          $statsObject->envId = $envId;
          $statsObject->units = $seconds;
          $statsObject->type = 'seconds';
          $statsObject->price = $usage['price'] ?? 0;
          $statsObject->accuracy = $usage['accuracy'] ?? 'full';

          $statistics = new MeowPro_MWAI_Statistics();
          $statistics->commit_stats( $statsObject );
        }
      }
      catch ( Exception $statsError ) {
        // Log the error but don't fail the video creation
        error_log( '[AI Engine Video] Failed to log statistics: ' . $statsError->getMessage() );
      }

      // Store metadata for later retrieval when video completes
      if ( isset( $response_body['id'] ) ) {
        set_transient( 'mwai_video_metadata_' . $response_body['id'], [
          'model' => $model,
          'env_id' => $envId,
          'created_at' => time()
        ], 7 * DAY_IN_SECONDS );
      }

      return $this->create_rest_response( [ 'success' => true, 'video' => $response_body, 'usage' => $usage ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_helpers_video_status( $request ) {
    try {
      $params = $request->get_json_params();
      $video_ids = $params['videoIds'] ?? [];
      $envId = sanitize_text_field( $params['envId'] ?? '' );

      if ( empty( $video_ids ) ) {
        return $this->create_rest_response( [ 'success' => true, 'videos' => [] ], 200 );
      }

      // Get API key from environment
      $env = $this->core->get_ai_env( $envId );
      $api_key = $env['apikey'] ?? '';

      if ( empty( $api_key ) ) {
        throw new Exception( 'OpenAI API key not found.' );
      }

      $videos = [];
      foreach ( $video_ids as $video_id ) {
        $response = wp_remote_get( 'https://api.openai.com/v1/videos/' . $video_id, [
          'headers' => [
            'Authorization' => 'Bearer ' . $api_key
          ],
          'timeout' => 15
        ] );

        if ( !is_wp_error( $response ) ) {
          $body = json_decode( wp_remote_retrieve_body( $response ), true );
          if ( !isset( $body['error'] ) ) {
            // If video is completed and we haven't saved it yet, download and save to media library
            if ( $body['status'] === 'completed' && empty( get_transient( 'mwai_video_saved_' . $video_id ) ) ) {
              // Retrieve metadata that was stored when video was created
              $metadata = get_transient( 'mwai_video_metadata_' . $video_id );
              $ai_metadata = [];
              if ( $metadata ) {
                $ai_metadata = [
                  'model' => $metadata['model'] ?? null,
                  'env_id' => $metadata['env_id'] ?? null,
                  'latency' => isset( $metadata['created_at'] ) ? ( time() - $metadata['created_at'] ) : null
                ];
              }

              $attachment_id = $this->download_and_save_video( $video_id, $api_key, '', '', $ai_metadata );
              if ( $attachment_id ) {
                $body['attachment_id'] = $attachment_id;
                // Build URL from file path for custom post types
                $file_path = get_attached_file( $attachment_id );
                $upload_dir = wp_upload_dir();
                $body['url'] = str_replace( $upload_dir['basedir'], $upload_dir['baseurl'], $file_path );
                // Mark as saved so we don't download again
                set_transient( 'mwai_video_saved_' . $video_id, $attachment_id, DAY_IN_SECONDS );
                // Clean up metadata transient
                delete_transient( 'mwai_video_metadata_' . $video_id );
              }
            }
            // Check if we already have this video saved
            else if ( $body['status'] === 'completed' ) {
              $attachment_id = get_transient( 'mwai_video_saved_' . $video_id );
              if ( $attachment_id ) {
                $body['attachment_id'] = $attachment_id;
                // Build URL from file path for custom post types
                $file_path = get_attached_file( $attachment_id );
                $upload_dir = wp_upload_dir();
                $body['url'] = str_replace( $upload_dir['basedir'], $upload_dir['baseurl'], $file_path );
              }
            }
            $videos[] = $body;
          }
          else {
            // Include error information in the response
            error_log( 'AI Engine: Video generation failed for ID ' . $video_id . ': ' . json_encode( $body['error'] ) );
            $videos[] = [
              'id' => $video_id,
              'status' => 'failed',
              'error' => $body['error']
            ];
          }
        }
        else {
          // WP HTTP error
          error_log( 'AI Engine: Failed to check video status for ID ' . $video_id . ': ' . $response->get_error_message() );
          $videos[] = [
            'id' => $video_id,
            'status' => 'failed',
            'error' => [ 'message' => $response->get_error_message() ]
          ];
        }
      }

      return $this->create_rest_response( [ 'success' => true, 'videos' => $videos ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_helpers_download_video( $request ) {
    try {
      $params = $request->get_json_params();
      $video_id = sanitize_text_field( $params['videoId'] );
      $envId = sanitize_text_field( $params['envId'] ?? '' );

      // Get API key from environment
      $env = $this->core->get_ai_env( $envId );
      $api_key = $env['apikey'] ?? '';

      if ( empty( $api_key ) ) {
        throw new Exception( 'OpenAI API key not found.' );
      }

      $temp_file = wp_tempnam( $video_id . '.mp4' );

      $response = wp_remote_get( 'https://api.openai.com/v1/videos/' . $video_id . '/content', [
        'headers' => [
          'Authorization' => 'Bearer ' . $api_key
        ],
        'timeout' => 120,
        'stream' => true,
        'filename' => $temp_file
      ] );

      if ( is_wp_error( $response ) ) {
        throw new Exception( $response->get_error_message() );
      }

      $file_data = file_get_contents( $temp_file );
      $base64 = base64_encode( $file_data );

      unlink( $temp_file );

      return $this->create_rest_response( [
        'success' => true,
        'data' => $base64,
        'mimeType' => 'video/mp4'
      ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_helpers_delete_video( $request ) {
    try {
      $params = $request->get_json_params();
      $video_id = sanitize_text_field( $params['videoId'] );
      $envId = sanitize_text_field( $params['envId'] ?? '' );

      // Get API key from environment
      $env = $this->core->get_ai_env( $envId );
      $api_key = $env['apikey'] ?? '';

      if ( empty( $api_key ) ) {
        throw new Exception( 'OpenAI API key not found.' );
      }

      $response = wp_remote_request( 'https://api.openai.com/v1/videos/' . $video_id, [
        'method' => 'DELETE',
        'headers' => [
          'Authorization' => 'Bearer ' . $api_key
        ],
        'timeout' => 15
      ] );

      if ( is_wp_error( $response ) ) {
        throw new Exception( $response->get_error_message() );
      }

      return $this->create_rest_response( [ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  private function download_and_save_video( $video_id, $api_key, $title = '', $description = '', $ai_metadata = [] ) {
    try {
      // Download video content
      $response = wp_remote_get( 'https://api.openai.com/v1/videos/' . $video_id . '/content', [
        'headers' => [
          'Authorization' => 'Bearer ' . $api_key
        ],
        'timeout' => 120
      ] );

      if ( is_wp_error( $response ) ) {
        error_log( 'Error downloading video: ' . $response->get_error_message() );
        return false;
      }

      $video_data = wp_remote_retrieve_body( $response );
      if ( empty( $video_data ) ) {
        error_log( 'Empty video data received' );
        return false;
      }

      // Generate filename
      $filename = $video_id . '.mp4';
      $upload_dir = wp_upload_dir();
      $file_path = $upload_dir['path'] . '/' . $filename;

      // Save to file
      file_put_contents( $file_path, $video_data );

      // Prepare attachment data - use mwai_video post type (draft video)
      $attachment = [
        'post_mime_type' => 'video/mp4',
        'post_title' => !empty( $title ) ? $title : 'AI Generated Video',
        'post_content' => $description,
        'post_status' => 'inherit',
        'post_type' => 'mwai_video'
      ];

      // Use wp_insert_post instead of wp_insert_attachment to allow custom post types
      $attachment_id = wp_insert_post( $attachment );

      // Set the attached file manually since we're not using wp_insert_attachment
      update_attached_file( $attachment_id, $file_path );

      if ( is_wp_error( $attachment_id ) ) {
        error_log( 'Error creating attachment: ' . $attachment_id->get_error_message() );
        return false;
      }

      // Generate attachment metadata
      require_once ABSPATH . 'wp-admin/includes/image.php';
      $attach_data = wp_generate_attachment_metadata( $attachment_id, $file_path );
      wp_update_attachment_metadata( $attachment_id, $attach_data );

      // Store AI-related metadata
      if ( !empty( $ai_metadata['model'] ) ) {
        update_post_meta( $attachment_id, 'mwai_model', sanitize_text_field( $ai_metadata['model'] ) );
      }
      if ( !empty( $ai_metadata['latency'] ) ) {
        update_post_meta( $attachment_id, 'mwai_latency', floatval( $ai_metadata['latency'] ) );
      }
      if ( !empty( $ai_metadata['env_id'] ) ) {
        update_post_meta( $attachment_id, 'mwai_env_id', sanitize_text_field( $ai_metadata['env_id'] ) );
      }

      // Add to user's draft media
      $user_id = get_current_user_id();
      $draft_media = get_user_meta( $user_id, 'mwai_draft_media', true );
      if ( !is_array( $draft_media ) ) {
        $draft_media = [];
      }
      $draft_media[] = [
        'attachment_id' => $attachment_id,
        'type' => 'video',
        'openai_id' => $video_id,
        'created_at' => time()
      ];
      update_user_meta( $user_id, 'mwai_draft_media', $draft_media );

      return $attachment_id;
    }
    catch ( Exception $e ) {
      error_log( 'Exception in download_and_save_video: ' . $e->getMessage() );
      return false;
    }
  }

  public function rest_helpers_save_video_to_library( $request ) {
    try {
      $params = $request->get_json_params();
      $video_id = sanitize_text_field( $params['videoId'] );
      $title = sanitize_text_field( $params['title'] );
      $description = sanitize_text_field( $params['description'] );
      $filename = sanitize_file_name( $params['filename'] );
      $envId = sanitize_text_field( $params['envId'] ?? '' );

      // Ensure filename has .mp4 extension
      if ( !preg_match( '/\.mp4$/i', $filename ) ) {
        $filename .= '.mp4';
      }

      // Get API key from environment
      $env = $this->core->get_ai_env( $envId );
      $api_key = $env['apikey'] ?? '';

      if ( empty( $api_key ) ) {
        throw new Exception( 'OpenAI API key not found.' );
      }

      // Download video content
      $response = wp_remote_get( 'https://api.openai.com/v1/videos/' . $video_id . '/content', [
        'headers' => [
          'Authorization' => 'Bearer ' . $api_key
        ],
        'timeout' => 120
      ] );

      if ( is_wp_error( $response ) ) {
        throw new Exception( $response->get_error_message() );
      }

      $video_data = wp_remote_retrieve_body( $response );

      // Upload to WordPress media library
      $upload_dir = wp_upload_dir();
      $file_path = $upload_dir['path'] . '/' . $filename;

      file_put_contents( $file_path, $video_data );

      $attachment = [
        'post_mime_type' => 'video/mp4',
        'post_title' => $title,
        'post_content' => $description,
        'post_status' => 'inherit'
      ];

      $attach_id = wp_insert_attachment( $attachment, $file_path );

      require_once( ABSPATH . 'wp-admin/includes/image.php' );
      $attach_data = wp_generate_attachment_metadata( $attach_id, $file_path );
      wp_update_attachment_metadata( $attach_id, $attach_data );

      return $this->create_rest_response( [
        'success' => true,
        'attachmentId' => $attach_id
      ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_helpers_delete_video_from_library( $request ) {
    try {
      $params = $request->get_json_params();
      $attachment_id = absint( $params['attachmentId'] );

      if ( empty( $attachment_id ) ) {
        throw new Exception( 'Attachment ID is required.' );
      }

      $deleted = wp_delete_attachment( $attachment_id, true );

      if ( !$deleted ) {
        throw new Exception( 'Failed to delete attachment.' );
      }

      return $this->create_rest_response( [ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_helpers_list_draft_media( $request ) {
    try {
      $type = $request->get_param( 'type' ); // 'image', 'video', or null for all
      $user_id = get_current_user_id();
      $draft_media = get_user_meta( $user_id, 'mwai_draft_media', true );

      if ( !is_array( $draft_media ) ) {
        return $this->create_rest_response( [ 'success' => true, 'media' => [] ], 200 );
      }

      $media_items = [];
      foreach ( $draft_media as $item ) {
        // Filter by type if specified
        if ( $type && $item['type'] !== $type ) {
          continue;
        }

        $attachment_id = $item['attachment_id'];
        $attachment = get_post( $attachment_id );

        if ( $attachment ) {
          // For custom post types (mwai_image, mwai_video), build URL from file path
          $file_path = get_attached_file( $attachment_id );
          $upload_dir = wp_upload_dir();
          $url = str_replace( $upload_dir['basedir'], $upload_dir['baseurl'], $file_path );

          $model = get_post_meta( $attachment_id, 'mwai_model', true );
          $generation_time = get_post_meta( $attachment_id, 'mwai_latency', true );
          $env_id = get_post_meta( $attachment_id, 'mwai_env_id', true );

          // Debug logging
          if ( $this->core->get_option( 'queries_debug_mode' ) ) {
            error_log( '[AI Engine] list_draft_media - attachment_id: ' . $attachment_id . ' model: ' . var_export( $model, true ) . ' generation_time: ' . var_export( $generation_time, true ) . ' env_id: ' . var_export( $env_id, true ) );
          }

          $media_items[] = [
            'attachment_id' => $attachment_id,
            'type' => $item['type'],
            'openai_id' => $item['openai_id'] ?? null,
            'url' => $url,
            'title' => $attachment->post_title,
            'description' => $attachment->post_content,
            'filename' => basename( $file_path ),
            'created_at' => $item['created_at'],
            'model' => $model,
            'generation_time' => $generation_time,
            'env_id' => $env_id
          ];
        }
      }

      return $this->create_rest_response( [ 'success' => true, 'media' => $media_items ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_helpers_approve_media( $request ) {
    try {
      $params = $request->get_json_params();
      $attachment_id = absint( $params['attachmentId'] );
      $openai_id = sanitize_text_field( $params['openaiId'] ?? '' );
      $envId = sanitize_text_field( $params['envId'] ?? '' );

      if ( empty( $attachment_id ) ) {
        throw new Exception( 'Attachment ID is required.' );
      }

      // Convert from mwai_image/mwai_video to attachment post type
      wp_update_post( [
        'ID' => $attachment_id,
        'post_type' => 'attachment',
        'post_status' => 'inherit'
      ] );

      // Remove from draft media list
      $user_id = get_current_user_id();
      $draft_media = get_user_meta( $user_id, 'mwai_draft_media', true );
      if ( is_array( $draft_media ) ) {
        $draft_media = array_filter( $draft_media, function ( $item ) use ( $attachment_id ) {
          return $item['attachment_id'] !== $attachment_id;
        } );
        update_user_meta( $user_id, 'mwai_draft_media', array_values( $draft_media ) );
      }

      // Delete video from OpenAI if applicable
      if ( !empty( $openai_id ) ) {
        $env = $this->core->get_ai_env( $envId );
        $api_key = $env['apikey'] ?? '';

        if ( !empty( $api_key ) ) {
          wp_remote_request( 'https://api.openai.com/v1/videos/' . $openai_id, [
            'method' => 'DELETE',
            'headers' => [ 'Authorization' => 'Bearer ' . $api_key ],
            'timeout' => 15
          ] );
        }
      }

      return $this->create_rest_response( [ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_helpers_reject_media( $request ) {
    try {
      $params = $request->get_json_params();
      $attachment_id = absint( $params['attachmentId'] );
      $openai_id = sanitize_text_field( $params['openaiId'] ?? '' );
      $envId = sanitize_text_field( $params['envId'] ?? '' );

      if ( empty( $attachment_id ) ) {
        throw new Exception( 'Attachment ID is required.' );
      }

      // Convert from mwai_image/mwai_video to attachment post type first
      // This ensures wp_delete_attachment properly deletes the physical file
      wp_update_post( [
        'ID' => $attachment_id,
        'post_type' => 'attachment'
      ] );

      // Delete attachment from WordPress (now that it's a proper attachment, files will be deleted)
      wp_delete_attachment( $attachment_id, true );

      // Remove from draft media list
      $user_id = get_current_user_id();
      $draft_media = get_user_meta( $user_id, 'mwai_draft_media', true );
      if ( is_array( $draft_media ) ) {
        $draft_media = array_filter( $draft_media, function ( $item ) use ( $attachment_id ) {
          return $item['attachment_id'] !== $attachment_id;
        } );
        update_user_meta( $user_id, 'mwai_draft_media', array_values( $draft_media ) );
      }

      // Delete video from OpenAI if applicable
      if ( !empty( $openai_id ) ) {
        $env = $this->core->get_ai_env( $envId );
        $api_key = $env['apikey'] ?? '';

        if ( !empty( $api_key ) ) {
          wp_remote_request( 'https://api.openai.com/v1/videos/' . $openai_id, [
            'method' => 'DELETE',
            'headers' => [ 'Authorization' => 'Bearer ' . $api_key ],
            'timeout' => 15
          ] );
        }
      }

      return $this->create_rest_response( [ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  #endregion
}
