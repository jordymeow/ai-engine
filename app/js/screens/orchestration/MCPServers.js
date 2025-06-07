// Previous: none
// Current: 2.8.3

// React & Vendor Libs
const { useCallback, useState } = wp.element;
import { nekoStringify } from '@neko-ui';

import { NekoTypo, NekoTabs, NekoTab, NekoButton, NekoSettings, NekoInput,
  NekoAccordions, NekoAccordion, NekoMessage, NekoSelect, NekoOption } from '@neko-ui';
import i18n from '@root/i18n';
import { toHTML } from '@app/helpers-admin';

function MCPServersSettings({ options, mcpServers, updateMCPServer, updateOption, busy }) {
  const [validationErrors, setValidationErrors] = useState({});

  const validateUniqueName = (name, currentId) => {
    return !mcpServers.some(server => server.name === name && server.id !== currentId);
  };

  const addNewMCPServer = () => {
    let baseName = 'New MCP Server';
    let counter = 1;
    let newName = baseName;
    
    while (mcpServers.some(server => server.name === newName)) {
      newName = `${baseName} ${counter}`;
      counter++;
    }

    const newServer = {
      name: newName,
      type: 'url',
      url: '',
      token: ''
    };
    const updatedServers = [...mcpServers, newServer];
    updateOption(updatedServers, 'mcp_envs');
  };

  const deleteMCPServer = (id) => {
    if (mcpServers.length === 1) {
      alert("You can't delete the last MCP server.");
      return;
    }
    const updatedServers = mcpServers.filter(server => server.id !== id);
    updateOption(updatedServers, 'mcp_envs');
  };

  const handleNameChange = useCallback((serverId, value) => {
    if (!validateUniqueName(value, serverId)) {
      setValidationErrors(prev => ({ ...prev, [serverId]: 'Name must be unique' }));
      return;
    }
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[serverId];
      return newErrors;
    });
    updateMCPServer(serverId, { name: value });
  }, [mcpServers, updateMCPServer]);

  const handleURLChange = useCallback((serverId, value) => {
    updateMCPServer(serverId, { url: value });
  }, [updateMCPServer]);

  const handleTokenChange = useCallback((serverId, value) => {
    updateMCPServer(serverId, { token: value });
  }, [updateMCPServer]);

  return (
    <div style={{ padding: '0px 10px 5px 10px', marginTop: 13, marginBottom: 5 }}>
      <NekoTypo h2 style={{ color: 'white', marginBottom: 15 }}>
        {i18n.COMMON.MCP_SERVERS}
      </NekoTypo>
      <NekoTabs inversed style={{ marginTop: -5 }} action={
        <NekoButton rounded className="secondary" icon='plus' onClick={addNewMCPServer} />}>
        {mcpServers.map((server) => {
          return (<NekoTab key={server.id} title={server.name} busy={busy}>
            <NekoSettings title={i18n.COMMON.NAME}>
              <NekoInput name="name" value={server.name}
                error={validationErrors[server.id]}
                description="The name must be unique across all MCP servers"
                onFinalChange={value => handleNameChange(server.id, value)}
              />
            </NekoSettings>

            <NekoSettings title={i18n.COMMON.URL}>
              <NekoInput name="url" value={server.url}
                placeholder="https://example.com/mcp-server"
                description={toHTML(i18n.HELP.MCP_SERVER_URL)}
                onFinalChange={value => handleURLChange(server.id, value)}
              />
            </NekoSettings>

            <NekoSettings title={i18n.COMMON.TOKEN}>
              <NekoInput name="token" value={server.token}
                placeholder="Bearer token for authentication"
                description={toHTML(i18n.HELP.MCP_SERVER_TOKEN)}
                onFinalChange={value => handleTokenChange(server.id, value)}
              />
            </NekoSettings>

            <NekoAccordions keepState="mcpServerCategories">
              <NekoAccordion title={i18n.COMMON.SERVER_ID}>
                <p>
                  The Server ID is "<b>{server.id}</b>".
                </p>
              </NekoAccordion>

              <NekoAccordion title={i18n.COMMON.ACTIONS}>
                <div style={{ display: 'flex', marginTop: 10 }}>
                  <div style={{ flex: 'auto' }} />
                  <NekoButton className="danger"
                    onClick={() => deleteMCPServer(server.id)}>
                    {i18n.COMMON.DELETE}
                  </NekoButton>
                </div>
              </NekoAccordion>
            </NekoAccordions>

          </NekoTab>);
        })}
      </NekoTabs>
    </div>
  );
}

export default MCPServersSettings;