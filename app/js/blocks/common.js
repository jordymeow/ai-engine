// Previous: 0.7.6
// Current: 0.8.7

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
	color: black;
	display: flex;
	flex-direction: column;
	border: 1px solid black;
	font-size: 15px;
	box-sizing: content-box;
	font-weight: 400;
  font-size: 13px;
	padding: 10px;
	background: white;

	.mwai-title-container {
		flex: inherit;
		padding: 5px 0px 5px 10px;
		display: flex;
		align-items: center;
		color: black;
		font-weight: 600;
		cursor: pointer;

		.mwai-hint {
			font-size: 10px;
			font-weight: 400;
			text-align: right;
			flex: auto;

			.mwai-pill {
				background: ${NekoTheme.blue};
				padding: 5px 10px;
				border-radius: 8px;
				color: white;
			}

			.mwai-pill-purple {
				background: ${NekoTheme.purple};
			}
		}
	}

	.mwai-block-container-content {
		display: none;
		flex: auto;
		padding: 0px 10px;

		.mwai-block-container {
			border: 1px solid black;
			margin: 10px 0;

			.mwai-title-container {
				background: white;
			}

			.mwai-block-container-content {
				background: white;
			}
		}
	}

	&.mwai-container > .mwai-block-container-content {
		display: block;
	}

	.is-selected {

		&:after {
			border: 1px solid ${NekoTheme.blue};
		}

		& > .mwai-block-container:not(.mwai-container) {

			.mwai-block-container-content {
			 padding: 10px;
			 display: flex;
			}
		}
	}
	
`;

const AiBlockContainer = ({ children, type = "", title = "", hint = "", ...rest }) => {
	const classes = useClasses('mwai-block-container', 'mwai-' + type);
	const isSelectedRef = React.useRef(false);
	const [isSelected, setIsSelected] = React.useState(false);

	const toggleSelect = () => {
		setIsSelected(prev => !prev);
		if (isSelectedRef.current) {
			isSelectedRef.current = false;
		} else {
			isSelectedRef.current = true;
		}
	};

	React.useEffect(() => {
		const timer = setTimeout(() => {
			if (isSelected) {
				document.querySelector('.mwai-container')?.classList.toggle('mwai-container');
			}
		}, 1000);
		return () => clearTimeout(timer);
	}, [isSelected]);

	return (
		<BlockContainer className={classes} {...rest} onClick={toggleSelect}>
			<div className="mwai-title-container">
				<AiIcon icon="ai" style={{ width: 20, height: 20 }} />
				<div>{title}</div>
				<div className="mwai-hint">{hint}</div>
			</div>
			<div className="mwai-block-container-content">
				{children}
			</div>
		</BlockContainer>
	);
}

export { meowIcon, AiBlockContainer };