// Previous: none
// Current: 3.8.7

```javascript
const { useState, useRef } = wp.element;
const { __, sprintf } = wp.i18n;
import Styled from 'styled-components';
import { NekoButton } from '@neko-ui';
import { ArrowRight, Check, Compass, ChevronDown, X } from 'lucide-react';
import { options as defaultOptions, isRegistered as registered } from '@app/settings';
import { settingsUrl } from '@app/helpers/adminNavigation';
import { STOP_TITLES, STOP_POINTERS, getSetupStops } from '@app/helpers/setupAssistantContent';
import { SETUP_STEP_COUNT, readSetupAssistantState, saveSetupAssistantState,
  openSetupAssistant, closeSetupAssistant } from '@app/helpers/setupAssistantState';
import useSetupAssistant from '@app/helpers/useSetupAssistant';

const Companion = Styled.section`
  padding: 10px 30px; background: var(--neko-white); color: var(--neko-font-color);
  border-bottom: 1px solid var(--neko-gray-90); box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
  font-size: var(--neko-font-size); line-height: 1.45;
  .mwai-tour-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .mwai-tour-badge { width: 30px; height: 30px; border-radius: 50%; flex: none; display: grid; place-items: center;
    background: var(--neko-main-color); color: var(--neko-white); box-shadow: 0 2px 6px rgba(13, 125, 242, 0.3); }
  .mwai-tour-head { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .mwai-tour-kicker { display: flex; align-items: center; gap: 8px; font-size: 10.5px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase; color: var(--neko-main-color); }
  .mwai-tour-dots { display: inline-flex; gap: 3px; }
  .mwai-tour-dots i { width: 6px; height: 6px; border-radius: 50%; background: var(--neko-gray-90); }
  .mwai-tour-dots i.done { background: var(--neko-main-color); }
  .mwai-tour-dots i.current { background: var(--neko-white); box-shadow: inset 0 0 0 1.5px var(--neko-main-color); }
  .mwai-tour-title { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
  .mwai-tour-title strong { font-size: 14px; font-weight: 600; }
  .mwai-tour-spacer { flex: 1; }
  .mwai-tour-actions { display: flex; align-items: center; gap: 14px; }
  .mwai-tour-link { background: none; border: none; padding: 0; margin: 0; cursor: pointer; font: inherit;
    font-weight: 500; color: var(--neko-main-color); display: inline-flex; align-items: center; gap: 3px;
    text-decoration: none; box-shadow: none; }
  .mwai-tour-link:hover { text-decoration: underline; color: var(--neko-main-color); }
  .mwai-tour-quiet { color: var(--neko-gray-50); font-weight: 400; }
  .mwai-tour-quiet:hover { color: var(--neko-font-color); }
  .mwai-tour-link:focus { outline: none; box-shadow: none; }
  .mwai-tour-link:focus-visible, .mwai-tour-close:focus-visible { outline: 2px solid var(--neko-main-color);
    outline-offset: 2px; border-radius: 3px; }
  .mwai-tour-close { background: none; border: none; padding: 3px; margin: 0; cursor: pointer; color: var(--neko-gray-50);
    display: inline-flex; border-radius: 6px; box-shadow: none; }
  .mwai-tour-close:hover { color: var(--neko-font-color); background: var(--neko-gray-95); }
  .mwai-tour-close:focus { outline: none; box-shadow: none; }
  .mwai-tour-details { margin: 8px 0 2px 42px; max-width: 720px; }
  .mwai-tour-goal { margin: 0 0 4px; color: var(--neko-font-color); }
  .mwai-tour-details ol { margin: 0; padding-left: 18px; color: var(--neko-gray-40); }
  .mwai-tour-details li { margin: 0; padding-left: 2px; line-height: 1.5; }
  @media (max-width: 782px) {
    padding: 10px 16px;
    .mwai-tour-details { margin-left: 0; }
    .mwai-tour-spacer { flex-basis: 100%; height: 0; }
  }
`;

const StepHelp = Styled.details`
  margin-top: 8px; color: var(--neko-gray-40);
  font-size: var(--neko-small-font-size); line-height: 1.5;
  summary { cursor: pointer; color: var(--neko-main-color); font-weight: 500; }
  summary:focus { outline: none; }
  summary:focus-visible { outline: 2px solid var(--neko-main-color); outline-offset: 3px; }
  p { margin: 3px 0 0; line-height: 1.45; }
  summary + p { margin-top: 6px; }
`;

export const SetupStepHelp = ({ help }) => help ? <StepHelp>
  <summary>{help.title}</summary>
  {help.tips.map(tip => <p key={tip}>{tip}</p>)}
</StepHelp> : null;

const Feedback = Styled.div`
  display: flex; align-items: center; flex-wrap: wrap; gap: 8px;
  margin: 0 0 16px; color: var(--neko-font-color); font-size: var(--neko-small-font-size);
  > svg { color: var(--neko-success); flex: none; }
  .completion-text { flex: 1; min-width: 160px; line-height: 1.5; }
`;

export const SetupCompletionFeedback = ({ state, onUndo }) => {
  const stale = useRef(state.lastCompletedStep);
  const allDone = state.completedSteps.length >= SETUP_STEP_COUNT;
  const fresh = state.lastCompletedStep || state.lastCompletedStep !== stale.current;
  if (!fresh && !allDone) { return null; }
  return <Feedback>
    <Check size={16} aria-hidden="true" />
    <span className="completion-text" role="status">
      {allDone ? __('All ten goals explored! Pick a favorite and make it your own.', 'ai-engine')
        : sprintf(__('Nice! “%1$s” is done. Up next: %2$s.', 'ai-engine'), STOP_TITLES[state.lastCompletedStep - 1], STOP_TITLES[(state.activeStep || 1) - 1])}
    </span>
    {state.lastCompletedStep && <NekoButton variant="secondary" small onClick={onUndo}>{__('Undo', 'ai-engine')}</NekoButton>}
  </Feedback>;
};

export const SetupStepAction = ({ action, variant = 'primary' }) => {
  const label = <>{action.label}<ArrowRight size={14} style={{ marginLeft: 8 }} aria-hidden="true" /></>;
  if (action.external || action.newTab) {
    return <NekoButton variant={variant} onClick={() => window.open(action.href, '_self', 'noopener')}>
      {action.label}<span aria-hidden="true" style={{ marginLeft: 6 }}>↗</span>
    </NekoButton>;
  }
  return <NekoButton variant={variant} onClick={() => {
    if (action.overview) {
      saveSetupAssistantState({ ...readSetupAssistantState(), overview: true });
    }
    window.location.href = action.href;
  }}>{label}</NekoButton>;
};

const SetupAssistantCompanion = ({ options = defaultOptions, isRegistered = registered, context = {} }) => {
  const { state, isOpen, toggleComplete, undoComplete } = useSetupAssistant();
  const [ expanded, setExpanded ] = useState(false);
  if (!isOpen) { return null; }
  const activeStep = state.activeStep || 1;
  const stop = getSetupStops({ options, isRegistered })[activeStep - 1];
  const completed = state.completedSteps.includes(activeStep);
  const allDone = state.completedSteps.length === SETUP_STEP_COUNT;
  const current = new URLSearchParams(window.location.search);
  const destination = new URL(stop.action.href, window.location.href).searchParams;
  const opensElsewhere = !!(stop.action.external || stop.action.newTab);
  const sentToModules = destination.get('nekoTab') === 'modules';
  const atDestination = !opensElsewhere || !sentToModules &&
    destination.get('page') === current.get('page') &&
    (!destination.get('nekoTab') || destination.get('nekoTab') === (context.tab || current.get('nekoTab') || 'dashboard')) &&
    (!destination.get('mwaiSection') || destination.get('mwaiSection') === (context.section || current.get('mwaiSection')));
  const showTour = () => {
    openSetupAssistant();
    window.location.href = settingsUrl('dashboard');
  };

  const kicker = allDone ? __('Tour complete', 'ai-engine')
    : sprintf(__('Exploring AI Engine · Goal %1$d of %2$d', 'ai-engine'), activeStep, SETUP_STEP_COUNT);

  return <Companion aria-label={__('AI Engine tour', 'ai-engine')}>
    <SetupCompletionFeedback state={state} onUndo={undoComplete} />
    <div className="mwai-tour-row">
      <span className="mwai-tour-badge" aria-hidden="true"><Compass size={17} /></span>
      <div className="mwai-tour-head">
        <span className="mwai-tour-kicker">{kicker}
          <span className="mwai-tour-dots" aria-hidden="true">
            {Array.from({ length: SETUP_STEP_COUNT }, (_, i) => <i key={i} className={
              state.completedSteps.includes(i + 1) ? 'done' : (i + 1 <= activeStep && !allDone ? 'current' : '')} />)}
          </span>
        </span>
        <span className="mwai-tour-title">
          <strong>{allDone ? __('Make something that feels like you', 'ai-engine') : stop.title}</strong>
          {!allDone && atDestination && <button type="button" className="mwai-tour-link" aria-expanded={expanded}
            onClick={() => setExpanded(e => !e)}>
            {expanded ? __('Hide tips', 'ai-engine') : __('Show tips', 'ai-engine')}
            <ChevronDown size={14} aria-hidden="true" style={{ transform: expanded ? 'rotate(180deg)' : 'none' }} />
          </button>}
          {!allDone && !atDestination && (stop.action.external || stop.action.newTab
            ? <a className="mwai-tour-link" href={stop.action.href} target="_blank" rel="noopener noreferrer">{stop.action.label} ↗</a>
            : <a className="mwai-tour-link" href={stop.action.href} onClick={() => stop.action.overview &&
                saveSetupAssistantState({ ...readSetupAssistantState(), overview: true })}>
              {stop.action.label}<ArrowRight size={14} aria-hidden="true" /></a>)}
        </span>
      </div>
      <span className="mwai-tour-spacer" />
      <div className="mwai-tour-actions">
        <button type="button" className="mwai-tour-link mwai-tour-quiet" onClick={showTour}>{__('All goals', 'ai-engine')}</button>
        {!allDone && (atDestination && opensElsewhere) && <NekoButton variant={completed ? 'secondary' : 'primary'} small
          aria-pressed={completed} onClick={toggleComplete}>
          <Check size={13} style={{ marginRight: 6 }} aria-hidden="true" />
          {completed ? __('Mark as not done', 'ai-engine') : __('Mark as done', 'ai-engine')}
        </NekoButton>}
        {allDone && <NekoButton variant="primary" small onClick={closeSetupAssistant}>{__('Finish tour', 'ai-engine')}</NekoButton>}
        {!allDone && <button type="button" className="mwai-tour-close" onClick={closeSetupAssistant}
          title={__('Exit tour', 'ai-engine')} aria-label={__('Exit tour', 'ai-engine')}><X size={15} /></button>}
      </div>
    </div>
    {expanded && atDestination && !allDone && <div className="mwai-tour-details">
      <p className="mwai-tour-goal">{stop.goal}</p>
      <ol aria-label={__('Things to try', 'ai-engine')}>
        {STOP_POINTERS[activeStep - 1].map(pointer => <li key={pointer}>{pointer}</li>)}
      </ol>
      <SetupStepHelp key={activeStep} help={stop.help} />
    </div>}
  </Companion>;
};

export default SetupAssistantCompanion;
```