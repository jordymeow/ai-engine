<?php

class Meow_MWAI_Engines_Replicate extends Meow_MWAI_Engines_Core
{
  // Base (Replicate)
  protected $apiKey = null;
  protected $organizationId = null;

  // Response
  protected $inModel = null;
  protected $inId = null;

  // Streaming
  protected $streamFunctionCall = null;
  protected $streamToolCalls = [];
  protected $streamLastMessage = null;
  protected $streamImageIds = [];
  protected $streamInTokens = null;
  protected $streamOutTokens = null;

  public function __construct( $core, $env )
  {
    parent::__construct( $core, $env );
    $this->set_environment();
  }

  public function reset_stream() {
    $this->streamContent = null;
    $this->streamBuffer = null;
    $this->streamFunctionCall = null;
    $this->streamToolCalls = [];
    $this->streamLastMessage = null;
    $this->streamInTokens = null;
    $this->streamOutTokens = null;
    $this->inModel = null;
    $this->inId = null;
  }

  protected function set_environment() {
    $env = $this->env;
    $this->apiKey = $env['apikey'];
  }

  protected function build_messages( $query ) {
    $messages = [];

    // First, we need to add the first message (the instructions).
    if ( !empty( $query->instructions ) ) {
      $messages[] = [ 'role' => 'system', 'content' => $query->instructions ];
    }

    // Then, if any, we need to add the 'messages', they are already formatted.
    foreach ( $query->messages as $message ) {
      $messages[] = $message;
    }

    // If there is a context, we need to add it.
    if ( !empty( $query->context ) ) {
      $messages[] = [ 'role' => 'system', 'content' => $query->context ];
    }

    // Finally, we need to add the message, but if there is an image, we need to add it as a system message.
    if ( $query->attachedFile ) {
      $finalUrl = null;
      if ( $query->image_remote_upload ) {
        $finalUrl = $query->attachedFile->get_url();
      }
      else {
        $finalUrl = $query->attachedFile->get_inline_base64_url();
      }
      $messages[] = [ 
        'role' => 'user',
        'content' => [
          [
            "type" => "text",
            "text" => $query->get_message()
          ],
          [
            "type" => "image_url",
            "image_url" => [ 
              "url" => $finalUrl
            ]
          ]
        ]
      ];
    }
    else {
      $messages[] = [ 'role' => 'user', 'content' => $query->get_message() ];
    }

    return $messages;
  }

  protected function build_body( $query, $streamCallback = null, $extra = null ) {
    if ( $query instanceof Meow_MWAI_Query_Text ) {
      $body = array(
        "model" => $query->model,
        "stream" => !is_null( $streamCallback ),
      );

      if ( !empty( $query->maxTokens ) ) {
        $body['max_tokens'] = $query->maxTokens;
      }

      if ( !empty( $query->temperature ) ) {
        $body['temperature'] = $query->temperature;
      }

      if ( !empty( $query->maxResults ) ) {
        $body['n'] = $query->maxResults;
      }
  
      if ( !empty( $query->stop ) ) {
        $body['stop'] = $query->stop;
      }
  
      if ( !empty( $query->responseFormat ) ) {
        if ( $query->responseFormat === 'json' ) {
          $body['response_format'] = [ 'type' => 'json_object' ];
        }
      }


      // Usage Data (only for Replicate)
      // https://cookbook.openai.com/examples/how_to_stream_completions#4-how-to-get-token-usage-data-for-streamed-chat-completion-response
      if ( !empty( $streamCallback ) && $this->envType === 'openai' ) {
        $body['stream_options'] = [
          'include_usage' => true,
        ];
      }
  
      if ( !empty( $query->functions ) ) {
        $model = $this->retrieve_model_info( $query->model );
        if ( !empty( $model['tags'] ) && !in_array( 'functions', $model['tags'] ) ) {
          Meow_MWAI_Logging::warn( 'The model ' . $query->model . ' doesn\'t support Function Calling.' );
        }
        else if ( strpos( $query->model, 'ft:' ) === 0 ) {
          Meow_MWAI_Logging::warn( 'Replicate doesn\'t support Function Calling with fine-tuned models yet.' );
        }
        else {
          $body['tools'] = [];
          // Dynamic function: they will interactively enhance the completion (tools).
          foreach ( $query->functions as $function ) {
            $body['tools'][] = [
              'type' => 'function',
              'function' => $function->serializeForReplicate()
            ];
          }
          // Static functions: they will be executed at the end of the completion.
          //$body['function_call'] = $query->functionCall;
        }
      }

      $body['messages'] = $this->build_messages( $query );

      // Add the feedback if it's a feedback query.
      if ( $query instanceof Meow_MWAI_Query_Feedback ) {
        if ( !empty( $query->blocks ) ) {
          foreach ( $query->blocks as $feedback_block ) {
            $body['messages'][] = $feedback_block['rawMessage'];
            foreach ( $feedback_block['feedbacks'] as $feedback ) {
              $body['messages'][] = [
                'tool_call_id' => $feedback['request']['toolId'],
                "role" => "tool",
                'name' => $feedback['request']['name'],
                'content' => $feedback['reply']['value']
              ];
            }
          }
        }
        return $body;
      }

      return $body;
    }
    else if ( $query instanceof Meow_MWAI_Query_Transcribe ) {
      $body = array( 
        'prompt' => $query->message,
        'model' => $query->model,
        'response_format' => 'text',
        'file' => basename( $query->url ),
        'data' => $extra
      );
      return $body;
    }
    else if ( $query instanceof Meow_MWAI_Query_Embed ) {
      $body = array( 'input' => $query->message, 'model' => $query->model );
      if ( $this->envType === 'azure' ) {
        $body = array( "input" => $query->message );
      }
      // Dimensions are only supported by v3 models
      if ( !empty( $query->dimensions ) && strpos( $query->model, 'ada-002' ) === false ) {
        $body['dimensions'] = $query->dimensions;
      }
      return $body;
    }
    else if ( $query instanceof Meow_MWAI_Query_Image ) {
      $model = $query->model;
      $modelInfo = $this->retrieve_model_info( $model );
      $body = array( "input" => [] );

      if ( isset( $modelInfo['version'] ) ) {
        $body['version'] = $modelInfo['version'];
      }

      // From Replicate:
      // Files should be passed as HTTP URLs or data URLs.

      if ( $query->feature === 'text-to-image' ) {

        // This works with Flux
        // The model name starts with black-forest-labs/
        if ( strpos( $model, 'black-forest-labs/' ) === 0 ) {
          $body['input']['steps'] = 25;
          $body['input']['prompt'] = $query->message;
          $body['input']['safety_tolerance'] = 5;
          if ( !empty( $query->resolution ) ) {
            $body['input']['aspect_ratio'] = $query->resolution;
            $body['input']['output_format'] = 'jpg';
            $body['input']['output_quality'] = 85;
          }
        }
        else if ( strpos( $model, 'stability-ai/' ) === 0 ) {
          $body['input']['prompt'] = $query->message;
          $body['input']['num_inference_steps'] = 25;
          if ( !empty( $query->resolution ) ) {
            // $query->resolution is actually a string like 1024x1024
            $parts = explode( 'x', $query->resolution );
            $width = intval( $parts[0] );
            $height = intval( $parts[1] );
            $body['input']['width'] = $width;
            $body['input']['height'] = $height;
          }
        }
        else {
          throw new Exception( 'The model ' . $model . ' is not supported for text-to-image.' );
        }

        // seed
        // steps: Number of diffusion steps
        // guidance: Controls the balance between adherence to the text prompt and image quality/diversity. Higher values make the output more closely match the prompt but may reduce overall image quality. Lower values allow for more creative freedom but might produce results less relevant to the prompt.
        // interval: Interval is a setting that increases the variance in possible outputs letting the model be a tad more dynamic in what outputs it may produce in terms of composition, color, detail, and prompt interpretation. Setting this value low will ensure strong prompt following with more consistent outputs, setting it higher will produce more dynamic or varied outputs.
        // aspect_ratio: Aspect ratio for the generated image
        // safety_tolerance: Safety tolerance, 1 is most strict and 5 is most permissive
      }
      return $body;
    }
  }

  protected function build_url( $query, $endpoint = null ) {
    $url = "";
    $env = $this->env;
    // This endpoint is basically Replicate or Azure, but in the case this class
    // is overriden, we can pass the endpoint directly (for OpenRouter or HuggingFace, for example).
    if ( empty( $endpoint ) ) {
      $endpoint = apply_filters( 'mwai_replicate_endpoint', 'https://api.replicate.com/v1', $this->env );
    }
    // Add the base API to the URL
    if ( $query instanceof Meow_MWAI_Query_Text || $query instanceof Meow_MWAI_Query_Feedback ) {
      throw new Exception( 'Not implemented yet.' );
      return $url;
    }
    else if ( $query instanceof Meow_MWAI_Query_Transcribe ) {
      throw new Exception( 'Not implemented yet.' );
      return $url;
    }
    else if ( $query instanceof Meow_MWAI_Query_Embed ) {
      throw new Exception( 'Not implemented yet.' );
      return $url;
    }
    else if ( $query instanceof Meow_MWAI_Query_Image ) {
      //$url .= trailingslashit( $endpoint ) . 'models/' . $query->model . '/predictions';
      $url .= trailingslashit( $endpoint ) . 'predictions';
      return $url;
    }
    throw new Exception( 'The query is not supported by build_url().' );
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
      'Authorization' => 'Bearer ' . $this->apiKey,
    );
    if ( $this->organizationId ) {
      $headers['Replicate-Organization'] = $this->organizationId;
    }
    if ( $this->envType === 'azure' ) {
      $headers = array( 'Content-Type' => 'application/json', 'api-key' => $this->apiKey );
    }
    return $headers;
  }

  protected function build_options( $headers, $json = null, $forms = null, $method = 'POST' ) {
    $body = null;
    if ( !empty( $forms ) ) {
      $boundary = wp_generate_password ( 24, false );
      $headers['Content-Type'] = 'multipart/form-data; boundary=' . $boundary;
      $body = $this->build_form_body( $forms, $boundary );
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

      $responseCode = wp_remote_retrieve_response_code( $res );
      if ( $responseCode === 404 ) {
        throw new Exception( 'The model\'s API URL was not found: ' . $url );
      }
      if ( $responseCode === 400 ) {
        $message = wp_remote_retrieve_body( $res );
        if ( empty( $message ) ) {
          $message = wp_remote_retrieve_response_message( $res );
        }
        if ( empty( $message ) ) {
          $message = 'Bad Request';
        }
        throw new Exception( $message );
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
      Meow_MWAI_Logging::error( 'Replicate: ' . $e->getMessage() );
      throw $e;
    }
    finally {
      if ( $isStream && file_exists( $options['filename'] ) ) {
        unlink( $options['filename'] );
      }
    }
  }

  public function try_decode_error( $data ) {
    $json = json_decode( $data, true );
    if ( isset( $json['error']['message'] ) ) {
      return $json['error']['message'];
    }
    return null;
  }

  public function run_completion_query( $query, $streamCallback = null ) : Meow_MWAI_Reply {
    $isStreaming = !is_null( $streamCallback );

    if ( $isStreaming ) {
      $this->streamCallback = $streamCallback;
      add_action( 'http_api_curl', [ $this, 'stream_handler' ], 10, 3 );
    }

    $this->reset_stream();
    $body = $this->build_body( $query, $streamCallback );
    $url = $this->build_url( $query );
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
        if ( !empty( $this->streamFunctionCall ) ) {
          $message['function_call'] = $this->streamFunctionCall;
        }
        if ( !empty( $this->streamToolCalls ) ) {
          $message['tool_calls'] = $this->streamToolCalls;
        }
        if ( !is_null( $this->streamInTokens ) ) {
          $returned_in_tokens = $this->streamInTokens;
        }
        if ( !is_null( $this->streamOutTokens ) ) {
          $returned_out_tokens = $this->streamOutTokens;
        }
        $returned_choices = [ [ 'message' => $message ] ];
      }
      // Standard Mode
      else {
        $data = $res['data'];
        if ( empty( $data ) ) {
          throw new Exception( 'No content received (res is null).' );
        }
        if ( !$data['model'] ) {
          Meow_MWAI_Logging::error( 'Replicate: Invalid response (no model information).' );
          Meow_MWAI_Logging::error( print_r( $data, 1 ) );
          throw new Exception( 'Invalid response (no model information).' );
        }
        $returned_id = $data['id'];
        $returned_model = $data['model'];
        $returned_in_tokens = isset( $data['usage']['prompt_tokens'] ) ?
          $data['usage']['prompt_tokens'] : null;
        $returned_out_tokens = isset( $data['usage']['completion_tokens'] ) ?
          $data['usage']['completion_tokens'] : null;
        $returned_price = isset( $data['usage']['total_cost'] ) ?
          $data['usage']['total_cost'] : null;
        $returned_choices = $data['choices'];
      }
      
      // Set the results.
      $reply->set_choices( $returned_choices );
      if ( !empty( $returned_id ) ) {
        $reply->set_id( $returned_id );
      }
      if ( !empty( $returned_id ) ) {
        $reply->set_id( $returned_id );
      }

      return $reply;
    }
    catch ( Exception $e ) {
      Meow_MWAI_Logging::error( 'Replicate: ' . $e->getMessage() );
      $message = "From Replicate: " . $e->getMessage();
      throw new Exception( $message );
    }
    finally {
      if ( !is_null( $streamCallback ) ) {
        remove_action( 'http_api_curl', [ $this, 'stream_handler' ] );
      }
    }
  }

  // TODO: We should find a way to add text-to-image somewhere in this query
  public function run_image_query( $query ) {
    $body = $this->build_body( $query );
    $url = $this->build_url( $query );
    $headers = $this->build_headers( $query );
    $options = $this->build_options( $headers, $body );

    try {
      $res = $this->run_query( $url, $options );
      $data = $res['data'];
      if ( $data['status'] === 422 ) {
        if ( isset( $data['title'] ) && isset( $data['detail'] ) ) {
          throw new Exception( $data['title'] . ': ' . $data['detail'] );
        }
        throw new Exception( 'The image generation failed.' );  
      }
      $getUrl = $data['urls']['get'];
      $status = $data['status'];
      while ( $status === 'processing' || $status === 'starting' ) {
        sleep( 1 );
        $data = $this->execute( 'GET', $getUrl, null, null, true, null, null, true );
        $status = $data['status'];
      }
      if ( $status !== 'succeeded' ) {
        // if $data has title and detail, we can use them to throw a more detailed error
        if ( isset( $data['title'] ) && isset( $data['detail'] ) ) {
          throw new Exception( $data['title'] . ': ' . $data['detail'] );
        }
        throw new Exception( 'The image generation failed.' );
      }
      $choices = [];
      $output = isset( $data['output'] ) ? $data['output'] : [];
      // Flux Schnell returns an array of urls in 'output'
      if ( is_array( $output ) ) {
        foreach ( $output as $item ) {
          $choices[] = [ 'url' => $item ];
        }
      }
      // Flux Schnell returns 'url' in 'output'
      else if ( is_string( $output ) ) {
        $choices[] = [ 'url' => $output ];
      }
      if ( empty( $choices ) ) {
        throw new Exception( 'No output URL received.' );
      }
      $reply = new Meow_MWAI_Reply( $query );
      $model = $query->model;
      $resolution = null;
      if ( isset( $data['metrics']['width'] ) && isset( $data['metrics']['height'] ) ) {
        $resolution = $data['metrics']['width'] . 'x' . $data['metrics']['height'];
      }
      else {
        $raw_resolution = Meow_MWAI_Core::get_image_resolution( $choices[0]['url'] );
        if ( !empty( $raw_resolution ) ) {
          $resolution = $raw_resolution['width'] . 'x' . $raw_resolution['height'];
        }

      }
      if ( !empty( $resolution ) ) {
        $usage = $this->core->record_images_usage( $model, $resolution, $query->maxResults );
        $reply->set_usage( $usage );
      }

      $reply->set_choices( $choices );
      $reply->set_type( 'images' );
      
      if ( $query->localDownload === 'uploads' || $query->localDownload === 'library' ) {
        foreach ( $reply->results as &$result ) {
          $fileId = $this->core->files->upload_file( $result, null, 'generated', [
            'query_envId' => $query->envId,
            'query_session' => $query->session,
            'query_model' => $query->model,
          ], $query->envId, $query->localDownload, $query->localDownloadExpiry );
          $fileUrl = $this->core->files->get_url( $fileId );
          $result = $fileUrl;
        }
      }
      $reply->result = $reply->results[0];
      return $reply;
    }
    catch ( Exception $e ) {
      Meow_MWAI_Logging::error( 'Replicate: ' . $e->getMessage() );
      throw new Exception( "From Replicate: " . $e->getMessage() );
    }
  }

  /*
    This is the rest of the Replicate API support, not related to the models directly.
  */

  // Check if there are errors in the response from Replicate, and throw an exception if so.
  protected function handle_response_errors( $data ) {
    if ( isset( $data['error'] ) && !empty( $data['error'] ) ) {
      $message = $data['error'];
      throw new Exception( $message );
    }
  }  

  /**
    * Build the body of a form request.
    * If the field name is 'file', then the field value is the filename of the file to upload.
    * The file contents are taken from the 'data' field.
    *  
    * @param array $fields
    * @param string $boundary
    * @return string
   */
  public function build_form_body( $fields, $boundary )
  {
    $body = '';
    foreach ( $fields as $name => $value ) {
      if ( $name == 'data' ) {
        continue;
      }
      $body .= "--$boundary\r\n";
      $body .= "Content-Disposition: form-data; name=\"$name\"";
      if ( $name == 'file' ) {
        $body .= "; filename=\"{$value}\"\r\n";
        $body .= "Content-Type: application/json\r\n\r\n";
        $body .= $fields['data'] . "\r\n";
      }
      else {
        $body .= "\r\n\r\n$value\r\n";
      }
    }
    $body .= "--$boundary--\r\n";
    return $body;
  }

  /**
    * Run a request to the Replicate API.
    * Fore more information about the $formFields, refer to the build_form_body method.
    *
    * @param string $method POST, PUT, GET, DELETE...
    * @param string $url The API endpoint
    * @param array $query The query parameters (json)
    * @param array $formFields The form fields (multipart/form-data)
    * @param bool $json Whether to return the response as json or not
    * @return array
   */
  public function execute( $method, $url, $query = null, $formFields = null,
    $json = true, $extraHeaders = null, $streamCallback = null, $overrideUrl = false ) {
    $headers = "Content-Type: application/json\r\n" . "Authorization: Bearer " . $this->apiKey . "\r\n";
    $body = $query ? json_encode( $query ) : null;
    if ( !empty( $formFields ) ) {
      $boundary = wp_generate_password( 24, false );
      $headers = [
        'Content-Type' => 'multipart/form-data; boundary=' . $boundary,
        'Authorization' => 'Bearer ' . $this->apiKey
      ];
      $body = $this->build_form_body( $formFields, $boundary );
    }

    // Maybe we should have headers always as an array... not sure why we have it as a string.
    if ( !empty( $extraHeaders ) ) {
      foreach ( $extraHeaders as $key => $value ) {
        if ( is_array( $headers ) ) {
          $headers[$key] = $value;
        }
        else {
          $headers .= "$key: $value\r\n";
        }
      }
    }

    // If it's a GET, body should be null, and we should append the query to the URL.
    if ( $method === 'GET' ) {
      if ( !empty( $query ) ) {
        $url .= '?' . http_build_query( $query );
      }
      $body = null;
    }

    $url = $overrideUrl ? $url : ( 'https://api.replicate.com/v1' . $url );
    $options = [
      "headers" => $headers,
      "method" => $method,
      "timeout" => MWAI_TIMEOUT,
      "body" => $body,
      "sslverify" => false
    ];

    try {
      if ( !is_null( $streamCallback ) ) {
        $options['stream'] = true;
        $options['filename'] = tempnam( sys_get_temp_dir(), 'mwai-stream-' );
        // The stream handler calls the streamCallback every time there is content
        // TODO: For assistants, we should probably have a different stream handler to
        // handle the assistant's specific reply and perform the necessary actions.
        $this->streamCallback = $streamCallback;
        add_action( 'http_api_curl', [ $this, 'stream_handler' ], 10, 3 );
      }
      $res = wp_remote_request( $url, $options );
      if ( is_wp_error( $res ) ) {
        throw new Exception( $res->get_error_message() );
      }
      $res = wp_remote_retrieve_body( $res );
      $data = $json ? json_decode( $res, true ) : $res;
      $this->handle_response_errors( $data );
      return $data;
    }
    catch ( Exception $e ) {
      Meow_MWAI_Logging::error( 'Replicate: ' . $e->getMessage() );
      throw new Exception( $e->getMessage() );
      //throw new Exception( 'From Replicate: ' . $e->getMessage() );
    }
    finally {
      if ( !is_null( $streamCallback ) ) {
        remove_action( 'http_api_curl', [ $this, 'stream_handler' ] );
      }
      if ( !empty( $options['stream'] ) && file_exists( $options['filename'] ) ) {
        unlink( $options['filename'] );
      }
    }
  }

  public function get_models() {
    return $this->core->get_engine_models( 'replicate' );
  }

  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply )
  {
    return null;
  }

  function generate_resolutions( $widths, $heights ) {
    $resolutions = [];
    $acceptable_ratios = [
      '1:1' => [ 'name' => 'Square', 'ratio' => 1 ],
      '16:9' => [ 'name' => 'Widescreen', 'ratio' => 16/9 ],
      '2:3' => [ 'name' => 'Portrait', 'ratio' => 2/3 ],
      '3:2' => [ 'name' => 'Landscape', 'ratio' => 3/2 ],
      '4:5' => [ 'name' => 'Portrait', 'ratio' => 4/5 ],
      '5:4' => [ 'name' => 'Landscape', 'ratio' => 5/4 ],
      '9:16' => [ 'name' => 'Story', 'ratio' => 9/16 ]
    ];
  
    foreach ( $widths as $width ) {
      foreach ( $heights as $height ) {
        if ( $height <= 1024 && $width <= 1536 && $height >= 64 && $width >= 64 ) {
          $ratio = $width / $height;
          $ratio_name = null;
  
          foreach ( $acceptable_ratios as $key => $ratio_info ) {
            if ( abs( $ratio - $ratio_info['ratio'] ) < 0.01 ) {
              $ratio_name = $key;
              $ratio_label = $ratio_info['name'];
              break;
            }
          }
  
          if ( $ratio_name ) {
            $label = "{$ratio_label} ({$ratio_name}): {$width}x{$height}";
            $resolutions[] = [
              'name' => "{$width}x{$height}",
              'label' => $label
            ];
          }
        }
      }
    }
  
    // Sort resolutions by total pixel count
    usort( $resolutions, function( $a, $b ) {
      $aPixels = explode( 'x', $a['name'] );
      $bPixels = explode( 'x', $b['name'] );
      return ( $aPixels[0] * $aPixels[1] ) - ( $bPixels[0] * $bPixels[1] );
    } );
  
    return $resolutions;
  }

  public function retrieve_models() {
    return $this->retrieve_recommended_models();
  }

  public function retrieve_recommended_models() {
    $collections = [ 'flux', 'text-to-image' ];
    $allowed_owners = [ 'black-forest-labs', 'stability-ai' ];
    $rawModels = $this->_retrieve_models( $collections, $allowed_owners );
    $models = $this->_process_raw_models( $rawModels );
    return $models;
  }
  
  public function retrieve_all_models() {
    $allowed_owners = [ 'black-forest-labs', 'stability-ai' ];
    $rawModels = $this->_retrieve_models( null, $allowed_owners );
    $models = $this->_process_raw_models( $rawModels );
    return $models;
  }

  // Private method to retrieve models, optionally filtered by collections
  private function _retrieve_models( $collections = null, $allowed_owners = [] ) {
    $rawModels = [];
    if ( $collections ) {
      foreach ( $collections as $collection ) {
        $next = '/collections/' . $collection;
        $cursor = null;
        while ( $next ) {
          $query_args = $cursor ? [ 'cursor' => $cursor ] : [];
          $response = $this->execute( 'GET', $next, $query_args );
          if ( !is_array( $response ) || empty( $response['models'] ) ) {
            break;
          }
          $filtered_results = array_filter( $response['models'], function( $model ) use ( $allowed_owners ) {
            $isAllowedOwner = isset( $model['owner'] ) && in_array( $model['owner'], $allowed_owners );
            $isPublic = isset( $model['visibility'] ) && $model['visibility'] === 'public';
            return $isAllowedOwner && $isPublic;
          } );
          $rawModels = array_merge( $rawModels, $filtered_results );
          if ( empty( $response['next'] ) ) {
            break;
          }
          $parsed_url = wp_parse_url( $response['next'] );
          parse_str( $parsed_url['query'] ?? '', $query_params );
          $cursor = $query_params['cursor'] ?? '';
          $next = '/collections/' . $collection;
        }
      }
    }
    else {
      $next = '/models';
      $cursor = null;
      while ( $next ) {
        $query_args = $cursor ? [ 'cursor' => $cursor ] : [];
        $response = $this->execute( 'GET', $next, $query_args );
        if ( !is_array( $response ) || empty( $response['results'] ) ) {
          break;
        }
        $filtered_results = array_filter( $response['results'], function( $model ) use ( $allowed_owners ) {
          $isAllowedOwner = isset( $model['owner'] ) && in_array( $model['owner'], $allowed_owners );
          $isPublic = isset( $model['visibility'] ) && $model['visibility'] === 'public';
          return $isAllowedOwner && $isPublic;
        } );
        $rawModels = array_merge( $rawModels, $filtered_results );
        if ( empty( $response['next'] ) ) {
          break;
        }
        $parsed_url = wp_parse_url( $response['next'] );
        parse_str( $parsed_url['query'] ?? '', $query_params );
        $cursor = $query_params['cursor'] ?? '';
        $next = '/models';
      }
    }
    return $rawModels;
  }

  // Private method to process raw models
  private function _process_raw_models( $rawModels ) {
    $models = array();
    foreach ( $rawModels as $rawModel ) {
      $name = trim( $rawModel['name'] );
      $family = trim( $rawModel['owner'] );
      $tags = [ 'image', 'text-to-image' ];
      $model = $family . '/' . $name;
      $version = isset( $rawModel['latest_version']['id'] ) ? $rawModel['latest_version']['id'] : null;

      if ( $family === 'stability-ai' ) {
        $tags[] = 'image-to-image';
        $tags[] = 'inpainting';
      }

      $resolutions = [];

      // Black Forest Labs
      if ( $family === 'black-forest-labs' ) {
        // These work at least for Flux Pro
        $resolutions[] = [ 'name' => '1:1', 'label' => 'Square (1:1)' ];
        $resolutions[] = [ 'name' => '16:9', 'label' => 'Widescreen (16:9)' ];
        $resolutions[] = [ 'name' => '2:3', 'label' => 'Portrait (2:3)' ];
        $resolutions[] = [ 'name' => '3:2', 'label' => 'Landscape (3:2)' ];
        $resolutions[] = [ 'name' => '4:5', 'label' => 'Portrait (4:5)' ];
        $resolutions[] = [ 'name' => '5:4', 'label' => 'Landscape (5:4)' ];
        $resolutions[] = [ 'name' => '9:16', 'label' => 'Story (9:16)' ];
      }

      // Stability AI
      if ( $family === 'stability-ai' ) {
        $heights = [ 64, 128, 192, 256, 320, 384, 448, 512, 576, 640, 704, 768, 832, 896, 960, 1024, 1152, 1216, 1344, 1536 ];
        $widths = [ 64, 128, 192, 256, 320, 384, 448, 512, 576, 640, 704, 768, 832, 896, 960, 1024 ];
        $resolutions = $this->generate_resolutions( $widths, $heights );
      }

      $models[] = array(
        'model' => $model,
        'name' => $name,
        'family' => $family,
        'version' => $version,
        'features' => [ 'text-to-image' ],
        'price' => null,
        'type' => 'image',
        'resolutions' => $resolutions,
        'unit' => 1 / 1000,
        'maxCompletionTokens' => null,
        'maxContextualTokens' => null,
        'tags' => $tags
      );
    }
    return $models;
  }
}
