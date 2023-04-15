// Previous: none
// Current: 1.4.8

// NekoUI
import { NekoInput } from '@neko-ui';

import i18n from '@root/i18n';
import { toHTML } from '@app/helpers';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";
import { NekoColorPicker } from "@app/components/NekoColorPicker";

const MessagesTheme = (props) => {
  const { settings, onUpdateSettings } = props;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newSettings = { ...settings, [name]: value };
    onUpdateSettings(newSettings);
  };

  return (<>
    <StyledBuilderForm>
      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
          <label>{i18n.COMMON.SPACING}:</label>
          <NekoInput id="spacing" name="spacing"
            value={settings?.spacing ?? '15px'}
            onBlur={() => onUpdateSettings({ ...settings, spacing: settings?.spacing })}
            onEnter={() => onUpdateSettings({ ...settings, spacing: settings?.spacing })}
            onChange={handleInputChange}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
          <label>{i18n.COMMON.BORDER_RADIUS}:</label>
          <NekoInput id="borderRadius" name="borderRadius"
            value={settings?.borderRadius ?? '10px'}
            onBlur={() => onUpdateSettings({ ...settings, borderRadius: settings?.borderRadius })}
            onEnter={() => onUpdateSettings({ ...settings, borderRadius: settings?.borderRadius })}
            onChange={handleInputChange}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
          <label>{i18n.COMMON.FONT_SIZE}:</label>
          <NekoInput id="fontSize" name="fontSize"
            value={settings?.fontSize ?? '15px'}
            onBlur={() => onUpdateSettings({ ...settings, fontSize: settings?.fontSize })}
            onEnter={() => onUpdateSettings({ ...settings, fontSize: settings?.fontSize })}
            onChange={handleInputChange}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 1 }}>
          <label>{i18n.COMMON.FONT_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="fontColor" name="fontColor"
              value={settings?.fontColor ?? '#FFFFFF'} 
              onBlur={() => onUpdateSettings({ ...settings, fontColor: settings?.fontColor })}
              onEnter={() => onUpdateSettings({ ...settings, fontColor: settings?.fontColor })}
              onChange={handleInputChange}
            />
            <NekoColorPicker id="fontColor" name="fontColor"
              value={settings?.fontColor ?? '#FFFFFF'}
              onChange={(color) => onUpdateSettings({ ...settings, fontColor: color })}
            />
          </div>
        </div>
      </div>

      <div className="mwai-builder-row">
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_PRIMARY_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundPrimaryColor" name="backgroundPrimaryColor" style={{ flex: 1 }}
              value={settings?.backgroundPrimaryColor ?? '#FFFFFF'} 
              onBlur={() => onUpdateSettings({ ...settings, backgroundPrimaryColor: settings?.backgroundPrimaryColor })}
              onEnter={() => onUpdateSettings({ ...settings, backgroundPrimaryColor: settings?.backgroundPrimaryColor })}
              onChange={handleInputChange}
            />
            <NekoColorPicker id="backgroundPrimaryColor" name="backgroundPrimaryColor"
              value={settings?.backgroundPrimaryColor ?? '#FFFFFF'}
              onChange={(color) => onUpdateSettings({ ...settings, backgroundPrimaryColor: color })}
            />
          </div>
        </div>

        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_USER_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundUserColor" name="backgroundUserColor" style={{ flex: 1 }}
              value={settings?.backgroundSecondaryColor ?? '#0084ff'} 
              onBlur={() => onUpdateSettings({ ...settings, backgroundSecondaryColor: settings?.backgroundSecondaryColor })}
              onEnter={() => onUpdateSettings({ ...settings, backgroundSecondaryColor: settings?.backgroundSecondaryColor })}
              onChange={handleInputChange}
            />
            <NekoColorPicker id="backgroundUserColor" name="backgroundUserColor"
              value={settings?.backgroundSecondaryColor ?? '#0084ff'}
              onChange={(color) => onUpdateSettings({ ...settings, backgroundSecondaryColor: color })}
            />
          </div>
        </div>

        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_AI_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundAiColor" name="backgroundAiColor" style={{ flex: 1 }}
              value={settings?.backgroundSecondaryColor ?? '#eee'} 
              onBlur={() => onUpdateSettings({ ...settings, backgroundSecondaryColor: settings?.backgroundSecondaryColor })}
              onEnter={() => onUpdateSettings({ ...settings, backgroundSecondaryColor: settings?.backgroundSecondaryColor })}
              onChange={handleInputChange}
            />
            <NekoColorPicker id="backgroundAiColor" name="backgroundAiColor"
              value={settings?.backgroundSecondaryColor ?? '#eee'}
              onChange={(color) => onUpdateSettings({ ...settings, backgroundSecondaryColor: color })}
            />
          </div>
        </div>

        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_AI_SECONDARY_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundAiSecondaryColor" name="backgroundAiSecondaryColor" style={{ flex: 1 }}
              value={settings?.backgroundSecondaryColor ?? '#ddd'} 
              onBlur={() => onUpdateSettings({ ...settings, backgroundSecondaryColor: settings?.backgroundSecondaryColor })}
              onEnter={() => onUpdateSettings({ ...settings, backgroundSecondaryColor: settings?.backgroundSecondaryColor })}
              onChange={handleInputChange}
            />
            <NekoColorPicker id="backgroundAiSecondaryColor" name="backgroundAiSecondaryColor"
              value={settings?.backgroundSecondaryColor ?? '#ddd'}
              onChange={(color) => onUpdateSettings({ ...settings, backgroundSecondaryColor: color })}
            />
          </div>
        </div>
      </div>

      <h4 className="mwai-category">{i18n.COMMON.POPUP}</h4>

      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 0.75 }}>
          <label>{i18n.COMMON.WIDTH}:</label>
          <NekoInput id="width" name="width"
            value={settings?.width ?? '460px'}
            onBlur={() => onUpdateSettings({ ...settings, width: settings?.width })}
            onEnter={() => onUpdateSettings({ ...settings, width: settings?.width })}
            onChange={handleInputChange}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.75 }}>
          <label>{i18n.COMMON.MAX_HEIGHT}:</label>
          <NekoInput id="maxHeight" name="maxHeight"
            value={settings?.maxHeight ?? '40vh'}
            onBlur={() => onUpdateSettings({ ...settings, maxHeight: settings?.maxHeight })}
            onEnter={() => onUpdateSettings({ ...settings, maxHeight: settings?.maxHeight })}
            onChange={handleInputChange}
          />
        </div>

        <div className="mwai-builder-col">
          <label>{i18n.COMMON.AVATAR_MESSAGE_BACKGROUND_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="iconTextBackgroundColor" name="iconTextBackgroundColor"
              value={settings?.iconTextBackgroundColor ?? '#343541'} 
              onBlur={() => onUpdateSettings({ ...settings, iconTextBackgroundColor: settings?.iconTextBackgroundColor })}
              onEnter={() => onUpdateSettings({ ...settings, iconTextBackgroundColor: settings?.iconTextBackgroundColor })}
              onChange={handleInputChange}
            />
            <NekoColorPicker id="iconTextBackgroundColor" name="iconTextBackgroundColor"
              value={settings?.iconTextBackgroundColor ?? '#343541'}
              onChange={(color) => onUpdateSettings({ ...settings, iconTextBackgroundColor: color })}
            />
          </div>                          
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.AVATAR_MESSAGE_FONT_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="iconTextColor" name="iconTextColor"
              value={settings?.iconTextColor ?? '#FFFFFF'} 
              onBlur={() => onUpdateSettings({ ...settings, iconTextColor: settings?.iconTextColor })}
              onEnter={() => onUpdateSettings({ ...settings, iconTextColor: settings?.iconTextColor })}
              onChange={handleInputChange}
            />
            <NekoColorPicker id="iconTextColor" name="iconTextColor"
              value={settings?.iconTextColor ?? '#FFFFFF'}
              onChange={(color) => onUpdateSettings({ ...settings, iconTextColor: color })}
            />
          </div>                          
        </div>
      </div>

      <div className="mwai-builder-row">
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.HEADER_BACKGROUND_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundHeaderColor" name="backgroundHeaderColor" style={{ flex: 1 }}
              value={settings?.backgroundHeaderColor ?? '#343541'} 
              onBlur={() => onUpdateSettings({ ...settings, backgroundHeaderColor: settings?.backgroundHeaderColor })}
              onEnter={() => onUpdateSettings({ ...settings, backgroundHeaderColor: settings?.backgroundHeaderColor })}
              onChange={handleInputChange}
            />
            <NekoColorPicker id="backgroundHeaderColor" name="backgroundHeaderColor"
              value={settings?.backgroundHeaderColor ?? '#343541'}
              onChange={(color) => onUpdateSettings({ ...settings, backgroundHeaderColor: color })}
            />
          </div>                          
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.HEADER_BUTTONS_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="headerButtonsColor" name="headerButtonsColor" style={{ flex: 1 }}
              value={settings?.headerButtonsColor ?? '#FFFFFF'} 
              onBlur={() => onUpdateSettings({ ...settings, headerButtonsColor: settings?.headerButtonsColor })}
              onEnter={() => onUpdateSettings({ ...settings, headerButtonsColor: settings?.headerButtonsColor })}
              onChange={handleInputChange}
            />
            <NekoColorPicker id="headerButtonsColor" name="headerButtonsColor"
              value={settings?.headerButtonsColor ?? '#FFFFFF'}
              onChange={(color) => onUpdateSettings({ ...settings, headerButtonsColor: color })}
            />
          </div>                          
        </div>
      </div>

    </StyledBuilderForm>
  </>);
};

export default MessagesTheme;