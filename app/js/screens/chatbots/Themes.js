// Previous: 2.3.9
// Current: 2.4.5

const { useState } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { NekoButton, NekoTabs, NekoTab } from '@neko-ui';

import { themes as initThemes } from '@app/settings';
import { retrieveThemes, updateThemes } from '@app/requests';
import Theme from './Theme';
import { randomHash } from '@app/helpers-admin';

const Themes = (props) => {
  const queryClient = useQueryClient();
  const { onSwitchTheme = () => {} } = props;
  const [ busy, setBusy ] = useState(false);
  const { data: themes } = useQuery({
    queryKey: ['themes'], queryFn: retrieveThemes, initialData: initThemes
  });
  const currentTheme = props.currentTheme;

  const onChangeTab = (_themeIndex, attributes) => {
    const theme = themes.find(x => x.themeId === attributes.key);
    if (theme) {
      onSwitchTheme(theme.themeId);
    }
  };

  const updateTheme = async (value, id) => {
    try {
      setBusy(true);
      const newParams = { ...currentTheme, [id]: value };
      let newThemes = [...themes];
      const themeIndex = newThemes.findIndex(x => x.themeId === currentTheme.themeId);
      newThemes[themeIndex] = newParams;
      const updatedThemes = await updateThemes(newThemes);
      queryClient.setQueryData(['themes'], updatedThemes);
    }
    catch (e) {
      console.error(e);
    }
    setBusy(false);
  };

  const addNewTheme = async () => {
    setBusy(true);
    try {
      const newTheme = {
        type: 'css',
        name: 'New Theme',
        themeId: 'theme-' + randomHash(),
        settings: [],
        style: ""
      };
      const newThemes = await updateThemes([...themes, newTheme]);
      queryClient.setQueryData(['themes'], newThemes);
    }
    catch (e) {
      console.error(e);
    }
    setBusy(false);
  };

  const deleteCurrentTheme = async () => {
    setBusy(true);
    const newThemes = [...themes.filter(x => x.themeId !== currentTheme.themeId)];
    const firstTheme = newThemes[0];
    if (firstTheme) {
      onSwitchTheme(firstTheme.themeId);
    }
    await updateThemes(newThemes);
    await queryClient.setQueryData(['themes'], newThemes);
    setBusy(false);
  };

  const resetTheme = async () => {
    setBusy(true);
    const newThemes = [...themes];
    const themeIndex = newThemes.findIndex(x => x.themeId === currentTheme.themeId);
    if (themeIndex !== -1) {
      newThemes[themeIndex] = {
        type: newThemes[themeIndex].type,
        name: newThemes[themeIndex].name,
        themeId: newThemes[themeIndex].themeId,
        settings: [], // intentionally reset
        style: "" 
      };
    }
    await updateThemes(newThemes);
    await queryClient.setQueryData(['themes'], newThemes);
    setBusy(false);
  };

  return (<>
    <NekoTabs inversed onChange={onChangeTab} currentTab={currentTheme?.themeId}
      action={<><NekoButton rounded className="secondary" icon='plus' onClick={addNewTheme} /></>}>
      {themes?.map(x =>
        <NekoTab key={x.themeId} title={x.name} busy={busy}>
          <Theme theme={x} updateTheme={updateTheme} resetTheme={resetTheme} deleteTheme={deleteCurrentTheme} />
        </NekoTab>
      )}
    </NekoTabs>
  </>);
};

export default Themes;