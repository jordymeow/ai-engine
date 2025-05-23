// Previous: 2.5.0
// Current: 2.8.2

const { useState, useEffect, useRef } = wp.element;
import Styled from "styled-components";

import { NekoButton, NekoPage, NekoSelect, NekoOption, NekoModal, NekoInput, NekoTextArea,
  NekoContainer, NekoWrapper, NekoColumn, NekoTypo, NekoSpacer } from '@neko-ui';

import { apiUrl, restNonce, session, options, stream } from '@app/settings';
import { OptionsCheck, toHTML, useModels } from "@app/helpers-admin";
import { AiNekoHeader } from "../styles/CommonStyles";
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
  const abortController = useRef();

  const promptRef = useRef(template?.prompt ?? "");
  const modelRef = useRef(template?.model ?? "gpt-3.5-turbo");
  const modeRef = useRef(template?.mode ?? "query");
  const temperatureRef = useRef(template?.temperature ?? 1);
  const envIdRef = useRef(template?.envId ?? "");
  const stopSequenceRef = useRef(template?.stopSequence ?? "");
  const maxTokensRef = useRef(template?.maxTokens ?? 2048);

  const { calculatePrice, completionModels } = useModels(options, envIdRef.current || null);
  const { addUsage, jsxUsageCosts } = UsageCosts(calculatePrice);
  const aiEnvironments = options?.ai_envs || [];

  const setTemplateProperty = (value, property) => {
    setTemplate({ ...template, [property]: value });
    if (property === 'prompt') {
      promptRef.current = value;
    }
    if (property === 'model') {
      modelRef.current = value;
    }
    if (property === 'mode') {
      modeRef.current = value;
    }
    if (property === 'temperature') {
      temperatureRef.current = value;
    }
    if (property === 'envId') {
      envIdRef.current = value;
    }
    if (property === 'stopSequence') {
      stopSequenceRef.current = value;
    }
    if (property === 'maxTokens') {
      maxTokensRef.current = value;
    }
  };

  const setPrompt = (prompt) => {
    setTemplate({ ...template, prompt: prompt });
    promptRef.current = prompt;
  };

  const onPushContinuousEntry = () => {
    const newPrompt = promptRef.current + "Human: " + continuousEntry;
    setPrompt(newPrompt);
    setContinuousEntry("");
    onSubmitPrompt(newPrompt);
  };

  useEffect(() => {
    if (template) {
      setCompletion("");
      promptRef.current = template.prompt ?? "";
    }
  }, [template]);

  const onStop = () => {
    abortController.current?.abort();
    setStartTime();
    setBusy(false);
  };

  const onSubmitPrompt = async (promptToUse = promptRef.current) => {
    abortController.current = new AbortController();
    setBusy(true);
    const currentStartTime = new Date();
    setStartTime(currentStartTime);
    try {
      const stop = stopSequenceRef.current.replace(/\\n/g, '\n');
      const streamCallback = !stream ? null : (content) => {
        setCompletion(content);
      };
      const res = await mwaiFetch(`${apiUrl}/ai/completions`, {
        scope: 'playground',
        session: session,
        message: promptToUse,
        temperature: temperatureRef.current,
        envId: envIdRef.current,
        model: modelRef.current,
        maxTokens: maxTokensRef.current,
        stop: stop,
        stream: stream
      }, restNonce, stream, abortController.current.signal);
      const debug = false;
      const finalRes = await mwaiHandleRes(res, streamCallback, debug ? "PLAYGROUND" : null);

      if (finalRes?.success === false) {
        throw new Error(finalRes?.message);
      }

      console.log("Completions", { prompt: promptToUse, result: finalRes });
      if (modeRef.current === 'continuous') {
        setPrompt(promptToUse + '\n' + finalRes.data + '\n');
      }
      else {
        setCompletion(finalRes.data);
      }
      addUsage(modelRef.current, finalRes?.usage?.prompt_tokens || 0, finalRes?.usage?.completion_tokens || 0);
    }
    catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
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
            <NekoButton fullWidth
              onClick={() => onSubmitPrompt(promptRef.current)}
              onStopClick={onStop}
              isBusy={busy}
              startTime={startTime}
              style={{ height: 50, fontSize: 14, flex: 4 }}>
              {i18n.COMMON.GENERATE}
            </NekoButton>
          </StyledSidebar>

          </NekoColumn>

        <NekoColumn style={{ flex: 3 }}>

          <StyledSidebar>

            {modeRef.current !== 'continuous' && <>
              <StyledTextArea rows={12} onChange={(e) => setPrompt(e.target.value)} value={promptRef.current} />
            </>}

            {modeRef.current === 'continuous' && <>
              <StyledTextArea rows={18} onChange={(e) => setPrompt(e.target.value)} value={promptRef.current} />
              <div style={{ display: 'flex' }}>
                <span className="dashicons dashicons-format-continuous" style={{ position: 'absolute', color: 'white',
                  zIndex: 200, fontSize: 28, marginTop: 12, marginLeft: 10 }}></span>
                <StyledNekoInput name="continuousEntry" value={continuousEntry} onChange={(e) => setContinuousEntry(e.target.value)}
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
            <h3>{i18n.COMMON.SETTINGS}</h3>

            <label>{i18n.COMMON.ENVIRONMENT}:</label>
            <NekoSelect scrolldown name="envId"
              value={envIdRef.current ?? ""} onChange={(e) => setTemplateProperty(e.target.value, 'envId')}>
              {aiEnvironments.map(x => <NekoOption key={x.id} value={x.id} label={x.name} />)}
              <NekoOption value={""} label={"None"}></NekoOption>
            </NekoSelect>

            <label>{i18n.COMMON.MODEL}:</label>
            <NekoSelect name="model" value={modelRef.current} scrolldown={true} onChange={(e) => setTemplateProperty(e.target.value, 'model')}>
              {completionModels.map((x) => (
                <NekoOption key={x.model} value={x.model} label={x.name}></NekoOption>
              ))}
            </NekoSelect>

            <label>{i18n.COMMON.TEMPERATURE}:</label>
            <NekoInput name="temperature" value={temperatureRef.current} type="number"
              onChange={(e) => setTemplateProperty(parseFloat(e.target.value), 'temperature')} description={<>
                <span style={{ color: temperatureRef.current >= 0 && temperatureRef.current <= 1 ? 'inherit' : 'red' }}>
                  {i18n.HELP.TEMPERATURE}
                </span>
              </>} />
            <label>{i18n.COMMON.MAX_TOKENS}:</label>
            <NekoInput name="maxTokens" value={maxTokensRef.current} type="number"
              onChange={(e) => setTemplateProperty(parseInt(e.target.value), 'maxTokens')} description={<>
                <span>
                  {i18n.HELP.MAX_TOKENS}
                </span>
              </>} />
            <label>{i18n.COMMON.STOP_SEQUENCE}:</label>
            <NekoInput name="stopSequence" value={stopSequenceRef.current} type="text"
              onChange={(e) => setTemplateProperty(e.target.value, 'stopSequence')} description={<>
                <span>
                  {i18n.HELP.STOP_SEQUENCE}
                </span>
              </>} />
          </StyledSidebar>

          <NekoSpacer />

          {jsxUsageCosts}

        </NekoColumn>

      </NekoWrapper>

      <NekoModal isOpen={!!error}
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