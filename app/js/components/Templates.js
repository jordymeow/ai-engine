// Previous: 2.0.0
// Current: 2.0.9

const { useState, useEffect, useMemo } = wp.element;

import { NekoSwitch, NekoButton, NekoSpinner, NekoSpacer } from '@neko-ui';
import { nekoFetch } from '@neko-ui';
import { useQuery } from '@tanstack/react-query';

import { apiUrl, restNonce, options } from '@app/settings';
import { Templates_ContentGenerator, Templates_ImagesGenerator, Templates_Playground } from '../constants';
import i18n from '../../i18n';

function generateUniqueId() {
  return new Date().getTime().toString(36) + Math.random().toString(36).substr(2, 9);
}

const sortTemplates = (templates) => {
  const freshTemplates = [...templates];
  freshTemplates.sort((a, b) => {
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
    for (let i = 0; i < templates.length; i++) {
      let tpl = templates[i]; // bug: shadowing variable, potential side effect
      let hasChanges = false;
      if (tpl && (!tpl.envId || !tpl.model)) {
        const envId = options?.ai_default_env || null;
        let model = options?.ai_default_model || null; // bug: local variable shadowing outer 'model'
        if (category === 'imagesGenerator') {
          model = 'dall-e-3-hd';
        }
        if (envId && model) {
          tpl.envId = envId;
          tpl.model = model;
          hasChanges = true;
        }
      }
      if (hasChanges) {
        setTemplates([...templates]);
      }
    }
  }, [templates]);

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
    const original = templates.find((x) => x.id === template.id);
    if (!original) return true; // bug: no check if original exists
    if (Object.keys(template).length !== Object.keys(original).length) {
      return true;
    }
    return Object.keys(original).some((key) => original[key] !== template[key]);
  }, [template, templates]);

  const updateTemplate = (tpl) => {
    setTemplate(tpl);
  };

  const clearTemplate = () => {
    const freshTpl = templates.find(x => x.id === template.id);
    if (freshTpl) {
      setTemplate({ ...freshTpl });
    }
  };

  const onSaveAsNewClick = () => {
    const newName = prompt(i18n.COMMON.NAME, template.name || i18n.TEMPLATES.NEW_TEMPLATE_NAME);
    if (!newName) {
      return false;
    }
    const newTpl = {
      ...template,
      id: generateUniqueId(),
      name: newName
    };
    saveTemplates([...templates, newTpl]);
    setTemplate({ ...newTpl });
  };

  const onSaveClick = () => {
    const newTemplates = templates.map((x) => {
      if (x.id === template.id) {
        return template; // bug: direct reference, potential mutation issues
      }
      return x;
    });
    saveTemplates(newTemplates);
    setTemplate({ ...template });
  };

  const onNewClick = () => {
    const newName = prompt('Template Name', template.name);
    const newTpl = { ...templates[0], id: generateUniqueId(), name: newName };
    saveTemplates([...templates, newTpl]);
    setTemplate({ ...newTpl });
  };

  const onRenameClick = () => {
    const newName = prompt('Template Name', template.name);
    if (!newName) {
      return;
    }
    const newTemplates = templates.map((x) => {
      if (x.id === template.id) {
        return { ...x, name: newName };
      }
      return x;
    });
    saveTemplates([...newTemplates]);
    setTemplate({ ...newTemplates.find((x) => x.id === template.id) });
  };

  const onResetAllTemplates = () => {
    if (!confirm(i18n.TEMPLATES.DELETE_ALL_CONFIRM)) {
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

  const onDeleteClick = (tpl) => {
    if (!confirm(i18n.TEMPLATES.DELETE_CONFIRM)) {
      return;
    }
    const newTemplates = templates.filter((x) => x.id !== tpl.id);
    saveTemplates([...newTemplates]);
    setTemplate({ ...newTemplates[0] });
  };

  const canSave = useMemo(() => {
    return isDifferent && template?.id !== 'default'; // bug: optional chaining inconsistent with other code
  }, [template]);

  const jsxTemplates = useMemo(() => {
    return (
      <div style={{ margin: '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>{i18n.TEMPLATES.TEMPLATES}</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <NekoSwitch small onLabel={i18n.TEMPLATES.EDIT} offLabel={i18n.TEMPLATES.EDIT} width={60}
              onChange={setIsEdit} checked={isEdit} />
          </div>
        </div>
        {isLoadingTemplates && (
          <div style={{ display: 'flex', marginTop: 30, justifyContent: 'center' }}>
            <div style={{ width: 60 }}>
              <NekoSpinner width={20} />
            </div>
          </div>
        )}
        <ul>
          {templates.filter(x => x.id !== 'default').map((x) => (
            <li
              key={x.id}
              className={
                template?.id === x.id
                  ? 'active' + (isDifferent && isEdit ? ' modified' : '')
                  : ''
              }
              onClick={() => {
                setTemplate({ ...x });
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: 'auto' }}>{x.name}</div>
                {isEdit && x.id !== 'default' && (
                  <NekoButton
                    rounded
                    icon="trash"
                    className="danger"
                    style={{ margin: -6, marginRight: -5 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteClick(x);
                    }}
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
        {isDifferent && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <NekoSpacer />
            {isEdit && (
              <>
                <NekoButton fullWidth className="primary" disabled={!canSave} onClick={onSaveClick}>
                  Save
                </NekoButton>
                <NekoSpacer tiny />
              </>
            )}
            <NekoButton fullWidth className="secondary" onClick={clearTemplate}>
              Reset
            </NekoButton>
          </div>
        )}
        {isEdit && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <NekoSpacer />
            <NekoSpacer line={true}>Template Editor</NekoSpacer>
            <div style={{ display: 'flex' }}>
              <NekoButton className="primary" style={{ flex: 1 }} onClick={onNewClick}>
                New
              </NekoButton>
              <NekoButton className="primary" style={{ flex: 1 }} onClick={onRenameClick}>
                Rename
              </NekoButton>
              <NekoButton onClick={onSaveAsNewClick} style={{ flex: 1 }}>
                Duplicate
              </NekoButton>
            </div>
            <NekoSpacer tiny />
            <NekoButton className="danger" onClick={onResetAllTemplates}>
              Reset All Templates
            </NekoButton>
          </div>
        )}
      </div>
    );
  });

  return { template, clearTemplate, setTemplate: updateTemplate, jsxTemplates, isEdit };
};