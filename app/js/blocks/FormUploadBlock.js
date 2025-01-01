// Previous: none
// Current: 2.6.9

import i18n from '@root/i18n';
import { AiBlockContainer, meowIcon } from './common';
import { nekoStringify } from '@neko-ui';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useEffect } = wp.element;
const {
  Button,
  PanelBody,
  TextControl,
  SelectControl,
  CheckboxControl,
} = wp.components;
const { useBlockProps, InspectorControls } = wp.blockEditor;

/**
 * Convert the selected accept type (all-images, all-documents, all, custom)
 * into the actual MIME string or extension list for the <input>.
 */
function resolveAcceptValue(accept, customAccept) {
  switch (accept) {
  case 'all-images':
    return 'image/*';
  case 'all-documents':
    // Adjust if you need additional formats
    return '.pdf,.doc,.docx,.txt,.xls,.xlsx';
  case 'all':
    // Accept any file
    return '';
  case 'custom':
    // The user’s custom input, e.g. ".png,.jpg"
    return customAccept || '';
  default:
    return '';
  }
}

/**
 * Saves (front-end) => Generate the shortcode for output
 */
const saveUploadField = (props) => {
  const {
    attributes: {
      id,
      label,
      name,
      required,
      accept,
      customAccept,
      multiple,
    },
  } = props;

  const blockProps = useBlockProps.save();

  // Convert the user selection into the actual accept value
  const resolvedAccept = resolveAcceptValue(accept, customAccept);

  // Build shortcode
  let shortcode = '[mwai-form-upload';
  if (id) {
    shortcode += ` id="${id}"`;
  }
  if (label) {
    shortcode += ` label="${label}"`;
  }
  if (name) {
    shortcode += ` name="${name}"`;
  }
  // only add accept if there's a meaningful value (empty string means any file)
  if (resolvedAccept !== '') {
    shortcode += ` accept="${resolvedAccept}"`;
  }
  if (multiple) {
    shortcode += ` multiple="true"`;
  }
  if (required) {
    shortcode += ` required="true"`;
  }
  shortcode += ']';

  return <div {...blockProps}>{shortcode}</div>;
};

/**
 * Edit (admin side) => the block’s sidebar settings + preview
 */
const UploadFieldBlock = (props) => {
  const {
    attributes: {
      id,
      label,
      name,
      required,
      accept,
      customAccept,
      multiple,
    },
    setAttributes,
    isSelected,
  } = props;

  const blockProps = useBlockProps();

  useEffect(() => {
    // Auto-generate an ID if not present
    if (!id) {
      const newId = Math.random().toString(36).substr(2, 9);
      setAttributes({ id: 'mwai-' + newId });
    }
  }, [id]);

  const onUpdateLabel = (value) => {
    setAttributes({ label: value });
    if (!name || name === 'LABEL') {
      // Try to generate a name from the label
      const newName = value
        .trim()
        .replace(/ /g, '_')
        .replace(/[^\w-]+/g, '')
        .toUpperCase();
      if (newName) {
        setAttributes({ name: newName });
      }
    }
  };

  return (
    <>
      <div {...blockProps}>
        <AiBlockContainer
          title="Upload Field"
          type="field"
          isSelected={isSelected}
          hint={<span className="mwai-pill">{'{' + name + '}'}</span>}
        >
          <div>{label}</div>
          <div style={{ flex: 'auto' }}></div>
          <div>{name}</div>
        </AiBlockContainer>
      </div>

      <InspectorControls>
        <PanelBody title={__('Upload Field Settings')}>
          <TextControl
            label="Label Text"
            value={label}
            onChange={onUpdateLabel}
          />
          <TextControl
            label="Field Name"
            value={name}
            onChange={(value) => setAttributes({ name: value })}
          />
          <SelectControl
            label="Accept"
            value={accept}
            onChange={(value) => setAttributes({ accept: value })}
            options={[
              { label: 'All Images', value: 'all-images' },
              { label: 'All Documents', value: 'all-documents' },
              { label: 'Any Files', value: 'all' },
              { label: 'Custom', value: 'custom' },
            ]}
          />
          {accept === 'custom' && (
            <TextControl
              label="Custom MIME Types"
              help="Comma-separated list (e.g. .png,.jpg)"
              value={customAccept}
              onChange={(value) => setAttributes({ customAccept: value })}
            />
          )}
          <CheckboxControl
            label="Multiple"
            checked={multiple}
            onChange={(value) => setAttributes({ multiple: value })}
          />
          <CheckboxControl
            label="Required"
            checked={required}
            onChange={(value) => setAttributes({ required: value })}
          />
        </PanelBody>

        <PanelBody title={i18n.COMMON.SYSTEM}>
          <TextControl
            label="ID"
            value={id}
            onChange={(value) => setAttributes({ id: value })}
          />
        </PanelBody>
      </InspectorControls>
    </>
  );
};

/**
 * Register the new block
 */
const createUploadFieldBlock = () => {
  registerBlockType('ai-engine/upload-field', {
    apiVersion: 3,
    title: 'AI Upload Field',
    description: 'A File Upload field for your AI Form.',
    icon: meowIcon,
    category: 'layout',
    keywords: [__('ai'), __('openai'), __('form'), __('upload')],
    attributes: {
      id: {
        type: 'string',
        default: '',
      },
      label: {
        type: 'string',
        default: 'Upload:',
      },
      name: {
        type: 'string',
        default: 'UPLOAD',
      },
      required: {
        type: 'boolean',
        default: false,
      },
      accept: {
        type: 'string',
        default: 'all-images', // or 'all'
      },
      customAccept: {
        type: 'string',
        default: '.png,.jpg',
      },
      multiple: {
        type: 'boolean',
        default: false,
      },
    },
    edit: UploadFieldBlock,
    save: saveUploadField,
  });
};

export default createUploadFieldBlock;