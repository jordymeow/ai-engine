// Previous: 0.6.6
// Current: 0.6.8

const { useState, useEffect, useMemo } = wp.element;
import Styled from "styled-components";

import { nekoFetch } from '@neko-ui';
import { NekoButton, NekoPage, NekoSelect, NekoOption, NekoModal, NekoInput, NekoTextArea,
  NekoContainer, NekoWrapper, NekoColumn, NekoTypo } from '@neko-ui';

import { apiUrl, restNonce, session, options } from '@app/settings';
import { OpenAI_PricingPerModel } from "../constants";
import { OptionsCheck, useModels } from "../helpers";
import { AiNekoHeader } from "../styles/CommonStyles";
import { StyledNekoInput, StyledSidebar } from "../styles/StyledSidebar";
import useTemplates from "../components/Templates";

const StyledTextArea = Styled.textarea`
  display: block;
  height: 360px;
  width: 100%;
  margin-bottom: 10px;
  background: #333d4e;
  border-radius: 5px;
  border: none;
  color: white;
  font-size: 13px;
  font-family: monospace;
  padding: 10px;
`;

const Dashboard = () => {
  const { template, setTemplate, resetTemplate, jsxTemplates } = useTemplates('playground');
  const [completion, setCompletion] = useState("");
  const { models } = useModels(options);

  const [busy, setBusy] = useState(false);
  const [continuousEntry, setContinuousEntry] = useState('');
  const [sessionUsage, setSessionUsage] = useState({ prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 });
  const [lastUsage, setLastUsage] = useState({ prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 });
  const [startTime, setStartTime] = useState();
  const [error, setError] = useState();

  const prompt = template?.prompt ?? "";
  const model = template?.model ?? "text-davinci-003";
  const mode = template?.mode ?? "query";
  const temperature = template?.temperature ?? 1;
  const stopSequence = template?.stopSequence ?? "";
  const maxTokens = template?.maxTokens ?? 2048;

  const setPrompt = (prompt) => {
    setTemplate({ ...template, prompt: prompt });
  };

  const setModel = (model) => {
    setTemplate({ ...template, model: model });
  };

  const setMode = (mode) => {
    setTemplate({ ...template, mode: mode });
  };

  const setTemperature = (temperature) => {
    setTemplate({ ...template, temperature: parseFloat(temperature) });
  };

  const setStopSequence = (stopSequence) => {
    setTemplate({ ...template, stopSequence: stopSequence });
  };

  const setMaxTokens = (maxTokens) => {
    setTemplate({ ...template, maxTokens: parseInt(maxTokens) });
  };

  const onPushContinuousEntry = () => {
    const newPrompt = prompt + "Human: " + continuousEntry;
    setPrompt(newPrompt);
    setContinuousEntry("");
    onSubmitPrompt(newPrompt);
  };

  useEffect(() => {
    if (template) {
      setCompletion("");
    }
  }, [template]);

  const onResetUsage = () => {
    setSessionUsage({ prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 });
    setLastUsage({ prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 });
  };

  const onSubmitPrompt = async (promptToUse = prompt) => {
    setBusy(true);
    setStartTime(new Date());
    const stop = stopSequence.replace(/\\n/g, '\n');
    const res = await nekoFetch(`${apiUrl}/make_completions`, { 
      method: 'POST',
      nonce: restNonce,
      json: {
        env: 'playground',
        session: session,
        prompt: promptToUse,
        temperature,
        model,
        maxTokens: maxTokens,
        stop: stop
    }});
    console.log("Completions", { prompt: promptToUse, result: res });
    if (res.success) {
      if (mode === 'continuous') {
        setPrompt(promptToUse + '\n' + res.data + '\n');
      } else {
        setCompletion(res.data);
      }
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
    setStartTime(null);
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
        
        <NekoColumn full>

          <OptionsCheck options={options} />

          <NekoContainer style={{ marginBottom: 0 }}>
            <NekoTypo p>Welcome to the AI Playground! Here, you can play with different AI models and ask the UI to perform various tasks for you. You can ask it to write, rewrite, or translate an article, categorize words or elements into groups, write an email, etc. <b>Let me know if there are any new features you would like to see!</b> Have fun 🥳</NekoTypo>
          </NekoContainer>

        </NekoColumn>

        <NekoColumn>
          <StyledSidebar>
            {jsxTemplates}
          </StyledSidebar>

          <StyledSidebar style={{ marginTop: 20 }}>
            <h3 style={{ marginTop: 0 }}>Mode</h3>
            <NekoSelect scrolldown id="mode" name="mode" disabled={busy} 
              value={mode} description="" onChange={setMode}>
              <NekoOption key='query' id='query' value='query' label="Query" />
              <NekoOption key='continuous' id='continuous' value='continuous' label="Continuous" />
            </NekoSelect>
          </StyledSidebar>
        </NekoColumn>

        <NekoColumn style={{ flex: 3 }}>

          <StyledSidebar>

            {mode !== 'continuous' && <>
              <label style={{ marginTop: 0, marginBottom: 10 }}>Query / Prompt:</label>
              <StyledTextArea style={{ marginBottom: 10, height: 160 }} rows={8}
                onChange={(e) => { setPrompt(e.target.value) }} value={prompt} />
              <label style={{ marginTop: 0, marginBottom: 10 }}>Answer:</label>
              <StyledTextArea style={{ marginBottom: 10, height: 300 }} value={completion} />
            </>}

            {mode === 'continuous' && <>
              <StyledTextArea onChange={(e) => { setPrompt(e.target.value) }} value={prompt} />
              <div style={{ display: 'flex', position: 'relative' }}>
                <span className="dashicons dashicons-format-continuous" style={{ position: 'absolute', color: 'white',
                  zIndex: 200, fontSize: 28, marginTop: 12, marginLeft: 10 }}></span>
                <StyledNekoInput id="continuousEntry" value={continuousEntry} onChange={setContinuousEntry}
                  onEnter={onPushContinuousEntry} disabled={busy} />
              </div>
            </>}

          </StyledSidebar>
        </NekoColumn>

        <NekoColumn>

          {mode === 'query' && <StyledSidebar style={{ marginBottom: 20 }}>
            <NekoButton fullWidth onClick={() => { onSubmitPrompt() }} isBusy={busy} startTime={startTime}
                style={{ height: 50, fontSize: 14, flex: 4 }}>
                  Submit
            </NekoButton>
          </StyledSidebar>}

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
              onBlur={(e) => { setTemperature(parseFloat(e.target.value)) }} description={<>
                <span style={{ color: temperature >= 0 && temperature <= 1 ? 'inherit' : 'red' }}>
                  Between 0 and 1. Higher values means the model will take more risks.
                </span>
              </>} />
            <label>Max Tokens:</label>
            <NekoInput id="maxTokens" name="maxTokens" value={maxTokens} type="number"
              onBlur={(e) => { setMaxTokens(parseInt(e.target.value)) }} description={<>
              <span>
                The maximum number of tokens to generate. The model will stop generating once it hits this limit.
              </span>
            </>} />
            <label>Stop Sequence:</label>
            <NekoInput id="stopSequence" name="stopSequence" value={stopSequence} type="text"
              onChange={setStopSequence} onBlur={setStopSequence} description={<>
              <span>
                The sequence of tokens that will cause the model to stop generating text. You absolutely need this with fine-tuned models.
              </span>
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

      <NekoModal isOpen={error}
        onRequestClose={() => { setError() }}
        onOkClick={() => { setError() }}
        title="Error"
        content={<p>{error}</p>}
      />

    </NekoPage>
  );
};

export default Dashboard;