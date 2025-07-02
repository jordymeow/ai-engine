<?php

/**
* Value object representing a function call request from an AI model
*/
class Meow_MWAI_Data_FunctionCall {
  public string $id;
  public string $name;
  public string $arguments;

  public function __construct( string $id, string $name, string $arguments ) {
    $this->id = $id;
    $this->name = $name;
    $this->arguments = $arguments;
  }

  /**
  * Create from OpenAI tool call format
  */
  public static function from_tool_call( array $toolCall ): self {
    return new self(
      $toolCall['id'],
      $toolCall['function']['name'],
      $toolCall['function']['arguments']
    );
  }

  /**
  * Create from Anthropic tool use format
  */
  public static function from_tool_use( array $toolUse ): self {
    return new self(
      $toolUse['id'],
      $toolUse['name'],
      json_encode( $toolUse['input'] )
    );
  }

  /**
  * Get arguments as JSON string
  */
  public function get_arguments_json(): string {
    return $this->arguments;
  }

  /**
  * Get arguments as array
  */
  public function get_arguments_array(): array {
    return json_decode( $this->arguments, true ) ?? [];
  }
}
