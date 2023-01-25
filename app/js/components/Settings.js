// Previous: 0.4.4
// Current: 0.4.5

const { useMemo, useState } = wp.element;
import { HexColorPicker } from "react-colorful";

import { NekoButton, NekoInput, NekoTypo, NekoPage, NekoBlock, NekoContainer, NekoSettings,
  NekoSelect, NekoOption, NekoTabs, NekoTab, NekoCheckboxGroup, NekoCheckbox, NekoWrapper,
  NekoColumn } from '@neko-ui';
import { nekoFetch } from '@neko-ui';

import { LicenseBlock } from '@common';
import { apiUrl, prefix, domain, isRegistered, isPro, restNonce, pricing,
  options as defaultOptions } from '@app/settings';

import { OptionsCheck, useModels } from '../helpers';
import { AiNekoHeader } from './CommonStyles';
import FineTuning from './FineTuning';
import { StyledBuilderForm } from "./styles/StyledSidebar";
import { NekoColorPicker } from "./NekoColorPicker";

const Settings = () => {
  const [ options, setOptions ] = useState(defaultOptions);
  const [ busyAction, setBusyAction ] = useState(false);
  const { models } = useModels(options);
  const shortcodeDefaultParams = options?.shortcode_chat_default_params;
  const shortcodeParams = options?.shortcode_chat_params;
  const shortcodeStyles = options?.shortcode_chat_styles;
  const shortcodeParamsOverride = options?.shortcode_chat_params_override;
  const shortcodeChatInject = options?.shortcode_chat_inject;
  const module_titles = options?.module_titles;
  const module_excerpts = options?.module_excerpts;
  const module_blocks = options?.module_blocks;
  const module_statistics = options?.module_statistics;
  const shortcode_chat = options?.shortcode_chat;
  const shortcode_chat_formatting = options?.shortcode_chat_formatting;
  const openai_apikey = options?.openai_apikey ? options?.openai_apikey : '';
  const openai_usage = options?.openai_usage;
  const shortcode_chat_syntax_highlighting = options?.shortcode_chat_syntax_highlighting;
  const extra_models = options?.extra_models;
  const isChat = shortcodeParams.mode === 'chat';
  const isImagesChat = shortcodeParams.mode === 'images';

  const busy = busyAction;
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
      delete diff.casually_fined_tuned;
      delete diff.model;
      delete diff.max_tokens;
      delete diff.temperature;
    }
    return diff;
  }, [shortcodeParamsOverride, shortcodeDefaultParams, shortcodeParams]);

  const builtShortcode = useMemo(() => {
    const params = [];
    for (const key in shortcodeParamsDiff) {
      params.push(`${key}="${shortcodeParams[key]}"`);
    }
    const joinedParams = params.join(' ');
    return '[mwai_chat' + (joinedParams ? ` ${joinedParams}` : '') + ']';
  }, [shortcodeParamsDiff, shortcodeParams]);

  const updateOption = async (value, id) => {
    const newOptions = { ...options, [id]: value };
    setBusyAction(true);
    try {
      const response = await nekoFetch(`${apiUrl}/update_option`, { 
        method: 'POST',
        nonce: restNonce,
        json: { 
          options: newOptions
        }
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

  const updateShortcodeColors = async (value, id) => {
    if (value) {
      const newColors = { ...shortcodeStyles, [id]: value };
      await updateOption(newColors, 'shortcode_chat_styles');
    }
  }

  const onResetShortcodeStyles = async () => {
    await updateOption({}, 'shortcode_chat_styles');
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
          description="AI Forms, and others. Not available yet."
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxStatistics = 
  <NekoSettings title="Statistics">
    <NekoCheckbox id="module_statistics" label="Enable" value="1"
      checked={module_statistics} requirePro={true} isPro={isRegistered}
      description="Track interaction with the AI based on the user, session, type, price, and various other factors. This allows to set limits, and more!"
      onChange={updateOption} />
  </NekoSettings>;

  const jsxChatbot =
    <NekoSettings title="Chatbot">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="shortcode_chat" label="Enable" value="1" checked={shortcode_chat}
          description="A chatbot that can be similar to ChatGPT. But it has many features! Check the Chatbot tab."
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>
   ;

  const jsxShortcodeFormatting =
    <NekoSettings title="Formatting">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="shortcode_chat_formatting" label="Enable" value="1" checked={shortcode_chat_formatting}
          description={<>Convert the reply from the AI into HTML. <b>Markdown is supported, so it is highly recommended to add 'Use Markdown.' in your context.</b></>}
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

  const jsxUsage = useMemo(() => {
    let usageData = {};
    try {
      Object.keys(openai_usage).forEach((month) => {
        const monthUsage = openai_usage[month];
        if (!usageData[month]) usageData[month] = {
          totalPrice:0,
          data: []
        }
        Object.keys(monthUsage).forEach((model) => {
          const modelUsage = monthUsage[model];
          let price = 0;
          const realModel = models.find(x => x.id === model);
          if (model === 'dall-e' ) {
            const defaultOption = '1024x1024';
            const modelPrice = pricing.find(x => x.model === 'dall-e');
            const modelOptionPrice = modelPrice.options.find(x => x.option === defaultOption);
            price = modelUsage.images * modelOptionPrice.price;
            usageData[month].totalPrice += price;
            usageData[month].data.push({ 
              name: 'dall-e',
              isImage: true,
              usage: modelUsage.images,
              price: price
            });
            return;
          }
          if (!realModel) {
            console.log(`Cannot find model ${model}.`);
            return;
          }
          let modelPrice = pricing.find(x => x.model === realModel.short);
          if (modelPrice) {
            price = modelUsage.total_tokens / 1000 * modelPrice.price;
            usageData[month].totalPrice += price;
            const name = realModel ? realModel.name : model;
            usageData[month].data.push({
              name: name,
              isImage: false,
              usage: modelUsage.total_tokens,
              price: price
            });
          }
          else {
            console.log(`Cannot find price for model ${model}.`);
          }
        });
      });
      
      Object.keys(usageData).forEach((month) => {
        usageData[month].data.sort((a, b) => b.price - a.price);
      });

    } catch (e) {
      console.log(e);
    }

    return (
      <ul style={{ marginTop: 2 }}>
        {Object.keys(usageData).map((month, index) => {
          return (
            <li key={index}>
              <strong>🗓️ {month} ({usageData[month].totalPrice.toFixed(2)}$)</strong>
              <ul>
                {usageData[month].data.map((data, index) => {
                  return (
                    <li key={index} style={{ marginTop: 5, marginLeft: 18 }}>
                      <strong>• {data.name}</strong>
                      {data.isImage && `: ${data.usage} images`}
                      {!data.isImage && `: ${data.usage} tokens`}
                      {data.price > 0 && ` (${data.price.toFixed(2)}$)`}
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    );
  }, [ openai_usage, models ]);

  const jsxOpenAiUsage =
    <div>
      <h3>Usage</h3>
      <div style={{ marginTop: -10, marginBottom: 10, fontSize: 12 }}>
        For the exact amounts, please check your <a href="https://beta.openai.com/account/usage" target="_blank">OpenAI account</a>. If you would like to have better control on the amounts, add conditions or set limits to the usage of the AI, consider <a href="https://meowapps.com/ai-engine/" target="_blank">AI Engine Pro</a>.
      </div>
      {!Object.keys(openai_usage).length && <NekoTypo p>N/A</NekoTypo>}
      {openai_usage && <>
        {jsxUsage}
      </>}
    </div>;

  return (
    <NekoPage>

      <AiNekoHeader />

      <NekoWrapper>

        <NekoColumn full>

          <OptionsCheck options={options} />

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
                    {jsxAiFeatures}
                    {jsxStatistics}
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
                  <NekoBlock className="primary">
                    <NekoTypo p>
                    <p>
                      If you only need one chatbot, set your parameters in the Chatbot Builder, and click on <b>Set as Default Parameters</b>. You can then use the shortcode <b>[mwai_chat]</b> anywhere on your website. You can also add the chatbot everywhere automatically by using <b>Inject Default Chatbot</b>.
                    </p>
                    <p>
                      Alternatively, you can also play with the params to create different shortcodes. You can have multiple chatbots on your website, or even the same page, each with different parameters. Play with them! 😎
                    </p>
                    </NekoTypo>
                  </NekoBlock>

                  <NekoBlock busy={busy} title="Features" className="primary">
                    {jsxShortcodeFormatting}
                    {jsxShortcodeSyntaxHighlighting}
                  </NekoBlock>

                  <NekoBlock busy={busy} title="Styles" className="primary" action={
                    <NekoButton className="danger" onClick={onResetShortcodeStyles}>
                      Reset Styles
                    </NekoButton>}>
                    <StyledBuilderForm>
                      <p>Keep in mind that you can also style the chatbot (or aspecific chatbot, if you use many) by injecting CSS. Have a look <a target="_blank" href="https://meowapps.com/ai-engine/tutorial/#apply-custom-style-to-the-chatbot">here</a>.</p>
                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col">
                          <label>Spacing:</label>
                          <NekoInput id="spacing" name="spacing"
                            value={shortcodeStyles?.spacing ?? '15px'} onBlur={updateShortcodeColors} />
                        </div>
                        <div className="mwai-builder-col">
                          <label>Font Size:</label>
                          <NekoInput id="fontSize" name="fontSize"
                            value={shortcodeStyles?.fontSize ?? '15px'} onBlur={updateShortcodeColors} />
                        </div>
                        <div className="mwai-builder-col">
                          <label>Border Radius:</label>
                          <NekoInput id="borderRadius" name="borderRadius"
                            value={shortcodeStyles?.borderRadius ?? '10px'} onBlur={updateShortcodeColors} />
                        </div>
                      </div>
                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col">
                          <label>Font Color:</label>
                          <div style={{ display: 'flex' }}>
                            <NekoInput id="fontColor" name="fontColor"
                              value={shortcodeStyles?.fontColor ?? '#FFFFFF'} 
                              onBlur={updateShortcodeColors} />
                            <NekoColorPicker id="fontColor" name="fontColor"
                              value={shortcodeStyles?.fontColor ?? '#FFFFFF'}
                              onChange={updateShortcodeColors} />
                          </div>
                        </div>
                        <div className="mwai-builder-col">
                          <label>Back Primary Color:</label>
                          <div style={{ display: 'flex' }}>
                            <NekoInput id="backgroundPrimaryColor" name="backgroundPrimaryColor"
                              value={shortcodeStyles?.backgroundPrimaryColor ?? '#454654'} 
                              onBlur={updateShortcodeColors} />
                            <NekoColorPicker id="backgroundPrimaryColor" name="backgroundPrimaryColor"
                              value={shortcodeStyles?.backgroundPrimaryColor ?? '#454654'}
                              onChange={updateShortcodeColors} />
                          </div>
                        </div>
                        <div className="mwai-builder-col">
                          <label>Back Secondary Color:</label>
                          <div style={{ display: 'flex' }}>
                            <NekoInput id="backgroundSecondaryColor" name="backgroundSecondaryColor"
                              value={shortcodeStyles?.backgroundSecondaryColor ?? '#343541'} 
                              onBlur={updateShortcodeColors} />
                            <NekoColorPicker id="backgroundSecondaryColor" name="backgroundSecondaryColor"
                              value={shortcodeStyles?.backgroundSecondaryColor ?? '#343541'}
                              onChange={updateShortcodeColors} />
                          </div>
                        </div>
                      </div>
                    </StyledBuilderForm>
                  </NekoBlock>
                </NekoColumn>

                <NekoColumn minimal>
                  <NekoBlock busy={busy} title="Chatbot Builder" className="primary" action={
                    <NekoButton className="danger" onClick={onResetShortcodeParams}>
                      Reset Parameters
                    </NekoButton>}>

                    <StyledBuilderForm>

                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col">
                        <label>Mode:</label>
                          <NekoSelect scrolldown id="mode" name="mode"
                            value={shortcodeParams.mode} onChange={updateShortcodeParams}>
                            <NekoOption value="chat" label="Chat" />
                            <NekoOption value="images" label="Images" />
                          </NekoSelect>
                        </div>

                        {isChat && <div className="mwai-builder-col" style={{ flex: 5 }}>
                          <label>Context:</label>
                          <NekoInput id="context" name="context"
                            value={shortcodeParams.context} onBlur={updateShortcodeParams} />
                        </div>}

                        {isImagesChat && <div className="mwai-builder-col" style={{ flex: 5 }}>
                          <label>Max Results (= Number of Images):</label>
                          <NekoInput id="max_results" name="max_results" type="number"
                            value={shortcodeParams.max_results} onBlur={updateShortcodeParams} />
                        </div>}

                      </div>

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
                        <div className="mwai-builder-col" style={{ flex: 2 }}>
                          <label>Placeholder:</label>
                          <NekoInput id="text_input_placeholder" name="text_input_placeholder"
                            value={shortcodeParams.text_input_placeholder} onBlur={updateShortcodeParams} />
                        </div>
                        <div className="mwai-builder-col">
                          <label>Button:</label>
                          <NekoInput id="text_send" name="text_send" value={shortcodeParams.text_send}
                            onBlur={updateShortcodeParams} />
                        </div>
                      </div>
                      
                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col" style={{ textAlign: 'right', marginRight: 10 }}>
                          <br />
                          {shortcodeParams.ai_name}
                        </div>
                        <div className="mwai-builder-col" style={{ flex: 5 }}>
                        <label>Start Sentence:</label>
                          <NekoInput id="start_sentence" name="start_sentence"
                            value={shortcodeParams.start_sentence} onBlur={updateShortcodeParams} />
                        </div>
                      </div>

                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col" style={{ flex: 2 }}>
                          <label>Style:</label>
                          <NekoSelect scrolldown id="style" name="style"
                            value={shortcodeParams.style} description="" onChange={updateShortcodeParams}>
                            <NekoOption value='none' label="None" />
                            <NekoOption value='chatgpt' label="ChatGPT" />
                          </NekoSelect>
                        </div>
                        <div className="mwai-builder-col">
                          <label>Popup Window:</label>
                          <NekoCheckbox id="window" label="Yes"
                            checked={shortcodeParams.window} value="1" onChange={updateShortcodeParams} />
                        </div>
                        <div className="mwai-builder-col">
                          <label>Full Screen:</label>
                          <NekoCheckbox id="fullscreen" label="Yes"
                            checked={shortcodeParams.fullscreen} value="1" onChange={updateShortcodeParams} />
                        </div>
                        {isChat && <div className="mwai-builder-col" style={{ flex: 2 }}>
                          <label>Content Aware:</label>
                          <NekoCheckbox id="content_aware" label="Yes"
                            requirePro={true} isPro={isRegistered}
                            checked={shortcodeParams.content_aware} value="1" onChange={updateShortcodeParams} />
                        </div>}
                      </div>
                      
                      {isChat && <div className="mwai-builder-row">

                        <div className="mwai-builder-col" style={{ flex: 2 }}>
                          <label>Model:</label>
                          <NekoSelect scrolldown id="model" name="model"
                            value={shortcodeParams.model} description="" onChange={updateShortcodeParams}>
                            {models.map((x) => (
                              <NekoOption key={x.id} value={x.id} label={x.name}></NekoOption>
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

                      </div>}

                      <pre>
                        {builtShortcode}
                      </pre>

                    </StyledBuilderForm>

                    <NekoCheckbox id="shortcode_chat_params_override" label="Set as Default Parameters"
                      disabled={Object.keys(shortcodeParamsDiff).length < 1 && !shortcodeParamsOverride}
                      value="1" checked={shortcodeParamsOverride}
                      duration="shortcode_chat_params_override"
                      description="The parameters set above will be used by default. If you are using 'Popup Window' and many chatbots on the same page, be careful, as they will probably appear on top of each other."
                      onChange={updateOption} />

                    <NekoCheckbox id="shortcode_chat_inject" label="Inject Default Chatbot in Website"
                      value="1" checked={shortcodeChatInject}
                      description={<><span>Inject the default chatbot automatically on your website. It will be available on every page.</span>{shortcodeParams.window ? '' : <span> It's highly recommended to enable 'Window (Popup Mode)'</span>}</>}
                      onChange={updateOption} />

                  </NekoBlock>
                </NekoColumn>

              </NekoWrapper>
            </NekoTab>}

            <NekoTab title='Fine Tuning: Train your AI'>
              <FineTuning options={options} updateOption={updateOption} />
            </NekoTab>

            <NekoTab title='License'>
              <LicenseBlock domain={domain} prefix={prefix} isPro={isPro} isRegistered={isRegistered} />
            </NekoTab>

          </NekoTabs>

        </NekoColumn>

      </NekoWrapper>

    </NekoPage>
  );
};

export default Settings;