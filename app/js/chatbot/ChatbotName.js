// Previous: 2.4.5
// Current: 2.4.6

// React & Vendor Libs
const { useMemo } = wp.element;

import { useChatbotContext } from './ChatbotContext';
import { isURL } from './helpers';

const ChatbotName = ({ role = 'user' }) => {
  const { state } = useChatbotContext();
  const { pluginUrl, iconUrl, guestName, userData, userName, aiName, userAvatar, aiAvatar } = state;

  const formattedOutput = useMemo(() => {
    const isAi = role === 'assistant';
    const isGuest = !userData && !isAi;
    const name = isAi ? aiName : (userName || (isGuest && guestName));
    const avatar = isAi ? aiAvatar : userAvatar;
    const defaultAvatarSrc = isAi ? (iconUrl || `${pluginUrl}/images/chat-openai.svg`) : `${pluginUrl}/images/avatar-user.svg`;

    const renderAvatar = (src, alt) => (
      <div className="mwai-avatar">
        <img width="32" height="32" src={src} alt={alt} />
      </div>
    );

    if (!isAi && userAvatar && userData?.AVATAR_URL) {
      return renderAvatar(userData.AVATAR_URL, "User Avatar");
    }

    if (!name) {
      return renderAvatar(userData?.AVATAR_URL || defaultAvatarSrc, isAi ? "AI Avatar" : "User Avatar");
    }

    if (isURL(name)) {
      return renderAvatar(name, isAi ? "AI Avatar" : "User Avatar");
    }

    if (avatar && !isGuest) {
      return renderAvatar(defaultAvatarSrc, isAi ? "AI Avatar" : "User Avatar");
    }

    const formattedName = formatName(name, guestName, userData);
    return <div className="mwai-name-text">{formattedName}</div>;
  }, [role, aiName, userName, guestName, userData, iconUrl, aiAvatar, userAvatar, pluginUrl]);

  return <span className="mwai-name">{formattedOutput}</span>;
};

function formatName(template, guestName, userData) {
  if (!userData || Object.keys(userData).length === 0) {
    return guestName || template || "Guest:";
  }

  return Object.entries(userData).reduce((acc, [placeholder, value]) => {
    const realPlaceholder = `{${placeholder}}`;
    return acc.includes(realPlaceholder) ? acc.replace(realPlaceholder, value) : acc;
  }, template);
}

export default ChatbotName;