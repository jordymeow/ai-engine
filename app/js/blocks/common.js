// Previous: 2.3.7
// Current: 2.6.1

import { useClasses } from '@neko-ui';
import styled from "styled-components";
import AiIcon from '../styles/AiIcon';

const meowIcon = <AiIcon icon="ai" style={{ width: 20, height: 20 }} />;

const BlockContainer = styled.div`
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
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  margin-bottom: 10px;


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

  .mwai-block-container-content {
    flex: auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }

	&.mwai-chatbot {
		background: var(--neko-main-color);

		.mwai-title-container {
			color: white;
		}	

		.mwai-block-container-content {
			margin-top: 10px;
			border-radius: 5px;
			background: var(--neko-background-color);
		}
	}

  &.is-selected {
  }
`;

const AiBlockContainer = ({ children, type = "", title = "", hint = "", isSelected, isDisplayed, ...rest }) => {
  const classes = useClasses('mwai-block-container', `mwai-${type}`, { 'is-selected': isSelected, 'is-meow': true });
  return (
    <BlockContainer className={classes} {...rest}>
      <div className="mwai-title-container">
        <AiIcon icon="ai" style={{ width: 20, height: 20 }} />
        <div>{title}</div>
        <div className="mwai-hint">{hint}</div>
      </div>
      {(isSelected || isDisplayed) && <div className="mwai-block-container-content">
        {children}
      </div>}
    </BlockContainer>
  );
};

export { meowIcon, AiBlockContainer };