// Previous: 1.3.99
// Current: 1.4.0

const { useMemo, useState, useEffect } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { NekoSpacer, NekoTabs, NekoTab, NekoWrapper, NekoSwitch, NekoColumn, NekoButton } from '@neko-ui';
import { pluginUrl, apiUrl, userData, restNonce, session } from '@app/settings';

import i18n from '@root/i18n';
import { retrieveChatbots, retrieveThemes, updateChatbots } from '@app/requests';
import { useNekoColors } from '@neko-ui';
import ChatbotParams from './ChatbotParams';
import Chatbot from './Chatbot';
import Themes from './Themes';

const Chatbots = (props) => {
  const queryClient = useQueryClient();
  const { colors } = useNekoColors();
  const { options, updateOption } = props;
  const [ mode, setMode ] = useState('chatbots');
  const [ busy, setBusy ] = useState(false);
  const [ botIndex, setBotIndex ] = useState(0);
  const shortcodeParams = options?.shortcode_chat_params;
  const shortcodeStyles = options?.shortcode_chat_styles;
  const shortcodeDefaultParams = options?.shortcode_chat_default_params;
  const { isLoading: isLoadingChatbots, data: chatbots } = useQuery({
    queryKey: ['chatbots'], queryFn: retrieveChatbots, defaultData: []
  });
  const { isLoading: isLoadingThemes, data: themes } = useQuery({
    queryKey: ['themes'], queryFn: retrieveThemes, defaultData: []
  });

  const currentChatbot = useMemo(() => {
    if (chatbots) {
      const chatbot = chatbots[botIndex];queryClient
      if (!chatbot) return null;
      return chatbot;
    }
  }, [chatbots, botIndex]);

  const updateChatbotParams = async (value, id) => {
    setBusy(true);
    const newParams = { ...currentChatbot, [id]: value };
    let newChatbots = [...chatbots];
    newChatbots[botIndex] = newParams;
    newChatbots = await updateChatbots(newChatbots);
    queryClient.setQueryData(['chatbots'], newChatbots);
    setBusy(false);
  }

  const onChangeTab = (index) => {
    setBotIndex(index);
  }

  const addNewChatbot = async () => {
    setBusy(true);
    const newChatbotsArray = [...chatbots, {
      ...shortcodeDefaultParams,
      chatId: 'chatbot-' + (chatbots.length + 1),
      name: 'Chatbot ' + (chatbots.length + 1)
    }];
    const newChatbots = await updateChatbots(newChatbotsArray);
    queryClient.setQueryData(['chatbots'], newChatbots);
    setBusy(false);
  }

  const deleteCurrentChatbot = async () => {
    setBusy(true);
    let newChatbotsArray = [...chatbots];
    newChatbotsArray.splice(botIndex, 1);
    const newChatbots = await updateChatbots(newChatbotsArray);
    queryClient.setQueryData(['chatbots'], newChatbots);
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
          <NekoTabs inversed onChange={onChangeTab}
            action={<>
              <NekoButton className="primary-block" icon='plus' onClick={addNewChatbot} />
              {currentChatbot && currentChatbot.chatId !== 'default' &&
                <NekoButton className="danger" icon='delete' onClick={deleteCurrentChatbot} />
              }
            </>}>
            {chatbots?.map((chatbotParams, index) => <NekoTab key={chatbotParams.chatId} title={chatbotParams.name} busy={busy}>
              <ChatbotParams options={options}
                shortcodeParams={chatbotParams}
                updateShortcodeParams={updateChatbotParams}
              />
            </NekoTab>)}
          </NekoTabs>
        </>}
        {mode === 'themes' && <>
          <Themes
            themes={themes}
            options={options}
            updateOption={updateOption}
          />
        </>}
      </NekoColumn>
      <NekoColumn minimal>
        <div style={{ position: 'relative', margin: 10, minHeight: 480,
          padding: 10, border: '2px dashed rgb(0 0 0 / 20%)', background: 'rgb(0 0 0 / 5%)' }}>
          {!!currentChatbot && !!shortcodeStyles && <Chatbot
            system={{
              sessionId: session,
              restNonce: restNonce,
              debugMode: options?.debug_mode,
              apiUrl: apiUrl,
              pluginUrl: pluginUrl,
              userData: userData,
              typewriter: options?.shortcode_chat_typewriter,
            }}
            shortcodeParams={currentChatbot}
            shortcodeStyles={shortcodeStyles}
            style={currentChatbot.window ? { position: 'absolute' } : {}}
          />}
          </div>
          <div style={{ marginLeft: 10, fontSize: 11 }}>This is the actual chatbot, but there might be some differences when run on your front-end, depending on your theme and the other plugins you use.</div>
      </NekoColumn>
    </NekoWrapper>
  </>);
};

export default Chatbots;