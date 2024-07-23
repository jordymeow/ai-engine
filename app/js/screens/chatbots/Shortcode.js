// Previous: 2.3.5
// Current: 2.5.0

const { useState, useMemo } = wp.element;
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

  .skipped-params {
    margin-top: 10px;
    color: #ff4d4f;
  }
`;

/**
 * Sanitizes the parameter value to avoid breaking the shortcode.
 *
 * @param {string} value - The parameter value to sanitize.
 * @returns {string} - The sanitized parameter value.
 */
const sanitizeParamValue = ( value ) => {
  if ( typeof value !== 'string' ) {
    return value;
  }

  return value
    .replace( /"/g, '&quot;' )
    .replace( /'/g, '&#039;' )
    .replace( /\n/g, '\\n' )
    .replace( /\[/g, '&#91;' )
    .replace( /\]/g, '&#93;' );
};

const Shortcode = ({ currentChatbot, isCustom = false, defaultChatbot, ...rest }) => {
  const [copyMessage, setCopyMessage] = useState(null);

  const shortcodeData = useMemo(() => {
    if (!currentChatbot) {
      return { shortcodeHtml: null, shortcodeText: null, skipped: [] };
    }

    let shortcode;
    const params = [];
    const skipped = [];

    if (isCustom) {
      for (const key in currentChatbot) {
        const value = currentChatbot[key];
        if (
          value === undefined ||
          value === null ||
          key === 'botId' ||
          key === 'name' ||
          key === 'maxMessages' ||
          value === '' ||
          (defaultChatbot && defaultChatbot[key] === value) ||
          typeof value === 'object' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          if (typeof value === 'object' && (Array.isArray(value) && value.length !== 0)) {
            skipped.push(key);
          }
          continue;
        }

        const sanitizedValue = sanitizeParamValue(value);

        const newKey = key.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
        params.push(`${newKey}="${sanitizedValue}"`);
      }
      shortcode = '[mwai_chatbot' + (params.length ? ` ${params.join(' ')}` : '') + ']';
    } else {
      const currentBotId = currentChatbot.botId ?? 'default';
      params.push(`id="${currentBotId}"`);
      shortcode = `[mwai_chatbot id="${currentBotId}"]`;
    }

    const jsxHTML = (
      <span>
        [mwai_chatbot{' '}
        {params.map((param, index) => {
          const [key, value] = param.split('=');
          return (
            <span key={index}>
              <span className="mwai-name">{key}</span>=<span className="mwai-value">{value}</span>
              {index < params.length - 1 ? ' ' : ''}
            </span>
          );
        })}
        ]
      </span>
    );

    return { shortcodeHtml: jsxHTML, shortcodeText: shortcode, skipped };
  }, [currentChatbot, isCustom, defaultChatbot]);

  const skippedParams = shortcodeData?.skipped ?? [];

  const onClick = async () => {
    if (!navigator.clipboard) {
      alert('Clipboard is not enabled (only works with https).');
      return;
    }
    await navigator.clipboard.writeText(shortcodeData.shortcodeText);
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
        {!copyMessage && shortcodeData.shortcodeHtml}
        {copyMessage && <span>{copyMessage}</span>}
      </pre>
      {skippedParams.length > 0 && (
        <div className="skipped-params">
          Skipped parameters: {skippedParams.join(', ')}
        </div>
      )}
    </StyledShortcode>
  );
};

export default Shortcode;