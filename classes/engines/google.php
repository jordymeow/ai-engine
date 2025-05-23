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
  function check_for_error( $data ) {
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
   * Format a function call for internal usage.
   *
   * @param array $rawMessage
   * @return array
   */
  private function format_function_call( $rawMessage ) {
    if ( !isset( $rawMessage['function_call'] ) ) {
      return $rawMessage;
    }
    $parts = [];
    $functionCall = [ 'name' => $rawMessage['function_call']['name'] ];
    if ( !empty( $rawMessage['function_call']['args'] ) ) {
      $functionCall['args'] = $rawMessage['function_call']['args'];
    }
    $parts[] = [ 'functionCall' => $functionCall ];
    if ( isset( $rawMessage['content'] ) && !empty( $rawMessage['content'] ) ) {
      $parts[] = [ 'text' => $rawMessage['content'] ];
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

    // 6. Feedback data for Meow_MWAI_Query_Feedback.
    if ( $query instanceof Meow_MWAI_Query_Feedback && !empty( $query->blocks ) ) {
      foreach ( $query->blocks as $feedback_block ) {
        $messages[] = $this->format_function_call( $feedback_block['rawMessage'] );
        foreach ( $feedback_block['feedbacks'] as $feedback ) {
          $messages[] = [
            'role' => 'function',
            'parts' => [
              [
                'functionResponse' => [
                  'name' => $feedback['request']['name'],
                  'response' => [ 'content' => $feedback['reply']['value'] ]
                ]
              ]
            ]
          ];
        }
      }
    }
    return $messages;
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

    $body = [
      'generationConfig' => [
        'candidateCount' => $query->maxResults,
        'maxOutputTokens' => $query->maxTokens,
        'temperature' => $query->temperature,
        'stopSequences' => []
      ]
    ];

    if ( !empty( $query->functions ) ) {
      $body['tools'] = [ [ 'function_declarations' => [] ] ];
      foreach ( $query->functions as $function ) {
        $body['tools'][0]['function_declarations'][] = $function->serializeForOpenAI();
      }
      $body['tool_config'] = [
        'function_calling_config' => [ 'mode' => 'AUTO' ]
      ];
    }
    $body['contents'] = $this->build_messages( $query );
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
      $reply = new Meow_MWAI_Reply( $query );

      $data = $res['data'];
      if ( empty( $data ) ) {
        throw new Exception( 'No content received (res is null).' );
      }

      $returned_choices = [];
      if ( isset( $data['candidates'] ) ) {
        foreach ( $data['candidates'] as $candidate ) {
          $content = $candidate['content'];
          if ( isset( $content['parts'][0]['functionCall'] ) ) {
            $function_call = $content['parts'][0]['functionCall'];
            $returned_choices[] = [
              'message' => [
                'content' => null,
                'function_call' => $function_call
              ]
            ];
          }
          elseif ( isset( $content['parts'][0]['text'] ) ) {
            $text = $content['parts'][0]['text'];
            $returned_choices[] = [ 'role' => 'assistant', 'text' => $text ];
          }
        }
      }

      $reply->set_choices( $returned_choices );
      $this->handle_tokens_usage( $reply, $query, $query->model, null, null );
      return $reply;
    }
    catch ( Exception $e ) {
      Meow_MWAI_Logging::error( '(Google) ' . $e->getMessage() );
      throw new Exception( 'From Google: ' . $e->getMessage() );
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
  public function retrieve_models() {
    $url = $this->endpoint . '/models?key=' . $this->apiKey;
    $response = wp_remote_get( $url );
    if ( is_wp_error( $response ) ) {
      throw new Exception( 'AI Engine: ' . $response->get_error_message() );
    }
    $body = json_decode( $response['body'], true );
    $models = [];
    foreach ( $body['models'] as $model ) {
      if ( strpos( $model['name'], 'gemini' ) === false ) {
        continue;
      }
      $family = 'gemini';
      $maxCompletionTokens = $model['outputTokenLimit'];
      $maxContextualTokens = $model['inputTokenLimit'];
      $priceIn = 0;
      $priceOut = 0;
      $tags = [ 'core', 'chat' ];

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
      $name = preg_replace( '/^models\//', '', $model['name'] );
      $model = [
        'model' => $name,
        'name' => $name,
        'family' => $family,
        'features' => [ 'completion' ],
        'type' => 'token',
        'unit' => 1 / 1000,
        'maxCompletionTokens' => $maxCompletionTokens,
        'maxContextualTokens' => $maxContextualTokens,
        'tags' => $tags
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
}
