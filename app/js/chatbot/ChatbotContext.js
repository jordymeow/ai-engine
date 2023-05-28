// Previous: 1.6.91
// Current: 1.6.94

// React & Vendor Libs
const { useContext, createContext, useState, useMemo, useEffect, useCallback } = wp.element;

// AI Engine
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
      clientId: clientId,
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
        setClientId(chatHistory.clientId);
        return;
      }
    }
    resetMessages();
  }, [botId]);

  useEffect(() => {
    initChatbot();
  }, [botId]);
  
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
      freshMessages.pop();
      freshMessages.push({
        id: randomStr(),
        role: 'system',
        content: serverRes.message,
        who: rawAiName,
        timestamp: new Date().getTime(),
      });
      setMessages(freshMessages);
      saveMessages(freshMessages);
      return;
    }

    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isQuerying) {
      lastMessage.content = serverRes.reply;
      if (serverRes.images) {
        lastMessage.images = serverRes.images;
      }
      lastMessage.timestamp = new Date().getTime();
      delete lastMessage.isQuerying;
    }
    else if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isStreaming) {
      lastMessage.content = serverRes.reply;
      if (serverRes.images) {
        lastMessage.images = serverRes.images;
      }
      lastMessage.timestamp = new Date().getTime();
      delete lastMessage.isStreaming;
    }
    else {
      const newMessage = {
        id: randomStr(),
        role: 'assistant',
        content: serverRes.reply,
        who: rawAiName,
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
  }, [botId]);

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
    setMessages(freshMessages);
    const body = {
      id: id,
      botId: botId,
      session: sessionId,
      clientId: clientId,
      contextId: contextId,
      messages: messages,
      newMessage: inputText,
      stream,
      ...atts
    };
    try {
      if (debugMode) { console.log('[CHATBOT] OUT: ', body); }
      const headers = {
        'Content-Type': 'application/json'
      };
      if (restNonce) {
        headers['X-WP-Nonce'] = restNonce;
      }
      if (stream) {
        headers['Accept'] = 'text/event-stream';
      }

      if (stream) {
        const response = await fetch(`${restUrl}/mwai-ui/v1/chats/submit`, { method: 'POST', headers,
          body: JSON.stringify(body, getCircularReplacer())
        });
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let decodedContent = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          for (let i = 0; i < lines.length - 1; i++) {
            if (lines[i].indexOf('data: ') !== 0) {
              continue;
            }
            const data = JSON.parse(lines[i].replace('data: ', ''));
            if (debugMode) { console.log('[CHATBOT STREAM] IN: ', data); }
        
            if (data['type'] === 'live') {
              decodedContent += data.data; 
              setMessages(messages => {
                const freshMessages = [...messages];
                const lastMessage = freshMessages.length > 0 ? freshMessages[freshMessages.length - 1] : null;
                if (lastMessage && lastMessage.id === freshMessageId) {
                  lastMessage.content = decodedContent;
                  lastMessage.timestamp = new Date().getTime();
                }
                return freshMessages;
              });
            }
            if (data['type'] === 'end') {
              const finalData = JSON.parse(data.data);
              setServerRes(finalData);
            }
          }
          buffer = lines[lines.length - 1];
        }
      } else {
        const response = await fetch(`${restUrl}/mwai-ui/v1/chats/submit`, { method: 'POST', headers,
          body: JSON.stringify(body, getCircularReplacer())
        });
        const data = await response.json()
        if (debugMode) { console.log('[CHATBOT] IN: ', data); }
        setServerRes(data);
      }      
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