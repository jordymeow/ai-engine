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
		// Since DALL-E 3 only support 1 image, we force it. I guess it will be the same for other models.
		$this->maxResults = 1;
	}
	
	#endregion
}
