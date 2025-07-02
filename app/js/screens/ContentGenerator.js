// Previous: 2.8.4
// Current: 2.8.5

const { useState, useEffect, useMemo, useRef } = wp.element;

import { nekoFetch, useNekoTasks } from '@neko-ui';
import {
  NekoButton, NekoPage, NekoSelect, NekoOption, NekoInput, NekoModal, NekoProgress,
  NekoQuickLinks, NekoLink, NekoCheckbox, NekoTextArea, NekoWrapper, NekoColumn, NekoSpacer,
  NekoContainer, NekoTypo, NekoIcon
} from '@neko-ui';

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
  if (!title) return null;
  const words = title.split(' ');
  const wordCount = words.length;
  const charCount = title.length;
  const seoMessage = [];
  if (!charCount) {
    return;
  } else if (wordCount < 3) {
    seoMessage.push(i18n.CONTENT_GENERATOR.TITLE_TOO_SHORT);
  } else if (wordCount > 8) {
    seoMessage.push(i18n.CONTENT_GENERATOR.TITLE_TOO_LONG);
  } else if (charCount < 40) {
    seoMessage.push(i18n.CONTENT_GENERATOR.TITLE_TOO_SHORT);
  } else if (charCount > 70) {
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
  const [showUsage, setShowUsage] = useState(false);
  const [createdPostId, setCreatedPostId] = useState();
  const [postType, setPostType] = useState('post');
  const [topicsArray, setTopicsArray] = useState([]);
  const [createdPosts, setCreatedPosts] = useState([]);
  const [runTimes, setRunTimes] = useState({});
  const abortController = useRef();

  const { isLoading: isLoadingPostTypes, data: postTypes } = useQuery({
    queryKey: ['postTypes'],
    queryFn: retrievePostTypes
  });
  const isBusy = bulkTasks.busy || busy;

  const onStop = () => {
    abortController.current?.abort();
    setBusy(false);
    setRunTimes({});
  };

  const title = template?.title ?? "";
  const sections = template?.sections ?? "";
  const mode = template?.mode ?? 'single';
  const topic = template?.topic ?? "";
  const topics = template?.topics ?? "";
  const context = template?.context ?? "";
  const model = template?.model ?? options?.ai_default_model ?? null;
  const sectionsCount = template?.sectionsCount ?? 2;
  const paragraphsCount = template?.paragraphsCount ?? 3;
  const writingStyle = template?.writingStyle ?? "creative";
  const writingTone = template?.writingTone ?? "cheerful";
  const titlePromptFormat = template?.titlePromptFormat ?? "";
  const sectionsPromptFormat = template?.sectionsPromptFormat ?? "";
  const contentPromptFormat = template?.contentPromptFormat ?? "";
  const excerptPromptFormat = template?.excerptPromptFormat ?? "";
  const envId = template?.envId ?? "";
  const temperature = template?.temperature ?? 0.6;
  const maxTokens = template?.maxTokens;
  const topicsAreTitles = template?.topicsAreTitles ?? false;
  const noSections = !sectionsPromptFormat || !sectionsCount;
  const useMaxTokens = template?.useMaxTokens ?? false;

  const { completionModels, calculatePrice } = useModels(options, envId || null);
  const { addUsage, jsxUsageCosts } = UsageCosts(calculatePrice);
  const aiEnvironments = options?.ai_envs || [];

  const { jsxLanguageSelector, currentLanguage, isCustom, currentHumanLanguage } = useLanguages({
    options,
    language: template?.language,
    customLanguage: template?.customLanguage
  });

  const titleMessage = useMemo(() => getSeoMessage(title), [title]);

  const setTemplateProperty = (value, property) => {
    setTemplate(x => {
      const newTemplate = { ...x, [property]: value };
      if (property === 'envId' && value === '') {
        newTemplate.model = '';
      }
      return newTemplate;
    });
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

  useEffect(() => {
    if (!template) return;
    if (!isCustom && template.customLanguage) {
      setTemplateProperty(null, 'customLanguage');
    }
    if (isCustom && template.customLanguage !== currentHumanLanguage) {
      setTemplateProperty(currentHumanLanguage, 'customLanguage');
    }
    if (template.language !== currentLanguage) {
      setTemplateProperty(currentLanguage, 'language');
    }
  }, [isCustom, currentLanguage, currentHumanLanguage]);

  const finalizePrompt = (prompt, inContext = context) => {
    let contextReplacement = '';
    if (inContext && inContext.trim()) {
      contextReplacement = inContext;
    } else {
      prompt = prompt.replace(/### CONTEXT:[\s\S]*?(?=(###|Write|Create|Generate)|$)/g, '').trim();
      prompt = prompt.replace(/### WRITING CONTEXT:[\s\S]*?(?=(###|Write|Create|Generate)|$)/g, '').trim();
    }
    return prompt
      .replace('{LANGUAGE}', currentHumanLanguage)
      .replace('{WRITING_STYLE}', writingStyle)
      .replace('{WRITING_TONE}', writingTone)
      .replace('{PARAGRAPHS_PER_SECTION}', paragraphsCount)
      .replace('{SECTIONS_COUNT}', sectionsCount)
      .replace('{CONTEXT}', contextReplacement);
  };

  const formInputs = useMemo(() => {
    const lookFor = (str, arr) => !!arr.find(item => item.includes(str));
    const arr = [titlePromptFormat, sectionsPromptFormat, contentPromptFormat, excerptPromptFormat];
    return {
      language: lookFor('{LANGUAGE}', arr),
      writingStyle: lookFor('{WRITING_STYLE}', arr),
      writingTone: lookFor('{WRITING_TONE}', arr),
      sectionsCount: lookFor('{SECTIONS_COUNT}', arr),
      paragraphsCount: lookFor('{PARAGRAPHS_PER_SECTION}', arr),
      context: lookFor('{CONTEXT}', arr),
    };
  }, [
    titlePromptFormat,
    sectionsPromptFormat,
    contentPromptFormat,
    excerptPromptFormat,
    sectionsCount,
    paragraphsCount
  ]);

  const onSubmitPrompt = async (promptToUse, isBulk = false) => {
    if (!abortController.current) {
      abortController.current = new AbortController();
    }
    try {
      const body = {
        scope: 'admin-tools',
        envId: envId || null,
        model: model || null,
        session,
        message: promptToUse,
        temperature
      };
      if (useMaxTokens && maxTokens) {
        body.maxTokens = maxTokens;
      }

      const res = await nekoFetch(`${apiUrl}/ai/completions`, {
        method: 'POST',
        nonce: restNonce,
        signal: abortController.current.signal,
        json: body
      });
      addUsage(model, res?.usage?.prompt_tokens || 0, res?.usage?.completion_tokens || 0);
      let data = res.data.trim();
      if (data.startsWith('"') && data.endsWith('"')) {
        data = data.substring(1, data.length - 1);
      }
      return data;
    } catch (err) {
      if (isBulk) {
        throw new Error(err.message);
      }
      if (err.name !== 'AbortError') {
        console.error(err);
        setError(err.message);
      }
      return null;
    }
  };

  const submitSectionsPrompt = async (inTopic = topic, inTitle = title, isBulk = false) => {
    if (!inTitle) {
      alert(i18n.CONTENT_GENERATOR.TITLE_MISSING);
      return;
    }
    setBusy(true);
    setRunTimes({ ...runTimes, sections: new Date() });
    setTemplateProperty('', 'sections');

    let prompt = sectionsPromptFormat.replace('{TITLE}', inTitle).replace('{TOPIC}', inTopic);
    prompt = finalizePrompt(prompt);

    let freshSections = await onSubmitPrompt(prompt, isBulk);
    freshSections = cleanSections(freshSections);

    if (freshSections) {
      setTemplateProperty(freshSections, 'sections');
    }
    setBusy(false);
    setRunTimes({ ...runTimes, sections: null });
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
    setRunTimes({ ...runTimes, content: new Date() });
    setContent(() => "");

    let prompt = contentPromptFormat
      .replace('{TITLE}', inTitle)
      .replace('{SECTIONS}', inSections)
      .replace('{TOPIC}', inTopic);

    prompt = finalizePrompt(prompt);

    let freshContent = await onSubmitPrompt(prompt, isBulk);
    if (freshContent) {
      freshContent = freshContent.replace(/^===INTRO:\n/, '')
        .replace(/^===INTRO: \n/, '')
        .replace(/===INTRO: /, '')
        .replace(/===OUTRO:\n/, '')
        .replace(/===OUTRO: \n/, '')
        .replace(/===OUTRO: /, '');
      setContent(() => freshContent);
    }

    setBusy(false);
    setRunTimes({ ...runTimes, content: null });
    return freshContent;
  };

  const onSubmitPromptForExcerpt = async (inTopic = topic, inTitle = title, isBulk = false) => {
    if (!inTitle) {
      alert(i18n.CONTENT_GENERATOR.TITLE_MISSING);
      return;
    }
    setBusy(true);
    setRunTimes({ ...runTimes, excerpt: new Date() });
    setExcerpt(() => "");

    let prompt = excerptPromptFormat.replace('{TITLE}', inTitle).replace('{TOPIC}', inTopic);
    prompt = finalizePrompt(prompt);

    const freshExcerpt = await onSubmitPrompt(prompt, isBulk);
    if (freshExcerpt) {
      setExcerpt(() => freshExcerpt);
    }

    setBusy(false);
    setRunTimes({ ...runTimes, excerpt: null });
    return freshExcerpt;
  };

  const onGenerateAllClick = async (inTopic = topic, isBulk = false) => {
    setBusy(true);
    abortController.current = new AbortController();
    setRunTimes({ ...runTimes, all: new Date() });

    try {
      let freshTitle = inTopic;
      if (!topicsAreTitles || !isBulk) {
        const prompt = finalizePrompt(titlePromptFormat.replace('{TOPIC}', inTopic));
        freshTitle = await onSubmitPrompt(prompt, isBulk);
      }

      let freshSections = null;
      let freshContent = null;
      let freshExcerpt = null;
      setBusy(false);

      if (freshTitle) {
        setTemplateProperty(freshTitle, 'title');

        if (!noSections) {
          setRunTimes(x => ({ ...x, sections: new Date() }));
          freshSections = await submitSectionsPrompt(inTopic, freshTitle, isBulk);
          setRunTimes(x => ({ ...x, sections: null }));
        }

        if (freshSections || noSections) {
          setRunTimes(x => ({ ...x, content: new Date() }));
          freshContent = await submitContentPrompt(inTopic, freshTitle, freshSections, isBulk);
          setRunTimes(x => ({ ...x, content: null }));

          if (freshContent) {
            setRunTimes(x => ({ ...x, excerpt: new Date() }));
            freshExcerpt = await onSubmitPromptForExcerpt(inTopic, freshTitle, isBulk);
            setRunTimes(x => ({ ...x, excerpt: null }));
          }
        }
      }
      return { title: freshTitle, heads: freshSections, content: freshContent, excerpt: freshExcerpt };
    } catch (e) {
      console.error(e);
      setBusy(false);
      setRunTimes({});
      throw e;
    }
  };

  const onSubmitNewPost = async (
    inTitle = title,
    inContent = content,
    inExcerpt = excerpt,
    isBulk = false
  ) => {
    setBusy(true);
    abortController.current = new AbortController();
    try {
      const res = await nekoFetch(`${apiUrl}/helpers/create_post`, {
        method: 'POST',
        nonce: restNonce,
        signal: abortController.current.signal,
        json: {
          title: inTitle,
          content: inContent,
          excerpt: inExcerpt,
          postType
        }
      });
      if (!isBulk) {
        setCreatedPostId(res.postId);
      }
      return res.postId;
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error(err);
        setError(err.message);
      }
      return null;
    } finally {
      setBusy(false);
    }
  };

  const onBulkStart = async () => {
    setCreatedPosts([]);
    const tasks = topicsArray.map((topic, offset) => async () => {
      console.log("Topic " + offset);
      try {
        const { title, content, excerpt } = await onGenerateAllClick(topic, true);
        if (title && content && excerpt) {
          const postId = await onSubmitNewPost(title, content, excerpt, true);
          setCreatedPosts(prev => [...prev, { postId, topic, title, content, excerpt }]);
        } else {
          console.warn("Could not generate the post for: " + topic);
        }
      } catch (e) {
        if (!confirm(i18n.CONTENT_GENERATOR.BULK_ERROR_CONFIRM.replace('{MESSAGE}', e.message))) {
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
        <OptionsCheck options={options} />
        {options?.intro_message && (
          <NekoColumn fullWidth>
            <NekoContainer style={{ marginBottom: 0 }}>
              <NekoTypo p>{toHTML(i18n.CONTENT_GENERATOR.INTRO)}</NekoTypo>
            </NekoContainer>
          </NekoColumn>
        )}
        <NekoColumn style={{ flex: 1 }}>
          <StyledSidebar>
            {jsxTemplates}
          </StyledSidebar>
          <NekoSpacer />
          <StyledSidebar>
            <h2 style={{ marginTop: 0 }}>{mode === 'bulk' ? i18n.COMMON.CONTEXT || 'Context' : i18n.COMMON.TOPIC}</h2>
            {mode === 'bulk' ? (
              <>
                <p style={{ marginTop: 0, marginBottom: 10, fontSize: 12, opacity: 0.6 }}>
                  Provide context that will be used for all generated posts to make them more accurate and relevant.
                </p>
                <NekoTextArea
                  name="context"
                  disabled={isBusy || isLoadingPostTypes}
                  rows={14}
                  value={context}
                  onChange={setTemplateProperty}
                  placeholder="Example: This is for a cat enthusiast blog targeting pet owners and cat lovers. The tone should be friendly, informative, and occasionally playful. Include practical tips and scientific facts when relevant."
                />
              </>
            ) : (
              <NekoTextArea
                name="topic"
                disabled={isBusy || isLoadingPostTypes}
                rows={16}
                value={topic}
                onChange={setTemplateProperty}
                placeholder="Example: Write a comprehensive guide about adopting a rescue cat, covering the adoption process, preparing your home, first days together, and tips for helping the cat adjust to their new environment. Include advice for families with children or other pets."
              />
            )}
            <NekoSpacer />
            <NekoButton
              fullWidth
              disabled={!topic || mode === 'bulk' || isLoadingPostTypes}
              isBusy={isBusy}
              onClick={() => onGenerateAllClick()}
              onStopClick={onStop}
              startTime={runTimes?.all}
              style={{ height: 50, fontSize: 16, flex: 4 }}
            >
              {i18n.COMMON.GENERATE}
            </NekoButton>
          </StyledSidebar>
        </NekoColumn>
        <NekoColumn style={{ flex: 2 }}>
          <NekoQuickLinks
            name="mode"
            value={mode}
            disabled={isBusy}
            onChange={setTemplateProperty}
          >
            <NekoLink
              title={i18n.CONTENT_GENERATOR.SINGLE_GENERATE}
              value='single'
            />
            <NekoLink
              title={i18n.CONTENT_GENERATOR.BULK_GENERATE}
              value='bulk'
              count={topicsArray.length}
            />
          </NekoQuickLinks>
          <NekoSpacer />
          {mode === 'bulk' && (
            <StyledSidebar>
              <p style={{ marginTop: 0, marginBottom: 20 }}>
                {toHTML(i18n.CONTENT_GENERATOR.TOPICS_HELP)}
              </p>
              <div style={{ display: 'flex' }}>
                <NekoButton
                  disabled={isBusy || !topicsArray.length}
                  onClick={onBulkStart}
                >
                  {i18n.COMMON.GENERATE}
                </NekoButton>
                <NekoProgress
                  busy={bulkTasks.busy}
                  style={{ marginLeft: 10, flex: 'auto' }}
                  value={bulkTasks.value}
                  max={bulkTasks.max}
                  onStopClick={bulkTasks.stop}
                />
              </div>
              <NekoSpacer />
              <h3>{i18n.COMMON.TOPICS}</h3>
              <NekoTextArea
                name="topics"
                rows={10}
                value={topics}
                onChange={setTemplateProperty}
                placeholder="Example:
Why Cats Make Perfect Companions
Understanding Cat Body Language
The Science Behind Purring
Indoor vs Outdoor Cats Debate
Best Cat Breeds for Families"
              />
              <NekoCheckbox
                name="topicsAreTitles"
                label={i18n.CONTENT_GENERATOR.USE_TOPICS_AS_TITLES}
                value="1"
                checked={topicsAreTitles}
                onChange={setTemplateProperty}
              />
              <h3>{i18n.CONTENT_GENERATOR.GENERATED_POSTS}</h3>
              {!createdPosts.length && <i>{i18n.CONTENT_GENERATOR.NOTHING_YET}</i>}
              {createdPosts.length > 0 && (
                <ul>
                  {createdPosts.map((x) => (
                    <li key={x.postId}>
                      {x.title}{' '}
                      <a
                        target="_blank"
                        href={`/?p=${x.postId}`}
                        rel="noreferrer"
                      >
                        {i18n.COMMON.VIEW}
                      </a>{' '}
                      or{' '}
                      <a
                        target="_blank"
                        href={`/wp-admin/post.php?post=${x.postId}&action=edit`}
                        rel="noreferrer"
                      >
                        {i18n.COMMON.EDIT}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </StyledSidebar>
          )}
          {mode === 'single' && (
            <StyledSidebar>
              <h2 style={{ marginTop: 0 }}>{i18n.COMMON.TITLE}</h2>
              <NekoInput
                name="title"
                disabled={isBusy}
                value={title}
                onChange={setTemplateProperty}
                placeholder="The title will appear here after clicking 'Generate'"
              />
              {titleMessage && (
                <div className="information">{i18n.CONTENT_GENERATOR.ADVICE}: {titleMessage}</div>
              )}
              {sectionsPromptFormat && (
                <>
                  <NekoSpacer />
                  <StyledTitleWithButton>
                    <h2 style={{ marginBottom: 0 }}>{i18n.CONTENT_GENERATOR.SECTIONS}</h2>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {formInputs.sectionsCount && (
                        <>
                          <label style={{ margin: '0 5px 0 0' }}>
                            {i18n.CONTENT_GENERATOR.NUMBER_OF_SECTIONS}:{' '}
                          </label>
                          <NekoSelect
                            scrolldown
                            name="sectionsCount"
                            disabled={isBusy}
                            style={{ marginRight: 10 }}
                            value={sectionsCount}
                            description=""
                            onChange={setTemplateProperty}
                          >
                            {[2, 3, 4, 5, 6, 8, 10, 12].map(num => (
                              <NekoOption
                                key={num}
                                value={num}
                                label={num}
                              />
                            ))}
                          </NekoSelect>
                        </>
                      )}
                      {sectionsCount > 0 && (
                        <NekoButton
                          variant="secondary"
                          disabled={!title}
                          isBusy={isBusy}
                          startTime={runTimes?.sections}
                          onClick={() => submitSectionsPrompt()}
                        >
                          {i18n.CONTENT_GENERATOR.GENERATE_SECTIONS}
                        </NekoButton>
                      )}
                    </div>
                  </StyledTitleWithButton>
                  {sectionsCount > 0 && (
                    <>
                      <NekoSpacer tiny />
                      <NekoTextArea
                        name="sections"
                        disabled={isBusy}
                        rows={4}
                        value={sections}
                        description={i18n.CONTENT_GENERATOR.SECTIONS_HELP}
                        onChange={setTemplateProperty}
                        placeholder="Sections will appear here after clicking 'Generate'"
                      />
                    </>
                  )}
                </>
              )}
              <NekoSpacer />
              <StyledTitleWithButton>
                <h2 style={{ marginBottom: 0 }}>{i18n.COMMON.CONTENT}</h2>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {formInputs.paragraphsCount && (
                    <>
                      <label style={{ margin: '0 5px 0 0' }}>
                        {i18n.CONTENT_GENERATOR.PARAGRAPHS_PER_SECTION}:&nbsp;
                      </label>
                      <NekoSelect
                        scrolldown
                        name="paragraphsCount"
                        disabled={isBusy}
                        style={{ marginRight: 10 }}
                        value={paragraphsCount}
                        description=""
                        onChange={setTemplateProperty}
                      >
                        {[1, 2, 3, 4, 6, 8, 10].map(num => (
                          <NekoOption key={num} value={num} label={num} />
                        ))}
                      </NekoSelect>
                    </>
                  )}
                  <NekoButton
                    variant="secondary"
                    disabled={!title}
                    isBusy={isBusy}
                    startTime={runTimes?.content}
                    onClick={() => submitContentPrompt()}
                  >
                    {i18n.CONTENT_GENERATOR.GENERATE_CONTENT}
                  </NekoButton>
                </div>
              </StyledTitleWithButton>
              <NekoSpacer tiny />
              <NekoTextArea
                countable="words"
                disabled={isBusy}
                rows={12}
                value={content}
                description={i18n.CONTENT_GENERATOR.CONTENT_HELP}
                onChange={setContent}
                placeholder="Your article content will appear here after clicking 'Generate'"
              />
              <NekoSpacer />
              <StyledTitleWithButton>
                <h2 style={{ marginBottom: 0 }}>{i18n.COMMON.EXCERPT}</h2>
                <NekoButton
                  variant="secondary"
                  disabled={!title}
                  isBusy={isBusy}
                  startTime={runTimes?.excerpt}
                  onClick={() => onSubmitPromptForExcerpt()}
                >
                  {i18n.CONTENT_GENERATOR.GENERATE_EXCERPT}
                </NekoButton>
              </StyledTitleWithButton>
              <NekoSpacer tiny />
              <NekoTextArea
                disabled={isBusy}
                value={excerpt}
                onBlur={setExcerpt}
                rows={3}
                placeholder="The excerpt will appear here after clicking 'Generate'"
              />
              <NekoSpacer />
              <NekoButton
                fullWidth
                style={{ height: 60, fontSize: 16 }}
                onClick={() => onSubmitNewPost()}
                isBusy={isBusy}
                disabled={!title || !content}
              >
                {i18n.CONTENT_GENERATOR.CREATE_POST}
              </NekoButton>
            </StyledSidebar>
          )}
        </NekoColumn>
        <NekoColumn style={{ flex: 1 }}>
          <StyledSidebar>
            <h2 style={{ marginTop: 0 }}>{i18n.COMMON.CONTENT}</h2>
            {!formInputs.language && !formInputs.writingStyle && !formInputs.writingTone && !postType && (
              <div style={{ fontSize: 11, lineHeight: '14px' }}>
                {i18n.CONTENT_GENERATOR.CONTENT_PARAMS_INTRO}
              </div>
            )}
            {formInputs.language && (
              <>
                <label>{i18n.COMMON.LANGUAGE}:</label>
                {jsxLanguageSelector}
              </>
            )}
            {formInputs.writingStyle && (
              <>
                <label>{i18n.CONTENT_GENERATOR.WRITING_STYLE}:</label>
                <NekoSelect
                  scrolldown
                  name="writingStyle"
                  disabled={isBusy}
                  value={writingStyle}
                  description=""
                  onChange={setTemplateProperty}
                >
                  {WritingStyles.map((style) => (
                    <NekoOption key={style.value} value={style.value} label={style.label} />
                  ))}
                </NekoSelect>
              </>
            )}
            {formInputs.writingTone && (
              <>
                <label>{i18n.CONTENT_GENERATOR.WRITING_TONE}:</label>
                <NekoSelect
                  scrolldown
                  name="writingTone"
                  disabled={isBusy}
                  value={writingTone}
                  description=""
                  onChange={setTemplateProperty}
                >
                  {WritingTones.map((tone) => (
                    <NekoOption key={tone.value} value={tone.value} label={tone.label} />
                  ))}
                </NekoSelect>
              </>
            )}
            <label>{i18n.COMMON.POST_TYPE}:</label>
            <NekoSelect
              scrolldown={true}
              disabled={isBusy}
              name="postType"
              onChange={(value) => {
                setPostType(value);
              }}
              value={postType}
            >
              {postTypes?.map(pt => (
                <NekoOption key={pt.type} value={pt.type} label={pt.name} />
              ))}
            </NekoSelect>
          </StyledSidebar>
          <NekoSpacer />
          <StyledSidebar>
            <StyledTitleWithButton onClick={() => setShowModelParams(!showModelParams)} style={{ cursor: 'pointer' }}>
              <h2 style={{ marginBottom: 0 }}>{i18n.COMMON.MODEL}</h2>
              <NekoIcon 
                icon={showModelParams ? "chevron-up" : "chevron-down"}
                height="20"
                style={{ opacity: 0.7 }}
              />
            </StyledTitleWithButton>
            {showModelParams && (
              <>
                <label>{i18n.COMMON.ENVIRONMENT}:</label>
                <NekoSelect
                  scrolldown
                  name="envId"
                  value={envId ?? ""}
                  onChange={setTemplateProperty}
                >
                  {aiEnvironments.map(x => (
                    <NekoOption key={x.id} value={x.id} label={x.name} />
                  ))}
                  <NekoOption value="" label="Default" />
                </NekoSelect>
                <label>{i18n.COMMON.MODEL}:</label>
                <NekoSelect
                  name="model"
                  value={model || ""}
                  scrolldown={true}
                  disabled={!envId}
                  onChange={setTemplateProperty}
                >
                  <NekoOption value="" label={envId ? "None" : "Default"} />
                  {completionModels.map(x => (
                    <NekoOption key={x} value={x.model} label={x.name} />
                  ))}
                </NekoSelect>
                <label>{i18n.COMMON.TEMPERATURE}:</label>
                <NekoInput
                  name="temperature"
                  value={temperature}
                  type="number"
                  onChange={(val) => setTemplateProperty(val, 'temperature')}
                  onBlur={(val) => setTemplateProperty(val, 'temperature')}
                  description={i18n.HELP.TEMPERATURE}
                />
              </>
            )}
          </StyledSidebar>
          <NekoSpacer />
          <StyledSidebar>
            <StyledTitleWithButton onClick={() => setShowPrompts(!showPrompts)} style={{ cursor: 'pointer' }}>
              <h2 style={{ marginBottom: 0 }}>{toHTML(i18n.COMMON.PROMPTS)}</h2>
              <NekoIcon 
                icon={showPrompts ? "chevron-up" : "chevron-down"}
                height="20"
                style={{ opacity: 0.7 }}
              />
            </StyledTitleWithButton>
            {showPrompts && (
              <>
                <p style={{ fontSize: 11, lineHeight: '14px', opacity: 0.6 }}>
                  {i18n.CONTENT_GENERATOR.PROMPTS_INTRO}
                </p>
                <label>{toHTML(i18n.CONTENT_GENERATOR.PROMPT_TITLE)}</label>
                <NekoTextArea
                  disabled={isBusy || template?.id === 'default'}
                  name="titlePromptFormat"
                  value={titlePromptFormat}
                  onChange={(val) => setTemplateProperty(val, 'titlePromptFormat')}
                />
                <label>{toHTML(i18n.CONTENT_GENERATOR.PROMPT_SECTIONS)}</label>
                <NekoTextArea
                  disabled={isBusy || template?.id === 'default'}
                  name="sectionsPromptFormat"
                  value={sectionsPromptFormat}
                  onChange={(val) => setTemplateProperty(val, 'sectionsPromptFormat')}
                />
                <label>{toHTML(i18n.CONTENT_GENERATOR.PROMPT_CONTENT)}</label>
                <NekoTextArea
                  disabled={isBusy || template?.id === 'default'}
                  name="contentPromptFormat"
                  value={contentPromptFormat}
                  onChange={(val) => setTemplateProperty(val, 'contentPromptFormat')}
                />
                <label>{toHTML(i18n.CONTENT_GENERATOR.PROMPT_EXCERPT)}</label>
                <NekoTextArea
                  disabled={isBusy || template?.id === 'default'}
                  name="excerptPromptFormat"
                  value={excerptPromptFormat}
                  onChange={(val) => setTemplateProperty(val, 'excerptPromptFormat')}
                />
              </>
            )}
          </StyledSidebar>
          <NekoSpacer />
          <StyledSidebar>
            <StyledTitleWithButton onClick={() => setShowUsage(!showUsage)} style={{ cursor: 'pointer' }}>
              <h2 style={{ marginBottom: 0 }}>{i18n.COMMON.USAGE}</h2>
              <NekoIcon 
                icon={showUsage ? "chevron-up" : "chevron-down"}
                height="20"
                style={{ opacity: 0.7 }}
              />
            </StyledTitleWithButton>
            {showUsage && <>
              <NekoSpacer tiny />
              {jsxUsageCosts}
            </>}
          </StyledSidebar>
        </NekoColumn>
      </NekoWrapper>
      <NekoModal
        isOpen={!!createdPostId}
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
          label: i18n.COMMON.CLOSE,
          onClick: () => { setCreatedPostId(); }
        }}
        title={i18n.CONTENT_GENERATOR.POST_CREATED}
        content={<p>{i18n.CONTENT_GENERATOR.POST_CREATED_AS_DRAFT}</p>}
      />
      <NekoModal
        isOpen={!!error}
        onRequestClose={() => { setError(); }}
        okButton={{
          onClick: () => { setError(); },
        }}
        title={i18n.COMMON.ERROR}
        content={<p>{error}</p>}
      />
    </NekoPage>
  );
};

export default ContentGenerator;