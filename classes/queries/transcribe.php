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
}