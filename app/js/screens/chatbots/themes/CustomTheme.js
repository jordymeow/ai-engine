// Previous: 1.4.1
// Current: 1.6.94

const { useMemo, useState, useEffect } = wp.element;

const DefaultCSS = `.mwai-chat {
  --mwai-spacing: 10px;
  --mwai-fontSize: 13px;
  --mwai-fontColor: black;
  --mwai-backgroundPrimaryColor: white;
  --mwai-primaryColor: #0084ff;
  --mwai-secondaryColor: #f0f0f0;
}

.mwai-chat * {
  box-sizing: border-box;
}

.mwai-content {
  background: var(--mwai-backgroundPrimaryColor);
  padding: var(--mwai-spacing);
  font-size: var(--mwai-fontSize);
  color: var(--mwai-fontColor);
}

.mwai-conversation {
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.mwai-conversation .mwai-reply {
  margin-bottom: var(--mwai-spacing);
  padding: 5px 10px;
  border-radius: 15px;
  font-size: var(--mwai-fontSize);
  color: var(--mwai-fontColor);
  min-width: 30%;
}

.mwai-conversation .mwai-reply *:first-child {
  margin-top: 0px;
}

.mwai-conversation .mwai-reply *:last-child {
  margin-bottom: 0px;
}

.mwai-conversation .mwai-reply.mwai-ai {
  align-self: flex-start;
  background: var(--mwai-secondaryColor);
}

.mwai-conversation .mwai-reply.mwai-user {
  align-self: flex-end;
  background: var(--mwai-primaryColor);
  color: white;
}

.mwai-conversation .mwai-avatar img {
  width: 24px;
  border-radius: 5px;
}

.mwai-conversation .mwai-reply.mwai-user .mwai-avatar {
  text-align: right;
}

.mwai-input {
  display: flex;
  align-items: center;
}

.mwai-input textarea {
  flex: auto;
  padding: 5px 10px;
  height: 32px;
  font-family: inherit;
}

.mwai-input button {
  margin-left: var(--mwai-spacing);
  padding: 5px 15px;
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  height: 32px;
  width: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mwai-input button:hover {
  filter: brightness(1.2);
}

.mwai-compliance {
  margin-top: 5px;
  font-size: 12px;
}

.mwai-chat.mwai-window {
  position: fixed;
  right: 15px;
  bottom: 15px;
  width: 400px;
  z-index: 9999;
}

.mwai-chat.mwai-window .mwai-header {
  display: none;
  justify-content: flex-end;
  align-items: center;
}

.mwai-chat.mwai-window .mwai-header .mwai-buttons {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.mwai-chat.mwai-window .mwai-header .mwai-buttons .mwai-resize-button {
  justify-content: center;
  height: 32px;
  width: 33px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--mwai-backgroundSecondaryColor);
  border-radius: var(--mwai-borderRadius);
}

.mwai-chat.mwai-window .mwai-header .mwai-buttons .mwai-resize-button:before {
  transition: all 0.2s ease-out;
  content: ' ';
  cursor: pointer;
  position: absolute;
  height: 13px;
  width: 13px;
  opacity: 0.75;
  border: 2px solid black;
}

.mwai-chat.mwai-window .mwai-header .mwai-buttons .mwai-resize-button:hover:before {
  width: 16px;
  height: 16px;
}

.mwai-chat.mwai-window .mwai-header .mwai-buttons .mwai-close-button {
  margin-left: 5px;
  justify-content: center;
  height: 32px;
  width: 33px;
  cursor: pointer;
}

.mwai-chat.mwai-window .mwai-header .mwai-buttons .mwai-close-button:before {
  transition: all 0.2s ease-out;
  transform: translate(16px, 5px) rotate(45deg);
}

.mwai-chat.mwai-window .mwai-header .mwai-buttons .mwai-close-button:after {
  transition: all 0.2s ease-out;
  transform: translate(16px, 5px) rotate(-45deg);
}

.mwai-chat.mwai-window .mwai-header .mwai-buttons .mwai-close-button:before, .mwai-chat.mwai-window .mwai-header .mwai-buttons .mwai-close-button:after {
  content: ' ';
  cursor: pointer;
  position: absolute;
  height: 22px;
  width: 2px;
  background: black;
  opacity: 0.75;
}

.mwai-chat.mwai-window .mwai-header .mwai-buttons .mwai-close-button:hover:before {
  opacity: 1;
  transform: translate(16px, 5px) rotate(135deg);
}

.mwai-chat.mwai-window .mwai-header .mwai-buttons .mwai-close-button:hover:after {
  opacity: 1;
  transform: translate(16px, 5px) rotate(45deg);
}

.mwai-chat.mwai-window .mwai-content {
  display: none;
  opacity: 0;
  max-height: 40vh;
overflow: hidden;
}

.mwai-chat.mwai-window.mwai-bottom-left {
  bottom: 30px;
  right: inherit;
  left: 30px;
}

.mwai-chat .mwai-open-button {
  position: absolute;
  right: 0;
  bottom: 0;
  transition: all 0.2s ease-out;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: end;
  cursor: pointer;
}

.mwai-chat.mwai-window.mwai-bottom-left .mwai-open-button {
  right: inherit;
  left: 0;
}

.mwai-chat.mwai-window.mwai-top-right {
  top: 30px;
  bottom: inherit;
  right: 30px;
}

.mwai-chat.mwai-window.mwai-top-right .mwai-open-button {
  top: 0;
  bottom: inherit;
}

.mwai-chat.mwai-window.mwai-top-left {
  top: 30px;
  bottom: inherit;
  right: inherit;
  left: 30px;
}

.mwai-chat.mwai-window.mwai-top-left .mwai-open-button {
  top: 0;
  bottom: inherit;
  right: inherit;
  left: 0;
}

.mwai-chat .mwai-gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 5px;
}

.mwai-chat .mwai-gallery img {
  width: 100%;
}

.mwai-chat.mwai-window.mwai-fullscreen .mwai-header .mwai-buttons {
  margin-bottom: 0px;
}

.mwai-chat.mwai-window.mwai-fullscreen .mwai-header .mwai-buttons .mwai-resize-button:before {
  width: 16px;
  height: 16px;
}

.mwai-chat.mwai-window.mwai-fullscreen .mwai-header .mwai-buttons .mwai-resize-button:hover:before {
  width: 13px;
  height: 13px;
}

.mwai-chat.mwai-window.mwai-fullscreen .mwai-header .mwai-buttons .mwai-close-button {
  margin-left: -5px;
}

.mwai-chat.mwai-fullscreen:not(.mwai-window), .mwai-chat.mwai-fullscreen.mwai-window.mwai-open {
  position: fixed;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  top: 0 !important;
  width: inherit;
  height: inherit;
  max-height: inherit;
  max-width: inherit;
  display: flex;
  flex-direction: column;
  margin: 0;
  z-index: 999999;
  background-color: var(--mwai-backgroundSecondaryColor);
}

.mwai-chat.mwai-fullscreen:not(.mwai-window) .mwai-content, .mwai-chat.mwai-fullscreen.mwai-window.mwai-open .mwai-content {
  height: 100%;
  max-height: inherit;
  border-radius: inherit;
}

.mwai-chat.mwai-fullscreen:not(.mwai-window) .mwai-content .mwai-conversation, .mwai-chat.mwai-fullscreen.mwai-window.mwai-open .mwai-content .mwai-conversation {
  flex: auto;
}

.mwai-chat.mwai-window.mwai-open .mwai-header {
  display: flex;
}

.mwai-chat.mwai-window.mwai-open .mwai-content {
  display: block;
  transition: opacity 200ms ease-in-out 0s;
  opacity: 1;
}

.mwai-chat.mwai-window.mwai-open .mwai-open-button {
  display: none;
}`;

import { NekoInput, NekoButton,
  NekoTextArea, NekoSpacer } from '@neko-ui';

import i18n from '@root/i18n';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";

const CustomTheme = (props) => {
  const { theme, onUpdateTheme } = props;
  const [ css, setCss ] = useState("");

  useEffect(() => {
    setCss(theme.style);
  }, [theme]);

  const isDirty = useMemo(() => {
    return css !== theme.style;
  }, [css, theme]);

  const setDefaultCSS = () => {
    setCss(DefaultCSS);
  };

  return (<StyledBuilderForm>
    <div className="mwai-builder-row">
      <div className="mwai-builder-col">
        <label>{i18n.COMMON.NAME}:</label>
        <NekoInput name="name" data-form-type="other"
          value={theme.name}
          onBlur={() => onUpdateTheme({ name: theme.name })}
          onEnter={() => onUpdateTheme({ name: theme.name })}
        />
      </div>
      <div className="mwai-builder-col">
        <div>
          <label style={{ display: 'block' }}>{i18n.COMMON.ID}:</label>
          <NekoInput name="themeId" type="text" placeholder="Optional"
            value={theme.themeId}
            onBlur={() => onUpdateTheme({ themeId: theme.themeId })}
            onEnter={() => onUpdateTheme({ themeId: theme.themeId })}
          />
        </div>
      </div>
    </div>
    <NekoSpacer />
    <label>Custom CSS:</label>
    <NekoTextArea name="css" value={css} onChange={(newCss) => setCss(newCss)} rows={16} tabToSpaces={2}></NekoTextArea>

    <div style={{ display: 'flex' }}>
      <NekoButton fullWidth onClick={setDefaultCSS}>
        Default CSS
      </NekoButton>
      <NekoButton fullWidth onClick={() => { onUpdateTheme(css, 'style') }} disabled={!isDirty}>
        Apply CSS
      </NekoButton>
    </div>
  </StyledBuilderForm>);
};

export default CustomTheme;