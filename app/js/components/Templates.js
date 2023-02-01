// Previous: none
// Current: 0.6.6

const { useState, useEffect, useMemo } = wp.element;

// Neko UI
import { NekoWrapper, NekoSwitch, NekoButton, NekoSpinner } from '@neko-ui';
import { nekoFetch } from '@neko-ui';
import { useQuery } from '@tanstack/react-query';

// AI Engine
import { apiUrl, restNonce, session, options } from '@app/settings';

const playgroundTemplates = [
  {
    id: 'default',
    name: 'Default',
    mode: 'query',
    model: 'text-davinci-003',
    temperature: 0.8,
    stopSequence: '',
    maxTokens: 2048,
    prompt: ''
  }, {
    id: 'article_translator',
    name: 'Text Translator',
    mode: 'query',
    model: 'text-davinci-003',
    temperature: 0.3,
    stopSequence: '',
    maxTokens: 2048,
    prompt: `Translate this article into French:\n\nUchiko is located in Ehime prefecture, in the west of the island. The town was prosperous at the end of the 19th century thanks to its production of very good quality white wax. This economic boom allowed wealthy local merchants to build beautiful properties, whose heritage is still visible throughout the town.\n\n`,
  }, {
    id: 'restaurant_review',
    name: 'Restaurant Review Writer',
    mode: 'query',
    model: 'text-davinci-003',
    temperature: 0.8,
    stopSequence: '',
    maxTokens: 2048,
    prompt: 'Write a review for a French restaurant located in Kagurazaka, Tokyo. Looks like an old restaurant, food is traditional, chef is talkative, it is always full. Not expensive, but not fancy.\n\n',
  }, {
    id: 'article_corrector',
    name: 'Text Corrector',
    mode: 'query',
    model: 'text-davinci-003',
    temperature: 0.2,
    stopSequence: '',
    maxTokens: 2048,
    prompt: 'Fix the grammar and spelling mistakes in this text:\n\nI wake up at eleben yesderday, I will go bed eary tonigt.\n',
  }, {
    id: 'seo_assistant',
    name: 'SEO Optimizer',
    mode: 'query',
    model: 'text-davinci-003',
    temperature: 0.6,
    stopSequence: '',
    maxTokens: 1024,
    prompt: `For the following article, write a SEO-friendly and short title, keywords for Google, and a short excerpt to introduce it. Use this format:

      Title: 
      Keywords: 
      Excerpt: 
      
      Uchiko is located in Ehime prefecture, in the west of the island. The town was prosperous at the end of the 19th century thanks to its production of very good quality white wax. This economic boom allowed wealthy local merchants to build beautiful properties, whose heritage is still visible throughout the town.
    `,
  }, {
    id: 'wp_assistant',
    name: 'WordPress Assistant',
    mode: 'continuous',
    model: 'text-davinci-003',
    temperature: 0.8,
    stopSequence: '',
    maxTokens: 150,
    prompt: `Converse as a WordPress expert. Be helpful, friendly, concise, avoid external URLs and commercial solutions.\n
      AI: Hi! How can I help you with WP today?`
  }, {
    id: 'casually_fined_tuned',
    name: 'Casually Fined Tuned Tester',
    mode: 'continuous',
    model: 'text-davinci-003',
    temperature: 0.4,
    stopSequence: '\\n\\n',
    maxTokens: 1024,
    prompt: `Hello! What's your name?\n\n###\n\n`
  }
];

const sortTemplates = (templates) => {
  const freshTemplates = [...templates];
  freshTemplates.sort((a, b) => {
    if (a.id === 'default') { return -1; }
    if (b.id === 'default') { return 1; }
    return a.name.localeCompare(b.name);
  });
  return freshTemplates;
};

const retrieveTemplates = async () => {
  const res = await nekoFetch(`${apiUrl}/templates?category=playground`, { nonce: restNonce });
  if (res?.templates && res.templates.length > 0) {
    return sortTemplates(res.templates);
  }
  return playgroundTemplates;
}

const useTemplates = (category = 'playground') => {
  const [template, setTemplate] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [templates, setTemplates] = useState([]);
  const { isLoading: isLoadingTemplates, data: newTemplates } = useQuery({
    queryKey: ['templates'], queryFn: retrieveTemplates
  });

  useEffect(() => {
    if (newTemplates) {
      setTemplates(newTemplates);
      setTemplate(newTemplates[0]);
    }
  }, [newTemplates]);

  const saveTemplates = async (freshTemplates) => {
    freshTemplates = sortTemplates(freshTemplates);
    setTemplates(freshTemplates);
    const res = await nekoFetch(`${apiUrl}/templates`, {
      method: 'POST',
      nonce: restNonce,
      json: { category: 'playground', templates: freshTemplates }
    });
    return res;
  };

  const isDifferent = useMemo(() => {
    if (!template || templates.length === 0) {
      return false;
    }
    const originalTpl = templates.find((x) => x.id === template.id);
    return Object.keys(originalTpl).some((key) => originalTpl[key] !== template[key]);
  }, [template, templates]);

  const updateTemplate = (tpl) => {
    setTemplate(tpl);
  };

  const resetTemplate = () => {
    const freshTpl = templates.find(x => x.id === template.id);
    if (freshTpl) {
      setTemplate({...freshTpl});
    }
  };

  const onSaveAsNewClick = () => {
    const newName = prompt('Name', "My New Template");
    if (!newName) {
      return false;
    }
    const newTpl = {
      ...template,
      id: 'new_' + Date.now(),
      name: newName
    };
    saveTemplates([...templates, newTpl]);
    setTemplate({...newTpl});
  };

  const onSaveClick = () => {
    const newTemplates = templates.map((x) => {
      if (x.id === template.id) {
        return template;
      }
      return x;
    });
    saveTemplates(newTemplates);
    setTemplate({...template});
  };

  const onRenameClick = () => {
    const newName = prompt('New name', template.name);
    if (!newName) {
      return;
    }
    const newTemplates = templates.map((x) => {
      if (x.id === template.id) {
        return {...x, name: newName};
      }
      return x;
    });
    saveTemplates([...newTemplates]);
    setTemplate({...newTemplates.find((x) => x.id === template.id)});
  };

  const onDeleteClick = () => {
    if (!confirm('Are you sure you want to delete this template?')) {
      return;
    }
    const newTemplates = templates.filter((x) => x.id !== template.id);
    saveTemplates([...newTemplates]);
    setTemplate({...newTemplates[0]});
  };

  const canSave = useMemo(() => {
    return isDifferent && template.id !== 'default';
  }, [template]);

  const jsxTemplates = useMemo(() => {
    return (<div style={{ margin: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>Templates</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <NekoSwitch small onLabel="EDIT" offLabel="EDIT" width={60} onChange={setIsEdit} checked={isEdit} />
        </div>
      </div>
      {isLoadingTemplates && <div style={{ display: 'flex', marginTop: 30, justifyContent: 'center' }}>
        <div style={{ width: 60 }}><NekoSpinner width={20} /></div>
      </div>}
      <ul>
        {templates.map((x) => (
          <li className={template.id === x.id ? ('active' + (isDifferent ? ' modified' : '')) : ''}
            onClick={() => { setTemplate({...x}) }}>
            {x.name}
          </li>
        ))}
      </ul>
      {isEdit && <div style={{ display: 'flex', flexDirection: 'column', marginTop: 15 }}>
        <div style={{ display: 'flex', marginBottom: 5 }}>
          <NekoButton disabled={template.id === 'default'} className="danger" icon="trash"
            onClick={onDeleteClick}/>
          <NekoButton disabled={template.id === 'default'} className="primary" icon="pencil"
            onClick={onRenameClick}/>
          <NekoButton disabled={!canSave} className="primary" style={{ flex: 6 }}
            onClick={onSaveClick}>
            Save
          </NekoButton>
        </div>
        <div style={{ display: 'flex' }}>
          <NekoButton onClick={onSaveAsNewClick} style={{ flex: 6 }}>
            Save as New
          </NekoButton>
        </div>
      </div>}
    </div>);
  }, [templates, template, isLoadingTemplates, isEdit, canSave]);

  return { template, resetTemplate, setTemplate: updateTemplate, jsxTemplates, isEdit };
};