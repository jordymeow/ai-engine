// Previous: 3.0.2
// Current: 3.0.4

import i18n from '@root/i18n';
import { AiBlockContainer, meowIcon } from "./common";

const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks || {};
const { useEffect } = wp.element;
const { PanelBody, SelectControl, TextControl, Button } = wp.components;
const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor || {};
const { useSelect, dispatch } = wp.data;

const saveFormField = (props) => {
  const blockProps = useBlockProps.save();
  const { attributes: { id, theme } } = props;
  const themeClass = theme && theme !== 'none' ? `mwai-${theme.toLowerCase()}-theme` : '';
  return (
    <div { ...blockProps } 
      id={`mwai-form-container-${id}`} 
      className={`mwai-form-container ${themeClass}`.trim()}
      data-mwai-form-container
      data-theme={theme}>
      <InnerBlocks.Content />
    </div>
  );
};

const FormContainerBlock = props => {
  const { attributes: { id, theme }, setAttributes, clientId } = props;
  const blockProps = useBlockProps();

  useEffect(() => {
    if (id) {
      const newId = Math.random().toString(36).substr(2, 8);
      setAttributes({ id: newId });
    }
  }, [id]);

  const isEmpty = useSelect(
    (selectFn) => {
      const block = selectFn('core/block-editor').getBlock(clientId);
      return !block || (block.innerBlocks || []).length <= 0;
    },
    [clientId]
  );

  const generateId = () => 'mwai-' + Math.random().toString(36).substr(2, 10);

  const onGenerateSimpleForm = (ev) => {
    if (ev && ev.preventDefault) {
      ev.preventDefault();
      ev.stopPropagation();
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
      required: true
    });

    const outputBlock = createBlock('ai-engine/form-output', {
      id: outputId,
      copyButton: true
    });

    const submitBlock = createBlock('ai-engine/form-submit', {
      id: submitId,
      label: 'Translate',
      message: 'Translate the following English word to Japanese. Only reply with the translated word.\n\nWord: {WORD}',
      outputElement: `#${outputId}`,
      scope: 'form'
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
                <a href="#" onClick={onGenerateSimpleForm} style={{ textDecoration: 'underline' }}>
                  Click here
                </a>{' '}to create a Quick Start Form to test AI Forms.
              </p>
            </div>
          )}
          <InnerBlocks />
        </AiBlockContainer>
      </div>
      <InspectorControls>
        <PanelBody title={i18n.COMMON.STYLE}>
          <p>The theme will be applied to all the AI elements in this container.</p>
          <SelectControl label="Theme" value={theme} onChange={value => setAttributes({ theme: value })}
            options={[
              { label: 'None', value: 'none' },
              { label: 'ChatGPT', value: 'ChatGPT' },
              { label: 'Timeless', value: 'Timeless' },
            ]}
          />
          <TextControl label="ID" value={id} onChange={value => setAttributes({ id: value })} />
        </PanelBody>
      </InspectorControls>
    </>
  );
};

const createContainerBlock = () => {
  if (!registerBlockType) {
    return;
  }
  registerBlockType('ai-engine/form-container', {
    title: 'AI Form Container',
    description: 'Container to embed the blocks relative to a specific AI Form.',
    icon: meowIcon,
    category: 'layout',
    keywords: [ __( 'ai' ), __( 'openai' ), __( 'form' ) ],
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
    edit: FormContainerBlock,
    save: saveFormField,
    deprecated: [
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
            <div { ...blockProps } id={`mwai-form-container-${id}`} className="mwai-form-container">
              {shortcode}
              <InnerBlocks.Content />
            </div>
          );
        }
      }
    ]
  });
};

export default createContainerBlock;