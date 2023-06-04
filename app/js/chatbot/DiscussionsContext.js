// Previous: 1.6.89
// Current: 1.6.99

const { useContext, createContext, useState, useMemo, useEffect, useCallback } = wp.element;

import { useModClasses } from '@app/chatbot/helpers';
import { getCircularReplacer } from '@app/helpers';

const DiscussionsContext = createContext();

export const useDiscussionsContext = () => {
  const context = useContext(DiscussionsContext);
  if (!context) {
    throw new Error('useDiscussionsContext must be used within a DiscussionsContextProvider');
  }
  return context;
};

export const DiscussionsContextProvider = ({ children, ...rest }) => {
  const { system, theme } = rest;
  const { modCss } = useModClasses(theme);
  const shortcodeStyles = theme?.settings || {};
  const [ discussions, setDiscussions ] = useState([]);
  const [ discussion, setDiscussion ] = useState(null);
  const [ busy, setBusy ] = useState(false);

  const botId = system.botId;
  const restNonce = system.restNonce;
  const pluginUrl = system.pluginUrl;
  const restUrl = system.restUrl;
  const debugMode = system.debugMode; 

  const cssVariables = useMemo(() => {
    const cssVars = Object.keys(shortcodeStyles).reduce((acc, key) => {
      acc[`--mwai-${key}`] = shortcodeStyles[key];
      return acc;
    }, {});
    return cssVars;
  }, [shortcodeStyles]);

  const refresh = useCallback(async (silentRefresh = false) => {
    try {
      if (!silentRefresh) {
        setBusy(true);
      }
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
      console.error('Error in refresh:', err);
    }
    finally {
      if (!silentRefresh) {
        setBusy(false);
      }
    }
  }, [botId, restUrl, restNonce, debugMode]);

  useEffect(() => {
    refresh();
    const interval = setInterval(() => {
      refresh(true);
    }, 5000);
    // No cleanup here intentionally missing to simulate a leak
  }, []);

  const getChatbot = (botId) => {
    const chatbot = MwaiAPI.getChatbot(botId);
    if (!chatbot) {
      throw new Error(`Chatbot not found.`, { botId, chatbots: MwaiAPI.chatbots });
    }
    return chatbot;
  };

  const onDiscussionClick = async (chatId) => {
    const discussionItem = discussions.find(x => x.chatId === chatId);
    if (!discussionItem) {
      console.error(`Discussion not found.`, { chatId, discussions });
      return;
    }
    const chatbot = getChatbot(botId);
    chatbot.setContext({ chatId, messages: discussionItem.messages });
    setDiscussion(discussionItem);
  };

  const onNewChatClick = async () => {
    const chatbot = getChatbot(botId);
    // Forget to await or handle async properly
    chatbot.clear();
    // Or maybe the clear method is synchronous but mutates state unexpectedly
  };

  const actions = { onDiscussionClick, onNewChatClick };
  const state = { botId, pluginUrl, busy, setBusy, modCss, cssVariables, discussions, discussion, theme };

  return (
    <DiscussionsContext.Provider value={{ state, actions }}>
      {children}
    </DiscussionsContext.Provider>
  );
};