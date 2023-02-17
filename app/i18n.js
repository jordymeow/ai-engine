// https://developer.wordpress.org/block-editor/how-to-guides/internationalization/

const { __ } = wp.i18n;

const i18n = {};

i18n.COMMON = {
  MODULES: __( 'Modules', 'ai-engine' ),
  SETTINGS: __( 'Settings', 'ai-engine' ),
  CHATBOT: __( 'Chatbot', 'ai-engine' ),
  STATISTICS: __( 'Statistics', 'ai-engine' ),
  STYLE: __( 'Style', 'ai-engine' ),
  ENABLE: __( 'Enable', 'ai-engine' ),
  NAME: __( 'Name', 'ai-engine' ),
  SUBMIT: __( 'Submit', 'ai-engine' ),
  MODEL: __( 'Model', 'ai-engine' ),
  TEMPERATURE: __( 'Temperature', 'ai-engine' ),
  MAX_TOKENS: __( 'Max Tokens', 'ai-engine' ),
  STOP_SEQUENCE: __( 'Stop Sequence', 'ai-engine' ),
  USAGE: __( 'Usage', 'ai-engine' ),
}

i18n.HELP = {
  TEMPERATURE: __( 'Between 0 and 1. Higher values means the model will take more risks.', 'ai-engine' ),
  MAX_TOKENS: __( 'The maximum number of tokens to generate. The model will stop generating once it hits this limit.', 'ai-engine' ),
  STOP_SEQUENCE: __( 'The sequence of tokens that will cause the model to stop generating text. You absolutely need this with fine-tuned models.', 'ai-engine' ),
  USAGE: __( 'Keeps track of the current usage of the AI.', 'ai-engine' ),
}

i18n.SETTINGS = {
  INTRO: __( 'Boost your WordPress with AI! Don\'t forget to visit the <a href="https://meowapps.com/ai-engine/" target="_blank">AI Engine website</a> for more information. Have fun! 🎵', 'ai-engine' ),
  MODULES_INTRO: __( 'To avoid cluttering the UI and your WP, only enable the features you need.', 'ai-engine' )
}

i18n.CONTENT_GENERATOR = {
  INTRO: __( 'The Content Generator is a powerful tool that can generate content for you. It can be used to generate articles, emails, or even code. It can also be used to generate content for your chatbot. <b>Let me know if there are any new features you would like to see!</b> Have fun 🥳', 'ai-engine' ),
}

i18n.TEMPLATES = {
  TEMPLATES: __( 'Templates', 'ai-engine' ),
  DELETE_CONFIRM: __( 'Are you sure you want to delete this template?', 'ai-engine' ),
  NEW_TEMPLATE_NAME: __( 'New Template', 'ai-engine' ),
  EDIT: __( 'EDIT', 'ai-engine' ),
  JOIN_US: __( 'Interested in sharing and/or looking for more templates? Join us on the <a target="_blank" href="https://wordpress.org/support/topic/common-use-cases-for-templates">Templates Threads</a> in the forums.', 'ai-engine' ),
}

i18n.PLAYGROUND = {
  INTRO: __( 'Welcome to the AI Playground! Here, you can play with different AI models and ask the UI to perform various tasks for you. You can ask it to write, rewrite, or translate an article, categorize words or elements into groups, write an email, etc. <b>Let me know if there are any new features you would like to see!</b> Have fun 🥳', 'ai-engine' ),
  PROMPT: __( 'Query / Prompt', 'ai-engine' ),
  ANSWER: __( 'Answer', 'ai-engine' ),
}

export default i18n;
