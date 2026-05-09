<?php

class Meow_MWAI_Engines_XAI extends Meow_MWAI_Engines_ChatML {
  public function __construct( $core, $env ) {
    parent::__construct( $core, $env );
  }

  protected function set_environment() {
    $env = $this->env;
    $this->apiKey = $env['apikey'] ?? null;
  }

  protected function get_service_name() {
    return 'xAI';
  }

  public function get_models() {
    // Prefer dynamically-fetched models when available (the env was synced against /v1/models).
    // Fall back to the static list so users on accounts that haven't synced (or that errored out
    // during sync) can still resolve well-known Grok model ids.
    $dynamic = $this->core->get_engine_models( 'xai' );
    if ( !empty( $dynamic ) ) {
      return $dynamic;
    }
    return apply_filters( 'mwai_xai_models', MWAI_XAI_MODELS );
  }

  public static function get_models_static() {
    return MWAI_XAI_MODELS;
  }

  protected function build_url( $query, $endpoint = null ) {
    $endpoint = apply_filters( 'mwai_xai_endpoint', 'https://api.x.ai/v1', $this->env );
    $endpoint = rtrim( $endpoint, '/' );
    if ( $query instanceof Meow_MWAI_Query_Text || $query instanceof Meow_MWAI_Query_Feedback ) {
      return $endpoint . '/chat/completions';
    }
    if ( $query instanceof Meow_MWAI_Query_Embed ) {
      return $endpoint . '/embeddings';
    }
    throw new Exception( 'Unsupported query type for xAI.' );
  }

  protected function build_headers( $query ) {
    if ( $query->apiKey ) {
      $this->apiKey = $query->apiKey;
    }
    if ( empty( $this->apiKey ) ) {
      throw new Exception( 'No xAI API Key provided. Please check your settings.' );
    }
    return [
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer ' . $this->apiKey,
      'User-Agent' => 'AI Engine',
    ];
  }

  protected function build_body( $query, $streamCallback = null, $extra = null ) {
    $body = parent::build_body( $query, $streamCallback, $extra );

    // xAI follows OpenAI's older Chat Completions schema: it expects max_tokens,
    // not max_completion_tokens.
    if ( isset( $body['max_completion_tokens'] ) ) {
      $body['max_tokens'] = $body['max_completion_tokens'];
      unset( $body['max_completion_tokens'] );
    }

    return $body;
  }

  /**
   * Map an xAI model id to a human-readable display name.
   * xAI ids vary in shape: grok-4, grok-4-0709 (date-stamped), grok-4-1-fast-reasoning,
   * grok-4.20-0309-non-reasoning, grok-4.3 (dot-versioned). We try to keep variants
   * distinguishable in the model dropdown without leaking internal date stamps as version numbers.
   */
  private function generate_human_readable_name( $modelId ) {
    if ( strpos( $modelId, 'grok-code' ) !== false ) {
      return 'Grok Code Fast';
    }

    // Grok 4 variants — try to capture both dotted ("4.20", "4.3") and dashed ("4-1") versions.
    if ( strpos( $modelId, 'grok-4' ) === 0 ) {
      $name = 'Grok 4';
      if ( preg_match( '/^grok-4\.(\d+)/', $modelId, $m ) ) {
        $name = 'Grok 4.' . $m[1];
      }
      elseif ( preg_match( '/^grok-4-(\d{1,2})(?:-|$)/', $modelId, $m ) ) {
        // Treat trailing 4-digit groups as date stamps, not versions.
        if ( strlen( $m[1] ) <= 2 ) {
          $name = 'Grok 4.' . $m[1];
        }
      }
      if ( strpos( $modelId, 'heavy' ) !== false ) { $name .= ' Heavy'; }
      elseif ( strpos( $modelId, 'fast' ) !== false ) { $name .= ' Fast'; }
      if ( strpos( $modelId, 'multi-agent' ) !== false ) { $name .= ' Multi-Agent'; }
      if ( strpos( $modelId, 'non-reasoning' ) !== false ) {
        $name .= ' (Standard)';
      }
      elseif ( strpos( $modelId, 'reasoning' ) !== false ) {
        $name .= ' (Reasoning)';
      }
      elseif ( preg_match( '/-(\d{4})$/', $modelId, $m ) ) {
        // Date-stamped release like grok-4-0709 → "Grok 4 (0709)".
        $name .= ' (' . $m[1] . ')';
      }
      return $name;
    }

    if ( strpos( $modelId, 'grok-3-mini' ) !== false ) { return 'Grok 3 Mini'; }
    if ( strpos( $modelId, 'grok-3' ) !== false ) { return 'Grok 3'; }
    if ( strpos( $modelId, 'grok-2-vision' ) !== false ) { return 'Grok 2 Vision'; }
    if ( strpos( $modelId, 'grok-2' ) !== false ) { return 'Grok 2'; }

    return ucwords( str_replace( [ '-', '_' ], ' ', $modelId ) );
  }

  /**
   * Estimate per-million-token pricing for an xAI model. xAI's /models endpoint
   * returns prices in cents per token, but the field is not always populated, so
   * we keep an internal mapping as a fallback.
   */
  private function estimate_pricing( $modelId, $remote ) {
    if ( isset( $remote['prompt_text_token_price'] ) && isset( $remote['completion_text_token_price'] ) ) {
      // xAI returns prices in cents per token. Convert to USD per million tokens.
      $in = ( (float) $remote['prompt_text_token_price'] ) / 100 * 1000000;
      $out = ( (float) $remote['completion_text_token_price'] ) / 100 * 1000000;
      return [ 'in' => round( $in, 4 ), 'out' => round( $out, 4 ) ];
    }
    if ( strpos( $modelId, 'grok-4-heavy' ) !== false ) {
      return [ 'in' => 5.00, 'out' => 25.00 ];
    }
    if ( strpos( $modelId, 'grok-4-fast' ) !== false ) {
      return [ 'in' => 0.20, 'out' => 0.50 ];
    }
    if ( strpos( $modelId, 'grok-4' ) !== false ) {
      return [ 'in' => 3.00, 'out' => 15.00 ];
    }
    if ( strpos( $modelId, 'grok-code' ) !== false ) {
      return [ 'in' => 0.20, 'out' => 1.50 ];
    }
    if ( strpos( $modelId, 'grok-3-mini' ) !== false ) {
      return [ 'in' => 0.30, 'out' => 0.50 ];
    }
    if ( strpos( $modelId, 'grok-3' ) !== false ) {
      return [ 'in' => 3.00, 'out' => 15.00 ];
    }
    return [ 'in' => 1.00, 'out' => 3.00 ];
  }

  /**
   * Retrieve the available models from xAI's /v1/models endpoint.
   */
  public function retrieve_models() {
    try {
      $endpoint = apply_filters( 'mwai_xai_endpoint', 'https://api.x.ai/v1', $this->env );
      $url = rtrim( $endpoint, '/' ) . '/models';

      if ( empty( $this->apiKey ) ) {
        throw new Exception( 'No xAI API Key provided for model retrieval.' );
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
      if ( !isset( $body['data'] ) || !is_array( $body['data'] ) ) {
        throw new Exception( 'AI Engine: Invalid response for xAI models list.' );
      }

      $models = [];
      $seen = [];
      foreach ( $body['data'] as $remote ) {
        $modelId = $remote['id'] ?? '';
        if ( empty( $modelId ) || isset( $seen[$modelId] ) ) {
          continue;
        }
        $seen[$modelId] = true;

        // Skip image/video generation models — they don't speak the chat-completions schema
        // and would only confuse users showing up in chat dropdowns. xAI exposes them under
        // separate endpoints (/v1/images, /v1/videos) that AI Engine doesn't route here yet.
        if ( strpos( $modelId, 'grok-2-image' ) !== false
          || strpos( $modelId, 'grok-imagine' ) !== false
          || strpos( $modelId, '-video' ) !== false
          || strpos( $modelId, '-image' ) !== false ) {
          continue;
        }

        $isEmbedding = strpos( $modelId, 'embed' ) !== false;
        $isVision = strpos( $modelId, 'vision' ) !== false
          || ( isset( $remote['input_modalities'] ) && is_array( $remote['input_modalities'] )
               && in_array( 'image', $remote['input_modalities'], true ) );
        // Reasoning detection: explicit "non-reasoning" suffix wins over the family default.
        $isReasoning = false;
        if ( strpos( $modelId, 'non-reasoning' ) !== false ) {
          $isReasoning = false;
        }
        elseif ( strpos( $modelId, 'reasoning' ) !== false ) {
          $isReasoning = true;
        }
        elseif ( strpos( $modelId, 'grok-4' ) !== false || strpos( $modelId, 'grok-3-mini' ) !== false ) {
          $isReasoning = true;
        }

        $tags = [ 'core', $isEmbedding ? 'embedding' : 'chat' ];
        if ( !$isEmbedding ) {
          $tags[] = 'functions';
        }
        if ( $isVision ) {
          $tags[] = 'vision';
        }
        if ( $isReasoning ) {
          $tags[] = 'reasoning';
        }

        $features = $isEmbedding ? [ 'embedding' ] : [ 'completion' ];
        if ( !$isEmbedding ) {
          $features[] = 'functions';
        }

        $maxContext = isset( $remote['context_window'] ) ? (int) $remote['context_window']
          : ( strpos( $modelId, 'grok-4' ) !== false ? 256000 : 131072 );
        $maxCompletion = isset( $remote['max_output_tokens'] ) ? (int) $remote['max_output_tokens'] : 16384;

        $price = $this->estimate_pricing( $modelId, $remote );

        $modelData = [
          'model' => $modelId,
          'name' => $this->generate_human_readable_name( $modelId ),
          'family' => 'grok',
          'features' => $features,
          'price' => $price,
          'type' => 'token',
          'unit' => 1 / 1000000,
          'maxCompletionTokens' => $maxCompletion,
          'maxContextualTokens' => $maxContext,
          'tags' => $tags,
        ];

        if ( $isEmbedding ) {
          $modelData['dimensions'] = isset( $remote['dimensions'] ) ? (int) $remote['dimensions'] : 1024;
        }

        $models[] = $modelData;
      }

      return $models;
    }
    catch ( Exception $e ) {
      Meow_MWAI_Logging::error( 'xAI: Failed to retrieve models: ' . $e->getMessage() );
      return [];
    }
  }

  /**
   * Connection check for the xAI API.
   *
   * We hit /v1/models directly here (rather than going through retrieve_models()) so the user
   * sees actual error messages from xAI (e.g. "team has no credits") instead of an empty
   * model list that looks like success.
   */
  public function connection_check() {
    $endpoint = apply_filters( 'mwai_xai_endpoint', 'https://api.x.ai/v1', $this->env );
    $url = rtrim( $endpoint, '/' ) . '/models';
    $details = [ 'endpoint' => $url ];

    if ( empty( $this->apiKey ) ) {
      return [
        'success' => false, 'service' => 'xAI',
        'error' => 'No xAI API Key configured.',
        'details' => $details,
      ];
    }

    $response = wp_remote_get( $url, [
      'headers' => [ 'Authorization' => 'Bearer ' . $this->apiKey, 'User-Agent' => 'AI Engine' ],
      'timeout' => 10, 'sslverify' => MWAI_SSL_VERIFY,
    ] );

    if ( is_wp_error( $response ) ) {
      return [
        'success' => false, 'service' => 'xAI',
        'error' => $response->get_error_message(),
        'details' => $details,
      ];
    }

    $code = wp_remote_retrieve_response_code( $response );
    $body = json_decode( wp_remote_retrieve_body( $response ), true );

    if ( $code >= 400 || ( is_array( $body ) && isset( $body['error'] ) ) ) {
      $message = is_array( $body ) && isset( $body['error'] )
        ? ( is_string( $body['error'] ) ? $body['error'] : json_encode( $body['error'] ) )
        : "HTTP {$code} from xAI.";
      return [
        'success' => false, 'service' => 'xAI',
        'error' => $message,
        'details' => array_merge( $details, [ 'http_code' => $code ] ),
      ];
    }

    $modelIds = [];
    if ( isset( $body['data'] ) && is_array( $body['data'] ) ) {
      foreach ( array_slice( $body['data'], 0, 5 ) as $m ) {
        if ( isset( $m['id'] ) ) {
          $modelIds[] = $m['id'];
        }
      }
    }
    return [
      'success' => true, 'service' => 'xAI',
      'message' => 'Connection successful. Found ' . count( $body['data'] ?? [] ) . ' models.',
      'details' => array_merge( $details, [
        'model_count' => count( $body['data'] ?? [] ),
        'sample_models' => $modelIds,
      ] ),
    ];
  }
}
