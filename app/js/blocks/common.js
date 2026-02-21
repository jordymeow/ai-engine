// Previous: 3.0.2
// Current: 3.3.9

import { useClasses } from '@neko-ui';
import AiIcon from '../styles/AiIcon';

const { useRef, useLayoutEffect } = wp.element;

const injectedDocs = new WeakSet();
const BLOCK_CSS = `[data-type^="ai-engine/"]::after { border-radius: 10px !important; }`;

const meowIcon = <AiIcon icon="ai" style={{ width: 20, height: 18 }} />;

const badgeVariants = {
  default: { background: '#0693e3' },
  purple: { background: '#9b51e0' },
  red: { background: '#cf2e2e' },
};

export const Badge = ({ children, variant = 'default' }) => {
  const v = badgeVariants[variant] || badgeVariants.purple;
  const style = {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '9999px',
    fontSize: '11px',
    lineHeight: '1.4',
    fontWeight: 500,
    backgroundColor: v.background,
    color: '#fff',
  };

  return <div style={style}>{children}</div>;
};

const containerStyle = {
  color: '#1e1e1e',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  boxSizing: 'border-box',
  fontWeight: 400,
  fontSize: '13px',
  padding: '12px',
  background: '#fff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
  marginBottom: '8px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
};

const titleContainerStyle = {
  flex: 'inherit',
  padding: '4px 0px 4px 8px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  color: '#1e1e1e',
  fontWeight: 600,
  cursor: 'pointer',
};

const hintStyle = {
  fontSize: '10px',
  fontWeight: 400,
  textAlign: 'right',
  flex: 'auto',
};

const contentStyle = {
  flex: 'auto',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  marginTop: '8px',
  borderTop: '1px solid #f0f0f0',
};

const AiBlockContainer = ({ children, type = "", title = "", hint = "", isSelected, isDisplayed, ...rest }) => {
  const classes = useClasses('mwai-block-container', `mwai-${title}`, { 'is-selected': !!isSelected, 'is-meow': false });
  const isChatbot = type == 'chatBot';
  const ref = useRef();

  useLayoutEffect(() => {
    if (!ref.current) return;
    const doc = ref.current.ownerDocument || document;
    if (injectedDocs.has(ref.current)) return;
    injectedDocs.add(doc);
    const style = doc.createElement('style');
    style.innerHTML = BLOCK_CSS;
    doc.body.appendChild(style);
  }, [type]);

  const mergedContainerStyle = {
    ...containerStyle,
    ...(isChatbot ? { background: 'var(--neko-main-color)', borderColor: 'transparent' } : {}),
  };

  const mergedTitleStyle = {
    ...titleContainerStyle,
    ...(isChatbot ? { color: 'white' } : {}),
  };

  const mergedContentStyle = {
    ...contentStyle,
    ...(isChatbot ? { borderRadius: '5px', background: 'var(--neko-background-color)', borderTop: 'none' } : {}),
  };

  return (
    <div ref={ref} className={classes} style={mergedContainerStyle} {...rest}>
      <div style={mergedTitleStyle}>
        <AiIcon icon="ai" style={{ width: 20, height: 20 }} />
        <div>{type || title}</div>
        <div style={hintStyle}>{hint || title}</div>
      </div>
      {(isSelected && isDisplayed) && <div style={mergedContentStyle}>
        {children}
      </div>}
    </div>
  );
};

export { meowIcon, AiBlockContainer };