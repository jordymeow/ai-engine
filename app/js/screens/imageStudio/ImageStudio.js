// Previous: none
// Current: 3.7.9

```jsx
const { useState, useEffect, useMemo, useRef, useCallback } = wp.element;
import { Brush, Eraser, Undo2, SplitSquareHorizontal, Download, Upload, Images, Sparkles, Trash2, Check,
  Wand2, X, Loader2, ArrowUp, GitBranch, Layers, Plus } from 'lucide-react';

import { NekoPage, NekoSelect, NekoOption, NekoModal, NekoButton, NekoInput, NekoTextArea } from '@neko-ui';
import { options } from '@app/settings';
import { useModels, hasTag, AiEnvSetupMessage, hasAiEnvIssues } from '@app/helpers-admin';
import { AiNekoHeader } from '@app/styles/CommonStyles';
import { usePresets } from '@app/components/presets';

import * as studio from './api';
import MaskCanvas from './MaskCanvas';
import CompareOverlay from './CompareOverlay';
import AdminPageFit from '@app/components/PageFit';
import StyledStudio from './StyledStudio';

const SETTINGS_KEY = 'mwai_image_studio_settings';
const SOURCES_KEY = 'mwai_image_studio_sources';
const VARIATION_PROMPT = 'Create a fresh variation of this image. Keep the subject, framing and style, and vary the small details.';

const OPERATION_LABELS = {
  source: 'Original',
  create: 'New',
  edit: 'Edit',
  inpaint: 'Brush edit',
  variation: 'Variation'
};

const loadJSON = (key, fallback) => {
  try {
    const value = JSON.parse(window.localStorage.getItem(key));
    return value ?? fallback;
  }
  catch (e) {
    return fallback;
  }
};

const saveJSON = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  catch (e) {
  }
};

const timeAgo = (seconds) => {
  const diff = Date.now() / 1000 - seconds;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff <= 86400) return `${Math.floor(diff / 3600)} h ago`;
  return new Date(seconds * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const toVersion = (m) => ({
  id: Number(m.attachment_id),
  url: m.url,
  prompt: m.prompt || '',
  operation: m.operation || (m.parent_id ? 'edit' : 'create'),
  parentId: m.parent_id ? Number(m.parent_id) : null,
  parentUrl: m.parent_url,
  parentTitle: m.parent_title,
  createdAt: Number(m.created_at) || 0,
  model: m.model,
  saved: !!m.saved,
  title: m.title || '',
  alt: m.alt || '',
  description: m.description || '',
  filename: m.filename || ''
});

const labelOf = (node) => {
  if (!node) return '';
  if (node.operation === 'source') return node.title || 'Photo';
  return node.prompt || node.title || 'Untitled image';
};

const envHasImageModels = (env) => {
  const dynamic = (options?.ai_models ?? []).filter(m => m.type === env.type && (!m.envId || m.envId === env.id));
  const models = dynamic.length ? dynamic
    : (options?.ai_engines ?? []).filter(e => e.type === env.type).flatMap(e => e.models ?? []);
  return models.some(m => hasTag(m, 'image') || hasTag(m, 'image-generation'));
};

const ToolButton = ({ icon: Icon, label, active, disabled, onClick, shortcut }) => (
  <button type="button" className={`mwai-tool${active ? ' on' : ''}`} disabled={disabled} onClick={onClick}
    title={shortcut ? `${label} (${shortcut})` : label}>
    <Icon size={16} />
    <span>{label}</span>
  </button>
);

const ImageStudio = () => {
  const { presets, save: savePresetList, saving: savingPreset, error: presetError } = usePresets('imagesGenerator');
  const [ presetId, setPresetId ] = useState('');
  const [ presetModal, setPresetModal ] = useState(null);
  const [ versions, setVersions ] = useState([]);
  const [ sources, setSources ] = useState(() => loadJSON(SOURCES_KEY, []));
  const [ loading, setLoading ] = useState(true);
  const [ currentId, setCurrentId ] = useState(null);
  const [ settings, setSettings ] = useState(() => loadJSON(SETTINGS_KEY, { envId: '', model: '', resolution: '', quality: '' }));
  const [ mode, setMode ] = useState('edit');
  const [ prompt, setPrompt ] = useState('');
  const [ count, setCount ] = useState(1);
  const [ jobs, setJobs ] = useState([]);
  const [ now, setNow ] = useState(Date.now());
  const [ error, setError ] = useState(null);
  const [ maskMode, setMaskMode ] = useState(false);
  const [ hasMask, setHasMask ] = useState(false);
  const [ erasing, setErasing ] = useState(false);
  const [ brushSize, setBrushSize ] = useState(48);
  const [ compare, setCompare ] = useState(false);
  const [ dims, setDims ] = useState({});
  const [ box, setBox ] = useState(null);
  const [ costs, setCosts ] = useState({});
  const [ sessionCost, setSessionCost ] = useState(0);
  const [ discardId, setDiscardId ] = useState(null);
  const [ meta, setMeta ] = useState({ title: '', alt: '', filename: '' });
  const [ busyMeta, setBusyMeta ] = useState(false);
  const [ busySave, setBusySave ] = useState(false);
  const [ dragging, setDragging ] = useState(false);
  const [ uploading, setUploading ] = useState(false);
  const [ zoomed, setZoomed ] = useState(false);

  const maskRef = useRef(null);
  const canvasRef = useRef(null);
  const promptRef = useRef(null);
  const chain = useRef(Promise.resolve());
  const currentRef = useRef(null);
  useEffect(() => { currentRef.current = currentId; });

  const envIssue = hasAiEnvIssues(options, [], [], { includeFast: false });
  const imageEnvs = useMemo(() => (options?.ai_envs ?? []).filter(envHasImageModels), []);
  const modelsEnvId = settings.envId || options?.ai_images_default_env || options?.ai_default_env;
  const { imageModels, getModel, calculatePrice } = useModels(options, modelsEnvId);
  const defaultModel = options?.ai_images_default_model || '';
  const activeModelId = settings.model || defaultModel;
  const activeModel = getModel(activeModelId);
  const canEdit = !!activeModel && hasTag(activeModel, 'image-edit');

  const updateSettings = (patch) => setSettings(prev => ({ ...prev, ...patch }));

  useEffect(() => { saveJSON(SETTINGS_KEY, settings); }, [settings]);
  useEffect(() => { saveJSON(SOURCES_KEY, sources); }, [sources]);

  const refresh = useCallback(async () => {
    try {
      const media = await studio.listVersions();
      setVersions(media.map(toVersion));
    }
    catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }, []);

  const nodes = useMemo(() => {
    const map = new Map();
    const draftIds = new Set(versions.map(v => v.id));
    sources.forEach(s => map.set(s.id, { ...s, operation: 'source', isSource: true, parentId: null }));
    versions.forEach(v => {
      if (!v.parentId || draftIds.has(v.parentId) || !v.parentUrl) return;
      const known = map.get(v.parentId);
      map.set(v.parentId, {
        id: v.parentId, url: v.parentUrl, title: v.parentTitle, operation: 'source', isSource: true,
        parentId: null, createdAt: Math.min(known?.createdAt ?? Infinity, v.createdAt - 1)
      });
    });
    versions.forEach(v => map.set(v.id, v));
    return map;
  }, [versions, sources]);

  const threads = useMemo(() => {
    const rootOf = (id) => {
      let node = nodes.get(id);
      const seen = new Set();
      while (node?.parentId && nodes.has(node.parentId) && !seen.has(node.id)) {
        seen.add(node.id);
        node = nodes.get(node.parentId);
      }
      return node?.id;
    };
    const groups = new Map();
    nodes.forEach(node => {
      const root = rootOf(node.id);
      if (!groups.has(root)) groups.set(root, []);
      groups.get(root).push(node);
    });
    return [...groups.entries()].map(([rootId, items]) => {
      items.sort((a, b) => (a.createdAt - b.createdAt) || (a.id - b.id));
      return { rootId, root: nodes.get(rootId), items, updatedAt: Math.max(...items.map(i => i.createdAt)) };
    }).sort((a, b) => b.updatedAt - a.updatedAt);
  }, [nodes]);

  const current = currentId ? nodes.get(currentId) : null;
  const currentThread = threads.find(t => t.items.some(i => i.id === currentId));
  const versionIndex = (id) => currentThread ? currentThread.items.findIndex(i => i.id === id) : -1;
  const parent = current?.parentId ? nodes.get(current.parentId) : null;
  const effectiveMode = current ? mode : 'create';

  useEffect(() => {
    refresh();
    const editId = new URLSearchParams(window.location.search).get('editId');
    if (editId) {
      studio.fetchMedia(editId).then(addSource).catch(err => setError(err.message));
    }
  }, []);

  const didAutoSelect = useRef(false);
  useEffect(() => {
    if (didAutoSelect.current || loading || currentId) return;
    didAutoSelect.current = true;
    const latest = threads[0];
    if (latest) {
      setCurrentId(latest.items[latest.items.length - 1].id);
    }
  }, [loading, threads]);

  useEffect(() => {
    setMaskMode(false);
    setCompare(false);
    setHasMask(false);
    setMeta({
      title: current && !/^Untitled Image/i.test(current.title) ? current.title : '',
      alt: current?.alt || '',
      filename: current?.filename || ''
    });
  }, [currentId]);

  useEffect(() => {
    if (!jobs.length) return;
    const timer = setInterval(() => setNow(Date.now()), 1500);
    return () => clearInterval(timer);
  }, [jobs.length]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setBox({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [!!current]);

  const currentDims = current ? dims[current.id] : null;
  const fitted = useMemo(() => {
    if (!currentDims || !box) return null;
    const scale = Math.min(box.w / currentDims.w, box.h / currentDims.h);
    return { width: Math.round(currentDims.w * scale), height: Math.round(currentDims.h * scale) };
  }, [currentDims, box]);

  function addSource(media) {
    if (!media?.id) return;
    const id = Number(media.id);
    setSources(prev => {
      if (prev.some(s => s.id === id)) return prev;
      return [ { id, url: media.url, title: media.title, createdAt: Date.now() / 1000 }, ...prev ].slice(0, 50);
    });
    setMode('edit');
    setCurrentId(id);
  }

  const applyPreset = (preset) => {
    if (!preset) return;
    setPresetId(preset.id);
    updateSettings({
      envId: preset.envId || '', model: preset.model || '',
      resolution: preset.resolution || '', quality: preset.quality || ''
    });
    if (preset.prompt) {
      setPrompt(preset.prompt);
    }
  };

  const presetFrom = (base) => ({
    ...base,
    envId: settings.envId || '', model: settings.model || '',
    resolution: settings.resolution || '', quality: settings.quality || '',
    maxResults: 1, prompt: prompt.trim() || base.prompt || ''
  });

  const savePreset = async () => {
    await savePresetList(presets.map(p => p.id === presetId ? presetFrom(p) : p));
  };

  const savePresetAsNew = async () => {
    const name = presetModal?.name?.trim();
    if (!name) return;
    const id = `preset_${Date.now()}`;
    setPresetModal(null);
    const saved = await savePresetList([ ...presets, presetFrom({ id, name }) ]);
    if (saved) {
      setPresetId(id);
    }
  };

  const deletePreset = async () => {
    const saved = await savePresetList(presets.filter(p => p.id !== presetId));
    if (saved) {
      setPresetId('');
    }
  };

  const openLibrary = (upload = false) => {
    if (!window.wp?.media) {
      setError('The WordPress Media Library is not available on this page.');
      return;
    }
    const frame = window.wp.media({
      title: upload ? 'Upload a photo' : 'Choose an image',
      library: { type: 'image' },
      multiple: false,
      button: { text: 'Open in the Studio' }
    });
    if (upload) {
      frame.on('open', () => {
        try { frame.content.mode('upload'); }
        catch (e) { }
      });
    }
    frame.on('select', () => {
      const attachment = frame.state().get('selection').first().toJSON();
      addSource({ id: attachment.id, url: attachment.url, title: attachment.title });
    });
    frame.open();
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setDragging(false);
    const file = [...(e.dataTransfer?.files || [])].find(f => f.type.startsWith('image/'));
    if (!file) return;
    setUploading(true);
    try {
      addSource(await studio.uploadToLibrary(file));
    }
    catch (err) {
      setError(err.message);
    }
    setUploading(false);
  };

  const priceOf = (model, usage, resolution) => {
    if (!usage) return 0;
    if (typeof usage.price === 'number') return usage.price;
    const input = usage.input_tokens ?? usage.prompt_tokens ?? 0;
    const output = usage.output_tokens ?? usage.completion_tokens ?? 0;
    try {
      return calculatePrice(model, input, output, resolution || '1024x1024') || 0;
    }
    catch (e) {
      return 0;
    }
  };

  const pickResolution = (id) => {
    if (settings.resolution) return settings.resolution;
    const size = dims[id];
    const sizes = activeModel?.resolutions ?? [];
    if (!size || !sizes.length) return undefined;
    const ratio = size.w / size.h;
    const parse = (name) => {
      const [ w, h ] = String(name).split('x').map(Number);
      return w && h ? w / h : null;
    };
    return sizes.filter(r => parse(r.name))
      .sort((a, b) => Math.abs(parse(a.name) - ratio) - Math.abs(parse(b.name) - ratio))[0]?.name;
  };

  const runJob = async (job) => {
    setJobs(list => list.map(j => j.key === job.key ? { ...j, startedAt: Date.now() } : j));
    const started = Date.now();
    try {
      const { envId, model, quality } = job.settings;
      const res = job.operation === 'create'
        ? await studio.generateImage({ prompt: job.prompt, envId, model, resolution: job.resolution, quality })
        : await studio.editImage({ prompt: job.prompt, mediaId: job.parentId, mask: job.mask, envId, model,
          resolution: job.resolution, quality });
      const url = res?.data?.[0];
      if (!url) {
        throw new Error('The model did not return an image.');
      }
      const modelUsed = model || defaultModel;
      const cost = priceOf(modelUsed, res.usage, job.resolution);
      const saved = await studio.saveVersion({
        url, prompt: job.prompt, parentId: job.parentId, operation: job.operation, model: modelUsed, envId,
        parentTitle: job.parentTitle,
        latency: ((Date.now() - started) / 1000).toFixed(1)
      });
      const newId = Number(saved.attachmentId);
      setCosts(c => ({ ...c, [newId]: cost }));
      setSessionCost(total => total + cost);
      await refresh();
      if (job.selectOnDone || currentRef.current === job.anchorId) {
        setCurrentId(newId);
      }
    }
    catch (err) {
      setError(err.message);
      setPrompt(typed => typed.trim() ? typed : job.prompt);
    }
    setJobs(list => list.filter(j => j.key !== job.key));
  };

  const enqueue = (job) => {
    const full = { ...job, key: `${Date.now()}-${Math.random()}`, anchorId: currentRef.current, startedAt: null };
    setJobs(list => [...list, full]);
    chain.current = chain.current.then(() => runJob(full)).catch(() => {});
  };

  const submit = async (textOverride, operationOverride) => {
    const text = (textOverride ?? prompt).trim();
    if (!text) return;
    setError(null);
    const snapshot = { ...settings, envId: settings.envId || (settings.model ? modelsEnvId : '') };
    if (effectiveMode === 'create' && !operationOverride) {
      for (let i = 0; i <= count; i++) {
        enqueue({ operation: 'create', prompt: text, parentId: null, settings: snapshot,
          resolution: settings.resolution || undefined, selectOnDone: i === 0 });
      }
    }
    else {
      if (!canEdit) {
        setError(`${activeModel?.rawName || activeModelId || 'This model'} cannot edit images. Pick a model that can, like GPT Image.`);
        return;
      }
      const mask = !operationOverride && maskMode && hasMask ? await maskRef.current?.toBlob() : null;
      const operation = operationOverride || (mask ? 'inpaint' : 'edit');
      for (let i = 0; i < count; i++) {
        enqueue({ operation, prompt: text, parentId: current.id, parentTitle: current.title, mask,
          settings: snapshot, resolution: pickResolution(current.id), selectOnDone: i === 0 });
      }
      setMaskMode(false);
    }
    if (!textOverride) {
      setPrompt('');
      if (promptRef.current) promptRef.current.style.height = '';
    }
  };

  const startNew = () => {
    setCurrentId(null);
    setMode('create');
    setTimeout(() => promptRef.current?.focus(), 0);
  };

  const discard = async () => {
    const node = nodes.get(discardId);
    setDiscardId(null);
    if (!node) return;
    if (node.isSource) {
      setSources(prev => prev.filter(s => s.id !== node.id));
    }
    else {
      try {
        await studio.discardVersion(node.id);
      }
      catch (err) {
        setError(err.message);
        return;
      }
    }
    if (currentId === node.id) {
      setCurrentId(node.parentId && nodes.has(node.parentId) ? node.parentId : null);
    }
    refresh();
  };

  const fillMeta = async () => {
    setBusyMeta(true);
    try {
      const data = await studio.suggestMetadata(current.id);
      const ext = (current.filename.match(/\.[a-z0-9]+$/i) || [ '.png' ])[0];
      const base = data.filename ? studio.slugify(data.filename.replace(/\.[a-z0-9]+$/i, ''), 60) : '';
      setMeta({
        title: data.title || meta.title,
        alt: data.description || meta.alt,
        filename: base ? `${base}${ext}` : meta.filename
      });
    }
    catch (err) {
      setError(err.message);
    }
    setBusyMeta(false);
  };

  const saveCurrent = async () => {
    setBusySave(true);
    try {
      await studio.updateMetadata({ attachmentId: current.id, title: meta.title, alt: meta.alt,
        description: current.description, caption: '', filename: meta.filename });
      await studio.saveToLibrary(current.id);
      await refresh();
    }
    catch (err) {
      setError(err.message);
    }
    setBusySave(false);
  };

  useEffect(() => {
    const onKey = (e) => {
      const typing = [ 'INPUT', 'TEXTAREA', 'SELECT' ].includes(e.target.tagName) || e.target.isContentEditable;
      if (e.key === 'Escape') {
        setZoomed(false);
        setMaskMode(false);
        setCompare(false);
        return;
      }
      if (typing || !current) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && maskMode) {
        e.preventDefault();
        maskRef.current?.undo();
      }
      else if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }
      else if (e.key === 'b' && canEdit) {
        setCompare(false);
        setErasing(false);
        setMaskMode(m => !m);
      }
      else if (e.key === 'e' && maskMode) {
        setErasing(x => !x);
      }
      else if (e.key === 'c' && parent) {
        setMaskMode(false);
        setCompare(x => !x);
      }
      else if (e.key === '[') {
        setBrushSize(s => Math.max(8, s - 8));
      }
      else if (e.key === ']') {
        setBrushSize(s => Math.min(200, s + 8));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, canEdit, maskMode, parent]);

  const elapsed = (job) => job.startedAt ? `${Math.max(0, Math.round((now - job.startedAt) / 1000))}s` : 'queued';
  const threadJobs = currentThread ? jobs.filter(j => j.parentId && currentThread.items.some(i => i.id === j.parentId)) : [];
  const createJobs = jobs.filter(j => j.operation === 'create');
  const jobOnCurrent = jobs.find(j => j.parentId && j.parentId === currentId);
  const ideas = (presets || []).filter(t => t.prompt).slice(0, 6);

  const placeholder = effectiveMode === 'create'
    ? 'Describe the image you want to create…'
    : maskMode
      ? 'Describe what goes in the painted area…'
      : 'Describe a change: warmer light, no car…';

  const jsxComposer = (
    <div className="mwai-composer">
      {error && <div className="mwai-error">
        <span>{error}</span>
        <button type="button" onClick={() => setError(null)} title="Dismiss"><X size={14} /></button>
      </div>}
      {current && <div className="mwai-modes">
        <button type="button" className={effectiveMode === 'edit' ? 'on' : ''} disabled={!canEdit}
          onClick={() => setMode('edit')}>
          <Wand2 size={14} /> Edit this image
        </button>
        <button type="button" className={effectiveMode === 'create' ? 'on' : ''} onClick={startNew}>
          <Sparkles size={14} /> New image
        </button>
        {effectiveMode === 'edit' && maskMode && <span className="mwai-mode-hint">
          {hasMask ? 'Only the painted area will change' : 'Paint over the area to change'}
        </span>}
      </div>}
      <div className="mwai-input-row">
        <textarea ref={promptRef} rows={1} value={prompt} placeholder={placeholder}
          onChange={(e) => {
            setPrompt(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              submit();
            }
          }} />
        <select className="mwai-count" value={count} title="How many images to generate at once"
          onChange={(e) => setCount(Number(e.target.value))}>
          {[ 1, 2, 3, 4 ].map(n => <option key={n} value={n}>{n === 1 ? '1 image' : `${n} images`}</option>)}
        </select>
        <button type="button" className="mwai-send" disabled={!prompt.trim()} onClick={() => submit()}
          title="Generate (⌘ Enter)">
          <ArrowUp size={18} />
        </button>
      </div>
    </div>
  );

  const jsxStart = (
    <div className="mwai-start">
      {createJobs.length > 0 ? <div className="mwai-creating">
        <div className="mwai-creating-art"><Loader2 size={28} className="mwai-spin" /></div>
        <h1>Creating your image</h1>
        <p>{createJobs[0].prompt}</p>
        <span className="mwai-timer">{elapsed(createJobs[0])}</span>
      </div> : <>
        <h1>What are we making today?</h1>
        <p>Describe a new image, or bring a photo and refine it step by step until it looks exactly right.</p>
        <div className="mwai-start-cards">
          <button type="button" onClick={() => openLibrary(true)} disabled={uploading}>
            {uploading ? <Loader2 size={22} className="mwai-spin" /> : <Upload size={22} />}
            <b>Upload a photo</b>
            <span>Or drop it anywhere on this area</span>
          </button>
          <button type="button" onClick={() => openLibrary(false)}>
            <Images size={22} />
            <b>From the Media Library</b>
            <span>Improve an image you already have</span>
          </button>
        </div>
        {ideas.length > 0 && <div className="mwai-ideas">
          <span>Need an idea?</span>
          {ideas.map(t => <button type="button" key={t.id} onClick={() => {
            setMode('create');
            setPrompt(t.prompt);
            promptRef.current?.focus();
          }}>{t.name}</button>)}
        </div>}
      </>}
    </div>
  );

  const jsxStage = current && (<>
    <div className="mwai-toolbar">
      <span className="mwai-chip">v{versionIndex(current.id) + 1} · {OPERATION_LABELS[current.operation] || 'Edit'}</span>
      <ToolButton icon={Brush} label="Brush" shortcut="B" active={maskMode} disabled={!canEdit}
        onClick={() => { setCompare(false); setMaskMode(m => !m); }} />
      <ToolButton icon={SplitSquareHorizontal} label="Compare" shortcut="C" active={compare} disabled={!parent}
        onClick={() => { setMaskMode(false); setCompare(x => !x); }} />
      <ToolButton icon={Layers} label="Variations" disabled={!canEdit}
        onClick={() => submit(VARIATION_PROMPT, 'variation')} />
    </div>

    <div className="mwai-toolbar mwai-toolbar-right">
      <a className="mwai-tool" href={current.url} download title="Download this version">
        <Download size={16} />
      </a>
    </div>

    {maskMode && <div className="mwai-maskbar">
      <button type="button" className={!erasing ? 'on' : ''} onClick={() => setErasing(false)}><Brush size={14} /> Paint</button>
      <button type="button" className={erasing ? 'on' : ''} onClick={() => setErasing(true)}><Eraser size={14} /> Erase</button>
      <input type="range" min={8} max={200} value={brushSize} title={`Brush size ([ and ])`}
        onChange={(e) => setBrushSize(Number(e.target.value))} />
      <button type="button" onClick={() => maskRef.current?.undo()} title="Undo (⌘ Z)"><Undo2 size={14} /></button>
      <button type="button" onClick={() => maskRef.current?.clear()}>Clear</button>
    </div>}

    <div className="mwai-canvas" ref={canvasRef}>
      <div className="mwai-frame" style={fitted || { visibility: 'hidden' }}>
        <img key={current.id} src={current.url} alt={current.alt || ''} draggable={false}
          className={maskMode || compare ? '' : 'mwai-zoomable'}
          title={maskMode || compare ? undefined : 'Click to see it full size'}
          onClick={() => { if (!maskMode && !compare) setZoomed(true); }}
          onLoad={(e) => {
            const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
            setDims(d => d[current.id]?.w === w ? d : { ...d, [current.id]: { w, h } });
          }} />
        {compare && parent && <CompareOverlay before={parent.url} />}
        {maskMode && currentDims && <MaskCanvas ref={maskRef} naturalWidth={currentDims.w} naturalHeight={currentDims.h}
          brushSize={brushSize} erasing={erasing} onChange={setHasMask} />}
        {jobOnCurrent && <div className="mwai-working">
          <Loader2 size={14} className="mwai-spin" />
          <span>Working on it · {elapsed(jobOnCurrent)}</span>
        </div>}
      </div>
    </div>
  </>);

  const jsxVersions = currentThread && (
    <section>
      <h3>Versions</h3>
      <div className="mwai-versions">
        {currentThread.items.map((v, i) => {
          const parentIndex = v.parentId ? versionIndex(v.parentId) : -1;
          return (
            <div key={v.id} className={`mwai-version${v.id === currentId ? ' active' : ''}`}
              onClick={() => setCurrentId(v.id)}>
              <img src={v.url} alt="" loading="lazy" />
              <div className="mwai-version-text">
                <div className="mwai-version-head">
                  <b>v{i + 1}</b>
                  <span className={`mwai-badge op-${v.operation}`}>{OPERATION_LABELS[v.operation] || 'Edit'}</span>
                  {v.saved && <span className="mwai-badge saved"><Check size={10} /> Saved</span>}
                </div>
                <div className="mwai-version-prompt">{labelOf(v)}</div>
                <div className="mwai-version-meta">
                  {parentIndex >= 0 && parentIndex !== i - 1 && <span><GitBranch size={10} /> from v{parentIndex + 1}</span>}
                  {costs[v.id] > 0 && <span>${costs[v.id].toFixed(3)}</span>}
                  {v.createdAt > 0 && <span>{timeAgo(v.createdAt)}</span>}
                </div>
              </div>
              {(v.isSource ? sources.some(s => s.id === v.id) : !v.saved) && <button type="button" className="mwai-version-delete"
                title={v.isSource ? 'Remove from the Studio' : 'Discard this version'}
                onClick={(e) => { e.stopPropagation(); setDiscardId(v.id); }}>
                <Trash2 size={13} />
              </button>}
            </div>
          );
        })}
        {threadJobs.map(job => <div key={job.key} className="mwai-version pending">
          <div className="mwai-shimmer" />
          <div className="mwai-version-text">
            <div className="mwai-version-head">
              <b>{OPERATION_LABELS[job.operation]}</b>
              <span className="mwai-timer">{elapsed(job)}</span>
            </div>
            <div className="mwai-version-prompt">{job.prompt}</div>
          </div>
        </div>)}
      </div>
    </section>
  );

  const jsxSave = current && (
    <section>
      <h3>Media Library</h3>
      {current.isSource ? <p className="mwai-note">
        This is the original from your Media Library. Every edit becomes a new version, the original is never touched.
      </p> : current.saved ? <div className="mwai-saved">
        <Check size={16} />
        <span>Saved to your Media Library.</span>
        <a href={`post.php?post=${current.id}&action=edit`} target="_blank" rel="noreferrer">Open ↗</a>
      </div> : <div className="mwai-form">
        <label>Title</label>
        <NekoInput value={meta.title} onChange={(value) => setMeta(m => ({ ...m, title: value }))} />
        <label>Alt text</label>
        <NekoTextArea rows={2} value={meta.alt} onChange={(value) => setMeta(m => ({ ...m, alt: value }))} />
        <label>Filename</label>
        <NekoInput value={meta.filename} onChange={(value) => setMeta(m => ({ ...m, filename: value }))} />
        <div className="mwai-form-actions">
          <NekoButton className="secondary" icon="wand" busy={busyMeta} disabled={busySave} onClick={fillMeta}>
            Write with AI
          </NekoButton>
          <NekoButton className="primary" busy={busySave} disabled={busyMeta} onClick={saveCurrent}>
            Save
          </NekoButton>
        </div>
      </div>}
    </section>
  );

  const jsxPresets = (
    <section>
      <h3>Presets</h3>
      <div className="mwai-form">
        <NekoSelect scrolldown name="preset" value={presetId}
          onChange={(value) => applyPreset(presets.find(p => p.id === value))}>
          <NekoOption value="" label="Not using a preset" />
          {presets.map(p => <NekoOption key={p.id} value={p.id} label={p.name} />)}
        </NekoSelect>
        <div className="mwai-preset-actions">
          <button type="button" disabled={!presetId || savingPreset} onClick={savePreset}
            title="Update this preset with the current prompt and settings">Save</button>
          <button type="button" disabled={savingPreset}
            onClick={() => setPresetModal({ name: '' })}>Save as new</button>
          {presetId && presetId !== 'default' && <button type="button" className="danger" disabled={savingPreset}
            title="Delete this preset" onClick={deletePreset}>Delete</button>}
        </div>
        {presetError && <p className="mwai-note">{presetError}</p>}
      </div>
    </section>
  );

  const jsxSettings = (
    <section>
      <h3>Model</h3>
      <div className="mwai-form">
        {imageEnvs.length > 1 && <>
          <label>Environment</label>
          <NekoSelect scrolldown name="envId" value={settings.envId || ''}
            onChange={(value) => updateSettings({ envId: value, model: '', resolution: '', quality: '' })}>
            <NekoOption value="" label="Default" />
            {imageEnvs.map(env => <NekoOption key={env.id} value={env.id} label={env.name} />)}
          </NekoSelect>
        </>}
        <label>Model</label>
        <NekoSelect scrolldown name="model" value={settings.model || ''}
          onChange={(value) => updateSettings({ model: value, resolution: '', quality: '' })}>
          <NekoOption value="" label={`Default${getModel(defaultModel) ? ` (${getModel(defaultModel).rawName || defaultModel})` : ''}`} />
          {imageModels.map(m => <NekoOption key={m.model} value={m.model} label={m.rawName || m.model} />)}
        </NekoSelect>
        {activeModel?.resolutions?.length > 0 && <>
          <label>Size</label>
          <NekoSelect scrolldown name="resolution" value={settings.resolution || ''}
            onChange={(value) => updateSettings({ resolution: value })}>
            <NekoOption value="" label="Auto (matches the photo)" />
            {activeModel.resolutions.map(r => <NekoOption key={r.name} value={r.name} label={r.label} />)}
          </NekoSelect>
        </>}
        {activeModel?.qualities?.length > 0 && <>
          <label>Quality</label>
          <NekoSelect scrolldown name="quality" value={settings.quality || ''}
            onChange={(value) => updateSettings({ quality: value })}>
            <NekoOption value="" label="Default" />
            {activeModel.qualities.map(q => <NekoOption key={q.name} value={q.name} label={q.label} />)}
          </NekoSelect>
        </>}
        {activeModel && !canEdit && <p className="mwai-note">This model creates images but cannot edit them.</p>}
        {sessionCost > 0 && <p className="mwai-note">This session: <b>${sessionCost.toFixed(3)}</b> (estimate)</p>}
      </div>
    </section>
  );

  return (
    <NekoPage>
      <AdminPageFit />
      <AiNekoHeader title="Image Studio" />
      {envIssue && <div style={{ padding: '0 20px 12px' }}><AiEnvSetupMessage options={options} /></div>}
      <StyledStudio>
        <aside className="mwai-panel mwai-threads">
          <div className="mwai-panel-head">
            <span>Your images</span>
            <button type="button" className="mwai-icon-btn" title="Start something new" onClick={startNew}>
              <Plus size={16} />
            </button>
          </div>
          <div className="mwai-thread-list">
            {createJobs.map(job => <div key={job.key} className="mwai-thread pending">
              <div className="mwai-shimmer" />
              <span className="mwai-thread-text">
                <span className="mwai-thread-title">{job.prompt}</span>
                <span className="mwai-thread-meta">Creating · {elapsed(job)}</span>
              </span>
            </div>)}
            {threads.map(t => {
              const last = t.items[t.items.length - 1];
              const active = currentThread?.rootId === t.rootId;
              return (
                <button type="button" key={t.rootId} className={`mwai-thread${active ? ' active' : ''}`}
                  onClick={() => setCurrentId(last.id)}>
                  <img src={last.url} alt="" loading="lazy" />
                  <span className="mwai-thread-text">
                    <span className="mwai-thread-title">{labelOf(t.root)}</span>
                    <span className="mwai-thread-meta">
                      {t.items.length} {t.items.length > 1 ? 'versions' : 'version'} · {timeAgo(t.updatedAt)}
                    </span>
                  </span>
                </button>
              );
            })}
            {!loading && !threads.length && !createJobs.length && <p className="mwai-note">
              Your images and all their versions will be kept here.
            </p>}
          </div>
          <div className="mwai-thread-actions">
            <button type="button" onClick={() => openLibrary(true)}><Upload size={14} /> Upload</button>
            <button type="button" onClick={() => openLibrary(false)}><Images size={14} /> Library</button>
          </div>
        </aside>

        <main className={`mwai-stage${dragging ? ' dragging' : ''}${current ? '' : ' empty'}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={(e) => { if (e.currentTarget === e.target) setDragging(false); }}
          onDrop={onDrop}>
          {current ? jsxStage : jsxStart}
          {jsxComposer}
          {dragging && <div className="mwai-drop-hint"><Upload size={28} /> Drop the photo to start editing</div>}
        </main>

        <aside className="mwai-panel mwai-side">
          {jsxVersions}
          {jsxSave}
          {jsxSettings}
          {jsxPresets}
        </aside>

        {zoomed && current && <div className="mwai-lightbox" onClick={() => setZoomed(false)}>
          <img src={current.url} alt={current.alt || ''} />
          <button type="button" className="mwai-lightbox-close" title="Close (Esc)">
            <X size={18} />
          </button>
        </div>}
      </StyledStudio>

      <NekoModal isOpen={!!presetModal}
        onRequestClose={() => setPresetModal(null)}
        title="Save as a new preset"
        content={<>
          <p style={{ marginTop: 0 }}>The prompt, the model, the size and the quality are saved together.</p>
          <NekoInput value={presetModal?.name || ''} placeholder="Name, like Blog headers"
            onChange={(value) => setPresetModal({ name: value })} onEnter={savePresetAsNew} />
        </>}
        okButton={{ label: 'Save', disabled: !presetModal?.name?.trim(), onClick: savePresetAsNew }}
        cancelButton={{ onClick: () => setPresetModal(null) }}
      />

      <NekoModal isOpen={!!discardId}
        onRequestClose={() => setDiscardId(null)}
        title={nodes.get(discardId)?.isSource ? 'Remove from the Studio' : 'Discard this version'}
        content={<p style={{ margin: 0 }}>
          {nodes.get(discardId)?.isSource
            ? 'The photo stays in your Media Library, it only disappears from this list.'
            : 'The image file is deleted. Versions made from it stay in the history.'}
        </p>}
        okButton={{ label: nodes.get(discardId)?.isSource ? 'Remove' : 'Discard', className: 'danger', onClick: discard }}
        cancelButton={{ onClick: () => setDiscardId(null) }}
      />
    </NekoPage>
  );
};

export default ImageStudio;
```