// Previous: none
// Current: 0.3.2

const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;
const { useMemo, useEffect, useState } = wp.element;
const { Button, DropZone, PanelBody, RangeControl, CheckboxControl, TextControl,
	SelectControl, Toolbar, withNotices } = wp.components;
const { BlockControls, InspectorControls } = wp.blockEditor;

const meowIcon = (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect width="20" height="20" fill="white"/>
		<path d="M16.6667 3.33334V13.3333H6.66667V3.33334H16.6667ZM16.6667 1.66667H6.66667L5 3.33334V13.3333L6.66667 15H16.6667L18.3333 13.3333V3.33334L16.6667 1.66667Z" fill="#2D4B6D"/>
		<path d="M10 10L10.8333 11.6667L13.3333 9.16667L15.8333 12.5H7.5L10 10Z" fill="#1ABC9C"/>
		<path d="M1.66667 5V16.6667L3.33333 18.3333H15V16.6667H3.33333V5H1.66667Z" fill="#2D4B6D"/>
</svg>);

const FormFieldBlock = props => {
	const { attributes: { id, name }, setAttributes } = props;
	const [idValue, setIdValue] = useState(id);
	const [nameValue, setNameValue] = useState(name);

	return (
		<>
		<div className="mwai-field">
			<label className="mwai-label" htmlFor={idValue}>Label:</label>
			<input className="mwai-input" type="text" id={idValue} name={nameValue} />
		</div>
		<InspectorControls>
			<PanelBody title={ __( 'Settings' ) }>
			</PanelBody>
		</InspectorControls>
		</>
	);
}

const saveFormField = (props) => {
	const { attributes: { id, name } } = props;
	return (
		<div className="mwai-field">
			<label className="mwai-label" htmlFor={id}>Label:</label>
			<input className="mwai-input" type="text" id={id} name={name} />
		</div>
	);
}

const createFormFieldBlock = () => {
	registerBlockType('ai-engine/form-field', {
		title: 'AI Form Field',
		icon: meowIcon,
		category: 'layout',
		keywords: [ __( 'ai' ), __( 'openai' ), __( 'form' ) ],
		attributes: {
			id: {
				type: 'string',
				default: 'input-field'
			},
			name: {
				type: 'string',
				default: 'input-field'
			},
		},
		edit: FormFieldBlock,
		save: saveFormField
	});
}

export default createFormFieldBlock;
