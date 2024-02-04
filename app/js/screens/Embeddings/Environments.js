// Previous: 2.1.6
// Current: 2.1.7

import { NekoTypo, NekoTabs, NekoTab, NekoButton, NekoSettings, NekoInput, NekoSpacer,
  NekoCollapsableCategories, NekoCollapsableCategory, NekoCheckbox,
  NekoSelect, NekoOption, NekoMessage } from '@neko-ui';
import i18n from '@root/i18n';
import { useModels, toHTML } from '@app/helpers-admin';

const EnvironmentDetails = ({ env, updateEnvironment, ai_envs, options }) => {
  const { embeddingsModels } = useModels(options, env?.ai_embeddings_env);
  const handleUpdateEnv = (field, value) => {
    updateEnvironment(env.id, { [field]: value });
  };
  return (
    <>
      <NekoSettings title={i18n.COMMON.NAME}>
        <NekoInput name="name" value={env.name}
          onFinalChange={value => handleUpdateEnv('name', value)}
        />
      </NekoSettings>
      
      <NekoSettings title={i18n.COMMON.TYPE}>
        <NekoSelect scrolldown name="type" value={env.type}
          description={env.type === 'qdrant' ? toHTML(i18n.HELP.QDRANT) : null}
          onChange={value => handleUpdateEnv('type', value)}>
          <NekoOption value="pinecone" label="Pinecone" />
          <NekoOption value="qdrant" label="Qdrant" />
        </NekoSelect>
      </NekoSettings>
      
      <NekoSettings title={i18n.COMMON.API_KEY}>
        <NekoInput  name="apikey" value={env.apikey}
          description={toHTML(env.type === 'pinecone' ? i18n.COMMON.PINECONE_APIKEY_HELP :
            i18n.COMMON.QDRANT_APIKEY_HELP)}
          onFinalChange={value => handleUpdateEnv('apikey', value)} 
        />
      </NekoSettings>
      
      <NekoSettings title={i18n.COMMON.SERVER}>
        {env.type === 'pinecone' && 
        <NekoSelect scrolldown name="server" value={env.server} 
          description={toHTML(i18n.COMMON.PINECONE_SERVER_HELP)}
          onChange={value => handleUpdateEnv('server', value)}>
          <NekoOption value="gcp-starter" label="gcp-starter"
            description={toHTML(i18n.EMBEDDINGS.NO_NAMESPACE_SUPPORT)}
          />
          <NekoOption value="us-east1-gcp" label="us-east1-gcp" />
          <NekoOption value="us-east4-gcp" label="us-east4-gcp" />
          <NekoOption value="us-west1-gcp" label="us-west1-gcp" />
          <NekoOption value="us-west1-gcp-free" label="us-west1-gcp-free" />
          <NekoOption value="us-west4-gcp" label="us-west4-gcp" />
          <NekoOption value="us-west4-gcp-free" label="us-west4-gcp-free" />
          <NekoOption value="us-east-1-aws" label="us-east-1-aws" />
          <NekoOption value="us-west-1-aws" label="us-west-1-aws" />
          <NekoOption value="us-west-2-aws" label="us-west-2-aws" />
          <NekoOption value="us-central1-gcp" label="us-central1-gcp" />
          <NekoOption value="northamerica-northeast1-gcp" label="northamerica-northeast1-gcp" />
          <NekoOption value="eu-west1-gcp" label="eu-west1-gcp" />
          <NekoOption value="eu-west4-gcp" label="eu-west4-gcp" />
          <NekoOption value="asia-northeast1-gcp" label="asia-northeast1-gcp" />
          <NekoOption value="asia-southeast1-gcp-free" label="asia-southeast1-gcp-free" />
          <NekoOption value="eastus-azure" label="eastus-azure" />
        </NekoSelect>}
        {env.type === 'qdrant' &&
        <NekoInput name="server" value={env.server} 
          description={toHTML(i18n.COMMON.QDRANT_SERVER_HELP)}
          onFinalChange={value => handleUpdateEnv('server', value)}
        />}
      </NekoSettings>

      {env.type === 'pinecone' && <NekoSettings title={i18n.COMMON.NAMESPACES}>
        <NekoInput isCommaSeparatedArray name="namespaces" value={env.namespaces}
          disabled={env.server === 'gcp-starter'}
          description={toHTML(i18n.COMMON.NAMESPACES_HELP)}
          onFinalChange={value => {
            handleUpdateEnv('namespaces', value);
          }} />
      </NekoSettings>}

      {env?.indexes?.length === 0 && (
        <>
        <NekoMessage variant="danger">
          Currently, AI Engine does not know about the indexes for this <b>API Key</b> and this <b>Server</b>. Visit the <b>Embeddings</b> tab, then <b>Refresh</b> your indexes or <b>Add</b> a new one.
        </NekoMessage>
        <NekoSpacer />
        </>
      )}

      <NekoCollapsableCategories keepState="embeddingsEnvs">
        <NekoCollapsableCategory title={i18n.COMMON.AI_ENVIRONMENT}>
          <div style={{ marginTop: 10 }}>
            <NekoSettings title={i18n.COMMON.OVERRIDE_DEFAULTS}>
              <NekoCheckbox label={i18n.COMMON.ENABLE} value="1"
                checked={env?.ai_embeddings_override}
                onChange={value => handleUpdateEnv('ai_embeddings_override', value)}
              />
            </NekoSettings>
            {env?.ai_embeddings_override && (
              <>
              <NekoSettings title={i18n.COMMON.ENVIRONMENT}>
                <NekoSelect scrolldown name="ai_embeddings_env" value={env?.ai_embeddings_env}
                  onChange={value => handleUpdateEnv('ai_embeddings_env', value)}>
                  {ai_envs.map((x) => (
                    <NekoOption key={x.id} value={x.id} label={x.name}></NekoOption>
                  ))}
                </NekoSelect>
              </NekoSettings>
              <NekoSettings title={i18n.COMMON.MODEL}>
                <NekoSelect scrolldown name="ai_embeddings_model" value={env.ai_embeddings_model}    
                  onChange={value => handleUpdateEnv('ai_embeddings_model', value)}>
                  {embeddingsModels.map((x) => (
                    <NekoOption key={x.model} value={x.model} label={x.name}></NekoOption>
                  ))}
                </NekoSelect>
              </NekoSettings>
              </>
            )}
          </div>
        </NekoCollapsableCategory>

        <NekoCollapsableCategory title={i18n.COMMON.ACTIONS}>
          <div style={{ display: 'flex', marginTop: 10 }}>
            <div style={{ flex: 'auto' }} />
            <NekoButton className="danger"
              onClick={() => deleteEnvironment(env.id)}>
              {i18n.COMMON.DELETE}
            </NekoButton>
          </div>
        </NekoCollapsableCategory>
      </NekoCollapsableCategories>
    </>
  );
};

function EmbeddingsEnvironmentsSettings({ environments, updateEnvironment, updateOption, options, busy }) {
  const ai_envs = options?.ai_envs || [];
  const handleAddEnvironment = () => {
    const newEnv = {
      name: 'New Environment',
      type: 'pinecone', 
      apikey: '',
      server: '',
      indexes: [],
      namespaces: []
    };
    const updatedEnvironments = [...environments, newEnv];
    updateOption(updatedEnvironments, 'embeddings_envs');
  };
  const handleDeleteEnv = (id) => {
    if (environments.length <= 1) {
      alert("You can't delete the last environment.");
      return;
    }
    const updatedEnvironments = environments.filter(env => env.id !== id);
    updateOption(updatedEnvironments, 'embeddings_envs');
  };
  return (
    <div style={{ padding: '0px 10px 20px 10px', marginTop: -5 }}>
      <NekoTypo h2 style={{ color: 'white' }}>Environments for Embeddings</NekoTypo>
      <NekoTabs inversed keepTabOnReload={true} style={{ marginTop: -5 }} action={
        <NekoButton rounded className="primary-block" icon='plus' onClick={handleAddEnvironment} />}>
        {environments.map((env) => (
          <NekoTab key={env.id} title={env.name} busy={busy}>
            <EnvironmentDetails env={env} updateEnvironment={updateEnvironment}
              ai_envs={options?.ai_envs || []} options={options} />
            <NekoButton className="danger" onClick={() => handleDeleteEnv(env.id)}>{i18n.COMMON.DELETE}</NekoButton>
          </NekoTab>
        ))}
      </NekoTabs>
    </div>
  );
}

export default EmbeddingsEnvironmentsSettings;