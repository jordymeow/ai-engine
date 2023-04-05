// Previous: none
// Current: 1.4.0

// NekoUI
import { NekoButton, NekoSpacer } from '@neko-ui';

import ChatGPTTheme from './themes/ChatGPTTheme';
import CustomTheme from './themes/CustomTheme';

const Theme = (props) => {
  const { theme, updateTheme, resetTheme } = props;

  const onResetTheme = () => {
    resetTheme();
  };

  const onUpdateSettings = (value, id) => {
    const settings = { ...theme.settings, [id]: value };
    updateTheme(settings, 'settings');
  };

  const onUpdateStyle = (style) => {
    updateTheme(style, 'style');
  };

  return (<>
    {theme.type === 'internal' && theme.themeId === 'chatgpt' && (
      <ChatGPTTheme settings={theme.settings ?? []} onUpdateSettings={onUpdateSettings} />
    )}

    {theme.type !== 'internal' && (
      <CustomTheme theme={theme} onUpdateStyle={onUpdateStyle} />
    )}

    <NekoSpacer medium />

    <NekoButton fullWidth className="danger" onClick={onResetTheme}>
      Reset Theme
    </NekoButton>
  </>);
};

export default Theme;
