<?php

class Meow_MWAI_Reply implements JsonSerializable {
  public $id = null;
  public $result = '';
  public $results = [];
  public $usage = [ 
    'prompt_tokens' => 0,
    'completion_tokens' => 0,
    'total_tokens' => 0,
    'price' => null,
  ];
  public $query = null;
  public $type = 'text';

  // This is when models return a message that needs to be executed (functions, tools, etc)
  public $needFeedbacks = [];
  public $needClientActions = [];

  public function __construct( $query = null ) {
    $this->query = $query;
  }

  #[\ReturnTypeWillChange]
  public function jsonSerialize() {
    $isEmbedding = false;
    $embeddingsDimensions = null;
    $embedddingsMessage = null;
    if ( is_array( $this->results ) && count( $this->results ) > 0 ) {
      $isEmbedding = is_array( $this->results[0] );
      if ( $isEmbedding ) {
        $embeddingsDimensions = count( $this->results[0] );
        $embedddingsMessage = "A $embeddingsDimensions-dimensional embedding was returned.";
      }
    }
    $data = [
      'result' => $isEmbedding ? $embedddingsMessage : $this->result,
      'results' => $isEmbedding ? [] : $this->results,
      'usage' => $this->usage,
      'system' => [
        'class' => get_class( $this ),
      ]
    ];
    if ( !empty( $this->needFeedbacks ) ) {
      $data['needFeedbacks'] = $this->needFeedbacks;
    }
    if ( !empty( $this->needClientActions ) ) {
      $data['needClientActions'] = $this->needClientActions;
    }
    return $data;
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

  public function get_price() {
    // If it's not set return null, but it can be 0
    if ( !isset( $this->usage['price'] ) ) {
      return null;
    }
    return $this->usage['price'];
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

  private function extract_arguments( $funcArgs ) {
    $finalArgs = [];
    if ( is_string( $funcArgs ) ) {
      $arguments = trim( str_replace( "\n", "", $funcArgs ) );
      if ( substr( $arguments, 0, 1 ) == '{' ) {
        $arguments = json_decode( $arguments, true );
        $finalArgs = $arguments;
      }
    }
    else if ( is_array( $funcArgs ) ) {
      $finalArgs = $funcArgs;
    }
    return $finalArgs;
  }

  /**
   * Set the choices from OpenAI as the results.
   * The last (or only) result is set as the result.
   * @param array $choices ID of the model to use.
   */
  public function set_choices( $choices, $rawMessage = null) {
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

          // It's a tool call (OpenAI-style and Anthropic-style)
          $toolCalls = [];
          if ( isset( $choice['message']['tool_calls'] ) ) {
            $tools = $choice['message']['tool_calls'];
            foreach ( $tools as $tool ) {
              if ( $tool['type'] === 'function' ) {
                $toolCalls[] = [ 
                  'toolId' => $tool['id'], 
                  //'mode' => 'interactive',
                  'type' => 'tool_call',
                  'name' => trim( $tool['function']['name'] ),
                  'arguments' => $this->extract_arguments( $tool['function']['arguments'] ),
                  // Represent the original message that triggered the function call
                  'rawMessage' => $rawMessage ? $rawMessage : $choice['message'],
                ];
              }
            }
          }

          // If it's a function call (Open-AI style; usually for a final execution)
          if ( isset( $choice['message']['function_call'] ) ) {
            $content = $choice['message']['function_call'];
            $toolCalls[] = [
              'toolId' => null,
              'mode' => 'static',
              'type' => 'function_call',
              'name' => trim( $choice['message']['function_call']['name'] ),
              'arguments' => $this->extract_arguments( $tool['message']['function_call']['arguments'] ),
              'rawMessage' => $rawMessage ? $rawMessage : $choice['message'],
            ];
          }

          // Resolve the original function from the query
          if ( !empty( $toolCalls ) ) {
            foreach ( $toolCalls as &$toolCall ) {
              if ( $toolCall['type'] !== 'function_call' && $toolCall['type'] !== 'tool_call' ) {
                continue;
              }
              foreach ( $this->query->functions as $function ) {
                if ( $function->name == $toolCall['name'] ) {
                  $toolCall['function'] = $function;
                  break;
                }
              }
            }
          }

          // NOTE: Anaheim proposed that fix to avoid the error "Duplicate value for 'tool_call_id'"
          // This happens when the same function is called twice; we need to investigate.
          $toolCallsDeepCopy = array_map( function( $toolCall ) {
            return is_array( $toolCall ) ? array_merge( [], $toolCall ) : $toolCall;
          }, $toolCalls);
          $toolCalls = $toolCallsDeepCopy;

          // Let's separate the Feedbacks (PHP code) and Client Actions (JS code)
          $this->needFeedbacks = [];
          $this->needClientActions = [];
          foreach ( $toolCalls as $toolCall ) {
            if ( $toolCall['function']->target !== 'js' ) {
              $this->needFeedbacks[] = $toolCall;
            }
            else if ( $toolCall['function']->target === 'js' ) {
              $this->needClientActions[] = $toolCall;
            }
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