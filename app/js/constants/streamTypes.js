// Previous: none
// Current: 2.8.3

// Define streaming message types (matching PHP constants)
export const STREAM_TYPES = {
  // Content types
  CONTENT: 'content',              // Regular assistant message content
  THINKING: 'thinking',            // AI reasoning/thinking process
  CODE: 'code',                    // Code block content
  
  // Tool/Function types
  TOOL_CALL: 'tool_call',          // Starting a tool/function call
  TOOL_ARGS: 'tool_args',          // Tool arguments (usually hidden)
  TOOL_RESULT: 'tool_result',      // Tool execution result
  MCP_DISCOVERY: 'mcp_discovery',  // MCP tools being discovered
  
  // Search/Generation types
  WEB_SEARCH: 'web_search',        // Web search in progress
  FILE_SEARCH: 'file_search',      // File search in progress
  IMAGE_GEN: 'image_gen',          // Image generation in progress
  EMBEDDINGS: 'embeddings',        // Embeddings operation
  
  // System types
  DEBUG: 'debug',                  // Debug information
  STATUS: 'status',                // Status updates (queued, processing, etc.)
  ERROR: 'error',                  // Error messages
  WARNING: 'warning',              // Warning messages
  TRANSCRIPT: 'transcript',        // Audio transcriptions
  
  // Control types
  START: 'start',                  // Stream started
  END: 'end',                      // Stream completed
  HEARTBEAT: 'heartbeat',          // Keep-alive ping
};

// Message visibility settings
export const STREAM_VISIBILITY = {
  VISIBLE: 'visible',              // Show to user
  HIDDEN: 'hidden',                // Hide from user (debug only)
  COLLAPSED: 'collapsed',          // Show collapsed/summary view
};

// Helper to determine default visibility for each type
export const getDefaultVisibility = (type) => {
  const hiddenTypes = [
    STREAM_TYPES.TOOL_ARGS,
    STREAM_TYPES.DEBUG,
    STREAM_TYPES.HEARTBEAT,
  ];
  
  const collapsedTypes = [
    STREAM_TYPES.THINKING,
    STREAM_TYPES.MCP_DISCOVERY,
    STREAM_TYPES.STATUS,
  ];
  
  if (hiddenTypes.includes(type)) return STREAM_VISIBILITY.HIDDEN;
  if (collapsedTypes.includes(type)) return STREAM_VISIBILITY.COLLAPSED;
  return STREAM_VISIBILITY.VISIBLE;
};