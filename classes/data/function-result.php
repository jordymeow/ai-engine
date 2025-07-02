<?php

/**
* Value object representing the result of a function execution
*/
class Meow_MWAI_Data_FunctionResult {
  public string $id;
  public bool $success;
  public $content;
  public ?string $error;

  private function __construct( string $id, bool $success, $content, ?string $error = null ) {
    $this->id = $id;
    $this->success = $success;
    $this->content = $content;
    $this->error = $error;
  }

  /**
  * Create a successful result
  */
  public static function success( string $id, $content ): self {
    return new self( $id, true, $content );
  }

  /**
  * Create a failed result
  */
  public static function failure( string $id, string $error ): self {
    return new self( $id, false, null, $error );
  }

  /**
  * Get content as string
  */
  public function get_content_string(): string {
    if ( $this->error ) {
      return 'Error: ' . $this->error;
    }
    return is_string( $this->content ) ? $this->content : json_encode( $this->content );
  }

  /**
  * Format for OpenAI Responses API
  */
  public function to_responses_api_format(): array {
    return [
      'type' => 'function_call_output',
      'call_id' => $this->id,
      'output' => $this->get_content_string()
    ];
  }

  /**
  * Format for Anthropic API
  */
  public function to_anthropic_format(): array {
    return [
      'type' => 'tool_result',
      'tool_use_id' => $this->id,
      'content' => [
        [
          'type' => 'text',
          'text' => $this->get_content_string()
        ]
      ]
    ];
  }
}
