<?php

class Meow_MWAI_Query_Image extends Meow_MWAI_Query_Base {
	public ?string $resolution = null;

  public function __construct( ?string $prompt = "", ?string $model = "dall-e" ) {
		parent::__construct( $prompt );
    $this->model = $model;
    $this->mode = "generation"; // could be generation, edit, variation
  }

	public function setModel( string $model ) {
		$this->model = $model;
	}

	public function setResolution( string $resolution ) {
		$this->resolution = $resolution;
	}

  // Based on the params of the query, update the attributes
  public function injectParams( $params ) {
    if ( !empty( $params['model'] ) ) {
			$this->setModel( $params['model'] );
		}
		if ( !empty( $params['apiKey'] ) ) {
			$this->setApiKey( $params['apiKey'] );
		}
		if ( !empty( $params['maxResults'] ) ) {
			$this->setMaxResults( $params['maxResults'] );
		}
		if ( !empty( $params['env'] ) ) {
			$this->setEnv( $params['env'] );
		}
		if ( !empty( $params['session'] ) ) {
			$this->setSession( $params['session'] );
		}
		if ( !empty( $params['botId'] ) ) {
      $this->setBotId( $params['botId'] );
    }
		if ( !empty( $params['resolution'] ) ) {
			$this->setResolution( $params['resolution'] );
		}
  }

}
