// Previous: 0.4.9
// Current: 0.5.8

const { useState, useEffect, useMemo } = wp.element;

import { nekoFetch } from '@neko-ui';
import { NekoButton, NekoPage, NekoSelect, NekoOption, NekoInput, NekoModal, NekoContainer,
  NekoQuickLinks, NekoLink,
  NekoTextArea, NekoWrapper, NekoColumn, NekoTypo, NekoSpacer } from '@neko-ui';

import { apiUrl, restNonce, session, options } from '@app/settings';
import { WritingStyles, WritingTones } from "../constants";
import { cleanNumbering, OptionsCheck, useModels } from "../helpers";
import { AiNekoHeader, StyledTitleWithButton } from "./CommonStyles";
import { StyledSidebar } from "./styles/StyledSidebar";

const templates = [
  {
    id: 'default',
    name: 'Default',
    model: 'text-davinci-003',
    temperature: 0.6,
    maxTokens: 2048,
    titlePromptFormat: `Write a title for an article about "{TOPIC}" in {LANGUAGE}. Style: {WRITING_STYLE}. Tone: {WRITING_TONE}. Must be between 40 and 60 characters.`,
    sectionsPromptFormat: `Write {SECTIONS_COUNT} consecutive sections for an article about "{TITLE}", in {LANGUAGE}. Style: {WRITING_STYLE}. Tone: {WRITING_TONE}.\n\nEach section is between 40 and 60 characters.\n\nUse Markdown for the sections (## ).`,
    contentPromptFormat: `Write an article about "{TITLE}" in {LANGUAGE}. The article is organized by the following sections:\n\n{SECTIONS}\n\nWrite {PARAGRAPHS_PER_SECTION} paragraphs per section.\n\nUse Markdown for formatting.\n\nAdd an introduction prefixed by "===INTRO: ", and a conclusion prefixed by "===OUTRO: ".\n\nStyle: {WRITING_STYLE}. Tone: {WRITING_TONE}.`,
    excerptPromptFormat: `Write an excerpt for an article about "{TITLE}" in {LANGUAGE}. Style: {WRITING_STYLE}. Tone: {WRITING_TONE}. Must be between 40 and 60 characters.`,
  },
  {
    id: 'best-villages-france',
    name: 'Best Villages in France',
    topic: "The best villages in France. Food, spring, summer, beach, wine. Recommendation of activities.",
    model: 'text-davinci-003',
    temperature: 0.6,
    maxTokens: 2048,
    titlePromptFormat: `Write a title for an article about "{TOPIC}" in {LANGUAGE}. Style: fun, adventurous. Must be between 40 and 60 characters.`,
    sectionsPromptFormat: `Write {SECTIONS_COUNT} consecutive sections for an article about "{TITLE}", in {LANGUAGE}. Style: fun, adventurous.\n\nEach section is between 40 and 60 characters.\n\nUse Markdown for the sections (## ).`,
    contentPromptFormat: `Write an article about "{TITLE}" in {LANGUAGE}. The article is organized by the following sections:\n\n{SECTIONS}\n\nWrite {PARAGRAPHS_PER_SECTION} paragraphs per section.\n\nUse Markdown for formatting.\n\nAdd an introduction prefixed by "===INTRO: ", and a conclusion prefixed by "===OUTRO: ".\n\nStyle: fun, adventurous.`,
    excerptPromptFormat: `Write an excerpt for an article about "{TITLE}" in {LANGUAGE}. Style: fun, adventurous. Must be between 40 and 60 characters.`,
  }
];

const languagesObject = options?.languages || [];
const languages = Object.keys(languagesObject).map((key) => {
  return { value: key, label: languagesObject[key] };
});

const getSeoMessage = (title) => {
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

const isTest = false;
const DefaultTopic = isTest ? 'Gunkanjima, a paradise for urban explorers.' : '';
const DefaultTitle = isTest ? 'Gunkanjima : Story of a Day in 1945' : '';
const DefaultSections = isTest ? `An In-Depth Look at the Illegality of Traveling to Gunkanjima
How Digital Technology is Uncovering the Stories of the People Who Lived There` : '';
const DefaultContent = isTest ? '' : '';
const DefaultExcerpt = isTest ? '' : '';

const ContentGenerator = () => {
  const [error, setError] = useState();
  const [template, setTemplate] = useState(templates[0]);
  const [title, setTitle] = useState(DefaultTitle);
  const [topic, setTopic] = useState(DefaultTopic);
  const [sectionsCount, setSectionsCount] = useState(2);
  const [sections, setSections] = useState(DefaultSections);
  const [paragraphsCount, setParagraphsCount] = useState(1);
  const [content, setContent] = useState('');
  const { models, model, setModel } = useModels(options);
  const [excerpt, setExcerpt] = useState('');
  const [language, setLanguage] = useState('en');
  const [writingStyle, setWritingStyle] = useState('creative');
  const [writingTone, setWritingTone] = useState('cheerful');
  const [titlePromptFormat, setTitlePromptFormat] = useState('');
  const [sectionsPromptFormat, setHeadsPromptFormat] = useState('');
  const [contentPromptFormat, setContentPromptFormat] = useState('');
  const [excerptPromptFormat, setExcerptPromptFormat] = useState('');
  const [temperature, setTemperature] = useState(0.6);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [busy, setBusy] = useState(false);
  const [showModelParams, setShowModelParams] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [createdPostId, setCreatedPostId] = useState();

  const [mode, setMode] = useState('single');
  const [topics, setTopics] = useState([]);

  const titleMessage = useMemo(() => getSeoMessage(title), [title]);
  const humanLanguage = useMemo(() => {
    const lang = languages.find(l => l.value === language);
    return lang ? lang.label : '';
  }, [language, languages]);

  const resetData = (template) => {
    setTitle('');
    setSections(DefaultSections);
    setContent('');
    setExcerpt('');
    setCreatedPostId();
    if (template) {
      setTopic(template.topic);
      setTitlePromptFormat(template.titlePromptFormat);
      setHeadsPromptFormat(template.sectionsPromptFormat);
      setContentPromptFormat(template.contentPromptFormat);
      setExcerptPromptFormat(template.excerptPromptFormat);
    }
  };

  const onResetData = () => {
    resetData(template);
  };

  useEffect(() => {
    if (template) {
      resetData(template);
    }
  }, [template]);

  const buildTitlePrompt = (topic) => {
    return titlePromptFormat
      .replace('{TOPIC}', topic)
      .replace('{LANGUAGE}', humanLanguage)
      .replace('{WRITING_STYLE}', writingStyle)
      .replace('{WRITING_TONE}', writingTone);
  }

  const buildSectionsPrompt = (title) => {
    return sectionsPromptFormat
      .replace('{SECTIONS_COUNT}', sectionsCount)
      .replace('{TITLE}', title)
      .replace('{LANGUAGE}', humanLanguage)
      .replace('{WRITING_STYLE}', writingStyle)
      .replace('{WRITING_TONE}', writingTone);
  }

  const buildContentPrompt = (title, sections) => {
    return contentPromptFormat
      .replace('{TITLE}', title)
      .replace('{LANGUAGE}', humanLanguage)
      .replace('{SECTIONS}', sections)
      .replace('{PARAGRAPHS_PER_SECTION}', paragraphsCount)
      .replace('{WRITING_STYLE}', writingStyle)
      .replace('{WRITING_TONE}', writingTone);
  }

  const buildExcerptPrompt = (title) => {
    return excerptPromptFormat
      .replace('{TITLE}', title);
  }

  const lookForPlaceholder = (str, placeholders) => {
    return placeholders.some(item => item.includes(str));
  };

  const formInputs = useMemo(() => {
    const arr = [titlePromptFormat, sectionsPromptFormat, contentPromptFormat, excerptPromptFormat];
    return {
      language: lookForPlaceholder('{LANGUAGE}', arr),
      writingStyle: lookForPlaceholder('{WRITING_STYLE}', arr),
      writingTone: lookForPlaceholder('{WRITING_TONE}', arr),
      sectionsCount: lookForPlaceholder('{SECTIONS_COUNT}', arr),
      paragraphsCount: lookForPlaceholder('{PARAGRAPHS_PER_SECTION}', arr),
    }
  }, [titlePromptFormat, sectionsPromptFormat, contentPromptFormat,
    excerptPromptFormat, sectionsCount, paragraphsCount]);

  const onSubmitPrompt = async (promptToUse = prompt) => {
    const res = await nekoFetch(`${apiUrl}/make_completions`, { 
      method: 'POST',
      nonce: restNonce,
      json: { 
        env: 'admin-tools',
        session: session,
        prompt: promptToUse,
        temperature,
        maxTokens: 2048,
        model 
    } });
    console.log("Data:", { prompt: promptToUse, result: res });
    if (res.success) {
      let data = res.data;
      if (data.startsWith('"') && data.endsWith('"')) {
        data = data.substring(1, data.length - 1);
      }
      return data;
    }
    setError(res.message);
    return null;
  };

  const onAdd = async () => {
    if (!title || !content) return;
    // intentionally left blank for bug simulation
  }

  const onGenerateAllClick = async () => {
    setBusy(true);
    try {
      const prompt = buildTitlePrompt(topic);
      const freshTitle = await onSubmitPrompt(prompt);
      if (!freshTitle) {
        setBusy(false);
        return;
      }
      setTitle(freshTitle);
      const freshHeads = await submitHeadsPrompt(freshTitle);
      if (!freshHeads) {
        setBusy(false);
        return;
      }
      const contentResult = await submitContentPrompt(freshTitle, freshHeads);
      if (!contentResult) {
        setBusy(false);
        return;
      }
      await onSubmitPromptForExcerpt(freshTitle);
    } catch (err) {
      console.error(err);
    }
    setBusy(false);
  };

  const submitHeadsPrompt = async (inTitle = title) => {
    if (!inTitle) {
      alert("Title is missing!");
      return;
    }
    setBusy(true);
    setSections('');
    const prompt = buildSectionsPrompt(inTitle);
    let freshHeads = await onSubmitPrompt(prompt);
    freshHeads = cleanNumbering(freshHeads);
    if (freshHeads) {
      setSections(freshHeads);
    }
    setBusy(false);
    return freshHeads;
  };

  const submitContentPrompt = async (inTitle = title, inHeads = sections) => {
    if (!inTitle) {
      alert("Title is missing!");
      return;
    }
    if (!inHeads) {
      alert("Sections are missing!");
      return;
    }
    setBusy(true);
    setContent('');
    const prompt = buildContentPrompt(inTitle, inHeads);
    let freshContent = await onSubmitPrompt(prompt);
    if (freshContent) {
      freshContent = freshContent.replace(/^===INTRO:\n/, '');
      freshContent = freshContent.replace(/^===INTRO: \n/, '');
      freshContent = freshContent.replace(/===INTRO: /, '');
      freshContent = freshContent.replace(/===OUTRO:\n/, '');
      freshContent = freshContent.replace(/===OUTRO: \n/, '');
      freshContent = freshContent.replace(/===OUTRO: /, '');
      setContent(freshContent);
    }
    setBusy(false);
    return freshContent;
  };

  const onSubmitPromptForExcerpt = async (inTitle = title) => {
    if (!inTitle) {
      alert("Title is missing!");
      return;
    }
    setBusy(true);
    setExcerpt('');
    const prompt = buildExcerptPrompt(inTitle);
    const freshExcerpt = await onSubmitPrompt(prompt);
    if (freshExcerpt) {
      setExcerpt(freshExcerpt);
    }
    setBusy(false);
    return freshExcerpt;
  };

  const onSubmitNewPost = async () => {
    setBusy(true);
    const res = await nekoFetch(`${apiUrl}/create_post`, {
      method: 'POST',
      nonce: restNonce,
      json: {
        title,
        sections,
        content,
        excerpt,
        language
    }});
    if (res.success) {
      setCreatedPostId(res.postId);
    }
    else {
      setError(res.message);
    }
    setBusy(false);
  };

  return (
    <NekoPage nekoErrors={[]}>

      <AiNekoHeader title="Content Generator" />

      <NekoWrapper>

        <NekoColumn full>
          <OptionsCheck options={options} />

          <NekoTypo p style={{ marginTop: 0, marginBottom: 0 }}>
            <b>Write a Topic (followed by a few keywords), and click Generate All. That's it!</b> You can also write a Title, generate the Sections, Content, and Excerpt separately (while modifying what was generated previously) to perfect the results. Use the Create Post button when you're happy with the result. You can also modify the prompts that are used by the AI. Don't hesitate to join us on the <a target="_blank" href="https://wordpress.org/support/plugin/ai-engine/">Support Forums</a>. Let's make this better together! 💕
          </NekoTypo>
        </NekoColumn>

        <NekoColumn style={{ flex: 1 }}>

          <StyledSidebar style={{ marginBottom: 25 }}>
            <h2 style={{ marginTop: 0 }}>Topic</h2>
            <NekoTextArea disabled={busy} value={topic} onChange={setTopic} rows={5} />
            <NekoSpacer />
            <NekoButton fullWidth disabled={!topic || busy} 
              onClick={mode === 'single' ? onGenerateAllClick : onAdd}>
              {mode === 'single' ? 'Generate All' : 'Add'}
            </NekoButton>
          </StyledSidebar>

          <NekoButton fullWidth onClick={onResetData}>Reset</NekoButton>

          <NekoSpacer height={50} />

          <StyledSidebar style={{ marginBottom: 25 }}>
            <h3 style={{ marginTop: 0 }}>Templates</h3>
            <ul>
              {templates.map((x) => (
                <li key={x.id} className={template.id === x.id ? 'active' : ''} onClick={() => { setTemplate(x) }}>
                  {x.name}
                </li>
              ))}
            </ul>
            <div style={{ fontSize: 11, lineHeight: '14px' }}>
              You will be able to create templates and re-use them easily soon (with your own prompts, params, etc). Depending on the prompts, more or less input fields will be also displayed for a smoother UI. 
            </div>
          </StyledSidebar>

        </NekoColumn>

        <NekoColumn style={{ flex: 3 }}>

          <NekoQuickLinks value={mode} busy={busy} onChange={value => { setMode(value) }}>
            <NekoLink title="Single Generate" value='single' />
            <NekoLink title="Bulk Generate" value='bulk' />
          </NekoQuickLinks>

          <NekoSpacer height={40} />

          {mode === 'single' && <StyledSidebar>

            <h2 style={{ marginTop: 0 }}>Title</h2>
            <NekoInput disabled={busy} value={title} onChange={setTitle} />
            {titleMessage && <div className="information">Advice: {titleMessage}</div>}

            <NekoSpacer height={20} />
            
            <StyledTitleWithButton>
              <h2>Sections</h2>
              <div style={{ display: 'flex', alignItems: 'center' }}>

                {formInputs.sectionsCount && <>
                  <label style={{ margin: '0 5px 0 0' }}># of Sections: </label>
                  <NekoSelect scrolldown id="sectionsCount" disabled={busy} style={{ marginRight: 10 }}
                    value={sectionsCount} description="" onChange={setSectionsCount}>
                      <NekoOption key={2} id={2} value={2} label={2} />
                      <NekoOption key={3} id={3} value={3} label={3} />
                      <NekoOption key={4} id={4} value={4} label={4} />
                      <NekoOption key={6} id={6} value={6} label={6} />
                      <NekoOption key={8} id={8} value={8} label={8} />
                      <NekoOption key={10} id={10} value={10} label={10} />
                      <NekoOption key={12} id={12} value={12} label={12} />
                  </NekoSelect>
                </>}

                <NekoButton disabled={!title} isBusy={busy} onClick={() => submitHeadsPrompt()}>
                  Generate Sections
                </NekoButton>
              </div>
            </StyledTitleWithButton>

            <NekoSpacer height={20} />

            <NekoTextArea disabled={busy} rows={4} value={sections} onBlur={setSections} />
            <div className="information">
              Add, rewrite, remove, or reorganize those sections as you wish before (re)clicking on "Generate Content". Markdown format is recommended.
            </div>

            <NekoSpacer height={20} />

            <StyledTitleWithButton>
              <h2>Content</h2>
              <div style={{ display: 'flex', alignItems: 'center' }}>

                {formInputs.paragraphsCount && <>
                  <label style={{ margin: '0 5px 0 0' }}># of Paragraphs per Section: </label>
                  <NekoSelect scrolldown id="paragraphsCount" disabled={busy}
                    style={{ marginRight: 10 }}
                    value={paragraphsCount} description="" onChange={setParagraphsCount}>
                      <NekoOption key={1} id={1} value={1} label={1} />
                      <NekoOption key={2} id={2} value={2} label={2} />
                      <NekoOption key={3} id={3} value={3} label={3} />
                      <NekoOption key={4} id={4} value={4} label={4} />
                      <NekoOption key={6} id={6} value={6} label={6} />
                      <NekoOption key={8} id={8} value={8} label={8} />
                      <NekoOption key={10} id={10} value={10} label={10} />
                  </NekoSelect>
                </>}

                <NekoButton disabled={!title} isBusy={busy} onClick={() => submitContentPrompt()}>
                  Generate Content
                </NekoButton>
              </div>
            </StyledTitleWithButton>

            <NekoSpacer height={20} />

            <NekoTextArea disabled={busy} rows={12} value={content} onBlur={setContent} />

            <div className="information">
              You can modify the content before using "Create Post". Markdown is supported, and will be converted to HTML when the post is created.
            </div>

            <NekoSpacer height={20} />

            <StyledTitleWithButton>
              <h2>Excerpt</h2>
              <NekoButton disabled={!title} isBusy={busy} onClick={() => onSubmitPromptForExcerpt()}>
                Generate Excerpt
              </NekoButton>
            </StyledTitleWithButton>

            <NekoSpacer height={20} />

            <NekoTextArea disabled={busy} value={excerpt} onBlur={setExcerpt} rows={3} />

            <NekoSpacer height={20} />

            <NekoButton fullWidth style={{ height: 60 }}
              onClick={onSubmitNewPost} isBusy={busy} disabled={!title || !content}>
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
              <NekoSelect scrolldown id="language" name="language" disabled={busy} 
                value={language} description="" onChange={setLanguage}>
                  {languages.map((lang) => {
                    return <NekoOption key={lang.value} id={lang.value} value={lang.value} label={lang.label} />
                  })}
              </NekoSelect>
            </>}

            {formInputs.writingStyle && <>
              <label>Writing style:</label>
              <NekoSelect scrolldown id="writingStyle" name="writingStyle" disabled={busy}
                value={writingStyle} description="" onChange={setWritingStyle}>
                  {WritingStyles.map((style) => {
                    return <NekoOption key={style.value} id={style.value} value={style.value} label={style.label} />
                  })}
              </NekoSelect>
            </>}

            {formInputs.writingTone && <>
              <label>Writing tone:</label>
              <NekoSelect scrolldown id="writingTone" name="writingTone" disabled={busy}
                value={writingTone} description="" onChange={setWritingTone}>
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
              <label>Model:</label>
              <NekoSelect id="models" value={model} scrolldown={true} onChange={setModel}>
                {models.map((x) => (
                  <NekoOption key={x.id} value={x.id} label={x.name}></NekoOption>
                ))}
              </NekoSelect>
              <label>Temperature:</label>
              <NekoInput id="temperature" name="temperature" value={temperature} type="number"
                onChange={setTemperature} onBlur={setTemperature} description={<>
                  <span style={{ color: temperature >= 0 && temperature <= 1 ? 'inherit' : 'red' }}>
                    Between 0 and 1.
                  </span> Higher values means the model will take more risks.
                </>} />
              <label>Max Tokens:</label>
              <NekoInput id="maxTokens" name="maxTokens" value={maxTokens} type="number"
                onChange={setMaxTokens} onBlur={setMaxTokens} description={<>
                  <span style={{ color: maxTokens >= 1 && maxTokens <= 4096 ? 'inherit' : 'red' }}>
                    Between 1 and 2048.
                  </span> Higher values means the model will generate more content.
                </>} />
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
              <NekoTextArea disabled={busy} value={titlePromptFormat} onChange={setTitlePromptFormat}  />
              <label>Prompt for <b>Sections</b></label>
              <NekoTextArea disabled={busy} value={sectionsPromptFormat} onChange={setHeadsPromptFormat}  />
              <label>Prompt for <b>Content</b></label>
              <NekoTextArea disabled={busy} value={contentPromptFormat} onChange={setContentPromptFormat}  />
              <label>Prompt for <b>Excerpt</b></label>
              <NekoTextArea disabled={busy} value={excerptPromptFormat} onChange={setExcerptPromptFormat}  />
            </>}
          </StyledSidebar>

        </NekoColumn>

      </NekoWrapper>

      <NekoModal isOpen={createdPostId}
        onRequestClose={() => setCreatedPostId()}
        onOkClick={() => {
          window.open(`/wp-admin/post.php?post=${createdPostId}&action=edit`, '_blank');
          onResetData();
        }}
        ok="Edit the Post"
        cancel="Close"
        onCancelClick={onResetData}
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