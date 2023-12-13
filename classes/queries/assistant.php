<?php

class Meow_MWAI_Query_Assistant extends Meow_MWAI_Query_Base implements JsonSerializable {
  public array $messages = [];
  public ?string $newMessage = null;
  public ?string $newImage = null;
  public ?string $newImageData = null;
  public ?string $responseFormat = null;
  public ?int $promptTokens = null;
  public ?int $completionTokens = null;

  public ?string $chatId = null;
  public ?string $assistantId = null;
  public ?string $threadId = null;
  
  public function __construct( ?string $prompt = '' ) {
    parent::__construct( $prompt );
    $this->mode = "assistant"; 
  }

  #[\ReturnTypeWillChange]
  public function jsonSerialize() {
    return [
      'class' => get_class( $this ),
      'newMessage' => $this->newMessage,
      'newImage' => $this->newImage,
      'model' => $this->model,
      'session' => $this->session,
      'env' => $this->env,
      'envId' => $this->envId,
      'chatId' => $this->chatId,
      'assistantId' => $this->assistantId,
      'threadId' => $this->threadId,
      'service' => $this->service,
    ];
  }

  public function get_prompt_tokens( $refresh = false ): int {
    if ( $this->promptTokens && !$refresh ) {
      return $this->promptTokens;
    }
    $this->promptTokens = Meow_MWAI_Core::estimate_tokens( $this->messages );
    return $this->promptTokens;
  }

  public function get_last_prompt(): string {
    if ( empty( $this->messages ) ) {
      return $this->prompt;
    }
    $last = $this->get_last_message();
    return $last;
  }

  /**
   * Given a prompt, the model will return one or more predicted completions.
   * It can also return the probabilities of alternative tokens at each position.
   * @param string $prompt The prompt to generate completions.
   */
  public function set_prompt( $prompt ) {
    parent::set_prompt( $prompt );
    $this->validate_messages();
  }

  /**
   * The type of return expected from the API. It can be either null or "json".
   * @param int $maxResults The maximum number of completions.
   */
  public function set_response_format( $responseFormat ) {
    if ( !empty( $responseFormat ) && $responseFormat !== 'json' ) {
      throw new Exception( "AI Engine: The response format can only be null or json." );
    }
    $this->responseFormat = $responseFormat;
  }

  /**
   * The prompt is used by models who uses Text Completion (and not Chat Completion).
   * This returns the prompt if it's not a chat, otherwise it will build a prompt with
   * all the messages nicely formatted.
   */
  public function get_prompt(): ?string {
    // In the case it's really just a prompt.
    if ( count( $this->messages ) === 1 ) {
      $first = reset( $this->messages );
      return $first['content'];
    }
    
    // In the case it's a chat that we need to convert into a prompt.
    $first = reset( $this->messages );
    $prompt = "";
    if ( $first && $first['role'] === 'system' ) {
      $prompt = $first['content'] . "\n\n";
    }

    // Standard Completion
    while ( $message = next( $this->messages ) ) {
      $role = $message['role'];
      $content = $message['content'];
      if ( $role === 'system' ) {
        $prompt .= "$content\n\n";
      }
      if ( $role === 'user' ) {
        $prompt .= "User: $content\n";
      }
      if ( $role === 'assistant' ) {
        $prompt .= "AI: $content\n";
      }
    }
    $prompt .= "AI: ";
    return $prompt;
  }

  /**
   * Similar to the prompt, but focus on the new/last message.
   * Only used when the model has a chat mode (and only used in messages).
   * @param string $prompt The messages to generate completions.
   */
  public function set_new_message( string $newMessage ): void {
    $this->newMessage = $newMessage;
    $this->validate_messages();
  }

  public function set_new_image( string $newImage ): void {
    $this->newImage = $newImage;
    $this->validate_messages();
  }

  public function set_new_image_data( string $newImageData ): void {
    $this->newImageData = $newImageData;
    $this->validate_messages();
  }

  public function setAssistantId( string $assistantId ): void {
    $this->assistantId = $assistantId;
  }

  public function setChatId( string $chatId ): void {
    $this->chatId = $chatId;
  }

  public function setThreadId( string $threadId ): void {
    $this->threadId = $threadId;
  }

  public function replace( $search, $replace ) {
    $this->prompt = str_replace( $search, $replace, $this->prompt );
    $this->validate_messages();
  }

  /**
   * Similar to the prompt, but use an array of messages instead.
   * @param string $prompt The messages to generate completions.
   */
  public function set_messages( array $messages ) {
    return;
    $messages = array_map( function( $message ) {
      if ( is_array( $message ) ) {
        return [ 'role' => $message['role'], 'content' => $message['content'] ];
      }
      else if ( is_object( $message ) ) {
        return [ 'role' => $message->role, 'content' => $message->content ];
      }
      else {
        throw new InvalidArgumentException( 'Unsupported message type.' );
      }
    }, $messages );
    $this->messages = $messages;
    $this->validate_messages();
  }

  public function get_last_message() {
    if ( !empty( $this->messages ) ) {
      $lastMessageIndex = count( $this->messages ) - 1;
      $lastMessage = $this->messages[$lastMessageIndex];
      if ( is_array( $lastMessage['content'] ) ) {
        foreach( $lastMessage['content'] as $message ) {
          if ( $message['type'] === 'text' ) {
            return $message['text'];
          }
        }
      }
      else {
        return $lastMessage['content'];
      }
    }
    return null;
  }

  // Function that adds a message just before the last message
  public function inject_context( string $content ): void {
    if ( !empty( $this->messages ) ) {
      $lastMessageIndex = count( $this->messages ) - 1;
      $lastMessage = $this->messages[$lastMessageIndex];
      $this->messages[$lastMessageIndex] = [ 'role' => 'system', 'content' => $content ];
      array_push( $this->messages, $lastMessage );
    }
    $this->validate_messages();
  }

  private function getImageURL( $image ) {
    if ( !empty( $this->newImage ) ) {
      return $this->newImage;
    }
    if ( !empty( $this->newImageData ) ) {
      return "data:image/jpeg;base64,{$this->newImageData}";
    }
  }

  private function validate_messages(): void {
    // Messages should end with either the prompt or, if exists, the newMessage.
    $message = empty( $this->newMessage ) ? $this->prompt : $this->newMessage;
    $content = $message;

    // If there is an image, we need to adapt it to Vision.
    $imageURL = $this->getImageURL( $this->newImage );
    if ( !empty( $imageURL ) ) {
      $content = [
        [ "type" => "text", "text" => $message ],
        [ "type" => "image_url", "image_url" => [ "url" => $imageURL ] ]
      ];
    }

    if ( empty( $this->messages ) ) {
      $this->messages = [ [ 'role' => 'user', 'content' => $content ] ];
    }
    else {
      $last = &$this->messages[ count( $this->messages ) - 1 ];
      if ( $last['role'] === 'user' ) {
          $last['content'] = $content;
      }
      else {
        array_push( $this->messages, [ 'role' => 'user', 'content' => $content ] );
      }
    }
  }

  // Based on the params of the query, update the attributes
  public function inject_params( array $params ): void
  {
    // Those are for the keys passed directly by the shortcode.
    $params = $this->convert_keys( $params );

    if ( !empty( $params['model'] ) ) {
			$this->set_model( $params['model'] );
		}
    if ( !empty( $params['prompt'] ) ) {
      $this->set_prompt( $params['prompt'] );
    }
    if ( !empty( $params['messages'] ) ) {
      $this->set_messages( $params['messages'] );
    }
    if ( !empty( $params['newMessage'] ) ) {
      $this->set_new_message( $params['newMessage'] );
    }
    if ( !empty( $params['maxResults'] ) ) {
			$this->set_max_results( $params['maxResults'] );
		}
		if ( !empty( $params['env'] ) ) {
			$this->set_env( $params['env'] );
		}
		if ( !empty( $params['session'] ) ) {
			$this->set_session( $params['session'] );
		}
    // Should add the params related to Open AI and Azure
    if ( !empty( $params['service'] ) ) {
			$this->set_service( $params['service'] );
		}
    if ( !empty( $params['apiKey'] ) ) {
			$this->set_api_key( $params['apiKey'] );
		}
    if ( !empty( $params['botId'] ) ) {
      $this->set_bot_id( $params['botId'] );
    }
    if ( !empty( $params['envId'] ) ) {
      $this->set_env_id( $params['envId'] );
    }
    if ( !empty( $params['chatId'] ) ) {
      $this->setChatId( $params['chatId'] );
    }
    if ( !empty( $params['assistantId'] ) ) {
      $this->setAssistantId( $params['assistantId'] );
    }
    if ( !empty( $params['threadId'] ) ) {
      $this->setThreadId( $params['threadId'] );
    }
    if ( !empty( $params['responseFormat'] ) ) {
      $this->set_response_format( $params['responseFormat'] );
    }
  }
}