// Previous: none
// Current: 2.6.5

import i18n from '@root/i18n';
import { AiBlockContainer, meowIcon } from "./common";
import { chatbots } from '@app/settings';

const { registerBlockType } = wp.blocks;
const { useMemo } = wp.element;
const { PanelBody, SelectControl, ToggleControl, TextControl } = wp.components;
const { InspectorControls, useBlockProps } = wp.blockEditor;

const transformKey = (key) => {
  return key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

const saveDiscussions = (props) => {
  const { attributes: { isCustomChatbot, chatbotId, customId, textNewChat } } = props;

  const shortcodeAttributes = {};

  if (isCustomChatbot) {
    if (customId) {
      shortcodeAttributes.customId = customId;
    }
  } else {
    if (chatbotId) {
      shortcodeAttributes.id = chatbotId;
    }
  }

  if (textNewChat !== undefined && textNewChat !== null) {
    shortcodeAttributes.textNewChat = textNewChat;
  }

  const shortcode = Object.entries(shortcodeAttributes)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .reduce((acc, [key, value]) => {
      const transformedKey = transformKey(key);
      return `${acc} ${transformedKey}="${value}"`;
    }, "[mwai_discussions");

  return `${shortcode}]`;
};

const DiscussionsBlock = (props) => {
  const { attributes: { isCustomChatbot, chatbotId, customId, textNewChat }, setAttributes, isSelected } = props;
  const blockProps = useBlockProps();

  const chatbotsOptions = useMemo(() => {
    const freshChatbots = chatbots.map(chatbot => ({ label: chatbot.name, value: chatbot.botId }));
    freshChatbots.unshift({ label: 'None', value: '' });
    return freshChatbots;
  }, [chatbots]);

  const currentChatbot = useMemo(() => {
    return chatbots.find(chatbot => chatbot.botId === chatbotId);
  }, [chatbotId]);

  const title = useMemo(() => {
    if (isCustomChatbot) return 'Discussions (Custom Chatbot)';
    return currentChatbot ? `Discussions (${currentChatbot.name})` : 'Discussions';
  }, [isCustomChatbot, currentChatbot]);

  return (
    <>
      <div {...blockProps}>
        <AiBlockContainer title={title} type="discussions" isSelected={isSelected}>
          <span>
            {isCustomChatbot ? `Custom ID: ${customId || 'None'}` : `Selected chatbot: ${currentChatbot ? currentChatbot.name : 'None'}`}
          </span>
          <span>
            New Chat: {textNewChat || 'Default'}
          </span>
        </AiBlockContainer>
      </div>
      <InspectorControls>
        <PanelBody title="Discussions Settings">
          <ToggleControl
            label="Custom Chatbot"
            checked={isCustomChatbot}
            onChange={(value) => setAttributes({ isCustomChatbot: value })}
          />
          {isCustomChatbot ? (
            <TextControl
              label="Custom Chatbot ID"
              value={customId}
              onChange={(value) => setAttributes({ customId: value })}
            />
          ) : (
            <SelectControl
              label="Select Chatbot"
              value={chatbotId}
              options={chatbotsOptions}
              onChange={(value) => setAttributes({ chatbotId: value })}
            />
          )}
          <TextControl
            label="Text for New Chat Button"
            value={textNewChat}
            onChange={(value) => setAttributes({ textNewChat: value })}
          />
        </PanelBody>
      </InspectorControls>
    </>
  );
};

const createDiscussionsBlock = () => {
  registerBlockType('ai-engine/discussions', {
    title: 'AI Discussions',
    description: "Embed AI Engine Discussions in your content.",
    icon: meowIcon,
    category: 'layout',
    keywords: ['ai', 'openai', 'discussions'],
    attributes: {
      isCustomChatbot: {
        type: 'boolean',
        default: false
      },
      chatbotId: {
        type: 'string',
        default: ''
      },
      customId: {
        type: 'string',
        default: ''
      },
      textNewChat: {
        type: 'string',
        default: ''
      }
    },
    edit: DiscussionsBlock,
    save: saveDiscussions
  });
};

export default createDiscussionsBlock;