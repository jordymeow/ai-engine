<?php

class Meow_MWAI_Modules_Chatbot {
  private $core = null;
  private $namespace = 'ai-engine/v1';

  public function __construct() {
    global $mwai_core;
    $this->core = $mwai_core;
    if ( is_admin() ) { return; }
    add_shortcode( 'mwai_chat', array( $this, 'chat' ) );
    add_shortcode( 'mwai_chatbot', array( $this, 'chat' ) );
    add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
    if ( $this->core->get_option( 'shortcode_chat_inject' ) ) {
      add_action( 'wp_body_open', array( $this, 'inject_chat' ) );
    }

    // Only for test now, but later we should probably import the JS/CSS
    if ( $this->core->get_option( 'shortcode_chat_syntax_highlighting' ) ) {
      wp_enqueue_script( 'mwai_chatbot',
      '//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js', [], null, false );
      wp_enqueue_style( 'mwai_chatbot',
        '//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/stackoverflow-dark.min.css' );
    }
  }

  function rest_api_init() {
		try {
			register_rest_route( $this->namespace, '/chat', array(
				'methods' => 'POST',
				'callback' => array( $this, 'rest_chat' ),
        'permission_callback' => '__return_true'
			) );
		}
		catch ( Exception $e ) {
			var_dump( $e );
		}
	}

  function chatgpt_style( $id ) {
    $css = file_get_contents( MWAI_PATH . '/classes/modules/chatbot-chatgpt.css' );
    $css = str_replace( '#mwai-chat-id', "#mwai-chat-{$id}", $css );
    return "<style>" . $css . "</style>";
  }

  function rest_chat( $request ) {
    try {
			$params = $request->get_json_params();
			$prompt = $params['prompt'];
      $model = $params['model'];
      $temperature = $params['temperature'];
      $maxTokens = intval( $params['maxTokens'] );
      $apiKey = $params['apiKey'];
      $stop = $params['stop'];
			$query = new Meow_MWAI_QueryText( $prompt, 1024 );
      if ( $model ) {
        $query->setModel( $model );
      }
      if ( $temperature ) {
        $query->setTemperature( $temperature );
      }
      if ( $maxTokens ) {
        $query->setMaxTokens( $maxTokens );
      }
      if ( $stop ) {
        $query->setStop( $stop );
      }
      if ( $apiKey ) {
        $query->setApiKey( $apiKey );
      }
			$answer = $this->core->ai->run( $query );
      $rawText = $answer->result;
      $html = apply_filters( 'mwai_chatbot_answer', $rawText  );
      $html = $this->core->markdown_to_html( $rawText );
			return new WP_REST_Response([ 'success' => true, 'answer' => $rawText, 'html' => $html, 'usage' => $answer->usage ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
  }

  function inject_chat() {
    $params = $this->core->get_option( 'shortcode_chat_params' );
    echo $this->chat( $params );
  }

  function chat( $atts ) {
    // Use the core default parameters, or the user default parameters
    $override = $this->core->get_option( 'shortcode_chat_params_override' );
    $defaults_params = $override ? $this->core->get_option( 'shortcode_chat_params' ) :
      $this->core->get_option( 'shortcode_chat_default_params' );
    $defaults_params['id'] = uniqid();

    // Give a chance to modify the default parameters one last time
    $defaults = apply_filters( 'mwai_chatbot_params_defaults', $defaults_params );

    // Make sure all the mandatory params are set
    foreach ( $this->core->defaultChatbotParams as $key => $value ) {
      if ( !isset( $defaults[$key] ) ) {
        $defaults[$key] = $value;
      }
    }

    // Override with the shortcode, and before/after filters
    $atts = apply_filters( 'mwai_chatbot_params_before', $atts );
    $atts = shortcode_atts( $defaults, $atts );
    $atts = apply_filters( 'mwai_chatbot_params', $atts );
    $apiUrl = get_rest_url( null, 'ai-engine/v1/chat' );
    $id = $atts['id'];

    // Named functions
    $onSentClickFn = "mwai_{$id}_onSendClick";
    $addReplyFn = "mwai_{$id}_addReply";
    $initChatBotFn = "mwai_{$id}_initChatBot";

    // UI Parameters
    $aiName = addslashes( trim($atts['ai_name']) );
    $userName = addslashes( trim($atts['user_name']) );
    $sysName = addslashes( trim($atts['sys_name']) );
    $context = addslashes( $atts['context'] );
    $textSend = addslashes( trim( $atts['text_send'] ) );
    $textInputPlaceholder = addslashes( trim( $atts['text_input_placeholder'] ) );
    $startSentence = addslashes( trim( $atts['start_sentence'] ) );
    $window = filter_var( $atts['window'], FILTER_VALIDATE_BOOLEAN );
    $fullscreen = filter_var( $atts['fullscreen'], FILTER_VALIDATE_BOOLEAN );
    $style = $atts['style'];

    // Chatbot System Parameters
    $casuallyFineTuned = boolval( $atts['casually_fined_tuned'] );
    $promptEnding = addslashes( trim( $atts['prompt_ending'] ) );
    $completionEnding = addslashes( trim( $atts['completion_ending'] ) );
    if ( $casuallyFineTuned ) {
      $promptEnding = "\\n\\n===\\n\\n";
      $completionEnding = "\\n\\n";
    }

    // OpenAI Parameters
    $model = $atts['model'];
    $temperature = $atts['temperature'];
    $maxTokens = $atts['max_tokens'];
    $apiKey = $atts['api_key'];

    // Variables
    $onGoingPrompt = "mwai_{$id}_onGoingPrompt";
    $baseClasses = "mwai-chat";
    $baseClasses .= ( $window ? " mwai-window" : "" );
    $baseClasses .= ( $fullscreen ? " mwai-fullscreen" : "" );

    // Output CSS
    ob_start();
    $style_content = "";
    if ( $style === 'chatgpt' ) {
      $style_content = $this->chatgpt_style( $id, $style );
    }
    echo apply_filters( 'mwai_chatbot_style', $style_content, $id );

    // Output HTML & CSS
    ?>
      <div id="mwai-chat-<?= $id ?>" class="<?= $baseClasses ?>">
        <?php if ( $window ) { ?>
          <div class="mwai-header">
            <div class="mwai-close-button"></div>
            <div class="mwai-open-button">
              <img width="64" height="64" src="<?= plugins_url( '../../images/chat-green.svg', __FILE__ ) ?>" />
            </div>
          </div>
        <?php } ?>
        <div class="mwai-content">
          <div class="mwai-conversation">
          </div>
          <div class="mwai-input">
            <textarea rows="1" placeholder="<?= $textInputPlaceholder ?>"></textarea>
            <button><span><?= $textSend ?></span></button>
          </div>
        </div>
      </div>

      <script>
        var <?= $onGoingPrompt ?> = '<?= $context ?>' + '\n\n';
        var isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
        var isWindow = <?= $window ? 'true' : 'false' ?>;

        // Push the reply in the conversation
        function <?= $addReplyFn ?>(text, type = 'user') {
          var conversation = document.querySelector('#mwai-chat-<?= $id ?> .mwai-conversation');
          var mwaiClasses = 'mwai-reply';
          if (type === 'ai') {
            mwaiClasses += ' mwai-ai';
          }
          else if (type === 'system') {
            mwaiClasses += ' mwai-system';
          }
          else {
            mwaiClasses += ' mwai-user';
          }
          var html = '<div class="' + mwaiClasses + '">';
          if (type === 'ai') {
            html += '<span class="mwai-name"><?= $aiName ?></span>';
          }
          else if (type === 'system') {
            html += '<span class="mwai-name"><?= $sysName ?></span>';
          }
          else {
            html += '<span class="mwai-name"><?= $userName ?></span>';
          }
          html += '<span class="mwai-text">' + text + '</span>';
          html += '</div>';
          conversation.innerHTML += html;
          conversation.scrollTop = conversation.scrollHeight;

          // Syntax coloring
          if (typeof hljs !== 'undefined') {
            document.querySelectorAll('pre code').forEach((el) => {
              hljs.highlightElement(el);
            });
          }
        }

        // Function to request the completion
        function <?= $onSentClickFn ?>() {
          let input = document.querySelector('#mwai-chat-<?= $id ?> .mwai-input textarea');
          let inputText = input.value.trim();

          if (inputText === '') {
            return;
          }

          // Disable the button
          var button = document.querySelector('#mwai-chat-<?= $id ?> .mwai-input button');
          button.disabled = true;

          // Add the user reply
          <?= $addReplyFn ?>(inputText, 'user');
          <?= $onGoingPrompt ?> += '<?= $userName ?>' + inputText + '\n';
          input.value = '';
          input.setAttribute('rows', 1);
          input.disabled = true;

          // Let's build the prompt depending on the "system"
          <?= $onGoingPrompt ?> += '<?= $aiName ?>';
          let prompt = <?= $onGoingPrompt ?>;
          if (<?= $casuallyFineTuned ? 1 : 0 ?>) {
            prompt = inputText + '<?= $promptEnding ?>';
          }

          // Request the completion
          const data = { 
            prompt: prompt,
            userName: '<?= $userName ?>',
            aiName: '<?= $aiName ?>',
            model: '<?= $model ?>',
            temperature: '<?= $temperature ?>',
            maxTokens: '<?= $maxTokens ?>',
            stop: '<?= $completionEnding ?>',
            apiKey: '<?= $apiKey ?>',
          };
          console.log('[BOT] Sent: ', data);
          fetch('<?= $apiUrl ?>', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(data => {
            console.log('[BOT] Recv: ', data);
            if (!data.success) {
              <?= $addReplyFn ?>(data.message, 'system');
            }
            else {
              <?= $addReplyFn ?>(data.html, 'ai');
              <?= $onGoingPrompt ?> += data.answer + '\n';
            }
            button.disabled = false;
            input.disabled = false;
            
            // Only focus only on desktop (to avoid the mobile keyboard to kick-in)
            if (!isMobile) {
              input.focus();
            }
          })
          .catch(error => {
            console.error(error);
            button.disabled = false;
            input.disabled = false;
          });
        }

        // Keep the textarea height in sync with the content
        function mwaiSetTextAreaHeight(textarea, lines) {
          var rows = textarea.getAttribute('rows');
          if (lines !== rows) {
            textarea.setAttribute('rows', lines > 5 ? 5 : lines);
          }
        }

        // Init the chatbot
        function <?= $initChatBotFn ?>() {
          var input = document.querySelector('#mwai-chat-<?= $id ?> .mwai-input textarea');
          input.addEventListener('keypress', (event) => {
            if (event.keyCode === 13 && !event.shiftKey) {
              <?= $onSentClickFn ?>(); 
            }
          });
          input.addEventListener('keydown', (event) => {
            var rows = input.getAttribute('rows');
            if (event.keyCode === 13 && event.shiftKey) {
              var lines = input.value.split('\n').length + 1;
              mwaiSetTextAreaHeight(input, lines);
            }
          });
          input.addEventListener('keyup', (event) => {
            var rows = input.getAttribute('rows');
              var lines = input.value.split('\n').length ;
              mwaiSetTextAreaHeight(input, lines);
          });
          var button = document.querySelector('#mwai-chat-<?= $id ?> .mwai-input button');
          button.addEventListener('click', (event) => {
            <?= $onSentClickFn ?>(); 
          });

          // If window, add event listener to mwai-open-button and mwai-close-button
          if ( isWindow ) {
            var openButton = document.querySelector('#mwai-chat-<?= $id ?> .mwai-open-button');
            openButton.addEventListener('click', (event) => {
              var chat = document.querySelector('#mwai-chat-<?= $id ?>');
              chat.classList.add('mwai-open');
              // Only focus only on desktop (to avoid the mobile keyboard to kick-in)
              if (!isMobile) {
                input.focus();
              }
            });
            var closeButton = document.querySelector('#mwai-chat-<?= $id ?> .mwai-close-button');
            closeButton.addEventListener('click', (event) => {
              var chat = document.querySelector('#mwai-chat-<?= $id ?>');
              chat.classList.remove('mwai-open');
            });
          }

          <?= $addReplyFn ?>('<?= $startSentence ?>', 'ai');
        }

        // Let's go totally meoooow on this! 
        <?= $initChatBotFn ?>();
      </script>

    <?php
    $output = ob_get_contents();
    ob_end_clean();
    $output = apply_filters( 'mwai_chatbot', $output, $atts );
    return $output;
  }
}