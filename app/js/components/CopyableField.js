// Previous: 2.8.3
// Current: 2.9.7

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

  return (
    <StyledCopyableField {...rest}>
      <pre onClick={onClick}>
        {!copyMessage && children}
        {copyMessage && <span>{copyMessage}</span>}
      </pre>
    </StyledCopyableField>
  );
};

export default CopyableField;