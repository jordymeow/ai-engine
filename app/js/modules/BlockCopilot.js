// Previous: none
// Current: 1.4.9

const { createHigherOrderComponent } = wp.compose;
const { addFilter } = wp.hooks;
const { useState, useRef, useEffect } = wp.element;
const { RichText } = wp.blockEditor;
const { InspectorControls } = wp.blockEditor;
const { PanelBody, TextControl, Spinner } = wp.components;

// NekoUI
import { nekoFetch } from '@neko-ui';

// AI Engine
import AiIcon from "../styles/AiIcon";
import { apiUrl, restNonce } from '@app/settings';

const BlockCopilot = () => {

  const blockEditCopilot = (BlockEdit) => {
    return (props) => {
      const aiTextControlRef = useRef();
      const [ display, setDisplay ] = useState(false);
      const [ query, setQuery ] = useState('');
      const [ busy, setBusy ] = useState(false);
      const { content } = props.attributes;

      const handleKeyPress = (e) => {
        if (e.code === 'Space' && !content) {
          e.preventDefault();
          setDisplay(true);
        }
      };

      const executeQuery = async (query) => {
        try {
          setBusy(true);
          const res = await nekoFetch(`${apiUrl}/copilot`, {
            method: 'POST',
            nonce: restNonce,
            json: { action: 'write', prompt: query }
          });
          console.log("GOT IT", res.data);
          props.setAttributes({ content: res.data })
        }
        catch (e) {
          console.log("ERROR", e);
        }
        finally {
          setBusy(false);
          setDisplay(false);
          setQuery('');
        }
      }

      const onAiTextKeyDown = async (e) => {
        if (e.code === 'Enter') {
          e.preventDefault();
          executeQuery(query);
        }
        if (e.code === 'Escape' || (e.code === 'Backspace' && !query)) {
          e.preventDefault();
          setDisplay(false);
          setQuery('');
        }
      };

      useEffect(() => {
        if (display && aiTextControlRef.current) {
          aiTextControlRef.current.focus();
        }
      }, [display]);

      if (props.name === 'core/paragraph') {
        if (display) {
          return (<div style={{ position: 'relative' }}>
            <TextControl ref={aiTextControlRef}
              label={<><AiIcon icon="wand" style={{ marginBottom: -4 }} />AI Copilot</>}
              value={query} disabled={busy}
              placeholder="Write about..."
              onChange={(value) => setQuery(value)}
              onKeyDown={onAiTextKeyDown}
            />
            {busy && <Spinner style={{ position: 'absolute', top: 30, right: 0 }} />}
          </div>);
        }
        return (<div onKeyDown={handleKeyPress}><BlockEdit {...props} /></div>);
      }
      return (<BlockEdit {...props} />);
    };
  }

  addFilter("editor.BlockEdit", "mwai-copilot/module", blockEditCopilot);

  const modifyPlaceholder = (settings, name) => {
    if (name === "core/paragraph") {
      const editFn = settings.edit;
      settings.edit = (props) => {
        props = { ...props,
          attributes: { 
            ...props.attributes,
            placeholder: "Type / to choose a block, or press space to summon the AI Copilot",
          },
        };
        return editFn(props);
      };
    }
    return settings;
  };

  addFilter("blocks.registerBlockType", "mwai-copilot/placeholder", modifyPlaceholder);
  
  setTimeout(() => {
    console.log("Extra setup call");
  }, 2000); 
}

export default BlockCopilot;