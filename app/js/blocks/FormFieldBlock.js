// Previous: 0.1.0
// Current: 0.3.4

import { meowIcon } from "./common";

const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;
const { useMemo, useEffect, useState } = wp.element;
const { Button, DropZone, PanelBody, RangeControl, CheckboxControl, TextControl,
	SelectControl, Toolbar, withNotices } = wp.components;
const { BlockControls, InspectorControls } = wp.blockEditor;

const saveFormField = (props) => {
	const { attributes: { id, fieldName, labelText } } = props;
	console.log(props);
	return (
		<div className="mwai-field-container">
			<label className="mwai-label" htmlFor={id}>{labelText}</label>
			<input className="mwai-field mwai-input" type="text" id={id} name={fieldName} />
		</div>
	);
}

const FormFieldBlock = props => {
	const { attributes: { id, fieldName, labelText }, setAttributes } = props;
	
	const html = useMemo(() => {
		return saveFormField(props);
	}, [props]);

	return (
		<>
		{html}
		<InspectorControls>
			<PanelBody title={ __( 'Field' ) }>
			<TextControl label="Label Text" value={labelText} onChange={value => setAttributes({ labelText: value })} />
				<TextControl label="Field Name" value={fieldName} onChange={value => setAttributes({ fieldName: value })} />
				<SelectControl label="Field Type" value="text" options={[
					{ label: 'TextField', value: 'text' },
					{ label: 'Select', value: 'select' },
					{ label: 'Checkbox', value: 'checkbox' },
					{ label: 'Radio', value: 'radio' },
					{ label: 'TextArea', value: 'textarea' },
				]} />
			</PanelBody>
			<PanelBody title={ __( 'Settings' ) }>
				<TextControl label="ID" value={id} onChange={value => setAttributes({ id: value })} />
			</PanelBody>
		</InspectorControls>
		</>
	);
}

const createFormFieldBlock = () => {
	registerBlockType('ai-engine/form-field', {
		title: 'AI Form Field',
		description: <>This feature is <b>being built</b>. I will allow to create AI forms. Coming soon!</>,
		icon: meowIcon,
		category: 'layout',
		keywords: [ __( 'ai' ), __( 'openai' ), __( 'form' ) ],
		attributes: {
			id: {
				type: 'string',
				default: ''
			},
			fieldName: {
				type: 'string',
				default: ''
			},
			labelText: {
				type: 'string',
				default: 'Label: '
			},
		},
		edit: FormFieldBlock,
		save: saveFormField
	});
}

export default createFormFieldBlock;
