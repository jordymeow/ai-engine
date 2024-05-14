// Previous: 2.1.0
// Current: 2.3.0

const { useState, useEffect, useMemo } = wp.element;

import { nekoFetch, useNekoTasks } from '@neko-ui';
import { NekoButton, NekoPage, NekoSelect, NekoOption, NekoInput, NekoModal, NekoProgress,
  NekoQuickLinks, NekoLink, NekoCheckbox,
  NekoTextArea, NekoWrapper, NekoColumn, NekoTypo, NekoSpacer } from '@neko-ui';

import { apiUrl, restNonce, session, options } from '@app/settings';
import { WritingStyles, WritingTones } from "@app/constants";
import { cleanSections, OptionsCheck, useModels, toHTML } from "@app/helpers-admin";
import { AiNekoHeader, StyledTitleWithButton } from "@app/styles/CommonStyles";
import { StyledSidebar } from "@app/styles/StyledSidebar";
import useTemplates from '@app/components/Templates';
import i18n from '@root/i18n';
import UsageCosts from '../components/UsageCosts';
import { retrievePostTypes } from '@app/requests';
import { useQuery } from '@tanstack/react-query';
import { useLanguages } from '@app/helpers-admin';

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
    seoMessage.push(i18n.CONTENT_GENERATOR.TITLE_TOO_SHORT);
  }
  else if (wordCount > 8) {
    seoMessage.push(i18n.CONTENT_GENERATOR.TITLE_TOO_LONG);
  }
  else if (charCount < 40) {
    seoMessage.push(i18n.CONTENT_GENERATOR.TITLE_TOO_SHORT);
  }
  else if (charCount > 70) {
    seoMessage.push(i18n.CONTENT_GENERATOR.TITLE_TOO_LONG_2);
  }
  return seoMessage.join(' ');
};

const ContentGenerator = () => {
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const { template, setTemplate, clearTemplate, jsxTemplates } = useTemplates('contentGenerator');
  const bulkTasks = useNekoTasks();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState();
  const [showModelParams, setShowModelParams] = useState(false);
  const [showPostParams, setShowPostParams] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [createdPostId, setCreatedPostId] = useState();
  const [postType, setPostType] = useState('post');
  const [topicsArray, setTopicsArray] = useState([]);
  const [createdPosts, setCreatedPosts] = useState([]);
  const [runTimes, setRunTimes] = useState({});
  const { title, sections, mode, topic, topics, model, sectionsCount, paragraphsCount, writingStyle, writingTone, titlePromptFormat, sectionsPromptFormat, contentPromptFormat, excerptPromptFormat, envId, temperature, maxTokens, topicsAreTitles } = template ?? {};

  const titleMsg = useMemo(() => getSeoMessage(title ?? ""), [title]);
  const { isLoading: isLoadingPostTypes, data: postTypes } = useQuery({
    queryKey: ['postTypes'], queryFn: retrievePostTypes
  });
  const isBusy = bulkTasks.busy || busy || isLoadingPostTypes;

  const handleTemplateChange = (value, property) => {
    setTemplate(x => ({ ...x, [property]: value }));
  };

  useEffect(() => {
    const freshTopicsArray = topics?.split('\n').map(x => x.trim()).filter(x => !!x) ?? [];
    setTopicsArray(freshTopicsArray);
  }, [topics]);

  useEffect(() => {
    if (template) {
      handleTemplateChange('', 'sections');
    }
  }, [title, sectionsCount]);

  useEffect(() => {
    setContent('');
    setExcerpt('');
    setCreatedPostId();
  }, [sections, paragraphsCount]);

  useEffect(() => {
    if (!template) {
      return;
    }
    if (!isCustom && template?.customLanguage) {
      handleTemplateChange(null, 'customLanguage');
    }
    if (isCustom && template?.customLanguage !== currentHumanLanguage) {
      handleTemplateChange(currentHumanLanguage, 'customLanguage');
    }
    if (template?.language !== currentLanguage) {
      handleTemplateChange(currentLanguage, 'language');
    }
  }, [isCustom, currentLanguage, currentHumanLanguage, template]);

  const finalizePrompt = (prompt) => {
    return prompt
      .replace('{LANGUAGE}', currentHumanLanguage)
      .replace('{WRITING_STYLE}', writingStyle)
      .replace('{WRITING_TONE}', writingTone)
      .replace('{PARAGRAPHS_PER_SECTION}', paragraphsCount)
      .replace('{SECTIONS_COUNT}', sectionsCount);
  };

  const formInputs = useMemo(() => {
    const lookFor = (str, arr) => { return !!arr.find(item => item.includes(str)); };
    const arr = [titlePromptFormat, sectionsPromptFormat, contentPromptFormat, excerptPromptFormat];
    return {
      language: lookFor('{LANGUAGE}', arr),
      writingStyle: lookFor('{WRITING_STYLE}', arr),
      writingTone: lookFor('{WRITING_TONE}', arr),
      sectionsCount: lookFor('{SECTIONS_COUNT}', arr),
      paragraphsCount: lookFor('{PARAGRAPHS_PER_SECTION}', arr),
    };
  }, [titlePromptFormat, sectionsPromptFormat, contentPromptFormat,
    excerptPromptFormat, sectionsCount, paragraphsCount]);

  const onSubmitPrompt = async (promptToUse, maxTokensParam = 2048, isBulk = false) => {
    try {
      const res = await nekoFetch(`${apiUrl}/ai/completions`, { 
        method: 'POST',
        nonce: restNonce,
        json: { 
          scope: 'admin-tools',
          envId: envId || null,
          model: model || null,
          session: session,
          message: promptToUse,
          temperature,
          maxTokens: maxTokensParam
        } });
      addUsage(model, res?.usage?.prompt_tokens ?? 0, res?.usage?.completion_tokens ?? 0);
      let data = res.data.trim();
      if (data.startsWith('"') && data.endsWith('"')) {
        data = data.substring(1, data.length - 1);
      }
      return data;
    }
    catch (err) {
      if (isBulk) {
        throw new Error(err.message);
      }
      console.error(err);
      setError(err.message);
      return null;
    }
  };

  const submitSectionsPrompt = async (inTopic = topic, inTitle = title, isBulk = false) => {
    if (!inTitle) {
      alert(i18n.CONTENT_GENERATOR.TITLE_MISSING);
      return;
    }
    setBusy(true);
    handleTemplateChange('', 'sections');
    console.log("Sections Prompt:", { inTopic, inTitle, sectionsPromptFormat });
    let prompt = sectionsPromptFormat.replace('{TITLE}', inTitle);
    prompt = prompt.replace('{TOPIC}', inTopic);
    prompt = finalizePrompt(prompt);
    let freshSections = await onSubmitPrompt(prompt, 512, isBulk);
    freshSections = cleanSections(freshSections);
    console.log("Sections:", { prompt, sections: freshSections });
    if (freshSections) {
      handleTemplateChange(freshSections, 'sections');
    }
    setBusy(false);
    return freshSections;
  };

  const submitContentPrompt = async (inTopic = topic, inTitle = title, inSections = sections, isBulk = false) => {
    if (!inTitle) {
      alert(i18n.CONTENT_GENERATOR.TITLE_MISSING);
      return;
    }
    if (!noSections && !inSections) {
      alert(i18n.CONTENT_GENERATOR.SECTIONS_MISSING);
      return;
    }
    setBusy(true);
    setContent('');
    let prompt = contentPromptFormat.replace('{TITLE}', inTitle);
    prompt = prompt.replace('{SECTIONS}', inSections);
    prompt = prompt.replace('{TOPIC}', inTopic);
    prompt = finalizePrompt(prompt);
    let freshContent = await onSubmitPrompt(prompt, maxTokens, isBulk);
    if (freshContent) {
      freshContent = freshContent.replace(/^===INTRO:\n/, '');
      freshContent = freshContent.replace(/^===INTRO: \n/, '');
      freshContent = freshContent.replace(/===INTRO: /, '');
      freshContent = freshContent.replace(/===OUTRO:\n/, '');
      freshContent = freshContent.replace(/===OUTRO: \n/, '');
      freshContent = freshContent.replace(/===OUTRO: /, '');
      setContent(freshContent);
    }
    console.log("Content:", { prompt, content: freshContent });
    setBusy(false);
    return freshContent;
  };

  const onSubmitPromptForExcerpt = async (inTopic = topic, inTitle = title, isBulk = false) => {
    if (!inTitle) {
      alert(i18n.CONTENT_GENERATOR.TITLE_MISSING);
      return;
    }
    setBusy(true);
    setExcerpt('');
    let prompt = excerptPromptFormat.replace('{TITLE}', inTitle);
    prompt = prompt.replace('{TOPIC}', inTopic);
    prompt = finalizePrompt(prompt);
    const freshExcerpt = await onSubmitPrompt(prompt, 256, isBulk);
    if (freshExcerpt) {
      setExcerpt(freshExcerpt);
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
      let freshSectionsVal = null;
      let freshContentVal = null;
      let freshExcerptVal = null;
      setBusy(false);
      if (freshTitle) {
        handleTemplateChange(freshTitle, 'title');

        if (!noSections) {
          setRunTimes(prev => ({ ...prev, sections: new Date() }));
          freshSectionsVal = await submitSectionsPrompt(inTopic, freshTitle, isBulk);
          setRunTimes(prev => ({ ...prev, sections: null }));
        }

        if (freshSectionsVal || noSections) {
          setRunTimes(prev => ({ ...prev, content: new Date() }));
          freshContentVal = await submitContentPrompt(inTopic, freshTitle, freshSectionsVal, isBulk);
          setRunTimes(prev => ({ ...prev, content: null }));
          if (freshContentVal) {
            setRunTimes(prev => ({ ...prev, excerpt: new Date() }));
            freshExcerptVal = await onSubmitPromptForExcerpt(inTopic, freshTitle, isBulk);
            setRunTimes(prev => ({ ...prev, excerpt: null }));
          }
        }
      }
      return { title: freshTitle, heads: freshSectionsVal, content: freshContentVal, excerpt: freshExcerptVal };
    }
    catch (e) {
      console.error(e);
      setBusy(false);
      setRunTimes({});
      throw e;
    }
  };

  const onSubmitNewPost = async (inTitle = title, inContent = content,
    inExcerpt = excerpt, isBulk = false) => {
    setBusy(true);
    try {
      const res = await nekoFetch(`${apiUrl}/helpers/create_post`, {
        method: 'POST',
        nonce: restNonce,
        json: { title: inTitle, content: inContent, excerpt: inExcerpt, postType }
      });
      if (!isBulk) {
        setCreatedPostId(res.postId);
      }
      return res.postId;
    }
    catch (err) {
      console.error(err);
      setError(err.message);
      return null;
    }
    finally {
      setBusy(false);
    }
  };

  const onBulkStart = async () => {
    setCreatedPosts([]);
    const tasks = topicsArray.map((topic, offset) => async () => {
      console.log("Topic " + offset);
      try {
        const { title: gTitle, content: gContent, excerpt: gExcerpt } = await onGenerateAllClick(topic, true);
        if (gTitle && gContent && gExcerpt) {
          const postId = await onSubmitNewPost(gTitle, gContent, gExcerpt, true);
          setCreatedPosts(x => [...x, { postId, topic, title: gTitle, content: gContent, excerpt: gExcerpt  }]);
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
  };

  return (
    <NekoPage nekoErrors={[]}>

      <AiNekoHeader title={i18n.COMMON.CONTENT_GENERATOR} />

      <NekoWrapper>

        <NekoColumn fullWidth>
          <OptionsCheck options={options} />

          <NekoTypo p style={{ marginTop: 0, marginBottom: 0 }}>
            {toHTML(i18n.CONTENT_GENERATOR.INTRO)}
          </NekoTypo>
        </NekoColumn>

        <NekoColumn style={{ flex: 1 }}>

          <StyledSidebar>
            <h2 style={{ marginTop: 0 }}>Topic</h2>
            <NekoTextArea name="topic" disabled={isBusy || mode === 'bulk'} rows={5}
              value={topic} onChange={(val) => handleTemplateChange(val, 'topic')}  />
            <NekoSpacer />
            <NekoButton fullWidth disabled={!topic || mode === 'bulk'} isBusy={isBusy} startTime={runTimes?.all}
              onClick={() => onGenerateAllClick()}>
              {i18n.COMMON.GENERATE}
            </NekoButton>
          </StyledSidebar>

          <NekoSpacer />

          <StyledSidebar>
            {jsxTemplates}
          </StyledSidebar>

        </NekoColumn>

        <NekoColumn  style={{ flex: 3 }}>

          <NekoQuickLinks name="mode" value={mode} disabled={isBusy} onChange={(val) => handleTemplateChange(val, 'mode')}>
            <NekoLink title={i18n.CONTENT_GENERATOR.SINGLE_GENERATE} value='single' />
            <NekoLink title={i18n.CONTENT_GENERATOR.BULK_GENERATE} value='bulk'
              count={topicsArray.length} />
          </NekoQuickLinks>

          <NekoSpacer />

          {mode === 'bulk' && <StyledSidebar>
            <p style={{ marginTop: 0, marginBottom: 20 }}>
              {toHTML(i18n.CONTENT_GENERATOR.TOPICS_HELP)}
            </p>
            <div style={{ display: 'flex' }}>
              <NekoButton disabled={isBusy || !topicsArray.length} onClick={onBulkStart}>
                {i18n.COMMON.GENERATE}
              </NekoButton>
              <NekoProgress busy={bulkTasks.busy} style={{ marginLeft: 10, flex: 'auto' }}
                value={bulkTasks.value} max={bulkTasks.max} onStopClick={bulkTasks.stop} />
            </div>
            <NekoSpacer />
            <h3>Topics</h3>
            <NekoTextArea name="topics" rows={10} value={topics} onChange={(val) => handleTemplateChange(val, 'topics')}  />
            <NekoCheckbox name="topicsAreTitles" label="Use Topics as Titles" value="1"
              checked={topicsAreTitles} onChange={(val) => handleTemplateChange(val, 'topicsAreTitles')} />
            <h3>{i18n.CONTENT_GENERATOR.GENERATED_POSTS}</h3>
            {!createdPosts.length && <i>Nothing yet.</i>}
            {createdPosts.length > 0 && <ul>
              {createdPosts.map((x) => (
                <li key={x.postId}>
                  {x.title} <a target="_blank" href={`/?p=${x.postId}`} rel="noreferrer">View</a> or <a target="_blank" href={`/wp-admin/post.php?post=${x.postId}&action=edit`} rel="noreferrer">Edit</a>
                </li>
              ))}
            </ul>}
          </StyledSidebar>}

          {mode === 'single' && <StyledSidebar>

            <h2 style={{ marginTop: 0 }}>Title</h2>
            <NekoInput name="title" disabled={isBusy} value={title}
              onChange={(val) => handleTemplateChange(val, 'title')} />
            {titleMsg && <div className="information">Advice: {titleMsg}</div>}

            {sectionsPromptFormat && <>
              <NekoSpacer />
              <StyledTitleWithButton>
                <h2>{i18n.CONTENT_GENERATOR.SECTIONS}</h2>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {formInputs.sectionsCount && <>
                    <label style={{ margin: '0 5px 0 0' }}># of Sections: </label>
                    <NekoSelect scrolldown name="sectionsCount" disabled={isBusy}
                      style={{ marginRight: 10 }}
                      value={sectionsCount} onChange={(val) => handleTemplateChange(val, 'sectionsCount')}>
                      <NekoOption key={2} value={2} label={2} />
                      <NekoOption key={3} value={3} label={3} />
                      <NekoOption key={4} value={4} label={4} />
                      <NekoOption key={6} value={6} label={6} />
                      <NekoOption key={8} value={8} label={8} />
                      <NekoOption key={10} value={10} label={10} />
                      <NekoOption key={12} value={12} label={12} />
                    </NekoSelect>
                  </>}

                  {sectionsCount > 0 && <NekoButton disabled={!title} isBusy={isBusy}
                    startTime={runTimes?.sections}
                    onClick={() => submitSectionsPrompt()}>
                    {i18n.CONTENT_GENERATOR.GENERATE_SECTIONS}
                  </NekoButton>}
                </div>
              </StyledTitleWithButton>
              {sectionsCount > 0 && <>
                <NekoSpacer />
                <NekoTextArea name="sections" disabled={isBusy} rows={4} value={sections}
                  description={i18n.CONTENT_GENERATOR.SECTIONS_HELP}
                  onChange={(val) => handleTemplateChange(val, 'sections')} />
              </>}
            </>}

            <NekoSpacer />

            <StyledTitleWithButton>
              <h2>{i18n.COMMON.CONTENT}</h2>
              <div style={{ display: 'flex', alignItems: 'center' }}>

                {formInputs.paragraphsCount && <>
                  <label style={{ margin: '0 5px 0 0' }}>
                    {i18n.CONTENT_GENERATOR.PARAGRAPHS_PER_SECTION}:&nbsp;
                  </label>
                  <NekoSelect scrolldown name="paragraphsCount" disabled={isBusy}
                    style={{ marginRight: 10 }}
                    value={paragraphsCount} onChange={(val) => handleTemplateChange(val, 'paragraphsCount')}>
                    <NekoOption key={1} value={1} label={1} />
                    <NekoOption key={2} value={2} label={2} />
                    <NekoOption key={3} value={3} label={3} />
                    <NekoOption key={4} value={4} label={4} />
                    <NekoOption key={6} value={6} label={6} />
                    <NekoOption key={8} value={8} label={8} />
                    <NekoOption key={10} value={10} label={10} />
                  </NekoSelect>
                </>}

                <NekoButton disabled={!title} isBusy={isBusy} startTime={runTimes?.content}
                  onClick={() => submitContentPrompt()}>
                  {i18n.CONTENT_GENERATOR.GENERATE_CONTENT}
                </NekoButton>
              </div>
            </StyledTitleWithButton>

            <NekoSpacer />

            <NekoTextArea countable="words" disabled={isBusy} rows={12} value={content}
              description={i18n.CONTENT_GENERATOR.CONTENT_HELP}
              onChange={(val) => setContent(val)} />

            <NekoSpacer />

            <StyledTitleWithButton>
              <h2>{i18n.COMMON.EXCERPT}</h2>
              <NekoButton disabled={!title} isBusy={isBusy} startTime={runTimes?.excerpt}
                onClick={() => onSubmitPromptForExcerpt()}>
                {i18n.CONTENT_GENERATOR.GENERATE_EXCERPT}
              </NekoButton>
            </StyledTitleWithButton>

            <NekoSpacer />

            <NekoTextArea disabled={isBusy} value={excerpt} onBlur={(val) => setExcerpt(val)} rows={3} />

            <NekoSpacer line={true} height={40} />

            <NekoSelect scrolldown={true} disabled={isBusy} name="postType" 
              onChange={(val) => setPostType(val)} value={postType}>
              {postTypes?.map(pt => 
                <NekoOption key={pt.type} value={pt.type} label={pt.name} />
              )}
            </NekoSelect>

            <NekoSpacer />

            <NekoButton fullWidth style={{ height: 60 }}
              onClick={() => onSubmitNewPost()} isBusy={isBusy} disabled={!title || !content}>
              {i18n.CONTENT_GENERATOR.CREATE_POST}
            </NekoButton>

          </StyledSidebar>}

        </NekoColumn>

        <NekoColumn>

          <StyledSidebar>
            <h2 style={{ marginTop: 0 }}>{i18n.CONTENT_GENERATOR.CONTENT_PARAMS}</h2>

            {!formInputs.language && !formInputs.writingStyle && !formInputs.writingTone &&
              <div style={{ fontSize: 11, lineHeight: '14px' }}>
                {i18n.CONTENT_GENERATOR.CONTENT_PARAMS_INTRO}
              </div>
            }

            {formInputs.language && <>
              <label>{i18n.COMMON.LANGUAGE}:</label>
              {jsxLanguageSelector}
            </>}

            {formInputs.writingStyle && <>
              <label>{i18n.CONTENT_GENERATOR.WRITING_STYLE}:</label>
              <NekoSelect scrolldown name="writingStyle" disabled={isBusy}
                value={writingStyle} onChange={(val) => handleTemplateChange(val, 'writingStyle')}>
                {WritingStyles.map((style) => {
                  return <NekoOption key={style.value} value={style.value} label={style.label} />;
                })}
              </NekoSelect>
            </>}

            {formInputs.writingTone && <>
              <label>{i18n.CONTENT_GENERATOR.WRITING_TONE}:</label>
              <NekoSelect scrolldown name="writingTone" disabled={isBusy}
                value={writingTone} onChange={(val) => handleTemplateChange(val, 'writingTone')}>
                {WritingTones.map((tone) => {
                  return <NekoOption key={tone.value} value={tone.value} label={tone.label} />;
                })}
              </NekoSelect>
            </>}

          </StyledSidebar>

          <NekoSpacer />

          <StyledSidebar>
            <StyledTitleWithButton>
              <h2>{i18n.CONTENT_GENERATOR.POST_PARAMS}</h2>
              <NekoButton onClick={() => setShowPostParams(prev => !prev)}>
                {showPostParams ? i18n.COMMON.HIDE : i18n.COMMON.SHOW}
              </NekoButton>
            </StyledTitleWithButton>
            {showPostParams && <>
              <label>{i18n.COMMON.POST_TYPE}:</label>
              <NekoSelect scrolldown={true} disabled={isBusy} name="postType" 
                onChange={(val) => handleTemplateChange(val, 'postType')} value={postType}>
                {postTypes?.map(pt => 
                  <NekoOption key={pt.type} value={pt.type} label={pt.name} />
                )}
              </NekoSelect>
            </>}
          </StyledSidebar>

          <NekoSpacer />

          <StyledSidebar>
            <StyledTitleWithButton>
              <h2>{i18n.COMMON.MODEL_PARAMS}</h2>
              <NekoButton onClick={() => setShowModelParams(prev => !prev)}>
                {showModelParams ? i18n.COMMON.HIDE : i18n.COMMON.SHOW}
              </NekoButton>
            </StyledTitleWithButton>
            {showModelParams && <>

              <label>{i18n.COMMON.ENVIRONMENT}:</label>
              <NekoSelect scrolldown name="envId"
                value={envId ?? ""} onChange={(val) => handleTemplateChange(val, 'envId')}>
                {aiEnvironments.map(x => <NekoOption key={x.id} value={x.id} label={x.name} />)}
                <NekoOption value={""} label={"None"}></NekoOption>
              </NekoSelect>

              <label>{i18n.COMMON.MODEL}:</label>
              <NekoSelect name="model" value={model}
                description={i18n.CONTENT_GENERATOR.MODEL_HELP}
                scrolldown={true} onChange={(val) => handleTemplateChange(val, 'model')}>
                {completionModels.map(x => <NekoOption key={x.model} value={x.model} label={x.name}></NekoOption>)}
              </NekoSelect>

              <label>{i18n.COMMON.TEMPERATURE}:</label>
              <NekoInput name="temperature" value={temperature} type="number"
                onChange={(val) => handleTemplateChange(val, 'temperature')} onBlur={(val) => handleTemplateChange(val, 'temperature')}
                description={i18n.HELP.TEMPERATURE} />

              <label>{i18n.COMMON.MAX_TOKENS}:</label>
              <NekoInput name="maxTokens" value={maxTokens} type="number"
                onChange={(val) => handleTemplateChange(val, 'maxTokens')} onBlur={(val) => handleTemplateChange(val, 'maxTokens')}
                description={i18n.HELP.MAX_TOKENS} />
            </>}

          </StyledSidebar>

          <NekoSpacer />

          <StyledSidebar>
            <StyledTitleWithButton>
              <h2>{toHTML(i18n.COMMON.PROMPTS)}</h2>
              <NekoButton onClick={() => setShowPrompts(prev => !prev)}>
                {showPrompts ? 'Hide' : 'Show'}
              </NekoButton>
            </StyledTitleWithButton>
            {showPrompts && <>
              <p style={{ fontSize: 11, lineHeight: '14px' }}>
                {i18n.CONTENT_GENERATOR.PROMPTS_INTRO}
              </p>
              <label>{toHTML(i18n.CONTENT_GENERATOR.PROMPT_TITLE)}</label>
              <NekoTextArea disabled={isBusy} name="titlePromptFormat"
                value={titlePromptFormat} onChange={(val) => handleTemplateChange(val, 'titlePromptFormat')}  />
              <label>{toHTML(i18n.CONTENT_GENERATOR.PROMPT_SECTIONS)}</label>
              <NekoTextArea disabled={isBusy} name="sectionsPromptFormat"
                value={sectionsPromptFormat} onChange={(val) => handleTemplateChange(val, 'sectionsPromptFormat')}  />
              <label>{toHTML(i18n.CONTENT_GENERATOR.PROMPT_CONTENT)}</label>
              <NekoTextArea disabled={isBusy} name="contentPromptFormat"
                value={contentPromptFormat} onChange={(val) => handleTemplateChange(val, 'contentPromptFormat')}  />
              <label>{toHTML(i18n.CONTENT_GENERATOR.PROMPT_EXCERPT)}</label>
              <NekoTextArea disabled={isBusy} name="excerptPromptFormat"
                value={excerptPromptFormat} onChange={(val) => handleTemplateChange(val, 'excerptPromptFormat')}  />
            </>}
          </StyledSidebar>

          <NekoSpacer />
          {jsxUsageCosts}

        </NekoColumn>

      </NekoWrapper>

      <NekoModal isOpen={createdPostId}
        onRequestClose={() => setCreatedPostId()}
        okButton={{
          label: i18n.CONTENT_GENERATOR.EDIT_POST,
          onClick: () => {
            window.open(`/wp-admin/post.php?post=${createdPostId}&action=edit`, '_blank');
            clearTemplate();
            setCreatedPostId();
          }
        }}
        cancelButton={{
          label: "Close",
          onClick: () => { setCreatedPostId(); }
        }}
        title={i18n.CONTENT_GENERATOR.POST_CREATED}
        content={<p>{i18n.CONTENT_GENERATOR.POST_CREATED_AS_DRAFT}</p>}
      />

      <NekoModal isOpen={error}
        onRequestClose={() => { setError(); }}
        okButton={{
          onClick: () => { setError(); },
        }}
        title="Error"
        content={<p>{error}</p>}
      />
      
    </NekoPage> 
  );
};

export default ContentGenerator;