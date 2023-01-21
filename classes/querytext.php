<?php

class Meow_MWAI_QueryText extends Meow_MWAI_Query {
  public $maxTokens = 16;
  public $temperature = 0.8;
  public $stop = null;
  
  public function __construct( $prompt = '', $maxTokens = 16, $model = 'text-davinci-003' ) {
    $this->prompt = $prompt;
    $this->maxTokens = $maxTokens;
    $this->model = $model;
    $this->type = "completion";
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
   * Up to 4 sequences where the API will stop generating further tokens.
   * The returned text will not contain the stop sequence.
   * @param float $stop The stop.
   */
  public function setStop( $stop ) {
    if ( !empty( $stop ) ) {
      $this->stop = $stop;
    }
  }
}