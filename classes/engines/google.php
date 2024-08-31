<?php

class Meow_MWAI_Engines_Google extends Meow_MWAI_Engines_Core
{
  // Base (Google)
  protected $apiKey = null;
  protected $region = null;
  protected $projectId = null;
  protected $endpoint = null;

  // Response
  protected $inModel = null;
  protected $inId = null;

  // Streaming
  private $streamFunctionCall = null;

  public function __construct( $core, $env )
  {
    parent::__construct( $core, $env );
    $this->set_environment();
  }

  protected function set_environment() {
    $env = $this->env;
    $this->apiKey = $env['apikey'];
    if ( $this->envType === 'google' ) {
      // https://{REGION}-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/locations/{REGION}/publishers/google
      $this->region = $env['region'];
      $this->projectId = $env['projectId'];

      // Google Cloud API
      // $this->endpoint = apply_filters( 'mwai_google_endpoint', "https://{$this->region}-aiplatform.googleapis.com/v1/projects/{$this->projectId}/locations/{$this->region}/publishers/google", $this->env );

      // Generative Language API (less issues with auth)
      $this->endpoint = apply_filters( 'mwai_google_endpoint', "https://generativelanguage.googleapis.com/v1", $this->env );
    }
    else {
      throw new Exception( 'Unknown environment type: ' . $this->envType );
    }
  }

  // Check for a JSON-formatted error in the data, and throw an exception if it's the case.
  function check_for_error( $data ) {
    if ( strpos( $data, 'error' ) === false ) {
      return;
    }
    if ( strpos( $data, 'data: ' ) === 0 ) {
      $jsonPart = substr( $data, strlen( 'data: ' ) );
    }
    else {
      $jsonPart = $data;
    }
    $json = json_decode( $jsonPart, true );
    if ( json_last_error() === JSON_ERROR_NONE ) {
      if ( isset( $json['error'] ) ) {
        $error = $json['error'];
        $code = $error['code'];
        $message = $error['message'];
        throw new Exception( "Error $code: $message" );
      }
    }
  }

  private function build_messages( $query ) {
    $messages = [];

    // First, we need to add the first message (the instructions).
    if ( !empty( $query->instructions ) ) {
      $messages[] = [ 'role' => 'model', 'parts' => [ [ 'text' => $query->instructions ] ] ];
    }

    // Then, if any, we need to add the 'messages', they are already formatted.
    foreach ( $query->messages as $message ) {
      // messages contains role and content (as OpenAI does it, but we need to convert it to Google's format)
      // role's assistant should be model, and user should be user.
      $newMessage = [ 'role' => $message['role'], 'parts' => [] ];
      if ( isset( $message['content'] ) ) {
        $newMessage['parts'][] = [ 'text' => $message['content'] ];
      }
      if ( $newMessage['role'] === 'assistant' ) {
        $newMessage['role'] = 'model';
      }
      $messages[] = $newMessage;
    }

    // If there is a context, we need to add it.
    if ( !empty( $query->context ) ) {
      $messages[] = [ 'role' => 'model', 'parts' => [ [ 'text' => $query->context ] ] ];
    }

    // Finally, we need to add the message, but if there is an image, we need to add it as a model message.
    if ( $query->attachedFile) {
      // Gemini doesn't handle URL uploads, so we need to convert it to base64.
      //$remote_upload = $this->core->get_option( 'image_remote_upload' );
      $data = $query->attachedFile->get_base64();
      //$data = strpos( $data, 'data:' ) === 0;
      $messages[] = [ 
        'role' => 'user',
        'parts' => [
          [
            "inlineData" => [
              "mimeType" => "image/jpeg",
              "data" => $data // We need to be careful here to get only the data part
            ]
          ],
          [
            "text" => $query->get_message()
          ]
        ]
      ];
      // TODO: Gemini doesn't support multiturn chat with Vision...
      // So we only keep the message that goes with the image.
      $messages = array_slice( $messages, -1 );
    }
    else {
      $messages[] = [ 'role' => 'user', 'parts' => [ [ 'text' => $query->get_message() ] ] ];
    }

    // Streamline the messages
    $messages = $this->streamline_messages( $messages, 'model', 'parts' );

    return $messages;
  }

  protected function stream_data_handler( $json ) {
    $content = null;

    // Get the content
    if ( isset( $json['candidates'][0]['content']['parts'][0]['text'] ) ) {
      $content = $json['candidates'][0]['content']['parts'][0]['text'];
    }

    // Avoid some endings
    $endings = [ "<|im_end|>", "</s>" ];
    if ( in_array( $content, $endings ) ) {
      $content = null;
    }

    return ( $content === '0' || !empty( $content ) ) ? $content : null;
  }

  protected function build_headers( $query ) {
    if ( $query->apiKey ) {
      $this->apiKey = $query->apiKey;
    }
    if ( empty( $this->apiKey ) ) {
      throw new Exception( 'No API Key provided. Please visit the Settings.' );
    }
    $headers = array(
      'Content-Type' => 'application/json',
    );
    return $headers;
  }

  protected function build_options( $headers, $json = null, $forms = null, $method = 'POST' ) {
    $body = null;
    if ( !empty( $forms ) ) {
      throw new Exception( 'No support for form-data requests yet.' );
      // $boundary = wp_generate_password ( 24, false );
      // $headers['Content-Type'] = 'multipart/form-data; boundary=' . $boundary;
      // $body = $this->build_form_body( $forms, $boundary );
    }
    else if ( !empty( $json ) ) {
      $body = json_encode( $json );
    }
    $options = array(
      'headers' => $headers,
      'method' => $method,
      'timeout' => MWAI_TIMEOUT,
      'body' => $body,
      'sslverify' => false
    );
    return $options;
  }

  public function run_query( $url, $options, $isStream = false ) {
    try {
      $options['stream'] = $isStream;
      if ( $isStream ) {
        $options['filename'] = tempnam( sys_get_temp_dir(), 'mwai-stream-' );
      }
      $res = wp_remote_get( $url, $options );

      if ( is_wp_error( $res ) ) {
        throw new Exception( $res->get_error_message() );
      }

      if ( $isStream ) {
        return [ 'stream' => true ]; 
      }

      $response = wp_remote_retrieve_body( $res );
      $headersRes = wp_remote_retrieve_headers( $res );
      $headers = $headersRes->getAll();

      // Check if Content-Type is 'multipart/form-data' or 'text/plain'
      // If so, we don't need to decode the response
      $normalizedHeaders = array_change_key_case( $headers, CASE_LOWER );
      $resContentType = $normalizedHeaders['content-type'] ?? '';
      if ( strpos( $resContentType, 'multipart/form-data' ) !== false || strpos( $resContentType, 'text/plain' ) !== false ) {
        return [ 'stream' => false, 'headers' => $headers, 'data' => $response ];
      }

      $data = json_decode( $response, true );
      $this->handle_response_errors( $data );
      return [ 'headers' => $headers, 'data' => $data ];
    }
    catch ( Exception $e ) {
      Meow_MWAI_Logging::error( "(Google) " . $e->getMessage() );
      throw $e;
    }
    finally {
      if ( $isStream && file_exists( $options['filename'] ) ) {
        unlink( $options['filename'] );
      }
    }
  }

  public function run_completion_query( $query, $streamCallback = null ) : Meow_MWAI_Reply {
    if ( !is_null( $streamCallback ) ) {
      $this->streamCallback = $streamCallback;
      add_action( 'http_api_curl', array( $this, 'stream_handler' ), 10, 3 );
    }

    $body = array(
      "generationConfig" => [
        "candidateCount" => $query->maxResults,
        "maxOutputTokens" => $query->maxTokens,
        "temperature" => $query->temperature,
        "stopSequences" => [],
      ],
    );

    // if ( !empty( $query->stop ) ) {
    //   $body['generationConfig']['stop'] = $query->stop;
    // }

    // if ( !empty( $query->responseFormat ) ) {
    //   if ( $query->responseFormat === 'json' ) {
    //     $body['response_format'] = [ 'type' => 'json_object' ];
    //   }
    // }

    if ( !empty( $query->functions ) ) {
      throw new Exception( 'AI Engine doesn\'t support Function Calling with Google models yet.' );
      //$body['functions'] = $query->functions;
      //$body['function_call'] = $query->functionCall;
    }

    $body['contents'] = $this->build_messages( $query );
    $url = $this->endpoint;

    // Streaming:
    // $url .= '/models/' . $query->model . ':streamGenerateContent';

    $url .= '/models/' . $query->model . ':generateContent';

    // If streaming is enabled, we need to use the SSE endpoint.
    if ( !is_null( $streamCallback ) ) {
      $url .= '?alt=sse';
    }

    // Add the API key
    if ( strpos( $url, '?' ) === false ) {
      $url .= '?key=' . $this->apiKey;
    }
    else {
      $url .= '&key=' . $this->apiKey;
    }

    $headers = $this->build_headers( $query );
    $options = $this->build_options( $headers, $body );

    try {
      $res = $this->run_query( $url, $options, $streamCallback );
      $reply = new Meow_MWAI_Reply( $query );

      $returned_id = null;
      $returned_model = $this->inModel;
      $returned_in_tokens = null;
      $returned_out_tokens = null;
      $returned_choices = [];

      if ( !is_null( $streamCallback ) ) {
        // Streamed data
        if ( empty( $this->streamContent ) ) {
          $json = json_decode( $this->streamBuffer, true );
          if ( isset( $json['error']['message'] ) ) {
            throw new Exception( $json['error']['message'] );
          }
        }
        $returned_id = $this->inId;
        $returned_model = $this->inModel ? $this->inModel : $query->model;
        $returned_choices = [
          [ 
            'message' => [ 
              'content' => $this->streamContent,
              'function_call' => $this->streamFunctionCall
            ]
          ]
        ];
      }
      else {
        // Regular data
        $data = $res['data'];
        if ( empty( $data ) ) {
          throw new Exception( 'No content received (res is null).' );
        }

        // Not much information from Google's API :(
        $returned_id = null;
        $returned_model = $query->model;
        $returned_in_tokens = null;
        $returned_out_tokens = null;

        // We should return the candidates formatted as OpenAI does it.
        $returned_choices = [];
        if ( isset( $data['candidates'] ) ) {
          $candidates = $data['candidates'];
          foreach ( $candidates as $candidate ) {
            $content = $candidate['content'];
            $text = $content['parts'][0]['text'];
            $returned_choices[] = [ 'role' => 'assistant', 'text' => $text ];
          }
        }
      }
      
      // Set the results.
      $reply->set_choices( $returned_choices );
      if ( !empty( $returned_id ) ) {
        $reply->set_id( $returned_id );
      }

      // Handle tokens.
      $this->handle_tokens_usage( $reply, $query, $returned_model, $returned_in_tokens, $returned_out_tokens );

      return $reply;
    }
    catch ( Exception $e ) {
      Meow_MWAI_Logging::error( "(Google) " . $e->getMessage() );
      $message = "From Google: " . $e->getMessage();
      throw new Exception( $message );
    }
  }

  public function handle_tokens_usage( $reply, $query, $returned_model,
    $returned_in_tokens, $returned_out_tokens ) {
    $returned_in_tokens = !is_null( $returned_in_tokens ) ?
      $returned_in_tokens : $reply->get_in_tokens( $query );
    $returned_out_tokens = !is_null( $returned_out_tokens ) ?
      $returned_out_tokens : $reply->get_out_tokens();
    $usage = $this->core->record_tokens_usage(
      $returned_model,
      $returned_in_tokens,
      $returned_out_tokens
    );
    $reply->set_usage( $usage );
  }

  /*
    This is the rest of the OpenAI API support, not related to the models directly.
  */

  // Check if there are errors in the response from OpenAI, and throw an exception if so.
  public function handle_response_errors( $data ) {
    if ( isset( $data['error'] ) ) {
      $message = $data['error']['message'];
      if ( preg_match( '/API key provided(: .*)\./', $message, $matches ) ) {
        $message = str_replace( $matches[1], '', $message );
      }
      throw new Exception( $message );
    }
  }

  public function get_models() {
    return $this->core->get_engine_models( 'google' );
  }

  public function retrieve_models() {
    $url = "https://generativelanguage.googleapis.com/v1/models";
    $url .= "?key=" . $this->apiKey;
    $response = wp_remote_get( $url );
    if ( is_wp_error( $response ) ) {
      throw new Exception( 'AI Engine: ' . $response->get_error_message() );
    }
    $body = json_decode( $response['body'], true );
    $models = array();
    foreach ( $body['models'] as $model ) {
      if ( strpos( $model['name'], 'gemini' ) === false ) {
        continue;
      }
      $family = "gemini";
      $maxCompletionTokens = $model['outputTokenLimit'];
      $maxContextualTokens = $model['inputTokenLimit'];
      $priceIn = 0;
      $priceOut = 0;
      $tags = [ 'core', 'chat' ];
      // If the name contains (beta), (alpha) or (preview), add 'preview' tag and remove from name
      if ( preg_match( '/\((beta|alpha|preview)\)/i', $model['name'], $matches ) ) {
        $tags[] = 'preview';
        $model['name'] = preg_replace( '/\((beta|alpha|preview)\)/i', '', $model['name'] );
      }
      // If the name includes 'Vision', add 'vision' tag
      if ( preg_match( '/vision/i', $model['name'], $matches ) ) {
        $tags[] = 'vision';
      }
      else if ( preg_match( '/(vision|multimodal)/i', $model['description'], $matches ) ) {
        $tags[] = 'vision';
      }
      $name = preg_replace( '/^models\//', '', $model['name'] );
      $model = array(
        'model' => $name,
        'name' => $name,
        'family' => $family,
        'features' => ['completion'],
        'type' => 'token',
		    'unit' => 1 / 1000,
        'maxCompletionTokens' => $maxCompletionTokens,
        'maxContextualTokens' => $maxContextualTokens,
        'tags' => $tags
      );
      if ( $priceIn > 0 && $priceOut > 0 ) {
        $model['price'] = array(
          'in' => $priceIn,
          'out' => $priceOut,
        );
      }
      $models[] = $model;
    }
    return $models; 
  }

  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply ) {
    // TODO: Not sure how to get the price from Google's API.
    return null;
  }
}
