// Previous: 1.3.79
// Current: 1.6.0

const { useState, useEffect, useMemo } = wp.element;
import Styled from "styled-components";

import { nekoFetch } from '@neko-ui';
import { NekoButton, NekoPage, NekoSelect, NekoOption, NekoModal, NekoInput, NekoTextArea,
  NekoContainer, NekoWrapper, NekoColumn, NekoTypo, NekoSpacer } from '@neko-ui';

import { apiUrl, restNonce, session, options } from '@app/settings';
import { OptionsCheck, toHTML, useModels } from "../helpers";
import { AiNekoHeader } from "../styles/CommonStyles";
import { StyledNekoInput, StyledSidebar } from "../styles/StyledSidebar";
import useTemplates from "../components/Templates";
import i18n from "../../i18n";
import UsageCosts from "../components/UsageCosts";

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
  const { template, setTemplate, jsxTemplates } = useTemplates('playground');
  const [completion, setCompletion] = useState("");
  const { completionModels } = useModels(options);
  const { addUsage, jsxUsageCosts } = UsageCosts(options);

  const [busy, setBusy] = useState(false);
  const [continuousEntry, setContinuousEntry] = useState('');
  const [startTime, setStartTime] = useState();
  const [error, setError] = useState();

  const prompt = useMemo(() => template?.prompt ?? "", [template]);
  const model = useMemo(() => template?.model ?? "gpt-3.5-turbo", [template]);
  const mode = useMemo(() => template?.mode ?? "query", [template]);
  const temperature = useMemo(() => template?.temperature ?? 1, [template]);
  const stopSequence = useMemo(() => template?.stopSequence ?? "", [template]);
  const maxTokens = useMemo(() => template?.maxTokens ?? 2048, [template]);

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

  const onSubmitPrompt = async (promptToUse = prompt) => {
    setBusy(true);
    setStartTime(new Date());
    try {
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
      if (mode === 'continuous') {
        setPrompt(promptToUse + '\n' + res.data + '\n');
      }
      else {
        setCompletion(res.data);
      }
      addUsage(model, res?.usage?.total_tokens || 0);
    }
    catch (err) {
      setError(err.message);
    }
    setStartTime();
    setBusy(false);
  };

  return (
    <NekoPage nekoErrors={[]}>

      <AiNekoHeader title={i18n.COMMON.PLAYGROUND} />

      <NekoWrapper>
        
        <NekoColumn fullWidth>

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
            <NekoSelect scrolldown name="mode" disabled={true || busy} 
              value={mode} description="" onChange={setTemplateProperty}>
              <NekoOption key='query' value='query' label="Query" />
              <NekoOption key='continuous' value='continuous' label="Continuous" />
            </NekoSelect>
          </StyledSidebar>
        </NekoColumn>

        <NekoColumn style={{ flex: 3 }}>

          <StyledSidebar>

            {/* FORM FOOTER FOR "QUERY" MODE */}
            {mode !== 'continuous' && <>
              <label style={{ marginTop: 0, marginBottom: 10 }}>{i18n.PLAYGROUND.PROMPT}:</label>
              <StyledTextArea style={{ marginBottom: 5 }} rows={12} onChange={setPrompt} value={prompt} />
              <label style={{ marginTop: 0, marginBottom: 10 }}>{i18n.PLAYGROUND.ANSWER}:</label>
              <StyledTextArea countable="words" rows={14} onChange={setCompletion} value={completion} />
            </>}

            {/* FORM FOOTER FOR "CHAT" MODE */}
            {mode === 'continuous' && <>
              <StyledTextArea rows={18} onChange={setPrompt} value={prompt} />
              <div style={{ display: 'flex' }}>
                <span class="dashicons dashicons-format-continuous" style={{ position: 'absolute', color: 'white',
                  zIndex: 200, fontSize: 28, marginTop: 12, marginLeft: 10 }}></span>
                <StyledNekoInput name="continuousEntry" value={continuousEntry} onChange={setContinuousEntry}
                  onEnter={onPushContinuousEntry} disabled={busy} />
              </div>
            </>}

          </StyledSidebar>
        </NekoColumn>

        <NekoColumn>

          {mode === 'query' && <>
            <StyledSidebar>
              <NekoButton fullWidth onClick={() => { onSubmitPrompt() }}
                isBusy={busy} startTime={startTime} style={{ height: 50, fontSize: 14, flex: 4 }}>
                  {i18n.COMMON.SUBMIT}
              </NekoButton>
            </StyledSidebar>
            <NekoSpacer height={30} />
          </>}

          <StyledSidebar>
            <h3>{i18n.COMMON.SETTINGS}</h3>
            <label>{i18n.COMMON.MODEL}:</label>
            <NekoSelect name="model" value={model} scrolldown={true} onChange={setTemplateProperty}>
              {completionModels.map((x) => (
                <NekoOption value={x.model} label={x.name}></NekoOption>
              ))}
            </NekoSelect>
            <label>{i18n.COMMON.TEMPERATURE}:</label>
            <NekoInput name="temperature" value={temperature} type="number"
              onChange={value => setTemplateProperty(parseFloat(value), 'temperature')} description={<>
                <span style={{ color: temperature >= 0 && temperature <= 1 ? 'inherit' : 'red' }}>
                  {i18n.HELP.TEMPERATURE}
                </span>
              </>} />
            <label>{i18n.COMMON.MAX_TOKENS}:</label>
            <NekoInput name="maxTokens" value={maxTokens} type="number"
              onChange={value => setTemplateProperty(parseInt(value), 'maxTokens')} description={<>
              <span>
              {i18n.HELP.MAX_TOKENS}
              </span>
            </>} />
            <label>{i18n.COMMON.STOP_SEQUENCE}:</label>
            <NekoInput name="stopSequence" value={stopSequence} type="text"
              onChange={setTemplateProperty} description={<>
              <span>
              {i18n.HELP.STOP_SEQUENCE}
              </span>
            </>} />
          </StyledSidebar>

          <NekoSpacer height={30} />

          {jsxUsageCosts}

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