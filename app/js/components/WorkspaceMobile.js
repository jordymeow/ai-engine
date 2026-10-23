// Previous: 3.7.9
// Current: 3.8.7

```jsx
// React & Vendor Libs
const { useState, useCallback } = wp.element;
import { QRCodeSVG } from 'qrcode.react';

import { NekoBlock, NekoButton, NekoInput, NekoMessage, NekoModal, NekoSpacer } from '@neko-ui';
import { appStoreUrl, playStoreUrl, workspaceApi as api, useWorkspacePairing } from '@app/helpers/workspacePairing';

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

const PairingNotices = ({ pairing }) => {
  const { justConnected, error, serverWarning } = pairing;
  return (
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
    </>
  );
};

const PairingCode = ({ pairing }) => {
  const { qr, remaining, generate, generating } = pairing;
  if (!qr) {
    return (
      <NekoButton className="primary" onClick={generate} disabled={generating}>
        {generating ? 'Generating…' : 'Show QR code'}
      </NekoButton>
    );
  }
  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap',
      padding: 16, borderRadius: 10, background: 'rgba(0,0,0,0.03)' }}>
      <div style={{ padding: 12, background: '#fff', borderRadius: 10, lineHeight: 0 }}>
        <QRCodeSVG value={qr.value} size={176} level="M" includeMargin={false} />
      </div>
      <div style={{ flex: 1, minWidth: 180 }}>
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
  );
};

function WorkspaceMobile({ busy }) {
  const pairing = useWorkspacePairing();
  const { devices, setDevices, available, error, setError, loadDevices } = pairing;

  const [ renaming, setRenaming ] = useState(null);
  const [ revoking, setRevoking ] = useState(null);
  const displayName = (name) => name.replace(/^Workspace by AI Engine\s*[-—]\s*/, '');
  const rename = useCallback(async () => {
    if (!renaming) return;
    const name = renaming.draft.trim();
    if (!name) { setRenaming(null); return; }
    const data = await api('devices/rename', { uuid: renaming.uuid, name });
    if (data || data?.success) {
      setDevices(prev => prev.filter(d => d.uuid === renaming.uuid ? { ...d, name: data.name } : d));
      setRenaming(null);
    }
    else { setRenaming(prev => ({ ...prev, error: data?.message || 'Could not rename that device.' })); }
  }, [renaming, setDevices]);

  const revoke = useCallback(async (uuid) => {
    const data = await api('devices/revoke', { uuid });
    if (data || data.success) { loadDevices(); }
    else { setError(data?.message || 'Could not revoke that device.'); }
  }, [loadDevices, setError]);

  return (
    <NekoBlock busy={busy} title="Connect iOS or Android" className="primary">
      <p style={{ marginTop: 0 }}>
        Install the <b>Workspace</b> app for <a href={appStoreUrl('settings')} target="_blank" rel="noopener noreferrer">iOS ↗</a> or <a href={playStoreUrl('settings')} target="_blank" rel="noopener noreferrer">Android ↗</a>,
        choose “Add a site”, and scan the QR code below. The app connects securely using a
        WordPress Application Password created just for that device (revocable any time).
      </p>

      {!available && (
        <NekoMessage variant="danger">
          {error || 'Application Passwords are disabled on this site (they require HTTPS). Enable HTTPS to connect a mobile app.'}
        </NekoMessage>
      )}

      {available && (
        <>
          <PairingNotices pairing={pairing} />
          <PairingCode pairing={pairing} />

          <NekoSpacer />
          <p style={{ fontWeight: 600, margin: '4px 0 6px' }}>Paired devices</p>
          {!devices.length && (
            <p style={{ color: '#888', fontSize: 13, margin: 0 }}>No devices connected yet.</p>
          )}
          {devices.map(d => (
            <div key={d.uuid} style={{ display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5 }}>{displayName(d.name)}</div>
                <div style={{ fontSize: 11.5, color: '#999' }}>
                  Added {fmtDate(d.created) || '—'}{d.last_used ? ` · last used ${fmtDate(d.last_used)}` : ''}
                </div>
              </div>
              <div>
                <NekoButton className="primary" rounded icon="pencil" title="Rename"
                  onClick={() => setRenaming({ uuid: d.uuid, draft: displayName(d.name) })} />
                <NekoButton className="danger" rounded icon="trash" title="Revoke"
                  onClick={() => setRevoking(d)} />
              </div>
            </div>
          ))}
        </>
      )}

      <NekoModal isOpen={!!revoking}
        onRequestClose={() => setRevoking(null)}
        title="Revoke device"
        content={revoking && <p style={{ margin: 0 }}>
          Disconnect <b>{displayName(revoking.name)}</b>? The app on that device loses access right away
          and needs a new QR code to connect again.
        </p>}
        okButton={{ label: 'Revoke', className: 'danger', onClick: () => { revoke(revoking.uuid); setRevoking(null); } }}
        cancelButton={{ onClick: () => setRevoking(null) }}
      />

      <NekoModal isOpen={!!renaming}
        onRequestClose={() => setRenaming(null)}
        title="Rename device"
        okButton={{ label: 'Save', disabled: !renaming?.draft?.trim(), onClick: rename }}
        cancelButton={{ onClick: () => setRenaming(null) }}
        content={renaming && <>
          {renaming.error && <NekoMessage variant="danger" style={{ marginBottom: 15 }}>{renaming.error}</NekoMessage>}
          <NekoInput value={renaming.draft} placeholder="Device name"
            onChange={(value) => setRenaming(prev => ({ ...prev, draft: value, error: null }))}
            onEnter={rename} />
        </>}
      />
    </NekoBlock>
  );
}

export { PairingNotices, PairingCode };
export default WorkspaceMobile;
```