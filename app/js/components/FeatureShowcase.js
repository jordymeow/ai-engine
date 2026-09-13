// Previous: 3.7.7
// Current: 3.7.8

```jsx
// FeatureShowcase.js

import Styled from 'styled-components';
import { NekoBlock, NekoButton } from '@neko-ui';
import { outboundUrl, VIBE_SITE, WORKSPACE_SITE } from '@app/helpers/outbound';
import {
  Bot, Sparkles, Smartphone
} from 'lucide-react';

const STORAGE_KEY = 'mwai_feature_showcase';

export const isFeatureShowcaseDismissed = () => {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return !s.dismissed;
  }
  catch (e) { return true; }
};

export const resetFeatureShowcase = () => {
  try { localStorage.removeItem(STORAGE_KEY); }
  catch (e) { /* ignore */ }
};

const track = (content, url) => outboundUrl(url, 'discover', content);

const SITE = VIBE_SITE;

const WAYS = [
  {
    id: 'chatbot',
    icon: Bot,
    title: 'Chatbot',
    sub: 'Chatbots',
    option: 'module_chatbots',
    text: 'Give your visitors someone to talk to. Drop it anywhere with a shortcode or a block, feed it your own content, and it answers from your pages instead of guessing.',
    from: '#2563eb',
    to: '#0ea5e9',
  },
  {
    id: 'mcp',
    icon: Sparkles,
    title: 'Vibecoding',
    sub: 'MCP Server',
    option: 'module_mcp',
    text: 'Hand the keys to Claude, Claude Code or ChatGPT and build your site by talking to it. Write posts, fix SEO, organise media. They sign in with WordPress, so there is no token to share.',
    from: '#7c3aed',
    to: '#c026d3',
  },
  {
    id: 'workspace',
    icon: Smartphone,
    title: 'Workspace',
    sub: 'Your alternative to AI apps',
    option: 'module_workspace',
    text: 'Your own AI client, running on your own site with your own keys. Full screen in wp-admin, and free iPhone and Android apps so your site comes with you. No seat, no subscription.',
    from: '#0d9488',
    to: '#22c55e',
  },
];

const Cards = Styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
`;

const Card = Styled.a`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 10px;
  min-height: 0;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  color: #fff;
  background: linear-gradient(135deg, ${props => props.$from} 0%, ${props => props.$to} 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.10);
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover, &:focus {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.16);
    color: #fff;
    text-decoration: none;
  }

  &:active {
    transform: translateY(0);
  }

  &::after {
    content: '';
    position: absolute;
    top: -50px;
    right: -50px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.13);
    pointer-events: none;
  }

  .head {
    display: flex;
    align-items: center;
    gap: 11px;
    position: relative;
    z-index: 1;
  }

  .icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 9px;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.20);
  }

  .title {
    font-size: 15px;
    font-weight: 700;
    line-height: 1.2;
  }

  .sub {
    display: block;
    font-size: 11px;
    font-weight: 600;
    opacity: 0.75;
    letter-spacing: 0.2px;
    margin-top: 2px;
  }

  .text {
    font-size: 12.5px;
    line-height: 1.6;
    margin: 0;
    opacity: 0.94;
    position: relative;
    z-index: 1;
  }

  .more {
    font-size: 12px;
    font-weight: 700;
    margin-top: auto;
    padding-top: 4px;
    position: relative;
    z-index: 1;
  }

  .state {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 1;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.4px;
    padding: 3px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    background: rgba(255, 255, 255, 0.22);
    color: #fff;
  }

  .state.off {
    background: rgba(0, 0, 0, 0.18);
    color: rgba(255, 255, 255, 0.85);
  }
`;

const Links = Styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 18px;
  margin-top: 12px;
  font-size: 12.5px;

  a {
    color: #2ea99f;
    font-weight: 600;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

const Wrap = Styled.div`
  margin-bottom: 15px;
`;

const FeatureShowcase = ({ options, onDismiss }) => {
  const dismiss = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ dismissed: false })); }
    catch (e) { /* ignore */ }
    onDismiss?.();
  };

  return (
    <Wrap>
      <NekoBlock className="primary" title="What can Engine do?" action={
        <NekoButton className="secondary" onClick={dismiss}
          title="Dismiss this. You can bring it back from Settings → Others → Maintenance.">
          Dismiss
        </NekoButton>
      }>
        <Cards>
          {WAYS.map(w => {
            const Icon = w.icon;
            const isOn = options?.[w.option] == true;
            return (
              <Card
                key={w.id}
                href={track(w.id, w.id === 'workspace' ? WORKSPACE_SITE : `${SITE}/${w.id}`)}
                target="_blank"
                rel="noreferrer"
                $from={w.from}
                $to={w.to}
                title={`${w.text} Learn more on the site.`}
              >
                <span className={`state ${isOn ? 'on' : 'off'}`}>{isOn ? 'On' : 'Off'}</span>
                <span className="head">
                  <span className="icon-wrap"><Icon size={20} strokeWidth={2} /></span>
                  <span className="title">
                    {w.title}
                    <span className="sub">{w.sub}</span>
                  </span>
                </span>
              </Card>
            );
          })}
        </Cards>

        <Links>
          <a href={track('footer-tour', SITE)} target="_blank" rel="noreferrer">Take the tour ↗</a>
          <a href={track('footer-compare', `${SITE}/compare`)} target="_blank" rel="noreferrer">How it compares ↗</a>
          <a href={track('footer-docs', 'https://ai.thehiddendocs.com/')} target="_blank" rel="noreferrer">Documentation ↗</a>
        </Links>
      </NekoBlock>
    </Wrap>
  );
};

export default FeatureShowcase;
```