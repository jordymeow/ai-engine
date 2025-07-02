<?php

/**
* Specialized exception for function calling errors.
*
* Provides detailed context about what went wrong during
* function calling operations.
*/
class Meow_MWAI_FunctionCallException extends Exception {
  private array $context = [];

  /**
  * Error codes for different scenarios
  */
  public const ERROR_NO_TOOL_CALL_FOUND = 'no_tool_call_found';
  public const ERROR_INVALID_RESPONSE_ID = 'invalid_response_id';
  public const ERROR_FUNCTION_EXECUTION_FAILED = 'function_execution_failed';
  public const ERROR_MISSING_FUNCTION_HANDLER = 'missing_function_handler';
  public const ERROR_INVALID_ARGUMENTS = 'invalid_arguments';
  public const ERROR_LOOP_DETECTED = 'loop_detected';

  public function __construct(
    string $message,
    string $errorCode,
    array $context = [],
    ?Throwable $previous = null
  ) {
    $this->context = $context;
    $detailedMessage = $this->build_detailed_message( $message, $errorCode, $context );
    parent::__construct( $detailedMessage, 0, $previous );
  }

  /**
  * Build a detailed error message with context
  */
  private function build_detailed_message( string $message, string $errorCode, array $context ): string {
    $details = [$message];

    switch ( $errorCode ) {
      case self::ERROR_NO_TOOL_CALL_FOUND:
        $callId = $context['call_id'] ?? 'unknown';
        $details[] = sprintf(
          'Function call mismatch: Expected call_id "%s" not found in conversation.',
          $callId
        );
        $details[] = 'Ensure previous_response_id is set and function_call is echoed before function_call_output.';
        if ( !empty( $context['available_calls'] ) ) {
          $details[] = 'Available call IDs: ' . implode( ', ', $context['available_calls'] );
        }
        break;

      case self::ERROR_INVALID_RESPONSE_ID:
        $responseId = $context['response_id'] ?? 'unknown';
        $expectedFormat = $context['expected_format'] ?? 'unknown';
        $details[] = sprintf(
          'Invalid response ID format: "%s" does not match expected format "%s".',
          $responseId,
          $expectedFormat
        );
        if ( !empty( $context['api_type'] ) ) {
          $details[] = sprintf(
            'The %s requires response IDs starting with "%s".',
            $context['api_type'],
            $context['expected_prefix'] ?? ''
          );
        }
        break;

      case self::ERROR_FUNCTION_EXECUTION_FAILED:
        $functionName = $context['function_name'] ?? 'unknown';
        $details[] = sprintf( 'Function "%s" execution failed.', $functionName );
        if ( !empty( $context['error_details'] ) ) {
          $details[] = 'Error details: ' . $context['error_details'];
        }
        break;

      case self::ERROR_MISSING_FUNCTION_HANDLER:
        $functionName = $context['function_name'] ?? 'unknown';
        $details[] = sprintf(
          'No handler registered for function "%s".',
          $functionName
        );
        $details[] = 'Ensure the function is registered using add_filter("mwai_functions_list", ...).';
        break;

      case self::ERROR_INVALID_ARGUMENTS:
        $functionName = $context['function_name'] ?? 'unknown';
        $details[] = sprintf(
          'Invalid arguments provided for function "%s".',
          $functionName
        );
        if ( !empty( $context['validation_errors'] ) ) {
          $details[] = 'Validation errors: ' . implode( ', ', $context['validation_errors'] );
        }
        break;

      case self::ERROR_LOOP_DETECTED:
        $maxDepth = $context['max_depth'] ?? 5;
        $details[] = sprintf(
          'Function call loop detected after %d iterations.',
          $maxDepth
        );
        $details[] = 'The AI model is repeatedly calling functions without reaching a conclusion.';
        if ( !empty( $context['call_stack'] ) ) {
          $details[] = 'Call stack: ' . implode( ' → ', $context['call_stack'] );
        }
        break;
    }

    // Add debug information if available
    if ( !empty( $context['debug_info'] ) ) {
      $details[] = 'Debug info: ' . json_encode( $context['debug_info'] );
    }

    return implode( ' ', $details );
  }

  /**
  * Get the error context
  */
  public function get_context(): array {
    return $this->context;
  }

  /**
  * Create specific error instances
  */
  public static function no_tool_call_found( string $callId, array $availableCalls = [] ): self {
    return new self(
      'No tool call found for function call output.',
      self::ERROR_NO_TOOL_CALL_FOUND,
      [
        'call_id' => $callId,
        'available_calls' => $availableCalls
      ]
    );
  }

  public static function invalid_response_id( string $responseId, string $apiType, string $expectedPrefix ): self {
    return new self(
      'Invalid response ID format.',
      self::ERROR_INVALID_RESPONSE_ID,
      [
        'response_id' => $responseId,
        'api_type' => $apiType,
        'expected_format' => $expectedPrefix . '...',
        'expected_prefix' => $expectedPrefix
      ]
    );
  }

  public static function function_execution_failed( string $functionName, string $errorDetails ): self {
    return new self(
      'Function execution failed.',
      self::ERROR_FUNCTION_EXECUTION_FAILED,
      [
        'function_name' => $functionName,
        'error_details' => $errorDetails
      ]
    );
  }

  public static function missing_function_handler( string $functionName ): self {
    return new self(
      'Missing function handler.',
      self::ERROR_MISSING_FUNCTION_HANDLER,
      [
        'function_name' => $functionName
      ]
    );
  }

  public static function loop_detected( int $maxDepth, array $callStack = [] ): self {
    return new self(
      'Function call loop detected.',
      self::ERROR_LOOP_DETECTED,
      [
        'max_depth' => $maxDepth,
        'call_stack' => $callStack
      ]
    );
  }
}
