// Previous: 1.7.6
// Current: 1.9.81

const { useState, useEffect, useMemo } = wp.element;

// Neko UI
import { NekoSwitch, NekoButton, NekoSpinner, NekoSpacer } from '@neko-ui';
import { nekoFetch } from '@neko-ui';
import { useQuery } from '@tanstack/react-query';

// AI Engine
import { apiUrl, restNonce } from '@app/settings';
import { Templates_ContentGenerator, Templates_ImagesGenerator, Templates_Playground } from '../constants';
import i18n from '../../i18n';
import { toHTML } from '@app/helpers-admin';

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
  try {
    const res = await nekoFetch(`${apiUrl}/system/templates?category=${category}`, { nonce: restNonce });
    let templates = [];
    if (category === 'imagesGenerator') {
      templates = Templates_ImagesGenerator;
    }
    else if (category === 'playground') {
      templates = Templates_Playground;
    }
    else if (category === 'contentGenerator') {
      templates = Templates_ContentGenerator;
    }
    const defTemplate = templates.find((x) => x.id === 'default');

    if (res?.templates && res.templates.length > 0) {
      templates = sortTemplates(res.templates);
    }

    if (defTemplate) {
      templates.forEach((tpl) => {
        Object.keys(defTemplate).forEach((key) => {
          if (typeof tpl[key] === 'undefined') {
            tpl[key] = defTemplate[key];
          }
        });
      });
    }
    else {
      console.warn("Default template not found for category: " + category);
    }
    return templates;
  }
  catch (err) {
    console.error(err);
    alert(err.message);
  }
};

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
    try {
      const res = await nekoFetch(`${apiUrl}/system/templates`, {
        method: 'POST',
        nonce: restNonce,
        json: { category, templates: freshTemplates }
      });
      return res;
    }
    catch (err) {
      console.error(err);
      alert(err.message);
    }
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

  const clearTemplate = () => {
    const freshTpl = templates.find(x => x.id === template.id);
    if (freshTpl) {
      setTemplate({...freshTpl});
    }
  };

  const onSaveAsNewClick = () => {
    const newName = prompt(i18n.COMMON.NAME, i18n.TEMPLATES.NEW_TEMPLATE_NAME);
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

  const onResetAllTemplates = () => {
    if (!confirm(i18n.TEMPLATES.RESET_ALL_CONFIRM)) {
      return;
    }
    let newTemplates = [];
    if (category === 'imagesGenerator') {
      newTemplates = [...Templates_ImagesGenerator];
    }
    else if (category === 'playground') {
      newTemplates = [...Templates_Playground];
    }
    else if (category === 'contentGenerator') {
      newTemplates = [...Templates_ContentGenerator];
    }
    saveTemplates(newTemplates);
    setTemplate({ ...newTemplates[0] });
  };

  const onDeleteClick = () => {
    if (!confirm(i18n.TEMPLATES.DELETE_CONFIRM)) {
      return;
    }
    const newTemplates = templates.filter((x) => x.id !== template.id);
    saveTemplates([...newTemplates]);
    setTemplate({ ...newTemplates[0] });
  };

  const canSave = useMemo(() => {
    return isDifferent && template.id !== 'default';
  }, [template]);

  const jsxTemplates = useMemo(() => {
    return (<div style={{ margin: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>{i18n.TEMPLATES.TEMPLATES}</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <NekoSwitch small onLabel={i18n.TEMPLATES.EDIT} offLabel={i18n.TEMPLATES.EDIT} width={60}
            onChange={setIsEdit} checked={isEdit} />
        </div>
      </div>
      {isLoadingTemplates && <div style={{ display: 'flex', marginTop: 30, justifyContent: 'center' }}>
        <div style={{ width: 60 }}><NekoSpinner width={20} /></div>
      </div>}
      <ul>
        {templates.map((x) => (
          <li key={x.id}
            className={template.id === x.id ? ('active' + (isDifferent && isEdit ? ' modified' : '')) : ''}
            onClick={() => { setTemplate({...x}); }}>
            {x.name}
          </li>
        ))}
      </ul>
      {isDifferent && <div style={{ display: 'flex', marginTop: 15 }}>
        <NekoButton fullWidth className="primary" icon="undo" onClick={clearTemplate}>
          Clear
        </NekoButton>
      </div>}
      {isEdit && <div style={{ display: 'flex', flexDirection: 'column' }}>

        <NekoSpacer line={true}>Template Editor</NekoSpacer>
        <div style={{ display: 'flex' }}>
          <NekoButton disabled={template.id === 'default'} className="primary" style={{ flex: 1 }}
            onClick={onRenameClick}>
            Rename
          </NekoButton>
          <NekoButton onClick={onSaveAsNewClick} style={{ flex: 1 }}>
            Duplicate
          </NekoButton>
          <NekoButton disabled={!canSave} className="primary" style={{ flex: 1 }}
            onClick={onSaveClick}>
            Save
          </NekoButton>
        </div>
        <NekoSpacer line={true} />
        <NekoButton disabled={template.id === 'default'} className="danger"
          onClick={onDeleteClick}>
          Delete Template
        </NekoButton>
        <NekoSpacer line={true} />
        <NekoButton className="danger"
          onClick={onResetAllTemplates}>
          Reset All Templates
        </NekoButton>
      </div>}
      {!isEdit && <div style={{ display: 'flex', marginTop: 15, lineHeight: '14px' }}>
        <small>{toHTML(i18n.TEMPLATES.JOIN_US)}</small>
      </div>}
    </div>);
  }, [templates, template, isEdit, isLoadingTemplates, isDifferent, canSave]);

  return { template, clearTemplate, setTemplate: updateTemplate, jsxTemplates, isEdit };
};