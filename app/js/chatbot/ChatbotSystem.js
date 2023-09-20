// Previous: 1.4.7
// Current: 1.9.8

import { ChatbotContextProvider } from '@app/chatbot/ChatbotContext';
import ChatbotUI from '@app/chatbot/ChatbotUI';

const ChatbotSystem = (props) => {
  return (<ChatbotContextProvider {...props}>
    <ChatbotUI {...props} />
  </ChatbotContextProvider>
  );
}

export default ChatbotSystem;
