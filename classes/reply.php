<?php

class Meow_MWAI_Reply implements JsonSerializable {

  public $result = '';
  public $results = [];
  public $usage = [ 'prompt_tokens' => 0, 'completion_tokens' => 0, 'total_tokens' => 0 ];
  public $query = null;
  public $type = 'text';

  // Function Call
  public $functionCall = null;

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

  public function setType( $type ) {
    $this->type = $type;
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

  public function getUnits() {
    if ( isset( $this->usage['total_tokens'] ) ) {
      return $this->usage['total_tokens'];
    }
    else if ( isset( $this->usage['images'] ) ) {
      return $this->usage['images'];
    }
    else if ( isset( $this->usage['seconds'] ) ) {
      return $this->usage['seconds'];
    }
    return null;
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

  public function getType() {
    return $this->type;
  }

  public function setReply( $reply ) {
    $this->result = $reply;
    $this->results[] = [ $reply ];
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

          // It's text content
          if ( isset( $choice['message']['content'] ) ) {
            $content = trim( $choice['message']['content'] );
            $this->results[] = $content;
            $this->result = $content;
          }

          // It's a function call
          if ( isset( $choice['message']['function_call'] ) ) {
            $content = $choice['message']['function_call'];
            $name = trim( $content['name'] );
            $arguments = trim( str_replace( "\n", "", $content['arguments'] ) );
            if ( substr( $arguments, 0, 1 ) == '{' ) {
              $arguments = json_decode( $arguments, true );
            }
            $this->functionCall = [ 'name' => $name, 'arguments' => $arguments ];
          }
        }

        // It's text completion
        else if ( isset( $choice['text'] ) ) {
          $text = trim( $choice['text'] );
          $this->results[] = $text;
          $this->result = $text;
        }

        // It's url/image
        else if ( isset( $choice['url'] ) ) {
          $url = trim( $choice['url'] );
          $this->results[] = $url;
          $this->result = $url;
        }

        // It's embedding
        else if ( isset( $choice['embedding'] ) ) {
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