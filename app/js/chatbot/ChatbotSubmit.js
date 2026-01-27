// Previous: 3.0.0
// Current: 3.3.3

// React & Vendor Libs
const { useMemo, useCallback } = wp.element;
import { Send, SendHorizontal, Eraser, ArrowUp } from 'lucide-react';

import { useChatbotContext } from "./ChatbotContext";

const ChatbotSubmit = () => {
  const { state, actions } = useChatbotContext();
  const { onClear, onSubmitAction, setIsListening } = actions;
  const { textClear, textSend, uploadedFile, uploadedFiles, inputText, messages,
    isListening, timeElapsed, busy, submitButtonConf, locked, theme } = state;

  const isFileUploading = !!uploadedFile?.uploadProgress;
  const hasFileUploaded = !!uploadedFile?.uploadedId;
  const hasMultiFiles = uploadedFiles && uploadedFiles.length > 0;
  const clearMode = !hasFileUploaded && !hasMultiFiles && inputText.length < 1 && messages?.length > 1;
  const hasContent = inputText.length > 0 || hasFileUploaded || hasMultiFiles;

  const isChatGPTTheme = theme?.themeId === 'chatgpt';

  const buttonContent = useMemo(() => {
    if (busy) {
      return timeElapsed ? <div className="mwai-timer">{timeElapsed}</div> : null;
    }
    // ChatGPT theme uses ArrowUp icon
    if (isChatGPTTheme) {
      if (clearMode) return <Eraser size="20" />;
      return <ArrowUp size="20" />;
    }
    // Prefer Lucide icons for themes that request it (e.g., Timeless)
    if (submitButtonConf?.useLucide) {
      if (clearMode) return <Eraser size="20" />;
      return <SendHorizontal size="20" />;
    }
    // If there are image assets configured, use them
    if (submitButtonConf?.imageSend && submitButtonConf?.imageClear) {
      return <img src={clearMode ? submitButtonConf.imageClear : submitButtonConf.imageSend} alt={clearMode ? textClear : textSend} />;
    }
    // If there are no text or images, use the default send icon
    if (!clearMode && !textSend) {
      return <Send size="20" />;
    }
    if (clearMode && !textClear) {
      return <Eraser size="20" />;
    }

    return <span>{clearMode ? textClear : textSend}</span>;
  }, [busy, timeElapsed, clearMode, textClear, textSend, submitButtonConf, isChatGPTTheme]);

  // Button is "active" (blue) when there's content to send OR messages to clear
  const isClickable = hasContent || clearMode;

  const buttonClassName = useMemo(() => {
    const classes = ['mwai-input-submit'];
    if (busy) classes.push('mwai-busy');
    if (isClickable) classes.push('mwai-has-content');
    return classes.join(' ');
  }, [busy, isClickable]);

  const onSubmitClick = useCallback(() => {
    if (isListening) {
      setIsListening(false);
    }
    if (clearMode) {
      onClear();
    }
    else {
      onSubmitAction();
    }
  }, [clearMode, isListening, onClear, onSubmitAction, setIsListening]);

  const handleClick = useCallback(() => {
    if (!busy) {
      onSubmitClick();
    }
  }, [busy, onSubmitClick]);

  return (
    <button className={buttonClassName} disabled={busy || isFileUploading || locked} onClick={handleClick}>
      {buttonContent}
    </button>
  );
};

export default ChatbotSubmit;
