<?php

class Meow_MWAI_Query_Embed extends Meow_MWAI_Query_Base {
  
  public function __construct( $promptOrQuery = null, ?string $model = 'text-embedding-ada-002' ) {
		
		if ( is_a( $promptOrQuery, 'Meow_MWAI_Query_Text' ) ) {
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
			$this->botId = $promptOrQuery->botId;
		}
		else {
			parent::__construct( $promptOrQuery ? $promptOrQuery : '' );
    	$this->setModel( $model );
			$this->mode = 'embedding';
		}
  }

  public function injectParams( $params ) {
    if ( !empty( $params['prompt'] ) ) {
      $this->setPrompt( $params['prompt'] );
    }
		if ( !empty( $params['apiKey'] ) ) {
			$this->setApiKey( $params['apiKey'] );
		}
		if ( !empty( $params['env'] ) ) {
			$this->setEnv( $params['env'] );
		}
		if ( !empty( $params['session'] ) ) {
			$this->setSession( $params['session'] );
		}
		if ( !empty( $params['service'] ) ) {
			$this->setService( $params['service'] );
		}
    if ( !empty( $params['api_key'] ) ) {
			$this->setApiKey( $params['apiKey'] );
		}
    if ( !empty( $params['apiKey'] ) ) {
			$this->setApiKey( $params['apiKey'] );
		}
		if ( !empty( $params['botId'] ) ) {
      $this->setBotId( $params['botId'] );
    }
  }
}