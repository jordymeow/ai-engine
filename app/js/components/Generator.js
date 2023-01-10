// Previous: none
// Current: 0.1.9

const { useState, useEffect, useMemo } = wp.element;
import Styled from "styled-components";

import { postFetch } from '@neko-ui';
import { NekoButton, NekoPage, NekoSelect, NekoOption, NekoInput, NekoModal,
  NekoTextArea, NekoWrapper, NekoColumn, NekoTypo } from '@neko-ui';

import { apiUrl, restNonce, options } from '@app/settings';
import { OpenAI_models, Languages, WritingStyles, WritingTones } from "../constants";
import { cleanNumbering, extractTextData, OptionsCheck, useModels } from "../helpers";

const StyledSidebar = Styled.div`
  background: white;
  padding: 15px;
  border-radius: 5px;

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
    color: #737373;
    margin-top: 5px;
    font-size: 12px;
  }
`;

const StyledTitleWithButton = Styled.div`
  display: flex;
  justify-content: unset;
  align-items: center;
  justify-content: space-between;

  h2 {
    margin: 0;
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

const Generator = () => {
  const [error, setError] = useState();
  const [title, setTitle] = useState(DefaultTitle);
  const [headingsCount, setHeadingsCount] = useState(5);
  const [headings, setHeadings] = useState(DefaultHeadings);
  const [paragraphsCount, setParagraphsCount] = useState(2);
  const [content, setContent] = useState('');
  const { models, model, setModel } = useModels(options);
  const [excerpt, setExcerpt] = useState('');
  const [language, setLanguage] = useState('en');
  const [writingStyle, setWritingStyle] = useState('informative');
  const [writingTone, setWritingTone] = useState('neutral');
  const [promptForHeadings, setPromptForHeadings] = useState();
  const [promptForContent, setPromptForContent] = useState();
  const [promptForExcerpt, setPromptForExcerpt] = useState();
  const [temperature, setTemperature] = useState(1);
  const [busy, setBusy] = useState(false);
  const [showModelParams, setShowModelParams] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [createdPostId, setCreatedPostId] = useState();

  const titleMessage = useMemo(() => getSeoMessage(title), [title]);

  useEffect(() => {
    if (title) {
      const humanLanguage = Languages.find(l => l.value === language).label;
      setPromptForHeadings(`Generate ${headingsCount} short blog headings about "${title}", in ${humanLanguage}. Style: ${writingStyle}. Tone: ${writingTone}.`);
    }
  }, [title, headingsCount, writingStyle, writingTone, language]);

  useEffect(() => {
    if (title && headings) {
      const humanLanguage = Languages.find(l => l.value === language).label;
      const cleanHeadings = headings.split('\n').filter(x => x);
      const newHeadingsCount = cleanHeadings.length;
      setPromptForContent(`Write an article about "${title}" in ${humanLanguage}. With an introduction, and conclusion. The article has ${paragraphsCount * newHeadingsCount + 2} paragraphs, organized by the following headings:\n\n${headings}\n\nStyle: ${writingStyle}. Tone: ${writingTone}. Use Markdown formatting.`);
    }
  }, [title, headings, writingTone, writingStyle, language, paragraphsCount]);

  useEffect(() => {
    if (title) {
      setPromptForExcerpt(`Write a short, SEO-friendly excerpt for en article about "${title}"`);
    }
  }, [title]);

  const onSubmitPrompt = async (promptToUse = promptForHeadings) => {
    const res = await postFetch(`${apiUrl}/make_completions`, { json: { 
      prompt: promptToUse, temperature, model
    }, nonce: restNonce });
    console.log("Completions", { prompt: promptToUse, result: res });
    if (res.success) {
      return res.data;
    }
    setError(res.message);
    return null;
  };

  const onSubmitPromptForHeadings = async () => {
    setBusy(true);
    setHeadings("");
    const text = await onSubmitPrompt(promptForHeadings);
    if (text) {
      setHeadings(cleanNumbering(text));
    }
    setBusy(false);
  };

  const onSubmitPromptForContent = async () => {
    setBusy(true);
    setContent("");
    let text = await onSubmitPrompt(promptForContent);
    if (text) {
      setContent(text);
    }
    setBusy(false);
  };

  const onSubmitPromptForExcerpt = async () => {
    setBusy(true);
    setExcerpt("");
    const text = await onSubmitPrompt(promptForExcerpt);
    if (text) {
      setExcerpt(text);
    }
    setBusy(false);
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

  console.log(error);

  return (
    <NekoPage nekoErrors={[]}>

      <NekoWrapper>

        <NekoColumn full>
          <h1 style={{ marginTop: 0 }} class="wp-heading-inline">🪄 Post Generator (Beta)</h1>

          <NekoTypo p style={{ fontSize: 15, marginBottom: 0 }}>
            <b>Using the Post Generator is simple; write a Title, click on Generate Headings, then Generate Content, then (optionally) on Generate Excerpt, and Create Post.</b> That's it!
          </NekoTypo>

          <NekoTypo p style={{ fontSize: 15, marginBottom: 0 }}>As you go, you can also modify the prompts (they represent exactly what will be sent to the AI). If you find a prompt that gives you really good result, or have any other remark, idea, or request, please come and chat with me on the <a target="_blank" href="https://wordpress.org/support/plugin/ai-engine/">Support Forum</a>. Let's make this better together 💕
          </NekoTypo>

        </NekoColumn>

        <OptionsCheck options={options} />

        <NekoColumn style={{ flex: 3 }}>

          <StyledSidebar style={{ marginBottom: 25, paddingBottom: 20 }}>
            <h2 style={{ marginTop: 0 }}>Title</h2>
            <NekoInput value={title} onChange={setTitle} />
            {titleMessage && <div className="information">Advice: {titleMessage}</div>}
          </StyledSidebar>

          <StyledSidebar style={{ paddingTop: 5, marginBottom: 25,  }}>
            
            <StyledTitleWithButton style={{ paddingTop: 5, paddingBottom: 10 }}>
              <h2>Headings</h2>
              <div style={{ display: 'flex' }}>
                <NekoSelect scrolldown id="headingsCount" disabled={!title || busy} style={{ marginRight: 10 }}
                  value={headingsCount} description="" onChange={setHeadingsCount}>
                    <NekoOption key={3} id={3} value={3} label={3} />
                    <NekoOption key={5} id={5} value={5} label={5} />
                    <NekoOption key={8} id={8} value={8} label={8} />
                    <NekoOption key={12} id={12} value={12} label={12} />
                </NekoSelect>
                <NekoButton disabled={!title} isBusy={busy} onClick={onSubmitPromptForHeadings}>
                  Generate Headings
                </NekoButton>
              </div>
            </StyledTitleWithButton>

            <NekoTextArea value={headings} onBlur={setHeadings} />
            <div className="information">
              You can modify the content before using "Generate Content". Add, rewrite, remove, or reorganize the headings as you wish before going further.
            </div>

            <StyledTitleWithButton style={{ paddingTop: 5, paddingBottom: 10 }}>
              <h2>Content</h2>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ margin: '0 5px 0 0' }}># of Paragraphs per Heading: </label>
                <NekoSelect scrolldown id="paragraphsCount" disabled={!title || busy} style={{ marginRight: 10 }}
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

            <NekoTextArea value={content} onBlur={setContent} />
            <div className="information">
              You can modify the content before using "Create Post". Markdown is supported, and will be converted to HTML when the post is created.
            </div>

            <StyledTitleWithButton style={{ paddingTop: 5, paddingBottom: 10 }}>
              <h2>Excerpt</h2>
              <NekoButton disabled={!title} isBusy={busy} onClick={onSubmitPromptForExcerpt}>
                Generate Excerpt
              </NekoButton>
            </StyledTitleWithButton>

            <NekoTextArea value={excerpt} onBlur={setExcerpt} />

            <NekoButton style={{ marginTop: 30, width: '100%' }} 
              onClick={onSubmitNewPost} isBusy={busy}
              disabled={!content}>
              Create Post
            </NekoButton>

          </StyledSidebar>

        </NekoColumn>

        <NekoColumn>
          <StyledSidebar style={{ marginBottom: 25 }}>
            <h2 style={{ marginTop: 0 }}>Content Params</h2>
            <label>Language:</label>
            <NekoSelect scrolldown id="language" name="language" disabled={busy} 
              value={language} description="" onChange={setLanguage}>
                {Languages.map((lang) => {
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

          <StyledSidebar style={{ marginBottom: 25 }}>
            <StyledTitleWithButton>
              <h2>Model Params</h2>
              <NekoButton onClick={() => setShowModelParams(!showModelParams)}>
                {showModelParams ? 'Hide' : 'Show'}
              </NekoButton>
            </StyledTitleWithButton>
            {showModelParams && <>
              <label>Temperature:</label>
              <NekoInput id="temperature" name="temperature" value={temperature} type="number"
                onChange={setTemperature} onBlur={setTemperature} description={<>
                  <span style={{ color: temperature >= 0 && temperature <= 1 ? 'inherit' : 'red' }}>
                    Between 0 and 1.
                  </span> Higher values means the model will be at more risks.
                </>} />
              <label>Model:</label>
              <NekoSelect id="models" value={model} scrolldown={true} onChange={setModel}>
                {models.map((x) => (
                  <NekoOption value={x.id} label={x.name} key={x.id}></NekoOption>
                ))}
              </NekoSelect>
              <p style={{ marginBottom: 0 }}>
                More parameters will be added here later! 😇
              </p>
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
              <p>The prompts are automatically generated for you, but you can fine-tune them once everything is set.</p>
              <label>Prompt for <b>Generate Headings</b></label>
              <NekoTextArea disabled={busy} value={promptForHeadings} onChange={setPromptForHeadings}  />
              <label>Prompt for <b>Generate Content</b></label>
              <NekoTextArea disabled={busy} value={promptForContent} onChange={setPromptForContent}  />
              <label>Prompt for <b>Generate Excerpt</b></label>
              <NekoTextArea disabled={!content || busy} value={promptForExcerpt} onChange={setPromptForExcerpt}  />
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

export default Generator;