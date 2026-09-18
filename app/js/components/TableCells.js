// Previous: none
// Current: 3.7.9

// Shared cells for AI Engine admin tables (Discussions, Insights).
const { useState } = wp.element;
import styled from 'styled-components';
import { RefreshCw } from 'lucide-react';
import i18n from '@root/i18n';

export const StyledCell = styled.div`
  min-width: 0;
  word-break: normal;
  overflow-wrap: anywhere;
  line-height: 1.35;

  .mwai-line {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }

  .mwai-main {
    font-weight: 500;
    color: #1e1e1e;
  }

  .mwai-sub {
    margin-top: 2px;
    font-size: 12px;
    color: #787c82;
  }

  .mwai-tag {
    display: inline-block;
    margin-right: 6px;
    padding: 0 6px;
    border-radius: 999px;
    background: #eef1f5;
    color: #50575e;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    vertical-align: 1px;
  }

  tr.selected & .mwai-main, tr.selected & a {
    color: #ffffff;
  }

  tr.selected & .mwai-sub {
    color: rgba(255, 255, 255, 0.82);
  }

  tr.selected & .mwai-tag {
    background: rgba(255, 255, 255, 0.22);
    color: #ffffff;
  }
`;

export const parseStoredDate = (value) => {
  if (!value) { return null; }
  let iso = String(value).replace(' ', 'T');
  if (!/[zZ]|[+-]\d\d:?\d\d$/.test(iso)) { iso += 'Z'; }
  const date = new Date(iso);
  return isNaN(date.getTime()) ? null : date;
};

const siteClock = (date) => {
  const tz = window.mwai?.timezone || {};
  if (tz.string) { return { date, zone: tz.string }; }
  return { date: new Date(date.getTime() - (Number(tz.offset) || 0) * 3600000), zone: 'UTC' };
};

export const shortTime = (value) => {
  const utc = parseStoredDate(value);
  if (!utc) { return { label: value || '', full: '' }; }
  const { date, zone } = siteClock(utc);
  const { date: now } = siteClock(new Date());
  const dayKey = (d) => d.toLocaleDateString('en-CA', { timeZone: zone });
  const full = `${date.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: zone })} ${date.toLocaleTimeString('ja-JP', { hour12: false, timeZone: zone })}`;
  const seconds = (Date.now() - utc.getTime()) / 1000;
  let label;
  if (seconds <= 60) {
    label = 'Just now';
  }
  else if (seconds < 3600) {
    label = `${Math.floor(seconds / 60)} min ago`;
  }
  else if (dayKey(date) === dayKey(now)) {
    label = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: zone });
  }
  else if (dayKey(date) === dayKey(new Date(now.getTime() - 86400000))) {
    label = 'Yesterday';
  }
  else if (seconds < 6 * 86400) {
    label = date.toLocaleDateString([], { weekday: 'long', timeZone: zone });
  }
  else if (date.getFullYear() === now.getFullYear()) {
    label = date.toLocaleDateString([], { month: 'short', day: 'numeric', timeZone: zone });
  }
  else {
    label = date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric', timeZone: zone });
  }
  return { label, full };
};

export const UserCell = ({ userId, ip }) => (
  <StyledCell title={ip ? `IP: ${ip}` : undefined}>
    <div className="mwai-line">
      {userId ? <a target="_blank" rel="noreferrer" href={`/wp-admin/user-edit.php?user_id=${userId}`}
        onClick={e => e.preventDefault()}>{i18n.COMMON.USER} #{userId}</a> : i18n.COMMON.GUEST}
    </div>
    {!userId && ip && <div className="mwai-line mwai-sub">{ip}</div>}
  </StyledCell>
);

export const formatPrice = (price) => {
  if (price === null || price === undefined || price === '') { return null; }
  const n = Number(price);
  if (!n) { return '$0'; }
  if (n > 1) { return `$${n.toFixed(2)}`; }
  if (n >= 0.01) { return `$${n.toFixed(3)}`; }
  if (n < 0.000001) { return '<$0.000001'; }
  const digits = Math.max(7, Math.min(4, -Math.floor(Math.log10(n)) + 1));
  return `$${n.toFixed(digits)}`;
};

export const InfoRow = ({ label, value, mono }) => {
  const [copied, setCopied] = useState(false);
  if (value === undefined || value === null || value === '') { return null; }
  const text = String(value);
  const copy = () => {
    try {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    }
    catch (e) { /* clipboard unavailable */ }
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '78px minmax(0, 1fr)', gap: 8, padding: '5px 0',
      borderBottom: '1px solid #f0f0f1', fontSize: 12, alignItems: 'baseline' }}>
      <div style={{ color: '#787c82' }}>{label}</div>
      <div title={mono ? `${text} (click to copy)` : text} onClick={mono ? copy : undefined}
        style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#1e1e1e',
          fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : undefined,
          fontSize: mono ? 11 : 12, cursor: mono ? 'copy' : 'default' }}>
        {copied ? 'Copied' : text}
      </div>
    </div>
  );
};

export const ContextText = ({ text, label = 'Context' }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ paddingTop: 8, fontSize: 12 }}>
      <div style={{ color: '#787c82', marginBottom: 3 }}>{label}</div>
      <div style={open ? { whiteSpace: 'pre-wrap', color: '#1e1e1e' } : { display: '-webkit-box', WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 4, overflow: 'hidden', color: '#1e1e1e' }}>{text}</div>
      {String(text).length >= 220 && <a href="#" style={{ fontSize: 12 }}
        onClick={e => { e.preventDefault(); setOpen(!open); }}>{open ? 'Show less' : 'Show all'}</a>}
    </div>
  );
};

export const ChatBubble = ({ role, text, label }) => {
  const isUser = role === 'user';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
        color: isUser ? 'var(--neko-green)' : 'var(--neko-purple)', margin: '0 4px 3px' }}>
        {label || (isUser ? 'User' : 'Assistant')}
      </div>
      <div style={{ maxWidth: '92%', padding: '8px 11px', borderRadius: 12, border: '1px solid #eaeaea',
        background: isUser ? '#f3fff3' : '#f9f3ff', color: '#1e1e1e', fontSize: 13, lineHeight: 1.45,
        whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', maxHeight: 220, overflowY: 'auto' }}>
        {text}
      </div>
    </div>
  );
};

const StyledIconAction = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #ffffff;
  opacity: 0.75;
  cursor: pointer;
  transition: opacity 0.2s ease, background 0.2s ease;

  &:hover:not(:disabled) {
    opacity: 1;
    background: rgba(255, 255, 255, 0.14);
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .mwai-spinning {
    animation: mwai-icon-spin 0.9s linear infinite;
  }

  @keyframes mwai-icon-spin {
    to { transform: rotate(360deg); }
  }
`;

export const RefreshAction = ({ onClick, busy = false, disabled = false, title }) => (
  <StyledIconAction type="button" title={title || i18n.COMMON.REFRESH} aria-label={title || i18n.COMMON.REFRESH}
    onClick={onClick} disabled={busy || disabled}>
    <RefreshCw size={18} className={busy ? 'mwai-spinning' : undefined} />
  </StyledIconAction>
);