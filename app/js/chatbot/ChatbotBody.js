// Previous: 2.8.3
// Current: 2.8.5

const { useState, useEffect, useRef, useMemo } = wp.element;
import Markdown from 'markdown-to-jsx';
import { useChatbotContext } from '@app/chatbot/ChatbotContext';
import ChatbotReply from './ChatbotReply';
import ChatbotInput from './ChatbotInput';
import ChatbotSubmit from './ChatbotSubmit';
import ChatUploadIcon from './ChatUploadIcon';
import ChatbotRealtime from './ChatbotRealtime';
import ChatbotEvents from './ChatbotEvents';

const markdownOptions = {
  overrides: {
    a: {
      props: {
        target: "_blank",
      },
    },
  }
};

const ChatbotBody = ({ 
  conversationRef, 
  onScroll, 
  messageList, 
  jsxShortcuts, 
  jsxBlocks,
  inputClassNames,
  handleDrop,
  handleDrag,
  needsFooter,
  needTools,
  uploadIconPosition
}) => {
  const { state, actions } = useChatbotContext();
  const { debugMode, eventLogs, messages, error, isRealtime, textCompliance, chatbotInputRef, isWindow } = state;
  const { resetError } = actions;
  const [allStreamData, setAllStreamData] = useState([]);
  const [clearedMessageIds, setClearedMessageIds] = useState(new Set());
  const streamDataRef = useRef([]);
  const lastMessageCountRef = useRef(0);
  const [realtimeMessages, setRealtimeMessages] = useState([]);
  
  useEffect(() => {
    if (messages.length === 0 || (messages.length === 1 && messages[0].role === 'assistant')) {
      setClearedMessageIds(new Set());
    }
  }, [messages]);
  
  useEffect(() => {
    const newStreamData = [];
    const allMessages = [...messages, ...realtimeMessages];
    allMessages.forEach(message => {
      if (message.streamEvents && debugMode && !clearedMessageIds.has(message.id)) {
        message.streamEvents.forEach(event => {
          newStreamData.push({
            ...event,
            messageId: message.id
          });
        });
      }
    });
    
    if (!isRealtime) {
      streamDataRef.current = newStreamData;
      setAllStreamData(newStreamData);
    }
  }, [messages, realtimeMessages, debugMode, isRealtime, clearedMessageIds]);
  
  const handleClearStreamData = () => {
    setAllStreamData([]);
    streamDataRef.current = [];
    const clearedMessageIds = new Set();
    [...messages, ...realtimeMessages].forEach(msg => {
      if (msg.streamEvents) {
        clearedMessageIds.add(msg.id);
      }
    });
    setClearedMessageIds(clearedMessageIds);
  };

  return (
    <div className="mwai-body">
      {!isRealtime && <>
        <div ref={conversationRef} className="mwai-conversation" onScroll={onScroll}>
          {messageList}
          {jsxShortcuts}
        </div>

        {jsxBlocks}

        <div className={inputClassNames}
          onClick={() => chatbotInputRef.current?.focusInput()}
          onDrop={handleDrop}
          onDragEnter={(event) => handleDrag(event, true)}
          onDragLeave={(event) => handleDrag(event, false)}
          onDragOver={(event) => handleDrag(event, true)}>
          <ChatbotInput />
          <ChatbotSubmit />
        </div>
      </>}

      {isRealtime && <div className="mwai-realtime">
        <ChatbotRealtime onMessagesUpdate={setRealtimeMessages} onStreamEvent={(event) => {
          setAllStreamData(prev => [...prev, event]);
        }} />
      </div>}

      {error && <div className="mwai-error" onClick={() => resetError()}>
        <Markdown options={markdownOptions}>{error}</Markdown>
      </div>}

      {needsFooter && <div className="mwai-footer">
        {needTools && <div className="mwai-tools">
          {uploadIconPosition === 'mwai-tools' && <ChatUploadIcon />}
        </div>}
        {textCompliance && (<div className='mwai-compliance'
          dangerouslySetInnerHTML={{ __html: textCompliance }} />
        )}
      </div>}
      
      {eventLogs && (
        <ChatbotEvents 
          allStreamData={allStreamData} 
          debugMode={debugMode}
          onClear={handleClearStreamData}
          hasData={allStreamData.length > 0}
          isWindow={isWindow}
        />
      )}
    </div>
  );
};

export default ChatbotBody;