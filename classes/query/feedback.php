<?php

class Meow_MWAI_Query_Feedback extends Meow_MWAI_Query_Text implements JsonSerializable {
  public $lastReply = null;
  public $originalQuery = null;
  public array $blocks;

  #region Constructors, Serialization

  /**
  * Creates a feedback query that carries function execution results back to the AI model.
  *
  * @param Meow_MWAI_Reply $reply The AI's response containing function call requests
  * @param Meow_MWAI_Query_Text $query The original query that triggered the function calls
  */
  public function __construct( Meow_MWAI_Reply $reply, Meow_MWAI_Query_Text $query ) {
    parent::__construct( $query->message );

    // Store references to the reply and original query for context
    $this->lastReply = $reply;
    $this->originalQuery = $query;

    // Inherit all settings from the original query to maintain consistency
    if ( !empty( $query->model ) ) {
      $this->set_model( $query->model );
    }
    if ( !empty( $query->maxTokens ) ) {
      $this->set_max_tokens( $query->maxTokens );
    }
    // Null means "not set"; 0 is a valid temperature and must survive the feedback loop.
    if ( isset( $query->temperature ) ) {
      $this->set_temperature( $query->temperature );
    }
    if ( !empty( $query->scope ) ) {
      $this->set_scope( $query->scope );
    }
    if ( !empty( $query->session ) ) {
      $this->set_session( $query->session );
    }
    if ( !empty( $query->botId ) ) {
      $this->set_bot_id( $query->botId );
    }
    if ( !empty( $query->customId ) ) {
      $this->set_custom_id( $query->customId );
    }
    if ( !empty( $query->envId ) ) {
      $this->set_env_id( $query->envId );
    }
    if ( !empty( $query->functions ) ) {
      $this->set_functions( $query->functions );
    }
    if ( !empty( $query->instructions ) ) {
      $this->set_instructions( $query->instructions );
    }
    // Built-in tools, MCP servers and reasoning too: Claude signs its thinking against the
    // whole request, so a follow-up without them failed with "Invalid signature in thinking
    // block", and every provider lost web search or MCP after the first function call.
    if ( !empty( $query->tools ) ) {
      $this->set_tools( $query->tools );
    }
    if ( !empty( $query->mcpServers ) ) {
      $this->set_mcp_servers( $query->mcpServers );
    }
    if ( !empty( $query->reasoning ) ) {
      $this->set_reasoning( $query->reasoning );
    }
    if ( !empty( $query->verbosity ) ) {
      $this->set_verbosity( $query->verbosity );
    }
    // The Knowledge context too: without it every engine that rebuilds the request from the
    // messages (Chat Completions and compatibles, Google) answered after a function call
    // without the context, and the model made up what it could not find.
    if ( !empty( $query->context ) ) {
      $this->set_context( $query->context );
    }

    // Build the complete conversation history including the assistant's function call
    if ( !empty( $query->messages ) ) {
      $messages = $query->messages;

      // Add the assistant's response with tool_calls to maintain conversation flow
      if ( !empty( $reply->choices ) ) {
        $assistantMessage = $reply->choices[0]['message'] ?? null;
        if ( $assistantMessage ) {
          $messages[] = $assistantMessage;
        }
      }

      $this->set_messages( $messages );
    }

    // For Responses API: Use the response ID from the reply to maintain stateful conversation
    // This is critical for the Responses API to link function results with their calls
    if ( !empty( $reply->id ) ) {
      $this->previousResponseId = $reply->id;
    }
    elseif ( !empty( $query->previousResponseId ) ) {
      // Fallback to query's previousResponseId if reply doesn't have one
      $this->previousResponseId = $query->previousResponseId;
    }
  }

  public function clear_feedback_blocks() {
    $this->blocks = [];
  }

  public function add_feedback_block( $block ) {
    $this->blocks[] = $block;
  }

  #[\ReturnTypeWillChange]
  public function jsonSerialize(): array {
    $json = [
      'message' => $this->message,
      'blocks' => $this->blocks,

      'ai' => [
        'model' => $this->model,
        'feature' => $this->feature,
      ],

      'system' => [
        'class' => get_class( $this ),
        'envId' => $this->envId,
        'scope' => $this->scope,
        'session' => $this->session,
        'customId' => $this->customId,
      ]
    ];

    return $json;
  }

  #endregion
}
