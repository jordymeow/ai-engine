// Previous: 3.7.9
// Current: 3.8.1

```javascript
// React & Vendor Libs
const { useState, useEffect, useMemo, useRef } = wp.element;
import { Sparkles, ListOrdered, PenLine, Send, ArrowRight, ArrowUp, ArrowDown, Plus, Trash2, RefreshCw, Square,
  Check, Loader2, ExternalLink, Wand2, Layers, FileText } from 'lucide-react';

// NekoUI
import { NekoPage, NekoSelect, NekoOption, NekoTextArea, NekoInput, NekoButton, NekoModal } from '@neko-ui';
import { options } from '@app/settings';
import { useModels, AiEnvSetupMessage, hasAiEnvIssues } from '@app/helpers-admin';
import { OutputHandler } from '@app/helpers';
import { retrievePostTypes } from '@app/requests';
import { AiNekoHeader } from '@app/styles/CommonStyles';

import * as api from './api';
import * as imagesApi from '@app/screens/imageStudio/api';
import AdminPageFit from '@app/components/PageFit';
import { usePresets } from '@app/components/presets';
import StyledContentStudio from './StyledContentStudio';

const PROJECT_KEY = 'mwai_content_studio_project';
const SETTINGS_KEY = 'mwai_content_studio_settings';

const TONES = [ 'Friendly', 'Professional', 'Expert', 'Playful', 'Persuasive', 'Neutral' ];
const LENGTHS = {
  short: { label: 'Short', words: 600, sections: 4 },
  medium: { label: 'Medium', words: 1200, sections: 6 },
  long: { label: 'Long', words: 2000, sections: 8 }
};
const REWRITES = [
  { label: 'Shorter', instruction: 'Make it about 40% shorter, keep the key information.' },
  { label: 'Longer', instruction: 'Make it about 50% longer with more useful detail and examples.' },
  { label: 'Simpler', instruction: 'Use simpler words and shorter sentences, like explaining it to a beginner.' },
  { label: 'More engaging', instruction: 'Make it more vivid and engaging, with a stronger opening sentence.' }
];

const STEPS = [
  { key: 'brief', label: 'Brief', icon: Sparkles },
  { key: 'outline', label: 'Outline', icon: ListOrdered },
  { key: 'draft', label: 'Draft', icon: PenLine },
  { key: 'publish', label: 'Publish', icon: Send }
];

const EMPTY_PROJECT = {
  step: 'brief',
  brief: { topic: '', audience: '', tone: 'Friendly', length: 'medium', keywords: '', notes: '' },
  title: '',
  sections: [],
  excerpt: '',
  postType: 'post',
  featuredImage: null,
  createdPostId: null
};

const uid = () => Math.random().toString(36).slice(2, 9);

const LEGACY_TONES = {
  cheerful: 'Friendly', informal: 'Friendly', casual: 'Friendly', neutral: 'Neutral', professional: 'Professional',
  formal: 'Professional', authoritative: 'Expert', expert: 'Expert', humorous: 'Playful', sarcastic: 'Playful',
  persuasive: 'Persuasive', optimistic: 'Friendly'
};

const briefFromTemplate = (template) => {
  if (template.brief && typeof template.brief === 'object') {
    return { ...EMPTY_PROJECT.brief, ...template.brief };
  }
  const sectionsCount = parseInt(template.sectionsCount, 10) || 0;
  return {
    ...EMPTY_PROJECT.brief,
    topic: template.topic || '',
    notes: template.context || '',
    tone: LEGACY_TONES[String(template.writingTone || '').toLowerCase()] || EMPTY_PROJECT.brief.tone,
    length: !sectionsCount ? EMPTY_PROJECT.brief.length : sectionsCount < 4 ? 'short' : sectionsCount <= 6 ? 'medium' : 'long'
  };
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

const restoreProject = () => {
  const saved = loadJSON(PROJECT_KEY, null);
  if (!saved || typeof saved !== 'object') return EMPTY_PROJECT;
  return {
    ...EMPTY_PROJECT, ...saved,
    brief: { ...EMPTY_PROJECT.brief, ...(saved.brief || {}) },
    sections: (saved.sections || []).map(s => ({ ...s, status: s.content ? 'done' : 'idle', error: null }))
  };
};

const countWords = (text = '') => (text.trim().match(/\S+/g) || []).length;

const ContentStudio = () => {
  const [ project, setProject ] = useState(restoreProject);
  const [ settings, setSettings ] = useState(() => loadJSON(SETTINGS_KEY, { envId: '', model: '', language: '' }));
  const [ busy, setBusy ] = useState(null);
  const [ error, setError ] = useState(null);
  const [ activeId, setActiveId ] = useState(null);
  const [ rewriteText, setRewriteText ] = useState('');
  const [ editingId, setEditingId ] = useState(null);
  const [ postTypes, setPostTypes ] = useState([]);
  const [ sessionCost, setSessionCost ] = useState(0);
  const [ confirm, setConfirm ] = useState(null);
  const [ showModel, setShowModel ] = useState(false);
  const [ titleIdeas, setTitleIdeas ] = useState([]);
  const [ imagePrompt, setImagePrompt ] = useState('');
  const { presets: templates, save: saveTemplateList, saving: savingTemplate, error: templateError } = usePresets('contentGenerator');
  const [ templateId, setTemplateId ] = useState('');
  const [ templateModal, setTemplateModal ] = useState(null);
  const [ busyImage, setBusyImage ] = useState(false);

  const projectRef = useRef(project);
  useEffect(() => { projectRef.current = project; });
  const abortRef = useRef(null);
  const stopRef = useRef(false);

  const envs = options?.ai_envs || [];
  const envIssue = hasAiEnvIssues(options, [], [], { includeFast: false });
  const modelsEnvId = settings.envId || options?.ai_default_env;
  const { completionModels, getModel, calculatePrice } = useModels(options, modelsEnvId);
  const defaultModel = options?.ai_default_model || '';
  const modelId = settings.model || defaultModel;
  const requestEnvId = settings.envId || (settings.model ? modelsEnvId : '');

  const languages = useMemo(() => {
    const list = Object.entries(options?.languages || {}).map(([ value, label ]) => ({ value, label }));
    return list.length ? list : [ { value: 'en', label: 'English' } ];
  }, []);
  const [ storedLanguage ] = useState(() => {
    try { return window.localStorage.getItem('mwai_preferred_language'); }
    catch (e) { return null; }
  });
  const languageCode = settings.language || storedLanguage || (document.documentElement.lang || 'en').slice(0, 2);
  const language = (languages.find(l => l.value === languageCode) || languages[0]).label;

  useEffect(() => {
    const timer = setTimeout(() => saveJSON(PROJECT_KEY, project), 900);
    return () => clearTimeout(timer);
  }, [project]);

  useEffect(() => {
    retrievePostTypes().then(types => setPostTypes(types || [])).catch(() => setPostTypes([]));
  }, []);

  const updateSettings = (patch) => setSettings(prev => ({ ...prev, ...patch }));

  useEffect(() => { saveJSON(SETTINGS_KEY, settings); }, [settings]);

  const patchProject = (patch) => setProject(p => ({ ...p, ...(typeof patch === 'function' ? patch(p) : patch) }));
  const patchBrief = (patch) => setProject(p => ({ ...p, brief: { ...p.brief, ...patch } }));
  const patchSection = (id, patch) => setProject(p => ({
    ...p, sections: p.sections.map(s => s.id === id ? { ...s, ...patch } : s)
  }));

  const addCost = (usage) => {
    if (!usage) return;
    let cost = typeof usage.price === 'number' ? usage.price : 0;
    if (!cost) {
      try { cost = calculatePrice(modelId, usage.prompt_tokens || 0, usage.completion_tokens || 0) || 0; }
      catch (e) { cost = 0; }
    }
    setSessionCost(total => total + cost);
  };

  const request = (args) => api.complete({ envId: requestEnvId, model: settings.model, ...args });

  const { brief } = project;
  const length = LENGTHS[brief.length] || LENGTHS.medium;
  const sections = project.sections;
  const hasDraft = sections.some(s => s.content);
  const totalWords = sections.reduce((sum, s) => sum + countWords(s.content), 0);
  const writtenCount = sections.filter(s => s.content).length;

  // Outline
  const planOutline = async () => {
    setError(null);
    setBusy('outline');
    try {
      const message = [
        'Plan a web article.',
        `Topic: ${brief.topic}`,
        `Audience: ${brief.audience || 'general readers'}`,
        `Tone: ${brief.tone}`,
        `Language: ${language}`,
        `Target length: about ${length.words} words, in ${length.sections} sections.`,
        brief.keywords ? `Keywords to cover naturally: ${brief.keywords}` : '',
        brief.notes ? `Notes from the author: ${brief.notes}` : '',
        '',
        'Reply with JSON only, no code fence, in this exact shape:',
        '{"title": "A catchy article title", "sections": [{"heading": "Section heading", "points": ["key point", "key point"]}]}',
        `Write the title, headings and points in ${language}. The first section opens the article, the last one wraps it up.`
      ].filter(line => line !== '').join('\n');
      const { text, usage } = await request({
        instructions: 'You are an experienced editor who plans clear, useful web articles. '
          + 'Do not use em dashes: prefer commas, colons or separate sentences, they read more human.',
        message
      });
      addCost(usage);
      const data = api.parseJSON(text);
      if (!data?.sections?.length) {
        throw new Error('The model did not return a usable outline. Try again, or pick another model.');
      }
      setProject(p => ({
        ...p, step: 'outline', createdPostId: null,
        title: data.title || p.brief.topic,
        sections: data.sections.map(s => ({
          id: uid(), heading: String(s.heading || '').trim(),
          points: (Array.isArray(s.points) ? s.points : []).join('\n'), content: '', status: 'idle'
        }))
      }));
    }
    catch (err) {
      setError(err.message);
    }
    setBusy(null);
  };

  const askPlanOutline = () => {
    if (hasDraft) {
      setConfirm({
        title: 'Replace the outline?',
        text: 'A new outline starts a new draft: the sections already written will be replaced.',
        label: 'Replace', onOk: planOutline
      });
    }
    else {
      planOutline();
    }
  };

  // Writing
  const outlineText = (list) => list.map((s, i) => {
    const points = (s.points || '').split('\n').map(x => x.trim()).filter(Boolean);
    return `${i + 1}. ${s.heading}${points.length ? `: ${points.join('; ')}` : ''}`;
  }).join('\n');

  const writerInstructions = `You write web articles in ${language}. Use Markdown: paragraphs, and lists or ### subheadings only when they really help. Never repeat the section heading, never add a preamble or comment on what you wrote. Do not use em dashes: prefer commas, colons or separate sentences, they read more human.`;

  const writeSection = async (id, signal) => {
    const current = projectRef.current;
    const index = current.sections.findIndex(s => s.id === id);
    const section = current.sections[index];
    if (!section) return;
    const previous = current.sections[index - 1]?.content?.trim();
    const count = current.sections.length;
    const points = (section.points || '').split('\n').map(x => x.trim()).filter(Boolean);
    const message = [
      `Article title: ${current.title}`,
      `Audience: ${current.brief.audience || 'general readers'}. Tone: ${current.brief.tone}.`,
      current.brief.keywords ? `Keywords to use naturally where they fit: ${current.brief.keywords}` : '',
      'Full outline:',
      outlineText(current.sections),
      '',
      `Write section ${index + 1} of ${count}: "${section.heading}".`,
      points.length ? `Cover: ${points.join('; ')}.` : '',
      `About ${Math.max(80, Math.round(length.words / count))} words.`,
      index === 0 ? 'This section opens the article: start with a hook.' : '',
      index === count - 1 ? 'This is the last section: end with a clear takeaway.' : '',
      previous ? `The previous section ended with: "${previous.slice(-400)}"` : ''
    ].filter(line => line !== '').join('\n');
    const original = section.content || '';
    setActiveId(id);
    patchSection(id, { status: 'writing', content: '', error: null });
    try {
      const { text, usage } = await request({
        instructions: writerInstructions, message, stream: true, signal,
        onStream: (content) => patchSection(id, { content })
      });
      addCost(usage);
      patchSection(id, { status: 'done', content: text });
    }
    catch (err) {
      const stopped = err.name === 'AbortError';
      patchSection(id, { content: original, status: original ? 'done' : 'idle',
        error: stopped ? null : err.message });
      if (!stopped) setError(err.message);
      throw err;
    }
  };

  const writeArticle = async (onlyMissing = true) => {
    setError(null);
    patchProject({ step: 'draft' });
    const controller = new AbortController();
    abortRef.current = controller;
    stopRef.current = false;
    setBusy('draft');
    const ids = projectRef.current.sections.filter(s => !onlyMissing || !s.content).map(s => s.id);
    setProject(p => ({ ...p, sections: p.sections.map(s => ids.includes(s.id) ? { ...s, status: 'queued' } : s) }));
    for (const id of ids) {
      if (stopRef.current) break;
      try {
        await writeSection(id, controller.signal);
      }
      catch (err) {
        break;
      }
    }
    setProject(p => ({ ...p, sections: p.sections.map(s => s.status === 'queued' ? { ...s, status: s.content ? 'done' : 'idle' } : s) }));
    setBusy(null);
  };

  const rewriteSection = async (id, instruction) => {
    const section = projectRef.current.sections.find(s => s.id === id);
    if (!section?.content || !instruction) return;
    setError(null);
    const controller = new AbortController();
    abortRef.current = controller;
    setBusy(`rewrite-${id}`);
    const original = section.content;
    setActiveId(id);
    patchSection(id, { status: 'writing' });
    try {
      const { text, usage } = await request({
        instructions: writerInstructions,
        message: `Rewrite this section of the article "${projectRef.current.title}" (heading: "${section.heading}").\nInstruction: ${instruction}\nKeep the same language and Markdown. Return only the new section text.\n\n${original}`,
        stream: true, signal: controller.signal,
        onStream: (content) => patchSection(id, { content })
      });
      addCost(usage);
      patchSection(id, { status: 'done', content: text, previous: original });
      setRewriteText('');
    }
    catch (err) {
      patchSection(id, { status: 'done', content: original });
      if (err.name !== 'AbortError') setError(err.message);
    }
    setBusy(null);
  };

  const stop = () => {
    stopRef.current = true;
    abortRef.current?.abort();
  };

  // Publish
  const writeExcerpt = async () => {
    setError(null);
    setBusy('excerpt');
    try {
      const body = sections.map(s => `## ${s.heading}\n${s.content}`).join('\n\n').slice(0, 6000);
      const { text, usage } = await request({
        instructions: `You write concise meta descriptions in ${language}.`,
        message: `Write an excerpt for this article that also works as its SEO meta description: 140 to 160 characters, plain text, no quotes, makes people want to read it, no em dashes.\n\nTitle: ${project.title}\n\n${body}`
      });
      addCost(usage);
      patchProject({ excerpt: text.trim().replace(/^["']|["']$/g, '') });
    }
    catch (err) {
      setError(err.message);
    }
    setBusy(null);
  };

  const suggestTitles = async () => {
    setError(null);
    setBusy('titles');
    try {
      const { text, usage } = await request({
        instructions: `You write headlines for web articles in ${language}.`,
        message: `Give 5 alternative titles for this article. Each under 65 characters, each with a different angle: clear, curious, benefit, how-to, question. No quotes around them, no em dashes.\nReply with JSON only: {"titles": ["...", "..."]}\n\nCurrent title: ${project.title}\nTopic: ${brief.topic}\nOutline:\n${outlineText(sections)}`
      });
      addCost(usage);
      const data = api.parseJSON(text);
      if (!data?.titles?.length) {
        throw new Error('No titles came back. Try again, or pick another model.');
      }
      setTitleIdeas(data.titles.slice(0, 4));
    }
    catch (err) {
      setError(err.message);
    }
    setBusy(null);
  };

  const defaultImagePrompt = `Editorial illustration for an article titled "${project.title}". ${project.excerpt || brief.topic}. Modern, clean, no text in the image.`;

  const generateFeatured = async () => {
    setError(null);
    setBusyImage(true);
    try {
      const prompt = (imagePrompt || defaultImagePrompt).trim();
      const res = await imagesApi.generateImage({ prompt });
      const url = res?.data?.[0];
      if (!url) {
        throw new Error('The model did not return an image.');
      }
      const saved = await imagesApi.saveVersion({
        url, prompt, operation: 'featured',
        model: options?.ai_images_default_model, envId: options?.ai_images_default_env
      });
      await imagesApi.saveToLibrary(saved.attachmentId, false);
      patchProject({ featuredImage: { id: Number(saved.attachmentId), url } });
    }
    catch (err) {
      setError(err.message);
    }
    setBusyImage(false);
  };

  const pickFeatured = () => {
    if (!window.wp?.media) {
      setError('The WordPress Media Library is not available on this page.');
      return;
    }
    const frame = window.wp.media({
      title: 'Choose a featured image', library: { type: 'image' }, multiple: false,
      button: { text: 'Use this image' }
    });
    frame.on('select', () => {
      const attachment = frame.state().get('selection').first().toJSON();
      patchProject({ featuredImage: { id: attachment.id, url: attachment.url } });
    });
    frame.open();
  };

  const createPost = async () => {
    setError(null);
    setBusy('publish');
    try {
      const content = sections.filter(s => s.content?.trim())
        .map(s => `## ${s.heading}\n\n${s.content.trim()}`).join('\n\n');
      const res = await api.createDraft({
        title: project.title, content, excerpt: project.excerpt, postType: project.postType || 'post',
        featuredImageId: project.featuredImage?.id
      });
      patchProject({ createdPostId: res.postId });
    }
    catch (err) {
      setError(err.message);
    }
    setBusy(null);
  };

  const startOver = () => setConfirm({
    title: 'Start a new article?',
    text: 'The current brief, outline and draft are cleared from this browser. Posts you already created stay in WordPress.',
    label: 'Start over',
    onOk: () => { setProject(EMPTY_PROJECT); setActiveId(null); setEditingId(null); }
  });

  // Outline editing
  const moveSection = (index, delta) => setProject(p => {
    const list = [ ...p.sections ];
    const target = index + delta;
    if (target < 0 || target > list.length) return p;
    [ list[index], list[target] ] = [ list[target], list[index] ];
    return { ...p, sections: list };
  });

  const canGo = (key) => {
    if (key === 'brief') return true;
    if (key === 'outline' || key === 'draft') return sections.length >= 0;
    if (key === 'publish') return hasDraft;
    return false;
  };

  const isBusy = !!busy || busyImage;

  const jsxStepper = (
    <div className="mwai-cs-stepper">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const index = STEPS.findIndex(s => s.key === project.step);
        const state = step.key === project.step ? 'current' : i < index ? 'done' : '';
        return (
          <button type="button" key={step.key} className={`mwai-cs-step ${state}`}
            disabled={!canGo(step.key) || isBusy} onClick={() => patchProject({ step: step.key })}>
            <span className="mwai-cs-step-dot">{state === 'done' ? <Check size={13} /> : <Icon size={13} />}</span>
            {step.label}
          </button>
        );
      })}
      <div className="mwai-cs-stepper-meta">
        {totalWords > 0 && <span>{totalWords.toLocaleString()} words · {Math.max(1, Math.round(totalWords / 230))} min read</span>}
        {sessionCost > 0 && <span>${sessionCost.toFixed(sessionCost < 0.01 ? 4 : 3)}</span>}
        <button type="button" className="mwai-cs-link" disabled={isBusy} onClick={startOver}>New article</button>
      </div>
    </div>
  );

  const jsxModel = (
    <div className="mwai-cs-model">
      <button type="button" className="mwai-cs-link" onClick={() => setShowModel(x => !x)}>
        {showModel ? 'Hide' : 'Model and language'}: {getModel(modelId)?.rawName || modelId || 'Default'} · {language}
      </button>
      {showModel && <div className="mwai-cs-fields">
        {envs.length > 1 && <>
          <label>Environment</label>
          <NekoSelect scrolldown name="envId" value={settings.envId || ''}
            onChange={(value) => updateSettings({ envId: value, model: '' })}>
            <NekoOption value="" label="Default" />
            {envs.map(env => <NekoOption key={env.id} value={env.id} label={env.name} />)}
          </NekoSelect>
        </>}
        <label>Model</label>
        <NekoSelect scrolldown name="model" value={settings.model || ''} onChange={(value) => updateSettings({ model: value })}>
          <NekoOption value="" label={`Default${getModel(defaultModel) ? ` (${getModel(defaultModel).rawName})` : ''}`} />
          {completionModels.map(m => <NekoOption key={m.model} value={m.model} label={m.rawName || m.model} />)}
        </NekoSelect>
        <label>Language</label>
        <NekoSelect scrolldown name="language" value={languageCode} onChange={(value) => {
          updateSettings({ language: value });
          try { window.localStorage.setItem('mwai_preferred_language', value); }
          catch (e) { }
        }}>
          {languages.map(l => <NekoOption key={l.value} value={l.value} label={l.label} />)}
        </NekoSelect>
      </div>}
    </div>
  );

  const applyTemplate = (template) => {
    if (!template) {
      setTemplateId('');
      return;
    }
    setTemplateId(template.id);
    patchBrief(briefFromTemplate(template));
    const next = {};
    if (template.language) next.language = template.language;
    if (template.envId) {
      next.envId = template.envId;
      next.model = template.model || '';
    }
    if (Object.keys(next).length) updateSettings(next);
  };

  const templateFrom = (base) => ({
    ...base,
    mode: base.mode || 'single',
    brief: { ...brief },
    topic: brief.topic, context: brief.notes, language: languageCode,
    envId: settings.envId || '', model: settings.model || base.model || defaultModel
  });

  const saveTemplate = async () => {
    await saveTemplateList(templates.map(t => t.id === templateId ? templateFrom(t) : t));
  };

  const saveTemplateAsNew = async () => {
    const name = templateModal?.name?.trim();
    if (!name) return;
    const id = `template_${Date.now()}`;
    setTemplateModal(null);
    const saved = await saveTemplateList([ ...templates, templateFrom({ id, name }) ]);
    if (saved) setTemplateId(id);
  };

  const deleteTemplate = () => {
    const template = templates.find(t => t.id === templateId);
    setConfirm({
      title: 'Delete this template?',
      text: `The template "${template?.name ?? ''}" is removed here and in the classic generator. The brief you see stays as it is.`,
      label: 'Delete',
      onOk: async () => {
        const saved = await saveTemplateList(templates.filter(t => t.id !== templateId));
        if (saved) setTemplateId('');
      }
    });
  };

  const jsxTemplates = (
    <div className="mwai-cs-templates">
      <label>Template</label>
      <NekoSelect scrolldown name="template" value={templateId}
        onChange={(value) => applyTemplate(templates.find(t => t.id === value))}>
        <NekoOption value="" label="Not using a template" />
        {templates.map(t => <NekoOption key={t.id} value={t.id} label={t.name} />)}
      </NekoSelect>
      <div className="mwai-cs-template-actions">
        <button type="button" disabled={!templateId || savingTemplate} onClick={saveTemplate}
          title="Update this template with the current brief, model and language">Save</button>
        <button type="button" disabled={savingTemplate || !brief.topic.trim()}
          onClick={() => setTemplateModal({ name: '' })}>Save as new</button>
        {templateId && templateId !== 'default' && <button type="button" className="danger"
          disabled={savingTemplate} title="Delete this template" onClick={deleteTemplate}>Delete</button>}
      </div>
      {templateError && <p className="mwai-cs-muted">{templateError}</p>}
    </div>
  );

  const jsxBrief = (
    <div className="mwai-cs-panel-body">
      <h2>What should we write?</h2>
      <p className="mwai-cs-muted">Describe the article. An outline comes first, you can reshape it before a single paragraph is written.</p>
      {jsxTemplates}
      <label>Topic</label>
      <NekoTextArea rows={4} value={brief.topic} onChange={(value) => patchBrief({ topic: value })}
        placeholder="How to prepare your garden for winter, with a checklist for the last weekend of autumn" />
      <label>Audience</label>
      <NekoInput value={brief.audience} onChange={(value) => patchBrief({ audience: value })}
        placeholder="Beginner gardeners with a small backyard" />
      <label>Tone</label>
      <div className="mwai-cs-chips">
        {TONES.map(tone => <button type="button" key={tone} className={brief.tone === tone ? 'on' : ''}
          onClick={() => patchBrief({ tone })}>{tone}</button>)}
      </div>
      <label>Length</label>
      <div className="mwai-cs-chips">
        {Object.entries(LENGTHS).map(([ key, l ]) => <button type="button" key={key} className={brief.length === key ? 'on' : ''}
          onClick={() => patchBrief({ length: key })}>{l.label} <span>~{l.words} words</span></button>)}
      </div>
      <label>Keywords <span className="mwai-cs-optional">optional</span></label>
      <NekoInput value={brief.keywords} onChange={(value) => patchBrief({ keywords: value })}
        placeholder="winter garden, mulch, frost protection" />
      <label>Notes for the writer <span className="mwai-cs-optional">optional</span></label>
      <NekoTextArea rows={3} value={brief.notes} onChange={(value) => patchBrief({ notes: value })}
        placeholder="Mention our free compost guide. Avoid chemical products." />
      {jsxModel}
      <div className="mwai-cs-actions">
        <NekoButton className="primary" disabled={!brief.topic.trim()} busy={busy === 'outline'} onClick={askPlanOutline}>
          {sections.length ? 'Plan a new outline' : 'Plan the outline'} <ArrowRight size={14} style={{ marginLeft: 6 }} />
        </NekoButton>
      </div>
      <p className="mwai-cs-footnote">
        Prefer the older screen? The <a href="?page=mwai_content_generator&classic=1">classic
        generator</a> is still here, with bulk generation from a list of topics.
      </p>
    </div>
  );

  const jsxOutline = (
    <div className="mwai-cs-panel-body">
      <h2>Shape the outline</h2>
      <p className="mwai-cs-muted">Rename, reorder, add or remove sections. Key points guide the writer, one per line.</p>
      <label>Title</label>
      <NekoInput value={project.title} onChange={(value) => patchProject({ title: value })} />
      <div className="mwai-cs-outline">
        {sections.map((s, i) => (
          <div key={s.id} className="mwai-cs-outline-item">
            <div className="mwai-cs-outline-head">
              <span className="mwai-cs-num">{i + 1}</span>
              <input value={s.heading} placeholder="Section heading"
                onChange={(e) => patchSection(s.id, { heading: e.target.value })} />
              <button type="button" title="Move up" disabled={i === 0} onClick={() => moveSection(i, -1)}><ArrowUp size={13} /></button>
              <button type="button" title="Move down" disabled={i === sections.length - 1} onClick={() => moveSection(i, 1)}><ArrowDown size={13} /></button>
              <button type="button" title="Remove" onClick={() => patchProject(p => ({ sections: p.sections.filter(x => x.id !== s.id) }))}>
                <Trash2 size={13} />
              </button>
            </div>
            <textarea rows={Math.max(2, (s.points || '').split('\n').length)} value={s.points} placeholder="Key points, one per line"
              onChange={(e) => patchSection(s.id, { points: e.target.value })} />
            {s.content && <span className="mwai-cs-written"><Check size={11} /> written</span>}
          </div>
        ))}
        <button type="button" className="mwai-cs-add" onClick={() => patchProject(p => ({
          sections: [ ...p.sections, { id: uid(), heading: '', points: '', content: '', status: 'idle' } ]
        }))}>
          <Plus size={14} /> Add a section
        </button>
      </div>
      <div className="mwai-cs-actions">
        <NekoButton className="secondary" disabled={isBusy} busy={busy === 'outline'} onClick={askPlanOutline}>
          <RefreshCw size={13} style={{ marginRight: 6 }} /> New outline
        </NekoButton>
        <NekoButton className="primary" disabled={!sections.length || isBusy} onClick={() => writeArticle(true)}>
          {hasDraft ? 'Write the missing sections' : 'Write the article'} <ArrowRight size={14} style={{ marginLeft: 6 }} />
        </NekoButton>
      </div>
    </div>
  );

  const jsxDraft = (
    <div className="mwai-cs-panel-body">
      <h2>Draft</h2>
      <p className="mwai-cs-muted">{busy === 'draft'
        ? `Writing section ${Math.min(writtenCount + 1, sections.length)} of ${sections.length}…`
        : writtenCount === 0
          ? `Nothing written yet. Pick a section to write it, or use Write missing for all of them.`
          : `${writtenCount} of ${sections.length} sections written. Pick one to rewrite or edit it.`}</p>
      <div className="mwai-cs-draft-list">
        {sections.map((s, i) => {
          const open = activeId === s.id;
          return (
            <div key={s.id} className={`mwai-cs-draft-item${open ? ' open' : ''}`}>
              <button type="button" className="mwai-cs-draft-head" onClick={() => setActiveId(open ? null : s.id)}>
                <span className={`mwai-cs-status ${s.status}`}>
                  {s.status === 'writing' ? <Loader2 size={12} className="mwai-cs-spin" /> : s.content ? <Check size={12} /> : i + 1}
                </span>
                <span className="mwai-cs-draft-title">{s.heading || 'Untitled section'}</span>
                <span className="mwai-cs-muted">{s.status === 'queued' ? 'queued' : s.content ? `${countWords(s.content)} w` : ''}</span>
              </button>
              {open && <div className="mwai-cs-draft-tools">
                {s.error && <div className="mwai-cs-error">{s.error}</div>}
                <div className="mwai-cs-chips small">
                  {REWRITES.map(r => <button type="button" key={r.label} disabled={isBusy || !s.content}
                    onClick={() => rewriteSection(s.id, r.instruction)}>{r.label}</button>)}
                </div>
                <div className="mwai-cs-rewrite">
                  <input value={rewriteText} disabled={isBusy || !s.content}
                    placeholder="Or tell it what to change…"
                    onChange={(e) => setRewriteText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') rewriteSection(s.id, rewriteText.trim()); }} />
                  <button type="button" disabled={isBusy || !rewriteText.trim() || !s.content} title="Rewrite"
                    onClick={() => rewriteSection(s.id, rewriteText.trim())}><Wand2 size={14} /></button>
                </div>
                <div className="mwai-cs-row">
                  <button type="button" className="mwai-cs-link" disabled={isBusy}
                    onClick={async () => {
                      const controller = new AbortController();
                      abortRef.current = controller;
                      setBusy(`rewrite-${s.id}`);
                      try { await writeSection(s.id, controller.signal); }
                      catch (e) { }
                      setBusy(null);
                    }}>
                    <RefreshCw size={12} /> {s.content ? 'Write it again' : 'Write this section'}
                  </button>
                  {s.previous && <button type="button" className="mwai-cs-link" disabled={isBusy}
                    onClick={() => patchSection(s.id, { content: s.previous, previous: s.content })}>
                    Undo last rewrite
                  </button>}
                  {s.content && <button type="button" className="mwai-cs-link" disabled={isBusy}
                    onClick={() => setEditingId(editingId === s.id ? null : s.id)}>
                    <FileText size={12} /> {editingId === s.id ? 'Done editing' : 'Edit by hand'}
                  </button>}
                </div>
                {editingId === s.id && <NekoTextArea rows={10} value={s.content}
                  onChange={(value) => patchSection(s.id, { content: value })} />}
              </div>}
            </div>
          );
        })}
      </div>
      <div className="mwai-cs-actions">
        {busy === 'draft' || (busy || '').startsWith('rewrite-')
          ? <NekoButton className="secondary" onClick={stop}><Square size={12} style={{ marginRight: 6 }} /> Stop</NekoButton>
          : <NekoButton className="secondary" disabled={writtenCount === sections.length} onClick={() => writeArticle(true)}>
            <Layers size={13} style={{ marginRight: 6 }} /> Write missing
          </NekoButton>}
        <NekoButton className="primary" disabled={!hasDraft || isBusy} onClick={() => patchProject({ step: 'publish' })}>
          Publish <ArrowRight size={14} style={{ marginLeft: 6 }} />
        </NekoButton>
      </div>
    </div>
  );

  const jsxPublish = (
    <div className="mwai-cs-panel-body">
      <h2>Publish</h2>
      {project.createdPostId ? <div className="mwai-cs-success">
        <Check size={20} />
        <div>
          <b>Your draft is in WordPress.</b>
          <span>Review it in the editor, add images and publish when ready.</span>
          <div className="mwai-cs-row">
            <a className="mwai-cs-link" href={`post.php?post=${project.createdPostId}&action=edit`} target="_blank" rel="noreferrer">
              Open the draft <ExternalLink size={12} />
            </a>
            <button type="button" className="mwai-cs-link" onClick={startOver}>Write another article</button>
          </div>
        </div>
      </div> : <>
        <p className="mwai-cs-muted">The article becomes a draft in WordPress, nothing is published.</p>
        <label>Title</label>
        <NekoInput value={project.title} onChange={(value) => patchProject({ title: value })} />
        <div className="mwai-cs-row">
          <button type="button" className="mwai-cs-link" disabled={isBusy} onClick={suggestTitles}>
            {busy === 'titles' ? <Loader2 size={12} className="mwai-cs-spin" /> : <Sparkles size={12} />} Suggest other titles
          </button>
        </div>
        {titleIdeas.length > 0 && <div className="mwai-cs-chips small titles">
          {titleIdeas.map((idea, i) => <button type="button" key={i}
            onClick={() => { patchProject({ title: idea }); setTitleIdeas([]); }}>{idea}</button>)}
        </div>}
        <label>Featured image <span className="mwai-cs-optional">optional</span></label>
        {project.featuredImage ? <div className="mwai-cs-featured">
          <img src={project.featuredImage.url} alt="" />
          <div>
            <span className="mwai-cs-muted">Set as the featured image of the draft.</span>
            <div className="mwai-cs-row">
              <button type="button" className="mwai-cs-link" onClick={() => patchProject({ featuredImage: null })}>Remove</button>
              <button type="button" className="mwai-cs-link" onClick={pickFeatured}>Choose another</button>
            </div>
          </div>
        </div> : <div className="mwai-cs-featured empty">
          <NekoTextArea rows={2} value={imagePrompt} placeholder={defaultImagePrompt}
            onChange={(value) => setImagePrompt(value)} />
          <div className="mwai-cs-row">
            <NekoButton className="secondary" busy={busyImage} disabled={isBusy} onClick={generateFeatured}>
              Generate an image
            </NekoButton>
            <button type="button" className="mwai-cs-link" disabled={busyImage} onClick={pickFeatured}>
              Choose from the Media Library
            </button>
          </div>
        </div>}
        <label>
          Excerpt <span className="mwai-cs-optional">{project.excerpt.length} characters</span>
        </label>
        <NekoTextArea rows={4} value={project.excerpt} onChange={(value) => patchProject({ excerpt: value })}
          placeholder="A short summary, also used by search engines." />
        <div className="mwai-cs-row">
          <button type="button" className="mwai-cs-link" disabled={isBusy} onClick={writeExcerpt}>
            {busy === 'excerpt' ? <Loader2 size={12} className="mwai-cs-spin" /> : <Wand2 size={12} />} Write it with AI
          </button>
        </div>
        {postTypes.length > 0 && <>
          <label>Post type</label>
          <NekoSelect scrolldown name="postType" value={project.postType || 'post'}
            onChange={(value) => patchProject({ postType: value })}>
            {postTypes.map(t => <NekoOption key={t.type} value={t.type} label={t.name} />)}
          </NekoSelect>
        </>}
        <div className="mwai-cs-actions">
          <span className="mwai-cs-muted">{totalWords.toLocaleString()} words, {writtenCount} sections</span>
          <NekoButton className="primary" busy={busy === 'publish'} disabled={!project.title.trim() || isBusy} onClick={createPost}>
            Create the draft
          </NekoButton>
        </div>
      </>}
    </div>
  );

  const panels = { brief: jsxBrief, outline: jsxOutline, draft: jsxDraft, publish: jsxPublish };

  const jsxPreview = (
    <div className="mwai-cs-preview">
      <article className="mwai-cs-paper">
        {!sections.length && busy !== 'outline' && <div className="mwai-cs-empty">
          <PenLine size={28} />
          <b>Your article will take shape here</b>
          <span>First the outline, then every section as it is written.</span>
        </div>}
        {busy === 'outline' && <div className="mwai-cs-empty">
          <Loader2 size={28} className="mwai-cs-spin" />
          <b>Planning the outline</b>
          <span>{brief.topic}</span>
        </div>}
        {sections.length > 0 && busy !== 'outline' && <>
          <h1>{project.title || 'Untitled article'}</h1>
          {project.excerpt && <p className="mwai-cs-lede">{project.excerpt}</p>}
          {sections.map(s => (
            <section key={s.id} className={`mwai-cs-section ${s.status}${activeId === s.id ? ' active' : ''}`}
              onClick={() => { if (project.step === 'draft') setActiveId(s.id); }}>
              <h2>{s.heading || 'Untitled section'}</h2>
              {s.content
                ? <OutputHandler content={s.content} isStreaming={s.status === 'writing'} />
                : <div className="mwai-cs-placeholder">
                  {(s.points || '').split('\n').filter(Boolean).map((p, i) => <span key={i}>{p}</span>)}
                  {s.status === 'queued' && <em>Waiting for its turn</em>}
                  {s.status === 'writing' && <em><Loader2 size={12} className="mwai-cs-spin" /> Writing</em>}
                </div>}
            </section>
          ))}
        </>}
      </article>
    </div>
  );

  return (
    <NekoPage>
      <AdminPageFit />
      <AiNekoHeader title="Content Studio" />
      {envIssue && <div style={{ padding: '0 20px 12px' }}><AiEnvSetupMessage options={options} /></div>}
      <StyledContentStudio>
        {jsxStepper}
        <div className="mwai-cs-body">
          <aside className="mwai-cs-panel">
            {error && <div className="mwai-cs-error top">
              <span>{error}</span>
              <button type="button" onClick={() => setError(null)}>×</button>
            </div>}
            {panels[project.step] || jsxBrief}
          </aside>
          {jsxPreview}
        </div>
      </StyledContentStudio>

      <NekoModal isOpen={!!confirm}
        onRequestClose={() => setConfirm(null)}
        title={confirm?.title}
        content={<p style={{ margin: 0 }}>{confirm?.text}</p>}
        okButton={{ label: confirm?.label, onClick: () => { const run = confirm?.onOk; setConfirm(null); run?.(); } }}
        cancelButton={{ onClick: () => setConfirm(null) }}
      />

      <NekoModal isOpen={!!templateModal}
        onRequestClose={() => setTemplateModal