// Previous: 1.9.3
// Current: 1.9.4

const { useState, useEffect } = wp.element;
import { useQuery } from '@tanstack/react-query';

import { NekoButton, 
  NekoSelect, NekoOption, NekoProgress, NekoTextArea } from '@neko-ui';
import { nekoFetch, useNekoTasks } from '@neko-ui';
import { apiUrl, restNonce, session } from '@app/settings';
import i18n from '@root/i18n';
import { retrievePostTypes, retrievePostsCount, retrievePostContent } from '@app/requests';

const DatasetEditor = ({ options, setMessages }) => {
  const [postType, setPostType] = useState('post');
  const [totalTokens, setTotalTokens] = useState(0);
  const [quickBusy, setQuickBusy] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState("Generate 30 questions and answers from this text. Questions use a neutral tone. Answers use the same tone as the text.");
  const [suffixPrompt, setSuffixPrompt] = useState("\n\nUse this format:\n\nQ: Question?\nA: Answer.\n\nQ: Question?\nA: Answer.\n\Text:\n\n{CONTENT}");
  const { isLoading: isLoadingPostTypes, data: postTypes } = useQuery({
    queryKey: ['postTypes'], queryFn: retrievePostTypes
  });
  const { isLoading: isLoadingCount, data: postsCount } = useQuery({
    queryKey: ['postsCount-' + postType], queryFn: () => retrievePostsCount(postType)
  });
  const bulkTasks = useNekoTasks({ i18n, onStop: () => { setQuickBusy(); bulkTasks.reset(); } });
  const isBusy = quickBusy || bulkTasks.busy || isLoadingCount || isLoadingPostTypes;

  const createEntriesFromRaw = (rawData) => {
    if (!rawData) {
      return [];
    }

    const arr = rawData.split("\n").filter(line => line.trim() !== "");
    const entries = [];
    let messages = [];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].startsWith("Q:")) {
        if (messages.length) {
          entries.push({ messages: [...messages] });
          messages = [];
        }
        messages.push({ role: 'user', content: arr[i].slice(2).trim() });
      }
      else if (arr[i].startsWith("A:")) {
        messages.push({ role: 'assistant', content: arr[i].slice(2).trim() });
        entries.push({ messages: [...messages] });
        messages = [];
      }
    }
    if (messages.length) {
      entries.push({ messages });
    }
    return entries;
  }

  const runProcess = async (offset = 0, postId = undefined, signal = undefined) => {
    let finalPrompt = generatePrompt + suffixPrompt;
    const resContent = await retrievePostContent(postType, offset, postId ? postId : undefined);
    let error = null;
    let rawData = null;
    let content = resContent?.content;
    let url = resContent?.url;
    let title = resContent?.title;
    let tokens = 0;
    if (!resContent.success) {
      alert(resContent.message);
      error = resContent.message;
    }
    else if (content.length < 64) {
      console.log("Issue: Content is too short! Skipped.", { content });
    }
    else {
      finalPrompt = finalPrompt.replace('{CONTENT}', content);
      finalPrompt = finalPrompt.replace('{URL}', url);
      finalPrompt = finalPrompt.replace('{TITLE}', title);
      const res = await nekoFetch(`${apiUrl}/ai/completions`, {
        method: 'POST',
        json: {
          env: 'admin-tools',
          session,
          prompt: finalPrompt,
          temperature: 0.8,
          model: options.assistants_model,
          maxTokens: 2048,
          stop: ''
        },
        signal: signal,
        nonce: restNonce
      });
      if (!res.success) {
        if (res.error?.cancelledByUser) {
          return null;
        }
        console.error(res);
        throw new Error(res.message ?? "Unknown error, check your console logs.");
      }
      rawData = res?.data;
      if (res?.usage?.total_tokens) {
        tokens = res.usage.total_tokens;
        setTotalTokens(totalTokens => totalTokens + res.usage.total_tokens);
      }
    }
    if (signal?.aborted) {
      cancelledByUser();
    }
    const entries = createEntriesFromRaw(rawData);
    const result = { content, prompt: finalPrompt, rawData, entries, error, tokens };
    console.log("Result:", result);
    return result;
  }

  const cancelledByUser = () => {
    console.log('User aborted.');
    setBusy(false);
    bulkTasks.reset();
  }

  const onRunClick = async () => {
    setTotalTokens(0);
    const offsets = Array.from(Array(postsCount).keys());
    const startOffsetStr = prompt("There are " + offsets.length + " entries. If you want to start from a certain entry offset, type it here. Otherwise, just press OK, and everything will be processed.");
    const startOffset = startOffsetStr !== null ? parseInt(startOffsetStr, 10) : null;
    let tasks = offsets.map(offset => async (signal) => {
      console.log("Task " + offset);
      if (startOffset !== null && offset < startOffset) {
        return { success: true };
      }
      let result = await runProcess(offset, null, signal);
      //let result = { entries: [ { prompt: offset, completion: offset } ] }
      if (result?.entries?.length > 0) {
        setMessages(messages => [...messages, ...result.entries]);
      }
      return { success: true };
    });
    await bulkTasks.start(tasks);
    setQuickBusy(false);
    alert("All done!");
    bulkTasks.reset();
  }

  const onSingleGenerateClick = async () => {
    try {
      setTotalTokens(0);
      const postIdInput = prompt("Enter the ID of a post (leave blank to use the very first one).");
      const postId = postIdInput !== null && postIdInput.trim() !== "" ? postIdInput : null;
      if (postId === null) {
        return;
      }
      setQuickBusy('singleGenerate');
      const result = await runProcess(0, postId);
      if (!result.entries || result.entries.length === 0) {
        alert("No entries were generated. Check the console for more information.");
      }
      else {
        const confirmAdd = confirm(`Got ${result.entries.length} entries! Do you want to add them to your data? If not, they will be displayed in your console.`);
        if (confirmAdd) {
          setMessages(messages => [...messages, ...result.entries]);
        }
      }
    }
    catch (e) {
      console.error(e);
      alert(e.message);
    }
    finally {
      setQuickBusy(false);
    }
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
        <NekoButton disabled={isBusy} onClick={onSingleGenerateClick} isBusy={quickBusy === 'singleGenerate'}>
          {i18n.COMMON.SINGLE_GENERATE}
        </NekoButton>
        <NekoButton disabled={isBusy} onClick={() => onRunClick()}>
          Run Bulk Generate
        </NekoButton>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: 10 }}>
          Based on {isLoadingCount && '...'}{!isLoadingCount && postsCount}
        </div>
        <NekoSelect id="postType" scrolldown={true} disabled={isBusy} name="postType" 
          style={{ width: 100, marginLeft: 10 }} onChange={(e) => setPostType(e.target.value)} value={postType}>
          {postTypes?.map(postType => 
            <NekoOption key={postType.type} value={postType.type} label={postType.name} />
          )}
        </NekoSelect>
        <NekoProgress busy={bulkTasks.busy} style={{ marginLeft: 10, flex: 'auto' }}
          value={bulkTasks.value} max={bulkTasks.max} onStopClick={bulkTasks.stop} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: 10 }}>
          Tokens: {totalTokens}
        </div>
      </div>

      <NekoTextArea id="generatePrompt" name="generatePrompt" rows={2} style={{ marginTop: 15 }}
        value={generatePrompt} onBlur={(e) => setGeneratePrompt(e.target.value)} disabled={isBusy} />

      {bulkTasks.TasksErrorModal}
    </>
  );
}

export default DatasetEditor;