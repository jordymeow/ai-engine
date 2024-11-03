// Previous: 2.5.1
// Current: 2.6.5

const { useMemo, useState, useEffect } = wp.element;

const DefaultCSS = `.mwai-THEME_ID-theme {
  --mwai-spacing: 10px;
  --mwai-fontSize: 14px;
  --mwai-fontColor: #000;
  --mwai-bgPrimary: #fff;
  --mwai-primary: #0084ff;
  --mwai-secondary: #f0f0f0;
  --mwai-width: 300px;
  --mwai-borderRadius: 5px;
}

.mwai-THEME_ID-theme .mwai-content {
  background: var(--mwai-bgPrimary);
  padding: var(--mwai-spacing);
  font-size: var(--mwai-fontSize);
  color: var(--mwai-fontColor);
}

.mwai-THEME_ID-theme .mwai-conversation {
  display: flex;
  flex-direction: column;
}

.mwai-THEME_ID-theme .mwai-reply {
  margin-bottom: var(--mwai-spacing);
  padding: var(--mwai-spacing);
  display: flex;
}

.mwai-THEME_ID-theme .mwai-reply.mwai-ai {
  background: var(--mwai-secondary);
}

.mwai-THEME_ID-theme .mwai-reply.mwai-user {
  background: var(--mwai-primary);
  color: #fff;
}

.mwai-THEME_ID-theme .mwai-name {
  margin-right: var(--mwai-spacing);
}

.mwai-THEME_ID-theme .mwai-input {
  display: flex;
  align-items: center;
  gap: 5px;
}

.mwai-THEME_ID-theme .mwai-input-text {
  display: flex;
  align-items: center;
  flex: 1;
}

.mwai-THEME_ID-theme .mwai-input-text textarea {
  flex: 1;
}

.mwai-THEME_ID-theme .mwai-input-text .mwai-microphone {
  flex: 1;
}

.mwai-THEME_ID-theme .mwai-input-text .mwai-file-upload-icon {
  flex: 1;
}

.mwai-THEME_ID-theme .mwai-trigger {
  position: absolute;
  right: 0;
  bottom: 0;
  transition: all 0.2s ease-out;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.mwai-THEME_ID-theme .mwai-trigger .mwai-icon-text-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.mwai-THEME_ID-theme .mwai-trigger .mwai-icon-text {
  background: var(--mwai-iconTextBackgroundColor);
  color: var(--mwai-iconTextColor);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
  max-width: 200px;
  font-size: 13px;
  margin-bottom: 15px;
  padding: 10px 15px;
  border-radius: 8px;
}

.mwai-THEME_ID-theme .mwai-reply-actions .mwai-copy-button {
  fill: var(--mwai-fontColor);
  padding: 3px 5px;
  width: 24px;
  height: 24px;
  background: var(--mwai-bgPrimary);
  cursor: pointer;
  border-radius: var(--mwai-borderRadius);
  display: none;
}

.mwai-THEME_ID-theme .mwai-reply-actions:not(.mwai-hidden) .mwai-copy-button {
  display: block;
}

.mwai-THEME_ID-theme.mwai-window {
  position: fixed;
  right: 30px;
  bottom: 30px;
  width: var(--mwai-width);
  z-index: 9999;
}

.mwai-THEME_ID-theme.mwai-window .mwai-content {
  display: none;
  opacity: 0;
  max-height: var(--mwai-maxHeight);
  border-radius: 0 0 var(--mwai-borderRadius) var(--mwai-borderRadius);
}

.mwai-THEME_ID-theme.mwai-window.mwai-bottom-left,
.mwai-THEME_ID-theme.mwai-window.mwai-top-left {
  right: auto;
  left: 30px;
}

.mwai-THEME_ID-theme.mwai-window.mwai-top-right,
.mwai-THEME_ID-theme.mwai-window.mwai-top-left {
  top: 30px;
  bottom: auto;
}

.mwai-THEME_ID-theme.mwai-window.mwai-open .mwai-trigger {
  display: none;
}

.mwai-THEME_ID-theme.mwai-window.mwai-open .mwai-content {
  display: flex;
  flex-direction: column;
  transition: opacity 200ms ease-in-out;
  opacity: 1;
}

.mwai-THEME_ID-theme.mwai-window .mwai-header {
  display: none;
  justify-content: flex-end;
  height: 22px;
}

.mwai-THEME_ID-theme.mwai-window.mwai-open .mwai-header {
  display: flex;
}

.mwai-THEME_ID-theme.mwai-window .mwai-header .mwai-buttons .mwai-close-button:after {
  content: '╳';
  cursor: pointer;
}
`;

// NekoUI
import { NekoInput, NekoButton,
  NekoTextArea, NekoSpacer } from '@neko-ui';

import i18n from '@root/i18n';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";

const CustomTheme = (props) => {
  const { theme, onUpdateTheme } = props;
  const [ css, setCss ] = useState("");

  useEffect(() => {
    setCss(theme.style || "");
  }, [theme]);

  const isDirty = useMemo(() => {
    return css.trim() !== theme.style.trim();
  }, [css, theme]);

  const setDefaultCSS = () => {
    const newCss = DefaultCSS.replace(/THEME_ID/g, theme.themeId || "default");
    setCss(newCss);
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
    <NekoTextArea name="css" value={css} onChange={(val) => setCss(val)} rows={16} tabToSpaces={2}></NekoTextArea>

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