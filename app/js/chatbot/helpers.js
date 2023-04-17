// Previous: 1.4.8
// Current: 1.5.2

const { useState, useMemo, useEffect, useRef } = wp.element;

import cssChatGPT from '@root/../themes/ChatGPT.module.css';
import cssMessages from '@root/../themes/Messages.module.css';

const useModClasses = (theme) => {
  const modCss = useMemo(() => {
    return (classNames, conditionalClasses) => {
      let cssTheme = cssChatGPT;

      if (!theme || theme.themeId === 'none' || theme.type === 'css') {
        cssTheme = null;
      }

      if (theme?.themeId === 'messages') {
        cssTheme = cssMessages;
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
          console.warn(`The class name "${className}" is not defined in the "${theme?.themeId ?? "N/A"}" theme.`);
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
  if (!userData || Object.keys(userData).length === 0) {
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

function formatUserName(userName, guestName = 'Guest: ', userData, pluginUrl, modCss) {
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

function formatAiName(aiName, pluginUrl, iconUrl, modCss) {
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

const processParameters = (params) => {
  const guestName = params.guestName?.trim() ?? "";
  const textSend = params.textSend?.trim() ?? "";
  const textClear = params.textClear?.trim() ?? "";
  const textInputMaxLength = parseInt(params.textInputMaxLength);
  const textInputPlaceholder = params.textInputPlaceholder?.trim() ?? "";
  const textCompliance = params.textCompliance?.trim() ?? "";
  const window = Boolean(params.window);
  const copyButton = Boolean(params.copyButton);
  const fullscreen = Boolean(params.fullscreen);
  const icon = params.icon?.trim() ?? "";
  const iconText = params.iconText?.trim() ?? "";
  const iconAlt = params.iconAlt?.trim() ?? "";
  const iconPosition = params.iconPosition?.trim() ?? "";
  const aiName = params.aiName?.trim() ?? "";
  const userName = params.userName?.trim() ?? "";

  return { 
    textSend, textClear, textInputMaxLength, textInputPlaceholder, textCompliance,
    window, copyButton, fullscreen,
    icon, iconText, iconAlt, iconPosition,
    aiName, userName, guestName
  };
};