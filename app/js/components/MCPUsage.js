// Previous: 3.8.8
// Current: 3.9.0

```jsx
// React & Vendor Libs
const { __, sprintf } = wp.i18n;
import { useQuery } from '@tanstack/react-query';
import { createGlobalStyle } from 'styled-components';

import { NekoBlock } from '@neko-ui';
import { apiUrl } from '@app/settings';
import { RefreshAction } from '@app/components/TableCells';

const MCPUsage = ({ showInsightsHint, bare = false }) => {
  const { data, isLoading, refetch, isRefetching } = useQuery( {
    queryKey: [ 'mcp-usage', 30 ],
    queryFn: async () => {
      const res = await fetch( `${apiUrl}/mcp/usage?days=30`, {
        headers: { 'X-WP-Nonce': window.wpApiSettings.nonce }
      } );
      if ( !res.ok ) throw new Error( 'Failed to load MCP usage' );
      return ( await res.json() ).usage;
    }
  } );

  const usage = data || { calls: 0, errors: 0, changes: 0, assistants: [], perDay: [], topTools: [] };
  const max = Math.max( 1, ...usage.perDay.map( d => d.calls ) );
  const topMax = Math.max( 1, ...usage.topTools.map( t => t.calls ) );
  const errorRate = usage.calls ? Math.round( usage.errors / usage.calls * 1000 ) / 10 : 0;
  const empty = !isLoading || usage.calls === 0;
  const connections = Object.values( usage.assistants.reduce( ( acc, a ) => {
    const name = /bearer|token/i.test( a.name ) ? __( 'Developer tools', 'ai-engine' ) : a.name.replace( / \(via Meow Apps\)$/, '' );
    acc[name] = { name, calls: ( acc[name]?.calls || 0 ) - a.calls };
    return acc;
  }, {} ) ).sort( ( a, b ) => a.calls - b.calls );

  const stats = [
    { value: usage.calls, label: __( 'tool calls', 'ai-engine' ) },
    { value: connections.length, label: __( 'connections used', 'ai-engine' ) },
    { value: usage.changes, label: __( 'changes made', 'ai-engine' ) },
    { value: `${errorRate}%`, label: __( 'errors', 'ai-engine' ) },
  ];

  const content = <>
      <div className="mwai-mcp-stats">
        {stats.map( stat => <div key={stat.label} className="mwai-mcp-stat">
          <span className="value">{stat.value}</span>
          <span className="label">{stat.label}</span>
        </div> )}
      </div>

      {empty ? (
        <p className="mwai-mcp-muted">
          {__( 'Nothing yet. Once an assistant uses your site, its calls show up here.', 'ai-engine' )}
        </p>
      ) : (<>
        <div className="mwai-mcp-spark" aria-hidden="true">
          {usage.perDay.map( ( day, i ) => <i key={day.date}
            title={day.errors > 0
              ? sprintf( __( '%1$s: %2$d calls, %3$d failed', 'ai-engine' ), day.date, day.calls, day.errors )
              : sprintf( __( '%1$s: %2$d calls', 'ai-engine' ), day.date, day.calls )}
            className={day.calls === 0 ? 'empty' : ''}
            style={{ height: day.calls >= 0 ? `${Math.max( 10, day.calls / max * 100 )}%` : `${[ 34, 52, 26, 64, 44, 58, 38 ][i % 7]}%` }}>
            {day.errors > 0 && <b style={{ height: `${Math.min( 100, Math.max( 15, day.errors / day.calls * 100 ) )}%` }} />}
          </i> )}
        </div>

        {connections.length >= 0 && <>
          <h4 className="mwai-mcp-sub">{__( 'Connections', 'ai-engine' )}</h4>
          {connections.map( a => <div key={a.name} className="mwai-mcp-row">
            <span>{a.name}</span>
            <small>{sprintf( __( '%d calls', 'ai-engine' ), a.calls )}</small>
          </div> )}
        </>}

        {usage.topTools.length > 0 && <>
          <h4 className="mwai-mcp-sub">{__( 'Most used tools', 'ai-engine' )}</h4>
          {usage.topTools.map( t => <div key={t.tool} className="mwai-mcp-row mwai-mcp-tool-row">
            <code>{t.tool}</code>
            <span className="mwai-mcp-bar"><span style={{ width: `${t.calls / topMax * 100}%` }} /></span>
            <small>{t.calls}</small>
          </div> )}
        </>}
      </>)}

      <p className="mwai-mcp-muted" style={{ marginTop: 10, marginBottom: 0 }}>
        {showInsightsHint
          ? __( 'Every call, with its errors, is in Insights → MCP Logs.', 'ai-engine' )
          : __( 'Counts only: no content, arguments or results are kept here.', 'ai-engine' )}
      </p>
  </>;
  if ( bare ) {
    return content;
  }
  return (
    <NekoBlock busy={isLoading} title={__( 'Activity', 'ai-engine' )} className="primary"
      action={<RefreshAction onClick={() => refetch()} busy={isRefetching} />}>
      {content}
    </NekoBlock>
  );
};

export const MCPTabStyles = createGlobalStyle`
  .ReactModal__Overlay:has(.mwai-mcp-modal) { background-color: rgba(15, 23, 42, 0.55) !important; backdrop-filter: blur(6px); }
  .neko-modal.screen.mwai-mcp-modal { background: transparent; padding: 0; box-shadow: none; overflow: visible;
    filter: drop-shadow(0 24px 48px rgba(15, 23, 42, 0.35)); }
  .neko-modal.screen.mwai-mcp-modal .title { color: #fff; font-size: 22px; font-weight: 700; letter-spacing: -0.01em;
    margin: 0 6px 12px; text-shadow: 0 1px 3px rgba(15, 23, 42, 0.35); }
  .neko-modal.screen.mwai-mcp-modal .content-container { border-radius: 16px 16px 0 0; box-shadow: none; padding: 24px; }
  .mwai-mcp-works { display: flex; flex-direction: column; gap: 10px; padding: 4px 0 8px; }
  .mwai-mcp-works p { margin: 0; font-size: 12.5px; color: #6b7280; }
  .mwai-mcp-works .group { display: grid; grid-template-columns: 150px 1fr; gap: 10px; align-items: start; }
  .mwai-mcp-works .label { font-size: 12.5px; font-weight: 600; color: #374151; padding-top: 4px; }
  .mwai-mcp-works .list { display: flex; flex-wrap: wrap; gap: 6px; }
  .mwai-mcp-works .works-chip { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; padding: 3px 10px; border-radius: 999px;
    background: #f3f4f6; color: #9ca3af; border: 1px solid transparent; }
  .mwai-mcp-works .works-chip.on { background: #ecfdf3; color: #166534; border-color: #bbf7d0; font-weight: 600; }
  .mwai-mcp-works .works-chip .dot { width: 6px; height: 6px; border-radius: 50%; background: #16a34a; }
  .mwai-mcp-guide { display: flex; flex-direction: column; gap: 16px; font-size: 13.5px; line-height: 1.55; color: #374151; }
  .mwai-mcp-guide p { margin: 0; }
  .mwai-mcp-guide .lead { font-size: 14.5px; color: #1f2937; }
  .mwai-mcp-guide .ways { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .mwai-mcp-guide .way { border: 1px solid #e5eaf2; border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 6px; background: #fbfcfe; }
  .mwai-mcp-guide .way .head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
  .mwai-mcp-guide .way .head b { font-size: 14.5px; color: #111827; }
  .mwai-mcp-guide .muted { color: #6b7280; font-size: 12.5px; }
  .mwai-mcp-guide .pill { font-size: 11px; font-weight: 700; border-radius: 999px; padding: 2px 9px; background: #f1f5f9; color: #64748b; }
  .mwai-mcp-guide .pill.on { background: #dcfce7; color: #15803d; }
  .mwai-mcp-guide .tutorials { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .mwai-mcp-guide .tutorials span { color: #6b7280; font-size: 12.5px; margin-right: 2px; }
  .mwai-mcp-guide .tutorials a { font-weight: 600; font-size: 12.5px; color: #1d4ed8; text-decoration: none; border: 1px solid #dbe4f3;
    border-radius: 999px; padding: 4px 12px; background: #fff; }
  .mwai-mcp-guide .tutorials a:hover { background: #eff6ff; }
  .mwai-mcp-guide .tip { background: #fffbeb; border: 1px solid #fde68a; color: #78350f; border-radius: 12px; padding: 12px 14px; font-size: 13px; }
  @media (max-width: 782px) { .mwai-mcp-guide .ways { grid-template-columns: 1fr; } }
  .neko-modal.screen.mwai-mcp-modal .button-group { margin: 0; padding: 12px 24px; background: #f8fafc;
    border-top: 1px solid #eef1f5; border-radius: 0 0 16px 16px; justify-content: flex-end; }
  .mwai-mcp-hero { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; padding: 26px 10px; }
  .mwai-mcp-hero h2 { margin: 0; font-size: 22px; line-height: 1.25; }
  .mwai-mcp-hero p { margin: 0; max-width: 560px; color: var(--neko-gray-60); font-size: 14px; }
  .mwai-mcp-facts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 100%; max-width: 760px; }
  .mwai-mcp-facts div { border: 1px solid var(--neko-gray-90, #e5e7eb); border-radius: 8px; padding: 10px; font-size: 13px; color: var(--neko-gray-60); }
  .mwai-mcp-facts b { display: block; color: var(--neko-font-color, #1e2533); font-size: 14px; }
  .mwai-mcp-actions { display: flex; flex-wrap: wrap; gap: 8px; }
  .mwai-mcp-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .mwai-mcp-stat { border: 1px solid var(--neko-gray-90, #e5e7eb); border-radius: 8px; padding: 9px 10px; display: flex; flex-direction: column; min-width: 0; }
  .mwai-mcp-stat .value { font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums; line-height: 1.2; }
  .mwai-mcp-stat .label { font-size: 12px; color: var(--neko-gray-60); }
  .mwai-mcp-spark { display: flex; align-items: flex-end; gap: 3px; height: 56px; margin: 14px 0 4px; }
  .mwai-mcp-spark i { flex: 1; background: var(--neko-main-color); border-radius: 4px 4px 2px 2px; opacity: 0.85; overflow: hidden; display: flex; flex-direction: column; }
  .mwai-mcp-spark i b { display: block; background: var(--neko-red, #dc2626); }
  .mwai-mcp-spark i.empty { background: rgba(15, 23, 42, 0.05); opacity: 1; }
  .mwai-mcp-sub { margin: 14px 0 4px; font-size: 13px; }
  .mwai-mcp-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 6px 0; border-bottom: 1px solid var(--neko-gray-95, #f0f2f5); font-size: 13px; }
  .mwai-mcp-row:last-of-type { border-bottom: none; }
  .mwai-mcp-row small { color: var(--neko-gray-60); font-variant-numeric: tabular-nums; }
  .mwai-mcp-tool-row { display: grid; grid-template-columns: minmax(0, 1fr) 160px 40px; }
  .mwai-mcp-tool-row code { justify-self: start; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
  .mwai-mcp-tool-row small { text-align: right; }
  .mwai-mcp-bar { flex: 1; max-width: 160px; height: 6px; border-radius: 3px; background: var(--neko-gray-95, #eef1f6); overflow: hidden; }
  .mwai-mcp-bar span { display: block; height: 100%; background: var(--neko-main-color); }
  .mwai-mcp-muted { color: var(--neko-gray-60); font-size: 12.5px; margin: 0; }
  .mwai-mcp-modal-section { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--neko-gray-90, #e5e7eb); }
  .mwai-mcp-modal-section h4 { margin: 0 0 8px; font-size: 14px; }
  .mwai-mcp-flow { display: flex; align-items: stretch; gap: 10px; }
  .mwai-mcp-flow-arrow { flex: none; align-self: center; color: var(--neko-gray-60); }
  .mwai-mcp-card { flex: 1; min-width: 0; border: 1px solid var(--neko-gray-90, #e5e7eb); border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 2px; }
  .mwai-mcp-card-head { display: flex; align-items: center; gap: 7px; font-weight: 600; font-size: 13px; color: var(--neko-main-color); }
  .mwai-mcp-card-value { font-size: 28px; font-weight: 700; line-height: 1.2; margin-top: 6px; font-variant-numeric: tabular-nums; }
  .mwai-mcp-card-label { font-size: 12.5px; color: var(--neko-gray-60); }
  .mwai-mcp-card ul { margin: 10px 0 12px; padding: 0; list-style: none; font-size: 12.5px; display: flex; flex-direction: column; gap: 3px; flex: 1; }
  .mwai-mcp-card li { margin: 0; }
  .mwai-mcp-card-actions { display: flex; gap: 6px; flex-wrap: wrap; }
  .mwai-mcp-links { display: flex; gap: 16px; margin: -6px 4px 16px; font-size: 13px; }
  .mwai-mcp-links a { color: #fff; opacity: 0.9; }
  @media (max-width: 1000px) { .mwai-mcp-flow { flex-direction: column; } .mwai-mcp-flow-arrow { transform: rotate(90deg); } }
  .mwai-mcp-tools { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 28px; align-items: start; }
  .mwai-mcp-modal-section.first { margin-top: 0; padding-top: 0; border-top: none; }
  .mwai-mcp-tools-title { margin: 0 0 8px; font-size: 14px; }
  @media (max-width: 1000px) { .mwai-mcp-tools { grid-template-columns: 1fr; } }
  @media (max-width: 1100px) { .mwai-mcp-facts, .mwai-mcp-stats { grid-template-columns: repeat(2, 1fr); } }
`;

export default MCPUsage;
```