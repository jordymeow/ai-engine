// Previous: 2.3.9
// Current: 2.4.5

const { useState, useMemo, useEffect, useRef } = wp.element;

const Microphone = ({ active, disabled, ...rest }) => {
  const svgPath = `<path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/>`;

  return (
    // eslint-disable-next-line react/no-unknown-property
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
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, enabled]);
}

const useClasses = () => {
  return useMemo(() => {
    return (classNames, conditionalClasses) => {
      if (!Array.isArray(classNames)) {
        classNames = [classNames];
      }
      if (conditionalClasses) {
        Object.entries(conditionalClasses).forEach(([className, condition]) => {
          if (condition) { classNames.push(className); }
        });
      }
      return classNames.join(' ');
    };
  }, []);
};

function isURL(url) {
  if (!url || typeof url !== 'string') return false;
  return url.indexOf('http') === 0;
}

function handlePlaceholders(template, guestName = 'Guest: ', userData) {
  if (!userData || Object.keys(userData).length === 0) {
    return guestName;
  }

  for (const [placeholder, value] of Object.entries(userData)) {
    const realPlaceHolder = `{${placeholder}}`;
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

function formatAvatar(aiName, pluginUrl, iconUrl) {
  if (isURL(aiName)) {
    aiName = <div className="mwai-avatar">
      <img alt="AI Engine" src={aiName} />
    </div>;
  }
  else {
    const avatar = iconUrl ? iconUrl : `${pluginUrl}/images/chat-openai.svg`;
    aiName = <div className="mwai-avatar">
      <img alt="AI Engine" src={`${avatar}`} />
    </div>;
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
  const iconTextDelay = parseInt(params.iconTextDelay || 1);
  const iconAlt = params.iconAlt?.trim() ?? "";
  const iconPosition = params.iconPosition?.trim() ?? "";
  const iconBubble = Boolean(params.iconBubble);
  const aiName = params.aiName?.trim() ?? "";
  const userName = params.userName?.trim() ?? "";
  const aiAvatar = params.aiAvatar?.trim() ?? "";
  const userAvatar = params.userAvatar?.trim() ?? "";
  const localMemory = Boolean(params.localMemory);
  const imageUpload = Boolean(params.imageUpload);
  const fileSearch = Boolean(params.fileSearch);

  return {
    textSend, textClear, textInputMaxLength, textInputPlaceholder, textCompliance,
    window, copyButton, fullscreen, localMemory, imageUpload, fileSearch,
    icon, iconText, iconTextDelay, iconAlt, iconPosition, iconBubble,
    aiName, aiAvatar, userName, userAvatar, guestName
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

const TransitionBlock = ({ if: condition, className, disableTransition = false, children, ...rest }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [animationClass, setAnimationClass] = useState('mwai-transition');

  useEffect(() => {
    if (disableTransition) {
      setShouldRender(condition);
    }
    else {
      if (condition) {
        setShouldRender(true);
        setTimeout(() => {
          setAnimationClass('mwai-transition mwai-transition-visible');
        }, 150);
      } else {
        setAnimationClass('mwai-transition');
      }
    }
  }, [condition, disableTransition]);

  const handleTransitionEnd = () => {
    if (animationClass === 'mwai-transition' && !disableTransition) {
      setShouldRender(false);
    }
  };

  return !shouldRender ? null : (
    <div className={`${className} ${disableTransition ? '' : animationClass}`}
      onTransitionEnd={handleTransitionEnd} {...rest}>
      {children}
    </div>
  );
};

export { useClasses, isURL, handlePlaceholders, useInterval, TransitionBlock, formatAvatar,
  useSpeechRecognition, Microphone, useChrono, processParameters };