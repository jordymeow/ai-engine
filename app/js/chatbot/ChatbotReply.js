// Previous: 1.5.2
// Current: 1.5.4

import React, { useState, useEffect, useRef } from 'react';
import Typed from 'typed.js';

import { useChatbotContext } from '@app/chatbot/ChatbotContext';
import { BouncingDots } from '@app/chatbot/ChatbotSpinners';

const CopyButton = ({ message, modCss }) => {
  const [ copyAnimation, setCopyAnimation ] = useState(false);

  const onCopy = () => {
    try {
      navigator.clipboard.writeText(message);
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
    <div className={modCss('mwai-copy-button', { 'mwai-animate': copyAnimation })} onClick={onCopy}>
      <div className={modCss('mwai-copy-button-one')}></div>
      <div className={modCss('mwai-copy-button-two')}></div>
    </div>
  );
};

const RawMessage = ({ message, userName, modCss, onRendered = () => {} }) => {
  const { state } = useChatbotContext();
  const { copyButton } = state;

  useEffect(() => { onRendered(); });
  if (message.isQuerying) {
    return (<BouncingDots />);
  }
  return (
    <>
      <span className={modCss('mwai-name')}>{userName}</span>
      <span className={modCss('mwai-text')} dangerouslySetInnerHTML={{ __html: message.html }} />
      {copyButton && <CopyButton message={message.content} modCss={modCss} />}
    </>
  );
};

const TypedMessage = ({ message, aiName, modCss, onRendered = () => {} }) => {
  const { state } = useChatbotContext();
  const { copyButton } = state;
  const typedElement = useRef(null);
  const [ dynamic ] = useState(message.isQuerying);
  const [ ready, setReady ] = useState(!message.isQuerying);
  const hasTypedRef = useRef(false);

  useEffect(() => {
    if (!dynamic) { 
      onRendered();
      return;
    }
    
    const options = {
      strings: message.isQuerying ? ['<i>Thinking...</i>'] : [message.html],
      typeSpeed: 20,
      showCursor: true,
    };

    if (!message.isQuerying) {
      options.preStringTyped = (pos, self) => {
        self.strings = [message.html];
        self.backspace(pos, 0);
      };
      options.onBegin = (self) => {
        setReady(() => true);
        self.start();
      };
      options.onComplete = (self) => {
        self.cursor.remove();
        onRendered();
      }
    }

    const typed = new Typed(typedElement.current, options);
    return () => { typed.destroy(); };
  }, [message, message.isQuerying]);

  useEffect(() => {
    if (hasTypedRef.current) return;
    if (typedElement.current && message.html && !message.isQuerying) {
      hasTypedRef.current = true;
    }
  }, [message]);

  return (
    <>
      <span className={modCss("mwai-name")}>{aiName}</span>
      {dynamic && <div><span className={modCss("mwai-text")} ref={typedElement} /></div>}
      {!dynamic && <span className={modCss("mwai-text")} dangerouslySetInnerHTML={{ __html: message.html }} />}
      {ready && copyButton && <CopyButton message={message.content} modCss={modCss} />}
    </>
  );
};


const ChatbotReply = ({ message, aiName, userName, modCss }) => {
  const { state } = useChatbotContext();
  const { typewriter } = state;
  const mainElement = useRef();
  const classes = modCss('mwai-reply', { 'mwai-ai': message.role === 'assistant', 'mwai-user': message.role === 'user' });

  const onRendered = () => {
    if (!mainElement.current) { return; }
    if (mainElement.current.classList.contains('mwai-rendered')) { 
      return;
    }
    if (typeof hljs !== 'undefined') {
      mainElement.current.classList.add('mwai-rendered');
      const selector = mainElement.current.querySelectorAll('pre code');
      selector.forEach((el) => {
        hljs.highlightElement(el);
      });
    }
  }

  if (message.role === 'user') {
    return <div ref={mainElement} className={classes}>
      <RawMessage message={message} userName={userName} modCss={modCss} />
    </div>;
  }

  if (message.role === 'assistant') {
    if (typewriter) {
      return <div ref={mainElement} className={classes}>
        <TypedMessage message={message} aiName={aiName} modCss={modCss} onRendered={onRendered} />
      </div>;
    }
    return <div ref={mainElement} className={classes}>
      <RawMessage message={message} userName={userName} modCss={modCss} onRendered={onRendered} />
    </div>;
  }

  return (
    <div><i>Unhandled role.</i></div>
  );
};

export default ChatbotReply;