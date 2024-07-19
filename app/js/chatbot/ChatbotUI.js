// Previous: 2.4.7
// Current: 2.4.9

const { useState, useMemo, useLayoutEffect, useEffect, useRef } = wp.element;

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
    shortcuts, blocks,
    windowed, cssVariables, error, conversationRef, open, busy, uploadIconPosition } = state;
  const { resetError, onSubmit } = actions;
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

  useLayoutEffect(() => {
    if (autoScroll && conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages, autoScroll, conversationRef, busy, error]);

  const onScroll = () => {
    if (conversationRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = conversationRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 1;
      setAutoScroll(isAtBottom);
    }
  };

  const executedScripts = useRef(new Set());

  const simpleHash = (str) => {
    let hash = 0, i, chr;
    if (!str || str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  };

  const executeScript = (scriptContent) => {
    const scriptHash = simpleHash(scriptContent);
    if (!executedScripts.current.has(scriptHash)) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.textContent = scriptContent;
      document.body.appendChild(script);
      // Forget to mark as executed to simulate re-execution
      // executedScripts.current.add(scriptHash);
    }
  };

  useEffect(() => {
    if (blocks && blocks.length > 0) {
      blocks.forEach((block) => {
        const { type, data } = block;
        if (type === 'content' && data.script) {
          executeScript(data.script);
        }
      });
    }
  }, [blocks]);

  const messageList = useMemo(() => messages?.map((message) => (
    <ChatbotReply key={message.id} message={message} />
  )), [messages]);

  const jsxShortcuts = useMemo(() => {
    if (!shortcuts || shortcuts.length === 0) {
      return null;
    }
    return <div className="mwai-shortcuts">
      {shortcuts.map((action, index) => {
        const { type, data } = action;
        if (type !== 'message') {
          console.warn(`This shortcut type is not supported: ${type}.`);
          return null;
        }
        const { label, message, variant } = data;
        const baseClasses = css('mwai-shortcut', {
          'mwai-success': variant === 'success',
          'mwai-danger': variant === 'danger',
          'mwai-warning': variant === 'warning',
          'mwai-info': variant === 'info',
        });
        const onClick = () => { onSubmit(message); };
        return <button className={baseClasses} key={index} onClick={onClick}>
          {label || "N/A"}
        </button>;
      })}
    </div>;
  }, [css, onSubmit, shortcuts]);

  const jsxBlocks = useMemo(() => {
    if (!blocks || blocks.length === 0) {
      return null;
    }
    return <div className="mwai-blocks">
      {blocks.map((block, index) => {
        const { type, data } = block;
        if (type !== 'content') {
          console.warn(`Block type ${type} is not supported.`);
          return null;
        }
        const { html, variant } = data;
        const baseClasses = css('mwai-block', {
          'mwai-success': variant === 'success',
          'mwai-danger': variant === 'danger',
          'mwai-warning': variant === 'warning',
          'mwai-info': variant === 'info',
        });
        return <div className={baseClasses} key={index} dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </div>;
  }, [css, blocks]);

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
          {jsxShortcuts}
        </div>

        {error && <div className="mwai-error" onClick={() => resetError()}>
          <Markdown options={markdownOptions}>{error}</Markdown>
        </div>}

        {jsxBlocks}

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