<?php

class Meow_MWAI_Engines_Core {
  protected $core = null;
  public $env = null;
  public $envId = null;
  public $envType = null;

  // Streaming
  protected $streamCallback = null;
  protected $streamTemporaryBuffer = "";
  protected $streamBuffer = "";
  protected $streamHeaders = [];
  protected $streamContent = "";

  public function __construct( $core, $env ) {
    $this->core = $core;
    $this->env = $env;
    $this->envId = $env['id'];
    $this->envType = $env['type'];
  }

  public function run( $query, $streamCallback = null, $maxDepth = 5 ) {

    // Check if the query is allowed.
    $limits = $this->core->get_option( 'limits' );
    $allowed = apply_filters( 'mwai_ai_allowed', true, $query, $limits );
    if ( $allowed !== true ) {
      $message = is_string( $allowed ) ? $allowed : 'Unauthorized query.';
      throw new Exception( $message );
    }

    // Allow to modify the query before it is sent. It should not be a Meow_MWAI_Query_Embed.
    if ( !( $query instanceof Meow_MWAI_Query_Embed ) ) {
      $query = apply_filters( 'mwai_ai_query', $query );
    }

    // Important as it makes sure everything is consolidated in the query and the engine.
    $this->final_checks( $query );

    // Run the query
    $reply = null;
    if ( $query instanceof Meow_MWAI_Query_Text || $query instanceof Meow_MWAI_Query_Feedback ) {
      $reply = $this->run_completion_query( $query, $streamCallback );
    }
    else if ( $query instanceof Meow_MWAI_Query_Assistant ) {
      $reply = $this->run_assistant_query( $query, $streamCallback );
      // TODO: This filter is useless with Assistants v2
      $reply = apply_filters( 'mwai_ai_query_assistant', $reply, $query );
      if ( $reply === null ) {
        throw new Exception( 'Assistants are not supported in this version of AI Engine.' );
      }
    }
    else if ( $query instanceof Meow_MWAI_Query_Embed ) {
      $reply = $this->run_embedding_query( $query );
    }
    else if ( $query instanceof Meow_MWAI_Query_Image ) {
      $reply = $this->run_images_query( $query );
    }
    else if ( $query instanceof Meow_MWAI_Query_Transcribe ) {
      $reply = $this->run_transcribe_query( $query );
    }
    else {
      throw new Exception( 'Unknown query type.' );
    }

    // Allow to modify the reply before it is sent.
    $reply = apply_filters( 'mwai_ai_reply', $reply, $query );

    // Function Call
    if ( !empty( $reply->needFeedbacks ) ) {

      // Check if we reached the maximum depth
      if ( $maxDepth <= 0 ) {
        throw new Exception( 'AI Engine: There seems to be a loop in the function/tools calls.' );
      }

      // We should use a feedback query around the original query
      if ( !($query instanceof Meow_MWAI_Query_Feedback) ) {
        $query = new Meow_MWAI_Query_Feedback( $reply, $query );
      }

      // The engine for the model will handle the feedback query nicely
      // In the case of Anthropic, it's like a "discussion" between the user (= WordPress's AI Engine
      // and the model (= Anthropic). The feedback is a way to communicate between the two.
      $feedback_blocks = [];
      foreach ( $reply->needFeedbacks as $needFeedback ) {
        $rawMessageKey = md5( serialize( $needFeedback['rawMessage'] ) );

        // Initialize the feedback block for this rawMessage if it hasn't been initialized yet
        if ( !isset( $feedback_blocks[$rawMessageKey] ) ) {
          $feedback_blocks[$rawMessageKey] = [ 
            'rawMessage' => $needFeedback['rawMessage'],
            'feedbacks' => []
          ];
        }

        // Get the value related to this feedback (usually, a function call)
        $value = apply_filters( 'mwai_ai_feedback', null, $needFeedback );

        // Add the feedback information to the appropriate feedback block
        $feedback_blocks[$rawMessageKey]['feedbacks'][] = [ 
          'request' => $needFeedback, // TODO: Meow_MWAI_Feedback_Request
          'reply' => [ 'value' => $value ] // TODO: Meow_MWAI_Feedback_Reply
        ];
      }

      foreach ( $feedback_blocks as $feedback_block ) {
        $query->add_feedback_block( $feedback_block );
      }

      // Run the feedback query
      $reply = $this->run( $query, $streamCallback, $maxDepth - 1 );
    } 

    return $reply;
  }

  public function retrieve_model_info( $model ) {
    $models = $this->get_models();
    foreach ( $models as $currentModel ) {
      if ( $currentModel['model'] === $model ) {
        return $currentModel;
      }
    }
    return false;
  }

  public function final_checks( Meow_MWAI_Query_Base $query ) {
    $query->final_checks();
    //$found = false;

     // Check if the model is available, except if it's an assistant
    if ( !( $query instanceof Meow_MWAI_Query_Assistant ) ) {
      // TODO: Avoid checking on the finetuned models for now.
      if ( substr( $query->model, 0, 3 ) === 'ft:' ) {
        return;
      }
      $model_info = $this->retrieve_model_info( $query->model );
      if ( $model_info === false ) {
        throw new Exception( "AI Engine: The model '{$query->model}' is not available." );
      }
      if ( isset( $model_info['mode'] ) ) {
        $query->mode = $model_info['mode'];
      }
    }
  }

  // Streamline the messages:
  // - Concatenate consecutive model messages into a single message for the model role
  // - Make sure the first message is a user message
  // - Make sure the last message is a user message
  protected function streamline_messages( $messages, $systemRole = 'assistant', $messageType = 'content' )
  {
    $processedMessages = [];
    $lastRole = '';
    $concatenatedText = '';

    // Determine the way to access message content based on messageType
    $getContent = function( $message ) use ( $messageType ) {
      if ( $messageType == 'parts' ) {
        return $message['parts'][0]['text'];
      }
      else { // Default to 'content'
        return $message['content'];
      }
    };

    // Set content to a message depending on the messageType
    $setContent = function( &$message, $content ) use ( $messageType ) {
      if ( $messageType == 'parts' ) {
        $message['parts'] = [['text' => $content]];
      }
      else { // Default to 'content'
        $message['content'] = $content;
      }
    };

    // Concatenate consecutive model messages into a single message for the model role
    foreach ( $messages as $message ) {
      if ( $message['role'] == $systemRole ) {
        if ( $lastRole == $systemRole ) {
          $concatenatedText .= "\n" . $getContent( $message );
        }
        else {
          if ( $concatenatedText !== '' ) {
            $newMessage = [ 'role' => $systemRole ];
            $setContent( $newMessage, $concatenatedText );
            $processedMessages[] = $newMessage;
          }
          $concatenatedText = $getContent( $message );
        }
      }
      else {
        if ( $lastRole == $systemRole ) {
            $newMessage = [ 'role' => $systemRole ];
            $setContent( $newMessage, $concatenatedText );
            $processedMessages[] = $newMessage;
            $concatenatedText = '';
        }
        $processedMessages[] = $message;
      }
      $lastRole = $message['role'];
    }
    if ( $lastRole == $systemRole && $concatenatedText !== '' ) {
      $newMessage = [ 'role' => $systemRole ];
      $setContent( $newMessage, $concatenatedText );
      $processedMessages[] = $newMessage;
    }

    // Make sure the last message is a user message, if not, throw an exception
    if ( end( $processedMessages )['role'] !== 'user' ) {
      throw new Exception( 'The last message must be a user message.' );
    }

    // Make sure the first message is a user message, if not, add an empty user message
    if ( $processedMessages[0]['role'] !== 'user' ) {
      $newMessage = [ 'role' => 'user' ];
      $setContent( $newMessage, '' );
      array_unshift( $processedMessages, $newMessage );
    }

    return $processedMessages;
  }

  // Check for a JSON-formatted error in the data, and throw an exception if it's the case.
  function stream_error_check( $data ) {
    if ( strpos( $data, 'error' ) === false ) {
      return;
    }
    $data = trim( $data );
    $jsonPart = $data;
    if ( strpos( $jsonPart, 'data:' ) === 0 ) {
      $jsonPart = trim( substr( $jsonPart, strlen( 'data:' ) ) );
    }
    $json = json_decode( $jsonPart, true );
    if ( json_last_error() === JSON_ERROR_NONE ) {
      if ( isset( $json['error'] ) ) {
        $error = $json['error'];
        $code = null;
        $type = null;
        $message = null;
        if ( isset( $error['message'] ) ) {
          $message = $error['message'];
        }
        else if ( is_string( $error ) ) {
          throw new Exception( "Error: $error" );
        }
        else {
          throw new Exception( "Unknown error (stream_error_check)." );
        }
        if ( isset( $error['code'] ) ) {
          $code = $error['code'];
        }
        if ( isset( $error['type'] ) ) {
          $type = $error['type'];
        }
        $errorMessage = "Error: $message";
        if ( !is_null( $code ) ) {
          $errorMessage .= " ($code)";
        }
        if ( !is_null( $type ) ) {
          $errorMessage .= " ($type)";
        }
        throw new Exception( $errorMessage );
      }
      else if ( isset( $json['type'] ) && $json['type'] === 'error' ) {
        $type = $json['error']['type'];
        $message = $json['error']['message'];
        throw new Exception( "Error: $message ($type)" );
      }
    }
  }

  public function stream_handler( $handle, $args, $url ) {
    curl_setopt( $handle, CURLOPT_SSL_VERIFYPEER, false );
    curl_setopt( $handle, CURLOPT_SSL_VERIFYHOST, false );

    // TODO: This is breaking the response. We need to find a way to handle the headers.
    // curl_setopt( $handle, CURLOPT_HEADERFUNCTION, function ( $curl, $header ) {
    //   $length = strlen( $header );
    //   $this->streamHeaders[] = $header;
    //   $this->stream_header_handler( $header );
    //   return $length;
    // });

    curl_setopt( $handle, CURLOPT_WRITEFUNCTION, function ( $curl, $data ) {
      $length = strlen( $data );

      // Error Management
      $this->stream_error_check( $data );

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
        if ( $line === "" ) { continue; }
        if ( strpos( $line, 'data:' ) === 0 ) {
          $line = trim( substr( $line, 5 ) );
          $json = json_decode( trim( $line ), true );

          if ( json_last_error() === JSON_ERROR_NONE ) {
            $content = $this->stream_data_handler( $json );
            if ( !is_null( $content ) ) {
              $this->streamContent .= $content;
              call_user_func( $this->streamCallback, $content );
            }
          }
          else if ( $line !== '[DONE]' && !empty( $line ) ) {
            $this->streamTemporaryBuffer .= $line . "\n";
          }
        }
      }
      return $length;
    });
  }

  protected function stream_header_handler( $header ) {
    
  }

  protected function stream_data_handler( $json ) {
    throw new Exception( 'Not implemented.' );
  }

  public function get_models() {
    throw new Exception( 'Not implemented.' );
  }

  public function retrieve_models() {
    throw new Exception( 'Not implemented.' );
  }

  public function run_completion_query( Meow_MWAI_Query_Base $query, $streamCallback = null ) : Meow_MWAI_Reply {
    throw new Exception( 'Not implemented.' );
  }

  public function run_assistant_query( Meow_MWAI_Query_Assistant $query, $streamCallback = null ) : Meow_MWAI_Reply {
    throw new Exception( 'Not implemented, or not supported in this version of AI Engine.' );
  }

  public function run_embedding_query( Meow_MWAI_Query_Base $query ) {
    throw new Exception( 'Not implemented.' );
  }

  public function run_images_query( Meow_MWAI_Query_Base $query ) {
    throw new Exception( 'Not implemented.' );
  }

  public function run_transcribe_query( Meow_MWAI_Query_Base $query ) {
    throw new Exception( 'Not implemented.' );
  }

  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply ) {
    throw new Exception( 'Not implemented.' );
  }
}
