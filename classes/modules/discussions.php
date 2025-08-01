<?php

class Meow_MWAI_Modules_Discussions {
  private $wpdb = null;
  private $core = null;
  public $table_chats = null;
  private $db_check = false;
  private $namespace_admin = 'mwai/v1';
  private $namespace_ui = 'mwai-ui/v1';

  public function __construct() {
    global $wpdb;
    $this->wpdb = $wpdb;
    global $mwai_core;
    $this->core = $mwai_core;
    $this->table_chats = $wpdb->prefix . 'mwai_chats';

    if ( $this->core->get_option( 'chatbot_discussions' ) ) {
      add_filter( 'mwai_chatbot_reply', [ $this, 'chatbot_reply' ], 10, 4 );
      add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );

      if ( !wp_next_scheduled( 'mwai_discussions' ) ) {
        wp_schedule_event( time(), 'hourly', 'mwai_discussions' );
      }
      add_action( 'mwai_discussions', [ $this, 'cron_discussions' ] );
    }
  }

  public function rest_api_init() {
    // Admin
    register_rest_route( $this->namespace_admin, '/discussions/list', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_discussions_list' ],
      'permission_callback' => [ $this->core, 'can_access_settings' ],
    ] );
    register_rest_route( $this->namespace_admin, '/discussions/delete', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_discussions_delete_admin' ],
      'permission_callback' => [ $this->core, 'can_access_settings' ],
    ] );

    // UI
    register_rest_route( $this->namespace_ui, '/discussions/list', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_discussions_ui_list' ],
      'permission_callback' => '__return_true'
    ] );
    register_rest_route( $this->namespace_ui, '/discussions/edit', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_discussions_ui_edit' ],
      'permission_callback' => '__return_true'
    ] );
    register_rest_route( $this->namespace_ui, '/discussions/delete', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_discussions_delete' ],
      'permission_callback' => [ $this, 'can_delete_discussion' ],
    ] );
  }

  public function can_delete_discussion( $request ) {
    $params = $request->get_json_params();
    $chatIds = isset( $params['chatIds'] ) ? $params['chatIds'] : null;
    $userId = get_current_user_id();
    if ( !$userId ) {
      return false;
    }
    foreach ( $chatIds as $chatId ) {
      $chat = $this->wpdb->get_row(
        $this->wpdb->prepare(
          "SELECT * FROM $this->table_chats WHERE chatId = %s",
          $chatId
        )
      );
      if ( !$chat || (int) $chat->userId !== (int) $userId ) {
        return false;
      }
    }
    return true;
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

  /**
  * Generate or update the title for a specific discussion
  * by calling the AI (if it meets the requirements).
  *
  * @param stdClass $discussion A row from the DB (object form).
  * @return void
  */
  private function generate_title_for_discussion( $discussion ) {
    // Check if there's already a title
    if ( !empty( $discussion->title ) ) {
      return; // Nothing to do if title is already set.
    }

    // Ensure it's not older than 10 days, or whatever logic you prefer
    $ten_days_ago = strtotime( '-10 days' );
    if ( strtotime( $discussion->updated ) < $ten_days_ago ) {
      return; // Skip if older than 10 days
    }

    // We expect JSON in the messages
    $messages = json_decode( $discussion->messages, true );
    if ( !is_array( $messages ) ) {
      return;
    }

    // Check for at least one user and one assistant message
    $has_user_message = false;
    $has_assistant_message = false;
    foreach ( $messages as $message ) {
      if ( isset( $message['role'] ) ) {
        if ( $message['role'] === 'user' ) {
          $has_user_message = true;
        }
        if ( $message['role'] === 'assistant' ) {
          $has_assistant_message = true;
        }
      }
      if ( $has_user_message && $has_assistant_message ) {
        break;
      }
    }

    if ( !( $has_user_message && $has_assistant_message ) ) {
      return; // If doesn't have both, skip
    }

    // Prepare the conversation text for the prompt
    $conversation_text = '';
    foreach ( $messages as $message ) {
      if ( isset( $message['role'] ) && isset( $message['content'] ) ) {
        $role = ucfirst( $message['role'] );
        $content = $message['content'];
        $conversation_text .= "$role: $content\n";
      }
    }

    $base_prompt = "Based on the following conversation, generate a concise and specific title for the discussion, strictly less than 64 characters. Focus on the main topic, avoiding unnecessary words such as articles, pronouns, or adjectives. Do not include any punctuation at the end. Do not include anything else than the title itself, only one sentence, no line breaks, just the title.\n\nConversation:\n$conversation_text\n";
    $prompt = apply_filters( 'mwai_discussions_title_prompt', $base_prompt, $conversation_text, $discussion );

    // Run the AI query using the fast environment
    global $mwai;
    $params = [ 'scope' => 'discussions' ];
    
    // Use simpleFastTextQuery which handles Fast Model configuration
    try {
      $answer = $mwai->simpleFastTextQuery( $prompt, $params );
      
      // Clean up the answer
      $title = trim( $answer );
      $title = rtrim( $title, '.!?:;,—–-–' ); // Remove trailing punctuation
      $title = substr( $title, 0, 64 ); // Ensure less than 64 characters
      if ( empty( $title ) ) {
        $title = 'Untitled';
      }
    } catch ( Exception $e ) {
      // Handle content filter or other API errors
      $error_message = $e->getMessage();
      if ( strpos( $error_message, 'content_filter' ) !== false || 
           strpos( $error_message, 'ResponsibleAIPolicyViolation' ) !== false ) {
        error_log( "AI Engine: Content filter blocked title generation for discussion ID {$discussion->id}. Using fallback title." );
        $title = 'Discussion ' . date( 'Y-m-d H:i' );
      } else {
        error_log( "AI Engine: Failed to generate title for discussion ID {$discussion->id}: " . $error_message );
        $title = 'Untitled';
      }
    }

    // Update the discussion with the title
    $updated = $this->wpdb->update(
      $this->table_chats,
      [ 'title' => $title ],
      [ 'id' => $discussion->id ]
    );
    if ( $updated === false ) {
      error_log( "Failed to update the title for discussion ID {$discussion->id}" );
    }
  }

  /**
  * Admin route for listing discussions. No forced logic here.
  */
  public function rest_discussions_list( $request ) {
    try {
      $params = $request->get_json_params();
      $offset = $params['offset'];
      $limit = $params['limit'];
      $filters = $params['filters'];
      $sort = $params['sort'];

      // Retrieve the chats
      $chats = $this->chats_query( [], $offset, $limit, $filters, $sort );

      return $this->create_rest_response( [ 'success' => true, 'total' => $chats['total'], 'chats' => $chats['rows'] ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_discussions_ui_edit( $request ) {
    try {
      $params = $request->get_json_params();
      $chatId = isset( $params['chatId'] ) ? sanitize_text_field( $params['chatId'] ) : null;
      $title = isset( $params['title'] ) ? sanitize_text_field( $params['title'] ) : null;

      if ( is_null( $chatId ) || is_null( $title ) ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'chatId and title are required.' ], 400 );
      }

      $userId = get_current_user_id();
      if ( !$userId ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'You need to be logged in.' ], 401 );
      }

      // Update the discussion title for the current user
      $updated = $this->wpdb->update(
        $this->table_chats,
        [ 'title' => $title ],
        [ 'chatId' => $chatId, 'userId' => $userId ]
      );
      if ( $updated === false ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Failed to update the discussion.' ], 500 );
      }

      return $this->create_rest_response( [ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function cron_discussions() {
    $this->check_db();

    // NEW CHECK: Only run if auto-titling is enabled
    if ( !$this->core->get_option( 'chatbot_discussions_titling' ) ) {
      return;
    }
    // END NEW CHECK

    // Set the current user to the first admin to avoid guest limits
    $admin_users = get_users( array( 'role' => 'administrator', 'number' => 1 ) );
    if ( ! empty( $admin_users ) ) {
      $admin_user = $admin_users[0];
      wp_set_current_user( $admin_user->ID );
    }

    $now = date( 'Y-m-d H:i:s' );
    $ten_days_ago = date( 'Y-m-d H:i:s', strtotime( '-10 days' ) );

    // Get 5 latest discussions, not older than 10 days, which have no 'title' yet
    $query = $this->wpdb->prepare(
      "SELECT * FROM {$this->table_chats}
                                                                                                                                                                                  WHERE title IS NULL AND updated >= %s
                                                                                                                                                                                  ORDER BY updated DESC LIMIT 5",
      $ten_days_ago
    );
    $discussions = $this->wpdb->get_results( $query );
    if ( empty( $discussions ) ) {
      return;
    }

    foreach ( $discussions as $discussion ) {
      $this->generate_title_for_discussion( $discussion );
    }
  }

  /**
  * UI route for listing discussions.
  * Here we add the "forced cron" logic for up to 5 discussions,
  * but only if auto-titling is enabled.
  */
  public function rest_discussions_ui_list( $request ) {
    try {
      $params = $request->get_json_params();
      $offset = isset( $params['offset'] ) ? $params['offset'] : 0;
      // Get paging setting from options
      $paging_option = $this->core->get_option( 'chatbot_discussions_paging' );
      if ( $paging_option === 'None' ) {
        $default_limit = 999; // Show all discussions
      }
      else {
        $default_limit = is_numeric( $paging_option ) ? intval( $paging_option ) : 10; // Fallback to 10
      }
      $limit = isset( $params['limit'] ) ? $params['limit'] : $default_limit;
      $botId = isset( $params['botId'] ) ? $params['botId'] : null;
      $customId = isset( $params['customId'] ) ? $params['customId'] : null;

      if ( !is_null( $customId ) ) {
        $botId = $customId;
      }
      if ( is_null( $botId ) ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'Bot ID is required.' ], 200 );
      }

      $userId = get_current_user_id();
      if ( !$userId ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'You need to be connected.' ], 200 );
      }

      $filters = [
        [ 'accessor' => 'user',  'value' => $userId ],
        [ 'accessor' => 'botId', 'value' => $botId ],
      ];

      // Retrieve the chats
      $chats = $this->chats_query( [], $offset, $limit, $filters );

      // NEW CHECK: only do forced titling if it's enabled
      if ( $this->core->get_option( 'chatbot_discussions_titling' ) ) {
        // "Forced cron" logic: check up to 5 that have no title
        $counter = 0;
        foreach ( $chats['rows'] as &$chatRow ) {
          if ( $counter >= 5 ) {
            break;
          }
          if ( empty( $chatRow['title'] ) && strtotime( $chatRow['updated'] ) >= strtotime( '-10 days' ) ) {
            $discussionObj = (object) $chatRow;
            $this->generate_title_for_discussion( $discussionObj );
            $counter++;
          }
        }
        // If you want the newly-updated titles to show up *immediately*:
        $chats = $this->chats_query( [], $offset, $limit, $filters );
      }
      // END NEW CHECK

      // Apply filters to discussion metadata
      foreach ( $chats['rows'] as &$chatRow ) {
        // Decode messages JSON to get the count
        $messages = json_decode( $chatRow['messages'], true );
        $message_count = is_array( $messages ) ? count( $messages ) : 0;
        
        // Add formatted metadata that can be filtered
        $chatRow['metadata_display'] = [
          'start_date' => apply_filters( 'mwai_discussion_metadata_start_date', $this->core->format_discussion_date( $chatRow['created'] ), $chatRow ),
          'last_update' => apply_filters( 'mwai_discussion_metadata_last_update', $this->core->format_discussion_date( $chatRow['updated'] ), $chatRow ),
          'message_count' => apply_filters( 'mwai_discussion_metadata_message_count', $message_count, $chatRow )
        ];
      }

      return $this->create_rest_response( [ 'success' => true, 'total' => $chats['total'], 'chats' => $chats['rows'] ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_discussions_delete_admin( $request ) {
    try {
      $params = $request->get_json_params();
      $chatsIds = $params['chatIds'];
      if ( is_array( $chatsIds ) ) {
        if ( count( $chatsIds ) === 0 ) {
          $this->wpdb->query( "TRUNCATE TABLE $this->table_chats" );
        }
        foreach ( $chatsIds as $chatId ) {
          $this->wpdb->delete( $this->table_chats, [ 'chatId' => $chatId ] );
        }
      }
      return $this->create_rest_response( [ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  public function rest_discussions_delete( $request ) {
    try {
      $params = $request->get_json_params();
      $chatIds = isset( $params['chatIds'] ) ? $params['chatIds'] : null;

      if ( !is_array( $chatIds ) || empty( $chatIds ) ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'chatIds is required.' ], 400 );
      }

      $userId = get_current_user_id();
      if ( !$userId ) {
        return $this->create_rest_response( [ 'success' => false, 'message' => 'You need to be logged in.' ], 401 );
      }

      foreach ( $chatIds as $chatId ) {
        $this->wpdb->delete( $this->table_chats, [ 'chatId' => $chatId, 'userId' => $userId ] );
      }

      return $this->create_rest_response( [ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      return $this->create_rest_response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }

  // Get latest discussion for the given parameter
  public function get_discussion( $botId, $chatId ) {
    $this->check_db();
    $chat = $this->wpdb->get_row(
      $this->wpdb->prepare(
        "SELECT * FROM $this->table_chats WHERE chatId = %s AND botId = %s",
        $chatId,
        $botId
      ),
      ARRAY_A
    );
    if ( $chat ) {
      $chat['messages'] = json_decode( $chat['messages'] );
      return $chat;
    }
    return null;
  }

  public function chats_query( $chats = [], $offset = 0, $limit = null, $filters = null, $sort = null ) {
    $this->check_db();
    $offset = !empty( $offset ) ? intval( $offset ) : 0;
    $limit = !empty( $limit ) ? intval( $limit ) : 5;
    $filters = !empty( $filters ) ? $filters : [];
    $this->core->sanitize_sort( $sort, 'updated', 'DESC' );

    $where_clauses = [];
    $where_values = [];

    if ( is_array( $filters ) ) {
      foreach ( $filters as $filter ) {
        $value = $filter['value'];
        if ( is_null( $value ) || $value === '' ) {
          continue;
        }
        switch ( $filter['accessor'] ) {
          case 'user':
            $isIP = filter_var( $value, FILTER_VALIDATE_IP );
            if ( $isIP ) {
              $where_clauses[] = 'ip = %s';
              $where_values[] = $value;
            }
            else {
              $where_clauses[] = 'userId = %d';
              $where_values[] = intval( $value );
            }
            break;
          case 'botId':
            $where_clauses[] = 'botId = %s';
            $where_values[] = $value;
            break;
          case 'preview':
            $like = '%' . $this->wpdb->esc_like( $value ) . '%';
            $where_clauses[] = 'messages LIKE %s';
            $where_values[] = $like;
            break;
            // Add other cases as needed
        }
      }
    }

    $where_sql = '';
    if ( !empty( $where_clauses ) ) {
      $where_sql = 'WHERE ' . implode( ' AND ', $where_clauses );
    }
    $order_by = 'ORDER BY ' . esc_sql( $sort['accessor'] ) . ' ' . esc_sql( $sort['by'] );

    $limit_sql = '';
    if ( $limit > 0 ) {
      $limit_sql = $this->wpdb->prepare( 'LIMIT %d, %d', $offset, $limit );
    }

    $query = "SELECT * FROM {$this->table_chats} {$where_sql} {$order_by} {$limit_sql}";
    $chats['rows'] = $this->wpdb->get_results( $this->wpdb->prepare( $query, $where_values ), ARRAY_A );

    // Get the total count
    $count_query = "SELECT COUNT(*) FROM {$this->table_chats} {$where_sql}";
    $chats['total'] = $this->wpdb->get_var( $this->wpdb->prepare( $count_query, $where_values ) );

    return $chats;
  }

  public function chatbot_reply( $rawText, $query, $params, $extra ) {
    global $mwai_core;
    $userIp = $mwai_core->get_ip_address();
    $userId = $mwai_core->get_user_id();
    $botId = isset( $params['botId'] ) ? $params['botId'] : null;
    $chatId = $this->core->fix_chat_id( $query, $params );
    $customId = isset( $params['customId'] ) ? $params['customId'] : null;
    $threadId = $query instanceof Meow_MWAI_Query_Assistant ? $query->threadId : null;
    $storeId = $query instanceof Meow_MWAI_Query_Assistant ? $query->storeId : null;
    $now = date( 'Y-m-d H:i:s' );

    if ( !empty( $customId ) ) {
      $botId = $customId;
    }
    $newMessage = isset( $params['newMessage'] ) ? $params['newMessage'] : $query->get_message();

    // If there is a file for "Vision", add it to the message
    if ( isset( $query->attachedFile ) && $query->attachedFile !== null ) {
      $attachedFile = $query->attachedFile;
      if ( $attachedFile->get_purpose() === 'vision' && $attachedFile->get_type() === 'url' ) {
        $newMessage = "![Uploaded Image]({$attachedFile->get_url()})\n" . $newMessage;
      }
    }

    $this->check_db();
    $chat = $this->wpdb->get_row(
      $this->wpdb->prepare(
        "SELECT * FROM $this->table_chats WHERE chatId = %s",
        $chatId
      )
    );
    $messageExtra = [
      'embeddings' => isset( $extra['embeddings'] ) ? $extra['embeddings'] : null
    ];
    $chatExtra = [
      'session' => $query->session,
      'model' => $query->model,
    ];
    if ( !empty( $query->temperature ) ) {
      $chatExtra['temperature'] = $query->temperature;
    }
    if ( !empty( $query->context ) ) {
      $chatExtra['context'] = $query->context;
    }
    if ( !empty( $params['parentBotId'] ) ) {
      $chatExtra['parentBotId'] = $params['parentBotId'];
    }
    if ( $query instanceof Meow_MWAI_Query_Assistant ) {
      $chatExtra['assistantId'] = $query->assistantId;
      $chatExtra['threadId'] = $query->threadId;
      $chatExtra['storeId'] = $query->storeId;
    }

    // Store response ID and date for Responses API
    if ( !empty( $extra['responseId'] ) ) {
      $chatExtra['previousResponseId'] = $extra['responseId'];
      $chatExtra['previousResponseDate'] = $now;
    }

    if ( $chat ) {
      $chat->messages = json_decode( $chat->messages );
      $chat->messages[] = [ 'role' => 'user', 'content' => $newMessage ];
      $chat->messages[] = [ 'role' => 'assistant', 'content' => $rawText, 'extra' => $messageExtra ];
      $chat->messages = json_encode( $chat->messages );

      // Update or merge extra data
      $existingExtra = json_decode( $chat->extra, true ) ?: [];
      $mergedExtra = array_merge( $existingExtra, $chatExtra );

      $this->wpdb->update(
        $this->table_chats,
        [
          'userId' => $userId,
          'messages' => $chat->messages,
          'extra' => json_encode( $mergedExtra ),
          'updated' => $now
        ],
        [ 'id' => $chat->id ]
      );
    }
    else {
      $startSentence = isset( $params['startSentence'] ) ? $params['startSentence'] : null;
      $messages = [];
      if ( !empty( $startSentence ) ) {
        $messages[] = [ 'role' => 'assistant', 'content' => $startSentence ];
      }
      $messages[] = [ 'role' => 'user', 'content' => $newMessage ];
      $messages[] = [ 'role' => 'assistant', 'content' => $rawText, 'extra' => $messageExtra ];
      $chat = [
        'userId' => $userId,
        'ip' => $userIp,
        'messages' => json_encode( $messages ),
        'extra' => json_encode( $chatExtra ),
        'botId' => $botId,
        'chatId' => $chatId,
        'threadId' => $threadId,
        'storeId' => $storeId,
        'created' => $now,
        'updated' => $now
      ];
      $this->wpdb->insert( $this->table_chats, $chat );
    }
    return $rawText;
  }

  public function format_messages( $json, $format = 'html' ) {
    $html = '';
    if ( $format === 'html' ) {
      try {
        $conversation = json_decode( $json, true );
        if ( json_last_error() !== JSON_ERROR_NONE ) {
          return 'Invalid JSON format';
        }
        foreach ( $conversation as $message ) {
          $role = ucfirst( $message['role'] );
          $html .= '<p><strong>' . htmlspecialchars( $role ) . ':</strong> ' . htmlspecialchars( $message['content'] ) . '</p>';
        }
      }
      catch ( Exception $e ) {
        error_log( $e->getMessage() );
        return 'Error while formatting the message';
      }
    }
    $html = apply_filters( 'mwai_discussion_format_messages', $html, $json, $format );
    return $html;
  }

  /**
  * Commits a discussion into the database (create or update if the same chatId is found).
  *
  * @param Meow_MWAI_Discussion $discussionObject
  * @return bool True if success, false if error
  */
  public function commit_discussion( Meow_MWAI_Discussion $discussionObject ): bool {
    $this->check_db();

    // 1. Check if a discussion with the same chatId already exists
    $chat = $this->wpdb->get_row(
      $this->wpdb->prepare(
        "SELECT * FROM {$this->table_chats} WHERE chatId = %s",
        $discussionObject->chatId
      ),
      ARRAY_A
    );

    // 2. Prepare data for DB
    $userIp = $this->core->get_ip_address();
    $userId = $this->core->get_user_id();
    $now = date( 'Y-m-d H:i:s' );

    $data = [
      'userId' => $userId,
      'ip' => $userIp,
      'botId' => $discussionObject->botId,
      'chatId' => $discussionObject->chatId,
      'messages' => !empty( $discussionObject->messages ) ? wp_json_encode( $discussionObject->messages ) : '[]',
      'extra' => !empty( $discussionObject->extra ) ? wp_json_encode( $discussionObject->extra ) : '{}',
      'updated' => $now,
    ];

    // 3. Update if found, otherwise insert a new row
    if ( $chat ) {
      $updateRes = $this->wpdb->update(
        $this->table_chats,
        $data,
        [ 'id' => $chat['id'] ]
      );
      if ( $updateRes === false ) {
        error_log( 'Error updating discussion: ' . $this->wpdb->last_error );
        return false;
      }
    }
    else {
      // For insertion, also set "created"
      $data['created'] = $now;
      $insertRes = $this->wpdb->insert( $this->table_chats, $data );
      if ( $insertRes === false ) {
        error_log( 'Error inserting discussion: ' . $this->wpdb->last_error );
        return false;
      }
    }

    return true;
  }

  public function check_db() {
    if ( $this->db_check ) {
      return true;
    }
    $this->db_check = !(
      strtolower( $this->wpdb->get_var( "SHOW TABLES LIKE '$this->table_chats'" ) )
          != strtolower( $this->table_chats )
    );
    if ( !$this->db_check ) {
      $this->create_db();
      $this->db_check = !(
        strtolower( $this->wpdb->get_var( "SHOW TABLES LIKE '$this->table_chats'" ) )
            != strtolower( $this->table_chats )
      );
    }

    // LATER: REMOVE THIS AFTER MARCH 2025
    // $this->db_check = $this->db_check && $this->wpdb->get_var( "SHOW COLUMNS FROM $this->table_chats LIKE 'title'" );
    // if ( ! $this->db_check ) {
    //   $this->wpdb->query( "ALTER TABLE $this->table_chats ADD COLUMN title VARCHAR(64) NULL" );
    //   $this->db_check = true;
    // }

    // LATER: REMOVE THIS AFTER SEPTEMBER 2025
    // Migrate guest users from userId = 0 to userId = NULL
    $guest_count = $this->wpdb->get_var( "SELECT COUNT(*) FROM $this->table_chats WHERE userId = 0" );
    if ( $guest_count > 0 ) {
      $this->wpdb->query( "UPDATE $this->table_chats SET userId = NULL WHERE userId = 0" );
    }

    return $this->db_check;
  }

  public function create_db() {
    $charset_collate = $this->wpdb->get_charset_collate();
    $sqlLogs = "CREATE TABLE $this->table_chats (
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              id BIGINT(20) NOT NULL AUTO_INCREMENT,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                userId BIGINT(20) NULL,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ip VARCHAR(64) NULL,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    title VARCHAR(64) NULL,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      messages TEXT NOT NULL NULL,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      extra LONGTEXT NOT NULL NULL,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      botId VARCHAR(64) NULL,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        chatId VARCHAR(64) NOT NULL,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          threadId VARCHAR(64) NULL,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            storeId VARCHAR(64) NULL,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              created DATETIME NOT NULL,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              updated DATETIME NOT NULL,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              PRIMARY KEY  (id),
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                INDEX chatId (chatId)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ) $charset_collate;";
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sqlLogs );
  }
}
