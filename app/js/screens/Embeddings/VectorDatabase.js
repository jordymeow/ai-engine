// Previous: 1.1.8
// Current: 1.1.9

const ENTRY_TYPES = {
  MANUAL: 'manual',
  POST_CONTENT: 'postContent',
  POST_FRAGMENT: 'postFragment'
}

const { useState, useMemo, useRef, useEffect } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { NekoButton, NekoSelect, NekoOption, NekoProgress, NekoModal, NekoTextArea, NekoInput, NekoTheme,
  NekoQuickLinks, NekoLink, NekoTable, NekoPaging, NekoContainer, NekoSpacer, NekoSwitch } from '@neko-ui';
import { nekoFetch, useNekoTasks } from '@neko-ui';
import { apiUrl, restNonce, session } from '@app/settings';
import i18n from '../../../i18n';

const searchColumns = [
  { accessor: 'id', title: 'ID', sortable: true, width: '60px' },
  { accessor: 'type', title: 'Type', sortable: true, width: '120px' },
  { accessor: 'title', title: 'Title', sortable: true },
  { accessor: 'status', title: 'Status', width: '80px' },
  { accessor: 'refId', title: 'Ref', sortable: true, width: '60px' },
  { accessor: 'score', title: 'Score', sortable: true, width: '65px' },
  { accessor: 'updated', title: 'Updated', sortable: true, width: '80px' },
  { accessor: 'created', title: 'Created', sortable: true, width: '80px' },
  { accessor: 'actions', title: '', width: '30px'  }
];

const queryColumns = [
  { accessor: 'id', title: 'ID', sortable: true, width: '60px' },
  { accessor: 'type', title: 'Type', sortable: true, width: '120px' },
  { accessor: 'title', title: 'Title', sortable: false },
  { accessor: 'status', title: 'Status', sortable: true, width: '80px' },
  { accessor: 'refId', title: 'Ref', sortable: false, width: '60px' },
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

const searchVectors = async (queryParams) => {
  if (queryParams?.filters?.aiSearch === "") {
    return [];
  }
  queryParams.offset = (queryParams.page - 1) * queryParams.limit;
  const res = await nekoFetch(`${apiUrl}/vectors`, { nonce: restNonce, method: 'POST', json: queryParams });
  return res ? { total: res.total, vectors: res.vectors } : { total: 0, vectors: [] };
}

const retrieveVectors = async (queryParams) => {
  queryParams.offset = (queryParams.page - 1) * queryParams.limit;
  const res = await nekoFetch(`${apiUrl}/vectors`, { nonce: restNonce, method: 'POST', json: queryParams });
  return res ? { total: res.total, vectors: res.vectors } : { total: 0, vectors: [] };
}

const VectorDatabase = ({ options, updateOption }) => {
  const queryClient = useQueryClient();
  const [ busy, setBusy ] = useState(false);
  const [ mode, setMode ] = useState('edit');
  const [ search, setSearch ] = useState('');
  const [ modal, setModal ] = useState(false);
  const pinecone = options.pinecone || {};
  const indexes = pinecone.indexes || [];
  const index = pinecone.index || null;
  const [ queryParams, setQueryParams ] = useState({
    filters: { env: index },
    sort: { accessor: 'created', by: 'desc' }, page: 1, limit: 20
  });
  const { isFetching: isBusyQuerying, data: vectorsData } = useQuery({
    queryKey: ['vectors', queryParams], queryFn: () => retrieveVectors(queryParams),
    keepPreviousData: true
  });
  const [ foundVectorsSort, setFoundVectorsSort ] = useState({ accessor: 'score', by: 'desc' });
  const [ foundVectorsData, setFoundVectorsData ] = useState({ total: 0, vectors: [] });
  const busyFetchingVectors = isBusyQuerying || busy === 'searchVectors';
  const columns = mode === 'search' ? searchColumns : queryColumns;

  useEffect(() => {
    setQueryParams({ ...queryParams, filters: { env: index ?? '' } });
  }, [index]);

  const onAddEmbedding = async () => {
    setBusy('addEmbedding');
    const res = await nekoFetch(`${apiUrl}/vector`, { nonce: restNonce, method: 'POST',
      json: { vector: { ...modal, index } }
    });
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ['vectors'] });
    }
    setModal(false);
    setBusy(false);
  }

  const onDeleteEmbedding = async (ids) => {
    setBusy('deleteEmbedding');
    const res = await nekoFetch(`${apiUrl}/vectors`, { nonce: restNonce, method: 'DELETE', json: { ids } });
    if (res.success) {
      queryClient.invalidateQueries({ queryKey: ['vectors'] });
    }
    setBusy(false);
  }

  const onRefreshIndexes = async () => {
    setBusy('refreshIndexes');
    const res = await nekoFetch(`${apiUrl}/pinecone/list_indexes`, { nonce: restNonce, method: 'GET' });
    const freshPinecone = { ...pinecone, indexes: res.indexes };
    await updateOption(freshPinecone, 'pinecone');
    setBusy(false);
  }

  const onSearch = async () => {
    setBusy('searchVectors');
    const vectors = await searchVectors({ ...queryParams, filters: { env: index ?? '', aiSearch: search } });
    setFoundVectorsData(vectors);
    setBusy(false);
  }

  const vectorsTotal = useMemo(() => {
    return vectorsData?.total || 0;
  }, [vectorsData]);

  const vectorsRows = useMemo(() => {
    const data = mode === 'edit' ? vectorsData : foundVectorsData;
    if (!data?.vectors) { return []; }

    if (mode === 'search') {
      console.log(foundVectorsSort);
      data.vectors = data.vectors.slice().sort((a, b) => {
        if (foundVectorsSort.by === 'asc') {
          return a[foundVectorsSort.accessor] > b[foundVectorsSort.accessor] ? 1 : -1;
        }
        else {
          return a[foundVectorsSort.accessor] < b[foundVectorsSort.accessor] ? 1 : -1;
        }
      });
      console.log({ foundVectorsSort, data });
    }

    return data?.vectors.map(x => {
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
        refId: x.refId ? x.refId : '-',
        score: x.score ? (x.score.toFixed(4) * 100).toFixed(2) : '-',
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
  }, [mode, vectorsData, foundVectorsData, foundVectorsSort, busy]);

  return (<>
    <NekoContainer style={{ margin: 10 }} contentStyle={{ padding: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: 10 }}>Index: </label>
        <NekoSelect scrolldown name="server" style={{ width: 160, marginRight: 5 }} disabled={busy}
          value={pinecone.index} onChange={value => {
            const freshPinecone = { ...pinecone, index: value };
            updateOption(freshPinecone, 'pinecone');
          }}>
          {indexes.map(x => <NekoOption key={x.name} value={x.name} label={x.name} />)}
          <NekoOption value={''} label="None" />
        </NekoSelect>
        <NekoButton className="primary" onClick={onRefreshIndexes}
          isBusy={busy === 'refreshIndexes'} disabled={busy}>
          Refresh Indexes
        </NekoButton>
      </div>
    </NekoContainer>
    <NekoContainer style={{ margin: 10 }} contentStyle={{ padding: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <NekoSwitch style={{ marginRight: 10 }}
            onLabel={i18n.EMBEDDINGS.AI_SEARCH} offLabel={i18n.EMBEDDINGS.EDIT} width={145}
            onValue="search" offValue="edit"
            checked={mode === 'search'} onChange={setMode} 
            onBackgroundColor={NekoTheme.purple} offBackgroundColor={NekoTheme.green}
          />
          {mode === 'search' && <div style={{ flex: 'auto', display: 'flex' }}>
            <NekoInput style={{ flex: 'auto', marginRight: 5 }} placeholder="Search"
              value={search} onChange={val => setSearch(val)} />
            <NekoButton className="primary" onClick={onSearch} disabled={busy} isBusy={busy === 'searchVectors'}>
              Search
            </NekoButton>
          </div>}
          {mode === 'edit' && <>
          <NekoButton className="primary" onClick={() => setModal(defaultVector)} disabled={busy}>
            Add Embedding
          </NekoButton>
          </>}
        </div>
        <div style={{ display: 'flex'}}>
          <NekoPaging currentPage={queryParams.page} limit={queryParams.limit}
            total={vectorsTotal} onClick={page => { 
              setQueryParams({ ...queryParams, page });
            }}
          />
          <NekoButton className="primary" style={{ marginLeft: 5 }} disabled={busyFetchingVectors}
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['vectors'] });
          }}>Refresh Embeddings</NekoButton>
        </div>
      </div>

      <NekoTable alternateRowColor busy={busyFetchingVectors}
        sort={mode === 'edit' ? queryParams.sort : foundVectorsSort} onSortChange={(accessor, by) => {
          if (mode === 'edit') {
            setQueryParams({ ...queryParams, sort: { accessor, by } });
          }
          else {
            setFoundVectorsSort({ accessor, by });
          }
        }}
        data={vectorsRows} columns={columns} 
      />
    </NekoContainer>

    <NekoModal isOpen={modal}
        title="Add Embedding"
        onOkClick={onAddEmbedding}
        onRequestClose={() => setModal(false)}
        onCancelClick={() => setModal(false)}
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
          <NekoSpacer />
          <label>Type:</label>
          <NekoSpacer />
          <NekoSelect scrolldown name="type" disabled={busy} value={modal?.type} onChange={value => {
            setModal({ ...modal, type: value });
            }}>
            <NekoOption value="manual" label="Manual" />
            <NekoOption value="post" label="Post (Whole)" />
            <NekoOption value="post-fragment" label="Post (Fragment)" />
          </NekoSelect>
          {(modal?.type === 'post' || modal?.type === 'post-fragment') && <>
            <NekoSpacer />
            <label>Post ID:</label>
            <NekoSpacer />
            <NekoInput value={modal?.refId} 
              onChange={value => setModal({ ...modal, refId: value }) } />
          </>}
        </>
        }
      />
  </>);
}

export default VectorDatabase;