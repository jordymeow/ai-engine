// Previous: 1.8.6
// Current: 1.8.7

const { useState, useMemo, useEffect, useRef } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Papa from 'papaparse';

import { NekoButton, NekoSelect, NekoOption, NekoProgress, NekoModal, NekoTextArea, NekoInput,
  NekoTable, NekoPaging, NekoMessage, NekoSpacer, NekoSwitch, NekoBlock, NekoCheckbox, NekoUploadDropArea,
  NekoTabs, NekoTab, NekoWrapper, NekoColumn, NekoContainer, NekoIcon } from '@neko-ui';
import { nekoFetch, useNekoTasks, useNekoColors } from '@neko-ui';

import i18n from '@root/i18n';
import { apiUrl, restNonce, session } from '@app/settings';
import { retrieveVectors, retrievePostsCount, retrievePostContent,
  DEFAULT_INDEX, DEFAULT_VECTOR, reduceContent, estimateTokens, toHTML } from '@app/helpers-admin';
import { retrievePostTypes } from '@app/requests';
import AddModifyModal from './AddModifyModal';
import ExportModal from './ExportModal';
import ImportModal from './ImportModal';

const searchColumns = [
  { accessor: 'status', title: 'Status', width: '80px' },
  { accessor: 'title', title: 'Title', sortable: false },
  { accessor: 'type', title: 'Ref', sortable: false, width: '60px' },
  { accessor: 'score', title: 'Score', sortable: true, width: '65px' },
  { accessor: 'updated', title: 'Updated', sortable: false, width: '80px' },
  { accessor: 'actions', title: '', width: '100px'  }
];

const queryColumns = [
  { accessor: 'status', title: 'Status', sortable: true, width: '80px' },
  { accessor: 'title', title: 'Title', sortable: false },
  { accessor: 'type', title: 'Ref', sortable: true, width: '60px' },
  { accessor: 'updated', title: 'Updated', sortable: true, width: '80px' },
  { accessor: 'actions', title: '', width: '100px'  }
];

const StatusIcon = ({ status, includeText = false }) => {
  const { colors } = useNekoColors();

  let icon = null;
  switch (status) {
    case 'outdated':
      icon = <NekoIcon title={status} icon="alert" width={24} color={colors.orange} />;
      break;
    case 'ok':
      icon = <NekoIcon title={status} icon="check-circle" width={24} color={colors.green} />;
      break;
    default:
      icon = <NekoIcon title={status} icon="alert" width={24} color={colors.orange} />;
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

const setLocalNamespace = (namespace) => {
  if (namespace) {
    localStorage.setItem('mwai-admin-namespace', namespace);
    return;
  }
  localStorage.removeItem('mwai-admin-namespace');
};

const getLocalNamespace = (namespaces) => {
  const localState = localStorage.getItem('mwai-admin-namespace');
  return localState ?? namespaces[0];
};

const Embeddings = ({ options, updateOption }) => {
  const queryClient = useQueryClient();
  const { colors } = useNekoColors();
  const [ postType, setPostType ] = useState('post');
  const [ busy, setBusy ] = useState(false);
  const [ mode, setMode ] = useState('edit');
  const [ search, setSearch ] = useState(null);
  const [ embeddingModal, setEmbeddingModal ] = useState(false);
  const [ indexModal, setIndexModal ] = useState(false);
  const [ selectedIds, setSelectedIds ] = useState([]);
  const [ modal, setModal ] = useState({ type: null, data: null });
  const embeddingsSettings = options.embeddings || {};
  const pinecone = options.pinecone || {};
  const indexes = pinecone.indexes || [];
  const namespaces = pinecone.namespaces || [];
  const minScore = embeddingsSettings?.minScore > 0 ? embeddingsSettings.minScore : 75;
  const maxSelect = embeddingsSettings?.maxSelect > 0 ? embeddingsSettings.maxSelect : 1;
  const [ namespace, setNamespace ] = useState(getLocalNamespace(namespaces));
  const ref = useRef(null);

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
    queryKey: ['postsCount-' + postType + '-' + (embeddingsSettings?.syncPostStatus ?? 'publish')],
    queryFn: () => retrievePostsCount(postType, embeddingsSettings?.syncPostStatus ?? 'publish'),
  });

  const [ queryParams, setQueryParams ] = useState({
    filters: { dbIndex: index, dbNS: namespace, search },
    sort: { accessor: 'created', by: 'desc' }, page: 1, limit: 20
  });
  const { isFetching: isBusyQuerying, data: vectorsData } = useQuery({
    queryKey: ['vectors', queryParams], queryFn: () => retrieveVectors(queryParams),
    keepPreviousData: true
  });
  const busyFetchingVectors = isBusyQuerying || busy === 'searchVectors';
  const columns = mode === 'search' ? searchColumns : queryColumns;
  const bulkTasks = useNekoTasks({ i18n, onStop: () => { setBusy(false); bulkTasks.reset(); } });
  const isBusy = busy || busyFetchingVectors || bulkTasks.isBusy || isLoadingPostTypes;

  const setEmbeddingsSettings = async (freshEmbeddingsSettings) => {
    setBusy('updateSettings');
    await updateOption({ ...freshEmbeddingsSettings }, 'embeddings');
    setBusy(null);
  }

  useEffect(() => {
    setQueryParams({ ...queryParams, filters: { dbIndex: index ?? '', dbNS: namespace ?? '', search } });
    setLocalNamespace(namespace);
  }, [index, namespace, search]);

  useEffect(() => {
    if (!indexes.length) {
      onSelectIndex('');
    }
    else if (!index) {
      onSelectIndex(indexes[0].name);
    }
  }, [indexes, index]);

  useEffect(() => {
    const freshSearch = mode === 'edit' ? null : "";
    setSearch(mode === 'edit' ? null : "");
    setQueryParams({ ...queryParams,
      filters: { ...queryParams.filters, search: freshSearch },
      sort: { accessor: (mode === 'edit' ? 'created' : 'score'), by: 'desc' }, page: 1, limit: 20
    });
  }, [mode]);

  useEffect(() => {
    if (!embeddingsSettings?.syncPostTypes?.length || !embeddingsSettings?.syncPostStatus?.length) {
      setEmbeddingsSettings({ ...embeddingsSettings, 
        syncPostTypes: ['post', 'page', 'product'],
        syncPostStatus: ['publish']
      });
    }
  }, [embeddingsSettings.syncPostTypes, embeddingsSettings.syncPostStatus]);

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
    await updateOption(freshPinecone, 'pinecone');
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

  const onSearchEnter = async () => {
    if (search === queryParams.filters.search) {
      queryClient.invalidateQueries({ queryKey: ['vectors'] });
      return;
    }
    setQueryParams({ ...queryParams, filters: { ...queryParams.filters, search } });
  }

  const onResetSearch = async () => {
    setSearch("");
    setQueryParams({ ...queryParams, filters: { ...queryParams.filters, search: "" } });
  }

  const onAddEmbedding = async (inEmbedding = embeddingModal, skipBusy = false, signal = null) => {
    if (!skipBusy) {
      setBusy('addEmbedding');
    }
    try {
      let vector = { ...inEmbedding };
      if (!vector.dbIndex) {
        vector.dbIndex = index;
      }
      if (!vector.dbNS) {
        vector.dbNS = namespace;
      }
      await nekoFetch(`${apiUrl}/vectors/add`, { nonce: restNonce, method: 'POST', json: { vector } });
      setEmbeddingModal(false);
      console.log("Embedding Added", inEmbedding);
      queryClient.invalidateQueries({ queryKey: ['vectors'] });
    }
    catch (err) {
      console.error(err);
      throw new Error(err.message ?? "Unknown error, check your console logs.");
    }
    finally {
      if (!skipBusy) {
        setBusy(false);
      }
    }
    return true;
  }

  const onModifyEmbedding = async (inEmbedding = embeddingModal, skipBusy) => {
    if (!skipBusy) {
      setBusy('addEmbedding');
    }
    try {
      let vector = { ...inEmbedding };
      if (!vector.dbIndex) {
        vector.dbIndex = index;
      }
      if (!vector.dbNS) {
        vector.dbNS = namespace;
      }
      await nekoFetch(`${apiUrl}/vectors/update`, { nonce: restNonce, method: 'POST', json: { vector } });
    }
    catch (err) {
      console.error(err);
      throw new Error(err.message ?? "Unknown error, check your console logs.");
    }
    setEmbeddingModal(false);
    console.log("Embeddings updated.", inEmbedding);
    queryClient.invalidateQueries({ queryKey: ['vectors'] });
    if (mode === 'search') {
      let embedding = {...inEmbedding};
      console.error("We should update the vectors data with the updated embeddings.");
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
      const res = await nekoFetch(`${apiUrl}/vectors/ref`, { 
        nonce: restNonce,
        method: 'POST', json: { 
          refId,
          dbIndex: index,
          dbNS: namespace,
        }
      });
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
      console.error("We should update the vectors data with the deleted embeddings.");
    }
    if (!skipBusy) {
      setBusy(false);
    }
  }

  const onSelectFiles = async (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const isJson = file.name.endsWith('.json');
      const isJsonl = file.name.endsWith('.jsonl');
      const isCsv = file.name.endsWith('.csv');
      if (!isJson && !isJsonl && !isCsv) {
        alert(i18n.ALERTS.ONLY_SUPPORTS_FILES);
        console.log(file);
        continue;
      }
      reader.onload = async (e) => {
        const fileContent = e.target.result;
        let data = [];
        if (isJson) {
          data = JSON.parse(fileContent);
        }
        else if (isJsonl) {
          const lines = fileContent.split('\n');
          data = lines.map(x => {
            x = x.trim();
            try {
              return JSON.parse(x);
            }
            catch (e) {
              console.log(e, x);
              return null
            }
          });
        }
        else if (isCsv) {
          const resParse = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
          data = resParse.data;
          console.log('The CSV for Embeddings Import was loaded.', data);
        }
        let formattedData = data;
        const cleanData = formattedData.filter(x => x.title && x.content);
        const hadEmptyLines = formattedData.length !== cleanData.length;
        if (hadEmptyLines) {
          alert(i18n.ALERTS.EMPTY_LINES_EMBEDDINGS);
          const findEmpty = formattedData.find(x => !x.prompt || !x.completion);
          console.log('Empty line: ', findEmpty);
        }
        setModal({ type: 'import', data: cleanData });
      }
      reader.readAsText(file);
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
          temperature: 0.4, maxTokens: 4096, stop: ''
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
    const data = vectorsData;
    if (!data?.vectors) { return []; }

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
          <NekoButton className="primary" rounded icon="pencil" disabled={isBusy}
            onClick={() => setModal({ type: 'edit', data: x })}>
          </NekoButton>
          <NekoButton className="primary" rounded icon="replay" disabled={isBusy || !x.refId || x.status === 'ok'}
            onClick={() => onSynchronizeEmbedding(x.refId)}>
          </NekoButton>
          <NekoButton className="danger" rounded icon="trash" disabled={isBusy}
            onClick={() => onDeleteEmbedding([x.id])}>
          </NekoButton>
        </>
      }
    })
  }, [mode, vectorsData, isBusy]);

  const cancelledByUser = () => {
    console.log('User aborted.');
    setBusy(false);
    bulkTasks.reset();
  }

  const onSynchronizeEmbedding = async (postId) => {
    setBusy('syncEmbedding')
    await runProcess(0, postId);
    setBusy(false);
  }

  const runProcess = async (offset = 0, postId = undefined, signal = undefined) => {
    const resContent = await retrievePostContent(postType, offset,
      postId ? postId : undefined, embeddingsSettings.syncPostStatus);
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
      const postIds = vectorsData?.vectors.filter(x => selectedIds.includes(x.id))
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
                  onClick={() => setModal({ type: 'add', data: DEFAULT_VECTOR })}>
                  Add
                </NekoButton>
                <NekoUploadDropArea ref={ref} onSelectFiles={onSelectFiles} accept={''} style={{ paddingLeft: 5 }}>
                  <NekoButton className="secondary" onClick={() => ref.current.click() }>
                    Import
                  </NekoButton>
                </NekoUploadDropArea>
              </>}
            </div>
          </NekoContainer>

          <NekoContainer style={{ margin: 10, flex: 'auto' }} contentStyle={{ padding: 10, display: 'flex' }}>
            {mode === 'edit' && <>
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
              {selectedIds.length > 0 && <div style={{ display: 'flex',
                alignItems: 'center', marginLeft: 10, marginRight: 10 }}>
                {selectedIds.length} selected
              </div>}
              <NekoProgress busy={bulkTasks.busy} style={{ flex: 'auto' }}
                value={bulkTasks.value} max={bulkTasks.max} onStopClick={bulkTasks.stop} />
            </>}
            {mode === 'search' && <div style={{ flex: 'auto', display: 'flex' }}>
              <NekoInput style={{ flex: 'auto', marginRight: 5 }} placeholder="Search"
                disabled={isBusy || !index || !indexIsReady}
                value={search} onChange={setSearch} onEnter={onSearchEnter}
                onReset={onResetSearch} />
              <NekoButton className="primary" onClick={onSearchEnter}
                disabled={isBusy || !index || !indexIsReady || !search}
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
            sort={queryParams.sort}
            onSortChange={(accessor, by) => {
              setQueryParams({ ...queryParams, sort: { accessor, by } });
            }}
            data={vectorsRows} columns={columns} 
            onSelectRow={id => { setSelectedIds([id]) }}
            onSelect={ids => { setSelectedIds([ ...new Set([ ...selectedIds, ...ids ]) ]) }}
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
            <NekoButton className="primary" style={{ marginLeft: 5 }}
              onClick={() => { setModal({ type: 'export', data: null }) }}>
              {i18n.COMMON.EXPORT}
            </NekoButton>
          </div>
        </NekoBlock>
      </NekoColumn>

      <NekoColumn minimal>

        <NekoSpacer large />

        <NekoTabs inversed style={{ marginRight: 10 }}>
          <NekoTab title="Index">
            <div style={{ display: 'flex' }}>

              <NekoSelect fullWidth scrolldown name="server"
                description={i18n.COMMON.EMBEDDINGS_INDEX}
                style={{ marginRight: 5, flex: 1.5 }} disabled={isBusy}
                value={pinecone.index} onChange={value => onSelectIndex(value)}>
                {indexes.map(x => <NekoOption key={x.name} value={x.name} label={x.name} />)}
                {!indexes?.length && <NekoOption value={''} label="None" />}
              </NekoSelect>

              <NekoSelect fullWidth scrolldown name="namespace"
                description={i18n.COMMON.NAMESPACE}
                style={{ flex: 1 }} disabled={isBusy}
                value={namespace} onChange={value => setNamespace(value)}>
                {namespaces.map(x => <NekoOption key={x} value={x} label={x} />)}
                {!namespaces?.length && <NekoOption value={null} label="None" />}
              </NekoSelect>

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
                {i18n.EMBEDDINGS.ADD_INDEX}
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

        <NekoSpacer />

        <NekoTabs inversed style={{ marginRight: 10 }}>
          <NekoTab title="Sync" inversed>
            <NekoCheckbox label={i18n.EMBEDDINGS.REWRITE_CONTENT} checked={embeddingsSettings.rewriteContent} disabled={busy}
              onChange={value => { setEmbeddingsSettings({ ...embeddingsSettings, rewriteContent: value }); }}
              description={i18n.EMBEDDINGS.REWRITE_CONTENT_DESCRIPTION}
            />

            <NekoSpacer />

            {embeddingsSettings.rewriteContent && 
              <NekoTextArea value={embeddingsSettings.rewritePrompt} rows={5}
                disabled={busy}
                onBlur={value => { setEmbeddingsSettings({ ...embeddingsSettings, rewritePrompt: value }); }}
                description={i18n.EMBEDDINGS.REWRITE_PROMPT_DESCRIPTION}
            />}
            <NekoSpacer />
            <NekoCheckbox label={i18n.EMBEDDINGS.FORCE_RECREATE} checked={embeddingsSettings.forceRecreate}
              disabled={busy}
              onChange={value => { setEmbeddingsSettings({ ...embeddingsSettings, forceRecreate: value }); }}
              description={i18n.EMBEDDINGS.FORCE_RECREATE_DESCRIPTION}
            />

            <NekoSpacer medium line={true} />

            <div style={{ display: 'flex', alignItems: 'center' }}>

              <NekoSelect id="postType" scrolldown={true} disabled={isBusy} name="postType" 
                style={{ width: 100 }} onChange={setPostType} value={postType}>
                {postTypes?.map(postType => 
                  <NekoOption key={postType.type} value={postType.type} label={postType.name} />
                )}
              </NekoSelect>

              <NekoButton fullWidth className="primary" style={{ marginLeft: 10 }}
                disabled={isBusy || !index} isBusy={busy === 'bulkRun'}
                onClick={() => onBulkRunClick(true)}>
                {i18n.EMBEDDINGS.SYNC_ALL} {!isLoadingCount && <>({`${postsCount}`})</>}
              </NekoButton>
            </div>

            <NekoSpacer />

            <NekoButton fullWidth className="primary" disabled={isBusy || !index} isBusy={busy === 'singleRun'}
              onClick={OnSingleRunClick}>
              {i18n.EMBEDDINGS.SYNC_ONE}
            </NekoButton>

          </NekoTab>
          <NekoTab title="Settings" inversed>
            {toHTML(i18n.EMBEDDINGS.SYNC_SETTINGS_INTRO)}

            <NekoSpacer />

            <NekoCheckbox label={i18n.EMBEDDINGS.SYNC_POSTS} checked={embeddingsSettings.syncPosts}
              disabled={busy}
              onChange={value => { setEmbeddingsSettings({ ...embeddingsSettings, syncPosts: value }); }}
              description={<>{i18n.COMMON.NAMESPACE}: <b>{namespaces[0]}</b></>}
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

    {/* Modals */}
    <AddModifyModal modal={modal} setModal={setModal} busy={busy}
      onAddEmbedding={onAddEmbedding} onModifyEmbedding={onModifyEmbedding} />

    <ExportModal modal={modal} setModal={setModal} busy={busy} />

    <ImportModal modal={modal} setModal={setModal} busy={busy}
      onAddEmbedding={onAddEmbedding} onModifyEmbedding={onModifyEmbedding} 
    />

    <NekoModal isOpen={indexModal}
      title={i18n.EMBEDDINGS.ADD_INDEX}
      onOkClick={onAddIndex}
      onRequestClose={() => setIndexModal(false)}
      onCancelClick={() => setIndexModal(false)}
      ok={i18n.EMBEDDINGS.ADD_INDEX}
      disabled={busy === 'addIndex'}
      content={<>
        <p>{i18n.EMBEDDINGS.ADD_INDEX_DESCRIPTION}</p>
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