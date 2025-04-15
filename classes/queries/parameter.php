<?php

class Meow_MWAI_Query_Parameter {
  public string $name;
  public ?string $description;
  public ?string $type;
  public ?bool $required;
  public ?string $default;
  
  public function __construct( string $name, ?string $description,
    ?string $type = "string", ?bool $required = false, ?string $default = null ) {

    // Make sure the name is valid for JSON Schema 
    if ( !preg_match( '/^\$?[a-zA-Z0-9_]{1,64}$/', $name ) ) {
      Meow_MWAI_Logging::error( "AI Engine: Invalid parameter name ($name) for Meow_MWAI_Query_Parameter." );
    }
    if ( !in_array( $type, [ 'string', 'number', 'integer', 'boolean', 'array', 'object' ] ) ) {
      Meow_MWAI_Logging::error( "AI Engine: Invalid parameter type ($type) for Meow_MWAI_Query_Parameter." );
    }

    $this->name = $name;
    $this->description = empty( $description ) ? "" : $description;
    $this->type = empty( $type ) ? 'string' : $type;
    $this->required = empty( $required ) ? false : $required;
    $this->default = $default;
  }
}