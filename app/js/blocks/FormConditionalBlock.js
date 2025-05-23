// Previous: none
// Current: 2.8.2

import i18n from '@root/i18n';
import { AiBlockContainer, meowIcon } from "./common";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useEffect, useMemo } = wp.element;
const { PanelBody, TextControl, SelectControl, Button } = wp.components;
const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;
const { useSelect } = wp.data;

const saveConditionalBlock = (props) => {
  const { attributes: { id, conditions = [], logic = 'AND', conditionField, conditionValue } } = props;
  const blockProps = useBlockProps.save();
  let shortcode = `[mwai-form-conditional id="${id}"`;
  const conds = conditions.length ? conditions : (conditionField ? [{ field: conditionField, operator: 'eq', value: conditionValue }] : []);
  if (conds.length) {
    shortcode += ` conditions="${encodeURIComponent(JSON.stringify(conds))}" logic="${logic}"`;
  }
  shortcode += ']';
  return (
    <div {...blockProps} id={`mwai-form-conditional-${id}`} className="mwai-form-conditional" style={{ display: 'none' }}>
      {shortcode}
      <InnerBlocks.Content />
    </div>
  );
};

const operatorOptions = [
  { label: 'Equals', value: 'eq' },
  { label: 'Not Equals', value: 'neq' },
  { label: 'Contains', value: 'contains' },
  { label: 'Is Empty', value: 'empty' },
  { label: 'Is Not Empty', value: 'not_empty' },
];
const logicOptions = [
  { label: 'AND', value: 'AND' },
  { label: 'OR', value: 'OR' },
];

const FormConditionalBlock = (props) => {
  const { attributes: { id, conditions = [], logic = 'AND', conditionField, conditionValue }, setAttributes, clientId } = props;
  const blockProps = useBlockProps();

  useEffect(() => {
    if (!id) {
      const newId = Math.random().toString(36).substr(2, 9);
      setAttributes({ id: newId });
    }
    if (!conditions.length && (conditionField || conditionValue)) {
      setAttributes({ conditions: [{ field: conditionField, operator: 'eq', value: conditionValue }] });
    }
  }, [id]);

  const fields = useSelect((select) => {
    const { getBlock, getBlockRootClientId } = select('core/block-editor');
    let parentId = getBlockRootClientId(clientId);
    while (parentId) {
      const parentBlock = getBlock(parentId);
      if (parentBlock?.name === 'ai-engine/form-container') {
        break;
      }
      parentId = getBlockRootClientId(parentId);
    }
    const names = [];
    if (parentId) {
      const containerBlock = getBlock(parentId);
      const gatherNames = (block) => {
        if (block.name === 'ai-engine/form-field' && block.attributes?.name) {
          names.push(block.attributes.name);
        }
        if (block.innerBlocks) {
          block.innerBlocks.forEach(gatherNames);
        }
      };
      containerBlock.innerBlocks.forEach(gatherNames);
    }
    return names;
  }, [clientId]);

  const fieldOptions = useMemo(() => {
    const opts = fields.map(n => ({ label: n, value: n }));
    opts.unshift({ label: '[N/A]', value: '' });
    return opts;
  }, [fields]);

  useEffect(() => {
    if (fields.length === 1 && conditions.some(c => !c.field)) {
      const defField = fields[0];
      const updated = conditions.map(c => c.field ? c : { ...c, field: defField });
      setAttributes({ conditions: updated });
    }
  }, [fields, conditions]);

  const hint = useMemo(() => {
    const hasProblem = conditions.length === 0 || conditions.some(c => !c.field);
    if (hasProblem) {
      return <span className="mwai-pill mwai-pill-red">[N/A]</span>;
    }
    return (
      <span className="mwai-pill">{conditions.length} condition{conditions.length > 1 ? 's' : ''}</span>
    );
  }, [conditions]);

  return (
    <>
      <div {...blockProps}>
        <AiBlockContainer title="Conditional" type="conditional" isDisplayed={true} hint={hint}>
          <InnerBlocks />
        </AiBlockContainer>
      </div>
      <InspectorControls>
        <PanelBody title={__('Conditions')}>
          {conditions.map((cond, index) => (
            <div key={index} style={{ marginBottom: '8px' }} className="mwai-condition-panel">
              <PanelBody title={`Condition ${index + 1}`} initialOpen={true}>
                <SelectControl
                  label="Field"
                  value={cond.field}
                  options={fieldOptions}
                  onChange={value => {
                    const newConds = [...conditions];
                    newConds[index].field = value;
                    setAttributes({ conditions: newConds });
                  }}
                />
                <SelectControl
                  label="Operator"
                  value={cond.operator}
                  options={operatorOptions}
                  onChange={value => {
                    const newConds = [...conditions];
                    newConds[index].operator = value;
                    setAttributes({ conditions: newConds });
                  }}
                />
                {cond.operator !== 'empty' && cond.operator !== 'not_empty' && (
                  <TextControl
                    label="Value"
                    value={cond.value}
                    onChange={value => {
                      const newConds = [...conditions];
                      newConds[index].value = value;
                      setAttributes({ conditions: newConds });
                    }}
                  />
                )}
                <Button
                  isSecondary
                  isDestructive
                  icon="trash"
                  style={{ width: '100%' }}
                  onClick={() => {
                    const newConds = conditions.filter((_, i) => i !== index);
                    setAttributes({ conditions: newConds });
                  }}
                >
                  {__('Remove')}
                </Button>
              </PanelBody>
              {index < conditions.length - 1 && (
                <SelectControl
                  label=""
                  value={logic}
                  options={logicOptions}
                  onChange={value => setAttributes({ logic: value })}
                />
              )}
            </div>
          ))}
          <Button
            isPrimary
            style={{ width: '100%', marginBottom: '8px' }}
            icon="plus"
            onClick={() => {
              const defaultField = fields.length === 1 ? fields[0] : '';
              setAttributes({ conditions: [...conditions, { field: defaultField, operator: 'eq', value: '' }] });
            }}
          >
            {__('Add Condition')}
          </Button>
          <TextControl label="ID" value={id} onChange={(value) => setAttributes({ id: value })} />
        </PanelBody>
      </InspectorControls>
    </>
  );
};

const createConditionalBlock = () => {
  registerBlockType('ai-engine/form-conditional', {
    title: 'AI Form Conditional',
    description: 'Display inner blocks only when a condition is met.',
    icon: meowIcon,
    category: 'layout',
    keywords: [ __( 'ai' ), __( 'openai' ), __( 'form' ) ],
    attributes: {
      id: { type: 'string', default: '' },
      conditions: { type: 'array', default: [] },
      logic: { type: 'string', default: 'AND' },
      // Legacy attributes
      conditionField: { type: 'string', default: '' },
      conditionValue: { type: 'string', default: '' },
    },
    edit: FormConditionalBlock,
    save: saveConditionalBlock,
  });
};

export default createConditionalBlock;