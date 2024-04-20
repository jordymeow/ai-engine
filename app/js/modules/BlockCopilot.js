// Previous: 2.2.70
// Current: 2.2.90

/* eslint-disable react/display-name */

const { addFilter } = wp.hooks;
const { useState, useRef, useEffect } = wp.element;
const { TextControl, Spinner } = wp.components;

import { nekoFetch } from '@neko-ui';

import AiIcon from "../styles/AiIcon";
import { apiUrl, restNonce } from '@app/settings';

const BlockCopilot = () => {

  const blockEditCopilot = (BlockEdit) => {
    return (props) => {
      const aiTextControlRef = useRef();
      const [ display, setDisplay ] = useState(false);
      const [ query, setQuery ] = useState('');
      const [ busy, setBusy ] = useState(false);
      const [ composing, setComposing ] = useState(false);

      const { content } = props.attributes;

      const handleKeyPress = (e) => {
        if (composing) {
          return;
        }
        const actualContent = (e?.target?.innerText || '').trim();
        const localName = e?.target?.localName;
        if (e.code === 'Space' && !actualContent && localName === 'p') {
          e.preventDefault();
          setDisplay(true);
        }
        if (e.code === 'Backspace' && !query && display) {
          e.preventDefault();
          setDisplay(false);
          setQuery('');
        }
      };

      const executeQuery = async (queryStr) => {
        try {
          setBusy(true);
          const res = await nekoFetch(`${apiUrl}/ai/copilot`, {
            method: 'POST',
            nonce: restNonce,
            json: { action: 'write', prompt: queryStr }
          });
          if (res.data !== undefined) {
            props.setAttributes({ content: res.data });
          }
        }
        catch (e) {
          alert("Error: " + e.message);
          console.log("ERROR", e);
        }
        finally {
          setBusy(false);
          setDisplay(false);
          setQuery('');
        }
      };

      const onAiTextKeyDown = (e) => {
        if (composing) {
          return;
        }
        if (e.code === 'Enter') {
          e.preventDefault();
          executeQuery(query);
        }
        if (e.code === 'Escape') {
          e.preventDefault();
          setDisplay(false);
          setQuery('');
        }
        if (e.code === 'Backspace' && !query) {
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
          return (
            <div style={{ position: 'relative' }}>
              <TextControl
                ref={aiTextControlRef}
                label={<><AiIcon icon="wand" style={{ marginBottom: -4 }} />AI Copilot</>}
                value={query}
                disabled={busy}
                placeholder="Write about..."
                onChange={(value) => setQuery(value)}
                onKeyDown={onAiTextKeyDown}
                onCompositionStart={() => setComposing(true)}
                onCompositionEnd={() => setComposing(false)}
              />
              {busy && <Spinner style={{ position: 'absolute', top: 30, right: 0 }} />}
            </div>
          );
        }
        return (
          <div
            onCompositionStart={() => setComposing(true)}
            onCompositionEnd={() => setComposing(false)}
            onKeyDown={handleKeyPress}
          >
            <BlockEdit {...props} />
          </div>
        );
      }
      return <BlockEdit {...props} />;
    };
  };

  addFilter("editor.BlockEdit", "mwai-copilot/module", blockEditCopilot);

  const modifyPlaceholder = (settings, name) => {
    if (name === "core/paragraph") {
      const editFn = settings.edit;
      settings.edit = (props) => {
        props = {
          ...props,
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
};

export default BlockCopilot;