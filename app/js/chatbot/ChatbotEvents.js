// Previous: none
// Current: 2.8.3

const { useState, useMemo, useEffect } = wp.element;
import { ChevronRight, ChevronDown, Activity, Wrench, Brain, Search, AlertCircle, Minimize2, Maximize2, X } from 'lucide-react';

const ChatbotEvents = ({ allStreamData, debugMode, onClear, hasData }) => {
  const [expanded, setExpanded] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [showAll, setShowAll] = useState(true);

  const chunks = useMemo(() => {
    if (!allStreamData || allStreamData.length === 0) {
      return [];
    }

    const processedData = allStreamData.map((data, index) => ({
      ...data,
      id: `${data.messageId}-${index}`,
      displayTime: new Date(data.timestamp).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    })).reverse();

    if (!showAll) {
      return processedData.slice(0, 1);
    }

    return processedData.slice(0, 20);
  }, [allStreamData, showAll]);

  if (!debugMode) {
    return null;
  }

  const getEventCategory = (subtype, metadata) => {
    switch (subtype) {
    case 'tool_call':
    case 'tool_args':
      return 'function';
    case 'tool_result':
      if (metadata?.is_mcp === true) {
        return 'mcp';
      }
      if (metadata?.tool_name && chunks.some(c => 
        c.subtype === 'mcp_tool_call' && 
        c.metadata?.name === metadata.tool_name)) {
        return 'mcp';
      }
      return 'function';
    case 'mcp_discovery':
    case 'mcp_tool_call':
    case 'mcp_tool_result':
      return 'mcp';
    case 'thinking':
      return 'thinking';
    case 'status':
      return 'output';
    case 'web_search':
    case 'file_search':
      return 'search';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'content':
      return 'output';
    default:
      return subtype;
    }
  };

  const getIcon = (category) => {
    switch (category) {
    case 'function':
      return <Wrench size={14} />;
    case 'mcp':
      return <Activity size={14} />;
    case 'thinking':
      return <Brain size={14} />;
    case 'output':
      return <Activity size={14} />;
    case 'search':
      return <Search size={14} />;
    case 'error':
    case 'warning':
      return <AlertCircle size={14} />;
    default:
      return <Activity size={14} />;
    }
  };

  const getCategoryColor = (category, data) => {
    switch (category) {
    case 'function':
      return '#3b82f6';
    case 'mcp':
      return '#8b5cf6';
    case 'thinking':
      return '#8b5cf6';
    case 'output':
      if (data && data.includes('completed')) {
        return '#10b981';
      }
      if (data && (data.includes('started') || data.includes('...'))) {
        return '#06b6d4';
      }
      return '#6b7280';
    case 'search':
      return '#f59e0b';
    case 'error':
      return '#ef4444';
    case 'warning':
      return '#f97316';
    default:
      return '#6b7280';
    }
  };

  const toggleExpanded = (chunkId) => {
    setExpanded(prev => ({
      ...prev,
      [chunkId]: !prev[chunkId]
    }));
  };

  const latestEvent = useMemo(() => {
    if (chunks.length === 0) return null;

    for (const chunk of chunks) {
      const category = getEventCategory(chunk.subtype, chunk.metadata);

      if (chunk.subtype !== 'debug' && chunk.subtype !== 'heartbeat') {
        if (chunk.data.includes('Stream completed')) {
          const completedIndex = chunks.findIndex(c => c.data.includes('Request completed'));
          if (completedIndex >= 0 && completedIndex < chunks.indexOf(chunk)) {
            const completedChunk = chunks[completedIndex];
            return {
              data: completedChunk.data,
              category: getEventCategory(completedChunk.subtype, completedChunk.metadata),
              color: getCategoryColor(getEventCategory(completedChunk.subtype, completedChunk.metadata), completedChunk.data)
            };
          }
        }
        return {
          data: chunk.data,
          category: category,
          color: getCategoryColor(category, chunk.data)
        };
      }
    }
    return null;
  }, [chunks]);

  return (
    <div className={`mwai-chunks ${!isVisible ? 'mwai-chunks-collapsed' : ''}`}>
      <div className="mwai-chunks-header">
        <Activity size={12} />
        <span className="mwai-chunks-title">
          Events
          {latestEvent && (
            <span className="mwai-chunks-status" style={{ color: latestEvent.color }}>
              : {latestEvent.data}
            </span>
          )}
        </span>
        {isVisible && (
          <>
            {chunks.length > 0 && onClear && (
              <div className="mwai-chunks-toggle" onClick={onClear}
                title="Clear stream events">
                <X size={12} />
              </div>
            )}
            <div className="mwai-chunks-toggle" onClick={() => setShowAll(!showAll)}
              title={showAll ? "Show minimal (last event only)" : "Show detailed (all events)"}>
              {showAll ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </div>
          </>
        )}
        <div className="mwai-chunks-toggle" onClick={() => setIsVisible(!isVisible)}
          title={isVisible ? "Hide events" : "Show events"}>
          {isVisible ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </div>
      </div>

      {isVisible && (chunks.length === 0 ? (
        <div className="mwai-chunk">
          <div className="mwai-chunk-header">
            <span className="mwai-chunk-time">--:--:--</span>
            <span className="mwai-chunk-type" style={{ backgroundColor: '#6b7280' }}>
              <Activity size={14} />
              waiting
            </span>
            <span className="mwai-chunk-data">No events yet.</span>
          </div>
        </div>
      ) : chunks.map(chunk => {
        const isExpanded = expanded[chunk.id];
        const hasDetails = chunk.metadata && Object.keys(chunk.metadata).length > 0;
        const category = getEventCategory(chunk.subtype, chunk.metadata);

        return (
          <div key={chunk.id} className="mwai-chunk">
            <div
              className="mwai-chunk-header"
              onClick={() => hasDetails && toggleExpanded(chunk.id)}
            >
              <span className="mwai-chunk-time">{chunk.displayTime}</span>
              <span
                className="mwai-chunk-type"
                style={{ backgroundColor: getCategoryColor(category, chunk.data) }}
              >
                {getIcon(category)}
                {category}
              </span>
              <span className="mwai-chunk-data">
                {chunk.data}
              </span>
              {hasDetails && (
                <ChevronRight
                  size={12}
                  className="mwai-chunk-expand"
                  style={{
                    transform: isExpanded ? 'rotate(90deg)' : 'none'
                  }}
                />
              )}
            </div>

            {isExpanded && hasDetails && (
              <div className="mwai-chunk-details">
                <pre>{JSON.stringify(chunk.metadata, null, 2)}</pre>
              </div>
            )}
          </div>
        );
      }))}
    </div>
  );
};