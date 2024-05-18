// Previous: 2.2.95
// Current: 2.3.1

// React & Vendor Libs
const { useState } = wp.element;
import { apiUrl, restNonce } from '@app/settings';

// NekoUI
import { NekoWrapper, NekoBlock, NekoSpacer, NekoColumn, NekoTextArea, 
  NekoButton, NekoSettings, NekoCheckbox } from '@neko-ui';
import { nekoFetch, nekoStringify } from '@neko-ui';
import i18n from '@root/i18n';

const Moderation = ({ options, updateOption, busy: busyParent }) => {
  const [content, setContent] = useState('I would love to live on a tropical island with beautiful and sexy felines, where we could bask in the sun on the sandy beaches, sip on refreshing coconut milk, and enjoy each other\'s company. While we might occasionally fight in the trees, our days would mostly be spent in peaceful slumber. However, I am not sure of how we would handle any potential disruptions to our idyllic existence if human were to come...');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const shortcode_chat_moderation = options?.shortcode_chat_moderation;
  const isBusy = busy || busyParent;

  const onModerateClick = async () => {
    setBusy(true);
    const res = await nekoFetch(`${apiUrl}/ai/moderate`, { 
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

  const jsxChatbot = 
    <NekoSettings title={i18n.COMMON.CHATBOT}>
      <NekoCheckbox name="shortcode_chat_moderation" label={i18n.COMMON.ENABLE} value="1"
        checked={shortcode_chat_moderation}
        description={i18n.SETTINGS.CHATBOT_MODERATION_HELP}
        onChange={updateOption} />
  </NekoSettings>;

  return (<>
    <NekoWrapper>
      <NekoColumn minimal>
        <NekoBlock busy={isBusy} title={i18n.COMMON.SETTINGS} className="primary">
          <p>You can enable moderation various parts of WordPress. It will slow down the processing a little.</p>
          {jsxChatbot}
        </NekoBlock>
      </NekoColumn>
      <NekoColumn minimal>
        <NekoBlock busy={isBusy} title="AI Moderation Tester" className="primary">
          <p>
            Paste a text below, and check if it is safe for your website. <b>OpenAI Moderation Model is free!</b> Learn more about it <a href="https://platform.openai.com/docs/guides/moderation/overview" target="_blank">here</a>.
          </p>
          <NekoTextArea name="context" rows={8} value={content} onChange={setContent} />
          <NekoSpacer />
          <NekoButton fullWidth onClick={onModerateClick}>Moderation Check</NekoButton> 
          <NekoSpacer />
          <label>Results:</label>
          <pre>
            {nekoStringify(results, 2)}
          </pre>
        </NekoBlock>
      </NekoColumn>
    </NekoWrapper>
  </>);
};

export default Moderation;
