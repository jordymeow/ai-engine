// Previous: 1.3.36
// Current: 1.3.44

const { useMemo, useState } = wp.element;
import { NekoMessage, nekoFetch } from '@neko-ui';
import { apiUrl, restNonce } from '@app/settings';

const ENTRY_TYPES = {
  MANUAL: 'manual',
  POST_CONTENT: 'postContent',
  POST_FRAGMENT: 'postFragment'
}

const ENTRY_BEHAVIORS = {
  CONTEXT: 'context',
  ANSWER: 'answer',
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
  const { openai_apikey } = options;
  const valid_key = openai_apikey && openai_apikey.length > 0;

  if (valid_key) {
    return null;
  }

  return (
    <>
      <NekoMessage variant="danger" style={{ marginTop: 0, marginBottom: 25 }}>
        To use the features of AI Engine, you need to have an OpenAI account and create an API Key. Visit the <a href="https://beta.openai.com/account/api-keys" target="_blank">OpenAI</a> website.
      </NekoMessage>
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

const useModels = (options, defaultModel = "gpt-3.5-turbo") => {
  const [model, setModel] = useState(defaultModel);

  const models = useMemo(() => {
    let allModels = options.openai_models;
    let extraModels = typeof options?.extra_models === 'string' ? options?.extra_models : "";
    let fineTunes = (options?.openai_finetunes && options?.openai_finetunes.length > 0) ?
      options?.openai_finetunes.filter(x => x.enabled && x.model) : [];
    if (fineTunes.length) {
      allModels = [ ...allModels, ...fineTunes.map(x => {
        const splitted = x.model.split(':');
        const family = splitted[0];
        return { 
          model: x.model,
          name: `fn: ${x.suffix}/${family}`,
          suffix: x.suffix,
          mode: 'completion',
          family,
          description: "finetuned",
          finetuned: true,
          tags: ['finetune']
        }
      })];
    }
    extraModels = extraModels?.split(',').filter(x => x);
    if (extraModels.length) {
      allModels = [ ...allModels, ...extraModels.map(x => ({ id: x, model: x, description: "Extra" })) ];
    }
    return allModels;
  }, [options]);

  const completionModels = useMemo(() => {
    return models.filter(x => x.mode === 'completion' || x.mode === 'chat');
  }, [models]);

  const getModel = (model) => {
    if (model === 'gpt-3.5-turbo-0301') {
      model = 'gpt-3.5-turbo';
    }
    const found = models.find(x => x.model === model);
    if (!found) {
      return { model, name: model };
    }
    return found;
  }

  const isFineTunedModel = (model) => {
    const modelObj = getModel(model);
    return modelObj?.finetuned || false;
  }

  const getModelName = (model) => {
    const modelObj = getModel(model);
    return modelObj?.name || modelObj?.model || model;
  }

  const getFamilyName = (model) => {
    const modelObj = getModel(model);
    return modelObj?.family || null;
  }

  const getFamilyModel = (model) => {
    const modelObj = getModel(model);
    const coreModels = models.filter(x => x.tags?.includes('core'));
    const coreModel = coreModels.find(x => x.family === modelObj.family);
    return coreModel || null;
  }

  const getPrice = (model, option = "1024x1024") => {
    const modelObj = getFamilyModel(model);
    if (modelObj?.type === 'image') {
      if (modelObj?.options) {
        const opt = modelObj.options.find(x => x.option === option);
        return opt?.price || null;
      }
    }
    return modelObj?.price || null;
  }

  const calculatePrice = (model, units, option = "1024x1024") => {
    const modelObj = getFamilyModel(model);
    const price = getPrice(model, option);
    if (price !== null && price !== undefined) {
      return price * units * (modelObj['unit'] || 1);
    }
    return 0;
  }

  return { model, models, completionModels, setModel, isFineTunedModel, getModelName,
    getFamilyName, getPrice, getModel, calculatePrice };
}

const toHTML = (html) => {
  return <span dangerouslySetInnerHTML={{ __html: html }}></span>
}

const searchVectors = async (queryParams) => {
  if (queryParams?.filters?.aiSearch === "") {
    return [];
  }
  queryParams.offset = (queryParams.page - 1) * queryParams.limit;
  const res = await nekoFetch(`${apiUrl}/vectors`, { nonce: restNonce, method: 'POST', json: queryParams });
  if (res && res.vectors) {
    return { total: res.total, vectors: res.vectors };
  }
  return { total: 0, vectors: [] };
}

const retrieveVectors = async (queryParams) => {
  queryParams.offset = (queryParams.page - 1) * queryParams.limit;
  const res = await nekoFetch(`${apiUrl}/vectors`, { nonce: restNonce, method: 'POST', json: queryParams });
  if (res && res.vectors) {
    return { total: res.total, vectors: res.vectors };
  }
  return { total: 0, vectors: [] };
}

const retrievePostsCount = async (postType) => {
  const res = await nekoFetch(`${apiUrl}/count_posts?postType=${postType}`, { nonce: restNonce });
  return res?.count?.publish ? parseInt(res?.count?.publish) : null;
}

const retrievePostContent = async (postType, offset = 0, postId = 0) => {
  const res = await nekoFetch(`${apiUrl}/post_content?postType=${postType}&offset=${offset}&postId=${postId}`, 
    { nonce: restNonce });
  return res;
}

// Quick and dirty token estimation
// Let's keep this synchronized with PHP's QueryText
function estimateTokens(text) {
  let asciiCount = 0;
  let nonAsciiCount = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char.charCodeAt(0) < 128) {
      asciiCount++;
    }
    else {
      nonAsciiCount++;
    }
  }
  const asciiTokens = asciiCount / 4;
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

export { OptionsCheck, cleanSections, useModels, toHTML, estimateTokens,
  searchVectors, retrieveVectors, retrievePostsCount, retrievePostContent, reduceContent,
  ENTRY_TYPES, ENTRY_BEHAVIORS, DEFAULT_VECTOR, DEFAULT_INDEX
};