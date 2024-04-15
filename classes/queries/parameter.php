<?php

class Meow_MWAI_Query_Parameter {
  public string $name;
  public ?string $description;
  public ?string $type;
  public ?bool $required;
  public ?string $default;
  
  public function __construct( string $name, ?string $description,
    ?string $type = "string", ?bool $required = false, ?string $default = null ) {
    // $name: The name of the argument to be used. Must be a-z, A-Z, 0-9, or contain underscores, with a maximum length of 64, and can start with a dollar sign.
    if ( !preg_match( '/^\$?[a-zA-Z0-9_]{1,64}$/', $name ) ) {
      throw new InvalidArgumentException( "AI Engine: Invalid parameter name ($name) for Meow_MWAI_Query_Parameter." );
    }

    // Make sure the type is valid for JSON Schema.
    if ( !in_array( $type, [ 'string', 'number', 'integer', 'boolean', 'array', 'object' ] ) ) {
      throw new InvalidArgumentException( "AI Engine: Invalid parameter type ($type) for Meow_MWAI_Query_Parameter." );
    }

    $this->name = $name;
    $this->description = empty( $description ) ? "" : $description;
    $this->type = empty( $type ) ? 'string' : $type;
    $this->required = empty( $required ) ? false : $required;
    $this->default = $default;
  }
}