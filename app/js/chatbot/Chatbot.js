// Previous: 1.4.4
// Current: 1.4.5

const { useState, useMemo, useEffect, useLayoutEffect, useCallback, useRef } = wp.element;
import { useModClasses, isUrl, randomStr, handlePlaceholders, useChrono } from '@app/chatbot/helpers';
import { formatAiName, formatUserName } from './helpers';

const ThinkingEffect = (props) => {
  const { theme, style, active } = props;
  const { modCss } = useModClasses(theme);
  if  (!active) {
    return null;
  }
  return <div className={modCss('mwai-thinking-effect')}>
    I am thinking...
  </div>;
};

const Chatbot = (props) => {
  const { system, params, theme, style } = props;
  const [ messages, setMessages ] = useState([]);
  const [ busy, setBusy ] = useState(false);
  const { timeElapsed, startChrono, stopChrono } = useChrono();
  const inputRef = useRef();
  const conversationRef = useRef();

  const [ clientId, setClientId ] = useState(randomStr());
  const [ inputText, setInputText ] = useState('');
  const [ open, setOpen ] = useState(false);
  const [ minimized, setMinimized ] = useState(true);
  const shortcodeStyles = theme?.settings || {};
  const { modCss } = useModClasses(theme);
  const isMobile = window.innerWidth <= 768;

  const chatId = params.chatId || system.chatId || params.id || system.id;
  const safeChatId = chatId?.replace(/[^a-zA-Z0-9]/g, '');
  const userData = system.userData;
  const sessionId = system.sessionId;
  const restNonce = system.restNonce;
  const pluginUrl = system.pluginUrl;
  const restUrl = system.restUrl;
  const debugMode = system.debugMode; 
  const typewriter = system?.typewriter ?? false;

  let guestName = params.guestName?.trim() ?? "";
  let textSend = params.textSend?.trim() ?? "";
  let textClear = params.textClear?.trim() ?? "";
  let textInputMaxLength = parseInt(params.textInputMaxLength);
  let textInputPlaceholder = params.textInputPlaceholder?.trim() ?? "";
  let textCompliance = params.textCompliance?.trim() ?? "";
  let startSentence = params.startSentence?.trim() ?? "";
  let window = Boolean(params.window);
  let copyButton = Boolean(params.copyButton);
  let fullscreen = Boolean(params.fullscreen);
  let icon = params.icon?.trim() ?? "";
  let iconText = params.iconText?.trim() ?? "";
  let iconAlt = params.iconAlt?.trim() ?? "";
  let iconPosition = params.iconPosition?.trim() ?? "";
  let aiName = params.aiName?.trim() ?? "";
  let userName = params.userName?.trim() ?? "";

  const themeStyle = useMemo(() => {
    if (theme?.type === 'css') {
      return theme?.style;
    }
    return null;
  }, [theme]);

  const { cssVariables, iconUrl } = useMemo(() => {
    let cssVariables = {};
    let iconUrl = pluginUrl + '/images/chat-green.svg';
    if (icon) {
      iconUrl = isUrl(icon) ? icon : pluginUrl + '/images/' + icon;
    }
    for (let key in shortcodeStyles) {
      cssVariables[`--mwai-${key}`] = shortcodeStyles[key];
    }
    return { cssVariables, iconUrl };
  }, [icon, pluginUrl, shortcodeStyles]);

  aiName = formatAiName(aiName, pluginUrl, iconUrl, modCss);
  userName = formatUserName(userName, guestName, userData, pluginUrl, modCss);
  const rawAiName = 'AI: ';
  const rawUserName = 'User: ';

  useLayoutEffect(() => {
    if(conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages]);

  const saveMessages = useCallback((messages) => {
    localStorage.setItem(`mwai-chat-${chatId}`, JSON.stringify({
      clientId: clientId,
      messages: messages
    }));
  }, [clientId, chatId]);

  const initChatbot = useCallback(() => {
    let chatHistory = localStorage.getItem(`mwai-chat-${chatId}`);
    if (chatHistory) {
      chatHistory = JSON.parse(chatHistory);
      setMessages(chatHistory.messages);
      return;
    }
    resetMessages();
  }, [chatId]);

  useEffect(() => {
    initChatbot();
  }, [chatId]);

  const resetMessages = () => {
    if (startSentence) {
      const freshMessages = [{
        id: randomStr(),
        role: 'assistant',
        content: startSentence,
        who: rawAiName,
        html: startSentence,
        timestamp: new Date().getTime(),
      }];
      setMessages(freshMessages);
    }
    else {
      setMessages([]);
    }
  };

  const onClear = () => {
    setClientId(randomStr());
    localStorage.removeItem(`mwai-chat-${chatId}`);
    resetMessages();
    setInputText('');
  };

  const onKeyPress = (event) => {
    if (event.charCode === 13 && !inputText && !event.shiftKey) {
      event.preventDefault();
      return;
    }
    if (event.charCode === 13 && inputText && !event.shiftKey) {
      onSubmit();
      event.preventDefault();
    }
  }

  const onKeyDown = (event) => {
    // Placeholder for potential future logic
  }

  const onKeyUp = (event) => {
    // Placeholder for potential future logic
  }

  const onSubmit = () => {
    setBusy(true);
    startChrono();
    const currentMessages = [...messages];
    const newUserMessage = {
      id: randomStr(),
      role: 'user',
      content: inputText,
      who: rawUserName,
      html: inputText,
      timestamp: new Date().getTime(),
    };
    currentMessages.push(newUserMessage);
    setMessages(currentMessages);
    saveMessages(currentMessages);

    const data = {
      chatId: chatId,
      session: sessionId,
      clientId: clientId,
      messages: currentMessages,
      newMessage: inputText,
    };

    if (debugMode) {
      console.log('[BOT] Sent: ', data);
    }
    fetch(`${restUrl}/mwai-bot/v1/chat`, { method: 'POST', headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': restNonce,
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (debugMode) {
        console.log('[BOT] Recv: ', data);
      }
      if (!data.success) {
        let lastMessages = [...messages];
        lastMessages.pop();
        setMessages((prevMessages) => {
          let freshMessages = [...prevMessages];
          freshMessages.pop();
          freshMessages.push({
            id: randomStr(),
            role: 'system',
            content: data.message,
            who: rawAiName,
            html: data.message,
            timestamp: new Date().getTime(),
          });
          saveMessages(freshMessages);
          return freshMessages;
        });
      }
      else {
        let htmlContent = data.images ? data.images : data.html;
        setMessages(prevMessages => {
          let freshMessages = [...prevMessages, {
            id: randomStr(),
            role: 'assistant',
            content: data.answer,
            who: rawAiName,
            html: htmlContent,
            timestamp: new Date().getTime(),
          }];
          saveMessages(freshMessages);
          return freshMessages;
        });
      }
      setBusy(false);
      stopChrono();

      if (!isMobile) {
        inputRef.current.focus(); 
      }
    })
    .catch(error => {
      console.error(error);
      setBusy(false);
      stopChrono();
    });
    setInputText('');
  };

  const baseClasses = modCss('mwai-chat', { 
    'mwai-window': window,
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

      {window && (<>
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
            <div 
              className={modCss('mwai-reply', { 
                'mwai-ai': message.role === 'assistant',
                'mwai-user': message.role === 'user'
              })}>
              <span className={modCss('mwai-name')}>
                  {message.role === 'assistant' && aiName}
                  {message.role === 'user' && userName}
              </span>
              <span className={modCss('mwai-text')}
                dangerouslySetInnerHTML={{ __html: message.html }}>
              </span>
              {copyButton && <div className={modCss('mwai-copy-button')}>
                <div className={modCss('mwai-copy-button-one')}></div>
                <div className={modCss('mwai-copy-button-two')}></div>
              </div>}
            </div>
          )}

        </div>
        <div className={modCss('mwai-input')}>
          <textarea
            ref={inputRef}
            disabled={busy} rows="1" maxLength={textInputMaxLength}
            placeholder={textInputPlaceholder} value={inputText}
            onKeyPress={onKeyPress}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onChange={e => setInputText(e.target.value)}>
          </textarea>
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

export default Chatbot;