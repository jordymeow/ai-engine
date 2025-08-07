// Previous: none
// Current: 2.9.9

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
    <>
      <div ref={conversationRef} className="mwai-conversation" onScroll={onScroll}>
        {messageList}
        {shortcuts}
      </div>
      {blocks}
    </>
  );
};

export default StandardMessages;