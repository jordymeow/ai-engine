// Previous: 1.4.0
// Current: 1.4.1

const { useState, useMemo } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { NekoButton, NekoTabs, NekoTab } from '@neko-ui';

import { themes as initThemes } from '@app/settings';
import { retrieveThemes, updateThemes } from '@app/requests';
import Theme from './Theme';

const Themes = (props) => {
  const queryClient = useQueryClient();
  const { onSwitchTheme = () => {} } = props;
  const [ busy, setBusy ] = useState(false);
  const [ themeIndex, setThemeIndex ] = useState(0);
  const { data: themes } = useQuery({
    queryKey: ['themes'], queryFn: retrieveThemes, initialData: initThemes
  });

  const currentTheme = useMemo(() => {
    if (themes) {
      const theme = themes[themeIndex];
      if (!theme) return null;
      return theme;
    }
    return null;
  }, [themes, themeIndex]);

  const onChangeTab = (index) => {
    setThemeIndex(index);
    if (themes[index]?.themeId) {
      onSwitchTheme(themes[index].themeId);
    }
  }

  const updateTheme = async (value, id) => {
    try {
      setBusy(true);
      const newParams = { ...currentTheme, [id]: value };
      let newThemes = [...themes];
      newThemes[themeIndex] = newParams;
      const updatedThemes = await updateThemes(newThemes);
      queryClient.setQueryData(['themes'], updatedThemes);
    }
    catch (e) {
      console.error(e);
    }
    setBusy(false);
  }

  const addNewTheme = async () => {
    setBusy(true);
    try {
      const newThemesArray = [...themes, {
        type: 'css',
        name: 'Theme ' + (themes.length + 1),
        themeId: 'theme-' + (themes.length + 1),
        settings: [],
        style: ""
      }];
      const newThemes = await updateThemes(newThemesArray);
      queryClient.setQueryData(['themes'], newThemes);
    }
    catch (e) {
      console.error(e);
    }
    setBusy(false);
  }

  const deleteCurrentTheme = async () => {
    setBusy(true);
    const newThemes = [...themes];
    newThemes.splice(themeIndex, 1);
    await updateThemes(newThemes);
    await queryClient.setQueryData(['themes'], newThemes);
    setThemeIndex(prev => prev > 0 ? prev - 1 : 0);
    setBusy(false);
  }

  const resetTheme = async () => {
    setBusy(true);
    const themeToReset = { ...themes[themeIndex] };
    themeToReset.settings = [];
    themeToReset.style = "";
    const newThemes = [...themes];
    newThemes[themeIndex] = themeToReset;
    await updateThemes(newThemes);
    await queryClient.setQueryData(['themes'], newThemes);
    setBusy(false);
  }

  return (<>
    <NekoTabs inversed onChange={onChangeTab} currentTab={themeIndex}
      action={<>
        <NekoButton className="primary-block" icon='plus' onClick={addNewTheme} />
        {themes && themes[themeIndex]?.type !== 'internal' &&
          <NekoButton className="danger" icon='delete' onClick={deleteCurrentTheme} />
        }
      </>}>
      {themes?.map(x => <NekoTab key={x.themeId} title={x.name} busy={busy}>
        <Theme theme={x} updateTheme={updateTheme} resetTheme={resetTheme} />
      </NekoTab>)}
    </NekoTabs>
  </>);
};

export default Themes;