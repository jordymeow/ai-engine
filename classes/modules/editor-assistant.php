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

  /**
  * Who may use the Assistant: exactly who the panel is shipped to.
  *
  * Meow_MWAI_Admin enqueues the admin bundle when can_access_features() OR
  * can_access_settings() passes, and this pair has to mirror that, or a user gets a
  * panel that answers 403. can_access_features() tests the role names 'editor' and
  * 'administrator', so on its own it misses admin-equivalent accounts under another
  * role name, which membership and security plugins create routinely. Those hold
  * manage_options, well above what this feature needs. Sites that widened access with
  * the mwai_allow_usage filter keep working, since can_access_features() applies it.
  */
  public function can_use_assistant() {
    return $this->core->can_access_features() || $this->core->can_access_settings();
  }

  public function rest_api_init() {
    // A capability, not just a nonce. check_rest_nonce() is a bare wp_verify_nonce(), and
    // /start_session is a public endpoint that hands a valid wp_rest nonce to anonymous
    // visitors, so a nonce alone proved nothing about who was calling. This route accepts
    // instructions, model and envId by design (the panel owns its system prompt and has
    // env/model pickers), which made it an unauthenticated way to spend the site owner's
    // provider account.
    register_rest_route( $this->namespace, '/editor/submit', [
      'methods' => 'POST',
      'callback' => [ $this, 'rest_submit' ],
      'permission_callback' => [ $this, 'can_use_assistant' ],
    ] );
  }

  public function get_internal_chatbot( $chatbot, $botId, $params ) {
    if ( $botId !== $this->botId ) {
      return $chatbot;
    }
    // Reachable from the public chats/submit endpoint too, via the reserved "mwai_"
    // botId prefix, which is nonce-only by design. Gate it like the Workspace does with
    // its own internal bot: nothing in the shipped UI ever asks chats/submit for this
    // bot, the panel calls editor/submit directly.
    if ( !$this->can_use_assistant() ) {
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

  // Thinking counts against Max Tokens: with the old fixed 4096, Claude thought through a long
  // post, ran out, and the assistant showed an empty or half-finished reply (Peter Deegan,
  // 2026-11). Use what the model allows, up to a ceiling that keeps a runaway reply affordable.
  private const MAX_TOKENS = 16384;

  private function max_tokens_for( $query ) {
    try {
      $this->core->validate_env_model( $query );
      $engine = Meow_MWAI_Engines_Factory::get( $this->core, $query->envId );
      $info = $engine ? $engine->retrieve_model_info( $query->model ) : null;
      $limit = (int) ( $info['maxCompletionTokens'] ?? 0 );
      return $limit > 4096 ? min( self::MAX_TOKENS, $limit ) : 4096;
    }
    catch ( Throwable $e ) {
      return 4096;
    }
  }

  protected function build_response( $reply ) {
    return [
      'success' => true,
      'reply' => $reply->result . Meow_MWAI_Core::get_truncated_notice( $reply, 'assistant' ),
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
      $query->set_max_tokens( $this->max_tokens_for( $query ) );
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
