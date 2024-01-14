// Previous: 2.1.0
// Current: 2.1.5

const { useState, useMemo, useRef, useEffect } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Papa from 'papaparse';

import { NekoTable, NekoPaging , NekoSwitch, NekoContainer, NekoButton, NekoIcon,
  NekoSpacer, NekoInput, NekoSelect, NekoOption, NekoCheckbox, NekoMessage,
  NekoLink, NekoQuickLinks, NekoTheme, NekoModal, NekoTextArea, NekoUploadDropArea } from '@neko-ui';
import { nekoFetch, formatBytes, useNekoColors } from '@neko-ui';
import { apiUrl, restNonce } from '@app/settings';
import { toHTML, useModels } from '@app/helpers-admin';
import DatasetEditor from '@app/screens/finetunes/DatasetsEditor';
import i18n from '@root/i18n';
import { retrieveFilesFromOpenAI, retrieveFineTunes } from '@app/requests';
import { retrieveDeletedFineTunes } from '@app/requests';

const builderColumnsEasy = [
  { accessor: 'row', title: "#", width: 25, verticalAlign: 'top' },
  { accessor: 'question', title: 'Question', verticalAlign: 'top' },
  { accessor: 'answer', title: 'Answer', verticalAlign: 'top' },
  { accessor: 'actions', title: '', width: 36, align: 'center' }
];

const builderColumnsExpert = [
  { accessor: 'row', title: "#", width: 25, verticalAlign: 'top' },
  { accessor: 'messages', title: 'Messages', verticalAlign: 'top' },
  { accessor: 'actions', title: '', width: 68, align: 'top' }
];

const fileColumns = [
  { accessor: 'status', title: 'Status', sortable: true, width: '100px' },
  { accessor: 'id', title: 'ID', width: '120px' },
  { accessor: 'filename', title: 'File' },
  { accessor: 'purpose', title: 'Purpose' },
  { accessor: 'filesize', title: 'Size', sortable: true },
  { accessor: 'createdOn', title: 'Date', sortable: true, width: '80px' },
  { accessor: 'actions', title: '', width: '190px' }
];

const fineTuneColumns = [
  { accessor: 'status', title: 'Status', sortable: true, width: '100px' },
  { accessor: 'id', title: 'ID', width: '120px' },
  { accessor: 'suffix', title: 'Suffix' },
  { accessor: 'model', title: 'Model' },
  { accessor: 'base_model', title: 'Based On', width: '200px' },
  { accessor: 'createdOn', title: 'Date', sortable: true, width: '80px' },
  { accessor: 'actions', title: '' }
];

const StatusIcon = ({ status, includeText = false }) => {
  const { colors } = useNekoColors();
  
  const orange = colors.orange;
  const green = colors.green;
  const red = colors.red;

  let icon = null;
  switch (status) {
  case 'pending':
    icon = <NekoIcon title={status} icon="replay" spinning={true} width={24} color={orange} />;
    break;
  case 'running':
    icon = <NekoIcon title={status} icon="replay" spinning={true} width={24} color={orange} />;
    break;
  case 'succeeded':
    icon = <NekoIcon title={status} icon="check-circle" width={24} color={green} />;
    break;
  case 'processed':
    icon = <NekoIcon title={status} icon="check-circle" width={24} color={green} />;
    break;
  case 'failed':
    icon = <NekoIcon title={status} icon="close" width={24} color={red} />;
    break;
  case 'cancelled':
    icon = <NekoIcon title={status} icon="close" width={24} color={orange} />;
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
};

const EditableText = ({ children, data, onChange = () => {} }) => {
  const [ isEdit, setIsEdit ] = useState(false);

  const onSave = (value) => {
    setIsEdit(false);
    if (value !== data) {
      onChange(value);
    }
  };

  const onKeyPress = (e) => {
    if (e.key === 'Escape') {
      onSave(data);
    }
  };
  if (isEdit) {
    return <div onKeyUp={onKeyPress} style={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
      <NekoTextArea onBlurForce autoFocus fullHeight rows={3} style={{ height: '100%', width: '100%' }}
        onEnter={onSave} onBlur={onSave} value={data} />
      <NekoButton onClick={() => onSave(data)} fullWidth style={{ marginTop: 2, height: 35 }}>Save</NekoButton>
    </div>;
  }

  return <pre style={{ width: '100%', height: '100%', whiteSpace: 'break-spaces',
    margin: 0, padding: 0,
    fontSize: 13, fontFamily: 'inherit' }}
  onClick={() => setIsEdit(true)}>{children}</pre>;
};

const Finetunes = ({ options, updateOption, refreshOptions }) => {
  const { colors } = useNekoColors();
  const queryClient = useQueryClient();
  const [ errorModal, setErrorModal ] = useState(false);
  const [ fileForFineTune, setFileForFineTune ] = useState();
  const [ busyAction, setBusyAction ] = useState(false);
  const [ section, setSection ] = useState('finetunes');
  const [ dataSection, setDataSection ] = useState('editor');
  const [ isModeTrain, setIsModeTrain ] = useState(true);
  const [ modelFilter, setModelFilter ] = useState('current');
  const [ suffix, setSuffix ] = useState('meow');
  const [ hyperParams, setHyperParams ] = useState(false);
  const [ nEpochs, setNEpochs ] = useState(4);
  const [ batchSize, setBatchSize ] = useState(4);
  const [ learningRateMultiplier, setLearningRateMultiplier ] = useState(0.1);
  const [ promptLossWeight, setPromptLossWeight ] = useState(0.01);
  const [ datasetsQueryEnabled, setDatasetsQueryEnabled ] = useState(false);

  const [ envId, setEnvId ] = useState(options?.ai_envs?.[0]?.id);
  const environments = options?.ai_envs || [];
  const environment = useMemo(() => environments?.find(x => x.id === envId), [envId, environments]);
  const deletedFineTunes = environment?.finetunes_deleted || [];
  const allFineTunes = environment?.finetunes || [];
  const { isFetching: isBusyFiles, error: errFiles, data: dataFiles } = useQuery({
    queryKey: ['datasets-' + envId],
    enabled: datasetsQueryEnabled,
    queryFn: () => retrieveFilesFromOpenAI(envId)
  });

  const { models, model, setModel, getModel, isFineTunedModel } = useModels(options, envId);

  const updateEnv = async (option, value) => {
    const newEnvs = environments.map(x => {
      if (x.id === envId) {
        return { ...x, [option]: value };
      }
      return x;
    });
    return updateOption(newEnvs, 'ai_envs');
  };

  const finetunableModels = useMemo(() => {
    return models.filter(x => x.tags?.includes('finetune'));
  }, [models]);

  useEffect(() => {
    if (section === 'files' && !datasetsQueryEnabled) {
      setDatasetsQueryEnabled(true);
    }
  }, [section]);

  useEffect(() => { errFiles && !errorModal && setErrorModal(errFiles); }, [errFiles]);

  const rowsPerPage = 10;
  const [ hasStorageBackup, setHasStorageBackup ] = useState(true);
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ entries, setEntries ] = useState([]);
  const [ expert, setExpert ] = useState(true);
  const [ context, setContext ] = useState('You are Chihiro, an AI Assistant. Your primary objective is to assist website visitors by directing them to the appropriate page or succinctly answering their questions with precision.');
  const [ filename, setFilename ] = useState('');
  const totalRows = useMemo(() => entries.length, [entries]);

  const onDeleteRow = (line) => {
    const newData = entries.filter((x, i) => i !== (line - 1));
    setEntries(newData);
    if (newData.length === 0) {
      updateLocalStorage({ context, entries: [] });
    }
  };

  const EditableMessages = ({ messages, currentRow, onUpdateDataRow, onDeleteDataRow }) => {
    return <>
      {messages.map((x, messageRow) => <div key={messageRow} style={{ display: 'flex' }}>
        <NekoButton rounded icon="trash" onClick={() => onDeleteDataRow(currentRow, messageRow + 1)} />
        <div style={{ width: 120, paddingLeft: 5, paddingTop: 0, paddingBottom: 4, marginRight: 10 }}>
          <NekoSelect scrolldown name="role" value={x.role} style={{ width: 120 }}
            onChange={value => onUpdateDataRow(currentRow, value, x.content, messageRow + 1)}>
            <NekoOption value='assistant' label="Assistant" />
            <NekoOption value='user' label="User" />
            <NekoOption value='system' label="System" />
          </NekoSelect>
        </div>
        <EditableText data={x.content} style={{ flex: 'auto' }}
          onChange={value => onUpdateDataRow(currentRow, x.role, value, messageRow + 1)}>
          {x.content}
        </EditableText>
      </div>)}
    </>;
  };

  const refreshFiles = async () => {
    await queryClient.invalidateQueries('datasets');
  };

  const onRefreshFiles = async () => {
    setBusyAction(true);
    await refreshFiles();
    setBusyAction(false);
  };

  const onStartFineTune = async () => {
    const currentFile = fileForFineTune;
    const currentSuffix = suffix;

    const rawModel = getModel(model);
    setBusyAction(true);
    const isFineTuned = isFineTunedModel(model);

    let json = {
      envId: envId,
      fileId: currentFile,
      model: isFineTuned ? rawModel.model : rawModel.family,
      suffix: currentSuffix
    };
    if (hyperParams) {
      json = { ...json, nEpochs, batchSize, learningRateMultiplier, promptLossWeight };
    }

    try {
      const res = await nekoFetch(`${apiUrl}/openai/files/finetune`, {
        method: 'POST',
        nonce: restNonce,
        json: json
      });
      if (res.success) {
        onRefreshFineTunes();
        alert(i18n.ALERTS.FINETUNING_STARTED);
        setSection('finetunes');
        setFileForFineTune();
      }
      else {
        alert(res.message);
      }
    }
    catch (err) {
      console.log(err.message);
      alert(err.message);
    }
    setBusyAction(false);
  };

  const onRefreshFineTunes = async () => {
    setBusyAction('finetunes');
    if (!allFineTunes.length) {
      await retrieveDeletedFineTunes(envId);
    }
    else {
      await retrieveFineTunes(envId);
    }
    await refreshOptions();
    setBusyAction(false);
  };

  const onCleanFineTunes = async () => {
    setBusyAction('clean');
    await retrieveDeletedFineTunes(envId);
    await refreshOptions();
    setBusyAction(false);
  };

  const resetFilename = () => {
    const now = new Date();
    let prefix = now.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
    prefix = prefix.replace(/\//g, '.');
    prefix += '-' + now.getHours().toString().padStart(2, '0') + '.' + now.getMinutes().toString().padStart(2, '0');
    setFilename(`MEOW-${prefix}.jsonl`);
  };

  const onResetBuilder = (askForConfirmation = true) => {
    if (askForConfirmation && !confirm(i18n.ALERTS.RESET_BUILDER)) {
      return;
    }
    setEntries([]);
    updateLocalStorage({ context: context, entries: [] });
  };

  useEffect(() => {
    if (!entries || entries.length === 0) {
      const data = localStorage.getItem('mwai_builder_data_v2');
      if (data) {
        const freshData = JSON.parse(data);
        setEntries(freshData.entries);
        if (freshData.context) {
          setContext(freshData.context);
        }
      }
    }
  }, []);

  const fixContextInEntries = (value) => {
    let shouldReplace = false;
    for (let i = 0; i < entries.length; i++) {
      const currentEntry = entries[i];
      if (currentEntry.messages && currentEntry.messages.length > 0) {
        if (currentEntry.messages[0].role === 'system') {
          if (currentEntry.messages[0].content !== value) {
            if (!shouldReplace) {
              if (confirm("The context in your data does not match the one in your entries. Do you want to replace it for every entries?")) {
                shouldReplace = true;
              }
              else {
                return;
              }
            }
            const newData = [...entries];
            newData[i].messages[0].content = value;
            setEntries(() => newData);
          }
        }
      }
    }
  };

  const updateContext = (value) => {
    setContext(value);
    fixContextInEntries(value);
  };

  const updateLocalStorage = (data) => {
    resetFilename();
    try {
      if (!data) {
        localStorage.removeItem('mwai_builder_data_v2');
      }
      else {
        localStorage.setItem('mwai_builder_data_v2', JSON.stringify(data));
      }
      setHasStorageBackup(true);
    }
    catch (err) {
      localStorage.removeItem('mwai_builder_data_v2');
      setHasStorageBackup(false);
    }
  };

  useEffect(() => {
    if (entries && entries?.length > 0) {
      updateLocalStorage({ context: context, entries });
    }
  }, [entries]);

  useEffect(() => {
    if (context && context?.length > 0) {
      updateLocalStorage({ context: context, entries });
    }
  }, [context]);

  const onDeleteDataRow = (row, messageRow) => {
    const updatedEntries = [...entries];
    if (updatedEntries[row - 1]?.messages) {
      updatedEntries[row - 1].messages.splice(messageRow - 1, 1);
      setEntries(updatedEntries);
    }
  };

  const onUpdateDataRow = (row, role, content, messageRow = null) => {
    const newData = entries.map((x, i) => {
      if (i === (row - 1)) {
        if (messageRow !== null) {
          return { ...x, messages: x.messages.map((y, j) => {
            if (j === (messageRow - 1)) { return { ...y, role, content }; }
            return y; 
          })};
        }
        else if (role === 'assistant') {
          return { ...x, messages: x.messages.map(y => {
            if (y.role === 'assistant') { return { ...y, content }; }
            return y;
          })};
        }
        else if (role === 'user') {
          return { ...x, messages: x.messages.map(y => {
            if (y.role === 'user') { return { ...y, content }; }
            return y;
          })};
        }
      }
      return x;
    });
    setEntries(newData);
  };

  const builderRows = useMemo(() => {
    let row = (currentPage - 1) * rowsPerPage;
    const chunkOfBuilderData = entries?.slice((currentPage - 1) * rowsPerPage,
      ((currentPage - 1) * rowsPerPage) + rowsPerPage);

    return chunkOfBuilderData?.map(x => {
      const currentRow = ++row;

      let question = "";
      let answer = "";
      let messages = [];

      if (!expert) {
        const potentialQuestion = x.messages.find(x => x.role === 'user');
        if (potentialQuestion) {
          question = potentialQuestion.content;
        }
        const potentialAnswer = x.messages.find(x => x.role === 'assistant');
        if (potentialAnswer) {
          answer = potentialAnswer.content;
        }
      }
      else {
        messages = x.messages;
      }

      return {
        row: currentRow,
        messages: <EditableMessages
          messages={messages}
          currentRow={currentRow}
          onUpdateDataRow={onUpdateDataRow}
          onDeleteDataRow={onDeleteDataRow}
        />,
        question: 
          <EditableText data={question} onChange={value => onUpdateDataRow(currentRow, 'user', value)}>
            {question}
          </EditableText>,
        answer: 
          <EditableText data={answer} onChange={value => onUpdateDataRow(currentRow, 'assistant', value)}>
            {answer}
          </EditableText>,
        actions: 
        <>
          {expert && <NekoButton rounded icon="plus" onClick={() => addMessage(currentRow)} />}
          <NekoButton rounded icon="trash" onClick={() => onDeleteRow(currentRow)} />
        </>
      };
    });
  }, [entries, currentPage, rowsPerPage, expert, onUpdateDataRow, onDeleteDataRow]);

  const deleteFile = async (fileId) => {
    setBusyAction(true);
    try {
      const res = await nekoFetch(`${apiUrl}/openai/files/delete`, { method: 'POST', nonce: restNonce, 
        json: { envId: envId, fileId }
      });
      if (res.success) {
        await refreshFiles();
      }
      else {
        alert(res.message);
      }
    }
    catch (err) {
      console.error(err);
      alert(i18n.ALERTS.CHECK_CONSOLE);
    }
    setBusyAction(false);
  };

  const cancelFineTune = async (finetuneId) => {
    setBusyAction(true);
    try {
      const res = await nekoFetch(`${apiUrl}/openai/finetunes/cancel`, { 
        method: 'POST', nonce: restNonce, json: { envId: envId, finetuneId }
      });
      if (res.success) {
        onRefreshFineTunes();
      }
      else {
        alert(res.message);
      }
    }
    catch (err) {
      console.error(err);
      alert(i18n.ALERTS.CHECK_CONSOLE);
    }
    setBusyAction(false);
  };

  const removeFineTune = async (modelId) => {
    if (!confirm(i18n.ALERTS.DELETE_FINETUNE)) {
      return;
    }
    setBusyAction(true);
    try {
      await updateEnv('finetunes_deleted', [...deletedFineTunes, modelId]);
    }
    catch (err) {
      console.error(err);
      alert(i18n.ALERTS.CHECK_CONSOLE);
    }
    setBusyAction(false);
  };

  const deleteFineTune = async (modelId) => {
    if (!confirm(i18n.ALERTS.DELETE_FINETUNE)) {
      return;
    }
    setBusyAction(true);
    try {
      const res = await nekoFetch(`${apiUrl}/openai/finetunes/delete`, { method: 'POST', nonce: restNonce,
        json: { envId: envId, modelId }
      });
      if (res.success) {
        await updateEnv('finetunes_deleted', [...deletedFineTunes, modelId]);
      }
      else {
        if (res.message.indexOf('does not exist') > -1) {
          alert(i18n.ALERTS.FINETUNE_ALREADY_DELETED);
          await updateEnv('finetunes_deleted', [...deletedFineTunes, modelId]);
        }
        else {
          alert(res.message);
        }
      }
    }
    catch (err) {
      console.error(err);
      alert(i18n.ALERTS.CHECK_CONSOLE);
    }
    setBusyAction(false);
  };

  const downloadFile = async (fileId, filename) => {
    setBusyAction(true);
    try {
      const res = await nekoFetch(`${apiUrl}/openai/files/download`, { method: 'POST', nonce: restNonce,
        json: { envId: envId, fileId }
      });
      if (res.success) {
        const blob = new Blob([res.data], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      else {
        alert(res.message);
      }
    }
    catch (err) {
      console.error(err);
      alert(i18n.ALERTS.CHECK_CONSOLE);
    }
    setBusyAction(false);
  };

  const fileRows = useMemo(() => {
    return dataFiles?.sort((a, b) => b.created_at - a.created_at).map(x => {
      const currentId = x.id;
      const currentFilename = x.filename;
      const createdOn = new Date(x.created_at * 1000);
      const forFineTune = x.purpose === 'fine-tune';
      return {
        status: <StatusIcon status={(x.status)} includeText />,
        id: currentId,
        filename: currentFilename,
        purpose: x.purpose,
        filesize: formatBytes(x.bytes),
        createdOn: <>{createdOn.toLocaleDateString()}<br />{createdOn.toLocaleTimeString()}</>,
        actions: <>
          <NekoButton disabled={!forFineTune} icon="wand"
            onClick={() => setFileForFineTune(currentId)}>
            Train Model
          </NekoButton>
          <NekoButton rounded icon="arrow-down"
            onClick={() => downloadFile(currentId, currentFilename)} />
          <NekoButton className="danger" rounded icon="trash"
            onClick={() => deleteFile(currentId)} />
        </>
      };
    });
  }, [dataFiles]);

  const isDeleted = (x) => {
    return deletedFineTunes.includes(x.model) || deletedFineTunes.includes(x.id);
  };

  const isFailed = (x) => {
    return x.status === 'failed' || x.status === 'cancelled';
  };

  const isCurrent = (x) => {
    return !isFailed(x) && !isDeleted(x);
  };

  const fineTuneRows = useMemo(() => {
    if (!allFineTunes) { return []; }

    let filteredFineTunes = allFineTunes;
    if (modelFilter === 'current') {
      filteredFineTunes = filteredFineTunes.filter(isCurrent);
    }
    else if (modelFilter === 'deleted') {
      filteredFineTunes = filteredFineTunes.filter(isDeleted);
    }
    else if (modelFilter === 'failed') {
      filteredFineTunes = filteredFineTunes.filter(isFailed);
    }

    return filteredFineTunes.map(x => {
      const createdOn = new Date(x.createdOn);
      return {
        ...x,
        status: <StatusIcon status={(x.status)} includeText />,
        createdOn: <>{createdOn.toLocaleDateString()}<br />{createdOn.toLocaleTimeString()}</>,
        actions:  <>
          {x.status === 'succeeded' && <NekoButton className="danger" rounded icon="trash"
            onClick={() => deleteFineTune(x.model)}>
          </NekoButton>}
          {x.status === 'cancelled' && <NekoButton className="danger" rounded icon="trash"
            onClick={() => removeFineTune(x.id)}>
          </NekoButton>}
          {x.status === 'failed' && <NekoButton className="danger" rounded icon="trash"
            onClick={() => removeFineTune(x.id)}>
          </NekoButton>}
          {x.status === 'pending' && <NekoButton className="danger" rounded icon="close"
            onClick={() => cancelFineTune(x.id)}>
          </NekoButton>}
        </>
      };
    });
  }, [modelFilter, deletedFineTunes, allFineTunes]);

  const busy = isBusyFiles || busyAction;

  const exportAsJSON = () => {
    const json = JSON.stringify(entries, null, 2);
    const blob = new Blob([json], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date();
    const filename = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-WP.json`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onUploadDataSet = async () => {
    setBusyAction(true);
    try {
      const data = entries.map(x => {
        const json = JSON.stringify(x);
        return json;
      }).join("\n");
      const res = await nekoFetch(`${apiUrl}/openai/files/upload`, { method: 'POST', nonce: restNonce, 
        json: { envId: envId, filename, data }
      });
      await refreshFiles();
      if (res.success) {
        onResetBuilder(false);
        alert(i18n.ALERTS.DATASET_UPLOADED);
        setSection('files');
        setIsModeTrain(true);
      }
      else {
        alert(res.message);
      }
    }
    catch (err) {
      console.error(err);
      alert(i18n.ALERTS.CHECK_CONSOLE);
    }
    setBusyAction(false);
  };

  const modelNamePreview = useMemo(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1; 
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const rawModel = getModel(model);
    return `${rawModel?.family}:ft-your-org:${suffix}-${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}-${hours < 10 ? '0' + hours : hours}-${minutes < 10 ? '0' + minutes : minutes}-${seconds < 10 ? '0' + seconds : seconds}`;
  }, [suffix, model]);

  const onSelectFiles = async (files) => {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const isJson = file.name.endsWith('.json');
      const isJsonl = file.name.endsWith('.jsonl');
      const isCsv = file.name.endsWith('.csv');
      let isMigration = false;
      if (!isJson && !isJsonl && !isCsv) {
        alert(i18n.ALERTS.ONLY_SUPPORTS_FILES);
        console.warn(file);
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
              console.error(e, x);
              return null;
            }
          });
          const hasMessages = data.every(x => x.messages);
          if (!hasMessages) {
            isMigration = true;
          }
        }
        else if (isCsv) {
          const resParse = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
          data = resParse.data;
          console.log('The CSV was loaded!', data);
          isMigration = true;
        }

        if (isMigration) {
          data = data.map(x => {
            const values = Object.keys(x).reduce((acc, key) => {
              acc[key.toLowerCase()] = x[key];
              return acc;
            }, {});
            isMigration = true;
            const promptColumns = ['prompt', 'question', 'q'];
            const completionColumns = ['completion', 'reply', 'a'];
            const promptKey = promptColumns.find(x => values[x]);
            const completionKey = completionColumns.find(x => values[x]);
            const promptValue = values[promptKey];
            const completionValue = values[completionKey];
            const completionValueClean = completionValue?.replace(/\n\n$/g, '');
            const promptValueClean = promptValue?.replace(/\n\n###\n\n$/g, '');
            
            if (!promptValue || !completionValue) {
              return null;
            }

            return {
              messages: [{
                role: 'system',
                content: context,
              }, {
                role: 'user',
                content: promptValueClean.trim(),
              }, {
                role: 'assistant',
                content: completionValueClean.trim(),
              }],
            };
          });
        }
        data = data.filter(x => x);
        const hasMessages = data.every(x => x?.messages);
        if (!hasMessages) {
          alert(i18n.ALERTS.ONLY_SUPPORTS_FILES);
          return;
        }
        setEntries(data);
      };
      reader.readAsText(file);
    }
  };

  const addRow = (question = 'Question?', answer = 'Answer.') => {
    setEntries([...entries, { messages: [{
      role: 'system',
      content: context,
    }, {
      role: 'user',
      content: question,
    }, {
      role: 'assistant',
      content: answer,
    }]
    }]);
  };

  const addMessage = (line, role = 'user', content = 'Hello!') => {
    const newData = entries.map((x, i) => {
      if (i === (line - 1)) {
        return { ...x, messages: [...x.messages, { role, content }] };
      }
      return x;
    });
    setEntries(newData);
  };

  const ref = useRef(null);
  const currentModelsCount = allFineTunes?.filter(isCurrent).length;
  const failedModelsCount = allFineTunes?.filter(isFailed).length;
  const deletedModelsCount = allFineTunes?.filter(isDeleted).length;

  const jsxEnvironments = useMemo(() => {
    return (<NekoSelect scrolldown value={envId} onChange={setEnvId} style={{ marginRight: 5 }}>
      {environments.filter(x => x.type === 'openai').map(x => <NekoOption key={x.id} value={x.id} label={x.name} />)}
    </NekoSelect>);
  }, [envId, environments]);

  return (<>
    <NekoContainer style={{ margin: '10px 10px 25px 10px' }} contentStyle={{ padding: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <NekoSwitch style={{ marginRight: 10 }}
          onLabel={i18n.FINETUNING.DATASET_EDITOR} offLabel={i18n.FINETUNING.MODELS_DATASETS} width={165}
          onBackgroundColor={colors.purple} offBackgroundColor={colors.green}
          onChange={(val) => { setIsModeTrain(!val); }} checked={!isModeTrain}
        />
        {isModeTrain && <NekoQuickLinks value={section} busy={busy}
          onChange={value => { setSection(value); }}>
          <NekoLink title={i18n.COMMON.MODELS} value='finetunes' count={fineTuneRows?.length ?? '-'} />
          <NekoLink title={i18n.COMMON.DATASETS} value='files' count={fileRows?.length ?? '-'} />
        </NekoQuickLinks>}
        {isModeTrain && section === 'finetunes' && <>
          <div style={{ flex: 'auto' }} />
          {jsxEnvironments}
          <NekoButton disabled={busyAction} busy={busyAction === 'finetunes'}
            onClick={onRefreshFineTunes} className="primary">
            {i18n.COMMON.REFRESH_MODELS}
          </NekoButton>
        </>}
        {isModeTrain && section === 'files' && <>
          <div style={{ flex: 'auto' }} />
          {jsxEnvironments}
          <NekoButton disabled={busyAction} onClick={onRefreshFiles} className="primary">
            Refresh Datasets
          </NekoButton>
        </>}
        {!isModeTrain && <div style={{ display: 'flex', alignItems: 'center', flex: 'auto' }}>
          <NekoQuickLinks value={dataSection} onChange={value => { setDataSection(value); }}>
            <NekoLink title={i18n.FINETUNING.ENTRIES_EDITOR} value='editor' count={entries?.length ?? null} />
            <NekoLink title={i18n.FINETUNING.ENTRIES_GENERATOR} value='generator' />
          </NekoQuickLinks>
          <div style={{ flex: 'auto' }} />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ marginRight: 10 }}>Filename:</label>
            <NekoInput disabled={!totalRows || busyAction} value={totalRows ? filename : ''}
              onChange={setFilename} style={{ width: 220, marginRight: 5 }} />
            {jsxEnvironments}
            <NekoButton disabled={!totalRows || busyAction} icon="upload"
              onClick={onUploadDataSet} className="primary">
              Upload to OpenAI
            </NekoButton>
          </div>
        </div>}
      </div>
    </NekoContainer>

    <NekoContainer style={{ margin: 10 }}>
      {isModeTrain && section === 'finetunes' && <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>{toHTML(i18n.FINETUNING.MODELS_INTRO)}</div>
          <NekoQuickLinks value={modelFilter} onChange={value => { setModelFilter(value); }}>
            <NekoLink title="Current" value='current' count={currentModelsCount ?? '-'} />
            <NekoLink title="Failed" value='failed' count={failedModelsCount ?? '-'} />
            <NekoLink title="Deleted" value='deleted' count={deletedModelsCount ?? '-'} />
          </NekoQuickLinks>
        </div>
        <NekoSpacer />
        <NekoTable busy={busy}
          data={fineTuneRows} columns={fineTuneColumns} 
          emptyMessage={i18n.FINETUNING.NO_FINETUNES_YET}
        />
        <div style={{ marginTop: 5, display: 'flex', justifyContent: 'end', lineHeight: '12px',
          alignItems: 'center' }}>
          <NekoButton small disabled={busyAction} busy={busyAction === 'clean'}
            onClick={onCleanFineTunes} className="primary">
            {i18n.FINETUNING.CLEAN_MODELS_LIST}
          </NekoButton>
          <small style={{ marginLeft: 5 }}>{i18n.FINETUNING.DELETED_FINETUNE_ISSUE}</small>
        </div>
      </>}

      {isModeTrain && section === 'files' && <>
        <p>{toHTML(i18n.FINETUNING.DATASETS_INTRO)}</p>
        <NekoTable busy={busy}
          data={fileRows} columns={fileColumns} 
          emptyMessage={<>You do not have any dataset files yet.</>}
        />
      </>}

      {!isModeTrain && dataSection === 'generator' && <>
        <DatasetEditor options={options} setMessages={setEntries} />
      </>}

      {!isModeTrain && dataSection === 'editor' && <>
        {!hasStorageBackup && <p style={{ color: NekoTheme.red }}>{i18n.FINETUNING.HUGE_DATASET_WARNING}</p>}
        <div style={{ display: 'flex' }}>
          <NekoButton icon="plus" onClick={() => addRow()}>Add Entry</NekoButton>
          <NekoSwitch style={{ marginLeft: 10 }}
            onLabel={"Expert"} offLabel={"Easy"} width={90}
            onBackgroundColor={colors.purple} offBackgroundColor={colors.green}
            onChange={setExpert} checked={expert}
          />
          <div style={{ flex: 'auto' }} />
          <NekoUploadDropArea ref={ref} onSelectFiles={onSelectFiles} accept={''} style={{ paddingLeft: 5 }}>
            <NekoButton className="secondary" onClick={() => ref.current.click() }>
              Import
            </NekoButton>
          </NekoUploadDropArea>
        </div>
      </>}

      {!isModeTrain && <>
        <NekoSpacer />
        <NekoTable busy={busyAction}
          data={builderRows} columns={expert ? builderColumnsExpert : builderColumnsEasy}
          emptyMessage={<>You can import a file, or create manually each entry by clicking <b>Add</b>.</>}
        />
        <NekoSpacer />
        {!expert && dataSection === 'editor' && <>
          <div className="mwai-builder-col">
            <label>{i18n.COMMON.CONTEXT}:</label>
            <NekoTextArea id="context" name="context" rows={2}
              description={i18n.FINETUNING.CONTEXT_DESCRIPTION}
              value={context} onBlur={updateContext} onEnter={updateContext}
            />
          </div>
          <NekoSpacer />
        </>}
        <div style={{ display: 'flex' }}>
          <NekoButton disabled={!totalRows} onClick={onResetBuilder} className="danger">
            Reset Entries
          </NekoButton>
          <div style={{ flex: 'auto' }} />
          <NekoPaging currentPage={currentPage} limit={rowsPerPage} total={totalRows}
            onCurrentPageChanged={setCurrentPage} onClick={setCurrentPage} />
          <NekoButton disabled={!totalRows} style={{ marginLeft: 5 }} onClick={exportAsJSON}>
            Export as JSON
          </NekoButton>
        </div>
        <NekoSpacer height={40} line={true} style={{ marginBottom: 0 }} />

        {dataSection === 'generator' && <NekoMessage variant="danger" style={{ marginTop: 0, marginBottom: 25 }}>
          Use this feature with caution. The AI will generate questions and answers for each of your post based on the given prompt, and they will be added to your dataset. Keep in mind that this process may be <u>extremely slow</u> and require a <u>significant number of API calls</u>, resulting in a costs (the tokens count is displayed next to the progress bar). Also, please note that for now, for some reason, the model doesn't seem to provide as many questions as we ask (contrary to ChatGPT).
        </NekoMessage>}

        {dataSection === 'editor' && <>
          <p>
            You can create your dataset by importing a file (two columns, in the CSV, JSON or JSONL format) or manually by clicking <b>Add Entry</b>. To avoid losing your work, this data is kept in your browser's local storage. <b>This is actually complex, so learn how to write datasets by studying <a href="https://beta.openai.com/docs/guides/fine-tuning/conditional-generation" target="_blank" rel="noreferrer">case studies</a>. Please also check my <a href="https://meowapps.com/wordpress-chatbot-finetuned-model-ai/" target="_blank" rel="noreferrer">simplified tutorial</a>.</b> Is your dataset ready? Modify the filename to your liking and click <b>Upload to OpenAI</b>! 😎
          </p>
        </>}
      </>}

      <NekoModal isOpen={errorModal}
        title="Error"
        onRequestClose={() => setErrorModal()}
        okButton={{
          label: 'Ok',
          onClick: () => setErrorModal(),
        }}
        content={<>
          <p>{errorModal?.message}</p>
        </>}
      />

      <NekoModal isOpen={fileForFineTune}
        title="Train a new model"
        onRequestClose={() => setFileForFineTune()}
        okButton={{
          label: 'Start',
          disabled: busyAction,
          onClick: onStartFineTune,
        }}
        cancelButton={{
          label: 'Close',
          disabled: busyAction,
          onClick: () => setFileForFineTune(),
        }}
        content={<>
          <p>
            Exciting! 🎵 You are about to create your own new model, based on your dataset. You simply need to select a base model, and optionally, to modify the <a href="https://beta.openai.com/docs/guides/fine-tuning/hyperparameters" target="_blank" rel="noreferrer">hyperparameters</a>. Before starting the process, make sure that:
          </p>
          <ul>
            <li>✅ The dataset is well-defined.</li>
            <li>✅ You understand <a href="https://openai.com/api/pricing/#faq-fine-tuning-pricing-calculation" target="_blank" rel="noreferrer">OpenAI pricing</a> about fine-tuning.</li>
          </ul>
          <label>Base model:</label>
          <NekoSpacer height={5} />
          <NekoSelect value={model} scrolldown={true} onChange={setModel}>
            {finetunableModels.map((x) => (
              <NekoOption key={x.model} value={x.model} label={x.name}></NekoOption>
            ))}
          </NekoSelect>
          <NekoSpacer height={5} />
          <small>For now, the hyperparameters can't be modified - they are set automatically by OpenAI.</small>
          <NekoSpacer height={10} />
          <label>Suffix (for new model name):</label>
          <NekoSpacer height={5} />
          <NekoInput value={suffix} onChange={setSuffix} />
          <NekoSpacer height={5} />
          <small>The name of the new model name will be decided by OpenAI. You can customize it a bit with this <a href="https://beta.openai.com/docs/api-reference/fine-tunes/list#fine-tunes/create-suffix" target="_blank" rel="noreferrer">prefix</a>. Preview: <b>{modelNamePreview}</b>.</small>
          <NekoSpacer line height={20} />
          <NekoCheckbox label="Enable HyperParams" checked={hyperParams} onChange={setHyperParams} />
          {hyperParams && <>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <label style={{ marginRight: 5 }}>Number of Epochs:</label>
              <NekoInput style={{ marginRight: 5 }} value={nEpochs} onChange={setNEpochs} type="number" />
              <label style={{ marginRight: 5 }}>Batch Size:</label>
              <NekoInput value={batchSize} onChange={setBatchSize} type="number" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <label style={{ marginRight: 5 }}>Learning Rate Multiplier:</label>
              <NekoInput style={{ marginRight: 5 }} value={learningRateMultiplier}
                onChange={setLearningRateMultiplier} type="number" />
              <label style={{ marginRight: 5 }}>Prompt Loss Weight:</label>
              <NekoInput value={promptLossWeight} onChange={setPromptLossWeight} type="number" />
            </div>
          </>}
        </>
        }
      />
    </NekoContainer>
  </>);
};