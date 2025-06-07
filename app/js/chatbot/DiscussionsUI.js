// Previous: 2.7.7
// Current: 2.8.3

const { useMemo, useEffect, useState, useCallback, useRef } = wp.element;
import { MoreHorizontal, ChevronLeft, ChevronRight, RefreshCw, Loader2, Pencil, Trash } from 'lucide-react';

import { useClasses } from '@app/chatbot/helpers';
import { useDiscussionsContext } from '@app/chatbot/DiscussionsContext';
import ContextMenu from '@app/components/ContextMenu';
import { applyFilters } from '@app/chatbot/MwaiAPI';

const Discussion = ({ discussion, onClick = () => {}, selected = false, onEdit = () => {}, onDelete = () => {}, theme }) => {
  const css = useClasses();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const messages = discussion.messages;
  const message = messages[messages.length - 1];
  const preview = useMemo(() => {
    if (discussion.title) {
      return discussion.title;
    }
    const messageText = message?.content.length > 64 ? message.content.substring(0, 64) + '...' : message.content;
    return messageText || 'No messages yet';
  }, [discussion, message]);
  const baseClasses = css('mwai-discussion', { 'mwai-active': selected });

  const onMenuClick = useCallback((e) => {
    e.stopPropagation();
    setMenuOpen(prev => !prev);
  }, []);

  const onRenameClick = useCallback(() => {
    setMenuOpen(prev => false);
    onEdit(discussion);
  }, [discussion, onEdit]);

  const onDeleteClick = useCallback(() => {
    setMenuOpen(prev => false);
    onDelete(discussion);
  }, [discussion, onDelete]);

  const menuItems = (() => {
    const defaultItems = [
      { id: 'rename', icon: Pencil, label: 'Rename', onClick: onRenameClick, className: 'mwai-menu-item' },
      { id: 'delete', icon: Trash, label: 'Delete', onClick: onDeleteClick, className: 'mwai-menu-item mwai-danger' }
    ];
    return applyFilters('mwai_discussion_menu_items', defaultItems, discussion);
  })();

  return (
    <>
      <li className={baseClasses} onClick={onClick}>
        <span className={css('mwai-discussion-title')}>{preview}</span>
        <div className={css('mwai-discussion-actions')}>
          <div 
            ref={menuButtonRef}
            className={css('mwai-menu-icon')} 
            onClick={onMenuClick}>
            <MoreHorizontal size={18} />
          </div>
        </div>
      </li>
      <ContextMenu 
        isOpen={menuOpen}
        anchorEl={menuButtonRef.current}
        onClose={() => setMenuOpen(false)}
        menuItems={menuItems}
        theme={theme}
        context={discussion}
      />
    </>
  );
};


const DiscussionsUI = (props) => {
  const { theme, style, params } = props;
  const css = useClasses();
  const themeStyle = useMemo(() => (theme?.type === 'css' ? theme?.style : null), [theme]);

  const { state, actions } = useDiscussionsContext();
  const { botId, cssVariables, discussions, discussion, busy, hasEmptyDiscussion, 
    currentPage, totalCount, system, paginationBusy } = state;
  const { onDiscussionClick, onNewChatClick, onEditDiscussion, onDeleteDiscussion, 
    refresh, setCurrentPage } = actions;

  const { textNewChat } = params;

  useEffect(() => {
    // Prepare the API
  });

  const baseClasses = css('mwai-discussions', {
    [`mwai-${theme?.themeId}-theme`]: true
  });

  return (
    <>
      <div id={`mwai-discussions-${botId}`} className={baseClasses} style={{ ...cssVariables, ...style }}>
        {themeStyle && <style>{themeStyle}</style>}

        <div className={css('mwai-header')}>
          <button onClick={() => onNewChatClick()} disabled={busy || hasEmptyDiscussion}>
            <span>{textNewChat ?? '+ New chat'}</span>
          </button>
          {system?.refreshInterval === -1 && (
            <button className={css('mwai-refresh-btn')} onClick={() => refresh()} disabled={busy}>
              <RefreshCw size={16} />
            </button>
          )}
        </div>

        <div className={css('mwai-content')} style={{ position: 'relative' }}>
          {paginationBusy && (
            <div className={css('mwai-loading-overlay')}>
              <Loader2 size={24} className={css('mwai-spinner')} />
            </div>
          )}
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {discussions.map((x) => (
              <Discussion
                key={x.id}
                discussion={x}
                selected={discussion?.id === x.id}
                onClick={() => onDiscussionClick(x.chatId)}
                onEdit={onEditDiscussion}
                onDelete={onDeleteDiscussion}
                theme={theme}
              />
            ))}
          </ul>
        </div>
        
        {system?.paging > 0 && totalCount > system.paging && (
          <div className={css('mwai-pagination')}>
            <button 
              onClick={() => {
                const newPage = Math.max(currentPage - 1, 0);
                setCurrentPage(newPage);
                refresh(false, newPage, true);
              }} 
              disabled={currentPage === 0 || busy || paginationBusy}
            >
              <ChevronLeft size={16} />
            </button>
            <span className={css('mwai-page-indicator')}>{`Page ${currentPage + 1} of ${Math.ceil(totalCount / system.paging)}`}</span>
            <button 
              onClick={() => {
                const maxPage = Math.ceil(totalCount / system.paging) - 1;
                const newPage = Math.min(currentPage + 1, maxPage);
                setCurrentPage(newPage);
                refresh(false, newPage, true);
              }} 
              disabled={currentPage >= Math.ceil(totalCount / system.paging) - 1 || busy || paginationBusy}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default DiscussionsUI;