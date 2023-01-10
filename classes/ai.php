<?php

class Meow_MWAI_AI {
  private $core = null;
  private $model = "text-davinci-003";
  private $apiKey = null;

  public function __construct( $core ) {
    $this->core = $core;
    $this->apiKey = $this->core->get_option( 'openai_apikey' );
  }

  // Record usage of the API on a monthly basis
  public function record_usage( $model, $prompt_tokens, $completion_tokens ) {
    if ( !$model || !$prompt_tokens || !$completion_tokens ) {
      throw new Exception( 'Missing parameters for record_usage.' );
    }
    $usage = $this->core->get_option( 'openai_usage' );
    $month = date( 'Y-m' );
    if ( !isset( $usage[$month] ) ) {
      $usage[$month] = array();
    }
    if ( !isset( $usage[$month][$model] ) ) {
      $usage[$month][$model] = array(
        'prompt_tokens' => 0,
        'completion_tokens' => 0,
        'total_tokens' => 0
      );
    }
    $usage[$month][$model]['prompt_tokens'] += $prompt_tokens;
    $usage[$month][$model]['completion_tokens'] += $completion_tokens;
    $usage[$month][$model]['total_tokens'] += $prompt_tokens + $completion_tokens;
    $this->core->update_option( 'openai_usage', $usage );
    return [
      'prompt_tokens' => $prompt_tokens,
      'completion_tokens' => $completion_tokens,
      'total_tokens' => $prompt_tokens + $completion_tokens
    ];
  }

  public function run( $query ) {
    $apiKey = $this->apiKey;
    if ( !empty( $query->apiKey ) ) {
      $apiKey = $query->apiKey;
    }
    $url = 'https://api.openai.com/v1/completions';
    $options = array(
      "headers" => "Content-Type: application/json\r\n" . "Authorization: Bearer " . $apiKey . "\r\n",
      "method" => "POST",
      "timeout" => 60,
      "body" => json_encode( array(
        "model" => $query->model,
        "prompt" => $query->prompt,
        "n" => $query->maxResults,
        "max_tokens" => $query->maxTokens,
        "temperature" => $query->temperature,
      ) ),
      "sslverify" => false
    );

    try {
      $response = wp_remote_get( $url, $options );
      if ( is_wp_error( $response ) ) {
        throw new Exception( $response->get_error_message() );
      }
      $response = wp_remote_retrieve_body( $response );
      $data = json_decode( $response, true );
      
      // Error handling
      if ( isset( $data['error'] ) ) {
        $message = $data['error']['message'];
        // If the message contains "Incorrect API key provided: THE_KEY.", replace the key by "----".
        if ( preg_match( '/API key provided(: .*)\./', $message, $matches ) ) {
          $message = str_replace( $matches[1], '', $message );
        }
        throw new Exception( $message );
      }
      $answer = new Meow_MWAI_Answer( $query );
      $usage = $this->record_usage( $data['model'], $data['usage']['prompt_tokens'],
        $data['usage']['completion_tokens'] );
      $answer->setUsage( $usage );
      $answer->setChoices( $data['choices'] );
      return $answer;
    }
    catch ( Exception $e ) {
      error_log( $e->getMessage() );
      throw new Exception( 'Error while calling OpenAI: ' . $e->getMessage() );
    }
  }
}
