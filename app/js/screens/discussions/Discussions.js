// Previous: 1.3.89
// Current: 1.4.3

// React & Vendor Libs
const { useMemo, useState, useEffect } = wp.element;
import styled from 'styled-components';

import { apiUrl, restNonce } from '@app/settings';

// NekoUI
import { NekoCheckbox, NekoTable, NekoPaging, NekoButton, NekoWrapper, NekoMessage,
  NekoColumn, NekoBlock } from '@neko-ui';
import { nekoFetch } from '@neko-ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import i18n from '@root/i18n';

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
      {embeddings && <StyledEmbedding>
        {embeddings.map(embedding => <div key={embedding.title + Math.random()}>
          <span>{embedding.title}</span> (<span>{(embedding.score.toFixed(4) * 100).toFixed(2)}</span>)
        </div>)}
      </StyledEmbedding>}
      <StyledMessage>{message.text}</StyledMessage>
    </div>
  );
}

const chatsColumns = [
  //{ accessor: 'id', title: 'ID', width: '50px' },
  //{ accessor: 'chatId',  title: 'ChatID', width: '80px' },
  { accessor: 'user', title: 'User' },
  { accessor: 'glance', title: 'Preview (First & Last Message)' },
  { accessor: 'messages', title: '#', width: '45px' },
  //{ accessor: 'extra', title: 'Info', width: '45px' },
  //{ accessor: 'created', title: 'Started', width: '140px', sortable: true },
  { accessor: 'updated', title: 'Last Update', width: '140px', sortable: true }
];

const retrieveDiscussions = async (chatsQueryParams) => {
  chatsQueryParams.offset = (chatsQueryParams.page - 1) * chatsQueryParams.limit;
  const res = await nekoFetch(`${apiUrl}/chats`, { nonce: restNonce, method: 'POST', json: chatsQueryParams });
  return res ? { total: res.total, chats: res.chats } : { total: 0, chats: [] };
}

const deleteDiscussions = async (chatIds = []) => {
  const res = await nekoFetch(`${apiUrl}/chats_delete`, { nonce: restNonce, method: 'POST', json: { chatIds } });
  return res;
}

const Discussions = () => {
  const queryClient = useQueryClient();
  const [ chatsQueryParams, setChatsQueryParams ] = useState({
    filters: null, sort: { accessor: 'created', by: 'desc' }, page: 1, limit: 10
  });
  const [ busyAction, setBusyAction ] = useState(false);
  const [ autoRefresh, setAutoRefresh ] = useState(false);
  const { isFetching: isFetchingChats, data: chatsData } = useQuery({
    queryKey: ['chats', chatsQueryParams], queryFn: () => retrieveDiscussions(chatsQueryParams),
    keepPreviousData: true, refetchInterval: autoRefresh ? 1000 * 5 : null
  });
  const [ currentTab, setCurrentTab ] = useState('all');
  const [ selectedIds, setSelectedIds ] = useState([]);

  useEffect(() => {
    if (currentTab === 'all') {
      setChatsQueryParams(prev => ({ ...prev, filters: null }));
    } else {
      setChatsQueryParams(prev => ({ ...prev, filters: { env: currentTab } }));
    }
  }, [currentTab]);

  const chatsTotal = useMemo(() => {
    return chatsData?.total || 0;
  }, [chatsData]);

  const chatsRows = useMemo(() => {
    if (!chatsData?.chats) { return []; }
    return chatsData?.chats.slice().sort((a, b) => b.created_at - a.created_at).map(x => {
      let created = new Date(x.created);
      created = new Date(created.getTime() - created.getTimezoneOffset() * 60 * 1000);
      let formattedCreated = created.toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      let updated = new Date(x.updated);
      updated = new Date(updated.getTime() - updated.getTimezoneOffset() * 60 * 1000);
      let formattedUpdated = updated.toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      let messages = JSON.parse(x.messages);
      let extra = JSON.parse(x.extra);
      let userMessages = messages?.filter(y => y.type === 'user');
      let firstExchange = userMessages?.length ? userMessages[0].text : '';
      let lastExchange = userMessages?.length ? userMessages[userMessages.length - 1].text : '';

      return {
        id: x.id,
        chatId: x.chatId,
        user: extra?.userId ? <a target="_blank" rel="noopener noreferrer" href={`/wp-admin/user-edit.php?user_id=${extra.userId}`}>ID {extra.userId}</a> : extra?.ip,
        messages: messages?.length ?? 0,
        glance: <>
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
    if (selectedIds?.length !== 1) { return null; }
    let currentDiscussion = chatsData?.chats.find(x => x.id === selectedIds[0]);
    if (!currentDiscussion) { return null; }
    let messages = [];
    let extra = {};
    try {
      messages = JSON.parse(currentDiscussion.messages);
      extra = JSON.parse(currentDiscussion.extra);
    }
    catch (e) {
      console.log(e);
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
    } else {
      const selectedChats = chatsData?.chats.filter(x => selectedIds.includes(x.id));
      const selectedChatIds = selectedChats ? selectedChats.map(x => x.chatId) : [];
      await deleteDiscussions(selectedChatIds);
      setSelectedIds([]);
      queryClient.invalidateQueries(['chats']);
    }
    setBusyAction(false);
  }

  return (<>

    <NekoWrapper>

      <NekoColumn minimal style={{ flex: 2 }}>

        <NekoBlock className="primary" title={i18n.COMMON.DISCUSSIONS} action={<>
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
        </>}>

          <NekoTable busy={(!autoRefresh && isFetchingChats) || busyAction}
            sort={chatsQueryParams.sort}
            onSortChange={(accessor, by) => {
              setChatsQueryParams(prev => ({ ...prev, sort: { accessor, by } }));
            }}
            data={chatsRows} columns={chatsColumns}
            selectedItems={selectedIds}
            onSelectRow={id => { setSelectedIds([id]) }}
            onSelect={ids => { setSelectedIds([ ...selectedIds, ...ids ]) }}
            onUnselect={ids => { setSelectedIds([ ...selectedIds.filter(x => !ids.includes(x)) ]) }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <NekoCheckbox name="auto-refresh" label={"Auto Refresh"} value="1" checked={autoRefresh}
            onChange={() => setAutoRefresh(prev => !prev)} />
            <div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <NekoPaging currentPage={chatsQueryParams.page} limit={chatsQueryParams.limit}
                  total={chatsTotal} onClick={page => { 
                    setChatsQueryParams(prev => ({ ...prev, page }));
                  }}
                />
                {!autoRefresh && <NekoButton className="primary" style={{ marginLeft: 5 }}
                  disabled={isFetchingChats}
                  onClick={() => {
                    queryClient.invalidateQueries({ queryKey: ['chats'] });
                }}>{i18n.COMMON.REFRESH}</NekoButton>}
              </div>
            </div>
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