<?php

class Meow_MWAI_AI {
  private $core = null;
  private $localApiKey = null;
  private $localService = null;
  private $localAzureEndpoint = null;
  private $localAzureApiKey = null;
  private $localAzureDeployments = null;

  public function __construct( $core ) {
    $this->core = $core;
    $this->localService = $this->core->get_option( 'openai_service' );
    $this->localApiKey = $this->core->get_option( 'openai_apikey' );
    $this->localAzureEndpoint = $this->core->get_option( 'openai_azure_endpoint' );
    $this->localAzureApiKey = $this->core->get_option( 'openai_azure_apikey' );
    $this->localAzureDeployments = $this->core->get_option( 'openai_azure_deployments' );
  }

  private function runQuery( $url, $options ) {
    try {
      $response = wp_remote_get( $url, $options );
      if ( is_wp_error( $response ) ) {
        throw new Exception( $response->get_error_message() );
      }
      $response = wp_remote_retrieve_body( $response );
      $data = json_decode( $response, true );

      if ( isset( $data['error'] ) ) {
        $message = $data['error']['message'];
        if ( preg_match( '/API key provided(: .*)\./', $message, $matches ) ) {
          $message = str_replace( $matches[1], '', $message );
        }
        throw new Exception( $message );
      }

      return $data;
    }
    catch ( Exception $e ) {
      error_log( $e->getMessage() );
      throw new Exception( 'Error while calling OpenAI: ' . $e->getMessage() );
    }
  }

  public function applyQueryParameters( $query ) {
    // OpenAI will be used by default for everything
    // But if the service is set to Azure and the deployments/models are available,
    // then we will use Azure instead.
    if ( empty( $query->service ) ) {
      $query->service = $this->localService;
    }

    // OpenAI
    if ( empty( $query->apiKey ) ) {
      $query->apiKey = $this->localApiKey;
    }

    // Azure
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

  public function runTranscribe( $query ) {
    $this->applyQueryParameters( $query );
    $openai = new Meow_MWAI_OpenAI( $this->core );
    $fields = array( 
      'prompt' => $query->prompt,
      'model' => $query->model,
      'response_format' => 'text',
      'file' => basename( $query->url ),
      'data' => file_get_contents( $query->url )
    );
    $modeEndpoint = $query->mode === 'translation' ? 'translations' : 'transcriptions';
    $data = $openai->run( 'POST', '/audio/' . $modeEndpoint, null, $fields, false );
    if ( empty( $data ) ) {
      throw new Exception( 'Invalid data for transcription.' );
    }
    //$usage = $data['usage'];
    //$this->core->record_tokens_usage( $query->model, $usage['prompt_tokens'] );
    $answer = new Meow_MWAI_Answer( $query );
    //$answer->setUsage( $usage );
    $answer->setChoices( $data );
    return $answer;
  }

  public function runEmbedding( $query ) {
    $this->applyQueryParameters( $query );

    // NOTE: Let's follow closely the changes at Azure.
    // Seems we need to specify an API version, otherwise it breaks.
    if ( $query->service === 'azure' ) {
      $url = trailingslashit( $query->azureEndpoint ) . 'openai/deployments/' .
        $query->azureDeployment . '/embeddings?api-version=2023-03-15-preview';
      $headers = array( 'Content-Type' => 'application/json', 'api-key' => $query->azureApiKey );
      $body = array( "input" => $query->prompt );
      $options = array(
        "headers" => $headers,
        "method" => "POST",
        "timeout" => 120,
        "body" => json_encode( $body ),
        "sslverify" => false
      );
      $data = $this->runQuery( $url, $options );
    }
    else {
      $openai = new Meow_MWAI_OpenAI( $this->core );
      $body = array( 'input' => $query->prompt, 'model' => $query->model );
      $data = $openai->run( 'POST', '/embeddings', $body );
    }
    if ( empty( $data ) || !isset( $data['data'] ) ) {
      throw new Exception( 'Invalid data for embedding.' );
    }
    $usage = $data['usage'];
    $this->core->record_tokens_usage( $query->model, $usage['prompt_tokens'] );
    $answer = new Meow_MWAI_Answer( $query );
    $answer->setUsage( $usage );
    $answer->setChoices( $data['data'] );
    return $answer;
  }

  public function runCompletion( $query ) {
    $this->applyQueryParameters( $query );
    if ( $query->mode !== 'chat' && $query->mode !== 'completion' ) {
      throw new Exception( 'Unknown mode for query: ' . $query->mode );
    }
    $url = "";
    $headers = array(
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer ' . $query->apiKey,
    );

    // Body
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

    // Azure
    if ( $query->service === 'azure' ) {
      $headers = array( 'Content-Type' => 'application/json', 'api-key' => $query->azureApiKey );
      if ( $query->mode === 'chat' ) {
        $url = trailingslashit( $query->azureEndpoint ) . 'openai/deployments/' .
          $query->azureDeployment . '/chat/completions?api-version=2023-03-15-preview';
        
      }
      else if ( $query->mode === 'completion' ) {
        $url = trailingslashit( $query->azureEndpoint ) . 'openai/deployments/' .
          $query->azureDeployment . '/completions?api-version=2023-03-15-preview';
      }
    }
    // OpenAI
    else {
      if ( $query->mode === 'chat' ) {
        $url = 'https://api.openai.com/v1/chat/completions';
      }
      else if ( $query->mode === 'completion' ) {
        $url = 'https://api.openai.com/v1/completions';
      }
    }

    $options = array(
      "headers" => $headers,
      "method" => "POST",
      "timeout" => 120,
      "body" => json_encode( $body ),
      "sslverify" => false
    );

    try {
      $data = $this->runQuery( $url, $options );
      if ( !$data['model'] ) {
        error_log( print_r( $data, 1 ) );
        throw new Exception( "Got an unexpected response from OpenAI. Check your PHP Error Logs." );
      }
      $answer = new Meow_MWAI_Answer( $query );
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
      $answer->setUsage( $usage );
      $answer->setChoices( $data['choices'] );
      return $answer;
    }
    catch ( Exception $e ) {
      error_log( $e->getMessage() );
      throw new Exception( 'Error while calling OpenAI: ' . $e->getMessage() );
    }
  }

  // Request to DALL-E API
  public function runCreateImages( $query ) {
    $this->applyQueryParameters( $query );
    $url = 'https://api.openai.com/v1/images/generations';
    $options = array(
      "headers" => "Content-Type: application/json\r\n" . "Authorization: Bearer " . $query->apiKey . "\r\n",
      "method" => "POST",
      "timeout" => 120,
      "body" => json_encode( array(
        "prompt" => $query->prompt,
        "n" => $query->maxResults,
        "size" => '1024x1024',
      ) ),
      "sslverify" => false
    );

    try {
      $data = $this->runQuery( $url, $options );
      $answer = new Meow_MWAI_Answer( $query );
      $usage = $this->core->record_images_usage( "dall-e", "1024x1024", $query->maxResults );
      $answer->setUsage( $usage );
      $answer->setChoices( $data['data'] );
      return $answer;
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
    $answer = null;
    try {
      if ( $query instanceof Meow_MWAI_QueryText ) {
        $answer = $this->runCompletion( $query );
      }
      else if ( $query instanceof Meow_MWAI_QueryEmbed ) {
        $answer = $this->runEmbedding( $query );
      }
      else if ( $query instanceof Meow_MWAI_QueryImage ) {
        $answer = $this->runCreateImages( $query );
      }
      else if ( $query instanceof Meow_MWAI_QueryTranscribe ) {
        $answer = $this->runTranscribe( $query );
      }
      else {
        $this->throwException( 'Invalid query.' );
      }
    }
    catch ( Exception $e ) {
      $this->throwException( $e->getMessage() );
    }

    // Let's allow some modififications of the answer
    $answer = apply_filters( 'mwai_ai_reply', $answer, $query );
    return $answer;
  }
}
