<?php

class Meow_MWAI_Modules_Tasks {
	private $core = null;
  private $wpdb = null;
	private $namespace = 'mwai-ui/v1';
  private $db_check = false;
  private $table_tasks = null;
  private $table_taskmeta = null;
  private $dev_mode = false;

  public function __construct( $core ) {
		global $wpdb;
    $this->core = $core;
    $this->wpdb = $wpdb;
    $this->dev_mode = $this->core->get_option( 'dev_mode' );
    // $this->table_tasks = $this->wpdb->prefix . 'mwai_tasks';
    // $this->table_taskmeta = $this->wpdb->prefix . 'mwai_taskmeta';
    add_filter( 'cron_schedules', [ $this, 'custom_cron_schedule' ] );
    
    // Let's add a dev mode, to run tasks every 5 seconds
    if ( $this->dev_mode ) {
      if ( !wp_next_scheduled( 'mwai_tasks_internal_dev_run' ) ) {
        wp_schedule_event( time(), 'mwai_5sec', 'mwai_tasks_internal_dev_run' );
      }
      add_action( 'mwai_tasks_internal_dev_run', [ $this, 'run_tasks' ] );
    }
    else {
      if ( !wp_next_scheduled( 'mwai_tasks_internal_run' ) ) {
        wp_schedule_event( time(), 'mwai_5mn', 'mwai_tasks_internal_run' );
      }
      add_action( 'mwai_tasks_internal_run', [ $this, 'run_tasks' ] );
    }
	}

  function custom_cron_schedule( $schedules ) {
    $schedules['mwai_5mn'] = array( 'display' => __( 'Every 5 Minute' ), 'interval' => 300 );
    if ( $this->dev_mode ) {
      $schedules['mwai_5sec'] = array( 'display' => __( 'Every 5 Second' ), 'interval' => 5 );
    }
    return $schedules;
  }

  function run_tasks() {
    do_action( 'mwai_tasks_run' );
  }

  // Later we can create a table for the tasks (and taskmeta) for tasks
  // which has to be ran only once, and then deleted.
}
