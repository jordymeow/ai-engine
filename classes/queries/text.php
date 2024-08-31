<?php

class Meow_MWAI_Query_Text extends Meow_MWAI_Query_Base implements JsonSerializable {

  // Core Content
  public ?Meow_MWAI_Query_DroppedFile $attachedFile = null;

  // Parameters
  public ?float $temperature = null;
  public ?int $maxTokens = null;
  public ?string $stop = null;
  public ?string $responseFormat = null;
  
  #region Constructors, Serialization

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
  public function jsonSerialize(): array {
    $json = [
      'message' => $this->message,
      'instructions' => $this->instructions,

      'ai' => [
        'model' => $this->model,
        'feature' => $this->feature,
        'maxTokens' => $this->maxTokens,
        'temperature' => $this->temperature,
      ],

      'system' => [
        'class' => get_class( $this ),
        'envId' => $this->envId,
        'scope' => $this->scope,
        'session' => $this->session,
        'maxMessages' => $this->maxMessages,
      ]
    ];

    if ( !empty( $this->context ) ) {
      $json['context']['content'] = $this->context;
    }

    if ( !empty( $this->attachedFile ) ) {
      $json['context']['hasFile'] = true;
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

  #endregion

  #region Inject Params

  // Based on the params of the query, update the attributes
  public function inject_params( array $params ): void
  {
    parent::inject_params( $params );
    $params = $this->convert_keys( $params );

    if ( !empty( $params['maxTokens'] ) && intval( $params['maxTokens'] ) > 0 ) {
			$this->set_max_tokens( intval( $params['maxTokens'] ) );
		}
		if ( isset( $params['temperature'] ) && $params['temperature'] !== '' ) {
			$this->set_temperature( $params['temperature'] );
		}
		if ( !empty( $params['stop'] ) ) {
			$this->set_stop( $params['stop'] );
		}
    if ( !empty( $params['responseFormat'] ) ) {
      $this->set_response_format( $params['responseFormat'] );
    }
  }

  #endregion
}