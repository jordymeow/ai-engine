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
    global $mwai_core;
    $this->core = $mwai_core;
    $this->wpdb = $wpdb;
    $this->table_chats = $wpdb->prefix . 'mwai_chats';

    if ( $this->core->get_option( 'shortcode_chat_discussions' ) ) {
      add_filter( 'mwai_chatbot_reply', [ $this, 'chatbot_reply' ], 10, 4 );
      add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
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
      'callback' => [ $this, 'rest_discussions_delete' ],
      'permission_callback' => [ $this->core, 'can_access_settings' ],
    ] );

    // UI
    register_rest_route( $this->namespace_ui, '/discussions/list', [
			'methods' => 'POST',
			'callback' => [ $this, 'rest_discussions_ui_list' ],
			'permission_callback' => '__return_true'
		] );
	}

  function rest_discussions_list( $request ) {
		try {
			$params = $request->get_json_params();
			$offset = $params['offset'];
			$limit = $params['limit'];
      $filters = $params['filters'];
			$sort = $params['sort'];
			$chats = $this->chats_query( [], $offset, $limit, $filters, $sort );
			return new WP_REST_Response([ 'success' => true, 'total' => $chats['total'], 'chats' => $chats['rows'] ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

  function rest_discussions_ui_list( $request ) {
		try {
			$params = $request->get_json_params();
			$offset = isset( $params['offset'] ) ? $params['offset'] : 0;
			$limit = isset( $params['limit'] ) ? $params['limit'] : 10;
      $botId = isset( $params['botId'] ) ? $params['botId'] : null;
      $customId = isset( $params['customId'] ) ? $params['customId'] : null;

      if ( !is_null( $customId ) ) {
        $botId = $customId;
      }

      if ( is_null( $botId ) ) {
        return new WP_REST_Response([ 'success' => false, 'message' => "Bot ID is required." ], 200 );
      }

      $userId = get_current_user_id();
      if ( !$userId ) {
        return new WP_REST_Response([ 'success' => false, 'message' => "You need to be connected." ], 200 );
      }
			$filters = [ 
        [ 'accessor' => 'user', 'value' => $userId ],
        [ 'accessor' => 'botId', 'value' => $botId ],
      ];
			$chats = $this->chats_query( [], $offset, $limit, $filters );
			return new WP_REST_Response([ 'success' => true, 'total' => $chats['total'], 'chats' => $chats['rows'] ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

  function rest_discussions_delete( $request ) {
    try {
      $params = $request->get_json_params();
      $chatsIds = $params['chatIds'];
      if ( is_array( $chatsIds ) ) {
        if ( count( $chatsIds ) === 0 ) {
          $this->wpdb->query( "TRUNCATE TABLE $this->table_chats" );
        }
        foreach( $chatsIds as $chatId ) {
          $this->wpdb->delete( $this->table_chats, [ 'chatId' => $chatId ] );
        }
      }
      return new WP_REST_Response([ 'success' => true ], 200 );
    }
    catch ( Exception $e ) {
      return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
    }
  }
  
  // Get latest discussion for the given parameter
  function get_discussion( $botId, $chatId ) {
    $this->check_db();
    $chat = $this->wpdb->get_row( $this->wpdb->prepare( "SELECT *
      FROM $this->table_chats
      WHERE chatId = %s AND botId = %s", $chatId, $botId
    ), ARRAY_A );
    if ( $chat ) {
      $chat['messages'] = json_decode( $chat['messages'] );
      return $chat;
    }
    return null;
  }

  function chats_query( $chats = [], $offset = 0, $limit = null, $filters = null, $sort = null ) {
    $this->check_db();
    $offset = !empty( $offset ) ? intval( $offset ) : 0;
    $limit = !empty( $limit ) ? intval( $limit ) : 5;
    $filters = !empty( $filters ) ? $filters : [];
    $sort = !empty( $sort ) ? $sort : [ 'accessor' => 'updated', 'by' => 'desc' ];
    $query = "SELECT * FROM $this->table_chats";

    // Filters
    if ( is_array( $filters ) ) {
      $where = array();
      foreach ( $filters as $filter ) {
        if ( $filter['accessor'] === 'user' ) {
          $value = esc_sql( $filter['value'] );
          if ( is_null( $value ) || $value === '' ) {
            continue;
          }
          $isIP = filter_var( $value, FILTER_VALIDATE_IP );
          if ( $isIP ) {
            $where[] = "ip = '{$value}'";
          }
          else {
            $where[] = "userId = '{$value}'";
          }
        }
        if ( $filter['accessor'] === 'botId' ) {
          $value = esc_sql( $filter['value'] );
          if ( is_null( $value ) || $value === '' ) {
            continue;
          }
          $where[] = "botId = '{$value}'";
        }
        if ( $filter['accessor'] === 'preview' ) {
          $value = $filter['value'];
          if ( empty( $value ) ) {
            continue;
          }
          $where[] = "messages LIKE '%{$value}%'";
        }
      }
      if ( count( $where ) > 0 ) {
        $query .= " WHERE " . implode( " AND ", $where );
      }
    }

    // Count based on this query
    $chats['total'] = $this->wpdb->get_var( "SELECT COUNT(*) FROM ($query) AS t" );

    // Order by
    $query .= " ORDER BY " . esc_sql( $sort['accessor'] ) . " " . esc_sql( $sort['by'] );

    // Limits
    if ( $limit > 0 ) {
      $query .= " LIMIT $offset, $limit";
    }

    $chats['rows'] = $this->wpdb->get_results( $query, ARRAY_A );
    return $chats;
  }

  public function chatbot_reply( $rawText, $query, $params, $extra ) {
    global $mwai_core;
    $userIp = $mwai_core->get_ip_address();
    $userId = $mwai_core->get_user_id();
    $botId = isset( $params['botId'] ) ? $params['botId'] : null;
    $chatId = isset( $params['chatId'] ) ? $params['chatId'] : $query->session;
    $customId = isset( $params['customId'] ) ? $params['customId'] : null;
    $threadId = $query instanceof Meow_MWAI_Query_Assistant ? $query->threadId : null;
    $storeId = $query instanceof Meow_MWAI_Query_Assistant ? $query->storeId : null;
    $now = date( 'Y-m-d H:i:s' );

    if ( !empty( $customId ) ) {
      $botId = $customId;
    }
    $newMessage = isset( $params['newMessage'] ) ? $params['newMessage'] : $query->get_message();

    // If there is a file for "Vision", add it to the message
    if ( isset( $query->filePurpose ) && $query->filePurpose === 'vision' && isset( $query->file ) ) {
      $newMessage = "![Uploaded Image]({$query->file})\n" . $newMessage;
    }

    //$chatId = hash( 'sha256', $userIp . $userId . $clientChatId );
    $this->check_db();
    $chat = $this->wpdb->get_row( $this->wpdb->prepare( "SELECT *
      FROM $this->table_chats
      WHERE chatId = %s", $chatId
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
    if ( $query instanceof Meow_MWAI_Query_Assistant ) {
      $chatExtra['assistantId'] = $query->assistantId;
      $chatExtra['threadId'] = $query->threadId;
      $chatExtra['storeId'] = $query->storeId;
    }
    if ( $chat ) {
      $chat->messages = json_decode( $chat->messages );
      $chat->messages[] = [ 'role' => 'user', 'content' => $newMessage ];
      $chat->messages[] = [ 'role' => 'assistant', 'content' => $rawText, 'extra' => $messageExtra ];
      $chat->messages = json_encode( $chat->messages );
      $this->wpdb->update( $this->table_chats, [ 
        'userId' => $userId,
        'messages' => $chat->messages,
        'updated' => $now
       ], [ 'id' => $chat->id ] );
    }
    else {
      $chat = [
        'userId' => $userId,
        'ip' => $userIp,
        'messages' => json_encode( [ 
          [ 'role' => 'user', 'content' => $newMessage ],
          [ 'role' => 'assistant', 'content' => $rawText, 'extra' => $messageExtra ]
        ] ),
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

  function format_messages( $json, $format = 'html' ) {
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

  function check_db() {
    if ( $this->db_check ) {
      return true;
    }
    $this->db_check = !( strtolower( 
      $this->wpdb->get_var( "SHOW TABLES LIKE '$this->table_chats'" ) ) != strtolower( $this->table_chats )
    );
    if ( !$this->db_check ) {
      $this->create_db();
      $this->db_check = !( strtolower( 
        $this->wpdb->get_var( "SHOW TABLES LIKE '$this->table_chats'" ) ) != strtolower( $this->table_chats )
      );
    }

    // LATER: REMOVE THIS AFTER SEPTEMBER 2023
    // Make sure the column "userId" and "ip "exist in the $this->table_chats table
    $this->db_check = $this->db_check && $this->wpdb->get_var( "SHOW COLUMNS FROM $this->table_chats LIKE 'userId'" );
    if ( !$this->db_check ) {
      $this->wpdb->query( "ALTER TABLE $this->table_chats ADD COLUMN userId BIGINT(20) NULL" );
      $this->wpdb->query( "ALTER TABLE $this->table_chats ADD COLUMN ip VARCHAR(64) NULL" );
      $this->wpdb->query( "ALTER TABLE $this->table_chats ADD COLUMN botId VARCHAR(64) NULL" );
      $this->db_check = true;
    }

    // LATER: REMOVE THIS AFTER JANUARY 2024
    $this->db_check = $this->db_check && $this->wpdb->get_var( "SHOW COLUMNS FROM $this->table_chats LIKE 'threadId'" );
    if ( !$this->db_check ) {
      $this->wpdb->query( "ALTER TABLE $this->table_chats ADD COLUMN threadId VARCHAR(64) NULL" );
      $this->db_check = true;
    }

    // LATER: REMOVE THIS AFTER SEPTEMBER 2024
    $this->db_check = $this->db_check && $this->wpdb->get_var( "SHOW COLUMNS FROM $this->table_chats LIKE 'storeId'" );
    if ( !$this->db_check ) {
      $this->wpdb->query( "ALTER TABLE $this->table_chats ADD COLUMN storeId VARCHAR(64) NULL" );
      $this->db_check = true;
    }

    // LATER: REMOVE THIS AFTER SEPTEMBER 2024
    $this->db_check = $this->db_check && $this->wpdb->get_var( "SHOW COLUMNS FROM $this->table_chats LIKE 'extra'" );
    if ( $this->db_check ) {
      $column = $this->wpdb->get_row( "SHOW COLUMNS FROM $this->table_chats WHERE Field = 'extra'" );
      if ( $column->Type === 'text' ) {
        $this->wpdb->query( "ALTER TABLE $this->table_chats MODIFY COLUMN extra LONGTEXT" );
      }
    }

    return $this->db_check;
  }

  function create_db() {
    $charset_collate = $this->wpdb->get_charset_collate();
    $sqlLogs = "CREATE TABLE $this->table_chats (
      id BIGINT(20) NOT NULL AUTO_INCREMENT,
      userId BIGINT(20) NULL,
      ip VARCHAR(64) NULL,
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