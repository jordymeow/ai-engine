// Previous: 1.5.4
// Current: 1.5.5

const { useState, useMemo, useEffect, useLayoutEffect, useRef } = wp.element;
import TextAreaAutosize from 'react-textarea-autosize';

import { useModClasses, isUrl, useChrono, formatAiName, formatUserName, processParameters } from '@app/chatbot/helpers';
import { useChatbotContext } from '@app/chatbot/ChatbotContext';
import ChatbotReply from '@app/chatbot/ChatbotReply';

const ChatbotUI = (props) => {
  const { theme, style } = props;
  const { modCss } = useModClasses(theme);
  const themeStyle = useMemo(() => theme?.type === 'css' ? theme?.style : null, [theme]);
  const { timeElapsed, startChrono, stopChrono } = useChrono();
  const inputRef = useRef();
  const conversationRef = useRef();
  const [ open, setOpen ] = useState(false);
  const [ minimized, setMinimized ] = useState(true);
  const isMobile = document.innerWidth <= 768;

  const { state, actions } = useChatbotContext();
  const { messages, inputText, textInputMaxLength, textSend, textClear, textInputPlaceholder, textCompliance, 
    isWindow, fullscreen, iconText, iconAlt, iconPosition,cssVariables, iconUrl, busy } = state;
  const { onClear, onSubmit, setInputText } = actions;

  useEffect(() => {
    if (busy) {
      startChrono();
      return;
    }
    stopChrono();
    if (isMobile) {
      inputRef.current.focus(); 
    }
  }, [busy]);

  useLayoutEffect(() => {
    conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
  }, [messages]);

  const onSubmitAction = () => {
    if (inputText.length > 0) {
      onSubmit(inputText);
      setInputText('');
    }
  };

  const baseClasses = modCss('mwai-chat', { 
    'mwai-window': isWindow,
    'mwai-open': open,
    'mwai-fullscreen': !minimized,
    'mwai-bottom-left': iconPosition === 'bottom-left',
    'mwai-top-right': iconPosition === 'top-right',
    'mwai-top-left': iconPosition === 'top-left',
  });

  const clearMode = inputText.length < 1 && messages?.length > 1;

  return (<>
    <div className={baseClasses} style={{ ...cssVariables, ...style }}>

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
            onKeyDown={event => {
              if (event.code === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                event.stopPropagation();
                onSubmitAction();
              }
            }}
            onChange={e => setInputText(e.target.value)}>
          </TextAreaAutosize>
          <button disabled={busy} onClick={clearMode ? onClear : onSubmitAction}>
            <span>{clearMode ? textClear : textSend}</span>
            {timeElapsed && <div className={modCss('mwai-timer')}>{timeElapsed}</div>}
          </button>
        </div>
        {textCompliance && <div className={modCss('mwai-compliance')}
          dangerouslySetInnerHTML={{ __html: textCompliance }}>
        </div>}
      </div>
    </div>
  </>);
};

export default ChatbotUI;