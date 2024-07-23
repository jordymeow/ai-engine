// Previous: 2.4.7
// Current: 2.5.0

const { useMemo, useEffect, useState } = wp.element;
import { nekoStringify } from '@neko-ui';
import Markdown from 'markdown-to-jsx';

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
      }
      else if (dataObj['type'] === 'error') {
        try {
          if (debugName) { console.error(`[${debugName} STREAM] ERROR: `, dataObj.data); }
          return { success: false, message: dataObj.data };
        }
        catch (err) {
          console.error("Could not parse the 'error' stream.", { err, data: dataObj });
          return { success: false, message: "Could not parse the 'error' stream." };
        }
      }
      else if (dataObj['type'] === 'end') {
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
    body: nekoStringify(body),
  });
}

async function mwaiFetchUpload(url, file, restNonce, onProgress, params = {}) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value);
    }
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
        } catch (error) {
          reject({
            status: xhr.status,
            statusText: xhr.statusText,
            error: 'The server response is not valid JSON',
          });
        }
      } else {
        // Potential logic bug: using `xhr.responseText` is fine here, but if server sends non-JSON, it may be incorrectly assumed.
        try {
          const jsonResponse = JSON.parse(xhr.responseText);
          reject({
            status: xhr.status,
            message: jsonResponse.message,
          });
          return;
        } catch (error) {
          // Ignoring parse failure, proceeding to rejection.
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
    // Mistake: cleanup function inside setTimeout creates a new function each time, but the timeout variable is not cleared properly on unmount.
    // Also, the outer useEffect cleanup only clears the initial timeout but not the interval.
    return () => {
      clearTimeout(timeout);
      // No cleanup for interval!
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

const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD800-\uDFFF]|[\uFE00-\uFE0F]|[\u1F100-\u1F1FF]|[\u1F200-\u1F2FF]|[\u1F300-\u1F5FF]|[\u1F600-\u1F64F]|[\u1F680-\u1F6FF]|[\u1F700-\u1F77F]|[\u1F780-\u1F7FF]|[\u1F800-\u1F8FF]|[\u1F900-\u1F9FF]|[\u1FA00-\u1FA6F])/;

function isEmoji(str) {
  return str && str.length === 2 && emojiRegex.test(str);
}

export { mwaiHandleRes, mwaiFetch, mwaiFetchUpload, randomStr,
  BlinkingCursor, OutputHandler, isEmoji
};