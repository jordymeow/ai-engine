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
  function estimateTokens( $text, $method = "max" )
  {
    // method can be "average", "words", "chars", "max", "min", defaults to "max"
    // "average" is the average of words and chars
    // "words" is the word count divided by 0.75
    // "chars" is the char count divided by 4
    // "max" is the max of word and char
    // "min" is the min of word and char
    $word_count = count(explode(" ", $text));
    $char_count = strlen($text);
    $tokens_count_word_est = $word_count / 0.75;
    $tokens_count_char_est = $char_count / 4.0;
    $output = 0;
    if ( $method == 'average' ) {
      $output = ($tokens_count_word_est + $tokens_count_char_est) / 2;
    }
    else if ( $method == 'words' ) {
      $output = $tokens_count_word_est;
    }
    else if ( $method == 'chars' ) {
      $output = $tokens_count_char_est;
    }
    else if ( $method == 'max') {
      $output = max($tokens_count_word_est, $tokens_count_char_est);
    }
    else if ( $method == 'min') {
      $output = min($tokens_count_word_est, $tokens_count_char_est);
    }
    else {
      // return invalid method message
      return "Invalid method. Use 'average', 'words', 'chars', 'max', or 'min'.";
    }
    return  (int)$output;
  }

  /**
   * Make sure the maxTokens is not greater than the model's context length.
   */
  private function validateMaxTokens() {
    $realMax = 256;
    $finetuneFamily = preg_match('/^([a-zA-Z]{0,32}):/', $this->model, $matches );
    $finetuneFamily = ( isset( $matches ) && count( $matches ) > 0 ) ? $matches[1] : 'N/A';
    $foundModel = null;
    foreach ( MWAI_OPENAI_MODELS as $currentModel ) {
      if ( $currentModel['model'] === $this->model || $currentModel['family'] === $finetuneFamily ) {
        $foundModel = $currentModel;
        $realMax = $currentModel['maxTokens'];
        break;
      }
    }
    $estimatedTokens = $this->estimateTokens( $this->prompt );
    $realMax = $realMax - $estimatedTokens - 64;
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
    $this->validateMaxTokens();
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
    $this->validateMaxTokens();
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