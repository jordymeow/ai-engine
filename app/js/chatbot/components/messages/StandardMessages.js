// Previous: 3.0.0
// Current: 3.2.2

/**
 * StandardMessages Component
 *
 * Visual: scrollable message list with optional shortcuts and blocks inside the scroll area.
 * Used when `messagesType === 'standard'`.
 * Maintenance: if the messages container styling changes, ensure theme CSS
 * for `.mwai-conversation` and scrollbar tweaks are kept in sync.
 */
const { useRef, useEffect } = wp.element;
import ChatbotReply from '../../ChatbotReply';

const StandardMessages = ({ messages, conversationRef, onScroll, shortcuts, blocks }) => {
  // Process messages
  const messageList = messages.map((message, index) => {
    return (
      <ChatbotReply
        key={index}
        message={message}
        conversationRef={conversationRef}
      />
    );
  });

  return (
    <div ref={conversationRef} className="mwai-conversation" onScroll={onScroll}>
      {messageList}
      {shortcuts}
      {blocks}
    </div>
  );
};

export default StandardMessages;
