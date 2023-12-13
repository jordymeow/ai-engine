<?php

class Meow_MWAI_Query_Embed extends Meow_MWAI_Query_Base {
  
  public function __construct( $promptOrQuery = null, ?string $model = 'text-embedding-ada-002' ) {
		
		if ( is_a( $promptOrQuery, 'Meow_MWAI_Query_Text' ) || is_a( $promptOrQuery, 'Meow_MWAI_Query_Assistant' ) ) {
			$lastMessage = $promptOrQuery->get_last_message();
			if ( !empty( $lastMessage ) ) {
				$this->set_prompt( $lastMessage );
			}
			$this->set_model( $model );
			$this->mode = 'embedding';
			$this->session = $promptOrQuery->session;
			$this->env = $promptOrQuery->env;
			$this->apiKey = $promptOrQuery->apiKey;
			$this->service = $promptOrQuery->service;
			$this->botId = $promptOrQuery->botId;
			$this->envId = $promptOrQuery->envId;
		}
		else {
			parent::__construct( $promptOrQuery ? $promptOrQuery : '' );
    	$this->set_model( $model );
			$this->mode = 'embedding';
		}
  }

  public function inject_params( $params ) {
    if ( !empty( $params['prompt'] ) ) {
      $this->set_prompt( $params['prompt'] );
    }
		if ( !empty( $params['apiKey'] ) ) {
			$this->set_api_key( $params['apiKey'] );
		}
		if ( !empty( $params['env'] ) ) {
			$this->set_env( $params['env'] );
		}
		if ( !empty( $params['session'] ) ) {
			$this->set_session( $params['session'] );
		}
		if ( !empty( $params['service'] ) ) {
			$this->set_service( $params['service'] );
		}
		if ( !empty( $params['botId'] ) ) {
      $this->set_bot_id( $params['botId'] );
    }
  }
}