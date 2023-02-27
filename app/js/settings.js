// Previous: 0.3.5
// Current: 1.1.0

const prefix = mwai.prefix;
const domain = mwai.domain;
const restUrl = mwai.rest_url.replace(/\/+$/, "");
const apiUrl = mwai.api_url.replace(/\/+$/, "");
const pluginUrl = mwai.plugin_url.replace(/\/+$/, "");
const isPro = mwai.is_pro === '1';
const isRegistered = isPro && mwai.is_registered === '1';
const restNonce = mwai.rest_nonce;
const options = mwai.options;
const session = mwai.session;
const pricing = mwai.pricing;

export { prefix, domain, apiUrl, restUrl, pluginUrl, isPro,
  isRegistered, restNonce, session, pricing, options };
