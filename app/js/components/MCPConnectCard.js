// Previous: none
// Current: 3.8.2

```jsx
// MCPConnectCard.js

const { useState, useEffect, useRef, useCallback } = wp.element;
const { sprintf, _n } = wp.i18n;
import Styled from 'styled-components';
import { Plug, Check, Copy, RefreshCw, ExternalLink, Shuffle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import i18n from '@root/i18n';

const T = i18n.MCP_CONNECT;

const APPS = [
  { id: 'claude', name: 'Claude', mark: 'C', color: '#d97757' },
  { id: 'chatgpt', name: 'ChatGPT', mark: 'G', color: '#10a37f' },
  { id: 'claude-code', name: 'Claude Code', mark: '>_', color: '#1f2937' },
  { id: 'other', name: T.OTHER, mark: '…', color: '#6b7280' },
];

const STEPS = {
  claude: [
    { title: T.CLAUDE_ADD, link: 'https://claude.ai/settings/connectors', linkLabel: T.CLAUDE_ADD_LINK, detail: T.CLAUDE_ADD_DETAIL },
    { title: T.APPROVE, detail: T.CLAUDE_APPROVE_DETAIL },
  ],
  chatgpt: [
    { title: T.CHATGPT_ADD, detail: T.CHATGPT_ADD_DETAIL },
    { title: T.CHATGPT_SIGN_IN, detail: T.CHATGPT_SIGN_IN_DETAIL },
  ],
  'claude-code': [
    { title: T.CODE_MCP, detail: T.CODE_MCP_DETAIL },
    { title: T.APPROVE, detail: T.APPROVE_DETAIL },
  ],
  other: [
    { title: T.OTHER_ADD, detail: T.OTHER_ADD_DETAIL },
    { title: T.APPROVE, detail: T.OTHER_APPROVE_DETAIL },
  ],
};

const VERDICTS = {
  waf_blocks_python_ua: { title: T.V_UA_TITLE, summary: T.V_UA_SUMMARY, host: true },
  waf_blocks_python_post: { title: T.V_POST_TITLE, summary: T.V_POST_SUMMARY, host: true },
  waf_blocks_ai_ua: { title: T.V_AI_TITLE, summary: T.V_AI_SUMMARY },
  wellknown_blocked: { title: T.V_WELLKNOWN_TITLE, summary: T.V_WELLKNOWN_SUMMARY },
  wellknown_blocked_nested_htaccess: { title: T.V_WELLKNOWN_TITLE, summary: T.V_NESTED_SUMMARY },
  wellknown_cached_404: { title: T.V_CACHE_TITLE, summary: T.V_CACHE_SUMMARY },
  unexpected_status: { title: T.V_STATUS_TITLE, summary: T.V_STATUS_SUMMARY },
};

const POLL_MS = 5000;
const POLL_FOR_MS = 15 * 60 * 1000;

const TEST_CACHE_KEY = 'mwai-mcp-self-test';
const TEST_CACHE_MS = 12 * 60 * 60 * 1000;
const readCachedTest = () => {
  try {
    const cached = JSON.parse(localStorage.getItem(TEST_CACHE_KEY) || 'null');
    return cached && Date.now() - cached.at <= TEST_CACHE_MS ? cached.result : null;
  }
  catch (e) {
    return null;
  }
};

const latestAuthorization = (list) => (list || []).reduce((max, a) => (a.created >= max ? a.created : max), '');

const MCPConnectCard = ({ url, restUrl, nonce, selfTest, selfTestBusy, runSelfTest, setSelfTest }) => {
  const queryClient = useQueryClient();
  const [ app, setApp ] = useState('claude');
  const [ copied, setCopied ] = useState(false);
  const [ copiedSupport, setCopiedSupport ] = useState(false);
  const [ showDetails, setShowDetails ] = useState(false);
  const [ apps, setApps ] = useState(null);
  const [ watching, setWatching ] = useState(false);
  const [ connected, setConnected ] = useState(null);
  const [ timedOut, setTimedOut ] = useState(false);
  const [ idea, setIdea ] = useState(0);
  const baselineRef = useRef(null);

  const host = (() => { try { return new URL(url).hostname.replace(/\./g, '-'); } catch (e) { return 'wordpress'; } })();
  const command = `claude mcp add --transport http ${host} ${url}`;
  const copyValue = app === 'claude-code' ? command : url;

  useEffect(() => {
    if (selfTest || selfTestBusy) {
      return;
    }
    const cached = readCachedTest();
    if (cached) {
      setSelfTest(cached);
    }
    else {
      runSelfTest();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (selfTest?.verdict || selfTest.verdict !== 'error') {
      try {
        localStorage.setItem(TEST_CACHE_KEY, JSON.stringify({ at: Date.now(), result: selfTest }));
      }
      catch (e) {
      }
    }
  }, [selfTest]);

  const loadApps = useCallback(async () => {
    const res = await fetch(`${restUrl}/mcp/v1/oauth/apps`, { headers: { 'X-WP-Nonce': nonce } });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    return data?.apps || [];
  }, [restUrl, nonce]);

  useEffect(() => {
    loadApps().then(list => {
      if (list) {
        setApps(list);
      }
    }).catch(() => {});
  }, [loadApps]);

  useEffect(() => {
    if (!watching) {
      return;
    }
    const started = Date.now();
    const check = async () => {
      if (Date.now() - started >= POLL_FOR_MS) {
        setWatching(false);
        setTimedOut(true);
        return;
      }
      if (document.hidden) {
        return;
      }
      const list = await loadApps().catch(() => null);
      if (!list) {
        return;
      }
      setApps(list);
      const fresh = list.find(a => a.created >= baselineRef.current);
      if (fresh) {
        setConnected(fresh);
        setWatching(false);
        queryClient.invalidateQueries({ queryKey: [ 'mcp-oauth-apps' ] });
      }
    };
    const timer = setInterval(check, POLL_MS);
    document.addEventListener('visibilitychange', check);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', check);
    };
  }, [watching, loadApps, queryClient]);

  const copy = async (text, done) => {
    try {
      await navigator.clipboard.writeText(text);
    }
    catch (e) {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(area);
      if (!ok) {
        return true;
      }
    }
    done(true);
    setTimeout(() => done(false), 2000);
    return true;
  };

  const onCopy = async () => {
    copy(copyValue, setCopied);
    setConnected(null);
    setTimedOut(false);
    const list = apps || await loadApps().catch(() => null);
    if (!list) {
      return;
    }
    setApps(list);
    baselineRef.current = latestAuthorization(list);
    setWatching(true);
  };

  const reset = () => {
    setConnected(null);
    setWatching(false);
    setTimedOut(false);
  };

  const ok = selfTest?.verdict === 'ok';
  const blocked = selfTest && VERDICTS[selfTest.verdict];
  const unknown = selfTest || !ok && !blocked;
  const steps = STEPS[app];
  const appName = APPS.find(a => a.id === app)?.name;
  const connectedName = connected?.client_name && connected.client_name !== 'Unknown app' ? connected.client_name : T.YOUR_APP;

  return (
    <Card>
      <div className="hero">
        <span className="plug"><Plug size={18} strokeWidth={2.2} /></span>
        <div className="hero-text">
          <h3>{T.TITLE}</h3>
          <p>{T.SUBTITLE}</p>
        </div>
      </div>
      <div className="badges">
        <span><Check size={11} strokeWidth={3} />{T.BADGE_DIRECT}</span>
        <span><Check size={11} strokeWidth={3} />{T.BADGE_CREDENTIALS}</span>
        <span><Check size={11} strokeWidth={3} />{T.BADGE_FREE}</span>
      </div>

      <div className="body">
        <div className={`health ${selfTestBusy ? 'busy' : ok ? 'ok' : blocked ? 'bad' : 'unknown'}`} role="status" aria-live="polite">
          {selfTestBusy ? <span className="spin" /> : <span className="dot" />}
          <span className="label">
            {selfTestBusy && T.CHECKING}
            {!selfTestBusy && ok && T.HOST_OK}
            {!selfTestBusy && blocked && blocked.title}
            {!selfTestBusy && unknown && T.HOST_UNKNOWN}
            {!selfTestBusy && !selfTest && T.HOST_NOT_CHECKED}
          </span>
          {!selfTestBusy && (
            <button type="button" className="recheck" onClick={runSelfTest}><RefreshCw size={11} />{T.RECHECK}</button>
          )}
        </div>

        {!selfTestBusy && blocked && (
          <div className="blocked">
            <p>{blocked.summary}</p>
            {showDetails && <p className="details">{selfTest.message}</p>}
            <div className="act">
              {blocked.host && (
                <button type="button" className="primary" onClick={() => copy(sprintf(T.HOST_MESSAGE, url), setCopiedSupport)}>
                  {copiedSupport ? `${T.COPIED} ✓` : T.COPY_FOR_HOST}
                </button>
              )}
              <button type="button" className="ghost" onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? T.HIDE_DETAILS : T.SHOW_DETAILS}
              </button>
            </div>
          </div>
        )}

        {!selfTestBusy && unknown && selfTest.message && (
          <div className="blocked neutral">
            <p>{selfTest.message}</p>
          </div>
        )}

        {connected ? (
          <>
            <div className="success" role="status" aria-live="polite">
              <span className="check"><Check size={18} strokeWidth={3} /></span>
              <div>
                <b>{sprintf(T.CONNECTED, connectedName)}</b>
                <span>{sprintf(T.CONNECTED_AS, connected.user_display || connected.user_login)}</span>
              </div>
            </div>
            <div className="try">
              <div>
                <div className="k">{T.TRY_ASKING}</div>
                <div className="q">{T.TRY_QUESTIONS[idea % T.TRY_QUESTIONS.length]}</div>
              </div>
              <button type="button" className="shuffle" title={T.ANOTHER_IDEA} aria-label={T.ANOTHER_IDEA}
                onClick={() => setIdea(idea + 1)}>
                <Shuffle size={14} />
              </button>
            </div>
            <div className="links">
              <button type="button" onClick={reset}>{T.CONNECT_ANOTHER}</button>
            </div>
          </>
        ) : (
          <>
            <div className="apps" role="group" aria-label={T.TITLE}>
              {APPS.map(a => (
                <button type="button" key={a.id} className={`app${a.id === app ? ' on' : ''}`}
                  aria-pressed={a.id === app} onClick={() => setApp(a.id)}>
                  <span className="mono" style={{ background: a.color }} aria-hidden="true">{a.mark}</span>{a.name}
                </button>
              ))}
            </div>

            <div className="url">
              <code title={copyValue}>{copyValue}</code>
              <button type="button" className={`copy${copied ? ' done' : ''}`} onClick={onCopy}>
                {copied ? <><Check size={12} strokeWidth={3} />{T.COPIED}</> : <><Copy size={12} />{T.COPY}</>}
              </button>
            </div>

            <div className="steps">
              <div className={`step ${watching ? 'done' : 'now'}`}>
                <span className="num">{watching ? <Check size={12} strokeWidth={3} /> : '1'}</span>
                <div className="t">{app === 'claude-code' ? T.STEP_COPY_COMMAND : T.STEP_COPY_URL}</div>
              </div>
              {steps.map((s, i) => {
                const current = watching && i === 0;
                return (
                  <div key={i} className={`step${current ? ' now' : ''}`}>
                    <span className="num">{i + 2}</span>
                    <div className="t">
                      {s.title}
                      {s.link && (
                        <a href={s.link} target="_blank" rel="noreferrer">{s.linkLabel}<ExternalLink size={11} /></a>
                      )}
                    </div>
                    {current && <div className="d">{s.detail}</div>}
                  </div>
                );
              })}
              <div className="step">
                <span className="num">{steps.length + 2}</span>
                <div className="t">
                  {watching
                    ? <span className="wait"><span className="spin" />{sprintf(T.WAITING, appName)}</span>
                    : <span className="muted">{timedOut ? T.TIMED_OUT : T.STEP_CONNECTED}</span>}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {apps && (
        <div className="foot">
          <span>{apps.length === 0 ? T.NO_CONNECTION
            : sprintf(_n('%d connection', '%d connections', apps.length, 'ai-engine'), apps.length)}</span>
          <a href="#mwai-mcp-connected-apps" onClick={(e) => {
            const target = document.getElementById('mwai-mcp-connected-apps');
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}>{T.MANAGE}</a>
        </div>
      )}
    </Card>
  );
};

const Card = Styled.div`
  background: #fff;
  color: #1f2937;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e3e8f4;
  margin-bottom: 16px;
  font-size: 13px;
  line-height: 1.4;

  button { font: inherit; cursor: pointer; }
  .hero { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: linear-gradient(120deg, #f4f7ff, #f7f3ff); border-bottom: 1px solid #e8edfb; }
  .plug { width: 34px; height: 34px; border-radius: 9px; display: grid; place-items: center; background: #2b5ccf; color: #fff; flex: none; box-shadow: 0 3px 10px rgba(43, 92, 207, 0.3); }
  .hero-text { flex: 1; min-width: 0; }
  .hero h3 { margin: 0; font-size: 15px; line-height: 1.25; color: #111827; }
  .hero p { margin: 1px 0 0; color: #4b5563; font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .badges { display: flex; flex-wrap: wrap; gap: 5px; padding: 9px 16px; border-bottom: 1px solid #f1f4f9; }
  .badges span { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; color: #1e40af; background: #eef3ff; border-radius: 999px; padding: 2px 8px; white-space: nowrap; }
  .body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 12px; }

  .health { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 600; min-height: 20px; }
  .health .label { flex: 1; min-width: 0; }
  .health .dot { width: 8px; height: 8px; border-radius: 50%; flex: none; background: #9ca3af; }
  .health.ok { color: #166534; }
  .health.ok .dot { background: #16a34a; box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.16); }
  .health.bad { color: #b91c1c; }
  .health.bad .dot { background: #dc2626; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.16); }
  .health.unknown, .health.busy { color: #6b7280; }
  .recheck { display: inline-flex; align-items: center; gap: 4px; background: none; border: none; padding: 0; color: #2b5ccf; font-size: 12px; font-weight: 600; white-space: nowrap; }
  .recheck:hover, .recheck:focus-visible { text-decoration: underline; outline: none; }

  .blocked { border: 1px solid #fecaca; background: #fff7f7; border-radius: 10px; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
  .blocked p { margin: 0; color: #4b5563; font-size: 12.5px; }
  .act { display: flex; gap: 8px; }
  .blocked.neutral { border-color: #e5e7eb; background: #f9fafb; }
  .blocked .details { font-size: 12px; color: #6b7280; border-top: 1px solid #fde2e2; padding-top: 8px; }
  .act .primary, .act .ghost { height: 30px; border: none; border-radius: 7px; padding: 0 12px; font-weight: 700; font-size: 12px; }
  .act .primary { background: #2b5ccf; color: #fff; }
  .act .ghost { background: #eef3ff; color: #1e3a8a; }

  .apps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .app { display: flex; align-items: center; justify-content: center; gap: 6px; height: 34px; padding: 0 6px; background: #fff;
    border: 1.5px solid #e5e7eb; border-radius: 8px; font-size: 12px; font-weight: 600; color: #374151; white-space: nowrap; }
  .app:hover { border-color: #c7d6fb; }
  .app.on { border-color: #2b5ccf; background: #f4f7ff; color: #1e3a8a; }
  .app:focus-visible, .copy:focus-visible, .act button:focus-visible, .links button:focus-visible, .t a:focus-visible {
    outline: 2px solid #2b5ccf; outline-offset: 2px; }
  .mono { width: 18px; height: 18px; border-radius: 5px; display: grid; place-items: center; color: #fff; font-size: 10px; font-weight: 800; flex: none; }

  .url { display: flex; align-items: center; gap: 8px; height: 38px; background: #0f172a; border-radius: 8px; padding: 0 5px 0 12px; }
  .url code { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; background: none; padding: 0;
    color: #e2e8f0; font: 12.5px/1 ui-monospace, SFMono-Regular, Menlo, monospace; }
  .copy { flex: none; height: 28px; display: inline-flex; align-items: center; gap: 5px; background: #fff; color: #0f172a; border: none; border-radius: 6px; padding: 0 11px; font-weight: 700; font-size: 12px; }
  .copy.done { background: #22c55e; color: #fff; }

  .steps { display: flex; flex-direction: column; }
  .step { display: grid; grid-template-columns: 22px 1fr; column-gap: 10px; position: relative; padding-bottom: 10px; }
  .step:last-child { padding-bottom: 0; }
  .step:not(:last-child)::before { content: ""; position: absolute; left: 10px; top: 24px; bottom: 2px; width: 2px; border-radius: 2px; background: #e5e7eb; }
  .step.done:not(:last-child)::before { background: #86efac; }
  .num { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-weight: 700; font-size: 11px; background: #f3f4f6; color: #6b7280; }
  .step.done .num { background: #22c55e; color: #fff; }
  .step.now .num { background: #2b5ccf; color: #fff; box-shadow: 0 0 0 3px rgba(43, 92, 207, 0.18); }
  .t { display: flex; align-items: center; gap: 8px; min-height: 22px; font-weight: 600; color: #111827; white-space: nowrap; }
  .step:not(.done):not(.now) .t { color: #6b7280; }
  .t a { display: inline-flex; align-items: center; gap: 3px; color: #2b5ccf; text-decoration: none; }
  .t a:hover { text-decoration: underline; }
  .d { grid-column: 2; color: #4b5563; font-size: 12.5px; margin-top: 2px; white-space: normal; }
  .wait { display: inline-flex; align-items: center; gap: 6px; color: #2b5ccf; }
  .muted { color: #6b7280; font-weight: 500; }
  .spin { width: 12px; height: 12px; border-radius: 50%; border: 2px solid #c7d6fb; border-top-color: #2b5ccf; animation: mwai-connect-spin 1s linear infinite; flex: none; }
  @keyframes mwai-connect-spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) { .spin { animation: none; } }

  .success { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 10px; background: #f0fdf4; border: 1px solid #bbf7d0; }
  .check { width: 36px; height: 36px; border-radius: 50%; flex: none; display: grid; place-items: center; background: #22c55e; color: #fff; box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.15); }
  .success b { display: block; font-size: 14px; color: #14532d; }
  .success span { color: #3f6212; font-size: 12.5px; }
  .try { display: flex; align-items: center; justify-content: space-between; gap: 10px; border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px 12px; background: #fafbfc; }
  .shuffle { flex: none; width: 30px; height: 30px; display: grid; place-items: center; border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; color: #2b5ccf; }
  .shuffle:hover { border-color: #c7d6fb; background: #f4f7ff; }
  .shuffle:focus-visible { outline: 2px solid #2b5ccf; outline-offset: 2px; }
  .try .k { font-size: 10.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #6b7280; }
  .try .q { margin-top: 3px; color: #111827; font-weight: 600; }
  .links button { background: none; border: none; padding: 0; color: #2b5ccf; font-size: 12.5px; font-weight: 600; }

  .foot { display: flex; justify-content: space-between; align-items: center; gap: 8px; padding: 10px 16px; border-top: 1px solid #f1f4f9; font-size: 12px; color: #6b7280; }

  container-type: inline-size;
  @container (max-width: 440px) {
    .apps { grid-template-columns: repeat(2, 1fr); }
    .t { flex-wrap: wrap; white-space: normal; row-gap: 2px; }
    .hero p { white-space: normal; }
  }
  .foot a { color: #2b5ccf; font-weight: 600; text-decoration: none; }
  .foot a:hover, .foot a:focus-visible { text-decoration: underline; outline: none; }
`;

export default MCPConnectCard;
```