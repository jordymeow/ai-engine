// Previous: 2.5.6
// Current: 2.5.7

const { useState, useEffect, useMemo } = wp.element;
import Styled from "styled-components";

import { nekoFetch } from '@neko-ui';
import { NekoPage, NekoSelect, NekoOption, NekoModal, NekoButton, NekoCheckbox, NekoContainer, NekoSpacer,
  NekoProgress, NekoTextArea, NekoWrapper, NekoColumn, NekoTypo,
  NekoInput, NekoMessage } from '@neko-ui';
import { apiUrl, restNonce, session, options } from '@app/settings';
import { toHTML, useModels, OptionsCheck } from '@app/helpers-admin';
import { AiNekoHeader, StyledGallery,
  StyledTitleWithButton } from "../styles/CommonStyles";
import { StyledSidebar } from "../styles/StyledSidebar";
import useTemplates from "../components/Templates";
import i18n from "@root/i18n";

const ImagesCount = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 40, 60, 80, 100];

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
  const [ error, setError ] = useState();
  const [ continuousMode, setContinuousMode ] = useState(true);
  const [ busy, setBusy ] = useState(false);
  const [ busyMediaLibrary, setBusyMediaLibrary ] = useState(false);
  const aiEnvironments = options?.ai_envs || [];
  const { imageModels, getModel } = useModels(options, template?.envId || null);
  const currentModel = getModel(template?.model);
  const [ taskQueue, setTaskQueue ] = useState([]);

  const [ urls, setUrls ] = useState([]);
  const [ selectedUrl, setSelectedUrl ] = useState();
  const [ title, setTitle] = useState('');
  const [ description, setDescription ] = useState('');
  const [ caption, setCaption ] = useState('');
  const [ alt, setAlt ] = useState('');
  const [ filename, setFilename ] = useState('');
  const [ createdMediaIds, setCreatedMediaIds ] = useState([]);
  const urlIndex = useMemo(() => urls.indexOf(selectedUrl), [selectedUrl, urls]);
  const prompt = template?.prompt;

  const [ totalImagesToGenerate, setTotalImagesToGenerate ] = useState(1);
  const [ totalTasks, setTotalTasks ] = useState(0);
  const [ processedTasks, setProcessedTasks ] = useState(0);
  const abortController = new AbortController();

  const currentStyle = template?.style ?? null;

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
    if (template?.model && !template?.resolution && currentModel?.resolutions?.length > 0) {
      const resolutions = currentModel.resolutions.map(x => x.name);
      const bestResolution = resolutions.includes('1024x1024') ? '1024x1024' : resolutions[0];
      setTemplate({ ...template, resolution: bestResolution });
    }
  }, [template]);

  useEffect(() => {
    if (selectedUrl) {
      const newFilename = generateFilename(prompt) + '.png';
      setFilename(newFilename);
      setTitle(prompt);
      setDescription(prompt);
      setCaption(prompt);
      setAlt(prompt);
    }
  }, [selectedUrl]);

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

  const addToQueue = () => {
    if (!prompt) {
      console.error("Prompt is empty, cannot add to queue.");
      return;
    }

    for (let i = 0; i < totalImagesToGenerate; i++) {
      const newTask = {
        prompt,
        envId: template.envId,
        model: template.model,
        resolution: template.resolution,
        style: template.style,
      };
      setTaskQueue(queue => [...queue, newTask]);
    }
    setTotalTasks(prev => prev + totalImagesToGenerate);
  };

  const processQueue = async () => {
    if (taskQueue.length === 0 || busy) return;

    setBusy(true);
    const currentTask = taskQueue[0];

    try {
      const res = await nekoFetch(`${apiUrl}/ai/images`, {
        method: 'POST',
        nonce: restNonce,
        signal: abortController.signal,
        json: {
          env: 'admin-tools',
          envId: currentTask.envId,
          model: currentTask.model,
          resolution: currentTask.resolution,
          style: currentTask.style,
          scope: 'admin-tools',
          session: session,
          message: currentTask.prompt,
          maxResults: 1,
        }}
      );
      if (res.data && res.data.length > 0) {
        setUrls(urls => [...urls, res.data[0]]);
      }
      setTaskQueue(queue => queue.slice(1));
      setProcessedTasks(prev => prev + 1);
      if (taskQueue.length === 1) {
        setTotalTasks(0);
        setProcessedTasks(0);
      }
    }
    catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        setError(err.message + (taskQueue.length > 1 ? ' The other tasks will continue.' : ''));
        setTaskQueue(queue => queue.slice(1));
        setTotalTasks(totalTasks => totalTasks - 1);
      }
    }
    finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (taskQueue.length > 0 && !busy) {
      processQueue();
    }
  }, [taskQueue, busy]);

  const clearImages = () => {
    setUrls([]);
  };

  const onAdd = async () => {
    setBusyMediaLibrary(true);
    try {
      const res = await nekoFetch(`${apiUrl}/helpers/create_image`, {
        method: 'POST',
        nonce: restNonce,
        json: {
          url: selectedUrl, title, description,
          caption, alt, filename,
        }});
      setCreatedMediaIds([...createdMediaIds, {
        id: res.attachmentId,
        url: selectedUrl
      }]);
    }
    catch (err) {
      console.error(err);
      setError(err.message);
    }
    finally {
      setBusyMediaLibrary(false);
    }
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

          <NekoContainer style={{ marginBottom: 25 }}>
            <h3 style={{ marginTop: 0 }}>Parameters</h3>
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
              {currentModel?.resolutions?.map((x) => (
                <NekoOption key={x.name} value={x.name} label={x.label}></NekoOption>
              ))}
            </NekoSelect>
            {template?.resolution === 'custom' && <>
              <NekoSpacer tiny />
              <label>Custom Resolution:</label>
              <NekoSpacer tiny />
              <NekoInput name="customResolution" value={template?.customResolution}
                onChange={(value) => setTemplateProperty(value, 'customResolution')} />
            </>}
            {currentModel?.model?.startsWith('dall-e-3') && <>
              <NekoSpacer tiny />
              <label>{i18n.COMMON.STYLE}:</label>
              <NekoSpacer tiny />
              <NekoSelect scrolldown name="style" value={currentStyle} onChange={setTemplateProperty}>
                <NekoOption key={'none'} value={null} label={'None'}></NekoOption>
                <NekoOption key={'natural'} value={'natural'} label={'Natural'}></NekoOption>
                <NekoOption key={'vivid'} value={'vivid'} label={'Vivid'}></NekoOption>
              </NekoSelect>
            </>}
          </NekoContainer>

          <NekoContainer style={{ marginBottom: 25 }}>
            <h2 style={{ marginTop: 0 }}>Settings</h2>
            <NekoCheckbox id="continuous_mode "label="Continuous" value="1" checked={continuousMode}
              description="New images will be added to the already generated images."
              onChange={setContinuousMode} />
          </NekoContainer>
        </NekoColumn>

        <NekoColumn style={{ flex: 3 }}>

          <NekoProgress busy={busy} value={processedTasks} max={totalTasks}
            onStopClick={() => {
              abortController.abort();
              setTaskQueue([]);
              setTotalTasks(0);
              setProcessedTasks(0);
              setBusy(false);
            }}
            status={() => `${processedTasks} / ${totalTasks}`}
/>

          <NekoSpacer />

          <NekoContainer>

            {selectedUrl && <>

              <StyledTitleWithButton style={{ paddingBottom: 10 }}>
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

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 2 }}>
                  <a href={selectedUrl} target="_blank" rel="noreferrer">
                    <img src={selectedUrl} style={{ width: '100%' }} />
                  </a>
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
                  <NekoSpacer />
                  <NekoButton fullWidth style={{ height: 42 }} onClick={onAdd} isBusy={busyMediaLibrary}>
                    Add to Media Library
                  </NekoButton>
                  <NekoSpacer tiny />
                  {currentCreatedMediaId && <>
                    <NekoSpacer />
                    <NekoMessage variant="success">
                      The media has been created! You can edit it here: <a href={`/wp-admin/post.php?post=${currentCreatedMediaId}&action=edit`} target="_blank" rel="noreferrer">Edit Media #{currentCreatedMediaId}</a>.
                    </NekoMessage>
                  </>}
                </div>
              </div>

            </>}

            {!selectedUrl && <>
              <StyledTitleWithButton>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <NekoButton disabled={!prompt} isBusy={busy} onClick={addToQueue}>
                    Generate
                  </NekoButton>
                  <NekoSelect scrolldown id="totalImagesToGenerate" name="totalImagesToGenerate"
                    style={{ marginLeft: 10, marginRight: 10, width: 120 }}
                    value={totalImagesToGenerate} onChange={value => setTotalImagesToGenerate(value)}>
                    {ImagesCount.map((count) => {
                      return <NekoOption key={count} id={count} value={count}
                        label={`${count} ${count > 1 ? 'Images' : 'Image'}`}
                      />;
                    })}
                  </NekoSelect>
                  {busy && <NekoButton disabled={!prompt} onClick={addToQueue}>
                    Add to Queue
                  </NekoButton>}
                  {urls.length > 0 && <NekoButton onClick={clearImages}>
                    Clear
                  </NekoButton>}
                </div>
              </StyledTitleWithButton>
              <NekoSpacer />
              <NekoTextArea value={prompt} onChange={setPrompt} />
              <StyledGallery>
                {urls.map(url => <img key={url} src={url} onClick={() => setSelectedUrl(url)} />)}
                {[...Array(Math.max(3 - urls.length, 0)).keys()].map(() => <div className="empty-image" />)}
              </StyledGallery>
            </>}

          </NekoContainer>

        </NekoColumn>


      </NekoWrapper>

      <NekoModal isOpen={error}
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