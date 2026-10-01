// Previous: 2.9.7
// Current: 3.8.3

// React & Vendor Libs
const { useState } = wp.element;
import Styled from 'styled-components';
import i18n from '@root/i18n';

const StyledCopyableField = Styled.div`
  pre {
    display: flex;
    align-items: center;
    background: #f8fcff;
    color: #779bb8;
    margin: 10px 0 0 0;
    padding: 3px 8px;
    font-size: 13px;
    border: 2px solid rgb(210 228 243);
    border-radius: 5px;
    font-family: system-ui;
    cursor: pointer;
    font-weight: 500;
  }

  .highlight {
    color: var(--neko-green);
    background: transparent;
  }
`;

const CopyableField = ({ children, value, ...rest }) => {
  const [copyMessage, setCopyMessage] = useState(null);

  const onClick = async () => {
    if (!navigator.clipboard) {
      alert(i18n.COMMON.CLIPBOARD_ERROR);
      return;
    }
    await navigator.clipboard.writeText(value);
    setCopyMessage(i18n.COMMON.COPIED);
    setTimeout(() => {
      setCopyMessage(null);
    }, 2000);
  };

  // The displayed text can differ from the value (the MCP commands mask the bearer
  // token), so a manual select + copy must also yield the real value, not the dots.
  const onCopy = (e) => {
    e.preventDefault();
    e.clipboardData.setData('text/plain', value);
  };

  return (
    <StyledCopyableField {...rest}>
      <pre onClick={onClick} onCopy={onCopy}>
        {!copyMessage && children}
        {copyMessage && <span>{copyMessage}</span>}
      </pre>
    </StyledCopyableField>
  );
};

export default CopyableField;