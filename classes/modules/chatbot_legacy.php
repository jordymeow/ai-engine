<?php

class Meow_MWAI_Modules_Chatbot_Legacy {
	private $core = null;
	private $namespace = 'ai-chatbot/v1';
	private $usingChat = false;

	public function __construct() {
		global $mwai_core;
		$this->core = $mwai_core;
		if ( is_admin() ) { return; }
		add_shortcode( 'mwai_chat', array( $this, 'chat' ) );
		add_shortcode( 'mwai_chatbot', array( $this, 'chat' ) );
		add_shortcode( 'mwai_imagesbot', array( $this, 'imageschat' ) );
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );

		if ( $this->core->get_option( 'shortcode_chat_inject' ) ) {
			add_action( 'wp_footer', array( $this, 'inject_chat' ) );
		}

		if ( $this->core->get_option( 'shortcode_chat_styles' ) ) {
			add_filter( 'mwai_chatbot_style', [ $this, 'apply_chat_styles' ], 10, 2 );
		}
	}

	public function enqueue_scripts() {
		// if ( $this->core->get_option( 'shortcode_chat_syntax_highlighting' ) ) {
		// 	wp_enqueue_script( 'mwai_chatbot', MWAI_URL . 'vendor/highlightjs/highlight.min.js', [], '11.7', false );
		// 	wp_enqueue_style( 'mwai_chatbot', MWAI_URL . '/vendor/highlightjs/stackoverflow-dark.min.css', [], '11.7' );
		// }
		if ( $this->core->get_option( 'shortcode_chat_typewriter' ) ) {
			wp_enqueue_script( 'mwai_chatbot_typewriter', MWAI_URL . 'vendor/typewriterjs/typewriter.min.js', [], '2.0', true );
		}
	}

	public function rest_api_init() {
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

	public function chatgpt_style( $id ) {
		$css = file_get_contents( MWAI_PATH . '/themes/ChatGPT.module.css' );
		$css = str_replace( '#mwai-chat-id', "#mwai-chat-{$id}", $css );
		return '<style>' . $css . '</style>';
	}

	public function basics_security_check( $params ) {
		if ( empty( $params['newMessage'] ) ) {
			return false;
		}
		$length = strlen( trim( $params['newMessage'] ) );
		if ( $length < 1 || $length > ( 4096 - 512 ) ) {
			return false;
		}
		if ( empty( $params['prompt'] ) ) {
			return false;
		}
		return true;
	}

	public function rest_chat( $request ) {
		try {
			$params = $request->get_json_params();
			$context = null;
			if ( !$this->basics_security_check( $params )) {
				return new WP_REST_Response( [ 
					'success' => false, 
					'message' => 'Sorry, your query has been rejected.' ], 403
				);
			}

			$query = new Meow_MWAI_Query_Text( $params['newMessage'], 1024 );
			//$query->setIsChat( true );
			$query->injectParams( $params );

			$takeoverAnswer = apply_filters( 'mwai_chatbot_takeover', null, $query, $params );
			if ( !empty( $takeoverAnswer ) ) {
				return new WP_REST_Response( [ 'success' => true, 'reply' => $takeoverAnswer,
					'html' => $takeoverAnswer, 'usage' => null ], 200 );
			}

			// Moderation
			if ( $this->core->get_option( 'shortcode_chat_moderation' ) ) {
				global $mwai;
				$isFlagged = $mwai->moderationCheck( $query->prompt );
				if ( $isFlagged ) {
					return new WP_REST_Response( [ 
						'success' => false, 
						'message' => 'Sorry, your message has been rejected by moderation.' ], 403
					);
				}
			}

			// Awareness & Embeddings
				// TODO: This is same in Chatbot Legacy and Forms, maybe we should move it to the core?
				$embeddingsIndex = $params['embeddingsIndex'] ?? null;
				if ( $query->mode === 'chat' ) {
					$context = apply_filters( 'mwai_context_search', $context, $query, [ 'embeddingsIndex' => $embeddingsIndex ] );
					if ( !empty( $context ) ) {
						if ( isset( $context['content'] ) ) {
							$content = $this->core->cleanSentences( $context['content'] );
							$query->injectContext( $content );
						}
						else {
							error_log("AI Engine: A context without content was returned.");
						}
					}
				}

			$reply = $this->core->ai->run( $query );
			$rawText = $reply->result;
			$extra = [];
			if ( $context ) {
				$extra = [ 'embeddings' => $context['embeddings'] ];
			}
			$html = apply_filters( 'mwai_chatbot_reply', $rawText, $query, $params, $extra );
			if ( $this->core->get_option( 'shortcode_chat_formatting' ) ) {
				$html = $this->core->markdown_to_html( $html );
			}
			return new WP_REST_Response( [ 'success' => true, 'reply' => $rawText,
				'html' => $html, 'usage' => $reply->usage ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	public function rest_imagesbot( $request ) {
		try {
			$params = $request->get_json_params();
			$query = new Meow_MWAI_Query_Image( $params['prompt'] );
			$query->injectParams( $params );
			$reply = $this->core->ai->run( $query );
			return new WP_REST_Response( [ 'success' => true, 'images' => $reply->results, 'usage' => $reply->usage ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response( [ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
	}

	public function apply_chat_styles( $css, $chatbotId ) {
		$chatStyles = $this->core->get_option( 'shortcode_chat_styles' );
		return preg_replace_callback( '/--mwai-(\w+):\s*([^;]+);/', function ( $matches ) use ( $chatStyles ) {
			if ( isset( $chatStyles[$matches[1]] ) ) {
				return '--mwai-' . $matches[1] . ': ' . $chatStyles[$matches[1]] . ';';
			}
			return $matches[0];
		}, $css );
	}

	public function inject_chat() {
		$params = $this->core->get_option( 'shortcode_chat_params' );
		echo $this->chat( $params );
	}

	public function imageschat( $atts ) {
		$atts['mode'] = 'images';
		return $this->chat( $atts );
	}

	public function getCurrentUser() {
		if ( is_user_logged_in() ) {
			return wp_get_current_user();
		}
		return null;
	}

	public function handlePlaceholders( $data, $guestName = 'Guest: ' ) {
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

	public function formatUserName( $userName, $guestName = 'Guest: ' ) {
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

	public function formatAiName( $aiName ) {
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

	public function formatRawName( $aiName ) {
		return 'AI: ';
	}

	public function formatRawUserName( $userName, $guestName ) {
		return 'User: ';
	}

	public function chat( $atts ) {
		$this->usingChat = true;

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
		//$atts = apply_filters( 'mwai_chatbot_params_before', $atts );
		$atts = shortcode_atts( $defaults, $atts );
		//$atts = apply_filters( 'mwai_chatbot_params', $atts );

		// UI Parameters
		$aiName = addslashes( trim( $atts['ai_name'] ) );
		$userName = addslashes( trim( $atts['user_name'] ) );
		$guestName = addslashes( trim( $atts['guest_name'] ) );
		$sysName = addslashes( trim( $atts['sys_name'] ) );
		$context = addslashes( $atts['context'] );
		$context = preg_replace( '/\n/', "\\n", $context );
		$textSend = addslashes( trim( $atts['text_send'] ) );
		$textClear = addslashes( trim( $atts['text_clear'] ) );
		$textInputMaxLength = intval( $atts['text_input_maxlength'] );
		$textInputPlaceholder = addslashes( trim( $atts['text_input_placeholder'] ) );
		$textCompliance = ( trim( $atts['text_compliance'] ) );
		$startSentence = addslashes( trim( $atts['start_sentence'] ) );
		$window = filter_var( $atts['window'], FILTER_VALIDATE_BOOLEAN );
		$copyButton = filter_var( $atts['copy_button'], FILTER_VALIDATE_BOOLEAN );
		$fullscreen = filter_var( $atts['fullscreen'], FILTER_VALIDATE_BOOLEAN );
		$icon = isset( $atts['icon'] ) ? addslashes( trim( $atts['icon'] ) ) : '';
		$iconText = trim( $atts['icon_text'] );
		$iconAlt = addslashes( trim( $atts['icon_alt'] ) );
		$iconPosition = addslashes( trim( $atts['icon_position'] ) );
		$style = $atts['style'];

		// Validade & Enhance UI Parameters
		$aiName = $this->formatAiName( $aiName );
		$userName = $this->formatUserName( $userName, $guestName );
		$rawAiName = $this->formatRawName( $aiName );
		$rawUserName = $this->formatRawUserName( $userName, $guestName );

		// Chatbot System Parameters
		$id = empty( $atts['id'] ) ? uniqid() : $atts['id'];
		$typewriter = $this->core->get_option( 'shortcode_chat_typewriter' );
		$memorizeChat = !empty( $atts['id'] );
		$id = preg_replace( '/[^a-zA-Z0-9]/', '', $id );
		$env = $atts['env'];
		$mode = $atts['mode'];
		$maxResults = $mode === 'chat' ? 1 : $atts['max_results'];
		$maxSentences = !empty( $atts['max_messages'] ) ? intval( $atts['max_messages'] ) : 1;
		$sessionId = $this->core->get_session_id();
		$rest_nonce = wp_create_nonce( 'wp_rest' );
		$casuallyFineTuned = boolval( $atts['casually_fine_tuned'] );
		$embeddingsIndex = $atts['embeddings_index'];
		$promptEnding = addslashes( trim( $atts['prompt_ending'] ) );
		$completionEnding = addslashes( trim( $atts['completion_ending'] ) );
		if ( $casuallyFineTuned ) {
			$promptEnding = "\\n\\n###\\n\\n";
			$completionEnding = "\\n\\n";
		}
		$debugMode = $this->core->get_option( 'debug_mode' );

		// OpenAI Parameters
		$model = $atts['model'];
		$temperature = $atts['temperature'];
		$maxTokens = $atts['max_tokens'];
		$service = $atts['service'];
		$apiKey = $atts['api_key'];

		// Variables
		$apiUrl = get_rest_url( null, $mode === 'images' ? 'ai-chatbot/v1/imagesbot' : 'ai-chatbot/v1/chat' );
		$baseClasses = 'mwai-chat';
		$baseClasses .= ( $window ? ' mwai-window' : '' );
		$baseClasses .= ( !$window && $fullscreen ? ' mwai-fullscreen' : '' );
		$baseClasses .= ( $style === 'chatgpt' ? ' mwai-chatgpt' : '' );
		$baseClasses .= ( $window && !empty( $iconPosition ) ? ( ' mwai-' . $iconPosition ) : '' );

		// Output CSS
		ob_start();
		$style_content = '';
		if ( $style === 'chatgpt' ) {
			$style_content = $this->chatgpt_style( $id, $style );
		}
		$style_content = apply_filters( 'mwai_chatbot_style', $style_content, $id );
		echo wp_kses( $style_content, array( 'style' => array() ) );

		// Output HTML & CSS
		$chatStyles = $this->core->get_option( 'shortcode_chat_styles' );
		$iconUrl = MWAI_URL . '/images/chat-green.svg';
		if ( !empty( $icon ) ) {
			$iconUrl = $icon;
		}
		else if ( !empty( $chatStyles ) && isset( $chatStyles['icon'] ) ) {
			$url = $chatStyles['icon'];
			$iconUrl = $this->core->isUrl( $url ) ? $url : ( MWAI_URL . 'images/' . $chatStyles['icon'] );
		}
		?>
			<div id="mwai-chat-<?php echo esc_attr( $id ); ?>" class="<?php echo esc_attr( $baseClasses ); ?>">
				<?php if ( $window ) : ?>
					<div class="mwai-open-button">
						<?php if ( !empty( $iconText ) ) : ?>
							<div class="mwai-icon-text"><?php echo esc_html( $iconText ); ?></div>
						<?php endif; ?>
						<img width="64" height="64" alt="<?php echo esc_attr( $iconAlt ); ?>" src="<?php echo esc_url( $iconUrl ); ?>" />
					</div>
					<div class="mwai-header">
						<div class="mwai-buttons">
							<?php if ( $fullscreen ) : ?>
								<div class="mwai-resize-button"></div>
							<?php endif; ?>
							<div class="mwai-close-button"></div>
						</div>
					</div>
				<?php endif; ?>
				<div class="mwai-content">
					<div class="mwai-conversation">
					</div>
					<div class="mwai-input">
						<textarea rows="1" maxlength="<?php echo (int)$textInputMaxLength; ?>" placeholder="<?php echo esc_attr( $textInputPlaceholder ); ?>"></textarea>
						<button><span><?php echo esc_html( $textSend ); ?></span></button>
					</div>
					<?php if ( !empty( $textCompliance ) ) : ?>
						<div class="mwai-compliance">
							⚠️ <?php echo wp_kses_post( $textCompliance ); ?>
						</div>
					<?php endif; ?>
				</div>
			</div>

			<script>
			(function () {
				let isMobile = window.matchMedia( "only screen and (max-width: 760px)" ).matches;
				let isWindow = <?php echo $window ? 'true' : 'false' ?>;
				let isDebugMode = <?php echo $debugMode ? 'true' : 'false' ?>;
				let isFullscreen = <?php echo $fullscreen ? 'true' : 'false' ?>;
				let restNonce = '<?php echo esc_attr( $rest_nonce ) ?>';
				let apiURL = '<?php echo esc_url( $apiUrl ) ?>';
				let isCasuallyFineTuned = <?php echo $casuallyFineTuned ? 'true' : 'false' ?>;
				let rawUserName = '<?php echo esc_attr( $rawUserName ) ?>';
				let rawAiName = '<?php echo esc_attr( $rawAiName ) ?>';
				let userName = '<?php echo wp_kses_post( $userName ) ?>';
				let aiName = '<?php echo wp_kses_post( $aiName ) ?>';
				let sysName = '<?php echo wp_kses_post( $sysName ) ?>';
				let env = '<?php echo esc_attr( $env ) ?>';
				let apiKey = '<?php echo esc_attr( $apiKey ) ?>';
				let service = '<?php echo esc_attr( $service ) ?>';
				let session = '<?php echo esc_attr( $sessionId ) ?>';
				let mode = '<?php echo esc_attr( $mode ) ?>';
				let model = '<?php echo esc_attr( $model ) ?>';
				let context = isCasuallyFineTuned ? null : '<?php echo esc_attr( $context ) ?>';
				let embeddingsIndex = '<?php echo esc_attr( $embeddingsIndex ) ?>';
				let promptEnding = '<?php echo esc_attr( $promptEnding ) ?>';
				let stop = '<?php echo esc_attr( $completionEnding ) ?>';
				let startSentence = '<?php echo esc_attr( $startSentence ) ?>';
				let maxSentences = <?php echo (int)$maxSentences ?>;
				let memorizeChat = <?php echo $memorizeChat ? 'true' : 'false' ?>;
				let maxTokens = <?php echo (int)$maxTokens ?>;
				let maxResults = <?php echo (int)$maxResults ?>;
				let temperature = <?php echo str_replace(',', '.', (float)$temperature) ?>;
				let typewriter = <?php echo $typewriter ? 'true' : 'false' ?>;
				let copyButton = <?php echo $copyButton ? 'true' : 'false' ?>;
				let clientId = randomStr();
				let memorizedChat = { clientId, messages: [] };

				if (isDebugMode) {
					window.mwai_<?php echo esc_attr( $id ) ?> = {
						memorizedChat: memorizedChat,
						parameters: { mode: mode, model, temperature, maxTokens, context: context, startSentence,
							isMobile, isWindow, isFullscreen, isCasuallyFineTuned, memorizeChat, maxSentences,
							rawUserName, rawAiName, embeddingsIndex, typewriter, maxResults, userName, aiName, env, apiKey, service, session
						}
					};
				}

				function randomStr() {
					return Math.random().toString(36).substring(2);
				}

				// Set button text
				function setButtonText() {
					let input = document.querySelector('#mwai-chat-<?php echo esc_attr( $id ) ?> .mwai-input textarea');
					let button = document.querySelector('#mwai-chat-<?php echo esc_attr( $id ) ?> .mwai-input button');
					let buttonSpan = button.querySelector('span');
					if (memorizedChat.messages.length < 2) {
						buttonSpan.innerHTML = '<?php echo esc_html( $textSend ); ?>';
					}
					else if (!input.value.length) {
						button.classList.add('mwai-clear');
						buttonSpan.innerHTML = '<?php echo esc_html( $textClear ); ?>';
					}
					else {
						button.classList.remove('mwai-clear');
						buttonSpan.innerHTML = '<?php echo esc_html( $textSend ); ?>';
					}
				}

				// Inject timer
				function injectTimer(element) {
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
							seconds = seconds < 10 ? '0' + seconds : seconds;
							let display = minutes + ':' + seconds;
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
				function addReply(text, role = 'user', replay = false) {
					var conversation = document.querySelector('#mwai-chat-<?php echo esc_attr( $id ) ?> .mwai-conversation');

					if (memorizeChat) {
						localStorage.setItem('mwai-chat-<?php echo esc_attr( $id ) ?>', JSON.stringify(memorizedChat));
					}

					// If text is array, then it's image URLs. Let's create a simple gallery in HTML in $text.
					if (Array.isArray(text)) {
						var newText = '<div class="mwai-gallery">';
						for (var i = 0; i < text.length; i++) {
							newText += '<a href="' + text[i] + '" target="_blank"><img src="' + text[i] + '" />';
						}
						text = newText + '</div>';
					}

					var mwaiClasses = ['mwai-reply'];
					if (role === 'assistant') {
						mwaiClasses.push('mwai-ai');
					}
					else if (role === 'system') {
						mwaiClasses.push('mwai-system');
					}
					else {
						mwaiClasses.push('mwai-user');
					}
					var div = document.createElement('div');
					div.classList.add(...mwaiClasses);
					var nameSpan = document.createElement('span');
					nameSpan.classList.add('mwai-name');
					if (role === 'assistant') {
						nameSpan.innerHTML = aiName;
					}
					else if (role === 'system') {
						nameSpan.innerHTML = sysName;
					}
					else {
						nameSpan.innerHTML = userName;
					}
					var textSpan = document.createElement('span');
					textSpan.classList.add('mwai-text');
					textSpan.innerHTML = text;
					div.appendChild(nameSpan);
					div.appendChild(textSpan);

					// Copy Button
					if (copyButton && role === 'assistant') {
						var button = document.createElement('div');
						button.classList.add('mwai-copy-button');
						var firstElement = document.createElement('div');
						firstElement.classList.add('mwai-copy-button-one');
						var secondElement = document.createElement('div');
						secondElement.classList.add('mwai-copy-button-two');
						button.appendChild(firstElement);
						button.appendChild(secondElement);
						div.appendChild(button);
						button.addEventListener('click', function () {
							try {
								var content = textSpan.textContent;
								navigator.clipboard.writeText(content);
								button.classList.add('mwai-animate');
								setTimeout(function () {
									button.classList.remove('mwai-animate');
								}, 1000);
							}
							catch (err) {
								console.warn('Not allowed to copy to clipboard. Make sure your website uses HTTPS.');
							}
						});
					}

					conversation.appendChild(div);

					if (typewriter) {
						if (role === 'assistant' && text !== startSentence && !replay) {
							let typewriter = new Typewriter(textSpan, {
								deleteSpeed: 50, delay: 25, loop: false, cursor: '', autoStart: true,
								wrapperClassName: 'mwai-typewriter',
							});
							typewriter.typeString(text).start().callFunction((state) => {
								state.elements.cursor.setAttribute('hidden', 'hidden');
								typewriter.stop();
							});
						}
					}

					conversation.scrollTop = conversation.scrollHeight;
					setButtonText();

					// Syntax coloring
					if (typeof hljs !== 'undefined') {
						document.querySelectorAll('pre code').forEach((el) => {
							hljs.highlightElement(el);
						});
					}
				}

				function buildPrompt(last = 15) {
					let prompt = context ? (context + '\n\n') : '';
					memorizedChat.messages = memorizedChat.messages.slice(-last);

					// Casually fine tuned, let's use the last question
					if (isCasuallyFineTuned) {
						let lastLine = memorizedChat.messages[memorizedChat.messages.length - 1];
						prompt = lastLine.content + promptEnding;
						return prompt;
					}

					// Otherwise let's compile the latest conversation
					let conversation = memorizedChat.messages.map(x => x.who + x.content);
					prompt += conversation.join('\n');
					prompt += '\n' + rawAiName;
					return prompt;
				}

				// Function to request the completion
				function onSendClick() {
					let input = document.querySelector('#mwai-chat-<?php echo esc_attr( $id ) ?> .mwai-input textarea');
					let inputText = input.value.trim();

					// Reset the conversation if empty
					if (inputText === '') {
						clientId = randomStr();
						document.querySelector('#mwai-chat-<?php echo esc_attr( $id ) ?> .mwai-conversation').innerHTML = '';
						localStorage.removeItem('mwai-chat-<?php echo esc_attr( $id ) ?>')
						memorizedChat = { clientId: clientId, messages: [] };
						memorizedChat.messages.push({ 
							id: randomStr(),
							role: 'assistant',
							content: startSentence,
							who: rawAiName,
							html: startSentence
						});
						addReply(startSentence, 'assistant');
						return;
					}

					// Disable the button
					var button = document.querySelector('#mwai-chat-<?php echo esc_attr( $id ) ?> .mwai-input button');
					button.disabled = true;

					// Add the user reply
					memorizedChat.messages.push({
						id: randomStr(),
						role: 'user',
						content: inputText,
						who: rawUserName,
						html: inputText
					});
					addReply(inputText, 'user');
					input.value = '';
					input.setAttribute('rows', 1);
					input.disabled = true;

					let prompt = buildPrompt(maxSentences);

					const data = mode === 'images' ? {
						env, session: session,
						prompt: inputText,
						newMessage: inputText,
						model: model,
						maxResults,
						apiKey: apiKey,
						service: service,
						clientId: clientId,
					} : {
						env, session: session,
						prompt: prompt,
						context: context,
						messages: memorizedChat.messages,
						newMessage: inputText,
						userName: userName,
						aiName: aiName,
						model: model,
						temperature: temperature,
						maxTokens: maxTokens,
						maxResults: 1,
						apiKey: apiKey,
						service: service,
						embeddingsIndex: embeddingsIndex,
						stop: stop,
						clientId: clientId,
					};

					// Start the timer
					const stopTimer = injectTimer(button);

					// Send the request
					if (isDebugMode) {
						console.log('[BOT] Sent: ', data);
					}
					fetch(apiURL, { method: 'POST', headers: {
							'Content-Type': 'application/json',
							'X-WP-Nonce': restNonce,
						},
						body: JSON.stringify(data)
					})
					.then(response => response.json())
					.then(data => {
						if (isDebugMode) {
							console.log('[BOT] Recv: ', data);
						}
						if (!data.success) {
							addReply(data.message, 'system');
						}
						else {
							let html = data.images ? data.images : data.html;
							memorizedChat.messages.push({
								id: randomStr(),
								role: 'assistant',
								content: data.reply,
								who: rawAiName,
								html: html
							});
							addReply(html, 'assistant');
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
				function resizeTextArea(ev) {
					ev.target.style.height = 'auto';
					ev.target.style.height = ev.target.scrollHeight + 'px';
				}

				// Keep the textarea height in sync with the content
				function delayedResizeTextArea(ev) {
					window.setTimeout(resizeTextArea, 0, event);
				}

				// Init the chatbot
				function initMeowChatbot() {
					var input = document.querySelector('#mwai-chat-<?php echo esc_attr( $id ) ?> .mwai-input textarea');
					var button = document.querySelector('#mwai-chat-<?php echo esc_attr( $id ) ?> .mwai-input button');

					input.addEventListener('keypress', (event) => {
						let text = event.target.value;
						if (event.keyCode === 13 && !text.length && !event.shiftKey) {
							event.preventDefault();
							return;
						}
						if (event.keyCode === 13 && text.length && !event.shiftKey) {
							onSendClick();
						}
					});
					input.addEventListener('keydown', (event) => {
						var rows = input.getAttribute('rows');
						if (event.keyCode === 13 && event.shiftKey) {
							var lines = input.value.split('\n').length + 1;
							//mwaiSetTextAreaHeight(input, lines);
						}
					});
					input.addEventListener('keyup', (event) => {
						var rows = input.getAttribute('rows');
						var lines = input.value.split('\n').length ;
						//mwaiSetTextAreaHeight(input, lines);
						setButtonText();
					});

					input.addEventListener('change', resizeTextArea, false);
					input.addEventListener('cut', delayedResizeTextArea, false);
					input.addEventListener('paste', delayedResizeTextArea, false);
					input.addEventListener('drop', delayedResizeTextArea, false);
					input.addEventListener('keydown', delayedResizeTextArea, false);

					button.addEventListener('click', (event) => {
						onSendClick();
					});

					// If window, add event listener to mwai-open-button and mwai-close-button
					if ( isWindow ) {
						var openButton = document.querySelector('#mwai-chat-<?php echo esc_attr( $id ) ?> .mwai-open-button');
						openButton.addEventListener('click', (event) => {
							var chat = document.querySelector('#mwai-chat-<?php echo esc_attr( $id ) ?>');
							chat.classList.add('mwai-open');
							// Only focus only on desktop (to avoid the mobile keyboard to kick-in)
							if (!isMobile) {
								input.focus();
							}
						});
						var closeButton = document.querySelector('#mwai-chat-<?php echo esc_attr( $id ) ?> .mwai-close-button');
						closeButton.addEventListener('click', (event) => {
							var chat = document.querySelector('#mwai-chat-<?php echo esc_attr( $id ) ?>');
							chat.classList.remove('mwai-open');
						});
						if (isFullscreen) {
							var resizeButton = document.querySelector('#mwai-chat-<?php echo esc_attr( $id ) ?> .mwai-resize-button');
							resizeButton.addEventListener('click', (event) => {
								var chat = document.querySelector('#mwai-chat-<?php echo esc_attr( $id ) ?>');
								chat.classList.toggle('mwai-fullscreen');
							});
						}
					}

					// Get back the previous chat if any for the same ID
					var chatHistory = [];
					if (memorizeChat) {
						chatHistory = localStorage.getItem('mwai-chat-<?php echo esc_attr( $id ) ?>');
						if (chatHistory) {
							memorizedChat = JSON.parse(chatHistory);
							if (memorizedChat && memorizedChat.clientId && memorizedChat.messages) {
								clientId = memorizedChat.clientId;
								memorizedChat.messages = memorizedChat.messages.filter(x => x && x.html && x.role);
								memorizedChat.messages.forEach(x => {
									addReply(x.html, x.role, true);
								});
							}
							else {
								memorizedChat = null;
							}
						}
						if (!memorizedChat) {
							memorizedChat = {
								clientId: clientId,
								messages: []
							};
						}
					}
					if (memorizedChat.messages.length === 0) {
						memorizedChat.messages.push({ 
							id: randomStr(),
							role: 'assistant',
							content: startSentence,
							who: rawAiName,
							html: startSentence
						});
						addReply(startSentence, 'assistant');
					}
				}

				// Let's go totally meoooow on this!
				initMeowChatbot();
			})();
			</script>

		<?php
		$output = ob_get_contents();
		ob_end_clean();
		$output = apply_filters( 'mwai_chatbot', $output, $atts );
		return $output;
	}
}
