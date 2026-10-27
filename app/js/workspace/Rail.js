// Previous: 3.6.3
// Current: 3.8.8

// The icon rail on the far left: always visible, even when the panel is
// collapsed. Clicking the active item toggles the panel; clicking another
// item switches the panel (and expands it if needed).

const WS = window.mwai_workspace || {};

const ICONS = {
  chats: <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  prompts: <svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  agents: <svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="3"/><path d="M12 6v4"/><circle cx="12" cy="4" r="2"/><path d="M9 15h.01"/><path d="M15 15h.01"/></svg>,
  settings: <svg viewBox="0 0 24 24"><path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/></svg>,
  admin: <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>,
};

const RailItem = ({ label, icon, active, soon, onClick, title }) => (
  <button className={`mwai-ws-rail-item ${active ? 'on' : ''}`} title={title || label} onClick={onClick}>
    <span className="mwai-ws-rail-ico">
      {ICONS[icon]}
      {soon && <span className="mwai-ws-rail-soon">soon</span>}
    </span>
    <span className="mwai-ws-rail-label">{label}</span>
  </button>
);

const Rail = ({ activePanel, collapsed, onSelect, onNewChat }) => {
  const isOn = (id) => activePanel === id && !collapsed;
  return (
    <div className="mwai-ws-rail">
      <div className="mwai-ws-rail-logo">
        <img src={`${WS.plugin_url || ''}/images/chat-nyao-1.svg`} alt="Workspace" />
      </div>
      <button className="mwai-ws-rail-new" title="New chat" onClick={onNewChat}>
        <svg viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
      </button>
      <RailItem label="Chats" icon="chats" active={isOn('chats')} onClick={() => onSelect('chats')} />
      <RailItem label="Prompts" icon="prompts" active={isOn('prompts')} onClick={() => onSelect('prompts')} />
      <RailItem label="Chatbots" icon="agents" active={isOn('agents')} onClick={() => onSelect('agents')} />
      <div className="mwai-ws-rail-flex" />
      <RailItem label="Settings" icon="settings" active={isOn('settings')} onClick={() => onSelect('settings')} />
      <a className="mwai-ws-rail-item" href={WS.admin_url || '/wp-admin/'} title="Back to WordPress Admin">
        <span className="mwai-ws-rail-ico">{ICONS.admin}</span>
        <span className="mwai-ws-rail-label">Admin</span>
      </a>
    </div>
  );
};

export default Rail;
