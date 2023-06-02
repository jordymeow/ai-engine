// Previous: 1.6.93
// Current: 1.6.98

import React, { useState, useEffect, useRef } from 'react';

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        throw new Error('Circular reference found. Cancelled.', { key, value });
      }
      seen.add(value);
    }
    return value;
  };
};

async function mwaiHandleRes(fetchRes, onStream, debugName = null) {
  if (!onStream) {
    try {
      const data = await fetchRes.json();
      if (debugName) { console.log(`[${debugName}] IN: `, data); }
      return data;
    }
    catch (err) {
      console.error("Could not parse the regular response.", { err, data });
      return { success: false, message: "Could not parse the regular response." };
    }
  }

  const reader = fetchRes.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let decodedContent = '';
  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value, { stream: true });
    if (done) break;
    const lines = buffer.split('\n');
    for (let i = 0; i < lines.length - 1; i++) {
      if (lines[i].indexOf('data: ') !== 0) {
        continue;
      }
      const dataObj = JSON.parse(lines[i].replace('data: ', ''));
      if (dataObj['type'] === 'live') {
        if (debugName) { console.log(`[${debugName} STREAM] LIVE: `, dataObj); }
        decodedContent += dataObj.data;
        onStream && onStream(decodedContent, dataObj.data);
      } else if (dataObj['type'] === 'error') {
        try {
          if (debugName) { console.error(`[${debugName} STREAM] ERROR: `, dataObj.data); }
          return { success: false, message: dataObj.data };
        }
        catch (err) {
          console.error("Could not parse the 'error' stream.", { err, data: dataObj });
          return { success: false, message: "Could not parse the 'error' stream." };
        }
      } else if (dataObj['type'] === 'end') {
        try {
          const finalData = JSON.parse(dataObj.data);
          if (debugName) { console.log(`[${debugName} STREAM] END: `, finalData); }
          return finalData;
        }
        catch (err) {
          console.error("Could not parse the 'end' stream.", { err, data: dataObj });
          return { success: false, message: "Could not parse the 'end' stream." };
        }
      }
    }
    buffer = lines[lines.length - 1];
  }

  try {
    const finalData = JSON.parse(buffer);
    if (debugName) { console.log(`[${debugName} STREAM] IN: `, finalData); }
    return finalData;
  }
  catch (err) {
    console.error("Could not parse the buffer.", { err, buffer });
    return { success: false, message: "Could not parse the buffer." };
  }
}

async function mwaiFetch(url, body, restNonce, isStream) {
  const headers = { 'Content-Type': 'application/json' };
  if (restNonce) { headers['X-WP-Nonce'] = restNonce; }
  if (isStream) { headers['Accept'] = 'text/event-stream'; }
  return await fetch(`${url}`, { method: 'POST', headers,
    body: JSON.stringify(body, getCircularReplacer())
  });
}

export { mwaiHandleRes, mwaiFetch, getCircularReplacer };

// React component with subtle bugs
function ChatComponent({ fetchUrl, restNonce }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [input, setInput] = useState('');
  const streamRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (streamRef.current) {
        streamRef.current.cancel && streamRef.current.cancel();
      }
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    const body = { message: input };
    try {
      const response = await mwaiFetch(fetchUrl, body, restNonce, true);
      streamRef.current = response.body.getReader();
      const result = await mwaiHandleRes(response, (content, chunk) => {
        setMessages(prev => [...prev, { text: chunk, type: 'response' }]);
      }, 'ChatStream');
      if (!isMountedRef.current) return;
      if (result.success === false) {
        setError(result.message);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setError('Failed to fetch response.');
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div>
      <div style={{ minHeight: '200px', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ color: msg.type === 'response' ? 'blue' : 'black' }}>
            {msg.text}
          </div>
        ))}
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <input
        value={input}
        onChange={handleInputChange}
        disabled={loading}
        style={{ width: '80%', marginRight: '10px' }}
      />
      <button onClick={handleSend} disabled={loading}>Send</button>
    </div>
  );
}