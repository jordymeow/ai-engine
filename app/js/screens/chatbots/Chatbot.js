// Previous: 1.3.97
// Current: 1.4.0

const { useState } = wp.element;
import cssChatGPT from '../../../../themes/ChatGPT.module.css';
import cssIOSDark from '../../../../themes/iOSDark.module.css';

function isUrl(url) {
  return url.indexOf('http') === 0;
}

function handlePlaceholders(data, guestName = 'Guest: ', userData) {
  if (Object.keys(userData).length === 0) {
    return data;
  }
  for (const [placeholder, value] of Object.entries(userData)) {
    if (!data.includes(placeholder)) continue;
    data = data.replace(placeholder, value);
  }
  return data || guestName;
}

function formatUserName(userName, guestName = 'Guest: ', userData, pluginUrl) {
  if (!userName) {
    const user = getCurrentUser();
    if (user) {
      userName = <div class="mwai-avatar"><img src={userData.AVATAR_URL} /></div>;
    } else {
      userName = <div class="mwai-avatar mwai-svg"><img src={`${pluginUrl}/images/avatar-user.svg`} /></div>;
    }
  } else if (isUrl(userName)) {
    userName = <div class="mwai-avatar"><img src={userName} /></div>;
  } else {
    userName = handlePlaceholders(userName, guestName, userData);
    userName = <div class="mwai-name-text">{userName}</div>;
  }
  return userName;
}

function formatAiName(aiName, pluginUrl) {
  if (!aiName) {
    aiName = <div class="mwai-avatar mwai-svg"><img src={`${pluginUrl}/images/avatar-ai.svg`} /></div>;
  } else if (isUrl(aiName)) {
    aiName = <div class="mwai-avatar"><img src={aiName} /></div>;
  } else {
    aiName = <div class="mwai-name-text">{aiName}</div>;
  }
  return aiName;
}

const Chatbot = (props) => {
  const { system, shortcodeParams, shortcodeStyles, style } = props;

  const [ open, setOpen ] = useState(false);
  const [ minimized, setMinimized ] = useState(true);

  let CssVariables = {};
  for (let key in shortcodeStyles) {
    CssVariables[`--mwai-${key}`] = shortcodeStyles[key];
  }
  const atts = shortcodeParams;

  let id = atts.chatId ? atts.chatId : (atts.id ? atts.id : '');
  id = id.replace(/[^a-zA-Z0-9]/g, '');
  const userData = system.userData;
  const sessionId = system.sessionId;
  const restNonce = system.restNonce;
  const pluginUrl = system.pluginUrl;
  const debugMode = system.debugMode; 
  const typewriter = system?.typewriter ?? false;
  const memorizeChat = Boolean(atts.id);

  let guestName = atts.guest_name.trim();
  let textSend = atts.text_send.trim();
  let textClear = atts.text_clear.trim();
  let textInputMaxLength = parseInt(atts.text_input_maxlength);
  let textInputPlaceholder = atts.text_input_placeholder.trim();
  let textCompliance = atts.text_compliance.trim();
  let startSentence = atts.start_sentence.trim();
  let window = Boolean(atts.window);
  let copyButton = Boolean(atts.copy_button);
  let fullscreen = Boolean(atts.fullscreen);
  let icon = atts.icon ? atts.icon.trim() : '';
  let iconText = atts.icon_text.trim();
  let iconAlt = atts.icon_alt.trim();
  let iconPosition = atts.icon_position.trim();
  let themeStyle = atts.style;
  let aiName = atts.ai_name.trim();
  let userName = atts.user_name.trim();

  let iconUrl = pluginUrl + '/images/chat-green.svg';
  if ( icon ) {
    iconUrl = icon;
  }
  else if ( shortcodeStyles['icon'] ) {
    let url = shortcodeStyles['icon'];
    iconUrl = isUrl( url ) ? url : ( pluginUrl + '/images/' + shortcodeStyles['icon'] );
  }

  aiName = formatAiName(aiName, pluginUrl);
  userName = formatUserName(userName, guestName, userData, pluginUrl);
  const rawAiName = 'AI: ';
  const rawUserName = 'User: ';
  
  const casuallyFineTuned = Boolean(atts.casually_fine_tuned);
  const embeddingsIndex = atts.embeddings_index;
  let promptEnding = atts?.prompt_ending?.trim();
  let completionEnding = atts?.completion_ending?.trim();
  if (casuallyFineTuned) {
    promptEnding = "\\n\\n###\\n\\n";
    completionEnding = "\\n\\n";
  }
  const env = atts.env;
  const mode = atts.mode;
  const maxResults = mode === 'chat' ? 1 : parseInt(atts.max_results);
  const maxSentences = atts.max_sentences ? parseInt(atts.max_sentences) : 1;
  const model = atts.model;
  const temperature = atts.temperature;
  const maxTokens = atts.max_tokens;
  const service = atts.service;
  const apiKey = atts.api_key;

  const modCss = (classNames, conditionalClasses, theme = themeStyle) => {
    let cssTheme = cssChatGPT;
    if (theme === 'none') {
      cssTheme = null;
    }
    if (theme === 'iosdark') {
      cssTheme = cssIOSDark;
    }

    if (!Array.isArray(classNames)) {
      classNames = [classNames];
    }
    if (conditionalClasses) {
      Object.entries(conditionalClasses).forEach(([className, condition]) => {
        if (condition) { classNames.push(className); }
      });
    }

    return classNames.map(className => {
      if (!cssTheme) {
        return className;
      }
      else if (cssTheme[className]) {
        return `${className} ${cssTheme[className]}`;
      }
      else {
        console.warn(`The class name "${className}" is not defined in the CSS theme.`);
        return className;
      }
    }).join(' ');
  };

  const baseClasses = modCss('mwai-chat', { 
    'mwai-window': window,
    'mwai-open': open,
    'mwai-fullscreen': !minimized,
    'mwai-bottom-left': iconPosition === 'bottom-left',
    'mwai-top-right': iconPosition === 'top-right',
    'mwai-top-left': iconPosition === 'top-left',
  });

  return (<>
    <div className={baseClasses}
      style={{ ...CssVariables, ...style }}>

      {window && (<>
        <div class={modCss('mwai-open-button')}>
          {iconText && <div class={modCss('mwai-icon-text')}>{iconText}</div>}
          <img width="64" height="64" alt={iconAlt} src={iconUrl}
            onClick={() => setOpen(!open)}
          />
        </div>
        <div class={modCss('mwai-header')}>
          <div class={modCss('mwai-buttons')}>
            {fullscreen && 
              <div class={modCss('mwai-resize-button')}
                onClick={() => setMinimized(!minimized)}
              />
            }
            <div class={modCss('mwai-close-button')}
              onClick={() => setOpen(!open)}
            />

          </div>
        </div>
      </>)}

      <div className={modCss('mwai-content')}>
        <div className={modCss('mwai-conversation')}>
          <div className={modCss('mwai-reply') + ' ' + modCss('mwai-ai')}>
            <span className={modCss('mwai-name')}>
              <div className={modCss('mwai-name-text')}>{aiName}</div>
            </span>
            <span className={modCss('mwai-text')}>{startSentence}</span>
            {copyButton && <div className={modCss('mwai-copy-button')}>
              <div className={modCss('mwai-copy-button-one')}></div>
              <div className={modCss('mwai-copy-button-two')}></div>
            </div>}
          </div>
        </div>
        <div className={modCss('mwai-input')}>
          <textarea rows="1" maxLength={textInputMaxLength} placeholder={textInputPlaceholder} ></textarea>
          <button>
            <span>{textSend} {textClear}</span>
          </button>
        </div>
        {textCompliance && <div class={modCss('mwai-compliance')}>
          {textCompliance}
        </div>}
      </div>
    </div>
  </>);
};

export default Chatbot;