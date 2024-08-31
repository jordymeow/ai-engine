// Previous: 2.5.7
// Current: 2.6.1

import i18n from '@root/i18n';
import { AiBlockContainer, meowIcon } from "./common";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useEffect } = wp.element;
const { PanelBody, TextControl, CheckboxControl } = wp.components;
const { InspectorControls, useBlockProps } = wp.blockEditor;

const saveFormField = (props) => {
  const { attributes: { id, copyButton } } = props;
  const blockProps = useBlockProps.save();

  // Shortcode attributes
  const shortcodeAttributes = {
    id: { value: id, insertIfNull: true },
    copy_button: { value: copyButton, insertIfNull: false },
  };

  // Create the shortcode
  let shortcode = Object.entries(shortcodeAttributes)
    .filter(([, { value, insertIfNull }]) => (value !== false && value !== '') || insertIfNull)
    .reduce((acc, [key, { value }]) => `${acc} ${key}="${value}"`, "[mwai-form-output");
  shortcode = `${shortcode}]`;

  // Return the shortcode
  return <div {...blockProps}>{shortcode}</div>;
};

const FormOutputBlock = props => {
  const { attributes: { id, copyButton }, setAttributes, isSelected } = props;
  const blockProps = useBlockProps();

  useEffect(() => {
    if (!id) {
      const newId = Math.random().toString(36).substr(2, 9);
      setAttributes({ id: 'mwai-' + newId });
    }
  }, [id]);

  return (
    <>
      <div {...blockProps}>
        <AiBlockContainer title="Output" type="output" isSelected={isSelected}
          hint={<span className="mwai-pill mwai-pill-purple">#{id}</span>}>
          <div></div>
          <div style={{ flex: 'auto' }}></div>
          <div>#{id}</div>
        </AiBlockContainer>
      </div>
      <InspectorControls>
        <PanelBody title={i18n.FORMS.OUTPUT}>
          <CheckboxControl label="Copy Button" checked={copyButton}
            onChange={value => setAttributes({ copyButton: value })}
          />
          <TextControl label="ID" value={id} onChange={value => setAttributes({ id: value })} />
        </PanelBody>
      </InspectorControls>
    </>
  );
};

const createOutputBlock = () => {
  registerBlockType('ai-engine/form-output', {
    title: 'AI Form Output',
    description: 'An Output Field for your AI Form.',
    icon: meowIcon,
    category: 'layout',
    keywords: [ __( 'ai' ), __( 'openai' ), __( 'form' ) ],
    supports: {
      dimensions: {
        minHeight: true,
      }
    },
    attributes: {
      id: {
        type: 'string',
        default: ''
      },
      copyButton: {
        type: 'boolean',
        default: true
      }
    },
    edit: FormOutputBlock,
    save: saveFormField
  });
};

export default createOutputBlock;
