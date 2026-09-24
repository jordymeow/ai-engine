// Previous: 3.7.9
// Current: 3.8.1

// React & Vendor Libs
const { Component } = wp.element;

// Catches a crash anywhere in an AI Engine admin screen. Without it, one error left a
// completely blank page with nothing to report. Plain markup and inline styles on
// purpose: it must still render when NekoUI or the styles are what failed.
//
// scope="tab" is the same thing around one tab of the Settings screen. A crash there used to
// replace the whole screen, tabs included, and since the screen reopens on the last tab used, a
// reload crashed again: every setting was out of reach until the URL was edited by hand. With it,
// only that tab shows the error, the other tabs stay one click away, and "Try again" renders the
// tab anew without a reload.
class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, componentStack: '', copied: false };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    this.setState({ componentStack: info?.componentStack || '' });
    console.error('[AI Engine] This screen crashed:', error);
  }

  details() {
    const { error, componentStack } = this.state;
    return [
      `AI Engine build: ${window.mwai?.build_ref || window.mwai?.cache_buster || 'unknown'}`,
      `Page: ${window.location.href}`,
      `Browser: ${navigator.userAgent}`,
      `Error: ${error?.message || String(error)}`,
      error?.stack || '',
      componentStack ? `Components:${componentStack}` : ''
    ].filter(Boolean).join('\n');
  }

  copy() {
    const done = () => this.setState({ copied: true });
    try {
      navigator.clipboard.writeText(this.details()).then(done, done);
    }
    catch (e) {
      done();
    }
  }

  freshReload() {
    const url = new URL(window.location.href);
    url.searchParams.set('mwai_cache', '1');
    window.location.href = url.toString();
  }

  retry() {
    this.setState({ error: null, componentStack: '', copied: false });
  }

  render() {
    const { error, copied } = this.state;
    if (!error) {
      return this.props.children;
    }
    const isTab = this.props.scope === 'tab';
    const button = { padding: '6px 12px', marginRight: 8, borderRadius: 4, border: '1px solid #2271b1',
      background: '#fff', color: '#2271b1', cursor: 'pointer', fontSize: 13 };
    return (
      <div style={{ margin: isTab ? '10px 0' : '20px 20px 20px 0', padding: '20px 24px', background: '#fff', border: '1px solid #d63638',
        borderLeftWidth: 4, borderRadius: 4, maxWidth: 820, fontSize: 14, lineHeight: 1.5, color: '#1d2327' }}>
        <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>{isTab ? 'AI Engine could not display this tab' : 'AI Engine could not display this screen'}</h2>
        <p style={{ margin: '0 0 8px' }}>Something went wrong while loading it. Your settings and data are not affected, and chatbots on your site keep working.{isTab ? ' The other tabs still work.' : ''}</p>
        <p style={{ margin: '0 0 14px' }}>Try reloading with fresh scripts first: a cache or optimization plugin can keep an outdated file after an update. If the {isTab ? 'tab' : 'screen'} still fails, copy the details below and send them to support.</p>
        <p style={{ margin: '0 0 14px' }}>
          {isTab && <button type="button" style={button} onClick={() => this.retry()}>Try again</button>}
          <button type="button" style={{ ...button, background: '#2271b1', color: '#fff' }} onClick={() => this.freshReload()}>Reload with fresh scripts</button>
          <button type="button" style={button} onClick={() => window.location.reload()}>Reload</button>
          <button type="button" style={button} onClick={() => this.copy()}>{copied ? 'Copied' : 'Copy error details'}</button>
        </p>
        <pre style={{ margin: 0, padding: 12, background: '#f6f7f7', borderRadius: 4, fontSize: 12, whiteSpace: 'pre-wrap',
          wordBreak: 'break-word', maxHeight: 220, overflow: 'auto' }}>{error?.message || String(error)}</pre>
      </div>
    );
  }
}

export default AdminErrorBoundary;
