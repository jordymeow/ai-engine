// Previous: none
// Current: 2.8.3

const { useMemo } = wp.element;
import { compiler } from 'markdown-to-jsx';
import { BlinkingCursor } from '@app/helpers';

// Display a clickable link with additional file information
const LinkContainer = ({ href, children }) => {
  if (!href) {
    return <span>{children}</span>;
  }

  const target = '_blank';
  const isFile = String(children) === "Uploaded File";

  if (isFile) {
    const filename = href.split('/').pop();
    return (
      <a href={href} target={target} rel="noopener noreferrer" className="mwai-filename">
        <span>✓ {filename}</span>
      </a>
    );
  }

  return (
    <a href={href} target={target} rel="noopener noreferrer">
      {children}
    </a>
  );
};

const ChatbotContent = ({ message }) => {
  let content = message.content ?? "";
  
  // Ensure this is enclosed markdown
  const matches = (content.match(/```/g) || []).length;
  if (matches % 2 !== 0) { // if count is odd
    content += "\n```"; // add ``` at the end
  }

  const markdownOptions = useMemo(() => {
    const options = {
      overrides: {
        BlinkingCursor: { component: BlinkingCursor },
        a: {
          component: LinkContainer
        },
        // Max width for images should be 300px
        img: {
          props: {
            onError: (e) => {
              const src = e.target.src;
              const isImage = src.match(/\.(jpeg|jpg|gif|png)$/) !== null;
              if (isImage) {
                e.target.src = "https://placehold.co/600x200?text=Expired+Image";
                return;
              }
            },
            className: "mwai-image",
          },
        }
      }
    };
    return options;
  }, []);

  const renderedContent = useMemo(() => {
    let out = "";
    try {
      out = compiler(content, markdownOptions);
    }
    catch (e) {
      console.error("Crash in markdown-to-jsx! Reverting to plain text.", { e, content });
      out = content;
    }
    return out;
  }, [content, markdownOptions]);

  // If streaming, always show the blinking cursor
  if (message.isStreaming) {
    return (
      <>
        {renderedContent}
        <BlinkingCursor />
      </>
    );
  }

  return renderedContent;
};

export default ChatbotContent;