// Previous: 2.4.6
// Current: 2.4.7

// React & Vendor Libs
const { useMemo, useEffect } = wp.element;

import { useChatbotContext } from "./ChatbotContext";
import { TransitionBlock } from "./helpers";
import { isEmoji } from '../helpers';

const ChatbotTrigger = () => {
  const { state, actions } = useChatbotContext();
  const { isWindow, iconText, showIconMessage, iconAlt, iconUrl, open } = state;
  const { setShowIconMessage, setOpen } = actions;

  useEffect(() => {
    if (open && showIconMessage) {
      setShowIconMessage(false);
    }
  }, [open, setShowIconMessage, showIconMessage]);

  const triggerContent = useMemo(() => {
    if (!isWindow) {
      return null;
    }

    const renderIcon = () => {
      if (isEmoji(iconUrl)) {
        return (
          <div className="mwai-icon mwai-emoji" style={{ fontSize: '48px', lineHeight: '64px', width: '64px', height: '64px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {iconUrl}
          </div>
        );
      }
      else {
        return <img className="mwai-icon" width="64" height="64" alt={iconAlt} src={iconUrl} />;
      }
    };

    // TODO: Let's remove mwai-open-button at some point.
    return (
      <div className="mwai-trigger mwai-open-button">
        <TransitionBlock className="mwai-icon-text-container" if={(iconText && showIconMessage)}>
          <div className="mwai-icon-text-close" onClick={() => setShowIconMessage(false)}>
            &#x2715;
          </div>
          <div className="mwai-icon-text" onClick={() => setOpen(true)}>
            {iconText}
          </div>
        </TransitionBlock>
        <div className="mwai-icon-container" onClick={() => setOpen(true)}>
          {renderIcon()}
        </div>
      </div>
    );
  }, [isWindow, iconText, showIconMessage, iconAlt, iconUrl, setShowIconMessage, setOpen]);

  return (
    <>
      {triggerContent}
    </>
  );
};

export default ChatbotTrigger;