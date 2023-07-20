<?php

class Meow_MWAI_Query_Transcribe extends Meow_MWAI_Query_Base {
	public string $url = "";
  
  public function __construct( $prompt = '', $model = 'whisper-1' ) {
		parent::__construct( $prompt );
    $this->setModel( $model );
		$this->mode = 'transcription';
  }

	public function setURL( $url ) {
		$this->url = $url;
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
		if ( !empty( $params['mode'] ) ) {
			$this->setMode( $params['mode'] );
		}
		if ( !empty( $params['url'] ) ) {
			$this->setURL( $params['url'] );
		}
		if ( !empty( $params['botId'] ) ) {
      $this->setBotId( $params['botId'] );
    }
  }
}