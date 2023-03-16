<?php

class Meow_MWAI_Modules_Chatbot_Chats {
  private $wpdb = null;
  private $table_chats = null;
  private $db_check = false;

  public function __construct() {
    global $wpdb;
    $this->wpdb = $wpdb;
    $this->table_chats = $wpdb->prefix . 'mwai_chats';
    add_filter( 'mwai_chatbot_reply', [ $this, 'chatbot_reply' ], 10, 3 );
  }

  function chatbot_reply( $rawText, $query, $params ) {
    global $mwai_core;
    $userIp = $mwai_core->get_ip_address();
    $userId = $mwai_core->get_user_id();
    $chatClientId = isset( $params['clientId'] ) ? $params['clientId'] : $query->session;
    $ssChatId = hash( 'sha256', $userIp . $userId . $chatClientId );
    $this->check_db();
    $chat = $this->wpdb->get_row( $this->wpdb->prepare( "SELECT * FROM $this->table_chats WHERE chatId = %s", $ssChatId ) );
    if ( $chat ) {
      $chat->messages = json_decode( $chat->messages );
      $chat->messages[] = [
        'type' => 'user',
        'text' => $params['rawInput']
      ];
      $chat->messages[] = [
        'type' => 'ai',
        'text' => $rawText
      ];
      $chat->messages = json_encode( $chat->messages );
      $chat->updated = wp_date( 'Y-m-d H:i:s' );
      $this->wpdb->update( $this->table_chats, (array) $chat, [ 'id' => $chat->id ] );
    }
    else {
      $chat = [
        'chatId' => $ssChatId,
        'messages' => json_encode( [
          [
            'type' => 'user',
            'text' => $params['rawInput']
          ],
          [
            'type' => 'ai',
            'text' => $rawText
          ]
        ] ),
        'extra' => json_encode( [
          'ip' => $userIp,
          'userId' => $userId,
          'session' => $query->session,
          'model' => $query->model,
          'temperature' => $query->temperature
        ] )
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
      created DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updated DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
      PRIMARY KEY  (id)
    ) $charset_collate;";
    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta( $sqlLogs );
  }

}