// Previous: 2.4.9
// Current: 2.5.0

const { useRef, useState, useEffect, useImperativeHandle } = wp.element;

import TextAreaAutosize from 'react-textarea-autosize';
import { Microphone, useClasses } from '@app/chatbot/helpers';
import ChatUploadIcon from './ChatUploadIcon';
import { useChatbotContext } from './ChatbotContext';

const ChatbotInput = () => {
  const css = useClasses();
  const { state, actions } = useChatbotContext();
  const { inputText, textInputMaxLength, textInputPlaceholder, error, speechRecognitionAvailable,
    isMobile, conversationRef, open, uploadIconPosition, locked,
    isListening, busy, speechRecognition, chatbotInputRef } = state;
  const { onSubmitAction, setIsListening, resetError, setInputText } = actions;

  const [ composing, setComposing ] = useState(false);
  const inputRef = useRef();

  useImperativeHandle(chatbotInputRef, () => ({
    focusInput: () => { inputRef.current?.focus(); },
    currentElement: () => inputRef.current,
  }));

  // Focus input when opening (except mobile)
  useEffect(() => {
    if (!isMobile && open) {
      inputRef.current.focus();
    }
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [open, isMobile, conversationRef]);

  const onTypeText = (text) => {
    if (isListening) {
      setIsListening(false);
    }
    if (error) {
      resetError();
    }
    setInputText(text);
  };

  const classNames = css('mwai-input-text', {
  });

  return (
    <div ref={chatbotInputRef} className={classNames}>

      {uploadIconPosition === 'mwai-input' && <ChatUploadIcon />}

      <TextAreaAutosize
        ref={inputRef}
        disabled={busy || locked}
        placeholder={textInputPlaceholder}
        value={inputText}
        maxLength={textInputMaxLength}
        onCompositionStart={() => setComposing(true)}
        onCompositionEnd={() => setComposing(false)}
        onKeyDown={(event) => {
          if (composing) return;
          if (event.code === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            onSubmitAction();
          }
        }}
        onChange={(e) => onTypeText(e.target.value)}
      />

      {speechRecognition && (<Microphone
        active={isListening}
        disabled={!speechRecognitionAvailable || busy}
        className="mwai-microphone"
        onClick={() => setIsListening(!isListening)}
      />)}

    </div>
  );
};

export default ChatbotInput;
