// Previous: none
// Current: 3.8.7

const { useState, useEffect, useCallback } = wp.element;
import { readSetupAssistantState, saveSetupAssistantState, toggleSetupStep, undoSetupCompletion,
  SETUP_STATE_EVENT, SETUP_STORAGE_KEY } from '@app/helpers/setupAssistantState';

// Keep the dashboard tour and its companion in sync, including hidden tab panels.
const useSetupAssistant = () => {
  const [state, setState] = useState(readSetupAssistantState);
  useEffect(() => {
    const onChange = event => setState(event.detail);
    const onStorage = event => {
      if (event.key === SETUP_STORAGE_KEY || event.key === null) { setState(readSetupAssistantState()); }
    };
    window.addEventListener(SETUP_STATE_EVENT, onChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(SETUP_STATE_EVENT, onChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  const selectStep = useCallback(step => saveSetupAssistantState({ ...readSetupAssistantState(),
    activeStep: step, lastCompletedStep: null }), []);
  const toggleComplete = useCallback(() => saveSetupAssistantState(toggleSetupStep(readSetupAssistantState())), []);
  const undoComplete = useCallback(() => saveSetupAssistantState(undoSetupCompletion(readSetupAssistantState())), []);
  return { state, selectStep, toggleComplete, undoComplete, isOpen: state.started && !state.dismissed };
};

export default useSetupAssistant;
