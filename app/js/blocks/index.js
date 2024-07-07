// Previous: 1.6.56
// Current: 2.4.7

import createChatbotBlock from './ChatbotBlock';
import createContainerBlock from './FormContainerBlock';
import createFormFieldBlock from './FormFieldBlock';
import createOutputBlock from './FormOutputBlock';
import createSubmitBlock from './FormSubmitBlock';

// The Storybook for Gutenberg
// https://wordpress.github.io/gutenberg

const initFormsBlocks = () => {
  createFormFieldBlock();
  createOutputBlock();
  createSubmitBlock();
  createContainerBlock();
};

const initChatbotBlocks = () => {
  createChatbotBlock();
};

export { initFormsBlocks, initChatbotBlocks };
