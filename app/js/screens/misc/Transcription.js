// Previous: 1.9.96
// Current: 2.3.1

const { useState, useEffect } = wp.element;
import { JsonViewer } from '@textea/json-viewer';

import { NekoWrapper, NekoBlock, NekoSpacer, NekoColumn,
  NekoTextArea, NekoButton, NekoTabs, NekoTab } from '@neko-ui';
import { nekoFetch } from '@neko-ui';
import i18n from '@root/i18n';

import { apiUrl, restNonce } from '@app/settings';

const Transcription = () => {
  const [ url, setUrl ] = useState('');
  const [ content, setContent ] = useState('');
  const [ message, setMessage ] = useState('');
  const [ busy, setBusy ] = useState(false);
  const [ tab, setTab ] = useState('imageToText');
  const [ startTime, setStartTime ] = useState(null);

  useEffect(() => {
    setUrl('');
    setContent('');
    setMessage('');
  }, [ tab ]);

  const transcribe = async (type = 'imageToText') => {
    let finalApiUrl = "";
    if (type === 'textToJSON') {
      finalApiUrl = `${apiUrl}/ai/json`;
    }
    else if (type === 'imageToText') {
      finalApiUrl = `${apiUrl}/ai/transcribe_image`;
    }
    else if (type === 'audioToText') {
      finalApiUrl = `${apiUrl}/ai/transcribe_audio`;
    }
    else {
      alert(`Unknown transcription type: ${type}`);
      return;
    }
    setBusy(type);
    setStartTime(Date.now());
    try {
      const res = await nekoFetch(finalApiUrl, { 
        method: 'POST',
        nonce: restNonce,
        json: { url, message }
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
      setStartTime(null);
    }
  };

  const onChangeTab = (_index, attr) => {
    setTab(attr.key);
  }

  return (
    <NekoWrapper>
      <NekoColumn minimal>
        <NekoBlock title="Features" className="raw">
        <NekoTabs inversed onChange={onChangeTab}>

          <NekoTab title={i18n.COMMON.IMAGE_TO_TEXT} key="imageToText">
            <label>Image URL:</label>
            <NekoSpacer tiny />
            <NekoTextArea name="url" rows={2} value={url} onChange={setUrl} />
            <NekoSpacer />
            <label>Prompt:</label>
            <NekoSpacer tiny />
            <NekoTextArea rows={2} value={message} onChange={setMessage} />
            <NekoSpacer />
            <NekoButton fullWidth style={{ height: 40 }} disabled={busy} isBusy={busy === 'imageToText'}
              startTime={startTime}
              onClick={() => { transcribe('imageToText') }}>
              Transcribe Image
            </NekoButton>
            <NekoSpacer tiny />
            <p>If you are looking for beautiful images to play with this, here are some URLs: <a target="_blank" href="https://offbeatjapan.org">Offbeat Japan</a>, <a target="_blank" href="https://unsplash.com">Unsplash</a>, <a target="_blank" href="https://www.pexels.com">Pexels</a>.</p>
          </NekoTab>

          <NekoTab title={i18n.COMMON.AUDIO_TO_TEXT} key="audioToText">
            <label>Audio URL:</label>
            <NekoSpacer tiny />
            <NekoTextArea name="url" rows={2} value={url} onChange={setUrl} />
            <NekoSpacer />
            <label>Prompt:</label>
            <NekoSpacer tiny />
            <NekoTextArea rows={2} value={message} onChange={setMessage} />
            <NekoSpacer />
            <NekoButton fullWidth style={{ height: 40 }} disabled={busy} isBusy={busy === 'audioToText'}
              startTime={startTime}
              onClick={() => { transcribe('audioToText') }}>
              Transcribe Audio
            </NekoButton>
          </NekoTab>

          <NekoTab title={i18n.COMMON.PROMPT_TO_JSON} key="textToJSON">
            <label>Prompt:</label>
            <NekoSpacer tiny />
            <NekoTextArea rows={2} value={message} onChange={setMessage} />
            <NekoSpacer />
            <NekoButton fullWidth style={{ height: 40 }} disabled={busy} isBusy={busy === 'textToJSON'}
              startTime={startTime}
              onClick={() => { transcribe('textToJSON') }}>
              Query AI
            </NekoButton>
            <NekoSpacer />
            <label>Examples:</label>
            <ul>
              <li>👽 List the best science fiction books. Include the title, author, publication year, and a short synopsis.</li>
              <li>🎋 Identify the most beautiful gardens in Japan. Provide the garden name, location (gps: [lng, lat]), best visiting season, and features.</li>
              <li>💰 Identify the current top 10 richest individuals globally. For each person, include their name, estimated net worth, source of wealth, country of residence, and key tags (such as 'technology', 'retail', 'investor', etc.). Additionally, provide a brief description of their most notable business ventures or achievements.</li>
              <li>🦁 Compile a list of significant archaeological discoveries in the last decade. Include the discovery, location, date, and significance.</li>
            </ul>
            <NekoSpacer />
          </NekoTab>

        </NekoTabs>
        </NekoBlock>
      </NekoColumn>

      <NekoColumn minimal>
        <NekoBlock title="Transcription" className="primary">
          <NekoSpacer tiny />
          {tab === 'textToJSON' && <JsonViewer value={content} 
            indentWidth={2}
            displayDataTypes={false}
            displayObjectSize={false}
            displayArrayKey={false}
            enableClipboard={false}
            style={{ fontSize: 12 }}
          />}
          {tab !== 'textToJSON' && 
            <NekoTextArea name="context" rows={21} value={content} disabled={!content} />
          }
        </NekoBlock>
      </NekoColumn>
    </NekoWrapper>
  );
};