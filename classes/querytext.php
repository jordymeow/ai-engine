<?php

class Meow_MWAI_QueryText extends Meow_MWAI_Query {
  public $maxTokens = 1024;
  public $temperature = 0.8;
  public $maxSentences = 15;
  public $isChat = false;
  public $stop = null;
  public $messages = [];
  public $context = null;
  public $newMessage = null;
  public $promptEnding = null;
  public $casuallyFineTuned = false;
  
  public function __construct( $prompt = '', $maxTokens = 1024, $model = 'gpt-3.5-turbo' ) {
    parent::__construct( $prompt );
    $this->setModel( $model );
    $this->setMaxTokens( $maxTokens );
  }

  public function getLastPrompt() {
    if ( empty( $this->messages ) ) {
      return $this->prompt;
    }
    $lastMessage = end( $this->messages );
    return $lastMessage['content'];
  }

  // Quick and dirty token estimation
  // Let's keep this synchronized with Helpers in JS
  function estimateTokens( $content )
  {
    $text = "";
    // https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb
    if ( is_array( $content ) ) {
      foreach ( $content as $message ) {
        $name = "";
        $role = $message['role'];
        $content = $message['content'];
        $text .= "=#=$role\n$content=#=\n";
      }
    }
    else {
      $text = $content;
    }
    $tokens = 0;
    return apply_filters( 'mwai_estimate_tokens', (int)$tokens, $text, $this->model );
  }

  /**
   * Make sure the maxTokens is not greater than the model's context length.
   */
  public function finalChecks() {
    if ( empty( $this->model )  ) { return; }

    // Make sure the max tokens are respected.
    $realMax = 4096;
    $finetuneFamily = preg_match('/^([a-zA-Z]{0,32}):/', $this->model, $matches );
    $finetuneFamily = ( isset( $matches ) && count( $matches ) > 0 ) ? $matches[1] : 'N/A';
    $foundModel = null;
    foreach ( MWAI_OPENAI_MODELS as $currentModel ) {
      if ( $currentModel['model'] === $this->model || $currentModel['family'] === $finetuneFamily ) {
        $foundModel = $currentModel['name'];
        $realMax = $currentModel['maxTokens'];
        break;
      }
    }
    $estimatedTokens = $this->estimateTokens( $this->messages );
    if ( $estimatedTokens > $realMax ) {
      throw new Exception( "AI Engine: The prompt is too long! It contains about $estimatedTokens tokens (estimation). The model $foundModel only accepts a maximum of $realMax tokens. " );
    }
    $realMax = (int)($realMax - $estimatedTokens) - 16;
    if ( $this->maxTokens > $realMax ) {
      $this->maxTokens = $realMax;
    }

    // Make sure the number of messages is not too great
    if ( !empty( $this->maxSentences ) ) {
      $context = array_shift( $this->messages );
      if ( !empty( $this->messages ) ) {
        $this->messages = array_slice( $this->messages, -$this->maxSentences * 2 );
      }
      else {
        $this->messages = [];
      }
      if ( !empty( $context ) ) {
        array_unshift( $this->messages, $context );
      }
    }
  }

  /**
   * ID of the model to use.
   * @param string $model ID of the model to use.
   */
  public function setModel( $model ) {
    $this->model = $model;
    $this->mode = 'completion';
    foreach ( MWAI_OPENAI_MODELS as $currentModel ) {
      if ( $currentModel['model'] === $this->model ) {
        if ( $currentModel['mode'] ) {
          $this->mode = $currentModel['mode'];
        }
        break;
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
   * The prompt is used by models who uses Text Completion (and not Chat Completion).
   * This returns the prompt if it's not a chat, otherwise it will build a prompt with
   * all the messages nicely formatted.
   */
  public function getPrompt() {
    if ( !$this->isChat ) {
      return $this->prompt;
    }
    
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
  public function setNewMessage( $newMessage ) {
    $this->newMessage = $newMessage;
    $this->validateMessages();
  }

  public function replace( $search, $replace ) {
    $this->prompt = str_replace( $search, $replace, $this->prompt );
    $this->validateMessages();
  }

  public function setIsChat( $isChat ) {
    $this->isChat = $isChat;
  }

  /**
   * Similar to the prompt, but use an array of messages instead.
   * @param string $prompt The messages to generate completions.
   */
  public function setMessages( $messages ) {
    $messages = array_map( function( $message ) {
      return [ 'role' => $message['role'], 'content' => $message['content'] ];
    }, $messages );
    $this->messages = $messages;
    $this->validateMessages();
  }

  public function getLastMessage() {
    if ( !empty( $this->messages ) ) {
      $lastMessageIndex = count( $this->messages ) - 1;
      $lastMessage = $this->messages[$lastMessageIndex];
      return $lastMessage['content'];
    }
    return null;
  }

  // Function that adds a message just before the last message
  public function injectContext( $content ) {
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
  public function setContext( $context ) {
    $this->context = apply_filters( 'mwai_ai_context', $context, $this );
    $this->validateMessages();
  }

  private function validateMessages() {
    // Messages should end with either the prompt or, if exists, the newMessage.
    $message = empty( $this->newMessage ) ? $this->prompt : $this->newMessage;
    if ( empty( $this->messages ) ) {
      $this->messages = [ [ 'role' => 'user', 'content' => $message ] ];
    }
    else {
      $last = &$this->messages[ count( $this->messages ) - 1 ];
      if ( $last['role'] === 'user' ) {
          $last['content'] = $message;
      }
      else {
        array_push( $this->messages, [ 'role' => 'user', 'content' => $message ] );
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
  public function setMaxTokens( $maxTokens ) {
    $this->maxTokens = intval( $maxTokens );
  }

  /**
   * Set the sampling temperature to use. Higher values means the model will take more risks.
   * Try 0.9 for more creative applications, and 0 for ones with a well-defined answer.
   * @param float $temperature The temperature.
   */
  public function setTemperature( $temperature ) {
    $temperature = floatval( $temperature );
    if ( $temperature > 1 ) {
      $temperature = 1;
    }
    if ( $temperature < 0 ) {
      $temperature = 0;
    }
    $this->temperature = round( $temperature, 2 );
  }

  public function setMaxSentences( $maxSentences ) {
    if ( !empty( $maxSentences ) ) {
      $this->maxSentences = intval( $maxSentences );
      $this->validateMessages();
    }
  }

  public function setStop( $stop ) {
    $this->stop = $stop;
  }

  // Based on the params of the query, update the attributes
  public function injectParams( $params ) {
    if ( isset( $params['model'] ) ) {
			$this->setModel( $params['model'] );
		}
    if ( isset( $params['casually_fine_tuned'] ) && $params['casually_fine_tuned'] === true ) {
      $this->promptEnding = "\\n\\n###\\n\\n";
      $this->stop = "\\n\\n";
      $this->casuallyFineTuned = true;
		}
    if ( isset( $params['casuallyFineTuned'] ) && $params['casuallyFineTuned'] === true ) {
      $this->promptEnding = "\\n\\n###\\n\\n";
      $this->stop = "\\n\\n";
      $this->casuallyFineTuned = true;
		}
    if ( isset( $params['prompt'] ) ) {
      $this->setPrompt( $params['prompt'] );
    }
    if ( isset( $params['context'] ) ) {
      $this->setContext( $params['context'] );
    }
    if ( isset( $params['messages'] ) ) {
      $this->setMessages( $params['messages'] );
    }
    if ( isset( $params['new_message'] ) ) {
      $this->setNewMessage( $params['newMessage'] );
    }
    if ( isset( $params['newMessage'] ) ) {
      $this->setNewMessage( $params['newMessage'] );
    }
		if ( isset( $params['max_tokens'] ) && intval( $params['max_tokens'] ) > 0 ) {
			$this->setMaxTokens( intval( $params['max_tokens'] ) );
		}
    if ( isset( $params['maxTokens'] ) && intval( $params['maxTokens'] ) > 0 ) {
			$this->setMaxTokens( intval( $params['maxTokens'] ) );
		}
    if ( isset( $params['max_sentences'] ) && intval( $params['max_sentences'] ) > 0 ) {
      $this->setMaxSentences( intval( $params['max_sentences'] ) );
    }
    if ( isset( $params['maxSentences'] ) && intval( $params['maxSentences'] ) > 0 ) {
      $this->setMaxSentences( intval( $params['maxSentences'] ) );
    }
		if ( isset( $params['temperature'] ) ) {
			$this->setTemperature( $params['temperature'] );
		}
		if ( isset( $params['stop'] ) ) {
			$this->setStop( $params['stop'] );
		}
		if ( isset( $params['max_results'] ) ) {
			$this->setMaxResults( $params['max_results'] );
		}
    if ( isset( $params['maxResults'] ) ) {
			$this->setMaxResults( $params['maxResults'] );
		}
		if ( isset( $params['env'] ) ) {
			$this->setEnv( $params['env'] );
		}
		if ( isset( $params['session'] ) ) {
			$this->setSession( $params['session'] );
		}
    // Should add the params related to Open AI and Azure
    if ( isset( $params['service'] ) ) {
			$this->setService( $params['service'] );
		}
    if ( isset( $params['api_key'] ) ) {
			$this->setApiKey( $params['apiKey'] );
		}
    if ( isset( $params['apiKey'] ) ) {
			$this->setApiKey( $params['apiKey'] );
		}
  }
}