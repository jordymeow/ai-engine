// Previous: 2.6.3
// Current: 2.8.4

const { useState, useMemo, useEffect } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { nekoStringify } from '@neko-ui';

import { NekoTable, NekoMessage, NekoButton, NekoSelect, NekoOption, NekoWrapper, NekoColumn, NekoIcon,
  NekoTabs, NekoTab, NekoModal, NekoSpacer, NekoBlock, NekoTypo, NekoPaging, useNekoColors } from '@neko-ui';
import i18n from '@root/i18n';

import { deleteFiles, retrieveFiles } from '@app/requests';
import { retrieveAssistants } from '@app/requests';
import { toHTML } from '@app/helpers-admin';

const assistantColumns = [
  {
    accessor: 'name',
    title: 'Name',
    width: '30%',
    verticalAlign: 'top'
  },
  {
    accessor: 'instructions',
    title: 'Instructions',
    width: '40%',
    verticalAlign: 'top'
  },
  {
    accessor: 'parameters',
    title: 'Parameters',
    width: '20%',
    verticalAlign: 'top'
  },
  {
    accessor: 'createdOn',
    title: 'Created On',
    width: '10%',
    verticalAlign: 'top'
  }
];

const fileColumns = [
  {
    accessor: 'file',
    title: 'File',
    width: '30%',
    verticalAlign: 'top'
  },
  {
    accessor: 'metadata',
    title: 'Metadata',
    width: '30%',
    verticalAlign: 'top'
  },
  {
    accessor: 'userId',
    title: 'User ID',
    width: '80px',
    verticalAlign: 'top'
  },
  {
    accessor: 'purpose',
    title: 'Purpose',
    width: '20%',
    verticalAlign: 'top'
  },
  {
    accessor: 'created',
    title: 'Created On',
    width: '20%',
    verticalAlign: 'top'
  },
  {
    accessor: 'actions',
    title: 'Actions',
    width: '60px',
    verticalAlign: 'top'
  }
];

const getLocalSettings = () => {
  const localSettingsJSON = localStorage.getItem('mwai-admin-assistants');
  try {
    return JSON.parse(localSettingsJSON);
  }
  catch (e) {
    return {};
  }
};

const setLocalSettings = ({ envId }) => {
  const settings = {
    envId: envId || null
  };
  localStorage.setItem('mwai-admin-assistants', nekoStringify(settings));
};

const Assistants = ({ options, refreshOptions }) => {
  const queryClient = useQueryClient();
  const [ errorModal, setErrorModal ] = useState(null);
  const [ busyAction, setBusyAction ] = useState(false);
  const [ envId, setEnvId ] = useState(options?.ai_envs?.[0]?.id);
  const [ section, setSection ] = useState('assistants');
  const [ selectedIds, setSelectedIds ] = useState([]);
  const { colors } = useNekoColors();

  const environments = useMemo(() => {
    return options?.ai_envs?.filter(x => x.type === 'openai' || x.type === 'azure') || [];
  }, [options]);
  const environment = useMemo(() => environments.find(x => x.id === envId), [envId, environments]);
  const allAssistants = useMemo(() => environment?.assistants || [], [environment]);

  const [ filesQueryParams, setFilesQueryParams ] = useState({
    userId: null,
    purpose: ['assistant-in', 'assistant-out'],
    metadata: null,
    envId: envId,
    page: 1,
    limit: 10
  });
  const queryParamsChecksum = nekoStringify(filesQueryParams);

  useEffect(() => {
    const localSettings = getLocalSettings();
    const defaultEnvId = localSettings?.envId ?? null;
    if (defaultEnvId) {
      setEnvId(defaultEnvId);
    }
  }, []);

  useEffect(() => {
    setLocalSettings({ envId });
  }, [envId]);

  useEffect(() => {
    setFilesQueryParams({ ...filesQueryParams, envId });
  }, [envId]);

  const { isFetching: isBusyFiles, data: dataFiles } = useQuery({
    queryKey: ['assistants-files', queryParamsChecksum],
    enabled: section === 'files',
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
    if (!dataFiles) return [];
    return dataFiles.files.map(file => ({
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
    try {
      await retrieveAssistants(envId);
      await refreshOptions();
    }
    catch (err) {
      setErrorModal(err);
    }
    setBusyAction(false);
  };

  const onRefreshFiles = async () => {
    await queryClient.invalidateQueries('assistants-files');
  };

  const assistantRows = useMemo(() => {
    return allAssistants.map(assistant => ({
      ...assistant,
      name: <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>{assistant.name}</span>
        <small>{assistant.id}</small>
      </div>,
      instructions: assistant.instructions?.length > 100 ?
        `${assistant.instructions.slice(0, 100)}...` : assistant.instructions,
      parameters: <>
        <ul style={{ margin: 0, padding: 0 }}>
          <li style={{ margin: 0, display: 'flex' }}>
            <NekoIcon icon='check' width={16} color={colors.green} />
            <span style={{ marginLeft: 3 }}>{assistant.model ?? 'Unknown'}</span>
          </li>
          {!assistant.model && <li style={{ margin: 0, display: 'flex', lineHeight: '12px' }}>
            <small>The model could not be found in your AI environment. Please make sure it exists as a deployment, and Refresh the list of Assistants.</small>
          </li>}
          <li style={{ margin: 0, display: 'flex' }}>
            <NekoIcon icon={assistant.has_file_search ? 'check' : 'close'} width={16}
              color={assistant.has_file_search ? colors.green : colors.gray}
            />
            <a style={{ marginLeft: 3 }} href={"https://platform.openai.com/docs/assistants/tools/file-search"}
              target="_blank" rel="noreferrer">File Search</a>
          </li>
          <li style={{ margin: 0, display: 'flex' }}>
            <NekoIcon icon={assistant.has_code_interpreter ? 'check' : 'close'} width={16}
              color={assistant.has_code_interpreter ? colors.green : colors.gray}
            />
            <a style={{ marginLeft: 3 }} href={"https://platform.openai.com/docs/assistants/tools/code-interpreter"}
              target="_blank" rel="noreferrer">Code Interpreter</a>
          </li>
        </ul>
      </>,
      createdOn: new Date(assistant.createdOn).toLocaleDateString()
    }));
  }, [allAssistants, colors.gray, colors.green]);

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
          total={fileTotal} onClick={page => { setFilesQueryParams({ ...filesQueryParams, page }); }}
        />
      </div>
    </div>);
  }, [ filesQueryParams, fileTotal ]);

  return (<NekoWrapper>

    <NekoColumn fullWidth minimal style={{ margin: 8 }}>

      <NekoTabs inversed currentTab={section}
        onChange={(_index, attributes) => { setSection(attributes.key); }}
        action={
          <>
            <div style={{ flex: 'auto' }} />
            {selectedIds.length > 0 && section === 'files' && <>
              <NekoButton className="danger" disabled={false}
                onClick={() => onDeleteFile(selectedIds)}>
                {i18n.COMMON.DELETE}
              </NekoButton>
            </>}
            {section === 'files' && <NekoButton disabled={busy || !environment} busy={busy}
              onClick={onRefreshFiles} className="secondary">
              {i18n.COMMON.REFRESH}
            </NekoButton>}
            {section === 'assistants' && <NekoButton disabled={busy || !environment} busy={busy}
              onClick={onRefreshAssistants} className="secondary">
              {i18n.COMMON.REFRESH}
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
            onSelect={ids => { setSelectedIds([ ...selectedIds, ...ids  ]); }}
            onUnselect={ids => { setSelectedIds([ ...selectedIds.filter(x => !ids.includes(x)) ]); }}
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

export default Assistants;