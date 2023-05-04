// Previous: 1.6.1
// Current: 1.6.65

const { useMemo, useEffect } = wp.element;

import {
  NekoInput, NekoSelect, NekoOption, NekoCheckbox, NekoWrapper, NekoMessage, NekoSpacer,
  NekoColumn, NekoTextArea, NekoButton, NekoCollapsableCategory, NekoCollapsableCategories
} from '@neko-ui';

import { isRegistered } from '@app/settings';

import i18n from '@root/i18n';
import { pluginUrl } from "@app/settings";
import { toHTML, useModels } from '@app/helpers';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";

const chatIcons = ['chat-openai.svg', 'chat-robot-1.svg', 'chat-robot-2.svg', 'chat-robot-3.svg', 'chat-robot-4.svg', 'chat-robot-5.svg', 'chat-robot-6.svg', 'chat-color-blue.svg', 'chat-color-green.svg', 'chat-color-red.svg', 'chat-traditional-1.svg', 'chat-traditional-2.svg', 'chat-traditional-3.svg'];

const ChatbotParams = (props) => {
  const { themes, shortcodeParams, updateShortcodeParams, options } = props;
  const { completionModels, isFineTunedModel, getModel } = useModels(options);

  const pinecone = options?.pinecone || {};
  const shortcodeChatInject = options?.shortcode_chat_inject;
  const isChat = shortcodeParams?.mode === 'chat' ?? 'chat';
  const isImagesChat = shortcodeParams?.mode === 'images' ?? false;
  const indexes = pinecone?.indexes || [];
  const isFineTuned = isFineTunedModel(shortcodeParams.model);
  const currentModel = getModel(shortcodeParams.model);
  const isContentAware = shortcodeParams.contentAware;
  const contextHasContent = shortcodeParams.context && shortcodeParams.context.includes('{CONTENT}');
  const chatIcon = shortcodeParams?.icon ? shortcodeParams?.icon : 'chat-color-green.svg';
  const isCustomURL = chatIcon?.startsWith('https://') || chatIcon?.startsWith('http://');
  const previewIcon = isCustomURL ? chatIcon : `${pluginUrl}/images/${chatIcon}`;

  const builtShortcode = useMemo(() => {
    const params = [];
    for (const key in shortcodeParams) {
      if (shortcodeParams[key] === undefined || shortcodeParams[key] === null ||
        shortcodeParams[key] === '') {
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
      params.push(`${key}="${value}"`);
    }
    const joinedParams = params.join(' ');
    return '[mwai_chatbot_v2' + (joinedParams ? ` ${joinedParams}` : '') + ']';
  }, [shortcodeParams]);

  const [localShortcode, setLocalShortcode] = React.useState(shortcodeParams);

  useEffect(() => {
    setLocalShortcode(shortcodeParams);
  }, [shortcodeParams]);

  const handleChange = (name, value) => {
    setLocalShortcode(prev => ({ ...prev, [name]: value }));
    updateShortcodeParams({ target: { name, value } });
  };

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
                    disabled={shortcodeParams.chatId === 'default'}
                    value={localShortcode.name}
                    onBlur={(e) => updateShortcodeParams(e)}
                    onEnter={(e) => updateShortcodeParams(e)}
                  />
                </div>
                <div className="mwai-builder-col">
                  <div>
                    <label style={{ display: 'block' }}>{i18n.COMMON.ID}:</label>
                    <NekoInput name="chatId" type="text" placeholder="Optional"
                      disabled={shortcodeParams.chatId === 'default'}
                      value={localShortcode.chatId}
                      onBlur={(e) => updateShortcodeParams(e)}
                      onEnter={(e) => updateShortcodeParams(e)}
                    />
                  </div>
                </div>
                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.THEME}:</label>
                  <NekoSelect scrolldown name="themeId"
                    value={localShortcode.themeId} description="" onChange={(e) => updateShortcodeParams(e)}>
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
                <div className="mwai-builder-col"
                  style={{ height: localShortcode?.mode === 'chat' ? 76 : 'inherit' }}>
                  <label>{i18n.COMMON.MODE}:</label>
                  <NekoSelect scrolldown id="mode" name="mode"
                    value={localShortcode?.mode}
                    onChange={(e) => handleChange('mode', e.target.value)}>
                    <NekoOption value="chat" label="Chat" />
                    <NekoOption value="images" label="Images" />
                  </NekoSelect>
                </div>

                {isChat && <div className="mwai-builder-col" style={{ flex: 5 }}>
                  <label>{i18n.COMMON.CONTEXT}:</label>
                  <NekoTextArea name="context" rows={10} textAreaStyle={{ resize: 'none' }}
                    value={localShortcode.context}
                    onBlur={(e) => updateShortcodeParams(e)}
                    onEnter={(e) => updateShortcodeParams(e)}
                  />
                </div>}

                {isImagesChat && <div className="mwai-builder-col" style={{ flex: 5 }}>
                  <label>{i18n.COMMON.IMAGES_NUMBER}:</label>
                  <NekoInput name="maxResults" type="number"
                    value={localShortcode.maxResults}
                    onBlur={(e) => updateShortcodeParams(e)}
                    onEnter={(e) => updateShortcodeParams(e)}
                  />
                </div>}

              </div>

            </NekoCollapsableCategory>

            <NekoCollapsableCategory title={i18n.COMMON.VISUAL_SETTINGS}>

              <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.AI_NAME}:</label>
                  <NekoInput name="aiName" data-form-type="other"
                    value={localShortcode.aiName}
                    onBlur={(e) => updateShortcodeParams(e)}
                    onEnter={(e) => updateShortcodeParams(e)}
                  />
                </div>
                <div className="mwai-builder-col" style={{ flex: 3 }}>
                  <label>{i18n.COMMON.START_SENTENCE}:</label>
                  <NekoInput name="startSentence"
                    value={localShortcode.startSentence}
                    onBlur={(e) => updateShortcodeParams(e)}
                    onEnter={(e) => updateShortcodeParams(e)}
                  />
                </div>

              </div>

              <div className="mwai-builder-row">

                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.USER_NAME}:</label>
                  <NekoInput name="userName" data-form-type="other"
                    value={localShortcode.userName}
                    onBlur={(e) => updateShortcodeParams(e)}
                    onEnter={(e) => updateShortcodeParams(e)}
                  />
                </div>
                <div className="mwai-builder-col" style={{ flex: 3 }}>
                  <label>{i18n.COMMON.PLACEHOLDER}:</label>
                  <NekoInput name="textInputPlaceholder"
                    value={localShortcode.textInputPlaceholder}
                    onBlur={(e) => updateShortcodeParams(e)}
                    onEnter={(e) => updateShortcodeParams(e)}
                  />
                </div>
                <div className="mwai-builder-col" style={{ flex: 1.5 }}>
                  <label>{i18n.COMMON.SEND}:</label>
                  <NekoInput name="textSend" value={localShortcode.textSend}
                    onBlur={(e) => updateShortcodeParams(e)}
                    onEnter={(e) => updateShortcodeParams(e)}
                  />
                </div>
                <div className="mwai-builder-col" style={{ flex: 1.5 }}>
                  <label>{i18n.COMMON.CLEAR}:</label>
                  <NekoInput name="textClear" value={localShortcode.textClear}
                    onBlur={(e) => updateShortcodeParams(e)}
                    onEnter={(e) => updateShortcodeParams(e)}
                  />
                </div>
              </div>

              <div className="mwai-builder-row">

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.COPY_BUTTON}:</label>
                  <NekoCheckbox name="copyButton" label="Yes"
                    checked={localShortcode.copyButton} value="1" onChange={(e) => handleChange('copyButton', e.target.checked)} />
                </div>

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.POPUP}:</label>
                  <NekoCheckbox name="window" label="Yes"
                    checked={localShortcode.window} value="1" onChange={(e) => handleChange('window', e.target.checked)} />
                </div>

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.FULL_SCREEN}:</label>
                  <NekoCheckbox name="fullscreen" label="Yes"
                    checked={localShortcode.fullscreen} value="1" onChange={(e) => handleChange('fullscreen', e.target.checked)} />
                </div>

                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.COMPLIANCE_TEXT}:</label>
                  <NekoInput name="textCompliance"
                    value={localShortcode.textCompliance}
                    onBlur={(e) => updateShortcodeParams(e)}
                    onEnter={(e) => updateShortcodeParams(e)}
                  />
                </div>

              </div>

              {(localShortcode.window || !localShortcode.aiName) && <>
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
                              handleChange('icon', `${pluginUrl}/images/${x}`)
                            }} />
                        )}
                        <NekoButton small className="primary" style={{ marginLeft: 5 }}
                          onClick={() => { handleChange('icon', `${pluginUrl}/images/chat-color-green.svg`) }}>
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
                      <NekoInput name="icon" value={localShortcode.icon}
                        onBlur={(e) => handleChange('icon', e.target.value)} onEnter={(e) => handleChange('icon', e.target.value)}
                      />
                    </div>
                  </div>}
                </div>
              </>}

            </NekoCollapsableCategory>

            <NekoCollapsableCategory title={i18n.COMMON.POPUP_SETTINGS} hide={!localShortcode.window}>
              <div className="mwai-builder-row">

                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.POSITION}:</label>
                  <NekoSelect scrolldown name="iconPosition" disabled={!localShortcode.window}
                    value={localShortcode.iconPosition} onChange={(e) => handleChange('iconPosition', e.target.value)}>
                    <NekoOption value="bottom-right" label="Bottom Right" />
                    <NekoOption value="bottom-left" label="Bottom Left" />
                    <NekoOption value="top-right" label="Top Right" />
                    <NekoOption value="top-left" label="Top Left" />
                  </NekoSelect>
                </div>

                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.ICON_TEXT}:</label>
                  <NekoInput name="iconText" disabled={!localShortcode.window}
                    placeholder="If set, appears next to icon"
                    value={localShortcode.iconText}
                    onBlur={(e) => handleChange('iconText', e.target.value)}
                    onEnter={(e) => handleChange('iconText', e.target.value)}
                  />
                </div>

              </div>
            </NekoCollapsableCategory>

            <NekoCollapsableCategory title={i18n.COMMON.AI_SETTINGS}>

              {isChat && <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 3 }}>
                  <label>{i18n.COMMON.MODEL}:</label>
                  <NekoSelect scrolldown name="model"
                    value={localShortcode.model} description="" onChange={(e) => handleChange('model', e.target.value)}>
                    {completionModels.map((x) => (
                      <NekoOption key={x.model} value={x.model} label={x.name}></NekoOption>
                    ))}
                  </NekoSelect>
                </div>
                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.CASUALLY_FINE_TUNED}:</label>
                  <NekoCheckbox name="casuallyFineTuned" label="Yes"
                    disabled={!isFineTuned && !localShortcode.casuallyFineTuned}
                    checked={localShortcode.casuallyFineTuned} value="1" onChange={(e) => handleChange('casuallyFineTuned', e.target.checked)} />
                </div>
                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.TEMPERATURE}:</label>
                  <NekoInput name="temperature" type="number"
                    step="0.1" min="0" max="1"
                    value={localShortcode.temperature}
                    onBlur={(e) => handleChange('temperature', e.target.value)}
                    onEnter={(e) => handleChange('temperature', e.target.value)}
                  />
                </div>
              </div>}

              {isChat && <div className="mwai-builder-row">

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.MAX_TOKENS}:</label>
                  <NekoInput name="maxTokens" type="number" min="10" max="2048"
                    value={localShortcode.maxTokens}
                    onBlur={(e) => handleChange('maxTokens', e.target.value)}
                    onEnter={(e) => handleChange('maxTokens', e.target.value)}
                  />
                </div>

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.MAX_SENTENCES}:</label>
                  <NekoInput name="maxSentences"
                    step="1" min="1" max="512"
                    value={localShortcode.maxSentences}
                    onBlur={(e) => handleChange('maxSentences', e.target.value)}
                    onEnter={(e) => handleChange('maxSentences', e.target.value)}
                  />
                </div>

                <div className="mwai-builder-col" style={{ flex: 1 }}>
                  <label>{i18n.COMMON.INPUT_MAXLENGTH}:</label>
                  <NekoInput name="textInputMaxLength"
                    step="1" min="1" max="512"
                    value={localShortcode.textInputMaxLength}
                    onBlur={(e) => handleChange('textInputMaxLength', e.target.value)}
                    onEnter={(e) => handleChange('textInputMaxLength', e.target.value)}
                  />
                </div>

              </div>}

              {isChat && <div className="mwai-builder-row">

                <div className="mwai-builder-col">
                  <label>{i18n.COMMON.EMBEDDINGS_INDEX}:</label>
                  <NekoSelect scrolldown name="embeddingsIndex"
                    requirePro={true} isPro={isRegistered}
                    disabled={!indexes?.length || currentModel?.mode !== 'chat'}
                    value={localShortcode.embeddingsIndex} onChange={(e) => handleChange('embeddingsIndex', e.target.value)}>
                    {indexes.map((x) => (
                      <NekoOption key={x.name} value={x.name} label={x.name}></NekoOption>
                    ))}
                    <NekoOption value={""} label={"Disabled"}></NekoOption>
                  </NekoSelect>
                </div>

                <div className="mwai-builder-col">
                  <label>{i18n.COMMON.CONTENT_AWARE}:</label>
                  <NekoCheckbox name="contentAware" label="Yes"
                    requirePro={true} isPro={isRegistered}
                    checked={localShortcode.contentAware} value="1" onChange={(e) => handleChange('contentAware', e.target.checked)} />
                </div>

              </div>}

              {shortcodeChatInject && !localShortcode.window &&
                <NekoMessage variant="danger" style={{ marginTop: 15, padding: '10px 15px' }}>
                  <p>{i18n.SETTINGS.ALERT_INJECT_BUT_NO_POPUP}</p>
                </NekoMessage>
              }

              {isFineTuned && !localShortcode.casuallyFineTuned &&
                <NekoMessage variant="danger" style={{ marginTop: 15, padding: '10px 15px' }}>
                  <p>{i18n.SETTINGS.ALERT_FINETUNE_BUT_NO_CASUALLY}</p>
                </NekoMessage>
              }

              {!isFineTuned && localShortcode.casuallyFineTuned &&
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

            <NekoCollapsableCategory title={i18n.COMMON.SHORTCODE}>
              <p>{i18n.HELP.CUSTOM_SHORTCODE}</p>
              <pre>{builtShortcode}</pre>
            </NekoCollapsableCategory>

          </NekoCollapsableCategories>

        </StyledBuilderForm>

      </NekoColumn>
    </NekoWrapper>
  </>);
};

export default ChatbotParams;