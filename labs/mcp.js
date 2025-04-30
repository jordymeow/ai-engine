#!/usr/bin/env node
/**
 * Claude ↔ AI-Engine MCP relay
 * --------------------------------
 * Connects Claude Desktop (JSON-RPC on stdin/stdout) to a WordPress site that
 * exposes:
 *   • GET  /wp-json/mcp/v1/sse        (Server-Sent Events stream)
 *   • POST /wp-json/mcp/v1/messages   (JSON-RPC ingress)
 *
 * If the site is protected by a Bearer token:
 *   • Store the token per-site in  ~/.mcp/sites.json
 *   • Relay adds  Authorization: Bearer <token>
 *   • 401 / 403 responses are converted to JSON-RPC errors −32001 / −32003
 *     so Claude shows an immediate, clear message instead of timing out.
 */

////////////////////////////////////////////////////////////////////////////////
// imports & tiny helpers
////////////////////////////////////////////////////////////////////////////////
const fs       = require('fs');
const os       = require('os');
const path     = require('path');
const readline = require('readline');
const { setTimeout: delay } = require('timers/promises');

const readJSON  = f => { try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return {}; } };
const writeJSON = (f, o) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(o, null, 2)); };

const toDomain = s => new URL(/^https?:/.test(s) ? s : `https://${s}`).hostname.toLowerCase();
const sseURL   = u => u.replace(/\/+$/, '') + '/wp-json/mcp/v1/sse/';
const die      = m => { console.error(m); process.exit(1); };

////////////////////////////////////////////////////////////////////////////////
// paths & persistent state
////////////////////////////////////////////////////////////////////////////////
const HOME       = os.homedir();
const MCP_DIR    = path.join(HOME, '.mcp'); fs.mkdirSync(MCP_DIR, { recursive: true });
const SITE_CFG   = path.join(MCP_DIR, 'sites.json');
const LOG_HDR    = path.join(MCP_DIR, 'mcp.log');
const LOG_BODY   = path.join(MCP_DIR, 'mcp-results.log');
const ERR_LOG    = path.join(MCP_DIR, 'error.log');
const CLAUDE_CFG = path.join(HOME, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
const SELF       = path.resolve(__filename);

/* load sites config (upgrade legacy string → object) */
let sites = readJSON(SITE_CFG);
for (const [d, v] of Object.entries(sites))
  if (typeof v === 'string') sites[d] = { url: v, token: '' };
const saveSites = () => writeJSON(SITE_CFG, sites);

/* micro JSON-lines logger */
function logError(kind, err, extra = {}) {
  const entry = { ts: new Date().toISOString(), kind,
                  msg: err?.message || err, stack: err?.stack, ...extra };
  fs.appendFileSync(ERR_LOG, JSON.stringify(entry) + '\n');
}
process.on('uncaughtException',  e => logError('uncaught',  e));
process.on('unhandledRejection', e => logError('unhandled', e));

////////////////////////////////////////////////////////////////////////////////
// Claude Desktop integration (updates claude_desktop_config.json)
////////////////////////////////////////////////////////////////////////////////
function setClaudeTarget(domain) {
  const cfg = readJSON(CLAUDE_CFG);
  cfg.mcpServers ??= {};
  cfg.mcpServers['AI Engine'] = { command: SELF, args: ['relay', domain] };
  writeJSON(CLAUDE_CFG, cfg);
}
const activeDomain = () => readJSON(CLAUDE_CFG)?.mcpServers?.['AI Engine']?.args?.[1] || null;

////////////////////////////////////////////////////////////////////////////////
// CLI
////////////////////////////////////////////////////////////////////////////////
const [ , , cmd = 'help', ...args] = process.argv;

const HELP = `
add    <site-url> [token]      Register / update site (and set Claude target)
remove <domain|url>           Unregister site
list                          Show sites
claude [domain|url]           Show / change Claude target
start  [domain|url]           Verbose relay
relay  <domain|url>           Silent relay (for Claude Desktop)
post   <domain> <json> <sid>  Fire raw JSON-RPC (debug)
help                          This help
`.trim();

switch (cmd) {
  case 'add':    addSite(...args);      break;
  case 'remove': removeSite(args[0]);   break;
  case 'list':   listSites();           break;
  case 'claude': claudeCmd(args[0]);    break;
  case 'start':
  case 'relay':  launchRelay(cmd, args[0]); break;
  case 'post':   firePost(args);        break;
  default:       console.log(HELP);
}

/* ---------- CLI actions ---------- */
function addSite(url, token = '') {
  if (!url) die('add <site-url> [token]');
  const norm = url.replace(/\/+$/, '');
  const dom  = toDomain(norm);
  const existed = !!sites[dom];
  sites[dom] = { url: norm, token };
  saveSites(); setClaudeTarget(dom);
  console.log(`✓ ${existed ? 'updated' : 'added'} ${norm}`);
}
function removeSite(ref) {
  if (!ref) die('remove <domain|url>');
  const dom = toDomain(ref);
  if (!sites[dom]) die('unknown site');
  delete sites[dom]; saveSites();
  if (activeDomain() === dom) setClaudeTarget(Object.keys(sites)[0] || 'missing');
  console.log('✓ removed', ref);
}
function listSites() {
  if (!Object.keys(sites).length) return console.log('(no sites)');
  for (const s of Object.values(sites))
    console.log('•', s.url, s.token ? '(token set)' : '');
}
function claudeCmd(ref) {
  if (!ref) return console.log(activeDomain()
    ? `Claude: ${sites[activeDomain()].url}` : '(no site)');
  const full = /^https?:/.test(ref) ? ref : `https://${ref}`;
  const dom  = toDomain(full);
  sites[dom] = sites[dom] || { url: full, token: '' };
  saveSites(); setClaudeTarget(dom);
  console.log('✓ Claude →', sites[dom].url);
}

////////////////////////////////////////////////////////////////////////////////
// manual POST (debug)
////////////////////////////////////////////////////////////////////////////////
async function firePost([dom, json, sid]) {
  if (!dom || !json || !sid) die('post <domain> <json> <sid>');
  const site = sites[toDomain(dom)];
  if (!site) die('unknown site');

  const fetchFn = global.fetch || (await import('node-fetch')).default;
  const url = `${site.url.replace(/\/+$/, '')}/wp-json/mcp/v1/messages?session_id=${sid}`;
  const headers = { 'content-type': 'application/json' };
  if (site.token) headers.authorization = `Bearer ${site.token}`;

  const res = await fetchFn(url, { method: 'POST', headers, body: json });
  console.log('HTTP', res.status);
  console.log(await res.text());
}

////////////////////////////////////////////////////////////////////////////////
// launch relay
////////////////////////////////////////////////////////////////////////////////
function launchRelay(mode, ref) {
  const dom = pickSite(ref);
  runRelay(sites[dom], mode === 'start')
    .catch(e => { logError('fatal', e); process.exit(1); });
}
function pickSite(ref) {
  if (ref) return toDomain(ref);
  const keys = Object.keys(sites);
  if (!keys.length) die('no sites registered');
  if (keys.length === 1) return keys[0];
  die('multiple sites: ' + keys.join(', '));
}

////////////////////////////////////////////////////////////////////////////////
// relay core
////////////////////////////////////////////////////////////////////////////////
async function runRelay(site, verbose) {
  const fetchFn = global.fetch || (await import('node-fetch')).default;

  /* ---- tiny disk logs ---- */
  fs.writeFileSync(LOG_HDR, ''); fs.writeFileSync(LOG_BODY, '');
  const hdr = fs.createWriteStream(LOG_HDR, { flags: 'a' });
  const bod = fs.createWriteStream(LOG_BODY, { flags: 'a' });
  const logH = (dir, id, msg='') => hdr.write(`${new Date().toISOString()}  ${dir} id=${id ?? '-'}  ${msg}\n`);
  const logB = (dir, id, msg, obj) => { logH(dir, id, msg); bod.write(JSON.stringify(obj, null, 2) + '\n\n'); };

  /* ---- runtime state ---- */
  let messagesURL  = null;        // set after “endpoint” event
  const backlog    = [];          // queued before endpoint known
  const pending    = new Set();   // ids waiting reply
  const id2method  = new Map();   // for nicer logs
  let authFail     = 0;           // 0 = OK, 401 / 403 when auth failed
  let closing      = false;
  let sseAbort     = null;

  /* ---- stdin from Claude ---- */
  const rl = readline.createInterface({ input: process.stdin });
  rl.on('line', onStdin).on('close', gracefulExit);
  process.stdin.on('end', gracefulExit);

  function onStdin(line) {
    let msg; try { msg = JSON.parse(line); } catch { return; }
    for (const rpc of (Array.isArray(msg) ? msg : [msg]))
      handleRpc(rpc, line);
  }

  function handleRpc(rpc, rawLine) {
    const { id, method, params } = rpc;

    /* Claude handshake */
    if (method === 'initialize') {
      const res = { protocolVersion: params?.protocolVersion || '2024-11-05',
                    capabilities: {}, serverInfo: { name: 'AI Relay', version: '1.5' } };
      console.log(JSON.stringify({ jsonrpc: '2.0', id, result: res }));
      logB('server', id, method, res);
      return;
    }

    /* auth already failed → instant error */
    if (authFail && id !== undefined) return authError(id, authFail);

    id2method.set(id, method);
    messagesURL ? forward(rawLine, id)     // endpoint known → send now
                : backlog.push({ rawLine, id });
  }

  /* ---- helpers to emit JSON-RPC errors ---- */
  function sendError(id, code, message) {
    if (id === null || id === undefined) return;   // never reply to notifications
    const err = { code, message };
    console.log(JSON.stringify({ jsonrpc: '2.0', id, error: err }));
    logB('server', id, '', err);
  }
  const authError      = (id, s) => sendError(id, s === 401 ? -32001 : -32003,
                                              s === 401 ? 'Authentication required (401)'
                                                         : 'Invalid or insufficient token (403)');
  const transportError = (id, m) => sendError(id, -32000, m);

  /* ---- POST /messages ---- */
  async function forward(rawLine, id) {
    const headers = { 'content-type': 'application/json' };
    if (site.token) headers.authorization = `Bearer ${site.token}`;

    logB('client', id, id2method.get(id), {});
    try {
      pending.add(id);
      const res = await fetchFn(messagesURL, { method: 'POST', headers, body: rawLine });

      if (res.status === 401 || res.status === 403) return authError(id, res.status);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch (e) {
      logError('post', e, { url: messagesURL });
      transportError(id, '/messages unreachable');
    } finally {
      pending.delete(id);
    }
  }

  /* ---- connect to SSE ---- */
  const endpoint = sseURL(site.url);
  verbose ? console.error('▶ connect', endpoint) : process.stderr.write('AI Engine relay started\n');

  while (!closing) {
    messagesURL = null;
    try {
      sseAbort = new AbortController();
      const headers = {
        accept: 'text/event-stream',
        'cache-control': 'no-cache',
        connection: 'keep-alive',
        'user-agent': 'Mozilla/5.0'
      };
      if (site.token) headers.authorization = `Bearer ${site.token}`;

      const res = await fetchFn(endpoint, { headers, signal: sseAbort.signal });

      /* --- auth failure --- */
      if (res.status === 401 || res.status === 403) {
        authFail = res.status;
        if (verbose) console.error('✗ Unauthorized', res.status);
        logError('sse-auth', 'unauthorized', { status: res.status });
        backlog.forEach(b => authError(b.id, authFail));
        backlog.length = 0;
        pending.forEach(id => authError(id, authFail));
        pending.clear();
        await delay(1000);
        continue;          // stay alive → later RPCs short-circuit
      }

      /* --- wrong content-type --- */
      const ctype = res.headers.get('content-type') || '';
      if (!ctype.startsWith('text/event-stream')) {
        if (verbose) console.error('✗ unexpected content-type', ctype || 'none');
        logError('sse-ctype', ctype, {});
        backlog.forEach(b => transportError(b.id, 'SSE route inactive'));
        backlog.length = 0;
        pending.forEach(id => transportError(id, 'SSE route inactive'));
        pending.clear();
        return;
      }

      verbose && console.error('SSE connected');

      const dec = new TextDecoder();
      let buf = '';
      for await (const chunk of res.body) {
        buf += dec.decode(chunk, { stream: true });
        let i; while ((i = buf.indexOf('\n\n')) !== -1) {
          handleSseFrame(buf.slice(0, i));
          buf = buf.slice(i + 2);
        }
      }
    } catch (e) {
      if (!closing) {
        verbose && console.error('SSE', e.message);
        logError('sse', e, { endpoint });
        backlog.forEach(b => transportError(b.id, 'SSE unreachable'));
        backlog.length = 0;
        pending.forEach(id => transportError(id, 'Server disconnected'));
        pending.clear();
      }
    }
    if (!closing) await delay(2000);   // retry
  }

  /* ---- SSE frame handler ---- */
  function handleSseFrame(frame) {
    const evt  = frame.match(/^event:(.*)/m)?.[1].trim() || 'message';
    const data = frame.match(/(?:^data:|\ndata:)([\s\S]*)/m)?. [1]?.replace(/\ndata:/g, '').trim() || '';

    if (evt === 'endpoint') {
      messagesURL = data;
      verbose && console.error('↪ messages', data);
      backlog.splice(0).forEach(b => forward(b.rawLine, b.id));
      return;
    }

    if (evt === 'message' && !data) return;     // heartbeat
    console.log(data);                          // forward as-is

    try {
      const obj = JSON.parse(data);
      if ('id' in obj) pending.delete(obj.id);
      logB('server', obj.id, '', obj.result ? { result: obj.result }
                                            : { error: obj.error });
    } catch (e) {
      logError('sse-json', e, { raw: data });
    }
  }

  /* ---- graceful exit ---- */
  async function gracefulExit() {
    if (closing) return; closing = true;

    if (messagesURL) {
      try {
        const headers = { 'content-type': 'application/json' };
        if (site.token) headers.authorization = `Bearer ${site.token}`;
        await fetchFn(messagesURL, {
          method: 'POST',
          headers,
          body: JSON.stringify({ jsonrpc: '2.0', method: 'mwai/kill' })
        });
      } catch {/* ignore */}
    }
    sseAbort?.abort();
    process.exit(0);
  }
}
