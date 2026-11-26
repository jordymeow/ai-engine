// Previous: 3.8.8
// Current: 3.9.7

// Preview conversations must never read or overwrite a visitor conversation.
// Keep the existing public key format so saved frontend chats continue to load.
//
// A signed-in user gets their own entry (-u<ID>). The key used to be the same for everyone on
// a browser, so on a shared computer the next member to sign in saw the previous member's
// conversation (wp.org thread, 2026-11-26). Guests keep the plain key.
export const chatStorageKey = ({ localMemory, previewSample, isAdminPreview, customId, botId, userId }) => {
  const id = customId || botId;
  if (!localMemory || previewSample || !id) { return null; }
  if (isAdminPreview) { return `mwai-admin-preview-chat-${id}`; }
  return userId ? `mwai-chat-${id}-u${userId}` : `mwai-chat-${id}`;
};

// The key the same chatbot uses for a guest: where a signed-in user's conversation lived
// before it got its own entry. Null when there is nothing to move.
export const guestChatStorageKey = ({ customId, botId, userId, isAdminPreview }) => {
  const id = customId || botId;
  return userId && id && !isAdminPreview ? `mwai-chat-${id}` : null;
};

// Until 3.8.7 the admin preview shared the public key, and admins who chat in the preview lost
// their history when it got its own key (wp.org thread, 2026-10-25). Copy that history once
// into the preview key; the public entry is left untouched.
//
// A signed-in user with no entry of their own takes over the guest entry once (their
// conversation from before the update, or the one they started before signing in). It is
// MOVED, not copied: left in place, the next person on this browser would read it.
export const readChatStorage = (key, guestKey = null) => {
  const saved = localStorage.getItem(key);
  if (saved !== null) { return saved; }
  if (guestKey) {
    const guest = localStorage.getItem(guestKey);
    if (guest !== null) {
      localStorage.setItem(key, guest);
      localStorage.removeItem(guestKey);
    }
    return guest;
  }
  if (!key?.startsWith('mwai-admin-preview-chat-')) { return saved; }
  const legacy = localStorage.getItem(key.replace('mwai-admin-preview-chat-', 'mwai-chat-'));
  if (legacy !== null) { localStorage.setItem(key, legacy); }
  return legacy;
};
