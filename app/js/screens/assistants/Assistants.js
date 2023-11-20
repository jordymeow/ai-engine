// Previous: none
// Current: 2.0.0

// React & Vendor Libs
import { useState, useMemo, useEffect } from 'react';

// NekoUI Components
import { NekoTable, NekoMessage, NekoButton, NekoSelect, NekoOption, NekoWrapper, NekoColumn,
  NekoModal, NekoSpacer, NekoBlock, NekoTypo } from '@neko-ui';
import i18n from '@root/i18n';
import { retrieveAssistants } from '@app/requests';
import { toHTML } from '@app/helpers-admin';

const assistantColumns = [
  {
    accessor: 'name', 
    title: 'Name', 
    verticalAlign: 'top'
  },
  {
    accessor: 'model', 
    title: 'Model', 
    verticalAlign: 'top'
  },
  {
    accessor: 'createdOn', 
    title: 'Created On', 
    verticalAlign: 'top'
  },
  {
    accessor: 'actions', 
    title: '', 
    width: 36, 
    align: 'center',
  },
];

const Assistants = ({ options, refreshOptions }) => {
  const [ errorModal, setErrorModal ] = useState(null);
  const [ busyAction, setBusyAction ] = useState(false);
  const [ envId, setEnvId ] = useState(options?.ai_envs?.[0]?.id);
  const environments = options?.ai_envs || [];
  const [ modelFilter, setModelFilter ] = useState('all');

  const environment = useMemo(() => environments.find(x => x.id === envId), [envId, environments]);
  const deletedAssistants = environment?.assistants_deleted || [];
  const allAssistants = environment?.assistants || [];

  const fetchAssistants = async () => {
    setBusyAction(true);
    await retrieveAssistants(envId);
    await refreshOptions();
    setBusyAction(false);
  };

  const onRefreshAssistants = () => {
    fetchAssistants();
  };

  const isDeleted = (assistant) => deletedAssistants.includes(assistant.id);

  const assistantRows = useMemo(() => {
    let filteredAssistants = allAssistants;
    if (modelFilter === 'deleted') {
      filteredAssistants = filteredAssistants.filter(isDeleted);
    }

    return filteredAssistants.map(assistant => ({
      ...assistant,
      name: assistant.name || assistant.id,
      createdOn: new Date(assistant.createdOn).toLocaleDateString()
    }));
  }, [modelFilter, deletedAssistants, allAssistants]);

  const busy = busyAction;

  const jsxEnvironments = useMemo(() => (
    <NekoSelect scrolldown value={envId} onChange={(value) => {
      setEnvId(value);
    }} style={{ marginRight: 5 }}>
      {environments.map(x => <NekoOption key={x.id} value={x.id} label={x.name} />)}
    </NekoSelect>
  ), [envId, environments]);

  useEffect(() => {
    if (!envId && environments.length > 0) {
      setEnvId(environments[0].id);
    }
  }, [environments]);

  return (<NekoWrapper>    
    <NekoColumn fullWidth minimal >

      <NekoBlock title="Assistants" className="primary"
        action={<>
          <div style={{ flex: 'auto' }} />
          {jsxEnvironments}
          <NekoButton disabled={busy} busy={busy}
            onClick={onRefreshAssistants} className="secondary">
            Refresh Assistants
          </NekoButton>
        </>}
      >

        <NekoTypo p>{toHTML(i18n.HELP.ASSISTANTS_INTRO)}</NekoTypo>

        <NekoTable busy={busy}
          data={assistantRows} columns={assistantColumns}
          emptyMessage={i18n.NO_ASSISTANTS_YET}
        />

        <NekoSpacer />

        <NekoMessage variant="danger">
          {toHTML(i18n.HELP.ASSISTANTS_WARNINGS)}
        </NekoMessage>

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
      </NekoBlock>

      <NekoSpacer tiny />

    </NekoColumn>
  </NekoWrapper>);
};

export default Assistants;