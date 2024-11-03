// Previous: 2.4.7
// Current: 2.6.5

import createChatbotBlock from './ChatbotBlock';
import createDiscussionsBlock from './DiscussionsBlock';
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
  createDiscussionsBlock();
};

export { initFormsBlocks, initChatbotBlocks };
