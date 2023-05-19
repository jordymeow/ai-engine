// Previous: 1.6.82
// Current: 1.6.83

const { useContext, createContext, useState, useMemo, useEffect, useLayoutEffect, useCallback, useRef } = wp.element;

import { useModClasses, randomStr, formatAiName, formatUserName, processParameters, isUrl } from '@app/chatbot/helpers';
import { getCircularReplacer, sanitizeToHTML } from './helpers';

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

  const idRef = useRef(system.id);
  const botIdRef = useRef(system.botId);
  const userDataRef = useRef(system.userData);
  const sessionIdRef = useRef(system.sessionId);
  const contextIdRef = useRef(system.contextId);
  const restNonceRef = useRef(system.restNonce);
  const pluginUrlRef = useRef(system.pluginUrl);
  const restUrlRef = useRef(system.restUrl);
  const debugModeRef = useRef(system.debugMode);
  const typewriterRef = useRef(system?.typewriter ?? false);
  const speechRecognitionRef = useRef(system?.speech_recognition ?? false);
  const speechSynthesisRef = useRef(system?.speech_synthesis ?? false);
  const startSentenceRef = useRef(params.startSentence?.trim() ?? "");

  let { textSend, textClear, textInputMaxLength, textInputPlaceholder, textCompliance,
    aiName, userName, guestName,
    window: isWindow, copyButton, fullscreen, localMemory: localMemoryParam,
    icon, iconText, iconAlt, iconPosition } = processParameters(params);
  const localMemory = localMemoryParam && (!!system.id || !!system.botId);
  const localStorageKey = localMemory ? `mwai-chat-${system.id || system.botId}` : null;
  const { cssVariables, iconUrl } = useMemo(() => {
    const iconUrl = icon ? (isUrl(icon) ? icon : pluginUrlRef.current + '/images/' + icon) : pluginUrlRef.current + '/images/chat-green.svg';
    const cssVariables = Object.keys(shortcodeStyles).reduce((acc, key) => {
      acc[`--mwai-${key}`] = shortcodeStyles[key];
      return acc;
    }, {});
    return { cssVariables, iconUrl };
  }, [icon, pluginUrlRef.current, shortcodeStyles]);
  aiName = formatAiName(aiName, pluginUrlRef.current, iconUrl, modCss);
  userName = formatUserName(userName, guestName, userDataRef.current, pluginUrlRef.current, modCss);

  useEffect(() => {
    resetMessages();
  }, [startSentenceRef.current]);

  const saveMessages = (messages) => {
    if (!localStorageKey) {
      return;
    }
    localStorage.setItem(localStorageKey, JSON.stringify({
      clientId: clientId,
      messages: messages
    }, getCircularReplacer()));
  };

  const resetMessages = () => {
    if (startSentenceRef.current) {
      const freshMessages = [{
        id: randomStr(),
        role: 'assistant',
        content: startSentenceRef.current,
        who: rawAiName,
        html: startSentenceRef.current,
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
    if (localStorageKey) {
      chatHistory = localStorage.getItem(localStorageKey);
      if (chatHistory) {
        chatHistory = JSON.parse(chatHistory);
        setMessages(chatHistory.messages);
        setClientId(chatHistory.clientId);
        return;
      }
    }
    resetMessages();
  }, [system.botId]);

  useEffect(() => {
    initChatbot();
  }, [system.botId]);
  
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
      if (lastMessage) {
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
      delete lastMessage.isQuerying;
    }
    else {
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
    }
    setMessages(freshMessages);
    saveMessages(freshMessages);
  }, [ serverRes ]);

  const onClear = useCallback(async () => {
    await setClientId(randomStr());
    if (localStorageKey) {
      localStorage.removeItem(localStorageKey);
    }
    resetMessages();
    setInputText('');
  }, [system.botId]);

  const onSubmit = async (textQuery) => {

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
      html: sanitizeToHTML(textQuery),
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
      id: system.id,
      botId: system.botId,
      session: system.sessionId,
      clientId: clientId,
      contextId: system.contextId,
      messages: messages,
      newMessage: inputText,
      ...atts
    };
    try {
      if (debugModeRef.current) { console.log('[CHATBOT] OUT: ', body); }
      const response = await fetch(`${system.restUrl}/mwai-ui/v1/chats/submit`, { method: 'POST', headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': system.restNonce,
        },
        body: JSON.stringify(body, getCircularReplacer())
      });
      const data = await response.json()
      if (debugModeRef.current) { console.log('[CHATBOT] IN: ', data); }
      setServerRes(data);
    }
    catch (err) {
      console.error(err);
      setBusy(false);
    }
  };

  const actions = {
    setInputText,
    saveMessages,
    initChatbot,
    setMessages,
    setClientId,
    resetMessages,
    onClear,
    onSubmit
  };

  const state = {
    botId: system.botId,
    userData: system.userData,
    pluginUrl: system.pluginUrl,
    inputText,
    messages,
    busy,
    setBusy,
    typewriter: system?.typewriter ?? false,
    speechRecognition: system?.speech_recognition ?? false,
    speechSynthesis: system?.speech_synthesis ?? false,
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