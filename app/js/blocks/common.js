// Previous: 1.4.9
// Current: 1.9.8

import { NekoTheme, useClasses } from '@neko-ui';
import Styled from "styled-components";
import AiIcon from '../styles/AiIcon';

const meowIcon = <AiIcon icon="ai" style={{ width: 20, height: 20 }} />;

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
	background: hsl(0deg 0% 100% / 75%);

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
				background: var(--wp--preset--color--vivid-cyan-blue);
				padding: 5px 10px;
				border-radius: 8px;
				color: white;
			}

			.mwai-pill-purple {
				background: var(--wp--preset--color--vivid-purple);
			}
		}
	}

	.mwai-block-container-content  {
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

	&.mwai-chatbot {
		.mwai-title-container {
			background: white;
		}

		.mwai-block-container-content {
			background: white;
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
  const [isOpen, setIsOpen] = React.useState(false);
  
  React.useEffect(() => {
    if (type === "expandable") {
      setIsOpen(true);
    }
  }, [type]);

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <BlockContainer className={`${classes} ${isOpen ? 'mwai-container' : ''}`} {...rest} onClick={toggleOpen}>
      <div className="mwai-title-container">
        <AiIcon icon="ai" style={{ width: 20, height: 20 }} />
        <div>{title}</div>
        <div className="mwai-hint">{hint}</div>
      </div>
      <div className="mwai-block-container-content" style={{ display: isOpen ? 'block' : 'none' }}>
        {children}
      </div>
    </BlockContainer>
  );
};

export { meowIcon, AiBlockContainer };