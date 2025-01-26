<?php

define( 'MWAI_ENGINES', [
  [
    'name' => 'OpenAI',
    'type' => 'openai',
    'inputs' => ['apikey', 'organizationId'],
    'internal' => true,
    'models' => []
  ],
  [
    'name' => 'Anthropic',
    'type' => 'anthropic',
    'inputs' => ['apikey'],
    'internal' => true,
    'models' => []
  ],
  [
    'name' => 'Azure (OpenAI)',
    'type' => 'azure',
    'inputs' => ['apikey', 'endpoint'],
    'internal' => true,
    'models' => []
  ],
  [
    'name' => 'Google',
    'type' => 'google',
    'inputs' => ['apikey', 'projectId', 'dynamicModels'],
    'internal' => true,
    'models' => []
  ],
  [
    'name' => 'OpenRouter',
    'type' => 'openrouter',
    'inputs' => ['apikey', 'dynamicModels'],
    'internal' => true,
    'models' => []
  ],
  [
    'name' => 'Hugging Face',
    'type' => 'huggingface',
    'inputs' => ['apikey'],
    'internal' => true,
    'models' => []
  ],
  [
    'name' => 'Replicate',
    'type' => 'replicate',
    'inputs' => ['apikey', 'dynamicModels'],
    'internal' => true,
    'models' => []
  ],
  [
    'name' => 'Perplexity',
    'type' => 'perplexity',
    'inputs' => ['apikey'],
    'internal' => true,
    'models' => []
  ],
] );