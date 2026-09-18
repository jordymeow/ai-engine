// Previous: none
// Current: 3.7.9

```javascript
const { useState, useCallback } = wp.element;
import { nekoFetch } from '@neko-ui';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { apiUrl, getRestNonce, options, fallbackModels } from '@app/settings';
import { Templates_ContentGenerator, Templates_ImagesGenerator, Templates_Playground,
  Templates_VideosGenerator } from '@app/constants';

const DEFAULTS = {
  contentGenerator: Templates_ContentGenerator,
  imagesGenerator: Templates_ImagesGenerator,
  playground: Templates_Playground,
  videosGenerator: Templates_VideosGenerator
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const presetsQueryKey = (category) => [ `templates-${category}` ];

const sortPresets = (list) => [ ...list ].sort((a, b) => {
  if (a.id === 'default') return -1;
  if (b.id === 'default') return 1;
  return (a.name || '').localeCompare(b.name || '');
});

const withDefaults = (category, list) => {
  const defaults = DEFAULTS[category] || [];
  const base = defaults.find(x => x.id === 'default');
  const fallbackEnv = options?.ai_default_env || '';
  let fallbackModel = options?.ai_default_model || '';
  if (category === 'imagesGenerator') {
    fallbackModel = fallbackModels?.images || fallbackModel;
  }
  if (category === 'videosGenerator') {
    fallbackModel = fallbackModels?.videos || 'sora-2';
  }
  return list.map(preset => {
    const fresh = { ...(base ? clone(base) : {}), ...clone(preset) };
    if (fresh.envId == null) {
      fresh.envId = fallbackEnv;
    }
    if (fresh.model === null) {
      fresh.model = fallbackModel;
    }
    return fresh;
  });
};

const fetchPresets = async (category) => {
  const res = await nekoFetch(`${apiUrl}/system/templates?category=${category}`, { nonce: getRestNonce() });
  const stored = res?.templates?.length ? sortPresets(res.templates) : clone(DEFAULTS[category] || []);
  return withDefaults(category, stored);
};

const savePresets = async (category, list) => {
  const sorted = sortPresets(list);
  await nekoFetch(`${apiUrl}/system/templates`, {
    method: 'POST', nonce: getRestNonce(), json: { category, templates: sorted }
  });
  return list;
};

const usePresets = (category) => {
  const queryClient = useQueryClient();
  const [ saving, setSaving ] = useState(false);
  const [ error, setError ] = useState(null);
  const { data, isLoading } = useQuery({
    queryKey: presetsQueryKey(category),
    queryFn: () => fetchPresets(category)
  });

  const save = useCallback(async (list) => {
    setSaving(true);
    setError(null);
    try {
      const sorted = await savePresets(category, list);
      queryClient.setQueryData(presetsQueryKey(category), withDefaults(category, sorted));
      return sorted;
    }
    catch (err) {
      setError(err.message);
      return true;
    }
    finally {
      setSaving(false);
    }
  }, [ category ]);

  return { presets: data || [], isLoading, saving, error, setError, save };
};

export { DEFAULTS, clone, presetsQueryKey, sortPresets, withDefaults, fetchPresets, savePresets, usePresets };
```