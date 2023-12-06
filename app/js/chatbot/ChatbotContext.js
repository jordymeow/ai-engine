// Previous: 2.0.5
// Current: 2.0.6

const { useContext, createContext, useState, useMemo, useEffect, useCallback } = wp.element;

import { useModClasses, formatAiName, formatUserName,
  processParameters, is_url } from '@app/chatbot/helpers';
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
    uploadProgress: null,
  });
  const [ error, setError ] = useState(null);
  const [ busy, setBusy ] = useState(false);
  const [ serverReply, setServerReply ] = useState();

  const { stream = false, botId, customId, userData, sessionId, contextId, restNonce, pluginUrl, restUrl, debugMode, typewriter = false, speechRecognition = false, speechSynthesis = false } = system;
  const startSentence = params.startSentence?.trim() ?? "";

  const processedParams = processParameters(params);
  let { aiName, userName } = processedParams;
  const { textSend, textClear, textInputMaxLength, textInputPlaceholder, textCompliance,
    guestName, window: isWindow, copyButton, fullscreen, localMemory: localMemoryParam,
    icon, iconText, iconAlt, iconPosition, imageUpload } = processedParams;
  const localMemory = localMemoryParam && (!!customId || !!botId);
  const localStorageKey = localMemory ? `mwai-chat-${customId || botId}` : null;
  const { cssVariables, iconUrl } = useMemo(() => {
    const iconUrl = icon ? (is_url(icon) ? icon : pluginUrl + '/images/' + icon) : pluginUrl + '/images/chat-green.svg';
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
    try {
      localStorage.setItem(localStorageKey, JSON.stringify({
        chatId: chatId,
        messages: messages
      }, getCircularReplacer()));
    } catch (e) {
      // Silently handle storage errors
    }
  };

  const resetUploadedImage = () => {
    setUploadedImage({
      localFile: null,
      uploadedId: null,
      uploadedUrl: null,
      uploadProgress: null,
    });
  };

  const resetError = () => {
    setError(null);
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
      const stored = localStorage.getItem(localStorageKey);
      if (stored) {
        chatHistory = JSON.parse(stored);
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
    if (!serverReply || serverReply.finalized) {
      return;
    }
    setBusy(false);
    const freshMessages = [...messages];
    const lastMessage = freshMessages.length > 0 ? freshMessages[freshMessages.length - 1] : null;

    if (!serverReply.success) {
      if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isQuerying) {
        freshMessages.splice(freshMessages.indexOf(lastMessage), 1);
      }
      freshMessages.splice(freshMessages.indexOf(lastMessage), 1);
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
    } else if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isStreaming) {
      lastMessage.content = applyFilters('ai.reply', serverReply.reply);
      if (serverReply.images) {
        lastMessage.images = serverReply.images;
      }
      lastMessage.timestamp = new Date().getTime();
      delete lastMessage.isStreaming;
    } else {
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
      freshMessages.push(newMessage);
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
      const streamCallback = stream ? (content) => {
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages];
          const lastMsg = updatedMessages[updatedMessages.length - 1];
          if (lastMsg && lastMsg.id === freshMessageId) {
            lastMsg.content = content;
            lastMsg.timestamp = new Date().getTime();
          }
          return updatedMessages;
        });
      } : null;

      const res = await mwaiFetch(`${restUrl}/mwai-ui/v1/chats/submit`, body, restNonce, stream);
      const data = await mwaiHandleRes(res, streamCallback, debugMode ? "CHATBOT" : null);

      if (!data.success && data.message) {
        setError(data.message);
        freshMessages.splice(freshMessages.indexOf(freshMessages[freshMessages.length - 1]), 1);
        freshMessages.splice(freshMessages.indexOf(freshMessages[freshMessages.length - 1]), 1);
        setMessages(freshMessages);
        saveMessages(freshMessages);
        setBusy(false);
        return;
      }

      setServerReply(data);
    }
    catch (err) {
      console.error("An error happened in the handling of the chatbot response.", { err });
      setBusy(false);
    }
  };

  const onImageUpload = async (file) => {
    try {
      if (file === null) {
        resetUploadedImage();
        return;
      }
      const res = await mwaiFetchUpload(`${restUrl}/mwai-ui/v1/files/upload`, file, restNonce, (progress) => {
        setUploadedImage({ localFile: file, uploadedId: null, uploadedUrl: null, uploadProgress: progress });
      });
      setUploadedImage({ localFile: file, uploadedId: res.data.id, uploadedUrl: res.data.url, uploadProgress: null });
    }
    catch (error) {
      console.error('onImageUpload Error', error);
      setError(error.message || 'An unknown error occurred');
      resetUploadedImage();
    }
  };

  const actions = {
    setInputText,
    saveMessages,
    initChatbot,
    setMessages,
    setClientId: setChatId,
    resetMessages,
    resetError,
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
    error,
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