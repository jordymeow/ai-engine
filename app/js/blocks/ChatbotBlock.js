// Previous: 0.1.0
// Current: 0.3.4

import { meowIcon } from "./common";

const { __ } = wp.i18n;
const { registerBlockType, createBlock } = wp.blocks;
const { useMemo, useEffect, useState } = wp.element;
const { Button, DropZone, PanelBody, RangeControl, CheckboxControl, TextControl,
	SelectControl, Toolbar, withNotices } = wp.components;
const { BlockControls, InspectorControls } = wp.blockEditor;

const saveChatbot = (props) => {
	const { attributes: { id, fieldName, labelText } } = props;
	console.log(props);
	return (
		<>[mwai_chatbot]</>
	);
}

const FormFieldBlock = props => {
	const { attributes: { id, fieldName, labelText }, setAttributes } = props;
	
	const html = useMemo(() => {
		return saveChatbot(props);
	}, [props]);

	return (
		<>
		{html}
		<InspectorControls>
			<PanelBody title={ __( 'Chatbot' ) }>
			</PanelBody>
			<PanelBody title={ __( 'Settings' ) }>
			</PanelBody>
		</InspectorControls>
		</>
	);
}

const createChatbotBlock = () => {
	registerBlockType('ai-engine/chatbot', {
		title: 'AI Chatbot',
		description: <>This feature is <b>being built</b>. I will allow to create a chatbot. Coming soon!</>,
		icon: meowIcon,
		category: 'layout',
		keywords: [ __( 'ai' ), __( 'openai' ), __( 'chatbot' ) ],
		attributes: {
			id: {
				type: 'string',
				default: ''
			}
		},
		edit: FormFieldBlock,
		save: saveChatbot
	});
}

export default createChatbotBlock;
