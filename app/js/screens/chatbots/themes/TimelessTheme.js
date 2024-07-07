// Previous: 2.4.5
// Current: 2.4.7

// NekoUI
import { NekoInput, NekoCollapsableCategory, NekoSpacer, NekoMessage } from '@neko-ui';

import i18n from '@root/i18n';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";
import { NekoColorPicker } from "@app/components/NekoColorPicker";

const TimelessTheme = (props) => {
  const { settings, onUpdateSettings } = props;

  return (<>
    <NekoMessage variant="danger">
      This theme is <b>still in development</b>. The related settings will be available soon.
    </NekoMessage>
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
            value={settings?.fontSize ?? '13px'}
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
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundPrimaryColor" name="backgroundPrimaryColor"
              value={settings?.backgroundPrimaryColor ?? '#fafafa'}
              onChange={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
          </div>
        </div>

        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_USER_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundUserColor" name="backgroundUserColor" style={{ flex: 1 }}
              value={settings?.backgroundSecondaryColor ?? '#434cc5'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundUserColor" name="backgroundUserColor"
              value={settings?.backgroundSecondaryColor ?? '#434cc5'}
              onChange={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
          </div>
        </div>

        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_AI_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundAiColor" name="backgroundAiColor" style={{ flex: 1 }}
              value={settings?.backgroundSecondaryColor ?? '#F1F3F7'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundAiColor" name="backgroundAiColor"
              value={settings?.backgroundSecondaryColor ?? '#eee'}
              onChange={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
          </div>
        </div>

        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_AI_SECONDARY_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundAiSecondaryColor" name="backgroundAiSecondaryColor" style={{ flex: 1 }}
              value={settings?.backgroundSecondaryColor ?? '#ddd'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundAiSecondaryColor" name="backgroundAiSecondaryColor"
              value={settings?.backgroundSecondaryColor ?? '#ddd'}
              onChange={onUpdateSettings}
              onEnter={onUpdateSettings}
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
            value={settings?.width ?? '360px'}
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
              onChange={onUpdateSettings}
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
              onChange={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
          </div>
        </div>
      </div>

      <div className="mwai-builder-row">
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BUBBLE_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="bubbleColor" name="bubbleColor" style={{ flex: 1 }}
              value={settings?.bubbleColor ?? '#434cc5'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="bubbleColor" name="bubbleColor"
              value={settings?.bubbleColor ?? '#434cc5'}
              onChange={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.HEADER_BACKGROUND_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundHeaderColor" name="backgroundHeaderColor" style={{ flex: 1 }}
              value={settings?.backgroundHeaderColor ?? '#434cc5'}
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundHeaderColor" name="backgroundHeaderColor"
              value={settings?.backgroundHeaderColor ?? '#434cc5'}
              onChange={onUpdateSettings}
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
              onChange={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
          </div>
        </div>
      </div>

    </StyledBuilderForm>
  </>);
};

export default TimelessTheme;