<?php

class Meow_MWAI_Modules_ImagesBot {
  private $core = null;
  private $namespace = 'ai-engine/v1';

  public function __construct() {
    global $mwai_core;
    $this->core = $mwai_core;
    add_shortcode( 'mwai_imagesbot', array( $this, 'imagesbot' ) );
    add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
    add_filter( 'mwai_imagesbot_html', array( $this, 'chatgpt_style' ), 10, 2 );
    add_filter( 'mwai_imagesbot_html', array( $this, 'spinner_style' ), 10, 2 );
  }

  function rest_api_init() {
		try {
			register_rest_route( $this->namespace, '/imagesbot', array(
				'methods' => 'POST',
				'callback' => array( $this, 'rest_imagesbot' ),
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
        #mwai-imgbot-$id button {
          position: relative;
        }

        #mwai-imgbot-$id button[disabled] span {
          display: none;
        }

        #mwai-imgbot-$id button[disabled]::after {
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
        #mwai-imgbot-$id {
          background: #343541;
          color: white;
          font-size: 15px;
          border-radius: 10px;
          overflow: hidden;
        }

        #mwai-imgbot-$id .mwai-reply {
          display: flex;
          padding: 20px;
        }

        #mwai-imgbot-$id .mwai-actions div {
          border: 1px solid #454654;
          border-radius: 6px;
          width: 26px;
          height: 26px;
          display: flex;
          justify-content: center;
          font-size: 14px;
          align-items: center;
          cursor: pointer;
        }

        #mwai-imgbot-$id .mwai-ai {
          background: #454654;
        }

        #mwai-imgbot-$id .mwai-name {
          color: #a0a0a0;
          margin-right: 20px;
        }

        #mwai-imgbot-$id .mwai-text {
          flex: auto;
        }

        #mwai-imgbot-$id .mwai-gallery {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-gap: 5px;
        }

        #mwai-imgbot-$id .mwai-gallery img {
          width: 100%;
        }

        #mwai-imgbot-$id .mwai-text > *:first-child {
          margin-top: 0;
        }

        #mwai-imgbot-$id .mwai-text > *:last-child {
          margin-bottom: 0;
        }

        #mwai-imgbot-$id .mwai-input {
          display: flex;
          padding: 15px;
          border-top: 1px solid #454654;
        }

        #mwai-imgbot-$id .mwai-input input {
          background: #40414f;
          color: white;
          flex: auto;
          height: 40px;
          padding: 0px 15px;
          border: none;
          border-radius: 5px;
          font-size: 15px;
        }

        #mwai-imgbot-$id .mwai-input input:focus {
          outline: none;
        }

        #mwai-imgbot-$id .mwai-input button {
          background: none;
          color: white;
          border: 1px solid #40414f;
          margin-left: 15px;
          width: 80px;
          border-radius: 5px;
          cursor: pointer;
        }

        #mwai-imgbot-$id .mwai-input button:hover {
          background: #353640;
        }

        @media (max-width: 600px) {
          #mwai-imgbot-$id .mwai-reply {
            flex-direction: column;
          }

          #mwai-imgbot-$id .mwai-input {
            flex-direction: column;
          }

          #mwai-imgbot-$id .mwai-input button {
            margin: 15px 0 0 0;
            height: 40px;
            width: inherit;
          }

          #mwai-imgbot-$id .mwai-name {
            margin-right: 0;
          }
        }
      </style>
    " . $html;
  }

  function rest_imagesbot( $request ) {
    try {
			$params = $request->get_json_params();
			$prompt = $params['prompt'];
      //$model = $params['model'];
      $maxResults = $params['maxResults'];
      $apiKey = $params['apiKey'];
			$query = new Meow_MWAI_QueryImage( $prompt );
      if ( $maxResults ) {
        $query->setMaxResults( $maxResults );
      }
      if ( $apiKey ) {
        $query->setApiKey( $apiKey );
      }
			$answer = $this->core->ai->run( $query );
			return new WP_REST_Response([ 'success' => true, 'images' => $answer->results, 'usage' => $answer->usage ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
  }

  function imagesbot( $atts ) {
    $defaults = apply_filters( 'mwai_imagesbot_atts', [
      'id' => uniqid(),
      'ai_name' => "AI: ",
      'user_name' => "You: ",
      'sys_name' => "System: ",
      'start_sentence' => "Hey there! Can you tell me what kind of images you need?",
      'max_results' => 3,
      'model' => 'dall-e',
      'text_send' => 'Send',
      'text_input_placeholder' => 'Type your message...',
      'api_key' => ''
    ] );
    $atts = shortcode_atts( $defaults, $atts, 'mwai_chat_atts' );
    $id = $atts['id'];
    $apiUrl = get_rest_url( null, 'ai-engine/v1/imagesbot' );
    $onSentClickFn = "mwai_{$id}_onSendClick";
    $addReplyFn = "mwai_{$id}_addReply";
    $convertToHtmlFn = "mwai_{$id}_convertToHtml";
    $reuseFn = "mwai_{$id}_reuse";
    $aiName = addslashes( trim($atts['ai_name']) );
    $userName = addslashes( trim($atts['user_name']) );
    $sysName = addslashes( trim($atts['sys_name']) );
    $textSend = addslashes( trim( $atts['text_send'] ) );
    $maxResults = $atts['max_results'];
    $textInputPlaceholder = addslashes( trim( $atts['text_input_placeholder'] ) );
    ob_start();
    ?>

      <div id="mwai-imgbot-<?= $id ?>" class="mwai-imgbot">
        <div class="mwai-conversation">
        </div>
        <div class="mwai-input">
          <input type="text" placeholder="<?= $textInputPlaceholder ?>" />
          <button><span><?= $textSend ?></span></button>
        </div>
      </div>

      <script>
        function <?= $convertToHtmlFn ?>(text) {
          return text;
        }

        // Function to add a reply in the conversation
        function <?= $addReplyFn ?>(text, type = 'user') {
          var conversation = document.querySelector('#mwai-imgbot-<?= $id ?> .mwai-conversation');
          
          // If text is array, then it's image URLs. Let's create a simple gallery in HTML in $text.
          if (Array.isArray(text)) {
            var newText = '<div class="mwai-gallery">';
            for (var i = 0; i < text.length; i++) {
              newText += '<a href="' + text[i] + '" target="_blank"><img src="' + text[i] + '" />';
            }
            text = newText + '</div>';
          }

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
          if (type === 'user') {
            html += '<div class="mwai-actions">';
            text = encodeURIComponent(text);
            html += '<div class="mwai-action-reuse" onclick="<?= $reuseFn ?>(\'' + text + '\')">📝</div>';
            html += '</div>';
          }
          html += '</div>';
          conversation.innerHTML += html;
        }

        function <?= $reuseFn ?>(text) {
          text = decodeURIComponent(text);
          let input = document.querySelector('#mwai-imgbot-<?= $id ?> .mwai-input input');
          input.value = text;
        }

        // Function to request the completion
        function <?= $onSentClickFn ?>() {
          let input = document.querySelector('#mwai-imgbot-<?= $id ?> .mwai-input input');
          let inputText = input.value.trim();
          if (inputText === '') {
            return;
          }

          // Disable the button
          var button = document.querySelector('#mwai-imgbot-<?= $id ?> .mwai-input button');
          button.disabled = true;

          // Add the user reply
          <?= $addReplyFn ?>(inputText, 'user');
          input.value = '';
          input.disabled = true;

          // Request the completion
          const data = { 
            prompt: inputText,
            maxResults: <?= $maxResults ?>,
            model: '<?= $atts['model'] ?>',
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
              <?= $addReplyFn ?>(data.images, 'ai');
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

        var input = document.querySelector('#mwai-imgbot-<?= $id ?> .mwai-input input');
        input.addEventListener('keypress', (event) => {
          if (event.keyCode === 13) {
            <?= $onSentClickFn ?>(); 
          }
        });

        var button = document.querySelector('#mwai-imgbot-<?= $id ?> .mwai-input button');
        button.addEventListener('click', (event) => {
          <?= $onSentClickFn ?>(); 
        });

        <?= $addReplyFn ?>('<?= $atts['start_sentence'] ?>', 'ai');
      </script>

    <?php
    $output = ob_get_contents();
    ob_end_clean();
    $output = apply_filters( 'mwai_imagesbot_html', $output, $atts );
    return $output;
  }
}