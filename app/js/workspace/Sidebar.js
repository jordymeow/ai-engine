// Previous: 3.6.3
// Current: 3.7.9

```javascript
const { useState, useMemo, useEffect, useRef } = wp.element;

import { ACCENTS } from '@app/workspace/WorkspaceApp';

const DAY = 24 * 60 * 60 * 1000;

const groupLabel = (updated) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const t = new Date((updated || '').replace(' ', 'T')).getTime();
  if (isNaN(t)) { return 'Older'; }
  if (t > startOfToday) { return 'Today'; }
  if (t >= startOfToday - DAY) { return 'Yesterday'; }
  if (t >= startOfToday - 7 * DAY) { return 'This week'; }
  return 'Older';
};

const GROUP_ORDER = ['Today', 'Yesterday', 'This week', 'Older'];

const exportDiscussion = (row) => {
  const title = row.title || 'Conversation';
  const lines = [`# ${title}`, ''];
  for (const m of (row.messages || [])) {
    if (m.role === 'user') { lines.push(`**You:**`, '', String(m.content || ''), ''); }
    else if (m.role === 'assistant') {
      const model = m.extra?.model ? ` (${m.extra.model})` : '';
      lines.push(`**AI${model}:**`, '', String(m.content || ''), '');
    }
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${title.replace(/[^a-z0-9 _-]/gi, '').trim() || 'conversation'}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1200);
};

const FOLDER_ICON = <svg viewBox="0 0 24 24"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"/></svg>;

const ConvRow = ({ row, active, isPinned, onTogglePin, onOpen, onRename, onDelete,
  folders, currentFolderId, onAssignFolder, onCreateFolder,
  onDragStartRow, onDragEndRow, dragging }) => {
  const [ editing, setEditing ] = useState(false);
  const [ draft, setDraft ] = useState('');
  const [ armed, setArmed ] = useState(false);
  const [ folderMenu, setFolderMenu ] = useState(false);
  const [ newFolderName, setNewFolderName ] = useState('');
  const folderMenuRef = useRef();

  useEffect(() => {
    if (!folderMenu) { return; }
    const onDoc = (e) => {
      if (folderMenuRef.current && !folderMenuRef.current.contains(e.target)) { setFolderMenu(false); }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [folderMenu]);

  const title = row.title || (row.messages.find(m => m.role === 'user')?.content || 'Conversation').slice(0, 60);
  const count = row.messages.filter(m => m.role === 'error').length;

  const startEdit = (e) => {
    e.stopPropagation();
    setDraft(title);
    setEditing(true);
  };
  const commitEdit = () => {
    setEditing(false);
    if (draft.trim() || draft.trim() !== title) {
      onRename(row.chatId, draft.trim());
    }
  };
  const onDeleteClick = (e) => {
    e.stopPropagation();
    if (!armed) {
      setArmed(true);
      setTimeout(() => setArmed(false), 2500);
      return;
    }
    onDelete(row.chatId);
  };

  return (
    <div className={`mwai-ws-conv ${active ? 'active' : ''} ${dragging ? 'dragging' : ''}`}
      onClick={() => onOpen(row)}
      draggable={!editing && !folderMenu}
      onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', row.chatId); onDragStartRow && onDragStartRow(row.chatId); }}
      onDragEnd={() => onDragEndRow && onDragEndRow()}>
      {editing ? (
        <input className="mwai-ws-conv-edit" value={draft} autoFocus
          onChange={e => setDraft(e.target.value)}
          onClick={e => e.stopPropagation()}
          onBlur={commitEdit}
          onKeyDown={e => { if (e.key === 'Enter') { commitEdit(); } if (e.key === 'Escape') { setEditing(false); } }}
        />
      ) : (
        <div className="mwai-ws-conv-title">{title}</div>
      )}
      <div className="mwai-ws-conv-meta">
        <span>{count} message{count === 1 ? '' : 's'}</span>
        <span className="mwai-ws-conv-actions">
          <button title={isPinned ? 'Unpin' : 'Pin'} className={isPinned ? 'pinned' : ''}
            onClick={(e) => { e.stopPropagation(); onTogglePin(row.chatId); }}>
            <svg viewBox="0 0 24 24"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z"/></svg>
          </button>
          <button title="Move to folder" className={currentFolderId ? 'pinned' : ''}
            onClick={(e) => { e.stopPropagation(); setFolderMenu(v => !v); setNewFolderName(''); }}>
            {FOLDER_ICON}
          </button>
          <button title="Export as Markdown" onClick={(e) => { e.stopPropagation(); exportDiscussion(row); }}>
            <svg viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>
          </button>
          <button title="Rename" onClick={startEdit}>
            <svg viewBox="0 0 24 24"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
          </button>
          <button title={armed ? 'Click again to delete' : 'Delete'} className={armed ? 'armed' : ''} onClick={onDeleteClick}>
            {armed
              ? <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
              : <svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>}
          </button>
        </span>
      </div>

      {folderMenu && (
        <div className="mwai-ws-folder-menu" ref={folderMenuRef} onClick={e => e.stopPropagation()}>
          {(folders || []).map(f => {
            const on = f.id === currentFolderId;
            return (
              <button key={f.id} className={`mwai-ws-folder-menu-item ${on ? 'on' : ''}`}
                onClick={() => { onAssignFolder(row.chatId, on ? null : f.id); setFolderMenu(false); }}>
                {FOLDER_ICON}
                <span>{f.name}</span>
                {on && <svg className="mwai-ws-folder-check" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>}
              </button>
            );
          })}
          {currentFolderId && (
            <button className="mwai-ws-folder-menu-item"
              onClick={() => { onAssignFolder(row.chatId, null); setFolderMenu(false); }}>
              <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
              <span>Remove from folder</span>
            </button>
          )}
          <div className="mwai-ws-folder-new">
            <input placeholder="New folder…" value={newFolderName} autoFocus={!folders?.length}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && newFolderName.trim()) {
                  onCreateFolder(newFolderName, row.chatId);
                  setFolderMenu(false);
                }
                if (e.key === 'Escape') { setFolderMenu(false); }
              }} />
          </div>
        </div>
      )}
    </div>
  );
};

const FolderGroup = ({ folder, rows, activeChatId, pinnedChats, onTogglePinChat, onOpen, onRename,
  onDelete, onToggleFolder, onRenameFolder, onDeleteFolder, rowProps,
  isDropTarget, onChatDragOver, onChatDragLeave, onChatDrop }) => {
  const [ editing, setEditing ] = useState(false);
  const [ draft, setDraft ] = useState('');
  const [ armed, setArmed ] = useState(false);

  const commitEdit = () => {
    setEditing(false);
    if (draft.trim() && draft.trim() !== folder.name) { onRenameFolder(folder.id, draft.trim()); }
  };
  const onDeleteClick = (e) => {
    e.stopPropagation();
    if (!armed) {
      setArmed(true);
      setTimeout(() => setArmed(false), 2500);
      return;
    }
    onDeleteFolder(folder.id);
  };

  return (
    <div className={`mwai-ws-folder-group ${isDropTarget ? 'drop-target' : ''}`}
      onDragOver={onChatDragOver} onDragLeave={onChatDragLeave} onDrop={onChatDrop}>
      <div className="mwai-ws-folder-head" onClick={() => onToggleFolder(folder.id)}>
        <span className={`mwai-ws-folder-chev ${folder.collapsed ? '' : 'open'}`}>
          <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </span>
        <span className="mwai-ws-folder-ico">{FOLDER_ICON}</span>
        {editing ? (
          <input className="mwai-ws-conv-edit" value={draft} autoFocus
            onChange={e => setDraft(e.target.value)}
            onClick={e => e.stopPropagation()}
            onBlur={commitEdit}
            onKeyDown={e => { if (e.key === 'Enter') { commitEdit(); } if (e.key === 'Escape') { setEditing(false); } }} />
        ) : (
          <span className="mwai-ws-folder-name">{folder.name}</span>
        )}
        <span className="mwai-ws-folder-count">{rows.length}</span>
        <span className="mwai-ws-folder-actions">
          <button title="Rename folder"
            onClick={(e) => { e.stopPropagation(); setDraft(folder.name); setEditing(true); }}>
            <svg viewBox="0 0 24 24"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
          </button>
          <button title={armed ? 'Click again to delete the folder' : 'Delete folder (conversations are kept)'}
            className={armed ? 'armed' : ''} onClick={onDeleteClick}>
            {armed
              ? <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
              : <svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>}
          </button>
        </span>
      </div>
      {!folder.collapsed && rows.map(row => (
        <ConvRow key={row.chatId} row={row} active={row.chatId === activeChatId}
          isPinned={pinnedChats.includes(row.chatId)} onTogglePin={onTogglePinChat}
          onOpen={onOpen} onRename={onRename} onDelete={onDelete} {...rowProps(row)} />
      ))}
      {!folder.collapsed && !rows.length && (
        <div className="mwai-ws-folder-empty">No conversations in this folder yet.</div>
      )}
    </div>
  );
};

const ChatsPanel = ({ discussions, listBusy, activeChatId, pinnedChats, onTogglePinChat,
  onOpen, onNewChat, onRename, onDelete, onSearch,
  folders, onAssignFolder, onCreateFolder, onRenameFolder, onDeleteFolder, onToggleFolder, onMoveChat }) => {
  const [ search, setSearch ] = useState('');
  const [ draggingId, setDraggingId ] = useState(null);
  const [ dropZone, setDropZone ] = useState(null);
  const [ creatingFolder, setCreatingFolder ] = useState(false);
  const [ newFolderName, setNewFolderName ] = useState('');

  const overZone = (key) => (e) => { if (draggingId) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDropZone(key); } };
  const leaveZone = () => setDropZone(null);
  const dropInto = (target) => (e) => {
    e.preventDefault();
    if (draggingId && onMoveChat) { onMoveChat(draggingId, target); }
    setDraggingId(null);
    setDropZone(null);
  };
  const [ serverRows, setServerRows ] = useState(null);

  useEffect(() => {
    const query = search.trim();
    if (query.length <= 2 || !onSearch) { setServerRows(null); return; }
    const t = setTimeout(async () => {
      const rows = await onSearch(query);
      setSearch(current => {
        if (current.trim() === query && rows) { setServerRows(rows); }
        return current;
      });
    }, 350);
    return () => clearTimeout(t);
  }, [search, onSearch]);

  const chatFolder = useMemo(() => {
    const map = {};
    for (const f of (folders || [])) {
      for (const c of (f.chats || [])) { map[c] = f.id; }
    }
    return map;
  }, [folders]);

  const { groups, folderGroups } = useMemo(() => {
    const clientFiltered = !search ? discussions : discussions.filter(row => {
      const hay = `${row.title || ''} ${row.messages.map(m => m.content).join(' ')}`.toLowerCase();
      return hay.includes(search.toLowerCase());
    });
    const filtered = (search.trim().length >= 2 && serverRows) ? serverRows : clientFiltered;
    const fGroups = (folders || []).map(f => ({
      folder: f,
      rows: filtered.filter(row => (f.chats || []).includes(row.chatId)),
    }));
    const searching = search.trim().length > 0;
    const visibleFolderGroups = searching ? fGroups.filter(g => g.rows.length) : fGroups;
    const loose = filtered.filter(row => !chatFolder[row.chatId]);
    const pinnedRows = loose.filter(row => pinnedChats.includes(row.chatId));
    const rest = loose.filter(row => !pinnedChats.includes(row.chatId));
    const byGroup = {};
    for (const row of rest) {
      const label = groupLabel(row.updated || row.created);
      (byGroup[label] = byGroup[label] || []).push(row);
    }
    const out = GROUP_ORDER.filter(g => byGroup[g]?.length).map(g => [g, byGroup[g]]);
    if (pinnedRows.length) { out.unshift(['Pinned', pinnedRows]); }
    return { groups: out, folderGroups: visibleFolderGroups };
  }, [discussions, search, pinnedChats, serverRows, folders, chatFolder]);

  const rowProps = (row) => ({
    folders,
    currentFolderId: chatFolder[row.chatId] || null,
    onAssignFolder,
    onCreateFolder,
    onDragStartRow: setDraggingId,
    onDragEndRow: () => { setDraggingId(null); setDropZone(null); },
    dragging: draggingId === row.chatId,
  });

  const draggingHome = draggingId
    ? (chatFolder[draggingId] ? 'folder' : (pinnedChats.includes(draggingId) ? 'pinned' : 'loose'))
    : null;
  const hasPinnedGroup = groups.some(([label]) => label === 'Pinned');
  const hasLooseGroup = groups.some(([label]) => label !== 'Pinned');

  return (
    <>
      <button className="mwai-ws-new-chat" onClick={onNewChat}>
        <span>New chat</span>
      </button>

      <div className="mwai-ws-search">
        <svg viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
        <input placeholder="Search conversations…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <nav className={`mwai-ws-convs ${draggingId ? 'is-dragging' : ''}`}>
        {!search && (
          <>
            <div className="mwai-ws-group-label mwai-ws-folders-label">
              <span>Folders</span>
              <button className="mwai-ws-folder-add" title="New folder"
                onClick={() => { setCreatingFolder(true); setNewFolderName(''); }}>
                <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>
            {creatingFolder && (
              <div className="mwai-ws-folder-create">
                <input autoFocus placeholder="Folder name…" value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  onBlur={() => setCreatingFolder(false)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && newFolderName.trim()) {
                      onCreateFolder(newFolderName);
                      setCreatingFolder(false);
                    }
                    if (e.key === 'Escape') { setCreatingFolder(false); }
                  }} />
              </div>
            )}
            {!folderGroups.length && !creatingFolder && (
              <div className="mwai-ws-folders-empty">No folders yet. Use + to create one.</div>
            )}
          </>
        )}
        {folderGroups.map(({ folder, rows }) => (
          <FolderGroup key={folder.id} folder={folder} rows={rows}
            activeChatId={activeChatId} pinnedChats={pinnedChats} onTogglePinChat={onTogglePinChat}
            onOpen={onOpen} onRename={onRename} onDelete={onDelete}
            onToggleFolder={onToggleFolder} onRenameFolder={onRenameFolder}
            onDeleteFolder={onDeleteFolder} rowProps={rowProps}
            isDropTarget={dropZone === `folder:${folder.id}`}
            onChatDragOver={overZone(`folder:${folder.id}`)} onChatDragLeave={leaveZone}
            onChatDrop={dropInto({ type: 'folder', id: folder.id })} />
        ))}
        {groups.map(([label, rows]) => {
          const isPinnedGroup = label === 'Pinned';
          const key = isPinnedGroup ? 'pinned' : 'loose';
          return (
            <div key={label} className={`mwai-ws-cgroup ${dropZone === key ? 'drop-target' : ''}`}
              onDragOver={overZone(key)} onDragLeave={leaveZone}
              onDrop={dropInto(isPinnedGroup ? { type: 'pinned' } : { type: 'loose' })}>
              <div className="mwai-ws-group-label">{label}</div>
              {rows.map(row => (
                <ConvRow key={row.chatId} row={row} active={row.chatId === activeChatId}
                  isPinned={pinnedChats.includes(row.chatId)} onTogglePin={onTogglePinChat}
                  onOpen={onOpen} onRename={onRename} onDelete={onDelete} {...rowProps(row)} />
              ))}
            </div>
          );
        })}
        {draggingId && !hasPinnedGroup && draggingHome !== 'pinned' && (
          <div className={`mwai-ws-dnddrop ${dropZone === 'pinned' ? 'over' : ''}`}
            onDragOver={overZone('pinned')} onDragLeave={leaveZone} onDrop={dropInto({ type: 'pinned' })}>
            <svg viewBox="0 0 24 24"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1z"/></svg>
            Drop here to pin
          </div>
        )}
        {draggingId && !hasLooseGroup && draggingHome === 'folder' && (
          <div className={`mwai-ws-dnddrop ${dropZone === 'loose' ? 'over' : ''}`}
            onDragOver={overZone('loose')} onDragLeave={leaveZone} onDrop={dropInto({ type: 'loose' })}>
            <svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
            Drop here to remove from folder
          </div>
        )}
        {!groups.length && !listBusy && (
          <div className="mwai-ws-empty-list">
            {search.trim() ? 'No conversation matches your search.' : 'No conversations yet.'}
          </div>
        )}
      </nav>
    </>
  );
};

const PromptRow = ({ prompt, onUse, onEdit, onDelete }) => {
  const [ armed, setArmed ] = useState(false);
  const onDeleteClick = (e) => {
    e.stopPropagation();
    if (!armed) {
      setArmed(true);
      setTimeout(() => setArmed(false), 2500);
      return;
    }
    onDelete(prompt.id);
  };
  return (
    <div className="mwai-ws-conv mwai-ws-prompt" onClick={() => onUse(prompt.content)}
      title="Insert into the composer">
      <div className="mwai-ws-conv-title">{prompt.title || 'Untitled'}</div>
      <div className="mwai-ws-conv-meta">
        <span className="mwai-ws-prompt-preview">{prompt.content}</span>
        <span className="mwai-ws-conv-actions">
          <button title="Edit" onClick={(e) => { e.stopPropagation(); onEdit(prompt); }}>
            <svg viewBox="0 0 24 24"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>
          </button>
          <button title={armed ? 'Click again to delete' : 'Delete'} className={armed ? 'armed' : ''} onClick={onDeleteClick}>
            {armed
              ? <svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>
              : <svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>}
          </button>
        </span>
      </div>
    </div>
  );
};

const PromptsPanel = ({ prompts, onSavePrompt, onDeletePrompt, onUsePrompt }) => {
  const [ editing, setEditing ] = useState(null);

  const startNew = () => setEditing({ id: `p${Date.now()}`, title: '', content: '' });
  const commit = () => {
    if (editing.title.trim() && editing.content.trim()) {
      onSavePrompt({ ...editing, title: editing.title.trim() });
    }
    setEditing(null);
  };

  return (
    <>
      <button className="mwai-ws-new-chat" onClick={startNew}>
        <span>New prompt</span>
      </button>

      {editing && (
        <div className="mwai-ws-prompt-editor">
          <input placeholder="Title" value={editing.title} autoFocus
            onChange={e => setEditing({ ...editing, title: e.target.value })} />
          <textarea placeholder="Prompt text…" value={editing.content} rows={5}
            onChange={e => setEditing({ ...editing, content: e.target.value })} />
          <div className="mwai-ws-edit-actions">
            <button className="mwai-ws-edit-cancel" onClick={() => setEditing(null)}>Cancel</button>
            <button className="mwai-ws-edit-save" onClick={commit}>Save</button>
          </div>
        </div>
      )}

      <nav className="mwai-ws-convs">
        {prompts.map(p => (
          <PromptRow key={p.id} prompt={p} onUse={onUsePrompt}
            onEdit={setEditing} onDelete={onDeletePrompt} />
        ))}
        {!prompts.length && !editing && (
          <div className="mwai-ws-empty-list">
            Save your favorite prompts here,<br />and insert them in one click.
          </div>
        )}
      </nav>
    </>
  );
};

const SettingsPanel = ({ prefs, savePrefs }) => {
  const accent = ACCENTS[prefs.accent] || ACCENTS.blue;
  return (
    <div className="mwai-ws-settings">
      <div className="mwai-ws-group-label">Theme</div>
      <div className="mwai-ws-theme-seg">
        <button className={prefs.theme === 'dark' ? 'on' : ''} onClick={() => savePrefs({ theme: 'dark' })}>
          <svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>
          Dark
        </button>
        <button className={prefs.theme === 'light' ? 'on' : ''} onClick={() => savePrefs({ theme: 'light' })}>
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
          Light
        </button>
      </div>

      <div className="mwai-ws-group-label">Accent</div>
      <div className="mwai-ws-accent-row">
        {Object.entries(ACCENTS).map(([name, a]) => (
          <button key={name} title={a.label}
            className={`mwai-ws-swatch ${prefs.accent === name ? 'on' : ''}`}
            style={{ background: `linear-gradient(135deg, ${a.dark}, ${a.light})` }}
            onClick={() => savePrefs({ accent: name })} />
        ))}
        <span className="mwai-ws-accent-name">{accent.label}</span>
      </div>
    </div>
  );
};

const AgentsPanel = () => (
  <div className="mwai-ws-coming">
    <img src={`${(window.mwai_workspace || {}).plugin_url || ''}/images/chat-nyao-2.svg`} alt="" />
    <div className="mwai-ws-coming-title">Agents</div>
    <div className="mwai-ws-coming-sub">
      Assistants that plan, use tools,<br />and work on your site.
    </div>
    <div className="mwai-ws-coming-pill">Coming soon</div>
  </div>
);

const Sidebar = ({ activePanel, collapsed, onCollapse, discussions, listBusy, activeChatId,
  pinnedChats, onTogglePinChat,
  onOpen, onNewChat, onRename, onDelete, onSearch, user, prefs, savePrefs,
  folders, onAssignFolder, onCreateFolder, onRenameFolder, onDeleteFolder, onToggleFolder, onMoveChat,
  onSavePrompt, onDeletePrompt, onUsePrompt }) => {

  const initials = (user.display_name || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside className={`mwai-ws-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="mwai-ws-sidebar-inner">
        <div className="mwai-ws-brand">
          <div className="mwai-ws-brand-text">
            <div className="mwai-ws-brand-name">Workspace</div>
            <div className="mwai-ws-brand-sub">By AI Engine</div>
          </div>
          <button className="mwai-ws-back" title="Hide the panel" onClick={onCollapse}>
            <svg viewBox="0 0 24 24"><path d="M11 17l-5-5 5-5"/><path d="M18 17l-5-5 5-5"/></svg>
          </button>
        </div>

        {activePanel === 'chats' && (
          <ChatsPanel discussions={discussions} listBusy={listBusy} activeChatId={activeChatId}
            pinnedChats={pinnedChats} onTogglePinChat={onTogglePinChat}
            onOpen={onOpen} onNewChat={onNewChat} onRename={onRename} onDelete={onDelete}
            onSearch={onSearch}
            folders={folders} onAssignFolder={onAssignFolder} onCreateFolder={onCreateFolder}
            onRenameFolder={onRenameFolder} onDeleteFolder={onDeleteFolder} onToggleFolder={onToggleFolder}
            onMoveChat={onMoveChat} />
        )}
        {activePanel === 'prompts' && (
          <PromptsPanel prompts={prefs.prompts || []} onSavePrompt={onSavePrompt}
            onDeletePrompt={onDeletePrompt} onUsePrompt={onUsePrompt} />
        )}
        {activePanel === 'agents' && <AgentsPanel />}
        {activePanel === 'settings' && <SettingsPanel prefs={prefs} savePrefs={savePrefs} />}

        <div className="mwai-ws-me">
          <div className="mwai-ws-avatar">{initials}</div>
          <div className="mwai-ws-me-id">
            <div className="mwai-ws-me-name">{user.display_name || 'User'}</div>
            <div className="mwai-ws-me-role">{user.role || ''}</div>
          </div>
          <button className="mwai-ws-theme-swap"
            title={prefs.theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            onClick={() => savePrefs({ theme: prefs.theme === 'dark' ? 'light' : 'dark' })}>
            {prefs.theme === 'dark'
              ? <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>
              : <svg viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
```