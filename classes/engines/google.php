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
      error_log( '[AI Engine Queries Debug] Messages before feedback: ' . count( $messages ) );
    }

    // 6. Feedback data for Meow_MWAI_Query_Feedback.
    if ( $query instanceof Meow_MWAI_Query_Feedback && !empty( $query->blocks ) ) {
      foreach ( $query->blocks as $feedback_block ) {
        // Debug logging of raw message
        if ( $this->core->get_option( 'queries_debug_mode' ) ) {
          error_log( '[AI Engine Queries Debug] Raw message before formatting: ' . json_encode( $feedback_block['rawMessage'] ) );
        }

        $formattedMessage = $this->format_function_call( $feedback_block['rawMessage'] );

        // Debug logging of formatted message
        if ( $this->core->get_option( 'queries_debug_mode' ) ) {
          error_log( '[AI Engine Queries Debug] Formatted function call message: ' . json_encode( $formattedMessage ) );
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
            error_log( '[AI Engine Queries Debug] ERROR: ' . $errorMsg );

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

            error_log( '[AI Engine Queries Debug] Called functions: ' . implode( ', ', $calledFunctions ) );
            error_log( '[AI Engine Queries Debug] Responded functions: ' . implode( ', ', $respondedFunctions ) );
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
            error_log( '[AI Engine Queries Debug] Function response: ' . json_encode( $functionResponseMessage ) );
          }

          $messages[] = $functionResponseMessage;
        }
      }
    }

    // Debug logging of all messages
    if ( $this->core->get_option( 'queries_debug_mode' ) ) {
      error_log( '[AI Engine Queries Debug] Total messages to Google: ' . count( $messages ) );
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
        error_log( '[AI Engine Queries Debug] Message[' . $index . ']: ' . $preview );
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
              error_log( '[AI Engine Queries Debug] Google returned ' . count( $functionCalls ) . ' function calls in one response' );
              foreach ( $functionCalls as $idx => $fc ) {
                error_log( '[AI Engine Queries Debug] Function call[' . $idx . ']: ' . $fc['name'] );
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
        error_log( '[AI Engine Queries Debug] Google reply has ' . count( $reply->needFeedbacks ) . ' needFeedbacks' );
        foreach ( $reply->needFeedbacks as $idx => $feedback ) {
          error_log( '[AI Engine Queries Debug] Feedback[' . $idx . ']: ' . $feedback['name'] );
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
            error_log( '[AI Engine Queries Debug] Thinking tokens used: ' . $usageMetadata['thoughtsTokenCount'] );
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
    // Special cases for specific models
    $special_names = [
      'gemini-embedding-exp' => 'Gemini Embedding',
      'gemini-live-2.5-flash-preview' => 'Gemini 2.5 Flash Live',
      'gemini-2.0-flash-live-001' => 'Gemini 2.0 Flash Live',
      'imagen-4.0-generate-preview-06-06' => 'Imagen 4',
      'imagen-4.0-ultra-generate-preview-06-06' => 'Imagen 4 Ultra',
      'imagen-3.0-generate-002' => 'Imagen 3',
      'veo-2.0-generate-001' => 'Veo 2',
    ];

    if ( isset( $special_names[$model_id] ) ) {
      return $special_names[$model_id];
    }

    // Remove common suffixes
    $cleaned = $model_id;
    $cleaned = preg_replace( '/-preview-\d{2}-\d{2}$/', '', $cleaned );
    $cleaned = preg_replace( '/-\d{3}$/', '', $cleaned );
    $cleaned = preg_replace( '/-preview$/', '', $cleaned );
    $cleaned = preg_replace( '/-exp$/', '', $cleaned );
    $cleaned = preg_replace( '/-generate$/', '', $cleaned );

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
      $cleaned = str_replace( 'preview-tts', 'Preview TTS', $cleaned );
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
      else if ( preg_match( '/^\d+B$/', $part ) ) {
        // Model sizes like 8B
        $formatted_parts[] = '-' . $part;
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
    foreach ( $body['models'] as $model ) {
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

      // If Model Name contains "Experimental", skip it
      if ( strpos( $model['name'], '-exp' ) !== false ) {
        error_log( 'Skipping experimental model: ' . $model['name'] );
        continue;
      }

      // Set tags based on model family and features
      $tags = [ 'core' ];
      $features = [ 'completion' ];

      if ( $family === 'imagen' ) {
        $tags[] = 'image-generation';
        $features = [ 'image-generation' ];
      }
      else if ( $family === 'veo' ) {
        $tags[] = 'video-generation';
        $features = [ 'video-generation' ];
      }
      else {
        // Gemini models
        $tags[] = 'chat';

        if ( preg_match( '/\((beta|alpha|preview)\)/i', $model['name'] ) ) {
          $tags[] = 'preview';
          $model['name'] = preg_replace( '/\((beta|alpha|preview)\)/i', '', $model['name'] );
        }
        if ( preg_match( '/vision/i', $model['name'] ) ) {
          $tags[] = 'vision';
        }
        else if ( preg_match( '/(vision|multimodal)/i', $model['description'] ) ) {
          $tags[] = 'vision';
        }
        if ( preg_match( '/flash/i', $model['name'] ) ) {
          $tags[] = 'vision';
          $tags[] = 'functions';
        }
        if ( preg_match( '/(tts|text-to-speech)/i', $model['name'] ) ) {
          $tags[] = 'tts';
          $features = [ 'text-to-speech' ];
        }
        if ( preg_match( '/embedding/i', $model['name'] ) ) {
          $tags[] = 'embedding';
          $features = [ 'embedding' ];
        }
      }
      $model_id = preg_replace( '/^models\//', '', $model['name'] );
      $nice_name = $this->format_model_name( $model_id );
      
      // Default tools
      $tools = [ 'web_search' ];
      
      // Add thinking tool for Gemini 2.5 models
      if ( preg_match( '/gemini-2\.5-(pro|flash)/i', $model_id ) ) {
        $tools[] = 'thinking';
        $tags[] = 'thinking';
      }
      
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
      if ( $priceIn > 0 && $priceOut > 0 ) {
        $model['price'] = [ 'in' => $priceIn, 'out' => $priceOut ];
      }
      $models[] = $model;
    }
    return $models;
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
