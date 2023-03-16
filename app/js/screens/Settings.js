// Previous: 1.3.53
// Current: 1.3.56

const { useMemo, useState, useEffect } = wp.element;

import { NekoButton, NekoInput, NekoTypo, NekoPage, NekoBlock, NekoContainer, NekoSettings, NekoSpacer,
  NekoSelect, NekoOption, NekoTabs, NekoTab, NekoCheckboxGroup, NekoCheckbox, NekoWrapper, NekoMessage,
  NekoQuickLinks, NekoLink, NekoColumn, NekoTextArea } from '@neko-ui';

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
  const isContentAware = shortcodeParams?.content_aware;
  const contextHasContent = shortcodeParams?.context && shortcodeParams?.context.includes('{CONTENT}');
  const isChat = (shortcodeParams?.mode ?? 'chat') === 'chat';
  const isImagesChat = (shortcodeParams?.mode ?? false) === 'images';

  const chatIcon = shortcodeStyles?.icon ?? 'chat-color-green.svg';
  const isCustomURL = chatIcon.startsWith('https://') || chatIcon.startsWith('http://');
  const previewIcon = isCustomURL ? chatIcon : `${pluginUrl}/images/${chatIcon}`;

  const { isLoading: isLoadingIncidents, data: incidents } = useQuery({
    queryKey: ['openAI_status'], queryFn: retrieveIncidents
  });
  const indexes = (pinecone?.indexes) || [];
  const currentModel = getModel(shortcodeParams?.model);
  const isFineTuned = isFineTunedModel(shortcodeParams?.model);
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
        json: { 
          options: newOptions
        }
      });
      if (response.success) {
        setOptions(response.options);
      }
    }
    catch (err) {
      if (err.message) {
        alert(err.message);
      }
    }
    finally {
      setBusyAction(false);
    }
  }

  useEffect(() => {
    if (shortcodeParams?.model && getModel(shortcodeParams.model)?.mode !== 'chat') {
      updateShortcodeParams('', 'embeddings_index');
    }
  }, [shortcodeParams]);

  const updateShortcodeParams = async (value, id) => {
    const newParams = { ...shortcodeParams, [id]: value };
    await updateOption(newParams, 'shortcode_chat_params');
  }

  const updateLimits = async (value, id) => {
    const newParams = { ...limits, [id]: value };
    await updateOption(newParams, 'limits');
  }

  const updateUserLimits = async (value, id) => {
    if (id === 'credits') {
      value = Math.max(0, value);
    }
    const newLimits = { ...limits?.users, [id]: value };
    await updateOption({ ...limits, users: newLimits }, 'limits');
  }

  const updateGuestLimits = async (value, id) => {
    if (id === 'credits') {
      value = Math.max(0, value);
    }
    const newLimits = { ...limits?.guests, [id]: value };
    await updateOption({ ...limits, guests: newLimits }, 'limits');
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
    } else {
      alert('Please enter a valid URL.');
    }
  }

  const onResetShortcodeParams = async () => {
    await updateOption(shortcodeDefaultParams || {}, 'shortcode_chat_params');
  }

  const onResetShortcodeStyles = async () => {
    await updateOption({}, 'shortcode_chat_styles');
  }

  const onResetLimits = async () => {
    await updateOption(default_limits || {}, 'limits');
  }

  const jsxAssistants =
    <NekoSettings title={i18n.COMMON.ASSISTANTS}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="module_titles" label={i18n.COMMON.TITLES_SUGGESTIONS} value="1" checked={module_titles}
          description={i18n.COMMON.TITLES_SUGGESTIONS_HELP}
          onChange={updateOption} />
        <NekoCheckbox name="module_excerpts" label={i18n.COMMON.EXCERPTS_SUGGESTIONS} value="1" checked={module_excerpts}
          description={i18n.COMMON.EXCERPTS_SUGGESTIONS_HELP}
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

  const jsxPlayground = 
    <NekoSettings title={i18n.COMMON.PLAYGROUND}>
      <NekoCheckbox name="module_playground" label={i18n.COMMON.ENABLE} value="1"
        checked={module_playground}
        description={i18n.COMMON.PLAYGROUND_HELP}
        onChange={updateOption} />
    </NekoSettings>;

  const jsxForms = 
    <NekoSettings title={<>{i18n.COMMON.FORMS}<small style={{ position: 'relative', top: -3, fontSize: 8 }}> BETA</small></>}>
      <NekoCheckbox name="module_forms" label={i18n.COMMON.ENABLE} value="1"
        checked={module_forms} requirePro={true} isPro={isRegistered}
        description={i18n.COMMON.FORMS_HELP}
        onChange={updateOption} />
  </NekoSettings>;

  const jsxStatistics = 
    <NekoSettings title={<>{i18n.COMMON.STATISTICS}<small style={{ position: 'relative', top: -3, fontSize: 8 }}> BETA</small></>}>
      <NekoCheckbox name="module_statistics" label={i18n.COMMON.ENABLE} value="1"
        checked={module_statistics} requirePro={true} isPro={isRegistered}
        description={i18n.COMMON.STATISTICS_HELP}
        onChange={updateOption} />
    </NekoSettings>;

  const jsxModeration = 
    <NekoSettings title={<>{i18n.COMMON.MODERATION}<small style={{ position: 'relative', top: -3, fontSize: 8 }}> BETA</small></>}>
      <NekoCheckbox name="module_moderation" label={i18n.COMMON.ENABLE} value="1"
        checked={module_moderation}
        description={i18n.COMMON.MODERATION_HELP}
        onChange={updateOption} />
    </NekoSettings>;

  const jsxAudioTranscribe = 
    <NekoSettings title={<>{i18n.COMMON.AUDIO_TRANSCRIPTION}<small style={{ position: 'relative', top: -3, fontSize: 8 }}> BETA</small></>}>
      <NekoCheckbox name="module_audio" label={i18n.COMMON.ENABLE} value="1"
        checked={module_audio}
        description={i18n.COMMON.AUDIO_TRANSCRIPTION_HELP}
        onChange={updateOption} />
    </NekoSettings>;

  const jsxEmbeddings = 
    <NekoSettings title={<>{i18n.COMMON.EMBEDDINGS}<small style={{ position: 'relative', top: -3, fontSize: 8 }}> BETA</small></>}>
    <NekoCheckbox name="module_embeddings" label={i18n.COMMON.ENABLE} value="1"
      checked={module_embeddings} requirePro={true} isPro={isRegistered}
      description={i18n.COMMON.EMBEDDINGS_HELP}
      onChange={updateOption} />
  </NekoSettings>;

  const jsxChatbot =
    <NekoSettings title={i18n.COMMON.CHATBOT}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="shortcode_chat" label={i18n.COMMON.ENABLE} value="1" checked={shortcode_chat}
          description={i18n.COMMON.CHATBOT_HELP}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>
   ;

  const jsxShortcodeFormatting =
    <NekoSettings title={i18n.COMMON.FORMATTING}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="shortcode_chat_formatting" label={i18n.COMMON.ENABLE} value="1"
          checked={shortcode_chat_formatting}
          description={toHTML(i18n.COMMON.FORMATTING_HELP)}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxShortcodeTypewriter =
  <NekoSettings title={i18n.SETTINGS.TYPEWRITER_EFFECT}>
    <NekoCheckboxGroup max="1">
      <NekoCheckbox name="shortcode_chat_typewriter" label={i18n.COMMON.ENABLE} value="1"
        checked={shortcode_chat_typewriter}
        description={i18n.SETTINGS.TYPEWRITER_EFFECT_HELP}
        onChange={updateOption} />
    </NekoCheckboxGroup>
  </NekoSettings>;

  const jsxShortcodeSyntaxHighlighting =
    <NekoSettings title={i18n.COMMON.CODE}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="shortcode_chat_syntax_highlighting" label="Use Syntax Highlighting" value="1" checked={shortcode_chat_syntax_highlighting}
          description={<>Add syntax coloring to the code written by the chatbot.</>}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;


const jsxShortcodeChatLogs =
  <NekoSettings title={i18n.COMMON.LOGS}>
    <NekoCheckboxGroup max="1">
      <NekoSelect scrolldown id="shortcode_chat_logs" name="shortcode_chat_logs"
        value={shortcode_chat_logs} description="" onChange={updateOption}>
        <NekoOption value='' label="None" />
        <NekoOption value='file' label="Files (/uploads/chatbot folder)" />
      </NekoSelect>
    </NekoCheckboxGroup>
  </NekoSettings>;

  const jsxDebugMode =
    <NekoSettings title={i18n.COMMON.DEBUG_MODE}>
      <NekoCheckbox name="debug_mode" label={i18n.COMMON.ENABLE} value="1" checked={debug_mode}
        description={i18n.COMMON.DEBUG_MODE_HELP}
        onChange={updateOption} />
    </NekoSettings>;

  const jsxResolveShortcodes = 
    <NekoSettings title={i18n.COMMON.SHORTCODES}>
      <NekoCheckbox name="resolve_shortcodes" label={i18n.COMMON.RESOLVE} value="1" checked={resolve_shortcodes}
        description={i18n.HELP.RESOLVE_SHORTCODE}
        onChange={updateOption} />
    </NekoSettings>;

  const jsxDynamicMaxTokens =
    <NekoSettings title={i18n.COMMON.DYNAMIC_MAX_TOKENS}>
      <NekoCheckbox name="dynamic_max_tokens" label={i18n.COMMON.ENABLE} value="1" checked={dynamic_max_tokens}
        description={i18n.HELP.DYNAMIC_MAX_TOKENS}
        onChange={updateOption} />
    </NekoSettings>;

  const jsxOpenAiApiKey =
    <NekoSettings title={i18n.COMMON.API_KEY}>
      <NekoInput name="openai_apikey" value={openai_apikey}
        description={toHTML(i18n.COMMON.API_KEY_HELP)} onBlur={updateOption} />
    </NekoSettings>;

  const jsxPineconeApiKey =
    <NekoSettings title={i18n.COMMON.API_KEY}>
      <NekoInput name="apikey" value={pinecone?.apikey || ''}
        description={toHTML(i18n.COMMON.EMBEDDINGS_APIKEY_HELP)} onBlur={value => {
          const freshPinecone = { ...pinecone, apikey: value };
          updateOption(freshPinecone, 'pinecone');
        }} />
    </NekoSettings>;

  const jsxPineconeServer = 
    <NekoSettings title={i18n.COMMON.SERVER}>
      <NekoSelect scrolldown name="server" value={pinecone?.server} 
        description={toHTML(i18n.COMMON.SERVER_HELP)}
        onChange={value => {
          const freshPinecone = { ...pinecone, server: value };
          updateOption(freshPinecone, 'pinecone');
        }}>
        <NekoOption value="us-east1-gcp" label="us-east1-gcp" />
        <NekoOption value="us-west1-gcp" label="us-west1-gcp" />
        <NekoOption value="us-east-1-aws" label="us-east-1-aws" />
        <NekoOption value="us-west-1-aws" label="us-west-1-aws" />
      </NekoSelect>
    </NekoSettings>;

  const jsxPineconeNamespace =
    <NekoSettings title={i18n.COMMON.NAMESPACE}>
      <NekoInput name="namespace" value={pinecone?.namespace || 'mwai'}
        description={toHTML(i18n.COMMON.NAMESPACE_HELP)} onBlur={value => {
          const freshPinecone = { ...pinecone, namespace: value };
          updateOption(freshPinecone, 'pinecone');
        }} />
    </NekoSettings>;

  const jsxOpenAiUsage = <div>
    <div style={{ fontSize: 12, marginTop: -5 }}>
      {toHTML(i18n.COMMON.USAGE_COSTS_HELP)}
    </div>
    <MonthlyUsage options={options} />
  </div>;

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
                      </NekoButton>
                    }>
                      <StyledBuilderForm>
                        <h4 className="mwai-category" style={{ marginTop: 0 }}>{i18n.COMMON.MAIN_SETTINGS}</h4>
                        <div className="mwai-builder-row">
                          <div className="mwai-builder-col" style={{ height: shortcodeParams?.mode === 'chat' ? 76 : 'inherit' }}>
                            <label>{i18n.COMMON.MODE}:</label>
                            <NekoSelect scrolldown id="mode" name="mode" value={shortcodeParams?.mode} onChange={updateShortcodeParams}>
                              <NekoOption value="chat" label="Chat" />
                              <NekoOption value="images" label="Images" />
                            </NekoSelect>
                          </div>
                          {isChat && (
                            <div className="mwai-builder-col" style={{ flex: 5 }}>
                              <label>{i18n.COMMON.CONTEXT}:</label>
                              <NekoTextArea id="context" name="context" rows={3} value={shortcodeParams?.context} onBlur={updateShortcodeParams} />
                            </div>
                          )}
                          {isImagesChat && (
                            <div className="mwai-builder-col" style={{ flex: 5 }}>
                              <label>{i18n.COMMON.IMAGES_NUMBER}:</label>
                              <NekoInput id="max_results" name="max_results" type="number" value={shortcodeParams?.max_results} onBlur={updateShortcodeParams} />
                            </div>
                          )}
                        </div>
                        {/* Additional settings... */}
                        <h4 className="mwai-category">{i18n.COMMON.VISUAL_SETTINGS}</h4>
                        <div className="mwai-builder-row">
                          <div className="mwai-builder-col">
                            <label>{i18n.COMMON.AI_NAME}:</label>
                            <NekoInput id="ai_name" name="ai_name" data-form-type="other" value={shortcodeParams?.ai_name} onBlur={updateShortcodeParams} />
                          </div>
                          <div className="mwai-builder-col" style={{ flex: 4 }}>
                            <label>{i18n.COMMON.START_SENTENCE}:</label>
                            <NekoInput id="start_sentence" name="start_sentence" value={shortcodeParams?.start_sentence} onBlur={updateShortcodeParams} />
                          </div>
                        </div>
                        {/* ... more form fields ... */}
                        <h4 className="mwai-category">{i18n.COMMON.SHORTCODE}</h4>
                        <pre>{builtShortcode}</pre>
                      </StyledBuilderForm>
                      <NekoCheckbox name="shortcode_chat_params_override" label={i18n.SETTINGS.SET_AS_DEFAULT_PARAMETERS}
                        disabled={Object.keys(shortcodeParamsDiff || {}).length < 1 && !shortcodeParamsOverride}
                        value="1" checked={shortcodeParamsOverride}
                        description={i18n.SETTINGS.SET_AS_DEFAULT_PARAMETERS_HELP}
                        onChange={updateOption} />
                      <NekoCheckbox name="shortcode_chat_inject" label={i18n.SETTINGS.INJECT_DEFAULT_CHATBOT}
                        value="1" checked={shortcodeChatInject}
                        description={i18n.SETTINGS.INJECT_DEFAULT_CHATBOT_HELP}
                        onChange={updateOption} />
                    </NekoBlock>
                  </NekoColumn>
                  <NekoColumn minimal>
                    <NekoBlock busy={busy} title="ChatGPT Style" className="primary" action={
                      <NekoButton className="danger" onClick={onResetShortcodeStyles}>Reset Styles</NekoButton>
                    }>
                      <StyledBuilderForm>
                        {/* Style customization form... */}
                        <h4 className="mwai-category">{i18n.COMMON.POPUP}</h4>
                        {/* Pop-up settings... */}
                      </StyledBuilderForm>
                    </NekoBlock>
                    {/* Additional features... */}
                    <NekoBlock busy={busy} title={i18n.COMMON.FEATURES} className="primary">
                      {jsxShortcodeFormatting}
                      {jsxShortcodeSyntaxHighlighting}
                      {jsxShortcodeTypewriter}
                      {jsxShortcodeChatLogs}
                    </NekoBlock>
                  </NekoColumn>
                </NekoWrapper>
              </NekoTab>
            )}

            {module_statistics && (
              <NekoTab title={i18n.COMMON.STATISTICS}>
                {/* Statistics tab content... */}
              </NekoTab>
            )}

            {/* Other tabs... */}

            <NekoTab key="advanced" title={
              accidentsPastDay > 0 ? (
                <>{i18n.COMMON.SETTINGS} &nbsp;✅</>
              ) : (
                <>{i18n.COMMON.SETTINGS} &nbsp;⚠️</>
              )
            }>
              {/* Advanced settings... */}
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