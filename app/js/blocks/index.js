// Previous: 2.6.9
// Current: 2.8.2

import createChatbotBlock from './ChatbotBlock';
import createDiscussionsBlock from './DiscussionsBlock';
import createContainerBlock from './FormContainerBlock';
import createFormFieldBlock from './FormFieldBlock';
import createUploadFieldBlock from './FormUploadBlock';
import createOutputBlock from './FormOutputBlock';
import createSubmitBlock from './FormSubmitBlock';
import createResetBlock from './FormResetBlock';
import createConditionalBlock from './FormConditionalBlock';

// The Storybook for Gutenberg
// https://wordpress.github.io/gutenberg

const initFormsBlocks = () => {
  createFormFieldBlock();
  createUploadFieldBlock();
  createOutputBlock();
  createSubmitBlock();
  createResetBlock();
  createContainerBlock();
  createConditionalBlock();
};

const initChatbotBlocks = () => {
  createChatbotBlock();
  createDiscussionsBlock();
};

export { initFormsBlocks, initChatbotBlocks };
