<?php

class Meow_MWAI_Modules_Chatbot_Logs {

  public function __construct() {
    add_filter( 'mwai_chatbot_reply', function ( $reply, $query, $params ) {
      try {
        global $mwai_core;
        $rawInput = !empty( $params['rawInput'] ) ? $params['rawInput'] : $query->prompt;

        // We need to identify the user or session
        $id = $mwai_core->get_user_id();
        if ( empty( $id ) ) {
          $id = $mwai_core->get_ip_address();
          if ( empty( $id ) ) {
            $id = 'RANDOM-' . uniqid();
          }
          else {
            $id = 'IP-' . $id;
          }
        }
        else {
          $id = 'USER-' . $id;
        }

        // Create or Update Logs
        $upload_dir = wp_upload_dir();
        $date = date( 'Y-m-d' );
        $chatbot_logs_dir = $upload_dir['basedir'] . '/chatbot';
        $file = $chatbot_logs_dir . '/' . $date . '-' . $id . '.txt';
        if ( !file_exists( $chatbot_logs_dir ) ) {
          mkdir( $chatbot_logs_dir, 0777, true );
        }
        $content = @file_get_contents( $file );
        $content .= "USER: " . $rawInput . "\n";
        $content .= "AI: " . $reply . "\n";
        file_put_contents( $file, $content );
      }
      catch ( Exception $e ) {
        error_log( $e->getMessage() );
      }
      return $reply;
    }, 10, 3 );
  }
}
