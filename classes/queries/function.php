<?php

class Meow_MWAI_Query_Function {
  public string $name;
  public string $description;
  public array $parameters;
  public string $type;
  public ?string $id;

  public function __construct( string $name, string $description,
    array $parameters = [], string $type = 'PHP', string $id = null ) {
    // $name: The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.
    if ( !preg_match( '/^[a-zA-Z0-9_-]{1,64}$/', $name ) ) {
      throw new InvalidArgumentException( "AI Engine: Invalid function name ($name) for Meow_MWAI_Query_Function." );
    }

    foreach ( $parameters as $parameter ) {
      if ( !( $parameter instanceof Meow_MWAI_Query_Parameter ) ) {
        throw new InvalidArgumentException( "AI Engine: Invalid parameter for Meow_MWAI_Query_Function." );
      }
    }

    $this->name = $name;
    $this->description = $description;
    $this->parameters = $parameters;
    $this->type = $type;
    $this->id = $id;
  }

  public function serializeForOpenAI() {
    // Initialize the base structure with name and description
    $json = [ 'name' => $this->name, 'description' => $this->description ];
  
    // Check if parameters are set and not empty
    if ( !empty( $this->parameters ) ) {
      $properties = [];
      $required = [];
  
      // Loop through each parameter to construct the properties object
      foreach ( $this->parameters as $parameter ) {
        $properties[$parameter->name] = [
          'type' => $parameter->type, // Assuming each parameter has a 'type' attribute
          'description' => $parameter->description, // Assuming each parameter has a 'description' attribute
        ];
  
        // If an enum is set for the parameter, include it
        if ( isset($parameter->enum) ) {
          $properties[$parameter->name]['enum'] = $parameter->enum;
        }
  
        // If the parameter is required, add its name to the required array
        if ( $parameter->required ) {
          $required[] = $parameter->name;
        }
      }
  
      // Assemble the parameters part of the JSON
      $json['parameters'] = [
        'type' => 'object',
        'properties' => $properties,
        'required' => $required,
      ];
    }
  
    return $json;
  }

  public function serializeForAnthropic() 
  {
    $json = [
      'name' => $this->name,
      'description' => $this->description,
      'input_schema' => [
        'type' => 'object',
        'properties' => new stdClass()
      ],
    ];

    if ( !empty( $this->parameters ) ) {
      $properties = [];
      $required = [];
      foreach ( $this->parameters as $parameter ) 
      {
        $properties[$parameter->name] = [
          'type' => $parameter->type,
          'description' => $parameter->description,
        ];
        if ( isset( $parameter->enum ) )  {
          $properties[$parameter->name]['enum'] = $parameter->enum;
        }
        if ( $parameter->required )  {
          $required[] = $parameter->name;
        }
      }
      $json['input_schema']['properties'] = empty( $properties ) ? new stdClass() : $properties;
      if ( !empty( $required ) )  {
        $json['input_schema']['required'] = $required;
      }
    }

    return $json;
  }
}
