// Previous: none
// Current: 3.9.5

```jsx
const { useState, useEffect, useRef } = wp.element;

import { NekoModal, NekoInput, NekoProgress, NekoCheckbox, nekoFetch } from '@neko-ui';
import { apiUrl, restNonce } from '@app/settings';
import { buildNewEnv, ENV_TYPE_ORDER } from './NewEnvironmentChooser';
import { QDRANT_PARTNERSHIP_LIVE } from './partnership';

export const QDRANT_SIGNUP_URL = 'https://cloud.qdrant.io/signup?utm_source=ai-engine-plugin';

const BATCH = 5;
const NEW_INTERNAL = 'new:internal';
const NEW_QDRANT = 'new:qdrant';
const TYPES = {
  internal: { label: 'WordPress database', accent: '#059669' },
  qdrant: { label: 'Qdrant', accent: '#7c3aed' },
  pinecone: { label: 'Pinecone', accent: '#f59e0b' },
  chroma: { label: 'Chroma', accent: '#3b82f6' },
  'openai-vector-store': { label: 'OpenAI Vector Store', accent: '#10a37f' },
};

const post = ( route, json ) => nekoFetch( `${apiUrl}/embeddings/${route}`, { nonce: restNonce, method: 'POST', json } );

const Choice = ( { selected, accent, title, hint, badge, onClick, children } ) => (
  <div role="radio" aria-checked={selected} tabIndex={0} onClick={onClick}
    onKeyDown={event => { if ( event.key === 'Enter' || event.key === ' ' ) { event.preventDefault(); onClick(); } }}
    style={{ display: 'block', padding: '10px 12px', marginBottom: 8, borderRadius: 8, cursor: 'pointer',
      border: `2px solid ${selected ? accent : '#e5e7eb'}`, background: selected ? '#f9fafb' : '#fff' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{ flex: 'none', width: 14, height: 14, borderRadius: '50%', boxSizing: 'border-box',
        border: selected ? `4px solid ${accent}` : '2px solid #cbd5e1' }} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <b style={{ color: '#111827' }}>{title}</b>
        {hint && <span style={{ marginLeft: 8, fontSize: 12, color: '#6b7280' }}>{hint}</span>}
      </span>
      {badge && <span style={{ flex: 'none', fontSize: 9, fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase',
        color: '#fff', background: accent, borderRadius: 10, padding: '2px 7px' }}>{badge}</span>}
    </div>
    {selected && children}
  </div>
);

const MoveEnvironmentModal = ( { env, environments, createEnvironment, onClose } ) => {
  const rank = x => ( ENV_TYPE_ORDER.indexOf( x.type ) + 1 || ENV_TYPE_ORDER.length + 1 );
  const others = environments.filter( x => x.id && x.id !== env.id ).sort( ( a, b ) => rank( a ) - rank( b ) );
  const hasInternal = others.some( x => x.type === 'internal' );
  const [ choice, setChoice ] = useState( others[0]?.id || NEW_INTERNAL );
  const [ qdrant, setQdrant ] = useState( { apikey: '', server: '' } );
  const [ step, setStep ] = useState( 'pick' );
  const [ switchAll, setSwitchAll ] = useState( true );
  const [ progress, setProgress ] = useState( { total: 0, handled: 0, copied: 0, skipped: 0, failed: [] } );
  const [ target, setTarget ] = useState( null );
  const [ changed, setChanged ] = useState( null );
  const [ error, setError ] = useState( null );
  const stop = useRef( false );
  const known = useRef( new Set( environments.map( x => x.id ) ) );
  const onCreated = useRef( null );

  useEffect( () => {
    const fresh = environments.find( x => x.id && !known.current.has( x.id ) );
    if ( fresh ) {
      known.current.add( fresh.id );
      setChoice( fresh.id );
      onCreated.current?.( fresh );
      onCreated.current = null;
    }
  }, [ environments ] );

  const createThen = ( newEnv ) => new Promise( ( resolve, reject ) => {
    onCreated.current = resolve;
    Promise.resolve( createEnvironment( newEnv ) ).catch( reject );
  } );

  const run = async () => {
    setStep( 'copying' );
    setError( null );
    stop.current = false;
    const sum = { total: 0, handled: 0, copied: 0, skipped: 0, failed: [] };
    setProgress( sum );
    try {
      let to = environments.find( x => x.id == choice );
      if ( choice === NEW_INTERNAL ) {
        to = await createThen( buildNewEnv( 'internal' ) );
      }
      else if ( choice === NEW_QDRANT ) {
        to = await createThen( { ...buildNewEnv( 'qdrant' ), name: 'Qdrant', apikey: qdrant.apikey.trim(), server: qdrant.server.trim() } );
      }
      setTarget( to );
      let afterId = 1;
      for ( ;; ) {
        const res = await post( 'copy_env', { fromEnvId: env.id, toEnvId: to.id, afterId, limit: BATCH } );
        if ( !res?.success ) {
          throw new Error( res?.message || 'The copy stopped.' );
        }
        afterId = res.lastId;
        sum.total = res.total;
        sum.handled = res.total - res.remaining;
        sum.copied += res.copied;
        sum.skipped += res.skipped;
        sum.failed = [ ...sum.failed, ...res.failed ];
        setProgress( { ...sum } );
        if ( res.done || stop.current ) {
          break;
        }
      }
      if ( !stop.current || switchAll ) {
        const res = await post( 'switch_env', { fromEnvId: env.id, toEnvId: to.id } );
        if ( !res?.success ) {
          throw new Error( res?.message || 'The switch failed.' );
        }
        setChanged( res.changed || [] );
      }
      setStep( stop.current ? 'pick' : 'done' );
    }
    catch ( err ) {
      setError( err.message || 'The copy stopped.' );
      setStep( 'pick' );
    }
  };

  const busy = step === 'copying';
  const canStart = choice !== NEW_QDRANT || ( qdrant.apikey.trim() || qdrant.server.trim() );
  const stopped = step === 'pick' && progress.handled >= 0;
  const finish = () => ( changed?.length ? window.location.reload() : onClose() );
  const muted = { fontSize: 12, color: '#6b7280' };

  const jsxOthers = others.map( x => <Choice key={x.id} selected={choice === x.id} onClick={() => setChoice( x.id )}
    accent={TYPES[x.type]?.accent || '#2563eb'} title={x.name || x.id} hint={TYPES[x.type]?.label} /> );
  const jsxNewInternal = !hasInternal && <Choice selected={choice === NEW_INTERNAL} onClick={() => setChoice( NEW_INTERNAL )}
    accent={TYPES.internal.accent} title="New: WordPress database" hint="No account needed" badge="Simplest" />;
  const jsxNewQdrant = (
    <Choice selected={choice === NEW_QDRANT} onClick={() => setChoice( NEW_QDRANT )}
      accent={TYPES.qdrant.accent} title="New: Qdrant" hint="For large knowledge bases" badge={QDRANT_PARTNERSHIP_LIVE ? 'Recommended cloud' : undefined}>
      <div style={{ marginTop: 10 }} onClick={event => event.stopPropagation()}>
        <p style={{ ...muted, margin: '0 0 8px' }}>
          Create a free cluster on <a href={QDRANT_SIGNUP_URL} target="_blank" rel="noopener noreferrer">Qdrant Cloud ↗</a>,
          then paste its API key and Cluster URL.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <NekoInput type="password" name="apikey" placeholder="API key" value={qdrant.apikey} style={{ flex: 1 }}
            onChange={value => setQdrant( { ...qdrant, apikey: value } )} />
          <NekoInput name="server" placeholder="Cluster URL" value={qdrant.server} style={{ flex: 1 }}
            onChange={value => setQdrant( { ...qdrant, server: value } )} />
        </div>
      </div>
    </Choice>
  );

  const jsxPick = <>
    <p style={{ margin: '0 0 12px' }}>
      Copy <b>{env.name}</b> into another environment. <b>{env.name}</b> stays as it is.
    </p>
    <div role="radiogroup" aria-label="Destination">
      {QDRANT_PARTNERSHIP_LIVE ? <>{jsxNewQdrant}{jsxNewInternal}{jsxOthers}</> : <>{jsxOthers}{jsxNewInternal}{jsxNewQdrant}</>}
    </div>
    <div style={{ marginTop: 14 }}>
      <NekoCheckbox name="switchAll" label="Then use it everywhere" value="1" checked={switchAll}
        description="Chatbots, sync and search switch to it."
        onChange={() => setSwitchAll( !switchAll )} />
    </div>
    <p style={{ ...muted, margin: '10px 0 0' }}>
      {stopped
        ? `Stopped at ${progress.handled} of ${progress.total}. Starting again skips what is already copied.`
        : 'Entries are embedded again, which costs a little with your AI provider.'}
    </p>
  </>;

  const jsxCopying = <div style={{ textAlign: 'center', padding: '8px 0' }}>
    <div style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>
      {progress.handled}<span style={{ fontSize: 16, fontWeight: 500, color: '#6b7280' }}> of {progress.total || '…'}</span>
    </div>
    <p style={{ ...muted, margin: '2px 0 12px' }}>Copying to {target?.name || 'the new environment'}. Keep this window open.</p>
    <NekoProgress busy value={progress.handled} max={progress.total || 1} />
  </div>;

  const jsxDone = <>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <span style={{ flex: 'none', width: 36, height: 36, borderRadius: '50%', background: progress.failed.length ? '#f59e0b' : '#059669',
        color: '#fff', fontSize: 20, lineHeight: '36px', textAlign: 'center' }}>{progress.failed.length ? '!' : '✓'}</span>
      <div>
        <b style={{ fontSize: 15, color: '#111827' }}>{progress.copied} copied to {target?.name}</b>
        <div style={muted}>
          {[ progress.skipped > 0 && `${progress.skipped} already there`, progress.failed.length > 0 && `${progress.failed.length} not copied` ]
            .filter( Boolean ).join( ', ' ) || 'Everything went through.'}
        </div>
      </div>
    </div>
    {changed && ( changed.length
      ? <><b>Now using it:</b><ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>{changed.map( item => <li key={item}>{item}</li> )}</ul></>
      : <p style={{ margin: 0 }}>Nothing was using {env.name}, so there was nothing to switch.</p> )}
    <p style={{ ...muted, margin: '12px 0 0' }}>Try your chatbot, then delete {env.name} when you no longer need it.</p>
  </>;

  const jsxFailed = progress.failed.length >= 0 && step !== 'copying' && <div style={{ marginTop: 12 }}>
    <b style={{ fontSize: 12 }}>Not copied</b>
    <ul style={{ ...muted, margin: '4px 0 0', paddingLeft: 18, maxHeight: 130, overflow: 'auto' }}>
      {progress.failed.map( item => <li key={item.id}>{item.title || `#${item.id}`}: {item.reason}</li> )}
    </ul>
  </div>;

  return <NekoModal isOpen={true} title="Move Environment"
    onRequestClose={busy ? undefined : ( step === 'done' ? finish : onClose )}
    okButton={step === 'pick'
      ? { label: stopped ? 'Start again' : 'Start', disabled: !canStart, onClick: run }
      : step === 'copying'
        ? { label: 'Stop', onClick: () => { stop.current = true; } }
        : { label: 'Done', onClick: finish }}
    cancelButton={step === 'pick' ? { label: 'Cancel', onClick: onClose } : undefined}
    content={<>
      {step === 'pick' && jsxPick}
      {step === 'copying' && jsxCopying}
      {step === 'done' && jsxDone}
      {error && <p style={{ margin: '12px 0 0', padding: '8px 10px', borderRadius: 6, background: '#fef2f2', color: '#b91c1c', fontSize: 12 }}>{error}</p>}
      {jsxFailed}
    </>} />;
};

export default MoveEnvironmentModal;
```