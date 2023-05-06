// Previous: 1.6.66
// Current: 1.6.70

const { useState, useMemo, useEffect, useLayoutEffect, useRef } = wp.element;
import TextAreaAutosize from 'react-textarea-autosize';

import { useModClasses, useChrono, useSpeechRecognition, Microphone } from '@app/chatbot/helpers';
import { useChatbotContext } from '@app/chatbot/ChatbotContext';
import ChatbotReply from '@app/chatbot/ChatbotReply';
import { mwaiAPI } from '@app/chatbot/MwaiAPI';

const ChatbotUI = (props) => {
  const { theme, style } = props;
  const { timeElapsed, startChrono, stopChrono } = useChrono();
  const [ composing, setComposing ] = useState(false);
  const [ open, setOpen ] = useState(false);
  const [ minimized, setMinimized ] = useState(true);
  const { modCss } = useModClasses(theme);
  const themeStyle = useMemo(() => theme?.type === 'css' ? theme?.style : null, [theme]);
  const inputRef = useRef();
  const conversationRef = useRef();
  const hasFocusRef = useRef(false);
  const isMobile = document.innerWidth <= 768;

  const { state, actions } = useChatbotContext();
  const { chatId, messages, inputText, textInputMaxLength, textSend, textClear, textInputPlaceholder, 
    textCompliance, isWindow, fullscreen, iconText, iconAlt, iconPosition, cssVariables,
    iconUrl, busy, speechRecognition } = state;
  const { onClear, onSubmit, setInputText } = actions;
  const { isListening, setIsListening, speechRecognitionAvailable } = useSpeechRecognition((transcript) => {
    setInputText(() => inputText + transcript);
  });

  useEffect(() => {
    mwaiAPI.open = () => setOpen(true);
    mwaiAPI.close = () => setOpen(false);
    mwaiAPI.toggle = () => setOpen(!open);
  });

  useEffect(() => {
    if (busy) {
      startChrono();
      return;
    }
    if (!isMobile && hasFocusRef.current) {
      inputRef.current.focus();
    }
    stopChrono();
  }, [busy]);

  useEffect(() => {
    if (!isMobile && open) { 
      inputRef.current.focus();
    }
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [open]);

  useLayoutEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmitAction = (forcedText = null) => {
    hasFocusRef.current = document.activeElement === inputRef.current;
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
    setInputText(text);
  };

  return (<>
    <div id={`mwai-chatbot-${chatId}`} className={baseClasses} style={{ ...cssVariables, ...style }}>

      {themeStyle && <style>{themeStyle}</style>}

      {isWindow && (<>
        <div className={modCss('mwai-open-button')}>
          {iconText && <div className={modCss('mwai-icon-text')}>{iconText}</div>}
          <img width="64" height="64" alt={iconAlt} src={iconUrl}
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
        <div className={modCss('mwai-input')}>
          <div className={modCss('mwai-input-text')}>
            <TextAreaAutosize ref={inputRef} disabled={busy} placeholder={textInputPlaceholder}
              value={inputText} maxLength={textInputMaxLength}
              onCompositionStart={() => setComposing(true)}
              onCompositionEnd={() => setComposing(false)}
              onKeyDown={event => {
                if (composing) {
                  return;
                }
                if (event.code === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  event.stopPropagation();
                  onSubmitAction();
                }
              }}
              onChange={e => onTypeText(e.target.value)}>
            </TextAreaAutosize>
            {speechRecognition && !isMobile && (<div>
              <Microphone active={isListening} disabled={!speechRecognitionAvailable || busy}
                className={modCss('mwai-microphone')}
                onClick={() => setIsListening(!isListening)}
              />
            </div>)}
          </div>
          {busy && <button disabled>
            {timeElapsed && <div className={modCss('mwai-timer')}>{timeElapsed}</div>}
          </button>}
          {!busy && <button disabled={busy} onClick={() => { 
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