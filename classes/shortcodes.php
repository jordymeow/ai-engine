<?php

class Meow_MWAI_Shortcodes {
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

        #mwai-chat-$id h2 {
          font-size: 20px;
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
        }

        #mwai-chat-$id .mwai-input input {
          background: #40414f;
          color: white;
          flex: auto;
          padding: 15px;
          border: none;
          border-radius: 5px;
          font-size: 15px;
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
      $apiKey = $params['apiKey'];
			$query = new Meow_MWAI_QueryText( $prompt, 1024 );
      if ( $model ) {
        $query->setModel( $model );
      }
      if ( $temperature ) {
        $query->setTemperature( $temperature );
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
      'id' => uniqid(),
      'context' => "Converse as if you were an AI assistant. Be friendly, creative.",
      'ai_name' => "AI: ",
      'user_name' => "User: ",
      'sys_name' => "System: ",
      'start_sentence' => "Hi! How can I help you?",
      'model' => 'text-davinci-003',
      'temperature' => 0.8,
      'api_key' => ''
    ] );
    $atts = shortcode_atts( $defaults, $atts, 'meow_ai' );
    $id = $atts['id'];
    $apiUrl = get_rest_url( null, 'ai-engine/v1/chat' );
    $onSentClickFn = "mwai_{$id}_onSendClick";
    $addReplyFn = "mwai_{$id}_addReply";
    $convertToHtmlFn = "mwai_{$id}_convertToHtml";
    $aiName = addslashes( trim($atts['ai_name']) );
    $userName = addslashes( trim($atts['user_name']) );
    $sysName = addslashes( trim($atts['sys_name']) );
    $context = addslashes( trim( $atts['context'] ) );
    $onGoingPrompt = "mwai_{$id}_onGoingPrompt";
    ob_start();
    ?>

      <div id="mwai-chat-<?= $id ?>" class="mwai-chat">
        <div class="mwai-conversation">
        </div>
        <div class="mwai-input">
          <input type="text" placeholder="Type your message here..." />
          <button><span>Send</span></button>
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
          let input = document.querySelector('#mwai-chat-<?= $id ?> .mwai-input input');
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
          input.disabled = true;

          // Request the completion
          <?= $onGoingPrompt ?> += '<?= $aiName ?>';
          const data = { 
            prompt: <?= $onGoingPrompt ?>,
            userName: '<?= $userName ?>',
            aiName: '<?= $aiName ?>',
            model: '<?= $atts['model'] ?>',
            temperature: '<?= $atts['temperature'] ?>',
            apiKey: '<?= $atts['api_key'] ?>',
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
          })
          .catch(error => {
            console.error(error);
            button.disabled = false;
            input.disabled = false;
          });
        }

        var input = document.querySelector('#mwai-chat-<?= $id ?> .mwai-input input');
        input.addEventListener('keypress', (event) => {
          if (event.keyCode === 13) {
            <?= $onSentClickFn ?>(); 
          }
        });

        var button = document.querySelector('#mwai-chat-<?= $id ?> .mwai-input button');
        button.addEventListener('click', (event) => {
          <?= $onSentClickFn ?>(); 
        });

        <?= $addReplyFn ?>('<?= $atts['start_sentence'] ?>', 'ai');
      </script>

    <?php
    $output = ob_get_contents();
    ob_end_clean();
    $output = apply_filters( 'mwai_chat_html', $output, $atts );
    return $output;
  }
}