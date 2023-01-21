// Previous: 0.2.2
// Current: 0.3.4

const { useState, useEffect, useMemo } = wp.element;
import Styled from "styled-components";

import { postFetch } from '@neko-ui';
import { NekoPage, NekoSelect, NekoOption, NekoModal, NekoButton, NekoCheckbox, NekoContainer,
  NekoWrapper, NekoColumn, NekoTypo, NekoInput, NekoMessageSuccess } from '@neko-ui';

import { apiUrl, restNonce, session, options } from '@app/settings';
import { OptionsCheck } from "../helpers";
import { AiNekoHeader, StyledGallery, StyledTextField, StyledTitleWithButton } from "./CommonStyles";

const ImagesCount = [3, 6, 9];

function generateFilename(prompt, maxLength = 42) {
  let cleaned = prompt.replace(/[\s|,]+/g, '-');
  cleaned = cleaned.replace(/--+/g, '-');
  const words = cleaned.split("-");
  let filename = words[0];
  let i = 1;
  while (filename.length + words[i].length < maxLength && i < words.length) {
    filename += "-" + words[i];
    i++;
  }
  if (filename.length > (maxLength + 1)) {
    filename = filename.slice(0, maxLength + 2);
  }
  return filename;
}

const StyledInputWrapper = Styled.div`
  margin-bottom: 5px;

  label {
    margin-bottom: 5px;
    display: block;
  }
`;

const isTest = true;

const DefaultTitle = isTest ? 'japan, tokyo, trees, izakaya, anime oil painting, high resolution, ghibli inspired, 4k' : '';

const ImageGenerator = () => {
  const [error, setError] = useState();
  const [prompt, setPrompt] = useState(DefaultTitle);
  const [continuousMode, setContinuousMode] = useState(false);
  const [maxResults, setMaxResults] = useState(3);
  const [urls, setUrls] = useState([]);

  const [selectedUrl, setSelectedUrl] = useState();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [caption, setCaption] = useState('');
  const [alt, setAlt] = useState('');
  const [filename, setFilename] = useState('');
  
  const [busy, setBusy] = useState(false);
  const [createdMediaIds, setCreatedMediaIds] = useState([]);

  const urlIndex = useMemo(() => urls.indexOf(selectedUrl), [selectedUrl, urls]);

  useEffect(() => {
    if (selectedUrl) {
      const newFilename = generateFilename(prompt) + '.png';
      setFilename(newFilename);
      setTitle(prompt);
      setDescription(prompt);
      setCaption(prompt);
      setAlt(prompt);
    }
  }, [selectedUrl])

  const onGoBack = () => {
    if (urlIndex > 0) {
      setSelectedUrl(urls[urlIndex - 1]);
    }
  }

  const onGoNext = () => {
    if (urlIndex < urls.length - 1) {
      setSelectedUrl(urls[urlIndex + 1]);
    }
  }

  const onSubmit = async () => {
    setBusy(true);
    const res = await postFetch(`${apiUrl}/make_images`, { json: { 
      prompt,
      maxResults,
    }, nonce: restNonce });
    setBusy(false);
    if (res.success) {
      if (continuousMode) {
        setUrls(prevUrls => [...prevUrls, ...res.data]);
      }
      else {
        setUrls(res.data);
      }
    }
    setError(res.message);
    return null;
  };

  const onAdd = async () => {
    setBusy(true);
    const res = await postFetch(`${apiUrl}/create_image`, { json: { 
      env: 'imagesgenerator',
      session: session,
      url: selectedUrl,
      title,
      description,
      caption,
      alt,
      filename,
    }, nonce: restNonce });
    setBusy(false);
    if (res.success) {
      setCreatedMediaIds(prevIds => [...prevIds, {
        id: res.attachmentId,
        url: selectedUrl
      }]);
    }
    setError(res.message);
    return null;
  }

  const onDownload = () => {
    const link = document.createElement('a');
    link.href = selectedUrl;
    link.target = '_blank';
    link.download = filename;
    link.click();
  }

  const currentCreatedMediaId = useMemo(() => {
    const found = createdMediaIds.find(media => media.url === selectedUrl);
    return found ? found.id : null;
  }, [selectedUrl, createdMediaIds]);

  console.log({ createdMediaIds, currentCreatedMediaId });

  return (
    <NekoPage nekoErrors={[]}>

      <AiNekoHeader title="Image Generator" />

      <NekoWrapper>
        
        <NekoContainer style={{ borderRadius: 0, marginBottom: 0 }}>

          <NekoTypo p style={{ marginBottom: 0 }}>
            <b>This is extremely beta!</b> The idea is that I want this to be very convenient to use, and this UI will be found later in the Post Editor directly, via a modal, and you'll be able to add new generated images easily anywhere. If you have any remark, idea, or request, please come and chat with me on the <a target="_blank" href="https://wordpress.org/support/plugin/ai-engine/">Support Forum</a>. Let's make this better together 💕
          </NekoTypo>

        </NekoContainer>

        <OptionsCheck options={options} />

        <NekoColumn style={{ flex: 3 }}>

          {selectedUrl && <>
            <NekoContainer>

              <StyledTitleWithButton style={{ paddingBottom: 10 }}>
                <h2>Images Generator</h2>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <NekoButton disabled={urlIndex <= 0 || busy} onClick={() => onGoBack()}>
                    &lt;
                  </NekoButton>
                  <NekoButton disabled={busy} onClick={() => setSelectedUrl()}> 
                    Back to results
                  </NekoButton>
                  <NekoButton disabled={urlIndex >= urls.length - 1 || busy} onClick={() => onGoNext()}>
                    &gt;
                  </NekoButton>
                </div>
              </StyledTitleWithButton>

              <div style={{ display: 'flex' }}>
                <div style={{ flex: 2 }}>
                  <img src={selectedUrl} style={{ width: '100%' }} />
                </div>
                <div style={{ flex: 1, marginLeft: 10, display: 'flex', flexDirection: 'column' }}>
                  <StyledInputWrapper>
                    <label>Title:</label>
                    <StyledTextField value={title} onBlur={(e) => setTitle(e.target.value)} />
                  </StyledInputWrapper>
                  <StyledInputWrapper>
                    <label>Caption:</label>
                    <StyledTextField value={caption} onBlur={(e) => setCaption(e.target.value)} />
                  </StyledInputWrapper>
                  <StyledInputWrapper>
                    <label>Description:</label>
                    <StyledTextField value={description} onBlur={(e) => setDescription(e.target.value)} />
                  </StyledInputWrapper>
                  <StyledInputWrapper>
                    <label>Alternative Text:</label>
                    <StyledTextField value={alt} onBlur={(e) => setAlt(e.target.value)} />
                  </StyledInputWrapper>
                  <StyledInputWrapper>
                    <label>Filename:</label>
                    <NekoInput value={filename} onChange={(e) => setFilename(e.target.value)} />
                  </StyledInputWrapper>
                  <NekoButton fullWidth style={{ marginTop: 7 }} isBusy={busy} onClick={() => onAdd()}>
                    Add to Media Library
                  </NekoButton>
                  <NekoButton fullWidth style={{ marginLeft: 0, marginTop: 7 }} isBusy={busy}
                    onClick={() => onDownload()}>
                    Download
                  </NekoButton>
                  {currentCreatedMediaId && <NekoMessageSuccess
                    style={{ fontSize: 13, padding: '10px 5px' }}>
                    The media has been created! You can edit it here: <a href={`/wp-admin/post.php?post=${currentCreatedMediaId}&action=edit`} target="_blank">Edit Media #{currentCreatedMediaId}</a>.
                  </NekoMessageSuccess>}
                </div>
              </div>


            </NekoContainer>
          </>}

          {!selectedUrl && <>
            <NekoContainer>
              <StyledTitleWithButton>
                <h2>Generated Images</h2>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ margin: '0 5px 0 0' }}># of Images: </label>
                  <NekoSelect scrolldown id="maxResults" name="maxResults" disabled={busy} 
                    style={{ marginRight: 10 }}
                    value={maxResults} description="" onChange={(e) => setMaxResults(parseInt(e.target.value))}>
                    {ImagesCount.map((count) => {
                      return <NekoOption key={count} id={count} value={count} label={count} />
                    })}
                  </NekoSelect>
                  <NekoButton disabled={!prompt} isBusy={busy} onClick={onSubmit}>
                    Generate Images
                  </NekoButton>
                </div>
              </StyledTitleWithButton>
              <StyledTextField value={prompt} onBlur={(e) => setPrompt(e.target.value)} style={{ marginTop: 20 }} />
              {urls.length > 0 && <StyledGallery>
                {urls.map(url => <img src={url} onClick={() => setSelectedUrl(url)} key={url} />)}
              </StyledGallery>}
              {!urls.length && <StyledGallery>
                <div className="empty-image" />
                <div className="empty-image" />
                <div className="empty-image" />
              </StyledGallery>}
            </NekoContainer>
          </>}
            
        </NekoColumn>

        <NekoColumn>
          <NekoContainer style={{ marginBottom: 25 }}>
            <h2 style={{ marginTop: 0 }}>Settings</h2>
            <NekoCheckbox id="continuous_mode" label="Continuous" value="1" checked={continuousMode}
              description="New images will be added to the already generated images."
              onChange={(checked) => setContinuousMode(checked)} />
          </NekoContainer>
        </NekoColumn>

      </NekoWrapper>

      <NekoModal isOpen={Boolean(error)}
        onRequestClose={() => { setError() }}
        onOkClick={() => { setError() }}
        title="Error"
        content={<p>{error}</p>}
      />
      
    </NekoPage>
  );
};