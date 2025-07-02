// Previous: none
// Current: 2.8.5

// Global token manager to share REST nonce across all components
class TokenManager {
  constructor() {
    this.token = null;
    this.listeners = new Set();
  }

  setToken(token) {
    if (this.token !== token) {
      this.token = token;
      this.notifyListeners();
    }
  }

  getToken() {
    return this.token;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.token));
  }
}

// Create a singleton instance
const tokenManager = new TokenManager();

// Initialize with the global token if available
if (typeof window !== 'undefined' && window.mwai && window.mwai.rest_nonce) {
  tokenManager.setToken(window.mwai.rest_nonce);
}

export default tokenManager;