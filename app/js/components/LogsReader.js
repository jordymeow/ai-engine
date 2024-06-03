// Previous: 2.3.5
// Current: 2.3.7

// React & Vendor Libs
const { useState, useEffect } = wp.element;
// NekoUI
import { NekoButton, NekoBlock } from '@neko-ui';

import i18n from '@root/i18n';
import { refreshLogs, clearLogs } from '@app/requests';


const LogsStyles = {
  marginTop: 10,
  background: 'rgb(0, 72, 88)',
  padding: 10,
  color: 'rgb(58, 212, 58)',
  maxHeight: 400,
  minHeight: 200,
  display: 'block',
  fontFamily: 'monospace',
  fontSize: 12,
  whiteSpace: 'pre',
  overflowX: 'auto',
  borderRadius: 10,
  textWrap: 'balance',
};

const jsxDebugLogsConsole = () => {

  const [busy, setBusy] = useState(false);
  const [fileContent, setFileContent] = useState('');

  // Refresh on mount
  useEffect(() => {
    onRefreshLogs();
  }, []);

  const onRefreshLogs = async () => {
    setBusy(true);
    const logs = await refreshLogs();
    setFileContent(logs);
    setBusy(false);
  };

  const onClearLogs = async () => {
    setBusy(true);
    const res = await clearLogs();
    setFileContent('');
    setBusy(false);
  }


  return (
    <NekoBlock title={i18n.COMMON.LOGS} busy={busy} className="primary"
      action={<div style={{ display: 'flex', alignItems: 'center' }}>
        <NekoButton className="secondary" onClick={onClearLogs}>{i18n.COMMON.CLEAR_LOGS}</NekoButton>
      </div>}>
      <NekoButton onClick={onRefreshLogs}>{i18n.COMMON.REFRESH_LOGS}</NekoButton>
      <div style={LogsStyles}>
        {fileContent}
      </div>
    </NekoBlock>
  );

}

export { jsxDebugLogsConsole };