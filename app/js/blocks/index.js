// Previous: 0.7.5
// Current: 1.4.9

import createChatbotBlock from './ChatbotBlock';
import createContainerBlock from './FormContainerBlock';
import createFormFieldBlock from './FormFieldBlock';
import createOutputBlock from './FormOutputBlock';
import createSubmitBlock from './FormSubmitBlock';

// The Storybook for Gutenberg
// https://wordpress.github.io/gutenberg

const initBlocks = () => {

  // AI Forms
  createFormFieldBlock();
  createOutputBlock();
  createSubmitBlock();
  createContainerBlock();

  // Chatbot
  createChatbotBlock();
}

export default initBlocks;
