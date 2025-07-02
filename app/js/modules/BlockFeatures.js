// Previous: 2.8.4
// Current: 2.8.5

const { useState, useEffect, Fragment } = wp.element;
const { __ } = wp.i18n;
const { registerPlugin } = wp.plugins;
const { Button, ToolbarDropdownMenu, ToolbarGroup, Spinner, MenuGroup, MenuItem } = wp.components;
const { BlockControls } = wp.blockEditor;
const { PluginDocumentSettingPanel } = wp.editor;
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;

//const { PluginBlockSettingsMenuItem } = wp.editPost;
const { registerFormatType } = wp.richText;
const { useSelect } = wp.data;
import { options } from '@app/settings';

// NekoUI
import { nekoFetch } from '@neko-ui';
import { NekoWrapper, NekoUI } from '@neko-ui';

// UI Engine
import { apiUrl, restNonce } from '@app/settings';
import GenerateTitlesModal from "./modals/GenerateTitles";
import GenerateExcerptsModal from './modals/GenerateExcerpts';
import AiIcon from '../styles/AiIcon';
import MagicWandModal from './modals/MagicWandModal';
import { getPostContent } from '@app/helpers-admin';

// SlotFills Reference
// https://developer.wordpress.org/block-editor/reference-guides/slotfills/

// Plugin Block Settings Menu Item Reference
// https://developer.wordpress.org/block-editor/reference-guides/slotfills/plugin-block-settings-menu-item/

function BlockAIWand() {
  const [ busy, setBusy ] = useState(false);
  const [ results, setResults ] = useState([]);
  const [ storedSelectedText, setStoredSelectedText ] = useState('');
  const selectedBlock = useSelect((select) => select('core/block-editor').getSelectedBlock(), []);

  if (!selectedBlock) { return null; }
  
  const applyFadeOutStyle = (element) => {
    element.style.opacity = 0.15;
    element.style.pointerEvents = 'none';
    element.style.userSelect = 'none';
    element.style.animation = 'neko-fade-animation 0.85s infinite linear';
  };

  const applyNormalStyle = (element) => {
    element.style.opacity = 1;
    element.style.pointerEvents = 'auto';
    element.style.userSelect = 'auto';
    element.style.animation = 'none';
  };

  useEffect(() => {
    if (!selectedBlock?.clientId) { return; }
    let blockElement = document.getElementById('block-' + selectedBlock.clientId);
    if (!blockElement) {
      blockElement = document.querySelector(`[data-block="${selectedBlock.clientId}"]`);
    }
    if (!blockElement) {
      blockElement = document.querySelector(`.wp-block[data-block="${selectedBlock.clientId}"]`);
    }
    if (!blockElement) {
      console.warn("AI Engine: Could not find block element for", selectedBlock.name, selectedBlock.clientId);
      return;
    }
    if (busy) {
      applyFadeOutStyle(blockElement);
    }
    else {
      applyNormalStyle(blockElement);
    }
  }, [busy, selectedBlock]);

  const setBlockStyle = () => {
    let blockElement = document.getElementById('block-' + selectedBlock.clientId);
    if (!blockElement) {
      blockElement = document.querySelector(`[data-block="${selectedBlock.clientId}"]`);
    }
    if (!blockElement) {
      blockElement = document.querySelector(`.wp-block[data-block="${selectedBlock.clientId}"]`);
    }
    if (!blockElement) {
      console.warn("AI Engine: Could not find block element for", selectedBlock.name, selectedBlock.clientId);
      return;
    }
    applyFadeOutStyle(blockElement);
  };

  const resetBlockStyle = () => {
    let blockElement = document.getElementById('block-' + selectedBlock.clientId);
    if (!blockElement) {
      blockElement = document.querySelector(`[data-block="${selectedBlock.clientId}"]`);
    }
    if (!blockElement) {
      blockElement = document.querySelector(`.wp-block[data-block="${selectedBlock.clientId}"]`);
    }
    if (!blockElement) {
      console.warn("AI Engine: Could not find block element for", selectedBlock.name, selectedBlock.clientId);
      return;
    }
    applyNormalStyle(blockElement);
  };

  const getBlockContent = (block, returnStructured = false) => {
    switch (block.name) {
      case 'core/list':
        if (block.innerBlocks && block.innerBlocks.length > 0) {
          if (returnStructured) {
            const items = block.innerBlocks
              .filter(inner => inner.name === 'core/list-item')
              .map(inner => {
                if (inner.attributes.content) {
                  return inner.attributes.content;
                }
                if (inner.originalContent) {
                  const div = document.createElement('div');
                  div.innerHTML = inner.originalContent;
                  const li = div.querySelector('li');
                  return li ? (li.textContent || li.innerText || '') : '';
                }
                return '';
              });
            return {
              type: 'list',
              items: items
            };
          }
          return block.innerBlocks
            .filter(inner => inner.name === 'core/list-item')
            .map(inner => {
              if (inner.attributes.content) {
                return inner.attributes.content;
              }
              if (inner.originalContent) {
                const div = document.createElement('div');
                div.innerHTML = inner.originalContent;
                const li = div.querySelector('li');
                return li ? (li.textContent || li.innerText || '') : '';
              }
              return '';
            })
            .join('\n');
        }
        if (returnStructured) {
          const listHtml = block.attributes.values || '';
          const div = document.createElement('div');
          div.innerHTML = listHtml;
          const items = Array.from(div.querySelectorAll('li')).map(li => li.textContent || li.innerText || '');
          return {
            type: 'list',
            items: items
          };
        }
        const listHtml = block.attributes.values || '';
        const div2 = document.createElement('div');
        div2.innerHTML = listHtml;
        return div2.textContent || div2.innerText || '';
      case 'core/list-item':
        return block.attributes.content || '';
      case 'core/quote':
        return block.attributes.value || '';
      case 'core/table':
        const tableData = block.attributes.body || [];
        const getCellText = (cellContent) => {
          if (cellContent && typeof cellContent === 'object' && cellContent.originalHTML) {
            const div = document.createElement('div');
            div.innerHTML = cellContent.originalHTML;
            return div.textContent || div.innerText || '';
          }
          if (typeof cellContent === 'string') {
            return cellContent;
          }
          return '';
        };
        if (returnStructured) {
          return {
            type: 'table',
            rows: tableData.map(row => ({
              cells: row.cells ? row.cells.map(cell => getCellText(cell.content)) : []
            }))
          };
        }
        let tableText = '';
        tableData.forEach(row => {
          if (row && row.cells) {
            row.cells.forEach(cell => {
              const txt = getCellText(cell.content);
              if (txt) {
                tableText += txt + ' ';
              }
            });
            tableText += '\n';
          }
        });
        return tableText.trim();
      case 'core/paragraph':
      case 'core/heading':
      default:
        const content = block.attributes.content;
        if (content && typeof content === 'object' && content.originalHTML) {
          const div = document.createElement('div');
          div.innerHTML = content.originalHTML;
          return div.textContent || div.innerText || '';
        }
        return content || '';
    }
  };

  const updateBlockContent = (block, newContent, isStructured = false) => {
    let updateAttrs = {};
    switch (block.name) {
      case 'core/list':
        if (isStructured && typeof newContent === 'object' && newContent.items) {
          const listHtml = newContent.items.map(item => `<li>${item}</li>`).join('');
          updateAttrs = { values: listHtml };
        } else {
          const listItems = newContent.split('\n').filter(i => i.trim());
          const listHtml = listItems.map(i => `<li>${i.trim()}</li>`).join('');
          updateAttrs = { values: listHtml };
        }
        break;
      case 'core/list-item':
        const origContent = block.attributes.content;
        if (origContent && typeof origContent === 'object' && origContent.originalHTML !== undefined) {
          updateAttrs = { 
            content: {
              originalHTML: newContent,
            }
          };
        } else {
          updateAttrs = { content: newContent };
        }
        break;
      case 'core/quote':
        updateAttrs = { value: newContent };
        break;
      case 'core/table':
        if (isStructured && typeof newContent === 'object' && newContent.rows) {
          const originalBody = block.attributes.body || [];
          const body = newContent.rows.map((row, rowIdx) => {
            const origRow = originalBody[rowIdx] || { cells: [] };
            return {
              cells: row.cells.map((cellText, cellIdx) => {
                const origCell = origRow.cells?.[cellIdx];
                return {
                  ...origCell,
                  content: cellText
                };
              })
            };
          });
          updateAttrs = { body };
        } else {
          console.warn('AI Wand: Table requires structured data for proper update');
        }
        break;
      case 'core/paragraph':
      case 'core/heading':
      default:
        updateAttrs = { content: newContent };
        break;
    }
    wp.data.dispatch('core/block-editor').updateBlockAttributes(block.clientId, updateAttrs);
  };

  const replaceText = (newText) => {
    const selectedBlock = wp.data.select('core/block-editor').getSelectedBlock();
    const blockContent = getBlockContent(selectedBlock);
    const textToReplace = storedSelectedText || window.getSelection().toString();
    if (textToReplace && blockContent.includes(textToReplace)) {
      const updatedContent = blockContent.replace(textToReplace, newText);
      updateBlockContent(selectedBlock, updatedContent);
      setStoredSelectedText('');
    } else {
      console.warn('AI Wand: Could not find selection, replacing entire block content');
      updateBlockContent(selectedBlock, newText);
    }
  };

  const updateText = (text) => {
    updateBlockContent(selectedBlock, text, false);
  };

  const onClick = (text) => {
    setResults([]);
    if (!text) {
      setStoredSelectedText('');
      return;
    }
    replaceText(text.trim());
  };

  const doAction = async (action) => {
    const { getSelectedBlockClientId, getBlockIndex, getCurrentPost } = wp.data.select("core/editor");
    const selectedBlockClientId = getSelectedBlockClientId();
    const blockIndex = getBlockIndex(selectedBlockClientId);
    const { id: postId } = getCurrentPost();
    setBusy(true);
    setBlockStyle();
    document.activeElement.blur();
    const isComplexBlock = selectedBlock ? ['core/list', 'core/table'].includes(selectedBlock.name) : false;
    const blockContent = selectedBlock ? getBlockContent(selectedBlock, isComplexBlock) : '';
    const text = isComplexBlock && typeof blockContent === 'object' ? '' : blockContent;
    const selectedText = window.getSelection().toString();
    if (action === 'suggestSynonyms' && selectedText) {
      setStoredSelectedText(selectedText);
    }
    const dataPayload = { postId };
    if (isComplexBlock) {
      dataPayload.json = blockContent;
      dataPayload.blockType = selectedBlock.name;
    } else {
      dataPayload.text = text;
      dataPayload.selectedText = selectedText;
    }
    try {
      const res = await nekoFetch(`${apiUrl}/ai/magic_wand`, {
        method: 'POST',
        nonce: restNonce,
        json: { action, data: dataPayload }
      });
      resetBlockStyle();
      setBusy(false);
      const { mode, result, results, type } = res.data;
      if (mode === 'replace') {
        if (type === 'json' && isComplexBlock) {
          if (typeof result === 'object' && result !== null) {
            updateBlockContent(selectedBlock, result, true);
          } else {
            console.error('AI Wand: Expected JSON object but got:', typeof result);
            alert('Error: Invalid response format from AI');
          }
        } else if (type === 'text' || !isComplexBlock) {
          updateText(result);
        } else {
          console.error('AI Wand: Unexpected response type:', type);
          alert('Error: Unexpected response type');
        }
      }
      else if (mode === 'suggest') {
        setResults(results);
      }
      else if (mode === 'insertMedia') {
        const { media } = res.data;
        const { createBlock } = wp.blocks;
        const block = createBlock('core/image', {
          id: media.id,
          url: media.url,
          title: media.title,
          caption: media.caption,
          alt: media.alt,
        });
        wp.data.dispatch('core/block-editor').insertBlock(block, blockIndex + 1);
      }
    }
    catch (err) {
      resetBlockStyle();
      setBusy(false);
      let errorMessage = 'An error occurred';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      alert("AI Wand Error: " + errorMessage);
      console.error("AI Wand Error:", err);
    }
  };

  return (<>
    <style>
      {`
        @keyframes neko-fade-animation {
          0% { opacity: 0.15; }
          50% { opacity: 0.3; }
          100% { opacity: 0.15; }
        }
    `}
    </style>
    <BlockControls>
      <ToolbarGroup>
        <ToolbarDropdownMenu
          icon={busy ? <Spinner /> : <AiIcon icon="wand" style={{ marginRight: 0 }} />}
          label={__('AI Wand')}>
          {() => (<>
            <MenuGroup>
              <MenuItem onClick={() => doAction('correctText')}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <b>Correct Text</b>
                  <small>Grammar & Spelling</small>
                </div>
              </MenuItem>
              <MenuItem onClick={() => doAction('enhanceText')}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <b>Enhance Text</b>
                  <small>Readibility & Quality</small>
                </div>
              </MenuItem>
              <MenuItem onClick={() => doAction('longerText')}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <b>Longer Text</b>
                  <small>Readibility</small>
                </div>
              </MenuItem>
              <MenuItem onClick={() => doAction('shorterText')}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <b>Shorter Text</b>
                  <small>Readibility</small>
                </div>
              </MenuItem>
              <MenuItem onClick={() => doAction('translateText')}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <b>Translate Text</b>
                  <small>To Post Language</small>
                </div>
              </MenuItem>
            </MenuGroup>
            <MenuGroup>
              <MenuItem disabled={!window.getSelection().toString()} onClick={() => doAction('suggestSynonyms')}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <b>Suggest Synonyms</b>
                  <small>For Selected Words</small>
                </div>
              </MenuItem>
            </MenuGroup>
            <MenuGroup>
              <MenuItem  onClick={() => doAction('generateImage')}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <b>Generate Image</b>
                  <small>For this Text</small>
                </div>
              </MenuItem>
            </MenuGroup>
          </>)}
        </ToolbarDropdownMenu>
      </ToolbarGroup>
    </BlockControls>
    <MagicWandModal
      isOpen={results?.length}
      results={results}
      onClick={onClick}
      onClose={() => setResults([])}
    />
  </>);
}

const translateText = async (text, context) => {
  if (!text) {
    return text;
  }
  const { getCurrentPost } = wp.data.select("core/editor");
  const { id: postId } = getCurrentPost();
  const res = await nekoFetch(`${apiUrl}/ai/magic_wand`, {
    method: 'POST',
    nonce: restNonce,
    json: { action: 'translateSection', data: { postId: postId, context, text } }
  });
  const translation = res.data.result;
  return translation;
  //return text.split(' ').map(word => word.split('').reverse().join('')).join(' ');
};

const translatePost = async () => {
  const { getBlocks, getBlockAttributes } = wp.data.select("core/block-editor");
  const { updateBlockAttributes } = wp.data.dispatch("core/block-editor");
  const { editPost, savePost } = wp.data.dispatch("core/editor");
  const { createInfoNotice, removeNotice } = wp.data.dispatch("core/notices");
  const { getEditedPostAttribute } = wp.data.select("core/editor");
  const noticeId = 'mwai-translation-progress-notice';
  const blocks = getBlocks();
  const originalTitle = getEditedPostAttribute('title');
  const wholeContent = getPostContent();

  const updateProgressNotice = async (progress) => {
    createInfoNotice(`Translating content... ${progress}%`, {
      id: noticeId,
      isDismissible: false,
    });
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  const applyFadeOutStyle = (element) => {
    element.style.opacity = 0.15;
    element.style.pointerEvents = 'none';
    element.style.userSelect = 'none';
    element.style.animation = 'neko-fade-animation 0.85s infinite linear';
  };

  const applyNormalStyle = (element) => {
    element.style.opacity = 1;
    element.style.pointerEvents = 'auto';
    element.style.userSelect = 'auto';
    element.style.animation = 'none';
  };

  blocks.forEach(block => {
    const blockElement = document.querySelector(`[data-block="${block.clientId}"]`);
    if (blockElement) applyFadeOutStyle(blockElement);
  });
  const titleElement = document.querySelector('.editor-post-title__input');
  if (titleElement) applyFadeOutStyle(titleElement);

  await updateProgressNotice(0);

  const totalItems = blocks.length + 2;
  let translatedItems = 0;
  let translatedTitle = '';

  try {
    translatedTitle = await translateText(originalTitle, wholeContent);
    translatedItems++;
    editPost({ title: translatedTitle });
    if (titleElement) applyNormalStyle(titleElement);
    await updateProgressNotice(Math.round((translatedItems / totalItems) * 100));

    for (const block of blocks) {
      if (['core/paragraph', 'core/heading', 'core/list', 'core/list-item', 'core/quote', 'core/table'].includes(block.name)) {
        let content;
        let updateAttrs = {};
        switch (block.name) {
          case 'core/list':
            content = getBlockAttributes(block.clientId).values;
            break;
          case 'core/list-item':
            content = getBlockAttributes(block.clientId).content;
            break;
          case 'core/quote':
            content = getBlockAttributes(block.clientId).value;
            break;
          default:
            content = getBlockAttributes(block.clientId).content;
            break;
        }
        if (content) {
          const translatedContent = await translateText(content, wholeContent);
          switch (block.name) {
            case 'core/list':
              updateAttrs = { values: translatedContent };
              break;
            case 'core/list-item':
              updateAttrs = { content: translatedContent };
              break;
            case 'core/quote':
              updateAttrs = { value: translatedContent };
              break;
            default:
              updateAttrs = { content: translatedContent };
              break;
          }
          await updateBlockAttributes(block.clientId, updateAttrs);
        }
        const blockElement = document.querySelector(`[data-block="${block.clientId}"]`);
        if (blockElement) {
          applyNormalStyle(blockElement);
        }
        wp.data.dispatch('core/block-editor').selectBlock(block.clientId);
      }
      translatedItems++;
      await updateProgressNotice(Math.round((translatedItems / totalItems) * 100));
    }
    const excerpt = getEditedPostAttribute('excerpt');
    if (excerpt) {
      const translatedExcerpt = await translateText(excerpt, wholeContent);
      editPost({ excerpt: translatedExcerpt });
    }
  }
  finally {
    blocks.forEach(block => {
      const blockElement = document.querySelector(`[data-block="${block.clientId}"]`);
      if (blockElement) applyNormalStyle(blockElement);
    });
    removeNotice(noticeId);
  }
};