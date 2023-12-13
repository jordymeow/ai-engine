// Previous: none
// Current: 2.0.8

const { useState, useEffect } = wp.element;
import Styled from 'styled-components';

const StyledShortcode = Styled.div`
  pre {
    display: flex;
    align-items: center;
    background: #f8fcff;
    color: #779bb8;
    margin: 0px;
    padding: 3px 8px;
    font-size: 13px;
    border: 2px solid rgb(210 228 243);
    border-radius: 5px;
    font-family: system-ui;
    cursor: pointer;
    font-weight: 500;
  }

  .mwai-name {
    font-style: italic;
  }

  .mwai-value {
    color: var(--neko-green);
  }
`;

const Shortcode = ({ currentChatbot, isCustom = false, defaultChatbot, ...rest }) => {
  const [copyMessage, setCopyMessage] = useState(null);
  const [shortcodeHtml, setShortcodeHtml] = useState('');
  const [shortcodeText, setShortcodeText] = useState('');

  useEffect(() => {

    if (!currentChatbot) {
      setShortcodeHtml(null);
      setShortcodeText(null);
      return;
    }

    let shortcode;
    let params = [];
    if (isCustom) {
      for (const key in currentChatbot) {
        if (currentChatbot[key] === undefined || currentChatbot[key] === null ||
          key === 'botId' || key === 'name' || key === 'maxSentences' ||
          currentChatbot[key] === '' || (defaultChatbot && defaultChatbot[key] === currentChatbot[key])) {
          continue;
        }
        let value = currentChatbot[key];
        if (value && typeof value === 'string' && value.includes('"')) {
          value = value.replace(/"/g, '\'');
        }
        if (value && typeof value === 'string' && value.includes('\n')) {
          value = value.replace(/\n/g, '\\n');
        }
        if (value && typeof value === 'string' && value.includes('[')) {
          value = value.replace(/\[/g, '&#91;');
        }
        if (value && typeof value === 'string' && value.includes(']')) {
          value = value.replace(/\]/g, '&#93;');
        }
  
        const newKey = key.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
  
        params.push(`${newKey}="${value}"`);
      }
      shortcode = '[mwai_chatbot' + (params.length ? ` ${params.join(' ')}` : '') + ']';
    }
    else {
      const currentBotId = currentChatbot.botId ?? 'default';
      params.push(`id="${currentBotId}"`);
      shortcode = `[mwai_chatbot id="${currentBotId}"]`;
    }

    const jsxHTML = <span>
      [mwai_chatbot {params.map((param, index) => {
        const [key, value] = param.split('=');
        return <span key={index}>
          <span className="mwai-name">{key}</span>=<span className="mwai-value">{value}</span>{index < params.length - 1 ? ' ' : ''}
        </span>
      }
      )}]
    </span>;

    setShortcodeHtml(jsxHTML);
    setShortcodeText(shortcode);
  }, [currentChatbot, isCustom]);

  const onClick = async () => {
    if (!navigator.clipboard) {
      alert("Clipboard is not enabled (only works with https).");
      return;
    }
    await navigator.clipboard.writeText(shortcode);
    setCopyMessage('Copied!');
    setTimeout(() => {
      setCopyMessage(null);
    }, 2000);
  };

  if (!currentChatbot) {
    return null;
  }

  return (
    <StyledShortcode {...rest}>
      <pre onClick={onClick}>
        {!copyMessage && shortcodeHtml}
        {copyMessage && <span>{copyMessage}</span>}
      </pre>
    </StyledShortcode>
  );
};

export default Shortcode;