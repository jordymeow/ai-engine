<?php

add_filter( 'mwai_chatbot_params', function ( $params ) {
  if ( isset( $params['discuss_mode'] ) ) {
    return $params;
  }
  $post = get_post();
  if ( !empty( $post ) ) {
    // Before adding the content in the context, we should absolutely remove the HTML tags,
    // the shortcodes, and the empty lines. Then lines should be replaced by a textual "\n".
    $content = strip_tags( $post->post_content );
    $content = preg_replace( '/\[[^\]]+\]/', '', $content );
    $content = preg_replace( '/^\h*\v+/m', '', $content );
    $content = preg_replace( '/\v+/', "\\n", $content );
    $params['context'] = "Article:\\n\\n{***}\\n{$content}\\n{***}.\\n\\nDebate:\\n\\n";
    $params['start_sentence'] = "What did you think of this article?";
  }
  return $params;
});

class Meow_MWAI_Modules_Chatbot {
  private $core = null;
  private $namespace = 'ai-engine/v1';

  public function __construct() {
    if ( is_admin() ) {
      return;
    }

    global $mwai_core;
    $this->core = $mwai_core;
    add_shortcode( 'mwai_chat', array( $this, 'chat' ) );
    add_shortcode( 'mwai_chatbot', array( $this, 'chat' ) );
    add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );

    if ( $this->core->get_option( 'shortcode_chat_inject' ) ) {
      add_action( 'wp_footer', array( $this, 'inject_chat' ) );
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
    $override = $this->core->get_option( 'shortcode_chat_params_override' );
    $defaults_params = $override ? $this->core->get_option( 'shortcode_chat_params' ) :
      $this->core->get_option( 'shortcode_chat_default_params' );
    $defaults_params['id'] = uniqid();
    $defaults = apply_filters( 'mwai_chatbot_params_defaults', $defaults_params );
    $atts = shortcode_atts( $defaults, $atts );
    $atts = apply_filters( 'mwai_chatbot_params', $atts );
    $apiUrl = get_rest_url( null, 'ai-engine/v1/chat' );
    $id = $atts['id'];

    // Functions
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
    $window = ( !!$atts['window'] || $atts['window'] === 'true' ) ? 'true' : 'false';
    $style = $atts['style'];

    // Chatbot System Parameters
    $casuallyFineTuned = $atts['casually_fined_tuned'] === "true";
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
    $baseClasses = "mwai-chat" . ( $window === 'true' ? " mwai-window" : "" );

    // Output CSS, HTML and JS
    ob_start();
    $style_content = "";
    if ( $style === 'chatgpt' ) {
      $style_content = $this->chatgpt_style( $id, $style );
    }
    echo apply_filters( 'mwai_chatbot_style', $style_content, $id );
    ?>
      <div id="mwai-chat-<?= $id ?>" class="<?= $baseClasses ?>">
        <?php if ( $window === 'true' ) { ?>
          <div class="mwai-close-button">⨯</div>
          <div class="mwai-open-button">
            <img width="64" height="64" src="<?= plugins_url( '../../images/chat-green.svg', __FILE__ ) ?>" />
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
          if (<?= $casuallyFineTuned ? '1' : '0' ?>) {
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
            input.focus();
          })
          .catch(error => {
            console.error(error);
            button.disabled = false;
            input.disabled = false;
          });
        }

        function mwaiSetTextAreaHeight(textarea, lines) {
          var rows = textarea.getAttribute('rows');
          if (lines !== rows) {
            textarea.setAttribute('rows', lines > 5 ? 5 : lines);
          }
        }

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
          if ( <?= $window ?> ) {
            var openButton = document.querySelector('#mwai-chat-<?= $id ?> .mwai-open-button');
            openButton.addEventListener('click', (event) => {
              var chat = document.querySelector('#mwai-chat-<?= $id ?>');
              chat.classList.add('mwai-open');
              input.focus();
            });
            var closeButton = document.querySelector('#mwai-chat-<?= $id ?> .mwai-close-button');
            closeButton.addEventListener('click', (event) => {
              var chat = document.querySelector('#mwai-chat-<?= $id ?>');
              chat.classList.remove('mwai-open');
            });
          }

          <?= $addReplyFn ?>('<?= $startSentence ?>', 'ai');
        }

        <?= $initChatBotFn ?>();
        
      </script>

    <?php
    $output = ob_get_contents();
    ob_end_clean();
    $output = apply_filters( 'mwai_chatbot', $output, $atts );
    return $output;
  }
}