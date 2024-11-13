<?php

class Meow_MWAI_Engines_Anthropic extends Meow_MWAI_Engines_OpenAI
{
  // Streaming
  protected $streamInTokens = null;
  protected $streamOutTokens = null;
  protected $streamBlocks;
  protected $streamIsThinking = false;

  public function __construct( $core, $env )
  {
    parent::__construct( $core, $env );
  }

  public function reset_stream() {
    $this->streamContent = null;
    $this->streamBuffer = null;
    $this->streamFunctionCall = null;
    $this->streamToolCalls = [];
    $this->streamLastMessage = null;
    $this->streamInTokens = null;
    $this->streamOutTokens = null;
    $this->streamIsThinking = false;

    $this->streamBlocks = [
      'role' => 'assistant',
      'content' => []
    ];

    $this->inModel = null;
    $this->inId = null;
  }

  protected function set_environment() {
    $env = $this->env;
    $this->apiKey = $env['apikey'];
  }

  protected function build_url( $query, $endpoint = null ) {
    $endpoint = apply_filters( 'mwai_anthropic_endpoint', 'https://api.anthropic.com/v1', $this->env );
    if ( $query instanceof Meow_MWAI_Query_Text || $query instanceof Meow_MWAI_Query_Feedback ) {
      $url = trailingslashit( $endpoint ) . 'messages';
    }
    else {
      throw new Exception( 'AI Engine: Unsupported query type.' );
    }
    return $url;
  }

  protected function build_headers( $query ) {
    parent::build_headers( $query );
    $headers = array(
      'Content-Type' => 'application/json',
      'x-api-key' => $this->apiKey,
      'anthropic-version' => '2023-06-01',
      'anthropic-beta' => 'tools-2024-04-04, pdfs-2024-09-25',
      'User-Agent' => 'AI Engine',
    );
    return $headers;
  }

  public function final_checks( Meow_MWAI_Query_Base $query ) {
    // We skip this completely.
    // maxMessages is handed in build_messages().
  }

  protected function build_messages( $query ) {
    $messages = [];

    // Then, if any, we need to add the 'messages', they are already formatted.
    foreach ( $query->messages as $message ) {
      $messages[] = $message;
    }

    // Handle the maxMessages
    if ( !empty( $query->maxMessages ) ) {
      $messages = array_slice( $messages, -$query->maxMessages );
    }

    // If the first message is not a 'user' role, we remove it.
    if ( !empty( $messages ) && $messages[0]['role'] !== 'user' ) {
      array_shift( $messages );
    }

    if ( $query->attachedFile ) {
      // https://docs.anthropic.com/claude/reference/messages-examples#vision
      // Claude only supports image/jpeg, image/png, image/gif, and image/webp media types.
      $mime = $query->attachedFile->get_mimeType();
      // Claude only supports upload by data (base64), not by URL.
      $data = $query->attachedFile->get_base64();
      $message = $query->get_message();
      $isPDF = $mime === 'application/pdf';
      $isIMG = in_array( $mime, [ 'image/jpeg', 'image/png', 'image/gif', 'image/webp' ] );

      if ( $isPDF ) {
        if ( empty( $message ) ) {
          // Claude doesn't support messages with only PDFs, so we add a text message.
          $message = "I uploaded a PDF. Do not consider this message as part of the conversation.";
        }
        $messages[] = [
          'role' => 'user',
          'content' => [
            [
              "type" => "text",
              "text" => $message
            ],
            [
              "type" => "document",
              "source" => [
                "type" => "base64",
                "media_type" => "application/pdf",
                "data" => $data
              ]
            ]
          ]
        ];
      }
      else if ( $isIMG ) {
        if ( empty( $message ) ) {
          // Claude doesn't support messages with only images, so we add a text message.
          $message = "I uploaded an image. Do not consider this message as part of the conversation.";
        }
        $messages[] = [ 
          'role' => 'user',
          'content' => [
            [
              "type" => "text",
              "text" => $message
            ],
            [
              "type" => "image",
              "source" => [
                "type" => "base64",
                "media_type" => $mime,
                "data" => $data
              ]
            ]
          ]
        ];
      }
    }
    else {
      $messages[] = [ 'role' => 'user', 'content' => $query->get_message() ];
    }

    return $messages;
  }

  // Define a function to recursively replace empty arrays with empty stdClass objects
  // To avoid errors with OpenAI's API
  private function replaceEmptyArrayWithObject( $item ) {
    if ( is_array( $item ) ) {
      if ( empty( $item ) ) {
        return new stdClass(); // Replace empty array with empty object
      }
      foreach ( $item as $key => $value ) {
        $item[$key] = $this->replaceEmptyArrayWithObject( $value ); // Recurse
      }
    }
    return $item;
  }

  protected function build_body( $query, $streamCallback = null, $extra = null ) {
    if ( $query instanceof Meow_MWAI_Query_Feedback ) {
      $body = array(
        "model" => $query->model,
        "max_tokens" => $query->maxTokens,
        "temperature" => $query->temperature,
        "stream" => !is_null( $streamCallback ),
        "messages" => []
      );

      if ( !empty( $query->instructions ) ) {
        $body['system'] = $query->instructions;
      }

      // Build the messages
      $body['messages'][] = [ 'role' => 'user', 'content' => $query->message ];

      if ( !empty( $query->blocks ) ) {
        foreach ( $query->blocks as $feedback_block ) {
          $contentBlock = $feedback_block['rawMessage']['content'];
          $assistantMessageIndex = count($body['messages']);
          $body['messages'][] = [
            'role' => 'assistant',
            'content' => $contentBlock
          ];
          
          foreach ( $feedback_block['feedbacks'] as $feedback ) {
            $feedbackValue = $feedback['reply']['value'];
            if ( !is_string( $feedbackValue ) ) {
              $feedbackValue = json_encode( $feedbackValue );
            }

            // Check for the tool_use message and make sure input is not null.
            foreach ( $body['messages'][$assistantMessageIndex]['content'] as &$message ) {
              if ( $message['type'] === 'tool_use' && $message['id'] === $feedback['request']['toolId'] ) {
                if ( empty( $message['input'] ) ) {
                  $message['input'] = new stdClass();
                }
                break;
              }
            }
            unset( $message );

            // Add a new message with tool_result if tool_use.
            $body['messages'][] = [
              'role' => 'user',
              'content' => [
                [
                  'type' => 'tool_result',
                  'tool_use_id' => $feedback['request']['toolId'],
                  'content' => $feedbackValue,
                  'is_error' => false // Cool, Anthropic supports errors!
                ]
              ]
            ];
          }
        }
      }

      // TODO: This WAS COPIED FROM BELOW
      // Support for functions
      if ( !empty( $query->functions ) ) {
        $model = $this->retrieve_model_info( $query->model );
        if ( !empty( $model['tags'] ) && !in_array( 'functions', $model['tags'] ) ) {
          Meow_MWAI_Logging::warn( 'The model "' . $query->model . '" doesn\'t support Function Calling.' );
        }
        else {
          $body['tools'] = [];
          // Dynamic function: they will interactively enhance the completion (tools).
          foreach ( $query->functions as $function ) {
            $body['tools'][] = $function->serializeForAnthropic();
          }
          // Static functions: they will be executed at the end of the completion.
          //$body['function_call'] = $query->functionCall;
        }
      }

      // To avoid errors with Anthropic's API, we need to replace empty arrays with empty objects
      $body = $this->replaceEmptyArrayWithObject( $body );
      return $body;
    }
    else if ( $query instanceof Meow_MWAI_Query_Text ) {
      $body = array(
        "model" => $query->model,
        "stream" => !is_null( $streamCallback ),
      );

      if ( !empty( $query->maxTokens ) ) {
        $body['max_tokens'] = $query->maxTokens;
      }
      else {
        // https://docs.anthropic.com/en/docs/about-claude/models#model-comparison-table
        $body['max_tokens'] = 4096;
      }

      if ( !empty( $query->temperature ) ) {
        $body['temperature'] = $query->temperature;
      }
  
      if ( !empty( $query->stop ) ) {
        $body['stop'] = $query->stop;
      }

      // First, we need to add the first message (the instructions).
      if ( !empty( $query->instructions ) ) {
        $body['system'] = $query->instructions;
      }

      // If there is a context, we need to add it.
      if ( !empty( $query->context ) ) {
        if ( empty( $body['system'] ) ) {
          $body['system'] = "";
        }
        $body['system'] = empty( $body['system'] ) ? '' : $body['system'] . "\n\n";
        $body['system'] = $body['system'] . "Context:\n\n" . $query->context;
      }

      // Support for functions
      if ( !empty( $query->functions ) ) {
        $model = $this->retrieve_model_info( $query->model );
        if ( !empty( $model['tags'] ) && !in_array( 'functions', $model['tags'] ) ) {
          Meow_MWAI_Logging::warn( 'The model "' . $query->model . '" doesn\'t support Function Calling.' );
        }
        else {
          $body['tools'] = [];
          // Dynamic function: they will interactively enhance the completion (tools).
          foreach ( $query->functions as $function ) {
            $body['tools'][] = $function->serializeForAnthropic();
          }
          // Static functions: they will be executed at the end of the completion.
          //$body['function_call'] = $query->functionCall;
        }
      }

      $body['messages'] = $this->build_messages( $query );
      return $body;
    }
    else {
      throw new Exception( 'AI Engine: Unsupported query type.' );
    }
  }

  protected function stream_data_handler( $json ) {
    $content = null;
    $type = !empty( $json['type'] ) ? $json['type'] : null;
    if ( is_null( $type ) ) {
      return $content;
    }

    if ( $type === 'message_start' ) {
      $usage = $json['message']['usage'];
      $this->streamInTokens = $usage['input_tokens'];
      $this->inModel = $json['message']['model'];
      $this->inId = $json['message']['id'];
    }
    else if ( $type === 'content_block_start' ) {
      $this->streamBlocks['content'][] = $json['content_block'];
    }
    else if ( $type === 'content_block_delta' ) { 
      $index = $json['index'];
      $block = $this->streamBlocks['content'][$index];
      if ( $json['delta']['type'] === 'text_delta' ) { 
        $block['text'] .= $json['delta']['text'];
        if ( strpos( $block['text'], '<thinking' ) === 0 ) {
          $this->streamIsThinking = true;
        }
        if ( strpos( $block['text'], '</thinking>' ) === 0 ) {
          $this->streamIsThinking = false;
        }
        $content = $json['delta']['text'];
      }
      else if ( $json['delta']['type'] === 'input_json_delta' ) {
        // Somehow, the input is set as an array, but it should be a string since it's JSON.
        $block['input'] = is_array( $block['input'] ) ? "" : $block['input'];
        $block['input'] .= $json['delta']['partial_json'];
      }
      $this->streamBlocks['content'][$index] = $block;
    }
    // At the end of a block, let's look for any 'input' not yet decoded from JSON
    else if ( $type === 'content_block_stop' ) {
      $index = $json['index'];
      $block = $this->streamBlocks['content'][$index];
      if ( isset( $block['input'] ) && is_string( $block['input'] ) ) {
        $block['input'] = json_decode( $block['input'], true );
      }
      $this->streamBlocks['content'][$index] = $block;
    }
    else if ( $type === 'message_delta' ) {
      $usage = $json['usage'];
      $this->streamOutTokens = $usage['output_tokens'];
    }
    else if ( $type === 'error' ) {
      $error = $json['error'];
      $message = $error['message'];
      throw new Exception( $message );
    }

    // Avoid some endings
    $endings = [ "<|im_end|>", "</s>" ];
    if ( in_array( $content, $endings ) ) {
      $content = null;
    }

    // If the stream is thinking, we don't want to return anything yet.
    if ( $this->streamIsThinking ) {
      $content = null;
    }

    return ( $content === '0' || !empty( $content ) ) ? $content : null;
  }

  // This create the "choices" (even though, often, it is only one choice).
  // It is basically the reply, but one that is understood by the Meow_MWAI_Reply class.
  public function create_choices( $data ) {
    $returned_choices = [];
    foreach ( $data['content'] as $content ) {
      if ( $content['type'] === 'tool_use' ) {
        $returned_choices[] = [ 
          'message' => [ 
            'tool_calls' => [
              [
                'id' => $content['id'],
                'type' => 'function',
                'function' => [
                  'name' => $content['name'],
                  'arguments' => empty( $content['input'] ) ? new stdClass() : $content['input'],
                ]
              ]
            
            ]
          ]
        ];
      }
      else if ( $content['type'] === 'text' ) {
        $returned_choices[] = [ 
          'message' => [ 
            'content' => $content['text']
          ]
        ];
      }
    }
    return $returned_choices;
  }

  public function run_completion_query( $query, $streamCallback = null ) : Meow_MWAI_Reply {
    $isStreaming = !is_null( $streamCallback );

    if ( $isStreaming ) {
      $this->streamCallback = $streamCallback;
      add_action( 'http_api_curl', [ $this, 'stream_handler' ], 10, 3 );
    }

    $this->reset_stream();
    $data = null;
    $body = $this->build_body( $query, $streamCallback );
    $url = $this->build_url( $query );
    $headers = $this->build_headers( $query );
    $options = $this->build_options( $headers, $body );

    try {
      $res = $this->run_query( $url, $options, $streamCallback );
      $reply = new Meow_MWAI_Reply( $query );
      $returned_id = null;
      $returned_model = null;
      $returned_choices = [];

      // Streaming Mode
      if ( $isStreaming ) {
        $returned_id = $this->inId;
        $returned_model = $this->inModel ? $this->inModel : $query->model;
        if ( !is_null( $this->streamInTokens && !is_null( $this->streamOutTokens ) ) ) {
          $returned_in_tokens = $this->streamInTokens;
          $returned_out_tokens = $this->streamOutTokens;
        }
        $data = $this->streamBlocks;
        $returned_choices = $this->create_choices( $this->streamBlocks );
      }
      // Standard Mode
      else {
        $data = $res['data'];
        $returned_id = $data['id'];
        $returned_model = $data['model'];
        $usage = $data['usage'];
        if ( !empty( $usage ) ) {
          $returned_in_tokens = isset( $usage['input_tokens'] ) ? $usage['input_tokens'] : null;
          $returned_out_tokens = isset( $usage['output_tokens'] ) ? $usage['output_tokens'] : null;
        }
        $returned_choices = $this->create_choices( $data );
      }
      
      $reply->set_choices( $returned_choices, $data );
      if ( !empty( $returned_id ) ) {
        $reply->set_id( $returned_id );
      }

      // Handle tokens.
      $this->handle_tokens_usage( $reply, $query, $returned_model,
        $returned_in_tokens, $returned_out_tokens
      );

      return $reply;
    }
    catch ( Exception $e ) {
      $error = $e->getMessage();
      $json = json_decode( $error, true );
      if ( json_last_error() === JSON_ERROR_NONE ) {
        if ( isset( $json['error'] ) && isset( $json['error']['message'] ) ) {
          $error = $json['error']['message'];
        }
      }
      Meow_MWAI_Logging::error( "(Anthropic) " . $error );
      $service = $this->get_service_name();
      $message = "From $service: " . $error;
      throw new Exception( $message );
    }
    finally {
      if ( $isStreaming ) {
        remove_action( 'http_api_curl', [ $this, 'stream_handler' ] );
      }
    }
  }

  protected function get_service_name() {
    return "Anthropic";
  }

  public function get_models() {
    return apply_filters( 'mwai_anthropic_models', MWAI_ANTHROPIC_MODELS );
  }

  static public function get_models_static() {
    return MWAI_ANTHROPIC_MODELS;
  }

  public function handle_tokens_usage( $reply, $query, $returned_model,
    $returned_in_tokens, $returned_out_tokens, $returned_price = null ) {
    $returned_in_tokens = !is_null( $returned_in_tokens ) ?
      $returned_in_tokens : $reply->get_in_tokens( $query );
    $returned_out_tokens = !is_null( $returned_out_tokens ) ?
      $returned_out_tokens : $reply->get_out_tokens();
    if ( !empty( $reply->id ) ) {
      // Would be cool to retrieve the usage from the API, but it's not possible.
    }
    $usage = $this->core->record_tokens_usage( $returned_model, $returned_in_tokens, $returned_out_tokens );
    $reply->set_usage( $usage );
  }

  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply ) {
    return parent::get_price( $query, $reply );
  }
}