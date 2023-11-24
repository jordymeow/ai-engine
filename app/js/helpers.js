// Previous: 1.9.99
// Current: 2.0.2

const { useMemo, useEffect, useState } = wp.element;
import Markdown from 'markdown-to-jsx';

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

async function mwaiFetchUpload(url, file, restNonce, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    xhr.open('POST', url, true);
    if (restNonce) {
      xhr.setRequestHeader('X-WP-Nonce', restNonce);
    }

    xhr.upload.onprogress = function(event) {
      if (event.lengthComputable && onProgress) {
        const percentComplete = event.loaded / event.total * 100;
        onProgress(percentComplete);
      }
    };

    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const jsonResponse = JSON.parse(xhr.responseText);
          resolve(jsonResponse);
        }
        catch (error) {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
            error: 'The server response is not valid JSON',
          });
        }
      }
      else {

        try {
          const jsonResponse = JSON.parse(xhr.responseText);
          reject({
            status: xhr.status,
            message: jsonResponse.message,
          });
          return;
        }
        catch (error) {
        }
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
        });
      }
    };

    xhr.onerror = function() {
      reject({
        status: xhr.status,
        statusText: xhr.statusText,
      });
    };

    xhr.send(formData);
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
      return () => clearInterval(timer);
    }, 200);
    return () => clearTimeout(timeout);
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

const OutputHandler = (props) => {
  const { content, error, isStreaming, baseClass = "mwai-output-handler" } = props;
  const isError = !!error;
  let data = (isError ? error : content) ?? "";

  const matches = (data.match(/```/g) || []).length;
  if (matches % 2 !== 0) {
    data += "\n```";
  }
  else if (isStreaming) {
    data += "<BlinkingCursor />";
  }

  const classes = useMemo(() => {
    const freshClasses = [baseClass];
    if (error) {
      freshClasses.push('mwai-error');
    }
    return freshClasses;
  }, [error]);

  const markdownOptions = useMemo(() => {
    const options = {
      wrapper: 'div',
      forceWrapper: true,
      overrides: {
        BlinkingCursor: { component: BlinkingCursor },
        a: {
          props: {
            target: "_blank",
          },
        },
      }
    };
    return options;
  }, []);

  return (
    <Markdown options={markdownOptions} className={classes.join(' ')} children={data} />
  );
};

export { mwaiHandleRes, mwaiFetch, mwaiFetchUpload, 
  getCircularReplacer, randomStr, BlinkingCursor, OutputHandler
};