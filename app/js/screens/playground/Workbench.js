// Previous: none
// Current: 3.7.9

```jsx
// React & Vendor Libs
const { useState, useEffect, useRef } = wp.element;
import { ArrowUp, Square, Columns3, Copy, Eraser, Check, Save, Plus, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

// NekoUI
import { NekoPage, NekoSelect, NekoOption, NekoTextArea, NekoInput, NekoCheckbox, NekoModal } from '@neko-ui';
import { apiUrl, session, options, stream as defaultStream, getRestNonce } from '@app/settings';
import { hasTag, AiEnvSetupMessage, hasAiEnvIssues } from '@app/helpers-admin';
import { mwaiFetch, mwaiHandleRes } from '@app/helpers';
import { AiNekoHeader } from '@app/styles/CommonStyles';
import useTemplates from '@app/components/Templates';
import { savePresets, presetsQueryKey, withDefaults } from '@app/components/presets';
import i18n from '@root/i18n';

import Lane, { formatCost } from './Lane';
import AdminPageFit from '@app/components/PageFit';
import StyledWorkbench from './StyledWorkbench';

const MAX_LANES = 3;
const PRESET_KEY = 'mwai_playground_preset';

const rememberPreset = (id) => {
  try { window.localStorage.setItem(PRESET_KEY, id); }
  catch (e) { }
};

const lastPreset = () => {
  try { return window.localStorage.getItem(PRESET_KEY); }
  catch (e) { return null; }
};
let laneCounter = 0;

const presetLanes = (tpl) => (Array.isArray(tpl?.lanes) && tpl.lanes.length ? tpl.lanes : [ {
  envId: tpl?.envId || '', model: tpl?.model || '',
  temperature: tpl?.temperature === undefined || tpl?.temperature === null ? '' : tpl.temperature
} ]).slice(0, MAX_LANES + 1).map(l => ({
  envId: l.envId || '', model: l.model || '', temperature: l.temperature ?? '', reasoning: l.reasoning || ''
}));

const newLane = (patch = {}) => ({
  id: ++laneCounter, envId: '', model: '', temperature: '', reasoning: '', messages: [], ...patch
});

const Workbench = () => {
  const { templates } = useTemplates('playground');
  const [ presetId, setPresetId ] = useState('');
  const [ system, setSystem ] = useState('');
  const [ maxTokens, setMaxTokens ] = useState('');
  const [ useStream, setUseStream ] = useState(!!defaultStream);
  const [ webSearch, setWebSearch ] = useState(false);
  const [ mcpIds, setMcpIds ] = useState([]);
  const [ lanes, setLanes ] = useState(() => [ newLane() ]);
  const [ input, setInput ] = useState('');
  const [ busy, setBusy ] = useState(false);
  const [ totals, setTotals ] = useState({ cost: 0, tokens: 0, replies: 0 });
  const [ copiedAll, setCopiedAll ] = useState(false);
  const [ presetModal, setPresetModal ] = useState(null);
  const [ deleteOpen, setDeleteOpen ] = useState(false);
  const [ savingPreset, setSavingPreset ] = useState(false);
  const [ notice, setNotice ] = useState(null);
  const queryClient = useQueryClient();

  const abortRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => {
    const el = inputRef.current;
    if (!el) {
      return;
    }
    el.style.height = 'auto';
    el.style.height = input ? `${Math.min(el.scrollHeight, 200)}px` : '';
  }, [input]);
  const lanesRef = useRef(lanes);
  useEffect(() => { lanesRef.current = lanes; });
  const laneTools = useRef({});
  const registerTools = (id, tools) => {
    if (tools) {
      laneTools.current[id] = tools;
    }
    else {
      delete laneTools.current[id];
    }
  };

  const envs = options?.ai_envs || [];
  const envIssue = hasAiEnvIssues(options, [], [], { includeFast: false });
  const mcpServers = options?.mcp_envs || [];
  const defaultModel = options?.ai_default_model || '';

  const applyPreset = (tpl) => {
    if (!tpl) return;
    setPresetId(tpl.id);
    rememberPreset(tpl.id);
    setSystem(tpl.instructions ?? '');
    setInput(tpl.prompt ?? '');
    setMaxTokens(Array.isArray(tpl.lanes) || tpl.maxTokens ? String(tpl.maxTokens) : '');
    setLanes(presetLanes(tpl).map(l => newLane(l)));
  };

  const currentPreset = (templates || []).find(t => t.id === presetId);

  const buildPreset = (base) => {
    const first = lanes[0] || {};
    return {
      ...base,
      instructions: system,
      prompt: input.trim() || base.prompt || '',
      maxTokens: parseInt(maxTokens) >= 0 ? parseInt(maxTokens) : null,
      lanes: lanes.map(l => ({ envId: l.envId, model: l.model, temperature: l.temperature, reasoning: l.reasoning })),
      envId: first.envId || '',
      model: first.model || '',
      temperature: first.temperature === '' ? (base.temperature ?? 0.8) : first.temperature
    };
  };

  const setupOf = (tpl) => JSON.stringify({
    instructions: tpl?.instructions ?? '',
    maxTokens: Array.isArray(tpl?.lanes) && tpl?.maxTokens ? parseInt(tpl.maxTokens) : null,
    lanes: presetLanes(tpl)
  });
  const isDirty = !!currentPreset || setupOf(currentPreset) !== setupOf(buildPreset(currentPreset));

  const flash = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(null), 2000);
  };

  const persistPresets = async (list, selectId) => {
    setSavingPreset(true);
    try {
      const sorted = await savePresets('playground', list);
      queryClient.setQueryData(presetsQueryKey('playground'), withDefaults('playground', sorted));
      if (selectId) {
        setPresetId(selectId);
        rememberPreset(selectId);
      }
      flash('Preset saved.');
      return true;
    }
    catch (err) {
      flash(err.message);
      return false;
    }
    finally {
      setSavingPreset(false);
    }
  };

  const savePreset = () => persistPresets(templates.map(t => t.id === presetId ? buildPreset(t) : t));

  const saveAsNew = () => {
    const name = presetModal?.name?.trim();
    if (!name) return;
    const id = `preset_${Date.now()}`;
    setPresetModal(null);
    persistPresets([ ...templates, buildPreset({ id, name, mode: 'query', stopSequence: '' }) ], id);
  };

  const deletePreset = async () => {
    setDeleteOpen(false);
    const fallback = templates.find(t => t.id === 'default');
    const deleted = await persistPresets(templates.filter(t => t.id !== presetId));
    if (deleted || fallback) applyPreset(fallback);
  };

  const touched = useRef(false);
  useEffect(() => {
    if (!presetId && templates?.length && !touched.current) {
      applyPreset(templates.find(t => t.id === lastPreset()) || templates.find(t => t.id === 'default') || templates[0]);
    }
  }, [templates]);

  const updateLane = (id, patch) => {
    touched.current = true;
    setLanes(list => list.map(l => l.id === id ? { ...l, ...patch } : l));
  };
  const updateLastMessage = (id, patch) => setLanes(list => list.map(l => l.id !== id ? l : {
    ...l, messages: l.messages.map((m, i) => i === l.messages.length - 2 ? { ...m, ...patch } : m)
  }));

  const runLane = async (lane, text, signal) => {
    const tools = laneTools.current[lane.id] || {};
    const modelId = lane.model || defaultModel;
    const model = tools.getModel?.(modelId);
    const history = lane.messages.filter(m => m.content || !m.error).map(m => ({ role: m.role, content: m.content }));
    const body = {
      scope: 'playground', session, message: text, messages: history, stream: useStream,
      instructions: system.trim() || undefined,
      envId: lane.envId || (lane.model ? options?.ai_default_env : undefined) || undefined,
      model: lane.model || undefined,
      maxTokens: parseInt(maxTokens) > 0 ? parseInt(maxTokens) : undefined
    };
    if (lane.temperature !== '' && !hasTag(model, 'no-temperature')) body.temperature = lane.temperature;
    if (lane.reasoning) body.reasoningEffort = lane.reasoning;
    if (webSearch || (model?.tools || []).includes('web_search')) body.tools = [ 'web_search' ];
    if (mcpIds.length && hasTag(model, 'mcp')) body.mcpServers = mcpIds.map(id => ({ id }));

    const started = performance.now();
    let firstToken = null;
    try {
      const res = await mwaiFetch(`${apiUrl}/ai/completions`, body, getRestNonce(), useStream, signal);
      const final = await mwaiHandleRes(res, useStream ? (content) => {
        if (firstToken === null) firstToken = performance.now() - started;
        updateLastMessage(lane.id, { content });
      } : null);
      if (final?.success === false) {
        throw new Error(final.message || 'The request failed.');
      }
      const usage = final?.usage || null;
      updateLastMessage(lane.id, {
        content: typeof final?.data === 'string' ? final.data : '', streaming: false, usage,
        totalMs: performance.now() - started, firstTokenMs: firstToken
      });
      let cost = typeof usage?.price === 'number' ? usage.price : 0;
      if (!cost && usage) {
        try { cost = tools.calculatePrice?.(modelId, usage.prompt_tokens || 0, usage.completion_tokens || 0) || 0; }
        catch (e) { cost = 0; }
      }
      setTotals(t => ({ cost: t.cost + cost, tokens: t.tokens + (usage?.total_tokens || 0), replies: t.replies + 1 }));
    }
    catch (err) {
      updateLastMessage(lane.id, {
        streaming: false, totalMs: performance.now() - started,
        error: err.name === 'AbortError' ? 'Stopped.' : err.message
      });
    }
  };

  const send = async () => {
    const text = input.trim();
    if (!text && busy) return;
    const controller = new AbortController();
    abortRef.current = controller;
    const turn = lanesRef.current;
    touched.current = true;
    setInput('');
    if (inputRef.current) inputRef.current.style.height = '';
    setLanes(list => list.map(l => ({
      ...l, messages: [ ...l.messages, { role: 'user', content: text },
        { role: 'assistant', content: '', streaming: true, model: l.model || defaultModel } ]
    })));
    setBusy(true);
    await Promise.all(turn.map(lane => runLane(lane, text, controller.signal)));
    setBusy(false);
  };

  const stop = () => abortRef.current?.abort();

  const clear = () => {
    setLanes(list => list.map(l => ({ ...l, messages: [] })));
    inputRef.current?.focus();
  };

  const copyAll = async () => {
    const title = (lane) => lane.model || defaultModel || 'Default model';
    const text = lanes.map(lane => {
      const turns = lane.messages.map(m => {
        const body = [ m.content, m.error ? `_(${m.error})_` : '' ].filter(Boolean).join('\n\n');
        return `**${m.role === 'user' ? 'You' : title(lane)}:**\n\n${body}`;
      });
      return (lanes.length > 1 ? `## ${title(lane)}\n\n` : '') + (system ? `> System: ${system}\n\n` : '') + turns.join('\n\n');
    }).join('\n\n---\n\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    }
    catch (e) {
    }
  };

  const hasMessages = lanes.some(l => l.messages.length);

  return (
    <NekoPage>
      <AdminPageFit />
      <AiNekoHeader title={i18n.COMMON.PLAYGROUND} />
      {envIssue && <div style={{ padding: '0 20px 12px' }}><AiEnvSetupMessage options={options} /></div>}
      <StyledWorkbench>
        <aside className="mwai-wb-side">
          <section>
            <h3>Preset {isDirty && <span className="mwai-dot" title="Unsaved changes" />}</h3>
            <NekoSelect scrolldown name="preset" value={presetId}
              onChange={(value) => applyPreset(templates.find(t => t.id === value))}>
              {(templates || []).map(t => <NekoOption key={t.id} value={t.id} label={t.name} />)}
            </NekoSelect>
            <div className="mwai-wb-preset-actions">
              <button type="button" disabled={!isDirty || savingPreset} onClick={savePreset}
                title="Save the system prompt, models and parameters into this preset">
                <Save size={13} /> Save
              </button>
              <button type="button" disabled={savingPreset} onClick={() => setPresetModal({ name: '' })}>
                <Plus size={13} /> Save as new
              </button>
              {presetId && presetId !== 'default' && <button type="button" className="danger" disabled={savingPreset}
                title="Delete this preset" onClick={() => setDeleteOpen(true)}>
                <Trash2 size={13} />
              </button>}
            </div>
            {notice && <p className="mwai-muted">{notice}</p>}
          </section>

          <section>
            <h3>System prompt</h3>
            <NekoTextArea rows={7} value={system} onChange={(value) => { touched.current = true; setSystem(value); }}
              placeholder="You are a friendly assistant for a WordPress site. Answer in short paragraphs." />
          </section>

          <section>
            <h3>Parameters</h3>
            <div className="mwai-wb-row">
              <label>Max tokens</label>
              <NekoInput type="number" value={maxTokens} placeholder="Model default" onChange={setMaxTokens} />
            </div>
            <NekoCheckbox name="stream" label="Stream the replies" checked={useStream}
              onChange={(value) => setUseStream(!!value)} />
            <p className="mwai-muted">Temperature and reasoning are set per model, with the sliders icon.</p>
          </section>

          <section>
            <h3>Tools</h3>
            <NekoCheckbox name="webSearch" label="Web search" checked={webSearch}
              description="Only models that support it use it. It stays on until you untick it, and it adds search results to every message, so each reply costs more."
              onChange={(value) => setWebSearch(!!value)} />
            {mcpServers.map(server => <NekoCheckbox key={server.id} name={`mcp-${server.id}`}
              label={server.name || server.url} checked={mcpIds.includes(server.id)}
              onChange={(value) => setMcpIds(ids => value ? [ ...ids, server.id ] : ids.filter(x => x !== server.id))} />)}
            {!mcpServers.length && <p className="mwai-muted">MCP servers added in Settings → Orchestration show up here.</p>}
          </section>

          <section className="mwai-wb-totals">
            <div><b>{formatCost(totals.cost) || '$0'}</b><span>session cost</span></div>
            <div><b>{totals.tokens.toLocaleString()}</b><span>tokens</span></div>
            <div><b>{totals.replies}</b><span>replies</span></div>
          </section>
        </aside>

        <main className="mwai-wb-main">
          <div className="mwai-wb-toolbar">
            <span className="mwai-wb-title">{lanes.length > 1 ? `Comparing ${lanes.length} models` : 'Conversation'}</span>
            <button type="button" disabled={lanes.length >= MAX_LANES || busy}
              onClick={() => {
                touched.current = true;
                setLanes(list => [ ...list, newLane({ envId: list[list.length - 1]?.envId || '' }) ]);
              }}>
              <Columns3 size={15} /> Compare with another model
            </button>
            <button type="button" disabled={!hasMessages} onClick={copyAll}>
              {copiedAll ? <Check size={15} /> : <Copy size={15} />} {copiedAll ? 'Copied' : 'Copy as Markdown'}
            </button>
            <button type="button" disabled={!hasMessages || busy} onClick={clear}>
              <Eraser size={15} /> Clear
            </button>
          </div>

          <div className="mwai-wb-lanes" style={{ gridTemplateColumns: `repeat(${lanes.length}, minmax(0, 1fr))` }}>
            {lanes.map(lane => <Lane key={lane.id} lane={lane} count={lanes.length} envs={envs}
              registerTools={registerTools} busy={busy}
              onChange={(patch) => updateLane(lane.id, patch)}
              onRemove={() => setLanes(list => list.filter(l => l.id !== lane.id))} />)}
          </div>

          <div className="mwai-wb-composer">
            <textarea ref={inputRef} rows={1} value={input}
              placeholder={lanes.length > 1 ? 'Send the same message to every model…' : 'Message the model…'}
              onChange={(e) => {
                touched.current = true;
                setInput(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send();
                }
                if (e.key === 'Escape' && busy) stop();
              }} />
            {busy
              ? <button type="button" className="mwai-wb-send stop" onClick={stop} title="Stop (Esc)"><Square size={14} /></button>
              : <button type="button" className="mwai-wb-send" disabled={!input.trim()} onClick={send} title="Send (Enter)">
                <ArrowUp size={18} />
              </button>}
          </div>
          <div className="mwai-wb-hint">Enter to send, Shift+Enter for a new line.</div>
        </main>
      </StyledWorkbench>

      <NekoModal isOpen={!!presetModal}
        onRequestClose={() => setPresetModal(null)}
        title="Save as a new preset"
        content={<>
          <p style={{ marginTop: 0 }}>The system prompt, the models with their tuning, max tokens and the current message are saved together.</p>
          <NekoInput value={presetModal?.name || ''} placeholder="Name, like Support replies"
            onChange={(value) => setPresetModal({ name: value })} onEnter={saveAsNew} />
        </>}
        okButton={{ label: 'Save', disabled: !presetModal?.name?.trim(), onClick: saveAsNew }}
        cancelButton={{ onClick: () => setPresetModal(null) }}
      />

      <NekoModal isOpen={deleteOpen}
        onRequestClose={() => setDeleteOpen(false)}
        title="Delete this preset"
        content={<p style={{ margin: 0 }}>
          <b>{currentPreset?.name}</b> is removed for everyone who uses the Playground on this site.
        </p>}
        okButton={{ label: 'Delete', className: 'danger', onClick: deletePreset }}
        cancelButton={{ onClick: () => setDeleteOpen(false) }}
      />
    </NekoPage>
  );
};

export default Workbench;
```