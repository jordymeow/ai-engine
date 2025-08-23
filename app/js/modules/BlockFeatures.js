// Previous: 2.8.5
// Current: 3.0.4

const { useState, useEffect, Fragment } = wp.element;
const { __ } = wp.i18n;
const { registerPlugin } = wp.plugins;
const { Button, ToolbarDropdownMenu, ToolbarGroup, Spinner, MenuGroup, MenuItem } = wp.components;
const { BlockControls } = wp.blockEditor || {};
const { PluginDocumentSettingPanel } = wp.editor || {};
const { addFilter } = wp.hooks;
const { createHigherOrderComponent } = wp.compose;

const { registerFormatType } = wp.richText;
const { useSelect } = wp.data;
import { options } from '@app/settings';

import { nekoFetch } from '@neko-ui';
import { NekoWrapper, NekoUI } from '@neko-ui';

import { apiUrl, restNonce } from '@app/settings';
import GenerateTitlesModal from "./modals/GenerateTitles";
import GenerateExcerptsModal from './modals/GenerateExcerpts';
import AiIcon from '../styles/AiIcon';
import MagicWandModal from './modals/MagicWandModal';
import { getPostContent } from '@app/helpers-admin';

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
              .filter(innerBlock => innerBlock.name == 'core/list-item')
              .map(innerBlock => {
                if (innerBlock.attributes.content) {
                  return innerBlock.attributes.content;
                }
                if (innerBlock.originalContent) {
                  const tempDiv = document.createElement('div');
                  tempDiv.innerHTML = innerBlock.originalContent;
                  const liElement = tempDiv.querySelector('li');
                  return liElement ? (liElement.textContent || liElement.innerText || '') : '';
                }
                return '';
              });
            return {
              type: 'list',
              items: items
            };
          }
          return block.innerBlocks
            .filter(innerBlock => innerBlock.name == 'core/list-item')
            .map(innerBlock => {
              if (innerBlock.attributes.content) {
                return innerBlock.attributes.content;
              }
              if (innerBlock.originalContent) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = innerBlock.originalContent;
                const liElement = tempDiv.querySelector('li');
                return liElement ? (liElement.textContent || liElement.innerText || '') : '';
              }
              return '';
            })
            .join('\n');
        }
        if (returnStructured) {
          const listHtml = block.attributes.values || '';
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = listHtml;
          const items = Array.from(tempDiv.querySelectorAll('li')).map(li => li.textContent || li.innerText || '');
          return {
            type: 'list',
            items: items
          };
        }
        const listHtml = block.attributes.values || '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = listHtml;
        return tempDiv.textContent || tempDiv.innerText || '';
      case 'core/list-item':
        return block.attributes.content || '';
      case 'core/quote':
        return block.attributes.value || '';
      case 'core/table':
        const tableData = block.attributes.body || [];
        const getCellText = (cellContent) => {
          if (cellContent && typeof cellContent === 'object' && cellContent.originalHTML) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cellContent.originalHTML;
            return tempDiv.textContent || tempDiv.innerText || '';
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
              const text = getCellText(cell.content);
              if (text) {
                tableText += text + ' ';
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
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = content.originalHTML;
          return tempDiv.textContent || tempDiv.innerText || '';
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
          const listItems = newContent.split('\n').filter(item => item.trim());
          const listHtml = listItems.map(item => `<li>${item.trim()}</li>`).join('');
          updateAttrs = { values: listHtml };
        }
        break;
      case 'core/list-item':
        const originalContent = block.attributes.content;
        if (originalContent && typeof originalContent === 'object' && originalContent.originalHTML !== undefined) {
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
          const body = newContent.rows.map((row, rowIndex) => {
            const originalRow = originalBody[rowIndex] || { cells: [] };
            return {
              cells: row.cells.map((cellText, cellIndex) => {
                const originalCell = originalRow.cells?.[cellIndex];
                return {
                  ...originalCell,
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

  if (!BlockControls) {
    return null;
  }

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

const MWAI_DocumentSettings = () => {
  const suggestionsEnabled = options?.module_suggestions;
  const [postForTitle, setPostForTitle] = useState();
  const [postForExcerpt, setPostForExcerpt] = useState();

  const onTranslatePost = async () => {
    await translatePost();
  };

  const onTitlesModalOpen = () => {
    const { getCurrentPost } = wp.data.select("core/editor");
    const { id, title } = getCurrentPost();
    setPostForTitle({ postId: id, postTitle: title });
  };

  const onExcerptsModalOpen = () => {
    const { getCurrentPost } = wp.data.select("core/editor");
    const { id, title } = getCurrentPost();
    setPostForExcerpt({ postId: id, postTitle: title });
  };

  const onTitleClick = async (title) => {
    wp.data.dispatch('core/editor').editPost({ title });
  };

  const onExcerptClick = async (excerpt) => {
    wp.data.dispatch('core/editor').editPost({ excerpt });
  };

  if (!suggestionsEnabled) {
    return null;
  }
  if (!PluginDocumentSettingPanel) {
    return null;
  }

  return (
    <NekoUI>
      <PluginDocumentSettingPanel name="mwai-document-settings" title={<><AiIcon /> AI Engine</>} className="mwai-document-settings">
        <p>Suggest:</p>
        <div style={{ display: 'flex' }}>
          <Button variant='primary' onClick={onTitlesModalOpen} style={{ flex: 1, marginRight: 10, textAlign: 'center' }}>
            <AiIcon icon="wand" style={{ marginRight: 8 }} /> Titles
          </Button>
          <Button variant='primary' onClick={onExcerptsModalOpen} style={{ flex: 1, textAlign: 'center' }}>
            <AiIcon icon="wand" style={{ marginRight: 8 }} /> Excerpts
          </Button>
        </div>
        <div style={{ display: 'flex' }}>
          <Button variant='primary' onClick={onTranslatePost} style={{ flex: 1, marginTop: 10, textAlign: 'center' }}>
            <AiIcon icon="wand" style={{ marginRight: 8 }} /> Translate Post
          </Button>
        </div>

        <NekoUI>
          <NekoWrapper>
            <GenerateTitlesModal post={postForTitle} onTitleClick={onTitleClick} onClose={setPostForTitle} />
            <GenerateExcerptsModal post={postForExcerpt} onExcerptClick={onExcerptClick} onClose={setPostForExcerpt} />
          </NekoWrapper>
        </NekoUI>
      </PluginDocumentSettingPanel>
    </NekoUI>
  );
};


const BlockFeatures = () => {

  registerPlugin('ai-engine-document-settings', {
    render: MWAI_DocumentSettings
  });

  const AIWandWrapper = ({ selectedBlock }) => {
    if (!selectedBlock) return null;
    return <BlockAIWand />;
  };
  
  const withAIWand = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
      const supportedBlocks = ['core/paragraph', 'core/heading', 'core/list', 'core/list-item', 'core/quote', 'core/table'];
      if (!supportedBlocks.includes(props.name)) {
        return <BlockEdit {...props} />;
      }
      const SelectedBlockAIWand = () => {
        const selectedBlock = useSelect((select) => select('core/block-editor').getSelectedBlock(), []);
        if (!selectedBlock || selectedBlock.clientId !== props.clientId) {
          return null;
        }
        return <BlockAIWand />;
      };
      return (
        <Fragment>
          <BlockEdit {...props} />
          <SelectedBlockAIWand />
        </Fragment>
      );
    };
  }, 'withAIWand');

  addFilter(
    'editor.BlockEdit',
    'ai-engine/ai-wand',
    withAIWand
  );

};

// Debug utility for testing AI Wand in browser console
if (typeof window !== 'undefined') {
  window.mwaiWand = {
    getAllBlocks: () => {
      const blocks = wp.data.select('core/block-editor').getBlocks();
      const supportedBlocks = ['core/paragraph', 'core/heading', 'core/list', 'core/list-item', 'core/quote', 'core/table'];
      const processBlock = (block, depth = 0) => {
        const indent = '  '.repeat(depth);
        const isSupported = supportedBlocks.includes(block.name);
        const isComplex = ['core/list', 'core/table'].includes(block.name);
        const getContent = (block, returnStructured = false) => {
          switch (block.name) {
            case 'core/list':
              if (block.innerBlocks && block.innerBlocks.length > 0) {
                if (returnStructured) {
                  const items = block.innerBlocks
                    .filter(innerBlock => innerBlock.name == 'core/list-item')
                    .map(innerBlock => {
                      const content = innerBlock.attributes.content;
                      if (content && typeof content === 'object' && content.originalHTML) {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = content.originalHTML;
                        return tempDiv.textContent || tempDiv.innerText || '';
                      }
                      if (typeof content === 'string') {
                        return content;
                      }
                      if (innerBlock.originalContent) {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = innerBlock.originalContent;
                        const liElement = tempDiv.querySelector('li');
                        return liElement ? (liElement.textContent || liElement.innerText || '') : '';
                      }
                      return '';
                    });
                  return {
                    type: 'list',
                    items: items
                  };
                }
                return block.innerBlocks
                  .filter(innerBlock => innerBlock.name === 'core/list-item')
                  .map(innerBlock => {
                    const content = innerBlock.attributes.content;
                    if (content && typeof content === 'object' && content.originalHTML) {
                      const tempDiv = document.createElement('div');
                      tempDiv.innerHTML = content.originalHTML;
                      return tempDiv.textContent || tempDiv.innerText || '';
                    }
                    if (typeof content === 'string') {
                      return content;
                    }
                    if (innerBlock.originalContent) {
                      const tempDiv = document.createElement('div');
                      tempDiv.innerHTML = innerBlock.originalContent;
                      const liElement = tempDiv.querySelector('li');
                      return liElement ? (liElement.textContent || liElement.innerText || '') : '';
                    }
                    return '';
                  })
                  .join('\n');
              }
              if (returnStructured) {
                const listHtml = block.attributes.values || '';
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = listHtml;
                const items = Array.from(tempDiv.querySelectorAll('li')).map(li => li.textContent || li.innerText || '');
                return {
                  type: 'list',
                  items: items
                };
              }
              const listHtml = block.attributes.values || '';
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = listHtml;
              return tempDiv.textContent || tempDiv.innerText || '';
            case 'core/list-item':
              return block.attributes.content || '';
            case 'core/quote':
              return block.attributes.value || '';
            case 'core/table':
              if (returnStructured) {
                const tableData = block.attributes.body || [];
                return {
                  type: 'table',
                  rows: tableData.map(row => ({
                    cells: row.cells ? row.cells.map(cell => cell.content || '') : []
                  }))
                };
              }
              const tableData = block.attributes.body || [];
              let tableText = '';
              tableData.forEach(row => {
                if (row && row.cells) {
                  row.cells.forEach(cell => {
                    if (cell && cell.content) {
                      tableText += cell.content + ' ';
                    }
                  });
                  tableText += '\n';
                }
              });
              return tableText.trim();
            case 'core/paragraph':
            case 'core/heading':
            default:
              return block.attributes.content || '';
          }
        };
        console.log(`${indent}Block: ${block.name} (ID: ${block.clientId})`);
        console.log(`${indent}  Supported: ${isSupported}`);
        console.log(`${indent}  Attributes:`, block.attributes);
        if (isSupported) {
          const content = getContent(block, isComplex);
          console.log(`${indent}  Content (${isComplex ? 'JSON' : 'text'}):`, content);
          console.log(`${indent}  Payload to API:`, isComplex ? { json: content, blockType: block.name } : { text: content });
        }
        if (block.innerBlocks && block.innerBlocks.length > 0) {
          console.log(`${indent}  Inner blocks:`);
          block.innerBlocks.forEach(innerBlock => processBlock(innerBlock, depth + 1));
        }
      };
      console.log('=== AI Wand Block Analysis ===');
      console.log('Supported block types:', supportedBlocks);
      console.log('\nAll blocks in editor:');
      blocks.forEach(block => processBlock(block));
      console.log('\n=== End of Analysis ===');
      return blocks;
    },
    getSelectedBlock: () => {
      const block = wp.data.select('core/block-editor').getSelectedBlock();
      if (!block) {
        console.log('No block selected');
        return null;
      }
      console.log('Selected block:', block.name);
      console.log('Block ID:', block.clientId);
      console.log('Attributes:', block.attributes);
      console.log('Inner blocks:', block.innerBlocks);
      console.log('Original content:', block.originalContent);
      const isComplexBlock = ['core/list', 'core/table'].includes(block.name);
      const blockContent = window.mwaiWand.getBlockContent(block, isComplexBlock);
      const text = typeof blockContent === 'object' ? '' : blockContent;
      console.log('Content extracted:', blockContent);
      console.log('Text for API:', text);
      console.log('Is complex block:', isComplexBlock);
      if (isComplexBlock) {
        console.log('Payload to API:', { json: blockContent, blockType: block.name });
      } else {
        console.log('Payload to API:', { text: text });
      }
      return block;
    },
    getBlockContent: (block, returnStructured = false) => {
      switch (block.name) {
        case 'core/list':
          if (block.innerBlocks && block.innerBlocks.length > 0) {
            if (returnStructured) {
              const items = block.innerBlocks
                .filter(innerBlock => innerBlock.name === 'core/list-item')
                .map(innerBlock => {
                  const content = innerBlock.attributes.content;
                  if (content && typeof content === 'object' && content.originalHTML) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = content.originalHTML;
                    return tempDiv.textContent || tempDiv.innerText || '';
                  }
                  if (typeof content === 'string') {
                    return content;
                  }
                  if (innerBlock.originalContent) {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = innerBlock.originalContent;
                    const liElement = tempDiv.querySelector('li');
                    return liElement ? (liElement.textContent || liElement.innerText || '') : '';
                  }
                  return '';
                });
              return {
                type: 'list',
                items: items
              };
            }
            return block.innerBlocks
              .filter(innerBlock => innerBlock.name === 'core/list-item')
              .map(innerBlock => {
                const content = innerBlock.attributes.content;
                if (content && typeof content === 'object' && content.originalHTML) {
                  const tempDiv = document.createElement('div');
                  tempDiv.innerHTML = content.originalHTML;
                  return tempDiv.textContent || tempDiv.innerText || '';
                }
                if (typeof content === 'string') {
                  return content;
                }
                if (innerBlock.originalContent) {
                  const tempDiv = document.createElement('div');
                  tempDiv.innerHTML = innerBlock.originalContent;
                  const liElement = tempDiv.querySelector('li');
                  return liElement ? (liElement.textContent || liElement.innerText || '') : '';
                }
                return '';
              })
              .join('\n');
          }
          if (returnStructured) {
            const listHtml = block.attributes.values || '';
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = listHtml;
            const items = Array.from(tempDiv.querySelectorAll('li')).map(li => li.textContent || li.innerText || '');
            return {
              type: 'list',
              items: items
            };
          }
          const listHtml = block.attributes.values || '';
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = listHtml;
          return tempDiv.textContent || tempDiv.innerText || '';
        case 'core/list-item':
          return block.attributes.content || '';
        case 'core/quote':
          return block.attributes.value || '';
        case 'core/table':
          const tableData = block.attributes.body || [];
          const getCellText = (cellContent) => {
            if (cellContent && typeof cellContent === 'object' && cellContent.originalHTML) {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = cellContent.originalHTML;
              return tempDiv.textContent || tempDiv.innerText || '';
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
                const text = getCellText(cell.content);
                if (text) {
                  tableText += text + ' ';
                }
              });
              tableText += '\n';
            }
          });
          return tableText.trim();
        case 'core/paragraph':
        case 'core/heading':
        default:
          return block.attributes.content || '';
      }
    },
    testAction: async (action = 'correctText') => {
      const block = wp.data.select('core/block-editor').getSelectedBlock();
      if (!block) {
        console.error('No block selected');
        return;
      }
      console.log('Testing action:', action, 'on block:', block.name);
      const isComplexBlock = ['core/list', 'core/table'].includes(block.name);
      const blockContent = window.mwaiWand.getBlockContent(block, isComplexBlock);
      const text = typeof blockContent === 'object' ? '' : blockContent;
      const dataPayload = { postId: wp.data.select('core/editor').getCurrentPost().id };
      if (isComplexBlock) {
        dataPayload.json = blockContent;
        dataPayload.blockType = block.name;
      } else {
        dataPayload.text = text;
        dataPayload.selectedText = window.getSelection().toString();
      }
      console.log('Payload:', { action, data: dataPayload });
      try {
        const response = await fetch(`${apiUrl}/ai/magic_wand`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': restNonce
          },
          body: JSON.stringify({ action, data: dataPayload })
        });
        const result = await response.json();
        console.log('Response:', result);
        return result;
      } catch (error) {
        console.error('Error:', error);
      }
    },
    debugListItems: () => {
      const block = wp.data.select('core/block-editor').getSelectedBlock();
      if (!block || block.name !== 'core/list') {
        console.log('Please select a list block');
        return;
      }
      console.log('=== List Block Debug ===');
      console.log('List block attributes:', block.attributes);
      console.log('Number of inner blocks:', block.innerBlocks.length);
      block.innerBlocks.forEach((item, index) => {
        console.log(`\nList item ${index + 1}:`);
        console.log('  Name:', item.name);
        console.log('  Attributes:', item.attributes);
        console.log('  Original content:', item.originalContent);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.originalContent;
        const liElement = tempDiv.querySelector('li');
        const extractedText = liElement ? (liElement.textContent || liElement.innerText || '') : '';
        console.log('  Extracted text:', extractedText);
      });
    },
    help: () => {
      console.log('=== AI Wand Debug Utility ===');
      console.log('Available commands:');
      console.log('  mwaiWand.getAllBlocks() - Show all blocks and their content');
      console.log('  mwaiWand.getSelectedBlock() - Show currently selected block info');
      console.log('  mwaiWand.debugListItems() - Debug list items in selected list');
      console.log('  mwaiWand.getBlockContent(block, structured) - Get content from a block');
      console.log('  mwaiWand.testAction(action) - Test an AI Wand action on selected block');
      console.log('\nAvailable actions: correctText, enhanceText, longerText, shorterText, translateText, suggestSynonyms');
      console.log('\nExample: mwaiWand.testAction("correctText")');
    }
  };
  console.log('AI Wand Debug Utility loaded. Type mwaiWand.help() for usage.');
}