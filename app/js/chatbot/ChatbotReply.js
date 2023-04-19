// Previous: 1.5.5
// Current: 1.5.6

import React, { useState, useEffect, useRef } from 'react';
import Typed from 'typed.js';

// AI Engine
import { useInterval } from '@app/chatbot/helpers';
import { useChatbotContext } from '@app/chatbot/ChatbotContext';
import { BouncingDots } from '@app/chatbot/ChatbotSpinners';

const CopyButton = ({ message }) => {
  const { state } = useChatbotContext();
  const { modCss } = state;
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

const RawMessage = ({ message, onRendered = () => {} }) => {
  const { state } = useChatbotContext();
  const { copyButton, userName, aiName, modCss } = state;
  const name = message.role === 'user' ? userName : aiName;

  useEffect(() => { onRendered(); }, []);
  if (message.isQuerying) {
    return (<BouncingDots />);
  }
  return (
    <>
      <span className={modCss('mwai-name')}>{name}</span>
      <span className={modCss('mwai-text')} dangerouslySetInnerHTML={{ __html: message.html }} />
      {copyButton && <CopyButton message={message.content} />}
    </>
  );
};

const TypedMessage = ({ message, conversationRef, onRendered = () => {} }) => {
  const { state } = useChatbotContext();
  const { copyButton, userName, aiName, modCss } = state;
  const typedElement = useRef(null);
  const [ dynamic ] = useState(message.isQuerying);
  const [ ready, setReady ] = useState(!message.isQuerying);
  const name = message.role === 'user' ? userName : aiName;

  useInterval(200, () => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, !ready);

  useEffect(() => {
    if (!dynamic) { 
      onRendered();
      return;
    }

    if (!typedElement.current) {
      return;
    }
    
    const options = {
      strings: [message.html],
      typeSpeed: 20,
      showCursor: false,
      onComplete: (self) => {
        if (self.cursor) {
          self.cursor.remove();
        }
        onRendered();
        setReady(() => true);
      },
    };

    const typed = new Typed(typedElement.current, options);
    return () => { typed.destroy(); };
  }, [message, message.isQuerying]);

  return (
    <>
      {message.isQuerying && <BouncingDots />}
      {!message.isQuerying && dynamic && <>
        <span className={modCss("mwai-name")}>{name}</span>
        <span className={modCss("mwai-text")} ref={typedElement} />
      </>}
      {!message.isQuerying && !dynamic && <>
        <span className={modCss("mwai-name")}>{name}</span>
        <span className={modCss("mwai-text")} dangerouslySetInnerHTML={{ __html: message.html }} />
      </>}
      {ready && copyButton && <CopyButton message={message.content} />}
    </>
  );
};



const ChatbotReply = ({ message, conversationRef }) => {
  const { state } = useChatbotContext();
  const { typewriter, modCss } = state;
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
        const classesToReplace = ['hljs', 'hljs-title', 'hljs-keyword', 'hljs-string'];
        classesToReplace.forEach((oldClass) => {
          const elementsWithOldClass = el.querySelectorAll('.' + oldClass);
          elementsWithOldClass.forEach((element) => {
            element.classList.remove(oldClass);
            let classes = (modCss(oldClass)).split(' ');
            if (classes && classes.length > 1) {
              element.classList.add(classes[1]);
            }
            else {
              console.warn('Could not find class for ' + oldClass);
            }
          });
        });
      });
    }
  }

  if (message.role === 'user') {
    return <div ref={mainElement} className={classes}>
      <RawMessage message={message} />
    </div>;
  }

  if (message.role === 'assistant') {
    if (typewriter) {
      return <div ref={mainElement} className={classes}>
        <TypedMessage message={message} conversationRef={conversationRef} onRendered={onRendered} />
      </div>;
    }
    return <div ref={mainElement} className={classes}>
      <RawMessage message={message} conversationRef={conversationRef} onRendered={onRendered} />
    </div>;
  }

  return (
    <div><i>Unhandled role.</i></div>
  );
};

export default ChatbotReply;