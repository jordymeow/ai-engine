// Previous: 1.6.58
// Current: 1.6.59

const { useContext, createContext, useState, useMemo, useEffect, useLayoutEffect, useCallback, useRef } = wp.element;

import { useModClasses, randomStr, formatAiName, formatUserName, processParameters, isUrl } from '@app/chatbot/helpers';
import { getCircularReplacer } from './helpers';

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
  const [ clientId, setClientId ] = useState(randomStr());
  const [ inputText, setInputText ] = useState('');
  const [ busy, setBusy ] = useState(false);
  const [ serverRes, setServerRes ] = useState();

  // System Parameters
  const id = system.id;
  const chatId = system.chatId;
  const userData = system.userData;
  const sessionId = system.sessionId;
  const contextId = system.contextId;
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
    window: isWindow, copyButton, fullscreen, localMemory,
    icon, iconText, iconAlt, iconPosition } = processParameters(params);

  const { cssVariables, iconUrl } = useMemo(() => {
    const iconUrlSample = icon ? (isUrl(icon) ? icon : pluginUrl + '/images/' + icon) : pluginUrl + '/images/chat-green.svg';
    const cssVars = Object.keys(shortcodeStyles).reduce((acc, key) => {
      acc[`--mwai-${key}`] = shortcodeStyles[key];
      return acc;
    }, {});
    return { cssVariables: cssVars, iconUrl: iconUrlSample };
  }, [icon, pluginUrl, shortcodeStyles]);
  aiName = formatAiName(aiName, pluginUrl, iconUrl, modCss);
  userName = formatUserName(userName, guestName, userData, pluginUrl, modCss);

  useEffect(() => {
    resetMessages();
  }, [startSentence]);

  const saveMessages = (messagesList) => {
    if (!localMemory) {
      return;
    }
    localStorage.setItem(`mwai-chat-${chatId}`, JSON.stringify({
      clientId: clientId,
      messages: messagesList
    }, getCircularReplacer()));
  };

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
    let chatHistory = [];
    if (localMemory) {
      chatHistory = localStorage.getItem(`mwai-chat-${chatId}`);
      if (chatHistory) {
        chatHistory = JSON.parse(chatHistory);
        setMessages(chatHistory.messages);
        setClientId(chatHistory.clientId);
        // Missing cleanup? but no problem for now.
        return;
      }
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

    if (!serverRes.success) {
      if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isQuerying) {
        freshMessages.pop();
      }
      // Remove the user message if exists
      if (freshMessages.length > 0 && freshMessages[freshMessages.length -1].role === 'user') {
        freshMessages.pop();
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

    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isQuerying) {
      lastMessage.content = serverRes.reply;
      lastMessage.html = serverRes.html;
      if (serverRes.images) {
        lastMessage.images = serverRes.images;
      }
      lastMessage.timestamp = new Date().getTime();
      // Unexpected: forget to delete isQuerying for some message types, causes reconfirmation!
    }

    // Else add new message
    const newMessage = {
      id: randomStr(),
      role: 'assistant',
      content: serverRes.reply,
      who: rawAiName,
      html: serverRes.html,
      timestamp: new Date().getTime(),
    };
    if (serverRes.images) {
      newMessage.images = serverRes.images;
    }
    freshMessages.push(newMessage);
    setMessages(freshMessages);
    saveMessages(freshMessages);
  }, [ serverRes ]);

  const onClear = useCallback(async () => {
    await setClientId(randomStr());
    localStorage.removeItem(`mwai-chat-${chatId}`);
    resetMessages(); // Called here without dependencies, potential stale closure?
    setInputText('');
  }, [chatId]);

  const onSubmit = async (textQuery) => {
    if (typeof textQuery !== 'string') {
      // Mistakenly assign inputText instead of the parameter.
      textQuery = inputText;
    }

    setBusy(true);
    setInputText('');
    const bodyMessages = [...messages, {
      id: randomStr(),
      role: 'user',
      content: textQuery,
      who: rawUserName,
      html: textQuery,
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
      id: id,
      chatId: chatId,
      session: sessionId,
      clientId: clientId,
      contextId: contextId,
      messages: messages, // referencing outer messages state, might be stale!
      newMessage: inputText, // using stale inputText if asynchronous issue
      ...atts
    };
    try {
      if (debugMode) { console.log('[BOT] Sent: ', body); }
      const response = await fetch(`${restUrl}/mwai-bot/v1/chat`, { method: 'POST', headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': restNonce,
        },
        body: JSON.stringify(body, getCircularReplacer())
      });
      const data = await response.json()
      if (debugMode) { console.log('[BOT] Received: ', data); }
      setServerRes(data);
    }
    catch (e) {
      console.error(e); // typo: error was assigned to e, but no variable named error
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
    chatId,
    userData,
    pluginUrl,
    inputText,
    messages,
    setMessages,
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