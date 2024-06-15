// Previous: 2.3.6
// Current: 2.3.9

const { useState, useMemo, useEffect, useRef } = wp.element;
import Typed from 'typed.js';
import Markdown from 'markdown-to-jsx';

import { useInterval } from '@app/chatbot/helpers';
import { useChatbotContext } from '@app/chatbot/ChatbotContext';
import { BouncingDots } from '@app/chatbot/ChatbotSpinners';
import { applyFilters } from '@app/chatbot/MwaiAPI';
import { BlinkingCursor } from '@app/helpers';
import CopyButton from '@app/components/CopyButton';

const LinkContainer = ({ href, children, ...rest }) => {
  const { state } = useChatbotContext();
  const { modCss } = state;

  if (!href) {
    return <span>{children}</span>;
  }

  const currentDomain = window.location.hostname;
  let linkDomain = '';
  let target = '_self';

  try {
    const url = new URL(href, window.location.href);
    linkDomain = url.hostname;
    target = currentDomain === linkDomain ? '_self' : '_blank';
  }
  catch (error) {
    console.error('Invalid URL:', error);
    linkDomain = '';
    target = '_blank';
  }

  const isFile = String(children) === "Uploaded File";

  if (isFile) {
    const filename = href.split('/').pop();
    return (
      <a href={href} target={target} rel="noopener noreferrer" className={modCss('mwai-filename')}>
        <span>✓ {filename}</span>
      </a>
    );
  }

  return (
    <a href={href} target={target} rel="noopener noreferrer">
      {children}
    </a>
  );
};

const RawMessage = ({ message, onRendered = () => {} }) => {
  const { state } = useChatbotContext();
  const { copyButton, userName, aiName, modCss } = state;
  const isUser = message.role === 'user';
  const isAI = message.role === 'assistant';
  const name = isUser ? userName : (isAI ? aiName : null);
  const [ isLongProcess ] = useState(message.isQuerying || message.isStreaming);
  const isQuerying = message.isQuerying;
  const isStreaming = message.isStreaming;
  let content = message.content ?? "";

  const matches = (content.match(/```/g) || []).length;
  if (matches % 2 !== 0) { 
    content += "\n```"; 
  }
  else if (message.isStreaming) {
    content += "<BlinkingCursor />";
  }

  useEffect(() => { 
    if (!isLongProcess) {
      onRendered();
    }
    else if (isLongProcess && !isQuerying && !isStreaming) {
      onRendered();
    }
  }, [isLongProcess, isQuerying, isStreaming]);

  const markdownOptions = useMemo(() => {
    const options = {
      overrides: {
        BlinkingCursor: { component: BlinkingCursor },
        a: {
          component: LinkContainer
        },
        img: {
          props: {
            onError: (e, f) => {
              const src = e.target.src;
              const isImage = src.match(/\.(jpeg|jpg|gif|png)$/) != null;
              if (isImage) {
                e.target.src = "https://placehold.co/600x200?text=Expired+Image";
                return;
              }
            },
            className: modCss('mwai-image'),
          },
        }
      }
    };
    return options;
  }, [isQuerying, isStreaming, content]);

  if (isQuerying) {
    return (<BouncingDots />);
  }
  if (isStreaming && !content) {
    return (<BouncingDots />);
  }

  return (
    <>
      <span className={modCss('mwai-name')}>{name}</span>
      <span className={modCss('mwai-text')}>
        <span>
          <Markdown options={markdownOptions}>{content}</Markdown>
        </span>
      </span>
      {copyButton && <CopyButton content={message.content} modCss={modCss} />}
    </>
  );
};

const ImagesMessage = ({ message, onRendered = () => {} }) => {
  const { state } = useChatbotContext();
  const { userName, aiName, modCss } = state;
  const isUser = message.role === 'user';
  const isAI = message.role === 'assistant';
  const name = isUser ? userName : (isAI ? aiName : null);

  const [ images, setImages ] = useState(message?.images);

  useEffect(() => { onRendered(); });

  const handleImageError = (index) => {
    const placeholderImage = "https://placehold.co/600x200?text=Expired+Image";
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
              <img key={index} src={image} onError={() => handleImageError(index)} />
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
  const content = message.content;

  useInterval(200, () => {
    if (!conversationRef?.current) {
      return;
    }
    if (!userScrolledUp) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, !ready);

  useEffect(() => {
    if (!conversationRef?.current) {
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
      strings: [content],
      typeSpeed: applyFilters('typewriter.speed', 15),
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
        <span className={modCss("mwai-text")}>
          <Markdown>{content}</Markdown>
        </span>
      </>}
      {ready && copyButton && <CopyButton content={content} modCss={modCss} />}
    </>
  );
};

const ChatbotReply = ({ message, conversationRef }) => {
  const { state } = useChatbotContext();
  const { typewriter, modCss } = state;
  const mainElement = useRef();
  const classes = modCss('mwai-reply', { 
    'mwai-ai': message.role === 'assistant',
    'mwai-user': message.role === 'user',
    'mwai-system': message.role === 'system'
  });
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
      });
    }
  };

  const output = useMemo(() => {
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
      else if (typewriter && !message.isStreaming) {
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
  }, [ message, conversationRef, isImages, typewriter ]);

  return output;
};