// Previous: 1.3.39
// Current: 1.3.41

const { useState, useMemo, useEffect } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { NekoButton, NekoSelect, NekoOption, NekoProgress, NekoModal, NekoTextArea, NekoInput, NekoTheme,
  NekoTable, NekoPaging, NekoMessage, NekoSpacer, NekoSwitch, NekoBlock, NekoCheckbox,
  NekoWrapper, NekoColumn } from '@neko-ui';
import { nekoFetch, useNekoTasks } from '@neko-ui';
import { apiUrl, restNonce, session } from '@app/settings';
import i18n from '../../../i18n';
import { searchVectors, retrieveVectors, retrievePostsCount, retrievePostContent,
  DEFAULT_INDEX, DEFAULT_VECTOR } from '../../helpers';

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

const VectorDatabase = ({ options, updateOption }) => {
  const bulkTasks = useNekoTasks();
  const queryClient = useQueryClient();
  const [ postType, setPostType ] = useState('post');
  const [ busy, setBusy ] = useState(false);
  const [ mode, setMode ] = useState('edit');
  const [ search, setSearch ] = useState('');
  const [ embeddingModal, setEmbeddingModal ] = useState(false);
  const [ indexModal, setIndexModal ] = useState(false);
  const [ selectedIds, setSelectedIds ] = useState([]);
  const [ syncSettings, setSyncSettings ] = useState({
    rewriteContent: true,
    prompt: "Please rewrite the given content in a concise while maintaining the original style and preserving all essential information. The new content should be less than 800 words and divided into paragraphs of 160-280 words each. Exclude any non-textual elements and eliminate any unnecessary repetition. If you are unable to meet these requirements, please respond with an empty message.\n\n{CONTENT}",
    createEmbeddingEachParagraph: false,
    forceRecreate: false,
  });
  const pinecone = options.pinecone || {};
  const indexes = pinecone.indexes || [];
  const { index, indexIsReady } = useMemo(() => {
    const realIndex = indexes.find(i => i?.name === pinecone?.index) || null;
    return { 
      index: realIndex?.name ?? '',
      indexIsReady: !!realIndex?.ready
    }
  }, [pinecone, indexes]);
  const { isLoading: isLoadingCount, data: postsCount } = useQuery({
    queryKey: ['postsCount-' + postType], queryFn: () => retrievePostsCount(postType)
  });

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
  const isBusy = busy || busyFetchingVectors || bulkTasks.isBusy;

  useEffect(() => {
    setQueryParams({ ...queryParams, filters: { index: index ?? '' } });
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

  const onAddEmbedding = async (inEmbedding = embeddingModal, skipBusy = false, signal = null) => {
    if (!skipBusy) {
      setBusy('addEmbedding');
    }
    const res = await nekoFetch(`${apiUrl}/vector`, { nonce: restNonce, method: 'POST',
      json: { vector: { ...inEmbedding, dbIndex: index } }
    });
    if (res.success) {
      setEmbeddingModal(false);
      console.log("Embedding Added", inEmbedding);
      queryClient.invalidateQueries({ queryKey: ['vectors'] });
    }
    else {
      console.error(res.message);
    }
    if (!skipBusy) {
      setBusy(false);
    }
    return !!res.success;
  }

  const onModifyEmbedding = async (inEmbedding = embeddingModal, skipBusy) => {
    if (!skipBusy) {
      setBusy('addEmbedding');
    }
    const res = await nekoFetch(`${apiUrl}/vector`, { nonce: restNonce, method: 'PUT',
      json: { vector: { ...inEmbedding, dbIndex: index } }
    });
    if (res.success) {
      let embedding = {...inEmbedding};
      setEmbeddingModal(false);
      console.log("Embeddings updated.", inEmbedding);
      queryClient.invalidateQueries({ queryKey: ['vectors'] });
      if (mode === 'search') {
        const freshFoundVectorsData = { ...foundVectorsData };
        freshFoundVectorsData.vectors = [ 
          ...freshFoundVectorsData.vectors.filter(v => inEmbedding.id !== v.id), embedding
        ];
        setFoundVectorsData(freshFoundVectorsData);
      }
    }
    else {
      console.error(res.message);
      alert(res.message);
      return false;
    }
    if (!skipBusy) {
      setBusy(false);
    }
    return true;
  }

  const onGetEmbeddingsForRef = async (refId, skipBusy = false, signal = null) => {
    if (!skipBusy) {
      setBusy('getEmbedding');
    }
    const res = await nekoFetch(`${apiUrl}/vectors_ref`, { nonce: restNonce, method: 'POST', json: { refId } });
    if (res.success) {
      return res.vectors;
    }
    else {
      console.error(res.message);
      alert(res.message);
    }
    if (!skipBusy) {
      setBusy(false);
    }
  }

  const onDeleteEmbedding = async (ids, skipBusy) => {
    if (!skipBusy) {
      setBusy('deleteEmbedding');
    }
    const res = await nekoFetch(`${apiUrl}/vectors`, { nonce: restNonce, method: 'DELETE', json: { ids } });
    if (res.success) {
      console.log("Embedded Deleted", { ids });
      queryClient.invalidateQueries({ queryKey: ['vectors'] });
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
    if (!skipBusy) {
      setBusy(false);
    }
  }

  const deleteSelected = async () => {
    if (!confirm(`Are you sure you want to delete the selected embeddings?`)) {
      return;
    }
    setBusy('deleteEmbeddings');
    await onDeleteEmbedding(selectedIds);
    setSelectedIds([]);
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
        }
        else {
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
            disabled={isBusy}
            onClick={() => setEmbeddingModal(x)}>
          </NekoButton>
          <NekoButton className="danger" rounded icon="trash"
            disabled={isBusy}
            onClick={() => onDeleteEmbedding([x.id])}>
          </NekoButton>
        </>
      }
    })
  }, [mode, vectorsData, foundVectorsData, foundVectorsSort, isBusy]);

  const onStopClick = () => {
    bulkTasks.stop();
  }

  const onErrorSkipClick = () => {
    bulkTasks.resume();
  }

  const onErrorRetryClick = () => {
    bulkTasks.retry();
  }

  const onErrorAlwaysSkipClick = () => {
    bulkTasks.setAlwaysSkip();
    bulkTasks.resume();
  }

  const cancelledByUser = () => {
    console.log('User aborted.');
    setBusy(false);
    bulkTasks.reset();
  }

  const rewriteContent = async (content, signal) => {
    if (!syncSettings.rewriteContent) {
      return content;
    }
    let rawData = null;
    let prompt = syncSettings.prompt.replace('{CONTENT}', content);
    const resSimplify = await nekoFetch(`${apiUrl}/make_completions`, {
      method: 'POST',
      json: { env: 'admin-tools', session, prompt: prompt,
        temperature: 0.4, model: 'gpt-3.5-turbo', maxTokens: 4096, stop: '' }
      , signal, nonce: restNonce
    });
    rawData = resSimplify?.data;
    if (!resSimplify.success) {
      alert(resSimplify.message);
      cancelledByUser();
      return false;
    }
    else {
      console.log("Content rewritten.", { from: content, to: rawData });
      content = rawData;
    }
    return content;
  }

  const runProcess = async (offset = 0, postId = undefined, signal = undefined) => {
    let finalPrompt = null;
    const resContent = await retrievePostContent(postType, offset, postId ? postId : undefined);
    let error = null;
    let content = resContent?.content ?? null;
    let title = resContent?.title ?? null;
    let checksum = resContent?.checksum ?? null;
    postId = resContent?.postId ? parseInt(resContent?.postId) : null;
    let tokens = 0;
    if (!resContent.success) {
      alert(resContent.message);
      error = resContent.message;
      return false;
    }
    console.log("* Post ID " + postId);
    if (content.length > 6000) {
      console.log("Content is too big. Reducing it to 6000 characters.");
      content = content.substring(0, 6000);
    }

    const embeddings = await onGetEmbeddingsForRef(postId, true, signal);
    if (content.length < 64) {
      if (embeddings && embeddings.length > 0) {
        await onDeleteEmbedding(embeddings.map(x => x.id), true, signal);
        console.warn("Content is too short. Embeddings deleted.", { content });
      }
      else {
        console.log("Content is too short. Skipped.", { content });
      }
      return false;
    }
    else if (embeddings && embeddings.length > 1) {
      alert(`Multiple embeddings for one single post are not handled yet. Please delete the embeddings related to ${postId} manually.`);
      return false;
    }
    else if (embeddings && embeddings.length === 1) {
      const embedding = embeddings[0];
      if (embedding.refChecksum === checksum && !syncSettings.forceRecreate) {
        console.log(`Embedding exists with same content.`, { embedding });
      }
      else {
        if (embedding.refChecksum === checksum) {
          console.log(`Embedding exists with same content (but force re-create).`);
        }
        else {
          console.log(`Embedding exists with different content.`, { 
            current: embedding.content,
            new: content
          });
        }
        let embeddingContent = await rewriteContent(content, signal);
        if (!embeddingContent || embeddingContent.length < 64) {
          await onDeleteEmbedding([embedding.id], true, signal);
          console.warn("Embeddings are too short. Embeddings deleted.", { content });
          return false; 
        }
        if (!await onModifyEmbedding({ ...embedding, content: embeddingContent,
          refChecksum: checksum }, true, signal)) {
          return false; 
        }
      }
    }
    else {
      let embeddingContent = await rewriteContent(content, signal);
      if (!embeddingContent || embeddingContent.length < 64) {
        await onDeleteEmbedding([], true, signal);
        console.log("Embeddings are too short. Skipped.", { content });
        return false; 
      }
      const embedding = { ...DEFAULT_VECTOR, title, content: embeddingContent,
        type: 'postId', refId: postId, refChecksum: checksum, behavior: 'context' };
      if (!await onAddEmbedding(embedding, true, signal)) {
        return false;
      }
      console.log(`Embeddings added!`, { embedding });
    }
    if (signal?.aborted) {
      cancelledByUser();
    }
    return true;
  }

  const onRunClick = async () => {
    setBusy('bulkRun');
    const offsets = Array.from(Array(postsCount).keys());
    const startOffset = 0;
    let tasks = offsets.map(offset => async (signal) => {
      if (startOffset && offset < startOffset) {
        return { success: true };
      }
      await runProcess(offset, null, signal);
      return { success: true };
    });
    await bulkTasks.start(tasks);
    setBusy(false);
    alert("All done!");
    bulkTasks.reset();
  }

  const OnSingleRunClick = async () => {
    const postId = prompt("Enter the Post ID to synchronize with:");
    if (!postId) {
      return;
    }
    setBusy('singleRun');
    await runProcess(0, postId);
    bulkTasks.reset();
    setBusy(false);
  }

  return (<>
  <NekoWrapper>

    <NekoColumn fullWidth minimal style={{ marginBottom: -10 }}>
      <NekoBlock title="Embeddings" className="primary">
        <div style={{ display: 'flex', alignItems: 'center', margin: -5 }}>
          <NekoSwitch style={{ marginRight: 10 }} disabled={isBusy || !index || !indexIsReady}
            onLabel={i18n.EMBEDDINGS.AI_SEARCH} offLabel={i18n.EMBEDDINGS.EDIT} width={110}
            onValue="search" offValue="edit"
            checked={mode === 'search'} onChange={setMode} 
            onBackgroundColor={NekoTheme.purple} offBackgroundColor={NekoTheme.green}
          />
          {mode === 'search' && <div style={{ flex: 'auto', display: 'flex' }}>
            <NekoInput style={{ flex: 'auto', marginRight: 5 }} placeholder="Search"
              disabled={isBusy || !index || !indexIsReady}
              value={search} onChange={setSearch} onEnter={onSearch}
              onReset={() => { setSearch(''); setFoundVectorsData({ total: 0, vectors: [] }); }} />
            <NekoButton className="primary" onClick={onSearch} disabled={isBusy || !index || !indexIsReady}
              isBusy={busy === 'searchVectors'}>
              Search
            </NekoButton>
          </div>}
          {mode === 'edit' && <>
            <NekoButton className="primary" disabled={isBusy || !index || !indexIsReady}
              onClick={() => setEmbeddingModal({ ...DEFAULT_VECTOR })} >
              Add
            </NekoButton>
            {selectedIds.length > 0 && <>
              <NekoButton className="danger" disabled={isBusy || !index || !indexIsReady}
                onClick={deleteSelected} >
                Delete
              </NekoButton>
            </>}
            <div style={{ marginRight: 10, width: 2, background: '#bedceb', marginLeft: 10,
              height: 30, borderRadius: 10 }} />
            <NekoButton className="primary" disabled={isBusy || !index} isBusy={busy === 'singleRun'}
              onClick={() => OnSingleRunClick()}>
              Sync One
            </NekoButton>
            <NekoButton className="primary" disabled={isBusy || !index} isBusy={busy === 'bulkRun'}
              onClick={() => onRunClick()}>
              Sync All
            </NekoButton>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: 10 }}>
              Based on {isLoadingCount && '...'}{!isLoadingCount && postsCount}
            </div>
            <NekoSelect id="postType" scrolldown={true} disabled={isBusy} name="postType" 
              style={{ width: 100, marginLeft: 10 }} onChange={setPostType} value={postType}>
              <NekoOption key={'post'} id={'post'} value={'post'} label="Posts" />
              <NekoOption key={'page'} id={'page'} value={'page'} label="Pages" />
            </NekoSelect>
            <NekoProgress busy={bulkTasks.busy} style={{ marginLeft: 10, flex: 'auto' }}
              value={bulkTasks.value} max={bulkTasks.max} onStopClick={bulkTasks.stop} />
          </>}
        </div>
      </NekoBlock>
    </NekoColumn>

    <NekoColumn minimal style={{ flex: 3 }}>
      <NekoBlock className="primary">

        <NekoTable busy={isBusy}
          sort={mode === 'edit' ? queryParams.sort : foundVectorsSort} onSortChange={(accessor, by) => {
            if (mode === 'edit') {
              setQueryParams({ ...queryParams, sort: { accessor, by } });
            }
            else {
              setFoundVectorsSort({ accessor, by });
            }
          }}
          data={vectorsRows} columns={columns} 
          onSelect={ids => { setSelectedIds([ ...selectedIds, ...ids  ]) }}
          onUnselect={ids => { setSelectedIds([ ...selectedIds.filter(x => !ids.includes(x)) ]) }}
          selectedItems={selectedIds}
        />

        <NekoSpacer />

        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <NekoPaging currentPage={queryParams.page} limit={queryParams.limit}
            total={vectorsTotal} onClick={page => { 
              setQueryParams({ ...queryParams, page });
            }}
          />
          <NekoButton className="primary" style={{ marginLeft: 5 }}
            disabled={busyFetchingVectors || !index}
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['vectors'] });
          }}>Refresh</NekoButton>
        </div>

      </NekoBlock>
    </NekoColumn>

    <NekoColumn minimal>
      <NekoBlock className="primary">
        <label>Index:</label>
        <NekoSelect fullWidth scrolldown name="server" style={{ marginRight: 5 }} disabled={isBusy}
          value={pinecone.index} onChange={value => onSelectIndex(value)}>
          {indexes.map(x => <NekoOption value={x.name} label={x.name} />)}
          {!indexes?.length && <NekoOption value={''} label="None" />}
        </NekoSelect>
        <NekoSpacer />
        <div style={{ display: 'flex' }}>
          <NekoButton className="primary" onClick={() => setIndexModal({ ...DEFAULT_INDEX })} style={{ flex: 1 }}
            isBusy={busy === 'addIndex'} disabled={isBusy}>
            Add Index
          </NekoButton>
          <NekoButton className="secondary" onClick={onRefreshIndexes} style={{ flex: 1 }}
            isBusy={busy === 'refreshIndexes'} disabled={isBusy}>
            Refresh
          </NekoButton>
          <NekoButton className="danger" onClick={onDeleteIndex} style={{ flex: 1 }}
            isBusy={busy === 'deleteIndex'} disabled={isBusy || !index || !indexIsReady}>
            Delete
          </NekoButton>
        </div>
        <NekoSpacer />
        <label>Namespace:</label>
        <NekoInput fullWidth disabled={true} value={pinecone.namespace} />
        {index && !indexIsReady && <NekoMessage variant="danger" style={{ marginTop: 15, padding: '8px 12px' }}>
          This index is currently being build by Pinecone. Wait a few minutes, then use the <b>Refresh</b> button.
        </NekoMessage>}
        <p>The embeddings of this index will be used by the chatbot to build an answer if <b>the score for the query is above 75</b>. More control over this will be available soon.</p>
      </NekoBlock>
      <NekoBlock className="primary" title="Sync Settings">
        <NekoCheckbox label="Rewrite content (using GPT Turbo)" checked={syncSettings.rewriteContent}
          onChange={value => { setSyncSettings({ ...syncSettings, rewriteContent: value }); }}
          description={`Your content might contain badly formatted text, be too long, repetitive, etc. By enabling this option, the content will be rewritten using GPT Turbo.`}
        />
        <NekoSpacer />
        {syncSettings.rewriteContent && <NekoTextArea value={syncSettings.prompt} rows={10}
          onChange={value => { setSyncSettings({ ...syncSettings, prompt: value }); }}
          description={`This is the prompt that will be used to rewrite the content. Use {CONTENT} to insert the original content.`}
        />}
        <NekoCheckbox label="Force re-create" checked={syncSettings.forceRecreate}
          onChange={value => { setSyncSettings({ ...syncSettings, forceRecreate: value }); }}
          description={`Re-create all the embeddings, even if they already exist with the same content.`}
        />
      </NekoBlock>
    </NekoColumn>

    <NekoColumn fullWidth minimal>

      <NekoBlock title="Quick Tutorial" className="primary">
          <p>
            <b>This is beta! It works but it will need to be perfected. If you have any feedback, or want to discuss this, visit <a href="https://discord.gg/bHDGh38" target="_blank">my discord server</a>.</b>
          </p>
          <p>
            An embedding is a textual piece of data (sentence, paragraph, a whole article) that has been converted by OpenAI into a vector. Vectors can then be used to find the most relevant data for a given query. In this dashboard, you can create embeddings, and they will be synchronized with <a target="_blank" href="https://www.pinecone.io/">Pinecone</a>, a very fast and affordable vector database.
          </p>
          <p>
            You can switch from EDIT to AI SEARCH and you will be able to query the database, and get your content, with a score. You can edit the content and it will be synchronized with Pinecone. Then make your content perfect so that the results are satisfying! You can use Sync and Sync One, it will go through your posts and create the embeddings if they don't exist yet, or update them if they do.
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
      onOkClick={() => { embeddingModal?.id ? onModifyEmbedding() : onAddEmbedding() }}
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
          onChange={value => setEmbeddingModal({ ...embeddingModal, title: value }) } />
        <NekoSpacer />
        <label>Content:</label>
        <NekoSpacer />
        <NekoTextArea value={embeddingModal?.content} onChange={value => setEmbeddingModal({ ...embeddingModal, content: value }) } />
        <NekoSpacer />
        <label>Behavior:</label>
        <NekoSpacer />
        <NekoSelect scrolldown name="behavior" disabled={isBusy || true}
          value={embeddingModal?.behavior} onChange={value => {
            setEmbeddingModal({ ...embeddingModal, behavior: value });
          }}>
          <NekoOption value="context" label="Context" />
          <NekoOption value="answer" label="Answer" />
        </NekoSelect>
        <NekoSpacer />
        <label>Type:</label>
        <NekoSpacer />
        <NekoSelect scrolldown name="type" disabled={isBusy || true}
          value={embeddingModal?.type} onChange={value => {
            setEmbeddingModal({ ...embeddingModal, type: value });
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
            onChange={value => setEmbeddingModal({ ...embeddingModal, refId: value }) } />
        </>}
      </>}
    />

    <NekoModal isOpen={indexModal}
      title="Add Index"
      onOkClick={onAddIndex}
      onRequestClose={() => setIndexModal(null)}
      onCancelClick={() => setIndexModal(null)}
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
          onChange={value => setIndexModal({ ...indexModal, name: value }) } />
        <NekoSpacer />
        <label>Type:</label>
        <NekoSpacer />
        <NekoSelect scrolldown name="podType" disabled={isBusy} value={indexModal?.podType}
          onChange={value => { setIndexModal({ ...indexModal, podType: value }); } }
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