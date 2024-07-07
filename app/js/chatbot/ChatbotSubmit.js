// Previous: 2.4.5
// Current: 2.4.7

import { useChatbotContext } from "./ChatbotContext";

// React & Vendor Libs
const { useMemo, useCallback } = wp.element;

const ChatbotSubmit = () => {
  const { state, actions } = useChatbotContext();
  const { onClear, onSubmitAction, setIsListening } = actions;
  const { textClear, textSend, uploadedFile, inputText, messages,
    isListening, timeElapsed, busy, submitButtonConf } = state;

  const isFileUploading = !!uploadedFile?.uploadProgress;
  const hasFileUploaded = !!uploadedFile?.uploadedId;
  const clearMode = !hasFileUploaded && inputText.length < 1 && messages?.length > 1;

  const buttonContent = useMemo(() => {
    if (busy) {
      return timeElapsed ? <div className="mwai-timer">{timeElapsed}</div> : null;
    }
    if (submitButtonConf?.imageSend && submitButtonConf?.imageClear) {
      return <img src={clearMode ? submitButtonConf.imageClear : submitButtonConf.imageSend} alt={clearMode ? textClear : textSend} />;
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
    <button className={buttonClassName} disabled={busy || isFileUploading} onClick={handleClick}>
      {buttonContent}
    </button>
  );
};

export default ChatbotSubmit;