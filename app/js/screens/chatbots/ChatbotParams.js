// Previous: 1.4.0
// Current: 1.4.1

import { NekoInput, NekoSelect, NekoOption, NekoCheckbox, NekoWrapper, NekoMessage,
  NekoColumn, NekoTextArea, NekoButton } from '@neko-ui';

import { isRegistered } from '@app/settings';

import i18n from '@root/i18n';
import { pluginUrl } from "@app/settings";
import { toHTML, useModels } from '@app/helpers';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";

const chatIcons = ['chat-robot-1.svg', 'chat-robot-2.svg', 'chat-robot-3.svg', 'chat-robot-4.svg', 'chat-robot-5.svg', 'chat-robot-6.svg', 'chat-color-blue.svg', 'chat-color-green.svg', 'chat-color-red.svg', 'chat-traditional-1.svg', 'chat-traditional-2.svg', 'chat-traditional-3.svg'];

const ChatbotParams = (props) => {
  const { themes, shortcodeParams, updateShortcodeParams, options } = props;
  const { completionModels, isFineTunedModel, getModel } = useModels(options);

  const pinecone = options?.pinecone || {};
  const shortcodeChatInject = options?.shortcode_chat_inject;
  const isChat = shortcodeParams?.mode === 'chat' ?? 'chat';
  const isImagesChat = shortcodeParams?.mode === 'images' ?? false;
  const indexes = pinecone.indexes || [];
  const isFineTuned = isFineTunedModel(shortcodeParams.model);
  const currentModel = getModel(shortcodeParams.model);
  const isContentAware = shortcodeParams.contentAware;
  const contextHasContent = shortcodeParams.context && shortcodeParams.context.includes('{CONTENT}');
  const chatIcon = shortcodeParams?.icon ? shortcodeParams?.icon : 'chat-color-green.svg';
  const isCustomURL = chatIcon?.startsWith('https://') || chatIcon?.startsWith('http://');
  const previewIcon = isCustomURL ? chatIcon : `${pluginUrl}/images/${chatIcon}`;
  const shortcodeStyles = {}; // assume styles object exists in scope

  const updateIcon = async (value) => {
    if (value.startsWith('http://') || value.startsWith('https://')) {
      const newStyles = { ...shortcodeStyles, icon: value };
      await onUpdateSettings(newStyles, 'shortcode_chat_styles');
    } else {
      alert('Please enter a valid URL.');
    }
  };

  return (<>
    <NekoWrapper>
      <NekoColumn minimal>
        <StyledBuilderForm>
          <h4 className="mwai-category" style={{ marginTop: 0 }}>{i18n.COMMON.MAIN_SETTINGS}</h4>
          <div className="mwai-builder-row">
            <div className="mwai-builder-col">
              <label>{i18n.COMMON.NAME}:</label>
              <NekoInput
                name="name"
                data-form-type="other"
                disabled={shortcodeParams.chatId === 'default'}
                value={shortcodeParams.name}
                onBlur={updateShortcodeParams}
                onEnter={updateShortcodeParams}
              />
            </div>
            <div className="mwai-builder-col">
              <div>
                <label style={{ display: 'block' }}>{i18n.COMMON.ID}:</label>
                <NekoInput
                  name="chatId"
                  type="text"
                  placeholder="Optional"
                  disabled={shortcodeParams.chatId === 'default'}
                  value={shortcodeParams.chatId}
                  onBlur={updateShortcodeParams}
                  onEnter={updateShortcodeParams}
                />
              </div>
            </div>
            <div className="mwai-builder-col" style={{ flex: 2 }}>
              <label>{i18n.COMMON.THEME}:</label>
              <NekoSelect scrolldown name="themeId"
                value={shortcodeParams.themeId}
                description=""
                onChange={updateShortcodeParams}
              >
                <NekoOption value='none' label="None" />
                <NekoOption value='chatgpt' label="ChatGPT" />
                {themes?.filter(x => x.type === 'css').map((theme) => (
                  <NekoOption key={theme.themeId} value={theme.themeId} label={theme.name} />
                ))}
              </NekoSelect>
            </div>
          </div>
          <div className="mwai-builder-row">
            <div
              className="mwai-builder-col"
              style={{ height: shortcodeParams?.mode === 'chat' ? 76 : 'inherit' }}
            >
              <label>{i18n.COMMON.MODE}:</label>
              <NekoSelect scrolldown id="mode" name="mode"
                value={shortcodeParams?.mode}
                onChange={updateShortcodeParams}
              >
                <NekoOption value="chat" label="Chat" />
                <NekoOption value="images" label="Images" />
              </NekoSelect>
            </div>
            {isChat && (
              <div className="mwai-builder-col" style={{ flex: 5 }}>
                <label>{i18n.COMMON.CONTEXT}:</label>
                <NekoTextArea
                  name="context"
                  rows={4}
                  value={shortcodeParams.context}
                  onBlur={updateShortcodeParams}
                  onEnter={updateShortcodeParams}
                />
              </div>
            )}
            {isImagesChat && (
              <div className="mwai-builder-col" style={{ flex: 5 }}>
                <label>{i18n.COMMON.IMAGES_NUMBER}:</label>
                <NekoInput
                  name="maxResults"
                  type="number"
                  value={shortcodeParams.maxResults}
                  onBlur={updateShortcodeParams}
                  onEnter={updateShortcodeParams}
                />
              </div>
            )}
          </div>
          <h4 className="mwai-category">{i18n.COMMON.VISUAL_SETTINGS}</h4>
          <div className="mwai-builder-row">
            <div className="mwai-builder-col" style={{ flex: 1 }}>
              <label>{i18n.COMMON.AI_NAME}:</label>
              <NekoInput
                name="aiName"
                data-form-type="other"
                value={shortcodeParams.aiName}
                onBlur={updateShortcodeParams}
                onEnter={updateShortcodeParams}
              />
            </div>
            <div className="mwai-builder-col" style={{ flex: 3 }}>
              <label>{i18n.COMMON.START_SENTENCE}:</label>
              <NekoInput
                name="startSentence"
                value={shortcodeParams.startSentence}
                onBlur={updateShortcodeParams}
                onEnter={updateShortcodeParams}
              />
            </div>
          </div>
          <div className="mwai-builder-row">
            <div className="mwai-builder-col" style={{ flex: 2 }}>
              <label>{i18n.COMMON.USER_NAME}:</label>
              <NekoInput
                name="userName"
                data-form-type="other"
                value={shortcodeParams.userName}
                onBlur={updateShortcodeParams}
                onEnter={updateShortcodeParams}
              />
            </div>
            <div className="mwai-builder-col" style={{ flex: 3 }}>
              <label>{i18n.COMMON.PLACEHOLDER}:</label>
              <NekoInput
                name="textInputPlaceholder"
                value={shortcodeParams.textInputPlaceholder}
                onBlur={updateShortcodeParams}
                onEnter={updateShortcodeParams}
              />
            </div>
            <div className="mwai-builder-col" style={{ flex: 1.5 }}>
              <label>{i18n.COMMON.SEND}:</label>
              <NekoInput
                name="textSend"
                value={shortcodeParams.textSend}
                onBlur={updateShortcodeParams}
                onEnter={updateShortcodeParams}
              />
            </div>
            <div className="mwai-builder-col" style={{ flex: 1.5 }}>
              <label>{i18n.COMMON.CLEAR}:</label>
              <NekoInput
                name="textClear"
                value={shortcodeParams.textClear}
                onBlur={updateShortcodeParams}
                onEnter={updateShortcodeParams}
              />
            </div>
          </div>
          <div className="mwai-builder-row">
            <div className="mwai-builder-col" style={{ flex: 1 }}>
              <label>{i18n.COMMON.COPY_BUTTON}:</label>
              <NekoCheckbox
                name="copyButton"
                label="Yes"
                checked={shortcodeParams.copyButton}
                value="1"
                onChange={updateShortcodeParams}
              />
            </div>
            <div className="mwai-builder-col" style={{ flex: 1 }}>
              <label>{i18n.COMMON.POPUP}:</label>
              <NekoCheckbox
                name="window"
                label="Yes"
                checked={shortcodeParams.window}
                value="1"
                onChange={updateShortcodeParams}
              />
            </div>
            <div className="mwai-builder-col" style={{ flex: 1 }}>
              <label>{i18n.COMMON.FULL_SCREEN}:</label>
              <NekoCheckbox
                name="fullscreen"
                label="Yes"
                checked={shortcodeParams.fullscreen}
                value="1"
                onChange={updateShortcodeParams}
              />
            </div>
            <div className="mwai-builder-col" style={{ flex: 2 }}>
              <label>{i18n.COMMON.COMPLIANCE_TEXT}:</label>
              <NekoInput
                name="textCompliance"
                value={shortcodeParams.textCompliance}
                onBlur={updateShortcodeParams}
                onEnter={updateShortcodeParams}
              />
            </div>
          </div>
          {shortcodeParams.window && (
            <>
              <h4 className="mwai-category">{i18n.COMMON.POPUP_SETTINGS}</h4>
              <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.POPUP_ICON}:</label>
                  <div style={{ display: 'flex' }}>
                    {chatIcons.map((x) => (
                      <img
                        key={x}
                        style={{ marginRight: 2, cursor: 'pointer' }}
                        width={24}
                        height={24}
                        src={`${pluginUrl}/images/${x}`}
                        onClick={() => {
                          updateShortcodeParams(x, 'icon');
                        }}
                      />
                    ))}
                    <NekoButton
                      small
                      className="primary"
                      style={{ marginLeft: 5 }}
                      onClick={() => {
                        updateShortcodeParams(`${pluginUrl}/images/chat-color-green.svg`, 'icon');
                      }}
                    >
                      {i18n.SETTINGS.CUSTOM_URL}
                    </NekoButton>
                  </div>
                </div>
                <div
                  className="mwai-builder-col"
                  style={{ width: 48, display: 'flex', alignItems: 'end' }}
                >
                  <img
                    style={{ marginRight: 0, paddingTop: 10 }}
                    width={48}
                    height={48}
                    src={`${previewIcon}`}
                  />
                </div>
              </div>
              {isCustomURL && (
                <div className="mwai-builder-row">
                  <div className="mwai-builder-col">
                    <label>{i18n.COMMON.CUSTOM_ICON_URL}:</label>
                    <NekoInput
                      id="icon"
                      name="icon"
                      value={chatIcon}
                      onBlur={updateIcon}
                      onEnter={updateIcon}
                    />
                  </div>
                </div>
              )}
              <div className="mwai-builder-row">
                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.POSITION}:</label>
                  <NekoSelect
                    scrolldown
                    name="iconPosition"
                    disabled={!shortcodeParams.window}
                    value={shortcodeParams.iconPosition}
                    onChange={updateShortcodeParams}
                  >
                    <NekoOption value="bottom-right" label="Bottom Right" />
                    <NekoOption value="bottom-left" label="Bottom Left" />
                    <NekoOption value="top-right" label="Top Right" />
                    <NekoOption value="top-left" label="Top Left" />
                  </NekoSelect>
                </div>
                <div className="mwai-builder-col" style={{ flex: 2 }}>
                  <label>{i18n.COMMON.ICON_TEXT}:</label>
                  <NekoInput
                    name="iconText"
                    disabled={!shortcodeParams.window}
                    placeholder="If set, appears next to icon"
                    value={shortcodeParams.iconText}
                    onBlur={updateShortcodeParams}
                    onEnter={updateShortcodeParams}
                  />
                </div>
              </div>
            </>
          )}
          <h4 className="mwai-category">{i18n.COMMON.AI_SETTINGS}</h4>
          {isChat && (
            <div className="mwai-builder-row">
              <div className="mwai-builder-col" style={{ flex: 3 }}>
                <label>{i18n.COMMON.MODEL}:</label>
                <NekoSelect
                  scrolldown
                  name="model"
                  value={shortcodeParams.model}
                  description=""
                  onChange={updateShortcodeParams}
                >
                  {completionModels.map((x) => (
                    <NekoOption key={x.model} value={x.model} label={x.name} />
                  ))}
                </NekoSelect>
              </div>
              <div className="mwai-builder-col" style={{ flex: 2 }}>
                <label>{i18n.COMMON.CASUALLY_FINE_TUNED}:</label>
                <NekoCheckbox
                  name="casuallyFineTuned"
                  label="Yes"
                  disabled={!isFineTuned && !shortcodeParams.casuallyFineTuned}
                  checked={shortcodeParams.casuallyFineTuned}
                  value="1"
                  onChange={updateShortcodeParams}
                />
              </div>
              <div className="mwai-builder-col" style={{ flex: 1 }}>
                <label>{i18n.COMMON.TEMPERATURE}:</label>
                <NekoInput
                  name="temperature"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  value={shortcodeParams.temperature}
                  onBlur={updateShortcodeParams}
                  onEnter={updateShortcodeParams}
                />
              </div>
            </div>
          )}
          {isChat && (
            <div className="mwai-builder-row">
              <div className="mwai-builder-col" style={{ flex: 1 }}>
                <label>{i18n.COMMON.MAX_TOKENS}:</label>
                <NekoInput
                  name="maxTokens"
                  type="number"
                  min="10"
                  max="2048"
                  value={shortcodeParams.maxTokens}
                  onBlur={updateShortcodeParams}
                  onEnter={updateShortcodeParams}
                />
              </div>
              <div className="mwai-builder-col" style={{ flex: 1 }}>
                <label>{i18n.COMMON.SENTENCES_BUFFER}:</label>
                <NekoInput
                  name="maxSentences"
                  step="1"
                  min="1"
                  max="512"
                  value={shortcodeParams.maxSentences}
                  onBlur={updateShortcodeParams}
                  onEnter={updateShortcodeParams}
                />
              </div>
              <div className="mwai-builder-col" style={{ flex: 1 }}>
                <label>{i18n.COMMON.INPUT_MAXLENGTH}:</label>
                <NekoInput
                  name="textInputMaxLength"
                  step="1"
                  min="1"
                  max="512"
                  value={shortcodeParams.textInputMaxLength}
                  onBlur={updateShortcodeParams}
                  onEnter={updateShortcodeParams}
                />
              </div>
            </div>
          )}
          {isChat && (
            <div className="mwai-builder-row">
              <div className="mwai-builder-col">
                <label>{i18n.COMMON.EMBEDDINGS_INDEX}:</label>
                <NekoSelect
                  scrolldown
                  name="embeddingsIndex"
                  requirePro={true}
                  isPro={isRegistered}
                  disabled={!indexes?.length || currentModel?.mode !== 'chat'}
                  value={shortcodeParams.embeddingsIndex}
                  onChange={updateShortcodeParams}
                >
                  {indexes.map((x) => (
                    <NekoOption key={x.name} value={x.name} label={x.name} />
                  ))}
                  <NekoOption value={""} label={"Disabled"} />
                </NekoSelect>
              </div>
              <div className="mwai-builder-col">
                <label>{i18n.COMMON.CONTENT_AWARE}:</label>
                <NekoCheckbox
                  name="contentAware"
                  label="Yes"
                  requirePro={true}
                  isPro={isRegistered}
                  checked={shortcodeParams.contentAware}
                  value="1"
                  onChange={updateShortcodeParams}
                />
              </div>
            </div>
          )}
          {shortcodeChatInject && !shortcodeParams.window && (
            <NekoMessage
              variant="danger"
              style={{ marginTop: 15, padding: '10px 15px' }}
            >
              <p>{i18n.SETTINGS.ALERT_INJECT_BUT_NO_POPUP}</p>
            </NekoMessage>
          )}
          {isFineTuned && !shortcodeParams.casuallyFineTuned && (
            <NekoMessage
              variant="danger"
              style={{ marginTop: 15, padding: '10px 15px' }}
            >
              <p>{i18n.SETTINGS.ALERT_FINETUNE_BUT_NO_CASUALLY}</p>
            </NekoMessage>
          )}
          {!isFineTuned && shortcodeParams.casuallyFineTuned && (
            <NekoMessage
              variant="danger"
              style={{ marginTop: 15, padding: '10px 15px' }}
            >
              <p>{i18n.SETTINGS.ALERT_CASUALLY_BUT_NO_FINETUNE}</p>
            </NekoMessage>
          )}
          {isContentAware && !contextHasContent && (
            <NekoMessage
              variant="danger"
              style={{ marginTop: 15, padding: '10px 15px' }}
            >
              <p>{toHTML(i18n.SETTINGS.ALERT_CONTENTAWARE_BUT_NO_CONTENT)}</p>
            </NekoMessage>
          )}
        </StyledBuilderForm>
      </NekoColumn>
    </NekoWrapper>
  </>);
};

export default ChatbotParams;