// Previous: 0.1.9
// Current: 0.2.0

const { useState, useEffect, useMemo } = wp.element;
import Styled from "styled-components";

import { postFetch } from '@neko-ui';
import { NekoButton, NekoPage, NekoHeader, NekoSelect, NekoOption, NekoModal, NekoInput,
  NekoContainer, NekoWrapper, NekoColumn, NekoTypo } from '@neko-ui';

import { apiUrl, restNonce, options } from '@app/settings';
import { OpenAI_models, OpenAI_PricingPerModel } from "../constants";
import { OptionsCheck, useModels } from "../helpers";
import { AiNekoHeader } from "./CommonStyles";

const templates = [
  {
    id: 'none',
    name: 'None',
    mode: 'query',
    description: ''
  }, {
    id: 'wp_assistant',
    name: 'WordPress Assistant',
    mode: 'chat',
    description: `Converse as a WordPress expert. Be helpful, friendly, concise, avoid external URLs and commercial solutions.\n
      AI: Hi! How can I help you with WP today?`
  }, {
    id: 'article_translator',
    name: 'Article Translator',
    mode: 'query',
    description: `Translate this article into French:\n
      Uchiko is located in Ehime prefecture, in the west of the island. The town was prosperous at the end of the 19th century thanks to its production of very good quality white wax. This economic boom allowed wealthy local merchants to build beautiful properties, whose heritage is still visible throughout the town.\n\n`,
  }, {
    id: 'article_writer',
    name: 'Article Writer',
    mode: 'query',
    description: 'Write an article about what to do in Paris, in summer, with a few recommendations of restaurants and cafes.\n\n',
  }, {
    id: 'bulk_articles_writer',
    name: 'Bulk Articles Writer',
    mode: 'query',
    description: `Write titles (TITLE: ) and very short paragraphs (CONTENT: ) for each following topic. Keywords for each topic will be added between parenthesis.\n
      - When to travel to France (seasons, food, ambiance, celebrations)
      - Why one should visit the French countryside (beach, forest, mountain, food, people)
      - Story of a night at Mont Saint-Michel (hotel, ambiance, sea, light)
      - Differences between South West and South East of France (people, food, beach, ambiance)\n`,
  }, {
    id: 'article_corrector',
    name: 'Article Corrector',
    mode: 'query',
    description: 'Fix the grammar and spelling mistakes in this text:\n\nI wake up at eleben yesderday, I will go bed eary tonigt.\n',
  }, {
    id: 'seo_assistant',
    name: 'SEO Assistant',
    mode: 'query',
    description: `For the following article, write a SEO-friendly and short title, keywords for Google, and a short excerpt to introduce it. Use this format:

      Title: 
      Keywords: 
      Excerpt: 
      
      Uchiko is located in Ehime prefecture, in the west of the island. The town was prosperous at the end of the 19th century thanks to its production of very good quality white wax. This economic boom allowed wealthy local merchants to build beautiful properties, whose heritage is still visible throughout the town.
    `,
  }
];

const StyledTextArea = Styled.textarea`
  display: block;
  height: 460px;
  width: 100%;
  margin-bottom: 10px;
  background: #333d4e;
  border-radius: 5px;
  border: none;
  color: #d1d5dc;
  font-size: 14px;
  font-family: monospace;
  padding: 20px;
`;

const StyledSidebar = Styled.div`
  background: white;
  padding: 15px;
  border-radius: 5px;

  h3:first-child {
    margin-top: 0;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  label {
    margin-top: 10px;
  }

  li {
    margin-bottom: 10px;
    border: 1px solid #e5e5e5;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  li.active {
    background: #037cba;
    color: white;
    border-color: #037cba;
  }
`;

const StyledNekoInput = Styled(NekoInput)`
  flex: auto !important;

  input {
    height: 50px !important;
    font-size: 14px !important;
    font-family: monospace !important;
    padding: 20px 20px 20px 45px !important;
    border-color: #333d4e !important;
    background: #333d4e !important;
    color: white !important;
  }
`;

const Dashboard = () => {
  const [error, setError] = useState();
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('chat');
  const [entry, setEntry] = useState('');
  const { models, model, setModel } = useModels(options);
  const [temperature, setTemperature] = useState(1);
  const [busy, setBusy] = useState(false);
  const [sessionUsage, setSessionUsage] = useState({ prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 });
  const [lastUsage, setLastUsage] = useState({ prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 });
  const [template, setTemplate] = useState(templates[1]);

  const onValidateEntry = () => {
    const newPrompt = `${prompt}\nHuman: ${entry}`;
    setPrompt(newPrompt);
    setEntry('');
    onSubmitPrompt(newPrompt);
  };

  useEffect(() => {
    const desc = template.description;
    let lines = desc.split('\n').map(line => line.trim());
    lines = lines.join('\n');
    setPrompt(lines);
    setMode(template.mode);
  }, [template]);

  const onResetUsage = () => {
    setSessionUsage({ prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 });
    setLastUsage({ prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 });
  };

  const onSubmitPrompt = async (promptToUse = prompt) => {
    console.log('onSubmitPrompt', { promptToUse });
    setBusy(true);
    const res = await postFetch(`${apiUrl}/make_completions`, { json: { 
      prompt: promptToUse, temperature, model
    }, nonce: restNonce });
    console.log("Completions", { prompt: promptToUse, result: res });
    if (res.success) {
      setPrompt(promptToUse + '\n' + res.data);
      setLastUsage(res.usage);
      const newSessionUsage = {
        prompt_tokens: sessionUsage.prompt_tokens + res.usage.prompt_tokens,
        completion_tokens: sessionUsage.completion_tokens + res.usage.completion_tokens,
        total_tokens: sessionUsage.total_tokens + res.usage.total_tokens,
      };
      setSessionUsage(newSessionUsage);
    } else {
      setError(res.message);
    }
    setBusy(false);
  };

  const { sessionPrice, lastRequestPrice } = useMemo(() => {
    let sessionPrice = 0;
    let lastRequestPrice = 0;
    const modelPrice = OpenAI_PricingPerModel.find(x => model && model.includes(x.model));
    if (modelPrice) {
      sessionPrice = (sessionUsage.total_tokens / 1000 * modelPrice.price).toFixed(4);
      lastRequestPrice = (lastUsage.total_tokens / 1000 * modelPrice.price).toFixed(4);
    }
    return { sessionPrice, lastRequestPrice };
  }, [sessionUsage, lastUsage]);

  return (
    <NekoPage nekoErrors={[]}>

      <AiNekoHeader title="Playground" />

      <NekoWrapper>

        <OptionsCheck options={options} />
        
        <NekoColumn full>

          <NekoContainer style={{ marginBottom: 0 }}>
            <NekoTypo p>Welcome to the AI Playground! Here, you can play with different AI models and ask the UI to perform various tasks for you. You can ask it to write, rewrite, or translate an article, categorize words or elements into groups, write an email, etc. <b>Let me know if there are any new features you would like to see!</b> Have fun 🥳</NekoTypo>
          </NekoContainer>

        </NekoColumn>

        <NekoColumn>
          <StyledSidebar>
            <h3 style={{ marginTop: 0 }}>Templates</h3>
            <ul>
              {templates.map((x) => (
                <li key={x.id} className={template.id === x.id ? 'active' : ''} onClick={() => { setTemplate(x) }}>
                  {x.name}
                </li>
              ))}
            </ul>
            <h3 style={{ marginTop: 0 }}>Mode</h3>
            <NekoSelect scrolldown id="mode" name="mode" disabled={busy} 
              value={mode} description="" onChange={setMode}>
              <NekoOption key='chat' id='chat' value='chat' label="Chat" />
              <NekoOption key='query' id='query' value='query' label="Query" />
            </NekoSelect>
          </StyledSidebar>
        </NekoColumn>

        <NekoColumn style={{ flex: 3 }}>
          <StyledTextArea onChange={(e) => { setPrompt(e.target.value) }} value={prompt} />
          {mode === 'chat' && 
            <div style={{ display: 'flex', position: 'relative' }}>
              <span className="dashicons dashicons-format-chat" style={{ position: 'absolute', color: 'white',
                zIndex: 200, fontSize: 28, top: 12, left: 10 }}></span>
              <StyledNekoInput id="entry" value={entry} onChange={(val) => setEntry(val)} onEnter={onValidateEntry} disabled={busy} />
            </div>
          }
          {mode !== 'chat' && <NekoButton onClick={() => { onSubmitPrompt() }} disabled={busy}
            style={{ height: 50, fontSize: 18, width: '100%' }}>
              Submit
          </NekoButton>}
        </NekoColumn>

        <NekoColumn>

          <StyledSidebar>
            <h3>Settings</h3>
            <label>Model:</label>
            <NekoSelect id="models" value={model} scrolldown={true} onChange={setModel}>
              {models.map((x) => (
                <NekoOption key={x.id} value={x.id} label={x.name}></NekoOption>
              ))}
            </NekoSelect>
            <label>Temperature:</label>
            <NekoInput id="temperature" name="temperature" value={temperature} type="number"
              onChange={setTemperature} onBlur={(e) => setTemperature(parseFloat(e.target.value))} description={<>
                <span style={{ color: temperature >= 0 && temperature <= 1 ? 'inherit' : 'red' }}>
                  Between 0 and 1.
                </span> Higher values means the model will take more risks.
              </>} />
          </StyledSidebar>

          <StyledSidebar style={{ marginTop: 20 }}>
            <h3>Usage</h3>
            <p>Keeps track of the current usage of the AI.</p>
            <h4>Session</h4>
            <div>Tokens: {sessionUsage.total_tokens}</div>
            <div>Price: ${sessionPrice}</div>

            <h4>Last Request</h4>
            <div>Tokens: {lastUsage.total_tokens}</div>
            <div>Price: ${lastRequestPrice}</div>

            <NekoButton style={{ marginTop: 10, width: '100%' }} onClick={onResetUsage}>Reset Usage</NekoButton>
          </StyledSidebar>

        </NekoColumn>

      </NekoWrapper>

      <NekoModal isOpen={Boolean(error)}
        onRequestClose={() => { setError() }}
        onOkClick={() => { setError() }}
        title="Error"
        content={<p>{error}</p>}
      />

    </NekoPage>
  );
};

export default Dashboard;