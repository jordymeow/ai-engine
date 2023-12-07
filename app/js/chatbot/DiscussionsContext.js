// Previous: 2.0.5
// Current: 2.0.7

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
  const customId = system.customId;
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
  }, [shortcodeStyles, pluginUrl]);

  const refresh = useCallback(async (silentRefresh = false) => {
    try {
      if (!silentRefresh) {
        setBusy(true);
      }
      const body = { botId: botId || customId };
      if (debugMode) { console.log('[DISCUSSIONS] OUT: ', body); }
      const response = await fetch(`${restUrl}/mwai-ui/v1/discussions/list`, { method: 'POST', headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': restNonce,
      },
      body: JSON.stringify(body, getCircularReplacer())
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(`Could not retrieve the discussions: ${data.message}`);
      }
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
    }
    finally {
      if (!silentRefresh) {
        setBusy(false);
      }
    }
  }, [botId, customId, restNonce, restUrl, debugMode]);

  useEffect(() => {
    refresh();
    const interval = setInterval(() => {
      refresh(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  const getChatbot = (id) => {
    const chatbot = MwaiAPI.getChatbot(id);
    if (!chatbot) {
      throw new Error(`Chatbot not found.`, { botId: id, chatbots: MwaiAPI.chatbots });
    }
    return chatbot;
  };

  const onDiscussionClick = async (chatId) => {
    const discussionObj = discussions.find(x => x.chatId === chatId);
    if (!discussionObj) {
      console.error(`Discussion not found.`, { chatId, discussions });
      return;
    }
    const chatbotInstance = getChatbot(botId);
    chatbotInstance.setContext({ chatId, messages: discussionObj.messages });
    setDiscussion(discussionObj);
  };

  const onNewChatClick = async () => {
    const chatbotInstance = getChatbot(botId);
    chatbotInstance.clear();
  };

  const actions = { onDiscussionClick, onNewChatClick };
  const state = { botId, pluginUrl, busy, setBusy, modCss, cssVariables, discussions, discussion, theme };

  return (
    <DiscussionsContext.Provider value={{ state, actions }}>
      {children}
    </DiscussionsContext.Provider>
  );
};