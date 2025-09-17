<?php

/**
 * AI Engine Tasks Examples
 * 
 * This class demonstrates how to use the AI Engine Tasks system programmatically.
 * It includes examples of:
 * - Simple recurring tasks (Ping Example)
 * - Multi-step tasks (Chatbot Test)
 * - Task data persistence across runs
 * - Error handling and retry logic
 * 
 * TUTORIAL: How to Create Your Own Tasks
 * 
 * 1. Register your task handler:
 *    add_filter( 'mwai_task_your_task_name', [ $this, 'your_handler' ], 10, 2 );
 * 
 * 2. Create or ensure your task exists:
 *    $this->core->tasks->ensure( [
 *      'name' => 'your_task_name',
 *      'description' => 'What your task does.',
 *      'schedule' => '0 2 * * *',  // Cron expression or 'once'
 *      'next_run' => '2024-12-25 14:00:00',  // Optional: specific time for one-time tasks
 *    ] );
 * 
 * 3. Implement your handler:
 *    public function your_handler( $result, $job ) {
 *      // $job contains: task_name, task_id, data (persistent), step, step_name
 *      // Return: [ 'ok' => true/false, 'message' => 'Status', 'data' => [] ]
 *    }
 * 
 * 4. For multi-step tasks:
 *    - Return 'step' => N to move to next step
 *    - Return 'done' => true when complete
 *    - Data persists across steps automatically
 */
class Meow_MWAI_Modules_Tasks_Examples {
  private $core;
  private $tasks;

  public function __construct( $core ) {
    $this->core = $core;
    // Don't set $this->tasks here as $core->tasks might not be initialized yet
    
    // Always register the test task handlers and REST endpoint
    // These are needed for the test task feature which is now available to all users
    add_filter( 'mwai_task_run', [ $this, 'handle_dynamic_tasks' ], 10, 2 );
    add_action( 'rest_api_init', [ $this, 'register_rest_routes' ] );
    
    // Only initialize example tasks if Dev Mode is enabled
    if ( $this->core->get_option( 'dev_mode' ) ) {
      // Simple recurring task example
      add_action( 'init', [ $this, 'ensure_ping_task' ], 20 );
      add_filter( 'mwai_task_ping_example', [ $this, 'run_ping_task' ], 10, 2 );
    }
  }

  /**
   * Ensure the Ping Task exists when Dev Mode is enabled
   */
  public function ensure_ping_task() {
    if ( !$this->core->tasks ) {
      return;
    }

    // Check if ping task already exists
    $existing_task = $this->core->tasks->get_task( 'ping_example' );
    
    if ( !$existing_task ) {
      // Create the ping task with 5-minute schedule and 6-hour expiry
      $task_data = [
        'task_name' => 'ping_example',
        'category' => 'test',
        'schedule' => '*/5 * * * *', // Every 5 minutes
        'next_run' => date( 'Y-m-d H:i:s', time() + 60 ), // Start in 1 minute (proper format)
        'status' => 'pending', // Changed from 'active' to 'pending' so it can be executed
        'description' => 'Example ping task that runs every 5 minutes (Dev Mode only).',
        'expires_at' => date( 'Y-m-d H:i:s', time() + 6 * 3600 ), // Expires in 6 hours
        'step' => 0,
        'step_name' => null,
        'step_data' => null,
        'error_count' => 0,
        'max_retries' => 3
      ];
      
      $this->core->tasks->create_task( $task_data );
    } else {
      // Update expiry if task exists but Dev Mode was re-enabled
      $new_expiry = date( 'Y-m-d H:i:s', time() + 6 * 3600 );
      if ( $existing_task->expires_at < $new_expiry ) {
        $this->core->tasks->update_task( 'ping_example', [
          'expires_at' => $new_expiry,
          'status' => 'pending' // Changed from 'active' to 'pending'
        ] );
      }
    }
  }

  /**
   * Register REST routes for task examples
   */
  public function register_rest_routes() {
    register_rest_route( 'mwai/v1', '/helpers/task_create_test', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_create_test_task' ],
      'permission_callback' => [ $this->core, 'can_access_settings' ],
    ] );
  }
  
  /**
   * REST: Create a test task for chatbot testing
   * 
   * This creates a multi-step task that:
   * 1. Queries the specified chatbot with a question
   * 2. Stores the response
   * 3. Generates a summary using the default AI
   */
  public function rest_create_test_task( $request ) {
    $chatbot_ids = $request->get_param( 'chatbot_ids' );
    $question = $request->get_param( 'question' );
    
    if ( !$chatbot_ids || empty( $chatbot_ids ) || !$question ) {
      return new WP_REST_Response( [
        'success' => false,
        'message' => 'Chatbot IDs and question are required'
      ], 400 );
    }
    
    // Create a unique task name
    $task_name = 'chatbot_test_' . uniqid();
    
    // Schedule for 1 minute from now
    $next_run = gmdate( 'Y-m-d H:i:s', time() + 60 );
    
    // Create the task
    $chatbot_count = count( $chatbot_ids );
    $created = $this->core->tasks->create_task( [
      'task_name' => $task_name,
      'description' => "Test {$chatbot_count} chatbots: " . substr( $question, 0, 40 ) . '...',
      'category' => 'test',
      'schedule' => 'once',
      'next_run' => $next_run,
      'expires_at' => gmdate( 'Y-m-d H:i:s', time() + 3600 ), // Expire after 1 hour
      'is_multistep' => 1,
      'step' => 0,
      'step_name' => 'Initializing',
      'data' => [
        'chatbot_ids' => $chatbot_ids,
        'current_chatbot_index' => 0,
        'question' => $question,
        'responses' => [],
        'created_at' => gmdate( 'Y-m-d H:i:s' ),
      ],
    ] );
    
    if ( !$created ) {
      return new WP_REST_Response( [
        'success' => false,
        'message' => 'Failed to create test task'
      ], 500 );
    }
    
    return new WP_REST_Response( [
      'success' => true,
      'message' => 'Test task created successfully',
      'task_name' => $task_name,
      'next_run' => $next_run
    ] );
  }
  
  /**
   * Handle dynamic tasks (like chatbot_test_*)
   */
  public function handle_dynamic_tasks( $result, $job ) {
    // Check if this is a chatbot test task
    // Note: The job array uses 'name' not 'task_name'
    if ( strpos( $job['name'], 'chatbot_test_' ) === 0 ) {
      return $this->run_chatbot_test( $result, $job );
    }
    
    // Return null to let other handlers process
    return $result;
  }
  
  /**
   * Execute the multi-step chatbot test task
   * 
   * Step 0: Initialize and prepare
   * Step 1-N: Query each chatbot (one step per chatbot)
   * Final Step: Generate comparison summary
   */
  public function run_chatbot_test( $result, $job ) {
    $data = $job['data'];
    $step = $job['step'];
    
    try {
      $chatbot_ids = $data['chatbot_ids'];
      $chatbot_count = count( $chatbot_ids );
      
      if ( $step == 0 ) {
        // Step 0: Initialize
        return [
          'ok' => true,
          'done' => false,  // Important: Not done yet!
          'message' => "Starting test of {$chatbot_count} chatbots",
          'step' => 1,
          'step_name' => 'Querying chatbot 1 of ' . $chatbot_count,
          'data' => $data
        ];
      }
      else if ( $step <= $chatbot_count ) {
        // Steps 1-N: Query each chatbot
        $chatbot_index = $step - 1;
        $chatbot_id = $chatbot_ids[$chatbot_index];
        $question = $data['question'];
          
          // Use the Simple API to query the chatbot
          // This handles all the chatbot configuration and environment setup automatically
          try {
            // Use the global $mwai object
            global $mwai;
            
            // Use simpleChatbotQuery which handles everything for us
            // Parameters: $botId, $message, $params = [], $onlyReply = true
            $response = $mwai->simpleChatbotQuery( $chatbot_id, $question, [], true );
            
            // Get chatbot name for display
            $chatbots = get_option( 'mwai_chatbots', [] );
            $chatbot_name = 'Chatbot ' . $chatbot_id;
            foreach ( $chatbots as $bot ) {
              $bot_id = isset( $bot['botId'] ) ? $bot['botId'] : ( isset( $bot['id'] ) ? $bot['id'] : null );
              if ( $bot_id === $chatbot_id && isset( $bot['name'] ) ) {
                $chatbot_name = $bot['name'];
                break;
              }
            }
            
            // Store the response
            $data['responses'][] = [
              'chatbot_id' => $chatbot_id,
              'chatbot_name' => $chatbot_name,
              'question' => $question,
              'response' => $response,
              'timestamp' => gmdate( 'Y-m-d H:i:s' ),
              'tokens_used' => 0, // Token usage not available with simple API
            ];
          } catch ( Exception $e ) {
            // If this chatbot fails, log the error but continue with others
            $data['responses'][] = [
              'chatbot_id' => $chatbot_id,
              'chatbot_name' => 'Chatbot ' . $chatbot_id,
              'question' => $question,
              'response' => 'Error: ' . $e->getMessage(),
              'timestamp' => gmdate( 'Y-m-d H:i:s' ),
              'tokens_used' => 0,
            ];
          }
        
        // Move to next chatbot or summary
        $next_step = $step + 1;
        if ( $next_step <= $chatbot_count ) {
          // More chatbots to test
          return [
            'ok' => true,
            'done' => false,  // Important: Not done yet!
            'message' => "Chatbot {$step} of {$chatbot_count} queried",
            'step' => $next_step,
            'step_name' => "Querying chatbot {$next_step} of {$chatbot_count}",
            'data' => $data
          ];
        } else {
          // All chatbots tested, move to summary
          return [
            'ok' => true,
            'done' => false,  // Important: Not done yet!
            'message' => 'All chatbots queried',
            'step' => $next_step,
            'step_name' => 'Generating comparison summary',
            'data' => $data
          ];
        }
      }
      else if ( $step == $chatbot_count + 1 ) {
        // Final Step: Generate comparison summary
          $responses = $data['responses'];
          
        // Build summary prompt
        $summary_prompt = "Compare and analyze these chatbot responses to the same question:\n\n";
        $summary_prompt .= "Question asked: {$responses[0]['question']}\n\n";
        
        foreach ( $responses as $index => $resp ) {
          $num = $index + 1;
          $summary_prompt .= "Chatbot {$num} ({$resp['chatbot_name']}):\n";
          $summary_prompt .= "{$resp['response']}\n\n";
        }
        
        $summary_prompt .= "Provide a brief comparison (3-4 sentences) analyzing:\n";
        $summary_prompt .= "1. Response quality and accuracy\n";
        $summary_prompt .= "2. Tone and style differences\n";
        $summary_prompt .= "3. Which chatbot(s) provided the best response and why";
          
          // Generate summary using default AI
          $summary_query = new Meow_MWAI_Query_Text( $summary_prompt );
          $summary_reply = $this->core->run_query( $summary_query );
          
          $data['summary'] = [
            'analysis' => $summary_reply->result,
            'generated_at' => gmdate( 'Y-m-d H:i:s' ),
          ];
          
        return [
          'ok' => true,
          'message' => 'Test completed successfully',
          'done' => true,
          'data' => $data
        ];
      }
      else {
        return [
          'ok' => false,
          'message' => 'Unknown step: ' . $step
        ];
      }
    } catch ( Exception $e ) {
      return [
        'ok' => false,
        'message' => 'Test failed: ' . $e->getMessage()
      ];
    }
  }

  /**
   * Execute the ping task
   * 
   * This is a simple example of a recurring task that:
   * - Pings a host (google.com)
   * - Tracks response times
   * - Maintains history across runs
   */
  public function run_ping_task( $result, $job ) {
    // Get current data (persisted across runs)
    $data = isset( $job['data'] ) ? $job['data'] : [];
    
    // Initialize or increment run count
    $run_count = isset( $data['run_count'] ) ? $data['run_count'] + 1 : 1;
    
    // Track last 5 ping results
    $ping_history = isset( $data['ping_history'] ) ? $data['ping_history'] : [];
    
    // Perform actual ping to google.com
    $host = 'google.com';
    $start_time = microtime( true );
    
    // Use wp_remote_get with a short timeout to simulate a ping
    $response = wp_remote_get( "https://{$host}", [
      'timeout' => 5,
      'redirection' => 0,
      'sslverify' => false,
    ] );
    
    $end_time = microtime( true );
    $response_time = round( ( $end_time - $start_time ) * 1000, 2 ); // Convert to ms
    
    $ping_result = [
      'timestamp' => date( 'Y-m-d H:i:s' ),
      'host' => $host,
      'response_time_ms' => $response_time,
      'status' => is_wp_error( $response ) ? 'failed' : 'success',
    ];
    
    if ( is_wp_error( $response ) ) {
      $ping_result['error'] = $response->get_error_message();
    } else {
      $ping_result['http_code'] = wp_remote_retrieve_response_code( $response );
    }
    
    // Add to history (keep last 5)
    $ping_history[] = $ping_result;
    if ( count( $ping_history ) > 5 ) {
      array_shift( $ping_history );
    }
    
    // Calculate average response time
    $total_time = 0;
    $success_count = 0;
    foreach ( $ping_history as $ping ) {
      if ( $ping['status'] === 'success' ) {
        $total_time += $ping['response_time_ms'];
        $success_count++;
      }
    }
    $avg_response_time = $success_count > 0 ? round( $total_time / $success_count, 2 ) : 0;
    
    $message = "Ping #{$run_count} to {$host}: {$response_time}ms";
    
    // Log to PHP error log if server debug is enabled
    if ( $this->core->get_option( 'server_debug_mode' ) ) {
      error_log( "[AI Engine] Ping Task: {$message}" );
    }
    
    // Return success result with updated data
    return [
      'ok' => !is_wp_error( $response ),
      'message' => $message,
      'data' => [
        'run_count' => $run_count,
        'ping_history' => $ping_history,
        'avg_response_time_ms' => $avg_response_time,
        'last_ping' => $ping_result,
      ]
    ];
  }
}