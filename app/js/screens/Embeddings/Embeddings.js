// Previous: 2.7.6
// Current: 2.8.2

const { useState, useMemo, useEffect, useRef } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { nekoStringify } from '@neko-ui';
import Papa from 'papaparse';

import { NekoButton, NekoSelect, NekoOption, NekoProgress, NekoTextArea, NekoInput, NekoToolbar, NekoTypo,
  NekoTable, NekoPaging, NekoMessage, NekoSpacer, NekoSwitch, NekoBlock, NekoCheckbox, NekoUploadDropArea, NekoTabs, NekoTab, NekoWrapper, NekoColumn, NekoIcon } from '@neko-ui';
import { nekoFetch, useNekoTasks, useNekoColors } from '@neko-ui';

import i18n from '@root/i18n';
import { apiUrl, restNonce } from '@app/settings';
import { retrieveVectors, retrieveRemoteVectors, retrievePostsCount, addFromRemote,
  synchronizeEmbedding, retrievePostsIds, DEFAULT_VECTOR, useModels } from '@app/helpers-admin';
import { retrievePostTypes } from '@app/requests';
import AddModifyModal from './AddModifyModal';
import ExportModal from './ExportModal';
import ImportModal from './ImportModal';

const searchColumns = [
  { accessor: 'status', title: 'Status', width: '80px' },
  { accessor: 'title', title: 'Title / Model', sortable: false },
  { accessor: 'type', title: 'Ref', sortable: false, width: '75px' },
  { accessor: 'score', title: 'Score', sortable: true, width: '65px' },
  { accessor: 'updated', title: 'Updated', sortable: false, width: '80px' },
  { accessor: 'actions', title: '', width: '100px'  }
];

const queryColumns = [
  { accessor: 'status', title: 'Status', sortable: true, width: '80px' },
  { accessor: 'title', title: 'Title / Model', sortable: false },
  { accessor: 'type', title: 'Ref', sortable: true, width: '75px' },
  { accessor: 'updated', title: 'Updated', sortable: true, width: '80px' },
  { accessor: 'actions', title: '', width: '100px'  }
];

const StatusIcon = ({ embedding, envName }) => {
  const { colors } = useNekoColors();
  const includeText = true;
  const { status: embeddingStatus, content, error } = embedding;

  const status = useMemo(() => {
    if (embeddingStatus === 'ok') {
      if (!envName) return 'env_issue';
      if (!content) return 'empty';
    }
    return embeddingStatus;
  }, [embeddingStatus, envName, content]);

  const title = useMemo(() => {
    if (status === 'orphan') {
      return 'This embedding was retrieved from the Vector DB, but it has no content. Add some, or delete it.';
    }
    else if (status === 'env_issue') {
      return 'This embedding is not related to any Embeddings Environment. Make sure you have an Embeddings Environment selected, and Sync/Refresh it; it will be linked to the current environment. You can also delete it.';
    }
    else if (status === 'empty') {
      return 'This embedding has no content.';
    }
    return error || null;
  }, [status, error]);

  const { icon, color } = useMemo(() => {
    const statusMap = {
      outdated: { icon: 'alert', color: colors.orange },
      ok: { icon: 'check-circle', color: colors.green },
      error: { icon: 'alert', color: colors.red },
      orphan: { icon: 'pencil', color: colors.orange },
      env_issue: { icon: 'database', color: colors.red },
      empty: { icon: 'alert', color: colors.orange },
      default: { icon: 'alert', color: colors.orange },
    };
    return statusMap[status] || statusMap.default;
  }, [status, colors]);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }} title={title}>
      <NekoIcon icon={icon} width={24} color={color} title={title} />
      {includeText && (
        <span style={{ textTransform: 'uppercase', fontSize: 9, marginLeft: 3 }}>{status}</span>
      )}
    </div>
  );
};


const setLocalSettings = ({ environmentId }) => {
  const settings = { environmentId: environmentId || null };
  localStorage.setItem('mwai-admin-embeddings', nekoStringify(settings));
};

const getLocalSettings = () => {
  const localSettingsJSON = localStorage.getItem('mwai-admin-embeddings');
  try {
    const parsedSettings = JSON.parse(localSettingsJSON);
    return { environmentId: parsedSettings?.environmentId || null };
  }
  catch (e) {
    return { environmentId: null };
  }
};

const Embeddings = ({ options, updateOption }) => {
  const queryClient = useQueryClient();
  const { colors } = useNekoColors();
  const [ postType, setPostType ] = useState('post');
  const [ busy, setBusy ] = useState(false);
  const [ mode, setMode ] = useState('edit');
  const [ search, setSearch ] = useState(null);
  const [ embeddingModal, setEmbeddingModal ] = useState(false);
  const [ selectedIds, setSelectedIds ] = useState([]);
  const [ modal, setModal ] = useState({ type: null, data: null });
  const [ debugMode, setDebugMode ] = useState(null);

  const embeddingsSettings = options.embeddings || {};

  const ref = useRef(null);
  const allModels = useModels(options, false, true);
  const environments = options.embeddings_envs || [];
  const [ environmentId, setEnvironmentId ] = useState(getLocalSettings().environmentId);
  const environment = useMemo(() => {
    return environments.find(e => e.id === environmentId) || null;
  }, [environments, environmentId]);

  const minScore = environment?.min_score >= 0 ? environment.min_score : 35;
  const maxSelect = environment?.max_select >= 0 ? environment.max_select : 10;

  const { isLoading: isLoadingPostTypes, data: postTypes } = useQuery({
    queryKey: ['postTypes'], queryFn: retrievePostTypes
  });
  const { isLoading: isLoadingCount, data: postsCount } = useQuery({
    queryKey: ['postsCount-' + postType + '-' + (embeddingsSettings?.syncPostStatus ?? 'publish')],
    queryFn: () => retrievePostsCount(postType, embeddingsSettings?.syncPostStatus ?? 'publish'),
  });

  const [ queryParams, setQueryParams ] = useState({
    filters: { envId: environmentId, search, debugMode },
    sort: { accessor: 'updated', by: 'desc' }, page: 1, limit: 20
  });
  const { isFetching: isBusyQuerying, data: vectorsData, error: vectorsError } = useQuery({
    queryKey: ['vectors', queryParams],
    queryFn: () => retrieveVectors(queryParams)
  });

  const busyFetchingVectors = isBusyQuerying || busy === 'searchVectors';
  const columns = mode === 'search' ? searchColumns : queryColumns;
  const bulkTasks = useNekoTasks({ i18n, onStop: () => { setBusy(false); bulkTasks.reset(); } });
  const isBusy = busy || busyFetchingVectors || bulkTasks.isBusy || isLoadingPostTypes;

  const setEmbeddingsSettings = async (freshEmbeddingsSettings) => {
    setBusy('updateSettings');
    await updateOption({ ...freshEmbeddingsSettings }, 'embeddings');
    setBusy(false);
  };

  const isSyncEnvDifferent = useMemo(() => {
    return embeddingsSettings.syncPosts && embeddingsSettings?.syncPostsEnvId !== environmentId;
  }, [environmentId, embeddingsSettings]);

  useEffect(() => {
    if (!embeddingsSettings.syncPosts && embeddingsSettings.syncPostsEnvId) {
      setEmbeddingsSettings({ ...embeddingsSettings, syncPostsEnvId: null });
    }
  }, [embeddingsSettings.syncPosts]);

  const syncEnv = useMemo(() => {
    return environments.find(e => e.id === embeddingsSettings.syncPostsEnvId) || null;
  }, [embeddingsSettings.syncPostsEnvId]);

  useEffect(() => {
    setQueryParams({ ...queryParams,
      filters: { envId: environmentId, search, debugMode }
    });
    setLocalSettings({ environmentId });
  }, [environmentId, debugMode]);

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
  }, [embeddingsSettings.syncPostTypes]);

  const jsxAutoSyncStatus = useMemo(() => {
    const styles = { padding: '8px 15px', textAlign: 'center' };
    if (embeddingsSettings.syncPosts && !syncEnv) {
      return <NekoMessage variant="danger" style={styles}>
        Pick a valid environment for the sync.
      </NekoMessage>;
    }
    if (embeddingsSettings.syncPosts) {
      return <NekoMessage variant="special" style={styles}>
        Enabled on <b>{syncEnv?.name}</b>
      </NekoMessage>;
    }
    return <NekoMessage variant="info" style={styles}>
      Disabled
    </NekoMessage>;
  }, [embeddingsSettings, syncEnv]);

  const onSearchEnter = async () => {
    if (search === (queryParams.filters.search ?? '')) {
      queryClient.invalidateQueries({ queryKey: ['vectors'] });
      return;
    }
    setQueryParams({ ...queryParams, filters: { ...queryParams.filters, search } });
  };

  const onResetSearch = () => {
    setSearch(null);
    setQueryParams({ ...queryParams, filters: { ...queryParams.filters, search: null } });
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
      const freshVector = await nekoFetch(`${apiUrl}/vectors/add`, { nonce: restNonce, method: 'POST',
        json: { vector }
      });
      updateVectorsData(freshVector?.vector, true);
      setEmbeddingModal(false);
      console.log("Embedding Added", inEmbedding);
    }
    catch (err) {
      console.error(err);
      throw new Error(err.message ?? "Unknown error, check your console logs.");
    }
    if (!skipBusy) {
      setBusy(false);
    }
    return true;
  };

  const onModifyEmbedding = async (inEmbedding = embeddingModal, skipBusy) => {
    if (!skipBusy) {
      setBusy('addEmbedding');
    }
    try {
      const vector = { ...inEmbedding };
      vector.envId = environment.id;
      const freshVector = await nekoFetch(`${apiUrl}/vectors/update`, { nonce: restNonce, method: 'POST',
        json: { vector }
      });
      updateVectorsData(freshVector?.vector);
      setEmbeddingModal(false);
      console.log("Embeddings updated.", freshVector);
    }
    catch (err) {
      console.error(err);
      throw new Error(err.message ?? "Unknown error, check your console logs.");
    }
    if (!skipBusy) {
      setBusy(false);
    }
    return true;
  };

  const onDeleteEmbedding = async (ids, skipBusy) => {
    if (!skipBusy) {
      setBusy('deleteEmbedding');
    }
    try {
      await nekoFetch(`${apiUrl}/vectors/delete`, { nonce: restNonce, method: 'POST',
        json: { envId: environment.id, ids }
      });
    }
    catch (err) {
      console.error(err);
      if (!confirm(`Got an error from the vector database:\n\n${err.message}\n\nDo you want to force the deletion locally?`)) {
        throw new Error(err.message ?? "Unknown error, check your console logs.");
      }
      await nekoFetch(`${apiUrl}/vectors/delete`, { nonce: restNonce, method: 'POST',
        json: { envId: environment.id, ids, force: true }
      });
    }
    if (!skipBusy) {
      setBusy(false);
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
          try {
            data = JSON.parse(fileContent);
          } catch(e) {
            console.error(e);
            data = [];
          }
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
          }).filter(Boolean);
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
        setModal({ type: 'import', data: { importVectors: cleanData, envId: environmentId } });
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

  const deleteAllEmbeddings = async () => {
    if (!environment) { return; }
    if (!confirm(i18n.EMBEDDINGS.DELETE_ALL_EMBEDDINGS_CONFIRM + `\n\n${environment.name}`)) {
      return;
    }
    setBusy('deleteAllEmbeddings');
    try {
      await nekoFetch(`${apiUrl}/vectors/delete_all`, { nonce: restNonce, method: 'POST', json: { envId: environmentId } });
      queryClient.invalidateQueries({ queryKey: ['vectors'] });
    }
    catch (err) {
      alert(err?.message ?? err);
    }
    setBusy(false);
  };

  const vectorsTotal = useMemo(() => {
    return vectorsData?.total ?? 0;
  }, [vectorsData]);

  const vectorsRows = useMemo(() => {
    const data = vectorsData;
    if (!data?.vectors) { return []; }
    return data?.vectors.map(x => {
      let updated = new Date(x.updated);
      updated = new Date(updated.getTime() - updated.getTimezoneOffset() * 60 * 1000);
      const day = updated.toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit'
      });
      const time = updated.toLocaleTimeString('ja-JP', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      const updatedFormattedTime = <span>{day}<br />{time}</span>;
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
      const isDifferentModel = x.model && x.model !== embeddingsModel?.model;
      const isDifferentEnv = x.envId !== environmentId;
      const envName = environments.find(e => e.id === x.envId)?.name;
      const needsSync = x.status !== 'ok' || isDifferentModel || isDifferentEnv;

      let potentialError = null;
      if (isDifferentModel) {
        potentialError = <b style={{ color: colors.red }}>[MODEL MISMATCH] </b>;
        console.error(`Embeddings Model Mismatch for #${x.id}: "${x.title}". Should be "${embeddingsModel?.model}" but "${x.model}" was found. Sync will fix this.`);
      }
      if (isDifferentEnv && envName) {
        potentialError = <b style={{ color: colors.green }}>[ENV: {envName}] </b>;
      }

      return {
        id: x.id,
        type: <small>
          {x.refId ? <>ID <a href={`/wp-admin/post.php?post=${x.refId}&action=edit`} target="_blank" rel="noreferrer">#{x.refId}</a><br /><div style={{ fontSize: '80%', marginTop: -5 }}>{subType}</div></> : 'MANUAL'}</small>,
        score: score,
        title: <>
          <span>{x.title}</span><br />
          <small style={{ color: isDifferentModel ? colors.red : 'inherit' }}>
            {potentialError}
            {modelName} {x.dimensions && <> ({x.dimensions})</>}
          </small>
        </>,
        status: <StatusIcon embedding={x} envName={envName} />,
        updated: updatedFormattedTime,
        created: createdFormattedTime,
        actions: <>
          <NekoButton className="primary" rounded icon="pencil" disabled={isBusy}
            onClick={() => setModal({ type: 'edit', data: x })}>
          </NekoButton>
          <NekoButton className="primary" rounded icon="replay" disabled={isBusy || !needsSync}
            onClick={() => onSynchronizeEmbedding(x.id)}>
          </NekoButton>
          <NekoButton className="danger" rounded icon="trash" disabled={isBusy}
            onClick={() => onDeleteEmbedding([x.id])}>
          </NekoButton>
        </>
      };
    });
  }, [mode, vectorsData, isBusy]);

  const onSynchronizeEmbedding = async (vectorId) => {
    setBusy('syncEmbedding');
    try {
      await runProcess(vectorId);
    }
    catch (error) {
      console.error(error);
      alert(error?.message ?? error);
    }
    setBusy(false);
  };

  const updateVectorsData = (freshVector, isAdd = false) => {
    queryClient.invalidateQueries({ queryKey: ['vectors'] });
    return;

    const currentVectorsData = queryClient.getQueryData(['vectors', queryParams]);
    if (currentVectorsData && currentVectorsData.vectors) {
      let wasUpdated = false;
      let updatedVectors = currentVectorsData.vectors.map(vector => {
        const isSameId = vector.id === freshVector.id;
        const isSameEnvAndRefId = vector.envId === freshVector.envId &&
          vector.refId === freshVector.refId && !!vector.refId && !!freshVector.refId;
        const isSameOrphan = !!debugMode && vector.title === freshVector.title;
        if (isSameId || isSameEnvAndRefId || isSameOrphan) {
          wasUpdated = true;
          return { ...vector, ...freshVector };
        }
        return vector;
      });

      if (!wasUpdated && isAdd) {
        updatedVectors = [freshVector, ...updatedVectors];
        currentVectorsData.total += 1;
      }

      const { accessor, by } = queryParams.sort;
      updatedVectors.sort((a, b) => {
        if (by === 'asc') {
          return a[accessor] - b[accessor];
        } else {
          return b[accessor] - a[accessor];
        }
      });

      const { page, limit } = queryParams;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedVectors = updatedVectors.slice(startIndex, endIndex);

      const updatedVectorsData = {
        ...currentVectorsData,
        vectors: paginatedVectors,
      };

      queryClient.setQueryData(['vectors', queryParams], updatedVectorsData);
    }
  };

  const runProcess = async (vectorId = null, postId = null, signal = undefined) => {
    const res = await synchronizeEmbedding({ vectorId, postId, envId: environmentId }, signal);
    if (res.success) {
      updateVectorsData(res.vector);
    }
  };

  const onBulkPullClick = async () => {
    setBusy('bulkPullAll');
    const params = { page: 1, limit: 10000,
      filters: { envId: environmentId }
    };
    let remoteVectors = [];
    let vectors = [];
    let finished = false;

    while (!finished) {
      try {
        const res = await retrieveRemoteVectors(params);
        if (res.vectors.length < params.limit) {
          finished = true;
        }
        remoteVectors = remoteVectors.concat(res.vectors);
        params.page++;
      }
      catch (e) {
        console.error(e);
        alert(e?.message ?? e);
        setBusy(false);
        return;
      }
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

    const vectorsToPull = remoteVectors.filter(x => !vectors.includes(x));

    console.log("Vectors to pull from Vector DB to AI Engine.", { vectorsToPull });

    if (!vectorsToPull.length) {
      setBusy(false);
      alert(`${remoteVectors.length} vectors were pulled from the remote database. They are already synchronized with the local database.`);
      return;
    }

    const tasks = vectorsToPull.map(dbId => async (signal) => {
      await addFromRemote({ envId: environmentId, dbId: dbId }, signal);
      await queryClient.invalidateQueries({ queryKey: ['vectors'] });
      return { success: true };
    });
    await bulkTasks.start(tasks);

    setBusy(false);
    alert("All done! For more information, check the console (Chrome Developer Tools).");
    bulkTasks.reset();
  };

  const onBulkPushClick = async (all = false) => {
    setBusy('bulkPushAll');
    let tasks = [];
    if (all || selectedIds.length === 0) {
      const postIds = await retrievePostsIds(postType, embeddingsSettings?.syncPostStatus ?? 'publish');
      tasks = postIds.map(postId => async (signal) => {
        await runProcess(null, postId, signal);
        return { success: true };
      });
    }
    else {
      const postIds = vectorsData ? vectorsData.vectors.filter(x => selectedIds.includes(x.id)) : [];
      tasks = postIds.map(vector => async (signal) => {
        if (vector.type === 'postId') {
          await runProcess(vector.id, null, signal);
        }
        else if (vector.type === 'manual') {
          await onModifyEmbedding(vector, signal);
        }
        return { success: true };
      });
    }

    await bulkTasks.start(tasks);
    setBusy(false);
    alert("All done! For more information, check the console (Chrome Developer Tools). Posts with very short content (or content that could not be retrieved) are skipped.");
    bulkTasks.reset();
  };

  const OnSingleRunClick = async () => {
    const postId = prompt("Enter the Post ID to synchronize with:");
    if (!postId) {
      return;
    }
    setBusy('singleRun');
    try {
      await runProcess(null, postId);
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
          setEnvironmentId(value);
        }}>
        {environments.map(x => <NekoOption key={x.id} value={x.id} label={x.name} />)}
        {!environments?.length && <NekoOption value={null} label="None" />}
      </NekoSelect>
    </div>
  </>, [environment, environments, isBusy]);

  const emptyMessage = useMemo(() => {
    if (vectorsError?.message) {
      return <NekoMessage variant="danger" style={{ margin: "5px 5px" }}>
        <b>{vectorsError.message}</b><br />
        <small>Check your Console Logs and PHP Error Logs for more information.</small>
      </NekoMessage>;
    }
    return mode === 'search' ? i18n.HELP.NO_EMBEDDINGS_RESULTS : i18n.HELP.NO_EMBEDDINGS_ROWS;
  }, [mode, vectorsError]);

  return (<>
    <NekoWrapper>
      <NekoColumn fullWidth minimal style={{ margin: 10 }}>
        <div style={{ display: 'flex' }}>
          <NekoToolbar style={{ flex: 1, marginRight: 15 }}>
            <NekoSwitch style={{ marginRight: 10 }} disabled={isBusy}
              onLabel={i18n.EMBEDDINGS.AI_SEARCH} offLabel={i18n.EMBEDDINGS.EDIT} width={110}
              onValue="search" offValue="edit"
              checked={mode === 'search'} onChange={setMode}
              onBackgroundColor={colors.purple} offBackgroundColor={colors.green}
            />
            {mode === 'edit' && <>
              <NekoButton className="primary" disabled={!environment || isBusy}
                onClick={() => setModal({ type: 'add', data: DEFAULT_VECTOR })}>
                  Add
              </NekoButton>
            </>}
          </NekoToolbar>
          <NekoToolbar style={{ flex: 'auto' }}>
            {mode === 'edit' && <>
              {selectedIds.length > 0 && <>
                <NekoButton className="primary" disabled={isBusy} isBusy={busy === 'bulkPushAll'}
                  onClick={() => onBulkPushClick(false)}>
                  Sync Selected
                </NekoButton>
                <NekoButton className="danger" disabled={isBusy}
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
                disabled={!environment || isBusy}
                value={search} onChange={setSearch} onEnter={onSearchEnter}
                onReset={onResetSearch} />
              <NekoButton className="primary" onClick={onSearchEnter}
                disabled={!environment || isBusy || !search}
                isBusy={busy === 'searchVectors'}>
                Search
              </NekoButton>
            </div>}
          </NekoToolbar>
        </div>
      </NekoColumn>
      {/* ... rest of JSX unchanged ... */}
    </NekoWrapper>
    <AddModifyModal modal={modal} setModal={setModal} busy={busy}
      onAddEmbedding={onAddEmbedding} onModifyEmbedding={onModifyEmbedding} />
    <ExportModal modal={modal} setModal={setModal} busy={busy} />
    <ImportModal modal={modal} setModal={setModal} busy={busy}
      onAddEmbedding={onAddEmbedding} onModifyEmbedding={onModifyEmbedding} />
    {bulkTasks.TasksErrorModal}
  </>);
};

export default Embeddings;