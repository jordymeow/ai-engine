<?php

class Meow_MWAI_Query_Base implements JsonSerializable {

  // Environment
  public ?string $session = null;
  public string $scope = '';

  // Core Content
  public ?string $instructions = null;
  public array $messages = [];
  public ?string $context = null;
  public string $message = '';

  // Parameters
  public int $maxMessages = 15;
  public int $maxResults = 1;
  public string $model = '';
  public string $mode = '';

  // Functions
  public array $functions = [];
  public ?string $functionCall = null;

  // Overrides for env
  public array $envSettings = [];
  public string $envId = '';
  public ?string $apiKey = null;

  // Seem to be only used by the Assistants, to get the current thread/discussion.
  // Maybe we should try to move this to the assistant class, or use it as ExtraParams.
  public ?string $botId = null;  

  // Extra Parameters (used by specific services, or for statistics, etc)
  public array $extraParams = [];

  #region Constructors, Serialization

  public function __construct( $message = '' ) {
    global $mwai_core;
    if ( is_string( $message ) ) {
      $this->set_message( $message );
    }
    $this->session = $mwai_core->get_session_id();
  }

  #[\ReturnTypeWillChange]
  public function jsonSerialize() {
    $json = [
      'message' => $this->message,

      'ai' => [
        'model' => $this->model,
      ],

      'system' => [
        'class' => get_class( $this ),
        'envId' => $this->envId,
        'mode' => $this->mode,
        'scope' => $this->scope,
        'session' => $this->session,
        'maxMessages' => $this->maxMessages,
      ]
    ];

    if ( !empty( $this->context ) ) {
      $json['context']['context'] = $this->context;
    }

    return $json;
  }

  #endregion

  #region Functions

  public function add_function( Meow_MWAI_Query_Function $function ): void {
    $this->functions[] = $function;
    $this->functionCall = "auto";
  }

  public function set_functions( array $functions ): void {
    $this->functions = $functions;
    $this->functionCall = "auto";
  }

  #endregion

  #region Helpers

  public function replace( $search, $replace ) {
    $this->message = str_replace( $search, $replace, $this->message );
  }

  #endregion

  public function get_message(): string {
    return $this->message;
  }

  public function get_in_tokens(): int {
    $in_tokens = Meow_MWAI_Core::estimate_tokens( $this->messages, $this->message );
    return $in_tokens;
  }

  /**
   * The environment, like "chatbot", "imagesbot", "chatbot-007", "textwriter", etc...
   * Used for statistics, mainly.
   * @param string $env The environment.
   */
  public function set_scope( string $scope ): void {
    $this->scope = $scope;
  }

  // TODO: Remove this after March 2024.
  public function set_env( string $env ): void {
    // TODO: At some point in February 2024, we should try to remove the env completely,
    // transfer the forms and chatbots to use the new scope.
    //error_log( 'AI Engine: set_env() is deprecated. Please use set_scope() instead.' );
    $this->scope = $env;
  }

  /**
   * The environment ID for AI services.
   * Used for statistics, mainly.
   * @param string $envId The environment ID.
   */
  public function set_env_id( string $envId ): void {
    $this->envId = $envId;
  }
  
  /**
   * ID of the model to use.
   * @param string $model ID of the model to use.
   */
  public function set_model( string $model ) {
    $this->model = $model;
    $this->mode = 'chat';
  }

  public function get_model() {
    return $this->model;
  }

  /**
   * The instructions are used to define the personality of the AI, and to give it some context.
   * @param string $instructions The instructions.
   */
  public function set_instructions( string $instructions ): void {
    // TODO: Is now called instructions. After March 2024, let's remove this, and keep only the last line.
    $this->instructions = apply_filters( 'mwai_ai_context', $instructions, $this );
    if ( $this->instructions !== $instructions ) {
      error_log( 'AI Engine: mwai_ai_context filter is deprecated. Please use mwai_ai_instructions instead.' );
    }
    $this->instructions = apply_filters( 'mwai_ai_instructions', $this->instructions, $this );
  }

  /**
   * Given a message, the model will return one or more predicted completions.
   * It can also return the probabilities of alternative tokens at each position.
   * @param string $message The message to generate completions.
   */
  public function set_message( string $message ) {
    $this->message = $message;
  }

  /**
   * Similar to the prompt, but use an array of messages instead.
   * @param string $messages The messages to generate completions.
   */
  public function set_messages( array $messages ) {
    $messages = array_map( function( $message ) {
      if ( is_array( $message ) ) {
        return [ 'role' => $message['role'], 'content' => $message['content'] ];
      }
      else if ( is_object( $message ) ) {
        return [ 'role' => $message->role, 'content' => $message->content ];
      }
      else {
        throw new InvalidArgumentException( 'Unsupported message type.' );
      }
    }, $messages );
    $this->messages = $messages;
  }

  /** 
   * The context can be used to add additional information that is likely to be relevant to the model.
   * @param string $context The context.
   */
  public function set_context( string $context ): void {
    $this->context = $context;
  }

  /**
   * The API key to use.
   * @param string $apiKey The API key.
   */
  public function set_api_key( string $apiKey ) {
    $this->apiKey = $apiKey;
  }

  /**
   * The session ID to use.
   * @param string $session The session ID.
   */
  public function set_session( string $session ) {
    $this->session = $session;
  }

  /**
   * The bot ID to use.
   * @param string $botId The bot ID.
   */
  public function set_bot_id( string $botId ) {
    $this->botId = $botId;
  }

  /**
   * How many completions to generate for each prompt.
   * Because this parameter generates many completions, it can quickly consume your token quota.
   * Use carefully and ensure that you have reasonable settings for max_tokens and stop.
   * @param float $maxResults Number of completions.
   */
  public function set_max_results( int $maxResults ) {
    $this->maxResults = $maxResults;
  }

  /**
   * This is run at the end of the process, to do some final checks.
   */
  public function final_checks() {
    if ( !empty( $this->maxMessages ) ) {
      $context = array_shift( $this->messages );
      if ( !empty( $this->messages ) ) {
        $this->messages = array_slice( $this->messages, -$this->maxMessages );
      }
      else {
        $this->messages = [];
      }
      if ( !empty( $context ) ) {
        array_unshift( $this->messages, $context );
      }
    }
  }

  public function set_max_sentences( int $maxMessages ): void {
    if ( !empty( $maxMessages ) ) {
      $this->maxMessages = intval( $maxMessages );
    }
  }

  protected function convert_keys( $params )
  {
    $newParams = [];
    foreach ( $params as $key => $value ) {
      $newKey = '';
      $capitalizeNextChar = false;
      for ( $i = 0; $i < strlen( $key ); $i++ ) {
        if ( $key[$i] == '_' ) {
          $capitalizeNextChar = true;
        }
        else {
          $newKey .= $capitalizeNextChar ? strtoupper($key[$i]) : $key[$i];
          $capitalizeNextChar = false;
        }
      }
      $newParams[$newKey] = $value;
    }
    return $newParams;
  }

  public function toJson() {
    return json_encode( $this );
  }

  #region Extra Params
  public function setExtraParam( string $key, $value ): void {
    $this->extraParams[$key] = $value;
  }

  public function getExtraParam( string $key ) {
    // Only if it exists
    if ( !isset( $this->extraParams[$key] ) ) {
      return null;
    }
    $value = $this->extraParams[$key];
    return $value;
  }
  #endregion Extra Params

  // Based on the params of the query, update the attributes
  public function inject_params( array $params ): void
  {
    // Those are for the keys passed directly by the shortcode.
    $params = $this->convert_keys( $params );

    if ( !empty( $params['model'] ) ) {
			$this->set_model( $params['model'] );
		}
    if ( !empty( $params['context'] ) ) {
      $this->set_instructions( $params['context'] );
    }
    if ( !empty( $params['prompt'] ) ) {
      //TODO: At some point, we need to rename prompt into message everywhere in the clients.
      //error_log( 'AI Engine: prompt is deprecated. Please use message instead.' );
      $this->set_message( $params['prompt'] );
    }
    if ( !empty( $params['message'] ) ) {
      $this->set_message( $params['message'] );
    }
    if ( !empty( $params['messages'] ) ) {
      $this->set_messages( $params['messages'] );
    }
    if ( !empty( $params['maxMessages'] ) && intval( $params['maxMessages'] ) > 0 ) {
      $this->set_max_sentences( intval( $params['maxMessages'] ) );
    }
    if ( !empty( $params['maxMessages'] ) && intval( $params['maxMessages'] ) > 0 ) {
      $this->set_max_sentences( intval( $params['maxMessages'] ) );
    }
    if ( !empty( $params['maxResults'] ) ) {
			$this->set_max_results( $params['maxResults'] );
		}
		if ( !empty( $params['env'] ) ) {
			$this->set_env( $params['env'] );
		}
    if ( !empty( $params['scope'] ) ) {
      $this->set_scope( $params['scope'] );
    }
		if ( !empty( $params['session'] ) ) {
			$this->set_session( $params['session'] );
		}
    if ( !empty( $params['apiKey'] ) ) {
			$this->set_api_key( $params['apiKey'] );
		}
    if ( !empty( $params['botId'] ) ) {
      $this->set_bot_id( $params['botId'] );
    }
    if ( !empty( $params['envId'] ) ) {
      $this->set_env_id( $params['envId'] );
    }
  }
}