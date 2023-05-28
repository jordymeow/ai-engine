// Previous: 1.6.0
// Current: 1.6.93

const { useState, useEffect } = wp.element;

// NekoUI
import { NekoInput, NekoCollapsableCategory, NekoSpacer } from '@neko-ui';

import i18n from '@root/i18n';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";
import { NekoColorPicker } from "@app/components/NekoColorPicker";

const ChatGPTTheme = (props) => {
  const { settings, onUpdateSettings } = props;
  const [category, setCategory] = useState('general');

  const [localSettings, setLocalSettings] = useState({ ...settings });

  useEffect(() => {
    if (settings) {
      setTimeout(() => {
        setLocalSettings({ ...settings });
      }, 200);
    }
  }, [settings]);

  const handleBlurOrEnter = (field) => (value) => {
    const newSettings = { ...localSettings, [field]: value };
    setLocalSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  const handleColorChange = (field) => (value) => {
    const newSettings = { ...localSettings, [field]: value };
    setLocalSettings(newSettings);
    onUpdateSettings(newSettings);
  };

  return (<>
    <StyledBuilderForm>

      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
          <label>{i18n.COMMON.SPACING}:</label>
          <NekoInput id="spacing" name="spacing"
            value={localSettings?.spacing ?? '15px'}
            onBlur={() => handleBlurOrEnter('spacing')(localSettings?.spacing ?? '15px')}
            onEnter={() => handleBlurOrEnter('spacing')(localSettings?.spacing ?? '15px')}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
          <label>{i18n.COMMON.BORDER_RADIUS}:</label>
          <NekoInput id="borderRadius" name="borderRadius"
            value={localSettings?.borderRadius ?? '10px'}
            onBlur={() => handleBlurOrEnter('borderRadius')(localSettings?.borderRadius ?? '10px')}
            onEnter={() => handleBlurOrEnter('borderRadius')(localSettings?.borderRadius ?? '10px')}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
          <label>{i18n.COMMON.FONT_SIZE}:</label>
          <NekoInput id="fontSize" name="fontSize"
            value={localSettings?.fontSize ?? '15px'}
            onBlur={() => handleBlurOrEnter('fontSize')(localSettings?.fontSize ?? '15px')}
            onEnter={() => handleBlurOrEnter('fontSize')(localSettings?.fontSize ?? '15px')}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 1 }}>
          <label>{i18n.COMMON.FONT_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="fontColor" name="fontColor"
              value={localSettings?.fontColor ?? '#FFFFFF'}
              onBlur={() => handleBlurOrEnter('fontColor')(localSettings?.fontColor ?? '#FFFFFF')}
              onEnter={() => handleBlurOrEnter('fontColor')(localSettings?.fontColor ?? '#FFFFFF')}
            />
            <NekoColorPicker id="fontColor" name="fontColor"
              value={localSettings?.fontColor ?? '#FFFFFF'}
              onChange={handleColorChange('fontColor')}
            />
          </div>
        </div>
      </div>

      <div className="mwai-builder-row">
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_PRIMARY_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundPrimaryColor" name="backgroundPrimaryColor" style={{ flex: 1 }}
              value={localSettings?.backgroundPrimaryColor ?? '#454654'}
              onBlur={() => handleBlurOrEnter('backgroundPrimaryColor')(localSettings?.backgroundPrimaryColor ?? '#454654')}
              onEnter={() => handleBlurOrEnter('backgroundPrimaryColor')(localSettings?.backgroundPrimaryColor ?? '#454654')}
            />
            <NekoColorPicker id="backgroundPrimaryColor" name="backgroundPrimaryColor"
              value={localSettings?.backgroundPrimaryColor ?? '#454654'}
              onChange={handleColorChange('backgroundPrimaryColor')}
            />
          </div>
        </div>

        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_SECONDARY_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundSecondaryColor" name="backgroundSecondaryColor" style={{ flex: 1 }}
              value={localSettings?.backgroundSecondaryColor ?? '#343541'}
              onBlur={() => handleBlurOrEnter('backgroundSecondaryColor')(localSettings?.backgroundSecondaryColor ?? '#343541')}
              onEnter={() => handleBlurOrEnter('backgroundSecondaryColor')(localSettings?.backgroundSecondaryColor ?? '#343541')}
            />
            <NekoColorPicker id="backgroundSecondaryColor" name="backgroundSecondaryColor"
              value={localSettings?.backgroundSecondaryColor ?? '#343541'}
              onChange={handleColorChange('backgroundSecondaryColor')}
            />
          </div>
        </div>
      </div>

      <NekoSpacer />

      <NekoCollapsableCategory title={i18n.COMMON.POPUP} isCollapsed={false} />

      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 0.75 }}>
          <label>{i18n.COMMON.WIDTH}:</label>
          <NekoInput id="width" name="width"
            value={localSettings?.width ?? '460px'}
            onBlur={() => handleBlurOrEnter('width')(localSettings?.width ?? '460px')}
            onEnter={() => handleBlurOrEnter('width')(localSettings?.width ?? '460px')}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.75 }}>
          <label>{i18n.COMMON.MAX_HEIGHT}:</label>
          <NekoInput id="maxHeight" name="maxHeight"
            value={localSettings?.maxHeight ?? '40vh'}
            onBlur={() => handleBlurOrEnter('maxHeight')(localSettings?.maxHeight ?? '40vh')}
            onEnter={() => handleBlurOrEnter('maxHeight')(localSettings?.maxHeight ?? '40vh')}
          />
        </div>

        <div className="mwai-builder-col">
          <label>{i18n.COMMON.AVATAR_MESSAGE_BACKGROUND_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="iconTextBackgroundColor" name="iconTextBackgroundColor"
              value={localSettings?.iconTextBackgroundColor ?? '#343541'}
              onBlur={() => handleBlurOrEnter('iconTextBackgroundColor')(localSettings?.iconTextBackgroundColor ?? '#343541')}
              onEnter={() => handleBlurOrEnter('iconTextBackgroundColor')(localSettings?.iconTextBackgroundColor ?? '#343541')}
            />
            <NekoColorPicker id="iconTextBackgroundColor" name="iconTextBackgroundColor"
              value={localSettings?.iconTextBackgroundColor ?? '#343541'}
              onChange={handleColorChange('iconTextBackgroundColor')}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.AVATAR_MESSAGE_FONT_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="iconTextColor" name="iconTextColor"
              value={localSettings?.iconTextColor ?? '#FFFFFF'}
              onBlur={() => handleBlurOrEnter('iconTextColor')(localSettings?.iconTextColor ?? '#FFFFFF')}
              onEnter={() => handleBlurOrEnter('iconTextColor')(localSettings?.iconTextColor ?? '#FFFFFF')}
            />
            <NekoColorPicker id="iconTextColor" name="iconTextColor"
              value={localSettings?.iconTextColor ?? '#FFFFFF'}
              onChange={handleColorChange('iconTextColor')}
            />
          </div>
        </div>
      </div>

      <div className="mwai-builder-row">
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.HEADER_BACKGROUND_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundHeaderColor" name="backgroundHeaderColor" style={{ flex: 1 }}
              value={localSettings?.backgroundHeaderColor ?? '#343541'}
              onBlur={() => handleBlurOrEnter('backgroundHeaderColor')(localSettings?.backgroundHeaderColor ?? '#343541')}
              onEnter={() => handleBlurOrEnter('backgroundHeaderColor')(localSettings?.backgroundHeaderColor ?? '#343541')}
            />
            <NekoColorPicker id="backgroundHeaderColor" name="backgroundHeaderColor"
              value={localSettings?.backgroundHeaderColor ?? '#343541'}
              onChange={handleColorChange('backgroundHeaderColor')}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.HEADER_BUTTONS_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="headerButtonsColor" name="headerButtonsColor" style={{ flex: 1 }}
              value={localSettings?.headerButtonsColor ?? '#FFFFFF'}
              onBlur={() => handleBlurOrEnter('headerButtonsColor')(localSettings?.headerButtonsColor ?? '#FFFFFF')}
              onEnter={() => handleBlurOrEnter('headerButtonsColor')(localSettings?.headerButtonsColor ?? '#FFFFFF')}
            />
            <NekoColorPicker id="headerButtonsColor" name="headerButtonsColor"
              value={localSettings?.headerButtonsColor ?? '#FFFFFF'}
              onChange={handleColorChange('headerButtonsColor')}
            />
          </div>
        </div>
      </div>

    </StyledBuilderForm>
  </>);
};

export default ChatGPTTheme;