// Previous: 2.8.4
// Current: 2.8.5

/* eslint-disable no-console */
import { NekoButton, NekoBlock, NekoSettings, NekoInput, NekoCheckbox, NekoColumn, NekoWrapper, NekoLog } from '@neko-ui';

import i18n from '@root/i18n';
import { toHTML, retrievePostContent, runTasks } from '@app/helpers-admin';
import { refreshLogs, clearLogs } from '@app/requests';

const DevToolsTab = ({ options, updateOption, setOptions, busy }) => {
  const debug_mode = options?.debug_mode;
  const module_mcp = options?.module_mcp;
  const server_debug_mode = options?.server_debug_mode;
  const mcp_debug_mode = options?.mcp_debug_mode;
  const queries_debug_mode = options?.queries_debug_mode;
  const dev_mode = options?.dev_mode;

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
      const lastWord = cleanContent.split(' ').slice(-1)[0];
      console.log(`Content First Word: ${firstWord}`);
      console.log(`Content Last Word: ${lastWord}`);
    }
  };

  const onRunTask = async () => {
    runTasks();
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