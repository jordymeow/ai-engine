// Previous: 1.3.90
// Current: 1.3.91

// React & Vendor Libs
const { useState } = wp.element;
import css from '../../../../themes/ChatGPT.module.css';

const modCss = (className) => {
  return `${className} ${css[className]}`;
};

const Chatbot = (props) => {
  const { shortcodeParams, shortcodeStyles } = props;
  let CssVariables = {};
  for (let key in shortcodeStyles) {
    CssVariables[`--mwai-${key}`] = shortcodeStyles[key];
  }

  const aiName = shortcodeParams?.ai_name || 'AI';

  return (<div className={modCss('mwai-chat')} style={CssVariables}>
  <div className={modCss('mwai-content')}>
    <div className={modCss('mwai-conversation')}>
      <div className={modCss('mwai-reply') + ' ' + modCss('mwai-ai')}>
        <span className={modCss('mwai-name')}>
          <div className={modCss('mwai-name-text')}>{aiName}</div>
        </span>
        <span className={modCss('mwai-text')}>Hey, what's up?</span>
        <div className={modCss('mwai-copy-button')}>
          <div className={modCss('mwai-copy-button-one')}></div>
          <div className={modCss('mwai-copy-button-two')}></div>
        </div>
      </div>
    </div>
    <div className={modCss('mwai-input')}>
      <textarea rows="1" maxLength="512" placeholder="Type your message..." ></textarea>
      <button>
        <span>Send</span>
      </button>
    </div>
  </div>
</div>);
};

export default Chatbot;
