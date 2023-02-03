// Previous: 0.3.4
// Current: 0.6.9

const meowIcon = (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<rect width="20" height="20" fill="white"/>
		<path d="M16.6667 3.33334V13.3333H6.66667V3.33334H16.6667ZM16.6667 1.66667H6.66667L5 3.33334V13.3333L6.66667 15H16.6667L18.3333 13.3333V3.33334L16.6667 1.66667Z" fill="#2D4B6D"/>
		<path d="M10 10L10.8333 11.6667L13.3333 9.16667L15.8333 12.5H7.5L10 10Z" fill="#1ABC9C"/>
		<path d="M1.66667 5V16.6667L3.33333 18.3333H15V16.6667H3.33333V5H1.66667Z" fill="#2D4B6D"/>
</svg>);


import { NekoTheme } from '@neko-ui';
import Styled from "styled-components";
import AiIcon from '../styles/AiIcon';

const BlockContainer = Styled.div`
	background: hsl(0deg 0% 10%);
	color: hsl(0deg 0% 60%);
	padding: 10px 20px;
	display: flex;
	align-items: center;

	.mwai-icon-container {
		flex: inherit;
		width: 40px;
		margin-right: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	> div {
		flex: auto;
	}

	> div:last-child {
		text-align: right;
	}
`;

const AiBlockContainer = ({ children, info = "", ...rest }) => {
	return (
		<BlockContainer className="mwai-block-container" {...rest}>
			<div className="mwai-icon-container">
				<AiIcon icon="ai" style={{ width: 40, height: 40 }} />
			</div>
			<div>
				{children}
			</div>
			<div>
				{info}
			</div>
		</BlockContainer>
	);
}

export { meowIcon, AiBlockContainer };
