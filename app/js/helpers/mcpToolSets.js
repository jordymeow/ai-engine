// Previous: none
// Current: 3.8.7

// How many tools each MCP set brings, shown next to its switch so a set that is off reads as
// available, not missing. Update when a set gains or loses tools (labs/mcp-core.php, premium/mcp-*.php for the
// Pro sets, labs/mcp-rest.php makes 5 per resource; mcp_ping is a protocol check, not counted).
export const MCP_SET_TOOLS = {
  core: 45, plugins: 15, themes: 15, database: 1, woocommerce: 25, polylang: 11, wpml: 11, rest: 15
};

export const MCP_TOTAL_TOOLS = Object.values( MCP_SET_TOOLS ).reduce( ( a, b ) => a + b, 0 );
