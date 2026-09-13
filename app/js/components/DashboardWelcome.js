// Previous: none
// Current: 3.7.8

// DashboardWelcome.js
//
// The first line of the Dashboard: a greeting and one sentence of status. No
// buttons, no checklist. The Setup Assistant stays one quiet click away while
// the site is not fully set up.

import Styled from 'styled-components';

const Wrap = Styled.div`
  margin: 4px 10px 18px;
  color: #fff;

  .hello {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.3;
  }
  .hello span {
    font-weight: 400;
    opacity: 0.85;
  }
  .sub {
    margin: 5px 0 0;
    font-size: 13px;
    opacity: 0.8;
  }
  .sub a {
    color: #fff;
    text-decoration: underline;
    text-underline-offset: 2px;
    cursor: pointer;
  }
`;

const greeting = () => {
  const h = new Date().getHours();
  if (h < 5) return 'Good evening';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const DashboardWelcome = ({ options, envIssues, onShowAssistant }) => {
  const envCount = (options?.ai_envs || []).length;
  const modulesOn = Object.keys(options || {}).filter(k => k.startsWith('module_') && options[k] === true).length;
  const pending = envCount === 0 || envIssues || !options?.module_chatbots;

  let status = 'Everything is running.';
  if (envCount === 0) status = 'Welcome. Let\'s connect your first AI provider.';
  else if (envIssues) status = 'One provider needs a look.';

  return (
    <Wrap>
      <p className="hello">{greeting()}. <span>{status}</span></p>
      <p className="sub">
        {envCount} {envCount === 1 ? 'provider' : 'providers'}, {modulesOn} modules on.
        {pending && <> <a onClick={onShowAssistant}>Setup steps</a></>}
      </p>
    </Wrap>
  );
};

export default DashboardWelcome;
