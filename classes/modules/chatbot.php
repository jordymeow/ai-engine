<?php

class Meow_MWAI_Modules_Chatbot {
  private $core = null;
  private $namespace = 'ai-chatbot/v1';

  public function __construct() {
    global $mwai_core;
    $this->core = $mwai_core;
    if ( is_admin() ) { return; }
    add_shortcode( 'mwai_chat', array( $this, 'chat' ) );
    add_shortcode( 'mwai_chatbot', array( $this, 'chat' ) );
    add_shortcode( 'mwai_imagesbot', array( $this, 'imageschat' ) );
    add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
    if ( $this->core->get_option( 'shortcode_chat_inject' ) ) {
      //add_action( 'wp_body_open', array( $this, 'inject_chat' ) );
      add_action( 'wp_footer', array( $this, 'inject_chat' ) );
    }

    // Only for test now, but later we should probably import the JS/CSS
    if ( $this->core->get_option( 'shortcode_chat_syntax_highlighting' ) ) {
      wp_enqueue_script( 'mwai_chatbot',
      '//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js', [], null, false );
      wp_enqueue_style( 'mwai_chatbot',
        '//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/stackoverflow-dark.min.css' );
    }

    $logs = $this->core->get_option( 'shortcode_chat_logs' );
    if ( $logs && strpos( $logs, 'file' ) !== false ) {
      new Meow_MWAI_Modules_Chatbot_Logs();
    }

    if ( $this->core->get_option( 'shortcode_chat_styles' ) ) {
      add_filter( 'mwai_chatbot_style', [ $this, 'apply_chat_styles' ], 10, 2 );
    }

  }

  function rest_api_init() {
		try {
			register_rest_route( $this->namespace, '/chat', array(
				'methods' => 'POST',
				'callback' => array( $this, 'rest_chat' ),
        'permission_callback' => '__return_true'
			) );
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

  function chatgpt_style( $id ) {
    $css = file_get_contents( MWAI_PATH . '/classes/modules/chatbot-chatgpt.css' );
    $css = str_replace( '#mwai-chat-id', "#mwai-chat-{$id}", $css );
    return "<style>" . $css . "</style>";
  }

  function rest_chat( $request ) {
    try {
			$params = $request->get_json_params();
			$query = new Meow_MWAI_QueryText( $params['prompt'], 1024 );
      $query->injectParams( $params );
			$answer = $this->core->ai->run( $query );
      $rawText = $answer->result;
      $html = apply_filters( 'mwai_chatbot_reply', $rawText, $query, $params  );
      $html = $this->core->markdown_to_html( $html );
			return new WP_REST_Response([ 'success' => true, 'answer' => $rawText,
        'html' => $html, 'usage' => $answer->usage ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
  }

  function rest_imagesbot( $request ) {
    try {
			$params = $request->get_json_params();
			$query = new Meow_MWAI_QueryImage( $params['prompt'] );
      $query->injectParams( $params );
			$answer = $this->core->ai->run( $query );
			return new WP_REST_Response([ 'success' => true, 'images' => $answer->results, 'usage' => $answer->usage ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
  }

  function apply_chat_styles( $css, $chatbotId ) {
    $chatStyles = $this->core->get_option( 'shortcode_chat_styles' );
    return preg_replace_callback( '/--mwai-(\w+):\s*([^;]+);/', function ( $matches ) use ($chatStyles ) {
      if( isset( $chatStyles[$matches[1]] ) ) {
        return "--mwai-" . $matches[1] . ": " . $chatStyles[$matches[1]] . ";";
      }
      return $matches[0];
    }, $css );
  }

  function inject_chat() {
    $params = $this->core->get_option( 'shortcode_chat_params' );
    echo $this->chat( $params );
  }

  function imageschat( $atts ) {
    $atts['mode'] = 'images';
    return $this->chat( $atts );
  }

  function getCurrentUser() {
    if ( is_user_logged_in() ) {
      return wp_get_current_user();
    }
    return null;
  }

  function handlePlaceholders( $data, $guestName = "Guest: " ) {
    if ( strpos( $data, '{' ) === false ) {
      return $data;
    }
    $placeholders_meta = [ '{FIRST_NAME}', '{LAST_NAME}' ];
    $placeholders_data = [ '{USER_LOGIN}', '{DISPLAY_NAME}' ];
    $user = $this->getCurrentUser();
    if ( $user ) {
      foreach ( $placeholders_meta as $placeholder ) {
        if ( strpos( $data, $placeholder ) === false ) { continue; }
        $lcPlaceholder = substr( strtolower( $placeholder ), 1, -1 );
        $value = get_user_meta( $user->ID, $lcPlaceholder, true );
        $data = str_replace( $placeholder, $value, $data );
      }
      foreach ( $placeholders_data as $placeholder ) {
        if ( strpos( $data, $placeholder ) === false ) { continue; }
        $lcPlaceholder = substr( strtolower( $placeholder ), 1, -1 );
        $value = $user->data->$lcPlaceholder;
        $data = str_replace( $placeholder, $value, $data );
      }
      if ( !empty( $data ) ) {
        return $data;
      }
    }
    return $guestName;
  }

  function formatUserName( $userName, $guestName = "Guest: " ) {
    // Default avatar
    if ( empty( $userName ) ) {
      $user = $this->getCurrentUser();
      if ( $user ) {
        // Gravatar
        $userName = '<div class="mwai-avatar"><img src="' . get_avatar_url( $user->user_email ) . '" /></div>';
      }
      else {
        // Default avatar
        $userName = '<div class="mwai-avatar mwai-svg"><img src="' . MWAI_URL . '/images/avatar-user.svg" /></div>';
      }
    }
    // Custom avatar
    else if ( $this->core->isUrl( $userName ) ) {
      $userName = '<div class="mwai-avatar"><img src="' . $userName . '" /></div>';
    }
    // Placeholders
    else {
      $userName = $this->handlePlaceholders( $userName, $guestName );
      $userName = '<div class="mwai-name-text">' . $userName . '</div>';
    }
    return $userName;
  }

  function formatAiName( $aiName ) {
    // Default avatar
    if ( empty( $aiName ) ) {
      $aiName = '<div class="mwai-avatar mwai-svg"><img src="' . MWAI_URL . '/images/avatar-ai.svg" /></div>';
    }
    // Custom avatar
    else if ( $this->core->isUrl( $aiName ) ) {
      $aiName = '<div class="mwai-avatar"><img src="' . $aiName . '" /></div>';
    }
    else {
      $aiName = '<div class="mwai-name-text">' . $aiName . '</div>';
    }
    return $aiName;
  }

  function formatRawName( $aiName ) {
    return "AI: ";
  }

  function formatRawUserName( $userName, $guestName ) {
    return "User: ";
  }

  function chat( $atts ) {
    // Use the core default parameters, or the user default parameters
    $override = $this->core->get_option( 'shortcode_chat_params_override' );
    $defaults_params = $override ? $this->core->get_option( 'shortcode_chat_params' ) :
      $this->core->get_option( 'shortcode_chat_default_params' );

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

    // UI Parameters
    $aiName = addslashes( trim($atts['ai_name']) );
    $userName = addslashes( trim($atts['user_name']) );
    $guestName = addslashes( trim($atts['guest_name']) );
    $sysName = addslashes( trim($atts['sys_name']) );
    $context = addslashes( $atts['context'] );
    $context = preg_replace( '/\v+/', "\\n", $context );
    $textSend = addslashes( trim( $atts['text_send'] ) );
    $textClear = addslashes( trim( $atts['text_clear'] ) );
    $textInputPlaceholder = addslashes( trim( $atts['text_input_placeholder'] ) );
    $startSentence = addslashes( trim( $atts['start_sentence'] ) );
    $window = filter_var( $atts['window'], FILTER_VALIDATE_BOOLEAN );
    $fullscreen = filter_var( $atts['fullscreen'], FILTER_VALIDATE_BOOLEAN );
    $icon = isset( $atts['icon'] ) ? addslashes( trim( $atts['icon'] ) ) : "";
    $iconText = trim($atts['icon_text']);
    $iconPosition = addslashes( trim($atts['icon_position']) );
    $style = $atts['style'];

    // Validade & Enhance UI Parameters
    $aiName = $this->formatAiName( $aiName );
    $userName = $this->formatUserName( $userName, $guestName );
    $rawAiName = $this->formatRawName( $aiName );
    $rawUserName = $this->formatRawUserName( $userName, $guestName );

    // Chatbot System Parameters
    $id = empty( $atts['id'] ) ? uniqid() : $atts['id'];
    $memorizeChat = !empty( $atts['id'] );
    $id = preg_replace( '/[^a-zA-Z0-9]/', '', $id );
    $env = $atts['env'];
    $mode = $atts['mode'];
    $maxResults = $atts['max_results'];
    $sessionId = $this->core->get_session_id();
    $rest_nonce = wp_create_nonce( 'wp_rest' );
    $casuallyFineTuned = boolval( $atts['casually_fine_tuned'] );
    $promptEnding = addslashes( trim( $atts['prompt_ending'] ) );
    $completionEnding = addslashes( trim( $atts['completion_ending'] ) );
    if ( $casuallyFineTuned ) {
      $promptEnding = "\\n\\n===\\n\\n";
      $completionEnding = "\\n\\n";
    }
    $debugMode = $chatStyles = $this->core->get_option( 'debug_mode' );

    // OpenAI Parameters
    $model = $atts['model'];
    $temperature = $atts['temperature'];
    $maxTokens = $atts['max_tokens'];
    $apiKey = $atts['api_key'];

    // Named functions
    $onSentClickFn = "mwai_{$id}_onSendClick";
    $addReplyFn = "mwai_{$id}_addReply";
    $initChatBotFn = "mwai_{$id}_initChatBot";
    $setButtonTextFn = "mwai_{$id}_setButtonText";
    $onTidyOnGoingPromptFn = "mwai_{$id}_onUpdateOnGoingPrompt";
    $injectTimerFn = "mwai_{$id}_injectTimer";

    // Variables
    $apiUrl = get_rest_url( null, $mode === 'images' ? 'ai-chatbot/v1/imagesbot' : 'ai-chatbot/v1/chat' );
    $onGoingPrompt = "mwai_{$id}_onGoingPrompt";
    $memorizedChat = "mwai_{$id}_memorizedChat";
    $baseClasses = "mwai-chat";
    $baseClasses .= ( $window ? " mwai-window" : "" );
    $baseClasses .= ( !$window && $fullscreen ? " mwai-fullscreen" : "" );
    $baseClasses .= ( $style === 'chatgpt' ? " mwai-chatgpt" : "" );
    $baseClasses .= ( $window && !empty( $iconPosition ) ? (" mwai-" . $iconPosition) : "" );

    // Output CSS
    ob_start();
    $style_content = "";
    if ( $style === 'chatgpt' ) {
      $style_content = $this->chatgpt_style( $id, $style );
    }
    echo apply_filters( 'mwai_chatbot_style', $style_content, $id );

    // Output HTML & CSS
    $chatStyles = $this->core->get_option( 'shortcode_chat_styles' );
    $iconUrl = MWAI_URL . '/images/chat-green.svg';
    if ( !empty( $icon ) ) {
      $iconUrl = $icon;
    }
    else if ( !empty( $chatStyles ) && isset( $chatStyles['icon'] ) ) {
      $url = $chatStyles['icon'];
      $iconUrl = $this->core->isUrl( $url ) ? $url : (MWAI_URL . 'images/' . $chatStyles['icon']);
    }
    ?>
      <div id="mwai-chat-<?= $id ?>" class="<?= $baseClasses ?>">
        <?php if ( $window ) { ?>
          <div class="mwai-open-button">
            <?php if ( !empty( $iconText ) ) { ?>
              <div class="mwai-icon-text"><?= $iconText ?></div>
            <?php } ?>
            <img width="64" height="64" src="<?= $iconUrl ?>" />
          </div>
          <div class="mwai-header">
            <?php if ( $fullscreen ) { ?>
              <div class="mwai-resize-button"></div>
            <?php } ?>
            <div class="mwai-close-button"></div>
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
      (function () {
        let <?= $onGoingPrompt ?> = [];
        let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
        let isWindow = <?= $window ? 'true' : 'false' ?>;
        let isDebugMode = <?= $debugMode ? 'true' : 'false' ?>;
        let isFullscreen = <?= $fullscreen ? 'true' : 'false' ?>;
        let isCasuallyFineTuned = <?= $casuallyFineTuned ? 'true' : 'false' ?>;
        let mode = '<?= $mode ?>';
        let memorizeChat = <?= $memorizeChat ? 'true' : 'false' ?>;
        let <?= $memorizedChat ?> = [];

        if (isDebugMode) {
          window.mwai_<?= $id ?> = {
            onGoingPrompt: <?= $onGoingPrompt ?>,
            memorizedChat: <?= $memorizedChat ?>,
            parameters: {
              mode: mode,
              model: '<?= $model ?>',
              temperature: '<?= $temperature ?>',
              maxTokens: '<?= $maxTokens ?>',
              context: '<?= $context ?>',
              start_sentence: '<?= $startSentence ?>',
              isMobile: isMobile,
              isWindow: isWindow,
              isFullscreen: isFullscreen,
              isCasuallyFineTuned: isCasuallyFineTuned,
            }
          };
        }

        // Set button text
        function <?= $setButtonTextFn ?>() {
          let input = document.querySelector('#mwai-chat-<?= $id ?> .mwai-input textarea');
          let button = document.querySelector('#mwai-chat-<?= $id ?> .mwai-input button');
          let buttonSpan = button.querySelector('span');
          if (<?= $memorizedChat ?>.length < 2) {
            buttonSpan.innerHTML = '<?= $textSend ?>';
          }
          else if (!input.value.length) {
            buttonSpan.innerHTML = '<?= $textClear ?>';
          }
          else {
            buttonSpan.innerHTML = '<?= $textSend ?>';
          }
        }

        // Inject timer 
        function <?= $injectTimerFn ?>(element) {
          let intervalId;
          let startTime = new Date();
          let timerElement = null;

          function updateTimer() {
            let now = new Date();
            let timer = Math.floor((now - startTime) / 1000);
            if (!timerElement) {
              if (timer > 0.5) {
                timerElement = document.createElement('div');
                timerElement.classList.add('mwai-timer');
                element.appendChild(timerElement);
              }
            }
            if (timerElement) {
              let minutes = Math.floor(timer / 60);
              let seconds = timer - (minutes * 60);
              seconds = seconds < 10 ? "0" + seconds : seconds;
              let display = minutes + ":" + seconds;
              timerElement.innerHTML = display;
            }
          }

          intervalId = setInterval(updateTimer, 500);

          return function stopTimer() {
            clearInterval(intervalId);
            if (timerElement) {
              timerElement.remove();
            }
          };
        }

        // Push the reply in the conversation
        function <?= $addReplyFn ?>(text, type = 'user') {
          var conversation = document.querySelector('#mwai-chat-<?= $id ?> .mwai-conversation');

          if (memorizeChat) {
            <?= $memorizedChat ?>.push({ text, type });
            localStorage.setItem('mwai-chat-<?= $id ?>', JSON.stringify(<?= $memorizedChat ?>));
          }

          // If text is array, then it's image URLs. Let's create a simple gallery in HTML in $text.
          if (Array.isArray(text)) {
            var newText = '<div class="mwai-gallery">';
            for (var i = 0; i < text.length; i++) {
              newText += '<a href="' + text[i] + '" target="_blank"><img src="' + text[i] + '" />';
            }
            text = newText + '</div>';
          }

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
          <?= $setButtonTextFn ?>();

          // Syntax coloring
          if (typeof hljs !== 'undefined') {
            document.querySelectorAll('pre code').forEach((el) => {
              hljs.highlightElement(el);
            });
          }
        }

        function <?= $onTidyOnGoingPromptFn ?>(onGoingPrompt, last = 15) {
          let onGoingPromptLength = onGoingPrompt.length;
          let start = (onGoingPromptLength - last) < 0 ? 0 : (onGoingPromptLength - last);
          if (isCasuallyFineTuned) { onGoingPromptLength--; }
          let conversationToUse = onGoingPrompt.slice(start, onGoingPromptLength);

          // Casually fine tuned, let's use the last question
          if (isCasuallyFineTuned) {
            let lastLine = conversationToUse[conversationToUse.length - 1];
            let prompt = lastLine.says + '<?= $promptEnding ?>'
            return prompt;
          }

          // Otherwise let's compile the latest conversation
          conversationToUse = conversationToUse.map(x => x.who + x.says);
          let prompt = conversationToUse.join('\n');
          if (isCasuallyFineTuned) {
            prompt = '<?= $promptEnding ?>';
          }
          return prompt;
        }

        // Function to request the completion
        function <?= $onSentClickFn ?>() {
          let input = document.querySelector('#mwai-chat-<?= $id ?> .mwai-input textarea');
          let inputText = input.value.trim();

          // Reset the conversation if empty
          if (inputText === '') {
            <?= $onGoingPrompt ?> = [];
            document.querySelector('#mwai-chat-<?= $id ?> .mwai-conversation').innerHTML = '';
            localStorage.removeItem('mwai-chat-<?= $id ?>');
            <?= $memorizedChat ?> = [];
            <?= $addReplyFn ?>('<?= $startSentence ?>', 'ai');
            return;
          }

          // Disable the button
          var button = document.querySelector('#mwai-chat-<?= $id ?> .mwai-input button');
          button.disabled = true;

          // Add the user reply
          <?= $addReplyFn ?>(inputText, 'user');
          <?= $onGoingPrompt ?>.push({ who: '<?= $rawUserName ?>', says: inputText });
          input.value = '';
          input.setAttribute('rows', 1);
          input.disabled = true;

          // Let's build the prompt depending on the "system"
          <?= $onGoingPrompt ?>.push({ who: '<?= $rawAiName ?>', says: '' });
          let prompt = '<?= $context ?>' + '\n\n';
          prompt += <?= $onTidyOnGoingPromptFn ?>(<?= $onGoingPrompt ?>, 15);

          console.log('onGoingPrompt', <?= $onGoingPrompt ?>);
          console.log('prompt', prompt);

          // Prompt for the images
          const data = mode === 'images' ? {
            env: '<?= $env ?>',
            session: '<?= $sessionId ?>',
            prompt: inputText,
            rawInput: inputText,
            maxResults: <?= $maxResults ?>,
            model: '<?= $atts['model'] ?>',
            apiKey: '<?= $atts['api_key'] ?>',
          // Prompt for the chat
          } : {
            env: '<?= $env ?>',
            session: '<?= $sessionId ?>',
            prompt: prompt,
            rawInput: inputText,
            userName: '<?= $userName ?>',
            aiName: '<?= $aiName ?>',
            model: '<?= $model ?>',
            temperature: '<?= $temperature ?>',
            maxTokens: '<?= $maxTokens ?>',
            stop: '<?= $completionEnding ?>',
            maxResults: 1,
            apiKey: '<?= $apiKey ?>',
          };

          // Start the timer
          const stopTimer = <?= $injectTimerFn ?>(button);

          // Send the request
          if (isDebugMode) {
            console.log('[BOT] Sent: ', data);
          }
          fetch('<?= $apiUrl ?>', { method: 'POST', headers: { 
              'Content-Type': 'application/json', 
              'X-WP-Nonce': '<?= $rest_nonce ?>'
            },
            body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(data => {
            if (isDebugMode) {
              console.log('[BOT] Recv: ', data);
            }
            if (!data.success) {
              <?= $addReplyFn ?>(data.message, 'system');
            }
            else {
              <?= $addReplyFn ?>(data.images ? data.images : data.html, 'ai');
              <?= $onGoingPrompt ?>[<?= $onGoingPrompt ?>.length - 1].says = data.answer;
            }
            button.disabled = false;
            input.disabled = false;
            stopTimer();
            
            // Only focus only on desktop (to avoid the mobile keyboard to kick-in)
            if (!isMobile) {
              input.focus();
            }
          })
          .catch(error => {
            console.error(error);
            button.disabled = false;
            input.disabled = false;
            stopTimer();
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
          var button = document.querySelector('#mwai-chat-<?= $id ?> .mwai-input button');

          input.addEventListener('keypress', (event) => {
            let text = event.target.value;
            if (event.keyCode === 13 && !text.length && !event.shiftKey) {
              event.preventDefault();
              return;
            }
            if (event.keyCode === 13 && text.length && !event.shiftKey) {
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
            <?= $setButtonTextFn ?>();
          });
          
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
            if (isFullscreen) {
              var resizeButton = document.querySelector('#mwai-chat-<?= $id ?> .mwai-resize-button');
              resizeButton.addEventListener('click', (event) => {
                var chat = document.querySelector('#mwai-chat-<?= $id ?>');
                chat.classList.toggle('mwai-fullscreen');
              });
            }
          }

          // Get back the previous chat if any for the same ID
          var chatHistory = [];
          if (memorizeChat) {
            chatHistory = localStorage.getItem('mwai-chat-<?= $id ?>');
            if (chatHistory) {
              chatHistory = JSON.parse(chatHistory);
              chatHistory = chatHistory.filter(x => x && x.text && x.type);
              chatHistory.forEach(x => { <?= $addReplyFn ?>(x.text, x.type) });
            }
            else {
              chatHistory = [];
            }
          }
          if (chatHistory.length === 0) {
            <?= $addReplyFn ?>('<?= $startSentence ?>', 'ai');
          }
        }

        // Let's go totally meoooow on this! 
        <?= $initChatBotFn ?>();
      })();
      </script>

    <?php
    $output = ob_get_contents();
    ob_end_clean();
    $output = apply_filters( 'mwai_chatbot', $output, $atts );
    return $output;
  }
}