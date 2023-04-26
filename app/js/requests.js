// Previous: 1.6.54
// Current: 1.6.55

// NekoUI
import { nekoFetch } from '@neko-ui';
import { apiUrl, restNonce, session } from '@app/settings';

const retrievePostTypes = async () => {
  const res = await nekoFetch(`${apiUrl}/post_types`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res.postTypes;
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

const retrieveFiles = async () => {
  const res = await nekoFetch(`${apiUrl}/openai_files`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.files?.data;
}

const retrieveDeletedFineTunes = async () => {
  const res = await nekoFetch(`${apiUrl}/openai_deleted_finetunes`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.finetunes;
}

const retrieveFineTunes = async () => {
  const res = await nekoFetch(`${apiUrl}/openai_finetunes`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.finetunes?.data;
}

const retrieveChatbots = async () => {
  const res = await nekoFetch(`${apiUrl}/chatbots`, { method: 'GET', nonce: restNonce });
  if (!res.success) {
    throw new Error(res?.message);
  }
  return res?.chatbots;
}

const updateChatbots = async (chatbots) => {
  const res = await nekoFetch(`${apiUrl}/chatbots`, { method: 'POST', nonce: restNonce, json: { chatbots } });
  if (!res.success) {
    throw new Error(res?.message);
  }
  return res?.chatbots;
}

const retrieveThemes = async () => {
  const res = await nekoFetch(`${apiUrl}/themes`, { method: 'GET', nonce: restNonce });
  return res?.themes;
}

const updateThemes = async (themes) => {
  try {
    const res = await nekoFetch(`${apiUrl}/themes`, { method: 'POST', nonce: restNonce, json: { themes } });
    return res?.themes;
  }
  catch (err) {
    throw err;
  }
}

export { retrievePostTypes, retrievePostsCount, retrievePostContent, retrieveFiles, 
  retrieveDeletedFineTunes, retrieveFineTunes,
  retrieveChatbots, retrieveThemes, updateChatbots, updateThemes };