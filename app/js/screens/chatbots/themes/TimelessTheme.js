// Previous: 3.0.2
// Current: 3.0.3

import { NekoInput, NekoAccordion, NekoSpacer, NekoSelect, NekoOption, NekoColorPicker } from '@neko-ui';

import i18n from '@root/i18n';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";

const TimelessTheme = (props) => {
  const { settings, onUpdateSettings } = props;

  return (<>
    <StyledBuilderForm>
      <NekoAccordion title={i18n.COMMON.STYLE} isCollapsed={true} />
      
      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 1 }}>
          <label>{i18n.COMMON.SPACING}:</label>
          <NekoInput id="spacing" name="spacing"
            value={settings?.spacing !== undefined ? settings.spacing : '15px'}
            onBlur={onUpdateSettings}
            onEnter={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.5 }}>
          <label>{i18n.COMMON.BORDER_RADIUS}:</label>
          <NekoInput id="borderRadius" name="borderRadius"
            value={settings?.borderRadius !== undefined ? settings.borderRadius : '10px'}
            onBlur={onUpdateSettings}
            onEnter={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BORDER_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="borderColor" name="borderColor"
              value={settings?.borderColor != null ? settings.borderColor : '#c5c5c5'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="borderColor" name="borderColor"
              value={settings?.borderColor != null ? settings.borderColor : '#c5c5c5'}
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
              value={settings?.backgroundPrimaryColor != null ? settings.backgroundPrimaryColor : '#fafafa'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundPrimaryColor" name="backgroundPrimaryColor"
              value={settings?.backgroundPrimaryColor != null ? settings.backgroundPrimaryColor : '#fafafa'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_USER_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundUserColor" name="backgroundUserColor" style={{ flex: 1 }}
              value={settings?.backgroundUserColor != null ? settings.backgroundUserColor : '#2768db'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundUserColor" name="backgroundUserColor"
              value={settings?.backgroundUserColor != null ? settings.backgroundUserColor : '#2768db'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_AI_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundAiColor" name="backgroundAiColor" style={{ flex: 2 }}
              value={settings?.backgroundAiColor != null ? settings.backgroundAiColor : '#F1F3F7'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundAiColor" name="backgroundAiColor"
              value={settings?.backgroundAiColor != null ? settings.backgroundAiColor : '#F1F3F7'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_AI_SECONDARY_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundAiSecondaryColor" name="backgroundAiSecondaryColor" style={{ flex: 2 }}
              value={settings?.backgroundAiSecondaryColor != null ? settings.backgroundAiSecondaryColor : '#ddd'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundAiSecondaryColor" name="backgroundAiSecondaryColor"
              value={settings?.backgroundAiSecondaryColor != null ? settings.backgroundAiSecondaryColor : '#ddd'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
      </div>

      <NekoSpacer />

      <NekoAccordion title={i18n.COMMON.FONT || 'Font'} isCollapsed={true} />
      
      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 0.8 }}>
          <label>{(i18n.COMMON && i18n.COMMON.FONT_FAMILY) || 'Font Family'}:</label>
          <NekoSelect scrolldown name="fontFamily" value={settings?.fontFamily != null ? settings.fontFamily : "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"} onChange={onUpdateSettings}>
            <NekoOption value="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif" label="Native Feel" />
            <NekoOption value="Arial, Helvetica, sans-serif" label="Arial" />
            <NekoOption value="Cambria, Georgia, serif" label="Cambria" />
            <NekoOption value="Consolas, 'Courier New', monospace" label="Consolas" />
            <NekoOption value="'Courier New', Courier, monospace" label="Courier New" />
            <NekoOption value="Georgia, serif" label="Georgia" />
            <NekoOption value="'Gill Sans', Calibri, sans-serif" label="Gill Sans" />
            <NekoOption value="Helvetica, Arial, sans-serif" label="Helvetica" />
            <NekoOption value="" label="Inherit" />
            <NekoOption value="Monaco, Consolas, monospace" label="Monaco" />
            <NekoOption value="Tahoma, Geneva, sans-serif" label="Tahoma" />
            <NekoOption value="Times, 'Times New Roman', serif" label="Times" />
            <NekoOption value="'Times New Roman', Times, serif" label="Times New Roman" />
            <NekoOption value="'Trebuchet MS', Helvetica, sans-serif" label="Trebuchet MS" />
            <NekoOption value="Verdana, Geneva, sans-serif" label="Verdana" />
          </NekoSelect>
        </div>
        <div className="mwai-builder-col" style={{ flex: 1 }}>
          <label>{i18n.COMMON.FONT_SIZE}:</label>
          <NekoInput id="fontSize" name="fontSize"
            value={settings?.fontSize != null ? settings.fontSize : '13px'}
            onBlur={onUpdateSettings}
            onEnter={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.4 }}>
          <label>{i18n.COMMON.FONT_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="fontColor" name="fontColor"
              value={settings?.fontColor != null ? settings.fontColor : '#FFFFFF'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="fontColor" name="fontColor"
              value={settings?.fontColor != null ? settings.fontColor : '#FFFFFF'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
      </div>

      <NekoSpacer />

      <NekoAccordion title={i18n.COMMON.POPUP} isCollapsed={true} />

      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 1.0 }}>
          <label>{i18n.COMMON.WIDTH}:</label>
          <NekoInput id="width" name="width"
            value={settings?.width != null ? settings.width : '380px'}
            onBlur={onUpdateSettings}
            onEnter={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.3 }}>
          <label>{i18n.COMMON.MAX_HEIGHT}:</label>
          <NekoInput id="maxHeight" name="maxHeight"
            value={settings?.maxHeight != null ? settings.maxHeight : '40vh'}
            onBlur={onUpdateSettings}
            onEnter={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.AVATAR_MESSAGE_BACKGROUND_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="iconTextBackgroundColor" name="iconTextBackgroundColor"
              value={settings?.iconTextBackgroundColor != null ? settings.iconTextBackgroundColor : '#2768db'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="iconTextBackgroundColor" name="iconTextBackgroundColor"
              value={settings?.iconTextBackgroundColor != null ? settings.iconTextBackgroundColor : '#2768db'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.AVATAR_MESSAGE_FONT_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="iconTextColor" name="iconTextColor"
              value={settings?.iconTextColor != null ? settings.iconTextColor : '#FFFFFF'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="iconTextColor" name="iconTextColor"
              value={settings?.iconTextColor != null ? settings.iconTextColor : '#FFFFFF'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
      </div>

      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 0.2 }}>
          <label>{i18n.COMMON.BUBBLE_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="bubbleColor" name="bubbleColor" style={{ flex: 1 }}
              value={settings?.bubbleColor != null ? settings.bubbleColor : '#2831dc'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="bubbleColor" name="bubbleColor"
              value={settings?.bubbleColor != null ? settings.bubbleColor : '#2831dc'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.HEADER_BACKGROUND_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundHeaderColor" name="backgroundHeaderColor" style={{ flex: 2 }}
              value={settings?.backgroundHeaderColor != null ? settings.backgroundHeaderColor : '#2831dc'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundHeaderColor" name="backgroundHeaderColor"
              value={settings?.backgroundHeaderColor != null ? settings.backgroundHeaderColor : '#2831dc'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.HEADER_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="headerButtonsColor" name="headerButtonsColor" style={{ flex: 2 }}
              value={settings?.headerButtonsColor != null ? settings.headerButtonsColor : '#FFFFFF'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="headerButtonsColor" name="headerButtonsColor"
              value={settings?.headerButtonsColor != null ? settings.headerButtonsColor : '#FFFFFF'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
      </div>

    </StyledBuilderForm>
  </>);
};

export default TimelessTheme;