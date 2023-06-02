// Previous: 1.6.94
// Current: 1.6.98

const { useState, useMemo, useEffect, useRef } = wp.element;

import cssChatGPT from '@root/../themes/ChatGPT.module.css';
import cssMessages from '@root/../themes/Messages.module.css';

const Microphone = ({ active, disabled, style, ...rest }) => {

  const svgPath = `<path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/>`;

  const pulsarAnimation = `
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.1);
        opacity: 0.5;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `;

  const iconStyle = {
    display: "inline-block",
    width: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animation: active ? "pulse 2s infinite" : "",
    WebkitAnimation: active ? "pulse 2s infinite" : ""
  };

  return (
    <div active={active ? "true" : "false"} disabled={disabled} {...rest}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"
        dangerouslySetInnerHTML={{ __html: svgPath }}
      />
    </div>
  );
};

function useInterval(delay, callback, enabled = true) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null && enabled) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, enabled]);
}

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

function handlePlaceholders(template, guestName = 'Guest: ', userData) {
  if (!userData || Object.keys(userData).length === 0) {
    return guestName;
  }

  for (const [placeholder, value] of Object.entries(userData)) {
    let realPlaceHolder = `{${placeholder}}`;
    if (!template.includes(realPlaceHolder)) continue;
    template = template.replace(realPlaceHolder, value);
  }
  return template || guestName || "Guest: ";
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
  const localMemory = Boolean(params.localMemory);

  return { 
    textSend, textClear, textInputMaxLength, textInputPlaceholder, textCompliance,
    window, copyButton, fullscreen, localMemory,
    icon, iconText, iconAlt, iconPosition,
    aiName, userName, guestName
  };
};

const useSpeechRecognition = (onResult) => {
  const [isListening, setIsListening] = useState(false);
  const [speechRecognitionAvailable, setSpeechRecognitionAvailable] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setSpeechRecognitionAvailable(true);
    }
  }, []);

  useEffect(() => {
    if (!speechRecognitionAvailable) {
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.continuous = true;

    const handleResult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      onResult(transcript);
    };

    if (isListening) {
      recognition.addEventListener('result', handleResult);
      recognition.start();
    } else {
      recognition.removeEventListener('result', handleResult);
      recognition.abort();
    }

    return () => {
      recognition.abort();
    };
  }, [isListening, speechRecognitionAvailable]);

  return { isListening, setIsListening, speechRecognitionAvailable };
};

export { useModClasses, isUrl, randomStr, handlePlaceholders, useInterval,
  useSpeechRecognition, Microphone, useChrono, formatUserName, formatAiName, processParameters
};