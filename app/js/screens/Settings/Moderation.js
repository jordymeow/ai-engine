// Previous: 1.1.1
// Current: 1.2.2

// React & Vendor Libs
const { useState, useEffect, useMemo } = wp.element;
import { apiUrl, restNonce, session, options } from '@app/settings';

// NekoUI
import { NekoWrapper, NekoBlock, NekoSpacer, NekoColumn, NekoTextArea, NekoButton } from '@neko-ui';
import { nekoFetch } from '@neko-ui';

const Moderation = ({ options, updateOption }) => {
  const [content, setContent] = useState('I would love to live on a tropical island with beautiful and sexy felines, where we could bask in the sun on the sandy beaches, sip on refreshing coconut milk, and enjoy each other\'s company. While we might occasionally fight in the trees, our days would mostly be spent in peaceful slumber. However, I am not sure of how we would handle any potential disruptions to our idyllic existence if human were to come...');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onModerateClick = async () => {
    setBusy(true);
    const res = await nekoFetch(`${apiUrl}/moderate`, { 
      method: 'POST',
      nonce: restNonce,
      json: { 
        text: content,
    } });
    if (!res.success) {
      setError(res.message);
    }
    else {
      let data = res.results;
      setResults(data?.results);
    }
    setBusy(false);
  };

  return (<>
    <NekoWrapper>
      <NekoColumn minimal>
        <NekoBlock busy={busy} title="AI Moderation Tester" className="primary">
          <p>
            I have added the Moderation Module for you to play with. Where would you like to see the moderation being implemented? Let me know. <b>OpenAI's moderation model is free! 🎵</b>
          </p>
          <NekoTextArea name="context" rows={3} value={content} onChange={setContent} />
          <NekoSpacer />
          <NekoButton fullWidth onClick={onModerateClick}>Moderation AI Check</NekoButton> 
          <NekoSpacer />
          <label>Results:</label>
          <pre>
            {JSON.stringify(results, null, 2)}
          </pre>
        </NekoBlock>
      </NekoColumn>
    </NekoWrapper>
  </>);
};

export default Moderation;
