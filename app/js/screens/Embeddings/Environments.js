// Previous: 1.9.92
// Current: 1.9.94

import { NekoTypo, NekoTabs, NekoTab, NekoButton, NekoSettings, NekoInput, NekoSpacer,
  NekoCollapsableCategories, NekoCollapsableCategory,
  NekoSelect, NekoOption, NekoMessage } from '@neko-ui';
import i18n from '@root/i18n';
import { toHTML } from '@app/helpers-admin';

function EmbeddingsEnvironmentsSettings({ environments, updateEnvironment, updateOption, busy }) {

  const addNewEnvironment = () => {
    const newEnv = {
      name: 'New Environment',
      type: 'pinecone', 
      apikey: '',
      server: '',
      indexes: [],
      namespaces: [],
    };
    const updatedEnvironments = [...environments, newEnv];
    updateOption(updatedEnvironments, 'embeddings_envs');
  };

  const deleteEnvironment = (id) => {
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
        <NekoButton rounded className="primary-block" icon='plus' onClick={addNewEnvironment} />}>
        {environments.map((env) => (
          <NekoTab key={env.id} title={env.name} busy={busy}>
            <NekoSettings title={i18n.COMMON.NAME}>
              <NekoInput name="name" value={env.name}
                onFinalChange={value => updateEnvironment(env.id, { name: value })}
              />
            </NekoSettings>
            
            <NekoSettings title={i18n.COMMON.TYPE}>
              <NekoSelect scrolldown name="type" value={env.type}
                onChange={value => updateEnvironment(env.id, { type: value })}>
                <NekoOption value="pinecone" label="Pinecone" />
                <NekoOption value="qdrant" label="Qdrant" />
              </NekoSelect>
            </NekoSettings>
            
            <NekoSettings title={i18n.COMMON.API_KEY}>
              <NekoInput  name="apikey" value={env.apikey}
                description={toHTML(env.type === 'pinecone' ? i18n.COMMON.PINECONE_APIKEY_HELP :
                  i18n.COMMON.QDRANT_APIKEY_HELP)}
                onFinalChange={value => updateEnvironment(env.id, { apikey: value })} 
              />
            </NekoSettings>
            
            <NekoSettings title={i18n.COMMON.SERVER}>
              {env.type === 'pinecone' && 
              <NekoSelect scrolldown name="server" value={env.server} 
                description={toHTML(i18n.COMMON.PINECONE_SERVER_HELP)}
                onChange={value => {
                  updateEnvironment(env.id, { server: value });
                }}>
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
                onFinalChange={value => updateEnvironment(env.id, { server: value })}
              />}
            </NekoSettings>

            {env.type === 'pinecone' && <NekoSettings title={i18n.COMMON.NAMESPACES}>
              <NekoInput isCommaSeparatedArray name="namespaces" value={env.namespaces}
                disabled={env.server === 'gcp-starter'}
                description={toHTML(i18n.COMMON.NAMESPACES_HELP)}
                onFinalChange={value => {
                  updateEnvironment(env.id, { namespaces: value });
                }} />
            </NekoSettings>}

            {env?.indexes?.length === 0 && <>
              <NekoMessage variant="danger">
                Currently, AI Engine does not know about the indexes for this <b>API Key</b> and this <b>Server</b>. Visit the <b>Embeddings</b> tab, then <b>Refresh</b> your indexes or <b>Add</b> a new one.
              </NekoMessage>
              <NekoSpacer />
            </>}

            <NekoCollapsableCategories keepState="embeddingsEnvs">

              <NekoCollapsableCategory title={i18n.COMMON.ACTIONS}>
                <div style={{ display: 'flex', marginTop: 10 }}>
                  <div style={{ flex: 'auto' }} />
                  <NekoButton className="danger"
                    onClick={() => {
                      deleteEnvironment(env.id);
                    }}>
                    {i18n.COMMON.DELETE}
                  </NekoButton>
                </div>
              </NekoCollapsableCategory>

            </NekoCollapsableCategories>

          </NekoTab>
        ))}
      </NekoTabs>
    </div>
  );
}

export default EmbeddingsEnvironmentsSettings;