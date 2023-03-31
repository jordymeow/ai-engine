// Previous: 1.3.91
// Current: 1.3.92

// React & Vendor Libs
const { useMemo, useState, useEffect } = wp.element;

// NekoUI
import { NekoSpacer, NekoTabs, NekoTab, NekoWrapper, NekoSwitch, NekoColumn } from '@neko-ui';
import { pluginUrl, apiUrl, userData, restNonce, session, options } from '@app/settings';

import i18n from '@root/i18n';
import { useNekoColors } from '@neko-ui';
import ChatbotParams from './ChatbotParams';
import Chatbot from './Chatbot';
import Themes from './Themes';

const Chatbots = (props) => {
  const { colors } = useNekoColors();
  const { options, updateOption } = props;
  const [ mode, setMode ] = useState('chatbots');
  const [ busy, setBusy ] = useState(false);
  const shortcodeParams = options?.shortcode_chat_params;
  const shortcodeStyles = options?.shortcode_chat_styles;

  const updateShortcodeParams = async (value, id) => {
    setBusy(true);
    const newParams = { ...shortcodeParams, [id]: value };
    await updateOption(newParams, 'shortcode_chat_params');
    setBusy(false);
  }

  return (<>
    <NekoWrapper>
      <NekoColumn minimal style={{ margin: 10 }}>

        <NekoSwitch style={{ marginRight: 10 }} disabled={busy}
          onLabel={i18n.COMMON.THEMES} offLabel={i18n.COMMON.CHATBOTS} width={110}
          onValue="themes" offValue="chatbots"
          checked={mode === 'themes'} onChange={setMode} 
          onBackgroundColor={colors.purple} offBackgroundColor={colors.green}
        />

        <NekoSpacer medium />

        {mode === 'chatbots' && <>
          <NekoTabs inversed>
            <NekoTab title="Default" busy={busy}>
              <ChatbotParams options={options}
                shortcodeParams={shortcodeParams}
                updateShortcodeParams={updateShortcodeParams}
              />
            </NekoTab>
            <NekoTab title="+">
            </NekoTab>
          </NekoTabs>
        </>}
        {mode === 'themes' && <>
          <Themes
            options={options}
            updateOption={updateOption}
          />
        </>}
      </NekoColumn>
      <NekoColumn minimal style={{ margin: 10 }}>
          <Chatbot
            system={{
              sessionId: session,
              restNonce: restNonce,
              debugMode: options?.debug_mode,
              apiUrl: apiUrl,
              pluginUrl: pluginUrl,
              userData: userData,
              typewriter: options?.shortcode_chat_typewriter,
            }}
            shortcodeParams={shortcodeParams}
            shortcodeStyles={shortcodeStyles}
          />
      </NekoColumn>
    </NekoWrapper>
  </>);
};

export default Chatbots;
