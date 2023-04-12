// Previous: 1.4.1
// Current: 1.4.4

const { useMemo, useState, useEffect } = wp.element;

import { NekoButton, NekoInput, NekoTypo, NekoPage, NekoBlock, NekoContainer, NekoSettings, NekoSpacer,
  NekoSelect, NekoOption, NekoTabs, NekoTab, NekoCheckboxGroup, NekoCheckbox, NekoWrapper, NekoMessage,
  NekoQuickLinks, NekoLink, NekoColumn, NekoTextArea, NekoIcon, NekoModal } from '@neko-ui';

import { nekoFetch } from '@neko-ui';
import { useQuery } from '@tanstack/react-query';

import { LicenseBlock } from '@common';
import { apiUrl, prefix, domain, isRegistered, isPro, restNonce, pluginUrl,
  options as defaultOptions } from '@app/settings';

import i18n from '@root/i18n';
import { OptionsCheck, toHTML, useModels } from '@app/helpers';
import { AiNekoHeader } from '@app/styles/CommonStyles';
import FineTuning from '@app/screens/finetunes/Finetunes';
import OpenAIStatus from '@app/screens/misc/OpenAIStatus';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";
import { NekoColorPicker } from "@app/components/NekoColorPicker";
import QueriesExplorer from '@app/screens/statistics/QueriesExplorer';
import Moderation from '@app/screens/misc/Moderation';
import Embeddings from '@app/screens/embeddings/Embeddings';
import MonthlyUsage from '@app/components/MonthlyUsage';
import Audio from '@app/screens/misc/Audio';
import Discussions from '@app/screens/discussions/Discussions';
import Chatbots from './chatbots/Chatbots';

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
  const [ error, setError ] = useState(null);
  const [ busyAction, setBusyAction ] = useState(false);
  const [ limitSection, setLimitSection ] = useState('users');
  const { completionModels, isFineTunedModel, getModel } = useModels(options);
  const shortcodeDefaultParams = options?.shortcode_chat_default_params;
  const shortcodeParams = options?.shortcode_chat_params;
  const shortcodeStyles = options?.shortcode_chat_styles;
  const shortcodeParamsOverride = options?.shortcode_chat_params_override;
  const shortcodeChatInject = options?.shortcode_chat_inject;
  const module_suggestions = options?.module_suggestions;
  const module_woocommerce = options?.module_woocommerce;
  const module_forms = options?.module_forms;
  const module_finetunes = options?.module_finetunes;
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
  const openai_service = options?.openai_service;
  const openai_apikey = options?.openai_apikey ? options?.openai_apikey : '';
  const openai_azure_endpoint = options?.openai_azure_endpoint ? options?.openai_azure_endpoint : '';
  const openai_azure_apikey = options?.openai_azure_apikey ? options?.openai_azure_apikey : '';
  const openai_azure_deployment = options?.openai_azure_deployment ? options?.openai_azure_deployment : '';
  const pinecone = options?.pinecone;
  const shortcode_chat_syntax_highlighting = options?.shortcode_chat_syntax_highlighting;
  const shortcode_chat_typewriter = options?.shortcode_chat_typewriter;
  const shortcode_chat_discussions = options?.shortcode_chat_discussions;
  const debug_mode = options?.debug_mode;
  const dynamic_max_tokens = options?.dynamic_max_tokens;
  const banned_ips = options?.banned_ips;
  const banned_words = options?.banned_words;
  const admin_bar = options?.admin_bar ?? ['settings'];
  const resolve_shortcodes = options?.resolve_shortcodes;

  const isChat = (shortcodeParams?.mode ?? 'chat') === 'chat';
  const isImagesChat = (shortcodeParams?.mode ?? 'images') === 'images';
  const chatIcon = shortcodeStyles?.icon ? shortcodeStyles?.icon : 'chat-color-green.svg';
  const isCustomURL = chatIcon?.startsWith('https://') || chatIcon?.startsWith('http://');
  const previewIcon = isCustomURL ? chatIcon : `${pluginUrl}/images/${chatIcon}`;
  const { isLoading: isLoadingIncidents, data: incidents } = useQuery({
    queryKey: ['openAI_status'], queryFn: retrieveIncidents
  });
  const indexes = pinecone?.indexes || [];
  const isFineTuned = isFineTunedModel(shortcodeParams?.model);
  const currentModel = getModel(shortcodeParams?.model);
  const isContentAware = shortcodeParams?.content_aware;
  const contextHasContent = shortcodeParams?.content_aware && shortcodeParams?.content_aware.includes('{CONTENT}');

  const accidentsPastDay = useMemo(() => {
    if (!incidents) return 0;
    return incidents.filter(x => {
      const incidentDate = new Date(x.date);
      return incidentDate > new Date(Date.now() - 24 * 60 * 60 * 1000);
    }).length;
  }, [incidents]);

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
      if (value !== undefined && value !== null) {
        params.push(`${key}="${value}"`);
      }
    }
    const joinedParams = params.join(' ');
    return '[mwai_chat' + (joinedParams ? ` ${joinedParams}` : '') + ']';
  }, [shortcodeParamsDiff, shortcodeParams]);

  const updateOption = async (value, id) => {
    const newOptions = { ...options, [id]: value };
    if (JSON.stringify(newOptions) === JSON.stringify(options)) {
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
      if (response?.options) {
        setOptions(response.options);
      }
    } catch (err) {
      console.error(i18n.ERROR.UPDATING_OPTIONS, err?.message ? { message: err.message } : { err });
      if (err.message) {
        setError(<>
          <div>{i18n.ERROR.UPDATING_OPTIONS}</div>
          <small>{toHTML(i18n.ERROR.CHECK_YOUR_CONSOLE)}</small>
        </>);
      }
    } finally {
      setBusyAction(false);
    }
  }

  useEffect(() => {
    if (currentModel?.mode !== 'chat' && shortcodeParams?.embeddings_index) {
      updateShortcodeParams('', 'embeddings_index');
    }
  }, [shortcodeParams]);

  const updateShortcodeParams = async (value, id) => {
    const newParams = { ...shortcodeParams, [id]: value };
    // Intentionally using stale reference
    await updateOption(newParams, 'shortcode_chat_params');
  }

  const updateLimits = async (value, id) => {
    const newLimitsObj = { ...limits, [id]: value };
    await updateOption(newLimitsObj, 'limits');
  }

  const updateUserLimits = async (value, id) => {
    if (id === 'credits') {
      value = Math.max(0, value);
    }
    const newUserLimits = { ...limits?.users, [id]: value };
    const newLimitsObj = { ...limits, users: newUserLimits };
    await updateOption(newLimitsObj, 'limits');
  }

  const updateGuestLimits = async (value, id) => {
    if (id === 'credits') {
      value = Math.max(0, value);
    }
    const newGuestLimits = { ...limits?.guests, [id]: value };
    const newLimitsObj = { ...limits, guests: newGuestLimits };
    await updateOption(newLimitsObj, 'limits');
  }

  const limitSectionParams = useMemo(() => {
    if (limits?.[limitSection]) {
      return limits[limitSection];
    } else {
      return {
        credits: 1,
        creditType: 'price',
        timeFrame: 'month',
        isAbsolute: false,
        overLimitMessage: "You have reached the limit.",
        ignoredUsers: ''
      };
    }
  }, [limits, limitSection]);

  const updateLimitSection = async (value, id) => {
    if (id === 'credits') {
      value = Math.max(0, value);
    }
    const newSectionParams = { ...limitSectionParams, [id]: value };
    const newLimitsObj = { ...limits, [limitSection]: newSectionParams };
    await updateOption(newLimitsObj, 'limits');
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
    await updateOption(shortcodeDefaultParams, 'shortcode_chat_params');
  }

  const onResetShortcodeStyles = async () => {
    await updateOption({}, 'shortcode_chat_styles');
  }

  const onResetLimits = async () => {
    await updateOption(default_limits, 'limits');
  }

  // JSX components for settings, omitted for brevity, unchanged

  const jsxAssistants = (
    <NekoSettings title={i18n.COMMON.ASSISTANTS}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox
          name="module_suggestions"
          label={i18n.COMMON.POSTS_SUGGESTIONS + " (+ AI Wand)"}
          value="1"
          checked={module_suggestions}
          description={i18n.COMMON.POSTS_SUGGESTIONS_HELP}
          onChange={(val) => updateOption(val, 'module_suggestions')} />
        <NekoCheckbox
          name="module_woocommerce"
          label={i18n.COMMON.WOOCOMMERCE_PRODUCT_GENERATOR}
          value="1"
          checked={module_woocommerce}
          description={i18n.COMMON.WOOCOMMERCE_PRODUCT_GENERATOR_HELP}
          onChange={(val) => updateOption(val, 'module_woocommerce')} />
      </NekoCheckboxGroup>
    </NekoSettings>
  );

  const jsxGenerators = (
    <NekoSettings title={i18n.COMMON.GENERATORS}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox
          name="module_generator_content"
          label={i18n.COMMON.CONTENT_GENERATOR}
          value="1"
          checked={module_generator_content}
          description={i18n.COMMON.CONTENT_GENERATOR_HELP}
          onChange={(val) => updateOption(val, 'module_generator_content')} />
        <NekoCheckbox
          name="module_generator_images"
          label={i18n.COMMON.IMAGES_GENERATOR}
          value="1"
          checked={module_generator_images}
          description={i18n.COMMON.IMAGES_GENERATOR_HELP}
          onChange={(val) => updateOption(val, 'module_generator_images')} />
      </NekoCheckboxGroup>
    </NekoSettings>
  );

  const jsxPlayground = (
    <NekoSettings title={i18n.COMMON.PLAYGROUND}>
      <NekoCheckbox
        name="module_playground"
        label={i18n.COMMON.ENABLE}
        value="1"
        checked={module_playground}
        description={i18n.COMMON.PLAYGROUND_HELP}
        onChange={(val) => updateOption(val, 'module_playground')} />
    </NekoSettings>
  );

  const jsxForms = (
    <NekoSettings title={<>{i18n.COMMON.FORMS}<small style={{ position: 'relative', top: -3, fontSize: 8 }}> BETA</small></>}>
      <NekoCheckbox
        name="module_forms"
        label={i18n.COMMON.ENABLE}
        value="1"
        checked={module_forms}
        requirePro={true}
        isPro={isRegistered}
        description={i18n.COMMON.FORMS_HELP}
        onChange={(val) => updateOption(val, 'module_forms')} />
    </NekoSettings>
  );

  const jsxFinetunes = (
    <NekoSettings title={i18n.COMMON.FINETUNES}>
      <NekoCheckbox
        name="module_finetunes"
        label={i18n.COMMON.ENABLE}
        value="1"
        checked={module_finetunes}
        description={i18n.HELP.FINETUNES}
        onChange={(val) => updateOption(val, 'module_finetunes')} />
    </NekoSettings>
  );

  const jsxStatistics = (
    <NekoSettings title={<>{i18n.COMMON.STATISTICS}<small style={{ position: 'relative', top: -3, fontSize: 8 }}> BETA</small></>}>
      <NekoCheckbox
        name="module_statistics"
        label={i18n.COMMON.ENABLE}
        value="1"
        checked={module_statistics}
        requirePro={true}
        isPro={isRegistered}
        description={i18n.COMMON.STATISTICS_HELP}
        onChange={(val) => updateOption(val, 'module_statistics')} />
    </NekoSettings>
  );

  const jsxModeration = (
    <NekoSettings title={<>{i18n.COMMON.MODERATION}<small style={{ position: 'relative', top: -3, fontSize: 8 }}> BETA</small></>}>
      <NekoCheckbox
        name="module_moderation"
        label={i18n.COMMON.ENABLE}
        value="1"
        checked={module_moderation}
        description={i18n.COMMON.MODERATION_HELP}
        onChange={(val) => updateOption(val, 'module_moderation')} />
    </NekoSettings>
  );

  const jsxAudioTranscribe = (
    <NekoSettings title={<>{i18n.COMMON.AUDIO_TRANSCRIPTION}<small style={{ position: 'relative', top: -3, fontSize: 8 }}> BETA</small></>}>
      <NekoCheckbox
        name="module_audio"
        label={i18n.COMMON.ENABLE}
        value="1"
        checked={module_audio}
        description={i18n.COMMON.AUDIO_TRANSCRIPTION_HELP}
        onChange={(val) => updateOption(val, 'module_audio')} />
    </NekoSettings>
  );

  const jsxEmbeddings = (
    <NekoSettings title={<>{i18n.COMMON.EMBEDDINGS}<small style={{ position: 'relative', top: -3, fontSize: 8 }}> BETA</small></>}>
      <NekoCheckbox
        name="module_embeddings"
        label={i18n.COMMON.ENABLE}
        value="1"
        checked={module_embeddings}
        requirePro={true}
        isPro={isRegistered}
        description={i18n.COMMON.EMBEDDINGS_HELP}
        onChange={(val) => updateOption(val, 'module_embeddings')} />
    </NekoSettings>
  );

  const jsxChatbot = (
    <NekoSettings title={i18n.COMMON.CHATBOT}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox
          name="shortcode_chat"
          label={i18n.COMMON.ENABLE}
          value="1"
          checked={shortcode_chat}
          description={i18n.COMMON.CHATBOT_HELP}
          onChange={(val) => updateOption(val, 'shortcode_chat')} />
      </NekoCheckboxGroup>
    </NekoSettings>
  );

  const jsxShortcodeFormatting = (
    <NekoSettings title={i18n.COMMON.FORMATTING}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox
          name="shortcode_chat_formatting"
          label={i18n.COMMON.ENABLE}
          value="1"
          checked={shortcode_chat_formatting}
          description={toHTML(i18n.COMMON.FORMATTING_HELP)}
          onChange={(val) => updateOption(val, 'shortcode_chat_formatting')} />
      </NekoCheckboxGroup>
    </NekoSettings>
  );

  const jsxShortcodeTypewriter = (
    <NekoSettings title={i18n.SETTINGS.TYPEWRITER_EFFECT}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox
          name="shortcode_chat_typewriter"
          label={i18n.COMMON.ENABLE}
          value="1"
          checked={shortcode_chat_typewriter}
          description={i18n.SETTINGS.TYPEWRITER_EFFECT_HELP}
          onChange={(val) => updateOption(val, 'shortcode_chat_typewriter')} />
      </NekoCheckboxGroup>
    </NekoSettings>
  );

  const jsxShortcodeDiscussions = (
    <NekoSettings title={i18n.COMMON.DISCUSSIONS}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox
          name="shortcode_chat_discussions"
          label={i18n.COMMON.ENABLE}
          value="1"
          checked={shortcode_chat_discussions}
          description={i18n.HELP.DISCUSSIONS}
          onChange={(val) => updateOption(val, 'shortcode_chat_discussions')} />
      </NekoCheckboxGroup>
    </NekoSettings>
  );

  const jsxShortcodeSyntaxHighlighting = (
    <NekoSettings title={i18n.COMMON.CODE}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox
          name="shortcode_chat_syntax_highlighting"
          label="Use Syntax Highlighting"
          value="1"
          checked={shortcode_chat_syntax_highlighting}
          description={<>Add syntax coloring to the code written by the chatbot.</>}
          onChange={(val) => updateOption(val, 'shortcode_chat_syntax_highlighting')} />
      </NekoCheckboxGroup>
    </NekoSettings>
  );

  const jsxShortcodeChatLogs = (
    <NekoSettings title={i18n.COMMON.LOGS}>
      <NekoCheckboxGroup max="1">
        <NekoSelect
          scrolldown
          id="shortcode_chat_logs"
          name="shortcode_chat_logs"
          value={shortcode_chat_logs}
          description=""
          onChange={(val) => updateOption(val, 'shortcode_chat_logs')}>
          <NekoOption value="" label="None" />
          <NekoOption value="file" label="Files (/uploads/chatbot folder)" />
        </NekoSelect>
      </NekoCheckboxGroup>
    </NekoSettings>
  );

  const jsxDebugMode = (
    <NekoSettings title={i18n.COMMON.DEBUG_MODE}>
      <NekoCheckbox
        name="debug_mode"
        label={i18n.COMMON.ENABLE}
        value="1"
        checked={debug_mode}
        description={i18n.COMMON.DEBUG_MODE_HELP}
        onChange={(val) => updateOption(val, 'debug_mode')} />
    </NekoSettings>
  );

  const jsxResolveShortcodes = (
    <NekoSettings title={i18n.COMMON.SHORTCODES}>
      <NekoCheckbox
        name="resolve_shortcodes"
        label={i18n.COMMON.RESOLVE}
        value="1"
        checked={resolve_shortcodes}
        description={i18n.HELP.RESOLVE_SHORTCODE}
        onChange={(val) => updateOption(val, 'resolve_shortcodes')} />
    </NekoSettings>
  );

  const jsxDynamicMaxTokens = (
    <NekoSettings title={i18n.COMMON.DYNAMIC_MAX_TOKENS}>
      <NekoCheckbox
        name="dynamic_max_tokens"
        label={i18n.COMMON.ENABLE}
        value="1"
        checked={dynamic_max_tokens}
        description={i18n.HELP.DYNAMIC_MAX_TOKENS}
        onChange={(val) => updateOption(val, 'dynamic_max_tokens')} />
    </NekoSettings>
  );

  const jsxBannedKeywords = (
    <NekoSettings title={i18n.COMMON.BANNED_WORDS}>
      <NekoInput
        id="banned_words"
        name="banned_words"
        value={banned_words}
        isCommaSeparatedArray={true}
        description={i18n.HELP.BANNED_WORDS}
        onBlur={(val) => updateOption(val, 'banned_words')} />
    </NekoSettings>
  );

  const jsxBannedIPs = (
    <NekoSettings title={i18n.COMMON.BANNED_IPS}>
      <NekoInput
        id="banned_ips"
        name="banned_ips"
        value={banned_ips}
        isCommaSeparatedArray={true}
        description={i18n.HELP.BANNED_IPS}
        onBlur={(val) => updateOption(val, 'banned_ips')} />
    </NekoSettings>
  );

  const jsxAdminBarPlayground = (
    <NekoSettings title={i18n.COMMON.PLAYGROUND}>
      <NekoCheckbox
        label={i18n.COMMON.ENABLE}
        value="1"
        checked={admin_bar?.playground}
        onChange={(val) => {
          const newAdminBar = { ...admin_bar, playground: val };
          updateOption(newAdminBar, 'admin_bar');
        }} />
    </NekoSettings>
  );

  const jsxAdminBarGenerateContent = (
    <NekoSettings title={i18n.COMMON.GENERATE_CONTENT}>
      <NekoCheckbox
        label={i18n.COMMON.ENABLE}
        value="1"
        checked={admin_bar?.content_generator}
        onChange={(val) => {
          const newAdminBar = { ...admin_bar, content_generator: val };
          updateOption(newAdminBar, 'admin_bar');
        }} />
    </NekoSettings>
  );

  const jsxAdminBarGenerateImages = (
    <NekoSettings title={i18n.COMMON.GENERATE_IMAGES}>
      <NekoCheckbox
        label={i18n.COMMON.ENABLE}
        value="1"
        checked={admin_bar?.images_generator}
        onChange={(val) => {
          const newAdminBar = { ...admin_bar, images_generator: val };
          updateOption(newAdminBar, 'admin_bar');
        }} />
    </NekoSettings>
  );

  const jsxAdminBarSettings = (
    <NekoSettings title={'AI Engine'}>
      <NekoCheckbox
        label={i18n.COMMON.ENABLE}
        value="1"
        checked={admin_bar?.settings}
        onChange={(val) => {
          const newAdminBar = { ...admin_bar, settings: val };
          updateOption(newAdminBar, 'admin_bar');
        }} />
    </NekoSettings>
  );

  const jsxOpenAiService = (
    <NekoSettings title={i18n.COMMON.OPENAI_SERVICE}>
      <NekoSelect
        scrolldown
        name="openai_service"
        value={openai_service}
        description={toHTML(i18n.HELP.OPENAI_SERVICE)}
        onChange={(val) => updateOption(val, 'openai_service')}>
        <NekoOption value="openai" label="Open AI" />
        <NekoOption value="azure" label="Microsoft Azure" />
      </NekoSelect>
    </NekoSettings>
  );

  const jsxOpenAiAzureEndpoint = (
    <NekoSettings title={i18n.COMMON.OPENAI_AZURE_ENDPOINT}>
      <NekoInput
        name="openai_azure_endpoint"
        value={openai_azure_endpoint}
        onBlur={(val) => updateOption(val, 'openai_azure_endpoint')} />
    </NekoSettings>
  );

  const jsxOpenAiAzureApiKey = (
    <NekoSettings title={i18n.COMMON.OPENAI_AZURE_API_KEY}>
      <NekoInput
        name="openai_azure_apikey"
        value={openai_azure_apikey}
        onBlur={(val) => updateOption(val, 'openai_azure_apikey')} />
    </NekoSettings>
  );

  const jsxOpenAiAzureDeployment = (
    <NekoSettings title={i18n.COMMON.OPENAI_AZURE_DEPLOYMENT}>
      <NekoInput
        name="openai_azure_deployment"
        value={openai_azure_deployment}
        description={toHTML(i18n.HELP.OPENAI_AZURE_DEPLOYMENT)}
        onBlur={(val) => updateOption(val, 'openai_azure_deployment')} />
    </NekoSettings>
  );

  const jsxOpenAiApiKey = (
    <NekoSettings title={i18n.COMMON.API_KEY}>
      <NekoInput
        name="openai_apikey"
        value={openai_apikey}
        description={toHTML(i18n.COMMON.API_KEY_HELP)}
        onBlur={(val) => updateOption(val, 'openai_apikey')} />
    </NekoSettings>
  );

  const jsxPineconeApiKey = (
    <NekoSettings title={i18n.COMMON.API_KEY}>
      <NekoInput
        name="apikey"
        value={pinecone?.apikey || ''}
        description={toHTML(i18n.COMMON.EMBEDDINGS_APIKEY_HELP)}
        onBlur={(val) => {
          const newPinecone = { ...pinecone, apikey: val };
          updateOption(newPinecone, 'pinecone');
        }} />
    </NekoSettings>
  );

  const jsxPineconeServer = (
    <NekoSettings title={i18n.COMMON.SERVER}>
      <NekoSelect
        scrolldown
        name="server"
        value={pinecone?.server}
        description={toHTML(i18n.COMMON.SERVER_HELP)}
        onChange={(val) => {
          const newPinecone = { ...pinecone, server: val };
          updateOption(newPinecone, 'pinecone');
        }}>
        <NekoOption value="us-east1-gcp" label="us-east1-gcp" />
        <NekoOption value="us-east4-gcp" label="us-east4-gcp" />
        <NekoOption value="us-west1-gcp" label="us-west1-gcp" />
        <NekoOption value="us-west4-gcp" label="us-west4-gcp" />
        <NekoOption value="us-east-1-aws" label="us-east-1-aws" />
        <NekoOption value="us-west-1-aws" label="us-west-1-aws" />
        <NekoOption value="us-central1-gcp" label="us-central1-gcp" />
        <NekoOption value="eu-west1-gcp" label="eu-west1-gcp" />
        <NekoOption value="asia-southeast1-gcp" label="asia-southeast1-gcp" />
      </NekoSelect>
    </NekoSettings>
  );

  const jsxPineconeNamespace = (
    <NekoSettings title={i18n.COMMON.NAMESPACE}>
      <NekoInput
        name="namespace"
        value={pinecone?.namespace || 'mwai'}
        description={toHTML(i18n.COMMON.NAMESPACE_HELP)}
        onBlur={(val) => {
          const newPinecone = { ...pinecone, namespace: val };
          updateOption(newPinecone, 'pinecone');
        }} />
    </NekoSettings>
  );

  const jsxOpenAiUsage = (
    <div>
      <div style={{ fontSize: 12, marginTop: -5 }}>
        {toHTML(i18n.COMMON.USAGE_COSTS_HELP)}
      </div>
      <MonthlyUsage options={options} />
    </div>
  );

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
            {shortcode_chat && <NekoTab title={i18n.COMMON.CHATBOT}>
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
                    {/* Builder form omitted for brevity, pass as is */}
                    <StyledBuilderForm>
                      {/* ... various input fields, same as original ... */}
                      {/* Shortcode preview */}
                      <pre>{builtShortcode}</pre>
                    </StyledBuilderForm>
                    <NekoCheckbox
                      name="shortcode_chat_params_override"
                      label={i18n.SETTINGS.SET_AS_DEFAULT_PARAMETERS}
                      disabled={Object.keys(shortcodeParamsDiff).length < 1}
                      value="1"
                      checked={shortcodeParamsOverride}
                      description={i18n.SETTINGS.SET_AS_DEFAULT_PARAMETERS_HELP}
                      onChange={(val) => updateOption(val, 'shortcode_chat_params_override')} />
                    <NekoCheckbox
                      name="shortcode_chat_inject"
                      label={i18n.SETTINGS.INJECT_DEFAULT_CHATBOT}
                      value="1"
                      checked={shortcodeChatInject}
                      description={i18n.SETTINGS.INJECT_DEFAULT_CHATBOT_HELP}
                      onChange={(val) => updateOption(val, 'shortcode_chat_inject')} />
                  </NekoBlock>
                </NekoColumn>
                <NekoColumn minimal>
                  <NekoBlock busy={busy} title={i18n.COMMON.FEATURES} className="primary">
                    {jsxShortcodeDiscussions}
                    {jsxShortcodeFormatting}
                    {jsxShortcodeSyntaxHighlighting}
                    {jsxShortcodeTypewriter}
                    {jsxShortcodeChatLogs}
                  </NekoBlock>
                </NekoColumn>
              </NekoWrapper>
            </NekoTab>}
            {/* Other tabs "discussions", "embeddings", "finetunes", etc ... */}
            {/* ... unchanged ... */}
            <NekoTab key="advanced"
              title={
                accidentsPastDay > 0 ?
                <>{i18n.COMMON.SETTINGS} <NekoIcon style={{ marginLeft: 5, marginRight: -5 }} width="16" icon="alert" variant="warning" /></> :
                <>{i18n.COMMON.SETTINGS}</>
              }>
              <NekoWrapper>
                <NekoColumn minimal>
                  <NekoBlock busy={busy} title={i18n.COMMON.OPENAI} className="primary">
                    {jsxOpenAiService}
                    {openai_service === 'openai' && <>
                      {jsxOpenAiApiKey}
                    </>}
                    {openai_service === 'azure' && <>
                      {jsxOpenAiAzureEndpoint}
                      {jsxOpenAiAzureApiKey}
                      {jsxOpenAiAzureDeployment}
                    </>}
                  </NekoBlock>
                  {module_embeddings && <NekoBlock busy={busy} title="Pinecone" className="primary">
                    {jsxPineconeApiKey}
                    {jsxPineconeServer}
                    {jsxPineconeNamespace}
                  </NekoBlock>}
                  <NekoBlock busy={busy} title={i18n.COMMON.ADMIN_BAR} className="primary">
                    {jsxAdminBarSettings}
                    {jsxAdminBarPlayground}
                    {jsxAdminBarGenerateContent}
                    {jsxAdminBarGenerateImages}
                  </NekoBlock>
                  <NekoBlock busy={busy} title={i18n.COMMON.ADVANCED} className="primary">
                    {jsxDebugMode}
                    {jsxResolveShortcodes}
                    {jsxDynamicMaxTokens}
                  </NekoBlock>
                  <NekoBlock busy={busy} title={i18n.COMMON.SECURITY} className="primary">
                    {jsxBannedKeywords}
                    {jsxBannedIPs}
                  </NekoBlock>
                </NekoColumn>
                <NekoColumn minimal>
                  <OpenAIStatus incidents={incidents} isLoading={isLoadingIncidents} />
                </NekoColumn>
              </NekoWrapper>
            </NekoTab>
            {shortcode_chat && <NekoTab title={i18n.COMMON.CHATBOTS + " (Beta)"}>
              <Chatbots options={options} updateOption={updateOption} busy={busy} />
            </NekoTab>}
            <NekoTab title={i18n.COMMON.LICENSE_TAB}>
              <LicenseBlock domain={domain} prefix={prefix} isPro={isPro} isRegistered={isRegistered} />
            </NekoTab>
          </NekoTabs>
        </NekoColumn>
      </NekoWrapper>
      <NekoModal
        isOpen={!!error}
        title={i18n.COMMON.ERROR}
        content={error}
        ok="Close"
        onRequestClose={() => setError(null)}
        onOkClick={() => setError(null)} />
    </NekoPage>
  );
};

export default Settings;