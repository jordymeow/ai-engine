<?php

class Meow_MWAI_Engines_Google extends Meow_MWAI_Engines_Core {
  // Base (Google).
  protected $apiKey = null;
  protected $region = null;
  protected $projectId = null;
  protected $endpoint = null;

  // Response.
  protected $inModel = null;
  protected $inId = null;

  // Static
  private static $creating = false;

  public static function create( $core, $env ) {
    self::$creating = true;
    if ( class_exists( 'MeowPro_MWAI_Google' ) ) {
      $instance = new MeowPro_MWAI_Google( $core, $env );
    }
    else {
      $instance = new self( $core, $env );
    }
    self::$creating = false;
    return $instance;
  }

  /** Constructor. */
  public function __construct( $core, $env ) {
    $isOwnClass = get_class( $this ) === 'Meow_MWAI_Engines_Google';
    if ( $isOwnClass && !self::$creating ) {
      throw new Exception( 'Please use the create() method to instantiate the Meow_MWAI_Engines_Google class.' );
    }
    parent::__construct( $core, $env );
    $this->set_environment();
  }

  /**
  * Set environment variables based on $this->envType.
  *
  * @throws Exception If environment type is unknown.
  */
  protected function set_environment() {
    $env = $this->env;
    $this->apiKey = $env['apikey'];
    if ( $this->envType === 'google' ) {
      $this->region = isset( $env['region'] ) ? $env['region'] : null;
      $this->projectId = isset( $env['project_id'] ) ? $env['project_id'] : null;
      $this->endpoint = apply_filters(
        'mwai_google_endpoint',
        'https://generativelanguage.googleapis.com/v1beta',
        $this->env
      );
    }
    else {
      throw new Exception( 'Unknown environment type: ' . $this->envType );
    }
  }

  /**
  * Check for a JSON-formatted error in the data, and throw an exception if present.
  *
  * @param string $data
  * @throws Exception
  */
  public function check_for_error( $data ) {
    if ( strpos( $data, 'error' ) === false ) {
      return;
    }
    $jsonPart = ( strpos( $data, 'data: ' ) === 0 ) ? substr( $data, strlen( 'data: ' ) ) : $data;
    $json = json_decode( $jsonPart, true );
    if ( json_last_error() === JSON_ERROR_NONE && isset( $json['error'] ) ) {
      $error = $json['error'];
      $code = $error['code'];
      $message = $error['message'];
      throw new Exception( "Error $code: $message" );
    }
  }

  /**
  * Format function response for Google API
  * Google expects the response to be an object, not a primitive value
  */
  private function format_function_response( $value ) {
    // If it's already an array or object, return as-is
    if ( is_array( $value ) || is_object( $value ) ) {
      return $value;
    }

    // For primitive values (string, number, boolean), wrap in an object
    // This matches Google's expected format
    return [ 'result' => (string) $value ];
  }

  /**
  * Format a function call for internal usage.
  *
  * @param array $rawMessage
  * @return array
  */
  private function format_function_call( $rawMessage ) {
    // If the message already has Google's format with role and parts
    if ( isset( $rawMessage['role'] ) && isset( $rawMessage['parts'] ) &&
        !isset( $rawMessage['content'] ) && !isset( $rawMessage['tool_calls'] ) && !isset( $rawMessage['function_call'] ) ) {
      // Clean up any empty args arrays in functionCall parts
      $cleanedMessage = $rawMessage;
      if ( isset( $cleanedMessage['parts'] ) ) {
        foreach ( $cleanedMessage['parts'] as &$part ) {
          if ( isset( $part['functionCall'] ) && isset( $part['functionCall']['args'] ) ) {
            // Remove empty args arrays - Google doesn't accept them
            if ( empty( $part['functionCall']['args'] ) ) {
              unset( $part['functionCall']['args'] );
            }
          }
        }
      }
      return $cleanedMessage;
    }

    $parts = [];

    // Handle OpenAI-style tool_calls
    if ( isset( $rawMessage['tool_calls'] ) ) {
      foreach ( $rawMessage['tool_calls'] as $tool_call ) {
        if ( $tool_call['type'] === 'function' ) {
          $functionCall = [ 'name' => $tool_call['function']['name'] ];
          $args = $tool_call['function']['arguments'];
          if ( !empty( $args ) ) {
            // If args is a JSON string, decode it
            if ( is_string( $args ) ) {
              $args = json_decode( $args, true );
            }
            if ( !empty( $args ) ) {
              $functionCall['args'] = $args;
            }
          }
          $parts[] = [ 'functionCall' => $functionCall ];
        }
      }
    }
    // Handle single function_call
    elseif ( isset( $rawMessage['function_call'] ) ) {
      $functionCall = [ 'name' => $rawMessage['function_call']['name'] ];
      if ( isset( $rawMessage['function_call']['args'] ) ) {
        // Handle args - could be array, object, or empty
        $args = $rawMessage['function_call']['args'];
        if ( !empty( $args ) ) {
          $functionCall['args'] = $args;
        }
        // Don't include args field if it's empty
      }
      $parts[] = [ 'functionCall' => $functionCall ];
    }

    // Add text content if present
    if ( isset( $rawMessage['content'] ) && !empty( $rawMessage['content'] ) ) {
      $parts[] = [ 'text' => $rawMessage['content'] ];
    }

    // Return the original message if no function calls found, but ensure it's in Google format
    if ( empty( $parts ) ) {
      // Create a minimal valid Google format message
      return [ 'role' => 'model', 'parts' => [ [ 'text' => '' ] ] ];
    }

    return [ 'role' => 'model', 'parts' => $parts ];
  }

  /**
  * Build the messages for the Google API payload.
  *
  * @param Meow_MWAI_Query_Completion|Meow_MWAI_Query_Feedback $query
  * @return array
  */
  protected function build_messages( $query ) {
    $messages = [];

    // 1. Instructions (if any).
    if ( !empty( $query->instructions ) ) {
      $messages[] = [
        'role' => 'model',
        'parts' => [
          [ 'text' => $query->instructions ]
        ]
      ];
    }

    // 2. Existing messages (already partially formatted).
    foreach ( $query->messages as $message ) {

      // Convert roles: 'assistant' => 'model', 'user' => 'user'.
      $newMessage = [ 'role' => $message['role'], 'parts' => [] ];
      if ( isset( $message['content'] ) ) {
        $newMessage['parts'][] = [ 'text' => $message['content'] ];
      }
      if ( $newMessage['role'] === 'assistant' ) {
        $newMessage['role'] = 'model';
      }
      $messages[] = $newMessage;
    }

    // 3. Context (if any).
    if ( !empty( $query->context ) ) {
      $messages[] = [
        'role' => 'model',
        'parts' => [
          [ 'text' => $query->context ]
        ]
      ];
    }

    // 4. The final user message (check if there is an attached image).
    if ( $query->attachedFile ) {
      $data = $query->attachedFile->get_base64();
      $messages[] = [
        'role' => 'user',
        'parts' => [
          [ 'inlineData' => [ 'mimeType' => 'image/jpeg', 'data' => $data ] ],
          [ 'text' => $query->get_message() ]
        ]
      ];
      // Gemini doesn't support multi-turn chat with Vision.
      $messages = array_slice( $messages, -1 );
    }
    else {
      $messages[] = [
        'role' => 'user',
        'parts' => [
          [ 'text' => $query->get_message() ]
        ]
      ];
    }

    // 5. Streamline messages.
    $messages = $this->streamline_messages( $messages, 'model', 'parts' );

    // Debug: Log message count before feedback
    if ( $this->core->get_option( 'queries_debug_mode' ) ) {
      error_log( '[AI Engine Queries] Messages before feedback: ' . count( $messages ) );
    }

    // 6. Feedback data for Meow_MWAI_Query_Feedback.
    if ( $query instanceof Meow_MWAI_Query_Feedback && !empty( $query->blocks ) ) {
      foreach ( $query->blocks as $feedback_block ) {
        // Debug logging of raw message
        if ( $this->core->get_option( 'queries_debug_mode' ) ) {
          error_log( '[AI Engine Queries] Raw message before formatting: ' . json_encode( $feedback_block['rawMessage'] ) );
        }

        $formattedMessage = $this->format_function_call( $feedback_block['rawMessage'] );

        // Debug logging of formatted message
        if ( $this->core->get_option( 'queries_debug_mode' ) ) {
          error_log( '[AI Engine Queries] Formatted function call message: ' . json_encode( $formattedMessage ) );
        }

        // Check if Google returned multiple function calls but we only have one response
        $functionCallCount = 0;
        if ( isset( $formattedMessage['parts'] ) ) {
          foreach ( $formattedMessage['parts'] as $part ) {
            if ( isset( $part['functionCall'] ) ) {
              $functionCallCount++;
            }
          }
        }

        if ( $functionCallCount > 1 && count( $feedback_block['feedbacks'] ) != $functionCallCount ) {
          // Mismatch between function calls and responses
          // Google requires exact matching of function calls to responses
          $errorMsg = sprintf(
            'Function call/response mismatch: Google returned %d function calls but we have %d response(s). ' .
            'Google requires all function responses to be provided together.',
            $functionCallCount,
            count( $feedback_block['feedbacks'] )
          );

          // Log the error for debugging
          if ( $this->core->get_option( 'queries_debug_mode' ) ) {
            error_log( '[AI Engine Queries] ERROR: ' . $errorMsg );

            // Log which functions were called vs which were responded to
            $calledFunctions = [];
            foreach ( $formattedMessage['parts'] as $part ) {
              if ( isset( $part['functionCall'] ) ) {
                $calledFunctions[] = $part['functionCall']['name'] ?? 'unknown';
              }
            }
            $respondedFunctions = array_map( function ( $fb ) {
              return $fb['request']['name'] ?? 'unknown';
            }, $feedback_block['feedbacks'] );

            error_log( '[AI Engine Queries] Called functions: ' . implode( ', ', $calledFunctions ) );
            error_log( '[AI Engine Queries] Responded functions: ' . implode( ', ', $respondedFunctions ) );
          }

          throw new Exception( $errorMsg );
        }

        $messages[] = $formattedMessage;
        foreach ( $feedback_block['feedbacks'] as $feedback ) {
          $functionResponseMessage = [
            'role' => 'function',
            'parts' => [
              [
                'functionResponse' => [
                  'name' => $feedback['request']['name'],
                  'response' => $this->format_function_response( $feedback['reply']['value'] )
                ]
              ]
            ]
          ];

          // Debug logging of function response
          if ( $this->core->get_option( 'queries_debug_mode' ) ) {
            error_log( '[AI Engine Queries] Function response: ' . json_encode( $functionResponseMessage ) );
          }

          $messages[] = $functionResponseMessage;
        }
      }
    }

    // Debug logging of all messages
    if ( $this->core->get_option( 'queries_debug_mode' ) ) {
      error_log( '[AI Engine Queries] Total messages to Google: ' . count( $messages ) );
      foreach ( $messages as $index => $message ) {
        $role = $message['role'] ?? 'unknown';
        $preview = $role;
        if ( isset( $message['parts'][0] ) ) {
          if ( isset( $message['parts'][0]['text'] ) ) {
            $text = substr( $message['parts'][0]['text'], 0, 50 );
            $preview .= ' (text: "' . $text . '...")';
          }
          elseif ( isset( $message['parts'][0]['functionCall'] ) ) {
            $preview .= ' (functionCall: ' . $message['parts'][0]['functionCall']['name'] . ')';
          }
          elseif ( isset( $message['parts'][0]['functionResponse'] ) ) {
            $preview .= ' (functionResponse: ' . $message['parts'][0]['functionResponse']['name'] . ')';
          }
        }
        error_log( '[AI Engine Queries] Message[' . $index . ']: ' . $preview );
      }
    }

    return $messages;
  }

  /**
  * Build the body for the Google API request.
  *
  * @param Meow_MWAI_Query_Completion|Meow_MWAI_Query_Feedback $query
  * @param callable $streamCallback
  * @return array
  */
  protected function build_body( $query, $streamCallback = null ) {
    $body = [];

    // Build generation config
    $body['generationConfig'] = [
      'candidateCount' => $query->maxResults,
      'maxOutputTokens' => $query->maxTokens,
      'temperature' => $query->temperature,
      'stopSequences' => []
    ];

    // Add tools if available
    $hasTools = false;

    // Check for functions
    if ( !empty( $query->functions ) ) {
      if ( !isset( $body['tools'] ) ) {
        $body['tools'] = [];
      }
      $body['tools'][] = [ 'function_declarations' => [] ];
      foreach ( $query->functions as $function ) {
        $body['tools'][0]['function_declarations'][] = $function->serializeForOpenAI();
      }
      $body['tool_config'] = [
        'function_calling_config' => [ 'mode' => 'AUTO' ]
      ];
      $hasTools = true;
    }

    // Check for web_search tool
    if ( !empty( $query->tools ) && in_array( 'web_search', $query->tools ) ) {
      if ( !isset( $body['tools'] ) ) {
        $body['tools'] = [];
      }
      $body['tools'][] = [ 'google_search' => (object) [] ];
      $hasTools = true;
    }

    // Check for thinking tool (Gemini 2.5+ models)
    if ( !empty( $query->tools ) && in_array( 'thinking', $query->tools ) ) {
      if ( !isset( $body['generationConfig']['thinkingConfig'] ) ) {
        $body['generationConfig']['thinkingConfig'] = [];
      }
      // Use dynamic thinking by default (-1 lets the model decide)
      $body['generationConfig']['thinkingConfig']['thinkingBudget'] = -1;
      
      // Always include thought summaries when thinking is enabled
      // This allows us to see thinking events in the UI
      $body['generationConfig']['thinkingConfig']['includeThoughts'] = true;
      
      // Log that thinking is enabled
      if ( $this->core->get_option( 'queries_debug_mode' ) ) {
        error_log( '[AI Engine] Thinking tool enabled for Gemini with dynamic budget' );
      }
    }

    // Build messages
    $body['contents'] = $this->build_messages( $query );

    // Note: Function result events are now emitted centrally in core.php
    // when the function is actually executed

    return $body;
  }

  /**
  * Build headers for the request.
  *
  * @param Meow_MWAI_Query_Completion|Meow_MWAI_Query_Feedback $query
  * @throws Exception If no API Key is provided.
  * @return array
  */
  protected function build_headers( $query ) {
    if ( $query->apiKey ) {
      $this->apiKey = $query->apiKey;
    }
    if ( empty( $this->apiKey ) ) {
      throw new Exception( 'No API Key provided. Please visit the Settings.' );
    }
    return [ 'Content-Type' => 'application/json' ];
  }

  /**
  * Build WP remote request options.
  *
  * @param array  $headers
  * @param array  $json
  * @param array  $forms
  * @param string $method
  * @throws Exception If form-data requests are used (unsupported).
  * @return array
  */
  protected function build_options( $headers, $json = null, $forms = null, $method = 'POST' ) {
    $body = null;
    if ( !empty( $forms ) ) {
      throw new Exception( 'No support for form-data requests yet.' );
    }
    else if ( !empty( $json ) ) {
      $body = json_encode( $json );
    }
    return [
      'headers' => $headers,
      'method' => $method,
      'timeout' => MWAI_TIMEOUT,
      'body' => $body,
      'sslverify' => false
    ];
  }

  /**
  * Run the query against the Google endpoint.
  *
  * @param string $url
  * @param array  $options
  * @throws Exception
  * @return array
  */
  public function run_query( $url, $options ) {

    try {
      $res = wp_remote_get( $url, $options );
      if ( is_wp_error( $res ) ) {
        throw new Exception( $res->get_error_message() );
      }
      $response = wp_remote_retrieve_body( $res );
      $headersRes = wp_remote_retrieve_headers( $res );
      $headers = $headersRes->getAll();
      $normalizedHeaders = array_change_key_case( $headers, CASE_LOWER );
      $resContentType = $normalizedHeaders['content-type'] ?? '';
      if (
        strpos( $resContentType, 'multipart/form-data' ) !== false ||
          strpos( $resContentType, 'text/plain' ) !== false
      ) {
        return [
          'headers' => $headers,
          'data' => $response
        ];
      }
      $data = json_decode( $response, true );
      $this->handle_response_errors( $data );
      return [ 'headers' => $headers, 'data' => $data ];
    }
    catch ( Exception $e ) {
      Meow_MWAI_Logging::error( '(Google) ' . $e->getMessage() );
      throw $e;
    }
  }

  /**
  * Run a completion query on the Google endpoint.
  *
  * @param Meow_MWAI_Query_Completion $query
  * @throws Exception
  * @return Meow_MWAI_Reply
  */
  public function run_completion_query( $query, $streamCallback = null ): Meow_MWAI_Reply {
    // Reset request-specific state to prevent leakage between requests
    $this->reset_request_state();

    // Initialize debug mode
    $this->init_debug_mode( $query );

    // Build body using the new method which handles event emission
    $body = $this->build_body( $query, $streamCallback );

    $url = $this->endpoint . '/models/' . $query->model . ':generateContent';
    if ( strpos( $url, '?' ) === false ) {
      $url .= '?key=' . $this->apiKey;
    }
    else {
      $url .= '&key=' . $this->apiKey;
    }

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
      $res = $this->run_query( $url, $options );

      $reply = new Meow_MWAI_Reply( $query );

      $data = $res['data'];
      if ( empty( $data ) ) {
        throw new Exception( 'No content received (res is null).' );
      }

      $returned_choices = [];
      if ( isset( $data['candidates'] ) ) {
        // Debug: Log if we're using thinking
        if ( $this->core->get_option( 'queries_debug_mode' ) && !empty( $query->tools ) && in_array( 'thinking', $query->tools ) ) {
          error_log( '[AI Engine] Processing response with thinking enabled' );
          if ( isset( $data['candidates'][0] ) ) {
            error_log( '[AI Engine] Full candidate structure: ' . json_encode( $data['candidates'][0] ) );
          }
        }

        foreach ( $data['candidates'] as $candidate ) {
          $content = $candidate['content'];

          // Check if there are any parts with function calls
          $functionCalls = [];
          $textContent = '';
          $hasGeneratedImage = false;

          if ( isset( $content['parts'] ) ) {
            // Debug: Log the parts structure when thinking is enabled
            if ( $this->core->get_option( 'queries_debug_mode' ) && !empty( $query->tools ) && in_array( 'thinking', $query->tools ) ) {
              error_log( '[AI Engine] Response parts: ' . json_encode( $content['parts'] ) );
            }

            foreach ( $content['parts'] as $part ) {
              if ( isset( $part['functionCall'] ) ) {
                $functionCalls[] = $part['functionCall'];

                // Emit function calling event if debug mode is enabled
                if ( $this->currentDebugMode && !empty( $streamCallback ) ) {
                  $functionName = $part['functionCall']['name'] ?? 'unknown';
                  $functionArgs = isset( $part['functionCall']['args'] ) ? json_encode( $part['functionCall']['args'] ) : '';

                  $event = Meow_MWAI_Event::function_calling( $functionName, $functionArgs );
                  call_user_func( $streamCallback, $event );
                }
              }
              elseif ( ( isset( $part['inline_data'] ) && isset( $part['inline_data']['data'] ) ) ||
                       ( isset( $part['inlineData'] ) && isset( $part['inlineData']['data'] ) ) ) {
                // Handle both snake_case and camelCase
                $imageData = isset( $part['inline_data'] ) ? $part['inline_data'] : $part['inlineData'];

                // Detected an inline image in the response - emit image generation event
                if ( !$hasGeneratedImage && !empty( $streamCallback ) ) {
                  $event = new Meow_MWAI_Event( 'live', MWAI_STREAM_TYPES['IMAGE_GEN'] );
                  $event->set_content( 'Image generated' );
                  call_user_func( $streamCallback, $event );
                  $hasGeneratedImage = true;
                }

                // Store the image data in the reply
                $base64Data = $imageData['data'];
                $mimeType = $imageData['mimeType'] ?? 'image/png';
                $dataUrl = 'data:' . $mimeType . ';base64,' . $base64Data;

                // Add to extra data for potential processing
                if ( !isset( $reply->extraData['images'] ) ) {
                  $reply->extraData['images'] = [];
                }
                $reply->extraData['images'][] = $dataUrl;
              }
              elseif ( isset( $part['text'] ) ) {
                // Check if this is a thought part (Gemini thinking)
                if ( isset( $part['thought'] ) && $part['thought'] === true ) {
                  // Emit thought event if streaming is available
                  if ( !empty( $streamCallback ) ) {
                    $event = new Meow_MWAI_Event( 'live', MWAI_STREAM_TYPES['THINKING'] );
                    $event->set_content( $part['text'] );
                    call_user_func( $streamCallback, $event );
                  }
                  // Store thought summaries in reply metadata
                  if ( !isset( $reply->extraData['thoughts'] ) ) {
                    $reply->extraData['thoughts'] = [];
                  }
                  $reply->extraData['thoughts'][] = $part['text'];
                }
                else {
                  // Regular text content
                  $textContent .= $part['text'];
                }
              }
            }
          }

          // If we have function calls, return them in Google's expected format
          if ( !empty( $functionCalls ) ) {
            // Debug: Log when we find multiple function calls
            if ( $this->core->get_option( 'queries_debug_mode' ) ) {
              error_log( '[AI Engine Queries] Google returned ' . count( $functionCalls ) . ' function calls in one response' );
              foreach ( $functionCalls as $idx => $fc ) {
                error_log( '[AI Engine Queries] Function call[' . $idx . ']: ' . $fc['name'] );
              }
            }

            // Google can return multiple function calls that need to be executed together
            // When this happens, we create separate choices but they share the same rawMessage
            $sharedRawMessage = $content; // The original Google response

            foreach ( $functionCalls as $function_call ) {
              $returned_choices[] = [
                'message' => [
                  'content' => null,
                  'function_call' => $function_call
                ],
                '_rawMessage' => $sharedRawMessage // Store for later use
              ];
            }
          }

          // Add text content if present (separate from function calls)
          if ( !empty( $textContent ) ) {
            $returned_choices[] = [ 'role' => 'assistant', 'text' => $textContent ];
          }
        }
      }

      // Create a proper Google-formatted rawMessage for the function calls
      $googleRawMessage = null;
      if ( isset( $data['candidates'][0]['content'] ) ) {
        $googleRawMessage = $data['candidates'][0]['content'];
      }

      // Add images from extraData to choices if present (for compatibility with image handling)
      if ( !empty( $reply->extraData['images'] ) ) {
        foreach ( $reply->extraData['images'] as $imageDataUrl ) {
          // Extract base64 data from data URL if needed
          if ( strpos( $imageDataUrl, 'data:' ) === 0 ) {
            // Extract base64 portion from data URL
            $base64Part = substr( $imageDataUrl, strpos( $imageDataUrl, ',') + 1 );
            $returned_choices[] = [ 'b64_json' => $base64Part ];
          }
          else {
            // Already in base64 format
            $returned_choices[] = [ 'b64_json' => $imageDataUrl ];
          }
        }
      }

      $reply->set_choices( $returned_choices, $googleRawMessage );

      // Handle grounding metadata if present (from web search)
      if ( isset( $data['candidates'][0]['groundingMetadata'] ) ) {
        $groundingMetadata = $data['candidates'][0]['groundingMetadata'];

        // Add grounding metadata to the reply for potential use
        $reply->extraData['groundingMetadata'] = $groundingMetadata;

        // If debug mode is enabled and we have a stream callback, emit web search events
        if ( $this->currentDebugMode && !empty( $streamCallback ) && isset( $groundingMetadata['searchQueries'] ) ) {
          foreach ( $groundingMetadata['searchQueries'] as $searchQuery ) {
            $event = new Meow_MWAI_Event( 'live', MWAI_STREAM_TYPES['WEB_SEARCH'] );
            $event->set_content( 'Searching: ' . $searchQuery );
            call_user_func( $streamCallback, $event );
          }
        }
      }

      // Debug: Check how many feedbacks were created
      if ( $this->core->get_option( 'queries_debug_mode' ) && !empty( $reply->needFeedbacks ) ) {
        error_log( '[AI Engine Queries] Google reply has ' . count( $reply->needFeedbacks ) . ' needFeedbacks' );
        foreach ( $reply->needFeedbacks as $idx => $feedback ) {
          error_log( '[AI Engine Queries] Feedback[' . $idx . ']: ' . $feedback['name'] );
        }
      }

      // Handle usage metadata including thinking tokens if present
      if ( isset( $data['usageMetadata'] ) ) {
        $usageMetadata = $data['usageMetadata'];
        
        // Extract thinking tokens if available
        if ( isset( $usageMetadata['thoughtsTokenCount'] ) ) {
          $reply->extraData['thoughtsTokenCount'] = $usageMetadata['thoughtsTokenCount'];
          
          // Log thinking tokens in debug mode
          if ( $this->core->get_option( 'queries_debug_mode' ) ) {
            error_log( '[AI Engine Queries] Thinking tokens used: ' . $usageMetadata['thoughtsTokenCount'] );
          }
        }
        
        // Pass token counts if available
        $inTokens = isset( $usageMetadata['promptTokenCount'] ) ? $usageMetadata['promptTokenCount'] : null;
        $outTokens = isset( $usageMetadata['candidatesTokenCount'] ) ? $usageMetadata['candidatesTokenCount'] : null;
        $this->handle_tokens_usage( $reply, $query, $query->model, $inTokens, $outTokens );
      }
      else {
        $this->handle_tokens_usage( $reply, $query, $query->model, null, null );
      }
      
      return $reply;
    }
    catch ( Exception $e ) {
      // Add more context for common Google errors
      $errorMessage = $e->getMessage();

      if ( strpos( $errorMessage, 'number of function response parts is equal to the number of function call parts' ) !== false ) {
        $errorMessage = 'Google requires all function responses to match the number of function calls. ' .
                       'This error typically occurs when there is a mismatch between the number of ' .
                       'function calls made by the AI and the number of responses provided.';
      }

      Meow_MWAI_Logging::error( '(Google) ' . $errorMessage );
      throw new Exception( 'From Google: ' . $errorMessage );
    }
  }

  /**
  * Handle usage tokens.
  */
  public function handle_tokens_usage( $reply, $query, $returned_model, $returned_in_tokens, $returned_out_tokens ) {
    $returned_in_tokens = !is_null( $returned_in_tokens ) ? $returned_in_tokens : $reply->get_in_tokens( $query );
    $returned_out_tokens = !is_null( $returned_out_tokens ) ? $returned_out_tokens : $reply->get_out_tokens();
    $usage = $this->core->record_tokens_usage( $returned_model, $returned_in_tokens, $returned_out_tokens );
    $reply->set_usage( $usage );
  }

  /**
  * Check if there are errors in the response from Google, and throw an exception if so.
  *
  * @param array $data
  * @throws Exception
  */
  public function handle_response_errors( $data ) {
    if ( isset( $data['error'] ) ) {
      $message = $data['error']['message'];
      if ( preg_match( '/API key provided(: .*)\./', $message, $matches ) ) {
        $message = str_replace( $matches[1], '', $message );
      }
      throw new Exception( $message );
    }
  }

  /**
  * Get models via the core method.
  *
  * @return array
  */
  public function get_models() {
    return $this->core->get_engine_models( 'google' );
  }

  /**
  * Retrieve models from Google's generative language endpoint.
  *
  * @throws Exception
  * @return array
  */
  private function format_model_name( $model_id ) {
    // Special cases for specific models that need manual handling
    $special_names = [
      'gemini-live-2.5-flash-preview' => 'Gemini 2.5 Flash Live',
      'gemini-2.0-flash-live-001' => 'Gemini 2.0 Flash Live',
    ];

    if ( isset( $special_names[$model_id] ) ) {
      return $special_names[$model_id];
    }

    // Store original for differentiating similar models
    $original_id = $model_id;
    
    // Remove common suffixes but keep track if we need to differentiate
    $cleaned = $model_id;
    
    // Extract date suffix if present (like -preview-03-25)
    $date_suffix = '';
    if ( preg_match( '/-preview-(\d{2}-\d{2})(?:-thinking)?$/', $cleaned, $matches ) ) {
      $date_suffix = $matches[1];
      $cleaned = preg_replace( '/-preview-\d{2}-\d{2}(?:-thinking)?$/', '', $cleaned );
    }
    
    // Check if it's a thinking model
    $is_thinking = strpos( $original_id, '-thinking' ) !== false;
    if ( $is_thinking ) {
      $cleaned = str_replace( '-thinking', '', $cleaned );
    }
    
    // Check if it's a TTS preview model
    $is_preview_tts = strpos( $original_id, 'preview-tts' ) !== false;
    
    // Keep version suffixes (like -001, -002) if they help distinguish models
    $has_version_suffix = preg_match( '/-\d{3}$/', $cleaned );
    $version_suffix = '';
    if ( $has_version_suffix ) {
      preg_match( '/(-\d{3})$/', $cleaned, $matches );
      $version_suffix = $matches[1];
      $cleaned = preg_replace( '/-\d{3}$/', '', $cleaned );
    }
    
    // Track if it's a preview model
    $is_preview = strpos( $cleaned, '-preview' ) !== false || !empty( $date_suffix );
    $cleaned = preg_replace( '/-preview$/', '', $cleaned );
    
    // Track if it's experimental
    $is_experimental = strpos( $original_id, '-exp' ) !== false;
    $cleaned = preg_replace( '/-exp$/', '', $cleaned );
    $cleaned = preg_replace( '/-generate$/', '', $cleaned );
    
    // Don't remove -latest suffix here, we'll handle it separately
    $has_latest = strpos( $cleaned, '-latest' ) !== false;
    $cleaned = preg_replace( '/-latest$/', '', $cleaned );

    // Handle specific feature names
    if ( strpos( $cleaned, 'preview-native-audio-dialog' ) !== false ) {
      $cleaned = str_replace( 'preview-native-audio-dialog', 'Native Audio', $cleaned );
    }
    else if ( strpos( $cleaned, 'exp-native-audio-thinking-dialog' ) !== false ) {
      $cleaned = str_replace( 'exp-native-audio-thinking-dialog', 'Native Audio', $cleaned );
    }
    else if ( strpos( $cleaned, 'preview-image-generation' ) !== false ) {
      $cleaned = str_replace( 'preview-image-generation', 'Preview Image Generation', $cleaned );
    }
    else if ( strpos( $cleaned, 'preview-tts' ) !== false ) {
      $cleaned = str_replace( 'preview-tts', '', $cleaned );
      // We'll add (Preview TTS) as a suffix later
    }

    // Parse components
    $parts = explode( '-', $cleaned );
    $formatted_parts = [];

    // Process each part
    foreach ( $parts as $part ) {
      if ( $part === 'gemini' ) {
        $formatted_parts[] = 'Gemini';
      }
      else if ( $part === 'imagen' ) {
        $formatted_parts[] = 'Imagen';
      }
      else if ( $part === 'veo' ) {
        $formatted_parts[] = 'Veo';
      }
      else if ( $part === 'pro' ) {
        $formatted_parts[] = 'Pro';
      }
      else if ( $part === 'flash' ) {
        $formatted_parts[] = 'Flash';
      }
      else if ( $part === 'lite' ) {
        // Check if previous part was Flash to create Flash-Lite
        if ( !empty( $formatted_parts ) && $formatted_parts[count( $formatted_parts ) - 1] === 'Flash' ) {
          $formatted_parts[count( $formatted_parts ) - 1] = 'Flash-Lite';
        }
        else {
          $formatted_parts[] = 'Lite';
        }
      }
      else if ( $part === 'ultra' ) {
        $formatted_parts[] = 'Ultra';
      }
      else if ( $part === 'tts' || $part === 'TTS' ) {
        $formatted_parts[] = 'TTS';
      }
      else if ( preg_match( '/^\d+\.\d+$/', $part ) ) {
        // Version numbers
        $formatted_parts[] = $part;
      }
      else if ( preg_match( '/^(\d+)B$/i', $part, $matches ) ) {
        // Model sizes like 8B - be consistent with capitalization
        $formatted_parts[] = '-' . $matches[1] . 'B';
      }
      else if ( $part === 'latest' ) {
        // Don't include 'latest' here as it's handled separately
        continue;
      }
      else if ( !in_array( $part, ['generate', 'preview', 'exp'] ) ) {
        // Keep other parts unless they're common suffixes
        $formatted_parts[] = ucfirst( $part );
      }
    }

    // Join with appropriate spacing
    $name = implode( ' ', $formatted_parts );

    // Clean up double spaces and fix specific patterns
    $name = preg_replace( '/\s+/', ' ', $name );
    $name = str_replace( ' -', '-', $name );

    // Special formatting for Imagen and Veo versions
    if ( strpos( $name, 'Imagen 4.0' ) === 0 ) {
      $name = str_replace( 'Imagen 4.0', 'Imagen 4', $name );
    }
    else if ( strpos( $name, 'Veo 2.0' ) === 0 ) {
      $name = str_replace( 'Veo 2.0', 'Veo 2', $name );
    }
    
    // Remove date pattern "xx xx" where x are numbers (like "03 07") from the name
    if ( preg_match( '/\s(\d{2})\s(\d{2})$/', $name, $matches ) ) {
      $name = preg_replace( '/\s\d{2}\s\d{2}$/', '', $name );
    }
    
    // Add suffixes to distinguish similar models
    $suffixes = [];

    // Don't add date suffixes - we want clean model names
    // Don't add Preview suffix - we already have a preview tag
    
    // Add version suffix for numbered models (like -001, -002)
    // Special handling: if base model exists (without -001), then -001 should be marked
    if ( !empty( $version_suffix ) ) {
      // Extract just the number without the dash
      $version_num = str_replace( '-', '', $version_suffix );
      $version_int = intval( $version_num );
      
      // Always add version suffix for -001 if it's not the only version
      // This helps distinguish when both base and -001 exist
      if ( $version_int === 1 ) {
        // Check if this looks like a model that might have a base version
        // (e.g., gemini-2.0-flash vs gemini-2.0-flash-001)
        if ( strpos( $original_id, 'flash-8b-001' ) !== false ||
             strpos( $original_id, 'flash-001' ) !== false ||
             strpos( $original_id, 'flash-lite-001' ) !== false ) {
          $suffixes[] = 'v1';
        }
      } else {
        // For -002 and higher, always add version
        $suffixes[] = 'v' . ltrim( $version_num, '0' );
      }
    }
    
    // Handle "latest" suffix
    if ( $has_latest && strpos( $name, 'Latest' ) === false ) {
      $suffixes[] = 'Latest';
    }
    
    // Handle thinking models
    if ( $is_thinking && strpos( $name, 'Thinking' ) === false ) {
      $suffixes[] = 'Thinking';
    }
    
    // Handle TTS preview models
    if ( $is_preview_tts ) {
      $suffixes[] = 'Preview TTS';
    }
    
    // Append all suffixes with parentheses
    if ( !empty( $suffixes ) ) {
      $name .= ' (' . implode( ', ', $suffixes ) . ')';
    }

    return trim( $name );
  }

  public function retrieve_models() {
    $url = $this->endpoint . '/models?key=' . $this->apiKey;
    $response = wp_remote_get( $url );
    if ( is_wp_error( $response ) ) {
      throw new Exception( 'AI Engine: ' . $response->get_error_message() );
    }
    $body = json_decode( $response['body'], true );
    $models = [];

    error_log( '[AI Engine] Google Models Retrieval - Starting to process ' . count( $body['models'] ) . ' models' );

    foreach ( $body['models'] as $model ) {
      $model_id = preg_replace( '/^models\//', '', $model['name'] );

      error_log( '[AI Engine] Processing model: ' . $model_id );

      // Skip date-specific preview models (e.g., gemini-2.5-flash-preview-09-2025)
      if ( preg_match( '/-preview-\d{2}-\d{4}/', $model_id ) ) {
        error_log( '[AI Engine]   -> Skipping (date-specific preview YYYY): ' . $model_id );
        continue;
      }

      // Skip preview models with MM-DD dates (e.g., preview-03-25, preview-06-17)
      if ( preg_match( '/-preview-\d{2}-\d{2}/', $model_id ) || preg_match( '/preview-\d{2}-\d{2}$/', $model_id ) ) {
        error_log( '[AI Engine]   -> Skipping (date-specific preview MM-DD): ' . $model_id );
        continue;
      }

      // Skip models with date patterns like -YYYYMMDD (e.g., gemini-1.5-flash-8b-20241206)
      if ( preg_match( '/-\d{8}$/', $model_id ) ) {
        error_log( '[AI Engine]   -> Skipping (YYYYMMDD date): ' . $model_id );
        continue;
      }

      // Skip models with date patterns like exp-MMDD (e.g., gemini-1.5-flash-8b-exp-0924)
      if ( preg_match( '/-exp-\d{4}$/', $model_id ) ) {
        error_log( '[AI Engine]   -> Skipping (exp-MMDD date): ' . $model_id );
        continue;
      }

      // Skip experimental models with date patterns like exp-MM-DD (e.g., gemini-2.0-flash-thinking-exp-01-21)
      if ( preg_match( '/-exp-\d{2}-\d{2}/', $model_id ) ) {
        error_log( '[AI Engine]   -> Skipping (exp-MM-DD date): ' . $model_id );
        continue;
      }

      // Skip embedding models with date patterns (e.g., gemini-embedding-exp-03-07)
      if ( preg_match( '/embedding-exp-\d{2}-\d{2}/', $model_id ) ) {
        error_log( '[AI Engine]   -> Skipping (embedding exp date): ' . $model_id );
        continue;
      }

      // Skip imagen/veo models with date patterns (e.g., imagen-4.0-generate-preview-06-06)
      if ( preg_match( '/(imagen|veo).*-\d{2}-\d{2}/', $model_id ) ) {
        error_log( '[AI Engine]   -> Skipping (imagen/veo date): ' . $model_id );
        continue;
      }

      // Skip robotics models
      if ( strpos( $model_id, 'robotics' ) !== false ) {
        error_log( '[AI Engine]   -> Skipping (robotics): ' . $model_id );
        continue;
      }

      // Skip deprecated Gemini 2.0 models
      if ( preg_match( '/^gemini-2\.0/', $model_id ) ) {
        error_log( '[AI Engine]   -> Skipping (deprecated Gemini 2.0): ' . $model_id );
        continue;
      }

      // Skip TTS models (not for chatbot use)
      if ( strpos( $model_id, '-tts' ) !== false || strpos( $model_id, 'text-to-speech' ) !== false ) {
        error_log( '[AI Engine]   -> Skipping (TTS model): ' . $model_id );
        continue;
      }

      // Determine model family
      $family = 'gemini';
      if ( strpos( $model['name'], 'imagen' ) !== false ) {
        $family = 'imagen';
      }
      else if ( strpos( $model['name'], 'veo' ) !== false ) {
        $family = 'veo';
      }
      else if ( strpos( $model['name'], 'gemini' ) === false ) {
        // Skip models that aren't gemini, imagen, or veo
        continue;
      }

      $maxCompletionTokens = $model['outputTokenLimit'];
      $maxContextualTokens = $model['inputTokenLimit'];
      $priceIn = 0;
      $priceOut = 0;

      // If Model Name contains "Experimental", skip it (except for embedding models)
      if ( strpos( $model['name'], '-exp' ) !== false && strpos( $model['name'], 'embedding' ) === false ) {
        continue;
      }

      // Set tags based on model family and features
      $tags = [ 'core' ];
      $features = [ 'completion' ];
      $tools = [];

      if ( $family === 'imagen' ) {
        $tags[] = 'image-generation';
        $features = [ 'image-generation' ];
      }
      else if ( $family === 'veo' ) {
        $tags[] = 'video-generation';
        $features = [ 'video-generation' ];
      }
      else {
        // Gemini models - all support function calling according to documentation
        $tags[] = 'chat';
        $tags[] = 'functions';
        $tools[] = 'function_calling';

        // Check if it's a preview/beta model
        if ( preg_match( '/\((beta|alpha|preview)\)/i', $model['name'] ) ||
             preg_match( '/-preview/', $model_id ) ) {
          $tags[] = 'preview';
          $model['name'] = preg_replace( '/\((beta|alpha|preview)\)/i', '', $model['name'] );
        }

        // Vision capabilities - all 2.5 and 1.5 models support vision
        if ( preg_match( '/gemini-(2\.5|1\.5)/', $model_id ) ) {
          $tags[] = 'vision';
          $features[] = 'vision';
        }

        // Web search capabilities - all Gemini 2.5 and 1.5 Pro models
        if ( preg_match( '/gemini-(2\.5|1\.5-pro)/', $model_id ) ) {
          $tools[] = 'web_search';
        }

        // Image generation - only specific Flash Image models
        if ( preg_match( '/flash-image|image-preview/', $model_id ) ) {
          $tags[] = 'image-generation';
          $features[] = 'image-generation';
          $tools[] = 'image_generation';
        }

        // Audio capabilities for native audio models
        if ( preg_match( '/native-audio/', $model_id ) ) {
          $tags[] = 'audio';
          $features[] = 'audio';
        }

        // TTS capabilities
        if ( preg_match( '/(tts|text-to-speech)/', $model_id ) ) {
          $tags[] = 'tts';
          $features = [ 'text-to-speech' ];
        }

        // Embedding models
        if ( preg_match( '/embedding/', $model_id ) ) {
          $tags = [ 'core', 'embedding', 'matryoshka' ]; // Reset tags for embedding
          $features = [ 'embedding' ];
          $tools = []; // Embedding models don't have tools
          // Check if it's experimental
          if ( strpos( $model_id, '-exp' ) !== false ) {
            $tags[] = 'experimental';
          }
        }

        // Thinking capabilities for Gemini 2.5 models
        if ( preg_match( '/gemini-2\.5/', $model_id ) && !in_array( 'embedding', $tags ) ) {
          $tools[] = 'thinking';
          $tags[] = 'thinking';
        }
      }

      $nice_name = $this->format_model_name( $model_id );
      
      
      $model = [
        'model' => $model_id,
        'name' => $nice_name,
        'family' => $family,
        'features' => $features,
        'type' => 'token',
        'unit' => 1 / 1000,
        'maxCompletionTokens' => $maxCompletionTokens,
        'maxContextualTokens' => $maxContextualTokens,
        'tags' => $tags,
        'tools' => $tools
      ];
      
      // Add dimensions for embedding models
      if ( in_array( 'embedding', $tags ) ) {
        // Gemini embedding models have 768 dimensions (text-embedding-004) or 3072 (experimental)
        if ( strpos( $model_id, 'text-embedding-004' ) !== false ) {
          $model['dimensions'] = [ 768 ];
        } else {
          $model['dimensions'] = [ 3072 ];
        }
      }
      if ( $priceIn > 0 && $priceOut > 0 ) {
        $model['price'] = [ 'in' => $priceIn, 'out' => $priceOut ];
      }

      error_log( '[AI Engine]   -> Including model: ' . $model_id . ' as "' . $nice_name . '"' );
      $models[] = $model;
    }

    error_log( '[AI Engine] Google Models Retrieval - Finished. Total models included: ' . count( $models ) );
    
    // Sort models to put most recent versions first
    usort( $models, function( $a, $b ) {
      // First, sort by family (gemini, imagen, veo)
      $family_order = [ 'gemini' => 1, 'imagen' => 2, 'veo' => 3 ];
      $family_a = $family_order[$a['family']] ?? 999;
      $family_b = $family_order[$b['family']] ?? 999;
      
      if ( $family_a !== $family_b ) {
        return $family_a - $family_b;
      }
      
      // Within the same family, extract version numbers and sort descending
      $model_a = $a['model'];
      $model_b = $b['model'];
      
      // Extract version numbers (e.g., 2.5, 2.0, 1.5, 1.0)
      preg_match( '/(\d+\.\d+)/', $model_a, $matches_a );
      preg_match( '/(\d+\.\d+)/', $model_b, $matches_b );
      
      $version_a = isset( $matches_a[1] ) ? floatval( $matches_a[1] ) : 0;
      $version_b = isset( $matches_b[1] ) ? floatval( $matches_b[1] ) : 0;
      
      // Sort by version descending (newer first)
      if ( $version_a !== $version_b ) {
        return $version_b <=> $version_a;
      }
      
      // For same version, sort by model variant
      // Priority: pro > flash > flash-8b > flash-lite
      $variant_order = [
        'pro' => 1,
        'flash' => 2,
        'flash-8b' => 3,
        'flash-lite' => 4,
      ];
      
      // Determine variant
      $variant_a = 'other';
      $variant_b = 'other';
      
      if ( strpos( $model_a, 'pro' ) !== false ) $variant_a = 'pro';
      elseif ( strpos( $model_a, 'flash-lite' ) !== false ) $variant_a = 'flash-lite';
      elseif ( strpos( $model_a, 'flash-8b' ) !== false ) $variant_a = 'flash-8b';
      elseif ( strpos( $model_a, 'flash' ) !== false ) $variant_a = 'flash';
      
      if ( strpos( $model_b, 'pro' ) !== false ) $variant_b = 'pro';
      elseif ( strpos( $model_b, 'flash-lite' ) !== false ) $variant_b = 'flash-lite';
      elseif ( strpos( $model_b, 'flash-8b' ) !== false ) $variant_b = 'flash-8b';
      elseif ( strpos( $model_b, 'flash' ) !== false ) $variant_b = 'flash';
      
      $order_a = $variant_order[$variant_a] ?? 999;
      $order_b = $variant_order[$variant_b] ?? 999;
      
      if ( $order_a !== $order_b ) {
        return $order_a - $order_b;
      }
      
      // For same variant, sort by specific suffixes
      // Base model > latest > dated previews > numbered versions
      $is_base_a = !preg_match( '/-(?:latest|preview|\d{3})/', $model_a );
      $is_base_b = !preg_match( '/-(?:latest|preview|\d{3})/', $model_b );
      
      if ( $is_base_a && !$is_base_b ) return -1;
      if ( !$is_base_a && $is_base_b ) return 1;
      
      // Latest comes after base
      $is_latest_a = strpos( $model_a, '-latest' ) !== false;
      $is_latest_b = strpos( $model_b, '-latest' ) !== false;
      
      if ( $is_latest_a && !$is_latest_b ) return -1;
      if ( !$is_latest_a && $is_latest_b ) return 1;
      
      // Then preview models (sorted by date descending)
      preg_match( '/-preview-(\d{2})-(\d{2})/', $model_a, $date_a );
      preg_match( '/-preview-(\d{2})-(\d{2})/', $model_b, $date_b );
      
      if ( !empty( $date_a ) && !empty( $date_b ) ) {
        // Compare dates (month then day)
        $month_a = intval( $date_a[1] );
        $month_b = intval( $date_b[1] );
        if ( $month_a !== $month_b ) {
          return $month_b - $month_a; // Descending
        }
        $day_a = intval( $date_a[2] );
        $day_b = intval( $date_b[2] );
        return $day_b - $day_a; // Descending
      }
      
      if ( !empty( $date_a ) && empty( $date_b ) ) return -1;
      if ( empty( $date_a ) && !empty( $date_b ) ) return 1;
      
      // Finally, numbered versions (descending)
      preg_match( '/-(\d{3})$/', $model_a, $num_a );
      preg_match( '/-(\d{3})$/', $model_b, $num_b );
      
      if ( !empty( $num_a ) && !empty( $num_b ) ) {
        return intval( $num_b[1] ) - intval( $num_a[1] );
      }
      
      // Fallback to string comparison
      return strcasecmp( $model_a, $model_b );
    });
    
    return $models;
  }

  /**
  * Handle image generation queries for Gemini Flash Image models.
  * Google's image generation models use the same generateContent endpoint,
  * so we directly call it and extract the image data.
  *
  * @param Meow_MWAI_Query_Image $query
  * @param callable $streamCallback Optional callback for streaming events
  * @return Meow_MWAI_Reply
  */
  public function run_image_query( $query, $streamCallback = null ) {
    // Check if the model supports image generation
    $modelInfo = $this->core->get_engine_models( 'google' );
    $supportsImageGen = false;

    foreach ( $modelInfo as $model ) {
      if ( $model['model'] === $query->model &&
           isset( $model['features'] ) &&
           in_array( 'image-generation', $model['features'] ) ) {
        $supportsImageGen = true;
        break;
      }
    }

    if ( !$supportsImageGen ) {
      throw new Exception( 'The model ' . $query->model . ' does not support image generation.' );
    }

    // Initialize debug mode
    $this->init_debug_mode( $query );

    // Emit image generation event if streaming is enabled
    if ( $this->currentDebugMode && !empty( $streamCallback ) ) {
      $event = new Meow_MWAI_Event( 'live', MWAI_STREAM_TYPES['IMAGE_GEN'] );
      $event->set_content( 'Generating image...' );
      call_user_func( $streamCallback, $event );
    }

    // Build the request for image generation
    $body = [
      'contents' => [
        [
          'parts' => [
            [ 'text' => $query->get_message() ]
          ]
        ]
      ],
      'generationConfig' => [
        'candidateCount' => $query->maxResults,
        'temperature' => $query->temperature
      ]
    ];

    // Build URL and headers
    $url = $this->endpoint . '/models/' . $query->model . ':generateContent';
    if ( strpos( $url, '?' ) === false ) {
      $url .= '?key=' . $this->apiKey;
    }
    else {
      $url .= '&key=' . $this->apiKey;
    }

    $headers = $this->build_headers( $query );
    $options = $this->build_options( $headers, $body );

    try {
      $res = $this->run_query( $url, $options );
      $data = $res['data'];

      if ( empty( $data ) || !isset( $data['candidates'] ) ) {
        throw new Exception( 'No image generated in response.' );
      }

      $reply = new Meow_MWAI_Reply( $query );
      $reply->set_type( 'images' );
      $images = [];

      // Extract base64 images from the response
      foreach ( $data['candidates'] as $candidate ) {
        if ( isset( $candidate['content']['parts'] ) ) {
          foreach ( $candidate['content']['parts'] as $part ) {
            if ( isset( $part['inline_data'] ) && isset( $part['inline_data']['data'] ) ) {
              // Found an inline image
              $base64Data = $part['inline_data']['data'];
              $mimeType = $part['inline_data']['mimeType'] ?? 'image/png';

              // Convert to data URL format for consistency with other engines
              $dataUrl = 'data:' . $mimeType . ';base64,' . $base64Data;

              // Handle local download if requested
              if ( $query->localDownload === 'uploads' || $query->localDownload === 'library' ) {
                $fileId = $this->core->files->upload_file( $dataUrl, null, 'generated', [
                  'query_envId' => $query->envId,
                  'query_session' => $query->session,
                  'query_model' => $query->model,
                ], $query->envId, $query->localDownload, $query->localDownloadExpiry );
                $fileUrl = $this->core->files->get_url( $fileId );
                $images[] = $fileUrl;
              }
              else {
                $images[] = $dataUrl;
              }
            }
          }
        }
      }

      if ( empty( $images ) ) {
        throw new Exception( 'No images found in the response.' );
      }

      $reply->results = $images;
      $reply->result = $images[0]; // Set the first image as the main result

      // Handle usage for image generation
      $resolution = '1024x1024'; // Default resolution for Gemini
      $usage = $this->core->record_images_usage( $query->model, $resolution, count( $images ) );
      $reply->set_usage( $usage );
      $reply->set_usage_accuracy( 'estimated' );

      return $reply;
    }
    catch ( Exception $e ) {
      Meow_MWAI_Logging::error( '(Google) ' . $e->getMessage() );
      throw new Exception( 'From Google: ' . $e->getMessage() );
    }
  }

  /**
  * Google pricing is not currently supported.
  *
  * @return null
  */
  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply ) {
    return null;
  }

  /**
   * Check the connection to Google by listing models.
   * Uses the existing retrieve_models method with a limit for quick check.
   */
  public function connection_check() {
    try {
      // Use the existing retrieve_models method
      $models = $this->retrieve_models();

      if ( !is_array( $models ) ) {
        throw new Exception( 'Invalid response format from Google' );
      }

      $modelCount = count( $models );
      $availableModels = [];

      // Get first 5 models for display
      $displayModels = array_slice( $models, 0, 5 );
      foreach ( $displayModels as $model ) {
        if ( isset( $model['model'] ) ) {
          $availableModels[] = $model['model'];
        }
      }

      return [
        'success' => true,
        'service' => 'Google',
        'message' => "Connection successful. Found {$modelCount} Gemini models.",
        'details' => [
          'endpoint' => $this->endpoint . '/models',
          'model_count' => $modelCount,
          'sample_models' => $availableModels,
          'region' => $this->region ?? 'us-central1'
        ]
      ];
    }
    catch ( Exception $e ) {
      return [
        'success' => false,
        'service' => 'Google',
        'error' => $e->getMessage(),
        'details' => [
          'endpoint' => $this->endpoint . '/models'
        ]
      ];
    }
  }
}
