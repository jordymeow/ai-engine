<?php

class Meow_MWAI_Engines_Core {
  protected $core = null;
  public $env = null;
  public $envId = null;
  public $envType = null;

  public function __construct( $core, $env ) {
    $this->core = $core;
    $this->env = $env;
    $this->envId = $env['id'];
    $this->envType = $env['type'];
  }

  public function run( $query, $streamCallback = null ) {

    // Check if the query is allowed.
    $limits = $this->core->get_option( 'limits' );
    $allowed = apply_filters( 'mwai_ai_allowed', true, $query, $limits );
    if ( $allowed !== true ) {
      $message = is_string( $allowed ) ? $allowed : 'Unauthorized query.';
      throw new Exception( $message );
    }

    // Allow to modify the query before it is sent. It should not be a Meow_MWAI_Query_Embed.
    if ( !( $query instanceof Meow_MWAI_Query_Embed ) ) {
      $query = apply_filters( 'mwai_ai_query', $query );
    }

    // Important as it makes sure everything is consolidated in the query.
    $query->final_checks();

    // Run the query
    $reply = null;
    if ( $query instanceof Meow_MWAI_Query_Text ) {
      $reply = $this->run_completion_query( $query, $streamCallback );
    }
    else if ( $query instanceof Meow_MWAI_Query_Assistant ) {
      $reply = null;
      $reply = apply_filters( 'mwai_ai_query_assistant', $reply, $query );
      if ( $reply === null ) {
        throw new Exception( 'Assistants are not supported in this version of AI Engine.' );
      }
    }
    else if ( $query instanceof Meow_MWAI_Query_Embed ) {
      $reply = $this->run_embedding_query( $query );
    }
    else if ( $query instanceof Meow_MWAI_Query_Image ) {
      $reply = $this->run_images_query( $query );
    }
    else if ( $query instanceof Meow_MWAI_Query_Transcribe ) {
      $reply = $this->run_transcribe_query( $query );
    }
    else {
      throw new Exception( 'Unknown query type.' );
    }

    // Allow to modify the reply before it is sent.
    $reply = apply_filters( 'mwai_ai_reply', $reply, $query );

    return $reply;
  }

  public function run_completion_query( Meow_MWAI_Query_Base $query, $streamCallback = null ) {
    throw new Exception( 'Not implemented.' );
  }

  public function run_embedding_query( Meow_MWAI_Query_Base $query ) {
    throw new Exception( 'Not implemented.' );
  }

  public function run_images_query( Meow_MWAI_Query_Base $query ) {
    throw new Exception( 'Not implemented.' );
  }

  public function run_transcribe_query( Meow_MWAI_Query_Base $query ) {
    throw new Exception( 'Not implemented.' );
  }

  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply ) {
    throw new Exception( 'Not implemented.' );
  }
}
