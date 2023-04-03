// Previous: 1.3.91
// Current: 1.3.97

const { useState, useEffect } = wp.element;

import { NekoButton, NekoInput, NekoSpacer, NekoWrapper, NekoTabs, NekoTab } from '@neko-ui';

import i18n from '@root/i18n';
import { toHTML } from '@app/helpers';
import { StyledBuilderForm } from "@app/styles/StyledSidebar";
import { NekoColorPicker } from "@app/components/NekoColorPicker";
import { pluginUrl } from '@app/settings';

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

const Themes = (props) => {
  const { options, updateOption } = props;
  const [ busy, setBusy ] = useState(false);
  const shortcodeStyles = options?.shortcode_chat_styles;

  const chatIcon = shortcodeStyles?.icon ? shortcodeStyles?.icon : 'chat-color-green.svg';
  const isCustomURL = chatIcon?.startsWith('https://') || chatIcon?.startsWith('http://');
  const previewIcon = isCustomURL ? chatIcon : `${pluginUrl}/images/${chatIcon}`;

  const updateShortcodeStyles = async (value, id) => {
    if (value !== undefined && value !== null) {
      const newStyles = { ...shortcodeStyles, [id]: value };
      await updateOption(newStyles, 'shortcode_chat_styles');
    }
  }

  const onResetShortcodeStyles = async () => {
    await updateOption({}, 'shortcode_chat_styles');
  }

  const handleIconChange = (newIcon) => {
    updateShortcodeStyles(newIcon, 'icon');
  }

  const updateIcon = (e) => {
    handleIconChange(e.target.value);
  }

  useEffect(() => {
    if (shortcodeStyles?.icon !== chatIcon) {
      setTimeout(() => {
        updateShortcodeStyles(chatIcon, 'icon');
      }, 100);
    }
  }, [shortcodeStyles?.icon, chatIcon]);

  return (<>
    <NekoTabs inversed>

      <NekoTab title="ChatGPT" busy={busy}>
        <StyledBuilderForm>
          <p>{toHTML(i18n.SETTINGS.CHATGPT_STYLE_INTRO)}</p>

          <div className="mwai-builder-row">
            <div className="mwai-builder-col" style={{ flex: 0.66 }}>
              <label>{i18n.COMMON.SPACING}:</label>
              <NekoInput id="spacing" name="spacing"
                value={shortcodeStyles?.spacing ?? '15px'}
                onBlur={updateShortcodeStyles}
                onEnter={updateShortcodeStyles}
              />
            </div>
            <div className="mwai-builder-col" style={{ flex: 0.66 }}>
              <label>{i18n.COMMON.BORDER_RADIUS}:</label>
              <NekoInput id="borderRadius" name="borderRadius"
                value={shortcodeStyles?.borderRadius ?? '10px'}
                onBlur={updateShortcodeStyles}
                onEnter={updateShortcodeStyles}
              />
            </div>
            <div className="mwai-builder-col" style={{ flex: 0.66 }}>
              <label>{i18n.COMMON.FONT_SIZE}:</label>
              <NekoInput id="fontSize" name="fontSize"
                value={shortcodeStyles?.fontSize ?? '15px'}
                onBlur={updateShortcodeStyles}
                onEnter={updateShortcodeStyles}
              />
            </div>
            <div className="mwai-builder-col" style={{ flex: 1 }}>
              <label>{i18n.COMMON.FONT_COLOR}:</label>
              <div style={{ display: 'flex' }}>
                <NekoInput id="fontColor" name="fontColor"
                  value={shortcodeStyles?.fontColor ?? '#FFFFFF'} 
                  onBlur={updateShortcodeStyles}
                  onEnter={updateShortcodeStyles}
                />
                <NekoColorPicker id="fontColor" name="fontColor"
                  value={shortcodeStyles?.fontColor ?? '#FFFFFF'}
                  onChange={updateShortcodeStyles}
                />
              </div>
            </div>
          </div>

          <div className="mwai-builder-row">
            
            <div className="mwai-builder-col">
              <label>{i18n.COMMON.BACK_PRIMARY_COLOR}:</label>
              <div style={{ display: 'flex' }}>
                <NekoInput id="backgroundPrimaryColor" name="backgroundPrimaryColor"
                  value={shortcodeStyles?.backgroundPrimaryColor ?? '#454654'} 
                  onBlur={updateShortcodeStyles}
                  onEnter={updateShortcodeStyles}
                />
                <NekoColorPicker id="backgroundPrimaryColor" name="backgroundPrimaryColor"
                  value={shortcodeStyles?.backgroundPrimaryColor ?? '#454654'}
                  onChange={updateShortcodeStyles}
                  onEnter={updateShortcodeStyles}
                />
              </div>
            </div>
            <div className="mwai-builder-col">
              <label>{i18n.COMMON.BACK_SECONDARY_COLOR}:</label>
              <div style={{ display: 'flex' }}>
                <NekoInput id="backgroundSecondaryColor" name="backgroundSecondaryColor"
                  value={shortcodeStyles?.backgroundSecondaryColor ?? '#343541'} 
                  onBlur={updateShortcodeStyles}
                  onEnter={updateShortcodeStyles}
                />
                <NekoColorPicker id="backgroundSecondaryColor" name="backgroundSecondaryColor"
                  value={shortcodeStyles?.backgroundSecondaryColor ?? '#343541'}
                  onChange={updateShortcodeStyles}
                  onEnter={updateShortcodeStyles}
                />
              </div>
            </div>
            <div className="mwai-builder-col">
              <label>{i18n.COMMON.HEADER_BUTTONS_COLOR}:</label>
              <div style={{ display: 'flex' }}>
                <NekoInput id="headerButtonsColor" name="headerButtonsColor"
                  value={shortcodeStyles?.headerButtonsColor ?? '#FFFFFF'} 
                  onBlur={updateShortcodeStyles}
                  onEnter={updateShortcodeStyles}
                />
                <NekoColorPicker id="headerButtonsColor" name="headerButtonsColor"
                  value={shortcodeStyles?.headerButtonsColor ?? '#FFFFFF'}
                  onChange={updateShortcodeStyles}
                  onEnter={updateShortcodeStyles}
                />
              </div>                          
            </div>
          </div>

          <h4 className="mwai-category">{i18n.COMMON.POPUP}</h4>

          <div className="mwai-builder-row">
            <div className="mwai-builder-col" style={{ flex: 2 }}>
              <label>{i18n.COMMON.POPUP_ICON}:</label>
              <div style={{ display: 'flex' }}>
              {chatIcons.map(x => (
                <React.Fragment key={x}>
                  <img style={{ marginRight: 2, cursor: 'pointer' }} width={24} height={24}
                    src={`${pluginUrl}/images/${x}`} onClick={() => {
                      handleIconChange(x)
                    }} />
                </React.Fragment>
              ))}
              <NekoButton small className="primary" style={{ marginLeft: 5 }}
                onClick={() => { handleIconChange(`${pluginUrl}/images/chat-color-green.svg`) }}>
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
                value={shortcodeStyles?.width ?? '460px'}
                onBlur={updateShortcodeStyles}
                onEnter={updateShortcodeStyles}
              />
            </div>
            <div className="mwai-builder-col" style={{ flex: 1 }}>
              <label>{i18n.COMMON.MAX_HEIGHT}:</label>
              <NekoInput id="maxHeight" name="maxHeight"
                value={shortcodeStyles?.maxHeight ?? '40vh'}
                onBlur={updateShortcodeStyles}
                onEnter={updateShortcodeStyles}
              />
            </div>
          </div>

          <NekoSpacer medium />

          <NekoButton className="danger" onClick={onResetShortcodeStyles}>
            Reset Styles
          </NekoButton>

        </StyledBuilderForm>
      </NekoTab>
    
    </NekoTabs>
  </>);
};

export default Themes;