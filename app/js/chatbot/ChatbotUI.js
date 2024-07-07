// Previous: 2.4.5
// Current: 2.4.7

const { useState, useMemo, useLayoutEffect } = wp.element;

import Markdown from 'markdown-to-jsx';
import { TransitionBlock, useClasses } from '@app/chatbot/helpers';
import { useChatbotContext } from '@app/chatbot/ChatbotContext';
import ChatbotReply from './ChatbotReply';
import ChatbotInput from './ChatbotInput';
import ChatbotSubmit from './ChatbotSubmit';
import ChatbotHeader from './ChatbotHeader';
import ChatbotTrigger from './ChatbotTrigger';
import ChatUploadIcon from './ChatUploadIcon';

const markdownOptions = {
  overrides: {
    a: {
      props: {
        target: "_blank",
      },
    },
  }
};

const ChatbotUI = (props) => {
  const css = useClasses();
  const { style } = props;
  const [ autoScroll, setAutoScroll ] = useState(true);
  const { state, actions } = useChatbotContext();
  const { theme, botId, customId, messages, textCompliance, isWindow, fullscreen, iconPosition, iconBubble,
    windowed, cssVariables, error, conversationRef, open, busy, uploadIconPosition } = state;
  const { resetError } = actions;
  const themeStyle = useMemo(() => theme?.type === 'css' ? theme?.style : null, [theme]);

  const baseClasses = css('mwai-chatbot', {
    [`mwai-${theme?.themeId}-theme`]: true,
    'mwai-window': isWindow,
    'mwai-bubble': iconBubble,
    'mwai-open': open,
    'mwai-fullscreen': !windowed || (!isWindow && fullscreen),
    'mwai-bottom-left': iconPosition === 'bottom-left',
    'mwai-top-right': iconPosition === 'top-right',
    'mwai-top-left': iconPosition === 'top-left',
  });

  // #region Auto Scroll
  useLayoutEffect(() => {
    if (autoScroll && conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages, autoScroll, conversationRef, busy]);

  const onScroll = () => {
    if (conversationRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = conversationRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 1; // Allowing a small margin
      setAutoScroll(isAtBottom);
    }
  };
  // #endregion

  const messageList = useMemo(() => messages?.map((message) => (
    <ChatbotReply key={message.id} message={message} />
  )), [messages]);

  return (
    <TransitionBlock id={`mwai-chatbot-${customId || botId}`}
      className={baseClasses} style={{ ...cssVariables, ...style }}
      if={true} disableTransition={!isWindow}>
      {themeStyle && <style>{themeStyle}</style>}

      <ChatbotTrigger />

      <ChatbotHeader />

      <div className="mwai-content">

        <div ref={conversationRef} className="mwai-conversation" onScroll={onScroll}>
          {messageList}
        </div>

        {error && <div className="mwai-error" onClick={() => resetError()}>
          <Markdown options={markdownOptions}>{error}</Markdown>
        </div>}

        <div className="mwai-input">
          <ChatbotInput />
          <ChatbotSubmit />
        </div>

        <div className="mwai-footer">

          <div className="mwai-tools">
            {uploadIconPosition === 'mwai-tools' && <ChatUploadIcon />}
          </div>

          {textCompliance && (
            <div className='mwai-compliance' dangerouslySetInnerHTML={{ __html: textCompliance }} />
          )}

        </div>

      </div>

    </TransitionBlock>
  );
};

export default ChatbotUI;