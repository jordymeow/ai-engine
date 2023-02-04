// Previous: 0.6.9
// Current: 0.7.5

import createChatbotBlock from './ChatbotBlock';
import createContainerBlock from './FormContainerBlock';
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
  createContainerBlock();
}

export default initBlocks;
