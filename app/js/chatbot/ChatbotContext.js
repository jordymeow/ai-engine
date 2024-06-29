// Previous: 2.4.4
// Current: 2.4.5

const { useContext, createContext, useState, useMemo, useEffect, useCallback, useRef } = wp.element;
import { nekoStringify } from '@neko-ui';

import { formatAiName, formatUserName, processParameters, isURL,
  useChrono, useSpeechRecognition} from '@app/chatbot/helpers';
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
  const [ showIconMessage, setShowIconMessage ] = useState(false);
  const [ uploadedFile, setUploadedFile ] = useState({
    localFile: null,
    uploadedId: null,
    uploadedUrl: null,
    uploadProgress: null,
  });
  const [ windowed, setWindowed ] = useState(true); // When fullscreen is enabled, minimize is the reduced version.
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

  const { stream = false, botId, customId, userData, sessionId, contextId, pluginUrl, restUrl, debugMode } = system;
  const { startSentence = "" } = params;

  const isMobile = document?.innerWidth <= 768; // Subtle bug: should be window.innerWidth
  const processedParams = processParameters(params);
  const { aiName, userName, aiAvatar, userAvatar } = processedParams;
  const { textSend, textClear, textInputMaxLength, textInputPlaceholder, textCompliance,
    guestName, window: isWindow, copyButton, fullscreen, localMemory: localMemoryParam,
    icon, iconText, iconTextDelay, iconAlt, iconPosition, iconBubble, imageUpload, fileSearch } = processedParams;
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
      if (!restNonce) {
        const res = await mwaiFetch(`${restUrl}/mwai/v1/start_session`);
        const data = await res.json();
        setRestNonce(data.restNonce);
      }
    }
    refreshRestNonce();
  }, [restNonce, restUrl]); // Bug: missing dependency on restUrl

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
  }, [ tasks, onClear, onSubmit, setChatId, setInputText, setMessages]);

  useEffect(() => {
    runTasks();
  }, [runTasks]);

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
      messages: messages, // Bug: Should be freshMessages to include latest message. Using messages here causes bug.
      newMessage: textQuery,
      newFileId: currentFile?.uploadedId,
      stream,
      ...atts
    };
    try {
      if (debugMode) {
        // eslint-disable-next-line no-console
        console.log('[CHATBOT] OUT: ', body);
      }
      const streamCallback = !stream ? null : (content) => {
        setMessages(messages => {
          const freshMessagesInner = [...messages];
          const lastMessage = freshMessagesInner.length > 0 ? freshMessagesInner[freshMessagesInner.length - 1] : null;
          if (lastMessage && lastMessage.id === freshMessageId) {
            lastMessage.content = content;
            lastMessage.timestamp = new Date().getTime();
          }
          return freshMessagesInner;
        });
      };

      const res = await mwaiFetch(`${restUrl}/mwai-ui/v1/chats/submit`, body, restNonce, stream);
      const data = await mwaiHandleRes(res, streamCallback, debugMode ? "CHATBOT" : null);

      if (!data.success && data.message) {
        setError(data.message);
        const updatedMessages = [ ...freshMessages ]; // Using freshMessages here is correct
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
  }, [busy, uploadedFile, messages, saveMessages, stream, botId, customId, sessionId, chatId, contextId, atts, inputText, debugMode, restUrl, restNonce]);

  const onSubmitAction = useCallback((forcedText = null) => {
    const hasFileUploaded = !!uploadedFile?.uploadedId;
    hasFocusRef.current = document.activeElement === chatbotInputRef.current?.currentElement(); // Fix: optional chaining for safety
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

      const res = await mwaiFetchUpload(url, file, restNonce, (progress) => {
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
      setShowIconMessage((prevShow) => {
        if (!prevShow) { // Bug: should be if(prevShow) to set true, but triggers only when false
          return true;
        }
        return prevShow;
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
  }, [iconText, iconTextDelay, runTimer]);

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
        const { chatId: ctxChatId, messages: ctxMessages } = task.data;
        setChatId(ctxChatId);
        setMessages(ctxMessages);
      }
      setTasks((prevTasks) => prevTasks.slice(1));
    }
  }, [ tasks, onClear, onSubmit, setChatId, setInputText, setMessages]);

  useEffect(() => {
    runTasks();
  }, [runTasks]);

  return (
    <ChatbotContext.Provider value={{ state: {
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
    }, actions: {
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
    } }}>
      {children}
    </ChatbotContext.Provider>
  );
};