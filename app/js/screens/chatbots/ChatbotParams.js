// Previous: 1.3.90
// Current: 1.3.91

const { useMemo, useState, useEffect } = wp.element;

import { NekoInput, NekoBlock, 
  NekoSelect, NekoOption, NekoCheckbox, NekoWrapper, NekoMessage,
  NekoColumn, NekoTextArea } from '@neko-ui';

import { isRegistered } from '@app/settings';

import i18n from '@root/i18n';
import { OptionsCheck, toHTML, useModels } from '@app/helpers';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";

const ChatbotParams = (props) => {
  const { shortcodeParams, updateShortcodeParams, options } = props;
  const { completionModels, isFineTunedModel, getModel } = useModels(options);
  const [busy, setBusy] = useState(false);

  const pinecone = options?.pinecone || {};
  const shortcodeDefaultParams = options?.shortcode_chat_default_params;
  const shortcodeParamsOverride = options?.shortcode_chat_params_override;
  const shortcodeChatInject = options?.shortcode_chat_inject;
  const isChat = shortcodeParams?.mode === 'chat' ?? 'chat';
  const isImagesChat = shortcodeParams?.mode === 'images' ?? false;
  const indexes = pinecone.indexes || [];
  const isContentAware = shortcodeParams.content_aware;
  const contextHasContent = shortcodeParams.context && shortcodeParams.context.includes('{CONTENT}');
  const isFineTuned = isFineTunedModel(shortcodeParams.model);
  const currentModel = getModel(shortcodeParams.model);
  
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
    return '[mwai_chat' + (joinedParams ? ` ${joinedParams}` : '') + ']';
  }, [shortcodeParamsDiff]);

  useEffect(() => {
    if (shortcodeParams.mode === 'images') {
      // Potential unintended side effect: triggering re-render when mode is 'images'
      setTimeout(() => {
        updateShortcodeParams({ max_results: 5 });
      }, 50);
    }
  }, [shortcodeParams.mode]);

  return (<>
    <NekoWrapper>
      <NekoColumn minimal>

          <StyledBuilderForm>
            <h4 className="mwai-category" style={{ marginTop: 0 }}>{i18n.COMMON.MAIN_SETTINGS}</h4>

            <div className="mwai-builder-row">
              <div className="mwai-builder-col"
                style={{ height: shortcodeParams?.mode === 'chat' ? 76 : 'inherit' }}>
                <label>{i18n.COMMON.MODE}:</label>
                <NekoSelect scrolldown id="mode" name="mode"
                  value={shortcodeParams?.mode} onChange={(e) => updateShortcodeParams({ mode: e.target.value })}>
                  <NekoOption value="chat" label="Chat" />
                  <NekoOption value="images" label="Images" />
                </NekoSelect>
              </div>

              {isChat && <div className="mwai-builder-col" style={{ flex: 5 }}>
                <label>{i18n.COMMON.CONTEXT}:</label>
                <NekoTextArea id="context" name="context" rows={4}
                  value={shortcodeParams.context} onBlur={(e) => updateShortcodeParams({ context: e.target.value })} />
              </div>}

              {isImagesChat && <div className="mwai-builder-col" style={{ flex: 5 }}>
                <label>{i18n.COMMON.IMAGES_NUMBER}:</label>
                <NekoInput id="max_results" name="max_results" type="number"
                  value={shortcodeParams.max_results} onBlur={(e) => updateShortcodeParams({ max_results: parseInt(e.target.value) })} />
              </div>}

            </div>

            <h4 className="mwai-category">{i18n.COMMON.VISUAL_SETTINGS}</h4>

            <div className="mwai-builder-row">
              <div className="mwai-builder-col">
                <label>{i18n.COMMON.AI_NAME}:</label>
                <NekoInput id="ai_name" name="ai_name" data-form-type="other"
                  value={shortcodeParams.ai_name} onBlur={(e) => updateShortcodeParams({ ai_name: e.target.value })} />
              </div>
              <div className="mwai-builder-col" style={{ flex: 4 }}>
                <label>{i18n.COMMON.START_SENTENCE}:</label>
                <NekoInput id="start_sentence" name="start_sentence"
                  value={shortcodeParams.start_sentence} onBlur={(e) => updateShortcodeParams({ start_sentence: e.target.value })} />
              </div>
            </div>

            <div className="mwai-builder-row">

              <div className="mwai-builder-col">
                <label>{i18n.COMMON.USER_NAME}:</label>
                <NekoInput id="user_name" name="user_name" data-form-type="other"
                  value={shortcodeParams.user_name} onBlur={(e) => updateShortcodeParams({ user_name: e.target.value })} />
              </div>
              <div className="mwai-builder-col" style={{ flex: 2 }}>
                <label>{i18n.COMMON.PLACEHOLDER}:</label>
                <NekoInput id="text_input_placeholder" name="text_input_placeholder"
                  value={shortcodeParams.text_input_placeholder} onBlur={(e) => updateShortcodeParams({ text_input_placeholder: e.target.value })} />
              </div>
              <div className="mwai-builder-col">
                <label>{i18n.COMMON.SEND}:</label>
                <NekoInput id="text_send" name="text_send" value={shortcodeParams.text_send}
                  onBlur={(e) => updateShortcodeParams({ text_send: e.target.value })} />
              </div>
              <div className="mwai-builder-col">
                <label>{i18n.COMMON.CLEAR}:</label>
                <NekoInput id="text_clear" name="text_clear" value={shortcodeParams.text_clear}
                  disabled={!shortcodeParams.id}
                  onBlur={(e) => updateShortcodeParams({ text_clear: e.target.value })} />
              </div>
            </div>

            <div className="mwai-builder-row">

              <div className="mwai-builder-col" style={{ flex: 3 }}>
                <label>{i18n.COMMON.COMPLIANCE_TEXT}:</label>
                <NekoInput id="text_compliance" name="text_compliance"
                  value={shortcodeParams.text_compliance} onBlur={(e) => updateShortcodeParams({ text_compliance: e.target.value })} />
              </div>

            </div>

            <div className="mwai-builder-row">
              <div className="mwai-builder-col">
                <label>{i18n.COMMON.SYSTEM_NAME}:</label>
                <NekoInput id="sys_name" name="sys_name" data-form-type="other"
                  value={shortcodeParams.sys_name} onBlur={(e) => updateShortcodeParams({ sys_name: e.target.value })} />
              </div>
              <div className="mwai-builder-col">
                <div>
                  <label style={{ display: 'block' }}>{i18n.COMMON.ID}:</label>
                  <NekoInput id="id" name="id" type="text" placeholder="Optional"
                    value={shortcodeParams.id} onBlur={(e) => updateShortcodeParams({ id: e.target.value })} />
                </div>
              </div>
              <div className="mwai-builder-col" style={{ flex: 2 }}>
                <label>{i18n.COMMON.THEME}:</label>
                <NekoSelect scrolldown id="style" name="style"
                  value={shortcodeParams.style} description="" onChange={(e) => updateShortcodeParams({ style: e.target.value })}>
                  <NekoOption value='none' label="None" />
                  <NekoOption value='chatgpt' label="ChatGPT" />
                </NekoSelect>
              </div>
              <div className="mwai-builder-col">
                <label>{i18n.COMMON.POPUP}:</label>
                <NekoCheckbox name="window" label="Yes"
                  checked={shortcodeParams.window} value="1" onChange={(e) => updateShortcodeParams({ window: e.target.checked })} />
              </div>
            </div>

            <div className="mwai-builder-row">

              <div className="mwai-builder-col" style={{ flex: 2 }}>
                <label>{i18n.COMMON.POSITION}:</label>
                <NekoSelect scrolldown id="icon_position" name="icon_position" disabled={!shortcodeParams.window}
                  value={shortcodeParams.icon_position} onChange={(e) => updateShortcodeParams({ icon_position: e.target.value })}>
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
                  value={shortcodeParams.icon_text ?? 'Chat'} onBlur={(e) => updateShortcodeParams({ icon_text: e.target.value })} />
              </div>

              <div className="mwai-builder-col" style={{ flex: 1 }}>
                <label>{i18n.COMMON.FULL_SCREEN}:</label>
                <NekoCheckbox name="fullscreen" label="Yes"
                  checked={shortcodeParams.fullscreen} value="1" onChange={(e) => updateShortcodeParams({ fullscreen: e.target.checked })} />
              </div>

            </div>

            <h4 className="mwai-category">{i18n.COMMON.TECHNICAL_SETTINGS}</h4>

            {isChat && <div className="mwai-builder-row">
              <div className="mwai-builder-col" style={{ flex: 3 }}>
                <label>{i18n.COMMON.MODEL}:</label>
                <NekoSelect scrolldown id="model" name="model"
                  value={shortcodeParams.model} description="" onChange={(e) => updateShortcodeParams({ model: e.target.value })}>
                  {completionModels.map((x) => (
                    <NekoOption key={x.model} value={x.model} label={x.name}></NekoOption>
                  ))}
                </NekoSelect>
              </div>
              <div className="mwai-builder-col" style={{ flex: 2 }}>
                <label>{i18n.COMMON.CASUALLY_FINE_TUNED}:</label>
                <NekoCheckbox name="casually_fine_tuned" label="Yes"
                  disabled={!isFineTuned && !shortcodeParams.casually_fine_tuned}
                  checked={shortcodeParams.casually_fine_tuned} value="1" onChange={(e) => updateShortcodeParams({ casually_fine_tuned: e.target.checked }) }
                />
              </div>
              <div className="mwai-builder-col" style={{ flex: 1 }}>
                <label>{i18n.COMMON.TEMPERATURE}:</label>
                <NekoInput id="temperature" name="temperature" type="number"
                  step="0.1" min="0" max="1"
                  value={shortcodeParams.temperature} onBlur={(e) => updateShortcodeParams({ temperature: parseFloat(e.target.value) })} />
              </div>
            </div>}

            {isChat && <div className="mwai-builder-row">

              <div className="mwai-builder-col" style={{ flex: 1 }}>
                <label>{i18n.COMMON.MAX_TOKENS}:</label>
                <NekoInput id="max_tokens" name="max_tokens" type="number" min="10" max="2048"
                  value={shortcodeParams.max_tokens} onBlur={(e) => updateShortcodeParams({ max_tokens: parseInt(e.target.value) })} />
              </div>

              <div className="mwai-builder-col" style={{ flex: 1 }}>
                <label>{i18n.COMMON.SENTENCES_BUFFER}:</label>
                <NekoInput id="max_sentences" name="max_sentences"
                  step="1" min="1" max="512"
                  value={shortcodeParams.max_sentences} onBlur={(e) => updateShortcodeParams({ max_sentences: parseInt(e.target.value) })} />
              </div>

              <div className="mwai-builder-col" style={{ flex: 1 }}>
                <label>{i18n.COMMON.INPUT_MAXLENGTH}:</label>
                <NekoInput id="text_input_maxlength" name="text_input_maxlength"
                  step="1" min="1" max="512"
                  value={shortcodeParams.text_input_maxlength} onBlur={(e) => updateShortcodeParams({ text_input_maxlength: parseInt(e.target.value) })} />
              </div>

            </div>}

            {isChat && <div className="mwai-builder-row">

              <div className="mwai-builder-col">
                <label>{i18n.COMMON.EMBEDDINGS_INDEX}:</label>
                <NekoSelect scrolldown id="embeddings_index" name="embeddings_index"
                  requirePro={true} isPro={isRegistered}
                  disabled={!indexes?.length || currentModel?.mode !== 'chat'}
                  value={shortcodeParams.embeddings_index} onChange={(e) => updateShortcodeParams({ embeddings_index: e.target.value })}>
                  {indexes.map((x) => (
                    <NekoOption key={x.name} value={x.name} label={x.name}></NekoOption>
                  ))}
                  <NekoOption value={""} label={"Disabled"}></NekoOption>
                </NekoSelect>
              </div>

              <div className="mwai-builder-col">
                <label>{i18n.COMMON.CONTENT_AWARE}:</label>
                <NekoCheckbox name="content_aware" label="Yes"
                  requirePro={true} isPro={isRegistered}
                  checked={shortcodeParams.content_aware} value="1" onChange={(e) => updateShortcodeParams({ content_aware: e.target.checked })} />
              </div>

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

            <h4 className="mwai-category">{i18n.COMMON.SHORTCODE}</h4>

            <pre>
              {builtShortcode}
            </pre>

          </StyledBuilderForm>

      </NekoColumn>
    </NekoWrapper>
  </>);
};

export default ChatbotParams;