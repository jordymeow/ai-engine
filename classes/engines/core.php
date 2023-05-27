<?php

class Meow_MWAI_Engines_Core {
  private $core = null;
  private $openai = null;

  public function __construct( $core ) {
    $this->core = $core;
    $this->openai = new Meow_MWAI_Engines_OpenAI( $this->core );
  }

  public function run( $query, $streamCallback = null ) {

    // Check if the query is allowed.
    $limits = $this->core->get_option( 'limits' );
    $allowed = apply_filters( 'mwai_ai_allowed', true, $query, $limits );
    if ( $allowed !== true ) {
      $message = is_string( $allowed ) ? $allowed : 'Unauthorized query.';
      throw new Exception( $message );
    }

    // Allow to modify the query before it is sent.
    $query = apply_filters( 'mwai_ai_query', $query );

    // Important as it makes sure everything is consolidated in the query.
    $query->finalChecks();

    // Run the query
    // Only OpenAI is handled for now, so we send all the queries there.
    $reply = null;
    if ( $query instanceof Meow_MWAI_Query_Text ) {
      $reply = $this->openai->runCompletionQuery( $query, $streamCallback );
    }
    else if ( $query instanceof Meow_MWAI_Query_Embed ) {
      $reply = $this->openai->runEmbeddingQuery( $query );
    }
    else if ( $query instanceof Meow_MWAI_Query_Image ) {
      $reply = $this->openai->runImagesQuery( $query );
    }
    else if ( $query instanceof Meow_MWAI_Query_Transcribe ) {
      $reply = $this->openai->runTranscribeQuery( $query );
    }
    else {
      throw new Exception( 'Unknown query type.' );
    }

    // Allow to modify the reply before it is sent.
    $reply = apply_filters( 'mwai_ai_reply', $reply, $query );

    return $reply;
  }
}
