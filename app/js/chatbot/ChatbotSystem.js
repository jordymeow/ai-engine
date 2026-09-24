// Previous: 1.9.8
// Current: 3.8.1

import { ChatbotContextProvider } from '@app/chatbot/ChatbotContext';
import ChatbotUI from '@app/chatbot/ChatbotUI';

import { registerTexts } from '@app/chatbot/texts';

const ChatbotSystem = (props) => {
  registerTexts(props.system?.texts);
  return (<ChatbotContextProvider {...props}>
    <ChatbotUI {...props} />
  </ChatbotContextProvider>
  );
}

export default ChatbotSystem;
