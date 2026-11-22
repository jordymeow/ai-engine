// Previous: 3.9.3
// Current: 3.9.5

// How many tools each MCP set brings, shown next to its switch so a set that is off reads as
// available, not missing. Update when a set gains or loses tools (labs/mcp-core.php, premium/mcp-*.php for the
// Pro sets, labs/mcp-rest.php makes 5 per resource; mcp_ping is a protocol check, not counted).
export const MCP_SET_TOOLS = {
  core: 66, plugins: 15, themes: 15, database: 4, aiengine: 21, woocommerce: 31, elementor: 6, beaver: 4, polylang: 11, wpml: 11, rest: 15
};

// Beast Mode (Pro) turns on every curated set at once. Same list as MCP_BEAST_SETS in classes/core.php:
// Abilities and Dynamic REST are left out on purpose (other plugins' code).
export const MCP_BEAST_SETS = [ 'mcp_core', 'mcp_plugins', 'mcp_themes', 'mcp_database', 'mcp_aiengine',
  'mcp_woocommerce', 'mcp_elementor', 'mcp_beaver', 'mcp_polylang', 'mcp_wpml' ];

// Whether a tool set is on, by its own switch or by Beast Mode. Always ask this, never the option alone.
export const isMcpSetOn = ( options, option ) =>
  !!options?.[option] || ( !!options?.mcp_beast && MCP_BEAST_SETS.includes( option ) );

export const MCP_TOTAL_TOOLS = Object.values( MCP_SET_TOOLS ).reduce( ( a, b ) => a + b, 0 );
