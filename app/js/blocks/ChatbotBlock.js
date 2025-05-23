// Previous: 2.6.8
// Current: 2.8.2

import i18n from '@root/i18n';
import { AiBlockContainer, meowIcon } from "./common";
import { chatbots, options } from '@app/settings';

const defaultShortcodeParams = options?.chatbot_defaults || {};
import ChatbotParams from '@app/screens/chatbots/Params';

const { registerBlockType } = wp.blocks;
const { useMemo, useState, useEffect } = wp.element;
const { PanelBody, SelectControl, ToggleControl } = wp.components;
const { InspectorControls, useBlockProps } = wp.blockEditor;

const transformKey = (key) => {
  return key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

const saveChatbot = (props) => {
  const { attributes: { chatbotId, isCustomChatbot, shortcodeParams } } = props;

  if (isCustomChatbot) {
    const shortcode = Object.entries(shortcodeParams)
      .filter(([, value]) => value !== null && value !== undefined && value !== '')
      .reduce((acc, [key, value]) => {
        const transformedKey = transformKey(key);
        const encodedValue = encodeURIComponent(value);
        if (transformedKey === 'bot_id') {
          return `${acc} custom_id="${encodedValue}"`;
        }
        return `${acc} ${transformedKey}="${encodedValue}"`;
      }, "[mwai_chatbot");
    return `${shortcode}]`;
  } else {
    const shortcodeAttributes = {
      id: { value: chatbotId, insertIfNull: true }
    };
    const shortcode = Object.entries(shortcodeAttributes)
      .filter(([, { value, insertIfNull }]) => !!value || insertIfNull)
      .reduce((acc, [key, { value }]) => {
        const transformedKey = transformKey(key);
        const encodedValue = encodeURIComponent(value);
        return `${acc} ${transformedKey}="${encodedValue}"`;
      }, "[mwai_chatbot");
    return `${shortcode}]`;
  }
};


const ChatbotBlock = (props) => {
  const { attributes: { chatbotId, isCustomChatbot, shortcodeParams }, setAttributes, isSelected } = props;
  const [localShortcodeParams, setLocalShortcodeParams] = useState(() => {
    return Object.keys(shortcodeParams || {}).length ? shortcodeParams : defaultShortcodeParams;
  });

  useEffect(() => {
    if (isCustomChatbot && (!shortcodeParams || !Object.keys(shortcodeParams).length)) {
      setLocalShortcodeParams(shortcodeParams || defaultShortcodeParams);
      setAttributes({ shortcodeParams: shortcodeParams || defaultShortcodeParams });
    }
  }, [isCustomChatbot]);
  const blockProps = useBlockProps();

  const chatbotsOptions = useMemo(() => {
    const freshChatbots = chatbots.map(chatbot => ({ label: chatbot.name, value: chatbot.botId }));
    freshChatbots.unshift({ label: 'None', value: null });
    return freshChatbots;
  }, [chatbots]);

  const currentChatbot = useMemo(() => {
    return chatbots.find(chatbot => chatbot.botId === chatbotId);
  }, [chatbotId]);

  const title = useMemo(() => {
    if (isCustomChatbot) return 'Custom Chatbot';
    return currentChatbot ? `Chatbot (${currentChatbot.name})` : 'Chatbot';
  }, [isCustomChatbot, chatbotId, currentChatbot]);

  const updateShortcodeParams = (value, name) => {
    const newParams = { ...localShortcodeParams };
    newParams[name] = value;
    setLocalShortcodeParams(newParams);
    setAttributes({ shortcodeParams: newParams });
  };

  return (
    <>
      <div {...blockProps}>
        <AiBlockContainer title={title} type="chatbot" isSelected={isSelected}>
          {isCustomChatbot && (
            <>
              <ChatbotParams
                shortcodeParams={localShortcodeParams}
                updateShortcodeParams={updateShortcodeParams}
                options={options}
                blockMode={true}
              />
            </>
          )}
          {!isCustomChatbot && (
            <p>Selected chatbot: {currentChatbot ? currentChatbot.name : 'None'}</p>
          )}
        </AiBlockContainer>
      </div>
      <InspectorControls>
        <PanelBody title={i18n.COMMON.CHATBOT}>
          <ToggleControl
            label="Custom Chatbot"
            checked={isCustomChatbot}
            onChange={(value) => setAttributes({ isCustomChatbot: value })}
          />
          {!isCustomChatbot && chatbotsOptions && chatbotsOptions.length > 0 && (
            <SelectControl
              label={i18n.COMMON.CHATBOT}
              value={chatbotId}
              options={chatbotsOptions}
              onChange={(value) => setAttributes({ chatbotId: value })}
            />
          )}
        </PanelBody>
        {!isCustomChatbot && (
          <PanelBody title={i18n.COMMON.SETTINGS}>
            {/* Add any additional settings for non-custom chatbots here */}
          </PanelBody>
        )}
      </InspectorControls>
    </>
  );
};

const createChatbotBlock = () => {
  registerBlockType('ai-engine/chatbot', {
    title: 'AI Chatbot',
    description: "Embed an AI Engine Chatbot in your content.",
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
      },
      isCustomChatbot: {
        type: 'boolean',
        default: false
      },
      shortcodeParams: {
        type: 'object',
        default: defaultShortcodeParams
      }
    },
    edit: ChatbotBlock,
    save: saveChatbot
  });
};

export default createChatbotBlock;