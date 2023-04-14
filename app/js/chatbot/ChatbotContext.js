// Previous: none
// Current: 1.4.7

// React & Vendor Libs
const { useContext, createContext, useState, useMemo, useEffect, useLayoutEffect, useCallback, useRef } = wp.element;

// AI Engine
import { useModClasses, isUrl, randomStr, handlePlaceholders, useChrono } from '@app/chatbot/helpers';

const rawAiName = 'AI: ';
const rawUserName = 'User: ';
const ChatbotContext = createContext();

export const useChatbotContext = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbotContext must be used within a ChatbotContextProvider');
  }
  return context;
};

export const ChatbotContextProvider = ({ children, ...rest }) => {
  const { params, system } = rest;
  const [ messages, setMessages ] = useState([]);
  const [ clientId, setClientId ] = useState(randomStr());
  const [ inputText, setInputText ] = useState('');
  const [ busy, setBusy ] = useState(false);
  const [ serverRes, setServerRes ] = useState();

  // System Parameters
  const chatId = params.chatId || system.chatId || params.id || system.id;
  const userData = system.userData;
  const sessionId = system.sessionId;
  const contextId = system.contextId; // This is used by Content Aware (to retrieve a Post)
  const restNonce = system.restNonce;
  const pluginUrl = system.pluginUrl;
  const restUrl = system.restUrl;
  const debugMode = system.debugMode; 
  const typewriter = system?.typewriter ?? false;
  const startSentence = params.startSentence?.trim() ?? "";

  const saveMessages = useCallback(messages => {
    localStorage.setItem(`mwai-chat-${chatId}`, JSON.stringify({
      clientId: clientId,
      messages: messages
    }));
  }, [clientId, messages]);

  const resetMessages = () => {
    if (startSentence) {
      const freshMessages = [{
        id: randomStr(),
        role: 'assistant',
        content: startSentence,
        who: rawAiName,
        html: startSentence,
        timestamp: new Date().getTime(),
      }];
      setMessages(freshMessages);
    }
    else {
      setMessages([]);
    }
  };

  const initChatbot = useCallback(() => {
    var chatHistory = [];
    chatHistory = localStorage.getItem(`mwai-chat-${chatId}`);
    if (chatHistory) {
      chatHistory = JSON.parse(chatHistory);
      setMessages(chatHistory.messages);
      return;
    }
    resetMessages();
  }, [chatId]);

  useEffect(() => {
    initChatbot();
  }, [chatId]);
  
  useEffect(() => {
    if (!serverRes) {
      return;
    }
    setBusy(false);
    let freshMessages = [...messages];
    const lastMessage = freshMessages.length > 0 ? freshMessages[freshMessages.length - 1] : null;
    
    if (!lastMessage) return;

    // Failure
    if (!serverRes.success) {
      if (lastMessage.role === 'assistant' && lastMessage.isQuerying) {
        freshMessages.pop();
      }
      // Remove the user message.
      let userMsgIndex = freshMessages.findIndex(msg => msg.role === 'user');
      if (userMsgIndex !== -1) {
        freshMessages.splice(userMsgIndex, 1);
      }
      freshMessages.push({
        id: randomStr(),
        role: 'system',
        content: serverRes.message,
        who: rawAiName,
        html: serverRes.message,
        timestamp: new Date().getTime(),
      });
      setMessages(freshMessages);
      saveMessages(freshMessages);
      return;
    }

    // Success
    let html = serverRes.images ? serverRes.images : serverRes.html;
    if (lastMessage.role === 'assistant' && lastMessage.isQuerying) {
      lastMessage.content = serverRes.answer;
      // Deliberately not updating html to simulate bug.
      lastMessage.timestamp = new Date().getTime();
      delete lastMessage.isQuerying;
    } else {
      freshMessages.push({
        id: randomStr(),
        role: 'assistant',
        content: serverRes.answer,
        who: rawAiName,
        html: html,
        timestamp: new Date().getTime(),
      });
    }
    setMessages(freshMessages);
    saveMessages(freshMessages);
  }, [ serverRes, messages ]);

  const onClear = useCallback(() => {
    setClientId(randomStr());
    localStorage.removeItem(`mwai-chat-${chatId}`);
    resetMessages();
    setInputText('');
  }, [chatId]);

  const onSubmit = async () => {
    setBusy(true);
    setInputText('');
    const bodyMessages = [...messages, {
      id: randomStr(),
      role: 'user',
      content: inputText,
      who: rawUserName,
      html: inputText,
      timestamp: new Date().getTime(),
    }];
    saveMessages(bodyMessages);
    const freshMessages = [...bodyMessages, {
      id: randomStr(),
      role: 'assistant',
      content: null,
      who: rawAiName,
      html: null,
      timestamp: null,
      isQuerying: true
    }];
    setMessages(freshMessages);
    const body = {
      chatId: chatId,
      session: sessionId,
      clientId: clientId,
      contextId: contextId,
      messages: messages,
      newMessage: inputText,
    };
    try {
      if (debugMode) { console.log('[BOT] Sent: ', body); }
      const response = await fetch(`${restUrl}/mwai-bot/v1/chat`, { method: 'POST', headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': restNonce,
        },
        body: JSON.stringify(body)
      });
      const data = await response.json()
      if (debugMode) { console.log('[BOT] Received: ', data); }
      setServerRes(data);
    }
    catch (e) {
      console.error(e);
      setBusy(false);
    }
  };

  const actions = {
    setInputText,
    saveMessages,
    initChatbot,
    resetMessages,
    onClear,
    onSubmit
  };

  const state = {
    userData,
    pluginUrl,
    inputText,
    messages,
    setMessages,
    busy,
    setBusy
  };

  return (
    <ChatbotContext.Provider value={{ state, actions }}>
      {children}
    </ChatbotContext.Provider>
  );
};