// Previous: 2.7.7
// Current: 2.8.3

const { useState, useMemo, useEffect, useRef } = wp.element;
import { compiler } from 'markdown-to-jsx';

import { useClasses } from '@app/chatbot/helpers';
import { useChatbotContext } from '@app/chatbot/ChatbotContext';
import { BouncingDots } from '@app/chatbot/ChatbotSpinners';
import { BlinkingCursor } from '@app/helpers';
import ReplyActions from '@app/components/ReplyActions';
import ChatbotName from './ChatbotName';
import ChatbotContent from './ChatbotContent';

const RawMessage = ({ message, onRendered = () => {} }) => {
  const { state } = useChatbotContext();
  const { copyButton, debugMode } = state;
  const [ isLongProcess ] = useState(message.isQuerying || message.isStreaming);
  const isQuerying = message.isQuerying;
  const isStreaming = message.isStreaming;

  useEffect(() => {
    if (!isLongProcess) {
      onRendered();
    }
    else if (isLongProcess && !isQuerying && !isStreaming) {
      onRendered();
    }
  }, [isLongProcess, isQuerying, isStreaming]);

  if (isQuerying) {
    return (<BouncingDots />);
  }

  return (
    <>
      <ChatbotName role={message.role} />
      <ReplyActions content={message.content} enabled={copyButton} className="mwai-text">
        <ChatbotContent message={message} />
      </ReplyActions>
    </>
  );
};

const ImagesMessage = ({ message, onRendered = () => {} }) => {
  const [ images, setImages ] = useState(message?.images);
  const hasRendered = useRef(false);
  useEffect(() => {
    if (!hasRendered.current) {
      onRendered();
      hasRendered.current = true;
    }
  }, []);

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
        // eslint-disable-next-line no-undef
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

      if (typewriter && !message.isStreaming) {
        return <div ref={mainElement} className={classes}>
          <RawMessage message={message} conversationRef={conversationRef} onRendered={onRendered} />
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