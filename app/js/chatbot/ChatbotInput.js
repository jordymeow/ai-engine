// Previous: 2.3.5
// Current: 2.3.6

import React, { useRef, useState, useImperativeHandle } from 'react';
import TextAreaAutosize from 'react-textarea-autosize';
import { Microphone } from '@app/chatbot/helpers';
import ChatUpload from './ChatUpload';

const ChatbotInput = React.forwardRef((props, ref) => {
  const { 
    onTypeText, onSubmitAction, onUploadFile, inputText, textInputMaxLength, 
    textInputPlaceholder, busy, modCss, isListening, setIsListening, 
    speechRecognitionAvailable, speechRecognition, fileSearch, 
    imageUpload, uploadedFile, composing, setComposing 
  } = props;
  const [draggingType, setDraggingType] = useState(false);
  const inputRef = useRef();
  const fileSearchRef = useRef();
  const uploadEnabled = imageUpload || fileSearch;  

  useImperativeHandle(ref, () => ({
    focusInput: () => { inputRef.current?.focus();},
    currentElement: () => inputRef.current,
  }));

  const handleDrag = (event, dragState) => {
    event.preventDefault();
    event.stopPropagation();
    if (dragState && !draggingType) {
      const isImage = event.dataTransfer.items[0]?.type?.startsWith('image/');
      setDraggingType(isImage ? 'image' : 'document');
    }
    else if (!dragState && draggingType) {
      setDraggingType(false);
    }
  };

  const handleDrop = (event) => {
    handleDrag(event, false);
    if (busy) return;
    const files = event.dataTransfer.files;
    if (files.length) {
      fileSearchRef.current.handleExternalFile(files[0]);
    }
  };

  return (
    <div 
      className={modCss('mwai-input-text', { 'mwai-dragging': draggingType })}
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
