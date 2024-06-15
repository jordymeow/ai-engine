// Previous: 2.3.6
// Current: 2.3.9

import React, { useRef, useState, useImperativeHandle } from 'react';
import TextAreaAutosize from 'react-textarea-autosize';
import { Microphone } from '@app/chatbot/helpers';
import ChatUpload from './ChatUpload';

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

const ChatbotInput = React.forwardRef((props, ref) => {
  const { 
    onTypeText, onSubmitAction, onUploadFile, inputText, textInputMaxLength, 
    textInputPlaceholder, busy, modCss, isListening, setIsListening, 
    speechRecognitionAvailable, speechRecognition, fileSearch, 
    imageUpload, uploadedFile, composing, setComposing 
  } = props;
  const [draggingType, setDraggingType] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const inputRef = useRef();
  const fileSearchRef = useRef();
  const uploadEnabled = imageUpload || fileSearch;  

  useImperativeHandle(ref, () => ({
    focusInput: () => { inputRef.current?.focus(); },
    currentElement: () => inputRef.current,
  }));

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
        setDraggingType(false);
        setIsBlocked(true);
      }
    }
    else {
      setDraggingType(false);
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
        fileSearchRef.current.handleExternalFile(file);
      } else if (draggingType === 'document' && fileSearch) {
        fileSearchRef.current.handleExternalFile(file);
      } else {
        setIsBlocked(true);
        setTimeout(() => setIsBlocked(false), 2000);
      }
    }
  };

  return (
    <div 
      className={modCss('mwai-input-text', { 
        'mwai-dragging': draggingType,
        'mwai-blocked': isBlocked,
      })}
      onDrop={handleDrop}
      onDragEnter={(event) => handleDrag(event, true)}
      onDragLeave={(event) => handleDrag(event, false)}
      onDragOver={(event) => handleDrag(event, true)}>
      {uploadEnabled && 
        <ChatUpload 
          className={modCss('mwai-file-upload', { 
            'mwai-enabled': uploadedFile?.uploadedId,
            'mwai-busy': uploadedFile?.localFile && !uploadedFile?.uploadedId,
          })}
          modCss={modCss}
          draggedType={draggingType}
          disabled={busy}
          ref={fileSearchRef}
          uploadedFile={uploadedFile}
          onUploadFile={onUploadFile}
        />
      }
      <TextAreaAutosize
        ref={inputRef}
        disabled={busy}
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
      {speechRecognition && (
        <Microphone 
          active={isListening} 
          disabled={!speechRecognitionAvailable || busy}
          className={modCss('mwai-microphone')}
          onClick={() => setIsListening(!isListening)}
        />
      )}
    </div>
  );
});

export default ChatbotInput;