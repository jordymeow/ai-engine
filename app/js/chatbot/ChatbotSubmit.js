// Previous: 2.6.9
// Current: 2.7.7

// React & Vendor Libs
const { useMemo, useCallback } = wp.element;
import { Send, Eraser } from 'lucide-react';

import { useChatbotContext } from "./ChatbotContext";

const ChatbotSubmit = () => {
  const { state, actions } = useChatbotContext();
  const { onClear, onSubmitAction, setIsListening } = actions;
  const { textClear, textSend, uploadedFile, inputText, messages,
    isListening, timeElapsed, busy, submitButtonConf, locked } = state;

  const isFileUploading = !!uploadedFile?.uploadProgress;
  const hasFileUploaded = !!uploadedFile?.uploadedId;
  const clearMode = !hasFileUploaded && inputText.length < 1 && messages?.length > 1;

  const buttonContent = useMemo(() => {
    if (busy) {
      return timeElapsed ? <div className="mwai-timer">{timeElapsed}</div> : null;
    }
    // If there are text values for the button, use them
    if (submitButtonConf?.imageSend && submitButtonConf?.imageClear) {
      return <img src={clearMode ? submitButtonConf.imageClear : submitButtonConf.imageSend} alt={clearMode ? textClear : textSend} />;
    }
    // If there are no text or images, use the default send icon
    if (!clearMode && !textSend) {
      return <Send size="20" style={{ marginLeft: 10 }} />;
    }
    if (clearMode && !textClear) {
      return <Eraser size="20" />;
    }

    return <span>{clearMode ? textClear : textSend}</span>;
  }, [busy, timeElapsed, clearMode, textClear, textSend, submitButtonConf]);

  const buttonClassName = useMemo(() => {
    return `mwai-input-submit ${busy ? 'mwai-busy' : ''}`;
  }, [busy]);

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