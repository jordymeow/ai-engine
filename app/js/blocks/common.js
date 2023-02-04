// Previous: 0.7.5
// Current: 0.7.6

const meowIcon = (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect width="20" height="20" fill="white"/>
		<path d="M16.6667 3.33334V13.3333H6.66667V3.33334H16.6667ZM16.6667 1.66667H6.66667L5 3.33334V13.3333L6.66667 15H16.6667L18.3333 13.3333V3.33334L16.6667 1.66667Z" fill="#2D4B6D"/>
		<path d="M10 10L10.8333 11.6667L13.3333 9.16667L15.8333 12.5H7.5L10 10Z" fill="#1ABC9C"/>
		<path d="M1.66667 5V16.6667L3.33333 18.3333H15V16.6667H3.33333V5H1.66667Z" fill="#2D4B6D"/>
</svg>);


import { NekoTheme, useClasses } from '@neko-ui';
import Styled from "styled-components";
import AiIcon from '../styles/AiIcon';

const BlockContainer = Styled.div`
	background: hsl(0deg 0% 10%);
	color: white;
	display: flex;
	flex-direction: column;
	border: 2px solid #39326e;
	font-size: 15px;
	box-sizing: content-box;

	.mwai-title-container {
		flex: inherit;
		padding: 5px 0px 5px 10px;
		display: flex;
		background: #39326d;
		align-items: center;
		color: white;
	}

	.mwai-block-container-content {
		flex: auto;
		padding: 0px 10px;
		background: #272247;

		.mwai-block-container {
			border: 2px solid #326d5c;
			margin: 10px 0;

			.mwai-title-container {
				background: #326d5c;
			}

			.mwai-block-container-content {
				background: #24483e;
			}
		}
	}

	&:not(.mwai-container) {

		.mwai-block-container-content {
			padding: 10px;
			display: flex;
		}
	}
`;

const AiBlockContainer = ({ children, type = "", title = "", ...rest }) => {
	const classes = useClasses('mwai-block-container', 'mwai-' + type);
	return (
		<BlockContainer className={classes} {...rest}>
			<div className="mwai-title-container">
				<AiIcon icon="ai" style={{ width: 20, height: 20 }} /> {title}
			</div>
			<div className="mwai-block-container-content">
				{children}
			</div>
		</BlockContainer>
	);
}

export { meowIcon, AiBlockContainer };
