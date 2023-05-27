<?php

class Meow_MWAI_Query_Image extends Meow_MWAI_Query_Base {

  public function __construct( ?string $prompt = "", ?string $model = "dall-e" ) {
		parent::__construct( $prompt );
    $this->model = $model;
    $this->mode = "generation"; // could be generation, edit, variation
  }

	public function setModel( string $model ) {
		// Can't be changed to another model for now.
	}

  // Based on the params of the query, update the attributes
  public function injectParams( $params ) {
    if ( isset( $params['model'] ) ) {
			$this->setModel( $params['model'] );
		}
		if ( isset( $params['apiKey'] ) ) {
			$this->setApiKey( $params['apiKey'] );
		}
		if ( isset( $params['maxResults'] ) ) {
			$this->setMaxResults( $params['maxResults'] );
		}
		if ( isset( $params['env'] ) ) {
			$this->setEnv( $params['env'] );
		}
		if ( isset( $params['session'] ) ) {
			$this->setSession( $params['session'] );
		}
  }

}
