// Previous: 2.8.5
// Current: 2.9.3

/* eslint-disable no-console */
// React & Vendor Libs
// const { useMemo, useState, useEffect } = wp.element;

// NekoUI
import { NekoButton, NekoBlock, NekoSettings, NekoInput, NekoCheckbox, NekoColumn, NekoWrapper, NekoLog } from '@neko-ui';

import i18n from '@root/i18n';
import { toHTML, retrievePostContent, runTasks } from '@app/helpers-admin';
import { refreshLogs, clearLogs, optimizeDatabase } from '@app/requests';

const DevToolsTab = ({ options, updateOption, setOptions, busy }) => {
  const debug_mode = options?.debug_mode;
  const module_mcp = options?.module_mcp;
  const server_debug_mode = options?.server_debug_mode;
  const mcp_debug_mode = options?.mcp_debug_mode;
  const queries_debug_mode = options?.queries_debug_mode;
  const dev_mode = options?.dev_mode;

  const onGetContentClick = async () => {
    const postId = prompt('Enter the Post ID you want to retrieve the content from.');
    if (postId == null || postId === '') {
      return false;
    }
    const content = await retrievePostContent(null, null, postId);
    console.log(`Data for Post ID ${postId}`, content);
    if (content && content.content != null) {
      const cleanContent = content.content.trim().replace(/<[^>]*>?/gm, '');
      const firstWord = cleanContent.split(' ')[0];
      const lastWord = cleanContent.split(' ').pop();
      console.log(`Content First Word: ${firstWord}`);
      console.log(`Content Last Word: ${lastWord}`);
    }
  };

  const onRunTask = async () => {
    await runTasks();
  };

  const onOptimizeDatabase = async () => {
    const confirmMsg = 'This will:\n\n' +
      '1. Add database indexes to optimize query performance\n' +
      '2. Remove logs older than 3 months\n' +
      '3. Remove chat discussions older than 3 months\n\n' +
      'This action cannot be undone. Continue?';
    
    if (confirm(confirmMsg) === false) {
      return;
    }
    
    try {
      const result = await optimizeDatabase();
      alert(`Database optimization completed!\n\n${result.message || 'Indexes added and old data cleaned up successfully.'}`);
    } catch (error) {
      alert(`Optimization failed: ${error.message}`);
    }
  };

  const jsxDevMode =
    <NekoSettings title={i18n.COMMON.DEV_MODE}>
      <NekoCheckbox name="dev_mode" label={i18n.COMMON.ENABLE} value="1" checked={dev_mode}
        description={i18n.COMMON.DEV_MODE_HELP}
        onChange={updateOption} />
    </NekoSettings>;
  const jsxDebugMode =
    <NekoSettings title={i18n.COMMON.CLIENT_DEBUG}>
      <NekoCheckbox name="debug_mode" label={i18n.COMMON.ENABLE} value="1" checked={debug_mode}
        description={i18n.COMMON.CLIENT_DEBUG_HELP}
        onChange={updateOption} />
    </NekoSettings>;

  const jsxServerDebugMode =
    <NekoSettings title={i18n.COMMON.SERVER_DEBUG}>
      <NekoCheckbox name="server_debug_mode" label={i18n.COMMON.ENABLE} value="1" checked={server_debug_mode}
        description={i18n.COMMON.SERVER_DEBUG_HELP}
        onChange={updateOption} />
    </NekoSettings>;

  const jsxMcpDebugMode = module_mcp ? (
    <NekoSettings title={i18n.COMMON.MCP_DEBUG}>
      <NekoCheckbox name="mcp_debug_mode" label={i18n.COMMON.ENABLE} value="1" checked={mcp_debug_mode}
        description={i18n.COMMON.MCP_DEBUG_HELP}
        onChange={updateOption} />
    </NekoSettings>
  ) : null;

  const jsxQueriesDebugMode =
    <NekoSettings title={i18n.COMMON.QUERIES_DEBUG}>
      <NekoCheckbox name="queries_debug_mode" label={i18n.COMMON.ENABLE} value="1" checked={queries_debug_mode}
        description={i18n.COMMON.QUERIES_DEBUG_HELP}
        onChange={updateOption} />
    </NekoSettings>;


  return (<>
    <NekoWrapper>
      <NekoColumn minimal>
        <NekoBlock title="Debugging" className="primary" busy={busy}>
          <NekoButton onClick={onGetContentClick}>Get Content</NekoButton>
          <p>This button will display the content of the post, as seen by AI Engine, in your Developer Tools Console. That allows you to check what AI Engine uses when using Content Aware, Embeddings Sync, etc.</p>
          <NekoButton onClick={onRunTask}>Run Tasks</NekoButton>
          <p>This button will force the AI Engine to run the tasks. Normally, the AI Engine runs the tasks every 10 minutes. This button will force the AI Engine to run the tasks immediately.
          </p>
        </NekoBlock>
        
        <NekoBlock title="Settings" className="primary" busy={busy}>
          {jsxDevMode}
          <h3 style={{ marginTop: 20, marginBottom: 10 }}>Logs Console</h3>
          {jsxDebugMode}
          {jsxServerDebugMode}
          <h3 style={{ marginTop: 20, marginBottom: 10 }}>PHP Error Logs</h3>
          {jsxMcpDebugMode}
          {jsxQueriesDebugMode}
        </NekoBlock>
        
        <NekoBlock title="Optimization" className="primary" busy={busy}>
          <NekoButton onClick={onOptimizeDatabase}>Optimize Database</NekoButton>
          <p>{toHTML('This will add indexes to the AI Engine database tables to improve query performance, and clean up old data (logs and discussions older than 3 months). <b>Use this if you notice the plugin becoming slower over time.</b>')}</p>
        </NekoBlock>
      </NekoColumn>
      <NekoColumn minimal>
        {server_debug_mode &&
          <NekoLog
            refreshQuery={refreshLogs}
            clearQuery={clearLogs}
            i18n={i18n}
          />
        }
      </NekoColumn>
    </NekoWrapper>
  </>);

};

export default DevToolsTab;