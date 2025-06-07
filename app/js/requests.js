// Previous: 2.3.5
// Current: 2.8.3

// NekoUI
import { nekoFetch } from '@neko-ui';
import { apiUrl, restUrl, restNonce } from '@app/settings';


//#region Posts

const retrievePostTypes = async () => {
  const res = await nekoFetch(`${apiUrl}/helpers/post_types`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res.postTypes;
};

const retrievePostsCount = async (postType) => {
  const res = await nekoFetch(`${apiUrl}/helpers/count_posts?postType=${postType}`, { nonce: restNonce });
  return res?.count ? parseInt(res?.count) : null;
};

const retrievePostContent = async (postType, offset = 0, postId = 0) => {
  const res = await nekoFetch(`${apiUrl}/helpers/post_content?postType=${postType}&offset=${offset}&postId=${postId}`, 
    { nonce: restNonce });
  return res;
};

//#endregion

//#region Files

const deleteFiles = async (files) => {
  const res = await nekoFetch(`${restUrl}/mwai-ui/v1/files/delete`, { nonce: restNonce, method: 'POST', json: { files } });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res;
};

const retrieveFilesFromOpenAI = async (envId = null, purpose = null) => {
  let url = `${apiUrl}/openai/files/list?envId=${envId}`;
  if (purpose) {
    url += `&purpose=${purpose}`;
  }
  const res = await nekoFetch(url, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.files?.data;
};

const retrieveFiles = async ({ userId = null, purpose = null, metadata = null, envId = null, limit = 10, page = 0 }) => {
  const res = await nekoFetch(`${restUrl}/mwai-ui/v1/files/list`, { nonce: restNonce, method: 'POST',
    json: { userId, purpose, metadata, envId, limit, page }
  });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.data;
}

const retrieveDeletedFineTunes = async (envId = null, legacy = false) => {
  const res = await nekoFetch(`${apiUrl}/openai/finetunes/list_deleted?envId=${envId}&legacy=${legacy}`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.finetunes;
};

//#endregion

//#region Themes

const retrieveThemes = async () => {
  const res = await nekoFetch(`${apiUrl}/settings/themes`, { method: 'GET', nonce: restNonce });
  return res?.themes;
};

const updateThemes = async (themes) => {
  const themeIds = [];
  for (let i = 0; i < themes.length; i++) {
    let themeId = themes[i].themeId;
    if (themeIds.includes(themeId)) {
      let j = 1;
      while (themeIds.includes(themeId + '-' + j)) {
        j++;
      }
      themeId = themeId + '-' + j;
    }
    themeIds.push(themeId);
    themes[i].themeId = themeId;
  }

  const res = await nekoFetch(`${apiUrl}/settings/themes`, { method: 'POST', nonce: restNonce, json: { themes } });
  return res?.themes;
};

//#endregion

//#region Chatbots

const retrieveModels = async () => {
  const res = await nekoFetch(`${apiUrl}/openai/models`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.models;
};

const retrieveFineTunes = async (envId = null, legacy = false) => {
  const res = await nekoFetch(`${apiUrl}/openai/finetunes/list?envId=${envId}&legacy=${legacy}`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.finetunes;
};

const retrieveChatbots = async () => {
  const res = await nekoFetch(`${apiUrl}/settings/chatbots`, { method: 'GET', nonce: restNonce });
  if (!res.success) {
    throw new Error(res?.message);
  }
  return res?.chatbots;
};

const updateChatbots = async (chatbots) => {
  const res = await nekoFetch(`${apiUrl}/settings/chatbots`, { method: 'POST', nonce: restNonce, json: { chatbots } });
  if (!res.success) {
    throw new Error(res?.message);
  }
  return res?.chatbots;
};

const retrieveAssistants = async (envId) => {
  const res = await nekoFetch(`${apiUrl}/openai/assistants/list?envId=${envId}`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.assistants;
}

const setAssistantFunctions = async (envId, assistantId, functions) => {
  const res = await nekoFetch(`${apiUrl}/openai/assistants/set_functions`, { method: 'POST', nonce: restNonce,
    json: { envId, assistantId, functions }
  });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res;
}

//#endregion

//#region Options

const retrieveOptions = async () => {
  const res = await nekoFetch(`${apiUrl}/settings/options`, { method: 'GET', nonce: restNonce });
  return res?.options;
};

const retrieveEmbeddingsEnvironments = async () => {
  const options = await retrieveOptions();
  return options?.embeddings_envs || [];
};

//#endregion

//#region Logs

const refreshLogs = async () => {
  try {
    const res = await nekoFetch(`${apiUrl}/get_logs`, { nonce: restNonce, method: 'GET' });
    return res.data;
  }
  catch (err) {
    throw new Error(err.message);
  }
};

const clearLogs = async () => {
  try {
    await nekoFetch(`${apiUrl}/clear_logs`, { nonce: restNonce });
  }
  catch (err) {
    throw new Error(err.message);
  }
};

//#endregion

export { retrievePostTypes, retrievePostsCount, retrievePostContent,
  retrieveFilesFromOpenAI, retrieveFiles, deleteFiles, setAssistantFunctions,
  retrieveDeletedFineTunes, retrieveFineTunes, retrieveModels, retrieveAssistants, retrieveOptions,
  retrieveChatbots, retrieveThemes, updateChatbots, updateThemes,
  refreshLogs, clearLogs, retrieveEmbeddingsEnvironments
};