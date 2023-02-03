// Previous: 0.3.4
// Current: 0.6.9

import createChatbotBlock from './ChatbotBlock';
import createFormFieldBlock from './FormFieldBlock';
import createOutputBlock from './FormOutputBlock';
import createSubmitBlock from './FormSubmitBlock';

// The Storybook for Gutenberg
// https://wordpress.github.io/gutenberg

const initBlocks = () => {
  createFormFieldBlock();
  createOutputBlock();
  createChatbotBlock();
  createSubmitBlock();
}

export default initBlocks;
