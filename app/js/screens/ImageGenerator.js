// Previous: 2.5.7
// Current: 2.8.2

const { useState, useEffect, useMemo, useRef } = wp.element;
import Styled from "styled-components";

import { nekoFetch } from '@neko-ui';
import { NekoPage, NekoSelect, NekoOption, NekoModal, NekoButton, NekoCheckbox, NekoContainer, NekoSpacer,
  NekoProgress, NekoTextArea, NekoWrapper, NekoColumn,
  NekoInput, NekoMessage, NekoQuickLinks, NekoLink } from '@neko-ui';
import { apiUrl, restNonce, session, options, restUrl } from '@app/settings';
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
  const { template, templates, setTemplate, jsxTemplates } = useTemplates('imagesGenerator');
  const [ error, setError ] = useState();
  const searchParams = new URLSearchParams(window.location.search);
  const editId = searchParams.get('editId');
  const [ mode, setMode ] = useState(editId ? 'edit' : 'generate');
  const [ infoModal, setInfoModal ] = useState(false);
  const [ editImageUrl, setEditImageUrl ] = useState();
  const [ continuousMode, setContinuousMode ] = useState(true);
  const [ busy, setBusy ] = useState(false);
  const [ busyMediaLibrary, setBusyMediaLibrary ] = useState(false);
  const [ busyMetadata, setBusyMetadata ] = useState(false);
  const aiEnvironments = options?.ai_envs || [];
  const { imageModels, getModel } = useModels(options, template?.envId || null);
  const currentModel = getModel(template?.model);
  const [ taskQueue, setTaskQueue ] = useState([]);

  // Results
  const [ urls, setUrls ] = useState([]);
  const [ selectedUrl, setSelectedUrl ] = useState();
  const [ title, setTitle]= useState('');
  const [ description, setDescription ] = useState('');
  const [ caption, setCaption ] = useState('');
  const [ alt, setAlt ] = useState('');
  const [ filename, setFilename ] = useState('');
  const [ createdMediaIds, setCreatedMediaIds ] = useState([]);
  const prompt = template?.prompt;

  const [ totalImagesToGenerate, setTotalImagesToGenerate ] = useState(1);
  const [ totalTasks, setTotalTasks ] = useState(0);
  const [ processedTasks, setProcessedTasks ] = useState(0);
  const abortController = useRef();

  const onStop = () => {
    abortController.current?.abort();
    setTaskQueue([]);
    setTotalTasks(0);
    setProcessedTasks(0);
    setBusy(false);
  };

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
      const index = urls.indexOf(selectedUrl) + 1;
      const newFilename = (generateFilename(prompt).toLowerCase() || 'image') + '.png';
      setFilename(newFilename);
      setTitle(`Untitled Image #${index || 1}`);
      setDescription(prompt || '');
      setCaption('');
      setAlt('');
    }
  }, [selectedUrl, urls, prompt]);

  useEffect(() => {
    if (editId) {
      fetch(`${restUrl}/wp/v2/media/${editId}`)
        .then(res => res.json())
        .then(data => setEditImageUrl(data.source_url));
    }
  }, [editId, restUrl]);

  const addToQueue = () => {
    if (!prompt) {
      console.error("Prompt is empty, cannot add to queue.");
      return;
    }

    if (mode === 'edit' && !(currentModel?.tags?.includes('image-edit'))) {
      setError('This model does not support image editing.');
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
    abortController.current = new AbortController();
    const currentTask = taskQueue[0];

    try {
      const endpoint = mode === 'edit' ? 'image_edit' : 'images';
      const res = await nekoFetch(`${apiUrl}/ai/${endpoint}`, {
        method: 'POST',
        nonce: restNonce,
        signal: abortController.current.signal,
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
          mediaId: editId,
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
      if (err.name !== 'AbortError' && !/aborted/i.test(err.message)) {
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

  const onGenerateMeta = async () => {
    setBusyMetadata(true);
    try {
      const res = await nekoFetch(`${apiUrl}/helpers/generate_image_meta`, {
        method: 'POST',
        nonce: restNonce,
        json: { url: selectedUrl },
      });
      if (res?.data) {
        setTitle(res.data.title || '');
        setDescription(res.data.description || '');
        setCaption(res.data.description || '');
        setAlt(res.data.description || '');
        if (res.data.filename) {
          setFilename(res.data.filename);
        }
      }
    }
    catch (err) {
      if (err.name !== 'AbortError' && !/aborted/i.test(err.message)) {
        console.error(err);
        setError(err.message);
      }
    }
    finally {
      setBusyMetadata(false);
    }
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
      setCreatedMediaIds(prevIds => [...prevIds, {
        id: res.attachmentId,
        url: selectedUrl
      }]);
      setSelectedUrl();
    }
    catch (err) {
      if (err.name !== 'AbortError' && !/aborted/i.test(err.message)) {
        console.error(err);
        setError(err.message);
      }
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

        <OptionsCheck options={options} />

        {/* Left column: Templates, Prompt */}
        <NekoColumn style={{ flex: 1 }}>
          <StyledSidebar>
            {mode === 'edit' && editImageUrl &&
              <img src={editImageUrl} style={{ width: '100%', marginBottom: 10 }} />
            }
            {mode !== 'edit' && jsxTemplates}
          </StyledSidebar>

          <NekoSpacer />

          <StyledSidebar>
            {!selectedUrl && <>
              <h2 style={{ marginTop: 0 }}>{toHTML(i18n.COMMON.PROMPT)}</h2>
              <NekoTextArea value={prompt} onChange={setPrompt} rows={10}
                placeholder="Enter your prompt here..." />
              <NekoSpacer tiny />
              <StyledTitleWithButton>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {busy && <NekoButton disabled={!prompt} onClick={addToQueue} style={{ flex: 1 }}>
                      Add to Queue
                    </NekoButton>}
                    {urls.length > 0 && <NekoButton onClick={clearImages} style={{ flex: 1 }}>
                      Clear
                    </NekoButton>}
                  </div>
                  <div style={{ marginTop: 5 }}>
                    <NekoSelect scrolldown id="totalImagesToGenerate" name="totalImagesToGenerate"
                      style={{ width: '100%' }}
                      value={totalImagesToGenerate} onChange={value => setTotalImagesToGenerate(value)}>
                      {ImagesCount.map((count) => {
                        return <NekoOption key={count} id={count} value={count}
                          label={`${count} ${count > 1 ? 'Images' : 'Image'}`}
                        />;
                      })}
                    </NekoSelect>
                  </div>
                </div>
              </StyledTitleWithButton>
            </>}
          </StyledSidebar>

          <StyledSidebar style={{ marginTop: 20 }}>
            <NekoButton fullWidth disabled={!prompt}
              onClick={addToQueue} onStopClick={onStop}
              isBusy={busy}
              style={{ height: 50, fontSize: 14, flex: 4 }}>
              {i18n.COMMON.GENERATE}
            </NekoButton>
          </StyledSidebar>

        </NekoColumn>

        {/* Center Column: Results */}
        <NekoColumn style={{ flex: 2 }}>

          <NekoQuickLinks value={mode} onChange={(value) => {
            if (value === 'generate') {
              location.href = 'edit.php?page=mwai_images_generator';
            }
            else if (value === 'edit') {
              if (!editId) {
                setInfoModal(true);
              }
              else {
                setMode('edit');
              }
            }
          }}>
            <NekoLink title="Create" value="generate" />
            <NekoLink title="Editor" value="edit" />
          </NekoQuickLinks>

          <NekoSpacer />


          <NekoProgress busy={busy} value={processedTasks} max={totalTasks}
            onStopClick={onStop}
            status={() => `${processedTasks} / ${totalTasks}`}
          />

          <NekoSpacer />

          <div>

            <NekoModal
              isOpen={!!selectedUrl}
              title={title || 'Image Preview'}
              size='larger'
              onRequestClose={() => setSelectedUrl()}
              okButton={{
                label: 'Add to Media Library',
                onClick: onAdd,
                isBusy: busyMediaLibrary
              }}
              cancelButton={{
                label: 'Close',
                onClick: () => setSelectedUrl()
              }}
              content={selectedUrl && (
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: 2 }}>
                    <a href={selectedUrl} target="_blank" rel="noreferrer">
                      <img src={selectedUrl} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
                    </a>
                  </div>
                  <div style={{ flex: 1, marginLeft: 10, display: 'flex', flexDirection: 'column' }}>
                    <StyledInputWrapper>
                      <label>Title:</label>
                      <NekoInput value={title} onChange={setTitle} />
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
                    <NekoSpacer tiny />
                    <NekoButton onClick={onGenerateMeta} isBusy={busyMetadata}>
                      Generate Meta
                    </NekoButton>
                    <NekoSpacer tiny />
                  </div>
                </div>
              )}
            />

            {!selectedUrl && <>
              <StyledGallery>
                {urls.map(url => {
                  const media = createdMediaIds.find(m => m.url === url);
                  return (
                    <div key={url} className="image-wrapper" onClick={() => setSelectedUrl(url)}>
                      <img src={url} />
                      {media && (
                        <div className="media-label" onClick={e => { e.stopPropagation(); window.open(`/wp-admin/post.php?post=${media.id}&action=edit`, '_blank'); }}>
                          Media #{media.id}
                        </div>
                      )}
                      <div className="delete-icon" onClick={e => {
                        e.stopPropagation();
                        setUrls(urls.filter(u => u !== url));
                        setCreatedMediaIds(prevIds => prevIds.filter(m => m.url !== url));
                      }}>&times;</div>
                    </div>
                  );
                })}
                {[...Array(Math.max(3 - urls.length, 0)).keys()].map((_, i) => <div key={i} className="empty-image" />)}
              </StyledGallery>
            </>}

          </div>

        </NekoColumn>

        {/* Right Column: Model Params, Settings */}
        <NekoColumn style={{ flex: 1 }}>
          <StyledSidebar style={{ marginBottom: 25 }}>
            <h3 style={{ marginTop: 0 }}>{i18n.COMMON.MODEL_PARAMS}</h3>
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
          </StyledSidebar>

          <StyledSidebar style={{ marginBottom: 25 }}>
            <h2 style={{ marginTop: 0 }}>{i18n.COMMON.SETTINGS}</h2>
            <NekoCheckbox id="continuous_mode" label="Continuous" value="1" checked={continuousMode}
              description="New images will be added to the already generated images."
              onChange={setContinuousMode} />
          </StyledSidebar>
        </NekoColumn>

      </NekoWrapper>

      <NekoModal isOpen={!!error}
        onRequestClose={() => { setError(); }}
        okButton={{
          onClick: () => { setError(); },
        }}
        title="Error"
        content={<p>{error}</p>}
      />

      <NekoModal isOpen={infoModal}
        onRequestClose={() => setInfoModal(false)}
        okButton={{
          onClick: () => setInfoModal(false),
        }}
        title="Image Edit"
        content={<p>Editing images is only available via the Edit action in the Media Library and is still in active development.</p>}
      />

    </NekoPage>

  );
};

export default ImageGenerator;