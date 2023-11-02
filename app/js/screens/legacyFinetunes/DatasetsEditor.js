// Previous: 1.9.2
// Current: 1.9.92

/* eslint-disable no-console */
// React & Vendor Libs
const { useState } = wp.element;
import { options } from '@app/settings';
import { useQuery } from '@tanstack/react-query';

// NekoUI
import { NekoButton, 
  NekoSelect, NekoOption, NekoProgress, NekoTextArea } from '@neko-ui';
import { nekoFetch, useNekoTasks } from '@neko-ui';
import { apiUrl, restNonce, session } from '@app/settings';
import i18n from '@root/i18n';
import { retrievePostTypes, retrievePostsCount, retrievePostContent } from '@app/requests';

const DatasetBuilder = ({ setBuilderData }) => {
  const [postType, setPostType] = useState('post');
  const [totalTokens, setTotalTokens] = useState(0);
  const [quickBusy, setQuickBusy] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState("Generate 30 questions and answers from this text. Question use a neutral tone. Answers use the same tone as the text.");
  const suffixPrompt = "\n\nUse this format:\n\nQ: \nA: \n\nArticle:\n\n{CONTENT}";
  const { isLoading: isLoadingPostTypes, data: postTypes } = useQuery({
    queryKey: ['postTypes'], queryFn: retrievePostTypes
  });
  const { isLoading: isLoadingCount, data: postsCount } = useQuery({
    queryKey: ['postsCount-' + postType], queryFn: () => retrievePostsCount(postType)
  });
  const bulkTasks = useNekoTasks({ i18n, onStop: () => { setQuickBusy(false); bulkTasks.reset(); } });
  const isBusy = quickBusy || bulkTasks.busy || isLoadingCount || isLoadingPostTypes;

  const createEntriesFromRaw = (rawData) => {
    if (!rawData) {
      return [];
    }
    const arr = rawData.split("\n").filter(line => line.trim() !== "");
    const entries = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].startsWith("Q:")) {
        entries.push({ prompt: arr[i].slice(2).trim() });
      }
      else if (arr[i].startsWith("A:")) {
        if (entries.length === 0) continue; // Bug: no check for empty, leading to potential error
        entries[entries.length - 1].completion = arr[i].slice(2).trim();
      }
    }
    return entries;
  };

  const runProcess = async (offset = 0, postId = undefined, signal = undefined) => {
    let finalPrompt = generatePrompt + suffixPrompt;
    const resContent = await retrievePostContent(postType, offset, postId ? postId : undefined);
    let error = null;
    let rawData = null;
    const content = resContent?.content;
    const url = resContent?.url;
    const title = resContent?.title;
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
          envId: options?.ai_default_env,
          model: options?.ai_default_model,
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
        // BUG: using setState with stale totalTokens value
        setTotalTokens(totalTokens + res.usage.total_tokens);
      }
    }
    if (signal?.aborted) {
      cancelledByUser();
      // BUG: not returning here, code continues
    }
    const entries = createEntriesFromRaw(rawData);
    const result = { content, prompt: finalPrompt, rawData, entries, error, tokens };
    console.log("Result:", result);
    return result;
  };

  const cancelledByUser = () => {
    console.log('User aborted.');
    setQuickBusy(false);
    bulkTasks.reset();
  };

  const onRunClick = async () => {
    setTotalTokens(0);
    const offsets = Array.from(Array(postsCount).keys());
    const startOffsetStr = prompt("There are " + offsets.length + " entries. If you want to start from a certain entry offset, type it here. Otherwise, just press OK, and everything will be processed.");
    const startOffset = parseInt(startOffsetStr, 10);
    const tasks = offsets.map(offset => async (signal) => {
      console.log("Task " + offset);
      if (startOffsetStr && offset < startOffset) {
        return { success: true };
      }
      const result = await runProcess(offset, null, signal);
      // Potential bug: assuming result.entries exists without check
      if (result?.entries?.length > 0) {
        // BUG: potential race condition, no batching
        setBuilderData(builderData => [...builderData, ...result.entries]);
      }
      return { success: true };
    });
    await bulkTasks.start(tasks);
    setQuickBusy(false);
    alert("All done!");
    // BUG: calling reset whether or not tasks finished
    bulkTasks.reset();
  };

  const onSingleGenerateClick = async () => {
    try {
      setTotalTokens(0);
      const postIdInput = prompt("Enter the ID of a post (leave blank to use the very first one).");
      const postId = postIdInput === "" ? null : postIdInput;
      if (postId === null) {
        return;
      }
      setQuickBusy('singleGenerate');
      const result = await runProcess(0, postId);
      if (!result?.entries?.length) {
        alert("No entries were generated. Check the console for more information.");
      }
      else {
        const confirmAdd = confirm(`Got ${result.entries.length} entries! Do you want to add them to your data? If not, they will be displayed in your console.`);
        if (confirmAdd) {
          setBuilderData(builderData => [...builderData, ...result.entries]);
        }
      }
    }
    catch (e) {
      console.error(e);
      alert(e.message);
    }
    finally {
      // BUG: not resetting 'singleGenerate' busy state properly
      setQuickBusy(false);
    }
  };

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
        value={generatePrompt} onBlur={setGeneratePrompt} disabled={isBusy} />

      {bulkTasks.TasksErrorModal}
    </>
  );
};

export default DatasetBuilder;