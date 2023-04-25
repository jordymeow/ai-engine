<?php

class Meow_MWAI_QueryEmbed extends Meow_MWAI_Query {
  
  public function __construct( mixed $promptOrQuery = null, ?string $model = 'text-embedding-ada-002' ) {
		
		if ( is_a( $promptOrQuery, 'Meow_MWAI_QueryText' ) ) {
			$lastMessage = $promptOrQuery->getLastMessage();
			if ( !empty( $lastMessage ) ) {
				$this->setPrompt( $lastMessage );
			}
			$this->setModel( $model );
			$this->mode = 'embedding';
			$this->session = $promptOrQuery->session;
			$this->env = $promptOrQuery->env;
			$this->apiKey = $promptOrQuery->apiKey;
			$this->service = $promptOrQuery->service;
		}
		else {
			parent::__construct( $promptOrQuery ? $promptOrQuery : '' );
    	$this->setModel( $model );
			$this->mode = 'embedding';
		}
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
		if ( isset( $params['service'] ) ) {
			$this->setService( $params['service'] );
		}
    if ( isset( $params['api_key'] ) ) {
			$this->setApiKey( $params['apiKey'] );
		}
    if ( isset( $params['apiKey'] ) ) {
			$this->setApiKey( $params['apiKey'] );
		}
  }
}