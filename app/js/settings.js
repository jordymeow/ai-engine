// Previous: 3.0.8
// Current: 3.1.7

/* eslint-disable no-undef */
import { checkIntegrity } from '@common/integrity-checker';

const prefix = mwai.prefix;
const domain = mwai.domain;
const restUrl = mwai.rest_url.replace(/\/+$/, "");
const apiUrl = mwai.api_url.replace(/\/+$/, "");
const pluginUrl = mwai.plugin_url.replace(/\/+$/, "");
const userData = mwai.user_data;
const isPro = mwai.is_pro === true || mwai.is_pro === 1 || mwai.is_pro === '1';
const isRegistered = isPro && checkIntegrity() && (mwai.is_registered === true || mwai.is_registered === 1 || mwai.is_registered === '1');

let restNonce = mwai.rest_nonce;
const options = mwai.options;
const session = mwai.session;
const themes = mwai.themes;
const stream = !!mwai.stream;
const chatbots = mwai.chatbots;

// Function to update the rest nonce globally
const updateRestNonce = (newNonce) => {
  restNonce = newNonce;
  // Also update it in the global mwai object
  if (typeof mwai !== 'undefined') {
    mwai.rest_nonce = newNonce;
  }
};


// Function to get current rest nonce
const getRestNonce = () => restNonce;

export { prefix, domain, apiUrl, restUrl, pluginUrl, userData, isPro, stream,
  isRegistered, restNonce, session, options, themes, chatbots, updateRestNonce, getRestNonce };
