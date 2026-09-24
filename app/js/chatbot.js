// Previous: 2.8.4
// Current: 3.8.1

const { render, Component, createElement } = wp.element;
import ChatbotSystem from '@app/chatbot/ChatbotSystem';
import DiscussionsSystem from '@app/chatbot/DiscussionsSystem';

// Last line of defence. A render error anywhere in a chatbot used to unmount it, and since every
// chatbot is mounted from the same loop below, it also stopped all the ones after it on the page,
// usually including the site-wide popup in the footer. The usual way a crash comes back on every
// page load is the saved conversation, so that is set aside once and the chatbot starts again
// with a fresh one. If it crashes a second time it is not the conversation: render nothing, and
// leave the rest of the page alone.
class WidgetBoundary extends Component {
  state = { failed: false, retried: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    console.error('[MWAI] The chatbot crashed while rendering.', error);
    if (this.state.retried) {
      return;
    }
    try {
      if (this.props.storageKey) {
        localStorage.removeItem(this.props.storageKey);
      }
    }
    catch (e) {
      // Storage can be blocked: the second attempt still runs, it just may fail the same way.
    }
    this.setState({ failed: false, retried: true });
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function decodeHtmlEntities(encodedStr) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = encodedStr;
  return textarea.value;
}

// Main initialization function
function initializeMwai() {
  function processContainers(containers, component) {
    containers.forEach((container) => {
      // Skip if already initialized
      if (container.hasAttribute('data-mwai-initialized')) {
        return;
      }
      
      const paramsAttr = container.getAttribute('data-params');
      const systemAttr = container.getAttribute('data-system');
      const themeAttr = container.getAttribute('data-theme');
      
      // Check if attributes exist before parsing
      if (!paramsAttr || !systemAttr || !themeAttr) {
        console.warn('MWAI: Missing required attributes for initialization', container);
        return;
      }
      
      const params = JSON.parse(decodeHtmlEntities(paramsAttr));
      const system = JSON.parse(decodeHtmlEntities(systemAttr));
      const theme = JSON.parse(decodeHtmlEntities(themeAttr));
      
      // Mark as initialized before removing attributes
      container.setAttribute('data-mwai-initialized', 'true');
      
      container.removeAttribute('data-params');
      container.removeAttribute('data-system');
      container.removeAttribute('data-theme');
      // One chatbot that cannot mount must not stop the loop for the others.
      try {
        const storageKey = component === ChatbotSystem ? `mwai-chat-${system.customId || system.botId}` : null;
        render(createElement(WidgetBoundary, { storageKey }, component({ system, params, theme })), container);
      }
      catch (err) {
        console.error('[MWAI] A chatbot could not be mounted.', err);
      }
    });
  }

  const chatbotContainers = document.querySelectorAll('.mwai-chatbot-container');
  processContainers(chatbotContainers, ChatbotSystem);

  const discussionsContainers = document.querySelectorAll('.mwai-discussions-container');
  processContainers(discussionsContainers, DiscussionsSystem);
}

document.addEventListener('DOMContentLoaded', initializeMwai);

// If the user wants to initialize manually, well, he can do it.
window.mwaiInitialize = initializeMwai;
