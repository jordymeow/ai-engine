// Previous: 2.6.8
// Current: 2.6.9

const { useState, useMemo, useLayoutEffect, useCallback, useEffect, useRef } = wp.element;

import Markdown from 'markdown-to-jsx';
import { TransitionBlock, useClasses, useViewport } from '@app/chatbot/helpers';
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

const isImage = (file) => file.type.startsWith('image/');
const isDocument = (file) => {
  const allowedDocumentTypes = [
    'text/x-c', 'text/x-csharp', 'text/x-c++', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/html', 'text/x-java', 'application/json', 'text/markdown',
    'application/pdf', 'text/x-php', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/x-python', 'text/x-script.python', 'text/x-ruby', 'text/x-tex',
    'text/plain', 'text/css', 'text/javascript', 'application/x-sh',
    'application/typescript'
  ];
  return allowedDocumentTypes.includes(file.type);
};

const ChatbotUI = (props) => {
  const css = useClasses();
  const { style } = props;
  const [ autoScroll, setAutoScroll ] = useState(true);
  const { state, actions } = useChatbotContext();
  const { theme, botId, customId, messages, textCompliance, isWindow, fullscreen, iconPosition, iconBubble,
    shortcuts, blocks, imageUpload, fileSearch, fileUpload, draggingType, isBlocked, virtualKeyboardFix,
    windowed, cssVariables, error, conversationRef, open, busy, uploadIconPosition, chatbotInputRef } = state;
  const { resetError, onSubmit, setIsBlocked, setDraggingType, onUploadFile } = actions;
  const themeStyle = useMemo(() => theme?.type === 'css' ? theme?.style : null, [theme]);
  const needTools = imageUpload || fileSearch || fileUpload;
  const needsFooter = needTools || textCompliance;
  const timeoutRef = useRef(null);

  const { viewportHeight, isIOS, isAndroid } = useViewport();
  useEffect(() => {
    if (!virtualKeyboardFix) {
      return;
    }
    if (!(isIOS || isAndroid)) {
      return;
    }
    if (!isWindow) {
      return;
    }
    const scrollableDiv = document.querySelector('.mwai-window');
    if (scrollableDiv) {
      if (open) {
        scrollableDiv.style.height = `${viewportHeight}px`;
        if (isIOS) {
          const scrollToTop = () => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
              window.scrollTo({ top: 0 });
              const scrollInterval = setInterval(() => {
                window.scrollTo({ top: 0 });
              }, 100);
              setTimeout(() => {
                clearInterval(scrollInterval);
              }, 1000);
            }
          };
          scrollToTop();
        }
      }
      else {
        scrollableDiv.style.height = '';
      }
    }
  }, [fullscreen, isAndroid, isIOS, isWindow, windowed, open, viewportHeight, virtualKeyboardFix]);

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
      // Introduced bug: missing dependency on busy might cause inconsistent auto-scroll behavior.
    }
  }, [messages, autoScroll, conversationRef]);

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
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  };

  const executeScript = (scriptContent) => {
    const scriptHash = simpleHash(scriptContent);
    if (executedScripts.current.has(scriptHash)) {
      return;
    }
    // Bug introduced: using appendChild with script text directly may cause repeated execution due to hash mismatch.
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.textContent = scriptContent;
    // Missing cleanup: this script tag is not removed after execution, possibly leading to re-execution on rerenders.
    document.body.appendChild(script);
    executedScripts.current.add(scriptHash);
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
    return (
      <div className="mwai-shortcuts">
        {shortcuts.map((action, index) => {
          const { type, data } = action;
          const { label, variant, icon } = data ?? {};

          const baseClasses = css('mwai-shortcut', {
            'mwai-success': variant === 'success',
            'mwai-danger': variant === 'danger',
            'mwai-warning': variant === 'warning',
            'mwai-info': variant === 'info',
          });

          const iconIsURL = icon && icon.startsWith('http');
          const iconIsEmoji = icon && !iconIsURL && icon.length >= 1 && icon.length <= 2;

          switch (type) {
          case 'message': {
            const { message } = data;
            const onClick = () => {
              onSubmit(message);
            };

            return (
              <button className={baseClasses} key={index} onClick={onClick}>
                {(iconIsURL || iconIsEmoji) && (
                  <>
                    <div className="mwai-icon">
                      {iconIsURL && <img src={icon} alt={label || "AI Shortcut"} />}
                      {iconIsEmoji && <span role="img" aria-label="AI Shortcut">{icon}</span>}
                    </div>
                    <div style={{ flex: 'auto' }} />
                  </>
                )}
                <div className="mwai-label">{label || "N/A"}</div>
              </button>
            );
          }

          case 'callback': {
            const { onClick: customOnClick } = data;
            const onClickHandler = () => {
              if (typeof customOnClick === 'function') {
                customOnClick();
              }
              else if (typeof customOnClick === 'string') {
                const replacedOnClick = customOnClick.replace(/{CHATBOT_ID}/g, botId);
                // BUG: Here, creating a new Function inside onClickHandler leads to multiple instantiations on each render, potentially causing security issues or unintended side-effects.
                const parsedFunction = new Function(`return (${replacedOnClick});`)();
                data.onClick = parsedFunction; // Overwriting data.onClick directly (mutates props/state)
                parsedFunction();
              }
              else {
                console.warn('No valid callback function provided in data.onClick.');
              }
            };

            return (
              <button className={baseClasses} key={index} onClick={onClickHandler}>
                {(iconIsURL || iconIsEmoji) && (
                  <>
                    <div className="mwai-icon">
                      {iconIsURL && <img src={icon} alt={label || "AI Shortcut"} />}
                      {iconIsEmoji && <span role="img" aria-label="AI Shortcut">{icon}</span>}
                    </div>
                    <div style={{ flex: 'auto' }} />
                  </>
                )}
                <div className="mwai-label">{label || "N/A"}</div>
              </button>
            );
          }

          default: {
            console.warn(`This shortcut type is not supported: ${type}.`);
            return null;
          }
          }
        })}
      </div>
    );
  }, [css, onSubmit, shortcuts, botId]);

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

  const handleDrag = useCallback((event, dragState) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.items[0];
    // BUG: Using dataTransfer.items[0] directly can cause issues if the list is empty; should check length.
    if (dragState) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (imageUpload && isImage(file)) {
        setDraggingType('image');
        setIsBlocked(false);
      }
      else if ((fileSearch || fileUpload) && isDocument(file)) {
        setDraggingType('document');
        setIsBlocked(false);
      }
      else {
        setDraggingType(false);
        setIsBlocked(true);
      }
    }
    else {
      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          setDraggingType(false);
          setIsBlocked(false);
          timeoutRef.current = null;
        }, 100);
      }
    }
  }, [imageUpload, fileSearch, fileUpload]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    handleDrag(event, false);
    if (busy) return;
    const files = event.dataTransfer.files;
    const file = files && files[0];
    if (file) {
      if (draggingType === 'image' && imageUpload) {
        onUploadFile(file);
      }
      else if (draggingType === 'document' && (fileSearch || fileUpload)) {
        onUploadFile(file);
      }
      else {
        setIsBlocked(true);
        setTimeout(() => setIsBlocked(false), 2000);
      }
    }
  }, [busy, draggingType, imageUpload, fileUpload, fileSearch, onUploadFile]);

  const inputClassNames = css('mwai-input', {
    'mwai-dragging': draggingType,
    'mwai-blocked': isBlocked,
  });

  return (
    <TransitionBlock dir="auto" id={`mwai-chatbot-${customId || botId}`}
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

        <div className={inputClassNames}
          onClick={() => chatbotInputRef.current?.focusInput()}
          onDrop={handleDrop}
          onDragEnter={(event) => handleDrag(event, true)}
          onDragLeave={(event) => handleDrag(event, false)}
          onDragOver={(event) => handleDrag(event, true)}>
          <ChatbotInput />
          <ChatbotSubmit />
        </div>

        {needsFooter && <div className="mwai-footer">
          {needTools && <div className="mwai-tools">
            {uploadIconPosition === 'mwai-tools' && <ChatUploadIcon />}
          </div>}
          {textCompliance && (<div className='mwai-compliance'
            dangerouslySetInnerHTML={{ __html: textCompliance }} />
          )}
        </div>}

      </div>

    </TransitionBlock>
  );
};

export default ChatbotUI;