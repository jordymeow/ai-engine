// Previous: none
// Current: 2.8.3

// React & Vendor Libs
const { useState } = wp.element;
import { useQuery } from '@tanstack/react-query';

import { NekoTypo, NekoButton, NekoAccordions, 
  NekoAccordion, NekoSpacer, NekoSpinner, NekoBlock } from '@neko-ui';
import i18n from '@root/i18n';

function MCPFunctions({ options }) {
  const [expandedCategories, setExpandedCategories] = useState({});

  const { data: mcpFunctions, isLoading: functionsLoading, refetch, isRefetching } = useQuery({
    queryKey: ['mcp-functions', options?.module_mcp, options?.mcp_core, options?.mcp_plugins, options?.mcp_themes, options?.mcp_dynamic_rest],
    queryFn: async () => {
      const response = await fetch(`${window.wpApiSettings.root}mwai/v1/mcp/functions`, {
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpApiSettings.nonce
        }
      });
      if (!response.ok) throw new Error('Failed to fetch MCP functions');
      return response.json();
    },
    enabled: options?.module_mcp === true,
    refetchInterval: false
  });

  const headerButtons = options?.module_mcp && mcpFunctions?.success && mcpFunctions.count > 0 ? (
    <NekoButton 
      className="secondary" 
      onClick={() => refetch()}
      disabled={isRefetching}
    >
      {isRefetching ? 'Refreshing...' : 'Refresh'}
    </NekoButton>
  ) : null;

  return (
    <>
      <NekoSpacer />
      <NekoBlock 
        className="primary"
        title={i18n.COMMON.MCP_FUNCTIONS || 'MCP Functions'}
        action={headerButtons}
      >
        {!options?.module_mcp ? (
          <p>Enable MCP module to see available functions.</p>
        ) : functionsLoading ? (
          <p>Loading MCP functions...</p>
        ) : mcpFunctions?.success ? (
          <>
            {mcpFunctions.count === 0 && !options?.mcp_core && !options?.mcp_themes && !options?.mcp_plugins && !options?.mcp_dynamic_rest ? (
              <p>{i18n.COMMON.MCP_NO_OPTIONS}</p>
            ) : (
              <p><strong>{mcpFunctions.count}</strong> functions are currently registered via MCP.</p>
            )}

            {mcpFunctions?.functions && (() => {
              const functionsByCategory = mcpFunctions.functions.reduce((acc, func) => {
                const category = func.category || 'Others';
                if (!acc[category]) {
                  acc[category] = [];
                }
                acc[category].push(func);
                return acc;
              }, {});

              const sortedCategories = Object.keys(functionsByCategory).sort((a, b) => {
                if (a === 'Others') return 1;
                if (b === 'Others') return -1;
                return a.localeCompare(b);
              });

              return (
                <div style={{ marginTop: 10 }}>
                  {sortedCategories.map(category => (
                    <div key={category} style={{ marginBottom: 15 }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #e0e0e0',
                        paddingBottom: 5,
                        marginBottom: 10
                      }}>
                        <NekoTypo h4 style={{ 
                          margin: 0,
                          color: '#333'
                        }}>
                          {category} ({functionsByCategory[category].length})
                        </NekoTypo>
                        <NekoButton
                          size="small"
                          className="secondary"
                          onClick={() => setExpandedCategories(prev => ({
                            ...prev,
                            [category]: !prev[category]
                          }))}
                        >
                          {expandedCategories[category] ? 'Hide Details' : 'Show Details'}
                        </NekoButton>
                      </div>
                      {expandedCategories[category] && (
                        <NekoAccordions keepState={`mcpFunctionDetails-${category}`}>
                          {functionsByCategory[category].map((func, index) => (
                            <NekoAccordion key={`${category}-${index}`} title={func.name}>
                              <div style={{ padding: '10px 0', color: '#333' }}>
                                <p style={{ marginBottom: 10, color: '#333' }}>
                                  <strong>Description:</strong> {func.description || 'No description available'}
                                </p>
                                {func.inputSchema && (
                                  <div style={{ marginBottom: 10, color: '#333' }}>
                                    <strong>Arguments:</strong>
                                    <pre style={{ 
                                      backgroundColor: '#f5f5f5', 
                                      padding: 10, 
                                      borderRadius: 4,
                                      fontSize: 12,
                                      overflow: 'auto',
                                      marginTop: 5,
                                      color: '#333',
                                      border: '1px solid #ddd'
                                    }}>
                                      {JSON.stringify(func.inputSchema, null, 2)}
                                    </pre>
                                  </div>
                                )}

                                {func.outputSchema && (
                                  <div style={{ color: '#333' }}>
                                    <strong>Output:</strong>
                                    <pre style={{ 
                                      backgroundColor: '#f5f5f5', 
                                      padding: 10, 
                                      borderRadius: 4,
                                      fontSize: 12,
                                      overflow: 'auto',
                                      marginTop: 5,
                                      color: '#333',
                                      border: '1px solid #ddd'
                                    }}>
                                      {JSON.stringify(func.outputSchema, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </NekoAccordion>
                          ))}
                        </NekoAccordions>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </>
        ) : (
          <p>Failed to load MCP functions.</p>
        )}
      </NekoBlock>
    </>
  );
}

export default MCPFunctions;