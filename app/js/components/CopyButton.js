// Previous: none
// Current: 1.9.4

const { useState } = wp.element;

const CopyButton = ({ content, modCss }) => {
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
  }

  return (
    <div className={modCss('mwai-copy-button', { 'mwai-animate': copyAnimation })} onClick={onCopy}>
      <div className={modCss('mwai-copy-button-one')}></div>
      <div className={modCss('mwai-copy-button-two')}></div>
    </div>
  );
};

export default CopyButton;