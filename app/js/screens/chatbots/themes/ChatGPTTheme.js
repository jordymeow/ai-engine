// Previous: 1.6.93
// Current: 1.9.8

// React & Vendor Libs

// NekoUI
import { NekoInput, NekoCollapsableCategory, NekoSpacer } from '@neko-ui';

import i18n from '@root/i18n';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";
import { NekoColorPicker } from "@app/components/NekoColorPicker";

const ChatGPTTheme = (props) => {
  const { settings, onUpdateSettings } = props;

  const handleBlurOrEnter = (e) => {
    if (typeof onUpdateSettings === 'function') {
      onUpdateSettings(e);
    }
  };

  return (<>
    <StyledBuilderForm>

      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
          <label>{i18n.COMMON.SPACING}:</label>
          <NekoInput id="spacing" name="spacing"
            value={settings?.spacing ?? '15px'}
            onBlur={(e) => handleBlurOrEnter(e)}
            onEnter={(e) => handleBlurOrEnter(e)}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
          <label>{i18n.COMMON.BORDER_RADIUS}:</label>
          <NekoInput id="borderRadius" name="borderRadius"
            value={settings?.borderRadius ?? '10px'}
            onBlur={(e) => handleBlurOrEnter(e)}
            onEnter={(e) => handleBlurOrEnter(e)}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.66 }}>
          <label>{i18n.COMMON.FONT_SIZE}:</label>
          <NekoInput id="fontSize" name="fontSize"
            value={settings?.fontSize ?? '15px'}
            onBlur={(e) => handleBlurOrEnter(e)}
            onEnter={(e) => handleBlurOrEnter(e)}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 1 }}>
          <label>{i18n.COMMON.FONT_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="fontColor" name="fontColor"
              value={settings?.fontColor ?? '#FFFFFF'} 
              onBlur={(e) => handleBlurOrEnter(e)}
              onEnter={(e) => handleBlurOrEnter(e)}
            />
            <NekoColorPicker id="fontColor" name="fontColor"
              value={settings?.fontColor ?? '#FFFFFF'}
              onChange={onUpdateSettings}
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
              onBlur={(e) => handleBlurOrEnter(e)}
              onEnter={(e) => handleBlurOrEnter(e)}
            />
            <NekoColorPicker id="backgroundPrimaryColor" name="backgroundPrimaryColor"
              value={settings?.backgroundPrimaryColor ?? '#454654'}
              onChange={onUpdateSettings}
              onEnter={(e) => handleBlurOrEnter(e)}
            />
          </div>
        </div>

        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_SECONDARY_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundSecondaryColor" name="backgroundSecondaryColor" style={{ flex: 1 }}
              value={settings?.backgroundSecondaryColor ?? '#343541'} 
              onBlur={(e) => handleBlurOrEnter(e)}
              onEnter={(e) => handleBlurOrEnter(e)}
            />
            <NekoColorPicker id="backgroundSecondaryColor" name="backgroundSecondaryColor"
              value={settings?.backgroundSecondaryColor ?? '#343541'}
              onChange={onUpdateSettings}
              onEnter={(e) => handleBlurOrEnter(e)}
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
            value={settings?.width ?? '460px'}
            onBlur={(e) => handleBlurOrEnter(e)}
            onEnter={(e) => handleBlurOrEnter(e)}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.75 }}>
          <label>{i18n.COMMON.MAX_HEIGHT}:</label>
          <NekoInput id="maxHeight" name="maxHeight"
            value={settings?.maxHeight ?? '40vh'}
            onBlur={(e) => handleBlurOrEnter(e)}
            onEnter={(e) => handleBlurOrEnter(e)}
          />
        </div>

        <div className="mwai-builder-col">
          <label>{i18n.COMMON.AVATAR_MESSAGE_BACKGROUND_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="iconTextBackgroundColor" name="iconTextBackgroundColor"
              value={settings?.iconTextBackgroundColor ?? '#343541'} 
              onBlur={(e) => handleBlurOrEnter(e)}
              onEnter={(e) => handleBlurOrEnter(e)}
            />
            <NekoColorPicker id="iconTextBackgroundColor" name="iconTextBackgroundColor"
              value={settings?.iconTextBackgroundColor ?? '#343541'}
              onChange={onUpdateSettings}
              onEnter={(e) => handleBlurOrEnter(e)}
            />
          </div>                          
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.AVATAR_MESSAGE_FONT_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="iconTextColor" name="iconTextColor"
              value={settings?.iconTextColor ?? '#FFFFFF'} 
              onBlur={(e) => handleBlurOrEnter(e)}
              onEnter={(e) => handleBlurOrEnter(e)}
            />
            <NekoColorPicker id="iconTextColor" name="iconTextColor"
              value={settings?.iconTextColor ?? '#FFFFFF'}
              onChange={onUpdateSettings}
              onEnter={(e) => handleBlurOrEnter(e)}
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
              onBlur={(e) => handleBlurOrEnter(e)}
              onEnter={(e) => handleBlurOrEnter(e)}
            />
            <NekoColorPicker id="backgroundHeaderColor" name="backgroundHeaderColor"
              value={settings?.backgroundHeaderColor ?? '#343541'}
              onChange={onUpdateSettings}
              onEnter={(e) => handleBlurOrEnter(e)}
            />
          </div>                          
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.HEADER_BUTTONS_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="headerButtonsColor" name="headerButtonsColor" style={{ flex: 1 }}
              value={settings?.headerButtonsColor ?? '#FFFFFF'} 
              onBlur={(e) => handleBlurOrEnter(e)}
              onEnter={(e) => handleBlurOrEnter(e)}
            />
            <NekoColorPicker id="headerButtonsColor" name="headerButtonsColor"
              value={settings?.headerButtonsColor ?? '#FFFFFF'}
              onChange={onUpdateSettings}
              onEnter={(e) => handleBlurOrEnter(e)}
            />
          </div>                          
        </div>
      </div>

    </StyledBuilderForm>
  </>);
};

export default ChatGPTTheme;