// Previous: 0.9.92
// Current: 0.9.93

const { useMemo, useState } = wp.element;

import { NekoButton, NekoInput, NekoTypo, NekoPage, NekoBlock, NekoContainer, NekoSettings, NekoSpacer,
  NekoSelect, NekoOption, NekoTabs, NekoTab, NekoCheckboxGroup, NekoCheckbox, NekoWrapper, NekoMessageDanger,
  NekoQuickLinks, NekoLink,
  NekoColumn, NekoTextArea } from '@neko-ui';
import { nekoFetch } from '@neko-ui';
import { useQuery } from '@tanstack/react-query';

import { LicenseBlock } from '@common';
import { apiUrl, prefix, domain, isRegistered, isPro, restNonce, pricing, pluginUrl,
  options as defaultOptions } from '@app/settings';

import { OptionsCheck, toHTML, useModels } from '../helpers';
import { AiNekoHeader } from '../styles/CommonStyles';
import FineTuning from './FineTuning';
import OpenAIStatus from './Settings/OpenAIStatus';
import { StyledBuilderForm } from "../styles/StyledSidebar";
import { NekoColorPicker } from "../components/NekoColorPicker";
import i18n from '../../i18n';

const chatIcons = [
  'chat-robot-1.svg',
  'chat-robot-2.svg',
  'chat-robot-3.svg',
  'chat-robot-4.svg',
  'chat-robot-5.svg',
  'chat-robot-6.svg',
  'chat-color-blue.svg',
  'chat-color-green.svg',
  'chat-color-red.svg',
  'chat-traditional-1.svg',
  'chat-traditional-2.svg',
  'chat-traditional-3.svg'
];

const retrieveIncidents = async () => {
  const res = await nekoFetch(`${apiUrl}/openai_incidents`, { nonce: restNonce });
  if (res?.incidents) {
    let incidents = res.incidents.map(x => {
      let timestamp = x.date;
      timestamp = new Date(timestamp * 1000);
      let date = timestamp.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      return { ...x, date }
    });
    return incidents;
  }
  return null;
}

const Settings = () => {
  const [ options, setOptions ] = useState(defaultOptions);
  const [ busyAction, setBusyAction ] = useState(false);
  const [ limitSection, setLimitSection ] = useState('users');
  const { models, isFineTunedModel } = useModels(options);
  const shortcodeDefaultParams = options?.shortcode_chat_default_params;
  const shortcodeParams = options?.shortcode_chat_params;
  const shortcodeStyles = options?.shortcode_chat_styles;
  const shortcodeParamsOverride = options?.shortcode_chat_params_override;
  const shortcodeChatInject = options?.shortcode_chat_inject;
  const module_titles = options?.module_titles;
  const module_excerpts = options?.module_excerpts;
  const module_woocommerce = options?.module_woocommerce;
  const module_forms = options?.module_forms;
  const module_blocks = options?.module_blocks;
  const module_statistics = options?.module_statistics;
  const module_playground = options?.module_playground;
  const module_generator_content = options?.module_generator_content;
  const module_generator_images = options?.module_generator_images;
  const limits = options?.limits;
  const default_limits = options?.default_limits;
  const shortcode_chat = options?.shortcode_chat;
  const shortcode_chat_formatting = options?.shortcode_chat_formatting;
  const shortcode_chat_logs = options?.shortcode_chat_logs;
  const openai_apikey = options?.openai_apikey ? options?.openai_apikey : '';
  const openai_usage = options?.openai_usage;
  const shortcode_chat_syntax_highlighting = options?.shortcode_chat_syntax_highlighting;
  const extra_models = options?.extra_models;
  const debug_mode = options?.debug_mode;
  const isChat = shortcodeParams.mode === 'chat';
  const isImagesChat = shortcodeParams.mode === 'images';
  const isCustomURL = shortcodeStyles?.icon?.startsWith('https://') || shortcodeStyles?.icon?.startsWith('http://');
  const previewIcon = isCustomURL ? shortcodeStyles?.icon : `${pluginUrl}/images/${shortcodeStyles?.icon}`;
  const { isLoading: isLoadingIncidents, data: incidents } = useQuery({
    queryKey: ['openAI_status'], queryFn: retrieveIncidents
  });

  // Mutate the icon property directly, which is a reference. Mutations here affect external options object.
  shortcodeStyles.icon = shortcodeStyles?.icon ? shortcodeStyles?.icon : 'chat-color-green.svg';

  const accidentsPastDay = incidents?.filter(x => {
    const incidentDate = new Date(x.date);
    return incidentDate > new Date(Date.now() - 24 * 60 * 60 * 1000);
  }).length;

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
      params.push(`${key}="${shortcodeParams[key]}"`);
    }
    const joinedParams = params.join(' ');
    return '[mwai_chat' + (joinedParams ? ` ${joinedParams}` : '') + ']';
  }, [shortcodeParamsDiff]);

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
    // Directly mutate the object, breaking React state immutability, no set call here
    shortcodeParams[id] = value;
    await updateOption(shortcodeParams, 'shortcode_chat_params');
  }

  const updateLimits = async (value, id) => {
    const newParams = { ...limits, [id]: value };
    await updateOption(newParams, 'limits');
  }

  const updateUserLimits = async (value, id) => {
    if (id === 'credits') {
      value = Math.max(0, value);
    }
    const newParams = { ...limits.users, [id]: value };
    const newLimits = { ...limits, users: newParams };
    await updateOption(newLimits, 'limits');
  }

  const updateGuestLimits = async (value, id) => {
    if (id === 'credits') {
      value = Math.max(0, value);
    }
    const newParams = { ...limits.guests, [id]: value };
    const newLimits = { ...limits, guests: newParams };
    await updateOption(newLimits, 'limits');
  }

  const updateShortcodeColors = async (value, id) => {
    if (value) {
      // Mutate styles object directly
      shortcodeStyles[id] = value;
      await updateOption(shortcodeStyles, 'shortcode_chat_styles');
    }
  }

  const onResetShortcodeParams = async () => {
    await updateOption(shortcodeDefaultParams, 'shortcode_chat_params');
  }

  const onResetShortcodeStyles = async () => {
    await updateOption({}, 'shortcode_chat_styles');
  }

  const onResetLimits = async () => {
    console.log(default_limits);
    await updateOption(default_limits, 'limits');
  }

  /**
   * Settings
   */

  const jsxAssistants =
    <NekoSettings title="Assistants">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="module_titles" label="Titles Suggestions" value="1" checked={module_titles}
          description="Suggest a few titles based on your content."
          onChange={updateOption} />
        <NekoCheckbox id="module_excerpts" label="Excerpt Suggestions" value="1" checked={module_excerpts}
          description="Suggest a few excerpts based on your content."
          onChange={updateOption} />
        <NekoCheckbox id="module_woocommerce" label="WooCommerce Product Generator" value="1" checked={module_woocommerce}
          description="Write all the WooCommerce fields for a given product."
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxGenerators =
    <NekoSettings title="Generators">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="module_generator_content" label="Content Generator" value="1" checked={module_generator_content}
          description="Write articles for you. Create templates, and re-use them."
          onChange={updateOption} />
        <NekoCheckbox id="module_generator_images" label="Images Generator" value="1" checked={module_generator_images}
          description="Generate images for you. Create templates, and re-use them."
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxPlayground = 
    <NekoSettings title="Playground">
      <NekoCheckbox id="module_playground" label={i18n.COMMON.ENABLE} value="1"
        checked={module_playground}
        description="You can do everything with the Playground! Use Templates to boost your productivity."
        onChange={updateOption} />
    </NekoSettings>;

  const jsxForms = 
    <NekoSettings title={<>Forms<small style={{ position: 'relative', top: -3, fontSize: 8 }}> BETA</small></>}>
      <NekoCheckbox id="module_forms" label={i18n.COMMON.ENABLE} value="1"
        checked={module_forms} requirePro={true} isPro={isRegistered}
        description="Create AI Forms. Based on fields, users will be given answers or suggestions. Works with shortcodes and Gutenberg blocks."
        onChange={updateOption} />
  </NekoSettings>;

  const jsxStatistics = 
    <NekoSettings title={<>Statistics<small style={{ position: 'relative', top: -3, fontSize: 8 }}> BETA</small></>}>
      <NekoCheckbox id="module_statistics" label="Enable Statistics & Limits" value="1"
        checked={module_statistics} requirePro={true} isPro={isRegistered}
        description="Track interactions with the AI based on the user, session, type, price, etc. This allows to set limits, and more!"
        onChange={updateOption} />
    </NekoSettings>;

  const jsxAiBlocks = 
  <NekoSettings title="Gutenberg Blocks">
    <NekoCheckboxGroup max="1">
      <NekoCheckbox label={i18n.COMMON.ENABLE} disabled={true} value="1" checked={module_blocks}
        description="Additional blocks. Let me know your ideas!"
        onChange={updateOption} />
    </NekoCheckboxGroup>
  </NekoSettings>;

  const jsxChatbot =
    <NekoSettings title={i18n.COMMON.CHATBOT}>
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="shortcode_chat" label={i18n.COMMON.ENABLE} value="1" checked={shortcode_chat}
          description="A chatbot that can be similar to ChatGPT. But it has many features! Check the Chatbot tab."
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>
   ;

  const jsxShortcodeFormatting =
    <NekoSettings title="Formatting">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="shortcode_chat_formatting" label={i18n.COMMON.ENABLE} value="1" checked={shortcode_chat_formatting}
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


const jsxShortcodeChatLogs =
  <NekoSettings title="Logs">
    <NekoCheckboxGroup max="1">
      <NekoSelect scrolldown id="shortcode_chat_logs" name="shortcode_chat_logs"
        value={shortcode_chat_logs} description="" onChange={updateOption}>
        <NekoOption value='' label="None" />
        <NekoOption value='file' label="Files (/uploads/chatbot folder)" />
      </NekoSelect>
    </NekoCheckboxGroup>
  </NekoSettings>;

  const jsxExtraModels =
    <NekoSettings title="Extra Models">
      <NekoInput id="extra_models" name="extra_models" value={extra_models}
        description={<>You can enter additional models you would like to use (separated by a comma). Note that your fine-tuned models are already available.</>} onBlur={updateOption} />
    </NekoSettings>;
  
  const jsxDebugMode =
    <NekoSettings title="Debug Mode">
      <NekoCheckbox id="debug_mode" label={i18n.COMMON.ENABLE} value="1" checked={debug_mode}
        description={<>More information will be made available in/through the console.</>}
        onChange={updateOption} />
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
            const modelOptionPrice = modelPrice ? modelPrice.options.find(x => x.option === defaultOption) : null;
            if (modelOptionPrice) {
              price = modelUsage.images * modelOptionPrice.price;
            }
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
            console.warn(`Monthly Usage was detected for a removed model (${model}).`);
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

  const isFineTuned = isFineTunedModel(shortcodeParams.model);
  const isContentAware = shortcodeParams.content_aware;
  const contextHasContent = shortcodeParams.context && shortcodeParams.context.includes('{CONTENT}');
        
  return (
    <NekoPage>

      <AiNekoHeader options={options} />

      <NekoWrapper>

        <NekoColumn full>

          <OptionsCheck options={options} />

          <NekoContainer>
            <NekoTypo p>
              {toHTML(i18n.SETTINGS.INTRO)}
            </NekoTypo>
          </NekoContainer>

          <NekoTabs keepTabOnReload={true}>

            <NekoTab title='Settings'>
              <NekoWrapper>

                <NekoColumn minimal>
                  <NekoBlock busy={busy} title="Modules" className="primary">
                    <p>{i18n.SETTINGS.MODULES_INTRO}</p>
                    <NekoSpacer height={50} />
                    {jsxChatbot}
                    {jsxGenerators}
                    {jsxPlayground}
                    {jsxAssistants}
                    {jsxForms}
                    {jsxStatistics}
                    {jsxAiBlocks}
                  </NekoBlock>

                  <NekoBlock busy={busy} title="Advanced" className="primary">
                    {jsxExtraModels}
                    {jsxDebugMode}
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

            {(shortcode_chat) && <NekoTab title={i18n.COMMON.CHATBOT}>
              <NekoWrapper>

                <NekoColumn minimal full>
                  <NekoBlock className="primary">
                    <NekoTypo p>
                    <p>
                      If you only need one chatbot, set your parameters in the Chatbot Builder, and click on <b>Set as Default Parameters</b>. You can then use the shortcode <b>[mwai_chat]</b> anywhere on your website. You can also add the chatbot everywhere automatically by using <b>Inject Default Chatbot</b>.
                    </p>
                    <p>
                      You can have multiple chatbots on your website (or same page), each with different parameters. Setting an ID will memorize the conversation in the browser, Content Aware will make the content of your page available to the context (<a href="https://meowapps.com/ai-engine/tutorial/#content-aware-bot" target="_blank">read this</a>), and removing the AI Name and User Name will switch to avatars (similar to ChatGPT). Enjoy! 😎
                    </p>
                    </NekoTypo>
                  </NekoBlock>
                </NekoColumn>

                <NekoColumn minimal>
                  <NekoBlock busy={busy} title="Chatbot Builder" className="primary" action={
                    <NekoButton className="danger" onClick={onResetShortcodeParams}>
                      Reset Parameters
                    </NekoButton>}>

                    <StyledBuilderForm>

                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col"
                          style={{ height: shortcodeParams.mode === 'chat' ? 76 : 'inherit' }}>
                            <label>Mode:</label>
                            <NekoSelect scrolldown id="mode" name="mode"
                              value={shortcodeParams.mode} onChange={updateShortcodeParams}>
                              <NekoOption value="chat" label="Chat" />
                              <NekoOption value="images" label="Images" />
                            </NekoSelect>
                        </div>

                        {isChat && <div className="mwai-builder-col" style={{ flex: 5 }}>
                          <label>Context:</label>
                          <NekoTextArea id="context" name="context" rows={2}
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
                        <div className="mwai-builder-col" style={{ flex: 4 }}>
                          <label>Start Sentence:</label>
                          <NekoInput id="start_sentence" name="start_sentence"
                            value={shortcodeParams.start_sentence} onBlur={updateShortcodeParams} />
                        </div>
                      </div>

                      <div className="mwai-builder-row">
                        
                        <div className="mwai-builder-col">
                          <label>User Name:</label>
                          <NekoInput id="user_name" name="user_name"
                            value={shortcodeParams.user_name} onBlur={updateShortcodeParams} />
                        </div>
                        <div className="mwai-builder-col" style={{ flex: 2 }}>
                          <label>Placeholder:</label>
                          <NekoInput id="text_input_placeholder" name="text_input_placeholder"
                            value={shortcodeParams.text_input_placeholder} onBlur={updateShortcodeParams} />
                        </div>
                        <div className="mwai-builder-col">
                          <label>Send:</label>
                          <NekoInput id="text_send" name="text_send" value={shortcodeParams.text_send}
                            onBlur={updateShortcodeParams} />
                        </div>
                        <div className="mwai-builder-col">
                          <label>Clear:</label>
                          <NekoInput id="text_clear" name="text_clear" value={shortcodeParams.text_clear}
                            disabled={!shortcodeParams.id}
                            onBlur={updateShortcodeParams} />
                        </div>
                      </div>

                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col">
                          <label>System Name:</label>
                          <NekoInput id="sys_name" name="sys_name"
                            value={shortcodeParams.sys_name} onBlur={updateShortcodeParams} />
                        </div>
                        <div className="mwai-builder-col">
                          <div>
                            <label style={{ display: 'block' }}>ID:</label>
                            <NekoInput id="id" name="id" type="text" placeholder="Optional"
                              value={shortcodeParams.id} onBlur={updateShortcodeParams} />
                          </div>
                        </div>
                        <div className="mwai-builder-col" style={{ flex: 2 }}>
                          <label>Style:</label>
                          <NekoSelect scrolldown id="style" name="style"
                            value={shortcodeParams.style} description="" onChange={updateShortcodeParams}>
                            <NekoOption value='none' label="None" />
                            <NekoOption value='chatgpt' label="ChatGPT" />
                          </NekoSelect>
                        </div>
                        <div className="mwai-builder-col">
                          <label>Popup:</label>
                          <NekoCheckbox id="window" label="Yes"
                            checked={shortcodeParams.window} value="1" onChange={updateShortcodeParams} />
                        </div>

                      </div>

                      <div className="mwai-builder-row">
                        
                        <div className="mwai-builder-col" style={{ flex: 2 }}>
                          <label>Position:</label>
                          <NekoSelect scrolldown id="icon_position" name="icon_position" disabled={!shortcodeParams.window}
                            value={shortcodeParams.icon_position} onChange={updateShortcodeParams}>
                            <NekoOption value="bottom-right" label="Bottom Right" />
                            <NekoOption value="bottom-left" label="Bottom Left" />
                            <NekoOption value="top-right" label="Top Right" />
                            <NekoOption value="top-left" label="Top Left" />
                          </NekoSelect>
                        </div>

                        <div className="mwai-builder-col" style={{ flex: 2 }}>
                          <label>Icon Text:</label>
                          <NekoInput id="icon_text" name="icon_text" disabled={!shortcodeParams.window}
                            placeholder="If set, appears next to icon"
                            value={shortcodeParams.icon_text ?? 'Chat'} onBlur={updateShortcodeParams} />
                        </div>

                        <div className="mwai-builder-col" style={{ flex: 1 }}>
                          <label>Full Screen:</label>
                          <NekoCheckbox id="fullscreen" label="Yes"
                            checked={shortcodeParams.fullscreen} value="1" onChange={updateShortcodeParams} />
                        </div>
                        
                      </div>

                      {isChat && <div className="mwai-builder-row">
                        <div className="mwai-builder-col">
                          <label>Model:</label>
                          <NekoSelect scrolldown id="model" name="model"
                            value={shortcodeParams.model} description="" onChange={updateShortcodeParams}>
                            {models.map((x) => (
                              <NekoOption value={x.id} label={x.id}></NekoOption>
                            ))}
                          </NekoSelect>
                        </div>
                      </div>}

                      {isChat && <div className="mwai-builder-row">
                        
                        <div className="mwai-builder-col" style={{ flex: 0.5 }}>
                          <label>Max Tokens:</label>
                          <NekoInput id="max_tokens" name="max_tokens" type="number" min="10" max="2048"
                            value={shortcodeParams.max_tokens} onBlur={updateShortcodeParams} />
                        </div>

                        <div className="mwai-builder-col" style={{ flex: 0.5 }}>
                          <label>Temperature:</label>
                          <NekoInput id="temperature" name="temperature" type="number"
                            step="0.1" min="0" max="1"
                            value={shortcodeParams.temperature} onBlur={updateShortcodeParams} />
                        </div>

                        <div className="mwai-builder-col">
                          <label>Casually Fine Tuned:</label>
                          <NekoCheckbox id="casually_fine_tuned" label="Yes"
                            checked={shortcodeParams.casually_fine_tuned} value="1" onChange={updateShortcodeParams}
                          />
                        </div>
                        {isChat && <div className="mwai-builder-col">
                          <label>Content Aware:</label>
                          <NekoCheckbox id="content_aware" label="Yes"
                            requirePro={true} isPro={isRegistered}
                            checked={shortcodeParams.content_aware} value="1" onChange={updateShortcodeParams} />
                        </div>}

                      </div>}

                      {shortcodeChatInject && !shortcodeParams.window && 
                        <NekoMessageDanger style={{ marginBottom: 0, padding: '10px 15px' }}>
                          <p>You choose to inject the chatbot in your website. You probably also want to use the chatbot in a Popup Window.</p>
                        </NekoMessageDanger>
                      }

                      {isFineTuned && !shortcodeParams.casually_fine_tuned && 
                        <NekoMessageDanger style={{ marginBottom: 0, padding: '10px 15px' }}>
                          <p>You choose a fine-tuned model. However, you didn't check the Casually Fine Tuned option. Make sure that's what you want.</p>
                        </NekoMessageDanger>
                      }

                      {!isFineTuned && shortcodeParams.casually_fine_tuned && 
                        <NekoMessageDanger style={{ marginBottom: 0, padding: '10px 15px' }}>
                          <p>Normally, you should not check the Casually Fine Tuned option with a non-finetuned model. Make sure that's what you want.</p>
                        </NekoMessageDanger>
                      }

                      {isContentAware && !contextHasContent && 
                        <NekoMessageDanger style={{ marginBottom: 0, padding: '10px 15px' }}>
                          <p>
                            Content Aware requires your Context to use the {'{'}CONTENT{'}'} placeholder. It will be replaced by the content of page the chatbot is on. More info <a href="https://meowapps.com/ai-engine/tutorial/#contextualization" target="_blank">here</a>.
                          </p>
                        </NekoMessageDanger>
                      }

                      <pre>
                        {builtShortcode}
                      </pre>

                    </StyledBuilderForm>

                    <NekoCheckbox id="shortcode_chat_params_override" label="Set as Default Parameters"
                      disabled={Object.keys(shortcodeParamsDiff).length < 1 && !shortcodeParamsOverride}
                      value="1" checked={shortcodeParamsOverride}
                      description="The parameters set above will be used by default when you use [mwai_chat] or inject the chatbot."
                      onChange={updateOption} />

                    <NekoCheckbox id="shortcode_chat_inject" label="Inject Chatbot in the Entire Website"
                      value="1" checked={shortcodeChatInject}
                      description={<span>Inject the chatbot [mwai_chat] in the entire website.</span>}
                      onChange={updateOption} />

                  </NekoBlock>
                </NekoColumn>

                <NekoColumn minimal>

                  <NekoBlock busy={busy} title="ChatGPT Style" className="primary" action={
                    <NekoButton className="danger" onClick={onResetShortcodeStyles}>
                      Reset Styles
                    </NekoButton>}>
                    <StyledBuilderForm>
                      <p>Keep in mind that you can also style the chatbot (or aspecific chatbot, if you use many) by injecting CSS. Have a look <a target="_blank" href="https://meowapps.com/ai-engine/tutorial/#apply-custom-style-to-the-chatbot">here</a>. Header Buttons are the ones used to close or resize the Popup Window. For more, check the <a target="_blank" href="https://meowapps.com/ai-engine/faq">FAQ</a>.</p>
                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
                          <label>Spacing:</label>
                          <NekoInput id="spacing" name="spacing"
                            value={shortcodeStyles?.spacing ?? '15px'} onBlur={updateShortcodeColors} />
                        </div>
                        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
                          <label>Border Radius:</label>
                          <NekoInput id="borderRadius" name="borderRadius"
                            value={shortcodeStyles?.borderRadius ?? '10px'} onBlur={updateShortcodeColors} />
                        </div>
                        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
                          <label>Font Size:</label>
                          <NekoInput id="fontSize" name="fontSize"
                            value={shortcodeStyles?.fontSize ?? '15px'} onBlur={updateShortcodeColors} />
                        </div>
                        <div className="mwai-builder-col" style={{ flex: 1 }}>
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
                      </div>
                      <div className="mwai-builder-row">
                        
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
                        <div className="mwai-builder-col">
                          <label>Header Buttons Color:</label>
                          <div style={{ display: 'flex' }}>
                            <NekoInput id="headerButtonsColor" name="headerButtonsColor"
                              value={shortcodeStyles?.headerButtonsColor ?? '#FFFFFF'} 
                              onBlur={updateShortcodeColors} />
                            <NekoColorPicker id="headerButtonsColor" name="headerButtonsColor"
                              value={shortcodeStyles?.headerButtonsColor ?? '#FFFFFF'}
                              onChange={updateShortcodeColors} />
                          </div>                          
                        </div>
                      </div>
                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col" style={{ flex: 2 }}>
                          <label>Icon for Popup:</label>
                          <div style={{ display: 'flex' }}>
                          {chatIcons.map(x => 
                            <>
                              <img style={{ marginRight: 2, cursor: 'pointer' }} width={24} height={24}
                                src={`${pluginUrl}/images/${x}`} onClick={() => {
                                  updateShortcodeColors(x, 'icon')
                                }} />
                            </>
                          )}
                          <NekoButton small className="primary" style={{ marginLeft: 5 }}
                            onClick={() => { updateShortcodeColors(`${pluginUrl}/images/chat-color-green.svg`, 'icon') }}>
                            Custom URL
                          </NekoButton>
                          </div>
                        </div>
                        <div className="mwai-builder-col" style={{ width: 48, display: 'flex', alignItems: 'end' }}>
                          <img style={{ marginRight: 0, paddingTop: 10 }} width={48} height={48} src={`${previewIcon}`} />
                        </div>
                      </div>
                      {isCustomURL && <div className="mwai-builder-row">
                        <div className="mwai-builder-col">
                          <label>Custom Icon URL:</label>
                          <NekoInput id="icon" name="icon" value={shortcodeStyles?.icon}
                            onBlur={updateShortcodeColors} />
                        </div>
                      </div>}
                    </StyledBuilderForm>
                  </NekoBlock>

                  <NekoBlock busy={busy} title="Features" className="primary">
                    {jsxShortcodeFormatting}
                    {jsxShortcodeSyntaxHighlighting}
                    {jsxShortcodeChatLogs}
                  </NekoBlock>
                </NekoColumn>

              </NekoWrapper>
            </NekoTab>}

            {module_statistics && <NekoTab title={i18n.COMMON.STATISTICS}>
              <NekoWrapper>
                <NekoColumn minimal style={{ flex: 2.5 }}>
                  <NekoBlock className="primary" title="Queries">
                    <p>In the works! Coming soon :)</p>
                  </NekoBlock>
                </NekoColumn>
                <NekoColumn minimal>
                  <StyledBuilderForm>
                    <NekoBlock className="primary" busy={busy} title="Limits" style={{ flex: 1 }} action={
                    <NekoButton className="danger" onClick={onResetLimits}>
                      Reset Limits
                    </NekoButton>}>

                      <NekoCheckbox id="enabled" label="Enable Limits"
                        checked={limits?.enabled} value="1" onChange={updateLimits}
                      />

                      <NekoSpacer />

                      <NekoQuickLinks value={limitSection} busy={busy} 
                        onChange={value => { setLimitSection(value) }}>
                        <NekoLink title="Users" value='users' disabled={!limits?.enabled} />
                        <NekoLink title="Guests" value='guests' />
                      </NekoQuickLinks>

                      {limits?.target === 'userId' && <>
                        <div className="mwai-builder-row">
                          <div className="mwai-builder-col">
                            <label>Message for Guests:</label>
                            <NekoInput id="guestMessage" name="guestMessage" disabled={!limits?.enabled}
                              value={limits?.guestMessage} onBlur={updateLimits} />
                          </div>
                        </div>
                      </>}

                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col">
                          <label>Credits:</label>
                          <NekoInput id="credits" name="credits" type="number" min="0" max="1000000"
                            disabled={!limits?.enabled} value={limits?.[limitSection]?.credits}
                            onBlur={limitSection === 'users' ? updateUserLimits : updateGuestLimits} />
                        </div>
                        <div className="mwai-builder-col">
                          <label>Type:</label>
                          <NekoSelect scrolldown id="creditType" name="creditType" disabled={!limits?.enabled}
                            value={limits?.[limitSection]?.creditType}
                            onChange={limitSection === 'users' ? updateUserLimits : updateGuestLimits}>
                              <NekoOption key={'queries'} id={'queries'} value={'queries'} label={"Queries"} />
                              <NekoOption key={'units'} id={'units'} value={'units'} label={"Tokens"} />
                              <NekoOption key={'price'} id={'price'} value={'price'} label={"Dollars"} />
                          </NekoSelect>
                        </div>
                      </div>

                      {limits?.[limitSection]?.credits !== 0 && <p>
                        If you want to apply variable amount of credits, <a href="https://meowapps.com/ai-engine/faq/#limits" target="_blank">click here</a>.
                      </p>}

                      {limits?.[limitSection]?.credits !== 0 && limits?.[limitSection].creditType === 'price' &&
                        <p>The dollars represent the budget you spent through OpenAI.</p>
                      }

                      {limits?.[limitSection]?.credits === 0 && <p>
                        Since there are no credits, the Message for No Credits Message with be displayed.
                      </p>}


                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col">
                          <label>Time Frame:</label>
                          <NekoSelect scrolldown id="timeFrame" name="timeFrame" disabled={!limits?.enabled}
                            value={limits?.[limitSection]?.timeFrame} 
                            onChange={limitSection === 'users' ? updateUserLimits : updateGuestLimits}>
                              <NekoOption key={'day'} id={'day'} value={'day'} label={"Day"} />
                              <NekoOption key={'week'} id={'week'} value={'week'} label={"Week"} />
                              <NekoOption key={'month'} id={'month'} value={'month'} label={"Month"} />
                              <NekoOption key={'year'} id={'year'} value={'year'} label={"Year"} />
                          </NekoSelect>
                        </div>
                        <div className="mwai-builder-col">
                          <label>Is Absolute:</label>
                          <NekoCheckbox id="isAbsolute" label="Yes" disabled={!limits?.enabled}
                            checked={limits?.[limitSection]?.isAbsolute} value="1"
                            onChange={limitSection === 'users' ? updateUserLimits : updateGuestLimits}
                          />
                        </div>
                      </div>
                      {limits?.[limitSection]?.isAbsolute && <p>
                        With absolute, a day represents <i>today</i>. Otherwise, it represent the <i>past 24 hours</i>. The same logic applies to the other time frames.
                      </p>}

                      <div className="mwai-builder-row">
                        <div className="mwai-builder-col">
                          <label>Message for No Credits:</label>
                          <NekoInput id="overLimitMessage" name="overLimitMessage" disabled={!limits?.enabled}
                            value={limits?.[limitSection]?.overLimitMessage}
                            onBlur={limitSection === 'users' ? updateUserLimits : updateGuestLimits} />
                        </div>
                      </div>

                      {limitSection === 'users' && <div className="mwai-builder-row">
                        <div className="mwai-builder-col">
                          <label>Full-Access Users:</label>
                          <NekoSelect scrolldown id="ignoredUsers" name="ignoredUsers" disabled={!limits?.enabled}
                            value={limits?.users?.ignoredUsers} description="" onChange={updateUserLimits}>
                              <NekoOption key={'none'} id={'none'} value={''}
                                label={"None"} />
                              <NekoOption key={'editor'} id={'editor'} value={'administrator,editor'}
                                label={"Editors & Admins"} />
                              <NekoOption key={'admin'} id={'admin'} value={'administrator'}
                                label={"Admins Only"} />
                          </NekoSelect>
                        </div>
                      </div>}

                    </NekoBlock>
                  </StyledBuilderForm>
                </NekoColumn>
              </NekoWrapper>
            </NekoTab>}

            <NekoTab title='Fine Tuning: Train your AI'>
              <FineTuning options={options} updateOption={updateOption} />
            </NekoTab>

            <NekoTab key="openai-status" title={<>OpenAI Status{accidentsPastDay > 0 ? <>&nbsp;⚠️</> : ""}</>}>
              <OpenAIStatus incidents={incidents} isLoading={isLoadingIncidents} />
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