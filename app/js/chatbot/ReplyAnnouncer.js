// Previous: none
// Current: 3.9.6

// Reads a new reply to screen-reader users. The conversation itself is not a live region: a
// reply arrives in dozens of pieces while it streams, and each piece would be announced. So the
// finished reply is copied once, as plain text, into a hidden polite status region.
// Only replies seen being written are announced: a conversation restored from history, or the
// first message of a chatbot, is already on the page when the visitor gets there.

const { useState, useEffect, useRef } = wp.element;
import { useChatbotContext } from './ChatbotContext';
import { plainText } from './helpers';

// Visually hidden, still read. Inline so every theme, and custom ones, get it.
const hidden = { position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden',
  clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', whiteSpace: 'nowrap', border: 0 };

// The reply is Markdown: say the words, not the symbols.
const spoken = (content) => {
  if (typeof content !== 'string') { return ''; }
  const text = content
    .replace(/```[a-z0-9]*\n?/gi, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, '')
    .replace(/[*_`~|]/g, '');
  return plainText(text);
};

const ReplyAnnouncer = () => {
  const { state } = useChatbotContext();
  const { messages } = state;
  const [ text, setText ] = useState('');
  const writing = useRef(false);

  useEffect(() => {
    const last = messages?.[messages.length - 1];
    if (!last || last.role !== 'assistant') { return; }
    if (last.isQuerying || last.isStreaming) {
      writing.current = true;
      return;
    }
    if (writing.current) {
      writing.current = false;
      setText(spoken(last.content));
    }
  }, [messages]);

  // dir="auto" also keeps this text out of the widget root's own dir="auto": without it, the
  // first Hebrew or Arabic reply announced here turned the whole widget right to left.
  return <div className="mwai-reply-announcer" role="status" aria-live="polite" aria-atomic="true" dir="auto" style={hidden}>{text}</div>;
};

export default ReplyAnnouncer;
