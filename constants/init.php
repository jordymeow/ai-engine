<?php

require_once( MWAI_PATH . '/constants/models.php' );

define( 'MWAI_CHATBOT_PARAMS', [
	// UI Parameters
	'id' => '',
	'env' => 'chatbot',
	'mode' => 'chat',
	'context' => "Converse as if you were an AI assistant. Be friendly, creative.",
	'ai_name' => "AI: ",
	'user_name' => "User: ",
	'guest_name' => "Guest: ",
	'sys_name' => "System: ",
	'start_sentence' => "Hi! How can I help you?",
	'text_send' => 'Send',
	'text_clear' => 'Clear',
	'text_input_placeholder' => 'Type your message...',
	'text_compliance' => '',
	'max_sentences' => 15,
	'style' => 'chatgpt',
	'window' => false,
	'icon_text' => '',
	'icon_position' => 'bottom-right',
	'fullscreen' => false,
	// Chatbot System Parameters
	'casually_fine_tuned' => false,
	'content_aware' => false, 
	'prompt_ending' => null,
	'completion_ending' => null,
	// AI Parameters
	'model' => 'gpt-3.5-turbo',
	'temperature' => 0.8,
	'max_tokens' => 1024,
	'max_results' => 3,
	'api_key' => null
] );

define( 'MWAI_LANGUAGES', [
  'en' => 'English',
	'de' => 'German',
	'fr' => 'French',
  'es' => 'Spanish',
  'it' => 'Italian',
	'zh' => 'Chinese',
	'ja' => 'Japanese',
  'pt' => 'Portuguese',
  //'ru' => 'Russian',
] );

define ( 'MWAI_LIMITS', [
	'enabled' => true,
	'guests' => [
		'credits' => 3,
		'creditType' => 'queries',
		'timeFrame' => 'day',
		'isAbsolute' => false,
		'overLimitMessage' => "You have reached the limit.",
	],
	'users' => [
		'credits' => 10,
		'creditType' => 'price',
		'timeFrame' => 'month',
		'isAbsolute' => false,
		'overLimitMessage' => "You have reached the limit.",
		'ignoredUsers' => "administrator,editor",
	],
] );

define( 'MWAI_OPTIONS', [
	'module_titles' => true,
	'module_excerpts' => true,
	'module_woocommerce' => true,
	'module_forms' => false,
	'module_blocks' => false,
	'module_playground' => true,
	'module_generator_content' => true,
	'module_generator_images' => true,
	'module_moderation' => false,
	'module_statistics' => false,
	'module_embeddings' => false,
	'module_audio' => false,
	'shortcode_chat' => true,
	'shortcode_chat_params' => MWAI_CHATBOT_PARAMS,
	'shortcode_chat_params_override' => false,
	'shortcode_chat_html' => true,
	'shortcode_chat_formatting' => true,
	'shortcode_chat_typewriter' => false,
	'shortcode_chat_syntax_highlighting' => false,
	'shortcode_chat_logs' => '', // 'file', 'db', 'file,db'
	'shortcode_chat_inject' => false,
	'shortcode_chat_styles' => [],
	'limits' => MWAI_LIMITS,
	'openai_apikey' => false,
	'openai_usage' => [],
	'openai_models' => MWAI_OPENAI_MODELS,
	'openai_finetunes' => [],
	'openai_finetunes_deleted' => [],
	'pinecone' => [
		'apikey' => false,
		'server' => 'us-east1-gcp',
		'indexes' => [],
		'index' => null
	],
	'extra_models' => "",
	'debug_mode' => true,
	'resolve_shortcodes' => false,
	'languages' => MWAI_LANGUAGES
]);