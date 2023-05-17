<?php

class Meow_MWAI_Modules_Discussions {
  private $wpdb = null;
  private $core = null;
  private $table_chats = null;
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
			$offset = $params['offset'];
			$limit = $params['limit'];
			$filters = [ [ 'accessor' => 'user', 'value' => get_current_user_id() ] ];
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
          if ( empty( $value ) ) {
            continue;
          }
          $isIP = filter_var( $value, FILTER_VALIDATE_IP );
          if ( $isIP ) {
            $where[] = "extra LIKE '%\"ip\":\"{$value}\"%'";
          }
          else {
            $where[] = "extra LIKE '%\"userId\":{$value}%'";
          }
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

  function chatbot_reply( $rawText, $query, $params, $extra ) {
    global $mwai_core;
    $userIp = $mwai_core->get_ip_address();
    $userId = $mwai_core->get_user_id();
    $chatClientId = isset( $params['clientId'] ) ? $params['clientId'] : $query->session;
    $ssChatId = hash( 'sha256', $userIp . $userId . $chatClientId );
    $this->check_db();
    $chat = $this->wpdb->get_row( $this->wpdb->prepare( "SELECT * FROM $this->table_chats WHERE chatId = %s", $ssChatId ) );
    $extra = [
      'embeddings' => isset( $extra['embeddings'] ) ? $extra['embeddings'] : null
    ];
    if ( $chat ) {
      $chat->messages = json_decode( $chat->messages );
      $chat->messages[] = [
        'type' => 'user',
        'text' => $params['newMessage']
      ];
      $chat->messages[] = [
        'type' => 'ai',
        'text' => $rawText,
        'extra' => $extra
      ];
      $chat->messages = json_encode( $chat->messages );
      $this->wpdb->update( $this->table_chats, [ 
        'messages' => $chat->messages,
        'updated' => date( 'Y-m-d H:i:s' )
       ], [ 'id' => $chat->id ] );
    }
    else {
      $chat = [
        'chatId' => $ssChatId,
        'messages' => json_encode( [
          [
            'type' => 'user',
            'text' => $params['newMessage']
          ],
          [
            'type' => 'ai',
            'text' => $rawText,
            'extra' => $extra
          ]
        ] ),
        'extra' => json_encode( [
          'ip' => $userIp,
          'userId' => $userId,
          'session' => $query->session,
          'model' => $query->model,
          'temperature' => $query->temperature
        ] ),
        'created' => date( 'Y-m-d H:i:s' ),
        'updated' => date( 'Y-m-d H:i:s' )
      ];
      $this->wpdb->insert( $this->table_chats, $chat );
    }
    return $rawText;
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
    return $this->db_check;
  }

  function create_db() {
    $charset_collate = $this->wpdb->get_charset_collate();
    $sqlLogs = "CREATE TABLE $this->table_chats (
      id BIGINT(20) NOT NULL AUTO_INCREMENT,
      chatId VARCHAR(64) NOT NULL NULL,
      messages TEXT NOT NULL NULL,
      extra TEXT NOT NULL NULL,
      created DATETIME NOT NULL,
      updated DATETIME NOT NULL,
      PRIMARY KEY  (id),
      INDEX chatId (chatId)
    ) $charset_collate;";
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sqlLogs );
  }

}