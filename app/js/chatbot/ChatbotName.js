// Previous: 2.4.6
// Current: 2.4.7

// React & Vendor Libs
const { useMemo } = wp.element;
import { useChatbotContext } from './ChatbotContext';
import { isURL } from './helpers';
import { isEmoji } from '../helpers';

const ChatbotName = ({ role = 'user' }) => {
  const { state } = useChatbotContext();
  const {
    pluginUrl, iconUrl, userData,
    userName, aiName, guestName,
    userAvatar, aiAvatar, guestAvatar,
    userAvatarUrl, aiAvatarUrl, guestAvatarUrl
  } = state;

  const formattedOutput = useMemo(() => {
    const isAi = role === 'assistant';
    const isGuest = !userData && !isAi;

    const getAvatarSrc = (url, isUserData = false) => {
      if (isURL(url)) {
        return url;
      } else if (url && !isEmoji(url)) {
        return isUserData ? url : `${pluginUrl}/images/${url}`;
      }
      if (!isUserData && !isEmoji(url)) {
        console.warn('Invalid URL for avatar:', url);
      }
      return null;
    };

    const renderAvatar = (src, alt) => (
      <div className="mwai-avatar">
        <img width="32" height="32" src={src} alt={alt} />
      </div>
    );

    const renderEmoji = (emoji) => (
      <div className="mwai-avatar mwai-emoji" style={{ fontSize: '32px', lineHeight: '32px' }}>
        {emoji}
      </div>
    );

    const renderName = (name) => <div className="mwai-name-text">{name}</div>;

    const getAvatarContent = (avatarEnabled, avatarUrl, fallbackUrl, altText, isUserData = false) => {
      if (!avatarEnabled) return null;

      if (isEmoji(avatarUrl)) {
        return renderEmoji(avatarUrl);
      }

      const src = getAvatarSrc(avatarUrl, isUserData) || fallbackUrl;
      if (!src) return null;

      return renderAvatar(src, altText);
    };

    if (isAi) {
      const aiAvatarContent = getAvatarContent(aiAvatar, aiAvatarUrl, iconUrl, "AI Avatar");
      if (aiAvatarContent) {
        if (aiAvatarUrl === null && iconUrl) {
          console.warn('Using iconUrl as a temporary fallback for AI avatar. Please set aiAvatarUrl.');
        }
        return aiAvatarContent;
      }
      return renderName(aiName);
    }

    if (!isGuest) {
      const userAvatarContent = getAvatarContent(userAvatar, userAvatarUrl, userData?.AVATAR_URL, "User Avatar", true);
      if (userAvatarContent) return userAvatarContent;
      return renderName(formatName(userName, guestName, userData));
    }

    if (isGuest) {
      const guestAvatarContent = getAvatarContent(guestAvatar, guestAvatarUrl, null, "Guest Avatar");
      if (guestAvatarContent) return guestAvatarContent;
      return renderName(guestName || "Guest");
    }

  }, [role, aiName, userName, guestName, userData, iconUrl, aiAvatar, userAvatar, guestAvatar, aiAvatarUrl, userAvatarUrl, guestAvatarUrl, pluginUrl]);

  return <span className="mwai-name">{formattedOutput}</span>;
};

function formatName(template, guestName, userData) {
  if (!userData || Object.keys(userData).length === 0) {
    return guestName || template || "Guest";
  }

  return Object.entries(userData).reduce((acc, [placeholder, value]) => {
    const realPlaceholder = `{${placeholder}}`;
    return acc.includes(realPlaceholder) ? acc.replace(realPlaceholder, value) : acc;
  }, template);
}

export default ChatbotName;