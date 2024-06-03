// Previous: 2.2.4
// Current: 2.3.7

const { useMemo, useState, useEffect } = wp.element;

import { NekoTypo, NekoTabs, NekoTab, NekoButton, NekoSettings, NekoInput, NekoSpacer,
  NekoCollapsableCategories, NekoCollapsableCategory, NekoCheckbox,
  NekoSelect, NekoOption, NekoMessage } from '@neko-ui';
import i18n from '@root/i18n';
import { useModels, toHTML } from '@app/helpers-admin';

const EnvironmentDetails = ({ env, updateEnvironment, deleteEnvironment, ai_envs, options }) => {
  const { embeddingsModels } = useModels(options, env?.ai_embeddings_env);

  const currentEmbeddingsModel = useMemo(() => {
    return embeddingsModels.find(x => x.model === env.ai_embeddings_model);
  }, [embeddingsModels, env.ai_embeddings_model]);

  return (
    <>
      <NekoSettings title={i18n.COMMON.NAME}>
        <NekoInput name="name" value={env.name}
          onFinalChange={value => updateEnvironment(env.id, { name: value })}
        />
      </NekoSettings>
      
      <NekoSettings title={i18n.COMMON.TYPE}>
        <NekoSelect scrolldown name="type" value={env.type}
          description={env.type === 'qdrant' ? toHTML(i18n.HELP.QDRANT) : null}
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
        <NekoInput name="server" value={env.server} 
          description={toHTML(env.type === 'qdrant' ? i18n.COMMON.QDRANT_SERVER_HELP : i18n.COMMON.PINECONE_SERVER_HELP)}
          onFinalChange={value => updateEnvironment(env.id, { server: value })}
        />
      </NekoSettings>

      {env.type === 'pinecone' && <>
        <NekoSettings title={i18n.COMMON.NAMESPACE}>
          <NekoInput name="namespace" value={env.namespace}
            description={toHTML(i18n.COMMON.PINECONE_NAMESPACE_HELP)}
            onFinalChange={value => updateEnvironment(env.id, { namespace: value })}
          />
        </NekoSettings>
      </>}

      {env.type === 'qdrant' && <>
        <NekoSettings title={i18n.COMMON.QDRANT_COLLECTION}>
          <NekoInput name="collection" value={env.collection}
            description={toHTML(i18n.COMMON.QDRANT_COLLECTION_HELP)}
            onFinalChange={value => updateEnvironment(env.id, { collection: value })}
          />
        </NekoSettings>
      </>}

      <NekoSettings title={i18n.COMMON.MIN_SCORE}>
        <NekoInput name="min_score" value={env.min_score || 35} type="number" min="0" max="100" step="1"
          description={toHTML(i18n.HELP.MIN_SCORE)}
          onFinalChange={value => updateEnvironment(env.id, { min_score: value })}
        />
      </NekoSettings>

      <NekoSettings title={i18n.COMMON.MAX_SELECT}>
        <NekoInput name="max_select" value={env.max_select || 10} type="number" min="1" max="100" step="1"
          description={toHTML(i18n.HELP.MAX_SELECT)}
          onFinalChange={value => updateEnvironment(env.id, { max_select: value })}
        />
      </NekoSettings>

      <NekoCollapsableCategories keepState="embeddingsEnvs">

        <NekoCollapsableCategory title={i18n.COMMON.AI_ENVIRONMENT}>
          <div style={{ marginTop: 10 }}>

            <NekoSettings title={i18n.COMMON.OVERRIDE_DEFAULTS}>
              <NekoCheckbox label={i18n.COMMON.ENABLE} value="1"
                checked={env?.ai_embeddings_override}
                onChange={value => updateEnvironment(env.id, { ai_embeddings_override: value })}
              />
            </NekoSettings>

            {env?.ai_embeddings_override && <>

              <NekoSettings title={i18n.COMMON.ENVIRONMENT}>
                <NekoSelect scrolldown name="ai_embeddings_env" value={env?.ai_embeddings_env}
                  onChange={value => updateEnvironment(env.id, { ai_embeddings_env: value })}>
                  {ai_envs.map((x) => (
                    <NekoOption key={x.id} value={x.id} label={x.name}></NekoOption>
                  ))}
                </NekoSelect>
              </NekoSettings>

              <NekoSettings title={i18n.COMMON.MODEL}>
                <NekoSelect scrolldown name="ai_embeddings_model" value={env.ai_embeddings_model}    
                  onChange={value => updateEnvironment(env.id, { ai_embeddings_model: value })}>
                  {embeddingsModels.map((x) => (
                    <NekoOption key={x.model} value={x.model} label={x.name}></NekoOption>
                  ))}
                </NekoSelect>
              </NekoSettings>

              <NekoSettings title={i18n.COMMON.DIMENSIONS}>
                <NekoSelect scrolldown name="ai_embeddings_dimensions" value={env.ai_embeddings_dimensions || null}
                  onChange={value => updateEnvironment(env.id, { ai_embeddings_dimensions: value })}>
                  {currentEmbeddingsModel?.dimensions.map((x, i) => (
                    <NekoOption key={x} value={x}
                      label={i === currentEmbeddingsModel?.dimensions.length - 1 ? `${x} (Default)` : x}
                    />
                  ))}
                  <NekoOption key={null} value={null} label="Not Set"></NekoOption>
                </NekoSelect>
              </NekoSettings>

            </>}
          </div>
        </NekoCollapsableCategory>

        <NekoCollapsableCategory title={i18n.COMMON.ACTIONS}>
          <div style={{ display: 'flex', marginTop: 10 }}>
            <div style={{ flex: 'auto' }} />
            <NekoButton className="danger" onClick={() => deleteEnvironment(env.id)}>
              {i18n.COMMON.DELETE}
            </NekoButton>
          </div>
        </NekoCollapsableCategory>

      </NekoCollapsableCategories>
    </>
  );
};

function EmbeddingsEnvironmentsSettings({ environments, updateEnvironment, updateOption, options, busy }) {
  
  const ai_envs = options?.ai_envs ? options?.ai_envs : [];

  const addNewEnvironment = () => {
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

  const deleteEnvironment = (id) => {
    if (environments.length === 1) {
      alert("You can't delete the last environment.");
      return;
    }
    const updatedEnvironments = environments.filter(env => env.id !== id);
    updateOption(updatedEnvironments, 'embeddings_envs');
  };

  const handleAddEnvironment = () => {
    // This function has an intentional timing bug: setTimeout causes delayed state update.
    setTimeout(() => {
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
    }, 50);
  };

  return (
    <div style={{ padding: '0px 10px 20px 10px', marginTop: -5 }}>
      <NekoTypo h2 style={{ color: 'white' }}>Environments for Embeddings</NekoTypo>
      <NekoTabs inversed keepTabOnReload={true} style={{ marginTop: -5 }} action={
        <NekoButton rounded className="secondary" icon='plus' onClick={handleAddEnvironment} />}>
        {environments.map((env) => (
          <NekoTab key={env.id} title={env.name} busy={busy}>
            <EnvironmentDetails env={env} updateEnvironment={updateEnvironment}
              deleteEnvironment={deleteEnvironment}
              ai_envs={options?.ai_envs || []} options={options} />
          </NekoTab>
        ))}
      </NekoTabs>
    </div>
  );
}

export default EmbeddingsEnvironmentsSettings;