// Previous: 0.3.2
// Current: 0.3.4

import createChatbotBlock from './ChatbotBlock';
import createFormFieldBlock from './FormFieldBlock';

// The Storybook for Gutenberg
// https://wordpress.github.io/gutenberg

const initBlocks = () => {
  createFormFieldBlock();
  createChatbotBlock();
}

export default initBlocks;
