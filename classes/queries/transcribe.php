<?php

class Meow_MWAI_Query_Transcribe extends Meow_MWAI_Query_Base {
	public string $url = "";
  
  public function __construct( $message = '', $model = 'whisper-1' ) {
		parent::__construct( $message );
    $this->set_model( $model );
		$this->mode = 'transcription';
  }

	public function set_url( $url ) {
		$this->url = $url;
	}

	// Based on the params of the query, update the attributes
  public function inject_params( array $params ): void
  {
    parent::inject_params( $params );
    $params = $this->convert_keys( $params );

		if ( !empty( $params['url'] ) ) {
			$this->set_url( $params['url'] );
		}
  }
}