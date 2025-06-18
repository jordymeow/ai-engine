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
class Meow_MWAI_Engines_OpenAI extends Meow_MWAI_Engines_ChatML
{
  // Static
  private static $creating = false;

  // Responses API specific properties
  protected $previousResponseId = null;
  protected $conversationState = [];
  protected $mcpToolNames = [];
  protected $mcpServerCount = 0;
  protected $mcpTotalToolCount = 0;
  protected $emittedFunctionResults = [];

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

  public function __construct( $core, $env )
  {
    $isOwnClass = get_class( $this ) === 'Meow_MWAI_Engines_OpenAI';
    if ( $isOwnClass && !self::$creating ) {
      throw new \Exception( "Please use the create() method to instantiate the Meow_MWAI_Engines_OpenAI class." );
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
      
      
      // Handle based on history strategy
      if ( $historyStrategy === 'response_id' && !empty( $query->previousResponseId ) ) {
        // Use incremental mode with previous_response_id
        $body['previous_response_id'] = $query->previousResponseId;
        
        // Responses API expects message format even with previous_response_id
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
        
        // Add context if present
        if ( !empty( $query->context ) ) {
          // Prepend context as a separate input_text in the same message
          array_unshift( $body['input'][0]['content'], [
            'type' => 'input_text',
            'text' => $query->context . "\n\n"
          ]);
        }
      } else {
        // Use full history mode (internal) or when no previous_response_id
        
        // Build input - always use array format for Responses API
        if ( !empty( $query->messages ) || $query->attachedFile || $query instanceof Meow_MWAI_Query_Feedback ) {
          $body['input'] = $this->build_responses_input_array( $query );
        } else {
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
          } else {
            // Add context as system message
            array_unshift( $body['input'], [
              'role' => 'system',
              'content' => $query->context
            ]);
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

      if ( !empty( $query->maxResults ) && $query->maxResults > 1 ) {
        $body['n'] = $query->maxResults;
      }

      if ( !empty( $query->stop ) ) {
        $body['stop'] = $query->stop;
      }

      if ( !empty( $query->responseFormat ) && $query->responseFormat === 'json' ) {
        $body['response_format'] = [ 'type' => 'json_object' ];
      }

      // Function calling - convert to tools
      if ( !empty( $query->functions ) ) {
        $body['tools'] = $this->build_responses_tools( $query->functions );
        // Debug: Log the tools structure
        Meow_MWAI_Logging::log( 'Responses API tools structure: ' . json_encode( $body['tools'] ) );
      }

      // Add MCP servers if available
      if ( isset( $query->mcpServers ) && is_array( $query->mcpServers ) && ! empty( $query->mcpServers ) ) {
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
                if ( ! empty( $env['token'] ) ) {
                  $mcp_tool['headers'] = [
                    'Authorization' => 'Bearer ' . $env['token']
                  ];
                }
                
                // Add to tools array
                if ( !isset( $body['tools'] ) ) {
                  $body['tools'] = [];
                }
                $body['tools'][] = $mcp_tool;
                
                Meow_MWAI_Logging::log( 'Responses API: Added MCP server ' . $env['name'] . ' to tools' );
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
      } else {
        // Fallback to old API for DALL-E models
        return $this->build_body( $query, $streamCallback );
      }
    }
    
    // Debug logging for feedback queries
    if ( $query instanceof Meow_MWAI_Query_Feedback ) {
      Meow_MWAI_Logging::log( 'Responses API: Feedback query body: ' . json_encode($body) );
    }
    
    // Debug logging for tools
    if ( !empty( $body['tools'] ) ) {
      Meow_MWAI_Logging::log( 'Responses API: Full request body with tools: ' . json_encode($body) );
    }
    

    return $body;
  }

  /**
   * Build input array for complex message structures
   */
  protected function build_responses_input_array( $query ) {
    $messages = [];

    // Add existing messages (they already have the correct format)
    foreach ( $query->messages as $message ) {
      $messages[] = $message;
    }
    
    // Handle feedback queries - add function results
    if ( $query instanceof Meow_MWAI_Query_Feedback && !empty( $query->blocks ) ) {
      Meow_MWAI_Logging::log( 'Responses API: Processing feedback query with ' . count($query->blocks) . ' blocks' );
      
      // First, add the assistant's message with function calls
      if ( $query->lastReply && !empty( $query->lastReply->choices ) ) {
        $lastMessage = $query->lastReply->choices[0]['message'] ?? null;
        if ( $lastMessage && isset( $lastMessage['tool_calls'] ) ) {
          // Responses API requires function calls to be sent as specific message types
          // See: https://platform.openai.com/docs/api-reference/responses
          foreach ( $lastMessage['tool_calls'] as $tool_call ) {
            $messages[] = [
              'type' => 'function_call',
              'id' => $tool_call['id'] ?? null,
              'call_id' => $tool_call['id'] ?? null,
              'name' => $tool_call['function']['name'] ?? '',
              'arguments' => $tool_call['function']['arguments'] ?? '{}'
            ];
            Meow_MWAI_Logging::log( 'Responses API: Added function call message: ' . $tool_call['function']['name'] );
          }
        }
      }
      
      // Then add the function results
      foreach ( $query->blocks as $block ) {
        if ( isset( $block['feedbacks'] ) ) {
          foreach ( $block['feedbacks'] as $feedback ) {
            if ( isset( $feedback['request']['rawMessage']['tool_calls'] ) ) {
              // Responses API expects function results as 'function_call_output' messages
              // The call_id must match the original function call
              $tool_calls = $feedback['request']['rawMessage']['tool_calls'];
              
              // Emit function result event once per feedback (not per tool_call)
              if ( $this->currentDebugMode && !empty( $this->streamCallback ) ) {
                $toolId = $feedback['request']['toolId'] ?? null;
                // Check if we've already emitted an event for this tool
                if ( $toolId && !in_array( $toolId, $this->emittedFunctionResults ) ) {
                  $this->emittedFunctionResults[] = $toolId;
                  
                  $functionName = $feedback['request']['name'] ?? 'unknown';
                  $resultPreview = (string)($feedback['reply']['value'] ?? '');
                  if ( strlen( $resultPreview ) > 100 ) {
                    $resultPreview = substr( $resultPreview, 0, 100 ) . '...';
                  }
                  
                  $event = Meow_MWAI_Event::function_result( $functionName )
                    ->set_metadata( 'result', $resultPreview )
                    ->set_metadata( 'tool_id', $toolId );
                  call_user_func( $this->streamCallback, $event );
                }
              }
              
              // For Responses API, we should only create one function_call_output per feedback
              // The feedback already contains the result for the specific tool call
              $toolId = $feedback['request']['toolId'] ?? null;
              
              // Find the matching tool call
              $matchingToolCall = null;
              foreach ( $tool_calls as $tool_call ) {
                if ( isset( $tool_call['id'] ) && $tool_call['id'] === $toolId ) {
                  $matchingToolCall = $tool_call;
                  break;
                }
              }
              
              // If no matching tool call found by ID, use the first one (backward compatibility)
              if ( !$matchingToolCall && count( $tool_calls ) > 0 ) {
                $matchingToolCall = $tool_calls[0];
              }
              
              if ( $matchingToolCall ) {
                $result_message = [
                  'type' => 'function_call_output',
                  'call_id' => $matchingToolCall['id'] ?? $toolId,
                  'output' => (string)($feedback['reply']['value'] ?? '')
                ];
                $messages[] = $result_message;
                
                Meow_MWAI_Logging::log( 'Responses API: Added function result with call_id ' . $result_message['call_id'] . ': ' . substr($result_message['output'], 0, 100) . (strlen($result_message['output']) > 100 ? '...' : '') );
              }
            }
          }
        }
      }
    }

    // Handle attached files (images)
    if ( $query->attachedFile ) {
      $finalUrl = null;
      if ( $query->image_remote_upload === 'url' ) {
        $finalUrl = $query->attachedFile->get_url();
      } else {
        $finalUrl = $query->attachedFile->get_inline_base64_url();
      }
      
      
      // Use Responses API format with input_text and input_image types
      $messages[] = [
        'role' => 'user',
        'content' => [
          [
            'type' => 'input_text',
            'text' => $query->get_message()
          ],
          [
            'type' => 'input_image',
            'image_url' => $finalUrl  // Direct property, not nested
          ]
        ]
      ];
    } else {
      // For text-only, use input_text type
      $messages[] = [
        'role' => 'user',
        'content' => [
          [
            'type' => 'input_text',
            'text' => $query->get_message()
          ]
        ]
      ];
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
      } else {
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
   * Build URL for Responses API
   */
  protected function build_responses_url() {
    if ( $this->envType === 'azure' ) {
      // Azure uses a different URL structure
      $endpoint = isset( $this->env['endpoint'] ) ? $this->env['endpoint'] : null;
      $url = trailingslashit( $endpoint ) . 'openai/responses?' . $this->azureApiVersion;
    } else {
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
      error_log( 'AI_ENGINE_DEBUG: Streaming type: ' . ($eventType ?? 'no_type') . ' - Data: ' . json_encode( $json ) );
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
        $response = $json['response'] ?? [];
        $outputs = $response['output'] ?? [];
        
        foreach ( $outputs as $output ) {
          if ( $output['type'] === 'function_call' && $output['status'] === 'completed' ) {
            $this->streamToolCalls[] = [
              'id' => $output['call_id'] ?? null,
              'type' => 'function',
              'function' => [
                'name' => $output['name'] ?? '',
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
          Meow_MWAI_Logging::log( 'Responses API: Output item added with type: ' . $itemType );
          
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
            $this->streamToolCalls[] = [
              'id' => $item['call_id'] ?? null,
              'type' => 'function',
              'function' => [
                'name' => $item['name'] ?? '',
                'arguments' => $item['arguments'] ?? '{}'
              ]
            ];
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
                $outputPreview = is_array( $output ) ? json_encode( $output ) : (string)$output;
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
              
              Meow_MWAI_Logging::log( 'Responses API: Stored generated image (base64 length: ' . strlen($base64Image) . ')' );
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
                Meow_MWAI_Logging::log( 'Responses API: MCP tool "' . ($tool['name'] ?? 'unnamed') . '": ' . ($tool['description'] ?? 'no description') );
              }
              if ( $tools_count > 3 ) {
                Meow_MWAI_Logging::log( 'Responses API: ... and ' . ($tools_count - 3) . ' more tools' );
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
          Meow_MWAI_Logging::log( 'Responses API: Content part added with type: ' . $partType );
          
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
          Meow_MWAI_Logging::log( 'Responses API: Received partial image index ' . ($json['partial_image_index'] ?? 'unknown') );
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
        $toolName = isset($this->mcpToolNames[$itemId]) ? $this->mcpToolNames[$itemId] : 'unknown';
        
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
        Meow_MWAI_Logging::error( 'Responses API: MCP tool call failed - ' . ($error['message'] ?? 'Unknown error') );
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
        Meow_MWAI_Logging::error( 'Responses API: MCP tools listing failed - ' . ($error['message'] ?? 'Unknown error') );
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
      $this->streamInTokens = (int)$usage['input_tokens'];
      $this->streamOutTokens = (int)$usage['output_tokens'];
      if ( isset( $usage['cost'] ) ) {
        $this->streamCost = (float)$usage['cost'];
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
   * Override run_completion_query to route to appropriate API
   */
  public function run_completion_query( $query, $streamCallback = null ) : Meow_MWAI_Reply {
    // Debug: Always log which API we're using
    $useResponsesApi = $this->should_use_responses_api( $query->model );
    Meow_MWAI_Logging::log( 'OpenAI Engine: Model ' . $query->model . ' -> ' . ($useResponsesApi ? 'Responses API' : 'ChatML API') );
    
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
  protected function run_responses_completion_query( $query, $streamCallback = null ) : Meow_MWAI_Reply {
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

    try {
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
          Meow_MWAI_Logging::log( 'Responses API: Added ' . count($this->streamImages) . ' images to choices (streaming)' );
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
        
        // Debug: Log that we're using Responses API parsing
        Meow_MWAI_Logging::log( 'Responses API: Starting to parse response data' );
        
        if ( isset( $data['output'] ) && is_array( $data['output'] ) ) {
          foreach ( $data['output'] as $output_item ) {
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
              // Responses API returns function_call type, not tool_call
              $tool_calls[] = [
                'id' => $output_item['call_id'] ?? null,
                'type' => 'function',
                'function' => [
                  'name' => $output_item['name'] ?? '',
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
            } elseif ( is_array( $data['text'] ) ) {
              // Only implode if it's an array of strings, not complex structures
              $textParts = array_filter( $data['text'], 'is_string' );
              if ( !empty( $textParts ) ) {
                $content = implode( '', $textParts );
              }
            }
          } elseif ( isset( $data['content'] ) ) {
            if ( is_array( $data['content'] ) && isset( $data['content'][0]['text'] ) ) {
              $content = $data['content'][0]['text'];
            } elseif ( is_string( $data['content'] ) ) {
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
          Meow_MWAI_Logging::log( 'Responses API: Found ' . count($tool_calls) . ' tool calls' );
        }
        
        $returned_choices = [[ 'message' => $message ]];
        
        // Add images as additional choices
        if ( !empty( $images ) ) {
          foreach ( $images as $base64Image ) {
            $returned_choices[] = [ 'b64_json' => $base64Image ];
          }
          Meow_MWAI_Logging::log( 'Responses API: Added ' . count($images) . ' images to choices' );
        }
        
        // Debug: Log what we're about to set as choices
        Meow_MWAI_Logging::log( 'Responses API: Setting choices with content: "' . $content . '"' );
        Meow_MWAI_Logging::log( 'Responses API: Choice structure: ' . json_encode( $returned_choices ) );
        
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
      $this->handle_tokens_usage( $reply, $query, $returned_model,
        $returned_in_tokens, $returned_out_tokens, $returned_price
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

}
