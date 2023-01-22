// Previous: 0.3.4
// Current: 0.3.5

const prefix = mwai_meow_plugin.prefix;
const domain = mwai_meow_plugin.domain;
const restUrl = mwai_meow_plugin.rest_url.replace(/\/+$/, "");
const apiUrl = mwai_meow_plugin.api_url.replace(/\/+$/, "");
const pluginUrl = mwai_meow_plugin.plugin_url.replace(/\/+$/, "");
const isPro = mwai_meow_plugin.is_pro === '1';
const isRegistered = isPro && mwai_meow_plugin.is_registered === '1';
const restNonce = mwai_meow_plugin.rest_nonce;
const options = mwai_meow_plugin.options;
const session = mwai_meow_plugin.session;
const pricing = mwai_meow_plugin.pricing;

export { prefix, domain, apiUrl, restUrl, pluginUrl, isPro,
  isRegistered, restNonce, session, pricing, options };
