<?php

class Meow_MWAI_Query_Image extends Meow_MWAI_Query_Base {
	public ?string $resolution = null;
	public ?string $style = null;
	public ?string $localDownload = 'uploads';
	public ?string $localDownloadExpiry = 'uploads';

	#region Constructors, Serialization

  public function __construct( ?string $message = "", ?string $model = null ) {
		parent::__construct( $message );
    $this->model = $model;
    $this->feature = "text-to-image"; // image-to-image, inpainting, etc
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
				'resolution' => $this->resolution
      ],

      'system' => [
        'class' => get_class( $this ),
        'envId' => $this->envId,
        'scope' => $this->scope,
        'session' => $this->session
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

  // Based on the params of the query, update the attributes
  public function inject_params( array $params ): void {
		parent::inject_params( $params );
		$params = $this->convert_keys( $params );
		
		if ( !empty( $params['resolution'] ) ) {
			$this->set_resolution( $params['resolution'] );
		}
		if ( !empty( $params['style'] ) ) {
			$this->set_style( $params['style'] );
		}
  }

	#endregion

	#region Final Checks

	public function final_checks() {
    parent::final_checks();
    
    // Since DALL-E 3 only supports 1 image, we force it. 
    // (Likely the same limitation for other models.)
    $this->maxResults = 1;

    global $mwai_core;
    $engine = Meow_MWAI_Engines_Factory::get( $mwai_core, $this->envId );
    $modelInfo = $engine->retrieve_model_info( $this->model );
    if ( empty( $modelInfo ) ) {
			Meow_MWAI_Logging::error( 'No model info found for model: ' . $this->model, '🖼️' );
			return; 
    }
    
    // Let's check for resolutions.
    if ( !isset( $modelInfo['resolutions'] ) || empty( $modelInfo['resolutions'] ) ) {
			Meow_MWAI_Logging::error( 'No resolutions defined for model: ' . $this->model, '🖼️' );
			return; 
    }

		// If we have no resolution set, we will use the first one
		if ( empty( $this->resolution ) ) {
			$this->resolution = $modelInfo['resolutions'][0]['name'];
		}

    // If we have a resolutions array ([ name, label ]), let’s ensure our current resolution (name) is supported
    $resolutions = $modelInfo['resolutions'];
		$found = false;
		foreach ( $resolutions as $resolution ) {
			if ( $resolution['name'] === $this->resolution ) {
				$found = true;
				break;
			}
		}

		// If we don't find the resolution, we will set it to the first one.
    if ( !$found ) {
			$supportedResolutions = [];
			foreach ( $resolutions as $resolution ) {
				$supportedResolutions[] = $resolution['name'];
			}
			$supportedResolutions = implode( ', ', $supportedResolutions );
			$error = sprintf( 'The model %s does not support the resolution %s (using %s instead). Supported resolutions are: %s.', $this->model, $this->resolution, $resolutions[0]['name'], $supportedResolutions );
			$this->resolution = $resolutions[0]['name'];
			Meow_MWAI_Logging::error( $error, '🖼️'  );
    }
	}
	
	#endregion
}
