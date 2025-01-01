<?php

class Meow_MWAI_Query_Assistant extends Meow_MWAI_Query_Base implements JsonSerializable {
  
  // Core Content
  public ?Meow_MWAI_Query_DroppedFile $attachedFile = null;

  // Parameters
  public ?string $chatId = null;
  public ?string $runId = null;
  public ?string $assistantId = null;
  public ?string $threadId = null;
  public ?string $storeId = null; // Vector Store ID (https://platform.openai.com/docs/api-reference/vector-stores)
  
  #region Constructors, Serialization

  public function __construct( ?string $message = '' ) {
    parent::__construct( $message );
    $this->feature = "assistant"; 
  }

  #[\ReturnTypeWillChange]
  public function jsonSerialize(): array {
    $json = [
      'message' => $this->message,

      'ai' => [
        'model' => $this->model,
        'feature' => $this->feature,
        'assistantId' => $this->assistantId,
        'threadId' => $this->threadId,
        'storeId' => $this->storeId,
        'runId' => $this->runId,
      ],

      'system' => [
        'class' => get_class( $this ),
        'envId' => $this->envId,
        'scope' => $this->scope,
        'session' => $this->session,
        'chatId' => $this->chatId,
      ]
    ];

    if ( !empty( $this->context ) ) {
      $json['context']['context'] = $this->context;
    }

    if ( !empty( $this->attachedFile ) ) {
      $json['context']['hasFile'] = true;
      // Assistant only supports URL for now.
      if ( $this->attachedFile->get_type() === 'url' ) {
        $json['context']['fileUrl'] = $this->attachedFile->get_url();
      }
    }

    return $json;
  }

  #endregion

  #region File Handling

  public function set_file( Meow_MWAI_Query_DroppedFile $file ): void {
    $this->attachedFile = $file;
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

  public function setStoreId( string $storeId ): void {
    $this->storeId = $storeId;
  }

  public function setRunId( string $runId ): void {
    $this->runId = $runId;
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