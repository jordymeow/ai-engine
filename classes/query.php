<?php

class Meow_MWAI_Query {
  public $prompt = '';
  public $apiKey = null;
  public $maxResults = 1;

  public function __construct( $prompt = '' ) {
    $this->apiKey = get_option( 'meowapps_wai_api_key' );
    $this->prompt = $prompt;
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
   * The API key to use.
   * @param string $apiKey The API key.
   */
  public function setApiKey( $apiKey ) {
    $this->apiKey = $apiKey;
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
}