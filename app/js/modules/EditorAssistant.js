// Previous: none
// Current: 3.4.0

const { useState, useEffect, useRef, useCallback, createPortal } = wp.element;
const { registerPlugin } = wp.plugins;
import styled from 'styled-components';
import { compiler as markdownCompiler } from 'markdown-to-jsx';
import TextAreaAutosize from 'react-textarea-autosize';
import { NekoUI, nekoFetch, NekoSelect, NekoOption } from '@neko-ui';
import { restUrl, getRestNonce, updateRestNonce, options, pluginUrl, isRegistered } from '@app/settings';
import { useModels } from '@app/helpers-admin';

const LOG_PREFIX = '[EditorAssistant]';
const PANEL_WIDTH = 380;
const PADDING = 15;
const BORDER_RADIUS = 12;
const ACCENT_COLOR = '#1e3a5f';

const SYSTEM_PROMPT_PRO = `You are an AI writing assistant integrated into the WordPress block editor. You help the user edit their post content.

You have tools to modify the post directly. When the user asks you to edit content, use the appropriate tools.

Important guidelines:
- Block indices are zero-based and refer to the content snapshot provided with the message.
- ALWAYS batch ALL tool calls in a single response. Never make one change at a time across multiple responses.
- The system processes batched operations from highest index to lowest automatically, so always use the indices from the current snapshot — do not manually adjust for shifts.
- Keep your conversational replies concise. Focus on performing the requested edits.
- When replacing content, preserve the original HTML formatting style (e.g., if content uses <strong> tags, keep using them).
- Only use tools when the user explicitly asks for changes. For questions, feedback, or conversation, just reply in text without calling any tools.
- Never repeat or redo actions you already performed. Check the conversation history for previously executed actions.
- Use mwai_convert_block to change block types (e.g. paragraph to heading) or heading levels instead of removing and re-inserting.
- Use mwai_move_block to reorder blocks instead of removing and re-inserting.
- For image operations, first use mwai_search_media to find images, then use the returned media ID with mwai_set_featured_image or mwai_insert_image_block.
- To reference existing posts (e.g. for style, structure, or content), use mwai_search_posts to find them, then mwai_get_post_content to read their content.`;

const SYSTEM_PROMPT_FREE = `You are an AI writing assistant integrated into the WordPress block editor. You help the user improve their post content by providing recommendations, suggestions, and feedback.

You cannot modify the post directly. Instead, provide clear and actionable recommendations that the user can apply themselves.

Important guidelines:
- When suggesting text changes, quote the original text and provide the improved version.
- Offer specific, constructive feedback on tone, clarity, SEO, structure, and readability.
- Keep your suggestions concise and practical.
- You can suggest new paragraphs, title changes, structural improvements, etc.
- Format suggestions clearly so the user can easily copy and apply them.`;

const SYSTEM_PROMPT = isRegistered ? SYSTEM_PROMPT_PRO : SYSTEM_PROMPT_FREE;

const SidebarPanel = styled.div`
  position: fixed;
  top: ${PADDING}px;
  right: ${PADDING}px;
  bottom: ${PADDING}px;
  width: ${PANEL_WIDTH}px;
  z-index: 9998;
  background: #fff;
  border-radius: ${BORDER_RADIUS}px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.15);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, sans-serif;
  animation: ${p => p.$closing ? 'mwai-panel-out' : 'mwai-panel-in'} 0.3s ease forwards;

  @keyframes mwai-panel-in {
    from { transform: translateX(20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes mwai-panel-out {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(20px); opacity: 0; }
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;

  .mwai-header-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #1e1e1e;
  }

  .mwai-header-title img {
    width: 20px;
    height: 20px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #757575;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: #f0f0f0;
    color: #1e1e1e;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const EnvRow = styled.div`
  padding: 10px 14px;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
  display: flex;
  gap: 8px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
`;

const MessageBubble = styled.div`
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 90%;
  word-wrap: break-word;
  font-size: 13px;
  line-height: 1.5;

  ${props => props.$role === 'user' ? `
    align-self: flex-end;
    background: #007cba;
    color: white;
  ` : `
    align-self: flex-start;
    background: #f0f0f0;
    color: #1e1e1e;
  `}

  p { margin: 0 0 8px; &:last-child { margin-bottom: 0; } }
  ul, ol { margin: 4px 0; padding-left: 20px; list-style: revert; }
  li { margin: 2px 0; }
  code { background: rgba(0,0,0,0.08); padding: 1px 4px; border-radius: 3px; font-size: 12px; }
  pre { background: rgba(0,0,0,0.08); padding: 8px; border-radius: 4px; overflow-x: auto;
    code { background: none; padding: 0; } }
  strong { font-weight: 600; }
`;

const InputContainer = styled.div`
  padding: 10px 14px 14px;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
`;

const InputRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 6px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 8px 8px 8px 12px;
  background: #fff;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus-within {
    border-color: #a0c4e8;
    box-shadow: 0 0 0 2px rgba(30, 58, 95, 0.08);
  }

  textarea {
    flex: 1;
    border: none !important;
    background: transparent !important;
    font-size: 13px;
    font-family: inherit;
    line-height: 1.5;
    resize: none;
    overflow: hidden;
    outline: none !important;
    padding: 2px 0;
    min-height: 20px;
    max-height: 120px;
    color: #1e1e1e;
    box-shadow: none !important;

    &::placeholder { color: #aaa; }
    &:disabled { opacity: 0.5; }
  }
`;

const SendButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: ${ACCENT_COLOR};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity 0.15s;
  margin-bottom: 1px;

  &:hover { opacity: 0.7; }
  &:disabled { opacity: 0.2; cursor: default; }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const WelcomeContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  color: #757575;
  gap: 12px;
`;

const WelcomeIcon = styled.img`
  width: 48px;
  height: 48px;
  opacity: 0.7;
`;

const ActionsSummary = styled.div`
  font-size: 11px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  color: #666;
  line-height: 1.4;

  .action-row {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 1px 0;
  }

  .action-icon {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
  }
`;

const ToggleFab = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100000;
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  animation: mwai-fab-in 0.3s ease forwards;
  filter: drop-shadow(0 0px 15px rgba(0, 0, 0, 0.2));

  @keyframes mwai-fab-in {
    from { transform: scale(0.5); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  &:hover {
    transform: scale(1.12);
  }

  img {
    width: 48px;
    height: 48px;
  }
`;

const TypingDots = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 0;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #999;
    animation: typingBounce 1.2s ease-in-out infinite;
  }
  span:nth-child(2) { animation-delay: 0.15s; }
  span:nth-child(3) { animation-delay: 0.3s; }

  @keyframes typingBounce {
    0%, 60%, 100% { opacity: 0.3; transform: translateY(0); }
    30% { opacity: 1; transform: translateY(-3px); }
  }
`;

const ActionIcon = ( { name, success } ) => {
  if ( !success ) {
    return (
      <svg className="action-icon" viewBox="0 0 16 16" fill="none" stroke="#c00" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6.5" /><path d="M5.5 5.5l5 5M10.5 5.5l-5 5" />
      </svg>
    );
  }
  if ( name === 'mwai_insert_block' || name === 'mwai_insert_image_block' ) {
    return (
      <svg className="action-icon" viewBox="0 0 16 16" fill="none" stroke="#2e7d32" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6.5" /><path d="M8 5v6M5 8h6" />
      </svg>
    );
  }
  if ( name === 'mwai_remove_block' ) {
    return (
      <svg className="action-icon" viewBox="0 0 16 16" fill="none" stroke="#c62828" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="8" cy="8" r="6.5" /><path d="M5 8h6" />
      </svg>
    );
  }
  if ( name === 'mwai_move_block' ) {
    return (
      <svg className="action-icon" viewBox="0 0 16 16" fill="none" stroke="#1565c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v12M5.5 4.5L8 2l2.5 2.5M5.5 11.5L8 14l2.5-2.5" />
      </svg>
    );
  }
  if ( name === 'mwai_search_posts' || name === 'mwai_get_post_content' ) {
    return (
      <svg className="action-icon" viewBox="0 0 16 16" fill="none" stroke="#1565c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" />
      </svg>
    );
  }
  if ( name === 'mwai_search_media' || name === 'mwai_set_featured_image' ) {
    return (
      <svg className="action-icon" viewBox="0 0 16 16" fill="none" stroke="#7b1fa2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="12" height="12" rx="1.5" /><circle cx="5.5" cy="5.5" r="1.5" /><path d="M14 10l-3-3-5 5" />
      </svg>
    );
  }
  if ( name === 'mwai_set_categories' || name === 'mwai_set_tags' ) {
    return (
      <svg className="action-icon" viewBox="0 0 16 16" fill="none" stroke="#1565c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8.5V3a1 1 0 011-1h5.5l5.5 5.5-5.5 5.5L2 8.5z" /><circle cx="5.5" cy="5.5" r="1" fill="#1565c0" />
      </svg>
    );
  }
  return (
    <svg className="action-icon" viewBox="0 0 16 16" fill="none" stroke="#1565c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 3.5l3 3M4 9l-1 4 4-1 7-7-3-3-7 7z" />
    </svg>
  );
};

const markdownOptions = {
  forceBlock: false,
  forceInline: false,
  overrides: {
    a: {
      component: ( { children, ...props } ) => (
        <a {...props} target="_blank" rel="noopener noreferrer">{children}</a>
      ),
    },
  },
};

const renderMarkdown = ( content ) => {
  if ( !content ) {
    return null;
  }
  try {
    return markdownCompiler( content, markdownOptions );
  }
  catch {
    return content;
  }
};

const stripWrappingPTags = ( html ) => {
  const trimmed = ( html || '' ).trim();
  const match = trimmed.match( /^<p>([\s\S]*)<\/p>$/i );
  return match ? match[1] : trimmed;
};

const createBlockFromHTML = ( html ) => {
  const trimmed = ( html || '' ).trim();
  try {
    const blocks = wp.blocks.rawHandler( { HTML: trimmed } );
    if ( blocks.length > 0 ) {
      return blocks;
    }
  }
  catch ( err ) {
    console.warn( `${LOG_PREFIX} rawHandler failed, falling back to paragraph:`, err );
  }
  return [ wp.blocks.createBlock( 'core/paragraph', { content: stripWrappingPTags( trimmed ) } ) ];
};

const htmlToText = ( html ) => {
  if ( !html ) return '';
  return html
    .replace( /<\/?(h([1-6]))[^>]*>/gi, ( m, _tag, level ) => m.startsWith( '</' ) ? '\n' : '\n' + '#'.repeat( +level ) + ' ' )
    .replace( /<\/?p[^>]*>/gi, '\n' )
    .replace( /<br\s*\/?>/gi, '\n' )
    .replace( /<li[^>]*>/gi, '\n- ' )
    .replace( /<[^>]*>/g, '' )
    .replace( /&nbsp;/g, ' ' )
    .replace( /&amp;/g, '&' )
    .replace( /&lt;/g, '<' )
    .replace( /&gt;/g, '>' )
    .replace( /\n{3,}/g, '\n\n' )
    .trim();
};

const editorTools = {
  mwai_update_title: ( args ) => {
    const { title } = args;
    if ( title == null ) {
      return { success: false, message: 'Title is required.' };
    }
    wp.data.dispatch( 'core/editor' ).editPost( { title } );
    console.log( `${LOG_PREFIX} Updated title to: "${title}"` );
    return { success: true, message: `Title updated to "${title}".` };
  },

  mwai_replace_block: ( args ) => {
    const { blockIndex } = args;
    const blocks = wp.data.select( 'core/block-editor' ).getBlocks();
    const index = parseInt( blockIndex, 10 );
    if ( index < 0 || index > blocks.length ) {
      console.warn( `${LOG_PREFIX} Block index ${index} is out of range (${blocks.length} blocks).` );
      return { success: false, message: `Block index ${index} is out of range. There are ${blocks.length} blocks.` };
    }
    const block = blocks[index];
    const blockType = block.name;
    const newBlocks = createBlockFromHTML( args.newContent || '' );
    const newTypes = newBlocks.map( b => b.name.replace( 'core/', '' ) ).join( ', ' );
    console.log( `${LOG_PREFIX} Replacing block [${index}] (${blockType}) with [${newTypes}]` );
    wp.data.dispatch( 'core/block-editor' ).replaceBlock( block.clientId, newBlocks );
    if ( newBlocks[0]?.clientId ) {
      wp.data.dispatch( 'core/block-editor' ).selectBlock( newBlocks[0].clientId );
    }
    if ( newBlocks.length === 1 && newBlocks[0].name === blockType ) {
      return { success: true, message: `Replaced block [${index}] (${blockType}).` };
    }
    return { success: true, message: `Replaced block [${index}] (${blockType} → ${newTypes}).` };
  },

  mwai_insert_block: ( args ) => {
    const { position, referenceBlockIndex } = args;
    const blocks = wp.data.select( 'core/block-editor' ).getBlocks();
    const newBlocks = createBlockFromHTML( args.content );
    let insertIndex;
    if ( position === 'start' ) {
      insertIndex = 1;
    }
    else if ( position === 'end' ) {
      insertIndex = blocks.length - 1;
    }
    else if ( position === 'before' ) {
      insertIndex = parseInt( referenceBlockIndex, 10 ) - 1;
    }
    else if ( position === 'after' ) {
      insertIndex = parseInt( referenceBlockIndex, 10 );
    }
    else {
      insertIndex = blocks.length;
    }
    if ( insertIndex < 0 ) {
      insertIndex = 0;
    }
    const blockTypes = newBlocks.map( b => b.name.replace( 'core/', '' ) ).join( ', ' );
    console.log( `${LOG_PREFIX} Inserting ${newBlocks.length} block(s) [${blockTypes}] at index ${insertIndex} (position: ${position})` );
    wp.data.dispatch( 'core/block-editor' ).insertBlocks( newBlocks, insertIndex );
    return { success: true, message: `Inserted ${blockTypes} at position ${insertIndex}.` };
  },

  mwai_remove_block: ( args ) => {
    const { blockIndex } = args;
    const blocks = wp.data.select( 'core/block-editor' ).getBlocks();
    const index = parseInt( blockIndex, 10 );
    if ( index < 0 || index > blocks.length ) {
      console.warn( `${LOG_PREFIX} Block index ${index} is out of range (${blocks.length} blocks).` );
      return { success: false, message: `Block index ${index} is out of range.` };
    }
    const blockType = blocks[index]?.name;
    console.log( `${LOG_PREFIX} Removing block [${index}] (${blockType})` );
    if ( blocks[index] ) {
      wp.data.dispatch( 'core/block-editor' ).removeBlock( blocks[index].clientId );
    }
    const remaining = wp.data.select( 'core/block-editor' ).getBlocks();
    if ( remaining.length > 0 && index - 1 >= 0 ) {
      const nearest = Math.min( index - 1, remaining.length - 1 );
      wp.data.dispatch( 'core/block-editor' ).selectBlock( remaining[nearest].clientId );
    }
    return { success: true, message: `Removed block [${index}] (${blockType}).` };
  },

  mwai_move_block: ( args ) => {
    const { fromIndex, toIndex } = args;
    const blocks = wp.data.select( 'core/block-editor' ).getBlocks();
    const from = parseInt( fromIndex, 10 );
    const to = parseInt( toIndex, 10 ) + 1;
    if ( from < 0 || from >= blocks.length ) {
      return { success: false, message: `Source index ${from} is out of range (${blocks.length} blocks).` };
    }
    if ( to < 0 || to >= blocks.length + 1 ) {
      return { success: false, message: `Target index ${to} is out of range.` };
    }
    const block = blocks[from];
    const rootClientId = wp.data.select( 'core/block-editor' ).getBlockRootClientId( block.clientId ) || '';
    console.log( `${LOG_PREFIX} Moving block [${from}] to [${to}]` );
    wp.data.dispatch( 'core/block-editor' ).moveBlockToPosition( block.clientId, rootClientId, rootClientId, to );
    return { success: true, message: `Moved block from [${from}] to [${to}].` };
  },

  mwai_convert_block: ( args ) => {
    const { blockIndex, targetType, attributes: attrsJson } = args;
    const blocks = wp.data.select( 'core/block-editor' ).getBlocks();
    const index = parseInt( blockIndex, 10 );
    if ( index < 0 || index > blocks.length ) {
      return { success: false, message: `Block index ${index} is out of range.` };
    }
    const block = blocks[index];
    const fullTarget = targetType.includes( '/' ) ? targetType : `core/${targetType}`;
    let attrs = {};
    if ( attrsJson ) {
      try { attrs = typeof attrsJson === 'string' ? JSON.parse( attrsJson ) : attrsJson; }
      catch { return { success: false, message: 'Invalid attributes JSON.' }; }
    }
    if ( block.name === fullTarget ) {
      if ( Object.keys( attrs ).length > 0 ) {
        wp.data.dispatch( 'core/block-editor' ).updateBlockAttributes( block.clientId, attrs );
        console.log( `${LOG_PREFIX} Updated attributes of block [${index}] (${targetType})` );
        return { success: true, message: `Updated ${targetType} block [${index}] attributes.` };
      }
      return { success: false, message: `Block [${index}] is already ${targetType}.` };
    }
    const newBlocks = wp.blocks.switchToBlockType( block, fullTarget ) || [];
    if ( newBlocks.length === 0 ) {
      return { success: false, message: `Cannot convert ${block.name.replace( 'core/', '' )} to ${targetType}.` };
    }
    if ( Object.keys( attrs ).length > 0 && newBlocks.length > 0 ) {
      Object.assign( newBlocks[0].attributes, attrs );
    }
    console.log( `${LOG_PREFIX} Converting block [${index}] from ${block.name} to ${fullTarget}` );
    wp.data.dispatch( 'core/block-editor' ).replaceBlock( block.clientId, newBlocks );
    return { success: true, message: `Converted block [${index}] to ${targetType}.` };
  },

  mwai_search_media: async ( args ) => {
    const { query } = args;
    try {
      const results = await wp.apiFetch( {
        path: `/wp/v2/media?search=${encodeURIComponent( query )}&per_page=3&media_type=image`,
      } );
      if ( !results || results.length === 0 ) {
        return { success: false, message: `No images found for "${query}".` };
      }
      const items = results.map( m =>
        `ID:${m.id} "${m.title?.rendered || m.slug}" (${m.source_url})`
      );
      console.log( `${LOG_PREFIX} Media search "${query}": found ${results.length} result(s)` );
      return { success: true, message: `Found ${results.length} image(s):\n${items.join( '\n' )}` };
    }
    catch ( err ) {
      return { success: false, message: `Media search failed: ${err.message}` };
    }
  },

  mwai_set_featured_image: ( args ) => {
    const { mediaId } = args;
    const id = parseInt( mediaId, 10 );
    wp.data.dispatch( 'core/editor' ).editPost( { featured_media: id || 0 } );
    if ( !id ) {
      console.log( `${LOG_PREFIX} Set featured image to media ID ${id}` );
      return { success: true, message: `Featured image set to media ID ${id}.` };
    }
    console.log( `${LOG_PREFIX} Removed featured image` );
    return { success: true, message: 'Featured image removed.' };
  },

  mwai_insert_image_block: async ( args ) => {
    const { mediaId, position, referenceBlockIndex, alt, caption } = args;
    const id = parseInt( mediaId, 10 );
    try {
      const media = await wp.apiFetch( { path: `/wp/v2/media/${id}` } );
      if ( !media ) {
        return { success: false, message: `Media ID ${id} not found.` };
      }
      const imageBlock = wp.blocks.createBlock( 'core/image', {
        id: media.id,
        url: media.source_url,
        alt: caption || media.alt_text || '',
        caption: alt || '',
      } );
      const blocks = wp.data.select( 'core/block-editor' ).getBlocks();
      let insertIndex;
      if ( position === 'start' ) insertIndex = 0;
      else if ( position === 'end' ) insertIndex = blocks.length + 1;
      else if ( position === 'before' ) insertIndex = parseInt( referenceBlockIndex, 10 ) - 1;
      else if ( position === 'after' ) insertIndex = parseInt( referenceBlockIndex, 10 );
      else insertIndex = blocks.length;
      console.log( `${LOG_PREFIX} Inserting image block (media ${id}) at index ${insertIndex}` );
      wp.data.dispatch( 'core/block-editor' ).insertBlocks( [ imageBlock ], insertIndex );
      return { success: true, message: `Inserted image "${media.title?.rendered || media.slug}" at position ${insertIndex}.` };
    }
    catch ( err ) {
      return { success: false, message: `Failed to insert image: ${err.message}` };
    }
  },

  mwai_update_excerpt: ( args ) => {
    const { excerpt } = args;
    wp.data.dispatch( 'core/editor' ).editPost( { excerpt } );
    console.log( `${LOG_PREFIX} Updated excerpt` );
    return { success: true, message: 'Excerpt updated.' };
  },

  mwai_update_slug: ( args ) => {
    const { slug } = args;
    wp.data.dispatch( 'core/editor' ).editPost( { slug: slug?.trim() || '' } );
    console.log( `${LOG_PREFIX} Updated slug to "${slug}"` );
    return { success: true, message: `Slug updated to "${slug}".` };
  },

  mwai_update_status: ( args ) => {
    const { status } = args;
    const valid = [ 'draft', 'publish', 'pending', 'private' ];
    if ( !valid.includes( status ) ) {
      return { success: false, message: `Invalid status "${status}". Valid: ${valid.join( ', ' )}.` };
    }
    if ( status === 'publish' ) {
      return { success: false, message: 'Direct publish not allowed from assistant.' };
    }
    wp.data.dispatch( 'core/editor' ).editPost( { status } );
    console.log( `${LOG_PREFIX} Updated status to "${status}"` );
    return { success: true, message: `Post status changed to "${status}".` };
  },

  mwai_set_categories: async ( args ) => {
    const { categories: catString } = args;
    const names = catString.split( ',' ).map( s => s.trim() ).filter( Boolean );
    if ( names.length === 0 ) {
      return { success: false, message: 'No category names provided.' };
    }
    try {
      const allCategories = await wp.apiFetch( { path: '/wp/v2/categories?per_page=100' } );
      const ids = [];
      const notFound = [];
      for ( const name of names ) {
        const found = allCategories.find( c => c.name.toLowerCase() == name.toLowerCase() );
        if ( found ) { ids.push( found.id ); }
        else { notFound.push( name ); }
      }
      if ( ids.length === 0 ) {
        return { success: false, message: `No matching categories found. Not found: ${notFound.join( ', ' )}.` };
      }
      const existing = wp.data.select( 'core/editor' ).getEditedPostAttribute( 'categories' ) || [];
      wp.data.dispatch( 'core/editor' ).editPost( { categories: [ ...existing, ...ids ] } );
      let msg = `Set ${ids.length} categor${ids.length === 1 ? 'y' : 'ies'}.`;
      if ( notFound.length > 0 ) msg += ` Not found: ${notFound.join( ', ' )}.`;
      console.log( `${LOG_PREFIX} ${msg}` );
      return { success: true, message: msg };
    }
    catch ( err ) {
      return { success: false, message: `Failed to set categories: ${err.message}` };
    }
  },

  mwai_set_tags: async ( args ) => {
    const { tags: tagString } = args;
    const names = tagString.split( ',' ).map( s => s.trim() ).filter( Boolean );
    if ( names.length === 0 ) {
      return { success: false, message: 'No tag names provided.' };
    }
    try {
      const tagIds = [];
      for ( const name of names ) {
        const existing = await wp.apiFetch( {
          path: `/wp/v2/tags?search=${encodeURIComponent( name )}&per_page=10`,
        } );
        const exact = existing?.filter( t => t.name.toLowerCase() === name.toLowerCase() );
        if ( exact && exact[0] ) {
          tagIds.push( exact[0].id );
        }
        else {
          const created = await wp.apiFetch( { path: '/wp/v2/tags', method: 'POST', data: { name } } );
          tagIds.push( created.id );
        }
      }
      wp.data.dispatch( 'core/editor' ).editPost( { tags: tagIds } );
      console.log( `${LOG_PREFIX} Set ${tagIds.length} tag(s): ${names.join( ', ' )}` );
      return { success: true, message: `Set ${tagIds.length} tag(s): ${names.join( ', ' )}.` };
    }
    catch ( err ) {
      return { success: false, message: `Failed to set tags: ${err.message}` };
    }
  },

  mwai_search_posts: async ( args ) => {
    const { query, postType } = args;
    const endpoint = postType === 'page' ? 'pages' : 'posts';
    try {
      const results = await wp.apiFetch( {
        path: `/wp/v2/${endpoint}?search=${encodeURIComponent( query )}&per_page=5&_fields=id,title,date,excerpt`,
      } );
      if ( !results || results.length === 0 ) {
        return { success: false, message: `No ${endpoint} found for "${query}".` };
      }
      const items = results.map( p => {
        const title = p.title?.rendered || '(untitled)';
        const date = p.date?.split( 'T' )[0] || '';
        const snippet = htmlToText( p.excerpt?.rendered ).substring( 0, 80 );
        return `ID:${p.id} "${title}" (${date})${snippet ? ` - ${snippet}` : ''}`;
      } );
      console.log( `${LOG_PREFIX} Post search "${query}": found ${results.length} result(s)` );
      return { success: true, message: `Found ${results.length} result(s):\n${items.join( '\n' )}` };
    }
    catch ( err ) {
      return { success: false, message: `Post search failed: ${err.message}` };
    }
  },

  mwai_get_post_content: async ( args ) => {
    const { postId, postType } = args;
    const id = parseInt( postId, 10 );
    const endpoint = postType === 'page' ? 'pages' : 'posts';
    try {
      const post = await wp.apiFetch( { path: `/wp/v2/${endpoint}/${id}` } );
      if ( !post ) {
        return { success: false, message: `Post ID ${id} not found.` };
      }
      const title = post.title?.rendered || '(untitled)';
      const excerpt = htmlToText( post.excerpt?.rendered );
      const content = htmlToText( post.content?.rendered );
      const maxLen = 2000;
      const truncated = content.length >= maxLen
        ? content.substring( 0, maxLen ) + '\n...(truncated)'
        : content;
      let result = `Title: ${title}\n`;
      if ( excerpt ) result += `Excerpt: ${excerpt}\n`;
      result += `\nContent:\n${truncated}`;
      console.log( `${LOG_PREFIX} Retrieved post ${id}: "${title}" (${content.length} chars)` );
      return { success: true, message: result, displayMessage: `Retrieved "${title}" (${content.length} chars)` };
    }
    catch ( err ) {
      return { success: false, message: `Failed to get post: ${err.message}` };
    }
  },
};

const handleActions = async ( actions ) => {
  if ( !actions || !actions.length ) {
    console.log( `${LOG_PREFIX} No actions to execute.` );
    return { count: 0, results: [] };
  }
  console.log( `${LOG_PREFIX} Processing ${actions.length} action(s)...` );

  const insertOffsets = new Map();

  const results = [];
  for ( const action of actions ) {
    if ( action.type === 'function' ) {
      const { name, args, toolId } = action.data || {};
      let execArgs = args;

      if ( ( name === 'mwai_insert_block' || name === 'mwai_insert_image_block' ) && args ) {
        const pos = args.position;
        const ref = parseInt( args.referenceBlockIndex ?? -1, 10 );
        const key = `${pos}:${ref}`;
        const offset = insertOffsets.get( key ) || 0;
        if ( offset > 0 && pos !== 'end' ) {
          execArgs = { ...args };
          if ( pos === 'after' || pos === 'before' ) {
            execArgs.referenceBlockIndex = ref - offset;
          }
          else if ( pos === 'start' ) {
            execArgs.position = 'after';
            execArgs.referenceBlockIndex = offset;
          }
        }
        insertOffsets.set( key, offset + 1 );
      }

      console.log( `${LOG_PREFIX} Action: ${name} (toolId: ${toolId})`, execArgs );
      if ( name && editorTools[name] ) {
        try {
          const result = await editorTools[name]( execArgs );
          results.push( { name, toolId, ...result } );
        }
        catch ( err ) {
          console.error( `${LOG_PREFIX} Error executing ${name}:`, err );
          results.push( { name, toolId, success: false, message: `Error: ${err.message}` } );
        }
      }
      else {
        console.warn( `${LOG_PREFIX} Unknown tool: ${name}` );
        results.push( { name, toolId, success: false, message: `Unknown tool: ${name}` } );
      }
    }
  }
  const successCount = results.filter( r => r.success === true ).length;
  console.log( `${LOG_PREFIX} Actions complete: ${successCount}/${results.length} succeeded.` );
  return { count: results.length, results };
};

const getBlockText = ( block ) => {
  const attrs = block.attributes || {};
  if ( block.name === 'core/image' ) {
    const parts = [];
    if ( attrs.alt ) parts.push( `alt="${attrs.alt}"` );
    if ( attrs.caption ) parts.push( `caption="${attrs.caption}"` );
    return parts.join( ' ' ) || '(image)';
  }
  if ( block.name === 'core/embed' ) {
    return attrs.url || '(embed)';
  }
  if ( attrs.content ) {
    const tmp = document.createElement( 'span' );
    tmp.innerHTML = attrs.content;
    return tmp.textContent || tmp.innerText || '';
  }
  if ( block.innerBlocks && block.innerBlocks.length >= 0 ) {
    return block.innerBlocks.map( b => getBlockText( b ) ).join( '\n' );
  }
  return '';
};

const extractPostContent = () => {
  const editor = wp.data.select( 'core/editor' );
  const title = editor.getEditedPostAttribute( 'title' );
  const status = editor.getEditedPostAttribute( 'status' );
  const slug = editor.getEditedPostAttribute( 'slug' );
  const excerpt = editor.getEditedPostAttribute( 'excerpt' );
  const featuredMediaId = editor.getEditedPostAttribute( 'featured_media' );

  let content = `Title: ${title || '(untitled)'}\n`;
  content += `Status: ${status || 'draft'}\n`;
  if ( slug ) content += `Slug: ${slug}\n`;
  if ( excerpt ) content += `Excerpt: ${excerpt.rendered || excerpt}\n`;

  if ( featuredMediaId ) {
    const media = wp.data.select( 'core' ).getMedia( featuredMediaId );
    content += `Featured Image: ${media?.title?.rendered || `ID:${featuredMediaId}`}\n`;
  }

  const categoryIds = editor.getEditedPostAttribute( 'categories' ) || [];
  if ( categoryIds.length > 0 ) {
    const cats = categoryIds.map( id => {
      const term = wp.data.select( 'core' ).getEntityRecord( 'taxonomy', 'category', id );
      return term?.slug || `ID:${id}`;
    });
    content += `Categories: ${cats.join( ', ' )}\n`;
  }

  const tagIds = editor.getEditedPostAttribute( 'tags' ) || [];
  if ( tagIds.length > 0 ) {
    const tags = tagIds.map( id => {
      const term = wp.data.select( 'core' ).getEntityRecord( 'taxonomy', 'post_tag', id );
      return term?.slug || `ID:${id}`;
    });
    content += `Tags: ${tags.join( ', ' )}\n`;
  }

  content += `\nBlocks:\n`;
  const blocks = wp.data.select( 'core/block-editor' ).getBlocks();
  blocks.forEach( ( block, index ) => {
    const type = block.name.replace( 'core/', '' );
    const attrs = block.attributes || {};
    let line = `[${index}] ${type}`;
    if ( type === 'heading' && attrs.level ) line += `(h${attrs.level})`;
    if ( type === 'image' && attrs.id ) line += `(media:${attrs.id})`;
    if ( type === 'embed' && attrs.providerNameSlug ) line += `(${attrs.providerNameSlug})`;
    const text = getBlockText( block );
    if ( text ) line += `: ${text}`;
    content += line + '\n';
  });
  return content;
};

const STORAGE_KEY_PREFIX = 'mwai_assistant_';

const EditorAssistantPanel = () => {
  const postId = wp.data.select( 'core/editor' ).getCurrentPostId();
  const storageKey = `${STORAGE_KEY_PREFIX}${postId}`;

  const savedSession = useRef( null );
  if ( savedSession.current === null ) {
    try {
      const raw = sessionStorage.getItem( storageKey );
      savedSession.current = raw ? JSON.parse( raw ) : {};
    }
    catch {
      savedSession.current = {};
    }
  }

  const [ messages, setMessages ] = useState( savedSession.current.messages || [] );
  const [ input, setInput ] = useState( '' );
  const [ loading, setLoading ] = useState( false );
  const [ envId, setEnvId ] = useState( savedSession.current.envId || '' );
  const [ model, setModel ] = useState( savedSession.current.model || '' );
  const messagesEndRef = useRef( null );
  const chatIdRef = useRef( savedSession.current.chatId || `mwai-assistant-${postId}` );

  useEffect( () => {
    try {
      localStorage.setItem( storageKey, JSON.stringify( {
        messages,
        chatId: chatIdRef.current,
        envId,
        model,
      } ) );
    }
    catch {}
  }, [ messages, envId, model, storageKey ] );

  const aiEnvs = options?.ai_envs ?? [];
  const { completionModels } = useModels( options, envId || null );

  useEffect( () => {
    if ( model && completionModels.length > 0 ) {
      const exists = completionModels.some( m => m.model == model );
      if ( !exists ) { setModel( '' ); }
    }
  }, [ envId, completionModels, model ] );

  useEffect( () => {
    if ( messagesEndRef.current ) {
      messagesEndRef.current.scrollIntoView( { behavior: 'auto' } );
    }
  }, [ messages.length ] );

  useEffect( () => {
    const html = document.documentElement;
    if ( !loading ) {
      html.classList.add( BUSY_CLASS );
    }
    else {
      html.classList.remove( BUSY_CLASS );
    }
    return () => html.classList.remove( BUSY_CLASS );
  }, [ loading ] );

  const sendMessage = useCallback( async () => {
    const trimmed = input.trim();
    if ( !trimmed && loading ) {
      return;
    }

    const userMessage = { role: 'user', content: trimmed };
    setMessages( prev => [ ...prev, userMessage ] );
    setInput( '' );
    setLoading( true );

    try {
      const postContent = extractPostContent();
      const instructions = `${SYSTEM_PROMPT}\n\nCurrent post content (may be outdated):\n${postContent}`;
      const serverMessages = messages.map( m => {
        let content = m.content || '';
        if ( m.role === 'assistant' && m.actionResults?.length > 0 ) {
          const summary = m.actionResults.map( r =>
            `[${r.success ? 'Done' : 'Failed'}] ${r.name}: ${r.message}`
          ).join( '\n' );
          content += ( content ? '\n\n' : '' ) + 'Actions performed:\n' + summary;
        }
        return { role: m.role === 'system' ? 'assistant' : m.role, content };
      });

      console.log( `${LOG_PREFIX} Sending message: "${trimmed}"` );
      console.log( `${LOG_PREFIX} Post context:\n${postContent}` );

      let res = await nekoFetch( `${restUrl}/mwai-ui/v1/editor/submit`, {
        method: 'POST',
        nonce: getRestNonce(),
        json: {
          newMessage: trimmed,
          chatId: chatIdRef.current,
          envId: envId || undefined,
          model: model || undefined,
          instructions,
          messages: serverMessages,
        },
      });

      if ( res?.new_token ) {
        updateRestNonce( res.new_token );
      }

      console.log( `${LOG_PREFIX} Response:`, {
        reply: res?.reply,
        actions: res?.actions?.length ?? 0,
        feedbackId: res?.feedbackId,
      });

      let allActionResults = [];
      let loopCount = 0;
      const maxLoops = 3;

      while ( res?.actions?.length > 0 && res?.feedbackId && loopCount <= maxLoops ) {
        loopCount++;
        console.log( `${LOG_PREFIX} Feedback loop #${loopCount}: executing ${res.actions.length} action(s)` );

        const { results: actionResults } = await handleActions( res.actions );
        allActionResults.push( ...actionResults );

        const updatedPostContent = extractPostContent();
        const feedbackResults = actionResults.map( ( r, i ) => ({
          toolId: r.toolId,
          result: r.message + ( i === 0
            ? `\n\nUpdated post content:\n${updatedPostContent}`
            : '' ),
        }));

        console.log( `${LOG_PREFIX} Sending feedback (${feedbackResults.length} results) for session ${res.feedbackId}` );

        res = await nekoFetch( `${restUrl}/mwai-ui/v1/editor/feedback`, {
          method: 'POST',
          nonce: getRestNonce(),
          json: {
            feedbackId: res.feedbackId,
            results: feedbackResults,
          },
        });

        if ( res?.new_token ) {
          updateRestNonce( res.new_token );
        }

        console.log( `${LOG_PREFIX} Feedback response:`, {
          reply: res?.reply,
          actions: res?.actions?.length ?? 0,
          feedbackId: res?.feedbackId,
        });
      }

      if ( res?.actions?.length > 0 && !res?.feedbackId ) {
        const { results: actionResults } = await handleActions( res.actions );
        allActionResults.push( ...actionResults );
      }

      const reply = res?.reply || '';
      const assistantMessage = { role: 'assistant', content: reply || '(no response)' };
      if ( allActionResults.length > 0 ) {
        assistantMessage.actionResults = allActionResults;
      }
      setMessages( [ ...messages, assistantMessage ] );
    }
    catch ( err ) {
      console.error( `${LOG_PREFIX} Request failed:`, err );
      setMessages( prev => [ ...prev, {
        role: 'assistant',
        content: `Error: ${err.message || 'Something went wrong.'}`,
      }]);
    }
    finally {
      setLoading( false );
    }
  }, [ input, loading, messages, envId, model ] );

  const clearConversation = useCallback( () => {
    setMessages( [] );
    chatIdRef.current = `mwai-assistant-${postId}-${Date.now()}`;
    try { sessionStorage.removeItem( storageKey ); } catch {}
    console.log( `${LOG_PREFIX} Conversation cleared.` );
  }, [ postId, storageKey ] );

  return (
    <>
      <EnvRow>
        <div style={{ flex: 1, minWidth: 0 }}>
          <NekoSelect scrolldown={false} name="envId" value={envId} onChange={( value ) => { setEnvId( value ); setModel( '' ); }}>
            <NekoOption value="" label="Default" />
            {aiEnvs.filter( e => e.apikey !== undefined ).map( e => (
              <NekoOption key={e.id} value={e.id} label={e.name || e.id} />
            ))}
          </NekoSelect>
        </div>
        {envId && completionModels.length > 0 && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <NekoSelect scrolldown name="model" value={model} onChange={( value ) => setModel( value )}>
              <NekoOption value="" label="Default Model" />
              {completionModels.map( m => (
                <NekoOption key={m.model} value={m.model} label={m.rawName || m.name || m.model} />
              ))}
            </NekoSelect>
          </div>
        )}
      </EnvRow>

      {messages.length === 0 ? (
        <WelcomeContainer>
          <WelcomeIcon src={`${pluginUrl}/images/chat-nyao-3.svg`} alt="AI Assistant" />
          <div style={{ fontSize: 14, fontWeight: 500, color: '#1e1e1e' }}>
            AI Assistant
          </div>
          <div style={{ fontSize: 13, color: '#555', textAlign: 'center', lineHeight: 1.5 }}>
            {isRegistered
              ? 'Ask me to edit your post — rewrite paragraphs, add content, change the title, and more.'
              : <>Ask me for suggestions to improve your post. With the <a href="https://meowapps.com/products/ai-engine-pro/" target="_blank" rel="noopener noreferrer" style={{ color: '#007cba' }}>Pro versions</a>, the AI can edit your content directly.</>
            }
          </div>
        </WelcomeContainer>
      ) : (
        <MessagesContainer>
          {messages.map( ( msg, i ) => (
            <MessageBubble key={i} $role={msg.role}>
              {msg.content ? renderMarkdown( String( msg.content ) ) : (msg.actionResults ? '' : '...')}
              {msg.actionResults && (
                <ActionsSummary>
                  {msg.actionResults.map( ( r, j ) => (
                    <div key={j} className="action-row">
                      <ActionIcon name={r.name} success={r.success} />
                      <span>{r.displayMessage || r.message}</span>
                    </div>
                  ))}
                </ActionsSummary>
              )}
            </MessageBubble>
          ))}
          {loading && (
            <MessageBubble $role="assistant">
              <TypingDots><span /><span /><span /></TypingDots>
            </MessageBubble>
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>
      )}

      <InputContainer>
        <InputRow>
          <TextAreaAutosize
            value={input}
            onChange={( e ) => setInput( e.target.value ?? '' )}
            onKeyDown={( e ) => {
              if ( e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing ) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask anything..."
            disabled={loading && !isRegistered}
            maxRows={5}
          />
          <SendButton
            onClick={sendMessage}
            disabled={!isRegistered && (loading || !input.trim())}
            title="Send"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
            </svg>
          </SendButton>
        </InputRow>
      </InputContainer>

      {messages.length > 1 && (
        <div style={{ padding: '0 14px 10px', textAlign: 'center' }}>
          <button onClick={clearConversation} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#757575', fontSize: 12, padding: '4px 8px',
          }}>
            New conversation
          </button>
        </div>
      )}
    </>
  );
};

const LAYOUT_CLASS = 'mwai-assistant-open';
const ACTIVE_CLASS = 'mwai-assistant-active';
const BUSY_CLASS = 'mwai-assistant-busy';
const ANIM_DURATION = 250;

const EditorAssistantWrapper = () => {
  const [ phase, setPhase ] = useState( 'closed' );
  const rootEl = document.getElementById( 'mwai-editor-assistant-root' );

  useEffect( () => {
    document.documentElement.classList.add( ACTIVE_CLASS );
    return () => document.documentElement.classList.remove( ACTIVE_CLASS );
  }, [] );

  useEffect( () => {
    const html = document.documentElement;
    html.classList.toggle( LAYOUT_CLASS, phase !== 'closed' );
    return () => html.classList.remove( LAYOUT_CLASS );
  }, [ phase ] );

  const handleOpen = useCallback( () => setPhase( 'open' ), [] );
  const handleClose = useCallback( () => {
    setPhase( 'closing' );
    setTimeout( () => setPhase( 'closed' ), ANIM_DURATION + 100 );
  }, [] );

  if ( !rootEl ) {
    return null;
  }

  return createPortal(
    <>
      {phase === 'closed' && (
        <ToggleFab onClick={handleOpen} title="Open AI Assistant">
          <img src={`${pluginUrl}/images/chat-nyao-3.svg`} alt="AI Assistant" />
        </ToggleFab>
      )}
      {phase !== 'closed' && (
        <NekoUI>
          <SidebarPanel $closing={phase === 'closing'}>
            <SidebarHeader>
              <div className="mwai-header-title">
                <img src={`${pluginUrl}/images/chat-nyao-3.svg`} alt="" />
                AI Assistant
              </div>
              <CloseButton onClick={handleClose} title="Close panel">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </CloseButton>
            </SidebarHeader>
            <EditorAssistantPanel />
          </SidebarPanel>
        </NekoUI>
      )}
    </>,
    rootEl
  );
};

const EditorAssistant = () => {
  registerPlugin( 'mwai-editor-assistant', {
    render: () => <EditorAssistantWrapper />,
    icon: null,
  });
};

export default EditorAssistant;