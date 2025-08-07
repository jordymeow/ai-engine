// Previous: none
// Current: 2.9.9

import ChatbotInput from '../../ChatbotInput';
import ChatbotSubmit from '../../ChatbotSubmit';

const StandardInput = ({ inputClassNames, chatbotInputRef, handleDrop, handleDrag }) => {
  return (
    <div className={inputClassNames}
      onClick={() => chatbotInputRef.current?.focusInput()}
      onDrop={handleDrop}
      onDragEnter={(event) => handleDrag(event, true)}
      onDragLeave={(event) => handleDrag(event, false)}
      onDragOver={(event) => handleDrag(event, true)}>
      <ChatbotInput />
      <ChatbotSubmit />
    </div>
  );
};

export default StandardInput;