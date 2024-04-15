// Previous: 2.2.4
// Current: 2.2.70

// AI Engine
import { useModels } from "@app/helpers-admin";
import { options } from '@app/settings';
import { AiBlockContainer, meowIcon } from "./common";
import i18n from '@root/i18n';
import TokensInfo from "@app/components/TokensInfo";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useMemo, useEffect } = wp.element;
const { PanelBody, TextControl, TextareaControl, SelectControl, CheckboxControl } = wp.components;
const { InspectorControls, useBlockProps } = wp.blockEditor;

const saveFormField = (props) => {
  const { attributes: { id, label, prompt, message, outputElement,
    aiEnvId, embeddingsEnvId, index, namespace,
    model, temperature, maxTokens, isAssistant, assistantId, resolution } } = props;
  const encodedPrompt = encodeURIComponent(prompt);
  const encodedMessage = encodeURIComponent(message);
  const blockProps = useBlockProps.save();

  const shortcodeAttributes = {
    id: { value: id, insertIfNull: true },
    label: { value: label, insertIfNull: true },
    prompt: { value: encodedPrompt, insertIfNull: true },
    message: { value: encodedMessage, insertIfNull: true },
    output_element: { value: outputElement, insertIfNull: true },
    model: { value: model, insertIfNull: false },
    temperature: { value: temperature, insertIfNull: false },
    max_tokens: { value: maxTokens, insertIfNull: false },
    is_assistant: { value: isAssistant, insertIfNull: false },
    env_id: { value: aiEnvId, insertIfNull: false },
    embeddings_env_id: { value: embeddingsEnvId, insertIfNull: false },
    embeddings_index: { value: index, insertIfNull: false },
    embeddings_namespace: { value: namespace, insertIfNull: false },
    assistant_id: { value: assistantId, insertIfNull: false },
    resolution: { value: resolution, insertIfNull: false }
  };

  let shortcode = Object.entries(shortcodeAttributes)
    .filter(([, { value, insertIfNull }]) => !!value || insertIfNull)
    .reduce((acc, [key, { value }]) => `${acc} ${key}="${value}"`, "[mwai-form-submit");
  shortcode = `${shortcode}]`;

  return <div {...blockProps}>{shortcode}</div>;
};

const FormSubmitBlock = (props) => {
  const blockProps = useBlockProps();
  const { attributes: {
    id, label, prompt, message, model, temperature, maxTokens,
    aiEnvId, embeddingsEnvId, index, namespace,
    assistantId, resolution, isAssistant,
    outputElement, placeholders = [] }, setAttributes } = props;

  const embeddingsEnvs = options.embeddings_envs || [];
  const embeddingsEnv = useMemo(() => {
    return embeddingsEnvs.find(e => e.id === embeddingsEnvId) || null;
  }, [embeddingsEnvs, embeddingsEnvId]);
  const indexes = useMemo(() => embeddingsEnv?.indexes || [], [embeddingsEnv]);
  const namespaces = useMemo(() => embeddingsEnv?.namespaces || [], [embeddingsEnv]);

  const aiEnvs = options.ai_envs || [];
  const { models, getModel } = useModels(options, aiEnvId);
  const currentModel = getModel(model);
  const isImage = currentModel?.type === 'image';

  const aiEnvironment = useMemo(() => {
    return aiEnvs.find(e => e.id === aiEnvId) || null;
  }, [aiEnvs, aiEnvId]);

  const allAssistants = aiEnvironment?.assistants || [];
  const assistant = useMemo(() => {
    return allAssistants.find(e => e.id === assistantId) || null;
  }, [allAssistants, assistantId]);

  useEffect(() => {
    if ((aiEnvId || model) && !aiEnvironment) {
      setAttributes({ aiEnvId: null, model: null });
    }
  }, [aiEnvId, model, aiEnvironment]);

  useEffect(() => {
    if ((embeddingsEnvId || index || namespace) && !embeddingsEnv) {
      setAttributes({ embeddingsEnvId: null, index: null, namespace: null });
    }
  }, [embeddingsEnvId, index, namespace, embeddingsEnv]);

  useEffect(() => {
    if (assistant && assistant.model && assistant.model !== model) {
      setAttributes({ model: assistant.model });
    }
  }, [assistant, model]);

  useEffect(() => {
    if (!isAssistant) {
      setAttributes({ assistantId: '' });
    }
  }, [isAssistant]);

  useEffect(() => {
    if (!id) {
      const newId = Math.random().toString(36).substr(2, 9);
      setAttributes({ id: 'mwai-' + newId });
    }
  }, [id]);

  useEffect(() => {
    const matches = message.match(/{([^}]+)}/g);
    if (matches) {
      const freshPlaceholders = matches.map(match => match.replace('{', '').replace('}', ''));
      if (freshPlaceholders.join(',') !== placeholders.join(',')) {
        setAttributes({ placeholders: freshPlaceholders });
      }
    } else {
      setAttributes({ placeholders: [] });
    }
  }, [message, placeholders]);

  useEffect(() => {
    if (prompt) {
      setAttributes({ 
        message: prompt,
        prompt: null
      });
    }
  }, [prompt]);

  const fieldsCount = useMemo(() => {
    return placeholders ? placeholders.length : 0;
  }, [placeholders]);

  const assistantOptions = useMemo(() => {
    const freshAssistants = allAssistants.map(assistant => ({ label: assistant.name, value: assistant.id }));
    freshAssistants.unshift({ label: 'None', value: '' });
    return freshAssistants;
  }, [allAssistants]);

  const modelOptions = useMemo(() => {
    const freshModels = models.map(model => ({ label: model.rawName, value: model.model }));
    freshModels.unshift({ label: 'Default', value: '' });
    return freshModels;
  }, [models]);

  const resolutionOptions = useMemo(() => {
    if (!currentModel || !isImage) {
      return [];
    }
    const freshResolutions = currentModel?.options?.map(x => ({ label: x.option, value: x.option })) || [];
    freshResolutions.unshift({ label: 'None', value: '' });
    return freshResolutions;
  }, [currentModel, isImage]);

  const indexOptions = useMemo(() => {
    const freshIndexes = indexes.map(index => ({ label: index.name, value: index.name }));
    freshIndexes.unshift({ label: 'None', value: '' });
    return freshIndexes;
  }, [indexes]);

  const aiEnvironmentOptions = useMemo(() => {
    const freshEnvironments = aiEnvs.map(env => ({ label: env.name, value: env.id }));
    freshEnvironments.unshift({ label: 'Default', value: '' });
    return freshEnvironments;
  }, [aiEnvs]);

  const embeddingsEnvironmentOptions = useMemo(() => {
    const freshEnvironments = embeddingsEnvs.map(env => ({ label: env.name, value: env.id }));
    freshEnvironments.unshift({ label: 'None', value: '' });
    return freshEnvironments;
  }, [embeddingsEnvs]);

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
          Prompt: {message}<br />
          Output Element: {outputElement}
        </AiBlockContainer>
      </div>
      <InspectorControls>
        <PanelBody title={i18n.COMMON.OUTPUT}>
          <TextControl label={i18n.COMMON.LABEL} value={label} onChange={(val) => setAttributes({ label: val })} />
          <TextareaControl label={i18n.COMMON.PROMPT} value={message}
            onChange={(val) => setAttributes({ message: val })}
            help={i18n.FORMS.PROMPT_INFO} />
          <TextControl label={i18n.FORMS.OUTPUT_ELEMENT} value={outputElement}
            onChange={(val) => setAttributes({ outputElement: val })}
            help={i18n.FORMS.OUTPUT_ELEMENT_INFO} />
        </PanelBody>

        <PanelBody title={i18n.COMMON.MODEL_PARAMS}>
          {aiEnvs && aiEnvs.length > 0 &&
            <SelectControl label={i18n.COMMON.ENVIRONMENT} value={aiEnvId} options={aiEnvironmentOptions}
              onChange={(val) => setAttributes({ aiEnvId: val })} />
          }
          {aiEnvs && aiEnvs.length > 0 &&
            <CheckboxControl label="Assistant Mode" checked={isAssistant}
              onChange={(val) => setAttributes({ isAssistant: val })} />
          }

          {isAssistant && allAssistants && allAssistants.length > 0 && <>
            <SelectControl label={i18n.COMMON.ASSISTANT} value={assistantId} options={assistantOptions}
              onChange={(val) => setAttributes({ assistantId: val })} />
          </>}

          {!isAssistant && <>
            {models && models.length > 0 &&
              <SelectControl label={i18n.COMMON.MODEL} value={model} options={modelOptions}
                onChange={(val) => setAttributes({ model: val })} />}
            {!isImage && <>
              <TextControl label={i18n.COMMON.TEMPERATURE} value={temperature}
                onChange={(val) => setAttributes({ temperature: parseFloat(val) }) }
                type="number" step="0.1" min="0" max="1"
                help={i18n.HELP.TEMPERATURE}
              />
              <TextControl label={i18n.COMMON.MAX_TOKENS} value={maxTokens}
                onChange={(val) => setAttributes({ maxTokens: parseInt(val) }) }
                type="number" step="16" min="32" max="4096"
                help={<TokensInfo model={currentModel} maxTokens={maxTokens}
                  onRecommendedClick={(val) => setAttributes({ maxTokens: val }) }
                />}
              />
            </>}
            {isImage && <>
              <SelectControl label={i18n.COMMON.RESOLUTION} value={resolution} options={resolutionOptions}
                onChange={(val) => setAttributes({ resolution: val })} />
            </>}
          </>}

        </PanelBody>

        {!isImage && <>
          <PanelBody title={i18n.COMMON.CONTEXT_PARAMS}>
            {embeddingsEnvs && embeddingsEnvs.length > 0 &&
              <SelectControl label={i18n.COMMON.EMBEDDINGS_ENV} value={embeddingsEnvId} options={embeddingsEnvironmentOptions}
                disabled={!embeddingsEnvironmentOptions?.length}
                onChange={(val) => setAttributes({ embeddingsEnvId: val })} />
            }
            {indexes && indexes.length > 0 &&
              <SelectControl label={i18n.COMMON.EMBEDDINGS_INDEX} value={index} options={indexOptions}
                disabled={!embeddingsEnvironmentOptions?.length}
                onChange={(val) => setAttributes({ index: val })} />
            }
            {embeddingsEnv?.type === 'pinecone' && namespaces && namespaces.length > 0 &&
              <SelectControl label={i18n.COMMON.NAMESPACE} value={namespace} options={namespaceOptions}
                disabled={!embeddingsEnvironmentOptions?.length}
                onChange={(val) => setAttributes({ namespace: val })} />
            }
          </PanelBody>
        </>}

        <PanelBody title={i18n.COMMON.SYSTEM}>
          <TextControl label="ID" value={id} onChange={(val) => setAttributes({ id: val })} />
        </PanelBody>

      </InspectorControls>
    </>
  );
};

const createSubmitBlock = () => {
  registerBlockType('ai-engine/form-submit', {
    title: 'AI Form Submit',
    icon: meowIcon,
    category: 'layout',
    keywords: [ __( 'ai' ), __( 'openai' ), __( 'form' ) ],
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
      message: {
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
      aiEnvId: {
        type: 'string',
        default: ''
      },
      embeddingsEnvId: {
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
      isAssistant: {
        type: 'boolean',
        default: false
      },
      assistantId: {
        type: 'string',
        default: ''
      },
      resolution: {
        type: 'string',
        default: null
      }
    },
    edit: FormSubmitBlock,
    save: saveFormField
  });
};

export default createSubmitBlock;