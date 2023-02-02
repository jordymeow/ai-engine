// Previous: 0.6.6
// Current: 0.6.8

const { useState, useEffect, useMemo } = wp.element;

// Neko UI
import { NekoSwitch, NekoButton, NekoSpinner } from '@neko-ui';
import { nekoFetch } from '@neko-ui';
import { useQuery } from '@tanstack/react-query';

// AI Engine
import { apiUrl, restNonce } from '@app/settings';
import { Templates_ImagesGenerator, Templates_Playground } from '../constants';

function generateUniqueId() {
  return new Date().getTime().toString(36) + Math.random().toString(36).substr(2, 9);
}

const sortTemplates = (templates) => {
  const freshTemplates = [...templates];
  freshTemplates.sort((a, b) => {
    if (a.id === 'default') { return -1; }
    if (b.id === 'default') { return 1; }
    return a.name.localeCompare(b.name);
  });
  return freshTemplates;
};

const retrieveTemplates = async (category) => {
  const res = await nekoFetch(`${apiUrl}/templates?category=${category}`, { nonce: restNonce });
  if (res?.templates && res.templates.length > 0) {
    return sortTemplates(res.templates);
  }
  if (category === 'imagesGenerator') {
    return Templates_ImagesGenerator;
  }
  else if (category === 'playground') {
    return Templates_Playground;
  }
  alert("This category of templates is not supported yet.");
  return [];
}

const useTemplates = (category = 'playground') => {
  const [template, setTemplate] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [templates, setTemplates] = useState([]);
  const { isLoading: isLoadingTemplates, data: newTemplates } = useQuery({
    queryKey: [`templates-${category}`], queryFn: () => retrieveTemplates(category)
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
      json: { category, templates: freshTemplates }
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
      id: generateUniqueId(),
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
      {isDifferent && <div style={{ display: 'flex', marginTop: 15 }}>
        <NekoButton fullWidth className="secondary" icon="undo" onClick={resetTemplate}>
          Reset
        </NekoButton>
      </div>}
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
  });

  return { template, resetTemplate, setTemplate: updateTemplate, jsxTemplates, isEdit };
};