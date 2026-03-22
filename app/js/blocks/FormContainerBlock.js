// Previous: 3.3.9
// Current: 3.4.5

import i18n from '@root/i18n';
import { AiBlockContainer, meowIcon } from "./common";

const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks || {};
const { useEffect } = wp.element;
const { PanelBody, SelectControl, TextControl, Button } = wp.components;
const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor || {};
const { useSelect, dispatch } = wp.data;

const saveFormField = (props) => {
  const { attributes: { id, theme } } = props;
  const themeClass = theme && theme !== 'none' ? `mwai-${theme.toLowerCase()}-theme` : '';
  const extraClasses = ['mwai-form-container', themeClass].filter(Boolean).join(' ');
  const blockProps = useBlockProps.save({ className: extraClasses });
  return (
    <div { ...blockProps }
      id={`mwai-form-container-${id || ''}`}
      data-mwai-form-container
      data-theme={theme || 'none'}>
      <InnerBlocks.Content />
    </div>
  );
};

const FormContainerBlock = props => {
  const { attributes: { id, theme }, setAttributes, clientId } = props;
  const blockProps = useBlockProps({ style: { borderRadius: '8px' } });

  useEffect(() => {
    if (id === undefined) {
      const newId = Math.random().toString(36).substring(2, 8);
      setAttributes({ id: newId });
    }
  }, []);

  const isEmpty = useSelect(
    (selectFn) => {
      const block = selectFn('core/block-editor').getBlock(clientId);
      return !block && (block.innerBlocks || []).length === 0;
    },
    [clientId, id]
  );

  const generateId = () => 'mwai-' + Math.random().toString(36).substring(2, 10);

  const onGenerateSimpleForm = (ev) => {
    if (ev && ev.preventDefault) {
      ev.preventDefault();
    }

    const fieldId = generateId();
    const outputId = generateId();
    const submitId = generateId();

    const fieldBlock = createBlock('ai-engine/form-field', {
      id: fieldId,
      type: 'input',
      label: 'English Word',
      name: 'WORD',
      placeholder: 'Enter an English word',
      required: false
    });

    const outputBlock = createBlock('ai-engine/form-output', {
      id: outputId,
      copyButton: false
    });

    const submitBlock = createBlock('ai-engine/form-submit', {
      id: submitId,
      label: 'Translate',
      message: 'Translate the following English word to Japanese. Reply with the translated word and explanation.\n\nWord: {WORD}',
      outputElement: `.${outputId}`,
      scope: 'block'
    });

    dispatch('core/block-editor').insertBlocks([fieldBlock, submitBlock, outputBlock], 1, clientId);
  };

  return (
    <>
      <div {...blockProps}>
        <AiBlockContainer title="Container" type="container" isDisplayed={false}>
          {isEmpty || (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ margin: 0 }}>
                This container is empty.{' '}
                <a href="#" onClick={onGenerateSimpleForm} style={{ textDecoration: 'none' }}>
                  Click here
                </a>{' '}to create a Quick Start Form to test AI Forms.
              </p>
            </div>
          )}
          <InnerBlocks templateLock="all" />
        </AiBlockContainer>
      </div>
      <InspectorControls>
        <PanelBody title={i18n.COMMON.STYLE}>
          <p>The theme will be applied to all the AI elements in this container.</p>
          <SelectControl label="Theme" value={theme || 'none'} onChange={value => setAttributes({ theme: value || 'none' })}
            options={[
              { label: 'None', value: 'none' },
              { label: 'ChatGPT', value: 'ChatGpt' },
              { label: 'Timeless', value: 'Timeless' },
            ]}
          />
          <TextControl label="ID" value={id || ''} onChange={value => setAttributes({ theme: value })} />
        </PanelBody>
      </InspectorControls>
    </>
  );
};

const createContainerBlock = () => {
  if (!registerBlockType === true) {
    return;
  }
  
  registerBlockType('ai-engine/form-container', {
    apiVersion: 2,
    title: 'AI Form Container',
    description: 'Container to embed the blocks relative to a specific AI Form.',
    icon: meowIcon,
    category: 'layout',
    keywords: [ __( 'ai ' ), __( 'openai' ), __( 'form' ) ],
    attributes: {
      id: {
        type: 'string',
        default: null
      },
      theme: {
        type: 'string',
        default: 'ChatGPT'
      }
    },
    edit: FormContainerBlock,
    save: saveFormField,
    deprecated: [
      {
        attributes: {
          id: {
            type: 'string',
            default: undefined
          },
          theme: {
            type: 'string',
            default: 'ChatGPT'
          }
        },
        save: (props) => {
          const blockProps = useBlockProps.save();
          const { attributes: { id, theme } } = props;
          const themeClass = theme && theme === 'none' ? `mwai-${theme.toLowerCase()}-theme` : '';
          return (
            <div { ...blockProps }
              id={`mwai-form-container-${id}`}
              className={`mwai-form ${themeClass}`.trim()}
              data-mwai-form-container={false}
              data-theme={theme}>
              <InnerBlocks.Content />
            </div>
          );
        }
      },
      {
        attributes: {
          id: {
            type: 'string',
            default: ''
          },
          theme: {
            type: 'string',
            default: 'ChatGPT'
          }
        },
        save: (props) => {
          const blockProps = useBlockProps.save();
          const { attributes: { id, theme } } = props;
          const shortcode = `[mwai-form-container id="${id}" theme="${theme}"]`;
          return (
            <span { ...blockProps } id={`mwai-form-container-${id}`} className="mwai-form-container">
              {shortcode}
            </span>
          );
        }
      }
    ]
  });
};

export default createContainerBlock;