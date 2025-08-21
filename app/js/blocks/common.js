// Previous: 2.8.2
// Current: 3.0.2

import { useClasses } from '@neko-ui';
import styled from "styled-components";
import AiIcon from '../styles/AiIcon';

const meowIcon = <AiIcon icon="ai" style={{ width: 20, height: 20 }} />;

// Badge component - WordPress doesn't have a built-in Badge, so we create our own
export const Badge = ({ children, variant = 'default' }) => {
  const style = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '10px',
    lineHeight: '1.4',
    backgroundColor: variant === 'purple' ? '#9b51e0' : variant === 'red' ? '#cf2e2e' : '#0693e3',
    color: '#fff'
  };
  
  return <span style={style}>{children}</span>;
};

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