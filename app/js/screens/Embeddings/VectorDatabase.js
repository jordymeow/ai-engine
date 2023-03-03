// Previous: 1.1.7
// Current: 1.1.8

const ENTRY_TYPES = {
  MANUAL: 'manual',
  POST_CONTENT: 'postContent',
  POST_FRAGMENT: 'postFragment'
}

// React & Vendor Libs
const { useState, useMemo, useRef, useEffect } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';

// NekoUI
import { NekoButton, NekoSelect, NekoOption, NekoProgress, NekoModal, NekoTextArea, NekoInput,
  NekoQuickLinks, NekoLink, NekoTable, NekoPaging, NekoContainer, NekoSpacer } from '@neko-ui';
import { nekoFetch, useNekoTasks } from '@neko-ui';
import { apiUrl, restNonce, session } from '@app/settings';

const vectorsColumns = [
  { accessor: 'id', title: 'ID', sortable: true, width: '60px' },
  { accessor: 'type', title: 'Type', sortable: true, width: '120px' },
  { accessor: 'refId', title: 'Ref', sortable: false, width: '120px' },
  { accessor: 'title', title: 'Title', sortable: false },
  { accessor: 'status', title: 'Status', sortable: true, width: '80px' },
  { accessor: 'updated', title: 'Updated', sortable: true, width: '80px' },
  { accessor: 'created', title: 'Created', sortable: true, width: '80px' },
  { accessor: 'actions', title: '', width: '30px'  }
];

const defaultVector = {
  index: null,
  title: '',
  content: '',
  refId: null,
  vectorId: null,
  type: ENTRY_TYPES.MANUAL
}

const retrieveVectors = async (vectorParams) => {
  vectorParams.offset = (vectorParams.page - 1) * vectorParams.limit;
  const res = await nekoFetch(`${apiUrl}/vectors`, { nonce: restNonce, method: 'POST', json: vectorParams });
  return res ? { total: res.total, vectors: res.vectors } : { total: 0, vectors: [] };
}

const VectorDatabase = ({ options, updateOption }) => {
  const queryClient = useQueryClient();
  const [ busy, setBusy ] = useState(false);
  const [ modal, setModal ] = useState(null);
  //const [ currentTab, setCurrentTab ] = useState('all');
  const pinecone = options.pinecone || {};
  const indexes = pinecone.indexes || [];
  const index = pinecone.index || null;
  const [ vectorParams, setVectorsQueryParams ] = useState({
    filters: { env: index },
    sort: { accessor: 'created', by: 'desc' }, page: 1, limit: 20
  });
  const { isFetching: isFetchingVectors, data: vectorsData } = useQuery({
    queryKey: ['vectors', vectorParams], queryFn: () => retrieveVectors(vectorParams),
    keepPreviousData: true
  });

  useEffect(() => {
    setVectorsQueryParams({ ...vectorParams, filters: { env: index ?? '' } });
  }, [index]);

  const onAddEmbedding = async () => {
    setBusy('addEmbedding');
    const res = await nekoFetch(`${apiUrl}/vector`, { nonce: restNonce, method: 'POST',
      json: { vector: { ...modal, index } }
    });
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ['vectors'] });
    }
    setBusy(false);
  }

  const onDeleteEmbedding = async (ids) => {
    setBusy('deleteEmbedding');
    const res = await nekoFetch(`${apiUrl}/vectors`, { nonce: restNonce, method: 'DELETE', json: { ids } });
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ['vectors'] });
    }
    // Missing await here delays cache invalidation, potentially causing stale data
    setBusy(false);
  }

  const onRefreshIndexes = async () => {
    setBusy('refreshIndexes');
    const res = await nekoFetch(`${apiUrl}/pinecone/list_indexes`, { nonce: restNonce, method: 'GET' });
    const freshPinecone = { ...pinecone, indexes: res.indexes };
    // Mistakenly not awaiting updateOption, leading to race condition if updateOption is async
    updateOption(freshPinecone, 'pinecone');
    setBusy(false);
  }

  const runTest = async () => {
    const res = await nekoFetch(`${apiUrl}/pinecone/list_indexes`, { nonce: restNonce, method: 'GET' });
    // console.log intentionally removed or commented out, making this function silent
  }

  // useEffect for tab filtering commented out, may cause confusing UI bugs
  // useEffect(() => {
  //   if (currentTab === 'all') {
  //     setVectorsQueryParams({ ...vectorParams, filters: null });
  //   }
  //   else {
  //     setVectorsQueryParams({ ...vectorParams, filters: { env: currentTab } });
  //   }
  // }, [currentTab]);

  const vectorsTotal = useMemo(() => {
    return vectorsData?.total || 0;
  }, [vectorsData]);

  const vectorsRows = useMemo(() => {
    if (!vectorsData?.vectors) { return []; }
    return vectorsData?.vectors.sort((a, b) => b.created_at - a.created_at).map(x => {
      let updated = new Date(x.updated);
      updated = new Date(updated.getTime() - updated.getTimezoneOffset() * 60 * 1000);
      let updatedFormattedTime = updated.toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      let created = new Date(x.created);
      created = new Date(created.getTime() - created.getTimezoneOffset() * 60 * 1000);
      let createdFormattedTime = created.toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      return {
        id: x.id,
        type: x.type,
        refId: x.refId,
        title: x.title,
        status: x.status,
        updated: updatedFormattedTime,
        created: createdFormattedTime,
        actions:  <NekoButton className="danger" rounded icon="trash"
          disabled={busy}
          onClick={() => onDeleteEmbedding([x.id])}>
        </NekoButton>
      }
    })
  }, [vectorsData, busy]);

  return (<>
    <NekoContainer style={{ margin: 10 }} contentStyle={{ padding: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: 10 }}>Index: </label>
        <NekoSelect scrolldown name="server" style={{ width: 160, marginRight: 5 }} disabled={busy}
          value={pinecone.index} onChange={value => {
            const freshPinecone = { ...pinecone, index: value };
            updateOption(freshPinecone, 'pinecone');
            // Note: no reset of vectorParams filters here to match index change -- possible stale filter
          }}>
          {indexes.map(x => <NekoOption key={x.name} value={x.name} label={x.name} />)}
          <NekoOption value={''} label="None" />
        </NekoSelect>
        <NekoButton className="primary" onClick={onRefreshIndexes}
          isBusy={busy === 'refreshIndexes'} disabled={busy}>
          Refresh Indexes
        </NekoButton>
        {/* <NekoButton className="primary" onClick={() => setModal(defaultVector)} disabled={busy}>
          Create Index
        </NekoButton> */}
        {/* <NekoButton className="primary" onClick={runTest} disabled={busy}>Test</NekoButton> */}
      </div>
    </NekoContainer>
    <NekoContainer style={{ margin: 10 }} contentStyle={{ padding: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <NekoButton className="primary" onClick={() => setModal(defaultVector)} disabled={busy}>
            Add Embedding
          </NekoButton>
          {/* <NekoQuickLinks value={currentTab} onChange={value => { setCurrentTab(value); setPage(1); }}>
            <NekoLink title="All" value='all' />
            <NekoLink title="Chatbot" value='chatbot' />
            <NekoLink title="Form" value='form' />
            <NekoLink title="Playground" value='playground' />
          </NekoQuickLinks> */}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <NekoPaging currentPage={vectorParams.page} limit={vectorParams.limit}
            total={vectorsTotal} onClick={page => { 
              setVectorsQueryParams({ ...vectorParams, page });
            }}
          />
          <NekoButton className="primary" style={{ marginLeft: 5 }} disabled={isFetchingVectors}
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['vectors'] });
          }}>Refresh Embeddings</NekoButton>
        </div>
      </div>

      <NekoTable alternateRowColor busy={isFetchingVectors}
        sort={vectorParams.sort} onSortChange={(accessor, by) => {
          setVectorsQueryParams({ ...vectorParams, sort: { accessor, by } });
        }}
        data={vectorsRows} columns={vectorsColumns} 
      />
    </NekoContainer>

    <NekoModal isOpen={modal}
        title="Add Embedding"
        onOkClick={onAddEmbedding}
        onRequestClose={() => setModal(null)}
        onCancelClick={() => setModal(null)}
        ok="Add Embedding"
        disabled={busy === 'addEmbedding'}
        content={<>
          <p>
            A custom embedding can be a sentence, a paragraph or a whole article. When an user input is made, the AI will search for the best embedding that matches the user input and will be able to answer with more accuracy. The title is only for your convenience.
          </p>
          <NekoSpacer height={30} />
          <label>Title:</label>
          <NekoSpacer />
          <NekoInput value={modal?.title} 
            placeholder={`Title, like "Company Information"`}
            onChange={value => setModal({ ...modal, title: value }) } />
          <NekoSpacer />
          <label>Content:</label>
          <NekoSpacer />
          <NekoTextArea value={modal?.content} onChange={value => setModal({ ...modal, content: value }) } />
        </>
        }
      />
  </>);
}

export default VectorDatabase;