<?php

class Meow_MWAI_Engines_OVH extends Meow_MWAI_Engines_ChatML {
  private $endpoint = 'https://oai.endpoints.kepler.ai.cloud.ovh.net';
  public $envType = 'ovh';

  public function __construct( $core, $env ) {
    parent::__construct( $core, $env );
  }

  /**
   * Sets up the environment for our custom engine.
   */
  protected function set_environment() {
    $env = $this->env;

    if ( !isset( $env['apikey'] ) || empty( $env['apikey'] ) ) {
      throw new Exception( 'AI Engine: OVH API key is not set. Please configure the OVH AI Endpoints access token in your settings.' );
    }

    $this->apiKey = $env['apikey'];

    if ( isset( $env['endpoint'] ) && !empty( $env['endpoint'] ) ) {
      $this->endpoint = $env['endpoint'];
    }
  }

  protected function build_url( $query, $endpoint = null ) {
    $endpoint = apply_filters( 'mwai_ovh_endpoint', trailingslashit( $this->endpoint ) . 'v1', $this->env );
    return $endpoint . '/chat/completions';
  }

  protected function get_service_name() {
    return 'OVH';
  }

  protected function build_messages( $query ) {
    // Handle vision models like llava-next-mistral-7b
    if ( strpos( $query->model, 'llava' ) !== false ) {
      $query->image_remote_upload = 'data';
    }

    $messages = parent::build_messages( $query );
    return $messages;
  }

  protected function stream_data_handler( $json ) {
    // Handle usage-only chunks (final chunk with empty choices array).
    // OVH sends usage data in a final chunk with choices: []
    if ( isset( $json['usage'] ) && empty( $json['choices'] ) ) {
      $usage = $json['usage'];
      if ( isset( $usage['prompt_tokens'], $usage['completion_tokens'] ) ) {
        $this->streamInTokens = (int) $usage['prompt_tokens'];
        $this->streamOutTokens = (int) $usage['completion_tokens'];
      }
      return null; // No content in this chunk
    }

    // Let parent handle all other chunks
    return parent::stream_data_handler( $json );
  }

  public function get_models() {
    return $this->retrieve_models();
  }

  protected function build_headers( $query ) {
    $headers = [
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer ' . $this->apiKey,
    ];
    return $headers;
  }

  protected function build_body( $query, $streamCallback = null, $extra = null ) {
    $body = parent::build_body( $query, $streamCallback, $extra );

    // Handle max_tokens parameter (OVH uses max_tokens, not max_completion_tokens)
    if ( isset( $body['max_completion_tokens'] ) ) {
      $body['max_tokens'] = $body['max_completion_tokens'];
      unset( $body['max_completion_tokens'] );
    }

    // OVH supports stream_options for accurate token usage in streaming
    if ( !empty( $streamCallback ) && !isset( $body['stream_options'] ) ) {
      $body['stream_options'] = [
        'include_usage' => true,
      ];
    }

    // Remove parallel_tool_calls - OVH might not support it
    if ( isset( $body['parallel_tool_calls'] ) ) {
      unset( $body['parallel_tool_calls'] );
    }

    // Remove other potentially unsupported parameters
    $unsupported_params = [ 'response_format', 'seed', 'logit_bias', 'logprobs', 'top_logprobs' ];
    foreach ( $unsupported_params as $param ) {
      if ( isset( $body[$param] ) ) {
        unset( $body[$param] );
      }
    }

    return $body;
  }

  public function handle_tokens_usage(
    $reply,
    $query,
    $returned_model,
    $returned_in_tokens,
    $returned_out_tokens,
    $returned_price = null
  ) {

    // Clean up the data
    $returned_in_tokens = !is_null( $returned_in_tokens ) ?
      $returned_in_tokens : $reply->get_in_tokens( $query );
    $returned_out_tokens = !is_null( $returned_out_tokens ) ?
      $returned_out_tokens : $reply->get_out_tokens();

    // Calculate price based on our model definitions
    $models = $this->get_ovh_models();
    $model_price = null;

    foreach ( $models as $model ) {
      if ( $model['model'] === $returned_model ) {
        $model_price = $model['price'];
        break;
      }
    }

    if ( $model_price ) {
      $returned_price = ( $returned_in_tokens * $model_price['in'] +
                         $returned_out_tokens * $model_price['out'] ) / 1000000;
    }
    else {
      $returned_price = 0;
    }

    // Record the usage
    $usage = $this->core->record_tokens_usage(
      $returned_model,
      $returned_in_tokens,
      $returned_out_tokens,
      $returned_price
    );

    // Set the usage in the reply
    $reply->set_usage( $usage );

    // Set accuracy based on data availability
    if ( !is_null( $returned_in_tokens ) && !is_null( $returned_out_tokens ) ) {
      // Tokens from API (via stream_options), price calculated locally
      $reply->set_usage_accuracy( 'tokens' );
    }
    else {
      // Everything estimated
      $reply->set_usage_accuracy( 'estimated' );
    }
  }

  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply ) {
    $models = $this->get_ovh_models();

    foreach ( $models as $model ) {
      if ( $model['model'] === $query->model ) {
        $in_tokens = $reply->get_in_tokens( $query );
        $out_tokens = $reply->get_out_tokens();
        return ( $in_tokens * $model['price']['in'] +
                $out_tokens * $model['price']['out'] ) / 1000000;
      }
    }

    return 0;
  }

  /**
   * Retrieve the models from the OVH OpenRouter-compatible catalog.
   */
  public function retrieve_models() {
    $url = 'https://catalog.endpoints.ai.ovh.net/rest/v2/openrouter';
    $response = wp_remote_get( $url, [ 'timeout' => 10 ] );

    if ( is_wp_error( $response ) ) {
      return $this->get_fallback_models();
    }

    $body = wp_remote_retrieve_body( $response );
    $data = json_decode( $body, true );

    if ( empty( $data ) || !is_array( $data ) ) {
      return $this->get_fallback_models();
    }

    // Extract models from 'data' key
    $models_data = isset( $data['data'] ) ? $data['data'] : $data;

    if ( empty( $models_data ) || !is_array( $models_data ) ) {
      return $this->get_fallback_models();
    }

    $models = [];
    foreach ( $models_data as $model_data ) {
      $model = $this->map_openrouter_model( $model_data );
      if ( $model ) {
        $models[] = $model;
      }
    }

    return !empty( $models ) ? $models : $this->get_fallback_models();
  }

  /**
   * Map OpenRouter model data to AI Engine format.
   */
  private function map_openrouter_model( $model_data ) {
    if ( empty( $model_data['id'] ) ) {
      return null;
    }

    $model_id = $model_data['id'];
    $name = !empty( $model_data['name'] ) ? $model_data['name'] : $model_id;

    // Extract family from model ID
    $family_parts = explode( '/', $model_id );
    $family = $family_parts[0];

    // Base features and tags
    $features = [ 'completion', 'chat' ];
    $tags = [ 'core', 'chat' ];

    // Check for vision support (input modality includes images)
    if ( !empty( $model_data['input_modalities'] ) && is_array( $model_data['input_modalities'] ) ) {
      if ( in_array( 'image', $model_data['input_modalities'] ) ) {
        $features[] = 'vision';
        $tags[] = 'vision';
      }
    }

    // Map features from OpenRouter to AI Engine format
    $openrouter_features = !empty( $model_data['supported_features'] ) ? $model_data['supported_features'] : [];
    foreach ( $openrouter_features as $feature ) {
      switch ( $feature ) {
        case 'json_mode':
        case 'structured_outputs':
          if ( !in_array( 'json', $tags ) ) {
            $tags[] = 'json';
          }
          break;
        case 'reasoning':
          if ( !in_array( 'reasoning', $tags ) ) {
            $tags[] = 'reasoning';
          }
          break;
        case 'tools':
          // OVH now supports function calling via tools format
          if ( !in_array( 'functions', $tags ) ) {
            $tags[] = 'functions';
          }
          break;
      }
    }

    // Convert pricing from per-token to per-million tokens
    $price_in = 0;
    $price_out = 0;
    if ( !empty( $model_data['pricing']['prompt'] ) ) {
      $price_in = floatval( $model_data['pricing']['prompt'] ) * 1000000;
    }
    if ( !empty( $model_data['pricing']['completion'] ) ) {
      $price_out = floatval( $model_data['pricing']['completion'] ) * 1000000;
    }

    // Get context and max tokens
    $max_context = !empty( $model_data['context_length'] ) ? intval( $model_data['context_length'] ) : 128000;
    $max_completion = !empty( $model_data['max_output_length'] ) ? intval( $model_data['max_output_length'] ) : 4096;

    return [
      'model' => $model_id,
      'name' => $name,
      'family' => $family,
      'features' => $features,
      'price' => [
        'in' => $price_in,
        'out' => $price_out,
      ],
      'type' => 'token',
      'unit' => 1 / 1000000,
      'maxCompletionTokens' => $max_completion,
      'maxContextualTokens' => $max_context,
      'tags' => $tags,
    ];
  }

  /**
   * Get fallback models in case the catalog API is unavailable.
   */
  private function get_fallback_models() {
    return [
      [
        'model' => 'meta-llama/Llama-3.3-70B-Instruct',
        'name' => 'Llama 3.3 70B Instruct',
        'family' => 'meta-llama',
        'features' => [ 'completion', 'chat' ],
        'price' => [
          'in' => 0.06,
          'out' => 0.09,
        ],
        'type' => 'token',
        'unit' => 1 / 1000000,
        'maxCompletionTokens' => 8192,
        'maxContextualTokens' => 131072,
        'tags' => [ 'core', 'chat', 'json', 'reasoning' ],
      ],
    ];
  }

  /**
   * Get model info by model ID (for backward compatibility).
   */
  private function get_ovh_models() {
    return $this->retrieve_models();
  }
}
