// Previous: none
// Current: 2.4.5

// React & Vendor Libs
const { useMemo } = wp.element;

import { useChatbotContext } from './ChatbotContext';
import { handlePlaceholders, isURL } from './helpers';

const ChatbotName = ({ role = 'user' }) => {
  const { state } = useChatbotContext();
  const { pluginUrl, iconUrl, guestName, userData, userName, aiName, userAvatar, aiAvatar } = state;

  const getAvatar = (src) => (
    <div className="mwai-avatar">
      <img width="32" height="32" src={src} />
    </div>
  );

  const getDefaultAvatar = (isAi = false) => {
    const avatar = isAi ? (iconUrl ? iconUrl : `${pluginUrl}/images/chat-openai.svg`) : `${pluginUrl}/images/avatar-user.svg`;
    return getAvatar(avatar);
  };

  const getNameText = (name) => <div className="mwai-name-text">{name}</div>;

  const formatName = (name, guestName, userData, pluginUrl, isAi = false) => {
    if (!name) {
      return userData && !isAi ? getAvatar(userData.AVATAR_URL) : getDefaultAvatar(isAi);
    }
    else if (isURL(name)) {
      return getAvatar(name);
    }
    else if ((isAi && aiAvatar) || (!isAi && userAvatar)) {
      return getDefaultAvatar(isAi);
    }
    else {
      const formattedName = handlePlaceholders(name, guestName, userData);
      return getNameText(formattedName);
    }
  };

  const formattedOutput = useMemo(() => {
    if (role === 'assistant') {
      return formatName(aiName, guestName, userData, pluginUrl, true);
    }
    return formatName(userName, guestName, userData, pluginUrl, false);
  }, [role, aiName, userName, guestName, userData, pluginUrl, iconUrl, aiAvatar, userAvatar]);

  return <span className="mwai-name">{formattedOutput}</span>;
};

export default ChatbotName;
