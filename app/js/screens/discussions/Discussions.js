// Previous: 2.0.2
// Current: 2.0.3

// React & Vendor Libs
const { useMemo, useState, useEffect } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import Markdown from 'markdown-to-jsx';

// NekoUI
import { NekoCheckbox, NekoTable, NekoPaging, NekoButton, NekoWrapper,
  NekoColumn, NekoBlock } from '@neko-ui';
import { nekoFetch } from '@neko-ui';

// AI Engine
import i18n from '@root/i18n';
import { apiUrl, restNonce } from '@app/settings';
import { tableDateTimeFormatter, tableUserIPFormatter } from '@app/helpers-admin';

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

const StyledMessage = ({ content }) => {
  const [processedContent, setProcessedContent] = useState(content || '');

  useEffect(() => {
    if (content) {
      handleDeadUrls(content);
    }
  }, [content]);

  const checkImageURL = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  const handleDeadUrls = async (markdownContent) => {
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
  return (
    <StyledMessageWrapper>
      <Markdown>{processedContent}</Markdown>
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
        {embeddings.map(embedding => <div key={embeddings.id}>
          <span>{embedding.title}</span> (<span>{(embedding.score.toFixed(4) * 100).toFixed(2)}</span>)
        </div>)}
      </StyledEmbedding>}
      <StyledMessage content={message.content || message.text} />
    </div>
  );
}

const chatsColumns = [
  { accessor: 'updated', title: 'Time', width: '80px', sortable: true },
  { accessor: 'user', title: 'User', width: '85px', 
    filters: {
      type: 'text',
      description: i18n.HELP.USER_FILTER
    },
  },
  { accessor: 'preview', title: i18n.COMMON.PREVIEW,
    filters: {
      type: 'text'
    },
  },
  { accessor: 'messages', title: '#', width: '45px' },
];

const retrieveDiscussions = async (chatsQueryParams) => {
  chatsQueryParams.offset = (chatsQueryParams.page - 1) * chatsQueryParams.limit;
  const res = await nekoFetch(`${apiUrl}/discussions/list`, { nonce: restNonce, method: 'POST', json: chatsQueryParams });
  return res ? { total: res.total, chats: res.chats } : { total: 0, chats: [] };
}

const deleteDiscussions = async (chatIds = []) => {
  const res = await nekoFetch(`${apiUrl}/discussions/delete`, { nonce: restNonce, method: 'POST', json: { chatIds } });
  return res;
}

const Discussions = () => {
  const queryClient = useQueryClient();
  const [ busyAction, setBusyAction ] = useState(false);
  const [ autoRefresh, setAutoRefresh ] = useState(false);
  const [ filters, setFilters ] = useState(() => {
    return chatsColumns.filter(v => v.filters).map(v => {
      return { accessor: v.accessor, value: null}
    });
  });
  const [ selectedIds, setSelectedIds ] = useState([]);

  const [ chatsQueryParams, setChatsQueryParams ] = useState({
    filters: filters, sort: { accessor: 'created', by: 'desc' }, page: 1, limit: 10
  });
  const { isFetching: isFetchingChats, data: chatsData } = useQuery({
    queryKey: ['chats', chatsQueryParams], queryFn: () => retrieveDiscussions(chatsQueryParams),
    keepPreviousData: true, refetchInterval: autoRefresh ? 1000 * 5 : null
  });

  useEffect(() => {
    setChatsQueryParams({ ...chatsQueryParams, filters: filters });
  }, [filters]);

  const chatsTotal = useMemo(() => {
    return chatsData?.total || 0;
  }, [chatsData]);

  const chatsRows = useMemo(() => {
    if (!chatsData?.chats) { return []; }
    return chatsData?.chats.sort((a, b) => b.created_at - a.created_at).map(x => {
      const messages = JSON.parse(x.messages);
      const extra = JSON.parse(x.extra);
      const formattedCreated = tableDateTimeFormatter(x.created);
      const formattedUpdated = tableDateTimeFormatter(x.updated);
      const user = tableUserIPFormatter(x.userId ?? extra?.userId, x.ip ?? extra?.ip);
      const userMessages = messages?.filter(x => x.role === 'user' || x.type === 'user');
      const firstExchange = userMessages?.length ? userMessages[0].content || userMessages[0].text : '';
      const lastExchange = userMessages?.length ? userMessages[userMessages.length - 1].content || userMessages[userMessages.length - 1].text : '';
      return {
        id: x.id,
        chatId: x.chatId,
        user: user,
        messages: messages?.length ?? 0,
        preview: <>
          <div>{firstExchange}</div>
          <small>{lastExchange}</small>
        </>,
        extra: extra.model,
        created: formattedCreated,
        updated: formattedUpdated
      };
    });
  }, [chatsData]);

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
      await deleteDiscussions();
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      return;
    }
    const selectedChats = chatsData?.chats.filter(x => selectedIds.includes(x.id));
    const selectedChatIds = selectedChats?.map(x => x.chatId) || [];
    await deleteDiscussions(selectedChatIds);
    setSelectedIds([]);
    queryClient.invalidateQueries({ queryKey: ['chats'] });
    setBusyAction(false);
  }

  const jsxPaging = useMemo(() => {
    return (<div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <NekoPaging currentPage={chatsQueryParams.page} limit={chatsQueryParams.limit}
          total={chatsTotal} onClick={page => { 
            setChatsQueryParams({ ...chatsQueryParams, page });
          }}
        />
      </div>
    </div>);
  }, [ chatsQueryParams, chatsTotal ]);

  return (<>

    <NekoWrapper>

      <NekoColumn minimal style={{ flex: 2 }}>

        <NekoBlock className="primary" title={i18n.COMMON.DISCUSSIONS} action={<>
          <div>
            {!autoRefresh && <NekoButton className="secondary" style={{ marginLeft: 5 }}
              disabled={isFetchingChats}
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['chats'] });
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
            onSelectRow={id => { setSelectedIds([id]) }}
            onSelect={ids => { setSelectedIds([ ...selectedIds, ...ids  ]) }}
            onUnselect={ids => { setSelectedIds([ ...selectedIds.filter(x => !ids.includes(x)) ]) }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <NekoButton className="danger" disabled={selectedIds.length} style={{ marginRight: 10 }}
              onClick={onDeleteSelectedChats}>
              {i18n.COMMON.DELETE_ALL}
            </NekoButton>
            <NekoCheckbox name="auto-refresh" label={"Auto Refresh"} value="1" checked={autoRefresh}
              style={{ width: 180 }}
              onChange={() => setAutoRefresh(!autoRefresh)} />
            <div style={{ flex: 'auto' }} />
            {jsxPaging}
          </div>

        </NekoBlock>

      </NekoColumn>

      <NekoColumn minimal style={{ flex: 1 }}>

        <NekoBlock className="primary" title="Selected Discussion" action={<>
        </>}>

          {!discussion && <div style={{ textAlign: 'center', padding: 10 }}>
            No discussion selected.
          </div>}

          {discussion?.messages?.map((x, i) => <Message key={i} message={x} />)}

        </NekoBlock>

        {!!discussion && <NekoBlock className="primary" title="Information" action={<>
        </>}>
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
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ fontWeight: 'bold' }}>Session</div>
            <div>{discussion?.extra?.session}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ fontWeight: 'bold' }}>Created</div>
            <div>{discussion?.created}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ fontWeight: 'bold' }}>Updated</div>
            <div>{discussion?.updated}</div>
          </div>
        </NekoBlock>}

      </NekoColumn>

    </NekoWrapper>
  </>);
}

export default Discussions;