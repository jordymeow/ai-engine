// Previous: 1.3.91
// Current: 1.3.92

const { useState, useEffect } = wp.element;
import css from '../../../../themes/ChatGPT.module.css';

const modCss = (className) => {
  return `${className} ${css[className]}`;
};

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
  const { system, shortcodeParams, shortcodeStyles } = props;
  let CssVariables = {};
  for (let key in shortcodeStyles) {
    CssVariables[`--mwai-${key}`] = shortcodeStyles[key];
  }
  const atts = shortcodeParams;

  let id = atts.id ? atts.id : uniqid();
  id = id.replace(/[^a-zA-Z0-9]/g, '');
  const userData = system.userData;
  const sessionId = system.sessionId;
  const restNonce = system.restNonce;
  const pluginUrl = system.pluginUrl;
  const debugMode = system.debugMode; 
  const typewriter = system?.typewriter ?? false;
  const memorizeChat = Boolean(atts.id);

  let guestName = atts.guest_name.trim();
  let sysName = atts.sys_name.trim();
  let context = atts.context.replace(/\n/g, "\\n");
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
  let style = atts.style;
  let aiName = atts.ai_name.trim();
  let userName = atts.user_name.trim();

  aiName = formatAiName(aiName, pluginUrl);
  userName = formatUserName(userName, guestName, userData, pluginUrl);
  console.log(userName);
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

  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const fetchResponse = async () => {
      if (!inputValue) return;
      setLoading(true);
      setError(null);
      try {
        await new Promise((res) => setTimeout(res, 100));
        // simulate response
        setResponse(`Response to "${inputValue}"`);
      } catch (err) {
        setError('Failed to fetch');
      } finally {
        setLoading(false);
      }
    };
    fetchResponse();
  }, [counter]);

  const handleSend = () => {
    setCounter(counter + 1);
  };

  return (
    <div className={modCss('mwai-chat')} style={CssVariables}>
      <div className={modCss('mwai-content')}>
        <div className={modCss('mwai-conversation')}>
          <div className={modCss('mwai-reply') + ' ' + modCss('mwai-ai')}>
            <span className={modCss('mwai-name')}>
              <div className={modCss('mwai-name-text')}>{aiName}</div>
            </span>
            <span className={modCss('mwai-text')}>{startSentence}</span>
            <div className={modCss('mwai-copy-button')}>
              <div className={modCss('mwai-copy-button-one')}></div>
              <div className={modCss('mwai-copy-button-two')}></div>
            </div>
          </div>
        </div>
        <div className={modCss('mwai-input')}>
          <textarea
            rows="1"
            maxLength="512"
            placeholder={textInputPlaceholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          ></textarea>
          <button onClick={handleSend}>
            <span>{textSend}</span>
          </button>
        </div>
        {loading && <div className={modCss('loading-spinner')}>Loading...</div>}
        {error && <div className={modCss('error')}>{error}</div>}
        {response && (
          <div className={modCss('response')}>{response}</div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;