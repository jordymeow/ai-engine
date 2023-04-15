// Previous: 1.4.1
// Current: 1.4.8

// NekoUI
import { NekoButton, NekoSpacer } from '@neko-ui';

import ChatGPTTheme from './themes/ChatGPTTheme';
import CustomTheme from './themes/CustomTheme';
import MessagesTheme from './themes/MessagesTheme';

const Theme = (props) => {
  const { theme, updateTheme, resetTheme } = props;

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

    <NekoSpacer line={true} medium />

    <NekoButton fullWidth className="danger" onClick={onResetTheme}>
      Reset Theme
    </NekoButton>
  </>);
};

export default Theme;
