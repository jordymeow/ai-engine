// Previous: 0.9.85
// Current: 0.9.86

import { AiBlockContainer, meowIcon } from "./common";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useEffect } = wp.element;
const { Button, PanelBody, TextControl, SelectControl, Icon } = wp.components;
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

	const onUpdateLabel = (value) => {
		setAttributes({ label: value });
		const newName = value.trim().replace(/ /g, '_').replace(/[^\w-]+/g, '').toUpperCase();
		if (newName) {
			setAttributes({ name: newName });
		}
	}

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
			<TextControl label="Label Text" value={label} onChange={onUpdateLabel} />
				<TextControl label="Field Name" value={name} onChange={value => setAttributes({ name: value })} />
				<SelectControl label="Field Type" value={type} onChange={value => setAttributes({ type: value })}
					options={[
						{ label: 'Input', value: 'input' },
						{ label: 'Select', value: 'select' },
						{ label: 'Checkbox', value: 'checkbox' },
						{ label: 'Radio', value: 'radio' },
						{ label: 'Text Area', value: 'textarea' },
					]}
				/>
				{(type === 'input' || type === 'textarea') &&
					<TextControl label="Placeholder" value={placeholder}
						onChange={value => setAttributes({ placeholder: value })} />
				}
			</PanelBody>
			{(type === 'select' || type === 'radio' || type === 'checkbox') && <PanelBody title={
				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
					<div>{ __( 'Options' ) }</div>
				</div>}>
				
				{options.map((option, index) => {
					return <div key={index} style={{ display: 'flex', marginBottom: -25 }}>
						<div style={{ marginRight: 5 }}>
						<TextControl style={{ marginRight: 10 }}
							label="Label"
							isInline={true}
							value={option.label}
							onChange={value => {
								const newOptions = [...options];
								newOptions[index].label = value;
								setAttributes({ options: newOptions });
							}
						} />
						</div>
						<TextControl style={{  }}
							label="Value"
							isSubtle={true}
							value={option.value}
							onChange={value => {
								const newOptions = [...options];
								newOptions[index].value = value;
								setAttributes({ options: newOptions });
							}
						} />
						<div style={{ marginLeft: 5, position: 'relative', top: 23 }}>
							<Button style={{ height: 30 }} isDestructive
								icon="trash" isSmall onClick={() => {
								const newOptions = [...options];
								newOptions.splice(index, 1);
								setAttributes({ options: newOptions });
							}} />
						</div>
						</div>
				})}

				<Button isPrimary style={{ width: '100%', marginTop: 10 }} onClick={(ev) => {
					const newOptions = [...options];
					newOptions.push({ label: '', value: '' });
					setAttributes({ options: newOptions });
				}}>Add Option</Button>
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