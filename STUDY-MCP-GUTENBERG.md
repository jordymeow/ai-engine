# STUDY-MCP-GUTENBERG.md — `wp_write_blocks` design

> Implementation-ready design for a new MCP tool that lets an AI agent build valid
> Gutenberg pages from a simple JSON block spec. This is backlog item A.1 in
> `STUDY-MCP.md` and the feature that unlocks the "agent builds a page" demo for the
> vibe.meowapps.com site. Read `STUDY-MCP.md` first for the layered plan and the
> competitor context (Novamira solves this with a browser finalizer; we do it
> headless with curated core blocks).

## The problem

`wp_create_post` / `wp_update_post` already store Gutenberg markup as-is. The gap is
that an agent has to hand-author the block markup (the `<!-- wp:x -->` delimiters,
attribute JSON, and exact save-HTML). If any of that does not byte-match what the
block's JS `save()` would produce, the editor shows "This block contains unexpected or
invalid content" on open. That markup is sensitive to classes, whitespace, and WP
version.

## The approach (headless, curated, production-safe)

Ship a small, conservative renderer that turns a simplified block spec into canonical
core-block markup on the server. We only cover core blocks whose save output is stable
across WP 6.x, so pages open clean in the editor. No browser step, no third-party
blocks in v1. This covers roughly 90 percent of "write me a page." A `html` escape
hatch (core/html) handles anything else and is always valid because it stores raw HTML.

## Tool surface

Tool name: **`wp_write_blocks`**. Access level: `write` (same as `wp_create_post`).

Input schema:

```jsonc
{
  "ID": 123,                 // required, target post/page ID (create it first with wp_create_post)
  "blocks": [ ... ],         // required, ordered array of block specs (see below)
  "mode": "replace"          // optional: replace (default) | append | prepend
}
```

Design notes:
- Operates on an existing post. The agent creates the page with `wp_create_post`
  (empty or titled), then calls `wp_write_blocks`. This keeps the tool composable and
  small, and reuses the existing create path, cache-busting, and permissions.
- `mode` lets the agent build a page incrementally (append sections) without resending
  the whole body, mirroring how `wp_alter_post` already supports surgical edits.
- No partial writes: if any block spec is invalid, the whole call aborts with an error
  that names the offending index and the supported types, so the agent can retry.

## Block spec format (v1)

Each block is `{ "type": "...", ...fields }`. Supported types and their fields:

| type | fields | notes |
|---|---|---|
| `paragraph` | `content` | inline HTML allowed (wp_kses_post) |
| `heading` | `content`, `level` (1-6, default 2) | |
| `list` | `items` (array of strings), `ordered` (bool) | flat list in v1 |
| `quote` | `content`, `citation` | |
| `image` | `url`, `alt`, `caption` | external URL or media URL; `id` optional |
| `buttons` | `buttons` (array of `{text, url}`) | |
| `group` | `blocks` (array of block specs) | container, recurses |
| `columns` | `columns` (array of arrays of block specs) | container, recurses |
| `separator` | none | |
| `spacer` | `height` (px, default 100) | |
| `code` | `content` | escaped as code |
| `html` | `content` | raw HTML, stored in a core/html block (always valid) |

Example input:

```json
{
  "ID": 42,
  "blocks": [
    { "type": "heading", "level": 1, "content": "Welcome" },
    { "type": "paragraph", "content": "The <strong>fastest</strong> way to start." },
    { "type": "buttons", "buttons": [ { "text": "Get started", "url": "/start" } ] },
    { "type": "columns", "columns": [
      [ { "type": "heading", "level": 3, "content": "Fast" }, { "type": "paragraph", "content": "..." } ],
      [ { "type": "heading", "level": 3, "content": "Safe" }, { "type": "paragraph", "content": "..." } ]
    ] }
  ]
}
```

## Proposed canonical markup (to VALIDATE in the editor before shipping)

These are drafted from WP 6.x core save output. Each MUST be confirmed against the real
block editor on ai.nekod.net (see Validation below) because classes and whitespace
matter for validation.

```
paragraph:  <!-- wp:paragraph -->\n<p>{content}</p>\n<!-- /wp:paragraph -->
heading:    <!-- wp:heading{ {"level":N} if N!=2 } -->\n<hN class="wp-block-heading">{content}</hN>\n<!-- /wp:heading -->
list:       <!-- wp:list{ {"ordered":true} if ordered } -->\n<ul|ol class="wp-block-list">{items}</ul|ol>\n<!-- /wp:list -->
  list-item:  <!-- wp:list-item -->\n<li>{item}</li>\n<!-- /wp:list-item -->
quote:      <!-- wp:quote -->\n<blockquote class="wp-block-quote">{inner paragraph}{<cite>citation</cite>}</blockquote>\n<!-- /wp:quote -->
image:      <!-- wp:image -->\n<figure class="wp-block-image"><img src="{url}" alt="{alt}"/>{<figcaption class="wp-block-image__caption">caption</figcaption>}</figure>\n<!-- /wp:image -->
buttons:    <!-- wp:buttons -->\n<div class="wp-block-buttons">{buttons}</div>\n<!-- /wp:buttons -->
  button:     <!-- wp:button -->\n<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="{url}">{text}</a></div>\n<!-- /wp:button -->
group:      <!-- wp:group -->\n<div class="wp-block-group">{inner}</div>\n<!-- /wp:group -->
columns:    <!-- wp:columns -->\n<div class="wp-block-columns">{columns}</div>\n<!-- /wp:columns -->
  column:     <!-- wp:column -->\n<div class="wp-block-column">{inner}</div>\n<!-- /wp:column -->
separator:  <!-- wp:separator -->\n<hr class="wp-block-separator has-alpha-channel-opacity"/>\n<!-- /wp:separator -->
spacer:     <!-- wp:spacer{ {"height":"{h}px"} } -->\n<div style="height:{h}px" aria-hidden="true" class="wp-block-spacer"></div>\n<!-- /wp:spacer -->
code:       <!-- wp:code -->\n<pre class="wp-block-code"><code>{esc}</code></pre>\n<!-- /wp:code -->
html:       <!-- wp:html -->\n{raw}\n<!-- /wp:html -->
```

## Implementation plan (labs/mcp-core.php)

Additive only, no changes to existing tools.
1. Register `wp_write_blocks` in the tools array (near `wp_create_post`, line ~444).
2. Add a `wp_write_blocks` case in `handle_call` that loads the post, renders the
   markup, applies `mode`, updates `post_content` via `wp_update_post`, and calls
   `bust_post_cache`.
3. Add `blocks_to_markup( $blocks )` returning `[ markup, error ]` (recursive for
   group/columns), and a `render_block_spec( $type, $b )` switch. Reuse `clean_html`
   for the final content sanitization. Escaping per field: `esc_url` for urls,
   `esc_attr` for alt, `wp_kses_post` for text/content, `intval` + clamp for level and
   height. Unknown type or malformed spec aborts with a clear error (no partial write).
4. Keep the block set in a class constant so it is easy to extend.

## Validation (mandatory before shipping)

The renderer logic is unit-testable, but validity is only provable in the editor:
1. Generate the sample page markup for every supported block.
2. Create a page on ai.nekod.net with that markup.
3. Open it in the Gutenberg editor (via Chrome automation) and confirm zero "invalid
   content" warnings on every block.
4. Fix any class or whitespace mismatch, re-test. Only then finalize the tool
   description and mark the feature done.

## Out of scope for v1 (note in the tool description)

Third-party blocks, cover, media-text, table, gallery, embed, navigation, and Global
Styles. These come later, some via patterns (backlog A.2) and some only via the
optional browser finalizer (backlog A.3). The `html` block is the interim escape hatch.

## Progress

- 2026-07-02: Design written.
- 2026-07-02: Implemented in `labs/mcp-core.php` (free tier). Tool `wp_write_blocks` registered,
  `blocks_to_markup()` + `render_block_spec()` renderer added, handler case wired with
  replace/append/prepend and no-partial-write. `php -l` clean, pcf-formatted. Structural
  round-trip of a mixed sample through the real WP `WP_Block_Parser`
  (`/Users/meow/Local Sites/ai/app/public`) passes: all 13 blocks recognized as their core
  types with correct nesting, no freeform fallback.
- 2026-07-02: JS editor validation DONE against ai.nekod.net (WP editor `wp.blocks.parse`, which
  sets per-block `isValid` using the live registry + deprecations). First pass: 23/24 valid; the
  only failure was `core/image`, which expects figcaption class `wp-element-caption`, not the older
  `wp-block-image__caption`. Fixed that one class. Re-validated the full sample: 24/24 blocks valid,
  zero invalid, zero freeform, across all 15 core block types (paragraph, heading, list, list-item,
  quote, image, buttons, button, group, columns, column, separator, spacer, code, html). Renderer
  output is editor-valid on the current WP. `php -l` clean, pcf-formatted.
- 2026-07-02: END-TO-END VERIFIED through a real MCP client (ai-nekod reconnected so the harness picked
  up the tools). Created page 376 via wp_create_post, wrote a mixed layout with wp_write_blocks (replace),
  appended the `twentytwentyfive/cta-centered-heading` pattern with wp_insert_block_pattern, opened it in
  the live editor: 17 blocks, 0 invalid. Confirms transport/auth/registration/dispatch/handler/renderer/
  pattern-fetch/slashing/wp_update_post all work. Test page deleted. Feature is fully shipped.
