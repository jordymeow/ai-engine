// Previous: 3.7.9
// Current: 3.8.7

// DashboardWelcome.js
//
// A greeting, a short status, and the switch between dashboard and tour mode.

import Styled from 'styled-components';
import { NekoButton } from '@neko-ui';
import { Compass, ArrowLeft } from 'lucide-react';
const { __ } = wp.i18n;

// Same insets as the other tabs: the title sits 4px in from the cards, like a block title.
// A 10px side margin here (and on the card grids) made the dashboard narrower than Modules.
const Wrap = Styled.div`
  margin: 2px 4px 18px;
  color: var(--neko-white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  .hello {
    margin: 0;
    font-size: var(--neko-h2-font-size);
    font-weight: 600;
    line-height: 1.2;
  }
  /* Small and right under the greeting: the two lines belong together. */
  .sub {
    margin: 1px 0 0;
    font-size: var(--neko-font-size);
    line-height: 1.4;
    opacity: 0.85;
  }
  .tour-toggle {
    flex-shrink: 0;
  }
  @media (max-width: 600px) {
    align-items: flex-start;
    flex-wrap: wrap;
    .tour-toggle { margin-left: auto; }
  }
`;

const greeting = () => {
  const h = new Date().getHours();
  if (h < 5) return __('Good evening', 'ai-engine');
  if (h < 12) return __('Good morning', 'ai-engine');
  if (h < 18) return __('Good afternoon', 'ai-engine');
  return __('Good evening', 'ai-engine');
};

const DashboardWelcome = ({ options, envIssues, tourActive, onToggleTour }) => {
  const envCount = (options?.ai_envs || []).length;

  let status = __('Your default AI settings are configured.', 'ai-engine');
  if (envCount === 0) status = __('Welcome. Let’s connect your first AI provider.', 'ai-engine');
  else if (envIssues) status = __('Your AI settings need a look.', 'ai-engine');
  else if (tourActive) status = __('Let’s see what your site can do.', 'ai-engine');

  return (
    <Wrap>
      <div>
        <p className="hello">{greeting()}.</p>
        <p className="sub">{status}</p>
      </div>
      <NekoButton variant="header" className="tour-toggle" aria-pressed={!!tourActive} onClick={onToggleTour}>
        {tourActive ? <ArrowLeft size={16} style={{ marginRight: 8 }} aria-hidden="true" />
          : <Compass size={16} style={{ marginRight: 8 }} aria-hidden="true" />}
        {tourActive ? __('Back to dashboard', 'ai-engine') : __('Explore AI Engine', 'ai-engine')}
      </NekoButton>
    </Wrap>
  );
};

export default DashboardWelcome;
