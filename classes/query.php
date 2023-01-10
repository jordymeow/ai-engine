<?php

class Meow_MWAI_Query {

  public $model = 'text-davinci-003';
  public $type = 'completion';
  
  public $prompt = '';

  public $maxTokens = 16;
  public $temperature = 1;
  public $maxResults = 1;
  public $stop = null;
  public $apiKey = null;

  public function __construct( $prompt = '', $maxTokens = 16, $model = 'text-davinci-003' ) {
    $this->prompt = $prompt;
    $this->maxTokens = $maxTokens;
    $this->model = $model;
  }

  /**
   * ID of the model to use.
   * @param string $model ID of the model to use.
   */
  public function setModel( $model ) {
    $this->model = $model;
    if ( $model !== 'text-davinci-003' && $this->maxTokens > 512 ) {
      $this->maxTokens = 512;
    }
  }

  /**
   * Given a prompt, the model will return one or more predicted completions.
   * It can also return the probabilities of alternative tokens at each position.
   * @param string $prompt The prompt to generate completions.
   */
  public function setPrompt( $prompt ) {
    $this->prompt = $prompt;
  }

  /**
   * The maximum number of tokens to generate in the completion.
   * The token count of your prompt plus max_tokens cannot exceed the model's context length.
   * Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
   * @param float $prompt The maximum number of tokens.
   */
  public function setMaxTokens( $maxTokens ) {
    $this->maxTokens = $maxTokens;
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
   * How many completions to generate for each prompt.
   * Because this parameter generates many completions, it can quickly consume your token quota.
   * Use carefully and ensure that you have reasonable settings for max_tokens and stop.
   * @param float $maxResults Number of completions.
   */
  public function setMaxResults( $maxResults ) {
    $this->maxResults = $maxResults;
  }

  /**
   * Up to 4 sequences where the API will stop generating further tokens.
   * The returned text will not contain the stop sequence.
   * @param float $stop The stop.
   */
  public function setStop( $stop ) {
    $this->stop = $stop;
  }

  /**
   * The API key to use.
   * @param string $apiKey The API key.
   */
  public function setApiKey( $apiKey ) {
    $this->apiKey = $apiKey;
  }
}