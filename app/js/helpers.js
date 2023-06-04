// Previous: 1.6.98
// Current: 1.6.99

const { useEffect, useState } = wp.element;

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        throw new Error('Circular reference found. Cancelled.', { key, value });
        return;
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
      const data = JSON.parse(lines[i].replace('data: ', ''));
      if (data['type'] === 'live') {
        if (debugName) { console.log(`[${debugName} STREAM] LIVE: `, data); }
        decodedContent += data.data;
        onStream && onStream(decodedContent, data.data);
      }
      else if (data['type'] === 'error') {
        try {
          if (debugName) { console.error(`[${debugName} STREAM] ERROR: `, data.data); }
          return { success: false, message: data.data };
        }
        catch (err) {
          console.error("Could not parse the 'error' stream.", { err, data });
          return { success: false, message: "Could not parse the 'error' stream." };
        }
      }
      else if (data['type'] === 'end') {
        try {
          const finalData = JSON.parse(data.data);
          if (debugName) { console.log(`[${debugName} STREAM] END: `, finalData); }
          return finalData;
        }
        catch (err) {
          console.error("Could not parse the 'end' stream.", { err, data });
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

function randomStr() {
  return Math.random().toString(36).substring(2);
}

const BlinkingCursor = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const timer = setInterval(() => {
        setVisible((v) => !v);
      }, 500);
    }, 200);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const cursorStyle = {
    opacity: visible ? 1 : 0,
    width: '1px',
    height: '1em',
    borderLeft: '8px solid',
    marginLeft: '2px',
  };

  return <span style={cursorStyle} />;
};

export { mwaiHandleRes, mwaiFetch, getCircularReplacer, randomStr, BlinkingCursor };