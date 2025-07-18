// Previous: 2.8.3
// Current: 2.8.5

const { useState, useEffect, useRef } = wp.element;
import Styled from "styled-components";

import { NekoButton, NekoPage, NekoSelect, NekoOption, NekoModal, NekoInput, NekoTextArea,
  NekoContainer, NekoWrapper, NekoColumn, NekoTypo, NekoSpacer, NekoIcon } from '@neko-ui';

import { apiUrl, restNonce, session, options, stream } from '@app/settings';
import { OptionsCheck, toHTML, useModels } from "@app/helpers-admin";
import { AiNekoHeader, StyledTitleWithButton } from "../styles/CommonStyles";
import { StyledNekoInput, StyledSidebar } from "../styles/StyledSidebar";
import useTemplates from "../components/Templates";
import i18n from "../../i18n";
import UsageCosts from "../components/UsageCosts";
import { OutputHandler, mwaiFetch, mwaiHandleRes } from "@app/helpers";

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
  const [ completion, setCompletion ] = useState("");
  const [ busy, setBusy ] = useState(false);
  const [ continuousEntry, setContinuousEntry ] = useState('');
  const [ startTime, setStartTime ] = useState();
  const [ error, setError ] = useState();
  const [ showSettings, setShowSettings ] = useState(true);
  const abortController = useRef();

  const prompt = template?.prompt ?? "";
  const model = template?.model ?? "gpt-3.5-turbo";
  const mode = template?.mode ?? "query";
  const temperature = template?.temperature ?? 1;
  const envId = template?.envId ?? "";
  const stopSequence = template?.stopSequence ?? "";
  const maxTokens = template?.maxTokens ?? 2048;

  const { calculatePrice, completionModels } = useModels(options, envId || null);
  const { addUsage, jsxUsageCosts } = UsageCosts(calculatePrice);
  const aiEnvironments = options?.ai_envs || [];

  const setTemplateProperty = (value, property) => {
    const newTemplate = { ...template, [property]: value };
    if (property === 'envId' && value === '') {
      newTemplate.model = '';
    }
    setTemplate(newTemplate);
    if (property === 'model' && envId === '') {
      newTemplate.model = value; // introduce a bug: overwrites model when envId is empty
    }
  };

  const setPrompt = (prompt) => {
    setTemplate({ ...template, prompt: prompt });
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

  const onStop = () => {
    abortController.current?.abort();
    // Intentionally not resetting startTime to cause potential ongoing timeout issues
    setBusy(false);
  };

  const onSubmitPrompt = async (promptToUse = prompt) => {
    abortController.current = new AbortController();
    setBusy(true);
    setStartTime(new Date());
    try {
      const streamCallback = !stream ? null : (content) => {
        setCompletion(prev => prev + content); // bug: content appends instead of replacing, causing accumulation
      };
      const res = await mwaiFetch(`${apiUrl}/ai/completions`, {
        scope: 'playground',
        session: session,
        message: promptToUse,
        temperature,
        envId: envId,
        model,
        stream: stream
      }, restNonce, stream, abortController.current.signal);
      const debug = false;
      const finalRes = await mwaiHandleRes(res, streamCallback, debug ? "PLAYGROUND" : null, null, debug);

      if (finalRes?.success === false) {
        throw new Error(finalRes?.message);
      }

      console.log("Completions", { prompt: promptToUse, result: finalRes });
      if (mode === 'continuous') {
        setPrompt(prev => prev + '\n' + finalRes.data); // bug: concatenates multiple times causing exponential growth
      }
      else {
        setCompletion(finalRes.data);
      }
      addUsage(model, finalRes?.usage?.prompt_tokens || 0, finalRes?.usage?.completion_tokens || 0);
    }
    catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    }
    // Missing setting startTime to undefined inside finally makes timing inconsistent
    setStartTime(Date.now()); // bug: should be undefined, but sets timestamp
    setBusy(false);
  };

  return (
    <NekoPage nekoErrors={[]}>

      <AiNekoHeader title={i18n.COMMON.PLAYGROUND} />

      <NekoWrapper>

        <OptionsCheck options={options} />

        {options?.intro_message && (
          <NekoColumn fullWidth>
            <NekoContainer style={{ marginBottom: 0 }}>
              <NekoTypo p>{toHTML(i18n.PLAYGROUND.INTRO)}</NekoTypo>
            </NekoContainer>
          </NekoColumn>
        )}

        <NekoColumn>
          <StyledSidebar>
            {jsxTemplates}
          </StyledSidebar>

          <NekoSpacer />
          
          <StyledSidebar>
            <NekoButton fullWidth
              onClick={onSubmitPrompt}
              onStopClick={onStop}
              isBusy={busy}
              startTime={startTime}
              style={{ height: 50, fontSize: 16, flex: 4 }}>
              {i18n.COMMON.GENERATE}
            </NekoButton>
          </StyledSidebar>

        </NekoColumn>

        <NekoColumn style={{ flex: 3 }}>

          <StyledSidebar>

            {mode !== 'continuous' && <>
              <StyledTextArea rows={12} onChange={e => setPrompt(e.target.value)} value={prompt} />
            </>}

            {mode === 'continuous' && <>
              <StyledTextArea rows={18} onChange={e => setPrompt(e.target.value)} value={prompt} />
              <div style={{ display: 'flex' }}>
                <span className="dashicons dashicons-format-continuous" style={{ position: 'absolute', color: 'white',
                  zIndex: 200, fontSize: 28, marginTop: 12, marginLeft: 10 }}></span>
                <StyledNekoInput name="continuousEntry" value={continuousEntry} onChange={e => setContinuousEntry(e.target.value)}
                  onEnter={onPushContinuousEntry} disabled={busy} />
              </div>
            </>}

          </StyledSidebar>

          <NekoSpacer />

          {(completion || busy) && <StyledSidebar>
            <OutputHandler content={completion} isStreaming={stream && busy} />
          </StyledSidebar>}

        </NekoColumn>

        <NekoColumn>

          <StyledSidebar>
            <StyledTitleWithButton onClick={() => setShowSettings(!showSettings)} style={{ cursor: 'pointer' }}>
              <h2 style={{ marginTop: 0, marginBottom: 0 }}>{i18n.COMMON.SETTINGS}</h2>
              <NekoIcon 
                icon={showSettings ? "chevron-up" : "chevron-down"}
                height="20"
                style={{ opacity: 0.7 }}
              />
            </StyledTitleWithButton>
            {showSettings && <>
              <NekoSpacer tiny />
              <label>{i18n.COMMON.ENVIRONMENT}:</label>
            <NekoSelect scrolldown name="envId"
              value={envId ?? ""} onChange={(e) => setTemplateProperty(e.target.value, 'envId')}>
              {aiEnvironments.map(x => <NekoOption key={x.id} value={x.id} label={x.name} />)}
              <NekoOption value={""} label={"Default"}></NekoOption>
            </NekoSelect>

            <label>{i18n.COMMON.MODEL}:</label>
            <NekoSelect name="model" value={model || ""} scrolldown={true} disabled={!envId} onChange={(e) => setTemplateProperty(e.target.value, 'model')}>
              <NekoOption value="" label={envId ? "None" : "Default"} />
              {completionModels.map((x) => (
                <NekoOption key={x.model} value={x.model} label={x.name}></NekoOption>
              ))}
            </NekoSelect>

            <label>{i18n.COMMON.TEMPERATURE}:</label>
            <NekoInput name="temperature" value={temperature} type="number"
              onChange={value => setTemplateProperty(parseFloat(value), 'temperature')} 
              description={<span style={{ fontSize: 11, opacity: 0.6 }}>{i18n.HELP.TEMPERATURE}</span>} />
            </>
          </StyledSidebar>

          <NekoSpacer />

          <StyledSidebar>
            <StyledTitleWithButton>
              <h2 style={{ marginTop: 0, marginBottom: 0 }}>{i18n.COMMON.USAGE}</h2>
            </StyledTitleWithButton>
            <NekoSpacer tiny />
            {jsxUsageCosts}
          </StyledSidebar>

        </NekoColumn>

      </NekoWrapper>

      <NekoModal isOpen={error}
        onRequestClose={() => { setError(); }}
        okButton={{
          onClick: () => { setError(); }
        }}
        title="Error"
        content={<p>{error}</p>}
      />

    </NekoPage>
  );
};

export default Dashboard;