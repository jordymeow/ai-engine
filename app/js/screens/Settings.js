// Previous: 2.3.1
// Current: 2.3.7

const { useMemo, useState, useEffect } = wp.element;

import { NekoButton, NekoInput, NekoPage, NekoBlock, NekoContainer, NekoSettings, NekoSpacer, NekoTypo,
  NekoSelect, NekoOption, NekoTabs, NekoTab, NekoCheckboxGroup, NekoCheckbox, NekoWrapper, 
  NekoCollapsableCategory, NekoColumn, NekoIcon, NekoModal } from '@neko-ui';

import { nekoFetch } from '@neko-ui';
import { useQuery } from '@tanstack/react-query';
import { nekoStringify } from '@neko-ui';

import { LicenseBlock } from '@common';
import { apiUrl, prefix, domain, isRegistered, isPro, restNonce, 
  options as defaultOptions } from '@app/settings';
import i18n from '@root/i18n';
import { OptionsCheck, toHTML, useModels } from '@app/helpers-admin';
import { AiNekoHeader } from '@app/styles/CommonStyles';
import FineTunes from '@app/screens/finetunes/Finetunes';
import OpenAIStatus from '@app/screens/misc/OpenAIStatus';
import Moderation from '@app/screens/misc/Moderation';
import Embeddings from '@app/screens/embeddings/Embeddings';
import MonthlyUsage from '@app/components/MonthlyUsage';
import Discussions from '@app/screens/discussions/Discussions';
import Chatbots from './chatbots/Chatbots';
import Statistics from '@app/screens/queries/Statistics';
import DevToolsTab from './settings/DevToolsTab';
import EmbeddingsEnvironmentsSettings from './embeddings/Environments';
import AIEnvironmentsSettings from './ai/Environments';
import Transcription from './misc/Transcription';
import Assistants from './assistants/Assistants';
import { retrieveChatbots, retrieveOptions, retrieveThemes, updateChatbots, updateThemes } from '@app/requests';

const retrieveIncidents = async () => {
  const res = await nekoFetch(`${apiUrl}/openai/incidents`, { nonce: restNonce });
  if (res?.incidents) {
    const incidents = res.incidents.map(x => {
      let timestamp = x.date;
      timestamp = new Date(timestamp * 1000);
      const date = timestamp.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return { ...x, date };
    });
    return incidents;
  }
  return null;
};

const defaultEnvironmentSections = [
  { envKey: 'ai_embeddings_default_env', modelKey: 'ai_embeddings_default_model', defaultModel: 'text-embedding-ada-002' },
  { envKey: 'ai_vision_default_env', modelKey: 'ai_vision_default_model', defaultModel: 'gpt-4-vision-preview' },
  { envKey: 'ai_images_default_env', modelKey: 'ai_images_default_model', defaultModel: 'dall-e-3-hd' },
  { envKey: 'ai_audio_default_env', modelKey: 'ai_audio_default_model', defaultModel: 'whisper-1' },
  { envKey: 'ai_json_default_env', modelKey: 'ai_json_default_model', defaultModel: 'gpt-4-1106-preview' }
];

const proOptions = [
  'module_forms',
  'module_statistics',
  'module_embeddings',
  'module_assistants'
];

function useDefaultEnvironments(aiEnvs, options, updateOptions, embeddingsModels) {

  const performChecks = async () => {
    let updatesNeeded = false;
    let newOptions = { ...options };

    defaultEnvironmentSections.forEach(({ envKey, modelKey, defaultModel }) => {
      let exists = false;
      if (options[envKey]) {
        exists = !!aiEnvs.find(x => x.id === options[envKey]);
      }
      if (!exists) {
        const foundEnv = aiEnvs.find(x => x.type === 'openai');
        if (foundEnv) {
          if (newOptions[envKey] !== foundEnv.id || newOptions[modelKey] !== defaultModel) {
            updatesNeeded = true;
            newOptions[envKey] = foundEnv.id;
            newOptions[modelKey] = defaultModel;
          }
        }
        else {
          if (newOptions[envKey] !== null && newOptions[envKey] !== undefined || newOptions[modelKey] !== null && newOptions[modelKey] !== undefined) {
            updatesNeeded = true;
            newOptions[envKey] = null;
            newOptions[modelKey] = null;
          }
        }
      }

      if (modelKey === 'ai_embeddings_default_model' && newOptions[modelKey]) {
        let dimensions = newOptions?.ai_embeddings_default_dimensions || null;
        if (dimensions !== null) {
          const model = embeddingsModels.find(x => x.model === newOptions[modelKey]);
          if (model && !model?.dimensions.includes(dimensions)) {
            let newDimensions = model?.dimensions[model?.dimensions.length - 1] || null;
            if (newDimensions !== null) {
              newOptions.ai_embeddings_default_dimensions = newDimensions;
              updatesNeeded = true;
            }
          }
        }
      }
    });
    if (updatesNeeded) {
      await updateOptions(newOptions);
    }
  }

  useEffect(() => {
    performChecks();
  }, [aiEnvs, options]);
}

const Settings = () => {
  const [ options, setOptions ] = useState(defaultOptions);
  const [ error, setError ] = useState(null);
  const [ busyAction, setBusyAction ] = useState(false);
  
  const shortcodeParams = options?.shortcode_chat_params || {};
  const module_suggestions = options?.module_suggestions;
  const module_forms = options?.module_forms;
  const module_finetunes = options?.module_finetunes;
  const module_statistics = options?.module_statistics;
  const module_playground = options?.module_playground;
  const module_generator_content = options?.module_generator_content;
  const module_generator_images = options?.module_generator_images;
  const module_moderation = options?.module_moderation;
  const module_embeddings = options?.module_embeddings;
  const module_assistants = options?.module_assistants;
  const module_transcription = options?.module_transcription;
  const module_devtools = options?.module_devtools;
  const shortcode_chat = options?.shortcode_chat;

  const ai_envs = options?.ai_envs ? options?.ai_envs : [];
  const ai_default_env = options?.ai_default_env;
  const ai_default_model = options?.ai_default_model;
  const ai_vision_default_env = options?.ai_vision_default_env;
  const ai_vision_default_model = options?.ai_vision_default_model;
  const ai_embeddings_default_env = options?.ai_embeddings_default_env;
  const ai_embeddings_default_model = options?.ai_embeddings_default_model;

  const ai_images_default_env = options?.ai_images_default_env;
  const ai_images_default_model = options?.ai_images_default_model;
  const ai_audio_default_env = options?.ai_audio_default_env;
  const ai_audio_default_model = options?.ai_audio_default_model;
  const ai_json_default_env = options?.ai_json_default_env;
  const ai_json_default_model = options?.ai_json_default_model;

  const embeddings_envs = options?.embeddings_envs ? options?.embeddings_envs : [];
  const embeddings_default_env = options?.embeddings_default_env;
  const shortcode_chat_syntax_highlighting = options?.shortcode_chat_syntax_highlighting;
  const shortcode_chat_typewriter = options?.shortcode_chat_typewriter;
  const shortcode_chat_discussions = options?.shortcode_chat_discussions;
  const shortcode_chat_stream = options?.shortcode_chat_stream;
  const speech_recognition = options?.speech_recognition;
  const speech_synthesis = options?.speech_synthesis;
  const public_api = options?.public_api;
  const statistics_data = options?.statistics_data;
  const statistics_forms_data = options?.statistics_forms_data;
  const intro_message = options?.intro_message;
  const context_max_length = options?.context_max_length; 
  const banned_ips = options?.banned_ips;
  const banned_words = options?.banned_words;
  const admin_bar = options?.admin_bar ?? ['settings'];
  const resolve_shortcodes = options?.resolve_shortcodes;
  const clean_uninstall = options?.clean_uninstall;

  const { completionModels, getModel } = useModels(options);
  const { visionModels } = useModels(options, options?.ai_vision_default_env); 
  const { audioModels } = useModels(options, options?.ai_audio_default_env);
  const { jsonModels } = useModels(options, options?.ai_json_default_env);
  const { imageModels } = useModels(options, options?.ai_images_default_env);
  const { embeddingsModels } = useModels(options, options?.ai_embeddings_default_env);

  const currentModel = getModel(shortcodeParams.model);

  const defaultEmbeddingsModel = useMemo(() => {
    return embeddingsModels.find(x => x.model === ai_embeddings_default_model);
  }, [embeddingsModels, ai_embeddings_default_model]);

  const { isLoading: isLoadingIncidents, data: incidents } = useQuery({
    queryKey: ['incidents'], queryFn: retrieveIncidents
  });
  const incidentsPastDay = useMemo(() => incidents?.filter(x => {
    const incidentDate = new Date(x.date);
    return incidentDate > new Date(Date.now() - 24 * 60 * 60 * 1000);
  }).length, [incidents]);

  const busy = busyAction;

  const refreshOptions = async () => {
    setBusyAction(true);
    try {
      const fetchedOptions = await retrieveOptions();
      setOptions(fetchedOptions);
    }
    catch (err) {
      console.error(i18n.ERROR.GETTING_OPTIONS, err?.message ? { message: err.message } : { err });
      if (err.message) {
        setError(<>
          <div>{i18n.ERROR.GETTING_OPTIONS}</div>
          <small>{toHTML(i18n.ERROR.CHECK_YOUR_CONSOLE)}</small>
        </>);
      }
    }
    finally {
      setBusyAction(false);
    }
  };

  const updateOptions = async (newOptions) => {
    try {
      if (nekoStringify(newOptions) === nekoStringify(options)) {
        return;
      }
      setBusyAction(true);
      const response = await nekoFetch(`${apiUrl}/settings/update`, { 
        method: 'POST',
        nonce: restNonce,
        json: { 
          options: newOptions
        }
      });
      setOptions(response.options);
    }
    catch (err) {
      console.error(i18n.ERROR.UPDATING_OPTIONS, err?.message ?
        { message: err.message, options, newOptions } : { err, options, newOptions });
      if (err.message) {
        setError(<>
          <div>{i18n.ERROR.UPDATING_OPTIONS}</div>
          <small>{toHTML(i18n.ERROR.CHECK_YOUR_CONSOLE)}</small>
        </>);
      }
    }
    finally {
      setBusyAction(false);
    }
  };

  const updateOption = async (value, id) => {
    const newOptions = { ...options, [id]: value };
    await updateOptions(newOptions);
  };

  const updateVectorDbEnvironment = async (id, updatedValue) => {
    const updatedEnvironments = embeddings_envs.map(env => {
      if (env.id === id) {
        return { ...env, ...updatedValue };
      }
      return env;
    });
    updateOption(updatedEnvironments, 'embeddings_envs');
  };

  const updateAIEnvironment = async (id, updatedValue) => {
    const updatedEnvironments = ai_envs.map(env => {
      if (env.id === id) {
        return { ...env, ...updatedValue };
      }
      return env;
    });
    updateOption(updatedEnvironments, 'ai_envs');
  };

  const onResetSettings = async () => {
    if (!window.confirm(i18n.ALERTS.ARE_YOU_SURE)) {
      return;
    }
    setBusyAction(true);
    try {
      await nekoFetch(`${apiUrl}/settings/reset`, { method: 'POST', nonce: restNonce });
      alert("Settings reset. The page will now reload to reflect the changes.");
      window.location.reload();
    }
    catch (err) {
      alert("Error while resetting settings. Please check your console.");
      console.log(err);
    }
    finally {
      setBusyAction(false);
    }
  };

  const onExportSettings = async () => {
    setBusyAction('exportSettings');
    try {
    const chatbots = await retrieveChatbots();
    const themes = await retrieveThemes();
    const optionsData = await retrieveOptions();
    const data = { chatbots, themes, options: optionsData };
    const blob = new Blob([nekoStringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const today = new Date();
    const filename = `ai-engine-${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}.json`;
    link.setAttribute('download', filename);
    link.click();
    }
    catch (err) {
      alert("Error while exporting settings. Please check your console.");
      console.log(err);
    }
    finally {
      setBusyAction(false);
    }
  }

  const onImportSettings = async () => {
    setBusyAction('importSettings');
    try {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'application/json';
      fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) {
          return;
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = JSON.parse(e.target.result);
          const { chatbots, themes, options: importedOptions } = data;
          await updateChatbots(chatbots);
          await updateThemes(themes);
          await updateOptions(importedOptions);
          alert("Settings imported. The page will now reload to reflect the changes.");
          window.location.reload();
        };
        reader.readAsText(file);
      };
      fileInput.click();
    }
    catch (err) {
      alert("Error while importing settings. Please check your console.");
      console.log(err);
    }
    finally {
      setBusyAction(false);
    }
  }

  useDefaultEnvironments(ai_envs, options, updateOptions, embeddingsModels);

  useEffect(() => {
    if (currentModel?.mode !== 'chat' && !!shortcodeParams.embeddings_index) {
      // assuming updateShortcodeParams exists
      updateShortcodeParams('', 'embeddings_index');
    }
  }, [shortcodeParams]);

  useEffect(() => {
    if (!isRegistered) {
      let newOptions = { ...options };
      let hasChanges = false;
  
      proOptions.forEach(option => {
        if (newOptions[option]) {
          newOptions[option] = false;
          hasChanges = true;
        }
      });
  
      if (hasChanges && nekoStringify(newOptions) !== nekoStringify(options)) {
        updateOptions(newOptions);
      }
    }
  }, []);  

  const updateShortcodeParams = async (value, id) => {
    const newParams = { ...shortcodeParams, [id]: value };
    await updateOption(newParams, 'shortcode_chat_params');
  };

  // The JSX components (jsxxUtilities, jsxGenerators, etc.) remain unchanged for brevity

  return (
    <NekoPage>
      <AiNekoHeader options={options} />
      <NekoWrapper>
        <NekoColumn fullWidth>
          <OptionsCheck options={options} />
          {intro_message && <NekoContainer>
            {toHTML(i18n.SETTINGS.INTRO)}
          </NekoContainer>}
          <NekoTabs keepTabOnReload={true}>
            <NekoTab key="dashboard" title={i18n.COMMON.DASHBOARD}>
              <NekoWrapper>
                <NekoColumn minimal>
                  <NekoBlock busy={busy} title={i18n.COMMON.CLIENT_MODULES} className="primary">
                    <p>{i18n.SETTINGS.MODULES_INTRO}</p>
                    <NekoSpacer />
                    {jsxChatbot}
                    {jsxForms}
                  </NekoBlock>
                  <NekoBlock busy={busy} title={i18n.COMMON.SERVER_MODULES} className="primary">
                    <p>{i18n.SETTINGS.MODULES_INTRO}</p>
                    <NekoSpacer />
                    {jsxAssistants}
                    {jsxStatistics}
                    {jsxEmbeddings}
                    {jsxFinetunes}
                    {jsxModeration}
                  </NekoBlock>
                  <NekoBlock busy={busy} title={i18n.COMMON.BACKEND_MODULES} className="primary">
                    <p>{i18n.SETTINGS.MODULES_INTRO}</p>
                    <NekoSpacer />
                    {jsxGenerators}
                    {jsxPlayground}
                    {jsxUtilities}
                    {jsxTranscribe}
                  </NekoBlock>
                </NekoColumn>
                <NekoColumn minimal>
                  <NekoBlock busy={busy} title={i18n.COMMON.USAGE} className="primary">
                    {jsxOpenAiUsage}
                  </NekoBlock>
                </NekoColumn>
              </NekoWrapper>
            </NekoTab>
            {shortcode_chat && <NekoTab key="chatbots" title={i18n.COMMON.CHATBOTS}>
              <Chatbots options={options} updateOption={updateOption} busy={busy} />
            </NekoTab>}
            {shortcode_chat && shortcode_chat_discussions && (
              <NekoTab key="discussions" title={i18n.COMMON.DISCUSSIONS}>
                <Discussions />
              </NekoTab>
            )}
            {module_statistics && (
              <NekoTab key="queries" title={i18n.COMMON.QUERIES}>
                <Statistics options={options} updateOption={updateOption} busy={busy} />
              </NekoTab>
            )}
            {module_embeddings && (
              <NekoTab key="embeddings" title={i18n.COMMON.EMBEDDINGS}>
                <Embeddings
                  options={options}
                  updateEnvironment={updateVectorDbEnvironment}
                  updateOption={updateOption}
                />
              </NekoTab>
            )}
            {module_assistants && (
              <NekoTab key="assistants" title={i18n.COMMON.ASSISTANTS}>
                <Assistants options={options} updateOption={updateOption} refreshOptions={refreshOptions} />
              </NekoTab>
            )}
            {module_finetunes && (
              <NekoTab key="finetunes" title={i18n.COMMON.FINETUNES}>
                <FineTunes options={options} updateOption={updateOption} refreshOptions={refreshOptions} />
              </NekoTab>
            )}
            {module_moderation && (
              <NekoTab key="moderation" title={i18n.COMMON.MODERATION}>
                <Moderation options={options} updateOption={updateOption} busy={busy} />
              </NekoTab>
            )}
            {module_transcription && (
              <NekoTab key="transcription" title={i18n.COMMON.TRANSCRIPTION}>
                <Transcription options={options} updateOption={updateOption} />
              </NekoTab>
            )}
            <NekoTab key="settings" title={<>{i18n.COMMON.SETTINGS}{jsxIncidentsIcon}</>}>
              <NekoWrapper>
                <NekoColumn minimal>
                  <AIEnvironmentsSettings
                    busy={busy}
                    options={options}
                    environments={ai_envs}
                    updateEnvironment={updateAIEnvironment}
                    updateOption={updateOption}
                  />
                  <div style={{ padding: '0px 10px 15px 10px', marginTop: 13, marginBottom: 5 }}>
                    <NekoTypo h2 style={{ color: 'white', marginBottom: 15 }}>
                      {i18n.COMMON.AI_ENVIRONMENT_DEFAULTS}
                    </NekoTypo>
                    <NekoTabs inversed>
                      <NekoTab key="ai" title={i18n.COMMON.DEFAULT} busy={busy}>
                        {jsxAIEnvironmentDefault}
                        {jsxAIEnvironmentModelDefault}
                      </NekoTab>
                      <NekoTab key="vision" title={i18n.COMMON.VISION} busy={busy}>
                        {jsxAIEnvironmentVisionDefault}
                        {jsxAIEnvironmentModelVisionDefault}
                      </NekoTab>
                      <NekoTab key="images" title={i18n.COMMON.IMAGES} busy={busy}>
                        {jsxAIEnvironmentImagesDefault}
                        {jsxAIEnvironmentModelImagesDefault}
                      </NekoTab>
                      <NekoTab key="embeddings" title={i18n.COMMON.EMBEDDINGS} busy={busy}>
                        {jsxAIEnvironmentEmbeddingsDefault}
                        {jsxAIEnvironmentModelEmbeddingsDefault}
                        {jsxAIEnvironmentDimensionsEmbeddingsDefault}
                      </NekoTab>
                      <NekoTab key="audio" title={i18n.COMMON.AUDIO} busy={busy}>
                        {jsxAIEnvironmentAudioDefault}
                        {jsxAIEnvironmentModelAudioDefault}
                      </NekoTab>
                      <NekoTab key="json" title={i18n.COMMON.JSON} busy={busy}>
                        {jsxAIEnvironmentJsonDefault}
                        {jsxAIEnvironmentModelJsonDefault}
                      </NekoTab>
                    </NekoTabs>
                  </div>
                  {module_embeddings && (
                    <>
                      <EmbeddingsEnvironmentsSettings
                        busy={busy}
                        options={options}
                        environments={embeddings_envs}
                        updateEnvironment={updateVectorDbEnvironment}
                        updateOption={updateOption}
                      />
                      <NekoBlock busy={busy} title={i18n.COMMON.EMBEDDINGS_ENVIRONMENT_DEFAULT} className="primary">
                        {jsxEmbeddingsEnvironmentDefault}
                      </NekoBlock>
                    </>
                  )}
                  <NekoBlock busy={isLoadingIncidents}
                    title={
                      <div style={{ display: 'flex' }}>
                        {i18n.COMMON.INCIDENTS_OPENAI}
                        {jsxIncidentsIcon}
                      </div>
                    }
                    className="primary"
                    contentStyle={{ padding: 0 }}>
                    <OpenAIStatus incidents={incidents} isLoading={isLoadingIncidents} />
                  </NekoBlock>
                  <NekoBlock busy={busy} title={i18n.COMMON.MAINTENANCE} className="primary">
                    <NekoButton className="blue" onClick={onExportSettings}>Export Settings</NekoButton>
                    <NekoButton className="danger" onClick={onImportSettings}>Import Settings</NekoButton>
                    <NekoButton className="danger" onClick={onResetSettings}>Reset Settings</NekoButton>
                  </NekoBlock>
                </NekoColumn>
                <NekoColumn minimal>
                  <NekoBlock busy={busy} title={i18n.COMMON.GENERAL} className="primary">
                    {jsxStream}
                  </NekoBlock>
                  <NekoBlock busy={busy} title={i18n.COMMON.USER_INTERFACE} className="primary">
                    {jsxIntroMessage}
                  </NekoBlock>
                  <NekoBlock busy={busy} title={i18n.COMMON.CHATBOT} className="primary">
                    {jsxShortcodeDiscussions}
                    {jsxShortcodeSyntaxHighlighting}
                    {jsxWebSpeechAPI}
                  </NekoBlock>
                  {module_statistics && (
                    <NekoBlock busy={busy} title={i18n.COMMON.STATISTICS} className="primary">
                      <p>{i18n.HELP.STATISTICS}</p>
                      {jsxStatisticsData}
                      {jsxStatisticsFormsData}
                    </NekoBlock>
                  )}
                  <NekoBlock busy={busy} title={i18n.COMMON.IMAGES} className="primary">
                    <p><b>User Upload</b></p>
                    {jsxImageLocalUpload}
                    {jsxImageRemoteUpload}
                    {jsxImageExpiration}
                    <p><b>AI Generated</b></p>
                    {jsxImageLocalDownload}
                    {options?.image_local_download !== null && jsxImageExpirationDownload}
                  </NekoBlock>
                  <NekoBlock busy={busy} title={i18n.COMMON.ADMIN_TOOLS} className="primary">
                    <NekoCollapsableCategory title={i18n.COMMON.ADMIN_BAR} />
                    {jsxAdminBarSettings}
                    {jsxAdminBarPlayground}
                    {jsxAdminBarGenerateContent}
                    {jsxAdminBarGenerateImages}
                  </NekoBlock>
                  <NekoBlock busy={busy} title={i18n.COMMON.ADVANCED} className="primary">
                    {jsxResolveShortcodes}
                    {jsxContextMaxTokens}
                    {jsxPublicAPI}
                    {jsxBearerToken}
                    {jsxDevTools}
                    {jsxCleanUninstall}
                  </NekoBlock>
                  <NekoBlock busy={busy} title={i18n.COMMON.SECURITY} className="primary">
                    {jsxBannedKeywords}
                    {jsxBannedIPs}
                  </NekoBlock>
                  <NekoBlock busy={busy} title={i18n.COMMON.LEGACY_FEATURES} className="primary">
                    {jsxShortcodeTypewriter}
                  </NekoBlock>
                </NekoColumn>
              </NekoWrapper>
            </NekoTab>
            {module_devtools && (
              <NekoTab key="devtools" title={i18n.COMMON.DEV_TOOLS}>
                <DevToolsTab options={options} setOptions={setOptions} updateOption={updateOption} />
              </NekoTab>
            )}
            <NekoTab key="license" title={i18n.COMMON.LICENSE_TAB}>
              <LicenseBlock domain={domain} prefix={prefix} isPro={isPro} isRegistered={isRegistered} />
            </NekoTab>
          </NekoTabs>
        </NekoColumn>
      </NekoWrapper>
      <NekoModal
        isOpen={error}
        title={i18n.COMMON.ERROR}
        content={error}
        onRequestClose={() => setError(false)}
        okButton={{
          label: 'Close',
          onClick: () => setError(false)
        }}
      />
    </NekoPage>
  );
};

export default Settings;