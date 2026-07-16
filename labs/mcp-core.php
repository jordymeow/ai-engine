<?php

class Meow_MWAI_Labs_MCP_Core {
  private $core = null;

  #region Initialize
  public function __construct( $core ) {
    $this->core = $core;
    add_action( 'rest_api_init', [ $this, 'rest_api_init' ] );
  }
  public function rest_api_init() {
    add_filter( 'mwai_mcp_tools', [ $this, 'register_rest_tools' ] );
    add_filter( 'mwai_mcp_callback', [ $this, 'handle_call' ], 10, 4 );
  }
  #endregion

  #region Helpers
  private function add_result_text( array &$r, string $text ): void {
    if ( !isset( $r['result']['content'] ) ) {
      $r['result']['content'] = [];
    }
    $r['result']['content'][] = [ 'type' => 'text', 'text' => $text ];
  }
  private function clean_html( string $v ): string {
    return wp_kses_post( wp_unslash( $v ) );
  }

  // Store post_content/excerpt the way core does for an admin editing in wp-admin:
  // callers who can post unfiltered HTML (administrators on single-site, which is
  // how the MCP request is authenticated) keep their markup verbatim, so shortcode
  // attributes, email/Outlook MSO conditionals, and inline CSS survive. Lower-privilege
  // callers still get wp_kses_post(). Previously this always ran wp_kses_post(),
  // silently stripping that markup even for admin-authorized writes.
  private function store_html( string $v ): string {
    return current_user_can( 'unfiltered_html' ) ? $v : $this->clean_html( $v );
  }

  // Return stored post_content verbatim for read tools (wp_get_post, snapshot).
  // The DB value is NOT slashed, so clean_html()'s wp_unslash() would strip the
  // real backslash from block-JSON Unicode escapes (Gutenberg's \uXXXX form for
  // < and >, as Rank Math FAQ blocks use) and wp_kses_post() would drop the
  // admin-authored markup that store_html() preserved on write. A read must
  // round-trip losslessly through store_html(), so it returns the value as-is.
  private function read_html( string $v ): string {
    return $v;
  }

  // Prepare post_content for wp_create_post. If the caller already sent HTML,
  // Gutenberg blocks, or shortcodes, keep it as-is (sanitized like the update
  // path) instead of running the markdown parser. Parsedown would HTML-encode
  // the quotes in shortcode attributes ([x a="b"] -> a=&quot;b&quot;), auto-link
  // URLs, and <p>-wrap lines, silently breaking shortcode rendering. Markdown
  // conversion is reserved for plain prose with no existing markup.
  private function prepare_new_content( string $v ): string {
    $hasBlocks = strpos( $v, '<!-- wp:' ) !== false;
    $hasHtml = (bool) preg_match( '/<(?:p|div|h[1-6]|ul|ol|li|figure|table|blockquote|section|img|a|br|span|strong|em)\b[^>]*>/i', $v );
    // Generic shortcode detection (independent of whether the shortcode is
    // registered on THIS site): an attribute assignment inside brackets
    // [name attr="x"] or a closing [/name]. Deliberately does not match a
    // Markdown link [text](url), which has neither "=" nor a leading slash.
    $hasShortcode = (bool) preg_match( '/\[[a-zA-Z][\w-]*\s+[^\]]*?=[^\]]*\]|\[\/[a-zA-Z]/', $v );
    if ( $hasBlocks || $hasHtml || $hasShortcode ) {
      return $this->store_html( $v );
    }
    return $this->core->markdown_to_html( $v );
  }

  // Recursively blank out every block's attributes. Gallery/media blocks (e.g.
  // meow-gallery) store their whole image list as JSON in the block-delimiter
  // comment, which can be hundreds of KB and overflows the tool's token cap on
  // read. Keep the small delimiter marker and the inner prose/HTML.
  private function strip_block_attrs( array $blocks ): array {
    foreach ( $blocks as &$b ) {
      $b['attrs'] = [];
      if ( !empty( $b['innerBlocks'] ) ) {
        $b['innerBlocks'] = $this->strip_block_attrs( $b['innerBlocks'] );
      }
    }
    unset( $b );
    return $blocks;
  }

  // Return the post content with block-attribute JSON stripped, so a gallery-heavy
  // post collapses to its few KB of actual prose without re-rendering any block.
  private function prose_content( string $v ): string {
    // $v is raw post_content from get_post(), which is NOT slashed; wp_unslash()
    // here would strip the real backslash from block-JSON Unicode escapes (the
    // \uXXXX form Gutenberg uses for < and > in Rank Math FAQ etc.) and corrupt it.
    return trim( serialize_blocks( $this->strip_block_attrs( parse_blocks( $v ) ) ) );
  }
  private function post_excerpt( WP_Post $p ): string {
    return wp_trim_words( wp_strip_all_tags( $p->post_excerpt ?: $p->post_content ), 55 );
  }
  private function empty_schema(): array {
    return [ 'type' => 'object', 'properties' => (object) [] ];
  }

  // v1 block types accepted by wp_write_blocks. Kept intentionally small and
  // conservative: only core blocks whose canonical save markup is stable across
  // WP 6.x, so the output opens in the block editor without "invalid content"
  // warnings. The 'html' type is the escape hatch for anything not covered.
  private static $write_block_types = [
    'paragraph', 'heading', 'list', 'quote', 'image', 'buttons',
    'group', 'columns', 'separator', 'spacer', 'code', 'html',
  ];

  // Render a simplified block-spec array into canonical Gutenberg markup.
  // Returns [ markup, error ] with exactly one non-null. Aborts on the first bad
  // block so we never write a half-built page.
  private function blocks_to_markup( $blocks, string $path = 'blocks' ): array {
    if ( !is_array( $blocks ) || $blocks === [] ) {
      return [ null, $path . ' must be a non-empty array of block specs.' ];
    }
    $out = [];
    foreach ( $blocks as $i => $block ) {
      $at = $path . '[' . $i . ']';
      if ( !is_array( $block ) || empty( $block['type'] ) || !is_string( $block['type'] ) ) {
        return [ null, $at . ' is missing a string "type".' ];
      }
      if ( !in_array( $block['type'], self::$write_block_types, true ) ) {
        return [ null, $at . ' has unsupported type "' . $block['type'] . '". Supported: ' . implode( ', ', self::$write_block_types ) . '.' ];
      }
      list( $markup, $err ) = $this->render_block_spec( $block['type'], $block, $at );
      if ( $err !== null ) {
        return [ null, $err ];
      }
      $out[] = $markup;
    }
    return [ implode( "\n\n", $out ), null ];
  }

  // Build the canonical markup for one supported block. Returns [ markup, error ].
  private function render_block_spec( string $type, array $b, string $at ): array {
    switch ( $type ) {
      case 'paragraph':
        return [ "<!-- wp:paragraph -->\n<p>" . $this->clean_html( $b['content'] ?? '' ) . "</p>\n<!-- /wp:paragraph -->", null ];

      case 'heading':
        $level = isset( $b['level'] ) ? (int) $b['level'] : 2;
        if ( $level < 1 || $level > 6 ) {
          return [ null, $at . ' heading level must be between 1 and 6.' ];
        }
        $attrs = $level === 2 ? '' : ' ' . wp_json_encode( [ 'level' => $level ] );
        $text = $this->clean_html( $b['content'] ?? '' );
        return [ '<!-- wp:heading' . $attrs . " -->\n<h" . $level . ' class="wp-block-heading">' . $text . '</h' . $level . ">\n<!-- /wp:heading -->", null ];

      case 'list':
        $items = $b['items'] ?? null;
        if ( !is_array( $items ) || $items === [] ) {
          return [ null, $at . ' list requires a non-empty "items" array of strings.' ];
        }
        $ordered = !empty( $b['ordered'] );
        $tag = $ordered ? 'ol' : 'ul';
        $listAttrs = $ordered ? ' ' . wp_json_encode( [ 'ordered' => true ] ) : '';
        $lis = '';
        foreach ( $items as $it ) {
          $lis .= "<!-- wp:list-item -->\n<li>" . $this->clean_html( is_string( $it ) ? $it : '' ) . "</li>\n<!-- /wp:list-item -->\n";
        }
        return [ '<!-- wp:list' . $listAttrs . " -->\n<" . $tag . ' class="wp-block-list">' . rtrim( $lis, "\n" ) . '</' . $tag . ">\n<!-- /wp:list -->", null ];

      case 'quote':
        $qInner = "<!-- wp:paragraph -->\n<p>" . $this->clean_html( $b['content'] ?? '' ) . "</p>\n<!-- /wp:paragraph -->";
        $cite = ( isset( $b['citation'] ) && $b['citation'] !== '' ) ? '<cite>' . $this->clean_html( $b['citation'] ) . '</cite>' : '';
        return [ "<!-- wp:quote -->\n<blockquote class=\"wp-block-quote\">" . $qInner . $cite . "</blockquote>\n<!-- /wp:quote -->", null ];

      case 'image':
        $url = esc_url_raw( $b['url'] ?? '' );
        if ( $url === '' ) {
          return [ null, $at . ' image requires a "url".' ];
        }
        $alt = esc_attr( $b['alt'] ?? '' );
        $caption = ( isset( $b['caption'] ) && $b['caption'] !== '' ) ? '<figcaption class="wp-element-caption">' . $this->clean_html( $b['caption'] ) . '</figcaption>' : '';
        $img = '<img src="' . $url . '" alt="' . $alt . '"/>';
        return [ "<!-- wp:image -->\n<figure class=\"wp-block-image\">" . $img . $caption . "</figure>\n<!-- /wp:image -->", null ];

      case 'buttons':
        $buttons = $b['buttons'] ?? null;
        if ( !is_array( $buttons ) || $buttons === [] ) {
          return [ null, $at . ' buttons requires a non-empty "buttons" array of {text, url}.' ];
        }
        $btnInner = '';
        foreach ( $buttons as $bi => $btn ) {
          if ( !is_array( $btn ) || empty( $btn['text'] ) ) {
            return [ null, $at . ' button[' . $bi . '] requires "text".' ];
          }
          $href = esc_url_raw( $btn['url'] ?? '' );
          $hrefAttr = $href !== '' ? ' href="' . $href . '"' : '';
          $btnInner .= "<!-- wp:button -->\n<div class=\"wp-block-button\"><a class=\"wp-block-button__link wp-element-button\"" . $hrefAttr . '>' . $this->clean_html( $btn['text'] ) . "</a></div>\n<!-- /wp:button -->\n";
        }
        return [ "<!-- wp:buttons -->\n<div class=\"wp-block-buttons\">" . rtrim( $btnInner, "\n" ) . "</div>\n<!-- /wp:buttons -->", null ];

      case 'group':
        list( $gInner, $gErr ) = $this->blocks_to_markup( $b['blocks'] ?? null, $at . '.blocks' );
        if ( $gErr !== null ) {
          return [ null, $gErr ];
        }
        return [ "<!-- wp:group -->\n<div class=\"wp-block-group\">" . $gInner . "</div>\n<!-- /wp:group -->", null ];

      case 'columns':
        $columns = $b['columns'] ?? null;
        if ( !is_array( $columns ) || $columns === [] ) {
          return [ null, $at . ' columns requires a non-empty "columns" array (an array of block-spec arrays).' ];
        }
        $colsInner = '';
        foreach ( $columns as $ci => $colBlocks ) {
          list( $colInner, $colErr ) = $this->blocks_to_markup( $colBlocks, $at . '.columns[' . $ci . ']' );
          if ( $colErr !== null ) {
            return [ null, $colErr ];
          }
          $colsInner .= "<!-- wp:column -->\n<div class=\"wp-block-column\">" . $colInner . "</div>\n<!-- /wp:column -->\n";
        }
        return [ "<!-- wp:columns -->\n<div class=\"wp-block-columns\">" . rtrim( $colsInner, "\n" ) . "</div>\n<!-- /wp:columns -->", null ];

      case 'separator':
        return [ "<!-- wp:separator -->\n<hr class=\"wp-block-separator has-alpha-channel-opacity\"/>\n<!-- /wp:separator -->", null ];

      case 'spacer':
        $h = isset( $b['height'] ) ? (int) $b['height'] : 100;
        if ( $h < 1 || $h > 2000 ) {
          return [ null, $at . ' spacer height must be between 1 and 2000 (px).' ];
        }
        return [ '<!-- wp:spacer ' . wp_json_encode( [ 'height' => $h . 'px' ] ) . " -->\n<div style=\"height:" . $h . "px\" aria-hidden=\"true\" class=\"wp-block-spacer\"></div>\n<!-- /wp:spacer -->", null ];

      case 'code':
        return [ "<!-- wp:code -->\n<pre class=\"wp-block-code\"><code>" . esc_html( wp_unslash( (string) ( $b['content'] ?? '' ) ) ) . "</code></pre>\n<!-- /wp:code -->", null ];

      case 'html':
        // core/html stores raw HTML and is always valid on re-open. Sanitize to post-safe HTML.
        return [ "<!-- wp:html -->\n" . $this->clean_html( $b['content'] ?? '' ) . "\n<!-- /wp:html -->", null ];
    }
    return [ null, $at . ' could not be rendered.' ];
  }

  /**
   * Compile a wp_alter_post regex search into a delimited PCRE pattern.
   *
   * The documented contract is a BARE pattern plus an optional flags string; we wrap it
   * with a safe delimiter internally. This is what makes Gutenberg block markers work:
   * they contain "/" (e.g. <!-- /wp:paragraph -->), which collides with the "/" delimiter,
   * so "/" is tried last when picking a delimiter. For backward compatibility a pattern
   * that already compiles as a fully delimited PCRE (and no separate flags were given) is
   * honored as-is. Returns [ compiled, error ]; exactly one is non-null.
   */
  private function compile_alter_regex( string $pattern, string $flags = '' ): array {
    $flags = trim( $flags );
    if ( $flags !== '' && !preg_match( '/^[imsxuADSUXJ]+$/', $flags ) ) {
      return [ null, 'Invalid regex flags "' . $flags . '". Allowed: i, m, s, x, u, A, D, S, U, X, J.' ];
    }

    // Backward compat: an already-delimited pattern that compiles is used verbatim.
    if ( $flags === '' && $pattern !== '' && $this->preg_compile_error( $pattern ) === null ) {
      return [ $pattern, null ];
    }

    // Bare pattern: wrap with the first delimiter not present in the pattern ("/" last).
    $delimiter = '';
    foreach ( [ '~', '#', '%', '!', '@', '/' ] as $candidate ) {
      if ( strpos( $pattern, $candidate ) === false ) {
        $delimiter = $candidate;
        break;
      }
    }
    if ( $delimiter === '' ) {
      // Pattern uses every candidate; fall back to "~" and escape its occurrences.
      $delimiter = '~';
      $pattern = str_replace( '~', '\~', $pattern );
    }
    $compiled = $delimiter . $pattern . $delimiter . $flags;

    $err = $this->preg_compile_error( $compiled );
    if ( $err !== null ) {
      return [ null, 'Invalid regex pattern: ' . $err . ' (compiled to ' . $compiled . ')' ];
    }
    return [ $compiled, null ];
  }

  /**
   * Test-compile a PCRE pattern without emitting warnings. Returns null on success, or a
   * human-readable PCRE error message (echoing the real engine message when available).
   */
  private function preg_compile_error( string $pattern ): ?string {
    set_error_handler( fn () => true );
    $result = preg_match( $pattern, '' );
    restore_error_handler();
    if ( $result !== false ) {
      return null;
    }
    return function_exists( 'preg_last_error_msg' )
      ? preg_last_error_msg()
      : 'PCRE error code ' . preg_last_error();
  }

  /**
   * Bust post caches after a write so a follow-up wp_get_post in the next request
   * returns fresh data on sites with persistent object caches (Redis, Memcached) or
   * page caches (LiteSpeed, WP Rocket, Cloudflare, etc.). wp_insert_post / wp_update_post
   * call clean_post_cache themselves; this is idempotent and also fans out third-party
   * purge hooks plus a generic mwai_mcp_post_changed action so sites can wire their own.
   *
   * Per-request dedupe: agentic clients often hit the same post several times in quick
   * succession (e.g. wp_alter_post twice on the same page within the same JSON-RPC call),
   * which would multiply expensive third-party purges (Cloudflare global, Algolia reindex).
   * We keep a static set of post IDs already busted in this PHP request and short-circuit
   * repeats. The $context array is forwarded to mwai_mcp_post_changed so handlers can
   * coalesce or defer purges across requests on their own (e.g. flush at end of batch).
   */
  private function bust_post_cache( int $post_id, array $context = [] ): void {
    if ( $post_id <= 0 ) {
      return;
    }
    static $already_busted = [];
    if ( isset( $already_busted[ $post_id ] ) ) {
      return;
    }
    $already_busted[ $post_id ] = true;

    clean_post_cache( $post_id );
    $context = wp_parse_args( $context, [
      'source' => 'mcp',
      'tool' => null,
      'batch' => false,
    ] );
    do_action( 'mwai_mcp_post_changed', $post_id, $context );
    do_action( 'litespeed_purge_post', $post_id );
    if ( function_exists( 'rocket_clean_post' ) ) {
      rocket_clean_post( $post_id );
    }
  }
  #endregion

  #region Tools Definitions
  private function tools(): array {
    return [

      /* -------- Plugins -------- */
      'wp_list_plugins' => [
        'name' => 'wp_list_plugins',
        'description' => 'List installed plugins (returns array of {Name, Version}).',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [ 'search' => [ 'type' => 'string' ] ],
        ],
        'accessLevel' => 'read',
      ],

      /* -------- Users -------- */
      'wp_get_users' => [
        'name' => 'wp_get_users',
        'description' => 'Retrieve users (fields: ID, user_login, display_name, roles). If no limit supplied, returns 10. `paged` ignored if `offset` is used.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'search' => [ 'type' => 'string' ],
            'role' => [ 'type' => 'string' ],
            'limit' => [ 'type' => 'integer' ],
            'offset' => [ 'type' => 'integer' ],
            'paged' => [ 'type' => 'integer' ],
          ],
        ],
        'accessLevel' => 'admin',
      ],
      'wp_create_user' => [
        'name' => 'wp_create_user',
        'description' => 'Create a user. Requires user_login and user_email. Optional: user_pass (random if omitted), display_name, role.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'user_login' => [ 'type' => 'string' ],
            'user_email' => [ 'type' => 'string' ],
            'user_pass' => [ 'type' => 'string' ],
            'display_name' => [ 'type' => 'string' ],
            'role' => [ 'type' => 'string' ],
          ],
          'required' => [ 'user_login', 'user_email' ],
        ],
        'accessLevel' => 'admin',
      ],
      'wp_update_user' => [
        'name' => 'wp_update_user',
        'description' => 'Update a user – pass ID plus a “fields” object (user_email, display_name, user_pass, role).',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'ID' => [ 'type' => 'integer' ],
            'fields' => [
              'type' => 'object',
              'properties' => [
                'user_email' => [ 'type' => 'string' ],
                'display_name' => [ 'type' => 'string' ],
                'user_pass' => [ 'type' => 'string' ],
                'role' => [ 'type' => 'string' ],
              ],
              'additionalProperties' => true
            ],
          ],
          'required' => [ 'ID' ],
        ],
        'accessLevel' => 'admin',
      ],

      /* -------- Comments -------- */
      'wp_get_comments' => [
        'name' => 'wp_get_comments',
        'description' => 'Retrieve comments (fields: comment_ID, comment_post_ID, comment_type, comment_author, comment_content, comment_date, comment_approved). Returns 10 by default. Filter by commenter with `user_id` (registered user ID) or `author_email`. Use `type` to filter by comment type; pass `type: "note"` to read WordPress 6.9 editor Notes (block-level feedback), where comment_approved "0" means open/unresolved and "1" means resolved. When reading notes, all statuses are returned unless you pass an explicit `status`.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'post_id' => [ 'type' => 'integer' ],
            'status' => [ 'type' => 'string' ],
            'type' => [ 'type' => 'string', 'description' => 'Filter by comment type, e.g. "comment", "pingback", or "note" (WP 6.9 editor Notes). Omit to return all types.' ],
            'search' => [ 'type' => 'string' ],
            'user_id' => [ 'type' => 'integer', 'description' => 'Filter by the registered user ID of the commenter.' ],
            'author_email' => [ 'type' => 'string', 'description' => 'Filter by the commenter email address.' ],
            'limit' => [ 'type' => 'integer' ],
            'offset' => [ 'type' => 'integer' ],
            'paged' => [ 'type' => 'integer' ],
          ],
        ],
        'accessLevel' => 'read',
      ],
      'wp_create_comment' => [
        'name' => 'wp_create_comment',
        'description' => 'Insert a comment. Requires post_id and comment_content. Optional author, author_email, author_url.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'post_id' => [ 'type' => 'integer' ],
            'comment_content' => [ 'type' => 'string' ],
            'comment_author' => [ 'type' => 'string' ],
            'comment_author_email' => [ 'type' => 'string' ],
            'comment_author_url' => [ 'type' => 'string' ],
            'comment_approved' => [ 'type' => 'string' ],
          ],
          'required' => [ 'post_id', 'comment_content' ],
        ],
        'accessLevel' => 'write',
      ],
      'wp_update_comment' => [
        'name' => 'wp_update_comment',
        'description' => 'Update a comment – pass comment_ID plus fields (comment_content, comment_approved).',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'comment_ID' => [ 'type' => 'integer' ],
            'fields' => [
              'type' => 'object',
              'properties' => [
                'comment_content' => [ 'type' => 'string' ],
                'comment_approved' => [ 'type' => 'string' ],
              ],
              'additionalProperties' => true
            ],
          ],
          'required' => [ 'comment_ID' ],
        ],
        'accessLevel' => 'write',
      ],
      'wp_delete_comment' => [
        'name' => 'wp_delete_comment',
        'description' => 'Delete a comment. `force` true bypasses trash.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'comment_ID' => [ 'type' => 'integer' ],
            'force' => [ 'type' => 'boolean' ],
          ],
          'required' => [ 'comment_ID' ],
        ],
        'accessLevel' => 'admin',
      ],

      /* -------- Options -------- */
      'wp_get_option' => [
        'name' => 'wp_get_option',
        'description' => 'Get a single WordPress option value (scalar or array) by key. Set raw to true to read the stored value straight from the database, bypassing the object cache and any option_* filters (e.g. Polylang filters sticky_posts per-language on REST requests, so a normal read can differ from the DB / wp-cli).',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'key' => [ 'type' => 'string' ],
            'raw' => [ 'type' => 'boolean', 'description' => 'Read the unfiltered value directly from the database (bypasses object cache and option_* filters).' ],
          ],
          'required' => [ 'key' ],
        ],
        'accessLevel' => 'admin',
      ],
      'wp_update_option' => [
        'name' => 'wp_update_option',
        'description' => 'Create or update a WordPress option. Arrays/objects are stored natively (a JSON string is decoded back to an array first). WordPress refreshes the option cache automatically, but full-page caches (Varnish, WP Rocket, Cloudflare) are not purged, so a front-end may lag until its cache expires; integrations can hook the mwai_mcp_mutate action to purge on writes.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'key' => [ 'type' => 'string' ],
            // No type constraint here on purpose: WordPress options accept any
            // value (string, number, boolean, array, object). Declaring a union
            // that includes "object"/"array" makes ChatGPT reject the schema,
            // and the runtime normalizer would strip the type anyway and log a
            // warning every list_tools call. Keep it permissive from the start.
            'value' => [ 'description' => 'Option value. Accepts strings, numbers, booleans, arrays, or objects (non-scalars are JSON-serialised).' ],
          ],
          'required' => [ 'key', 'value' ],
        ],
        'accessLevel' => 'admin',
      ],

      /* -------- Counts -------- */
      'wp_count_posts' => [
        'name' => 'wp_count_posts',
        'description' => 'Return counts of posts by status. Optional post_type (default post).',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [ 'post_type' => [ 'type' => 'string' ] ],
        ],
        'accessLevel' => 'read',
      ],
      'wp_count_terms' => [
        'name' => 'wp_count_terms',
        'description' => 'Return total number of terms in a taxonomy.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [ 'taxonomy' => [ 'type' => 'string' ] ],
          'required' => [ 'taxonomy' ],
        ],
        'accessLevel' => 'read',
      ],
      'wp_count_media' => [
        'name' => 'wp_count_media',
        'description' => 'Return number of attachments (optionally after/before date).',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'after' => [ 'type' => 'string' ],
            'before' => [ 'type' => 'string' ],
          ],
        ],
        'accessLevel' => 'read',
      ],

      /* -------- Post-types -------- */
      'wp_get_post_types' => [
        'name' => 'wp_get_post_types',
        'description' => 'List public post types (key, label).',
        'inputSchema' => $this->empty_schema(),
        'accessLevel' => 'read',
      ],

      /* -------- Posts -------- */
      'wp_get_posts' => [
        'name' => 'wp_get_posts',
        'description' => 'Retrieve posts (fields: ID, title, status, excerpt, link). No full content. **If no limit is supplied it returns 10 posts by default.** `paged` is ignored if `offset` is used. Filter by author with `author` (user ID) or `author_name` (user slug).',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'post_type' => [ 'type' => 'string' ],
            'post_status' => [ 'type' => 'string' ],
            'search' => [ 'type' => 'string' ],
            'author' => [ 'type' => 'integer', 'description' => 'Filter by author user ID.' ],
            'author_name' => [ 'type' => 'string', 'description' => 'Filter by author user slug (nicename). Ignored if author is set.' ],
            'author__not_in' => [ 'type' => 'array', 'items' => [ 'type' => 'integer' ], 'description' => 'Exclude posts by these author user IDs.' ],
            'after' => [ 'type' => 'string' ],
            'before' => [ 'type' => 'string' ],
            'limit' => [ 'type' => 'integer' ],
            'offset' => [ 'type' => 'integer' ],
            'paged' => [ 'type' => 'integer' ],
          ],
        ],
        'accessLevel' => 'read',
      ],
      'wp_get_post' => [
        'name' => 'wp_get_post',
        'description' => 'Get basic post data by ID: title, content, status, dates, permalink. Reads through the WordPress object cache; if you just wrote with wp_create_post / wp_update_post / wp_alter_post, the write tools bust caches automatically so a follow-up read returns fresh data. For complete data including all meta and terms, use wp_get_post_snapshot instead. Set content_format to "prose" to strip block-attribute JSON (e.g. huge gallery blobs) and return just the prose.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'ID' => [ 'type' => 'integer' ],
            'content_format' => [ 'type' => 'string', 'enum' => [ 'full', 'prose' ], 'description' => 'full (default) returns raw content; prose strips block-attribute JSON, keeping prose, headings and block markers.' ],
          ],
          'required' => [ 'ID' ],
        ],
        'accessLevel' => 'read',
      ],
      'wp_get_post_snapshot' => [
        'name' => 'wp_get_post_snapshot',
        'description' => 'Get complete post data in ONE call: all post fields, all meta, all terms/taxonomies, featured image, and author. Use this for WooCommerce products, events, or any post type where you need full context. Reduces 10-20 API calls to just 1. Returns structured JSON with post, meta, terms, thumbnail, and author keys.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'ID' => [ 'type' => 'integer', 'description' => 'Post ID' ],
            'include' => [
              'type' => 'array',
              'description' => 'Optional: fields to include (default: all). Options: meta, terms, thumbnail, author',
              'items' => [ 'type' => 'string' ],
            ],
            'exclude' => [
              'type' => 'array',
              'description' => 'Optional: fields to exclude from post data. Options: content (useful for posts with huge content like many galleries)',
              'items' => [ 'type' => 'string' ],
            ],
            'content_format' => [ 'type' => 'string', 'enum' => [ 'full', 'prose' ], 'description' => 'full (default) returns raw content; prose strips block-attribute JSON (huge gallery blobs), keeping prose and block markers. Ignored if content is excluded.' ],
          ],
          'required' => [ 'ID' ],
        ],
        'accessLevel' => 'read',
      ],
      'wp_create_post' => [
        'name' => 'wp_create_post',
        'description' => 'Create a new post, page, or any custom post type. post_title is required. post_content accepts HTML, Gutenberg blocks, and shortcodes (stored as-is, attribute quotes preserved); plain prose with no markup is converted from Markdown. post_status defaults to "draft" and post_type defaults to "post" – pass post_type: "page" for a page, or any registered CPT slug (product, event, etc.). Set categories later with wp_add_post_terms; meta_input is an associative array of custom-field key/value pairs. For small surgical edits to an existing post (insert/replace a paragraph or shortcode without resending the whole body), use wp_alter_post instead.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'post_title' => [ 'type' => 'string' ],
            'post_content' => [ 'type' => 'string' ],
            'post_excerpt' => [ 'type' => 'string' ],
            'post_status' => [ 'type' => 'string' ],
            'post_type' => [ 'type' => 'string' ],
            'post_name' => [ 'type' => 'string' ],
            'meta_input' => [ 'type' => 'object', 'description' => 'Associative array of custom fields.' ],
          ],
          'required' => [ 'post_title' ],
        ],
        'accessLevel' => 'write',
      ],
      'wp_update_post' => [
        'name' => 'wp_update_post',
        'description' => 'Update post fields and/or meta in ONE call. Pass ID + "fields" object (post_title, post_content, post_status, etc.) and/or "meta_input" object for custom fields. Post fields may also be passed at the top level (e.g. ID + post_title directly). Efficient for WooCommerce products: update title + price + stock together. Note: post_category REPLACES categories; use wp_add_post_terms to append instead. Use schedule_for to easily schedule posts.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'ID' => [ 'type' => 'integer', 'description' => 'The ID of the post to update.' ],
            'fields' => [
              'type' => 'object',
              'properties' => [
                'post_title' => [ 'type' => 'string' ],
                'post_content' => [ 'type' => 'string' ],
                'post_status' => [ 'type' => 'string' ],
                'post_name' => [ 'type' => 'string' ],
                'post_excerpt' => [ 'type' => 'string' ],
                'post_category' => [ 'type' => 'array', 'items' => [ 'type' => 'integer' ] ],
              ],
              'additionalProperties' => true
            ],
            'meta_input' => [
              'type' => 'object',
              'description' => 'Associative array of custom fields.'
            ],
            'schedule_for' => [
              'type' => 'string',
              'description' => 'Schedule post for future publication. Provide local datetime (e.g., "2026-02-02 09:00:00"). Automatically sets status to "future" and calculates GMT from WordPress timezone.'
            ],
          ],
          'required' => [ 'ID' ],
        ],
        'accessLevel' => 'write',
      ],
      'wp_delete_post' => [
        'name' => 'wp_delete_post',
        'description' => 'Delete, trash, or remove a post, page, or any custom post type by ID. Without force, the post is moved to trash (can be restored). With force: true, the post is permanently destroyed (bypasses trash, irreversible). Works for posts, pages, products, events, attachments, or any registered CPT.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'ID' => [ 'type' => 'integer' ],
            'force' => [ 'type' => 'boolean' ],
          ],
          'required' => [ 'ID' ],
        ],
        'accessLevel' => 'admin',
      ],
      'wp_alter_post' => [
        'name' => 'wp_alter_post',
        'description' => 'Search-and-replace inside a post field without re-uploading the entire content. Efficient for making small edits to long content. With regex=true, pass a BARE PHP-PCRE pattern (no delimiters) in "search" and put any modifiers in "flags" (e.g. flags="i"); the pattern is wrapped with a safe delimiter internally, so patterns containing "/" (like Gutenberg block markers <!-- /wp:paragraph -->) work without escaping. Example: search="(<!-- /wp:paragraph -->)\\s*$" with flags="" appends to the last paragraph block. Backslashes must be JSON-escaped (\\s, \\d). A fully delimited pattern (/.../i) is also accepted for backward compatibility.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'ID' => [ 'type' => 'integer', 'description' => 'Post ID.' ],
            'field' => [ 'type' => 'string', 'description' => 'Field to modify: post_content, post_excerpt, or post_title.' ],
            'search' => [ 'type' => 'string', 'description' => 'Text to search for, or (with regex=true) a bare PCRE pattern without delimiters, e.g. <!-- /wp:paragraph -->\\s*$' ],
            'replace' => [ 'type' => 'string', 'description' => 'Replacement text. In regex mode, backreferences like $1 / \\1 are supported.' ],
            'regex' => [ 'type' => 'boolean', 'description' => 'Treat search as a regex pattern (default: false).' ],
            'flags' => [ 'type' => 'string', 'description' => 'Optional PCRE modifier letters applied in regex mode, e.g. "i" (case-insensitive), "s" (dotall), "m" (multiline). Allowed: i, m, s, x, u, A, D, S, U, X, J.' ],
          ],
          'required' => [ 'ID', 'field', 'search', 'replace' ],
        ],
        'accessLevel' => 'write',
      ],
      'wp_write_blocks' => [
        'name' => 'wp_write_blocks',
        'description' => 'Build a valid Gutenberg (block editor) layout on an existing post or page from a simple block spec, so the result opens cleanly in the editor with no "invalid content" warnings. Create the post first with wp_create_post, then pass its ID plus "blocks", an ordered array of specs like {"type":"heading","level":2,"content":"..."}. Supported types: paragraph (content), heading (content, level 1-6), list (items[], ordered), quote (content, citation), image (url, alt, caption), buttons (buttons[] of {text,url}), group (blocks[]), columns (columns[] of block-spec arrays), separator, spacer (height px), code (content), html (content, raw HTML escape hatch). content fields accept inline HTML. mode replaces (default), appends, or prepends. For prose you do not need to lay out visually, plain wp_create_post/wp_update_post with Markdown is simpler; use this when you want real, editable blocks.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'ID' => [ 'type' => 'integer', 'description' => 'Target post/page ID (create it first with wp_create_post).' ],
            'blocks' => [
              'type' => 'array',
              'description' => 'Ordered array of block specs. Each item is an object with a "type" and the fields for that type (see the tool description).',
              'items' => [ 'type' => 'object', 'additionalProperties' => true ],
            ],
            'mode' => [ 'type' => 'string', 'enum' => [ 'replace', 'append', 'prepend' ], 'description' => 'replace (default) overwrites post_content; append/prepend add the blocks to the existing content.' ],
          ],
          'required' => [ 'ID', 'blocks' ],
        ],
        'accessLevel' => 'write',
      ],
      'wp_list_block_patterns' => [
        'name' => 'wp_list_block_patterns',
        'description' => 'List the block patterns registered on this site (core, theme, and plugin patterns). Patterns are ready-made, pre-validated block layouts (hero/banner sections, pricing tables, testimonials, galleries, calls to action) authored by the theme, so inserting one is on-brand and always opens cleanly in the editor. Discover a layout here, insert it with wp_insert_block_pattern, then adjust the placeholder text with wp_alter_post. Returns compact metadata (name, title, categories, description) by default; set include_content to true to also get the raw block markup. Filter with search (matches title/name/description/keywords) and/or category (e.g. "call-to-action", "gallery", "testimonials").',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'search' => [ 'type' => 'string', 'description' => 'Case-insensitive filter on title, name, description, and keywords.' ],
            'category' => [ 'type' => 'string', 'description' => 'Pattern category slug, e.g. "featured", "call-to-action", "gallery", "testimonials".' ],
            'include_content' => [ 'type' => 'boolean', 'description' => 'Include each match\'s raw block markup (default false; can be large).' ],
            'limit' => [ 'type' => 'integer', 'description' => 'Max patterns to return (default 50, max 500).' ],
          ],
        ],
        'accessLevel' => 'read',
      ],
      'wp_insert_block_pattern' => [
        'name' => 'wp_insert_block_pattern',
        'description' => 'Insert a registered block pattern into a post or page by its name (get names from wp_list_block_patterns). Pattern markup is pre-validated theme/core content, so the result is on-brand and valid in the editor. mode "append" (default) adds it to the end, so you can compose a full page from several patterns in successive calls; "replace" overwrites the content; "prepend" adds it to the top. After inserting, swap placeholder text with wp_alter_post.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'ID' => [ 'type' => 'integer', 'description' => 'Target post/page ID (create it first with wp_create_post).' ],
            'pattern' => [ 'type' => 'string', 'description' => 'Pattern name (slug) from wp_list_block_patterns, e.g. "core/query-standard-posts" or "twentytwentyfive/hero".' ],
            'mode' => [ 'type' => 'string', 'enum' => [ 'append', 'replace', 'prepend' ], 'description' => 'append (default), replace, or prepend the pattern content.' ],
          ],
          'required' => [ 'ID', 'pattern' ],
        ],
        'accessLevel' => 'write',
      ],

      /* -------- Post-meta -------- */
      'wp_get_post_meta' => [
        'name' => 'wp_get_post_meta',
        'description' => 'Get specific post meta field(s). Provide "key" to fetch a single value; omit to fetch all custom fields. If you need ALL meta along with post data and terms, use wp_get_post_snapshot instead for efficiency.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'ID' => [ 'type' => 'integer' ],
            'key' => [ 'type' => 'string' ],
          ],
          'required' => [ 'ID' ],
        ],
        'accessLevel' => 'read',
      ],
      'wp_update_post_meta' => [
        'name' => 'wp_update_post_meta',
        'description' => 'Update post meta efficiently. Use "meta" object to update MULTIPLE fields at once (e.g., {_price: "19.99", _stock: "50", _sku: "WIDGET"}), or use "key"+"value" for a single field. Essential for WooCommerce products and custom post types.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'ID' => [ 'type' => 'integer' ],
            'meta' => [ 'type' => 'object', 'description' => 'Key/value pairs to set. Alternative: provide "key" + "value".' ],
            'key' => [ 'type' => 'string' ],
            'value' => [ 'type' => [ 'string', 'number', 'boolean' ] ],
          ],
          'required' => [ 'ID' ],
        ],
        'accessLevel' => 'write',
      ],
      'wp_delete_post_meta' => [
        'name' => 'wp_delete_post_meta',
        'description' => 'Delete custom field(s) from a post. Provide value to remove a single row; omit value to delete all rows for the key.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'ID' => [ 'type' => 'integer' ],
            'key' => [ 'type' => 'string' ],
            'value' => [ 'type' => [ 'string', 'number', 'boolean' ] ],
          ],
          'required' => [ 'ID', 'key' ],
        ],
        'accessLevel' => 'admin',
      ],

      /* -------- Featured image -------- */
      'wp_set_featured_image' => [
        'name' => 'wp_set_featured_image',
        'description' => 'Attach or remove a featured image (thumbnail) for a post/page. Provide media_id to attach, omit or null to remove.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'post_id' => [ 'type' => 'integer' ],
            'media_id' => [ 'type' => 'integer' ],
          ],
          'required' => [ 'post_id' ],
        ],
        'accessLevel' => 'write',
      ],

      /* -------- Taxonomies / Terms -------- */
      'wp_get_taxonomies' => [
        'name' => 'wp_get_taxonomies',
        'description' => 'List taxonomies for a post type.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [ 'post_type' => [ 'type' => 'string' ] ],
        ],
        'accessLevel' => 'read',
      ],
      'wp_get_terms' => [
        'name' => 'wp_get_terms',
        'description' => 'List terms of a taxonomy.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'taxonomy' => [ 'type' => 'string' ],
            'search' => [ 'type' => 'string' ],
            'parent' => [ 'type' => 'integer' ],
            'limit' => [ 'type' => 'integer' ],
          ],
          'required' => [ 'taxonomy' ],
        ],
        'accessLevel' => 'read',
      ],
      'wp_create_term' => [
        'name' => 'wp_create_term',
        'description' => 'Create a term.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'taxonomy' => [ 'type' => 'string' ],
            'term_name' => [ 'type' => 'string' ],
            'slug' => [ 'type' => 'string' ],
            'description' => [ 'type' => 'string' ],
            'parent' => [ 'type' => 'integer' ],
          ],
          'required' => [ 'taxonomy', 'term_name' ],
        ],
        'accessLevel' => 'write',
      ],
      'wp_update_term' => [
        'name' => 'wp_update_term',
        'description' => 'Update a term.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'term_id' => [ 'type' => 'integer' ],
            'taxonomy' => [ 'type' => 'string' ],
            'name' => [ 'type' => 'string' ],
            'slug' => [ 'type' => 'string' ],
            'description' => [ 'type' => 'string' ],
            'parent' => [ 'type' => 'integer' ],
          ],
          'required' => [ 'term_id', 'taxonomy' ],
        ],
        'accessLevel' => 'write',
      ],
      'wp_delete_term' => [
        'name' => 'wp_delete_term',
        'description' => 'Delete a term.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'term_id' => [ 'type' => 'integer' ],
            'taxonomy' => [ 'type' => 'string' ],
          ],
          'required' => [ 'term_id', 'taxonomy' ],
        ],
        'accessLevel' => 'admin',
      ],
      'wp_get_post_terms' => [
        'name' => 'wp_get_post_terms',
        'description' => 'Get terms attached to a post.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'ID' => [ 'type' => 'integer' ],
            'taxonomy' => [ 'type' => 'string' ],
          ],
          'required' => [ 'ID' ],
        ],
        'accessLevel' => 'read',
      ],
      'wp_add_post_terms' => [
        'name' => 'wp_add_post_terms',
        'description' => 'Attach or replace terms for a post. Set "append=true" to ADD terms to existing ones, or "append=false" (default) to REPLACE all terms. Use for categories, tags, or WooCommerce attributes (pa_color, pa_size, etc.).',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'ID' => [ 'type' => 'integer' ],
            'taxonomy' => [ 'type' => 'string' ],
            'terms' => [ 'type' => 'array', 'items' => [ 'type' => 'integer' ] ],
            'append' => [ 'type' => 'boolean' ],
          ],
          'required' => [ 'ID', 'terms' ],
        ],
        'accessLevel' => 'write',
      ],

      /* -------- Media -------- */
      'wp_get_media' => [
        'name' => 'wp_get_media',
        'description' => 'List media items. Filter by uploader with `author` (user ID) or `author_name` (user slug).',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'search' => [ 'type' => 'string' ],
            'author' => [ 'type' => 'integer', 'description' => 'Filter by uploader user ID.' ],
            'author_name' => [ 'type' => 'string', 'description' => 'Filter by uploader user slug (nicename). Ignored if author is set.' ],
            'after' => [ 'type' => 'string' ],
            'before' => [ 'type' => 'string' ],
            'limit' => [ 'type' => 'integer' ],
          ],
        ],
        'accessLevel' => 'read',
      ],
      'wp_upload_media' => [
        'name' => 'wp_upload_media',
        'description' => 'Upload a file to the WordPress Media Library. Provide either a url (WordPress will download it) or base64-encoded content with a filename. Base64 mode is useful for local files but doubles the payload size — keep files under a few MB to avoid memory or timeout issues.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'url' => [
              'type' => 'string',
              'description' => 'URL to download the file from. Use this OR base64/filename.',
            ],
            'base64' => [
              'type' => 'string',
              'description' => 'Base64-encoded file content. Must be used together with filename.',
            ],
            'filename' => [
              'type' => 'string',
              'description' => 'Filename with extension (e.g. photo.jpg). Required when using base64.',
            ],
            'title' => [ 'type' => 'string' ],
            'description' => [ 'type' => 'string' ],
            'alt' => [ 'type' => 'string' ],
          ],
        ],
        'accessLevel' => 'write',
      ],
      'wp_upload_request' => [
        'name' => 'wp_upload_request',
        'description' => 'Upload a local file to the WordPress Media Library via a temporary upload endpoint. Use this instead of wp_upload_media when you have a local file (not a URL) — passing large base64 strings through MCP is impractical and will likely exceed context limits. Call this tool with the filename and optional metadata; it returns a one-time upload URL. Then use curl to POST the file: curl -X POST -F "file=@/local/path/file.jpg" "<upload_url>". The upload URL expires after 5 minutes and can only be used once.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'filename' => [
              'type' => 'string',
              'description' => 'Filename with extension (e.g. photo.jpg).',
            ],
            'title' => [ 'type' => 'string' ],
            'description' => [ 'type' => 'string' ],
            'alt' => [ 'type' => 'string' ],
          ],
          'required' => [ 'filename' ],
        ],
        'accessLevel' => 'write',
      ],
      'wp_update_media' => [
        'name' => 'wp_update_media',
        'description' => 'Update attachment meta.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'ID' => [ 'type' => 'integer' ],
            'title' => [ 'type' => 'string' ],
            'caption' => [ 'type' => 'string' ],
            'description' => [ 'type' => 'string' ],
            'alt' => [ 'type' => 'string' ],
          ],
          'required' => [ 'ID' ],
        ],
        'accessLevel' => 'write',
      ],
      'wp_delete_media' => [
        'name' => 'wp_delete_media',
        'description' => 'Delete/trash an attachment.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'ID' => [ 'type' => 'integer' ],
            'force' => [ 'type' => 'boolean' ],
          ],
          'required' => [ 'ID' ],
        ],
        'accessLevel' => 'admin',
      ],

      /* -------- MWAI Vision / Image -------- */
      'mwai_vision' => [
        'name' => 'mwai_vision',
        'description' => 'Analyze an image via AI Engine Vision.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'message' => [ 'type' => 'string' ],
            'url' => [ 'type' => 'string' ],
            'path' => [ 'type' => 'string' ],
          ],
          'required' => [ 'message' ],
        ],
        'accessLevel' => 'read',
      ],
      'mwai_image' => [
        'name' => 'mwai_image',
        'description' => 'Generate an image with AI Engine and store it in the Media Library. Optional: title, caption, description, alt. Returns { id, url, title, caption, alt }.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'message' => [ 'type' => 'string', 'description' => 'Prompt describing the desired image.' ],
            'postId' => [ 'type' => 'integer', 'description' => 'Optional post ID to attach the image to.' ],
            'title' => [ 'type' => 'string' ],
            'caption' => [ 'type' => 'string' ],
            'description' => [ 'type' => 'string' ],
            'alt' => [ 'type' => 'string' ],
          ],
          'required' => [ 'message' ],
        ],
        'accessLevel' => 'write',
      ],

    ];
  }
  #endregion

  #region Tool Registration
  public function register_rest_tools( array $prev ): array {
    $tools = $this->tools();

    // All 36 core tools enabled and tested with ChatGPT.
    // Automatic validation in mcp.php fixes problematic type definitions.

    // Add category and annotations to each tool
    foreach ( $tools as &$tool ) {
      if ( !isset( $tool['category'] ) ) {
        $tool['category'] = 'AI Engine (Core)';
      }

      // Add MCP tool annotations based on tool name/behavior
      if ( !isset( $tool['annotations'] ) ) {
        $name = $tool['name'];

        // Read-only tools (safe, no modifications)
        $is_readonly = (
          strpos( $name, 'wp_get_' ) === 0 ||
          strpos( $name, 'wp_list_' ) === 0 ||
          strpos( $name, 'wp_count_' ) === 0 ||
          $name === 'mwai_vision'
        );

        // Destructive tools (can delete/destroy data)
        $is_destructive = (
          strpos( $name, 'wp_delete_' ) === 0 ||
          $name === 'wp_update_user' // Can change passwords/roles
        );

        $tool['annotations'] = [
          'readOnlyHint' => $is_readonly,
          'destructiveHint' => !$is_readonly && $is_destructive,
          'openWorldHint' => false, // All operate on closed WordPress system
        ];
      }
    }

    $merged = array_merge( $prev, array_values( $tools ) );
    return $merged;
  }
  #endregion

  #region Callback
  public function handle_call( $prev, string $tool, array $args, ?int $id ) {
    // Security check is already done in the MCP auth layer
    // If we reach here, the user is authorized to use MCP
    if ( !empty( $prev ) || !isset( $this->tools()[ $tool ] ) ) {
      return $prev;
    }
    return $this->dispatch( $tool, $args, $id );
  }
  #endregion

  #region Dispatcher
  private function dispatch( string $tool, array $a, ?int $id ): array {
    $r = [ 'jsonrpc' => '2.0', 'id' => $id ];

    // Accept common aliases for the primary record id. The post tools use the
    // WordPress-native "ID" (matching wp_update_post() / $post->ID), while
    // wp_set_featured_image, the comment tools, and the SEO/Woo suites use
    // "post_id". Agents hopping between tools guess the wrong spelling and hit a
    // bare "ID required". No tool in this suite uses two of these keys to mean
    // two different things, so mirroring them is safe; each handler still reads
    // its own canonical key.
    $idAliases = [ 'ID', 'post_id', 'id' ];
    $primaryId = null;
    foreach ( $idAliases as $k ) {
      if ( isset( $a[ $k ] ) && $a[ $k ] !== '' ) {
        $primaryId = $a[ $k ];
        break;
      }
    }
    if ( $primaryId !== null ) {
      foreach ( $idAliases as $k ) {
        if ( !isset( $a[ $k ] ) || $a[ $k ] === '' ) {
          $a[ $k ] = $primaryId;
        }
      }
    }

    switch ( $tool ) {

      /* ===== Users ===== */
      case 'wp_get_users':
        $q = [
          'search' => '*' . esc_attr( $a['search'] ?? '' ) . '*',
          'role' => $a['role'] ?? '',
          'number' => max( 1, intval( $a['limit'] ?? 10 ) ),
        ];
        if ( isset( $a['offset'] ) ) {
          $q['offset'] = max( 0, intval( $a['offset'] ) );
        }
        if ( isset( $a['paged'] ) ) {
          $q['paged'] = max( 1, intval( $a['paged'] ) );
        }
        $rows = [];
        foreach ( get_users( $q ) as $u ) {
          $rows[] = [
            'ID' => $u->ID,
            'user_login' => $u->user_login,
            'display_name' => $u->display_name,
            'roles' => $u->roles,
          ];
        }
        $this->add_result_text( $r, wp_json_encode( $rows, JSON_PRETTY_PRINT ) );
        break;

      case 'wp_create_user':
        // Same object-level gap as wp_update_user: the MCP gate only checks the
        // administrator role. wp_insert_user() runs no capability checks, so
        // require create_users (which on Multisite is a network-only capability,
        // correctly denying per-site Administrators) and refuse to assign a role
        // the caller cannot grant (e.g. administrator).
        if ( !current_user_can( 'create_users' ) ) {
          $r['error'] = [ 'code' => -32603, 'message' => 'You are not allowed to create users.' ];
          break;
        }
        $role = sanitize_key( $a['role'] ?? get_option( 'default_role', 'subscriber' ) );
        require_once ABSPATH . 'wp-admin/includes/user.php'; // get_editable_roles()
        if ( $role !== '' && !array_key_exists( $role, get_editable_roles() ) ) {
          $r['error'] = [ 'code' => -32603, 'message' => 'You are not allowed to assign this role.' ];
          break;
        }
        $data = [
          'user_login' => sanitize_user( $a['user_login'] ),
          'user_email' => sanitize_email( $a['user_email'] ),
          'user_pass' => $a['user_pass'] ?? wp_generate_password( 12, true ),
          'display_name' => sanitize_text_field( $a['display_name'] ?? '' ),
          'role' => $role,
        ];
        $uid = wp_insert_user( $data );
        if ( is_wp_error( $uid ) ) {
          $r['error'] = [ 'code' => $uid->get_error_code(), 'message' => $uid->get_error_message() ];
        }
        else {
          $this->add_result_text( $r, 'User created ID ' . $uid );
        }
        break;

      case 'wp_update_user':
        if ( empty( $a['ID'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'ID required' ];
          break;
        }
        $target_id = intval( $a['ID'] );
        // Object-level authorization. The MCP gate only checks that the caller
        // holds the administrator role, not that they may touch THIS user.
        // wp_update_user() runs no capability checks of its own, so without this
        // a Multisite per-site Administrator could edit users they cannot touch
        // in wp-admin (e.g. set a new password on the Network Owner). Delegating
        // to edit_user enforces the same boundary core does, for every auth path.
        // Reported by Charles Vosburgh via responsible disclosure.
        if ( !current_user_can( 'edit_user', $target_id ) ) {
          $r['error'] = [ 'code' => -32603, 'message' => 'You are not allowed to edit this user.' ];
          break;
        }
        $upd = [ 'ID' => $target_id ];
        if ( !empty( $a['fields'] ) && is_array( $a['fields'] ) ) {
          foreach ( $a['fields'] as $k => $v ) {
            $upd[ $k ] = ( $k === 'role' ) ? sanitize_key( $v ) : sanitize_text_field( $v );
          }
        }
        // A role change is a promotion/demotion. Require promote_user on the
        // target and refuse any role the caller cannot themselves assign, so a
        // lower admin cannot grant a role above their own reach.
        if ( isset( $upd['role'] ) && $upd['role'] !== '' ) {
          require_once ABSPATH . 'wp-admin/includes/user.php'; // get_editable_roles()
          if ( !current_user_can( 'promote_user', $target_id ) || !array_key_exists( $upd['role'], get_editable_roles() ) ) {
            $r['error'] = [ 'code' => -32603, 'message' => 'You are not allowed to assign this role.' ];
            break;
          }
        }
        $u = wp_update_user( $upd );
        if ( is_wp_error( $u ) ) {
          $r['error'] = [ 'code' => $u->get_error_code(), 'message' => $u->get_error_message() ];
        }
        else {
          $this->add_result_text( $r, 'User #' . $u . ' updated' );
        }
        break;

        /* ===== Comments ===== */
      case 'wp_get_comments':
        $args = [
          'post_id' => isset( $a['post_id'] ) ? intval( $a['post_id'] ) : '',
          'status' => $a['status'] ?? 'approve',
          'search' => $a['search'] ?? '',
          'number' => max( 1, intval( $a['limit'] ?? 10 ) ),
        ];
        // WP 6.9 Notes are comments with comment_type 'note'. Filter by type when
        // asked (unset = all types, preserving prior behavior). Notes track their
        // state via comment_status (hold = open, approve = resolved), so when
        // reading notes without an explicit status, return all statuses; otherwise
        // the 'approve' default would hide every open note.
        if ( isset( $a['type'] ) && $a['type'] !== '' ) {
          $args['type'] = sanitize_key( $a['type'] );
          if ( $args['type'] === 'note' && !isset( $a['status'] ) ) {
            $args['status'] = 'all';
          }
        }
        if ( isset( $a['user_id'] ) ) {
          $args['user_id'] = intval( $a['user_id'] );
        }
        if ( $a['author_email'] ?? '' ) {
          $args['author_email'] = sanitize_email( $a['author_email'] );
        }
        if ( isset( $a['offset'] ) ) {
          $args['offset'] = max( 0, intval( $a['offset'] ) );
        }
        if ( isset( $a['paged'] ) ) {
          $args['paged'] = max( 1, intval( $a['paged'] ) );
        }
        $list = [];
        foreach ( get_comments( $args ) as $c ) {
          $list[] = [
            'comment_ID' => $c->comment_ID,
            'comment_post_ID' => $c->comment_post_ID,
            'comment_type' => $c->comment_type,
            'comment_author' => $c->comment_author,
            'comment_content' => wp_trim_words( wp_strip_all_tags( $c->comment_content ), 40 ),
            'comment_date' => $c->comment_date,
            'comment_approved' => $c->comment_approved,
          ];
        }
        $this->add_result_text( $r, wp_json_encode( $list, JSON_PRETTY_PRINT ) );
        break;

      case 'wp_create_comment':
        if ( empty( $a['post_id'] ) || empty( $a['comment_content'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'post_id & comment_content required' ];
          break;
        }
        $ins = [
          'comment_post_ID' => intval( $a['post_id'] ),
          'comment_content' => $this->clean_html( $a['comment_content'] ),
          'comment_author' => sanitize_text_field( $a['comment_author'] ?? '' ),
          'comment_author_email' => sanitize_email( $a['comment_author_email'] ?? '' ),
          'comment_author_url' => esc_url_raw( $a['comment_author_url'] ?? '' ),
          'comment_approved' => $a['comment_approved'] ?? 1,
        ];
        $cid = wp_insert_comment( $ins );
        if ( is_wp_error( $cid ) ) {
          /** @var WP_Error $cid */
          $r['error'] = [ 'code' => $cid->get_error_code(), 'message' => $cid->get_error_message() ];
        }
        else {
          $this->add_result_text( $r, 'Comment created ID ' . $cid );
        }
        break;

      case 'wp_update_comment':
        if ( empty( $a['comment_ID'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'comment_ID required' ];
          break;
        }
        $c = [ 'comment_ID' => intval( $a['comment_ID'] ) ];
        if ( !empty( $a['fields'] ) && is_array( $a['fields'] ) ) {
          foreach ( $a['fields'] as $k => $v ) {
            $c[ $k ] = ( $k === 'comment_content' ) ? $this->clean_html( $v ) : sanitize_text_field( $v );
          }
        }
        $cid = wp_update_comment( $c, true );
        if ( is_wp_error( $cid ) ) {
          $r['error'] = [ 'code' => $cid->get_error_code(), 'message' => $cid->get_error_message() ];
        }
        else {
          $this->add_result_text( $r, 'Comment #' . $cid . ' updated' );
        }
        break;

      case 'wp_delete_comment':
        if ( empty( $a['comment_ID'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'comment_ID required' ];
          break;
        }
        $done = wp_delete_comment( intval( $a['comment_ID'] ), !empty( $a['force'] ) );
        if ( $done ) {
          $this->add_result_text( $r, 'Comment #' . $a['comment_ID'] . ' deleted' );
        }
        else {
          $r['error'] = [ 'code' => -32603, 'message' => 'Deletion failed' ];
        }
        break;

        /* ===== Options ===== */
      case 'wp_get_option':
        $opt_key = sanitize_key( $a['key'] );
        if ( !empty( $a['raw'] ) ) {
          // Read straight from the DB so neither the object cache nor an
          // option_* filter can mask the stored value. Mirrors what `wp-cli
          // option get` returns under CLI (where front-end filters aren't loaded).
          global $wpdb;
          $stored = $wpdb->get_var( $wpdb->prepare(
            "SELECT option_value FROM {$wpdb->options} WHERE option_name = %s",
            $opt_key
          ) );
          $val = is_null( $stored ) ? false : maybe_unserialize( $stored );
        }
        else {
          $val = get_option( $opt_key );
        }
        $this->add_result_text( $r, wp_json_encode( $val, JSON_PRETTY_PRINT ) );
        break;

      case 'wp_update_option':
        $value = $a['value'];
        // MCP clients commonly send array/object option values as a JSON string.
        // Decode them back to native PHP arrays before writing: storing the raw
        // JSON string for an array option (e.g. sticky_posts) corrupts it and can
        // fatal hooks that expect an array (Polylang's sync_sticky_posts runs
        // array_diff on it). Scalars and plain strings are left untouched.
        if ( is_string( $value ) && isset( $value[0] ) && ( $value[0] === '[' || $value[0] === '{' ) ) {
          $decoded = json_decode( $value, true );
          if ( json_last_error() === JSON_ERROR_NONE && is_array( $decoded ) ) {
            $value = $decoded;
          }
        }
        $set = update_option( sanitize_key( $a['key'] ), $value, 'yes' );
        if ( $set ) {
          $this->add_result_text( $r, 'Option "' . $a['key'] . '" updated' );
        }
        else {
          $r['error'] = [ 'code' => -32603, 'message' => 'Update failed' ];
        }
        break;

        /* ===== Counts ===== */
      case 'wp_count_posts':
        $pt = sanitize_key( $a['post_type'] ?? 'post' );
        $obj = wp_count_posts( $pt );
        $this->add_result_text( $r, wp_json_encode( $obj, JSON_PRETTY_PRINT ) );
        break;

      case 'wp_count_terms':
        $tax = sanitize_key( $a['taxonomy'] );
        $total = wp_count_terms( $tax, [ 'hide_empty' => false ] );
        if ( is_wp_error( $total ) ) {
          $r['error'] = [ 'code' => $total->get_error_code(), 'message' => $total->get_error_message() ];
        }
        else {
          $this->add_result_text( $r, (string) $total );
        }
        break;

      case 'wp_count_media':
        $args = [ 'post_type' => 'attachment', 'post_status' => 'inherit', 'fields' => 'ids' ];
        $d = [];
        if ( $a['after'] ?? '' ) {
          $d['after'] = $a['after'];
        }
        if ( $a['before'] ?? '' ) {
          $d['before'] = $a['before'];
        }
        if ( $d ) {
          $args['date_query'] = [ $d ];
        }
        $total = count( get_posts( $args ) );
        $this->add_result_text( $r, (string) $total );
        break;

        /* ===== Post-types ===== */
      case 'wp_get_post_types':
        $out = [];
        foreach ( get_post_types( [ 'public' => true ], 'objects' ) as $pt ) {
          $out[] = [ 'key' => $pt->name, 'label' => $pt->label ];
        }
        $this->add_result_text( $r, wp_json_encode( $out, JSON_PRETTY_PRINT ) );
        break;

        /* ===== Plugins ===== */
      case 'wp_list_plugins':
        if ( !function_exists( 'get_plugins' ) ) {
          require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }
        $search = sanitize_text_field( $a['search'] ?? '' );
        $out = [];
        foreach ( get_plugins() as $p ) {
          if ( !$search || stripos( $p['Name'], $search ) !== false ) {
            $out[] = [ 'Name' => $p['Name'], 'Version' => $p['Version'] ];
          }
        }
        $this->add_result_text( $r, wp_json_encode( $out, JSON_PRETTY_PRINT ) );
        break;

        /* ===== Posts: list ===== */
      case 'wp_get_posts':
        $q = [
          'post_type' => sanitize_key( $a['post_type'] ?? 'post' ),
          'post_status' => sanitize_key( $a['post_status'] ?? 'publish' ),
          's' => sanitize_text_field( $a['search'] ?? '' ),
          'posts_per_page' => max( 1, intval( $a['limit'] ?? 10 ) ),
        ];
        if ( isset( $a['offset'] ) ) {
          $q['offset'] = max( 0, intval( $a['offset'] ) );
        }
        if ( isset( $a['paged'] ) ) {
          $q['paged'] = max( 1, intval( $a['paged'] ) );
        }
        if ( isset( $a['author'] ) ) {
          $q['author'] = intval( $a['author'] );
        }
        elseif ( $a['author_name'] ?? '' ) {
          $q['author_name'] = sanitize_title( $a['author_name'] );
        }
        if ( !empty( $a['author__not_in'] ) && is_array( $a['author__not_in'] ) ) {
          $q['author__not_in'] = array_map( 'intval', $a['author__not_in'] );
        }
        $date = [];
        if ( $a['after'] ?? '' ) {
          $date['after'] = $a['after'];
        }
        if ( $a['before'] ?? '' ) {
          $date['before'] = $a['before'];
        }
        if ( $date ) {
          $q['date_query'] = [ $date ];
        }
        $rows = [];
        foreach ( get_posts( $q ) as $p ) {
          $rows[] = [
            'ID' => $p->ID,
            'post_title' => $p->post_title,
            'post_status' => $p->post_status,
            'post_excerpt' => $this->post_excerpt( $p ),
            'permalink' => get_permalink( $p ),
          ];
        }
        $this->add_result_text( $r, wp_json_encode( $rows, JSON_PRETTY_PRINT ) );
        break;

        /* ===== Posts: single ===== */
      case 'wp_get_post':
        if ( empty( $a['ID'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'Post ID required (pass "ID", e.g. {"ID": 123}; "post_id" is also accepted).' ];
          break;
        }
        $p = get_post( intval( $a['ID'] ) );
        if ( !$p ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'Post not found' ];
          break;
        }
        $out = [
          'ID' => $p->ID,
          'post_title' => $p->post_title,
          'post_status' => $p->post_status,
          'post_content' => ( ( $a['content_format'] ?? 'full' ) === 'prose' )
            ? $this->prose_content( $p->post_content )
            : $this->read_html( $p->post_content ),
          'post_excerpt' => $this->post_excerpt( $p ),
          'permalink' => get_permalink( $p ),
          'post_date' => $p->post_date,
          'post_modified' => $p->post_modified,
        ];
        $this->add_result_text( $r, wp_json_encode( $out, JSON_PRETTY_PRINT ) );
        break;

        /* ===== Posts: snapshot ===== */
      case 'wp_get_post_snapshot':
        if ( empty( $a['ID'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'Post ID required (pass "ID", e.g. {"ID": 123}; "post_id" is also accepted).' ];
          break;
        }

        $post_id = intval( $a['ID'] );
        $p = get_post( $post_id );

        if ( !$p ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'Post not found' ];
          break;
        }

        $include = $a['include'] ?? [ 'meta', 'terms', 'thumbnail', 'author' ];
        $exclude = $a['exclude'] ?? [];

        // Handle JSON strings (some MCP clients send arrays as JSON strings)
        if ( is_string( $include ) ) {
          $include = json_decode( $include, true ) ?? [];
        }
        if ( is_string( $exclude ) ) {
          $exclude = json_decode( $exclude, true ) ?? [];
        }

        $snapshot = [
          'post' => [
            'ID' => $p->ID,
            'post_title' => $p->post_title,
            'post_type' => $p->post_type,
            'post_status' => $p->post_status,
            'post_excerpt' => $this->post_excerpt( $p ),
            'post_name' => $p->post_name,
            'permalink' => get_permalink( $p ),
            'post_date' => $p->post_date,
            'post_modified' => $p->post_modified,
          ],
        ];

        // Include content unless excluded (useful for posts with huge content)
        if ( !in_array( 'content', $exclude ) ) {
          $snapshot['post']['post_content'] = ( ( $a['content_format'] ?? 'full' ) === 'prose' )
            ? $this->prose_content( $p->post_content )
            : $this->read_html( $p->post_content );
        }

        // Include all post meta
        if ( in_array( 'meta', $include ) ) {
          $snapshot['meta'] = [];
          $all_meta = get_post_meta( $post_id );
          foreach ( $all_meta as $key => $value ) {
            if ( is_array( $value ) && count( $value ) === 1 ) {
              $snapshot['meta'][ $key ] = maybe_unserialize( $value[0] );
            }
            else {
              $snapshot['meta'][ $key ] = array_map( 'maybe_unserialize', $value );
            }
          }
        }

        // Include all taxonomies and their terms
        if ( in_array( 'terms', $include ) ) {
          $snapshot['terms'] = [];
          $taxonomies = get_object_taxonomies( $p->post_type );
          foreach ( $taxonomies as $taxonomy ) {
            $terms = wp_get_post_terms( $post_id, $taxonomy, [ 'fields' => 'all' ] );
            if ( !is_wp_error( $terms ) && !empty( $terms ) ) {
              $snapshot['terms'][ $taxonomy ] = array_map( function ( $t ) {
                return [
                  'term_id' => $t->term_id,
                  'name' => $t->name,
                  'slug' => $t->slug,
                ];
              }, $terms );
            }
          }
        }

        // Include featured image
        if ( in_array( 'thumbnail', $include ) ) {
          $thumb_id = get_post_thumbnail_id( $post_id );
          if ( $thumb_id ) {
            $snapshot['thumbnail'] = [
              'ID' => $thumb_id,
              'url' => wp_get_attachment_url( $thumb_id ),
              'alt' => get_post_meta( $thumb_id, '_wp_attachment_image_alt', true ),
            ];
          }
        }

        // Include author
        if ( in_array( 'author', $include ) ) {
          $author = get_userdata( $p->post_author );
          if ( $author ) {
            $snapshot['author'] = [
              'ID' => $author->ID,
              'display_name' => $author->display_name,
              'user_login' => $author->user_login,
            ];
          }
        }

        $this->add_result_text( $r, wp_json_encode( $snapshot, JSON_PRETTY_PRINT ) );
        break;

        /* ===== Posts: create ===== */
      case 'wp_create_post':
        if ( empty( $a['post_title'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'post_title required' ];
          break;
        }
        $ins = [
          'post_title' => sanitize_text_field( $a['post_title'] ),
          'post_status' => sanitize_key( $a['post_status'] ?? 'draft' ),
          'post_type' => sanitize_key( $a['post_type'] ?? 'post' ),
        ];
        if ( $a['post_content'] ?? '' ) {
          $ins['post_content'] = $this->prepare_new_content( $a['post_content'] );
        }
        if ( $a['post_excerpt'] ?? '' ) {
          $ins['post_excerpt'] = $this->clean_html( $a['post_excerpt'] );
        }
        if ( $a['post_name'] ?? '' ) {
          $ins['post_name'] = sanitize_title( $a['post_name'] );
        }

        // Handle JSON strings for meta_input (some MCP clients send objects as JSON strings)
        $meta_input = $a['meta_input'] ?? [];
        if ( is_string( $meta_input ) ) {
          $meta_input = json_decode( $meta_input, true ) ?? [];
        }
        if ( !empty( $meta_input ) && is_array( $meta_input ) ) {
          $ins['meta_input'] = $meta_input;
        }

        $new = wp_insert_post( wp_slash( $ins ), true );
        if ( is_wp_error( $new ) ) {
          $r['error'] = [ 'code' => $new->get_error_code(), 'message' => $new->get_error_message() ];
        }
        else {
          if ( empty( $ins['meta_input'] ) && !empty( $meta_input ) && is_array( $meta_input ) ) {
            foreach ( $meta_input as $k => $v ) {
              // Pass the value as-is: update_post_meta() serializes arrays itself.
              // maybe_serialize() here double-serialized nested arrays, so they read
              // back as a string and consumers (e.g. Noptin) rejected them as legacy.
              update_post_meta( $new, sanitize_key( $k ), $v );
            }
          }
          $this->bust_post_cache( (int) $new, [ 'tool' => 'wp_create_post' ] );
          $this->add_result_text( $r, 'Post created ID ' . $new );
        }
        break;

        /* ===== Posts: write blocks ===== */
      case 'wp_write_blocks':
        if ( empty( $a['ID'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'Post ID required (pass "ID"; create the post first with wp_create_post).' ];
          break;
        }
        $wb_id = intval( $a['ID'] );
        $wb_post = get_post( $wb_id );
        if ( !$wb_post ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'Post ' . $wb_id . ' not found.' ];
          break;
        }
        // Some MCP clients send arrays as JSON strings.
        $wb_blocks = $a['blocks'] ?? null;
        if ( is_string( $wb_blocks ) ) {
          $wb_blocks = json_decode( $wb_blocks, true );
        }
        list( $wb_markup, $wb_err ) = $this->blocks_to_markup( $wb_blocks );
        if ( $wb_err !== null ) {
          $r['error'] = [ 'code' => -32602, 'message' => $wb_err ];
          break;
        }
        $wb_mode = in_array( $a['mode'] ?? 'replace', [ 'replace', 'append', 'prepend' ], true ) ? ( $a['mode'] ?? 'replace' ) : 'replace';
        if ( $wb_mode === 'append' ) {
          $wb_content = trim( $wb_post->post_content . "\n\n" . $wb_markup );
        }
        elseif ( $wb_mode === 'prepend' ) {
          $wb_content = trim( $wb_markup . "\n\n" . $wb_post->post_content );
        }
        else {
          $wb_content = $wb_markup;
        }
        $wb_res = wp_update_post( wp_slash( [ 'ID' => $wb_id, 'post_content' => $wb_content ] ), true );
        if ( is_wp_error( $wb_res ) ) {
          $r['error'] = [ 'code' => $wb_res->get_error_code(), 'message' => $wb_res->get_error_message() ];
          break;
        }
        $this->bust_post_cache( $wb_id, [ 'tool' => 'wp_write_blocks' ] );
        $this->add_result_text( $r, 'Wrote ' . count( $wb_blocks ) . ' block(s) to post ' . $wb_id . ' (mode: ' . $wb_mode . ').' );
        break;

        /* ===== Block patterns: list ===== */
      case 'wp_list_block_patterns':
        if ( !class_exists( 'WP_Block_Patterns_Registry' ) ) {
          $r['error'] = [ 'code' => -32603, 'message' => 'Block patterns are not available on this site.' ];
          break;
        }
        $bp_all = WP_Block_Patterns_Registry::get_instance()->get_all_registered();
        $bp_search = isset( $a['search'] ) ? strtolower( trim( (string) $a['search'] ) ) : '';
        $bp_cat = isset( $a['category'] ) ? sanitize_title( $a['category'] ) : '';
        $bp_content = !empty( $a['include_content'] );
        $bp_limit = isset( $a['limit'] ) ? max( 1, min( 500, (int) $a['limit'] ) ) : 50;
        $bp_list = [];
        foreach ( $bp_all as $pat ) {
          $cats = (array) ( $pat['categories'] ?? [] );
          if ( $bp_cat !== '' && !in_array( $bp_cat, array_map( 'sanitize_title', $cats ), true ) ) {
            continue;
          }
          if ( $bp_search !== '' ) {
            $hay = strtolower( ( $pat['title'] ?? '' ) . ' ' . ( $pat['name'] ?? '' ) . ' ' . ( $pat['description'] ?? '' ) . ' ' . implode( ' ', (array) ( $pat['keywords'] ?? [] ) ) );
            if ( strpos( $hay, $bp_search ) === false ) {
              continue;
            }
          }
          $entry = [
            'name' => $pat['name'] ?? '',
            'title' => $pat['title'] ?? '',
            'categories' => array_values( $cats ),
            'description' => $pat['description'] ?? '',
          ];
          if ( $bp_content ) {
            $entry['content'] = $pat['content'] ?? '';
          }
          $bp_list[] = $entry;
          if ( count( $bp_list ) >= $bp_limit ) {
            break;
          }
        }
        $this->add_result_text( $r, wp_json_encode( [ 'count' => count( $bp_list ), 'total_registered' => count( $bp_all ), 'patterns' => $bp_list ], JSON_PRETTY_PRINT ) );
        break;

        /* ===== Block patterns: insert ===== */
      case 'wp_insert_block_pattern':
        if ( empty( $a['ID'] ) || empty( $a['pattern'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'Both "ID" and "pattern" (a name from wp_list_block_patterns) are required.' ];
          break;
        }
        if ( !class_exists( 'WP_Block_Patterns_Registry' ) ) {
          $r['error'] = [ 'code' => -32603, 'message' => 'Block patterns are not available on this site.' ];
          break;
        }
        $bp_name = sanitize_text_field( $a['pattern'] );
        $bp_reg = WP_Block_Patterns_Registry::get_instance();
        if ( !$bp_reg->is_registered( $bp_name ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'Pattern "' . $bp_name . '" is not registered. Use wp_list_block_patterns to see available names.' ];
          break;
        }
        $bp_pat = $bp_reg->get_registered( $bp_name );
        $bp_markup = (string) ( $bp_pat['content'] ?? '' );
        if ( $bp_markup === '' ) {
          $r['error'] = [ 'code' => -32603, 'message' => 'Pattern "' . $bp_name . '" has no content.' ];
          break;
        }
        $bp_id = intval( $a['ID'] );
        $bp_post = get_post( $bp_id );
        if ( !$bp_post ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'Post ' . $bp_id . ' not found.' ];
          break;
        }
        $bp_mode = in_array( $a['mode'] ?? 'append', [ 'replace', 'append', 'prepend' ], true ) ? ( $a['mode'] ?? 'append' ) : 'append';
        if ( $bp_mode === 'replace' ) {
          $bp_new = $bp_markup;
        }
        elseif ( $bp_mode === 'prepend' ) {
          $bp_new = trim( $bp_markup . "\n\n" . $bp_post->post_content );
        }
        else {
          $bp_new = trim( $bp_post->post_content . "\n\n" . $bp_markup );
        }
        $bp_res = wp_update_post( wp_slash( [ 'ID' => $bp_id, 'post_content' => $bp_new ] ), true );
        if ( is_wp_error( $bp_res ) ) {
          $r['error'] = [ 'code' => $bp_res->get_error_code(), 'message' => $bp_res->get_error_message() ];
          break;
        }
        $this->bust_post_cache( $bp_id, [ 'tool' => 'wp_insert_block_pattern' ] );
        $this->add_result_text( $r, 'Inserted pattern "' . $bp_name . '" into post ' . $bp_id . ' (mode: ' . $bp_mode . ').' );
        break;

        /* ===== Posts: update ===== */
      case 'wp_update_post':
        if ( empty( $a['ID'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'Post ID required (pass "ID", e.g. {"ID": 123}; "post_id" is also accepted).' ];
          break;
        }
        $post_id = intval( $a['ID'] );
        $c = [ 'ID' => $post_id ];

        // Handle JSON strings (some MCP clients send objects as JSON strings)
        $fields_raw = $a['fields'] ?? null;
        $fields = $fields_raw;
        if ( is_string( $fields ) ) {
          $fields = json_decode( $fields, true );
          // Detect truncated/malformed JSON
          if ( $fields === null && strlen( $fields_raw ) > 0 ) {
            $r['error'] = [ 'code' => -32602, 'message' => 'Fields parameter is invalid JSON (possibly truncated). Content may be too large for the transport. Raw length: ' . strlen( $fields_raw ) . ' bytes' ];
            break;
          }
        }
        $fields = $fields ?? [];
        if ( !is_array( $fields ) ) {
          $fields = [];
        }

        // Convenience: also accept post fields passed at the top level instead of
        // nested in "fields". Agents routinely send { ID, post_title } directly and
        // would otherwise get a misleading "no fields provided" error. Nested
        // values win on conflict.
        $topLevelFields = [ 'post_title', 'post_content', 'post_status', 'post_name',
          'post_excerpt', 'post_category', 'post_type', 'post_author', 'post_parent',
          'post_date', 'menu_order', 'comment_status', 'ping_status', 'page_template' ];
        foreach ( $topLevelFields as $fk ) {
          if ( array_key_exists( $fk, $a ) && !array_key_exists( $fk, $fields ) ) {
            $fields[ $fk ] = $a[ $fk ];
          }
        }

        // Track what we're trying to update for verification
        $content_to_verify = null;
        if ( !empty( $fields ) && is_array( $fields ) ) {
          foreach ( $fields as $k => $v ) {
            $c[ $k ] = in_array( $k, [ 'post_content', 'post_excerpt' ], true ) ? $this->store_html( $v ) : sanitize_text_field( $v );
          }
          if ( isset( $c['post_content'] ) ) {
            $content_to_verify = $c['post_content'];
          }
        }

        // Handle schedule_for convenience parameter
        if ( !empty( $a['schedule_for'] ) ) {
          $schedule_date = sanitize_text_field( $a['schedule_for'] );
          $c['post_status'] = 'future';
          $c['post_date'] = $schedule_date;
          $c['post_date_gmt'] = get_gmt_from_date( $schedule_date );
          $c['edit_date'] = true; // Required for WordPress to respect date changes
        }

        // Handle JSON strings for meta_input
        $meta_raw = $a['meta_input'] ?? null;
        $meta_input = $meta_raw;
        if ( is_string( $meta_input ) ) {
          $meta_input = json_decode( $meta_input, true );
          if ( $meta_input === null && strlen( $meta_raw ) > 0 ) {
            $r['error'] = [ 'code' => -32602, 'message' => 'meta_input parameter is invalid JSON (possibly truncated).' ];
            break;
          }
        }
        $meta_input = $meta_input ?? [];
        $has_meta = !empty( $meta_input ) && is_array( $meta_input );
        $has_fields = count( $c ) > 1;

        // Error if nothing to update
        if ( !$has_fields && !$has_meta ) {
          $hint = '';
          if ( isset( $a['fields'] ) || isset( $a['meta_input'] ) ) {
            $hint = ' (parameters were provided but parsed as empty - check for malformed JSON)';
          }
          $r['error'] = [ 'code' => -32602, 'message' => 'No fields or meta_input provided to update. Pass post fields inside a "fields" object (or at the top level), e.g. {"ID": 123, "fields": {"post_title": "..."}}, and/or "meta_input" for custom fields.' . $hint ];
          break;
        }

        // Detect trash / untrash transitions and route through wp_trash_post() /
        // wp_untrash_post() so the proper hooks fire (ACF cleanup, search-index purges,
        // SEO plugins, etc.). A bare wp_update_post( ['post_status' => 'trash'] ) just
        // flips the status field and skips all of that.
        $u = $post_id;
        if ( isset( $c['post_status'] ) ) {
          $current = get_post( $post_id );
          $current_status = $current ? $current->post_status : null;
          $target_status = $c['post_status'];

          if ( $target_status === 'trash' && $current_status !== 'trash' ) {
            $trashed = wp_trash_post( $post_id );
            if ( !$trashed ) {
              $r['error'] = [ 'code' => -32603, 'message' => 'wp_trash_post failed' ];
              break;
            }
            unset( $c['post_status'] );
            $has_fields = count( $c ) > 1;
          }
          elseif ( $current_status === 'trash' && $target_status !== 'trash' ) {
            $untrashed = wp_untrash_post( $post_id );
            if ( !$untrashed ) {
              $r['error'] = [ 'code' => -32603, 'message' => 'wp_untrash_post failed' ];
              break;
            }
            // Leave post_status in $c: wp_untrash_post restores to a previous status, and
            // a subsequent wp_update_post() will set the explicit one the caller asked for.
          }
        }

        // Update post fields if any
        if ( $has_fields ) {
          $u = wp_update_post( wp_slash( $c ), true );
          if ( is_wp_error( $u ) ) {
            $r['error'] = [ 'code' => $u->get_error_code(), 'message' => $u->get_error_message() ];
            break;
          }
        }

        // Update meta if any
        if ( $has_meta ) {
          foreach ( $meta_input as $k => $v ) {
            // Pass the value as-is: update_post_meta() serializes arrays itself.
            // maybe_serialize() here double-serialized nested arrays.
            update_post_meta( $u, sanitize_key( $k ), $v );
          }
        }

        $this->bust_post_cache( (int) $u, [ 'tool' => 'wp_update_post' ] );

        // Verify the update actually took effect
        $updated_post = get_post( $u );
        $result = [
          'post_id' => $u,
          'post_modified' => $updated_post->post_modified,
        ];

        // Verify content was saved correctly if we tried to update it
        if ( $content_to_verify !== null ) {
          $saved_content = $updated_post->post_content;
          $result['content_length'] = strlen( $saved_content );
          if ( $saved_content !== $content_to_verify ) {
            $result['warning'] = 'Content differs from input (sanitization applied or save failed)';
            $result['expected_length'] = strlen( $content_to_verify );
          }
        }

        if ( !empty( $a['schedule_for'] ) ) {
          $result['scheduled_for'] = $a['schedule_for'];
        }

        $this->add_result_text( $r, wp_json_encode( $result, JSON_PRETTY_PRINT ) );
        break;

        /* ===== Posts: delete ===== */
      case 'wp_delete_post':
        if ( empty( $a['ID'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'ID required' ];
          break;
        }
        $delete_id = intval( $a['ID'] );
        $del = wp_delete_post( $delete_id, !empty( $a['force'] ) );
        if ( $del ) {
          $this->bust_post_cache( $delete_id, [ 'tool' => 'wp_delete_post' ] );
          $this->add_result_text( $r, 'Post #' . $a['ID'] . ' deleted' );
        }
        else {
          $r['error'] = [ 'code' => -32603, 'message' => 'Deletion failed' ];
        }
        break;

        /* ===== Posts: alter (search/replace) ===== */
      case 'wp_alter_post':
        if ( empty( $a['ID'] ) || empty( $a['field'] ) || !isset( $a['search'] ) || !isset( $a['replace'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'ID, field, search, and replace required' ];
          break;
        }
        $post_id = intval( $a['ID'] );
        $field = sanitize_key( $a['field'] );
        $search = $a['search'];
        $replace = $a['replace'];
        $is_regex = !empty( $a['regex'] );
        $flags = isset( $a['flags'] ) && is_string( $a['flags'] ) ? $a['flags'] : '';

        // Validate field
        $allowed_fields = [ 'post_content', 'post_excerpt', 'post_title' ];
        if ( !in_array( $field, $allowed_fields, true ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'Field must be: post_content, post_excerpt, or post_title' ];
          break;
        }

        $post = get_post( $post_id );
        if ( !$post ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'Post not found' ];
          break;
        }

        $content = $post->$field;
        $count = 0;

        if ( $is_regex ) {
          list( $compiled, $regex_err ) = $this->compile_alter_regex( $search, $flags );
          if ( $regex_err !== null ) {
            $r['error'] = [ 'code' => -32602, 'message' => $regex_err ];
            break;
          }
          $new_content = preg_replace( $compiled, $replace, $content, -1, $count );
          if ( $new_content === null ) {
            $msg = function_exists( 'preg_last_error_msg' ) ? preg_last_error_msg() : 'PCRE error code ' . preg_last_error();
            $r['error'] = [ 'code' => -32603, 'message' => 'Regex replacement failed: ' . $msg ];
            break;
          }
        }
        else {
          $new_content = str_replace( $search, $replace, $content, $count );
        }

        if ( $count === 0 ) {
          $this->add_result_text( $r, 'No occurrences found; post unchanged.' );
          break;
        }

        // wp_update_post() runs wp_unslash() internally, which would strip the
        // backslash from Unicode escapes like \u003c in block JSON (Rank Math
        // FAQ, etc.) and silently corrupt the post. Pre-slash to compensate.
        $update = wp_update_post( wp_slash( [ 'ID' => $post_id, $field => $new_content ] ), true );
        if ( is_wp_error( $update ) ) {
          $r['error'] = [ 'code' => $update->get_error_code(), 'message' => $update->get_error_message() ];
          break;
        }

        $this->bust_post_cache( $post_id, [ 'tool' => 'wp_alter_post' ] );
        $this->add_result_text( $r, $count . ' replacement' . ( $count === 1 ? '' : 's' ) . ' applied to ' . $field . ' of post #' . $post_id );
        break;

        /* ===== Post-meta ===== */
      case 'wp_get_post_meta':
        if ( empty( $a['ID'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'ID required' ];
          break;
        }
        $pid = intval( $a['ID'] );
        $out = ( $a['key'] ?? '' ) ? get_post_meta( $pid, sanitize_key( $a['key'] ), true ) : get_post_meta( $pid );
        $this->add_result_text( $r, wp_json_encode( $out, JSON_PRETTY_PRINT ) );
        break;

      case 'wp_update_post_meta':
        if ( empty( $a['ID'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'ID required' ];
          break;
        }
        $pid = intval( $a['ID'] );

        // Handle JSON strings for meta (some MCP clients send objects as JSON strings)
        $meta = $a['meta'] ?? null;
        if ( is_string( $meta ) ) {
          $meta = json_decode( $meta, true );
        }

        // Pass values as-is: update_post_meta() serializes arrays itself, so
        // maybe_serialize() here double-serialized nested arrays into a string.
        if ( !empty( $meta ) && is_array( $meta ) ) {
          foreach ( $meta as $k => $v ) {
            update_post_meta( $pid, sanitize_key( $k ), $v );
          }
        }
        elseif ( isset( $a['key'], $a['value'] ) ) {
          update_post_meta( $pid, sanitize_key( $a['key'] ), $a['value'] );
        }
        else {
          $r['error'] = [ 'code' => -32602, 'message' => 'meta array or key/value required' ];
          break;
        }
        $this->add_result_text( $r, 'Meta updated for post #' . $pid );
        break;

      case 'wp_delete_post_meta':
        if ( empty( $a['ID'] ) || empty( $a['key'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'ID & key required' ];
          break;
        }
        $pid = intval( $a['ID'] );
        $key = sanitize_key( $a['key'] );
        // delete_post_meta() serializes the match value itself; don't pre-serialize.
        $done = isset( $a['value'] ) ? delete_post_meta( $pid, $key, $a['value'] ) : delete_post_meta( $pid, $key );
        if ( $done ) {
          $this->add_result_text( $r, 'Meta deleted on post #' . $pid );
        }
        else {
          $r['error'] = [ 'code' => -32603, 'message' => 'Deletion failed' ];
        }
        break;

        /* ===== Featured image ===== */
      case 'wp_set_featured_image':
        if ( empty( $a['post_id'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'post_id required' ];
          break;
        }
        $post_id = intval( $a['post_id'] );
        $media_id = isset( $a['media_id'] ) ? intval( $a['media_id'] ) : 0;
        if ( $media_id ) {
          $done = set_post_thumbnail( $post_id, $media_id );
          if ( $done ) {
            $this->add_result_text( $r, 'Featured image set on post #' . $post_id );
          }
          else {
            $r['error'] = [ 'code' => -32603, 'message' => 'Failed to set thumbnail' ];
          }
        }
        else {
          delete_post_thumbnail( $post_id );
          $this->add_result_text( $r, 'Featured image removed from post #' . $post_id );
        }
        break;

        /* ===== Taxonomies ===== */
      case 'wp_get_taxonomies':
        $pt = sanitize_key( $a['post_type'] ?? 'post' );
        $out = [];
        foreach ( get_object_taxonomies( $pt, 'objects' ) as $t ) {
          $out[] = [ 'key' => $t->name, 'label' => $t->label ];
        }
        $this->add_result_text( $r, wp_json_encode( $out, JSON_PRETTY_PRINT ) );
        break;

      case 'wp_get_terms':
        $tax = sanitize_key( $a['taxonomy'] );
        $args = [
          'taxonomy' => $tax,
          'hide_empty' => false,
          'number' => intval( $a['limit'] ?? 0 ),
          'search' => $a['search'] ?? '',
        ];
        if ( isset( $a['parent'] ) ) {
          $args['parent'] = intval( $a['parent'] );
        }
        $out = [];
        foreach ( get_terms( $args ) as $t ) {
          $out[] = [ 'term_id' => $t->term_id, 'name' => $t->name, 'slug' => $t->slug, 'count' => $t->count ];
        }
        $this->add_result_text( $r, wp_json_encode( $out, JSON_PRETTY_PRINT ) );
        break;

      case 'wp_create_term':
        if ( empty( $a['term_name'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'term_name required' ];
          break;
        }
        $tax = sanitize_key( $a['taxonomy'] );
        $args = [];
        if ( $a['slug'] ?? '' ) {
          $args['slug'] = sanitize_title( $a['slug'] );
        }
        if ( $a['description'] ?? '' ) {
          $args['description'] = sanitize_text_field( $a['description'] );
        }
        if ( isset( $a['parent'] ) ) {
          $args['parent'] = intval( $a['parent'] );
        }
        $term = wp_insert_term( sanitize_text_field( $a['term_name'] ), $tax, $args );
        if ( is_wp_error( $term ) ) {
          $r['error'] = [ 'code' => $term->get_error_code(), 'message' => $term->get_error_message() ];
        }
        else {
          $this->add_result_text( $r, 'Term ' . $term['term_id'] . ' created' );
        }
        break;

      case 'wp_update_term':
        $tid = intval( $a['term_id'] ?? 0 );
        if ( !$tid ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'term_id required' ];
          break;
        }
        $tax = sanitize_key( $a['taxonomy'] );
        $uargs = [];
        foreach ( [ 'name', 'slug', 'description', 'parent' ] as $f ) {
          if ( isset( $a[$f] ) ) {
            $uargs[$f] = $a[$f];
          }
        }
        $t = wp_update_term( $tid, $tax, $uargs );
        if ( is_wp_error( $t ) ) {
          $r['error'] = [ 'code' => $t->get_error_code(), 'message' => $t->get_error_message() ];
        }
        else {
          $this->add_result_text( $r, 'Term ' . $tid . ' updated' );
        }
        break;

      case 'wp_delete_term':
        $tid = intval( $a['term_id'] ?? 0 );
        if ( !$tid ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'term_id required' ];
          break;
        }
        $tax = sanitize_key( $a['taxonomy'] );
        $d = wp_delete_term( $tid, $tax );
        if ( $d ) {
          $this->add_result_text( $r, 'Term ' . $tid . ' deleted' );
        }
        else {
          $r['error'] = [ 'code' => -32603, 'message' => 'Deletion failed' ];
        }
        break;

      case 'wp_get_post_terms':
        if ( empty( $a['ID'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'ID required' ];
          break;
        }
        $tax = sanitize_key( $a['taxonomy'] ?? 'category' );
        $out = [];
        foreach ( wp_get_post_terms( intval( $a['ID'] ), $tax, [ 'fields' => 'all' ] ) as $t ) {
          $out[] = [ 'term_id' => $t->term_id, 'name' => $t->name ];
        }
        $this->add_result_text( $r, wp_json_encode( $out, JSON_PRETTY_PRINT ) );
        break;

      case 'wp_add_post_terms':
        if ( empty( $a['ID'] ) || empty( $a['terms'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'ID & terms required' ];
          break;
        }
        $terms = $a['terms'];
        // Handle JSON strings (some MCP clients send arrays as JSON strings)
        if ( is_string( $terms ) ) {
          $terms = json_decode( $terms, true ) ?? [];
        }
        $tax = sanitize_key( $a['taxonomy'] ?? 'category' );
        $append = !isset( $a['append'] ) || $a['append'];
        $set = wp_set_post_terms( intval( $a['ID'] ), $terms, $tax, $append );
        if ( is_wp_error( $set ) ) {
          $r['error'] = [ 'code' => $set->get_error_code(), 'message' => $set->get_error_message() ];
        }
        else {
          $this->add_result_text( $r, 'Terms set for post #' . $a['ID'] );
        }
        break;

        /* ===== Media: list ===== */
      case 'wp_get_media':
        $q = [
          'post_type' => 'attachment',
          's' => $a['search'] ?? '',
          'posts_per_page' => max( 1, intval( $a['limit'] ?? 10 ) ),
          'post_status' => 'inherit',
        ];
        if ( isset( $a['author'] ) ) {
          $q['author'] = intval( $a['author'] );
        }
        elseif ( $a['author_name'] ?? '' ) {
          $q['author_name'] = sanitize_title( $a['author_name'] );
        }
        $d = [];
        if ( $a['after'] ?? '' ) {
          $d['after'] = $a['after'];
        }
        if ( $a['before'] ?? '' ) {
          $d['before'] = $a['before'];
        }
        if ( $d ) {
          $q['date_query'] = [ $d ];
        }
        $list = [];
        foreach ( get_posts( $q ) as $m ) {
          $list[] = [ 'ID' => $m->ID, 'title' => $m->post_title, 'url' => wp_get_attachment_url( $m->ID ) ];
        }
        $this->add_result_text( $r, wp_json_encode( $list, JSON_PRETTY_PRINT ) );
        break;

        /* ===== Media: upload ===== */
      case 'wp_upload_media':
        $has_url = !empty( $a['url'] );
        $has_base64 = !empty( $a['base64'] ) && !empty( $a['filename'] );
        if ( !$has_url && !$has_base64 ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'Provide either url, or base64 + filename.' ];
          break;
        }
        try {
          require_once ABSPATH . 'wp-admin/includes/file.php';
          require_once ABSPATH . 'wp-admin/includes/media.php';
          require_once ABSPATH . 'wp-admin/includes/image.php';

          if ( $has_url ) {
            $tmp = download_url( $a['url'] );
            if ( is_wp_error( $tmp ) ) {
              // WP_Error codes are strings (e.g. http_request_failed); Exception's
              // $code must be an int, so keep the code in the message instead.
              throw new Exception( 'Download failed (' . $tmp->get_error_code() . '): ' . $tmp->get_error_message() );
            }
            // URLs like https://picsum.photos/800/600 have no file extension, so
            // basename() yields a name that media_handle_sideload() rejects. Sniff
            // the real type of the downloaded file and append a proper extension.
            $name = basename( parse_url( $a['url'], PHP_URL_PATH ) );
            if ( $name === '' || pathinfo( $name, PATHINFO_EXTENSION ) === '' ) {
              $ext = '';
              $check = wp_check_filetype_and_ext( $tmp, $name ?: 'image' );
              if ( !empty( $check['ext'] ) ) {
                $ext = $check['ext'];
              }
              elseif ( function_exists( 'mime_content_type' ) ) {
                $map = [ 'image/jpeg' => 'jpg', 'image/png' => 'png', 'image/gif' => 'gif', 'image/webp' => 'webp' ];
                $ext = $map[ mime_content_type( $tmp ) ] ?? '';
              }
              $name = ( $name ?: 'image' ) . ( $ext ? '.' . $ext : '' );
            }
            $file = [ 'name' => sanitize_file_name( $name ), 'tmp_name' => $tmp ];
          }
          else {
            $decoded = base64_decode( $a['base64'], true );
            if ( $decoded === false ) {
              throw new Exception( 'Invalid base64 data.' );
            }
            $tmp = wp_tempnam( $a['filename'] );
            file_put_contents( $tmp, $decoded );
            $file = [ 'name' => sanitize_file_name( $a['filename'] ), 'tmp_name' => $tmp ];
          }

          $id = media_handle_sideload( $file, 0, $a['description'] ?? '' );
          @unlink( $tmp );
          if ( is_wp_error( $id ) ) {
            throw new Exception( 'Sideload failed (' . $id->get_error_code() . '): ' . $id->get_error_message() );
          }
          if ( $a['title'] ?? '' ) {
            wp_update_post( wp_slash( [ 'ID' => $id, 'post_title' => sanitize_text_field( $a['title'] ) ] ) );
          }
          if ( $a['alt'] ?? '' ) {
            update_post_meta( $id, '_wp_attachment_image_alt', sanitize_text_field( $a['alt'] ) );
          }
          $this->add_result_text( $r, wp_get_attachment_url( $id ) );
        }
        catch ( \Throwable $e ) {
          $r['error'] = [ 'code' => $e->getCode() ?: -32603, 'message' => $e->getMessage() ];
        }
        break;

        /* ===== Media: upload alternative (two-step) ===== */
      case 'wp_upload_request':
        if ( empty( $a['filename'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'filename required' ];
          break;
        }
        try {
          $token = wp_generate_password( 32, false );
          $transient_key = 'mwai_mcp_upload_' . $token;
          $data = [
            'filename' => sanitize_file_name( $a['filename'] ),
            'title' => $a['title'] ?? '',
            'description' => $a['description'] ?? '',
            'alt' => $a['alt'] ?? '',
          ];
          set_transient( $transient_key, $data, 5 * MINUTE_IN_SECONDS );
          $upload_url = rest_url( 'mcp/v1/upload/' . $token );
          $this->add_result_text( $r, wp_json_encode( [
            'upload_url' => $upload_url,
            'expires_in' => '5 minutes',
            'usage' => 'curl -X POST -F "file=@/path/to/' . $a['filename'] . '" "' . $upload_url . '"',
          ], JSON_PRETTY_PRINT ) );
        }
        catch ( \Throwable $e ) {
          $r['error'] = [ 'code' => $e->getCode() ?: -32603, 'message' => $e->getMessage() ];
        }
        break;

        /* ===== Media: update ===== */
      case 'wp_update_media':
        if ( empty( $a['ID'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'ID required' ];
          break;
        }
        $upd = [ 'ID' => intval( $a['ID'] ) ];
        if ( $a['title'] ?? '' ) {
          $upd['post_title'] = sanitize_text_field( $a['title'] );
        }
        if ( $a['caption'] ?? '' ) {
          $upd['post_excerpt'] = $this->clean_html( $a['caption'] );
        }
        if ( $a['description'] ?? '' ) {
          $upd['post_content'] = $this->clean_html( $a['description'] );
        }
        $u = wp_update_post( wp_slash( $upd ), true );
        if ( is_wp_error( $u ) ) {
          $r['error'] = [ 'code' => $u->get_error_code(), 'message' => $u->get_error_message() ];
        }
        else {
          if ( $a['alt'] ?? '' ) {
            update_post_meta( $u, '_wp_attachment_image_alt', sanitize_text_field( $a['alt'] ) );
          }
          $this->add_result_text( $r, 'Media #' . $u . ' updated' );
        }
        break;

        /* ===== Media: delete ===== */
      case 'wp_delete_media':
        if ( empty( $a['ID'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'ID required' ];
          break;
        }
        $d = wp_delete_post( intval( $a['ID'] ), !empty( $a['force'] ) );
        if ( $d ) {
          $this->add_result_text( $r, 'Media #' . $a['ID'] . ' deleted' );
        }
        else {
          $r['error'] = [ 'code' => -32603, 'message' => 'Deletion failed' ];
        }
        break;

        /* ===== MWAI Vision ===== */
      case 'mwai_vision':
        if ( empty( $a['message'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'message required' ];
          break;
        }
        global $mwai;
        if ( !isset( $mwai ) ) {
          $r['error'] = [ 'code' => -32603, 'message' => 'MWAI not found' ];
          break;
        }
        $analysis = $mwai->simpleVisionQuery(
          $a['message'],
          $a['url'] ?? null,
          $a['path'] ?? null,
          [ 'scope' => 'mcp' ]
        );
        $this->add_result_text( $r, is_string( $analysis ) ? $analysis : wp_json_encode( $analysis, JSON_PRETTY_PRINT ) );
        break;

        /* ===== MWAI Image ===== */
      case 'mwai_image':
        if ( empty( $a['message'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'message required' ];
          break;
        }
        global $mwai;
        if ( !isset( $mwai ) ) {
          $r['error'] = [ 'code' => -32603, 'message' => 'MWAI not found' ];
          break;
        }

        $media = $mwai->imageQueryForMediaLibrary( $a['message'], [ 'scope' => 'mcp' ], $a['postId'] ?? null );
        if ( is_wp_error( $media ) ) {
          $r['error'] = [ 'code' => $media->get_error_code(), 'message' => $media->get_error_message() ];
          break;
        }

        $mid = intval( $media['id'] );

        $upd = [ 'ID' => $mid ];
        if ( !empty( $a['title'] ) ) {
          $upd['post_title'] = sanitize_text_field( $a['title'] );
        }
        if ( !empty( $a['caption'] ) ) {
          $upd['post_excerpt'] = $this->clean_html( $a['caption'] );
        }
        if ( !empty( $a['description'] ) ) {
          $upd['post_content'] = $this->clean_html( $a['description'] );
        }
        if ( count( $upd ) > 1 ) {
          wp_update_post( wp_slash( $upd ), true );
        }
        if ( array_key_exists( 'alt', $a ) ) {
          update_post_meta( $mid, '_wp_attachment_image_alt', sanitize_text_field( (string) $a['alt'] ) );
        }

        $media = [
          'id' => $mid,
          'url' => wp_get_attachment_url( $mid ),
          'title' => get_the_title( $mid ),
          'caption' => wp_get_attachment_caption( $mid ),
          'alt' => get_post_meta( $mid, '_wp_attachment_image_alt', true ),
        ];
        $this->add_result_text( $r, wp_json_encode( $media, JSON_PRETTY_PRINT ) );
        break;

      default: $r['error'] = [ 'code' => -32601, 'message' => 'Unknown tool' ];
    }

    // Generic post-write hook: fires after any successful content-mutating tool
    // (create/update/delete of posts, terms, meta, media, comments, users,
    // options...). Integrations can hook this to purge page/object caches, reindex
    // search, write an audit log, etc. The options/object cache is already updated
    // by WordPress, but full-page caches (Varnish, WP Rocket, Cloudflare) are not,
    // so a cache layer should listen here. Reads never trigger it.
    if ( empty( $r['error'] ) && $this->is_mutating_tool( $tool ) ) {
      do_action( 'mwai_mcp_mutate', $tool, $a, $r );
    }
    return $r;
  }

  // Whether a tool changes site state (so the mwai_mcp_mutate hook should fire).
  // Anything declared accessLevel "write" mutates; a few "admin" tools mutate too
  // (the rest, e.g. wp_get_option, are reads).
  private function is_mutating_tool( string $tool ): bool {
    $defs = $this->tools();
    if ( ( $defs[ $tool ]['accessLevel'] ?? '' ) === 'write' ) {
      return true;
    }
    return in_array( $tool, [ 'wp_update_option', 'wp_create_user', 'wp_update_user' ], true );
  }
  #endregion
}
