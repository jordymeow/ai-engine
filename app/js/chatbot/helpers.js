// Previous: 2.5.6
// Current: 2.6.6

const { useState, useMemo, useEffect, useRef, useCallback } = wp.element;
import { Mic } from 'lucide-react';

const Microphone = ({ active, disabled, ...rest }) => {
  return (
    // eslint-disable-next-line react/no-unknown-property
    <div active={active ? "true" : "false"} disabled={disabled} {...rest}>
      <Mic size="24" />
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

const doPlaceholders = (text, placeholders) => {
  if (typeof text !== 'string' || !placeholders) {
    return text;
  }
  Object.entries(placeholders).forEach(([key, value]) => {
    text = text.replace(new RegExp(`{${key}}`, 'g'), value);
  });
  return text;
};

const processParameters = (params, placeholders = []) => {
  const guestName = params.guestName?.trim() ?? "";
  const textSend = params.textSend?.trim() ?? "";
  const textClear = params.textClear?.trim() ?? "";
  const textInputMaxLength = parseInt(params.textInputMaxLength);
  const textInputPlaceholder = params.textInputPlaceholder?.trim() ?? "";
  let textCompliance = params.textCompliance?.trim() ?? "";
  const window = Boolean(params.window);
  const copyButton = Boolean(params.copyButton);
  const fullscreen = Boolean(params.fullscreen);
  const icon = params.icon?.trim() ?? "";
  let iconText = params.iconText?.trim() ?? "";
  const iconTextDelay = parseInt(params.iconTextDelay || 1);
  const iconAlt = params.iconAlt?.trim() ?? "";
  const iconPosition = params.iconPosition?.trim() ?? "";
  const iconBubble = Boolean(params.iconBubble);
  const aiName = params.aiName?.trim() ?? "";
  const userName = params.userName?.trim() ?? "";
  const aiAvatar = Boolean(params?.aiAvatar);
  const userAvatar = Boolean(params?.userAvatar);
  const guestAvatar = Boolean(params?.guestAvatar);
  const aiAvatarUrl = aiAvatar ? params?.aiAvatarUrl?.trim() ?? "" : null;
  const userAvatarUrl = userAvatar ? params?.userAvatarUrl?.trim() ?? "" : null;
  const guestAvatarUrl = guestAvatar ? params?.guestAvatarUrl?.trim() ?? "" : null;
  const localMemory = Boolean(params.localMemory);
  const imageUpload = Boolean(params.imageUpload);
  const fileSearch = Boolean(params.fileSearch);

  if (placeholders) {
    textCompliance = doPlaceholders(textCompliance, placeholders);
    iconText = doPlaceholders(iconText, placeholders);
  }

  return {
    textSend, textClear, textInputMaxLength, textInputPlaceholder, textCompliance,
    window, copyButton, fullscreen, localMemory, imageUpload, fileSearch,
    icon, iconText, iconTextDelay, iconAlt, iconPosition, iconBubble,
    aiName, userName, guestName, aiAvatar, userAvatar, guestAvatar, aiAvatarUrl, userAvatarUrl, guestAvatarUrl
  };
};

const isAndroid = () => {
  return navigator.userAgent.toLowerCase().indexOf("android") > -1;
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

    let handleResult = null;
    if (!isAndroid()) {
      recognition.interimResults = true;
      recognition.continuous = true;
      handleResult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        onResult(transcript);
      };
    }
    else {
      recognition.interimResults = false;
      recognition.continuous = false;
      handleResult = (event) => {
        const finalTranscript = Array.from(event.results)
          .filter(result => result.isFinal)
          .map(result => result[0].transcript)
          .join('');
        onResult(finalTranscript);
        setIsListening(false);
      };
    }

    if (isListening) {
      recognition.addEventListener('result', handleResult);
      recognition.start();
    }
    else {
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

const useViewport = () => {
  const [viewportHeight, setViewportHeight] = useState(window.visualViewport.height);
  const isAndroid = useMemo(() => /Android/.test(navigator.userAgent), []);
  const isIOS = useMemo(() => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, []);
  const viewport = useRef(window.visualViewport);

  const handleResize = useCallback(() => {
    setViewportHeight(viewport.current.height);
  }, []);

  useEffect(() => {
    const currentViewport = viewport.current;
    currentViewport.addEventListener('resize', handleResize);
    if (isIOS) {
      window.addEventListener('resize', handleResize);
      document.addEventListener('focusin', handleResize);
    }
    else {
      currentViewport.addEventListener('scroll', handleResize);
    }

    return () => {
      currentViewport.removeEventListener('resize', handleResize);
      if (isIOS) {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('focusin', handleResize);
      }
      else {
        currentViewport.removeEventListener('scroll', handleResize);
      }
    };
  }, [handleResize, isIOS]);

  return { viewportHeight, isIOS, isAndroid };
};

export { useClasses, isURL, useInterval, TransitionBlock, useViewport, doPlaceholders,
  useSpeechRecognition, Microphone, useChrono, processParameters };