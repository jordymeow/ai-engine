// Previous: 0.8.6
// Current: 0.9.83

const { useState, useEffect, useMemo } = wp.element;

import { nekoFetch, useNekoTasks } from '@neko-ui';
import { NekoButton, NekoPage, NekoSelect, NekoOption, NekoInput, NekoModal, NekoProgress,
  NekoQuickLinks, NekoLink, NekoCheckbox,
  NekoTextArea, NekoWrapper, NekoColumn, NekoTypo, NekoSpacer } from '@neko-ui';

import { apiUrl, restNonce, session, options } from '@app/settings';
import { WritingStyles, WritingTones } from "../constants";
import { cleanSections, OptionsCheck, useModels } from "../helpers";
import { AiNekoHeader, StyledTitleWithButton } from "../styles/CommonStyles";
import { StyledSidebar } from "../styles/StyledSidebar";
import useTemplates from '../components/Templates';

const languagesObject = options?.languages || [];
const languages = Object.keys(languagesObject).map((key) => {
  return { value: key, label: languagesObject[key] };
});

const getSeoMessage = (title) => {
  if (!title){
    return null;
  }

  const words = title.split(' ');
  const wordCount = words.length;
  const charCount = title.length;
  const seoMessage = [];

  if (!charCount) {
    return;
  }
  else if (wordCount < 3) {
    seoMessage.push('The title is too short. It should be at least 3 words.');
  }
  else if (wordCount > 8) {
    seoMessage.push('The title is too long. It should be no more than 8 words.');
  }
  else if (charCount < 40) {
    seoMessage.push('The title is too short. It should be at least 40 characters.');
  }
  else if (charCount > 70) {
    seoMessage.push('The title is too long. It should be no more than 70 characters.');
  }
  return seoMessage.join(' ');
};

const ContentGenerator = () => {
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");

  const { template, setTemplate, resetTemplate, jsxTemplates } = useTemplates('contentGenerator');
  const { models } = useModels(options);
  const bulkTasks = useNekoTasks();
  const [busy, setBusy] = useState(false);
  const isBusy = bulkTasks.busy || busy;
  const [error, setError] = useState();
  const [showModelParams, setShowModelParams] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [createdPostId, setCreatedPostId] = useState();
  const [postType, setPostType] = useState('post');
  const [topicsArray, setTopicsArray] = useState([]);
  const [createdPosts, setCreatedPosts] = useState([]);
  const [runTimes, setRunTimes] = useState({});
  
  const title = template?.title ?? "";
  const sections = template?.sections ?? "";
  const mode = template?.mode ?? 'single';
  const topic = template?.topic ?? "";
  const topics = template?.topics ?? "";
  const model = template?.model ?? "text-davinci-003";
  const sectionsCount = template?.sectionsCount ?? 2;
  const paragraphsCount = template?.paragraphsCount ?? 3;
  const language = template?.language ?? "en";
  const customLanguage = template?.customLanguage ?? "";
  const writingStyle = template?.writingStyle ?? "creative";
  const writingTone = template?.writingTone ?? "cheerful";
  const titlePromptFormat = template?.titlePromptFormat ?? "";
  const sectionsPromptFormat = template?.sectionsPromptFormat ?? "";
  const contentPromptFormat = template?.contentPromptFormat ?? "";
  const excerptPromptFormat = template?.excerptPromptFormat ?? "";
  const temperature = template?.temperature ?? 0.6;
  const maxTokens = template?.maxTokens ?? 2048;
  const topicsAreTitles = template?.topicsAreTitles ?? false;

  const humanLanguage = useMemo(() => {
    let systemLanguage = languages.find(l => l.value === language);
    if (systemLanguage) {
      return systemLanguage.label;
    }
    if (customLanguage) {
      return customLanguage;
    }
    console.warn("A system language or a custom language should be set.");
    return "english";
  }, [language, customLanguage]);

  const setTemplateProperty = (value, property) => {
    setTemplate(x => ({ ...x, [property]: value }));
  };

  useEffect(() => {
    const freshTopicsArray = topics.split('\n').map(x => x.trim()).filter(x => !!x);
    setTopicsArray(freshTopicsArray);
  }, [topics]);

  useEffect(() => {
    if (template) {
      setTemplateProperty('', 'sections');
    }
  }, [title, sectionsCount]);

  useEffect(() => {
    setContent('');
    setExcerpt('');
    setCreatedPostId();
  }, [sections, paragraphsCount]);

  const finalizePrompt = (prompt) => {
    return prompt
      .replace('{LANGUAGE}', humanLanguage)
      .replace('{WRITING_STYLE}', writingStyle)
      .replace('{WRITING_TONE}', writingTone)
      .replace('{PARAGRAPHS_PER_SECTION}', paragraphsCount)
      .replace('{SECTIONS_COUNT}', sectionsCount);
  }

  const formInputs = useMemo(() => {
    const lookFor = (str, arr) => { return !!arr.find(item => item.includes(str)); }
    const arr = [titlePromptFormat, sectionsPromptFormat, contentPromptFormat, excerptPromptFormat];
    return {
      language: lookFor('{LANGUAGE}', arr),
      writingStyle: lookFor('{WRITING_STYLE}', arr),
      writingTone: lookFor('{WRITING_TONE}', arr),
      sectionsCount: lookFor('{SECTIONS_COUNT}', arr),
      paragraphsCount: lookFor('{PARAGRAPHS_PER_SECTION}', arr),
    }
  }, [titlePromptFormat, sectionsPromptFormat, contentPromptFormat,
    excerptPromptFormat, sectionsCount, paragraphsCount]);

  const onSubmitPrompt = async (promptToUse = '', maxTokensParam = 2048, isBulk = false) => {
    const res = await nekoFetch(`${apiUrl}/make_completions`, { 
      method: 'POST',
      nonce: restNonce,
      json: { 
        env: 'admin-tools',
        session: session,
        prompt: promptToUse,
        temperature,
        maxTokens: maxTokensParam,
        model 
    } });
    if (!res.success) {
      if (isBulk) {
        throw new Error(res.message);
      }
      setError(res.message);
      return null;
    }
    let data = res.data.trim();
    if (data.startsWith('"') && data.endsWith('"')) {
      data = data.substring(1, data.length - 1);
    }
    return data;
  };

  const submitSectionsPrompt = async (inTitle = title, isBulk = false) => {
    if (!inTitle) {
      alert("Title is missing!");
      return;
    }
    setBusy(true);
    setTemplateProperty('', 'sections');
    const prompt = finalizePrompt(sectionsPromptFormat.replace('{TITLE}', inTitle));
    let freshSections = await onSubmitPrompt(prompt, 512, isBulk);
    freshSections = cleanSections(freshSections);
    console.log("Sections:", { prompt, sections: freshSections });
    if (freshSections) {
      setTemplateProperty(freshSections, 'sections');
    }
    setBusy(false);
    return freshSections;
  };

  const submitContentPrompt = async (inTitle = title, inSections = sections, isBulk = false) => {
    if (!inTitle) {
      alert("Title is missing!");
      return;
    }
    if (!inSections) {
      alert("Sections are missing!");
      return;
    }
    setBusy(true);
    setContent(x => "");
    const prompt = finalizePrompt(contentPromptFormat.replace('{TITLE}', inTitle).replace('{SECTIONS}', inSections));
    let freshContent = await onSubmitPrompt(prompt, maxTokens, isBulk);
    if (freshContent) {
      freshContent = freshContent.replace(/^===INTRO:\n/, '');
      freshContent = freshContent.replace(/^===INTRO: \n/, '');
      freshContent = freshContent.replace(/===INTRO: /, '');
      freshContent = freshContent.replace(/===OUTRO:\n/, '');
      freshContent = freshContent.replace(/===OUTRO: \n/, '');
      freshContent = freshContent.replace(/===OUTRO: /, '');
      setContent(x => freshContent);
    }
    console.log("Content:", { prompt, content: freshContent });
    setBusy(false);
    return freshContent;
  };

  const onSubmitPromptForExcerpt = async (inTitle = title, isBulk = false) => {
    if (!inTitle) {
      alert("Title is missing!");
      return;
    }
    setBusy(true);
    setExcerpt(x => "");
    const prompt = finalizePrompt(excerptPromptFormat.replace('{TITLE}', inTitle));
    const freshExcerpt = await onSubmitPrompt(prompt, 256, isBulk);
    if (freshExcerpt) {
      setExcerpt(x => freshExcerpt);
    }
    console.log("Excerpt:", { prompt, excerpt: freshExcerpt });
    setBusy(false);
    return freshExcerpt;
  };

  const onGenerateAllClick = async (inTopic = topic, isBulk = false) => {
    setBusy(true);
    setRunTimes(prev => ({ ...prev, all: new Date() }));
    try {
      let freshTitle = inTopic;
      if (!topicsAreTitles || !isBulk) {
        const prompt = finalizePrompt(titlePromptFormat.replace('{TOPIC}', inTopic));
        freshTitle = await onSubmitPrompt(prompt, 64, isBulk);
        console.log("Title:", { prompt, title: freshTitle });
      }
      let freshSections = null;
      let freshContent = null;
      let freshExcerpt = null;
      setBusy(false);
      if (freshTitle) {
        setTemplateProperty(freshTitle, 'title');
        setRunTimes(prev => ({ ...prev, sections: new Date() }));
        freshSections = await submitSectionsPrompt(freshTitle, isBulk);
        await new Promise(r => setTimeout(r, 50));
        await setRunTimes(prev => ({ ...prev, sections: null }));
        if (freshSections) {
          await setRunTimes(prev => ({ ...prev, content: new Date() }));
          freshContent = await submitContentPrompt(freshTitle, freshSections, isBulk);
          await new Promise(r => setTimeout(r, 50));
          await setRunTimes(prev => ({ ...prev, content: null }));
          if (freshContent) {
            await setRunTimes(prev => ({ ...prev, excerpt: new Date() }));
            freshExcerpt = await onSubmitPromptForExcerpt(freshTitle, isBulk);
            await new Promise(r => setTimeout(r, 50));
            await setRunTimes(prev => ({ ...prev, excerpt: null }));
          }
        }
      }
      return { title: freshTitle, heads: freshSections, content: freshContent, excerpt: freshExcerpt };
    }
    catch (e) {
      setBusy(false);
      setRunTimes({});
      throw e;
    }
  };

  const onSubmitNewPost = async (inTitle = title, inContent = content, inExcerpt = excerpt, isBulk = false) => {
    setBusy(true);
    const res = await nekoFetch(`${apiUrl}/create_post`, {
      method: 'POST',
      nonce: restNonce,
      json: { title: inTitle, content: inContent, excerpt: inExcerpt }
    });
    setBusy(false);
    if (!res.success) {
      setError(res.message);
      return null;
    }
    if (!isBulk) {
      setCreatedPostId(res.postId);
    }
    return res.postId;
  };

  const onBulkStart = async () => {
    setCreatedPosts([]);
    let tasks = topicsArray.map((topic, offset) => async () => {
      console.log("Topic " + offset);
      try {
        const result = await onGenerateAllClick(topic, true);
        const { title: genTitle, content: genContent, excerpt: genExcerpt } = result;
        if (genTitle && genContent && genExcerpt) {
          let postId = await onSubmitNewPost(genTitle, genContent, genExcerpt, true);
          setCreatedPosts(prev => [...prev, { postId, topic, title: genTitle, content: genContent, excerpt: genExcerpt }]);
        }
        else {
          console.warn("Could not generate the post for: " + topic);
        }
      }
      catch (e) {
        if ( !confirm("An error was caught (" + e.message + "). Should we continue?") ) {
          bulkTasks.stop();
          bulkTasks.reset();
          setBusy(false);
        }
      }
      return { success: true };
    });
    await bulkTasks.start(tasks);
    bulkTasks.reset();
  }

  return (
    <NekoPage nekoErrors={[]}>

      <AiNekoHeader title="Content Generator" />

      <NekoWrapper>

        <NekoColumn full>
          <OptionsCheck options={options} />

          <NekoTypo p style={{ marginTop: 0, marginBottom: 0 }}>
            Write a <b>Topic</b> (followed by a few keywords or details if necessary), and click <b>Generate All</b>. That's it! You can also write a Title, Generate Sections, Content, and Excerpt separately to perfect the results, or better, adapt the <b>Prompts</b> to personalize the results. Click on <b>Create Post</b> button when you're happy with the result. Ready for the next level? Try <b>Bulk Generate</b>! Join us on the <a target="_blank" href="https://wordpress.org/support/plugin/ai-engine/">Support Forums</a> 😊!
          </NekoTypo>
        </NekoColumn>

        <NekoColumn style={{ flex: 1 }}>

          <StyledSidebar style={{ marginBottom: 25 }}>
            <h2 style={{ marginTop: 0 }}>Topic</h2>
            <NekoTextArea id="topic" name="topic" disabled={isBusy || mode === 'bulk'} rows={5}
              value={topic} onChange={setTemplateProperty}  />
            <NekoSpacer />
            <NekoButton fullWidth disabled={!topic || mode === 'bulk'} isBusy={isBusy} startTime={runTimes?.all}
              onClick={() => onGenerateAllClick()}>
              Generate All
            </NekoButton>
          </StyledSidebar>

          <NekoSpacer height={50} />

          <StyledSidebar style={{ marginBottom: 25 }}>
            {jsxTemplates}
          </StyledSidebar>

        </NekoColumn>

        <NekoColumn  style={{ flex: 3 }}>

          <NekoQuickLinks id="mode" name="mode" value={mode} disabled={isBusy} onChange={setTemplateProperty}>
            <NekoLink title="Single Generate" value='single' />
            <NekoLink title="Bulk Generate" value='bulk' count={topicsArray.length} />
          </NekoQuickLinks>

          <NekoSpacer height={40} />

          {mode === 'bulk' && <StyledSidebar>
            <p style={{ marginTop: 0, marginBottom: 20 }}>
              Write or paste your topics below. Each line will be used as a topic. The same <b>Params</b> and <b>Prompts</b> will be used as with the <b>Single Generate</b>, so make sure you get satisfying results with it first. This <b>takes time</b>, so relax and enjoy some coffee ☕️ and tea 🍵 :)
            </p>
            <div style={{ display: 'flex' }}>
              <NekoButton disabled={isBusy || !topicsArray.length} onClick={onBulkStart}>Generate</NekoButton>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: 10 }}>
                {topicsArray.length}
              </div>
              <NekoSelect id="postType" scrolldown={true} disabled={isBusy} name="postType" 
                style={{ width: 100, marginLeft: 10 }} onChange={setPostType} value={postType}>
                <NekoOption key={'post'} id={'post'} value={'post'} label="Posts" />
                <NekoOption key={'page'} id={'page'} value={'page'} label="Pages" />
              </NekoSelect>
              <NekoProgress busy={bulkTasks.busy} style={{ marginLeft: 10, flex: 'auto' }}
                value={bulkTasks.value} max={bulkTasks.max} onStopClick={bulkTasks.stop} />
            </div>
            <NekoSpacer height={40} />
            <h3>Topics</h3>
            <NekoTextArea id="topics" name="topics" rows={10} value={topics} onChange={setTemplateProperty}  />
            <NekoCheckbox id="topicsAreTitles" name="topicsAreTitles" label="Use Topics as Titles" value="1"
              checked={topicsAreTitles} onChange={setTemplateProperty} />
            <h3>Generated Posts</h3>
            {!createdPosts.length && <i>Nothing yet.</i>}
            {createdPosts.length > 0 && <ul>
              {createdPosts.map((x, index) => (
                <li key={index}>
                  {x.title} <a target="_blank" href={`/?p=${x.postId}`}>View</a> or <a target="_blank" href={`/wp-admin/post.php?post=${x.postId}&action=edit`}>Edit</a>
                </li>
              ))}
            </ul>}
          </StyledSidebar>}

        {mode === 'single' && <StyledSidebar>

            <h2 style={{ marginTop: 0 }}>Title</h2>
            <NekoInput id="title" disabled={isBusy} value={title} onChange={setTemplateProperty} />
            {titleMessage && <div className="information">Advice: {titleMessage}</div>}

            <NekoSpacer height={20} />
            
            <StyledTitleWithButton>
              <h2>Sections</h2>
              <div style={{ display: 'flex', alignItems: 'center' }}>

                {formInputs.sectionsCount && <>
                  <label style={{ margin: '0 5px 0 0' }}># of Sections: </label>
                  <NekoSelect scrolldown id="sectionsCount" name="sectionsCount" disabled={isBusy}
                    style={{ marginRight: 10 }}
                    value={sectionsCount} description="" onChange={setTemplateProperty}>
                      <NekoOption key={2} id={2} value={2} label={2} />
                      <NekoOption key={3} id={3} value={3} label={3} />
                      <NekoOption key={4} id={4} value={4} label={4} />
                      <NekoOption key={6} id={6} value={6} label={6} />
                      <NekoOption key={8} id={8} value={8} label={8} />
                      <NekoOption key={10} id={10} value={10} label={10} />
                      <NekoOption key={12} id={12} value={12} label={12} />
                  </NekoSelect>
                </>}

                {sectionsCount > 0 && <NekoButton disabled={!title} isBusy={isBusy} startTime={runTimes?.sections}
                  onClick={() => submitSectionsPrompt()}>
                  Generate Sections
                </NekoButton>}
              </div>
            </StyledTitleWithButton>

            {sectionsCount > 0 && <>
              <NekoSpacer height={20} />
              <NekoTextArea id="sections" disabled={isBusy} rows={4} value={sections} onChange={setTemplateProperty} />
              <div className="information">
                Add, rewrite, remove, or reorganize those sections as you wish before (re)clicking on "Generate Content". Markdown format is recommended.
              </div>
            </>}

            <NekoSpacer height={20} />

            <StyledTitleWithButton>
              <h2>Content</h2>
              <div style={{ display: 'flex', alignItems: 'center' }}>

                {formInputs.paragraphsCount && <>
                  <label style={{ margin: '0 5px 0 0' }}># of Paragraphs per Section: </label>
                  <NekoSelect scrolldown id="paragraphsCount" name="paragraphsCount" disabled={isBusy}
                    style={{ marginRight: 10 }}
                    value={paragraphsCount} description="" onChange={setTemplateProperty}>
                      <NekoOption key={1} id={1} value={1} label={1} />
                      <NekoOption key={2} id={2} value={2} label={2} />
                      <NekoOption key={3} id={3} value={3} label={3} />
                      <NekoOption key={4} id={4} value={4} label={4} />
                      <NekoOption key={6} id={6} value={6} label={6} />
                      <NekoOption key={8} id={8} value={8} label={8} />
                      <NekoOption key={10} id={10} value={10} label={10} />
                  </NekoSelect>
                </>}

                <NekoButton disabled={!title} isBusy={isBusy} startTime={runTimes?.content}
                  onClick={() => submitContentPrompt()}>
                  Generate Content
                </NekoButton>
              </div>
            </StyledTitleWithButton>

            <NekoSpacer height={20} />

            <NekoTextArea countable="words" disabled={isBusy} rows={12} value={content} onChange={setContent} />

            <div className="information">
              You can modify the content before using "Create Post". Markdown is supported, and will be converted to HTML when the post is created.
            </div>

            <NekoSpacer height={20} />

            <StyledTitleWithButton>
              <h2>Excerpt</h2>
              <NekoButton disabled={!title} isBusy={isBusy} startTime={runTimes?.excerpt}
                onClick={() => onSubmitPromptForExcerpt()}>
                Generate Excerpt
              </NekoButton>
            </StyledTitleWithButton>

            <NekoSpacer height={20} />

            <NekoTextArea disabled={isBusy} value={excerpt} onBlur={setExcerpt} rows={3} />

            <NekoSpacer height={20} />

            <NekoButton fullWidth style={{ height: 60 }}
              onClick={() => onSubmitNewPost()} isBusy={isBusy} disabled={!title || !content}>
              Create Post
            </NekoButton>

          </StyledSidebar>}

        </NekoColumn>

        <NekoColumn>

          <StyledSidebar style={{ marginBottom: 25 }}>
            <h2 style={{ marginTop: 0 }}>Content Params</h2>

            {!formInputs.language && !formInputs.writingStyle && !formInputs.writingTone &&
              <div style={{ fontSize: 11, lineHeight: '14px' }}>
                Input fields are displayed for certain placeholders used in prompts, such as {`{`}LANGUAGE{`}`} or {`{`}WRITING_TONE{`}`}.
              </div>
            }

            {formInputs.language && <>
              <label>Language:</label>
              <NekoSelect scrolldown id="language" name="language" disabled={isBusy} 
                value={language} description="" onChange={setTemplateProperty}>
                  {languages.map((lang) => {
                    return <NekoOption key={lang.value} id={lang.value} value={lang.value} label={lang.label} />
                  })}
                  <NekoOption key="custom" id="custom" value="custom" label="Other" />
              </NekoSelect>
              {language === 'custom' && <>
                <label>Custom Language:</label>
                <NekoInput id="customLanguage" name="customLanguage" disabled={isBusy}
                  description={<>All the languages are <i>somehow</i> supported by AI. <a href="https://meowapps.com/ai-engine/faq/#languages" target="_blank">Learn more</a>.
                  </>}
                  value={customLanguage} onChange={setTemplateProperty} />
              </>}
            </>}

            {formInputs.writingStyle && <>
              <label>Writing style:</label>
              <NekoSelect scrolldown id="writingStyle" name="writingStyle" disabled={isBusy}
                value={writingStyle} description="" onChange={setTemplateProperty}>
                  {WritingStyles.map((style) => {
                    return <NekoOption key={style.value} id={style.value} value={style.value} label={style.label} />
                  })}
              </NekoSelect>
            </>}

            {formInputs.writingTone && <>
              <label>Writing tone:</label>
              <NekoSelect scrolldown id="writingTone" name="writingTone" disabled={isBusy}
                value={writingTone} description="" onChange={setTemplateProperty}>
                  {WritingTones.map((tone) => {
                    return <NekoOption key={tone.value} id={tone.value} value={tone.value} label={tone.label} />
                  })}
              </NekoSelect>
            </>}
          </StyledSidebar>

          <StyledSidebar style={{ marginTop: 25, marginBottom: 25 }}>
            <StyledTitleWithButton>
              <h2>Model Params</h2>
              <NekoButton onClick={() => setShowModelParams(!showModelParams)}>
                {showModelParams ? 'Hide' : 'Show'}
              </NekoButton>
            </StyledTitleWithButton>
            {showModelParams && <>
              <label>Temperature:</label>
              <NekoInput id="temperature" name="temperature" value={temperature} type="number"
                onChange={setTemplateProperty} onBlur={setTemplateProperty} description={<>
                  <span style={{ color: temperature >= 0 && temperature <= 1 ? 'inherit' : 'red' }}>
                    Between 0 and 1.
                  </span> Higher values means the model will take more risks.
                </>} />
              <label>Max Tokens:</label>
              <NekoInput id="maxTokens" name="maxTokens" value={maxTokens} type="number"
                onChange={setTemplateProperty} onBlur={setTemplateProperty} description={<>
                  <span style={{ color: maxTokens >= 1 && maxTokens <= 4096 ? 'inherit' : 'red' }}>
                    Between 1 and 2048.
                  </span> Higher values means the model will generate more content.
                </>} />
              <label>Model:</label>
              <NekoSelect id="model" name="model" value={model} disabled={true} description="The davinci model is currently the only acceptable one for writing texts. As soon as better models are available, you will be able to choose between them."
                scrolldown={true} onChange={setTemplateProperty}>
                {models.map((x) => (
                  <NekoOption key={x.id} value={x.id} label={x.name}></NekoOption>
                ))}
              </NekoSelect>
            </>}
          </StyledSidebar>

          <StyledSidebar>
            <StyledTitleWithButton>
              <h2>Prompts</h2>
              <NekoButton onClick={() => setShowPrompts(!showPrompts)}>
                {showPrompts ? 'Hide' : 'Show'}
              </NekoButton>
            </StyledTitleWithButton>
            {showPrompts && <>
              <p style={{ fontSize: 11, lineHeight: '14px' }}>
                Prompts represent the exact request sent to the AI. The variables between curly braces will be replaced by the content of the corresponding field. Prompts are saved in your templates.
              </p>
              <label>Prompt for <b>Title</b></label>
              <NekoTextArea disabled={isBusy} id="titlePromptFormat" name="titlePromptFormat"
                value={titlePromptFormat} onChange={setTemplateProperty}  />
              <label>Prompt for <b>Sections</b></label>
              <NekoTextArea disabled={isBusy} id ="sectionsPromptFormat" name="sectionsPromptFormat"
                value={sectionsPromptFormat} onChange={setTemplateProperty}  />
              <label>Prompt for <b>Content</b></label>
              <NekoTextArea disabled={isBusy} id="contentPromptFormat" name="contentPromptFormat"
                value={contentPromptFormat} onChange={setTemplateProperty}  />
              <label>Prompt for <b>Excerpt</b></label>
              <NekoTextArea disabled={isBusy} id="excerptPromptFormat" name="excerptPromptFormat"
                value={excerptPromptFormat} onChange={setTemplateProperty}  />
            </>}
          </StyledSidebar>

        </NekoColumn>

      </NekoWrapper>

      <NekoModal isOpen={createdPostId}
        onRequestClose={() => setCreatedPostId()}
        onOkClick={() => {
          window.open(`/wp-admin/post.php?post=${createdPostId}&action=edit`, '_blank');
          resetTemplate();
        }}
        ok="Edit the Post"
        cancel="Close"
        onCancelClick={() => resetTemplate()}
        title="Post Created!"
        content={<p>
          The post was created as draft.
        </p>}
      />

      <NekoModal isOpen={error}
        onRequestClose={() => { setError() }}
        onOkClick={() => { setError() }}
        title="Error"
        content={<p>{error}</p>}
      />
    </NekoPage> 
  );
};

export default ContentGenerator;