// Previous: none
// Current: 3.8.7

const { __ } = wp.i18n;
import { knowledgeSetup, settingsUrl } from '@app/helpers/adminNavigation';
import { outboundUrl } from '@app/helpers/outbound';

const KnowledgeGuidance = ({ options, chatbot, isRegistered }) => {
  const stage = knowledgeSetup(options, [chatbot], isRegistered);
  const actions = {
    upgrade: [__('Explore Knowledge in Pro', 'ai-engine'), outboundUrl('https://meowapps.com/products/ai-engine-pro/', 'chatbots', 'knowledge-setup')],
    enable: [__('Enable the Knowledge module', 'ai-engine'), settingsUrl('knowledge')],
    create: [__('Create a knowledge base', 'ai-engine'), settingsUrl('knowledge')],
    review: [__('Manage your sources', 'ai-engine'), settingsUrl('knowledge')],
  };
  const action = actions[stage];
  return <div style={{ margin: '10px 0', padding: 12, background: 'var(--neko-main-color-95)', borderRadius: 'var(--neko-radius-sm)',
    color: 'var(--neko-font-color)', fontSize: 'var(--neko-small-font-size)', lineHeight: 1.6 }}>
    <strong>{__('Help visitors with answers from your site', 'ai-engine')}</strong>
    <p style={{ margin: '5px 0 8px' }}>
      {stage === 'connect'
        ? __('Select a knowledge base above to make its sources available to this chatbot.', 'ai-engine')
        : __('Knowledge retrieves relevant passages from your posts, pages and documents when someone asks a question. It adds context without retraining the model.', 'ai-engine')}
    </p>
    {action && <a href={action[1]} target={stage === 'upgrade' ? '_blank' : undefined}
      rel={stage === 'upgrade' ? 'noopener noreferrer' : undefined}>{action[0]} →</a>}
    <details style={{ marginTop: 8 }}>
      <summary style={{ cursor: 'pointer' }}>{__('What to test before going live', 'ai-engine')}</summary>
      <ul style={{ paddingLeft: 18, margin: '6px 0 0', listStyle: 'disc' }}>
        <li>{__('Ask a question answered in your sources and check the facts.', 'ai-engine')}</li>
        <li>{__('Ask a follow-up to check that the conversation stays useful.', 'ai-engine')}</li>
        <li>{__('Ask something your sources do not cover. Tell the bot in its Instructions how to admit uncertainty and where to direct the visitor.', 'ai-engine')}</li>
      </ul>
      <p style={{ marginBottom: 0 }}>{__('Answers can still be wrong. Keep your sources current and repeat these checks after changing the model or instructions.', 'ai-engine')}</p>
    </details>
  </div>;
};

export default KnowledgeGuidance;
