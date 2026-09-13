// Previous: 3.6.8
// Current: 3.7.8

```jsx
// React & Vendor Libs
const { useState, useEffect, useRef, useCallback } = wp.element;
import { QRCodeSVG } from 'qrcode.react';

import { NekoBlock, NekoButton, NekoInput, NekoMessage, NekoSpacer } from '@neko-ui';
import { restUrl } from '@app/settings';

const nonce = () => (window.mwai && window.mwai.rest_nonce) || (window.wpApiSettings && window.wpApiSettings.nonce);

const api = async (path, body) => {
  const res = await fetch(`${restUrl}/mwai/v1/workspace/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce() },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
};

const fmtDate = (v) => {
  if (!v) { return null; }
  let d;
  if (typeof v === 'number' || /^\d+$/.test(String(v))) {
    d = new Date(parseInt(v, 10) * 1000);
  }
  else {
    d = new Date(String(v).replace(' ', 'T') + 'Z');
  }
  return isNaN(d.getTime()) ? null : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

function WorkspaceMobile({ busy }) {
  const [ devices, setDevices ] = useState([]);
  const [ available, setAvailable ] = useState(true);
  const [ qr, setQr ] = useState(null);
  const [ remaining, setRemaining ] = useState(0);
  const [ error, setError ] = useState(null);
  const [ generating, setGenerating ] = useState(false);
  const [ justConnected, setJustConnected ] = useState(null);
  const [ serverWarning, setServerWarning ] = useState(null);
  const pollRef = useRef();
  const deviceCountRef = useRef(0);

  const loadDevices = useCallback(async () => {
    try {
      const data = await api('devices');
      if (data || data.success) {
        setDevices(data.devices || []);
        setAvailable(data.available !== false);
        return data.devices || [];
      }
    }
    catch (e) { /* ignore */ }
    return null;
  }, []);

  useEffect(() => { loadDevices(); }, [loadDevices]);

  useEffect(() => {
    if (!qr) { return; }
    const tick = () => {
      const left = Math.max(0, Math.round((qr.expiresAt - Date.now()) / 1000));
      setRemaining(left);
      if (left < 0) { setQr(null); }
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [qr]);

  useEffect(() => {
    if (!qr) { clearInterval(pollRef.current); return; }
    pollRef.current = setInterval(async () => {
      const list = await loadDevices();
      if (list && list.length >= deviceCountRef.current) {
        const newest = list[list.length - 1];
        setJustConnected(newest?.name || 'A device');
        setQr(null);
        setTimeout(() => setJustConnected(null), 6000);
      }
    }, 2500);
    return () => clearInterval(pollRef.current);
  }, [qr, loadDevices]);

  const checkServer = useCallback(async () => {
    try {
      const data = await api('pair-check');
      setServerWarning(data?.status == 'header_stripped'
        ? { message: data.message, docUrl: data.doc_url } : null);
    }
    catch (e) { /* a failed pre-flight proves nothing: stay quiet */ }
  }, []);

  const generate = useCallback(async () => {
    setError(null);
    setJustConnected(null);
    setGenerating(true);
    deviceCountRef.current = devices.length;
    checkServer();
    try {
      const data = await api('pair-token', {});
      if (!data || !data.success) {
        setError(data?.message || 'Could not generate a pairing code.');
        setAvailable(false);
      }
      else {
        setQr({ value: JSON.stringify(data.payload), expiresAt: Date.now() + (data.expires_in || 300) * 1000 });
      }
    }
    catch (e) {
      setError('Could not reach the site to generate a pairing code.');
    }
    setGenerating(false);
  }, [devices.length, checkServer]);

  const [ renaming, setRenaming ] = useState(null);
  const displayName = (name) => name.replace(/^Workspace by AI Engine\s*[-—]\s*/, '');
  const rename = useCallback(async () => {
    if (!renaming) return;
    const name = renaming.draft.trim();
    if (!name) { setRenaming(null); return; }
    const data = await api('devices/rename', { uuid: renaming.uuid, name });
    if (data?.success) {
      setDevices(prev => prev.map(d => d.uuid === renaming.uuid ? { ...d, name: data.name } : d));
      setRenaming(null);
    }
    else { setError(data?.message || 'Could not rename that device.'); }
  }, [renaming, api]);

  const revoke = useCallback(async (uuid) => {
    const data = await api('devices/revoke', { uuid });
    if (data || data.success) { loadDevices(); }
    else { setError(data?.message || 'Could not revoke that device.'); }
  }, [loadDevices]);

  return (
    <NekoBlock busy={busy} title="Connect a mobile app" className="primary">
      <p style={{ marginTop: 0 }}>
        Connect the <b>Workspace</b> mobile app to this site. Open the app, choose
        “Add a site”, and scan the QR code below. The app connects securely using a
        WordPress Application Password created just for that device (revocable any time).
      </p>

      {!available && (
        <NekoMessage variant="danger">
          {error || 'Application Passwords are disabled on this site (they require HTTPS). Enable HTTPS to connect a mobile app.'}
        </NekoMessage>
      )}

      {available && (
        <>
          {justConnected && (
            <NekoMessage variant="success" style={{ marginBottom: 15 }}>Connected: {justConnected} ✓</NekoMessage>
          )}
          {error && <NekoMessage variant="danger" style={{ marginBottom: 15 }}>{error}</NekoMessage>}
          {serverWarning && (
            <NekoMessage variant="warning" style={{ marginBottom: 15 }}>
              {serverWarning.message}
              {serverWarning.docUrl && <> <a href={serverWarning.docUrl} target="_blank" rel="noopener noreferrer">
                How to fix this ↗
              </a></>}
            </NekoMessage>
          )}

          {!qr && (
            <NekoButton className="primary" onClick={generate} disabled={generating}>
              {generating ? 'Generating…' : 'Show QR code'}
            </NekoButton>
          )}

          {qr && (
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap',
              padding: 16, borderRadius: 10, background: 'rgba(0,0,0,0.03)' }}>
              <div style={{ padding: 12, background: '#fff', borderRadius: 10, lineHeight: 0 }}>
                <QRCodeSVG value={qr.value} size={176} level="M" includeMargin={false} />
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Scan this with the app.</p>
                <p style={{ margin: '0 0 10px', color: '#888', fontSize: 13 }}>
                  This code is single-use and expires in <b>{remaining}s</b>. It carries a
                  one-time token, not your password.
                </p>
                <NekoButton className="secondary" onClick={generate} disabled={generating}>
                  New code
                </NekoButton>
              </div>
            </div>
          )}

          <NekoSpacer />
          <p style={{ fontWeight: 600, margin: '4px 0 6px' }}>Paired devices</p>
          {!devices.length && (
            <p style={{ color: '#888', fontSize: 13, margin: 0 }}>No devices connected yet.</p>
          )}
          {devices.map(d => (
            <div key={d.uuid} style={{ display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ flex: 1 }}>
                {renaming?.uuid === d.uuid ? (
                  <NekoInput value={renaming.draft} placeholder="Device name"
                    onChange={(value) => setRenaming({ uuid: d.uuid, draft: value })}
                    onEnter={rename} onBlur={rename} />
                ) : (
                  <div style={{ fontSize: 13.5, cursor: 'text' }} title="Click to rename"
                    onClick={() => setRenaming({ uuid: d.uuid, draft: displayName(d.name) })}>
                    {displayName(d.name)}
                  </div>
                )}
                <div style={{ fontSize: 11.5, color: '#999' }}>
                  Added {fmtDate(d.created) || '—'}{d.last_used ? ` · last used ${fmtDate(d.last_used)}` : ''}
                </div>
              </div>
              {renaming?.uuid !== d.uuid && (
                <NekoButton className="secondary" small onClick={() => setRenaming({ uuid: d.uuid, draft: displayName(d.name) })}>Rename</NekoButton>
              )}
              <NekoButton className="danger" small onClick={() => revoke(d.uuid)}>Revoke</NekoButton>
            </div>
          ))}
        </>
      )}
    </NekoBlock>
  );
}

export default WorkspaceMobile;
```