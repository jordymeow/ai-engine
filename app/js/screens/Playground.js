// Previous: 1.9.88
// Current: 2.0.9

const { useState, useEffect, useMemo } = wp.element;
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
  const { addUsage, jsxUsageCosts } = UsageCosts(options);
  const [ busy, setBusy ] = useState(false);
  const [ continuousEntry, setContinuousEntry ] = useState('');
  const [ startTime, setStartTime ] = useState();
  const [ error, setError ] = useState();

  const prompt = template?.prompt ?? "";
  const model = template?.model ?? "gpt-3.5-turbo";
  const mode = template?.mode ?? "query";
  const temperature = template?.temperature ?? 1;
  const envId = template?.envId ?? "";
  const stopSequence = template?.stopSequence ?? "";
  const maxTokens = template?.maxTokens ?? 2048;

  const { completionModels } = useModels(options, envId || null);
  const aiEnvironments = options?.ai_envs || [];

  const setTemplateProperty = (value, property) => {
    setTemplate({ ...template, [property]: value });
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

  const onSubmitPrompt = async (promptToUse = prompt) => {
    setBusy(true);
    setStartTime(new Date());
    try {
      const stop = stopSequence.replace(/\\n/g, '\n');
      const streamCallback = !stream ? null : (content) => {
        setCompletion(content);
      };
      const res = await mwaiFetch(`${apiUrl}/ai/completions`, { 
        env: 'playground',
        session: session,
        prompt: promptToUse,
        temperature,
        model,
        maxTokens: maxTokens,
        stop: stop,
        stream: stream
      }, restNonce, stream);
      const debug = false;
      const finalRes = await mwaiHandleRes(res, streamCallback, debug ? "PLAYGROUND" : null);

      if (finalRes?.success === false) {
        throw new Error(finalRes?.message);
      }

      console.log("Completions", { prompt: promptToUse, result: finalRes });
      if (mode === 'continuous') {
        setPrompt(promptToUse + '\n' + finalRes.data + '\n');
      }
      else {
        setCompletion(finalRes.data);
      }
      addUsage(model, finalRes?.usage?.prompt_tokens || 0, finalRes?.usage?.completion_tokens || 0);
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
        </NekoColumn>

        <NekoColumn style={{ flex: 3 }}>

          <StyledSidebar>

            {mode !== 'continuous' && <>
              <StyledTextArea rows={12} onChange={setPrompt} value={prompt} />
            </>}

            {mode === 'continuous' && <>
              <StyledTextArea rows={18} onChange={setPrompt} value={prompt} />
              <div style={{ display: 'flex' }}>
                <span className="dashicons dashicons-format-continuous" style={{ position: 'absolute', color: 'white',
                  zIndex: 200, fontSize: 28, marginTop: 12, marginLeft: 10 }}></span>
                <StyledNekoInput name="continuousEntry" value={continuousEntry} onChange={setContinuousEntry}
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

          {mode === 'query' && <>
            <StyledSidebar>
              <NekoButton fullWidth onClick={() => { onSubmitPrompt(); }}
                isBusy={busy} startTime={startTime} style={{ height: 50, fontSize: 14, flex: 4 }}>
                {i18n.COMMON.SUBMIT}
              </NekoButton>
            </StyledSidebar>
            <NekoSpacer />
          </>}

          <StyledSidebar>
            <h3>{i18n.COMMON.SETTINGS}</h3>

            <label>{i18n.COMMON.ENVIRONMENT}:</label>
            <NekoSelect scrolldown name="envId"
              value={envId ?? ""} onChange={setTemplateProperty}>
              {aiEnvironments.map(x => <NekoOption key={x.id} value={x.id} label={x.name} />)}
              <NekoOption value={""} label={"None"}></NekoOption>
            </NekoSelect>

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

          <NekoSpacer />

          {jsxUsageCosts}

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