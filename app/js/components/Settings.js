// Previous: 0.1.9
// Current: 0.2.0

const { useState } = wp.element;

import { NekoButton, NekoInput, NekoTypo, NekoPage, NekoBlock, NekoHeader, NekoContainer, NekoSettings,
  NekoTabs, NekoTab, NekoCheckboxGroup, NekoCheckbox, NekoWrapper, NekoColumn } from '@neko-ui';
import { postFetch } from '@neko-ui';

import { apiUrl, restNonce, options as defaultOptions } from '@app/settings';
import { OpenAI_PricingPerModel } from '../constants';
import { OptionsCheck } from '../helpers';
import { AiNekoHeader } from './CommonStyles';

const isImageModel = (model) => {
  return model === "dall-e";
}

const Settings = () => {
  const [ options, setOptions ] = useState(defaultOptions);
  const [ busyAction, setBusyAction ] = useState(false);
  const busy = busyAction;

  const module_titles = options?.module_titles;
  const module_excerpts = options?.module_excerpts;
  const module_blocks = options?.module_blocks;
  const shortcode_chat = options?.shortcode_chat;
  const shortcode_chat_style = options?.shortcode_chat_style;
  const shortcode_chat_formatting = options?.shortcode_chat_formatting;
  const openai_apikey = options?.openai_apikey ? options?.openai_apikey : '';
  const openai_usage = options?.openai_usage;
  const extra_models = options?.extra_models;

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

  const jsxAiFeatures =
    <NekoSettings title="Assistants">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="module_titles" label="Titles" value="1" checked={module_titles}
          description="Create a choice of titles based on your content."
          onChange={(value) => updateOption(value, 'module_titles')} />
        <NekoCheckbox id="module_excerpts" label="Excerpt" value="1" checked={module_excerpts}
        description="Create a choice of excerpts based on your content."
          onChange={(value) => updateOption(value, 'module_excerpts')} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxAiBlocks = 
    <NekoSettings title="Blocks">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="module_blocks" label="Enable (Coming soon)" disabled={true} value="1" checked={module_blocks}
          description="Add Gutenberg AI Blocks in the editor. They will allow you to easily create content with AI."
          onChange={(value) => updateOption(value, 'module_blocks')} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxShortcodes =
    <NekoSettings title="Shortcodes">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="shortcode_chat" label="Chatbot" value="1" checked={shortcode_chat}
          description={<>
            Create a chatbot similar to ChatGPT with a shortcode:<br /><br />
            [mwai_chat context="Converse as if you were Michael Jackson, talking from the afterlife." ai_name="Michael: " user_name="You: " start_sentence="Hi, my friend."]<br /><br />
            You can also add temperature (between 0 and 1, default is 0.8) and a model (default is text-davinci-003, but you can try text-babbage-001 and the others).
          </>}
          onChange={(value) => updateOption(value, 'shortcode_chat')} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxShortcodeStyle =
    <NekoSettings title="Styles">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="shortcode_chat_style" label="Enable" value="1" checked={shortcode_chat_style}
          description="The chatbot will look like a bit similar to ChatGPT."
          onChange={(value) => updateOption(value, 'shortcode_chat_style')} />  
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxShortcodeFormatting =
    <NekoSettings title="Formatting">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="shortcode_chat_formatting" label="Enable" value="1" checked={shortcode_chat_formatting}
          description={<>Convert the reply from the AI into HTML.<br /><b>Markdown is supported, so it is highly recommended to add 'Use Markdown.' in your context.</b></>}
          onChange={(value) => updateOption(value, 'shortcode_chat_formatting')} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxExtraModels =
    <NekoSettings title="Extra Models">
      <NekoInput id="extra_models" name="extra_models" value={extra_models}
        description={<>You can enter additional models you would like to use (separated by a comma), including your fine-tuned models. This option is beta and will be modified/enhanced later.</>} onBlur={(value) => updateOption(value, 'extra_models')} />
    </NekoSettings>;

  const jsxOpenAiApiKey =
    <NekoSettings title="API Key">
      <NekoInput id="openai_apikey" name="openai_apikey" value={openai_apikey}
        description={<>You can get your API Keys in your <a href="https://beta.openai.com/account/api-keys" target="_blank">OpenAI Account</a>.</>} onBlur={(value) => updateOption(value, 'openai_apikey')} />
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
                  {Object.keys(monthUsage).map((model, idx) => {
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
                      <li key={idx} style={{ marginTop: 10, marginLeft: 10 }}>
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
                            {/* <li>Prompt Tokens: {modelUsage.prompt_tokens}</li>
                            <li>Completion Tokens: {modelUsage.completion_tokens}</li> */}
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
              Boost your WordPress with AI! Currently, it only proposes titles and excerpts for your posts, and keep track of your OpenAI usage statistics. There is also a Playground which allows you to have a discussion with the AI, or ask it to complete some tasks. Little by little, and through your feedback, many tools will be added to AI Engine, and an API will be available so that other plugins can use it.
            </NekoTypo>
          </NekoContainer>

          <NekoTabs>

            <NekoTab title='Settings'>
              <NekoWrapper>

                <NekoColumn minimal>
                  <NekoBlock busy={busy} title="Modules" className="primary">
                    {jsxAiFeatures}
                    {jsxAiBlocks}
                    {jsxShortcodes}
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

            {shortcode_chat && <NekoTab title='Chatbot'>
              <NekoWrapper>

                <NekoColumn minimal>
                  <NekoBlock busy={busy} title="Chatbot" className="primary">
                    {jsxShortcodeStyle}
                    {jsxShortcodeFormatting}
                  </NekoBlock>
                </NekoColumn>

              </NekoWrapper>
            </NekoTab>}


          </NekoTabs>

        </NekoColumn>

      </NekoWrapper>

    </NekoPage>
  );
};

export default Settings;