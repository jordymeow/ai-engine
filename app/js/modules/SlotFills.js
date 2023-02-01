// Previous: 0.1.0
// Current: 0.6.6

const { useState, useEffect, useMemo } = wp.element;
const { __ } = wp.i18n;
const { registerPlugin } = wp.plugins;
const { Button } = wp.components;
const { PluginDocumentSettingPanel, PluginBlockSettingsMenuItem } = wp.editPost;

import { NekoWrapper } from '@neko-ui';

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
  const [postForTitle, setPostForTitle] = useState();
  const [postForExcerpt, setPostForExcerpt] = useState();

  const { getCurrentPost } = wp.data.select("core/editor");
  
  useEffect(() => {
    const post = getCurrentPost();
    if (post) {
      setPostForTitle({ postId: post.id, postTitle: post.title });
    }
  }, []);

  const { getCurrentPost: getPost } = wp.data.select("core/editor");
  
  useEffect(() => {
    const post = getPost();
    if (post) {
      setPostForExcerpt({ postId: post.id, postTitle: post.title });
    }
  }, []);

  const onTitlesModalOpen = () => {
    const post = getCurrentPost();
    if (post) {
      setPostForTitle({ postId: post.id, postTitle: post.title });
    }
  }

  const onExcerptsModalOpen = () => {
    const post = getCurrentPost();
    if (post) {
      setPostForExcerpt({ postId: post.id, postTitle: post.title });
    }
  }

  const onTitleClick = async (title) => {
    wp.data.dispatch( 'core/editor' ).editPost({ title });
  }

  const onExcerptClick = async (excerpt) => {
    wp.data.dispatch( 'core/editor' ).editPost({ excerpt });
  }

  return (
    <PluginDocumentSettingPanel name="mwai-document-settings" title={<><AiIcon /> AI Engine</>} className="mwai-document-settings">
      <p>Generate:</p>
      <div style={{ display: 'flex' }}>
        <Button variant='primary' onClick={onTitlesModalOpen} style={{ flex: 1, marginRight: 10 }}>
          <AiIcon icon="wand" style={{ marginRight: 8 }} /> Titles
        </Button>
        <Button variant='primary' onClick={onExcerptsModalOpen} style={{ flex: 1,  }}>
          <AiIcon icon="wand" style={{ marginRight: 8 }} /> Excerpts
        </Button>
      </div>

      <NekoWrapper>
        <GenerateTitlesModal post={postForTitle} onTitleClick={onTitleClick} onClose={setPostForTitle} />
        <GenerateExcerptsModal post={postForExcerpt} onExcerptClick={onExcerptClick} onClose={setPostForExcerpt} />
      </NekoWrapper>
    </PluginDocumentSettingPanel>
  );
};


const setUISlotFill = () => {
  registerPlugin('ai-engine-document-settings', {
    render: MWAI_DocumentSettings
  });
};

export default setUISlotFill;