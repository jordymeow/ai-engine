// Previous: 1.4.8
// Current: 1.5.2

// React & Vendor Libs
const { useState, useEffect } = wp.element;

import { BouncingDots } from '@app/chatbot/ChatbotSpinners';

const ChatbotReply = ({ message, aiName, userName, copyButton, modCss }) => {
  const [ fadeOut, setFadeOut ] = useState(false);
  const [ copyAnimation, setCopyAnimation ] = useState(false);

  useEffect(() => {
    if (fadeOut && !message.isQuerying) {
      setTimeout(() => {
        setFadeOut(false);
      }, 100);
    }
  }, [message.isQuerying]);

  const classes = modCss('mwai-reply', {
    'mwai-ai': message.role === 'assistant',
    'mwai-user': message.role === 'user',
    'mwai-fade-out': fadeOut,
  });

  const onCopy = () => {
    try {
      navigator.clipboard.writeText(message.content);
      setCopyAnimation(true);
      setTimeout(function () {
        setCopyAnimation(false);
      }, 1000);
    }
    catch (err) {
      console.warn('Not allowed to copy to clipboard. Make sure your website uses HTTPS.');
    }
  }

  return (
    <div className={classes}>
      {message.isQuerying && <BouncingDots />}
      {!message.isQuerying && <>
        <span className={modCss('mwai-name')}>
          {message.role === 'assistant' && aiName}
          {message.role === 'user' && userName}
        </span>
        <>
          {message?.html && <span className={modCss('mwai-text')}
            dangerouslySetInnerHTML={{ __html: message.html }}
          />}
        </>
        {copyButton && (
          <div className={modCss('mwai-copy-button', { 'mwai-animate': copyAnimation })} onClick={onCopy}>
            <div className={modCss('mwai-copy-button-one')}></div>
            <div className={modCss('mwai-copy-button-two')}></div>
          </div>
        )}
      </>}
    </div>
  );
};

export default ChatbotReply;
