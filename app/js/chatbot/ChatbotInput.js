// Previous: 2.4.5
// Current: 2.4.9

const { useRef, useState, useEffect, useImperativeHandle } = wp.element;

import TextAreaAutosize from 'react-textarea-autosize';
import { Microphone, useClasses } from '@app/chatbot/helpers';
import ChatUploadIcon from './ChatUploadIcon';
import { useChatbotContext } from './ChatbotContext';

const isImage = (file) => file.type.startsWith('image/');
const isDocument = (file) => {
  const allowedDocumentTypes = [
    'text/x-c', 'text/x-csharp', 'text/x-c++', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/html', 'text/x-java', 'application/json', 'text/markdown',
    'application/pdf', 'text/x-php', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/x-python', 'text/x-script.python', 'text/x-ruby', 'text/x-tex',
    'text/plain', 'text/css', 'text/javascript', 'application/x-sh',
    'application/typescript'
  ];
  return allowedDocumentTypes.includes(file.type);
};

const ChatbotInput = () => {
  const css = useClasses();
  const { state, actions } = useChatbotContext();
  const { inputText, textInputMaxLength, textInputPlaceholder, error, speechRecognitionAvailable,
    isMobile, conversationRef, open, uploadIconPosition, draggingType, isBlocked, locked,
    isListening, busy, speechRecognition, imageUpload, fileSearch, chatbotInputRef } = state;
  const { onSubmitAction, setIsListening, resetError, setInputText, setIsBlocked,
    setDraggingType, onUploadFile } = actions;

  const [ composing, setComposing ] = useState(false);
  const inputRef = useRef();

  useImperativeHandle(chatbotInputRef, () => ({
    focusInput: () => { inputRef.current?.focus(); },
    currentElement: () => inputRef.current,
  }));

  useEffect(() => {
    if (!isMobile && open) {
      inputRef.current.focus();
    }
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [open, isMobile, conversationRef]);

  const handleDrag = (event, dragState) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.items[0];
    if (dragState) {
      if (imageUpload && isImage(file)) {
        setDraggingType('image');
        setIsBlocked(false);
      }
      else if (fileSearch && isDocument(file)) {
        setDraggingType('document');
        setIsBlocked(false);
      }
      else {
        setDraggingType('unknown');
        setIsBlocked(true);
      }
    }
    else {
      setDraggingType('unknown');
      setIsBlocked(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleDrag(event, false);
    if (busy) return;
    const file = event.dataTransfer.files[0];
    if (file) {
      if (draggingType === 'image' && imageUpload) {
        onUploadFile(file);
      }
      else if (draggingType === 'document' && fileSearch) {
        onUploadFile(file);
      }
      else {
        setIsBlocked(true);
        setTimeout(() => setIsBlocked(false), 3000);
      }
    }
  };

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
    'mwai-dragging': draggingType,
    'mwai-blocked': isBlocked,
  });

  return (
    <div ref={chatbotInputRef} className={classNames}
      onDrop={handleDrop}
      onDragEnter={(event) => handleDrag(event, true)}
      onDragLeave={(event) => handleDrag(event, false)}
      onDragOver={(event) => handleDrag(event, true)}>

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