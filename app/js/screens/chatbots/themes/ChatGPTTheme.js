// Previous: none
// Current: 1.4.0

// NekoUI
import { NekoButton, NekoInput, NekoSpacer } from '@neko-ui';

import i18n from '@root/i18n';
import { toHTML } from '@app/helpers';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";
import { NekoColorPicker } from "@app/components/NekoColorPicker";
import { pluginUrl } from "@app/settings";

const chatIcons = [
  'chat-robot-1.svg',
  'chat-robot-2.svg',
  'chat-robot-3.svg',
  'chat-robot-4.svg',
  'chat-robot-5.svg',
  'chat-robot-6.svg',
  'chat-color-blue.svg',
  'chat-color-green.svg',
  'chat-color-red.svg',
  'chat-traditional-1.svg',
  'chat-traditional-2.svg',
  'chat-traditional-3.svg'
];

const ChatGPTTheme = (props) => {
  const { settings, onUpdateSettings } = props;
  const chatIcon = settings?.icon ? settings?.icon : 'chat-color-green.svg';
  const isCustomURL = chatIcon?.startsWith('https://') || chatIcon?.startsWith('http://');
  const previewIcon = isCustomURL ? chatIcon : `${pluginUrl}/images/${chatIcon}`;

  const updateIcon = async (value) => {
    if (value.startsWith('http://') || value.startsWith('https://')) {
      const newStyles = { ...shortcodeStyles, icon: value };
      await onUpdateSettings(newStyles, 'shortcode_chat_styles');
    } else {
      alert('Please enter a valid URL.');
    }
  }

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
              onChange={onUpdateSettings}
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
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundPrimaryColor" name="backgroundPrimaryColor"
              value={settings?.backgroundPrimaryColor ?? '#454654'}
              onChange={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.BACK_SECONDARY_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="backgroundSecondaryColor" name="backgroundSecondaryColor"
              value={settings?.backgroundSecondaryColor ?? '#343541'} 
              onBlur={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
            <NekoColorPicker id="backgroundSecondaryColor" name="backgroundSecondaryColor"
              value={settings?.backgroundSecondaryColor ?? '#343541'}
              onChange={onUpdateSettings}
              onEnter={onUpdateSettings}
            />
          </div>
        </div>
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.HEADER_BUTTONS_COLOR}:</label>
          <div style={{ display: 'flex' }}>
            <NekoInput id="headerButtonsColor" name="headerButtonsColor"
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

      <h4 className="mwai-category">{i18n.COMMON.POPUP}</h4>

      <div className="mwai-builder-row">
        <div className="mwai-builder-col" style={{ flex: 2 }}>
          <label>{i18n.COMMON.POPUP_ICON}:</label>
          <div style={{ display: 'flex' }}>
          {chatIcons.map(x => 
            <>
              <img style={{ marginRight: 2, cursor: 'pointer' }} width={24} height={24}
                src={`${pluginUrl}/images/${x}`} onClick={() => {
                  onUpdateSettings(x, 'icon')
                }} />
            </>
          )}
          <NekoButton small className="primary" style={{ marginLeft: 5 }}
            onClick={() => { onUpdateSettings(`${pluginUrl}/images/chat-color-green.svg`, 'icon') }}>
            {i18n.SETTINGS.CUSTOM_URL}
          </NekoButton>
          </div>
        </div>
        <div className="mwai-builder-col" style={{ width: 48, display: 'flex', alignItems: 'end' }}>
          <img style={{ marginRight: 0, paddingTop: 10 }} width={48} height={48} src={`${previewIcon}`} />
        </div>
      </div>
      {isCustomURL && <div className="mwai-builder-row">
        <div className="mwai-builder-col">
          <label>{i18n.COMMON.CUSTOM_ICON_URL}:</label>
          <NekoInput id="icon" name="icon" value={chatIcon}
            onBlur={updateIcon}
            onEnter={updateIcon}
          />
        </div>
      </div>}

      <div className="mwai-builder-row" style={{ marginTop: 0 }}>
        <div className="mwai-builder-col" style={{ flex: 1 }}>
          <label>{i18n.COMMON.WIDTH}:</label>
          <NekoInput id="width" name="width"
            value={settings?.width ?? '460px'}
            onBlur={onUpdateSettings}
            onEnter={onUpdateSettings}
          />
        </div>
        <div className="mwai-builder-col" style={{ flex: 1 }}>
          <label>{i18n.COMMON.MAX_HEIGHT}:</label>
          <NekoInput id="maxHeight" name="maxHeight"
            value={settings?.maxHeight ?? '40vh'}
            onBlur={onUpdateSettings}
            onEnter={onUpdateSettings}
          />
        </div>
      </div>

      <p>{toHTML(i18n.SETTINGS.CHATGPT_STYLE_INTRO)}</p>

    </StyledBuilderForm>
  </>);
};

export default ChatGPTTheme;