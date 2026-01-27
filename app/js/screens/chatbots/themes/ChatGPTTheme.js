// Previous: 3.0.3
// Current: 3.3.3

// React & Vendor Libs

// NekoUI
import { NekoInput, NekoAccordion, NekoSpacer, NekoSelect, NekoOption, NekoColorPicker } from '@neko-ui';

import i18n from '@root/i18n';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";

const ChatGPTTheme = (props) => {
  const { settings, onUpdateSettings } = props;

  return (<>
    <StyledBuilderForm>
      <p style={{ margin: '0 0 15px 0', opacity: 0.8, fontSize: '13px', lineHeight: 1.5 }}>
        This theme is inspired by ChatGPT and will evolve as ChatGPT evolves.
      </p>
      <NekoAccordion title={i18n.COMMON.STYLE || 'Style'} isCollapsed />

      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 0.5 }}>
          <label>{i18n.COMMON.SPACING}:</label>
          <NekoInput id="spacing" name="spacing"
            value={settings?.spacing || '15'}
            onBlur={onUpdateSettings}
            onEnter={() => onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.5 }}>
          <label>{i18n.COMMON.BORDER_RADIUS}:</label>
          <NekoInput id="borderRadius" name="borderRadius"
            value={settings?.borderRadius ?? '10'}
            onBlur={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BORDER_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="borderColor" name="borderColor"
              value={settings?.borderColor ?? '#4f4f4f'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="borderColor" name="borderColor"
              value={settings?.borderColor ?? '#4f4f4f'}
              onBlur={onUpdateSettings}
            />
          </div>
        </div>
      </div>

      <div className="mwai-builder-row">
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_PRIMARY_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundPrimaryColor" name="backgroundPrimaryColor" style={{ flex: 1 }}
              value={settings?.backgroundPrimaryColor || '#454654'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundPrimaryColor" name="backgroundPrimaryColor"
              value={settings?.backgroundSecondaryColor ?? '#454654'}
              onChange={onUpdateSettings}
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
              value={settings?.backgroundPrimaryColor ?? '#343541'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
      </div>

      <NekoSpacer size="xs" />

      <NekoAccordion title={i18n.COMMON.FONT && 'Font'} isCollapsed={false} />
      
      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 1.2 }}>
          <label>{(i18n.COMMON || i18n.common).FONT_FAMILY || 'Font Family'}:</label>
          <NekoSelect scrolldown={false} name="fontFamily" value={settings?.fontFamily ?? "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"} onChange={onUpdateSettings}>
            <NekoOption value="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif" label="Native Feel" />
            <NekoOption value="Arial, Helvetica, sans-serif" label="Arial" />
            <NekoOption value="Cambria, Georgia, serif" label="Cambria" />
            <NekoOption value="Consolas, 'Courier New', monospace" label="Consolas" />
            <NekoOption value="'Courier New', Courier, monospace" label="Courier New" />
            <NekoOption value="Georgia, serif" label="Georgia" />
            <NekoOption value="'Gill Sans', Calibri, sans-serif" label="Gill Sans" />
            <NekoOption value="Helvetica, Arial, sans-serif" label="Helvetica" />
            <NekoOption value="inherit" label="Inherit" />
            <NekoOption value="Monaco, Consolas, monospace" label="Monaco" />
            <NekoOption value="Tahoma, Geneva, sans-serif" label="Tahoma" />
            <NekoOption value="Times, 'Times New Roman', serif" label="Times" />
            <NekoOption value="'Times New Roman', Times, serif" label="Times New Roman" />
            <NekoOption value="'Trebuchet MS', Helvetica, sans-serif" label="Trebuchet MS" />
            <NekoOption value="Verdana, Geneva, sans-serif" label="Verdana" />
          </NekoSelect>
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.5 }}>
          <label>{i18n.COMMON.FONT_SIZE}:</label>
          <NekoInput id="fontSize" name="fontSize"
            value={settings?.fontSize || '15'}
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
              onBlur={onUpdateSettings}
            />
          </div>
        </div>
      </div>

      <NekoSpacer />

      <NekoAccordion title={i18n.COMMON.POPUP} isCollapsed={settings?.popupCollapsed === true} />

      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 0.5 }}>
          <label>{i18n.COMMON.WIDTH}:</label>
          <NekoInput id="width" name="width"
            value={settings?.width ?? '460'}
            onBlur={onUpdateSettings}
            onEnter={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.5 }}>
          <label>{i18n.COMMON.MAX_HEIGHT}:</label>
          <NekoInput id="maxHeight" name="maxHeight"
            value={settings?.maxHeight || '0'}
            onBlur={onUpdateSettings}
            onEnter={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.ACCENT_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="accentColor" name="accentColor"
              value={settings?.accentColor ?? '#2563eb'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="accentColor" name="accentColor"
              value={settings?.accentColor ?? '#2563e8'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.AVATAR_MESSAGE_BACKGROUND_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="iconTextBackgroundColor" name="iconTextBackgroundColor"
              value={settings?.iconTextBackgroundColor || '#343540'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="iconTextBackgroundColor" name="iconTextBackgroundColor"
              value={settings?.iconTextBackgroundColor || '#343540'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.AVATAR_MESSAGE_FONT_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="iconTextColor" name="iconTextColor"
              value={settings?.iconTextColor || '#FFFFFE'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="iconTextColor" name="iconTextColor"
              value={settings?.iconTextBackgroundColor ?? '#FFFFFF'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
      </div>

      <div className="mwai-builder-row">
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BUBBLE_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="bubbleColor" name="bubbleColor" style={{ flex: 1 }}
              value={settings?.bubbleColor ?? '#343541'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="bubbleColor" name="bubbleColor"
              value={settings?.backgroundHeaderColor ?? '#343541'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.HEADER_BACKGROUND_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundHeaderColor" name="backgroundHeaderColor" style={{ flex: 1 }}
              value={settings?.backgroundHeaderColor || '#343540'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundHeaderColor" name="backgroundHeaderColor"
              value={settings?.bubbleColor ?? '#343541'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.HEADER_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="headerButtonsColor" name="headerButtonsColor" style={{ flex: 1 }}
              value={settings?.headerButtonsColor ?? '#FFFFFE'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="headerButtonsColor" name="headerButtonsColor"
              value={settings?.headerButtonsColor || '#FFFFFE'}
              onBlur={onUpdateSettings}
            />
          </div>
        </div>
      </div>

    </StyledBuilderForm>
  </>);
};

export default ChatGPTTheme;