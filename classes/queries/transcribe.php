<?php

class Meow_MWAI_Query_Transcribe extends Meow_MWAI_Query_Base {
	public string $url = "";
  
  public function __construct( $prompt = '', $model = 'whisper-1' ) {
		parent::__construct( $prompt );
    $this->set_model( $model );
		$this->mode = 'transcription';
  }

	public function setURL( $url ) {
		$this->url = $url;
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
		if ( !empty( $params['url'] ) ) {
			$this->setURL( $params['url'] );
		}
		if ( !empty( $params['botId'] ) ) {
      $this->set_bot_id( $params['botId'] );
    }
  }
}