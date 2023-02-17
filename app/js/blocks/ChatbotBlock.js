// Previous: 0.3.4
// Current: 0.9.89

import i18n from "../i18n";
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
			<PanelBody title={i18n.COMMON.CHATBOT}>
			</PanelBody>
			<PanelBody title={i18n.COMMON.SETTINGS}>
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
		keywords: [ 'ai', 'openai', 'chatbot' ],
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
