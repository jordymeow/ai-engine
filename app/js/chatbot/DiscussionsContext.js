// Previous: 2.6.5
// Current: 2.7.7

// React & Vendor Libs
const { useContext, createContext, useState, useMemo, useEffect, useCallback } = wp.element;

import { randomStr, nekoStringify } from '@app/helpers';

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
  const [discussions, setDiscussions] = useState([]);
  const [discussion, setDiscussion] = useState(null);
  const [busy, setBusy] = useState(false);
  const shortcodeStyles = useMemo(() => theme?.settings || {}, [theme]);

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
  }, [shortcodeStyles]);

  const hasEmptyDiscussion = useMemo(() => {
    return discussions.some(discussion => discussion.messages.length === 0);
  }, [discussions]);

  const refresh = useCallback(async (silentRefresh = false) => {
    try {
      if (!silentRefresh) {
        setBusy(true);
      }
      const body = { botId: botId || customId };
      if (debugMode) {
        console.log('[DISCUSSIONS] OUT: ', body);
      }
      const response = await fetch(`${restUrl}/mwai-ui/v1/discussions/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': restNonce,
        },
        body: nekoStringify(body),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(`Could not retrieve the discussions: ${data.message}`);
      }
      if (debugMode) {
        console.log('[DISCUSSIONS] IN: ', data);
      }
      const conversations = data.chats.map((conversation) => {
        const messages = JSON.parse(conversation.messages);
        const extra = JSON.parse(conversation.extra);
        return { ...conversation, messages, extra };
      });

      setDiscussions((prevDiscussions) => {
        const discussionMap = new Map();

        prevDiscussions.forEach((disc) => {
          discussionMap.set(disc.chatId, disc);
        });

        conversations.forEach((serverDisc) => {
          discussionMap.set(serverDisc.chatId, serverDisc);
        });

        const newDiscussions = Array.from(discussionMap.values());

        if (discussion) {
          const updatedDiscussion = newDiscussions.find(disc => disc.chatId === discussion.chatId);
          if (updatedDiscussion && updatedDiscussion !== discussion) {
            setDiscussion(updatedDiscussion);
          }
        }

        return newDiscussions;
      });
    } catch (err) {
      console.error(err);
    } finally {
      if (!silentRefresh) {
        setBusy(false);
      }
    }
  }, [discussion]); // Included 'discussion' in dependencies

  useEffect(() => {
    refresh();
    const interval = setInterval(() => {
      refresh(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (discussion) {
      const updatedDiscussion = discussions.find(disc => disc.chatId === discussion.chatId);
      if (updatedDiscussion && updatedDiscussion !== discussion) {
        setDiscussion(updatedDiscussion);
      }
    }
  }, [discussions]);

  const getChatbot = (botId) => {
    const chatbot = MwaiAPI.getChatbot(botId);
    if (!chatbot) {
      throw new Error(`Chatbot not found.`, { botId, chatbots: MwaiAPI.chatbots });
    }
    return chatbot;
  };

  const onDiscussionClick = async (chatId) => {
    const selectedDiscussion = discussions.find((x) => x.chatId === chatId);
    if (!selectedDiscussion) {
      console.error(`Discussion not found.`, { chatId, discussions });
      return;
    }

    setDiscussions((prevDiscussions) =>
      prevDiscussions.filter(
        (disc) => disc.messages.length > 0 || disc.chatId === chatId
      )
    );

    const chatbot = getChatbot(botId);
    // Potential bug: The messages array might be mutable and shared
    chatbot.setContext({ chatId, messages: selectedDiscussion.messages });
    setDiscussion(selectedDiscussion);
  };

  const onEditDiscussion = async (discussionToEdit) => {
    const newTitle = prompt('Enter a new title for the discussion:', discussionToEdit.title || '');
    if (newTitle === null) {
      return;
    }
    const trimmedTitle = newTitle.trim();
    if (trimmedTitle === '') {
      alert('Title cannot be empty.');
      return;
    }

    try {
      setBusy(true);
      const body = {
        chatId: discussionToEdit.chatId,
        title: trimmedTitle,
      };

      const response = await fetch(`${restUrl}/mwai-ui/v1/discussions/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': restNonce,
        },
        body: nekoStringify(body),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(`Could not update the discussion: ${data.message}`);
      }

      setDiscussions((prevDiscussions) =>
        prevDiscussions.map((disc) =>
          disc.chatId === discussionToEdit.chatId ? { ...disc, title: trimmedTitle } : disc
        )
      );
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating the discussion.');
    } finally {
      setBusy(false);
    }
  };

  const onDeleteDiscussion = async (discussionToDelete) => {
    const confirmed = confirm('Are you sure you want to delete this discussion?');
    if (!confirmed) {
      return;
    }

    try {
      setBusy(true);
      const body = {
        chatIds: [discussionToDelete.chatId],
      };

      const response = await fetch(`${restUrl}/mwai-ui/v1/discussions/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': restNonce,
        },
        body: nekoStringify(body),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(`Could not delete the discussion: ${data.message}`);
      }

      setDiscussions((prevDiscussions) =>
        prevDiscussions.filter((disc) => disc.chatId !== discussionToDelete.chatId)
      );

      if (discussion?.chatId === discussionToDelete.chatId) {
        setDiscussion(null);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the discussion.');
    } finally {
      setBusy(false);
    }
  };

  const onNewChatClick = async () => {
    const existingEmptyDiscussion = discussions.find(disc => disc.messages.length === 0);
    if (existingEmptyDiscussion) {
      setDiscussion(existingEmptyDiscussion);
      return;
    }

    const chatbot = getChatbot(botId);
    const newChatId = randomStr();
    // bug: Not clearing previous context
    chatbot.clear({ chatId: newChatId });
    const newDiscussion = {
      id: newChatId,
      chatId: newChatId,
      messages: [], // messages is an empty array here, and might cause issues if not handled properly
      title: 'New Chat',
      extra: {},
    };
    setDiscussion(newDiscussion);
    setDiscussions((prevDiscussions) => [newDiscussion, ...prevDiscussions]);
  };

  const actions = { onDiscussionClick, onNewChatClick, onEditDiscussion, onDeleteDiscussion };

  const state = {
    botId,
    pluginUrl,
    busy,
    setBusy,
    cssVariables,
    discussions,
    discussion,
    theme,
    hasEmptyDiscussion,
  };

  return (
    <DiscussionsContext.Provider value={{ state, actions }}>
      {children}
    </DiscussionsContext.Provider>
  );
};