// Previous: 3.8.7
// Current: 3.8.8

```javascript
import { outboundUrl, WORKSPACE_SITE } from '@app/helpers/outbound';
import { hasSiteLimit, settingsUrl } from '@app/helpers/adminNavigation';
const { __ } = wp.i18n;

const track = (url, content) => outboundUrl(url, 'setup', content);
const PRO_URL = 'https://meowapps.com/products/ai-engine-pro/';

export const STOP_TITLES = [
  __( 'Connect your AI', 'ai-engine' ),
  __( 'Talk to your AI', 'ai-engine' ),
  __( 'Meet your chatbot', 'ai-engine' ),
  __( 'Make it look like you', 'ai-engine' ),
  __( 'Put it on your site', 'ai-engine' ),
  __( 'Teach it your content', 'ai-engine' ),
  __( 'Keep costs in check', 'ai-engine' ),
  __( 'Write with AI', 'ai-engine' ),
  __( 'Let Claude work on your site', 'ai-engine' ),
  __( 'Take it on your phone', 'ai-engine' ),
];

export const STOP_POINTERS = [
  [ __( 'Add a provider with your API key.', 'ai-engine' ),
    __( 'Pick a Default model, then a Fast one for small tasks.', 'ai-engine' ) ],
  [ __( 'Open Workspace and ask anything, like you would in ChatGPT.', 'ai-engine' ),
    __( 'Turn on WordPress Tools and ask it about your latest posts.', 'ai-engine' ) ],
  [ __( 'Ask the preview a question a visitor would ask.', 'ai-engine' ),
    __( 'Tell it who it helps and how to sound in Instructions, then ask again.', 'ai-engine' ) ],
  [ __( 'Switch to Themes and pick one you like.', 'ai-engine' ),
    __( 'Change its colors and watch the preview follow.', 'ai-engine' ) ],
  [ __( 'Choose it as the Site-Wide Chatbot, or paste its shortcode in a page.', 'ai-engine' ),
    __( 'Open your site in a private window and chat with it.', 'ai-engine' ) ],
  [ __( 'Create a Knowledge environment and add your FAQ or a few key pages.', 'ai-engine' ),
    __( 'Select it in your chatbot, then ask something only your pages answer.', 'ai-engine' ) ],
  [ __( 'Check this week’s estimated cost on the dashboard.', 'ai-engine' ),
    __( 'Set a budget at your provider, and limits in Insights with Pro.', 'ai-engine' ) ],
  [ __( 'Give Content Studio a topic and a reader, then shape the outline.', 'ai-engine' ),
    __( 'In the editor, chat with the AI Assistant right next to your article.', 'ai-engine' ) ],
  [ __( 'Use the Claude link in the MCP settings: it arrives already filled in.', 'ai-engine' ),
    __( 'Choose Read-only when you approve, then ask for your latest drafts.', 'ai-engine' ) ],
  [ __( 'Install the free Workspace app on your iPhone or Android.', 'ai-engine' ),
    __( 'Scan the QR code from the Workspace settings, and your chats follow you.', 'ai-engine' ) ],
];

export const getSetupStops = ({ options, isRegistered, envIssues = false }) => {
  const chatbots = !!options?.module_chatbots;
  const content = !!options?.module_generator_content;
  const assistant = !!options?.module_assistant;
  const knowledge = !!options?.module_embeddings || isRegistered;
  const insights = !!options?.module_statistics && isRegistered;
  const mcp = !!options?.module_mcp;
  const workspace = !!options?.module_workspace;
  const modulesUrl = settingsUrl('modules');
  const featureAction = (enabled, label, href) => ({
    label: enabled ? label : __( 'Turn it on in Modules', 'ai-engine' ), href: enabled ? href : modulesUrl,
  });
  const turnOn = (enabled, line) => enabled && line;

  return [
    {
      area: __( 'The basics', 'ai-engine' ), title: STOP_TITLES[0],
      goal: __( 'Give WordPress an AI to work with.', 'ai-engine' ),
      how: [
        __( 'In AI settings, add a provider such as OpenAI, Anthropic or Google, with your own API key.', 'ai-engine' ),
        __( 'Pick a Default model for everyday work and a Fast model for small tasks. You can change them anytime.', 'ai-engine' ),
      ],
      action: { label: envIssues ? __( 'Connect your AI', 'ai-engine' ) : __( 'Open AI settings', 'ai-engine' ), href: settingsUrl('settings', 'ai') },
      status: envIssues ? __( 'A provider or a default model still needs a look.', 'ai-engine' ) : __( 'Your AI is connected.', 'ai-engine' ),
      more: __( 'You pay your provider directly for what the AI does. An API account is separate from a ChatGPT or Claude subscription.', 'ai-engine' ),
      help: { title: __( 'The connection fails?', 'ai-engine' ), tips: [
        __( 'Check that the key belongs to the provider you picked, and that its account has API credits.', 'ai-engine' ),
        __( 'If a model is missing, your API account does not have access to it yet. Pick another one.', 'ai-engine' ),
      ] },
    },
    {
      area: __( 'Workspace', 'ai-engine' ), title: STOP_TITLES[1],
      goal: __( 'Have your first conversation with your AI, right inside WordPress.', 'ai-engine' ),
      how: [
        turnOn(workspace, __( 'Turn on Workspace in Modules first.', 'ai-engine' )),
        __( 'Open Workspace and ask anything: brainstorm a post, summarize an idea, draft an email.', 'ai-engine' ),
        __( 'Turn on WordPress Tools in the chat, and it can read and work on your site too.', 'ai-engine' ),
      ],
      action: { ...featureAction(workspace, __( 'Open Workspace', 'ai-engine' ), 'admin.php?page=mwai_workspace'), newTab: workspace },
      more: __( 'Your conversations and folders stay on your WordPress, with your own keys. Pro adds Knowledge, MCP Servers and Functions to your chats.', 'ai-engine' ),
      help: { title: __( 'Get more out of it', 'ai-engine' ), tips: [
        __( 'Ask it to ask you three questions before it suggests anything.', 'ai-engine' ),
        __( 'Not the answer you wanted? Say what to change, and keep going in the same chat.', 'ai-engine' ),
      ] },
      link: { label: __( 'Meet Workspace', 'ai-engine' ), href: track(WORKSPACE_SITE, 'tour-workspace') },
    },
    {
      area: __( 'Chatbots', 'ai-engine' ), title: STOP_TITLES[2],
      goal: __( 'Have a real conversation with your chatbot, and give it your tone.', 'ai-engine' ),
      how: [
        turnOn(chatbots, __( 'Turn on Chatbots in Modules first.', 'ai-engine' )),
        __( 'Ask the preview a question a visitor would ask, then a follow-up.', 'ai-engine' ),
        __( 'In Instructions, say who it helps, what it knows about and how it should sound. For example: “Be a friendly guide to our shop. Keep answers short.” Then ask again.', 'ai-engine' ),
      ],
      action: featureAction(chatbots, __( 'Open Chatbots', 'ai-engine' ), settingsUrl('chatbots')),
      more: __( 'Also tell it what to do when it does not know, like pointing to your contact page. Preview chats use your provider like real ones.', 'ai-engine' ),
      help: { title: __( 'The answers are off?', 'ai-engine' ), tips: [
        __( 'Too long or off topic: replace vague words like “be helpful” with an example of the answer you want.', 'ai-engine' ),
        __( 'It forgets the conversation: raise Max Messages in the chatbot’s Thresholds.', 'ai-engine' ),
      ] },
    },
    {
      area: __( 'Chatbots', 'ai-engine' ), title: STOP_TITLES[3],
      goal: __( 'Give your chatbot a look that fits your site.', 'ai-engine' ),
      how: [
        turnOn(chatbots, __( 'Turn on Chatbots in Modules first.', 'ai-engine' )),
        __( 'In Chatbots, switch to Themes and pick one: ChatGPT, Messages, Timeless, Foundation or Glass.', 'ai-engine' ),
        __( 'Change its colors. The preview shows a sample conversation, so every change is visible right away.', 'ai-engine' ),
      ],
      action: featureAction(chatbots, __( 'Open Chatbots', 'ai-engine' ), settingsUrl('chatbots')),
      more: __( 'In the chatbot’s Appearance, you can also set its name, avatar, popup icon and the macOS-style frame.', 'ai-engine' ),
      help: { title: __( 'It looks different on your site?', 'ai-engine' ), tips: [
        __( 'Your WordPress theme can affect fonts and spacing. Check the chatbot on a real page.', 'ai-engine' ),
      ] },
    },
    {
      area: __( 'Chatbots', 'ai-engine' ), title: STOP_TITLES[4],
      goal: __( 'See your chatbot where your visitors will.', 'ai-engine' ),
      how: [
        turnOn(chatbots, __( 'Turn on Chatbots in Modules first.', 'ai-engine' )),
        __( 'Choose it as the Site-Wide Chatbot to show it as a popup on every page, or paste its shortcode in a page.', 'ai-engine' ),
        __( 'Open your site in a private window and chat with it like a visitor.', 'ai-engine' ),
      ],
      action: featureAction(chatbots, __( 'Open Chatbots', 'ai-engine' ), settingsUrl('chatbots')),
      more: __( 'Turn on Discussions to read what visitors ask. It is the best way to see what your chatbot should learn next.', 'ai-engine' ),
      help: { title: __( 'You don’t see it?', 'ai-engine' ), tips: [
        __( 'Clear your cache plugin, then reload the page.', 'ai-engine' ),
        __( 'A popup appears as a small icon in a corner. Click it to open the chat.', 'ai-engine' ),
      ] },
    },
    {
      area: __( 'Knowledge', 'ai-engine' ), title: STOP_TITLES[5], pro: true,
      goal: __( 'Let your chatbot answer from your own pages.', 'ai-engine' ),
      how: [
        __( 'Turn on Knowledge, create an environment and add your FAQ, a few key pages or a PDF.', 'ai-engine' ),
        __( 'Select it in your chatbot, under Knowledge & Context. Ask something only your pages answer, and compare with the source.', 'ai-engine' ),
      ],
      action: isRegistered ? featureAction(knowledge, __( 'Open Knowledge', 'ai-engine' ), settingsUrl('knowledge'))
        : { label: __( 'Discover AI Engine Pro', 'ai-engine' ), href: track(PRO_URL, 'tour-knowledge'), external: true },
      status: knowledge ? __( 'Knowledge is on.', 'ai-engine' ) : null,
      more: __( 'Knowledge finds the passages that match each question and gives them to the AI as context. Keep your pages up to date and the answers follow.', 'ai-engine' ),
      help: { title: __( 'It misses something you wrote?', 'ai-engine' ), tips: [
        __( 'Check that the page was added to Knowledge, and that the chatbot uses that environment.', 'ai-engine' ),
        __( 'Make the source clearer: a direct question and answer works best.', 'ai-engine' ),
      ] },
      link: { label: __( 'How Knowledge works', 'ai-engine' ), href: track('https://ai.thehiddendocs.com/knowledge/', 'tour-knowledge-docs') },
    },
    {
      area: __( 'Costs', 'ai-engine' ), title: STOP_TITLES[6],
      goal: __( 'Know what your AI costs, and never get a surprise bill.', 'ai-engine' ),
      how: [
        __( 'The dashboard shows this week’s queries and their estimated cost.', 'ai-engine' ),
        __( 'Set a monthly budget at your provider. With Pro, Insights adds limits for the site, guests and users.', 'ai-engine' ),
      ],
      action: insights ? { label: __( 'Open Insights', 'ai-engine' ), href: settingsUrl('insights') }
        : { label: __( 'See the dashboard', 'ai-engine' ), href: settingsUrl('dashboard'), overview: true },
      status: hasSiteLimit(options) ? __( 'A site limit is set.', 'ai-engine' ) : null,
      more: __( 'Costs grow with the model, the length of answers and the conversation history. A smaller model is often enough for a chatbot.', 'ai-engine' ),
      help: { title: __( 'Costs look high?', 'ai-engine' ), tips: [
        __( 'Try a Fast model for the chatbot, and lower its Max Messages.', 'ai-engine' ),
        __( 'Estimates are close but not exact. Your provider’s bill is the reference.', 'ai-engine' ),
      ] },
      link: !isRegistered ? { label: __( 'Discover Insights in Pro', 'ai-engine' ), href: track(PRO_URL, 'tour-insights') } : null,
    },
    {
      area: __( 'Writing', 'ai-engine' ), title: STOP_TITLES[7],
      goal: __( 'Turn an idea into a draft you can make your own.', 'ai-engine' ),
      how: [
        turnOn(content, __( 'Turn on Content Generator in Modules first.', 'ai-engine' )),
        __( 'Give Content Studio a topic, a reader and a few points, then shape the outline.', 'ai-engine' ),
        __( 'Generate the draft, save it, and finish it in the editor with your own details.', 'ai-engine' ),
        assistant ? __( 'In the editor, chat with the AI Assistant in the sidebar, right next to your article: it drafts, rewrites and rearranges with you. With Pro, it edits the post directly.', 'ai-engine' )
          : __( 'Turn on the AI Assistant in Modules to chat with the AI right next to your article in the editor.', 'ai-engine' ),
        __( 'Add a visual with the Images Generator: describe a subject, a mood and a style.', 'ai-engine' ),
      ],
      action: featureAction(content, __( 'Open Content Studio', 'ai-engine' ), 'edit.php?page=mwai_content_generator'),
      more: __( 'With the AI Copilot on, press space as you write to get a suggestion, or use the Magic Wand to rewrite, translate or correct a selection. The Images Generator can also edit a photo you already have.', 'ai-engine' ),
      help: { title: __( 'The draft feels generic?', 'ai-engine' ), tips: [
        __( 'Give it a point of view and one real example from your experience.', 'ai-engine' ),
        __( 'Check every fact before publishing.', 'ai-engine' ),
      ] },
    },
    {
      area: __( 'MCP', 'ai-engine' ), title: STOP_TITLES[8],
      goal: __( 'Let Claude or ChatGPT read and write on your site, safely.', 'ai-engine' ),
      how: [
        turnOn(mcp, __( 'Turn on MCP in Modules first.', 'ai-engine' )),
        __( 'In the MCP tab, click Connect and pick Claude or ChatGPT. Follow the steps: it takes a minute.', 'ai-engine' ),
        __( 'When you approve, choose Read-only to start. Then ask: “List my latest drafts.”', 'ai-engine' ),
      ],
      action: featureAction(mcp, __( 'Open the MCP tab', 'ai-engine' ), settingsUrl('mcp')),
      more: __( 'Switch to Full access once you trust it, to let it write posts, upload media and more. You can change or revoke any connection in the MCP tab, under Connections.', 'ai-engine' ),
      help: { title: __( 'Claude can’t connect?', 'ai-engine' ), tips: [
        __( 'Your site needs HTTPS, and some hosts block the connection. The troubleshooting guide explains what to check.', 'ai-engine' ),
        __( 'Tools missing? Reconnect the site in Claude to refresh them.', 'ai-engine' ),
      ] },
      link: { label: __( 'Fix a connection', 'ai-engine' ), href: track('https://meowapps.com/fix-mcp-wordpress-connection/', 'tour-mcp') },
    },
    {
      area: __( 'Workspace', 'ai-engine' ), title: STOP_TITLES[9],
      goal: __( 'Keep talking with your AI and your site from your phone.', 'ai-engine' ),
      how: [
        turnOn(workspace, __( 'Turn on Workspace in Modules first.', 'ai-engine' )),
        __( 'Install the free Workspace app on your iPhone or Android phone.', 'ai-engine' ),
        __( 'In the Workspace settings, show the QR code and scan it with the app. Your chats follow you.', 'ai-engine' ),
      ],
      action: featureAction(workspace, __( 'Open Workspace settings', 'ai-engine' ), settingsUrl('settings', 'workspace')),
      more: __( 'The app uses the same models, conversations and site tools as Workspace on your computer. You can disconnect a phone anytime from the same settings.', 'ai-engine' ),
      help: { title: __( 'The QR code does not show?', 'ai-engine' ), tips: [
        __( 'Pairing needs HTTPS on your site, since it uses WordPress Application Passwords.', 'ai-engine' ),
        __( 'The code expires after 5 minutes. Show a new one and scan again.', 'ai-engine' ),
      ] },
      link: { label: __( 'Meet Workspace', 'ai-engine' ), href: track(WORKSPACE_SITE, 'tour-workspace-mobile') },
    },
  ];
};
```