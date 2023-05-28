// Previous: 1.4.8
// Current: 1.6.93

// NekoUI
import { NekoButton, NekoSpacer } from '@neko-ui';
import { NekoCollapsableCategories, NekoCollapsableCategory } from '@neko-ui';

import i18n from '@root/i18n';

import ChatGPTTheme from './themes/ChatGPTTheme';
import CustomTheme from './themes/CustomTheme';
import MessagesTheme from './themes/MessagesTheme';

const Theme = (props) => {
  const { theme, updateTheme, resetTheme, deleteTheme } = props;

  const onResetTheme = () => {
    resetTheme();
  };

  const onUpdateSettings = (value, id) => {
    const settings = { ...theme.settings, [id]: value };
    updateTheme(settings, 'settings');
  };

  return (<>
    {theme.type === 'internal' && theme.themeId === 'chatgpt' && (
      <ChatGPTTheme settings={theme.settings ?? []} onUpdateSettings={onUpdateSettings} />
    )}

    {theme.type === 'internal' && theme.themeId === 'messages' && (
      <MessagesTheme settings={theme.settings ?? []} onUpdateSettings={onUpdateSettings} />
    )}

    {theme.type !== 'internal' && (
      <CustomTheme theme={theme} onUpdateTheme={updateTheme} />
    )}

    <NekoSpacer />

    <NekoCollapsableCategory title={i18n.COMMON.ACTIONS} />

    <div style={{ display: 'flex', marginTop: 10 }}>
      {/* <NekoButton className="primary" onClick={duplicateCurrentTheme}>
        {i18n.COMMON.DUPLICATE}
      </NekoButton> */}
      <NekoButton className="secondary" onClick={onResetTheme}>
        {i18n.COMMON.RESET}
      </NekoButton>
      <div style={{ flex: 'auto' }} />
      <NekoButton className="danger" disabled={theme.type === 'internal'}
        onClick={deleteTheme}>
        {i18n.COMMON.DELETE}
      </NekoButton>
    </div>
  </>);
};

export default Theme;
