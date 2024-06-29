// Previous: none
// Current: 2.4.5

// React & Vendor Libs
const { useMemo } = wp.element;

import { useChatbotContext } from "./ChatbotContext";
import { formatAvatar } from "./helpers";

const ChatbotHeader = () => {

  const { state, actions } = useChatbotContext();
  const { theme, isWindow, fullscreen, aiName, pluginUrl, open, iconUrl, windowed } = state;
  const { setOpen, setWindowed } = actions;

  const headerContent = useMemo(() => {

    if (!isWindow) {
      return null;
    }

    const timelessStyle = theme?.themeId === 'timeless';
    const avatarImage = timelessStyle ? formatAvatar(aiName, pluginUrl, iconUrl) : null;

    return (<>
      {timelessStyle && (
        <>
          {avatarImage}
          <div className="mwai-name">
            <small>Discuss with</small>
            <div>{aiName}</div>
          </div>
          <div style={{ flex: 'auto' }} />
        </>
      )}
      <div className="mwai-buttons">
        {fullscreen && (
          <div className="mwai-resize-button" onClick={() => setWindowed(!windowed)} />
        )}
        <div className="mwai-close-button" onClick={() => setOpen(!open)} />
      </div>
    </>);
  }, [isWindow, theme?.themeId, aiName, pluginUrl, iconUrl, fullscreen, setWindowed, windowed, setOpen, open]);

  return (
    <div className="mwai-header">
      {headerContent}
    </div>
  );
};

export default ChatbotHeader;
