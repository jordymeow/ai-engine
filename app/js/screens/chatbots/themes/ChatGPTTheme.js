// Previous: 1.4.1
// Current: 1.4.8

// NekoUI
import { NekoInput } from '@neko-ui';

import i18n from '@root/i18n';
import { toHTML } from '@app/helpers';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";
import { NekoColorPicker } from "@app/components/NekoColorPicker";

const ChatGPTTheme = (props) => {
  const { settings, onUpdateSettings } = props;

  return (<>
    <StyledBuilderForm>
      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
          <label>{i18n.COMMON.SPACING}:</label>
          <NekoInput id="spacing" name="spacing"
            value={settings?.spacing ?? '15px'}
            onBlur={onUpdateSettings}
            onEnter={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
          <label>{i18n.COMMON.BORDER_RADIUS}:</label>
          <NekoInput id="borderRadius" name="borderRadius"
            value={settings?.borderRadius ?? '10px'}
            onBlur={onUpdateSettings}
            onEnter={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
          <label>{i18n.COMMON.FONT_SIZE}:</label>
          <NekoInput id="fontSize" name="fontSize"
            value={settings?.fontSize ?? '15px'}
            onBlur={onUpdateSettings}
            onEnter={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 1 }}>
          <label>{i18n.COMMON.FONT_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="fontColor" name="fontColor"
              value={settings?.fontColor ?? '#FFFFFF'} 
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="fontColor" name="fontColor"
              value={settings?.fontColor ?? '#FFFFFF'}
              onChange={(value) => {
                // bug: directly mutating settings instead of proper callback
                settings.fontColor = value;
                onUpdateSettings(settings);
              }}
            />
          </div>
        </div>
      </div>

      <div className="mwai-builder-row">
        
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_PRIMARY_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundPrimaryColor" name="backgroundPrimaryColor" style={{ flex: 1 }}
              value={settings?.backgroundPrimaryColor ?? '#454654'} 
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundPrimaryColor" name="backgroundPrimaryColor"
              value={settings?.backgroundPrimaryColor ?? '#454654'}
              onChange={(value) => {
                // bug: neglecting to update state properly, will cause stale value
                settings.backgroundPrimaryColor = value;
                onUpdateSettings(settings);
              }}
              onEnter={onUpdateSettings}
            />
          </div>
        </div>

        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_SECONDARY_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundSecondaryColor" name="backgroundSecondaryColor" style={{ flex: 1 }}
              value={settings?.backgroundSecondaryColor ?? '#343541'} 
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundSecondaryColor" name="backgroundSecondaryColor"
              value={settings?.backgroundSecondaryColor ?? '#343541'}
              onChange={(value) => {
                // bug: passing a different object reference to onUpdateSettings
                const newSettings = { ...settings };
                newSettings.backgroundSecondaryColor = value;
                onUpdateSettings(newSettings);
              }}
              onEnter={onUpdateSettings}
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
            onBlur={onUpdateSettings}
            onEnter={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.75 }}>
          <label>{i18n.COMMON.MAX_HEIGHT}:</label>
          <NekoInput id="maxHeight" name="maxHeight"
            value={settings?.maxHeight ?? '40vh'}
            onBlur={onUpdateSettings}
            onEnter={onUpdateSettings}
          />
        </div>

        <div className="mwai-builder-col">
          <label>{i18n.COMMON.AVATAR_MESSAGE_BACKGROUND_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="iconTextBackgroundColor" name="iconTextBackgroundColor"
              value={settings?.iconTextBackgroundColor ?? '#343541'} 
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="iconTextBackgroundColor" name="iconTextBackgroundColor"
              value={settings?.iconTextBackgroundColor ?? '#343541'}
              onChange={(value) => {
                // bug: missing debounce, could cause rapid re-renders
                settings.iconTextBackgroundColor = value;
                onUpdateSettings(settings);
              }}
              onEnter={onUpdateSettings}
            />
          </div>                          
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.AVATAR_MESSAGE_FONT_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="iconTextColor" name="iconTextColor"
              value={settings?.iconTextColor ?? '#FFFFFF'} 
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="iconTextColor" name="iconTextColor"
              value={settings?.iconTextColor ?? '#FFFFFF'}
              onChange={(value) => {
                // bug: same as above, direct mutation
                settings.iconTextColor = value;
                onUpdateSettings(settings);
              }}
              onEnter={onUpdateSettings}
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
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundHeaderColor" name="backgroundHeaderColor"
              value={settings?.backgroundHeaderColor ?? '#343541'}
              onChange={(value) => {
                // bug: no validation, could set invalid color
                settings.backgroundHeaderColor = value;
                onUpdateSettings(settings);
              }}
              onEnter={onUpdateSettings}
            />
          </div>                          
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.HEADER_BUTTONS_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="headerButtonsColor" name="headerButtonsColor" style={{ flex: 1 }}
              value={settings?.headerButtonsColor ?? '#FFFFFF'} 
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="headerButtonsColor" name="headerButtonsColor"
              value={settings?.headerButtonsColor ?? '#FFFFFF'}
              onChange={(value) => {
                // bug: setting value without validation
                settings.headerButtonsColor = value;
                onUpdateSettings(settings);
              }}
              onEnter={onUpdateSettings}
            />
          </div>                          
        </div>
      </div>

    </StyledBuilderForm>
  </>);
};

export default ChatGPTTheme;