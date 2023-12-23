// Previous: 2.0.5
// Current: 2.1.1

// NekoUI
import { nekoFetch } from '@neko-ui';
import { apiUrl, restNonce } from '@app/settings';

const retrievePostTypes = async () => {
  const res = await nekoFetch(`${apiUrl}/helpers/post_types`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res.postTypes;
};

const retrievePostsCount = async (postType) => {
  const res = await nekoFetch(`${apiUrl}/helpers/count_posts?postType=${postType}`, { nonce: restNonce });
  return res?.count ? parseInt(res?.count) : 0;
};

const retrievePostContent = async (postType, offset = 0, postId = 0) => {
  const res = await nekoFetch(`${apiUrl}/helpers/post_content?postType=${postType}&offset=${offset}&postId=${postId}`, 
    { nonce: restNonce });
  return res;
};

const retrieveFiles = async (envId = null) => {
  const res = await nekoFetch(`${apiUrl}/openai/files/list?envId=${envId}`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.files?.data || [];
};

const retrieveDeletedFineTunes = async (envId = null, legacy = false) => {
  const res = await nekoFetch(`${apiUrl}/openai/finetunes/list_deleted?envId=${envId}&legacy=${legacy}`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.finetunes || [];
};

const retrieveModels = async () => {
  const res = await nekoFetch(`${apiUrl}/openai/models`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.models || [];
};

const retrieveFineTunes = async (envId = null, legacy = false) => {
  const res = await nekoFetch(`${apiUrl}/openai/finetunes/list?envId=${envId}&legacy=${legacy}`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.finetunes || [];
};

const retrieveChatbots = async () => {
  const res = await nekoFetch(`${apiUrl}/settings/chatbots`, { method: 'GET', nonce: restNonce });
  if (!res.success) {
    throw new Error(res?.message);
  }
  return res?.chatbots || [];
};

const updateChatbots = async (chatbots) => {
  const res = await nekoFetch(`${apiUrl}/settings/chatbots`, { method: 'POST', nonce: restNonce, json: { chatbots } });
  if (!res.success) {
    throw new Error(res?.message);
  }
  return res?.chatbots || [];
};

const retrieveThemes = async () => {
  const res = await nekoFetch(`${apiUrl}/settings/themes`, { method: 'GET', nonce: restNonce });
  return res?.themes || [];
};

const retrieveOptions = async () => {
  const res = await nekoFetch(`${apiUrl}/settings/options`, { method: 'GET', nonce: restNonce });
  return res?.options || [];
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
  return res?.themes || [];
};

const retrieveAssistants = async (envId) => {
  const res = await nekoFetch(`${apiUrl}/openai/assistants/list?envId=${envId}`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.assistants || [];
}

export { retrievePostTypes, retrievePostsCount, retrievePostContent, retrieveFiles, 
  retrieveDeletedFineTunes, retrieveFineTunes, retrieveModels, retrieveAssistants, retrieveOptions,
  retrieveChatbots, retrieveThemes, updateChatbots, updateThemes };