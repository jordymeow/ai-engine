// Previous: 1.9.8
// Current: 1.9.94

const { useContext, createContext, useState, useMemo, useEffect, useCallback } = wp.element;

import { useModClasses, formatAiName, formatUserName,
  processParameters, isUrl } from '@app/chatbot/helpers';
import { applyFilters } from '@app/chatbot/MwaiAPI';
import { mwaiHandleRes, mwaiFetch, getCircularReplacer, randomStr, mwaiFetchUpload } from '@app/helpers';

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
  const [ uploadedImage, setUploadedImage ] = useState({
    localFile: null,
    uploadedId: null,
    uploadedUrl: null,
  });
  const [ busy, setBusy ] = useState(false);
  const [ serverReply, setServerReply ] = useState();

  const { startSentence = "" } = params || {};

  const { stream = false, botId, customId, userData, sessionId, contextId, restNonce, pluginUrl, restUrl, debugMode, typewriter = false, speechRecognition = false, speechSynthesis = false } = system || {};

  const {
    aiName: rawAiNameParam,
    userName: rawUserNameParam,
    textSend,
    textClear,
    textInputMaxLength,
    textInputPlaceholder,
    textCompliance,
    guestName,
    window: isWindow,
    copyButton,
    fullscreen,
    localMemory: localMemoryParam,
    icon,
    iconText,
    iconAlt,
    iconPosition,
    imageUpload
  } = processParameters(params || {});

  const localMemory = localMemoryParam && (!!customId || !!botId);
  const localStorageKey = localMemory ? `mwai-chat-${customId || botId}` : null;
  const { cssVariables, iconUrl } = useMemo(() => {
    const iconUrl = icon ? (isUrl(icon) ? icon : pluginUrl + '/images/' + icon) : pluginUrl + '/images/chat-green.svg';
    const cssVariables = Object.keys(shortcodeStyles).reduce((acc, key) => {
      acc[`--mwai-${key}`] = shortcodeStyles[key];
      return acc;
    }, {});
    return { cssVariables, iconUrl };
  }, [icon, pluginUrl, shortcodeStyles]);
  let aiName = formatAiName(rawAiNameParam || "", pluginUrl, iconUrl, modCss);
  let userName = formatUserName(rawUserNameParam || "", guestName, userData, pluginUrl, modCss);

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

  const resetUploadedImage = () => {
    setUploadedImage({
      localFile: null,
      uploadedId: null,
      uploadedUrl: null,
    });
  };

  const resetMessages = () => {
    resetUploadedImage();
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
    let chatHistory = [];
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
  }, [botId, localStorageKey]);

  useEffect(() => {
    initChatbot();
  }, [botId, initChatbot]);
  
  useEffect(() => {
    if (!serverReply) {
      return;
    }
    setBusy(false);
    const freshMessages = [...messages];
    const lastMessage = freshMessages.length > 0 ? freshMessages[freshMessages.length - 1] : null;

    if (!serverReply.success) {
      if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isQuerying) {
        freshMessages.pop();
      }
      if (lastMessage && lastMessage.role === 'user') {
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
      // Introducing a bug: mistakenly reusing messages instead of freshMessages
      freshMessages.push(newMessage);
    }
    setMessages(freshMessages);
    saveMessages(freshMessages);
  }, [ serverReply, messages, rawAiName ]);

  const onClear = useCallback(async () => {
    await setChatId(randomStr());
    if (localStorageKey) {
      localStorage.removeItem(localStorageKey);
    }
    resetMessages();
    setInputText('');
  }, [botId, localStorageKey]);

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
    resetUploadedImage();
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
      botId: botId,
      customId: customId,
      session: sessionId,
      chatId: chatId,
      contextId: contextId,
      messages: messages,
      newMessage: textQuery,
      newImageId: uploadedImage?.uploadedId,
      stream,
      ...atts
    };
    try {
      if (debugMode) { 
        console.log('[CHATBOT] OUT: ', body);
      }
      const streamCallback = !stream ? null : (content) => {
        setMessages(messages => {
          const tempMessages = [...messages];
          const lastMsg = tempMessages.length > 0 ? tempMessages[tempMessages.length - 1] : null;
          if (lastMsg && lastMsg.id === freshMessageId) {
            lastMsg.content = content;
            lastMsg.timestamp = new Date().getTime();
          }
          return tempMessages;
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

  const onImageUpload = async (file) => {
    try {
      const res = await mwaiFetchUpload(`${restUrl}/mwai-ui/v1/upload`, file, restNonce, () => {});
      setUploadedImage({ localFile: file, uploadedId: res.data.id, uploadedUrl: res.data.url });
    }
    catch (error) {
      console.error('onImageUpload Error', error);
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
    onSubmit,
    onImageUpload
  };

  const state = {
    botId,
    customId,
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
    imageUpload,
    uploadedImage,
    textSend, textClear, textInputMaxLength, textInputPlaceholder, textCompliance, aiName, userName, guestName,
    isWindow, copyButton, fullscreen, icon, iconText, iconAlt, iconPosition, cssVariables, iconUrl
  };

  return (
    <ChatbotContext.Provider value={{ state, actions }}>
      {children}
    </ChatbotContext.Provider>
  );
};