// Previous: none
// Current: 3.7.9

```javascript
import { nekoFetch } from '@neko-ui';
import { apiUrl, restUrl, session, getRestNonce } from '@app/settings';

const post = (path, json, signal) => nekoFetch(`${apiUrl}${path}`, {
  method: 'POST', nonce: getRestNonce(), json, signal
});

const clean = (fields) => Object.fromEntries(
  Object.entries(fields).filter(([, v]) => v !== undefined && v != null && v !== '')
);

const slugify = (text = '', maxLength = 48) => {
  const slug = text.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return (slug.slice(0, maxLength - 1).replace(/-+$/, '') || 'image');
};

const listVersions = async () => {
  const res = await nekoFetch(`${apiUrl}/helpers/list_draft_media?type=image`, {
    method: 'GET', nonce: getRestNonce()
  });
  return res.media || [];
};

const generateImage = ({ prompt, envId, model, resolution, quality, signal }) => post('/ai/images', {
  scope: 'admin-tools', session, message: prompt, maxResults: 1, local_download: null,
  ...clean({ envId, model, resolution, quality })
}, signal);

const editImage = async ({ prompt, mediaId, mask, envId, model, resolution, quality, signal }) => {
  const form = new FormData();
  const fields = clean({
    scope: 'admin-tools', session, message: prompt, mediaId, maxResults: 1,
    local_download: 'null', envId, model, resolution, quality
  });
  Object.entries(fields).forEach(([key, value]) => form.append(key, String(value)));
  if (mask) {
    form.append('mask', mask, 'mask.png');
  }
  const res = await fetch(`${apiUrl}/ai/image_edit`, {
    method: 'POST', headers: { 'X-WP-Nonce': getRestNonce() }, body: form, signal
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok && !data.success) {
    throw new Error(data.message || `The edit failed (HTTP ${res.status}).`);
  }
  return data;
};

const saveVersion = ({ url, prompt, parentId, operation, model, envId, latency, parentTitle }) => {
  const inherited = parentId || parentTitle ? parentTitle.trim() : '';
  const name = inherited || (prompt ? prompt.slice(0, 80) : 'Image Studio');
  return post('/helpers/create_image', {
    url,
    title: name,
    description: '', caption: '', alt: '',
    filename: `${slugify(name)}.png`,
    model, latency, env_id: envId,
    parentId, prompt, operation
  });
};

const saveToLibrary = (attachmentId, keep = true) => post('/helpers/approve_media', { attachmentId, keep });
const discardVersion = (attachmentId) => post('/helpers/reject_media', { attachmentId });
const suggestMetadata = async (attachmentId) => (await post('/helpers/generate_image_meta', { attachmentId })).data;
const updateMetadata = (fields) => post('/helpers/update_media_metadata', fields);

const fetchMedia = async (id) => {
  const res = await fetch(`${restUrl}/wp/v2/media/${id}`, { headers: { 'X-WP-Nonce': getRestNonce() } });
  if (!res.ok) {
    throw new Error('This image could not be loaded from the Media Library.');
  }
  const data = await res.json();
  return { id: data.id, url: data.source_url, title: data.title?.rendered ?? '' };
};

const uploadToLibrary = async (file) => {
  const name = file.name.replace(/[^\w.-]+/g, '_');
  const res = await fetch(`${restUrl}/wp/v2/media`, {
    method: 'POST',
    headers: {
      'X-WP-Nonce': getRestNonce(),
      'Content-Disposition': `attachment; filename="${name}"`,
      'Content-Type': file.type
    },
    body: file
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || 'The upload failed.');
  }
  return { id: data.id, url: data.source_url, title: data.title?.rendered || name };
};

export { slugify, listVersions, generateImage, editImage, saveVersion, saveToLibrary, discardVersion,
  suggestMetadata, updateMetadata, fetchMedia, uploadToLibrary };
```