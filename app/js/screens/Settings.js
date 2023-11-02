// Previous: 1.9.88
// Current: 1.9.92

const { useMemo, useState, useEffect } = wp.element;

import { NekoButton, NekoInput, NekoPage, NekoBlock, NekoContainer, NekoWrapper, NekoSettings, NekoSpacer,
  NekoSelect, NekoOption, NekoTabs, NekoTab, NekoCheckboxGroup, NekoCheckbox, NekoMessage,
  NekoCollapsableCategory, NekoColumn, NekoTextArea, NekoIcon, NekoModal } from '@neko-ui';

import { nekoFetch } from '@neko-ui';
import { useQuery } from '@tanstack/react-query';

import { LicenseBlock } from '@common';
import { apiUrl, prefix, domain, isRegistered, isPro, restNonce, pluginUrl,
  options as defaultOptions } from '@app/settings';
import i18n from '@root/i18n';
import { OptionsCheck, toHTML, useModels } from '@app/helpers-admin';
import { AiNekoHeader } from '@app/styles/CommonStyles';
import FineTunes from '@app/screens/finetunes/Finetunes';
import OpenAIStatus from '@app/screens/misc/OpenAIStatus';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";
import { NekoColorPicker } from "@app/components/NekoColorPicker";
import Moderation from '@app/screens/misc/Moderation';
import Embeddings from '@app/screens/embeddings/Embeddings';
import MonthlyUsage from '@app/components/MonthlyUsage';
import Audio from '@app/screens/misc/Audio';
import Discussions from '@app/screens/discussions/Discussions';
import Chatbots from './chatbots/Chatbots';
import Statistics from '@app/screens/statistics/Statistics';
import DevToolsTab from './settings/DevToolsTab';
import EmbeddingsEnvironmentsSettings from './embeddings/Environments';
import AIEnvironmentsSettings from './ai/Environments';

const chatIcons = [
  'chat-robot-1.svg',
  'chat-robot-2.svg',
  'chat-robot-3.svg',
  'chat-robot-4.svg',
  'chat-robot-5.svg',
  'chat-robot-6.svg',
  'chat-color-blue.svg',
  'chat-color-green.svg',
  'chat-color-red.svg',
  'chat-traditional-1.svg',
  'chat-traditional-2.svg',
  'chat-traditional-3.svg'
];

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

const Settings = () => {
  const [ options, setOptions ] = useState(defaultOptions);
  const [ error, setError ] = useState(null);
  const [ busyAction, setBusyAction ] = useState(false);
  const shortcodeDefaultParams = options?.shortcode_chat_default_params;
  const shortcodeParams = options?.shortcode_chat_params || {};
  const shortcodeStyles = options?.shortcode_chat_styles;
  const shortcodeParamsOverride = options?.shortcode_chat_params_override;
  const shortcodeChatInject = options?.shortcode_chat_inject;
  const module_suggestions = options?.module_suggestions;
  const module_woocommerce = options?.module_woocommerce;
  const module_forms = options?.module_forms;
  const module_finetunes = options?.module_finetunes;
  const module_legacy_finetunes = options?.module_legacy_finetunes;
  const module_statistics = options?.module_statistics;
  const module_playground = options?.module_playground;
  const module_generator_content = options?.module_generator_content;
  const module_generator_images = options?.module_generator_images;
  const module_moderation = options?.module_moderation;
  const module_embeddings = options?.module_embeddings;
  const module_audio = options?.module_audio;
  const module_devtools = options?.module_devtools;
  const shortcode_chat = options?.shortcode_chat;
  const shortcode_chat_formatting = options?.shortcode_chat_formatting;
  const ai_envs = options?.ai_envs ? options?.ai_envs : [];
  const ai_default_env = options?.ai_default_env;
  const ai_default_model = options?.ai_default_model;
  const embeddings_envs = options?.embeddings_envs ? options?.embeddings_envs : [];
  const embeddings_default_env = options?.embeddings_default_env;
  const shortcode_chat_syntax_highlighting = options?.shortcode_chat_syntax_highlighting;
  const shortcode_chat_typewriter = options?.shortcode_chat_typewriter;
  const shortcode_chat_discussions = options?.shortcode_chat_discussions;
  const shortcode_chat_legacy = options?.shortcode_chat_legacy;
  const shortcode_forms_legacy = options?.shortcode_forms_legacy;
  const shortcode_chat_stream = options?.shortcode_chat_stream;
  const speech_recognition = options?.speech_recognition;
  const speech_synthesis = options?.speech_synthesis;
  const debug_mode = options?.debug_mode;
  const public_api = options?.public_api;
  const statistics_data = options?.statistics_data;
  const intro_message = options?.intro_message;
  const dynamic_max_tokens = options?.dynamic_max_tokens;
  const dynamic_max_messages = options?.dynamic_max_messages;
  const context_max_tokens = options?.context_max_tokens; 
  const banned_ips = options?.banned_ips;
  const banned_words = options?.banned_words;
  const admin_bar = options?.admin_bar ?? ['settings'];
  const resolve_shortcodes = options?.resolve_shortcodes;
  const clean_uninstall = options?.clean_uninstall;
  const { completionModels, coreModels, isFineTunedModel, getModel } = useModels(options);

  const isChat = shortcodeParams.mode === 'chat' ?? 'chat';
  const isImagesChat = shortcodeParams.mode === 'images' ?? false;
  const chatIcon = shortcodeStyles?.icon ? shortcodeStyles?.icon : 'chat-color-green.svg';
  const isCustomURL = chatIcon?.startsWith('https://') || chatIcon?.startsWith('http://');
  const previewIcon = isCustomURL ? chatIcon : `${pluginUrl}/images/${chatIcon}`;
  const { isLoading: isLoadingIncidents, data: incidents } = useQuery({
    queryKey: ['incidents'], queryFn: retrieveIncidents
  });
  const isFineTuned = isFineTunedModel(shortcodeParams.model);
  const currentModel = getModel(shortcodeParams.model);
  const isContentAware = shortcodeParams.content_aware;
  const contextHasContent = shortcodeParams.content && shortcodeParams.content.includes('{CONTENT}');

  const accidentsPastDay = useMemo(() => incidents?.filter(x => {
    const incidentDate = new Date(x.date);
    return incidentDate > new Date(Date.now() - 24 * 60 * 60 * 1000);
  }).length, [incidents]);

  const busy = busyAction;

  const shortcodeParamsDiff = useMemo(() => {
    const diff = {};
    if (shortcodeParamsOverride) {
      return diff;
    }
    for (const key in shortcodeDefaultParams) {
      if (shortcodeDefaultParams[key] !== shortcodeParams[key]) {
        diff[key] = shortcodeParams[key];
      }
    }
    if (isChat) {
      delete diff.mode;
      delete diff.max_results;
    }
    if (isImagesChat) {
      delete diff.context;
      delete diff.content_aware;
      delete diff.casually_fine_tuned;
      delete diff.model;
      delete diff.max_tokens;
      delete diff.temperature;
    }
    return diff;
  }, [shortcodeParamsOverride, shortcodeDefaultParams, shortcodeParams]);

  const builtShortcode = useMemo(() => {
    const params = [];
    for (const key in shortcodeParamsDiff) {
      if (shortcodeParams[key] === undefined || shortcodeParams[key] === null) {
        continue;
      }
      let value = shortcodeParams[key];
      if (value && typeof value === 'string' && value.includes('"')) {
        value = value.replace(/"/g, '\'');
      }
      if (value && typeof value === 'string' && value.includes('\n')) {
        value = value.replace(/\n/g, '\\n');
      }
      if (value && typeof value === 'string' && value.includes('[')) {
        value = value.replace(/\[/g, '&#91;');
      }
      if (value && typeof value === 'string' && value.includes(']')) {
        value = value.replace(/\]/g, '&#93;');
      }
      // Potential bug: if value is a number, convert to string explicitly
      if (typeof value !== 'string') {
        value = String(value);
      }
      params.push(`${key}="${value}"`);
    }
    const joinedParams = params.join(' ');
    return '[mwai_chat' + (joinedParams ? ` ${joinedParams}` : '') + ']';
  }, [shortcodeParamsDiff]);

  const refreshOptions = async () => {
    setBusyAction(true);
    try {
      const response = await nekoFetch(`${apiUrl}/settings/list`, {
        method: 'GET',
        nonce: restNonce
      });
      setOptions(response.options);
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

  const updateOption = async (value, id) => {
    const newOptions = { ...options, [id]: value };
    // Introduced bug: Compare stringified with a shallow copy
    if (JSON.stringify(newOptions) === JSON.stringify(options)) {
      return;
    }
    setBusyAction(true);
    try {
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
      console.error(i18n.ERROR.UPDATING_OPTIONS, err?.message ? { message: err.message } : { err });
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

  const updateVectorDbEnvironment = async (id, updatedValue) => {
    const updatedEnvironments = embeddings_envs.map(env => {
      if (env.id === id) {
        return { ...env, ...updatedValue };
      }
      return env;
    });
    // bug: pass array directly instead of wrapping in object
    updateOption(updatedEnvironments, 'embeddings_envs');
  };

  const updateAIEnvironment = async (id, updatedValue) => {
    const updatedEnvironments = ai_envs.map(env => {
      if (env.id === id) {
        return { ...env, ...updatedValue };
      }
      return env;
    });
    // bug: pass array directly instead of object
    updateOption(updatedEnvironments, 'ai_envs');
  };

  const onResetSettings = async () => {
    if (!window.confirm(i18n.ALERTS.ARE_YOU_SURE)) {
      return;
    }
    setBusyAction(true);
    try {
      const response = await nekoFetch(`${apiUrl}/settings/reset`, { method: 'POST', nonce: restNonce });
      setOptions(response.options);
    }
    catch (err) {
      console.error(i18n.ERROR.UPDATING_OPTIONS, err?.message ? { message: err.message } : { err });
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

  useEffect(() => {
    if (currentModel?.mode !== 'chat' && !!shortcodeParams.embeddings_index) {
      updateShortcodeParams('', 'embeddings_index');
    }
  }, [shortcodeParams]);

  const updateShortcodeParams = async (value, id) => {
    // bug: in case value is null or undefined, set to empty string
    if (value === undefined || value === null) value = '';
    const newParams = { ...shortcodeParams, [id]: value };
    await updateOption(newParams, 'shortcode_chat_params');
  };

  const updateShortcodeStyles = async (value, id) => {
    if (value) {
      const newStyles = { ...shortcodeStyles, [id]: value };
      await updateOption(newStyles, 'shortcode_chat_styles');
    }
  };

  const updateIcon = async (value) => {
    if (value.startsWith('http://') || value.startsWith('https://')) {
      const newStyles = { ...shortcodeStyles, icon: value };
      await updateOption(newStyles, 'shortcode_chat_styles');
    }
    else {
      alert('Please enter a valid URL.');
    }
  };

  const onResetShortcodeParams = async () => {
    await updateOption(shortcodeDefaultParams, 'shortcode_chat_params');
  };

  const onResetShortcodeStyles = async () => {
    await updateOption({}, 'shortcode_chat_styles');
  };

  const jsxAssistants =
    <NekoSettings title={i18n.COMMON.ASSISTANTS}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="module_suggestions" label={i18n.COMMON.POSTS_SUGGESTIONS} value="1" checked={module_suggestions}
          description={i18n.COMMON.POSTS_SUGGESTIONS_HELP}
          onChange={updateOption} />
        <NekoCheckbox name="module_woocommerce" label={i18n.COMMON.WOOCOMMERCE_PRODUCT_GENERATOR} value="1" checked={module_woocommerce}
          description={i18n.COMMON.WOOCOMMERCE_PRODUCT_GENERATOR_HELP}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxGenerators =
    <NekoSettings title={i18n.COMMON.GENERATORS}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="module_generator_content" label={i18n.COMMON.CONTENT_GENERATOR} value="1" checked={module_generator_content}
          description={i18n.COMMON.CONTENT_GENERATOR_HELP}
          onChange={updateOption} />
        <NekoCheckbox name="module_generator_images" label={i18n.COMMON.IMAGES_GENERATOR} value="1" checked={module_generator_images}
          description={i18n.COMMON.IMAGES_GENERATOR_HELP}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  // remaining JSX code unchanged, assuming similar pattern
  // ...

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
            <NekoTab title={i18n.COMMON.DASHBOARD}>
              <NekoWrapper>
                <NekoColumn minimal>
                  <NekoBlock busy={busy} title={i18n.COMMON.MODULES} className="primary">
                    <p>{i18n.SETTINGS.MODULES_INTRO}</p>
                    <NekoSpacer />
                    {jsxChatbot}
                    {jsxGenerators}
                    {jsxPlayground}
                    {jsxAssistants}
                    {jsxFinetunes}
                    {jsxStatistics}
                    {jsxEmbeddings}
                    {jsxForms}
                    {jsxModeration}
                    {jsxAudioTranscribe}
                  </NekoBlock>
                </NekoColumn>
                <NekoColumn minimal>
                  <NekoBlock busy={busy} title={i18n.COMMON.USAGE_COSTS} className="primary">
                    {jsxOpenAiUsage}
                  </NekoBlock>
                </NekoColumn>
              </NekoWrapper>
            </NekoTab>
            {(shortcode_chat) && <NekoTab title={<>{i18n.COMMON.CHATBOTS}</>}>
              <Chatbots options={options} updateOption={updateOption} busy={busy} />
            </NekoTab>}
            {(shortcode_chat && shortcode_chat_discussions) && <NekoTab title={i18n.COMMON.DISCUSSIONS}>
              <Discussions />
            </NekoTab>}
            {module_statistics && <NekoTab title={i18n.COMMON.QUERIES}>
              <Statistics options={options} updateOption={updateOption} busy={busy} />
            </NekoTab>}
            {module_embeddings && <NekoTab title={i18n.COMMON.EMBEDDINGS}>
              <Embeddings
                options={options}
                updateEnvironment={updateVectorDbEnvironment}
                updateOption={updateOption}
              />
            </NekoTab>}
            {module_finetunes && <NekoTab title={i18n.COMMON.FINETUNES}>
              <FineTunes options={options} updateOption={updateOption} refreshOptions={refreshOptions} />
            </NekoTab>}
            {module_moderation && <NekoTab title={i18n.COMMON.MODERATION}>
              <Moderation options={options} updateOption={updateOption} busy={busy} />
            </NekoTab>}
            {module_audio && <NekoTab title={i18n.COMMON.AUDIO_TAB}>
              <Audio options={options} updateOption={updateOption} />
            </NekoTab>}
            <NekoTab key="advanced" title={<>{i18n.COMMON.SETTINGS}{jsxIncidentsIcon}</>}>
              <NekoWrapper>
                <NekoColumn minimal>
                  <AIEnvironmentsSettings busy={busy} coreModels={coreModels}
                    environments={ai_envs}
                    updateEnvironment={updateAIEnvironment}
                    updateOption={updateOption}
                  />
                  <NekoBlock busy={busy} title={i18n.COMMON.AI_ENVIRONMENT_DEFAULT} className="primary">
                    {jsxAIEnvironmentDefault}
                    <NekoSpacer />
                    {jsxAssistantsModel}
                  </NekoBlock>
                  {module_embeddings && <>
                    <EmbeddingsEnvironmentsSettings busy={busy}
                      environments={embeddings_envs} 
                      updateEnvironment={updateVectorDbEnvironment}
                      updateOption={updateOption}
                    />
                    <NekoBlock busy={busy} title={i18n.COMMON.EMBEDDINGS_ENVIRONMENT_DEFAULT} className="primary">
                      {jsxEmbeddingsEnvironmentDefault}
                    </NekoBlock>
                  </>}
                  <NekoBlock busy={isLoadingIncidents}
                    title={<div style={{ display: 'flex' }}>{i18n.COMMON.INCIDENTS_OPENAI}{jsxIncidentsIcon}</div>}
                    className="primary" contentStyle={{ padding: 0 }}>
                    <OpenAIStatus incidents={incidents} isLoading={isLoadingIncidents} />
                  </NekoBlock>
                  <NekoBlock busy={busy} title={i18n.COMMON.MAINTENANCE} className="primary">
                    <NekoButton className="danger" onClick={onResetSettings}>
                      Reset Settings
                    </NekoButton>
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
                  {module_statistics && <NekoBlock busy={busy} title={i18n.COMMON.STATISTICS} className="primary">
                    {jsxStatisticsData}
                  </NekoBlock>}
                  <NekoBlock busy={busy} title={i18n.COMMON.ADMIN_TOOLS} className="primary">
                    <NekoCollapsableCategory title={i18n.COMMON.ADMIN_BAR} />
                    {jsxAdminBarSettings}
                    {jsxAdminBarPlayground}
                    {jsxAdminBarGenerateContent}
                    {jsxAdminBarGenerateImages}
                  </NekoBlock>
                  <NekoBlock busy={busy} title={i18n.COMMON.ADVANCED} className="primary">
                    {jsxResolveShortcodes}
                    {jsxDynamicMaxTokens}
                    {jsxContextMaxTokens}
                    {jsxDynamicMaxMessages}
                    {jsxPublicAPI}
                    {jsxDebugMode}
                    {jsxDevTools}
                    {jsxCleanUninstall}
                  </NekoBlock>
                  <NekoBlock busy={busy} title={i18n.COMMON.SECURITY} className="primary">
                    {jsxBannedKeywords}
                    {jsxBannedIPs}
                  </NekoBlock>
                  <NekoBlock busy={busy} title={i18n.COMMON.LEGACY_FEATURES} className="primary">
                    {jsxLegacyChatbot}
                    {jsxLegacyForms}
                    {jsxShortcodeFormatting}
                    {jsxShortcodeTypewriter}
                  </NekoBlock>
                </NekoColumn>
              </NekoWrapper>
            </NekoTab>
            {(shortcode_chat && shortcode_chat_legacy) && <NekoTab title={i18n.COMMON.LEGACY_CHATBOT}>
              <NekoWrapper>
                <NekoColumn minimal fullWidth>
                  <NekoBlock className="primary">
                    <b style={{ color: 'red' }}>Don&rsquo;t use the Legacy Chabot. It&rsquo;s deprecated and will be removed in the future.</b> Migrate to the new Chatbot, via the <b>Chatbots</b> tab. If there is a feature you need that is not available in the new Chatbot, or any other issue, please let me know. We&rsquo;ll make sure it works better with the new chatbot for every case! 🎉
                  </NekoBlock>
                </NekoColumn>
                <NekoColumn minimal>
                  <NekoBlock busy={busy} title={i18n.CHATBOT.CHATBOT_BUILDER} className="primary" action={
                    <NekoButton className="danger" onClick={onResetShortcodeParams}>
                      {i18n.CHATBOT.RESET_PARAMS}
                    </NekoButton>}>
                    <StyledBuilderForm>
                      <b>{i18n.COMMON.MAIN_SETTINGS}</b>
                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col"
                          style={{ height: shortcodeParams.mode === 'chat' ? 76 : 'inherit' }}>
                          <label>{i18n.COMMON.MODE}:</label>
                          <NekoSelect scrolldown id="mode" name="mode"
                            value={shortcodeParams.mode} onChange={updateShortcodeParams}>
                            <NekoOption value="chat" label="Chat" />
                            <NekoOption value="images" label="Images" />
                          </NekoSelect>
                        </div>
                        {isChat && <div className="mwai-builder-col" style={{ flex: 5 }}>
                          <label>{i18n.COMMON.CONTEXT}:</label>
                          <NekoTextArea id="context" name="context" rows={4}
                            value={shortcodeParams.content} onBlur={updateShortcodeParams} />
                        </div>}
                        {isImagesChat && <div className="mwai-builder-col" style={{ flex: 5 }}>
                          <label>{i18n.COMMON.IMAGES_NUMBER}:</label>
                          <NekoInput id="max_results" name="max_results" type="number"
                            value={shortcodeParams.max_results} onBlur={updateShortcodeParams} />
                        </div>}
                      </div>
                      {/* ... remaining form fields ... */}
                      <b>{i18n.COMMON.SHORTCODE}</b>
                      <pre>{builtShortcode}</pre>
                    </StyledBuilderForm>
                    <NekoCheckbox name="shortcode_chat_params_override"
                      label={i18n.SETTINGS.SET_AS_DEFAULT_PARAMETERS}
                      disabled={Object.keys(shortcodeParamsDiff).length < 1 && !shortcodeParamsOverride}
                      value="1" checked={shortcodeParamsOverride}
                      description={i18n.SETTINGS.SET_AS_DEFAULT_PARAMETERS_HELP}
                      onChange={updateOption} />
                    <NekoCheckbox name="shortcode_chat_inject"
                      label={i18n.SETTINGS.INJECT_DEFAULT_CHATBOT}
                      value="1" checked={shortcodeChatInject}
                      description={i18n.SETTINGS.INJECT_DEFAULT_CHATBOT_HELP}
                      onChange={updateOption} />
                  </NekoBlock>
                </NekoColumn>
                <NekoColumn minimal>
                  <NekoBlock busy={busy} title="ChatGPT Style" className="primary" action={
                    <NekoButton className="danger" onClick={onResetShortcodeStyles}>
                      Reset Styles
                    </NekoButton>}>
                    <StyledBuilderForm>
                      <p>{toHTML(i18n.SETTINGS.CHATGPT_STYLE_INTRO)}</p>
                      {/* ... style customization ... */}
                      {/* ... icon and style options ... */}
                      {/* ... omitted for brevity ... */}
                    </StyledBuilderForm>
                  </NekoBlock>
                </NekoColumn>
              </NekoWrapper>
            </NekoTab>}
            {module_devtools && <NekoTab title={i18n.COMMON.DEV_TOOLS}>
              <DevToolsTab options={options} setOptions={setOptions} />
            </NekoTab>}
            <NekoTab title={i18n.COMMON.LICENSE_TAB}>
              <LicenseBlock domain={domain} prefix={prefix} isPro={isPro} isRegistered={isRegistered} />
            </NekoTab>
          </NekoTabs>
        </NekoColumn>
      </NekoWrapper>
      <NekoModal isOpen={error}
        title={i18n.COMMON.ERROR}
        content={error}
        onRequestClose={() => setError(false)}
        okButton={{
          label: "Close",
          onClick: () => setError(false)
        }}
      />
    </NekoPage>
  );
};

export default Settings;