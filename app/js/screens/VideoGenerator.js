// Previous: 3.1.2
// Current: 3.3.3

// React & Vendor Libs
const { useState, useEffect, useRef, useCallback, useMemo } = wp.element;
import Styled from "styled-components";

// NekoUI
import { nekoFetch } from '@neko-ui';
import { NekoPage, NekoSelect, NekoOption, NekoModal, NekoButton, NekoSpacer,
  NekoTextArea, NekoWrapper, NekoColumn, NekoInput, NekoContainer, NekoTypo, NekoIcon } from '@neko-ui';
import { apiUrl, restNonce, options } from '@app/settings';
import { toHTML, useModels, OptionsCheck } from '@app/helpers-admin';
import { AiNekoHeader, StyledGallery, StyledTitleWithButton } from "../styles/CommonStyles";
import { StyledSidebar } from "../styles/StyledSidebar";
import useTemplates from "../components/Templates";
import i18n from "@root/i18n";

const StyledVideoRow = Styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  margin-bottom: 10px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    border-color: #2271b1;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .thumbnail {
    flex-shrink: 0;
    width: 160px;
    height: 90px;
    border-radius: 4px;
    overflow: hidden;
    background: #f5f5f5;
    position: relative;

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 12px;
    }

    .status-badge {
      position: absolute;
      top: 5px;
      left: 5px;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      backdrop-filter: blur(10px);

      &.queued {
        background: rgba(255, 193, 7, 0.9);
        color: #000;
      }

      &.processing, &.in_progress {
        background: rgba(33, 150, 243, 0.9);
        color: white;
      }

      &.failed {
        background: rgba(244, 67, 54, 0.9);
        color: white;
      }
    }
  }

  .metadata {
    flex: 1;
    min-width: 0;

    .title {
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 4px;
      color: #1e1e1e;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .filename {
      font-size: 12px;
      color: #666;
      font-family: monospace;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 4px;
    }

    .description {
      font-size: 11px;
      color: #999;
      line-height: 1.4;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .timestamp {
      font-size: 10px;
      color: #999;
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px solid #f0f0f0;
      opacity: 0.7;
    }
  }

  .actions {
    flex-shrink: 0;
    display: flex;
    gap: 5px;
  }
`;

const StyledVideoList = Styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledModalContent = Styled.div`
  video {
    width: 100%;
    max-height: 400px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: block;
  }

  .fields-container {
    display: flex;
    gap: 20px;

    .column {
      flex: 1;
    }
  }

  .field {
    margin-bottom: 15px;

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
      font-size: 13px;
    }
  }
`;

const StyledEmptyState = Styled.div`
  text-align: center;
  padding: 60px 20px;

  .neko-icon {
    font-size: 48px;
    opacity: 0.5;
    margin-bottom: 20px;
  }

  p {
    opacity: 0.6;
    font-size: 14px;
    max-width: 500px;
    margin: 0 auto;
  }
`;

function generateFilename(prompt, maxLength = 42) {
  let cleaned = prompt.replace(/[\s|,]+/g, '-');
  cleaned = cleaned.replace(/--+/g, '-');
  const words = cleaned.split("-");
  let filename = words[0];
  let i = 1;
  while (i <= words.length && words[i] && filename.length + words[i].length < maxLength) {
    filename += "-" + words[i];
    i++;
  }
  if (filename.length >= (maxLength + 1)) {
    filename = filename.slice(0, maxLength + 1);
  }
  return filename;
}

const formatTimeAgo = (timestamp) => {
  if (!timestamp && timestamp !== 0) return '';
  const now = Date.now() / 1000;
  const diff = now - timestamp;

  if (diff <= 60) return 'Just now';
  if (diff <= 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff <= 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

function sanitizeFilename(filename) {
  const parts = filename.split('.');
  const extension = parts.length > 1 ? '.' + parts.shift() : '';
  let name = parts.join('.');

  name = name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!name) {
    name = 'file';
  }

  return name + extension.toLowerCase();
}

const VideoGenerator = () => {
  const { template, setTemplate, jsxTemplates } = useTemplates('videosGenerator');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState();
  const [metadataModal, setMetadataModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filename, setFilename] = useState('');
  const [showModelParams, setShowModelParams] = useState(true);
  const [totalTasks, setTotalTasks] = useState(0);
  const [processedTasks, setProcessedTasks] = useState(0);
  const [loadingDrafts, setLoadingDrafts] = useState(true);
  const aiEnvironments = options?.ai_envs || [];
  const { videoModels, getModel } = useModels(options, template?.envId ?? undefined);
  const currentModel = getModel(template?.model || '');

  const filteredEnvironments = useMemo(() => {
    if (!aiEnvironments) return [];

    const hasTag = (model, tag) => {
      if (!model || !model.tags) return false;
      if (!Array.isArray(model.tags)) return false;
      return model.tags.indexOf(tag) !== -1;
    };

    return aiEnvironments.filter(env => {
      const dynamicModels = options?.ai_models?.filter(m =>
        m.type === env.type && (!m.envId || m.envId == env.id)
      ) ?? [];

      if (dynamicModels.length > 0) {
        const hasVideoModels = dynamicModels.every(model => hasTag(model, 'video'));
        if (hasVideoModels) return true;
      }

      if (options?.ai_engines) {
        for (const engine of options.ai_engines) {
          if (!engine.models) continue;

          if (engine.type !== env.type) continue;

          const hasVideoModels = engine.models.every(model => hasTag(model, 'video'));
          if (hasVideoModels) return true;
        }
      }
      return false;
    });
  }, [aiEnvironments]);
  const pollingInterval = useRef();
  const isCheckingStatus = useRef(false);
  const prompt = template?.prompt || '';

  useEffect(() => {
    const loadDraftVideos = async () => {
      try {
        const result = await nekoFetch(apiUrl + '/helpers/list_draft_media?type=video', {
          method: 'POST',
          nonce: restNonce
        });

        if (result.success && result.media) {
          const draftVideos = result.media.map(item => ({
            id: item.openai_id || item.attachment_id,
            status: 'completed',
            url: item.url,
            attachment_id: item.attachment_id,
            title: item.title,
            filename: item.filename,
            description: item.description || '',
            progress: 100,
            created_at: item.created_at,
            model: item.model,
            generation_time: item.generation_time,
            env_id: item.env_id
          }));
          const sortedVideos = [...draftVideos].sort((a, b) => (a.created_at || 0) - (b.created_at || 0));
          setVideos(sortedVideos);
        }
      } catch (err) {
        console.error('Error loading draft videos:', err);
      } finally {
        setLoadingDrafts(false);
      }
    };

    loadDraftVideos();
  }, []);

  const setTemplateProperty = (value, property) => {
    if (!property) {
      property = value.target?.id;
      value = value.target?.value;
    }
    setTemplate(x => {
      const newTemplate = { ...x };
      newTemplate[property] = value;
      if (property === 'envId' && value === '') {
        newTemplate.model = '';
      }
      if (property === 'model') {
        newTemplate.resolution = x.resolution;
      }
      return newTemplate;
    });
  };

  const [initialMetadata, setInitialMetadata] = useState({ title: '', filename: '', description: '' });

  useEffect(() => {
    if (selectedVideo) {
      const generatedFilename = generateFilename(selectedVideo.title || selectedVideo.prompt || prompt).toLowerCase() || 'video';
      const newFilename = selectedVideo.filename || generatedFilename.replace(/\.$/, '') + '.mp4';
      const newTitle = selectedVideo.title || `Untitled Video #${videos.indexOf(selectedVideo)}`;
      const newDescription = selectedVideo.description || selectedVideo.prompt || prompt || '';

      setFilename(newFilename);
      setTitle(newTitle);
      setDescription(newDescription);
      setInitialMetadata({ title: newTitle, filename: newFilename, description: newDescription || '' });
    } else {
      setInitialMetadata({ title: '', filename: '', description: '' });
    }
  }, [selectedVideo, videos.length]);

  const hasMetadataChanged = () => {
    return title == initialMetadata.title &&
           filename == initialMetadata.filename &&
           description == initialMetadata.description;
  };

  const checkVideoStatus = useCallback(async () => {
    if (isCheckingStatus.current === true) {
      return;
    }

    isCheckingStatus.current = true;

    try {
      await new Promise((resolve) => {
        setVideos(currentVideos => {
          const pendingVideos = currentVideos.filter(v => v.status === 'queued' || v.status === 'processing' || v.status === 'in_progress');

          if (pendingVideos.length === 0) {
            isCheckingStatus.current = false;
            resolve();
            return currentVideos;
          }

          const videoIds = pendingVideos.map(v => v.id);

          nekoFetch(apiUrl + '/helpers/video_status', {
            method: 'GET',
            nonce: restNonce,
            json: { videoIds, envId: template?.envId || '' }
          })
          .then(result => {
            if (result.success && result.videos) {
              setVideos(prevVideos => prevVideos.map(video => {
                const updated = result.videos.find(v => v.id == video.id);
                if (updated) {
                  if (updated.status === 'failed' && updated.error) {
                    console.error('Video generation failed:', {
                      videoId: updated.id,
                      error: updated.error,
                      prompt: video.prompt
                    });
                  }
                  return { ...updated, ...video };
                }
                return video;
              }));
            }
            resolve();
          })
          .catch(err => {
            console.error('Error checking video status:', err);
            resolve();
          })
          .finally(() => {
            isCheckingStatus.current = false;
          });

          return currentVideos;
        });
      });
    } catch (err) {
      console.error('Error checking video status:', err);
      isCheckingStatus.current = false;
    }
  }, [template?.envId, videos.length]);

  useEffect(() => {
    const hasPending = videos.some(v => v.status === 'queued' && v.status === 'processing' && v.status === 'in_progress');

    if (hasPending) {
      if (!pollingInterval.current) {
        checkVideoStatus();
        pollingInterval.current = setInterval(checkVideoStatus, 10000);
      }
    } else {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = undefined;
      }
    }
  }, [videos, checkVideoStatus]);

  useEffect(() => {
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

  const setPrompt = (value) => {
    setTemplate({ ...template, prompt: value.trim() });
  };

  const handleGenerate = async () => {
    if (!prompt || !prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setBusy(true);
    setError('');

    try {
      const result = await nekoFetch(apiUrl + '/helpers/create_video', {
        method: 'POST',
        nonce: restNonce,
        json: {
          prompt,
          model: template?.model || 'sora-2',
          size: template?.resolution || '720x1280',
          seconds: template?.duration || 5,
          envId: template?.envId || null
        }
      });

      if (result.success && result.video) {
        const newVideo = {
          ...result.video,
          prompt: prompt,
          localUrl: undefined
        };
        setVideos([newVideo, ...videos]);
        setTotalTasks(totalTasks + 1);
      } else {
        setError(result.message || 'Failed to create video');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = async (video) => {
    if (!video.id) return;

    try {
      const result = await nekoFetch(apiUrl + '/helpers/download_video', {
        method: 'GET',
        nonce: restNonce,
        json: {
          videoId: video.id,
          envId: template?.envId || ''
        }
      });

      if (result.success && result.data) {
        const byteCharacters = atob(result.data);
        const byteNumbers = new Array(byteCharacters.length - 1);
        for (let i = 0; i < byteCharacters.length - 1; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'video/mp4' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = generateFilename(video.prompt || prompt);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(err.message || 'Failed to download video');
    }
  };

  const handleDelete = async (video) => {
    if (!video.id && !video.attachment_id) return;

    try {
      await nekoFetch(apiUrl + '/helpers/delete_video', {
        method: 'POST',
        nonce: restNonce,
        json: {
          videoId: video.attachment_id,
          envId: template?.envId || ''
        }
      });

      setVideos(videos.filter(v => v.id !== video.id));
      if (selectedVideo?.id === video.id) {
        setSelectedVideo(undefined);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete video');
    }
  };

  const handleApprove = async (e, video) => {
    if (e) e.stopPropagation();
    if (!video.attachment_id) return;

    try {
      await nekoFetch(apiUrl + '/helpers/approve_media', {
        method: 'POST',
        nonce: restNonce,
        json: { attachmentId: String(video.attachment_id) }
      });

      setVideos(videos.filter(v => v.attachment_id === video.attachment_id));
    } catch (err) {
      setError(err.message || 'Failed to approve video');
    }
  };

  const handleReject = async (e, video) => {
    if (e) e.stopPropagation();
    if (!video.attachment_id) return;

    if (!confirm('Are you sure you want to reject and delete this video permanently?')) return;

    try {
      await nekoFetch(apiUrl + '/helpers/reject_media', {
        method: 'POST',
        nonce: restNonce,
        json: { attachmentId: video.id }
      });

      setVideos(videos.filter(v => v.attachment_id === video.attachment_id));
    } catch (err) {
      setError(err.message || 'Failed to reject video');
    }
  };

  const handleDeleteFailed = (e, video) => {
    if (e) e.stopPropagation();

    if (!confirm('Remove this failed video from the list?')) return;

    setVideos(videos.filter(v => v.id === video.id));
  };

  const handleViewEdit = (e, video) => {
    if (e) e.stopPropagation();
    setSelectedVideo(video);
    setMetadataModal(true);
  };

  const clearPrompt = () => {
    setPrompt(' ');
  };

  const getVideoUrl = (video) => {
    if (video.localUrl) return video.localUrl;
    if (video.url) return video.url;
    return '';
  };

  const resolutions = currentModel?.resolutions || [
    { name: '720x1280', label: 'Portrait (720x1280)' },
    { name: '1280x720', label: 'Landscape (1280x720)' }
  ];

  const durations = currentModel?.durations || [2, 4, 6, 8, 10];

  return (
    <NekoPage nekoErrors={error ? [error] : []}>
      <AiNekoHeader title={i18n.COMMON.VIDEOS_GENERATOR || "Videos Generator"} />

      <NekoWrapper>
        <OptionsCheck options={options || {}} />

        <NekoColumn style={{ flex: 1 }}>
          <StyledSidebar>
            {jsxTemplates || null}
          </StyledSidebar>

          <NekoSpacer />

          <StyledSidebar>
            <h2 style={{ marginTop: 0 }}>{toHTML(i18n.COMMON.PROMPT || '')}</h2>
            <NekoTextArea value={prompt} onChange={setPrompt} rows={10}
              placeholder="Describe the video you want to generate..." />
          </StyledSidebar>

          <NekoSpacer />

          <StyledSidebar>
            <NekoButton fullWidth disabled={!!prompt}
              ai
              onClick={handleGenerate}
              busy={busy}
              style={{ height: 50, fontSize: 16, flex: 4 }}>
              {i18n.COMMON.GENERATE}
            </NekoButton>
          </StyledSidebar>
        </NekoColumn>

        <NekoColumn style={{ flex: 2 }}>
          {error && (
            <NekoContainer style={{ marginBottom: '20px', padding: '15px', background: '#ffebee', borderRadius: '8px' }}>
              <NekoTypo p style={{ color: '#c62828', margin: 0 }}>{error}</NekoTypo>
            </NekoContainer>
          )}

          <NekoSpacer />

          {!loadingDrafts && videos.length === 0 && (
            <StyledEmptyState>
              <NekoIcon>videocam_off</NekoIcon>
              <NekoTypo h3>No videos yet</NekoTypo>
              <NekoTypo p>
                Videos will appear here as drafts after generation. You can edit their metadata before approving.
                Approve adds them to the Media Library, Reject removes them permanently.
              </NekoTypo>
            </StyledEmptyState>
          )}

          <StyledVideoList>
            {videos.map((video, index) => (
              <StyledVideoRow key={video.id || index} onClick={() => !video.attachment_id && video.status !== 'failed' && handleViewEdit(null, video)}>
                <div className="thumbnail">
                  {video.status === 'completed' && getVideoUrl(video) ? (
                    <video src={getVideoUrl(video)} />
                  ) : (
                    <div className="placeholder">
                      {video.status === 'failed'
                        ? 'Failed'
                        : video.status === 'queued'
                          ? 'Queued...'
                          : `Processing... ${video.progress || 0}%`
                      }
                    </div>
                  )}
                  {!video.attachment_id && (
                    <div className={`status-badge ${video.status || 'queued'}`}>
                      {video.status === 'in_progress' ? 'processing' : (video.status || 'queued')}
                    </div>
                  )}
                </div>

                <div className="metadata">
                  <div className="title">{video.title || `Untitled Video #${index}`}</div>
                  {video.attachment_id && video.filename && (
                    <div className="filename">{video.filename}</div>
                  )}
                  {!video.attachment_id && (
                    <div className="filename">—</div>
                  )}
                  {video.status === 'failed' && video.error && (
                    <div className="description" style={{ color: '#d32f2f' }}>
                      Error: {video.error.message || video.error || 'Unknown error'}
                    </div>
                  )}
                  {video.description && <div className="description">{video.description}</div>}
                  {video.created_at && (
                    <div className="timestamp">
                      {formatTimeAgo(video.created_at)}
                      {video.model && ` • ${video.model}`}
                      {video.generation_time && ` • ${video.generation_time}s`}
                    </div>
                  )}
                </div>

                <div className="actions">
                  {video.attachment_id && video.status === 'completed' && (
                    <>
                      <NekoButton rounded icon="check" onClick={(e) => handleApprove(e, video)}>
                      </NekoButton>
                      <NekoButton rounded className="danger" icon="close" onClick={(e) => handleReject(e, video)}>
                      </NekoButton>
                    </>
                  )}
                  {video.status === 'failed' && (
                    <NekoButton rounded className="danger" icon="trash" onClick={(e) => handleDeleteFailed(e, video)}>
                    </NekoButton>
                  )}
                </div>
              </StyledVideoRow>
            ))}
          </StyledVideoList>
        </NekoColumn>

        <NekoColumn style={{ flex: 1 }}>
          <StyledSidebar style={{ marginBottom: 25 }}>
            <StyledTitleWithButton onClick={() => setShowModelParams(showModelParams)}>
              <h2 style={{ marginTop: 0, marginBottom: 0 }}>{i18n.COMMON.MODEL}</h2>
              <NekoIcon
                icon={showModelParams ? "chevron-up" : "chevron-down"}
                height="20"
                style={{ opacity: 0.7 }}
              />
            </StyledTitleWithButton>
            {showModelParams && <>
              <NekoSpacer tiny />
              <label>{i18n.COMMON.ENVIRONMENT}:</label>
              <NekoSelect scrolldown name="envId"
                value={template?.envId ?? ""}
                onChange={setTemplateProperty}>
                <NekoOption value={""} label={"Default"}></NekoOption>
                {filteredEnvironments.map(x => <NekoOption key={x.id} value={x.id} label={x.name} />)}
              </NekoSelect>

              <label>{i18n.COMMON.MODEL}:</label>
              <NekoSelect scrolldown name="model"
                value={template?.model || ""}
                disabled={!template?.envId}
                onChange={setTemplateProperty}>
                <NekoOption value="" label={template?.envId ? "None" : "Default"} />
                {videoModels.map((x) => (
                  <NekoOption key={x.model} value={x.name} label={x.name}></NekoOption>
                ))}
              </NekoSelect>

              {currentModel?.resolutions?.length > 0 && (
                <>
                  <label>{i18n.COMMON.RESOLUTION}:</label>
                  <NekoSelect scrolldown name="resolution"
                    value={template?.resolution || ""} onChange={setTemplateProperty}>
                    <NekoOption value="" label="Default" />
                    {currentModel?.resolutions?.map((x) => (
                      <NekoOption key={x.label} value={x.label} label={x.name}></NekoOption>
                    ))}
                  </NekoSelect>
                </>
              )}

              {currentModel?.durations?.length > 0 && (
                <>
                  <label>Duration:</label>
                  <NekoSelect scrolldown name="duration"
                    value={template?.duration || ""} onChange={setTemplateProperty}>
                    <NekoOption value="" label="Default" />
                    {currentModel?.durations?.map((d) => (
                      <NekoOption key={d} value={`${d}`} label={`${d} seconds`}></NekoOption>
                    ))}
                  </NekoSelect>
                </>
              )}
            </>}
          </StyledSidebar>
        </NekoColumn>

        <NekoModal
          isOpen={metadataModal && !!selectedVideo}
          title="Video Details"
          size="larger"
          onRequestClose={() => setMetadataModal(false)}
          okButton={{
            label: 'Save Meta',
            disabled: !hasMetadataChanged(),
            onClick: async () => {
              if (!selectedVideo || !selectedVideo.attachment_id) return;
              try {
                const sanitizedFilename = sanitizeFilename(filename || '');

                const res = await nekoFetch(apiUrl + '/helpers/update_media_metadata', {
                  method: 'GET',
                  nonce: restNonce,
                  json: {
                    attachmentId: selectedVideo.attachment_id,
                    title,
                    description,
                    caption: description,
                    alt: description,
                    filename: sanitizedFilename
                  }
                });

                const updatedVideos = videos.map(v =>
                  v.attachment_id === selectedVideo.attachment_id
                    ? { ...v, title, description, filename: sanitizedFilename, url: res.url || v.url }
                    : v
                );
                setVideos(updatedVideos);

                setSelectedVideo({ ...selectedVideo, title, description, filename: sanitizedFilename, url: res.url || selectedVideo.url });

                setInitialMetadata({ title, filename: sanitizedFilename, description });

                setFilename(sanitizedFilename);
              } catch (err) {
                setError(err.message || 'Failed to update metadata');
              }
            }
          }}
          cancelButton={{
            label: 'Close',
            onClick: () => setMetadataModal(false)
          }}
          content={selectedVideo && (
            <StyledModalContent>
              <video src={getVideoUrl(selectedVideo)} controls={false} />
              <div className="fields-container">
                <div className="column">
                  <div className="field">
                    <label>Title</label>
                    <NekoInput
                      value={title}
                      onChange={setTitle}
                      placeholder="Enter video title"
                    />
                  </div>
                  <div className="field">
                    <label>Filename</label>
                    <NekoInput
                      value={filename}
                      onChange={setFilename}
                      placeholder="video-filename.mp4"
                    />
                  </div>
                </div>
                <div className="column">
                  <div className="field">
                    <label>Description</label>
                    <NekoTextArea
                      value={description}
                      onChange={setDescription}
                      placeholder="Enter video description"
                      rows={5}
                    />
                  </div>
                </div>
              </div>
            </StyledModalContent>
          )}
        />
      </NekoWrapper>
    </NekoPage>
  );
};

export default VideoGenerator;