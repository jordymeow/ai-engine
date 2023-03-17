// Previous: 1.3.59
// Current: 1.3.60

const { useMemo, useState, useEffect } = wp.element;
import styled from 'styled-components';

import { apiUrl, restNonce } from '@app/settings';

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
  const embedding = message?.extra?.embedding;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5 }}>
      <StyledContext>
        <StyledType>{message.type}</StyledType>
      </StyledContext>
      {embedding && 
          <StyledEmbedding>
            Embedding: {embedding.title} ({embedding.score.toFixed(2)})
          </StyledEmbedding>
        }
      <StyledMessage>{message.text}</StyledMessage>
    </div>
  );
}

const chatsColumns = [
  { accessor: 'id', title: 'ID', width: '50px' },
  //{ accessor: 'chatId',  title: 'ChatID', width: '80px' },
  { accessor: 'lastMessage', title: 'Last User Message' },
  { accessor: 'messages', title: '#', width: '45px' },
  //{ accessor: 'extra', title: 'Info', width: '45px' },
  //{ accessor: 'created', title: 'Started', width: '140px', sortable: true },
  { accessor: 'updated', title: 'Last Update', width: '140px', sortable: true }
];

const retrieveChats = async (chatsQueryParams) => {
  chatsQueryParams.offset = (chatsQueryParams.page - 1) * chatsQueryParams.limit;
  const res = await nekoFetch(`${apiUrl}/chats`, { nonce: restNonce, method: 'POST', json: chatsQueryParams });
  return res ? { total: res.total, chats: res.chats } : { total: 0, chats: [] };
}

const deleteChat = async (chatId) => {
  const res = await nekoFetch(`${apiUrl}/chats_delete`, { nonce: restNonce, method: 'POST', json: { chatId } });
  return res;
}

const Chats = () => {
  const queryClient = useQueryClient();
  const [ chatsQueryParams, setChatsQueryParams ] = useState({
    filters: null, sort: { accessor: 'created', by: 'desc' }, page: 1, limit: 10
  });
  const [ autoRefresh, setAutoRefresh ] = useState(false);
  const { isFetching: isFetchingChats, data: chatsData } = useQuery({
    queryKey: ['chats', chatsQueryParams], queryFn: () => retrieveChats(chatsQueryParams),
    keepPreviousData: true, refetchInterval: autoRefresh ? 1000 * 5 : null
  });
  const [ currentTab, setCurrentTab ] = useState('all');
  const [ selectedRow, setSelectedRow ] = useState(null);

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
      let userMessages = messages?.filter(x => x.type === 'user');
      let lastMessage = userMessages?.length ? userMessages[userMessages.length - 1].text : '';
    
      return {
        id: x.id,
        chatId: x.chatId,
        messages: messages?.length ?? 0,
        lastMessage: lastMessage,
        extra: extra.model,
        created: formattedCreated,
        updated: formattedUpdated,
      }
    });
  }, [chatsData]);

  const discussion = useMemo(() => {
    if (!selectedRow) { return null; }
    let currentDiscussion = chatsData?.chats.find(x => x.id === selectedRow);
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
    };
  }, [selectedRow, chatsData]);

  const onDeleteChat = async () => {
    await deleteChat(discussion?.chatId);
    queryClient.invalidateQueries(['chats']);
  }

  return (<>
    <NekoWrapper>
      <NekoColumn minimal fullWidth>
        <NekoMessage variant="success" style={{ padding: '5px 10px' }}>
        <b>This is extremely beta!</b> I need your feedback. I am looking for ways to make this useful for you. The idea is that you can improve your chatbot by analyzing the conversations (then delete them when done). Another idea is to interact in a way or another with those conversations.
        </NekoMessage>
      </NekoColumn>
      <NekoColumn minimal>
        <NekoBlock className="primary" title={i18n.COMMON.DISCUSSIONS} action={<>
          {!autoRefresh && <NekoButton className="primary" style={{ marginLeft: 5 }} disabled={isFetchingChats}
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ['chats'] });
            }}>Refresh</NekoButton>}
        </>}>

          <NekoTable busy={!autoRefresh && isFetchingChats}
            selectedRow={selectedRow ? [selectedRow] : []}
            sort={chatsQueryParams.sort}
            onSortChange={(accessor, by) => {
              setChatsQueryParams(prev => ({ ...prev, sort: { accessor, by } }));
            }}
            data={chatsRows} columns={chatsColumns} 
            onSelectRow={rows => {
              setSelectedRow(rows[0]);
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <NekoCheckbox name="auto-refresh" label={"Auto Refresh"} value="1" checked={autoRefresh}
            onChange={() => setAutoRefresh(!autoRefresh)} />
            <div>
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <NekoPaging currentPage={chatsQueryParams.page} limit={chatsQueryParams.limit}
                  total={chatsTotal} onClick={page => { 
                    setChatsQueryParams(prev => ({ ...prev, page }));
                  }}
                />
              </div>
            </div>
          </div>
        </NekoBlock>
      </NekoColumn>
      <NekoColumn minimal>
        <NekoBlock className="primary" title="Selected Discussion" action={<>
          {discussion && <NekoButton className="danger" onClick={onDeleteChat}>Delete</NekoButton>}
        </>}>
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

export default Chats;