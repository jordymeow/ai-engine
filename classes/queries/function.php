<?php

class Meow_MWAI_Query_Function implements JsonSerializable {
  public string $name;
  public string $description;
  public array $parameters;
  public string $type;

  public function __construct( string $name, string $description, array $parameters = [], string $type = 'PHP' ) {
    // $name: The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.
    if ( !preg_match( '/^[a-zA-Z0-9_-]{1,64}$/', $name ) ) {
      throw new InvalidArgumentException( "Invalid function name ($name). It must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64." );
    }

    foreach ( $parameters as $parameter ) {
      if ( !( $parameter instanceof Meow_MWAI_Query_Parameter ) ) {
        throw new InvalidArgumentException( "Invalid parameter." );
      }
    }

    $this->name = $name;
    $this->description = $description;
    $this->parameters = $parameters;
    $this->type = $type;
  }

  public function jsonSerialize() {
    $params = [];
    foreach( $this->parameters as $parameter ) {
      $params[ $parameter->name ] = $parameter;
    }
    $required = array_filter( $this->parameters, function( $param ) { return $param->required; } );
    $required = array_map( function( $param ) { return $param->name; }, $required );
    $json = [
      'name' => $this->name,
      'description' => $this->description,
      'parameters' => [
        'type' => 'object',
        'properties' => $params,
      ],
      'required' => $required
    ];
    return $json;
  }
}
