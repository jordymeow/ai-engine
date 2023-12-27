// Previous: 2.0.7
// Current: 2.1.3

const { useState, useMemo, useEffect, useLayoutEffect, useRef } = wp.element;
import Markdown from 'markdown-to-jsx';

import { useModClasses, useChrono, useSpeechRecognition, Microphone, ImageUpload } from '@app/chatbot/helpers';
import { useChatbotContext } from '@app/chatbot/ChatbotContext';
import ChatbotReply from '@app/chatbot/ChatbotReply';
import { mwaiAPI } from '@app/chatbot/MwaiAPI';
import ChatbotInput from './ChatbotInput';

const markdownOptions = {
  overrides: {
    a: {
      props: {
        target: "_blank",
      },
    },
  }
};

const ChatbotUI = (props) => {
  const { theme, style } = props;
  const { timeElapsed, startChrono, stopChrono } = useChrono();
  const [ composing, setComposing ] = useState(false);
  const [ open, setOpen ] = useState(false);
  const [ minimized, setMinimized ] = useState(true);
  const { modCss } = useModClasses(theme);
  const themeStyle = useMemo(() => theme?.type === 'css' ? theme?.style : null, [theme]);
  const chatbotInputRef = useRef();
  const conversationRef = useRef();
  const hasFocusRef = useRef(false);
  const isMobile = document.innerWidth <= 768;

  const { state, actions } = useChatbotContext();
  const { botId, customId, messages, inputText, textInputMaxLength, textSend, textClear, textInputPlaceholder, 
    textCompliance, isWindow, fullscreen, iconText, iconAlt, iconPosition, cssVariables, error,
    iconUrl, busy, speechRecognition, imageUpload, uploadedImage } = state;
  const { onClear, onSubmit, setInputText, setMessages, setClientId, onImageUpload, resetError } = actions;
  const { isListening, setIsListening, speechRecognitionAvailable } = useSpeechRecognition((transcript) => {
    setInputText(() => inputText + transcript);
  });

  const isImageUploading = !!uploadedImage?.uploadProgress;

  const refState = useRef(state);
  useEffect(() => {
    refState.current = state;
  }, [ state ]);

  const [ tasks, setTasks ] = useState([]);

  const runTasks = async () => {
    if (tasks.length > 0) {
      const task = tasks[0];
      if (task.action === 'ask') {
        const { text, submit } = task.data;
        if (submit) {
          onSubmit(text);
        }
        else {
          setInputText(text);
        }
      }
      else if (task.action === 'toggle') {
        setOpen(!open);
      }
      else if (task.action === 'open') {
        setOpen(true);
      }
      else if (task.action === 'close') {
        setOpen(false);
      }
      else if (task.action === 'clear') {
        onClear();
      }
      else if (task.action === 'setContext') {
        const { chatId, messages } = task.data;
        setClientId(chatId);
        setMessages(messages);
      }
      setTasks(tasks => tasks.slice(1));
    }
  };

  useEffect(() => {
    runTasks();
  }, [tasks]);

  useEffect(() => {
    if (customId || botId) {
      mwaiAPI.chatbots.push({
        botId: botId,
        customId: customId,
        open: () => { 
          setTasks(tasks => [...tasks, { action: 'open' }]);
        },
        close: () => { 
          setTasks(tasks => [...tasks, { action: 'close' }]);
        },
        clear: () => { 
          setTasks(tasks => [...tasks, { action: 'clear' }]);
        },
        toggle: () => { 
          setTasks(tasks => [...tasks, { action: 'toggle' }]);
        },
        ask: (text, submit = false) => {
          setTasks(tasks => [...tasks, { action: 'ask', data: { text, submit } }]);
        },
        setContext: ({ chatId, messages }) => {
          setTasks(tasks => [...tasks, { action: 'setContext', data: { chatId, messages } }]);
        },
      });
    }
  }, []);

  useEffect(() => {
    if (busy) {
      startChrono();
      return;
    }
    if (!isMobile && hasFocusRef.current) {
      chatbotInputRef.current.focusInput();
    }
    stopChrono();
  }, [busy]);

  useEffect(() => {
    if (!isMobile && open) { 
      chatbotInputRef.current.focusInput();
    }
    conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
  }, [open]);

  useLayoutEffect(() => {
    conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
  }, [messages]);

  const onSubmitAction = (forcedText = null) => {
    hasFocusRef.current = document.activeElement === chatbotInputRef.current.currentElement();
    
    if (forcedText) {
      onSubmit(forcedText);
    }
    else if (inputText.length > 0) {
      onSubmit(inputText);
    }
  };

  const baseClasses = modCss('mwai-chat', { 
    'mwai-window': isWindow,
    'mwai-open': open,
    'mwai-fullscreen': !minimized || (!isWindow && fullscreen),
    'mwai-bottom-left': iconPosition === 'bottom-left',
    'mwai-top-right': iconPosition === 'top-right',
    'mwai-top-left': iconPosition === 'top-left',
  });

  const clearMode = inputText.length < 1 && messages?.length > 1;

  const onTypeText = (text) => {
    if (isListening) {
      setIsListening(false);
    }
    if (error) {
      resetError();
    }
    setInputText(text);
  };

  const onUploadFile = async (file) => {
    if (error) {
      resetError();
    }
    onImageUpload(file);
  };

  return (<>
    <div id={`mwai-chatbot-${customId || botId}`}
      className={baseClasses} style={{ ...cssVariables, ...style }}>
        
      {themeStyle && <style>{themeStyle}</style>}

      {isWindow && (<>
        <div className={modCss('mwai-open-button')}>
          {iconText && <div className={modCss('mwai-icon-text')} onClick={() => setOpen(!open)}>
            {iconText}
          </div>}
          <img width="64" height="64" alt={iconAlt} src={iconUrl} className="no-lightbox"
            onClick={() => setOpen(!open)}
          />
        </div>
        <div className={modCss('mwai-header')}>
          <div className={modCss('mwai-buttons')}>
            {fullscreen && 
              <div className={modCss('mwai-resize-button')}
                onClick={() => setMinimized(!minimized)}
              />
            }
            <div className={modCss('mwai-close-button')}
              onClick={() => setOpen(!open)}
            />
          </div>
        </div>
      </>)}

      <div className={modCss('mwai-content')}>
        <div ref={conversationRef} className={modCss('mwai-conversation')}>
          {!!messages && messages.map(message => 
            <ChatbotReply key={message.id} conversationRef={conversationRef} message={message} />
          )}
        </div>
        {error && <div className={modCss('mwai-error')} onClick={() => resetError()}>
          <Markdown options={markdownOptions}>{error}</Markdown>
        </div>}
        <div className={modCss('mwai-input')}>
          <ChatbotInput 
            ref={chatbotInputRef}
            onTypeText={onTypeText}
            onSubmitAction={onSubmitAction}
            onUploadFile={onUploadFile}
            inputText={inputText}
            textInputMaxLength={textInputMaxLength}
            textInputPlaceholder={textInputPlaceholder}
            busy={busy}
            isListening={isListening}
            setIsListening={setIsListening}
            speechRecognitionAvailable={speechRecognitionAvailable}
            speechRecognition={speechRecognition}
            uploadedImage={uploadedImage}
            composing={composing}
            setComposing={setComposing}
            modCss={modCss}
            imageUpload={imageUpload}
          />
          {busy && <button disabled className={modCss('mwai-busy')}>
            {timeElapsed && <div className={modCss('mwai-timer')}>{timeElapsed}</div>}
          </button>}
          {!busy && <button disabled={isImageUploading} onClick={() => { 
            if (isListening) {
              setIsListening(false);
            }
            if (clearMode) {
              onClear();
            }
            else {
              onSubmitAction();
            }
          }}>
            <span>{clearMode ? textClear : textSend}</span>
          </button>}
        </div>
        {textCompliance && <div className={modCss('mwai-compliance')}
          dangerouslySetInnerHTML={{ __html: textCompliance }}>
        </div>}
      </div>
    </div>
  </>);
};

export default ChatbotUI;