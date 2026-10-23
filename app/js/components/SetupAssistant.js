// Previous: 3.7.9
// Current: 3.8.7

```javascript
const { useMemo } = wp.element;
import Styled from 'styled-components';
import { NekoButton, NekoProgress, ProOnly } from '@neko-ui';
import { Compass, Check } from 'lucide-react';
import { outboundUrl } from '@app/helpers/outbound';
import useSetupAssistant from '@app/helpers/useSetupAssistant';
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
  const activeStep = state.activeStep || 1;
  const completed = state.completedSteps;
  const isComplete = completed.includes(activeStep);

  const envIssues = useMemo(() => hasAiEnvIssues(options, defaultModels, fastModels, { includeFast: true }),
    [options, defaultModels, fastModels, hasAiEnvIssues]);
  const stops = getSetupStops({ options, isRegistered, envIssues });
  const stop = stops[activeStep];

  return <Panel aria-labelledby="mwai-tour-heading">
    <div className="tour-heading"><Compass size={20} aria-hidden="true" /><h3 id="mwai-tour-heading">{__('Explore AI Engine', 'ai-engine')}</h3></div>
    <p className="tour-intro">{__('Ten small things to try. Follow your curiosity, skip around, and come back anytime.', 'ai-engine')}</p>
    <div className="tour-progress">
      <span>{sprintf(__('%1$d of %2$d completed', 'ai-engine'), completed.length, stops.length)}</span>
      <NekoProgress value={completed.length} max={stops.length} role="progressbar" aria-label={__('Tour steps completed', 'ai-engine')}
        aria-valuemin={0} aria-valuemax={stops.length} aria-valuenow={completed.length} />
    </div>
    <SetupCompletionFeedback state={state} onUndo={undoComplete} />
    <div className="tour-layout">
      <ol className="tour-stops" aria-label={__('Tour stops', 'ai-engine')}>
        {STOP_TITLES.map((title, i) => <li key={title}>
          <button type="button" aria-current={activeStep === i ? 'step' : undefined}
            aria-label={`${i + 1}. ${title}${completed.includes(i + 1) ? __(', completed', 'ai-engine') : ''}`} onClick={() => goToStep(i + 1)}>
            <span className={`tour-marker${completed.includes(i + 1) ? ' completed' : ''}`} aria-hidden="true">
              {completed.includes(i + 1) ? <Check size={11} /> : i + 1}
            </span><span className="tour-name" data-label={title}>{title}</span>
          </button>
        </li>)}
      </ol>
      <div className="tour-detail">
        <label className="tour-picker">{__('Explore', 'ai-engine')}
          <select aria-label={__('Tour stop', 'ai-engine')} value={activeStep} onChange={e => goToStep(Number(e.target.value))}>
            {STOP_TITLES.map((title, i) => <option key={title} value={i + 1}>
              {i + 1}. {title}{completed.includes(i + 1) ? ' ✓' : ''}
            </option>)}
          </select>
        </label>
        <div className="tour-kicker">{sprintf(__('Goal %1$d · %2$s', 'ai-engine'), activeStep, stop.area)}{stop.pro &&
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
          {completed.length >= stops.length && <NekoButton variant="primary" onClick={onExit}>{__('Back to dashboard', 'ai-engine')}</NekoButton>}
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