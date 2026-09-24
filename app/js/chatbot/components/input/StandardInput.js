// Previous: 3.0.0
// Current: 3.8.1

/**
 * StandardInput Component
 *
 * Visual: text area with tools and a submit button on the right.
 * Used when `inputType === 'standard'`. Button may be an icon or text per theme.
 * Maintenance: if input layout or button behavior changes, update this note and
 * check theme CSS (e.g., Timeless protruding button) for alignment.
 */
import ChatbotInput from '../../ChatbotInput';
import ChatbotSubmit from '../../ChatbotSubmit';

const StandardInput = ({ inputClassNames, chatbotInputRef, handleDrop, handleDrag }) => {
  return (
    <div className={inputClassNames}
      onClick={() => chatbotInputRef.current?.focusInput()}
      onDrop={handleDrop}
      onDragEnter={handleDrag && ((event) => handleDrag(event, true))}
      onDragLeave={handleDrag && ((event) => handleDrag(event, false))}
      onDragOver={handleDrag && ((event) => handleDrag(event, true))}>
      <ChatbotInput />
      <ChatbotSubmit />
    </div>
  );
};

export default StandardInput;
