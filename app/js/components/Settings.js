// Previous: 0.2.5
// Current: 0.2.7

const { useMemo, useState } = wp.element;
import Styled from "styled-components";

import { NekoButton, NekoInput, NekoTypo, NekoPage, NekoBlock, NekoContainer, NekoSettings,
  NekoSelect, NekoOption, NekoSpacer,
  NekoTabs, NekoTab, NekoCheckboxGroup, NekoCheckbox, NekoWrapper, NekoColumn } from '@neko-ui';
import { postFetch } from '@neko-ui';

import { apiUrl, restNonce, options as defaultOptions } from '@app/settings';
import { OpenAI_PricingPerModel } from '../constants';
import { OptionsCheck, useModels } from '../helpers';
import { AiNekoHeader } from './CommonStyles';
import FineTuning from './FineTuning';

const isImageModel = (model) => {
  return model === "dall-e";
}

const StyledBuilderForm = Styled.div`
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 3px;
  }

  .mwai-builder-row {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .mwai-builder-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-right: 5px;
  }

  .mwai-builder-col:last-child {
    margin-right: 0;
  }

  pre {
    white-space: pre-wrap;
    background: #d4f0ff;
    color: #037cba;
    padding: 10px;
    font-size: 13px;
    font-weight: bold;
    margin: 20px 0;
  }

  .neko-spacer {
    margin-bottom: 0 !important;
  }

  .neko-input {
    border: 1.5px solid #eaeaea !important;
    background: #fbfbfb !important;
  }

  .nui-select-option {
    border: 1.5px solid #eaeaea !important;
    background: #fbfbfb !important;
  }

  .nui-checkbox {
    margin: -6px 0px -2px 0px;
  }
`;

const Settings = () => {
  const [ options, setOptions ] = useState(defaultOptions);
  const [ busyAction, setBusyAction ] = useState(false);
  const { models } = useModels(options);
  const shortcodeDefaultParams = options?.shortcode_chat_default_params;
  const shortcodeParams = options?.shortcode_chat_params;
  const shortcodeParamsOverride = options?.shortcode_chat_params_override;
  const shortcodeChatInject = options?.shortcode_chat_inject;
  const module_titles = options?.module_titles;
  const module_excerpts = options?.module_excerpts;
  const module_blocks = options?.module_blocks;
  const shortcode_chat = options?.shortcode_chat;
  const shortcode_chat_formatting = options?.shortcode_chat_formatting;
  const shortcode_imagesbot = options?.shortcode_imagesbot;
  const openai_apikey = options?.openai_apikey ? options?.openai_apikey : '';
  const openai_usage = options?.openai_usage;
  const extra_models = options?.extra_models;
  const shortcode_chat_syntax_highlighting = options?.shortcode_chat_syntax_highlighting;

  const busy = busyAction;
  const shortcodeParamsDiff = useMemo(() => {
    const diff = {};
    for (const key in shortcodeDefaultParams) {
      diff[key] = shortcodeDefaultParams[key] !== shortcodeParams[key];
    }
    return diff;
  }, [shortcodeDefaultParams, shortcodeParams]);

  const builtShortcode = useMemo(() => {
    const params = [];
    for (const key in shortcodeParams) {
      if (shortcodeParams[key] !== shortcodeDefaultParams[key]) {
        params.push(`${key}="${shortcodeParams[key]}"`);
      }
    }
    const joinedParams = params.join(' ');
    return '[mwai_chat' + (joinedParams ? ` ${joinedParams}` : '') + ']';
  }, [shortcodeDefaultParams, shortcodeParams]);

  console.log({ shortcodeDefaultParams, shortcodeParams, shortcodeParamsDiff });

  const updateOption = async (value, id) => {
    const newOptions = { ...options, [id]: value };
    setBusyAction(true);
    try {
      const response = await postFetch(`${apiUrl}/update_option`, { 
        json: { options: newOptions }, nonce: restNonce
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

  const onResetShortcodeParams = async () => {
    await updateOption(shortcodeDefaultParams, 'shortcode_chat_params');
  }

  const jsxAiFeatures =
    <NekoSettings title="Assistants">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="module_titles" label="Titles" value="1" checked={module_titles}
          description="Suggest a few titles based on your content."
          onChange={updateOption} />
        <NekoCheckbox id="module_excerpts" label="Excerpt" value="1" checked={module_excerpts}
        description="Suggest a few excerpts based on your content."
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxAiBlocks = 
    <NekoSettings title="Blocks">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="module_blocks" label="Enable" disabled={true} value="1" checked={module_blocks}
          description="Add Gutenberg AI Blocks in the editor. Let me know what you would like to have :)"
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxChatbot =
    <NekoSettings title="Chatbots">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="shortcode_chat" label="Enable" value="1" checked={shortcode_chat}
          description="A chatbot similar to ChatGPT. Check the Chatbot tab."
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>
   ;

  const jsxImagesBot =
    <NekoSettings title="ImagesBots">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="shortcode_imagesbot" label="Enable" value="1" checked={shortcode_imagesbot}
          description={"A special chatbot specialized in creating images."}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxShortcodeFormatting =
    <NekoSettings title="Formatting">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="shortcode_chat_formatting" label="Enable" value="1" checked={shortcode_chat_formatting}
          description={<>Convert the reply from the AI into HTML.<br /><b>Markdown is supported, so it is highly recommended to add 'Use Markdown.' in your context.</b></>}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxShortcodeSyntaxHighlighting =
    <NekoSettings title="Code">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="shortcode_chat_syntax_highlighting" label="Use Syntax Highlighting" value="1" checked={shortcode_chat_syntax_highlighting}
          description={<>Add syntax coloring to the code written by the chatbot.</>}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxExtraModels =
    <NekoSettings title="Extra Models">
      <NekoInput id="extra_models" name="extra_models" value={extra_models}
        description={<>You can enter additional models you would like to use (separated by a comma). Note that your fine-tuned models are already available.</>} onBlur={updateOption} />
    </NekoSettings>;

  const jsxOpenAiApiKey =
    <NekoSettings title="API Key">
      <NekoInput id="openai_apikey" name="openai_apikey" value={openai_apikey}
        description={<>You can get your API Keys in your <a href="https://beta.openai.com/account/api-keys" target="_blank">OpenAI Account</a>.</>} onBlur={updateOption} />
    </NekoSettings>;

  const jsxOpenAiUsage =
    <NekoSettings title="Usage">
      {!Object.keys(openai_usage).length && <NekoTypo p>N/A</NekoTypo>}
      {openai_usage && <>
        <ul style={{ marginTop: 2 }}>
          {Object.keys(openai_usage).map((month, index) => {
            const monthUsage = openai_usage[month];
            return (
              <li key={index}>
                <strong>🗓️ {month}</strong>
                <ul>
                  {Object.keys(monthUsage).map((model, index2) => { // changed variable name to index2
                    const modelUsage = monthUsage[model];
                    let price = null;
                    let modelPrice = OpenAI_PricingPerModel.find(x => model.includes(x.model));
                    if (modelPrice) {
                      if (isImageModel(model)) {
                        price = (modelUsage.images * modelPrice.price).toFixed(2);
                      }
                      else {
                        price = (modelUsage.total_tokens / 1000 * modelPrice.price).toFixed(2);
                      }
                    }
                    return (
                      <li key={index2} style={{ marginTop: 10, marginLeft: 10 }}>
                        {isImageModel(model) && <>
                          <strong>• Model: {model}</strong>
                          <ul style={{ marginTop: 5, marginLeft: 5 }}>
                            <li>
                              💰 Images:&nbsp;
                              <b>{modelUsage.images}</b> {price && <> = <b>{price}$</b></>}</li>
                          </ul>
                        </>}
                        {!isImageModel(model) && <>
                          <strong>• Model: {model}</strong>
                          <ul style={{ marginTop: 5, marginLeft: 5 }}>
                            <li>
                              💰 Tokens:&nbsp;
                              <b>{modelUsage.total_tokens}</b> {price && <> = <b>{price}$</b></>}</li>
                          </ul>
                        </>}
                      </li>
                    )
                  })}
                </ul>
              </li>
            )
          })}
        </ul>
      </>}
      <p style={{ fontSize: 12, color: '#A0A0A0' }}>
        This is only given as an indication. For the exact amounts, please check your <a href="https://beta.openai.com/account/usage" target="_blank">Usage at OpenAI</a>.
      </p>
    </NekoSettings>;

  return (
    <NekoPage>

      <AiNekoHeader />

      <NekoWrapper>

        <OptionsCheck options={options} />

        <NekoColumn full>

          <NekoContainer>
            <NekoTypo p>
              Boost your WordPress with AI! Don't forget to visit the <a href="https://meowapps.com/ai-engine/" target="_blank">AI Engine website</a> for more information. Have fun! 🎵
            </NekoTypo>
          </NekoContainer>

          <NekoTabs keepTabOnReload={true}>

            <NekoTab title='Settings'>
              <NekoWrapper>

                <NekoColumn minimal>
                  <NekoBlock busy={busy} title="Modules" className="primary">
                    {jsxChatbot}
                    {jsxImagesBot}
                    {jsxAiFeatures}
                    {jsxAiBlocks}
                  </NekoBlock>

                  <NekoBlock busy={busy} title="Advanced" className="primary">
                    {jsxExtraModels}
                  </NekoBlock>
                </NekoColumn>

                <NekoColumn minimal>
                  <NekoBlock busy={busy} title="Open AI" className="primary">
                    {jsxOpenAiApiKey}
                    {jsxOpenAiUsage}
                  </NekoBlock>
                </NekoColumn>

              </NekoWrapper>
            </NekoTab>

            {(shortcode_chat) && <NekoTab title='Chatbot'>
              <NekoWrapper>

                <NekoColumn minimal>
                  <NekoBlock busy={busy} title="Features" className="primary">
                    {jsxShortcodeFormatting}
                    {jsxShortcodeSyntaxHighlighting}
                  </NekoBlock>

                  <NekoBlock className="primary">
                    <NekoTypo p>
                      You can create a chatbot by using this shortcode anywhere on your website: <br /><br />
                      <b>[mwai_chat context="Converse as if you were Michael Jackson, talking from the afterlife." ai_name="Michael: " user_name="You: " start_sentence="Hi, my friend."]</b><br /><br />You can specify various parameters, such as the temperature and the model. You can also use the shortcode builder! 🎵 There are default parameters set automatically, so don't hesitate to try the shortcode [mwai_chat] by itself.
                    </NekoTypo>
                  </NekoBlock>
                </NekoColumn>

                <NekoColumn minimal>
                  <NekoBlock busy={busy} title="Chatbot Shortcode Builder" className="primary" action={
                    <NekoButton className="danger" onClick={onResetShortcodeParams}>
                      Reset Parameters
                    </NekoButton>}>
                  
                    <p>
                      Generate shortcodes here and paste them anywhere on your website! If you choose to "Set as Default Parameters", the parameters you set here will be used by default (but overridable in the shortcode). You can also choose to inject this set of parameters directly on your whole website, if you only need one chatbot.
                    </p>

                    <StyledBuilderForm>

                      <label>Context:</label>
                      <NekoInput id="context" name="context"
                        value={shortcodeParams.context} onBlur={updateShortcodeParams} />

                      
                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col">
                          <label>AI Name:</label>
                          <NekoInput id="ai_name" name="ai_name"
                            value={shortcodeParams.ai_name} onBlur={updateShortcodeParams} />
                        </div>
                        <div className="mwai-builder-col">
                          <label>User Name:</label>
                          <NekoInput id="user_name" name="user_name"
                            value={shortcodeParams.user_name} onBlur={updateShortcodeParams} />
                        </div>
                        <div className="mwai-builder-col">
                          <label>System Name:</label>
                          <NekoInput id="sys_name" name="sys_name"
                            value={shortcodeParams.sys_name} onBlur={updateShortcodeParams} />
                        </div>
                      </div>
                      
                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col">
                          <label>Start Sentence ({shortcodeParams.ai_name}):</label>
                          <NekoInput id="start_sentence" name="start_sentence"
                            value={shortcodeParams.start_sentence} onBlur={updateShortcodeParams} />
                        </div>
                      </div>
                      
                      <NekoSpacer height={20} line={true} />

                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col">
                          <label>Input placeholder:</label>
                          <NekoInput id="text_input_placeholder" name="text_input_placeholder"
                            value={shortcodeParams.text_input_placeholder} onBlur={updateShortcodeParams} />
                        </div>
                        <div className="mwai-builder-col">
                          <label>Button text:</label>
                          <NekoInput id="text_send" name="text_send" value={shortcodeParams.text_send}
                            onBlur={updateShortcodeParams} />
                        </div>
                      </div>

                      <NekoSpacer height={20} line={true} />

                      <div className="mwai-builder-row">
                        <div style={{ width: 40, flex: 'inherit' }}>
                          <label>Style:</label>
                        </div>
                        <div className="mwai-builder-col">
                        <NekoSelect scrolldown id="style" name="style"
                          value={shortcodeParams.style} description="" onChange={updateShortcodeParams}>
                          <NekoOption key='none' id='none' value='none' label="None" />
                          <NekoOption key='chatgpt' id='chatgpt' value='chatgpt' label="ChatGPT" />
                        </NekoSelect>
                        </div>
                        <div className="mwai-builder-col">
                        <NekoCheckbox id="window" label="Window (Popup Mode)"
                          checked={shortcodeParams.window} value="1" onChange={updateShortcodeParams} />
                        </div>
                      </div>

                      <NekoSpacer height={20} line={true} />

                      
                      <div className="mwai-builder-row">

                        <div className="mwai-builder-col" style={{ flex: 2 }}>
                          <label>Model:</label>
                          <NekoSelect scrolldown id="model" name="model"
                            value={shortcodeParams.model} description="" onChange={updateShortcodeParams}>
                            {models.map((x) => (
                              <NekoOption value={x.id} label={x.name}></NekoOption>
                            ))}
                          </NekoSelect>
                        </div>
                        
                        <div className="mwai-builder-col">
                          <label>Max Tokens:</label>
                          <NekoInput id="max_tokens" name="max_tokens" type="number"
                            value={shortcodeParams.max_tokens} onBlur={updateShortcodeParams} />
                        </div>

                        <div className="mwai-builder-col">
                          <label>Temperature:</label>
                          <NekoInput id="temperature" name="temperature" type="number"
                            step="0.1" min="0" max="1"
                            value={shortcodeParams.temperature} onBlur={updateShortcodeParams} />
                        </div>

                        <div className="mwai-builder-col" style={{ flex: 2 }}>
                          <label>Casually Fine Tuned:</label>
                          <NekoCheckbox id="casually_fined_tuned" label="Yes"
                            checked={shortcodeParams.casually_fined_tuned} value="1" onChange={updateShortcodeParams}
                          />
                        </div>

                      </div>
                      <pre>
                        {builtShortcode}
                      </pre>

                    </StyledBuilderForm>

                    <NekoCheckbox id="shortcode_chat_params_override" label="Set as Default Parameters"
                      value="1" checked={shortcodeParamsOverride}
                      description="The parameters set above will be used by default. If you are using 'Window (Popup Mode)' and many chatbots on the same page, be careful, as they will probably appear on top of each other."
                      onChange={updateOption} />

                    <NekoCheckbox id="shortcode_chat_inject" label="Inject this chatbot on this website"
                      value="1" checked={shortcodeChatInject}
                      description={<><span>Inject the chatbot automatically on your website. It will be available on every page.</span>{shortcodeParams.window ? '' : <span>It's highly recommended to enable 'Window (Popup Mode)'</span>}</>}
                      onChange={updateOption} />

                  </NekoBlock>
                </NekoColumn>

              </NekoWrapper>
            </NekoTab>}

            {(shortcode_chat || shortcode_imagesbot) && <NekoTab title='ImagesBot'>
              <NekoWrapper>
                <NekoColumn minimal>
                  <NekoBlock className="primary">
                    <NekoTypo p>
                    Just like the chatbot, you can create an ImagesBot by using this shortcode anywhere on your website: <br /><br />
                    <b>[mwai_imagesbot ai_name="AI: " user_name="You: " start_sentence="Hey there! Can you tell me what kind of images you need?" max_results="6"]</b><br /><br />There are no options yet for this shortcode, styles are automatically applied.
                    </NekoTypo>
                  </NekoBlock>
                </NekoColumn>
              </NekoWrapper>
            </NekoTab>}

            <NekoTab title='Fine Tuning: Train your AI'>
              <FineTuning options={options} updateOption={updateOption} />
            </NekoTab>

          </NekoTabs>

        </NekoColumn>

      </NekoWrapper>

    </NekoPage>
  );
};

export default Settings;