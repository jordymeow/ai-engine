// Previous: 2.3.1
// Current: 2.3.2

const { useMemo, useState, useEffect } = wp.element;

import {
  NekoInput, NekoSelect, NekoOption, NekoCheckbox, NekoWrapper, NekoMessage, NekoTypo,
  NekoColumn, NekoTextArea, NekoButton, NekoCollapsableCategory, NekoCollapsableCategories
} from '@neko-ui';

import { isRegistered } from '@app/settings';

import i18n from '@root/i18n';
import { pluginUrl } from "@app/settings";
import { toHTML, useModels } from '@app/helpers-admin';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";
import TokensInfo from '@app/components/TokensInfo';
import Shortcode from './Shortcode';
import { setAssistantFunctions } from '@app/requests';

const chatIcons = ['chat-openai.svg', 'chat-robot-1.svg', 'chat-robot-2.svg', 'chat-robot-3.svg', 'chat-robot-4.svg', 'chat-robot-5.svg', 'chat-robot-6.svg', 'chat-color-blue.svg', 'chat-color-green.svg', 'chat-color-red.svg', 'chat-traditional-1.svg', 'chat-traditional-2.svg', 'chat-traditional-3.svg'];

const ChatbotParams = (props) => {
  const { themes, shortcodeParams, updateShortcodeParams, defaultChatbot,
    deleteCurrentChatbot, resetCurrentChatbot, duplicateCurrentChatbot, options } = props;
  const { completionModels, imageModels, getModel } = useModels(options, shortcodeParams.envId || null);
  const isChat = shortcodeParams.mode === 'chat' ?? 'chat';
  const isAssistant = shortcodeParams.mode === 'assistant' ?? false;
  const isImagesChat = shortcodeParams.mode === 'images' ?? false;
  const isContentAware = shortcodeParams.contentAware;
  const chatIcon = shortcodeParams.icon ? shortcodeParams.icon : 'chat-color-green.svg';
  const isCustomURL = chatIcon?.startsWith('https://') || chatIcon?.startsWith('http://');
  const previewIcon = isCustomURL ? chatIcon : `${pluginUrl}/images/${chatIcon}`;
  const aiEnvironments = options?.ai_envs || [];
  const module_embeddings = options?.module_embeddings;
  const availableFunctions = options?.functions || [];
  const functions = shortcodeParams.functions || [];
  const [ busyUpdatingFunctions, setBusyUpdatingFunctions ] = useState(false);

  const instructionsHasContent = useMemo(() => {
    return shortcodeParams.instructions && shortcodeParams.instructions.includes('{CONTENT}');
  }, [shortcodeParams.instructions]);

  const aiEnvironment = useMemo(() => {
    const env = aiEnvironments.find(e => e.id === shortcodeParams.envId);
    return env || null;
  }, [aiEnvironments, shortcodeParams.envId]);

  const allAssistants = aiEnvironment?.assistants || [];
  const assistant = useMemo(() => {
    const assist = allAssistants.find(e => e.id === shortcodeParams.assistantId);
    return assist || null;
  }, [allAssistants, shortcodeParams.assistantId]);

  const currentModel = getModel(assistant ? assistant.model : shortcodeParams.model);

  const environments = options.embeddings_envs || [];

  const modelSupportsFunctions = useMemo(() => {
    return currentModel?.tags?.includes('functions');
  }, [currentModel]);

  const modelSupportsVision= useMemo(() => {
    return currentModel?.tags?.includes('vision');
  }, [currentModel]);

  const modelSupportImage = useMemo(() => {
    return currentModel?.tags?.includes('image');
  }, [currentModel]);

  useEffect(() => {
    if (modelSupportImage && !shortcodeParams.resolution) {
      const resolutions = currentModel.options.map(x => x.option);
      const bestResolution = resolutions.includes('1024x1024') ? '1024x1024' : resolutions[0];
      updateShortcodeParams(bestResolution, 'resolution');
    } else if (!modelSupportImage && shortcodeParams.resolution) {
      updateShortcodeParams(null, 'resolution');
    } else if (modelSupportImage && isChat) {
      updateShortcodeParams(null, 'model');
    } else if (isAssistant && shortcodeParams.model) {
      updateShortcodeParams(null, 'model');
    } else if (!isAssistant && shortcodeParams.assistantId) {
      updateShortcodeParams(null, 'assistantId');
    } else if (shortcodeParams.imageUpload && !modelSupportsVision) {
      updateShortcodeParams(null, 'imageUpload');
    } else if (shortcodeParams.fileSearch && !isAssistant) {
      updateShortcodeParams(null, 'fileSearch');
    } else if (shortcodeParams.model && !shortcodeParams.envId) {
      updateShortcodeParams(null, 'model');
    } else if (shortcodeParams.envId && !aiEnvironment) {
      updateShortcodeParams(null, 'envId');
    } else if (!module_embeddings && shortcodeParams.embeddingsEnvId) {
      updateShortcodeParams(null, 'embeddingsEnvId');
    } else if (!modelSupportsFunctions && functions.length) {
      updateShortcodeParams([], 'functions');
    } else if (isAssistant && shortcodeParams.fileSearch !== null && !assistant?.has_file_search) {
      updateShortcodeParams(null, 'fileSearch');
    }
  }, [shortcodeParams]);

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
  }

  return (<>
    <NekoWrapper>
      <NekoColumn minimal>
        <StyledBuilderForm>
          <NekoCollapsableCategories keepState="chatbotParams">
            <NekoCollapsableCategory title={i18n.COMMON.CHATBOT}>
              <div className="mwai-builder-row">
                <div className="mwai-builder-col">
                  <label>{i18n.COMMON.NAME}:</label>
                  <NekoInput name="name" data-form-type="other"
                    disabled={shortcodeParams.botId === 'default'}
                    value={shortcodeParams.name}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
                <div className="mwai-builder-col">
                  <div>
                    <label style={{ display: 'block' }}>{i18n.COMMON.ID}:</label>
                    <NekoInput name="botId" type="text" placeholder="Optional"
                      disabled={shortcodeParams.botId === 'default'}
                      value={shortcodeParams.botId}
                      onBlur={updateShortcodeParams}
                      onEnter={updateShortcodeParams}
                    />
                  </div>
                </div>
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.LOCAL_MEMORY}:</label>
                  <NekoCheckbox name="localMemory" label="Yes"
                    checked={shortcodeParams.localMemory} value="1"
                    onChange={updateShortcodeParams}
                  />
                </div>
              </div>
              <div className="mwai-builder-row">
                <div className="mwai-builder-col"
                  style={{ height: shortcodeParams.mode === 'chat' ? 76 : 'inherit' }}>
                  <label>{i18n.COMMON.MODE}:</label>
                  <NekoSelect scrolldown id="mode" name="mode"
                    value={shortcodeParams.mode}
                    onChange={updateShortcodeParams}>
                    <NekoOption value="chat" label="Chat" />
                    <NekoOption value="assistant" label="Assistant" isPro={true} requirePro={!isRegistered} />
                    <NekoOption value="images" label="Images" />
                  </NekoSelect>
                </div>
                {(isChat || isAssistant) && <div className="mwai-builder-col" style={{ flex: 5 }}>
                  <label>{i18n.COMMON.INSTRUCTIONS}:</label>
                  <NekoTextArea name="instructions" rows={10} textAreaStyle={{ resize: 'none' }}
                    value={shortcodeParams.instructions}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>}
              </div>
            </NekoCollapsableCategory>
            <NekoCollapsableCategory title={i18n.COMMON.POPUP_SETTINGS} hide={!shortcodeParams.window}>
              <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.POSITION}:</label>
                  <NekoSelect scrolldown name="iconPosition" disabled={!shortcodeParams.window}
                    value={shortcodeParams.iconPosition} onChange={updateShortcodeParams}>
                    <NekoOption value="bottom-right" label="Bottom Right" />
                    <NekoOption value="bottom-left" label="Bottom Left" />
                    <NekoOption value="top-right" label="Top Right" />
                    <NekoOption value="top-left" label="Top Left" />
                  </NekoSelect>
                </div>
                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.ICON_TEXT}:</label>
                  <NekoInput name="iconText" disabled={!shortcodeParams.window}
                    placeholder="If set, appears next to icon"
                    value={shortcodeParams.iconText}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
              </div>
            </NekoCollapsableCategory>
            <NekoCollapsableCategory title={i18n.COMMON.AI_MODEL}>
              <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.ENVIRONMENT}:</label>
                  <NekoSelect scrolldown name="envId"
                    value={shortcodeParams.envId ?? ""} onChange={updateShortcodeParams}>
                    {aiEnvironments.map(x => <NekoOption key={x.id} value={x.id} label={x.name} />)}
                    <NekoOption value={""} label={"Default"}></NekoOption>
                  </NekoSelect>
                </div>
                {(isChat || isImagesChat) && <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.MODEL}:</label>
                  <NekoSelect scrolldown name="model"
                    value={shortcodeParams.model} onChange={updateShortcodeParams}>
                    <NekoOption value={""} label={"Default"}></NekoOption>
                    {((isImagesChat ? imageModels : completionModels) ?? []).map((x) => (
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
                    {currentModel.options.map((x) => (
                      <NekoOption key={x.option} value={x.option} label={x.option}></NekoOption>
                    ))}
                  </NekoSelect>
                </div>}
                {modelSupportsVision && <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.VISION}:</label>
                  <NekoCheckbox name="imageUpload" label={i18n.COMMON.ENABLE}
                    checked={shortcodeParams.imageUpload} value="1" onChange={updateShortcodeParams} />
                </div>}
              </div>
              {isChat && <div className="mwai-builder-row">
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
                      onRecommendedClick={value => { updateShortcodeParams(value, 'maxTokens') }}
                      style={{ fontSize: 11, lineHeight: '8px' }}
                    />}
                    value={shortcodeParams.maxTokens}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
              </div>}
            </NekoCollapsableCategory>
            {isAssistant && <NekoCollapsableCategory title={i18n.COMMON.ASSISTANT}>
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
            </NekoCollapsableCategory>}
            {(isChat || isAssistant) && <NekoCollapsableCategory title={i18n.COMMON.CONTEXT}>
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
            </NekoCollapsableCategory>}
            {modelSupportsFunctions && <NekoCollapsableCategory
              title={i18n.COMMON.FUNCTIONS}>
              <p>{toHTML(i18n.HELP.FUNCTIONS)}</p>
              {!availableFunctions?.length && <NekoMessage variant="danger">
                {toHTML(i18n.HELP.FUNCTIONS_UNAVAILABLE)}
              </NekoMessage>}
              {!!availableFunctions?.length && <div style={{ maxHeight: 200, overflowY: 'auto',
                border: '1px solid #d1e3f2', marginTop: 10, padding: '5px 6px', borderRadius: 5 }}>
                {availableFunctions?.map((func) => (
                  <NekoCheckbox key={func.snippetId} name="functions" label={func.name}
                    description={func.desc}
                    checked={functions.some(x => x.id === func.snippetId)} value={func.snippetId}
                    onChange={value => {
                      const newFunctions = functions.filter(x => x.id !== func.snippetId);
                      if (value) newFunctions.push({ type: 'snippet-vault', id: func.snippetId });
                      updateShortcodeParams(newFunctions, 'functions');
                    }
                  } />
                ))}
              </div>}
              {isAssistant && <>
                <p>
                  Assistant needs to be updated with the set of functions every time you modify them (including their names, arguments, descriptions, etc).
                </p>
                <NekoButton className="primary" fullWidth
                  onClick={updateFunctionsInAssistant} isBusy={busyUpdatingFunctions}>
                  Set Functions on Assistant
                </NekoButton>
              </>}
            </NekoCollapsableCategory>}
            <NekoCollapsableCategory title={i18n.COMMON.THRESHOLDS}>
              <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.INPUT_MAX_LENGTH}:</label>
                  <NekoInput name="textInputMaxLength" type="number"
                    description={i18n.HELP.INPUT_MAX_LENGTH}
                    step="1" min="8" max="4096"
                    value={shortcodeParams.textInputMaxLength}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.MAX_MESSAGES}:</label>
                  <NekoInput name="maxMessages" type="number"
                    description={i18n.HELP.MAX_MESSAGES}
                    step="1" min="1" max="512"
                    value={shortcodeParams.maxMessages}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.CONTEXT_MAX_LENGTH}:</label>
                  <NekoInput name="contextMaxLength" type="number" step="1"
                    description={i18n.HELP.CONTEXT_MAX_LENGTH}
                    value={shortcodeParams.contextMaxLength || options?.context_max_length}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
              </div>
            </NekoCollapsableCategory>
            <NekoCollapsableCategory title={i18n.COMMON.APPEARANCE}>
              <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.THEME}:</label>
                  <NekoSelect scrolldown name="themeId"
                    value={shortcodeParams.themeId} description="" onChange={updateShortcodeParams}>
                    <NekoOption value='none' label="None" />
                    <NekoOption value='chatgpt' label="ChatGPT" />
                    <NekoOption value='messages' label="Messages (iOS)" />
                    {themes?.filter(x => x.type === 'css').map((theme) => (
                      <NekoOption key={theme.themeId} value={theme.themeId} label={theme.name} />
                    ))}
                  </NekoSelect>
                </div>
              </div>
              <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.AI_NAME}:</label>
                  <NekoInput name="aiName" data-form-type="other"
                    value={shortcodeParams.aiName}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
                <div className="mwai-builder-col" style={{ flex: 3 }}>
                  <label>{i18n.COMMON.START_SENTENCE}:</label>
                  <NekoTextArea name="startSentence" rows={1}
                    value={shortcodeParams.startSentence}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
              </div>
              <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 2 }}>
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
                <div className="mwai-builder-col" style={{ flex: 1.5 }}>
                  <label>{i18n.COMMON.SEND}:</label>
                  <NekoInput name="textSend" value={shortcodeParams.textSend}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
                <div className="mwai-builder-col" style={{ flex: 1.5 }}>
                  <label>{i18n.COMMON.CLEAR}:</label>
                  <NekoInput name="textClear" value={shortcodeParams.textClear}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
              </div>
              <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.COPY_BUTTON}:</label>
                  <NekoCheckbox name="copyButton" label="Yes"
                    checked={shortcodeParams.copyButton} value="1" onChange={updateShortcodeParams} />
                </div>
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.POPUP}:</label>
                  <NekoCheckbox name="window" label="Yes"
                    checked={shortcodeParams.window} value="1" onChange={updateShortcodeParams} />
                </div>
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.FULL_SCREEN}:</label>
                  <NekoCheckbox name="fullscreen" label="Yes"
                    checked={shortcodeParams.fullscreen} value="1" onChange={updateShortcodeParams} />
                </div>
                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.COMPLIANCE_TEXT}:</label>
                  <NekoInput name="textCompliance"
                    value={shortcodeParams.textCompliance}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
              </div>
              {(shortcodeParams.window || !shortcodeParams.aiName) && <>
                <div style={{
                  marginTop: 10, border: '2px solid #d2e4f3', borderRadius: 8,
                  padding: '10px 10px 10px 10px', background: '#f5fcff'
                }}>
                  <div className="mwai-builder-row" style={{ marginTop: 0 }}>
                    <div className="mwai-builder-col" style={{ flex: 2 }}>
                      <label>{i18n.COMMON.AI_AVATAR}:</label>
                      <div style={{ display: 'flex' }}>
                        {chatIcons.map(x =>
                          <img key={x} style={{ marginRight: 2, cursor: 'pointer' }} width={24} height={24}
                            src={`${pluginUrl}/images/${x}`} onClick={() => {
                              updateShortcodeParams(x, 'icon');
                            }} />
                        )}
                        <NekoButton small className="primary" style={{ marginLeft: 5 }}
                          onClick={() => { updateShortcodeParams(`${pluginUrl}/images/chat-color-green.svg`, 'icon') }}>
                          {i18n.SETTINGS.CUSTOM_URL}
                        </NekoButton>
                      </div>
                    </div>
                    <div className="mwai-builder-col" style={{ width: 48, display: 'flex', alignItems: 'end' }}>
                      <img style={{ marginRight: 0, paddingTop: 0 }} width={48} height={48} src={`${previewIcon}`} />
                    </div>
                  </div>
                  {isCustomURL && <div className="mwai-builder-row">
                    <div className="mwai-builder-col">
                      <label>{i18n.COMMON.CUSTOM_ICON_URL}:</label>
                      <NekoInput name="icon" value={chatIcon}
                        onBlur={updateShortcodeParams} onEnter={updateShortcodeParams}
                      />
                    </div>
                  </div>}
                </div>
              </>}
            </NekoCollapsableCategory>
            <NekoCollapsableCategory title={i18n.COMMON.SHORTCODES}>
              <Shortcode currentChatbot={shortcodeParams} style={{ marginTop: 10 }} />
              <p>{i18n.HELP.CUSTOM_SHORTCODE}</p>
              <Shortcode currentChatbot={shortcodeParams} isCustom={true} defaultChatbot={defaultChatbot} style={{ marginTop: 10 }} />
            </NekoCollapsableCategory>
            <NekoCollapsableCategory title={i18n.COMMON.ACTIONS}>
              <div style={{ display: 'flex', marginTop: 10 }}>
                <NekoButton className="primary" onClick={duplicateCurrentChatbot}>
                  {i18n.COMMON.DUPLICATE}
                </NekoButton>
                <NekoButton className="secondary" onClick={resetCurrentChatbot}>
                  {i18n.COMMON.RESET}
                </NekoButton>
                <div style={{ flex: 'auto' }} />
                <NekoButton className="danger" disabled={shortcodeParams.name === 'Default'}
                  onClick={deleteCurrentChatbot}>
                  {i18n.COMMON.DELETE}
                </NekoButton>
              </div>
            </NekoCollapsableCategory>
          </NekoCollapsableCategories>
        </StyledBuilderForm>
      </NekoColumn>
    </NekoWrapper>
  </>);
};

export default ChatbotParams;