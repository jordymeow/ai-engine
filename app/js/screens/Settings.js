// Previous: 1.2.1
// Current: 1.2.2

const { __ } = wp.i18n;
const { useMemo, useState, useEffect } = wp.element;

import { NekoButton, NekoInput, NekoTypo, NekoPage, NekoBlock, NekoContainer, NekoSettings, NekoSpacer,
  NekoSelect, NekoOption, NekoTabs, NekoTab, NekoCheckboxGroup, NekoCheckbox, NekoWrapper, NekoMessage,
  NekoQuickLinks, NekoLink, NekoColumn, NekoTextArea } from '@neko-ui';
import { nekoFetch } from '@neko-ui';
import { useQuery } from '@tanstack/react-query';

import { LicenseBlock } from '@common';
import { apiUrl, prefix, domain, isRegistered, isPro, restNonce, pricing, pluginUrl,
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
  const { completionModels, isFineTunedModel } = useModels(options);
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
  const extra_models = options?.extra_models;
  const debug_mode = options?.debug_mode;
  const resolve_shortcodes = options?.resolve_shortcodes;
  const isChat = shortcodeParams.mode === 'chat';
  const isImagesChat = shortcodeParams.mode === 'images';
  const chatIcon = shortcodeStyles?.icon ? shortcodeStyles?.icon : 'chat-color-green.svg';
  const isCustomURL = chatIcon?.startsWith('https://') || chatIcon?.startsWith('http://');
  const previewIcon = isCustomURL ? chatIcon : `${pluginUrl}/images/${chatIcon}`;
  const { isLoading: isLoadingIncidents, data: incidents } = useQuery({
    queryKey: ['openAI_status'], queryFn: retrieveIncidents
  });

  const accidentsPastDay = incidents?.filter(x => {
    const incidentDate = new Date(x.date);
    return incidentDate > new Date(Date.now() - 24 * 60 * 60 * 1000);
  }).length;

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
      if (shortcodeParams[key] === undefined) {
        continue;
      }
      params.push(`${key}="${shortcodeParams[key]}"`);
    }
    const joinedParams = params.join(' ');
    return '[mwai_chat' + (joinedParams ? ` ${joinedParams}` : '') + ']';
  }, [shortcodeParamsDiff]);

  const updateOption = async (value, id) => {
    const newOptions = { ...options, [id]: value };
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
    const newParams = { ...limits.users, [id]: value };
    const newLimits = { ...limits, users: newParams };
    await updateOption(newLimits, 'limits');
  }

  const updateGuestLimits = async (value, id) => {
    if (id === 'credits') {
      value = Math.max(0, value);
    }
    const newParams = { ...limits.guests, [id]: value };
    const newLimits = { ...limits, guests: newParams };
    await updateOption(newLimits, 'limits');
  }

  const updateShortcodeColors = async (value, id) => {
    if (value) {
      const newColors = { ...shortcodeStyles, [id]: value };
      await updateOption(newColors, 'shortcode_chat_styles');
    }
  }

  const updateIcon = async (value) => {
    if (value.startsWith('http://') || value.startsWith('https://')) {
      const newColors = { ...shortcodeStyles, icon: value };
      await updateOption(newColors, 'shortcode_chat_styles');
    }
    else {
      alert('Please enter a valid URL.');
    }
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

// const jsxExtraModels =
//   <NekoSettings title="Extra Models">
//     <NekoInput id="extra_models" name="extra_models" value={extra_models}
//       description={<>You can enter additional models you would like to use (separated by a comma). Note that your fine-tuned models are already available.</>} onBlur={updateOption} />
//   </NekoSettings>;

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

const jsxOpenAiApiKey =
    <NekoSettings title={i18n.COMMON.API_KEY}>
      <NekoInput name="openai_apikey" value={openai_apikey}
        description={toHTML(i18n.COMMON.API_KEY_HELP)} onBlur={updateOption} />
    </NekoSettings>;

const jsxPineconeApiKey =
    <NekoSettings title={i18n.COMMON.API_KEY}>
      <NekoInput name="apikey" value={pinecone?.apikey ?? ''}
        description={toHTML(i18n.COMMON.EMBEDDINGS_APIKEY_HELP)} onBlur={value => {
          const freshPinecone = { ...pinecone, apikey: value };
          updateOption(freshPinecone, 'pinecone');
        }} />
    </NekoSettings>;

const jsxPineconeServer = 
    <NekoSettings title={i18n.COMMON.SERVER}>
      <NekoSelect scrolldown name="server"
        value={pinecone?.server} onChange={value => {
          const freshPinecone = { ...pinecone, server: value };
          updateOption(freshPinecone, 'pinecone');
        }}>
        <NekoOption value="us-east1-gcp" label="us-east1-gcp" />
        <NekoOption value="us-west1-gcp" label="us-west1-gcp" />
      </NekoSelect>
    </NekoSettings>;

const jsxOpenAiUsage = <div>
  <h3>{i18n.COMMON.USAGE_COSTS}</h3>
  <div style={{ fontSize: 12, marginTop: -5 }}>
    {toHTML(i18n.COMMON.USAGE_COSTS_HELP)}
  </div>
  <MonthlyUsage options={options} />
</div>;

const isFineTuned = isFineTunedModel(shortcodeParams.model);
const isContentAware = shortcodeParams.content_aware;
const contextHasContent = shortcodeParams.context && shortcodeParams.context.includes('{CONTENT}');
        
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

          <NekoTab title='Settings'>
            <NekoWrapper>

              <NekoColumn minimal>
                <NekoBlock busy={busy} title="Modules" className="primary">
                  <p>{i18n.SETTINGS.MODULES_INTRO}</p>
                  <NekoSpacer height={50} />
                  {jsxChatbot}
                  {jsxGenerators}
                  {jsxPlayground}
                  {jsxAssistants}
                  {jsxStatistics}
                  {/* {jsxEmbeddings} */}
                  {jsxForms}
                  {jsxModeration}
                  {jsxAudioTranscribe}
                </NekoBlock>

                <NekoBlock busy={busy} title="Advanced" className="primary">
                  {/* {jsxExtraModels} */}
                  {jsxDebugMode}
                  {jsxResolveShortcodes}
                </NekoBlock>
              </NekoColumn>

              <NekoColumn minimal>
                <NekoBlock busy={busy} title="Open AI" className="primary">
                  {jsxOpenAiApiKey}
                  {jsxOpenAiUsage}
                </NekoBlock>
                {module_embeddings && <NekoBlock busy={busy} title="Pinecone" className="primary">
                  {jsxPineconeApiKey}
                  {jsxPineconeServer}
                </NekoBlock>}
              </NekoColumn>

            </NekoWrapper>
          </NekoTab>

          {(shortcode_chat) && <NekoTab title={i18n.COMMON.CHATBOT}>
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
                        <NekoTextArea id="context" name="context" rows={2}
                          value={shortcodeParams.context} onBlur={updateShortcodeParams} />
                      </div>}

                      {isImagesChat && <div className="mwai-builder-col" style={{ flex: 5 }}>
                        <label>{i18n.COMMON.IMAGES_NUMBER}:</label>
                        <NekoInput id="max_results" name="max_results" type="number"
                          value={shortcodeParams.max_results} onBlur={updateShortcodeParams} />
                      </div>}

                    </div>

                    <div className="mwai-builder-row">
                      <div className="mwai-builder-col">
                        <label>{i18n.COMMON.AI_NAME}:</label>
                        <NekoInput id="ai_name" name="ai_name"
                          value={shortcodeParams.ai_name} onBlur={updateShortcodeParams} />
                      </div>
                      <div className="mwai-builder-col" style={{ flex: 4 }}>
                        <label>{i18n.COMMON.START_SENTENCE}:</label>
                        <NekoInput id="start_sentence" name="start_sentence"
                          value={shortcodeParams.start_sentence} onBlur={updateShortcodeParams} />
                      </div>
                    </div>

                    <div className="mwai-builder-row">
                      
                      <div className="mwai-builder-col">
                        <label>{i18n.COMMON.USER_NAME}:</label>
                        <NekoInput id="user_name" name="user_name"
                          value={shortcodeParams.user_name} onBlur={updateShortcodeParams} />
                      </div>
                      <div className="mwai-builder-col" style={{ flex: 2 }}>
                        <label>{i18n.COMMON.PLACEHOLDER}:</label>
                        <NekoInput id="text_input_placeholder" name="text_input_placeholder"
                          value={shortcodeParams.text_input_placeholder} onBlur={updateShortcodeParams} />
                      </div>
                      <div className="mwai-builder-col">
                        <label>{i18n.COMMON.SEND}:</label>
                        <NekoInput id="text_send" name="text_send" value={shortcodeParams.text_send}
                          onBlur={updateShortcodeParams} />
                      </div>
                      <div className="mwai-builder-col">
                        <label>{i18n.COMMON.CLEAR}:</label>
                        <NekoInput id="text_clear" name="text_clear" value={shortcodeParams.text_clear}
                          disabled={!shortcodeParams.id}
                          onBlur={updateShortcodeParams} />
                      </div>
                    </div>

                    <div className="mwai-builder-row">
                      <div className="mwai-builder-col">
                        <label>{i18n.COMMON.SYSTEM_NAME}:</label>
                        <NekoInput id="sys_name" name="sys_name"
                          value={shortcodeParams.sys_name} onBlur={updateShortcodeParams} />
                      </div>
                      <div className="mwai-builder-col">
                        <div>
                          <label style={{ display: 'block' }}>{i18n.COMMON.ID}:</label>
                          <NekoInput id="id" name="id" type="text" placeholder="Optional"
                            value={shortcodeParams.id} onBlur={updateShortcodeParams} />
                        </div>
                      </div>
                      <div className="mwai-builder-col" style={{ flex: 2 }}>
                        <label>{i18n.COMMON.STYLE}:</label>
                        <NekoSelect scrolldown id="style" name="style"
                          value={shortcodeParams.style} description="" onChange={updateShortcodeParams}>
                          <NekoOption value='none' label="None" />
                          <NekoOption value='chatgpt' label="ChatGPT" />
                        </NekoSelect>
                      </div>
                      <div className="mwai-builder-col">
                        <label>{i18n.COMMON.POPUP}:</label>
                        <NekoCheckbox name="window" label="Yes"
                          checked={shortcodeParams.window} value="1" onChange={updateShortcodeParams} />
                      </div>

                    </div>

                    <div className="mwai-builder-row">
                      
                      <div className="mwai-builder-col" style={{ flex: 2 }}>
                        <label>{i18n.COMMON.POSITION}:</label>
                        <NekoSelect scrolldown id="icon_position" name="icon_position" disabled={!shortcodeParams.window}
                          value={shortcodeParams.icon_position} onChange={updateShortcodeParams}>
                          <NekoOption value="bottom-right" label="Bottom Right" />
                          <NekoOption value="bottom-left" label="Bottom Left" />
                          <NekoOption value="top-right" label="Top Right" />
                          <NekoOption value="top-left" label="Top Left" />
                        </NekoSelect>
                      </div>

                      <div className="mwai-builder-col" style={{ flex: 2 }}>
                        <label>{i18n.COMMON.ICON_TEXT}:</label>
                        <NekoInput id="icon_text" name="icon_text" disabled={!shortcodeParams.window}
                          placeholder="If set, appears next to icon"
                          value={shortcodeParams.icon_text ?? 'Chat'} onBlur={updateShortcodeParams} />
                      </div>

                      <div className="mwai-builder-col" style={{ flex: 1 }}>
                        <label>{i18n.COMMON.FULL_SCREEN}:</label>
                        <NekoCheckbox name="fullscreen" label="Yes"
                          checked={shortcodeParams.fullscreen} value="1" onChange={updateShortcodeParams} />
                      </div>
                      
                    </div>

                    {isChat && <div className="mwai-builder-row">
                      <div className="mwai-builder-col" style={{ flex: 2.5 }}>
                        <label>{i18n.COMMON.MODEL}:</label>
                        <NekoSelect scrolldown id="model" name="model"
                          value={shortcodeParams.model} description="" onChange={updateShortcodeParams}>
                          {completionModels.map((x) => (
                            <NekoOption value={x.model} label={x.name}></NekoOption>
                          ))}
                        </NekoSelect>
                      </div>
                    </div>}

                    <div className="mwai-builder-row">

                      <div className="mwai-builder-col" style={{ flex: 1 }}>
                        <label>{i18n.COMMON.MAX_SENTENCES}:</label>
                        <NekoInput id="max_sentences" name="max_sentences"
                          step="1" min="1" max="512"
                          value={shortcodeParams.max_sentences} onBlur={updateShortcodeParams} />
                      </div>

                      <div className="mwai-builder-col" style={{ flex: 3 }}>
                        <label>{i18n.COMMON.COMPLIANCE_TEXT}:</label>
                        <NekoInput id="text_compliance" name="text_compliance"
                          value={shortcodeParams.text_compliance} onBlur={updateShortcodeParams} />
                      </div>

                    </div>

                    {isChat && <div className="mwai-builder-row">
                      
                      <div className="mwai-builder-col" style={{ flex: 1 }}>
                        <label>{i18n.COMMON.MAX_TOKENS}:</label>
                        <NekoInput id="max_tokens" name="max_tokens" type="number" min="10" max="2048"
                          value={shortcodeParams.max_tokens} onBlur={updateShortcodeParams} />
                      </div>

                      <div className="mwai-builder-col" style={{ flex: 1 }}>
                        <label>{i18n.COMMON.TEMPERATURE}:</label>
                        <NekoInput id="temperature" name="temperature" type="number"
                          step="0.1" min="0" max="1"
                          value={shortcodeParams.temperature} onBlur={updateShortcodeParams} />
                      </div>

                      <div className="mwai-builder-col">
                        <label>{i18n.COMMON.CASUALLY_FINE_TUNED}:</label>
                        <NekoCheckbox name="casually_fine_tuned" label="Yes"
                          checked={shortcodeParams.casually_fine_tuned} value="1" onChange={updateShortcodeParams}
                        />
                      </div>

                      {isContentAware && <div className="mwai-builder-col">
                        <label>{i18n.COMMON.CONTENT_AWARE}:</label>
                        <NekoCheckbox name="content_aware" label="Yes"
                          requirePro={true} isPro={isRegistered}
                          checked={shortcodeParams.content_aware} value="1" onChange={updateShortcodeParams} />
                      </div>}

                    </div>}

                    {shortcodeChatInject && !shortcodeParams.window && 
                      <NekoMessage variant="danger" style={{ marginTop: 15, padding: '10px 15px' }}>
                        <p>{i18n.SETTINGS.ALERT_INJECT_BUT_NO_POPUP}</p>
                      </NekoMessage>
                    }

                    {isFineTuned && !shortcodeParams.casually_fine_tuned && 
                      <NekoMessage variant="danger" style={{ marginTop: 15, padding: '10px 15px' }}>
                        <p>{i18n.SETTINGS.ALERT_FINETUNE_BUT_NO_CASUALLY}</p>
                      </NekoMessage>
                    }

                    {!isFineTuned && shortcodeParams.casually_fine_tuned && 
                      <NekoMessage variant="danger" style={{ marginTop: 15, padding: '10px 15px' }}>
                        <p>{i18n.SETTINGS.ALERT_CASUALLY_BUT_NO_FINETUNE}</p>
                      </NekoMessage>
                    }

                    {isContentAware && !contextHasContent && 
                      <NekoMessage variant="danger" style={{ marginTop: 15, padding: '10px 15px' }}>
                        <p>{toHTML(i18n.SETTINGS.ALERT_CONTENTAWARE_BUT_NO_CONTENT)}</p>
                      </NekoMessage>
                    }

                    <pre>
                      {builtShortcode}
                    </pre>

                  </StyledBuilderForm>

                  <NekoCheckbox name="shortcode_chat_params_override"
                    label={i18n.SETTINGS.SET_AS_DEFAULT_parameters}
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
                    <div className="mwai-builder-row">
                      <div className="mwai-builder-col" style={{ flex: 0.66 }}>
                        <label>{i18n.COMMON.SPACING}:</label>
                        <NekoInput id="spacing" name="spacing"
                          value={shortcodeStyles?.spacing ?? '15px'} onBlur={updateShortcodeColors} />
                      </div>
                      <div className="mwai-builder-col" style={{ flex: 0.66 }}>
                        <label>{i18n.COMMON.BORDER_RADIUS}:</label>
                        <NekoInput id="borderRadius" name="borderRadius"
                          value={shortcodeStyles?.borderRadius ?? '10px'} onBlur={updateShortcodeColors} />
                      </div>
                      <div className="mwai-builder-col" style={{ flex: 0.66 }}>
                        <label>{i18n.COMMON.FONT_SIZE}:</label>
                        <NekoInput id="fontSize" name="fontSize"
                          value={shortcodeStyles?.fontSize ?? '15px'} onBlur={updateShortcodeColors} />
                      </div>
                      <div className="mwai-builder-col" style={{ flex: 1 }}>
                        <label>{i18n.COMMON.FONT_COLOR}:</label>
                        <div style={{ display: 'flex' }}>
                          <NekoInput id="fontColor" name="fontColor"
                            value={shortcodeStyles?.fontColor ?? '#FFFFFF'} 
                            onBlur={updateShortcodeColors} />
                          <NekoColorPicker id="fontColor" name="fontColor"
                            value={shortcodeStyles?.fontColor ?? '#FFFFFF'}
                            onChange={updateShortcodeColors} />
                        </div>
                      </div>
                    </div>
                    <div className="mwai-builder-row">
                      
                      <div className="mwai-builder-col">
                        <label>{i18n.COMMON.BACK_PRIMARY_COLOR}:</label>
                        <div style={{ display: 'flex' }}>
                          <NekoInput id="backgroundPrimaryColor" name="backgroundPrimaryColor"
                            value={shortcodeStyles?.backgroundPrimaryColor ?? '#454654'} 
                            onBlur={updateShortcodeColors} />
                          <NekoColorPicker id="backgroundPrimaryColor" name="backgroundPrimaryColor"
                            value={shortcodeStyles?.backgroundPrimaryColor ?? '#454654'}
                            onChange={updateShortcodeColors} />
                        </div>
                      </div>
                      <div className="mwai-builder-col">
                        <label>{i18n.COMMON.BACK_SECONDARY_COLOR}:</label>
                        <div style={{ display: 'flex' }}>
                          <NekoInput id="backgroundSecondaryColor" name="backgroundSecondaryColor"
                            value={shortcodeStyles?.backgroundSecondaryColor ?? '#343541'} 
                            onBlur={updateShortcodeColors} />
                          <NekoColorPicker id="backgroundSecondaryColor" name="backgroundSecondaryColor"
                            value={shortcodeStyles?.backgroundSecondaryColor ?? '#343541'}
                            onChange={updateShortcodeColors} />
                        </div>
                      </div>
                      <div className="mwai-builder-col">
                        <label>{i18n.COMMON.HEADER_BUTTONS_COLOR}:</label>
                        <div style={{ display: 'flex' }}>
                          <NekoInput id="headerButtonsColor" name="headerButtonsColor"
                            value={shortcodeStyles?.headerButtonsColor ?? '#FFFFFF'} 
                            onBlur={updateShortcodeColors} />
                          <NekoColorPicker id="headerButtonsColor" name="headerButtonsColor"
                            value={shortcodeStyles?.headerButtonsColor ?? '#FFFFFF'}
                            onChange={updateShortcodeColors} />
                        </div>                          
                      </div>
                    </div>
                    <div className="mwai-builder-row">
                      <div className="mwai-builder-col" style={{ flex: 2 }}>
                        <label>{i18n.COMMON.POPUP_ICON}:</label>
                        <div style={{ display: 'flex' }}>
                        {chatIcons.map(x => 
                          <>
                            <img style={{ marginRight: 2, cursor: 'pointer' }} width={24} height={24}
                              src={`${pluginUrl}/images/${x}`} onClick={() => {
                                updateShortcodeColors(x, 'icon')
                              }} />
                          </>
                        )}
                        <NekoButton small className="primary" style={{ marginLeft: 5 }}
                          onClick={() => { updateShortcodeColors(`${pluginUrl}/images/chat-color-green.svg`, 'icon') }}>
                          Custom URL
                        </NekoButton>
                        </div>
                      </div>
                      <div className="mwai-builder-col" style={{ width: 48, display: 'flex', alignItems: 'end' }}>
                        <img style={{ marginRight: 0, paddingTop: 10 }} width={48} height={48} src={`${previewIcon}`} />
                      </div>
                    </div>
                    {isCustomURL && <div className="mwai-builder-row">
                      <div className="mwai-builder-col">
                        <label>{i18n.COMMON.CUSTOM_ICON_URL}:</label>
                        <NekoInput id="icon" name="icon" value={chatIcon}
                          onBlur={updateIcon} />
                      </div>
                    </div>}
                  </StyledBuilderForm>
                </NekoBlock>

                <NekoBlock busy={busy} title={i18n.COMMON.FEATURES} className="primary">
                  {jsxShortcodeFormatting}
                  {jsxShortcodeSyntaxHighlighting}
                  {jsxShortcodeTypewriter}
                  {jsxShortcodeChatLogs}
                </NekoBlock>
              </NekoColumn>

            </NekoWrapper>
          </NekoTab>}

          {module_statistics && <NekoTab title={i18n.COMMON.STATISTICS}>
            <NekoWrapper>
              <NekoColumn minimal style={{ flex: 2.5 }}>
                <NekoBlock className="primary" title="Queries">
                  <QueriesExplorer />
                </NekoBlock>
              </NekoColumn>
              <NekoColumn minimal>
                <StyledBuilderForm>
                  <NekoBlock className="primary" busy={busy} title="Limits" style={{ flex: 1 }} action={
                  <NekoButton className="danger" onClick={onResetLimits}>
                    Reset Limits
                  </NekoButton>}>

                    <NekoCheckbox name="enabled" label={i18n.STATISTICS.ENABLE_LIMITS}
                      checked={limits?.enabled} value="1" onChange={updateLimits}
                    />

                    <NekoSpacer />

                    <NekoQuickLinks value={limitSection} busy={busy} 
                      onChange={value => { setLimitSection(value) }}>
                      <NekoLink title={i18n.COMMON.USERS} value='users' disabled={!limits?.enabled} />
                      <NekoLink title={i18n.COMMON.GUESTS} value='guests' />
                    </NekoQuickLinks>

                    {limits?.target === 'userId' && <>
                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col">
                          <label>Message for Guests:</label>
                          <NekoInput id="guestMessage" name="guestMessage" disabled={!limits?.enabled}
                            value={limits?.guestMessage} onBlur={updateLimits} />
                        </div>
                      </div>
                    </>}

                    <div className="mwai-builder-row">
                      <div className="mwai-builder-col">
                        <label>{i18n.COMMON.CREDITS}:</label>
                        <NekoInput id="credits" name="credits" type="number" min="0" max="1000000"
                          disabled={!limits?.enabled} value={limits?.[limitSection]?.credits}
                          onBlur={limitSection === 'user' ? updateUserLimits : updateGuestLimits} />
                      </div>
                      <div className="mwai-builder-col">
                        <label>{i18n.COMMON.TYPE}:</label>
                        <NekoSelect scrolldown id="creditType" name="creditType" disabled={!limits?.enabled}
                          value={limits?.[limitSection]?.creditType}
                          onChange={limitSection === 'user' ? updateUserLimits : updateGuestLimits}>
                            <NekoOption key={'queries'} id={'queries'} value={'queries'} label={"Queries"} />
                            <NekoOption key={'units'} id={'units'} value={'units'} label={"Tokens"} />
                            <NekoOption key={'price'} id={'price'} value={'price'} label={"Dollars"} />
                        </NekoSelect>
                      </div>
                    </div>

                    {limits?.[limitSection]?.credits !== 0 && <p>
                      If you want to apply variable amount of credits, <a href="https://meowapps.com/ai-engine/faq/#limits" target="_blank">click here</a>.
                    </p>}

                    {limits?.[limitSection]?.credits !== 0 && limits?.[limitSection].creditType === 'price' &&
                      <p>The dollars represent the budget you spent through OpenAI.</p>
                    }

                    {limits?.[limitSection]?.credits === 0 && <p>
                      Since there are no credits, the Message for No Credits Message with be displayed.
                    </p>}


                    <div className="mwai-builder-row">
                      <div className="mwai-builder-col">
                        <label>{i18n.COMMON.TIMEFRAME}:</label>
                        <NekoSelect scrolldown id="timeFrame" name="timeFrame" disabled={!limits?.enabled}
                          value={limits?.[limitSection]?.timeFrame} 
                          onChange={limitSection === 'user' ? updateUserLimits : updateGuestLimits}>
                            <NekoOption key={'hour'} id={'hour'} value={'hour'} label={"Hour"} />
                            <NekoOption key={'day'} id={'day'} value={'day'} label={"Day"} />
                            <NekoOption key={'week'} id={'week'} value={'week'} label={"Week"} />
                            <NekoOption key={'month'} id={'month'} value={'month'} label={"Month"} />
                            <NekoOption key={'year'} id={'year'} value={'year'} label={"Year"} />
                        </NekoSelect>
                      </div>
                      <div className="mwai-builder-col">
                        <label>{i18n.COMMON.ABSOLUTE}:</label>
                        <NekoCheckbox name="isAbsolute" label="Yes" disabled={!limits?.enabled}
                          checked={limits?.[limitSection]?.isAbsolute} value="1"
                          onChange={limitSection === 'user' ? updateUserLimits : updateGuestLimits}
                        />
                      </div>
                    </div>
                    {limits?.[limitSection]?.isAbsolute && <p>
                      {toHTML(i18n.STATISTICS.ABSOLUTE_HELP)}
                    </p>}

                    <div className="mwai-builder-row">
                      <div className="mwai-builder-col">
                        <label>{i18n.STATISTICS.NO_CREDITS_MESSAGE}:</label>
                        <NekoInput id="overLimitMessage" name="overLimitMessage" disabled={!limits?.enabled}
                          value={limits?.[limitSection]?.overLimitMessage}
                          onBlur={limitSection === 'user' ? updateUserLimits : updateGuestLimits} />
                      </div>
                    </div>

                    {limitSection === 'user' && <div className="mwai-builder-row">
                      <div className="mwai-builder-col">
                        <label>{i18n.STATISTICS.FULL_ACCESS_USERS}:</label>
                        <NekoSelect scrolldown id="ignoredUsers" name="ignoredUsers" disabled={!limits?.enabled}
                          value={limits?.users?.ignoredUsers} description="" onChange={updateUserLimits}>
                            <NekoOption key={'none'} id={'none'} value={''}
                              label={i18n.COMMON.NONE} />
                            <NekoOption key={'editor'} id={'editor'} value={'administrator,editor'}
                              label={i18n.COMMON.EDITORS_ADMINS} />
                            <NekoOption key={'admin'} id={'admin'} value={'administrator'}
                              label={i18n.COMMON.ADMINS_ONLY} />
                        </NekoSelect>
                      </div>
                    </div>}

                  </NekoBlock>
                </StyledBuilderForm>
              </NekoColumn>
            </NekoWrapper>
          </NekoTab>}

          <NekoTab title={i18n.COMMON.FINETUNING_TAB}>
            <FineTuning options={options} updateOption={updateOption} />
          </NekoTab>

          {module_embeddings && <NekoTab title={i18n.COMMON.EMBEDDINGS_TAB}>
            <VectorDatabase options={options} updateOption={updateOption} />
          </NekoTab>}

          {module_moderation && <NekoTab title={i18n.COMMON.MODERATION}>
            <Moderation options={options} updateOption={updateOption} />
          </NekoTab>}

          {module_audio && <NekoTab title={i18n.COMMON.AUDIO_TAB}>
            <Audio options={options} updateOption={updateOption} />
          </NekoTab>}

          <NekoTab key="openai-status"
            title={<>{i18n.COMMON.OPENAI_TAB}{accidentsPastDay > 0 ? <>&nbsp;⚠️</> : <>&nbsp;✅</>}</>}>
            <OpenAIStatus incidents={incidents} isLoading={isLoadingIncidents} />
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