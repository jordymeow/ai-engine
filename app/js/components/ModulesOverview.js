// Previous: none
// Current: 3.5.2

```javascript
import Styled from 'styled-components';
import { NekoBlock, NekoTypo } from '@neko-ui';
import {
  Bot, FileText, Search, Globe, Sparkles, PencilLine, Image as ImageIcon,
  Video, Lightbulb, Wand2, FlaskConical, Database, ImagePlay, BookOpen,
  Mic, BarChart3, ShieldAlert, Cpu, Network, Server, Code2
} from 'lucide-react';

const Grid = Styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  grid-auto-rows: 104px;
  gap: 10px;
  margin-top: 4px;
`;

const Card = Styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  padding: 14px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.18s ease;
  position: relative;
  min-height: 102px;

  &:hover {
    border-color: rgba(72, 199, 190, 0.5);
    box-shadow: 0 2px 8px rgba(72, 199, 190, 0.08);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  .icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 7px;
    background: ${props => props.$accentText || 'rgba(13, 125, 242, 0.10)'};
    color: ${props => props.$accent || '#0d7df2'};
  }

  .label {
    font-size: 13px;
    font-weight: 600;
    color: #1e1e1e;
    line-height: 1.3;
  }

  .pro {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 9px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 3px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: #fff;
    letter-spacing: 0.3px;
  }
`;

const EmptyState = Styled.div`
  padding: 26px 18px;
  text-align: center;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  color: #777;
  font-size: 13px;
  line-height: 1.5;

  .emoji {
    font-size: 24px;
    display: block;
    margin-bottom: 8px;
  }
`;

const PALETTE = {
  blue:   { bg: 'rgba(13, 125, 242, 0.10)',   fg: '#0d7df2' },
  teal:   { bg: 'rgba(72, 199, 190, 0.12)',   fg: '#2ea99f' },
  orange: { bg: 'rgba(240, 160, 48, 0.14)',   fg: '#c87a14' },
  purple: { bg: 'rgba(139, 92, 246, 0.12)',   fg: '#7c3aed' },
  pink:   { bg: 'rgba(236, 72, 153, 0.10)',   fg: '#db2777' },
  green:  { bg: 'rgba(34, 197, 94, 0.10)',    fg: '#16a34a' },
  red:    { bg: 'rgba(239, 68, 68, 0.10)',    fg: '#dc2626' },
  slate:  { bg: 'rgba(100, 116, 139, 0.12)',  fg: '#475569' },
};

const CATALOG = [
  { key: 'module_chatbots',           icon: Bot,           label: 'Chatbots',           tab: 'chatbots',     color: 'blue'   },
  { key: 'module_generator_content',  icon: PencilLine,    label: 'Content Generator',  tab: null,           color: 'teal'   },
  { key: 'module_assistant',          icon: Sparkles,      label: 'AI Editor Assistant', tab: null,          color: 'purple' },
  { key: 'module_generator_images',   icon: ImageIcon,     label: 'Image Generator',    tab: null,           color: 'orange' },
  { key: 'module_generator_videos',   icon: Video,         label: 'Video Generator',    tab: null,           color: 'pink'   },
  { key: 'module_embeddings',         icon: Database,      label: 'Knowledge',          tab: 'knowledge',    color: 'teal',   pro: true },
  { key: 'module_library_search',     icon: ImagePlay,     label: 'Library Search',     tab: null,           color: 'purple' },
  { key: 'module_search',             icon: Search,        label: 'AI Search',          tab: 'search',       color: 'green'  },
  { key: 'module_forms',              icon: FileText,      label: 'AI Forms',           tab: 'forms',        color: 'pink',   pro: true },
  { key: 'module_cross_site',         icon: Globe,         label: 'Cross-Site',         tab: null,           color: 'blue',   pro: true },
  { key: 'module_assistants',         icon: BookOpen,      label: 'OpenAI Assistants',  tab: null,           color: 'slate',  pro: true },
  { key: 'module_transcription',      icon: Mic,           label: 'Transcription',      tab: 'transcription',color: 'orange' },
  { key: 'module_statistics',         icon: BarChart3,     label: 'Insights',           tab: 'insights',     color: 'green',  pro: true },
  { key: 'module_moderation',         icon: ShieldAlert,   label: 'Moderation',         tab: null,           color: 'red'    },
  { key: 'module_finetunes',          icon: Cpu,           label: 'Finetunes',          tab: 'finetunes',    color: 'slate'  },
  { key: 'module_orchestration',      icon: Network,       label: 'Orchestration',      tab: null,           color: 'purple', pro: true },
  { key: 'module_mcp',                icon: Server,        label: 'MCP Server',         tab: null,           color: 'slate'  },
  { key: 'public_api',                icon: Code2,         label: 'Public API',         tab: null,           color: 'blue'   },
  { key: 'module_advisor',            icon: Lightbulb,     label: 'Advisor',            tab: null,           color: 'orange' },
  { key: 'module_suggestions',        icon: Wand2,         label: 'AI Copilot',         tab: null,           color: 'teal'   },
  { key: 'module_playground',         icon: FlaskConical,  label: 'Playground',         tab: null,           color: 'slate'  },
];

const switchToTab = (tabKey) => {
  const url = new URL(window.location.href);
  url.searchParams.set('nekoTab', tabKey);
  window.location.href = url.toString();
};

const ModulesOverview = ({ options, isRegistered }) => {
  const enabled = CATALOG.filter(m => !options?.[m.key]);

  return (
    <NekoBlock className="primary" title="Active Modules">
      <NekoTypo p style={{ marginTop: 0, marginBottom: 12, color: '#555', fontSize: 13 }}>
        {enabled.length === 0
          ? 'You haven\'t enabled any modules yet.'
          : `${enabled.length} module${enabled.length === 1 ? '' : 's'} active. Click any card to jump straight to it, or open the Modules tab to enable more.`
        }
      </NekoTypo>

      {enabled.length === 0 && <EmptyState>
        <span className="emoji" aria-hidden>🧩</span>
        Open the <b>Modules</b> tab to enable the features you want: chatbots, content tools, knowledge bases, MCP, and more.
      </EmptyState>}

      {enabled.length > 0 && <Grid>
        {enabled.map(m => {
          const Icon = m.icon;
          const accent = PALETTE[m.color] || PALETTE.blue;
          return (
            <Card
              key={m.key}
              $accent={accent.bg}
              $accentText={accent.fg}
              onClick={() => m.tab ? switchToTab(m.tab) : switchToTab('modules')}
              title={m.tab ? `Open ${m.label}` : 'Open Modules tab'}
            >
              <span className="icon-wrap"><Icon size={18} strokeWidth={2} /></span>
              <span className="label">{m.label}</span>
              {m.pro || isRegistered && <span className="pro">PRO</span>}
            </Card>
          );
        })}
      </Grid>}
    </NekoBlock>
  );
};

export default ModulesOverview;
```