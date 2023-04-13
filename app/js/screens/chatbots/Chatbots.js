// Previous: 1.4.4
// Current: 1.4.5

// React & Vendor Libs
import { useState, useMemo } from '@wordpress/element';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Styled from "styled-components";

// NekoUI
import { NekoTabs, NekoTab, NekoWrapper, NekoSwitch, NekoContainer,
  NekoColumn, NekoButton, NekoSelect, NekoOption } from '@neko-ui';
import { useNekoColors } from '@neko-ui';

import { pluginUrl, restUrl, userData, restNonce, session,
  themes as initThemes, chatbots as initChatbots } from '@app/settings';
import i18n from '@root/i18n';
import { retrieveChatbots, retrieveThemes, updateChatbots } from '@app/requests';
import ChatbotParams from '@app/screens/chatbots/ChatbotParams';
import Themes from '@app/screens/chatbots/Themes';
import Chatbot from '@app/chatbot/chatbot';

const StyledShortcode = Styled.div`
  
  pre {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fcff;
    height: 26px;
    color: #779bb8;
    margin: 0px;
    padding: 0px 10px;
    font-size: 13px;
    text-align: center;
    border: 2px solid rgb(210 228 243);
    border-radius: 8px;
    font-family: system-ui;
    cursor: pointer;
  }
`;

const Shortcode = ({ currentChatbot }) => {
  const [ copyMessage, setCopyMessage ] = useState(null);

  const onClick = async () => {
    const text = `[mwai_chatbot_v2 id="${currentChatbot?.chatId}"]`;
    await navigator.clipboard.writeText(text);
    setCopyMessage('Copied!');
    setTimeout(() => {
      setCopyMessage(null);
    }, 1000);
  };

  if (!currentChatbot) {
    return null;
  }

  const jsxShortcode = <span>[mwai_chatbot_v2 id="<span style={{ color: 'var(--neko-green)' }}>{currentChatbot?.chatId}</span>"]</span>;

  return (
    <>
      <pre onClick={onClick}>
        {!copyMessage && jsxShortcode}
        {copyMessage && <span>{copyMessage}</span>}
      </pre>
    </>
  );
};

const Chatbots = (props) => {
  const queryClient = useQueryClient();
  const { colors } = useNekoColors();
  const { options, updateOption, busy } = props;
  const [ mode, setMode ] = useState('chatbots');
  const [ busyAction, setBusyAction ] = useState(false);
  const [ botIndex, setBotIndex ] = useState(0);
  const chatbotDefaults = options?.chatbot_defaults;
  const { data: chatbots } = useQuery({
    queryKey: ['chatbots'], queryFn: retrieveChatbots, initialData: initChatbots
  });
  const { data: themes } = useQuery({
    queryKey: ['themes'], queryFn: retrieveThemes, initialData: initThemes
  });
  const chatId = options?.chatId ?? 'none';
  const isBusy = busy || busyAction;

  const currentChatbot = useMemo(() => {
    if (chatbots) {
      const chatbot = chatbots[botIndex];queryClient
      if (!chatbot) return null;
      return chatbot;
    }
  }, [chatbots, botIndex]);

  const currentTheme = useMemo(() => {
    if (currentChatbot && currentChatbot.themeId === 'none') {
      return null;
    }
    const defaultTheme = themes && themes.find(theme => theme.themeId === 'chatgpt');
    if (themes && currentChatbot) {
      const theme = themes.find(theme => theme.themeId === currentChatbot?.themeId);
      if (!theme) return defaultTheme;
      return theme;
    }
    return defaultTheme;
  }, [currentChatbot, themes]);

  const updateChatbotParams = async (value, id) => {
    setBusyAction(true);
    const newParams = { ...currentChatbot, [id]: value };
    let newChatbots = [...chatbots];
    newChatbots[botIndex] = newParams;
    newChatbots = await updateChatbots(newChatbots);
    queryClient.setQueryData(['chatbots'], newChatbots);
    setBusyAction(false);
  }

  const onChangeTab = (botIndex) => {
    setBotIndex(botIndex);
  }

  const onSwitchTheme = (themeId) => {
    //updateChatbotParams(themeId, 'themeId');
  }

  const addNewChatbot = async () => {
    setBusyAction(true);
    const newChatbots = await updateChatbots([...chatbots, {
      ...chatbotDefaults,
      chatId: 'chatbot-' + (chatbots.length + 1),
      name: 'Chatbot ' + (chatbots.length + 1)
    }]);
    queryClient.setQueryData(['chatbots'], newChatbots);
    setBusyAction(false);
  }

  const deleteCurrentChatbot = async () => {
    setBusyAction(true);
    let newChatbots = [...chatbots];
    newChatbots.splice(botIndex, 1);
    newChatbots = await updateChatbots(newChatbots);
    queryClient.setQueryData(['chatbots'], newChatbots);
    setBusyAction(false);
  }

  return (<>
    <NekoWrapper>

      <NekoColumn minimal fullWidth style={{ margin: 10 }}>
        <NekoContainer contentStyle={{ padding: 10, marginBottom: -20 }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <NekoSwitch style={{ marginRight: 10 }} disabled={isBusy}
              onLabel={i18n.COMMON.THEMES} offLabel={i18n.COMMON.CHATBOTS} width={110}
              onValue="themes" offValue="chatbots"
              checked={mode === 'themes'} onChange={setMode} 
              onBackgroundColor={colors.purple} offBackgroundColor={colors.green}
            />
            <StyledShortcode>
              <Shortcode currentChatbot={currentChatbot} />
            </StyledShortcode>
            <div style={{ flex: 'auto' }}></div>
            <label>{i18n.COMMON.SITE_WIDE_CHAT}:</label>
            <NekoSelect scrolldown style={{ marginLeft: 10 }} name='chatId' disabled={isBusy}
              value={chatId} onChange={updateOption}>
              <NekoOption value='none' label="None" />
              {chatbots?.map(chat => 
                <NekoOption key={chat.chatId} value={chat.chatId} label={chat.name} />)
              }
            </NekoSelect>
          </div>
        </NekoContainer>
      </NekoColumn>

      <NekoColumn minimal style={{ margin: 10 }}>

        <div style={{ display: mode === 'chatbots' ? 'block' : 'none' }}>
          <NekoTabs inversed onChange={onChangeTab}
            action={<>
              <NekoButton className="primary-block" icon='plus' onClick={addNewChatbot} />
              {currentChatbot && currentChatbot.chatId !== 'default' &&
                <NekoButton className="danger" icon='delete' onClick={deleteCurrentChatbot} />
              }
            </>}>
            {chatbots?.map(chatbotParams => <NekoTab key={chatbotParams.chatId} title={chatbotParams.name} busy={busyAction}>
              <ChatbotParams options={options} themes={themes}
                shortcodeParams={chatbotParams} updateShortcodeParams={updateChatbotParams}
              />
            </NekoTab>)}
          </NekoTabs>
        </div>
        <div style={{ display: mode === 'themes' ? 'block' : 'none' }}>
          <Themes themes={themes} options={options} updateOption={updateOption} onSwitchTheme={onSwitchTheme} />
        </div>
      </NekoColumn>
      <NekoColumn minimal>
        <div style={{ position: 'relative', margin: '15px 10px 10px 10px', minHeight: 480, borderRadius: 5,
          padding: 10, border: '2px dashed rgb(0 0 0 / 20%)', background: 'rgb(0 0 0 / 5%)' }}>
          {!!currentChatbot && <Chatbot
            system={{
              chatId: currentChatbot.chatId,
              userData: userData,
              sessionId: session,
              restNonce: restNonce,
              pluginUrl: pluginUrl,
              restUrl: restUrl,
              debugMode: options?.debug_mode,
              typewriter: options?.shortcode_chat_typewriter,
            }}
            params={currentChatbot}
            theme={currentTheme}
            style={currentChatbot.window ? { position: 'absolute' } : {}}
          />}
          </div>
          <div style={{ marginLeft: 10, fontSize: 11 }}>This is the actual chatbot, but there might be some differences when run on your front-end, depending on your theme and the other plugins you use.</div>
      </NekoColumn>
    </NekoWrapper>
  </>);
};

export default Chatbots;