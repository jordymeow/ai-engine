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
  private function post_excerpt( WP_Post $p ): string {
    return wp_trim_words( wp_strip_all_tags( $p->post_excerpt ?: $p->post_content ), 55 );
  }
  private function empty_schema(): array {
    return [ 'type' => 'object', 'properties' => (object) [] ];
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
      ],

      /* -------- Comments -------- */
      'wp_get_comments' => [
        'name' => 'wp_get_comments',
        'description' => 'Retrieve comments (fields: comment_ID, comment_post_ID, comment_author, comment_content, comment_date, comment_approved). Returns 10 by default.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'post_id' => [ 'type' => 'integer' ],
            'status' => [ 'type' => 'string' ],
            'search' => [ 'type' => 'string' ],
            'limit' => [ 'type' => 'integer' ],
            'offset' => [ 'type' => 'integer' ],
            'paged' => [ 'type' => 'integer' ],
          ],
        ],
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
      ],

      /* -------- Options -------- */
      'wp_get_option' => [
        'name' => 'wp_get_option',
        'description' => 'Get a single WordPress option value (scalar or array) by key.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [ 'key' => [ 'type' => 'string' ] ],
          'required' => [ 'key' ],
        ],
      ],
      'wp_update_option' => [
        'name' => 'wp_update_option',
        'description' => 'Create or update a WordPress option (JSON-serialised if necessary).',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'key' => [ 'type' => 'string' ],
            'value' => [ 'type' => [ 'string', 'number', 'boolean', 'object', 'array' ] ],
          ],
          'required' => [ 'key', 'value' ],
        ],
      ],

      /* -------- Counts -------- */
      'wp_count_posts' => [
        'name' => 'wp_count_posts',
        'description' => 'Return counts of posts by status. Optional post_type (default post).',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [ 'post_type' => [ 'type' => 'string' ] ],
        ],
      ],
      'wp_count_terms' => [
        'name' => 'wp_count_terms',
        'description' => 'Return total number of terms in a taxonomy.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [ 'taxonomy' => [ 'type' => 'string' ] ],
          'required' => [ 'taxonomy' ],
        ],
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
      ],

      /* -------- Post-types -------- */
      'wp_get_post_types' => [
        'name' => 'wp_get_post_types',
        'description' => 'List public post types (key, label).',
        'inputSchema' => $this->empty_schema(),
      ],

      /* -------- Posts -------- */
      'wp_get_posts' => [
        'name' => 'wp_get_posts',
        'description' => 'Retrieve posts (fields: ID, title, status, excerpt, link). No full content. **If no limit is supplied it returns 10 posts by default.** `paged` is ignored if `offset` is used.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'post_type' => [ 'type' => 'string' ],
            'post_status' => [ 'type' => 'string' ],
            'search' => [ 'type' => 'string' ],
            'after' => [ 'type' => 'string' ],
            'before' => [ 'type' => 'string' ],
            'limit' => [ 'type' => 'integer' ],
            'offset' => [ 'type' => 'integer' ],
            'paged' => [ 'type' => 'integer' ],
          ],
        ],
      ],
      'wp_get_post' => [
        'name' => 'wp_get_post',
        'description' => 'Get basic post data by ID (title, content, status, dates). For complete data including all meta and terms, use wp_get_post_snapshot instead.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [ 'ID' => [ 'type' => 'integer' ] ],
          'required' => [ 'ID' ],
        ],
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
          ],
          'required' => [ 'ID' ],
        ],
      ],
      'wp_create_post' => [
        'name' => 'wp_create_post',
        'description' => 'Create a post or page – post_title required; Markdown accepted in post_content; defaults to draft post_status and post post_type; set categories later with wp_add_post_terms; meta_input is an associative array of custom-field key/value pairs.',
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
      ],
      'wp_update_post' => [
        'name' => 'wp_update_post',
        'description' => 'Update post fields and/or meta in ONE call. Pass ID + "fields" object (post_title, post_content, post_status, etc.) and/or "meta_input" object for custom fields. Efficient for WooCommerce products: update title + price + stock together. Note: post_category REPLACES categories; use wp_add_post_terms to append instead. Use schedule_for to easily schedule posts.',
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
      ],
      'wp_delete_post' => [
        'name' => 'wp_delete_post',
        'description' => 'Delete/trash a post.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'ID' => [ 'type' => 'integer' ],
            'force' => [ 'type' => 'boolean' ],
          ],
          'required' => [ 'ID' ],
        ],
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
      ],

      /* -------- Taxonomies / Terms -------- */
      'wp_get_taxonomies' => [
        'name' => 'wp_get_taxonomies',
        'description' => 'List taxonomies for a post type.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [ 'post_type' => [ 'type' => 'string' ] ],
        ],
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
      ],

      /* -------- Media -------- */
      'wp_get_media' => [
        'name' => 'wp_get_media',
        'description' => 'List media items.',
        'inputSchema' => [
          'type' => 'object',
          'properties' => [
            'search' => [ 'type' => 'string' ],
            'after' => [ 'type' => 'string' ],
            'before' => [ 'type' => 'string' ],
            'limit' => [ 'type' => 'integer' ],
          ],
        ],
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
        $data = [
          'user_login' => sanitize_user( $a['user_login'] ),
          'user_email' => sanitize_email( $a['user_email'] ),
          'user_pass' => $a['user_pass'] ?? wp_generate_password( 12, true ),
          'display_name' => sanitize_text_field( $a['display_name'] ?? '' ),
          'role' => sanitize_key( $a['role'] ?? get_option( 'default_role', 'subscriber' ) ),
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
        $upd = [ 'ID' => intval( $a['ID'] ) ];
        if ( !empty( $a['fields'] ) && is_array( $a['fields'] ) ) {
          foreach ( $a['fields'] as $k => $v ) {
            $upd[ $k ] = ( $k === 'role' ) ? sanitize_key( $v ) : sanitize_text_field( $v );
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
        $val = get_option( sanitize_key( $a['key'] ) );
        $this->add_result_text( $r, wp_json_encode( $val, JSON_PRETTY_PRINT ) );
        break;

      case 'wp_update_option':
        $set = update_option( sanitize_key( $a['key'] ), $a['value'], 'yes' );
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
          $r['error'] = [ 'code' => -32602, 'message' => 'ID required' ];
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
          'post_content' => $this->clean_html( $p->post_content ),
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
          $r['error'] = [ 'code' => -32602, 'message' => 'ID required' ];
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
          $snapshot['post']['post_content'] = $this->clean_html( $p->post_content );
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
          $ins['post_content'] = $this->core->markdown_to_html( $a['post_content'] );
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

        $new = wp_insert_post( $ins, true );
        if ( is_wp_error( $new ) ) {
          $r['error'] = [ 'code' => $new->get_error_code(), 'message' => $new->get_error_message() ];
        }
        else {
          if ( empty( $ins['meta_input'] ) && !empty( $meta_input ) && is_array( $meta_input ) ) {
            foreach ( $meta_input as $k => $v ) {
              update_post_meta( $new, sanitize_key( $k ), maybe_serialize( $v ) );
            }
          }
          $this->add_result_text( $r, 'Post created ID ' . $new );
        }
        break;

        /* ===== Posts: update ===== */
      case 'wp_update_post':
        if ( empty( $a['ID'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'ID required' ];
          break;
        }
        $c = [ 'ID' => intval( $a['ID'] ) ];

        // Handle JSON strings (some MCP clients send objects as JSON strings)
        $fields = $a['fields'] ?? [];
        if ( is_string( $fields ) ) {
          $fields = json_decode( $fields, true ) ?? [];
        }
        if ( !empty( $fields ) && is_array( $fields ) ) {
          foreach ( $fields as $k => $v ) {
            $c[ $k ] = in_array( $k, [ 'post_content', 'post_excerpt' ], true ) ? $this->clean_html( $v ) : sanitize_text_field( $v );
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

        $u = ( count( $c ) > 1 ) ? wp_update_post( $c, true ) : $c['ID'];
        if ( is_wp_error( $u ) ) {
          $r['error'] = [ 'code' => $u->get_error_code(), 'message' => $u->get_error_message() ];
          break;
        }

        // Handle JSON strings for meta_input
        $meta_input = $a['meta_input'] ?? [];
        if ( is_string( $meta_input ) ) {
          $meta_input = json_decode( $meta_input, true ) ?? [];
        }
        if ( !empty( $meta_input ) && is_array( $meta_input ) ) {
          foreach ( $meta_input as $k => $v ) {
            update_post_meta( $u, sanitize_key( $k ), maybe_serialize( $v ) );
          }
        }
        $msg = 'Post #' . $u . ' updated';
        if ( !empty( $a['schedule_for'] ) ) {
          $msg .= ' and scheduled for ' . $a['schedule_for'];
        }
        $this->add_result_text( $r, $msg );
        break;

        /* ===== Posts: delete ===== */
      case 'wp_delete_post':
        if ( empty( $a['ID'] ) ) {
          $r['error'] = [ 'code' => -32602, 'message' => 'ID required' ];
          break;
        }
        $del = wp_delete_post( intval( $a['ID'] ), !empty( $a['force'] ) );
        if ( $del ) {
          $this->add_result_text( $r, 'Post #' . $a['ID'] . ' deleted' );
        }
        else {
          $r['error'] = [ 'code' => -32603, 'message' => 'Deletion failed' ];
        }
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

        if ( !empty( $meta ) && is_array( $meta ) ) {
          foreach ( $meta as $k => $v ) {
            update_post_meta( $pid, sanitize_key( $k ), maybe_serialize( $v ) );
          }
        }
        elseif ( isset( $a['key'], $a['value'] ) ) {
          update_post_meta( $pid, sanitize_key( $a['key'] ), maybe_serialize( $a['value'] ) );
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
        $done = isset( $a['value'] ) ? delete_post_meta( $pid, $key, maybe_serialize( $a['value'] ) ) : delete_post_meta( $pid, $key );
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
              throw new Exception( $tmp->get_error_message(), $tmp->get_error_code() );
            }
            $file = [ 'name' => basename( parse_url( $a['url'], PHP_URL_PATH ) ), 'tmp_name' => $tmp ];
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
            throw new Exception( $id->get_error_message(), $id->get_error_code() );
          }
          if ( $a['title'] ?? '' ) {
            wp_update_post( [ 'ID' => $id, 'post_title' => sanitize_text_field( $a['title'] ) ] );
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
        $u = wp_update_post( $upd, true );
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
          wp_update_post( $upd, true );
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
    return $r;
  }
  #endregion
}
