// Previous: 0.7.1
// Current: 0.7.3

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
  // {
  //   id: 'code-davinci-002',
  //   name: 'code-davinci-002',
  //   short: 'davinci',
  //   description: 'Most capable Codex model. Particularly good at translating natural language to code. In addition to completing code, also supports inserting completions within code.',
  // },
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

const Templates_Playground = [
  {
    id: 'default',
    name: 'Default',
    mode: 'query',
    model: 'text-davinci-003',
    temperature: 0.8,
    stopSequence: '',
    maxTokens: 2048,
    prompt: ''
  }, {
    id: 'article_translator',
    name: 'Text Translator',
    mode: 'query',
    model: 'text-davinci-003',
    temperature: 0.3,
    stopSequence: '',
    maxTokens: 2048,
    prompt: `Translate this article into French:\n\nUchiko is located in Ehime prefecture, in the west of the island. The town was prosperous at the end of the 19th century thanks to its production of very good quality white wax. This economic boom allowed wealthy local merchants to build beautiful properties, whose heritage is still visible throughout the town.\n`,
  }, {
    id: 'restaurant_review',
    name: 'Restaurant Review Writer',
    mode: 'query',
    model: 'text-davinci-003',
    temperature: 0.8,
    stopSequence: '',
    maxTokens: 2048,
    prompt: 'Write a review for a French restaurant located in Kagurazaka, Tokyo. Looks like an old restaurant, food is traditional, chef is talkative, it is always full. Not expensive, but not fancy.\n',
  }, {
    id: 'article_corrector',
    name: 'Text Corrector',
    mode: 'query',
    model: 'text-davinci-003',
    temperature: 0.2,
    stopSequence: '',
    maxTokens: 2048,
    prompt: 'Fix the grammar and spelling mistakes in this text:\n\nI wake up at eleben yesderday, I will go bed eary tonigt.\n',
  }, {
    id: 'seo_assistant',
    name: 'SEO Optimizer',
    mode: 'query',
    model: 'text-davinci-003',
    temperature: 0.6,
    stopSequence: '',
    maxTokens: 1024,
    prompt: `For the following article, write a SEO-friendly and short title, keywords for Google, and a short excerpt to introduce it. Use this format:\n\nTitle: \nKeywords: \nExcerpt:\n\nArticle:\nUchiko is located in Ehime prefecture, in the west of the island. The town was prosperous at the end of the 19th century thanks to its production of very good quality white wax. This economic boom allowed wealthy local merchants to build beautiful properties, whose heritage is still visible throughout the town.`,
  }, {
    id: 'wp_assistant',
    name: 'WordPress Assistant',
    mode: 'continuous',
    model: 'text-davinci-003',
    temperature: 0.8,
    stopSequence: '',
    maxTokens: 150,
    prompt: `Converse as a WordPress expert. Be helpful, friendly, concise, avoid external URLs and commercial solutions.\n\nAI: Hi! How can I help you with WP today?\n`
  }, {
    id: 'casually_fine_tuned',
    name: 'Casually Fined Tuned Tester',
    mode: 'query',
    model: 'text-davinci-003',
    temperature: 0.4,
    stopSequence: '\\n\\n',
    maxTokens: 1024,
    prompt: `Hello! What's your name?\n\n###\n\n`
  }
];

const Templates_ImagesGenerator = [
  {
    id: 'default',
    name: 'Default',
    model: 'dall-e',
    maxResults: 3,
    prompt: '',
  },
  {
    id: 'japan',
    name: 'Ghibli Inspired',
    model: 'dall-e',
    maxResults: 3,
    prompt: 'japan, tokyo, trees, izakaya, anime oil painting, high resolution, ghibli inspired, 4k',
  },
  {
    id: 'steampunk',
    name: 'Steampunk Architecture',
    model: 'dall-e',
    maxResults: 3,
    prompt: 'steampunk architecture, exterior view, award-winning architectural photography from magazine, trees, theater',
  },
  {
    id: 'modern-illustration',
    name: 'Modern Illustration',
    model: 'dall-e',
    maxResults: 3,
    prompt: 'illustration of a cat, modern design, for the web, cute, happy, 4k, high resolution, trending in artstation',
  },
];

const Templates_ContentGenerator = [
  {
    id: 'default',
    name: 'Default',
    mode: 'single',
    topic: "",
    topics: "",
    topicsAreTitles: false,
    model: 'text-davinci-003',
    temperature: 0.8,
    maxTokens: 2048,
    sectionsCount: 2,
    paragraphsPerSection: 3,
    language: 'en',
    writingStyle: 'creative',
    writingTone: 'cheerful',
    titlePromptFormat: `Write a title for an article about "{TOPIC}" in {LANGUAGE}. Style: {WRITING_STYLE}. Tone: {WRITING_TONE}. Must be between 40 and 60 characters.`,
    sectionsPromptFormat: `Write {SECTIONS_COUNT} consecutive headings for an article about "{TITLE}", in {LANGUAGE}. Style: {WRITING_STYLE}. Tone: {WRITING_TONE}.\n\nEach heading is between 40 and 60 characters.\n\nUse Markdown for the headings (## ).`,
    contentPromptFormat: `Write an article about "{TITLE}" in {LANGUAGE}. The article is organized by the following headings:\n\n{SECTIONS}\n\nWrite {PARAGRAPHS_PER_SECTION} paragraphs per heading.\n\nUse Markdown for formatting.\n\nAdd an introduction prefixed by "===INTRO: ", and a conclusion prefixed by "===OUTRO: ".\n\nStyle: {WRITING_STYLE}. Tone: {WRITING_TONE}.`,
    excerptPromptFormat: `Write an excerpt for an article about "{TITLE}" in {LANGUAGE}. Style: {WRITING_STYLE}. Tone: {WRITING_TONE}. Must be between 40 and 60 characters.`,
  }
];

export { OpenAI_models, OpenAI_PricingPerModel, WritingStyles, WritingTones, 
  Templates_Playground, Templates_ImagesGenerator, Templates_ContentGenerator }