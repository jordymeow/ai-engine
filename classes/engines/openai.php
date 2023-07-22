<?php

class Meow_MWAI_Engines_OpenAI
{
  private $core = null;
  private $localApiKey = null;
  private $localService = null;

  // OpenAI Server
  private $openaiEndpoint = 'https://api.openai.com/v1';

  // Azure Server
  private $localAzureEndpoint = null;
  private $localAzureApiKey = null;
  private $localAzureDeployments = null;
  private $azureApiVersion = 'api-version=2023-03-15-preview';

  // Streaming
  private $streamTemporaryBuffer = "";
  private $streamContent = "";
  private $streamFunctionCall = null;
  private $streamParameter = "";
  private $streamCallback = null;
  private $streamedTokens = 0;

  public function __construct( $core )
  {
    $this->core = $core;
    $this->localService = $this->core->get_option( 'openai_service' );
    $this->localApiKey = $this->core->get_option( 'openai_apikey' );
    $this->localAzureEndpoint = $this->core->get_option( 'openai_azure_endpoint' );
    $this->localAzureApiKey = $this->core->get_option( 'openai_azure_apikey' );
    $this->localAzureDeployments = $this->core->get_option( 'openai_azure_deployments' );
    $this->localAzureDeployments[] = [ 'model' => 'dall-e', 'name' => 'dall-e' ];
  }


  // Check for a JSON-formatted error in the data, and throw an exception if it's the case.
  function check_for_error( $data ) {
    if ( strpos( $data, '"error"' ) !== false ) {
      $json = json_decode( $data, true );
      if ( json_last_error() === JSON_ERROR_NONE ) {
        $error = $json['error'];
        $code = $error['code'];
        $message = $error['message'];
        throw new Exception( "Error $code: $message" );
      }
    }
  }

  /*
    This used to be in the core.php, but since it's relative to OpenAI, it's better to have it here.
  */

  public function stream_handler( $handle, $args, $url ) {
    curl_setopt( $handle, CURLOPT_SSL_VERIFYPEER, false );
    curl_setopt( $handle, CURLOPT_SSL_VERIFYHOST, false );

    // Maybe we could get some info from headers, as for now, there is only the model.
    // curl_setopt( $handle, CURLOPT_HEADERFUNCTION, function( $curl, $headerLine ) {
    //   $line = trim( $headerLine );
    //   return strlen( $headerLine );
    // });

    curl_setopt( $handle, CURLOPT_WRITEFUNCTION, function ( $curl, $data ) {
      $length = strlen( $data );

      // FOR DEBUG:
      // preg_match_all( '/"content":"(.*?)"/', $data, $matches );
      // $contents = $matches[1];
      // foreach ( $contents as $content ) {
      //   error_log( "Content: $content" );
      // }

      // Error Management
      $this->check_for_error( $data );

      // Bufferize the unfinished stream (if it's the case)
      $this->streamTemporaryBuffer .= $data;
      $lines = explode( "\n", $this->streamTemporaryBuffer );
      if ( substr( $this->streamTemporaryBuffer, -1 ) !== "\n" ) {
        $this->streamTemporaryBuffer = array_pop( $lines );
      }
      else {
        $this->streamTemporaryBuffer = "";
      }

      foreach ( $lines as $line ) {
        if ( $line === "" ) {
          continue;
        }
        if ( strpos($line, 'data: ' ) === 0 ) {
          $line = substr( $line, 6 );
          $json = json_decode( $line, true );

          if ( json_last_error() === JSON_ERROR_NONE ) {
            $content = null;
            if ( isset( $json['choices'][0]['text'] ) ) {
              $content = $json['choices'][0]['text'];
            }
            else if ( isset( $json['choices'][0]['delta']['content'] ) ) {
              $content = $json['choices'][0]['delta']['content'];
            }
            else if ( isset( $json['choices'][0]['delta']['function_call'] ) ) {
              $function_call = $json['choices'][0]['delta']['function_call'];
              if ( empty( $this->streamFunctionCall ) ) {
                $this->streamFunctionCall = [ 'name' => "", 'arguments' => "" ];
              }
              if ( isset( $function_call['name'] ) ) {
                $this->streamFunctionCall['name'] .= $function_call['name'];
              }
              if ( isset( $function_call['arguments'] ) ) {
                $this->streamFunctionCall['arguments'] .= $function_call['arguments'];
              }
            }
            if ( $content !== null && $content !== "" ) {
              $this->streamedTokens += count( explode( " ", $content ) );
              $this->streamContent .= $content;
              call_user_func( $this->streamCallback, $content );
            }
          }
          else {
            $this->streamTemporaryBuffer .= $line . "\n";
          }
        }
      }
      return $length;
    });
  }

  private function buildHeaders( $query ) {
    $headers = array(
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer ' . $query->apiKey,
    );
    if ( $query->service === 'azure' ) {
      $headers = array( 'Content-Type' => 'application/json', 'api-key' => $query->azureApiKey );
    }
    return $headers;
  }

  private function buildOptions( $headers, $json = null, $forms = null ) {

    // Build body
    $body = null;
    if ( !empty( $forms ) ) {
      $boundary = wp_generate_password ( 24, false );
      $headers['Content-Type'] = 'multipart/form-data; boundary=' . $boundary;
      $body = $this->buildFormBody( $forms, $boundary );
    }
    else if ( !empty( $json ) ) {
      $body = json_encode( $json );
    }

    // Build options
    $options = array(
      'headers' => $headers,
      'method' => 'POST',
      'timeout' => MWAI_TIMEOUT,
      'body' => $body,
      'sslverify' => false
    );

    return $options;
  }

  public function runQuery( $url, $options, $isStream = false ) {
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

      // If Headers contains multipart/form-data then we don't need to decode the response
      if ( strpos( $options['headers']['Content-Type'], 'multipart/form-data' ) !== false ) {
        return [
          'stream' => false,
          'headers' => $headers,
          'data' => $response
        ];
      }

      $data = json_decode( $response, true );
      $this->handleResponseErrors( $data );

      return [
        'headers' => $headers,
        'data' => $data
      ];
    }
    catch ( Exception $e ) {
      error_log( $e->getMessage() );
      throw $e;
    }
  }

  private function applyQueryParameters( $query ) {
    if ( empty( $query->service ) ) {
      $query->service = $this->localService;
    }

    // OpenAI will be used by default for everything
    if ( empty( $query->apiKey ) ) {
      $query->apiKey = $this->localApiKey;
    }

    // But if the service is set to Azure and the deployments/models are available,
    // then we will use Azure instead.
    if ( $query->service === 'azure' && !empty( $this->localAzureDeployments ) ) {
      $found = false;
      foreach ( $this->localAzureDeployments as $deployment ) {
        if ( $deployment['model'] === $query->model && !empty( $deployment['name'] ) ) {
          $query->azureDeployment = $deployment['name'];
          if ( empty( $query->azureEndpoint ) ) {
            $query->azureEndpoint = $this->localAzureEndpoint;
          }
          if ( empty( $query->azureApiKey ) ) {
            $query->azureApiKey = $this->localAzureApiKey;
          }
          $found = true;
          break;
        }
      }
      if ( !$found ) {
        error_log( 'Azure deployment not found for model: ' . $query->model );
        $query->service = 'openai';
      }
    }
  }

  private function getAudio( $url ) {
    require_once( ABSPATH . 'wp-admin/includes/media.php' );
    $tmpFile = tempnam( sys_get_temp_dir(), 'audio_' );
    file_put_contents( $tmpFile, file_get_contents( $url ) );
    $length = null;
    $metadata = wp_read_audio_metadata( $tmpFile );
    if ( isset( $metadata['length'] ) ) {
      $length = $metadata['length'];
    }
    $data = file_get_contents( $tmpFile );
    unlink( $tmpFile );
    return [ 'data' => $data, 'length' => $length ];
  }

  public function runTranscribeQuery( $query ) {
    $this->applyQueryParameters( $query );

    // Prepare the request.
    $modeEndpoint = $query->mode === 'translation' ? 'translations' : 'transcriptions';
    $url = 'https://api.openai.com/v1/audio/' . $modeEndpoint;

    // Check if the URL is valid.
    if ( !filter_var( $query->url, FILTER_VALIDATE_URL ) ) {
      throw new Exception( 'Invalid URL for transcription.' );
    }

    $audioData = $this->getAudio( $query->url );
    $body = array( 
      'prompt' => $query->prompt,
      'model' => $query->model,
      'response_format' => 'text',
      'file' => basename( $query->url ),
      'data' => $audioData['data']
    );
    $headers = $this->buildHeaders( $query );
    $options = $this->buildOptions( $headers, null, $body );

    // Perform the request
    try { 
      $res = $this->runQuery( $url, $options );
      $data = $res['data'];
      if ( empty( $data ) ) {
        throw new Exception( 'Invalid data for transcription.' );
      }
      $this->check_for_error( $data );
      $usage = $this->core->recordAudioUsage( $query->model, $audioData['length'] );
      $reply = new Meow_MWAI_Reply( $query );
      $reply->setUsage( $usage );
      $reply->setChoices( $data );
      return $reply;
    }
    catch ( Exception $e ) {
      error_log( $e->getMessage() );
      throw new Exception( $e->getMessage() . " (OpenAI)" );
    }
  }

  public function runEmbeddingQuery( $query ) {
    $this->applyQueryParameters( $query );

    // Prepare the request
    $url = 'https://api.openai.com/v1/embeddings';
    $body = array( 'input' => $query->prompt, 'model' => $query->model );
    if ( $query->service === 'azure' ) {
      $url = trailingslashit( $query->azureEndpoint ) . 'openai/deployments/' .
        $query->azureDeployment . '/embeddings?' . $this->azureApiVersion;
      $body = array( "input" => $query->prompt );
    }
    $headers = $this->buildHeaders( $query );
    $options = $this->buildOptions( $headers, $body );

    // Perform the request
    try {
      $res = $this->runQuery( $url, $options );
      $data = $res['data'];
      if ( empty( $data ) || !isset( $data['data'] ) ) {
        throw new Exception( 'Invalid data for embedding.' );
      }
      $usage = $data['usage'];
      $this->core->recordTokensUsage( $query->model, $usage['prompt_tokens'] );
      $reply = new Meow_MWAI_Reply( $query );
      $reply->setUsage( $usage );
      $reply->setChoices( $data['data'] );
      return $reply;
    }
    catch ( Exception $e ) {
      error_log( $e->getMessage() );
      $service = $query->service === 'azure' ? 'Azure' : 'OpenAI';
      throw new Exception( $e->getMessage() . " ($service)" );
    }
  }

  public function runCompletionQuery( $query, $streamCallback = null ) {
    $this->applyQueryParameters( $query );
    if ( !is_null( $streamCallback ) ) {
      $this->streamCallback = $streamCallback;
      add_action( 'http_api_curl', array( $this, 'stream_handler' ), 10, 3 );
    }
    if ( $query->mode !== 'chat' && $query->mode !== 'completion' ) {
      throw new Exception( 'Unknown mode for query: ' . $query->mode );
    }

    // Prepare the request
    $body = array(
      "model" => $query->model,
      "stop" => $query->stop,
      "n" => $query->maxResults,
      "max_tokens" => $query->maxTokens,
      "temperature" => $query->temperature,
      "stream" => !is_null( $streamCallback ),
    );
    if ( !empty( $query->functions ) ) {
      $body['functions'] = $query->functions;
      $body['function_call'] = $query->functionCall;
    }
    if ( $query->mode === 'chat' ) {
      $body['messages'] = $query->messages;
    }
    else if ( $query->mode === 'completion' ) {
      $body['prompt'] = $query->getPrompt();
    }
    $url = $query->service === 'azure' ? trailingslashit( $query->azureEndpoint ) . 
      'openai/deployments/' . $query->azureDeployment : $this->openaiEndpoint;
    if ( $query->mode === 'chat' ) {
      $url .= $query->service === 'azure' ? '/chat/completions?' . $this->azureApiVersion : '/chat/completions';
    }
    else if ($query->mode === 'completion') {
      $url .= $query->service === 'azure' ? '/completions?' . $this->azureApiVersion : '/completions';
    }
    $headers = $this->buildHeaders( $query );
    $options = $this->buildOptions( $headers, $body );

    try {
      $res = $this->runQuery( $url, $options, $streamCallback );
      $reply = new Meow_MWAI_Reply( $query );

      // Streamed data
      if ( !is_null( $streamCallback ) ) {
        $data = [
          'model' => $query->model,
          'usage' => [
            'prompt_tokens' => $query->getPromptTokens(),
            'completion_tokens' => $this->streamedTokens
          ],
          'choices' => [
            [ 
              'message' => [ 
                'content' => $this->streamContent,
                'function_call' => $this->streamFunctionCall
              ]
            ]
          ],
        ];
      }
      // Regular data
      else {
        $data = $res['data'];
        if ( !$data['model'] ) {
          error_log( print_r( $data, 1 ) );
          throw new Exception( "Got an unexpected response from OpenAI. Check your PHP Error Logs." );
        }
      }
      
      try {
        $usage = $this->core->recordTokensUsage( 
          $data['model'], 
          $data['usage']['prompt_tokens'],
          $data['usage']['completion_tokens']
        );
      }
      catch ( Exception $e ) {
        error_log( $e->getMessage() );
      }
      $reply->setUsage( $usage );
      $reply->setChoices( $data['choices'] );
      return $reply;
    }
    catch ( Exception $e ) {
      error_log( $e->getMessage() );
      $service = $query->service === 'azure' ? 'Azure' : 'OpenAI';
      throw new Exception( $e->getMessage() . " ($service)" );
    }
  }

  // Request to DALL-E API
  public function runImagesQuery( $query ) {
    $this->applyQueryParameters( $query );

    // Prepare the request
    $url = 'https://api.openai.com/v1/images/generations';
    $body = array(
      "prompt" => $query->prompt,
      "n" => $query->maxResults,
      "size" => '1024x1024',
    );
    if ( $query->service === 'azure' ) {
      //$url = trailingslashit( $query->azureEndpoint ) . 'dalle/text-to-image?' . $this->azureApiVersion;
      $url = trailingslashit( $query->azureEndpoint ) . 'dalle/text-to-image?api-version=2022-08-03-preview';
      $body = array( 
        "caption" => $query->prompt,
        //"n" => $query->maxResults,
        "resolution" => '1024x1024',
      );
     }
    $headers = $this->buildHeaders( $query );
    $options = $this->buildOptions( $headers, $body );

    // Perform the request
    try {
      $res = $this->runQuery( $url, $options );
      $data = $res['data'];
      $choices = [];

      if ( $query->service === 'azure' ) {
        if ( !isset( $res['headers']['operation-location'] ) || !isset( $res['headers']['retry-after'] ) ) {
          throw new Exception( 'Invalid response from Azure.' );
        }
        $operationLocation = $res['headers']['operation-location'];
        $retryAfter = (int)$res['headers']['retry-after'];
        $status = $data['status'];
        $options = $this->buildOptions( $headers, null );
        $options['method'] = 'GET';
        while ( $status !== 'Succeeded' ) {
          sleep( $retryAfter );
          $res = $this->runQuery( $operationLocation, $options );
          $data = $res['data'];
          $status = $data['status'];
        }
        $result = $data['result'];
        $contentUrl = $result['contentUrl'];
        $choices = [ [ 'url' => $contentUrl ] ];

      }
      else {
        // OpenAI returns an array of URLs
        $choices = $data['data'];
      }

      $reply = new Meow_MWAI_Reply( $query );
      $usage = $this->core->recordImagesUsage( "dall-e", "1024x1024", $query->maxResults );
      $reply->setUsage( $usage );
      $reply->setChoices( $choices );
      $reply->setType( 'images' );
      return $reply;
    }
    catch ( Exception $e ) {
      error_log( $e->getMessage() );
      throw new Exception( $e->getMessage() . " (OpenAI)" );
    }
  }


  /*
    This is the rest of the OpenAI API support, not related to the models directly.
  */

  // Check if there are errors in the response from OpenAI, and throw an exception if so.
  public function handleResponseErrors( $data ) {
    if ( isset( $data['error'] ) ) {
      $message = $data['error']['message'];
      if ( preg_match( '/API key provided(: .*)\./', $message, $matches ) ) {
        $message = str_replace( $matches[1], '', $message );
      }
      throw new Exception( $message );
    }
  }

  public function listFiles()
  {
    return $this->run( 'GET', '/files' );
  }

  function getSuffixForModel($model)
  {
    preg_match("/:([a-zA-Z0-9\-]{1,40})-([0-9]{4})-([0-9]{2})-([0-9]{2})/", $model, $matches);
    if ( count( $matches ) > 0 ) {
      return $matches[1];
    }
    return 'N/A';
  }

  function getBaseModel($model)
  {
    preg_match("/:([a-zA-Z0-9\-]{1,40})-([0-9]{4})-([0-9]{2})-([0-9]{2})/", $model, $matches);
    if (count($matches) > 0) {
      return $matches[1];
    }
    return 'N/A';
  }

  public function listDeletedFineTunes()
  {
    $finetunes = $this->listFineTunes();
    $deleted = [];

    foreach ( $finetunes as $finetune ) {
      $name = $finetune['model'];
      $isSucceeded = $finetune['status'] === 'succeeded';
      if ( $isSucceeded ) {
        try {
          $finetune = $this->getModel( $name );
        }
        catch ( Exception $e ) {
          $deleted[] = $name;
        }
      }
    }

    $this->core->update_option( 'openai_finetunes_deleted', $deleted );
    return $deleted;
  }

  public function listFineTunes()
  {
    $res = $this->run( 'GET', '/fine-tunes' );
    $finetunes = $res['data'];

    // Add suffix
    $finetunes = array_map( function ( $finetune ) {
      $finetune['suffix'] = $this->getSuffixForModel( $finetune['fine_tuned_model'] );
      $finetune['createdOn'] = date( 'Y-m-d H:i:s', $finetune['created_at'] );
      $finetune['updatedOn'] = date( 'Y-m-d H:i:s', $finetune['updated_at'] );
      $finetune['base_model'] = $finetune['model'];
      $finetune['model'] = $finetune['fine_tuned_model'];
      unset( $finetune['object'] );
      unset( $finetune['hyperparams'] );
      unset( $finetune['result_files'] );
      unset( $finetune['training_files'] );
      unset( $finetune['validation_files'] );
      unset( $finetune['created_at'] );
      unset( $finetune['updated_at'] );
      unset( $finetune['fine_tuned_model'] );
      return $finetune;
    }, $finetunes);

    usort( $finetunes, function ( $a, $b ) {
      return strtotime( $b['createdOn'] ) - strtotime( $a['createdOn'] );
    });

    $this->core->update_option( 'openai_finetunes', $finetunes );
    return $finetunes;
  }

  public function moderate( $input ) {
    $result = $this->run('POST', '/moderations', [
      'input' => $input
    ]);
    return $result;
  }

  public function uploadFile( $filename, $data )
  {
    $result = $this->run('POST', '/files', null, [
      'purpose' => 'fine-tune',
      'data' => $data,
      'file' => $filename
    ] );
    return $result;
  }

  public function deleteFile( $fileId )
  {
    return $this->run('DELETE', '/files/' . $fileId);
  }

  public function getModel( $modelId )
  {
    return $this->run('GET', '/models/' . $modelId);
  }

  public function cancelFineTune( $fineTuneId )
  {
    return $this->run('POST', '/fine-tunes/' . $fineTuneId . '/cancel');
  }

  public function deleteFineTune( $modelId )
  {
    return $this->run('DELETE', '/models/' . $modelId);
  }

  public function downloadFile( $fileId )
  {
    return $this->run('GET', '/files/' . $fileId . '/content', null, null, false);
  }

  public function fineTuneFile( $fileId, $model, $suffix, $hyperparams = [] )
  {
    $n_epochs = isset( $hyperparams['nEpochs'] ) ? (int)$hyperparams['nEpochs'] : 4;
    $batch_size = isset( $hyperparams['batchSize'] ) ? (int)$hyperparams['batchSize'] : null;
    $arguments = [
      'training_file' => $fileId,
      'model' => $model,
      'suffix' => $suffix,
      'n_epochs' => $n_epochs
    ];
    if ( $batch_size ) {
      $arguments['batch_size'] = $batch_size;
    }
    $result = $this->run('POST', '/fine-tunes', $arguments);
    return $result;
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
  public function buildFormBody( $fields, $boundary )
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
    * Run a request to the OpenAI API.
    * Fore more information about the $formFields, refer to the buildFormBody method.
    *
    * @param string $method POST, PUT, GET, DELETE...
    * @param string $url The API endpoint
    * @param array $query The query parameters (json)
    * @param array $formFields The form fields (multipart/form-data)
    * @param bool $json Whether to return the response as json or not
    * @return array
   */
  public function run( $method, $url, $query = null, $formFields = null, $json = true )
  {
    $apiKey = $this->localApiKey;
    $headers = "Content-Type: application/json\r\n" . "Authorization: Bearer " . $apiKey . "\r\n";
    $body = $query ? json_encode( $query ) : null;
    if ( !empty( $formFields ) ) {
      $boundary = wp_generate_password (24, false );
      $headers  = [
        'Content-Type' => 'multipart/form-data; boundary=' . $boundary,
        'Authorization' => 'Bearer ' . $this->localApiKey,
      ];
      $body = $this->buildFormBody( $formFields, $boundary );
    }

    $url = 'https://api.openai.com/v1' . $url;
    $options = [
      "headers" => $headers,
      "method" => $method,
      "timeout" => MWAI_TIMEOUT,
      "body" => $body,
      "sslverify" => false
    ];

    try {
      $response = wp_remote_request( $url, $options );
      if ( is_wp_error( $response ) ) {
        throw new Exception( $response->get_error_message() );
      }
      $response = wp_remote_retrieve_body( $response );
      $data = $json ? json_decode( $response, true ) : $response;
      $this->handleResponseErrors( $data );
      return $data;
    }
    catch ( Exception $e ) {
      error_log( $e->getMessage() );
      throw new Exception( $e->getMessage() . " (OpenAI)" );
    }
  }

  static public function get_openai_models() {
    return apply_filters( 'mwai_openai_models', MWAI_OPENAI_MODELS );
  }

  private function calculatePrice( $modelFamily, $inUnits, $outUnits, $option = null, $finetune = false )
  {
    // Finetuned models => We need to modify the model to the family of the model.
    if ( $finetune && preg_match('/^([a-zA-Z]{0,32}):/', $modelFamily, $matches ) ) {
      $modelFamily = $matches[1];
      $finetune = true;
    }

    $openai_models = Meow_MWAI_Engines_OpenAI::get_openai_models();
    foreach ( $openai_models as $currentModel ) {
      if ( $currentModel['model'] === $modelFamily || ( $finetune && $currentModel['family'] === $modelFamily ) ) {
        if ( $currentModel['type'] === 'image' ) {
          if ( !$option ) {
            error_log( "AI Engine: Image models require an option." );
            return null;
          }
          else {
            foreach ( $currentModel['options'] as $imageType ) {
              if ( $imageType['option'] == $option ) {
                return $imageType['price'] * $outUnits;
              }
            }
          }
        }
        else {
          if ( $finetune ) {
            $currentModel['price'] = $currentModel['finetune']['price'];
          }
          $inPrice = $currentModel['price'];
          $outPrice = $currentModel['price'];
          if ( is_array( $currentModel['price'] ) ) {
            $inPrice = $currentModel['price']['in'];
            $outPrice = $currentModel['price']['out'];
          }
          $inTotalPrice = $inPrice * $currentModel['unit'] * $inUnits;
          $outTotalPrice = $outPrice * $currentModel['unit'] * $outUnits;
          return $inTotalPrice + $outTotalPrice;
        }
      }
    }
    error_log( "AI Engine: Invalid model ($modelFamily)." );
    return null;
  }

  public function getPrice( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply )
  {
    $model = $query->model;
    $units = 0;
    $option = null;

    $finetune = false;
    if ( is_a( $query, 'Meow_MWAI_Query_Text' ) ) {
      if ( preg_match('/^([a-zA-Z]{0,32}):/', $model, $matches ) ) {
        $finetune = true;
      }
      $inUnits = $reply->getPromptTokens();
      $outUnits = $reply->getCompletionTokens();
      return $this->calculatePrice( $model, $inUnits, $outUnits, $option, $finetune );
    }
    else if ( is_a( $query, 'Meow_MWAI_Query_Image' ) ) {
      $model = 'dall-e';
      $units = $query->maxResults;
      $option = "1024x1024";
      return $this->calculatePrice( $model, 0, $units, $option, $finetune );
    }
    else if ( is_a( $query, 'Meow_MWAI_Query_Transcribe' ) ) {
      $model = 'whisper';
      $units = $reply->getUnits();
      return $this->calculatePrice( $model, 0, $units, $option, $finetune );
    }
    else if ( is_a( $query, 'Meow_MWAI_Query_Embed' ) ) {
      $units = $reply->getTotalTokens();
      return $this->calculatePrice( $model, 0, $units, $option, $finetune );
    }
    error_log("AI Engine: Cannot calculate price for $model.");
    return null;
  }

  public function getIncidents() {
    $url = 'https://status.openai.com/history.rss';
    $response = wp_remote_get( $url );
    if ( is_wp_error( $response ) ) {
      throw new Exception( $response->get_error_message() );
    }
    $response = wp_remote_retrieve_body( $response );
    $xml = simplexml_load_string( $response );
    $incidents = array();
    $oneWeekAgo = time() - 5 * 24 * 60 * 60;
    foreach ( $xml->channel->item as $item ) {
      $date = strtotime( $item->pubDate );
      if ( $date > $oneWeekAgo ) {
        $incidents[] = array(
          'title' => (string) $item->title,
          'description' => (string) $item->description,
          'date' => $date
        );
      }
    }
    return $incidents;
  }
}
