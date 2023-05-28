// Previous: 1.6.91
// Current: 1.6.93

const { useMemo, useState, useEffect } = wp.element;
import { NekoMessage, NekoSelect, NekoOption, NekoInput, nekoFetch, toHTML } from '@neko-ui';
import { apiUrl, restNonce } from '@app/settings';

import i18n from '@root/i18n';

const ENTRY_TYPES = {
  MANUAL: 'manual',
  POST_CONTENT: 'postContent',
  POST_FRAGMENT: 'postFragment'
}

const ENTRY_BEHAVIORS = {
  CONTEXT: 'context',
  REPLY: 'reply',
}

const DEFAULT_VECTOR = {
  title: '',
  content: '',
  refId: null,
  type: ENTRY_TYPES.MANUAL,
  behavior: ENTRY_BEHAVIORS.CONTEXT,
}

const DEFAULT_INDEX = {
  name: '',
  podType: 'p2',
}

const OptionsCheck = ({ options }) => {
  const { openai_apikey, pinecone } = options;
  const openAiKey = openai_apikey && openai_apikey.length > 0;
  const pineconeIsOK = !options?.module_embeddings || (pinecone?.apikey && pinecone.apikey.length > 0);

  return (
    <>
      {!openAiKey && <NekoMessage variant="danger" style={{ marginTop: 0, marginBottom: 25 }}>
        {toHTML(i18n.SETTINGS.OPENAI_SETUP)}
      </NekoMessage>}
      {!pineconeIsOK && <NekoMessage variant="danger" style={{ marginTop: 0, marginBottom: 25 }}>
        {toHTML(i18n.SETTINGS.PINECONE_SETUP)}
      </NekoMessage>}
    </>
  );
}

function cleanSections(text) {
  if (!text) {
    return text;
  }
  const lines = text.split('\n');
  const cleanedLines = lines.map(line => {
    line = line.replace(/^\d+\.\s/, '');
    if (line.startsWith('"')) {
      line = line.slice(1);
      if (line.endsWith('"')) {
        line = line.slice(0, -1);
      }
    }
    return line;
  });
  return cleanedLines.filter(x => x).join('\n');
}

const useLanguages = ({ disabled, options, language: startLanguage, customLanguage: startCustom }) => {
  const [ currentLanguage, setCurrentLanguage ] = useState(startLanguage ?? "en");
  const [ isCustom, setIsCustom ] = useState(false);
  const [ customLanguage, setCustomLanguage ] = useState("");
  const languagesObject = options?.languages || [];

  const languages = useMemo(() => {
    return Object.keys(languagesObject).map((key) => {
      return { value: key, label: languagesObject[key] };
    });
  }, [languagesObject]);

  useEffect(() => {
    if (startCustom) {
      setIsCustom(true);
      setCustomLanguage(startCustom);
    } else {
      setIsCustom(false);
      setCustomLanguage("");
      setCurrentLanguage(startLanguage ?? "en");
    }
  }, [startCustom, startLanguage]);

  useEffect(() => {
    setCurrentLanguage(startLanguage);
  }, [startLanguage]);

  useEffect(() => {
    let preferredLanguage = localStorage.getItem('mwai_preferred_language');
    if (preferredLanguage && languages.find(l => l.value === preferredLanguage)) {
      setCurrentLanguage(preferredLanguage);
    } else {
      let detectedLanguage = (document.querySelector('html').lang || navigator.language
        || navigator.userLanguage).substr(0, 2);
      if (languages.find(l => l.value === detectedLanguage)) {
        setCurrentLanguage(detectedLanguage);
      }
    }
  }, []);

  const currentHumanLanguage = useMemo(() => {
    if (isCustom) {
      return customLanguage;
    }
    let systemLanguage = languages.find(l => l.value === currentLanguage);
    if (systemLanguage) {
      return systemLanguage.label;
    }
    console.warn("A system language or a custom language should be set.");
    return "English";
  }, [currentLanguage, customLanguage, isCustom, languages]);

  const onChange = (value, field) => {
    if (value === "custom") {
      setIsCustom(true);
      return;
    }
    setCurrentLanguage(value);
    localStorage.setItem('mwai_preferred_language', value);
  }

  const jsxLanguageSelector = useMemo(() => {
    return (
      <>
        {isCustom && <NekoInput name="customLanguage" disabled={disabled}
          onReset={() => { setIsCustom(false); }}
          description={toHTML(i18n.CONTENT_GENERATOR.CUSTOM_LANGUAGE_HELP)}
          value={customLanguage} onChange={setCustomLanguage} />}
        {!isCustom && <NekoSelect scrolldown name="language" disabled={disabled} 
          description={toHTML(i18n.CONTENT_GENERATOR.CUSTOM_LANGUAGE_HELP)}
          value={currentLanguage} onChange={onChange}>
            {languages.map((lang) => {
              return <NekoOption key={lang.value} value={lang.value} label={lang.label} />
            })}
            <NekoOption key="custom" value="custom" label="Other" />
        </NekoSelect>}
      </>
    )
  }, [currentLanguage, customLanguage, languages, isCustom, disabled]);

  return { jsxLanguageSelector, currentLanguage: isCustom ? 'custom' : currentLanguage,
    currentHumanLanguage, isCustom };
}

const useModels = (options, defaultModel = "gpt-3.5-turbo") => {
  const [model, setModel] = useState(defaultModel);
  const deletedFineTunes = options?.openai_finetunes_deleted || [];

  const allModels = useMemo(() => {
    let modelsList = options.openai_models;
    let extraModelsStr = typeof options?.extra_models === 'string' ? options?.extra_models : "";
    let extraModels = extraModelsStr.split(',').filter(x => x);
    let fineTunes = options?.openai_finetunes ?? [];
    fineTunes = fineTunes.filter(x => x.status === 'succeeded' && x.model);

    if (fineTunes.length) {
      modelsList = [ ...modelsList, ...fineTunes.map(x => {
        const splitted = x.model.split(':');
        const family = splitted[0];
        return { 
          model: x.model,
          name: <>{x.suffix}&nbsp;<small style={{ background: 'var(--neko-green)', color: 'white', padding: '3px 4px',
            margin: '-3px 2px', borderRadius: 3, fontSize: 9, lineHeight: '100%' }}>TUNED</small></>,
          suffix: x.suffix,
          mode: 'completion',
          family,
          description: "finetuned",
          finetuned: true,
          tags: ['finetune']
        }
      })];
    }
    if (extraModels.length) {
      modelsList = [ ...modelsList, ...extraModels.map(x => ({ id: x, model: x, description: "Extra" })) ];
    }
    return modelsList;
  }, [options]);

  const models = useMemo(() => {
    return allModels.filter(x => !deletedFineTunes.includes(x.model));
  }, [allModels, deletedFineTunes]);

  const coreModels = useMemo(() => {
    return allModels.filter(x => x?.tags?.includes('core'));
  }, [allModels]);

  const completionModels = useMemo(() => {
    return models.filter(x => x?.mode === 'completion' || x?.mode === 'chat');
  }, [models]);

  const getModel = (modelName) => {
    let normalized = modelName;
    if (modelName === 'gpt-3.5-turbo-0301' || modelName === 'gpt-35-turbo') {
      normalized = 'gpt-3.5-turbo';
    } else if (modelName === 'gpt-4-0314') {
      normalized = 'gpt-4';
    }
    return allModels.find(x => x.model === normalized);
  }

  const isFineTunedModel = (modelName) => {
    const modelObj = getModel(modelName);
    return modelObj?.finetuned || false;
  }

  const getModelName = (modelName) => {
    const modelObj = getModel(modelName);
    return modelObj?.name || modelObj?.model || modelName;
  }

  const getFamilyName = (modelName) => {
    const modelObj = getModel(modelName);
    return modelObj?.family || null;
  }

  const getFamilyModel = (modelName) => {
    const modelObj = getModel(modelName);
    if(!modelObj || !modelObj.family) return null;
    const coreModel = coreModels.find(x => x.family === modelObj.family);
    return coreModel || null;
  }

  const getPrice = (modelName, option = "1024x1024") => {
    const modelObj = getFamilyModel(modelName);
    if (modelObj?.type === 'image') {
      if (modelObj?.options) {
        const opt = modelObj.options.find(x => x.option === option);
        return opt?.price || null;
      }
    }
    return modelObj?.price || null;
  }

  const calculatePrice = (modelName, units, option = "1024x1024") => {
    const modelObj = getFamilyModel(modelName);
    const price = getPrice(modelName, option);
    if (price && modelObj) {
      return price * units * modelObj['unit'];
    }
    return 0;
  }

  return { allModels, model, models, completionModels, coreModels, 
    setModel, isFineTunedModel, getModelName,
    getFamilyName, getPrice, getModel, calculatePrice };
}

const searchVectors = async (queryParams) => {
  if (queryParams?.filters?.aiSearch === "") {
    return [];
  }
  const params = { ...queryParams, offset: (queryParams.page - 1) * queryParams.limit };
  const res = await nekoFetch(`${apiUrl}/vectors/list`, { nonce: restNonce, method: 'POST', json: params });
  return res ? { total: res.total, vectors: res.vectors } : { total: 0, vectors: [] };
}

const retrieveVectors = async (queryParams) => {
  const params = { ...queryParams, offset: (queryParams.page - 1) * queryParams.limit };
  const res = await nekoFetch(`${apiUrl}/vectors/list`, { nonce: restNonce, method: 'POST', json: params });
  return res ? { total: res.total, vectors: res.vectors } : { total: 0, vectors: [] };
}

const retrievePostsCount = async (postType, postStatus = 'publish') => {
  const res = await nekoFetch(`${apiUrl}/helpers/count_posts?postType=${postType}&postStatus=${postStatus}`, { nonce: restNonce });
  return res?.count ? parseInt(res?.count) : null;
}

const retrievePostContent = async (postType, offset = 0, postId = 0, postStatus = 'publish') => {
  const res = await nekoFetch(`${apiUrl}/helpers/post_content?postType=${postType}&postStatus=${postStatus}&offset=${offset}&postId=${postId}`, 
    { nonce: restNonce });
  return res;
}

function estimateTokens(text) {
  let asciiCount = 0;
  let nonAsciiCount = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char.charCodeAt(0) < 128) {
      asciiCount++;
    } else {
      nonAsciiCount++;
    }
  }
  const asciiTokens = asciiCount / 3.5;
  const nonAsciiTokens = nonAsciiCount * 2.5;
  const tokens = asciiTokens + nonAsciiTokens;
  return tokens;
}

function reduceContent(content, tokens = 2048) {
  let reduced = content;
  let reducedTokens = estimateTokens(reduced);
  while (reducedTokens > tokens) {
    reduced = reduced.slice(0, -32);
    reducedTokens = estimateTokens(reduced);
  }
  return reduced;
}

function tableDateTimeFormatter(value) {
  let time = new Date(value);
  time = new Date(time.getTime() - time.getTimezoneOffset() * 60 * 1000);
  let formattedDate = time.toLocaleDateString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit'
  });
  let formattedTime = time.toLocaleTimeString('ja-JP', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  return <div style={{ textAlign: 'right' }}>{formattedDate}<br /><small>{formattedTime}</small></div>;
}

function tableUserIPFormatter(userId, ip) {
  const formattedIP = ip ? (() => {
    const maxLength = 12;
    let substr = ip.substring(0, maxLength);
    if (substr.length < ip.length) {
      if (substr.endsWith('.')) {
        substr = substr.slice(0, -1);
      }
      return substr + "~";
    }
    return substr;
  })() : '';
  return <>
    {userId && <><a target="_blank" href={`/wp-admin/user-edit.php?user_id=${userId}`}>ID {userId}</a><br /></>}
    <small>{formattedIP}</small>
  </>;
}

const randomHash = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let hash = '';
  for (let i = 0; i < length; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export { OptionsCheck, cleanSections, useModels, toHTML, estimateTokens, useLanguages,
  searchVectors, retrieveVectors, retrievePostsCount, retrievePostContent, reduceContent,
  tableDateTimeFormatter, tableUserIPFormatter, randomHash,
  ENTRY_TYPES, ENTRY_BEHAVIORS, DEFAULT_VECTOR, DEFAULT_INDEX
};