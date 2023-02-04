// Previous: 0.7.5
// Current: 0.7.6

import { AiBlockContainer, meowIcon } from "./common";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useMemo, useEffect } = wp.element;
const { PanelBody, TextControl } = wp.components;
const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;

const saveFormField = (props) => {
	const blockProps = useBlockProps.save();
	const { attributes: { id } } = props;
	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}

const FormContainerBlock = props => {
	const { attributes: { id }, setAttributes } = props;
	const blockProps = useBlockProps();

	useEffect(() => {
		if (!id) {
			const newId = Math.random().toString(36).substr(2, 9);
			setAttributes({ id: 'mwai-' + newId });
		}
	}, [id]);

	return (
		<>
			<AiBlockContainer title="AI Form Container" type="container">
				<div {...blockProps}>
					<InnerBlocks />
				</div>
			</AiBlockContainer>
			<InspectorControls>
			</InspectorControls>
		</>
	);
}

const createContainerBlock = () => {
	registerBlockType('ai-engine/form-container', {
		title: 'AI Form Container',
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
		edit: FormContainerBlock,
		save: saveFormField
	});
}

export default createContainerBlock;
