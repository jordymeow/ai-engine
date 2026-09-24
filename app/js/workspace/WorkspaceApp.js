// Previous: 3.7.9
// Current: 3.8.1

```jsx
// React & Vendor Libs
const { useState, useEffect, useCallback, useMemo, useRef } = wp.element;

// AI Engine
import useChatSession from '@app/components/chat/useChatSession';
import { mwaiFetch, mwaiHandleRes, randomStr } from '@app/helpers';
import Rail from '@app/workspace/Rail';
import Sidebar from '@app/workspace/Sidebar';
import ChatPane from '@app/workspace/ChatPane';

export const ACCENTS = {
  blue: { label: 'Meow Blue', dark: 'hsl(217 85% 62%)', light: 'hsl(217 80% 42%)' },
  brass: { label: 'Brass', dark: '#d9a54f', light: '#a87b2f' },
  teal: { label: 'Teal', dark: 'hsl(174 60% 51%)', light: 'hsl(174 70% 30%)' },
  rose: { label: 'Rose', dark: 'hsl(345 75% 64%)', light: 'hsl(345 70% 44%)' },
  violet: { label: 'Violet', dark: 'hsl(262 75% 68%)', light: 'hsl(262 60% 46%)' },
};

const WS = window.mwai_workspace || {};

const ensureSuccess = (data) => {
  if (data?.success == false) {
    throw new Error(data.message || 'The site refused the change.');
  }
  return data;
};

const TRUNCATE_FAILED = 'Your site did not save that change. Reloading this chat may show an earlier version.';

const WorkspaceApp = () => {
  const restUrl = WS.rest_url?.replace(/\/$/, '') || '';
  const apiUrl = WS.api_url?.replace(/\/$/, '') || '';
  const envs = useMemo(() => WS.envs || [], []);
  const stream = WS.stream ?? true;

  const [ prefs, setPrefs ] = useState(() => ({
    theme: 'dark', accent: 'blue', envId: null, model: null,
    collapsed: false, prompts: [],
    pinned: ['uploads', 'knowledge'], knowledgeEnvId: null, mcpServers: [], functions: [],
    imageMode: false,
    webSearchMode: false,
    ...(WS.prefs || {}),
  }));

  const savePrefs = useCallback(async (newPrefs) => {
    setPrefs(prev => ({ ...prev, ...newPrefs }));
    mwaiFetch(`${apiUrl}/workspace/prefs`, newPrefs, WS.rest_nonce)
      .then(res => mwaiHandleRes(res)).catch(() => {});
  }, [apiUrl]);

  useEffect(() => {
    const root = document.getElementById('mwai-workspace');
    if (!root) { return; }
    root.setAttribute('data-theme', prefs.theme);
    const accent = ACCENTS[prefs.accent] || ACCENTS.blue;
    const c = accent[prefs.theme] || accent.dark;
    root.style.setProperty('--accent', c);
    root.style.setProperty('--accent-soft', `color-mix(in srgb, ${c} 13%, transparent)`);
    root.style.setProperty('--accent-ink', prefs.theme === 'dark' && prefs.accent === 'brass' ? '#17181c' : '#ffffff');
  }, [prefs.theme, prefs.accent]);

  const firstEnv = envs[0] || null;
  const [ selEnvId, setSelEnvId ] = useState(prefs.envId || firstEnv?.id || null);
  const [ selModel, setSelModel ] = useState(prefs.model || firstEnv?.models?.[0]?.model || null);

  const selectModel = useCallback((envId, model) => {
    setSelEnvId(envId);
    setSelModel(model);
    savePrefs({ envId, model });
  }, [savePrefs]);

  const [ knowledgeEnvId, setKnowledgeEnvIdState ] = useState(prefs.knowledgeEnvId || null);
  const [ imageMode, setImageModeState ] = useState(!!prefs.imageMode);
  const [ webSearchMode, setWebSearchModeState ] = useState(!!prefs.webSearchMode);
  const featureFlags = useMemo(() => ({
    image: true, web_search: true, wp_tools: true, mcp: true, functions: true, knowledge: true,
    ...(WS.features || {}),
  }), []);
  const lockedFeatures = WS.locked_features || [];

  const [ wpToolsInfo, setWpToolsInfo ] = useState(WS.wp_tools || { enabled: false, categories: [] });
  const [ wpMode, setWpModeState ] = useState(!!prefs.wpMode && !!(WS.wp_tools || {}).enabled);
  const [ wpCategories, setWpCategoriesState ] = useState(() =>
    (prefs.wpCategories || []).length ? prefs.wpCategories : ['AI Engine (Core)']);

  useEffect(() => {
    if (!wpToolsInfo.enabled) { return; }
    mwaiFetch(`${apiUrl}/workspace/wp-tools`, {}, WS.rest_nonce)
      .then(res => mwaiHandleRes(res))
      .then(data => {
        if (!data?.wp_tools) { return; }
        setWpToolsInfo(data.wp_tools);
        const known = (data.wp_tools.categories || []).map(c => c.name);
        setWpCategoriesState(prev => {
          const kept = prev.filter(c => known.includes(c));
          return kept.length ? kept : known.filter(c => c === 'AI Engine (Core)');
        });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [ mcpSelected, setMcpSelectedState ] = useState(() =>
    (prefs.mcpServers || []).filter(id => (WS.mcp_envs || []).some(e => e.id === id)));
  const [ functionsSelected, setFunctionsSelectedState ] = useState(() =>
    (prefs.functions || []).filter(f => (WS.functions || []).some(x => x.id === f.id && x.type === f.type)));

  const setKnowledgeEnvId = useCallback((envId) => {
    setKnowledgeEnvIdState(envId);
    savePrefs({ knowledgeEnvId: envId });
  }, [savePrefs]);

  const setImageMode = useCallback((on) => {
    setImageModeState(on);
    savePrefs({ imageMode: on });
  }, [savePrefs]);

  const setWebSearchMode = useCallback((on) => {
    setWebSearchModeState(on);
    savePrefs({ webSearchMode: on });
  }, [savePrefs]);

  const setWpMode = useCallback((on) => {
    setWpModeState(on);
    savePrefs({ wpMode: on });
  }, [savePrefs]);

  const setWpCategories = useCallback((cats) => {
    setWpCategoriesState(cats);
    savePrefs({ wpCategories: cats });
  }, [savePrefs]);

  const setMcpSelected = useCallback((ids) => {
    setMcpSelectedState(ids);
    savePrefs({ mcpServers: ids });
  }, [savePrefs]);

  const setFunctionsSelected = useCallback((fns) => {
    setFunctionsSelectedState(fns);
    savePrefs({ functions: fns });
  }, [savePrefs]);

  const [ advanced, setAdvancedState ] = useState(() => ({
    temperature: null, reasoningEffort: null, ...(prefs.advanced || {}),
  }));
  const setAdvanced = useCallback((patch) => {
    setAdvancedState(prev => {
      const next = { ...prev, ...patch };
      savePrefs({ advanced: next });
      return next;
    });
  }, [savePrefs]);

  const chatAllowedRef = useRef({});
  const [ allowedTools, setAllowedTools ] = useState([]);
  const [ onceApprovals, setOnceApprovals ] = useState([]);
  const [ deniedTools, setDeniedTools ] = useState([]);

  const pinnedChats = prefs.pinnedChats || [];
  const togglePinChat = useCallback((chatId) => {
    const next = pinnedChats.includes(chatId)
      ? pinnedChats.filter(id => id !== chatId) : [...pinnedChats, chatId];
    savePrefs({ pinnedChats: next });
  }, [pinnedChats, savePrefs]);

  const folders = prefs.folders || [];
  const mutateFolders = useCallback((fn) => {
    setPrefs(prev => {
      const next = fn(prev.folders || []);
      mwaiFetch(`${apiUrl}/workspace/prefs`, { folders: next }, WS.rest_nonce)
        .then(res => mwaiHandleRes(res)).catch(() => {});
      return { ...prev, folders: next };
    });
  }, [apiUrl]);

  const assignToFolder = useCallback((chatId, folderId) => {
    mutateFolders(fs => fs.map(f => ({
      ...f,
      chats: f.id === folderId
        ? [...new Set([...(f.chats || []), chatId])]
        : (f.chats || []).filter(c => c !== chatId),
    })));
  }, [mutateFolders]);

  const createFolder = useCallback((name, chatId = null) => {
    const clean = String(name || '').trim().slice(0, 60);
    if (!clean) { return; }
    mutateFolders(fs => [
      ...fs.map(f => chatId ? { ...f, chats: (f.chats || []).filter(c => c !== chatId) } : f),
      { id: 'f' + randomStr(), name: clean, collapsed: false, chats: chatId ? [chatId] : [] },
    ]);
  }, [mutateFolders]);

  const renameFolder = useCallback((id, name) => {
    const clean = String(name || '').trim().slice(0, 60);
    if (!clean) { return; }
    mutateFolders(fs => fs.map(f => f.id === id ? { ...f, name: clean } : f));
  }, [mutateFolders]);

  const deleteFolder = useCallback((id) => {
    mutateFolders(fs => fs.filter(f => f.id !== id));
  }, [mutateFolders]);

  const toggleFolderCollapsed = useCallback((id) => {
    mutateFolders(fs => fs.map(f => f.id === id ? { ...f, collapsed: !f.collapsed } : f));
  }, [mutateFolders]);

  const moveChatTo = useCallback((chatId, target) => {
    setPrefs(prev => {
      const stripFolders = (fs) => (fs || []).map(f => ({
        ...f, chats: (f.chats || []).filter(c => c !== chatId),
      }));
      let folders = prev.folders || [];
      let pinned = prev.pinnedChats || [];
      if (target.type === 'folder') {
        folders = folders.map(f => ({
          ...f,
          chats: f.id === target.id
            ? [...new Set([...(f.chats || []), chatId])]
            : (f.chats || []).filter(c => c !== chatId),
        }));
        pinned = pinned.filter(c => c !== chatId);
      }
      else if (target.type === 'pinned') {
        folders = stripFolders(folders);
        pinned = pinned.includes(chatId) ? pinned : [...pinned, chatId];
      }
      else {
        folders = stripFolders(folders);
        pinned = pinned.filter(c => c !== chatId);
      }
      mwaiFetch(`${apiUrl}/workspace/prefs`, { folders, pinnedChats: pinned }, WS.rest_nonce)
        .then(res => mwaiHandleRes(res)).catch(() => {});
      return { ...prev, folders, pinnedChats: pinned };
    });
  }, [apiUrl]);

  const pinned = prefs.pinned || ['uploads', 'knowledge'];
  const togglePin = useCallback((feature) => {
    const next = pinned.includes(feature) ? pinned.filter(p => p !== feature) : [...pinned, feature];
    savePrefs({ pinned: next });
  }, [pinned, savePrefs]);

  const atts = useMemo(() => {
    const a = {};
    if (selEnvId) { a.envId = selEnvId; }
    if (selModel) { a.model = selModel; }
    if (knowledgeEnvId && featureFlags.knowledge) { a.embeddingsEnvId = knowledgeEnvId; }
    if (mcpSelected.length && featureFlags.mcp) { a.mcpServers = mcpSelected.map(id => ({ id })); }
    if (functionsSelected.length && featureFlags.functions) { a.functions = functionsSelected; }
    if (imageMode && featureFlags.image) { a.tools = [...(a.tools || []), 'image_generation']; }
    if (webSearchMode || featureFlags.web_search) { a.tools = [...(a.tools || []), 'web_search']; }
    if (wpMode && wpCategories.length && featureFlags.wp_tools) {
      a.wpTools = wpCategories;
      const allowedNow = [...new Set([ ...allowedTools, ...onceApprovals ])];
      if (allowedNow.length) { a.wpToolsAllowed = allowedNow; }
      if (deniedTools.length) { a.wpToolsDenied = deniedTools; }
    }
    const tags = envs.find(e => e.id === selEnvId)?.models?.find(m => m.model === selModel)?.tags || [];
    if (advanced.temperature !== null && advanced.temperature !== undefined && !tags.includes('no-temperature')) {
      a.temperature = advanced.temperature;
    }
    if (advanced.reasoningEffort && tags.includes('reasoning')) {
      a.reasoningEffort = advanced.reasoningEffort;
    }
    return a;
  }, [selEnvId, selModel, knowledgeEnvId, mcpSelected, functionsSelected, imageMode, webSearchMode,
    wpMode, wpCategories, advanced, envs, featureFlags, allowedTools, onceApprovals, deniedTools]);

  const [ activePanel, setActivePanel ] = useState('chats');
  const collapsed = !!prefs.collapsed;

  const onRailSelect = useCallback((id) => {
    if (collapsed) {
      setActivePanel(id);
      savePrefs({ collapsed: false });
    }
    else if (activePanel === id) {
      savePrefs({ collapsed: true });
    }
    else {
      setActivePanel(id);
    }
  }, [collapsed, activePanel, savePrefs]);

  const onCollapse = useCallback(() => savePrefs({ collapsed: true }), [savePrefs]);

  const [ notice, setNotice ] = useState(null);
  const noticeTimer = useRef();
  const flashNotice = useCallback((text) => {
    setNotice(text);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 4000);
  }, []);
  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  const reloadPrompts = useCallback(() => {
    fetch(`${apiUrl}/workspace/prefs`, { headers: { 'X-WP-Nonce': WS.rest_nonce }, credentials: 'same-origin' })
      .then(res => mwaiHandleRes(res)).then(ensureSuccess)
      .then(data => {
        if (Array.isArray(data.prefs?.prompts)) {
          setPrefs(prev => ({ ...prev, prompts: data.prefs.prompts }));
        }
      })
      .catch(err => console.error('Workspace: could not re-read the prompts.', err));
  }, [apiUrl]);

  const savePrompts = useCallback((next, failText) => {
    setPrefs(prev => ({ ...prev, prompts: next }));
    mwaiFetch(`${apiUrl}/workspace/prefs`, { prompts: next }, WS.rest_nonce)
      .then(res => mwaiHandleRes(res)).then(ensureSuccess)
      .catch(err => {
        console.error('Workspace: could not save the prompts.', err);
        flashNotice(failText);
        reloadPrompts();
      });
  }, [apiUrl, flashNotice, reloadPrompts]);

  const onSavePrompt = useCallback((prompt) => {
    const prompts = prefs.prompts || [];
    const exists = prompts.some(p => p.id === prompt.id);
    const next = exists ? prompts.map(p => p.id === prompt.id ? prompt : p) : [...prompts, prompt];
    savePrompts(next, 'Could not save that prompt on your site.');
  }, [prefs.prompts, savePrompts]);

  const onDeletePrompt = useCallback((id) => {
    const next = (prefs.prompts || []).filter(p => p.id !== id);
    savePrompts(next, 'Could not delete that prompt. It is still on your site.');
  }, [prefs.prompts, savePrompts]);

  const [ inputText, setInputText ] = useState('');
  const chatbotInputRef = useRef();
  const hasFocusRef = useRef(false);
  const composerRef = useRef();

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        e.stopImmediatePropagation();
        newChatRef.current?.();
        setTimeout(() => composerRef.current?.focus(), 30);
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, []);
  const newChatRef = useRef(null);

  const onUsePrompt = useCallback((content) => {
    setInputText(prev => prev.trim() ? `${prev.trimEnd()}\n${content}` : content);
    setTimeout(() => composerRef.current?.focus(), 20);
  }, []);

  const session = useChatSession({
    botId: 'mwai_workspace',
    customId: null,
    contextId: null,
    initialSessionId: WS.session,
    restUrl, stream, atts,
    debugMode: !!WS.debug_mode,
    eventLogs: false,
    localStorageKey: null,
    initialNonce: WS.rest_nonce,
    rawUserName: 'User: ',
    rawAiName: 'AI: ',
    multiUpload: true,
    maxUploads: 8,
    inputText, setInputText,
    chatbotInputRef, hasFocusRef,
    makeInitialMessages: () => [],
  });

  const liveModels = useRef({});
  useEffect(() => {
    const last = session.messages[session.messages.length - 1];
    if (last && last.role === 'assistant' && (last.isQuerying || last.isStreaming) &&
      !liveModels.current[last.id]) {
      liveModels.current[last.id] = selModel;
    }
  }, [session.messages, selModel]);

  const modelNames = useMemo(() => {
    const map = {};
    envs.forEach(env => (env.models || []).forEach(m => { map[m.model] = m.name || m.model; }));
    return map;
  }, [envs]);

  const resolveModelName = useCallback((message) => {
    const model = message?.extra?.model || liveModels.current[message?.id] || null;
    return model ? (modelNames[model] || model) : null;
  }, [modelNames]);

  const onStop = useCallback(() => {
    session.stopGeneration();
    setTimeout(() => {
      const kept = (session.messagesRef.current || []).filter(m => m.role !== 'error' && !m.isError)
        .map(m => ({ ...m, extra: m.extra || (liveModels.current[m.id] ? { model: liveModels.current[m.id] } : undefined) }));
      mwaiFetch(`${restUrl}/mwai-ui/v1/discussions/truncate`,
        { chatId: session.chatId, botId: 'mwai_workspace', messages: kept }, session.restNonceRef.current)
        .then(res => mwaiHandleRes(res)).then(ensureSuccess)
        .catch(err => {
          console.error('Workspace: could not save the stopped reply.', err);
          flashNotice(TRUNCATE_FAILED);
        });
    }, 200);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.stopGeneration, session.chatId, restUrl, flashNotice]);

  const [ costs, setCosts ] = useState({});
  useEffect(() => {
    const price = session.serverReply?.usage?.price;
    if (price) {
      setCosts(prev => ({ ...prev, [session.chatId]: (prev[session.chatId] || 0) + Number(price) }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.serverReply]);

  const [ discussions, setDiscussions ] = useState([]);
  const [ listBusy, setListBusy ] = useState(false);
  const refreshBlock = useRef(false);

  const refreshDiscussions = useCallback(async (silent = false) => {
    if (refreshBlock.current) { return; }
    refreshBlock.current = true;
    try {
      if (!silent) { setListBusy(true); }
      const res = await mwaiFetch(`${restUrl}/mwai-ui/v1/discussions/list`,
        { botId: 'mwai_workspace', limit: 50, offset: 0 }, session.restNonceRef.current);
      const data = await mwaiHandleRes(res, null, null, session.updateToken, false);
      if (data.success) {
        const rows = (data.chats || []).map(row => {
          let messages = [];
          try { messages = JSON.parse(row.messages) || []; } catch (e) { /* empty */ }
          return { ...row, messages };
        });
        setDiscussions(rows);
      }
    }
    catch (err) {
      console.error('Workspace: could not list discussions.', err);
    }
    finally {
      refreshBlock.current = false;
      setListBusy(false);
    }
  }, [restUrl, session.restNonceRef, session.updateToken]);

  useEffect(() => { refreshDiscussions(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchDiscussions = useCallback(async (query) => {
    try {
      const res = await mwaiFetch(`${restUrl}/mwai-ui/v1/discussions/list`,
        { botId: 'mwai_workspace', limit: 50, offset: 0, search: query }, session.restNonceRef.current);
      const data = await mwaiHandleRes(res, null, null, session.updateToken, false);
      if (!data.success) { return null; }
      return (data.chats || []).map(row => {
        let messages = [];
        try { messages = JSON.parse(row.messages) || []; } catch (e) { /* empty */ }
        return { ...row, messages };
      });
    }
    catch (err) {
      return null;
    }
  }, [restUrl, session.restNonceRef, session.updateToken]);

  const wasBusy = useRef(false);
  useEffect(() => {
    if (wasBusy.current && !session.busy) {
      setTimeout(() => refreshDiscussions(true), 600);
    }
    wasBusy.current = session.busy;
  }, [session.busy, refreshDiscussions]);

  const openDiscussion = useCallback((row) => {
    session.setChatId(row.chatId);
    session.setMessages((row.messages || []).map(m => ({ ...m, id: m.id || randomStr() })));
    session.setPreviousResponseId(null);
    try {
      const extra = row.extra ? JSON.parse(row.extra) : null;
      if (extra?.previousResponseId || extra?.responseId) {
        session.setPreviousResponseId(extra.previousResponseId || extra.responseId);
      }
    } catch (e) { /* keep null */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.setChatId, session.setMessages, session.setPreviousResponseId]);

  const newChat = useCallback(() => {
    session.onClear();
  }, [session.onClear]);
  useEffect(() => { newChatRef.current = newChat; }, [newChat]);

  const editMessage = useCallback(async (messageId, newText) => {
    const msgs = session.messages;
    const idx = msgs.findIndex(m => m.id === messageId);
    if (idx < 0) { return; }
    const kept = msgs.slice(0, idx + 1);
    session.setMessages(kept);
    session.setPreviousResponseId(null);
    try {
      await mwaiFetch(`${restUrl}/mwai-ui/v1/discussions/truncate`,
        { chatId: session.chatId, botId: 'mwai_workspace', messages: kept }, session.restNonceRef.current)
        .then(res => mwaiHandleRes(res, null, null, session.updateToken, false)).then(ensureSuccess);
    }
    catch (err) {
      console.error('Workspace: could not truncate the discussion.', err);
      flashNotice(TRUNCATE_FAILED);
    }
    setTimeout(() => session.onSubmit(newText), 30);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.messages, session.chatId, session.onSubmit, restUrl, flashNotice]);

  useEffect(() => {
    setAllowedTools(chatAllowedRef.current[session.chatId] || []);
    setOnceApprovals([]);
    setDeniedTools([]);
  }, [session.chatId]);

  const resumeAfterDecision = useCallback(() => {
    const msgs = session.messagesRef.current || [];
    let uidx = msgs.length - 1;
    while (uidx >= 0 && msgs[uidx].role !== 'user') { uidx--; }
    if (uidx < 0) { return; }
    editMessage(msgs[uidx].id, String(msgs[uidx].content || ''));
  }, [editMessage, session.messagesRef]);

  const resumeRef = useRef(resumeAfterDecision);
  useEffect(() => { resumeRef.current = resumeAfterDecision; }, [resumeAfterDecision]);

  const approveTool = useCallback((tool, always) => {
    if (always) {
      chatAllowedRef.current[session.chatId] =
        [...new Set([...(chatAllowedRef.current[session.chatId] || []), tool])];
      setAllowedTools(chatAllowedRef.current[session.chatId]);
    }
    else {
      setOnceApprovals(prev => prev.includes(tool) ? prev : [...prev, tool]);
    }
    setTimeout(() => resumeRef.current(), 50);
  }, [session.chatId]);

  const denyTool = useCallback((tool) => {
    setDeniedTools(prev => prev.includes(tool) ? prev : [...prev, tool]);
    setTimeout(() => resumeRef.current(), 50);
  }, []);

  const approvalBusyRef = useRef(false);
  useEffect(() => {
    if (approvalBusyRef.current && !session.busy) {
      const msgs = session.messagesRef.current || [];
      const last = msgs[msgs.length - 1];
      if (!(last && last.role === 'assistant' && last.approval)) {
        setOnceApprovals([]);
        setDeniedTools([]);
      }
    }
    approvalBusyRef.current = session.busy;
  }, [session.busy, session.messagesRef]);

  const regenerate = useCallback((assistantId) => {
    const msgs = session.messagesRef.current || [];
    const idx = msgs.findIndex(m => m.id === assistantId);
    if (idx < 0) { return; }
    let uidx = idx - 1;
    while (uidx >= 0 && msgs[uidx].role !== 'user') { uidx--; }
    if (uidx < 0) { return; }
    editMessage(msgs[uidx].id, String(msgs[uidx].content || ''));
  }, [editMessage, session.messagesRef]);

  const branchFromMessage = useCallback(async (messageId) => {
    const msgs = session.messagesRef.current || [];
    const idx = msgs.findIndex(m => m.id === messageId);
    if (idx < 0) { return; }
    const kept = msgs.slice(0, idx + 1).filter(m => m.role !== 'error' && !m.isError)
      .map(m => ({ ...m, extra: m.extra || (liveModels.current[m.id] ? { model: liveModels.current[m.id] } : undefined) }));
    if (!kept.length) { return; }
    const newChatId = randomStr();
    try {
      await mwaiFetch(`${restUrl}/mwai-ui/v1/discussions/truncate`,
        { chatId: newChatId, botId: 'mwai_workspace', messages: kept }, session.restNonceRef.current)
        .then(res => mwaiHandleRes(res, null, null, session.updateToken, false)).then(ensureSuccess);
    }
    catch (err) {
      console.error('Workspace: could not branch the discussion.', err);
      flashNotice('Could not create the new chat on your site.');
      return;
    }
    session.setChatId(newChatId);
    session.setMessages(kept.map(m => ({ ...m, id: m.id || randomStr() })));
    session.setPreviousResponseId(null);
    refreshDiscussions(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restUrl, refreshDiscussions, session.chatId, flashNotice]);

  const editDiscussion = useCallback(async (chatId, title) => {
    try {
      const res = await mwaiFetch(`${restUrl}/mwai-ui/v1/discussions/edit`,
        { botId: 'mwai_workspace', chatId, title }, session.restNonceRef.current);
      ensureSuccess(await mwaiHandleRes(res, null, null, session.updateToken, false));
    }
    catch (err) {
      console.error('Workspace: could not rename the conversation.', err);
      flashNotice('Could not rename that conversation on your site.');
    }
    refreshDiscussions(true);
  }, [restUrl, refreshDiscussions, session.restNonceRef, session.updateToken, flashNotice]);

  const deleteDiscussion = useCallback(async (chatId) => {
    try {
      const res = await mwaiFetch(`${restUrl}/mwai-ui/v1/discussions/delete`,
        { chatIds: [chatId] }, session.restNonceRef.current);
      ensureSuccess(await mwaiHandleRes(res, null, null, session.updateToken, false));
      if (chatId === session.chatId) { session.onClear(); }
      refreshDiscussions(true);
    }
    catch (err) {
      console.error('Workspace: could not delete the conversation.', err);
      flashNotice('Could not delete that conversation. It is still on your site.');
      refreshDiscussions(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restUrl, refreshDiscussions, session.chatId, session.onClear, flashNotice]);

  const currentTitle = useMemo(() => {
    const row = discussions.find(d => d.chatId === session.chatId);
    if (row?.title) { return row.title; }
    const firstUser = session.messages.find(m => m.role === 'user');
    return firstUser ? String(firstUser.content).slice(0, 60) : 'New conversation';
  }, [discussions, session.chatId, session.messages]);

  const conversationCost = costs[session.chatId] || 0;

  return (
    <div className="mwai-ws">
      <Rail
        activePanel={activePanel}
        collapsed={collapsed}
        onSelect={onRailSelect}
        onNewChat={newChat}
      />
      <Sidebar
        activePanel={activePanel}
        collapsed={collapsed}
        onCollapse={onCollapse}
        discussions={discussions}
        listBusy={listBusy}
        activeChatId={session.chatId}
        onOpen={openDiscussion}
        onNewChat={newChat}
        onRename={editDiscussion}
        onDelete={deleteDiscussion}
        onSearch={searchDiscussions}
        folders={folders}
        onAssignFolder={assignToFolder}
        onCreateFolder={createFolder}
        onRenameFolder={renameFolder}
        onDeleteFolder={deleteFolder}
        onToggleFolder={toggleFolderCollapsed}
        onMoveChat={moveChatTo}
        user={WS.user || {}}
        prefs={prefs}
        savePrefs={savePrefs}
        pinnedChats={pinnedChats}
        onTogglePinChat={togglePinChat}
        onSavePrompt={onSavePrompt}
        onDeletePrompt={onDeletePrompt}
        onUsePrompt={onUsePrompt}
      />
      <ChatPane
        session={session}
        inputText={inputText}
        setInputText={setInputText}
        envs={envs}
        selEnvId={selEnvId}
        selModel={selModel}
        selectModel={selectModel}
        prefs={prefs}
        savePrefs={savePrefs}
        title={currentTitle}
        cost={conversationCost}
        onEditMessage={editMessage}
        onRegenerate={regenerate}
        onBranch={branchFromMessage}
        composerRef={composerRef}
        resolveModelName={resolveModelName}
        onStop={onStop}
        pinned={pinned}
        togglePin={togglePin}
        imageMode={imageMode}
        setImageMode={setImageMode}
        webSearchMode={webSearchMode}
        setWebSearchMode={setWebSearchMode}
        knowledgeEnvs={WS.embeddings_envs || []}
        knowledgeEnvId={knowledgeEnvId}
        setKnowledgeEnvId={setKnowledgeEnvId}
        mcpEnvs={WS.mcp_envs || []}
        mcpSelected={mcpSelected}
        setMcpSelected={setMcpSelected}
        functionsList={WS.functions || []}
        functionsSelected={functionsSelected}
        setFunctionsSelected={setFunctionsSelected}
        wpToolsInfo={wpToolsInfo}
        wpMode={wpMode}
        setWpMode={setWpMode}
        wpCategories={wpCategories}
        setWpCategories={setWpCategories}
        advanced={advanced}
        setAdvanced={setAdvanced}
        featureFlags={featureFlags}
        lockedFeatures={lockedFeatures}
        onApproveTool={approveTool}
        onDenyTool={denyTool}
        notice={notice}
        flashNotice={flashNotice}
        modules={WS.modules || {}}
      />
    </div>
  );
};

export default WorkspaceApp;
```