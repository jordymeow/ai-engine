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
}

i18n.SETTINGS = {
  INTRO: __( 'Boost your WordPress with AI! Don\'t forget to visit the <a href="https://meowapps.com/ai-engine/" target="_blank">AI Engine website</a> for more information. Have fun! 🎵', 'ai-engine' ),
  MODULES_INTRO: __( 'To avoid cluttering the UI and your WP, only enable the features you need.', 'ai-engine' )
}

export default i18n;
