// Previous: 2.8.3
// Current: 3.1.3

// React & Vendor Libs
const { useState } = wp.element;
import { useQuery } from '@tanstack/react-query';

import { NekoTypo, NekoButton, NekoSpacer, NekoBlock, NekoAccordions, NekoAccordion } from '@neko-ui';
import i18n from '@root/i18n';

function MCPFunctions({ options }) {
  // Fetch MCP functions
  const { data: mcpFunctions, isLoading: functionsLoading, refetch, isRefetching } = useQuery({
    queryKey: ['mcp-functions', options?.mcp_core, options?.module_mcp, options?.mcp_plugins, options?.mcp_themes, options?.mcp_dynamic_rest],
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

  // Build action button
  const actionButton = options?.module_mcp && mcpFunctions?.success && mcpFunctions.count >= 0 ? (
    <NekoButton
      size="small"
      className="secondary"
      icon="sync"
      onClick={() => refetch()}
      disabled={isRefetching}
    >
      {isRefetching ? 'Refreshing...' : 'Refreh'}
    </NekoButton>
  ) : null;

  return (
    <>
      <NekoSpacer />
      <NekoBlock
        className="primary"
        title={i18n.COMMON.MCP_FUNCTIONS || 'MCP Functions'}
        action={actionButton}
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
              // Group functions by category
              const functionsByCategory = mcpFunctions.functions.reduce((acc, func) => {
                const category = func.category || 'Others';
                if (!acc[category]) {
                  acc[category] = [];
                }
                acc[category].push(func);
                return acc;
              }, {});

              // Sort categories with 'Others' at the top
              const sortedCategories = Object.keys(functionsByCategory).sort((a, b) => {
                if (a === 'Others') return -1;
                if (b === 'Others') return 1;
                return a.localeCompare(b);
              });

              return (
                <div style={{ marginTop: 15 }}>
                  <NekoAccordions keepState="mcpFunctions">
                    {sortedCategories.map(category => (
                      <NekoAccordion key={category} title={`${category} (${functionsByCategory[category].length})`}>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: 12, marginTop: 10 }}>
                        {functionsByCategory[category].map((func, index) => {
                          const funcId = `${category}-${index}`;

                          return (
                            <div
                              key={funcId}
                              style={{
                                padding: 15,
                                border: '1px solid #ddd',
                                borderRadius: 8,
                                background: '#fafafa'
                              }}
                            >
                              <div style={{
                                fontWeight: 600,
                                fontSize: 14,
                                marginBottom: 6,
                                color: '#1976d2'
                              }}>
                                {func.name}
                              </div>
                              <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: 13 }}
                                dangerouslySetInnerHTML={{ __html: func.description || 'No description available' }}
                              />

                              {func.inputSchema && (
                                <div style={{ marginBottom: func.outputSchema ? 12 : 0 }}>
                                  <div style={{ fontWeight: 600, marginBottom: 5, fontSize: 12, color: '#555' }}>Arguments:</div>
                                  <pre style={{
                                    backgroundColor: '#f5f5f5',
                                    padding: 10,
                                    borderRadius: 4,
                                    fontSize: 11,
                                    overflow: 'auto',
                                    margin: 0,
                                    color: '#333',
                                    border: '1px solid #ddd',
                                    maxHeight: 200
                                  }}>
                                    {JSON.stringify(func.inputSchema, null, 2)}
                                  </pre>
                                </div>
                              )}

                              {func.outputSchema && (
                                <div>
                                  <div style={{ fontWeight: 600, marginBottom: 5, fontSize: 12, color: '#555' }}>Output:</div>
                                  <pre style={{
                                    backgroundColor: '#f5f5f5',
                                    padding: 10,
                                    borderRadius: 4,
                                    fontSize: 11,
                                    overflow: 'auto',
                                    margin: 0,
                                    color: '#333',
                                    border: '1px solid #ddd',
                                    maxHeight: 200
                                  }}>
                                    {JSON.stringify(func.outputSchema, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        </div>
                      </NekoAccordion>
                    ))}
                  </NekoAccordions>
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