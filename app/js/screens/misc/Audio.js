// Previous: 1.3.81
// Current: 1.5.7

// React & Vendor Libs
const { useState } = wp.element;
import { apiUrl, restNonce, session, options } from '@app/settings';

// NekoUI
import { NekoWrapper, NekoBlock, NekoSpacer, NekoColumn, NekoTextArea, NekoButton, NekoSelect,
  NekoOption } from '@neko-ui';
import { nekoFetch } from '@neko-ui';

const Audio = () => {
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState('transcription');
  const [content, setContent] = useState('');
  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);

  const onTranscribeClick = async () => {
    setBusy(true);
    try {
      const res = await nekoFetch(`${apiUrl}/transcribe`, { 
        method: 'POST',
        nonce: restNonce,
        json: { url, prompt, mode}
      });
      let data = res.data;
      if (data?.error?.message) {
        alert(data.error.message);
      }
      else {
        setContent(data);
      }
    }
    catch (err) {
      alert(err.message);
    }
    finally {
      setBusy(false);
    }
  };

  return (<>
    <NekoWrapper>
      <NekoColumn minimal>
        <NekoBlock busy={busy} title="Params" className="primary">
          <p>
            I have added this for you to play with. Let's see if we move into other parts of the WordPress UI or not! 😬 Don't hesitate to share your ideas. Costs are not added in AI Engine, as the requires usage data is not returned by OpenAI for this model.
          </p>
          <label>Audio URL:</label>
          <NekoSpacer />
          <NekoTextArea name="url" rows={1} value={url} onChange={setUrl} />
          <NekoSpacer />
          <label>Prompt:</label>
          <NekoSpacer />
          <NekoTextArea rows={2} value={prompt} onChange={setPrompt} description={<>This optional prompt allows you to give more information about the audio transcript. More information <a href='https://platform.openai.com/docs/guides/speech-to-text/prompting' target='_blank'>here</a>.</>} />
          <NekoSpacer />
          <label>Mode:</label>
          <NekoSpacer />
          <NekoSelect fullWidth scrolldown value={mode} onChange={setMode} description={<>For more information about languages support, have a look <a href='https://platform.openai.com/docs/guides/speech-to-text/translations' target='_blank'>here</a>.</>}>
            <NekoOption value='transcription' label="Transcription (Any Language)" />
            <NekoOption value='translation' label="Transcription (Any Language) + Translation into English" />
          </NekoSelect>
          <NekoSpacer height={65} />
          <NekoButton fullWidth style={{ height: 40 }} onClick={onTranscribeClick}>Transcribe</NekoButton>
        </NekoBlock>
      </NekoColumn>
      <NekoColumn minimal>
        <NekoBlock title="Transcription" className="primary">
          <NekoSpacer />
          <NekoTextArea name="context" rows={21} value={content} disabled={!content} />
        </NekoBlock>
      </NekoColumn>
    </NekoWrapper>
  </>);
};

export default Audio;
