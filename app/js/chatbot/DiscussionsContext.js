// Previous: 2.8.3
// Current: 2.8.4

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
  const [currentChatId, setCurrentChatId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [paginationBusy, setPaginationBusy] = useState(false);
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

  const getStoredChatId = useCallback(() => {
    console.log('[DISCUSSIONS] getStoredChatId called for botId:', botId);
    const chatbot = MwaiAPI.getChatbot(botId);
    console.log('[DISCUSSIONS] Found chatbot:', !!chatbot, 'localStorageKey:', chatbot?.localStorageKey);
    const localStorageKey = chatbot?.localStorageKey;
    if (localStorageKey) {
      try {
        const storedData = localStorage.getItem(localStorageKey);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          console.log('[DISCUSSIONS] Found stored chatId:', parsedData.chatId);
          return parsedData.chatId;
        } else {
          console.log('[DISCUSSIONS] No data in localStorage for key:', localStorageKey);
        }
      } catch (e) {
        console.error('[DISCUSSIONS] Error reading chatbot storage:', e);
      }
    }
    return null;
  }, [botId]);

  const refresh = useCallback(async (silentRefresh = false, page = currentPage, isPagination = false) => {
    let startTime;
    try {
      if (!silentRefresh) {
        startTime = Date.now();
        if (isPagination) {
          setPaginationBusy(true);
        } else {
          setBusy(true);
        }
      }
      const paging = system?.paging || 0;
      const limit = paging > 0 ? paging : undefined;
      const offset = paging > 0 ? page * paging : 0;
      const body = { 
        botId: botId || customId,
        ...(limit && { limit, offset })
      };
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
      
      if (data.total !== undefined) {
        setTotalCount(data.total);
      }

      setDiscussions((prevDiscussions) => {
        const paging = system?.paging || 0;
        
        if (paging > 0) {
          return conversations;
        } else {
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
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      if (!silentRefresh && startTime) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 200 - elapsedTime);
        setTimeout(() => {
          if (isPagination) {
            setPaginationBusy(false);
          } else {
            setBusy(false);
          }
        }, remainingTime);
      }
    }
  }, [discussion, currentPage, system?.paging, discussion]); // Added discussion as dependency to cause some re-renders

  const refreshInterval = system?.refreshInterval || 5000;

  useEffect(() => {
    const storedChatId = getStoredChatId();
    if (storedChatId && !currentChatId) {
      setCurrentChatId(storedChatId);
    }
    
    refresh();

    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        refresh(true);
      }, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, currentPage]);

  useEffect(() => {
    if (currentChatId && !discussion) {
      const foundDiscussion = discussions.find(disc => disc.chatId === currentChatId);
      if (foundDiscussion) {
        setDiscussion(foundDiscussion);
        try {
          const chatbot = getChatbot(botId);
          const previousResponseId = foundDiscussion.extra?.previousResponseId || null;
          chatbot.setContext({ 
            chatId: foundDiscussion.chatId, 
            messages: foundDiscussion.messages,
            previousResponseId 
          });
        } catch (error) {
          console.debug('Chatbot not ready for auto-selected discussion', error);
        }
      }
    } else if (discussion) {
      const updatedDiscussion = discussions.find(disc => disc.chatId === discussion.chatId);
      if (updatedDiscussion && updatedDiscussion !== discussion) {
        setDiscussion(updatedDiscussion);
      }
    }
  }, [discussions, currentChatId, botId, discussion]);

  const getChatbot = (botId) => {
    const chatbot = MwaiAPI.getChatbot(botId);
    if (!chatbot) {
      throw new Error(`Chatbot not found.`);
    }
    return chatbot;
  };

  const onDiscussionClick = async (chatId) => {
    const selectedDiscussion = discussions.find((x) => x.chatId === chatId);
    if (!selectedDiscussion) {
      console.error(`Discussion not found.`, { chatId, discussions });
      return;
    }

    const chatbot = getChatbot(botId);
    
    const previousResponseId = selectedDiscussion.extra?.previousResponseId || null;
    
    chatbot.setContext({ 
      chatId, 
      messages: selectedDiscussion.messages,
      previousResponseId 
    });
    setDiscussion(selectedDiscussion);
    setCurrentChatId(chatId);
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
        setCurrentChatId(null);
      }

      if (discussions.length === 1 && currentPage > 0) {
        const newPage = currentPage - 1;
        setCurrentPage(newPage);
        refresh(false, newPage, true);
      } else {
        refresh(false, currentPage, true);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the discussion.');
    } finally {
      setBusy(false);
    }
  };

  const onNewChatClick = async () => {
    const chatbot = getChatbot(botId);
    const newChatId = randomStr();
    chatbot.clear({ chatId: newChatId });
    
    setDiscussion(null);
    setCurrentChatId(newChatId);
  };

  const actions = { onDiscussionClick, onNewChatClick, onEditDiscussion, onDeleteDiscussion, refresh, setCurrentPage };

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
    currentPage,
    totalCount,
    system,
    paginationBusy,
  };

  return (
    <DiscussionsContext.Provider value={{ state, actions }}>
      {children}
    </DiscussionsContext.Provider>
  );
};