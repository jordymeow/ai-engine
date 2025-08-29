// Previous: 2.8.5
// Current: 3.0.5

import i18n from '@root/i18n';

const WritingStyles = [
  { value: 'informative', label: i18n.WRITING_STYLES.INFORMATIVE },
  { value: 'descriptive', label: i18n.WRITING_STYLES.DESCRIPTIVE },
  { value: 'creative', label: i18n.WRITING_STYLES.CREATIVE },
  { value: 'narrative', label: i18n.WRITING_STYLES.NARRATIVE },
  { value: 'persuasive', label: i18n.WRITING_STYLES.PERSUASIVE },
  { value: 'reflective', label: i18n.WRITING_STYLES.REFLECTIVE },
  { value: 'argumentative', label: i18n.WRITING_STYLES.ARGUMENTATIVE },
  { value: 'analytical', label: i18n.WRITING_STYLES.ANALYTICAL },
  { value: 'evaluative', label: i18n.WRITING_STYLES.EVALUATIVE },
  { value: 'journalistic', label: i18n.WRITING_STYLES.JOURNALISTIC },
  { value: 'technical', label: i18n.WRITING_STYLES.TECHNICAL }
];

const WritingTones = [
  { value: 'neutral', label: i18n.WRITING_TONES.NEUTRAL },
  { value: 'formal', label: i18n.WRITING_TONES.FORMAL },
  { value: 'assertive', label: i18n.WRITING_TONES.ASSERTIVE },
  { value: 'cheerful', label: i18n.WRITING_TONES.CHEERFUL },
  { value: 'humorous', label: i18n.WRITING_TONES.HUMOROUS },
  { value: 'informal', label: i18n.WRITING_TONES.INFORMAL },
  { value: 'inspirational', label: i18n.WRITING_TONES.INSPIRATIONAL },
  { value: 'professional', label: i18n.WRITING_TONES.PROFESSIONAL },
  { value: 'confluent', label: i18n.WRITING_TONES.CONFLUENT },
  { value: 'emotional', label: i18n.WRITING_TONES.EMOTIONAL },
  { value: 'persuasive', label: i18n.WRITING_TONES.PERSUASIVE },
  { value: 'supportive', label: i18n.WRITING_TONES.SUPPORTIVE },
  { value: 'sarcastic', label: i18n.WRITING_TONES.SARCASTIC },
  { value: 'condescending', label: i18n.WRITING_TONES.CONDESCENDING },
  { value: 'skeptical', label: i18n.WRITING_TONES.SKEPTICAL },
  { value: 'narrative', label: i18n.WRITING_TONES.NARRATIVE },
  { value: 'journalistic', label: i18n.WRITING_TONES.JOURNALISTIC },
];

const defaultModel = "";

// Shared prompt formats for Content Generator
const defaultTitlePrompt = `Write a title for an article in {LANGUAGE}. Must be between 40 and 60 characters. Write naturally as a human would. Output only the title, no formatting, no Markdown, no special characters.

### TOPIC:
{TOPIC}

### CONTEXT:
{CONTEXT}

Generate a title based on the topic above, taking into account the provided context.`;

const defaultSectionsPrompt = `Write {SECTIONS_COUNT} consecutive headings for an article about "{TITLE}", in {LANGUAGE}. Each heading is between 40 and 60 characters. Format each heading with Markdown (## ). Write naturally as a human would. Output only the headings, nothing else.

### TOPIC:
{TOPIC}

### CONTEXT:
{CONTEXT}

Create headings that align with both the topic and context provided above.`;

const defaultContentPrompt = `Write an article about "{TITLE}" in {LANGUAGE}. Write {PARAGRAPHS_PER_SECTION} paragraphs per heading. Use Markdown for formatting. Add an introduction prefixed by "===INTRO: ", and a conclusion prefixed by "===OUTRO: ". Write naturally as a human would.

### ARTICLE STRUCTURE:
{SECTIONS}

### TOPIC DETAILS:
{TOPIC}

### WRITING CONTEXT:
{CONTEXT}

Write the article following the structure above, incorporating the topic details while adhering to the context guidelines.`;

const defaultExcerptPrompt = `Write an excerpt for an article in {LANGUAGE}. Must be between 40 and 60 characters. Write naturally as a human would. Output only the excerpt, no formatting.

### ARTICLE TITLE:
"{TITLE}"

### TOPIC:
{TOPIC}

### CONTEXT:
{CONTEXT}

Create a compelling excerpt that captures the essence of the article while considering the context.`;

const Templates_Playground = [
  {
    id: 'default',
    name: 'Default Template',
    mode: 'query',
    model: defaultModel,
    envId: "",
    temperature: 0.8,
    stopSequence: '',
    maxTokens: 2048,
    prompt: ''
  }, {
    id: 'article_translator',
    name: 'Text Translator',
    mode: 'query',
    model: defaultModel,
    envId: "",
    temperature: 0.3,
    stopSequence: '',
    maxTokens: 2048,
    prompt: `Translate this article into French:\n\nUchiko is located in Ehime prefecture, in the west of the island. The town was prosperous at the end of the 19th century thanks to its production of very good quality white wax. This economic boom allowed wealthy local merchants to build beautiful properties, whose heritage is still visible throughout the town.\n`,
  }, {
    id: 'restaurant_review',
    name: 'Restaurant Review Writer',
    mode: 'query',
    model: defaultModel,
    envId: "",
    temperature: 0.8,
    stopSequence: '',
    maxTokens: 2048,
    prompt: 'Write a review for a French restaurant located in Kagurazaka, Tokyo. Looks like an old restaurant, food is traditional, chef is talkative, it is always full. Not expensive, but not fancy.\n',
  }, {
    id: 'article_corrector',
    name: 'Text Corrector',
    mode: 'query',
    model: defaultModel,
    envId: "",
    temperature: 0.2,
    stopSequence: '',
    maxTokens: 2048,
    prompt: 'Fix the grammar and spelling mistakes in this text:\n\nI wake up at eleben yesderday, I will go bed eary tonigt.\n',
  }, {
    id: 'seo_assistant',
    name: 'SEO Optimizer',
    mode: 'query',
    model: defaultModel,
    envId: "",
    temperature: 0.6,
    stopSequence: '',
    maxTokens: 1024,
    prompt: `For the following article, write a SEO-friendly and short title, keywords for Google, and a short excerpt to introduce it. Use this format:\n\nTitle: \nKeywords: \nExcerpt:\n\nArticle:\nUchiko is located in Ehime prefecture, in the west of the island. The town was prosperous at the end of the 19th century thanks to its production of very good quality white wax. This economic boom allowed wealthy local merchants to build beautiful properties, whose heritage is still visible throughout the town.`,
  }
];

const Templates_ImagesGenerator = [
  {
    id: 'default',
    name: 'Default Template',
    model: '',
    envId: '',
    resolution: '',
    maxResults: 1,
    prompt: '',
  },
  {
    id: 'japan',
    name: 'Ghibli Scene',
    model: '',
    envId: '',
    resolution: '',
    maxResults: 1,
    prompt: 'Create an image in the style of a Ghibli-inspired anime oil painting, depicting a quaint, old house in the Japanese countryside. This house, reminiscent of a traditional izakaya, is surrounded by lush trees and overlooks vibrant rice fields. The scene is bathed in the warm, soft glow of a setting sun, casting gentle shadows and creating a tranquil, nostalgic atmosphere. The composition should be rich in texture, capturing the serene beauty of rural Japan in a whimsical, Ghibli-like manner.',
  },
  {
    id: 'steampunk',
    name: 'Steampunk Architecture',
    model: '',
    envId: '',
    resolution: '',
    maxResults: 1,
    prompt: 'Create an image showcasing steampunk architecture, focusing on the exterior view of a grand theater. The style should reflect award-winning architectural photography from a science fiction magazine. The theater, a masterpiece of steampunk design, combines Victorian influences with futuristic, mechanical elements. Its intricate facade features exposed gears, brass pipes, and steam vents, all integrated into the ornate, classical structure. The building should be set against a dramatic sky, highlighting its unique features and the interplay of light and shadow, capturing the essence of a high-quality, professional architectural photograph.',
  },
  {
    id: 'nyao-illustration',
    name: 'Nyao Illustration',
    model: '',
    envId: '',
    resolution: '',
    maxResults: 1,
    prompt: 'The character is an anthropomorphic cat with a whimsical and endearing design, featuring a blend of white and blue fur. The right side of the cat\'s face has a patch of blue fur that also covers the outer part of the ear, while the left side remains predominantly white, except that the eye is surrounded by a green patch of fur. The tail mirrors this pattern with white fur leading to a blue tip. The character\'s facial expression is joyous, with a wide, open-mouthed smile showcasing a single front tooth and a small, black nose.  The cat\'s paws are also white, with defined fingers that suggest human-like dexterity. An orange collar encircles the neck, contrasting with the green and blue tones of the body. This collar is adorned with a blue and white emblem in the center, reminiscent of the WordPress logo. The drawing style of this image can be defined as a digital illustration with a cartoonish and whimsical aesthetic. It features bold outlines, flat colors, and simplified shapes which are typical of contemporary character design aimed at a broad, family-friendly audience. The style is reminiscent of modern vector art, which is often used for web graphics, animation, and media aimed at engaging a casual viewer with its clear, approachable, and vibrant visuals.',
  },
];

const Templates_ContentGenerator = [
  {
    id: 'default',
    name: 'Default Template',
    mode: 'single',
    topic: "",
    topics: "",
    context: "",
    topicsAreTitles: false,
    title: "",
    sections: "",
    model: defaultModel,
    envId: "",
    temperature: 0.8,
    maxTokens: 2048,
    sectionsCount: 2,
    paragraphsCount: 3,
    language: 'en',
    customLanguage: '',
    writingStyle: 'creative',
    writingTone: 'cheerful',
    titlePromptFormat: defaultTitlePrompt,
    sectionsPromptFormat: defaultSectionsPrompt,
    contentPromptFormat: defaultContentPrompt,
    excerptPromptFormat: defaultExcerptPrompt,
  },
  {
    id: 'explore_tokyo_offbeat',
    name: 'Explore Tokyo Offbeat',
    mode: 'single',
    topic: "5 hidden Tokyo neighborhoods only locals know: retro Showa-era streets, authentic Edo atmosphere, family-run restaurant alleys, old shopping arcades, quiet residential gems. Write in first person as a Tokyo local sharing secret spots.",
    topics: "",
    context: "",
    topicsAreTitles: false,
    title: "",
    sections: "",
    model: defaultModel,
    envId: "",
    temperature: 0.8,
    maxTokens: 2048,
    sectionsCount: 5,
    paragraphsCount: 2,
    language: 'en',
    customLanguage: '' ,
    writingStyle: 'informative',
    writingTone: 'informal',
    titlePromptFormat: defaultTitlePrompt,
    sectionsPromptFormat: defaultSectionsPrompt,
    contentPromptFormat: defaultContentPrompt,
    excerptPromptFormat: defaultExcerptPrompt,
  },
  {
    id: 'cat_blog_bulk',
    name: 'Cat Blog Bulk Generator',
    mode: 'bulk',
    topic: "",
    topics: `Why Cats Make Perfect Companions
Understanding Cat Body Language
The Science Behind Purring
Indoor vs Outdoor Cats Debate
Best Cat Breeds for Families
Cat Nutrition Guide
Training Your Cat: Tips and Tricks
Common Cat Health Issues`,
    context: "Context: This is for a cat enthusiast blog targeting pet owners and cat lovers. The tone should be friendly, informative, and occasionally playful. Include practical tips, scientific facts, and real-world advice. Each article should be engaging and helpful for cat parents at all experience levels.",
    topicsAreTitles: false,
    title: "",
    sections: "",
    model: defaultModel,
    envId: "",
    temperature: 0.7,
    maxTokens: 2048,
    sectionsCount: 4,
    paragraphsCount: 3,
    language: 'en',
    customLanguage: '',
    writingStyle: 'informative',
    writingTone: 'cheerful',
    titlePromptFormat: defaultTitlePrompt,
    sectionsPromptFormat: defaultSectionsPrompt,
    contentPromptFormat: defaultContentPrompt,
    excerptPromptFormat: defaultExcerptPrompt,
  }
];

export { WritingStyles, WritingTones, 
  Templates_Playground, Templates_ImagesGenerator, Templates_ContentGenerator }