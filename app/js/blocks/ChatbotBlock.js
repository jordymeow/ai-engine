// Previous: 0.9.92
// Current: 1.4.1

import i18n from "../../i18n";
import { meowIcon } from "./common";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { useMemo } = wp.element;
const { PanelBody } = wp.components;
const { InspectorControls } = wp.blockEditor;

const saveChatbot = (props) => {
	const { } = props;
	console.log(props);
	return (
		<>[mwai_chatbot]</>
	);
}

const FormFieldBlock = props => {
	const {  } = props;
	
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
