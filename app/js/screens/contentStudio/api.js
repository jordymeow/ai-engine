// Previous: none
// Current: 3.7.9

import { nekoFetch } from '@neko-ui';
import { apiUrl, session, getRestNonce } from '@app/settings';
import { mwaiFetch, mwaiHandleRes } from '@app/helpers';

const complete = async ({ message, instructions, envId, model, stream = false, onStream, signal }) => {
  const body = {
    scope: 'admin-tools', session, message, stream,
    instructions: instructions || undefined,
    envId: envId || undefined,
    model: model || undefined
  };
  const res = await mwaiFetch(`${apiUrl}/ai/completions`, body, getRestNonce(), stream, signal);
  const final = await mwaiHandleRes(res, stream ? onStream : null);
  if (final?.success === false) {
    throw new Error(final.message || 'The request failed.');
  }
  return { text: typeof final?.data === 'string' ? final.data : '', usage: final?.usage || null };
};

// Models wrap JSON in code fences or add a sentence around it; keep only the object.
const parseJSON = (text = '') => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  }
  catch (e) {
    return null;
  }
};

const createDraft = ({ title, content, excerpt, postType, featuredImageId }) => nekoFetch(`${apiUrl}/helpers/create_post`, {
  method: 'POST', nonce: getRestNonce(),
  json: { title, content, excerpt, postType, featuredImageId: featuredImageId || undefined }
});

export { complete, parseJSON, createDraft };
