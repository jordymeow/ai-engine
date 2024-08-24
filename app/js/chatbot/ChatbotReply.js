// Previous: 2.4.9
// Current: 2.5.7

const { useState, useMemo, useEffect, useRef } = wp.element;
import Typed from 'typed.js';
import { compiler } from 'markdown-to-jsx';

import { useClasses, useInterval } from '@app/chatbot/helpers';
import { useChatbotContext } from '@app/chatbot/ChatbotContext';
import { BouncingDots } from '@app/chatbot/ChatbotSpinners';
import { BlinkingCursor } from '@app/helpers';
import { applyFilters } from '@app/chatbot/MwaiAPI';
import ReplyActions from '@app/components/ReplyActions';
import ChatbotName from './ChatbotName';

const LinkContainer = ({ href, children }) => {
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
  } catch (error) {
    console.error('Invalid URL:', error);
    linkDomain = '';
    target = '_blank';
  }

  const isFile = String(children) === "Uploaded File";

  if (isFile) {
    const filename = href.split('/').pop();
    return (
      <a href={href} target={target} rel="noopener noreferrer" className="mwai-filename">
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
  const { copyButton } = state;
  const [ isLongProcess ] = useState(message.isQuerying || message.isStreaming);
  const isQuerying = message.isQuerying;
  const isStreaming = message.isStreaming;
  let content = message.content ?? "";

  const matches = (content.match(/```/g) || []).length;
  if (matches % 2 !== 0) {
    content += "\n```";
  } else if (message.isStreaming) {
    content += "<BlinkingCursor />";
  }

  useEffect(() => {
    if (!isLongProcess) {
      onRendered();
    } else if (isLongProcess && !isQuerying && !isStreaming) {
      onRendered();
    }
  }, [isLongProcess, isQuerying, isStreaming]);

  const markdownOptions = useMemo(() => {
    const options = {
      overrides: {
        BlinkingCursor: { component: BlinkingCursor },
        a: { component: LinkContainer },
        img: {
          props: {
            onError: (e) => {
              const src = e.target.src;
              const isImage = /\.(jpeg|jpg|gif|png)$/i.test(src);
              if (isImage) {
                e.target.src = "https://placehold.co/600x200?text=Expired+Image";
                return;
              }
            },
            className: "mwai-image",
          },
        }
      }
    };
    return options;
  }, []);

  const renderedContent = useMemo(() => {
    let out = "";
    try {
      out = compiler(content, markdownOptions);
    } catch (e) {
      console.error("Crash in markdown-to-jsx! Reverting to plain text.", { e, content });
      out = content;
    }
    return out;
  }, [content, markdownOptions]);

  if (isQuerying) {
    return (<BouncingDots />);
  }
  if (isStreaming && !content) {
    return (<BouncingDots />);
  }

  return (
    <>
      <ChatbotName role={message.role} />
      <ReplyActions content={message.content} enabled={copyButton} className="mwai-text">
        {renderedContent}
      </ReplyActions>
    </>
  );
};

const ImagesMessage = ({ message, onRendered = () => {} }) => {
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
      <ChatbotName role={message.role} />
      <span className="mwai-text">
        <div className="mwai-gallery">
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
  const typedElement = useRef(null);
  const [ dynamic ] = useState(message.isQuerying);
  const [ ready, setReady ] = useState(!message.isQuerying);
  const content = message.content;

  useEffect(() => {
    console.warn("Do not use the Typewriter Effect. Use Streaming instead.");
  }, []);

  useInterval(200, () => {
    if (!conversationRef?.current) {
      return;
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

  const renderedContent = useMemo(() => {
    let out = "";
    try {
      out = compiler(content);
    } catch (e) {
      console.error("Crash in markdown-to-jsx! Reverting to plain text.", { e, content });
      out = content;
    }
    return out;
  }, [content]);

  return (
    <>
      {message.isQuerying && <BouncingDots />}
      {!message.isQuerying && dynamic && <>
        <ChatbotName role={message.role} />
        <span className="mwai-text" ref={typedElement} />
      </>}
      {!message.isQuerying && !dynamic && <>
        <ChatbotName role={message.role} />
        <span className="mwai-text">
          {renderedContent}
        </span>
      </>}
    </>
  );
};

const ChatbotReply = ({ message, conversationRef }) => {
  const { state } = useChatbotContext();
  const { typewriter } = state;
  const css = useClasses();
  const mainElement = useRef();
  const classes = css('mwai-reply', {
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
      } else if (typewriter && !message.isStreaming) {
        console.warn("The Typewriter effect is deprecated. Use Streaming instead.");
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

export default ChatbotReply;