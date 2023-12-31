<?php

class Meow_MWAI_Reply implements JsonSerializable {
  public $id = null;
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

  #[\ReturnTypeWillChange]
  public function jsonSerialize() {
    return [
      'result' => $this->result,
      'results' => $this->results,
      'usage' => $this->usage,
      'system' => [
        'class' => get_class( $this ),
      ]
    ];
  }

  public function set_usage( $usage ) {
    $this->usage = $usage;
  }

  public function set_id( $id ) {
    $this->id = $id;
  }

  public function set_type( $type ) {
    $this->type = $type;
  }

  public function get_total_tokens() {
    return $this->usage['total_tokens'];
  }

  public function get_in_tokens( $query = null ) {
    $in_tokens = $this->usage['prompt_tokens'];
    if ( empty( $in_tokens ) && $query ) {
      $in_tokens = $query->get_in_tokens();
    }
    return $in_tokens;
  }

  public function get_out_tokens() {
    $out_tokens = $this->usage['completion_tokens'];
    if ( empty( $out_tokens ) ) {
      $out_tokens = Meow_MWAI_Core::estimate_tokens( $this->result );
    }
    return $out_tokens;
  }

  public function get_units() {
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

  public function get_type() {
    return $this->type;
  }

  public function set_reply( $reply ) {
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
  public function set_choices( $choices ) {
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

          // TODO: Assistants return an array (so actually not really a text completion)
          // We should probably make this clearer and analyze all the outputs from different endpoints.
          if ( is_array( $choice['text'] ) ) {
            $text = trim( $choice['text']['value'] );
            $this->results[] = $text;
            $this->result = $text;
          }
          else {
            $text = trim( $choice['text'] );
            $this->results[] = $text;
            $this->result = $text;
          }
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