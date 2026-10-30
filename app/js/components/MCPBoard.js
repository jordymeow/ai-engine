// Previous: 3.8.8
// Current: 3.8.9

const { useState, useRef } = wp.element;
const { __, _n, sprintf } = wp.i18n;
import Styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { NekoButton, NekoBlock, NekoTabs, NekoTab, NekoWrapper, NekoColumn } from '@neko-ui';
import { FileText, Plug, BarChart3, Lock, Wrench, ScrollText, Terminal, Copy, Check, Bot, KeyRound, History, SlidersHorizontal, Globe, ChevronRight, Activity } from 'lucide-react';
import { pluginUrl, restUrl, apiUrl, isRegistered } from '@app/settings';
import { settingsUrl } from '@app/helpers/adminNavigation';
import { MCP_SET_TOOLS } from '@app/helpers/mcpToolSets';
import MCPFunctions from '@app/components/MCPFunctions';

const Board = Styled.div`
  .stat strong { display: block; font-size: 26px; font-weight: 700; line-height: 1; font-variant-numeric: tabular-nums; color: #1f2937; }
  .stat span { display: block; margin-top: 6px; font-size: 12px; color: #6b7280; }
  .spark { display: grid; gap: 4px; min-height: 60px; align-items: end; margin-top: 16px; }
  .spark i { display: block; border-radius: 4px 4px 2px 2px; min-height: 3px; background: linear-gradient(180deg, #3b82f6, #0d7df2); }
  .spark i.empty { background: rgba(15, 23, 42, 0.05); }
  .spark-days { display: grid; gap: 4px; margin-top: 6px; font-size: 11px; color: #9ca3af; text-align: center; }
  .vis-tag { font-size: 10px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #fff;
    background: rgba(255, 255, 255, 0.2); border-radius: 999px; padding: 3px 8px; }
  .big { display: block; font-size: 28px; font-weight: 700; line-height: 1; color: #1f2937; font-variant-numeric: tabular-nums; }
  .small { display: block; margin-top: 6px; font-size: 12px; color: #6b7280; }
  .sample, .sample .big, .sample strong, .sample .who b, .sample .tool code { color: #b6bcc6 !important; }
  .sample .spark i, .sample .meter b, .sample .tool i b { background: #dfe3e8 !important; }
  .stats3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .stats3 .stat strong { font-size: 26px; }
  .none { margin: 0; font-size: 13px; color: #6b7280; }
  .since { margin: 8px 0 0; font-size: 11.5px; color: #9ca3af; text-align: center; }
  .tools-top { display: flex; flex-direction: column; gap: 7px; margin-top: 16px; }
  .tool { display: grid; grid-template-columns: 190px 1fr 34px; align-items: center; gap: 10px; font-size: 12px; }
  .tool .tname { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #374151; font-weight: 500; }
  .tool .tname small { margin-left: 6px; font-size: 11px; color: #9ca3af; font-weight: 400; }
  .sample .tool .tname { color: #b6bcc6; }
  .tool code { font-size: 11.5px; background: none; padding: 0; color: #374151; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .tool i { display: block; height: 7px; border-radius: 999px; background: rgba(15, 23, 42, 0.06); overflow: hidden; }
  .tool i b { display: block; height: 100%; border-radius: 999px; background: #0d7df2; }
  .tool em { font-style: normal; text-align: right; color: #6b7280; font-variant-numeric: tabular-nums; }
  .changes { display: flex; flex-direction: column; gap: 10px; }
  .change { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #374151; }
  .change .what { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .change .what a, .change .what b { font-weight: 600; color: #1f2937; text-decoration: none; }
  .change .what a:hover { color: #0d7df2; text-decoration: underline; }
  .change .thumb { position: relative; width: 28px; height: 28px; flex: none; }
  .change .thumb img { width: 28px; height: 28px; border-radius: 7px; object-fit: cover; display: block; }
  .change .thumb .none-img { width: 28px; height: 28px; border-radius: 7px; display: grid; place-items: center; background: #f3f4f6; color: #9ca3af; }
  .change .thumb .badge { position: absolute; right: -5px; bottom: -5px; width: 16px; height: 16px; border-radius: 5px;
    display: grid; place-items: center; background: #fff; color: #374151; box-shadow: 0 0 0 1.5px #fff; }
  .change .thumb .badge img, .change .thumb .badge svg { width: 11px; height: 11px; border-radius: 0; }
  .change .times { margin-left: 6px; font-style: normal; font-size: 11.5px; color: #9ca3af; }
  .change .diff { font-size: 12px; font-weight: 600; color: #0d7df2; text-decoration: none; white-space: nowrap; }
  .change .diff:hover { text-decoration: underline; }
  .change .when { font-size: 12px; color: #9ca3af; white-space: nowrap; }
  .who-list { display: flex; flex-direction: column; gap: 10px; }
  .who { display: flex; align-items: center; gap: 10px; font-size: 13px; }
  .who b { font-weight: 600; color: #1f2937; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .more { margin-top: 10px; background: none; border: none; padding: 0; cursor: pointer; font-size: 12.5px; font-weight: 600; color: #0d7df2; }
  .who b .approvals { margin-left: 6px; font-weight: 400; font-size: 11.5px; color: #9ca3af; }
  .who span { font-size: 12px; color: #6b7280; font-variant-numeric: tabular-nums; }
  .who .route { min-width: 76px; text-align: center; font-size: 10.5px; font-weight: 600; border-radius: 999px; padding: 2px 8px; }
  .route.connector { color: #c2410c; background: #ffedd5; }
  .route.direct { color: #0d6bd4; background: #e3eefd; }
  .route.token { color: #4b5563; background: #f3f4f6; }
  .sample .route { color: #b6bcc6 !important; background: #f3f4f6 !important; }
  .flow { display: flex; align-items: stretch; gap: 4px; }
  .step { flex: 1; min-width: 0; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px;
    padding: 10px 4px 8px; border: none; background: none; border-radius: 10px; cursor: pointer; font: inherit; color: inherit; }
  .step:hover, .step:focus-visible { background: #f5f7fa; outline: none; }
  .step .ico { width: 38px; height: 38px; border-radius: 11px; display: grid; place-items: center; color: #fff; }
  .step b { font-size: 12.5px; font-weight: 600; color: #1f2937; }
  .step small { font-size: 11.5px; color: #6b7280; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .flow > svg { align-self: center; flex: none; color: #c4c9d1; }
  .flow > .step { flex: 0 0 26%; align-self: flex-end; }
  .site-frame { flex: 1; min-width: 0; border: 2px solid #0d7df2; background: #f3f8ff; border-radius: 12px; padding: 6px 6px 0; }
  .site-frame .site-label { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 700; color: #0d7df2;
    padding: 0 4px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .site-frame .flow > .step { flex: 1; }
  .site-frame .step:hover, .site-frame .step:focus-visible { background: #e6f0fe; }
  .opts { display: flex; flex-direction: column; }
  .opt { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-top: 1px solid #f0f2f5; }
  .opt:first-child { border-top: none; padding-top: 0; }
  .opt:last-child { padding-bottom: 0; }
  .opt .ico { width: 30px; height: 30px; border-radius: 8px; flex: none; display: grid; place-items: center; background: #f3f4f6; color: #4b5563; }
  .opt div { flex: 1; min-width: 0; }
  .opt b { display: block; font-size: 13px; font-weight: 600; color: #1f2937; }
  .opt small { display: block; font-size: 12px; color: #6b7280; }
  .opt small.ok { color: #15803d; }
  .opt small.bad { color: #b91c1c; }
  .logo { width: 28px; height: 28px; border-radius: 8px; flex: none; display: grid; place-items: center; background: #f3f4f6; color: #374151; }
  .logo img { width: 16px; height: 16px; }
  .meter { display: flex; height: 8px; border-radius: 999px; overflow: hidden; background: rgba(15, 23, 42, 0.06); margin: 14px 0 8px; }
  .meter b { display: block; height: 100%; }
  .legend { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 12px; color: #4b5563; }
  .legend span { display: inline-flex; align-items: center; gap: 6px; }
  .legend i { width: 8px; height: 8px; border-radius: 2px; display: inline-block; }
  .facts { display: flex; flex-direction: column; gap: 6px; margin-top: 12px; font-size: 12.5px; color: #374151; }
  .fact { display: flex; align-items: center; gap: 8px; }
  .dot { width: 7px; height: 7px; border-radius: 50%; flex: none; background: #d1d5db; }
  .dot.on { background: #16a34a; box-shadow: 0 0 0 3px #dcfce7; }
  .fact.off { color: #9ca3af; }
  .chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
  .chip { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 999px; font-size: 11.5px; font-weight: 600;
    background: #eef4fe; color: #0d6bd4; border: 1px solid #d6e5fb; }
  .chip em { font-style: normal; font-weight: 500; opacity: 0.75; }
  .chip.off { background: none; color: #9ca3af; border: 1px dashed #d5d9df; font-weight: 500; }
  .chip .pro { font-size: 9.5px; font-weight: 700; color: #fff; background: linear-gradient(90deg, #f97316, #ef4444); border-radius: 4px; padding: 0 4px; }
  .connect-card { padding: 0; overflow: hidden; }
  .site { display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #6b7280; padding-bottom: 12px; margin-bottom: 12px; border-bottom: 1px solid #f0f2f5; }
  .site code { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .site code { font-size: 12px; background: #f5f6f8; border-radius: 6px; padding: 3px 8px; color: #1f2937; }
  .site button { background: none; border: none; padding: 0; cursor: pointer; color: #0d7df2; display: inline-flex; align-items: center; gap: 4px; font-size: 12.5px; font-weight: 600; }
  .foot { display: flex; gap: 16px; margin: 0 4px 4px; }
  .foot a { color: #fff; opacity: 0.85; font-size: 12.5px; text-decoration: none; cursor: pointer; }
  .foot a:hover, .foot a:focus-visible { opacity: 1; text-decoration: underline; outline: none; }
`;

const COLORS = { connections: '#f97316', access: '#8b5cf6', tools: '#10b981', site: '#0d7df2' };
const TitleIco = Styled.span`
  display: inline-grid; place-items: center; width: 22px; height: 22px; border-radius: 6px;
  flex: none; margin-right: 8px; color: #fff; background: ${p => p.color || 'rgba(255, 255, 255, 0.2)'};
`;
const title = ( Icon, text, color ) => <span style={{ display: 'inline-flex', alignItems: 'center' }}>
  <TitleIco color={color}><Icon size={13} strokeWidth={2.4} /></TitleIco>{text}
</span>;

const WEEK = 7 * 24 * 3600 * 1000;
const isRecent = ( iso ) => {
  const time = iso ? new Date( iso.replace( ' ', 'T' ) + 'Z' ).getTime() : NaN;
  return !isNaN( time ) && Date.now() - time <= WEEK;
};

const SAMPLE_USAGE = {
  calls: 412, changes: 37, errors: 5,
  perDay: [ 22, 48, 15, 71, 96, 64, 96 ].map( ( calls, i ) => ( { date: `sample-${i}`, calls } ) ),
  topTools: [ [ 'wp_get_posts', 168 ], [ 'wp_update_post', 88 ], [ 'wp_write_blocks', 52 ] ].map( ( [ tool, calls ] ) => ( { tool, calls } ) ),
  assistants: [ [ 'Claude', 274 ], [ 'ChatGPT', 121 ], [ 'Claude Code', 17 ] ].map( ( [ name, calls ] ) => ( { name, calls } ) ),
};

const ACCESS = [
  { key: 'full', label: __( 'Full', 'ai-engine' ), color: '#0d7df2' },
  { key: 'content', label: __( 'Content', 'ai-engine' ), color: '#60a5fa' },
  { key: 'readonly', label: __( 'Read-only', 'ai-engine' ), color: '#a5c8fb' },
];

const TOOL_SETS = [
  { option: 'mcp_core', name: 'WordPress', count: MCP_SET_TOOLS.core },
  { option: 'mcp_plugins', name: 'Plugins', count: MCP_SET_TOOLS.plugins, pro: true },
  { option: 'mcp_themes', name: 'Themes', count: MCP_SET_TOOLS.themes, pro: true },
  { option: 'mcp_database', name: 'Database', count: MCP_SET_TOOLS.database, pro: true },
  { option: 'mcp_woocommerce', name: 'WooCommerce', count: MCP_SET_TOOLS.woocommerce, pro: true },
  { option: 'mcp_polylang', name: 'Polylang', count: MCP_SET_TOOLS.polylang, pro: true },
  { option: 'mcp_wpml', name: 'WPML', count: MCP_SET_TOOLS.wpml, pro: true },
  { option: 'mcp_abilities', name: 'Abilities' },
  { option: 'mcp_dynamic_rest', name: 'REST', count: MCP_SET_TOOLS.rest },
];

const assistantLogo = ( name = '' ) => {
  if ( /claude code/i.test( name ) ) return <Terminal size={15} />;
  if ( /claude/i.test( name ) ) return <img src={`${pluginUrl}/images/chat-anthropic.svg`} alt="" />;
  if ( /chatgpt|openai/i.test( name ) ) return <img src={`${pluginUrl}/images/chat-openai.svg`} alt="" />;
  if ( /bearer|token|developer/i.test( name ) ) return <KeyRound size={15} />;
  return <Bot size={15} />;
};

const VERBS = {
  wp_create_post: __( 'Created', 'ai-engine' ), wp_write_blocks: __( 'Wrote', 'ai-engine' ),
  wp_update_post: __( 'Edited', 'ai-engine' ), wp_alter_post: __( 'Edited', 'ai-engine' ),
  wp_delete_post: __( 'Trashed', 'ai-engine' ), wp_upload_media: __( 'Uploaded', 'ai-engine' ),
  wp_update_media: __( 'Edited', 'ai-engine' ), wp_set_featured_image: __( 'Set the image of', 'ai-engine' ),
  wp_add_post_terms: __( 'Tagged', 'ai-engine' ), wp_update_post_meta: __( 'Updated the fields of', 'ai-engine' ),
  wp_create_comment: __( 'Commented on', 'ai-engine' ), wp_update_comment: __( 'Edited a comment on', 'ai-engine' ),
  wp_create_term: __( 'Created the term', 'ai-engine' ), wp_update_term: __( 'Edited the term', 'ai-engine' ),
  mwseo_set_seo_title: __( 'Set the SEO title of', 'ai-engine' ), mwseo_set_seo_excerpt: __( 'Set the SEO description of', 'ai-engine' ),
  pll_create_translation: __( 'Translated', 'ai-engine' ), wpml_create_translation: __( 'Translated', 'ai-engine' ),
  pll_set_post_language: __( 'Set the language of', 'ai-engine' ), wpml_set_post_language: __( 'Set the language of', 'ai-engine' ),
  wc_create_product: __( 'Created', 'ai-engine' ), wc_update_product: __( 'Edited', 'ai-engine' ), wc_alter_product: __( 'Edited', 'ai-engine' ),
};
const verbOf = ( c ) => {
  if ( c.tool === 'wp_add_post_terms' && c.removed ) {
    return c.taxonomy === 'category' ? __( 'Removed the categories of', 'ai-engine' ) : __( 'Removed the tags of', 'ai-engine' );
  }
  if ( c.tool === 'wp_add_post_terms' && c.taxonomy === 'category' ) return __( 'Categorized', 'ai-engine' );
  if ( VERBS[c.tool] ) return VERBS[c.tool];
  const words = c.tool.replace( /^(wp|mwseo|pll|wpml|wc|mwai)_/, '' ).replace( /_/g, ' ' );
  return words.charAt( 0 ).toUpperCase() + words.slice( 1 );
};
const timeAgo = ( seconds ) => {
  const diff = Math.max( 0, Date.now() / 1000 - seconds );
  if ( diff < 60 ) return __( 'just now', 'ai-engine' );
  if ( diff < 3600 ) return sprintf( __( '%d min ago', 'ai-engine' ), Math.round( diff / 60 ) );
  if ( diff < 86400 ) return sprintf( __( '%d h ago', 'ai-engine' ), Math.round( diff / 3600 ) );
  return sprintf( _n( '%d day ago', '%d days ago', Math.round( diff / 86400 ), 'ai-engine' ), Math.round( diff / 86400 ) );
};
const SOURCES = { wp: 'WordPress', mwseo: 'SEO Engine', mwai: 'AI Engine', pll: 'Polylang', wpml: 'WPML', wc: 'WooCommerce' };
const toolLabel = ( tool ) => {
  const [ prefix, ...rest ] = tool.split( '_' );
  const known = SOURCES[prefix];
  const words = ( known ? rest : [ prefix, ...rest ] ).join( ' ' );
  return { name: words.charAt( 0 ).toUpperCase() + words.slice( 1 ), source: known || '' };
};
const SKELETON = [ 34, 52, 26, 64, 44, 58, 38 ];
const dayLabel = ( date, isToday ) => {
  if ( isToday ) return __( 'Today', 'ai-engine' );
  const d = new Date( `${date}T12:00:00Z` );
  return isNaN( d.getTime() ) ? '' : d.toLocaleDateString( undefined, { weekday: 'short' } );
};
const ago = ( seconds ) => Date.now() / 1000 - seconds;
const SAMPLE_RECENT = [
  { tool: 'wp_update_post', client: 'Claude', title: 'A day trip to Nikko', time: ago( 600 ) },
  { tool: 'wp_upload_media', client: 'ChatGPT', title: 'Fushimi Inari at dawn', time: ago( 2400 ) },
  { tool: 'wp_create_post', client: 'ChatGPT', title: 'Autumn in Kyoto: five quiet spots', time: ago( 7200 ) },
  { tool: 'wp_add_post_terms', client: 'Claude', title: 'Hidden onsen near Tokyo', time: ago( 20000 ) },
  { tool: 'wp_create_comment', client: 'Claude Code', title: 'Where to eat in Osaka', time: ago( 50000 ) },
  { tool: 'wp_set_featured_image', client: 'Claude', title: 'Hidden onsen near Tokyo', time: ago( 90000 ) },
  { tool: 'wp_write_blocks', client: 'ChatGPT', title: 'Where to eat in Osaka', time: ago( 180000 ) },
  { tool: 'wp_delete_post', client: 'Claude', title: 'Draft: old ideas', time: ago( 260000 ) },
];

const fetchJson = async ( url ) => {
  const res = await fetch( url, { headers: { 'X-WP-Nonce': window.wpApiSettings.nonce } } );
  if ( !res.ok ) throw new Error( `Failed: ${url}` );
  return res.json();
};

const MCPBoard = ({ options, onOpen, connectCard, toolSets, selfTest }) => {
  const [ copied, setCopied ] = useState( false );
  const on = !!options?.module_mcp;
  const site = ( window.wpApiSettings?.root || '' ).replace( /\/wp-json\/?$/, '' );

  const { data: appsData } = useQuery( { queryKey: [ 'mcp-oauth-apps' ], enabled: on,
    queryFn: () => fetchJson( `${restUrl}/mcp/v1/oauth/apps` ) } );
  const { data: functions } = useQuery( {
    queryKey: [ 'mcp-functions', options?.module_mcp, options?.mcp_core, options?.mcp_plugins, options?.mcp_themes, options?.mcp_database, options?.mcp_dynamic_rest, options?.mcp_abilities ],
    queryFn: () => fetchJson( `${window.wpApiSettings.root}mwai/v1/mcp/functions` ),
    enabled: on
  } );
  const { data: usageData } = useQuery( { queryKey: [ 'mcp-board-usage' ], enabled: on,
    queryFn: () => fetchJson( `${apiUrl}/mcp/usage?days=7` ) } );

  const allApps = appsData?.apps || [];
  const apps = allApps.filter( a => a.access !== 'none' );
  const everConnected = allApps.length > 0 || !!options?.mcp_bearer_token;
  const realUsage = usageData?.usage;
  const realRecent = usageData?.recent || [];
  const hasRecent = realRecent.length > 0;
  const recent = hasRecent ? realRecent.slice( 0, 8 ) : SAMPLE_RECENT;
  const hasUsage = !!realUsage?.calls;
  const usage = hasUsage ? realUsage : SAMPLE_USAGE;
  const peak = Math.max( 1, ...usage.perDay.map( d => d.calls ) );
  const topPeak = Math.max( 1, ...usage.topTools.map( t => t.calls ) );
  const errorRate = usage.calls ? Math.round( usage.errors / usage.calls * 1000 ) / 10 : 0;
  const people = new Set( apps.map( a => a.user_login ) ).size;
  const activePeople = new Set( apps.filter( a => isRecent( a.last_used ) ).map( a => a.user_login ) ).size;
  const byAccess = ACCESS.map( level => ( { ...level, count: apps.filter( a => a.access === level.key ).length } ) );
  const fullLog = !!options?.module_statistics || !!options?.mcp_log_calls;

  const copy = () => {
    navigator.clipboard?.writeText( site ).then( () => { setCopied( true ); setTimeout( () => setCopied( false ), 2500 ); } );
  };

  const callsOf = ( name ) => ( realUsage?.assistants || [] ).find( a => a.name === name )?.calls || 0;
  const routeOf = ( name = '' ) => {
    const m = name.match( /^(.*) \(via Meow Apps\)$/ );
    if ( m ) return { name: m[1], route: 'connector' };
    const t = name.match( /^(.*) \(token\)$/ );
    if ( t ) return { name: t[1], route: 'token' };
    if ( /bearer|token/i.test( name ) ) return { name: __( 'Developer tools', 'ai-engine' ), route: 'token' };
    return { name, route: 'direct' };
  };
  const ROUTES = { connector: __( 'Connector', 'ai-engine' ), direct: __( 'Direct', 'ai-engine' ), token: __( 'Token', 'ai-engine' ) };
  const rows = [];
  const addRow = ( rawName, { count = 0, recent = false, calls = 0 } ) => {
    const { name, route } = routeOf( rawName );
    const row = rows.find( r => r.route === route || ( route === 'token' && r.name === name ) );
    if ( row ) {
      row.count += count; row.recent = row.recent || recent; row.calls += calls;
      if ( route === 'token' && name !== __( 'Developer tools', 'ai-engine' ) ) row.name = name;
    }
    else { rows.push( { name, route, count, recent, calls } ); }
  };
  apps.forEach( a => addRow( a.client_name || __( 'Unknown app', 'ai-engine' ), { count: 1, recent: isRecent( a.last_used ) } ) );
  ( realUsage?.assistants || [] ).forEach( a => addRow( a.name, { recent: true, calls: a.calls } ) );
  if ( options?.mcp_bearer_token && !rows.some( r => r.route === 'token' ) ) {
    addRow( 'Bearer token', {} );
  }
  rows.sort( ( x, y ) => y.calls - x.calls || x.recent - y.recent );
  const showSample = rows.length === 0;
  const shown = showSample
    ? SAMPLE_USAGE.assistants.map( ( a, i ) => ( { name: a.name, route: [ 'connector', 'direct', 'token' ][i], count: 1, recent: true, calls: a.calls } ) )
    : rows.slice( 0, 5 );

  const sampleTag = <span className="vis-tag" style={{ marginRight: 0 }}>{__( 'Example', 'ai-engine' )}</span>;
  const button = ( label, modal ) => <NekoButton className="secondary" onClick={() => onOpen( modal )}>{label}</NekoButton>;

  const tokenLevel = ACCESS.find( level => level.key === { admin: 'full', readwrite: 'content', readonly: 'readonly' }[options?.mcp_role || 'admin'] ) || ACCESS[0];
  const connectionCount = rows.length;
  const since = hasUsage && realUsage.since && realUsage.perDay[0] && realUsage.since >= realUsage.perDay[0].date ? realUsage.since : null;
  const host = site.replace( /^https?:\/\//, '' );
  const toolsRef = useRef( null );
  const testLine = !selfTest
    ? <small>{__( 'Check that assistants can reach your site.', 'ai-engine' )}</small>
    : selfTest.verdict === 'ok'
      ? <small className="ok">{__( 'All good: assistants can reach your site.', 'ai-engine' )}</small>
      : <small className="bad">{__( 'Something blocks assistants. Open it to see what.', 'ai-engine' )}</small>;
  const steps = [
    { key: 'connections', icon: Plug, label: __( 'Connections', 'ai-engine' ),
      value: connectionCount ? sprintf( _n( '%d connection', '%d connections', connectionCount, 'ai-engine' ), connectionCount ) : __( 'None yet', 'ai-engine' ),
      onClick: () => onOpen( everConnected ? 'connections' : 'connect' ) },
    { key: 'access', icon: Lock, label: __( 'Access', 'ai-engine' ),
      value: options?.mcp_oauth_editors ? __( 'Admins, editors', 'ai-engine' ) : __( 'Admins only', 'ai-engine' ),
      onClick: () => onOpen( 'access' ) },
    { key: 'tools', icon: Wrench, label: __( 'Tools', 'ai-engine' ),
      value: functions?.count != null ? sprintf( _n( '%d tool', '%d tools', functions.count, 'ai-engine' ), functions.count ) : '…',
      onClick: () => toolsRef.current?.scrollIntoView( { behavior: 'smooth', block: 'center' } ) },
  ];

  const renderStep = ( step ) => <button type="button" className="step" onClick={step.onClick}>
    <span className="ico" style={{ background: COLORS[step.key] }}><step.icon size={18} strokeWidth={2.2} /></span>
    <b>{step.label}</b>
    <small title={step.value}>{step.value}</small>
  </button>;

  return <Board>

    <NekoWrapper>
      <NekoColumn minimal>
        {!everConnected && <NekoBlock className="primary" title={title( Plug, __( 'Connect', 'ai-engine' ), COLORS.connections )}
          contentStyle={{ padding: 0, overflow: 'hidden' }}>
          {connectCard}
        </NekoBlock>}

        <NekoBlock className="primary" title={title( BarChart3, __( 'This Week', 'ai-engine' ) )}
          action={hasUsage ? button( __( 'Details', 'ai-engine' ), 'activity' ) : sampleTag}>
          <div className={hasUsage ? '' : 'sample'}>
            <div className="stats3">
              <div className="stat"><strong>{usage.calls}</strong><span>{_n( 'tool call', 'tool calls', usage.calls, 'ai-engine' )}</span></div>
              <div className="stat"><strong>{usage.changes}</strong><span>{__( 'changes', 'ai-engine' )}</span></div>
              <div className="stat"><strong>{errorRate}%</strong><span>{__( 'errors', 'ai-engine' )}</span></div>
            </div>
            <div className="spark" style={{ gridTemplateColumns: `repeat(${usage.perDay.length}, 1fr)` }}>
              {usage.perDay.map( ( day, i ) => <i key={day.date} title={hasUsage ? `${day.date}: ${day.calls}` : undefined}
                className={day.calls === 0 ? 'empty' : ''}
                style={{ height: day.calls > 0 ? `${Math.max( 10, day.calls / peak * 100 )}%` : `${SKELETON[i % SKELETON.length]}%` }} /> )}
            </div>
            <div className="spark-days" style={{ gridTemplateColumns: `repeat(${usage.perDay.length}, 1fr)` }}>
              {usage.perDay.map( ( day, i ) => <span key={day.date}>{dayLabel( day.date, i === usage.perDay.length - 1 )}</span> )}
            </div>
            {since && <p className="since">{sprintf( __( 'Counting since %s.', 'ai-engine' ), new Date( `${since}T12:00:00Z` ).toLocaleDateString( undefined, { month: 'short', day: 'numeric' } ) )}</p>}
            <div className="tools-top">
              {usage.topTools.slice( 0, 3 ).map( t => <div key={t.tool} className="tool">
                <span className="tname" title={t.tool}>{toolLabel( t.tool ).name}{toolLabel( t.tool ).source && <small>{toolLabel( t.tool ).source}</small>}</span><i><b style={{ width: `${t.calls / topPeak * 100}%` }} /></i><em>{t.calls}</em>
              </div> )}
            </div>
          </div>
        </NekoBlock>

        <NekoBlock className="primary" title={title( History, __( 'Recent Changes', 'ai-engine' ) )} action={hasRecent || hasUsage ? null : sampleTag}>
          {!hasRecent && hasUsage ? <p className="none">
            {__( 'From now on, each post, page or file an assistant changes shows up here, with a link to it.', 'ai-engine' )}
          </p> : <div className={`changes ${hasRecent ? '' : 'sample'}`}>
            {recent.map( ( c, i ) => <div key={`${c.time}-${i}`} className="change">
              <span className="thumb">
                {c.thumb ? <img src={c.thumb} alt="" /> : <span className="none-img"><FileText size={14} /></span>}
                <span className="badge" title={routeOf( c.client ).name}>{assistantLogo( c.client )}</span>
              </span>
              <span className="what">
                {c.title ? verbOf( c ) : verbOf( c ).replace( / (on|of)$/, '' )}{' '}
                {c.title ? ( c.editUrl ? <a href={c.editUrl}>{c.title}</a> : <b>{c.title}</b> ) : null}
                {c.count > 1 && <em className="times">×{c.count}</em>}
              </span>
              {c.diffUrl && <a className="diff" href={c.diffUrl}>{__( 'See changes', 'ai-engine' )}</a>}
              {c.restoreUrl && <a className="diff" href={c.restoreUrl} title={__( 'Opens the version from before this change, ready to restore', 'ai-engine' )}>{__( 'Restore', 'ai-engine' )}</a>}
              <span className="when">{timeAgo( c.time )}</span>
            </div> )}
          </div>}
        </NekoBlock>

        <NekoBlock className="primary" title={title( Plug, __( 'Connections', 'ai-engine' ), COLORS.connections )}
          action={<div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {!showSample && button( __( 'Manage', 'ai-engine' ), 'connections' )}
            {everConnected && <NekoButton className="success" icon="plus" onClick={() => onOpen( 'connect' )}>{__( 'Connect', 'ai-engine' )}</NekoButton>}
          </div>}>
          <div className="site">
            <span>{__( 'Your site', 'ai-engine' )}</span>
            <code>{site}</code>
            <button type="button" onClick={copy}>{copied ? <Check size={13} /> : <Copy size={13} />}{copied ? __( 'Copied', 'ai-engine' ) : __( 'Copy', 'ai-engine' )}</button>
          </div>
          <div className={`who-list ${showSample ? 'sample' : ''}`}>
            {shown.map( r => <div key={`${r.name}-${r.route}`} className="who">
              <span className="logo">{assistantLogo( r.name )}</span>
              <b>{r.name}{r.count > 1 ? <span className="approvals">{sprintf( __( '%d approvals', 'ai-engine' ), r.count )}</span> : null}</b>
              <span>{r.calls
                ? sprintf( _n( '%d call', '%d calls', r.calls, 'ai-engine' ), r.calls )
                : ( r.recent ? __( 'used this week', 'ai-engine' ) : __( 'not used lately', 'ai-engine' ) )}</span>
              <span className={`route ${r.route}`}>{ROUTES[r.route]}</span>
            </div> )}
          </div>
          {!showSample && rows.length > shown.length && <button type="button" className="more" onClick={() => onOpen( 'connections' )}>
            {sprintf( __( 'View all %d', 'ai-engine' ), rows.length )}
          </button>}
        </NekoBlock>
      </NekoColumn>

      <NekoColumn minimal>
        <NekoBlock className="primary" title={__( 'How It Works', 'ai-engine' )}
          action={button( __( 'Guide', 'ai-engine' ), 'about' )}>
          <div className="flow">
            {renderStep( steps[0] )}
            <ChevronRight size={16} />
            <div className="site-frame">
              <span className="site-label"><Globe size={12} strokeWidth={2.4} />{__( 'Your WordPress', 'ai-engine' )} · {host}</span>
              <div className="flow">
                {renderStep( steps[1] )}
                <ChevronRight size={16} />
                {renderStep( steps[2] )}
              </div>
            </div>
          </div>
        </NekoBlock>

        <NekoBlock className="primary" title={title( Lock, __( 'Access', 'ai-engine' ), COLORS.access )}
          action={button( __( 'Settings', 'ai-engine' ), 'access' )}>
          {!apps.length && options?.mcp_bearer_token ? <div>
            <span className="big">{tokenLevel.label}</span>
            <span className="small">{__( 'what the developer token can do, for now the only connection', 'ai-engine' )}</span>
            <div className="meter"><b style={{ width: '100%', background: tokenLevel.color }} /></div>
          </div> : <div className={apps.length ? '' : 'sample'}>
            <span className="big">{apps.length ? activePeople : 0}</span>
            <span className="small">{apps.length
              ? sprintf( _n( 'active this week, out of %d person connected', 'active this week, out of %d people connected', people, 'ai-engine' ), people )
              : __( 'nobody connected yet', 'ai-engine' )}</span>
            <div className="meter">
              {apps.length > 0 && byAccess.map( level => level.count > 0 && <b key={level.key} title={level.label}
                style={{ width: `${level.count / apps.length * 100}%`, background: level.color }} /> )}
            </div>
            <div className="legend">
              {apps.length > 0 && <span>{__( 'Approvals:', 'ai-engine' )}</span>}
              {byAccess.map( level => <span key={level.key}><i style={{ background: level.color }} />{level.label} {level.count}</span> )}
            </div>
          </div>}
          <div className="facts">
            <div className={`fact ${options?.mcp_oauth_editors ? '' : 'off'}`}><span className={`dot ${options?.mcp_oauth_editors ? 'on' : ''}`} />{__( 'Editors can connect', 'ai-engine' )}</div>
            <div className={`fact ${options?.mcp_default_readonly ? '' : 'off'}`}><span className={`dot ${options?.mcp_default_readonly ? 'on' : ''}`} />{__( 'New connections start read-only', 'ai-engine' )}</div>
            <div className={`fact ${options?.mcp_bearer_token ? '' : 'off'}`}><span className={`dot ${options?.mcp_bearer_token ? 'on' : ''}`} />{__( 'Token for developer tools', 'ai-engine' )}</div>
          </div>
        </NekoBlock>

        <div ref={toolsRef}>
          <NekoTabs inversed title={title( Wrench, __( 'Tools', 'ai-engine' ), COLORS.tools )}>
            <NekoTab key="sets" title={__( 'Overview', 'ai-engine' )}>
              <div>
                <span className="big">{functions?.count ?? '…'}</span>
                <span className="small">{__( 'tools your AI assistants can use', 'ai-engine' )}</span>
              </div>
              <div className="chips">
                {TOOL_SETS.map( set => {
                  const enabled = !!options?.[set.option];
                  return <span key={set.option} className={`chip ${enabled ? '' : 'off'}`}
                    title={enabled ? undefined : __( 'Off. Turn it on in the Settings tab.', 'ai-engine' )}>
                    {set.name}{set.count ? <em>{set.count}</em> : null}
                    {!enabled && set.pro && !isRegistered && <span className="pro">PRO</span>}
                  </span>;
                } )}
              </div>
            </NekoTab>
            <NekoTab key="all" title={__( 'All Tools', 'ai-engine' )}>
              <MCPFunctions options={options} bare />
            </NekoTab>
            <NekoTab key="settings" title={__( 'Settings', 'ai-engine' )}>
              {toolSets}
            </NekoTab>
          </NekoTabs>
        </div>

        <NekoBlock className="primary" title={title( SlidersHorizontal, __( 'Options', 'ai-engine' ) )}>
          <div className="opts">
            <div className="opt">
              <span className="ico"><Activity size={15} /></span>
              <div><b>{__( 'Connection Test', 'ai-engine' )}</b>{testLine}</div>
              {button( selfTest ? __( 'Details', 'ai-engine' ) : __( 'Run', 'ai-engine' ), 'test' )}
            </div>
            <div className="opt">
              <span className="ico"><ScrollText size={15} /></span>
              <div><b>{__( 'Logging', 'ai-engine' )}</b>
                <small>{fullLog
                  ? ( options?.mcp_log_payloads ? __( 'Every call with its details, in Insights.', 'ai-engine' ) : __( 'Every call, in Insights.', 'ai-engine' ) )
                  : __( 'Only the counts above, nothing else is kept.', 'ai-engine' )}</small>
              </div>
              {fullLog && <NekoButton className="secondary" onClick={() => { window.location.href = settingsUrl( 'insights' ); }}>{__( 'Open', 'ai-engine' )}</NekoButton>}
              {button( __( 'Settings', 'ai-engine' ), 'logging' )}
            </div>
          </div>
        </NekoBlock>
      </NekoColumn>
    </NekoWrapper>

  </Board>;
};

export default MCPBoard;