// Previous: none
// Current: 1.6.81

// React & Vendor Libs
const { useState, useMemo, useEffect, useLayoutEffect, useRef } = wp.element;

import { useModClasses } from '@app/chatbot/helpers';
import { useDiscussionsContext } from '@app/chatbot/DiscussionsContext';

const Discussion = ({ discussion, onClick = () => {} }) => {
  const messages = discussion.messages;
  const message = messages[messages.length - 1];
  const messageText = message.text.length > 64 ? message.text.substring(0, 64) + '...' : message.text;
  return (
    <li onClick={onClick}>{messageText}</li>
  );
}

const DiscussionsUI = (props) => {
  const { theme, style } = props;
  const { modCss } = useModClasses(theme);
  const themeStyle = useMemo(() => theme?.type === 'css' ? theme?.style : null, [theme]);

  const { state, actions } = useDiscussionsContext();
  const { chatId, cssVariables, discussions, busy } = state;
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
    <div id={`mwai-discussions-${chatId}`} className={baseClasses} style={{ ...cssVariables, ...style }}>
      {themeStyle && <style>{themeStyle}</style>}
      <ul>
        {discussions.map(x => <Discussion key={x.id} discussion={x}
          onClick={() => onDiscussionClick(x.chatId)}
        />)}
      </ul>
    </div>
  </>);
};

export default DiscussionsUI;
