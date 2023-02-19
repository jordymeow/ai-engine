// Previous: 0.6.6
// Current: 0.1.0

const { useState } = wp.element;
import { useQuery } from '@tanstack/react-query';

import { NekoButton, 
  NekoSelect, NekoOption, NekoProgress, NekoModal, NekoTextArea } from '@neko-ui';
import { nekoFetch, useNekoTasks } from '@neko-ui';
import { apiUrl, restNonce, session } from '@app/settings';

const retrieveIncidents = async (postType) => {
  const res = await nekoFetch(`${apiUrl}/count_posts?postType=${postType}`, { nonce: restNonce });
  return res?.count?.publish ? parseInt(res?.count?.publish) : null;
}

const retrievePostContent = async (postType, offset = 0, postId = 0) => {
  const res = await nekoFetch(`${apiUrl}/post_content?postType=${postType}&offset=${offset}&postId=${postId}`, 
    { nonce: restNonce });
  return res;
}

const DatasetBuilder = ({ setBuilderData }) => {
  const bulkTasks = useNekoTasks();
  const [postType, setPostType] = useState('post');
  const [totalTokens, setTotalTokens] = useState(0);
  const [quickBusy, setQuickBusy] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState("Generate 30 questions and answers from this text. Question use a neutral tone. Answers use the same tone as the text.");
  const [suffixPrompt, setSuffixPrompt] = useState("\n\nUse this format:\n\nQ: \nA: \n\nArticle:\n\n{CONTENT}");
  const { isLoading: isLoadingCount, data: postsCount } = useQuery({
    queryKey: ['postsCount-' + postType], queryFn: () => retrieveIncidents(postType)
  });
  const isBusy = quickBusy || bulkTasks.busy || isLoadingCount;

  const onStopClick = () => {
    bulkTasks.stop();
  }

  const onErrorSkipClick = () => {
    bulkTasks.resume();
  }

  const onErrorRetryClick = () => {
    bulkTasks.retry();
  }

  const onErrorAlwaysSkipClick = () => {
    bulkTasks.setAlwaysSkip();
    bulkTasks.resume();
  }

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
        if (entries.length === 0) continue; // avoid error if A: appears first
        entries[entries.length - 1].completion = arr[i].slice(2).trim();
      }
    }
    return entries;
  }

  const runProcess = async (suffix = 0, postId = undefined, signal = undefined) => {
    let finalPrompt = generatePrompt + suffixPrompt;
    const resContent = await retrievePostContent(postType, suffix, postId ? postId : undefined);
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
      const resGenerate = await nekoFetch(`${apiUrl}/make_completions`, {
        method: 'POST',
        json: {
          env: 'admin-dataset',
          session,
          prompt: finalPrompt,
          temperature: 0.8,
          model: 'text-davinci-003',
          maxTokens: 2048,
          stop: ''
        },
        signal: signal,
        nonce: restNonce
      });
      rawData = resGenerate?.data;
      if (!resGenerate.success) {
        if (resGenerate.error?.code === 'USER-ABORTED') {
          console.log('User aborted.');
          bulkTasks.reset();
          return { success: true };
        }
        alert(resGenerate.message);
        error = resGenerate.message;
      }
      else {
        if (resGenerate?.usage?.total_tokens) {
          tokens = resGenerate.usage.total_tokens;
          setTotalTokens(totalTokens => totalTokens + resGenerate.usage.total_tokens);
        }
      }
    }
    const entries = createEntriesFromRaw(rawData);
    const result = { content, prompt: finalPrompt, rawData, entries, error, tokens };
    console.log("Result:", result);
    return result;
  }

  const onRunClick = async () => {
    setTotalTokens(0);
    const offsets = Array.from(Array(postsCount).keys());
    const startOffsetStr = prompt("There are " + offsets.length + " entries. If you want to start from a certain entry offset, type it here. Otherwise, just press OK, and everything will be processed.");
    const startOffset = parseInt(startOffsetStr, 10);
    let tasks = offsets.map(offset => async (signal) => {
      console.log("Task " + offset);
      if (!isNaN(startOffset) && offset < startOffset) {
        return { success: true };
      }
      let result = await runProcess(offset, null, signal);
      if (result.entries) {
        setBuilderData(builderData => [...builderData, ...result.entries]);
      }
      return { success: true };
    });
    await bulkTasks.start(tasks);
    setQuickBusy(false);
    alert("All done!");
    bulkTasks.reset();
  }

  const onQuickTestClick = async () => {
    setTotalTokens(0);
    const postIdStr = prompt("Enter the ID of a post (leave blank to use the very first one).");
    const postId = postIdStr ? parseInt(postIdStr, 10) : undefined;
    if (postIdStr === null) {
      return;
    }
    setQuickBusy(true);
    const result = await runProcess(0, postId);
    setQuickBusy(false);
    if (!result.entries || !result.entries.length) {
      alert("No entries were generated. Check the console for more information.");
    }
    else {
      const confirmAdd = confirm(`Got ${result.entries.length} entries! Do you want to add them to your data? If not, they will be displayed in your console.`);
      if (confirmAdd) {
        setBuilderData(builderData => [...builderData, ...result.entries]);
      }
    }
  }

  return (
    <>
      <div style={{ display: 'flex' }}>
        <NekoButton disabled={isBusy} onClick={onQuickTestClick}>
          Single Generate (Test)
        </NekoButton>
        <NekoButton disabled={isBusy} onClick={() => onRunClick()}>
          Run Bulk Generate
        </NekoButton>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: 10 }}>
          Based on {isLoadingCount && '...'}{!isLoadingCount && postsCount}
        </div>
        <NekoSelect id="postType" scrolldown={true} disabled={isBusy} name="postType" 
          style={{ width: 100, marginLeft: 10 }} onChange={setPostType} value={postType}>
          <NekoOption key={'post'} id={'post'} value={'post'} label="Posts" />
          <NekoOption key={'page'} id={'page'} value={'page'} label="Pages" />
        </NekoSelect>
        <NekoProgress busy={bulkTasks.busy} style={{ marginLeft: 10, flex: 'auto' }}
          value={bulkTasks.value} max={bulkTasks.max} onStopClick={bulkTasks.stop} />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: 10 }}>
          Tokens: {totalTokens}
        </div>
      </div>

      <NekoTextArea id="generatePrompt" name="generatePrompt" rows={2} style={{ marginTop: 15 }}
        value={generatePrompt} onBlur={setGeneratePrompt} disabled={isBusy} />
    </>
  );
}

export default DatasetBuilder;