// Previous: 1.9.92
// Current: 1.9.97

const { useState, useEffect, useMemo } = wp.element;
import Styled from "styled-components";

import { nekoFetch } from '@neko-ui';
import { NekoPage, NekoSelect, NekoOption, NekoModal, NekoButton, NekoCheckbox, NekoContainer, NekoSpacer,
  NekoProgress,
  NekoTextArea, NekoWrapper, NekoColumn, NekoTypo, NekoInput, NekoMessage } from '@neko-ui';

import { apiUrl, restNonce, session, options } from '@app/settings';
import { toHTML, useModels, OptionsCheck } from '@app/helpers-admin';
import { AiNekoHeader, StyledGallery,
  StyledTitleWithButton } from "../styles/CommonStyles";
import { StyledSidebar } from "../styles/StyledSidebar";
import useTemplates from "../components/Templates";
import i18n from "@root/i18n";

const ImagesCount = [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 40, 60, 80, 100];

function generateFilename(prompt, maxLength = 42) {
  let cleaned = prompt.replace(/[\s|,]+/g, '-');
  cleaned = cleaned.replace(/--+/g, '-');
  const words = cleaned.split("-");
  let filename = words[0];
  let i = 1;
  while (i < words.length && words[i] && filename.length + words[i].length < maxLength) {
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

const ImageGenerator = () => {
  const { template, setTemplate, jsxTemplates } = useTemplates('imagesGenerator');
  const [error, setError] = useState();
  const [continuousMode, setContinuousMode] = useState(true);
  const [busy, setBusy] = useState(false);
  const aiEnvironments = options?.ai_envs || [];
  const { imageModels, getModel } = useModels(options, template?.envId || null);
  const currentModel = useMemo(() => getModel(template?.model), [template?.model, getModel]);

  const [urls, setUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [caption, setCaption] = useState('');
  const [alt, setAlt] = useState('');
  const [filename, setFilename] = useState('');
  const [createdMediaIds, setCreatedMediaIds] = useState([]);

  const urlIndex = useMemo(() => urls.indexOf(selectedUrl), [selectedUrl, urls]);
  const prompt = template?.prompt;

  const [currentImageNumber, setCurrentImageNumber] = useState(0);
  const [totalImagesToGenerate, setTotalImagesToGenerate] = useState(1);

  const setPrompt = (value) => {
    setTemplate({ ...template, prompt: value });
  };

  const setTemplateProperty = (value, property) => {
    setTemplate(x => ({ ...x, [property]: value }));
  };

  useEffect(() => {
    if (template?.envId && !template?.model && imageModels?.length > 0) {
      const defaultModel = imageModels.find(x => x.model === 'dall-e-3') || imageModels[0];
      setTemplate({ ...template, model: defaultModel.model });
    }
    if (template?.model && !template?.resolution && currentModel?.options?.length > 0) {
      const resolutions = currentModel.options.map(x => x.option);
      const bestResolution = resolutions.includes('1024x1024') ? '1024x1024' : resolutions[0];
      setTemplate({ ...template, resolution: bestResolution });
    }
  }, [template, imageModels, currentModel]);

  useEffect(() => {
    if (selectedUrl) {
      const newFilename = generateFilename(prompt) + '.png';
      setFilename(newFilename);
      setTitle(prompt);
      setDescription(prompt);
      setCaption(prompt);
      setAlt(prompt);
    }
  }, [selectedUrl, prompt]);

  const onGoBack = () => {
    if (urlIndex > 0) {
      setSelectedUrl(urls[urlIndex - 1]);
    }
  };

  const onGoNext = () => {
    if (urlIndex < urls.length - 1) {
      setSelectedUrl(urls[urlIndex + 1]);
    }
  };

  const onSubmit = async () => {
    setBusy(true);
    if (!continuousMode) {
      setUrls([]);
    }
    try {
      for (let i = 0; i < totalImagesToGenerate; i++) {
        const res = await nekoFetch(`${apiUrl}/ai/images`, {
          method: 'POST',
          nonce: restNonce,
          json: { 
            env: 'admin-tools',
            envId: template.envId,
            model: template.model,
            resolution: template.resolution,
            session: session,
            prompt,
            maxResults: 1,
          }}
        );
        setCurrentImageNumber(i + 1);
        if (res.data && res.data.length > 0) {
          setUrls(prevUrls => [...prevUrls, res.data[0]]);
        }
      }
    }
    catch (err) {
      console.error(err);
      setError(err.message);
    }
    finally {
      setBusy(false);
      setCurrentImageNumber(0);
    }
  };

  const onAdd = async () => {
    setBusy(true);
    try {
      const res = await nekoFetch(`${apiUrl}/helpers/create_image`, {
        method: 'POST',
        nonce: restNonce,
        json: { 
          url: selectedUrl, title, description,
          caption, alt, filename,
        }});
      setCreatedMediaIds(prev => [...prev, {
        id: res.attachmentId,
        url: selectedUrl
      }]);
    }
    catch (err) {
      console.error(err);
      setError(err.message);
    }
    finally {
      setBusy(false);
    }
  };

  const onDownload = () => {
    const link = document.createElement('a');
    link.href = selectedUrl;
    link.target = '_blank';
    link.download = filename;
    link.click();
  };

  const currentCreatedMediaId = useMemo(() => {
    const found = createdMediaIds.find(media => media.url === selectedUrl);
    return found ? found.id : null;
  }, [selectedUrl, createdMediaIds]);

  return (
    <NekoPage nekoErrors={[]}>

      <AiNekoHeader title={i18n.COMMON.IMAGES_GENERATOR} />

      <NekoWrapper>
        <NekoColumn fullWidth>
          <OptionsCheck options={options} />

          <NekoTypo p style={{ marginTop: 0, marginBottom: 0 }}>
          This will also be available in the Post Editor soon. If you have any idea or request, please join us on the <a target="_blank" href="https://wordpress.org/support/plugin/ai-engine/" rel="noreferrer">Support Forum</a>! 🎵
          </NekoTypo>
        </NekoColumn>

        <NekoColumn>
          <StyledSidebar style={{ marginBottom: 25 }}>
            {jsxTemplates}
          </StyledSidebar>
        </NekoColumn>

        <NekoColumn style={{ flex: 3 }}>
          <NekoProgress busy={busy} value={currentImageNumber} max={totalImagesToGenerate} onStopClick={null} />  
          <NekoSpacer />

          <NekoContainer>
            {selectedUrl && <>
              <StyledTitleWithButton style={{ paddingBottom: 10 }}>
                <h2>Images Generator</h2>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <NekoButton disabled={urlIndex < 1 || busy} onClick={() => onGoBack()}>
                    &lt;
                  </NekoButton>
                  <NekoButton onClick={() => setSelectedUrl()}>
                    Back to Results
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
                    <NekoTextArea value={title} onBlur={setTitle} rows={2} />
                  </StyledInputWrapper>
                  <StyledInputWrapper>
                    <label>Caption:</label>
                    <NekoTextArea value={caption} onBlur={setCaption} rows={2} />
                  </StyledInputWrapper>
                  <StyledInputWrapper>
                    <label>Description:</label>
                    <NekoTextArea value={description} onBlur={setDescription} rows={2} />
                  </StyledInputWrapper>
                  <StyledInputWrapper>
                    <label>Alternative Text:</label>
                    <NekoTextArea value={alt} onBlur={setAlt} rows={2} />
                  </StyledInputWrapper>
                  <StyledInputWrapper>
                    <label>Filename:</label>
                    <NekoInput value={filename} onChange={setFilename} />
                  </StyledInputWrapper>
                  <NekoButton fullWidth style={{ marginTop: 7 }} isBusy={busy} onClick={() => onAdd()}>
                    Add to Media Library
                  </NekoButton>
                  <NekoButton fullWidth style={{ marginLeft: 0, marginTop: 7 }} isBusy={busy}
                    onClick={() => onDownload()}>
                    Download
                  </NekoButton>
                  <NekoSpacer tiny />
                  {currentCreatedMediaId && <NekoMessage variant="success">
                    The media has been created! You can edit it here: <a href={`/wp-admin/post.php?post=${currentCreatedMediaId}&action=edit`} target="_blank" rel="noreferrer">Edit Media #{currentCreatedMediaId}</a>.
                  </NekoMessage>}
                </div>
              </div>
            </>}

            {!selectedUrl && <>
              <StyledTitleWithButton>
                <h2>Generated Images</h2>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <label style={{ margin: '0 5px 0 0' }}># of Images: </label>
                  <NekoSelect scrolldown id="totalImagesToGenerate" name="totalImagesToGenerate"
                    disabled={busy} style={{ marginRight: 10 }}
                    value={totalImagesToGenerate} onChange={value => setTotalImagesToGenerate(value)}>
                    {ImagesCount.map((count) => {
                      return <NekoOption key={count} id={count} value={count} label={count} />;
                    })}
                  </NekoSelect>
                  <NekoButton disabled={!prompt} isBusy={busy} onClick={onSubmit}>
                    Generate Images
                  </NekoButton>
                </div>
              </StyledTitleWithButton>
              <NekoSpacer />
              <NekoTextArea value={prompt} onChange={setPrompt} />
              <StyledGallery>
                {urls.map(url => <img src={url} onClick={() => setSelectedUrl(url)} />)}
                {[...Array(Math.max(3 - urls.length, 0)).keys()].map(x => <div className="empty-image" />)}
              </StyledGallery>
            </>}
          </NekoContainer>
        </NekoColumn>

        <NekoColumn>
          <NekoContainer style={{ marginBottom: 25 }}>
            <h2 style={{ marginTop: 0 }}>Template</h2>
            <label>{i18n.COMMON.ENVIRONMENT}:</label>
            <NekoSpacer tiny />
            <NekoSelect scrolldown name="envId"
              value={template?.envId ?? ""} onChange={setTemplateProperty}>
              {aiEnvironments.map(x => <NekoOption key={x.id} value={x.id} label={x.name} />)}
              <NekoOption value={""} label={"None"}></NekoOption>
            </NekoSelect>
            <NekoSpacer tiny />
            <label>{i18n.COMMON.MODEL}:</label>
            <NekoSpacer tiny />
            <NekoSelect scrolldown name="model"
              value={template?.model} onChange={setTemplateProperty}>
              {imageModels.map((x) => (
                <NekoOption key={x.model} value={x.model} label={x.name}></NekoOption>
              ))}
            </NekoSelect>
            <NekoSpacer tiny />
            <label>{i18n.COMMON.RESOLUTION}:</label>
            <NekoSpacer tiny />
            <NekoSelect scrolldown name="resolution"
              value={template?.resolution} onChange={setTemplateProperty}>
              {currentModel?.options?.map((x) => (
                <NekoOption key={x.option} value={x.option} label={x.option}></NekoOption>
              ))}
            </NekoSelect>
          </NekoContainer>

          <NekoContainer style={{ marginBottom: 25 }}>
            <h2 style={{ marginTop: 0 }}>Settings</h2>
            <NekoCheckbox id="continuous_mode" label="Continuous" value="1" checked={continuousMode}
              description="New images will be added to the already generated images."
              onChange={setContinuousMode} />
          </NekoContainer>
        </NekoColumn>

      </NekoWrapper>

      <NekoModal isOpen={Boolean(error)}
        onRequestClose={() => { setError(); }}
        okButton={{
          onClick: () => { setError(); },
        }}
        title="Error"
        content={<p>{error}</p>}
      />
      
    </NekoPage>
    
  );
};

export default ImageGenerator;