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
		if ( isset( $params['mode'] ) ) {
			$this->setMode( $params['mode'] );
		}
		if ( isset( $params['url'] ) ) {
			$this->setURL( $params['url'] );
		}
  }
}