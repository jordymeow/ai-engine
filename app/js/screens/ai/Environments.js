// Previous: 2.7.5
// Current: 2.8.2

const { useCallback, useMemo, useState } = wp.element;
import { nekoStringify } from '@neko-ui';

import { NekoTypo, NekoTabs, NekoTab, NekoButton, NekoSettings, NekoInput, NekoCheckbox,
  NekoCollapsableCategories, NekoCollapsableCategory, NekoMessage, NekoSpacer,
  NekoSelect, NekoOption, nekoFetch } from '@neko-ui';
import { apiUrl, restNonce } from '@app/settings';
import i18n from '@root/i18n';
import { toHTML } from '@app/helpers-admin';

const Deployments = ({ updateEnvironment, environmentId, deployments, options }) => {

  const updateDeployments = (index, field, value) => {
    const freshDeployments = JSON.parse(nekoStringify(deployments));
    freshDeployments[index][field] = value;
    updateEnvironment(environmentId, { deployments: freshDeployments });
  };

  const addDeployment = () => {
    const freshDeployments = [...deployments, { name: '', model: '' }];
    updateEnvironment(environmentId, { deployments: freshDeployments });
  };

  const removeDeployment = (index) => {
    const freshDeployments = [...deployments];
    freshDeployments.splice(index, 1);
    updateEnvironment(environmentId, { deployments: freshDeployments });
  };

  const OpenAIModels = useMemo(() => {
    const openAI = options?.ai_engines?.find(x => x.type === 'openai');
    return openAI?.models ?? [];
  }, [options]);

  return (
    <NekoSettings title={i18n.COMMON.OPENAI_AZURE_DEPLOYMENTS} style={{ marginTop: 10 }}>
      {deployments.map((deployment, index) => (
        <div key={index} style={{ display: 'flex', marginBottom: 10 }}>
          <NekoInput style={{ flex: 1 }}
            value={deployment['name']}
            placeholder={i18n.COMMON.OPENAI_AZURE_DEPLOYMENT_NAME}
            onBlur={(value) => updateDeployments(index, 'name', value)}
            onEnter={(value) => updateDeployments(index, 'name', value)}
          />
          <NekoSelect style={{ flex: 1, marginLeft: 10 }}
            scrolldown id="model" name="model"
            value={deployment['model']}
            onChange={(value) => updateDeployments(index, 'model', value)}>
            {OpenAIModels.map((x) => (
              <NekoOption key={x.model} value={x.model} label={x.name}></NekoOption>
            ))}
          </NekoSelect>
          <NekoButton rounded isSmall style={{ marginLeft: 10, height: 30 }}
            icon="trash" onClick={() => removeDeployment(index)}
          />
        </div>
      ))}
      <NekoButton fullWidth icon="plus" onClick={addDeployment} />
    </NekoSettings>
  );
};

const CustomModels = ({ updateEnvironment, environmentId, customModels,  }) => {

  const updateCustomModels = (index, field, value) => {
    const freshCustomModels = JSON.parse(nekoStringify(customModels));
    freshCustomModels[index][field] = value;
    updateEnvironment(environmentId, { customModels: freshCustomModels });
  };

  const addCustomModel = () => {
    const freshCustomModels = [...customModels, { name: '', apiUrl: '', tags: ['core', 'chat'] }];
    updateEnvironment(environmentId, { customModels: freshCustomModels });
  };

  const removeCustomModel = (index) => {
    const freshCustomModels = [...customModels];
    freshCustomModels.splice(index, 1);
    updateEnvironment(environmentId, { customModels: freshCustomModels });
  };

  return (
    <NekoSettings title={i18n.COMMON.HUGGINGFACE_MODELS} style={{ marginTop: 10 }}>
      {customModels.map((customModel, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', marginBottom: 10 }}>
          <div style={{ display: 'flex', marginBottom: 2 }}>
            <NekoInput style={{ flex: 1 }}
              value={customModel['name']}
              placeholder={i18n.COMMON.HUGGINGFACE_MODEL_NAME}
              onBlur={(value) => updateCustomModels(index, 'name', value)}
              onEnter={(value) => updateCustomModels(index, 'name', value)}
            />
            <NekoInput style={{ flex: 2, marginLeft: 5 }}
              value={customModel['apiUrl']}
              placeholder={i18n.COMMON.HUGGINGFACE_MODEL_URL}
              onBlur={(value) => updateCustomModels(index, 'apiUrl', value)}
              onEnter={(value) => updateCustomModels(index, 'apiUrl', value)}
            />
            <NekoButton rounded isSmall style={{ marginLeft: 5, height: 30 }}
              icon="trash" onClick={() => removeCustomModel(index)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <span style={{ marginRight: 5 }}>Image Model</span>
            <NekoCheckbox style={{ marginTop: !index ? 5 : 0, marginRight: 10 }}
              disabled={true}
              checked={customModel['tags']?.includes('image')}
              onChange={(value) => {
                const freshCustomModels = JSON.parse(nekoStringify(customModels));
                if (!freshCustomModels[index]['tags']) {
                  freshCustomModels[index]['tags'] = ['core', 'chat'];
                }
                if (value) {
                  freshCustomModels[index]['tags'].push('image');
                }
                else {
                  freshCustomModels[index]['tags'] = freshCustomModels[index]['tags'].filter(x => x !== 'image');
                }
                updateEnvironment(environmentId, { customModels: freshCustomModels });
              }}
            />
            <span style={{ marginRight: 5 }}>Vision Model</span>
            <NekoCheckbox style={{ marginTop: !index ? 5 : 0, marginRight: 33 }}
              disabled={true}
              checked={customModel['tags']?.includes('vision')}
              onChange={(value) => {
                const freshCustomModels = JSON.parse(nekoStringify(customModels));
                if (!freshCustomModels[index]['tags']) {
                  freshCustomModels[index]['tags'] = ['core', 'chat'];
                }
                if (value) {
                  freshCustomModels[index]['tags'].push('vision');
                }
                else {
                  freshCustomModels[index]['tags'] = freshCustomModels[index]['tags'].filter(x => x !== 'vision');
                }
                updateEnvironment(environmentId, { customModels: freshCustomModels });
              }}
            />
          </div>
        </div>
      ))}
      <NekoButton fullWidth icon="plus" onClick={addCustomModel} />
    </NekoSettings>
  );
};

function AIEnvironmentsSettings({ options, environments, updateEnvironment, updateOption, busy }) {
  const [loading, setLoading] = useState(false);
  const aiEngines = options?.ai_engines ?? [];

  const addNewEnvironment = () => {
    const newEnv = {
      name: 'New Environment',
      type: 'openai',
      apikey: ''
    };
    const updatedEnvironments = [...environments, newEnv];
    updateOption(updatedEnvironments, 'ai_envs');
  };

  const deleteEnvironment = (id) => {
    if (environments.length === 1) {
      alert("You can't delete the last environment.");
      return;
    }
    const updatedEnvironments = environments.filter(env => env.id !== id);
    updateOption(updatedEnvironments, 'ai_envs');
  };

  const getDescription = useCallback(env => {
    switch(env.type) {
    case 'openai':
      return toHTML(i18n.HELP.OPENAI_API_KEY);
    case 'azure':
      return toHTML(i18n.HELP.AZURE_API_KEY);
    case 'openrouter':
      return toHTML(i18n.HELP.OPENROUTER_API_KEY);
    case 'anthropic':
      return toHTML(i18n.HELP.ANTHROPIC_API_KEY);
    default:
      return '';
    }
  }, []);

  const fetchModels = useCallback(async (envId, envType) => {
    try {
      setLoading(true);
      const res = await nekoFetch(`${apiUrl}/ai/models`, {
        method: 'POST',
        nonce: restNonce,
        json: { envId }
      });
      setLoading(false);
      let newModels = res?.models;
      if (!newModels) {
        throw new Error('Could not fetch models.');
      }
      newModels = newModels.map(x => ({ ...x, envId, type: envType }));
      let freshModels = options?.ai_models ?? [];
      freshModels = freshModels.filter(x => !(x.type === envType && (x.envId || x.envId === envId)));
      freshModels.push(...newModels);
      updateOption(freshModels, 'ai_models');
    }
    catch (err) {
      alert(err.message);
      console.log(err);
      setLoading(false);
    }
  }, [updateOption]);

  const renderFields = (env) => {
    const currentEngine = aiEngines.find(engine => engine.type === env.type) || {};
    const fields = currentEngine.inputs || [];

    return (
      <>
        {fields.includes('apikey') && (
          <NekoSettings title={i18n.COMMON.API_KEY}>
            <NekoInput name="apikey" value={env.apikey}
              description={getDescription(env)}
              onFinalChange={value => updateEnvironment(env.id, { apikey: value })}
            />
          </NekoSettings>
        )}
        {fields.includes('organizationId') && (
          <NekoSettings title={i18n.COMMON.OPENAI_ORGANIZATION_ID}>
            <NekoInput name="organizationId" value={env.organizationId}
              description={toHTML(i18n.HELP.OPENAI_ORGANIZATION_ID)}
              onFinalChange={value => updateEnvironment(env.id, { organizationId: value })}
            />
          </NekoSettings>
        )}
        {fields.includes('endpoint') && (
          <NekoSettings title={i18n.COMMON.ENDPOINT}>
            <NekoInput name="endpoint" value={env.endpoint}
              onFinalChange={value => updateEnvironment(env.id, { endpoint: value })}
            />
          </NekoSettings>
        )}
        {fields.includes('region') && (
          <NekoSettings title={i18n.COMMON.REGION}>
            <NekoInput name="region" value={env.region}
              onFinalChange={value => updateEnvironment(env.id, { region: value })}
            />
          </NekoSettings>
        )}
        {fields.includes('projectId') && (
          <NekoSettings title={i18n.COMMON.PROJECT_ID}>
            <NekoInput name="projectId" value={env.projectId}
              onFinalChange={value => updateEnvironment(env.id, { projectId: value })}
            />
          </NekoSettings>
        )}
      </>
    );
  };

  return (
    <div style={{ padding: '0px 10px 5px 10px', marginTop: 13, marginBottom: 5 }}>
      <NekoTypo h2 style={{ color: 'white', marginBottom: 15 }}>
        {i18n.COMMON.ENVIRONMENTS_FOR_AI}
      </NekoTypo>
      <NekoTabs inversed style={{ marginTop: -5 }} action={
        <NekoButton rounded className="secondary" icon='plus' onClick={addNewEnvironment} />}>
        {environments.map((env) => {

          let modelsCount = 0;
          const currentEngine = aiEngines.find(engine => engine.type === env.type) || {};
          const hasDynamicModels = currentEngine.inputs?.includes('dynamicModels');
          if (Array.isArray(currentEngine.models)) {
            modelsCount = currentEngine.models.length;
          }

          return (<NekoTab key={env.id} title={env.name} busy={busy}>
            <NekoSettings title={i18n.COMMON.NAME}>
              <NekoInput name="name" value={env.name}
                onFinalChange={value => updateEnvironment(env.id, { name: value })}
              />
            </NekoSettings>

            <NekoSettings title={i18n.COMMON.TYPE}>
              <NekoSelect scrolldown name="type" value={env.type}
                onChange={value => updateEnvironment(env.id, { type: value })}>
                {aiEngines.map(engine => (
                  <NekoOption key={engine.type} value={engine.type} label={engine.name} />
                ))}
              </NekoSelect>
            </NekoSettings>

            {renderFields(env)}

            {env.type === 'google' && <>
              {(env.apikey === '' || !env.apikey) &&
              <NekoMessage variant="info" style={{ marginBottom: 10 }}>
                Click <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer">here</a> to access AI Studio and create your API Key.
              </NekoMessage>
              }

              <NekoMessage variant="danger">
                Streaming is only supported in the Pro Version of AI Engine. As of 2025, Gemini is still unstable. If you encounter issues, let's discuss them on <a href="https://discord.gg/bHDGh38" target="_blank" rel="noreferrer">Discord</a>. 
              </NekoMessage>
              <NekoSpacer />
            </>}

            {env.type === 'huggingface' && <>
              <NekoMessage variant="danger">
                Support for Hugging Face is experimental and may not work as expected. Also, AI Engine is ready for Image and Vision but Hugging Face is not (hence the disabled checkboxes). Let's discuss about Hugging Face on <a href="https://discord.gg/bHDGh38" target="_blank" rel="noreferrer">Discord</a>.
              </NekoMessage>
              <NekoSpacer />
            </>}

            {env.type === 'perplexity' && (env.apikey === '' || !env.apikey) && <>
              <NekoMessage variant="warning">
                Perplexity.ai is a paid service. Click <a href="https://perplexity.ai/pro?referral_code=A1R94DGZ" target="_blank" rel="noreferrer">here</a> to create an account with 10$ free credit.
              </NekoMessage>
              <NekoSpacer />
            </>}

            <NekoCollapsableCategories keepState="environmentCategories">
              {hasDynamicModels && <NekoCollapsableCategory title={i18n.COMMON.MODELS}>
                {env.type === 'openrouter' && <p>
                  There are currently <b>{modelsCount}</b> models available. OpenRouter models need to be refresh regularly. This button will fetch the latest models and their prices.
                </p>}
                {env.type === 'google' && <p>
                  There are currently <b>{modelsCount}</b> models available. Google models need to be refresh regularly. This button will fetch the latest models and their prices.
                </p>}
                {env.type !== 'openrouter' && env.type !== 'google' && <p>
                  There are currently <b>{modelsCount}</b> models available. This button will fetch the latest models.
                </p>}
                <NekoButton fullWidth className="primary" isBusy={loading}
                  onClick={() => fetchModels(env.id, env.type)}>
                  {i18n.COMMON.REFRESH_MODELS}
                </NekoButton>
              </NekoCollapsableCategory>}

              {env.type === 'azure' && <>
                <p>
                  {i18n.HELP.AZURE_DEPLOYMENTS}
                </p>
                <NekoCollapsableCategory title={i18n.COMMON.OPENAI_AZURE_DEPLOYMENTS}>
                  <Deployments
                    deployments={env.deployments ?? []}
                    environmentId={env.id}
                    updateEnvironment={updateEnvironment}
                    options={options}
                  />
                </NekoCollapsableCategory>
              </>}

              {env.type === 'huggingface' &&
                <NekoCollapsableCategory title={i18n.COMMON.HUGGINGFACE_MODELS}>
                  <p>Browse the <a href="https://huggingface.co/models" target="_blank" rel="noreferrer">Models on Hugging Face</a>. Use the Deploy button (Inference API Serverless) in order to get the API URL. Paste it below with the name of your choice and you're done!</p>
                  <CustomModels
                    customModels={env.customModels ?? []}
                    environmentId={env.id}
                    updateEnvironment={updateEnvironment}
                    options={options}
                  />
                </NekoCollapsableCategory>
              }

              <NekoCollapsableCategory title={i18n.COMMON.ENVIRONMENT_ID}>
                <p>
                  The EnvID is "<b>{env.id}</b>".
                </p>
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

          </NekoTab>);

        })}
      </NekoTabs>
    </div>
  );
}

export default AIEnvironmentsSettings;