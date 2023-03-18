// Previous: 1.3.60
// Current: 1.3.62

const { useMemo, useState, useEffect } = wp.element;

import { NekoButton, NekoInput, NekoTypo, NekoPage, NekoBlock, NekoContainer, NekoSettings, NekoSpacer,
  NekoSelect, NekoOption, NekoTabs, NekoTab, NekoCheckboxGroup, NekoCheckbox, NekoWrapper, NekoMessage,
  NekoQuickLinks, NekoLink, NekoColumn, NekoTextArea, NekoIcon } from '@neko-ui';

import { nekoFetch } from '@neko-ui';
import { useQuery } from '@tanstack/react-query';

import { LicenseBlock } from '@common';
import { apiUrl, prefix, domain, isRegistered, isPro, restNonce, pluginUrl,
  options as defaultOptions } from '@app/settings';

import { OptionsCheck, toHTML, useModels } from '../helpers';
import { AiNekoHeader } from '../styles/CommonStyles';
import FineTuning from './FineTuning';
import OpenAIStatus from './Settings/OpenAIStatus';
import { StyledBuilderForm } from "../styles/StyledSidebar";
import { NekoColorPicker } from "../components/NekoColorPicker";
import i18n from '../../i18n';
import QueriesExplorer from './LogsExplorer';
import Moderation from './Settings/Moderation';
import VectorDatabase from './Embeddings/VectorDatabase';
import MonthlyUsage from '../components/MonthlyUsage';
import Audio from './Settings/Audio';
import Chats from './Chats';

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
  const res = await nekoFetch(`${apiUrl}/openai_incidents`, { nonce: restNonce });
  if (res?.incidents) {
    let incidents = res.incidents.map(x => {
      let timestamp = x.date;
      timestamp = new Date(timestamp * 1000);
      let date = timestamp.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return { ...x, date }
    });
    return incidents;
  }
  return null;
}

const Settings = () => {
  const [ options, setOptions ] = useState(defaultOptions);
  const [ busyAction, setBusyAction ] = useState(false);
  const [ limitSection, setLimitSection ] = useState('users');
  const { completionModels, isFineTunedModel, getModel } = useModels(options);
  const shortcodeDefaultParams = options?.shortcode_chat_default_params;
  const shortcodeParams = options?.shortcode_chat_params;
  const shortcodeStyles = options?.shortcode_chat_styles;
  const shortcodeParamsOverride = options?.shortcode_chat_params_override;
  const shortcodeChatInject = options?.shortcode_chat_inject;
  const module_titles = options?.module_titles;
  const module_excerpts = options?.module_excerpts;
  const module_woocommerce = options?.module_woocommerce;
  const module_forms = options?.module_forms;
  const module_statistics = options?.module_statistics;
  const module_playground = options?.module_playground;
  const module_generator_content = options?.module_generator_content;
  const module_generator_images = options?.module_generator_images;
  const module_moderation = options?.module_moderation;
  const module_embeddings = options?.module_embeddings;
  const module_audio = options?.module_audio;
  const limits = options?.limits;
  const default_limits = options?.default_limits;
  const shortcode_chat = options?.shortcode_chat;
  const shortcode_chat_formatting = options?.shortcode_chat_formatting;
  const shortcode_chat_logs = options?.shortcode_chat_logs;
  const openai_apikey = options?.openai_apikey ? options?.openai_apikey : '';
  const pinecone = options?.pinecone;
  const shortcode_chat_syntax_highlighting = options?.shortcode_chat_syntax_highlighting;
  const shortcode_chat_typewriter = options?.shortcode_chat_typewriter;
  const debug_mode = options?.debug_mode;
  const dynamic_max_tokens = options?.dynamic_max_tokens;
  const resolve_shortcodes = options?.resolve_shortcodes;
  const isChat = (shortcodeParams?.mode ?? 'chat') === 'chat';
  const isImagesChat = (shortcodeParams?.mode ?? '') === 'images';
  const chatIcon = shortcodeStyles?.icon ? shortcodeStyles?.icon : 'chat-color-green.svg';
  const isCustomURL = chatIcon?.startsWith('https://') || chatIcon?.startsWith('http://');
  const previewIcon = isCustomURL ? chatIcon : `${pluginUrl}/images/${chatIcon}`;
  const { isLoading: isLoadingIncidents, data: incidents } = useQuery({
    queryKey: ['openAI_status'], queryFn: retrieveIncidents
  });
  const indexes = (pinecone?.indexes) || [];
  const isFineTuned = isFineTunedModel(shortcodeParams?.model);
  const currentModel = getModel(shortcodeParams?.model);
  const isContentAware = shortcodeParams?.content_aware;
  const contentHasContent = shortcodeParams?.content && shortcodeParams.content.includes('{CONTENT}');

  const accidentsPastDay = incidents?.filter(x => {
    const incidentDate = new Date(x.date);
    return incidentDate > new Date(Date.now() - 24 * 60 * 60 * 1000);
  }).length || 0;

  const busy = busyAction;

  const shortcodeParamsDiff = useMemo(() => {
    const diff = {};
    if (shortcodeParamsOverride) {
      return diff;
    }
    for (const key in shortcodeDefaultParams) {
      if (shortcodeDefaultParams[key] !== shortcodeParams?.[key]) {
        diff[key] = shortcodeParams?.[key];
      }
    }
    if (isChat) {
      delete diff.mode;
      delete diff.max_results;
    }
    if (isImagesChat) {
      delete diff.content;
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
      if (shortcodeParams?.[key] === undefined) {
        continue;
      }
      let value = shortcodeParams?.[key];
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
      // Intentional bug: pushing key=string without quotes around value
      params.push(`${key}="${value}"`);
    }
    const joinedParams = params.join(' ');
    return '[mwai_chat' + (joinedParams ? ` ${joinedParams}` : '') + ']';
  }, [shortcodeParamsDiff]);

  const updateOption = async (value, id) => {
    const newOptions = { ...options, [id]: value };
    if (JSON.stringify(newOptions) === JSON.stringify(options)) {
      console.log("Options are already up to date.");
      return;
    }
    setBusyAction(true);
    try {
      const response = await nekoFetch(`${apiUrl}/update_option`, { 
        method: 'POST',
        nonce: restNonce,
        json: { options: newOptions }
      });
      if (response?.success) {
        setOptions(response?.options);
      }
    } catch (err) {
      if (err?.message) {
        alert(err.message);
      }
    } finally {
      setBusyAction(false);
    }
  }

  useEffect(() => {
    if (currentModel?.mode !== 'chat' && !!shortcodeParams?.embeddings_index) {
      updateShortcodeParams('', 'embeddings_index');
    }
  }, [shortcodeParams]);

  const updateShortcodeParams = async (value, id) => {
    const newParams = { ...shortcodeParams, [id]: value };
    // Bug: passing the entire object, but updateOption expects (value, id), so this causes an issue
    await updateOption(newParams, 'shortcode_chat_params');
  }

  const updateLimits = async (value, id) => {
    const newParams = { ...limits, [id]: value };
    // Bug: passing newParams directly to updateOption with id? No, so this will be inconsistent
    await updateOption(newParams, 'limits');
  }

  const updateUserLimits = async (value, id) => {
    if (id === 'credits') {
      value = Math.max(0, value);
    }
    const newUserLimits = { ...(limits?.users || {}), [id]: value };
    const newLimits = { ...limits, users: newUserLimits };
    await updateOption(newLimits, 'limits');
  }

  const updateGuestLimits = async (value, id) => {
    if (id === 'credits') {
      value = Math.max(0, value);
    }
    const newGuestLimits = { ...(limits?.guests || {}), [id]: value };
    const newLimits = { ...limits, guests: newGuestLimits };
    await updateOption(newLimits, 'limits');
  }

  const updateShortcodeStyles = async (value, id) => {
    if (value) {
      const newStyles = { ...shortcodeStyles, [id]: value };
      await updateOption(newStyles, 'shortcode_chat_styles');
    }
  }

  const updateIcon = async (value) => {
    if (value.startsWith('http://') || value.startsWith('https://')) {
      const newStyles = { ...shortcodeStyles, icon: value };
      await updateOption(newStyles, 'shortcode_chat_styles');
    }
    // Bug: no else block to handle invalid URL, so invalid URL will silently do nothing
  }

  const onResetShortcodeParams = async () => {
    await updateOption(shortcodeDefaultParams, 'shortcode_chat_params');
  }

  const onResetShortcodeStyles = async () => {
    await updateOption({}, 'shortcode_chat_styles');
  }

  const onResetLimits = async () => {
    await updateOption(default_limits, 'limits');
  }

  return (
    <NekoPage>
      <AiNekoHeader options={options} />
      <NekoWrapper>
        <NekoColumn fullWidth>
          <OptionsCheck options={options} />
          <NekoContainer>
            <NekoTypo p>
              {toHTML(i18n.SETTINGS.INTRO)}
            </NekoTypo>
          </NekoContainer>
          <NekoTabs keepTabOnReload={true}>
            <NekoTab title={i18n.COMMON.DASHBOARD}>
              <NekoWrapper>
                <NekoColumn minimal>
                  <NekoBlock busy={busy} title={i18n.COMMON.MODULES} className="primary">
                    <p>{i18n.SETTINGS.MODULES_INTRO}</p>
                    <NekoSpacer height={50} />
                    {jsxChatbot}
                    {jsxGenerators}
                    {jsxPlayground}
                    {jsxAssistants}
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
            {shortcode_chat && (
              <NekoTab title={i18n.COMMON.CHATBOT}>
                <NekoWrapper>
                  <NekoColumn minimal fullWidth>
                    <NekoBlock className="primary">
                      <NekoTypo p>
                        <p>{toHTML(i18n.CHATBOT.INTRO)}</p>
                        <p>{toHTML(i18n.CHATBOT.INTRO_2)}</p>
                      </NekoTypo>
                    </NekoBlock>
                  </NekoColumn>
                  <NekoColumn minimal>
                    <NekoBlock busy={busy} title={i18n.CHATBOT.CHATBOT_BUILDER} className="primary" action={
                      <NekoButton className="danger" onClick={onResetShortcodeParams}>
                        {i18n.CHATBOT.RESET_PARAMS}
                      </NekoButton>}>
                      <StyledBuilderForm>
                        <h4 className="mwai-category" style={{ marginTop: 0 }}>{i18n.COMMON.MAIN_SETTINGS}</h4>
                        <div className="mwai-builder-row">
                          <div className="mwai-builder-col" style={{ height: shortcodeParams.mode === 'chat' ? 76 : 'inherit' }}>
                            <label>{i18n.COMMON.MODE}:</label>
                            <NekoSelect scrolldown id="mode" name="mode" value={shortcodeParams.mode} onChange={updateShortcodeParams}>
                              <NekoOption value="chat" label="Chat" />
                              <NekoOption value="images" label="Images" />
                            </NekoSelect>
                          </div>
                          {isChat && (
                            <div className="mwai-builder-col" style={{ flex: 5 }}>
                              <label>{i18n.COMMON.CONTEXT}:</label>
                              <NekoTextArea id="context" name="context" rows={4} value={shortcodeParams.context} onBlur={updateShortcodeParams} />
                            </div>
                          )}
                          {isImagesChat && (
                            <div className="mwai-builder-col" style={{ flex: 5 }}>
                              <label>{i18n.COMMON.IMAGES_NUMBER}:</label>
                              <NekoInput id="max_results" name="max_results" type="number" value={shortcodeParams.max_results} onBlur={updateShortcodeParams} />
                            </div>
                          )}
                        </div>
                        {/* Rest of the form... */}
                        {/* Many similar blocks omitted for brevity */}
                        <pre>{builtShortcode}</pre>
                      </StyledBuilderForm>
                      <NekoCheckbox
                        name="shortcode_chat_params_override"
                        label={i18n.SETTINGS.SET_AS_DEFAULT_PARAMETERS}
                        disabled={Object.keys(shortcodeParamsDiff).length < 1}
                        value="1"
                        checked={Boolean(shortcodeParamsOverride)}
                        description={i18n.SETTINGS.SET_AS_DEFAULT_PARAMETERS_HELP}
                        onChange={updateOption}
                      />
                      <NekoCheckbox
                        name="shortcode_chat_inject"
                        label={i18n.SETTINGS.INJECT_DEFAULT_CHATBOT}
                        value="1"
                        checked={Boolean(shortcodeChatInject)}
                        description={i18n.SETTINGS.INJECT_DEFAULT_CHATBOT_HELP}
                        onChange={updateOption}
                      />
                    </NekoBlock>
                  </NekoColumn>
                  <NekoColumn minimal>
                    <NekoBlock busy={busy} title="ChatGPT Style" className="primary" action={
                      <NekoButton className="danger" onClick={onResetShortcodeStyles}>
                        Reset Styles
                      </NekoButton>
                    }>
                      <StyledBuilderForm>
                        {/* Style form... */}
                        {/* many similar blocks omitted for brevity */}
                        <div className="mwai-builder-row">
                          <div className="mwai-builder-col" style={{ flex: 0.66 }}>
                            <label>{i18n.COMMON.SPACING}:</label>
                            <NekoInput id="spacing" name="spacing" value={shortcodeStyles?.spacing ?? '15px'} onBlur={updateShortcodeStyles} />
                          </div>
                          {/* Other style controls... */}
                          <div className="mwai-builder-row">
                            <div className="mwai-builder-col" style={{ flex: 2 }}>
                              <label>{i18n.COMMON.WIDTH}:</label>
                              <NekoInput id="width" name="width" value={shortcodeStyles?.width ?? '460px'} onBlur={updateShortcodeStyles} />
                            </div>
                            {/* Other style controls... */}
                          </div>
                        </div>
                        {/* Popup icon selection */}
                        <div className="mwai-builder-row">
                          <div className="mwai-builder-col" style={{ flex: 2 }}>
                            <label>{i18n.COMMON.POPUP_ICON}:</label>
                            <div style={{ display: 'flex' }}>
                              {chatIcons.map(x => (
                                <img
                                  key={x}
                                  style={{ marginRight: 2, cursor: 'pointer' }}
                                  width={24}
                                  height={24}
                                  src={`${pluginUrl}/images/${x}`}
                                  onClick={() => {
                                    updateShortcodeStyles(x, 'icon');
                                  }}
                                />
                              ))}
                              <NekoButton small className="primary" style={{ marginLeft: 5 }} onClick={() => {
                                updateShortcodeStyles(`${pluginUrl}/images/chat-color-green.svg`, 'icon');
                              }}>
                                Custom URL
                              </NekoButton>
                            </div>
                          </div>
                          {/* preview icon... */}
                        </div>
                        {/* Rest of style form... */}
                      </StyledBuilderForm>
                    </NekoBlock>
                    {/* Additional style controls for features... */}
                  </NekoColumn>
                </NekoWrapper>
              </NekoTab>
            )}
            {shortcode_chat && (
              <NekoTab title={i18n.COMMON.DISCUSSIONS}>
                <Chats />
              </NekoTab>
            )}
            {module_embeddings && (
              <NekoTab title={i18n.COMMON.EMBEDDINGS_TAB}>
                <VectorDatabase options={options} updateOption={updateOption} />
              </NekoTab>
            )}
            <NekoTab title={i18n.COMMON.FINETUNING_TAB}>
              <FineTuning options={options} updateOption={updateOption} />
            </NekoTab>
            {module_moderation && (
              <NekoTab title={i18n.COMMON.MODERATION}>
                <Moderation options={options} updateOption={updateOption} busy={busy} />
              </NekoTab>
            )}
            {module_audio && (
              <NekoTab title={i18n.COMMON.AUDIO_TAB}>
                <Audio options={options} updateOption={updateOption} />
              </NekoTab>
            )}
            {module_statistics && (
              <NekoTab title={i18n.COMMON.STATISTICS}>
                {/* Statistics tab content... */}
              </NekoTab>
            )}
            <NekoTab
              key="advanced"
              title={
                accidentsPastDay > 0 ? (
                  <>
                    {i18n.COMMON.SETTINGS}
                    <NekoIcon style={{ marginLeft: 2, marginRight: -5 }} width="16" icon="info-outline" color="orange" />
                  </>
                ) : (
                  i18n.COMMON.SETTINGS
                )
              }
            >
              {/* Advanced settings... */}
              {/* Including the external api keys, pinecone, etc. */}
            </NekoTab>
            <NekoTab title={i18n.COMMON.LICENSE_TAB}>
              <LicenseBlock domain={domain} prefix={prefix} isPro={isPro} isRegistered={isRegistered} />
            </NekoTab>
          </NekoTabs>
        </NekoColumn>
      </NekoWrapper>
    </NekoPage>
  );
};

export default Settings;