// Previous: 1.3.69
// Current: 1.3.76

import { useModels } from "../helpers";
import { options } from '@app/settings';
import { AiBlockContainer, meowIcon } from "./common";
import i18n from "../../i18n";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useMemo, useEffect } = wp.element;
const { PanelBody, TextControl, TextareaControl, SelectControl, UnitControl } = wp.components;
const { InspectorControls } = wp.blockEditor;

const saveFormField = (props) => {
	const { attributes: { id, label, prompt, outputElement, model, temperature, maxTokens } } = props;
	const encodedPrompt = encodeURIComponent(prompt);
	return `[mwai-form-submit id="${id}" label="${label}" prompt="${encodedPrompt}" output_element="${outputElement}" model="${model}" temperature="${temperature} max_tokens="${maxTokens}"]`;
}

const FormSubmitBlock = props => {
	const { models } = useModels(options);
	const { attributes: { id, label, prompt, model, temperature, maxTokens, outputElement, placeholders = [] }, setAttributes } = props;

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
		}
	}, [prompt]);

	const fieldsCount = useMemo(() => {
		return placeholders ? placeholders.length : 0;
	}, [placeholders]);

	const modelOptions = useMemo(() => {
		let freshModels = models.map(model => ({ label: model.name, value: model.model }));
		freshModels.push({ label: 'dall-e', value: 'dall-e' });
		return freshModels;
	}, [models]);

	return (
		<>
			<AiBlockContainer title="Submit" type="submit"
				hint={<>
					<span className="mwai-pill">{fieldsCount} field{fieldsCount > 1 ? 's' : ''}</span> to{' '} 
					<span className="mwai-pill mwai-pill-purple">{outputElement}</span></>
				}>
				Input Fields: {placeholders.join(', ')}<br />
				Prompt: {prompt}<br />
				Output Element: {outputElement}
			</AiBlockContainer>
			<InspectorControls>
				<PanelBody title={i18n.COMMON.OUTPUT}>
					<TextControl label={i18n.COMMON.LABEL} value={label} onChange={value => setAttributes({ label: value })} />
					<TextareaControl label={i18n.COMMON.PROMPT} value={prompt}
						onChange={value => setAttributes({ prompt: value })}
						help={i18n.FORMS.PROMPT_INFO} />
					<TextControl label={i18n.FORMS.OUTPUT_ELEMENT} value={outputElement}
						onChange={value => setAttributes({ outputElement: value })}
						help={i18n.FORMS.OUTPUT_ELEMENT_INFO} />
				</PanelBody>
				<PanelBody title={i18n.COMMON.MODEL_PARAMS}>
					{models && models.length > 0 && 
						<SelectControl label={i18n.COMMON.MODEL} value={model} options={modelOptions}
							onChange={value => setAttributes({ model: value })}
					/>}
					<TextControl label={i18n.COMMON.TEMPERATURE} value={temperature}
						onChange={value => setAttributes({ temperature: value })}
						type="number" step="0.1" min="0" max="1"
						help={i18n.HELP.TEMPERATURE} />
					<TextControl label={i18n.COMMON.MAX_TOKENS} value={maxTokens}
						onChange={value => setAttributes({ maxTokens: value })}
						type="number" step="16" min="32" max="4096"
						help={i18n.HELP.MAX_TOKENS} />
				</PanelBody>
				<PanelBody title={i18n.COMMON.SYSTEM}>
					<TextControl label="ID" value={id} onChange={value => setAttributes({ id: value })} />
				</PanelBody>
			</InspectorControls>
		</>
	);
}

const createSubmitBlock = () => {
	registerBlockType('ai-engine/form-submit', {
		title: 'AI Form Submit',
		description: <>This feature is <b>extremely beta</b>. I am enhancing it based on your feedback.</>,
		icon: meowIcon,
		category: 'layout',
		keywords: [ __( 'ai' ), __( 'openai' ), __( 'form' ) ],
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
			}
		},
		edit: FormSubmitBlock,
		save: saveFormField
	});
}

export default createSubmitBlock;