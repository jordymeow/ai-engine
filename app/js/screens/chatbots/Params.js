// Previous: 2.8.7
// Current: 2.9.3

const { useMemo, useState, useEffect, useRef } = wp.element;

import {
  NekoInput, NekoSelect, NekoOption, NekoCheckbox, NekoWrapper, NekoMessage,
  NekoColumn, NekoTextArea, NekoButton, NekoAccordion, NekoAccordions
} from '@neko-ui';

import { isRegistered } from '@app/settings';

import i18n from '@root/i18n';
import { pluginUrl } from "@app/settings";
import { AnthropicIcon, GoogleIcon, JsIcon, OpenAiIcon, PhpIcon, toHTML, useModels } from '@app/helpers-admin';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";
import TokensInfo from '@app/components/TokensInfo';
import Shortcode from './Shortcode';
import { setAssistantFunctions } from '@app/requests';
import { isEmoji } from '@app/helpers';

const shadowFilter = 'drop-shadow(0 0 5px rgba(0,0,0,0.1))';
const voices = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'sage', 'shimmer', 'verse'];

const chatIcons = ['chat-openai.svg', 'chat-robot-1.svg', 'chat-robot-2.svg',
  'chat-nyao-1.svg', 'chat-nyao-2.svg', 'chat-nyao-3.svg',
  'chat-color-blue.svg', 'chat-color-green.svg', 'chat-color-red.svg',
  'chat-traditional-1.svg', 'chat-traditional-2.svg', 'avatar-user.svg',
  'avatar-woman-blond.svg', 'avatar-woman-indian.svg', 'avatar-woman-asian.svg', 'avatar-woman-doctor.svg',
  'avatar-man-blond.svg', 'avatar-man-black.svg', 'avatar-man-sunglasses.svg', 'avatar-man-pirate.svg'];

const ChatIconSelector = ({ label, valueName, updateShortcodeParams, icon }) => {
  const chatIcon = icon ? icon : 'chat-color-green.svg';
  const isCustomEmoji = isEmoji(chatIcon);
  const isCustom = isCustomEmoji || chatIcon?.startsWith('https://') || chatIcon?.startsWith('http://');
  const previewIcon = isCustom ? chatIcon : `${pluginUrl}/images/${chatIcon}`;

  return (<>
    <div className="mwai-builder-row">
      <label>{label}:</label>
    </div>
    <div style={{
      marginTop: 0, border: '1.5px solid #d2e4f3', borderRadius: 5,
      padding: '10px 10px 10px 10px', background: '#f5fcff'
    }}>
      <div className="mwai-builder-row" style={{ marginTop: 0 }}>
        <div className="mwai-builder-col" style={{ flex: 2 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
            {chatIcons.map(x =>
              <div key={x} style={{ cursor: 'pointer' }}
                onMouseDown={(ev) => ev.stopPropagation()}
                onClick={(ev) => {
                  ev.stopPropagation();
                  updateShortcodeParams(x, valueName);
                }}>
                <img style={{ marginRight: 2, marginBottom: 2, filter: shadowFilter }}
                  width={24} height={24} src={`${pluginUrl}/images/${x}`}
                />
              </div>
            )}
            <div style={{
              width: 24, height: 24, border: '1px solid #d2e4f3', background: '#f5fcff',
              borderRadius: 5, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}
            onMouseDown={(ev) => ev.stopPropagation()}
            onClick={(ev) => { ev.stopPropagation(); updateShortcodeParams(`${pluginUrl}/images/chat-traditional-1.svg`, valueName); }}
            >...</div>
          </div>
        </div>
        <div className="mwai-builder-col" style={{ width: 48, display: 'flex', alignItems: 'end' }}>
          {isCustomEmoji ?
            <div style={{ fontSize: 48, lineHeight: '48px', marginRight: 0, paddingTop: 0 }}>{chatIcon}</div> :
            <img style={{ marginRight: 0, paddingTop: 0, filter: shadowFilter }}
              width={48} height={48} src={`${previewIcon}`}
            />
          }
        </div>
      </div>
      {isCustom && <div className="mwai-builder-row">
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.CUSTOM_ICON}:</label>
          <NekoInput name="icon" value={chatIcon}
            onBlur={(newIcon) => updateShortcodeParams(newIcon, valueName)}
            onEnter={(newIcon) => updateShortcodeParams(newIcon, valueName)}
          />
        </div>
      </div>}
    </div>
  </>);
};

const ChatbotParams = (props) => {
  const { themes, shortcodeParams, updateShortcodeParams, defaultChatbot, blockMode,
    deleteCurrentChatbot, resetCurrentChatbot, duplicateCurrentChatbot, options, ...rest } = props;
  const { completionModels, imageModels, realtimeModels, getModel } = useModels(options, shortcodeParams.envId || null);
  const isChat = shortcodeParams.mode === 'chat' && true;
  const isAssistant = shortcodeParams.mode === 'assistant' ?? false;
  const isImagesChat = shortcodeParams.mode === 'images' ?? false;
  const isRealtime = shortcodeParams.mode === 'realtime' ?? false;
  const isContentAware = shortcodeParams.contentAware ?? false;
  const aiEnvironments = useMemo(() => { return options?.ai_envs || []; }, [options.ai_envs]);
  const module_embeddings = options?.module_embeddings || false;
  const module_orchestration = options?.module_orchestration ?? false;
  const availableFunctions = options?.functions || [];
  const functions = shortcodeParams.functions || [];
  const [busyUpdatingFunctions, setBusyUpdatingFunctions] = useState(false);
  const availableMCPServers = options?.mcp_envs || [];
  const mcpServers = shortcodeParams.mcpServers || [];
  const previousEnvIdRef = useRef(shortcodeParams.envId);
  
  useEffect(() => {
    previousEnvIdRef.current = shortcodeParams.envId;
  }, [shortcodeParams.envId]);

  const instructionsHasContent = useMemo(() => {
    return shortcodeParams.instructions && shortcodeParams.instructions.includes('{CONTENT}');
  }, [shortcodeParams.instructions]);

  const aiEnvironment = useMemo(() => {
    const env = aiEnvironments.find(e => e.id == shortcodeParams.envId) || null;
    return env;
  }, [aiEnvironments, shortcodeParams.envId]);

  const allAssistants = useMemo(() => { return aiEnvironment?.assistants || []; }, [aiEnvironment]);
  const assistant = useMemo(() => {
    const assist = allAssistants.find(e => e.id == shortcodeParams.assistantId) || null;
    return assist;
  }, [allAssistants, shortcodeParams.assistantId]);

  const actualModelId = assistant 
    ? assistant.model 
    : (shortcodeParams.model || (!shortcodeParams.envId ? options?.ai_default_model : null));
  const currentModel = getModel(actualModelId);

  const environments = options.embeddings_envs || [];

  const modelSupportsFunctions = useMemo(() => {
    return currentModel?.tags?.includes('functions') ?? false;
  }, [currentModel]);

  const modelSupportsVision = useMemo(() => {
    return currentModel?.tags?.includes('vision') ?? false;
  }, [currentModel]);

  const modelSupportsFiles = useMemo(() => {
    return currentModel?.tags?.includes('files') ?? false;
  }, [currentModel]);

  const modelSupportImage = useMemo(() => {
    return currentModel?.tags?.includes('image') ?? false;
  }, [currentModel]);

  const modelSupportsMCP = useMemo(() => {
    const hasMCP = currentModel?.tags?.includes('mcp') ?? false;
    return hasMCP;
  }, [currentModel]);

  const modelSupportsTools = useMemo(() => {
    return (currentModel?.tools?.length ?? 0) > 0;
  }, [currentModel]);

  const modelSupportsResponses = useMemo(() => {
    return currentModel?.tags?.includes('responses') ?? false;
  }, [currentModel]);
  
  const directVectorStoreIntegration = useMemo(() => {
    if (!shortcodeParams.embeddingsEnvId || !currentModel) {
      return false;
    }
    
    const selectedEnv = environments.find(env => env.id == shortcodeParams.embeddingsEnvId);
    if (!selectedEnv || selectedEnv.type != 'openai-vector-store') {
      return false;
    }
    const embeddingsOpenAIEnvId = selectedEnv.openai_env_id;
    const modelEnvId = shortcodeParams.envId ?? options?.ai_default_env;
    
    const aiEnv = aiEnvironments.find(env => env.id == modelEnvId) ?? null;
    const isOpenAIEnvironment = !aiEnv || aiEnv.type == 'openai';
    const supportsResponsesAPI = modelSupportsResponses ?? false;
    const responsesAPIEnabled = options?.ai_responses_api !== false;
    return isOpenAIEnvironment && supportsResponsesAPI && responsesAPIEnabled && 
           embeddingsOpenAIEnvId == modelEnvId && selectedEnv.store_id;
  }, [shortcodeParams.embeddingsEnvId, shortcodeParams.envId, currentModel, environments, 
      modelSupportsResponses, aiEnvironments, options]);

  const modelsForDropdown = useMemo(() => {
    return isImagesChat ? imageModels : (isRealtime ? realtimeModels : completionModels) ?? [];
  }, [isImagesChat, isRealtime, completionModels, imageModels, realtimeModels]);

  useEffect(() => {
    const newFunctions = functions.filter(x => availableFunctions.some(y => y.id === x.id));
    const newMCPServers = mcpServers.filter(x => availableMCPServers.some(y => y.id === x.id));

    if (newFunctions.length != functions.length) {
      console.warn("Update Params: Functions has been updated.");
      updateShortcodeParams(newFunctions, 'functions');
    }
    else if (newMCPServers.length != mcpServers.length) {
      console.warn("Update Params: MCP Servers has been updated.");
      updateShortcodeParams(newMCPServers, 'mcpServers');
    }
    else if (modelSupportImage && !shortcodeParams.resolution) {
      console.warn("Update Params: Resolution has been set.");
      if (currentModel?.resolutions) {
        const resolutions = currentModel.resolutions.map(x => x.name);
        const bestResolution = resolutions.includes('1024x1024') ? '1024x1024' : resolutions[0];
        updateShortcodeParams(bestResolution, 'resolution');
      }
    }
    else if (!modelSupportImage && shortcodeParams.resolution) {
      console.warn("Update Params: Resolution has been removed.");
      updateShortcodeParams(null, 'resolution');
    }
    else if (modelSupportImage && isChat) {
      console.warn("Update Params: Model has been removed.");
      updateShortcodeParams(null, 'model');
    }
    else if (isAssistant && shortcodeParams.model) {
      console.warn("Update Params: Model has been removed.");
      updateShortcodeParams(null, 'model');
    }
    else if (!isAssistant && shortcodeParams.assistantId) {
      console.warn("Update Params: Assistant has been removed.");
      updateShortcodeParams(null, 'assistantId');
    }
    else if (shortcodeParams.imageUpload && !modelSupportsVision && !isImagesChat) {
      console.warn("Update Params: Vision has been removed.");
      updateShortcodeParams(null, 'imageUpload');
    }
    else if (shortcodeParams.fileSearch && !isAssistant) {
      console.warn("Update Params: File search has been removed.");
      updateShortcodeParams(null, 'fileSearch');
    }
    else if (shortcodeParams.model && !shortcodeParams.envId) {
      console.warn("Update Params: Model has been removed.");
      updateShortcodeParams("", 'model');
    }
    else if (shortcodeParams.envId && !aiEnvironment) {
      console.warn("Update Params: Environment has been removed.");
      updateShortcodeParams(null, 'envId');
    }
    else if (shortcodeParams.model && shortcodeParams.envId && !currentModel) {
      console.warn("Update Params: Model has been removed because it doesn't exist in the current environment.");
      updateShortcodeParams("", 'model');
    }
    else if (!shortcodeParams.model && shortcodeParams.envId && modelsForDropdown.length > 0 &&
      previousEnvIdRef.current != shortcodeParams.envId) {
      console.log("Update Params: Auto-selecting first available model for the environment.");
      updateShortcodeParams(modelsForDropdown[0].model, 'model');
    }
    else if (!module_embeddings && shortcodeParams.embeddingsEnvId) {
      console.warn("Update Params: Embeddings environment has been removed.");
      updateShortcodeParams(null, 'embeddingsEnvId');
    }
    else if (isAssistant && !!shortcodeParams.fileSearch && !assistant?.has_file_search) {
      console.warn("Update Params: File search has been removed.");
      updateShortcodeParams(null, 'fileSearch');
    }
    else if (!shortcodeParams.aiAvatar && !shortcodeParams.aiName) {
      console.warn("Update Params: AI avatar has been set to true.");
      updateShortcodeParams(true, 'aiAvatar');
    }
    else if (!shortcodeParams.userAvatar && !shortcodeParams.userName) {
      console.warn("Update Params: User avatar has been set to true.");
      updateShortcodeParams(true, 'userAvatar');
    }
    else if (!shortcodeParams.guestAvatar && !shortcodeParams.guestName) {
      console.warn("Update Params: Guest avatar has been set to true.");
      updateShortcodeParams(true, 'guestAvatar');
    }
  }, [shortcodeParams, mcpServers, availableMCPServers, currentModel, modelsForDropdown]);

  const updateFunctionsInAssistant = async () => {
    setBusyUpdatingFunctions(true);
    try {
      await setAssistantFunctions(shortcodeParams.envId, shortcodeParams.assistantId, functions);
      alert('Functions have been set on the assistant.');
    }
    catch (e) {
      alert(e.message);
    }
    setBusyUpdatingFunctions(false);
  };

  const availableResolutions = useMemo(() => {
    if (!modelSupportImage) return [];
    if (!currentModel) return [];
    if (!currentModel?.resolutions) {
      console.error("This image model does not have resolutions.", currentModel);
      return [];
    }
    return currentModel.resolutions;
  }, [currentModel, modelSupportImage]);

  const titleChatbotCategory = useMemo(() => {
    const type = isChat ? 'Chat' : isAssistant ? 'Assistant' : isImagesChat ? 'Images' : isRealtime ? 'Realtime' : null;
    const id = shortcodeParams?.botId || defaultChatbot?.id || 'default';

    const info = [type, id].filter(x => x).join(', ');

    return (
      <div>
        {i18n.COMMON.CHATBOT}
        <small style={{ opacity: 0.5 }}> {info}</small>
      </div>
    );
  }, [isChat, isAssistant, shortcodeParams?.botId, defaultChatbot?.id]);

  const titleAIModelCategory = useMemo(() => {
    const getDisplay = (envId, modelName) => {
      const env = aiEnvironments.find(x => x.id == envId);
      if (!env) return null;
      const model = getModel(modelName);
      return [env.name, model?.rawName].filter(x => x).join(', ');
    };

    if (shortcodeParams.envId) {
      const extras = getDisplay(shortcodeParams.envId, shortcodeParams.model);
      if (extras) {
        return (
          <div>
            {i18n.COMMON.AI_MODEL}
            <small style={{ opacity: 0.5 }}> {extras}</small>
          </div>
        );
      }
    } else {
      const extras = getDisplay(options?.ai_default_env, options?.ai_default_model);
      if (extras) {
        return (
          <div>
            {i18n.COMMON.AI_MODEL}
            <small style={{ opacity: 0.5 }}> {extras}</small>
          </div>
        );
      }
    }
    return i18n.COMMON.AI_MODEL;
  }, [
    shortcodeParams.envId,
    shortcodeParams.model,
    aiEnvironments,
    getModel,
    options?.ai_default_env,
    options?.ai_default_model
  ]);

  const titleContextCategory = useMemo(() => {
    if (shortcodeParams.embeddingsEnvId) {
      const env = environments.find(x => x.id == shortcodeParams.embeddingsEnvId);
      if (env) {
        const extras = [
          env.name,
          isContentAware ? 'Content Aware' : null
        ].filter(x => x).join(', ');

        return (
          <div>
            {i18n.COMMON.CONTEXT}
            <small style={{ opacity: 0.5 }}> {extras}</small>
          </div>
        );
      }
    }
    return i18n.COMMON.CONTEXT;
  }, [shortcodeParams.embeddingsEnvId, environments, isContentAware]);

  const titleFunctionsCategory = useMemo(() => {
    const baseTitle = i18n.COMMON.FUNCTIONS;
    const hasEnabledFunctions = functions.length > 0;
    const countString = hasEnabledFunctions ? `Enabled: ${functions.length}, Total: ${availableFunctions.length}` : '';
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{baseTitle}</span>
        {countString && <small style={{ opacity: 0.5 }}>{countString}</small>}
        {!modelSupportsFunctions && hasEnabledFunctions && (
          <small style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
            (Not Supported)
          </small>
        )}
      </div>
    );
  }, [functions, availableFunctions, modelSupportsFunctions]);

  const titleMCPServersCategory = useMemo(() => {
    const baseTitle = i18n.COMMON.MCP_SERVERS;
    const hasEnabledServers = mcpServers.length > 0;
    const countString = hasEnabledServers ? `Enabled: ${mcpServers.length}, Total: ${availableMCPServers.length}` : '';
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{baseTitle}</span>
        {countString && <small style={{ opacity: 0.5 }}>{countString}</small>}
        {!modelSupportsMCP && hasEnabledServers && (
          <small style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
            (Not Supported)
          </small>
        )}
      </div>
    );
  }, [mcpServers, availableMCPServers, modelSupportsMCP]);

  const titleToolsCategory = useMemo(() => {
    const tools = shortcodeParams.tools || [];
    const availableTools = currentModel?.tools || [];
    const baseTitle = i18n.COMMON.TOOLS || 'Tools';
    const hasEnabledTools = tools.length > 0;
    
    const supportedCount = tools.filter(tool => availableTools.includes(tool)).length;
    const unsupportedCount = tools.length - supportedCount;
    
    const countString = hasEnabledTools ? `Enabled: ${tools.length}` : '';

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{baseTitle}</span>
        {countString && <small style={{ opacity: 0.5 }}>{countString}</small>}
        {unsupportedCount > 0 && (
          <small style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
            (Not Supported: {unsupportedCount})
          </small>
        )}
      </div>
    );
  }, [shortcodeParams.tools, currentModel]);

  const titleThresholdsCategory = useMemo(() => {
    const contextMaxLength =
      shortcodeParams.contextMaxLength ?? options?.context_max_length;

    const info = [
      shortcodeParams.maxMessages ? `Messages: ${shortcodeParams.maxMessages}` : null,
      contextMaxLength ? `Context: ${contextMaxLength}` : null
    ]
      .filter(x => x)
      .join(', ');

    return (
      <div>
        {i18n.COMMON.THRESHOLDS}
        <small style={{ opacity: 0.5 }}> {info}</small>
      </div>
    );
  }, [
    shortcodeParams.contextMaxLength,
    shortcodeParams.maxMessages,
    options?.context_max_length
  ]);

  const titleAppearanceCategory = useMemo(() => {
    const theme = themes?.find(x => x.themeId == shortcodeParams.themeId);
    const themeName = theme?.name || shortcodeParams.themeId;

    const info = [
      themeName,
      shortcodeParams.window ? 'Popup' : null
    ].filter(x => x).join(', ');

    return (
      <div>
        {i18n.COMMON.APPEARANCE}
        <small style={{ opacity: 0.5 }}> {info}</small>
      </div>
    );
  }, [shortcodeParams.themeId, shortcodeParams.window, themes]);

  return (<>
    <NekoWrapper>
      <NekoColumn minimal {...rest}>

        <StyledBuilderForm>

          <NekoAccordions keepState="chatbotParams">
            <NekoAccordion title={titleChatbotCategory}>

              <div className="mwai-builder-row">
                <div className="mwai-builder-col">
                  <label>{i18n.COMMON.NAME}:</label>
                  <NekoInput name="name" data-form-type="other"
                    disabled={shortcodeParams.botId == 'default'}
                    value={shortcodeParams.name}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
                <div className="mwai-builder-col">
                  <div>
                    <label style={{ display: 'block' }}>{i18n.COMMON.ID}:</label>
                    <NekoInput name="botId" type="text" placeholder="Optional"
                      disabled={shortcodeParams.botId == 'default'}
                      value={shortcodeParams.botId}
                      onBlur={updateShortcodeParams}
                      onEnter={updateShortcodeParams}
                    />
                  </div>
                </div>
                <div className="mwai-builder-col">
                  <div>
                    <label style={{ display: 'block' }}>{i18n.COMMON.SCOPE}:</label>
                    <NekoInput name="scope" type="text" placeholder="Scope"
                      value={shortcodeParams.scope}
                      onBlur={updateShortcodeParams}
                      onEnter={updateShortcodeParams}
                    />
                  </div>
                </div>
                {!isRealtime && <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.LOCAL_MEMORY}:</label>
                  <NekoCheckbox name="localMemory" label="Yes"
                    checked={shortcodeParams.localMemory} value="1"
                    onChange={updateShortcodeParams}
                  />
                </div>}
              </div>

              <div className="mwai-builder-row">
                <div className="mwai-builder-col"
                  style={{ height: shortcodeParams.mode == 'chat' ? 76 : 'inherit' }}>
                  <label>{i18n.COMMON.MODE}:</label>
                  <NekoSelect scrolldown id="mode" name="mode"
                    value={shortcodeParams.mode}
                    onChange={updateShortcodeParams}>
                    <NekoOption value="chat" label="Chat" />
                    <NekoOption value="images" label="Images" />
                    <NekoOption value="assistant" label="Assistant" isPro={true} requirePro={!isRegistered} />
                    <NekoOption value="realtime" label="Realtime" isPro={true} requirePro={!isRegistered} />
                  </NekoSelect>
                </div>

                {(isChat || isAssistant || isRealtime) && <div className="mwai-builder-col" style={{ flex: 5 }}>
                  <label>{i18n.COMMON.INSTRUCTIONS}:</label>
                  <NekoTextArea name="instructions" rows={10} textAreaStyle={{ resize: 'none' }}
                    value={shortcodeParams.instructions}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>}

              </div>

            </NekoAccordion>

            <NekoAccordion title={titleAIModelCategory}>

              <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.ENVIRONMENT}:</label>
                  <NekoSelect scrolldown name="envId"
                    value={shortcodeParams.envId ?? ""} onChange={updateShortcodeParams}
                    description={(!shortcodeParams.envId || shortcodeParams.envId == "") ? 
                      (() => {
                        const defaultEnv = aiEnvironments.find(env => env.id == options?.ai_default_env);
                        return defaultEnv ? `→ ${defaultEnv.name}` : null;
                      })()
                      : null
                    }>
                    {aiEnvironments.map(x => <NekoOption key={x.id} value={x.id} label={x.name} />)}
                    <NekoOption value={""} label={"Default"}></NekoOption>
                  </NekoSelect>
                </div>

                {(isChat || isImagesChat || isRealtime) && <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.MODEL}:</label>
                  <NekoSelect scrolldown textFiltering={modelsForDropdown.length >= 16} name="model" disabled={!shortcodeParams.envId}
                    value={shortcodeParams.model || ""} onChange={updateShortcodeParams}
                    description={(!shortcodeParams.model || shortcodeParams.model == "") ? 
                      (!shortcodeParams.envId ? `→ ${options?.ai_default_model}` : null)
                      : null
                    }>
                    <NekoOption value={""} label={shortcodeParams.envId ? "None" : "Default"}></NekoOption>
                    {modelsForDropdown.map((x) => (
                      <NekoOption key={x.model} value={x.model} label={x.name}></NekoOption>
                    ))}
                  </NekoSelect>
                </div>}

                {isAssistant && <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.ASSISTANT}:</label>
                  <NekoSelect scrolldown name="assistantId"
                    value={shortcodeParams.assistantId} onChange={updateShortcodeParams}>
                    <NekoOption value={""} label={"None"}></NekoOption>
                    {allAssistants.map(x => <NekoOption key={x.id} value={x.id} label={x.name} />)}
                  </NekoSelect>
                </div>}

                {modelSupportImage && <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.RESOLUTION}:</label>
                  <NekoSelect scrolldown name="resolution"
                    value={shortcodeParams.resolution} onChange={updateShortcodeParams}>
                    {availableResolutions.map((x) => (
                      <NekoOption key={x.name} value={x.name} label={x.label}></NekoOption>
                    ))}
                  </NekoSelect>
                </div>}

                {(modelSupportsVision || isImagesChat) && <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{isImagesChat ? i18n.COMMON.IMAGE_UPLOAD || 'Image Upload' : i18n.COMMON.VISION}:</label>
                  <NekoCheckbox name="imageUpload" label={i18n.COMMON.ENABLE}
                    checked={shortcodeParams.imageUpload} value="1" onChange={updateShortcodeParams} />
                </div>}

                {modelSupportsFiles && <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.FILES}:</label>
                  <NekoCheckbox name="fileUpload" label={i18n.COMMON.ENABLE}
                    checked={shortcodeParams.fileUpload} value="1" onChange={updateShortcodeParams} />
                </div>}

              </div>

              {(isChat || isRealtime) && <div className="mwai-builder-row">

                {isRealtime && <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.VOICE}:</label>
                  <NekoSelect scrolldown name="voice"
                    value={shortcodeParams.voice} onChange={updateShortcodeParams}>
                    <NekoOption value={""} label={"Default"}></NekoOption>
                    {voices.map(x => <NekoOption key={x} value={x} label={x} />)}
                  </NekoSelect>
                </div>}

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.TEMPERATURE}:</label>
                  <NekoInput name="temperature" type="number"
                    step="0.1" min="0" max="1"
                    value={shortcodeParams.temperature}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.MAX_TOKENS}:</label>
                  <NekoInput name="maxTokens" type="number"
                    description={<TokensInfo
                      model={currentModel}
                      maxTokens={shortcodeParams.maxTokens}
                      onRecommendedClick={value => { updateShortcodeParams(value, 'maxTokens'); }}
                      style={{ fontSize: 11, lineHeight: '8px' }}
                    />}
                    value={shortcodeParams.maxTokens}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>

              </div>}

            </NekoAccordion>

            {isAssistant && <NekoAccordion title={i18n.COMMON.ASSISTANT}>
              <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.FILE_SEARCH}:</label>
                  <NekoSelect scrolldown name="fileSearch" disabled={!assistant?.has_file_search}
                    description={toHTML(assistant?.has_file_search ? i18n.SETTINGS.ASSISTANT_FILE_SEARCH : i18n.SETTINGS.ASSISTANT_NO_FILE_SEARCH)}
                    value={shortcodeParams.fileSearch} onChange={updateShortcodeParams}>
                    <NekoOption value={""} label={"None"}></NekoOption>
                    <NekoOption value={"discussion"} label={"For Discussion"}></NekoOption>
                  </NekoSelect>
                </div>
              </div>
            </NekoAccordion>}

            {(isChat || isAssistant) && <NekoAccordion title={titleContextCategory}>

              <div style={{ marginTop: 15, fontWeight: 'bold' }}>{i18n.COMMON.EMBEDDINGS}</div>

              <div className="mwai-builder-row">

                <div className="mwai-builder-col">
                  <label>{i18n.COMMON.EMBEDDINGS_ENV}:</label>
                  <NekoSelect scrolldown name="embeddingsEnvId"
                    requirePro={true} isPro={isRegistered}
                    disabled={!module_embeddings || !environments?.length}
                    value={shortcodeParams.embeddingsEnvId} onChange={updateShortcodeParams}>
                    {environments.map(x => <NekoOption key={x.id} value={x.id} label={x.name} />)}
                    <NekoOption value={""} label={"None"}></NekoOption>
                  </NekoSelect>
                </div>

              </div>
              
              {shortcodeParams.embeddingsEnvId && (() => {
                const selectedEnv = environments.find(env => env.id == shortcodeParams.embeddingsEnvId);
                if (selectedEnv?.type != 'openai-vector-store') {
                  return null;
                }
                if (directVectorStoreIntegration) {
                  return (
                    <NekoMessage variant="success" style={{ marginTop: 10, marginBottom: 10 }}>
                      Since the model and vector store use the same OpenAI environment, we'll use direct integration via Responses API for smart and fast context retrieval.
                    </NekoMessage>
                  );
                } else {
                  return (
                    <NekoMessage variant="warning" style={{ marginTop: 10, marginBottom: 10 }}>
                      The model and vector store environments don't match - it will work but queries will be processed like a regular vector server instead of using direct OpenAI integration.
                    </NekoMessage>
                  );
                }
              })()}

              <div style={{ marginTop: 15, fontWeight: 'bold' }}>{i18n.COMMON.OTHERS}</div>

              {isChat && <div className="mwai-builder-row">
                <div className="mwai-builder-col">
                  <label>{i18n.COMMON.CONTENT_AWARE}:</label>
                  <NekoCheckbox name="contentAware" label="Yes"
                    requirePro={true} isPro={isRegistered}
                    checked={shortcodeParams.contentAware} value="1" onChange={updateShortcodeParams} />
                </div>
              </div>}

              {isContentAware && !instructionsHasContent &&
                <NekoMessage variant="danger" style={{ marginTop: 15, padding: '10px 15px' }}>
                  <p>{toHTML(i18n.SETTINGS.ALERT_CONTENTAWARE_BUT_NO_CONTENT)}</p>
                </NekoMessage>
              }

            </NekoAccordion>}

            {(modelSupportsFunctions || functions.length > 0) && availableFunctions.length > 0 && <NekoAccordion title={titleFunctionsCategory}>

              <p>
                <OpenAiIcon style={{ marginRight: 3 }} />
                <AnthropicIcon style={{ marginRight: 3 }} />
                <GoogleIcon style={{ marginRight: 5 }} />
                {toHTML(i18n.HELP.FUNCTIONS)}
              </p>

              {!availableFunctions?.length && <NekoMessage variant="danger">
                {toHTML(i18n.HELP.FUNCTIONS_UNAVAILABLE)}
              </NekoMessage>}

              {!!availableFunctions?.length && <div style={{
                maxHeight: 200, overflowY: 'auto',
                border: '1px solid #d1e3f2', marginTop: 10, padding: '5px 6px', borderRadius: 5
              }}>
                {availableFunctions?.map((func) => (
                  <NekoCheckbox key={func.id} name="functions"
                    label={<>
                      {func.target == 'js' && <JsIcon style={{ marginRight: 5 }} />}
                      {func.target != 'js' && <PhpIcon style={{ marginRight: 5 }} />}
                      <span>{func.name}</span>
                    </>}
                    description={func.desc}
                    checked={functions.some(x => x.id == func.id)} value={func.id}
                    onChange={value => {
                      const newFunctions = functions.filter(x => x.id != func.id);
                      if (value) newFunctions.push({ type: func.type, id: func.id });
                      updateShortcodeParams(newFunctions, 'functions');
                    }
                    }
                  />
                ))}
              </div>}
              
              {functions.length > 1 && directVectorStoreIntegration && modelSupportsResponses && (
                <NekoMessage variant="warning" style={{ marginTop: 10 }}>
                  When using Responses API with an OpenAI Vector Store connected as Context, calling multiple functions in one query (e.g., "What's X and Y?") may fail with "No tool output found" error. To avoid this, disable Responses API in Settings.
                </NekoMessage>
              )}

              {isAssistant && <>
                <p>
                  Assistant needs to be updated with the set of functions every time you modify them (including their names, arguments, descriptions, etc).
                </p>
                <NekoButton className="primary" fullWidth
                  onClick={updateFunctionsInAssistant} isBusy={busyUpdatingFunctions}>
                  Set Functions on Assistant
                </NekoButton>
              </>}

            </NekoAccordion>}

            {(modelSupportsMCP || mcpServers.length > 0) && module_orchestration && availableMCPServers.length > 0 && <NekoAccordion title={titleMCPServersCategory}>

              <p>
                <AnthropicIcon style={{ marginRight: 5 }} />
                {toHTML(i18n.HELP.MCP_SERVERS || 'MCP (Model Context Protocol) servers enable AI models to interact with external tools and systems.')}
              </p>

              {!availableMCPServers?.length && <NekoMessage variant="danger">
                {toHTML(i18n.HELP.MCP_SERVERS_UNAVAILABLE || 'No MCP servers are available. Configure them in the MCP Servers section under Orchestration.')}
              </NekoMessage>}

              {!!availableMCPServers?.length && <div style={{
                maxHeight: 200, overflowY: 'auto',
                border: '1px solid #d1e3f2', marginTop: 10, padding: '5px 6px', borderRadius: 5
              }}>
                {availableMCPServers?.map((server) => (
                  <NekoCheckbox key={server.id} name="mcpServers"
                    label={<>
                      <AnthropicIcon style={{ marginRight: 5 }} />
                      <span>{server.name}</span>
                    </>}
                    description={server.url || 'MCP Server'}
                    checked={mcpServers.some(x => x.id == server.id)} value={server.id}
                    onChange={value => {
                      const newMCPServers = mcpServers.filter(x => x.id != server.id);
                      if (value) newMCPServers.push({ id: server.id });
                      updateShortcodeParams(newMCPServers, 'mcpServers');
                    }
                    }
                  />
                ))}
              </div>}

            </NekoAccordion>}

            {(modelSupportsTools || (shortcodeParams.tools?.length > 0)) && (currentModel?.tools?.length > 0 || shortcodeParams.tools?.length > 0) && <NekoAccordion title={titleToolsCategory}>

              <p>
                <OpenAiIcon style={{ marginRight: 3 }} />
                <GoogleIcon style={{ marginRight: 5 }} />
                {toHTML(i18n.HELP.TOOLS || 'Enable AI tools like web search and image generation to enhance your chatbot capabilities.')}
              </p>


              <div style={{ marginTop: 10 }}>
                {(currentModel?.tools?.includes('web_search') || shortcodeParams.tools?.includes('web_search')) && (
                  <NekoCheckbox
                    name="tools_web_search"
                    label={i18n.COMMON.WEB_SEARCH || 'Web Search'}
                    description={i18n.HELP.WEB_SEARCH || 'Allow the AI to search the web for current information'}
                    checked={shortcodeParams.tools?.includes('web_search')}
                    value="web_search"
                    variant={!currentModel?.tools?.includes('web_search') && shortcodeParams.tools?.includes('web_search') ? 'danger' : undefined}
                    onChange={value => {
                      const tools = shortcodeParams.tools || [];
                      const newTools = value
                        ? [...tools.filter(t => t != 'web_search'), 'web_search']
                        : tools.filter(t => t != 'web_search');
                      updateShortcodeParams(newTools, 'tools');
                    }}
                  />
                )}
                {(currentModel?.tools?.includes('image_generation') || shortcodeParams.tools?.includes('image_generation')) && (
                  <NekoCheckbox
                    name="tools_image_generation"
                    label={i18n.COMMON.IMAGE_GENERATION || 'Image Generation'}
                    description={i18n.HELP.IMAGE_GENERATION || 'Allow the AI to generate images based on text descriptions'}
                    checked={shortcodeParams.tools?.includes('image_generation')}
                    value="image_generation"
                    variant={!currentModel?.tools?.includes('image_generation') && shortcodeParams.tools?.includes('image_generation') ? 'danger' : undefined}
                    onChange={value => {
                      const tools = shortcodeParams.tools || [];
                      const newTools = value
                        ? [...tools.filter(t => t != 'image_generation'), 'image_generation']
                        : tools.filter(t => t != 'image_generation');
                      updateShortcodeParams(newTools, 'tools');
                    }}
                  />
                )}
                {(currentModel?.tools?.includes('thinking') || shortcodeParams.tools?.includes('thinking')) && (
                  <NekoCheckbox
                    name="tools_thinking"
                    label={i18n.COMMON.THINKING || 'Thinking'}
                    description={i18n.HELP.THINKING || 'Enable enhanced reasoning mode for complex tasks requiring step-by-step analysis and planning'}
                    checked={shortcodeParams.tools?.includes('thinking')}
                    value="thinking"
                    variant={!currentModel?.tools?.includes('thinking') && shortcodeParams.tools?.includes('thinking') ? 'danger' : undefined}
                    onChange={value => {
                      const tools = shortcodeParams.tools || [];
                      const newTools = value
                        ? [...tools.filter(t => t != 'thinking'), 'thinking']
                        : tools.filter(t => t != 'thinking');
                      updateShortcodeParams(newTools, 'tools');
                    }}
                  />
                )}
              </div>

            </NekoAccordion>}

            <NekoAccordion title={titleThresholdsCategory}>

              <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.INPUT_MAX_LENGTH}:</label>
                  <NekoInput name="textInputMaxLength" type="number"
                    description={i18n.HELP.INPUT_MAX_LENGTH}
                    step="1" min="8"
                    value={shortcodeParams.textInputMaxLength}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
                {!isRealtime && <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.MAX_MESSAGES}:</label>
                  <NekoInput name="maxMessages" type="number"
                    description={i18n.HELP.MAX_MESSAGES}
                    step="1" min="1" max="1024"
                    value={shortcodeParams.maxMessages}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>}
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.CONTEXT_MAX_LENGTH}:</label>
                  <NekoInput name="contextMaxLength" type="number" step="1"
                    description={i18n.HELP.CONTEXT_MAX_LENGTH}
                    value={shortcodeParams.contextMaxLength ?? options?.context_max_length}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
              </div>

            </NekoAccordion>

            <NekoAccordion title={titleAppearanceCategory}>

              <div className="mwai-builder-row">

                <div className="mwai-builder-col" style={{ flex: 3 }}>
                  <label>{i18n.COMMON.THEME}:</label>
                  <NekoSelect scrolldown name="themeId"
                    value={shortcodeParams.themeId} description="" onChange={updateShortcodeParams}>
                    <NekoOption value='none' label="None" />
                    <NekoOption value='chatgpt' label="ChatGPT" />
                    <NekoOption value='timeless' label="Timeless" />
                    <NekoOption value='messages' label="Messages" />
                    {themes?.filter(x => x.type == 'css').map((theme) => (
                      <NekoOption key={theme.themeId} value={theme.themeId} label={theme.name} />
                    ))}
                  </NekoSelect>
                </div>

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.POPUP}:</label>
                  <NekoCheckbox name="window" label="Yes"
                    checked={shortcodeParams.window} value="1" onChange={updateShortcodeParams} />
                </div>

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.FULL_SCREEN}:</label>
                  <NekoCheckbox name="fullscreen" label="Yes"
                    checked={shortcodeParams.fullscreen} value="1" onChange={updateShortcodeParams}
                    disabled={shortcodeParams.window} />
                </div>

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.COPY_BUTTON}:</label>
                  <NekoCheckbox name="copyButton" label="Yes"
                    checked={shortcodeParams.copyButton} value="1" onChange={updateShortcodeParams} />
                </div>

              </div>

              {shortcodeParams.themeId == 'timeless' && <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.HEADER_SUBTITLE}:</label>
                  <NekoInput name="headerSubtitle" data-form-type="other"
                    value={shortcodeParams.headerSubtitle}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
              </div>}

              <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.AVATAR}:</label>
                  <NekoCheckbox name="aiAvatar" label="Yes"
                    checked={shortcodeParams.aiAvatar} value="1" onChange={updateShortcodeParams}
                    disabled={!shortcodeParams.aiName} />
                </div>
                <div className="mwai-builder-col" style={{ flex: 3 }}>
                  <label>{i18n.COMMON.AI_NAME}:</label>
                  <NekoInput name="aiName" data-form-type="other"
                    value={shortcodeParams.aiName}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
                <div className="mwai-builder-col" style={{ flex: 7 }}>
                  <label>{i18n.COMMON.START_SENTENCE}:</label>
                  <NekoTextArea name="startSentence" rows={1}
                    value={shortcodeParams.startSentence}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
              </div>

              {shortcodeParams.aiAvatar &&
                <ChatIconSelector label={i18n.COMMON.AI_AVATAR} updateShortcodeParams={updateShortcodeParams}
                  valueName="aiAvatarUrl" icon={shortcodeParams.aiAvatarUrl}
                />
              }

              <div className="mwai-builder-row">

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.AVATAR}:</label>
                  <NekoCheckbox name="userAvatar" label="Yes"
                    checked={shortcodeParams.userAvatar} value="1" onChange={updateShortcodeParams}
                    disabled={!shortcodeParams.userName} />
                </div>

                <div className="mwai-builder-col" style={{ flex: 3 }}>
                  <label>{i18n.COMMON.USER_NAME}:</label>
                  <NekoInput name="userName" data-form-type="other"
                    value={shortcodeParams.userName}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
                <div className="mwai-builder-col" style={{ flex: 3 }}>
                  <label>{i18n.COMMON.PLACEHOLDER}:</label>
                  <NekoInput name="textInputPlaceholder"
                    value={shortcodeParams.textInputPlaceholder}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.SEND}:</label>
                  <NekoInput name="textSend" value={shortcodeParams.textSend}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.CLEAR}:</label>
                  <NekoInput name="textClear" value={shortcodeParams.textClear}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
              </div>

              {shortcodeParams.userAvatar && <p>
                <i>The <a href="https://gravatar.com/" target="_blank" rel="noreferrer">gravatar</a> of this user will be used as the avatar.</i>
              </p>}

              <div className="mwai-builder-row">

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.AVATAR}:</label>
                  <NekoCheckbox name="guestAvatar" label="Yes"
                    checked={shortcodeParams.guestAvatar} value="1" onChange={updateShortcodeParams}
                    disabled={!shortcodeParams.guestName} />
                </div>

                <div className="mwai-builder-col" style={{ flex: 3 }}>
                  <label>{i18n.COMMON.GUEST_NAME}:</label>
                  <NekoInput name="guestName" value={shortcodeParams.guestName}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>

                <div className="mwai-builder-col" style={{ flex: 7 }}>
                  <label>{i18n.COMMON.COMPLIANCE_TEXT}:</label>
                  <NekoInput name="textCompliance"
                    value={shortcodeParams.textCompliance}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>

              </div>

              {shortcodeParams.guestAvatar &&
                <ChatIconSelector label={i18n.COMMON.GUEST_AVATAR} updateShortcodeParams={updateShortcodeParams}
                  valueName="guestAvatarUrl" icon={shortcodeParams.guestAvatarUrl}
                />
              }

            </NekoAccordion>

            <NekoAccordion title={i18n.COMMON.POPUP} hide={!shortcodeParams.window}>

              <div className="mwai-builder-row">

                <div className="mwai-builder-col" style={{ flex: 4 }}>
                  <label>{i18n.COMMON.POSITION}:</label>
                  <NekoSelect scrolldown name="iconPosition"
                    value={shortcodeParams.iconPosition} onChange={updateShortcodeParams}>
                    <NekoOption value="bottom-right" label="Bottom Right" />
                    <NekoOption value="bottom-left" label="Bottom Left" />
                    <NekoOption value="top-right" label="Top Right" />
                    <NekoOption value="top-left" label="Top Left" />
                  </NekoSelect>
                </div>

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.BUBBLE}:</label>
                  <NekoCheckbox name="iconBubble" label="Yes"
                    checked={shortcodeParams.iconBubble} value="1"
                    onChange={updateShortcodeParams}
                  />
                </div>

              </div>

              <ChatIconSelector label={i18n.COMMON.ICON} updateShortcodeParams={updateShortcodeParams}
                valueName="icon" icon={shortcodeParams.icon}
              />

              <div className="mwai-builder-row">

                <div className="mwai-builder-col" style={{ flex: 4 }}>
                  <label>{i18n.COMMON.ICON_TEXT}:</label>
                  <NekoInput name="iconText"
                    description={i18n.HELP.ICON_TEXT}
                    value={shortcodeParams.iconText}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>

                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.ICON_TEXT_DELAY}:</label>
                  <NekoInput name="iconTextDelay" type="number"
                    description={i18n.HELP.ICON_TEXT_DELAY ?? 1}
                    value={shortcodeParams.iconTextDelay}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>

              </div>

            </NekoAccordion>

            {(modelSupportsResponses && !isAssistant && !isImagesChat) && <NekoAccordion title={i18n.COMMON.ADVANCED || "Advanced"}>
              <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.HISTORY_STRATEGY}:</label>
                  <NekoSelect scrolldown name="historyStrategy"
                    description={i18n.HELP.HISTORY_STRATEGY}
                    value={shortcodeParams.historyStrategy || ""} onChange={updateShortcodeParams}>
                    <NekoOption value={""} label={i18n.COMMON.AUTOMATIC || "Automatic"}></NekoOption>
                    <NekoOption value={"internal"} label={i18n.COMMON.FULL_HISTORY || "Full History"}></NekoOption>
                    <NekoOption value={"response_id"} label={i18n.COMMON.INCREMENTAL || "Incremental"}></NekoOption>
                  </NekoSelect>
                </div>
              </div>
            </NekoAccordion>}

            {!blockMode && <NekoAccordion title={i18n.COMMON.SHORTCODES}>
              <Shortcode currentChatbot={shortcodeParams} style={{ marginTop: 10 }} />
              {shortcodeParams.botId != 'default' && <>
                <p>{i18n.HELP.CUSTOM_SHORTCODE}</p>
                <Shortcode currentChatbot={shortcodeParams} isCustom={true}
                  defaultChatbot={defaultChatbot} style={{ marginTop: 10 }}
                />
              </>}
            </NekoAccordion>}

            {!blockMode && <NekoAccordion title={i18n.COMMON.ACTIONS}>
              <div style={{ display: 'flex', marginTop: 10 }}>
                <NekoButton className="primary" onClick={duplicateCurrentChatbot}>
                  {i18n.COMMON.DUPLICATE}
                </NekoButton>
                <NekoButton className="secondary" onClick={resetCurrentChatbot}>
                  {i18n.COMMON.RESET}
                </NekoButton>
                <div style={{ flex: 'auto' }} />
                <NekoButton className="danger" disabled={shortcodeParams.name == 'Default'}
                  onClick={deleteCurrentChatbot}>
                  {i18n.COMMON.DELETE}
                </NekoButton>
              </div>
            </NekoAccordion>}

          </NekoAccordions>

        </StyledBuilderForm>

      </NekoColumn>
    </NekoWrapper>
  </>);
};

export default ChatbotParams;