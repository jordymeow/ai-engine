<?php

class Meow_MWAI_Query_Text extends Meow_MWAI_Query_Base implements JsonSerializable {
  // Core Content
  public ?Meow_MWAI_Query_DroppedFile $attachedFile = null;
  public ?array $attachedFiles = null; // Multiple files support

  // Parameters
  public ?float $temperature = null;
  public ?int $maxTokens = null;
  public ?string $stop = null;
  public ?string $responseFormat = null;
  public ?string $reasoning = null;  // GPT-5 reasoning effort
  public ?string $verbosity = null;  // GPT-5 verbosity level

  #region Constructors, Serialization

  public function __construct( ?string $message = '', ?int $maxTokens = null, ?string $model = null ) {
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
        'customId' => $this->customId,
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

    if ( !empty( $this->attachedFiles ) ) {
      $json['context']['hasFiles'] = true;
      $json['context']['fileCount'] = count( $this->attachedFiles );
    }

    return $json;
  }

  #endregion

  #region File Handling

  /**
   * Get all attached files as a normalized array.
   * This method provides backward compatibility by merging both attachedFile (legacy)
   * and attachedFiles (current) into a single array.
   *
   * @return Meow_MWAI_Query_DroppedFile[] Array of attached files
   */
  public function getAttachments(): array {
    $files = $this->attachedFiles ?? [];

    // Backward compatibility: include legacy attachedFile if it exists and isn't already in the array
    if ( $this->attachedFile && !in_array( $this->attachedFile, $files, true ) ) {
      // Prepend the single file so it appears first (maintains legacy behavior)
      array_unshift( $files, $this->attachedFile );
    }

    return $files;
  }

  /**
   * Add a file to the attachedFiles array.
   * This is the unified method for both single and multi-file uploads.
   */
  public function add_file( Meow_MWAI_Query_DroppedFile $file ): void {
    if ( $this->attachedFiles === null ) {
      $this->attachedFiles = [];
    }
    $this->attachedFiles[] = $file;
  }

  public function set_files( array $files ): void {
    $this->attachedFiles = $files;
  }

  public function get_files(): ?array {
    return $this->attachedFiles;
  }

  #endregion

  #region Parameters

  /**
  * The type of return expected from the API. It can be either null or "json".
  * @param int $maxResults The maximum number of completions.
  */
  public function set_response_format( $responseFormat ) {
    if ( !empty( $responseFormat ) && $responseFormat !== 'json' ) {
      throw new Exception( 'AI Engine: The response format can only be null or json.' );
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

  /**
  * Set the reasoning effort for GPT-5 models.
  * @param string $reasoning The reasoning effort level (minimal, low, medium, high).
  */
  public function set_reasoning( string $reasoning ): void {
    $valid = ['minimal', 'low', 'medium', 'high'];
    if ( !in_array( $reasoning, $valid ) ) {
      throw new Exception( 'AI Engine: Invalid reasoning level. Must be one of: minimal, low, medium, high.' );
    }
    $this->reasoning = $reasoning;
  }

  /**
  * Set the verbosity level for GPT-5 models.
  * @param string $verbosity The verbosity level (low, medium, high).
  */
  public function set_verbosity( string $verbosity ): void {
    $valid = ['low', 'medium', 'high'];
    if ( !in_array( $verbosity, $valid ) ) {
      throw new Exception( 'AI Engine: Invalid verbosity level. Must be one of: low, medium, high.' );
    }
    $this->verbosity = $verbosity;
  }

  #endregion

  #region Inject Params

  // Based on the params of the query, update the attributes
  public function inject_params( array $params ): void {
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
    // Accept both 'reasoning' and 'reasoningEffort' (UI uses reasoningEffort)
    if ( !empty( $params['reasoning'] ) ) {
      $this->set_reasoning( $params['reasoning'] );
    }
    if ( !empty( $params['reasoningEffort'] ) ) {
      $this->set_reasoning( $params['reasoningEffort'] );
    }
    if ( !empty( $params['verbosity'] ) ) {
      $this->set_verbosity( $params['verbosity'] );
    }
    // Store prompt-related params as extra params
    if ( !empty( $params['promptId'] ) ) {
      $this->setExtraParam( 'promptId', $params['promptId'] );
    }
    // TODO: Prompt Variables support - might be added later
    // if ( !empty( $params['promptVariables'] ) ) {
    //   $this->setExtraParam( 'promptVariables', $params['promptVariables'] );
    // }
    // if ( !empty( $params['promptVersion'] ) ) {
    //   $this->setExtraParam( 'promptVersion', $params['promptVersion'] );
    // }
  }

  #endregion
}
