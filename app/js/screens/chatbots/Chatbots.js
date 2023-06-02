// Previous: 1.6.94
// Current: 1.6.98

const { useMemo, useState } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Styled from 'styled-components';

import { NekoTabs, NekoTab, NekoWrapper, NekoSwitch, NekoContainer, NekoSpacer,
  NekoColumn, NekoButton, NekoSelect, NekoOption } from '@neko-ui';

import { pluginUrl, restUrl, userData, restNonce, session, stream,
  themes as initThemes, chatbots as initChatbots } from '@app/settings';
import i18n from '@root/i18n';
import { retrieveChatbots, retrieveThemes, updateChatbots } from '@app/requests';
import ChatbotParams from '@app/screens/chatbots/ChatbotParams';
import Themes from '@app/screens/chatbots/Themes';
import ChatbotSystem from '@app/chatbot/ChatbotSystem';
import { randomHash } from '@app/helpers-admin';

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
  const currentBotId = currentChatbot?.botId ?? 'default';

  const onClick = async () => {
    const text = `[mwai_chatbot_v2 id="${currentBotId}"]`;
    if (!navigator.clipboard) {
      alert("Clipboard is not enabled (only works with https).");
      return;
    }
    await navigator.clipboard.writeText(text);
    setCopyMessage('Copied!');
    setTimeout(() => {
      setCopyMessage(null);
    }, 1000);
  };

  if (!currentChatbot) {
    return null;
  }

  const jsxShortcode = <span>[mwai_chatbot_v2 id="<span style={{ color: 'var(--neko-green)' }}>{currentBotId}</span>"]</span>;

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
  const { options, updateOption, busy } = props;
  const [ chatbotEditor, setChatbotEditor ] = useState(true);
  const [ themeEditor, setThemeEditor ] = useState(false);
  const [ chatbotPreview, setChatbotPreview ] = useState(true);
  const [ busyAction, setBusyAction ] = useState(false);
  const [ currentBotId, setCurrentBotId ] = useState('default');
  const chatbotDefaults = options?.chatbot_defaults;

  const { data: chatbots } = useQuery({
    queryKey: ['chatbots'], queryFn: retrieveChatbots, initialData: initChatbots
  });
  const { data: themes } = useQuery({
    queryKey: ['themes'], queryFn: retrieveThemes, initialData: initThemes
  });
  const botId = options?.botId ?? 'none';
  const isBusy = busy || busyAction;

  const defaultChatbot = useMemo(() => {
    if (chatbots) {
      const chatbot = chatbots.find(chatbot => chatbot.botId === 'default');
      return chatbot;
    }
  }, [chatbots]);

  const currentChatbot = useMemo(() => {
    if (chatbots) {
      const chatbot = chatbots.find(chatbot => chatbot.botId === currentBotId);
      return chatbot;
    }
  }, [chatbots, currentBotId]);

  const currentTheme = useMemo(() => {
    if (themes && currentChatbot) {
      let chatTheme = themes.find(theme => theme.themeId === currentChatbot?.themeId);
      return chatTheme;
    }
    return themes.find(theme => theme.themeId === 'chatgpt');
  }, [currentChatbot, themes, chatbots]);

  const updateChatbotParams = async (value, id) => {
    if ( id === 'botId' && value === 'default' ) {
      alert("You cannot name a chatbot 'default'. Please choose another name.");
      return;
    }

    if ( id === 'botId' && value === '' ) {
      alert("Your chatbot must have an ID.");
      return;
    }

    setBusyAction(true);
    const newParams = { ...currentChatbot, [id]: value };
    let newChatbots = [...chatbots];
    const botIndex = newChatbots.findIndex(x => x.botId === currentChatbot.botId);
    newChatbots[botIndex] = newParams;
    newChatbots = await updateChatbots(newChatbots);
    queryClient.setQueryData(['chatbots'], newChatbots);
    setBusyAction(false);
  }

  const onChangeTab = (_themeIndex, attributes) => {
    setCurrentBotId(attributes.key);
  }

  const onSwitchTheme = (themeId) => {
    updateChatbotParams(themeId, 'themeId');
  }

  const addNewChatbot = async (defaults = chatbotDefaults) => {
    setBusyAction(true);
    const newName = 'New Chatbot';
    const newChatId = 'chatbot-' + randomHash();
    const newChatbots = await updateChatbots([...chatbots, {
      ...defaults, botId: newChatId, name: newName
    }]);
    queryClient.setQueryData(['chatbots'], newChatbots);
    setBusyAction(false);
  }

  const deleteCurrentChatbot = async () => {
    setBusyAction(true);
    let newChatbots = [...chatbots.filter(x => x.botId !== currentChatbot.botId)];
    setCurrentBotId('default');
    newChatbots = await updateChatbots(newChatbots);
    queryClient.setQueryData(['chatbots'], newChatbots);
    setBusyAction(false);
  }

  const resetCurrentChatbot = async () => {
    setBusyAction(true);
    let newChatbots = [...chatbots];
    const botIndex = newChatbots.findIndex(x => x.botId === currentChatbot.botId);
    newChatbots[botIndex] = { ...chatbotDefaults, botId: currentChatbot.botId, name: currentChatbot.name };
    newChatbots = await updateChatbots(newChatbots);
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
            <label>{i18n.COMMON.SITE_WIDE_CHAT}:</label>
            <NekoSelect scrolldown style={{ marginLeft: 10 }} name='botId' disabled={isBusy}
              value={botId} onChange={updateOption}>
              <NekoOption value='none' label="None" />
              {chatbots?.map(chat => 
                <NekoOption key={chat.botId} value={chat.botId} label={chat.name} />)
              }
            </NekoSelect>
            <div style={{ flex: 'auto' }}></div>
            <label>{i18n.COMMON.CHATBOT_EDITOR}:</label>
            <NekoSwitch style={{ marginLeft: 10 }} disabled={isBusy}
              onLabel={''} offLabel={''} width={50}
              checked={chatbotEditor} onChange={setChatbotEditor} 
            />
            <label style={{ marginLeft: 10 }}>{i18n.COMMON.THEME_EDITOR}:</label>
            <NekoSwitch style={{ marginLeft: 10 }} disabled={isBusy}
              onLabel={''} offLabel={''} width={50}
              checked={themeEditor} onChange={setThemeEditor}
            />
            <label style={{ marginLeft: 10 }}>{i18n.COMMON.PREVIEW}:</label>
            <NekoSwitch style={{ marginLeft: 10 }} disabled={isBusy}
              onLabel={''} offLabel={''} width={50}
              checked={chatbotPreview} onChange={setChatbotPreview}
            />
            <StyledShortcode style={{ marginLeft: 10 }}>
              <Shortcode currentChatbot={currentChatbot} />
            </StyledShortcode>
          </div>
        </NekoContainer>
      </NekoColumn>

      {(chatbotEditor || themeEditor) && <NekoColumn minimal style={{ margin: 10 }}>

        {chatbotEditor && <NekoTabs inversed onChange={onChangeTab} currentTab={currentBotId}
          action={<><NekoButton className="primary-block" icon='plus' onClick={() => addNewChatbot()} /></>}>
          {chatbots?.map(chatbotParams => <NekoTab key={chatbotParams.botId} title={chatbotParams.name} busy={busyAction}>
            <ChatbotParams options={options} themes={themes} defaultChatbot={defaultChatbot}
              deleteCurrentChatbot={deleteCurrentChatbot} resetCurrentChatbot={resetCurrentChatbot}
              duplicateCurrentChatbot={duplicateCurrentChatbot}
              shortcodeParams={chatbotParams} updateShortcodeParams={updateChatbotParams}
            />
          </NekoTab>)}
        </NekoTabs>}

        {chatbotEditor && themeEditor && <NekoSpacer large />}
    
        {themeEditor && <Themes themes={themes}
          options={options} updateOption={updateOption}
          currentTheme={currentTheme}
          onSwitchTheme={onSwitchTheme}
        />}

      </NekoColumn>}
      
      {chatbotPreview && <NekoColumn minimal>
        <small style={{ marginLeft: 15, marginBottom: -20 }}>
          Chatbot: <b>{currentChatbot?.name}</b> - Theme: <b>{currentTheme?.name}</b>
        </small>
        <div style={{ position: 'relative', margin: '5px 10px 10px 10px', minHeight: 480, borderRadius: 5,
          padding: 10, border: '2px dashed rgb(0 0 0 / 20%)', background: 'rgb(0 0 0 / 5%)' }}>
          {!!currentChatbot && <ChatbotSystem
            system={{
              botId: currentChatbot.botId,
              userData: userData,
              sessionId: session,
              restNonce: restNonce,
              pluginUrl: pluginUrl,
              restUrl: restUrl,
              stream: stream,
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
      </NekoColumn>}

    </NekoWrapper>
  </>);
};

export default Chatbots;