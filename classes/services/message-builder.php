<?php

/**
* Service for building and transforming messages for different AI APIs.
*
* Simplifies the complex message building logic by breaking it down
* into smaller, focused methods.
*/
class Meow_MWAI_Services_MessageBuilder {
  private Meow_MWAI_Core $core;

  public function __construct( Meow_MWAI_Core $core ) {
    $this->core = $core;
  }

  /**
  * Build messages array for Responses API format
  */
  public function build_responses_api_messages( Meow_MWAI_Query_Base $query ): array {
    $messages = [];

    // Handle different query types
    if ( $query instanceof Meow_MWAI_Query_Feedback ) {
      $messages = $this->build_feedback_messages( $query );
    }
    else {
      $messages = $this->convert_messages_to_responses_format( $query->messages );
    }

    // Add user message with attachments if needed
    if ( !( $query instanceof Meow_MWAI_Query_Feedback ) ) {
      $messages = $this->add_user_message_with_attachments( $messages, $query );
    }

    return $messages;
  }

  /**
  * Build messages for feedback queries
  */
  private function build_feedback_messages( Meow_MWAI_Query_Feedback $query ): array {
    $messages = [];

    // Convert existing messages
    $messages = $this->convert_messages_to_responses_format( $query->messages );

    // Process feedback blocks
    if ( !empty( $query->blocks ) ) {
      $messages = $this->add_feedback_results( $messages, $query->blocks );
    }

    return $messages;
  }

  /**
  * Convert role-based messages to Responses API format
  */
  private function convert_messages_to_responses_format( array $messages ): array {
    $converted = [];

    foreach ( $messages as $message ) {
      if ( !isset( $message['role'] ) ) {
        // Already in Responses API format
        $converted[] = $message;
        continue;
      }

      // Handle assistant messages with tool calls
      if ( $message['role'] === 'assistant' && isset( $message['tool_calls'] ) ) {
        $converted = array_merge(
          $converted,
          $this->convert_assistant_with_tools( $message )
        );
      }
      else {
        // Regular messages stay as-is
        $converted[] = $message;
      }
    }

    return $converted;
  }

  /**
  * Convert assistant message with tool calls to separate messages
  */
  private function convert_assistant_with_tools( array $message ): array {
    $messages = [];

    // Add assistant text if present
    if ( !empty( $message['content'] ) ) {
      $messages[] = [
        'role' => 'assistant',
        'content' => $message['content']
      ];
    }

    // Convert each tool call to function_call message
    if ( isset( $message['tool_calls'] ) ) {
      foreach ( $message['tool_calls'] as $toolCall ) {
        $functionCall = Meow_MWAI_Data_FunctionCall::from_tool_call( $toolCall, $message );
        $messages[] = [
          'type' => 'function_call',
          'call_id' => $functionCall->id,
          'name' => $functionCall->name,
          'arguments' => $functionCall->get_arguments_json()
        ];
      }
    }

    return $messages;
  }

  /**
  * Add feedback results to messages
  */
  private function add_feedback_results( array $messages, array $blocks ): array {
    $functionResults = [];
    $processedCallIds = [];

    foreach ( $blocks as $block ) {
      if ( !isset( $block['feedbacks'] ) ) {
        continue;
      }

      foreach ( $block['feedbacks'] as $feedback ) {
        $toolId = $feedback['request']['toolId'] ?? null;

        // Skip duplicates
        if ( !$toolId || in_array( $toolId, $processedCallIds ) ) {
          continue;
        }

        // Create function result object
        $result = Meow_MWAI_Data_FunctionResult::success(
          $toolId,
          $feedback['reply']['value'] ?? null
        );

        $functionResults[] = $result->to_responses_api_format();
        $processedCallIds[] = $toolId;
      }
    }

    // Add function results at the end
    return array_merge( $messages, $functionResults );
  }

  /**
  * Add user message with attachments
  */
  private function add_user_message_with_attachments( array $messages, Meow_MWAI_Query_Base $query ): array {
    // Get all attachments using the unified method
    $attachments = method_exists( $query, 'getAttachments' ) ? $query->getAttachments() : [];

    if ( empty( $attachments ) ) {
      // Simple text message
      $messages[] = [
        'role' => 'user',
        'content' => [
          [
            'type' => 'input_text',
            'text' => $query->get_message()
          ]
        ]
      ];
    }
    else {
      // Message with file/image attachment(s)
      $content = [
        [
          'type' => 'input_text',
          'text' => $query->get_message()
        ]
      ];

      // Process all attachments
      foreach ( $attachments as $file ) {
        // Check file type to determine how to handle it
        // Images can be loaded via URL or base64, but PDFs use OpenAI file_id references
        $mimeType = $file->get_mimeType() ?? '';
        $isImage = strpos( $mimeType, 'image/' ) === 0;

        if ( $isImage ) {
          $fileUrl = $query->image_remote_upload === 'url'
            ? $file->get_url()
            : $file->get_inline_base64_url();

          $content[] = [
            'type' => 'input_image',
            'image_url' => $fileUrl
          ];
        }
        else {
          // For non-images (PDFs, documents), use file_id reference
          $fileId = $file->get_refId();

          if ( !$fileId ) {
            // File should have been uploaded by the engine before message building
            // If we get here, something went wrong - log and skip this file
            error_log( '[AI Engine] MessageBuilder: File without file_id encountered (upload should happen in engine)' );
            continue;
          }

          // File was uploaded to OpenAI, use file_id reference
          // Responses API format: { type: 'input_file', file_id: 'file-xxx' }
          $content[] = [
            'type' => 'input_file',
            'file_id' => $fileId
          ];
        }
      }

      $messages[] = [
        'role' => 'user',
        'content' => $content
      ];
    }

    return $messages;
  }

  /**
  * Build feedback-only messages for Responses API with previous_response_id
  */
  public function build_feedback_only_messages( Meow_MWAI_Query_Feedback $query ): array {
    $messages = [];

    if ( empty( $query->blocks ) ) {
      return $messages;
    }


    // For Responses API with previous_response_id, we should ONLY send function_call_output messages.
    // The API already knows about the function_call messages from the previous response.
    // According to OpenAI documentation, we should NOT echo back the function_call messages.
    
    foreach ( $query->blocks as $block ) {
      if ( !isset( $block['feedbacks'] ) || empty( $block['feedbacks'] ) ) {
        continue;
      }

      // Get the rawMessage from the first feedback (they should all have the same rawMessage)
      $rawMessage = $block['feedbacks'][0]['request']['rawMessage'] ?? null;
      
      if ( !$rawMessage || !isset( $rawMessage['tool_calls'] ) ) {
        continue;
      }

      // Process ALL tool calls from the rawMessage in order
      // But ONLY add the function_call_output messages (not the function_call messages)
      foreach ( $rawMessage['tool_calls'] as $toolCall ) {
        $callId = $toolCall['id'];
        
        // Find and add the corresponding function result
        // We do NOT add the function_call message when using previous_response_id
        $foundResult = false;
        foreach ( $block['feedbacks'] as $feedback ) {
          if ( ( $feedback['request']['toolId'] ?? null ) === $callId ) {
            $result = Meow_MWAI_Data_FunctionResult::success( $callId, $feedback['reply']['value'] ?? '' );
            $messages[] = $result->to_responses_api_format();
            $foundResult = true;
            break;
          }
        }

        if ( !$foundResult ) {
          // This should not happen, but if we can't find the result, add an error result
          $result = Meow_MWAI_Data_FunctionResult::failure( $callId, 'Function result not found' );
          $messages[] = $result->to_responses_api_format();
        }
      }
    }

    return $messages;
  }

  /**
  * Build messages for Chat Completions API
  */
  public function build_chat_completions_messages( Meow_MWAI_Query_Base $query ): array {
    $messages = [];

    // Add system message if present
    if ( !empty( $query->instructions ) ) {
      $messages[] = [
        'role' => 'system',
        'content' => $query->instructions
      ];
    }

    // Add conversation messages
    if ( !empty( $query->messages ) ) {
      $messages = array_merge( $messages, $query->messages );
    }

    // Handle feedback queries - add function results
    if ( $query instanceof Meow_MWAI_Query_Feedback && !empty( $query->blocks ) ) {
      foreach ( $query->blocks as $block ) {
        if ( !isset( $block['feedbacks'] ) ) {
          continue;
        }

        foreach ( $block['feedbacks'] as $feedback ) {
          $messages[] = [
            'role' => 'tool',
            'tool_call_id' => $feedback['request']['toolId'],
            'content' => json_encode( $feedback['reply']['value'] ?? '' )
          ];
        }
      }
    }

    // Add user message (if not a feedback query)
    if ( !( $query instanceof Meow_MWAI_Query_Feedback ) ) {
      $userMessage = $this->build_user_message( $query );
      if ( $userMessage ) {
        $messages[] = $userMessage;
      }
    }

    return $messages;
  }

  /**
  * Build user message for Chat Completions API
  */
  private function build_user_message( Meow_MWAI_Query_Base $query ): ?array {
    $message = $query->get_message();
    if ( empty( $message ) ) {
      return null;
    }

    // Get all attachments using the unified method
    $attachments = method_exists( $query, 'getAttachments' ) ? $query->getAttachments() : [];

    // Handle image attachments (for Chat Completions API)
    if ( !empty( $attachments ) ) {
      $content = [
        [
          'type' => 'text',
          'text' => $message
        ]
      ];

      // Add first image attachment (Chat Completions format)
      foreach ( $attachments as $file ) {
        if ( $file->get_type() === 'image' ) {
          $imageUrl = $query->image_remote_upload === 'url'
            ? $file->get_url()
            : $file->get_inline_base64_url();

          $content[] = [
            'type' => 'image_url',
            'image_url' => [
              'url' => $imageUrl
            ]
          ];
          break; // Chat Completions typically handles one image
        }
      }

      return [
        'role' => 'user',
        'content' => $content
      ];
    }

    // Simple text message
    return [
      'role' => 'user',
      'content' => $message
    ];
  }
}