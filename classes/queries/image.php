<?php

class Meow_MWAI_Query_Image extends Meow_MWAI_Query_Base {
	public ?string $resolution = '1792x1024';
	public ?string $style = null;

	#region Constructors, Serialization

  public function __construct( ?string $message = "", ?string $model = "dall-e-3" ) {
		parent::__construct( $message );
    $this->model = $model;
    $this->mode = "generation"; // could be generation, edit, variation
  }

	#endregion

	#region Parameters

	public function set_resolution( string $resolution ) {
		$this->resolution = $resolution;
	}

	public function set_style( string $style ) {
		$this->style = $style;
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
