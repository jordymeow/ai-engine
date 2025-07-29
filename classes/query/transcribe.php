<?php

class Meow_MWAI_Query_Transcribe extends Meow_MWAI_Query_Base {
  public string $url = '';
  public ?string $path = null;
  public ?string $audioData = null;
  public ?string $mimeType = null;

  // Core Content
  public ?Meow_MWAI_Query_DroppedFile $attachedFile = null;

  public function __construct( $message = '', $model = 'whisper-1' ) {
    parent::__construct( $message );
    $this->set_model( $model );
    $this->feature = 'transcription';
  }

  public function set_url( $url ) {
    $this->url = $url;
  }

  public function set_path( $path ) {
    $this->path = $path;
  }

  public function set_audio_data( $data, $mimeType = null ) {
    $this->audioData = $data;
    $this->mimeType = $mimeType;
  }

  // Based on the params of the query, update the attributes
  public function inject_params( array $params ): void {
    parent::inject_params( $params );
    $params = $this->convert_keys( $params );

    if ( !empty( $params['url'] ) ) {
      $this->set_url( $params['url'] );
    }
    if ( !empty( $params['path'] ) ) {
      $this->set_path( $params['path'] );
    }
    if ( !empty( $params['audioData'] ) || !empty( $params['audio_data'] ) ) {
      $audioData = $params['audioData'] ?? $params['audio_data'];
      $mimeType = $params['mimeType'] ?? $params['mime_type'] ?? null;
      $this->set_audio_data( $audioData, $mimeType );
    }
  }

  #region File Handling

  public function set_file( Meow_MWAI_Query_DroppedFile $file ): void {
    $this->attachedFile = $file;
  }

  #endregion
}
