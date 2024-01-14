// Previous: 2.1.3
// Current: 2.1.5

const { useRef, useImperativeHandle } = wp.element;
import TextAreaAutosize from 'react-textarea-autosize';
import { Microphone, ChatUpload } from '@app/chatbot/helpers';

const ChatbotInput = React.forwardRef((props, ref) => {
  const {  onTypeText, onSubmitAction, onUploadFile,
    inputText, textInputMaxLength, textInputPlaceholder,
    busy, modCss,
    isListening, setIsListening,
    speechRecognitionAvailable, speechRecognition,
    fileUpload, imageUpload, uploadedFile,
    composing, setComposing
   } = props;

  const inputRef = useRef();
  const fileUploadRef = useRef();

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (busy) return;
    const files = event.dataTransfer.files;
    if (files.length) {
      fileUploadRef.current.handleExternalFile(files[0]);
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

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className={modCss('mwai-input-text')}
      onDrop={handleDrop}
      onDragOver={handleDragOver}>
      {(imageUpload || fileUpload) && 
        <ChatUpload className={modCss('mwai-file-upload', { 
            'mwai-enabled': uploadedFile?.uploadedId,
            'mwai-busy': uploadedFile?.localFile && !uploadedFile?.uploadedId,
          })}
          type={imageUpload ? 'vision' : 'assistant'}
          disabled={busy}
          ref={fileUploadRef}
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
