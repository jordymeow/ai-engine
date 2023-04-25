// Previous: 1.6.3
// Current: 1.6.5

const { useState, useMemo, useEffect, useLayoutEffect, useRef } = wp.element;
import TextAreaAutosize from 'react-textarea-autosize';

import { useModClasses, useChrono } from '@app/chatbot/helpers';
import { useChatbotContext } from '@app/chatbot/ChatbotContext';
import ChatbotReply from '@app/chatbot/ChatbotReply';
import { mwaiAPI } from '@app/chatbot/MwaiAPI';

const ChatbotUI = (props) => {
  const { theme, style } = props;
  const { modCss } = useModClasses(theme);
  const themeStyle = useMemo(() => theme?.type === 'css' ? theme?.style : null, [theme]);
  const { timeElapsed, startChrono, stopChrono } = useChrono();
  const [ composing, setComposing ] = useState(false);
  const inputRef = useRef();
  const conversationRef = useRef();
  const [ open, setOpen ] = useState(false);
  const [ minimized, setMinimized ] = useState(true);
  const isMobile = document.innerWidth <= 768;

  const { state, actions } = useChatbotContext();
  const { chatId, messages, inputText, textInputMaxLength, textSend, textClear, textInputPlaceholder, textCompliance, 
    isWindow, fullscreen, iconText, iconAlt, iconPosition,cssVariables, iconUrl, busy } = state;
  const { onClear, onSubmit, setInputText } = actions;

  useEffect(() => {
    mwaiAPI.open = () => setOpen(true);
    mwaiAPI.close = () => setOpen(false);
    mwaiAPI.toggle = () => setOpen(!open);
  }, []);

  useEffect(() => {
    if (busy) {
      startChrono();
      return;
    }
    stopChrono();
    if (!isMobile) {
      inputRef.current.focus(); 
    }
  }, [busy, isMobile]);

  useLayoutEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages, conversationRef]);

  const onSubmitAction = (forcedText = null) => {
    if (forcedText !== null && forcedText !== undefined) {
      onSubmit(forcedText);
    } else if (inputText && inputText.length > 0) {
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

  const clearMode = inputText.length < 1 && messages && messages.length > 1;

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
            onChange={e => setInputText(e.target.value)}>
          </TextAreaAutosize>
          {busy && <button disabled>
            {timeElapsed && <div className={modCss('mwai-timer')}>{timeElapsed}</div>}
          </button>}
          {!busy && <button disabled={busy} onClick={clearMode ? onClear : onSubmitAction}>
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