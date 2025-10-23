<?php

class Meow_MWAI_Modules_Tasks {
  private $wpdb = null;
  private $core = null;
  public $table_tasks = null;
  public $table_tasklogs = null;
  private $db_check = false;
  private $namespace = 'mwai/v1';
  private $max_tasks_per_tick = 5;
  private $max_retries = 3;

  public function __construct( $core ) {
    global $wpdb;
    $this->wpdb = $wpdb;
    $this->core = $core;
    $this->table_tasks = $wpdb->prefix . 'mwai_tasks';
    $this->table_tasklogs = $wpdb->prefix . 'mwai_tasklogs';

    // Initialize database
    $this->check_db();
    
    // Register REST API
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
    
    // Custom cron schedules - MUST be registered before using them
    add_filter( 'cron_schedules', [ $this, 'custom_cron_schedule' ], 5 );
    
    // Always register the action hooks
    add_action( 'mwai_tasks_internal_run', [ $this, 'tick' ] );
    add_action( 'mwai_tasks_internal_dev_run', [ $this, 'tick' ] );
    
    // Register cleanup tasks handler
    add_filter( 'mwai_task_cleanup_tasks', [ $this, 'handle_cleanup_tasks' ], 10, 2 );
    
    // Migrate existing crons to tasks (only on admin requests to avoid overhead)
    if ( is_admin() ) {
      add_action( 'init', [ $this, 'migrate_existing_crons' ], 20 );
      // Check and fix overdue cron on admin pages
      add_action( 'admin_init', [ $this, 'fix_overdue_cron' ] );
    }
    
    // Schedule crons on init (after custom schedules are registered)
    add_action( 'init', [ $this, 'ensure_cron_scheduled' ], 15 );
    
    // Load the Tasks Examples module (includes test task functionality)
    require_once( __DIR__ . '/tasks-examples.php' );
    new Meow_MWAI_Modules_Tasks_Examples( $core );
  }
  
  /**
   * Ensure cron is scheduled properly
   */
  public function ensure_cron_scheduled() {
    $dev_mode = $this->core->get_option( 'dev_mode' );
    $hook = $dev_mode ? 'mwai_tasks_internal_dev_run' : 'mwai_tasks_internal_run';
    $opposite_hook = $dev_mode ? 'mwai_tasks_internal_run' : 'mwai_tasks_internal_dev_run';
    
    // Clear opposite hook
    wp_clear_scheduled_hook( $opposite_hook );
    
    // Check if current hook is scheduled and not overdue
    $next = wp_next_scheduled( $hook );
    
    // If not scheduled or overdue by more than 5 minutes, reschedule
    if ( !$next || $next < ( time() - 300 ) ) {
      wp_clear_scheduled_hook( $hook );
      
      if ( $dev_mode ) {
        wp_schedule_event( time() + 5, 'five_seconds', $hook );
      } else {
        wp_schedule_event( time() + 60, 'one_minute', $hook );
      }
    }
  }
  
  /**
   * Fix overdue cron events
   */
  public function fix_overdue_cron() {
    $dev_mode = $this->core->get_option( 'dev_mode' );
    
    if ( $dev_mode ) {
      // Clear production cron if it exists
      wp_clear_scheduled_hook( 'mwai_tasks_internal_run' );
      
      // Ensure dev cron is scheduled
      if ( !wp_next_scheduled( 'mwai_tasks_internal_dev_run' ) ) {
        wp_schedule_event( time() + 5, 'five_seconds', 'mwai_tasks_internal_dev_run' );
      }
    }
    else {
      // Clear dev cron if it exists
      wp_clear_scheduled_hook( 'mwai_tasks_internal_dev_run' );
      
      // Ensure production cron is scheduled
      if ( !wp_next_scheduled( 'mwai_tasks_internal_run' ) ) {
        wp_schedule_event( time() + 60, 'one_minute', 'mwai_tasks_internal_run' );
      }
    }
  }

  public function custom_cron_schedule( $schedules ) {
    $schedules['one_minute'] = [ 'display' => __( 'Every Minute' ), 'interval' => 60 ];
    $schedules['five_seconds'] = [ 'display' => __( 'Every 5 Seconds' ), 'interval' => 5 ];
    return $schedules;
  }

  public function rest_api_init() {
    register_rest_route( $this->namespace, '/helpers/tasks_list', [
      'methods' => 'GET',
      'callback' => [ $this, 'rest_tasks_list' ],
      'permission_callback' => [ $this->core, 'can_access_settings' ],
    ] );
    
    register_rest_route( $this->namespace, '/helpers/task_run', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_task_run' ],
      'permission_callback' => [ $this->core, 'can_access_settings' ],
    ] );
    
    register_rest_route( $this->namespace, '/helpers/task_pause', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_task_pause' ],
      'permission_callback' => [ $this->core, 'can_access_settings' ],
    ] );
    
    register_rest_route( $this->namespace, '/helpers/task_resume', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_task_resume' ],
      'permission_callback' => [ $this->core, 'can_access_settings' ],
    ] );
    
    register_rest_route( $this->namespace, '/helpers/task_delete', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_task_delete' ],
      'permission_callback' => [ $this->core, 'can_access_settings' ],
    ] );
    
    register_rest_route( $this->namespace, '/helpers/task_logs', [
      'methods' => 'GET',
      'callback' => [ $this, 'rest_task_logs' ],
      'permission_callback' => [ $this->core, 'can_access_settings' ],
    ] );
    
    register_rest_route( $this->namespace, '/helpers/task_logs_delete', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_task_logs_delete' ],
      'permission_callback' => [ $this->core, 'can_access_settings' ],
    ] );
    
    register_rest_route( $this->namespace, '/helpers/tasks_reset', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_tasks_reset' ],
      'permission_callback' => [ $this->core, 'can_access_settings' ],
    ] );
  }

  /**
   * Ensure a task exists or update its configuration
   */
  public function ensure( $args ) {
    $defaults = [
      'name' => '',
      'description' => '',
      'category' => 'general',
      'schedule' => 'once',
      'next_run' => null,  // Allow specifying when a one-time task should run
      'is_multistep' => 0,
      'expires_at' => null,
      'auto_delete' => 0,
      'deletable' => 1,
      'data' => null,
      'step_name' => null,
    ];
    
    $args = wp_parse_args( $args, $defaults );
    
    if ( empty( $args['name'] ) ) {
      return new WP_Error( 'invalid_name', 'Task name is required' );
    }
    
    // Check if task exists
    $existing = $this->wpdb->get_row( $this->wpdb->prepare(
      "SELECT * FROM {$this->table_tasks} WHERE task_name = %s",
      $args['name']
    ) );
    
    $now = gmdate( 'Y-m-d H:i:s' );
    
    if ( $existing ) {
      // Update existing task
      $update_data = [
        'description' => $args['description'],
        'category' => $args['category'],
        'updated' => $now,
      ];

      // Only update these if they've changed
      if ( $args['schedule'] !== $existing->schedule ) {
        $update_data['schedule'] = $args['schedule'];
        $update_data['next_run'] = $this->calculate_next_run( $args['schedule'] );
      }
      
      if ( $args['expires_at'] !== $existing->expires_at ) {
        $update_data['expires_at'] = $args['expires_at'];
      }
      
      if ( $args['data'] !== null ) {
        $existing_data = json_decode( $existing->data, true ) ?: [];
        $merged_data = array_merge( $existing_data, $args['data'] );
        $update_data['data'] = json_encode( $merged_data );
      }
      
      if ( $args['step_name'] !== null ) {
        $update_data['step_name'] = $args['step_name'];
      }
      
      $result = $this->wpdb->update(
        $this->table_tasks,
        $update_data,
        [ 'task_name' => $args['name'] ]
      );
      
      return $result !== false;
    }
    else {
      // Create new task
      // Use provided next_run for one-time tasks, otherwise calculate from schedule
      if ( $args['schedule'] === 'once' && $args['next_run'] ) {
        $next_run = $args['next_run'];
      } else {
        $next_run = $this->calculate_next_run( $args['schedule'] );
      }
      
      $insert_data = [
        'task_name' => $args['name'],
        'description' => $args['description'],
        'category' => $args['category'],
        'schedule' => $args['schedule'],
        'status' => 'pending',
        'next_run' => $next_run,
        'expires_at' => $args['expires_at'],
        'step' => 0,
        'step_name' => $args['step_name'],
        'step_data' => isset( $args['step_data'] ) ? json_encode( $args['step_data'] ) : null,
        'data' => json_encode( $args['data'] ?: [] ),
        'meta' => json_encode( [] ),
        'error_count' => 0,
        'max_retries' => $this->max_retries,
        'created' => $now,
        'updated' => $now,
      ];
      
      $result = $this->wpdb->insert( $this->table_tasks, $insert_data );
      
      return $result !== false;
    }
  }

  /**
   * Get a specific task by name
   */
  public function get_task( $task_name ) {
    return $this->wpdb->get_row( $this->wpdb->prepare(
      "SELECT * FROM {$this->table_tasks} WHERE task_name = %s",
      $task_name
    ) );
  }

  /**
   * Create a new task directly
   */
  public function create_task( $task_data ) {
    $defaults = [
      'category' => 'general',
      'status' => 'pending', // Changed from 'active' to 'pending' to match tick() selection
      'next_run' => null,
      'expires_at' => null,
      'step' => 0,
      'step_name' => null,
      'step_data' => null,
      'data' => [],
      'meta' => [],
      'error_count' => 0,
      'max_retries' => 3,
      'description' => null
    ];
    
    $task_data = array_merge( $defaults, $task_data );
    $now = gmdate( 'Y-m-d H:i:s' );
    
    // Calculate next run if schedule provided and next_run not set
    if ( !empty( $task_data['schedule'] ) && empty( $task_data['next_run'] ) ) {
      $task_data['next_run'] = $this->calculate_next_run( $task_data['schedule'] );
    }
    
    // Ensure next_run is in proper datetime format if it's a timestamp
    if ( !empty( $task_data['next_run'] ) && is_numeric( $task_data['next_run'] ) ) {
      $task_data['next_run'] = gmdate( 'Y-m-d H:i:s', $task_data['next_run'] );
    }
    
    // If still no next_run, set to now
    if ( empty( $task_data['next_run'] ) ) {
      $task_data['next_run'] = $now;
    }
    
    $insert_data = [
      'task_name' => $task_data['task_name'],
      'description' => $task_data['description'],
      'category' => $task_data['category'],
      'schedule' => $task_data['schedule'],
      'status' => $task_data['status'],
      'next_run' => $task_data['next_run'],
      'expires_at' => $task_data['expires_at'],
      'step' => $task_data['step'],
      'step_name' => $task_data['step_name'],
      'step_data' => is_array( $task_data['step_data'] ) ? json_encode( $task_data['step_data'] ) : $task_data['step_data'],
      'data' => is_array( $task_data['data'] ) ? json_encode( $task_data['data'] ) : $task_data['data'],
      'meta' => is_array( $task_data['meta'] ) ? json_encode( $task_data['meta'] ) : $task_data['meta'],
      'error_count' => $task_data['error_count'],
      'max_retries' => $task_data['max_retries'],
      'created' => $now,
      'updated' => $now,
    ];
    
    return $this->wpdb->insert( $this->table_tasks, $insert_data ) !== false;
  }

  /**
   * Update a task by name
   */
  public function update_task( $task_name, $fields ) {
    $update_data = [ 'updated' => gmdate( 'Y-m-d H:i:s' ) ];
    
    foreach ( $fields as $key => $value ) {
      if ( in_array( $key, [ 'data', 'meta', 'step_data' ] ) && is_array( $value ) ) {
        $update_data[$key] = json_encode( $value );
      } else {
        $update_data[$key] = $value;
      }
    }
    
    return $this->wpdb->update(
      $this->table_tasks,
      $update_data,
      [ 'task_name' => $task_name ]
    ) !== false;
  }

  /**
   * Update task fields
   */
  public function update( $task_name, $fields ) {
    $allowed_fields = [ 'schedule', 'description', 'data', 'expires_at', 'step', 'step_name', 'step_data' ];
    $update_data = [ 'updated' => gmdate( 'Y-m-d H:i:s' ) ];
    
    foreach ( $fields as $key => $value ) {
      if ( in_array( $key, $allowed_fields ) ) {
        if ( $key === 'data' || $key === 'step_data' ) {
          $update_data[$key] = json_encode( $value );
        }
        else if ( $key === 'schedule' ) {
          $update_data[$key] = $value;
          $update_data['next_run'] = $this->calculate_next_run( $value );
        }
        else {
          $update_data[$key] = $value;
        }
      }
    }
    
    $result = $this->wpdb->update(
      $this->table_tasks,
      $update_data,
      [ 'task_name' => $task_name ]
    );
    
    return $result !== false;
  }

  /**
   * Remove a task
   */
  public function remove( $task_name, $opts = [] ) {
    $delete_logs = isset( $opts['delete_logs'] ) ? $opts['delete_logs'] : false;
    
    // Get task ID for logs deletion
    if ( $delete_logs ) {
      $task_id = $this->wpdb->get_var( $this->wpdb->prepare(
        "SELECT id FROM {$this->table_tasks} WHERE task_name = %s",
        $task_name
      ) );
      
      if ( $task_id ) {
        $this->wpdb->delete( $this->table_tasklogs, [ 'task_id' => $task_id ] );
      }
    }
    
    $result = $this->wpdb->delete( $this->table_tasks, [ 'task_name' => $task_name ] );
    
    return $result !== false;
  }

  /**
   * Pause a task
   */
  public function pause( $task_name ) {
    $result = $this->wpdb->update(
      $this->table_tasks,
      [ 'status' => 'paused', 'updated' => gmdate( 'Y-m-d H:i:s' ) ],
      [ 'task_name' => $task_name ]
    );
    
    return $result !== false;
  }

  /**
   * Resume a task
   */
  public function resume( $task_name ) {
    // Get the task to determine schedule
    $task = $this->wpdb->get_row( $this->wpdb->prepare(
      "SELECT * FROM {$this->table_tasks} WHERE task_name = %s",
      $task_name
    ) );
    
    if ( !$task ) {
      return false;
    }
    
    $next_run = $this->calculate_next_run( $task->schedule );
    
    $result = $this->wpdb->update(
      $this->table_tasks,
      [ 
        'status' => 'pending',
        'next_run' => $next_run,
        'updated' => gmdate( 'Y-m-d H:i:s' )
      ],
      [ 'task_name' => $task_name ]
    );
    
    return $result !== false;
  }

  /**
   * Run a task immediately
   */
  public function run_now( $task_name ) {
    // First check if task is stuck and reset it
    $task = $this->wpdb->get_row( $this->wpdb->prepare(
      "SELECT * FROM {$this->table_tasks} WHERE task_name = %s",
      $task_name
    ) );
    
    if ( $task && $task->status === 'running' ) {
      // Reset stuck task - be more aggressive (1 minute instead of 10)
      $this->reset_stuck_tasks( 1 );
    }
    
    $result = $this->wpdb->update(
      $this->table_tasks,
      [ 
        'status' => 'pending',
        'next_run' => gmdate( 'Y-m-d H:i:s' ),
        'updated' => gmdate( 'Y-m-d H:i:s' )
      ],
      [ 'task_name' => $task_name ]
    );
    
    if ( $result !== false ) {
      // Optionally run tick once (but keep it light)
      $this->tick();
      return true;
    }
    
    return false;
  }
  
  /**
   * Reset tasks that are stuck in running state
   */
  public function reset_stuck_tasks( $minutes_threshold = 10 ) {
    $now = gmdate( 'Y-m-d H:i:s' );
    $stuck_cutoff = gmdate( 'Y-m-d H:i:s', strtotime( "-{$minutes_threshold} minutes" ) );
    
    $count = $this->wpdb->query( $this->wpdb->prepare(
      "UPDATE {$this->table_tasks} 
       SET status = 'pending', 
           error_count = error_count + 1,
           updated = %s
       WHERE status = 'running' 
       AND updated < %s",
      $now, $stuck_cutoff
    ) );
    
    return $count;
  }

  /**
   * Main execution loop - called by cron
   */
  public function tick() {
    // Track cron execution for proper "last run" display
    // Determine which hook is actually running
    $dev_mode = $this->core->get_option( 'dev_mode' );
    $hook_name = $dev_mode ? 'mwai_tasks_internal_dev_run' : 'mwai_tasks_internal_run';
    $this->core->track_cron_start( $hook_name );
    
    // Use UTC consistently
    $now = gmdate( 'Y-m-d H:i:s' );
    
    // First, reset any stuck tasks (running for more than 10 minutes)
    $this->reset_stuck_tasks();
    
    // Get due tasks
    $tasks = $this->wpdb->get_results( $this->wpdb->prepare(
      "SELECT * FROM {$this->table_tasks} 
       WHERE status IN ('pending', 'error') 
       AND next_run <= %s 
       AND (expires_at IS NULL OR expires_at > %s)
       ORDER BY next_run ASC
       LIMIT %d",
      $now, $now, $this->max_tasks_per_tick
    ) );
    
    foreach ( $tasks as $task ) {
      $this->execute_task( $task );
    }
    
    // Track cron completion
    $this->core->track_cron_end( $hook_name );
  }

  /**
   * Execute a single task
   */
  private function execute_task( $task ) {
    // Atomically claim the task
    $claimed = $this->wpdb->update(
      $this->table_tasks,
      [ 'status' => 'running', 'updated' => gmdate( 'Y-m-d H:i:s' ) ],
      [ 
        'id' => $task->id,
        'status' => $task->status // Ensure it hasn't changed
      ]
    );
    
    if ( !$claimed ) {
      return; // Another process got it
    }
    
    // Start logging
    $log_id = $this->log_start( $task->id );
    $start_time = microtime( true );
    
    // Build job array
    $job = [
      'name' => $task->task_name,
      'schedule' => $task->schedule,
      'step' => $task->step,
      'step_name' => $task->step_name,
      'data' => json_decode( $task->data, true ) ?: [],
      'meta' => json_decode( $task->meta, true ) ?: [],
    ];
    
    // Call the filter with error handling
    try {
      $result = apply_filters( "mwai_task_{$task->task_name}", null, $job );
      
      // Fallback to generic filter if specific one returns null
      if ( $result === null ) {
        $result = apply_filters( 'mwai_task_run', null, $job );
      }
      
      // Default result if nothing handles it
      if ( $result === null ) {
        $result = [
          'ok' => false,
          'message' => "No handler for '{$task->task_name}'",
        ];
      }
    }
    catch ( Exception $e ) {
      $result = [
        'ok' => false,
        'message' => 'Exception: ' . $e->getMessage(),
      ];
    }
    catch ( Error $e ) {
      $result = [
        'ok' => false,
        'message' => 'Fatal error: ' . $e->getMessage(),
      ];
    }
    
    // Normalize result
    $result = $this->normalize_result( $result );
    
    // Log the end
    $time_taken = microtime( true ) - $start_time;
    $this->log_end( $log_id, $result, $time_taken );
    
    // Update task based on result
    $this->finish_from_result( $task, $result );
  }

  /**
   * Normalize task result
   */
  private function normalize_result( $result ) {
    if ( !is_array( $result ) ) {
      return [
        'ok' => false,
        'message' => 'Invalid result format',
      ];
    }
    
    $defaults = [
      'ok' => false,
      'done' => true,
      'message' => '',
      'step' => null,
      'step_name' => null,
      'data' => null,
      'meta' => null,
    ];
    
    return wp_parse_args( $result, $defaults );
  }

  /**
   * Update task after execution
   */
  private function finish_from_result( $task, $result ) {
    $now_ts = time();
    $now = gmdate( 'Y-m-d H:i:s', $now_ts );
    
    // Merge data and meta if provided
    $data = json_decode( $task->data, true ) ?: [];
    $meta = json_decode( $task->meta, true ) ?: [];
    
    if ( $result['data'] !== null && is_array( $result['data'] ) ) {
      $data = array_merge( $data, $result['data'] );
    }
    
    if ( $result['meta'] !== null && is_array( $result['meta'] ) ) {
      $meta = array_merge( $meta, $result['meta'] );
    }
    
    $update_data = [
      'data' => json_encode( $data ),
      'meta' => json_encode( $meta ),
      'last_run' => $now,
      'updated' => $now,
    ];
    
    // Update step if provided
    if ( $result['step'] !== null ) {
      $update_data['step'] = $result['step'];
    }
    if ( $result['step_name'] !== null ) {
      $update_data['step_name'] = $result['step_name'];
    }
    
    if ( $result['ok'] ) {
      // Success path
      $update_data['error_count'] = 0;
      
      if ( !$result['done'] ) {
        // Multi-step task not finished - continue quickly
        $update_data['status'] = 'pending';
        $update_data['next_run'] = gmdate( 'Y-m-d H:i:s', $now_ts + 10 );
      }
      else if ( $task->schedule === 'once' ) {
        // One-off task completed
        $update_data['status'] = 'done';
        $update_data['next_run'] = null;
      }
      else {
        // Recurring task completed this cycle
        $update_data['status'] = 'pending';
        $update_data['next_run'] = $this->calculate_next_run( $task->schedule, $now_ts );
        $update_data['step'] = 0;
        $update_data['step_name'] = null;
      }
    }
    else {
      // Error path
      $update_data['error_count'] = $task->error_count + 1;
      
      if ( $update_data['error_count'] >= $task->max_retries ) {
        // Max retries reached or exceeded
        $update_data['status'] = 'error';
        $update_data['next_run'] = null;
      }
      else {
        // Retry with backoff
        $update_data['status'] = 'pending';
        $update_data['next_run'] = gmdate( 'Y-m-d H:i:s', $now_ts + 300 ); // 5 minutes
      }
    }
    
    // Check expiration
    if ( $task->expires_at && strtotime( $task->expires_at ) <= $now_ts ) {
      $update_data['status'] = 'expired';
      $update_data['next_run'] = null;
    }
    
    // Update the task
    $this->wpdb->update(
      $this->table_tasks,
      $update_data,
      [ 'id' => $task->id ]
    );
    
    // Auto-delete expired tasks that have an expiration date
    if ( $task->expires_at && $update_data['status'] === 'expired' ) {
      $this->wpdb->delete( $this->table_tasks, [ 'id' => $task->id ] );
      // Also delete logs for expired tasks
      $this->wpdb->delete( $this->table_tasklogs, [ 'task_id' => $task->id ] );
    }
  }

  /**
   * Handle cleanup tasks - remove old logs and failed tasks
   */
  public function handle_cleanup_tasks( $result, $job ) {
    try {
      $now = gmdate( 'Y-m-d H:i:s' );
      $stats = [
        'logs_deleted' => 0,
        'failed_tasks_deleted' => 0,
        'expired_tasks_deleted' => 0,
      ];
      
      // 1. Delete task logs older than 7 days
      $week_ago = gmdate( 'Y-m-d H:i:s', strtotime( '-7 days' ) );
      $logs_deleted = $this->wpdb->query( $this->wpdb->prepare(
        "DELETE FROM {$this->table_tasklogs} WHERE created < %s",
        $week_ago
      ) );
      $stats['logs_deleted'] = $logs_deleted ? $logs_deleted : 0;
      
      // 2. Delete failed tasks that have been in error state for over 30 days
      $month_ago = gmdate( 'Y-m-d H:i:s', strtotime( '-30 days' ) );
      $failed_tasks = $this->wpdb->get_results( $this->wpdb->prepare(
        "SELECT id, task_name FROM {$this->table_tasks} 
         WHERE status = 'error' AND updated < %s",
        $month_ago
      ) );
      
      foreach ( $failed_tasks as $task ) {
        // Delete the task and its logs
        $this->wpdb->delete( $this->table_tasks, [ 'id' => $task->id ] );
        $this->wpdb->delete( $this->table_tasklogs, [ 'task_id' => $task->id ] );
        $stats['failed_tasks_deleted']++;
      }
      
      // 3. Delete expired tasks that have been expired for over 7 days
      $expired_tasks = $this->wpdb->get_results( $this->wpdb->prepare(
        "SELECT id, task_name FROM {$this->table_tasks} 
         WHERE status = 'expired' AND updated < %s",
        $week_ago
      ) );
      
      foreach ( $expired_tasks as $task ) {
        // Delete the task and its logs
        $this->wpdb->delete( $this->table_tasks, [ 'id' => $task->id ] );
        $this->wpdb->delete( $this->table_tasklogs, [ 'task_id' => $task->id ] );
        $stats['expired_tasks_deleted']++;
      }
      
      // 4. Clean up orphaned logs (logs without corresponding tasks)
      $orphaned_logs = $this->wpdb->query(
        "DELETE tl FROM {$this->table_tasklogs} tl
         LEFT JOIN {$this->table_tasks} t ON tl.task_id = t.id
         WHERE t.id IS NULL"
      );
      
      $message = sprintf(
        'Cleaned: %d logs, %d failed tasks, %d expired tasks',
        $stats['logs_deleted'],
        $stats['failed_tasks_deleted'],
        $stats['expired_tasks_deleted']
      );
      
      return [
        'ok' => true,
        'message' => $message,
        'data' => $stats
      ];
      
    } catch ( Exception $e ) {
      return [
        'ok' => false,
        'message' => 'Cleanup failed: ' . $e->getMessage()
      ];
    }
  }

  /**
   * Calculate next run time
   */
  private function calculate_next_run( $schedule, $after_ts = null ) {
    if ( $schedule === 'once' ) {
      // For one-time tasks without a specific time, run immediately
      return gmdate( 'Y-m-d H:i:s' );
    }
    
    if ( $after_ts === null ) {
      $after_ts = time();
    }
    
    $next_ts = $this->cron_next( $schedule, $after_ts );
    return gmdate( 'Y-m-d H:i:s', $next_ts );
  }

  /**
   * Parse cron expression and get next run time
   */
  private function cron_next( $expr, $after_ts ) {
    $parts = $this->parse_cron( $expr );
    if ( !$parts ) {
      // Invalid expression, return next hour
      return $after_ts + 3600;
    }
    
    // Start from the next minute
    $check_ts = $after_ts - ( $after_ts % 60 ) + 60;
    
    // Check up to 2 years in the future (should be more than enough)
    $max_ts = $after_ts + ( 2 * 365 * 24 * 60 * 60 );
    
    while ( $check_ts < $max_ts ) {
      $time = getdate( $check_ts );
      
      if ( $this->cron_matches( $parts, $time ) ) {
        return $check_ts;
      }
      
      // Move to next minute
      $check_ts += 60;
    }
    
    // Fallback to next hour if no match found
    return $after_ts + 3600;
  }

  /**
   * Parse cron expression into parts
   */
  private function parse_cron( $expr ) {
    if ( empty( $expr ) ) {
      return false;
    }
    
    $fields = preg_split( '/\s+/', trim( $expr ) );
    if ( count( $fields ) !== 5 ) {
      return false;
    }
    
    return [
      'minute' => $this->parse_cron_field( $fields[0], 0, 59 ),
      'hour' => $this->parse_cron_field( $fields[1], 0, 23 ),
      'dom' => $this->parse_cron_field( $fields[2], 1, 31 ),
      'month' => $this->parse_cron_field( $fields[3], 1, 12 ),
      'dow' => $this->parse_cron_field( $fields[4], 0, 7 ),
    ];
  }

  /**
   * Parse a single cron field
   */
  private function parse_cron_field( $field, $min, $max ) {
    if ( $field === '*' ) {
      return range( $min, $max );
    }
    
    $values = [];
    
    // Handle step values (*/N)
    if ( strpos( $field, '/' ) !== false ) {
      list( $range, $step ) = explode( '/', $field );
      $step = (int) $step;
      
      if ( $range === '*' ) {
        for ( $i = $min; $i <= $max; $i += $step ) {
          $values[] = $i;
        }
      }
      else if ( strpos( $range, '-' ) !== false ) {
        list( $start, $end ) = explode( '-', $range );
        $start = (int) $start;
        $end = (int) $end;
        for ( $i = $start; $i <= $end && $i <= $max; $i += $step ) {
          $values[] = $i;
        }
      }
      return $values;
    }
    
    // Handle ranges (N-M)
    if ( strpos( $field, '-' ) !== false ) {
      list( $start, $end ) = explode( '-', $field );
      return range( (int) $start, min( (int) $end, $max ) );
    }
    
    // Handle lists (N,M,...)
    if ( strpos( $field, ',' ) !== false ) {
      $parts = explode( ',', $field );
      foreach ( $parts as $part ) {
        $values[] = (int) $part;
      }
      return $values;
    }
    
    // Single value
    return [ (int) $field ];
  }

  /**
   * Check if time matches cron expression
   */
  private function cron_matches( $parts, $time ) {
    // Check minute
    if ( !in_array( (int) $time['minutes'], $parts['minute'] ) ) {
      return false;
    }
    
    // Check hour
    if ( !in_array( (int) $time['hours'], $parts['hour'] ) ) {
      return false;
    }
    
    // Check month
    if ( !in_array( (int) $time['mon'], $parts['month'] ) ) {
      return false;
    }
    
    // Check day of month OR day of week (standard cron behavior)
    $dom_match = in_array( (int) $time['mday'], $parts['dom'] );
    $dow_match = in_array( (int) $time['wday'], $parts['dow'] );
    
    // Handle Sunday as both 0 and 7
    if ( in_array( 7, $parts['dow'] ) && $time['wday'] == 0 ) {
      $dow_match = true;
    }
    
    // If both dom and dow are restricted (*not* wildcards), either can match
    // If one is wildcard, only the restricted one needs to match
    $dom_restricted = !( count( $parts['dom'] ) === 31 );
    $dow_restricted = !( count( $parts['dow'] ) === 8 || count( $parts['dow'] ) === 7 );
    
    if ( $dom_restricted && $dow_restricted ) {
      return $dom_match || $dow_match;
    }
    else if ( $dom_restricted ) {
      return $dom_match;
    }
    else if ( $dow_restricted ) {
      return $dow_match;
    }
    
    return true;
  }

  /**
   * Log task start
   */
  private function log_start( $task_id ) {
    $this->wpdb->insert(
      $this->table_tasklogs,
      [
        'task_id' => $task_id,
        'started' => gmdate( 'Y-m-d H:i:s' ),
        'status' => 'running',
        'created' => gmdate( 'Y-m-d H:i:s' ),
      ]
    );
    
    return $this->wpdb->insert_id;
  }

  /**
   * Log task end
   */
  private function log_end( $log_id, $result, $time_taken = null ) {
    $status = 'error';
    if ( $result['ok'] && $result['done'] ) {
      $status = 'success';
    }
    else if ( $result['ok'] && !$result['done'] ) {
      $status = 'partial';
    }
    
    $this->wpdb->update(
      $this->table_tasklogs,
      [
        'ended' => gmdate( 'Y-m-d H:i:s' ),
        'status' => $status,
        'message' => substr( $result['message'], 0, 255 ),
        'time_taken' => $time_taken,
        'memory_peak' => memory_get_peak_usage(),
        'step' => $result['step'],
      ],
      [ 'id' => $log_id ]
    );
  }

  /**
   * Migrate existing crons to tasks
   * TODO: Remove after January 2026 - This entire migration can be removed
   */
  public function migrate_existing_crons() {
    // Remove old cron hooks that may still exist
    wp_clear_scheduled_hook( 'mwai_discussions' );
    wp_clear_scheduled_hook( 'mwai_files_cleanup' );
    wp_clear_scheduled_hook( 'mwai_files' ); // In case this was used before
    
    // Ensure cleanup_discussions task exists
    $this->ensure( [
      'name' => 'cleanup_discussions',
      'description' => 'Remove old discussions beyond retention period.',
      'category' => 'system',
      'schedule' => '0 3 * * *', // Daily at 3 AM UTC
    ] );

    // Ensure cleanup_files task exists
    $this->ensure( [
      'name' => 'cleanup_files',
      'category' => 'system',
      'description' => 'Delete expired files based on expiration dates.',
      'schedule' => '0 4 * * *', // Daily at 4 AM UTC
    ] );
    
    // Ensure cleanup_tasks exists
    $this->ensure( [
      'name' => 'cleanup_tasks',
      'description' => 'Clean old task logs and failed tasks.',
      'category' => 'system',
      'schedule' => '0 13 * * *', // Daily at 1 PM UTC
      'deletable' => 0, // System task, not deletable
    ] );
  }

  /**
   * REST: List tasks
   */
  public function rest_tasks_list( $request ) {
    // Make sure table exists
    $this->check_db();
    
    $tasks = $this->wpdb->get_results(
      "SELECT * FROM {$this->table_tasks} ORDER BY task_name ASC"
    );
    
    if ( $tasks === false ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Database error', 'tasks' => [] ], 500 );
    }
    
    if ( empty( $tasks ) ) {
      $tasks = [];
    }
    
    // Add computed fields
    foreach ( $tasks as &$task ) {
      $task->data = json_decode( $task->data, true );
      $task->meta = json_decode( $task->meta, true );
      $task->step_data = $task->step_data ? json_decode( $task->step_data, true ) : null;
      
      // Ensure integers are properly cast
      $task->step = (int) $task->step;
      $task->error_count = (int) $task->error_count;
      $task->max_retries = (int) $task->max_retries;
      
      // Fix tasks that should be in error status but aren't
      if ( $task->error_count >= $task->max_retries && $task->status === 'pending' ) {
        $task->status = 'error';
        $task->next_run = null;
      }
      
      // Determine if task is deletable (system tasks cannot be deleted)
      $task->deletable = !in_array( $task->task_name, ['cleanup_discussions', 'cleanup_files'] ) ? 1 : 0;
      
      // Get last message from most recent log
      $last_log = $this->wpdb->get_row( $this->wpdb->prepare(
        "SELECT message FROM {$this->table_tasklogs} WHERE task_id = %d ORDER BY started DESC LIMIT 1",
        $task->id
      ) );
      $task->last_message = $last_log ? $last_log->message : null;
      
      // Get log count for this task
      $log_count = $this->wpdb->get_var( $this->wpdb->prepare(
        "SELECT COUNT(*) FROM {$this->table_tasklogs} WHERE task_id = %d",
        $task->id
      ) );
      $task->log_count = (int) $log_count;
      
      // Calculate next 3 run times for preview
      if ( $task->schedule !== 'once' && $task->status === 'pending' ) {
        $next_runs = [];
        $check_ts = $task->next_run ? strtotime( $task->next_run ) : time();
        
        for ( $i = 0; $i < 3; $i++ ) {
          $check_ts = $this->cron_next( $task->schedule, $check_ts );
          $next_runs[] = gmdate( 'Y-m-d H:i:s', $check_ts );
        }
        
        $task->next_runs_preview = $next_runs;
      }
      else {
        $task->next_runs_preview = [];
      }
      
      // Format times for display
      if ( $task->last_run ) {
        $task->last_run_human = $this->human_time_diff( strtotime( $task->last_run ) );
      }
      else {
        $task->last_run_human = 'Never';
      }
      
      // Only show next_run for tasks that are actually scheduled to run
      // Don't show next_run for error, done, or expired tasks
      if ( $task->next_run && in_array( $task->status, ['pending', 'running', 'paused'] ) ) {
        $task->next_run_human = $this->human_time_diff( strtotime( $task->next_run ) );
      }
      else {
        $task->next_run_human = null;
        $task->next_run = null; // Clear it so frontend doesn't try to display it
      }
    }
    
    return new WP_REST_Response( [ 'success' => true, 'tasks' => $tasks ], 200 );
  }

  /**
   * REST: Run task now
   */
  public function rest_task_run( $request ) {
    $params = $request->get_json_params();
    $task_name = isset( $params['task_name'] ) ? $params['task_name'] : null;
    
    if ( !$task_name ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Task name required' ], 400 );
    }
    
    $result = $this->run_now( $task_name );
    
    if ( $result ) {
      return new WP_REST_Response( [ 'success' => true, 'message' => 'Task scheduled to run' ], 200 );
    }
    
    return new WP_REST_Response( [ 'success' => false, 'message' => 'Failed to run task' ], 500 );
  }

  /**
   * REST: Pause task
   */
  public function rest_task_pause( $request ) {
    $params = $request->get_json_params();
    $task_name = isset( $params['task_name'] ) ? $params['task_name'] : null;
    
    if ( !$task_name ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Task name required' ], 400 );
    }
    
    $result = $this->pause( $task_name );
    
    if ( $result ) {
      return new WP_REST_Response( [ 'success' => true, 'message' => 'Task paused' ], 200 );
    }
    
    return new WP_REST_Response( [ 'success' => false, 'message' => 'Failed to pause task' ], 500 );
  }

  /**
   * REST: Resume task
   */
  public function rest_task_resume( $request ) {
    $params = $request->get_json_params();
    $task_name = isset( $params['task_name'] ) ? $params['task_name'] : null;
    
    if ( !$task_name ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Task name required' ], 400 );
    }
    
    $result = $this->resume( $task_name );
    
    if ( $result ) {
      return new WP_REST_Response( [ 'success' => true, 'message' => 'Task resumed' ], 200 );
    }
    
    return new WP_REST_Response( [ 'success' => false, 'message' => 'Failed to resume task' ], 500 );
  }

  /**
   * REST: Delete task
   */
  public function rest_task_delete( $request ) {
    $params = $request->get_json_params();
    $task_name = isset( $params['task_name'] ) ? $params['task_name'] : null;
    $delete_logs = isset( $params['delete_logs'] ) ? $params['delete_logs'] : true;
    
    if ( !$task_name ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Task name required' ], 400 );
    }
    
    $result = $this->remove( $task_name, [ 'delete_logs' => $delete_logs ] );
    
    if ( $result ) {
      return new WP_REST_Response( [ 'success' => true, 'message' => 'Task deleted' ], 200 );
    }
    
    return new WP_REST_Response( [ 'success' => false, 'message' => 'Failed to delete task' ], 500 );
  }

  /**
   * REST: Get task logs
   */
  public function rest_task_logs( $request ) {
    $task_name = $request->get_param( 'task_name' );
    
    if ( !$task_name ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Task name required' ], 400 );
    }
    
    // Get task ID
    $task_id = $this->wpdb->get_var( $this->wpdb->prepare(
      "SELECT id FROM {$this->table_tasks} WHERE task_name = %s",
      $task_name
    ) );
    
    if ( !$task_id ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Task not found' ], 404 );
    }
    
    // Get logs
    $logs = $this->wpdb->get_results( $this->wpdb->prepare(
      "SELECT * FROM {$this->table_tasklogs} 
       WHERE task_id = %d 
       ORDER BY started DESC 
       LIMIT 50",
      $task_id
    ) );
    
    return new WP_REST_Response( [ 'success' => true, 'logs' => $logs ], 200 );
  }

  /**
   * REST: Delete task logs
   */
  public function rest_task_logs_delete( $request ) {
    $params = $request->get_json_params();
    $task_name = isset( $params['task_name'] ) ? $params['task_name'] : null;
    
    if ( !$task_name ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Task name required' ], 400 );
    }
    
    // Get task ID
    $task_id = $this->wpdb->get_var( $this->wpdb->prepare(
      "SELECT id FROM {$this->table_tasks} WHERE task_name = %s",
      $task_name
    ) );
    
    if ( !$task_id ) {
      return new WP_REST_Response( [ 'success' => false, 'message' => 'Task not found' ], 404 );
    }
    
    // Delete logs for this task
    $result = $this->wpdb->delete(
      $this->table_tasklogs,
      [ 'task_id' => $task_id ],
      [ '%d' ]
    );
    
    if ( $result !== false ) {
      return new WP_REST_Response( [ 'success' => true, 'message' => 'Logs deleted successfully' ], 200 );
    }
    
    return new WP_REST_Response( [ 'success' => false, 'message' => 'Failed to delete logs' ], 500 );
  }

  /**
   * REST: Reset all tasks
   */
  public function rest_tasks_reset( $request ) {
    // Clear all WordPress cron jobs related to tasks
    wp_clear_scheduled_hook( 'mwai_tasks_internal_run' );
    wp_clear_scheduled_hook( 'mwai_tasks_internal_dev_run' );
    
    // Clear all transients
    delete_transient( 'mwai_cron_last_run' );
    delete_transient( 'mwai_cron_running_mwai_tasks_internal_run' );
    delete_transient( 'mwai_cron_running_mwai_tasks_internal_dev_run' );
    
    // Truncate task logs table
    $this->wpdb->query( "TRUNCATE TABLE {$this->table_tasklogs}" );
    
    // Delete all tasks
    $this->wpdb->query( "TRUNCATE TABLE {$this->table_tasks}" );
    
    // Re-initialize the Tasks Runner cron
    $dev_mode = $this->core->get_option( 'dev_mode' );
    if ( $dev_mode ) {
      wp_schedule_event( time() + 5, 'five_seconds', 'mwai_tasks_internal_dev_run' );
    }
    else {
      wp_schedule_event( time() + 60, 'one_minute', 'mwai_tasks_internal_run' );
    }
    
    // Re-create system tasks
    $this->migrate_existing_crons();
    
    return new WP_REST_Response( [ 
      'success' => true, 
      'message' => 'Tasks system has been reset. All tasks and logs have been cleared, and system tasks have been re-created.' 
    ], 200 );
  }

  /**
   * Helper: Human-readable time difference (abbreviated)
   */
  private function human_time_diff( $timestamp ) {
    // Use current time consistently
    $now = time();
    $diff = $timestamp - $now;
    
    if ( $diff < 0 ) {
      // Past
      $diff = abs( $diff );
      $suffix = ' ago';
    }
    else {
      // Future
      $suffix = '';
    }
    
    // Use abbreviated format
    if ( $diff < 60 ) {
      return $diff . 's' . $suffix;
    }
    else if ( $diff < 3600 ) {
      $minutes = round( $diff / 60 );
      return $minutes . 'm' . $suffix;
    }
    else if ( $diff < 86400 ) {
      $hours = round( $diff / 3600 );
      return $hours . 'h' . $suffix;
    }
    else {
      $days = round( $diff / 86400 );
      return $days . 'd' . $suffix;
    }
  }

  /**
   * Check and create database tables
   */
  public function check_db() {
    // Don't run multiple times
    if ( $this->db_check ) {
      return true;
    }
    
    // Check if tables exist
    $tasks_exists = $this->wpdb->get_var( "SHOW TABLES LIKE '$this->table_tasks'" );
    $logs_exists = $this->wpdb->get_var( "SHOW TABLES LIKE '$this->table_tasklogs'" );
    
    if ( !$tasks_exists || !$logs_exists ) {
      $this->create_db();
    }
    
    // Check for database upgrades
    $this->upgrade_db();
    
    $this->db_check = true;
    return true;
  }
  
  /**
   * Upgrade database schema if needed
   */
  private function upgrade_db() {
    // Add category column if it doesn't exist
    $category_exists = $this->wpdb->get_var(
      "SHOW COLUMNS FROM {$this->table_tasks} LIKE 'category'"
    );

    if ( !$category_exists ) {
      $this->wpdb->query(
        "ALTER TABLE {$this->table_tasks}
         ADD COLUMN category VARCHAR(32) NOT NULL DEFAULT 'general' AFTER description"
      );
    }

    // Remove deprecated columns if they exist
    $columns_to_remove = ['auto_delete', 'deletable', 'is_multistep', 'last_message'];

    foreach ( $columns_to_remove as $column ) {
      $column_exists = $this->wpdb->get_var(
        "SHOW COLUMNS FROM {$this->table_tasks} LIKE '$column'"
      );

      if ( $column_exists ) {
        $this->wpdb->query( "ALTER TABLE {$this->table_tasks} DROP COLUMN $column" );
      }
    }

    // Add step_data column if it doesn't exist
    $step_data_exists = $this->wpdb->get_var(
      "SHOW COLUMNS FROM {$this->table_tasks} LIKE 'step_data'"
    );

    if ( !$step_data_exists ) {
      $this->wpdb->query(
        "ALTER TABLE {$this->table_tasks}
         ADD COLUMN step_data LONGTEXT NULL AFTER step_name"
      );
    }
  }

  /**
   * Create database tables
   */
  public function create_db() {
    $charset_collate = $this->wpdb->get_charset_collate();
    
    $sql_tasks = "CREATE TABLE $this->table_tasks (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      task_name VARCHAR(100) NOT NULL,
      description TEXT NULL,
      category VARCHAR(32) NOT NULL DEFAULT 'general',
      schedule VARCHAR(128) NOT NULL,
      status VARCHAR(16) NOT NULL DEFAULT 'pending',
      next_run DATETIME NULL,
      last_run DATETIME NULL,
      expires_at DATETIME NULL,
      step INT NOT NULL DEFAULT 0,
      step_name VARCHAR(64) NULL,
      step_data LONGTEXT NULL,
      data LONGTEXT NULL,
      meta LONGTEXT NULL,
      error_count INT NOT NULL DEFAULT 0,
      max_retries INT NOT NULL DEFAULT 3,
      created DATETIME NOT NULL,
      updated DATETIME NOT NULL,
      PRIMARY KEY (id),
      UNIQUE KEY task_name (task_name),
      KEY status_next (status, next_run),
      KEY category (category),
      KEY expires (expires_at)
    ) $charset_collate;";
    
    $sql_logs = "CREATE TABLE $this->table_tasklogs (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      task_id BIGINT UNSIGNED NOT NULL,
      started DATETIME NOT NULL,
      ended DATETIME NULL,
      status VARCHAR(16) NOT NULL,
      message TEXT NULL,
      time_taken FLOAT NULL,
      memory_peak BIGINT NULL,
      step INT NULL,
      created DATETIME NOT NULL,
      PRIMARY KEY (id),
      KEY task_id_started (task_id, started)
    ) $charset_collate;";
    
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sql_tasks );
    dbDelta( $sql_logs );
  }
}
