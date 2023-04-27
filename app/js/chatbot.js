// Previous: 1.5.2
// Current: 1.6.56

const { render } = wp.element;
import ChatbotSystem from '@app/chatbot/ChatbotSystem';

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
    //let atts = JSON.parse(decodeHtmlEntities(mwaiChatbot.getAttribute('data-atts')));
    mwaiChatbot.removeAttribute('data-params');
    mwaiChatbot.removeAttribute('data-system');
    mwaiChatbot.removeAttribute('data-theme');
    //mwaiChatbot.removeAttribute('data-atts');
    render(<ChatbotSystem system={system} params={params} theme={theme} />, mwaiChatbot);
  });
});
