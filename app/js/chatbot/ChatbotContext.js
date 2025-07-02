// Previous: 2.8.4
// Current: 2.8.5

const { useContext, createContext, useState, useMemo, useEffect, useCallback, useRef } = wp.element;

// AI Engine
import { processParameters, isURL, useChrono, useSpeechRecognition, doPlaceholders} from '@app/chatbot/helpers';
import { applyFilters } from '@app/chatbot/MwaiAPI';
import { mwaiHandleRes, mwaiFetch, randomStr, mwaiFetchUpload, isEmoji, nekoStringify } from '@app/helpers';
import { mwaiAPI } from '@app/chatbot/MwaiAPI';
import tokenManager from '@app/helpers/tokenManager';

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
  const [ restNonce, setRestNonce ] = useState(system.restNonce || tokenManager.getToken());
  const restNonceRef = useRef(system.restNonce || tokenManager.getToken());

  useEffect(() => {
    const unsubscribe = tokenManager.subscribe((newToken) => {
      setRestNonce(newToken);
      restNonceRef.current = newToken;
    });
    return unsubscribe;
  }, []);

  const [ messages, setMessages ] = useState([]);
  const [ shortcuts, setShortcuts ] = useState([]);
  const [ blocks, setBlocks ] = useState([]);
  const [ locked, setLocked ] = useState(false);
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
  const [ previousResponseId, setPreviousResponseId ] = useState(null);
  const chatbotInputRef = useRef();
  const conversationRef = useRef();
  const hasFocusRef = useRef(false);
  const { isListening, setIsListening, speechRecognitionAvailable } = useSpeechRecognition(text => {
    setInputText(text);
  });

  const stream = system.stream || false;
  const internalId = useMemo(() => randomStr(), []);
  const botId = system.botId;
  const customId = system.customId;
  const userData = system.userData;
  const [sessionId, setSessionId] = useState(system.sessionId);
  const contextId = system.contextId;
  const pluginUrl = system.pluginUrl;
  const restUrl = system.restUrl;
  const debugMode = system.debugMode;
  const eventLogs = system.eventLogs;
  const virtualKeyboardFix = system.virtual_keyboard_fix;
  const typewriter = system?.typewriter ?? false;
  const speechRecognition = system?.speech_recognition ?? false;
  const speechSynthesis = system?.speech_synthesis ?? false;
  const startSentence = doPlaceholders(params.startSentence?.trim() ?? "", userData);

  const initialActions = system.actions || [];
  const initialShortcuts = system.shortcuts || [];
  const initialBlocks = system.blocks || [];

  const isMobile = document.innerWidth <= 768;
  const processedParams = processParameters(params, userData);
  const { aiName, userName, guestName, aiAvatar, userAvatar, guestAvatar } = processedParams;
  const { textSend, textClear, textInputMaxLength, textInputPlaceholder, textCompliance,
    window: isWindow, copyButton, headerSubtitle, fullscreen, localMemory: localMemoryParam,
    icon, iconText, iconTextDelay, iconAlt, iconPosition, iconBubble, imageUpload, fileUpload, fileSearch } = processedParams;
  const isRealtime = processedParams.mode === 'realtime';
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
    setPreviousResponseId(null);
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

  const refreshRestNonce = useCallback(async (force = false) => {
    try {
      if (!force && restNonce) {
        return restNonce;
      }
      setBusyNonce(true);
      const res = await mwaiFetch(`${restUrl}/mwai/v1/start_session`);
      const data = await res.json();
      setRestNonce(data.restNonce);
      restNonceRef.current = data.restNonce;
      tokenManager.setToken(data.restNonce);
      if (data.sessionId && data.sessionId !== 'N/A') {
        setSessionId(data.sessionId);
      }
      if (data.new_token) {
        if (data.token_expires_at) {
          const expiresAt = new Date(data.token_expires_at * 1000);
          console.log(`[MWAI] 🔐 New token received - expires at ${expiresAt.toLocaleTimeString()} (in ${data.token_expires_in}s)`);
        }
        setRestNonce(data.new_token);
        restNonceRef.current = data.new_token;
        tokenManager.setToken(data.new_token);
        return data.new_token;
      }
      
      return data.restNonce;
    }
    catch (err) {
      console.error('Error while fetching the restNonce.', err);
    }
    finally {
      setBusyNonce(false);
    }
  }, [restNonce, setRestNonce, restUrl, setSessionId]);

  const [isResumingConversation, setIsResumingConversation] = useState(false);
  const [isConversationLoaded, setIsConversationLoaded] = useState(false);

  useEffect(() => {
    if (debugMode) {
      // console.log('[INIT] Shortcuts init effect', {
      //   isConversationLoaded,
      //   isResumingConversation,
      //   messagesLength: messages.length,
      //   initialShortcutsLength: initialShortcuts.length
      // });
    }
    if (!isConversationLoaded) {
      return;
    }
    const hasExistingConversation = isResumingConversation || 
      (messages.length > 1) || 
      (messages.length === 1 && messages[0].content !== startSentence);
    
    if (!hasExistingConversation) {
      if (debugMode) {
        // console.log('[INIT] Showing initial shortcuts');
      }
      if (initialActions.length > 0) {
        handleActions(initialActions);
      }
      if (initialShortcuts.length > 0) {
        handleShortcuts(initialShortcuts);
      }
      if (initialBlocks.length > 0) {
        handleBlocks(initialBlocks);
      }
    } else {
      if (debugMode) {
        // console.log('[INIT] NOT showing initial shortcuts - existing conversation');
      }
    }
  }, [isConversationLoaded, isResumingConversation, messages, startSentence]);

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
      const existingChatbotIndex = mwaiAPI.chatbots.findIndex(
        (chatbot) => chatbot.internalId === internalId
      );
      const chatbot = {
        internalId: internalId,
        botId: botId,
        chatId: chatId,
        customId: customId,
        localStorageKey: localStorageKey,
        open: () => {
          setTasks((prevTasks) => [...prevTasks, { action: 'open' }]);
        },
        close: () => {
          setTasks((prevTasks) => [...prevTasks, { action: 'close' }]);
        },
        clear: (params) => {
          const { chatId = null } = params || {};
          setTasks((prevTasks) => [...prevTasks, { action: 'clear', data: { chatId } }]);
        },
        toggle: () => {
          setTasks((prevTasks) => [...prevTasks, { action: 'toggle' }]);
        },
        ask: (text, submit = false) => {
          setTasks((prevTasks) => [...prevTasks, { action: 'ask', data: { text, submit } }]);
        },
        lock: () => {
          setLocked(true);
        },
        unlock: () => {
          setLocked(false);
        },
        setShortcuts: (shortcuts) => {
          setTasks((prevTasks) => [...prevTasks, { action: 'setShortcuts', data: shortcuts }]);
        },
        setBlocks: (blocks) => {
          setTasks((prevTasks) => [...prevTasks, { action: 'setBlocks', data: blocks }]);
        },
        addBlock: (block) => {
          setTasks((prevTasks) => [...prevTasks, { action: 'addBlock', data: block }]);
        },
        removeBlockById: (blockId) => {
          setTasks((prevTasks) => [...prevTasks, { action: 'removeBlockById', data: blockId }]);
        },
        getBlocks: () => {
          return blocks;
        },
        setContext: ({ chatId, messages, previousResponseId }) => {
          console.warn('MwaiAPI: setContext is deprecated. Please use setConversation instead.');
          setTasks((prevTasks) => [...prevTasks, { action: 'setContext', data: { chatId, messages, previousResponseId } }]);
        },
        setConversation: ({ chatId, messages, previousResponseId }) => {
          setTasks((prevTasks) => [...prevTasks, { action: 'setContext', data: { chatId, messages, previousResponseId } }]);
        },
      };
      if (existingChatbotIndex !== -1) {
        mwaiAPI.chatbots[existingChatbotIndex] = chatbot;
      }
      else {
        mwaiAPI.chatbots.push(chatbot);
      }
    }
  }, [botId, chatId, customId, internalId, localStorageKey, blocks]);

  useEffect(() => {
    if (busy) {
      startChrono();
      return;
    }
    if (!isMobile && hasFocusRef.current && chatbotInputRef.current?.focusInput) {
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

  // New BotId: Initializes the chat history
  useEffect(() => {
    let chatHistory = [];
    if (localStorageKey) {
      chatHistory = localStorage.getItem(localStorageKey);
      if (chatHistory) {
        chatHistory = JSON.parse(chatHistory);
        setMessages(chatHistory.messages);
        setChatId(chatHistory.chatId);
        setIsResumingConversation(true);
        setIsConversationLoaded(true);
        return;
      }
    }
    setIsResumingConversation(false);
    setIsConversationLoaded(true);
    resetMessages();
  }, [botId]);

  const executedActionsRef = useRef(new Set());

  const handleActions = useCallback((actions, lastMessage) => {
    actions = actions || [];
    let callsCount = 0;
    for (const action of actions) {
      if (action.type === 'function') {
        const data = action.data || {};
        const { name = null, args = [] } = data;
        const actionKey = `${name}_${JSON.stringify(args)}`;
        if (executedActionsRef.current.has(actionKey)) {
          if (debugMode) {
            console.log(`[CHATBOT] Skipping duplicate execution of ${name}`);
          }
          continue;
        }
        const finalArgs = args ? Object.values(args).map((arg) => {
          return JSON.stringify(arg);
        }) : [];
        try {
          if (debugMode) {
            console.log(`[CHATBOT] CALL ${name}(${finalArgs.join(', ')})`);
          }
          
          executedActionsRef.current.add(actionKey);
          
          eval(`${name}(${finalArgs.join(', ')})`);
          callsCount++;
          
          setTimeout(() => {
            executedActionsRef.current.delete(actionKey);
          }, 5000);
        }
        catch (err) {
          console.error('Error while executing an action.', err);
          executedActionsRef.current.delete(actionKey);
        }
      }
    }
    if (!lastMessage.content && callsCount > 0) {
      lastMessage.content = `*Done!*`;
    }
  }, [debugMode]);

  const handleShortcuts = useCallback(shortcuts => {
    setShortcuts(shortcuts || []);
  }, []);

  const handleBlocks = useCallback(blocks => {
    setBlocks(blocks || []);
  }, []);

  useEffect(() => {
    if (!serverReply) {
      return;
    }
    setBusy(false);
    const freshMessages = [...messages];
    const lastMessage = freshMessages.length > 0 ? freshMessages[freshMessages.length - 1] : null;

    if (!serverReply.success) {
      let userMessage = null;
      if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isQuerying) {
        freshMessages.pop();
      }
      const userMessageIndex = freshMessages.length - 1;
      if (userMessageIndex >= 0 && freshMessages[userMessageIndex].role === 'user') {
        userMessage = freshMessages[userMessageIndex];
        const content = userMessage.content;
        const markdownMatch = content.match(/^(?:\!\[.*?\]\(.*?\)|\[.*?\]\(.*?\))\n(.*)$/s);
        const textToRestore = markdownMatch ? markdownMatch[1] : content;
        setInputText(textToRestore);
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
      handleActions(serverReply?.actions, lastMessage);
      handleBlocks(serverReply?.blocks);
      handleShortcuts(serverReply?.shortcuts);
    }
    else if (lastMessage.role === 'assistant' && lastMessage.isStreaming) {
      lastMessage.content = applyFilters('ai.reply', serverReply.reply, { chatId, botId });
      if (serverReply.images) {
        lastMessage.images = serverReply.images;
      }
      lastMessage.timestamp = new Date().getTime();
      delete lastMessage.isStreaming;
      if (debugMode && lastMessage.streamEvents) {
        const now = new Date().getTime();
        const startTime = lastMessage.streamEvents[0]?.timestamp || now;
        const duration = now - startTime;
        let durationText;
        if (duration < 1000) {
          durationText = `${duration}ms`;
        } else if (duration < 60000) {
          durationText = `${(duration / 1000).toFixed(1)}s`;
        } else {
          const minutes = Math.floor(duration / 60000);
          const seconds = ((duration % 60000) / 1000).toFixed(0);
          durationText = `${minutes}m ${seconds}s`;
        }
        lastMessage.streamEvents.push({
          type: 'event',
          subtype: 'status',
          data: `Request completed in ${durationText}.`,
          timestamp: now
        });
      }
      handleActions(serverReply?.actions, lastMessage);
      handleBlocks(serverReply?.blocks);
      handleShortcuts(serverReply?.shortcuts);
    }
    else {
      const newMessage = {
        id: randomStr(),
        role: 'assistant',
        content: applyFilters('ai.reply', serverReply.reply, { botId, chatId, customId }),
        who: rawAiName,
        timestamp: new Date().getTime(),
      };
      if (serverReply.images) {
        newMessage.images = serverReply.images;
      }
      handleActions(serverReply?.actions, newMessage);
      handleBlocks(serverReply?.blocks);
      handleShortcuts(serverReply?.shortcuts);
      freshMessages.push(newMessage);
    }
    if (serverReply.responseId) {
      setPreviousResponseId(serverReply.responseId);
    }
    setMessages(freshMessages);
    saveMessages(freshMessages);
  }, [serverReply]);

  const onClear = useCallback(async ({ chatId = null } = {}) => {
    if (!chatId) {
      chatId = randomStr();
    }
    await setChatId(chatId);
    if (localStorageKey) {
      localStorage.removeItem(localStorageKey);
    }
    resetMessages();
    setInputText('');
    setIsResumingConversation(false);
    setIsConversationLoaded(true);
    if (initialShortcuts.length > 0) {
      handleShortcuts(initialShortcuts);
    } else {
      setShortcuts([]);
    }
    setBlocks([]);
    setPreviousResponseId(null);
  }, [botId, initialShortcuts, handleShortcuts]);

  const onStartRealtimeSession = useCallback(async () => {
    const body = {
      botId: botId,
      customId: customId,
      contextId: contextId,
      chatId: chatId,
    };
    const nonce = restNonceRef.current ?? await refreshRestNonce();
    const res = await mwaiFetch(`${restUrl}/mwai-ui/v1/openai/realtime/start`, body, nonce);
    const data = await mwaiHandleRes(res, null, null, null, debugMode);
    return data;
  }, [botId, customId, contextId, chatId, restNonce, refreshRestNonce, restUrl]);

  const onCommitStats = useCallback(async (stats, refId = null) => {
    try {
      const nonce = restNonceRef.current ?? await refreshRestNonce();
      const res = await mwaiFetch(`${restUrl}/mwai-ui/v1/openai/realtime/stats`, {
        botId: botId,
        session: sessionId,
        refId: refId || chatId,
        stats: stats
      }, nonce);
      const data = await mwaiHandleRes(res, null, null, null, debugMode);
      return {
        success: data.success,
        message: data.message,
        overLimit: data.overLimit || false,
        limitMessage: data.limitMessage || null
      };
    }
    catch (err) {
      console.error('Error while committing stats.', err);
      return {
        success: false,
        message: 'An error occurred while committing the stats.'
      };
    }
  }, [botId, restNonce, refreshRestNonce, restUrl, sessionId, chatId]);

  const onCommitDiscussions = useCallback(
    async (messages = []) => {
      try {
        const nonce = restNonceRef.current ?? await refreshRestNonce();
        const payload = {
          botId: botId,
          session: sessionId,
          chatId: chatId,
          messages: messages ?? []
        };
        const res = await mwaiFetch(
          `${restUrl}/mwai-ui/v1/openai/realtime/discussions`,
          payload,
          nonce
        );
        const data = await mwaiHandleRes(res, null, null, null, debugMode);
        return {
          success: data.success,
          message: data.message,
        };
      }
      catch (err) {
        console.error('Error while committing discussion.', err);
        return {
          success: false,
          message: 'An error occurred while committing the discussion.'
        };
      }
    },
    [botId, chatId, restNonce, refreshRestNonce, restUrl, sessionId]
  );

  const onRealtimeFunctionCallback = useCallback(async (functionId, functionType, functionName, functionTarget, args) => {
    const body = { functionId, functionType, functionName, functionTarget, arguments: args };

    if (functionTarget === 'js') {
      const finalArgs = args ? Object.values(args).map((arg) => {
        return JSON.stringify(arg);
      }) : [];
      try {
        if (debugMode) {
          console.log(`[CHATBOT] CALL ${functionName}(${finalArgs.join(', ')})`);
        }
        eval(`${functionName}(${finalArgs.join(', ')})`);
        return {
          success: true,
          message: 'The function was executed',
          data: null
        };
      }
      catch (err) {
        console.error('Error while executing an action.', err);
        return {
          success: false,
          message: 'An error occurred while executing the function.',
          data: null
        };
      }
    }
    else {
      const nonce = restNonceRef.current ?? await refreshRestNonce();
      const res = await mwaiFetch(`${restUrl}/mwai-ui/v1/openai/realtime/call`, body, nonce);
      const data = await mwaiHandleRes(res, null, null, null, debugMode);
      return data;
    }
  }, [restNonce, refreshRestNonce, restUrl, debugMode]);

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
    setShortcuts([]);
    setBlocks([]);
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
      content: stream ? '' : null,
      who: rawAiName,
      timestamp: null,
      isQuerying: stream ? false : true,
      isStreaming: stream ? true : false,
      streamEvents: stream && debugMode ? [] : undefined
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
    if (previousResponseId) {
      body.previousResponseId = previousResponseId;
    }
    try {
      if (debugMode) {
        console.log('[CHATBOT] OUT: ', body);
      }
      const streamCallback = !stream ? null : (content, streamData) => {
        if (debugMode && streamData && streamData.subtype) {
          console.log('[CHATBOT] STREAM EVENT:', streamData);
        }
        setMessages(messages => {
          const freshMessages = [...messages];
          const lastMessage = freshMessages.length > 0 ? freshMessages[freshMessages.length - 1] : null;
          if (lastMessage && lastMessage.id === freshMessageId) {
            lastMessage.content = content;
            lastMessage.timestamp = new Date().getTime();
            if (streamData && streamData.subtype) {
              if (!lastMessage.streamEvents) {
                lastMessage.streamEvents = [];
              }
              lastMessage.streamEvents.push({
                ...streamData,
                timestamp: new Date().getTime()
              });
            }
          }
          return freshMessages;
        });
      };
      const nonce = restNonceRef.current ?? await refreshRestNonce();
      if (stream && debugMode && streamCallback) {
        streamCallback('', {
          type: 'event',
          subtype: 'status',
          data: 'Request sent...',
          timestamp: new Date().getTime()
        });
      }
      const handleTokenUpdate = (newToken) => {
        setRestNonce(newToken);
        restNonceRef.current = newToken;
        tokenManager.setToken(newToken);
      };
      const res = await mwaiFetch(`${restUrl}/mwai-ui/v1/chats/submit`, body, nonce, stream, undefined, handleTokenUpdate);
      const data = await mwaiHandleRes(res, streamCallback, debugMode ? "CHATBOT" : null, handleTokenUpdate, debugMode);

      if (!data.success && data.message) {
        setError(data.message);
        const updatedMessages = [ ...freshMessages ];
        const lastMsg = updatedMessages[updatedMessages.length -1];
        if (lastMsg && lastMsg.role === 'assistant' && lastMsg.content === '') {
          updatedMessages.pop();
        }
        const userMsgIdx = updatedMessages.length -1;
        if (userMsgIdx >= 0 && updatedMessages[userMsgIdx].role === 'user') {
          const userMsg = updatedMessages[userMsgIdx];
          const content = userMsg.content;
          const markdownMatch = content.match(/^(?:\!\[.*?\]\(.*?\)|\[.*?\]\(.*?\))\n(.*)$/s);
          const textToRestore = markdownMatch ? markdownMatch[1] : content;
          setInputText(textToRestore);
        }
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
      setError(err.message || 'An error occurred while processing your request. Please try again.');
      setMessages(prevMessages => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content === '') {
          return prevMessages.slice(0, -1);
        }
        return prevMessages;
      });
    }
  }, [busy, uploadedFile, messages, saveMessages, stream, botId, customId, sessionId, chatId, contextId, atts, inputText, debugMode, restNonce, refreshRestNonce, restUrl]);

  const onSubmitAction = useCallback((forcedText = null) => {
    const hasFileUploaded = !!uploadedFile?.uploadedId;
    hasFocusRef.current = chatbotInputRef.current?.currentElement && 
      document.activeElement === chatbotInputRef.current.currentElement();
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
      const nonce = restNonceRef.current ?? await refreshRestNonce();
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
  }, [iconText]);

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
      }
      else if (task.action === 'toggle') {
        setOpen((prevOpen) => !prevOpen);
      }
      else if (task.action === 'open') {
        setOpen(true);
      }
      else if (task.action === 'close') {
        setOpen(false);
      }
      else if (task.action === 'clear') {
        const { chatId } = task.data;
        onClear({ chatId });
      }
      else if (task.action === 'setContext') {
        const { chatId, messages, previousResponseId } = task.data;
        setChatId(chatId);
        setMessages(messages);
        if (previousResponseId) {
          setPreviousResponseId(previousResponseId);
        }
        setIsResumingConversation(true);
        setIsConversationLoaded(true);
        setShortcuts([]);
        saveMessages(messages);
      }
      else if (task.action === 'setShortcuts') {
        const shortcuts = task.data;
        handleShortcuts(shortcuts);
      }
      else if (task.action === 'setBlocks') {
        const blocks = task.data;
        handleBlocks(blocks);
      }
      else if (task.action === 'addBlock') {
        const block = task.data;
        setBlocks((prevBlocks) => {
          return [...prevBlocks, block];
        });
      }
      else if (task.action === 'removeBlockById') {
        const blockId = task.data;
        setBlocks((prevBlocks) => {
          return prevBlocks.filter((block) => block.id !== blockId);
        });
      }
      setTasks((prevTasks) => prevTasks.slice(1));
    }
  }, [tasks, onClear, onSubmit, setChatId, setInputText, setMessages, setOpen, handleShortcuts, handleBlocks]);

  useEffect(() => {
    runTasks();
  }, [runTasks]);

  const actions = {
    setInputText,
    saveMessages,
    setMessages,
    resetMessages,
    setError,
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
    onStartRealtimeSession,
    onRealtimeFunctionCallback,
    onCommitStats,
    onCommitDiscussions,
  };

  const state = {
    theme,
    botId,
    customId,
    userData,
    pluginUrl,
    inputText,
    messages,
    shortcuts,
    blocks,
    busy,
    error,
    setBusy,
    typewriter,
    speechRecognition,
    speechSynthesis,
    virtualKeyboardFix,
    localMemory,
    isRealtime,
    imageUpload,
    fileUpload,
    uploadedFile,
    fileSearch,
    textSend, textClear, textInputMaxLength, textInputPlaceholder, textCompliance,
    aiName, userName, guestName,
    aiAvatar, userAvatar, guestAvatar,
    aiAvatarUrl, userAvatarUrl, guestAvatarUrl,
    isWindow, copyButton, headerSubtitle, fullscreen, icon, iconText, iconAlt, iconPosition, iconBubble,
    cssVariables, iconUrl,
    chatbotInputRef,
    conversationRef,
    isMobile,
    open,
    locked,
    windowed,
    showIconMessage,
    timeElapsed,
    isListening,
    speechRecognitionAvailable,
    uploadIconPosition,
    submitButtonConf,
    draggingType,
    isBlocked,
    busyNonce,
    debugMode,
    eventLogs,
    system
  };

  return (
    <ChatbotContext.Provider value={{ state, actions }}>
      {children}
    </ChatbotContext.Provider>
  );
};