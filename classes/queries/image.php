<?php

class Meow_MWAI_Query_Image extends Meow_MWAI_Query_Base {
	public ?string $resolution = '1792x1024';
	public ?string $style = null;

  public function __construct( ?string $prompt = "", ?string $model = "dall-e-3" ) {
		parent::__construct( $prompt );
    $this->model = $model;
    $this->mode = "generation"; // could be generation, edit, variation
  }

	public function set_model( string $model ) {
		$this->model = $model;
	}

	public function set_resolution( string $resolution ) {
		$this->resolution = $resolution;
	}

	public function set_style( string $style ) {
		$this->style = $style;
	}

  // Based on the params of the query, update the attributes
  public function inject_params( $params ) {
    if ( !empty( $params['model'] ) ) {
			$this->set_model( $params['model'] );
		}
		if ( !empty( $params['apiKey'] ) ) {
			$this->set_api_key( $params['apiKey'] );
		}
		if ( !empty( $params['maxResults'] ) ) {
			$this->set_max_results( $params['maxResults'] );
		}
		if ( !empty( $params['env'] ) ) {
			$this->set_env( $params['env'] );
		}
		if ( !empty( $params['session'] ) ) {
			$this->set_session( $params['session'] );
		}
		if ( !empty( $params['botId'] ) ) {
      $this->set_bot_id( $params['botId'] );
    }
		if ( !empty( $params['resolution'] ) ) {
			$this->set_resolution( $params['resolution'] );
		}
		if ( !empty( $params['style'] ) ) {
			$this->set_style( $params['style'] );
		}
  }

}
