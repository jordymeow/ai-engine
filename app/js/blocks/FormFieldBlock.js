// Previous: 0.8.7
// Current: 0.8.9

import { AiBlockContainer, meowIcon } from "./common";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useMemo, useEffect } = wp.element;
const { Button, PanelBody, TextControl, SelectControl } = wp.components;
const { InspectorControls } = wp.blockEditor;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const saveFormField = (props) => {
	const { attributes: { id, label, type, name, options = [], placeholder } } = props;
	const encodedOptions = encodeURIComponent(JSON.stringify(options));
	return `[mwai-form-field id='${id}' label="${label}" type="${type}" name="${name}" options="${encodedOptions}" placeholder="${placeholder}"]`;
}

const FormFieldBlock = props => {
	const { attributes: { id, type, name, options = [], label, placeholder }, setAttributes } = props;

	useEffect(() => {
		if (!id) {
			const newId = Math.random().toString(36).substr(2, 9);
			setAttributes({ id: 'mwai-' + newId });
		}
	}, [id]);

	useEffect(() => {
		if (label) {
			const newName = label.trim().replace(/ /g, '_').replace(/[^\w-]+/g, '').toUpperCase();
			setAttributes({ name: newName });
		}
	}, [label]);

	return (
		<>
		<AiBlockContainer title={`${capitalizeFirstLetter(type)}`} type="field"
			hint={<span className="mwai-pill">{name}</span>}>
			<div>
				{label}
			</div>
			<div style={{ flex: 'auto' }}></div>
			<div>
				{name}
			</div>
		</AiBlockContainer>
		<InspectorControls>
			<PanelBody title={ __( 'Field' ) }>
			<TextControl label="Label Text" value={label} onChange={value => setAttributes({ label: value })} />
				<TextControl label="Field Name" value={name} onChange={value => setAttributes({ name: value })} />
				<SelectControl label="Field Type" value={type} onChange={value => setAttributes({ type: value })}
					options={[
						{ label: 'Input', value: 'input' },
						{ label: 'Select', value: 'select' },
						// { label: 'Checkbox', value: 'checkbox' },
						{ label: 'Radio', value: 'radio' },
						{ label: 'Text Area', value: 'textarea' },
					]}
				/>
				{(type === 'input' || type === 'textarea') &&
					<TextControl label="Placeholder" value={placeholder}
						onChange={value => setAttributes({ placeholder: value })} />
				}
			</PanelBody>
			{type === 'select' && <PanelBody title={
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
					<div>{ __( 'Options' ) }</div>
					<Button isPrimary isSmall onClick={(ev) => {
							ev.preventDefault();
							const newOptions = [...options];
							newOptions.push({ label: '', value: '' });
							setAttributes({ options: newOptions });
						}}>Add Option</Button>
				</div>}>
				
				{options.map((option, index) => {
					return <div key={index} style={{ display: 'flex', marginBottom: -25 }}>
						<TextControl style={{ flex: 2, marginBottom: 0, marginRight: 5 }}
							label="Label"
							isInline={true}
							value={option.label}
							onChange={value => {
								const newOptions = [...options];
								newOptions[index].label = value;
								setAttributes({ options: newOptions });
							}
						} />
						<TextControl style={{ flex: 1, marginBottom: 0 }}
							label="Value"
							isSubtle={true}
							value={option.value}
							onChange={value => {
								const newOptions = [...options];
								newOptions[index].value = value;
								setAttributes({ options: newOptions });
							}
						} />
						<div style={{ paddingTop: 29 }}>
							<Button style={{ flex: 1, marginLeft: 5 }} isDestructive isSmall onClick={() => {
								const newOptions = [...options];
								newOptions.splice(index, 1);
								setAttributes({ options: newOptions });
							}}>Remove</Button>
						</div>
						</div>
						
				})}
			</PanelBody>}
			<PanelBody title={ __( 'Optional' ) }>
				<TextControl label="ID" value={id} onChange={value => setAttributes({ id: value })} />
			</PanelBody>
		</InspectorControls>
		</>
	);
}

const createFormFieldBlock = () => {
	registerBlockType('ai-engine/form-field', {
		title: 'AI Form Field',
		description: <>This feature is <b>extremely beta</b>. I am enhancing it based on your feedback.</>,
		icon: meowIcon,
		category: 'layout',
		keywords: [ __( 'ai' ), __( 'openai' ), __( 'form' ) ],
		attributes: {
			id: {
				type: 'string',
				default: ''
			},
			name: {
				type: 'string',
				default: 'LABEL'
			},
			type: {
				type: 'string',
				default: 'input'
			},
			options: {
				type: 'array',
				default: []
			},
			label: {
				type: 'string',
				default: 'Label: '
			},
			placeholder: {
				type: 'string',
				default: ''
			},
		},
		edit: FormFieldBlock,
		save: saveFormField
	});
}

export default createFormFieldBlock;