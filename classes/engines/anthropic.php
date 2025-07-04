<?php

class Meow_MWAI_Engines_Anthropic extends Meow_MWAI_Engines_ChatML {
  // Streaming
  protected $streamInTokens = null;
  protected $streamOutTokens = null;
  protected $streamBlocks;
  protected $streamIsThinking = false;
  protected $mcpServerNames = [];
  protected $mcpTools = []; // Track MCP tools by ID
  protected $mcpToolCount = 0;

  public function __construct( $core, $env ) {
    parent::__construct( $core, $env );
  }

  protected function isMCPTool( $toolName ) {
    // Get all MCP tools from the filter
    $mcpTools = apply_filters( 'mwai_mcp_tools', [] );

    // Log available MCP tools for debugging
    if ( empty( $mcpTools ) ) {
      Meow_MWAI_Logging::log( 'Anthropic: No MCP tools available from filter' );
    }

    foreach ( $mcpTools as $tool ) {
      if ( isset( $tool['name'] ) && $tool['name'] === $toolName ) {
        Meow_MWAI_Logging::log( "Anthropic: Found MCP tool match: {$toolName}" );
        return true;
      }
    }

    // If we have MCP servers but tool not found, it might be an issue
    if ( !empty( $this->mcpServerNames ) && !empty( $toolName ) ) {
      Meow_MWAI_Logging::log( "Anthropic: Tool '{$toolName}' not found in MCP tools list" );
    }

    return false;
  }

  public function reset_stream() {
    $this->streamContent = null;
    $this->streamBuffer = null;
    $this->streamFunctionCall = null;
    $this->streamToolCalls = [];
    $this->streamLastMessage = null;
    $this->streamInTokens = null;
    $this->streamOutTokens = null;
    $this->streamIsThinking = false;
    $this->mcpTools = []; // Reset MCP tools tracking
    $this->textStarted = false; // Reset text started flag
    $this->requestSentEmitted = false; // Reset request sent flag
    $this->emittedFunctionResults = []; // Reset function result tracking

    $this->streamBlocks = [
      'role' => 'assistant',
      'content' => []
    ];

    $this->inModel = null;
    $this->inId = null;
  }

  protected function set_environment() {
    $env = $this->env;
    $this->apiKey = $env['apikey'];
  }

  protected function build_url( $query, $endpoint = null ) {
    $endpoint = apply_filters( 'mwai_anthropic_endpoint', 'https://api.anthropic.com/v1', $this->env );
    if ( $query instanceof Meow_MWAI_Query_Text || $query instanceof Meow_MWAI_Query_Feedback ) {
      $url = trailingslashit( $endpoint ) . 'messages';
    }
    else {
      throw new Exception( 'AI Engine: Unsupported query type.' );
    }
    return $url;
  }

  protected function build_headers( $query ) {
    parent::build_headers( $query );
    $headers = [
      'Content-Type' => 'application/json',
      'x-api-key' => $this->apiKey,
      'anthropic-version' => '2023-06-01',
      'anthropic-beta' => 'tools-2024-04-04, pdfs-2024-09-25, mcp-client-2025-04-04',
      'User-Agent' => 'AI Engine',
    ];
    return $headers;
  }

  public function final_checks( Meow_MWAI_Query_Base $query ) {
    // We skip this completely.
    // maxMessages is handed in build_messages().
  }

  protected function build_messages( $query ) {
    $messages = [];

    // Then, if any, we need to add the 'messages', they are already formatted.
    foreach ( $query->messages as $message ) {
      $messages[] = $message;
    }

    // Handle the maxMessages
    if ( !empty( $query->maxMessages ) ) {
      $messages = array_slice( $messages, -$query->maxMessages );
    }

    // If the first message is not a 'user' role, we remove it.
    if ( !empty( $messages ) && $messages[0]['role'] !== 'user' ) {
      array_shift( $messages );
    }

    if ( $query->attachedFile ) {
      // https://docs.anthropic.com/claude/reference/messages-examples#vision
      // Claude only supports image/jpeg, image/png, image/gif, and image/webp media types.
      $mime = $query->attachedFile->get_mimeType();
      // Claude only supports upload by data (base64), not by URL.
      $data = $query->attachedFile->get_base64();
      $message = $query->get_message();
      $isPDF = $mime === 'application/pdf';
      $isIMG = !$isPDF && $query->attachedFile->is_image();

      if ( $isPDF ) {
        if ( empty( $message ) ) {
          // Claude doesn't support messages with only PDFs, so we add a text message.
          $message = 'I uploaded a PDF. Do not consider this message as part of the conversation.';
        }
        $messages[] = [
          'role' => 'user',
          'content' => [
            [
              'type' => 'text',
              'text' => $message
            ],
            [
              'type' => 'document',
              'source' => [
                'type' => 'base64',
                'media_type' => 'application/pdf',
                'data' => $data
              ]
            ]
          ]
        ];
      }
      else if ( $isIMG ) {
        if ( empty( $message ) ) {
          // Claude doesn't support messages with only images, so we add a text message.
          $message = 'I uploaded an image. Do not consider this message as part of the conversation.';
        }
        $messages[] = [
          'role' => 'user',
          'content' => [
            [
              'type' => 'text',
              'text' => $message
            ],
            [
              'type' => 'image',
              'source' => [
                'type' => 'base64',
                'media_type' => $mime,
                'data' => $data
              ]
            ]
          ]
        ];
      }
    }
    else {
      $messages[] = [ 'role' => 'user', 'content' => $query->get_message() ];
    }

    return $messages;
  }

  // Define a function to recursively replace empty arrays with empty stdClass objects
  // To avoid errors with OpenAI's API
  private function replaceEmptyArrayWithObject( $item ) {
    if ( is_array( $item ) ) {
      if ( empty( $item ) ) {
        return new stdClass(); // Replace empty array with empty object
      }
      foreach ( $item as $key => $value ) {
        $item[$key] = $this->replaceEmptyArrayWithObject( $value ); // Recurse
      }
    }
    return $item;
  }

  protected function build_body( $query, $streamCallback = null, $extra = null ) {
    if ( $query instanceof Meow_MWAI_Query_Feedback ) {
      $body = [
        'model' => $query->model,
        'max_tokens' => $query->maxTokens,
        'temperature' => $query->temperature,
        'stream' => !is_null( $streamCallback ),
        'messages' => []
      ];

      if ( !empty( $query->instructions ) ) {
        $body['system'] = $query->instructions;
      }

      // Build the messages
      $body['messages'][] = [ 'role' => 'user', 'content' => $query->message ];

      if ( !empty( $query->blocks ) ) {
        foreach ( $query->blocks as $feedback_block ) {
          $contentBlock = $feedback_block['rawMessage']['content'];
          
          // Process each content item individually to ensure proper handling of multiple tool_use blocks
          if ( is_array( $contentBlock ) ) {
            foreach ( $contentBlock as &$contentItem ) {
              if ( isset( $contentItem['type'] ) && $contentItem['type'] === 'tool_use' ) {
                // Debug logging for tool_use blocks
                if ( $this->core->get_option( 'queries_debug_mode' ) ) {
                  error_log( 'AI Engine: Anthropic tool_use block - ID: ' . ( $contentItem['id'] ?? 'unknown' ) . 
                    ', Name: ' . ( $contentItem['name'] ?? 'unknown' ) . 
                    ', Input type: ' . gettype( $contentItem['input'] ?? null ) .
                    ', Input value: ' . json_encode( $contentItem['input'] ?? null ) );
                }
                
                // Ensure input is an object, not an array
                if ( isset( $contentItem['input'] ) ) {
                  if ( empty( $contentItem['input'] ) || ( is_array( $contentItem['input'] ) && count( $contentItem['input'] ) === 0 ) ) {
                    $contentItem['input'] = new stdClass();
                  } else {
                    // Apply replaceEmptyArrayWithObject only to the input field
                    $contentItem['input'] = $this->replaceEmptyArrayWithObject( $contentItem['input'] );
                  }
                } else {
                  $contentItem['input'] = new stdClass();
                }
                
                // Debug logging after conversion
                if ( $this->core->get_option( 'queries_debug_mode' ) ) {
                  error_log( 'AI Engine: After conversion - Input type: ' . gettype( $contentItem['input'] ) .
                    ', Input value: ' . json_encode( $contentItem['input'] ) );
                }
              }
            }
            unset( $contentItem );
          }
          
          // Final debug logging before adding the message
          if ( $this->core->get_option( 'queries_debug_mode' ) && is_array( $contentBlock ) ) {
            error_log( 'AI Engine: Final contentBlock being added to messages: ' . json_encode( $contentBlock ) );
          }
          
          $assistantMessageIndex = count( $body['messages'] );
          $body['messages'][] = [
            'role' => 'assistant',
            'content' => $contentBlock
          ];

          // Collect all tool results for this message
          $toolResults = [];
          
          foreach ( $feedback_block['feedbacks'] as $feedback ) {
            $feedbackValue = $feedback['reply']['value'];
            if ( !is_string( $feedbackValue ) ) {
              $feedbackValue = json_encode( $feedbackValue );
            }

            $toolResults[] = [
              'type' => 'tool_result',
              'tool_use_id' => $feedback['request']['toolId'],
              'content' => [
                [
                  'type' => 'text',
                  'text' => $feedbackValue
                ]
              ],
              'is_error' => false // Cool, Anthropic supports errors!
            ];

            // Note: Function result events are now emitted centrally in core.php
            // when the function is actually executed
          }
          
          // Add all tool results in a single user message
          // Anthropic requires all tool_results for a message to be in one content array
          if ( !empty( $toolResults ) ) {
            $body['messages'][] = [
              'role' => 'user',
              'content' => $toolResults
            ];
          }
        }
      }

      // TODO: This WAS COPIED FROM BELOW
      // Support for functions
      if ( !empty( $query->functions ) ) {
        $model = $this->retrieve_model_info( $query->model );
        if ( !empty( $model['tags'] ) && !in_array( 'functions', $model['tags'] ) ) {
          Meow_MWAI_Logging::warn( 'The model "' . $query->model . '" doesn\'t support Function Calling.' );
        }
        else {
          $body['tools'] = [];
          // Dynamic function: they will interactively enhance the completion (tools).
          foreach ( $query->functions as $function ) {
            $body['tools'][] = $function->serializeForAnthropic();
          }
          // Static functions: they will be executed at the end of the completion.
          //$body['function_call'] = $query->functionCall;
        }
      }

      // To avoid errors with Anthropic's API, we need to replace empty arrays with empty objects
      // Note: We've already handled tool_use inputs above, so no need to process them again
      return $body;
    }
    else if ( $query instanceof Meow_MWAI_Query_Text ) {
      $body = [
        'model' => $query->model,
        'stream' => !is_null( $streamCallback ),
      ];

      if ( !empty( $query->maxTokens ) ) {
        $body['max_tokens'] = $query->maxTokens;
      }
      else {
        // https://docs.anthropic.com/en/docs/about-claude/models#model-comparison-table
        $body['max_tokens'] = 4096;
      }

      if ( !empty( $query->temperature ) ) {
        $body['temperature'] = $query->temperature;
      }

      if ( !empty( $query->stop ) ) {
        $body['stop'] = $query->stop;
      }

      // First, we need to add the first message (the instructions).
      if ( !empty( $query->instructions ) ) {
        $body['system'] = $query->instructions;
      }

      // If there is a context, we need to add it.
      if ( !empty( $query->context ) ) {
        if ( empty( $body['system'] ) ) {
          $body['system'] = '';
        }
        $body['system'] = empty( $body['system'] ) ? '' : $body['system'] . "\n\n";
        $body['system'] = $body['system'] . "Context:\n\n" . $query->context;
      }

      // Support for functions
      if ( !empty( $query->functions ) ) {
        $model = $this->retrieve_model_info( $query->model );
        if ( !empty( $model['tags'] ) && !in_array( 'functions', $model['tags'] ) ) {
          Meow_MWAI_Logging::warn( 'The model "' . $query->model . '" doesn\'t support Function Calling.' );
        }
        else {
          $body['tools'] = [];
          // Dynamic function: they will interactively enhance the completion (tools).
          foreach ( $query->functions as $function ) {
            $body['tools'][] = $function->serializeForAnthropic();
          }
          // Static functions: they will be executed at the end of the completion.
          //$body['function_call'] = $query->functionCall;
        }
      }

      $body['messages'] = $this->build_messages( $query );

      // Add MCP servers if available
      if ( isset( $query->mcpServers ) && is_array( $query->mcpServers ) && !empty( $query->mcpServers ) ) {
        $body['mcp_servers'] = [];
        $mcp_envs = $this->core->get_option( 'mcp_envs' );
        $this->mcpServerNames = []; // Reset MCP server names

        foreach ( $query->mcpServers as $mcpServer ) {
          if ( isset( $mcpServer['id'] ) ) {
            // Find the full MCP server configuration by ID
            foreach ( $mcp_envs as $env ) {
              if ( $env['id'] === $mcpServer['id'] ) {
                $mcp_config = [
                  'type' => 'url',
                  'url' => $env['url'],
                  'name' => $env['name'],
                  'tool_configuration' => [
                    'enabled' => true
                  ]
                ];

                // Add authorization token if available
                if ( !empty( $env['token'] ) ) {
                  $mcp_config['authorization_token'] = $env['token'];
                }

                $body['mcp_servers'][] = $mcp_config;
                $this->mcpServerNames[] = $env['name']; // Track MCP server names
                break;
              }
            }
          }
        }
      }

      return $body;
    }
    else {
      throw new Exception( 'AI Engine: Unsupported query type.' );
    }
  }

  protected function stream_data_handler( $json ) {
    $content = null;
    $type = !empty( $json['type'] ) ? $json['type'] : null;
    if ( is_null( $type ) ) {
      return $content;
    }

    if ( $type === 'message_start' ) {
      $usage = $json['message']['usage'];
      $this->streamInTokens = $usage['input_tokens'];
      $this->inModel = $json['message']['model'];
      $this->inId = $json['message']['id'];

      // Send MCP discovery event if MCP servers are configured
      if ( $this->currentDebugMode && $this->streamCallback ) {
        if ( !empty( $this->mcpServerNames ) ) {
          $serverCount = count( $this->mcpServerNames );

          // Get MCP tools count
          $mcpTools = apply_filters( 'mwai_mcp_tools', [] );
          $toolCount = count( $mcpTools );

          $event = Meow_MWAI_Event::mcp_discovery( $serverCount, $toolCount )
            ->set_metadata( 'servers', $this->mcpServerNames );
          call_user_func( $this->streamCallback, $event );
        }
      }
    }
    else if ( $type === 'content_block_start' ) {
      $this->streamBlocks['content'][] = $json['content_block'];

      // Send "Generating response..." when we start a text block
      if ( $this->currentDebugMode && $this->streamCallback ) {
        $block = $json['content_block'];
        if ( $block['type'] === 'text' && !isset( $this->textStarted ) ) {
          $this->textStarted = true;
          $event = Meow_MWAI_Event::generating_response();
          call_user_func( $this->streamCallback, $event );
        }
      }
    }
    else if ( $type === 'content_block_delta' ) {
      $index = $json['index'];
      $block = $this->streamBlocks['content'][$index];
      if ( $json['delta']['type'] === 'text_delta' ) {
        $block['text'] .= $json['delta']['text'];
        $isThinkingStart = strpos( $block['text'], '<thinking' ) === 0;
        $isThinkingEnd = strpos( $block['text'], '</thinking>' ) === 0;

        if ( $isThinkingStart ) {
          $this->streamIsThinking = true;
          // Send thinking start event
          if ( $this->currentDebugMode && $this->streamCallback ) {
            $event = Meow_MWAI_Event::thinking( 'Thinking...' );
            call_user_func( $this->streamCallback, $event );
          }
        }
        if ( $isThinkingEnd ) {
          $this->streamIsThinking = false;
          // Send thinking end event
          if ( $this->currentDebugMode && $this->streamCallback ) {
            $event = Meow_MWAI_Event::thinking( 'Thinking completed.' )
              ->set_metadata( 'status', 'completed' );
            call_user_func( $this->streamCallback, $event );
          }
        }
        $content = $json['delta']['text'];
      }
      else if ( $json['delta']['type'] === 'input_json_delta' ) {
        // Somehow, the input is set as an array, but it should be a string since it's JSON.
        $block['input'] = is_array( $block['input'] ) ? '' : $block['input'];
        $block['input'] .= $json['delta']['partial_json'];

        // Skip sending tool arguments event - too verbose
        // if ( $this->currentDebugMode && $this->streamCallback && isset($block['type']) && $block['type'] === 'tool_use' ) {
        //   $event = ( new Meow_MWAI_Event( 'live', MWAI_STREAM_TYPES['TOOL_ARGS'] ) )
        //     ->set_content( 'Streaming tool arguments...' )
        //     ->set_metadata( 'tool_name', $block['name'] ?? 'unknown' )
        //     ->set_metadata( 'partial_args', $json['delta']['partial_json'] );
        //   call_user_func( $this->streamCallback, $event );
        // }
      }
      $this->streamBlocks['content'][$index] = $block;
    }
    // At the end of a block, let's look for any 'input' not yet decoded from JSON
    else if ( $type === 'content_block_stop' ) {
      $index = $json['index'];
      $block = $this->streamBlocks['content'][$index];
      if ( isset( $block['input'] ) && is_string( $block['input'] ) ) {
        $block['input'] = json_decode( $block['input'], true );
      }
      
      // For tool_use blocks, ensure empty inputs are objects, not arrays
      if ( $block['type'] === 'tool_use' && isset( $block['input'] ) ) {
        if ( empty( $block['input'] ) || ( is_array( $block['input'] ) && count( $block['input'] ) === 0 ) ) {
          $block['input'] = new stdClass();
        }
      }
      
      $this->streamBlocks['content'][$index] = $block;

      // Send event for content block completion
      if ( $this->currentDebugMode && $this->streamCallback ) {
        if ( $block['type'] === 'mcp_tool_use' ) {
          // Store the tool name for later lookup when we get the result
          $this->mcpTools[$block['id']] = $block['name'];

          $event = Meow_MWAI_Event::mcp_calling( $block['name'], $block['id'], $block['input'] ?? [] )
                    ->set_metadata( 'server_name', $block['server_name'] ?? 'unknown' );
          call_user_func( $this->streamCallback, $event );
        }
        else if ( $block['type'] === 'mcp_tool_result' ) {
          // Look up the tool name from the tool_use_id
          $tool_use_id = $block['tool_use_id'] ?? '';
          $tool_name = isset( $this->mcpTools[$tool_use_id] ) ? $this->mcpTools[$tool_use_id] : 'unknown';

          $event = Meow_MWAI_Event::mcp_result( $tool_name, $tool_use_id )
            ->set_metadata( 'content', $block['content'] ?? '' );
          call_user_func( $this->streamCallback, $event );
        }
        else if ( $block['type'] === 'tool_use' ) {
          // Regular tool use (non-MCP)
          $event = Meow_MWAI_Event::function_calling( $block['name'] ?? 'unknown', $block['input'] ?? [] )
                  ->set_metadata( 'tool_id', $block['id'] ?? '' );
          call_user_func( $this->streamCallback, $event );
        }
        else if ( $block['type'] === 'text' ) {
          // Don't send any event here - the text generation is handled by content deltas
          // and completion is handled by message_stop
        }
        else if ( $block['type'] === 'ping' ) {
          // https://docs.anthropic.com/en/docs/build-with-claude/streaming#ping-events
        }
        else {
          Meow_MWAI_Logging::log( 'Anthropic: Unknown block type in content_block_stop: ' . $block['type'] );
        }
      }
    }
    else if ( $type === 'message_delta' ) {
      $usage = $json['usage'];
      $this->streamOutTokens = $usage['output_tokens'];
    }
    else if ( $type === 'error' ) {
      $error = $json['error'];
      $message = $error['message'];

      // Send error event
      if ( $this->currentDebugMode && $this->streamCallback ) {
        $event = Meow_MWAI_Event::error( $message )
          ->set_metadata( 'error_type', $error['type'] ?? 'unknown' );
        call_user_func( $this->streamCallback, $event );
      }

      throw new Exception( $message );
    }
    else if ( $type === 'message_stop' ) {
      // Skip sending completion event - too verbose
      // if ( $this->currentDebugMode && $this->streamCallback ) {
      //   $event = Meow_MWAI_Event::stream_completed()
      //     ->set_metadata( 'total_tokens', ($this->streamInTokens ?? 0) + ($this->streamOutTokens ?? 0) );
      //   call_user_func( $this->streamCallback, $event );
      // }
    }
    else {
      Meow_MWAI_Logging::log( "Anthropic: Unknown stream data type: $type" );
    }

    // Avoid some endings
    $endings = [ '<|im_end|>', '</s>' ];
    if ( in_array( $content, $endings ) ) {
      $content = null;
    }

    // If the stream is thinking, we don't want to return anything yet.
    if ( $this->streamIsThinking ) {
      $content = null;
    }

    return ( $content === '0' || !empty( $content ) ) ? $content : null;
  }

  // This create the "choices" (even though, often, it is only one choice).
  // It is basically the reply, but one that is understood by the Meow_MWAI_Reply class.
  public function create_choices( $data ) {
    $returned_choices = [];
    $tool_calls = [];
    $text_content = '';
    
    // First, collect all tool calls and text content
    foreach ( $data['content'] as $content ) {
      if ( $content['type'] === 'tool_use' ) {
        // Collect all tool calls
        $arguments = $content['input'] ?? new stdClass();
        
        // Ensure arguments is properly formatted
        if ( empty( $arguments ) ) {
          $arguments = new stdClass();
        } else if ( is_array( $arguments ) && count( $arguments ) === 0 ) {
          $arguments = new stdClass();
        }
        
        $tool_calls[] = [
          'id' => $content['id'],
          'type' => 'function',
          'function' => [
            'name' => $content['name'],
            'arguments' => $arguments,
          ]
        ];
      }
      else if ( $content['type'] === 'text' ) {
        $text_content .= $content['text'];
      }
    }
    
    // Create a single choice with both tool calls and text content (like OpenAI does)
    $message = [];
    
    if ( !empty( $text_content ) ) {
      $message['content'] = $text_content;
    }
    
    if ( !empty( $tool_calls ) ) {
      $message['tool_calls'] = $tool_calls;
    }
    
    // Only create a choice if there's content or tool calls
    if ( !empty( $message ) ) {
      $returned_choices[] = [
        'message' => $message
      ];
    }
    
    return $returned_choices;
  }

  /**
   * Override reset to include Anthropic-specific state
   */
  protected function reset_request_state() {
    parent::reset_request_state();
    
    // Reset Anthropic-specific state
    $this->mcpTools = [];
    $this->mcpToolCount = 0;
    // Note: mcpServerNames is configuration, not request state
  }

  public function run_completion_query( $query, $streamCallback = null ): Meow_MWAI_Reply {
    // Reset request-specific state to prevent leakage between requests
    $this->reset_request_state();
    
    $isStreaming = !is_null( $streamCallback );

    // Initialize debug mode
    $this->init_debug_mode( $query );

    if ( $isStreaming ) {
      $this->streamCallback = $streamCallback;
      add_action( 'http_api_curl', [ $this, 'stream_handler' ], 10, 3 );
    }

    $this->reset_stream();
    $data = null;
    $body = $this->build_body( $query, $streamCallback );
    $url = $this->build_url( $query );
    $headers = $this->build_headers( $query );
    $options = $this->build_options( $headers, $body );

    // Emit "Request sent" event for feedback queries
    if ( $this->currentDebugMode && !empty( $streamCallback ) && 
         ( $query instanceof Meow_MWAI_Query_Feedback || $query instanceof Meow_MWAI_Query_AssistFeedback ) ) {
      $event = Meow_MWAI_Event::request_sent()
        ->set_metadata( 'is_feedback', true )
        ->set_metadata( 'feedback_count', count( $query->blocks ) );
      call_user_func( $streamCallback, $event );
    }

    try {
      $res = $this->run_query( $url, $options, $streamCallback );
      $reply = new Meow_MWAI_Reply( $query );
      $returned_id = null;
      $returned_model = null;
      $returned_choices = [];

      // Streaming Mode
      if ( $isStreaming ) {
        $returned_id = $this->inId;
        $returned_model = $this->inModel ? $this->inModel : $query->model;
        if ( !is_null( $this->streamInTokens && !is_null( $this->streamOutTokens ) ) ) {
          $returned_in_tokens = $this->streamInTokens;
          $returned_out_tokens = $this->streamOutTokens;
        }
        $data = $this->streamBlocks;
        
        // Clean up streaming data as well
        if ( isset( $data['content'] ) && is_array( $data['content'] ) ) {
          foreach ( $data['content'] as &$content ) {
            if ( $content['type'] === 'tool_use' && isset( $content['input'] ) ) {
              if ( empty( $content['input'] ) || ( is_array( $content['input'] ) && count( $content['input'] ) === 0 ) ) {
                $content['input'] = new stdClass();
              }
            }
          }
          unset( $content );
        }
        
        $returned_choices = $this->create_choices( $this->streamBlocks );
      }
      // Standard Mode
      else {
        $data = $res['data'];
        
        // Clean up tool_use inputs in the raw data BEFORE it gets stored
        if ( isset( $data['content'] ) && is_array( $data['content'] ) ) {
          foreach ( $data['content'] as &$content ) {
            if ( $content['type'] === 'tool_use' && isset( $content['input'] ) ) {
              if ( empty( $content['input'] ) || ( is_array( $content['input'] ) && count( $content['input'] ) === 0 ) ) {
                $content['input'] = new stdClass();
              }
            }
          }
          unset( $content );
        }
        
        $returned_id = $data['id'];
        $returned_model = $data['model'];
        $usage = $data['usage'];
        if ( !empty( $usage ) ) {
          $returned_in_tokens = isset( $usage['input_tokens'] ) ? $usage['input_tokens'] : null;
          $returned_out_tokens = isset( $usage['output_tokens'] ) ? $usage['output_tokens'] : null;
        }
        $returned_choices = $this->create_choices( $data );
      }


      $reply->set_choices( $returned_choices, $data );
      if ( !empty( $returned_id ) ) {
        $reply->set_id( $returned_id );
      }

      // Handle tokens.
      $this->handle_tokens_usage(
        $reply,
        $query,
        $returned_model,
        $returned_in_tokens,
        $returned_out_tokens
      );

      return $reply;
    }
    catch ( Exception $e ) {
      $error = $e->getMessage();
      $json = json_decode( $error, true );
      if ( json_last_error() === JSON_ERROR_NONE ) {
        if ( isset( $json['error'] ) && isset( $json['error']['message'] ) ) {
          $error = $json['error']['message'];
        }
      }
      Meow_MWAI_Logging::error( '(Anthropic) ' . $error );
      $service = $this->get_service_name();
      $message = "From $service: " . $error;
      throw new Exception( $message );
    }
    finally {
      if ( $isStreaming ) {
        remove_action( 'http_api_curl', [ $this, 'stream_handler' ] );
      }
    }
  }

  protected function build_options( $headers, $json = null, $forms = null, $method = 'POST' ) {
    $body = null;
    if ( !empty( $forms ) ) {
      $boundary = wp_generate_password( 24, false );
      $headers['Content-Type'] = 'multipart/form-data; boundary=' . $boundary;
      $body = $this->build_form_body( $forms, $boundary );
    }
    else if ( !empty( $json ) ) {
      // For Anthropic, we need to ensure empty objects stay as objects, not arrays
      // JSON_FORCE_OBJECT would force everything to be an object, which we don't want
      // Instead, we've already converted empty arrays to stdClass in build_body
      $body = json_encode( $json );
      
      // Debug logging to verify JSON encoding
      if ( $this->core->get_option( 'queries_debug_mode' ) ) {
        // Check if the body contains tool_use blocks with empty inputs
        if ( strpos( $body, '"tool_use"' ) !== false ) {
          error_log( 'AI Engine: Anthropic JSON body after encoding (first 1000 chars): ' . substr( $body, 0, 1000 ) );
          
          // Check specifically for "input":[] which would be wrong
          if ( strpos( $body, '"input":[]' ) !== false ) {
            error_log( 'AI Engine: WARNING - Found "input":[] in JSON body, this should be "input":{} for Anthropic API' );
          }
        }
      }
    }
    $options = [
      'headers' => $headers,
      'method' => $method,
      'timeout' => MWAI_TIMEOUT,
      'body' => $body,
      'sslverify' => false
    ];
    return $options;
  }

  protected function get_service_name() {
    return 'Anthropic';
  }

  public function get_models() {
    return apply_filters( 'mwai_anthropic_models', MWAI_ANTHROPIC_MODELS );
  }

  public static function get_models_static() {
    return MWAI_ANTHROPIC_MODELS;
  }

  public function handle_tokens_usage(
    $reply,
    $query,
    $returned_model,
    $returned_in_tokens,
    $returned_out_tokens,
    $returned_price = null
  ) {
    $returned_in_tokens = !is_null( $returned_in_tokens ) ?
      $returned_in_tokens : $reply->get_in_tokens( $query );
    $returned_out_tokens = !is_null( $returned_out_tokens ) ?
      $returned_out_tokens : $reply->get_out_tokens();
    if ( !empty( $reply->id ) ) {
      // Would be cool to retrieve the usage from the API, but it's not possible.
    }
    $usage = $this->core->record_tokens_usage( $returned_model, $returned_in_tokens, $returned_out_tokens );
    $reply->set_usage( $usage );

    // Set accuracy based on data availability
    if ( !is_null( $returned_in_tokens ) && !is_null( $returned_out_tokens ) ) {
      // Anthropic provides token counts from API = tokens accuracy
      $reply->set_usage_accuracy( 'tokens' );
    } else {
      // Fallback to estimated
      $reply->set_usage_accuracy( 'estimated' );
    }
  }

  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply ) {
    return parent::get_price( $query, $reply );
  }

  /**
   * Check the connection to Anthropic by listing available models.
   * Anthropic doesn't provide a models endpoint, so we just verify authentication works.
   */
  public function connection_check() {
    try {
      // Get the endpoint
      $endpoint = apply_filters( 'mwai_anthropic_endpoint', 'https://api.anthropic.com/v1', $this->env );
      
      // For Anthropic, we'll use the messages endpoint with a minimal request to verify auth
      $url = trailingslashit( $endpoint ) . 'messages';
      
      // Create a minimal query just to test authentication
      $testBody = [
        'model' => 'claude-3-haiku-20240307',  // Use cheapest model
        'max_tokens' => 1,
        'messages' => [
          ['role' => 'user', 'content' => 'Hi']
        ],
        'metadata' => [
          'user_id' => 'connection_test'
        ]
      ];
      
      // Build headers with a dummy query
      $dummyQuery = new Meow_MWAI_Query_Text( 'test' );
      $headers = $this->build_headers( $dummyQuery );
      $options = $this->build_options( $headers, $testBody );
      
      // Try to make a minimal request
      $response = $this->run_query( $url, $options );
      
      // If we get here without exception, the API key is valid
      // Get the list of available models from our constants
      $models = $this->get_models();
      $modelNames = array_map( function( $model ) {
        return $model['model'] ?? $model['name'] ?? 'unknown';
      }, $models );
      
      return [
        'models' => array_slice( $modelNames, 0, 10 ),  // Return first 10 models
        'service' => 'Anthropic'
      ];
    }
    catch ( Exception $e ) {
      // Check if it's an authentication error
      $message = $e->getMessage();
      if ( strpos( $message, 'authentication_error' ) !== false || 
           strpos( $message, 'invalid x-api-key' ) !== false ||
           strpos( $message, '401' ) !== false ) {
        throw new Exception( 'Invalid API key' );
      }
      throw new Exception( 'Connection failed: ' . $message );
    }
  }
}
