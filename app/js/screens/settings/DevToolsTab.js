// Previous: none
// Current: 1.7.9

// React & Vendor Libs
const { useMemo, useState, useEffect } = wp.element;

// NekoUI
import { NekoButton, NekoInput, NekoTypo, NekoPage, NekoBlock, NekoContainer, NekoSettings, NekoSpacer,
  NekoSelect, NekoOption, NekoTabs, NekoTab, NekoCheckboxGroup, NekoCheckbox, NekoWrapper, NekoMessage,
  NekoCollapsableCategory, NekoColumn, NekoTextArea, NekoIcon, NekoModal } from '@neko-ui';

import { apiUrl, prefix, domain, isRegistered, isPro, restNonce, pluginUrl,
  options as defaultOptions } from '@app/settings';
import i18n from '@root/i18n';
import { retrievePostContent } from '@app/helpers-admin';

const DevToolsTab = ({ options, setOptions }) => {

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
  }

  return (<>
    <p>Those are only for developers, for debugging purposes.</p>
    <NekoBlock>
    <p>This button will display the content of the post, as seen by AI Engine, in your Developer Tools Console. That allows you to check what AI Engine uses when using Content Aware, Embeddings Sync, etc.</p>
    <NekoButton onClick={onGetContentClick}>Get Content</NekoButton>
    </NekoBlock>
  </>);

}

export default DevToolsTab;