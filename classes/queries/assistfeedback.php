<?php

class Meow_MWAI_Query_AssistFeedback extends Meow_MWAI_Query_Assistant implements JsonSerializable {
  
  public $lastReply = null;
  public $originalQuery = null;
  public array $blocks;

  #region Constructors, Serialization

  public function __construct( Meow_MWAI_Reply $reply, Meow_MWAI_Query_Assistant $query ) {
    parent::__construct( $query->message );

    $this->lastReply = $reply;
    $this->originalQuery = $query;

    if ( !empty( $query->model ) ) {
      $this->set_model( $query->model );
    }
    if ( !empty( $query->scope ) ) {
      $this->set_scope( $query->scope );
    }
    if ( !empty( $query->session ) ) {
      $this->set_session( $query->session );
    }
    if ( !empty( $query->botId ) ) {
      $this->set_bot_id( $query->botId );
    }
    if ( !empty( $query->envId ) ) {
      $this->set_env_id( $query->envId );
    }
    if ( !empty( $query->chatId ) ) {
      $this->setChatId( $query->chatId );
    }
    if ( !empty( $query->assistantId ) ) {
      $this->setAssistantId( $query->assistantId );
    }
    if ( !empty( $query->threadId ) ) {
      $this->setThreadId( $query->threadId );
    }
    if ( !empty( $query->runId ) ) {
      $this->setRunId( $query->runId );
    }
    if ( !empty( $query->storeId ) ) {
      $this->setStoreId( $query->storeId );
    }
    if ( !empty( $query->functions ) ) {
      $this->set_functions( $query->functions );
    }
    if ( !empty( $query->instructions ) ) {
      $this->set_instructions( $query->instructions );
    }
    if ( !empty( $query->messages ) ) {
      $this->set_messages( $query->messages );
    }
  }

  public function clear_feedback_blocks() {
    $this->blocks = [];
  }

  public function add_feedback_block( $block ) {
    $this->blocks[] = $block;
  }

  #[\ReturnTypeWillChange]
  public function jsonSerialize(): array {
    $json = [
      'message' => $this->message,
      'blocks' => $this->blocks,

      'ai' => [
        'model' => $this->model
      ],

      'system' => [
        'class' => get_class( $this ),
        'envId' => $this->envId,
        //'mode' => $this->mode,
        'scope' => $this->scope,
        'session' => $this->session,
      ]
    ];

    return $json;
  }

  #endregion
}