// Previous: none
// Current: 1.4.7

const { useState, useMemo, useEffect, useLayoutEffect, useRef } = wp.element;
import TextAreaAutosize from 'react-textarea-autosize';

import { useModClasses, isUrl, useChrono, formatAiName, formatUserName, processParameters } from '@app/chatbot/helpers';
import { useChatbotContext } from '@app/chatbot/ChatbotContext';
import ChatbotReply from '@app/chatbot/ChatbotReply';

const ChatbotUI = (props) => {
  const { system, params, theme, style } = props;
  const { timeElapsed, startChrono, stopChrono } = useChrono();
  const inputRef = useRef();
  const conversationRef = useRef();
  const [ open, setOpen ] = useState(false);
  const [ minimized, setMinimized ] = useState(true);
  const shortcodeStyles = theme?.settings || {};
  const { modCss } = useModClasses(theme);
  const isMobile = document.innerWidth <= 768;

  const { state, actions } = useChatbotContext({ system, params, theme, style });
  const { messages, busy, inputText, userData, pluginUrl  } = state;
  const { onClear, onSubmit, setInputText } = actions;

  useEffect(() => {
    if (busy) {
      startChrono();
      return;
    }
    stopChrono();
    if (!isMobile) {
      inputRef.current.focus(); 
    }
  }, [busy]);

  let { textSend, textClear, textInputMaxLength, textInputPlaceholder, textCompliance, aiName, userName, guestName,
    window: isWindow, copyButton, fullscreen, icon, iconText, iconAlt, iconPosition } = processParameters(params);
  const themeStyle = useMemo(() => theme?.type === 'css' ? theme?.style : null, [theme]);
  const { cssVariables, iconUrl } = useMemo(() => {
    const iconUrl = icon ? (isUrl(icon) ? icon : pluginUrl + '/images/' + icon) : pluginUrl + '/images/chat-green.svg';
    const cssVariables = Object.keys(shortcodeStyles).reduce((acc, key) => {
      acc[`--mwai-${key}`] = shortcodeStyles[key];
      return acc;
    }, {});
    return { cssVariables, iconUrl };
  }, [icon, pluginUrl, shortcodeStyles]);
  aiName = formatAiName(aiName, pluginUrl, iconUrl, modCss);
  userName = formatUserName(userName, guestName, userData, pluginUrl, modCss);

  useLayoutEffect(() => {
    conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
  }, [messages]);

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
            <ChatbotReply key={message.id} copyButton={copyButton} modCss={modCss}
              message={message} aiName={aiName} userName={userName}
            />
          )}
        </div>
        <div className={modCss('mwai-input')}>
          <TextAreaAutosize ref={inputRef} disabled={busy} placeholder={textInputPlaceholder}
            value={inputText} maxLength={textInputMaxLength}
            onKeyUp={event => {
              if (event.code === 'Enter' && inputText && !event.shiftKey) {
                event.preventDefault();
                onSubmit();
              }
            }}
            onChange={e => setInputText(e.target.value)}>
          </TextAreaAutosize>
          <button disabled={busy} onClick={clearMode ? onClear : onSubmit}>
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