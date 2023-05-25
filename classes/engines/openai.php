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

  public function __construct($core)
  {
    $this->core = $core;
    $this->localService = $this->core->get_option( 'openai_service' );
    $this->localApiKey = $this->core->get_option( 'openai_apikey' );
    $this->localAzureEndpoint = $this->core->get_option( 'openai_azure_endpoint' );
    $this->localAzureApiKey = $this->core->get_option( 'openai_azure_apikey' );
    $this->localAzureDeployments = $this->core->get_option( 'openai_azure_deployments' );
    $this->localAzureDeployments[] = [ 'model' => 'dall-e', 'name' => 'dall-e' ];
  }

  /*
    This used to be in the core.php, but since it's relative to OpenAI, it's better to have it here.
  */

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

  public function runQuery( $url, $options ) {
    try {
      $res = wp_remote_get( $url, $options );
      if ( is_wp_error( $res ) ) {
        throw new Exception( $res->get_error_message() );
      }
      $response = wp_remote_retrieve_body( $res );
      $headersRes = wp_remote_retrieve_headers( $res );
      $headers = $headersRes->getAll();

      // If Headers contains multipart/form-data then we don't need to decode the response
      if ( strpos( $options['headers']['Content-Type'], 'multipart/form-data' ) !== false ) {
        return [
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

  public function runTranscribeQuery( $query ) {
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
      $res = $this->runQuery( $url, $options );
      $data = $res['data'];
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
      throw new Exception( "Error while calling {$service}: " . $e->getMessage() );
    }
  }

  public function runCompletionQuery( $query ) {
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
      $url .= $query->service === 'azure' ? '/chat/completions?' . $this->azureApiVersion : '/chat/completions';
    }
    else if ($query->mode === 'completion') {
      $url .= $query->service === 'azure' ? '/completions?' . $this->azureApiVersion : '/completions';
    }
    $headers = $this->buildHeaders( $query );
    $options = $this->buildOptions( $headers, $body );

    try {
      $res = $this->runQuery( $url, $options );
      $data = $res['data'];
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
      $service = $query->service === 'azure' ? 'Azure' : 'OpenAI';
      throw new Exception( "Error while calling {$service}: " . $e->getMessage() );
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
      throw new Exception( 'Error while calling OpenAI: ' . $e->getMessage() );
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
    $finetunes = $this->run('GET', '/fine-tunes');
    $deleted = [];
    $finetunes['data'] = array_filter( $finetunes['data'], function ( $finetune ) use ( &$deleted ) {
      $name = $finetune['fine_tuned_model'];
      $isSucceeded = $finetune['status'] === 'succeeded';
      $exist = true;
      if ($isSucceeded) {
        try {
          $finetune = $this->getModel( $name );
        }
        catch ( Exception $e ) {
          $exist = false;
          $deleted[] = $name;
        }
      }
      return $exist;
    });
    //$this->core->update_option( 'openai_finetunes_deleted', $deleted );
    return $deleted;
  }

  public function listFineTunes()
  {
    $finetunes = $this->run('GET', '/fine-tunes');
    $finetunes['data'] = array_map( function ( $finetune ) {
      $finetune['suffix'] = $this->getSuffixForModel( $finetune['fine_tuned_model'] );
      return $finetune;
    }, $finetunes['data']);

    //$finetunes_option = $this->core->get_option('openai_finetunes');
    $fresh_finetunes_options = array_map(function ($finetune) {
      $entry = [];
      $model = $finetune['fine_tuned_model'];
      $entry['suffix'] = $finetune['suffix'];
      $entry['model'] = $model;
      //$entry['enabled'] = true;
      // for ($i = 0; $i < count($finetunes_option); $i++) {
      //   if ($finetunes_option[$i]['model'] === $model) {
      //     $entry['enabled'] = $finetunes_option[$i]['enabled'];
      //     break;
      //   }
      // }
      return $entry;
    }, $finetunes['data']);
    $this->core->update_option('openai_finetunes', $fresh_finetunes_options);
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
      throw new Exception( 'Error while calling OpenAI: ' . $e->getMessage() );
    }
  }

  private function calculatePrice( $modelFamily, $units, $option = null, $finetune = false )
  {
    foreach ( MWAI_OPENAI_MODELS as $currentModel ) {
      if ( $currentModel['family'] === $modelFamily ) {
        if ( $currentModel['type'] === 'image' ) {
          if ( !$option ) {
            error_log( "AI Engine: Image models require an option." );
            return null;
          }
          else {
            foreach ( $currentModel['options'] as $imageType ) {
              if ( $imageType['option'] == $option ) {
                return $imageType['price'] * $units;
              }
            }
          }
        }
        else {
          if ( $finetune ) {
            // The price is doubled for finetuned models.
            return $currentModel['finetune']['price'] * $currentModel['unit'] * $units * 2;
          }
          return $currentModel['price'] * $currentModel['unit'] * $units;
        }
      }
    }
    error_log( "AI Engine: Invalid family ($modelFamily)." );
    return null;
  }

  public function getPrice( Meow_MWAI_Query $query, Meow_MWAI_Reply $reply )
  {
    $model = $query->model;
    $family = null;
    $units = 0;
    $option = null;
    $currentModel = null;
    $priceRules = null;

    $finetune = false;
    if ( is_a( $query, 'Meow_MWAI_QueryText' ) ) {
      // Finetuned models
      if ( preg_match('/^([a-zA-Z]{0,32}):/', $model, $matches ) ) {
        $family = $matches[1];
        $finetune = true;
      }
      // Standard models
      else {
        foreach ( MWAI_OPENAI_MODELS as $currentModel ) {
          if ( $currentModel['model'] == $model ) {
            $family = $currentModel['family'];
            $priceRules = isset( $currentModel['priceRules'] ) ? $currentModel['priceRules'] : null;
            break;
          }
        }
      }
      if ( empty( $family ) ) {
        error_log("AI Engine: Cannot find the base model for $model.");
        return null;
      }
      if ( !empty( $priceRules ) ) {
        if ( $priceRules === "completion_x2" ) {
          $units = $reply->getPromptTokens();
          $units += $reply->getCompletionTokens() * 2;
          return $this->calculatePrice( $family, $units, $option, $finetune );
        }
        else {
          error_log("AI Engine: Unknown price rules ($priceRules) for $model.");
          return null;
        }
      }
      else {
        $units = $reply->getTotalTokens();
        return $this->calculatePrice( $family, $units, $option, $finetune );
      }
    }
    else if ( is_a( $query, 'Meow_MWAI_QueryImage' ) ) {
      $family = 'dall-e';
      $units = $query->maxResults;
      $option = "1024x1024";
      return $this->calculatePrice( $family, $units, $option, $finetune );
    }
    else if ( is_a( $query, 'Meow_MWAI_QueryTranscribe' ) ) {
      $family = 'whisper';
      $units = $reply->getUnits();
      return $this->calculatePrice( $family, $units, $option, $finetune );
    }
    else if ( is_a( $query, 'Meow_MWAI_QueryEmbed' ) ) {
      foreach ( MWAI_OPENAI_MODELS as $currentModel ) {
        if ( $currentModel['model'] == $model ) {
          $family = $currentModel['family'];
          break;
        }
      }
      $units = $reply->getTotalTokens();
      return $this->calculatePrice( $family, $units, $option, $finetune );
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
