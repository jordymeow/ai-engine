<?php

class Meow_MWAI_AI {
  private $core = null;
  private $localApiKey = null;

  public function __construct( $core ) {
    $this->core = $core;
    $this->localApiKey = $this->core->get_option( 'openai_apikey' );
  }

  public function runTranscribe( $query ) {
    if ( empty( $query->apiKey ) ) {
      $query->apiKey = $this->localApiKey;
    }
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
    if ( empty( $query->apiKey ) ) {
      $query->apiKey = $this->localApiKey;
    }
    $openai = new Meow_MWAI_OpenAI( $this->core );
    $body = array( 'input' => $query->prompt, 'model' => $query->model );
    $data = $openai->run( 'POST', '/embeddings', $body );
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
    if ( empty( $query->apiKey ) ) {
      $query->apiKey = $this->localApiKey;
    }

    $url = "";
    $body = array(
      "model" => $query->model,
      "stop" => $query->stop,
      "n" => $query->maxResults,
      "max_tokens" => $query->maxTokens,
      "temperature" => $query->temperature,
    );

    if ( $query->mode === 'chat' ) {
      $url = 'https://api.openai.com/v1/chat/completions';
      $body['messages'] = $query->messages;
    }
    else if ( $query->mode === 'completion' ) {
      $url = 'https://api.openai.com/v1/completions';
      $body['prompt'] = $query->prompt;
    }
    else {
      throw new Exception( 'Unknown mode for query: ' . $query->mode );
    }

    $options = array(
      "headers" => "Content-Type: application/json\r\n" . "Authorization: Bearer " . $query->apiKey . "\r\n",
      "method" => "POST",
      "timeout" => 120,
      "body" => json_encode( $body ),
      "sslverify" => false
    );

    try {
      $response = wp_remote_get( $url, $options );
      if ( is_wp_error( $response ) ) {
        throw new Exception( $response->get_error_message() );
      }
      $response = wp_remote_retrieve_body( $response );
      $data = json_decode( $response, true );
      
      // Error handling
      if ( isset( $data['error'] ) ) {
        $message = $data['error']['message'];
        // If the message contains "Incorrect API key provided: THE_KEY.", replace the key by "----".
        if ( preg_match( '/API key provided(: .*)\./', $message, $matches ) ) {
          $message = str_replace( $matches[1], '', $message );
        }
        throw new Exception( $message );
      }
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
    if ( empty( $query->apiKey ) ) {
      $query->apiKey = $this->localApiKey;
    }
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
      $response = wp_remote_get( $url, $options );
      if ( is_wp_error( $response ) ) {
        throw new Exception( $response->get_error_message() );
      }
      $response = wp_remote_retrieve_body( $response );
      $data = json_decode( $response, true );
      
      // Error handling
      if ( isset( $data['error'] ) ) {
        $message = $data['error']['message'];
        // If the message contains "Incorrect API key provided: THE_KEY.", replace the key by "----".
        if ( preg_match( '/API key provided(: .*)\./', $message, $matches ) ) {
          $message = str_replace( $matches[1], '', $message );
        }
        throw new Exception( $message );
      }

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
    $query->checkFix();

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
