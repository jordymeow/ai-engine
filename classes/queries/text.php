<?php

class Meow_MWAI_Query_Text extends Meow_MWAI_Query_Base implements JsonSerializable {
  public int $maxTokens = 1024;
  public float $temperature = 0.8;
  public int $maxSentences = 15;
  public ?string $stop = null;
  public array $messages = [];
  public ?string $context = null;
  public ?string $newMessage = null;
  public ?string $newImage = null;
  public ?string $newImageData = null;
  public ?string $promptEnding = null;
  public bool $casuallyFineTuned = false;
  public ?string $responseFormat = null;
  public ?int $promptTokens = null;
  
  public function __construct( ?string $prompt = '', int $maxTokens = 1024,
    string $model = MWAI_FALLBACK_MODEL ) {
    parent::__construct( $prompt );
    $this->setModel( $model );
    $this->setMaxTokens( $maxTokens );
  }

  #[\ReturnTypeWillChange]
  public function jsonSerialize() {
    return [
      'class' => get_class( $this ),
      'prompt' => $this->prompt,
      'messages' => $this->messages,
      'maxTokens' => $this->maxTokens,
      'temperature' => $this->temperature,
      'maxSentences' => $this->maxSentences,
      'context' => $this->context,
      'newMessage' => $this->newMessage,
      'newImage' => $this->newImage,
      'model' => $this->model,
      'mode' => $this->mode,
      'session' => $this->session,
      'env' => $this->env,
      'envId' => $this->envId,
      'service' => $this->service,
      'promptEnding' => $this->promptEnding,
      'stop' => $this->stop,
      'casuallyFineTuned' => $this->casuallyFineTuned,
    ];
  }

  public function getPromptTokens( $refresh = false ): int {
    if ( $this->promptTokens && !$refresh ) {
      return $this->promptTokens;
    }
    $this->promptTokens = Meow_MWAI_Core::estimate_tokens( $this->messages );
    return $this->promptTokens;
  }

  public function getLastPrompt(): string {
    if ( empty( $this->messages ) ) {
      return $this->prompt;
    }
    $last = $this->getLastMessage();
    return $last;
  }

  /**
   * Make sure the maxTokens is not greater than the model's context length.
   */
  public function finalChecks() {
    if ( empty( $this->model )  ) { return; }

    // Make sure the number of messages is not too great.
    if ( !empty( $this->maxSentences ) ) {
      $context = array_shift( $this->messages );
      if ( !empty( $this->messages ) ) {
        $this->messages = array_slice( $this->messages, -$this->maxSentences );
      }
      else {
        $this->messages = [];
      }
      if ( !empty( $context ) ) {
        array_unshift( $this->messages, $context );
      }

      // NOTE: If nobody complains about this, we can probably get rid of everything
      // related to the casuallyFineTuned. This was added on November 13th, 2023.
      if ( $this->casuallyFineTuned ) {
        error_log( 'AI Engine: The casuallyFineTuned parameter is deprecated.' );
      }
    }

    // NOTE: Removed the checks related to the MaxTokens (as of November 8th)
    // Let's see if we can remove this completely.

    // Make sure the max tokens are respected.
    // $realMax = 4096;
    // $finetuneFamily = preg_match('/^([a-zA-Z]{0,32}):/', $this->model, $matches );
    // $finetuneFamily = ( isset( $matches ) && count( $matches ) > 0 ) ? $matches[1] : 'N/A';
    // $foundModel = null;
    // $openai_models = Meow_MWAI_Engines_OpenAI::get_openai_models();
    // foreach ( $openai_models as $currentModel ) {
    //   if ( $currentModel['model'] === $this->model || $currentModel['family'] === $finetuneFamily ) {
    //     $foundModel = $currentModel['name'];
    //     $realMax = $currentModel['maxTokens'];
    //     break;
    //   }
    // }

    // $estimatedTokens = $this->getPromptTokens();
    // if ( !empty( $realMax ) && $estimatedTokens > $realMax ) {
    //   throw new Exception( "AI Engine: The prompt is too long! It contains about $estimatedTokens tokens (estimation). The $foundModel model only accepts a maximum of $realMax tokens. " );
    // }
    // $realMax = (int)($realMax - $estimatedTokens) - 16;
    // if ( $this->maxTokens > $realMax ) {
    //   $this->maxTokens = $realMax;
    // }
  }

  /**
   * ID of the model to use.
   * @param string $model ID of the model to use.
   */
  public function setModel( string $model ) {
    $this->model = $model;
    $this->mode = 'completion';
    $found = false;
    $openai_models = Meow_MWAI_Engines_OpenAI::get_openai_models();
    foreach ( $openai_models as $currentModel ) {
      if ( $currentModel['model'] === $this->model ) {
        if ( $currentModel['mode'] ) {
          $this->mode = $currentModel['mode'];
        }
        $found = true;
        break;
      }
    }
    if ( !$found ) {
      // If the model can't be found, it's because it's probably a fine-tuned model. In the past (before August 2023),
      // fine-tuned models were always based on GPT-3 (and therefore, using completion mode). From now on, they can be
      // based on GPT-3.5 or 4 (and therefore, using chat mode). We need to detect that.
      $baseModel = Meow_MWAI_Engines_OpenAI::get_finetune_base_model( $model );
      if ( preg_match( '/^gpt-3.5|^gpt-4/', $baseModel ) ) {
        $this->mode = 'chat';
      }
    }
  }

  /**
   * Given a prompt, the model will return one or more predicted completions.
   * It can also return the probabilities of alternative tokens at each position.
   * @param string $prompt The prompt to generate completions.
   */
  public function setPrompt( $prompt ) {
    parent::setPrompt( $prompt );
    $this->validateMessages();
  }

  /**
   * The type of return expected from the API. It can be either null or "json".
   * @param int $maxResults The maximum number of completions.
   */
  public function setResponseFormat( $responseFormat ) {
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
  public function getPrompt(): ?string {
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

    // Casually Fine-Tuned or Prompt-Ending
    if ( !empty( $this->promptEnding ) ) {
      $last = end( $this->messages );
      if ( $last && $last['role'] === 'user' ) {
        $prompt = $last['content'] . $this->promptEnding;
      }
      return $prompt;
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
  public function setNewMessage( string $newMessage ): void {
    $this->newMessage = $newMessage;
    $this->validateMessages();
  }

  public function setNewImage( string $newImage ): void {
    $this->newImage = $newImage;
    $this->validateMessages();
  }

  public function setNewImageData( string $newImageData ): void {
    $this->newImageData = $newImageData;
    $this->validateMessages();
  }

  public function replace( $search, $replace ) {
    $this->prompt = str_replace( $search, $replace, $this->prompt );
    $this->validateMessages();
  }

  /**
   * Similar to the prompt, but use an array of messages instead.
   * @param string $prompt The messages to generate completions.
   */
  public function setMessages( array $messages ) {
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
    $this->validateMessages();
  }

  public function getLastMessage() {
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

  public function getMessages() {
    return $this->messages;
  }

  // Function that adds a message just before the last message
  public function injectContext( string $content ): void {
    if ( !empty( $this->messages ) ) {
      $lastMessageIndex = count( $this->messages ) - 1;
      $lastMessage = $this->messages[$lastMessageIndex];
      $this->messages[$lastMessageIndex] = [ 'role' => 'system', 'content' => $content ];
      array_push( $this->messages, $lastMessage );
    }
    $this->validateMessages();
  }

  /**
   * The context that is used for the chat completion (mode === 'chat').
   * @param string $context The context to use.
   */
  public function setContext( string $context ): void {
    $this->context = apply_filters( 'mwai_ai_context', $context, $this );
    $this->validateMessages();
  }

  private function getImageURL( $image ) {
    if ( !empty( $this->newImage ) ) {
      return $this->newImage;
    }
    if ( !empty( $this->newImageData ) ) {
      return "data:image/jpeg;base64,{$this->newImageData}";
    }
  }


  private function validateMessages(): void {
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
    
    // The main context must be first.
    if ( !empty( $this->context ) ) {
      if ( is_array( $this->messages ) && count( $this->messages ) > 0 ) {
        if ( $this->messages[0]['role'] !== 'system' ) {
          array_unshift( $this->messages, [ 'role' => 'system', 'content' => $this->context ] );
        }
        else {
          $this->messages[0]['content'] = $this->context;
        }
      }
    }
  }

  /**
   * The maximum number of tokens to generate in the completion.
   * The token count of your prompt plus max_tokens cannot exceed the model's context length.
   * Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
   * @param float $prompt The maximum number of tokens.
   */
  public function setMaxTokens( int $maxTokens ): void {
    $this->maxTokens = $maxTokens;
  }

  /**
   * Set the sampling temperature to use. Higher values means the model will take more risks.
   * Try 0.9 for more creative applications, and 0 for ones with a well-defined reply.
   * @param float $temperature The temperature.
   */
  public function setTemperature( float $temperature ): void {
    $temperature = floatval( $temperature );
    if ( $temperature > 1 ) {
      $temperature = 1;
    }
    if ( $temperature < 0 ) {
      $temperature = 0;
    }
    $this->temperature = round( $temperature, 2 );
  }

  public function setMaxSentences( int $maxSentences ): void {
    if ( !empty( $maxSentences ) ) {
      $this->maxSentences = intval( $maxSentences );
      $this->validateMessages();
    }
  }

  public function setStop( string $stop ): void {
    $this->stop = $stop;
  }

  // Based on the params of the query, update the attributes
  public function injectParams( array $params ): void
  {
    // Those are for the keys passed directly by the shortcode.
    $params = $this->convertKeys( $params );

    $acceptedValues = [ true, 1, '1' ];
    if ( !empty( $params['model'] ) ) {
			$this->setModel( $params['model'] );
		}
    if ( !empty( $params['casuallyFineTuned'] ) && in_array( $params['casuallyFineTuned'], $acceptedValues, true ) ) {
      $this->promptEnding = "\n\n###\n\n";
      $this->stop = "\n\n";
      $this->casuallyFineTuned = true;
		}
    if ( !empty( $params['prompt'] ) ) {
      $this->setPrompt( $params['prompt'] );
    }
    if ( !empty( $params['context'] ) ) {
      $this->setContext( $params['context'] );
    }
    if ( !empty( $params['messages'] ) ) {
      $this->setMessages( $params['messages'] );
    }
    if ( !empty( $params['newMessage'] ) ) {
      $this->setNewMessage( $params['newMessage'] );
    }
    if ( !empty( $params['maxTokens'] ) && intval( $params['maxTokens'] ) > 0 ) {
			$this->setMaxTokens( intval( $params['maxTokens'] ) );
		}
    if ( !empty( $params['maxMessages'] ) && intval( $params['maxMessages'] ) > 0 ) {
      $this->setMaxSentences( intval( $params['maxMessages'] ) );
    }
    if ( !empty( $params['maxSentences'] ) && intval( $params['maxSentences'] ) > 0 ) {
      $this->setMaxSentences( intval( $params['maxSentences'] ) );
    }
		if ( !empty( $params['temperature'] ) ) {
			$this->setTemperature( $params['temperature'] );
		}
		if ( !empty( $params['stop'] ) ) {
			$this->setStop( $params['stop'] );
		}
    if ( !empty( $params['maxResults'] ) ) {
			$this->setMaxResults( $params['maxResults'] );
		}
		if ( !empty( $params['env'] ) ) {
			$this->setEnv( $params['env'] );
		}
		if ( !empty( $params['session'] ) ) {
			$this->setSession( $params['session'] );
		}
    // Should add the params related to Open AI and Azure
    if ( !empty( $params['service'] ) ) {
			$this->setService( $params['service'] );
		}
    if ( !empty( $params['apiKey'] ) ) {
			$this->setApiKey( $params['apiKey'] );
		}
    if ( !empty( $params['botId'] ) ) {
      $this->setBotId( $params['botId'] );
    }
    if ( !empty( $params['envId'] ) ) {
      $this->setEnvId( $params['envId'] );
    }
    if ( !empty( $params['responseFormat'] ) ) {
      $this->setResponseFormat( $params['responseFormat'] );
    }
  }
}