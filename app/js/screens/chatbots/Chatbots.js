// Previous: 2.8.2
// Current: 2.8.5

const { useMemo, useState, useEffect } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { NekoTabs, NekoTab, NekoWrapper, NekoSwitch, NekoToolbar, NekoContainer,
  NekoColumn, NekoButton, NekoSelect, NekoOption, useNekoColors } from '@neko-ui';

import { pluginUrl, restUrl, userData, restNonce, session, stream,
  themes as initThemes, chatbots as initChatbots } from '@app/settings';
import i18n from '@root/i18n';
import { retrieveChatbots, retrieveThemes, updateChatbots } from '@app/requests';
import ChatbotParams from '@app/screens/chatbots/Params';
import Themes from '@app/screens/chatbots/Themes';
import ChatbotSystem from '@app/chatbot/ChatbotSystem';
import { randomHash } from '@app/helpers-admin';
import Shortcode from './Shortcode';
import Discussions from '@app/screens/discussions/Discussions';

const setCurrentChatbotKey = (key) => {
  if (key) {
    localStorage.setItem('mwai-admin-chatbotKey', key);
    return;
  }
  localStorage.removeItem('mwai-admin-chatbotKey');
};

const getCurrentChatbotKey = () => {
  return localStorage.getItem('mwai-admin-chatbotKey');
};

const Chatbots = (props) => {
  const queryClient = useQueryClient();
  const { options, updateOption, busy } = props;
  const [ editor, setEditor ] = useState('chatbots');
  const [ busyAction, setBusyAction ] = useState(false);
  const [ currentKey, setCurrentKey ] = useState(() => getCurrentChatbotKey() || 'chatbot-key-0');
  const chatbotDefaults = options?.chatbot_defaults;
  const { colors } = useNekoColors();

  const { data: chatbots } = useQuery({
    queryKey: ['chatbots'], queryFn: retrieveChatbots, initialData: initChatbots
  });
  const { data: themes } = useQuery({
    queryKey: ['themes'], queryFn: retrieveThemes, initialData: initThemes
  });
  const botId = options?.botId ?? 'none';
  const chatbotSelect = options?.chatbot_select ?? 'tabs';
  const isBusy = busy || busyAction;

  const [keyToBotId, setKeyToBotId] = useState({});

  useEffect(() => {
    if (chatbots) {
      const newKeyToBotId = {};
      chatbots.forEach((chatbot, index) => {
        newKeyToBotId[`chatbot-key-${index}`] = chatbot.botId;
      });
      setKeyToBotId(newKeyToBotId);
      if (!currentKey || !(currentKey in newKeyToBotId)) {
        const firstKey = Object.keys(newKeyToBotId)[0];
        setCurrentKey(firstKey);
        setCurrentChatbotKey(firstKey);
      }
    }
  }, [chatbots, currentKey]);

  const defaultChatbot = useMemo(() => {
    if (chatbots) {
      const chatbot = chatbots.find(chatbot => chatbot.botId === 'default');
      return chatbot;
    }
  }, [chatbots]);

  const currentChatbot = useMemo(() => {
    if (chatbots && currentKey && keyToBotId[currentKey]) {
      const botId = keyToBotId[currentKey];
      return chatbots.find(chatbot => chatbot.botId === botId);
    }
    return null;
  }, [chatbots, currentKey, keyToBotId]);

  const currentTheme = useMemo(() => {
    if (themes && currentChatbot) {
      const chatTheme = themes.find(theme => theme.themeId === currentChatbot?.themeId);
      return chatTheme;
    }
    return themes.find(theme => theme.themeId === 'chatgpt');
  }, [currentChatbot, themes]);

  const updateChatbotParams = async (value, id) => {
    if (id === 'botId' && value === 'default') {
      alert("You cannot name a chatbot 'default'. Please choose another name.");
      return;
    }
    if (id === 'botId' && value === '') {
      alert("Your chatbot must have an ID.");
      return;
    }
    if (id === 'botId' && chatbots.find(x => x.botId === value)) {
      alert("This chatbot ID is already in use. Please choose another ID.");
      return;
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
        if (id === 'botId') {
          setKeyToBotId(prev => ({...prev, [currentKey]: value}));
        }
      }
    }
    setBusyAction(false);
  };

  const onChangeTab = (_themeIndex, attributes) => {
    setCurrentKey(attributes.key);
    setCurrentChatbotKey(attributes.key);
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
    const newKey = `chatbot-key-${Object.keys(keyToBotId).length}`;
    setKeyToBotId(prev => ({...prev, [newKey]: newChatId}));
    setCurrentKey(newKey);
    setCurrentChatbotKey(newKey);
    setBusyAction(false);
  };

  const deleteCurrentChatbot = async () => {
    setBusyAction(true);
    const currentBotId = keyToBotId[currentKey];

    const keys = Object.keys(keyToBotId);
    const index = keys.indexOf(currentKey);

    let newCurrentKey;
    if (index > 0) {
      newCurrentKey = keys[index - 1];
    } else if (keys.length > 1) {
      newCurrentKey = keys[index + 1];
    } else {
      newCurrentKey = null;
    }

    setCurrentKey(newCurrentKey);
    setCurrentChatbotKey(newCurrentKey);

    let newChatbots = chatbots.filter((x) => x.botId !== currentBotId);
    newChatbots = await updateChatbots(newChatbots);
    queryClient.setQueryData(['chatbots'], newChatbots);

    const newKeyToBotId = { ...keyToBotId };
    delete newKeyToBotId[currentKey];
    setKeyToBotId(newKeyToBotId);

    setBusyAction(false);
  };

  const resetCurrentChatbot = async () => {
    setBusyAction(true);
    let newChatbots = [...chatbots];
    const botIndex = newChatbots.findIndex(x => x.botId === currentChatbot.botId);
    newChatbots[botIndex] = { ...chatbotDefaults, botId: currentChatbot.botId, name: currentChatbot.name };
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
          <label style={{ marginLeft: 5 }}>{i18n.COMMON.CHATBOTS}</label>
          <NekoSwitch style={{ marginLeft: 5 }} disabled={isBusy}
            onLabel={''} offLabel={''} width={42}
            offValue='chatbots' onValue='themes'
            offBackgroundColor={colors.blue} onBackgroundColor={colors.purple}
            checked={editor === 'themes'} onChange={setEditor}
          />
          <label style={{ marginLeft: 5 }}>{i18n.COMMON.THEMES}</label>
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

      <NekoColumn minimal style={{ margin: 10, maxWidth: '50%' }}>

        {editor === 'chatbots' && <>

          {chatbotSelect === 'dropdown' && <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
              <NekoSelect scrolldown textFiltering name='botId' disabled={isBusy}
                style={{ flex: 'auto', marginRight: 10 }}
                value={currentKey} onChange={setCurrentKey}>
                {chatbots?.map((chat, index) =>
                  <NekoOption key={chat.botId} value={`chatbot-key-${index}`} label={chat.name} />)
                }
              </NekoSelect>
              <NekoButton rounded className="secondary" icon='plus' disabled={isBusy}
                onClick={() => addNewChatbot()}
              />
            </div>

            {currentChatbot && <NekoContainer style={{ borderRadius: 10 }}>
              <ChatbotParams style={{ margin: '-10px -10px' }}
                options={options}
                themes={themes}
                defaultChatbot={defaultChatbot}
                deleteCurrentChatbot={deleteCurrentChatbot}
                resetCurrentChatbot={resetCurrentChatbot}
                duplicateCurrentChatbot={duplicateCurrentChatbot}
                shortcodeParams={currentChatbot}
                updateShortcodeParams={updateChatbotParams}
              />
            </NekoContainer>}
          </>}

          {chatbotSelect === 'tabs' && <>
            <NekoTabs inversed onChange={onChangeTab} currentTab={currentKey}
              action={<NekoButton rounded className="secondary" icon='plus' disabled={isBusy}
                onClick={() => addNewChatbot()}
              />}>
              {Object.entries(keyToBotId).map(([key, botId]) => {
                const chatbotParams = chatbots.find(c => c.botId === botId);
                return (
                  <NekoTab key={key} title={chatbotParams.name} busy={busyAction}>
                    <ChatbotParams
                      options={options}
                      themes={themes}
                      defaultChatbot={defaultChatbot}
                      deleteCurrentChatbot={deleteCurrentChatbot}
                      resetCurrentChatbot={resetCurrentChatbot}
                      duplicateCurrentChatbot={duplicateCurrentChatbot}
                      shortcodeParams={chatbotParams}
                      updateShortcodeParams={updateChatbotParams}
                    />
                  </NekoTab>
                );
              })}
            </NekoTabs>
          </>}

        </>}

        {editor === 'themes' && <Themes themes={themes}
          options={options} updateOption={updateOption}
          currentTheme={currentTheme}
          onSwitchTheme={onSwitchTheme}
        />}

      </NekoColumn>

      <NekoColumn minimal style={{ maxWidth: '50%' }}>
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
              eventLogs: options?.event_logs,
              typewriter: options?.chatbot_typewriter,
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