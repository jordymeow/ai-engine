// Previous: 1.4.1
// Current: 1.4.2

const { useState, useMemo, useEffect, useCallback, useRef } = wp.element;
import cssChatGPT from '@root/../themes/chatGPT.module.css';
import cssIOSDark from '@root/../themes/iOSDark.module.css';

const useModClasses = (theme) => {
  const modCss = useMemo(() => {
    return (classNames, conditionalClasses) => {
      let cssTheme = cssChatGPT;

      if (!theme || theme.themeId === 'none' || theme.type === 'css') {
        cssTheme = null;
      }
      if (theme?.themeId === 'iosdark') {
        cssTheme = cssIOSDark;
      }

      if (!Array.isArray(classNames)) {
        classNames = [classNames];
      }
      if (conditionalClasses) {
        Object.entries(conditionalClasses).forEach(([className, condition]) => {
          if (condition) { classNames.push(className); }
        });
      }

      return classNames.map(className => {
        if (!cssTheme) {
          return className;
        }
        else if (cssTheme[className]) {
          return `${className} ${cssTheme[className]}`;
        }
        else {
          console.warn(`The class name "${className}" is not defined in the CSS theme.`);
          return className;
        }
      }).join(' ');
    };
  }, [theme]);

  return { modCss };
};

function isUrl(url) {
  return url.indexOf('http') === 0;
}

function randomStr() {
  return Math.random().toString(36).substring(2);
}

function handlePlaceholders(data, guestName = 'Guest: ', userData) {
  if (Object.keys(userData).length === 0) {
    return data;
  }
  for (const [placeholder, value] of Object.entries(userData)) {
    let realPlaceHolder = `{${placeholder}}`;
    if (!data.includes(realPlaceHolder)) continue;
    data = data.replace(realPlaceHolder, value);
  }
  return data || guestName;
}

function useChrono() {
  const [timeElapsed, setTimeElapsed] = useState(null);
  const intervalIdRef = useRef(null);

  function startChrono() {
    if (intervalIdRef.current !== null) return;

    const startTime = Date.now();
    intervalIdRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      setTimeElapsed(formatTime(elapsedSeconds));
    }, 500);
  }

  function stopChrono() {
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = null;
    setTimeElapsed(null);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  useEffect(() => {
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, []);

  return { timeElapsed, startChrono, stopChrono };
}

const Chatbot = (props) => {
  const { system, params, theme, style } = props;
  const [ messages, setMessages ] = useState([]);
  const [ busy, setBusy ] = useState(false);
  const { timeElapsed, startChrono, stopChrono } = useChrono();
  const inputRef = useRef();

  const [ clientId, setClientId ] = useState(randomStr());
  const [ inputText, setInputText ] = useState('');
  const [ open, setOpen ] = useState(false);
  const [ minimized, setMinimized ] = useState(true);
  const shortcodeStyles = theme?.settings || {};
  const { modCss } = useModClasses(theme);
  const isMobile = document.innerWidth <= 768;

  const chatId = params.chatId || system.chatId;
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

  function formatUserName(userName, guestName = 'Guest: ', userData, pluginUrl) {
    if (!userName) {
      if (userData) {
        userName = <div className={modCss(['mwai-avatar'])}>
          <img src={userData.AVATAR_URL} />
        </div>;
      }
      else {
        userName = <div className={modCss(['mwai-avatar', 'mwai-svg'])}>
          <img src={`${pluginUrl}/images/avatar-user.svg`} />
        </div>;
      }
    }
    else if (isUrl(userName)) {
      userName = <div className={modCss(['mwai-avatar'])}>
        <img src={userName} />
      </div>;
    }
    else {
      userName = handlePlaceholders(userName, guestName, userData);
      userName = <div className={modCss(['mwai-name-text'])}>{userName}</div>;
    }
    return userName;
  }
  
  function formatAiName(aiName, pluginUrl, iconUrl) {
    if (!aiName) {
      let avatar = iconUrl ? iconUrl : `${pluginUrl}/images/chat-openai.svg`;
      aiName = <div className={modCss(['mwai-avatar'])}>
        <img src={`${avatar}`} />
      </div>;
    }
    else if (isUrl(aiName)) {
      aiName = <div className={modCss('mwai-avatar')}><img src={aiName} /></div>;
    }
    else {
      aiName = <div className={modCss('mwai-name-text')}>{aiName}</div>;
    }
    return aiName;
  }

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

  aiName = formatAiName(aiName, pluginUrl, iconUrl);
  userName = formatUserName(userName, guestName, userData, pluginUrl);
  const rawAiName = 'AI: ';
  const rawUserName = 'User: ';

  useEffect(() => {
    initChatbot();
  }, []);

  const initChatbot = useCallback(() => {
    var chatHistory = [];
    resetMessages();
  });

  const resetMessages = () => {
    if (startSentence) {
      setMessages((messages) => [{
        id: randomStr(),
        role: 'assistant',
        content: startSentence,
        who: rawAiName,
        html: startSentence,
        timestamp: new Date().getTime(),
      }]);
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
  }

  const onKeyUp = (event) => {
  }

  const onSubmit = () => {
    setBusy(true);
    startChrono();
    setMessages((messages) => [...messages, {
      id: randomStr(),
      role: 'user',
      content: inputText,
      who: rawUserName,
      html: inputText,
      timestamp: new Date().getTime(),
    }]);

    const data = {
      chatId: chatId,
      session: sessionId,
      clientId: clientId,
      messages: messages,
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
        setMessages((messages) => [...messages, {
          id: randomStr(),
          role: 'system',
          content: data.message,
          who: rawAiName,
          html: data.message,
          timestamp: new Date().getTime(),
        }]);
      }
      else {
        let html = data.images ? data.images : data.html;
        setMessages((messages) => [...messages, {
          id: randomStr(),
          role: 'assistant',
          content: data.answer,
          who: rawAiName,
          html: html,
          timestamp: new Date().getTime(),
        }]);
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
        <div className={modCss('mwai-conversation')}>

          {messages.map(message => 
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
        {textCompliance && <div className={modCss('mwai-compliance')}>
          {textCompliance}
        </div>}
      </div>
    </div>
  </>);
};

export default Chatbot;