<?php

class Meow_MWAI_Modules_GDPR {
  public $core = null;

  public function __construct( $core ) {
    $this->core = $core;
    add_filter( 'mwai_chatbot_blocks', [ $this, 'chatbot_blocks' ], 10, 2 );
  }

  public function chatbot_blocks( $blocks, $args ) {
    $gdpr_text = $this->core->get_option( 'chatbot_gdpr_text' ) ?: 'By using this chatbot, you agree to the recording and processing of your data by our website and the external services it might use (LLMs, vector databases, etc.).';
    $gdpr_button = $this->core->get_option( 'chatbot_gdpr_button' ) ?: '👍 I understand';
    $gdpr_text = esc_html( $gdpr_text );
    $gdpr_button = esc_html( $gdpr_button );
    if ( $args['step'] !== 'init' ) {
      return $blocks;
    }
    $botId = $args['botId'];
    $uniqueId = uniqid('mwai_gdpr_');
    $blocks[] = [
      'type' => 'content',
      'data' => [
        'html' => '<div>
            <p>' . $gdpr_text . '</p>
            <form id="mwai-gdpr-form-' . $botId . '">
              <button type="submit">' . $gdpr_button . '</button>
            </form>
          </div>',
        'script' => '
          (function() {
            let chatbot_' . $uniqueId . ' = MwaiAPI.getChatbot("' . $botId . '");
            chatbot_' . $uniqueId . '.lock();
            document.getElementById("mwai-gdpr-form-' . $botId . '").addEventListener("submit", function(event) {
              event.preventDefault();
              chatbot_' . $uniqueId . '.unlock();
              chatbot_' . $uniqueId . '.setBlocks([]);
            });
          })();
        '
      ]
    ];
    return $blocks;
  }
}