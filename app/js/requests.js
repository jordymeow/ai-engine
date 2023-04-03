// Previous: 1.3.65
// Current: 1.3.97

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

// TODO: We should do error handling here, with throw when success is false
// The error should be then caught in the component and displayed to the user
const retrievePostsCount = async (postType) => {
  const res = await nekoFetch(`${apiUrl}/count_posts?postType=${postType}`, { nonce: restNonce });
  return res?.count?.publish ? parseInt(res?.count?.publish) : null;
}

// TODO: We should do error handling here, with throw when success is false
// The error should be then caught in the component and displayed to the user
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
    throw new Error(res.message);
  }
  return res?.chatbots;
}

const updateChatbots = async (chatbots) => {
  const res = await nekoFetch(`${apiUrl}/chatbots`, { method: 'PUT', nonce: restNonce, json: { chatbots } });
  if (!res.success) {
    throw new Error(res?.message);
  }
  return res?.chatbots;
}

const retrieveThemes = async () => {
  const res = await nekoFetch(`${apiUrl}/themes`, { method: 'GET', nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.themes;
}

export { retrievePostTypes, retrievePostsCount, retrievePostContent, retrieveFiles, 
  retrieveDeletedFineTunes, retrieveFineTunes, retrieveChatbots, retrieveThemes, updateChatbots };