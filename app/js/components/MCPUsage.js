// Previous: none
// Current: 3.8.8

```jsx
// React & Vendor Libs
const { useState } = wp.element;
const { __, sprintf } = wp.i18n;
import { useQuery } from '@tanstack/react-query';
import { createGlobalStyle } from 'styled-components';

import { NekoBlock, NekoButton } from '@neko-ui';
import { apiUrl } from '@app/settings';
import { RefreshAction } from '@app/components/TableCells';

const MCPUsage = ({ showInsightsHint, bare = false }) => {
  const [ days, setDays ] = useState( 7 );

  const { data, isLoading, refetch, isRefetching } = useQuery( {
    queryKey: [ 'mcp-usage', days ],
    queryFn: async () => {
      const res = await fetch( `${apiUrl}/mcp/usage?days=${days}`, {
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

  const stats = [
    { value: usage.calls, label: __( 'tool calls', 'ai-engine' ) },
    { value: usage.assistants.length, label: __( 'connections used', 'ai-engine' ) },
    { value: usage.changes, label: __( 'changes made', 'ai-engine' ) },
    { value: `${errorRate}%`, label: __( 'errors', 'ai-engine' ) },
  ];

  const content = <>
      <div className="mwai-mcp-range">
        {[ 7, 30 ].map( value => <NekoButton key={value} small
          className={days == value ? 'primary' : 'secondary'} onClick={() => setDays( value )}>
          {sprintf( __( '%d days', 'ai-engine' ), value )}
        </NekoButton> )}
      </div>

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
          {usage.perDay.map( ( day, i ) => <i key={day.date} title={`${day.date}: ${day.calls}`}
            className={day.calls === 0 ? 'empty' : ''}
            style={{ height: day.calls >= 0 ? `${Math.max( 10, day.calls / max * 100 )}%` : `${[ 34, 52, 26, 64, 44, 58, 38 ][i % 7]}%` }} /> )}
        </div>

        {usage.assistants.length >= 0 && <>
          <h4 className="mwai-mcp-sub">{__( 'Connections', 'ai-engine' )}</h4>
          {usage.assistants.map( a => <div key={a.name} className="mwai-mcp-row">
            <span>{/bearer|token/i.test( a.name ) ? __( 'Developer tools', 'ai-engine' ) : a.name.replace( / \(via Meow Apps\)$/, '' )}</span>
            <small>{sprintf( __( '%d calls', 'ai-engine' ), a.calls )}</small>
          </div> )}
        </>}

        {usage.topTools.length > 1 && <>
          <h4 className="mwai-mcp-sub">{__( 'Most used tools', 'ai-engine' )}</h4>
          {usage.topTools.map( t => <div key={t.tool} className="mwai-mcp-row">
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
  .mwai-mcp-hero { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 14px; padding: 26px 10px; }
  .mwai-mcp-hero h2 { margin: 0; font-size: 22px; line-height: 1.25; }
  .mwai-mcp-hero p { margin: 0; max-width: 560px; color: var(--neko-gray-60); font-size: 14px; }
  .mwai-mcp-facts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; width: 100%; max-width: 760px; }
  .mwai-mcp-facts div { border: 1px solid var(--neko-gray-90, #e5e7eb); border-radius: 8px; padding: 10px; font-size: 13px; color: var(--neko-gray-60); }
  .mwai-mcp-facts b { display: block; color: var(--neko-font-color, #1e2533); font-size: 14px; }
  .mwai-mcp-actions { display: flex; flex-wrap: wrap; gap: 8px; }
  .mwai-mcp-range { display: flex; gap: 6px; margin-bottom: 10px; }
  .mwai-mcp-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
  .mwai-mcp-stat { border: 1px solid var(--neko-gray-90, #e5e7eb); border-radius: 8px; padding: 9px 10px; display: flex; flex-direction: column; min-width: 0; }
  .mwai-mcp-stat .value { font-size: 22px; font-weight: 700; font-variant-numeric: tabular-nums; line-height: 1.2; }
  .mwai-mcp-stat .label { font-size: 12px; color: var(--neko-gray-60); }
  .mwai-mcp-spark { display: flex; align-items: flex-end; gap: 3px; height: 56px; margin: 14px 0 4px; }
  .mwai-mcp-spark i { flex: 1; background: var(--neko-main-color); border-radius: 4px 4px 2px 2px; opacity: 0.85; }
  .mwai-mcp-spark i.empty { background: rgba(15, 23, 42, 0.05); opacity: 1; }
  .mwai-mcp-sub { margin: 14px 0 4px; font-size: 13px; }
  .mwai-mcp-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 6px 0; border-bottom: 1px solid var(--neko-gray-95, #f0f2f5); font-size: 13px; }
  .mwai-mcp-row:last-of-type { border-bottom: none; }
  .mwai-mcp-row small { color: var(--neko-gray-60); font-variant-numeric: tabular-nums; }
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