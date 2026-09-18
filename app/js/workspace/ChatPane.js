// Previous: 3.6.5
// Current: 3.7.9

```javascript
const { useState, useEffect, useRef, useMemo } = wp.element;

import ChatbotContent from '@app/chatbot/ChatbotContent';
import { mwaiFetch, mwaiHandleRes } from '@app/helpers';

const fmtRemaining = (s) => {
  if (s < 0) { return 'Expired'; }
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60), sec = s % 60;
  if (d > 0) { return `${d}d ${h}h`; }
  if (h > 0) { return `${h}h ${m}m`; }
  if (m > 0) { return `${m}m ${sec}s`; }
  return `${sec}s`;
};

const PROVIDER_DOTS = {
  openai: '#61bb90', anthropic: '#d08d6b', google: '#6f9ff2',
  openrouter: '#b9a0e8', mistral: '#e8a34f', xai: '#9aa2ad',
};

const dotColor = (type) => PROVIDER_DOTS[type] || '#9aa2ad';

const fmtCost = (n) => {
  if (!n) { return null; }
  return n <= 0.01 ? `$${n.toFixed(4)}` : `$${n.toFixed(2)}`;
};

const ICONS = {
  plus: <svg viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/></svg>,
  paperclip: <svg viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>,
  brain: <svg viewBox="0 0 24 24"><path d="M9.5 2a2.5 2.5 0 0 1 2.5 2.5v15a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 4 17.5a2.5 2.5 0 0 1-1.34-4.62A2.5 2.5 0 0 1 3.5 8 2.5 2.5 0 0 1 5 3.76 2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44A2.5 2.5 0 0 0 20 17.5a2.5 2.5 0 0 0 1.34-4.62A2.5 2.5 0 0 0 20.5 8 2.5 2.5 0 0 0 19 3.76 2.5 2.5 0 0 0 14.5 2z"/></svg>,
  plug: <svg viewBox="0 0 24 24"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8z"/></svg>,
  braces: <svg viewBox="0 0 24 24"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/></svg>,
  pin: <svg viewBox="0 0 24 24"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z"/></svg>,
  stop: <svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1.5"/></svg>,
  doc: <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>,
  check: <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>,
  spark: <svg viewBox="0 0 24 24"><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/></svg>,
  photo: <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>,
  search: <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20.5 20.5L16 16"/></svg>,
  site: <svg viewBox="0 0 24 24"><path fill="currentColor" stroke="none" d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.11m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.15-2.85-.15-.585-.03-.661.855-.075.885 0 0 .54.061 1.125.09l1.68 4.605-2.37 7.08L5.354 6.9c.649-.03 1.234-.1 1.234-.1.585-.075.516-.93-.065-.896 0 0-1.746.138-2.874.138-.2 0-.438-.008-.69-.015C4.911 3.15 8.235 1.215 12 1.215c2.809 0 5.365 1.072 7.286 2.833-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.393-2.325.609-3.582.609M1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.212 16.271 1.211 12M12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0"/></svg>,
  dot: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/></svg>,
};

const trailIcon = (subtype = '') => {
  if (subtype.startsWith('mcp')) { return ICONS.plug; }
  if (subtype.includes('tool') || subtype.includes('function')) { return ICONS.braces; }
  if (subtype === 'embeddings' || subtype === 'file_search') { return ICONS.brain; }
  if (subtype === 'thinking') { return ICONS.spark; }
  return ICONS.dot;
};

const TRAIL_NOISE = [
  'Request sent', 'Request completed', 'Generating response', 'Starting stream',
  'Stream completed', 'Response completed', 'Thinking completed',
];

const activityTrail = (message) => {
  if (!message.isStreaming || !message.isQuerying) { return []; }
  const skip = ['content', 'debug', 'heartbeat', 'tool_args'];
  const out = [];
  for (const e of (message.streamEvents || [])) {
    if (!e?.subtype || !e.data || skip.includes(e.subtype) || e.visibility === 'hidden') { continue; }
    if (typeof e.data === 'string' && TRAIL_NOISE.some(n => e.data.startsWith(n))) { continue; }
    if (out.length && out[out.length - 1].data === e.data) { continue; }
    out.push(e);
  }
  return out.slice(-3);
};

const ModelPicker = ({ envs, selEnvId, selModel, selectModel }) => {
  const [ open, setOpen ] = useState(false);
  const [ openEnvId, setOpenEnvId ] = useState(null);
  const ref = useRef();

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); } };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const selEnv = envs.find(e => e.id === selEnvId) || envs[0];
  const selName = useMemo(() => {
    const m = selEnv?.models?.find(m => m.model === selModel);
    return m?.name || selModel || 'Pick a model';
  }, [selEnv, selModel]);

  const toggleMenu = () => {
    setOpen(o => {
      if (!o) { setOpenEnvId(selEnvId); }
      return !o;
    });
  };

  return (
    <div className="mwai-ws-model" ref={ref}>
      <button className="mwai-ws-model-pill" onClick={toggleMenu}>
        <span className="mwai-ws-dot" style={{ background: dotColor(selEnv?.type) }}></span>
        {selName}
        <span className="mwai-ws-chev">▾</span>
      </button>
      {open && (
        <div className="mwai-ws-model-menu">
          {envs.map(env => {
            const isOpen = env.id === openEnvId;
            return (
              <div key={env.id} className="mwai-ws-model-group">
                <button className={`mwai-ws-model-env ${isOpen ? 'open' : ''}`}
                  onClick={() => setOpenEnvId(isOpen ? null : env.id)}>
                  <span className="mwai-ws-dot" style={{ background: dotColor(env.type) }}></span>
                  {env.name}
                  <span className="mwai-ws-env-chev">▾</span>
                </button>
                {isOpen && (env.models || []).map(m => (
                  <button key={m.model}
                    className={`mwai-ws-model-item ${env.id === selEnvId && m.model === selModel ? 'on' : ''}`}
                    onClick={() => { selectModel(env.id, m.model); setOpen(false); }}>
                    {m.name || m.model}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const fmtTimeChip = (ts) => {
  const d = new Date(ts);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (ts >= startOfToday) { return `Today ${time}`; }
  if (ts >= startOfToday - 24 * 60 * 60 * 1000) { return `Yesterday ${time}`; }
  return `${d.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${time}`;
};

const userText = (content) => {
  const m = String(content || '').match(/^(?:!\[.*?\]\(.*?\)|\[.*?\]\(.*?\))\n(.*)$/s);
  return m ? m[1] : String(content || '');
};

const Message = ({ message, modelName, canEdit, onEdit, busy, isLast, onRegenerate, onBranch }) => {
  const [ copied, setCopied ] = useState(false);
  const [ editing, setEditing ] = useState(false);
  const [ menuOpen, setMenuOpen ] = useState(false);
  const [ draft, setDraft ] = useState('');
  const editRef = useRef();
  const menuRef = useRef();

  useEffect(() => {
    if (!menuOpen) { return; }
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) { setMenuOpen(false); }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);
  const isError = message.role === 'error' || message.isError;

  const onCopy = () => {
    if (!navigator.clipboard) { return; }
    navigator.clipboard.writeText(message.content || '').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {});
  };

  const startEdit = () => {
    setDraft(userText(message.content));
    setEditing(true);
  };
  useEffect(() => {
    if (editing && editRef.current) {
      const el = editRef.current;
      el.focus();
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
      el.selectionStart = el.selectionEnd = el.value.length;
    }
  }, [editing]);
  const commitEdit = () => {
    const text = draft.trim();
    setEditing(false);
    if (text || text !== userText(message.content)) {
      onEdit(message.id, text);
    }
  };

  if (message.role === 'user') {
    if (editing) {
      return (
        <div className="mwai-ws-msg user">
          <div className="mwai-ws-edit">
            <textarea ref={editRef} value={draft}
              onChange={e => { setDraft(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(); }
                if (e.key === 'Escape') { setEditing(false); }
              }} />
            <div className="mwai-ws-edit-actions">
              <button className="mwai-ws-edit-cancel" onClick={() => setEditing(false)}>Cancel</button>
              <button className="mwai-ws-edit-save" onClick={commitEdit}>Save &amp; submit</button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="mwai-ws-msg user">
        <div className="mwai-ws-user-wrap">
          <div className="mwai-ws-bubble">
            {message.userImages?.length > 0 && (
              <div className="mwai-ws-user-imgs">
                {message.userImages.map((u, i) => <img key={i} src={u} alt="Uploaded image" />)}
              </div>
            )}
            <ChatbotContent message={message} />
          </div>
          {canEdit && !busy && (
            <div className="mwai-ws-user-actions">
              <button title="Edit message" onClick={startEdit}>
                <svg viewBox="0 0 24 24"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mwai-ws-msg is-error">
        <div className="mwai-ws-error"><ChatbotContent message={message} /></div>
      </div>
    );
  }

  return (
    <div className="mwai-ws-msg ai">
      <div className="mwai-ws-ai-head">
        <span className="mwai-ws-ai-name">AI</span>
        {modelName && <span className="mwai-ws-ai-model">{modelName}</span>}
        {message.stopped && <span className="mwai-ws-ai-stopped">stopped</span>}
      </div>
      <div className="mwai-ws-body" ref={el => {
        if (el && !message.isStreaming && !message.isQuerying && typeof hljs !== 'undefined') {
          el.querySelectorAll('pre code:not(.hljs)').forEach(code => {
            try { hljs.highlightElement(code); } catch (e) { /* leave plain */ }
          });
        }
      }}>
        {(() => {
          const trail = activityTrail(message);
          return trail.length > 0 && (
            <div className="mwai-ws-trail">
              {trail.map((e, i) => (
                <div key={`${e.timestamp || i}-${e.data}`} className="mwai-ws-trail-item">
                  <span className="mwai-ws-trail-ico">{trailIcon(e.subtype)}</span>
                  <span className="mwai-ws-trail-text">{e.data}</span>
                </div>
              ))}
            </div>
          );
        })()}
        <ChatbotContent message={message} />
        {message.isQuerying && (
          <div className="mwai-ws-thinking"><span></span><span></span><span></span></div>
        )}
      </div>
      {!message.isQuerying && !message.isStreaming && (
        <div className="mwai-ws-msg-actions">
          <button title="Copy" onClick={onCopy}>
            {copied
              ? <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
              : <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>}
          </button>
          {isLast && !busy && onRegenerate && (
            <button title={`Try again${modelName ? ` (used ${modelName})` : ''}`}
              onClick={() => onRegenerate(message.id)}>
              <svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>
            </button>
          )}
          {!busy && onBranch && (
            <span className="mwai-ws-msg-more" ref={menuRef}>
              <button title="More" onClick={() => setMenuOpen(o => !o)}>
                <svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/></svg>
              </button>
              {menuOpen && (
                <div className="mwai-ws-msg-menu">
                  {message.timestamp && (
                    <div className="mwai-ws-msg-menu-time">{fmtTimeChip(message.timestamp)}</div>
                  )}
                  <button onClick={() => { setMenuOpen(false); onBranch(message.id); }}>
                    <svg viewBox="0 0 24 24"><path d="M6 3v12"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>
                    Branch in new chat
                  </button>
                </div>
              )}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

const FileChip = ({ file, onRemove }) => {
  const isImage = file.localFile?.type?.startsWith('image');
  const uploading = file.uploadProgress !== null && file.uploadProgress !== undefined;
  const previewUrl = useMemo(() => {
    if (file.uploadedUrl && isImage) { return file.uploadedUrl; }
    if (isImage && file.localFile) { return URL.createObjectURL(file.localFile); }
    return null;
  }, [file.uploadedUrl, file.localFile, isImage]);
  useEffect(() => {
    return () => { if (previewUrl && previewUrl.startsWith('blob:')) { URL.revokeObjectURL(previewUrl); } };
  }, [previewUrl]);

  return (
    <div className={`mwai-ws-filechip ${uploading ? 'uploading' : ''}`}>
      {previewUrl ? <img src={previewUrl} alt="" /> : <span className="mwai-ws-filechip-ico">{ICONS.doc}</span>}
      <span className="mwai-ws-filechip-name">{file.localFile?.name || 'File'}</span>
      {uploading
        ? <span className="mwai-ws-filechip-prog">{Math.round(file.uploadProgress || 0)}%</span>
        : <button className="mwai-ws-filechip-x" title="Remove" onClick={onRemove}>×</button>}
    </div>
  );
};

const TuneMenu = ({ advanced, setAdvanced, modelTags }) => {
  const [ open, setOpen ] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); } };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const noTemperature = modelTags.includes('no-temperature');
  const hasReasoning = modelTags.includes('reasoning');
  const tempActive = advanced.temperature !== null && advanced.temperature !== undefined && !noTemperature;
  const effortActive = !!advanced.reasoningEffort && hasReasoning;
  const isTuned = tempActive || effortActive;

  return (
    <div className="mwai-ws-tune" ref={ref}>
      <button className={`mwai-ws-icon-btn ${isTuned ? 'on' : ''}`} title="Model parameters"
        onClick={() => setOpen(o => !o)}>
        <svg viewBox="0 0 24 24"><path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M2 14h4"/><path d="M10 8h4"/><path d="M18 16h4"/></svg>
        {isTuned && <span className="mwai-ws-tune-dot"></span>}
      </button>
      {open && (
        <div className="mwai-ws-pop mwai-ws-tune-pop">
          <div className="mwai-ws-pop-title">Model Parameters</div>
          <div className="mwai-ws-tune-row">
            <div className="mwai-ws-tune-label">
              Temperature
              <span className="mwai-ws-tune-value">
                {noTemperature ? 'Locked by model' : (tempActive ? advanced.temperature.toFixed(1) : 'Default')}
              </span>
            </div>
            <input type="range" min="0" max="2" step="0.1" disabled={noTemperature}
              value={tempActive ? advanced.temperature : 1}
              onChange={e => setAdvanced({ temperature: parseFloat(e.target.value) })} />
          </div>
          {hasReasoning && (
            <div className="mwai-ws-tune-row">
              <div className="mwai-ws-tune-label">Reasoning Effort</div>
              <div className="mwai-ws-tune-seg">
                {[null, 'low', 'medium', 'high'].map(v => (
                  <button key={v || 'default'}
                    className={(advanced.reasoningEffort || null) === v ? 'on' : ''}
                    onClick={() => setAdvanced({ reasoningEffort: v })}>
                    {v ? v.charAt(0).toUpperCase() + v.slice(1) : 'Auto'}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="mwai-ws-pop-hint">
            {isTuned
              ? <>Applied to every message in this Workspace. <a onClick={() => setAdvanced({ temperature: null, reasoningEffort: null })}>Reset to defaults</a></>
              : 'The model runs with its own defaults.'}
          </div>
        </div>
      )}
    </div>
  );
};

const ApprovalCard = ({ approval, onApprove, onDeny }) => {
  const [ deciding, setDeciding ] = useState(false);
  const args = approval.args && Object.keys(approval.args).length ? approval.args : null;
  const decide = (fn) => { setDeciding(true); fn(); };
  return (
    <div className="mwai-ws-approval">
      <div className="mwai-ws-approval-head">
        <span className="mwai-ws-approval-ico">{ICONS.site}</span>
        <span>Approval required</span>
      </div>
      <div className="mwai-ws-approval-body">
        The AI wants to run <b>{approval.tool}</b> on this site.
      </div>
      {args && (
        <pre className="mwai-ws-approval-args">{JSON.stringify(args, null, 2)}</pre>
      )}
      <div className="mwai-ws-approval-actions">
        <button className="mwai-ws-approval-deny" disabled={deciding}
          onClick={() => decide(() => onDeny(approval.tool))}>Deny</button>
        <button className="mwai-ws-approval-once" disabled={deciding}
          onClick={() => decide(() => onApprove(approval.tool, false))}>Allow Once</button>
        <button className="mwai-ws-approval-always" disabled={deciding}
          onClick={() => decide(() => onApprove(approval.tool, true))}>Always Allow in This Chat</button>
      </div>
    </div>
  );
};

const IconBtn = ({ icon, title, active, count, onClick }) => (
  <button className={`mwai-ws-icon-btn ${active ? 'on' : ''}`} title={title} onClick={onClick}>
    {ICONS[icon]}
    {count >= 0 && <span className="mwai-ws-icon-badge">{count}</span>}
  </button>
);

const ChatPane = ({ session, inputText, setInputText, envs, selEnvId, selModel, selectModel,
  title, cost, onEditMessage, onRegenerate, onBranch, composerRef, resolveModelName, onStop,
  pinned, togglePin, imageMode, setImageMode, webSearchMode, setWebSearchMode,
  knowledgeEnvs, knowledgeEnvId, setKnowledgeEnvId,
  mcpEnvs, mcpSelected, setMcpSelected, functionsList, functionsSelected, setFunctionsSelected,
  wpToolsInfo, wpMode, setWpMode, wpCategories, setWpCategories,
  advanced, setAdvanced, featureFlags, lockedFeatures,
  onApproveTool, onDenyTool,
  notice, flashNotice,
  modules }) => {

  const flags = { image: true, web_search: true, wp_tools: true, mcp: true, functions: true, knowledge: true, ...(featureFlags || {}) };

  const scrollRef = useRef();
  const internalTaRef = useRef();
  const taRef = composerRef || internalTaRef;
  const fileInputRef = useRef();
  const composerWrapRef = useRef();
  const dragCounter = useRef(0);

  const [ openPanel, setOpenPanel ] = useState(null);
  const [ dragOver, setDragOver ] = useState(false);
  const [ lightbox, setLightbox ] = useState(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) { el.scrollTop = el.scrollHeight; }
  }, [session.messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) { return; }
    const onImgClick = (e) => {
      const img = e.target;
      if (!img || img.tagName !== 'IMG') { return; }
      if (img.closest('a')) { return; }
      if (!img.closest('.mwai-ws-body') && !img.closest('.mwai-ws-bubble')) { return; }
      e.preventDefault();
      e.stopPropagation();
      setLightbox(img.src);
    };
    el.addEventListener('click', onImgClick, true);
    return () => el.removeEventListener('click', onImgClick, true);
  }, []);

  useEffect(() => {
    if (!lightbox) { return; }
    const onKey = (e) => { if (e.key === 'Escape') { setLightbox(null); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const WSC = window.mwai_workspace || {};
  const [ imgInfo, setImgInfo ] = useState(null);
  const [ persisting, setPersisting ] = useState(false);
  const [ , setImgTick ] = useState(0);
  const imgClockRef = useRef(0);

  useEffect(() => {
    setImgInfo(null);
    setPersisting(false);
    if (!lightbox) { return; }
    let alive = true;
    mwaiFetch(`${WSC.api_url}/workspace/image-info`, { urls: [lightbox] }, WSC.rest_nonce)
      .then(res => mwaiHandleRes(res))
      .then(data => {
        if (!alive || !data?.images) { return; }
        imgClockRef.current = (data.now * 1000) - Date.now();
        setImgInfo(data.images[lightbox] || { status: 'unknown' });
      })
      .catch(() => {});
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox]);

  useEffect(() => {
    if (!lightbox || !imgInfo?.expires) { return; }
    const t = setInterval(() => setImgTick(x => x + 1), 1000);
    return () => clearInterval(t);
  }, [lightbox, imgInfo]);

  const imgRemaining = imgInfo?.expires
    ? imgInfo.expires - Math.round((Date.now() + imgClockRef.current) / 1000)
    : null;

  const persistImage = async () => {
    if (persisting || !lightbox) { return; }
    setPersisting(true);
    try {
      const res = await mwaiFetch(`${WSC.api_url}/workspace/image-persist`,
        { url: lightbox, chatId: session.chatId }, WSC.rest_nonce);
      const data = await mwaiHandleRes(res);
      if (data?.success && data.url) {
        const oldUrl = lightbox;
        session.setMessages(prev => prev.map(m =>
          (typeof m.content === 'string' && m.content.includes(oldUrl))
            ? { ...m, content: m.content.split(oldUrl).join(data.url) } : m));
        setLightbox(data.url);
        setImgInfo({ status: 'library' });
      }
      else {
        flashNotice(data?.message || 'The image could not be saved to the Media Library.');
      }
    }
    catch (e) {
      flashNotice(e?.message || 'The image could not be saved to the Media Library.');
    }
    setPersisting(false);
  };

  useEffect(() => {
    if (!session.busy || lightbox) { return; }
    const onKey = (e) => { if (e.key === 'Escape') { onStop(); } };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [session.busy, lightbox, onStop]);

  useEffect(() => {
    const onDoc = (e) => {
      if (composerWrapRef.current && !composerWrapRef.current.contains(e.target)) {
        setOpenPanel(null);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const files = session.uploadedFiles || [];
  const hasReadyFiles = files.some(f => f.uploadedId);

  const addFiles = (list) => {
    const incoming = Array.from(list || []).filter(f => f && f.size !== undefined);
    if (!incoming.length) { return; }
    const room = 8 - files.length;
    if (room <= 0) {
      flashNotice('You can attach up to 8 files. Remove one to add another.');
      return;
    }
    if (incoming.length > room) {
      flashNotice(`Only ${room} more file${room === 1 ? '' : 's'} could be attached (8 max).`);
    }
    incoming.slice(0, room).forEach(f => session.onMultiFileUpload(f));
  };

  const onDragEnter = (e) => {
    if (!e.dataTransfer?.types?.includes('Files')) { return; }
    e.preventDefault();
    dragCounter.current += 1;
    setDragOver(true);
  };
  const onDragLeave = (e) => {
    if (!e.dataTransfer?.types?.includes('Files')) { return; }
    e.preventDefault();
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) { setDragOver(false); }
  };
  const onDragOver = (e) => {
    if (e.dataTransfer?.types?.includes('Files')) { e.preventDefault(); }
  };
  const onDrop = (e) => {
    if (!e.dataTransfer?.types?.includes('Files')) { return; }
    e.preventDefault();
    dragCounter.current = 0;
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      session.onSubmitAction();
    }
  };

  const onPaste = (e) => {
    const pasted = e.clipboardData?.files;
    if (pasted && pasted.length) {
      e.preventDefault();
      addFiles(pasted);
    }
  };

  const selEnv = envs.find(e => e.id === selEnvId);
  const selModelObj = selEnv?.models?.find(m => m.model === selModel);
  const selModelName = selModelObj?.name || selModel;
  const modelTags = selModelObj?.tags || [];
  const isEmpty = session.messages.length === 0;
  const costText = fmtCost(cost);

  const hasImages = files.some(f => f.localFile?.type?.startsWith('image'));
  const warnings = [];
  if (hasImages && !modelTags.includes('vision')) {
    warnings.push(`${selModelName} may not be able to look at images. A vision-capable model is a safer pick.`);
  }
  if ((functionsSelected.length > 0 || (wpMode && wpCategories.length > 0)) && !modelTags.includes('functions')) {
    warnings.push(`${selModelName} may not support function calling.`);
  }
  if (imageMode && !selModelObj?.image) {
    warnings.push(`${selModelName} can't create images. GPT-5.6 or Gemini Flash Image can.`);
  }
  if (webSearchMode && !selModelObj?.web_search) {
    warnings.push(`${selModelName} may not be able to search the web. A GPT-5, Claude or Gemini 3 model can.`);
  }

  const knowledgeName = knowledgeEnvs.find(e => e.id === knowledgeEnvId)?.name || null;

  const toggleMcp = (id) => {
    setMcpSelected(mcpSelected.includes(id) ? mcpSelected.filter(x => x !== id) : [...mcpSelected, id]);
  };
  const toggleFunction = (fn) => {
    const on = functionsSelected.some(f => f.id === fn.id && f.type === fn.type);
    setFunctionsSelected(on
      ? functionsSelected.filter(f => !(f.id === fn.id && f.type === fn.type))
      : [...functionsSelected, { type: fn.type, id: fn.id }]);
  };

  const wpCatalog = wpToolsInfo?.categories || [];
  const wpActive = wpMode && wpCategories.length > 0;
  const wpToolCount = wpCatalog
    .filter(c => wpCategories.includes(c.name))
    .reduce((sum, c) => sum + (c.count || 0), 0);
  const toggleWpCategory = (name) => {
    setWpCategories(wpCategories.includes(name)
      ? wpCategories.filter(c => c !== name) : [...wpCategories, name]);
  };

  const showIcon = {
    uploads: pinned.includes('uploads') || files.length > 0,
    image: flags.image && (pinned.includes('image') || imageMode),
    web_search: flags.web_search && (pinned.includes('web_search') || webSearchMode),
    knowledge: flags.knowledge && (pinned.includes('knowledge') || !!knowledgeEnvId),
    mcp: flags.mcp && (pinned.includes('mcp') || mcpSelected.length > 0),
    functions: flags.functions && (pinned.includes('functions') || functionsSelected.length > 0),
    wordpress: flags.wp_tools && (pinned.includes('wordpress') || wpActive),
  };

  const FEATURES = [
    { key: 'uploads', label: 'Attach files', icon: 'paperclip',
      status: files.length ? `${files.length} attached` : null,
      onClick: () => { setOpenPanel(null); fileInputRef.current?.click(); } },
    { key: 'image', label: 'Create Image', icon: 'photo',
      status: imageMode ? 'On' : null,
      onClick: () => setImageMode(!imageMode) },
    { key: 'web_search', label: 'Web Search', icon: 'search',
      status: webSearchMode ? 'On' : null,
      onClick: () => setWebSearchMode(!webSearchMode) },
    { key: 'wordpress', label: 'WordPress Tools', icon: 'site',
      status: wpActive ? `${wpToolCount} tools` : null,
      onClick: () => setOpenPanel('wordpress') },
    { key: 'knowledge', label: 'Knowledge', icon: 'brain',
      status: knowledgeName,
      onClick: () => setOpenPanel('knowledge') },
    { key: 'mcp', label: 'MCP Servers', icon: 'plug',
      status: mcpSelected.length ? `${mcpSelected.length} connected` : null,
      onClick: () => setOpenPanel('mcp') },
    { key: 'functions', label: 'Functions', icon: 'braces',
      status: functionsSelected.length ? `${functionsSelected.length} enabled` : null,
      onClick: () => setOpenPanel('functions') },
  ].map(f => {
    const flagKey = f.key === 'wordpress' ? 'wp_tools' : f.key;
    if ((lockedFeatures || []).includes(flagKey)) {
      return { ...f, locked: true,
        onClick: () => window.open('https://meowapps.com/ai-engine/', '_blank', 'noopener') };
    }
    return f;
  }).filter(f => {
    const flagKey = f.key === 'wordpress' ? 'wp_tools' : f.key;
    return f.key === 'uploads' || f.locked || flags[flagKey] !== false;
  });

  const settingsUrl = (window.mwai_workspace || {}).settings_url || '#';

  return (
    <main className="mwai-ws-main" onDragEnter={onDragEnter} onDragLeave={onDragLeave}
      onDragOver={onDragOver} onDrop={onDrop}>
      <header className="mwai-ws-topbar">
        <span className="mwai-ws-conv-name">{title}</span>
        {costText && <span className="mwai-ws-conv-cost">{costText}</span>}
        <div className="mwai-ws-topbar-right">
          <TuneMenu advanced={advanced} setAdvanced={setAdvanced} modelTags={modelTags} />
          <ModelPicker envs={envs} selEnvId={selEnvId} selModel={selModel} selectModel={selectModel} />
        </div>
      </header>

      <section className="mwai-ws-scroll" ref={scrollRef}>
        {isEmpty ? (
          <div className="mwai-ws-hero">
            <div className="mwai-ws-hero-title">What are we working on?</div>
            <div className="mwai-ws-hero-sub">every model, your keys, your site.</div>
          </div>
        ) : (
          <div className="mwai-ws-thread">
            {session.messages.map((m, i) => {
              const prevTs = session.messages.slice(0, i).reverse().find(p => p.timestamp)?.timestamp;
              const showChip = m.timestamp && (!prevTs || m.timestamp - prevTs > 30 * 60 * 1000);
              const isLast = i === session.messages.length - 1;
              return (
                <div key={m.id}>
                  {showChip && <div className="mwai-ws-timechip">{fmtTimeChip(m.timestamp)}</div>}
                  <Message message={m} modelName={resolveModelName(m)}
                    canEdit={m.role === 'user'} onEdit={onEditMessage} busy={session.busy}
                    isLast={isLast} onRegenerate={onRegenerate}
                    onBranch={onBranch} />
                  {m.approval && isLast && !session.busy && (
                    <ApprovalCard approval={m.approval} onApprove={onApproveTool} onDeny={onDenyTool} />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="mwai-ws-composer-wrap" ref={composerWrapRef}>
        <div className={`mwai-ws-composer ${dragOver ? 'dragover' : ''}`}>

          {openPanel === 'plus' && (
            <div className="mwai-ws-pop">
              <div className="mwai-ws-pop-title">Features</div>
              {FEATURES.map(f => (
                <div key={f.key} className={`mwai-ws-pop-item mwai-ws-feature-row ${f.locked ? 'is-locked' : ''}`}
                  onClick={f.onClick}>
                  <span className="mwai-ws-feature-ico">{ICONS[f.icon]}</span>
                  <span className="mwai-ws-feature-label">{f.label}</span>
                  {f.locked && <span className="mwai-ws-pro-chip">Pro</span>}
                  {!f.locked && f.status && <span className="mwai-ws-feature-status">{f.status}</span>}
                  {!f.locked && (
                    <button className={`mwai-ws-pin-btn ${pinned.includes(f.key) ? 'on' : ''}`}
                      title={pinned.includes(f.key) ? 'Unpin from the composer' : 'Pin to the composer'}
                      onClick={(e) => { e.stopPropagation(); togglePin(f.key); }}>
                      {ICONS.pin}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {openPanel === 'wordpress' && (
            <div className="mwai-ws-pop">
              <div className="mwai-ws-pop-title">WordPress Tools</div>
              {!wpToolsInfo?.enabled && (
                <div className="mwai-ws-pop-empty">
                  Working on this site needs the MCP module.<br />
                  <a href={settingsUrl}>Enable it in AI Engine</a>.
                </div>
              )}
              {wpToolsInfo?.enabled && !wpCatalog.length && (
                <div className="mwai-ws-pop-empty">
                  No tools are registered on this site yet.
                </div>
              )}
              {wpToolsInfo?.enabled && wpCatalog.length > 0 && (
                <>
                  <button className={`mwai-ws-pop-item ${wpMode ? 'on' : ''}`}
                    onClick={() => setWpMode(!wpMode)}>
                    Work on {wpToolsInfo.site_name || 'this site'}
                    <span className="mwai-ws-pop-sub">The AI can read and change this WordPress</span>
                    {wpMode && <span className="mwai-ws-pop-check">{ICONS.check}</span>}
                  </button>
                  <div className="mwai-ws-pop-section">Tools</div>
                  {wpCatalog.map(cat => {
                    const on = wpCategories.includes(cat.name);
                    return (
                      <button key={cat.name} className={`mwai-ws-pop-item ${on && wpMode ? 'on' : ''}`}
                        disabled={!wpMode}
                        title={(cat.tools || []).join(', ')}
                        onClick={() => toggleWpCategory(cat.name)}>
                        {cat.name}
                        <span className="mwai-ws-pop-sub">{cat.count} tool{cat.count === 1 ? '' : 's