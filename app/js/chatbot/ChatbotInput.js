// Previous: 2.0.6
// Current: 2.0.7

const { useRef, useImperativeHandle } = wp.element;
import TextAreaAutosize from 'react-textarea-autosize';
import { Microphone, ImageUpload } from '@app/chatbot/helpers';

const ChatbotInput = React.forwardRef((props, ref) => {
  const {  onTypeText, onSubmitAction, onUploadFile,
    inputText, textInputMaxLength, textInputPlaceholder,
    busy, modCss,
    isListening, setIsListening,
    speechRecognitionAvailable, speechRecognition,
    imageUpload, uploadedImage,
    composing, setComposing
   } = props;
  const inputRef = useRef();
  const imageUploadRef = useRef();
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (busy) return;
    const files = event.dataTransfer.files;
    if (files.length) {
      //console.log(imageUploadRef);
      imageUploadRef.current.handleExternalFile(files[0]);
    }
  };

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current?.focus();
    }
  }));

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div className={modCss('mwai-input-text')}
      onDrop={handleDrop}
      onDragOver={handleDragOver}>
      {imageUpload && 
        <ImageUpload className={modCss('mwai-image-upload', { 
          'mwai-enabled': uploadedImage?.uploadedId,
          'mwai-busy': uploadedImage?.localFile && !uploadedImage?.uploadedId,
          })}
          disabled={busy}
          ref={imageUploadRef}
          uploadedImage={uploadedImage}
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
