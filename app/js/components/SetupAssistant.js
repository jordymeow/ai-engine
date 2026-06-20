// Previous: 3.5.2
// Current: 3.5.5

```javascript
const { useState, useCallback, useMemo } = wp.element;
import Styled from 'styled-components';
import { NekoBlock, NekoTypo, NekoButton } from '@neko-ui';

const STORAGE_KEY = 'mwai_setup_assistant';

export const isSetupAssistantDismissed = () => {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return !!s.dismissed;
  }
  catch (e) { return true; }
};

export const resetSetupAssistant = () => {
  try { localStorage.removeItem(STORAGE_KEY); }
  catch (e) { }
};

const STEP_COLORS = {
  default: '#e0e0e0',
  green: '#48c7be',
  orange: '#f0a030',
  red: '#e05050',
};

const ProgressBar = Styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0 18px;
  font-size: 12px;
  color: #666;
`;

const ProgressTrack = Styled.div`
  flex: 1;
  height: 6px;
  background: rgba(0, 0, 0, 0.06);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = Styled.div`
  height: 100%;
  background: linear-gradient(90deg, #48c7be, #2ea99f);
  border-radius: 3px;
  transition: width 0.4s ease;
  width: ${props => props.$pct}%;
`;

const StyledStep = Styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 12px;
  margin: 0 -12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 6px;
  transition: background 0.15s ease;

  ${props => props.$isNext && `
    background: rgba(72, 199, 190, 0.04);
    box-shadow: inset 2px 0 0 #48c7be;
  `}

  &:hover {
    background: rgba(0, 0, 0, 0.015);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CelebrationBox = Styled.div`
  margin: 14px 0 4px;
  padding: 18px 22px;
  background: linear-gradient(135deg, rgba(72, 199, 190, 0.12), rgba(13, 125, 242, 0.08));
  border-radius: 10px;
  border: 1px solid rgba(72, 199, 190, 0.25);
  display: flex;
  align-items: center;
  gap: 14px;

  .emoji {
    font-size: 28px;
    line-height: 1;
  }

  .text {
    flex: 1;
    font-size: 14px;
    color: #1e1e1e;
    line-height: 1.45;

    b { display: block; font-size: 15px; margin-bottom: 2px; }
  }
`;

const StepNumber = Styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 13px;
  flex-shrink: 0;
  background: ${props => props.$color || STEP_COLORS.default};
  color: ${props => props.$color && props.$color !== STEP_COLORS.default ? '#fff' : '#666'};
  transition: all 0.2s ease;
`;

const StepContent = Styled.div`
  flex: 1;
  min-width: 0;
`;

const StepTitle = Styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 4px;
  color: #1e1e1e;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProBadge = Styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: #fff;
  font-size: 10px;
  font-weight: 600;
  padding: 1px 7px;
  border-radius: 4px;
  letter-spacing: 0.3px;
`;

const StepDescription = Styled.div`
  font-size: 13px;
  color: #555;
  line-height: 1.5;
`;

const ChoiceButtons = Styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const ChoiceButton = Styled.button`
  padding: 4px 14px;
  border-radius: 4px;
  border: 1px solid ${props => props.$active ? '#48c7be' : '#ccc'};
  background: ${props => props.$active ? '#48c7be' : '#fff'};
  color: ${props => props.$active ? '#fff' : '#333'};
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.15s ease;

  &:hover {
    border-color: #48c7be;
  }
`;

const SubChoice = Styled.div`
  margin-top: 8px;
  padding: 10px 14px;
  background: rgba(72, 199, 190, 0.06);
  border-radius: 6px;
  border-left: 3px solid #48c7be;
  font-size: 13px;
  color: #555;
  line-height: 1.55;

  b { color: #1e1e1e; }
`;

const InfoBox = Styled.div`
  margin-top: 8px;
  padding: 10px 14px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 6px;
  border-left: 3px solid #999;
  font-size: 13px;
  color: #555;
  line-height: 1.6;

  b { color: #1e1e1e; }
  a { color: #0d7df2; }
`;

const ProNote = Styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #888;
  font-style: italic;
`;

const getInitialState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  }
  catch (e) { }
  return { dismissed: false, steps: {} };
};

const switchToTab = (tabKey) => {
  const url = new URL(window.location.href);
  url.searchParams.set('nekoTab', tabKey);
  window.location.href = url.toString();
};

const SetupAssistant = ({ options, defaultModels, fastModels, hasAiEnvIssues, isRegistered, updateOption, onDismiss }) => {
  const [state, setState] = useState(getInitialState);

  const persist = useCallback((next) => {
    setState(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
    catch (e) { }
  }, []);

  const setChoice = useCallback((key, value) => {
    persist({ ...state, steps: { ...state.steps, [key]: value } });
  }, [state, persist]);

  const dismiss = useCallback(() => {
    persist({ ...state, dismissed: true });
    if (onDismiss) onDismiss();
  }, [state, persist, onDismiss]);

  const envIssues = useMemo(() => hasAiEnvIssues(options, defaultModels, fastModels, { includeFast: true }), [options, defaultModels, fastModels, hasAiEnvIssues]);
  const hasWorkingEnv = !envIssues;
  const chatbotsEnabled = !!options?.module_chatbots;
  const generatorContentEnabled = !!options?.module_generator_content;
  const editorAssistantEnabled = !!options?.module_assistant;
  const generatorImagesEnabled = !!options?.module_generator_images;
  const knowledgeEnabled = !!options?.module_embeddings;
  const mcpEnabled = !!options?.server_mcp?.enabled;

  const infoColor = (choice) => {
    if (!choice) return STEP_COLORS.default;
    return choice === 'ok' ? STEP_COLORS.green : STEP_COLORS.orange;
  };

  const actionColor = (choice, isOn) => {
    if (choice === 'info') return STEP_COLORS.orange;
    if (choice === false || choice === 'no') return STEP_COLORS.green;
    if (isOn) return STEP_COLORS.green;
    if (!choice) return STEP_COLORS.default;
    return STEP_COLORS.red;
  };

  const envColor = hasWorkingEnv ? STEP_COLORS.green : STEP_COLORS.red;

  if (!state.dismissed) {
    return null;
  }

  const stepStatuses = [
    hasWorkingEnv,
    state.steps.modules === 'ok',
    chatbotsEnabled,
    state.steps.behavior === 'ok',
    (generatorContentEnabled || editorAssistantEnabled || state.steps.content === 'no'),
    (generatorImagesEnabled || state.steps.images === 'no'),
    (knowledgeEnabled || state.steps.knowledge === 'no'),
    state.steps.mcp === 'ok',
  ];
  const greenSteps = stepStatuses.filter(Boolean).length;
  const allDone = greenSteps === 8;

  const nextStepIndex = stepStatuses.findIndex(s => !s);
  const isNext = (n) => nextStepIndex === n;

  return (
    <NekoBlock className="primary" title="Setup Assistant" action={
      <NekoButton className="secondary" onClick={dismiss}
        title="Dismiss the assistant. You can bring it back from Settings → Maintenance.">
        Dismiss
      </NekoButton>
    }>
      <NekoTypo p style={{ marginTop: 0, marginBottom: 4 }}>
        Welcome! Here's the fastest path through AI Engine. Each step is optional, so skip anything you don't need.
      </NekoTypo>

      <ProgressBar>
        <b>{greenSteps} of 8 complete</b>
        <ProgressTrack>
          <ProgressFill $pct={Math.round((greenSteps / 8) * 100)} />
        </ProgressTrack>
      </ProgressBar>

      {allDone && <CelebrationBox>
        <div className="emoji" aria-hidden>🎉</div>
        <div className="text">
          <b>You're all set!</b>
          AI Engine is ready to go. You can dismiss this assistant now; to bring it back later, go to Settings, Others, Maintenance, and click Show Setup Assistant.
        </div>
      </CelebrationBox>}

      <StyledStep $isNext={isNext(1)}>
        <StepNumber $color={envColor}>1</StepNumber>
        <StepContent>
          <StepTitle>Connect an AI Provider</StepTitle>
          <StepDescription>
            AI Engine needs at least one AI environment: an API key from OpenAI, Anthropic, Google, or any compatible provider (Ollama, OpenRouter, Azure, xAI, etc.). Without one, nothing else works.
            {hasWorkingEnv && <>
              {' '}<b style={{ color: STEP_COLORS.green }}>Done!</b> You have a working environment on the right.
            </>}
            {!hasWorkingEnv && <>
              {' '}Set one up in the <b>AI Environments</b> panel on the right.
            </>}
          </StepDescription>
          <ChoiceButtons>
            <ChoiceButton $active={state.steps.env === 'info'} onClick={() => setChoice('env', 'info')}>
              Tell me more
            </ChoiceButton>
          </ChoiceButtons>
          {state.steps.env === 'info' && <InfoBox>
            AI Engine is <b>Bring Your Own Key</b>: you pay the AI provider directly, not us. This keeps you in control of cost and data. The most common choice is <b>OpenAI</b> (best support, broadest model line-up), but <b>Anthropic Claude</b> is a great alternative and the free tier of <b>Google Gemini</b> is generous for testing. You can mix and match later, since different chatbots can use different environments.
          </InfoBox>}
        </StepContent>
      </StyledStep>

      <StyledStep $isNext={isNext(2)}>
        <StepNumber $color={infoColor(state.steps.modules)}>2</StepNumber>
        <StepContent>
          <StepTitle>Pick the Modules You Need</StepTitle>
          <StepDescription>
            AI Engine is modular: chatbots, content generators, knowledge bases, MCP, and more. Open the <b>Modules</b> tab and toggle on only what you'll use. The rest stays out of your way.
          </StepDescription>
          <ChoiceButtons>
            <ChoiceButton $active={state.steps.modules === 'ok'} onClick={() => { setChoice('modules', 'ok'); switchToTab('modules'); }}>
              {state.steps.modules === 'ok' ? 'Got it ✓' : 'Open Modules'}
            </ChoiceButton>
            <ChoiceButton $active={state.steps.modules === 'info'} onClick={() => setChoice('modules', 'info')}>
              Tell me more
            </ChoiceButton>
          </ChoiceButtons>
          {state.steps.modules === 'info' && <InfoBox>
            Modules are grouped by purpose: <b>Chatbots & Frontend</b> (what visitors see), <b>Content Creation</b> (writing assistance for authors), <b>Knowledge & Data</b> (embeddings, transcription, library search), and <b>Tools & Insights</b> (analytics, moderation, fine-tunes). Enabling a module reveals its dedicated tab and settings; disabling hides them. Some modules are <b>Pro</b>-only.
          </InfoBox>}
        </StepContent>
      </StyledStep>

      <StyledStep $isNext={isNext(3)}>
        <StepNumber $color={actionColor(state.steps.chatbot, chatbotsEnabled)}>3</StepNumber>
        <StepContent>
          <StepTitle>Build Your First Chatbot</StepTitle>
          <StepDescription>
            Chatbots are the #1 reason people install AI Engine. They live as a popup, an inline widget, or a fullscreen page, and connect directly to the environment you set up in step 1.
            {chatbotsEnabled && <>{' '}The Chatbots module is on; open the tab to create, embed, and test one.</>}
            {!chatbotsEnabled && <>{' '}Enable the <b>Chatbots</b> module first (in the Modules tab).</>}
          </StepDescription>
          <ChoiceButtons>
            {chatbotsEnabled && <ChoiceButton $active={state.steps.chatbot === 'ok'} onClick={() => { setChoice('chatbot', 'ok'); switchToTab('chatbots'); }}>
              {state.steps.chatbot === 'ok' ? 'Got it ✓' : 'Open Chatbots'}
            </ChoiceButton>}
            {!chatbotsEnabled && <ChoiceButton onClick={() => { updateOption(true, 'module_chatbots'); setChoice('chatbot', 'enabled'); }}>
              Enable Chatbots
            </ChoiceButton>}
            <ChoiceButton $active={state.steps.chatbot === 'info'} onClick={() => setChoice('chatbot', 'info')}>
              Tell me more
            </ChoiceButton>
          </ChoiceButtons>
          {state.steps.chatbot === 'info' && <InfoBox>
            Every chatbot has a <b>Name</b>, an <b>Environment</b>, a <b>Model</b>, and an <b>Instructions</b> field (its system prompt, covered in the next step). You can give it a personality, restrict its topic, hand it function-calling tools, attach a knowledge base, or let it remember conversations. Start simple: one chatbot, one model, a single line of instructions. Iterate from there.
          </InfoBox>}
        </StepContent>
      </StyledStep>

      <StyledStep $isNext={isNext(4)}>
        <StepNumber $color={infoColor(state.steps.behavior)}>4</StepNumber>
        <StepContent>
          <StepTitle>Tweak the Chatbot's Behavior</StepTitle>
          <StepDescription>
            The <b>Instructions</b> field on a chatbot is its personality and rules. A few well-chosen sentences here change everything: tone, scope, how it handles off-topic questions. Don't ship the default.
          </StepDescription>
          <ChoiceButtons>
            <ChoiceButton $active={state.steps.behavior === 'ok'} onClick={() => setChoice('behavior', 'ok')}>
              Got it
            </ChoiceButton>
            <ChoiceButton $active={state.steps.behavior === 'info'} onClick={() => setChoice('behavior', 'info')}>
              Tell me more
            </ChoiceButton>
          </ChoiceButtons>
          {state.steps.behavior === 'info' && <InfoBox>
            A good instructions prompt usually has three parts: <b>(1) Identity</b> ("You are a friendly assistant for a bakery website."), <b>(2) Scope</b> ("Answer questions about our menu, hours, and orders. For anything else, ask the user to email us."), and <b>(3) Style</b> ("Be concise, warm, and avoid jargon."). Test by sending edge cases (off-topic questions, very long questions, hostile prompts) and refine. <b>Pro tip:</b> in the Pro version, you can attach a Knowledge base so the AI quotes from your real content instead of guessing.
          </InfoBox>}
        </StepContent>
      </StyledStep>

      <StyledStep $isNext={isNext(5)}>
        <StepNumber $color={actionColor(state.steps.content, generatorContentEnabled || editorAssistantEnabled)}>5</StepNumber>
        <StepContent>
          <StepTitle>Write with AI Inside WordPress</StepTitle>
          <StepDescription>
            Two complementary tools live in the post editor: the <b>Content Generator</b> (a separate screen for bulk drafts) and the <b>AI Editor Assistant</b> (a sidebar that rewrites, translates, and edits the post you have open).
          </StepDescription>
          <ChoiceButtons>
            <ChoiceButton $active={state.steps.content === 'yes'} onClick={() => {
              updateOption(true, 'module_generator_content');
              updateOption(true, 'module_assistant');
              setChoice('content', 'yes');
            }}>
              Enable both
            </ChoiceButton>
            <ChoiceButton $active={state.steps.content === 'no'} onClick={() => {
              updateOption(false, 'module_generator_content');
              updateOption(false, 'module_assistant');
              setChoice('content', 'no');
            }}>
              Not for me
            </ChoiceButton>
            <ChoiceButton $active={state.steps.content === 'info'} onClick={() => setChoice('content', 'info')}>
              Tell me more
            </ChoiceButton>
          </ChoiceButtons>
          {state.steps.content === 'yes' && (generatorContentEnabled && editorAssistantEnabled) && <SubChoice>
            Enabled. Open any post in the editor: you'll see the AI Engine sidebar with quick actions, and a new <b>AI Engine → Content Generator</b> menu entry for bulk drafts.
          </SubChoice>}
          {state.steps.content === 'info' && <InfoBox>
            The <b>Content Generator</b> is great for first drafts, batch translations, and product descriptions. The <b>Editor Assistant</b> sits in the post sidebar and acts on the post you have open: "make this paragraph shorter", "translate to Spanish", "rewrite in a friendlier tone". They share the same model and environment, so you only configure one thing. Both are <b>free</b>.
          </InfoBox>}
        </StepContent>
      </StyledStep>

      <StyledStep $isNext={isNext(6)}>
        <StepNumber $color={actionColor(state.steps.images, generatorImagesEnabled)}>6</StepNumber>
        <StepContent>
          <StepTitle>Generate Images & Process Vision</StepTitle>
          <StepDescription>
            The <b>Image Generator</b> creates featured images, illustrations, and product visuals from a text prompt. Vision-capable models can also describe images, draft alt text, and answer questions about uploads.
          </StepDescription>
          <ChoiceButtons>
            <ChoiceButton $active={state.steps.images === 'yes'} onClick={() => {
              updateOption(true, 'module_generator_images');
              setChoice('images', 'yes');
            }}>
              Enable
            </ChoiceButton>
            <ChoiceButton $active={state.steps.images === 'no'} onClick={() => {
              updateOption(false, 'module_generator_images');
              setChoice('images', 'no');
            }}>
              Not for me
            </ChoiceButton>
            <ChoiceButton $active={state.steps.images === 'info'} onClick={() => setChoice('images', 'info')}>
              Tell me more
            </ChoiceButton>
          </ChoiceButtons>
          {state.steps.images === 'yes' && generatorImagesEnabled && <SubChoice>
            Enabled. Look for <b>AI Engine → Image Generator</b> in the menu. The default model is OpenAI's GPT Image, but you can switch in Settings.
          </SubChoice>}
          {state.steps.images === 'info' && <InfoBox>
            Image generation pricing varies a lot by model and resolution. Start with the <b>auto</b> quality on GPT Image for the best price/quality balance, and bump to <b>high</b> only when you need it. Self-hosted options (Replicate, custom backends) work too, but they take more setup.
          </InfoBox>}
        </StepContent>
      </StyledStep>

      <StyledStep $isNext={isNext(7)}>
        <StepNumber $color={actionColor(state.steps.knowledge, knowledgeEnabled)}>7</StepNumber>
        <StepContent>
          <StepTitle>
            Ground Answers in Your Content <ProBadge>Pro</ProBadge>
          </StepTitle>
          <StepDescription>
            Embeddings let a chatbot quote from your posts, pages, and PDFs instead of guessing. This is what turns it from a generic assistant into a true expert on your site.
          </StepDescription>
          <ChoiceButtons>
            <ChoiceButton $active={state.steps.knowledge === 'yes'} disabled={!isRegistered} onClick={() => {
              updateOption(true, 'module_embeddings');
              setChoice('knowledge', 'yes');
            }}>
              {isRegistered ? 'Enable' : 'Available in Pro'}
            </ChoiceButton>
            <ChoiceButton $active={state.steps.knowledge === 'no'} onClick={() => {
              updateOption(false, 'module_embeddings');
              setChoice('knowledge', 'no');
            }}>
              Not for me
            </ChoiceButton>
            <ChoiceButton $active={state.steps.knowledge === 'info'} onClick={() => setChoice('knowledge', 'info')}>
              Tell me more
            </ChoiceButton>
          </ChoiceButtons>
          {!isRegistered && <ProNote>Knowledge bases require AI Engine Pro.</ProNote>}
          {state.steps.knowledge === 'yes' && knowledgeEnabled && <SubChoice>
            Enabled. Open the <b>Knowledge</b> tab to create an index, point it at posts or upload PDFs, and then attach it to a chatbot.
          </SubChoice>}
          {state.steps.knowledge === 'info' && <InfoBox>
            "Embeddings" turn each chunk of your content into a high-dimensional vector. When someone asks a question, AI Engine finds the most relevant chunks and feeds them to the model as context. The model then answers using <i>your</i> words. You can use OpenAI's vector store, Pinecone, Qdrant, or Chroma. Start with OpenAI for the simplest setup.{' '}
            <a href="https://ai.thehiddendocs.com/knowledge/" target="_blank" rel="noreferrer">Read the Knowledge docs ↗</a>
          </InfoBox>}
        </StepContent>
      </StyledStep>

      <StyledStep $isNext={isNext(8)}>
        <StepNumber $color={infoColor(state.steps.mcp)}>8</StepNumber>
        <StepContent>
          <StepTitle>Let AI Agents Drive Your Site (MCP)</StepTitle>
          <StepDescription>
            With MCP, you can connect <b>Claude Desktop</b>, <b>ChatGPT</b>, or <b>Claude Code</b> directly to this WordPress site. They can create posts, manage media, run reports, and edit settings, all through natural conversation, securely, with OAuth.
          </StepDescription>
          <ChoiceButtons>
            <ChoiceButton $active={state.steps.mcp === 'ok'} onClick={() => setChoice('mcp', 'ok')}>
              Got it
            </ChoiceButton>
            <ChoiceButton $active={state.steps.mcp === 'info'} onClick={() => setChoice('mcp', 'info')}>
              Tell me more
            </ChoiceButton>
          </ChoiceButtons>
          {state.steps.mcp === 'info' && <InfoBox>
            MCP (Model Context Protocol) is the new standard for exposing tools to AI agents. AI Engine ships an MCP server that lives at <code>/wp-json/mwai/v1/mcp</code>. Configuration lives under <b>Settings → MCP</b>: bearer token or OAuth, plus a tool catalog (create/edit posts, WooCommerce, media, etc.). Pro adds plugin and theme management tools.{' '}
            <a href="https://meowapps.com/claude-wordpress-mcp/" target="_blank" rel="noreferrer">Read the full walkthrough ↗</a>
          </InfoBox>}
        </StepContent>
      </StyledStep>

    </NekoBlock>
  );
};

export default SetupAssistant;
```