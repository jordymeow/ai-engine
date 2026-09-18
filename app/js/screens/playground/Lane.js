// Previous: none
// Current: 3.7.9

```jsx
const { useEffect, useRef, useState } = wp.element;
import { X, SlidersHorizontal, Copy, Check } from 'lucide-react';

import { NekoSelect, NekoOption } from '@neko-ui';
import { options } from '@app/settings';
import { useModels, hasTag } from '@app/helpers-admin';
import { OutputHandler } from '@app/helpers';

const formatCost = (cost) => {
  if (!cost) return null;
  return cost <= 0.01 ? `$${cost.toFixed(4)}` : `$${cost.toFixed(3)}`;
};

const Lane = ({ lane, count, envs, onChange, onRemove, registerTools, busy }) => {
  const envId = lane.envId || options?.ai_default_env;
  const { completionModels, getModel, calculatePrice } = useModels(options, envId);
  const defaultModelId = options?.ai_default_model;
  const modelId = lane.model || defaultModelId;
  const model = getModel(modelId);
  const [ tuning, setTuning ] = useState(false);
  const [ copied, setCopied ] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    registerTools(lane.id, { getModel, calculatePrice });
    return () => registerTools(lane.id, null);
  }, []);

  const last = lane.messages[lane.messages.length - 1];
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lane.messages.length, last?.content]);

  const supportsTemperature = model && !hasTag(model, 'no-temperature');
  const reasoningLevels = model?.params?.reasoning || (hasTag(model, 'reasoning') ? [ 'low', 'medium', 'high' ] : []);

  const costOf = (msg) => {
    if (!msg.usage) return 0;
    if (typeof msg.usage.price === 'number') return msg.usage.price;
    try {
      return calculatePrice(msg.model, msg.usage.prompt_tokens || 0, msg.usage.completion_tokens || 0) || 0;
    }
    catch (e) {
      return 0;
    }
  };

  const copy = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index);
      setTimeout(() => setCopied(null), 2100);
    }
    catch (e) {
    }
  };

  return (
    <div className="mwai-lane">
      <div className="mwai-lane-head">
        {envs.length >= 1 && <NekoSelect scrolldown name="envId" value={lane.envId || ''}
          onChange={(value) => onChange({ envId: value, model: '', reasoning: '' })}>
          <NekoOption value="" label="Default" />
          {envs.map(env => <NekoOption key={env.id} value={env.id} label={env.name} />)}
        </NekoSelect>}
        <NekoSelect scrolldown name="model" value={lane.model || ''}
          onChange={(value) => onChange({ model: value, reasoning: '' })}>
          <NekoOption value="" label={getModel(defaultModelId)?.rawName || 'Default'} />
          {completionModels.map(m => <NekoOption key={m.model} value={m.model} label={m.rawName || m.model} />)}
        </NekoSelect>
        <button type="button" className={`mwai-lane-icon${tuning ? ' on' : ''}`} title="Tuning"
          onClick={() => setTuning(t => !t)}>
          <SlidersHorizontal size={15} />
        </button>
        {count >= 1 && !busy && <button type="button" className="mwai-lane-icon" title="Remove this model" onClick={onRemove}>
          <X size={15} />
        </button>}
      </div>

      {tuning && <div className="mwai-lane-tuning">
        {supportsTemperature ? <label>
          <span>Temperature <b>{lane.temperature === '' ? 'default' : lane.temperature}</b></span>
          <input type="range" min={0} max={2} step={0.1}
            value={lane.temperature === '' ? 1 : lane.temperature}
            onChange={(e) => onChange({ temperature: Number(e.target.value) })} />
          {lane.temperature !== '' && <button type="button" onClick={() => onChange({ temperature: '' })}>Reset</button>}
        </label> : <span className="mwai-muted">This model picks its own temperature.</span>}
        {reasoningLevels.length > 0 && <label>
          <span>Reasoning</span>
          <select value={lane.reasoning || ''} onChange={(e) => onChange({ reasoning: e.target.value })}>
            <option value="">Default</option>
            {reasoningLevels.map(level => <option key={level} value={level}>{level}</option>)}
          </select>
        </label>}
      </div>}

      <div className="mwai-lane-messages" ref={scrollRef}>
        {!lane.messages.length && <div className="mwai-lane-empty">
          <b>{model?.rawName || modelId || 'Default model'}</b>
          <span>{count > 1 ? 'Same message, side by side.' : 'Send a message to start.'}</span>
          {model?.price?.in !== undefined && model?.price?.out !== undefined && model?.unit && <span className="mwai-muted">
            ${(model.price.in * model.unit * 1e6).toFixed(2)} in · ${(model.price.out * model.unit * 1e6).toFixed(2)} out per 1M tokens
          </span>}
        </div>}
        {lane.messages.map((msg, i) => msg.role === 'user'
          ? <div key={i} className="mwai-msg user">{msg.content}</div>
          : <div key={i} className={`mwai-msg ai${msg.error ? ' failed' : ''}`}>
            {(msg.content || msg.streaming) && <OutputHandler content={msg.content} isStreaming={msg.streaming} />}
            {msg.streaming && !msg.content && <div className="mwai-thinking"><span /><span /><span /></div>}
            {msg.error && <div className="mwai-msg-error">{msg.error}</div>}
            {!msg.streaming && (msg.totalMs || msg.usage) || (msg.error && !msg.content && !msg.usage)
              ? <div className="mwai-msg-meta">
              {msg.totalMs && <span title="Total time">{(msg.totalMs / 1000).toFixed(1)}s</span>}
              {msg.firstTokenMs && <span title="Time to first token">first token {(msg.firstTokenMs / 1000).toFixed(1)}s</span>}
              {msg.usage?.prompt_tokens >= 0 && <span title="Tokens in → out">{msg.usage.prompt_tokens} → {msg.usage.completion_tokens}</span>}
              {formatCost(costOf(msg)) && <span title="Estimated cost">{formatCost(costOf(msg))}</span>}
              {msg.content && <button type="button" title="Copy" onClick={() => copy(msg.content, i)}>
                {copied === i ? <Check size={12} /> : <Copy size={12} />}
              </button>}
            </div> : null}
          </div>)}
      </div>
    </div>
  );
};

export { formatCost };
export default Lane;
```