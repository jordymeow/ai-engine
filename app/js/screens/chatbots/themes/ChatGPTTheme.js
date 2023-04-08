// Previous: 1.4.0
// Current: 1.4.1

// NekoUI
import { NekoInput } from '@neko-ui';

import i18n from '@root/i18n';
import { toHTML } from '@app/helpers';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";
import { NekoColorPicker } from "@app/components/NekoColorPicker";

const ChatGPTTheme = (props) => {
  const { settings, onUpdateSettings } = props;

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    onUpdateSettings({ ...settings, [name]: value });
  };

  const handleColorChange = (name, color) => {
    onUpdateSettings({ ...settings, [name]: color });
  };

  return (<>
    <StyledBuilderForm>
      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
          <label>{i18n.COMMON.SPACING}:</label>
          <NekoInput id="spacing" name="spacing"
            value={settings?.spacing ?? '15px'}
            onBlur={handleInputBlur}
            onEnter={handleInputBlur}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
          <label>{i18n.COMMON.BORDER_RADIUS}:</label>
          <NekoInput id="borderRadius" name="borderRadius"
            value={settings?.borderRadius ?? '10px'}
            onBlur={handleInputBlur}
            onEnter={handleInputBlur}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
          <label>{i18n.COMMON.FONT_SIZE}:</label>
          <NekoInput id="fontSize" name="fontSize"
            value={settings?.fontSize ?? '15px'}
            onBlur={handleInputBlur}
            onEnter={handleInputBlur}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 1 }}>
          <label>{i18n.COMMON.FONT_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="fontColor" name="fontColor"
              value={settings?.fontColor ?? '#FFFFFF'} 
              onBlur={handleInputBlur}
              onEnter={handleInputBlur}
            />
            <NekoColorPicker id="fontColor" name="fontColor"
              value={settings?.fontColor ?? '#FFFFFF'}
              onChange={(color) => handleColorChange('fontColor', color)}
            />
          </div>
        </div>
      </div>

      <div className="mwai-builder-row">
        
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_PRIMARY_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundPrimaryColor" name="backgroundPrimaryColor"
              value={settings?.backgroundPrimaryColor ?? '#454654'} 
              onBlur={handleInputBlur}
              onEnter={handleInputBlur}
            />
            <NekoColorPicker id="backgroundPrimaryColor" name="backgroundPrimaryColor"
              value={settings?.backgroundPrimaryColor ?? '#454654'}
              onChange={(color) => handleColorChange('backgroundPrimaryColor', color)}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_SECONDARY_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundSecondaryColor" name="backgroundSecondaryColor"
              value={settings?.backgroundSecondaryColor ?? '#343541'} 
              onBlur={handleInputBlur}
              onEnter={handleInputBlur}
            />
            <NekoColorPicker id="backgroundSecondaryColor" name="backgroundSecondaryColor"
              value={settings?.backgroundSecondaryColor ?? '#343541'}
              onChange={(color) => handleColorChange('backgroundSecondaryColor', color)}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.HEADER_BUTTONS_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="headerButtonsColor" name="headerButtonsColor"
              value={settings?.headerButtonsColor ?? '#FFFFFF'} 
              onBlur={handleInputBlur}
              onEnter={handleInputBlur}
            />
            <NekoColorPicker id="headerButtonsColor" name="headerButtonsColor"
              value={settings?.headerButtonsColor ?? '#FFFFFF'}
              onChange={(color) => handleColorChange('headerButtonsColor', color)}
            />
          </div>                          
        </div>
      </div>

      <h4 className="mwai-category">{i18n.COMMON.POPUP}</h4>

      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 1 }}>
          <label>{i18n.COMMON.WIDTH}:</label>
          <NekoInput id="width" name="width"
            value={settings?.width ?? '460px'}
            onBlur={handleInputBlur}
            onEnter={handleInputBlur}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 1 }}>
          <label>{i18n.COMMON.MAX_HEIGHT}:</label>
          <NekoInput id="maxHeight" name="maxHeight"
            value={settings?.maxHeight ?? '40vh'}
            onBlur={handleInputBlur}
            onEnter={handleInputBlur}
          />
        </div>
      </div>

      <p>{toHTML(i18n.SETTINGS.CHATGPT_STYLE_INTRO)}</p>

    </StyledBuilderForm>
  </>);
};

export default ChatGPTTheme;