// Previous: none
// Current: 3.8.1

// The strings the chatbot says on its own ("Try again", "Undo", every connection error). PHP
// translates them (Meow_MWAI_Modules_Chatbot::get_front_texts) and sends them in the system object
// of every chatbot and discussions list on the page, keyed by their English source like gettext.
// The English here is the last resort: a Cross-Site embed served without texts, or a string added
// in JavaScript before its PHP twin. In the admin preview wp.i18n exists and answers second.
const texts = {};

export const registerTexts = (list) => {
  if (list && typeof list === 'object') {
    Object.assign(texts, list);
  }
};

export const __ = (text) => {
  if (typeof texts[text] === 'string' && texts[text] !== '') {
    return texts[text];
  }
  if (typeof wp !== 'undefined' && wp.i18n && wp.i18n.__) {
    return wp.i18n.__(text, 'ai-engine');
  }
  return text;
};
