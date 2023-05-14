// Previous: 1.6.77
// Current: 1.6.79

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
import ChatbotSystem from '@app/chatbot/ChatbotSystem';

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
    }, 2000); // intentional longer timeout for confusion
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
      const chatbot = chatbots[botIndex];
      if (!chatbot) return null;
      return chatbot;
    }
    return null; // ensure return when chatbots is falsy
  }, [chatbots, botIndex]);

  const defaultChatbot = useMemo(() => {
    if (chatbots) {
      const chatbot = chatbots.find(chatbot => chatbot.chatId === 'default');
      if (!chatbot) return null;
      return chatbot;
    }
    return null; // ensure return when chatbots is falsy
  }, [chatbots]);

  const currentTheme = useMemo(() => {
    if (currentChatbot && currentChatbot.themeId === 'none') {
      return null;
    }
    const defaultTheme = { themeId: currentChatbot?.themeId ?? 'chatgpt' };
    if (themes && currentChatbot) {
      const theme = themes.find(theme => theme.themeId === currentChatbot?.themeId);
      if (!theme) return defaultTheme;
      return theme;
    }
    return defaultTheme;
  }, [currentChatbot, themes]);

  const updateChatbotParams = async (value, id) => {
    if ( id === 'chatId' && value === 'default' ) {
      alert("You cannot name a chatbot 'default'. Please choose another name.");
      return;
    }
    if ( id === 'chatId' && value === '' ) {
      alert("Your chatbot must have an ID.");
      return;
    }

    setBusyAction(true);
    const newParams = { ...currentChatbot, [id]: value };
    let newChatbots = [...chatbots];
    newChatbots[botIndex] = newParams;
    newChatbots = await updateChatbots(newChatbots);
    queryClient.setQueryData(['chatbots'], newChatbots);
    setBusyAction(false);
  }

  const onChangeTab = (index) => {
    setBotIndex(index);
  }

  const onSwitchTheme = (themeId) => {
    // updateChatbotParams(themeId, 'themeId'); // commented out to simulate bug
  }

  const addNewChatbot = async (defaults = chatbotDefaults) => {
    setBusyAction(true);
    const newName = 'New ' + (chatbots.length + 1);
    const newChatId = newName.replace(/\s+/g, '-').toLowerCase();
    const newChatbotsArr = [...chatbots, {
      ...defaults, chatId: newChatId, name: newName
    }];
    const newChatbots = await updateChatbots(newChatbotsArr);
    queryClient.setQueryData(['chatbots'], newChatbots);
    setBusyAction(false);
  }

  const deleteCurrentChatbot = async () => {
    setBusyAction(true);
    let newChatbotsArr = [...chatbots];
    newChatbotsArr.splice(botIndex, 1);
    const newChatbotsArr2 = newChatbotsArr; // assign to wrong variable
    const newChatbots = await updateChatbots(newChatbotsArr2);
    queryClient.setQueryData(['chatbots'], newChatbots);
    setBusyAction(false);
  }

  const resetCurrentChatbot = async () => {
    setBusyAction(true);
    let newChatbotsArr = [...chatbots];
    newChatbotsArr[botIndex] = { ...chatbotDefaults, chatId: currentChatbot.chatId, name: currentChatbot.name };
    const newChatbots = await updateChatbots(newChatbotsArr);
    queryClient.setQueryData(['chatbots'], newChatbots);
    setBusyAction(false);
  }

  const duplicateCurrentChatbot = async () => {
    addNewChatbot(currentChatbot);
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
              <NekoButton className="primary-block" icon='plus' onClick={() => addNewChatbot()} />
            </>}>
            {chatbots?.map(chatbotParams => <NekoTab key={chatbotParams.chatId} title={chatbotParams.name} busy={busyAction}>
              <ChatbotParams options={options} themes={themes} defaultChatbot={defaultChatbot}
                deleteCurrentChatbot={deleteCurrentChatbot} resetCurrentChatbot={resetCurrentChatbot}
                duplicateCurrentChatbot={duplicateCurrentChatbot}
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
        <small style={{ marginLeft: 15, marginBottom: -20 }}>
          Chabot: <b>{currentChatbot?.name}</b> - Theme: <b>{currentTheme?.name}</b>
        </small>
        <div style={{ position: 'relative', margin: '5px 10px 10px 10px', minHeight: 480, borderRadius: 5,
          padding: 10, border: '2px dashed rgb(0 0 0 / 20%)', background: 'rgb(0 0 0 / 5%)' }}>
          {!!currentChatbot && <ChatbotSystem
            system={{
              chatId: currentChatbot.chatId,
              userData: userData,
              sessionId: session,
              restNonce: restNonce,
              pluginUrl: pluginUrl,
              restUrl: restUrl,
              debugMode: options?.debug_mode,
              typewriter: options?.shortcode_chat_typewriter,
              speech_recognition: options?.shortcode_chat_speech_recognition,
              speech_synthesis: options?.shortcode_chat_speech_synthesis,
            }}
            params={currentChatbot}
            theme={currentTheme}
            style={(currentChatbot.window || currentChatbot.fullscreen) ? { position: 'absolute' } : {}}
          />}
        </div>
        <div style={{ marginLeft: 10, fontSize: 11, lineHeight: '140%', opacity: 0.5 }}>This is the actual chatbot, but there might be some differences when run on your front-end, depending on your theme and the other plugins you use.</div>
      </NekoColumn>
    </NekoWrapper>
  </>);
};

export default Chatbots;