// Previous: 1.7.9
// Current: 1.9.93

/* eslint-disable no-console */
// React & Vendor Libs
// const { useMemo, useState, useEffect } = wp.element;

// NekoUI
import { NekoButton, NekoBlock, NekoSettings, NekoCheckbox, NekoColumn, NekoWrapper } from '@neko-ui';

import i18n from '@root/i18n';
import { retrievePostContent } from '@app/helpers-admin';

const DevToolsTab = ({ options, updateOption, setOptions }) => {
  const debug_mode = options?.debug_mode;

  const onGetContentClick = async () => {
    const postId = prompt('Enter the Post ID you want to retrieve the content from.');
    if (!postId) {
      return;
    }
    const content = await retrievePostContent(null, null, postId);
    console.log(`Data for Post ID ${postId}`, content);
    if (content?.content) {
      const cleanContent = content.content.trim().replace(/<[^>]*>?/gm, '');
      const firstWord = cleanContent.split(' ')[0];
      const lastWord = cleanContent.split(' ').pop();
      console.log(`Content First Word: ${firstWord}`);
      console.log(`Content Last Word: ${lastWord}`);
    }
  };

  const jsxDebugMode =
    <NekoSettings title={i18n.COMMON.DEBUG_MODE}>
      <NekoCheckbox name="debug_mode" label={i18n.COMMON.ENABLE} value="1" checked={debug_mode}
        description={i18n.COMMON.DEBUG_MODE_HELP}
        onChange={updateOption} />
    </NekoSettings>;

  return (<>
    <NekoWrapper>
      <NekoColumn minimal>  
        <NekoBlock title="Debugging" className="primary">
          <NekoButton onClick={onGetContentClick}>Get Content</NekoButton>
          <p>This button will display the content of the post, as seen by AI Engine, in your Developer Tools Console. That allows you to check what AI Engine uses when using Content Aware, Embeddings Sync, etc.</p>
        </NekoBlock>
      </NekoColumn>
      <NekoColumn minimal>
        <NekoBlock title="Settings" className="primary">
          {jsxDebugMode}
        </NekoBlock>
      </NekoColumn>
    </NekoWrapper>
  </>);

};

export default DevToolsTab;