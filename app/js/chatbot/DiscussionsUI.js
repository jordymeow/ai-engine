// Previous: 1.6.81
// Current: 1.6.82

// React & Vendor Libs
const { useState, useMemo, useEffect, useLayoutEffect, useRef } = wp.element;

import { useModClasses } from '@app/chatbot/helpers';
import { useDiscussionsContext } from '@app/chatbot/DiscussionsContext';

const Discussion = ({ discussion, onClick = () => {} }) => {
  const messages = discussion.messages;
  const message = messages[messages.length - 1];
  const messageText = message.content.length > 64 ? message.content.substring(0, 64) + '...' : message.content;
  return (
    <li onClick={onClick}>{messageText}</li>
  );
}

const DiscussionsUI = (props) => {
  const { theme, style } = props;
  const { modCss } = useModClasses(theme);
  const themeStyle = useMemo(() => theme?.type === 'css' ? theme?.style : null, [theme]);

  const { state, actions } = useDiscussionsContext();
  const { botId, cssVariables, discussions, busy } = state;
  const { onDiscussionClick } = actions;

  useEffect(() => {
    // Prepare the API
    // mwaiAPI.open = () => setOpen(true);
    // mwaiAPI.close = () => setOpen(false);
    // mwaiAPI.toggle = () => setOpen(!open);
  });

  const baseClasses = modCss('mwai-discussions', { 
  });

  return (<>
    <div id={`mwai-discussions-${botId}`} className={baseClasses} style={{ ...cssVariables, ...style }}>
      {themeStyle && <style>{themeStyle}</style>}
      <ul>
        <button disabled={discussions.length === 0}>+ New chat</button>
        {discussions.map(x => <Discussion key={x.id} discussion={x}
          onClick={() => onDiscussionClick(x.chatId)}
        />)}
      </ul>
    </div>
  </>);
};

export default DiscussionsUI;
