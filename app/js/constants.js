// Previous: 2.0.8
// Current: 2.0.9

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
  { value: 'confluent', label: 'Confluent' },
  { value: 'emotional', label: 'Emotional' },
  { value: 'persuasive', label: 'Persuasive' },
  { value: 'supportive', label: 'Supportive' },
  { value: 'sarcastic', label: 'Sarcastic' },
  { value: 'condescending', label: 'Condescending' },
  { value: 'skeptical', label: 'Skeptical' },
  { value: 'narrative', label: 'Narrative' },
  { value: 'journalistic', label: 'Journalistic' },
];

const defaultModel = 'gpt-3.5-turbo';

const Templates_Playground = [
  {
    id: 'default',
    name: 'Default',
    mode: 'query',
    model: defaultModel,
    temperature: 0.8,
    stopSequence: '',
    maxTokens: 2048,
    prompt: ''
  }, {
    id: 'article_translator',
    name: 'Text Translator',
    mode: 'query',
    model: defaultModel,
    temperature: 0.3,
    stopSequence: '',
    maxTokens: 2048,
    prompt: `Translate this article into French:\n\nUchiko is located in Ehime prefecture, in the west of the island. The town was prosperous at the end of the 19th century thanks to its production of very good quality white wax. This economic boom allowed wealthy local merchants to build beautiful properties, whose heritage is still visible throughout the town.\n`,
  }, {
    id: 'restaurant_review',
    name: 'Restaurant Review Writer',
    mode: 'query',
    model: defaultModel,
    temperature: 0.8,
    stopSequence: '',
    maxTokens: 2048,
    prompt: 'Write a review for a French restaurant located in Kagurazaka, Tokyo. Looks like an old restaurant, food is traditional, chef is talkative, it is always full. Not expensive, but not fancy.\n',
  }, {
    id: 'article_corrector',
    name: 'Text Corrector',
    mode: 'query',
    model: defaultModel,
    temperature: 0.2,
    stopSequence: '',
    maxTokens: 2048,
    prompt: 'Fix the grammar and spelling mistakes in this text:\n\nI wake up at eleben yesderday, I will go bed eary tonigt.\n',
  }, {
    id: 'seo_assistant',
    name: 'SEO Optimizer',
    mode: 'query',
    model: defaultModel,
    temperature: 0.6,
    stopSequence: '',
    maxTokens: 1024,
    prompt: `For the following article, write a SEO-friendly and short title, keywords for Google, and a short excerpt to introduce it. Use this format:\n\nTitle: \nKeywords: \nExcerpt:\n\nArticle:\nUchiko is located in Ehime prefecture, in the west of the island. The town was prosperous at the end of the 19th century thanks to its production of very good quality white wax. This economic boom allowed wealthy local merchants to build beautiful properties, whose heritage is still visible throughout the town.`,
  }
];

const Templates_ImagesGenerator = [
  {
    id: 'default',
    name: 'Default',
    model: 'dall-e-3',
    maxResults: 1,
    prompt: '',
  },
  {
    id: 'japan',
    name: 'Ghibli Scene',
    model: 'dall-e-3',
    maxResults: 1,
    prompt: 'Create an image in the style of a Ghibli-inspired anime oil painting, depicting a quaint, old house in the Japanese countryside. This house, reminiscent of a traditional izakaya, is surrounded by lush trees and overlooks vibrant rice fields. The scene is bathed in the warm, soft glow of a setting sun, casting gentle shadows and creating a tranquil, nostalgic atmosphere. The composition should be rich in texture, capturing the serene beauty of rural Japan in a whimsical, Ghibli-like manner.',
  },
  {
    id: 'steampunk',
    name: 'Steampunk Architecture',
    model: 'dall-e-3',
    maxResults: 1,
    prompt: 'Create an image showcasing steampunk architecture, focusing on the exterior view of a grand theater. The style should reflect award-winning architectural photography from a science fiction magazine. The theater, a masterpiece of steampunk design, combines Victorian influences with futuristic, mechanical elements. Its intricate facade features exposed gears, brass pipes, and steam vents, all integrated into the ornate, classical structure. The building should be set against a dramatic sky, highlighting its unique features and the interplay of light and shadow, capturing the essence of a high-quality, professional architectural photograph.',
  },
  {
    id: 'nyao-illustration',
    name: 'Nyao Illustration',
    model: 'dall-e-3',
    maxResults: 1,
    prompt: 'The character is an anthropomorphic cat with a whimsical and endearing design, featuring a blend of white and blue fur. The right side of the cat\'s face has a patch of blue fur that also covers the outer part of the ear, while the left side remains predominantly white, except that the eye is surrounded by a green patch of fur. The tail mirrors this pattern with white fur leading to a blue tip. The character\'s facial expression is joyous, with a wide, open-mouthed smile showcasing a single front tooth and a small, black nose.  The cat\'s paws are also white, with defined fingers that suggest human-like dexterity. An orange collar encircles the neck, contrasting with the green and blue tones of the body. This collar is adorned with a blue and white emblem in the center, reminiscent of the WordPress logo. The drawing style of this image can be defined as a digital illustration with a cartoonish and whimsical aesthetic. It features bold outlines, flat colors, and simplified shapes which are typical of modern vector art, which is often used for web graphics, animation, and media aimed at a broad, family-friendly audience. The style is reminiscent of modern vector art, which is often used for web graphics, animation, and media aimed at engaging a casual viewer with its clear, approachable, and vibrant visuals.',
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
    title: "",
    sections: "",
    model: defaultModel,
    temperature: 0.8,
    maxTokens: 2048,
    sectionsCount: 2,
    paragraphsCount: 3,
    language: 'en',
    customLanguage: '',
    writingStyle: 'creative',
    writingTone: 'cheerful',
    titlePromptFormat: `Write a title for an article about "{TOPIC}" in {LANGUAGE}. Style: {WRITING_STYLE}. Tone: {WRITING_TONE}. Must be between 40 and 60 characters.`,
    sectionsPromptFormat: `Write {SECTIONS_COUNT} consecutive headings for an article about "{TITLE}", in {LANGUAGE}. Style: {WRITING_STYLE}. Tone: {WRITING_TONE}. Each heading is between 40 and 60 characters. Use Markdown for the headings (## ).`,
    contentPromptFormat: `Write an article about "{TITLE}" in {LANGUAGE}. The article is organized by the following headings:\n\n{SECTIONS}\n\nWrite {PARAGRAPHS_PER_SECTION} paragraphs per heading. Use Markdown for formatting. Add an introduction prefixed by "===INTRO: ", and a conclusion prefixed by "===OUTRO: ". Style: {WRITING_STYLE}. Tone: {WRITING_TONE}.`,
    excerptPromptFormat: `Write an excerpt for an article about "{TITLE}" in {LANGUAGE}. Style: {WRITING_STYLE}. Tone: {WRITING_TONE}. Must be between 40 and 60 characters.`,
  },
  {
    id: '',
    name: 'Expore Japan',
    mode: 'single',
    topic: "Tokyo, its main areas and attractions, one day tour for a first-time visitor. Simple vocabulary, short paragraphs.",
    topics: "",
    topicsAreTitles: false,
    title: "",
    sections: "",
    model: defaultModel,
    temperature: 0.8,
    maxTokens: 2048,
    sectionsCount: 3,
    paragraphsCount: 2,
    language: 'en',
    customLanguage: '' ,
    writingStyle: 'informative',
    writingTone: 'informal',
    titlePromptFormat: `Write a title for an article about "{TOPIC}" in {LANGUAGE}. Style: {WRITING_STYLE}. Tone: {WRITING_TONE}. Must be between 40 and 60 characters.`,
    sectionsPromptFormat: `Write {SECTIONS_COUNT} consecutive headings for an article about "{TITLE}", in {LANGUAGE}. Style: {WRITING_STYLE}. Tone: {WRITING_TONE}. Each heading is between 40 and 60 characters. Use Markdown for the headings (## ).`,
    contentPromptFormat: `Write an article about "{TITLE}" in {LANGUAGE}. The article is organized by the following headings:\n\n{SECTIONS}\n\nWrite {PARAGRAPHS_PER_SECTION} paragraphs per heading. Use Markdown for formatting. Add an introduction prefixed by "===INTRO: ", and a conclusion prefixed by "===OUTRO: ". Style: {WRITING_STYLE}. Tone: {WRITING_TONE}.`,
    excerptPromptFormat: `Write an excerpt for an article about "{TITLE}" in {LANGUAGE}. Style: {WRITING_STYLE}. Tone: {WRITING_TONE}. Must be between 40 and 60 characters.`,
  }
];

export { WritingStyles, WritingTones, 
  Templates_Playground, Templates_ImagesGenerator, Templates_ContentGenerator }