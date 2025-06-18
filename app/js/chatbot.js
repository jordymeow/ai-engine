// Previous: 2.8.3
// Current: 2.8.4

const { render } = wp.element;
import ChatbotSystem from '@app/chatbot/ChatbotSystem';
import DiscussionsSystem from '@app/chatbot/DiscussionsSystem';

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
      render(component({ system, params, theme }), container);
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
