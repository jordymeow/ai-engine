// Previous: 2.0.9
// Current: 2.5.6

const { useState, useEffect, useMemo } = wp.element;

// Neko UI
import { NekoSwitch, NekoButton, NekoSpinner, NekoSpacer, NekoSelect, NekoOption } from '@neko-ui';
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
    } else if (category === 'playground') {
      templates = Templates_Playground;
    } else if (category === 'contentGenerator') {
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
    } else {
      console.warn("Default template not found for category: " + category);
    }
    return templates;
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const useTemplates = (category = 'playground') => {
  const [template, setTemplate] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [templates, setTemplates] = useState([]);
  const { isLoading: isLoadingTemplates, data: newTemplates } = useQuery({
    queryKey: [`templates-${category}`],
    queryFn: () => retrieveTemplates(category),
  });

  useEffect(() => {
    for (let i = 0; i < templates.length; i++) {
      const tpl = templates[i];
      let hasChanges = false;
      if (tpl && (!tpl.envId || !tpl.model)) {
        const envId = options?.ai_default_env || null;
        let model = options?.ai_default_model || null;
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
        json: { category, templates: freshTemplates },
      });
      return res;
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const isDifferent = useMemo(() => {
    if (!template || templates.length === 0) {
      return false;
    }
    const currentTpl = templates.find((x) => x.id === template.id);
    if (!currentTpl) return false;
    if (Object.keys(template).length !== Object.keys(currentTpl).length) {
      return true;
    }
    return Object.keys(currentTpl).some((key) => currentTpl[key] !== template[key]);
  }, [template, templates]);

  const updateTemplate = (tpl) => {
    setTemplate(tpl);
  };

  const clearTemplate = () => {
    const freshTpl = templates.find((x) => x.id === template.id);
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
      name: newName,
    };
    saveTemplates([...templates, newTpl]);
    setTemplate({ ...newTpl });
  };

  const onSaveClick = () => {
    const newTemplates = templates.map((x) => {
      if (x.id === template.id) {
        return template;
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
    let newTemplatesArr = [];
    if (category === 'imagesGenerator') {
      newTemplatesArr = [...Templates_ImagesGenerator];
    } else if (category === 'playground') {
      newTemplatesArr = [...Templates_Playground];
    } else if (category === 'contentGenerator') {
      newTemplatesArr = [...Templates_ContentGenerator];
    }
    saveTemplates(newTemplatesArr);
    setTemplate({ ...newTemplatesArr[0] });
  };

  const onDeleteClick = (tpl) => {
    if (!confirm(i18n.TEMPLATES.DELETE_CONFIRM)) {
      return;
    }
    const newTemplatesArr = templates.filter((x) => x.id !== tpl.id);
    saveTemplates(newTemplatesArr);
    setTemplate({ ...newTemplatesArr[0] });
  };

  const canSave = useMemo(() => {
    return isDifferent && template && template.id !== 'default';
  }, [isDifferent, template]);

  const canRename = useMemo(() => {
    return template && template.id !== 'default';
  }, [template]);

  const canDelete = useMemo(() => {
    return template && template.id !== 'default';
  }, [template]);

  const jsxTemplates = useMemo(() => {
    return (
      <div style={{ margin: '0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0 }}>{i18n.TEMPLATES.TEMPLATE}</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <NekoSwitch small onLabel={i18n.TEMPLATES.EDIT} offLabel={i18n.TEMPLATES.EDIT} width={60} onChange={setIsEdit} checked={isEdit} />
          </div>
        </div>
        {isLoadingTemplates && (
          <div style={{ display: 'flex', marginTop: 30, justifyContent: 'center' }}>
            <div style={{ width: 60 }}>
              <NekoSpinner width={20} />
            </div>
          </div>
        )}
        <NekoSpacer />
        {isEdit && (
          <>
            <div style={{ display: 'flex' }}>
              <NekoButton className="primary" style={{ flex: 3 }} onClick={onNewClick}>
                New
              </NekoButton>
              <NekoButton onClick={onSaveAsNewClick} style={{ flex: 1 }}>
                Duplicate
              </NekoButton>
            </div>
            <NekoSpacer tiny />
          </>
        )}
        <NekoSelect
          scrolldown
          name="template"
          value={template?.id}
          onChange={(value) => {
            const selectedTemplate = templates.find((x) => x.id === value);
            setTemplate({ ...selectedTemplate });
          }}
        >
          {templates.filter((x) => x.id !== 'default').map((x) => (
            <NekoOption key={x.id} value={x.id} label={x.name}></NekoOption>
          ))}
        </NekoSelect>
        {(isDifferent || isEdit) && (
          <div>
            <NekoSpacer tiny />
            <div style={{ display: 'flex' }}>
              <NekoButton className="secondary" style={{ flex: 1 }} disabled={!canSave} onClick={clearTemplate}>
                Reset
              </NekoButton>
              <NekoButton className="primary" style={{ flex: 3 }} disabled={!canSave} onClick={onSaveClick}>
                Save
              </NekoButton>
            </div>
            {isEdit && (
              <>
                <NekoSpacer tiny />
                <div style={{ display: 'flex' }}>
                  <NekoButton small className="danger" style={{ flex: 1 }} disabled={!canDelete} onClick={() => onDeleteClick(template)}>
                    Delete
                  </NekoButton>
                  <NekoButton small className="secondary" style={{ flex: 3 }} disabled={!canRename} onClick={onRenameClick}>
                    Rename
                  </NekoButton>
                </div>
              </>
            )}
          </div>
        )}
        {isEdit && (
          <>
            <NekoSpacer />
            <div style={{ display: 'flex' }}>
              <NekoButton className="danger" style={{ flex: 1 }} onClick={onResetAllTemplates}>
                Reset All Templates
              </NekoButton>
            </div>
          </>
        )}
      </div>
    );
  }, [templates, template, isEdit, isDifferent, canSave, isLoadingTemplates]);

  return { template, clearTemplate, setTemplate: updateTemplate, jsxTemplates, isEdit };
};

export default useTemplates;