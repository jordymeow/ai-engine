<?php

class Meow_MWAI_Engines_Core {
  private $core = null;
  private $openai = null;
  private $localApiKey = null;
  private $localService = null;
  private $localAzureEndpoint = null;
  private $localAzureApiKey = null;
  private $localAzureDeployments = null;
  private $openaiEndpoint = 'https://api.openai.com/v1';
  private $azureApiVersion = '?api-version=2023-03-15-preview';

  public function __construct( $core ) {
    $this->core = $core;
    $this->openai = new Meow_MWAI_Engines_OpenAI( $this->core );
    $this->localService = $this->core->get_option( 'openai_service' );
    $this->localApiKey = $this->core->get_option( 'openai_apikey' );
    $this->localAzureEndpoint = $this->core->get_option( 'openai_azure_endpoint' );
    $this->localAzureApiKey = $this->core->get_option( 'openai_azure_apikey' );
    $this->localAzureDeployments = $this->core->get_option( 'openai_azure_deployments' );
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
      $body = $this->openai->buildFormBody( $forms, $boundary );
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

  private function runQuery( $url, $options ) {
    try {
      $response = wp_remote_get( $url, $options );
      if ( is_wp_error( $response ) ) {
        throw new Exception( $response->get_error_message() );
      }
      $response = wp_remote_retrieve_body( $response );

      // If Headers contains multipart/form-data then we don't need to decode the response
      if ( strpos( $options['headers']['Content-Type'], 'multipart/form-data' ) !== false ) {
        return $response;
      }

      $data = json_decode( $response, true );
      $this->openai->handleResponseErrors( $data );
      return $data;
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
        if ( $deployment['model'] === $query->model ) {
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

  private function runTranscribeQuery( $query ) {
    $this->applyQueryParameters( $query );

    // Prepare the request
    $modeEndpoint = $query->mode === 'translation' ? 'translations' : 'transcriptions';
    $url = 'https://api.openai.com/v1/audio/' . $modeEndpoint;
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
      $data = $this->runQuery( $url, $options );
      if ( empty( $data ) ) {
        throw new Exception( 'Invalid data for transcription.' );
      }
      $usage = $this->core->recordAudioUsage( $query->model, $audioData['length'] );
      $reply = new Meow_MWAI_Reply( $query );
      $reply->setUsage( $usage );
      $reply->setChoices( $data );
      return $reply;
    }
    catch ( Exception $e ) {
      error_log( $e->getMessage() );
      throw new Exception( 'Error while calling OpenAI: ' . $e->getMessage() );
    }
  }

  private function runEmbeddingQuery( $query ) {
    $this->applyQueryParameters( $query );

    // Prepare the request
    $url = 'https://api.openai.com/v1/embeddings';
    $body = array( 'input' => $query->prompt, 'model' => $query->model );
    if ( $query->service === 'azure' ) {
      $url = trailingslashit( $query->azureEndpoint ) . 'openai/deployments/' .
        $query->azureDeployment . '/embeddings?api-version=2023-03-15-preview';
      $body = array( "input" => $query->prompt );
    }
    $headers = $this->buildHeaders( $query );
    $options = $this->buildOptions( $headers, $body );

    // Perform the request
    try {
      $data = $this->runQuery( $url, $options );
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
      throw new Exception( 'Error while calling OpenAI: ' . $e->getMessage() );
    }
  }

  private function runCompletionQuery( $query ) {
    $this->applyQueryParameters( $query );
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
    );
    if ( $query->mode === 'chat' ) {
      $body['messages'] = $query->messages;
    }
    else if ( $query->mode === 'completion' ) {
      $body['prompt'] = $query->getPrompt();
    }
    $url = $query->service === 'azure' ? trailingslashit( $query->azureEndpoint ) . 
      'openai/deployments/' . $query->azureDeployment : $this->openaiEndpoint;
    if ( $query->mode === 'chat' ) {
      $url .= $query->service === 'azure' ? '/chat/completions' . $this->azureApiVersion : '/chat/completions';
    }
    else if ($query->mode === 'completion') {
      $url .= $query->service === 'azure' ? '/completions' . $this->azureApiVersion : '/completions';
    }
    $headers = $this->buildHeaders( $query );
    $options = $this->buildOptions( $headers, $body );

    try {
      $data = $this->runQuery( $url, $options );
      if ( !$data['model'] ) {
        error_log( print_r( $data, 1 ) );
        throw new Exception( "Got an unexpected response from OpenAI. Check your PHP Error Logs." );
      }
      $reply = new Meow_MWAI_Reply( $query );
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
      throw new Exception( 'Error while calling OpenAI: ' . $e->getMessage() );
    }
  }

  // Request to DALL-E API
  private function runImagesQuery( $query ) {
    $this->applyQueryParameters( $query );

    // Prepare the request
    $url = 'https://api.openai.com/v1/images/generations';
    $body = array(
      "prompt" => $query->prompt,
      "n" => $query->maxResults,
      "size" => '1024x1024',
    );
    $headers = $this->buildHeaders( $query );
    $options = $this->buildOptions( $headers, $body );

    // Perform the request
    try {
      $data = $this->runQuery( $url, $options );
      $reply = new Meow_MWAI_Reply( $query );
      $usage = $this->core->recordImagesUsage( "dall-e", "1024x1024", $query->maxResults );
      $reply->setUsage( $usage );
      $reply->setChoices( $data['data'] );
      $reply->setType( 'images' );
      return $reply;
    }
    catch ( Exception $e ) {
      error_log( $e->getMessage() );
      throw new Exception( 'Error while calling OpenAI: ' . $e->getMessage() );
    }
  }

  public function throwException( $message ) {
    $message = apply_filters( 'mwai_ai_exception', $message );
    throw new Exception( $message );
  }

  public function run( $query ) {
    // Check if the query is allowed
    $limits = $this->core->get_option( 'limits' );
    $ok = apply_filters( 'mwai_ai_allowed', true, $query, $limits );
    if ( $ok !== true ) {
      $message = is_string( $ok ) ? $ok : 'Unauthorized query.';
      $this->throwException( $message );
    }

    // Allow to modify the query
    $query = apply_filters( 'mwai_ai_query', $query );
    $query->finalChecks();

    // Run the query
    $reply = null;
    try {
      if ( $query instanceof Meow_MWAI_QueryText ) {
        $reply = $this->runCompletionQuery( $query );
      }
      else if ( $query instanceof Meow_MWAI_QueryEmbed ) {
        $reply = $this->runEmbeddingQuery( $query );
      }
      else if ( $query instanceof Meow_MWAI_QueryImage ) {
        $reply = $this->runImagesQuery( $query );
      }
      else if ( $query instanceof Meow_MWAI_QueryTranscribe ) {
        $reply = $this->runTranscribeQuery( $query );
      }
      else {
        $this->throwException( 'Invalid query.' );
      }
    }
    catch ( Exception $e ) {
      $this->throwException( $e->getMessage() );
    }

    // Let's allow some modififications of the reply
    $reply = apply_filters( 'mwai_ai_reply', $reply, $query );
    return $reply;
  }
}
