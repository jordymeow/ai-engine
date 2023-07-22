<?php

class Meow_MWAI_Query_Base implements JsonSerializable {
  public string $env = '';
  public string $prompt = '';
  public string $model = '';
  public string $mode = '';
  public ?string $session = null;
  public int $maxResults = 1;
  public ?string $service = null;
  public ?string $botId = null;

  // Functions
  public array $functions = [];
  public ?string $functionCall = null;

  // OpenAI
  public ?string $apiKey = null;

  // Azure
  public ?string $azureEndpoint = null;
  public ?string $azureApiKey = null;
  public ?string $azureDeployment = null;

  public function __construct( $prompt = '' ) {
    global $mwai_core;
    $this->setPrompt( $prompt );
    $this->session = $mwai_core->get_session_id();
  }

  #[\ReturnTypeWillChange]
  public function jsonSerialize() {
    return [
      'class' => get_class( $this ),
      'env' => $this->env,
      'prompt' => $this->prompt,
      'model' => $this->model,
      'mode' => $this->mode,
      'session' => $this->session,
      'maxResults' => $this->maxResults
    ];
  }

  public function addFunction( Meow_MWAI_Query_Function $function ): void {
    $this->functions[] = $function;
    $this->functionCall = "auto";
  }

  public function setFunctions( array $functions ): void {
    $this->functions = $functions;
    $this->functionCall = "auto";
  }

  public function getFunctions(): array {
    return $this->functions;
  }

  public function replace( $search, $replace ) {
    $this->prompt = str_replace( $search, $replace, $this->prompt );
  }

  public function getLastPrompt(): string {
    return $this->prompt;
  }

  /**
   * The environment, like "chatbot", "imagesbot", "chatbot-007", "textwriter", etc...
   * Used for statistics, mainly.
   * @param string $env The environment.
   */
  public function setEnv( string $env ): void {
    $this->env = $env;
  }

  /**
   * ID of the model to use.
   * @param string $model ID of the model to use.
   */
  public function setModel( string $model ) {
    $this->model = $model;
  }

  /**
   * The mode
   * @param string $mode.
   */
  public function setMode( string $mode ) {
    $this->mode = $mode;
  }

  /**
   * Given a prompt, the model will return one or more predicted completions.
   * It can also return the probabilities of alternative tokens at each position.
   * @param string $prompt The prompt to generate completions.
   */
  public function setPrompt( string $prompt ) {
    $this->prompt = $prompt;
  }

  public function getPrompt() {
    return $this->prompt;
  }

  /**
   * Similar to the prompt, but focus on the new/last message.
   * Only used when the model has a chat mode (and only used in messages).
   * With Meow_MWAI_Query_Base, this is the same as setPrompt.
   * @param string $prompt The messages to generate completions.
   */
  public function setNewMessage( string $newMessage ): void {
    $this->setPrompt( $newMessage );
  }

  public function getLastMessage() {
    return $this->getPrompt();
  }

  /**
   * The API key to use.
   * @param string $apiKey The API key.
   */
  public function setApiKey( string $apiKey ) {
    $this->apiKey = $apiKey;
  }

  /**
   * The service to use.
   * @param string $service The service.
   */
  public function setService( string $service ) {
    $this->service = $service;
  }

  /**
   * The Azure endpoint to use.
   * @param string $endpoint The endpoint.
   */
  public function setAzureEndpoint( string $endpoint ) {
    $this->azureEndpoint = $endpoint;
  }

  /**
   * The Azure API key to use.
   * @param string $apiKey The API key.
   */
  public function setAzureApiKey( string $apiKey ) {
    $this->azureApiKey = $apiKey;
  }

  /**
   * The Azure deployment to use.
   * @param string $deployment The deployment.
   */
  public function setAzureDeployment( string $deployment ) {
    $this->azureDeployment = $deployment;
  }

  /**
   * The session ID to use.
   * @param string $session The session ID.
   */
  public function setSession( string $session ) {
    $this->session = $session;
  }

  /**
   * The bot ID to use.
   * @param string $botId The bot ID.
   */
  public function setBotId( string $botId ) {
    $this->botId = $botId;
  }

  /**
   * How many completions to generate for each prompt.
   * Because this parameter generates many completions, it can quickly consume your token quota.
   * Use carefully and ensure that you have reasonable settings for max_tokens and stop.
   * @param float $maxResults Number of completions.
   */
  public function setMaxResults( int $maxResults ) {
    $this->maxResults = $maxResults;
  }

  // **
  //  * Check if everything is correct, otherwise fix it (like the max number of tokens).
  //  */
  public function finalChecks() {
  }

  /*
    * Get the JSON representation of the query.
  */
  public function toJson() {
    return json_encode( $this );
  }
}