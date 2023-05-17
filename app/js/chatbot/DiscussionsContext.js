// Previous: none
// Current: 1.6.81

const { useContext, createContext, useState, useMemo, useEffect, useLayoutEffect, useCallback, useRef } = wp.element;

import { useModClasses, getCircularReplacer } from '@app/chatbot/helpers';

const DiscussionsContext = createContext();

export const useDiscussionsContext = () => {
  const context = useContext(DiscussionsContext);
  if (!context) {
    throw new Error('useDiscussionsContext must be used within a DiscussionsContextProvider');
  }
  return context;
};

export const DiscussionsContextProvider = ({ children, ...rest }) => {
  const { params, system, theme, atts } = rest;
  const { modCss } = useModClasses(theme);
  const shortcodeStyles = theme?.settings || {};
  const [ discussions, setDiscussions ] = useState([]);
  const [ busy, setBusy ] = useState(false);

  const id = system.id;
  const chatId = system.chatId;
  const restNonce = system.restNonce;
  const pluginUrl = system.pluginUrl;
  const restUrl = system.restUrl;
  const debugMode = system.debugMode; 

  const cssVariables = useMemo(() => {
    const cssVariables = Object.keys(shortcodeStyles).reduce((acc, key) => {
      acc[`--mwai-${key}`] = shortcodeStyles[key];
      return acc;
    }, {});
    return cssVariables;
  }, [pluginUrl, shortcodeStyles]);

  const refresh = useCallback(async () => {
    try {
      const body = {};
      if (debugMode) { console.log('[DISCUSSIONS] OUT: ', body); }
      const response = await fetch(`${restUrl}/mwai-ui/v1/discussions/list`, { method: 'POST', headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': restNonce,
        },
        body: JSON.stringify(body, getCircularReplacer())
      });
      const data = await response.json()
      if (debugMode) { console.log('[DISCUSSIONS] IN: ', data); }
      const conversations = data.chats.map((conversation) => {
        const messages = JSON.parse(conversation.messages);
        const extra = JSON.parse(conversation.extra);
        return { ...conversation, messages, extra };
      });
      setDiscussions(conversations);
    }
    catch (err) {
      console.error(err);
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, []);

  const onDiscussionClick = async (discussionId) => {
    const discussion = discussions.find(x => x.chatId === discussionId);
    if (!discussion) {
      console.error(`Discussion not found.`, { discussionId, discussions });
      return;
    }
    const chatbot = MwaiAPI.getChatbot(chatId);
    if (!chatbot) {
      console.error(`Chatbot not found.`, { chatId, chatbots: MwaiAPI.chatbots });
      return;
    }

    const freshMessages = discussion.messages.map(x => ({ 
      role: x.type === 'ai' ? 'assistant' : 'user',
      text: x.text,
      html: x.text
    }));
    chatbot.setMessages(freshMessages);
    console.log(freshMessages);
  };

  const actions = { onDiscussionClick };

  const state = { chatId, pluginUrl, busy, setBusy, modCss, cssVariables, discussions, theme };

  return (
    <DiscussionsContext.Provider value={{ state, actions }}>
      {children}
    </DiscussionsContext.Provider>
  );
};