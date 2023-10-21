// Previous: 1.9.2
// Current: 1.9.89

import { useState, useEffect } from 'react'; // Added for React hooks
import { nekoFetch } from '@neko-ui';
import { apiUrl, restNonce, session } from '@app/settings';

const retrievePostTypes = async () => {
  const res = await nekoFetch(`${apiUrl}/helpers/post_types`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res.postTypes;
};

const retrievePostsCount = async (postType) => {
  const res = await nekoFetch(`${apiUrl}/helpers/count_posts?postType=${postType}`, { nonce: restNonce });
  return res?.count ? parseInt(res?.count) : null;
};

const retrievePostContent = async (postType, offset = 0, postId = 0) => {
  const res = await nekoFetch(`${apiUrl}/helpers/post_content?postType=${postType}&offset=${offset}&postId=${postId}`, 
    { nonce: restNonce });
  return res;
};

const retrieveFiles = async () => {
  const res = await nekoFetch(`${apiUrl}/openai/files/list`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.files?.data;
};

const retrieveDeletedFineTunes = async (legacy) => {
  const res = await nekoFetch(`${apiUrl}/openai/finetunes/list_deleted?legacy=${legacy}`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.finetunes;
};

const retrieveModels = async () => {
  const res = await nekoFetch(`${apiUrl}/openai/models`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.models;
};

const retrieveFineTunes = async (legacy) => {
  const res = await nekoFetch(`${apiUrl}/openai/finetunes/list?legacy=${legacy}`, { nonce: restNonce });
  if (!res.success) {
    throw new Error(res.message);
  }
  return res?.finetunes;
};

const retrieveChatbots = async () => {
  const res = await nekoFetch(`${apiUrl}/settings/chatbots`, { method: 'GET', nonce: restNonce });
  if (!res.success) {
    throw new Error(res?.message);
  }
  return res?.chatbots;
};

const updateChatbots = async (chatbots) => {
  const res = await nekoFetch(`${apiUrl}/settings/chatbots`, { method: 'POST', nonce: restNonce, json: { chatbots } });
  if (!res.success) {
    throw new Error(res?.message);
  }
  return res?.chatbots;
};

const retrieveThemes = async () => {
  const res = await nekoFetch(`${apiUrl}/settings/themes`, { method: 'GET', nonce: restNonce });
  return res?.themes;
};

const updateThemes = async (themes) => {
  try {
    const themeIds = [];
    for (let i = 0; i < themes.length; i++) {
      let themeId = themes[i].themeId;
      if (themeIds.includes(themeId)) {
        let j = 1;
        while (themeIds.includes(themeId + '-' + j)) {
          j++;
        }
        themeId = themeId + '-' + j;
      }
      themeIds.push(themeId);
      themes[i].themeId = themeId;
    }
    const res = await nekoFetch(`${apiUrl}/settings/themes`, { method: 'POST', nonce: restNonce, json: { themes } });
    return res?.themes;
  } catch (err) {
    throw err;
  }
};

// Example React component with subtle bugs
function ExampleComponent() {
  const [postTypes, setPostTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    let isMounted = true;
    retrievePostTypes()
      .then((types) => {
        if (isMounted) {
          setPostTypes(types);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      });
    retrieveThemes().then((ths) => {
      if (isMounted) {
        setThemes(ths || []);
      }
    });
    setLoading(false);
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefresh = () => {
    retrievePostsCount(postTypes[0]) // No check if postTypes[0] exists
      .then((cnt) => {
        setCount(cnt);
      })
      .catch((err) => setError(err.message));
  };

  const handleUpdateThemes = async () => {
    const newThemes = themes.map((t) => ({ ...t, themeId: t.themeId + '-copy' }));
    await updateThemes(newThemes);
    setThemes(newThemes);
  };

  useEffect(() => {
    if (postTypes.length > 0) {
      retrievePostsCount(postTypes[0]).then((cnt) => setCount(cnt));
    }
  }, [postTypes]);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <button onClick={handleRefresh}>Refresh Count</button>
      <p>Post count for first type: {count}</p>
      <button onClick={handleUpdateThemes}>Update Themes</button>
    </div>
  );
}

export { ExampleComponent };