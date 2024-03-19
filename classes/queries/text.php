<?php

class Meow_MWAI_Query_Text extends Meow_MWAI_Query_Base implements JsonSerializable {

  // Core Content
  public ?string $file = null;
  public ?string $fileType = null; // refId, url, data
  public ?string $mimeType = 'image/jpeg';
  public ?string $filePurpose = null; // assistant, vision

  // Parameters
  public float $temperature = 0.8;
  public int $maxTokens = 1024;
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
  public function jsonSerialize() {
    $json = [
      //'instructions' => $this->instructions,
      'message' => $this->message,

      // 'context' => [
      //   'messages' => $this->messages
      // ],

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

  public function set_file( string $file, string $fileType = null,
    string $filePurpose = null, string $mimeType = null ) : void {
    if ( !empty( $fileType ) && $fileType !== 'refId' && $fileType !== 'url' && $fileType !== 'data' ) {
      throw new Exception( "AI Engine: The file type can only be refId, url or data." );
    }
    if ( !empty( $filePurpose ) && $filePurpose !== 'assistant-in' && $filePurpose !== 'vision' ) {
      throw new Exception( "AI Engine: The file purpose can only be assistant or vision." );
    }
    if ( !empty( $mimeType ) ) {
      $this->mimeType = $mimeType;
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

  // TODO: Those file-related methods should be checked and streaminled.
  // It's used by OpenAI, OpenRouter and Anthropic.
  public function get_file_data() {
    if ( $this->fileType === 'url' ) {
      $data = file_get_contents( $this->file );
      return base64_encode( $data );
    }
    else if ( $this->fileType === 'data' ) {
      return $this->file;
    }
  }

  public function get_file_mime_type() {
    return $this->mimeType;
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