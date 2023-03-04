<?php

class Meow_MWAI_QueryEmbed extends Meow_MWAI_Query {
  
  public function __construct( $prompt = '', $model = 'text-embedding-ada-002' ) {
		parent::__construct( $prompt );
    $this->setModel( $model );
		$this->mode = 'embedding';
  }

  public function injectParams( $params ) {
    if ( isset( $params['prompt'] ) ) {
      $this->setPrompt( $params['prompt'] );
    }
		if ( isset( $params['apiKey'] ) ) {
			$this->setApiKey( $params['apiKey'] );
		}
		if ( isset( $params['env'] ) ) {
			$this->setEnv( $params['env'] );
		}
		if ( isset( $params['session'] ) ) {
			$this->setSession( $params['session'] );
		}
  }
}