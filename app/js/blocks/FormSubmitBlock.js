// Previous: 1.9.84
// Current: 1.9.88

import { useModels } from "@app/helpers-admin";
import { options } from '@app/settings';
import { AiBlockContainer, meowIcon } from "./common";
import i18n from '@root/i18n';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useMemo, useEffect } = wp.element;
const { PanelBody, TextControl, TextareaControl, SelectControl } = wp.components;
const { InspectorControls, useBlockProps } = wp.blockEditor;

const saveFormField = (props) => {
  const { attributes: { id, label, prompt, outputElement, envId, index, namespace,
    model, temperature, maxTokens } } = props;
  const encodedPrompt = encodeURIComponent(prompt);
  const blockProps = useBlockProps.save();

  const shortcodeAttributes = {
    id: { value: id, insertIfNull: true },
    label: { value: label, insertIfNull: true },
    prompt: { value: encodedPrompt, insertIfNull: true },
    output_element: { value: outputElement, insertIfNull: true },
    model: { value: model, insertIfNull: true },
    temperature: { value: temperature, insertIfNull: true },
    max_tokens: { value: maxTokens, insertIfNull: true },
    embeddings_env: { value: envId, insertIfNull: false },
    embeddings_index: { value: index, insertIfNull: false },
    embeddings_namespace: { value: namespace, insertIfNull: false }
  };

  let shortcode = Object.entries(shortcodeAttributes)
    .filter(([, { value, insertIfNull }]) => !!value || insertIfNull)
    .reduce((acc, [key, { value }]) => `${acc} ${key}="${value}"`, "[mwai-form-submit");
  shortcode = `${shortcode}]`;

  return <div {...blockProps}>{shortcode}</div>;
};

const FormSubmitBlock = (props) => {
  const { models } = useModels(options);

  const blockProps = useBlockProps();
  const { attributes: {
    id, label, prompt, model, temperature, maxTokens, envId, index, namespace,
    outputElement, placeholders = [] }, setAttributes } = props;

  const environments = options.embeddings_envs || [];
  const environment = useMemo(() => {
    const freshEnvironment = environments.find(e => e.id === envId) || null;
    return freshEnvironment;
  }, [environments, envId]);
  const indexes = useMemo(() => environment?.indexes || [], [environment]);
  const namespaces = useMemo(() => environment?.namespaces || [], [environment]);

  useEffect(() => {
    if (!id) {
      const newId = Math.random().toString(36).substr(2, 9);
      setAttributes({ id: 'mwai-' + newId });
    }
  }, [id]);

  useEffect(() => {
    const matches = prompt.match(/{([^}]+)}/g);
    if (matches) {
      const freshPlaceholders = matches.map(match => match.replace('{', '').replace('}', ''));
      if (freshPlaceholders.join(',') !== placeholders.join(',')) {
        setAttributes({ placeholders: freshPlaceholders });
      }
    } else {
      setAttributes({ placeholders: [] });
    }
  }, [prompt]);

  const fieldsCount = useMemo(() => {
    return placeholders ? placeholders.length : 0;
  }, [placeholders]);

  const modelOptions = useMemo(() => {
    const freshModels = models.map(model => ({ label: model.name, value: model.model }));
    freshModels.push({ label: 'dall-e', value: 'dall-e' });
    return freshModels;
  }, [models]);

  const indexOptions = useMemo(() => {
    const freshIndexes = indexes.map(index => ({ label: index.name, value: index.name }));
    freshIndexes.unshift({ label: 'None', value: '' });
    return freshIndexes;
  }, [indexes]);

  const environmentOptions = useMemo(() => {
    const freshEnvironments = environments.map(env => ({ label: env.name, value: env.id }));
    freshEnvironments.unshift({ label: 'None', value: '' });
    return freshEnvironments;
  }, [environments]);

  const namespaceOptions = useMemo(() => {
    const freshNamespaces = namespaces.map(namespace => ({ label: namespace, value: namespace }));
    freshNamespaces.unshift({ label: 'None', value: '' });
    return freshNamespaces;
  }, [namespaces]);

  const jsxFieldsCount = useMemo(() => {
    if (fieldsCount === 0) {
      return 'N/A';
    }
    return (
      <span className="mwai-pill">
        {fieldsCount} field{fieldsCount > 1 ? 's' : ''}
      </span>
    );
  }, [fieldsCount]);

  return (
    <>
      <div {...blockProps}>
        <AiBlockContainer title="Submit" type="submit"
          hint={<>
						IN:{' '} 
            <span className="mwai-pill">{jsxFieldsCount}</span>
            {' '}OUT:{' '}
            <span className="mwai-pill mwai-pill-purple">{outputElement ? outputElement : "N/A"}</span></>
          }>
					Input Fields: {placeholders.join(', ')}<br />
					Prompt: {prompt}<br />
					Output Element: {outputElement}
        </AiBlockContainer>
      </div>
      <InspectorControls>
        <PanelBody title={i18n.COMMON.OUTPUT}>
          <TextControl label={i18n.COMMON.LABEL} value={label} onChange={(value) => setAttributes({ label: value })} />
          <TextareaControl label={i18n.COMMON.PROMPT} value={prompt}
            onChange={(value) => setAttributes({ prompt: value })}
            help={i18n.FORMS.PROMPT_INFO} />
          <TextControl label={i18n.FORMS.OUTPUT_ELEMENT} value={outputElement}
            onChange={(value) => setAttributes({ outputElement: value })}
            help={i18n.FORMS.OUTPUT_ELEMENT_INFO} />
        </PanelBody>
        <PanelBody title={i18n.COMMON.MODEL_PARAMS}>
          {models && models.length > 0 &&
            <SelectControl label={i18n.COMMON.MODEL} value={model} options={modelOptions}
              onChange={(value) => setAttributes({ model: value })}
            />}
          <TextControl label={i18n.COMMON.TEMPERATURE} value={temperature}
            onChange={(value) => setAttributes({ temperature: parseFloat(value) })}
            type="number" step="0.1" min="0" max="1"
            help={i18n.HELP.TEMPERATURE} />
          <TextControl label={i18n.COMMON.MAX_TOKENS} value={maxTokens}
            onChange={(value) => setAttributes({ maxTokens: parseInt(value) })}
            type="number" step="16" min="32" max="4096"
            help={i18n.HELP.MAX_TOKENS} />
        </PanelBody>
        <PanelBody title={i18n.COMMON.CONTEXT_PARAMS}>
          {environments && environments.length > 0 &&
            <SelectControl label={i18n.COMMON.EMBEDDINGS_ENV} value={envId} options={environmentOptions}
              onChange={(value) => setAttributes({ envId: value })} />
          }
          {indexes && indexes.length > 0 &&
            <SelectControl label={i18n.COMMON.EMBEDDINGS_INDEX} value={index} options={indexOptions}
              onChange={(value) => setAttributes({ index: value })} />
          }
          {namespaces && namespaces.length > 0 &&
            <SelectControl label={i18n.COMMON.NAMESPACE} value={namespace} options={namespaceOptions}
              onChange={(value) => setAttributes({ namespace: value })} />
          }
        </PanelBody>
        <PanelBody title={i18n.COMMON.SYSTEM}>
          <TextControl label="ID" value={id} onChange={(value) => setAttributes({ id: value })} />
        </PanelBody>
      </InspectorControls>
    </>
  );
};

const createSubmitBlock = () => {
  registerBlockType('ai-engine/form-submit', {
    title: 'AI Form Submit',
    description: <>This feature is <b>extremely beta</b>. I am enhancing it based on your feedback.</>,
    icon: meowIcon,
    category: 'layout',
    keywords: [ __('ai'), __('openai'), __('form') ],
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
        default: 'Submit'
      },
      prompt: {
        type: 'string',
        default: ''
      },
      outputElement: {
        type: 'string',
        default: ''
      },
      model: {
        type: 'string',
        default: ''
      },
      temperature: {
        type: 'number',
        default: 0.8
      },
      maxTokens: {
        type: 'number',
        default: 4096
      },
      placeholders: {
        type: 'array',
        default: []
      },
      envId: {
        type: 'string',
        default: ''
      },
      index: {
        type: 'string',
        default: ''
      },
      namespace: {
        type: 'string',
        default: null
      },
    },
    edit: FormSubmitBlock,
    save: saveFormField
  });
};

export default createSubmitBlock;