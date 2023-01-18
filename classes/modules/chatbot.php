<?php

class Meow_MWAI_Modules_Chatbot {
  private $core = null;
  private $namespace = 'ai-engine/v1';

  public function __construct() {
    global $mwai_core;
    $this->core = $mwai_core;
    add_shortcode( 'mwai_chat', array( $this, 'chat' ) );
    add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );

    // If we apply ChatGPT styles
    if ( $this->core->get_option( 'shortcode_chat_style' ) ) {
      add_filter( 'mwai_chat_html', array( $this, 'chatgpt_style' ), 10, 2 );
      add_filter( 'mwai_chat_html', array( $this, 'spinner_style' ), 10, 2 );
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

  function spinner_style( $html, $atts ) {
    // If needed, we can use the $id to apply styles
    $id = $atts['id']; // This could be replace by the ID of a specific chatbot
    return "
      <style>
        #mwai-chat-$id button {
          position: relative;
        }

        #mwai-chat-$id button[disabled] span {
          display: none;
        }

        #mwai-chat-$id button[disabled]::after {
          content: '';
          position: absolute;
          width: 18px;
          height: 18px;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          border: 3px solid transparent;
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: mwai-button-spinner 1s ease infinite;
        }

        @keyframes mwai-button-spinner {
          from {
             transform: rotate(0turn);
          }
      
          to {
            transform: rotate(1turn);
          }
        }
      </style>
    " . $html;
  }

  function chatgpt_style( $html, $atts ) {
    // If needed, we can use the $id to apply styles
    $id = $atts['id']; // This could be replace by the ID of a specific chatbot
    return "
      <style>
        #mwai-chat-$id {
          background: #343541;
          color: white;
          font-size: 15px;
          border-radius: 10px;
          overflow: hidden;
        }

        #mwai-chat-$id * {
          box-sizing: border-box;
        }

        #mwai-chat-$id a {
          color: #2196f3;
        }

        #mwai-chat-$id h2 {
          font-size: 24px;
        }

        #mwai-chat-$id h3 {
          font-size: 18px;
        }

        #mwai-chat-$id h4 {
          font-size: 16px;
        }

        #mwai-chat-$id pre {
          background: black;
          color: white;
          border-radius: 10px;
          padding: 10px 15px;
          break-after: auto;
          font-size: 14px;
        }

        #mwai-chat-$id  ol {
          padding: 0;
          margin: 0 0 0 20px;
        }

        #mwai-chat-$id .mwai-reply {
          display: flex;
          padding: 20px;
        }

        #mwai-chat-$id .mwai-ai {
          background: #454654;
        }

        #mwai-chat-$id .mwai-name {
          color: #a0a0a0;
          margin-right: 20px;
        }

        #mwai-chat-$id .mwai-text {
          flex: auto;
        }

        #mwai-chat-$id .mwai-text > *:first-child {
          margin-top: 0;
        }

        #mwai-chat-$id .mwai-text > *:last-child {
          margin-bottom: 0;
        }

        #mwai-chat-$id .mwai-input {
          display: flex;
          padding: 15px;
          border-top: 1px solid #454654;
        }

        #mwai-chat-$id .mwai-input textarea {
          background: #40414f;
          color: white;
          flex: auto;
          padding: 10px 15px;
          border: none;
          border-radius: 5px;
          font-size: 15px;
          resize: none;
          font-family: inherit;
          line-height: 30px;
        }

        #mwai-chat-$id .mwai-input textarea:focus {
          outline: none;
        }

        #mwai-chat-$id .mwai-input button {
          background: none;
          color: white;
          border: 1px solid #40414f;
          margin-left: 15px;
          width: 80px;
          border-radius: 5px;
          cursor: pointer;
        }

        #mwai-chat-$id .mwai-input button:hover {
          background: #353640;
        }

        @media (max-width: 600px) {
          #mwai-chat-$id .mwai-reply {
            flex-direction: column;
          }

          #mwai-chat-$id .mwai-input {
            flex-direction: column;
          }

          #mwai-chat-$id .mwai-input button {
            margin: 15px 0 0 0;
            height: 40px;
            width: inherit;
          }

          #mwai-chat-$id .mwai-name {
            margin-right: 0;
          }
        }
      </style>
    " . $html;
  }

  function rest_chat( $request ) {
    try {
			$params = $request->get_json_params();
			$prompt = $params['prompt'];
      $model = $params['model'];
      $userName = $params['userName'];
      $aiName = $params['aiName'];
      $temperature = $params['temperature'];
      $maxTokens = intval( $params['maxTokens'] );
      $apiKey = $params['apiKey'];
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
      if ( $apiKey ) {
        $query->setApiKey( $apiKey );
      }
			$answer = $this->core->ai->run( $query );
      $rawText = $answer->result;

      $html = $this->core->markdown_to_html( $answer->result );
			return new WP_REST_Response([ 'success' => true, 'answer' => $rawText, 'html' => $html, 'usage' => $answer->usage ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
  }

  function chat( $atts ) {
    $defaults = apply_filters( 'mwai_chat_atts', [
      // UI Parameters
      'id' => uniqid(),
      'context' => "Converse as if you were an AI assistant. Be friendly, creative.",
      'ai_name' => "AI: ",
      'user_name' => "User: ",
      'sys_name' => "System: ",
      'start_sentence' => "Hi! How can I help you?",
      'text_send' => 'Send',
      'text_input_placeholder' => 'Type your message...',
      // Chatbot System Parameters
      'fineTuned' => 'false',
      // AI Parameters
      'model' => 'text-davinci-003',
      'temperature' => 0.8,
      'max_tokens' => 1024,
      'api_key' => ''
    ] );
    $atts = shortcode_atts( $defaults, $atts, 'mwai_chat_atts' );
    $id = $atts['id'];
    $apiUrl = get_rest_url( null, 'ai-engine/v1/chat' );

    // Functions
    $onSentClickFn = "mwai_{$id}_onSendClick";
    $addReplyFn = "mwai_{$id}_addReply";
    $initChatBotFn = "mwai_{$id}_initChatBot";
    $convertToHtmlFn = "mwai_{$id}_convertToHtml";

    // UI Parameters
    $aiName = addslashes( trim($atts['ai_name']) );
    $userName = addslashes( trim($atts['user_name']) );
    $sysName = addslashes( trim($atts['sys_name']) );
    $context = addslashes( trim( $atts['context'] ) );
    $textSend = addslashes( trim( $atts['text_send'] ) );
    $textInputPlaceholder = addslashes( trim( $atts['text_input_placeholder'] ) );

    // Chatbot System Parameters
    $fineTuned = $atts['fineTuned'];

    // OpenAI Parameters
    $model = $atts['model'];
    $temperature = $atts['temperature'];
    $maxTokens = $atts['max_tokens'];
    $apiKey = $atts['api_key'];

    $onGoingPrompt = "mwai_{$id}_onGoingPrompt";
    ob_start();
    ?>

      <div id="mwai-chat-<?= $id ?>" class="mwai-chat">
        <div class="mwai-conversation">
        </div>
        <div class="mwai-input">
          <textarea rows="1" placeholder="<?= $textInputPlaceholder ?>"></textarea>
          <button><span><?= $textSend ?></span></button>
        </div>
      </div>

      <script>
        var <?= $onGoingPrompt ?> = '<?= $context ?>' + '\n\n';

        function <?= $convertToHtmlFn ?>(text) {
          return text;
        }

        // Function to add a reply in the conversation
        function <?= $addReplyFn ?>(text, type = 'user') {
          var conversation = document.querySelector('#mwai-chat-<?= $id ?> .mwai-conversation');
          text = <?= $convertToHtmlFn ?>(text);
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

          // Request the completion
          <?= $onGoingPrompt ?> += '<?= $aiName ?>';
          const data = { 
            prompt: <?= $onGoingPrompt ?>,
            userName: '<?= $userName ?>',
            aiName: '<?= $aiName ?>',
            model: '<?= $model ?>',
            temperature: '<?= $temperature ?>',
            maxTokens: '<?= $maxTokens ?>',
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

          <?= $addReplyFn ?>('<?= $atts['start_sentence'] ?>', 'ai');
        }

        <?= $initChatBotFn ?>();
        
      </script>

    <?php
    $output = ob_get_contents();
    ob_end_clean();
    $output = apply_filters( 'mwai_chat_html', $output, $atts );
    return $output;
  }
}