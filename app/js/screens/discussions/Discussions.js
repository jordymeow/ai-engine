// Previous: 2.3.9
// Current: 2.4.1

const { useMemo, useState, useEffect } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import Markdown from 'markdown-to-jsx';

import { NekoCheckbox, NekoTable, NekoPaging, NekoButton, NekoWrapper, NekoMessage,
  NekoColumn, NekoBlock } from '@neko-ui';
import { nekoFetch } from '@neko-ui';

import i18n from '@root/i18n';
import { apiUrl, restNonce, chatbots as initChatbots } from '@app/settings';
import { retrieveDiscussions, tableDateTimeFormatter, tableUserIPFormatter } from '@app/helpers-admin';
import ExportModal from './ExportModal';
import { retrieveChatbots } from '@app/requests';

const StyledContext = styled.div`
  font-size: 12px;
  border-bottom: 1px solid black;
`;

const StyledType = styled.span`
  font-weight: bold;
  text-transform: uppercase;
`;

const StyledEmbedding = styled.div`
  font-size: 12px;
  color: #bdb8b8;
  background: #eeeeee;
  padding: 2px 8px;
`;

const StyledMessageWrapper = styled.div`
  font-size: 14px;
  padding: 10px;
  border: 1px solid #eaeaea;
  background: #f5f5f5;
  color: #333333;
  word-break: break-word;
  overflow-wrap: break-word;
  word-wrap: break-word;
  hyphens: auto;

  img {
    max-width: 100%;
    height: auto;
  }

  a {
    color: #333333;
    text-decoration: underline;
  }

  a:hover {
    color: #333333;
    text-decoration: none;
  }

  blockquote {
    border-left: 4px solid #dddddd;
    padding-left: 10px;
    margin-left: 0;
    font-style: italic;
  }

  pre {
    background: #eeeeee;
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
    text-wrap: pretty;
  }

  code {
    background: #eeeeee;
    padding: 2px 5px;
    border-radius: 5px;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 10px;
  }
  
  table td, table th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 5px;
  }

  table tr:nth-child(even) {
    background-color: #dddddd;
  }

  .mwai-dead-image {
    color: #ab5252;
    background: #ffd2d2;
    padding: 8px 8px;
    text-align: center;
  }
`;

const options = {
  overrides: {
    object: {
      component: ({ children, ...props }) => {
        const textContent = `<object ${Object.keys(props).map(key => `${key}="${props[key]}"`).join(' ')}>${children}</object>`;
        return textContent;
      },
    },
    script: {
      component: ({ children, ...props }) => {
        const textContent = `<script ${Object.keys(props).map(key => `${key}="${props[key]}"`).join(' ')}>${children}</script>`;
        return textContent;
      },
    },
    iframe: {
      component: ({ children, ...props }) => {
        const textContent = `<iframe ${Object.keys(props).map(key => `${key}="${props[key]}"`).join(' ')}>${children}</iframe>`;
        return textContent;
      },
    },
  }
};

const StyledMessage = ({ content }) => {
  const [ processedContent, setProcessedContent ] = useState(content || '');

  const checkImageURL = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const cleanMessage = async (markdownContent) => {
    const regex = /!\[.*?\]\((.*?)\)/g;
    let newContent = markdownContent;
    let match;
    while ((match = regex.exec(markdownContent)) !== null) {
      const imageUrl = match[1];
      const isImageAvailable = await checkImageURL(imageUrl);
      if (!isImageAvailable) {
        const placeholder = `<div class="mwai-dead-image">Image not available</div>`;
        newContent = newContent.replace(match[0], placeholder);
      }
    }
    setProcessedContent(newContent);
  };

  useEffect(() => {
    if (content) {
      cleanMessage(content);
    }
  }, [content]);

  return (
    <StyledMessageWrapper>
      <Markdown options={options}>{processedContent}</Markdown>
    </StyledMessageWrapper>
  );
};

const Message = ({ message }) => {
  const embeddings = message?.extra?.embeddings ? message?.extra?.embeddings : (
    message?.extra?.embedding ? [message?.extra?.embedding] : []
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
      <StyledContext>
        <StyledType>{message.role || message.type}</StyledType>
      </StyledContext>
      {embeddings?.length > 0 && <StyledEmbedding>
        {embeddings.map(embedding => <div key={embedding?.id ?? Math.random()}>
          <span>{embedding.title}</span> (<span>{(embedding.score.toFixed(4) * 100).toFixed(2)}</span>)
        </div>)}
      </StyledEmbedding>}
      <StyledMessage content={message.content || message.text} />
    </div>
  );
}

const deleteDiscussions = async (chatIds = []) => {
  const res = await nekoFetch(`${apiUrl}/discussions/delete`, { nonce: restNonce, method: 'POST', json: { chatIds } });
  return res;
}

const Discussions = () => {
  const queryClient = useQueryClient();
  const [ modal, setModal ] = useState({ type: null, data: null });
  const [ busyAction, setBusyAction ] = useState(false);
  const [ autoRefresh, setAutoRefresh ] = useState(false);

  const { data: chatbots } = useQuery({
    queryKey: ['chatbots'], queryFn: retrieveChatbots, initialData: initChatbots
  });

  const chatsColumns = useMemo(() => {
    return [
      { 
        accessor: 'updated', title: 'Time', width: '80px', sortable: true
      },
      { 
        accessor: 'user', title: 'User', width: '85px', 
        filters: {
          type: 'text',
          description: i18n.HELP.USER_FILTER
        },
      },
      {
        accessor: 'botId', title: 'Chatbot', width: '85px',
        filters: { 
          type: 'select',
          options: chatbots.map(x => ({ value: x.botId, label: x.name }))
        },
      },
      { 
        accessor: 'preview', title: i18n.COMMON.PREVIEW,
        filters: {
          type: 'text'
        },
      },
      { 
        accessor: 'messages', title: '#', width: '45px'
      },
    ];
  }, [chatbots]);

  const [ filters, setFilters ] = useState(() => {
    return chatsColumns.filter(v => v.filters).map(v => {
      return { accessor: v.accessor, value: null}
    });
  });
  const [ selectedIds, setSelectedIds ] = useState([]);

  const [ chatsQueryParams, setChatsQueryParams ] = useState({
    filters: filters,
    sort: { accessor: 'created', by: 'desc' }, page: 1, limit: 10
  });
  const { isFetching: isFetchingChats, data: chatsData, error: chatsError } = useQuery({
    queryKey: ['chats', chatsQueryParams], queryFn: () => retrieveDiscussions(chatsQueryParams),
    refetchInterval: autoRefresh ? 1000 * 5 : null
  });

  useEffect(() => {
    setChatsQueryParams({ ...chatsQueryParams, filters: filters });
  }, [filters]);

  const chatsTotal = useMemo(() => {
    return chatsData?.total || 0;
  }, [chatsData]);

  const chatsRows = useMemo(() => {
    if (!chatsData?.chats) { return []; }
    return chatsData?.chats.slice().sort((a, b) => b.created_at - a.created_at).map(x => { // added slice() to prevent mutation
      const messages = JSON.parse(x.messages);
      const extra = JSON.parse(x.extra);
      const formattedCreated = tableDateTimeFormatter(x.created);
      const formattedUpdated = tableDateTimeFormatter(x.updated);
      const user = tableUserIPFormatter(x.userId ?? extra?.userId, x.ip ?? extra?.ip);
      const userMessages = messages?.filter(x => x.role === 'user' || x.type === 'user');
      const firstExchange = userMessages?.length ? userMessages[0].content || userMessages[0].text : '';
      const lastExchange = userMessages?.length ? userMessages[userMessages.length - 1].content || userMessages[userMessages.length - 1].text : '';
      const chatbotName = chatbots.find(y => y.botId === x.botId)?.name;
      return {
        id: x.id,
        botId: <>
          <div>{chatbotName}</div>
          <div><small><i>{x.botId}</i></small></div>
        </>,
        user: user,
        messages: messages?.length ?? 0,
        preview: <>
          <div>{firstExchange}</div>
          <small>{lastExchange}</small>
        </>,
        extra: extra.model,
        created: <div style={{ textAlign: 'right' }}>{formattedCreated}</div>,
        updated: <div style={{ textAlign: 'right' }}>{formattedUpdated}</div>
      };
    });
  }, [chatsData, chatbots]);

  const discussion = useMemo(() => {
    if (selectedIds?.length !== 1) { return null; }
    const currentDiscussion = chatsData?.chats.find(x => x.id === selectedIds[0]);
    if (!currentDiscussion) { return null; }
    let messages = [];
    let extra = {};
    try {
      messages = JSON.parse(currentDiscussion.messages);
      extra = JSON.parse(currentDiscussion.extra);
    }
    catch (e) {
      console.error("Could not parse discussion messages or extra.", { e, currentDiscussion });
    }
    return {
      id: currentDiscussion.id,
      chatId: currentDiscussion.chatId,
      botId: currentDiscussion.botId,
      messages: messages,
      extra: extra,
      created: currentDiscussion.created,
      updated: currentDiscussion.updated
    }
  }, [selectedIds, chatsData]);

  const onDeleteSelectedChats = async () => {
    setBusyAction(true);
    if (!selectedIds.length) {
      if (!window.confirm(i18n.ALERTS.ARE_YOU_SURE)) { 
        setBusyAction(false);
        return;
      }
      await deleteDiscussions(); // potential bug if chatIds missing
    }
    else {
      const selectedChats = chatsData?.chats.filter(x => selectedIds.includes(x.id));
      const selectedChatIds = selectedChats.map(x => x.chatId);
      await deleteDiscussions(selectedChatIds);
      setSelectedIds([]);
    }
    await queryClient.invalidateQueries({ queryKey: ['chats'] });
    // no refetch, relying on cache invalidation
    setBusyAction(false);
  }

  const jsxPaging = useMemo(() => {
    return (<div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <NekoPaging currentPage={chatsQueryParams.page} limit={chatsQueryParams.limit}
          onCurrentPageChanged={(page) => setChatsQueryParams({ ...chatsQueryParams, page })}
          total={chatsTotal} onClick={page => { 
            setChatsQueryParams({ ...chatsQueryParams, page });
          }}
        />
        <NekoButton className="primary" style={{ marginLeft: 5 }}
          onClick={() => { setModal({ type: 'export', data: {} }); }}>
          {i18n.COMMON.EXPORT}
        </NekoButton>
      </div>
    </div>);
  }, [ chatsQueryParams, chatsTotal ]);

  const emptyMessage = useMemo(() => {
    if (chatsError?.message) {
      return <NekoMessage variant="danger" style={{ margin: "5px 5px" }}>
        <b>{chatsError.message}</b><br />
        <small>Check your Console Logs and PHP Error Logs for more information.</small>
      </NekoMessage>;
    }
    return null;
  }, [chatsError]);

  const formattedCreated = tableDateTimeFormatter(discussion?.created);
  const formattedUpdated = tableDateTimeFormatter(discussion?.updated);

  return (<>

    <NekoWrapper>

      <NekoColumn minimal style={{ flex: 2 }}>

        <NekoBlock className="primary" title={i18n.COMMON.DISCUSSIONS} action={<>
          <div>
            {!autoRefresh && <NekoButton className="secondary" style={{ marginLeft: 5 }}
              disabled={isFetchingChats}
              onClick={async () => {
                await queryClient.invalidateQueries({ queryKey: ['chats'] });
                queryClient.refetchQueries({ queryKey: ['chats'] });
              }}>{i18n.COMMON.REFRESH}</NekoButton>}
            {selectedIds.length > 0 && <>
              <NekoButton className="danger" disabled={false}
                onClick={onDeleteSelectedChats}>
                {i18n.COMMON.DELETE}
              </NekoButton>
            </>}
          </div>
        </>}>

          <NekoTable busy={(!autoRefresh && isFetchingChats) || busyAction}
            sort={chatsQueryParams.sort}
            onSortChange={(accessor, by) => {
              setChatsQueryParams({ ...chatsQueryParams, sort: { accessor, by } });
            }}
            emptyMessage={emptyMessage}
            filters={filters}
            onFilterChange={(accessor, value) => {
              const freshFilters = [
                ...filters.filter(x => x.accessor !== accessor),
                { accessor, value }
              ];
              setFilters(freshFilters);
            }}
            data={chatsRows} columns={chatsColumns}
            selectedItems={selectedIds}
            onSelectRow={id => { 
              if (selectedIds.includes(id) && selectedIds.length === 1) {
                setSelectedIds([]);
                return;
              }
              setSelectedIds([id]);
            }}
            onSelect={ids => { setSelectedIds([ ...new Set([ ...selectedIds, ...ids ]) ]) }} // using Set for de-dup
            onUnselect={ids => { setSelectedIds([ ...selectedIds.filter(x => !ids.includes(x)) ]) }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <NekoButton className="danger" disabled={selectedIds.length === 0} style={{ marginRight: 10 }}
              onClick={onDeleteSelectedChats}>
              {i18n.COMMON.DELETE_ALL}
            </NekoButton>
            <NekoCheckbox name="auto-refresh" label={"Auto Refresh"} value="1" checked={autoRefresh}
              style={{ width: 180 }}
              onChange={() => setAutoRefresh(prev => !prev)} />
            <div style={{ flex: 'auto' }} />
            {jsxPaging}
          </div>

        </NekoBlock>

      </NekoColumn>

      <NekoColumn minimal style={{ flex: 1 }}>

        <NekoBlock className="primary" title="Selected Discussion" action={<></>}>

          {!discussion && <div style={{ textAlign: 'center', padding: 10 }}>
            No discussion selected.
          </div>}

          {discussion?.messages?.map((x, i) => <Message key={i} message={x} />)}

        </NekoBlock>

        {!!discussion && <NekoBlock className="primary" title="Information">
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ fontWeight: 'bold' }}>Model</div>
            <div>{discussion?.extra?.model}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ fontWeight: 'bold' }}>Bot ID (or Custom ID)</div>
            <div>{discussion?.botId}</div>
          </div>
          {discussion?.extra?.context && <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ fontWeight: 'bold' }}>Context</div>
            <div>{discussion?.extra?.context}</div>
          </div>}
          {discussion?.extra?.assistantId && <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ fontWeight: 'bold' }}>Assistant ID</div>
            <div>{discussion?.extra?.assistantId}</div>
          </div>}
          {discussion?.extra?.threadId && <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ fontWeight: 'bold' }}>Thread ID</div>
            <div>{discussion?.extra?.threadId}</div>
          </div>}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ fontWeight: 'bold' }}>Chat ID</div>
            <div>{discussion?.chatId}</div>
          </div>
          {discussion?.extra?.session && <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ fontWeight: 'bold' }}>Session</div>
            <div>{discussion?.extra?.session}</div>
          </div>}
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ fontWeight: 'bold' }}>Created</div>
            <div>{formattedCreated}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ fontWeight: 'bold' }}>Updated</div>
            <div>{formattedUpdated}</div>
          </div>

        </NekoBlock>}

      </NekoColumn>

    </NekoWrapper>

    <ExportModal modal={modal} setModal={setModal} busy={busyAction} />

  </>);
}

export default Discussions;