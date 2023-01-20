// Previous: 0.2.6
// Current: 0.3.3

const { useState, useEffect, useMemo } = wp.element;
import Styled from "styled-components";

import { postFetch } from '@neko-ui';
import { NekoButton, NekoPage, NekoSelect, NekoOption, NekoInput, NekoModal, NekoContainer,
  NekoTextArea, NekoWrapper, NekoColumn, NekoTypo, NekoSpacer } from '@neko-ui';

import { apiUrl, restNonce, options } from '@app/settings';
import { WritingStyles, WritingTones } from "../constants";
import { cleanNumbering, OptionsCheck, useModels } from "../helpers";
import { AiNekoHeader, StyledTitleWithButton } from "./CommonStyles";

const languagesObject = options?.languages || [];
const languages = Object.keys(languagesObject).map((key) => {
  return { value: key, label: languagesObject[key] };
});

const StyledSidebar = Styled.div`
  background: white;
  padding: 15px;
  border-radius: 5px;

  h2 {
    margin-bottom: 8px;
  }
  
  h3:first-child {
    margin-top: 0;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  label {
    margin-top: 10px;
  }

  li {
    margin-bottom: 10px;
    border: 1px solid #e5e5e5;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  li.active {
    background: #037cba;
    color: white;
    border-color: #037cba;
  }

  .information {
    color: #a3a3a3;
    margin-top: 5px;
    font-size: 12px;
    line-height: 100%;
  }
`;

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
const DefaultTitle = isTest ? 'Gunkanjima : An Illegal Travel to the Battleship Island' : '';
const DefaultHeadings = isTest ? `An In-Depth Look at the Illegality of Traveling to Gunkanjima
How Digital Technology is Uncovering the Stories of the People Who Lived There` : '';

const ContentGenerator = () => {
  const [error, setError] = useState();
  const [title, setTitle] = useState(DefaultTitle);
  const [topic, setTopic] = useState('');
  const [headingsCount, setHeadingsCount] = useState(4);
  const [headings, setHeadings] = useState(DefaultHeadings);
  const [paragraphsCount, setParagraphsCount] = useState(2);
  const [content, setContent] = useState('');
  const { models, model, setModel } = useModels(options);
  const [excerpt, setExcerpt] = useState('');
  const [language, setLanguage] = useState('en');
  const [writingStyle, setWritingStyle] = useState('informative');
  const [writingTone, setWritingTone] = useState('neutral');
  const [promptForTopic, setPromptForTopic] = useState();
  const [promptForHeadings, setPromptForHeadings] = useState();
  const [promptForContent, setPromptForContent] = useState();
  const [promptForExcerpt, setPromptForExcerpt] = useState();
  const [temperature, setTemperature] = useState(0.6);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [busy, setBusy] = useState(false);
  const [showModelParams, setShowModelParams] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [createdPostId, setCreatedPostId] = useState();
  
  const titleMessage = useMemo(() => getSeoMessage(title), [title]);

  useEffect(() => {
    if (topic) {
      setPromptForTopic(`Write a title for an article about "${topic}". Should be between 40 and 60 characters. Do not use quotes around the title.`);
    }
  }, [topic]);

  useEffect(() => {
    if (title) {
      const langObj = languages.find(l => l.value === language);
      const humanLanguage = langObj ? langObj.label : '';
      setPromptForHeadings(`Generate ${headingsCount} consecutive headings for an article about "${title}", in ${humanLanguage}. Style: ${writingStyle}. Tone: ${writingTone}.\n\nEach heading is between 40 and 60 characters.\n\nUse Markdown for the headings (## ).`);
    }
  }, [title, headingsCount, writingStyle, writingTone, language]);

  useEffect(() => {
    if (title && headings) {
      const langObj = languages.find(l => l.value === language);
      const humanLanguage = langObj ? langObj.label : '';
      setPromptForContent(`Write an article about "${title}" in ${humanLanguage}. The article is organized by the following headings:\n\n${headings}\n\nWrite ${paragraphsCount} paragraphs per heading.\n\nUse Markdown for formatting.\n\nAdd an introduction prefixed by "===INTRO: ", and a conclusion prefixed by "===OUTRO: ".\n\nStyle: ${writingStyle}. Tone: ${writingTone}.`);
    }
  }, [title, headings, writingTone, writingStyle, language, paragraphsCount]);

  useEffect(() => {
    if (title) {
      setPromptForExcerpt(`Write a short, SEO-friendly excerpt for en article about "${title}"`);
    }
  }, [title]);

  const onSubmitPrompt = async (promptToUse = prompt) => {
    const res = await postFetch(`${apiUrl}/make_completions`, { json: { 
      prompt: promptToUse,
      temperature,
      maxTokens: 2048,
      model
    }, nonce: restNonce });
    console.log("Completions", { prompt: promptToUse, result: res });
    if (res.success) {
      return res.data;
    }
    setError(res.message);
    return null;
  };

  const onOneClickGenerate = async () => {
    setBusy(true);
    const text = await onSubmitPrompt(promptForTopic);
    setBusy(false);
    if (text) {
      setTitle(text);
      const headingsResult = await onSubmitPromptForHeadings();
      if (headingsResult) {
        const contentResult = await onSubmitPromptForContent();
        if (contentResult) {
          await onSubmitPromptForExcerpt();
        }
      }
    }
  };

  const onSubmitPromptForHeadings = async () => {
    setBusy(true);
    setHeadings("");
    const text = await onSubmitPrompt(promptForHeadings);
    if (text) {
      setHeadings(cleanNumbering(text));
    }
    setBusy(false);
    return text;
  };

  const onSubmitPromptForContent = async () => {
    setBusy(true);
    setContent("");
    let text = await onSubmitPrompt(promptForContent);
    if (text) {
      text = text.replace(/^===INTRO: /, '').replace(/^===OUTRO: /, '');
      setContent(text);
    }
    setBusy(false);
    return text;
  };

  const onSubmitPromptForExcerpt = async () => {
    setBusy(true);
    setExcerpt("");
    const text = await onSubmitPrompt(promptForExcerpt);
    if (text) {
      setExcerpt(text);
    }
    setBusy(false);
    return text;
  };

  const onSubmitNewPost = async () => {
    setBusy(true);
    const res = await postFetch(`${apiUrl}/create_post`, { json: {
      title, headings, content, excerpt, language
    }, nonce: restNonce });
    setBusy(false);
    if (res.success) {
      setCreatedPostId(res.postId);
    }
    else {
      setError(res.message);
    }
  };

  const onResetData = () => {
    setTitle('');
    setHeadings(DefaultHeadings);
    setContent('');
    setExcerpt('');
    setCreatedPostId();
  };

  return (
    <NekoPage nekoErrors={[]}>

      <AiNekoHeader title="Content Generator" />

      <NekoWrapper>

        <NekoContainer style={{ borderRadius: 0, marginBottom: 0 }}>
        
          <NekoTypo p style={{ marginBottom: 0 }}>
            <b>Using the Post Generator is simple; write a Title, click on Generate Headings, then Generate Content, then (optionally) on Generate Excerpt, and Create Post.</b> That's it!
          </NekoTypo>

          <NekoTypo p style={{ marginBottom: 0 }}>As you go, you can also modify the prompts (they represent exactly what will be sent to the AI). If you find a prompt that gives you really good result, or have any other remark, idea, or request, please come and chat with me on the <a target="_blank" href="https://wordpress.org/support/plugin/ai-engine/">Support Forum</a>. Let's make this better together 💕
          </NekoTypo>

        </NekoContainer>

        <OptionsCheck options={options} />

        <NekoColumn style={{ flex: 1 }}>

          <StyledSidebar style={{ marginBottom: 25, paddingBottom: 20 }}>
            <h2 style={{ marginTop: 0 }}>Topic</h2>
            <NekoInput disabled={true} value={topic} onChange={setTopic} />
            <NekoButton fullWidth disabled={true || busy} style={{ marginTop: 5, marginBottom: 5 }}
              onClick={onOneClickGenerate}>
              One-Click Generate
            </NekoButton>
            <div className="information">
              The Topic feature is coming soon! Add a topic followed by some keywords, and it will all be generated in one-click. Let me know if that interests you!
            </div>
          </StyledSidebar>

          <StyledSidebar style={{ marginBottom: 25 }}>
            <h2 style={{ marginTop: 0 }}>Content Params</h2>
            <label>Language:</label>
            <NekoSelect scrolldown id="language" name="language" disabled={busy} 
              value={language} description="" onChange={setLanguage}>
                {languages.map((lang) => {
                  return <NekoOption key={lang.value} id={lang.value} value={lang.value} label={lang.label} />
                })}
            </NekoSelect>
            <label>Writing style:</label>
            <NekoSelect scrolldown id="writingStyle" name="writingStyle" disabled={busy}
              value={writingStyle} description="" onChange={setWritingStyle}>
                {WritingStyles.map((style) => {
                  return <NekoOption key={style.value} id={style.value} value={style.value} label={style.label} />
                })}
            </NekoSelect>
            <label>Writing tone:</label>
            <NekoSelect scrolldown id="writingTone" name="writingTone" disabled={busy}
              value={writingTone} description="" onChange={setWritingTone}>
                {WritingTones.map((tone) => {
                  return <NekoOption key={tone.value} id={tone.value} value={tone.value} label={tone.label} />
                })}
            </NekoSelect>
          </StyledSidebar>

        </NekoColumn>

        <NekoColumn style={{ flex: 3 }}>

          <StyledSidebar style={{ marginBottom: 25, paddingBottom: 20 }}>

            <h2 style={{ marginTop: 0 }}>Title</h2>
            <NekoInput value={title} onChange={setTitle} />
            {titleMessage && <div className="information">Advice: {titleMessage}</div>}

            <NekoSpacer height={5} />
            
            <StyledTitleWithButton>
              <h2>Sections</h2>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ margin: '0 5px 0 0' }}># of Sections: </label>
                <NekoSelect scrolldown id="headingsCount" disabled={!title || busy} style={{ marginRight: 10 }}
                  value={headingsCount} description="" onChange={setHeadingsCount}>
                    <NekoOption key={3} id={3} value={3} label={3} />
                    <NekoOption key={4} id={4} value={4} label={4} />
                    <NekoOption key={5} id={5} value={5} label={5} />
                    <NekoOption key={8} id={8} value={8} label={8} />
                    <NekoOption key={12} id={12} value={12} label={12} />
                </NekoSelect>
                <NekoButton disabled={!title} isBusy={busy} onClick={onSubmitPromptForHeadings}>
                  Generate Sections
                </NekoButton>
              </div>
            </StyledTitleWithButton>

            <NekoSpacer height={5} />

            <NekoTextArea rows={4} value={headings} onBlur={(e) => setHeadings(e.target.value)} />
            <div className="information">
              Add, rewrite, remove, or reorganize those sections as you wish before clicking "Generate Content". I recommend using Markdown.
            </div>

            <NekoSpacer height={5} />

            <StyledTitleWithButton>
              <h2>Content</h2>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ margin: '0 5px 0 0' }}># of Paragraphs per Section: </label>
                <NekoSelect scrolldown id="paragraphsCount" disabled={!title || busy}
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
                <NekoButton disabled={!title} isBusy={busy} onClick={onSubmitPromptForContent}>
                  Generate Content
                </NekoButton>
              </div>
            </StyledTitleWithButton>

            <NekoSpacer height={5} />

            <NekoTextArea rows={18} value={content} onBlur={(e) => setContent(e.target.value)} />
            <div className="information">
              You can modify the content before using "Create Post". Markdown is supported, and will be converted to HTML when the post is created.
            </div>

            <StyledTitleWithButton>
              <h2>Excerpt</h2>
              <NekoButton disabled={!title} isBusy={busy} onClick={onSubmitPromptForExcerpt}>
                Generate Excerpt
              </NekoButton>
            </StyledTitleWithButton>

            <NekoTextArea value={excerpt} onBlur={(e) => setExcerpt(e.target.value)} rows={3} />

            <NekoSpacer height={10} />

            <NekoButton fullWidth onClick={onSubmitNewPost} isBusy={busy} disabled={!content}>
              Create Post
            </NekoButton>

          </StyledSidebar>

        </NekoColumn>

        <NekoColumn>

          <StyledSidebar style={{ marginBottom: 25 }}>
            <StyledTitleWithButton>
              <h2>Model Params</h2>
              <NekoButton onClick={() => setShowModelParams(!showModelParams)}>
                {showModelParams ? 'Hide' : 'Show'}
              </NekoButton>
            </StyledTitleWithButton>
            {showModelParams && <>
              <label>Model:</label>
              <NekoSelect id="models" value={model} scrolldown={true} onChange={(val) => setModel(val)}>
                {models.map((x) => (
                  <NekoOption key={x.id} value={x.id} label={x.name}></NekoOption>
                ))}
              </NekoSelect>
              <label>Temperature:</label>
              <NekoInput id="temperature" name="temperature" value={temperature} type="number"
                onChange={(val) => setTemperature(parseFloat(val))} onBlur={(e) => setTemperature(parseFloat(e.target.value))}
                description={<>
                  <span style={{ color: temperature >= 0 && temperature <= 1 ? 'inherit' : 'red' }}>
                    Between 0 and 1.
                  </span> Higher values means the model will take more risks.
                </>} />
              <label>Max Tokens:</label>
              <NekoInput id="maxTokens" name="maxTokens" value={maxTokens} type="number"
                onChange={(val) => setMaxTokens(parseInt(val))} onBlur={(e) => setMaxTokens(parseInt(e.target.value))}
                description={<>
                  <span style={{ color: maxTokens >= 1 && maxTokens <= 4096 ? 'inherit' : 'red' }}>
                    Between 1 and 4096.
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
              <p>The prompts are automatically generated for you, but you can enhance them once the values are set.</p>
              <label>Prompt for <b>One-Click Generate</b></label>
              <NekoTextArea disabled={!content || busy} value={promptForTopic} onChange={(e) => setPromptForTopic(e.target.value)} />
              <label>Prompt for <b>Generate Sections</b></label>
              <NekoTextArea disabled={busy} value={promptForHeadings} onChange={(e) => setPromptForHeadings(e.target.value)} />
              <label>Prompt for <b>Generate Content</b></label>
              <NekoTextArea disabled={busy} value={promptForContent} onChange={(e) => setPromptForContent(e.target.value)} />
              <label>Prompt for <b>Generate Excerpt</b></label>
              <NekoTextArea disabled={!content || busy} value={promptForExcerpt} onChange={(e) => setPromptForExcerpt(e.target.value)} />
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