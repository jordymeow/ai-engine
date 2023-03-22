// Previous: 0.9.86
// Current: 1.3.68

const { useState, useEffect, useMemo } = wp.element;
const { __ } = wp.i18n;
const { registerPlugin } = wp.plugins;
const { Button } = wp.components;
const { PluginDocumentSettingPanel, PluginBlockSettingsMenuItem } = wp.editPost;
import { options } from '@app/settings';

// NekoUI
import { NekoWrapper, NekoUI } from '@neko-ui';

// UI Engine
import GenerateTitlesModal from "./modals/GenerateTitles";
import GenerateExcerptsModal from './modals/GenerateExcerpts';
import AiIcon from '../styles/AiIcon';

const doOnClick = () => {
	alert("Coming soon! Let me know your feedback and ideas, I will make this awesome for you.");
};

const MWAI_ParagraphBlock_Menu_Generate = () => (
  <>
    <PluginBlockSettingsMenuItem
      allowedBlocks={ [ 'core/paragraph' ] }
      icon={<AiIcon icon="wand" style={{ marginRight: 0 }} />}
      label={<> { __( 'Enhance text' ) }</>}
      onClick={ doOnClick }
    />
    <PluginBlockSettingsMenuItem
      allowedBlocks={ [ 'core/paragraph' ] }
      icon={<AiIcon icon="wand" style={{ marginRight: 0 }} />}
      label={<> { __( 'Translate text' ) }</>}
      onClick={ doOnClick }
    />
  </>
);

registerPlugin('ai-engine-menu-paragraph-generate', {
  render: MWAI_ParagraphBlock_Menu_Generate,
});

const MWAI_DocumentSettings = () => {
  const suggestionsEnabled = options?.module_suggestions;
  const [ postForTitle, setPostForTitle ] = useState();
  const [ postForExcerpt, setPostForExcerpt ] = useState();

  const getCurrentPost = wp.data.select("core/editor").getCurrentPost;

  const onTitlesModalOpen = () => {
    const { id, title, excerpt } = getCurrentPost();
    setPostForTitle({ postId: id, postTitle: title });
  }

  const onExcerptsModalOpen = () => {
    const { id, title, excerpt } = getCurrentPost();
    setPostForExcerpt({ postId: id, postTitle: title });
  }

  const onTitleClick = async (title) => {
    wp.data.dispatch( 'core/editor' ).editPost({ title });
  }

  const onExcerptClick = async (excerpt) => {
    wp.data.dispatch( 'core/editor' ).editPost({ excerpt });
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
          <Button variant='primary' onClick={onExcerptsModalOpen} style={{ flex: 1,  }}>
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

const setUISlotFill = () => {
  registerPlugin('ai-engine-document-settings', {
    render: MWAI_DocumentSettings
  });
};

export default setUISlotFill;