<?php

// Load constants once at class definition
if ( !defined( 'MWAI_STREAM_TYPES' ) ) {
  require_once MWAI_PATH . '/constants/stream_types.php';
}

class Meow_MWAI_Event {
  private $type;
  private $subtype;
  private $content;
  private $metadata;
  private $visibility;
  private $timestamp;
  
  public function __construct( $type = 'live', $subtype = null ) {
    $this->type = $type;
    $this->subtype = $subtype ?: MWAI_STREAM_TYPES['CONTENT'];
    $this->content = '';
    $this->metadata = [];
    $this->visibility = $this->get_default_visibility( $this->subtype );
    $this->timestamp = microtime( true );
  }
  
  // Setters with fluent interface
  public function set_content( $content ) {
    $this->content = $content;
    return $this;
  }
  
  public function set_metadata( $key, $value = null ) {
    if ( is_array( $key ) ) {
      $this->metadata = array_merge( $this->metadata, $key );
    } else {
      $this->metadata[$key] = $value;
    }
    return $this;
  }
  
  public function set_visibility( $visibility ) {
    $this->visibility = $visibility;
    return $this;
  }
  
  public function set_subtype( $subtype ) {
    $this->subtype = $subtype;
    $this->visibility = $this->get_default_visibility( $subtype );
    return $this;
  }
  
  // Get default visibility based on subtype
  private function get_default_visibility( $subtype ) {
    $hidden_types = [
      MWAI_STREAM_TYPES['TOOL_ARGS'],
      MWAI_STREAM_TYPES['DEBUG'],
      MWAI_STREAM_TYPES['HEARTBEAT'],
    ];
    
    $collapsed_types = [
      MWAI_STREAM_TYPES['THINKING'],
      MWAI_STREAM_TYPES['MCP_DISCOVERY'],
      MWAI_STREAM_TYPES['STATUS'],
    ];
    
    if ( in_array( $subtype, $hidden_types ) ) {
      return MWAI_STREAM_VISIBILITY['HIDDEN'];
    }
    
    if ( in_array( $subtype, $collapsed_types ) ) {
      return MWAI_STREAM_VISIBILITY['COLLAPSED'];
    }
    
    return MWAI_STREAM_VISIBILITY['VISIBLE'];
  }
  
  // Convert to array for JSON encoding
  public function to_array() {
    $data = [
      'type' => $this->type,
      'data' => $this->content,
      'timestamp' => $this->timestamp,
    ];
    
    // Only add extra fields for 'live' messages
    if ( $this->type === 'live' ) {
      $data['subtype'] = $this->subtype;
      $data['visibility'] = $this->visibility;
      
      if ( !empty( $this->metadata ) ) {
        $data['metadata'] = $this->metadata;
      }
    }
    
    return $data;
  }
  
  // Static factory methods for common message types
  public static function content( $content ) {
    return ( new self( 'live', MWAI_STREAM_TYPES['CONTENT'] ) )
      ->set_content( $content );
  }
  
  public static function thinking( $content ) {
    return ( new self( 'live', MWAI_STREAM_TYPES['THINKING'] ) )
      ->set_content( $content );
  }
  
  public static function tool_call( $tool_name, $args = null ) {
    $msg = ( new self( 'live', MWAI_STREAM_TYPES['TOOL_CALL'] ) )
      ->set_content( "Calling function: $tool_name" )
      ->set_metadata( 'tool_name', $tool_name );
    
    if ( $args ) {
      $msg->set_metadata( 'args', $args );
    }
    
    return $msg;
  }
  
  public static function status( $status, $details = null ) {
    $msg = ( new self( 'live', MWAI_STREAM_TYPES['STATUS'] ) )
      ->set_content( $status );
    
    if ( $details ) {
      $msg->set_metadata( 'details', $details );
    }
    
    return $msg;
  }
  
  public static function debug( $message, $data = null ) {
    $msg = ( new self( 'live', MWAI_STREAM_TYPES['DEBUG'] ) )
      ->set_content( $message );
    
    if ( $data ) {
      $msg->set_metadata( 'debug_data', $data );
    }
    
    return $msg;
  }
  
  public static function error( $message ) {
    return new self( 'error', null );
  }
  
  public static function end( $data ) {
    return new self( 'end', null );
  }
  
  // Standardized event helpers for consistent messaging
  
  public static function request_sent() {
    return self::status( 'Request sent...' );
  }
  
  public static function generating_response() {
    return self::status( 'Generating response...' );
  }
  
  public static function response_completed() {
    return self::status( 'Response completed.' );
  }
  
  public static function request_completed( $duration ) {
    return self::status( "Request completed in $duration." );
  }
  
  public static function stream_completed() {
    return self::status( 'Stream completed.' );
  }
  
  public static function mcp_discovery( $server_count, $tool_count ) {
    return ( new self( 'live', MWAI_STREAM_TYPES['MCP_DISCOVERY'] ) )
      ->set_content( "Got $server_count MCP server(s) and $tool_count tool(s)." )
      ->set_metadata( 'server_count', $server_count )
      ->set_metadata( 'tool_count', $tool_count );
  }
  
  public static function mcp_calling( $tool_name, $tool_id = null, $args = null ) {
    $msg = ( new self( 'live', 'mcp_tool_call' ) )
      ->set_content( "Calling $tool_name..." )
      ->set_metadata( 'tool_name', $tool_name )
      ->set_metadata( 'is_mcp', true );
    
    if ( $tool_id ) {
      $msg->set_metadata( 'tool_id', $tool_id );
    }
    
    if ( $args ) {
      $msg->set_metadata( 'arguments', $args );
    }
    
    return $msg;
  }
  
  public static function mcp_result( $tool_name, $tool_use_id = null ) {
    $msg = ( new self( 'live', 'mcp_tool_result' ) )
      ->set_content( "Got result from $tool_name." )
      ->set_metadata( 'tool_name', $tool_name )
      ->set_metadata( 'is_mcp', true );
    
    if ( $tool_use_id ) {
      $msg->set_metadata( 'tool_use_id', $tool_use_id );
    }
    
    return $msg;
  }
  
  public static function function_calling( $function_name, $args = null ) {
    $msg = ( new self( 'live', MWAI_STREAM_TYPES['TOOL_CALL'] ) )
      ->set_content( "Calling $function_name..." )
      ->set_metadata( 'tool_name', $function_name );
    
    if ( $args ) {
      $msg->set_metadata( 'arguments', $args );
    }
    
    return $msg;
  }
  
  public static function function_result( $function_name ) {
    return ( new self( 'live', MWAI_STREAM_TYPES['TOOL_RESULT'] ) )
      ->set_content( "Got result from $function_name." )
      ->set_metadata( 'tool_name', $function_name );
  }
  
  public static function embeddings( $count, $query = null, $namespace = null ) {
    $content = $count > 0 
      ? "Found $count relevant context(s) from embeddings." 
      : "Searching embeddings...";
    
    $msg = ( new self( 'live', MWAI_STREAM_TYPES['EMBEDDINGS'] ) )
      ->set_content( $content )
      ->set_metadata( 'count', $count );
    
    if ( $query ) {
      $msg->set_metadata( 'query', $query );
    }
    
    if ( $namespace ) {
      $msg->set_metadata( 'namespace', $namespace );
    }
    
    return $msg;
  }
}