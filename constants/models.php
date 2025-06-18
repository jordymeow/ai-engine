<?php

// Price as of June 2024: https://openai.com/api/pricing/

define( 'MWAI_OPENAI_MODELS', [
  /*
    GPT 4.1
    Flagship GPT model for complex tasks
    https://platform.openai.com/docs/models/gpt-4.1
  */
  [
    "model" => "gpt-4.1",
    "name" => "GPT-4.1",
    "family" => "gpt41",
    "features" => ['completion'],
    "price" => [
      "in" => 2.00,
      "out" => 8.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 32768,
    "maxContextualTokens" => 1047576,
    "finetune" => false,
    "tags" => ['core', 'chat', 'vision', 'functions', 'json', 'finetune', 'responses', 'mcp'],
    "tools" => ['web_search', 'image_generation']
  ],
  /*
    GPT-4.1 mini
    Balanced for intelligence, speed, and cost
    https://platform.openai.com/docs/models/gpt-4.1-mini
  */
  [
    "model" => "gpt-4.1-mini",
    "name" => "GPT-4.1 Mini",
    "family" => "gpt41",
    "features" => ['completion'],
    "price" => [
      "in" => 0.40,
      "out" => 1.60,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 32768,
    "maxContextualTokens" => 1047576,
    "finetune" => false,
    "tags" => ['core', 'chat', 'vision', 'functions', 'json', 'finetune', 'responses', 'mcp'],
    "tools" => ['web_search', 'image_generation']
  ],
  /*
    GPT-4.1 nano
    Fastest, most cost-effective GPT-4.1 model
    https://platform.openai.com/docs/models/gpt-4.1-nano
  */
  [
    "model" => "gpt-4.1-nano",
    "name" => "GPT-4.1 Nano",
    "family" => "gpt41",
    "features" => ['completion'],
    "price" => [
      "in" => 0.10,
      "out" => 0.40,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 32768,
    "maxContextualTokens" => 1047576,
    "finetune" => false,
    "tags" => ['core', 'chat', 'vision', 'functions', 'json', 'finetune', 'responses', 'mcp'],
    "tools" => ['image_generation']
  ],
  /*
    GPT-4o
    Fast, intelligent, flexible GPT model
    https://platform.openai.com/docs/models/gpt-4o
  */
  [
    "model" => "gpt-4o",
    "name" => "GPT-4o",
    "family" => "gpt4",
    "features" => ['completion'],
    "price" => [
      "in" => 2.50,
      "out" => 10.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 16384,
    "maxContextualTokens" => 128000,
    "finetune" => false,
    "tags" => ['core', 'chat', 'vision', 'functions', 'json', 'finetune', 'mcp', 'responses'],
    "tools" => ['web_search', 'image_generation']
  ],
  /*
    GPT-4o mini
    Fast, affordable small model for focused tasks
    https://platform.openai.com/docs/models/gpt-4o-mini
  */
  [
    "model" => "gpt-4o-mini",
    "name" => "GPT-4o Mini",
    "family" => "gpt4",
    "features" => ['completion'],
    "price" => [
      "in" => 0.15,
      "out" => 0.60,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 16384,
    "maxContextualTokens" => 128000,
    "finetune" => [
      "in" => 0.15,
      "out" => 0.60,
      "train" => 3.00
    ],
    "tags" => ['core', 'chat', 'vision', 'functions', 'json', 'finetune', 'mcp', 'responses'],
    "tools" => ['web_search', 'image_generation']
  ],
  /* 
    o1
    High-intelligence reasoning mode
    https://platform.openai.com/docs/models/o1
  */
  [
    "model" => "o1",
    "name" => "o1",
    "family" => "o1",
    "features" => ['completion'],
    "price" => [
      "in" => 15.00,
      "out" => 60.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 100000,
    "maxContextualTokens" => 200000,
    "tags" => ['core', 'chat', 'o1-model', 'reasoning', 'mcp']
  ],
  [
    "model" => "o1-mini",
    "name" => "o1 Mini",
    "family" => "o1",
    "features" => ['completion'],
    "price" => [
      "in" => 1.10,
      "out" => 4.40,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 65536,
    "maxContextualTokens" => 128000,
    "tags" => ['core', 'chat', 'o1-model', 'reasoning', 'mcp']
  ],
  /* 
    o3
    Advanced reasoning model
    https://platform.openai.com/docs/models/o3
  */
  [
    "model" => "o3",
    "name" => "o3",
    "family" => "o3",
    "features" => ['completion'],
    "price" => [
      "in" => 15.00,
      "out" => 60.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 100000,
    "maxContextualTokens" => 200000,
    "tags" => ['core', 'chat', 'o1-model', 'reasoning', 'responses', 'mcp'],
    "tools" => ['web_search', 'image_generation']
  ],
  /* 
    o3-mini
    Fast, flexible, intelligent reasoning model
    https://platform.openai.com/docs/models/o3-mini
  */
  [
    "model" => "o3-mini",
    "name" => "o3 Mini",
    "family" => "o3",
    "features" => ['completion'],
    "price" => [
      "in" => 1.10,
      "out" => 4.40,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 100000,
    "maxContextualTokens" => 200000,
    "tags" => ['core', 'chat', 'o1-model', 'reasoning', 'responses', 'mcp'],
    "tools" => ['web_search', 'image_generation']
  ],
  /* 
    GPT-4o Realtime
    Model capable of realtime text and audio inputs and outputs
    https://platform.openai.com/docs/models/gpt-4o-realtime-preview
  */
  [
    "model" => "gpt-4o-realtime-preview",
    "name" => "GPT-4o Realtime (Preview)",
    "family" => "gpt4-o-realtime",
    "features" => ['core', 'realtime', 'functions'],
    "price" => [
      "text" => [
        "in" => 5.00,
        "cache" => 2.50,
        "out" => 20.00,
      ],
      "audio" => [
        "in" => 100.00,
        "cache" => 20.00,
        "out" => 200.00,
      ]
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 4096,
    "maxContextualTokens" => 128000,
    "finetune" => false,
    "tags" => ['core', 'realtime', 'functions']
  ],
  /* 
    GPT-4o mini Realtime
    Smaller realtime model for text and audio inputs and outputs
    https://platform.openai.com/docs/models/gpt-4o-mini-realtime-preview
  */
  [
    "model" => "gpt-4o-mini-realtime-preview",
    "name" => "GPT-4o Mini Realtime (Preview)",
    "family" => "gpt4-o-realtime",
    "features" => ['core', 'realtime', 'functions'],
    "price" => [
      "text" => [
        "in" => 0.60,
        "cache" => 0.30,
        "out" => 2.40,
      ],
      "audio" => [
        "in" => 10.00,
        "cache" => 0.30,
        "out" => 20.00,
      ]
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 4096,
    "maxContextualTokens" => 128000,
    "finetune" => false,
    "tags" => ['core', 'realtime', 'functions']
  ],
  /* 
    GPT-4
    An older high-intelligence GPT model
    https://platform.openai.com/docs/models/gpt-4
  */
  [ 
    "model" => "gpt-4",
    "name" => "GPT-4",
    "family" => "gpt4",
    "features" => ['completion'],
    "price" => [
      "in" => 30.00,
      "out" => 60.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 8192,
    "maxContextualTokens" => 8192,
    "finetune" => false,
    "tags" => ['core', 'chat', 'functions']
  ],
  /* 
    GPT-4 Turbo
    An older high-intelligence GPT model
    https://platform.openai.com/docs/models/gpt-4-turbo
  */
  [
    "model" => "gpt-4-turbo",
    "name" => "GPT-4 Turbo",
    "family" => "gpt4",
    "features" => ['completion'],
    "price" => [
      "in" => 10.00,
      "out" => 30.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 4096,
    "maxContextualTokens" => 128000,
    "finetune" => false,
    "tags" => ['core', 'chat', 'vision', 'functions', 'json']
  ],
  /* 
    GPT-3.5 Turbo
    Legacy GPT model for cheaper chat and non-chat tasks
    https://platform.openai.com/docs/models/gpt-3.5-turbo
  */
  [ 
    "model" => "gpt-3.5-turbo",
    "name" => "GPT-3.5 Turbo",
    "family" => "turbo",
    "features" => ['completion'],
    "price" => [
      "in" => 0.50,
      "out" => 1.50,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 4096,
    "maxContextualTokens" => 16385,
    "finetune" => [
      "in" => 3.00,
      "out" => 6.00,
      "train" => 8.00
    ],
    "tags" => ['core', 'chat', '4k', 'finetune', 'functions']
  ],
  /* 
    DALL·E 3
    Our latest image generation model
    https://platform.openai.com/docs/models/dall-e-3
  */
  [
    "model" => "gpt-image-1",
    "name" => "GPT Image 1 (High)",
    "family" => "gpt-image",
    "features" => ['text-to-image'],
    "resolutions" => [
      [
        "name" => "1024x1024",
        "label" => "1024x1024",
        "price" => 0.167
      ],
      [
        "name" => "1024x1536",
        "label" => "1024x1536",
        "price" => 0.25
      ],
      [
        "name" => "1536x1024",
        "label" => "1536x1024",
        "price" => 0.25
      ]
    ],
    "type" => "image",
    "unit" => 1,
    "finetune" => false,
    "tags" => ['core', 'image', 'image-edit', 'responses']
  ],
  [
    "model" => "dall-e-3",
    "name" => "DALL-E 3",
    "family" => "dall-e",
    "features" => ['text-to-image'],
    "resolutions" => [
      [
        "name" => "1024x1024",
        "label" => "1024x1024",
        "price" => 0.040
      ],
      [
        "name" => "1024x1792",
        "label" => "1024x1792",
        "price" => 0.080
      ],
      [
        "name" => "1792x1024",
        "label" => "1792x1024",
        "price" => 0.080
      ]
    ],
    "type" => "image",
    "unit" => 1,
    "finetune" => false,
    "tags" => ['core', 'image']
  ],
  [
    "model" => "dall-e-3-hd",
    "name" => "DALL-E 3 (HD)",
    "family" => "dall-e",
    "features" => ['text-to-image'],
    "resolutions" => [
      [
        "name" => "1024x1024",
        "label" => "1024x1024",
        "price" => 0.080
      ],
      [
        "name" => "1024x1792",
        "label" => "1024x1792",
        "price" => 0.120
      ],
      [
        "name" => "1792x1024",
        "label" => "1792x1024",
        "price" => 0.120
      ]
    ],
    "type" => "image",
    "unit" => 1,
    "finetune" => false,
    "tags" => ['core', 'image']
  ],
  // Embedding models:
  [
    "model" => "text-embedding-3-small",
    "name" => "Embedding 3-Small",
    "family" => "text-embedding",
    "features" => ['embedding'],
    "price" => 0.02,
    "type" => "token",
    "unit" => 1 / 1000000,
    "finetune" => false,
    "dimensions" => [ 512, 1536 ],
    "tags" => ['core', 'embedding'],
  ],
  [
    "model" => "text-embedding-3-large",
    "name" => "Embedding 3-Large",
    "family" => "text-embedding",
    "features" => ['embedding'],
    "price" => 0.13,
    "type" => "token",
    "unit" => 1 / 1000000,
    "finetune" => false,
    "dimensions" => [ 256, 1024, 3072 ],
    "tags" => ['core', 'embedding'],
  ],
  [
    "model" => "text-embedding-ada-002",
    "name" => "Embedding Ada-002",
    "family" => "text-embedding",
    "features" => ['embedding'],
    "price" => 0.10,
    "type" => "token",
    "unit" => 1 / 1000000,
    "finetune" => false,
    "dimensions" => [ 1536 ],
    "tags" => ['core', 'embedding'],
  ],
  // Audio Models:
  [
    "model" => "gpt-4o-transcribe",
    "name" => "GPT-4o Transcribe",
    "family" => "gpt-4o-transcribe",
    "features" => ['speech-to-text'],
    "price" => 0.006,
    "type" => "second",
    "unit" => 1,
    "finetune" => false,
    "tags" => ['core', 'audio'],
  ],
  [
    "model" => "gpt-4o-mini-transcribe",
    "name" => "GPT-4o Mini Transcribe",
    "family" => "gpt-4o-transcribe",
    "features" => ['speech-to-text'],
    "price" => 0.003,
    "type" => "second",
    "unit" => 1,
    "finetune" => false,
    "tags" => ['core', 'audio'],
  ],
  [
    "model" => "whisper-1",
    "name" => "Whisper",
    "family" => "whisper",
    "features" => ['speech-to-text'],
    "price" => 0.006,
    "type" => "second",
    "unit" => 1,
    "finetune" => false,
    "tags" => ['core', 'audio'],
  ],
  /* 
    Depecated Models
  */
  [
    "model" => "gpt-4.5-preview",
    "name" => "GPT-4.5 (Preview)",
    "family" => "gpt4.5",
    "features" => ['completion'],
    "price" => [
      "in" => 75.00,
      "out" => 150.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 16384,
    "maxContextualTokens" => 128000,
    "finetune" => false,
    "tags" => ['core', 'chat', 'vision', 'functions', 'json', 'deprecated']
  ],
  [
    "model" => "dall-e",
    "name" => "DALL-E 2",
    "family" => "dall-e",
    "features" => ['text-to-image'],
    "resolutions" => [
      [
        "name" => "256x256",
        "label" => "256x256",
        "price" => 0.016
      ],
      [
        "name" => "512x512",
        "label" => "512x512",
        "price" => 0.018
      ],
      [
        "name" => "1024x1024",
        "label" => "1024x1024",
        "price" => 0.020
      ]
    ],
    "type" => "image",
    "unit" => 1,
    "finetune" => false,
    "tags" => ['core', 'image', 'deprecated']
  ],
  // [ 
  // 	"model" => "gpt-3.5-turbo-16k",
  // 	"description" => "Offers 4 times the context length of gpt-3.5-turbo at twice the price.",
  // 	"name" => "GPT-3.5 Turbo 16k",
  // 	"family" => "turbo",
  // 	"features" => ['completion'],
  // 	"price" => [
  // 		"in" => 30.00,
  // 		"out" => 40.0,
  // 	],
  // 	"type" => "token",
  // 	"unit" => 1 / 1000000,
  // 	"maxTokens" => 16385,
  // 	"finetune" => false,
  // 	"tags" => ['core', 'chat', '16k']
  // ],
  // [
  // 	"model" => "gpt-3.5-turbo-instruct",
  // 	"name" => "GPT-3.5 Turbo Instruct",
  // 	"family" => "turbo-instruct",
  // 	"features" => ['completion'],
  // 	"price" => [
  // 		"in" => 0.50,
  // 		"out" => 2.00,
  // 	],
  // 	"type" => "token",
  // 	"unit" => 1 / 1000000,
  // 	"finetune" => [
  // 		"in" => 0.03,
  // 		"out" => 0.06,
  // 	],
  // 	"maxTokens" => 4096,
  // 	"tags" => ['core', 'chat', '4k']
  // ],
]);

define ( 'MWAI_ANTHROPIC_MODELS', [
  [
    "model" => "claude-opus-4-20250514",
    "name" => "Claude-4 Opus (2025/05/14)",
    "family" => "claude",
    "features" => ['completion'],
    "price" => [
      "in" => 15.00,
      "out" => 75.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 32000,
    "maxContextualTokens" => 200000,
    "finetune" => false,
    "tags" => ['core', 'chat', 'vision', 'functions', 'reasoning', 'mcp']
  ],
  [
    "model" => "claude-sonnet-4-20250514",
    "name" => "Claude-4 Sonnet (2025/05/14)",
    "family" => "claude",
    "features" => ['completion'],
    "price" => [
      "in" => 3.00,
      "out" => 15.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 64000,
    "maxContextualTokens" => 200000,
    "finetune" => false,
    "tags" => ['core', 'chat', 'vision', 'functions', 'reasoning', 'mcp']
  ],
  [
    "model" => "claude-3-7-sonnet-latest",
    "name" => "Claude-3.7 Sonnet",
    "family" => "claude",
    "features" => ['completion'],
    "price" => [
      "in" => 3.00,
      "out" => 15.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 64000,
    "maxContextualTokens" => 200000,
    "finetune" => false,
    "tags" => ['core', 'chat', 'vision', 'functions', 'reasoning', 'mcp']
  ],
  [
    "model" => "claude-3-5-sonnet-latest",
    "name" => "Claude-3.5 Sonnet",
    "family" => "claude",
    "features" => ['completion'],
    "price" => [
      "in" => 3.00,
      "out" => 15.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 4096,
    "maxContextualTokens" => 200000,
    "finetune" => false,
    "tags" => ['core', 'chat', 'vision', 'functions', 'mcp']
  ],
  [
    "model" => "claude-3-5-sonnet-20241022",
    "name" => "Claude-3.5 Sonnet (2024/10/22)",
    "family" => "claude",
    "features" => ['completion'],
    "price" => [
      "in" => 3.00,
      "out" => 15.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 4096,
    "maxContextualTokens" => 200000,
    "finetune" => false,
    "tags" => ['core', 'chat', 'vision', 'files', 'functions', 'mcp']
  ],
  [
    "model" => "claude-3-5-sonnet-20240620",
    "name" => "Claude-3.5 Sonnet (2024/06/20)",
    "family" => "claude",
    "features" => ['completion'],
    "price" => [
      "in" => 3.00,
      "out" => 15.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 4096,
    "maxContextualTokens" => 200000,
    "finetune" => false,
    "tags" => ['core', 'chat', 'vision', 'functions', 'mcp']
  ],
  [
    "model" => "claude-3-sonnet-20240229",
    "name" => "Claude-3 Sonnet (2024/02/29)",
    "family" => "claude",
    "features" => ['completion'],
    "price" => [
      "in" => 3.00,
      "out" => 15.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 4096,
    "maxContextualTokens" => 200000,
    "finetune" => false,
    "tags" => ['core', 'chat', 'vision', 'functions', 'deprecated']
  ],
  [
    "model" => "claude-3-opus-latest",
    "name" => "Claude-3 Opus (Latest)",
    "family" => "claude",
    "features" => ['completion'],
    "price" => [
      "in" => 15.00,
      "out" => 75.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 4096,
    "maxContextualTokens" => 200000,
    "finetune" => false,
    "tags" => ['core', 'chat', 'vision', 'functions']
  ],
  [
    "model" => "claude-3-opus-20240229",
    "name" => "Claude-3 Opus (2024/02/29)",
    "family" => "claude",
    "features" => ['completion'],
    "price" => [
      "in" => 15.00,
      "out" => 75.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 4096,
    "maxContextualTokens" => 200000,
    "finetune" => false,
    "tags" => ['core', 'chat', 'vision', 'functions']
  ],
  [
    "model" => "claude-3-5-haiku-20241022",
    "name" => "Claude-3.5 Haiku (2024/10/22)",
    "family" => "claude",
    "features" => ['completion'],
    "price" => [
      "in" => 1.00,
      "out" => 5.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 8192,
    "maxContextualTokens" => 200000,
    "finetune" => false,
    "tags" => ['core', 'chat']
  ],
  [
    "model" => "claude-3-haiku-20240307",
    "name" => "Claude-3 Haiku (2024/03/07)",
    "family" => "claude",
    "features" => ['completion'],
    "price" => [
      "in" => 0.25,
      "out" => 1.25,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "maxCompletionTokens" => 4096,
    "maxContextualTokens" => 200000,
    "finetune" => false,
    "tags" => ['core', 'chat', 'vision', 'functions']
  ]
]);

define('MWAI_PERPLEXITY_MODELS', [
  [
    "model" => "sonar-pro",
    "name" => "Sonar Pro",
    "family" => "sonar",
    "features" => ['completion'],
    "price" => [
      "in" => 3.00,
      "out" => 15.00,
      "search" => 5.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "searchUnit" => 1 / 1000,
    "maxCompletionTokens" => 8192,
    "maxContextualTokens" => 200000,
    "finetune" => false,
    "tags" => ['core', 'chat'],
  ],
  [
    "model" => "sonar",
    "name" => "Sonar",
    "family" => "sonar",
    "features" => ['completion'],
    "price" => [
      "in" => 1.00,
      "out" => 1.00,
      "search" => 5.00,
    ],
    "type" => "token",
    "unit" => 1 / 1000000,
    "searchUnit" => 1 / 1000,
    "maxCompletionTokens" => 4096,
    "maxContextualTokens" => 127000,
    "finetune" => false,
    "tags" => ['core', 'chat'],
  ],
]);