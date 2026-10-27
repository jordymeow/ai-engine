// Previous: 3.8.7
// Current: 3.8.8

```jsx
const { useMemo, useState } = wp.element;
import Styled from 'styled-components';
import { NekoButton, NekoProgress, ProOnly } from '@neko-ui';
import { Compass, Check, ArrowLeftRight, Sparkles, Bot, Globe } from 'lucide-react';
import { outboundUrl } from '@app/helpers/outbound';
import useSetupAssistant from '@app/helpers/useSetupAssistant';
import { focusSteps, setSetupFocus } from '@app/helpers/setupAssistantState';
import { STOP_TITLES, getSetupStops } from '@app/helpers/setupAssistantContent';
import { SetupStepAction, SetupStepHelp, SetupCompletionFeedback } from '@app/components/SetupAssistantCompanion';
const { __, sprintf } = wp.i18n;

const track = (url, content) => outboundUrl(url, 'setup', content);
const Panel = Styled.section`
  min-width: 0; padding: 20px; border-radius: var(--neko-radius-md); background: var(--neko-white);
  color: var(--neko-font-color); box-shadow: var(--neko-shadow-xs);
  .tour-heading { display: flex; align-items: center; gap: 9px; }
  .tour-heading svg { color: var(--neko-main-color); flex: none; }
  h3 { margin: 0; font-size: var(--neko-h3-font-size); color: var(--neko-font-color); }
  .tour-intro { margin: 7px 0 0; font-size: var(--neko-font-size); color: var(--neko-gray-50); line-height: 1.5; }
  .tour-progress { display: flex; align-items: center; gap: 12px; margin: 15px 0 20px;
    font-size: var(--neko-small-font-size); color: var(--neko-gray-50); }
  .tour-progress > span { white-space: nowrap; }
  .tour-progress .neko-progress { flex: 1; min-width: 0; }
  .tour-layout { display: grid; grid-template-columns: 200px minmax(0, 1fr); gap: 22px; }
  .tour-stops { margin: 0; padding: 0 18px 0 0; list-style: none; border-right: 1px solid var(--neko-gray-90); }
  .tour-stops li { margin: 0 0 3px; }
  .tour-stops button { display: flex; align-items: center; gap: 8px; width: 100%; padding: 7px;
    border: 0; border-radius: var(--neko-radius-sm); background: transparent; color: var(--neko-gray-50); text-align: left;
    font: inherit; font-size: var(--neko-small-font-size); line-height: 1.4; cursor: pointer; }
  .tour-stops button:hover { background: var(--neko-gray-95); color: var(--neko-font-color); }
  .tour-stops button[aria-current="step"] { background: var(--neko-main-color-95); color: var(--neko-main-color); font-weight: 600; }
  .tour-name { display: inline-flex; flex-direction: column; }
  .tour-name::after { content: attr(data-label); font-weight: 600; height: 0; overflow: hidden;
    visibility: hidden; user-select: none; pointer-events: none; }
  .tour-marker { flex: none; display: grid; place-items: center; width: 19px; height: 19px;
    border-radius: 50%; background: var(--neko-gray-95); font-size: var(--neko-small-font-size); }
  .tour-marker.completed { background: var(--neko-accent-color-90); color: var(--neko-success); }
  .tour-detail { min-width: 0; display: flex; flex-direction: column; }
  .tour-kicker { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; margin-bottom: 10px;
    color: var(--neko-gray-50); font-size: var(--neko-small-font-size); }
  h4 { margin: 0 0 16px; font-size: var(--neko-h2-font-size); line-height: 1.35; color: var(--neko-font-color); }
  .tour-goal { padding: 13px 15px; border-radius: var(--neko-radius-sm);
    background: var(--neko-main-color-95); border: 1px solid var(--neko-main-color-80); }
  .tour-goal strong { display: block; color: var(--neko-main-color); font-size: var(--neko-small-font-size); margin-bottom: 5px; }
  .tour-goal p { margin: 0; font-size: var(--neko-h5-font-size); line-height: 1.5; color: var(--neko-main-color-10); }
  .tour-how { margin: 18px 0 8px; font-size: var(--neko-small-font-size); font-weight: 600; }
  .tour-instructions { margin: 0; padding-left: 18px; color: var(--neko-gray-40); font-size: var(--neko-font-size); line-height: 1.6; }
  .tour-instructions li { margin-bottom: 7px; padding-left: 3px; }
  .tour-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin-top: 14px; }
  .tour-actions a { display: inline-flex; align-items: center; font-weight: 600; }
  .tour-status { font-size: var(--neko-small-font-size); color: var(--neko-gray-50); }
  details { margin-top: 15px; font-size: var(--neko-small-font-size); color: var(--neko-gray-50); line-height: 1.6; }
  summary { cursor: pointer; color: var(--neko-gray-40); }
  details p { margin: 3px 0 0; line-height: 1.45; }
  details summary + p { margin-top: 6px; }
  a { color: var(--neko-main-color); }
  .tour-completion { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end;
    margin-top: auto; padding-top: 22px; }
  .tour-picker { display: none; align-items: center; gap: 8px; font-size: var(--neko-small-font-size); margin-bottom: 18px; }
  .tour-picker select { min-width: 0; flex: 1; max-width: 100%; font: inherit;
    min-height: var(--neko-control-height); background-color: var(--neko-input-background);
    border: 1px solid var(--neko-input-border); border-radius: var(--neko-radius-sm); color: var(--neko-font-color); }
  .tour-map { display: grid; grid-template-columns: 1fr auto 1fr auto 1fr; align-items: center; gap: 10px; margin-top: 18px; }
  .tour-map .side, .tour-map .center { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 3px;
    padding: 14px 10px; border-radius: var(--neko-radius-md); border: 1px solid var(--neko-gray-90); transition: opacity 0.2s ease; }
  .tour-map .center { border-color: var(--neko-main-color); background: var(--neko-main-color-95); }
  .tour-map .ico { width: 34px; height: 34px; border-radius: 10px; display: grid; place-items: center;
    background: var(--neko-main-color-95); color: var(--neko-main-color); margin-bottom: 4px; }
  .tour-map .center .ico { background: var(--neko-main-color); color: #fff; }
  .tour-map strong { font-size: var(--neko-h5-font-size); color: var(--neko-font-color); }
  .tour-map span { font-size: var(--neko-small-font-size); color: var(--neko-gray-50); }
  .tour-map .link { display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--neko-main-color); max-width: 110px;
    transition: opacity 0.2s ease; }
  .tour-map .link em { font-style: normal; font-size: 11px; text-align: center; color: var(--neko-gray-50); line-height: 1.3; }
  .tour-map .dim { opacity: 0.35; }
  .tour-choices { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
  .tour-choices button { display: flex; flex-direction: column; gap: 3px; padding: 13px 14px; text-align: left; cursor: pointer; font: inherit;
    color: inherit; background: var(--neko-white); border: 1px solid var(--neko-gray-90); border-radius: var(--neko-radius-md); }
  .tour-choices button.on { border-color: var(--neko-main-color); background: var(--neko-main-color-95); }
  .tour-choices strong { font-size: var(--neko-font-size); color: var(--neko-font-color); }
  .tour-choices span { font-size: var(--neko-small-font-size); color: var(--neko-gray-50); }
  .tour-map .ai, .tour-choices .site { --side: #8b5cf6; --side-soft: #f3efff; }
  .tour-map .agents, .tour-choices .assistants { --side: #f97316; --side-soft: #fff4ec; }
  .tour-choices .both { --side: var(--neko-main-color); --side-soft: var(--neko-main-color-95); }
  .tour-map .side { border-color: color-mix(in oklab, var(--side) 30%, #fff); background: var(--side-soft); }
  .tour-map .side .ico { background: var(--side); color: #fff; }
  .tour-map .center { background: var(--neko-main-color-95); }
  .tour-map .link { color: var(--side); }
  .tour-map .link em { color: var(--side); font-weight: 600; }
  .tour-choices button { border-left: 4px solid var(--side); }
  .tour-choices button.on { border-color: var(--side); background: var(--side-soft); }
  .tour-choices button.on strong { color: var(--side); }
  .tour-extras { display: flex; align-items: flex-start; gap: 8px; margin-top: 14px; font-size: var(--neko-small-font-size); color: var(--neko-gray-40); cursor: pointer; }
  .tour-extras input { margin-top: 2px; }
  @media (max-width: 800px) { .tour-map { grid-template-columns: 1fr; } .tour-map .link { flex-direction: row; max-width: none; } .tour-choices { grid-template-columns: 1fr; } }
  .tour-change { margin-left: auto; background: none; border: 0; padding: 0; cursor: pointer; font: inherit;
    font-size: var(--neko-small-font-size); color: var(--neko-main-color); }
  @media (max-width: 800px) { .tour-focus { grid-template-columns: 1fr; } }
  .tour-stops button:focus-visible, a:focus-visible, select:focus-visible, summary:focus-visible {
    outline: 2px solid var(--neko-main-color); outline-offset: 3px; }
  @media (max-width: 800px) {
    padding: 16px;
    .tour-layout { display: block; }
    .tour-stops { display: none; }
    .tour-picker { display: flex; }
  }
`;

const SetupAssistant = ({ options, defaultModels, fastModels, hasAiEnvIssues, isRegistered, onExit }) => {
  const { state, selectStep: goToStep, toggleComplete, undoComplete } = useSetupAssistant();
  const [ choice, setChoice ] = useState('both');
  const [ extras, setExtras ] = useState(true);
  const activeStep = state.activeStep || 1;
  const completed = state.completedSteps;
  const isComplete = completed.includes(focusSteps(state).includes(activeStep) ? activeStep : focusSteps(state)[0]);

  const envIssues = useMemo(() => hasAiEnvIssues(options, defaultModels, fastModels, { includeFast: true }),
    [options, defaultModels, fastModels, hasAiEnvIssues]);
  const stops = getSetupStops({ options, isRegistered, envIssues });
  const steps = focusSteps(state);
  const shown = steps.includes(activeStep) ? activeStep : steps[0];
  const stop = stops[shown];
  const doneHere = steps.filter(step => completed.includes(step)).length;

  if (!state.focus) {
    const CHOICES = [
      { key: 'site', title: __('Use AI on my site', 'ai-engine'), text: __('Chatbots, writing, images, and AI for your other plugins, like SEO Engine.', 'ai-engine') },
      { key: 'assistants', title: __('Let AI assistants work on my site', 'ai-engine'), text: __('Claude or ChatGPT manage your content and help build your site.', 'ai-engine') },
      { key: 'both', title: __('Both', 'ai-engine'), text: __('The full picture, recommended.', 'ai-engine') },
    ];
    return <Panel aria-labelledby="mwai-tour-heading">
      <div className="tour-heading"><Compass size={20} aria-hidden="true" /><h3 id="mwai-tour-heading">{__('Explore AI Engine', 'ai-engine')}</h3></div>
      <p className="tour-intro">{__('AI Engine connects your WordPress to AI, in two directions.', 'ai-engine')}</p>
      <div className="tour-map" aria-hidden="true">
        <div className={`side ai${choice === 'assistants' ? ' dim' : ''}`}>
          <span className="ico"><Sparkles size={18} /></span>
          <strong>{__('AI services', 'ai-engine')}</strong>
          <span>OpenAI, Anthropic, Google…</span>
        </div>
        <div className={`link ai${choice === 'assistants' ? ' dim' : ''}`}><ArrowLeftRight size={16} /><em>{__('Your site uses AI', 'ai-engine')}</em></div>
        <div className="center">
          <span className="ico"><Globe size={18} /></span>
          <strong>{__('Your WordPress', 'ai-engine')}</strong>
          <span>{__('with AI Engine', 'ai-engine')}</span>
        </div>
        <div className={`link agents${choice === 'site' ? ' dim' : ''}`}><ArrowLeftRight size={16} /><em>{__('Assistants use your site (MCP)', 'ai-engine')}</em></div>
        <div className={`side agents${choice === 'site' ? ' dim' : ''}`}>
          <span className="ico"><Bot size={18} /></span>
          <strong>{__('AI assistants', 'ai-engine')}</strong>
          <span>Claude, ChatGPT…</span>
        </div>
      </div>
      <p className="tour-how" style={{ marginTop: 20 }}>{__('What do you want to do?', 'ai-engine')}</p>
      <div className="tour-choices" role="radiogroup">
        {CHOICES.map(c => <button key={c.key} type="button" role="radio" aria-checked={choice === c.key}
          className={`${c.key}${choice === c.key ? ' on' : ''}`} onClick={() => setChoice(c.key)}>
          <strong>{c.title}</strong><span>{c.text}</span>
        </button>)}
      </div>
      <label className="tour-extras">
        <input type="checkbox" checked={extras} onChange={e => setExtras(e.target.checked)} />
        <span><strong>{__('Also explore other features', 'ai-engine')}</strong> {__('(strongly recommended): the Workspace, costs, writing and more.', 'ai-engine')}</span>
      </label>
      <div className="tour-completion">
        <NekoButton variant="primary" onClick={() => setSetupFocus(choice, !extras)}>{__('Start', 'ai-engine')}</NekoButton>
      </div>
    </Panel>;
  }

  return <Panel aria-labelledby="mwai-tour-heading">
    <div className="tour-heading"><Compass size={20} aria-hidden="true" /><h3 id="mwai-tour-heading">{__('Explore AI Engine', 'ai-engine')}</h3></div>
    <p className="tour-intro">{__('A few small things to try. Follow your curiosity, skip around, and come back anytime.', 'ai-engine')}</p>
    <div className="tour-progress">
      <span>{sprintf(__('%1$d of %2$d completed', 'ai-engine'), doneHere, steps.length)}</span>
      <NekoProgress value={doneHere} max={steps.length} role="progressbar" aria-label={__('Tour steps completed', 'ai-engine')}
        aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={doneHere} />
      <button type="button" className="tour-change" onClick={() => setSetupFocus(null)}>{__('Change', 'ai-engine')}</button>
    </div>
    <SetupCompletionFeedback state={state} onUndo={undoComplete} />
    <div className="tour-layout">
      <ol className="tour-stops" aria-label={__('Tour stops', 'ai-engine')}>
        {steps.map((step, i) => { const title = STOP_TITLES[step - 1]; return <li key={title}>
          <button type="button" aria-current={shown === step ? 'step' : undefined}
            aria-label={`${i + 1}. ${title}${completed.includes(step) ? __(', completed', 'ai-engine') : ''}`} onClick={() => goToStep(step)}>
            <span className={`tour-marker${completed.includes(step) ? ' completed' : ''}`} aria-hidden="true">
              {completed.includes(step) ? <Check size={11} /> : i + 1}
            </span><span className="tour-name" data-label={title}>{title}</span>
          </button>
        </li>; })}
      </ol>
      <div className="tour-detail">
        <label className="tour-picker">{__('Explore', 'ai-engine')}
          <select aria-label={__('Tour stop', 'ai-engine')} value={shown} onChange={e => goToStep(Number(e.target.value))}>
            {steps.map((step, i) => <option key={step} value={step}>
              {i + 1}. {STOP_TITLES[step - 1]}{completed.includes(step) ? ' ✓' : ''}
            </option>)}
          </select>
        </label>
        <div className="tour-kicker">{sprintf(__('Goal %1$d · %2$s', 'ai-engine'), steps.indexOf(shown) + 1, stop.area)}{stop.pro &&
          <ProOnly href={track('https://meowapps.com/products/ai-engine-pro/', 'tour-knowledge')} rel="noopener noreferrer" />}</div>
        <h4>{stop.title}</h4>
        <div className="tour-goal"><strong>{__('A little goal', 'ai-engine')}</strong><p>{stop.goal}</p></div>
        <p className="tour-how">{__('Give it a try', 'ai-engine')}</p>
        <ol className="tour-instructions">{stop.how.filter(Boolean).map(line => <li key={line}>{line}</li>)}</ol>
        <SetupStepHelp key={`help-${activeStep}`} help={stop.help} />
        <div className="tour-actions">
          <SetupStepAction action={stop.action} />
          {stop.status && <span className="tour-status">{stop.status}</span>}
        </div>
        <details key={activeStep}>
          <summary>{__('A little more to explore', 'ai-engine')}</summary>
          <p>{stop.more}</p>
          {stop.link && <p><a href={stop.link.href} target="_blank" rel="noopener noreferrer">{stop.link.label} ↗</a></p>}
        </details>
        <div className="tour-completion">
          {doneHere >= steps.length && <NekoButton variant="primary" onClick={onExit}>{__('Back to dashboard', 'ai-engine')}</NekoButton>}
          <NekoButton variant="secondary" aria-pressed={isComplete} onClick={toggleComplete}>
            {isComplete && <Check size={13} style={{ marginRight: 8 }} aria-hidden="true" />}
            {isComplete ? __('Mark as not done', 'ai-engine') : __('Mark as done', 'ai-engine')}
          </NekoButton>
        </div>
      </div>
    </div>
  </Panel>;
};

export default SetupAssistant;
```