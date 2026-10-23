// Previous: none
// Current: 3.8.7

// Preview conversations must never read or overwrite a visitor conversation.
// Keep the existing public key format so saved frontend chats continue to load.
export const chatStorageKey = ({ localMemory, previewSample, isAdminPreview, customId, botId }) => {
  const id = customId || botId;
  if (!localMemory || previewSample || !id) { return null; }
  return `${isAdminPreview ? 'mwai-admin-preview-chat' : 'mwai-chat'}-${id}`;
};
