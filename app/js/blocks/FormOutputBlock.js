// Previous: 1.4.9
// Current: 1.8.4

import i18n from '@root/i18n';
import { AiBlockContainer, meowIcon } from "./common";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useEffect } = wp.element;
const { PanelBody, TextControl } = wp.components;
const { InspectorControls, useBlockProps } = wp.blockEditor;

const saveFormField = (props) => {
	const blockProps = useBlockProps.save();
	const { attributes: { id } } = props;
	const shortcode = `[mwai-form-output id="${id}"]`;
	return <div {...blockProps}>{shortcode}</div>;
}

const FormOutputBlock = props => {
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
			<div {...blockProps}>
				<AiBlockContainer title="Output" type="output"
					hint={<span className="mwai-pill mwai-pill-purple">#{id}</span>}>
					<div></div>
					<div style={{ flex: 'auto' }}></div>
					<div>#{id}</div>
				</AiBlockContainer>
			</div>
			<InspectorControls>
				<PanelBody title={i18n.FORMS.OUTPUT}>
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
		supports: {
			dimensions: {
				minHeight: true,
			}
		},
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
