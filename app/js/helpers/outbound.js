// Previous: 3.7.6
// Current: 3.8.7

// Every link from the plugin admin to our own sites carries UTM tags, so the
// admin shows up as an acquisition channel in analytics instead of hiding in
// "Direct". Source and medium stay fixed; the campaign names the admin surface
// (discover = Modules tab showcase, setup = Setup Assistant, chatbots = Chatbots
// tab) and the content names the link itself.

export const VIBE_SITE = 'https://vibewithwp.ai';
export const WORKSPACE_SITE = 'https://workspace.press/';

export const outboundUrl = (url, campaign, content) => {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}utm_source=ai-engine&utm_medium=plugin&utm_campaign=${campaign}&utm_content=${content}`;
};

// The admin has dozens of links to meowapps.com (docs, FAQ, add-ons, the Pro page,
// contact) written over the years without tags, so meowapps.com saw all of that as
// "Direct". Rather than hunting them one by one, this decorates any link to our own
// sites at click time. Links that already carry utm_source (the showcase, the Setup
// Assistant) are left alone. The campaign names the admin screen, e.g.
// "settings-license" or "content_generator", so the analytics can tell which screen
// sends people where.
const OUR_HOSTS = ['meowapps.com', 'www.meowapps.com', 'vibewithwp.ai', 'workspace.press'];

const currentScreen = () => {
  const params = new URLSearchParams(window.location.search);
  const page = (params.get('page') || '').replace(/^mwai_/, '') || 'admin';
  const tab = params.get('nekoTab');
  return tab && tab !== page ? `${page}-${tab}` : page;
};

// The admin bundle loads on every wp-admin screen (for the blocks), so without this the
// relay tagged links on other plugins' screens (SEO Engine, Media Cleaner, the Meow Apps
// menu) as AI Engine traffic. Only our own screens and the editors count.
const isOurScreen = () => {
  const page = new URLSearchParams(window.location.search).get('page') || '';
  if (page.startsWith('mwai_')) return true;
  return /\/wp-admin\/(post|post-new|site-editor)\.php$/.test(window.location.pathname);
};

export const installOutboundRelay = () => {
  if (typeof document === 'undefined' || window.mwaiOutboundRelay || !isOurScreen()) return;
  window.mwaiOutboundRelay = true;
  document.addEventListener('click', (event) => {
    const anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!anchor) return;
    let url;
    try { url = new URL(anchor.href, window.location.href); }
    catch (e) { return; }
    if (!OUR_HOSTS.includes(url.hostname) || url.searchParams.has('utm_source')) return;
    url.searchParams.set('utm_source', 'ai-engine');
    url.searchParams.set('utm_medium', 'plugin');
    url.searchParams.set('utm_campaign', currentScreen());
    url.searchParams.set('utm_content', url.pathname.replace(/^\/|\/$/g, '') || 'home');
    anchor.href = url.toString();
  }, true);
};
