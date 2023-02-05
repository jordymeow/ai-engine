// Previous: 0.7.6
// Current: 0.8.2

import { AiBlockContainer, meowIcon } from "./common";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useMemo, useEffect } = wp.element;
const { Button, PanelBody, TextControl, SelectControl } = wp.components;
const { InspectorControls, InnerBlocks, useBlockProps } = wp.blockEditor;

const saveFormField = (props) => {
	const blockProps = useBlockProps.save();
	const { attributes: { id, theme } } = props;
	const shortcode = `[mwai-form-container id="${id}" theme="${theme}"]`;
	return (
		<div { ...blockProps } id={`mwai-form-container-${id}`} className="mwai-form-container">
			{shortcode}
			<InnerBlocks.Content />
		</div>
	);
}

const FormContainerBlock = props => {
	const { attributes: { id, theme }, setAttributes } = props;
	const blockProps = useBlockProps();

	useEffect(() => {
		if (!id) {
			const newId = Math.random().toString(36).substr(2, 9);
			setAttributes({ id: newId });
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
				<PanelBody title={ __( 'Style' ) }>
				<p>The theme will be applied to all the AI elements in this container.</p>
					<SelectControl label="Theme" value={theme} onChange={value => setAttributes({ theme: value })}
						options={[
							{ label: 'None', value: 'none' },
							{ label: 'ChatGPT', value: 'ChatGPT' }
						]}
					/>
				</PanelBody>
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
			theme: {
				type: 'string',
				default: 'ChatGPT'
			}
		},
		edit: FormContainerBlock,
		save: saveFormField
	});
}

export default createContainerBlock;
