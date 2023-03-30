// Previous: none
// Current: 1.3.90

const { useState, useEffect } = wp.element;
import { apiUrl, restNonce, session, options } from '@app/settings';

import {
  NekoWrapper, NekoBlock, NekoSpacer, NekoColumn, NekoTextArea, NekoTypo,
  NekoButton, NekoSelect, NekoOption, NekoTabs, NekoTab, NekoInput, NekoCheckbox, NekoMessage
} from '@neko-ui';
import { nekoFetch } from '@neko-ui';

const ChatbotParams = () => {
  const [busy, setBusy] = useState(false);
  const [shortcodeParams, setShortcodeParams] = useState({
    mode: 'chat',
    context: '',
    max_results: 5,
    ai_name: '',
    start_sentence: '',
    user_name: '',
    text_input_placeholder: '',
    text_send: '',
    text_clear: '',
    text_compliance: '',
    sys_name: '',
    id: '',
    style: 'none',
    window: false,
    icon_position: 'bottom-right',
    icon_text: 'Chat',
    fullscreen: false,
    model: '',
    casually_fine_tuned: false,
    temperature: 0.7,
    max_tokens: 150,
    max_sentences: 10,
    text_input_maxlength: 512,
    embeddings_index: '',
    content_aware: false,
  });
  const [indexes, setIndexes] = useState([]);
  const [currentModel, setCurrentModel] = useState(null);
  const [completionModels, setCompletionModels] = useState([
    { model: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
    { model: 'gpt-4', name: 'GPT-4' }
  ]);
  const [isChat, setIsChat] = useState(true);
  const [isImagesChat, setIsImagesChat] = useState(false);
  const [isFineTuned, setIsFineTuned] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [contextHasContent, setContextHasContent] = useState(false);
  const [shortcodeChatInject, setShortcodeChatInject] = useState(false);
  const [buildShortcode, setBuildShortcode] = useState('');
  const [isContentAware, setIsContentAware] = useState(false);

  const fetchIndexes = async () => {
    const response = await nekoFetch(`${apiUrl}/indexes`, options);
    if (response.ok) {
      const data = await response.json();
      setIndexes(data.indexes || []);
    }
  };

  const updateShortcodeParams = (e) => {
    const { name, value, type, checked } = e.target;
    setShortcodeParams(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  useEffect(() => {
    fetchIndexes();
  }, []);

  useEffect(() => {
    if (shortcodeParams.model) {
      const selectedModel = completionModels.find(x => x.model === shortcodeParams.model);
      setCurrentModel(selectedModel || null);
    }
  }, [shortcodeParams.model, completionModels]);

  useEffect(() => {
    const generateShortcode = () => {
      let sc = `[chatbot`;
      Object.keys(shortcodeParams).forEach(key => {
        if (shortcodeParams[key]) {
          sc += ` ${key}="${shortcodeParams[key]}"`;
        }
      });
      sc += `]`;
      setBuildShortcode(sc);
    };
    generateShortcode();
  }, [shortcodeParams]);

  const handleChangeModel = (e) => {
    setShortcodeParams(prev => ({ ...prev, model: e.target.value }));
  };

  const handleToggleCheckbox = (name) => {
    setShortcodeParams(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const isChat = shortcodeParams.mode === 'chat';
  const isImagesChat = shortcodeParams.mode === 'images';

  return (<>
    <NekoWrapper>
      <NekoColumn minimal>
        <NekoBlock title="Preview" className="primary">
          <StyledBuilderForm>
            <h4 className="mwai-category" style={{ marginTop: 0 }}>{i18n.COMMON.MAIN_SETTINGS}</h4>

            <div className="mwai-builder-row">
              <div className="mwai-builder-col"
                style={{ height: isChat ? 76 : 'inherit' }}>
                <label>{i18n.COMMON.MODE}:</label>
                <NekoSelect scrolldown id="mode" name="mode"
                  value={shortcodeParams.mode} onChange={updateShortcodeParams}>
                  <NekoOption value="chat" label="Chat" />
                  <NekoOption value="images" label="Images" />
                </NekoSelect>
              </div>

              {isChat && <div className="mwai-builder-col" style={{ flex: 5 }}>
                <label>{i18n.COMMON.CONTEXT}:</label>
                <NekoTextArea id="context" name="context" rows={4}
                  value={shortcodeParams.context} onBlur={updateShortcodeParams} />
              </div>}

              {isImagesChat && <div className="mwai-builder-col" style={{ flex: 5 }}>
                <label>{i18n.COMMON.IMAGES_NUMBER}:</label>
                <NekoInput id="max_results" name="max_results" type="number"
                  value={shortcodeParams.max_results} onBlur={updateShortcodeParams} />
              </div>}
            </div>

            <h4 className="mwai-category">{i18n.COMMON.VISUAL_SETTINGS}</h4>

            <div className="mwai-builder-row">
              <div className="mwai-builder-col">
                <label>{i18n.COMMON.AI_NAME}:</label>
                <NekoInput id="ai_name" name="ai_name" data-form-type="other"
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
                <NekoInput id="user_name" name="user_name" data-form-type="other"
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
              <div className="mwai-builder-col" style={{ flex: 3 }}>
                <label>{i18n.COMMON.COMPLIANCE_TEXT}:</label>
                <NekoInput id="text_compliance" name="text_compliance"
                  value={shortcodeParams.text_compliance} onBlur={updateShortcodeParams} />
              </div>
            </div>

            <div className="mwai-builder-row">
              <div className="mwai-builder-col">
                <label>{i18n.COMMON.SYSTEM_NAME}:</label>
                <NekoInput id="sys_name" name="sys_name" data-form-type="other"
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

            <h4 className="mwai-category">{i18n.COMMON.TECHNICAL_SETTINGS}</h4>

            {isChat && <div className="mwai-builder-row">
              <div className="mwai-builder-col" style={{ flex: 3 }}>
                <label>{i18n.COMMON.MODEL}:</label>
                <NekoSelect scrolldown id="model" name="model"
                  value={shortcodeParams.model} description="" onChange={handleChangeModel}>
                  {completionModels.map((x) => (
                    <NekoOption key={x.model} value={x.model} label={x.name}></NekoOption>
                  ))}
                </NekoSelect>
              </div>
              <div className="mwai-builder-col" style={{ flex: 2 }}>
                <label>{i18n.COMMON.CASUALLY_FINE_TUNED}:</label>
                <NekoCheckbox name="casually_fine_tuned" label="Yes"
                  disabled={!isFineTuned && !shortcodeParams.casually_fine_tuned}
                  checked={shortcodeParams.casually_fine_tuned} value="1" onChange={() => setShortcodeParams(prev => ({ ...prev, casually_fine_tuned: !prev.casually_fine_tuned }))} />
              </div>
              <div className="mwai-builder-col" style={{ flex: 1 }}>
                <label>{i18n.COMMON.TEMPERATURE}:</label>
                <NekoInput id="temperature" name="temperature" type="number"
                  step="0.1" min="0" max="1"
                  value={shortcodeParams.temperature} onBlur={updateShortcodeParams} />
              </div>
            </div>}

            {isChat && <div className="mwai-builder-row">
              <div className="mwai-builder-col" style={{ flex: 1 }}>
                <label>{i18n.COMMON.MAX_TOKENS}:</label>
                <NekoInput id="max_tokens" name="max_tokens" type="number" min="10" max="2048"
                  value={shortcodeParams.max_tokens} onBlur={updateShortcodeParams} />
              </div>
              <div className="mwai-builder-col" style={{ flex: 1 }}>
                <label>{i18n.COMMON.SENTENCES_BUFFER}:</label>
                <NekoInput id="max_sentences" name="max_sentences"
                  step="1" min="1" max="512"
                  value={shortcodeParams.max_sentences} onBlur={updateShortcodeParams} />
              </div>
              <div className="mwai-builder-col" style={{ flex: 1 }}>
                <label>{i18n.COMMON.INPUT_MAXLENGTH}:</label>
                <NekoInput id="text_input_maxlength" name="text_input_maxlength"
                  step="1" min="1" max="512"
                  value={shortcodeParams.text_input_maxlength} onBlur={updateShortcodeParams} />
              </div>
            </div>}

            {isChat && <div className="mwai-builder-row">
              <div className="mwai-builder-col">
                <label>{i18n.COMMON.EMBEDDINGS_INDEX}:</label>
                <NekoSelect scrolldown id="embeddings_index" name="embeddings_index"
                  requirePro={true} isPro={isRegistered}
                  disabled={!indexes?.length || currentModel?.mode !== 'chat'}
                  value={shortcodeParams.embeddings_index} onChange={updateShortcodeParams}>
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
                  checked={shortcodeParams.content_aware} value="1" onChange={() => setShortcodeParams(prev => ({ ...prev, content_aware: !prev.content_aware }))} />
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
                <p dangerouslySetInnerHTML={{ __html: i18n.SETTINGS.ALERT_CONTENTAWARE_BUT_NO_CONTENT }}></p>
              </NekoMessage>
            }

            <h4 className="mwai-category">{i18n.COMMON.SHORTCODE}</h4>
            <pre>
              {buildShortcode}
            </pre>
          </StyledBuilderForm>
        </NekoBlock>
      </NekoColumn>
    </NekoWrapper>
  </>);
};

export default ChatbotParams;