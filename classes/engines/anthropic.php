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
  protected $textStarted = false; // Track if text streaming has started
  protected $requestSentEmitted = false; // Track if request sent event was emitted

  public function __construct( $core, $env ) {
    parent::__construct( $core, $env );
  }

  /**
   * Prepare query by uploading files to Anthropic Files API.
   *
   * This method is called BEFORE streaming hooks are attached and BEFORE build_body().
   * It uploads PDF files to Anthropic's Files API and converts them from 'refId' type
   * to 'provider_file_id' type, which build_body() will then use to construct the API request.
   *
   * Flow:
   * 1. prepare_query() uploads files to Anthropic Files API → gets file_id (e.g., file_abc123)
   * 2. Replaces DroppedFile from type 'refId' to type 'provider_file_id'
   * 3. build_body() reads provider_file_id and includes it in message content
   *
   * @param Meow_MWAI_Query_Base $query The query with potential file attachments
   */
  protected function prepare_query( $query ) {
    // Get all attachments using the unified method
    $attachments = method_exists( $query, 'getAttachments' ) ? $query->getAttachments() : [];

    if ( empty( $attachments ) ) {
      return;
    }

    // Check if code_interpreter is enabled
    $hasCodeInterpreter = !empty( $query->tools ) && is_array( $query->tools ) && in_array( 'code_interpreter', $query->tools );

    // MIME types supported by Code Execution tool (container_upload)
    $codeExecutionMimes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/json',
      'application/xml',
      'text/xml',
      'text/plain',
      'text/markdown',
    ];

    // Process each attachment - upload files to Anthropic Files API
    foreach ( $attachments as $index => $file ) {
      $mimeType = $file->get_mimeType() ?? '';
      $isPDF = strpos( $mimeType, 'application/pdf' ) === 0;
      $isImage = $file->is_image();
      $isCodeExecutionFile = $hasCodeInterpreter && in_array( $mimeType, $codeExecutionMimes );

      // Skip files already uploaded (type = provider_file_id)
      if ( $file->get_type() === 'provider_file_id' ) {
        continue;
      }

      // Upload PDFs to Files API (always)
      // Upload other documents to Files API only if code_interpreter is enabled
      if ( $isPDF || $isCodeExecutionFile ) {
        try {
          // Get file data from WordPress uploads directory
          $refId = $file->get_refId();
          $data = $this->core->files->get_data( $refId );
          $filename = $file->get_filename();

          // Upload to Anthropic Files API
          $uploadedFile = $this->upload_file( $filename, $data, $mimeType );
          $fileId = $uploadedFile['id'] ?? null;

          if ( $fileId ) {
            // Store provider file_id in metadata for cleanup later
            $localFileId = $this->core->files->get_id_from_refId( $refId );
            if ( $localFileId ) {
              $this->core->files->add_metadata( $localFileId, 'file_id', $fileId );
              $this->core->files->add_metadata( $localFileId, 'provider', 'anthropic' );
            }

            // Replace the file object in attachedFiles array with provider_file_id type
            if ( !empty( $query->attachedFiles ) && isset( $query->attachedFiles[$index] ) ) {
              $query->attachedFiles[$index] = Meow_MWAI_Query_DroppedFile::from_provider_file_id(
                $fileId,
                'analysis',
                $file->get_mimeType()
              );
            }
            // Also update legacy attachedFile if this is the first file
            if ( $index === 0 && !empty( $query->attachedFile ) ) {
              $query->attachedFile = Meow_MWAI_Query_DroppedFile::from_provider_file_id(
                $fileId,
                'analysis',
                $file->get_mimeType()
              );
            }

            if ( $isCodeExecutionFile ) {
              Meow_MWAI_Logging::log( "Anthropic: Uploaded file for code execution: {$filename} ({$mimeType}) -> {$fileId}" );
            }
          }
        }
        catch ( Exception $e ) {
          error_log( '[AI Engine] Failed to upload file to Anthropic Files API: ' . $e->getMessage() );
          // Keep the original file - build_messages() will fall back to base64 for PDFs
        }
      }
    }
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
      'anthropic-beta' => 'prompt-caching-2024-07-31, tools-2024-04-04, pdfs-2024-09-25, mcp-client-2025-04-04, files-api-2025-04-14, code-execution-2025-08-25',
      'User-Agent' => 'AI Engine',
    ];
    return $headers;
  }

  public function final_checks( Meow_MWAI_Query_Base $query ) {
    // We skip this completely.
    // maxMessages is handed in build_messages().
  }

  /**
   * Build messages array for Anthropic API request.
   *
   * This method constructs the 'messages' array that will be sent to Anthropic's API.
   * It processes both conversation history and file attachments.
   *
   * CRITICAL: This method handles BOTH single file (attachedFile) and multi-file (attachedFiles).
   * The attachedFiles array is the PRIMARY path for multi-file uploads.
   *
   * @param Meow_MWAI_Query_Text $query The query to build messages from
   * @return array Messages formatted for Anthropic API
   */
  protected function build_messages( $query ) {
    $messages = [];

    // Add conversation history (previous messages)
    foreach ( $query->messages as $message ) {
      $messages[] = $message;
    }

    // Limit message history if maxMessages is set
    if ( !empty( $query->maxMessages ) ) {
      $messages = array_slice( $messages, -$query->maxMessages );
    }

    // Anthropic requires first message to have 'user' role
    if ( !empty( $messages ) && $messages[0]['role'] !== 'user' ) {
      array_shift( $messages );
    }

    // =====================================================================
    // FILE UPLOAD: Process all attachments (unified approach)
    // =====================================================================
    // Uses getAttachments() which returns both attachedFiles and legacy attachedFile
    $attachments = method_exists( $query, 'getAttachments' ) ? $query->getAttachments() : [];
    if ( !empty( $attachments ) ) {
      $message = $query->get_message();
      if ( empty( $message ) ) {
        $message = 'I uploaded files. Do not consider this message as part of the conversation.';
      }

      // Build content array: [text, document, document, ...] or [text, image, image, ...]
      $content = [
        [
          'type' => 'text',
          'text' => $message
        ]
      ];

      // MIME types that require Code Execution tool (container_upload)
      $codeExecutionMimes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/json',
        'application/xml',
        'text/xml',
        'text/plain',
        'text/markdown',
      ];

      // Process each file and add to content array
      foreach ( $attachments as $file ) {
        $mime = $file->get_mimeType();
        $isPDF = $mime === 'application/pdf';
        $isIMG = !$isPDF && $file->is_image();
        $isProviderFile = $file->get_type() === 'provider_file_id';
        $isCodeExecutionFile = in_array( $mime, $codeExecutionMimes, true );

        // ===== CODE EXECUTION FILES (DOCX, XLSX, CSV, etc.) =====
        // These are uploaded via Files API and used with container_upload block
        if ( $isCodeExecutionFile && $isProviderFile ) {
          $fileId = $file->get_refId();
          $content[] = [
            'type' => 'container_upload',
            'file_id' => $fileId
          ];
          continue;
        }

        // ===== PDF FILES =====
        if ( $isPDF ) {
          $documentSource = null;
          if ( $isProviderFile ) {
            // File was uploaded in prepare_query() - use file_id reference
            // This is the EXPECTED path after prepare_query() runs
            $fileId = $file->get_refId();
            $documentSource = [
              'type' => 'file',
              'file_id' => $fileId  // e.g., file_011CTkNhtS6cU3CKcvTPCfvw
            ];
          }
          else {
            // Fallback: File not uploaded yet (shouldn't happen if prepare_query ran)
            // This handles edge cases where prepare_query was skipped
            try {
              $refId = $file->get_refId();
              $data = $this->core->files->get_data( $refId );
              $filename = $file->get_filename();
              $uploadedFile = $this->upload_file( $filename, $data, $mime );
              $fileId = $uploadedFile['id'] ?? null;

              if ( $fileId ) {
                // Store provider file_id in metadata for cleanup later
                $localFileId = $this->core->files->get_id_from_refId( $refId );
                if ( $localFileId ) {
                  $this->core->files->add_metadata( $localFileId, 'file_id', $fileId );
                  $this->core->files->add_metadata( $localFileId, 'provider', 'anthropic' );
                }

                $documentSource = [
                  'type' => 'file',
                  'file_id' => $fileId
                ];
              }
              else {
                throw new Exception( 'Upload failed - no file_id returned' );
              }
            }
            catch ( Exception $e ) {
              error_log( '[AI Engine] Failed to upload PDF to Anthropic Files API: ' . $e->getMessage() . ', falling back to base64' );
              // Last resort: base64 encoding (less efficient)
              $data = $file->get_base64();
              $documentSource = [
                'type' => 'base64',
                'media_type' => 'application/pdf',
                'data' => $data
              ];
            }
          }

          // Add document to content array
          $content[] = [
            'type' => 'document',
            'source' => $documentSource
          ];
        }
        // ===== IMAGE FILES =====
        else if ( $isIMG ) {
          $imageSource = null;
          if ( $isProviderFile ) {
            // Use file_id reference (if uploaded to Files API)
            $fileId = $file->get_refId();
            $imageSource = [
              'type' => 'file',
              'file_id' => $fileId
            ];
          }
          else {
            // Use base64 encoding (standard for images)
            $data = $file->get_base64();
            $imageSource = [
              'type' => 'base64',
              'media_type' => $mime,
              'data' => $data
            ];
          }

          // Add image to content array
          $content[] = [
            'type' => 'image',
            'source' => $imageSource
          ];
        }
      }

      // Add the complete message with all files to messages array
      $messages[] = [
        'role' => 'user',
        'content' => $content  // [text, document, document] or [text, image, image]
      ];
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
        $body['system'] = [
          [
            'type' => 'text',
            'text' => $query->instructions,
            'cache_control' => [ 'type' => 'ephemeral' ]
          ]
        ];
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
                  }
                  else {
                    // Apply replaceEmptyArrayWithObject only to the input field
                    $contentItem['input'] = $this->replaceEmptyArrayWithObject( $contentItem['input'] );
                  }
                }
                else {
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

      // Build system prompt with caching support.
      // Instructions are cached (static per chatbot), context is not (varies per query).
      $systemBlocks = [];
      if ( !empty( $query->instructions ) ) {
        $systemBlocks[] = [
          'type' => 'text',
          'text' => $query->instructions,
          'cache_control' => [ 'type' => 'ephemeral' ]
        ];
      }
      if ( !empty( $query->context ) ) {
        $framedContext = $this->core->frame_context( $query->context );
        $systemBlocks[] = [
          'type' => 'text',
          'text' => $framedContext
        ];
      }
      if ( !empty( $systemBlocks ) ) {
        $body['system'] = $systemBlocks;
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

      // Add code_execution tool if code_interpreter is enabled
      if ( !empty( $query->tools ) && is_array( $query->tools ) && in_array( 'code_interpreter', $query->tools ) ) {
        if ( !isset( $body['tools'] ) ) {
          $body['tools'] = [];
        }
        $body['tools'][] = [
          'type' => 'code_execution_20250825',
          'name' => 'code_execution'
        ];
        Meow_MWAI_Logging::log( 'Anthropic: Added code_execution tool to request' );
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
        if ( $block['type'] === 'text' && !$this->textStarted ) {
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
    else if ( $type === 'keepalive' ) {
      // Forward keepalive as SSE comment to keep browser connection alive during long MCP calls
      echo ": keepalive\n\n";
      if ( ob_get_level() > 0 ) {
        ob_end_flush();
      }
      flush();
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
        }
        else if ( is_array( $arguments ) && count( $arguments ) === 0 ) {
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

    // IMPORTANT: Prepare query BEFORE setting up streaming hooks
    // The streaming hook intercepts ALL wp_remote_* calls, so preparation must happen first
    $this->prepare_query( $query );

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
      $body = $this->safe_json_encode( $json, 'request body' );

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
      'sslverify' => MWAI_SSL_VERIFY
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
    }
    else {
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
      $modelNames = array_map( function ( $model ) {
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

  /**
   * Upload a file to Anthropic Files API
   *
   * @param string $filename The name of the file
   * @param string $data The file content (binary)
   * @param string $purpose For Anthropic, this is the MIME type (API difference from OpenAI)
   * @return array The response from the API containing file_id
   * @throws Exception If upload fails
   */
  public function upload_file( $filename, $data, $purpose = 'application/pdf' ) {
    global $wp_filter;

    // For Anthropic, $purpose is actually the MIME type (different from OpenAI's API)
    $mimeType = $purpose;

    // Build multipart form data
    $boundary = wp_generate_password( 24, false );
    $body = '';
    $body .= "--$boundary\r\n";
    $body .= "Content-Disposition: form-data; name=\"file\"; filename=\"{$filename}\"\r\n";
    $body .= 'Content-Type: ' . $mimeType . "\r\n\r\n";
    $body .= $data . "\r\n";
    $body .= "--$boundary\r\n";
    $body .= "Content-Disposition: form-data; name=\"mime_type\"\r\n\r\n";
    $body .= $mimeType . "\r\n";
    $body .= "--$boundary--\r\n";

    // Temporarily remove ALL http_api_curl hooks to prevent streaming hook interference
    // Save current hooks
    $saved_hooks = null;
    if ( isset( $wp_filter['http_api_curl'] ) ) {
      $saved_hooks = $wp_filter['http_api_curl'];
      unset( $wp_filter['http_api_curl'] );
    }

    // Upload using WordPress HTTP API
    $endpoint = apply_filters( 'mwai_anthropic_endpoint', 'https://api.anthropic.com/v1', $this->env );
    $url = $endpoint . '/files';
    $response = wp_remote_post( $url, [
      'headers' => [
        'x-api-key' => $this->apiKey,
        'anthropic-version' => '2023-06-01',
        'anthropic-beta' => 'files-api-2025-04-14',
        'Content-Type' => 'multipart/form-data; boundary=' . $boundary
      ],
      'body' => $body,
      'timeout' => 60
    ] );

    // Restore hooks
    if ( $saved_hooks !== null ) {
      $wp_filter['http_api_curl'] = $saved_hooks;
    }

    if ( is_wp_error( $response ) ) {
      throw new Exception( 'File upload failed: ' . $response->get_error_message() );
    }

    $response_body = wp_remote_retrieve_body( $response );
    $result = json_decode( $response_body, true );

    // Check for API errors
    if ( isset( $result['error'] ) ) {
      throw new Exception( 'Anthropic Files API error: ' . ( $result['error']['message'] ?? 'Unknown error' ) );
    }

    return $result;
  }

  /**
   * Delete a file from Anthropic Files API
   *
   * @param string $fileId The Anthropic file ID to delete
   * @return array The response from the API
   * @throws Exception If deletion fails
   */
  public function delete_file( $fileId ) {
    $endpoint = apply_filters( 'mwai_anthropic_endpoint', 'https://api.anthropic.com/v1', $this->env );
    $url = $endpoint . '/files/' . $fileId;

    $response = wp_remote_request( $url, [
      'method' => 'DELETE',
      'headers' => [
        'x-api-key' => $this->apiKey,
        'anthropic-version' => '2023-06-01',
        'anthropic-beta' => 'files-api-2025-04-14',
      ],
      'timeout' => 30
    ] );

    if ( is_wp_error( $response ) ) {
      throw new Exception( 'File deletion failed: ' . $response->get_error_message() );
    }

    $response_code = wp_remote_retrieve_response_code( $response );
    $response_body = wp_remote_retrieve_body( $response );
    $result = json_decode( $response_body, true );

    // Check for API errors
    if ( $response_code >= 400 ) {
      $error_message = isset( $result['error']['message'] ) ? $result['error']['message'] : 'Unknown error';
      throw new Exception( 'Anthropic Files API error: ' . $error_message );
    }

    return $result;
  }
}
