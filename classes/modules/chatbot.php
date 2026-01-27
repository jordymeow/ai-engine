<?php

// Params for the chatbot (front and server)
define( 'MWAI_CHATBOT_FRONT_PARAMS', [ 'id', 'customId', 'aiName', 'userName', 'guestName', 'aiAvatar', 'userAvatar', 'guestAvatar', 'aiAvatarUrl', 'userAvatarUrl', 'guestAvatarUrl', 'textSend', 'textClear', 'imageUpload', 'fileUpload', 'multiUpload', 'maxUploads', 'fileUploads', 'fileSearch', 'allowedMimeTypes', 'mode', 'textInputPlaceholder', 'textInputMaxLength', 'textCompliance', 'startSentence', 'localMemory', 'themeId', 'window', 'icon', 'iconText', 'iconTextDelay', 'iconAlt', 'iconPosition', 'centerOpen', 'width', 'openDelay', 'iconBubble', 'windowAnimation', 'fullscreen', 'copyButton', 'headerSubtitle', 'popupTitle', 'containerType', 'headerType', 'messagesType', 'inputType', 'footerType', 'talkMode' ] );

define( 'MWAI_CHATBOT_SERVER_PARAMS', [ 'id', 'envId', 'scope', 'mode', 'contentAware', 'context', 'startSentence', 'embeddingsEnvId', 'embeddingsIndex', 'embeddingsNamespace', 'assistantId', 'instructions', 'resolution', 'voice', 'talkMode', 'model', 'temperature', 'maxTokens', 'contextMaxLength', 'maxResults', 'apiKey', 'functions', 'mcpServers', 'tools', 'historyStrategy', 'previousResponseId', 'parentBotId', 'crossSite', 'promptId', 'promptVariables', 'reasoningEffort', 'verbosity' ] );

// Params for the discussions (front and server)
define( 'MWAI_DISCUSSIONS_FRONT_PARAMS', [ 'themeId', 'textNewChat' ] );
define( 'MWAI_DISCUSSIONS_SERVER_PARAMS', [ 'customId' ] );

class Meow_MWAI_Modules_Chatbot {
  private $core = null;
  private $namespace = 'mwai-ui/v1';
  private $siteWideChatId = null;

  public function __construct() {
    global $mwai_core;
    $this->core = $mwai_core;
    $this->siteWideChatId = $this->core->get_option( 'botId' );

    add_shortcode( 'mwai_chatbot', [ $this, 'chat_shortcode' ] );
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
    add_action( 'wp_enqueue_scripts', [ $this, 'register_scripts' ] );
    add_action( 'admin_enqueue_scripts', [ $this, 'register_scripts' ] );
    if ( $this->core->get_option( 'chatbot_discussions' ) ) {
      add_shortcode( 'mwai_discussions', [ $this, 'chatbot_discussions' ] );
    }
  }

  public function register_scripts() {
    // Load JS
    $physical_file = trailingslashit( MWAI_PATH ) . 'app/chatbot.js';
    $cache_buster = file_exists( $physical_file ) ? filemtime( $physical_file ) : MWAI_VERSION;
    wp_register_script( 'mwai_chatbot', trailingslashit( MWAI_URL )
        . 'app/chatbot.js', [ 'wp-element' ], $cache_buster, false );

    // Actual loading of the scripts
    $hasSiteWideChat = $this->siteWideChatId && $this->siteWideChatId !== 'none';

    // Don't load chatbot scripts on the Site Editor to avoid conflicts
    $current_screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
    $is_site_editor = $current_screen && $current_screen->base === 'site-editor';

    if ( ( is_admin() && !$is_site_editor ) || $hasSiteWideChat ) {
      $themeId = null;
      if ( $hasSiteWideChat ) {
        $bot = $this->core->get_chatbot( $this->siteWideChatId );
        if ( $bot && isset( $bot['themeId'] ) ) {
          $themeId = $bot['themeId'];
        }
      }
      $this->enqueue_scripts( is_admin() ? null : $themeId );
      if ( $hasSiteWideChat ) {
        // Chatbot Injection
        add_action( 'wp_footer', [ $this, 'inject_chat' ] );
      }
    }
  }

  public function enqueue_scripts( $themeId = null ) {
    wp_enqueue_script( 'mwai_chatbot' );
    if ( $this->core->get_option( 'syntax_highlight' ) ) {
      wp_enqueue_script( 'mwai_highlight' );
    }
    if ( $themeId ) {
      $this->core->enqueue_theme( $themeId );
    }
    else {
      $this->core->enqueue_themes();
    }
  }

  /**
   * Helper method to create REST responses with automatic token refresh
   *
   * @param array $data The response data
   * @param int $status HTTP status code
   * @return WP_REST_Response
   */
  protected function create_rest_response( $data, $status = 200 ) {
    // Always check if we need to provide a new nonce
    $current_nonce = $this->core->get_nonce( true );
    $request_nonce = isset( $_SERVER['HTTP_X_WP_NONCE'] ) ? $_SERVER['HTTP_X_WP_NONCE'] : null;

    // Check if nonce is approaching expiration (WordPress nonces last 12-24 hours)
    // We'll refresh if the nonce is older than 10 hours to be safe
    $should_refresh = false;

    if ( $request_nonce ) {
      // Try to determine the age of the nonce
      // WordPress uses a tick system where each tick is 12 hours
      // If we're in the second half of the nonce's life, refresh it
      $time = time();
      $nonce_tick = wp_nonce_tick();

      // Verify if the nonce is still valid but getting old
      $verify = wp_verify_nonce( $request_nonce, 'wp_rest' );
      if ( $verify === 2 ) {
        // Nonce is valid but was generated 12-24 hours ago
        $should_refresh = true;
        // Log will be written when token is included in response
      }
    }

    // If the nonce has changed or should be refreshed, include the new one
    if ( $should_refresh || ( $request_nonce && $current_nonce !== $request_nonce ) ) {
      $data['new_token'] = $current_nonce;

      // Log if server debug mode is enabled
      if ( $this->core->get_option( 'server_debug_mode' ) ) {
        error_log( '[AI Engine] Token refresh: Nonce refreshed (12-24 hours old)' );
      }
    }

    return new WP_REST_Response( $data, $status );
  }

  public function rest_api_init() {
    register_rest_route( $this->namespace, '/chats/submit', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_chat' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ]
    ] );
  }

  public function basics_security_check( $botId, $customId, $newMessage, $newFileId ) {
    if ( !$botId && !$customId ) {
      Meow_MWAI_Logging::warn( 'The query was rejected - no botId nor id was specified.' );
      return false;
    }

    if ( $newFileId ) {
      return true;
    }

    // Handle null or convert to string for strlen
    $messageStr = $newMessage === null ? '' : (string) $newMessage;
    $length = strlen( $messageStr );
    if ( $length < 1 ) {
      Meow_MWAI_Logging::warn( 'The query was rejected - message was too short.' );
      return false;
    }
    return true;
  }

  public function build_final_res( $botId, $newMessage, $newFileId, $params, $reply, $images, $actions, $usage, $responseId = null ) {
    $filterParams = [
      'step' => 'reply',
      'botId' => $botId,
      'reply' => $reply,
      'images' => $images,
      'newMessage' => $newMessage,
      'newFileId' => $newFileId,
      'params' => $params,
      'usage' => $usage,
      'messages' => $params['messages'] ?? [],
      'isNewConversation' => empty( $params['messages'] ) || count( $params['messages'] ) <= 1,
    ];
    $actions = apply_filters( 'mwai_chatbot_actions', $actions, $filterParams );
    $blocks = apply_filters( 'mwai_chatbot_blocks', [], $filterParams );
    $shortcuts = apply_filters( 'mwai_chatbot_shortcuts', [], $filterParams );
    $actions = $this->sanitize_actions( $actions );
    $blocks = $this->sanitize_blocks( $blocks );
    $shortcuts = $this->sanitize_shortcuts( $shortcuts );
    $shortcuts = $this->prepare_shortcuts_for_client( $shortcuts, $botId );
    $result = [
      'success' => true,
      'reply' => $reply,
      'images' => $images,
      'actions' => $actions,
      'shortcuts' => $shortcuts,
      'blocks' => $blocks,
      'usage' => $usage
    ];

    // Add response ID if available
    if ( !empty( $responseId ) ) {
      $result['responseId'] = $responseId;
    }

    // Check if token needs refresh
    $current_nonce = $this->core->get_nonce( true );
    $request_nonce = isset( $_SERVER['HTTP_X_WP_NONCE'] ) ? $_SERVER['HTTP_X_WP_NONCE'] : null;

    $should_refresh = false;
    if ( $request_nonce ) {
      $verify = wp_verify_nonce( $request_nonce, 'wp_rest' );
      if ( $verify === 2 ) {
        // Nonce is valid but was generated 12-24 hours ago
        $should_refresh = true;
      }
    }

    if ( $should_refresh || ( $request_nonce && $current_nonce !== $request_nonce ) ) {
      $result['new_token'] = $current_nonce;
    }

    return $result;
  }

  public function rest_chat( $request ) {
    $params = $request->get_json_params();
    $botId = $params['botId'] ?? null;
    $customId = $params['customId'] ?? null;
    $stream = $params['stream'] ?? false;
    $newMessage = trim( $params['newMessage'] ?? '' );
    $newFileId = $params['newFileId'] ?? null;
    $newFileIds = $params['newFileIds'] ?? [];
    $crossSite = $params['crossSite'] ?? false;
    $shortcutId = $params['shortcutId'] ?? null;

    // If shortcutId is provided, look up the actual message
    if ( $shortcutId && empty( $newMessage ) ) {
      $shortcutMessage = $this->get_shortcut_message( $shortcutId, $botId );
      if ( $shortcutMessage ) {
        $newMessage = $shortcutMessage;
      }
      else {
        return $this->create_rest_response( [
          'success' => false,
          'message' => 'Invalid or expired shortcut.'
        ], 400 );
      }
    }

    if ( !$this->basics_security_check( $botId, $customId, $newMessage, $newFileId ) ) {
      return $this->create_rest_response( [
        'success' => false,
        'message' => apply_filters( 'mwai_ai_exception', 'Sorry, your query has been rejected.' )
      ], 403 );
    }

    try {
      $data = $this->chat_submit( $botId, $newMessage, $newFileId, $params, $stream, $newFileIds );
      $final_res = $this->build_final_res(
        $botId,
        $newMessage,
        $newFileId,
        $params,
        $data['reply'],
        $data['images'],
        $data['actions'],
        $data['usage'],
        $data['responseId'] ?? null
      );
      return $this->create_rest_response( $final_res, 200 );
    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );

      // If we're in streaming mode, send the error through the stream
      if ( $stream ) {
        // Log the error
        error_log( '[AI Engine Chatbot Error] ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine() );

        // Send error event through stream
        $errorData = [
          'type' => 'error',
          'data' => 'Oops! Something went wrong on the server. Please try again, and if you are the site developer, check the PHP Error Logs for details.'
        ];
        echo 'data: ' . json_encode( $errorData ) . "\n\n";
        if ( ob_get_level() > 0 ) {
          ob_end_flush();
        }
        flush();
        die();
      }

      // For non-streaming, return normal error response
      return $this->create_rest_response( [
        'success' => false,
        'message' => $message
      ], 500 );
    }
  }

  private function sanitize_items( $items, $supported_types, $type_name ) {
    if ( empty( $items ) ) {
      return $items;
    }
    $sanitized_items = [];
    foreach ( $items as $item ) {
      if ( isset( $supported_types[$item['type']] ) ) {
        $is_valid = true;
        foreach ( $supported_types[$item['type']] as $param ) {
          if ( !isset( $item['data'][$param] ) ) {
            $is_valid = false;
            Meow_MWAI_Logging::warn( "The query was rejected - missing required parameter '{$param}' for {$type_name} type: {$item['type']}." );
            break;
          }
        }
        if ( $is_valid ) {
          $sanitized_items[] = $item;
        }
      }
      else {
        Meow_MWAI_Logging::warn( "The query was rejected - unsupported {$type_name} type: {$item['type']}." );
      }
    }
    return $sanitized_items;
  }

  public function sanitize_actions( $actions ) {
    $supported_action_types = [
      'function' => ['name', 'args'],
      'javascript' => ['snippet'],
    ];
    return $this->sanitize_items( $actions, $supported_action_types, 'action' );
  }

  public function sanitize_blocks( $blocks ) {
    $supported_block_types = [
      'content' => ['html'],
    ];
    return $this->sanitize_items( $blocks, $supported_block_types, 'block' );
  }

  public function sanitize_shortcuts( $shortcuts ) {
    $supported_shortcut_types = [
      'message' => ['label', 'message'],
      'action' => ['label', 'message', 'action'],
      'callback' => ['label', 'onClick'],
    ];
    return $this->sanitize_items( $shortcuts, $supported_shortcut_types, 'shortcut' );
  }

  /**
   * Prepare shortcuts for client by replacing messages with shortcutIds.
   * The actual messages are stored server-side and looked up when the shortcut is clicked.
   * This keeps the prompt content private and not exposed in the browser.
   *
   * @param array $shortcuts The shortcuts to prepare.
   * @param string $botId The bot ID for validation.
   * @return array The prepared shortcuts with shortcutIds instead of messages.
   */
  public function prepare_shortcuts_for_client( $shortcuts, $botId ) {
    if ( empty( $shortcuts ) ) {
      return $shortcuts;
    }

    $prepared = [];
    foreach ( $shortcuts as $shortcut ) {
      $type = $shortcut['type'] ?? '';
      $data = $shortcut['data'] ?? [];

      // Only process shortcuts that have a message (not callbacks)
      if ( isset( $data['message'] ) && !empty( $data['message'] ) ) {
        // Generate a unique shortcut ID
        $shortcutId = wp_generate_uuid4();

        // Store the message server-side (transient with 1 hour expiry)
        $transient_key = 'mwai_shortcut_' . $shortcutId;
        set_transient( $transient_key, [
          'message' => $data['message'],
          'botId' => $botId,
        ], HOUR_IN_SECONDS );

        // Replace message with shortcutId
        unset( $data['message'] );
        $data['shortcutId'] = $shortcutId;
      }

      $prepared[] = [
        'type' => $type,
        'data' => $data,
      ];
    }

    return $prepared;
  }

  /**
   * Look up a shortcut message by its ID.
   *
   * @param string $shortcutId The shortcut ID.
   * @param string $botId The bot ID for validation.
   * @return string|null The message, or null if not found.
   */
  public function get_shortcut_message( $shortcutId, $botId ) {
    if ( empty( $shortcutId ) ) {
      return null;
    }

    $transient_key = 'mwai_shortcut_' . $shortcutId;
    $shortcut_data = get_transient( $transient_key );

    if ( !$shortcut_data || !isset( $shortcut_data['message'] ) ) {
      return null;
    }

    // Validate botId matches (security check)
    if ( isset( $shortcut_data['botId'] ) && $shortcut_data['botId'] !== $botId ) {
      Meow_MWAI_Logging::warn( "Shortcut botId mismatch: expected {$shortcut_data['botId']}, got {$botId}" );
      return null;
    }

    return $shortcut_data['message'];
  }

  #region Messages Integrity Check

  public function messages_integrity_diff( $messages1, $messages2 ) {
    // Ensure both parameters are arrays
    if ( !is_array( $messages1 ) ) {
      $messages1 = [];
    }
    if ( !is_array( $messages2 ) ) {
      $messages2 = [];
    }

    // Collect messages with role not 'user' from messages1
    $messagesList1 = [];
    foreach ( $messages1 as $msg ) {
      $role = isset( $msg->role ) ? $msg->role : ( isset( $msg['role'] ) ? $msg['role'] : null );
      $content = isset( $msg->content ) ? $msg->content : ( isset( $msg['content'] ) ? $msg['content'] : null );
      if ( $role && $role != 'user' ) {
        $messageData = [ 'role' => $role, 'content' => $content ];
        $messagesList1[] = $messageData;
      }
    }

    // Collect messages with role not 'user' from messages2
    $messagesList2 = [];
    foreach ( $messages2 as $msg ) {
      $role = isset( $msg->role ) ? $msg->role : ( isset( $msg['role'] ) ? $msg['role'] : null );
      $content = isset( $msg->content ) ? $msg->content : ( isset( $msg['content'] ) ? $msg['content'] : null );
      if ( $role && $role != 'user' ) {
        $messageData = [ 'role' => $role, 'content' => $content ];
        $messagesList2[] = $messageData;
      }
    }

    // Count occurrences of each message in messagesList1
    $counts1 = [];
    foreach ( $messagesList1 as $msg ) {
      $key = serialize( $msg );
      if ( isset( $counts1[ $key ] ) ) {
        $counts1[ $key ]++;
      }
      else {
        $counts1[ $key ] = 1;
      }
    }

    // Count occurrences of each message in messagesList2
    $counts2 = [];
    foreach ( $messagesList2 as $msg ) {
      $key = serialize( $msg );
      if ( isset( $counts2[ $key ] ) ) {
        $counts2[ $key ]++;
      }
      else {
        $counts2[ $key ] = 1;
      }
    }

    // Compare counts to find unmatched messages
    $all_keys = array_unique( array_merge( array_keys( $counts1 ), array_keys( $counts2 ) ) );

    $diffs = [];
    foreach ( $all_keys as $key ) {
      $count1 = isset( $counts1[ $key ] ) ? $counts1[ $key ] : 0;
      $count2 = isset( $counts2[ $key ] ) ? $counts2[ $key ] : 0;
      if ( $count1 != $count2 ) {
        $message = unserialize( $key );
        $diffs[] = [
          'message' => $message,
          'count_in_messages1' => $count1,
          'count_in_messages2' => $count2
        ];
      }
    }

    return $diffs;
  }

  private function calculate_messages_checksum( $messages ) {
    $messages_to_hash = [];
    foreach ( $messages as $msg ) {
      $role = is_array( $msg ) ? ( $msg['role'] ?? '' ) : ( is_object( $msg ) ? ( $msg->role ?? '' ) : '' );
      $content = is_array( $msg ) ? ( $msg['content'] ?? '' ) : ( is_object( $msg ) ? ( $msg->content ?? '' ) : '' );
      if ( in_array( $role, ['assistant', 'system'] ) ) {
        $messages_to_hash[] = [ 'role' => $role, 'content' => $content ];
      }
    }
    return md5( json_encode( $messages_to_hash ) );
  }

  #endregion

  public function chat_submit( $botId, $newMessage, $newFileId = null, $params = [], $stream = false, $newFileIds = [] ) {
    $query = null; // Initialize query variable to avoid undefined variable errors
    try {
      $chatbot = null;
      $customId = $params['customId'] ?? null;

      // Custom Chatbot
      if ( $customId ) {
        $chatbot = get_transient( 'mwai_custom_chatbot_' . $customId );
      }
      // Registered Chatbot
      if ( !$chatbot && $botId ) {
        $chatbot = $this->core->get_chatbot( $botId );
      }
      // Fall back to default chatbot if no chatbot found yet
      if ( !$chatbot ) {
        $chatbot = $this->core->get_chatbot( 'default' );
      }

      if ( !$chatbot ) {
        Meow_MWAI_Logging::warn( 'The query was rejected - no chatbot was found.' );
        throw new Exception( 'Sorry, your query has been rejected.' );
      }

      $textInputMaxLength = $chatbot['textInputMaxLength'] ?? null;
      if ( $textInputMaxLength && $this->core->safe_strlen( $newMessage ) > (int) $textInputMaxLength ) {
        Meow_MWAI_Logging::warn( 'The query was rejected - message was too long.' );
        throw new Exception( 'Sorry, your query has been rejected.' );
      }

      // We need to check the integrity of the messages sent by the client.
      // This is important to ensure that the messages are not tampered with.

      // Messages Integrity Check with Checksums
      $chatId = $params['chatId'] ?? 'default';
      $checksum_key = 'mwai_chatbot_checksum_' . $chatId;
      $stored_checksum = get_transient( $checksum_key );
      $client_messages = $params['messages'] ?? [];
      $client_checksum = $this->calculate_messages_checksum( $client_messages );
      if ( $stored_checksum && $stored_checksum !== $client_checksum ) {
        Meow_MWAI_Logging::warn( 'Integrity Check: Messages integrity check failed. Assistant or system messages sent by the client do not match stored messages. Please enable the Discussions module for better logs.' );
      }

      // Messages Integrity Check with Discussions
      if ( $this->core->get_option( 'chatbot_discussions' ) && $this->core->discussions && isset( $params['chatId'] ) ) {
        $discussion = $this->core->discussions->get_discussion( $botId ? $botId : $customId, $params['chatId'] );
        if ( $discussion ) {
          $messages = $discussion['messages'];
          $clientMessages = isset( $params['messages'] ) ? $params['messages'] : [];
          $diffs = $this->messages_integrity_diff( $messages, $clientMessages );
          if ( count( $diffs ) > 0 ) {
            Meow_MWAI_Logging::warn( "Integrity Check: It seems the messages in the discussion #{$discussion['id']} do not match the ones sent by the client." );
          }

          // Maintain conversation state for Responses API by loading previousResponseId
          // This enables stateful conversations where only new messages are sent
          if ( empty( $params['previousResponseId'] ) && !empty( $discussion['extra'] ) ) {
            $extra = json_decode( $discussion['extra'], true );
            if ( !empty( $extra['responseId'] ) ) {
              // Response IDs expire after 30 days per OpenAI's policy
              // Check if the stored response is still valid
              $responseDate = !empty( $extra['responseDate'] ) ? strtotime( $extra['responseDate'] ) : 0;
              $thirtyDaysAgo = time() - ( 30 * 24 * 60 * 60 );

              if ( $responseDate > $thirtyDaysAgo ) {
                // Use the stored response ID for stateful conversation
                $params['previousResponseId'] = $extra['responseId'];
              }
            }
          }
        }
        else {
          // No discussion yet? We still need to check the startSentence.
          $startSentence = isset( $chatbot['startSentence'] ) ? $chatbot['startSentence'] : null;
          $messages = [];
          if ( !empty( $startSentence ) ) {
            $messages[] = [ 'role' => 'assistant', 'content' => $startSentence ];
          }
          $clientMessages = isset( $params['messages'] ) ? $params['messages'] : [];
          $diffs = $this->messages_integrity_diff( $messages, $clientMessages );
          if ( count( $diffs ) > 0 ) {
            Meow_MWAI_Logging::warn( 'Integrity Check: It seems the messages in the discussion do not match the ones sent by the client: ' . json_encode( $diffs ) );
          }
        }
      }

      // Create QueryText
      $context = null;
      $streamCallback = null;
      $mode = $chatbot['mode'] ?? 'chat';

      if ( $mode === 'images' ) {
        // Check for uploaded files
        $fileForImage = null;
        if ( !empty( $newFileIds ) && is_array( $newFileIds ) ) {
          $fileForImage = $newFileIds[0];
        }
        elseif ( !empty( $newFileId ) ) {
          $fileForImage = $newFileId;
        }

        // If there's an uploaded file, use EditImage query instead
        if ( !empty( $fileForImage ) ) {
          $query = new Meow_MWAI_Query_EditImage( $newMessage );

          // Handle the uploaded image
          $url = $this->core->files->get_url( $fileForImage );
          $mimeType = $this->core->files->get_mime_type( $fileForImage );
          $isIMG = in_array( $mimeType, [ 'image/jpeg', 'image/png', 'image/gif', 'image/webp' ] );

          if ( $isIMG ) {
            $query->add_file( Meow_MWAI_Query_DroppedFile::from_url( $url, 'analysis', $mimeType ) );
            $fileId = $this->core->files->get_id_from_refId( $fileForImage );
            $this->core->files->update_purpose( $fileId, 'analysis' );
          }
        }
        else {
          $query = new Meow_MWAI_Query_Image( $newMessage );
        }

        // Handle Params
        $newParams = [];
        foreach ( $chatbot as $key => $value ) {
          $newParams[$key] = $value;
        }
        if ( is_array( $params ) ) {
          foreach ( $params as $key => $value ) {
            $newParams[$key] = $value;
          }
        }

        // Map 'environment' field to 'envId' for compatibility
        if ( isset( $newParams['environment'] ) && !isset( $newParams['envId'] ) ) {
          $newParams['envId'] = $newParams['environment'];
        }

        $params = apply_filters( 'mwai_chatbot_params', $newParams );
        $params['scope'] = empty( $params['scope'] ) ? 'chatbot' : $params['scope'];

        // Debug log for embeddings
        if ( !empty( $params['embeddingsEnvId'] ) ) {
          Meow_MWAI_Logging::log( 'Chatbot: Setting embeddingsEnvId on query: ' . $params['embeddingsEnvId'] );
        }
        else {
          // Log all params to debug
          $paramKeys = array_keys( $params );
          Meow_MWAI_Logging::log( 'Chatbot: No embeddingsEnvId found. Available params: ' . implode( ', ', $paramKeys ) );
        }

        $query->inject_params( $params );
      }
      else {
        $query = $mode === 'assistant' ? new Meow_MWAI_Query_Assistant( $newMessage ) :
          new Meow_MWAI_Query_Text( $newMessage, 4096 );

        // Handle Params
        $newParams = [];
        foreach ( $chatbot as $key => $value ) {
          $newParams[$key] = $value;
        }
        if ( is_array( $params ) ) {
          foreach ( $params as $key => $value ) {
            $newParams[$key] = $value;
          }
        }

        // Map 'environment' field to 'envId' for compatibility
        if ( isset( $newParams['environment'] ) && !isset( $newParams['envId'] ) ) {
          $newParams['envId'] = $newParams['environment'];
        }

        $params = apply_filters( 'mwai_chatbot_params', $newParams );
        $params['scope'] = empty( $params['scope'] ) ? 'chatbot' : $params['scope'];

        // Debug log for embeddings
        if ( !empty( $params['embeddingsEnvId'] ) ) {
          Meow_MWAI_Logging::log( 'Chatbot: Setting embeddingsEnvId on query: ' . $params['embeddingsEnvId'] );
        }
        else {
          // Log all params to debug
          $paramKeys = array_keys( $params );
          Meow_MWAI_Logging::log( 'Chatbot: No embeddingsEnvId found. Available params: ' . implode( ', ', $paramKeys ) );
        }

        // In Prompt mode, clear out features that are not supported before injecting params
        if ( $mode === 'prompt' ) {
          // Clear embeddings/context settings
          unset( $params['embeddingsEnvId'] );
          unset( $params['embeddingsIndex'] );
          unset( $params['embeddingsNamespace'] );
          unset( $params['contentAware'] );
          unset( $params['context'] );

          // Clear function calling and MCP servers
          unset( $params['functions'] );
          unset( $params['mcpServers'] );

          // Clear tools
          unset( $params['tools'] );

          // Clear temperature, reasoning, verbosity as they're configured in the prompt
          unset( $params['temperature'] );
          unset( $params['reasoningEffort'] );
          unset( $params['verbosity'] );
          unset( $params['maxTokens'] );
        }

        $query->inject_params( $params );

        // Handle Prompt mode specifics
        if ( $mode === 'prompt' && !empty( $params['promptId'] ) ) {
          $promptData = [ 'id' => $params['promptId'] ];
          $query->setExtraParam( 'prompt', $promptData );
        }

        $storeId = null;
        if ( $mode === 'assistant' ) {
          $chatId = $params['chatId'] ?? null;
          if ( !empty( $chatId ) && $this->core->discussions ) {
            $discussion = $this->core->discussions->get_discussion( $query->botId, $chatId );
            if ( isset( $discussion['storeId'] ) ) {
              $storeId = $discussion['storeId'];
              $query->setStoreId( $storeId );
            }
          }
        }

        // Support for Multiple Uploaded Files
        $filesToProcess = [];
        if ( !empty( $newFileIds ) && is_array( $newFileIds ) ) {
          $filesToProcess = $newFileIds;
        }
        elseif ( !empty( $newFileId ) ) {
          $filesToProcess[] = $newFileId;
        }

        // Support for Uploaded Image/Files
        if ( !empty( $filesToProcess ) ) {
          // Process all files for multi-upload support
          foreach ( $filesToProcess as $fileToProcess ) {
            // Get extension and mime type
            $isImage = $this->core->files->is_image( $fileToProcess );

            if ( $mode === 'assistant' && !$isImage ) {
              // DEPRECATED: Assistants API and File Search are deprecated
              // After August 26, 2026, this entire block should be removed
              error_log( '[AI Engine] WARNING: Assistant File Search is deprecated and will be removed after August 26, 2026. Consider using regular chat with PDF uploads instead.' );

              $url = $this->core->files->get_path( $fileToProcess );
              $data = $this->core->files->get_data( $fileToProcess );
              $openai = Meow_MWAI_Engines_Factory::get_openai( $this->core, $query->envId );
              $filename = basename( $url );

              // Upload the file
              $file = $openai->upload_file( $filename, $data, 'assistants' );

              // Create a store
              if ( empty( $storeId ) ) {
                $chatbotName = 'mwai_' . strtolower( !empty( $chatbot['name'] ) ? $chatbot['name'] : 'default' );
                if ( !empty( $query->chatId ) ) {
                  $chatbotName .= '_' . $query->chatId;
                }
                $metadata = [];
                if ( !empty( $chatbot['assistantId'] ) ) {
                  $metadata['assistantId'] = $chatbot['assistantId'];
                }
                if ( !empty( $query->chatId ) ) {
                  $metadata['chatId'] = $query->chatId;
                }
                $expiry = $this->core->get_option( 'image_expires' );
                $storeId = $openai->create_vector_store( $chatbotName, $expiry, $metadata );
                $query->setStoreId( $storeId );
              }

              // Add the file to the store - wait a moment for store to be ready
              sleep( 1 );
              $storeFileId = $openai->add_vector_store_file( $storeId, $file['id'] );

              if ( empty( $storeFileId ) ) {
                throw new Exception( 'Failed to add file to vector store.' );
              }

              // Update the local file with the OpenAI RefId, StoreId and StoreFileId
              $openAiRefId = $file['id'];
              $internalFileId = $this->core->files->get_id_from_refId( $fileToProcess );
              $this->core->files->update_refId( $internalFileId, $openAiRefId );
              $this->core->files->update_envId( $internalFileId, $query->envId );
              $this->core->files->update_purpose( $internalFileId, 'analysis' );
              $this->core->files->add_metadata( $internalFileId, 'assistant_storeId', $storeId );
              $this->core->files->add_metadata( $internalFileId, 'assistant_storeFileId', $storeFileId );
              $fileToProcess = $openAiRefId;
              $scope = $params['fileSearch'];
              if ( $scope === 'discussion' || $scope === 'user' || $scope === 'assistant' ) {
                $id = $this->core->files->get_id_from_refId( $fileToProcess );
                $this->core->files->add_metadata( $id, 'assistant_scope', $scope );
              }
            }
            else {
              // Keep track of the internal file ID (before any OpenAI processing)
              // Important: $fileToProcess is our internal database refId, not OpenAI's file_id
              $internalRefId = $fileToProcess;
              $url = $this->core->files->get_url( $internalRefId );
              $mimeType = $this->core->files->get_mime_type( $internalRefId );
              $isIMG = in_array( $mimeType, [ 'image/jpeg', 'image/png', 'image/gif', 'image/webp' ] );

              // Create DroppedFile object - provider-agnostic approach
              // Images use URL (can be sent as base64 or URL in messages)
              // PDFs use refId (engines will upload to their Files API as needed)
              if ( $isIMG ) {
                $droppedFile = Meow_MWAI_Query_DroppedFile::from_url( $url, 'analysis', $mimeType );
              }
              else {
                // For PDFs and documents, use refId so engines can access file data directly
                $droppedFile = Meow_MWAI_Query_DroppedFile::from_refId( $internalRefId, 'analysis', $mimeType );
              }

              // IMPORTANT: Always use add_file() to add to attachedFiles array
              // This is the unified approach for both single and multi-file uploads
              // Engines will check attachedFiles array first, then fall back to attachedFile (legacy)
              $query->add_file( $droppedFile );

              // Update metadata using the internal refId (not OpenAI file ID)
              $fileId = $this->core->files->get_id_from_refId( $internalRefId );
              $this->core->files->update_envId( $fileId, $query->envId );
              $this->core->files->update_purpose( $fileId, 'analysis' );
              $this->core->files->add_metadata( $fileId, 'query_envId', $query->envId );
              $this->core->files->add_metadata( $fileId, 'query_session', $query->session );
            }
          }
        }

        // Takeover
        $takeoverAnswer = apply_filters( 'mwai_chatbot_takeover', null, $query, $params );
        if ( !empty( $takeoverAnswer ) ) {
          $reply = new Meow_MWAI_Reply( $query );
          $reply->result = $takeoverAnswer;
          $rawText = apply_filters( 'mwai_chatbot_reply', $takeoverAnswer, $reply, $params, [] );
          return [
            'reply' => $rawText,
            'chatId' => $this->core->fix_chat_id( $query, $params ),
            'images' => null,
            'actions' => [],
            'usage' => null
          ];
        }

        // Moderation
        $moderationEnabled = $this->core->get_option( 'module_moderation' ) &&
          $this->core->get_option( 'shortcode_chat_moderation' );
        if ( $moderationEnabled ) {
          global $mwai;
          $isFlagged = $mwai->moderationCheck( $query->get_message() );
          if ( $isFlagged ) {
            throw new Exception( 'Sorry, your message has been rejected by moderation.' );
          }
        }

        // Setup streaming if enabled (before embeddings to capture those events)
        $streamCallback = null;
        $debugEvents = [];

        if ( $stream ) {
          $streamCallback = function ( $reply ) use ( $query ) {
            // Support both legacy string data and new Event objects
            if ( is_string( $reply ) ) {
              $this->core->stream_push( [ 'type' => 'live', 'data' => $reply ], $query );
            }
            else {
              $this->core->stream_push( $reply, $query );
            }
          };
          if ( headers_sent( $filename, $linenum ) ) {
            throw new Exception( "Headers already sent in $filename on line $linenum. Cannot start streaming." );
          }
          header( 'Cache-Control: no-cache' );
          header( 'Content-Type: text/event-stream' );
          // This is useful to disable buffering in nginx through headers.
          header( 'X-Accel-Buffering: no' );
          ob_implicit_flush( true );
          if ( ob_get_level() > 0 ) {
            ob_end_flush();
          }
        }
        else if ( $this->core->get_option( 'module_devtools' ) && $this->core->get_option( 'debug_mode' ) ) {
          // For non-streaming debug mode, collect events
          $streamCallback = function ( $event ) use ( &$debugEvents ) {
            if ( is_object( $event ) && method_exists( $event, 'toArray' ) ) {
              $debugEvents[] = $event->toArray();
            }
          };
        }

        // Awareness & Embeddings
        $context = $this->core->retrieve_context( $params, $query, $streamCallback );
        if ( !empty( $context ) ) {
          $query->set_context( $context['content'] );
        }

        // Function Aware
        $query = apply_filters( 'mwai_chatbot_query', $query, $params );
      }

      // Process Query

      $reply = $this->core->run_query( $query, $streamCallback, true );
      $rawText = $reply->result;
      $extra = [];
      if ( $context ) {
        $extra = [ 'embeddings' => isset( $context['embeddings'] ) ? $context['embeddings'] : null ];
      }
      // Store response ID for Responses API stateful conversations
      // CRITICAL: Must store even when function calls are present
      // This enables the feedback query to use previous_response_id
      if ( !empty( $reply->id ) ) {
        $extra['responseId'] = $reply->id;
        $extra['responseDate'] = gmdate( 'Y-m-d H:i:s' ); // Track age for 30-day expiry
      }
      $rawText = apply_filters( 'mwai_chatbot_reply', $rawText, $reply, $params, $extra );

      // Integrity Check: We need to store the checksum of the messages sent by the client.
      $stored_messages = $client_messages;
      $stored_messages[] = [ 'role' => 'user', 'content' => $newMessage ];
      $stored_messages[] = [ 'role' => 'assistant', 'content' => $rawText ];
      $stored_checksum = $this->calculate_messages_checksum( $stored_messages );
      set_transient( $checksum_key, $stored_checksum, 60 * 60 * 24 * 30 );

      // Actions
      $actions = [];
      if ( $reply->needClientActions ) {
        foreach ( $reply->needClientActions as $action ) {
          $actions[] = [
            'type' => 'function',
            'data' => [
              'name' => $action['function']->name,
              'args' => $action['arguments']
            ]
          ];
        }
      }

      $restRes = [
        'reply' => $rawText,
        'chatId' => $this->core->fix_chat_id( $query, $params ),
        'images' => $reply->get_type() === 'images' ? $reply->results : null,
        'actions' => $actions,
        'usage' => $reply->usage
      ];

      // Add debug events if collected
      if ( !empty( $debugEvents ) ) {
        $restRes['debugEvents'] = $debugEvents;
      }

      // Add response ID if available (for Responses API)
      if ( !empty( $reply->id ) ) {
        $restRes['responseId'] = $reply->id;
      }

      // Process Reply
      if ( $stream ) {
        $final_res = $this->build_final_res(
          $botId,
          $newMessage,
          $newFileId,
          $params,
          $restRes['reply'],
          $restRes['images'],
          $restRes['actions'],
          $restRes['usage'],
          $restRes['responseId'] ?? null
        );
        $this->core->stream_push( [ 'type' => 'end', 'data' => json_encode( $final_res ) ], $query );
        die();
      }
      else {
        return $restRes;
      }

    }
    catch ( Exception $e ) {
      $message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
      if ( $stream ) {
        $this->core->stream_push( [ 'type' => 'error', 'data' => $message ], $query );
        die();
      }
      else {
        throw $e;
      }
    }
  }

  public function inject_chat() {
    $params = $this->core->get_chatbot( $this->siteWideChatId );
    $clean_params = [];
    if ( !empty( $params ) ) {
      $clean_params['window'] = true;
      $clean_params['id'] = $this->siteWideChatId;
      echo $this->chat_shortcode( $clean_params );
    }
    return null;
  }

  public function build_front_params( $botId, $customId, $crossSite = false ) {
    $frontSystem = [
      'botId' => ( $customId && $customId !== '' ) ? null : sanitize_text_field( $botId ),
      'customId' => ( $customId && $customId !== '' ) ? sanitize_text_field( $customId ) : null,
      'userData' => $this->core->get_user_data(),
      'sessionId' => $this->core->get_session_id(),
      // IMPORTANT: REST nonce handling differs by user state:
      // - Logged-in users: get_nonce() returns a user-specific nonce created in current session context
      // - Logged-out users: get_nonce() returns null, they'll fetch via /start_session endpoint
      // This prevents rest_cookie_invalid_nonce errors for logged-in users by ensuring the nonce
      // matches their authentication context from the start.
      'restNonce' => $crossSite ? null : $this->core->get_nonce(),
      'contextId' => get_the_ID(),
      'pluginUrl' => MWAI_URL,
      'restUrl' => untrailingslashit( get_rest_url() ),
      'stream' => $this->core->get_option( 'ai_streaming' ),
      'debugMode' => $this->core->get_option( 'module_devtools' ) && $this->core->get_option( 'debug_mode' ),
      'eventLogs' => $this->core->get_option( 'event_logs' ),
      'speech_recognition' => $this->core->get_option( 'speech_recognition' ),
      'speech_synthesis' => $this->core->get_option( 'speech_synthesis' ),
      'typewriter' => $this->core->get_option( 'chatbot_typewriter' ),
      'crossSite' => $crossSite
    ];
    return $frontSystem;
  }

  public function resolveBotInfo( &$atts ) {
    $chatbot = null;
    $botId = $atts['id'] ?? null;
    $customId = $atts['custom_id'] ?? null;
    $parentBotId = null;

    if ( !$botId && !$customId ) {
      $botId = 'default';
    }
    if ( $botId ) {
      $chatbot = $this->core->get_chatbot( $botId );
      if ( !$chatbot ) {
        $botId = $botId ?: 'N/A';
        $safe_botId = esc_html( $botId );
        return [
          'error' => "AI Engine: Chatbot '{$safe_botId}' not found. If you meant to set an ID for your custom chatbot, please use 'custom_id' instead of 'id'.",
        ];
      }
    }
    $chatbot = $chatbot ?: $this->core->get_chatbot( 'default' );

    if ( !empty( $customId ) ) {
      if ( $botId !== null ) {
        $parentBotId = $botId;
        $botId = null;
      }
    }

    unset( $atts['id'] );
    return [
      'chatbot' => $chatbot,
      'botId' => $botId,
      'customId' => $customId,
      'parentBotId' => $parentBotId
    ];
  }

  public function chat_shortcode( $atts ) {
    $atts = empty( $atts ) ? [] : $atts;

    foreach ( $atts as $key => $value ) {
      $atts[ $key ] = urldecode( $value );
    }

    // Let the user override the chatbot params
    $atts = apply_filters( 'mwai_chatbot_params', $atts );

    // Resolve the bot info
    $resolvedBot = $this->resolveBotInfo( $atts );
    if ( isset( $resolvedBot['error'] ) ) {
      return $resolvedBot['error'];
    }
    $chatbot = $resolvedBot['chatbot'];
    $botId = $resolvedBot['botId'];
    $customId = $resolvedBot['customId'];
    $parentBotId = $resolvedBot['parentBotId'];

    // Rename the keys of the atts into camelCase to match the internal params system.
    $atts = array_map( function ( $key, $value ) {
      $key = str_replace( '_', ' ', $key );
      $key = ucwords( $key );
      $key = str_replace( ' ', '', $key );
      $key = lcfirst( $key );
      return [ $key => $value ];
    }, array_keys( $atts ), $atts );
    $atts = array_merge( ...$atts );

    if ( !empty( $parentBotId ) ) {
      $atts['parentBotId'] = $parentBotId;
    }

    $frontParams = [];
    // Define text parameters that need sanitization (excluding those that support HTML)
    $textParams = ['aiName', 'userName', 'guestName', 'textSend', 'textClear', 'textInputPlaceholder',
      'startSentence', 'iconText', 'iconAlt', 'headerSubtitle', 'popupTitle', 'allowedMimeTypes'];
    // Parameters that support HTML content
    $htmlParams = ['textCompliance'];
    // Boolean parameters that need special handling
    $booleanParams = ['window', 'copyButton', 'fullscreen', 'localMemory', 'iconBubble', 'centerOpen',
      'imageUpload', 'fileUpload', 'multiUpload', 'fileSearch'];

    foreach ( MWAI_CHATBOT_FRONT_PARAMS as $param ) {
      // Let's go through the overriden or custom params first (the ones passed in the shortcode)
      if ( isset( $atts[$param] ) ) {
        if ( $param === 'localMemory' ) {
          $frontParams[$param] = $atts[$param] === 'true';
        }
        else if ( in_array( $param, $textParams ) ) {
          // Sanitize text parameters to prevent XSS
          $frontParams[$param] = sanitize_text_field( $atts[$param] );
        }
        else if ( in_array( $param, $htmlParams ) ) {
          // For HTML parameters, use wp_kses_post to allow safe HTML
          $frontParams[$param] = wp_kses_post( $atts[$param] );
        }
        else if ( in_array( $param, $booleanParams ) ) {
          // Convert to proper boolean
          // Handle various boolean representations from shortcode attributes
          $value = $atts[$param];
          if ( is_bool( $value ) ) {
            $frontParams[$param] = $value;
          }
          else if ( is_string( $value ) ) {
            $frontParams[$param] = !empty( $value ) && $value !== 'false' && $value !== '0' && $value !== 'no';
          }
          else {
            $frontParams[$param] = !empty( $value );
          }
        }
        else {
          $frontParams[$param] = $atts[$param];
        }
      }
      // If not, let's use the chatbot's default values
      else if ( isset( $chatbot[$param] ) ) {
        if ( in_array( $param, $booleanParams ) ) {
          // Convert to proper boolean for chatbot defaults too
          // Handle various boolean representations
          $value = $chatbot[$param];

          if ( is_bool( $value ) ) {
            $frontParams[$param] = $value;
          }
          else if ( is_string( $value ) ) {
            $frontParams[$param] = !empty( $value ) && $value !== 'false' && $value !== '0';
          }
          else {
            $frontParams[$param] = !empty( $value );
          }
        }
        else {
          $frontParams[$param] = $chatbot[$param];
        }
      }

      // Apply the placeholders
      if ( in_array( $param, ['startSentence', 'iconText'] ) ) {
        $frontParams[$param] = $this->core->do_placeholders( $frontParams[$param] );
      }
    }

    // Ensure upload params are synced
    // fileUpload (checkbox) determines if uploads are enabled
    // maxUploads (number) determines how many files can be uploaded
    $fileUploadEnabled = !empty( $frontParams['fileUpload'] ) || !empty( $frontParams['imageUpload'] );
    $maxFiles = isset( $frontParams['maxUploads'] ) ? max( 1, (int) $frontParams['maxUploads'] ) : 1;

    // Sync all params for backward compatibility
    $frontParams['fileUpload'] = $fileUploadEnabled;
    $frontParams['imageUpload'] = $fileUploadEnabled;
    $frontParams['fileUploads'] = $fileUploadEnabled ? $maxFiles : 0;
    $frontParams['multiUpload'] = $fileUploadEnabled && $maxFiles > 1;
    $frontParams['maxUploads'] = $maxFiles;

    // Server Params
    // NOTE: We don't need the server params for the chatbot if there are no overrides, it means
    // we are using the default or a specific chatbot.
    $isSiteWide = $this->siteWideChatId && $botId === $this->siteWideChatId;

    // Parameters that are purely visual/UI and shouldn't trigger custom ID
    $visualOnlyParams = [
      // Bot selectors
      'id', 'custom_id',
      // System-added params
      'crossSite',
      // Visual/UI parameters that don't affect AI behavior
      'aiName', 'userName', 'guestName',  // Display names
      'aiAvatar', 'userAvatar', 'guestAvatar', 'aiAvatarUrl', 'userAvatarUrl', 'guestAvatarUrl',  // Avatars
      'textSend', 'textClear', 'textInputPlaceholder', 'textCompliance',  // UI text labels
      'textInputMaxLength',  // Input constraint (visual)
      'themeId',  // Theme selection
      'window', 'icon', 'iconText', 'iconTextDelay', 'iconAlt', 'iconPosition',  // Window/icon settings
      'centerOpen', 'width', 'openDelay', 'iconBubble', 'windowAnimation', 'fullscreen',  // Window behavior
      'copyButton', 'headerSubtitle', 'popupTitle',  // UI features
      'containerType', 'headerType', 'messagesType', 'inputType', 'footerType'  // UI style variants
    ];

    // Remove visual-only params from override detection
    $attsForOverrideCheck = array_diff_key( $atts, array_flip( $visualOnlyParams ) );

    // Only these front params affect behavior and should trigger custom ID:
    // - mode: chat vs. prompt mode
    // - startSentence: initial AI message
    // - localMemory: affects data persistence
    // - imageUpload, fileUpload, multiUpload, fileSearch: affect capabilities
    $behavioralFrontParams = ['mode', 'startSentence', 'localMemory', 'imageUpload', 'fileUpload', 'multiUpload', 'fileSearch'];

    $hasServerOverrides = count( array_intersect( array_keys( $attsForOverrideCheck ), MWAI_CHATBOT_SERVER_PARAMS ) ) > 0;
    $hasBehavioralFrontOverrides = count( array_intersect( array_keys( $attsForOverrideCheck ), $behavioralFrontParams ) ) > 0;
    $hasOverrides = !$isSiteWide && ( $hasServerOverrides || $hasBehavioralFrontOverrides );

    $serverParams = [];
    if ( $hasOverrides ) {
      // Server parameters don't need sanitization as they're processed server-side
      // and not rendered in HTML. They may contain code, HTML, etc. for AI context.
      foreach ( MWAI_CHATBOT_SERVER_PARAMS as $param ) {
        if ( isset( $atts[$param] ) ) {
          $serverParams[$param] = $atts[$param];
        }
        else {
          // For custom chatbots, don't inherit embeddingsEnvId from the default chatbot
          if ( $param === 'embeddingsEnvId' && !empty( $customId ) ) {
            $serverParams[$param] = '';
          }
          else {
            $serverParams[$param] = $chatbot[$param] ?? null;
          }
        }
      }
    }

    // Front Params
    $frontSystem = $this->build_front_params( $botId, $customId );

    // Clean Params
    $frontParams = $this->clean_params( $frontParams );
    $frontSystem = $this->clean_params( $frontSystem );
    $serverParams = $this->clean_params( $serverParams );

    // Server-side: Keep the System Params
    if ( $hasOverrides ) {
      if ( empty( $customId ) ) {
        $customId = md5( json_encode( $serverParams ) );
        $frontSystem['customId'] = $customId;
      }
      set_transient( 'mwai_custom_chatbot_' . $customId, $serverParams, 60 * 60 * 24 );
    }

    // Retrieve the actions, shortcuts, and blocks we want to inject at the beginning
    $filterParams = [
      'step' => 'init',
      'botId' => $botId,
      'params' => array_merge( $frontParams, $frontSystem, $serverParams )
    ];
    $actions = apply_filters( 'mwai_chatbot_actions', [], $filterParams );
    $blocks = apply_filters( 'mwai_chatbot_blocks', [], $filterParams );
    $shortcuts = apply_filters( 'mwai_chatbot_shortcuts', [], $filterParams );
    $frontSystem['actions'] = $this->sanitize_actions( $actions );
    $frontSystem['blocks'] = $this->sanitize_blocks( $blocks );
    $shortcuts = $this->sanitize_shortcuts( $shortcuts );
    $shortcuts = $this->prepare_shortcuts_for_client( $shortcuts, $botId );
    $frontSystem['shortcuts'] = $shortcuts;

    // Client-side: Prepare JSON for Front Params and System Params
    $theme = isset( $frontParams['themeId'] ) ? $this->core->get_theme( $frontParams['themeId'] ) : null;
    $jsonFrontParams = htmlspecialchars( json_encode( $frontParams ), ENT_QUOTES, 'UTF-8' );
    $jsonFrontSystem = htmlspecialchars( json_encode( $frontSystem ), ENT_QUOTES, 'UTF-8' );
    $jsonFrontTheme = htmlspecialchars( json_encode( $theme ), ENT_QUOTES, 'UTF-8' );
    //$jsonAttributes = htmlspecialchars(json_encode($atts), ENT_QUOTES, 'UTF-8');

    $this->enqueue_scripts( $frontParams['themeId'] ?? null );

    return "<div class='mwai-chatbot-container' data-params='{$jsonFrontParams}' data-system='{$jsonFrontSystem}' data-theme='{$jsonFrontTheme}'></div>";
  }

  public function chatbot_discussions( $atts ) {
    $atts = empty( $atts ) ? [] : $atts;

    // Resolve the bot info
    $resolvedBot = $this->resolveBotInfo( $atts );
    if ( isset( $resolvedBot['error'] ) ) {
      return $resolvedBot['error'];
    }
    $chatbot = $resolvedBot['chatbot'];
    $botId = $resolvedBot['botId'];
    $customId = $resolvedBot['customId'];

    // Rename the keys of the atts into camelCase to match the internal params system.
    $atts = array_map( function ( $key, $value ) {
      $key = str_replace( '_', ' ', $key );
      $key = ucwords( $key );
      $key = str_replace( ' ', '', $key );
      $key = lcfirst( $key );
      return [ $key => $value ];
    }, array_keys( $atts ), $atts );
    $atts = array_merge( ...$atts );

    // Front Params
    $frontParams = [];
    // All discussion params are text params that need sanitization
    $textParams = ['textNewChat'];

    foreach ( MWAI_DISCUSSIONS_FRONT_PARAMS as $param ) {
      if ( isset( $atts[$param] ) ) {
        // Sanitize text parameters
        $frontParams[$param] = in_array( $param, $textParams ) ? sanitize_text_field( $atts[$param] ) : $atts[$param];
      }
      else if ( isset( $chatbot[$param] ) ) {
        $frontParams[$param] = $chatbot[$param];
      }
    }

    // Server Params
    $serverParams = [];
    foreach ( MWAI_DISCUSSIONS_SERVER_PARAMS as $param ) {
      if ( isset( $atts[$param] ) ) {
        $serverParams[$param] = $atts[$param];
      }
    }

    // Front System
    $frontSystem = $this->build_front_params( $botId, $customId );
    // Get refresh interval from settings
    $refresh_interval = $this->core->get_option( 'chatbot_discussions_refresh_interval' );
    if ( $refresh_interval === 'Never' ) {
      $frontSystem['refreshInterval'] = 0;
    }
    elseif ( $refresh_interval === 'Manual' ) {
      $frontSystem['refreshInterval'] = -1;
    }
    elseif ( is_numeric( $refresh_interval ) ) {
      $frontSystem['refreshInterval'] = intval( $refresh_interval ) * 1000; // Convert to milliseconds
    }
    else {
      $frontSystem['refreshInterval'] = 5000; // Default to 5 seconds
    }
    $frontSystem['refreshInterval'] = apply_filters( 'mwai_discussions_refresh_interval', $frontSystem['refreshInterval'] );

    // Get paging setting
    $paging_option = $this->core->get_option( 'chatbot_discussions_paging' );
    if ( $paging_option === 'None' ) {
      $frontSystem['paging'] = 0; // No pagination
    }
    else {
      $frontSystem['paging'] = is_numeric( $paging_option ) ? intval( $paging_option ) : 10; // Default to 10
    }

    // Get metadata settings
    $frontSystem['metadata'] = [
      'enabled' => $this->core->get_option( 'chatbot_discussions_metadata_enabled' ),
      'startDate' => $this->core->get_option( 'chatbot_discussions_metadata_start_date' ),
      'lastUpdate' => $this->core->get_option( 'chatbot_discussions_metadata_last_update' ),
      'messageCount' => $this->core->get_option( 'chatbot_discussions_metadata_message_count' )
    ];

    // Clean Params
    $frontParams = $this->clean_params( $frontParams );
    $frontSystem = $this->clean_params( $frontSystem );
    $serverParams = $this->clean_params( $serverParams );

    $theme = isset( $frontParams['themeId'] ) ? $this->core->get_theme( $frontParams['themeId'] ) : null;
    $jsonFrontParams = htmlspecialchars( json_encode( $frontParams ), ENT_QUOTES, 'UTF-8' );
    $jsonFrontSystem = htmlspecialchars( json_encode( $frontSystem ), ENT_QUOTES, 'UTF-8' );
    $jsonFrontTheme = htmlspecialchars( json_encode( $theme ), ENT_QUOTES, 'UTF-8' );

    return "<div class='mwai-discussions-container' data-params='{$jsonFrontParams}' data-system='{$jsonFrontSystem}' data-theme='{$jsonFrontTheme}'></div>";
  }

  public function clean_params( &$params ) {
    foreach ( $params as $param => $value ) {
      if ( $param === 'restNonce' ) {
        continue;
      }
      // Skip only if value is null or an array - but not if it's false or 0
      if ( is_null( $value ) || is_array( $value ) ) {
        continue;
      }
      // Handle empty strings
      if ( $value === '' ) {
        continue;
      }
      $lowerCaseValue = is_string( $value ) ? strtolower( $value ) : '';
      if ( $lowerCaseValue === 'true' || $lowerCaseValue === 'false' || is_bool( $value ) ) {
        $params[$param] = filter_var( $value, FILTER_VALIDATE_BOOLEAN );
      }
      else if ( is_numeric( $value ) ) {
        $params[$param] = filter_var( $value, FILTER_VALIDATE_FLOAT );
      }
    }
    return $params;
  }

}
