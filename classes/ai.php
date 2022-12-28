<?php

class Meow_MWAI_AI {
  private $core = null;
  private $model = "text-davinci-003";

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
    $url = 'https://api.openai.com/v1/completions';
    $options = array(
      "http" => array(
        "header" => "Content-Type: application/json\r\n" . "Authorization: Bearer " . $this->apiKey . "\r\n",
        "method" => "POST",
        "content" => json_encode( array(
          "model" => $query->model,
          "prompt" => $query->prompt,
          "n" => $query->maxResults,
          "max_tokens" => $query->maxTokens,
          "temperature" => $query->temperature,
        ) ),
      ),
      "ssl" => array(
        "verify_peer" => false,
        "verify_peer_name" => false,
      )
    );
    $context = stream_context_create( $options );
    $response = file_get_contents( $url, false, $context );
    if ( !$response ) {
      throw new Exception( 'No answer from OpenAI.' );
    }
    $data = json_decode( $response, true );
    $answer = new Meow_MWAI_Answer( $query );
    $usage = $this->record_usage( $data['model'], $data['usage']['prompt_tokens'], $data['usage']['completion_tokens'] );
    $answer->setUsage( $usage );
    $answer->setChoices( $data['choices'] );
    return $answer;
  }
}
