<?php

class Meow_MWAI_Query_Assistant extends Meow_MWAI_Query_Base implements JsonSerializable {
  
  // Core Content
  public ?string $imageUrl = null;
  public ?string $imageData = null;

  // Assistant
  public ?string $chatId = null;
  public ?string $assistantId = null;
  public ?string $threadId = null;
  
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

    if ( !empty( $this->imageUrl ) || !empty( $this->imageData ) ) {
      $json['context']['hasImage'] = true;
    }

    if ( !empty( $this->imageUrl ) ) {
      $json['context']['imageUrl'] = $this->imageUrl;
    }

    return $json;
  }

  public function set_image( string $imageUrl ): void {
    $this->imageUrl = $imageUrl;
  }

  public function set_image_data( string $imageData ): void {
    $this->imageData = $imageData;
  }

  public function get_image_url() {
    if ( !empty( $this->imageUrl ) ) {
      return $this->imageUrl;
    }
    if ( !empty( $this->imageData ) ) {
      return "data:image/jpeg;base64,{$this->imageData}";
    }
  }

  public function setAssistantId( string $assistantId ): void {
    $this->assistantId = $assistantId;
  }

  public function setChatId( string $chatId ): void {
    $this->chatId = $chatId;
  }

  public function setThreadId( string $threadId ): void {
    $this->threadId = $threadId;
  }

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
}