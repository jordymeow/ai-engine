<?

class Meow_MWAI_Shortcodes {
  private $core = null;
  private $namespace = 'ai-engine/v1';

  public function __construct( $core ) {
    $this->core = $core;
    add_shortcode( 'mwai_chat', array( $this, 'chat' ) );
    add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
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

  function rest_chat( $request ) {
    try {
			$params = $request->get_json_params();
			$prompt = $params['prompt'];
			$query = new Meow_MWAI_Query( $prompt, 2048 );
			$answer = $this->core->ai->run( $query );
			return new WP_REST_Response([ 'success' => true, 'data' => $answer->result, 'usage' => $answer->usage ], 200 );
		}
		catch ( Exception $e ) {
			return new WP_REST_Response([ 'success' => false, 'message' => $e->getMessage() ], 500 );
		}
  }

  function chat( $atts ) {
    $atts = shortcode_atts([
      'context' => "Converse as if you were Michael Jackson, talking from the afterlife. Be friendly, creative.",
      'ai_prompt' => "Michael: ",
      'user_prompt' => "You: ",
      'start_sentence' => "Hi, my friend.",
      'temperature' => 0.8,
      'engine' => 'davinci'
    ], $atts, 'meow_ai' );

    $id = uniqid();
    $apiUrl = get_rest_url( null, 'ai-engine/v1/chat' );
    $onSentClickFn = "mwai_{$id}_onSendClick";
    $addReplyFn = "mwai_{$id}_addReply";
    ob_start();
    ?>

      <div id="mwai-chat-<?= $id ?>" class="mwai-chat">
        <div class="mwai-conversation">
        </div>
        <div class="mwai-input">
          <input type="text" placeholder="Type your message here..." />
          <button onclick="<?= $onSentClickFn ?>()">Send</button>
        </div>
      </div>

      <script>

        // Function to add a reply in the conversation
        function <?= $addReplyFn ?>(text, type = 'user') {
          var conversation = document.querySelector('#mwai-chat-<?= $id ?> .mwai-conversation');
          if (type === 'ai') {
            conversation.innerHTML += '<div class="mwai-ai">' + text + '</div>';
          }
          else {
            conversation.innerHTML += '<div class="mwai-user">' + '<?= $atts['user_prompt'] ?>' + text + '</div>';
          }
        }

        // Function to request the completion
        function <?= $onSentClickFn ?>() {

          // Disable the button
          var button = document.querySelector('#mwai-chat-<?= $id ?> .mwai-input button');
          button.disabled = true;

          // Add the user reply
          var input = document.querySelector('#mwai-chat-<?= $id ?> .mwai-input input');
          <?= $addReplyFn ?>(input.value, 'user');
          input.value = '';
          input.disabled = true;

          // Request the completion and add the reply
          var conversation = document.querySelector('#mwai-chat-<?= $id ?> .mwai-conversation');
          var promptToUse = '<?= $atts['context'] ?>' + conversation.innerText + '\n';
          fetch('<?= $apiUrl ?>', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptToUse })
          })
          .then(response => response.json())
          .then(data => {
            <?= $addReplyFn ?>(data.data, 'ai');
            button.disabled = false;
            input.disabled = false;
          })
          .catch(error => {
            console.error(error);
            button.disabled = false;
            input.disabled = false;
          });
        }

        <?= $addReplyFn ?>('<?= $atts['ai_prompt'] ?>' + '<?= $atts['start_sentence'] ?>', 'ai');
      </script>

    <?
    $output = ob_get_contents();
    ob_end_clean();
    return $output;
  }
}