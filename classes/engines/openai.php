<?php

class Meow_MWAI_Engines_OpenAI
{
  private $core = null;
  private $localService = null;
  private $defaultEnvId = null;
  private $defaultEnv = null;
  private $defaultApiKey = null;

  // OpenAI Server
  private $defaultOpenAiEnvId = null;
  private $defaultOpenAiEndpoint = 'https://api.openai.com/v1';

  // Azure Server
  private $defaultAzureEnvId = null;
  private $defaultAzureEndpoint = null;
  private $defaultAzureDeployments = null;
  private $defaultAzureDeployment = null;
  private $azureApiVersion = 'api-version=2023-07-01-preview';

  // Streaming
  private $streamTemporaryBuffer = "";
  private $streamBuffer = "";
  private $streamContent = "";
  private $streamFunctionCall = null;
  private $streamCallback = null;
  private $streamedTokens = 0;

  // TODO: We should streamline the way we handle this envId.
  // Would be better to have it set only once, in the constructor here.
  // We should avoid having the set_environment being called from other functions.
  public function __construct( $core, $envId = null )
  {
    $this->core = $core;
    $this->defaultEnvId = $this->core->get_option( 'ai_default_env' );
    $this->set_environment( $this->defaultEnvId );

    // We need $defaultAzureEnvId and $defaultOpenAiEnvId to support old versions of the plugin.
    // We could use service="openai" or service="azure", and now we need to fetch the default envs for those services.
    $envs = $this->core->get_option( 'ai_envs' );
    foreach ( $envs as $env ) {
      if ( $env['type'] === 'azure' ) {
        $this->defaultAzureEnvId = $env['id'];
      }
      else if ( $env['type'] === 'openai' ) {
        $this->defaultOpenAiEnvId = $env['id'];
      }
    }

    if ( !empty( $envId ) ) {
      $this->set_environment( $envId );
    }
  }

  public function get_env_id() {
    return $this->defaultEnvId;
  }

  function set_environment( $envId = null, $service = null ) {
    $this->defaultEnv = null;
    $envs = $this->core->get_option( 'ai_envs' );
    if ( empty( $envId ) ) {
      if ( $service === 'openai' ) {
        $envId = $this->defaultOpenAiEnvId;
      }
      else if ( $service === 'azure' ) {
        $envId = $this->defaultAzureEnvId;
      }
      else {
        $envId = $this->defaultEnvId;
      }
    }
    foreach ( $envs as $env ) {
      if ( $env['id'] === $envId ) {
        $this->defaultEnv = $env;
        break;
      }
    }
    if ( empty( $this->defaultEnv ) ) {
      error_log( 'No environment found for ID: ' . $envId );
      return;
    }

    // We apply the environment to the local variables.
    // I feel it's a bit messy, but it works well with the current system.
    $env = $this->defaultEnv;
    $this->localService = $env['type'] === 'azure' ? 'azure' : 'openai';
    $this->defaultEnvId = $env['id'];
    $this->defaultApiKey = $env['apikey'];
    if ( $env['type'] === 'openai' ) {
      $this->defaultOpenAiEnvId = $env['id'];
    }
    else if ( $env['type'] === 'azure' ) {
      $this->defaultAzureEnvId = isset( $env['id'] ) ? $env['id'] : null;
      $this->defaultAzureEndpoint = isset( $env['endpoint'] ) ? $env['endpoint'] : null;
      $this->defaultAzureDeployments = isset( $env['deployments'] ) ? $env['deployments'] : null;
      $this->defaultAzureDeployments[] = [ 'model' => 'dall-e', 'name' => 'dall-e' ];
    }
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
      $this->streamBuffer .= $data;
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

  private function build_headers( $query ) {
    $headers = array(
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer ' . $this->defaultApiKey,
    );
    if ( $this->localService === 'azure' ) {
      $headers = array( 'Content-Type' => 'application/json', 'api-key' => $this->defaultApiKey );
    }
    return $headers;
  }

  private function build_options( $headers, $json = null, $forms = null ) {

    // Build body
    $body = null;
    if ( !empty( $forms ) ) {
      $boundary = wp_generate_password ( 24, false );
      $headers['Content-Type'] = 'multipart/form-data; boundary=' . $boundary;
      $body = $this->build_form_body( $forms, $boundary );
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

      // If Headers contains multipart/form-data then we don't need to decode the response
      if ( strpos( $options['headers']['Content-Type'], 'multipart/form-data' ) !== false ) {
        return [
          'stream' => false,
          'headers' => $headers,
          'data' => $response
        ];
      }

      $data = json_decode( $response, true );
      $this->handle_response_errors( $data );

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

  private function apply_query_parameters( $query ) {
    $this->set_environment( $query->envId, $query->service );

    // But if the service is set to Azure and the deployments/models are available,
    // then we will use Azure instead.
    if ( $this->localService === 'azure' && !empty( $this->defaultAzureDeployments ) ) {
      $found = false;
      foreach ( $this->defaultAzureDeployments as $deployment ) {
        if ( $deployment['model'] === $query->model && !empty( $deployment['name'] ) ) {
          $this->defaultAzureDeployment = $deployment['name'];
          $found = true;
          break;
        }
      }
      if ( !$found ) {
        $this->set_environment( $this->defaultOpenAiEnvId );
      }
    }

    if ( !empty( $query->apiKey ) ) {
      $this->defaultApiKey = $query->apiKey;
    }

    // This envId will still be used later for logging.
    $query->envId = $this->defaultEnvId;
  }

  private function get_audio( $url ) {
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

  public function run_transcribe_query( $query ) {
    $this->apply_query_parameters( $query );

    // Prepare the request.
    $modeEndpoint = $query->mode === 'translation' ? 'translations' : 'transcriptions';
    $url = 'https://api.openai.com/v1/audio/' . $modeEndpoint;

    // Check if the URL is valid.
    if ( !filter_var( $query->url, FILTER_VALIDATE_URL ) ) {
      throw new Exception( 'Invalid URL for transcription.' );
    }

    $audioData = $this->get_audio( $query->url );
    $body = array( 
      'prompt' => $query->prompt,
      'model' => $query->model,
      'response_format' => 'text',
      'file' => basename( $query->url ),
      'data' => $audioData['data']
    );
    $headers = $this->build_headers( $query );
    $options = $this->build_options( $headers, null, $body );

    // Perform the request
    try { 
      $res = $this->run_query( $url, $options );
      $data = $res['data'];
      if ( empty( $data ) ) {
        throw new Exception( 'Invalid data for transcription.' );
      }
      $this->check_for_error( $data );
      $usage = $this->core->record_audio_usage( $query->model, $audioData['length'] );
      $reply = new Meow_MWAI_Reply( $query );
      $reply->setUsage( $usage );
      $reply->setChoices( $data );
      return $reply;
    }
    catch ( Exception $e ) {
      error_log( $e->getMessage() );
      $service = $this->localService === 'azure' ? 'Azure' : 'OpenAI';
      throw new Exception( "From $service: " . $e->getMessage() );
    }
  }

  public function run_embedding_query( $query ) {
    $this->apply_query_parameters( $query );

    // Prepare the request
    $url = 'https://api.openai.com/v1/embeddings';
    $body = array( 'input' => $query->prompt, 'model' => $query->model );
    if ( $this->localService === 'azure' ) {
      $url = trailingslashit( $this->defaultAzureEndpoint ) . 'openai/deployments/' .
        $this->defaultAzureDeployment . '/embeddings?' . $this->azureApiVersion;
      $body = array( "input" => $query->prompt );
    }
    $headers = $this->build_headers( $query );
    $options = $this->build_options( $headers, $body );

    // Perform the request
    try {
      $res = $this->run_query( $url, $options );
      $data = $res['data'];
      if ( empty( $data ) || !isset( $data['data'] ) ) {
        throw new Exception( 'Invalid data for embedding.' );
      }
      $usage = $data['usage'];
      $this->core->record_tokens_usage( $query->model, $usage['prompt_tokens'] );
      $reply = new Meow_MWAI_Reply( $query );
      $reply->setUsage( $usage );
      $reply->setChoices( $data['data'] );
      return $reply;
    }
    catch ( Exception $e ) {
      error_log( $e->getMessage() );
      $service = $this->localService === 'azure' ? 'Azure' : 'OpenAI';
      throw new Exception( "From $service: " . $e->getMessage() );
    }
  }

  public function run_completion_query( $query, $streamCallback = null ) {
    $this->apply_query_parameters( $query );
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
      "n" => $query->maxResults,
      "max_tokens" => $query->maxTokens,
      "temperature" => $query->temperature,
      "stream" => !is_null( $streamCallback ),
    );

    if ( !empty( $query->stop ) ) {
      $body['stop'] = $query->stop;
    }

    if ( !empty( $query->responseFormat ) ) {
      if ( $query->responseFormat === 'json' ) {
        $body['response_format'] = [ 'type' => 'json_object' ];
      }
    }

    if ( !empty( $query->functions ) ) {
      if ( strpos( $query->model, 'ft:' ) === 0 ) {
        throw new Exception( 'OpenAI doesn\'t support Function Calling with fine-tuned models yet.' );
      }
      $body['functions'] = $query->functions;
      $body['function_call'] = $query->functionCall;
    }
    if ( $query->mode === 'chat' ) {
      $body['messages'] = $query->messages;
    }
    else if ( $query->mode === 'completion' ) {
      $body['prompt'] = $query->getPrompt();
    }
    $url = $this->localService === 'azure' ? trailingslashit( $this->defaultAzureEndpoint ) . 
      'openai/deployments/' . $this->defaultAzureDeployment : $this->defaultOpenAiEndpoint;
    if ( $query->mode === 'chat' ) {
      $url .= $this->localService === 'azure' ? '/chat/completions?' . $this->azureApiVersion : '/chat/completions';
    }
    else if ($query->mode === 'completion') {
      $url .= $this->localService === 'azure' ? '/completions?' . $this->azureApiVersion : '/completions';
    }
    $headers = $this->build_headers( $query );
    $options = $this->build_options( $headers, $body );

    try {
      $res = $this->run_query( $url, $options, $streamCallback );
      $reply = new Meow_MWAI_Reply( $query );

      // Streamed data
      $prompt_tokens = $query->getPromptTokens();
      if ( !is_null( $streamCallback ) ) {
        if ( empty( $this->streamContent ) ) {
          $json = json_decode( $this->streamBuffer, true );
          if ( isset( $json['error']['message'] ) ) {
            throw new Exception( $json['error']['message'] );
          }
          // We can't do this, otherwise the Function Calling will not work...
          //throw new Exception( 'No content received from OpenAI.' );
        }
        $data = [
          'model' => $query->model,
          'usage' => [
            'prompt_tokens' => $prompt_tokens,
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
        if ( empty( $data ) ) {
          throw new Exception( 'No content received (res is null).' );
        }
        if ( !$data['model'] ) {
          error_log( print_r( $data, 1 ) );
          throw new Exception( 'Invalid response (no model information).' );
        }
      }
      
      try {
        $usage = $this->core->record_tokens_usage( 
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
      $service = $this->localService === 'azure' ? 'Azure' : 'OpenAI';
      $message = "From $service: " . $e->getMessage();
      throw new Exception( $message );
    }
  }

  // Request to DALL-E API
  public function run_images_query( $query ) {
    $this->apply_query_parameters( $query );

    // Prepare the request
    $url = 'https://api.openai.com/v1/images/generations';
    $model = $query->model;
    $resolution = !empty( $query->resolution ) ? $query->resolution : '1024x1024';
    $body = array(
      "prompt" => $query->prompt,
      "n" => $query->maxResults,
      "size" => $resolution,
    );
    if ( $model === 'dall-e-3' ) { 
      $body['model'] = 'dall-e-3';
    }
    if ( $model === 'dall-e-3-hd' ) {
      $body['model'] = 'dall-e-3';
      $body['quality'] = 'hd';
    }
    if ( !empty( $query->style ) && strpos( $model, 'dall-e-3' ) === 0 ) {
      $body['style'] = $query->style;
    }
    if ( $this->localService === 'azure' ) {
      $url = trailingslashit( $this->defaultAzureEndpoint ) . 'dalle/text-to-image?api-version=2022-08-03-preview';
      $body = array( 
        "caption" => $query->prompt,
        //"n" => $query->maxResults,
        "resolution" => $resolution,
      );
     }
    $headers = $this->build_headers( $query );
    $options = $this->build_options( $headers, $body );

    // Perform the request
    try {
      $res = $this->run_query( $url, $options );
      $data = $res['data'];
      $choices = [];

      if ( $this->localService === 'azure' ) {
        if ( !isset( $res['headers']['operation-location'] ) || !isset( $res['headers']['retry-after'] ) ) {
          throw new Exception( 'Invalid response from Azure.' );
        }
        $operationLocation = $res['headers']['operation-location'];
        $retryAfter = (int)$res['headers']['retry-after'];
        $status = $data['status'];
        $options = $this->build_options( $headers, null );
        $options['method'] = 'GET';
        while ( $status !== 'Succeeded' ) {
          sleep( $retryAfter );
          $res = $this->run_query( $operationLocation, $options );
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
      $usage = $this->core->record_images_usage( $model, $resolution, $query->maxResults );
      $reply->setUsage( $usage );
      $reply->setChoices( $choices );
      $reply->setType( 'images' );

      // Convert the URLs into Markdown.
      $reply->result = "";
      foreach ( $reply->results as $result ) {
        $reply->result .= "![Image]($result)\n";
      }

      return $reply;
    }
    catch ( Exception $e ) {
      error_log( $e->getMessage() );
      $service = $this->localService === 'azure' ? 'Azure' : 'OpenAI';
      throw new Exception( "From $service: " . $e->getMessage() );
    }
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

  public function list_files()
  {
    return $this->run( 'GET', '/files' );
  }

  static function get_suffix_for_model($model)
  {
    // Legacy fine-tuned models
    preg_match( "/:([a-zA-Z0-9\-]{1,40})-([0-9]{4})-([0-9]{2})-([0-9]{2})/", $model, $matches);
    if ( count( $matches ) > 0 ) {
      return $matches[1];
    }

    // New fine-tuned models
    preg_match("/:([^:]+)(?=:[^:]+$)/", $model, $matches);
    if (count($matches) > 0) {
       return $matches[1];
    }

    return 'N/A';
  }

  static function get_finetune_base_model($model)
  {
    // New fine-tuned models
    preg_match("/^ft:([^:]+):/", $model, $matches);
    if (count($matches) > 0) {
      if ( preg_match( '/^gpt-3.5/', $matches[1] ) ) {
        return "gpt-3.5-turbo";
      }
      else if ( preg_match( '/^gpt-4/', $matches[1] ) ) {
        return "gpt-4";
      }
      return $matches[1];
    }

    // Legacy fine-tuned models
    preg_match('/^([a-zA-Z]{0,32}):/', $model, $matches );
    if ( count( $matches ) > 0 ) {
      return $matches[1];
    }

    return null;
  }

  public function list_deleted_finetunes( $envId = null, $legacy = false ) 
  {
    $finetunes = $this->list_finetunes( $legacy );
    $deleted = [];

    foreach ( $finetunes as $finetune ) {
      $name = $finetune['model'];
      $isSucceeded = $finetune['status'] === 'succeeded';
      if ( $isSucceeded ) {
        try {
          $finetune = $this->get_model( $name );
        }
        catch ( Exception $e ) {
          $deleted[] = $name;
        }
      }
    }
    if ( $legacy ) {
      $this->core->update_ai_env( $this->defaultOpenAiEnvId, 'legacy_finetunes_deleted', $deleted );
    }
    else {
      $this->core->update_ai_env( $this->defaultOpenAiEnvId, 'finetunes_deleted', $deleted );
    }
    return $deleted;
  }

  // public function listModels() {
  //   $res = $this->run( 'GET', '/models' );
  //   // TODO: Not used by the UI.
  //   throw new Exception( 'Not implemented yet.' );
  // }

  // TODO: This was used to retrieve the fine-tuned models, but not sure this is how we should
  // retrieve all the models since Summer 2023, let's see! WIP.
  public function list_finetunes( $legacy = false )
  {
    if ( $legacy ) {
      $res = $this->run( 'GET', '/fine-tunes' );
    }
    else {
      $res = $this->run( 'GET', '/fine_tuning/jobs' );
    }
    $finetunes = $res['data'];

    // Add suffix
    $finetunes = array_map( function ( $finetune ) {
      $finetune['suffix'] = SELF::get_suffix_for_model( $finetune['fine_tuned_model'] );
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

    if ( $legacy ) {
      $this->core->update_ai_env( $this->defaultOpenAiEnvId, 'legacy_finetunes', $finetunes );
    }
    else {
      $this->core->update_ai_env( $this->defaultOpenAiEnvId, 'finetunes', $finetunes );
    }

    return $finetunes;
  }

  public function moderate( $input ) {
    $result = $this->run('POST', '/moderations', [
      'input' => $input
    ]);
    return $result;
  }

  public function upload_file( $filename, $data )
  {
    $result = $this->run('POST', '/files', null, [
      'purpose' => 'fine-tune',
      'data' => $data,
      'file' => $filename
    ] );
    return $result;
  }

  public function delete_file( $fileId )
  {
    return $this->run('DELETE', '/files/' . $fileId);
  }

  public function get_model( $modelId )
  {
    return $this->run('GET', '/models/' . $modelId);
  }

  public function cancel_finetune( $fineTuneId )
  {
    return $this->run('POST', '/fine-tunes/' . $fineTuneId . '/cancel');
  }

  public function delete_finetune( $modelId )
  {
    return $this->run('DELETE', '/models/' . $modelId);
  }

  public function download_file( $fileId )
  {
    return $this->run('GET', '/files/' . $fileId . '/content', null, null, false);
  }

  public function run_finetune( $fileId, $model, $suffix, $hyperparams = [], $legacy = false )
  {
    $n_epochs = isset( $hyperparams['nEpochs'] ) ? (int)$hyperparams['nEpochs'] : null;
    $batch_size = isset( $hyperparams['batchSize'] ) ? (int)$hyperparams['batchSize'] : null;
    $learning_rate_multiplier = isset( $hyperparams['learningRateMultiplier'] ) ? 
      (float)$hyperparams['learningRateMultiplier'] : null;
    $prompt_loss_weight = isset( $hyperparams['promptLossWeight'] ) ? 
      (float)$hyperparams['promptLossWeight'] : null;
    $arguments = [
      'training_file' => $fileId,
      'model' => $model,
      'suffix' => $suffix
    ];
    if ( $legacy ) {
      $result = $this->run( 'POST', '/fine-tunes', $arguments );
    }
    else {
      if ( $n_epochs ) {
        $arguments['hyperparams'] = [];
        $arguments['hyperparams']['n_epochs'] = $n_epochs;
      }
      if ( $batch_size ) {
        if ( empty( $arguments['hyperparams'] ) ) {
          $arguments['hyperparams'] = [];
        }
        $arguments['hyperparams']['batch_size'] = $batch_size;
      }
      if ( $learning_rate_multiplier ) {
        if ( empty( $arguments['hyperparams'] ) ) {
          $arguments['hyperparams'] = [];
        }
        $arguments['hyperparams']['learning_rate_multiplier'] = $learning_rate_multiplier;
      }
      if ( $prompt_loss_weight ) {
        if ( empty( $arguments['hyperparams'] ) ) {
          $arguments['hyperparams'] = [];
        }
        $arguments['hyperparams']['prompt_loss_weight'] = $prompt_loss_weight;
      }
      if ( $model === 'turbo' ) {
        $arguments['model'] = 'gpt-3.5-turbo';
      }
      $result = $this->run( 'POST', '/fine_tuning/jobs', $arguments );
    }
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
    * Run a request to the OpenAI API.
    * Fore more information about the $formFields, refer to the build_form_body method.
    *
    * @param string $method POST, PUT, GET, DELETE...
    * @param string $url The API endpoint
    * @param array $query The query parameters (json)
    * @param array $formFields The form fields (multipart/form-data)
    * @param bool $json Whether to return the response as json or not
    * @return array
   */
  public function run( $method, $url, $query = null, $formFields = null, $json = true, $extraHeaders = null )
  {
    $headers = "Content-Type: application/json\r\n" . "Authorization: Bearer " . $this->defaultApiKey . "\r\n";
    $body = $query ? json_encode( $query ) : null;
    if ( !empty( $formFields ) ) {
      $boundary = wp_generate_password (24, false );
      $headers  = [
        'Content-Type' => 'multipart/form-data; boundary=' . $boundary,
        'Authorization' => 'Bearer ' . $this->defaultApiKey
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
      $this->handle_response_errors( $data );
      return $data;
    }
    catch ( Exception $e ) {
      error_log( $e->getMessage() );
      throw new Exception( 'From OpenAI: ' . $e->getMessage() );
    }
  }

  static public function get_openai_models() {
    return apply_filters( 'mwai_openai_models', MWAI_OPENAI_MODELS );
  }

  private function calculate_price( $modelFamily, $inUnits, $outUnits, $option = null, $finetune = false )
  {
    // For fine-tuned models:
    $potentialBaseModel = SELF::get_finetune_base_model( $modelFamily );
    if ( !empty( $potentialBaseModel ) ) {
      $modelFamily = $potentialBaseModel;
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

            if ( isset( $currentModel['finetune']['price'] ) ) {
              $currentModel['price'] = $currentModel['finetune']['price'];
            }
            else if ( isset( $currentModel['finetune']['in'] ) ) {
              $currentModel['price'] = [
                'in' => $currentModel['finetune']['in'],
                'out' => $currentModel['finetune']['out']
              ];
            }
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

  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply )
  {
    $model = $query->model;
    $units = 0;
    $option = null;

    $finetune = false;
    if ( is_a( $query, 'Meow_MWAI_Query_Text' ) || is_a( $query, 'Meow_MWAI_Query_Assistant' ) ) {
      if ( preg_match('/^([a-zA-Z]{0,32}):/', $model, $matches ) ) {
        $finetune = true;
      }
      $inUnits = $reply->getPromptTokens();
      $outUnits = $reply->getCompletionTokens();
      return $this->calculate_price( $model, $inUnits, $outUnits, $option, $finetune );
    }
    else if ( is_a( $query, 'Meow_MWAI_Query_Image' ) ) {
      $model = 'dall-e';
      $units = $query->maxResults;
      $option = "1024x1024";
      return $this->calculate_price( $model, 0, $units, $option, $finetune );
    }
    else if ( is_a( $query, 'Meow_MWAI_Query_Transcribe' ) ) {
      $model = 'whisper';
      $units = $reply->getUnits();
      return $this->calculate_price( $model, 0, $units, $option, $finetune );
    }
    else if ( is_a( $query, 'Meow_MWAI_Query_Embed' ) ) {
      $units = $reply->getTotalTokens();
      return $this->calculate_price( $model, 0, $units, $option, $finetune );
    }
    error_log("AI Engine: Cannot calculate price for $model.");
    return null;
  }

  public function get_incidents() {
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
