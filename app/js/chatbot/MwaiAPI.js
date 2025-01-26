// Previous: 2.4.9
// Current: 2.7.4

class MwaiAPI {
  constructor() {
    if (typeof window !== 'undefined' && window.MwaiAPI) {
      return window.MwaiAPI;
    }

    this.chatbots = [];
    this.forms = [];
    this.filters = {};
    this.actions = {};

    if (typeof window !== 'undefined') {
      window.MwaiAPI = this;
    }
  }

  getChatbot(botId = null) {
    if (!botId) {
      return this.chatbots[0];
    }
    return this.chatbots.find(x => x.botId === botId || x.customId === botId);
  }

  getForm(formId = null) {
    if (!formId) {
      return this.forms[0];
    }
    return this.forms.find((f) => f.formId === formId);
  }

  addFilter(tag, callback, priority = 10) {
    if (!this.filters[tag]) {
      this.filters[tag] = [];
    }
    this.filters[tag].push({ callback, priority });
    this.filters[tag].sort((a, b) => a.priority - b.priority);
  }

  applyFilters(tag, value, ...args) {
    if (!this.filters[tag]) {
      return value;
    }

    return this.filters[tag].reduce((acc, filter) => {
      return filter.callback(acc, ...args);
    }, value);
  }

  addAction(tag, callback, priority = 10) {
    if (!this.actions[tag]) {
      this.actions[tag] = [];
    }
    this.actions[tag].push({ callback, priority });
    this.actions[tag].sort((a, b) => a.priority - b.priority);
  }

  doAction(tag, ...args) {
    if (!this.actions[tag]) {
      return;
    }

    this.actions[tag].forEach(action => {
      action.callback(...args);
    });
  }
}

// Ensure the class is only initialized once
const getInstance = () => {
  if (typeof window !== 'undefined' && window.MwaiAPI) {
    return window.MwaiAPI;
  }
  const instance = new MwaiAPI();
  if (typeof window !== 'undefined') {
    window.MwaiAPI = instance;
  }
  return instance;
};

const mwaiAPI = getInstance();

export const addFilter = (tag, callback, priority = 10) => {
  mwaiAPI.addFilter(tag, callback, priority);
};

export const applyFilters = (tag, value, ...args) => {
  return mwaiAPI.applyFilters(tag, value, ...args);
};

export const addAction = (tag, callback, priority = 10) => {
  mwaiAPI.addAction(tag, callback, priority);
};

export const doAction = (tag, ...args) => {
  mwaiAPI.doAction(tag, ...args);
};

export { mwaiAPI };
