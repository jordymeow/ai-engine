<?php

class Meow_MWAI_OpenAI
{
  private $core = null;
  private $apiKey = null;

  public function __construct($core)
  {
    $this->core = $core;
    $this->apiKey = $this->core->get_option( 'openai_apikey' );
  }

  public function listFiles()
  {
    return $this->run( 'GET', '/files' );
  }

  function getSuffixForModel($model)
  {
    preg_match("/:([a-zA-Z\-]{1,40})-([0-9]{4})-([0-9]{2})-([0-9]{2})/", $model, $matches);
    if ( count( $matches ) > 0 ) {
      return $matches[1];
    }
    return 'N/A';
  }

  function getBaseModel($model)
  {
    preg_match("/:([a-zA-Z\-]{1,40})-([0-9]{4})-([0-9]{2})-([0-9]{2})/", $model, $matches);
    if (count($matches) > 0) {
      return $matches[1];
    }
    return 'N/A';
  }

  public function listFineTunes( $clean = false )
  {
    $finetunes = $this->run('GET', '/fine-tunes');

    if ( $clean ) {
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
      $this->core->update_option( 'openai_finetunes_deleted', $deleted );
    }

    $finetunes['data'] = array_map( function ( $finetune ) {
      $finetune['suffix'] = $this->getSuffixForModel( $finetune['fine_tuned_model'] );
      return $finetune;
    }, $finetunes['data']);

    // Get option openai_finetunes_deleted
    $deleted_finetunes = $this->core->get_option('openai_finetunes_deleted');

    // Remove all deleted finetunes from the list, make a new array, without using array_filter
    $finetunes['data'] = array_values(array_filter($finetunes['data'], function ($finetune) use ($deleted_finetunes) {
      return !in_array($finetune['fine_tuned_model'], $deleted_finetunes);
    }));

    $finetunes_option = $this->core->get_option('openai_finetunes');
    $fresh_finetunes_options = array_map(function ($finetune) use ($finetunes_option) {
      $entry = [];
      $model = $finetune['fine_tuned_model'];
      $entry['suffix'] = $finetune['suffix'];
      $entry['model'] = $model;
      $entry['enabled'] = true;
      for ($i = 0; $i < count($finetunes_option); $i++) {
        if ($finetunes_option[$i]['model'] === $model) {
          $entry['enabled'] = $finetunes_option[$i]['enabled'];
          break;
        }
      }
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
    $apiKey = $this->apiKey;
    $headers = "Content-Type: application/json\r\n" . "Authorization: Bearer " . $apiKey . "\r\n";
    $body = $query ? json_encode( $query ) : null;
    if ( !empty( $formFields ) ) {
      $boundary = wp_generate_password (24, false );
      $headers  = [
        'Content-Type' => 'multipart/form-data; boundary=' . $boundary,
        'Authorization' => 'Bearer ' . $this->apiKey,
      ];
      $body = $this->buildFormBody( $formFields, $boundary );
    }

    $url = 'https://api.openai.com/v1' . $url;
    $options = [
      "headers" => $headers,
      "method" => $method,
      "timeout" => 120,
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

      // Error handling
      if ( isset( $data['error'] ) ) {
        $message = $data['error']['message'];
        // If the message contains "Incorrect API key provided: THE_KEY.", replace the key by "----".
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

  public function getPrice( Meow_MWAI_Query $query, Meow_MWAI_Answer $answer )
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
            $priceRules = $currentModel['priceRules'];
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
          $units = $answer->getPromptTokens();
          $units += $answer->getCompletionTokens() * 2;
          return $this->calculatePrice( $family, $units, $option, $finetune );
        }
        else {
          error_log("AI Engine: Unknown price rules ($priceRules) for $model.");
          return null;
        }
      }
      else {
        $units = $answer->getTotalTokens();
        return $this->calculatePrice( $family, $units, $option, $finetune );
      }
    }
    else if ( is_a( $query, 'Meow_MWAI_QueryImage' ) ) {
      $family = 'dall-e';
      $units = $query->maxResults;
      $option = "1024x1024";
      return $this->calculatePrice( $family, $units, $option, $finetune );
    }
    else if ( is_a( $query, 'Meow_MWAI_QueryEmbed' ) ) {
      foreach ( MWAI_OPENAI_MODELS as $currentModel ) {
        if ( $currentModel['model'] == $model ) {
          $family = $currentModel['family'];
          break;
        }
      }
      $units = $answer->getTotalTokens();
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
