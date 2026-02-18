<?php

// Price as of June 2024: https://openai.com/api/pricing/

define( 'MWAI_OPENAI_MODELS', [
  /*
    GPT-5.2
    The best model for coding and agentic tasks across industries
    https://platform.openai.com/docs/models/gpt-5.2
    */
  [
    'model' => 'gpt-5.2',
    'name' => 'GPT-5.2',
    'family' => 'gpt-5',
    'features' => ['completion'],
    'price' => [
      'in' => 1.75,
      'out' => 14.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 128000,
    'maxContextualTokens' => 400000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'json', 'responses', 'mcp', 'reasoning', 'verbosity'],
    'tools' => ['web_search', 'image_generation', 'file_search', 'code_interpreter'],
    'params' => [
      'reasoning' => ['none', 'low', 'medium', 'high', 'xhigh'],
      'verbosity' => ['low', 'medium', 'high']
    ]
  ],
  /*
    GPT-5.2 Chat
    GPT-5.2 model used in ChatGPT
    https://platform.openai.com/docs/models/gpt-5.2
    */
  [
    'model' => 'gpt-5.2-chat-latest',
    'name' => 'GPT-5.2 Chat',
    'family' => 'gpt-5',
    'features' => ['completion'],
    'price' => [
      'in' => 1.75,
      'out' => 14.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 128000,
    'maxContextualTokens' => 400000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'responses', 'mcp'],
    'tools' => ['web_search', 'file_search', 'code_interpreter']
  ],
  /*
    GPT-5.2 Pro
    Version of GPT-5.2 that produces smarter and more precise responses
    https://platform.openai.com/docs/models/gpt-5.2-pro
    */
  [
    'model' => 'gpt-5.2-pro',
    'name' => 'GPT-5.2 Pro',
    'family' => 'gpt-5',
    'features' => ['completion'],
    'price' => [
      'in' => 21.00,
      'out' => 168.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 128000,
    'maxContextualTokens' => 400000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'json', 'responses', 'mcp', 'reasoning', 'verbosity'],
    'tools' => ['web_search', 'image_generation', 'file_search', 'code_interpreter'],
    'params' => [
      'reasoning' => ['medium', 'high', 'xhigh'],
      'verbosity' => ['low', 'medium', 'high']
    ]
  ],
  /*
    GPT-5.1
    Demo model with enhanced capabilities
    https://platform.openai.com/docs/models/gpt-5.1
    */
  [
    'model' => 'gpt-5.1',
    'name' => 'GPT-5.1',
    'family' => 'gpt-5',
    'features' => ['completion'],
    'price' => [
      'in' => 1.25,
      'out' => 10.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 128000,
    'maxContextualTokens' => 400000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'json', 'responses', 'mcp', 'reasoning', 'verbosity'],
    'tools' => ['web_search', 'image_generation', 'file_search', 'code_interpreter'],
    'params' => [
      'reasoning' => ['none', 'minimal', 'low', 'medium', 'high'],
      'verbosity' => ['low', 'medium', 'high']
    ]
  ],
  /*
    GPT-5
    The best model for coding and agentic tasks across domains
    https://platform.openai.com/docs/models/gpt-5
    */
  [
    'model' => 'gpt-5',
    'name' => 'GPT-5',
    'family' => 'gpt-5',
    'features' => ['completion'],
    'price' => [
      'in' => 1.25,
      'out' => 10.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 128000,
    'maxContextualTokens' => 400000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'json', 'responses', 'mcp', 'reasoning', 'verbosity'],
    'tools' => ['web_search', 'image_generation', 'file_search', 'code_interpreter'],
    'params' => [
      'reasoning' => ['none', 'minimal', 'low', 'medium', 'high'],
      'verbosity' => ['low', 'medium', 'high']
    ]
  ],
  /*
    GPT-5 Mini
    Efficient and cost-effective GPT-5 variant
    https://platform.openai.com/docs/models/gpt-5-mini
    */
  [
    'model' => 'gpt-5-mini',
    'name' => 'GPT-5 Mini',
    'family' => 'gpt-5',
    'features' => ['completion'],
    'price' => [
      'in' => 0.25,
      'out' => 2.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 128000,
    'maxContextualTokens' => 400000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'json', 'responses', 'mcp', 'reasoning', 'verbosity'],
    'tools' => ['web_search', 'image_generation', 'file_search', 'code_interpreter'],
    'params' => [
      'reasoning' => ['none', 'minimal', 'low', 'medium', 'high'],
      'verbosity' => ['low', 'medium', 'high']
    ]
  ],
  /*
    GPT-5 Nano
    Ultra-fast and lightweight GPT-5 model
    https://platform.openai.com/docs/models/gpt-5-nano
    */
  [
    'model' => 'gpt-5-nano',
    'name' => 'GPT-5 Nano',
    'family' => 'gpt-5',
    'features' => ['completion'],
    'price' => [
      'in' => 0.05,
      'out' => 0.40,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 128000,
    'maxContextualTokens' => 400000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'json', 'responses', 'mcp', 'reasoning', 'verbosity'],
    'tools' => ['web_search', 'image_generation', 'file_search', 'code_interpreter'],
    'params' => [
      'reasoning' => ['none', 'minimal', 'low', 'medium', 'high'],
      'verbosity' => ['low', 'medium', 'high']
    ]
  ],
  /*
    GPT-5 Chat
    GPT-5 model used in ChatGPT
    https://platform.openai.com/docs/models/gpt-5
    */
  [
    'model' => 'gpt-5-chat-latest',
    'name' => 'GPT-5 Chat',
    'family' => 'gpt-5',
    'features' => ['completion'],
    'price' => [
      'in' => 1.25,
      'out' => 10.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 16384,
    'maxContextualTokens' => 128000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'responses', 'mcp'],
    'tools' => ['web_search', 'file_search', 'code_interpreter'],
    'params' => [
      'verbosity' => ['low', 'medium', 'high']
    ]
  ],
  /*
    GPT-5 Pro
    Version of GPT-5 that produces smarter and more precise responses
    https://platform.openai.com/docs/models/gpt-5
    */
  [
    'model' => 'gpt-5-pro',
    'name' => 'GPT-5 Pro',
    'family' => 'gpt-5',
    'features' => ['completion'],
    'price' => [
      'in' => 15.00,
      'out' => 120.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 272000,
    'maxContextualTokens' => 400000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'json', 'responses', 'mcp', 'reasoning', 'verbosity'],
    'tools' => ['web_search', 'image_generation', 'file_search', 'code_interpreter'],
    'params' => [
      'reasoning' => ['none', 'minimal', 'low', 'medium', 'high'],
      'verbosity' => ['low', 'medium', 'high']
    ]
  ],
  /*
    GPT 4.1
    Flagship GPT model for complex tasks
    https://platform.openai.com/docs/models/gpt-4.1
    */
  [
    'model' => 'gpt-4.1',
    'name' => 'GPT-4.1',
    'family' => 'gpt-4',
    'features' => ['completion'],
    'price' => [
      'in' => 2.00,
      'out' => 8.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 32768,
    'maxContextualTokens' => 1047576,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'functions', 'json', 'finetune', 'responses', 'mcp', 'deprecated'],
    'tools' => ['web_search', 'image_generation', 'code_interpreter']
  ],
  /*
      GPT-4.1 mini
      Balanced for intelligence, speed, and cost
      https://platform.openai.com/docs/models/gpt-4.1-mini
      */
  [
    'model' => 'gpt-4.1-mini',
    'name' => 'GPT-4.1 Mini',
    'family' => 'gpt-4',
    'features' => ['completion'],
    'price' => [
      'in' => 0.40,
      'out' => 1.60,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 32768,
    'maxContextualTokens' => 1047576,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'functions', 'json', 'finetune', 'responses', 'mcp', 'deprecated'],
    'tools' => ['web_search', 'image_generation', 'code_interpreter']
  ],
  /*
        GPT-4.1 nano
        Fastest, most cost-effective GPT-4.1 model
        https://platform.openai.com/docs/models/gpt-4.1-nano
        */
  [
    'model' => 'gpt-4.1-nano',
    'name' => 'GPT-4.1 Nano',
    'family' => 'gpt-4',
    'features' => ['completion'],
    'price' => [
      'in' => 0.10,
      'out' => 0.40,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 32768,
    'maxContextualTokens' => 1047576,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'functions', 'json', 'finetune', 'responses', 'mcp'],
    'tools' => ['image_generation']
  ],
  /*
          GPT-4o
          Fast, intelligent, flexible GPT model
          https://platform.openai.com/docs/models/gpt-4o
          */
  [
    'model' => 'gpt-4o',
    'name' => 'GPT-4o',
    'family' => 'gpt-4',
    'features' => ['completion'],
    'price' => [
      'in' => 2.50,
      'out' => 10.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 16384,
    'maxContextualTokens' => 128000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'functions', 'json', 'finetune', 'mcp', 'responses', 'deprecated'],
    'tools' => ['web_search', 'image_generation', 'code_interpreter']
  ],
  /*
            GPT-4o mini
            Fast, affordable small model for focused tasks
            https://platform.openai.com/docs/models/gpt-4o-mini
            */
  [
    'model' => 'gpt-4o-mini',
    'name' => 'GPT-4o Mini',
    'family' => 'gpt-4',
    'features' => ['completion'],
    'price' => [
      'in' => 0.15,
      'out' => 0.60,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 16384,
    'maxContextualTokens' => 128000,
    'finetune' => [
      'in' => 0.15,
      'out' => 0.60,
      'train' => 3.00
    ],
    'tags' => ['core', 'chat', 'vision', 'functions', 'json', 'finetune', 'mcp', 'responses', 'deprecated'],
    'tools' => ['web_search', 'image_generation', 'code_interpreter']
  ],
  /*
            o3
            Advanced reasoning model
            https://platform.openai.com/docs/models/o3
            */
  [
    'model' => 'o3',
    'name' => 'o3',
    'family' => 'o3',
    'features' => ['completion'],
    'price' => [
      'in' => 15.00,
      'out' => 60.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 100000,
    'maxContextualTokens' => 200000,
    'tags' => ['core', 'chat', 'o1-model', 'reasoning', 'responses', 'mcp'],
    'tools' => ['web_search', 'image_generation', 'code_interpreter']
  ],
  /*
              o3-mini
              Fast, flexible, intelligent reasoning model
              https://platform.openai.com/docs/models/o3-mini
              */
  [
    'model' => 'o3-mini',
    'name' => 'o3 Mini',
    'family' => 'o3',
    'features' => ['completion'],
    'price' => [
      'in' => 1.10,
      'out' => 4.40,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 100000,
    'maxContextualTokens' => 200000,
    'tags' => ['core', 'chat', 'o1-model', 'reasoning', 'responses', 'mcp'],
    'tools' => ['web_search', 'image_generation', 'code_interpreter']
  ],
  /*
                GPT Realtime
                Production-ready speech-to-speech model with MCP, image input, and SIP support
                https://platform.openai.com/docs/models/gpt-realtime
                */
  [
    'model' => 'gpt-realtime',
    'name' => 'GPT Realtime',
    'family' => 'realtime',
    'features' => ['core', 'realtime', 'functions'],
    'price' => [
      'text' => [
        'in' => 4.00,
        'cache' => 0.40,
        'out' => 16.00,
      ],
      'audio' => [
        'in' => 32.00,
        'cache' => 0.40,
        'out' => 64.00,
      ],
      'image' => [
        'in' => 5.00,
        'cache' => 0.50,
      ]
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 4096,
    'maxContextualTokens' => 128000,
    'finetune' => false,
    'tags' => ['core', 'realtime', 'functions', 'vision', 'mcp']
  ],
  /*
                GPT Realtime Mini
                Cost-efficient version of GPT Realtime
                https://platform.openai.com/docs/models/gpt-realtime-mini
                */
  [
    'model' => 'gpt-realtime-mini',
    'name' => 'GPT Realtime Mini',
    'family' => 'realtime',
    'features' => ['core', 'realtime', 'functions'],
    'price' => [
      'text' => [
        'in' => 0.60,
        'cache' => 0.06,
        'out' => 2.40,
      ],
      'audio' => [
        'in' => 10.00,
        'cache' => 0.06,
        'out' => 20.00,
      ]
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 4096,
    'maxContextualTokens' => 32000,
    'finetune' => false,
    'tags' => ['core', 'realtime', 'functions', 'vision']
  ],
  /*
                GPT-4o Realtime
                Model capable of realtime text and audio inputs and outputs
                https://platform.openai.com/docs/models/gpt-4o-realtime-preview
                */
  [
    'model' => 'gpt-4o-realtime-preview',
    'name' => 'GPT-4o Realtime (Preview)',
    'family' => 'realtime',
    'features' => ['core', 'realtime', 'functions'],
    'price' => [
      'text' => [
        'in' => 5.00,
        'cache' => 2.50,
        'out' => 20.00,
      ],
      'audio' => [
        'in' => 40.00,
        'cache' => 2.50,
        'out' => 80.00,
      ]
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 4096,
    'maxContextualTokens' => 128000,
    'finetune' => false,
    'tags' => ['core', 'realtime', 'functions', 'vision', 'deprecated']
  ],
  /*
            GPT-4o mini Realtime
            Smaller realtime model for text and audio inputs and outputs
            https://platform.openai.com/docs/models/gpt-4o-mini-realtime-preview
            */
  [
    'model' => 'gpt-4o-mini-realtime-preview',
    'name' => 'GPT-4o Mini Realtime (Preview)',
    'family' => 'realtime',
    'features' => ['core', 'realtime', 'functions'],
    'price' => [
      'text' => [
        'in' => 0.60,
        'cache' => 0.30,
        'out' => 2.40,
      ],
      'audio' => [
        'in' => 10.00,
        'cache' => 0.30,
        'out' => 20.00,
      ]
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 4096,
    'maxContextualTokens' => 128000,
    'finetune' => false,
    'tags' => ['core', 'realtime', 'functions', 'vision', 'deprecated']
  ],
  /*
      DALL·E 3
      Our latest image generation model
      https://platform.openai.com/docs/models/dall-e-3
      */
  [
    'model' => 'gpt-image-1.5',
    'name' => 'GPT Image 1.5',
    'family' => 'gpt-image',
    'features' => ['text-to-image'],
    'resolutions' => [
      [
        'name' => '1024x1024',
        'label' => '1024x1024'
      ],
      [
        'name' => '1024x1536',
        'label' => '1024x1536'
      ],
      [
        'name' => '1536x1024',
        'label' => '1536x1024'
      ]
    ],
    'type' => 'token',
    'mode' => 'image',
    'price' => [
      'in' => 8.00,
      'out' => 32.00,
      'cached' => 2.00
    ],
    'unit' => 1 / 1000000,
    'finetune' => false,
    'tags' => ['core', 'image', 'image-edit', 'responses']
  ],
  [
    'model' => 'gpt-image-1',
    'name' => 'GPT Image 1',
    'family' => 'gpt-image',
    'features' => ['text-to-image'],
    'resolutions' => [
      [
        'name' => '1024x1024',
        'label' => '1024x1024'
      ],
      [
        'name' => '1024x1536',
        'label' => '1024x1536'
      ],
      [
        'name' => '1536x1024',
        'label' => '1536x1024'
      ]
    ],
    'type' => 'token',
    'mode' => 'image',
    'price' => [
      'in' => 10.00,
      'out' => 40.00,
      'cached' => 2.50
    ],
    'unit' => 1 / 1000000,
    'finetune' => false,
    'tags' => ['core', 'image', 'image-edit', 'responses']
  ],
  [
    'model' => 'gpt-image-1-mini',
    'name' => 'GPT Image 1 Mini',
    'family' => 'gpt-image',
    'features' => ['text-to-image'],
    'resolutions' => [
      [
        'name' => '1024x1024',
        'label' => '1024x1024'
      ],
      [
        'name' => '1024x1536',
        'label' => '1024x1536'
      ],
      [
        'name' => '1536x1024',
        'label' => '1536x1024'
      ]
    ],
    'type' => 'token',
    'mode' => 'image',
    'price' => [
      'in' => 2.50,
      'out' => 8.00,
      'cached' => 0.25
    ],
    'unit' => 1 / 1000000,
    'finetune' => false,
    'tags' => ['core', 'image', 'image-edit', 'responses']
  ],
  [
    'model' => 'dall-e-3',
    'name' => 'DALL-E 3',
    'family' => 'dall-e',
    'features' => ['text-to-image'],
    'resolutions' => [
      [
        'name' => '1024x1024',
        'label' => '1024x1024',
        'price' => 0.040
      ],
      [
        'name' => '1024x1792',
        'label' => '1024x1792',
        'price' => 0.080
      ],
      [
        'name' => '1792x1024',
        'label' => '1792x1024',
        'price' => 0.080
      ]
    ],
    'type' => 'image',
    'unit' => 1,
    'finetune' => false,
    'tags' => ['core', 'image']
  ],
  [
    'model' => 'dall-e-3-hd',
    'name' => 'DALL-E 3 (HD)',
    'family' => 'dall-e',
    'features' => ['text-to-image'],
    'resolutions' => [
      [
        'name' => '1024x1024',
        'label' => '1024x1024',
        'price' => 0.080
      ],
      [
        'name' => '1024x1792',
        'label' => '1024x1792',
        'price' => 0.120
      ],
      [
        'name' => '1792x1024',
        'label' => '1792x1024',
        'price' => 0.120
      ]
    ],
    'type' => 'image',
    'unit' => 1,
    'finetune' => false,
    'tags' => ['core', 'image']
  ],
  /*
    Sora 2
    Flagship video generation with synced audio
    https://platform.openai.com/docs/models/sora-2
    */
  [
    'model' => 'sora-2',
    'name' => 'Sora 2',
    'family' => 'sora',
    'features' => ['text-to-video'],
    'resolutions' => [
      [
        'name' => '720x1280',
        'label' => 'Portrait (720x1280)',
        'price' => 0.10
      ],
      [
        'name' => '1280x720',
        'label' => 'Landscape (1280x720)',
        'price' => 0.10
      ]
    ],
    'durations' => [ 4, 8, 12 ],
    'type' => 'video',
    'unit' => 'second',
    'finetune' => false,
    'tags' => ['core', 'video']
  ],
  [
    'model' => 'sora-2-pro',
    'name' => 'Sora 2 Pro',
    'family' => 'sora',
    'features' => ['text-to-video'],
    'resolutions' => [
      [
        'name' => '720x1280',
        'label' => 'Portrait (720x1280)',
        'price' => 0.30
      ],
      [
        'name' => '1280x720',
        'label' => 'Landscape (1280x720)',
        'price' => 0.30
      ],
      [
        'name' => '1024x1792',
        'label' => 'Portrait High (1024x1792)',
        'price' => 0.50
      ],
      [
        'name' => '1792x1024',
        'label' => 'Landscape High (1792x1024)',
        'price' => 0.50
      ]
    ],
    'durations' => [ 4, 8, 12 ],
    'type' => 'video',
    'unit' => 'second',
    'finetune' => false,
    'tags' => ['core', 'video']
  ],
  // Embedding models:
  // OpenAI v3 models support Matryoshka embeddings (MRL) allowing dimension truncation
  // while preserving semantic meaning. The dimensions array lists native + recommended sizes.
  // See: https://huggingface.co/blog/matryoshka
  [
    'model' => 'text-embedding-3-small',
    'name' => 'Embedding 3-Small',
    'family' => 'text-embedding',
    'features' => ['embedding'],
    'price' => 0.02,
    'type' => 'token',
    'unit' => 1 / 1000000,
    'finetune' => false,
    'dimensions' => 1536, // Native output dimension
    'tags' => ['core', 'embedding', 'matryoshka'],
  ],
  [
    'model' => 'text-embedding-3-large',
    'name' => 'Embedding 3-Large',
    'family' => 'text-embedding',
    'features' => ['embedding'],
    'price' => 0.13,
    'type' => 'token',
    'unit' => 1 / 1000000,
    'finetune' => false,
    'dimensions' => 3072, // Native output dimension
    'tags' => ['core', 'embedding', 'matryoshka'],
  ],
  // Ada-002 is a legacy model with fixed dimensions (no truncation support)
  [
    'model' => 'text-embedding-ada-002',
    'name' => 'Embedding Ada-002',
    'family' => 'text-embedding',
    'features' => ['embedding'],
    'price' => 0.10,
    'type' => 'token',
    'unit' => 1 / 1000000,
    'finetune' => false,
    'dimensions' => 1536, // Fixed dimension (no matryoshka support)
    'tags' => ['core', 'embedding'],
  ],
  // Audio Models:
  [
    'model' => 'gpt-4o-transcribe',
    'name' => 'GPT-4o Transcribe',
    'family' => 'whisper',
    'features' => ['speech-to-text'],
    'price' => 0.006,
    'type' => 'second',
    'unit' => 1,
    'finetune' => false,
    'tags' => ['core', 'audio', 'deprecated'],
  ],
  [
    'model' => 'gpt-4o-mini-transcribe',
    'name' => 'GPT-4o Mini Transcribe',
    'family' => 'whisper',
    'features' => ['speech-to-text'],
    'price' => 0.003,
    'type' => 'second',
    'unit' => 1,
    'finetune' => false,
    'tags' => ['core', 'audio', 'deprecated'],
  ],
  [
    'model' => 'whisper-1',
    'name' => 'Whisper',
    'family' => 'whisper',
    'features' => ['speech-to-text'],
    'price' => 0.006,
    'type' => 'second',
    'unit' => 1,
    'finetune' => false,
    'tags' => ['core', 'audio'],
  ],
  /*
                  Deprecated Models
                  */
  [
    'model' => 'dall-e',
    'name' => 'DALL-E 2',
    'family' => 'dall-e',
    'features' => ['text-to-image'],
    'resolutions' => [
      [
        'name' => '256x256',
        'label' => '256x256',
        'price' => 0.016
      ],
      [
        'name' => '512x512',
        'label' => '512x512',
        'price' => 0.018
      ],
      [
        'name' => '1024x1024',
        'label' => '1024x1024',
        'price' => 0.020
      ]
    ],
    'type' => 'image',
    'unit' => 1,
    'finetune' => false,
    'tags' => ['core', 'image', 'deprecated']
  ],
] );

define( 'MWAI_ANTHROPIC_MODELS', [
  [
    'model' => 'claude-opus-4-6',
    'name' => 'Claude Opus 4.6',
    'family' => 'claude-4',
    'features' => ['completion'],
    'price' => [
      'in' => 5.00,
      'out' => 25.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 128000,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'reasoning', 'mcp', 'latest'],
    'tools' => ['code_interpreter', 'thinking']
  ],
  [
    'model' => 'claude-opus-4-5',
    'name' => 'Claude Opus 4.5',
    'family' => 'claude-4',
    'features' => ['completion'],
    'price' => [
      'in' => 5.00,
      'out' => 25.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 64000,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'reasoning', 'mcp'],
    'tools' => ['code_interpreter', 'thinking']
  ],
  [
    'model' => 'claude-sonnet-4-6',
    'name' => 'Claude Sonnet 4.6',
    'family' => 'claude-4',
    'features' => ['completion'],
    'price' => [
      'in' => 3.00,
      'out' => 15.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 64000,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'reasoning', 'mcp', 'latest'],
    'tools' => ['code_interpreter', 'thinking']
  ],
  [
    'model' => 'claude-sonnet-4-5-20250929',
    'name' => 'Claude Sonnet 4.5 (2025/09/29)',
    'family' => 'claude-4',
    'features' => ['completion'],
    'price' => [
      'in' => 3.00,
      'out' => 15.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 64000,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'reasoning', 'mcp'],
    'tools' => ['code_interpreter', 'thinking']
  ],
  [
    'model' => 'claude-sonnet-4-5',
    'name' => 'Claude Sonnet 4.5',
    'family' => 'claude-4',
    'features' => ['completion'],
    'price' => [
      'in' => 3.00,
      'out' => 15.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 64000,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'reasoning', 'mcp'],
    'tools' => ['code_interpreter', 'thinking']
  ],
  [
    'model' => 'claude-opus-4-1-20250805',
    'name' => 'Claude Opus 4.1 (2025/08/05)',
    'family' => 'claude-4',
    'features' => ['completion'],
    'price' => [
      'in' => 15.00,
      'out' => 75.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 32000,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'reasoning', 'mcp'],
    'tools' => ['code_interpreter', 'thinking']
  ],
  [
    'model' => 'claude-opus-4-1',
    'name' => 'Claude Opus 4.1',
    'family' => 'claude-4',
    'features' => ['completion'],
    'price' => [
      'in' => 15.00,
      'out' => 75.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 32000,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'reasoning', 'mcp'],
    'tools' => ['code_interpreter', 'thinking']
  ],
  [
    'model' => 'claude-opus-4-20250514',
    'name' => 'Claude Opus 4 (2025/05/14)',
    'family' => 'claude-4',
    'features' => ['completion'],
    'price' => [
      'in' => 15.00,
      'out' => 75.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 32000,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'reasoning', 'mcp'],
    'tools' => ['code_interpreter', 'thinking']
  ],
  [
    'model' => 'claude-opus-4-0',
    'name' => 'Claude Opus 4',
    'family' => 'claude-4',
    'features' => ['completion'],
    'price' => [
      'in' => 15.00,
      'out' => 75.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 32000,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'reasoning', 'mcp', 'latest'],
    'tools' => ['code_interpreter', 'thinking']
  ],
  [
    'model' => 'claude-sonnet-4-20250514',
    'name' => 'Claude Sonnet 4 (2025/05/14)',
    'family' => 'claude-4',
    'features' => ['completion'],
    'price' => [
      'in' => 3.00,
      'out' => 15.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 64000,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'reasoning', 'mcp'],
    'tools' => ['code_interpreter', 'thinking']
  ],
  [
    'model' => 'claude-sonnet-4-0',
    'name' => 'Claude Sonnet 4',
    'family' => 'claude-4',
    'features' => ['completion'],
    'price' => [
      'in' => 3.00,
      'out' => 15.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 64000,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'reasoning', 'mcp', 'latest'],
    'tools' => ['code_interpreter', 'thinking']
  ],
  [
    'model' => 'claude-haiku-4-5-20251001',
    'name' => 'Claude-4.5 Haiku (2025/10/01)',
    'family' => 'claude-4',
    'features' => ['completion'],
    'price' => [
      'in' => 1.00,
      'out' => 5.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 64000,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'reasoning', 'mcp'],
    'tools' => ['code_interpreter', 'thinking']
  ],
  [
    'model' => 'claude-haiku-4-5',
    'name' => 'Claude-4.5 Haiku',
    'family' => 'claude-4',
    'features' => ['completion'],
    'price' => [
      'in' => 1.00,
      'out' => 5.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 64000,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'reasoning', 'mcp', 'latest'],
    'tools' => ['code_interpreter', 'thinking']
  ],
  [
    'model' => 'claude-3-7-sonnet-latest',
    'name' => 'Claude-3.7 Sonnet',
    'family' => 'claude-3',
    'features' => ['completion'],
    'price' => [
      'in' => 3.00,
      'out' => 15.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 64000,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'reasoning', 'mcp'],
    'tools' => ['code_interpreter', 'thinking']
  ],
  [
    'model' => 'claude-3-5-sonnet-latest',
    'name' => 'Claude-3.5 Sonnet',
    'family' => 'claude-3',
    'features' => ['completion'],
    'price' => [
      'in' => 3.00,
      'out' => 15.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 4096,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'mcp']
  ],
  [
    'model' => 'claude-3-5-sonnet-20241022',
    'name' => 'Claude-3.5 Sonnet (2024/10/22)',
    'family' => 'claude-3',
    'features' => ['completion'],
    'price' => [
      'in' => 3.00,
      'out' => 15.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 4096,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'mcp']
  ],
  [
    'model' => 'claude-3-5-sonnet-20240620',
    'name' => 'Claude-3.5 Sonnet (2024/06/20)',
    'family' => 'claude-3',
    'features' => ['completion'],
    'price' => [
      'in' => 3.00,
      'out' => 15.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 4096,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'mcp']
  ],
  [
    'model' => 'claude-3-sonnet-20240229',
    'name' => 'Claude-3 Sonnet (2024/02/29)',
    'family' => 'claude-3',
    'features' => ['completion'],
    'price' => [
      'in' => 3.00,
      'out' => 15.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 4096,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'deprecated']
  ],
  [
    // Deprecated: Anthropic retired Claude 3 Opus on January 5, 2026.
    'model' => 'claude-3-opus-latest',
    'name' => 'Claude-3 Opus (Latest)',
    'family' => 'claude-3',
    'features' => ['completion'],
    'price' => [
      'in' => 15.00,
      'out' => 75.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 4096,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'deprecated']
  ],
  [
    // Deprecated: Anthropic retired Claude 3 Opus on January 5, 2026.
    'model' => 'claude-3-opus-20240229',
    'name' => 'Claude-3 Opus (2024/02/29)',
    'family' => 'claude-3',
    'features' => ['completion'],
    'price' => [
      'in' => 15.00,
      'out' => 75.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 4096,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions', 'deprecated']
  ],
  [
    'model' => 'claude-3-5-haiku-20241022',
    'name' => 'Claude-3.5 Haiku (2024/10/22)',
    'family' => 'claude-3',
    'features' => ['completion'],
    'price' => [
      'in' => 0.80,
      'out' => 4.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 8192,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files'],
    'tools' => ['code_interpreter']
  ],
  [
    'model' => 'claude-3-5-haiku-latest',
    'name' => 'Claude-3.5 Haiku',
    'family' => 'claude-3',
    'features' => ['completion'],
    'price' => [
      'in' => 0.80,
      'out' => 4.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 8192,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'latest'],
    'tools' => ['code_interpreter']
  ],
  [
    'model' => 'claude-3-haiku-20240307',
    'name' => 'Claude-3 Haiku (2024/03/07)',
    'family' => 'claude-3',
    'features' => ['completion'],
    'price' => [
      'in' => 0.25,
      'out' => 1.25,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'maxCompletionTokens' => 4096,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat', 'vision', 'files', 'functions']
  ]
] );

define( 'MWAI_PERPLEXITY_MODELS', [
  [
    'model' => 'sonar-pro',
    'name' => 'Sonar Pro',
    'family' => 'sonar',
    'features' => ['completion'],
    'price' => [
      'in' => 3.00,
      'out' => 15.00,
      'search' => 5.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'searchUnit' => 1 / 1000,
    'maxCompletionTokens' => 8192,
    'maxContextualTokens' => 200000,
    'finetune' => false,
    'tags' => ['core', 'chat'],
  ],
  [
    'model' => 'sonar',
    'name' => 'Sonar',
    'family' => 'sonar',
    'features' => ['completion'],
    'price' => [
      'in' => 1.00,
      'out' => 1.00,
      'search' => 5.00,
    ],
    'type' => 'token',
    'unit' => 1 / 1000000,
    'searchUnit' => 1 / 1000,
    'maxCompletionTokens' => 4096,
    'maxContextualTokens' => 127000,
    'finetune' => false,
    'tags' => ['core', 'chat'],
  ],
] );

// Mistral AI Models
// Models are fetched dynamically from the Mistral API
define( 'MWAI_MISTRAL_MODELS', [] );
