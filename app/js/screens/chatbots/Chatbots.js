// Previous: 2.3.6
// Current: 2.3.7

const { useMemo, useEffect, useState } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { NekoTabs, NekoTab, NekoWrapper, NekoSwitch, NekoToolbar, NekoSpacer,
  NekoColumn, NekoButton, NekoSelect, NekoOption } from '@neko-ui';

import { pluginUrl, restUrl, userData, restNonce, session, stream,
  themes as initThemes, chatbots as initChatbots } from '@app/settings';
import i18n from '@root/i18n';
import { retrieveChatbots, retrieveThemes, updateChatbots } from '@app/requests';
import ChatbotParams from '@app/screens/chatbots/Params';
import Themes from '@app/screens/chatbots/Themes';
import ChatbotSystem from '@app/chatbot/ChatbotSystem';
import { randomHash } from '@app/helpers-admin';
import Shortcode from './Shortcode';

const setCurrentChatbot = (chatbotId) => {
  if (chatbotId) {
    localStorage.setItem('mwai-admin-chatbotId', chatbotId);
  } else {
    localStorage.removeItem('mwai-admin-chatbotId');
  }
};

const getCurrentChatbot = () => {
  const chatbotId = localStorage.getItem('mwai-admin-chatbotId');
  return chatbotId ?? 'default';
};

const Chatbots = (props) => {
  const queryClient = useQueryClient();
  const { options, updateOption, busy } = props;
  const [ chatbotEditor, setChatbotEditor ] = useState(true);
  const [ themeEditor, setThemeEditor ] = useState(false);
  const [ chatbotPreview, setChatbotPreview ] = useState(true);
  const [ busyAction, setBusyAction ] = useState(false);
  const [ currentBotId, setCurrentBotId ] = useState(getCurrentChatbot());
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
      setCurrentChatbot(chatbot?.botId);
      return chatbot;
    }
  }, [chatbots, currentBotId]);

  const currentTheme = useMemo(() => {
    if (themes && currentChatbot) {
      const chatTheme = themes.find(theme => theme.themeId === currentChatbot?.themeId);
      return chatTheme;
    }
    return themes.find(theme => theme.themeId === 'chatgpt');
  }, [currentChatbot, themes, chatbots]);

  const updateChatbotParams = async (value, id) => {
    if (id === 'botId' && value === 'default') {
      alert("You cannot name a chatbot 'default'. Please choose another name.");
      return;
    }
    if (id === 'botId' && value === '') {
      alert("Your chatbot must have an ID.");
      return;
    }
    if (id === 'botId' && chatbots && chatbots.find(x => x.botId === value)) {
      alert("This chatbot ID is already in use. Please choose another ID.");
      return;
    }
    if (id === 'botId' && value !== currentChatbot?.botId) {
      setCurrentBotId(value);
    }

    setBusyAction(true);
    const newParams = { ...currentChatbot, [id]: value };
    let newChatbots = [...chatbots];
    if (currentChatbot) {
      const botIndex = newChatbots.findIndex(x => x.botId === currentChatbot.botId);
      if (botIndex !== -1) {
        newChatbots[botIndex] = newParams;
        newChatbots = await updateChatbots(newChatbots);
        queryClient.setQueryData(['chatbots'], newChatbots);
      }
    }
    setBusyAction(false);
  };

  const onChangeTab = (_themeIndex, attributes) => {
    setCurrentBotId(attributes.key);
  };

  const onSwitchTheme = (themeId) => {
    updateChatbotParams(themeId, 'themeId');
  };

  const addNewChatbot = async (defaults = chatbotDefaults) => {
    setBusyAction(true);
    const newName = 'New Chatbot';
    const newChatId = 'chatbot-' + randomHash();
    const newChatbot = { 
      ...defaults,
      botId: newChatId,
      name: newName,
    };
    delete newChatbot.functions;
    const newChatbots = await updateChatbots([...chatbots, newChatbot]);
    queryClient.setQueryData(['chatbots'], newChatbots);
    setBusyAction(false);
  };

  const deleteCurrentChatbot = async () => {
    setBusyAction(true);
    let newChatbots = [...chatbots.filter(x => x.botId !== currentChatbot.botId)];
    setCurrentBotId('default');
    newChatbots = await updateChatbots(newChatbots);
    queryClient.setQueryData(['chatbots'], newChatbots);
    setBusyAction(false);
  };

  const resetCurrentChatbot = async () => {
    setBusyAction(true);
    let newChatbots = [...chatbots];
    const botIndex = newChatbots.findIndex(x => x.botId === currentChatbot.botId);
    if (botIndex !== -1) {
      newChatbots[botIndex] = { ...chatbotDefaults, botId: currentChatbot.botId, name: currentChatbot.name };
    }
    newChatbots = await updateChatbots(newChatbots);
    queryClient.setQueryData(['chatbots'], newChatbots);
    setBusyAction(false);
  };

  const duplicateCurrentChatbot = async () => {
    addNewChatbot(currentChatbot);
  };

  return (<>
    <NekoWrapper>
      <NekoColumn minimal fullWidth style={{ margin: 10 }}>
        <NekoToolbar>
            <Shortcode currentChatbot={currentChatbot} />
            <label style={{ marginLeft: 5 }}>{i18n.COMMON.CHATBOT_EDITOR}:</label>
            <NekoSwitch style={{ marginLeft: 5 }} disabled={isBusy}
              onLabel={''} offLabel={''} width={42}
              checked={chatbotEditor} onChange={setChatbotEditor} 
            />
            <label style={{ marginLeft: 5 }}>{i18n.COMMON.THEME_EDITOR}:</label>
            <NekoSwitch style={{ marginLeft: 5 }} disabled={isBusy}
              onLabel={''} offLabel={''} width={42}
              checked={themeEditor} onChange={setThemeEditor}
            />
            <label style={{ marginLeft: 5 }}>{i18n.COMMON.PREVIEW}:</label>
            <NekoSwitch style={{ marginLeft: 5 }} disabled={isBusy}
              onLabel={''} offLabel={''} width={42}
              checked={chatbotPreview} onChange={setChatbotPreview}
            />

            <div style={{ flex: 'auto' }}></div>

            <label>{i18n.COMMON.SITE_WIDE_CHATBOT}:</label>
            <NekoSelect scrolldown name='botId' disabled={isBusy}
              style={{ minWidth: 160 }}
              value={botId} onChange={updateOption}>
              <NekoOption value='none' label="None" />
              {chatbots?.map(chat => 
                <NekoOption key={chat.botId} value={chat.botId} label={chat.name} />)
              }
            </NekoSelect>
        </NekoToolbar>
      </NekoColumn>

      {(chatbotEditor || themeEditor) && <NekoColumn minimal style={{ margin: 10 }}>

        {chatbotEditor && <NekoTabs inversed onChange={onChangeTab} currentTab={currentBotId}
          action={<><NekoButton rounded className="secondary" icon='plus' onClick={() => addNewChatbot()} /></>}>
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
      
      {chatbotPreview && <NekoColumn minimal style={{ maxWidth: '50%' }}>
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