// Previous: 0.1.0
// Current: 0.6.9

import { AiBlockContainer, meowIcon } from "./common";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useMemo, useEffect } = wp.element;
const { PanelBody, TextControl } = wp.components;
const { InspectorControls } = wp.blockEditor;

const saveFormField = (props) => {
	const { attributes: { id } } = props;
	return `[mwai-form-output id="${id}"]`;
}

const FormOutputBlock = props => {
	const { attributes: { id }, setAttributes } = props;

	useEffect(() => {
		if (!id) {
			const newId = Math.random().toString(36).substr(2, 9);
			setAttributes({ id: 'mwai-' + newId });
		}
	}, [id]);

	return (
		<>
			<AiBlockContainer info={<>{id}</>}>
			<small>OUTPUT BLOCK</small>
			</AiBlockContainer>
			<InspectorControls>
				<PanelBody title={ __( 'Output' ) }>
					<TextControl label="ID" value={id} onChange={value => setAttributes({ id: value })} />
				</PanelBody>
			</InspectorControls>
		</>
	);
}

const createOutputBlock = () => {
	registerBlockType('ai-engine/form-output', {
		title: 'AI Form Output',
		description: <>This feature is <b>extremely beta</b>. I am enhancing it based on your feedback.</>,
		icon: meowIcon,
		category: 'layout',
		keywords: [ __( 'ai' ), __( 'openai' ), __( 'form' ) ],
		attributes: {
			id: {
				type: 'string',
				default: ''
			},
		},
		edit: FormOutputBlock,
		save: saveFormField
	});
}

export default createOutputBlock;
