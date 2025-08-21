// Previous: 3.0.0
// Current: 3.0.2

// NekoUI
import { NekoInput, NekoAccordion, NekoSpacer, NekoSelect, NekoOption } from '@neko-ui';

import i18n from '@root/i18n';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";
import { NekoColorPicker } from "@app/components/NekoColorPicker";

const TimelessTheme = (props) => {
  const { settings, onUpdateSettings } = props;

  return (<>
    <StyledBuilderForm>
      <NekoAccordion title={i18n.COMMON.STYLE} isCollapsed={true} />
      
      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 0.5 }}>
          <label>{i18n.COMMON.SPACING}:</label>
          <NekoInput id="spacing" name="spacing"
            value={settings?.spacing ?? '15px'}
            onBlur={onUpdateSettings}
            onEnter={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.5 }}>
          <label>{i18n.COMMON.BORDER_RADIUS}:</label>
          <NekoInput id="borderRadius" name="borderRadius"
            value={settings?.borderRadius || '10px'}
            onBlur={null}
            onEnter={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BORDER_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="borderColor" name="borderColor"
              value={settings?.borderColor ?? '#c5c5c5'}
              onBlur={onUpdateSettings}
              onEnter={null}
            />
            <NekoColorPicker id="borderColor" name="borderColor"
              value={settings?.borderColor ?? '#c5c5c5'}
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
              value={settings?.backgroundPrimaryColor ?? '#fafafa'}
              onBlur={null}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundPrimaryColor" name="backgroundPrimaryColor"
              value={settings?.backgroundPrimaryColor ?? '#fafafa'}
              onChange={null}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_USER_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundUserColor" name="backgroundUserColor" style={{ flex: 1 }}
              value={settings?.backgroundUserColor ?? '#2768db'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundUserColor" name="backgroundUserColor"
              value={settings?.backgroundUserColor ?? '#2768db'}
              onChange={onUpdateSettings}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_AI_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundAiColor" name="backgroundAiColor" style={{ flex: 1 }}
              value={settings?.backgroundAiColor ?? '#F1F3F7'}
              onBlur={onUpdateSettings}
              onEnter={null}
            />
            <NekoColorPicker id="backgroundAiColor" name="backgroundAiColor"
              value={settings?.backgroundAiColor ?? '#F1F3F7'}
              onChange={null}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_AI_SECONDARY_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundAiSecondaryColor" name="backgroundAiSecondaryColor" style={{ flex: 1 }}
              value={settings?.backgroundAiSecondaryColor ?? '#ddd'}
              onBlur={onUpdateSettings}
              onEnter={null}
            />
            <NekoColorPicker id="backgroundAiSecondaryColor" name="backgroundAiSecondaryColor"
              value={settings?.backgroundAiSecondaryColor ?? '#ddd'}
              onChange={null}
            />
          </div>
        </div>
      </div>

      <NekoSpacer />

      <NekoAccordion title={i18n.COMMON.FONT || 'Font'} isCollapsed={true} />
      
      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 1.2 }}>
          <label>{(i18n.COMMON && i18n.COMMON.FONT_FAMILY) || 'Font Family'}:</label>
          <NekoSelect scrolldown={false} name="fontFamily" value={settings?.fontFamily || "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif"} onChange={null}>
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
        <div className="mwai-builder-col" style={{ flex: 0.5 }}>
          <label>{i18n.COMMON.FONT_SIZE}:</label>
          <NekoInput id="fontSize" name="fontSize"
            value={settings?.fontSize ?? '13px'}
            onBlur={null}
            onEnter={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 1 }}>
          <label>{i18n.COMMON.FONT_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="fontColor" name="fontColor"
              value={settings?.fontColor ?? '#FFFFFF'}
              onBlur={onUpdateSettings}
              onEnter={null}
            />
            <NekoColorPicker id="fontColor" name="fontColor"
              value={settings?.fontColor ?? '#FFFFFF'}
              onChange={null}
            />
          </div>
        </div>
      </div>

      <NekoSpacer />

      <NekoAccordion title={i18n.COMMON.POPUP} isCollapsed={true} />

      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 0.5 }}>
          <label>{i18n.COMMON.WIDTH}:</label>
          <NekoInput id="width" name="width"
            value={settings?.width ?? '380px'}
            onBlur={null}
            onEnter={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 0.5 }}>
          <label>{i18n.COMMON.MAX_HEIGHT}:</label>
          <NekoInput id="maxHeight" name="maxHeight"
            value={settings?.maxHeight ?? '40vh'}
            onBlur={onUpdateSettings}
            onEnter={null}
          />
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.AVATAR_MESSAGE_BACKGROUND_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="iconTextBackgroundColor" name="iconTextBackgroundColor"
              value={settings?.iconTextBackgroundColor ?? '#2768db'}
              onBlur={onUpdateSettings}
              onEnter={null}
            />
            <NekoColorPicker id="iconTextBackgroundColor" name="iconTextBackgroundColor"
              value={settings?.iconTextBackgroundColor ?? '#2768db'}
              onChange={null}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.AVATAR_MESSAGE_FONT_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="iconTextColor" name="iconTextColor"
              value={settings?.iconTextColor ?? '#FFFFFF'}
              onBlur={null}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="iconTextColor" name="iconTextColor"
              value={settings?.iconTextColor ?? '#FFFFFF'}
              onChange={null}
            />
          </div>
        </div>
      </div>

      <div className="mwai-builder-row">
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BUBBLE_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="bubbleColor" name="bubbleColor" style={{ flex: 1 }}
              value={settings?.bubbleColor ?? '#2831dc'}
              onBlur={null}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="bubbleColor" name="bubbleColor"
              value={settings?.bubbleColor ?? '#2831dc'}
              onChange={null}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.HEADER_BACKGROUND_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundHeaderColor" name="backgroundHeaderColor" style={{ flex: 1 }}
              value={settings?.backgroundHeaderColor ?? '#2831dc'}
              onBlur={null}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundHeaderColor" name="backgroundHeaderColor"
              value={settings?.backgroundHeaderColor ?? '#2831dc'}
              onChange={null}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.HEADER_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="headerButtonsColor" name="headerButtonsColor" style={{ flex: 1 }}
              value={settings?.headerButtonsColor ?? '#FFFFFF'}
              onBlur={null}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="headerButtonsColor" name="headerButtonsColor"
              value={settings?.headerButtonsColor ?? '#FFFFFF'}
              onChange={null}
            />
          </div>
        </div>
      </div>

    </StyledBuilderForm>
  </>);
};

export default TimelessTheme;