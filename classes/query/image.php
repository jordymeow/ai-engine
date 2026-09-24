<?php

class Meow_MWAI_Query_Image extends Meow_MWAI_Query_Base {
  public ?string $resolution = null;
  public ?string $quality = null;
  public ?string $style = null;
  public ?string $localDownload = 'uploads';
  public ?string $localDownloadExpiry = 'uploads';
  public ?array $attachedFiles = null;

  #region Constructors, Serialization

  public function __construct( ?string $message = '', ?string $model = null ) {
    parent::__construct( $message );
    $this->model = $model;
    $this->feature = 'text-to-image'; // image-to-image, inpainting, etc
    global $mwai_core;
    $this->localDownload = $mwai_core->get_option( 'image_local_download' );
    $this->localDownloadExpiry = $mwai_core->get_option( 'image_expires_download' );
  }

  #[\ReturnTypeWillChange]
  public function jsonSerialize(): array {
    $json = [
      'message' => $this->message,

      'ai' => [
        'model' => $this->model,
        'feature' => $this->feature,
        'resolution' => $this->resolution,
        'quality' => $this->quality
      ],

      'system' => [
        'class' => get_class( $this ),
        'envId' => $this->envId,
        'scope' => $this->scope,
        'session' => $this->session,
        'customId' => $this->customId,
      ]
    ];

    if ( !empty( $this->context ) ) {
      $json['context']['content'] = $this->context;
    }

    return $json;
  }

  #endregion

  #region Parameters

  public function set_resolution( string $resolution ) {
    $this->resolution = $resolution;
  }

  public function set_quality( ?string $quality ) {
    $this->quality = $quality !== null && $quality !== '' ? $quality : null;
  }

  public function set_style( string $style ) {
    $this->style = $style;
  }

  /**
  * Set how the image will be treated locally, if it will be downloaded or not, etc.
  * @param string $localDownload The local download method. Could be 'uploads', 'library' or null.
  */
  public function set_local_download( ?string $localDownload ) {
    $this->localDownload = $localDownload;
  }

  public function add_file( Meow_MWAI_Query_DroppedFile $file ): void {
    if ( $this->attachedFiles === null ) {
      $this->attachedFiles = [];
    }
    $this->attachedFiles[] = $file;
  }

  public function set_files( array $files ): void {
    $this->attachedFiles = $files;
  }

  public function get_files(): ?array {
    return $this->attachedFiles;
  }

  public function getAttachments(): array {
    return $this->attachedFiles ?? [];
  }

  // Based on the params of the query, update the attributes
  public function inject_params( array $params ): void {
    parent::inject_params( $params );
    $params = $this->convert_keys( $params );

    if ( !empty( $params['resolution'] ) ) {
      $this->set_resolution( $params['resolution'] );
    }
    if ( array_key_exists( 'quality', $params ) ) {
      $this->set_quality( $params['quality'] );
    }
    if ( !empty( $params['style'] ) ) {
      $this->set_style( $params['style'] );
    }
    // Check both camelCase and snake_case versions for compatibility
    // Multipart requests cannot carry a real null, so the string "null" stands for it.
    $localDownload = array_key_exists( 'localDownload', $params ) ? $params['localDownload']
      : ( array_key_exists( 'local_download', $params ) ? $params['local_download'] : false );
    if ( $localDownload !== false ) {
      $this->set_local_download( $localDownload === 'null' ? null : $localDownload );
    }
  }

  #endregion

  #region Final Checks

  // Width over height for "16:9" or "1536x1024", null for anything else.
  private static function ratio_of( $name ) {
    if ( preg_match( '/^\s*(\d+(?:\.\d+)?)\s*[x:]\s*(\d+(?:\.\d+)?)\s*$/i', (string) $name, $m ) && (float) $m[2] > 0 ) {
      return (float) $m[1] / (float) $m[2];
    }
    return null;
  }

  private function closest_resolution( $wanted, array $resolutions ) {
    $target = self::ratio_of( $wanted ) ?? 1.0;
    $best = $resolutions[0]['name'];
    $bestDiff = null;
    foreach ( $resolutions as $resolution ) {
      $ratio = self::ratio_of( $resolution['name'] );
      if ( $ratio === null ) {
        continue;
      }
      $diff = abs( $ratio - $target );
      if ( $bestDiff === null || $diff < $bestDiff ) {
        $best = $resolution['name'];
        $bestDiff = $diff;
      }
    }
    return $best;
  }

  public function final_checks() {
    parent::final_checks();

    // Force a single image per request (matches the supported behavior of current image models).
    $this->maxResults = 1;

    global $mwai_core;

    $engine = Meow_MWAI_Engines_Factory::get( $mwai_core, $this->envId );

    // If model is empty, use the image-specific default model (not the general default)
    if ( empty( $this->model ) ) {
      $this->model = $mwai_core->get_option( 'ai_images_default_model' );
      if ( empty( $this->model ) ) {
        // Fallback to general default if image-specific default is not set
        $this->model = $mwai_core->get_option( 'ai_default_model' );
      }
    }

    $modelInfo = $engine->retrieve_model_info( $this->model );
    if ( empty( $modelInfo ) ) {
      Meow_MWAI_Logging::error( 'No model info found for model: ' . $this->model, '🖼️' );
      return;
    }

    // Let's check for resolutions.
    if ( !isset( $modelInfo['resolutions'] ) || empty( $modelInfo['resolutions'] ) ) {
      // Skip warning for non-image models (e.g., when using image_generation as a tool)
      return;
    }

    // No resolution set: prefer a square. Lists are ordered for the UI, not as defaults
    // (Google's starts at 21:9, so every unsized Gemini image used to come out ultra-wide).
    $resolutions = $modelInfo['resolutions'];
    if ( empty( $this->resolution ) ) {
      $this->resolution = $this->closest_resolution( '1:1', $resolutions );
    }

    $found = false;
    foreach ( $resolutions as $resolution ) {
      if ( $resolution['name'] === $this->resolution ) {
        $found = true;
        break;
      }
    }

    // Unsupported: keep the requested shape as closely as the model allows, so "16:9" on
    // GPT Image gives 1536x1024 and "1024x1024" on Gemini gives 1:1.
    if ( !$found ) {
      $closest = $this->closest_resolution( $this->resolution, $resolutions );
      $supportedResolutions = implode( ', ', array_column( $resolutions, 'name' ) );
      $error = sprintf( 'The model %s does not support the resolution %s (using %s instead). Supported resolutions are: %s.', $this->model, $this->resolution, $closest, $supportedResolutions );
      $this->resolution = $closest;
      Meow_MWAI_Logging::warn( $error, '🖼️' );
    }

    // Quality: only validate when the model declares supported qualities. Otherwise leave it as-is
    // (null means "do not send the quality param to the API"; the provider picks its default).
    if ( !empty( $modelInfo['qualities'] ) && empty( $this->quality ) ) {
      // Fall back to the global default. If the saved default is not supported by the active
      // model (e.g. user switched from GPT Image to a model with different vocabulary), the
      // validation block below will silently reset it to the model's first declared quality.
      $defaultQuality = $mwai_core->get_option( 'ai_images_default_quality' );
      if ( !empty( $defaultQuality ) ) {
        $this->quality = $defaultQuality;
      }
    }
    if ( !empty( $modelInfo['qualities'] ) && !empty( $this->quality ) ) {
      $qualities = $modelInfo['qualities'];
      $foundQuality = false;
      foreach ( $qualities as $quality ) {
        if ( $quality['name'] === $this->quality ) {
          $foundQuality = true;
          break;
        }
      }
      if ( !$foundQuality ) {
        $supportedQualities = [];
        foreach ( $qualities as $quality ) {
          $supportedQualities[] = $quality['name'];
        }
        $supportedQualities = implode( ', ', $supportedQualities );
        $error = sprintf( 'The model %s does not support the quality %s (using %s instead). Supported qualities are: %s.', $this->model, $this->quality, $qualities[0]['name'], $supportedQualities );
        $this->quality = $qualities[0]['name'];
        Meow_MWAI_Logging::error( $error, '🖼️' );
      }
    }
  }

  #endregion
}
