// Previous: 3.6.3
// Current: 3.8.1

/**
 * StandardMessages Component
 *
 * Visual: scrollable message list with optional shortcuts and blocks inside the scroll area.
 * Used when `messagesType === 'standard'`.
 * Maintenance: if the messages container styling changes, ensure theme CSS
 * for `.mwai-conversation` and scrollbar tweaks are kept in sync.
 */
const { useRef, useEffect, useState } = wp.element;
import ChatbotReply from '../../ChatbotReply';
import ChatbotName from '../../ChatbotName';
import { useChatbotContext } from '../../ChatbotContext';

import { __ } from '@app/chatbot/texts';

const StandardMessages = ({ messages, conversationRef, onScroll, shortcuts, blocks }) => {
  // The hint under the avatar is the owner's text when set, the translated default otherwise.
  const { textEmptyHint } = useChatbotContext().state;
  // Scrolling up in a long conversation left no way back: the widget has no scrollbar of its own
  // on most themes, the auto-scroll has already released, and nothing says how far down the newest
  // message is. This shows a jump-to-latest control whenever the visitor is away from the bottom.
  const [awayFromBottom, setAwayFromBottom] = useState(false);
  const AWAY_PX = 80;

  const checkPosition = () => {
    const c = conversationRef?.current;
    if (!c) { return; }
    setAwayFromBottom(c.scrollHeight - c.scrollTop - c.clientHeight > AWAY_PX);
  };

  // Re-check when the list grows, so a reply arriving while the visitor is reading earlier
  // messages surfaces the control rather than silently landing off screen.
  useEffect(checkPosition, [messages]);

  const handleScroll = (e) => {
    checkPosition();
    if (onScroll) { onScroll(e); }
  };

  const jumpToLatest = () => {
    const c = conversationRef?.current;
    if (!c) { return; }
    c.scrollTo({ top: c.scrollHeight, behavior: 'smooth' });
  };
  // Process messages
  const messageList = messages.map((message, index) => {
    return (
      <ChatbotReply
        key={index}
        message={message}
        conversationRef={conversationRef}
      />
    );
  });

  // A bot without a start sentence used to open on one faint line of text. The bot now introduces
  // itself: its avatar (or name), then the hint. The layout stays inline on purpose: a custom
  // (type "css") theme loads only its own stylesheet, never _common.scss, and would otherwise get
  // an unstyled block. For the same reason the avatar is hidden inline and revealed by
  // .mwai-empty-hint-who in _common.scss, which is also where its size is set.
  const isEmpty = messages.length === 0;

  return (
    <div ref={conversationRef} className="mwai-conversation" onScroll={handleScroll}>
      {isEmpty && (
        <div className="mwai-empty-hint" style={{ display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 10, height: '100%',
          textAlign: 'center', padding: '24px 20px' }}>
          <div className="mwai-empty-hint-who" style={{ display: 'none' }}>
            <ChatbotName role="assistant" />
          </div>
          <span className="mwai-empty-hint-text" style={{ opacity: 0.62, fontSize: '0.95em' }}>
            {textEmptyHint || __('Ask me anything!')}
          </span>
        </div>
      )}
      {messageList}
      {shortcuts}
      {blocks}
      {awayFromBottom && (
        <div className="mwai-jump-anchor">
          <button type="button" className="mwai-jump-to-latest" onClick={jumpToLatest}
            aria-label={__('Jump to the latest message')} title={__('Jump to the latest message')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default StandardMessages;
