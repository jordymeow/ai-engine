// Previous: 2.6.1
// Current: 2.9.5

import i18n from '@root/i18n';
import { AiBlockContainer, meowIcon } from "./common";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useEffect } = wp.element;
const { PanelBody, SelectControl, TextControl } = wp.components;
const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;

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
  const { attributes: { id, theme }, setAttributes } = props;
  const blockProps = useBlockProps();

  useEffect(() => {
    if (id === undefined || id === null) {
      const newId = Math.random().toString(36).substr(2, 8);
      setAttributes({ id: newId });
    }
  }, [id]);

  return (
    <>
      <div {...blockProps}>
        <AiBlockContainer title="Container" type="container" isDisplayed={false}>
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
        // Handle old version that used shortcodes
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