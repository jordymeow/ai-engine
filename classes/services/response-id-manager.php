<?php

/**
* Centralized manager for AI response IDs.
*
* Handles storage, retrieval, and validation of response IDs
* used for stateful conversations with various AI APIs.
*/
class Meow_MWAI_Services_ResponseIdManager {
  private Meow_MWAI_Core $core;
  private array $cache = [];

  // Response ID patterns for different providers
  public const OPENAI_RESPONSES_PATTERN = '/^resp_/';
  public const OPENAI_CHAT_PATTERN = '/^chatcmpl-/';
  public const ANTHROPIC_PATTERN = '/^msg_/';

  // Expiry time (30 days as per OpenAI's policy)
  public const EXPIRY_DAYS = 30;

  public function __construct( Meow_MWAI_Core $core ) {
    $this->core = $core;
  }

  /**
  * Store a response ID with metadata
  */
  public function store( string $discussionId, string $responseId, array $metadata = [] ): void {
    $data = [
      'responseId' => $responseId,
      'responseDate' => gmdate( 'Y-m-d H:i:s' ),
      'provider' => $this->detect_provider( $responseId ),
      'apiType' => $this->detect_api_type( $responseId )
    ];

    // Merge additional metadata
    $data = array_merge( $data, $metadata );

    // Cache for current request
    $this->cache[$discussionId] = $data;

    // Let the discussion system handle persistence
    // This is called by the chatbot module when storing discussions
  }

  /**
  * Retrieve a response ID if valid
  */
  public function retrieve( string $discussionId, array $extra = [] ): ?string {
    // Check cache first
    if ( isset( $this->cache[$discussionId] ) ) {
      $data = $this->cache[$discussionId];
      return $this->is_valid_data( $data ) ? $data['responseId'] : null;
    }

    // Check provided extra data (from discussion storage)
    if ( !empty( $extra['responseId'] ) ) {
      $responseDate = $extra['responseDate'] ?? null;

      if ( $this->is_valid_date( $responseDate ) ) {
        // Cache for future use in this request
        $this->cache[$discussionId] = $extra;
        return $extra['responseId'];
      }
    }

    return null;
  }

  /**
  * Validate a response ID for a specific API type
  */
  public function validate( string $responseId, string $apiType ): bool {
    switch ( $apiType ) {
      case 'openai_responses':
        return $this->is_responses_api_id( $responseId );

      case 'openai_chat':
        return $this->is_chat_completions_id( $responseId );

      case 'anthropic':
        return $this->is_anthropic_id( $responseId );

      default:
        return true; // Allow unknown types
    }
  }

  /**
  * Check if ID is from OpenAI Responses API
  */
  public function is_responses_api_id( string $responseId ): bool {
    return preg_match( self::OPENAI_RESPONSES_PATTERN, $responseId ) === 1;
  }

  /**
  * Check if ID is from OpenAI Chat Completions API
  */
  public function is_chat_completions_id( string $responseId ): bool {
    return preg_match( self::OPENAI_CHAT_PATTERN, $responseId ) === 1;
  }

  /**
  * Check if ID is from Anthropic
  */
  public function is_anthropic_id( string $responseId ): bool {
    return preg_match( self::ANTHROPIC_PATTERN, $responseId ) === 1;
  }

  /**
  * Check if a response ID is valid for OpenAI Responses API
  * (Alias for is_responses_api_id for backward compatibility)
  */
  public function is_valid_for_responses_api( string $responseId ): bool {
    return $this->is_responses_api_id( $responseId );
  }

  /**
  * Detect provider from response ID format
  */
  private function detect_provider( string $responseId ): string {
    if ( $this->is_responses_api_id( $responseId ) ) {
      return 'openai';
    }
    if ( $this->is_chat_completions_id( $responseId ) ) {
      return 'openai';
    }
    if ( $this->is_anthropic_id( $responseId ) ) {
      return 'anthropic';
    }
    return 'unknown';
  }

  /**
  * Detect API type from response ID format
  */
  private function detect_api_type( string $responseId ): string {
    if ( $this->is_responses_api_id( $responseId ) ) {
      return 'responses_api';
    }
    if ( $this->is_chat_completions_id( $responseId ) ) {
      return 'chat_completions';
    }
    if ( $this->is_anthropic_id( $responseId ) ) {
      return 'messages_api';
    }
    return 'unknown';
  }

  /**
  * Check if stored data is still valid
  */
  private function is_valid_data( array $data ): bool {
    if ( empty( $data['responseId'] ) ) {
      return false;
    }

    $responseDate = $data['responseDate'] ?? null;
    return $this->is_valid_date( $responseDate );
  }

  /**
  * Check if a response date is within validity period
  */
  private function is_valid_date( ?string $responseDate ): bool {
    if ( empty( $responseDate ) ) {
      return false;
    }

    $date = strtotime( $responseDate );
    if ( $date === false ) {
      return false;
    }

    $expiryTime = time() - ( self::EXPIRY_DAYS * 24 * 60 * 60 );
    return $date > $expiryTime;
  }

  /**
  * Clean up expired response IDs (for maintenance)
  */
  public function cleanup_expired(): int {
    // This would be called by a scheduled task
    // Implementation depends on how discussions are stored
    // Return count of cleaned items
    return 0;
  }

  /**
  * Get debug information about a response ID
  */
  public function get_debug_info( string $responseId ): array {
    return [
      'id' => $responseId,
      'provider' => $this->detect_provider( $responseId ),
      'api_type' => $this->detect_api_type( $responseId ),
      'is_valid_responses_api' => $this->is_responses_api_id( $responseId ),
      'is_valid_chat_completions' => $this->is_chat_completions_id( $responseId ),
      'is_valid_anthropic' => $this->is_anthropic_id( $responseId )
    ];
  }
}
