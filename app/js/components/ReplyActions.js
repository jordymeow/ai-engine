// Previous: 2.5.0
// Current: 2.5.3

import { useClasses } from '@app/chatbot/helpers';
const { useState, useEffect, useRef, useCallback } = wp.element;

const svgPathDefault = '<path d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z" />';
const svgPathSuccess = '<path d="M10.7673 18C10.3106 18 9.86749 17.8046 9.54432 17.4555L5.50694 13.1222C4.83102 12.3968 4.83102 11.2208 5.50694 10.4954C6.18287 9.76997 7.27871 9.76997 7.95505 10.4954L10.6794 13.4196L16.9621 5.63976C17.5874 4.86495 18.6832 4.78289 19.4031 5.45388C20.125 6.12487 20.2036 7.29638 19.5759 8.07391L12.0778 17.3589C11.7639 17.7475 11.3119 17.9801 10.8319 18C10.8087 18 10.788 18 10.7673 18Z" />';
const svgPathError = '<path d="M17.7623 17.7626C17.0831 18.4418 15.9549 18.416 15.244 17.705L5.79906 8.26012C5.08811 7.54917 5.0623 6.42098 5.74145 5.74183C6.4206 5.06267 7.54879 5.08849 8.25975 5.79944L17.7047 15.2443C18.4156 15.9553 18.4414 17.0835 17.7623 17.7626Z" /><path d="M17.5508 8.52848L8.52842 17.5509C7.84927 18.23 6.72108 18.2042 6.01012 17.4933C5.29917 16.7823 5.27336 15.6541 5.95251 14.975L14.9749 5.95257C15.6541 5.27342 16.7823 5.29923 17.4932 6.01019C18.2042 6.72114 18.23 7.84933 17.5508 8.52848Z" />';

const ReplyActions = ({ enabled, content, children, className, ...rest }) => {
  const css = useClasses();
  const [ copyStatus, setCopyStatus ] = useState('idle');
  const [ hidden, setHidden ] = useState(true);
  const timeoutRef = useRef(null);
  const hasEnteredRef = useRef(false);

  const onCopy = () => {
    try {
      navigator.clipboard.writeText(content);
      setCopyStatus('success');
    }
    catch (err) {
      setCopyStatus('error');
      console.warn('Not allowed to copy to clipboard. Make sure your website uses HTTPS.', { content });
    }
    finally {
      setTimeout(() => {
        setCopyStatus('idle');
      }, 2000);
    }
  };

  const handleMouseEnter = useCallback(() => {
    if (!hasEnteredRef.current) {
      hasEnteredRef.current = true;
      timeoutRef.current = setTimeout(() => {
        setHidden(false);
      }, 500);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHidden(true);
    hasEnteredRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const svgPath = copyStatus === 'success' ? svgPathSuccess : copyStatus === 'error' ? svgPathError : svgPathDefault;

  return (
    <div {...rest} onMouseLeave={handleMouseLeave} onMouseEnter={handleMouseEnter} onMouseOver={handleMouseEnter}>
      <span className={className}>
        {children}
      </span>
      <div className={css('mwai-reply-actions', { 'mwai-hidden': hidden })}>
        {enabled && <div className="mwai-copy-button" onClick={onCopy}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" dangerouslySetInnerHTML={{ __html: svgPath }} />
        </div>}
      </div>
    </div>
  );
};

export default ReplyActions;