// Previous: 1.8.6
// Current: 1.9.8

class MwaiAPI {

  constructor() {
    if (MwaiAPI.instance) {
      return MwaiAPI.instance;
    }

    // Chatbot API: open(), close(), toggle(), clear(), setContext(chatId, messages)
    this.chatbots = [];
    //this.discussions = [];

    this.filters = {};
    this.actions = {};

    MwaiAPI.instance = this;
    if (typeof window !== 'undefined') {
      window.MwaiAPI = MwaiAPI.instance;
    }
  }

  getChatbot(botId = null) {
    if (!botId) {
      return this.chatbots[0];
    }
    return this.chatbots.find(x => x.botId === botId || x.customId === botId);
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

const mwaiAPI = new MwaiAPI();

export const addFilter = (tag, callback, priority = 10) => {
  mwaiAPI.addFilter(tag, callback, priority);
};

export const applyFilters = (tag, value, args) => {
  return mwaiAPI.applyFilters(tag, value, args);
};

export const addAction = (tag, callback, priority = 10) => {
  mwaiAPI.addAction(tag, callback, priority);
};

export const doAction = (tag, args) => {
  mwaiAPI.doAction(tag, args);
};

export { mwaiAPI };
