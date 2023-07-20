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
  }

}
