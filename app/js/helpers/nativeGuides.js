// Previous: none
// Current: 3.8.9

// MCP guides written natively in Japanese and French, shown only to admins using that language.
// Labels are not translatable strings on purpose: ja/fr are too far from a language pack, and
// only those admins ever see them. Plain links, no tracking.
const GUIDES = {
  ja: {
    hub: 'https://meowapps.jp/mcp/',
    hubLabel: '日本語ガイド',
    fix: 'https://meowapps.jp/articles/wordpress-mcp-not-connecting/',
    fixLabel: '接続できない場合の対処法',
  },
  fr: {
    hub: 'https://meowapps.fr/mcp/',
    hubLabel: 'Guide en français',
    fix: 'https://meowapps.fr/articles/wordpress-mcp-not-connecting/',
    fixLabel: 'Que faire si la connexion échoue',
  },
};

// WordPress sets <html lang> to the admin's own language (ja, fr-FR, fr-CA…).
export const getNativeMcpGuide = () => {
  const lang = ( document.documentElement.lang || '' ).toLowerCase();
  return GUIDES[lang.slice( 0, 2 )] || null;
};
