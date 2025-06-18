<?php
/**
 * Base implementation of the ChatML API.
 * This was first introduced by OpenAI and many providers keep compatibility with it.
 * Engines relying on this original API can extend this class.
 *
 */ 

class Meow_MWAI_Engines_ChatML extends Meow_MWAI_Engines_Core
{
  // Base (OpenAI)
  protected $apiKey = null;
  protected $organizationId = null;

  // Azure
  private $azureDeployments = null;
  private $azureApiVersion = 'api-version=2024-12-01-preview';

  // Response
  protected $inModel = null;
  protected $inId = null;
  protected $inThreadId = null;

  // Streaming
  protected $streamFunctionCall = null;
  protected $streamToolCalls = [];
  protected $streamLastMessage = null;
  protected $streamAnnotations = [];
  protected $streamImageIds = [];

  protected $streamInTokens = null;
  protected $streamOutTokens = null;
  protected $streamCost = null;

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
    $this->emittedFunctionResults = [];
  }

  protected function set_environment() {
    $env = $this->env;
    $this->apiKey = $env['apikey'];
    
    if ( isset( $env['organizationId'] ) ) {
      $this->organizationId = $env['organizationId'];
    }
    if ( $this->envType === 'azure' ) {
      $this->azureDeployments = isset( $env['deployments'] ) ? $env['deployments'] : [];
      $this->azureDeployments[] = [ 'model' => 'dall-e', 'name' => 'dall-e' ];
    }
  }

  private function get_azure_deployment_name( $model ) {
    foreach ( $this->azureDeployments as $deployment ) {
      if ( $deployment['model'] === $model && !empty( $deployment['name'] ) ) {
        return $deployment['name'];
      }
    }
    throw new Exception( 'Unknown deployment for model: ' . $model );
  }

  protected function get_service_name() {
    return $this->envType === 'azure' ? 'Azure' : 'OpenAI';
  }

  private function is_o1_model( $model ) {
    $modelDef = $this->retrieve_model_info( $model );
    return !empty( $modelDef['tags'] ) && in_array( 'o1-model', $modelDef['tags'] );
  }

  private function requires_developer_roles( $model ) {
    if ( $model === 'o1' ) {
      return true;
    }
    return false;
  }

  protected function build_messages( $query ) {
    $messages = [];

    // First, we need to add the first message (the instructions).
    if ( !empty( $query->instructions ) ) {
      //if ( !$this->is_o1_model( $query->model ) ) {
        $messages[] = [ 'role' => 'system', 'content' => $query->instructions ];
      //}
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
      if ( $query->image_remote_upload === 'url' ) {
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

    // We need to convert all the 'system' role into 'developer' role.
    if ( $this->requires_developer_roles( $query->model ) ) {
      foreach ( $messages as &$message ) {
        if ( $message['role'] === 'system' ) {
          $message['role'] = 'developer';
        }
      }
    }
    // But otherwise, if it's o1, we need to remove the message which are 'system'
    else if ( $this->is_o1_model( $query->model ) ) {
      $hasChanges = false;
      foreach ( $messages as $index => $message ) {
        if ( $message['role'] === 'system' ) {
          unset( $messages[$index] );
          $hasChanges = true;
        }
      }
      if ( $hasChanges ) {
        $messages = array_values( $messages );
        Meow_MWAI_Logging::warn( 'The model ' . $query->model . ' doesn\'t support System nor Developer messages. They were removed.' );
      }
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
        // max_tokens has been deprecated in favor of max_completion_tokens in 2025.
        $body['max_completion_tokens'] = $query->maxTokens;
      }

      if ( !empty( $query->temperature ) ) {
        if ( !$this->is_o1_model( $query->model ) ) {
          $body['temperature'] = $query->temperature;
        }
        else {
          $body['temperature'] = 1;
        }
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

      // Usage Data (only for OpenAI)
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
          Meow_MWAI_Logging::warn( 'OpenAI doesn\'t support Function Calling with fine-tuned models yet.' );
        }
        else {
          $body['tools'] = [];
          // Dynamic function: they will interactively enhance the completion (tools).
          foreach ( $query->functions as $function ) {
            $body['tools'][] = [
              'type' => 'function',
              'function' => $function->serializeForOpenAI()
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
              
              // Emit function result event if streaming and debug mode are enabled
              if ( $this->currentDebugMode && !empty( $this->streamCallback ) ) {
                $toolId = $feedback['request']['toolId'] ?? null;
                // Only emit if we haven't already emitted for this tool
                if ( $toolId && !isset( $this->emittedFunctionResults[$toolId] ) ) {
                  $this->emittedFunctionResults[$toolId] = true;
                  
                  $functionName = $feedback['request']['name'];
                  $resultPreview = (string)($feedback['reply']['value'] ?? '');
                  if ( strlen( $resultPreview ) > 100 ) {
                    $resultPreview = substr( $resultPreview, 0, 100 ) . '...';
                  }
                  
                  $event = Meow_MWAI_Event::function_result( $functionName )
                    ->set_metadata( 'result', $resultPreview )
                    ->set_metadata( 'tool_id', $toolId );
                  call_user_func( $this->streamCallback, $event );
                }
              }
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
    else if ( $query instanceof Meow_MWAI_Query_EditImage ) {
      $resolution = !empty( $query->resolution ) ? $query->resolution : '1024x1024';
      $filename = $query->attachedFile ? $query->attachedFile->get_filename() : '';
      $mimeType = $query->attachedFile ? $query->attachedFile->get_mimeType() : null;
      $body = array(
        'prompt' => $query->message,
        'n' => $query->maxResults,
        'size' => $resolution,
        'image' => $filename,
        'data' => $extra
      );
      if ( !empty( $mimeType ) ) {
        $body['mime'] = $mimeType;
      }
      
      // Add mask if provided
      if ( !empty( $query->mask ) ) {
        $maskData = $query->mask->get_data();
        $maskFilename = 'mask.png';
        $maskMimeType = $query->mask->get_mimeType();
        
        $body['mask'] = $maskFilename;
        $body['mask_data'] = $maskData;
        if ( !empty( $maskMimeType ) ) {
          $body['mask_mime'] = $maskMimeType;
        }
      }
      // 'response_format' => 'b64_json',
      if ( !empty( $query->model ) ) {
        $body['model'] = $query->model;
      }
      return $body;
    }
    else if ( $query instanceof Meow_MWAI_Query_Image ) {
      $model = $query->model;
      $resolution = !empty( $query->resolution ) ? $query->resolution : '1024x1024';
      $body = array(
        "prompt" => $query->message,
        "n" => $query->maxResults,
        "size" => $resolution,
      );

      // TODO: Let's clean this up; with a better Query Image class.
      // https://platform.openai.com/docs/api-reference/images/create#images-create-quality

      if ( $model === 'gpt-image-1' ) {
        // If it's GPT Image 1, we need to set the quality and moderation.
        $body['model'] = 'gpt-image-1';
        $body['quality'] = 'high';
        $body['moderation'] = 'low';
      }
      else {
        // If it's DALL-E 3, we need to set the response format.
        $body['response_format'] = 'b64_json';
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
      }
      return $body;
    }
  }

  protected function build_url( $query, $endpoint = null ) {
    $url = "";
    $env = $this->env;
    // This endpoint is basically OpenAI or Azure, but in the case this class
    // is overriden, we can pass the endpoint directly (for OpenRouter or HuggingFace, for example).
    if ( empty( $endpoint ) ) {
      if ( $this->envType === 'openai' ) {
        $endpoint = apply_filters( 'mwai_openai_endpoint', 'https://api.openai.com/v1', $this->env );
        $this->organizationId = isset( $env['organizationId'] ) ? $env['organizationId'] : null;
      }
      else if ( $this->envType === 'azure' ) {
        $endpoint = isset( $env['endpoint'] ) ? $env['endpoint'] : null;
      }
      else {
        if ( empty( $this->envType ) ) {
          throw new Exception( 'Endpoint is not defined, and this envType is not known.' );
        }
        throw new Exception( 'Endpoint is not defined, and this envType is not known: ' . $this->envType );
      }
    }
    // Add the base API to the URL
    if ( $query instanceof Meow_MWAI_Query_Text || $query instanceof Meow_MWAI_Query_Feedback ) {
      if ( $this->envType === 'azure' ) {
        $deployment_name = $this->get_azure_deployment_name( $query->model );
        $url = trailingslashit( $endpoint ) . 'openai/deployments/' . $deployment_name;
        $url .= '/chat/completions?' . $this->azureApiVersion;
      }
      else {
        $url .= trailingslashit( $endpoint ) . 'chat/completions';
      }
      return $url;
    }
    else if ( $query instanceof Meow_MWAI_Query_Transcribe ) {
      $modeEndpoint = $query->feature === 'translation' ? 'translations' : 'transcriptions';
      $url .= trailingslashit( $endpoint ) . 'audio/' . $modeEndpoint;
      return $url;
    }
    else if ( $query instanceof Meow_MWAI_Query_Embed ) {
      $url .= trailingslashit( $endpoint ) . 'embeddings';
      if ( $this->envType === 'azure' ) {
        $deployment_name = $this->get_azure_deployment_name( $query->model );
        $url = trailingslashit( $endpoint ) . 'openai/deployments/' .
          $deployment_name . '/embeddings?' . $this->azureApiVersion;
      }
      return $url;
    }
    else if ( $query instanceof Meow_MWAI_Query_EditImage ) {
      $url .= trailingslashit( $endpoint ) . 'images/edits';
      if ( $this->envType === 'azure' ) {
        $deployment_name = $this->get_azure_deployment_name( $query->model );
        $url = trailingslashit( $endpoint ) . 'openai/deployments/' .
          $deployment_name . '/images/edits?' . $this->azureApiVersion;
      }
      return $url;
    }
    else if ( $query instanceof Meow_MWAI_Query_Image ) {
      $url .= trailingslashit( $endpoint ) . 'images/generations';
      if ( $this->envType === 'azure' ) {
        $deployment_name = $this->get_azure_deployment_name( $query->model );
        $url = trailingslashit( $endpoint ) . 'openai/deployments/' .
          $deployment_name . '/images/generations?' . $this->azureApiVersion;
      }
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
      $headers['OpenAI-Organization'] = $this->organizationId;
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
  // object: "thread.message.delta"
  protected function stream_data_handler( $json ) {
    $content = null;
  
    // Get additional data from the JSON
    if ( isset( $json['model'] ) ) {
      $this->inModel = $json['model'];
    }
    if ( isset( $json['id'] ) ) {
      $this->inId = $json['id'];
      
      // Send start event if debug mode is enabled
      if ( $this->currentDebugMode && $this->streamCallback ) {
        $event = Meow_MWAI_Event::status( 'Starting stream...' )
          ->set_metadata( 'model', $this->inModel )
          ->set_metadata( 'id', $this->inId );
        call_user_func( $this->streamCallback, $event );
      }
    }
  
    $object = $json['object'] ?? null;
  
    if ( $object === 'thread.run' ) {
      $this->inThreadId = $json['thread_id'];
      if ( $json['status'] === 'failed' ) {
        $error = $json['last_error']['message'] ?? 'The run failed.';
        throw new Exception( $error );
      }
    } 
    else if ( $object === 'thread.run.step.delta' ) {
      if ( $json['delta']['step_details']['type'] === 'tool_calls' ) {
        foreach ( $json['delta']['step_details']['tool_calls'] as $tool_call ) {
          $index = $tool_call['index'] ?? null;
          $currentStreamToolCall = null;
          if ( $index !== null && isset( $this->streamToolCalls[$index] ) ) {
            $currentStreamToolCall = &$this->streamToolCalls[$index];
          } 
          else {
            $this->streamToolCalls[] = [
              'id' => null,
              'type' => null,
              'function' => [ 'name' => "", 'arguments' => "" ],
              'code_interpreter' => [ 'input' => "", 'outputs' => [] ],
            ];
            end( $this->streamToolCalls );
            $currentStreamToolCall = &$this->streamToolCalls[ key( $this->streamToolCalls ) ];
            
            // Send tool call initiated event
            if ( $this->currentDebugMode && $this->streamCallback ) {
              $event = Meow_MWAI_Event::status( 'Initiating tool call...' );
              call_user_func( $this->streamCallback, $event );
            }
          }
          if ( !empty( $tool_call['id'] ) ) {
            $currentStreamToolCall['id'] = $tool_call['id'];
          }
          if ( !empty( $tool_call['type'] ) ) {
            $currentStreamToolCall['type'] = $tool_call['type'];
          }
          if ( isset( $tool_call['function'] ) ) {
            $function = $tool_call['function'];
            if ( isset( $function['name'] ) ) {
              $currentStreamToolCall['function']['name'] .= $function['name'];
            }
            if ( isset( $function['arguments'] ) ) {
              $currentStreamToolCall['function']['arguments'] .= $function['arguments'];
            }
          }
          if ( isset( $tool_call['code_interpreter'] ) ) {
            $code_interpreter = $tool_call['code_interpreter'];
            if ( isset( $code_interpreter['input'] ) ) {
              $currentStreamToolCall['code_interpreter']['input'] .= $code_interpreter['input'];
            }
            if ( isset( $code_interpreter['outputs'] ) ) {
              $currentStreamToolCall['code_interpreter']['outputs'] = $code_interpreter['outputs'];
            }
          }
          $this->streamLastMessage['tool_calls'] = $this->streamToolCalls;
        }
      }
    } 
    else if ( $object === 'thread.message.delta' ) {
      $delta = $json['delta']['content'][0] ?? null;
      if ( $delta ) {
        switch ( $delta['type'] ?? null ) {
          case 'text':
            if ( !empty( $delta['value'] ) && is_string( $delta['value'] ) ) {
              $content = $delta['value'];
            }
            else if ( !empty( $delta['text'] ) && is_string( $delta['text'] ) ) {
              $content = $delta['text'];
            }
            else if ( !empty( $delta['text'] ) && is_array( $delta['text'] ) ) {
              $text = $delta['text'];
              if ( !empty( $text['annotations'] ) ) {
                $this->streamAnnotations = array_merge( $this->streamAnnotations, $text['annotations'] );
              }
              if ( isset( $text['value'] ) ) {
                $content = $text['value'];
              }
            }
            else {
              error_log( 'AI Engine: Unknown text format: ' . json_encode( $delta ) );
            }
            break;
          case 'image':
            $content = $delta['url'];
            break;
          case 'image_file':
            $fileId = $delta['image_file']['file_id'];
            $content = "<!-- IMG #" . $fileId . " -->";
            $this->streamImageIds[] = $fileId;
            break;
          case 'function_call':
            if ( empty( $this->streamFunctionCall ) ) {
              $this->streamFunctionCall = [ 'name' => "", 'arguments' => [] ];
            }
            $this->streamFunctionCall['name'] = $delta['function_call']['name'] ?? $this->streamFunctionCall['name'];
            if ( isset( $delta['function_call']['arguments'] ) ) {
              $args = json_decode( $delta['function_call']['arguments'], true );
              $this->streamFunctionCall['arguments'] = $args ?? [];
            }
            break;
          case 'tool_call':
            $tool_call = $delta['tool_call'];
            $index = $tool_call['index'] ?? null;
            $currentStreamToolCall = null;
            if ( $index !== null && isset( $this->streamToolCalls[$index] ) ) {
              $currentStreamToolCall = &$this->streamToolCalls[$index];
            } 
            else {
              $this->streamToolCalls[] = [
                'id' => null,
                'type' => null,
                'function' => [ 'name' => "", 'arguments' => "" ]
              ];
              end( $this->streamToolCalls );
              $currentStreamToolCall = &$this->streamToolCalls[ key( $this->streamToolCalls ) ];
            }
            break;
        }
      }
    } 
    else if ( $object === 'thread.run.step' ) {
      //$type = $json['step'];
      // Could be tool_calls, means an OpenAI Assistant is doing something.
    }
    else {
      if ( isset( $json['choices'][0]['text'] ) ) {
        $content = $json['choices'][0]['text'];
      } 
      else if ( isset( $json['choices'][0]['delta']['content'] ) ) {
        $content = $json['choices'][0]['delta']['content'];
      } 
      else if ( isset( $json['choices'][0]['delta']['function_call'] ) ) {
        if ( empty( $this->streamFunctionCall ) ) {
          $this->streamFunctionCall = [ 'name' => "", 'arguments' => [] ];
        }
        $this->streamFunctionCall['name'] = $json['choices'][0]['delta']['function_call']['name'] ?? $this->streamFunctionCall['name'];
        if ( isset( $json['choices'][0]['delta']['function_call']['arguments'] ) ) {
          $args = json_decode( $json['choices'][0]['delta']['function_call']['arguments'], true );
          $this->streamFunctionCall['arguments'] = $args ?? [];
        }
      } 
      else if ( isset( $json['choices'][0]['delta']['tool_calls'] ) ) {
        foreach ( $json['choices'][0]['delta']['tool_calls'] as $tool_call ) {
          $index = $tool_call['index'] ?? null;
          $currentStreamToolCall = null;
          if ( $index !== null && isset( $this->streamToolCalls[$index] ) ) {
            $currentStreamToolCall = &$this->streamToolCalls[$index];
          } 
          else {
            $this->streamToolCalls[] = [ 
              'id' => null,
              'type' => null,
              'function' => [ 'name' => "", 'arguments' => "" ]
            ];
            end( $this->streamToolCalls );
            $currentStreamToolCall = &$this->streamToolCalls[ key( $this->streamToolCalls ) ];
          }
          if ( !empty( $tool_call['id'] ) ) {
            $currentStreamToolCall['id'] = $tool_call['id'];
          }
          if ( !empty( $tool_call['type'] ) ) {
            $currentStreamToolCall['type'] = $tool_call['type'];
          }
          if ( isset( $tool_call['function'] ) ) {
            $function = $tool_call['function'];
            if ( isset( $function['name'] ) ) {
              $currentStreamToolCall['function']['name'] .= $function['name'];
            }
            if ( isset( $function['arguments'] ) ) {
              $currentStreamToolCall['function']['arguments'] .= $function['arguments'];
            }
          }
          $this->streamLastMessage['tool_calls'] = $this->streamToolCalls;
        }
      } 
      else if ( isset( $json['choices'][0]['delta']['role'] ) ) {
        $this->streamLastMessage = [
          'role' => $json['choices'][0]['delta']['role'],
          'content' => null
        ];
      }
    }
  
    $usage = $json['usage'] ?? [];
    if ( isset( $usage['prompt_tokens'], $usage['completion_tokens'] ) ) {
      $this->streamInTokens  = (int)$usage['prompt_tokens'];
      $this->streamOutTokens = (int)$usage['completion_tokens'];
      
      if ( isset($usage['cost'] ) ) {
        $this->streamCost = (float)$usage['cost'];
      }
    }

    // If content is an array, let's try to convert it into a string. Normally, there would be a 'value' key.
    if ( is_array( $content ) ) {
      if ( isset( $content['value'] ) ) {
        $content = $content['value'];
      }
      else {
        throw new Exception( 'AI Engine: Could not read this: ' . json_encode( $content ) );
      }
    }

    // Avoid some endings
    $endings = [ "", "</s>" ];
    if ( in_array( $content, $endings ) ) {
      $content = null;
    }
  
    return ( $content === '0' || !empty( $content ) ) ? $content : null;
  }

  public function run( $query, $streamCallback = null, $maxDepth = 5 ) {
    if ( $streamCallback ) {
      // Disable streaming only for "o1" (as December 2024, it works for preview and mini)
      if ( $query->model === 'o1' ) {
        $streamCallback = null;
      }
    }
    return parent::run( $query, $streamCallback, $maxDepth );
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
      else if ( $responseCode === 400 ) {
        $message = wp_remote_retrieve_body( $res );
        if ( empty( $message ) ) {
          $message = wp_remote_retrieve_response_message( $res );
        }
        if ( empty( $message ) ) {
          $message = 'Bad Request';
        }
        throw new Exception( $message );
      }
      else if ( $responseCode === 500 ) {
        $message = wp_remote_retrieve_body( $res );
        if ( empty( $message ) ) {
          $message = wp_remote_retrieve_response_message( $res );
        }
        if ( empty( $message ) ) {
          $message = 'Internal Server Error';
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
      $service = $this->get_service_name();
      Meow_MWAI_Logging::error( "$service: " . $e->getMessage() );
      throw $e;
    }
    finally {
      if ( $isStream && file_exists( $options['filename'] ) ) {
        unlink( $options['filename'] );
      }
    }
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
    // TODO: This function currently only supports the URL method.
    // But as with Vision, we should support the file upload method too.
    $attachedFile = $query->attachedFile ?? null;
    $audioUrl = $query->url ?? null;
    if ( $attachedFile ) {
      $audioUrl = $attachedFile->get_url();
      $query->set_url( $audioUrl );
    }
    if ( !filter_var( $audioUrl, FILTER_VALIDATE_URL ) ) {
      throw new Exception( 'Invalid URL for transcription.' );
    }

    $audioData = $this->get_audio( $audioUrl );
    $body = $this->build_body( $query, null, $audioData['data'] );
    $url = $this->build_url( $query );
    $headers = $this->build_headers( $query );
    $options = $this->build_options( $headers, null, $body );

    // Perform the request
    try { 
      $res = $this->run_query( $url, $options );
      $data = $res['data'];
      if ( empty( $data ) ) {
        throw new Exception( 'Invalid data for transcription.' );
      }
      $usage = $this->core->record_audio_usage( $query->model, $audioData['length'] );
      $reply = new Meow_MWAI_Reply( $query );
      $reply->set_usage( $usage );
      $reply->set_choices( $data );
      return $reply;
    }
    catch ( Exception $e ) {
      $service = $this->get_service_name();
      Meow_MWAI_Logging::error( "$service: " . $e->getMessage() );
      throw new Exception( "$service: " . $e->getMessage() );
    }
  }

  public function run_embedding_query( $query ) {
    $body = $this->build_body( $query );
    $url = $this->build_url( $query );
    $headers = $this->build_headers( $query );
    $options = $this->build_options( $headers, $body );

    try {
      $res = $this->run_query( $url, $options );
      $data = $res['data'];
      if ( empty( $data ) || !isset( $data['data'] ) ) {
        throw new Exception( 'Invalid data for embedding.' );
      }
      $usage = $data['usage'];
      $this->core->record_tokens_usage( $query->model, $usage['prompt_tokens'] );
      $reply = new Meow_MWAI_Reply( $query );
      $reply->set_usage( $usage );
      $reply->set_choices( $data['data'] );
      return $reply;
    }
    catch ( Exception $e ) {
      $message = $e->getMessage();
      $error = $this->try_decode_error( $message );
      if ( !is_null( $error ) ) {
        $message = $error;
      }
      $service = $this->get_service_name();
      Meow_MWAI_Logging::error( "$service: " . $message );
      throw new Exception( "$service: " . $message );
    }
  }

  public function try_decode_error( $data ) {
    $json = json_decode( $data, true );
    if ( isset( $json['error']['message'] ) ) {
      return $json['error']['message'];
    }
    return null;
  }

  protected function finalize_choices( $choices, $responseData, $query ) {
    return $choices;
  }

  public function run_completion_query( $query, $streamCallback = null ) : Meow_MWAI_Reply {
    $isStreaming = !is_null( $streamCallback );
    
    // Initialize debug mode
    $this->init_debug_mode( $query );

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
        if ( !is_null( $this->streamCost ) ) {
          $returned_price = $this->streamCost;
        }
        $returned_choices = [ [ 'message' => $message ] ];
        $returned_choices = $this->finalize_choices( $returned_choices, null, $query );
      }
      // Standard Mode
      else {
        $data = $res['data'];
        if ( empty( $data ) ) {
          throw new Exception( 'No content received (res is null).' );
        }
        if ( !$data['model'] ) {
          $service = $this->get_service_name();
          Meow_MWAI_Logging::error( "$service: Invalid response (no model information)." );
          Meow_MWAI_Logging::error( print_r( $data, 1 ) );
          throw new Exception( 'Invalid response (no model information).' );
        }
        $returned_id = $data['id'];
        $returned_model = $data['model'];
        $usage = $data['usage'] ?? [];
        $returned_in_tokens = $usage['prompt_tokens'] ?? null;
        $returned_out_tokens = $usage['completion_tokens'] ?? null;
        $returned_price = $usage['total_cost'] ?? $usage['cost'] ?? null;
        $returned_choices = $data['choices'];
        $returned_choices = $this->finalize_choices( $returned_choices, $data, $query );
      }
      
      // Set the results.
      $reply->set_choices( $returned_choices );
      if ( !empty( $returned_id ) ) {
        $reply->set_id( $returned_id );
      }
      if ( !empty( $returned_id ) ) {
        $reply->set_id( $returned_id );
      }

      // Handle tokens.
      $this->handle_tokens_usage(  $reply, $query, $returned_model,
        $returned_in_tokens, $returned_out_tokens, $returned_price
      );

      return $reply;
    }
    catch ( Exception $e ) {
      $service = $this->get_service_name();
      Meow_MWAI_Logging::error( "$service: " . $e->getMessage() );
      $message = "$service: " . $e->getMessage();
      throw new Exception( $message );
    }
    finally {
      if ( !is_null( $streamCallback ) ) {
        remove_action( 'http_api_curl', [ $this, 'stream_handler' ] );
      }
    }
  }

  public function handle_tokens_usage( $reply, $query, $returned_model,
    $returned_in_tokens, $returned_out_tokens, $returned_price = null ) {
    $returned_in_tokens = !is_null( $returned_in_tokens ) ? $returned_in_tokens :
      $reply->get_in_tokens( $query );
    $returned_out_tokens = !is_null( $returned_out_tokens ) ? $returned_out_tokens :
      $reply->get_out_tokens();
    $returned_price = !is_null( $returned_price ) ? $returned_price :
      $reply->get_price();
    $usage = $this->core->record_tokens_usage(
      $returned_model,
      $returned_in_tokens,
      $returned_out_tokens,
      $returned_price
    );
    $reply->set_usage( $usage );
  }

  // Request to DALL-E API
  public function run_image_query( $query ) {
    $body = $this->build_body( $query );
    $url = $this->build_url( $query );
    $headers = $this->build_headers( $query );
    $options = $this->build_options( $headers, $body );

    try {
      $res = $this->run_query( $url, $options );
      $data = $res['data'];
      $choices = [];
      $choices = $data['data'];
      $reply = new Meow_MWAI_Reply( $query );
      $model = $query->model;
      $resolution = !empty( $query->resolution ) ? $query->resolution : '1024x1024';
      $usage = $this->core->record_images_usage( $model, $resolution, $query->maxResults );
      $reply->set_usage( $usage );
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
      $service = $this->get_service_name();
      Meow_MWAI_Logging::error( "$service: " . $e->getMessage() );
      throw new Exception( "$service: " . $e->getMessage() );
    }
  }

  public function run_editimage_query( $query ) {
    if ( empty( $query->attachedFile ) ) {
      throw new Exception( 'No image provided for editing.' );
    }
    // Ensure the model supports image editing
    $modelInfo = $this->retrieve_model_info( $query->model );
    if ( empty( $modelInfo['tags'] ) || !in_array( 'image-edit', $modelInfo['tags'] ) ) {
      throw new Exception( 'The model ' . $query->model . ' does not support image editing.' );
    }
    $imageData = $query->attachedFile->get_data();
    $body = $this->build_body( $query, null, $imageData );
    $url = $this->build_url( $query );
    $headers = $this->build_headers( $query );
    $options = $this->build_options( $headers, null, $body );

    try {
      $res = $this->run_query( $url, $options );
      $data = $res['data'];
      $choices = $data['data'];
      $reply = new Meow_MWAI_Reply( $query );
      $model = $query->model;
      $resolution = !empty( $query->resolution ) ? $query->resolution : '1024x1024';
      $usage = $this->core->record_images_usage( $model, $resolution, $query->maxResults );
      $reply->set_usage( $usage );
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
      $service = $this->get_service_name();
      Meow_MWAI_Logging::error( "$service: " . $e->getMessage() );
      throw new Exception( "$service: " . $e->getMessage() );
    }
  }

  /*
    This is the rest of the OpenAI API support, not related to the models directly.
  */

  // Check if there are errors in the response from OpenAI, and throw an exception if so.
  protected function handle_response_errors( $data ) {
    if ( isset( $data['error'] ) && !empty( $data['error'] ) ) {
      $message = $data['error']['message'];
      if ( preg_match( '/API key provided(: .*)\./', $message, $matches ) ) {
        $message = str_replace( $matches[1], '', $message );
      }
      throw new Exception( $message );
    }
  }  

  public function list_files( $purposeFilter = null )
  {
    if ( empty( $purposeFilter ) ) {
      return $this->execute( 'GET', '/files' );
    }
    return $this->execute( 'GET', '/files', [ 'purpose' => $purposeFilter ] );
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

  static function get_model_without_release_date( $model )
  {
    if ( empty( $model ) ) {
      return null;
    }
    return preg_replace( '/-\d{4}-\d{2}-\d{2}$/', '', $model );
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
      $this->core->update_ai_env( $this->envId, 'legacy_finetunes_deleted', $deleted );
    }
    else {
      $this->core->update_ai_env( $this->envId, 'finetunes_deleted', $deleted );
    }
    return $deleted;
  }

  // TODO: This was used to retrieve the fine-tuned models, but not sure this is how we should
  // retrieve all the models since Summer 2023, let's see! WIP.
  public function list_finetunes( $legacy = false )
  {
    if ( $legacy ) {
      $res = $this->execute( 'GET', '/fine-tunes' );
    }
    else {
      $res = $this->execute( 'GET', '/fine_tuning/jobs' );
    }
    $finetunes = $res['data'];

    // Add suffix
    $finetunes = array_map( function ( $finetune ) {
      if ( isset( $finetune['user_provided_suffix'] ) ) {
        $finetune['suffix'] = $finetune['user_provided_suffix'];
      }
      else {
        $finetune['suffix'] = SELF::get_suffix_for_model( $finetune['fine_tuned_model'] );
      } 
      $finetune['createdOn'] = date( 'Y-m-d H:i:s', $finetune['created_at'] ) . ' UTC';
      if ( isset( $finetune['estimated_finish'] ) ) {
        $finetune['estimatedOn'] = date( 'Y-m-d H:i:s', $finetune['estimated_finish'] ) . ' UTC';
      }
      else {
        $finetune['estimatedOn'] = null;
      }
      //$finetune['updatedOn'] = date( 'Y-m-d H:i:s', $finetune['updated_at'] );
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
      $this->core->update_ai_env( $this->envId, 'legacy_finetunes', $finetunes );
    }
    else {
      $this->core->update_ai_env( $this->envId, 'finetunes', $finetunes );
    }

    return $finetunes;
  }

  public function moderate( $input ) {
    $result = $this->execute('POST', '/moderations', [
      'input' => $input
    ]);
    return $result;
  }

  public function upload_file( $filename, $data, $purpose = 'fine-tune' )
  {
    $result = $this->execute('POST', '/files', null, [
      'purpose' => $purpose,
      'data' => $data,
      'file' => $filename
    ] );
    return $result;
  }

  public function create_vector_store( $name = null, $expiry = null, $metadata = null ) {
    $body = [
      'name' => !empty( $name ) ? $name : 'default',
      'metadata' => $metadata
    ];
    if ( $expiry !== 'never' ) {
      if ( is_string( $expiry ) ) {
        error_log( 'AI Engine: Expiry is a string, setting it to 7 days.' );
        $expiry = 7;
      }
      $expiryInDays = $expiry ? max( 1, ceil( (int)$expiry / 86400 ) ) : 7;
      if ( $expiry && is_numeric( $expiry ) ) {
        $body['expires_after'] = [
          'anchor' => 'last_active_at',
          'days' => $expiryInDays
        ];
      }
    }
    $result = $this->execute( 'POST', '/vector_stores', $body, null, true, [ 'OpenAI-Beta' => 'assistants=v2' ] );
    return $result['id'];
  }

  public function get_vector_store( $vectorStoreId ) {
    return $this->execute( 'GET', '/vector_stores/' . $vectorStoreId, null, null, true, [ 'OpenAI-Beta' => 'assistants=v2' ] );
  }

  public function add_vector_store_file( $vectorStoreId, $fileId ) {
    $result = $this->execute( 'POST', '/vector_stores/' . $vectorStoreId . '/files', [
      'file_id' => $fileId
    ], null, true, [ 'OpenAI-Beta' => 'assistants=v2' ] );
    return $result['id'];

  }

  public function delete_file( $fileId )
  {
    return $this->execute( 'DELETE', '/files/' . $fileId );
  }

  public function get_model( $modelId )
  {
    return $this->execute( 'GET', '/models/' . $modelId );
  }

  public function cancel_finetune( $fineTuneId )
  {
    return $this->execute( 'POST', '/fine-tunes/' . $fineTuneId . '/cancel' );
  }

  public function delete_finetune( $modelId )
  {
    return $this->execute( 'DELETE', '/models/' . $modelId );
  }

  public function download_file( $fileId, $newFile = null ) {
    $fileInfo = $this->execute( 'GET', '/files/' . $fileId, null, null, false );
    $fileInfo = json_decode( (string)$fileInfo, true );
    if ( empty( $fileInfo ) ) {
      throw new Exception( 'AI Engine: File (' . ( $fileId ?? 'N/A' ) . ') not found.' );
    }
    $filename = $fileInfo['filename'];
    $extension = pathinfo( $filename, PATHINFO_EXTENSION );
    if ( empty( $newFile ) ) {
      include_once( ABSPATH . 'wp-admin/includes/file.php' );
      $tempFile = wp_tempnam( $filename );
      if ( !$tempFile ) {
        $tempFile = tempnam( sys_get_temp_dir(), 'download_' );
      }
      if ( pathinfo( $tempFile, PATHINFO_EXTENSION ) != $extension ) {
        $newFile = $tempFile . '.' . $extension;
      }
      else {
        $newFile = $tempFile;
      }
    }
    $data = $this->execute( 'GET', '/files/' . $fileId . '/content', null, null, false );
    file_put_contents( $newFile, $data );
    return $newFile;
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
      $result = $this->execute( 'POST', '/fine-tunes', $arguments );
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
      $result = $this->execute( 'POST', '/fine_tuning/jobs', $arguments );
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
      if ( in_array( $name, [ 'data', 'mime', 'mask_data', 'mask_mime' ] ) ) {
        continue;
      }
      $body .= "--$boundary\r\n";
      $body .= "Content-Disposition: form-data; name=\"$name\"";
      if ( $name === 'image' || $name === 'file' ) {
        $body .= "; filename=\"{$value}\"\r\n";
        $mime = !empty( $fields['mime'] ) ? $fields['mime'] : 'application/octet-stream';
        $body .= "Content-Type: {$mime}\r\n\r\n";
        $body .= $fields['data'] . "\r\n";
      }
      else if ( $name === 'mask' ) {
        $body .= "; filename=\"{$value}\"\r\n";
        $mime = !empty( $fields['mask_mime'] ) ? $fields['mask_mime'] : 'application/octet-stream';
        $body .= "Content-Type: {$mime}\r\n\r\n";
        $body .= $fields['mask_data'] . "\r\n";
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
  public function execute( $method, $url, $query = null, $formFields = null,
    $json = true, $extraHeaders = null, $streamCallback = null )
  {
    $isAzure = $this->envType === 'azure';
    $isOpenAI = !$isAzure;

    // Prepare the headers
    $headers = "Content-Type: application/json\r\n";
    if ( $isOpenAI ) {
      $headers .= "Authorization: Bearer " . $this->apiKey . "\r\n";
      if ( $this->organizationId ) {
        $headers .= "OpenAI-Organization: " . $this->organizationId . "\r\n";
      }
    }
    else if ( $isAzure ) {
      $headers .= "api-key: " . $this->apiKey . "\r\n";
    }

    // Prepare the body with json_encode, if it's not a string or null, otherwise we keep it as is.
    if ( !empty( $query ) && !is_string( $query ) ) {
      $body = json_encode( $query );
    }
    else {
      $body = $query;
    }

    // If we have form fields, we need to change the headers and the body.
    if ( !empty( $formFields ) ) {
      $boundary = wp_generate_password( 24, false );
      $headers = [
        'Content-Type' => 'multipart/form-data; boundary=' . $boundary
      ];
      if ( $isOpenAI ) {
        $headers['Authorization'] = 'Bearer ' . $this->apiKey;
        if ( $this->organizationId ) {
          $headers['OpenAI-Organization'] = $this->organizationId;
        }
      }
      else if ( $isAzure ) {
        $headers['api-key'] = $this->apiKey;
      }
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

    // Create the URL
    if ( $isOpenAI ) {
      $url = 'https://api.openai.com/v1' . $url;
    }
    else if ( $isAzure ) {
      $url = trailingslashit( $this->env['endpoint'] ) . 'openai' . $url;
      $hasQuery = strpos( $url, '?' ) !== false;
      $url = $url . ( $hasQuery ? '&' : '?' ) . $this->azureApiVersion;
    }

    // If it's a GET, body should be null, and we should append the query to the URL.
    if ( $method === 'GET' ) {
      if ( !empty( $query ) ) {
        $hasQuery = strpos( $url, '?' ) !== false;
        $url = $url . ( $hasQuery ? '&' : '?' ) . http_build_query( $query );
      }
      $body = null;
    }

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
      $service = $this->get_service_name();
      Meow_MWAI_Logging::error( "$service: " . $e->getMessage() );
      throw new Exception( "$service: " . $e->getMessage() );
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
    $models =  apply_filters( 'mwai_openai_models', MWAI_OPENAI_MODELS );
    $finetunes = !empty( $this->env['finetunes'] ) ? $this->env['finetunes'] : [];
    foreach ( $finetunes as $finetune ) {
      if ( $finetune['status'] !== 'succeeded' ) {
        continue;
      }
      $baseModel = SELF::get_model_without_release_date( $finetune['base_model'] );
      if ( !empty( $baseModel ) ) {
        $model = null;
        foreach ( $models as $currentModel ) {
          if ( $currentModel['model'] === $baseModel ) {
            $model = $currentModel;
            break;
          }
        }
        if ( !empty( $model ) ) {
          $model['model'] = $finetune['model'];
          $model['name'] = $finetune['suffix'];
          $models[] = $model;
        }
      }
    }
    return $models;
  }

  static public function get_models_static() {
    return MWAI_OPENAI_MODELS;
  }

  private function calculate_price( $modelFamily, $inUnits, $outUnits, $resolution = null, $finetune = false )
  {
    $modelFamily = SELF::get_model_without_release_date( $modelFamily );
    $models = $this->get_models();
    foreach ( $models as $currentModel ) {
      if ( $currentModel['model'] === $modelFamily ) {
        if ( $currentModel['type'] === 'image' ) {
          if ( !$resolution ) {
            Meow_MWAI_Logging::warn( "(OpenAI) Image models require a resolution." );
            return null;
          }
          else {
            foreach ( $currentModel['resolutions'] as $r ) {
              if ( $r['name'] == $resolution ) {
                return $r['price'] * $outUnits;
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
    Meow_MWAI_Logging::warn( "(OpenAI) Invalid model ($modelFamily)." );
    return null;
  }

  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply )
  {
    $model = $query->model;
    $units = 0;
    $finetune = false;
    if ( is_a( $query, 'Meow_MWAI_Query_Text' ) || is_a( $query, 'Meow_MWAI_Query_Assistant' ) ) {
      if ( preg_match('/^([a-zA-Z]{0,32}):/', $model, $matches ) ) {
        $finetune = true;
      }
      $inUnits = $reply->get_in_tokens( $query );
      $outUnits = $reply->get_out_tokens();
      return $this->calculate_price( $model, $inUnits, $outUnits, null, $finetune );
    }
    else if ( is_a( $query, 'Meow_MWAI_Query_Image' ) || is_a( $query, 'Meow_MWAI_Query_EditImage' ) ) {
      $units = $query->maxResults;
      $resolution = $query->resolution;
      return $this->calculate_price( $model, 0, $units, $resolution, $finetune );
    }
    else if ( is_a( $query, 'Meow_MWAI_Query_Transcribe' ) ) {
      $model = 'whisper';
      $units = $reply->get_units();
      return $this->calculate_price( $model, 0, $units, null, $finetune );
    }
    else if ( is_a( $query, 'Meow_MWAI_Query_Embed' ) ) {
      $units = $reply->get_total_tokens();
      return $this->calculate_price( $model, 0, $units, null, $finetune );
    }
    Meow_MWAI_Logging::warn( "(OpenAI) Cannot calculate price for $model." );
    return null;
  }
}
