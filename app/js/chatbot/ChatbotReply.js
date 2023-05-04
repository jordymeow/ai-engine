// Previous: 1.6.64
// Current: 1.6.65

import React, { useState, useEffect, useRef } from 'react';
import Typed from 'typed.js';

// AI Engine
import { useInterval } from '@app/chatbot/helpers';
import { useChatbotContext } from '@app/chatbot/ChatbotContext';
import { BouncingDots } from '@app/chatbot/ChatbotSpinners';
import { applyFilters } from '@app/chatbot/MwaiAPI';

const CopyButton = ({ content }) => {
  const { state } = useChatbotContext();
  const { modCss } = state;
  const [ copyAnimation, setCopyAnimation ] = useState(false);

  const onCopy = () => {
    try {
      navigator.clipboard.writeText(content);
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
  const isUser = message.role === 'user';
  const isAI = message.role === 'assistant';
  const name = isUser ? userName : (isAI ? aiName : null);

  useEffect(() => { onRendered(); });
  if (message.isQuerying) {
    return (<BouncingDots />);
  }
  return (
    <>
      <span className={modCss('mwai-name')}>{name}</span>
      <span className={modCss('mwai-text')} dangerouslySetInnerHTML={{ __html: message.html }} />
      {copyButton && <CopyButton content={message.content} />}
    </>
  );
};

const ImagesMessage = ({ message, onRendered = () => {} }) => {
  const { state } = useChatbotContext();
  const { copyButton, userName, aiName, modCss } = state;
  const isUser = message.role === 'user';
  const isAI = message.role === 'assistant';
  const name = isUser ? userName : (isAI ? aiName : null);

  const [images, setImages] = useState(message?.images);

  useEffect(() => { onRendered(); });

  const handleImageError = (index) => {
    const placeholderImage = "https://via.placeholder.com/600?text=Image+Gone";
    setImages(prevImages => prevImages.map((img, i) => i === index ? placeholderImage : img));
  };

  if (message.isQuerying) {
    return (<BouncingDots />);
  }
  return (
    <>
      <span className={modCss('mwai-name')}>{name}</span>
      <span className={modCss('mwai-text')}>
        <div className={modCss('mwai-gallery')}>
          {images?.map((image, index) => (
            <a key={index} href={image} target="_blank" rel="noopener noreferrer">
              <img src={image} onError={() => handleImageError(index)} />
            </a>
          ))}
        </div>
      </span>
    </>
  );
};

const TypedMessage = ({ message, conversationRef, onRendered = () => {} }) => {
  const { state } = useChatbotContext();
  const { copyButton, userName, aiName, modCss } = state;
  const typedElement = useRef(null);
  const [ dynamic ] = useState(message.isQuerying);
  const [ ready, setReady ] = useState(!message.isQuerying);
  const [ userScrolledUp, setUserScrolledUp ] = useState(false);
  const name = message.role === 'user' ? userName : aiName;

  useInterval(200, () => {
    if (conversationRef.current && !userScrolledUp) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, !ready);

  useEffect(() => {
    if (!conversationRef.current) {
      return;
    }
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = conversationRef.current;
      const scroll = scrollTop + clientHeight;
      setUserScrolledUp(scrollHeight - scroll > 20);
    };
    conversationRef.current.addEventListener('scroll', handleScroll);
    return () => {
      if (conversationRef.current) {
        conversationRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [conversationRef]);

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
      typeSpeed: applyFilters('typewriter_speed', 15),
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
      {ready && copyButton && <CopyButton content={message.content} />}
    </>
  );
};



const ChatbotReply = ({ message, conversationRef }) => {
  const { state } = useChatbotContext();
  const { typewriter, modCss } = state;
  const mainElement = useRef();
  const classes = modCss('mwai-reply', { 'mwai-ai': message.role === 'assistant', 'mwai-user': message.role === 'user' });
  const isImages = message?.images?.length > 0;

  const onRendered = () => {
    if (!mainElement.current) { return; }
    if (message.isQuerying) { return; }
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

    if (isImages) {
      return <div ref={mainElement} className={classes}>
        <ImagesMessage message={message} conversationRef={conversationRef} onRendered={onRendered} />
      </div>;
    }
    else if (typewriter) {
      return <div ref={mainElement} className={classes}>
        <TypedMessage message={message} conversationRef={conversationRef} onRendered={onRendered} />
      </div>;
    }
    return <div ref={mainElement} className={classes}>
      <RawMessage message={message} conversationRef={conversationRef} onRendered={onRendered} />
    </div>;
  }

  if (message.role === 'system') {
    return <div ref={mainElement} className={classes}>
      <RawMessage message={message} conversationRef={conversationRef} onRendered={onRendered} />
    </div>;
  }

  return (
    <div><i>Unhandled role.</i></div>
  );
};

export default ChatbotReply;