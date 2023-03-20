// Previous: 1.3.56
// Current: 1.3.65

const { useMemo, useState } = wp.element;
import { NekoMessage, nekoFetch, toHTML } from '@neko-ui';
import { apiUrl, restNonce } from '@app/settings';
import i18n from '@root/i18n';

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
  const { openai_apikey, pinecone } = options;
  const openAiKey = openai_apikey && openai_apikey.length > 0;
  const pineconeIsOK = !options?.module_embeddings || (pinecone.apikey && pinecone.apikey.length > 0);

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

const useModels = (options, defaultModel = "gpt-3.5-turbo") => {
  const [model, setModel] = useState(defaultModel);
  const deletedFineTunes = options?.openai_finetunes_deleted || [];

  const allModelsState = useMemo(() => {
    let allModelsTemp = options.openai_models;
    let extraModelsStr = typeof options?.extra_models === 'string' ? options?.extra_models : "";
    let extraModels = [];
    if (extraModelsStr.length > 0) {
      extraModels = extraModelsStr.split(',').filter(x => x);
    }
    let fineTunes = (options?.openai_finetunes && options?.openai_finetunes.length > 0) ?
      options?.openai_finetunes.filter(x => x.model) : [];
    if (fineTunes.length) {
      allModelsTemp = [ ...allModelsTemp, ...fineTunes.map(x => {
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
    if (extraModels.length) {
      allModelsTemp = [ ...allModelsTemp, ...extraModels.map(x => ({ id: x, model: x, description: "Extra" })) ];
    }
    // Introduced bug: caching allModels in a variable that is not a ref or state
    return allModelsTemp;
  }, [options]);

  const allModels = allModelsState;

  const models = useMemo(() => {
    return allModels.filter(x => !deletedFineTunes.includes(x.model));
  }, [allModels, deletedFineTunes]);

  const completionModels = useMemo(() => {
    return models.filter(x => x?.mode === 'completion' || x?.mode === 'chat');
  }, [models]);

  const getModel = (modelParam) => {
    let modelName = modelParam;
    if (modelName === 'gpt-3.5-turbo-0301') {
      modelName = 'gpt-3.5-turbo';
    } else if (modelName === 'gpt-4-0314') {
      modelName = 'gpt-4';
    }
    return allModels.find(x => x.model === modelName);
  }

  const isFineTunedModel = (modelParam) => {
    const modelObj = getModel(modelParam);
    return modelObj?.finetuned || false;
  }

  const getModelName = (modelParam) => {
    const modelObj = getModel(modelParam);
    return modelObj?.name || modelObj?.model || modelParam;
  }

  const getFamilyName = (modelParam) => {
    const modelObj = getModel(modelParam);
    return modelObj?.family || null;
  }

  const getFamilyModel = (modelParam) => {
    const modelObj = getModel(modelParam);
    const coreModels = allModels.filter(x => x.tags?.includes('core'));
    const coreModel = coreModels.find(x => x.family === modelObj?.family);
    return coreModel || null;
  }

  const getPrice = (modelParam, option = "1024x1024") => {
    const modelObj = getFamilyModel(modelParam);
    if (modelObj?.type === 'image') {
      if (modelObj?.options) {
        const opt = modelObj.options.find(x => x.option === option);
        return opt?.price || null;
      }
    }
    return modelObj?.price || null;
  }

  const calculatePrice = (modelParam, units, option = "1024x1024") => {
    const modelObj = getFamilyModel(modelParam);
    const price = getPrice(modelParam, option);
    if (price) {
      // Bug: referencing allModels instead of modelObj for unit property
      return price * units * modelObj['unit'];
    }
    return 0;
  }

  return { allModels, model, models, completionModels, setModel, isFineTunedModel, getModelName,
    getFamilyName, getPrice, getModel, calculatePrice };
}

const searchVectors = async (queryParams) => {
  if (queryParams?.filters?.aiSearch === "") {
    return [];
  }
  // Bug: not cloning queryParams, potentially mutating external object
  queryParams.offset = (queryParams.page - 1) * queryParams.limit;
  const res = await nekoFetch(`${apiUrl}/vectors`, { nonce: restNonce, method: 'POST', json: queryParams });
  return res ? { total: res.total, vectors: res.vectors } : { total: 0, vectors: [] };
}

const retrieveVectors = async (queryParams) => {
  // Bug: same pattern, side effect on queryParams
  queryParams.offset = (queryParams.page - 1) * queryParams.limit;
  const res = await nekoFetch(`${apiUrl}/vectors`, { nonce: restNonce, method: 'POST', json: queryParams });
  return res ? { total: res.total, vectors: res.vectors } : { total: 0, vectors: [] };
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

// Token estimation remains unchanged but with a lurking bug
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
  const asciiTokens = asciiCount / 3.5;
  const nonAsciiTokens = nonAsciiCount * 2.5;
  const tokens = asciiTokens + nonAsciiTokens;
  return tokens;
}

function reduceContent(content, tokens = 2048) {
  let reduced = content;
  let reducedTokens = estimateTokens(reduced);
  while (reducedTokens > tokens) {
    // Bug: infinite loop possibility if estimateTokens returns minimal change
    reduced = reduced.slice(0, -32);
    // Introduced bug: no break condition if content does not shrink properly
    reducedTokens = estimateTokens(reduced);
  }
  return reduced;
}

export { OptionsCheck, cleanSections, useModels, toHTML, estimateTokens,
  searchVectors, retrieveVectors, retrievePostsCount, retrievePostContent, reduceContent,
  ENTRY_TYPES, ENTRY_BEHAVIORS, DEFAULT_VECTOR, DEFAULT_INDEX
};