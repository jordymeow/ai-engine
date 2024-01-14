// Previous: 1.9.8
// Current: 2.1.5

import i18n from '@root/i18n';
import { AiBlockContainer, meowIcon } from "./common";
import { chatbots } from '@app/settings';

const { registerBlockType } = wp.blocks;
const { useMemo } = wp.element;
const { PanelBody, SelectControl } = wp.components;
const { InspectorControls } = wp.blockEditor;

const saveChatbot = (props) => {
  // Prepare attributes
  const { attributes: { chatbotId } } = props;

  // Shortcode attributes
  const shortcodeAttributes = {
    id: { value: chatbotId, insertIfNull: true }
  };

  // Create the shortcode
  const shortcode = Object.entries(shortcodeAttributes)
    .filter(([, { value, insertIfNull }]) => !!value || insertIfNull)
    .reduce((acc, [key, { value }]) => `${acc} ${key}="${value}"`, "[mwai_chatbot");
  return `${shortcode}]`;
};

const ChatbotBlock = props => {
  const { attributes: { chatbotId }, setAttributes } = props;

  const chatbotsOptions = useMemo(() => {
    const freshChatbots = chatbots.map(chatbot => ({ label: chatbot.name, value: chatbot.botId }));
    freshChatbots.unshift({ label: 'None', value: null });
    return freshChatbots;
  }, [chatbots]);

  const currentChatbot = useMemo(() => {
    return chatbots.find(chatbot => chatbot.botId === chatbotId);
  }, [chatbotId]);

  const title = useMemo(() => {
    return currentChatbot ? `Chatbot (${currentChatbot.name})` : 'Chatbot';
  }, [ chatbotId ]);

  return (
    <>
      <AiBlockContainer title={title} type="chatbot">
      </AiBlockContainer>
      <InspectorControls>
        <PanelBody title={i18n.COMMON.CHATBOT}>
          {chatbotsOptions && chatbotsOptions.length > 0 &&
            <SelectControl label={i18n.COMMON.CHATBOT} value={chatbotId} options={chatbotsOptions}
              onChange={value => setAttributes({ chatbotId: value })}
            />}
        </PanelBody>
        <PanelBody title={i18n.COMMON.SETTINGS}>
        </PanelBody>
      </InspectorControls>
    </>
  );
};

const createChatbotBlock = () => {
  registerBlockType('ai-engine/chatbot', {
    title: 'AI Chatbot',
    description: <>This feature is <b>being built</b>. I will allow to create a chatbot. Coming soon!</>,
    icon: meowIcon,
    category: 'layout',
    keywords: [ 'ai', 'openai', 'chatbot' ],
    attributes: {
      id: {
        type: 'string',
        default: ''
      },
      chatbotId: {
        type: 'string',
        default: 'default'
      }
    },
    edit: ChatbotBlock,
    save: saveChatbot
  });
};

export default createChatbotBlock;
