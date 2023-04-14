// Previous: none
// Current: 1.4.7

import { ChatbotContextProvider } from '@app/chatbot/ChatbotContext';
import ChatbotUI from '@app/chatbot/ChatbotUI';

const ChatbotSystem = (props) => {
  return (<ChatbotContextProvider {...props}>
      <ChatbotUI {...props} />
    </ChatbotContextProvider>
  );
}

export default ChatbotSystem;
