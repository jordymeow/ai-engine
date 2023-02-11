<?php

class Meow_MWAI_QueryImage extends Meow_MWAI_Query {

  public function __construct( $prompt = "", $model = "dall-e" ) {
    $this->prompt = $prompt;
    $this->model = $model;
    $this->mode = "generation"; // could be generation, edit, variation
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
