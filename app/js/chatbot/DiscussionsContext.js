// Previous: 1.6.81
// Current: 1.6.82

// React & Vendor Libs
const { useContext, createContext, useState, useMemo, useEffect, useLayoutEffect, useCallback, useRef } = wp.element;

// AI Engine
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

  // System Parameters
  const id = system.id;
  const botId = system.botId;
  const restNonce = system.restNonce;
  const pluginUrl = system.pluginUrl;
  const restUrl = system.restUrl;
  const debugMode = system.debugMode; 

  // UI Parameters
  const cssVariables = useMemo(() => {
    const cssVariables = Object.keys(shortcodeStyles).reduce((acc, key) => {
      acc[`--mwai-${key}`] = shortcodeStyles[key];
      return acc;
    }, {});
    return cssVariables;
  }, [pluginUrl, shortcodeStyles]);

  const refresh = useCallback(async () => {
    try {
      const body = { botId };
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

  const onDiscussionClick = async (chatId) => {
    const discussion = discussions.find(x => x.chatId === chatId);
    if (!discussion) {
      console.error(`Discussion not found.`, { chatId, discussions });
      return;
    }
    const chatbot = MwaiAPI.getChatbot(botId);
    if (!chatbot) {
      console.error(`Chatbot not found.`, { botId, chatbots: MwaiAPI.chatbots });
      return;
    }
    chatbot.setContext({ chatId, messages: discussion.messages });
  };

  const actions = { onDiscussionClick };

  const state = { botId, pluginUrl, busy, setBusy, modCss, cssVariables, discussions, theme };

  return (
    <DiscussionsContext.Provider value={{ state, actions }}>
      {children}
    </DiscussionsContext.Provider>
  );
};
