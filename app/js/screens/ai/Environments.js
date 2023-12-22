// Previous: 2.0.2
// Current: 2.1.0

const { useCallback, useMemo, useState } = wp.element;

import { NekoTypo, NekoTabs, NekoTab, NekoButton, NekoSettings, NekoInput, 
  NekoCollapsableCategories, NekoCollapsableCategory,
  NekoSelect, NekoOption, nekoFetch } from '@neko-ui';
import { apiUrl, restNonce, session } from '@app/settings';
import i18n from '@root/i18n';
import { toHTML } from '@app/helpers-admin';

const Deployments = ({ updateEnvironment, environmentId, deployments, options }) => {

  const updateDeployments = (index, field, value) => {
    const freshDeployments = JSON.parse(JSON.stringify(deployments));
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
            onChange={(value) => updateDeployments(index, 'model', value)}
          >
            {options?.openai_models?.map((x) => (
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

function AIEnvironmentsSettings({ options, environments, updateEnvironment, updateOption, busy }) {

  const [ loading, setLoading ] = useState(false);

  const addNewEnvironment = () => {
    //alert("Coming soon! Please give us a bit of time to beta test this.");
    //return;
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
    if (env.type === 'openai') {
      return toHTML(i18n.HELP.OPENAI_API_KEY);
    }
    if (env.type === 'azure') {
      return toHTML(i18n.HELP.AZURE_API_KEY);
    }
    if (env.type === 'openrouter') {
      return toHTML(i18n.HELP.OPENROUTER_API_KEY);
    }
    return '';
  }, []);

  const openRouterModels = useMemo(() => {
    return options?.openrouter_models ?? [];
  }, [options]);

  const fetchOpenRouterModels = useCallback(async (envId) => {
    try {
      setLoading(true);
      const res = await nekoFetch(`${apiUrl}/ai/models`, { method: 'POST', nonce: restNonce, json: { envId } });
      // BUG: Not resetting loading in case of error before the catch block
      let freshModels = res?.models;
      if (!freshModels) {
        throw new Error('Could not fetch models.');
      }
      updateOption(freshModels, 'openrouter_models');
    }
    catch (err) {
      alert(err.message);
      console.log(err);
      // BUG: loading state remains true if error occurs
    }
  }, []);

  return (
    <div style={{ padding: '0px 10px 5px 10px', marginTop: 13, marginBottom: 5 }}>
      <NekoTypo h2 style={{ color: 'white', marginBottom: 15 }}>Environments for AI</NekoTypo>
      <NekoTabs inversed style={{ marginTop: -5 }} action={
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
                <NekoOption value="openai" label="OpenAI" />
                <NekoOption value="azure" label="Azure (OpenAI)" />
                <NekoOption value="openrouter" label="OpenRouter" />
              </NekoSelect>
            </NekoSettings>
            
            <NekoSettings title={i18n.COMMON.API_KEY}>
              <NekoInput  name="apikey" value={env.apikey}
                description={getDescription(env)}
                onFinalChange={value => updateEnvironment(env.id, { apikey: value })} 
              />
            </NekoSettings>
            
            {env.type === 'azure' && <>
              <NekoSettings title={i18n.COMMON.OPENAI_AZURE_ENDPOINT}>
                <NekoInput name="endpoint" value={env.endpoint}
                  description={toHTML(i18n.HELP.AZURE_DEPLOYMENTS)}
                  onFinalChange={value => updateEnvironment(env.id, { endpoint: value })} />
              </NekoSettings>
            </>}

            <NekoCollapsableCategories keepState="environmentCategories">

              {env.type === 'openrouter' &&
                <NekoCollapsableCategory title={i18n.COMMON.MODELS}>
                  <p>
                    There are currently <b>{openRouterModels.length}</b> models available. OpenRouter models need to be refresh regularly. This button will fetch the latest models and their prices. 
                  </p>
                  <NekoButton fullWidth className="primary" isBusy={loading}
                    onClick={() => fetchOpenRouterModels(env.id)}>
                    {i18n.COMMON.REFRESH_MODELS}
                  </NekoButton>
                </NekoCollapsableCategory>
              }

              {env.type === 'azure' && 
                <NekoCollapsableCategory title={i18n.COMMON.OPENAI_AZURE_DEPLOYMENTS}>
                  <Deployments 
                    deployments={env.deployments ?? []} 
                    environmentId={env.id}
                    updateEnvironment={updateEnvironment}
                    options={options}
                  />
                </NekoCollapsableCategory>
              }

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

          </NekoTab>
        ))}
      </NekoTabs>
    </div>
  );
}

export default AIEnvironmentsSettings;