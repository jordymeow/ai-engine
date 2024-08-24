// Previous: 2.3.1
// Current: 2.5.7

import i18n from '@root/i18n';
import { AiBlockContainer, meowIcon } from "./common";
import { nekoStringify } from '@neko-ui';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useEffect } = wp.element;
const { Button, PanelBody, TextControl, SelectControl, CheckboxControl } = wp.components;
const { useBlockProps, InspectorControls } = wp.blockEditor;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const saveFormField = (props) => {
  const { attributes: { id, label, type, name, options = [],
    placeholder, rows, defaultValue, maxlength, required } } = props;
  const encodedOptions = encodeURIComponent(nekoStringify(options));
  const blockProps = useBlockProps.save();

  // Build shortcode
  let shortcode = '[mwai-form-field';
  if (id) {
    shortcode += ` id="${id}"`;
  }
  if (label) {
    shortcode += ` label="${label}"`;
  }
  if (type) {
    shortcode += ` type="${type}"`;
  }
  if (name) {
    shortcode += ` name="${name}"`;
  }
  if (encodedOptions) {
    shortcode += ` options="${encodedOptions}"`;
  }
  if (placeholder) {
    shortcode += ` placeholder="${placeholder}"`;
  }
  if (type === 'textarea' && rows) {
    shortcode += ` rows="${rows}"`;
  }
  if (defaultValue) {
    shortcode += ` default="${defaultValue}"`;
  }
  if (maxlength) {
    shortcode += ` maxlength="${maxlength}"`;
  }
  if (required) {
    shortcode += ` required="${required}"`;
  }
  shortcode += ']';

  return <div {...blockProps}>{shortcode}</div>;
};

const FormFieldBlock = props => {
  const { attributes: { id, type, name, options = [], label, placeholder, rows,
    defaultValue, maxlength, required }, setAttributes } = props;
  const blockProps = useBlockProps();

  useEffect(() => {
    if (!id) {
      const newId = Math.random().toString(36).substr(2, 9);
      setAttributes({ id: 'mwai-' + newId });
    }
  }, [id]);

  const onUpdateLabel = (value) => {
    setAttributes({ label: value });
    const newName = value.trim().replace(/ /g, '_').replace(/[^\w-]+/g, '').toUpperCase();
    if (newName) {
      setAttributes({ name: newName });
    }
  };

  return (
    <>
      <div {...blockProps}>
        <AiBlockContainer title={`${capitalizeFirstLetter(type)}`} type="field"
          hint={<span className="mwai-pill">{'{'}{name}{'}'}</span>}>
          <div>
            {label}
          </div>
          <div style={{ flex: 'auto' }}></div>
          <div>
            {name}
          </div>
        </AiBlockContainer>
      </div>
      <InspectorControls>
        <PanelBody title={ __( 'Field' ) }>
          <TextControl label="Label Text" value={label} onChange={onUpdateLabel} />
          <TextControl label="Field Name" value={name} onChange={value => setAttributes({ name: value })} />
          <SelectControl label="Field Type" value={type} onChange={value => setAttributes({ type: value })}
            options={[
              { label: 'Input', value: 'input' },
              { label: 'Select', value: 'select' },
              { label: 'Checkbox', value: 'checkbox' },
              { label: 'Radio', value: 'radio' },
              { label: 'Text Area', value: 'textarea' },
            ]}
          />
          {(type === 'input' || type === 'textarea') &&
            <TextControl label="Placeholder" value={placeholder}
              onChange={value => setAttributes({ placeholder: value })} />
          }
          {(type === 'input' || type === 'textarea') &&
            <TextControl label="Default Value" value={defaultValue}
              onChange={value => setAttributes({ defaultValue: value })} />
          }
          {(type === 'input' || type === 'textarea') &&
            <TextControl label="Max Length" value={maxlength}
              onChange={value => setAttributes({ maxlength: value })} />
          }
          {(type === 'textarea') &&
            <TextControl label={i18n.COMMON.ROWS} value={rows}
              onChange={value => setAttributes({ rows: value })}
              type="number" step="1" min="1" max="100" />
          }
          <CheckboxControl label="Required" checked={required}
            onChange={value => setAttributes({ required: value })} />
        </PanelBody>
        {(type === 'select' || type === 'radio' || type === 'checkbox') && <PanelBody title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div>{ __( 'Options' ) }</div>
          </div>}>

          {options.map((option, index) => {
            return <div key={index} style={{ display: 'flex', marginBottom: -25 }}>
              <div style={{ marginRight: 5 }}>
                <TextControl style={{ marginRight: 10 }}
                  label="Label"
                  isInline={true}
                  value={option.label}
                  onChange={value => {
                    const newOptions = [...options];
                    newOptions[index].label = value;
                    setAttributes({ options: newOptions });
                  }
                  } />
              </div>
              <TextControl style={{  }}
                label="Value"
                isSubtle={true}
                value={option.value}
                onChange={value => {
                  const newOptions = [...options];
                  newOptions[index].value = value;
                  setAttributes({ options: newOptions });
                }
                } />
              <div style={{ marginLeft: 5, position: 'relative', top: 23 }}>
                <Button style={{ height: 30 }} isDestructive
                  icon="trash" isSmall onClick={() => {
                    const newOptions = [...options];
                    newOptions.splice(index, 1);
                    setAttributes({ options: newOptions });
                  }} />
              </div>
            </div>;

          })}

          <Button isPrimary style={{ width: '100%', marginTop: 10 }} onClick={() => {
            const newOptions = [...options];
            newOptions.push({ label: '', value: '' });
            setAttributes({ options: newOptions });
          }}>Add Option</Button>
        </PanelBody>}
        <PanelBody title={i18n.COMMON.SYSTEM}>
          <TextControl label="ID" value={id} onChange={value => setAttributes({ id: value })} />
        </PanelBody>
      </InspectorControls>
    </>
  );
};

const createFormFieldBlock = () => {
  registerBlockType('ai-engine/form-field', {
    apiVersion: 3,
    title: 'AI Form Field',
    description: 'An AI Field for your AI Form.',
    icon: meowIcon,
    category: 'layout',
    keywords: [ __( 'ai' ), __( 'openai' ), __( 'form' ) ],
    supports: {
      dimensions: {
        width: true
      }
    },
    attributes: {
      id: {
        type: 'string',
        default: ''
      },
      name: {
        type: 'string',
        default: 'LABEL'
      },
      type: {
        type: 'string',
        default: 'input'
      },
      options: {
        type: 'array',
        default: []
      },
      label: {
        type: 'string',
        default: 'Label: '
      },
      placeholder: {
        type: 'string',
        default: ''
      },
      defaultValue: {
        type: 'string',
        default: ''
      },
      maxlength: {
        type: 'string',
        default: ''
      },
      rows: {
        type: 'rows',
        default: 4
      },
      required: {
        type: 'boolean',
        default: true
      }
    },
    edit: FormFieldBlock,
    save: saveFormField
  });
};

export default createFormFieldBlock;