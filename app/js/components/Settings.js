// Previous: 0.5.0
// Current: 0.5.2

const { useMemo, useState } = wp.element;

import { NekoButton, NekoInput, NekoTypo, NekoPage, NekoBlock, NekoContainer, NekoSettings,
  NekoSelect, NekoOption, NekoTabs, NekoTab, NekoCheckboxGroup, NekoCheckbox, NekoWrapper,
  NekoColumn, NekoTextArea } from '@neko-ui';
import { nekoFetch } from '@neko-ui';
import { useQuery } from '@tanstack/react-query';

import { LicenseBlock } from '@common';
import { apiUrl, prefix, domain, isRegistered, isPro, restNonce, pricing, pluginUrl,
  options as defaultOptions } from '@app/settings';

import { OptionsCheck, useModels } from '../helpers';
import { AiNekoHeader } from './CommonStyles';
import FineTuning from './FineTuning';
import OpenAIStatus from './OpenAIStatus';
import { StyledBuilderForm } from "./styles/StyledSidebar";
import { NekoColorPicker } from "./NekoColorPicker";

const chatAvatars = [
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
  const isChat = shortcodeParams?.mode === 'chat';
  const isImagesChat = shortcodeParams?.mode === 'images';
  const { isLoading: isLoadingIncidents, data: incidents } = useQuery({
    queryKey: ['openAI_status'], queryFn: retrieveIncidents
  });

  const avatar = shortcodeStyles?.avatar ?? 'chat-color-green.svg';

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
            price = modelUsage.images * (modelOptionPrice ? modelOptionPrice.price : 0);
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
          let modelPrice = pricing.find(x => x.model === realModel?.short);
          if (modelPrice) {
            price = (modelUsage.total_tokens / 1000) * (modelPrice?.price ?? 0);
            usageData[month].totalPrice += price;
            const name = realModel?.name ?? model;
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
        {Object.keys(usageData).map((month, index) => (
            <li key={index}>
              <strong>🗓️ {month} ({usageData[month].totalPrice.toFixed(2)}$)</strong>
              <ul>
                {usageData[month].data.map((data, idx) => (
                  <li key={idx} style={{ marginTop: 5, marginLeft: 18 }}>
                    <strong>• {data.name}</strong>
                    {data.isImage ? `: ${data.usage} images` : `: ${data.usage} tokens`}
                    {data.price > 0 && ` (${data.price.toFixed(2)}$)`}
                  </li>
                ))}
              </ul>
            </li>
          ))}
      </ul>
    );
  }, [ openai_usage, models ]);

  const jsxOpenAiUsage =
    <div>
      <h3>Usage</h3>
      <div style={{ marginTop: -10, marginBottom: 10, fontSize: 12 }}>
        For the exact amounts, please check your <a href="https://beta.openai.com/account/usage" target="_blank">OpenAI account</a>. If you would like to have better control on the amounts, add conditions or set limits to the usage of the AI, consider <a href="https://meowapps.com/ai-engine/" target="_blank">AI Engine Pro</a>.
      </div>
      {Object.keys(openai_usage).length === 0 && <NekoTypo p>N/A</NekoTypo>}
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

            {shortcode_chat && (
              <NekoTab title='Chatbot'>
                <NekoWrapper>

                  <NekoColumn minimal>
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

                    <NekoBlock busy={busy} title="Features" className="primary">
                      {jsxShortcodeFormatting}
                      {jsxShortcodeSyntaxHighlighting}
                    </NekoBlock>

                    <NekoBlock busy={busy} title="Styles" className="primary" action={
                      <NekoButton className="danger" onClick={onResetShortcodeStyles}>
                        Reset Styles
                      </NekoButton>}>
                      {/* Style configuration omitted for brevity */}
                    </NekoBlock>
                  </NekoColumn>

                  <NekoColumn minimal>
                    <NekoBlock busy={busy} title="Chatbot Builder" className="primary" action={
                      <NekoButton className="danger" onClick={onResetShortcodeParams}>
                        Reset Parameters
                      </NekoButton>}>

                      {/* Chatbot builder form omitted for brevity */}

                      <pre>
                        {builtShortcode}
                      </pre>
                    </NekoBlock>
                  </NekoColumn>

                </NekoWrapper>
              </NekoTab>
            )}

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