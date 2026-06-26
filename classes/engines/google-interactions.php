<?php

/**
 * Google Gemini — Interactions API engine.
 *
 * As of June 2026 the Interactions API is GA and Google's recommended interface
 * (https://ai.google.dev/gemini-api/docs/interactions-overview). It is stateful
 * (server-side history via previous_interaction_id), exposes Google's built-in
 * tools (Google Search, Google Maps, URL context, code execution), and returns a
 * chronological list of execution "steps" (model_output / function_call /
 * function_result / thoughts).
 *
 * This is the DEFAULT engine for Google environments. The classic
 * generateContent engine (Meow_MWAI_Engines_Google) remains the fallback,
 * selected when "Use Standard API" (google_use_standard_api) is enabled in
 * Settings > AI > General. The request/response field names are mapped from
 * Google's docs and confirmed against the live API.
 */
class Meow_MWAI_Engines_GoogleInteractions extends Meow_MWAI_Engines_Core {
  protected $apiKey = null;
  protected $endpoint = null;

  // Streaming accumulators (collected from SSE events, used to build the Reply).
  protected $streamId = null;
  protected $streamInTokens = null;
  protected $streamOutTokens = null;
  protected $streamToolCalls = [];
  protected $streamImages = [];

  // The classic Google engine, used for everything the Interactions API does not
  // cover (embeddings, image generation, transcription) and for model fetching.
  protected $classicEngine = null;

  public function __construct( $core, $env ) {
    parent::__construct( $core, $env );
    $this->set_environment();
  }

  protected function set_environment() {
    $env = $this->env;
    $this->apiKey = $env['apikey'];
    $this->endpoint = apply_filters(
      'mwai_google_endpoint',
      'https://generativelanguage.googleapis.com/v1beta',
      $this->env
    );
  }

  protected function build_headers() {
    return [
      'Content-Type' => 'application/json',
      'x-goog-api-key' => $this->apiKey,
    ];
  }

  #region Request building

  /**
   * Build the "input" for the request.
   * - Feedback queries carry function results back as function_result items.
   * - When we have a previous interaction id, the server holds the history so we
   *   only send the new user turn.
   * - Otherwise we send the conversation as Content[].
   */
  protected function user_step( $query ) {
    $content = [];

    // Attached images / files (vision).
    $attachments = method_exists( $query, 'getAttachments' ) ? $query->getAttachments() : [];
    foreach ( $attachments as $file ) {
      $mime = $file->get_mimeType() ? $file->get_mimeType() : 'image/jpeg';
      // Image content parts are flat: { type, data (base64), mime_type }.
      $content[] = [
        'type' => 'image',
        'data' => $file->get_base64(),
        'mime_type' => $mime,
      ];
    }

    if ( $query->message !== '' || empty( $content ) ) {
      $content[] = [ 'type' => 'text', 'text' => $query->message ];
    }

    return [ 'type' => 'user_input', 'content' => $content ];
  }

  /**
   * The Interactions API is steps-based: input must be a step_list, not a
   * role-based turn_list. So we emit user_input / model_output / function_result
   * steps (the same step types the API returns).
   */
  protected function build_input( $query ) {
    // Feedback: carry the function results back as function_result steps.
    if ( $query instanceof Meow_MWAI_Query_Feedback && !empty( $query->blocks ) ) {
      $steps = [];
      foreach ( $query->blocks as $block ) {
        foreach ( ( $block['feedbacks'] ?? [] ) as $feedback ) {
          $value = $feedback['reply']['value'] ?? '';
          if ( !is_string( $value ) ) {
            $value = wp_json_encode( $value );
          }
          // The Interactions API expects `call_id` (matching the function_call
          // step's id) and `result` as an array of content blocks, not a string.
          $steps[] = [
            'type' => 'function_result',
            'call_id' => $feedback['request']['toolId'] ?? null,
            'name' => $feedback['request']['name'] ?? '',
            'result' => [ [ 'type' => 'text', 'text' => $value ] ],
          ];
        }
      }
      return $steps;
    }

    // The API is stateful: prior turns live server-side and are referenced via
    // previous_interaction_id. Input steps are only NEW user/function turns, so
    // we send a single user_input step. (Replaying past model_output as input is
    // rejected with "value at top-level must be a list".)
    return [ $this->user_step( $query ) ];
  }

  protected function build_tools( $query ) {
    $tools = [];

    // Custom WordPress / Code Engine functions -> function declarations.
    // Each tool is flat: { type:function, name, description, parameters }.
    if ( !empty( $query->functions ) ) {
      foreach ( $query->functions as $function ) {
        $decl = $function->serializeForOpenAI();
        // The Interactions API validates `parameters` as a JSON Schema and is
        // strict about it: a no-arg function's empty
        // { type:object, properties:{}, required:[] } is rejected with the
        // misleading "value at top-level must be a list". Send a bare object
        // schema when there are no parameters, and drop an empty `required`
        // list otherwise.
        if ( empty( $function->parameters ) ) {
          $decl['parameters'] = [ 'type' => 'object' ];
        }
        elseif ( empty( $decl['parameters']['required'] ) ) {
          unset( $decl['parameters']['required'] );
        }
        $tools[] = array_merge( [ 'type' => 'function' ], $decl );
      }
    }

    // Provider built-in tools. AI Engine uses the generic 'web_search' name
    // across providers; for Gemini it maps to Google Search grounding (the
    // classic generateContent engine maps it the same way). Google Maps
    // grounding is named-places only for now (no lat/long context), so "near me"
    // queries won't resolve but explicit places do.
    //
    // Google Search and Google Maps are mutually exclusive in one Interactions
    // request (the API rejects "cannot be combined in the same request"). When a
    // chatbot has both enabled, prefer Maps (the more specific opt-in tool).
    if ( in_array( 'google_maps', $query->tools, true ) ) {
      $tools[] = [ 'type' => 'google_maps' ];
    }
    elseif ( in_array( 'web_search', $query->tools, true ) ) {
      $tools[] = [ 'type' => 'google_search' ];
    }

    return $tools;
  }

  protected function build_interaction_body( $query, $streamCallback = null ) {
    $body = [
      'model' => $query->model,
      'input' => $this->build_input( $query ),
      'store' => true,
    ];

    if ( !is_null( $streamCallback ) ) {
      $body['stream'] = true;
    }

    if ( $this->has_previous_interaction( $query ) ) {
      $body['previous_interaction_id'] = $query->previousResponseId;
    }

    if ( !empty( $query->instructions ) ) {
      $body['system_instruction'] = $query->instructions;
    }

    $tools = $this->build_tools( $query );
    if ( !empty( $tools ) ) {
      $body['tools'] = $tools;
    }

    $generationConfig = [];
    if ( $query->temperature !== null ) {
      $generationConfig['temperature'] = $query->temperature;
    }
    if ( !empty( $query->maxTokens ) ) {
      $generationConfig['max_output_tokens'] = $query->maxTokens;
    }
    if ( !empty( $generationConfig ) ) {
      $body['generation_config'] = $generationConfig;
    }

    return apply_filters( 'mwai_google_interactions_body', $body, $query );
  }

  #endregion

  public function run_completion_query( $query, $streamCallback = null ): Meow_MWAI_Reply {
    $debug = $this->core->get_option( 'queries_debug_mode' );
    $isStreaming = !is_null( $streamCallback );
    $this->init_debug_mode( $query );

    // Reset per-request streaming state (Core buffers + our accumulators).
    $this->streamContent = '';
    $this->streamTemporaryBuffer = '';
    $this->streamBuffer = '';
    $this->reset_stream();

    if ( $isStreaming ) {
      // The Core stream_handler hooks the curl WRITEFUNCTION and dispatches each
      // SSE "data:" line to our stream_data_handler().
      $this->streamCallback = $streamCallback;
      add_action( 'http_api_curl', [ $this, 'stream_handler' ], 10, 3 );
    }

    $body = $this->build_interaction_body( $query, $streamCallback );
    $url = trailingslashit( $this->endpoint ) . 'interactions';

    if ( $debug ) {
      error_log( '[AI Engine Queries] --> (Gemini Interactions) ' . $url );
      error_log( wp_json_encode( $body, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES ) );
    }

    $args = [
      'headers' => $this->build_headers(),
      'body' => wp_json_encode( $body ),
      'timeout' => apply_filters( 'mwai_request_timeout', 120, $query ),
      'sslverify' => MWAI_SSL_VERIFY,
    ];
    $tmpFile = null;
    if ( $isStreaming ) {
      // WordPress streams the response into this file; on error it holds the body.
      $tmpFile = tempnam( sys_get_temp_dir(), 'mwai-gemini-stream-' );
      $args['stream'] = true;
      $args['filename'] = $tmpFile;
    }

    try {
      $res = wp_remote_post( $url, $args );

      if ( is_wp_error( $res ) ) {
        throw new Exception( 'AI Engine (Gemini Interactions): ' . $res->get_error_message() );
      }

      $code = wp_remote_retrieve_response_code( $res );

      if ( $isStreaming ) {
        if ( $code < 200 || $code >= 300 ) {
          // The error body went to the temp file rather than the response.
          $errBody = ( $tmpFile && file_exists( $tmpFile ) )
            ? file_get_contents( $tmpFile ) : wp_remote_retrieve_body( $res );
          $errData = json_decode( $errBody, true );
          $detail = $errData['error']['message'] ?? $errBody;
          throw new Exception( 'AI Engine (Gemini Interactions) HTTP ' . $code . ': ' . $detail );
        }
        return $this->build_streaming_reply( $query );
      }

      $rawBody = wp_remote_retrieve_body( $res );
      $data = json_decode( $rawBody, true );

      if ( $debug ) {
        error_log( '[AI Engine Queries] <-- (Gemini Interactions) HTTP ' . $code );
        error_log( substr( $rawBody, 0, 4000 ) );
      }

      if ( $code < 200 || $code >= 300 ) {
        $detail = $data['error']['message'] ?? $rawBody;
        throw new Exception( 'AI Engine (Gemini Interactions) HTTP ' . $code . ': ' . $detail );
      }

      return $this->build_reply_from_interaction( $query, $data, $streamCallback );
    }
    finally {
      if ( $isStreaming ) {
        remove_action( 'http_api_curl', [ $this, 'stream_handler' ] );
      }
      if ( $tmpFile && file_exists( $tmpFile ) ) {
        unlink( $tmpFile );
      }
    }
  }

  public function reset_stream() {
    $this->streamId = null;
    $this->streamInTokens = null;
    $this->streamOutTokens = null;
    $this->streamToolCalls = [];
    $this->streamImages = [];
  }

  /**
   * Handle one parsed SSE "data:" payload from the Interactions stream. Returns a
   * text string for text deltas (the Core accumulates it into streamContent and
   * forwards to the chatbot), a Meow_MWAI_Event for thoughts, or null for
   * bookkeeping events (function-call assembly, completion).
   *
   * The Core's stream_handler only forwards "data:" lines and drops the "event:"
   * line, so we dispatch on the event_type carried inside the JSON payload.
   */
  protected function stream_data_handler( $json ) {
    $type = $json['event_type'] ?? '';

    if ( $type === 'step.start' ) {
      $step = $json['step'] ?? [];
      // A function call arrives as a single step.start with the complete call
      // (id, name, arguments). Larger argument payloads may also stream as
      // arguments_delta events, which we accumulate below.
      if ( ( $step['type'] ?? '' ) === 'function_call' ) {
        $index = $json['index'] ?? count( $this->streamToolCalls );
        $args = $step['arguments'] ?? '';
        $argsJson = is_string( $args ) ? $args : wp_json_encode( $args );
        $this->streamToolCalls[$index] = [
          'id' => $step['id'] ?? null,
          'name' => $step['name'] ?? '',
          'arguments' => $argsJson,
        ];
        // Surface the call in the event-log (gated like the function_result
        // event Core emits, so nothing streams when Event Logs is off).
        if ( $this->currentDebugMode && $this->streamCallback ) {
          return Meow_MWAI_Event::function_calling( $step['name'] ?? '', $argsJson );
        }
      }
      return null;
    }

    if ( $type === 'step.delta' ) {
      $delta = $json['delta'] ?? [];
      $dtype = $delta['type'] ?? '';
      if ( $dtype === 'text' ) {
        return $delta['text'] ?? '';
      }
      if ( $dtype === 'arguments_delta' ) {
        $index = $json['index'] ?? array_key_last( $this->streamToolCalls );
        if ( $index !== null && isset( $this->streamToolCalls[$index] ) ) {
          $this->streamToolCalls[$index]['arguments'] .= $delta['arguments'] ?? '';
        }
        return null;
      }
      // Generated image (e.g. Gemini Flash Image): the delta carries mime_type +
      // base64 data and has no "type" field. The base64 may stream in chunks, so
      // accumulate per step index.
      if ( isset( $delta['mime_type'], $delta['data'] ) ) {
        $index = $json['index'] ?? count( $this->streamImages );
        $isFirst = !isset( $this->streamImages[$index] );
        if ( $isFirst ) {
          $this->streamImages[$index] = [ 'mime_type' => $delta['mime_type'], 'data' => '' ];
        }
        $this->streamImages[$index]['data'] .= $delta['data'];
        if ( $isFirst && $this->currentDebugMode && $this->streamCallback ) {
          $event = new Meow_MWAI_Event( 'live', MWAI_STREAM_TYPES['IMAGE_GEN'] );
          $event->set_content( 'Image generated' );
          return $event;
        }
        return null;
      }
      // Thought deltas carry an encrypted thought_signature, not readable text,
      // so there is nothing to surface to the user; they are intentionally skipped.
      return null;
    }

    if ( $type === 'interaction.completed' ) {
      $interaction = $json['interaction'] ?? [];
      if ( !empty( $interaction['id'] ) ) {
        $this->streamId = $interaction['id'];
      }
      $usage = $interaction['usage'] ?? [];
      if ( isset( $usage['total_input_tokens'] ) ) {
        $this->streamInTokens = (int) $usage['total_input_tokens'];
      }
      if ( isset( $usage['total_output_tokens'] ) ) {
        $this->streamOutTokens = (int) $usage['total_output_tokens'];
      }
      return null;
    }

    return null;
  }

  /**
   * Build the Reply from the streaming accumulators once the SSE stream is done.
   * Mirrors build_reply_from_interaction() but sources from the streamed state.
   */
  protected function build_streaming_reply( $query ) {
    $reply = new Meow_MWAI_Reply( $query );
    $choices = [];

    foreach ( $this->streamToolCalls as $tc ) {
      $args = $tc['arguments'];
      $decoded = ( $args === '' || $args === null ) ? [] : json_decode( $args, true );
      if ( json_last_error() !== JSON_ERROR_NONE ) {
        $decoded = [];
      }
      $choices[] = [
        'message' => [
          'content' => null,
          'tool_calls' => [ [
            'id' => $tc['id'],
            'type' => 'function',
            'function' => [ 'name' => $tc['name'], 'arguments' => $decoded ],
          ] ],
        ],
      ];
    }

    if ( $this->streamContent !== '' ) {
      $choices[] = [ 'role' => 'assistant', 'text' => $this->streamContent ];
    }

    // Generated images become b64_json choices; set_choices() saves each one and
    // appends the image markdown to the reply so the chatbot renders it.
    foreach ( $this->streamImages as $img ) {
      if ( !empty( $img['data'] ) ) {
        $choices[] = [ 'b64_json' => $img['data'] ];
      }
    }

    // Nothing to show (no text, image, or function call): surface a short
    // fallback instead of a blank bubble. This happens e.g. when a text-only
    // model is asked to edit an image, or the model declines a request.
    if ( empty( $choices ) ) {
      $choices[] = [ 'role' => 'assistant', 'text' => $this->empty_reply_fallback( $query ) ];
    }

    $reply->set_choices( $choices );

    if ( !empty( $this->streamId ) ) {
      $reply->set_id( $this->streamId );
    }

    if ( $this->streamInTokens !== null || $this->streamOutTokens !== null ) {
      $recorded = $this->core->record_tokens_usage(
        $query->model,
        (int) ( $this->streamInTokens ?? 0 ),
        (int) ( $this->streamOutTokens ?? 0 )
      );
      $reply->set_usage( $recorded );
    }

    return $reply;
  }

  /**
   * Message shown when the model returns nothing renderable (no text, image, or
   * function call), so the chatbot never displays a blank bubble. Filterable.
   */
  protected function empty_reply_fallback( $query ) {
    return apply_filters(
      'mwai_google_interactions_empty_reply',
      __( "Sorry, I couldn't produce a response for that. Please try rephrasing your request.", 'ai-engine' ),
      $query
    );
  }

  /**
   * Turn an Interaction resource (id, status, steps[], usage) into a Reply.
   * Emits step events (thoughts, function calls) to the stream callback so the
   * chatbot's event-log UI shows what the model did.
   */
  protected function build_reply_from_interaction( $query, $data, $streamCallback = null ) {
    $reply = new Meow_MWAI_Reply( $query );

    $choices = [];
    $text = '';
    foreach ( ( $data['steps'] ?? [] ) as $step ) {
      $type = $step['type'] ?? '';

      if ( $type === 'model_output' ) {
        foreach ( ( $step['content'] ?? [] ) as $part ) {
          if ( ( $part['type'] ?? '' ) === 'text' ) {
            $text .= $part['text'] ?? '';
          }
          // Generated image part (mime_type + base64 data) -> b64_json choice.
          elseif ( isset( $part['mime_type'], $part['data'] ) ) {
            $choices[] = [ 'b64_json' => $part['data'] ];
          }
        }
      }
      elseif ( $type === 'thought' ) {
        if ( !empty( $streamCallback ) ) {
          $thought = '';
          foreach ( ( $step['content'] ?? [] ) as $part ) {
            $thought .= $part['text'] ?? '';
          }
          if ( $thought !== '' ) {
            $event = new Meow_MWAI_Event( 'live', 'thinking' );
            $event->set_content( $thought );
            call_user_func( $streamCallback, $event );
          }
        }
      }
      elseif ( $type === 'function_call' ) {
        $name = $step['name'] ?? '';
        $args = $step['arguments'] ?? [];
        if ( !empty( $streamCallback ) ) {
          $event = Meow_MWAI_Event::function_calling( $name, is_string( $args ) ? $args : wp_json_encode( $args ) );
          call_user_func( $streamCallback, $event );
        }
        // Map to a tool_calls choice so set_choices() builds the needFeedback,
        // preserving the id (required for the function_result follow-up).
        $choices[] = [
          'message' => [
            'content' => null,
            'tool_calls' => [ [
              'id' => $step['id'] ?? null,
              'type' => 'function',
              'function' => [ 'name' => $name, 'arguments' => $args ],
            ] ],
          ],
          '_rawMessage' => $step,
        ];
      }
    }

    if ( $text !== '' ) {
      $choices[] = [ 'role' => 'assistant', 'text' => $text ];
    }

    // Surface a short fallback rather than a blank reply when there is nothing
    // to show (no text, image, or function call).
    if ( empty( $choices ) ) {
      $choices[] = [ 'role' => 'assistant', 'text' => $this->empty_reply_fallback( $query ) ];
    }

    $reply->set_choices( $choices );

    // Stateful handle for the next turn.
    if ( !empty( $data['id'] ) ) {
      $reply->set_id( $data['id'] );
    }

    // Usage.
    $usage = $data['usage'] ?? [];
    if ( isset( $usage['total_input_tokens'] ) || isset( $usage['total_output_tokens'] ) ) {
      $recorded = $this->core->record_tokens_usage(
        $query->model,
        (int) ( $usage['total_input_tokens'] ?? 0 ),
        (int) ( $usage['total_output_tokens'] ?? 0 )
      );
      $reply->set_usage( $recorded );
    }

    return $reply;
  }

  /**
   * Interaction ids look like "v1_Chd..." (the classic generateContent API is
   * stateless and has no id). Used to decide whether to reuse server-side state.
   */
  protected function has_previous_interaction( $query ) {
    return !empty( $query->previousResponseId )
      && is_string( $query->previousResponseId )
      && strpos( $query->previousResponseId, 'v1_' ) === 0;
  }

  /**
   * Dynamic model list is shared with the classic Google engine (same /models
   * endpoint and same API key). get_models() is also called during final_checks()
   * to validate the requested model, so it must be implemented.
   */
  public function get_models() {
    return $this->core->get_engine_models( 'google' );
  }

  /**
   * Called by the framework to price a reply. The classic engine already prices
   * every Google model and query type correctly (text, token-based Flash Image,
   * and per-image Imagen), so reuse it rather than keep a second partial copy.
   * Interaction usage carries prompt_tokens/completion_tokens/total_tokens, which
   * is exactly what the classic pricing expects.
   */
  public function get_price( Meow_MWAI_Query_Base $query, Meow_MWAI_Reply $reply ) {
    return $this->classic_engine()->get_price( $query, $reply );
  }

  /**
   * The Interactions API only covers chat completions. Everything else still
   * runs against the classic Google endpoints (same API key and env), so we lazily
   * build the classic engine and delegate those operations to it.
   */
  protected function classic_engine() {
    if ( $this->classicEngine === null ) {
      $this->classicEngine = Meow_MWAI_Engines_Google::create( $this->core, $this->env );
    }
    return $this->classicEngine;
  }

  /**
   * Fetching + tagging the model list (the "Refresh Models" action) is identical
   * to the classic Google engine: same /models endpoint, same API key, same tag
   * derivation (vision, functions, web_search...). Delegate to it rather than
   * duplicate that logic, so refreshed Gemini models carry the right tools.
   */
  public function retrieve_models() {
    return $this->classic_engine()->retrieve_models();
  }

  public function run_embedding_query( Meow_MWAI_Query_Base $query ) {
    return $this->classic_engine()->run_embedding_query( $query );
  }

  public function run_image_query( Meow_MWAI_Query_Base $query, $streamCallback = null ) {
    return $this->classic_engine()->run_image_query( $query, $streamCallback );
  }

  public function run_editimage_query( Meow_MWAI_Query_Base $query ) {
    return $this->classic_engine()->run_editimage_query( $query );
  }

  public function run_transcribe_query( Meow_MWAI_Query_Base $query ) {
    return $this->classic_engine()->run_transcribe_query( $query );
  }
}
