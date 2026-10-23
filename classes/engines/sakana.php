<?php

class Meow_MWAI_Engines_Sakana extends Meow_MWAI_Engines_ChatML {
  public function __construct( $core, $env ) {
    parent::__construct( $core, $env );
  }

  protected function set_environment() {
    $env = $this->env;
    $this->apiKey = $env['apikey'] ?? null;
  }

  protected function get_service_name() {
    return 'Sakana AI';
  }

  public function get_models() {
    // Prefer the models synced from /v1/models, fall back to the static list.
    $dynamic = $this->core->get_engine_models( 'sakana' );
    if ( !empty( $dynamic ) ) {
      return $dynamic;
    }
    return apply_filters( 'mwai_sakana_models', MWAI_SAKANA_MODELS );
  }

  public static function get_models_static() {
    return MWAI_SAKANA_MODELS;
  }

  private function get_endpoint() {
    $endpoint = apply_filters( 'mwai_sakana_endpoint', 'https://api.sakana.ai/v1', $this->env );
    return rtrim( $endpoint, '/' );
  }

  protected function build_url( $query, $endpoint = null ) {
    if ( $query instanceof Meow_MWAI_Query_Text || $query instanceof Meow_MWAI_Query_Feedback ) {
      return $this->get_endpoint() . '/chat/completions';
    }
    throw new Exception( 'Unsupported query type for Sakana AI.' );
  }

  protected function build_headers( $query ) {
    if ( $query->apiKey ) {
      $this->apiKey = $query->apiKey;
    }
    if ( empty( $this->apiKey ) ) {
      throw new Exception( 'No Sakana AI API Key provided. Please check your settings.' );
    }
    return [
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer ' . $this->apiKey,
      'User-Agent' => 'AI Engine',
    ];
  }

  protected function build_body( $query, $streamCallback = null, $extra = null ) {
    $body = parent::build_body( $query, $streamCallback, $extra );
    // Without this, streamed replies carry no usage and the token counts are estimated.
    if ( !empty( $body['stream'] ) ) {
      $body['stream_options'] = [ 'include_usage' => true ];
    }
    return $body;
  }

  protected function stream_data_handler( $json ) {
    // Namazu streams its thinking as reasoning_content (DeepSeek style); ChatML reads 'reasoning'.
    if ( isset( $json['choices'][0]['delta']['reasoning_content'] ) ) {
      $json['choices'][0]['delta']['reasoning'] = $json['choices'][0]['delta']['reasoning_content'];
      unset( $json['choices'][0]['delta']['reasoning_content'] );
    }
    return parent::stream_data_handler( $json );
  }

  public function handle_tokens_usage( $reply, $query, $returned_model, $returned_in_tokens, $returned_out_tokens, $returned_price = null ) {
    parent::handle_tokens_usage( $reply, $query, $returned_model, $returned_in_tokens, $returned_out_tokens, $returned_price );
    // Sakana reports real usage, also when streaming (stream_options above).
    if ( !is_null( $returned_in_tokens ) && !is_null( $returned_out_tokens ) ) {
      $reply->set_usage_accuracy( 'tokens' );
    }
  }

  /**
   * Sakana has not published prices yet, so the models carry none. Return null
   * (logged as "No price") rather than a made-up cost or a misleading $0.
   */
  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply ) {
    foreach ( $this->get_models() as $model ) {
      if ( $model['model'] === $query->model ) {
        return isset( $model['price'] ) ? parent::get_price( $query, $reply ) : null;
      }
    }
    return null;
  }

  /**
   * Find the static definition a model id belongs to. Versioned ids such as
   * fugu-ultra-v1.1 or fugu-ultra-20260615 inherit their base model's metadata.
   */
  private function find_static_model( $modelId ) {
    $best = null;
    foreach ( MWAI_SAKANA_MODELS as $model ) {
      $base = $model['model'];
      if ( $modelId === $base || strpos( $modelId, $base . '-' ) === 0 ) {
        if ( !$best || strlen( $base ) > strlen( $best['model'] ) ) {
          $best = $model;
        }
      }
    }
    return $best;
  }

  private function generate_human_readable_name( $modelId, $static ) {
    if ( !$static ) {
      return ucwords( str_replace( [ '-', '_' ], ' ', $modelId ) );
    }
    $suffix = substr( $modelId, strlen( $static['model'] ) + 1 );
    return $suffix === false || $suffix === '' ? $static['name'] : $static['name'] . ' (' . $suffix . ')';
  }

  /**
   * Retrieve the available models from Sakana's /v1/models endpoint. It only returns
   * ids, so the rest of the metadata comes from the static list.
   */
  public function retrieve_models() {
    try {
      if ( empty( $this->apiKey ) ) {
        throw new Exception( 'No Sakana AI API Key provided for model retrieval.' );
      }

      $response = wp_remote_get( $this->get_endpoint() . '/models', [
        'headers' => [ 'Authorization' => 'Bearer ' . $this->apiKey, 'User-Agent' => 'AI Engine' ],
        'timeout' => 10,
        'sslverify' => MWAI_SSL_VERIFY
      ] );
      if ( is_wp_error( $response ) ) {
        throw new Exception( 'AI Engine: ' . $response->get_error_message() );
      }

      $body = json_decode( $response['body'], true );
      if ( !isset( $body['data'] ) || !is_array( $body['data'] ) ) {
        throw new Exception( 'AI Engine: Invalid response for Sakana AI models list.' );
      }

      $models = [];
      $seen = [];
      foreach ( $body['data'] as $remote ) {
        $modelId = $remote['id'] ?? '';
        if ( empty( $modelId ) || isset( $seen[$modelId] ) ) {
          continue;
        }
        $seen[$modelId] = true;
        $static = $this->find_static_model( $modelId );
        $model = $static ?? [
          'family' => strpos( $modelId, 'namazu' ) !== false ? 'namazu' : 'fugu',
          'features' => [ 'completion' ],
          'type' => 'token',
          'unit' => 1 / 1000000,
          'maxCompletionTokens' => 16384,
          'maxContextualTokens' => 128000,
          'tags' => [ 'core', 'chat' ],
        ];
        $model['model'] = $modelId;
        $model['name'] = $this->generate_human_readable_name( $modelId, $static );
        $models[] = $model;
      }
      return $models;
    }
    catch ( Exception $e ) {
      Meow_MWAI_Logging::error( 'Sakana AI: Failed to retrieve models: ' . $e->getMessage() );
      return [];
    }
  }

  /**
   * Hits /v1/models directly so the user sees Sakana's actual error message.
   */
  public function connection_check() {
    $url = $this->get_endpoint() . '/models';
    $details = [ 'endpoint' => $url ];
    $fail = function ( $error, $extra = [] ) use ( $details ) {
      return [
        'success' => false, 'service' => 'Sakana AI',
        'error' => $error,
        'details' => array_merge( $details, $extra ),
      ];
    };

    if ( empty( $this->apiKey ) ) {
      return $fail( 'No Sakana AI API Key configured.' );
    }

    $response = wp_remote_get( $url, [
      'headers' => [ 'Authorization' => 'Bearer ' . $this->apiKey, 'User-Agent' => 'AI Engine' ],
      'timeout' => 10, 'sslverify' => MWAI_SSL_VERIFY,
    ] );
    if ( is_wp_error( $response ) ) {
      return $fail( $response->get_error_message() );
    }

    $code = wp_remote_retrieve_response_code( $response );
    $body = json_decode( wp_remote_retrieve_body( $response ), true );
    if ( $code >= 400 || ( is_array( $body ) && isset( $body['error'] ) ) ) {
      $message = is_array( $body ) && isset( $body['error'] )
        ? ( is_string( $body['error'] ) ? $body['error'] : ( $body['error']['message'] ?? json_encode( $body['error'] ) ) )
        : "HTTP {$code} from Sakana AI.";
      return $fail( $message, [ 'http_code' => $code ] );
    }

    $data = $body['data'] ?? [];
    return [
      'success' => true, 'service' => 'Sakana AI',
      'message' => 'Connection successful. Found ' . count( $data ) . ' models.',
      'details' => array_merge( $details, [
        'model_count' => count( $data ),
        'sample_models' => array_values( array_filter( array_column( array_slice( $data, 0, 5 ), 'id' ) ) ),
      ] ),
    ];
  }
}
