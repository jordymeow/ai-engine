<?php

class Meow_MWAI_Modules_Editor_Assistant {
  protected $core = null;
  protected $botId = 'mwai_assistant';
  protected $namespace = 'mwai-ui/v1';

  public function __construct( $core ) {
    $this->core = $core;
    add_filter( 'mwai_internal_chatbot', [ $this, 'get_internal_chatbot' ], 10, 3 );
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
    add_action( 'admin_head', [ $this, 'admin_head' ] );
    add_action( 'admin_footer', [ $this, 'admin_footer' ] );
  }

  public function admin_head() {
    ?>
    <style id="mwai-editor-assistant-base">
      html.mwai-assistant-active {
        transition: margin-top 0.3s ease !important;
      }
      html.mwai-assistant-active .interface-interface-skeleton {
        transition: top 0.3s ease, left 0.3s ease, right 0.3s ease,
          bottom 0.3s ease, border-radius 0.3s ease, filter 0.3s ease !important;
      }
      html.mwai-assistant-active #wpadminbar,
      html.mwai-assistant-active #adminmenuwrap,
      html.mwai-assistant-active #adminmenuback {
        transition: transform 0.3s ease, opacity 0.3s ease !important;
      }
      html.mwai-assistant-active #wpcontent,
      html.mwai-assistant-active #wpfooter {
        transition: margin-left 0.3s ease !important;
      }
      html.mwai-assistant-open {
        margin-top: 0 !important;
        background: #f0f0f1 !important;
      }
      html.mwai-assistant-open body {
        background: transparent !important;
      }
      html.mwai-assistant-open #wpadminbar {
        transform: translateY(-100%);
        opacity: 0;
        pointer-events: none;
      }
      html.mwai-assistant-open #adminmenuwrap,
      html.mwai-assistant-open #adminmenuback {
        transform: translateX(-100%);
        opacity: 0;
        pointer-events: none;
      }
      html.mwai-assistant-open #wpcontent,
      html.mwai-assistant-open #wpfooter {
        margin-left: 0 !important;
      }
      html.mwai-assistant-open .interface-interface-skeleton {
        position: fixed !important;
        top: 15px !important;
        left: 15px !important;
        right: 410px !important;
        bottom: 15px !important;
        border-radius: 12px !important;
        overflow: hidden !important;
        filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.15)) !important;
      }
      html.mwai-assistant-busy .interface-interface-skeleton {
        pointer-events: none !important;
        opacity: 0.6 !important;
      }
    </style>
    <?php
  }

  public function admin_footer() {
    echo '<div id="mwai-editor-assistant-root"></div>';
  }

  public function rest_api_init() {
    register_rest_route( $this->namespace, '/editor/submit', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_submit' ],
      'permission_callback' => [ $this->core, 'check_rest_nonce' ],
    ] );
  }

  public function get_internal_chatbot( $chatbot, $botId, $params ) {
    if ( $botId !== $this->botId ) {
      return $chatbot;
    }
    $envId = $params['envId'] ?? null;
    return [
      'botId' => $this->botId,
      'name' => 'AI Assistant',
      'mode' => 'chat',
      'scope' => 'editor-assistant',
      'envId' => $envId,
      'instructions' => '',
      'textInputMaxLength' => 16384,
      'startSentence' => '',
      'contentAware' => false,
    ];
  }

  protected function create_response( $data, $status = 200 ) {
    $current_nonce = $this->core->get_nonce( true );
    $request_nonce = isset( $_SERVER['HTTP_X_WP_NONCE'] ) ? $_SERVER['HTTP_X_WP_NONCE'] : null;
    $should_refresh = false;
    if ( $request_nonce ) {
      $verify = wp_verify_nonce( $request_nonce, 'wp_rest' );
      if ( $verify === 2 ) {
        $should_refresh = true;
      }
    }
    if ( $should_refresh || ( $request_nonce && $current_nonce !== $request_nonce ) ) {
      $data['new_token'] = $current_nonce;
    }
    return new WP_REST_Response( $data, $status );
  }

  protected function build_response( $reply ) {
    return [
      'success' => true,
      'reply' => $reply->result,
      'actions' => [],
      'feedbackId' => null,
      'usage' => $reply->usage,
    ];
  }

  public function rest_submit( $request ) {
    try {
      $params = $request->get_json_params();
      $newMessage = trim( $params['newMessage'] ?? '' );
      $instructions = $params['instructions'] ?? '';
      $messages = $params['messages'] ?? [];
      $envId = $params['envId'] ?? null;
      $model = $params['model'] ?? null;
      $chatId = $params['chatId'] ?? null;

      if ( empty( $newMessage ) ) {
        return $this->create_response( [ 'success' => false, 'message' => 'Empty message.' ], 400 );
      }

      $query = new Meow_MWAI_Query_Text( $newMessage, 4096 );
      $queryParams = [
        'botId' => $this->botId,
        'scope' => 'editor-assistant',
        'instructions' => $instructions,
        'messages' => $messages,
      ];
      if ( $envId ) {
        $queryParams['envId'] = $envId;
      }
      if ( $model ) {
        $queryParams['model'] = $model;
      }
      if ( $chatId ) {
        $queryParams['chatId'] = $chatId;
      }
      $query->inject_params( $queryParams );
      $query = apply_filters( 'mwai_chatbot_query', $query, $queryParams );

      Meow_MWAI_Logging::log( "Editor Assistant: Submitting query: \"{$newMessage}\"" );
      $reply = $this->core->run_query( $query );

      return $this->create_response( $this->build_response( $reply ) );
    }
    catch ( Exception $e ) {
      Meow_MWAI_Logging::error( 'Editor Assistant: ' . $e->getMessage() );
      return $this->create_response( [
        'success' => false,
        'message' => apply_filters( 'mwai_ai_exception', $e->getMessage() ),
      ], 500 );
    }
  }
}
