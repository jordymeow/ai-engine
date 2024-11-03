// Previous: 2.4.5
// Current: 2.6.5

import { useMemo, useEffect, useState, useCallback } from 'react';
import { Pencil, Trash } from 'lucide-react';

import { useClasses } from '@app/chatbot/helpers';
import { useDiscussionsContext } from '@app/chatbot/DiscussionsContext';

const Discussion = ({ discussion, onClick = () => {}, selected = false, onEdit = () => {}, onDelete = () => {} }) => {
  const css = useClasses();
  const [hovered, setHovered] = useState(false);
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

  const onDeleteClick = useCallback((e) => {
    e.stopPropagation();
    onDelete(discussion);
  }, [discussion, onDelete]);

  const onEditClick = useCallback((e) => {
    e.stopPropagation();
    onEdit(discussion);
  }, [discussion, onEdit]);

  return (
    <li
      className={baseClasses}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <span className={css('mwai-discussion-title')}>{preview}</span>
      {(hovered) && (
        <div className={css('mwai-discussion-actions')}>
          <div className={css('mwai-icon')} onClick={onEditClick}>
            <Pencil size={18} />
          </div>
          <div className={css(['mwai-icon', 'mwai-danger'])} onClick={onDeleteClick}>
            <Trash size={18} />
          </div>
        </div>
      )}
    </li>
  );
};


const DiscussionsUI = (props) => {
  const { theme, style, params } = props;
  const css = useClasses();
  const themeStyle = useMemo(() => (theme?.type === 'css' ? theme?.style : null), [theme]);

  const { state, actions } = useDiscussionsContext();
  const { botId, cssVariables, discussions, discussion, busy, hasEmptyDiscussion } = state;
  const { onDiscussionClick, onNewChatClick, onEditDiscussion, onDeleteDiscussion } = actions;

  const { textNewChat } = params;

  useEffect(() => {
    // Prepare the API
    // mwaiAPI.open = () => setOpen(true);
    // mwaiAPI.close = () => setOpen(false);
    // mwaiAPI.toggle = () => setOpen(!open);
  }, []);

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
        </div>

        <ul className={css('mwai-content')}>
          {discussions.map((x) => (
            <Discussion
              key={x.id}
              discussion={x}
              selected={discussion?.id === x.id}
              onClick={() => onDiscussionClick(x.chatId)}
              onEdit={onEditDiscussion}
              onDelete={onDeleteDiscussion}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default DiscussionsUI;