// Previous: 2.4.5
// Current: 2.4.7

// React & Vendor Libs
const { useMemo } = wp.element;

import { isEmoji } from "@app/helpers";
import { useChatbotContext } from "./ChatbotContext";
import { isURL } from "./helpers";

function formatAvatar(aiName, pluginUrl, iconUrl, aiAvatarUrl) {
  const getAvatarSrc = (url) => {
    if (isURL(url)) {
      return url;
    } else if (url) {
      return `${pluginUrl}/images/${url}`;
    }
    return null;
  };

  const renderAvatar = (src, alt) => (
    <div className="mwai-avatar">
      <img alt={alt} src={src} />
    </div>
  );

  const renderEmoji = (emoji) => (
    <div className="mwai-avatar mwai-emoji" style={{ fontSize: '48px', lineHeight: '48px' }}>
      {emoji}
    </div>
  );

  if (isEmoji(aiAvatarUrl || iconUrl)) {
    return renderEmoji(aiAvatarUrl || iconUrl);
  }

  // Priority: aiAvatarUrl > iconUrl > default image
  const avatarSrc = getAvatarSrc(aiAvatarUrl) || iconUrl || `${pluginUrl}/images/chat-openai.svg`;

  if (avatarSrc) {
    return renderAvatar(avatarSrc, "AI Engine");
  }

  // If no avatar is available, return the aiName as text
  return <div className="mwai-name-text">{aiName}</div>;
}

const ChatbotHeader = () => {

  const { state, actions } = useChatbotContext();
  const { theme, isWindow, fullscreen, aiName, pluginUrl, open, iconUrl, aiAvatarUrl, windowed } = state;
  const { setOpen, setWindowed } = actions;

  const headerContent = useMemo(() => {

    if (!isWindow) {
      return null;
    }

    const timelessStyle = theme?.themeId === 'timeless';
    const avatarImage = timelessStyle ? formatAvatar(aiName, pluginUrl, iconUrl, aiAvatarUrl) : null;

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
  }, [isWindow, theme?.themeId, aiName, pluginUrl, iconUrl, aiAvatarUrl, fullscreen, setWindowed, windowed, setOpen, open]);

  return (
    <div className="mwai-header">
      {headerContent}
    </div>
  );
};

export default ChatbotHeader;
