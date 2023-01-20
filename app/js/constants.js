// Previous: 0.2.4
// Current: 0.3.3

const OpenAI_models = [
  {
    id: 'text-davinci-003',
    name: 'text-davinci-003',
    short: 'davinci',
    description: 'Most capable GPT-3 model. Can do any task the other models can do, often with higher quality, longer output and better instruction-following. Also supports inserting completions within text.',
    strength: 'Complex intent, cause and effect, summarization for audience'
  },
  {
    id: 'text-curie-001',
    name: 'text-curie-001',
    short: 'curie',
    description: 'Very capable, but faster and lower cost than Davinci.',
    strength: 'Language translation, complex classification, text sentiment, summarization'
  },
  {
    id: 'text-babbage-001',
    name: 'text-babbage-001',
    short: 'babbage',
    description: 'Capable of straightforward tasks, very fast, and lower cost.',
    strength: 'Moderate classification, semantic search classification'
  },
  {
    id: 'text-ada-001',
    name: 'text-ada-001',
    short: 'ada',
    description: 'Capable of very simple tasks, usually the fastest model in the GPT-3 series, and lowest cost.',
    strength: 'Parsing text, simple classification, address correction, keywords'
  },
  {
    id: 'code-davinci-002',
    name: 'code-davinci-002',
    short: 'davinci',
    description: 'Most capable Codex model. Particularly good at translating natural language to code. In addition to completing code, also supports inserting completions within code.',
  },
  // {
  //   id: 'code-cushman-001',
  //   name: 'code-cushman-001',
  //   description: 'Almost as capable as Davinci Codex, but slightly faster. This speed advantage may make it preferable for real-time applications.',
  // }
];

const WritingStyles = [
  { value: 'informative', label: 'Informative' },
  { value: 'descriptive', label: 'Descriptive' },
  { value: 'creative', label: 'Creative' },
  { value: 'narrative', label: 'Narrative' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'reflective', label: 'Reflective' },
  { value: 'argumentative', label: 'Argumentative' },
  { value: 'analytical', label: 'Analytical' },
  { value: 'evaluative', label: 'Evaluative' },
  { value: 'journalistic', label: 'Journalistic' },
  { value: 'technical', label: 'Technical' }
];

const WritingTones = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'formal', label: 'Formal' },
  { value: 'assertive', label: 'Assertive' },
  { value: 'cheerful', label: 'Cheerful' },
  { value: 'humorous', label: 'Humorous' },
  { value: 'informal', label: 'Informal' },
  { value: 'inspirational', label: 'Inspirational' },
  { value: 'professional', label: 'Professional' },
  { value: 'confvalueent', label: 'Confvalueent' },
  { value: 'emotional', label: 'Emotional' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'supportive', label: 'Supportive' },
  { value: 'sarcastic', label: 'Sarcastic' },
  { value: 'condescending', label: 'Condescending' },
  { value: 'skeptical', label: 'Skeptical' },
  { value: 'narrative', label: 'Narrative' },
  { value: 'journalistic', label: 'Journalistic' },
];

const OpenAI_PricingPerModel = [
  { model: 'davinci', price: 0.02 },
  { model: 'curie', price: 0.002 },
  { model: 'babbage', price: 0.0005 },
  { model: 'ada', price: 0.0004 },
  { model: 'dall-e', price: 0.02 }
];

export { OpenAI_models, OpenAI_PricingPerModel, WritingStyles, WritingTones }