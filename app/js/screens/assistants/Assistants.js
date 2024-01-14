// Previous: 2.0.0
// Current: 2.1.5

// React & Vendor Libs
import { useState, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// NekoUI Components
import { NekoTable, NekoMessage, NekoButton, NekoSelect, NekoOption, NekoWrapper, NekoColumn,
  NekoTabs, NekoTab, NekoModal, NekoSpacer, NekoBlock, NekoTypo, NekoPaging } from '@neko-ui';
import i18n from '@root/i18n';

import { deleteFiles, retrieveFiles } from '@app/requests';
import { retrieveAssistants } from '@app/requests';
import { toHTML } from '@app/helpers-admin';

const assistantColumns = [
  {
    accessor: 'name', 
    title: 'Name', 
    verticalAlign: 'top'
  },
  {
    accessor: 'instructions', 
    title: 'Instructions', 
    width: 220, 
    verticalAlign: 'top'
  },
  {
    accessor: 'parameters', 
    title: 'Parameters', 
    verticalAlign: 'top'
  },
  {
    accessor: 'createdOn', 
    title: 'Created On', 
    verticalAlign: 'top'
  }
];

const fileColumns = [
  {
    accessor: 'file',
    title: 'File',
    verticalAlign: 'top'
  },
  {
    accessor: 'metadata',
    title: 'Metadata',
    verticalAlign: 'top'
  },
  {
    accessor: 'userId',
    title: 'User ID',
    verticalAlign: 'top'
  },
  {
    accessor: 'purpose',
    title: 'Purpose',
    verticalAlign: 'top'
  },
  {
    accessor: 'created',
    title: 'Created On',
    verticalAlign: 'top'
  },
  {
    accessor: 'actions',
    title: 'Actions',
    verticalAlign: 'top'
  }
];

const Assistants = ({ options, refreshOptions }) => {
  const queryClient = useQueryClient();
  const [ errorModal, setErrorModal ] = useState(null);
  const [ busyAction, setBusyAction ] = useState(false);
  const [ envId, setEnvId ] = useState(options?.ai_envs?.[0]?.id);
  const environments = options?.ai_envs || [];
  const [ modelFilter, setModelFilter ] = useState('all');
  const [ section, setSection ] = useState('assistants');
  const [ selectedIds, setSelectedIds ] = useState([]);

  const environment = useMemo(() => environments.find(x => x.id === envId), [envId, environments]);
  const deletedAssistants = environment?.assistants_deleted || [];
  const allAssistants = environment?.assistants || [];

  const [ filesQueryParams, setFilesQueryParams ] = useState({
    userId: null,
    purpose: ['assistant-in', 'assistant-out'],
    metadata: null,
    envId: envId,
    page: 1,
    limit: 10
  });
  const queryParamsChecksum = JSON.stringify(filesQueryParams);

  useEffect(() => {
    setFilesQueryParams(prev => ({ ...prev, envId }));
  }, [envId]);

  const { isFetching: isBusyFiles, error: errFiles, data: dataFiles } = useQuery({
    queryKey: ['assistants-files', queryParamsChecksum],
    enabled: section === 'files',
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    queryFn: () => retrieveFiles(filesQueryParams),
  });

  const resolveAssistantName = (assistantId) => {
    const assistant = allAssistants.find(x => x.id === assistantId);
    return assistant?.name || 'N/A';
  };

  const renderMetadata = (metadata) => {
    if (!metadata) { return null; }
    return <small><ul style={{ margin: 0, padding: 0 }}>
      {Object.keys(metadata).map(key => 
        <li key={key} style={{ margin: 0 }}>
          <i>{key}</i>: {metadata[key]} {key === 'assistant_id' ? `(${resolveAssistantName(metadata[key])})` : ''}
        </li>)
      }
    </ul></small>;
  };

  const renderLink = (url) => {
    if (!url) { return null; }
    const filename = url.split('/').pop();
    return <a href={url} target="_blank" rel="noreferrer">{filename}</a>;
  };

  const renderPurpose = (purpose) => {
    if (purpose === 'assistant-out') { return 'Generated'; }
    if (purpose === 'assistant-in') { return 'Uploaded'; }
    return purpose;
  };

  const renderFile = (url, refId) => {
    return <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span>{renderLink(url)}</span>
      <small>{refId}</small>
    </div>;
  };

  const onDeleteFile = async (fileIds) => {
    setBusyAction(true);
    try {
      await deleteFiles(fileIds);
      await queryClient.invalidateQueries('assistants-files');
      setSelectedIds([]);
    }
    catch (err) {
      setErrorModal(err);
    }
    setBusyAction(false);
  };

  const fileRows = useMemo(() => {
    return dataFiles?.files.map(file => ({
      ...file,
      file: renderFile(file.url, file.refId),
      purpose: renderPurpose(file.purpose),
      metadata: renderMetadata(file.metadata),
      created: new Date(file.created).toLocaleDateString(),
      actions: <>
        <NekoButton className="danger" rounded icon="trash" disabled={busy}
          onClick={() => onDeleteFile([file.id])}>
        </NekoButton>
      </>
    }));
  }, [dataFiles, busy]);

  const fileTotal = useMemo(() => {
    return dataFiles?.total || 0;
  }, [dataFiles]);

  const onRefreshAssistants = async () => {
    setBusyAction(true);
    await retrieveAssistants(envId);
    await refreshOptions();
    setBusyAction(false);
  };

  const onRefreshFiles = async () => {
    await queryClient.invalidateQueries('assistants-files');
  };

  const isDeleted = (assistant) => deletedAssistants.includes(assistant.id);

  const assistantRows = useMemo(() => {
    let filteredAssistants = allAssistants;
    if (modelFilter === 'deleted') {
      filteredAssistants = filteredAssistants.filter(isDeleted);
    }

    return filteredAssistants.map(assistant => ({
      ...assistant,
      name: <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>{assistant.name}</span>
        <small>{assistant.id}</small>
      </div>,
      instructions: assistant.instructions?.length > 100 ? 
        `${assistant.instructions.slice(0, 100)}...` : assistant.instructions,
      parameters: <>
        <ul style={{ margin: 0, padding: 0 }}>
          <li style={{ margin: 0 }}>Model: {assistant.model}</li>
          <li style={{ margin: 0 }}>Files: {assistant.files_count}</li>
          <li style={{ margin: 0 }}>Retrieval: {assistant.has_retrieval ? 'Yes' : 'No'}</li>
          <li style={{ margin: 0 }}>Code Interpreter: {assistant.has_code_interpreter ? 'Yes' : 'No'}</li>
        </ul>
      </>,
      createdOn: new Date(assistant.createdOn).toLocaleDateString()
    }));
  }, [modelFilter, deletedAssistants, allAssistants, helper]);

  const busy = busyAction;

  const jsxEnvironments = useMemo(() => (
    <NekoSelect scrolldown value={envId} onChange={setEnvId} style={{ marginLeft: 5 }}>
      {environments.map(x => <NekoOption key={x.id} value={x.id} label={x.name} />)}
    </NekoSelect>
  ), [envId, environments]);

  const jsxPaging = useMemo(() => {
    return (<div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <NekoPaging currentPage={filesQueryParams.page} limit={filesQueryParams.limit}
          total={fileTotal} onClick={page => { setFilesQueryParams(prev => ({ ...prev, page })); }}
        />
      </div>
    </div>);
  }, [ filesQueryParams, fileTotal ]);

  return (<NekoWrapper>    

    <NekoColumn fullWidth minimal style={{ margin: 8 }}>
      
      <NekoTabs inversed currentTab={section}
        onChange={(_index, attributes) => { setSection(attributes.key) }}
        action={
          <>
            <div style={{ flex: 'auto' }} />
            {selectedIds.length > 0 && section === 'files' && <>
              <NekoButton className="danger" disabled={false}
                onClick={() => onDeleteFile(selectedIds)}>
                {i18n.COMMON.DELETE}
              </NekoButton>
            </>}
            {section === 'files' && <NekoButton disabled={busy} busy={busy}
              onClick={onRefreshFiles} className="secondary">
              Refresh
            </NekoButton>}
            {section === 'assistants' && <NekoButton disabled={busy} busy={busy}
              onClick={onRefreshAssistants} className="secondary">
              Refresh
            </NekoButton>}
            {jsxEnvironments}
          </>
        }>
        <NekoTab title={i18n.COMMON.ASSISTANTS} key='assistants'>
          <NekoTable busy={busy}
            data={assistantRows} columns={assistantColumns}
            emptyMessage={i18n.NO_ASSISTANTS_YET}
          />
        </NekoTab>
        <NekoTab title={i18n.COMMON.FILES} key='files'>
          <NekoTable busy={isBusyFiles || busy}
            data={fileRows} columns={fileColumns}
            selectedItems={selectedIds}
            onSelect={ids => { setSelectedIds([ ...selectedIds, ...ids  ]) }}
            onUnselect={ids => { setSelectedIds([ ...selectedIds.filter(x => !ids.includes(x)) ]) }}
            emptyMessage={i18n.NO_FILES_YET}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
            <div style={{ flex: 'auto' }} />
            {jsxPaging}
          </div>
        </NekoTab>
      </NekoTabs>

    </NekoColumn>

    <NekoColumn fullWidth minimal>
      <NekoBlock className="primary">
        <NekoTypo p>{toHTML(i18n.HELP.ASSISTANTS_INTRO)}</NekoTypo>
        <NekoMessage variant="danger">
          {toHTML(i18n.HELP.ASSISTANTS_WARNINGS)}
        </NekoMessage>
      </NekoBlock>

      <NekoSpacer tiny />

      {errorModal && (
        <NekoModal isOpen={!!errorModal}
          title="Error"
          onRequestClose={() => setErrorModal(null)}
          okButton={{
            label: 'Ok',
            onClick: () => setErrorModal(null),
          }}
          content={<p>{errorModal?.message}</p>}
        />
      )}

    </NekoColumn>
  </NekoWrapper>);
};