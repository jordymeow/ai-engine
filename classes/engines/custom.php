<?php

/**
 * Generic OpenAI-compatible engine. Lets users point AI Engine at any server that speaks the
 * OpenAI Chat Completions API (Ollama, LM Studio, vLLM, llama.cpp, LocalAI, TGI in OAI mode,
 * smaller hosted providers, etc.). Endpoint is user-configurable; API key is optional since
 * many local servers run unauthenticated.
 */
class Meow_MWAI_Engines_Custom extends Meow_MWAI_Engines_ChatML {
  public function __construct( $core, $env ) {
    parent::__construct( $core, $env );
  }

  protected function set_environment() {
    $env = $this->env;
    $this->apiKey = $env['apikey'] ?? null;
  }

  protected function get_service_name() {
    return ! empty( $this->env['name'] ) ? $this->env['name'] : 'Custom';
  }

  public function get_models() {
    // Prefer dynamically-fetched models, fall back to whatever the user added manually for this
    // env type via the Custom Models UI. No static list, since the model lineup is whatever the
    // user's server happens to expose.
    return $this->core->get_engine_models( 'custom' );
  }

  public static function get_models_static() {
    return [];
  }

  protected function build_url( $query, $endpoint = null ) {
    $base = $this->resolve_endpoint();
    if ( $query instanceof Meow_MWAI_Query_Text || $query instanceof Meow_MWAI_Query_Feedback ) {
      return $base . '/chat/completions';
    }
    if ( $query instanceof Meow_MWAI_Query_Embed ) {
      return $base . '/embeddings';
    }
    throw new Exception( 'Unsupported query type for the Custom (OpenAI-Compatible) provider.' );
  }

  /**
   * Bearer auth is optional here. Most local servers (Ollama default install, LM Studio,
   * llama.cpp server) do not require an API key; hosted OpenAI-compatible endpoints typically
   * do. Only attach the Authorization header when the user has set a key.
   */
  protected function build_headers( $query ) {
    if ( $query->apiKey ) {
      $this->apiKey = $query->apiKey;
    }
    $headers = [
      'Content-Type' => 'application/json',
      'User-Agent' => 'AI Engine',
    ];
    if ( ! empty( $this->apiKey ) ) {
      $headers['Authorization'] = 'Bearer ' . $this->apiKey;
    }
    return $headers;
  }

  protected function build_body( $query, $streamCallback = null, $extra = null ) {
    $body = parent::build_body( $query, $streamCallback, $extra );

    // Most OAI-compatible servers expect the older max_tokens field, not max_completion_tokens.
    if ( isset( $body['max_completion_tokens'] ) ) {
      $body['max_tokens'] = $body['max_completion_tokens'];
      unset( $body['max_completion_tokens'] );
    }

    return $body;
  }

  /**
   * Resolve the endpoint URL. Defaults to the Ollama localhost URL since that is the most
   * common starting point; users override per-env in settings.
   */
  private function resolve_endpoint() {
    $endpoint = ! empty( $this->env['endpoint'] ) ? $this->env['endpoint'] : 'http://localhost:11434/v1';
    $endpoint = apply_filters( 'mwai_custom_endpoint', $endpoint, $this->env );
    return rtrim( $endpoint, '/' );
  }

  /**
   * Try to discover models from /v1/models. Servers that don't implement this endpoint
   * (some llama.cpp builds, custom proxies) just return an empty list — users add models
   * manually through AI Engine's existing custom-models UI.
   */
  public function retrieve_models() {
    $base = $this->resolve_endpoint();
    $url = $base . '/models';

    $headers = [ 'User-Agent' => 'AI Engine' ];
    if ( ! empty( $this->apiKey ) ) {
      $headers['Authorization'] = 'Bearer ' . $this->apiKey;
    }

    $response = wp_remote_get( $url, [
      'headers' => $headers,
      'timeout' => 10,
      'sslverify' => MWAI_SSL_VERIFY,
    ] );

    if ( is_wp_error( $response ) ) {
      Meow_MWAI_Logging::log( 'Custom (OpenAI-Compatible): /models fetch failed: ' . $response->get_error_message() );
      return [];
    }

    $code = wp_remote_retrieve_response_code( $response );
    if ( $code >= 400 ) {
      Meow_MWAI_Logging::log( "Custom (OpenAI-Compatible): /models returned HTTP {$code}." );
      return [];
    }

    $body = json_decode( wp_remote_retrieve_body( $response ), true );
    if ( ! isset( $body['data'] ) || ! is_array( $body['data'] ) ) {
      return [];
    }

    $models = [];
    foreach ( $body['data'] as $remote ) {
      $modelId = $remote['id'] ?? '';
      if ( empty( $modelId ) ) {
        continue;
      }
      $isEmbedding = strpos( strtolower( $modelId ), 'embed' ) !== false;
      $features = $isEmbedding ? [ 'embedding' ] : [ 'completion' ];
      $tags = [ 'core', $isEmbedding ? 'embedding' : 'chat' ];

      $modelData = [
        'model' => $modelId,
        'name' => $modelId,
        'family' => 'custom',
        'features' => $features,
        // Pricing is unknown for self-hosted/third-party servers — zero out so usage tracking
        // doesn't invent costs. Users can add per-model pricing through the Custom Models UI.
        'price' => [ 'in' => 0, 'out' => 0 ],
        'type' => 'token',
        'unit' => 1 / 1000000,
        'maxCompletionTokens' => isset( $remote['max_output_tokens'] ) ? (int) $remote['max_output_tokens'] : 4096,
        'maxContextualTokens' => isset( $remote['context_window'] ) ? (int) $remote['context_window'] : 8192,
        'tags' => $tags,
      ];

      if ( $isEmbedding ) {
        $modelData['dimensions'] = isset( $remote['dimensions'] ) ? (int) $remote['dimensions'] : 1536;
      }

      $models[] = $modelData;
    }
    return $models;
  }

  /**
   * Hits /v1/models directly so the user gets a real success/error response. Works without an
   * API key, surfaces real HTTP errors when they happen.
   */
  public function connection_check() {
    $base = $this->resolve_endpoint();
    $url = $base . '/models';
    $details = [ 'endpoint' => $url ];

    $headers = [ 'User-Agent' => 'AI Engine' ];
    if ( ! empty( $this->apiKey ) ) {
      $headers['Authorization'] = 'Bearer ' . $this->apiKey;
    }

    $response = wp_remote_get( $url, [
      'headers' => $headers,
      'timeout' => 10,
      'sslverify' => MWAI_SSL_VERIFY,
    ] );

    if ( is_wp_error( $response ) ) {
      return [
        'success' => false, 'service' => $this->get_service_name(),
        'error' => $response->get_error_message(),
        'details' => $details,
      ];
    }

    $code = wp_remote_retrieve_response_code( $response );
    $body = json_decode( wp_remote_retrieve_body( $response ), true );

    if ( $code >= 400 || ( is_array( $body ) && isset( $body['error'] ) ) ) {
      $message = is_array( $body ) && isset( $body['error'] )
        ? ( is_string( $body['error'] ) ? $body['error'] : ( $body['error']['message'] ?? json_encode( $body['error'] ) ) )
        : "HTTP {$code} from {$url}.";
      return [
        'success' => false, 'service' => $this->get_service_name(),
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
      'success' => true, 'service' => $this->get_service_name(),
      'message' => 'Connection successful. Found ' . count( $body['data'] ?? [] ) . ' models.',
      'details' => array_merge( $details, [
        'model_count' => count( $body['data'] ?? [] ),
        'sample_models' => $modelIds,
      ] ),
    ];
  }
}
