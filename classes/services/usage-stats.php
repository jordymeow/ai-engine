<?php

class Meow_MWAI_Services_UsageStats {
  private $core;
  private $tiktoken_encoders = [];
  private $encoder_provider = null;

  public function __construct( $core ) {
    $this->core = $core;
  }

  /**
   * Get the cl100k_base tiktoken encoder
   * Note: We always use cl100k_base regardless of model since it's the standard for all modern OpenAI models
   * @return object|null The tiktoken encoder or null if not available
   */
  private function get_tiktoken_encoder() {
    // Return cached encoder if available
    if ( isset( $this->tiktoken_encoders['cl100k_base'] ) ) {
      return $this->tiktoken_encoders['cl100k_base'];
    }

    try {
      // Check if class exists
      if ( !class_exists( 'Yethee\Tiktoken\EncoderProvider' ) ) {
        error_log( '[AI Engine Tiktoken] EncoderProvider class not found. Check if composer autoload is working.' );
        return null;
      }

      // Initialize encoder provider if needed
      if ( $this->encoder_provider === null ) {
        $this->encoder_provider = new \Yethee\Tiktoken\EncoderProvider();
      }

      // Get the cl100k_base encoder (standard for modern OpenAI models)
      $encoder = $this->encoder_provider->get( 'cl100k_base' );
      $this->tiktoken_encoders['cl100k_base'] = $encoder;
      
      // Removed success log to reduce noise
      return $encoder;
    }
    catch ( \Exception $e ) {
      error_log( '[AI Engine Tiktoken] Failed to initialize encoder: ' . $e->getMessage() );
      return null;
    }
  }

  public function estimate_tokens( ...$args ) {
    // Handle multiple argument formats for backward compatibility
    $text = '';
    $model = null;

    // If first argument is an array, process messages
    if ( !empty( $args[0] ) && is_array( $args[0] ) ) {
      foreach ( $args[0] as $message ) {
        $text .= isset( $message['content']['text'] ) ? $message['content']['text'] : '';
        $text .= isset( $message['content'] ) && is_string( $message['content'] ) ? $message['content'] : '';
      }
      $model = $args[1] ?? null;
    }
    // Otherwise treat first argument as text
    else {
      $text = $args[0] ?? '';
      $model = $args[1] ?? null;
    }

    // Convert to string if needed
    if ( !is_string( $text ) ) {
      // Handle arrays that weren't caught by the first condition
      if ( is_array( $text ) ) {
        $text = json_encode( $text );
      }
      // Handle objects
      elseif ( is_object( $text ) ) {
        $text = method_exists( $text, '__toString' ) ? (string) $text : json_encode( $text );
      }
      // Handle other types (int, float, bool, null)
      else {
        $text = (string) $text;
      }
    }

    // Apply filters for customization
    $text = apply_filters( 'mwai_estimate_tokens_text', $text, $model );
    $tokens = apply_filters( 'mwai_estimate_tokens', null, $text, $model );
    if ( $tokens !== null ) {
      return $tokens;
    }

    // Try to use tiktoken for accurate counting (cl100k_base encoder)
    $encoder = $this->get_tiktoken_encoder();
    if ( $encoder ) {
      try {
        $encoded = $encoder->encode( $text );
        $token_count = count( $encoded );
        
        // Comparison logging removed - tiktoken is working correctly
        
        return $token_count;
      }
      catch ( Exception $e ) {
        error_log( '[AI Engine Tiktoken] Encoding failed, falling back to estimation: ' . $e->getMessage() );
      }
    }
    else {
      error_log( '[AI Engine Tiktoken] Encoder not available, using fallback' );
    }

    // Fallback to old estimation method
    return $this->fallback_estimate_tokens( $text );
  }

  /**
   * Fallback token estimation method (the original implementation)
   */
  private function fallback_estimate_tokens( $text ) {
    $multiplier = 4;
    $hasChineseChars = preg_match( '/[\x{4e00}-\x{9fa5}]/u', $text );
    $hasJapaneseChars = preg_match( '/[\x{3040}-\x{309f}\x{30a0}-\x{30ff}]/u', $text );
    $hasKoreanChars = preg_match( '/[\x{ac00}-\x{d7af}]/u', $text );
    if ( $hasChineseChars || $hasJapaneseChars || $hasKoreanChars ) {
      $multiplier = 2;
    }
    $tokens = (int) ( ( function_exists( 'mb_strlen' ) ? mb_strlen( $text ) : strlen( $text ) ) / $multiplier );
    return $tokens;
  }

  public function record_tokens_usage( $model, $in_tokens, $out_tokens = 0, $returned_price = null ) {
    if ( !is_numeric( $in_tokens ) ) {
      $in_tokens = 0;
    }
    if ( !is_numeric( $out_tokens ) ) {
      $out_tokens = 0;
    }

    // Normalize returned_price - keep null when price is unavailable
    $price_for_tracking = 0; // For monthly/daily accumulation
    if ( !empty( $returned_price ) || $returned_price === 0 ) {
      $returned_price = is_array( $returned_price ) ?
        ( isset( $returned_price['price'] ) ? $returned_price['price'] : null ) :
        ( is_numeric( $returned_price ) ? $returned_price : null );
      $price_for_tracking = $returned_price ?? 0;
    } else {
      $returned_price = null;
    }
    
    // Record monthly usage
    $usage = $this->core->get_option( 'ai_usage' );
    $month = date( 'Y-m' );
    if ( !isset( $usage[$month] ) ) {
      $usage[$month] = [];
    }
    if ( !isset( $usage[$month][$model] ) ) {
      $usage[$month][$model] = [
        'prompt_tokens' => 0,
        'completion_tokens' => 0,
        'total_tokens' => 0,
        'returned_price' => 0,
        'queries' => 0
      ];
    }
    // Ensure all token fields exist for existing data
    if ( !isset( $usage[$month][$model]['prompt_tokens'] ) ) {
      $usage[$month][$model]['prompt_tokens'] = 0;
    }
    if ( !isset( $usage[$month][$model]['completion_tokens'] ) ) {
      $usage[$month][$model]['completion_tokens'] = 0;
    }
    if ( !isset( $usage[$month][$model]['total_tokens'] ) ) {
      $usage[$month][$model]['total_tokens'] = 0;
    }
    if ( !isset( $usage[$month][$model]['returned_price'] ) ) {
      $usage[$month][$model]['returned_price'] = 0;
    }
    if ( !isset( $usage[$month][$model]['queries'] ) ) {
      $usage[$month][$model]['queries'] = 0;
    }
    $usage[$month][$model]['prompt_tokens'] += $in_tokens;
    $usage[$month][$model]['completion_tokens'] += $out_tokens;
    $usage[$month][$model]['total_tokens'] += $in_tokens + $out_tokens;
    $usage[$month][$model]['queries'] += 1;
    $usage[$month][$model]['returned_price'] += $price_for_tracking;
    
    // Clean up old monthly data (keep only last 2 years)
    $this->cleanup_old_monthly_data( $usage );
    $this->core->update_option( 'ai_usage', $usage );
    
    // Record daily usage
    $daily_usage = $this->core->get_option( 'ai_usage_daily', [] );
    $day = date( 'Y-m-d' );
    if ( !isset( $daily_usage[$day] ) ) {
      $daily_usage[$day] = [];
    }
    if ( !isset( $daily_usage[$day][$model] ) ) {
      $daily_usage[$day][$model] = [
        'prompt_tokens' => 0,
        'completion_tokens' => 0,
        'total_tokens' => 0,
        'returned_price' => 0,
        'queries' => 0
      ];
    }
    // Ensure all token fields exist for existing data
    if ( !isset( $daily_usage[$day][$model]['prompt_tokens'] ) ) {
      $daily_usage[$day][$model]['prompt_tokens'] = 0;
    }
    if ( !isset( $daily_usage[$day][$model]['completion_tokens'] ) ) {
      $daily_usage[$day][$model]['completion_tokens'] = 0;
    }
    if ( !isset( $daily_usage[$day][$model]['total_tokens'] ) ) {
      $daily_usage[$day][$model]['total_tokens'] = 0;
    }
    if ( !isset( $daily_usage[$day][$model]['returned_price'] ) ) {
      $daily_usage[$day][$model]['returned_price'] = 0;
    }
    if ( !isset( $daily_usage[$day][$model]['queries'] ) ) {
      $daily_usage[$day][$model]['queries'] = 0;
    }
    $daily_usage[$day][$model]['prompt_tokens'] += $in_tokens;
    $daily_usage[$day][$model]['completion_tokens'] += $out_tokens;
    $daily_usage[$day][$model]['total_tokens'] += $in_tokens + $out_tokens;
    $daily_usage[$day][$model]['queries'] += 1;
    $daily_usage[$day][$model]['returned_price'] += $price_for_tracking;
    
    // Clean up old daily data (keep only last 30 days)
    $this->cleanup_old_daily_data( $daily_usage );
    $this->core->update_option( 'ai_usage_daily', $daily_usage );
    
    // Return the usage data for this specific request
    return [
      'prompt_tokens' => $in_tokens,
      'completion_tokens' => $out_tokens,
      'total_tokens' => $in_tokens + $out_tokens,
      'price' => $returned_price,
      'queries' => 1
    ];
  }

  public function record_audio_usage( $model, $seconds ) {
    // Record monthly usage
    $usage = $this->core->get_option( 'ai_usage' );
    $month = date( 'Y-m' );
    if ( !isset( $usage[$month] ) ) {
      $usage[$month] = [];
    }
    if ( !isset( $usage[$month][$model] ) ) {
      $usage[$month][$model] = [ 'seconds' => 0, 'queries' => 0 ];
    }
    if ( !isset( $usage[$month][$model]['seconds'] ) ) {
      $usage[$month][$model]['seconds'] = 0;
    }
    if ( !isset( $usage[$month][$model]['queries'] ) ) {
      $usage[$month][$model]['queries'] = 0;
    }
    $usage[$month][$model]['seconds'] += $seconds;
    $usage[$month][$model]['queries'] += 1;
    $this->cleanup_old_monthly_data( $usage );
    $this->core->update_option( 'ai_usage', $usage );
    
    // Record daily usage
    $daily_usage = $this->core->get_option( 'ai_usage_daily', [] );
    $day = date( 'Y-m-d' );
    if ( !isset( $daily_usage[$day] ) ) {
      $daily_usage[$day] = [];
    }
    if ( !isset( $daily_usage[$day][$model] ) ) {
      $daily_usage[$day][$model] = [ 'seconds' => 0, 'queries' => 0 ];
    }
    if ( !isset( $daily_usage[$day][$model]['seconds'] ) ) {
      $daily_usage[$day][$model]['seconds'] = 0;
    }
    if ( !isset( $daily_usage[$day][$model]['queries'] ) ) {
      $daily_usage[$day][$model]['queries'] = 0;
    }
    $daily_usage[$day][$model]['seconds'] += $seconds;
    $daily_usage[$day][$model]['queries'] += 1;
    $this->cleanup_old_daily_data( $daily_usage );
    $this->core->update_option( 'ai_usage_daily', $daily_usage );
    
    // Return the usage data for this specific request
    return [
      'seconds' => $seconds,
      'queries' => 1
    ];
  }

  public function record_images_usage( $model, $resolution, $images ) {
    // Record monthly usage
    $usage = $this->core->get_option( 'ai_usage' );
    $month = date( 'Y-m' );
    if ( !isset( $usage[$month] ) ) {
      $usage[$month] = [];
    }
    if ( !isset( $usage[$month][$model] ) ) {
      $usage[$month][$model] = [ 'resolution' => [], 'images' => 0, 'queries' => 0 ];
    }
    if ( !isset( $usage[$month][$model]['images'] ) ) {
      $usage[$month][$model]['images'] = 0;
    }
    if ( !isset( $usage[$month][$model]['resolution'] ) ) {
      $usage[$month][$model]['resolution'] = [];
    }
    if ( !isset( $usage[$month][$model]['resolution'][$resolution] ) ) {
      $usage[$month][$model]['resolution'][$resolution] = 0;
    }
    if ( !isset( $usage[$month][$model]['queries'] ) ) {
      $usage[$month][$model]['queries'] = 0;
    }
    $usage[$month][$model]['images'] += $images;
    $usage[$month][$model]['resolution'][$resolution] += $images;
    $usage[$month][$model]['queries'] += 1;
    $this->cleanup_old_monthly_data( $usage );
    $this->core->update_option( 'ai_usage', $usage );
    
    // Record daily usage
    $daily_usage = $this->core->get_option( 'ai_usage_daily', [] );
    $day = date( 'Y-m-d' );
    if ( !isset( $daily_usage[$day] ) ) {
      $daily_usage[$day] = [];
    }
    if ( !isset( $daily_usage[$day][$model] ) ) {
      $daily_usage[$day][$model] = [ 'resolution' => [], 'images' => 0, 'queries' => 0 ];
    }
    if ( !isset( $daily_usage[$day][$model]['images'] ) ) {
      $daily_usage[$day][$model]['images'] = 0;
    }
    if ( !isset( $daily_usage[$day][$model]['resolution'] ) ) {
      $daily_usage[$day][$model]['resolution'] = [];
    }
    if ( !isset( $daily_usage[$day][$model]['resolution'][$resolution] ) ) {
      $daily_usage[$day][$model]['resolution'][$resolution] = 0;
    }
    if ( !isset( $daily_usage[$day][$model]['queries'] ) ) {
      $daily_usage[$day][$model]['queries'] = 0;
    }
    $daily_usage[$day][$model]['images'] += $images;
    $daily_usage[$day][$model]['resolution'][$resolution] += $images;
    $daily_usage[$day][$model]['queries'] += 1;
    $this->cleanup_old_daily_data( $daily_usage );
    $this->core->update_option( 'ai_usage_daily', $daily_usage );
    
    // Calculate price based on model and resolution
    $price = 0;
    $modelInfo = $this->get_model_info( $model );
    if ( $modelInfo && isset( $modelInfo['resolutions'] ) ) {
      foreach ( $modelInfo['resolutions'] as $res ) {
        if ( $res['name'] === $resolution && isset( $res['price'] ) ) {
          $price = $res['price'] * $images;
          break;
        }
      }
    }

    // Return the usage data for this specific request
    return [
      'images' => $images,
      'queries' => 1,
      'price' => $price,
      'accuracy' => $price > 0 ? 'price' : 'estimated' // 'price' = calculated from known pricing, not from API
    ];
  }

  public function record_videos_usage( $model, $resolution, $seconds ) {
    // Record monthly usage
    $usage = $this->core->get_option( 'ai_usage' );
    $month = date( 'Y-m' );
    if ( !isset( $usage[$month] ) ) {
      $usage[$month] = [];
    }
    if ( !isset( $usage[$month][$model] ) ) {
      $usage[$month][$model] = [ 'resolution' => [], 'seconds' => 0, 'queries' => 0 ];
    }
    if ( !isset( $usage[$month][$model]['seconds'] ) ) {
      $usage[$month][$model]['seconds'] = 0;
    }
    if ( !isset( $usage[$month][$model]['resolution'] ) ) {
      $usage[$month][$model]['resolution'] = [];
    }
    if ( !isset( $usage[$month][$model]['resolution'][$resolution] ) ) {
      $usage[$month][$model]['resolution'][$resolution] = 0;
    }
    if ( !isset( $usage[$month][$model]['queries'] ) ) {
      $usage[$month][$model]['queries'] = 0;
    }
    $usage[$month][$model]['seconds'] += $seconds;
    $usage[$month][$model]['resolution'][$resolution] += $seconds;
    $usage[$month][$model]['queries'] += 1;
    $this->cleanup_old_monthly_data( $usage );
    $this->core->update_option( 'ai_usage', $usage );

    // Record daily usage
    $daily_usage = $this->core->get_option( 'ai_usage_daily', [] );
    $day = date( 'Y-m-d' );
    if ( !isset( $daily_usage[$day] ) ) {
      $daily_usage[$day] = [];
    }
    if ( !isset( $daily_usage[$day][$model] ) ) {
      $daily_usage[$day][$model] = [ 'resolution' => [], 'seconds' => 0, 'queries' => 0 ];
    }
    if ( !isset( $daily_usage[$day][$model]['seconds'] ) ) {
      $daily_usage[$day][$model]['seconds'] = 0;
    }
    if ( !isset( $daily_usage[$day][$model]['resolution'] ) ) {
      $daily_usage[$day][$model]['resolution'] = [];
    }
    if ( !isset( $daily_usage[$day][$model]['resolution'][$resolution] ) ) {
      $daily_usage[$day][$model]['resolution'][$resolution] = 0;
    }
    if ( !isset( $daily_usage[$day][$model]['queries'] ) ) {
      $daily_usage[$day][$model]['queries'] = 0;
    }
    $daily_usage[$day][$model]['seconds'] += $seconds;
    $daily_usage[$day][$model]['resolution'][$resolution] += $seconds;
    $daily_usage[$day][$model]['queries'] += 1;
    $this->cleanup_old_daily_data( $daily_usage );
    $this->core->update_option( 'ai_usage_daily', $daily_usage );

    // Calculate price based on model, resolution, and seconds
    $price = 0;
    $modelInfo = $this->get_model_info( $model );
    if ( $modelInfo && isset( $modelInfo['resolutions'] ) ) {
      foreach ( $modelInfo['resolutions'] as $res ) {
        if ( $res['name'] === $resolution && isset( $res['price'] ) ) {
          // Price is per second for video models
          $price = $res['price'] * $seconds;
          break;
        }
      }
    }

    // Return the usage data for this specific request
    return [
      'seconds' => $seconds,
      'queries' => 1,
      'price' => $price,
      'accuracy' => $price > 0 ? 'price' : 'estimated' // 'price' = calculated from known pricing, not from API
    ];
  }

  private function get_model_info( $model ) {
    $engines = $this->core->get_option( 'ai_engines' );
    if ( !$engines || !is_array( $engines ) ) {
      return null;
    }

    foreach ( $engines as $engine ) {
      if ( isset( $engine['models'] ) && is_array( $engine['models'] ) ) {
        foreach ( $engine['models'] as $modelInfo ) {
          if ( isset( $modelInfo['model'] ) && $modelInfo['model'] === $model ) {
            return $modelInfo;
          }
        }
      }
    }

    return null;
  }

  private function cleanup_old_monthly_data( &$usage ) {
    $two_years_ago = date( 'Y-m', strtotime( '-2 years' ) );
    foreach ( $usage as $month => $data ) {
      if ( $month < $two_years_ago ) {
        unset( $usage[$month] );
      }
    }
  }

  private function cleanup_old_daily_data( &$usage ) {
    $thirty_days_ago = date( 'Y-m-d', strtotime( '-30 days' ) );
    foreach ( $usage as $day => $data ) {
      if ( $day < $thirty_days_ago ) {
        unset( $usage[$day] );
      }
    }
  }
}
