<?php

class Meow_MWAI_Query_Base implements JsonSerializable {
  public string $env = ''; // Ouch, not sure if it's used, but afraid that it will be confused with the AI env.
  public string $prompt = '';
  public string $model = '';
  public string $mode = '';
  public ?string $session = null;
  public int $maxResults = 1;
  public ?string $botId = null;

  // Functions
  public array $functions = [];
  public ?string $functionCall = null;

  // Overrides for env
  public string $envId = '';
  public ?string $apiKey = null;
  public ?string $service = null; // TODO: This should be removed at some point. Should use envId instead.

  public function __construct( $prompt = '' ) {
    global $mwai_core;
    if ( is_string( $prompt ) ) {
      $this->setPrompt( $prompt );
    }
    $this->session = $mwai_core->get_session_id();
  }

  #[\ReturnTypeWillChange]
  public function jsonSerialize() {
    return [
      'class' => get_class( $this ),
      'env' => $this->env,
      'envId' => $this->envId,
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
   * The environment ID for AI services.
   * Used for statistics, mainly.
   * @param string $envId The environment ID.
   */
  public function setEnvId( string $envId ): void {
    $this->envId = $envId;
  }

  /**
   * ID of the model to use.
   * @param string $model ID of the model to use.
   */
  public function setModel( string $model ) {
    $this->model = $model;
  }

  public function getModel() {
    return $this->model;
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

  public function getMessages() {
    return null;
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

  protected function convertKeys( $params )
  {
    $newParams = [];
    foreach ( $params as $key => $value ) {
      $newKey = '';
      $capitalizeNextChar = false;
      for ( $i = 0; $i < strlen( $key ); $i++ ) {
        if ( $key[$i] == '_' ) {
          $capitalizeNextChar = true;
        }
        else {
          $newKey .= $capitalizeNextChar ? strtoupper($key[$i]) : $key[$i];
          $capitalizeNextChar = false;
        }
      }
      $newParams[$newKey] = $value;
    }
    return $newParams;
  }

  // Quick and dirty token estimation
  // Let's keep this synchronized with Helpers in JS
  protected function estimateTokens( $promptOrMessages ): int
  {
    $text = "";
    // https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb
    if ( is_array( $promptOrMessages ) ) {
      foreach ( $promptOrMessages as $message ) {
        $role = $message['role'];
        $content = $message['content'];
        if ( is_array( $content ) ) {
          foreach ( $content as $subMessage ) { 
            if ( $subMessage['type'] === 'text' ) {
              $text .= $subMessage['text'];
            }
          }
        }
        else {
          $text .= "=#=$role\n$content=#=\n";
        }
      }
    }
    else {
      $text = $promptOrMessages;
    }
    $tokens = 0;
    return apply_filters( 'mwai_estimate_tokens', (int)$tokens, $text, $this->model );
  }

  /*
    * Get the JSON representation of the query.
  */
  public function toJson() {
    return json_encode( $this );
  }
}