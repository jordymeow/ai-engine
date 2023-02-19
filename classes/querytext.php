<?php

class Meow_MWAI_QueryText extends Meow_MWAI_Query {
  public $maxTokens = 16;
  public $temperature = 0.8;
  public $stop = null;
  
  public function __construct( $prompt = '', $maxTokens = 16, $model = 'text-davinci-003' ) {
    $this->prompt = $prompt;
    $this->maxTokens = $maxTokens;
    $this->model = $model;
    $this->mode = "completion";
  }

  // Quick and dirty token estimation
  function estimate_tokens( $text, $method = "max" )
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
    $contains = strpos( $this->model, 'davinci' ) !== false;
    $realMax = $contains ? 4096 : 2048;
    $estimatedTokens = $this->estimate_tokens( $this->prompt );
    $realMax = $realMax - $estimatedTokens - 32;
    if ( $this->maxTokens > $realMax ) {
      $this->maxTokens = $realMax;
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