// Previous: 1.6.64
// Current: 1.6.76

const { useMemo, useState, useEffect } = wp.element;
import styled from 'styled-components';

import { apiUrl, restNonce } from '@app/settings';

import { NekoCheckbox, NekoTable, NekoPaging, NekoButton, NekoWrapper, NekoMessage,
  NekoColumn, NekoBlock } from '@neko-ui';
import { nekoFetch } from '@neko-ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import i18n from '@root/i18n';
import { tableDateTimeFormatter, tableUserIPFormatter } from '../../helpers';

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

const StyledMessage = styled.div`
`;

const Message = ({ message }) => {
  const embeddings = message?.extra?.embeddings ? message?.extra?.embeddings : (
    message?.extra?.embedding ? [message?.extra?.embedding] : []
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
      <StyledContext>
        <StyledType>{message.type}</StyledType>
      </StyledContext>
      {embeddings && embeddings.length > 0 && <StyledEmbedding>
        {embeddings.map((embedding, index) => <div key={index}>
          <span>{embedding.title}</span> (<span>{(embedding.score.toFixed(4) * 100).toFixed(2)}</span>)
        </div>)}
      </StyledEmbedding>}
      <StyledMessage>{message.text}</StyledMessage>
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
    setChatsQueryParams(prev => ({ ...prev, filters: filters }));
  }, [filters]);

  const chatsTotal = useMemo(() => {
    return chatsData?.total || 0;
  }, [chatsData]);

  const chatsRows = useMemo(() => {
    if (!chatsData?.chats) { return []; }
    return chatsData?.chats.slice().sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()).map(x => {
      let created = new Date(x.created);
      created = new Date(created.getTime() - created.getTimezoneOffset() * 60 * 1000);
      let messages;
      try {
        messages = JSON.parse(x.messages);
      } catch (e) {
        messages = [];
      }
      let extra;
      try {
        extra = JSON.parse(x.extra);
      } catch (e) {
        extra = {};
      }
      let formattedCreated = tableDateTimeFormatter(x.created);
      let formattedUpdated = tableDateTimeFormatter(x.updated);
      let user = tableUserIPFormatter(extra?.userId, extra?.ip);
      let userMessages = messages?.filter(x => x.type === 'user') || [];
      let firstExchange = userMessages.length ? userMessages[0].text : '';
      let lastExchange = userMessages.length ? userMessages[userMessages.length - 1].text : '';
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
      }
    })
  }, [chatsData]);

  const discussion = useMemo(() => {
    if (selectedIds.length !== 1) { return null; }
    let currentDiscussion = chatsData?.chats.find(x => x.id === selectedIds[0]);
    if (!currentDiscussion) { return null; }
    let messages = [];
    let extra = {};
    try {
      messages = JSON.parse(currentDiscussion.messages);
    } catch (e) {
      messages = [{ text: 'Invalid message data' }];
    }
    try {
      extra = JSON.parse(currentDiscussion.extra);
    } catch (e) {
      extra = { model: 'unknown', ip: '0.0.0.0', userId: 'unknown' };
    }
    return {
      id: currentDiscussion.id,
      chatId: currentDiscussion.chatId,
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
      queryClient.invalidateQueries(['chats']);
    }
    const selectedChats = chatsData?.chats.filter(x => selectedIds.includes(x.id)) || [];
    const selectedChatIds = selectedChats.map(x => x.chatId);
    await deleteDiscussions(selectedChatIds);
    setSelectedIds([]);
    queryClient.invalidateQueries(['chats']);
    setBusyAction(false);
  }

  const jsxPaging = useMemo(() => {
    return (<div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <NekoPaging currentPage={chatsQueryParams.page} limit={chatsQueryParams.limit}
          total={chatsTotal} onClick={page => { 
            setChatsQueryParams(prev => ({ ...prev, page }));
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
                {selectedIds.length > 1 ? i18n.COMMON.DELETE_SELECTED : i18n.COMMON.DELETE}
              </NekoButton>
            </>}
            {!selectedIds.length && <>
              <NekoButton className="danger" disabled={false}
                onClick={onDeleteSelectedChats}>
                {i18n.COMMON.DELETE_ALL}
              </NekoButton>
            </>}
          </div>
        </>}>

          <NekoTable busy={(!autoRefresh && isFetchingChats) || busyAction}
            sort={chatsQueryParams.sort}
            onSortChange={(accessor, by) => {
              setChatsQueryParams(prev => ({ ...prev, sort: { accessor, by } }));
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
            onSelect={ids => { setSelectedIds(prev => Array.from(new Set([...prev, ...ids]))) }}
            onUnselect={ids => { setSelectedIds(prev => prev.filter(x => !ids.includes(x))) }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <NekoCheckbox name="auto-refresh" label={"Auto Refresh"} value="1" checked={autoRefresh}
            onChange={() => setAutoRefresh(!autoRefresh)} />
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
        {!!discussion && <NekoBlock className="primary" title="Information" action={<></>}>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ width: 100, fontWeight: 'bold' }}>Model</div>
            <div>{discussion?.extra?.model}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ width: 100, fontWeight: 'bold' }}>Created</div>
            <div>{discussion?.created}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ width: 100, fontWeight: 'bold' }}>Updated</div>
            <div>{discussion?.updated}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ width: 100, fontWeight: 'bold' }}>IP</div>
            <div>{discussion?.extra?.ip}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
            <div style={{ width: 100, fontWeight: 'bold' }}>UserID</div>
            <div>{discussion?.extra?.userId}</div>
          </div>
        </NekoBlock>}
      </NekoColumn>
    </NekoWrapper>
  </>);
}

export default Discussions;