// Previous: none
// Current: 3.8.7

// Keep destinations in the URL. Building a link must not change the section
// remembered by another link (or another open admin tab).
export const settingsUrl = (tab, section) => {
  const params = new URLSearchParams({ page: 'mwai_settings', nekoTab: tab });
  if (section) { params.set('mwaiSection', section); }
  return `admin.php?${params.toString()}`;
};

export const hasSiteLimit = (options) => !!(options?.module_statistics && options?.limits?.enabled
  && Number(options.limits.system?.credits) > 0
  && ['price', 'queries', 'units', 'tokens'].includes(options.limits.system?.creditType));

export const knowledgeSetup = (options, chatbots, isRegistered) => {
  if (!isRegistered) { return 'upgrade'; }
  if (!options?.module_embeddings) { return 'enable'; }
  const environments = options?.embeddings_envs || [];
  if (!environments.length) { return 'create'; }
  const connected = (chatbots || []).filter(bot => bot && (!bot.mode || bot.mode === 'chat')).some(bot => {
    const id = bot.embeddingsEnvId === 'default' ? options.embeddings_default_env : bot.embeddingsEnvId;
    return id && environments.some(env => env.id === id);
  });
  return connected ? 'review' : 'connect';
};
