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
    'accuracy' => 'none', // 'none', 'estimated', 'tokens', 'price', 'full'
  ];
  public $query = null;
  public $type = 'text';
  public $model = null; // Actual model used by the API (may differ from query model)

  // Code interpreter code (separate from main content)
  public $contentCode = '';

  // Engine-specific extras kept on the reply during a single request (e.g. Google
  // stores generated images, thoughts and grounding metadata here). Declared so PHP
  // 8.2+ does not warn about dynamic property creation.
  public $extraData = [];

  // This is when models return a message that needs to be executed (functions, tools, etc)
  public $needFeedbacks = [];
  public $needClientActions = [];

  // Tool/function calls actually executed during this turn, oldest first. Accumulated
  // across the recursive feedback rounds (see Meow_MWAI_Engines_Core::run) so the final
  // reply carries the whole chain, then stored in the discussion for the admin UI.
  // Not exposed in jsonSerialize on purpose: arguments and results stay server-side.
  public $toolCalls = [];

  // What is KEPT for the discussion, not what is sent to the model: the request itself is
  // untouched. These are copies written into mwai_chats.messages for the admin UI, so an
  // MCP tool returning hundreds of KB, or a wp_write_blocks call carrying a whole article,
  // would otherwise be duplicated into the discussion row and stay there forever.
  public const TOOL_CALL_RESULT_LIMIT = 500;
  // Long argument values are cut individually rather than by chopping the encoded blob:
  // the panel shows the parameter names and pretty-prints the JSON, so the structure has
  // to survive. Keys and scalars stay intact; only long strings shrink.
  public const TOOL_CALL_ARG_VALUE_LIMIT = 200;
  // Backstop for arguments made of many small values rather than one big one.
  public const TOOL_CALL_ARGS_TOTAL_LIMIT = 4000;

  public function __construct( $query = null ) {
    $this->query = $query;
  }

  // Cut a string on a character boundary, so a truncated UTF-8 value never ends in a
  // broken sequence that would make the stored JSON unreadable.
  private static function truncate_text( $text, $limit ) {
    if ( function_exists( 'mb_substr' ) ) {
      if ( mb_strlen( $text, 'UTF-8' ) <= $limit ) {
        return $text;
      }
      return mb_substr( $text, 0, $limit, 'UTF-8' );
    }
    if ( strlen( $text ) <= $limit ) {
      return $text;
    }
    return substr( $text, 0, $limit );
  }

  private static function shrink_tool_arguments( $value, $depth = 0 ) {
    if ( $depth > 6 ) {
      return '[…]';
    }
    if ( is_array( $value ) ) {
      $out = [];
      foreach ( $value as $key => $item ) {
        $out[$key] = self::shrink_tool_arguments( $item, $depth + 1 );
      }
      return $out;
    }
    if ( is_string( $value ) && strlen( $value ) > self::TOOL_CALL_ARG_VALUE_LIMIT ) {
      // Say how much was dropped, so the panel never looks like the AI sent a short value.
      return self::truncate_text( $value, self::TOOL_CALL_ARG_VALUE_LIMIT )
        . '… [truncated, ' . size_format( strlen( $value ) ) . ']';
    }
    return $value;
  }

  public function add_tool_call( $name, $arguments = null, $result = null, $success = true ) {
    $preview = is_string( $result ) ? $result : json_encode( $result );
    if ( !is_string( $preview ) ) {
      $preview = '';
    }
    if ( strlen( $preview ) > self::TOOL_CALL_RESULT_LIMIT ) {
      $preview = self::truncate_text( $preview, self::TOOL_CALL_RESULT_LIMIT ) . '...';
    }
    $arguments = is_array( $arguments ) ? self::shrink_tool_arguments( $arguments ) : [];
    // Many small values can still add up; fall back to the parameter names alone. Only
    // the first few, because a call with hundreds of keys would otherwise produce a
    // "summary" larger than the payload it replaces.
    $encoded = json_encode( $arguments );
    if ( is_string( $encoded ) && strlen( $encoded ) > self::TOOL_CALL_ARGS_TOTAL_LIMIT ) {
      $keys = array_keys( $arguments );
      $shown = array_slice( $keys, 0, 20 );
      $summary = implode( ', ', $shown );
      if ( count( $keys ) > count( $shown ) ) {
        $summary .= ', and ' . ( count( $keys ) - count( $shown ) ) . ' more';
      }
      $arguments = [ '_truncated' => 'Arguments too large to store. Parameters: ' . $summary ];
    }
    $this->toolCalls[] = [
      'name' => (string) $name,
      'arguments' => $arguments,
      'result' => $preview,
      'success' => (bool) $success,
    ];
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
    if ( !empty( $this->contentCode ) ) {
      $data['contentCode'] = $this->contentCode;
    }
    return $data;
  }

  public function set_usage( $usage ) {
    $this->usage = $usage;
  }

  public function set_usage_accuracy( $accuracy ) {
    $this->usage['accuracy'] = $accuracy;
  }

  public function set_id( $id ) {
    $this->id = $id;
  }

  public function set_type( $type ) {
    $this->type = $type;
  }

  public function set_model( $model ) {
    $this->model = $model;
  }

  public function get_total_tokens() {
    return isset( $this->usage['total_tokens'] ) ? $this->usage['total_tokens'] : 0;
  }

  public function get_in_tokens( $query = null ) {
    $in_tokens = isset( $this->usage['prompt_tokens'] ) ? $this->usage['prompt_tokens'] : 0;
    if ( empty( $in_tokens ) && $query ) {
      $in_tokens = $query->get_in_tokens();
    }
    return $in_tokens;
  }

  public function get_out_tokens() {
    $out_tokens = isset( $this->usage['completion_tokens'] ) ? $this->usage['completion_tokens'] : 0;
    if ( empty( $out_tokens ) ) {
      // NOTE: Only estimate when result is actually text. Embedding replies hold a
      // float vector, image replies hold URLs/arrays, etc. Running estimate_tokens()
      // on those JSON-encodes the structure and produces huge bogus counts (a 3072-d
      // Gemini embedding estimated as ~13k tokens for a 50-char input). Anything that
      // isn't a string has no meaningful "output token" count, so return 0.
      if ( !is_string( $this->result ) ) {
        return 0;
      }
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

  public function get_usage_accuracy() {
    return $this->usage['accuracy'] ?? 'none';
  }

  /**
   * Returns the metric count for this reply, preferring tokens. Falls back to
   * images or seconds for non-token-billed providers (legacy Imagen/Replicate
   * per-image, Whisper, Sora). Equivalent to (and aliased by) get_units().
   */
  public function get_tokens() {
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

  /**
   * Legacy alias for get_tokens(). Kept indefinitely because third-party code
   * reachable via the mwai_ai_reply filter may call it.
   */
  public function get_units() {
    return $this->get_tokens();
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
    $this->results = array_map( function ( $result ) use ( $search, $replace ) {
      return str_replace( $search, $replace, $result );
    }, $this->results );
  }

  private function extract_arguments( $funcArgs ) {
    $finalArgs = [];
    if ( is_string( $funcArgs ) ) {
      $arguments = trim( str_replace( "\n", '', $funcArgs ) );
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
  public function set_choices( $choices, $rawMessage = null ) {
    $this->results = [];

    // Initialize feedback arrays at the start to accumulate across all choices
    // This is important for engines like Google that split multiple function calls
    // into separate choices
    $this->needFeedbacks = [];
    $this->needClientActions = [];

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
                $toolCall = [
                  'toolId' => $tool['id'],
                  //'mode' => 'interactive',
                  'type' => 'tool_call',
                  'name' => trim( $tool['function']['name'] ),
                  'arguments' => $this->extract_arguments( $tool['function']['arguments'] ),
                  // Represent the original message that triggered the function call
                  'rawMessage' => $rawMessage ? $rawMessage : ( isset( $choice['_rawMessage'] ) ? $choice['_rawMessage'] : $choice['message'] ),
                ];
                $toolCalls[] = $toolCall;
              }
            }
          }

          // If it's a function call (Open-AI style; usually for a final execution)
          if ( isset( $choice['message']['function_call'] ) ) {
            $content = $choice['message']['function_call'];
            $name = trim( $content['name'] );
            $args = $content['arguments'] ?? $content['args'] ?? null;
            $toolCalls[] = [
              'toolId' => null,
              'mode' => 'static',
              'type' => 'function_call',
              'name' => $name,
              'arguments' => $this->extract_arguments( $args ),
              'rawMessage' => $rawMessage ? $rawMessage : ( isset( $choice['_rawMessage'] ) ? $choice['_rawMessage'] : $choice['message'] ),
            ];
          }

          // Deep copy tool calls BEFORE adding function references
          // This prevents the "Duplicate value for 'tool_call_id'" error
          // when the same function is called multiple times
          // Note: We need to preserve the toolId for each tool call
          if ( !empty( $toolCalls ) ) {
            $toolCalls = json_decode( json_encode( $toolCalls ), true );
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
            // IMPORTANT: Unset the reference to avoid PHP's foreach reference bug
            unset( $toolCall );
          }

          // Add tool calls to existing arrays instead of resetting them
          // This is crucial for engines like Google that create multiple choices
          // for multiple function calls in a single response
          foreach ( $toolCalls as $tcIdx => $toolCall ) {
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
        else if ( isset( $choice['b64_json'] ) ) {
          // In that case we need to create a temporary file in WordPress to store the image, and return the URL for it.
          global $mwai_core;

          // Check if the query has explicitly disabled local download
          if ( !empty( $this->query ) && $this->query instanceof Meow_MWAI_Query_Image && $this->query->localDownload === null ) {
            // Query explicitly doesn't want local download, save as temporary upload
            $localDownload = 'uploads';
            $expiry = 1 * HOUR_IN_SECONDS; // 1 hour for temporary images
          }
          else {
            // Use the user's AI-generated image settings. The Expiration
            // setting displays "Never" as its default, so an unset option must
            // mean never; letting it fall through to the uploaded-files TTL
            // (1 hour) silently rotted images out of stored conversations.
            $localDownload = $mwai_core->get_option( 'image_local_download' );
            $expiryOption = $mwai_core->get_option( 'image_expires_download' );
            $expiry = ( empty( $expiryOption ) || strtolower( (string) $expiryOption ) === 'never' )
              ? 'never' : (int) $expiryOption;
          }

          // The expiry is in seconds, or 'never'.
          $ttl = $expiry;

          // Use 'library' or 'uploads' based on user settings
          $target = ( $localDownload === 'library' ) ? 'library' : 'uploads';

          // Prepare metadata similar to regular image queries
          $metadata = [];
          if ( !empty( $this->query ) ) {
            $metadata['query_envId'] = $this->query->envId ?? null;
            $metadata['query_session'] = $this->query->session ?? null;
            $metadata['query_model'] = $this->query->model ?? 'gpt-image-1';
          }

          $url = $mwai_core->files->save_temp_image_from_b64( $choice['b64_json'], 'generated', $ttl, $target, $metadata );
          if ( is_wp_error( $url ) ) {
            return $url;
          }
          $this->results[] = $url;

          // For chatbot display, append image markdown to the result
          if ( !empty( $this->result ) ) {
            $this->result .= "\n\n";
          }
          $this->result .= "![Generated Image]($url)";
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
