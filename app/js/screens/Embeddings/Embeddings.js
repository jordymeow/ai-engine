// Previous: 1.6.86
// Current: 1.6.98

const { useState, useMemo, useEffect } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { NekoButton, NekoSelect, NekoOption, NekoProgress, NekoModal, NekoTextArea, NekoInput,
  NekoTable, NekoPaging, NekoMessage, NekoSpacer, NekoSwitch, NekoBlock, NekoCheckbox,
  NekoTabs, NekoTab, NekoWrapper, NekoColumn, NekoContainer, NekoIcon } from '@neko-ui';
import { nekoFetch, useNekoTasks, useNekoColors } from '@neko-ui';

import i18n from '@root/i18n';
import { apiUrl, restNonce, session } from '@app/settings';
import { searchVectors, retrieveVectors, retrievePostsCount, retrievePostContent,
  DEFAULT_INDEX, DEFAULT_VECTOR, reduceContent, estimateTokens } from '@app/helpers-admin';
import { retrievePostTypes } from '@app/requests';

const searchColumns = [
  { accessor: 'status', title: 'Status', width: '80px' },
  { accessor: 'title', title: 'Title', sortable: true },
  { accessor: 'type', title: 'Ref', sortable: true, width: '60px' },
  { accessor: 'score', title: 'Score', sortable: true, width: '65px' },
  { accessor: 'updated', title: 'Updated', sortable: true, width: '80px' },
  { accessor: 'created', title: 'Created', sortable: true, width: '80px' },
  { accessor: 'actions', title: '', width: '65px'  }
];

const queryColumns = [
  { accessor: 'status', title: 'Status', sortable: true, width: '80px' },
  { accessor: 'title', title: 'Title', sortable: false },
  { accessor: 'type', title: 'Ref', sortable: true, width: '60px' },
  { accessor: 'updated', title: 'Updated', sortable: true, width: '80px' },
  { accessor: 'created', title: 'Created', sortable: true, width: '80px' },
  { accessor: 'actions', title: '', width: '65px'  }
];

const StatusIcon = ({ status, includeText = false }) => {
  const { colors } = useNekoColors();
  
  const orange = colors.orange;
  const green = colors.green;
  const red = colors.red;

  let icon = null;
  switch (status) {
    case 'outdated':
      icon = <NekoIcon title={status} icon="alert" width={24} color={orange} />;
      break;
    case 'ok':
      icon = <NekoIcon title={status} icon="check-circle" width={24} color={green} />;
      break;
    default:
      icon = <NekoIcon title={status} icon="alert" width={24} color={orange} />;
      break;
  }
  if (includeText) {
    return <div style={{ display: 'flex', alignItems: 'center' }}>
      {icon} 
      <span style={{ textTransform: 'uppercase', fontSize: 9, marginLeft: 3 }}>{status}</span>
    </div>;
  }
  return icon;
}

const Embeddings = ({ options, updateOption }) => {
  const queryClient = useQueryClient();
  const { colors } = useNekoColors();
  const [ postType, setPostType ] = useState('post');
  const [ busy, setBusy ] = useState(false);
  const [ mode, setMode ] = useState('edit');
  const [ search, setSearch ] = useState('');
  const [ embeddingModal, setEmbeddingModal ] = useState(false);
  const [ indexModal, setIndexModal ] = useState(false);
  const [ selectedIds, setSelectedIds ] = useState([]);
  const embeddingsSettings = options.embeddings || {};
  const pinecone = options.pinecone || {};
  const indexes = pinecone.indexes || [];
  const minScore = embeddingsSettings?.minScore > 0 ? embeddingsSettings.minScore : 75;
  const maxSelect = embeddingsSettings?.maxSelect > 0 ? embeddingsSettings.maxSelect : 1;

  const { index, indexIsReady } = useMemo(() => {
    const realIndex = indexes.find(i => i?.name === pinecone?.index) || null;
    return { 
      index: realIndex?.name ?? '',
      indexIsReady: !!realIndex?.ready
    }
  }, [pinecone, indexes]);
  const { isLoading: isLoadingPostTypes, data: postTypes } = useQuery({
    queryKey: ['postTypes'], queryFn: retrievePostTypes
  });
  const { isLoading: isLoadingCount, data: postsCount } = useQuery({
    queryKey: ['postsCount-' + postType + '-' + embeddingsSettings?.syncPostStatus ?? 'publish'],
    queryFn: () => retrievePostsCount(postType, embeddingsSettings?.syncPostStatus ?? 'publish'),
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
  const bulkTasks = useNekoTasks({ i18n, onStop: () => { setBusy(); bulkTasks.reset(); } });
  const isBusy = busy || busyFetchingVectors || bulkTasks.isBusy || isLoadingPostTypes;

  const setEmbeddingsSettings = async (freshEmbeddingsSettings) => {
    setBusy('updateSettings');
    await updateOption({ ...freshEmbeddingsSettings }, 'embeddings');
    setBusy(null);
  }

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

  useEffect(() => {
    if (!embeddingsSettings?.syncPostTypes?.length || !embeddingsSettings?.syncPostStatus?.length) {
      setEmbeddingsSettings({ ...embeddingsSettings, 
        syncPostTypes: ['post', 'page', 'product'],
        syncPostStatus: ['publish']
      });
    }
  }, [embeddingsSettings.syncPostTypes]);

  const onAddIndex = async () => {
    setBusy('addIndex');
    try {
      const res = await nekoFetch(`${apiUrl}/indexes/add`, { nonce: restNonce, method: 'POST',
        json: { name: indexModal.name, podType: indexModal.podType }
      });
      const freshPinecone = { ...pinecone, indexes: res.indexes };
      await updateOption(freshPinecone, 'pinecone');
      setIndexModal(false);
    }
    catch (err) {
      console.error(err);
      alert(err.message);
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
    try {
      const res = await nekoFetch(`${apiUrl}/indexes/delete`, { 
        nonce: restNonce, method: 'POST', json: { name: index }
      });
      const freshPinecone = { ...pinecone, indexes: res.indexes };
      await updateOption(freshPinecone, 'pinecone');
    }
    catch (err) {
      console.error(err);
      alert(err.message);
    }
    setBusy(false);
  }

  const onRefreshIndexes = async () => {
    setBusy('refreshIndexes');
    try {
      const res = await nekoFetch(`${apiUrl}/indexes/list`, { nonce: restNonce, method: 'GET' });
      const freshPinecone = { ...pinecone, indexes: res.indexes };
      await updateOption(freshPinecone, 'pinecone');
    }
    catch (err) {
      console.error(err);
      alert(err.message);
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
    try {
      await nekoFetch(`${apiUrl}/vectors/add`, { nonce: restNonce, method: 'POST',
        json: { vector: { ...inEmbedding, dbIndex: index } }
      });
      setEmbeddingModal(false);
      console.log("Embedding Added", inEmbedding);
      queryClient.invalidateQueries({ queryKey: ['vectors'] });
      if (!skipBusy) {
        setBusy(false);
      }
    }
    catch (err) {
      console.error(err);
      throw new Error(err.message ?? "Unknown error, check your console logs.");
    }
    return true;
  }

  const onModifyEmbedding = async (inEmbedding = embeddingModal, skipBusy) => {
    if (!skipBusy) {
      setBusy('addEmbedding');
    }
    try {
      await nekoFetch(`${apiUrl}/vectors/update`, { nonce: restNonce, method: 'POST',
        json: { vector: { ...inEmbedding, dbIndex: index } }
      });
    }
    catch (err) {
      console.error(err);
      throw new Error(err.message ?? "Unknown error, check your console logs.");
    }
    let embedding = {...inEmbedding};
    setEmbeddingModal(false);
    console.log("Embeddings updated.", inEmbedding);
    queryClient.invalidateQueries({ queryKey: ['vectors'] });
    if (mode === 'search') {
      const freshFoundVectorsData = { ...foundVectorsData };
      freshFoundVectorsData.vectors = [ 
        ...freshFoundVectorsData.vectors.filter(v => inEmbedding.id !== v.id), embedding
      ]
      setFoundVectorsData(freshFoundVectorsData);
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
    try {
      const res = await nekoFetch(`${apiUrl}/vectors/ref`, { nonce: restNonce, method: 'POST', json: { refId } });
      if (!skipBusy) {
        setBusy(false);
      }
      return res.vectors;
    }
    catch (err) {
      console.error(err);
      throw new Error(err.message ?? "Unknown error, check your console logs.");
    }
  }

  const onDeleteEmbedding = async (ids, skipBusy) => {
    if (!skipBusy) {
      setBusy('deleteEmbedding');
    }
    try {
      await nekoFetch(`${apiUrl}/vectors/delete`, { nonce: restNonce, method: 'POST', json: { ids } });
    }
    catch (err) {
      console.error(err);
      throw new Error(err.message ?? "Unknown error, check your console logs.");
    }
    console.log("Embeddings deleted.", { ids });
    queryClient.invalidateQueries({ queryKey: ['vectors'] });
    if (mode === 'search') {
      const freshFoundVectorsData = { ...foundVectorsData };
      freshFoundVectorsData.vectors = freshFoundVectorsData.vectors.filter(v => !ids.includes(v.id));
      setFoundVectorsData(freshFoundVectorsData);
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

  const rewriteContent = async (post, language = "english", signal) => {
    if (!embeddingsSettings.rewriteContent) {
      return post.content;
    }
    let prompt = embeddingsSettings.rewritePrompt.replace('{CONTENT}', post.content);
    prompt = prompt.replace('{TITLE}', post.title);
    prompt = prompt.replace('{URL}', post.url);
    prompt = prompt.replace('{EXCERPT}', post.excerpt);
    prompt = prompt.replace('{ID}', post.postId);
    prompt = prompt.replace('{LANGUAGE}', language);
    let rewrittenContent = null;
    try {
      const res = await nekoFetch(`${apiUrl}/ai/completions`, {
        method: 'POST',
        json: { env: 'admin-tools', session, prompt: prompt,
          temperature: 0.4, model: 'gpt-3.5-turbo', maxTokens: 4096, stop: ''
        },
        signal: signal,
        nonce: restNonce
      });
      rewrittenContent = res?.data;
    }
    catch (err) {
      console.error(err);
      throw new Error(err.message ?? "Unknown error, check your console logs.");
    }
    console.log("Content rewritten.", { from: post.content, to: rewrittenContent });
    return rewrittenContent;
  }

  const vectorsTotal = useMemo(() => {
    return vectorsData?.total || 0;
  }, [vectorsData]);

  const vectorsRows = useMemo(() => {
    const data = mode === 'edit' ? vectorsData : foundVectorsData;
    if (!data?.vectors) { return []; }

    if (mode === 'search') {
      data.vectors = data.vectors.sort((a, b) => {
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
      let score = x.score ? 
        <span style={{ color: (x.score > minScore / 100) ? 'var(--neko-green)' : 'inherit' }}>
        {(x.score.toFixed(4) * 100).toFixed(2)}
      </span> : '-';

      let subType = null;
      if (x.subType && typeof x.subType === 'string') {
        subType = x.subType.toUpperCase();
      }

      return {
        id: x.id,
        type: <small>
          {x.refId ? <>ID <a href={`/wp-admin/post.php?post=${x.refId}&action=edit`} target="_blank">#{x.refId}</a><br /><div style={{ fontSize: '80%', marginTop: -5 }}>{subType}</div></> : 'MANUAL'}</small>,
        score: score,
        title: x.title,
        status: <StatusIcon status={x.status} includeText />,
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

  const cancelledByUser = () => {
    console.log('User aborted.');
    setBusy(false);
    bulkTasks.reset();
  }

  const runProcess = async (offset = 0, postId = undefined, signal = undefined) => {
    const resContent = await retrievePostContent(postType, offset,
      postId ? postId : undefined, embeddingsSettings?.syncPostStatus ?? 'publish');
    let content = resContent?.content ?? null;
    const title = resContent?.title ?? null;
    const url = resContent?.url ?? null;
    const excerpt = resContent?.excerpt ?? null;
    const checksum = resContent?.checksum ?? null;
    const language = resContent?.language ?? "english";
    postId = resContent?.postId ? parseInt(resContent?.postId) : null;
    if (!resContent.success) {
      throw new Error(resContent.message);
    }

    console.log("* Post ID " + postId);

    if (estimateTokens(content) > 2048) {
      content = reduceContent(content, 2048);
      console.log("Too much content. Reduced it to approximatively 2048 tokens.", { 
        before: resContent.content,
        beforeLength: resContent.content.length,
        after: content,
        afterLength: content.length
      });
    }

    const embeddings = await onGetEmbeddingsForRef(postId, true, signal);
    if (content.length < 64) {
      if (embeddings.length > 0) {
        await onDeleteEmbedding(embeddings.map(x => x.id), true, signal);
        console.warn("Content is too short. Embeddings deleted.", { content });
      }
      else {
        console.log("Content is too short. Skipped.", { content });
      }
      return false;
    }
    else if (embeddings.length > 1) {
      alert(`Multiple embeddings for one single post are not handled yet. Please delete the embeddings related to ${postId} manually.`);
      return false;
    }
    else if (embeddings.length === 1) {
      const embedding = embeddings[0];
      if (embedding.refChecksum === checksum && !embeddingsSettings.forceRecreate) {
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
        const post = { postId, content, title, url, excerpt, checksum, language };
        let embeddingContent = await rewriteContent(post, language, signal);
        if (!embeddingContent || embeddingContent.length < 64) {
          await onDeleteEmbedding(embeddings.map(x => x.id), true, signal);
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
      const post = { postId, content, title, url, excerpt, checksum, language };
      let embeddingContent = await rewriteContent(post, language, signal);
      if (!embeddingContent || embeddingContent.length < 64) {
        await onDeleteEmbedding(embeddings.map(x => x.id), true, signal);
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

  const onBulkRunClick = async (all = false) => {
    console.log('onBulkRunClick', { all });
    setBusy('bulkRun');
    let tasks = [];
    if (all || selectedIds.length === 0) {
      const offsets = Array.from(Array(postsCount).keys());
      tasks = offsets.map(offset => async (signal) => {
        await runProcess(offset, null, signal);
        return { success: true };
      });
    }
    else {
      const postIds = vectorsData.vectors.filter(x => selectedIds.includes(x.id))
        .map(x => x.type === 'postId' ? x.refId : null).filter(x => x !== null);
      tasks = postIds.map(postId => async (signal) => {
        await runProcess(0, postId, signal);
        return { success: true };
      });
    }
    
    await bulkTasks.start(tasks);
    setBusy(false);
    alert("All done! For more information, check the console (Chrome Developer Tools). Posts with very short content (or content that could not be retrieved) are skipped.");
    bulkTasks.reset();
  }

  const OnSingleRunClick = async () => {
    const postId = prompt("Enter the Post ID to synchronize with:");
    if (!postId) {
      return;
    }
    setBusy('singleRun');
    try {
      await runProcess(0, postId);
    }
    catch (error) {
      console.error(error);
      alert(error?.message ?? error);
    }
    setBusy(false);
  }

  return (<>
    <NekoWrapper>

      <NekoColumn fullWidth minimal style={{ marginBottom: -10 }}>

        <div style={{ display: 'flex' }}>

          <NekoContainer style={{ margin: 10 }} contentStyle={{ padding: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <NekoSwitch style={{ marginRight: 10 }} disabled={isBusy || !index || !indexIsReady}
                onLabel={i18n.EMBEDDINGS.AI_SEARCH} offLabel={i18n.EMBEDDINGS.EDIT} width={110}
                onValue="search" offValue="edit"
                checked={mode === 'search'} onChange={setMode} 
                onBackgroundColor={colors.purple} offBackgroundColor={colors.green}
              />
              {mode === 'edit' && <>
                <NekoButton className="primary" disabled={isBusy || !index || !indexIsReady}
                  onClick={() => setEmbeddingModal(DEFAULT_VECTOR)} >
                  Add
                </NekoButton>
              </>}
            </div>
          </NekoContainer>

          <NekoContainer style={{ margin: 10, flex: 'auto' }} contentStyle={{ padding: 10, display: 'flex' }}>
            {mode === 'edit' && <>

              {/* Actions for Selected Items */}
              {selectedIds.length > 0 && <>
                <NekoButton className="primary" disabled={isBusy || !index} isBusy={busy === 'bulkRun'}
                  onClick={() => onBulkRunClick(false)}>
                  Sync Selected
                </NekoButton>
                <NekoButton className="danger" disabled={isBusy || !index || !indexIsReady}
                  onClick={deleteSelected}>
                  {i18n.COMMON.DELETE_SELECTED}
                </NekoButton>
              </>}

              {/* Selected Items */}
              {selectedIds.length > 0 && <div style={{ display: 'flex',
                alignItems: 'center', marginLeft: 10, marginRight: 10 }}>
                {selectedIds.length} selected
              </div>}

              {/* Progress Bar */}
              <NekoProgress busy={bulkTasks.busy} style={{ flex: 'auto' }}
                value={bulkTasks.value} max={bulkTasks.max} onStopClick={bulkTasks.stop} />
            </>}
            {mode === 'search' && <div style={{ flex: 'auto', display: 'flex' }}>
              <NekoInput style={{ flex: 'auto', marginRight: 5 }} placeholder="Search"
                disabled={isBusy || !index || !indexIsReady}
                value={search} onChange={setSearch} onEnter={onSearch}
                onReset={() => { setSearch(); setFoundVectorsData({ total: 0, vectors: [] }); }} />
              <NekoButton className="primary" onClick={onSearch} disabled={isBusy || !index || !indexIsReady}
                isBusy={busy === 'searchVectors'}>
                Search
              </NekoButton>
            </div>}
          </NekoContainer>
        </div>

      </NekoColumn>

      <NekoColumn minimal style={{ flex: 3, marginRight: 10 }}>
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
            onSelectRow={id => { setSelectedIds([id]) }}
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
            }}>{i18n.COMMON.REFRESH}</NekoButton>
          </div>

        </NekoBlock>
      </NekoColumn>

      <NekoColumn minimal>

        <NekoSpacer large />

        <NekoTabs inversed style={{ marginRight: 10 }}>
          <NekoTab title="Index">
            <div style={{ display: 'flex' }}>
              <NekoSelect fullWidth scrolldown name="server"
                style={{ marginRight: 5, flex: 1.5 }} disabled={isBusy}
                value={pinecone.index} onChange={value => onSelectIndex(value)}>
                {indexes.map(x => <NekoOption key={x.name} value={x.name} label={x.name} />)}
                {!indexes?.length && <NekoOption value={''} label="None" />}
              </NekoSelect>
              <NekoInput style={{ flex: 1 }} disabled={true} value={pinecone.namespace}
                title={i18n.COMMON.NAMESPACE} />
            </div>
            {index && !indexIsReady && <NekoMessage variant="danger" style={{ marginTop: 15, padding: '8px 12px' }}>
              This index is currently being build by Pinecone. Wait a few minutes, then use the <b>Refresh</b> button.
            </NekoMessage>}
          </NekoTab>
          <NekoTab title="Settings">
            <NekoSelect fullWidth scrolldown name="server"
              style={{ marginRight: 5, flex: 1.5 }} disabled={isBusy}
              value={pinecone.index} onChange={value => onSelectIndex(value)}>
              {indexes.map(x => <NekoOption key={x.name} value={x.name} label={x.name} />)}
              {!indexes?.length && <NekoOption value={''} label="None" />}
            </NekoSelect>
            <NekoSpacer />
            <div style={{ display: 'flex' }}>
              <NekoButton className="primary" onClick={() => setIndexModal(DEFAULT_INDEX)} style={{ flex: 1 }}
                isBusy={busy === 'addIndex'} disabled={isBusy}>
                Add Index
              </NekoButton>
              <NekoButton className="secondary" onClick={onRefreshIndexes} style={{ flex: 1 }}
                isBusy={busy === 'refreshIndexes'} disabled={isBusy}>
                {i18n.COMMON.REFRESH}
              </NekoButton>
              <NekoButton className="danger" onClick={onDeleteIndex} style={{ flex: 1 }}
                isBusy={busy === 'deleteEmbeddings'} disabled={isBusy || !index || !indexIsReady}>
                {i18n.COMMON.DELETE}
              </NekoButton>
            </div>
            <NekoSpacer />
            {index && !indexIsReady && <NekoMessage variant="danger" style={{ marginTop: 15, padding: '8px 12px' }}>
              This index is currently being build by Pinecone. Wait a few minutes, then use the <b>Refresh</b> button.
            </NekoMessage>}
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1, marginRight: 5 }}>
                <label>Minimum Score:</label>
                <NekoSpacer />
                <NekoInput value={minScore} type="number" min={0} max={98} step={0.50}
                  onBlur={value => { 
                    setEmbeddingsSettings({ ...embeddingsSettings, minScore: value });
                  }}
                />
              </div>
              <div style={{ flex: 1, marginLeft: 5 }}>
                <label>Max Embedding(s):</label>
                <NekoSpacer />
                <NekoInput value={maxSelect} type="number" min={1} max={20} step={1}
                  onBlur={value => { 
                    setEmbeddingsSettings({ ...embeddingsSettings, maxSelect: value });
                  }}
                />
              </div>
            </div>
            <p>The {maxSelect} best embedding(s) with a minimum score of {minScore} will be used to build the reply.</p>
          </NekoTab>
        </NekoTabs>

        <NekoSpacer medium />

        <NekoTabs inversed style={{ marginRight: 10 }}>
          <NekoTab title="Sync" inversed>
            <NekoCheckbox label="Rewrite Content" checked={embeddingsSettings.rewriteContent}
              disabled={busy}
              onChange={value => { setEmbeddingsSettings({ ...embeddingsSettings, rewriteContent: value }); }}
              description={`Shorten and improve the content for your embedding with GPT Turbo.
              `}
            />

            <NekoSpacer />

            {embeddingsSettings.rewriteContent && 
              <NekoTextArea value={embeddingsSettings.rewritePrompt} rows={5}
                disabled={busy}
                onBlur={value => { setEmbeddingsSettings({ ...embeddingsSettings, rewritePrompt: value }); }}
                description={`Prompt used for rewriting. Supports {CONTENT}, {TITLE}, {URL}, {EXCERPT}, {LANGUAGE} and {ID}.`}
            />}
            <NekoSpacer />
            <NekoCheckbox label="Force Recreate" checked={embeddingsSettings.forceRecreate}
              disabled={busy}
              onChange={value => { setEmbeddingsSettings({ ...embeddingsSettings, forceRecreate: value }); }}
              description={`Recreate embeddings when "Sync All" is used, even if they already exist with the same content.`}
            />

            <NekoSpacer medium line={true} />

            <div style={{ display: 'flex', alignItems: 'center' }}>

              {/* Total Posts + Post Type Select */}
              <NekoSelect id="postType" scrolldown={true} disabled={isBusy} name="postType" 
                style={{ width: 100 }} onChange={setPostType} value={postType}>
                {postTypes?.map(postType => 
                  <NekoOption key={postType.type} value={postType.type} label={postType.name} />
                )}
              </NekoSelect>

              {/* Actions for All Posts */}
              <NekoButton fullWidth className="primary" style={{ marginLeft: 10 }}
                disabled={isBusy || !index} isBusy={busy === 'bulkRun'}
                onClick={() => onBulkRunClick(true)}>
                Sync All {!isLoadingCount && <>({`${postsCount}`})</>}
              </NekoButton>
            </div>

            <NekoSpacer />

            <NekoButton fullWidth className="primary" disabled={isBusy || !index} isBusy={busy === 'singleRun'}
              onClick={OnSingleRunClick}>
              Sync One
            </NekoButton>

          </NekoTab>
          <NekoTab title="Settings" inversed>
            <NekoCheckbox label="Sync Posts" checked={embeddingsSettings.syncPosts}
              disabled={busy}
              onChange={value => { setEmbeddingsSettings({ ...embeddingsSettings, syncPosts: value }); }}
              description={`When publishing a post, an embedding will be created for it. The embedding will be removed when the post is deleted.`}
            />
            <NekoSpacer />
            <NekoInput name="syncPostTypes" value={embeddingsSettings.syncPostTypes }
              isCommaSeparatedArray={true}
              description={i18n.HELP.POST_TYPES}
              onBlur={value => { 
                setEmbeddingsSettings({ ...embeddingsSettings, syncPostTypes: value });
              }}
            />
            <NekoSpacer />
            <NekoInput name="syncPostStatus" value={embeddingsSettings.syncPostStatus || "publish"}
              isCommaSeparatedArray={true}
              description={i18n.HELP.POST_STATUS}
              onBlur={value => { 
                setEmbeddingsSettings({ ...embeddingsSettings, syncPostStatus: value });
              }}
            />
          </NekoTab>
        </NekoTabs>

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
              The chatbot can use the embeddings to reply questions. To activate this feature, you will need to add  <i>embeddings_index</i> to the chatbot. Check the builder! 😌
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
      onRequestClose={() => setEmbeddingModal(null)}
      onCancelClick={() => setEmbeddingModal(null)}
      ok={embeddingModal?.id ? "Modify" : "Add"}
      disabled={busy === 'addEmbedding'}
      content={<>
        <p>
          A custom embedding can be a sentence, a paragraph or a whole article. When an user input is made, the AI will search for the best embedding that matches the user input and will be able to reply with more accuracy.
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
          <NekoOption value="reply" label="Reply" />
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

    {bulkTasks.TasksErrorModal}

  </>);
}

export default Embeddings;