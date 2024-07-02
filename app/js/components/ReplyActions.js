// Previous: none
// Current: 2.4.6

import { useClasses } from '@app/chatbot/helpers';
const { useState, useEffect, useRef, useCallback } = wp.element;

const svgPathDefault = '<path d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z" />';
const svgPathSuccess = '<path d="M9 16.2l-3.5-3.5L5.9 12l2.1 2.1 5.1-5.1L14.5 9l-6 6.2z"/>';
const svgPathError = '<path d="M12 10.585l4.95-4.95 1.415 1.415L13.415 12l4.95 4.95-1.415 1.415L12 13.415l-4.95 4.95-1.415-1.415L10.585 12 5.635 7.05 7.05 5.635 12 10.585z"/>';

const ReplyActions = ({ enabled, content, children, ...rest }) => {
  const css = useClasses();
  const [copyStatus, setCopyStatus] = useState('idle');
  const [hidden, setHidden] = useState(true);
  const timeoutRef = useRef(null);

  const onCopy = () => {
    try {
      navigator.clipboard.writeText(content);
      setCopyStatus('success');
    } catch (err) {
      setCopyStatus('error');
      console.warn('Not allowed to copy to clipboard. Make sure your website uses HTTPS.', { content });
    } finally {
      setTimeout(() => {
        setCopyStatus('idle');
      }, 2000);
    }
  };

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setHidden(false);
    }, 500);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHidden(true);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const svgPath = copyStatus === 'success' ? svgPathSuccess : copyStatus === 'error' ? svgPathError : svgPathDefault;

  if (!enabled) {
    return children;
  }

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} {...rest}>
      <div className={css('mwai-reply-actions', { 'mwai-hidden': hidden })}>
        <div className="mwai-copy-button" onClick={onCopy}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: svgPath }} />
        </div>
      </div>
      {children}
    </div>
  );
};

export default ReplyActions;