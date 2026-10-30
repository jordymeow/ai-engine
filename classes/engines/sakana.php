<?php

class Meow_MWAI_Engines_Sakana extends Meow_MWAI_Engines_ChatML {
  // Fugu Ultra reports its orchestration steps apart from prompt/completion tokens; Sakana bills
  // them at the same rates (total_tokens already includes them). Kept until usage is recorded.
  private $orchestrationIn = 0;
  private $orchestrationOut = 0;
  // The request's own context size, which decides Fugu Ultra's long-context rate.
  private $contextTokens = 0;

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
      // The synced list stores the metadata of the day it was fetched: prices, contexts and
      // descriptions always come from the current static definitions.
      return array_map( function ( $model ) {
        $static = $this->find_static_model( $model['model'] ?? '' );
        return $static ? array_merge( $static, [ 'model' => $model['model'], 'name' => $model['name'] ?? $static['name'] ] ) : $model;
      }, $dynamic );
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

  protected function finalize_choices( $choices, $responseData, $query ) {
    $this->remember_usage( $responseData['usage'] ?? [] );
    return parent::finalize_choices( $choices, $responseData, $query );
  }

  private function remember_usage( $usage ) {
    if ( !is_array( $usage ) || !isset( $usage['prompt_tokens'] ) ) {
      return;
    }
    $this->orchestrationIn = (int) ( $usage['orchestration_input_tokens'] ?? 0 );
    $this->orchestrationOut = (int) ( $usage['orchestration_output_tokens'] ?? 0 );
    $this->contextTokens = (int) $usage['prompt_tokens'];
  }

  protected function stream_data_handler( $json ) {
    $this->remember_usage( $json['usage'] ?? [] );
    // Namazu streams its thinking as reasoning_content (DeepSeek style); ChatML reads 'reasoning'.
    if ( isset( $json['choices'][0]['delta']['reasoning_content'] ) ) {
      $json['choices'][0]['delta']['reasoning'] = $json['choices'][0]['delta']['reasoning_content'];
      unset( $json['choices'][0]['delta']['reasoning_content'] );
    }
    return parent::stream_data_handler( $json );
  }

  public function handle_tokens_usage( $reply, $query, $returned_model, $returned_in_tokens, $returned_out_tokens, $returned_price = null ) {
    if ( !is_null( $returned_in_tokens ) && !is_null( $returned_out_tokens ) ) {
      $returned_in_tokens += $this->orchestrationIn;
      $returned_out_tokens += $this->orchestrationOut;
    }
    $this->orchestrationIn = $this->orchestrationOut = 0;
    parent::handle_tokens_usage( $reply, $query, $returned_model, $returned_in_tokens, $returned_out_tokens, $returned_price );
    // Sakana reports real usage, also when streaming (stream_options above).
    if ( !is_null( $returned_in_tokens ) && !is_null( $returned_out_tokens ) ) {
      $reply->set_usage_accuracy( 'tokens' );
    }
  }

  /**
   * Sakana returns no cost, only usage, so the price comes from its published rates. Plain Fugu
   * bills at the rate of whichever model it picked, which the API does not say: no price there
   * (logged as "No price") rather than a made-up cost or a misleading $0.
   */
  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply ) {
    $definition = null;
    foreach ( $this->get_models() as $model ) {
      if ( $model['model'] === $query->model ) {
        $definition = $model;
        break;
      }
    }
    if ( empty( $definition['price'] ) || !is_a( $query, 'Meow_MWAI_Query_Text' ) ) {
      return null;
    }
    $price = $definition['price'];
    $long = $definition['priceLongContext'] ?? null;
    if ( $long && $this->contextTokens > $long['threshold'] ) {
      $price = $long;
    }
    $in = (int) $reply->get_in_tokens( $query );
    $out = (int) $reply->get_out_tokens();
    $cached = min( max( 0, (int) $reply->get_cached_tokens() ), $in );
    $unit = $definition['unit'] ?? 1 / 1000000;
    return ( ( $in - $cached ) * $price['in'] + $cached * ( $price['cached'] ?? $price['in'] ) + $out * $price['out'] ) * $unit;
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
