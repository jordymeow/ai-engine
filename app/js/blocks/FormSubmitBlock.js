// Previous: 0.7.6
// Current: 0.1.0

import { useModels } from "../helpers";
import { options } from '@app/settings';
import { AiBlockContainer, meowIcon } from "./common";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useMemo, useEffect } = wp.element;
const { PanelBody, TextControl, TextareaControl, SelectControl, UnitControl } = wp.components;
const { InspectorControls } = wp.blockEditor;

const saveFormField = (props) => {
	const { attributes: { label, prompt, outputElement, model, temperature } } = props;
	const encodedPrompt = encodeURIComponent(prompt);
	return `[mwai-form-submit label="${label}" prompt="${encodedPrompt}" output_element="${outputElement}" model="${model}" temperature="${temperature}"]`;
}

const FormSubmitBlock = props => {
	const { models } = useModels(options);
	const { attributes: { label, prompt, model, temperature, outputElement, placeholders = [] }, setAttributes } = props;

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
		let freshModels = models.map(model => ({ label: model.name, value: model.id }));
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
				<PanelBody title={ __( 'Output' ) }>
					<TextControl label="Label" value={label} onChange={value => setAttributes({ label: value })} />
					<TextareaControl label="Prompt" value={prompt} onChange={value => setAttributes({ prompt: value })}
						help="The template of your prompt. To re-use the data entered by the user, use the name of that field between curly braces. Example: Recommend me {MUSIC_TYPE} artists. You can also use an ID as an input, like this: ${#myfield}. Finally, if you wish the output to be formatted, add: Use Markdown format." />
					<TextControl label="Output Element" value={outputElement} onChange={value => setAttributes({ outputElement: value })}
						help="The result will be written to this element. If you wish to simply display the result in an Output Block, use its ID. For instance, if its ID is mwai-666, use '#mwai-666'." />
				</PanelBody>
				<PanelBody title={ __( 'Params' ) }>
					{models && models.length > 0 && 
						<SelectControl label={ __( 'Model' ) } value={model} options={modelOptions}
							onChange={value => setAttributes({ model: value })}
					/>}
					<TextControl label="Temperature" value={temperature} onChange={value => setAttributes({ temperature: value })}
						type="number" step="0.1" min="0" max="1"
						help="The temperature of the model. 0.8 is the default. Lower values will make the model more conservative, higher values will make it more creative." />
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