// Previous: 2.0.6
// Current: 2.1.5

const { useState, useMemo, useEffect, useRef, useImperativeHandle } = wp.element;

import cssChatGPT from '@root/../themes/ChatGPT.module.css';
import cssMessages from '@root/../themes/Messages.module.css';

const svgPicturePath = `
<svg fill="none" viewBox="0 0 3335 3335" xmlns="http://www.w3.org/2000/svg">
<path d="m2834 0h-2333.9c-275.78 0-500.12 224.34-500.12 500.12v2333.9c0 275.78 224.34 500.12 500.12 500.12h2333.9c275.78 0 500.12-224.34 500.12-500.12v-2333.9c0-275.78-224.34-500.12-500.12-500.12z" fill="url(#c)"/>
<path d="m2539 1961.5c-55.51 28-122.51 42.82-193.89 42.82-148.23 0-292.47-61.05-376.72-159.38l-349.69-406.35c-116.81-136.42-281.48-214.57-451.76-214.57-170.29 0-334.96 78.15-451.6 214.41l-715.34 833.69v561.82c0 275.78 224.34 500.11 500.12 500.11h2333.9c275.78 0 500.12-224.33 500.12-500.11v-1270l-795.11 397.55z" fill="url(#b)"/>
<path d="m2333.9 1500.3c276.21 0 500.12-223.91 500.12-500.11 0-276.21-223.91-500.12-500.12-500.12-276.2 0-500.11 223.91-500.11 500.12 0 276.2 223.91 500.11 500.11 500.11z" fill="url(#a)"/>
<defs>
<linearGradient id="c" x2="3334.1" y1="1667" y2="1667" gradientUnits="userSpaceOnUse">
<stop stop-color="#BBDEFB" offset="0"/>
<stop stop-color="#64B5F6" offset="1"/>
</linearGradient>
<linearGradient id="b" x2="3334.1" y1="2279.2" y2="2279.2" gradientUnits="userSpaceOnUse">
<stop stop-color="#42A5F5" offset="0"/>
<stop stop-color="#1E88E5" offset="1"/>
</linearGradient>
<linearGradient id="a" x1="1833.8" x2="2834" y1="1000.2" y2="1000.2" gradientUnits="userSpaceOnUse">
<stop stop-color="#42A5F5" offset="0"/>
<stop stop-color="#1E88E5" offset="1"/>
</linearGradient>
</defs>
</svg>
`;

const svgFilePath = `
<?xml version="1.0" encoding="UTF-8"?>
<svg fill="none" viewBox="0 0 3335 3335" xmlns="http://www.w3.org/2000/svg">
<path d="m2834 0h-2333.9c-275.78 0-500.12 224.34-500.12 500.12v2333.9c0 275.78 224.34 500.12 500.12 500.12h2333.9c275.78 0 500.12-224.34 500.12-500.12v-2333.9c0-275.78-224.34-500.12-500.12-500.12z" fill="url(#a)"/>
<g clip-path="url(#b)" fill="#2A92EB">
<path d="m2766.1 567.92c-233.22-233.22-611.33-233.22-844.55-5e-3l-499.12 499.12c-241.24 241.25-218.91 625.64 0 844.55 36.65 36.66 77.21 66.55 120.04 91.1l91.1-91.1c59.75-59.75 38.72-129.61 37.64-180.02-13.11-9.29-25.87-19.34-37.64-31.12-112.34-112.32-117.39-304.89 0-422.27 17.43-17.44 488.53-488.53 499.11-499.11 116.44-116.45 305.83-116.45 422.27 0 116.45 116.45 116.45 305.83 0 422.27l-329.91 329.91c9.54 52.79 66.8 177.83 37.35 384.1 1.43-1.41 3.16-2.32 4.59-3.75l499.12-499.12c233.21-233.22 233.21-611.33 0-844.55z"/>
<path d="m1950.3 1383.7c-36.66-36.66-77.22-66.55-120.04-91.1l-91.09 91.1c-59.76 59.75-38.73 129.6-37.66 180.01 13.13 9.3 25.88 19.34 37.66 31.12 112.33 112.34 117.38 304.89 0 422.28-17.48 17.47-527.6 527.59-537.8 537.79-116.45 116.45-305.83 116.45-422.28 0-116.45-116.44-116.45-305.83 0-422.27l368.6-368.6c-9.54-52.79-66.8-177.83-37.34-384.1-1.44 1.41-3.17 2.34-4.61 3.76l-537.79 537.81c-233.21 233.22-233.21 611.33 0 844.55 233.22 233.21 611.33 233.21 844.55 0l537.8-537.8c236.76-236.76 223.82-620.73 0-844.55z"/>
</g>
<defs>
<linearGradient id="a" x2="3334.1" y1="1667" y2="1667" gradientUnits="userSpaceOnUse">
<stop stop-color="#BBDEFB" offset="0"/>
<stop stop-color="#64B5F6" offset="1"/>
</linearGradient>
<clipPath id="b">
<rect transform="translate(393 393)" width="2548" height="2548" fill="#fff"/>
</clipPath>
</defs>
</svg>
`;

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

const ChatUpload = React.forwardRef(({ onUploadFile, uploadedFile, disabled, style, type, ...rest }, ref) => {
  const fileInputRef = useRef();

  // uploadedFile contains .uploadedId, .uploadedUrl, .uploadProgress, and .localFile.
  // .localFile is the original file object.

  const resetUpload = () => {
    onUploadFile(null);
  };

  const handleClick = () => {
    if (uploadedFile?.localFile) {
      resetUpload();
      return;
    }
    if (!disabled) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      onUploadFile(file);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) {
      return;
    }

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      onUploadFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleExternalFile = (file) => {
    onUploadFile(file);
  };

  // Expose specific methods to parent components
  useImperativeHandle(ref, () => ({
    handleExternalFile
  }));

  return (
    <div disabled={disabled} onClick={handleClick} onDrop={handleDrop} onDragOver={handleDragOver}
      style={{ cursor: disabled ? 'default' : 'pointer', ...style }}
      {...rest}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
        dangerouslySetInnerHTML={{ __html: type === 'vision' ? svgPicturePath : svgFilePath }}
      />
      <span>
        {uploadedFile?.uploadProgress && `${Math.round(uploadedFile.uploadProgress)}%`}
      </span>
      {/* Hidden file input */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
    </div>
  );
});

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

function is_url(url) {
  return url.indexOf('http') === 0;
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
  else if (is_url(userName)) {
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
  else if (is_url(aiName)) {
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
  const imageUpload = Boolean(params.imageUpload);
  const fileUpload = Boolean(params.fileUpload);

  return { 
    textSend, textClear, textInputMaxLength, textInputPlaceholder, textCompliance,
    window, copyButton, fullscreen, localMemory, imageUpload, fileUpload,
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

    const isAndroid = /Android/i.test(navigator.userAgent);
    let lastTranscript = '';

    recognition.interimResults = true;
    recognition.continuous = true;

    const handleResult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      if (isAndroid) {
        const diff = transcript.slice(lastTranscript.length);
        lastTranscript = transcript;
        onResult(lastTranscript);
      }
      else {
        onResult(transcript);
      }
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

export { useModClasses, is_url, handlePlaceholders, useInterval,
  useSpeechRecognition, Microphone, ChatUpload, 
  useChrono, formatUserName, formatAiName, processParameters
};