// Previous: 0.1.0
// Current: 0.6.9

import { AiBlockContainer, meowIcon } from "./common";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useMemo, useEffect } = wp.element;
const { PanelBody, TextControl, TextareaControl } = wp.components;
const { InspectorControls } = wp.blockEditor;

const saveFormField = (props) => {
	const { attributes: { id, label, prompt, outputElement } } = props;
	const encodedPrompt = encodeURIComponent(prompt);
	return `[mwai-form-submit id="${id}" label="${label}" prompt="${encodedPrompt}" output_element="${outputElement}"]`;
}

const FormSubmitBlock = props => {
	const { attributes: { id, label, prompt, outputElement, placeholders = [] }, setAttributes } = props;

	useEffect(() => {
		// Catch all the variables between the curly braces
		const placeholders = prompt.match(/{([^}]+)}/g);
		if (placeholders) {
			setAttributes({ placeholders: placeholders.map(placeholder => placeholder.replace('{', '').replace('}', '')) });
		}
	}, [prompt]);

	useEffect(() => {
		if (!id) {
			const newId = Math.random().toString(36).substr(2, 9);
			setAttributes({ id: 'mwai-' + newId });
		}
	}, [id]);

	return (
		<>
			<AiBlockContainer info={<>{placeholders.join(', ')}<br /> -&gt; {outputElement}</>}>
				<small>SUBMITTER BLOCK</small><br />
				{label}
			</AiBlockContainer>
			<InspectorControls>
				<PanelBody title={ __( 'Output' ) }>
					<TextControl label="Label" value={label} onChange={value => setAttributes({ label: value })} />
					<TextareaControl label="Prompt" value={prompt} onChange={value => setAttributes({ prompt: value })}
						help="The template of your prompt. To re-use the data entered by the user, use the name of that field between curly braces. Example: 'Recommend me {MUSIC_TYPE} artists.'" />
					<TextControl label="Output Element" value={outputElement} onChange={value => setAttributes({ outputElement: value })}
						help="The result will be written to this element. If you wish to simply display the result in an Output Block, use its ID. For instance, if its ID is mwai-666, use '#mwai-666'." />
				</PanelBody>
			</InspectorControls>
		</>
	);
}

const createSubmitBlock = () => {
	registerBlockType('ai-engine/form-submit', {
		title: 'AI Form Submitter',
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
			}
		},
		edit: FormSubmitBlock,
		save: saveFormField
	});
}

export default createSubmitBlock;
