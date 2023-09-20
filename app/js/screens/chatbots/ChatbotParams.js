// Previous: 1.9.2
// Current: 1.9.8

const { useMemo, useEffect } = wp.element;

import {
  NekoInput, NekoSelect, NekoOption, NekoCheckbox, NekoWrapper, NekoMessage,
  NekoColumn, NekoTextArea, NekoButton, NekoCollapsableCategory, NekoCollapsableCategories
} from '@neko-ui';

import { isRegistered } from '@app/settings';

import i18n from '@root/i18n';
import { pluginUrl } from "@app/settings";
import { toHTML, useModels } from '@app/helpers-admin';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";

const chatIcons = ['chat-openai.svg', 'chat-robot-1.svg', 'chat-robot-2.svg', 'chat-robot-3.svg', 'chat-robot-4.svg', 'chat-robot-5.svg', 'chat-robot-6.svg', 'chat-color-blue.svg', 'chat-color-green.svg', 'chat-color-red.svg', 'chat-traditional-1.svg', 'chat-traditional-2.svg', 'chat-traditional-3.svg'];

const ChatbotParams = (props) => {
  const { themes, shortcodeParams, updateShortcodeParams, defaultChatbot,
    deleteCurrentChatbot, resetCurrentChatbot, duplicateCurrentChatbot, options } = props;
  const { completionModels, isFineTunedModel, getModel } = useModels(options);

  const pinecone = options?.pinecone || {};
  const shortcodeChatInject = options?.shortcode_chat_inject;
  const isChat = (shortcodeParams.mode === 'chat') ?? false;
  const isImagesChat = (shortcodeParams.mode === 'images') ?? false;
  const indexes = pinecone?.indexes || [];
  const namespaces = pinecone.namespaces || [];
  const isFineTuned = isFineTunedModel(shortcodeParams.model);
  const currentModel = getModel(shortcodeParams.model);
  const isContentAware = shortcodeParams.contentAware;
  const contextHasContent = shortcodeParams.context && shortcodeParams.context.includes('{CONTENT}');
  const chatIcon = shortcodeParams.icon ? shortcodeParams.icon : 'chat-color-green.svg';
  const isCustomURL = chatIcon?.startsWith('https://') || chatIcon?.startsWith('http://');
  const previewIcon = isCustomURL ? chatIcon : `${pluginUrl}/images/${chatIcon}`;

  const builtShortcode = useMemo(() => {
    const params = [];
    for (const key in shortcodeParams) {
      if (shortcodeParams[key] === undefined || shortcodeParams[key] === null ||
        key === 'botId' || key === 'name' || key === 'maxSentences' ||
        shortcodeParams[key] === '' || (defaultChatbot && defaultChatbot[key] === shortcodeParams[key])) {
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
      const newKey = key.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
      params.push(`${newKey}="${value}"`);
    }
    const joinedParams = params.join(' ');
    return '[mwai_chatbot_v2' + (joinedParams ? ` ${joinedParams}` : '') + ']';
  }, [shortcodeParams]);

  useEffect(() => {
    if (shortcodeParams.embeddingsIndex && !shortcodeParams.embeddingsNamespace && namespaces.length > 0) {
      updateShortcodeParams(namespaces[0], 'embeddingsNamespace');
    }
  }, [shortcodeParams.embeddingsIndex, namespaces, updateShortcodeParams]);

  return (<>
    <NekoWrapper>
      <NekoColumn minimal>
        <StyledBuilderForm>
          <NekoCollapsableCategories keepState="chatbotParams">
            <NekoCollapsableCategory title={i18n.COMMON.MAIN_SETTINGS}>
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
                  style={{ height: (shortcodeParams.mode === 'chat') ? 76 : 'inherit' }}>
                  <label>{i18n.COMMON.MODE}:</label>
                  <NekoSelect scrolldown id="mode" name="mode"
                    value={shortcodeParams.mode}
                    onChange={updateShortcodeParams}>
                    <NekoOption value="chat" label="Chat" />
                    <NekoOption value="images" label="Images" />
                  </NekoSelect>
                </div>

                {isChat && <div className="mwai-builder-col" style={{ flex: 5 }}>
                  <label>{i18n.COMMON.CONTEXT}:</label>
                  <NekoTextArea name="context" rows={10} textAreaStyle={{ resize: 'none' }}
                    value={shortcodeParams.context}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>}

                {isImagesChat && <div className="mwai-builder-col" style={{ flex: 5 }}>
                  <label>{i18n.COMMON.IMAGES_NUMBER}:</label>
                  <NekoInput name="maxResults" type="number"
                    value={shortcodeParams.maxResults}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>}
              </div>

            </NekoCollapsableCategory>

            <NekoCollapsableCategory title={i18n.COMMON.VISUAL_SETTINGS}>
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
                  <NekoInput name="startSentence"
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

            <NekoCollapsableCategory title={i18n.COMMON.AI_SETTINGS}>
              {isChat && <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 3 }}>
                  <label>{i18n.COMMON.MODEL}:</label>
                  <NekoSelect scrolldown name="model"
                    value={shortcodeParams.model} onChange={updateShortcodeParams}>
                    {completionModels.map((x) => (
                      <NekoOption key={x.model} value={x.model} label={x.name}></NekoOption>
                    ))}
                  </NekoSelect>
                </div>
                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.CASUALLY_FINE_TUNED}:</label>
                  <NekoCheckbox name="casuallyFineTuned" label="Yes (Legacy)"
                    disabled={!isFineTuned && !shortcodeParams.casuallyFineTuned}
                    checked={shortcodeParams.casuallyFineTuned} value="1" onChange={updateShortcodeParams}
                  />
                </div>
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.TEMPERATURE}:</label>
                  <NekoInput name="temperature" type="number"
                    step="0.1" min="0" max="1"
                    value={shortcodeParams.temperature}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
              </div>}

              {isChat && <div className="mwai-builder-row">

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.MAX_TOKENS}:</label>
                  <NekoInput name="maxTokens" type="number" min="10" max="2048"
                    value={shortcodeParams.maxTokens}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.MAX_MESSAGES}:</label>
                  <NekoInput name="maxSentences"
                    step="1" min="1" max="512"
                    value={shortcodeParams.maxSentences}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.INPUT_MAXLENGTH}:</label>
                  <NekoInput name="textInputMaxLength"
                    step="1" min="1" max="512"
                    value={shortcodeParams.textInputMaxLength}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
              </div>}

              {isChat && <div className="mwai-builder-row">
                <div className="mwai-builder-col">
                  <label>{i18n.COMMON.EMBEDDINGS_INDEX}:</label>
                  <NekoSelect scrolldown name="embeddingsIndex"
                    requirePro={true} isPro={isRegistered}
                    disabled={!indexes?.length || currentModel?.mode !== 'chat'}
                    value={shortcodeParams.embeddingsIndex} onChange={updateShortcodeParams}>
                    {indexes.map((x) => (
                      <NekoOption key={x.name} value={x.name} label={x.name}></NekoOption>
                    ))}
                    <NekoOption value={""} label={"Disabled"}></NekoOption>
                  </NekoSelect>
                </div>

                {shortcodeParams.embeddingsIndex && <div className="mwai-builder-col">
                  <label>{i18n.COMMON.NAMESPACE}:</label>
                  <NekoSelect scrolldown name="embeddingsNamespace"
                    value={shortcodeParams.embeddingsNamespace} onChange={updateShortcodeParams}>
                    {namespaces.map(x => <NekoOption key={x} value={x} label={x} />)}
                    {(!namespaces || !namespaces.length) && <NekoOption value={null} label="None" />}
                  </NekoSelect>
                </div>}
                <div className="mwai-builder-col">
                  <label>{i18n.COMMON.CONTENT_AWARE}:</label>
                  <NekoCheckbox name="contentAware" label="Yes"
                    requirePro={true} isPro={isRegistered}
                    checked={shortcodeParams.contentAware} value="1" onChange={updateShortcodeParams} />
                </div>
              </div>}

              {shortcodeChatInject && !shortcodeParams.window &&
                <NekoMessage variant="danger" style={{ marginTop: 15, padding: '10px 15px' }}>
                  <p>{i18n.SETTINGS.ALERT_INJECT_BUT_NO_POPUP}</p>
                </NekoMessage>
              }

              {!isFineTuned && shortcodeParams.casuallyFineTuned &&
                <NekoMessage variant="danger" style={{ marginTop: 15, padding: '10px 15px' }}>
                  <p>{i18n.SETTINGS.ALERT_CASUALLY_BUT_NO_FINETUNE}</p>
                </NekoMessage>
              }

              {isContentAware && !contextHasContent &&
                <NekoMessage variant="danger" style={{ marginTop: 15, padding: '10px 15px' }}>
                  <p>{toHTML(i18n.SETTINGS.ALERT_CONTENTAWARE_BUT_NO_CONTENT)}</p>
                </NekoMessage>
              }

            </NekoCollapsableCategory>

            <NekoCollapsableCategory title={i18n.COMMON.CUSTOM_SHORTCODE}>
              <pre>{builtShortcode}</pre>
              <p>{i18n.HELP.CUSTOM_SHORTCODE}</p>
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