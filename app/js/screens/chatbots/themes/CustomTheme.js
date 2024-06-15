// Previous: 1.6.94
// Current: 2.3.9

// React & Vendor Libs
const { useMemo, useState, useEffect } = wp.element;

const DefaultCSS = `.mwai-THEME_ID-theme {
  --mwai-spacing: 10px;
  --mwai-fontSize: 14px;
  --mwai-fontColor: #000;
  --mwai-backgroundPrimaryColor: #fff;
  --mwai-primaryColor: #0084ff;
  --mwai-secondaryColor: #f0f0f0;
}

.mwai-THEME_ID-theme .mwai-content {
  background: var(--mwai-backgroundPrimaryColor);
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
  background: var(--mwai-secondaryColor);
}

.mwai-THEME_ID-theme .mwai-reply.mwai-user {
  background: var(--mwai-primaryColor);
  color: #fff;
}

.mwai-THEME_ID-theme .mwai-name {
  margin-right: var(--mwai-spacing);
}

.mwai-THEME_ID-theme .mwai-input {
  display: flex;
  align-items: center;
  column-gap: 5px;
}

.mwai-THEME_ID-theme .mwai-input-text {
  display: flex;
  align-items: center;
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
    const newCss = DefaultCSS.replace(/THEME_ID/g, theme.themeId);
    setCss(newCss);
  };

  const handleCssChange = (value) => {
    setCss(value);
  };

  return (<StyledBuilderForm>
    <div className="mwai-builder-row">
      <div className="mwai-builder-col">
        <label>{i18n.COMMON.NAME}:</label>
        <NekoInput name="name" data-form-type="other"
          value={theme.name}
          onBlur={onUpdateTheme}
          onEnter={onUpdateTheme}
        />
      </div>
      <div className="mwai-builder-col">
        <div>
          <label style={{ display: 'block' }}>{i18n.COMMON.ID}:</label>
          <NekoInput name="themeId" type="text" placeholder="Optional"
            value={theme.themeId}
            onBlur={onUpdateTheme}
            onEnter={onUpdateTheme}
          />
        </div>
      </div>
    </div>
    <NekoSpacer />
    <label>Custom CSS:</label>
    <NekoTextArea name="css" value={css} onChange={handleCssChange} rows={16} tabToSpaces={2}></NekoTextArea>
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