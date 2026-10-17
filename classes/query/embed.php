<?php

class Meow_MWAI_Query_Embed extends Meow_MWAI_Query_Base {
  public ?int $dimensions = null;
  public ?string $imageData = null;
  public ?string $imageMimeType = null;

  public function __construct( $messageOrQuery = null ) {
    if ( is_a( $messageOrQuery, 'Meow_MWAI_Query_Text' ) || is_a( $messageOrQuery, 'Meow_MWAI_Query_Assistant' ) ) {
      $lastMessage = $messageOrQuery->get_message();
      if ( trim( (string) $lastMessage ) !== '' ) {
        $this->set_message( $lastMessage );
      }
      $this->session = $messageOrQuery->session;
      $this->scope = $messageOrQuery->scope;
      $this->apiKey = $messageOrQuery->apiKey;
      $this->botId = $messageOrQuery->botId;
      $this->customId = $messageOrQuery->customId;
      $this->envId = $messageOrQuery->envId;
    }
    else {
      // Not a truthiness check: a user typing "0" used to end up with an empty embeddings query.
      parent::__construct( $messageOrQuery ?? '' );
    }

    global $mwai_core;
    $ai_embeddings_default_env = $mwai_core->get_option( 'ai_embeddings_default_env' );
    $ai_embeddings_default_model = $mwai_core->get_option( 'ai_embeddings_default_model' );
    $ai_embeddings_default_dimensions = $mwai_core->get_option( 'ai_embeddings_default_dimensions' );
    if ( empty( $ai_embeddings_default_env ) || empty( $ai_embeddings_default_model ) ) {
      throw new Exception( __( 'No default embeddings environment or model is configured. Please go to Settings > AI > Default Environments for AI > Embeddings and select an environment and model.', 'ai-engine' ) );
    }
    $this->set_env_id( $ai_embeddings_default_env );
    $this->set_model( $ai_embeddings_default_model );
    if ( $ai_embeddings_default_dimensions ) {
      $this->set_dimensions( $ai_embeddings_default_dimensions );
    }
    $this->feature = 'embedding';
  }

  public function set_image_data( $base64, $mimeType ) {
    $this->imageData = $base64;
    $this->imageMimeType = $mimeType;
  }

  public function has_image() {
    return !empty( $this->imageData );
  }

  public function set_dimensions( $dimensions ) {
    $this->dimensions = $dimensions;
  }

  #[\ReturnTypeWillChange]
  public function jsonSerialize(): array {
    $json = [
      'message' => $this->message,

      'ai' => [
        'model' => $this->model,
        'feature' => $this->feature,
        'dimensions' => $this->dimensions,
      ],

      'system' => [
        'class' => get_class( $this ),
        'envId' => $this->envId,
        'scope' => $this->scope,
        'session' => $this->session,
        'customId' => $this->customId,
      ]
    ];

    if ( !empty( $this->context ) ) {
      $json['context']['content'] = $this->context;
    }

    return $json;
  }
}
