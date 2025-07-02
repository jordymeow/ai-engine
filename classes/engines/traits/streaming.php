<?php

trait Meow_MWAI_Engines_Trait_Streaming {
  protected $streamCallback = null;
  protected $streamBuffer = '';
  protected $streamContent = '';

  /**
  * Initialize streaming for a request
  */
  protected function init_streaming( $callback = null ) {
    $this->streamCallback = $callback;
    $this->streamBuffer = '';
    $this->streamContent = '';
  }

  /**
  * Handle streaming data chunk
  */
  protected function handle_stream_chunk( $data ) {
    $this->streamBuffer .= $data;

    // Process complete lines
    while ( ( $pos = strpos( $this->streamBuffer, "\n" ) ) !== false ) {
      $line = substr( $this->streamBuffer, 0, $pos );
      $this->streamBuffer = substr( $this->streamBuffer, $pos + 1 );

      if ( !empty( $line ) ) {
        $this->process_stream_line( $line );
      }
    }
  }

  /**
  * Process a single stream line
  */
  protected function process_stream_line( $line ) {
    // Remove "data: " prefix if present
    if ( strpos( $line, 'data: ' ) === 0 ) {
      $line = substr( $line, 6 );
    }

    // Handle special cases
    if ( $line === '[DONE]' ) {
      $this->finalize_stream();
      return;
    }

    // Parse JSON data
    $data = json_decode( trim( $line ), true );
    if ( $data ) {
      $this->handle_stream_data( $data );
    }
  }

  /**
  * Handle parsed stream data
  */
  protected function handle_stream_data( $data ) {
    // Extract content from different response formats
    $content = null;

    // OpenAI Chat Completion format
    if ( isset( $data['choices'][0]['delta']['content'] ) ) {
      $content = $data['choices'][0]['delta']['content'];
    }
    // Anthropic format
    elseif ( isset( $data['delta']['text'] ) ) {
      $content = $data['delta']['text'];
    }
    // Google format
    elseif ( isset( $data['candidates'][0]['content']['parts'][0]['text'] ) ) {
      $content = $data['candidates'][0]['content']['parts'][0]['text'];
    }

    if ( $content !== null ) {
      $this->streamContent .= $content;

      // Call the stream callback if set
      if ( $this->streamCallback ) {
        call_user_func( $this->streamCallback, $content );
      }
    }
  }

  /**
  * Finalize the stream
  */
  protected function finalize_stream() {
    // Process any remaining buffer
    if ( !empty( $this->streamBuffer ) ) {
      $this->process_stream_line( $this->streamBuffer );
    }

    // Return the complete content
    return $this->streamContent;
  }

  /**
  * Build streaming headers
  */
  protected function build_stream_headers( $headers = [] ) {
    $headers['Accept'] = 'text/event-stream';
    $headers['Cache-Control'] = 'no-cache';
    return $headers;
  }
}
