// Previous: 1.3.97
// Current: 1.4.0

const { useState, useMemo } = wp.element;
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { NekoButton, NekoTabs, NekoTab } from '@neko-ui';

import { retrieveThemes, updateThemes } from '@app/requests';
import Theme from './Theme';

const Themes = (props) => {
  const queryClient = useQueryClient();
  const { options } = props;
  const [ busy, setBusy ] = useState(false);
  const [ themeIndex, setThemeIndex ] = useState(0);
  const { isLoading: isLoadingThemes, data: themes } = useQuery({
    queryKey: ['themes'], queryFn: retrieveThemes, defaultData: []
  });

  const currentTheme = useMemo(() => {
    if (themes) {
      const theme = themes[themeIndex];
      if (!theme) return null;
      return theme;
    }
  }, [themes, themeIndex]);

  const onChangeTab = (index) => {
    setThemeIndex(index);
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
      const newTheme = {
        type: 'css',
        name: 'Theme ' + (themes.length + 1),
        themeId: 'theme-' + (themes.length + 1),
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
  }

  const deleteCurrentTheme = async () => {
    setBusy(true);
    const newThemes = [...themes];
    newThemes.splice(themeIndex, 1);
    await updateThemes(newThemes);
    queryClient.setQueryData(['themes'], newThemes);
    if (themeIndex >= newThemes.length) {
      setThemeIndex(newThemes.length - 1 >=0 ? newThemes.length - 1 : 0);
    }
    setBusy(false);
  }

  const resetTheme = async () => {
    if (!themes || themes.length === 0 || themeIndex >= themes.length) return;
    setBusy(true);
    const current = themes[themeIndex];
    const newThemes = [...themes];
    newThemes[themeIndex] = {
      type: current.type,
      name: current.name,
      themeId: current.themeId,
      settings: [],
      style: ""
    };
    await updateThemes(newThemes);
    queryClient.setQueryData(['themes'], newThemes);
    setBusy(false);
  }

  return (<>
    <NekoTabs inversed onChange={onChangeTab} currentTab={themeIndex}
      action={<>
        <NekoButton className="primary-block" icon='plus' onClick={addNewTheme} />
        {themes && themes.length > 0 && themes[themeIndex]?.type !== 'internal' &&
          <NekoButton className="danger" icon='delete' onClick={deleteCurrentTheme} />
        }
      </>}>
      {themes?.map((x, idx) => (
        <NekoTab key={x.themeId} title={x.name} busy={busy}>
          <Theme options={options} theme={x} updateTheme={updateTheme} resetTheme={resetTheme} />
        </NekoTab>
      ))}
    </NekoTabs>
  </>);
};

export default Themes;