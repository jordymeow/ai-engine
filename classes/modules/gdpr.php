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
    
    // Check if GDPR is already accepted via cookie
    if ( isset( $_COOKIE['mwai_gdpr_accepted'] ) && $_COOKIE['mwai_gdpr_accepted'] === '1' ) {
      return $blocks;
    }
    $botId = $args['botId'];
    $uniqueId = uniqid( 'mwai_gdpr_' );
    $blocks[] = [
      'id' => $uniqueId,
      'type' => 'content',
      'data' => [
        'id' => $uniqueId,
        'html' => '<div>
                              <p>' . $gdpr_text . '</p>
                              <div class="mwai-gdpr-buttons">
                              <button id="' . $uniqueId . '-button" type="button" style="width: 100%;">' . $gdpr_button . '</button>
                              </div>
                              </div>',
        'script' => '
                              (function() {
                                    // Handle GDPR consent button click
                                    document.addEventListener("click", function(event) {
                                      if (event.target.id === "' . $uniqueId . '-button") {
                                        event.preventDefault();
                                        
                                        // Set GDPR acceptance cookie for 1 year
                                        const date = new Date();
                                        date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
                                        document.cookie = "mwai_gdpr_accepted=1; expires=" + date.toUTCString() + "; path=/";
                                        
                                        // IMPORTANT: When multiple chatbots share the same botId, we must find
                                        // the specific chatbot instance that contains this GDPR block.
                                        // MwaiAPI.getChatbot() returns the first match, which may be wrong.
                                        let foundChatbot = null;
                                        const chatbotsWithSameBotId = MwaiAPI.chatbots.filter(cb => cb.botId === "' . $botId . '");
                                        
                                        // Find the chatbot that actually has this GDPR block
                                        for (const chatbot of chatbotsWithSameBotId) {
                                          const blocks = chatbot.getBlocks ? chatbot.getBlocks() : [];
                                          if (blocks.some(block => block.id === "' . $uniqueId . '")) {
                                            foundChatbot = chatbot;
                                            break;
                                          }
                                        }
                                        
                                        if (foundChatbot) {
                                          foundChatbot.unlock();
                                          foundChatbot.removeBlockById("' . $uniqueId . '");
                                        }
                                      }
                                    }, true); // Use capture phase for better popup/modal support
                                    
                                    // Lock the chatbot when it has this GDPR block
                                    // Note: Using MwaiAPI.getChatbot() here is fine for locking
                                    // as we want to lock any chatbot with this botId initially
                                    const tryLock = setInterval(function() {
                                      const chatbot = MwaiAPI.getChatbot("' . $botId . '");
                                      if (chatbot && chatbot.lock) {
                                        chatbot.lock();
                                        clearInterval(tryLock);
                                      }
                                    }, 100);
                                    
                                    // Stop trying after 5 seconds
                                    setTimeout(function() {
                                      clearInterval(tryLock);
                                    }, 5000);
                                  })();
                                '
      ]
    ];
    return $blocks;
  }
}
