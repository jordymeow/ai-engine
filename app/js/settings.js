// Previous: 0.1.0
// Current: 0.1.9

const prefix = mwai_meow_plugin.prefix;
const domain = mwai_meow_plugin.domain;
const restUrl = mwai_meow_plugin.rest_url.replace(/\/+$/, "");
const apiUrl = mwai_meow_plugin.api_url.replace(/\/+$/, "");
const pluginUrl = mwai_meow_plugin.plugin_url.replace(/\/+$/, "");
const isPro = mwai_meow_plugin.is_pro === '1';
const isRegistered = isPro && mwai_meow_plugin.is_registered === '1';
const restNonce = mwai_meow_plugin.rest_nonce;
const options = mwai_meow_plugin.options;

export { prefix, domain, apiUrl, restUrl, pluginUrl, isPro, isRegistered, restNonce, options };
