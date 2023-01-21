<?php

class Meow_MWAI_Answer {

  public $result = '';
  public $results = [];
  public $usage = [ 'prompt_tokens' => 0, 'completion_tokens' => 0, 'total_tokens' => 0 ];
  public $query = null;

  public function __construct( $query = null ) {
    $this->query = $query;
  }

  public function setQuery( $query ) {
    $this->query = $query;
  }

  public function setUsage( $usage ) {
    $this->usage = $usage;
  }

  public function getTotalTokens() {
    return $this->usage['total_tokens'];
  }

  /**
   * Set the choices from OpenAI as the results.
   * The last (or only) result is set as the result.
   * @param array $choices ID of the model to use.
   */
  public function setChoices( $choices ) {
    $this->results = [];
    foreach ( $choices as $choice ) {
      if ( isset( $choice['text'] ) ) {
        $text = trim( $choice['text'] );
        $this->results[] = $text;
        $this->result = $text;
      }
      if ( isset( $choice['url'] ) ) {
        $url = trim( $choice['url'] );
        $this->results[] = $url;
        $this->result = $url;
      }
    }
  }
}