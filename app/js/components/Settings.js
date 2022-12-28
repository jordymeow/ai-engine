// Previous: none
// Current: 0.0.3

const { useState, useEffect } = wp.element;

import { NekoButton, NekoInput, NekoTypo, NekoPage, NekoBlock, NekoHeader, NekoContainer, NekoSettings,
  NekoTabs, NekoTab, NekoCheckboxGroup, NekoCheckbox, NekoWrapper, NekoColumn } from '@neko-ui';
import { postFetch } from '@neko-ui';

import { apiUrl, restNonce, options as defaultOptions } from '@app/settings';
import { OpenAI_PricingPerModel } from '../constants';

const Settings = () => {
  const [ options, setOptions ] = useState(defaultOptions);
  const [ busyAction, setBusyAction ] = useState(false);
  const busy = busyAction;

  const module_titles = options?.module_titles;
  const module_excerpts = options?.module_excerpts;
  const module_blocks = options?.module_blocks;
  const shortcode_chat = options?.shortcode_chat;
  const openai_apikey = options?.openai_apikey;
  const openai_usage = options?.openai_usage;

  console.log(openai_usage);

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
  };

  const jsxAiFeatures =
    <NekoSettings title="Assistants">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="module_titles" label="Titles" value="1" checked={module_titles}
          description="Create a choice of titles based on your content."
          onChange={updateOption} />
        <NekoCheckbox id="module_excerpts" label="Excerpt" value="1" checked={module_excerpts}
        description="Create a choice of excerpts based on your content."
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxAiBlocks = 
    <NekoSettings title="Blocks">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="module_blocks" label="Enable (Coming soon)" disabled={true} value="1" checked={module_blocks}
          description="Add Gutenberg AI Blocks in the editor. They will allow you to easily create content with AI."
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxShortcodes =
    <NekoSettings title="Shortcodes">
      <NekoCheckboxGroup max="1">
        <NekoCheckbox id="shortcode_chat" label="Chat" value="1" checked={shortcode_chat}
          description={<>
            Create a chat similar to ChatGPT with a shortcode:<br />
            [mwai_chat context="Converse as if you were Michael Jackson, talking from the afterlife." ai_prompt="Michael: " user_prompt="You: " start_sentence="Hi, my friend."]
          </>}
          onChange={updateOption} />
      </NekoCheckboxGroup>
    </NekoSettings>;

  const jsxOpenAiApiKey =
    <NekoSettings title="API Key">
      <NekoInput id="openai_apikey" name="openai_apikey" value={openai_apikey}
        description={<>You can get your API Keys in your <a href="https://beta.openai.com/account/api-keys" target="_blank" rel="noopener noreferrer">OpenAI Account</a>.</>} onBlur={updateOption} />
    </NekoSettings>;

  const jsxOpenAiUsage =
    <NekoSettings title="Usage">
      {!openai_usage && <NekoTypo p>N/A</NekoTypo>}
      {openai_usage && <>
        <ul style={{ marginTop: 2 }}>
          {Object.keys(openai_usage).map((month, index) => {
            const monthUsage = openai_usage[month];
            return (
              <li key={index}>
                <strong>🗓️ {month}</strong>
                <ul>
                  {Object.keys(monthUsage).map((model, index) => {
                    const modelUsage = monthUsage[model];
                    let price = null;
                    let modelPrice = OpenAI_PricingPerModel.find(x => model.includes(x.model));
                    if (modelPrice) {
                      price = (modelUsage.total_tokens / 1000 * modelPrice.price).toFixed(2);
                    }
                    return (
                      <li key={index} style={{ marginTop: 10, marginLeft: 20 }}>
                        <strong>🧠 Model: {model}</strong>
                        <ul style={{ marginTop: 5, marginLeft: 18 }}>
                          <li>Prompt Tokens: {modelUsage.prompt_tokens}</li>
                          <li>Completion Tokens: {modelUsage.completion_tokens}</li>
                          <li>Total Tokens: <b>{modelUsage.total_tokens}</b> {price && <> ~&gt; 💰 <b>${price}</b></>}</li>
                        </ul>
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
        This is only given as an indication. For the exact amounts, please check your <a href="https://beta.openai.com/account/usage" target="_blank" rel="noopener noreferrer">Usage at OpenAI</a>.
      </p>
    </NekoSettings>;

  const handleRefreshUsage = () => {
    // simulate stale closure bug by using outdated openai_usage
    // Recall: This function is not used in the original code, just simulating a subtle bug
    console.log("Refreshing usage data...");
    // Suppose it triggers re-fetch but references outdated openai_usage
  };

  useEffect(() => {
    // Introduce a potential bug: missing dependency causes multiple fetches
    if (!openai_usage) {
      // buggy: no dependency array, causing repeated fetches or unintended re-renders
      (async () => {
        try {
          const response = await postFetch(`${apiUrl}/get_usage`, { json: {}, nonce: restNonce });
          if (response?.usage) {
            setOptions(prev => ({ ...prev, openai_usage: response.usage }));
          }
        } catch(e) {
          // silent failure
        }
      })();
    }
  }, []);

  return (
    <NekoPage>

      <NekoHeader title='The AI Engine | Settings' subtitle='By Jordy Meow'>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <NekoButton className='header' icon='cat'
            onClick={() => location.href = 'tools.php?page=mwai_dashboard'}>
            AI Playground
          </NekoButton>
        </div>
      </NekoHeader>

      <NekoWrapper>

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

          </NekoTabs>

        </NekoColumn>

      </NekoWrapper>

    </NekoPage>
  );
};

export default Settings;