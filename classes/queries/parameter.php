<?php

class Meow_MWAI_Query_Parameter implements JsonSerializable {
  public string $name;
  public string $description;
  public string $type;
  public bool $required;
  
  public function __construct( string $name, string $description, string $type = "string", bool $required = false ) {
    // $name: The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.
    if ( !preg_match('/^[a-zA-Z0-9_-]{1,64}$/', $name) ) {
      throw new InvalidArgumentException( "Invalid function name." );
    }

    $this->name = $name;
    $this->description = $description;
    $this->type = $type;
    $this->required = $required;
  }

  public function jsonSerialize() {
    return [
      'type' => $this->type,
      'description' => $this->description
    ];
  }
}