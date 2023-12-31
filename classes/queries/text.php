<?php

class Meow_MWAI_Query_Text extends Meow_MWAI_Query_Base implements JsonSerializable {

  // Core Content
  public ?string $imageUrl = null;
  public ?string $imageData = null;
  
  // Parameters
  public float $temperature = 0.8;
  public int $maxTokens = 1024;
  public ?string $stop = null;
  public ?string $responseFormat = null;
  
  public function __construct( ?string $message = '', ?int $maxTokens = null, string $model = null ) {
    parent::__construct( $message );
    if ( !empty( $model ) ) {
      $this->set_model( $model );
    }
    if ( !empty( $maxTokens ) ) {
      $this->set_max_tokens( $maxTokens );
    }
  }

  #[\ReturnTypeWillChange]
  public function jsonSerialize() {
    $json = [
      'instructions' => $this->instructions,
      'message' => $this->message,

      'context' => [
        'messages' => $this->messages
      ],

      'ai' => [
        'model' => $this->model,
        'maxTokens' => $this->maxTokens,
        'temperature' => $this->temperature,
      ],

      'system' => [
        'class' => get_class( $this ),
        'envId' => $this->envId,
        'mode' => $this->mode,
        'scope' => $this->scope,
        'session' => $this->session,
        'maxMessages' => $this->maxMessages,
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

  /**
   * The type of return expected from the API. It can be either null or "json".
   * @param int $maxResults The maximum number of completions.
   */
  public function set_response_format( $responseFormat ) {
    if ( !empty( $responseFormat ) && $responseFormat !== 'json' ) {
      throw new Exception( "AI Engine: The response format can only be null or json." );
    }
    $this->responseFormat = $responseFormat;
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

  /**
   * The maximum number of tokens to generate in the completion.
   * The token count of your prompt plus max_tokens cannot exceed the model's context length.
   * Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
   * @param float $maxTokens The maximum number of tokens.
   */
  public function set_max_tokens( int $maxTokens ): void {
    $this->maxTokens = $maxTokens;
  }

  /**
   * Set the sampling temperature to use. Higher values means the model will take more risks.
   * Try 0.9 for more creative applications, and 0 for ones with a well-defined reply.
   * @param float $temperature The temperature.
   */
  public function set_temperature( float $temperature ): void {
    $temperature = floatval( $temperature );
    if ( $temperature > 1 ) {
      $temperature = 1;
    }
    if ( $temperature < 0 ) {
      $temperature = 0;
    }
    $this->temperature = round( $temperature, 2 );
  }

  public function set_stop( string $stop ): void {
    $this->stop = $stop;
  }

  // Based on the params of the query, update the attributes
  public function inject_params( array $params ): void
  {
    parent::inject_params( $params );
    $params = $this->convert_keys( $params );

    if ( !empty( $params['maxTokens'] ) && intval( $params['maxTokens'] ) > 0 ) {
			$this->set_max_tokens( intval( $params['maxTokens'] ) );
		}
		if ( !empty( $params['temperature'] ) ) {
			$this->set_temperature( $params['temperature'] );
		}
		if ( !empty( $params['stop'] ) ) {
			$this->set_stop( $params['stop'] );
		}
    if ( !empty( $params['responseFormat'] ) ) {
      $this->set_response_format( $params['responseFormat'] );
    }
  }
}