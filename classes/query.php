<?php

class Meow_MWAI_Query {
  public $env = '';
  public $prompt = '';
  public $model = '';
  public $mode = '';
  public $apiKey = null;
  public $session = null;
  public $maxResults = 1;

  public function __construct( $prompt = '' ) {
    global $mwai_core;
    $this->setPrompt( $prompt );
    $this->session = $mwai_core->get_session_id();
  }

  public function replace( $search, $replace ) {
    $this->prompt = str_replace( $search, $replace, $this->prompt );
  }

  /**
   * The environment, like "chatbot", "imagesbot", "chatbot-007", "textwriter", etc...
   * Used for statistics, mainly.
   * @param string $env The environment.
   */
  public function setEnv( $env ) {
    $this->env = $env;
  }

  /**
   * ID of the model to use.
   * @param string $model ID of the model to use.
   */
  public function setModel( $model ) {
    $this->model = $model;
  }

  /**
   * The mode
   * @param string $model ID of the model to use.
   */
  public function setMode( $mode ) {
    $this->mode = $mode;
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
   * The session ID to use.
   * @param string $session The session ID.
   */
  public function setSession( $session ) {
    $this->session = $session;
  }

  /**
   * How many completions to generate for each prompt.
   * Because this parameter generates many completions, it can quickly consume your token quota.
   * Use carefully and ensure that you have reasonable settings for max_tokens and stop.
   * @param float $maxResults Number of completions.
   */
  public function setMaxResults( $maxResults ) {
    $this->maxResults = intval( $maxResults );
  }

  // **
  //  * Check if everything is correct, otherwise fix it (like the max number of tokens).
  //  */
  public function checkFix() {
  }
}