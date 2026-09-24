// Previous: none
// Current: 3.8.1

import { useChatbotContext } from './ChatbotContext';

import { __ } from '@app/chatbot/texts';

// Shown for a few seconds after Clear, just above the composer, which is where the hand
// already is. role="status" so it is announced without taking focus.
const UndoClear = () => {
  const { state, actions } = useChatbotContext();
  if (!state.canUndoClear) {
    return null;
  }
  return (
    <div className="mwai-undo-clear" role="status">
      <span>{__('Conversation cleared.')}</span>
      <button type="button" onClick={actions.undoClear}>{__('Undo')}</button>
    </div>
  );
};

export default UndoClear;
