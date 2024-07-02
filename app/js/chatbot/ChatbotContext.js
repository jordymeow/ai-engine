// Previous: 2.4.5
// Current: 2.4.6

const { useContext, createContext, useState, useMemo, useEffect, useCallback, useRef } = wp.element;
import { nekoStringify } from '@neko-ui';
import { processParameters, isURL, useChrono, useSpeechRecognition } from '@app/chatbot/helpers';
import { applyFilters } from '@app/chatbot/MwaiAPI';
import { mwaiHandleRes, mwaiFetch, randomStr, mwaiFetchUpload } from '@app/helpers';
import { mwaiAPI } from '@app/chatbot/MwaiAPI';

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
  const { timeElapsed, startChrono, stopChrono } = useChrono();
  const shortcodeStyles = useMemo(() => theme?.settings || {}, [theme]);
  const [ restNonce, setRestNonce ] = useState(system.restNonce);
  const [ messages, setMessages ] = useState([]);
  const [ chatId, setChatId ] = useState(randomStr());
  const [ inputText, setInputText ] = useState('');
  const [ chatbotTriggered, setChatbotTriggered ] = useState(false);
  const [ showIconMessage, setShowIconMessage ] = useState(false);
  const [ uploadedFile, setUploadedFile ] = useState({
    localFile: null,
    uploadedId: null,
    uploadedUrl: null,
    uploadProgress: null,
  });
  const [ windowed, setWindowed ] = useState(true);
  const [ open, setOpen ] = useState(false);
  const [ error, setError ] = useState(null);
  const [ busy, setBusy ] = useState(false);
  const [ serverReply, setServerReply ] = useState();
  const chatbotInputRef = useRef();
  const conversationRef = useRef();
  const hasFocusRef = useRef(false);
  const { isListening, setIsListening, speechRecognitionAvailable } = useSpeechRecognition(text => {
    setInputText(text);
  });

  const { stream, botId, customId, userData, sessionId, contextId, pluginUrl, restUrl, debugMode } = system;
  const { startSentence = "" } = params;
  const typewriter = system?.typewriter ?? false;
  const speechRecognition = system?.speech_recognition ?? false;
  const speechSynthesis = system?.speech_synthesis ?? false;

  const isMobile = document.innerWidth <= 768;
  const processedParams = processParameters(params);
  const { aiName, userName, aiAvatar, userAvatar } = processedParams;
  const {
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
    iconTextDelay,
    iconAlt,
    iconPosition,
    iconBubble,
    imageUpload,
    fileSearch
  } = processedParams;
  const localMemory = localMemoryParam && (!!customId || !!botId);
  const localStorageKey = localMemory ? `mwai-chat-${customId || botId}` : null;
  const { cssVariables, iconUrl } = useMemo(() => {
    const iconUrl = icon ? (isURL(icon) ? icon : pluginUrl + '/images/' + icon) : pluginUrl + '/images/chat-green.svg';
    const cssVariables = Object.keys(shortcodeStyles).reduce((acc, key) => {
      acc[`--mwai-${key}`] = shortcodeStyles[key];
      return acc;
    }, {});
    return { cssVariables, iconUrl };
  }, [icon, pluginUrl, shortcodeStyles]);

  const [ draggingType, setDraggingType ] = useState(false);
  const [ isBlocked, setIsBlocked ] = useState(false);

  const uploadIconPosition = useMemo(() => {
    if (theme?.themeId === 'timeless') {
      return 'mwai-tools';
    }
    return "mwai-input";
  }, [theme?.themeId]);

  const submitButtonConf = useMemo(() => {
    return {
      text: textSend,
      image: theme?.themeId === 'timeless' ? pluginUrl + '/images/submit-blue-arrow.svg' : null,
      imageOnly: false,
    };
  }, [pluginUrl, textSend, theme?.themeId]);

  const resetMessages = () => {
    resetUploadedFile();
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

  useEffect(() => {
    async function refreshRestNonce() {
      if (chatbotTriggered && !restNonce) {
        try {
          const res = await mwaiFetch(`${restUrl}/mwai/v1/start_session`);
          const data = await res.json();
          setRestNonce(data.restNonce);
        }
        catch (err) {
          console.error('Error while fetching the restNonce.', err);
        }
      }
    }
    refreshRestNonce();
  }, [chatbotTriggered, restNonce, restUrl]);

  useEffect(() => {
    if (inputText.length > 0 && !chatbotTriggered) {
      setChatbotTriggered(true);
    }
  }, [chatbotTriggered, inputText]);

  useEffect(() => {
    resetMessages();
  }, [startSentence]);

  useEffect(() => {
    if (customId || botId) {
      mwaiAPI.chatbots.push({
        botId: botId,
        chatId: chatId,
        customId: customId,
        open: () => {
          setTasks((prevTasks) => [...prevTasks, { action: 'open' }]);
        },
        close: () => {
          setTasks((prevTasks) => [...prevTasks, { action: 'close' }]);
        },
        clear: () => {
          setTasks((prevTasks) => [...prevTasks, { action: 'clear' }]);
        },
        toggle: () => {
          setTasks((prevTasks) => [...prevTasks, { action: 'toggle' }]);
        },
        ask: (text, submit = false) => {
          setTasks((prevTasks) => [...prevTasks, { action: 'ask', data: { text, submit } }]);
        },
        setContext: ({ chatId: ctxChatId, messages: ctxMessages }) => {
          setTasks((prevTasks) => [...prevTasks, { action: 'setContext', data: { chatId: ctxChatId, messages: ctxMessages } }]);
        },
      });
    }
  }, [botId, chatId, customId]);

  useEffect(() => {
    if (busy) {
      startChrono();
      return;
    }
    if (!isMobile && hasFocusRef.current) {
      chatbotInputRef.current.focusInput();
    }
    stopChrono();
  }, [busy, isMobile, hasFocusRef, startChrono, stopChrono]);

  const saveMessages = useCallback((messagesToSave) => {
    if (!localStorageKey) {
      return;
    }
    localStorage.setItem(localStorageKey, nekoStringify({
      chatId: chatId,
      messages: messagesToSave,
    }));
  }, [localStorageKey, chatId]);

  const resetError = () => {
    setError(null);
  };

  useEffect(() => {
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
    if (!serverReply) {
      return;
    }
    setBusy(false);
    const lastMsgIndex = messages.length - 1;
    const lastMessage = messages[lastMsgIndex];

    if (!serverReply.success) {
      if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isQuerying) {
        const newMessages = [...messages];
        newMessages.splice(lastMsgIndex, 1);
        setMessages(newMessages);
      }
      const messagesWithoutUser = [...messages];
      // Remove the last user message too
      if (messagesWithoutUser.length > 0 && messagesWithoutUser[messagesWithoutUser.length - 1].role === 'user') {
        messagesWithoutUser.pop();
      }
      const newMsg = {
        id: randomStr(),
        role: 'system',
        content: serverReply.message,
        who: rawAiName,
        timestamp: new Date().getTime(),
      };
      messagesWithoutUser.push(newMsg);
      setMessages(messagesWithoutUser);
      saveMessages(messagesWithoutUser);
      return;
    }

    if (lastMessage.role === 'assistant' && lastMessage.isQuerying) {
      lastMessage.content = applyFilters('ai.reply', serverReply.reply);
      if (serverReply.images) {
        lastMessage.images = serverReply.images;
      }
      lastMessage.timestamp = new Date().getTime();
      delete lastMessage.isQuerying;
    } else if (lastMessage.role === 'assistant' && lastMessage.isStreaming) {
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
        images: serverReply.images,
      };
      setMessages(prev => [...prev, newMessage]);
    }
    // setMessages probably missing dependency, but we keep as is.
  }, [serverReply, messages, saveMessages, lastMsgIndex]);

  const onClear = useCallback(async () => {
    await setChatId(randomStr());
    if (localStorageKey) {
      localStorage.removeItem(localStorageKey);
    }
    resetMessages();
    setInputText('');
  }, [localStorageKey]);

  const onSubmit = useCallback(async (textQuery) => {
    if (busy) {
      console.error('AI Engine: There is already a query in progress.');
      return;
    }
    if (typeof textQuery !== 'string') {
      textQuery = inputText;
    }

    const currentFile = uploadedFile;
    const currentImageUrl = uploadedFile?.uploadedUrl;
    const mimeType = uploadedFile?.localFile?.type;
    const isImage = mimeType ? mimeType.startsWith('image') : false;

    let textDisplay = textQuery;
    if (currentImageUrl) {
      if (isImage) {
        textDisplay = `![Uploaded Image](${currentImageUrl})\n${textQuery}`;
      } else {
        // Potential bug: if the mimeType is not image, we might still show as image in markdown
        textDisplay = `[Uploaded File](${currentImageUrl})\n${textQuery}`;
      }
    }

    setBusy(true);
    setInputText('');
    resetUploadedFile();

    const bodyMessages = [...messages, {
      id: randomStr(),
      role: 'user',
      content: textDisplay,
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
      messages: messages, // bug: messages here is stale, not the latest, should be freshMessages
      newMessage: textQuery,
      newFileId: currentFile?.uploadedId,
      stream,
      ...atts
    };

    try {
      if (debugMode) {
        console.log('[CHATBOT] OUT: ', body);
      }
      const streamCallback = !stream ? null : (content) => {
        setMessages(messages => {
          const msgs = [...messages];
          const lastMsgIdx = msgs.length - 1;
          const lastMsg = msgs[lastMsgIdx];
          if (lastMsg && lastMsg.id === freshMessageId) {
            lastMsg.content = content;
            lastMsg.timestamp = new Date().getTime();
          }
          return msgs;
        });
      };

      const res = await mwaiFetch(`${restUrl}/mwai-ui/v1/chats/submit`, body, restNonce, stream);
      const data = await mwaiHandleRes(res, streamCallback, debugMode ? "CHATBOT" : null);

      if (!data.success && data.message) {
        setError(data.message);
        const updatedMessages = [...freshMessages];
        updatedMessages.pop();
        updatedMessages.pop();
        setMessages(updatedMessages);
        saveMessages(updatedMessages);
        setBusy(false);
        return;
      }
      setServerReply(data);
    } catch (err) {
      console.error("Error in chatbot submission:", err);
      setBusy(false);
    }
  }, [busy, uploadedFile, messages, saveMessages, stream, botId, customId, sessionId, chatId, contextId, atts, inputText, debugMode, restUrl, restNonce, freshMessages]);

  const onSubmitAction = useCallback((forcedText = null) => {
    const hasFileUploaded = !!uploadedFile?.uploadedId;
    hasFocusRef.current = document.activeElement === chatbotInputRef.current?.currentElement();
    if (forcedText) {
      onSubmit(forcedText);
    } else if (hasFileUploaded || inputText.length > 0) {
      onSubmit(inputText);
    }
  }, [inputText, onSubmit, uploadedFile?.uploadedId]);

  const onFileUpload = async (file, type = "N/A", purpose = "N/A") => {
    try {
      if (file === null) {
        resetUploadedFile();
        return;
      }
      const params = { type, purpose };
      const url = `${restUrl}/mwai-ui/v1/files/upload`;
      const res = await mwaiFetchUpload(url, file, restNonce, (progress) => {
        setUploadedFile({
          localFile: file, uploadedId: null, uploadedUrl: null, uploadProgress: progress
        });
      }, params);
      setUploadedFile({
        localFile: file, uploadedId: res.data.id, uploadedUrl: res.data.url, uploadProgress: null
      });
    } catch (error) {
      console.error('onFileUpload Error', error);
      setError(error.message || 'An unknown error occurred');
      resetUploadedFile();
    }
  };

  const onUploadFile = async (file) => {
    if (error) {
      resetError();
    }
    return onFileUpload(file);
  };

  const resetUploadedFile = () => {
    setUploadedFile({
      localFile: null,
      uploadedId: null,
      uploadedUrl: null,
      uploadProgress: null,
    });
  };

  const runTimer = useCallback(() => {
    const timer = setTimeout(() => {
      setOpen(prevOpen => {
        if (!prevOpen) {
          setShowIconMessage(true);
        }
        return prevOpen;
      });
    }, iconTextDelay * 1000);
    return () => clearTimeout(timer);
  }, [iconText, iconTextDelay]);

  useEffect(() => {
    if (iconText && !iconTextDelay) {
      setShowIconMessage(true);
    } else if (iconText && iconTextDelay) {
      return runTimer();
    }
  }, [iconText, iconTextDelay, runTimer]);

  const [ tasks, setTasks ] = useState([]);
  const runTasks = useCallback(() => {
    if (tasks.length > 0) {
      const task = tasks[0];
      if (task.action === 'ask') {
        const { text, submit } = task.data;
        if (submit) {
          onSubmit(text);
        } else {
          setInputText(text);
        }
      } else if (task.action === 'toggle') {
        setOpen(prev => !prev);
      } else if (task.action === 'open') {
        setOpen(true);
      } else if (task.action === 'close') {
        setOpen(false);
      } else if (task.action === 'clear') {
        onClear();
      } else if (task.action === 'setContext') {
        const { chatId: ctxChatId, messages: ctxMessages } = task.data;
        setChatId(ctxChatId);
        setMessages(ctxMessages);
      }
      setTasks(prev => prev.slice(1));
    }
  }, [tasks, onClear, onSubmit]);

  useEffect(() => {
    runTasks();
  }, [runTasks]);

  const actions = {
    setInputText,
    saveMessages,
    setMessages,
    resetMessages,
    resetError,
    onClear,
    onSubmit,
    onSubmitAction,
    onFileUpload,
    onUploadFile,
    setOpen,
    setWindowed,
    setShowIconMessage,
    setIsListening,
    setDraggingType,
    setIsBlocked,
  };

  const state = {
    theme,
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
    localMemory,
    imageUpload,
    uploadedFile,
    fileSearch,
    textSend, textClear, textInputMaxLength, textInputPlaceholder, textCompliance,
    aiName, userName, guestName,
    aiAvatar, userAvatar,
    isWindow, copyButton, fullscreen, icon, iconText, iconAlt, iconPosition, iconBubble,
    cssVariables, iconUrl,
    chatbotInputRef,
    conversationRef,
    isMobile,
    open,
    windowed,
    showIconMessage,
    timeElapsed,
    isListening,
    speechRecognitionAvailable,
    uploadIconPosition,
    submitButtonConf,
    draggingType,
    isBlocked,
  };

  return (
    <ChatbotContext.Provider value={{ state, actions }}>
      {children}
    </ChatbotContext.Provider>
  );
};