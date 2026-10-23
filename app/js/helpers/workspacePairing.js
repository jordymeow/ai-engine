// Previous: none
// Current: 3.8.7

```javascript
// workspacePairing.js
//
// Everything the Workspace phone app needs on the admin side, shared by the
// Settings → Workspace block and the Dashboard card: the store links (with their
// campaign tags) and the pairing flow (QR code, expiry countdown, polling for the
// new device).

const { useState, useEffect, useRef, useCallback } = wp.element;
import { restUrl } from '@app/settings';

const APP_STORE_URL = 'https://apps.apple.com/app/workspace-for-wordpress/id6794717714';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.meowapps.workspace';

const APP_STORE_PROVIDER_TOKEN = '126143794';

const CAMPAIGNS = {
  card: { appStore: 'aie-workspace-card', play: 'workspace-card' },
  settings: { appStore: 'aie-workspace-settings', play: 'workspace-settings' },
};

const appStoreUrl = (placement) => {
  const ct = CAMPAIGNS[placement]?.appStore;
  if (!APP_STORE_PROVIDER_TOKEN || !ct) { return APP_STORE_URL; }
  return `${APP_STORE_URL}?pt=${encodeURIComponent(APP_STORE_PROVIDER_TOKEN)}&ct=${encodeURIComponent(ct)}&mt=8`;
};

const playStoreUrl = (placement) => {
  const campaign = CAMPAIGNS[placement]?.play;
  if (!campaign) { return PLAY_STORE_URL; }
  const referrer = `utm_source=ai-engine&utm_medium=admin&utm_campaign=${campaign}`;
  return `${PLAY_STORE_URL}&referrer=${encodeURIComponent(referrer)}`;
};

const nonce = () => (window.mwai && window.mwai.rest_nonce) || (window.wpApiSettings && window.wpApiSettings.nonce);

const workspaceApi = async (path, body) => {
  const res = await fetch(`${restUrl}/mwai/v1/workspace/${path}`, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': nonce() },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
};

const useWorkspacePairing = ({ enabled = true } = {}) => {
  const [ devices, setDevices ] = useState([]);
  const [ loaded, setLoaded ] = useState(false);
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
      const data = await workspaceApi('devices');
      if (data || data.success) {
        setDevices(data.devices || []);
        setAvailable(data.available !== false);
        setLoaded(true);
        return data.devices || [];
      }
    }
    catch (e) { /* ignore */ }
    return null;
  }, []);

  useEffect(() => { if (enabled) { loadDevices(); } }, [enabled, loadDevices]);

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
      const data = await workspaceApi('pair-check');
      setServerWarning(data?.status == 'header_stripped'
        ? { message: data.message, docUrl: data.doc_url } : null);
    }
    catch (e) { /* a failed pre-flight proves nothing: stay quiet */ }
  }, []);

  const generate = useCallback(async () => {
    setError(null);
    setJustConnected(null);
    setGenerating(true);
    deviceCountRef.current = devices.length + 1;
    checkServer();
    try {
      const data = await workspaceApi('pair-token', {});
      if (!data || !data.success) {
        setError(data?.message || 'Could not generate a pairing code.');
        setAvailable(true);
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

  return { devices, setDevices, loaded, available, qr, remaining, error, setError, generating,
    justConnected, serverWarning, loadDevices, generate };
};

export { appStoreUrl, playStoreUrl, workspaceApi, useWorkspacePairing };
```