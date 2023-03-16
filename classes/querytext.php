<?php

class Meow_MWAI_QueryText extends Meow_MWAI_Query {
  public $maxTokens = 1024;
  public $temperature = 0.8;
  public $stop = null;
  public $messages = [];
  public $context = null;
  
  public function __construct( $prompt = '', $maxTokens = 1024, $model = 'gpt-3.5-turbo' ) {
    parent::__construct( $prompt );
    $this->setModel( $model );
    $this->setMaxTokens( $maxTokens );
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
  public function checkFix() {
    if ( empty( $this->model )  ) { return; }
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
      throw new Exception( "The prompt is too long! It contains about $estimatedTokens tokens (estimation). The model $foundModel only accepts a maximum of $realMax tokens. " );
    }
    $realMax = (int)($realMax - $estimatedTokens);
    if ( $this->maxTokens > $realMax ) {
      $this->maxTokens = $realMax;
    }
  }

  /**
   * ID of the model to use.
   * @param string $model ID of the model to use.
   */
  public function setModel( $model ) {
    $this->model = $model;
    if ( $model ===  'gpt-3.5-turbo') {
      $this->mode = 'chat';
    }
    else {
      $this->mode = 'completion';
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
      return $this->messages[count( $this->messages ) - 1];
    }
    return null;
  }

  // Function that adds a message just before the last message
  public function injectContext( $content ) {
    if ( !empty( $this->messages ) ) {
      $lastMessage = $this->getLastMessage();
      $lastMessageIndex = count( $this->messages ) - 1;
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
    if ( empty( $this->messages ) ) {
      $this->messages = [];
      if ( !empty( $this->prompt ) ) {
        array_push( $this->messages, [ 'role' => 'user', 'content' => $this->prompt ] );
      }
    }
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
    $this->temperature = $temperature;
  }

  /**
   * Up to 4 sequences where the API will stop generating further tokens.
   * The returned text will not contain the stop sequence.
   * @param float $stop The stop.
   */
  public function setStop( $stop ) {
    if ( !empty( $stop ) ) {
      $this->stop = $stop;
    }
  }

  // Based on the params of the query, update the attributes
  public function injectParams( $params ) {
    if ( isset( $params['model'] ) ) {
			$this->setModel( $params['model'] );
		}
    if ( isset( $params['prompt'] ) ) {
      $this->setPrompt( $params['prompt'] );
    }
    if ( isset( $params['messages'] ) ) {
      $this->setMessages( $params['messages'] );
    }
    if ( isset( $params['context'] ) ) {
      $this->setContext( $params['context'] );
    }
		if ( isset( $params['maxTokens'] ) ) {
			$this->setMaxTokens( $params['maxTokens'] );
		}
		if ( isset( $params['temperature'] ) ) {
			$this->setTemperature( $params['temperature'] );
		}
		if ( isset( $params['stop'] ) ) {
			$this->setStop( $params['stop'] );
		}
		if ( isset( $params['apiKey'] ) ) {
			$this->setApiKey( $params['apiKey'] );
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
  }
}