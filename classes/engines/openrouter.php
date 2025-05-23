<?php

// If this isn't defined elsewhere, set it here by default. You can override
// it in your theme's functions.php or your main wp-config.php. If set to true,
// additional time will be spent fetching exact pricing info from OpenRouter
// after each query, resulting in more accurate but potentially slower responses.
if ( ! defined( 'MWAI_OPENROUTER_ACCURATE_PRICING' ) ) {
  define( 'MWAI_OPENROUTER_ACCURATE_PRICING', false );
}

class Meow_MWAI_Engines_OpenRouter extends Meow_MWAI_Engines_ChatML
{
  /**
   * Keep a static dictionary (query -> price) so that if we see the same query
   * again in another instance, we can immediately return the stored price
   * instead of recomputing.
   * @var array
   */
  private static $accuratePrices = array();

  public function __construct( $core, $env ) {
    parent::__construct( $core, $env );
  }

  protected function set_environment() {
    $env = $this->env;
    $this->apiKey = $env['apikey'];
  }

  protected function build_url( $query, $endpoint = null ) {
    $endpoint = apply_filters( 'mwai_openrouter_endpoint', 'https://openrouter.ai/api/v1', $this->env );
    return parent::build_url( $query, $endpoint );
  }

  protected function build_headers( $query ) {
    $site_url  = apply_filters( 'mwai_openrouter_site_url', get_site_url(), $query );
    $site_name = apply_filters( 'mwai_openrouter_site_name', get_bloginfo( 'name' ), $query );
    if ( $query->apiKey ) {
      $this->apiKey = $query->apiKey;
    }
    if ( empty( $this->apiKey ) ) {
      throw new Exception( 'No API Key provided. Please visit the Settings.' );
    }
    return array(
      'Content-Type'  => 'application/json',
      'Authorization' => 'Bearer ' . $this->apiKey,
      'HTTP-Referer'  => $site_url,
      'X-Title'       => $site_name,
      'User-Agent'    => 'AI Engine',
    );
  }

  protected function build_body( $query, $streamCallback = null, $extra = null ) {
    $body = parent::build_body( $query, $streamCallback, $extra );
    // Use transforms from OpenRouter docs
    $body['transforms'] = ['middle-out'];
    $body['usage'] = [ 'include' => true ];
    return $body;
  }

  protected function get_service_name() {
    return "OpenRouter";
  }

  public function get_models() {
    return $this->core->get_engine_models( 'openrouter' );
  }

  /**
   * Requests usage data if streaming was used and the usage is incomplete.
   */
  public function handle_tokens_usage(
    $reply,
    $query,
    $returned_model,
    $returned_in_tokens,
    $returned_out_tokens,
    $returned_price = null
  ) {
    // If streaming is not enabled, we might already have all usage data
    $everything_is_set = !is_null( $returned_model )
      && !is_null( $returned_in_tokens )
      && !is_null( $returned_out_tokens );

    // Clean up the data
    $returned_in_tokens = $returned_in_tokens ?? $reply->get_in_tokens( $query );
    $returned_out_tokens = $returned_out_tokens ?? $reply->get_out_tokens();
    $returned_price = $returned_price ?? $reply->get_price();

    // Record the usage in the database
    $usage = $this->core->record_tokens_usage(
      $returned_model,
      $returned_in_tokens,
      $returned_out_tokens,
      $returned_price
    );

    // Set the usage back on the reply
    $reply->set_usage( $usage );
  }

  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply ) {
    $price = $reply->get_price();
    return is_null( $price ) ? parent::get_price( $query, $reply ) : $price;
  }

  /**
   * Retrieve the models from OpenRouter, adding tags/features accordingly.
   */
  public function retrieve_models() {

    // 1. Get the list of models supporting "tools"
    $toolsModels = $this->get_supported_models( 'tools' );

    // 2. Retrieve the full list of models
    $url = 'https://openrouter.ai/api/v1/models';
    $response = wp_remote_get( $url );
    if ( is_wp_error( $response ) ) {
      throw new Exception( 'AI Engine: ' . $response->get_error_message() );
    }
    $body = json_decode( $response['body'], true );
    if ( !isset( $body['data'] ) || !is_array( $body['data'] ) ) {
      throw new Exception( 'AI Engine: Invalid response for the list of models.' );
    }

    $models = array();
    foreach ( $body['data'] as $model ) {

      // Basic defaults
      $family              = 'n/a';
      $maxCompletionTokens = 4096;
      $maxContextualTokens = 8096;
      $priceIn             = 0;
      $priceOut            = 0;

      // Family from model ID (e.g. "openai/gpt-4/32k" -> "openai")
      if ( isset( $model['id'] ) ) {
        $parts  = explode( '/', $model['id'] );
        $family = $parts[0] ?? 'n/a';
      }

      // maxCompletionTokens
      if ( isset( $model['top_provider']['max_completion_tokens'] ) ) {
        $maxCompletionTokens = (int) $model['top_provider']['max_completion_tokens'];
      }

      // maxContextualTokens
      if ( isset( $model['context_length'] ) ) {
        $maxContextualTokens = (int) $model['context_length'];
      }

      // Pricing
      if ( isset( $model['pricing']['prompt'] ) && $model['pricing']['prompt'] > 0 ) {
        $priceIn = $this->truncate_float( floatval( $model['pricing']['prompt'] ) * 1000 );
      }
      if ( isset( $model['pricing']['completion'] ) && $model['pricing']['completion'] > 0 ) {
        $priceOut = $this->truncate_float( floatval( $model['pricing']['completion'] ) * 1000 );
      }

      // Basic features and tags
      $features = [ 'completion' ];
      $tags     = [ 'core', 'chat' ];

      // If the name contains (beta), (alpha) or (preview), add 'preview' tag and remove from name
      if ( preg_match( '/\((beta|alpha|preview)\)/i', $model['name'] ) ) {
        $tags[]       = 'preview';
        $model['name'] = preg_replace( '/\((beta|alpha|preview)\)/i', '', $model['name'] );
      }

      // If model supports tools
      if ( in_array( $model['id'], $toolsModels, true ) ) {
        $tags[]     = 'functions';
        $features[] = 'functions';
      }

      // Check if the model supports "vision" (if "image" is in the left side of the arrow)
      // e.g. "text+image->text" or "image->text"
      $modality = $model['architecture']['modality'] ?? '';
      $modality_lc = strtolower( $modality );
      if (
        strpos( $modality_lc, 'image->' ) !== false ||
        strpos( $modality_lc, 'image+' ) !== false ||
        strpos( $modality_lc, '+image->' ) !== false
      ) {
        // Means it can handle images as input, so we consider that "vision"
        $tags[] = 'vision';
      }

      $models[] = array(
        'model'               => $model['id'] ?? '',
        'name'                => trim( $model['name'] ?? '' ),
        'family'              => $family,
        'features'            => $features,
        'price'               => array(
          'in'  => $priceIn,
          'out' => $priceOut,
        ),
        'type'                => 'token',
        'unit'                => 1 / 1000,
        'maxCompletionTokens' => $maxCompletionTokens,
        'maxContextualTokens' => $maxContextualTokens,
        'tags'                => $tags,
      );
    }

    return $models;
  }

  /**
   * Return an array of model IDs that support a certain feature (e.g. "tools").
   */
  private function get_supported_models( $feature ) {
    // Make a request to get models supporting that feature
    $url = 'https://openrouter.ai/api/v1/models?supported_parameters=' . urlencode( $feature );
    $response = wp_remote_get( $url );
    if ( is_wp_error( $response ) ) {
      Meow_MWAI_Logging::error( "OpenRouter: Failed to retrieve models for '$feature': " . $response->get_error_message() );
      return array();
    }
    $body = json_decode( $response['body'], true );
    if ( !isset( $body['data'] ) || !is_array( $body['data'] ) ) {
      Meow_MWAI_Logging::error( "OpenRouter: Invalid response for '$feature' models." );
      return array();
    }

    $modelIDs = array();
    foreach ( $body['data'] as $m ) {
      if ( isset( $m['id'] ) ) {
        $modelIDs[] = $m['id'];
      }
    }

    return $modelIDs;
  }

  /**
   * Utility function to truncate a float to a specific precision.
   */
  private function truncate_float( $number, $precision = 4 ) {
    $factor = pow( 10, $precision );
    return floor( $number * $factor ) / $factor;
  }
}
