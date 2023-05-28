// Previous: 1.4.1
// Current: 1.6.94

const prefix = mwai.prefix;
const domain = mwai.domain;
const restUrl = mwai.rest_url.replace(/\/+$/, "");
const apiUrl = mwai.api_url.replace(/\/+$/, "");
const pluginUrl = mwai.plugin_url.replace(/\/+$/, "");
const userData = mwai.user_data;
const isPro = mwai.is_pro === '1';
const isRegistered = isPro && mwai.is_registered === '1';
const restNonce = mwai.rest_nonce;
const options = mwai.options;
const session = mwai.session;
const pricing = mwai.pricing;
const themes = mwai.themes;
const stream = !!mwai.stream;
const chatbots = mwai.chatbots;

export { prefix, domain, apiUrl, restUrl, pluginUrl, userData, isPro, stream,
  isRegistered, restNonce, session, pricing, options, themes, chatbots };
