<?php

// Params for the chatbot (front and server)
define( 'MWAI_CHATBOT_FRONT_PARAMS', [ 'id', 'customId', 'aiName', 'userName', 'guestName', 'aiAvatar', 'userAvatar', 'guestAvatar', 'aiAvatarUrl', 'userAvatarUrl', 'guestAvatarUrl', 'textSend', 'textClear', 'imageUpload', 'fileUpload', 'fileSearch', 'mode', 'textInputPlaceholder', 'textInputMaxLength', 'textCompliance', 'startSentence', 'localMemory', 'themeId', 'window', 'icon', 'iconText', 'iconTextDelay', 'iconAlt', 'iconPosition', 'iconBubble', 'fullscreen', 'copyButton', 'headerSubtitle' ] );

define( 'MWAI_CHATBOT_SERVER_PARAMS', [ 'id', 'envId', 'scope', 'mode', 'contentAware', 'context', 'startSentence', 'embeddingsEnvId', 'embeddingsIndex', 'embeddingsNamespace', 'assistantId', 'instructions', 'resolution', 'voice', 'model', 'temperature', 'maxTokens', 'contextMaxLength', 'maxResults', 'apiKey', 'functions', 'mcpServers', 'tools', 'historyStrategy', 'previousResponseId', 'parentBotId' ] );

// Params for the discussions (front and server)
define( 'MWAI_DISCUSSIONS_FRONT_PARAMS', [ 'themeId', 'textNewChat' ] );
define( 'MWAI_DISCUSSIONS_SERVER_PARAMS', [ 'customId' ] );

class Meow_MWAI_Modules_Chatbot {
	private $core = null;
	private $namespace = 'mwai-ui/v1';
	private $siteWideChatId = null;

	public function __construct() {
		global $mwai_core;
		$this->core = $mwai_core;
		$this->siteWideChatId = $this->core->get_option( 'botId' );

		add_shortcode( 'mwai_chatbot', array( $this, 'chat_shortcode' ) );
		add_action( 'rest_api_init', array( $this, 'rest_api_init' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'register_scripts' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'register_scripts' ) );
		if ( $this->core->get_option( 'chatbot_discussions' ) ) {
      add_shortcode( 'mwai_discussions', [ $this, 'chatbot_discussions' ] );
    }
	}

	public function register_scripts() {
		// Load JS
		$physical_file = trailingslashit( MWAI_PATH ) . 'app/chatbot.js';	
		$cache_buster = file_exists( $physical_file ) ? filemtime( $physical_file ) : MWAI_VERSION;
		wp_register_script( 'mwai_chatbot', trailingslashit( MWAI_URL )
			. 'app/chatbot.js', [ 'wp-element' ], $cache_buster, false );

    // Actual loading of the scripts
    $hasSiteWideChat = $this->siteWideChatId && $this->siteWideChatId !== 'none';
    if ( is_admin() || $hasSiteWideChat ) {
      $themeId = null;
      if ( $hasSiteWideChat ) {
        $bot = $this->core->get_chatbot( $this->siteWideChatId );
        if ( $bot && isset( $bot['themeId'] ) ) {
          $themeId = $bot['themeId'];
        }
      }
      $this->enqueue_scripts( is_admin() ? null : $themeId );
      if ( $hasSiteWideChat ) {
        // Chatbot Injection
        add_action( 'wp_footer', array( $this, 'inject_chat' ) );
      }
    }
  }

  public function enqueue_scripts( $themeId = null ) {
    wp_enqueue_script( "mwai_chatbot" );
    if ( $this->core->get_option( 'syntax_highlight' ) ) {
      wp_enqueue_script( "mwai_highlight" );
    }
    if ( $themeId ) {
      $this->core->enqueue_theme( $themeId );
    }
    else {
      $this->core->enqueue_themes();
    }
  }

	public function rest_api_init() {
		register_rest_route( $this->namespace, '/chats/submit', array(
			'methods' => 'POST',
			'callback' => [ $this, 'rest_chat' ],
			'permission_callback' => array( $this->core, 'check_rest_nonce' )
		) );
	}

	public function basics_security_check( $botId, $customId, $newMessage, $newFileId ) {
		if ( !$botId && !$customId ) {
			Meow_MWAI_Logging::warn( "The query was rejected - no botId nor id was specified." );
			return false;
		}

		if ( $newFileId ) {
			return true;
		}

		$length = strlen( empty( $newMessage ) ? "" : $newMessage );
		if ( $length < 1 ) {
			Meow_MWAI_Logging::warn( "The query was rejected - message was too short." );
			return false;
		}
		return true;
	}

	public function build_final_res( $botId, $newMessage, $newFileId, $params, $reply, $images, $actions, $usage, $responseId = null ) {
		$filterParams = [
			'step' => 'reply',
			'botId' => $botId,
			'reply' => $reply,
			'images' => $images,
			'newMessage' => $newMessage,
			'newFileId' => $newFileId,
			'params' => $params,
			'usage' => $usage,
			'messages' => $params['messages'] ?? [],
			'isNewConversation' => empty( $params['messages'] ) || count( $params['messages'] ) <= 1,
		];
		$actions = apply_filters( 'mwai_chatbot_actions', $actions, $filterParams );
		$blocks = apply_filters( 'mwai_chatbot_blocks', [], $filterParams );
		$shortcuts = apply_filters( 'mwai_chatbot_shortcuts', [], $filterParams );
		$actions = $this->sanitize_actions( $actions );
		$blocks = $this->sanitize_blocks( $blocks );
		$shortcuts = $this->sanitize_shortcuts( $shortcuts );
		$result = [
			'success' => true,
			'reply' => $reply,
			'images' => $images,
			'actions' => $actions,
			'shortcuts' => $shortcuts,
			'blocks' => $blocks,
			'usage' => $usage
		];
		
		// Add response ID if available
		if ( !empty( $responseId ) ) {
			$result['responseId'] = $responseId;
		}
		
		return $result;
	}

	public function rest_chat( $request ) {
		$params = $request->get_json_params();
		$botId = $params['botId'] ?? null;
		$customId = $params['customId'] ?? null;
		$stream = $params['stream'] ?? false;
		$newMessage = trim( $params['newMessage'] ?? '' );
		$newFileId = $params['newFileId'] ?? null;
		

		if ( !$this->basics_security_check( $botId, $customId, $newMessage, $newFileId )) {
			return new WP_REST_Response( [ 
				'success' => false, 
				'message' => apply_filters( 'mwai_ai_exception', 'Sorry, your query has been rejected.' )
			], 403 );
		}

		try {
			$data = $this->chat_submit( $botId, $newMessage, $newFileId, $params, $stream );
			$final_res = $this->build_final_res( $botId, $newMessage, $newFileId, $params,
				$data['reply'], $data['images'], $data['actions'], $data['usage'], 
				$data['responseId'] ?? null );
			return new WP_REST_Response( $final_res, 200 );
		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			return new WP_REST_Response( [ 
				'success' => false, 
				'message' => $message
			], 500 );
		}
	}

	private function sanitize_items( $items, $supported_types, $type_name ) {
		if ( empty( $items ) ) {
			return $items;
		}
		$sanitized_items = [];
 		foreach ( $items as $item ) {
			if ( isset( $supported_types[$item['type']] ) ) {
				$is_valid = true;
				foreach ( $supported_types[$item['type']] as $param ) {
					if ( !isset( $item['data'][$param] ) ) {
						$is_valid = false;
						Meow_MWAI_Logging::warn( "The query was rejected - missing required parameter '{$param}' for {$type_name} type: {$item['type']}." );
						break;
					}
				}
				if ( $is_valid ) {
					$sanitized_items[] = $item;
				}
			}
			else {
				Meow_MWAI_Logging::warn( "The query was rejected - unsupported {$type_name} type: {$item['type']}." );
			}
		}
		return $sanitized_items;
	}	
	
	public function sanitize_actions( $actions ) {
		$supported_action_types = [
			'function' => ['name', 'args'],
			'javascript' => ['snippet'],
		];
		return $this->sanitize_items( $actions, $supported_action_types, 'action' );
	}
	
	public function sanitize_blocks( $blocks ) {
		$supported_block_types = [
			'content' => ['html'],
		];
		return $this->sanitize_items( $blocks, $supported_block_types, 'block' );
	}	

	public function sanitize_shortcuts( $shortcuts ) {
		$supported_shortcut_types = [
			'message' => ['label', 'message'],
			'callback' => ['label', 'onClick'],
		];
		return $this->sanitize_items( $shortcuts, $supported_shortcut_types, 'shortcut' );
	}

	#region Messages Integrity Check

	function messages_integrity_diff(  $messages1,  $messages2 ) {
		// Collect messages with role not 'user' from messages1
		$messagesList1 = array();
		foreach(  $messages1 as $msg ) {
			$role = isset(  $msg->role ) ? $msg->role : ( isset(  $msg['role'] ) ? $msg['role'] : null );
			$content = isset(  $msg->content ) ? $msg->content : ( isset(  $msg['content'] ) ? $msg['content'] : null );
			if(  $role && $role != 'user' ) {
				$messageData = array( 'role' => $role, 'content' => $content );
				$messagesList1[] = $messageData;
			}
		}

		// Collect messages with role not 'user' from messages2
		$messagesList2 = array();
		foreach(  $messages2 as $msg ) {
			$role = isset(  $msg->role ) ? $msg->role : ( isset(  $msg['role'] ) ? $msg['role'] : null );
			$content = isset(  $msg->content ) ? $msg->content : ( isset(  $msg['content'] ) ? $msg['content'] : null );
			if(  $role && $role != 'user' ) {
				$messageData = array( 'role' => $role, 'content' => $content );
				$messagesList2[] = $messageData;
			}
		}

		// Count occurrences of each message in messagesList1
		$counts1 = array();
		foreach(  $messagesList1 as $msg ) {
			$key = serialize(  $msg );
			if(  isset(  $counts1[ $key ] ) ) {
				$counts1[ $key ]++;
			} else {
				$counts1[ $key ] = 1;
			}
		}

		// Count occurrences of each message in messagesList2
		$counts2 = array();
		foreach(  $messagesList2 as $msg ) {
			$key = serialize(  $msg );
			if(  isset(  $counts2[ $key ] ) ) {
				$counts2[ $key ]++;
			} else {
				$counts2[ $key ] = 1;
			}
		}

		// Compare counts to find unmatched messages
		$all_keys = array_unique( array_merge( array_keys(  $counts1 ), array_keys(  $counts2 ) ) );

		$diffs = array();
		foreach(  $all_keys as $key ) {
			$count1 = isset(  $counts1[ $key ] ) ? $counts1[ $key ] : 0;
			$count2 = isset(  $counts2[ $key ] ) ? $counts2[ $key ] : 0;
			if(  $count1 != $count2 ) {
				$message = unserialize(  $key );
				$diffs[] = array(
					'message' => $message,
					'count_in_messages1' => $count1,
					'count_in_messages2' => $count2
				);
			}
		}

		return $diffs;
	}

	private function calculate_messages_checksum( $messages ) {
    $messages_to_hash = [];
    foreach ( $messages as $msg ) {
			$role = is_array( $msg ) ? ($msg['role'] ?? '') : (is_object( $msg ) ? ($msg->role ?? '') : '');
			$content = is_array( $msg ) ? ($msg['content'] ?? '') : (is_object( $msg ) ? ($msg->content ?? '') : '');
			if ( in_array( $role, ['assistant', 'system'] ) ) {
				$messages_to_hash[] = [ 'role' => $role, 'content' => $content ];
			}
    }
    return md5( json_encode( $messages_to_hash ) );
	}

	#endregion

	public function chat_submit( $botId, $newMessage, $newFileId = null, $params = [], $stream = false ) {
		try {
			$chatbot = null;
			$customId = $params['customId'] ?? null;

			// Custom Chatbot
			if ( $customId ) {
				$chatbot = get_transient( 'mwai_custom_chatbot_' . $customId );
			}
			// Registered Chatbot
			if ( !$chatbot && $botId ) {
				$chatbot = $this->core->get_chatbot( $botId );
			}

			if ( !$chatbot ) {
				Meow_MWAI_Logging::warn( "The query was rejected - no chatbot was found." );
				throw new Exception( 'Sorry, your query has been rejected.' );
			}

			$textInputMaxLength = $chatbot['textInputMaxLength'] ?? null;
			if ( $textInputMaxLength && $this->core->safe_strlen( $newMessage ) > (int)$textInputMaxLength ) {
				Meow_MWAI_Logging::warn( "The query was rejected - message was too long." );
				throw new Exception( 'Sorry, your query has been rejected.' );
			}

			// We need to check the integrity of the messages sent by the client.
			// This is important to ensure that the messages are not tampered with.

			// Messages Integrity Check with Checksums
			$chatId = $params['chatId'] ?? 'default';
			$checksum_key = 'mwai_chatbot_checksum_' . $chatId;
			$stored_checksum = get_transient( $checksum_key );
			$client_messages = $params['messages'] ?? [];
			$client_checksum = $this->calculate_messages_checksum( $client_messages );
			if ( $stored_checksum && $stored_checksum !== $client_checksum ) {
				Meow_MWAI_Logging::warn( "Integrity Check: Messages integrity check failed. Assistant or system messages sent by the client do not match stored messages. Please enable the Discussions module for better logs." );
			}

			// Messages Integrity Check with Discussions
			if ( $this->core->get_option( 'chatbot_discussions' ) ) {
				$discussion = $this->core->discussions->get_discussion( $botId ? $botId: $customId, $params['chatId'] );
				if ( $discussion ) {
					$messages = $discussion['messages'];
					$diffs = $this->messages_integrity_diff( $messages, $params['messages'] );
					if ( count( $diffs ) > 0 ) {
						Meow_MWAI_Logging::warn( "Integrity Check: It seems the messages in the discussion #{$discussion['id']} do not match the ones sent by the client." );
					}
					
					// Load previousResponseId from discussion extra data if not provided by client
					if ( empty( $params['previousResponseId'] ) && !empty( $discussion['extra'] ) ) {
						$extra = json_decode( $discussion['extra'], true );
						if ( !empty( $extra['previousResponseId'] ) ) {
							// Check if response is not older than 30 days
							$responseDate = !empty( $extra['previousResponseDate'] ) ? strtotime( $extra['previousResponseDate'] ) : 0;
							$thirtyDaysAgo = time() - (30 * 24 * 60 * 60);
							
							if ( $responseDate > $thirtyDaysAgo ) {
								$params['previousResponseId'] = $extra['previousResponseId'];
							}
						}
					}
				}
				else {
					// No discussion yet? We still need to check the startSentence.
					$startSentence = isset( $chatbot['startSentence'] ) ? $chatbot['startSentence'] : null;
					$messages = [];
					if ( !empty( $startSentence ) ) {
						$messages[] = [ 'role' => 'assistant', 'content' => $startSentence ];
					}
					$diffs = $this->messages_integrity_diff( $messages, $params['messages'] );
					if ( count( $diffs ) > 0 ) {
						Meow_MWAI_Logging::warn( "Integrity Check: It seems the messages in the discussion do not match the ones sent by the client: " . json_encode( $diffs ) );
					}
				}
			}

			// Create QueryText
			$context = null;
			$streamCallback = null;
			$mode = $chatbot['mode'] ?? 'chat';

			if ( $mode === 'images' ) {
				// If there's an uploaded file, use EditImage query instead
				if ( !empty( $newFileId ) ) {
					$query = new Meow_MWAI_Query_EditImage( $newMessage );
					
					// Handle the uploaded image
					$url = $this->core->files->get_url( $newFileId );
					$mimeType = $this->core->files->get_mime_type( $newFileId );
					$isIMG = in_array( $mimeType, [ 'image/jpeg', 'image/png', 'image/gif', 'image/webp' ] );
					
					if ( $isIMG ) {
						$query->set_file( Meow_MWAI_Query_DroppedFile::from_url( $url, 'vision', $mimeType ) );
						$fileId = $this->core->files->get_id_from_refId( $newFileId );
						$this->core->files->update_purpose( $fileId, 'vision' );
					}
				}
				else {
					$query = new Meow_MWAI_Query_Image( $newMessage );
				}

				// Handle Params
				$newParams = [];
				foreach ( $chatbot as $key => $value ) {
					$newParams[$key] = $value;
				}
				foreach ( $params as $key => $value ) {
					$newParams[$key] = $value;
				}
				$params = apply_filters( 'mwai_chatbot_params', $newParams );
				$params['scope'] = empty( $params['scope'] ) ? 'chatbot' : $params['scope'];
				
				
				$query->inject_params( $params );
			}
			else {
				$query = $mode === 'assistant' ? new Meow_MWAI_Query_Assistant( $newMessage ) : 
					new Meow_MWAI_Query_Text( $newMessage, 1024 );

				// Handle Params
				$newParams = [];
				foreach ( $chatbot as $key => $value ) {
					$newParams[$key] = $value;
				}
				foreach ( $params as $key => $value ) {
					$newParams[$key] = $value;
				}
				$params = apply_filters( 'mwai_chatbot_params', $newParams );
				$params['scope'] = empty( $params['scope'] ) ? 'chatbot' : $params['scope'];
				
				
				$query->inject_params( $params );

				$storeId = null;
				if ( $mode === 'assistant' ) {
					$chatId = $params['chatId'] ?? null;
					if ( !empty( $chatId ) ) {
						$discussion = $this->core->discussions->get_discussion( $query->botId, $chatId );
						if ( isset( $discussion['storeId'] ) ) {
							$storeId = $discussion['storeId'];
							$query->setStoreId( $storeId );
						}	
					}
				}

				// Support for Uploaded Image
				if ( !empty( $newFileId ) ) {

					// Get extension and mime type
					$isImage = $this->core->files->is_image( $newFileId );			

					if ( $mode === 'assistant' && !$isImage ) {
						$url = $this->core->files->get_path( $newFileId );
						$data = $this->core->files->get_data( $newFileId );
						$openai = Meow_MWAI_Engines_Factory::get_openai( $this->core, $query->envId );
						$filename = basename( $url );

						// Upload the file
						$file = $openai->upload_file( $filename, $data, 'assistants' );

						// Create a store
						if ( empty( $storeId ) ) {
							$chatbotName = 'mwai_' . strtolower( !empty( $chatbot['name'] ) ? $chatbot['name'] : 'default' );
							if ( !empty( $query->chatId ) ) {
								$chatbotName .= "_" . $query->chatId;
							}
							$metadata = [];
							if ( !empty( $chatbot['assistantId'] ) ) {
								$metadata['assistantId'] = $chatbot['assistantId'];
							}
							if ( !empty( $query->chatId ) ) {
								$metadata['chatId'] = $query->chatId;
							}
							$expiry = $this->core->get_option( 'image_expires' );
							$storeId = $openai->create_vector_store( $chatbotName, $expiry, $metadata );
							$query->setStoreId( $storeId );
						}	

						// Add the file to the store
						$storeFileId = $openai->add_vector_store_file( $storeId, $file['id'] );

						// Update the local file with the OpenAI RefId, StoreId and StoreFileId
						$openAiRefId = $file['id'];
						$internalFileId = $this->core->files->get_id_from_refId( $newFileId );
        		$this->core->files->update_refId( $internalFileId, $openAiRefId );
						$this->core->files->update_envId( $internalFileId, $query->envId );
						$this->core->files->update_purpose( $internalFileId, 'assistant-in' );
						$this->core->files->add_metadata( $internalFileId, 'assistant_storeId', $storeId );
						$this->core->files->add_metadata( $internalFileId, 'assistant_storeFileId', $storeFileId );
						$newFileId = $openAiRefId;
						$scope = $params['fileSearch'];
						if ( $scope === 'discussion' || $scope === 'user' || $scope === 'assistant' ) {
							$id = $this->core->files->get_id_from_refId( $newFileId );
							$this->core->files->add_metadata( $id, 'assistant_scope', $scope );
						}
					}
					else {
						$url = $this->core->files->get_url( $newFileId );
						$mimeType = $this->core->files->get_mime_type( $newFileId );
      			$isIMG = in_array( $mimeType, [ 'image/jpeg', 'image/png', 'image/gif', 'image/webp' ] );
						$purposeType = $isIMG ? 'vision' : 'files';
						$query->set_file( Meow_MWAI_Query_DroppedFile::from_url( $url, $purposeType, $mimeType ) );
						$fileId = $this->core->files->get_id_from_refId( $newFileId );
						$this->core->files->update_envId( $fileId, $query->envId );
						$this->core->files->update_purpose( $fileId, $purposeType );
						$this->core->files->add_metadata( $fileId, 'query_envId', $query->envId );
						$this->core->files->add_metadata( $fileId, 'query_session', $query->session );
					}
				}

				// Takeover
				$takeoverAnswer = apply_filters( 'mwai_chatbot_takeover', null, $query, $params );
				if ( !empty( $takeoverAnswer ) ) {
					$rawText = apply_filters( 'mwai_chatbot_reply', $takeoverAnswer, $query, $params, [] );
					return [
						'reply' => $rawText,
						'chatId' => $this->core->fix_chat_id( $query, $params ),
						'images' => null,
						'actions' => [],
						'usage' => null
					];
				}

				// Moderation
				$moderationEnabled = $this->core->get_option( 'module_moderation' ) &&
					$this->core->get_option( 'shortcode_chat_moderation' );
				if ( $moderationEnabled ) {
					global $mwai;
					$isFlagged = $mwai->moderationCheck( $query->get_message() );
					if ( $isFlagged ) {
						throw new Exception( 'Sorry, your message has been rejected by moderation.' );
					}
				}

				// Setup streaming if enabled (before embeddings to capture those events)
				$streamCallback = null;
				if ( $stream ) {
					$streamCallback = function( $reply ) use ( $query ) {
						// Support both legacy string data and new Event objects
						if ( is_string( $reply ) ) {
							$this->core->stream_push( [ 'type' => 'live', 'data' => $reply ], $query );
						} else {
							$this->core->stream_push( $reply, $query );
						}
					};
					header( 'Cache-Control: no-cache' );
					header( 'Content-Type: text/event-stream' );
					// This is useful to disable buffering in nginx through headers.
					header( 'X-Accel-Buffering: no' );
					ob_implicit_flush( true );
					ob_end_flush();
				}

				// Awareness & Embeddings
				$context = $this->core->retrieve_context( $params, $query, $streamCallback );
				if ( !empty( $context ) ) {
					$query->set_context( $context['content'] );
				}

				// Function Aware
				$query = apply_filters( 'mwai_chatbot_query', $query, $params );
			}

			// Process Query

			$reply = $this->core->run_query( $query, $streamCallback, true );
			$rawText = $reply->result;
			$extra = [];
			if ( $context ) {
				$extra = [ 'embeddings' => isset( $context['embeddings'] ) ? $context['embeddings'] : null ];
			}
			// Add response ID to extra for discussion storage
			if ( !empty( $reply->id ) ) {
				$extra['responseId'] = $reply->id;
			}
			$rawText = apply_filters( 'mwai_chatbot_reply', $rawText, $query, $params, $extra );

			// Integrity Check: We need to store the checksum of the messages sent by the client.
			$stored_messages = $client_messages;
			$stored_messages[] = [ 'role' => 'user', 'content' => $newMessage ];
			$stored_messages[] = [ 'role' => 'assistant', 'content' => $rawText ];
			$stored_checksum = $this->calculate_messages_checksum( $stored_messages );
			set_transient( $checksum_key, $stored_checksum, 60 * 60 * 24 * 30 );

			// Actions
			$actions = [];
			if ( $reply->needClientActions ) {
				foreach ( $reply->needClientActions as $action ) {
					$actions[] = [
						'type' => 'function',
						'data' => [
							'name' => $action['function']->name,
							'args' => $action['arguments']
						]
					];
				}
			}

			$restRes = [
				'reply' => $rawText,
				'chatId' => $this->core->fix_chat_id( $query, $params ),
				'images' => $reply->get_type() === 'images' ? $reply->results : null,
				'actions' => $actions,
				'usage' => $reply->usage
			];

			// Add response ID if available (for Responses API)
			if ( !empty( $reply->id ) ) {
				$restRes['responseId'] = $reply->id;
			}

			// Process Reply
			if ( $stream ) {
				$final_res = $this->build_final_res( $botId, $newMessage, $newFileId, $params,
					$restRes['reply'], $restRes['images'], $restRes['actions'], $restRes['usage'],
					$restRes['responseId'] ?? null );
				$this->core->stream_push( [ 'type' => 'end', 'data' => json_encode( $final_res ) ], $query );
				die();
			}
			else {
				return $restRes;
			}

		}
		catch ( Exception $e ) {
			$message = apply_filters( 'mwai_ai_exception', $e->getMessage() );
			if ( $stream ) { 
				$this->core->stream_push( [ 'type' => 'error', 'data' => $message ], $query );
				die();
			}
			else {
				throw $e;
			}
		}
	}

	public function inject_chat() {
		$params = $this->core->get_chatbot( $this->siteWideChatId );
		$clean_params = [];
		if ( !empty( $params ) ) {
			$clean_params['window'] = true;
			$clean_params['id'] = $this->siteWideChatId;
			echo $this->chat_shortcode( $clean_params );
		}
		return null;
	}

	public function build_front_params( $botId, $customId ) {
		$frontSystem = [
			'botId' => $customId ? null : $botId,
			'customId' => $customId,
			'userData' => $this->core->get_user_data(),
			'sessionId' => $this->core->get_session_id(),
			'restNonce' => $this->core->get_nonce(),
			'contextId' => get_the_ID(),
			'pluginUrl' => MWAI_URL,
			'restUrl' => untrailingslashit( get_rest_url() ),
			'stream' => $this->core->get_option( 'ai_streaming' ),
			'debugMode' => $this->core->get_option('module_devtools') && $this->core->get_option( 'debug_mode' ),
			'speech_recognition' => $this->core->get_option( 'speech_recognition' ),
			'speech_synthesis' => $this->core->get_option( 'speech_synthesis' ),
			'typewriter' => $this->core->get_option( 'chatbot_typewriter' ),
			'virtual_keyboard_fix' => $this->core->get_option( 'virtual_keyboard_fix' )
		];
		return $frontSystem;
	}

  public function resolveBotInfo( &$atts )
  {
    $chatbot = null;
    $botId = $atts['id'] ?? null;
    $customId = $atts['custom_id'] ?? null;
		$parentBotId = null;

    if ( !$botId && !$customId ) {
      $botId = "default";
    }
    if ( $botId ) {
      $chatbot = $this->core->get_chatbot( $botId );
      if (!$chatbot) {
        $botId = $botId ?: 'N/A';
        return [
          'error' => "AI Engine: Chatbot '{$botId}' not found. If you meant to set an ID for your custom chatbot, please use 'custom_id' instead of 'id'.",
        ];
      }
    }
    $chatbot = $chatbot ?: $this->core->get_chatbot( 'default' );
    if ( !empty( $customId ) ) {
			if ( $botId !== null ) {
				$parentBotId = $botId;
      	$botId = null;
			}
    }
		unset( $atts['id'] );
    return [
      'chatbot' => $chatbot,
      'botId' => $botId,
      'customId' => $customId,
			'parentBotId' => $parentBotId
    ];
  }

	public function chat_shortcode( $atts ) {
		$atts = empty( $atts ) ? [] : $atts;

    foreach ( $atts as $key => $value ) {
			$atts[ $key ] = urldecode( $value );
		}

		// Let the user override the chatbot params
		$atts = apply_filters( 'mwai_chatbot_params', $atts );

    // Resolve the bot info
		$resolvedBot = $this->resolveBotInfo( $atts, 'chatbot' );
    if ( isset( $resolvedBot['error'] ) ) {
      return $resolvedBot['error'];
    }
    $chatbot = $resolvedBot['chatbot'];
    $botId = $resolvedBot['botId'];
    $customId = $resolvedBot['customId'];
		$parentBotId = $resolvedBot['parentBotId'];

		// Rename the keys of the atts into camelCase to match the internal params system.
		$atts = array_map( function( $key, $value ) {
			$key = str_replace( '_', ' ', $key );
			$key = ucwords( $key );
			$key = str_replace( ' ', '', $key );
			$key = lcfirst( $key );
			return [ $key => $value ];
		}, array_keys( $atts ), $atts );
		$atts = array_merge( ...$atts );

		if ( !empty( $parentBotId ) ) {
			$atts['parentBotId'] = $parentBotId;
		}

		$frontParams = [];
		foreach ( MWAI_CHATBOT_FRONT_PARAMS as $param ) {
			// Let's go through the overriden or custom params first (the ones passed in the shortcode)
			if ( isset( $atts[$param] ) ) {
				if ( $param === 'localMemory' ) {
					$frontParams[$param] = $atts[$param] === 'true';
				}
				else {
					$frontParams[$param] = $atts[$param];
				}
			}
			// If not, let's use the chatbot's default values
			else if ( isset( $chatbot[$param] ) ) {
				$frontParams[$param] = $chatbot[$param];
			}

			// Apply the placeholders
			if ( in_array( $param, ['startSentence', 'iconText'] ) ) {
				$frontParams[$param] = $this->core->do_placeholders( $frontParams[$param] );
			} 
		}

		// Server Params
		// NOTE: We don't need the server params for the chatbot if there are no overrides, it means
		// we are using the default or a specific chatbot.
		$isSiteWide = $this->siteWideChatId && $botId === $this->siteWideChatId;
		$hasServerOverrides = count( array_intersect( array_keys( $atts ), MWAI_CHATBOT_SERVER_PARAMS ) ) > 0;
		$hasFrontOverrides = count( array_intersect( array_keys( $atts ), MWAI_CHATBOT_FRONT_PARAMS ) ) > 0;
		$hasOverrides = !$isSiteWide && ( $hasServerOverrides || $hasFrontOverrides );

		$serverParams = [];
		if ( $hasOverrides ) {
			foreach ( MWAI_CHATBOT_SERVER_PARAMS as $param ) {
				if ( isset( $atts[$param] ) ) {
					$serverParams[$param] = $atts[$param];
				}
				else {
					$serverParams[$param] = $chatbot[$param] ?? null;
				}
			}
		}

		// Front Params
		$frontSystem = $this->build_front_params( $botId, $customId );

		// Clean Params
		$frontParams = $this->clean_params( $frontParams );
		$frontSystem = $this->clean_params( $frontSystem );
		$serverParams = $this->clean_params( $serverParams );

		// Server-side: Keep the System Params
		if ( $hasOverrides ) {
			if ( empty( $customId ) ) {
				$customId = md5( json_encode( $serverParams ) );
				$frontSystem['customId'] = $customId;
			}
			set_transient( 'mwai_custom_chatbot_' . $customId, $serverParams, 60 * 60 * 24 );
		}

		// Retrieve the actions, shortcuts, and blocks we want to inject at the beginning
		$filterParams = [
			'step' => 'init',
			'botId' => $botId,
			'params' => array_merge( $frontParams, $frontSystem, $serverParams )
		];
		$actions = apply_filters( 'mwai_chatbot_actions', [], $filterParams );
		$blocks = apply_filters( 'mwai_chatbot_blocks', [], $filterParams );
		$shortcuts = apply_filters( 'mwai_chatbot_shortcuts', [], $filterParams );
		$frontSystem['actions'] = $this->sanitize_actions( $actions );
		$frontSystem['blocks'] = $this->sanitize_blocks( $blocks );
		$frontSystem['shortcuts'] = $this->sanitize_shortcuts( $shortcuts );

		// Client-side: Prepare JSON for Front Params and System Params
		$theme = isset( $frontParams['themeId'] ) ? $this->core->get_theme( $frontParams['themeId'] ) : null;
		$jsonFrontParams = htmlspecialchars( json_encode( $frontParams ), ENT_QUOTES, 'UTF-8' );
		$jsonFrontSystem = htmlspecialchars( json_encode( $frontSystem ), ENT_QUOTES, 'UTF-8' );
		$jsonFrontTheme = htmlspecialchars( json_encode( $theme ), ENT_QUOTES, 'UTF-8' );
		//$jsonAttributes = htmlspecialchars(json_encode($atts), ENT_QUOTES, 'UTF-8');

               $this->enqueue_scripts( $frontParams['themeId'] ?? null );

		return "<div class='mwai-chatbot-container' data-params='{$jsonFrontParams}' data-system='{$jsonFrontSystem}' data-theme='{$jsonFrontTheme}'></div>";
	}

	function chatbot_discussions( $atts ) {
    $atts = empty($atts) ? [] : $atts;

    // Resolve the bot info
		$resolvedBot = $this->resolveBotInfo( $atts );
    if ( isset( $resolvedBot['error'] ) ) {
      return $resolvedBot['error'];
    }
    $chatbot = $resolvedBot['chatbot'];
    $botId = $resolvedBot['botId'];
    $customId = $resolvedBot['customId'];

		// Rename the keys of the atts into camelCase to match the internal params system.
		$atts = array_map( function( $key, $value ) {
			$key = str_replace( '_', ' ', $key );
			$key = ucwords( $key );
			$key = str_replace( ' ', '', $key );
			$key = lcfirst( $key );
			return [ $key => $value ];
		}, array_keys( $atts ), $atts );
		$atts = array_merge( ...$atts );

		// Front Params
		$frontParams = [];
		foreach ( MWAI_DISCUSSIONS_FRONT_PARAMS as $param ) {
			if ( isset( $atts[$param] ) ) {
				$frontParams[$param] = $atts[$param];
			}
			else if ( isset( $chatbot[$param] ) ) {
				$frontParams[$param] = $chatbot[$param];
			}
		}

		// Server Params
		$serverParams = [];
		foreach ( MWAI_DISCUSSIONS_SERVER_PARAMS as $param ) {
			if ( isset( $atts[$param] ) ) {
				$serverParams[$param] = $atts[$param];
			}
		}

		// Front System
		$frontSystem = $this->build_front_params( $botId, $customId );
		// Get refresh interval from settings
		$refresh_interval = $this->core->get_option( 'chatbot_discussions_refresh_interval' );
		if ( $refresh_interval === 'Never' ) {
			$frontSystem['refreshInterval'] = 0;
		} elseif ( $refresh_interval === 'Manual' ) {
			$frontSystem['refreshInterval'] = -1;
		} elseif ( is_numeric( $refresh_interval ) ) {
			$frontSystem['refreshInterval'] = intval( $refresh_interval ) * 1000; // Convert to milliseconds
		} else {
			$frontSystem['refreshInterval'] = 5000; // Default to 5 seconds
		}
		$frontSystem['refreshInterval'] = apply_filters( 'mwai_discussions_refresh_interval', $frontSystem['refreshInterval'] );
		
		// Get paging setting
		$paging_option = $this->core->get_option( 'chatbot_discussions_paging' );
		if ( $paging_option === 'None' ) {
			$frontSystem['paging'] = 0; // No pagination
		} else {
			$frontSystem['paging'] = is_numeric( $paging_option ) ? intval( $paging_option ) : 10; // Default to 10
		}

    // Clean Params
		$frontParams = $this->clean_params( $frontParams );
		$frontSystem = $this->clean_params( $frontSystem );
		$serverParams = $this->clean_params( $serverParams );

    $theme = isset( $frontParams['themeId'] ) ? $this->core->get_theme( $frontParams['themeId'] ) : null;
		$jsonFrontParams = htmlspecialchars( json_encode( $frontParams ), ENT_QUOTES, 'UTF-8' );
		$jsonFrontSystem = htmlspecialchars( json_encode( $frontSystem ), ENT_QUOTES, 'UTF-8' );
		$jsonFrontTheme = htmlspecialchars( json_encode( $theme ), ENT_QUOTES, 'UTF-8' );

    return "<div class='mwai-discussions-container' data-params='{$jsonFrontParams}' data-system='{$jsonFrontSystem}' data-theme='{$jsonFrontTheme}'></div>";
  }

	function clean_params( &$params ) {
		foreach ( $params as $param => $value ) {
			if ( $param === 'restNonce' ) {
				continue;
			}
			if ( empty( $value ) || is_array( $value ) ) {
				continue;
			}
			$lowerCaseValue = strtolower( $value );
			if ( $lowerCaseValue === 'true' || $lowerCaseValue === 'false' || is_bool( $value ) ) {
				$params[$param] = filter_var( $value, FILTER_VALIDATE_BOOLEAN );
			}
			else if ( is_numeric( $value ) ) {
				$params[$param] = filter_var( $value, FILTER_VALIDATE_FLOAT );
			}
		}
		return $params;
	}
	
}
