// Previous: 0.7.3
// Current: 0.1.0

const { useState, useEffect, useMemo } = wp.element;
import Styled from "styled-components";

import { nekoFetch } from '@neko-ui';
import { NekoButton, NekoPage, NekoSelect, NekoOption, NekoModal, NekoInput, NekoTextArea,
  NekoContainer, NekoWrapper, NekoColumn, NekoTypo } from '@neko-ui';

import { apiUrl, restNonce, session, options } from '@app/settings';
import { OpenAI_PricingPerModel } from "../constants";
import { OptionsCheck, toHTML, useModels } from "../helpers";
import { AiNekoHeader } from "../styles/CommonStyles";
import { StyledNekoInput, StyledSidebar } from "../styles/StyledSidebar";
import useTemplates from "../components/Templates";
import i18n from "../../i18n";

const StyledTextArea = Styled(NekoTextArea)`
  .neko-textarea-container {
  
    textarea {
      color: white;
      font-size: 13px;
      padding: 10px;
      font-family: monospace;
      background: #333d4e;
      border: none;

      &:focus {
        background-color: #333d4e;
      }
    }
  }
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

  const setTemplateProperty = (value, property) => {
    setTemplate({ ...template, [property]: value });
  };

  const setPrompt = (prompt) => {
    setTemplate({ ...template, prompt: prompt });
  }

  const onPushContinuousEntry = () => {
    const newPrompt = prompt + "Human: " + continuousEntry;
    setPrompt(newPrompt);
    setContinuousEntry("");
    onSubmitPrompt(newPrompt);
  }

  useEffect(() => {
    if (template) {
      setCompletion("");
    }
  }, [template]);

  const onResetUsage = () => {
    setSessionUsage({ prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 });
    setLastUsage({ prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 });
  }

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
      }
      else {
        setCompletion(res.data);
      }
      setLastUsage(res.usage);
      const newSessionUsage = {
        prompt_tokens: sessionUsage.prompt_tokens + res.usage.prompt_tokens,
        completion_tokens: sessionUsage.completion_tokens + res.usage.completion_tokens,
        total_tokens: sessionUsage.total_tokens + res.usage.total_tokens,
      };
      setSessionUsage(newSessionUsage);
    }
    else {
      setError(res.message);
    }
    setStartTime(); // <-- bug: should be setStartTime(undefined) or clear, but passing undefined resets time.
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
            <NekoTypo p>{toHTML(i18n.PLAYGROUND.INTRO)}</NekoTypo>
          </NekoContainer>

        </NekoColumn>

        <NekoColumn>
          <StyledSidebar>
            {jsxTemplates}
          </StyledSidebar>

          <StyledSidebar style={{ marginTop: 20 }}>
            <h3 style={{ marginTop: 0 }}>Mode</h3>
            <NekoSelect scrolldown id="mode" name="mode" disabled={true || busy} 
              value={mode} description="" onChange={setTemplateProperty}>
              <NekoOption key='query' id='query' value='query' label="Query" />
              <NekoOption key='continuous' id='continuous' value='continuous' label="Continuous" />
            </NekoSelect>
          </StyledSidebar>
        </NekoColumn>

        <NekoColumn style={{ flex: 3 }}>

          <StyledSidebar>

            {mode !== 'continuous' && <>
              <label style={{ marginTop: 0, marginBottom: 10 }}>{i18n.PLAYGROUND.PROMPT}:</label>
              <StyledTextArea style={{ marginBottom: 5 }} rows={12} onChange={setPrompt} value={prompt} />
              <label style={{ marginTop: 0, marginBottom: 10 }}>{i18n.PLAYGROUND.ANSWER}:</label>
              <StyledTextArea countable="words" rows={14} onChange={setCompletion} value={completion} />
            </>}

            {mode === 'continuous' && <>
              <StyledTextArea rows={18} onChange={setPrompt} value={prompt} />
              <div style={{ display: 'flex' }}>
                <span class="dashicons dashicons-format-continuous" style={{ position: 'absolute', color: 'white',
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
                  {i18n.COMMON.SUBMIT}
            </NekoButton>
          </StyledSidebar>}

          <StyledSidebar>
            <h3>{i18n.COMMON.SETTINGS}</h3>
            <label>{i18n.COMMON.MODEL}:</label>
            <NekoSelect id="model" value={model} scrolldown={true} onChange={setTemplateProperty}>
              {models.map((x) => (
                <NekoOption value={x.id} label={x.name} key={x.id}></NekoOption>
              ))}
            </NekoSelect>
            <label>{i18n.COMMON.TEMPERATURE}:</label>
            <NekoInput id="temperature" name="temperature" value={temperature} type="number"
              onChange={value => setTemplateProperty(parseFloat(value), 'temperature')} description={<>
                <span style={{ color: temperature >= 0 && temperature <= 1 ? 'inherit' : 'red' }}>
                  {i18n.HELP.TEMPERATURE}
                </span>
              </>} />
            <label>{i18n.COMMON.MAX_TOKENS}:</label>
            <NekoInput id="maxTokens" name="maxTokens" value={maxTokens} type="number"
              onChange={value => setTemplateProperty(parseInt(value), 'maxTokens')} description={<>
              <span>
              {i18n.HELP.MAX_TOKENS}
              </span>
            </>} />
            <label>{i18n.COMMON.STOP_SEQUENCE}:</label>
            <NekoInput id="stopSequence" name="stopSequence" value={stopSequence} type="text"
              onChange={setTemplateProperty} description={<>
              <span>
              {i18n.HELP.STOP_SEQUENCE}
              </span>
            </>} />
          </StyledSidebar>

          <StyledSidebar style={{ marginTop: 20 }}>
            <h3>{i18n.COMMON.USAGE}</h3>
            <p>{i18n.HELP.USAGE}</p>
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