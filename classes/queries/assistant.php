<?php

class Meow_MWAI_Query_Assistant extends Meow_MWAI_Query_Base implements JsonSerializable {
  
  // Core Content
  public ?string $file = null;
  public ?string $fileType = null; // refId, url, data
  public ?string $filePurpose = null; // assistant, vision

  // Parameters
  public ?string $chatId = null;
  public ?string $assistantId = null;
  public ?string $threadId = null;
  
  #region Constructors, Serialization

  public function __construct( ?string $message = '' ) {
    parent::__construct( $message );
    $this->mode = "assistant"; 
  }

  #[\ReturnTypeWillChange]
  public function jsonSerialize() {
    return [
      'message' => $this->message,

      'ai' => [
        'model' => $this->model,
        'assistantId' => $this->assistantId,
        'threadId' => $this->threadId,
      ],

      'context' => [
      ],

      'system' => [
        'class' => get_class( $this ),
        'envId' => $this->envId,
        'mode' => $this->mode,
        'scope' => $this->scope,
        'session' => $this->session,
        'chatId' => $this->chatId,
      ]
    ];

    if ( !empty( $this->context ) ) {
      $json['context']['context'] = $this->context;
    }

    if ( !empty( $this->file ) ) {
      $json['context']['hasFile'] = true;
      if ( $this->fileType === 'url' ) {
        $json['context']['fileUrl'] = $this->file;
      }
    }

    return $json;
  }

  #endregion

  #region File Handling

  public function set_file( string $file, string $fileType = null, string $filePurpose = null ): void {
    if ( !empty( $fileType ) && $fileType !== 'refId' && $fileType !== 'url' && $fileType !== 'data' ) {
      throw new Exception( "AI Engine: The file type can only be refId, url or data." );
    }
    if ( !empty( $filePurpose ) && $filePurpose !== 'assistant-in' && $filePurpose !== 'vision' ) {
      throw new Exception( "AI Engine: The file purpose can only be assistant or vision." );
    }
    $this->file = $file;
    $this->fileType = $fileType;
    $this->filePurpose = $filePurpose;
  }

  public function get_file_url() {
    if ( $this->fileType === 'url' ) {
      return $this->file;
    }
    else if ( $this->fileType === 'data' ) {
      return "data:image/jpeg;base64,{$this->file}";
    }
    else if ( $this->fileType === 'refId' ) {
      throw new Exception( "AI Engine: The file type refId is not supported yet." );
    }
    else {
      return null;
    }
  }

  #endregion

  #region Parameters

  public function setAssistantId( string $assistantId ): void {
    $this->assistantId = $assistantId;
  }

  public function setChatId( string $chatId ): void {
    $this->chatId = $chatId;
  }

  public function setThreadId( string $threadId ): void {
    $this->threadId = $threadId;
  }

  #endregion

  #region Inject Params

  // Based on the params of the query, update the attributes
  public function inject_params( array $params ): void
  {
    parent::inject_params( $params );

    // Those are for the keys passed directly by the shortcode.
    $params = $this->convert_keys( $params );

    // Additional for Assistant.
    if ( !empty( $params['chatId'] ) ) {
      $this->setChatId( $params['chatId'] );
    }
    if ( !empty( $params['assistantId'] ) ) {
      $this->setAssistantId( $params['assistantId'] );
    }
    if ( !empty( $params['threadId'] ) ) {
      $this->setThreadId( $params['threadId'] );
    }
  }

  #endregion
}