// Previous: none
// Current: 1.4.7

import { useState, useEffect } from 'react';
import { BouncingDots } from '@app/chatbot/ChatbotSpinners';

const ChatbotReply = ({ message, aiName, userName, copyButton, modCss }) => {
  const [ showQuerying, setShowQuerying ] = useState(message.isQuerying);
  const [ fadeOut, setFadeOut ] = useState(false);

  useEffect(() => {
    if (fadeOut && !message.isQuerying) {
      //setShowQuerying(false);
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
          <div className={modCss('mwai-copy-button')}>
            <div className={modCss('mwai-copy-button-one')}></div>
            <div className={modCss('mwai-copy-button-two')}></div>
          </div>
        )}
      </>}
    </div>
  );
};

export default ChatbotReply;
