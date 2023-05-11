// Previous: 1.6.65
// Current: 1.6.76

const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
const { registerPlugin } = wp.plugins;
const { Button, ToolbarDropdownMenu, ToolbarGroup, Spinner, MenuGroup, MenuItem } = wp.components;
const { BlockControls } = wp.blockEditor;
const { PluginDocumentSettingPanel, PluginBlockSettingsMenuItem } = wp.editPost;
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

const fadeOutStyle = `
  opacity: 0.15;
  pointer-events: none;
  user-select: none;
  animation: neko-fade-animation 0.85s infinite linear;
`;

const normalStyle = `
  opacity: 1;
  pointer-events: auto;
  user-select: auto;
  animation: none;
`;

function BlockAIWand({ isActive, onChange, value, ...rest }) {
  const [ busy, setBusy ] = useState(false);
  const [ results, setResults ] = useState([]);
  const selectedBlock = useSelect((select) => select('core/block-editor').getSelectedBlock(), []);

  if (!selectedBlock) { return null; }
  if (selectedBlock.name !== 'core/paragraph') {
    return null;
  }

  useEffect(() => {
    if (!selectedBlock?.clientId) { return; }  
    const blockElement = document.getElementById('block-' + selectedBlock.clientId);
    if (!blockElement) {
      console.warn("AI Engine: Could not find block element.");
      return;
    }
    blockElement.style.cssText = busy ? fadeOutStyle : normalStyle;
  }, [busy, selectedBlock]);

  const setBlockStyle = () => {
    const blockElement = document.getElementById('block-' + selectedBlock.clientId);
    if (!blockElement) {
      console.warn("AI Engine: Could not find block element.");
      return;
    }
    blockElement.style.cssText = fadeOutStyle;
  }

  const resetBlockStyle = () => {
    const blockElement = document.getElementById('block-' + selectedBlock.clientId);
    if (!blockElement) {
      console.warn("AI Engine: Could not find block element.");
      return;
    }
    blockElement.style.cssText = normalStyle;
  }

  const replaceText = (newText) => {
    const { getSelectionStart, getSelectionEnd } = wp.data.select('core/block-editor');
    const selectedBlock = wp.data.select('core/block-editor').getSelectedBlock();
    const blockContent = selectedBlock.attributes.content;
    const startOffset = getSelectionStart().offset;
    const endOffset = getSelectionEnd().offset;
    const updatedContent = blockContent.substring(0, startOffset) + newText + blockContent.substring(endOffset);
    wp.data.dispatch('core/block-editor').updateBlockAttributes(selectedBlock.clientId, { content: updatedContent });
  }

  const updateText = (text) => {
    wp.data.dispatch('core/block-editor').updateBlockAttributes(selectedBlock.clientId, { content: text });
  }

  const onClick = (text) => {
    setResults([]);
    if (!text) { return; }
    replaceText(text);
  }

  const text = selectedBlock.attributes.content;
  const selectedText = window.getSelection().toString();

  const doAction = async (action) => {
    const { getCurrentPost } = wp.data.select("core/editor");
    const { id: postId } = getCurrentPost();
    setBusy(true);
    setBlockStyle();
    document.activeElement.blur();
    const res = await nekoFetch(`${apiUrl}/ai/magic_wand`, { 
      method: 'POST',
      nonce: restNonce,
      json: { action, data: { postId, text, selectedText } }
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
    }
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
              <MenuItem disabled={!selectedText} onClick={() => doAction('suggestSynonyms')}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <b>Suggest Synonyms</b>
                  <small>For Selected Words</small>
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

const doOnClick = () => {
  alert("Coming soon! Let me know your feedback and ideas, I will make this awesome for you.");
};

const MWAI_Block_AI_Actions = () => (
  <>
      <PluginBlockSettingsMenuItem
        allowedBlocks={['core/paragraph']}
        icon={<AiIcon icon="wand" style={{ marginRight: 0 }} />}
        label={<> {__('Enhance text')}</>}
        onClick={doOnClick}
      />
      <PluginBlockSettingsMenuItem
        allowedBlocks={['core/paragraph']}
        icon={<AiIcon icon="wand" style={{ marginRight: 0 }} />}
        label={<> {__('Translate text')}</>}
        onClick={doOnClick}
      />
  </>
);

const MWAI_DocumentSettings = () => {
  const suggestionsEnabled = options?.module_suggestions;
  const [postForTitle, setPostForTitle] = useState();
  const [postForExcerpt, setPostForExcerpt] = useState();

  const onTitlesModalOpen = () => {
    const { getCurrentPost } = wp.data.select("core/editor");
    const { id, title } = getCurrentPost();
    setPostForTitle({ postId: id, postTitle: title });
  }

  const onExcerptsModalOpen = () => {
    const { getCurrentPost } = wp.data.select("core/editor");
    const { id, title } = getCurrentPost();
    setPostForExcerpt({ postId: id, postTitle: title });
  }

  const onTitleClick = async (title) => {
    wp.data.dispatch('core/editor').editPost({ title });
  }

  const onExcerptClick = async (excerpt) => {
    wp.data.dispatch('core/editor').editPost({ excerpt });
  }

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