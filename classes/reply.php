<?php

class Meow_MWAI_Reply implements JsonSerializable {

  public $result = '';
  public $results = [];
  public $usage = [ 'prompt_tokens' => 0, 'completion_tokens' => 0, 'total_tokens' => 0 ];
  public $query = null;

  public function __construct( $query = null ) {
    $this->query = $query;
  }

  public function jsonSerialize() {
    return [
      'class' => get_class( $this ),
      'result' => $this->result,
      'results' => $this->results,
      'usage' => $this->usage
    ];
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

  public function getPromptTokens() {
    return $this->usage['prompt_tokens'];
  }

  public function getCompletionTokens() {
    return $this->usage['completion_tokens'];
  }

  public function getResults() {
    return $this->results;
  }

  public function getUsage() {
    return $this->usage;
  }

  public function getResult() {
    return $this->result;
  }

  public function replace( $search, $replace ) {
    $this->result = str_replace( $search, $replace, $this->result );
    $this->results = array_map( function( $result ) use ( $search, $replace ) {
      return str_replace( $search, $replace, $result );
    }, $this->results );
  }

  /**
   * Set the choices from OpenAI as the results.
   * The last (or only) result is set as the result.
   * @param array $choices ID of the model to use.
   */
  public function setChoices( $choices ) {
    $this->results = [];
    if ( is_array( $choices ) ) {
      foreach ( $choices as $choice ) {

        // It's chat completion
        if ( isset( $choice['message'] ) ) {
          $content = trim( $choice['message']['content'] );
          $this->results[] = $content;
          $this->result = $content;
        }

        // It's text completion
        if ( isset( $choice['text'] ) ) {
          $text = trim( $choice['text'] );
          $this->results[] = $text;
          $this->result = $text;
        }

        // It's url/image
        if ( isset( $choice['url'] ) ) {
          $url = trim( $choice['url'] );
          $this->results[] = $url;
          $this->result = $url;
        }

        // It's embedding
        if ( isset( $choice['embedding'] ) ) {
          $content = $choice['embedding'];
          $this->results[] = $content;
          $this->result = $content;
        }
      }
    }
    else {
      $this->result = $choices;
      $this->results[] = $choices;
    }
  }

  public function toJson() {
    return json_encode( $this );
  }
}