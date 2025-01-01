<?php

class Meow_MWAI_Query_Feedback extends Meow_MWAI_Query_Text implements JsonSerializable {
  
  public $lastReply = null;
  public $originalQuery = null;
  public array $blocks;

  #region Constructors, Serialization

  public function __construct( Meow_MWAI_Reply $reply, Meow_MWAI_Query_Text $query ) {
    parent::__construct( $query->message );

    $this->lastReply = $reply;
    $this->originalQuery = $query;

    if ( !empty( $query->model ) ) {
      $this->set_model( $query->model );
    }
    if ( !empty( $query->maxTokens ) ) {
      $this->set_max_tokens( $query->maxTokens );
    }
    if ( !empty( $query->temperature ) ) {
      $this->set_temperature( $query->temperature );
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
        'model' => $this->model,
        'feature' => $this->feature,
      ],

      'system' => [
        'class' => get_class( $this ),
        'envId' => $this->envId,
        'scope' => $this->scope,
        'session' => $this->session,
      ]
    ];

    return $json;
  }

  #endregion
}