<?php

/**
* OpenAI Engine implementation.
*
* This engine supports both the standard Chat Completions API and the new Responses API.
* The Responses API is used automatically for models that support it (models with the 'responses' tag).
*
* Key differences when using the Responses API:
* - Function calls and results use specific message types instead of role-based messages
* - MCP (Model Context Protocol) tools are executed remotely by OpenAI
* - Different streaming event structure
*
* @see https://platform.openai.com/docs/api-reference/responses
*/
class Meow_MWAI_Engines_OpenAI extends Meow_MWAI_Engines_ChatML {
  // Static
  private static $creating = false;

  // Responses API specific properties
  protected $previousResponseId = null;
  protected $conversationState = [];
  protected $mcpToolNames = [];
  protected $mcpServerCount = 0;
  protected $mcpTotalToolCount = 0;
  protected $emittedFunctionResults = [];
  protected $currentQuery = null;
  protected $streamImages = [];
  protected $seenCallIds = []; // Track seen call IDs to prevent duplicates
  protected $lastRequestBody = null; // For debugging
  // IMPORTANT: OpenAI Responses API sends the same function call in both:
  // 1. response.output_item.done - when individual function call completes
  // 2. response.completed - with all function calls in the final response
  // We must deduplicate to avoid processing the same function twice

  public static function create( $core, $env ) {
    self::$creating = true;
    if ( class_exists( 'MeowPro_MWAI_OpenAI' ) ) {
      $instance = new MeowPro_MWAI_OpenAI( $core, $env );
    }
    else {
      $instance = new self( $core, $env );
    }
    self::$creating = false;
    return $instance;
  }

  public function __construct( $core, $env ) {
    $isOwnClass = get_class( $this ) === 'Meow_MWAI_Engines_OpenAI';
    if ( $isOwnClass && !self::$creating ) {
      throw new \Exception( 'Please use the create() method to instantiate the Meow_MWAI_Engines_OpenAI class.' );
    }
    parent::__construct( $core, $env );
    $this->set_environment();
  }

  public function reset_stream() {
    parent::reset_stream();
    $this->mcpServerCount = 0;
    $this->mcpTotalToolCount = 0;
    $this->emittedFunctionResults = [];
    $this->streamImages = [];
    $this->seenCallIds = [];
  }

  /**
  * Check if a model should use the new Responses API
  */
  protected function should_use_responses_api( $model ) {
    // First check if Responses API is enabled in settings
    $options = $this->core->get_all_options();
    $responsesApiEnabled = $options['ai_responses_api'] ?? true;

    if ( !$responsesApiEnabled ) {
      return false;
    }

    // Azure doesn't support Responses API yet
    if ( $this->envType === 'azure' ) {
      return false;
    }

    // Check if the model has the 'responses' tag
    $modelInfo = $this->retrieve_model_info( $model );
    if ( $modelInfo && !empty( $modelInfo['tags'] ) ) {
      return in_array( 'responses', $modelInfo['tags'] );
    }

    return false;
  }

  /**
  * Set conversation state for stateful responses
  */
  public function set_previous_response_id( $responseId ) {
    $this->previousResponseId = $responseId;
  }

  /**
  * Get conversation state
  */
  public function get_conversation_state() {
    return $this->conversationState;
  }

  /**
  * Build body for Responses API
  */
  protected function build_responses_body( $query, $streamCallback = null ) {
    $body = [
      'model' => $query->model,
      'stream' => !is_null( $streamCallback ),
    ];

    // Handle different query types for Responses API
    if ( $query instanceof Meow_MWAI_Query_Text || $query instanceof Meow_MWAI_Query_Feedback ) {
      // Use simplified instructions + input format for basic queries
      if ( !empty( $query->instructions ) ) {
        $body['instructions'] = $query->instructions;
      }

      // Determine history strategy
      $historyStrategy = $query->historyStrategy;

      // Treat empty string as null for automatic mode
      if ( empty( $historyStrategy ) ) {
        $historyStrategy = null;
      }

      // If historyStrategy is null (automatic), use response_id when previousResponseId is available
      if ( $historyStrategy === null && !empty( $query->previousResponseId ) ) {
        $historyStrategy = 'response_id';
      }

      // Debug logging for all queries when using Responses API
      $queries_debug = $this->core->get_option( 'queries_debug_mode' );
      
      if ( $queries_debug ) {
        if ( $query instanceof Meow_MWAI_Query_Feedback ) {
          error_log( '[AI Engine] Feedback query blocks: ' . count( $query->blocks ?? [] ) );
        }
      }

      // Handle based on history strategy
      // For Responses API, feedback queries MUST use previous_response_id to maintain conversation state
      if ( $historyStrategy === 'response_id' && !empty( $query->previousResponseId ) ) {
        // Use ResponseIdManager to validate the response ID
        if ( $this->core->responseIdManager->is_valid_for_responses_api( $query->previousResponseId ) ) {
          // Use incremental mode with previous_response_id
          $body['previous_response_id'] = $query->previousResponseId;

          // Debug logging
          $queries_debug = $this->core->get_option( 'queries_debug_mode' );
          if ( $queries_debug ) {
            error_log( '[AI Engine Queries] Using previous_response_id: ' . $query->previousResponseId );
          }
        }
        else {
          // Log warning if queries debug is enabled
          $queries_debug = $this->core->get_option( 'queries_debug_mode' );
          if ( $queries_debug ) {
            error_log( '[AI Engine Queries] Warning: ' .
              Meow_MWAI_FunctionCallException::invalid_response_id(
                $query->previousResponseId,
                'Responses API',
                'resp'
              )->getMessage() );
          }
          // Fall through to full history mode
          $historyStrategy = 'full_history';
        }

      }

      // If we're still in response_id mode after validation, use incremental input
      if ( $historyStrategy === 'response_id' && !empty( $body['previous_response_id'] ) ) {
        // Check if this is a feedback query (function call response)
        if ( $query instanceof Meow_MWAI_Query_Feedback && !empty( $query->blocks ) ) {
          // For feedback queries with previous_response_id, we need to include:
          // 1. The function_call from the model
          // 2. The function_call_output with the result
          $body['input'] = $this->build_feedback_input_for_responses_api( $query );
          
          // Debug: Log the feedback input structure
          if ( $queries_debug ) {
            error_log( '[AI Engine Queries] Feedback input structure: ' . json_encode( $body['input'], JSON_PRETTY_PRINT ) );
          }
        }
        else {
          // Regular user message
          $content = [
            [
              'type' => 'input_text',
              'text' => $query->get_message()
            ]
          ];

          // Check for attached file/image
          if ( $query->attachedFile ) {
            $imageUrl = $query->image_remote_upload === 'url'
              ? $query->attachedFile->get_url()
              : $query->attachedFile->get_inline_base64_url();

            $content[] = [
              'type' => 'input_image',
              'image_url' => $imageUrl
            ];
          }

          $body['input'] = [
            [
              'role' => 'user',
              'content' => $content
            ]
          ];

          // Add context if present
          if ( !empty( $query->context ) ) {
            // Prepend context as a separate input_text in the same message
            array_unshift( $body['input'][0]['content'], [
              'type' => 'input_text',
              'text' => $query->context . "\n\n"
            ] );
          }
        }
      }
      else {
        // Use full history mode (internal) or when no previous_response_id

        // Build input - always use array format for Responses API
        if ( !empty( $query->messages ) || $query->attachedFile || $query instanceof Meow_MWAI_Query_Feedback ) {
          $body['input'] = $this->build_responses_input_array( $query );
        }
        else {
          // Even for simple text, Responses API expects message format
          $body['input'] = [
            [
              'role' => 'user',
              'content' => [
                [
                  'type' => 'input_text',
                  'text' => $query->get_message()
                ]
              ]
            ]
          ];
        }

        // Add context if present
        if ( !empty( $query->context ) ) {
          if ( isset( $body['input'] ) && is_string( $body['input'] ) ) {
            $body['input'] = $query->context . "\n\n" . $body['input'];
          }
          else {
            // Add context as system message
            array_unshift( $body['input'], [
              'role' => 'system',
              'content' => $query->context
            ] );
          }
        }
      }

      // Parameters
      if ( !empty( $query->maxTokens ) ) {
        $body['max_output_tokens'] = $query->maxTokens;
      }

      if ( !empty( $query->temperature ) && $query->temperature !== 1 ) {
        $body['temperature'] = $query->temperature;
      }

      // Note: The Responses API does not support the 'n' parameter for multiple results
      // Unlike the Chat Completions API, Responses API generates one response at a time
      // If multiple results are needed, separate requests must be made
      // Reference: https://platform.openai.com/docs/api-reference/responses
      if ( !empty( $query->maxResults ) && $query->maxResults > 1 ) {
        Meow_MWAI_Logging::warn( 'Responses API does not support multiple results (n parameter). Only one result will be generated.' );
      }

      if ( !empty( $query->stop ) ) {
        $body['stop'] = $query->stop;
      }

      if ( !empty( $query->responseFormat ) && $query->responseFormat === 'json' ) {
        // Responses API uses 'text.format' instead of 'response_format'
        $body['text'] = [
          'format' => [
            'type' => 'json_object'
          ]
        ];
      }

      // Function calling - convert to tools
      // Include tools when:
      // 1. It's the first request (no previous_response_id)
      // 2. It's a feedback query (needs full context)
      if ( !empty( $query->functions ) && ( empty( $body['previous_response_id'] ) || $query instanceof Meow_MWAI_Query_Feedback ) ) {
        $body['tools'] = $this->build_responses_tools( $query->functions );
      }


      // Add MCP servers if available
      if ( isset( $query->mcpServers ) && is_array( $query->mcpServers ) && !empty( $query->mcpServers ) ) {
        $mcp_envs = $this->core->get_option( 'mcp_envs' );
        $this->mcpServerCount = count( $query->mcpServers );

        foreach ( $query->mcpServers as $mcpServer ) {
          if ( isset( $mcpServer['id'] ) ) {
            // Find the full MCP server configuration by ID
            foreach ( $mcp_envs as $env ) {
              if ( $env['id'] === $mcpServer['id'] ) {
                // Sanitize server label for OpenAI requirements
                $server_label = $env['name'] . '_' . $env['id'];
                // Remove spaces and special characters
                $server_label = preg_replace( '/[^a-zA-Z0-9_]/', '', $server_label );
                // Replace double or tripe underscores with single underscore
                $server_label = preg_replace( '/_{2,}/', '_', $server_label );
                // Ensure it starts with a letter
                if ( !preg_match( '/^[a-zA-Z]/', $server_label ) ) {
                  $server_label = 'mcp_' . $server_label;
                }

                $mcp_tool = [
                  'type' => 'mcp',
                  'server_label' => $server_label,
                  'server_url' => $env['url'],
                  'require_approval' => 'never'
                ];

                // Add authorization header if available
                if ( !empty( $env['token'] ) ) {
                  $mcp_tool['headers'] = [
                    'Authorization' => 'Bearer ' . $env['token']
                  ];
                }

                // Add to tools array
                if ( !isset( $body['tools'] ) ) {
                  $body['tools'] = [];
                }
                $body['tools'][] = $mcp_tool;

                break;
              }
            }
          }
        }
      }

      // Add tool_choice parameter if tools are present
      if ( !empty( $body['tools'] ) ) {
        // Default to 'auto' to let the model choose
        $body['tool_choice'] = 'auto';
      }

      // Add tools (web_search, image_generation) if specified
      if ( !empty( $query->tools ) && is_array( $query->tools ) ) {
        // Ensure tools array exists
        if ( !isset( $body['tools'] ) ) {
          $body['tools'] = [];
        }

        // Add each enabled tool
        foreach ( $query->tools as $tool ) {
          if ( in_array( $tool, ['web_search', 'image_generation'] ) ) {
            $toolConfig = [ 'type' => $tool ];

            // Image generation requires partial_images when streaming
            if ( $tool === 'image_generation' && !empty( $streamCallback ) ) {
              $toolConfig['partial_images'] = 1;
            }

            $body['tools'][] = $toolConfig;
            Meow_MWAI_Logging::log( 'Responses API: Added tool ' . $tool . ' to request' );
          }
        }
      }
      
      // Add file_search tool if OpenAI Vector Store is configured
      if ( !empty( $query->embeddingsEnvId ) ) {
        Meow_MWAI_Logging::log( 'Responses API: Checking embeddings environment - embeddingsEnvId: ' . $query->embeddingsEnvId );
        
        $embeddingsEnv = $this->core->get_embeddings_env( $query->embeddingsEnvId );
        
        if ( $embeddingsEnv && $embeddingsEnv['type'] === 'openai-vector-store' ) {
          Meow_MWAI_Logging::log( 'Responses API: Found OpenAI Vector Store environment' );
          
          // Check if the OpenAI environment matches
          $openai_env_id = $embeddingsEnv['openai_env_id'] ?? null;
          
          Meow_MWAI_Logging::log( 'Responses API: Comparing environments - embeddings OpenAI env: ' . ( $openai_env_id ?? 'null' ) . ', current env: ' . $this->envId );
          
          if ( $openai_env_id === $this->envId && !empty( $embeddingsEnv['store_id'] ) ) {
            // Ensure tools array exists
            if ( !isset( $body['tools'] ) ) {
              $body['tools'] = [];
            }
            
            // Add file_search tool with vector store ID
            $body['tools'][] = [
              'type' => 'file_search',
              'vector_store_ids' => [ $embeddingsEnv['store_id'] ]
            ];
            
            Meow_MWAI_Logging::log( 'Responses API: Added file_search tool with vector store: ' . $embeddingsEnv['store_id'] );
          } else {
            if ( $openai_env_id !== $this->envId ) {
              Meow_MWAI_Logging::log( 'Responses API: Environment mismatch - file_search tool not added' );
            }
            if ( empty( $embeddingsEnv['store_id'] ) ) {
              Meow_MWAI_Logging::log( 'Responses API: No store_id configured - file_search tool not added' );
            }
          }
        } else {
          Meow_MWAI_Logging::log( 'Responses API: Embeddings environment is not OpenAI Vector Store type (type: ' . ( $embeddingsEnv['type'] ?? 'null' ) . ')' );
        }
      } else {
        Meow_MWAI_Logging::log( 'Responses API: No embeddingsEnvId in query - file_search tool not added' );
      }

      // Note: Responses API doesn't support stream_options parameter
      // Usage tracking is handled differently in the streaming response
    }
    else if ( $query instanceof Meow_MWAI_Query_Image ) {
      // For image generation, we can use the integrated approach
      if ( $query->model === 'gpt-image-1' ) {
        $body['tools'] = [[
          'type' => 'image_generation'
        ]];
        $body['input'] = $query->get_message();
      }
      else {
        // Fallback to old API for DALL-E models
        return $this->build_body( $query, $streamCallback );
      }
    }

    // Debug logging for feedback queries
    if ( $query instanceof Meow_MWAI_Query_Feedback ) {
      Meow_MWAI_Logging::log( 'Responses API: Feedback query body: ' . json_encode( $body ) );
    }


    return $body;
  }

  /**
  * Build tool messages for feedback when using previous_response_id
  */
  protected function build_tool_messages_for_feedback( $query ) {
    $messages = [];

    if ( $query instanceof Meow_MWAI_Query_Feedback && !empty( $query->blocks ) ) {
      foreach ( $query->blocks as $block ) {
        if ( isset( $block['feedbacks'] ) ) {
          foreach ( $block['feedbacks'] as $feedback ) {
            // Get the tool call ID from the original request
            $toolId = $feedback['request']['toolId'] ?? null;

            if ( $toolId ) {
              // According to Responses API spec, tool results should use role:"tool"
              $toolMessage = [
                'role' => 'tool',
                'tool_call_id' => $toolId,
                'content' => [
                  [
                    'type' => 'tool_result',
                    'tool_result' => (string) ( $feedback['reply']['value'] ?? '' )
                  ]
                ]
              ];
              $messages[] = $toolMessage;

              Meow_MWAI_Logging::log( 'Responses API: Added tool result with tool_call_id ' . $toolId . ' - Message: ' . json_encode( $toolMessage ) );
            }
          }
        }
      }
    }

    return $messages;
  }

  /**
  * Build input array for complex message structures
  */
  protected function build_responses_input_array( $query ) {
    // Use the MessageBuilder service for streamlined message building
    $messages = $this->core->messageBuilder->build_responses_api_messages( $query );

    // Note: Function result events are now emitted centrally in core.php
    // when the function is actually executed

    // Debug logging
    $queries_debug = $this->core->get_option( 'queries_debug_mode' );
    if ( $queries_debug && $query instanceof Meow_MWAI_Query_Feedback ) {
      error_log( '[AI Engine Queries] Feedback query messages order:' );
      foreach ( $messages as $idx => $msg ) {
        if ( isset( $msg['type'] ) ) {
          $log_msg = '  [' . $idx . '] ' . $msg['type'];
          if ( $msg['type'] === 'function_call' ) {
            $log_msg .= ' - ' . ( $msg['name'] ?? 'unknown' ) . ' (call_id: ' . ( $msg['call_id'] ?? 'none' ) . ')';
          }
          elseif ( $msg['type'] === 'function_call_output' ) {
            $log_msg .= ' (call_id: ' . ( $msg['call_id'] ?? 'none' ) . ', output: ' . substr( $msg['output'] ?? '', 0, 50 ) . ')';
          }
          error_log( '[AI Engine Queries]' . $log_msg );
        }
        elseif ( isset( $msg['role'] ) ) {
          $content_preview = '';
          if ( isset( $msg['content'] ) ) {
            if ( is_string( $msg['content'] ) ) {
              $content_preview = ' - "' . substr( $msg['content'], 0, 50 ) . '"';
            }
            elseif ( is_array( $msg['content'] ) && isset( $msg['content'][0]['text'] ) ) {
              $content_preview = ' - "' . substr( $msg['content'][0]['text'], 0, 50 ) . '"';
            }
            elseif ( is_array( $msg['content'] ) && isset( $msg['content'][0]['type'] ) && $msg['content'][0]['type'] === 'input_text' ) {
              $content_preview = ' - "' . substr( $msg['content'][0]['text'] ?? '', 0, 50 ) . '"';
            }
          }
          error_log( '[AI Engine Queries]  [' . $idx . '] ' . $msg['role'] . $content_preview );
        }
      }
    }

    return $messages;
  }

  /**
  * Convert functions to Responses API tools format
  */
  protected function build_responses_tools( $functions ) {
    $tools = [];

    foreach ( $functions as $function ) {
      $functionData = $function->serializeForOpenAI();

      // Ensure the function data has all required fields
      if ( !isset( $functionData['name'] ) || empty( $functionData['name'] ) ) {
        Meow_MWAI_Logging::warn( 'Function missing required name field' );
        continue;
      }

      // Responses API expects a flatter structure
      $parameters = $functionData['parameters'] ?? null;

      // Ensure parameters has the correct structure
      if ( !$parameters ) {
        $parameters = [
          'type' => 'object',
          'properties' => new stdClass(),
          'required' => []
        ];
      }
      else {
        // Ensure properties is an object, not an array when empty
        if ( isset( $parameters['properties'] ) &&
              is_array( $parameters['properties'] ) &&
                  empty( $parameters['properties'] ) ) {
          $parameters['properties'] = new stdClass();
        }
      }

      $tool = [
        'type' => 'function',
        'name' => $functionData['name'],
        'description' => $functionData['description'] ?? '',
        'parameters' => $parameters,
        'strict' => false  // Set to false for now, can be made configurable later
      ];

      $tools[] = $tool;
    }

    return $tools;
  }

  /**
  * Build feedback input for Responses API when using previous_response_id.
  *
  * The Responses API requires a very specific format for function results:
  * 1. Echo the exact function_call message from the model
  * 2. Provide the function_call_output with matching call_id
  *
  * This method extracts these from the feedback blocks and formats them correctly.
  *
  * @param Meow_MWAI_Query_Feedback $query The feedback query containing function results
  * @return array Array of messages in Responses API format
  */
  protected function build_feedback_input_for_responses_api( $query ) {
    // Use the MessageBuilder service for streamlined message building
    $messages = $this->core->messageBuilder->build_feedback_only_messages( $query );
    
    // For Responses API, the input should be wrapped in a specific structure
    // According to OpenAI docs, function results should be sent as an array of messages
    return $messages;
  }

  /**
  * Build URL for Responses API
  */
  protected function build_responses_url() {
    if ( $this->envType === 'azure' ) {
      // Azure uses a different URL structure
      $endpoint = isset( $this->env['endpoint'] ) ? $this->env['endpoint'] : null;
      $url = trailingslashit( $endpoint ) . 'openai/responses?' . $this->azureApiVersion;
    }
    else {
      $endpoint = apply_filters( 'mwai_openai_endpoint', 'https://api.openai.com/v1', $this->env );
      $url = trailingslashit( $endpoint ) . 'responses';
    }

    return $url;
  }

  /**
  * Handle Responses API streaming data
  */
  protected function responses_stream_data_handler( $json ) {
    $content = null;
    static $currentItemType = null; // Track the current output item type
    // Load event helper
    if ( !class_exists( 'Meow_MWAI_Event' ) ) {
      require_once MWAI_PATH . '/classes/event.php';
    }

    // Get response metadata
    if ( isset( $json['id'] ) ) {
      $this->inId = $json['id'];
      Meow_MWAI_Logging::log( 'Responses API Streaming: Found response ID in stream: ' . $this->inId );
    }
    if ( isset( $json['model'] ) ) {
      $this->inModel = $json['model'];
    }

    // Handle different event types for Responses API
    $eventType = $json['type'] ?? null;

    // Debug streaming events
    if ( isset( $_GET['debug_mcp'] ) ) {
      error_log( 'AI_ENGINE_DEBUG: Streaming type: ' . ( $eventType ?? 'no_type' ) . ' - Data: ' . json_encode( $json ) );
    }

    switch ( $eventType ) {
      // ===== LIFECYCLE EVENTS =====

      case 'response.created':
        // Emitted when a response object is created - contains initial response metadata
        $response = $json['response'] ?? [];
        $this->inId = $response['id'] ?? null;
        $this->inModel = $response['model'] ?? null;
        if ( $this->inId ) {
        }
        break;

      case 'response.queued':
        // Response is queued and waiting to start processing
        // We can log this for debugging purposes
        Meow_MWAI_Logging::log( 'Responses API: Response queued for processing' );
        break;

      case 'response.in_progress':
        // Emitted repeatedly while the response is being generated
        // Contains partial response state but typically not used for streaming text
        break;

      case 'response.completed':
        // Response is fully generated - extract any function calls from completed output
        if ( $this->core->get_option( 'queries_debug_mode' ) ) {
          error_log( '[AI Engine Queries] Current streamToolCalls count: ' . count( $this->streamToolCalls ) );
        }
        
        $response = $json['response'] ?? [];
        $outputs = $response['output'] ?? [];

        foreach ( $outputs as $idx => $output ) {
          if ( $this->core->get_option( 'queries_debug_mode' ) ) {
            error_log( '[AI Engine Queries] Output ' . $idx . ' type: ' . ( $output['type'] ?? 'unknown' ) . ', status: ' . ( $output['status'] ?? 'no-status' ) );
          }
          
          if ( isset( $output['type'] ) && $output['type'] === 'function_call' && 
               isset( $output['status'] ) && $output['status'] === 'completed' ) {
            // Note: Responses API uses 'call_id' not 'id' for function calls
            $callId = $output['call_id'] ?? $output['id'] ?? null;
            $functionName = $output['name'] ?? '';
            
            if ( $this->core->get_option( 'queries_debug_mode' ) ) {
              error_log( '[AI Engine Queries] Processing function_call: ' . $functionName . ' (id: ' . $callId . ')' );
            }
            
            // IMPORTANT: Deduplicate function calls
            // OpenAI sends the same function call in both response.output_item.done
            // and response.completed events. We track call IDs to avoid duplicates.
            if ( in_array( $callId, $this->seenCallIds, true ) ) {
              // Skip duplicate - already processed in response.output_item.done
              if ( $this->core->get_option( 'queries_debug_mode' ) ) {
                error_log( '[AI Engine Queries] Skipping duplicate call ID: ' . $callId );
              }
              continue;
            }
            
            // First time seeing this call ID - add it
            if ( $this->core->get_option( 'queries_debug_mode' ) ) {
              error_log( '[AI Engine Queries] response.completed adding tool call: ' . $functionName . ' (id: ' . $callId . ')' );
            }
            $this->seenCallIds[] = $callId;
            $this->streamToolCalls[] = [
              'id' => $callId,
              'type' => 'function',
              'function' => [
                'name' => $functionName,
                'arguments' => $output['arguments'] ?? '{}'
              ]
            ];
          }
        }
        break;

      case 'response.incomplete':
        // Response stopped before completion (e.g., max_tokens reached)
        $details = $json['response']['incomplete_details'] ?? [];
        Meow_MWAI_Logging::warn( 'Responses API: Response incomplete - ' . json_encode( $details ) );
        break;

      case 'response.failed':
        // Response generation failed
        $error = $json['response']['error'] ?? [];
        $message = $error['message'] ?? 'Response generation failed';
        throw new Exception( $message );

        // ===== OUTPUT ITEM EVENTS =====

      case 'response.output_item.added':
        // New output item added (e.g., message, function_call, etc.)
        // Track the type of the current output item
        if ( isset( $json['item'] ) && isset( $json['item']['type'] ) ) {
          $item = $json['item'];
          $itemType = $item['type'];
          $currentItemType = $itemType;

          // Don't emit events here for web search or image generation - wait for more specific events
          // This prevents duplicate events

          // If it's an MCP call, store the tool name
          if ( $itemType === 'mcp_call' && isset( $item['id'] ) && isset( $item['name'] ) ) {
            $this->mcpToolNames[$item['id']] = $item['name'];
            Meow_MWAI_Logging::log( 'Responses API: MCP tool call added - ' . $item['name'] . ' (id: ' . $item['id'] . ')' );

            if ( $this->currentDebugMode ) {
              $event = Meow_MWAI_Event::mcp_calling( $item['name'], $item['id'] )
                    ->set_metadata( 'name', $item['name'] )
                        ->set_metadata( 'server_label', $item['server_label'] ?? null );
              call_user_func( $this->streamCallback, $event );
            }
          }
        }
        break;

      case 'response.output_item.done':
        // Output item completed - check for MCP approval requests or tool lists
        if ( isset( $json['item'] ) && isset( $json['item']['type'] ) ) {
          $item = $json['item'];
          $itemType = $item['type'];

          // Reset current item type when we complete a message item
          if ( $itemType === 'message' ) {
            $currentItemType = null;
          }

          if ( $itemType === 'function_call' ) {
            // Regular function call completed - send event
            if ( $this->currentDebugMode && $this->streamCallback ) {
              $event = Meow_MWAI_Event::function_calling( $item['name'] ?? 'unknown', json_decode( $item['arguments'] ?? '{}', true ) )
                      ->set_metadata( 'call_id', $item['call_id'] ?? null );
              call_user_func( $this->streamCallback, $event );
            }

            // Add to streamToolCalls for execution
            // Note: Responses API uses 'call_id' not 'id' for function calls
            $callId = $item['call_id'] ?? $item['id'] ?? null;
            $functionName = $item['name'] ?? '';
            
            // Add to our deduplication tracking
            // We process function calls here as they complete individually during streaming
            // The response.completed event will also try to add them, so we track IDs
            if ( !in_array( $callId, $this->seenCallIds, true ) ) {
              $this->seenCallIds[] = $callId;
              
              $this->streamToolCalls[] = [
                'id' => $callId,
                'type' => 'function',
                'function' => [
                  'name' => $functionName,
                  'arguments' => $item['arguments'] ?? '{}'
                ]
              ];
            }
          }
          elseif ( $itemType === 'mcp_approval_request' ) {
            // IMPORTANT: MCP (Model Context Protocol) tools are executed remotely by OpenAI
            // Unlike regular function calls, MCP tools do NOT need local execution
            // Therefore, we should NOT add them to streamToolCalls array
            // This prevents creation of unnecessary feedback queries and second response cycles
            Meow_MWAI_Logging::log( 'Responses API: MCP approval request for ' . $item['name'] . ' from server ' . $item['server_label'] . ' (handled remotely)' );
          }
          elseif ( $item['type'] === 'mcp_call' ) {
            // IMPORTANT: MCP calls are already executed remotely by OpenAI's infrastructure
            // The result is included in the same response stream
            // We must NOT add these to streamToolCalls to avoid duplicate execution attempts
            Meow_MWAI_Logging::log( 'Responses API: MCP call completed - ' . $item['name'] . ' (already executed remotely)' );

            // Send event for completed MCP call when debug is enabled
            if ( $this->currentDebugMode && isset( $item['name'] ) ) {
              $args = json_decode( $item['arguments'] ?? '{}', true );
              $output = $item['output'] ?? null;

              // Skip the tool_call event for MCP calls since we already sent mcp_tool_call
              // This prevents duplicate events in the UI

              // Then send a separate event for the tool result
              if ( $output ) {
                // Format the output preview
                $outputPreview = is_array( $output ) ? json_encode( $output ) : (string) $output;
                if ( strlen( $outputPreview ) > 100 ) {
                  $outputPreview = substr( $outputPreview, 0, 100 ) . '...';
                }

                $resultEvent = Meow_MWAI_Event::mcp_result( $item['name'] )
                    ->set_metadata( 'output', $output );
                call_user_func( $this->streamCallback, $resultEvent );
              }

              // Don't return content since we've already sent events
              $content = null;
            }
          }
          elseif ( $itemType === 'web_search_call' ) {
            // Web search completed - don't emit event here
            // The event will be emitted by the response.web_search_call.completed handler
            // This prevents duplicate events
            Meow_MWAI_Logging::log( 'Responses API: Web search output item completed (event handled by specific handler)' );
          }
          elseif ( $itemType === 'image_generation_call' ) {
            // Image generation completed
            Meow_MWAI_Logging::log( 'Responses API: Image generation output item completed' );

            // Extract the base64 image from the result
            if ( isset( $item['result'] ) ) {
              $base64Image = $item['result'];

              // Store the image for later processing
              if ( !isset( $this->streamImages ) ) {
                $this->streamImages = [];
              }

              $this->streamImages[] = $base64Image;

              Meow_MWAI_Logging::log( 'Responses API: Stored generated image (base64 length: ' . strlen( $base64Image ) . ')' );
            }
          }
          elseif ( $item['type'] === 'mcp_list_tools' ) {
            // MCP tools list discovered
            $server_label = $item['server_label'] ?? 'unknown';
            $tools_count = isset( $item['tools'] ) ? count( $item['tools'] ) : 0;
            $this->mcpTotalToolCount += $tools_count;
            Meow_MWAI_Logging::log( 'Responses API: MCP tools list from server ' . $server_label . ' containing ' . $tools_count . ' tools' );

            // Send event for tools discovery using the aggregated format
            if ( $this->currentDebugMode ) {
              $serverCount = $this->mcpServerCount > 0 ? $this->mcpServerCount : 1;
              $event = Meow_MWAI_Event::mcp_discovery( $serverCount, $this->mcpTotalToolCount );
              call_user_func( $this->streamCallback, $event );
            }

            // Log first few tools for debugging
            if ( isset( $item['tools'] ) && is_array( $item['tools'] ) ) {
              $sample_tools = array_slice( $item['tools'], 0, 3 );
              foreach ( $sample_tools as $tool ) {
                Meow_MWAI_Logging::log( 'Responses API: MCP tool "' . ( $tool['name'] ?? 'unnamed' ) . '": ' . ( $tool['description'] ?? 'no description' ) );
              }
              if ( $tools_count > 3 ) {
                Meow_MWAI_Logging::log( 'Responses API: ... and ' . ( $tools_count - 3 ) . ' more tools' );
              }
            }
          }
        }
        break;

        // ===== CONTENT PART EVENTS =====

      case 'response.content_part.added':
        // New content part added to an output item
        // Indicates start of a new content section (text, image, etc.)
        // Check if this is MCP-related content that shouldn't be shown
        if ( isset( $json['part']['type'] ) ) {
          $partType = $json['part']['type'];

          // Just log the part type for debugging
          // We can use this info later if needed
        }
        break;

      case 'response.content_part.done':
        // Content part is finalized
        // No more deltas will be sent for this content part
        break;

        // ===== TEXT STREAMING EVENTS =====

      case 'response.output_text.delta':
        // Streaming text chunk for the current content part
        if ( isset( $json['delta'] ) ) {
          // Send a status event for the first content chunk
          if ( $this->currentDebugMode && !isset( $this->contentStarted ) ) {
            $this->contentStarted = true;
            $statusEvent = Meow_MWAI_Event::generating_response();
            call_user_func( $this->streamCallback, $statusEvent );
          }
          $content = $json['delta'];
        }
        break;

      case 'response.output_text.done':
        // Final text for the content part
        // Contains the complete accumulated text
        // Don't send response_completed here - ChatbotContext adds "Request completed"
        unset( $this->contentStarted );
        break;

      case 'response.refusal.delta':
        // Streaming refusal message chunk
        // Model is refusing to generate the requested content
        if ( isset( $json['delta'] ) ) {
          // We might want to stream refusals as regular content
          $content = $json['delta'];
        }
        break;

      case 'response.refusal.done':
        // Final refusal message
        // Contains the complete refusal reason
        break;

      case 'response.function_call_arguments.delta':
        // Streaming JSON arguments for a function call
        // We don't stream these to UI as they're not human-readable
        break;

      case 'response.function_call_arguments.done':
        // Complete function call arguments
        // Already handled in response.output_item.done for function_call type
        break;

        // ===== FILE & WEB SEARCH EVENTS =====

      case 'response.file_search_call.in_progress':
        // File search started
        Meow_MWAI_Logging::log( 'Responses API: File search in progress' );
        break;

      case 'response.file_search_call.searching':
        // Actively searching files
        break;

      case 'response.file_search_call.completed':
        // File search finished
        break;

      case 'response.web_search_call.in_progress':
        // Web search started - only emit one event at the start
        Meow_MWAI_Logging::log( 'Responses API: Web search in progress' );
        if ( $this->currentDebugMode && $this->streamCallback ) {
          $event = Meow_MWAI_Event::status( 'Searching the web...' );
          call_user_func( $this->streamCallback, $event );
        }
        break;

      case 'response.web_search_call.searching':
        // Actively searching - don't emit duplicate events
        if ( isset( $json['query'] ) ) {
          Meow_MWAI_Logging::log( 'Responses API: Searching for: ' . $json['query'] );
        }
        break;

      case 'response.web_search_call.completed':
        // Web search finished
        Meow_MWAI_Logging::log( 'Responses API: Web search completed' );

        // The completed event doesn't contain results, just metadata
        // Results are likely embedded in the model's response text
        if ( $this->currentDebugMode && $this->streamCallback ) {
          $message = 'Web search completed';
          $event = Meow_MWAI_Event::status( $message );
          call_user_func( $this->streamCallback, $event );
        }
        break;

        // ===== IMAGE GENERATION EVENTS =====

      case 'response.image_generation_call.in_progress':
        // Image generation started
        Meow_MWAI_Logging::log( 'Responses API: Image generation in progress' );
        if ( $this->currentDebugMode && $this->streamCallback ) {
          $event = Meow_MWAI_Event::status( 'Generating image...' );
          call_user_func( $this->streamCallback, $event );
        }
        break;

      case 'response.image_generation_call.generating':
        // Image is being generated
        break;

      case 'response.image_generation_call.partial_image':
        // Partial image data (base64)
        // Could be used for progressive image display
        if ( isset( $json['partial_image_b64'] ) ) {
          Meow_MWAI_Logging::log( 'Responses API: Received partial image index ' . ( $json['partial_image_index'] ?? 'unknown' ) );
          // For now, we don't display partial images, but we could in the future
        }
        break;

      case 'response.image_generation_call.completed':
        // Image generation finished
        Meow_MWAI_Logging::log( 'Responses API: Image generation completed' );

        // Note: The actual image data comes in response.output_item.done event
        // This event just signals completion

        if ( $this->currentDebugMode && $this->streamCallback ) {
          $event = Meow_MWAI_Event::status( 'Image generated.' );
          call_user_func( $this->streamCallback, $event );
        }
        break;

        // ===== MCP (Model Context Protocol) EVENTS =====

      case 'response.mcp_call.in_progress':
        // MCP tool call is running
        $itemId = $json['item_id'] ?? null;
        $toolName = isset( $this->mcpToolNames[$itemId] ) ? $this->mcpToolNames[$itemId] : 'unknown';

        Meow_MWAI_Logging::log( 'Responses API: MCP tool call in progress - ' . $toolName );
        break;

      case 'response.mcp_call.arguments.delta':
      case 'response.mcp_call_arguments.delta':
        // Streaming arguments for MCP tool call
        // Don't stream these JSON arguments to the UI
        // These contain the function parameters like {"post_type":"post",...}
        break;

      case 'response.mcp_call.arguments.done':
      case 'response.mcp_call_arguments.done':
        // Complete arguments for MCP tool call
        break;

      case 'response.mcp_call.completed':
        // MCP tool call succeeded
        break;

      case 'response.mcp_call.failed':
        // MCP tool call failed
        $error = $json['error'] ?? [];
        Meow_MWAI_Logging::error( 'Responses API: MCP tool call failed - ' . ( $error['message'] ?? 'Unknown error' ) );
        break;

      case 'response.mcp_list_tools.in_progress':
        // Listing MCP tools has started
        Meow_MWAI_Logging::log( 'Responses API: MCP tools discovery in progress' );
        break;

      case 'response.mcp_list_tools.completed':
        // MCP tools listing completed successfully
        break;

      case 'response.mcp_list_tools.failed':
        // MCP tools listing failed
        $error = $json['error'] ?? [];
        $message = 'MCP tools listing failed: ' . ( $error['message'] ?? 'Unknown error' );
        Meow_MWAI_Logging::error( 'Responses API: ' . $message );
        throw new Exception( $message );
        break;

        // ===== REASONING EVENTS (for o1/o3 models) =====

      case 'response.reasoning.delta':
        // Streaming reasoning text chunk
        // Internal reasoning process of the model
        break;

      case 'response.reasoning.done':
        // Complete reasoning text
        break;

      case 'response.reasoning_summary_part.added':
        // New reasoning summary part added
        break;

      case 'response.reasoning_summary_part.done':
        // Reasoning summary part completed
        break;

      case 'response.reasoning_summary_text.delta':
        // Streaming reasoning summary text
        break;

      case 'response.reasoning_summary_text.done':
        // Complete reasoning summary
        break;

        // ===== ANNOTATION EVENTS =====

      case 'response.output_text_annotation.added':
      case 'response.output_text.annotation.added':
        // Text annotation added (e.g., citations, references)
        // Can be used to add metadata to generated text
        break;

      case 'response.completed':
        // Response fully completed - function calls are already handled in response.output_item.done
        break;

        // ===== ERROR EVENTS =====

      case 'error':
        // Generic error event
        $error = $json['error'] ?? $json;
        $message = $error['message'] ?? 'Unknown error occurred';
        $code = $error['code'] ?? null;
        if ( $code ) {
          $message .= " (Code: $code)";
        }
        throw new Exception( $message );

      default:
        // Unknown event type - log for debugging
        Meow_MWAI_Logging::error( 'Responses API: Unknown event type: ' . $eventType );

        // Check if this might be a different streaming format
        if ( isset( $json['delta'] ) && is_string( $json['delta'] ) ) {
          $content = $json['delta'];
        }
        elseif ( isset( $json['content'] ) && is_string( $json['content'] ) ) {
          $content = $json['content'];
        }
    }

    // Handle usage data
    $usage = $json['usage'] ?? [];
    if ( isset( $usage['input_tokens'], $usage['output_tokens'] ) ) {
      $this->streamInTokens = (int) $usage['input_tokens'];
      $this->streamOutTokens = (int) $usage['output_tokens'];
      if ( isset( $usage['cost'] ) ) {
        $this->streamCost = (float) $usage['cost'];
      }
    }

    return $content;
  }

  /**
  * Override stream data handler to support both APIs
  */
  protected function stream_data_handler( $json ) {
    // Check if this is a Responses API event (uses 'type' field)
    if ( isset( $json['type'] ) && strpos( $json['type'], 'response.' ) === 0 ) {
      return $this->responses_stream_data_handler( $json );
    }

    // Fallback to ChatML handler
    return parent::stream_data_handler( $json );
  }

  /**
   * Override reset to include OpenAI-specific state
   */
  protected function reset_request_state() {
    parent::reset_request_state();
    
    // Reset OpenAI-specific state
    $this->streamImages = [];
  }

  /**
  * Override run_completion_query to route to appropriate API
  */
  public function run_completion_query( $query, $streamCallback = null ): Meow_MWAI_Reply {
    // Reset request-specific state to prevent leakage between requests
    $this->reset_request_state();
    
    // Store current query for should_use_responses_api check
    $this->currentQuery = $query;

    // Debug: Always log which API we're using
    $useResponsesApi = $this->should_use_responses_api( $query->model );

    // Check if we should use Responses API
    if ( $useResponsesApi ) {
      return $this->run_responses_completion_query( $query, $streamCallback );
    }

    // Fallback to ChatML implementation
    return parent::run_completion_query( $query, $streamCallback );
  }

  /**
  * Run completion query using Responses API
  */
  protected function run_responses_completion_query( $query, $streamCallback = null ): Meow_MWAI_Reply {
    // Check if we have functions that might require feedback
    $hasFunctions = !empty( $query->functions );
    
    
    $isStreaming = !is_null( $streamCallback );

    // Initialize debug mode
    $this->init_debug_mode( $query );

    if ( $isStreaming ) {
      $this->streamCallback = $streamCallback;
      add_action( 'http_api_curl', [ $this, 'stream_handler' ], 10, 3 );
    }

    $this->reset_stream();
    $body = $this->build_responses_body( $query, $streamCallback );
    $url = $this->build_responses_url();
    $headers = $this->build_headers( $query );
    $options = $this->build_options( $headers, $body );
    
    // Store the request body for debugging
    $this->lastRequestBody = $body;

    // Debug log for Responses API
    $queries_debug = $this->core->get_option( 'queries_debug_mode' );
    if ( $queries_debug ) {
      error_log( '[AI Engine Queries] Using Responses API' );
      error_log( '[AI Engine Queries] Request URL: ' . $url );
      error_log( '[AI Engine Queries] Request Body: ' . json_encode( $body, JSON_PRETTY_PRINT ) );
      
      // Log specific tool information
      if ( isset( $body['tools'] ) && is_array( $body['tools'] ) ) {
        error_log( '[AI Engine Queries] Tools included in request:' );
        foreach ( $body['tools'] as $index => $tool ) {
          $toolInfo = 'Tool ' . $index . ': type=' . ( $tool['type'] ?? 'unknown' );
          if ( $tool['type'] === 'file_search' && isset( $tool['vector_store_ids'] ) ) {
            $toolInfo .= ', vector_store_ids=' . json_encode( $tool['vector_store_ids'] );
          }
          error_log( '[AI Engine Queries]   - ' . $toolInfo );
        }
      } else {
        error_log( '[AI Engine Queries] No tools included in request' );
      }
    }

    // Emit "Request sent" event for feedback queries
    if ( $this->currentDebugMode && !empty( $streamCallback ) && 
         ( $query instanceof Meow_MWAI_Query_Feedback || $query instanceof Meow_MWAI_Query_AssistFeedback ) ) {
      $event = Meow_MWAI_Event::request_sent()
        ->set_metadata( 'is_feedback', true )
        ->set_metadata( 'feedback_count', count( $query->blocks ) );
      call_user_func( $streamCallback, $event );
    }

    try {
      // Log the input being sent for feedback queries
      if ( $queries_debug && $query instanceof Meow_MWAI_Query_Feedback && isset( $body['input'] ) ) {
        error_log( '[AI Engine Queries] Sending feedback with ' . count( $body['input'] ) . ' messages to Responses API' );
        error_log( '[AI Engine Queries] Previous Response ID: ' . ( $body['previous_response_id'] ?? 'none' ) );
        foreach ( $body['input'] as $idx => $msg ) {
          $msgType = is_array( $msg ) && isset( $msg['type'] ) ? $msg['type'] : 'unknown';
          $callId = is_array( $msg ) && isset( $msg['call_id'] ) ? $msg['call_id'] : 'no-id';
          error_log( '[AI Engine Queries]   Message ' . $idx . ': type=' . $msgType . ', call_id=' . $callId );
          if ( $msgType === 'function_call' && isset( $msg['name'] ) ) {
            error_log( '[AI Engine Queries]     Function name: ' . $msg['name'] );
          }
          if ( $msgType === 'function_call_output' && isset( $msg['output'] ) ) {
            error_log( '[AI Engine Queries]     Output: ' . substr( $msg['output'], 0, 50 ) . '...' );
          }
        }
      }
      
      $res = $this->run_query( $url, $options, $streamCallback );
      $reply = new Meow_MWAI_Reply( $query );

      $returned_id = null;
      $returned_model = $this->inModel;
      $returned_in_tokens = null;
      $returned_out_tokens = null;
      $returned_price = null;
      $returned_choices = [];

      // Streaming Mode
      if ( $isStreaming ) {
        if ( empty( $this->streamContent ) ) {
          $error = $this->try_decode_error( $this->streamBuffer );
          if ( !is_null( $error ) ) {
            throw new Exception( $error );
          }
        }

        $returned_id = $this->inId;
        $returned_model = $this->inModel ? $this->inModel : $query->model;
        $message = [ 'role' => 'assistant', 'content' => $this->streamContent ];

        if ( !empty( $this->streamToolCalls ) ) {
          error_log( '[AI Engine Queries] Responses API: Found ' . count( $this->streamToolCalls ) . ' tool calls in streaming response' );
          foreach ( $this->streamToolCalls as $idx => $toolCall ) {
            error_log( '[AI Engine Queries]   Tool call ' . $idx . ': ' . $toolCall['function']['name'] . ' (id: ' . $toolCall['id'] . ')' );
          }
          $message['tool_calls'] = $this->streamToolCalls;
        }

        if ( !is_null( $this->streamInTokens ) ) {
          $returned_in_tokens = $this->streamInTokens;
        }
        if ( !is_null( $this->streamOutTokens ) ) {
          $returned_out_tokens = $this->streamOutTokens;
        }
        if ( !is_null( $this->streamCost ) ) {
          $returned_price = $this->streamCost;
        }

        $returned_choices = [ [ 'message' => $message ] ];

        // Add generated images to the content if any
        if ( !empty( $this->streamImages ) ) {
          // Add images as additional choices with b64_json format
          foreach ( $this->streamImages as $base64Image ) {
            $returned_choices[] = [ 'b64_json' => $base64Image ];
          }
          Meow_MWAI_Logging::log( 'Responses API: Added ' . count( $this->streamImages ) . ' images to choices (streaming)' );
        }

        // Log streaming response data if queries debug is enabled
        if ( $queries_debug ) {
          error_log( '[AI Engine Queries] Streaming Response Collected:' );
          $streaming_data = [
            'id' => $returned_id,
            'model' => $returned_model,
            'content_length' => strlen( $this->streamContent ),
            'content_preview' => substr( $this->streamContent, 0, 200 ) . ( strlen( $this->streamContent ) > 200 ? '...' : '' ),
            'tool_calls' => !empty( $this->streamToolCalls ) ? count( $this->streamToolCalls ) . ' tool calls' : 'none',
            'usage' => [
              'input_tokens' => $returned_in_tokens,
              'output_tokens' => $returned_out_tokens,
              'cost' => $returned_price
            ]
          ];

          // Log tool calls details if present
          if ( !empty( $this->streamToolCalls ) ) {
            $streaming_data['tool_calls_details'] = [];
            foreach ( $this->streamToolCalls as $tool_call ) {
              $streaming_data['tool_calls_details'][] = [
                'id' => $tool_call['id'] ?? 'unknown',
                'name' => $tool_call['function']['name'] ?? 'unknown',
                'arguments' => substr( $tool_call['function']['arguments'] ?? '{}', 0, 100 ) . '...'
              ];
            }
          }

          error_log( json_encode( $streaming_data, JSON_PRETTY_PRINT ) );
        }
      }
      // Standard Mode
      else {
        $data = $res['data'];
        if ( empty( $data ) ) {
          throw new Exception( 'No content received (res is null).' );
        }

        // Handle Responses API response format
        $returned_id = $data['id'] ?? null;
        $returned_model = $data['model'] ?? $query->model;

        // Extract content from Responses API format
        $content = '';
        $tool_calls = [];
        $images = [];


        if ( isset( $data['output'] ) && is_array( $data['output'] ) ) {
          
          foreach ( $data['output'] as $idx => $output_item ) {
            if ( isset( $output_item['type'] ) && $output_item['type'] === 'message' && isset( $output_item['content'] ) ) {
              // Handle message content array - this is the actual text content
              if ( is_array( $output_item['content'] ) ) {
                foreach ( $output_item['content'] as $content_item ) {
                  // The actual text is in content_item['text'] for type 'output_text'
                  if ( isset( $content_item['type'] ) && $content_item['type'] === 'output_text' && isset( $content_item['text'] ) ) {
                    $content .= $content_item['text'];
                  }
                  // Fallback checks for other possible structures
                  elseif ( isset( $content_item['content'] ) && is_string( $content_item['content'] ) ) {
                    $content .= $content_item['content'];
                  }
                  elseif ( is_string( $content_item ) ) {
                    $content .= $content_item;
                  }
                }
              }
            }
            elseif ( isset( $output_item['type'] ) && $output_item['type'] === 'function_call' ) {
              // Responses API returns function_call type with call_id
              $callId = $output_item['call_id'] ?? $output_item['id'] ?? null;
              $functionName = $output_item['name'] ?? '';
              error_log( '[AI Engine Queries] Found function_call: ' . $functionName . ' (call_id: ' . $callId . ')' );
              
              $tool_calls[] = [
                'id' => $callId,
                'type' => 'function',
                'function' => [
                  'name' => $functionName,
                  'arguments' => $output_item['arguments'] ?? '{}'
                ]
              ];
            }
            elseif ( isset( $output_item['type'] ) && $output_item['type'] === 'image_generation_call' && isset( $output_item['result'] ) ) {
              // Handle image generation results
              $base64Image = $output_item['result'];
              $images[] = $base64Image;

              Meow_MWAI_Logging::log( 'Responses API: Found generated image in non-streaming mode' );
            }
            elseif ( isset( $output_item['type'] ) && $output_item['type'] === 'mcp_approval_request' ) {
              // IMPORTANT: MCP approval requests are already handled via streaming events
              // We must skip them here to prevent duplicate function calls
              // MCP tools are executed remotely by OpenAI and don't need local execution
              Meow_MWAI_Logging::log( 'Responses API: Skipping MCP approval request for ' . $output_item['name'] . ' (already handled via events)' );
            }
          }
        }

        // If we couldn't find content in output, try other locations
        if ( empty( $content ) ) {
          if ( isset( $data['text'] ) ) {
            if ( is_string( $data['text'] ) ) {
              $content = $data['text'];
            }
            elseif ( is_array( $data['text'] ) ) {
              // Only implode if it's an array of strings, not complex structures
              $textParts = array_filter( $data['text'], 'is_string' );
              if ( !empty( $textParts ) ) {
                $content = implode( '', $textParts );
              }
            }
          }
          elseif ( isset( $data['content'] ) ) {
            if ( is_array( $data['content'] ) && isset( $data['content'][0]['text'] ) ) {
              $content = $data['content'][0]['text'];
            }
            elseif ( is_string( $data['content'] ) ) {
              $content = $data['content'];
            }
          }
        }

        // If still no content found, log for debugging
        if ( empty( $content ) ) {
          Meow_MWAI_Logging::log( 'Responses API: No content found in response. Structure: ' . json_encode( array_keys( $data ) ) );
          if ( isset( $data['output'][0] ) ) {
            Meow_MWAI_Logging::log( 'Responses API: First output item: ' . json_encode( $data['output'][0] ) );
          }
          if ( isset( $data['text'] ) ) {
            Meow_MWAI_Logging::log( 'Responses API: Text field structure: ' . json_encode( $data['text'] ) );
          }
          // Log the entire response for debugging
          Meow_MWAI_Logging::log( 'Responses API: Full response data: ' . json_encode( $data ) );
        }

        
        $message = [ 'role' => 'assistant', 'content' => $content ];
        if ( !empty( $tool_calls ) ) {
          $message['tool_calls'] = $tool_calls;
          Meow_MWAI_Logging::log( 'Responses API: Found ' . count( $tool_calls ) . ' tool calls' );
        }

        $returned_choices = [[ 'message' => $message ]];

        // Add images as additional choices
        if ( !empty( $images ) ) {
          foreach ( $images as $base64Image ) {
            $returned_choices[] = [ 'b64_json' => $base64Image ];
          }
          Meow_MWAI_Logging::log( 'Responses API: Added ' . count( $images ) . ' images to choices' );
        }


        // Extract usage information
        $usage = $data['usage'] ?? [];
        $returned_in_tokens = $usage['input_tokens'] ?? null;
        $returned_out_tokens = $usage['output_tokens'] ?? null;
        $returned_price = $usage['cost'] ?? null;
      }

      // Store response ID for future stateful requests
      if ( !empty( $returned_id ) ) {
        $this->previousResponseId = $returned_id;
        $reply->set_id( $returned_id );
      }

      // Set the results
      $reply->set_choices( $returned_choices );

      // Handle tokens usage
      $this->handle_tokens_usage(
        $reply,
        $query,
        $returned_model,
        $returned_in_tokens,
        $returned_out_tokens,
        $returned_price
      );

      return $reply;
    }
    catch ( Exception $e ) {
      $service = $this->get_service_name();
      Meow_MWAI_Logging::error( "$service (Responses API): " . $e->getMessage() );
      $message = "$service (Responses API): " . $e->getMessage();
      throw new Exception( $message );
    }
    finally {
      if ( !is_null( $streamCallback ) ) {
        remove_action( 'http_api_curl', [ $this, 'stream_handler' ] );
      }
    }
  }

  /**
  * Override handle_tokens_usage to set accuracy properly
  */
  public function handle_tokens_usage(
    $reply,
    $query,
    $returned_model,
    $returned_in_tokens,
    $returned_out_tokens,
    $returned_price = null
  ) {
    // Call parent to handle the actual usage recording
    parent::handle_tokens_usage(
      $reply,
      $query,
      $returned_model,
      $returned_in_tokens,
      $returned_out_tokens,
      $returned_price
    );

    // Set accuracy based on data availability
    if ( !is_null( $returned_price ) && !is_null( $returned_in_tokens ) && !is_null( $returned_out_tokens ) ) {
      // Responses API with cost field or OpenRouter style = full accuracy
      $reply->set_usage_accuracy( 'full' );
    } elseif ( !is_null( $returned_in_tokens ) && !is_null( $returned_out_tokens ) ) {
      // Tokens from API but price calculated = tokens accuracy
      $reply->set_usage_accuracy( 'tokens' );
    } else {
      // Everything estimated
      $reply->set_usage_accuracy( 'estimated' );
    }
  }

  /**
  * Override image query handling for gpt-image-1 model
  */
  public function run_image_query( $query ) {
    // IMPORTANT: We use the standard Images API for gpt-image-1 (not Responses API)
    // Even though Responses API supports image_generation tool, it would let the
    // orchestrator model choose which image model to use. By using the Images API
    // directly, we ensure gpt-image-1 is actually used as requested by the user.

    // Use standard implementation for all image models including gpt-image-1
    return parent::run_image_query( $query );
  }

  /**
  * Override transcription to support new models
  */
  public function run_transcribe_query( $query ) {
    // Check if using new transcription models
    $newTranscribeModels = ['gpt-4o-transcribe', 'gpt-4o-mini-transcribe'];
    if ( in_array( $query->model, $newTranscribeModels ) ) {
      // These still use the /audio/transcriptions endpoint but with new models
      // Just need to make sure the model name is passed correctly
    }

    // Use parent implementation (still uses audio endpoint)
    return parent::run_transcribe_query( $query );
  }

  /**
  * Override embedding query to support new models
  */
  public function run_embedding_query( $query ) {
    // Check if using new embedding models
    $newEmbeddingModels = ['text-embedding-3-small', 'text-embedding-3-large'];
    if ( in_array( $query->model, $newEmbeddingModels ) ) {
      // These still use the /embeddings endpoint but with improved models
      // The parent implementation should handle this correctly
    }

    // Use parent implementation
    return parent::run_embedding_query( $query );
  }

  /**
  * Enhanced error handling for Responses API
  */
  protected function handle_responses_errors( $data ) {
    // Handle Responses API specific errors
    if ( isset( $data['error'] ) ) {
      $error = $data['error'];
      $message = $error['message'] ?? 'Unknown error';
      $type = $error['type'] ?? null;
      $code = $error['code'] ?? null;

      // Special handling for "No tool output found" errors
      if ( strpos( $message, 'No tool output found' ) !== false ) {
        // Always log this error with details
        error_log( '[AI Engine Queries] Responses API Tool Output Error:' );
        error_log( '[AI Engine Queries] Error: ' . $message );
        error_log( '[AI Engine Queries] This typically means the function call outputs were not properly formatted or are missing.' );
        
        // Log the last request body if available
        if ( property_exists( $this, 'lastRequestBody' ) && $this->lastRequestBody ) {
          error_log( '[AI Engine Queries] Last request body: ' . json_encode( $this->lastRequestBody, JSON_PRETTY_PRINT ) );
        }
      }

      $errorMessage = $message;
      if ( $type ) {
        $errorMessage .= " (Type: $type)";
      }
      if ( $code ) {
        $errorMessage .= " (Code: $code)";
      }

      throw new Exception( $errorMessage );
    }

    // Check for event-based errors
    if ( isset( $data['event'] ) && $data['event'] === 'response.error' ) {
      $error = $data['error'] ?? [];
      $message = $error['message'] ?? 'Response API error';
      throw new Exception( $message );
    }

    // Fallback to parent error handling
    parent::handle_response_errors( $data );
  }

  /**
  * Add method to reset conversation state
  */
  public function reset_conversation_state() {
    $this->previousResponseId = null;
    $this->conversationState = [];
  }

  /**
   * Check the connection to OpenAI by listing models.
   * This is a free metadata call that verifies API key validity.
   */
  public function connection_check() {
    try {
      $url = $this->get_models_endpoint();
      $response = $this->execute( 'GET', $url );
      
      if ( !isset( $response['data'] ) || !is_array( $response['data'] ) ) {
        throw new Exception( 'Invalid response format from OpenAI' );
      }

      $modelCount = count( $response['data'] );
      $availableModels = [];
      
      // Get first 5 models for display
      $displayModels = array_slice( $response['data'], 0, 5 );
      foreach ( $displayModels as $model ) {
        if ( isset( $model['id'] ) ) {
          $availableModels[] = $model['id'];
        }
      }

      return [
        'success' => true,
        'service' => 'OpenAI',
        'message' => "Connection successful. Found {$modelCount} models.",
        'details' => [
          'endpoint' => $url,
          'model_count' => $modelCount,
          'sample_models' => $availableModels,
          'organization' => $response['organization'] ?? null
        ]
      ];
    }
    catch ( Exception $e ) {
      return [
        'success' => false,
        'service' => 'OpenAI',
        'error' => $e->getMessage(),
        'details' => [
          'endpoint' => $this->get_models_endpoint()
        ]
      ];
    }
  }

  /**
   * Get the models endpoint URL
   */
  protected function get_models_endpoint() {
    $endpoint = null;
    
    // Same logic as build_url to determine the endpoint
    if ( $this->envType === 'openai' ) {
      $endpoint = apply_filters( 'mwai_openai_endpoint', 'https://api.openai.com/v1', $this->env );
    }
    else if ( $this->envType === 'azure' ) {
      $endpoint = isset( $this->env['endpoint'] ) ? $this->env['endpoint'] : null;
    }
    
    if ( empty( $endpoint ) ) {
      throw new Exception( 'Endpoint is not defined for envType: ' . $this->envType );
    }
    
    // Remove any existing API paths to get base URL
    $endpoint = str_replace( '/chat/completions', '', $endpoint );
    $endpoint = str_replace( '/v1/responses', '', $endpoint );
    $endpoint = rtrim( $endpoint, '/' );
    
    // For Azure, we don't need the /v1 prefix
    if ( $this->envType === 'azure' ) {
      // Use the same API version as defined in the parent class
      return $endpoint . '/openai/models?api-version=2024-12-01-preview';
    }
    
    // For OpenAI, ensure we have the /v1 prefix
    if ( strpos( $endpoint, '/v1' ) === false ) {
      $endpoint .= '/v1';
    }
    
    return $endpoint . '/models';
  }

}
