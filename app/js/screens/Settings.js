// Previous: 2.0.0
// Current: 2.0.2

const { useMemo, useState, useEffect } = wp.element;

import { NekoButton, NekoInput, NekoPage, NekoBlock, NekoContainer, NekoWrapper, 
  NekoSettings, NekoSpacer, NekoSelect, NekoOption, NekoTabs, NekoTab, NekoCheckboxGroup, 
  NekoCheckbox, NekoCollapsableCategory, NekoColumn, NekoIcon, NekoModal } from '@neko-ui';

import { nekoFetch } from '@neko-ui';
import { useQuery } from '@tanstack/react-query';

import { LicenseBlock } from '@common';
import { apiUrl, prefix, domain, isRegistered, isPro, restNonce, options as defaultOptions } from '@app/settings';
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
  
  const shortcodeParams = options?.shortcode_chat_params || {};
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
  const module_assistants = options?.module_assistants;
  const module_transcription = options?.module_transcription;
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
  const shortcode_forms_legacy = options?.shortcode_forms_legacy;
  const shortcode_chat_stream = options?.shortcode_chat_stream;
  const speech_recognition = options?.speech_recognition;
  const speech_synthesis = options?.speech_synthesis;
  const public_api = options?.public_api;
  const statistics_data = options?.statistics_data;
  const statistics_forms_data = options?.statistics_forms_data;
  const intro_message = options?.intro_message;
  const dynamic_max_tokens = options?.dynamic_max_tokens;
  const dynamic_max_messages = options?.dynamic_max_messages;
  const context_max_tokens = options?.context_max_tokens; 
  const banned_ips = options?.banned_ips;
  const banned_words = options?.banned_words;
  const admin_bar = options?.admin_bar ?? ['settings'];
  const resolve_shortcodes = options?.resolve_shortcodes;
  const clean_uninstall = options?.clean_uninstall;
  const { completionModels, allModels, getModel } = useModels(options);

  const currentModel = getModel(shortcodeParams.model);
  const { isLoading: isLoadingIncidents, data: incidents } = useQuery({
    queryKey: ['incidents'], queryFn: retrieveIncidents
  });
  const accidentsPastDay = useMemo(() => incidents?.filter(x => {
    const incidentDate = new Date(x.date);
    return incidentDate > new Date(Date.now() - 24 * 60 * 60 * 1000);
  }).length, [incidents]);

  const busy = busyAction;

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
    const newParams = { ...shortcodeParams, [id]: value };
    await updateOption(newParams, 'shortcode_chat_params');
  };

  const jsxUtilities =
    <NekoSettings title={i18n.COMMON.UTILITIES}>
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

  const jsxFinetunes = 
    <NekoSettings title={i18n.COMMON.FINETUNES}>
      <NekoCheckbox name="module_finetunes" label={i18n.COMMON.ENABLE} value="1"
        checked={module_finetunes}
        description={i18n.HELP.FINETUNES}
        onChange={updateOption} />
    </NekoSettings>;

  const jsxStatistics = 
    <NekoSettings title={<>{i18n.COMMON.STATISTICS}</>}>
      <NekoCheckbox name="module_statistics" label={i18n.COMMON.ENABLE} value="1"
        checked={module_statistics} requirePro={true} isPro={isRegistered}
        description={i18n.COMMON.STATISTICS_HELP}
        onChange={updateOption} />
    </NekoSettings>;

  const jsxModeration = 
    <NekoSettings title={<>{i18n.COMMON.MODERATION}</>}>
      <NekoCheckbox name="module_moderation" label={i18n.COMMON.ENABLE} value="1"
        checked={module_moderation}
        description={i18n.COMMON.MODERATION_HELP}
        onChange={updateOption} />
    </NekoSettings>;

  const jsxTranscribe = 
    <NekoSettings title={<>{i18n.COMMON.TRANSCRIPTION}</>}>
      <NekoCheckbox name="module_transcription" label={i18n.COMMON.ENABLE} value="1"
        checked={module_transcription}
        description={i18n.COMMON.TRANSCRIPTION_HELP}
        onChange={updateOption} />
    </NekoSettings>;

  const jsxEmbeddings = 
    <NekoSettings title={<>{i18n.COMMON.EMBEDDINGS}</>}>
      <NekoCheckbox name="module_embeddings" label={i18n.COMMON.ENABLE} value="1"
        checked={module_embeddings} requirePro={true} isPro={isRegistered}
        description={i18n.COMMON.EMBEDDINGS_HELP}
        onChange={updateOption} />
    </NekoSettings>;

  const jsxAssistants =
    <NekoSettings title={<>{i18n.COMMON.ASSISTANTS}<small style={{ position: 'relative', top: -3, fontSize: 8 }}> BETA</small></>}>
      <NekoCheckbox name="module_assistants" label={i18n.COMMON.ENABLE} value="1"
        checked={module_assistants} requirePro={true} isPro={isRegistered}
        description={i18n.HELP.ASSISTANTS}
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

  const jsxStatisticsData =
   <NekoSettings title={i18n.COMMON.QUERIES_DATA}>
     <NekoCheckboxGroup max="1">
       <NekoCheckbox name="statistics_data" label={i18n.COMMON.ENABLE} value="1" checked={statistics_data}
         description={i18n.HELP.QUERIES_DATA}
         onChange={updateOption} />
     </NekoCheckboxGroup>
   </NekoSettings>;

  const jsxStatisticsFormsData =
    <NekoSettings title={i18n.COMMON.QUERIES_FORMS_DATA}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="statistics_forms_data" label={i18n.COMMON.ENABLE} value="1" checked={statistics_forms_data}
          description={i18n.HELP.QUERIES_FORMS_DATA}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxIntroMessage =
    <NekoSettings title={i18n.COMMON.INTRO_MESSAGE}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="intro_message" label={i18n.COMMON.ENABLE} value="1" checked={intro_message}
          description={i18n.HELP.INTRO_MESSAGE}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxShortcodeFormatting =
    <NekoSettings title={i18n.COMMON.FORMATTING}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="shortcode_chat_formatting" label={i18n.COMMON.ENABLE} value="1"
          checked={shortcode_chat_formatting}
          description={toHTML(i18n.COMMON.FORMATTING_HELP)}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxWebSpeechAPI =
    <NekoSettings title={i18n.COMMON.WEBSPEECH_API}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="speech_recognition" label={i18n.COMMON.SPEECH_RECOGNITION} value="1"
          checked={speech_recognition}
          description={i18n.HELP.SPEECH_RECOGNITION}
          onChange={updateOption} />
      </NekoCheckboxGroup>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="speech_synthesis" label={i18n.COMMON.SPEECH_SYNTHESIS + " (SOON)"} value="1"
          disabled={true}
          checked={speech_synthesis}
          description={i18n.HELP.SPEECH_SYNTHESIS}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxLegacyForms =
    <NekoSettings title={i18n.COMMON.LEGACY_FORMS}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="shortcode_forms_legacy" label={`${i18n.COMMON.ENABLE}`} value="1"
          requirePro={true} isPro={isRegistered}
          checked={shortcode_forms_legacy}
          description="Don't use the Legacy Forms. It's deprecated and will be removed in the future. Only enable if you have issues with the new forms."
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxStream =
    <NekoSettings title={i18n.COMMON.STREAMING}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="shortcode_chat_stream" label={i18n.COMMON.ENABLE} value="1"
          checked={shortcode_chat_stream}
          description={i18n.HELP.STREAMING}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxShortcodeTypewriter =
    <NekoSettings title={i18n.SETTINGS.TYPEWRITER_EFFECT}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="shortcode_chat_typewriter" label={i18n.COMMON.ENABLE} value="1"
          checked={shortcode_chat_typewriter}
          description={toHTML(i18n.SETTINGS.TYPEWRITER_EFFECT_HELP)}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxShortcodeDiscussions = 
    <NekoSettings title={i18n.COMMON.DISCUSSIONS}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="shortcode_chat_discussions" label={i18n.COMMON.ENABLE} value="1"
          checked={shortcode_chat_discussions}
          description={i18n.HELP.DISCUSSIONS}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxShortcodeSyntaxHighlighting =
    <NekoSettings title={i18n.COMMON.SYNTAX_HIGHLIGHT}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="shortcode_chat_syntax_highlighting" label={i18n.COMMON.ENABLE} value="1" checked={shortcode_chat_syntax_highlighting}
          description={i18n.HELP.SYNTAX_HIGHLIGHT}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxPublicAPI =
    <NekoSettings title={i18n.COMMON.PUBLIC_API}>
      <NekoCheckbox name="public_api" label={i18n.COMMON.ENABLE} value="1" checked={public_api}
        description={i18n.HELP.PUBLIC_API}
        onChange={updateOption} />
    </NekoSettings>;

  const jsxImageLocalUpload =
    <NekoSettings title="Local Upload">
      <NekoSelect scrolldown name="image_local_upload" value={options?.image_local_upload} onChange={updateOption}
        description="Images can be stored either in the filesystem or in the Media Library.">
        <NekoOption key='uploads' value='uploads' label="Filesystem"></NekoOption>
        <NekoOption key='library' value='library' label="Media Library"></NekoOption>
      </NekoSelect>
    </NekoSettings>;

  const jsxImageRemoteUpload =
    <NekoSettings title="Remote Upload">
      <NekoSelect scrolldown name="image_remote_upload" value={options?.image_remote_upload} onChange={updateOption}
        description="Select Upload Data for private sites; Share URLs requires your WordPress to be online and reachable.">
        <NekoOption key='data' value='data' label="Upload Data"></NekoOption>
        <NekoOption key='url' value='url' label="Share URLs"></NekoOption>
      </NekoSelect>
    </NekoSettings>;

  const jsxImageExpiration =
    <NekoSettings title="Expiration">
      <NekoSelect scrolldown name="image_expires" value={options?.image_expires ?? null} onChange={updateOption}
        description="The images will be deleted after a certain amount of time.">
        <NekoOption key={1 * 60 * 60} value={1 * 60 * 60} label="1 hour"></NekoOption>
        <NekoOption key={6 * 60 * 60} value={6 * 60 * 60} label="6 hours"></NekoOption>
        <NekoOption key={24 * 60 * 60} value={24 * 60 * 60} label="1 day"></NekoOption>
        <NekoOption key={7 * 24 * 60 * 60} value={7 * 24 * 60 * 60} label="1 week"></NekoOption>
        <NekoOption key={30 * 24 * 60 * 60} value={30 * 24 * 60 * 60} label="1 month"></NekoOption>
        <NekoOption key={'Never'} value={'never'} label="Never"></NekoOption>
      </NekoSelect>
    </NekoSettings>;

  const jsxDevTools =
    <NekoSettings title={i18n.COMMON.DEV_TOOLS}>
      <NekoCheckbox name="module_devtools" label={i18n.COMMON.ENABLE} value="1" checked={module_devtools}
        description={i18n.HELP.DEV_TOOLS}
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

  const jsxContextMaxTokens =
    <NekoSettings title={i18n.COMMON.CONTEXT_MAX_TOKENS}>
      <NekoInput name="context_max_tokens" value={context_max_tokens}
        description={i18n.HELP.CONTEXT_MAX_TOKENS}
        onBlur={updateOption} />
    </NekoSettings>;

  const jsxDynamicMaxMessages =
    <NekoSettings title={i18n.COMMON.DYNAMIC_MAX_MESSAGES}>
      <NekoCheckbox name="dynamic_max_messages" label={i18n.COMMON.ENABLE + " (SOON)"} value="1" checked={dynamic_max_messages}
        disabled={true}
        description={i18n.HELP.DYNAMIC_MAX_TOKENS}
        onChange={updateOption} />
    </NekoSettings>;

  const jsxBannedKeywords =
    <NekoSettings title={i18n.COMMON.BANNED_WORDS}>
      <NekoInput id="banned_words" name="banned_words" value={banned_words}
        isCommaSeparatedArray={true}
        description={i18n.HELP.BANNED_WORDS}
        onBlur={updateOption} />
    </NekoSettings>;
    
  const jsxUtilitiesModel =
    <NekoSettings title={i18n.COMMON.DEFAULT_MODEL}>
      <NekoSelect scrolldown name="ai_default_model"
        value={ai_default_model} description="" onChange={updateOption}>
        {completionModels.map((x) => (
          <NekoOption key={x.model} value={x.model} label={x.name}></NekoOption>
        ))}
      </NekoSelect>
    </NekoSettings>;
        
  const jsxBannedIPs = 
    <NekoSettings title={i18n.COMMON.BANNED_IPS}>
      <NekoInput id="banned_ips" name="banned_ips" value={banned_ips}
        isCommaSeparatedArray={true}
        description={i18n.HELP.BANNED_IPS}
        onBlur={updateOption} />
    </NekoSettings>;

  const jsxAdminBarPlayground =
    <NekoSettings title={i18n.COMMON.PLAYGROUND}>
      <NekoCheckbox label={i18n.COMMON.ENABLE} value="1"
        checked={admin_bar?.playground}
        onChange={(value) => {
          const freshAdminBar = { ...admin_bar, playground: value };
          updateOption(freshAdminBar, 'admin_bar');
        }} />
    </NekoSettings>;

  const jsxAdminBarGenerateContent =
    <NekoSettings title={i18n.COMMON.GENERATE_CONTENT}>
      <NekoCheckbox label={i18n.COMMON.ENABLE} value="1"
        checked={admin_bar?.content_generator}
        onChange={(value) => {
          const freshAdminBar = { ...admin_bar, content_generator: value };
          updateOption(freshAdminBar, 'admin_bar');
        }} />
    </NekoSettings>;

  const jsxAdminBarGenerateImages =
    <NekoSettings title={i18n.COMMON.GENERATE_IMAGES}>
      <NekoCheckbox label={i18n.COMMON.ENABLE} value="1"
        checked={admin_bar?.images_generator}
        onChange={(value) => {
          const freshAdminBar = { ...admin_bar, images_generator: value };
          updateOption(freshAdminBar, 'admin_bar');
        }} />
    </NekoSettings>;

  const jsxAdminBarSettings =
    <NekoSettings title={'AI Engine'}> 
      <NekoCheckbox label={i18n.COMMON.ENABLE} value="1"
        checked={admin_bar?.settings}
        onChange={(value) => {  
          const freshAdminBar = { ...admin_bar, settings: value };
          updateOption(freshAdminBar, 'admin_bar');
        }} />
    </NekoSettings>;

  const jsxOpenAiUsage = <div>
    <div style={{ fontSize: 12, marginTop: -5 }}>
      {toHTML(i18n.COMMON.USAGE_COSTS_HELP)}
    </div>
    <MonthlyUsage options={options} />
  </div>;

  const jsxIncidentsIcon = accidentsPastDay > 0 ? <NekoIcon
    style={{ marginLeft: 5, marginRight: -5, display: 'inline' }} width="16"
    icon="alert" variant="warning" />
    : null;

  const jsxAIEnvironmentDefault =
    <NekoSelect scrolldown name="ai_default_env" value={ai_default_env} onChange={updateOption}>
      {ai_envs.map((x) => (
        <NekoOption key={x.id} value={x.id} label={x.name}></NekoOption>
      ))}
    </NekoSelect>;

  const jsxEmbeddingsEnvironmentDefault =
    <NekoSelect scrolldown name="embeddings_default_env" value={embeddings_default_env} onChange={updateOption}>
      {embeddings_envs.map((x) => (
        <NekoOption key={x.id} value={x.id} label={x.name}></NekoOption>
      ))}
    </NekoSelect>;

  const jsxCleanUninstall =
    <NekoSettings title={i18n.COMMON.PLUGIN_DATA}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox name="clean_uninstall" label={i18n.COMMON.DELETE_ALL} description={i18n.COMMON.PLUGIN_DATA_DESCRIPTION} value="1" checked={clean_uninstall} onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

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

            {module_assistants && <NekoTab title={i18n.COMMON.ASSISTANTS}>
              <Assistants options={options} updateOption={updateOption} refreshOptions={refreshOptions} />
            </NekoTab>}

            {module_finetunes && <NekoTab title={i18n.COMMON.FINETUNES}>
              <FineTunes options={options} updateOption={updateOption} refreshOptions={refreshOptions} />
            </NekoTab>}

            {module_moderation && <NekoTab title={i18n.COMMON.MODERATION}>
              <Moderation options={options} updateOption={updateOption} busy={busy} />
            </NekoTab>}

            {module_transcription && <NekoTab title={i18n.COMMON.TRANSCRIPTION}>
              <Transcription options={options} updateOption={updateOption} />
            </NekoTab>}

            <NekoTab key="advanced" title={<>{i18n.COMMON.SETTINGS}{jsxIncidentsIcon}</>}>
              <NekoWrapper>

                <NekoColumn minimal>  

                  <AIEnvironmentsSettings busy={busy}
                    options={options}
                    environments={ai_envs}
                    updateEnvironment={updateAIEnvironment}
                    updateOption={updateOption}
                  />

                  <NekoBlock busy={busy} title={i18n.COMMON.AI_ENVIRONMENT_DEFAULT} className="primary">
                    {jsxAIEnvironmentDefault}
                    <NekoSpacer />
                    {jsxUtilitiesModel}
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
                    <p>{i18n.HELP.STATISTICS}</p>
                    {jsxStatisticsData}
                    {jsxStatisticsFormsData}
                  </NekoBlock>}

                  <NekoBlock busy={busy} title={i18n.COMMON.IMAGES} className="primary">
                    {jsxImageLocalUpload}
                    {jsxImageRemoteUpload}
                    {jsxImageExpiration}
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
                    {jsxDynamicMaxTokens}
                    {jsxContextMaxTokens}
                    {jsxDynamicMaxMessages}
                    {jsxPublicAPI}
                    {jsxDevTools}
                    {jsxCleanUninstall}
                  </NekoBlock>

                  <NekoBlock busy={busy} title={i18n.COMMON.SECURITY} className="primary">
                    {jsxBannedKeywords}
                    {jsxBannedIPs}
                  </NekoBlock>

                  <NekoBlock busy={busy} title={i18n.COMMON.LEGACY_FEATURES} className="primary">
                    {jsxLegacyForms}
                    {jsxShortcodeFormatting}
                    {jsxShortcodeTypewriter}
                  </NekoBlock>

                </NekoColumn>

              </NekoWrapper>
            </NekoTab>

            {module_devtools && <NekoTab title={i18n.COMMON.DEV_TOOLS}>
              <DevToolsTab options={options} setOptions={setOptions} updateOption={updateOption} />
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