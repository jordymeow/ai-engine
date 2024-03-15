<?php

// Price as of March 2023: https://openai.com/api/pricing/

define( 'MWAI_OPENAI_MODELS', [
  // Base models:
	[
		"model" => "gpt-4-turbo-preview",
		"name" => "GPT-4 Turbo",
		"family" => "gpt4",
		"price" => [
			"in" => 0.01,
			"out" => 0.03,
		],
		"type" => "token",
		"unit" => 1 / 1000,
		"maxTokens" => 4096, // We should upgrade to maxCompletionTokens and maxContextualTokens
		"maxCompletionTokens" => 4096,
		"maxContextualTokens" => 128000,
		"mode" => "chat",
		"finetune" => false,
		"tags" => ['core', 'chat', 'json', 'preview']
	],
	[
		"model" => "gpt-4-0125-preview",
		"name" => "GPT-4 Turbo (0125)",
		"family" => "gpt4",
		"price" => [
			"in" => 0.01,
			"out" => 0.03,
		],
		"type" => "token",
		"unit" => 1 / 1000,
		"maxTokens" => 4096, // We should upgrade to maxCompletionTokens and maxContextualTokens
		"maxCompletionTokens" => 4096,
		"maxContextualTokens" => 128000,
		"mode" => "chat",
		"finetune" => false,
		"tags" => ['core', 'chat', 'json', 'preview']
	],
	[
		"model" => "gpt-4-1106-preview",
		"name" => "GPT-4 Turbo (1106)",
		"family" => "gpt4",
		"price" => [
			"in" => 0.01,
			"out" => 0.03,
		],
		"type" => "token",
		"unit" => 1 / 1000,
		"maxTokens" => 4096, // We should upgrade to maxCompletionTokens and maxContextualTokens
		"maxCompletionTokens" => 4096,
		"maxContextualTokens" => 128000,
		"mode" => "chat",
		"finetune" => false,
		"tags" => ['core', 'chat', 'json', 'preview']
	],
	[
		"model" => "gpt-4-vision-preview",
		"name" => "GPT-4 Turbo with Vision",
		"family" => "gpt4",
		"price" => [
			"in" => 0.01,
			"out" => 0.03,
		],
		"type" => "token",
		"unit" => 1 / 1000,
		"maxTokens" => 4096, // We should upgrade to maxCompletionTokens and maxContextualTokens
		"maxCompletionTokens" => 4096,
		"maxContextualTokens" => 128000,
		"mode" => "chat",
		"finetune" => false,
		"tags" => ['core', 'chat', 'vision', 'json', 'preview']
	],
	[ 
		"model" => "gpt-4",
		"name" => "GPT-4",
		"family" => "gpt4",
		"price" => [
			"in" => 0.03,
			"out" => 0.06,
		],
		"type" => "token",
		"unit" => 1 / 1000,
		"maxTokens" => 8192,
		"mode" => "chat",
		"finetune" => false,
		"tags" => ['core', 'chat']
	],
	[ 
		"model" => "gpt-4-32k",
		"name" => "GPT-4 32k",
		"family" => "gpt4-32k",
		"price" => [
			"in" => 0.06,
			"out" => 0.12,
		],
		"type" => "token",
		"unit" => 1 / 1000,
		"maxTokens" => 32768,
		"mode" => "chat",
		"finetune" => false,
		"tags" => ['core', 'chat']
	],
	[ 
		"model" => "gpt-3.5-turbo",
		"name" => "GPT-3.5 Turbo",
		"family" => "turbo",
		"price" => [
			"in" => 0.0005,
			"out" => 0.0015,
		],
		"type" => "token",
		"unit" => 1 / 1000,
		"maxTokens" => 4096,
		"mode" => "chat",
		"finetune" => [
			"in" => 0.03,
			"out" => 0.06,
		],
		"tags" => ['core', 'chat', '4k', 'finetune']
	],
	[ 
		"model" => "gpt-3.5-turbo-16k",
		"description" => "Offers 4 times the context length of gpt-3.5-turbo at twice the price.",
		"name" => "GPT-3.5 Turbo 16k",
		"family" => "turbo",
		"price" => [
			"in" => 0.003,
			"out" => 0.004,
		],
		"type" => "token",
		"unit" => 1 / 1000,
		"maxTokens" => 16385,
		"mode" => "chat",
		"finetune" => false,
		"tags" => ['core', 'chat', '16k']
	],
	[
		"model" => "gpt-3.5-turbo-instruct",
		"name" => "GPT-3.5 Turbo Instruct",
		"family" => "turbo-instruct",
		"price" => [
			"in" => 0.0015,
			"out" => 0.002,
		],
		"type" => "token",
		"unit" => 1 / 1000,
		"mode" => "completion",
		"finetune" => [
			"in" => 0.03,
			"out" => 0.06,
		],
		"maxTokens" => 4096,
		"tags" => ['core', 'chat', '4k']
	],
  [
		"model" => "text-davinci-003",
		"name" => "GPT-3 DaVinci-003",
		"family" => "davinci",
		"price" => 0.02,
		"type" => "token",
		"unit" => 1 / 1000,
		"maxTokens" => 2048,
		"mode" => "completion",
		"finetune" => [
			"price" => 0.12
		],
		"tags" => ['core', 'chat', 'legacy-finetune', 'deprecated']
	],
  [
		"model" => "text-curie-001",
		"name" => "GPT-3 Curie-001",
		"family" => "curie",
		"price" => 0.002,
		"type" => "token",
		"unit" => 1 / 1000,
		"maxTokens" => 2048,
		"mode" => "completion",
		"finetune" => [
			"price" => 0.012
		],
		"tags" => ['core', 'chat', 'legacy-finetune', 'deprecated']
	],
  [
		"model" => "text-babbage-001",
		"name" => "GPT-3 Babbage-001",
		"family" => "babbage",
		"price" => 0.0005,
		"type" => "token",
		"unit" => 1 / 1000,
		"maxTokens" => 2048,
		"mode" => "completion",
		"finetune" => [
			"price" => 0.0024
		],
		"tags" => ['core', 'legacy-finetune', 'deprecated']
	],
  // Image models:
  [
		"model" => "dall-e",
		"name" => "DALL-E 2",
		"family" => "dall-e",
		"type" => "image",
		"unit" => 1,
		"options" => [
      [
				"option" => "1024x1024",
				"price" => 0.020
			],
      [
				"option" => "512x512",
				"price" => 0.018
			],
      [
				"option" => "256x256",
				"price" => 0.016
			]
    ],
		"finetune" => false,
		"tags" => ['core', 'image']
  ],
	[
		"model" => "dall-e-3",
		"name" => "DALL-E 3",
		"family" => "dall-e",
		"type" => "image",
		"unit" => 1,
		"options" => [
      [
				"option" => "1024x1024",
				"price" => 0.040
			],
      [
				"option" => "1024x1792",
				"price" => 0.080
			],
			[
				"option" => "1792x1024",
				"price" => 0.080
			]
    ],
		"finetune" => false,
		"tags" => ['core', 'image']
  ],
	[
		"model" => "dall-e-3-hd",
		"name" => "DALL-E 3 (HD)",
		"family" => "dall-e",
		"type" => "image",
		"unit" => 1,
		"options" => [
      [
				"option" => "1024x1024",
				"price" => 0.080
			],
      [
				"option" => "1024x1792",
				"price" => 0.120
			],
			[
				"option" => "1792x1024",
				"price" => 0.120
			]
    ],
		"finetune" => false,
		"tags" => ['core', 'image']
  ],
	// Embedding models:
	[
		"model" => "text-embedding-3-small",
		"name" => "Embedding 3-Small",
		"family" => "text-embedding",
		"price" => 0.00002,
		"type" => "token",
		"unit" => 1 / 1000,
		"mode" => "embedding",
		"finetune" => false,
		"dimensions" => [ 512, 1536 ],
		"tags" => ['core', 'embedding'],
	],
	[
		"model" => "text-embedding-3-large",
		"name" => "Embedding 3-Large",
		"family" => "text-embedding",
		"price" => 0.00013,
		"type" => "token",
		"unit" => 1 / 1000,
		"mode" => "embedding",
		"finetune" => false,
		"dimensions" => [ 256, 1024, 3072 ],
		"tags" => ['core', 'embedding'],
	],
	[
		"model" => "text-embedding-ada-002",
		"name" => "Embedding Ada-002",
		"family" => "text-embedding",
		"price" => 0.0001,
		"type" => "token",
		"unit" => 1 / 1000,
		"mode" => "embedding",
		"finetune" => false,
		"dimensions" => [ 1536 ],
		"tags" => ['core', 'embedding'],
	],
	// Audio Models:
	[
		"model" => "whisper-1",
		"name" => "Whisper",
		"family" => "whisper",
		"price" => 0.00001,
		"type" => "second",
		"unit" => 1,
		"mode" => "speech-to-text",
		"finetune" => false,
		"tags" => ['core', 'audio'],
	]
]);

define ( 'MWAI_ANTHROPIC_MODELS', [
	[
		"model" => "claude-3-opus-20240229",
		"name" => "Claude-3 Opus",
		"family" => "claude",
		"price" => [
			"in" => 0.015,
			"out" => 0.075,
		],
		"type" => "token",
		"unit" => 1 / 1000,
		"maxCompletionTokens" => 4096,
		"maxContextualTokens" => 200000,
		"mode" => "chat",
		"finetune" => false,
		"tags" => ['core', 'chat', 'vision']
	],
	[
		"model" => "claude-3-sonnet-20240229",
		"name" => "Claude-3 Sonnet",
		"family" => "claude",
		"price" => [
			"in" => 0.003,
			"out" => 0.015,
		],
		"type" => "token",
		"unit" => 1 / 1000,
		"maxCompletionTokens" => 4096,
		"maxContextualTokens" => 200000,
		"mode" => "chat",
		"finetune" => false,
		"tags" => ['core', 'chat', 'vision']
	],
	[
		"model" => "claude-3-haiku-20240307",
		"name" => "Claude-3 Haiku",
		"family" => "claude",
		"price" => [
			"in" => 0.00025,
			"out" => 0.00125,
		],
		"type" => "token",
		"unit" => 1 / 1000,
		"maxCompletionTokens" => 4096,
		"maxContextualTokens" => 200000,
		"mode" => "chat",
		"finetune" => false,
		"tags" => ['core', 'chat', 'vision']
	],
]);