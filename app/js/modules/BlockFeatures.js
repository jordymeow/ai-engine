// Previous: 1.9.85
// Current: 2.0.2

const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
const { registerPlugin } = wp.plugins;
const { Button, ToolbarDropdownMenu, ToolbarGroup, Spinner, MenuGroup, MenuItem } = wp.components;
const { BlockControls } = wp.blockEditor;
const { PluginDocumentSettingPanel } = wp.editPost;
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

// SlotFills Reference
// https://developer.wordpress.org/block-editor/reference-guides/slotfills/

// Plugin Block Settings Menu Item Reference
// https://developer.wordpress.org/block-editor/reference-guides/slotfills/plugin-block-settings-menu-item/

function BlockAIWand() {
  const [ busy, setBusy ] = useState(false);
  const [ results, setResults ] = useState([]);
  const selectedBlock = useSelect((select) => select('core/block-editor').getSelectedBlock(), []);

  if (!selectedBlock) { return null; }
  if (selectedBlock.name !== 'core/paragraph') {
    return null;
  }

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
    const blockElement = document.getElementById('block-' + selectedBlock.clientId);
    if (!blockElement) {
      console.warn("AI Engine: Could not find block element.");
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
    const blockElement = document.getElementById('block-' + selectedBlock.clientId);
    if (!blockElement) {
      console.warn("AI Engine: Could not find block element.");
      return;
    }
    applyFadeOutStyle(blockElement);
  };

  const resetBlockStyle = () => {
    const blockElement = document.getElementById('block-' + selectedBlock.clientId);
    if (!blockElement) {
      console.warn("AI Engine: Could not find block element.");
      return;
    }
    applyNormalStyle(blockElement);
  };

  const replaceText = (newText) => {
    const { getSelectionStart, getSelectionEnd } = wp.data.select('core/block-editor');
    const selectedBlock = wp.data.select('core/block-editor').getSelectedBlock();
    if (!selectedBlock) { return; }
    const blockContent = selectedBlock.attributes.content;
    const startOffset = getSelectionStart() ? getSelectionStart().offset : 0;
    const endOffset = getSelectionEnd() ? getSelectionEnd().offset : 0;
    const updatedContent = blockContent.substring(0, startOffset) + newText + blockContent.substring(endOffset);
    wp.data.dispatch('core/block-editor').updateBlockAttributes(selectedBlock.clientId, { content: updatedContent });
  };

  const updateText = (text) => {
    wp.data.dispatch('core/block-editor').updateBlockAttributes(selectedBlock.clientId, { content: text });
  };

  const onClick = (text) => {
    setResults([]);
    if (!text) { return; }
    replaceText(text);
  };

  const contentAttr = selectedBlock.attributes.content;
  const selectedText = window.getSelection().toString();

  const doAction = async (action) => {
    const { getSelectedBlockClientId, getBlockIndex, getCurrentPost } = wp.data.select("core/editor");
    const selectedBlockClientId = getSelectedBlockClientId();
    const blockIndex = getBlockIndex(selectedBlockClientId);
    const { id: postId } = getCurrentPost();
    setBusy(true);
    setBlockStyle();
    document.activeElement.blur();
    const res = await nekoFetch(`${apiUrl}/ai/magic_wand`, { 
      method: 'POST',
      nonce: restNonce,
      json: { action, data: { postId, text: contentAttr, selectedText } }
    });
    resetBlockStyle();
    setBusy(false);
    if (!res.success) {
      throw new Error(res.message);
    }
    else {
      const { mode, result, results } = res.data;
      if (mode === 'replace') {
        updateText(result);
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
              <MenuItem disabled={!selectedText} onClick={() => doAction('suggestSynonyms')}>
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
      isOpen={results?.length > 0}
      results={results}
      onClick={onClick}
      onClose={() => setResults([])}
    />
  </>);
}

const MWAI_DocumentSettings = () => {
  const suggestionsEnabled = options?.module_suggestions;
  const [postForTitle, setPostForTitle] = useState(null);
  const [postForExcerpt, setPostForExcerpt] = useState(null);

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

  return (
    <NekoUI>
      <PluginDocumentSettingPanel name="mwai-document-settings" title={<><AiIcon /> AI Engine</>} className="mwai-document-settings">
        <p>Suggest:</p>
        <div style={{ display: 'flex' }}>
          <Button variant='primary' onClick={onTitlesModalOpen} style={{ flex: 1, marginRight: 10 }}>
            <AiIcon icon="wand" style={{ marginRight: 8 }} /> Titles
          </Button>
          <Button variant='primary' onClick={onExcerptsModalOpen} style={{ flex: 1, }}>
            <AiIcon icon="wand" style={{ marginRight: 8 }} /> Excerpts
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

  registerFormatType('ai-wand/actions', {
    title: 'AI Wand',
    tagName: 'mwai',
    className: null,
    edit: BlockAIWand,
  });
  
};

export default BlockFeatures;