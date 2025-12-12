<?php

class Meow_MWAI_Engines_Mistral extends Meow_MWAI_Engines_ChatML {

  public function __construct( $core, $env ) {
    parent::__construct( $core, $env );
  }

  protected function set_environment() {
    $env = $this->env;
    $this->apiKey = $env['apikey'] ?? null;
  }

  protected function get_service_name() {
    return 'Mistral';
  }

  public function get_models() {
    // Return dynamically fetched models only
    return $this->core->get_engine_models( 'mistral' );
  }

  public static function get_models_static() {
    return MWAI_MISTRAL_MODELS;
  }

  protected function build_url( $query, $endpoint = null ) {
    $endpoint = apply_filters( 'mwai_mistral_endpoint', 'https://api.mistral.ai/v1', $this->env );

    if ( $query instanceof Meow_MWAI_Query_Text || $query instanceof Meow_MWAI_Query_Feedback ) {
      return $endpoint . '/chat/completions';
    }
    else if ( $query instanceof Meow_MWAI_Query_Embed ) {
      return $endpoint . '/embeddings';
    }
    else {
      throw new Exception( 'Unsupported query type for Mistral.' );
    }
  }

  protected function build_headers( $query ) {
    if ( $query->apiKey ) {
      $this->apiKey = $query->apiKey;
    }
    if ( empty( $this->apiKey ) ) {
      throw new Exception( 'No Mistral API Key provided. Please check your settings.' );
    }
    return [
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer ' . $this->apiKey,
      'User-Agent' => 'AI Engine',
    ];
  }

  protected function build_messages( $query ) {
    $messages = parent::build_messages( $query );

    // For feedback queries with tool results, ensure proper format for Mistral
    if ( $query instanceof Meow_MWAI_Query_Feedback ) {
      foreach ( $messages as &$message ) {
        // Mistral expects tool messages to have specific format
        if ( isset( $message['role'] ) && $message['role'] === 'tool' ) {
          // Ensure content is never empty
          if ( empty( $message['content'] ) ) {
            $message['content'] = json_encode( [ 'result' => 'success' ] );
          }
          // Ensure content is a string (Mistral requirement)
          if ( !is_string( $message['content'] ) ) {
            $message['content'] = json_encode( $message['content'] );
          }
        }
      }
    }

    return $messages;
  }

  protected function build_body( $query, $streamCallback = null, $extra = null ) {
    // Use parent's build_body for standard ChatML format
    $body = parent::build_body( $query, $streamCallback, $extra );

    // Mistral uses 'max_tokens' instead of 'max_completion_tokens'
    if ( isset( $body['max_completion_tokens'] ) ) {
      $body['max_tokens'] = $body['max_completion_tokens'];
      unset( $body['max_completion_tokens'] );
    }

    // TEMPORARILY DISABLED: Function calling for Mistral
    // Remove tools/functions from the request until feedback loop is properly debugged
    if ( isset( $body['tools'] ) ) {
      unset( $body['tools'] );
    }
    if ( isset( $body['tool_choice'] ) ) {
      unset( $body['tool_choice'] );
    }

    return $body;
  }

  /**
   * Generate a human-readable name from model ID
   * Based on Mistral's official naming conventions
   */
  private function generate_human_readable_name( $modelId ) {
    // Extract version from model ID (e.g., "2508" becomes "25.08")
    $versionMatch = [];
    preg_match( '/(\d{4})$/', $modelId, $versionMatch );
    $version = isset( $versionMatch[1] ) ?
               substr( $versionMatch[1], 0, 2 ) . '.' . substr( $versionMatch[1], 2 ) : '';

    // Handle special cases for latest versions
    if ( strpos( $modelId, '-latest' ) !== false ) {
      $modelId = str_replace( '-latest', '', $modelId );
      $version = 'Latest';
    }

    // Build the base name
    $name = '';

    // Magistral models (reasoning)
    if ( strpos( $modelId, 'magistral' ) !== false ) {
      if ( strpos( $modelId, 'medium' ) !== false ) {
        $name = 'Magistral Medium';
      } else if ( strpos( $modelId, 'small' ) !== false ) {
        $name = 'Magistral Small';
      }
      // Add version number for Magistral
      // No version suffix for latest models
    }
    // Mistral models
    else if ( strpos( $modelId, 'mistral' ) !== false ) {
      if ( strpos( $modelId, 'large' ) !== false ) {
        $name = 'Mistral Large';
      } else if ( strpos( $modelId, 'medium' ) !== false ) {
        $name = 'Mistral Medium';
      } else if ( strpos( $modelId, 'small' ) !== false ) {
        $name = 'Mistral Small';
      } else if ( strpos( $modelId, 'saba' ) !== false ) {
        $name = 'Mistral Saba';
      } else if ( strpos( $modelId, 'tiny' ) !== false || strpos( $modelId, 'nemo' ) !== false ) {
        $name = 'Mistral Nemo';
      } else if ( strpos( $modelId, 'embed' ) !== false ) {
        $name = 'Mistral Embed';
      }
    }
    // Pixtral models (vision)
    else if ( strpos( $modelId, 'pixtral' ) !== false ) {
      if ( strpos( $modelId, 'large' ) !== false ) {
        $name = 'Pixtral Large';
      } else if ( strpos( $modelId, '12b' ) !== false ) {
        $name = 'Pixtral 12B';
      }
      // No (Latest) suffix needed
    }
    // Codestral models (code)
    else if ( strpos( $modelId, 'codestral' ) !== false ) {
      if ( strpos( $modelId, 'embed' ) !== false ) {
        $name = 'Codestral Embed';
      } else {
        $name = 'Codestral';
        // No version suffix for Codestral
      }
    }
    // Devstral models (dev tools)
    else if ( strpos( $modelId, 'devstral' ) !== false ) {
      if ( strpos( $modelId, 'medium' ) !== false ) {
        $name = 'Devstral Medium';
      } else if ( strpos( $modelId, 'small' ) !== false ) {
        $name = 'Devstral Small';
        // No version suffix for Devstral
      }
      // No (Latest) suffix needed
    }
    // Ministral models (edge)
    else if ( strpos( $modelId, 'ministral' ) !== false ) {
      if ( strpos( $modelId, '8b' ) !== false ) {
        $name = 'Ministral 8B';
      } else if ( strpos( $modelId, '3b' ) !== false ) {
        $name = 'Ministral 3B';
      }
      // No (Latest) suffix needed
    }
    // Voxtral models (audio)
    else if ( strpos( $modelId, 'voxtral' ) !== false ) {
      if ( strpos( $modelId, 'small' ) !== false ) {
        $name = 'Voxtral Small';
      } else if ( strpos( $modelId, 'mini' ) !== false ) {
        $name = 'Voxtral Mini';
      }
      if ( strpos( $modelId, 'transcribe' ) !== false ) {
        $name .= ' Transcribe';
      }
    }
    // Open models
    else if ( strpos( $modelId, 'open-' ) === 0 ) {
      if ( strpos( $modelId, 'mistral-7b' ) !== false ) {
        $name = 'Mistral 7B (Open)';
      } else if ( strpos( $modelId, 'mistral-nemo' ) !== false ) {
        $name = 'Mistral Nemo (Open)';
      } else if ( strpos( $modelId, 'mixtral-8x7b' ) !== false ) {
        $name = 'Mixtral 8x7B (Open)';
      } else if ( strpos( $modelId, 'mixtral-8x22b' ) !== false ) {
        $name = 'Mixtral 8x22B (Open)';
      }
    }

    // Fallback to cleaned model ID if no pattern matches
    if ( empty( $name ) ) {
      $name = ucwords( str_replace( ['-', '_'], ' ', $modelId ) );
    }

    return $name;
  }

  /**
   * Retrieve the models from Mistral API
   * Mistral supports a models endpoint similar to OpenAI
   */
  public function retrieve_models() {
    try {
      $endpoint = apply_filters( 'mwai_mistral_endpoint', 'https://api.mistral.ai/v1', $this->env );
      $url = $endpoint . '/models';

      if ( empty( $this->apiKey ) ) {
        throw new Exception( 'No Mistral API Key provided for model retrieval.' );
      }

      $options = [
        'headers' => [
          'Authorization' => 'Bearer ' . $this->apiKey,
          'User-Agent' => 'AI Engine'
        ],
        'timeout' => 10,
        'sslverify' => MWAI_SSL_VERIFY
      ];

      $response = wp_remote_get( $url, $options );

      if ( is_wp_error( $response ) ) {
        throw new Exception( 'AI Engine: ' . $response->get_error_message() );
      }

      $body = json_decode( $response['body'], true );

      // Debug: Log the complete models response from Mistral
      // error_log( "AI Engine: Mistral Models Response:\n" . print_r( $body, true ) );

      if ( !isset( $body['data'] ) || !is_array( $body['data'] ) ) {
        throw new Exception( 'AI Engine: Invalid response for Mistral models list.' );
      }

      $models = [];
      $seenModels = []; // Track models we've already added to avoid duplicates

      foreach ( $body['data'] as $model ) {
        $modelId = $model['id'] ?? '';

        // Generate human-readable name based on model ID
        $modelName = $this->generate_human_readable_name( $modelId );

        // Skip if we've already seen this model name (to avoid alias duplicates)
        if ( isset( $seenModels[$modelName] ) ) {
          continue;
        }

        // Skip specialized models that shouldn't appear in general chat lists
        // These are models for specific tasks like moderation, OCR, transcription
        $skipPatterns = [
          'moderation',      // Moderation models
          'ocr',            // OCR-specific models
          'transcribe',     // Transcription-specific models
          'mistral-embed',  // Legacy embed model (we'll include newer ones)
          'codestral-embed' // Code-specific embed model
        ];

        $shouldSkip = false;
        foreach ( $skipPatterns as $pattern ) {
          if ( strpos( $modelId, $pattern ) !== false ) {
            $shouldSkip = true;
            break;
          }
        }
        if ( $shouldSkip ) {
          continue;
        }

        // Skip models that are just aliases (they appear in other model's aliases array)
        // We'll keep the primary model, not the alias entries
        $isAlias = false;
        if ( isset( $model['aliases'] ) && is_array( $model['aliases'] ) && count( $model['aliases'] ) > 0 ) {
          // If this model ID appears in its own aliases, it's likely an alias entry
          foreach ( $model['aliases'] as $alias ) {
            if ( $alias !== $modelId && isset( $seenModels[$alias] ) ) {
              $isAlias = true;
              break;
            }
          }
        }
        if ( $isAlias ) {
          continue;
        }

        // Set defaults based on model type
        $maxCompletionTokens = 32768;
        $maxContextualTokens = 128000;
        $features = ['completion'];
        $tags = ['core', 'chat'];

        // Parse capabilities from the API response
        $capabilities = $model['capabilities'] ?? [];

        // TEMPORARILY DISABLED: Function calling tags
        // Not adding 'functions' tag since function calling is disabled for Mistral
        // if ( in_array( 'function_calling', $capabilities ) ||
        //      ( isset( $model['supports_tool_choice'] ) && $model['supports_tool_choice'] ) ) {
        //   $tags[] = 'functions';
        //   $features[] = 'functions';
        // }

        // Check for vision capability
        if ( in_array( 'vision', $capabilities ) ) {
          $tags[] = 'vision';
        }

        // Check for embeddings capability
        // Skip older embedding models in favor of newer ones
        if ( strpos( $modelId, 'embed' ) !== false ) {
          // Only include the latest embed models
          if ( $modelId === 'mistral-embed-2312' || $modelId === 'mistral-embed' ) {
            continue; // Skip legacy embed models
          }
          $features = ['embedding'];
          $tags = ['core', 'embedding'];
        }

        // Check for audio capability (voxtral models for chat, not transcription)
        $capabilities = $model['capabilities'] ?? [];
        if ( isset( $capabilities['audio'] ) && $capabilities['audio'] &&
             strpos( $modelId, 'transcribe' ) === false ) {
          $tags[] = 'audio';
        }

        // Use max_tokens if available
        if ( isset( $model['max_tokens'] ) ) {
          $maxCompletionTokens = (int) $model['max_tokens'];
        }

        // Use context_length if available
        if ( isset( $model['max_context_length'] ) ) {
          $maxContextualTokens = (int) $model['max_context_length'];
        } else if ( isset( $model['context_window'] ) ) {
          $maxContextualTokens = (int) $model['context_window'];
        }

        // Determine pricing based on model (prices per million tokens)
        $priceIn = 0;
        $priceOut = 0;

        // Updated Mistral pricing (as of 2025)
        if ( strpos( $modelId, 'magistral' ) !== false ) {
          // Magistral reasoning models
          if ( strpos( $modelId, 'medium' ) !== false ) {
            $priceIn = 4.00;
            $priceOut = 12.00;
          } else {
            $priceIn = 2.00;
            $priceOut = 6.00;
          }
        } else if ( strpos( $modelId, 'mistral-large' ) !== false || strpos( $modelId, 'pixtral-large' ) !== false ) {
          $priceIn = 3.00;
          $priceOut = 9.00;
        } else if ( strpos( $modelId, 'mistral-medium' ) !== false ) {
          $priceIn = 2.70;
          $priceOut = 8.10;
        } else if ( strpos( $modelId, 'mistral-small' ) !== false ) {
          $priceIn = 1.00;
          $priceOut = 3.00;
        } else if ( strpos( $modelId, 'codestral' ) !== false ) {
          if ( strpos( $modelId, '2501' ) !== false || strpos( $modelId, '2508' ) !== false ) {
            $priceIn = 0.30;
            $priceOut = 0.90;
          } else {
            $priceIn = 1.00;
            $priceOut = 3.00;
          }
        } else if ( strpos( $modelId, 'devstral' ) !== false ) {
          $priceIn = 0.50;
          $priceOut = 1.50;
        } else if ( strpos( $modelId, 'ministral' ) !== false ) {
          $priceIn = 0.10;
          $priceOut = 0.10;
        } else if ( strpos( $modelId, 'pixtral-12b' ) !== false ) {
          $priceIn = 0.15;
          $priceOut = 0.15;
        } else if ( strpos( $modelId, 'voxtral' ) !== false ) {
          $priceIn = 0.50;
          $priceOut = 1.50;
        } else if ( strpos( $modelId, 'mistral-saba' ) !== false ) {
          $priceIn = 0.20;
          $priceOut = 0.60;
        } else if ( strpos( $modelId, 'open-mistral' ) !== false || strpos( $modelId, 'mistral-tiny' ) !== false ) {
          $priceIn = 0.15;
          $priceOut = 0.15;
        } else if ( strpos( $modelId, 'open-mixtral-8x7b' ) !== false ) {
          $priceIn = 0.50;
          $priceOut = 0.50;
        } else if ( strpos( $modelId, 'open-mixtral-8x22b' ) !== false ) {
          $priceIn = 0.90;
          $priceOut = 0.90;
        } else if ( strpos( $modelId, 'embed' ) !== false ) {
          $priceIn = 0.10;
          $priceOut = 0.00;
        } else {
          // Default pricing for unknown models
          $priceIn = 1.00;
          $priceOut = 3.00;
        }

        // Mark this model as seen
        $seenModels[$modelName] = true;

        // Only include latest models and key open-source versions
        // This keeps the list clean and manageable
        $preferredModels = [
          // Latest versions (primary models)
          'mistral-large-latest',
          'mistral-medium-latest',
          'mistral-small-latest',
          'mistral-tiny-latest',
          'mistral-saba-latest',
          'pixtral-large-latest',
          'pixtral-12b-latest',
          'codestral-latest',
          'devstral-small-latest',
          'devstral-medium-latest',
          'magistral-medium-latest',
          'magistral-small-latest',
          'voxtral-small-latest',
          'voxtral-mini-latest',
          'ministral-3b-latest',
          'ministral-8b-latest',
          // Open-source models (always include)
          'open-mistral-7b',
          'open-mistral-nemo',
          'open-mixtral-8x7b',
          'open-mixtral-8x22b'
        ];

        // We're focusing on latest versions, so no versioned models
        $versionedModels = [];

        // Check if this is a model we want to include
        $includeModel = in_array( $modelId, $preferredModels ) ||
                       in_array( $modelId, $versionedModels ) ||
                       strpos( $modelId, 'embed' ) !== false; // Always include embedding models

        if ( !$includeModel ) {
          continue;
        }

        $models[] = [
          'model' => $modelId,
          'name' => $modelName,
          'family' => 'mistral',
          'features' => $features,
          'price' => [
            'in' => $priceIn,
            'out' => $priceOut,
          ],
          'type' => 'token',
          'unit' => 1 / 1000000,
          'maxCompletionTokens' => $maxCompletionTokens,
          'maxContextualTokens' => $maxContextualTokens,
          'tags' => $tags,
        ];
      }

      return $models;
    }
    catch ( Exception $e ) {
      Meow_MWAI_Logging::error( 'Mistral: Failed to retrieve models: ' . $e->getMessage() );
      // Return empty array on error - models must be fetched from API
      return [];
    }
  }


  /**
   * Connection check for Mistral API
   * Tests the API key by listing models
   */
  public function connection_check() {
    try {
      // Use the retrieve_models method to check connection
      $models = $this->retrieve_models();

      if ( !is_array( $models ) ) {
        throw new Exception( 'Invalid response format from Mistral' );
      }

      $modelCount = count( $models );
      $availableModels = [];

      // Get first 5 models for display
      $displayModels = array_slice( $models, 0, 5 );
      foreach ( $displayModels as $model ) {
        if ( isset( $model['model'] ) ) {
          $availableModels[] = $model['model'];
        }
      }

      return [
        'success' => true,
        'service' => 'Mistral',
        'message' => "Connection successful. Found {$modelCount} models.",
        'details' => [
          'endpoint' => 'https://api.mistral.ai/v1/models',
          'model_count' => $modelCount,
          'sample_models' => $availableModels
        ]
      ];
    }
    catch ( Exception $e ) {
      return [
        'success' => false,
        'service' => 'Mistral',
        'error' => $e->getMessage(),
        'details' => [
          'endpoint' => 'https://api.mistral.ai/v1/models'
        ]
      ];
    }
  }
}