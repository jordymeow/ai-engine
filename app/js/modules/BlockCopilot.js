// Previous: 2.3.5
// Current: 2.5.6

/* eslint-disable react/display-name */
// React & Vendor Libs
const { addFilter } = wp.hooks;
const { useState, useRef, useEffect } = wp.element;
const { TextControl, Spinner, ProgressBar, ToggleControl, Card, CardBody } = wp.components;
const { dispatch } = wp.data;

// NekoUI
import { nekoFetch } from '@neko-ui';

// AI Engine
import AiIcon from "../styles/AiIcon";
import { apiUrl, restNonce } from '@app/settings';
import { getPostContent } from '@app/helpers-admin';

const SHORTCUT_NAME = 'mwai-copilot/prevent-new-block';

const BlockCopilot = () => {
  const EnhancedParagraphBlock = (props) => {
    const aiTextControlRef = useRef();
    const [ display, setDisplay ] = useState(false);
    const [ query, setQuery ] = useState('');
    const [ busy, setBusy ] = useState(false);
    const [ composing, setComposing ] = useState(false);
    const [ isImageMode, setIsImageMode ] = useState(false);
    const postId = wp.data.select('core/editor').getCurrentPostId();

    const handleKeyPress = (e) => {
      if (composing) return;
      const actualContent = (e?.target?.innerText || '').trim();
      const localName = e?.target?.localName;
      if (e.code === 'Space' && !actualContent && localName === 'p') {
        e.preventDefault();
        setDisplay(true);
      }
    };

    const executeQuery = async (query) => {
      const context = getPostContent("[== CURRENT BLOCK ==]");
      try {
        setBusy(true);
        const res = await nekoFetch(`${apiUrl}/ai/copilot`, {
          method: 'POST',
          nonce: restNonce,
          json: {
            action: isImageMode ? 'image' : 'text',
            message: query,
            context,
            postId
          },
        });
        if (isImageMode) {
          const { media } = res.data;
          const { createBlock } = wp.blocks;
          const { replaceBlock } = wp.data.dispatch('core/block-editor');
          const { getSelectedBlockClientId } = wp.data.select('core/block-editor');
          const imageBlock = createBlock('core/image', {
            id: media.id,
            url: media.url,
            title: media.title,
            caption: media.caption,
            alt: media.alt,
          });
          const selectedBlockClientId = getSelectedBlockClientId();
          replaceBlock(selectedBlockClientId, imageBlock);
        }
        else {
          props.setAttributes({ content: res.data });
        }

        setTimeout(() => {
          const { getSelectedBlockClientId } = wp.data.select("core/block-editor");
          const block = document.querySelector(`[data-block="${getSelectedBlockClientId()}"]`);
          if (block) {
            const range = document.createRange();
            const sel = window.getSelection();
            range.setStart(block, 1);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }, 50);
      }
      catch (e) {
        console.error("Error:", e.message);
        dispatch('core/notices').createErrorNotice(
          `AI Copilot error: ${e.message}`, { isDismissible: true }
        );
      }
      finally {
        setBusy(false);
        setDisplay(false);
        setQuery('');
      }
    };

    const onAiTextKeyDown = async (e) => {
      if (composing) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        await executeQuery(query);
      }
      else if (e.key === 'Escape' || (e.key === 'Backspace' && !query)) {
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

    useEffect(() => {
      const handleEnterKey = (event) => {
        if (display && event.key === 'Enter') {
          event.preventDefault();
          return false;
        }
      };

      dispatch('core/keyboard-shortcuts').registerShortcut({
        name: SHORTCUT_NAME,
        category: 'block',
        description: 'Prevent new block creation when AI Copilot is active',
        keyCombination: {
          character: 'enter',
        },
      });

      window.addEventListener('keydown', handleEnterKey, true);

      return () => {
        window.removeEventListener('keydown', handleEnterKey, true);
        dispatch('core/keyboard-shortcuts').unregisterShortcut(SHORTCUT_NAME);
      };
    }, [display]);

    if (display) {
      return (
        <Card>
          <CardBody>
            {!busy ? (
              <>
                <TextControl
                  ref={aiTextControlRef}
                  label={<><AiIcon icon="wand" style={{ marginBottom: -4 }} />AI Copilot</>}
                  value={query}
                  placeholder={isImageMode ? "Describe the image..." : "Write about..."}
                  onChange={(value) => setQuery(value)}
                  onKeyDown={onAiTextKeyDown}
                  onCompositionStart={() => setComposing(true)}
                  onCompositionEnd={() => setComposing(false)}
                />
                <div style={{ display: 'flex', justifyContent: 'end', marginBottom: -12 }}>
                  <ToggleControl label="Image Mode" checked={isImageMode} onChange={setIsImageMode} />
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: 20 }}>
                <ProgressBar />
              </div>
            )}
          </CardBody>
        </Card>
      );
    }
    return (
      <div
        onCompositionStart={() => setComposing(true)}
        onCompositionEnd={() => setComposing(false)}
        onKeyDown={handleKeyPress}
      >
        <props.BlockEdit {...props} />
      </div>
    );
  };

  const blockEditCopilot = (BlockEdit) => {
    return (props) => {
      if (props.name === 'core/paragraph') {
        return <EnhancedParagraphBlock BlockEdit={BlockEdit} {...props} />;
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