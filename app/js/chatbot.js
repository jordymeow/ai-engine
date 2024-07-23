// Previous: 1.9.8
// Current: 2.5.0

const { render } = wp.element;
import ChatbotSystem from '@app/chatbot/ChatbotSystem';
import DiscussionsSystem from '@app/chatbot/DiscussionsSystem';

function decodeHtmlEntities(encodedStr) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = encodedStr;
  return textarea.value;
}

document.addEventListener('DOMContentLoaded', function() {

  function processContainers(containers, component) {
    containers.forEach((container) => {
      const params = JSON.parse(decodeHtmlEntities(container.getAttribute('data-params')));
      const system = JSON.parse(decodeHtmlEntities(container.getAttribute('data-system')));
      const theme = JSON.parse(decodeHtmlEntities(container.getAttribute('data-theme')));
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

});
