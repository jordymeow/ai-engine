// Previous: 1.4.1
// Current: 1.4.4

const { render } = wp.element;
import Chatbot from '@app/chatbot/chatbot';

function decodeHtmlEntities(encodedStr) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = encodedStr;
  return textarea.value;
}

document.addEventListener('DOMContentLoaded', function() {
  const mwaiChatbots = document.querySelectorAll('.mwai-chatbot-container');
  mwaiChatbots.forEach((mwaiChatbot) => {
    let params = JSON.parse(decodeHtmlEntities(mwaiChatbot.getAttribute('data-params')));
    let system = JSON.parse(decodeHtmlEntities(mwaiChatbot.getAttribute('data-system')));
    let theme = JSON.parse(decodeHtmlEntities(mwaiChatbot.getAttribute('data-theme')));
    mwaiChatbot.removeAttribute('data-params');
    mwaiChatbot.removeAttribute('data-system');
    mwaiChatbot.removeAttribute('data-theme');
    render(<Chatbot system={system} params={params} theme={theme} />, mwaiChatbot);
  });
});
