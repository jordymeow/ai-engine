// Previous: 1.1.9
// Current: 1.2.3

const ENTRY_TYPES = {
  MANUAL: 'manual',
  POST_CONTENT: 'postContent',
  POST_FRAGMENT: 'postFragment'
}

const ENTRY_BEHAVIORS = {
  CONTEXT: 'context',
  ANSWER: 'answer',
}

const { useState, useMemo, useRef, useEffect } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NekoButton, NekoSelect, NekoOption, NekoProgress, NekoModal, NekoTextArea, NekoInput, NekoTheme,
  NekoQuickLinks, NekoLink, NekoTable, NekoPaging, NekoMessage, NekoSpacer, NekoSwitch, NekoBlock,
  NekoWrapper, NekoColumn } from '@neko-ui';
import { nekoFetch, useNekoTasks } from '@neko-ui';
import { apiUrl, restNonce, session } from '@app/settings';
import i18n from '../../../i18n';

const searchColumns = [
  { accessor: 'status', title: 'Status', width: '80px' },
  { accessor: 'title', title: 'Title', sortable: true },
  { accessor: 'type', title: 'Type', sortable: true, width: '60px' },
  { accessor: 'refId', title: 'Ref', sortable: true, width: '60px' },
  { accessor: 'score', title: 'Score', sortable: true, width: '65px' },
  { accessor: 'updated', title: 'Updated', sortable: true, width: '80px' },
  { accessor: 'created', title: 'Created', sortable: true, width: '80px' },
  { accessor: 'actions', title: '', width: '65px'  }
];

const queryColumns = [
  { accessor: 'status', title: 'Status', sortable: true, width: '80px' },
  { accessor: 'title', title: 'Title', sortable: false },
  { accessor: 'type', title: 'Type', sortable: true, width: '60px' },
  { accessor: 'refId', title: 'Ref', sortable: false, width: '60px' },
  { accessor: 'updated', title: 'Updated', sortable: true, width: '80px' },
  { accessor: 'created', title: 'Created', sortable: true, width: '80px' },
  { accessor: 'actions', title: '', width: '65px'  }
];

const DEFAULT_VECTOR = {
  title: '',
  content: '',
  refId: null,
  type: ENTRY_TYPES.MANUAL,
  behavior: ENTRY_BEHAVIORS.CONTEXT,
}

const DEFAULT_INDEX = {
  name: '',
  podType: 'p2',
}

const searchVectors = async (queryParams) => {
  if (queryParams?.filters?.aiSearch === "") {
    return { total: 0, vectors: [] };
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
  const [ embeddingModal, setEmbeddingModal ] = useState(false);
  const [ indexModal, setIndexModal ] = useState(false);
  const pinecone = options.pinecone || {};
  const indexes = pinecone.indexes || [];
  const { index, indexIsReady } = useMemo(() => {
    const realIndex = indexes.find(i => i?.name === pinecone?.index) || null;
    return { 
      index: realIndex?.name ?? '',
      indexIsReady: !!realIndex?.ready
    }
  }, [pinecone, indexes]);

  const [ queryParams, setQueryParams ] = useState({
    filters: { index },
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
    setQueryParams(prev => ({ ...prev, filters: { index } }));
  }, [index]);

  useEffect(() => {
    if (!indexes.length) {
      onSelectIndex('');
    }
    else if (!index) {
      onSelectIndex(indexes[0].name);
    }
  }, [indexes]);

  useEffect(() => {
    if (mode === 'edit') {
      setSearch('');
      setFoundVectorsData({ total: 0, vectors: [] });
    }
  }, [mode]);

  const onAddEmbedding = async () => {
    setBusy('addEmbedding');
    const res = await nekoFetch(`${apiUrl}/vector`, { nonce: restNonce, method: 'POST',
      json: { vector: { ...embeddingModal, index } }
    });
    if (res.success) {
      setEmbeddingModal(false);
      queryClient.invalidateQueries(['vectors']);
    }
    else {
      console.error(res.message);
      alert(res.message);
    }
    setBusy(false);
  }

  const onModifyEmbedding = async () => {
    setBusy('addEmbedding');
    const res = await nekoFetch(`${apiUrl}/vector`, { nonce: restNonce, method: 'PUT',
      json: { vector: { ...embeddingModal, index } }
    });
    if (res.success) {
      let embedding = {...embeddingModal};
      setEmbeddingModal(false);
      queryClient.invalidateQueries(['vectors']);
      if (mode === 'search') {
        const freshFoundVectorsData = { ...foundVectorsData };
        freshFoundVectorsData.vectors = [ 
          ...freshFoundVectorsData.vectors.filter(v => v.id !== embeddingModal.id), embedding
        ];
        setFoundVectorsData(freshFoundVectorsData);
      }
    }
    else {
      console.error(res.message);
      alert(res.message);
    }
    setBusy(false);
  }

  const onAddIndex = async () => {
    setBusy('addIndex');
    const res = await nekoFetch(`${apiUrl}/pinecone/add_index`, { nonce: restNonce, method: 'POST',
      json: { name: indexModal.name, podType: indexModal.podType }
    });
    if (res.success) {
      const freshPinecone = { ...pinecone, indexes: res.indexes };
      await updateOption(freshPinecone, 'pinecone');
      setIndexModal(false);
    }
    else {
      console.error(res.message);
      alert(res.message);
    }
    setBusy(false);
  }

  const onDeleteEmbedding = async (ids) => {
    setBusy('deleteEmbedding');
    const res = await nekoFetch(`${apiUrl}/vectors`, { nonce: restNonce, method: 'DELETE', json: { ids } });
    if (res.success) {
      queryClient.invalidateQueries(['vectors']);
      if (mode === 'search') {
        const freshFoundVectorsData = { ...foundVectorsData };
        freshFoundVectorsData.vectors = freshFoundVectorsData.vectors.filter(v => !ids.includes(v.id));
        setFoundVectorsData(freshFoundVectorsData);
      }
    }
    else {
      console.error(res.message);
      alert(res.message);
    }
    setBusy(false);
  }

  const onSelectIndex = async (index) => {
    const freshPinecone = { ...pinecone, index };
    updateOption(freshPinecone, 'pinecone');
  }

  const onDeleteIndex = async () => {
    if (!confirm(`Are you sure you want to delete the index "${index}"? All the related embeddings will be deleted as well.`)) {
      return;
    }
    setBusy('deleteIndex');
    const res = await nekoFetch(`${apiUrl}/pinecone/delete_index`, { 
      nonce: restNonce, method: 'DELETE', json: { name: index }
    });
    if (res.success) {
      const freshPinecone = { ...pinecone, indexes: res.indexes };
      await updateOption(freshPinecone, 'pinecone');
    }
    else {
      console.error(res.message);
      alert(res.message);
    }
    setBusy(false);
  }

  const onRefreshIndexes = async () => {
    setBusy('refreshIndexes');
    const res = await nekoFetch(`${apiUrl}/pinecone/list_indexes`, { nonce: restNonce, method: 'GET' });
    if (res.success) {
      const freshPinecone = { ...pinecone, indexes: res.indexes };
      await updateOption(freshPinecone, 'pinecone');
    }
    else {
      console.error(res.message);
      alert(res.message);
    }
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
      data.vectors = data.vectors.slice().sort((a, b) => {
        if (foundVectorsSort.by === 'asc') {
          return a[foundVectorsSort.accessor] > b[foundVectorsSort.accessor] ? 1 : -1;
        } else {
          return a[foundVectorsSort.accessor] < b[foundVectorsSort.accessor] ? 1 : -1;
        }
      });
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
        actions: <>
          <NekoButton className="primary" rounded icon="pencil"
            disabled={busy}
            onClick={() => setEmbeddingModal(x)}>
          </NekoButton>
          <NekoButton className="danger" rounded icon="trash"
            disabled={busy}
            onClick={() => onDeleteEmbedding([x.id])}>
          </NekoButton>
        </>
      }
    })
  }, [mode, vectorsData, foundVectorsData, foundVectorsSort, busy]);

  return (<>
  <NekoWrapper>
    <NekoColumn minimal style={{ flex: 3 }}>
      <NekoBlock className="primary">
        <div style={{ display: 'flex', alignItems: 'center', margin: -5 }}>
          <NekoSwitch style={{ marginRight: 10 }} disabled={busy || !index || !indexIsReady}
            onLabel={i18n.EMBEDDINGS.AI_SEARCH} offLabel={i18n.EMBEDDINGS.EDIT} width={125}
            onValue="search" offValue="edit"
            checked={mode === 'search'} onChange={setMode} 
            onBackgroundColor={NekoTheme.purple} offBackgroundColor={NekoTheme.green}
          />
          {mode === 'search' && <div style={{ flex: 'auto', display: 'flex' }}>
            <NekoInput style={{ flex: 'auto', marginRight: 5 }} placeholder="Search"
              disabled={busy || !index || !indexIsReady}
              value={search} onChange={setSearch} onEnter={onSearch}
              onReset={() => { setSearch(''); setFoundVectorsData({ total: 0, vectors: [] }); }} />
            <NekoButton className="primary" onClick={onSearch} disabled={busy || !index || !indexIsReady}
              isBusy={busy === 'searchVectors'}>
              Search
            </NekoButton>
          </div>}
          {mode === 'edit' && <>
            <NekoButton className="primary" disabled={busy || !index || !indexIsReady}
              onClick={() => setEmbeddingModal(DEFAULT_VECTOR)} >
              Add Embedding
            </NekoButton>
            <NekoButton className="primary" disabled={true}>
              Synchronize Posts (Coming Soon)
            </NekoButton>
          </>}
        </div>
      </NekoBlock>
      <NekoBlock className="primary" style={{ marginTop: -30 }}>

        <NekoTable alternateRowColor busy={busyFetchingVectors}
          sort={mode === 'edit' ? queryParams.sort : foundVectorsSort} onSortChange={(accessor, by) => {
            if (mode === 'edit') {
              setQueryParams(prev => ({ ...prev, sort: { accessor, by } }));
            }
            else {
              setFoundVectorsSort({ accessor, by });
            }
          }}
          data={vectorsRows} columns={columns} 
        />

        <NekoSpacer />

        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <NekoPaging currentPage={queryParams.page} limit={queryParams.limit}
            total={vectorsTotal} onClick={page => { 
              setQueryParams(prev => ({ ...prev, page }));
            }}
          />
          <NekoButton className="primary" style={{ marginLeft: 5 }}
            disabled={busyFetchingVectors || !index}
            onClick={() => {
              queryClient.invalidateQueries(['vectors']);
          }}>Refresh</NekoButton>
        </div>

      </NekoBlock>
    </NekoColumn>
    <NekoColumn minimal>
      <NekoBlock title="Index" className="primary">
        <NekoSelect fullWidth scrolldown name="server" style={{ marginRight: 5 }} disabled={busy}
          value={pinecone.index} onChange={value => onSelectIndex(value)}>
          {indexes.map(x => <NekoOption key={x.name} value={x.name} label={x.name} />)}
          {indexes.length === 0 && <NekoOption value={''} label="None" />}
        </NekoSelect>
        <div style={{ display: 'flex', marginTop: 5 }}>
          <NekoButton className="primary" onClick={() => setIndexModal(DEFAULT_INDEX)} style={{ flex: 1 }}
            isBusy={busy === 'addIndex'} disabled={busy}>
            Add Index
          </NekoButton>
          <NekoButton className="secondary" onClick={onRefreshIndexes} style={{ flex: 1 }}
            isBusy={busy === 'refreshIndexes'} disabled={busy}>
            Refresh
          </NekoButton>
          <NekoButton className="danger" onClick={onDeleteIndex} style={{ flex: 1 }}
            isBusy={busy === 'deleteIndex'} disabled={busy || !index || !indexIsReady}>
            Delete
          </NekoButton>
        </div>
        {index && !indexIsReady && <NekoMessage variant="danger" style={{ marginTop: 15, padding: '8px 12px' }}>
          This index is currently being build by Pinecone. Wait a few minutes, then use the <b>Refresh</b> button.
        </NekoMessage>}
        <p>The embeddings of this index will be used by the chatbot to build an answer if <b>the score for the query is above 75</b>. More control over this will be available soon.</p>
      </NekoBlock>
      <NekoBlock title="Quick Tutorial" className="primary">
        <p>
          An embedding is a textual piece of data (sentence, paragraph, a whole article) that has been converted by OpenAI into a vector. Vectors can then be used to find the most relevant data for a given query.
        </p>
        <p>
          Here, you can create embeddings, and they will be synchronized with <a target="_blank" href="https://www.pinecone.io/">Pinecone</a>, a very fast and affordable vector database.
        </p>
        <p>
          You can switch from EDIT to AI SEARCH and you will be able to query the database, and get your content, with a score. You can edit the content and it will be synchronized with Pinecone. Then make your content perfect so that the results are satisfying!
        </p>
        <p>
          The chatbot can use the embeddings to answer questions. To activate this feature, you will need to add  <i>embeddings_index</i> to the chatbot. Check the builder! 😌
        </p>
        <p>
          <i>If you are able to make a simpler, quicker and better explanation than me, please let me know! Thank you!</i>
        </p>
      </NekoBlock>
    </NekoColumn>
    </NekoWrapper>

    <NekoModal isOpen={embeddingModal}
      title={embeddingModal?.id ? "Modify Embedding" : "Add Embedding"}
      onOkClick={embeddingModal?.id ? onModifyEmbedding : onAddEmbedding}
      onRequestClose={() => setEmbeddingModal(false)}
      onCancelClick={() => setEmbeddingModal(false)}
      ok={embeddingModal?.id ? "Modify" : "Add"}
      disabled={busy === 'addEmbedding'}
      content={<>
        <p>
          A custom embedding can be a sentence, a paragraph or a whole article. When an user input is made, the AI will search for the best embedding that matches the user input and will be able to answer with more accuracy.
        </p>
        <NekoSpacer height={30} />
        <label>Title:</label>
        <NekoSpacer />
        <NekoInput value={embeddingModal?.title} 
          placeholder={`Title, like "My Website Information"`}
          description="This is for your convenience only, it's not used anywhere."
          onChange={value => setEmbeddingModal(prev => ({ ...prev, title: value })) } />
        <NekoSpacer />
        <label>Content:</label>
        <NekoSpacer />
        <NekoTextArea value={embeddingModal?.content} onChange={value => setEmbeddingModal(prev => ({ ...prev, content: value })) } />
        <NekoSpacer />
        <label>Behavior:</label>
        <NekoSpacer />
        <NekoSelect scrolldown name="behavior" disabled={busy}
          value={embeddingModal?.behavior} onChange={value => {
            setEmbeddingModal(prev => ({ ...prev, behavior: value }));
          }}>
          <NekoOption value="context" label="Context" />
          <NekoOption value="answer" label="Answer" />
        </NekoSelect>
        <NekoSpacer />
        <label>Type:</label>
        <NekoSpacer />
        <NekoSelect scrolldown name="type" disabled={busy}
          value={embeddingModal?.type} onChange={value => {
            setEmbeddingModal(prev => ({ ...prev, type: value }));
          }}>
          <NekoOption value="manual" label="Manual" />
          <NekoOption value="post" label="Post (Whole)" />
          <NekoOption value="post-fragment" label="Post (Fragment)" />
        </NekoSelect>
        {(embeddingModal?.type === 'post' || embeddingModal?.type === 'post-fragment') && <>
          <NekoSpacer />
          <label>Post ID:</label>
          <NekoSpacer />
          <NekoInput value={embeddingModal?.refId} 
            onChange={value => setEmbeddingModal(prev => ({ ...prev, refId: value })) } />
        </>}
      </>}
    />

    <NekoModal isOpen={indexModal}
      title="Add Index"
      onOkClick={onAddIndex}
      onRequestClose={() => setIndexModal(false)}
      onCancelClick={() => setIndexModal(false)}
      ok="Add Index"
      disabled={busy === 'addIndex'}
      content={<>
        <p>
          An index is like a database, and contains embeddings. You can have many indexes and switch between them. The indexes are hosted on Pinecone.
        </p>
        <NekoSpacer height={30} />
        <label>Name:</label>
        <NekoSpacer />
        <NekoInput value={indexModal?.name} 
          placeholder={`Name for your index`}
          onChange={value => setIndexModal(prev => ({ ...prev, name: value })) } />
        <NekoSpacer />
        <label>Type:</label>
        <NekoSpacer />
        <NekoSelect scrolldown name="podType" disabled={busy} value={indexModal?.podType}
          onChange={value => { setIndexModal(prev => ({ ...prev, podType: value })); } }
          description={<>Pick S1 only if you will have more than 1 million of embeddings. P2 is faster for querying, slower for adding, and more expensive if you are not using the <a href="https://www.pinecone.io/pricing/" target="_blank">Starter Plan</a> (free) of Pinecone. P2 is recommended.</>}>
          <NekoOption value="s1" label="S1 (5M Embeddings)" />
          <NekoOption value="p1" label="P1 (1M Embeddings & High Perf)" />
          <NekoOption value="p2" label="P2 (1M Embeddings & Max Perf)" />
        </NekoSelect>
      </>}
    />
  </>);
}

export default VectorDatabase;