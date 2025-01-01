// Previous: none
// Current: 2.6.9

import { AiBlockContainer, meowIcon } from "./common"; 
import i18n from '@root/i18n';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useMemo, useEffect } = wp.element;
const { PanelBody, TextControl, CheckboxControl } = wp.components;
const { InspectorControls, useBlockProps } = wp.blockEditor;

const saveResetBlock = (props) => {
  const {
    attributes: {
      id, label, localMemory
    }
  } = props;
  const blockProps = useBlockProps.save();

  let shortcode = `[mwai-form-reset id="${id}" label="${label}"`;
  if (localMemory) {
    shortcode += ` local_memory="true"`;
  }
  shortcode += `]`;

  return <div {...blockProps}>{shortcode}</div>;
};

const FormResetBlock = (props) => {
  const blockProps = useBlockProps();
  const {
    attributes: {
      id, label, localMemory
    },
    setAttributes,
    isSelected
  } = props;

  useEffect(() => {
    if (!id) {
      const newId = Math.random().toString(36).substr(2, 9);
      setAttributes({ id: 'mwai-reset-' + newId });
    }
  }, [id]);

  return (
    <>
      <div {...blockProps}>
        <AiBlockContainer
          title="Reset"
          type="reset"
          isSelected={isSelected}
          hint={<>{__('This block resets the AI form fields', 'ai-engine')}</>}
        >
          {__('ID:', 'ai-engine')} {id}<br />
          {__('Label:', 'ai-engine')} {label}
        </AiBlockContainer>
      </div>

      <InspectorControls>
        <PanelBody title={__('Reset Button Settings', 'ai-engine')}>
          <TextControl
            label={__('ID', 'ai-engine')}
            value={id}
            onChange={(value) => setAttributes({ id: value })}
            help={__('Unique identifier. If omitted, one is auto-generated.', 'ai-engine')}
          />
          <TextControl
            label={__('Label', 'ai-engine')}
            value={label}
            onChange={(value) => setAttributes({ label: value })}
            help={__('Text on the reset button.', 'ai-engine')}
          />
          <CheckboxControl
            label={__('Local Memory', 'ai-engine')}
            checked={localMemory}
            onChange={(value) => setAttributes({ localMemory: value })}
            help={__('Clear local storage for this form’s key when resetting.', 'ai-engine')}
          />
        </PanelBody>
      </InspectorControls>
    </>
  );
};

const createResetBlock = () => {
  registerBlockType('ai-engine/form-reset', {
    title: 'AI Form Reset',
    description: 'A reset button for your AI Form.',
    icon: meowIcon,
    category: 'layout',
    keywords: [ __('ai'), __('openai'), __('form'), __('reset') ],
    supports: {
      dimensions: {
        minHeight: false
      }
    },
    attributes: {
      id: {
        type: 'string',
        default: ''
      },
      label: {
        type: 'string',
        default: 'Reset'
      },
      localMemory: {
        type: 'boolean',
        default: false
      }
    },
    edit: FormResetBlock,
    save: saveResetBlock
  });
};

export default createResetBlock;