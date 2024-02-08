// Previous: 2.1.7
// Current: 2.1.8

const { useState, useMemo, useEffect, useRef } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Papa from 'papaparse';

import { NekoButton, NekoSelect, NekoOption, NekoProgress, NekoModal, NekoTextArea, NekoInput, NekoToolbar,
  NekoTable, NekoPaging, NekoMessage, NekoSpacer, NekoSwitch, NekoBlock, NekoCheckbox, NekoUploadDropArea,
  NekoTabs, NekoTab, NekoWrapper, NekoColumn, NekoContainer, NekoIcon } from '@neko-ui';
import { nekoFetch, useNekoTasks, useNekoColors } from '@neko-ui';

import i18n from '@root/i18n';
import { apiUrl, restNonce, session } from '@app/settings';

import { retrieveVectors, retrieveRemoteVectors, retrievePostsCount, retrievePostContent, addFromRemote,
  DEFAULT_INDEX, DEFAULT_VECTOR, reduceContent, estimateTokens, useModels } from '@app/helpers-admin';

import { retrievePostTypes } from '@app/requests';

import AddModifyModal from './AddModifyModal';
import ExportModal from './ExportModal';
import ImportModal from './ImportModal';

const searchColumns = [
  { accessor: 'status', title: 'Status', width: '80px' },
  { accessor: 'title', title: 'Title / Model', sortable: false },
  { accessor: 'type', title: 'Ref', sortable: false, width: '60px' },
  { accessor: 'score', title: 'Score', sortable: true, width: '65px' },
  { accessor: 'updated', title: 'Updated', sortable: false, width: '80px' },
  { accessor: 'actions', title: '', width: '100px'  }
];

const queryColumns = [
  { accessor: 'status', title: 'Status', sortable: true, width: '80px' },
  { accessor: 'title', title: 'Title / Model', sortable: false },
  { accessor: 'type', title: 'Ref', sortable: true, width: '60px' },
  { accessor: 'updated', title: 'Updated', sortable: true, width: '80px' },
  { accessor: 'actions', title: '', width: '100px'  }
];

const StatusIcon = ({ id, status, includeText = false, title = null }) => {
  const { colors } = useNekoColors();

  let icon = null;
  switch (status) {
  case 'outdated':
    icon = <NekoIcon title={title || status} icon="alert" width={24} color={colors.orange} />;
    break;
  case 'ok':
    icon = <NekoIcon title={id || status} icon="check-circle" width={24} color={colors.green} />;
    break;
  case 'error':
    icon = <NekoIcon title={title || status} icon="alert" width={24} color={colors.red} />;
    break;
  default:
    icon = <NekoIcon title={title || status} icon="alert" width={24} color={colors.orange} />;
    break;
  }
  if (includeText) {
    return <div style={{ display: 'flex', alignItems: 'center' }} title={title || status}>
      {icon} 
      <span style={{ textTransform: 'uppercase', fontSize: 9, marginLeft: 3 }}>{status}</span>
    </div>;
  }
  return icon;
};

const setLocalSettings = ({ environmentId, index, namespace }) => {
  const settings = {
    environmentId: environmentId || null,
    index: index || null,
    namespace: namespace || null,
  };
  localStorage.setItem('mwai-admin-embeddings', JSON.stringify(settings));
};

const getLocalSettings = () => {
  const localSettingsJSON = localStorage.getItem('mwai-admin-embeddings');
  try {
    return JSON.parse(localSettingsJSON);
  }
  catch (e) {
    return {};
  }
};

const Embeddings = ({ options, updateEnvironment, updateOption }) => {
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
  const minScore = embeddingsSettings?.minScore > 0 ? embeddingsSettings.minScore : 35;
  const maxSelect = embeddingsSettings?.maxSelect > 0 ? embeddingsSettings.maxSelect : 10;

  const ref = useRef(null);
  const models = useModels(options);
  const allModels = useModels(options, false, true);
  const defaultModel = useMemo(() => models.getModel(options.ai_default_model), [options.ai_default_model]);
  const defaultModelName = defaultModel?.model ?? options?.fallback_model ?? null;
  const defaultModelMaxTokens = defaultModel?.maxTokens ?? 2048;

  const environments = options.embeddings_envs || [];
  const [ environmentId, set_environmentId ] = useState(null);
  const [ index, setIndex ] = useState(null);
  const [ namespace, setNamespace ] = useState(null);

  const environment = useMemo(() => {
    return environments.find(e => e.id === environmentId) || null;
  }, [environments, environmentId]);
  const indexes = useMemo(() => environment?.indexes || [], [environment]);
  const namespaces = useMemo(() => environment?.namespaces || [], [environment]);

  useEffect(() => {
    const localSettings = getLocalSettings();
    const defaultEnvironmentId = localSettings?.environmentId ?? null;
    const defaultIndex = localSettings?.index ?? null;
    const defaultNamespace = localSettings?.namespace ?? null;
    set_environmentId(defaultEnvironmentId);
    setIndex(defaultIndex);
    setNamespace(defaultNamespace);
  }, []);

  useEffect(() => {
    setLocalSettings({ environmentId, index, namespace });
  }, [environmentId, index, namespace]);

  const embeddingsModel = useMemo(() => {
    if (environment?.ai_embeddings_override && environment?.ai_embeddings_env &&
      environment?.ai_embeddings_model) {
      return allModels.getModel(environment.ai_embeddings_model);
    }
    return allModels.getModel(options.ai_embeddings_default_model);
  }, [environment, options.ai_embeddings_default_model]);

  const indexIsReady = useMemo(() => {
    const realIndex = indexes.find(i => i?.name === index) || null;
    return !!realIndex?.ready;
  }, [indexes, index]);

  const { isLoading: isLoadingPostTypes, data: postTypes } = useQuery({
    queryKey: ['postTypes'], queryFn: retrievePostTypes
  });
  const { isLoading: isLoadingCount, data: postsCount } = useQuery({
    queryKey: ['postsCount-' + postType + '-' + embeddingsSettings?.syncPostStatus ?? 'publish'],
    queryFn: () => retrievePostsCount(postType, embeddingsSettings?.syncPostStatus ?? 'publish'),
  });

  const [ queryParams, setQueryParams ] = useState({
    filters: { envId: environmentId, dbIndex: index, dbNS: namespace, search },
    sort: { accessor: 'created', by: 'desc' }, page: 1, limit: 20
  });
  const { isFetching: isBusyQuerying, data: vectorsData } = useQuery({
    queryKey: ['vectors', queryParams], queryFn: () => retrieveVectors(queryParams),
    keepPreviousData: true
  });
  const busyFetchingVectors = isBusyQuerying || busy === 'searchVectors';
  const columns = mode === 'search' ? searchColumns : queryColumns;
  const bulkTasks = useNekoTasks({ i18n, onStop: () => { setBusy(); bulkTasks.reset(); } });
  const isBusy = busy || busyFetchingVectors || bulkTasks.isBusy || isLoadingPostTypes;

  const setEmbeddingsSettings = async (freshEmbeddingsSettings) => {
    setBusy('updateSettings');
    await updateOption({ ...freshEmbeddingsSettings }, 'embeddings');
    setBusy(false);
  };

  const isSyncEnvDifferent = useMemo(() => {
    const currentSyncEnv = embeddingsSettings.syncPostsEnv ?? {};
    return currentSyncEnv.envId !== environmentId || currentSyncEnv.dbIndex !== index ||
      currentSyncEnv.dbNS !== namespace;
  }, [embeddingsSettings.syncPostsEnv, environmentId, index, namespace]);

  const syncPostsEnvName = useMemo(() => {
    const currentSyncEnv = embeddingsSettings.syncPostsEnv ?? {};
    const currentEnvironment = environments.find(e => e.id === currentSyncEnv.envId) || null;
    return currentEnvironment?.name ?? null;
  }, [embeddingsSettings.syncPostsEnv, environments]);

  useEffect(() => {
    if ((environment?.server === 'gcp-starter' || !index) && namespace) {
      setNamespace(null);
      return;
    }
    setQueryParams({ ...queryParams,
      filters: { 
        envId: environmentId, 
        dbIndex: index ?? null,
        dbNS: namespace ?? null,
        search
      }
    });
    setLocalSettings({ environmentId, index, namespace });
  }, [index, namespace, environment, search]);

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
  }, [embeddingsSettings?.syncPostTypes, embeddingsSettings?.syncPostStatus]);

  const onAddIndex = async () => {
    setBusy('addIndex');
    try {
      const res = await nekoFetch(`${apiUrl}/indexes/add`, { nonce: restNonce, method: 'POST',
        json: { 
          envId: environment.id,
          name: indexModal.name,
          podType: indexModal.podType
        }
      });
      await updateEnvironment(environment.id, { indexes: res.indexes });
      setIndexModal(false);
    }
    catch (err) {
      console.error(err);
      alert(err.message);
    }
    setBusy(false);
  };

  const onDeleteIndex = async () => {
    if (!confirm(`Are you sure you want to delete the index "${index}"? All the related embeddings will be deleted as well.`)) {
      return;
    }
    setBusy('deleteIndex');
    try {
      const res = await nekoFetch(`${apiUrl}/indexes/delete`, { 
        nonce: restNonce, method: 'POST', json: { 
          envId: environment.id,
          name: index
        }
      });
      await updateEnvironment(environment.id, { index: null, indexes: res.indexes });
    }
    catch (err) {
      console.error(err);
      alert(err.message);
    }
    setBusy(false);
  };

  const onRefreshIndexes = async () => {
    setBusy('refreshIndexes');
    try {
      const res = await nekoFetch(`${apiUrl}/indexes/list`, { nonce: restNonce, method: 'POST', json: {
        envId: environment.id
      } });
      await updateEnvironment(environment.id, { indexes: res.indexes });
    }
    catch (err) {
      console.error(err);
      alert(err.message);
    }
    setBusy(false);
  };

  const onSearchEnter = async () => {
    if (search === queryParams.filters.search) {
      queryClient.invalidateQueries({ queryKey: ['vectors'] });
      return;
    }
    setQueryParams({ ...queryParams, filters: { ...queryParams.filters, search } });
  };

  const onResetSearch = async () => {
    setSearch("");
    setQueryParams({ ...queryParams, filters: { ...queryParams.filters, search: "" } });
  };

  const onAddEmbedding = async (inEmbedding = embeddingModal, skipBusy = false) => {
    if (!skipBusy) {
      setBusy('addEmbedding');
    }
    try {
      const vector = { ...inEmbedding };
      if (!vector.envId) {
        vector.envId = environment.id;
      }
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
  };

  const onModifyEmbedding = async (inEmbedding = embeddingModal, skipBusy) => {
    if (!skipBusy) {
      setBusy('addEmbedding');
    }
    try {
      const vector = { ...inEmbedding };
      if (!vector.envId) {
        vector.envId = environment.id;
      }
      if (!vector.dbIndex) {
        vector.dbIndex = index;
      }
      if (!vector.dbNS) {
        vector.dbNS = namespace;
      }
      vector.envId = environment.id;
      await nekoFetch(`${apiUrl}/vectors/update`, { nonce: restNonce, method: 'POST', json: { vector } });
      setEmbeddingModal(false);
      console.log("Embeddings updated.", inEmbedding);
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
  };

  const onGetEmbeddingsForRef = async (refId, skipBusy = false) => {
    if (!skipBusy) {
      setBusy('getEmbedding');
    }
    try {
      const res = await nekoFetch(`${apiUrl}/vectors/ref`, { 
        nonce: restNonce,
        method: 'POST', json: { 
          refId,
          dbId: environment.id,
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
  };

  const onDeleteEmbedding = async (ids, skipBusy) => {
    if (!skipBusy) {
      setBusy('deleteEmbedding');
    }
    try {
      await nekoFetch(`${apiUrl}/vectors/delete`, { nonce: restNonce, method: 'POST',
        json: { 
          envId: environment.id,
          index: index,
          ids
        }
      });
    }
    catch (err) {
      console.error(err);
      if (!confirm(`Got an error from the vector database:\n\n${err.message}\n\nDo you want to force the deletion locally?`)) {
        throw new Error(err.message ?? "Unknown error, check your console logs.");
      }
      await nekoFetch(`${apiUrl}/vectors/delete`, { nonce: restNonce, method: 'POST',
        json: {
          envId: environment.id,
          index: index,
          ids,
          force: true
        }
      });
    }
    finally {
      if (!skipBusy) {
        setBusy(false);
      }
    }

    console.log("Embeddings deleted.", { ids });

    queryClient.invalidateQueries({ queryKey: ['vectors'] });
    if (mode === 'search') {
      console.error("We should update the vectors data with the deleted embeddings.");
    }
  };

  const onSelectFiles = async (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const isJson = file.name.endsWith('.json');
      const isJsonl = file.name.endsWith('.jsonl');
      const isCsv = file.name.endsWith('.csv');
      if (!isJson && !isJsonl && !isCsv) {
        alert(i18n.ALERTS.ONLY_SUPPORTS_FILES);
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
              console.error(e);
              return null;
            }
            
          });
        }
        else if (isCsv) {
          const resParse = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
          data = resParse.data;
          console.log('The CSV for Embeddings Import was loaded.', data);
        }
        const formattedData = data;
        const cleanData = formattedData.filter(x => x.title && x.content);
        const hadEmptyLines = formattedData.length !== cleanData.length;
        if (hadEmptyLines) {
          alert(i18n.ALERTS.EMPTY_LINES_EMBEDDINGS);
          const findEmpty = formattedData.find(x => !x.prompt || !x.completion);
          console.warn('Empty line: ', findEmpty);
        }
        setModal({ type: 'import',
          data: {
            importVectors: cleanData,
            envId: environmentId,
            dbIndex: index,
            dbNS: namespace
          }
        });
      };
      reader.readAsText(file);
    }
  };

  const deleteSelected = async () => {
    if (!confirm(`Are you sure you want to delete the selected embeddings?`)) {
      return;
    }
    setBusy('deleteEmbeddings');
    await onDeleteEmbedding(selectedIds);
    setSelectedIds([]);
    setBusy(false);
  };

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
        json: { 
          env: 'admin-tools',
          session,
          prompt: prompt,
          temperature: 0.4,
          model: defaultModelName
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
  };

  const vectorsTotal = useMemo(() => {
    return vectorsData?.total || 0;
  }, [vectorsData]);

  const vectorsRows = useMemo(() => {
    const data = vectorsData;
    if (!data?.vectors) { return []; }

    return data?.vectors.map(x => {
      let updated = new Date(x.updated);
      updated = new Date(updated.getTime() - updated.getTimezoneOffset() * 60 * 1000);
      const updatedFormattedTime = updated.toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      let created = new Date(x.created);
      created = new Date(created.getTime() - created.getTimezoneOffset() * 60 * 1000);
      const createdFormattedTime = created.toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      const score = x.score ? 
        <span style={{ color: (x.score > minScore / 100) ? 'var(--neko-green)' : 'inherit' }}>
          {(x.score.toFixed(4) * 100).toFixed(2)}
        </span> : '-';

      let subType = null;
      if (x.subType && typeof x.subType === 'string') {
        subType = x.subType.toUpperCase();
      }

      const modelName = allModels.getModel(x.model)?.name ?? x.model;

      return {
        id: x.id,
        type: <small>
          {x.refId ? <>ID <a href={`/wp-admin/post.php?post=${x.refId}&action=edit`} target="_blank" rel="noreferrer">#{x.refId}</a><br /><div style={{ fontSize: '80%', marginTop: -5 }}>{subType}</div></> : 'MANUAL'}</small>,
        score: score,
        title: <>
          <span>{x.title}</span><br />
          <small style={{ color: x.model === embeddingsModel?.model ? colors.black : colors.red }}>
            {modelName}
            {x.envId !== environmentId && <>
              <span style={{ color: 'red' }}> (Wrong EnvID: {x.envId})</span>
            </>}
          </small>
        </>,
        status: <StatusIcon id={x.id} status={x.status} title={x.error || null} includeText />,
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
      };
    });
  }, [mode, vectorsData, isBusy, environmentId, colors, allModels, embeddingsModel]);

  const cancelledByUser = () => {
    console.log('User aborted.');
    setBusy(false);
    bulkTasks.reset();
  };

  const onSynchronizeEmbedding = async (postId) => {
    setBusy('syncEmbedding');
    await runProcess(0, postId);
    setBusy(false);
  };

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

    const estimatedTokens = estimateTokens(content);
    if (estimatedTokens > defaultModelMaxTokens || estimatedTokens > 8191) {
      content = reduceContent(content, defaultModelMaxTokens);
      console.warn(`Too much content. Reduced to ${defaultModelMaxTokens} tokens.`, { 
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
        console.warn("Content is too short. Skipped.", { content });
      }
      return false;
    }
    else if (embeddings.length > 1) {
      alert(`Multiple embeddings for one single post are not handled yet. Please delete related embeddings for ${postId}.`);
      return false;
    }
    else if (embeddings.length === 1) {
      const embedding = embeddings[0];
      if (embedding.refChecksum === checksum && !embeddingsSettings.forceRecreate) {
        console.log(`Embedding exists with same content.`);
      }
      else {
        if (embedding.refChecksum === checksum) {
          console.log(`Embedding exists with same content (force recreate).`);
        }
        else {
          console.log(`Embedding exists with different content.`, { 
            current: embedding.content,
            new: content
          });
        }
        const post = { postId, content, title, url, excerpt, checksum, language };
        const embeddingContent = await rewriteContent(post, language, signal);
        if (!embeddingContent || embeddingContent.length < 64) {
          await onDeleteEmbedding(embeddings.map(x => x.id), true, signal);
          console.warn("Embeddings are too short. Deleted.", { content });
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
      const embeddingContent = await rewriteContent(post, language, signal);
      if (!embeddingContent || embeddingContent.length < 64) {
        await onDeleteEmbedding(embeddings.map(x => x.id), true, signal);
        console.warn("Embeddings are too short. Skipped.", { content });
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
  };

  const onBulkPullClick = async () => {
    setBusy('bulkPullAll');
    const params = { page: 1, limit: 10000,
      filters: { 
        envId: environmentId,
        dbIndex: index,
        dbNS: namespace,
      }
    };
    let remoteVectors = [];
    let vectors = [];
    let finished = false;
    
    while (!finished) {
      const res = await retrieveRemoteVectors(params);
      if (res.vectors.length < params.limit) { 
        finished = true;
      }
      remoteVectors = remoteVectors.concat(res.vectors);
      params.page++;
    }
    console.log("Remote vectors retrieved.", { remoteVectors });

    finished = false;
    params.limit = 20;
    params.page = 0;
    while (!finished) {
      const res = await retrieveVectors(params);
      if (res.vectors.length < params.limit) {
        finished = true;
      }
      vectors = vectors.concat(res.vectors);
      params.page++;
    }
    vectors = vectors.map(x => x.dbId);

    console.log("Local vectors retrieved.", { vectors });

    const vectorsToPull = remoteVectors.filter(x => !vectors.includes(x.dbId));

    console.log("Vectors to pull from Vector DB.", { vectorsToPull });
   
    if (!vectorsToPull.length) {
      setBusy(false);
      alert(`${remoteVectors.length} vectors already synchronized.`);
      return;
    }

    const tasks = vectorsToPull.map(dbId => async (signal) => {
      await addFromRemote({ envId: environmentId, dbIndex: index, dbNS: namespace, dbId: dbId }, signal);
      await queryClient.invalidateQueries({ queryKey: ['vectors'] });
      return { success: true };
    });
    await bulkTasks.start(tasks);

    setBusy(false);
    alert("Done. Check console logs.");
    bulkTasks.reset();
  };

  const onBulkPushClick = async (all = false) => {
    setBusy('bulkPushAll');
    let tasks = [];
    if (all || selectedIds.length === 0) {
      const offsets = Array.from(Array(postsCount).keys());
      tasks = offsets.map(offset => async (signal) => {
        await runProcess(offset, null, signal);
        return { success: true };
      });
    }
    else {
      const postIds = vectorsData?.vectors.filter(x => selectedIds.includes(x.id));
      tasks = postIds.map(vector => async (signal) => {
        if (vector.type === 'postId') {
          await runProcess(0, vector.refId, signal);
        }
        else if (vector.type === 'manual') {
          await onModifyEmbedding(vector, signal);
        }
        return { success: true };
      });
    }
    await bulkTasks.start(tasks);
    setBusy(false);
    alert("Done. Check console logs.");
    bulkTasks.reset();
  };

  const OnSingleRunClick = async () => {
    const postId = prompt("Enter Post ID:");
    if (!postId) return;
    setBusy('singleRun');
    try {
      await runProcess(0, postId);
    }
    catch (error) {
      console.error(error);
      alert(error?.message ?? error);
    }
    setBusy(false);
  };

  const jsxEnvIndexNS = useMemo(() => <>
    <div style={{ display: 'flex' }}>
      <NekoSelect scrolldown name="environment"
        style={{ flex: 1, marginBottom: 5 }} disabled={isBusy}
        value={environment?.id ?? null} onChange={value => { 
          set_environmentId(value);
          setIndex(null);
          setNamespace(null);
        }}>
        {environments.map(x => <NekoOption key={x.id} value={x.id} label={x.name} />)}
        {!environments?.length && <NekoOption value={null} label="None" />}
      </NekoSelect>
    </div>

    <div style={{ display: 'flex' }}>
      <NekoSelect scrolldown name="index"
        description={i18n.COMMON.EMBEDDINGS_ENV + ' / ' + i18n.COMMON.EMBEDDINGS_INDEX}
        style={{ flex: 1.5 }} disabled={isBusy}
        value={index ?? null} onChange={value => setIndex(value)}>
        {indexes.map(x => <NekoOption key={x.name} value={x.name} label={x.name} />)}
        <NekoOption value={null} label="None" />
      </NekoSelect>
      {environment?.type === 'pinecone' && (
        <NekoSelect scrolldown name="namespace"
          disabled={!environment || environment.server === 'none' ||
            environment.server === 'gcp-starter' || isBusy}
          description={i18n.COMMON.NAMESPACE} style={{ marginLeft: 5, flex: 1 }}
          value={namespace ?? null} onChange={value => setNamespace(value)}>
          {namespaces.map(x => <NekoOption key={x} value={x} label={x} />)}
          <NekoOption value={null} label="None" />
        </NekoSelect>
      )}
    </div>
  </>, [environment, environments, indexes, namespace, isBusy]);

  return (
    <>
      <NekoWrapper>
        <NekoColumn fullWidth minimal style={{ margin: 10 }}>
          <div style={{ display: 'flex' }}>
            <NekoToolbar style={{ flex: 1, marginRight: 15 }}>
              <NekoSwitch
                style={{ marginRight: 10 }}
                disabled={isBusy || !index || !indexIsReady}
                onLabel={i18n.EMBEDDINGS.AI_SEARCH}
                offLabel={i18n.EMBEDDINGS.EDIT}
                width={110}
                onValue="search"
                offValue="edit"
                checked={mode === 'search'}
                onChange={setMode}
                onBackgroundColor={colors.purple}
                offBackgroundColor={colors.green}
              />
              {mode === 'edit' && (
                <NekoButton
                  className="primary"
                  disabled={isBusy || !index || !indexIsReady}
                  onClick={() => setModal({ type: 'add', data: DEFAULT_VECTOR })}
                >
                  Add
                </NekoButton>
              )}
            </NekoToolbar>
            <NekoToolbar style={{ flex: 'auto' }}>
              {mode === 'edit' && (
                <>
                  {selectedIds.length > 0 && (
                    <>
                      <NekoButton
                        className="primary"
                        disabled={isBusy || !index}
                        isBusy={busy === 'bulkPushAll'}
                        onClick={() => onBulkPushClick(false)}
                      >
                        {i18n.EMBEDDINGS.SYNC_ALL}
                        {!isLoadingCount && <>({`${postsCount}`})</>}
                      </NekoButton>
                      <NekoButton
                        className="danger"
                        disabled={isBusy || !index || !indexIsReady}
                        onClick={deleteSelected}
                      >
                        {i18n.COMMON.DELETE_SELECTED}
                      </NekoButton>
                    </>
                  )}
                  {selectedIds.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: 10,
                        marginRight: 10,
                      }}
                    >
                      {selectedIds.length} selected
                    </div>
                  )}
                  <NekoProgress
                    busy={bulkTasks.busy}
                    style={{ flex: 'auto' }}
                    value={bulkTasks.value}
                    max={bulkTasks.max}
                    onStopClick={bulkTasks.stop}
                  />
                </>
              )}
              {mode === 'search' && (
                <div
                  style={{
                    flex: 'auto',
                    display: 'flex',
                  }}
                >
                  <NekoInput
                    style={{ flex: 'auto', marginRight: 5 }}
                    placeholder="Search"
                    disabled={isBusy || !index || !indexIsReady}
                    value={search}
                    onChange={setSearch}
                    onEnter={onSearchEnter}
                    onReset={onResetSearch}
                  />
                  <NekoButton
                    className="primary"
                    onClick={onSearchEnter}
                    disabled={isBusy || !index || !indexIsReady || !search}
                    isBusy={busy === 'searchVectors'}
                  >
                    Search
                  </NekoButton>
                </div>
              )}
            </NekoToolbar>
          </div>
        </NekoColumn>
        <NekoColumn minimal style={{ flex: 3, marginRight: 10 }}>
          <NekoBlock className="primary" title="Embeddings">
            <NekoTable
              busy={isBusy}
              sort={queryParams.sort}
              onSortChange={(accessor, by) => {
                setQueryParams({ ...queryParams, sort: { accessor, by } });
              }}
              data={vectorsRows}
              columns={columns}
              onSelectRow={(id) => {
                setSelectedIds([id]);
              }}
              onSelect={(ids) => {
                setSelectedIds([...selectedIds, ...ids]);
              }}
              onUnselect={(ids) => {
                setSelectedIds([...selectedIds.filter((x) => !ids.includes(x))]);
              }}
              selectedItems={selectedIds}
            />
            <NekoSpacer />
            {mode !== 'search' && (
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <NekoPaging
                  currentPage={queryParams.page}
                  limit={queryParams.limit}
                  total={vectorsTotal}
                  onClick={(page) => {
                    setQueryParams({ ...queryParams, page });
                  }}
                />
                <NekoButton
                  className="primary"
                  style={{ marginLeft: 5 }}
                  disabled={busyFetchingVectors || !index}
                  onClick={() => {
                    queryClient.invalidateQueries({ queryKey: ['vectors'] });
                  }}
                >
                  {i18n.COMMON.REFRESH}
                </NekoButton>
                <NekoButton
                  className="primary"
                  style={{ marginLeft: 5 }}
                  onClick={() => {
                    setModal({
                      type: 'export',
                      data: {
                        envId: environmentId,
                        dbIndex: index,
                        dbNS: namespace,
                      },
                    });
                  }}
                >
                  {i18n.COMMON.EXPORT}
                </NekoButton>
              </div>
            )}
          </NekoBlock>
          <NekoBlock className="primary">
            <p>
              <b>
                If want to discuss embeddings with other users, visit the{' '}
                <a
                  href="https://discord.gg/bHDGh38"
                  target="_blank"
                  rel="noreferrer"
                >
                  Meow Apps Discord Server
                </a>
                .
              </b>
            </p>
            <p>
              An embedding is a textual piece of data (sentence, paragraph, a whole
              article) that has been converted by OpenAI into a vector. Vectors can then
              be used to find the most relevant data for a given query. In this dashboard,
              you can create embeddings, and they will be synchronized with{' '}
              <a target="_blank" href="https://www.pinecone.io/" rel="noreferrer">
                Pinecone
              </a>
              , a very fast and affordable vector database.
            </p>
            <p>
              You can switch from EDIT to AI SEARCH and you will be able to query the
              database, and get your content, with a score. You can edit the content and
              it will be synchronized with Pinecone. Then make your content perfect so
              that the results are satisfying! You can use Sync and Sync One, it will
              go through your posts and create the embeddings if they don't exist yet,
              or update them if they do.
            </p>
            <p>Both the chatbots and the AI Forms can use embeddings to enrich their answers.</p>
          </NekoBlock>
        </NekoColumn>
        <NekoColumn minimal>
          <NekoSpacer large />
          <NekoTabs inversed style={{ marginRight: 10 }}>
            <NekoTab title="Index">
              {jsxEnvIndexNS}
              {index && !indexIsReady && (
                <NekoMessage
                  variant="danger"
                  style={{ marginTop: 15, padding: '8px 12px' }}
                >
                  This index is currently being build by Pinecone. Wait a few minutes, then use the{' '}
                  <b>Refresh</b> button.
                </NekoMessage>
              )}
            </NekoTab>
            <NekoTab title="Settings">
              {jsxEnvIndexNS}
              <NekoSpacer />
              <div style={{ display: 'flex' }}>
                <NekoButton
                  className="primary"
                  onClick={() => setIndexModal(DEFAULT_INDEX)}
                  style={{ flex: 1 }}
                  isBusy={busy === 'addIndex'}
                  disabled={isBusy}
                >
                  {i18n.EMBEDDINGS.ADD_INDEX}
                </NekoButton>
                <NekoButton
                  className="secondary"
                  onClick={onRefreshIndexes}
                  style={{ flex: 1 }}
                  isBusy={busy === 'refreshIndexes'}
                  disabled={isBusy}
                >
                  {i18n.COMMON.REFRESH}
                </NekoButton>
                <NekoButton
                  className="danger"
                  onClick={onDeleteIndex}
                  style={{ flex: 1 }}
                  isBusy={busy === 'deleteEmbeddings'}
                  disabled={isBusy || !index || !indexIsReady}
                >
                  {i18n.COMMON.DELETE}
                </NekoButton>
              </div>
              <NekoSpacer />
              {index && !indexIsReady && (
                <NekoMessage
                  variant="danger"
                  style={{ marginTop: 15, padding: '8px 12px' }}
                >
                  This index is currently being build by Pinecone. Wait a few minutes, then use the{' '}
                  <b>Refresh</b> button.
                </NekoMessage>
              )}
              <div style={{ display: 'flex' }}>
                <div style={{ flex: 1, marginRight: 5 }}>
                  <label>Minimum Score:</label>
                  <NekoInput
                    value={minScore}
                    type="number"
                    min={0}
                    max={98}
                    step={0.5}
                    onFinalChange={(value) => {
                      setEmbeddingsSettings({
                        ...embeddingsSettings,
                        minScore: parseFloat(value),
                      });
                    }}
                  />
                </div>
                <div style={{ flex: 1, marginLeft: 5 }}>
                  <label>Max Embedding(s):</label>
                  <NekoInput
                    value={maxSelect}
                    type="number"
                    min={1}
                    max={20}
                    step={1}
                    onFinalChange={(value) => {
                      setEmbeddingsSettings({
                        ...embeddingsSettings,
                        maxSelect: parseInt(value),
                      });
                    }}
                  />
                </div>
              </div>
              <p>
                The {maxSelect} best embedding(s) with a minimum score of {minScore}{' '}
                will be used to build the reply.
              </p>
            </NekoTab>
          </NekoTabs>
          <NekoSpacer />
          {mode !== 'search' && (
            <NekoTabs inversed style={{ marginRight: 10 }}>
              <NekoTab title="Sync Push" inversed>
                <NekoUploadDropArea ref={ref} onSelectFiles={onSelectFiles} accept={''}>
                  <NekoButton fullWidth className="secondary" onClick={() => ref.current.click()}>
                    Import CSV or JSON
                  </NekoButton>
                </NekoUploadDropArea>
                <NekoSpacer line={true} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <NekoSelect
                    id="postType"
                    scrolldown
                    disabled={isBusy}
                    name="postType"
                    style={{ width: 100 }}
                    onChange={setPostType}
                    value={postType}
                  >
                    {postTypes?.map((postType) => (
                      <NekoOption
                        key={postType.type}
                        value={postType.type}
                        label={postType.name}
                      />
                    ))}
                  </NekoSelect>
                  <NekoButton
                    fullWidth
                    className="primary"
                    style={{ marginLeft: 10 }}
                    disabled={isBusy || !index}
                    isBusy={busy === 'bulkPushAll'}
                    onClick={() => onBulkPushClick(true)}
                  >
                    {i18n.EMBEDDINGS.SYNC_ALL}{' '}
                    {!isLoadingCount && <>({`${postsCount}`})</>}
                  </NekoButton>
                </div>
                <NekoSpacer tiny />
                <NekoButton
                  fullWidth
                  className="primary"
                  disabled={isBusy || !index}
                  isBusy={busy === 'singleRun'}
                  onClick={OnSingleRunClick}
                >
                  {i18n.EMBEDDINGS.SYNC_ONE}
                </NekoButton>
              </NekoTab>
              <NekoTab title="Sync Pull" inversed>
                <NekoButton
                  fullWidth
                  className="primary"
                  disabled={isBusy || !index}
                  isBusy={busy === 'bulkPullAll'}
                  onClick={() => onBulkPullClick()}
                >
                  {i18n.EMBEDDINGS.SYNC_ALL}
                </NekoButton>
              </NekoTab>
              <NekoTab title="Settings" inversed>
                <NekoCheckbox
                  label={i18n.EMBEDDINGS.REWRITE_CONTENT}
                  disabled={busy}
                  checked={embeddingsSettings.rewriteContent}
                  onChange={(value) => {
                    setEmbeddingsSettings({
                      ...embeddingsSettings,
                      rewriteContent: value,
                    });
                  }}
                  description={i18n.EMBEDDINGS.REWRITE_CONTENT_DESCRIPTION}
                />
                <NekoSpacer />
                {embeddingsSettings.rewriteContent && (
                  <NekoTextArea
                    value={embeddingsSettings.rewritePrompt}
                    rows={5}
                    disabled={busy}
                    onBlur={(value) => {
                      setEmbeddingsSettings({
                        ...embeddingsSettings,
                        rewritePrompt: value,
                      });
                    }}
                    description={i18n.EMBEDDINGS.REWRITE_PROMPT_DESCRIPTION}
                  />
                )}
                <NekoSpacer />
                <NekoCheckbox
                  label={i18n.EMBEDDINGS.FORCE_RECREATE}
                  checked={embeddingsSettings.forceRecreate}
                  disabled={busy}
                  onChange={(value) => {
                    setEmbeddingsSettings({
                      ...embeddingsSettings,
                      forceRecreate: value,
                    });
                  }}
                  description={i18n.EMBEDDINGS.FORCE_RECREATE_DESCRIPTION}
                />
                <NekoSpacer medium line={true} />
                <h3 style={{ marginTop: 0 }}>Auto Sync</h3>
                <NekoCheckbox
                  label={i18n.EMBEDDINGS.AUTO_SYNC_POSTS}
                  checked={embeddingsSettings.syncPosts}
                  disabled={busy}
                  onChange={(value) => {
                    setEmbeddingsSettings({
                      ...embeddingsSettings,
                      syncPosts: value,
                    });
                  }}
                  description={i18n.EMBEDDINGS.AUTO_SYNC_POSTS_DESCRIPTION}
                />
                {embeddingsSettings.syncPosts && (
                  <>
                    <p>
                      {!embeddingsSettings.syncPostsEnv && 'Auto Sync is not set.'}
                      {embeddingsSettings.syncPostsEnv && (
                        <ul
                          style={{
                            lineHeight: '10px',
                            marginLeft: 15,
                            listStyle: 'disc',
                          }}
                        >
                          <li>
                            Environment: <b>{syncPostsEnvName}</b>
                          </li>
                          <li>
                            Index: <b>{embeddingsSettings.syncPostsEnv.dbIndex}</b>
                          </li>
                          <li>
                            Namespace: <b>{embeddingsSettings.syncPostsEnv.dbNS}</b>
                          </li>
                        </ul>
                      )}
                    </p>
                    {isSyncEnvDifferent && (
                      <NekoMessage
                        variant="danger"
                        style={{ padding: '10px 20px', marginBottom: 10 }}
                      >
                        The current environment is different from the one set for Auto Sync. Do
                        you want to use it instead?
                      </NekoMessage>
                    )}
                    {isSyncEnvDifferent && (
                      <NekoButton
                        fullWidth
                        className="primary"
                        onClick={() =>
                          setEmbeddingsSettings({
                            ...embeddingsSettings,
                            syncPostsEnv: {
                              envId: environmentId,
                              dbIndex: index,
                              dbNS: namespace,
                            },
                          })
                        }
                        style={{ flex: 1 }}
                        disabled={isBusy}
                      >
                        Use Current Environment
                      </NekoButton>
                    )}
                    <NekoSpacer />
                    <NekoInput
                      name="syncPostTypes"
                      value={embeddingsSettings.syncPostTypes}
                      isCommaSeparatedArray={true}
                      description={i18n.HELP.POST_TYPES}
                      onBlur={(value) => {
                        setEmbeddingsSettings({
                          ...embeddingsSettings,
                          syncPostTypes: value,
                        });
                      }}
                    />
                    <NekoSpacer />
                    <NekoInput
                      name="syncPostStatus"
                      value={embeddingsSettings.syncPostStatus || 'publish'}
                      isCommaSeparatedArray={true}
                      description={i18n.HELP.POST_STATUS}
                      onBlur={(value) => {
                        setEmbeddingsSettings({
                          ...embeddingsSettings,
                          syncPostStatus: value,
                        });
                      }}
                    />
                  </>
                )}
              </NekoTab>
            </NekoTabs>
          )}
        </NekoColumn>
      </NekoWrapper>

      {/* Modals */}
      <AddModifyModal
        modal={modal}
        setModal={setModal}
        busy={busy}
        onAddEmbedding={onAddEmbedding}
        onModifyEmbedding={onModifyEmbedding}
      />

      <ExportModal modal={modal} setModal={setModal} busy={busy} />

      <ImportModal
        modal={modal}
        setModal={setModal}
        busy={busy}
        onAddEmbedding={onAddEmbedding}
        onModifyEmbedding={onModifyEmbedding}
      />

      <NekoModal
        isOpen={indexModal}
        title={i18n.EMBEDDINGS.ADD_INDEX}
        onRequestClose={() => setIndexModal(null)}
        content={
          <>
            <p>{i18n.EMBEDDINGS.ADD_INDEX_DESCRIPTION}</p>
            <NekoSpacer height={30} />
            <label>Name:</label>
            <NekoSpacer />
            <NekoInput
              value={indexModal?.name}
              placeholder={`Name for your index`}
              onChange={(value) => setIndexModal({ ...indexModal, name: value })}
            />
            <NekoSpacer />
            <label>Type:</label>
            <NekoSpacer />
            <NekoSelect
              scrolldown
              name="podType"
              disabled={isBusy}
              value={indexModal?.podType}
              onChange={(value) => {
                setIndexModal({ ...indexModal, podType: value });
              }}
              description={
                <>
                  Pick S1 only if you will have more than 1 million of embeddings. P2 is faster for querying,
                  slower for adding, and more expensive if you are not using the{' '}
                  <a href="https://www.pinecone.io/pricing/" target="_blank" rel="noreferrer">
                    Starter Plan
                  </a>
                  (free) of Pinecone. P2 is recommended.
                </>
              }
            >
              <NekoOption value="s1" label="S1 (5M Embeddings)" />
              <NekoOption value="p1" label="P1 (1M Embeddings & High Perf)" />
              <NekoOption value="p2" label="P2 (1M Embeddings & Max Perf)" />
            </NekoSelect>
          </>
        }
        okButton={{
          label: i18n.EMBEDDINGS.ADD_INDEX,
          onClick: onAddIndex,
          disabled: !indexModal?.name || !indexModal?.podType,
          busy: busy === 'addIndex',
        }}
        cancelButton={{
          onClick: () => setIndexModal(null),
          disabled: busy,
        }}
      />

      {bulkTasks.TasksErrorModal}
    </>
  );
};

export default Embeddings;