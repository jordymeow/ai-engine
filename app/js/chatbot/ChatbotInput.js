// Previous: 2.1.5
// Current: 2.3.1

const { useRef, useState, useImperativeHandle } = wp.element;
import TextAreaAutosize from 'react-textarea-autosize';
import { Microphone, ChatUpload } from '@app/chatbot/helpers';

const ChatbotInput = React.forwardRef((props, ref) => {
  const { onTypeText, onSubmitAction, onUploadFile,
    inputText, textInputMaxLength, textInputPlaceholder,
    busy, modCss,
    isListening, setIsListening,
    speechRecognitionAvailable, speechRecognition,
    fileSearch, imageUpload, uploadedFile,
    composing, setComposing
   } = props;
   const [ dragging, setDragging ] = useState(false);

  const inputRef = useRef();
  const fileSearchRef = useRef();

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    if (busy) return;
    const files = event.dataTransfer.files;
    if (files.length) {
      fileSearchRef.current.handleExternalFile(files[0]);
    }
  };

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current?.focus();
    },
    currentElement: () => {
      return inputRef.current
    }
  }));

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(true);
  }

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
  }

  return (
    <div className={modCss('mwai-input-text', { 'mwai-dragging': dragging })}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}>
      {(imageUpload || fileSearch) && 
        <ChatUpload className={modCss('mwai-file-upload', { 
            'mwai-enabled': uploadedFile?.uploadedId,
            'mwai-busy': uploadedFile?.localFile && !uploadedFile?.uploadedId,
          })}
          type={fileSearch ? 'file' : 'image'}
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
        <Microphone active={isListening} disabled={!speechRecognitionAvailable || busy}
          className={modCss('mwai-microphone')}
          onClick={() => setIsListening(!isListening)}
        />
      )}
    </div>
  );
});

export default ChatbotInput;
