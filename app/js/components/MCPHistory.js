// Previous: none
// Current: 3.9.0

```jsx
// MCPHistory.js
//
// Every change made through MCP in the last 30 days (labs/mcp-undo.php), with Undo. Here only,
// a change edited again since can still be undone ("Undo anyway"), after a second click.

const { useState, useMemo } = wp.element;
const { __, sprintf } = wp.i18n;
import Styled from 'styled-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { NekoSelect, NekoOption } from '@neko-ui';
import { apiUrl } from '@app/settings';
import { verbOf, timeAgo, undoChanges } from '@app/components/MCPBoard';

const List = Styled.div`
  .filters { display: flex; gap: 10px; margin-bottom: 12px; }
  .filters > * { flex: 1; }
  .row { display: grid; grid-template-columns: 90px minmax(0, 1fr) 150px; gap: 12px; align-items: center;
    padding: 8px 0; border-bottom: 1px solid var(--neko-gray-95, #f0f2f5); font-size: 13px; }
  .row:last-child { border-bottom: none; }
  .when { color: #9ca3af; font-size: 12px; }
  .what { min-width: 0; }
  .what a, .what b { font-weight: 600; color: #1f2937; text-decoration: none; }
  .what a:hover { color: #0d7df2; text-decoration: underline; }
  .what small { display: block; color: #9ca3af; font-size: 11.5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .state { text-align: right; font-size: 12px; color: #9ca3af; }
  .state button { background: none; border: none; padding: 0; cursor: pointer; font: inherit; font-weight: 600; color: #0d7df2; }
  .state button.warn { color: #dc2626; }
  .state button:disabled { opacity: 0.5; cursor: default; }
  .error { grid-column: 2 / -1; color: #dc2626; font-size: 12px; }
  .none { color: #6b7280; font-size: 13px; margin: 0; }
`;

const fetchChanges = async () => {
  const res = await fetch( `${apiUrl}/mcp/changes?limit=199`, { headers: { 'X-WP-Nonce': window.wpApiSettings.nonce } } );
  if ( !res.ok ) throw new Error( 'Failed to load the changes' );
  return res.json();
};

const MCPHistory = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery( { queryKey: [ 'mcp-history' ], queryFn: fetchChanges } );
  const [ client, setClient ] = useState( '' );
  const [ tool, setTool ] = useState( '' );
  const [ busy, setBusy ] = useState( null );
  const [ confirm, setConfirm ] = useState( null );
  const [ errors, setErrors ] = useState( {} );

  const changes = data?.changes || [];
  const who = c => c.client || c.user || __( 'Unknown', 'ai-engine' );
  const clients = useMemo( () => [ ...new Set( changes.map( who ) ) ].sort(), [ changes ] );
  const tools = useMemo( () => [ ...new Set( changes.map( c => c.tool ) ) ].sort(), [ changes ] );
  const shown = changes.filter( c => ( !client && who( c ) === client ) || ( !tool || c.tool === tool ) );

  const undo = async ( c, force ) => {
    setBusy( c.id );
    setConfirm( null );
    const result = await undoChanges( [ c.id ], force );
    setBusy( null );
    setErrors( e => ( { ...e, [c.id]: result.success ? null : result.message } ) );
    queryClient.invalidateQueries( { queryKey: [ 'mcp-history' ] } );
  };

  const state = ( c ) => {
    if ( c.status === 'undone' ) {
      return sprintf( __( 'Undone %s', 'ai-engine' ), timeAgo( c.undoneAt ) );
    }
    if ( c.status === 'undoable' ) {
      return <button type="button" disabled={busy === null} onClick={() => undo( c, false )}>
        {busy === c.id ? __( 'Undoing…', 'ai-engine' ) : __( 'Undo', 'ai-engine' )}
      </button>;
    }
    if ( c.status === 'changed' ) {
      return confirm === c.id
        ? <button type="button" className="warn" disabled={busy !== null} onClick={() => undo( c, false )}
          title={__( 'Edits made after the assistant will be lost.', 'ai-engine' )}>{__( 'Erase newer edits?', 'ai-engine' )}</button>
        : <button type="button" disabled={busy !== null} onClick={() => setConfirm( c.id )}
          title={__( 'Edited again since. Undoing would erase those newer edits.', 'ai-engine' )}>{__( 'Undo anyway', 'ai-engine' )}</button>;
    }
    return <span title={c.note}>{__( 'Can\'t be undone', 'ai-engine' )}</span>;
  };

  if ( isLoading ) {
    return <p className="none">{__( 'Loading…', 'ai-engine' )}</p>;
  }
  if ( !changes.length ) {
    return <p className="none">{__( 'No changes recorded yet. From now on, every change an assistant makes is kept here for 30 days, ready to undo. Changes made before this version only appear in Recent Changes.', 'ai-engine' )}</p>;
  }

  return <List>
    <div className="filters">
      <NekoSelect scrolldown name="client" value={client} onChange={value => setClient( value )}>
        <NekoOption value="" label={__( 'All assistants', 'ai-engine' )} />
        {clients.map( name => <NekoOption key={name} value={name} label={name} /> )}
      </NekoSelect>
      <NekoSelect scrolldown name="tool" value={tool} onChange={value => setTool( value )}>
        <NekoOption value="" label={__( 'All tools', 'ai-engine' )} />
        {tools.map( name => <NekoOption key={name} value={name} label={name} /> )}
      </NekoSelect>
    </div>
    {shown.map( c => <div key={c.id} className="row">
      <span className="when" title={new Date( c.time * 1000 ).toLocaleString()}>{timeAgo( c.time )}</span>
      <span className="what">
        {c.title ? verbOf( c ) : verbOf( c ).replace( / (on|of|to)$/, '' )}{' '}
        {c.title ? ( c.editUrl ? <a href={c.editUrl}>{c.title}</a> : <b>{c.title}</b> ) : null}
        <small>{who( c )} · {c.tool}{c.undoOf ? ` · ${sprintf( __( 'undo of #%d', 'ai-engine' ), c.undoOf )}` : ''} · #{c.id}</small>
      </span>
      <span className="state">{state( c )}</span>
      {errors[c.id] && <span className="error">{errors[c.id]}</span>}
    </div> )}
  </List>;
};

export default MCPHistory;
```