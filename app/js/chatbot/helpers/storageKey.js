// Previous: 3.8.7
// Current: 3.8.8

// Preview conversations must never read or overwrite a visitor conversation.
// Keep the existing public key format so saved frontend chats continue to load.
export const chatStorageKey = ({ localMemory, previewSample, isAdminPreview, customId, botId }) => {
  const id = customId || botId;
  if (!localMemory || previewSample || !id) { return null; }
  return `${isAdminPreview ? 'mwai-admin-preview-chat' : 'mwai-chat'}-${id}`;
};

// Until 3.8.7 the admin preview shared the public key, and admins who chat in the preview lost
// their history when it got its own key (wp.org thread, 2026-10-25). Copy that history once
// into the preview key; the public entry is left untouched.
export const readChatStorage = (key) => {
  const saved = localStorage.getItem(key);
  if (saved !== null || !key?.startsWith('mwai-admin-preview-chat-')) { return saved; }
  const legacy = localStorage.getItem(key.replace('mwai-admin-preview-chat-', 'mwai-chat-'));
  if (legacy !== null) { localStorage.setItem(key, legacy); }
  return legacy;
};
