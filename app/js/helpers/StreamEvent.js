// Previous: none
// Current: 2.8.3

import { STREAM_TYPES, STREAM_VISIBILITY, getDefaultVisibility } from '../constants/streamTypes';

export class StreamEvent {
  constructor(options = {}) {
    this.options = {
      showDebug: false,
      showThinking: false,
      collapseTools: true,
      ...options
    };
    
    this.contentBuffer = '';
    this.messageGroups = [];
    this.currentGroup = null;
  }
  
  processMessage(message) {
    const { type, subtype, data, visibility, metadata, timestamp } = message;
    
    if (type === 'error' || type === 'end') {
      return { type, data };
    }
    
    if (type !== 'live') {
      return null;
    }
    
    if (!this.shouldShowMessage(subtype, visibility)) {
      return null;
    }
    
    switch (subtype) {
      case STREAM_TYPES.CONTENT:
        return this.handleContent(data);
      case STREAM_TYPES.THINKING:
        return this.handleThinking(data);
      case STREAM_TYPES.TOOL_CALL:
        return this.handleToolCall(data, metadata);
      case STREAM_TYPES.TOOL_RESULT:
        return this.handleToolResult(data, metadata);
      case STREAM_TYPES.STATUS:
        return this.handleStatus(data, metadata);
      case STREAM_TYPES.MCP_DISCOVERY:
        return this.handleMcpDiscovery(data, metadata);
      case STREAM_TYPES.WEB_SEARCH:
      case STREAM_TYPES.FILE_SEARCH:
      case STREAM_TYPES.IMAGE_GEN:
        return this.handleOperation(subtype, data, metadata);
      case STREAM_TYPES.DEBUG:
        return this.handleDebug(data, metadata);
      default:
        return this.handleContent(data);
    }
  }
  
  shouldShowMessage(subtype, visibility) {
    if (visibility === STREAM_VISIBILITY.HIDDEN && !this.options.showDebug) {
      return false;
    }
    if (subtype === STREAM_TYPES.THINKING && !this.options.showThinking) {
      return false;
    }
    if (subtype === STREAM_TYPES.DEBUG && !this.options.showDebug) {
      return false;
    }
    return true;
  }
  
  handleContent(data) {
    this.contentBuffer += data;
    return {
      type: 'content',
      data: this.contentBuffer,
      display: 'stream'
    };
  }
  
  handleThinking(data) {
    return {
      type: 'thinking',
      data: data,
      display: 'collapsed',
      className: 'mwai-thinking'
    };
  }
  
  handleToolCall(data, metadata) {
    const toolInfo = {
      type: 'tool_call',
      data: data,
      metadata: metadata,
      display: this.options.collapseTools ? 'collapsed' : 'inline',
      className: 'mwai-tool-call'
    };
    
    this.currentGroup = {
      type: 'tool_group',
      tool: metadata?.tool_name,
      messages: [toolInfo]
    };
    
    return toolInfo;
  }
  
  handleToolResult(data, metadata) {
    const result = {
      type: 'tool_result',
      data: data,
      metadata: metadata,
      display: 'collapsed',
      className: 'mwai-tool-result'
    };
    
    if (this.currentGroup?.type === 'tool_group') {
      this.currentGroup.messages.push(result);
      this.messageGroups.push(this.currentGroup);
      this.currentGroup = null;
    }
    
    return result;
  }
  
  handleStatus(data, metadata) {
    return {
      type: 'status',
      data: data,
      metadata: metadata,
      display: 'badge',
      className: 'mwai-status'
    };
  }
  
  handleMcpDiscovery(data, metadata) {
    return {
      type: 'mcp_discovery',
      data: data,
      metadata: metadata,
      display: 'collapsed',
      className: 'mwai-mcp-discovery',
      summary: `Discovering MCP tools from ${metadata?.server_name || 'server'}...`
    };
  }
  
  handleOperation(operation, data, metadata) {
    const operationNames = {
      [STREAM_TYPES.WEB_SEARCH]: 'Searching the web',
      [STREAM_TYPES.FILE_SEARCH]: 'Searching files',
      [STREAM_TYPES.IMAGE_GEN]: 'Generating image'
    };
    
    return {
      type: operation,
      data: data,
      metadata: metadata,
      display: 'progress',
      className: `mwai-${operation.replace('_', '-')}`,
      summary: operationNames[operation] || 'Processing...'
    };
  }
  
  handleDebug(data, metadata) {
    return {
      type: 'debug',
      data: data,
      metadata: metadata,
      display: 'monospace',
      className: 'mwai-debug'
    };
  }
  
  reset() {
    this.contentBuffer = '';
    this.messageGroups = [];
    this.currentGroup = null;
  }
  
  getFinalContent() {
    return this.contentBuffer;
  }
  
  getMessageGroups() {
    return this.messageGroups;
  }
}