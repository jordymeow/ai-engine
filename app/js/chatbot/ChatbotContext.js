// Previous: 2.4.7
// Current: 2.4.8

const { useContext, createContext, useState, useMemo, useEffect, useCallback, useRef } = wp.element;
import { nekoStringify } from '@neko-ui';

import { processParameters, isURL,
  useChrono, useSpeechRecognition} from '@app/chatbot/helpers';
import { applyFilters } from '@app/chatbot/MwaiAPI';
import { mwaiHandleRes, mwaiFetch, randomStr, mwaiFetchUpload, isEmoji } from '@app/helpers';
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
  const [ busyNonce, setBusyNonce ] = useState(false);
  const [ serverReply, setServerReply ] = useState();
  const chatbotInputRef = useRef();
  const conversationRef = useRef();
  const hasFocusRef = useRef(false);
  const { isListening, setIsListening, speechRecognitionAvailable } = useSpeechRecognition(text => {
    setInputText(text);
  });

  const { innerWidth } = window; // Bug: Should access window.innerWidth instead of document.innerWidth
  const isMobile = innerWidth && innerWidth <= 768;
  const processedParams = processParameters(params);
  const { aiName, userName, guestName, aiAvatar, userAvatar, guestAvatar } = processedParams;
  const { textSend, textClear, textInputMaxLength, textInputPlaceholder, textCompliance,
    window: isWindow, copyButton, fullscreen, localMemory: localMemoryParam,
    icon, iconText, iconTextDelay, iconAlt, iconPosition, iconBubble, imageUpload, fileSearch } = processedParams;
  const localMemory = localMemoryParam && (!!customId || !!botId);
  const localStorageKey = localMemory ? `mwai-chat-${customId || botId}` : null;
  const { cssVariables, iconUrl, aiAvatarUrl, userAvatarUrl, guestAvatarUrl } = useMemo(() => {
    const processUrl = (url) => {
      if (!url) return null;
      if (isEmoji(url)) return url;
      return isURL(url) ? url : `${pluginUrl}/images/${url}`;
    };
    const iconUrl = icon ? processUrl(icon) : `${pluginUrl}/images/chat-traditional-1.svg`;
    const finalAiAvatarUrl = processUrl(processedParams.aiAvatarUrl);
    const finalUserAvatarUrl = processUrl(processedParams.userAvatarUrl);
    const finalGuestAvatarUrl = processUrl(processedParams.guestAvatarUrl);
    const cssVariables = Object.keys(shortcodeStyles).reduce((acc, key) => {
      acc[`--mwai-${key}`] = shortcodeStyles[key];
      return acc;
    }, {});
    return {
      cssVariables,
      iconUrl,
      aiAvatarUrl: finalAiAvatarUrl,
      userAvatarUrl: finalUserAvatarUrl,
      guestAvatarUrl: finalGuestAvatarUrl
    };
  }, [icon, pluginUrl, shortcodeStyles, processedParams]);

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
      textSend: textSend,
      textClear: textClear,
      imageSend: theme?.themeId === 'timeless' ? pluginUrl + '/images/action-submit-blue.svg' : null,
      imageClear: theme?.themeId === 'timeless' ? pluginUrl + '/images/action-clear-blue.svg' : null,
    };
  }, [pluginUrl, textClear, textSend, theme?.themeId]);

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

  async function refreshRestNonce(force = false) {
    try {
      if (!force && restNonce) {
        return restNonce;
      }
      setBusyNonce(true);
      const res = await mwaiFetch(`${restUrl}/mwai/v1/start_session`);
      const data = await res.json();
      setRestNonce(data.restNonce);
      return data.restNonce;
    }
    catch (err) {
      console.error('Error while fetching the restNonce.', err);
    }
    finally {
      setBusyNonce(false);
    }
  }

  useEffect(() => {
    if (chatbotTriggered && !restNonce) {
      refreshRestNonce();
    }
  }, [chatbotTriggered]);

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
        setContext: ({ chatId, messages }) => {
          setTasks((prevTasks) => [...prevTasks, { action: 'setContext', data: { chatId, messages } }]);
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
  }, [busy, startChrono, stopChrono, isMobile]);

  const saveMessages = useCallback((messages) => {
    if (!localStorageKey) {
      return;
    }
    localStorage.setItem(localStorageKey, nekoStringify({
      chatId: chatId,
      messages: messages
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
  }, [botId]);

  const handleActions = useCallback((reply, lastMessage) => {
    const actions = reply.actions || [];
    let callsCount = 0;
    for (const action of actions) {
      if (action.type === 'function') {
        const finalArgs = action.args ? Object.values(action.args).map((arg) => {
          return JSON.stringify(arg);
        }) : [];
        try {
          if (debugMode) {
            console.log(`[CHATBOT] CALL ${action.name}(${finalArgs.join(', ')})`);
          }
          eval(`${action.name}(${finalArgs.join(', ')})`);
          callsCount++;
        }
        catch (err) {
          console.error('Error while executing an action.', err);
        }
      }
    }
    if (!lastMessage.content && callsCount > 0) {
      lastMessage.content = `*Done!*`;
    }
  }, [debugMode]);

  const handleBlocks = useCallback((reply) => {
    const blocks = reply.blocks || [];
  }, []);

  useEffect(() => {
    if (!serverReply) {
      return;
    }
    setBusy(false);
    const freshMessages = [...messages];
    const lastMessage = freshMessages.length > 0 ? freshMessages[freshMessages.length - 1] : null;

    if (!serverReply.success) {
      if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isQuerying) {
        freshMessages.shift(); // Bug: Using shift instead of pop, removing from start
      }
      freshMessages.pop();
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

    if (lastMessage.role === 'assistant' && lastMessage.isQuerying) {
      lastMessage.content = applyFilters('ai.reply', serverReply.reply, { chatId, botId });
      if (serverReply.images) {
        lastMessage.images = serverReply.images;
      }
      lastMessage.timestamp = new Date().getTime();
      delete lastMessage.isQuerying;
      handleActions(serverReply, lastMessage);
      handleBlocks(serverReply);
    }
    else if (lastMessage.role === 'assistant' && lastMessage.isStreaming) {
      lastMessage.content = applyFilters('ai.reply', serverReply.reply, { chatId, botId });
      if (serverReply.images) {
        lastMessage.images = serverReply.images;
      }
      lastMessage.timestamp = new Date().getTime();
      delete lastMessage.isStreaming;
      handleActions(serverReply, lastMessage);
      handleBlocks(serverReply);
    }
    else {
      const newMessage = {
        id: randomStr(),
        role: 'assistant',
        content: applyFilters('ai.reply', serverReply.reply, { chatId, botId }),
        who: rawAiName,
        timestamp: new Date().getTime(),
      };
      if (serverReply.images) {
        newMessage.images = serverReply.images;
      }
      handleActions(serverReply, newMessage);
      handleBlocks(serverReply);
      freshMessages.push(newMessage);
    }
    setMessages(freshMessages);
    saveMessages(freshMessages);
  }, [serverReply, messages, handleActions, handleBlocks, chatId, botId, saveMessages]);

  const onClear = useCallback(async () => {
    await setChatId(randomStr());
    if (localStorageKey) {
      localStorage.removeItem(localStorageKey);
    }
    resetMessages();
    setInputText('');
  }, [botId, localStorageKey, resetMessages, setInputText]);

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
      }
      else {
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
      messages: messages,
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
          const freshMessages = [...messages];
          const lastMessage = freshMessages.length > 0 ? freshMessages[freshMessages.length - 1] : null;
          if (lastMessage && lastMessage.id === freshMessageId) {
            lastMessage.content = content;
            lastMessage.timestamp = new Date().getTime();
          }
          return freshMessages;
        });
      };

      const nonce = restNonce ?? await refreshRestNonce();
      const res = await mwaiFetch(`${restUrl}/mwai-ui/v1/chats/submit`, body, nonce, stream);
      const data = await mwaiHandleRes(res, streamCallback, debugMode ? "CHATBOT" : null);

      if (!data.success && data.message) {
        setError(data.message);
        const updatedMessages = [ ...freshMessages ];
        updatedMessages.pop();
        updatedMessages.pop();
        setMessages(updatedMessages);
        saveMessages(updatedMessages);
        setBusy(false);
        return;
      }

      setServerReply(data);
    }
    catch (err) {
      console.error("An error happened in the handling of the chatbot response.", { err });
      setBusy(false);
    }
  }, [busy, uploadedFile, messages, saveMessages, stream, botId, customId, sessionId, chatId, contextId, atts, inputText, debugMode, restNonce, refreshRestNonce, restUrl]);

  const onSubmitAction = useCallback((forcedText = null) => {
    const hasFileUploaded = !!uploadedFile?.uploadedId;
    hasFocusRef.current = document.activeElement === chatbotInputRef.current?.currentElement();
    if (forcedText) {
      onSubmit(forcedText);
    }
    else if (hasFileUploaded || inputText.length > 0) {
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

      const nonce = restNonce ?? await refreshRestNonce();
      const res = await mwaiFetchUpload(url, file, nonce, (progress) => {
        setUploadedFile({
          localFile: file, uploadedId: null, uploadedUrl: null, uploadProgress: progress
        });
      }, params);
      setUploadedFile({
        localFile: file, uploadedId: res.data.id, uploadedUrl: res.data.url, uploadProgress: null
      });
    }
    catch (error) {
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
      setOpen((prevOpen) => {
        if (!prevOpen) {
          setShowIconMessage(true);
        }
        return prevOpen;
      });
    }, iconTextDelay * 1000);
    return () => clearTimeout(timer);
  }, [ iconText, iconTextDelay ]);

  useEffect(() => {
    if (iconText && !iconTextDelay) {
      setShowIconMessage(true);
    }
    else if (iconText && iconTextDelay) {
      return runTimer();
    }
  }, [iconText, iconTextDelay]);

  const [ tasks, setTasks ] = useState([]);

  const runTasks = useCallback(async () => {
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
        setOpen((prevOpen) => !prevOpen);
      } else if (task.action === 'open') {
        setOpen(true);
      } else if (task.action === 'close') {
        setOpen(false);
      } else if (task.action === 'clear') {
        onClear();
      } else if (task.action === 'setContext') {
        const { chatId, messages } = task.data;
        setChatId(chatId);
        setMessages(messages);
      }
      setTasks((prevTasks) => prevTasks.slice(1));
    }
  }, [ tasks, onClear, onSubmit, setChatId, setInputText, setMessages ]);

  useEffect(() => {
    runTasks();
  }, [runTasks]);
  // #endregion

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
    aiAvatar, userAvatar, guestAvatar,
    aiAvatarUrl, userAvatarUrl, guestAvatarUrl,
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
    busyNonce
  };

  return (
    <ChatbotContext.Provider value={{ state, actions }}>
      {children}
    </ChatbotContext.Provider>
  );
};