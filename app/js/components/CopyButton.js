// Previous: 1.9.4
// Current: 2.4.5

import { useClasses } from "@app/chatbot/helpers";

const { useState } = wp.element;

const CopyButton = ({ content }) => {
  const css = useClasses();
  const [ copyAnimation, setCopyAnimation ] = useState(false);

  const onCopy = () => {
    try {
      navigator.clipboard.writeText(content);
      setCopyAnimation(true);
      setTimeout(function () {
        setCopyAnimation(false);
      }, 1000);
    }
    catch (err) {
      console.warn('Not allowed to copy to clipboard. Make sure your website uses HTTPS.', { content });
    }
  };

  return (
    <div className={css('mwai-copy-button', { 'mwai-animate': copyAnimation })} onClick={onCopy}>
      <div className="mwai-copy-button-one"></div>
      <div className="mwai-copy-button-two"></div>
    </div>
  );
};

export default CopyButton;