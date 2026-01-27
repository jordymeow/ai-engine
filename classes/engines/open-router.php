<?php

// If this isn't defined elsewhere, set it here by default. You can override
// it in your theme's functions.php or your main wp-config.php. If set to true,
// additional time will be spent fetching exact pricing info from OpenRouter
// after each query, resulting in more accurate but potentially slower responses.
if ( !defined( 'MWAI_OPENROUTER_ACCURATE_PRICING' ) ) {
  define( 'MWAI_OPENROUTER_ACCURATE_PRICING', false );
}

class Meow_MWAI_Engines_OpenRouter extends Meow_MWAI_Engines_ChatML {
  /**
  * Keep a static dictionary (query -> price) so that if we see the same query
  * again in another instance, we can immediately return the stored price
  * instead of recomputing.
  * @var array
  */
  private static $accuratePrices = [];

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
    $site_url = apply_filters( 'mwai_openrouter_site_url', get_site_url(), $query );
    $site_name = apply_filters( 'mwai_openrouter_site_name', get_bloginfo( 'name' ), $query );
    if ( $query->apiKey ) {
      $this->apiKey = $query->apiKey;
    }
    if ( empty( $this->apiKey ) ) {
      throw new Exception( 'No API Key provided. Please visit the Settings. (OpenRouter Engine)' );
    }
    return [
      'Content-Type' => 'application/json',
      'Authorization' => 'Bearer ' . $this->apiKey,
      'HTTP-Referer' => $site_url,
      'X-Title' => $site_name,
      'User-Agent' => 'AI Engine',
    ];
  }

  protected function build_body( $query, $streamCallback = null, $extra = null ) {
    $body = parent::build_body( $query, $streamCallback, $extra );
    // Only add transforms and usage for chat completions, not embeddings
    if ( !( $query instanceof Meow_MWAI_Query_Embed ) ) {
      $body['transforms'] = ['middle-out'];
      $body['usage'] = [ 'include' => true ];
    }
    else {
      // Only OpenAI embedding models support the dimensions parameter
      // Remove it for other providers to avoid errors
      $model = $query->model ?? '';
      if ( isset( $body['dimensions'] ) && strpos( $model, 'openai/' ) !== 0 ) {
        unset( $body['dimensions'] );
      }
    }
    return $body;
  }

  protected function get_service_name() {
    return 'OpenRouter';
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

    // Set accuracy based on data availability
    if ( !is_null( $returned_price ) && !is_null( $returned_in_tokens ) && !is_null( $returned_out_tokens ) ) {
      // OpenRouter returns price from API = full accuracy
      $reply->set_usage_accuracy( 'full' );
    }
    elseif ( !is_null( $returned_in_tokens ) && !is_null( $returned_out_tokens ) ) {
      // Tokens from API but price calculated = tokens accuracy
      $reply->set_usage_accuracy( 'tokens' );
    }
    else {
      // Everything estimated
      $reply->set_usage_accuracy( 'estimated' );
    }
  }

  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply ) {
    $price = $reply->get_price();
    return is_null( $price ) ? parent::get_price( $query, $reply ) : $price;
  }

  /**
   * OpenRouter uses /chat/completions with modalities parameter for image generation,
   * not the standard /images/generations endpoint.
   */
  public function run_image_query( $query, $streamCallback = null ) {
    $body = [
      'model' => $query->model,
      'messages' => [
        [
          'role' => 'user',
          'content' => $query->get_message()
        ]
      ],
      'modalities' => [ 'text', 'image' ],
    ];

    // Add number of images if specified
    if ( !empty( $query->maxResults ) && $query->maxResults > 1 ) {
      $body['n'] = $query->maxResults;
    }

    // Add image config for Gemini models (aspect ratio support)
    if ( !empty( $query->resolution ) && strpos( $query->model, 'google/' ) === 0 ) {
      $body['image_config'] = [
        'aspect_ratio' => $query->resolution
      ];
    }

    $endpoint = apply_filters( 'mwai_openrouter_endpoint', 'https://openrouter.ai/api/v1', $this->env );
    $url = trailingslashit( $endpoint ) . 'chat/completions';
    $headers = $this->build_headers( $query );
    $options = $this->build_options( $headers, $body );

    try {
      $res = $this->run_query( $url, $options );
      $data = $res['data'];

      if ( empty( $data ) || !isset( $data['choices'] ) ) {
        throw new Exception( 'No image generated in response.' );
      }

      $reply = new Meow_MWAI_Reply( $query );
      $reply->set_type( 'images' );
      $images = [];

      // Extract images from the response
      foreach ( $data['choices'] as $choice ) {
        $message = $choice['message'] ?? [];

        // Check for images in the message (OpenRouter format)
        // Each image is: { "type": "image_url", "image_url": { "url": "data:image/png;base64,..." } }
        if ( isset( $message['images'] ) && is_array( $message['images'] ) ) {
          foreach ( $message['images'] as $image ) {
            if ( is_array( $image ) && isset( $image['image_url']['url'] ) ) {
              $images[] = [ 'url' => $image['image_url']['url'] ];
            }
            elseif ( is_array( $image ) && isset( $image['image_url'] ) && is_string( $image['image_url'] ) ) {
              $images[] = [ 'url' => $image['image_url'] ];
            }
            elseif ( is_string( $image ) ) {
              // Direct base64 string
              $images[] = [ 'url' => $image ];
            }
          }
        }

        // Also check content array for image parts
        if ( isset( $message['content'] ) && is_array( $message['content'] ) ) {
          foreach ( $message['content'] as $part ) {
            if ( isset( $part['type'] ) && $part['type'] === 'image_url' ) {
              if ( isset( $part['image_url']['url'] ) ) {
                $images[] = [ 'url' => $part['image_url']['url'] ];
              }
              elseif ( is_string( $part['image_url'] ) ) {
                $images[] = [ 'url' => $part['image_url'] ];
              }
            }
          }
        }
      }

      if ( empty( $images ) ) {
        throw new Exception( 'No images found in the response.' );
      }

      // Record usage
      $model = $query->model;
      $resolution = !empty( $query->resolution ) ? $query->resolution : '1024x1024';

      if ( isset( $data['usage'] ) ) {
        $usage = $data['usage'];
        $promptTokens = $usage['prompt_tokens'] ?? 0;
        $completionTokens = $usage['completion_tokens'] ?? 0;
        $this->core->record_tokens_usage( $model, $promptTokens, $completionTokens );
        $usage['queries'] = 1;
        $usage['accuracy'] = 'tokens';
        $reply->set_usage( $usage );
        $reply->set_usage_accuracy( 'tokens' );
      }
      else {
        $usage = $this->core->record_images_usage( $model, $resolution, count( $images ) );
        $reply->set_usage( $usage );
        $reply->set_usage_accuracy( 'estimated' );
      }

      $reply->set_choices( $images );

      // Handle local download if enabled
      if ( $query->localDownload === 'uploads' || $query->localDownload === 'library' ) {
        foreach ( $reply->results as &$result ) {
          $fileId = $this->core->files->upload_file( $result, null, 'generated', [
            'query_envId' => $query->envId,
            'query_session' => $query->session,
            'query_model' => $query->model,
          ], $query->envId, $query->localDownload, $query->localDownloadExpiry );
          $fileUrl = $this->core->files->get_url( $fileId );
          $result = $fileUrl;
        }
      }

      $reply->result = $reply->results[0];
      return $reply;
    }
    catch ( Exception $e ) {
      Meow_MWAI_Logging::error( 'OpenRouter: ' . $e->getMessage() );
      throw new Exception( 'OpenRouter: ' . $e->getMessage() );
    }
  }

  /**
  * Retrieve the models from OpenRouter, adding tags/features accordingly.
  */
  public function retrieve_models() {

    // 1. Get the list of models supporting "tools"
    $toolsModels = $this->get_supported_models( 'tools' );

    // 2. Retrieve the full list of chat models
    $url = 'https://openrouter.ai/api/v1/models';
    $response = wp_remote_get( $url );
    if ( is_wp_error( $response ) ) {
      throw new Exception( 'AI Engine: ' . $response->get_error_message() );
    }
    $body = json_decode( $response['body'], true );
    if ( !isset( $body['data'] ) || !is_array( $body['data'] ) ) {
      throw new Exception( 'AI Engine: Invalid response for the list of models.' );
    }

    $models = [];
    foreach ( $body['data'] as $model ) {
      $models[] = $this->build_model_entry( $model, $toolsModels );
    }

    // 3. Retrieve embedding models
    $embeddingsUrl = 'https://openrouter.ai/api/v1/embeddings/models';
    $embeddingsResponse = wp_remote_get( $embeddingsUrl );
    if ( !is_wp_error( $embeddingsResponse ) ) {
      $embeddingsBody = json_decode( $embeddingsResponse['body'], true );
      if ( isset( $embeddingsBody['data'] ) && is_array( $embeddingsBody['data'] ) ) {
        foreach ( $embeddingsBody['data'] as $model ) {
          $models[] = $this->build_model_entry( $model, [], true );
        }
      }
    }

    return $models;
  }

  /**
  * Build a model entry from OpenRouter API data.
  */
  private function build_model_entry( $model, $toolsModels = [], $isEmbedding = false ) {
    // Basic defaults
    $family = 'n/a';
    $maxCompletionTokens = 4096;
    $maxContextualTokens = 8096;
    $priceIn = 0;
    $priceOut = 0;

    // Family from model ID (e.g. "openai/gpt-4/32k" -> "openai")
    if ( isset( $model['id'] ) ) {
      $parts = explode( '/', $model['id'] );
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

    // Handle embedding models
    if ( $isEmbedding ) {
      $features = [ 'embeddings' ];
      $tags = [ 'core', 'embedding' ];

      // Try to extract dimensions from description
      $dimensions = null;
      if ( isset( $model['description'] ) && preg_match( '/(\d+)-dimensional/', $model['description'], $matches ) ) {
        $dimensions = (int) $matches[1];
      }

      $entry = [
        'model' => $model['id'] ?? '',
        'name' => trim( $model['name'] ?? '' ),
        'family' => $family,
        'features' => $features,
        'price' => [
          'in' => $priceIn,
          'out' => $priceOut,
        ],
        'type' => 'token',
        'unit' => 1 / 1000,
        'maxContextualTokens' => $maxContextualTokens,
        'tags' => $tags,
      ];

      if ( $dimensions ) {
        $entry['dimensions'] = $dimensions;
      }

      return $entry;
    }

    // Basic features and tags for chat models
    $features = [ 'completion' ];
    $tags = [ 'core', 'chat' ];

    // If the name contains (beta), (alpha) or (preview), add 'preview' tag and remove from name
    if ( preg_match( '/\((beta|alpha|preview)\)/i', $model['name'] ) ) {
      $tags[] = 'preview';
      $model['name'] = preg_replace( '/\((beta|alpha|preview)\)/i', '', $model['name'] );
    }

    // If model supports tools
    if ( in_array( $model['id'], $toolsModels, true ) ) {
      $tags[] = 'functions';
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

    // Check if the model supports image generation (if "image" is in the output part after "->")
    // e.g. "text->image" or "text+image->text+image" means it can generate images
    $isImageGeneration = false;
    if ( strpos( $modality_lc, '->' ) !== false ) {
      $parts = explode( '->', $modality_lc );
      $outputPart = $parts[1] ?? '';
      $isImageGeneration = strpos( $outputPart, 'image' ) !== false;
    }
    if ( $isImageGeneration ) {
      $features = [ 'text-to-image' ];
      $tags = [ 'core', 'image' ];
    }

    $entry = [
      'model' => $model['id'] ?? '',
      'name' => trim( $model['name'] ?? '' ),
      'family' => $family,
      'features' => $features,
      'price' => [
        'in' => $priceIn,
        'out' => $priceOut,
      ],
      'type' => 'token',
      'unit' => 1 / 1000,
      'maxCompletionTokens' => $maxCompletionTokens,
      'maxContextualTokens' => $maxContextualTokens,
      'tags' => $tags,
    ];

    // Add mode for image generation models
    if ( $isImageGeneration ) {
      $entry['mode'] = 'image';
    }

    return $entry;
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
      return [];
    }
    $body = json_decode( $response['body'], true );
    if ( !isset( $body['data'] ) || !is_array( $body['data'] ) ) {
      Meow_MWAI_Logging::error( "OpenRouter: Invalid response for '$feature' models." );
      return [];
    }

    $modelIDs = [];
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

  /**
   * Check the connection to OpenRouter by listing models.
   * Uses the existing retrieve_models method for consistency.
   */
  public function connection_check() {
    try {
      // Use the existing retrieve_models method
      $models = $this->retrieve_models();

      if ( !is_array( $models ) ) {
        throw new Exception( 'Invalid response format from OpenRouter' );
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
        'service' => 'OpenRouter',
        'message' => "Connection successful. Found {$modelCount} models.",
        'details' => [
          'endpoint' => 'https://openrouter.ai/api/v1/models',
          'model_count' => $modelCount,
          'sample_models' => $availableModels
        ]
      ];
    }
    catch ( Exception $e ) {
      return [
        'success' => false,
        'service' => 'OpenRouter',
        'error' => $e->getMessage(),
        'details' => [
          'endpoint' => 'https://openrouter.ai/api/v1/models'
        ]
      ];
    }
  }
}
