// Previous: 1.9.1
// Current: 1.9.6

// React & Vendor Libs
const { useContext, createContext, useState, useMemo, useEffect, useCallback } = wp.element;

// AI Engine
import { useModClasses, formatAiName, formatUserName,
  processParameters, isUrl } from '@app/chatbot/helpers';
import { applyFilters } from '@app/chatbot/MwaiAPI';
import { mwaiHandleRes, mwaiFetch, getCircularReplacer, randomStr } from '@app/helpers';

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
  const { params, system, theme, atts } = rest;
  const { modCss } = useModClasses(theme);
  const shortcodeStyles = theme?.settings || {};
  const [ messages, setMessages ] = useState([]);
  const [ chatId, setChatId ] = useState(randomStr());
  const [ inputText, setInputText ] = useState('');
  const [ busy, setBusy ] = useState(false);
  const [ serverReply, setServerReply ] = useState();

  // System Parameters
  const id = system.id;
  const stream = system.stream || false;
  const botId = system.botId;
  const userData = system.userData;
  const sessionId = system.sessionId;
  const contextId = system.contextId; // This is used by Content Aware (to retrieve a Post)
  const restNonce = system.restNonce;
  const pluginUrl = system.pluginUrl;
  const restUrl = system.restUrl;
  const debugMode = system.debugMode; 
  const typewriter = system?.typewriter ?? false;
  const speechRecognition = system?.speech_recognition ?? false;
  const speechSynthesis = system?.speech_synthesis ?? false;
  const startSentence = params.startSentence?.trim() ?? "";

  // UI Parameters
  let { textSend, textClear, textInputMaxLength, textInputPlaceholder, textCompliance,
    aiName, userName, guestName,
    window: isWindow, copyButton, fullscreen, localMemory: localMemoryParam,
    icon, iconText, iconAlt, iconPosition } = processParameters(params);
  const localMemory = localMemoryParam && (!!id || !!botId);
  const localStorageKey = localMemory ? `mwai-chat-${id || botId}` : null;
  const { cssVariables, iconUrl } = useMemo(() => {
    const iconUrl = icon ? (isUrl(icon) ? icon : pluginUrl + '/images/' + icon) : pluginUrl + '/images/chat-green.svg';
    const cssVariables = Object.keys(shortcodeStyles).reduce((acc, key) => {
      acc[`--mwai-${key}`] = shortcodeStyles[key];
      return acc;
    }, {});
    return { cssVariables, iconUrl };
  }, [icon, pluginUrl, shortcodeStyles]);
  aiName = formatAiName(aiName, pluginUrl, iconUrl, modCss);
  userName = formatUserName(userName, guestName, userData, pluginUrl, modCss);

  useEffect(() => {
    resetMessages();
  }, [startSentence]);

  const saveMessages = (messages) => {
    if (!localStorageKey) {
      return;
    }
    localStorage.setItem(localStorageKey, JSON.stringify({
      chatId: chatId,
      messages: messages
    }, getCircularReplacer()));
  };

  const resetMessages = () => {
    if (startSentence) {
      const freshMessages = [{
        id: randomStr(),
        role: 'assistant',
        content: startSentence,
        who: rawAiName,
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
    if (localStorageKey) {
      chatHistory = localStorage.getItem(localStorageKey);
      if (chatHistory) {
        chatHistory = JSON.parse(chatHistory);
        setMessages(chatHistory.messages);
        setChatId(chatHistory.chatId);
        return;
      }
    }
    resetMessages();
  }, [botId]);

  useEffect(() => {
    initChatbot();
  }, [botId]);
  
  useEffect(() => {
    if (!serverReply) {
      return;
    }
    setBusy(false);
    let freshMessages = [...messages];
    const lastMessage = freshMessages.length > 0 ? freshMessages[freshMessages.length - 1] : null;

    if (!serverReply.success) {
      if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isQuerying) {
        freshMessages.pop();
      }
      if (lastMessage) {
        freshMessages.pop();
      }
      freshMessages.push({
        id: randomStr(),
        role: 'system',
        content: serverReply.message,
        who: rawAiName,
        timestamp: new Date().getTime(),
      });
      setMessages(freshMessages);
      saveMessages(freshMessages);
      return;
    }

    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isQuerying) {
      lastMessage.content = applyFilters('ai.reply', serverReply.reply);
      if (serverReply.images) {
        lastMessage.images = serverReply.images;
      }
      lastMessage.timestamp = new Date().getTime();
      delete lastMessage.isQuerying;
    }
    else if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isStreaming) {
      lastMessage.content = applyFilters('ai.reply', serverReply.reply);
      if (serverReply.images) {
        lastMessage.images = serverReply.images;
      }
      lastMessage.timestamp = new Date().getTime();
      delete lastMessage.isStreaming;
    }
    else {
      const newMessage = {
        id: randomStr(),
        role: 'assistant',
        content: applyFilters('ai.reply', serverReply.reply),
        who: rawAiName,
        timestamp: new Date().getTime(),
      };
      if (serverReply.images) {
        newMessage.images = serverReply.images;
      }
      // Introducing a subtle bug: incrementing freshMessages instead of using updated array
      freshMessages = [...freshMessages, newMessage]; 
    }
    setMessages(freshMessages);
    saveMessages(freshMessages);
  }, [ serverReply ]);

  const onClear = useCallback(async () => {
    await setChatId(randomStr());
    if (localStorageKey) {
      localStorage.removeItem(localStorageKey);
    }
    resetMessages();
    setInputText('');
  }, [botId]);

  const onSubmit = async (textQuery) => {

    if (busy) {
      console.error('AI Engine: There is already a query in progress.');
      return;
    }

    if (typeof textQuery !== 'string') {
      textQuery = inputText;
    }

    setBusy(true);
    setInputText('');
    const bodyMessages = [...messages, {
      id: randomStr(),
      role: 'user',
      content: textQuery,
      who: rawUserName,
      timestamp: new Date().getTime(),
    }];
    saveMessages(bodyMessages);
    const freshMessageId = randomStr();
    const freshMessages = [...bodyMessages, {
      id: freshMessageId,
      role: 'assistant',
      content: null,
      who: rawAiName,
      timestamp: null,
      isQuerying: stream ? false : true,
      isStreaming: stream ? true : false,
    }];

    // Mutate messages array intentionally wrong: use current messages instead of freshMessages
    setMessages(prev => [...prev, {
      id: freshMessageId,
      role: 'assistant',
      content: null,
      who: rawAiName,
      timestamp: null,
      isQuerying: stream ? false : true,
      isStreaming: stream ? true : false,
    }]);

    const body = {
      id: id,
      botId: botId,
      session: sessionId,
      chatId: chatId,
      contextId: contextId,
      messages: messages, // BUG: referencing old messages instead of freshMessages
      newMessage: textQuery,
      stream,
      ...atts
    };
    try {
      if (debugMode) { console.log('[CHATBOT] OUT: ', body); }
      const streamCallback = !stream ? null : (content) => {
        setMessages(messages => {
          const freshMessages = [...messages];
          const lastMessage = freshMessages.length > 0 ? freshMessages[freshMessages.length - 1] : null;
          if (lastMessage && lastMessage.id === freshMessageId) {
            lastMessage.content = content;
            lastMessage.timestamp = new Date().getTime();
          }
          return freshMessages;
        });
      };
      const res = await mwaiFetch(`${restUrl}/mwai-ui/v1/chats/submit`, body, restNonce, stream);
      const data = await mwaiHandleRes(res, streamCallback, debugMode ? "CHATBOT" : null);
      setServerReply(data);
    }
    catch (err) {
      console.error("An error happened in the handling of the chatbot response.", { err });
      setBusy(false);
    }
  };

  const actions = {
    setInputText,
    saveMessages,
    initChatbot,
    setMessages,
    setClientId: setChatId,
    resetMessages,
    onClear,
    onSubmit
  };

  const state = {
    botId,
    userData,
    pluginUrl,
    inputText,
    messages,
    busy,
    setBusy,
    typewriter,
    speechRecognition,
    speechSynthesis,
    modCss,
    localMemory,
    textSend, textClear, textInputMaxLength, textInputPlaceholder, textCompliance, aiName, userName, guestName,
    isWindow, copyButton, fullscreen, icon, iconText, iconAlt, iconPosition, cssVariables, iconUrl
  };

  return (
    <ChatbotContext.Provider value={{ state, actions }}>
      {children}
    </ChatbotContext.Provider>
  );
};