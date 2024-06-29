// Previous: 2.4.1
// Current: 2.4.5

// React & Vendor Libs
const { useMemo, useEffect } = wp.element;

import { useClasses } from '@app/chatbot/helpers';
import { useDiscussionsContext } from '@app/chatbot/DiscussionsContext';

const Discussion = ({ discussion, onClick = () => {}, selected = false }) => {
  const css = useClasses();
  const messages = discussion.messages;
  const message = messages[messages.length - 1];
  const messageText = message.content.length > 64 ? message.content.substring(0, 64) + '...' : message.content;
  const baseClasses = css('mwai-discussion', { 'mwai-active': selected });

  return (
    <li className={baseClasses} onClick={onClick}>{messageText}</li>
  );
};

const DiscussionsUI = (props) => {
  const { theme, style, params } = props;
  const css = useClasses();
  const themeStyle = useMemo(() => theme?.type === 'css' ? theme?.style : null, [theme]);

  const { state, actions } = useDiscussionsContext();
  const { botId, cssVariables, discussions, discussion, busy } = state;
  const { onDiscussionClick, onNewChatClick } = actions;

  const { textNewChat } = params;

  useEffect(() => {
    // Prepare the API
    // mwaiAPI.open = () => setOpen(true);
    // mwaiAPI.close = () => setOpen(false);
    // mwaiAPI.toggle = () => setOpen(!open);
  });

  const baseClasses = css('mwai-discussions', {
    [`mwai-${theme?.themeId}-theme`]: true
  });

  return (<>
    <div id={`mwai-discussions-${botId}`} className={baseClasses} style={{ ...cssVariables, ...style }}>
      {themeStyle && <style>{themeStyle}</style>}

      <div className={css('mwai-header')}>
        <button onClick={() => onNewChatClick()} disabled={busy}>
          <span>{textNewChat ?? '+ New chat'}</span>
        </button>
      </div>

      <ul className={css('mwai-content')}>
        {discussions.map(x => <Discussion key={x.id} discussion={x} selected={discussion?.id === x.id}
          onClick={() => onDiscussionClick(x.chatId)}
        />)}
      </ul>
    </div>
  </>);
};

export default DiscussionsUI;
