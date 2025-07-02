<?php

trait Meow_MWAI_Engines_Trait_Functions {
  /**
  * Check if model supports functions
  */
  protected function supports_functions( $model ) {
    // Get model info from core
    $models = $this->core->get_models();
    foreach ( $models as $m ) {
      if ( $m['model'] === $model ) {
        return !empty( $m['tags'] ) && in_array( 'functions', $m['tags'] );
      }
    }
    return false;
  }

  /**
  * Build function definitions for API
  */
  protected function build_function_definitions( $query ) {
    if ( empty( $query->functions ) ) {
      return null;
    }

    $tools = [];
    foreach ( $query->functions as $function ) {
      $tools[] = [
        'type' => 'function',
        'function' => [
          'name' => $function['name'],
          'description' => $function['description'] ?? '',
          'parameters' => $function['parameters'] ?? [
            'type' => 'object',
            'properties' => []
          ]
        ]
      ];
    }

    return $tools;
  }

  /**
  * Extract function calls from response
  */
  protected function extract_function_calls( $data ) {
    $calls = [];

    // OpenAI format
    if ( isset( $data['choices'][0]['message']['tool_calls'] ) ) {
      foreach ( $data['choices'][0]['message']['tool_calls'] as $tool_call ) {
        if ( $tool_call['type'] === 'function' ) {
          $calls[] = [
            'id' => $tool_call['id'],
            'name' => $tool_call['function']['name'],
            'arguments' => $tool_call['function']['arguments']
          ];
        }
      }
    }
    // Anthropic format
    elseif ( isset( $data['content'] ) ) {
      foreach ( $data['content'] as $content ) {
        if ( $content['type'] === 'tool_use' ) {
          $calls[] = [
            'id' => $content['id'],
            'name' => $content['name'],
            'arguments' => json_encode( $content['input'] )
          ];
        }
      }
    }

    return $calls;
  }

  /**
  * Build function result message
  */
  protected function build_function_result_message( $call_id, $result ) {
    return [
      'role' => 'tool',
      'tool_call_id' => $call_id,
      'content' => is_string( $result ) ? $result : json_encode( $result )
    ];
  }

  /**
  * Check if response contains function calls
  */
  protected function has_function_calls( $data ) {
    // OpenAI format
    if ( isset( $data['choices'][0]['message']['tool_calls'] ) ) {
      return count( $data['choices'][0]['message']['tool_calls'] ) > 0;
    }

    // Anthropic format
    if ( isset( $data['content'] ) ) {
      foreach ( $data['content'] as $content ) {
        if ( $content['type'] === 'tool_use' ) {
          return true;
        }
      }
    }

    // Google format
    if ( isset( $data['candidates'][0]['content']['parts'] ) ) {
      foreach ( $data['candidates'][0]['content']['parts'] as $part ) {
        if ( isset( $part['functionCall'] ) ) {
          return true;
        }
      }
    }

    return false;
  }
}
