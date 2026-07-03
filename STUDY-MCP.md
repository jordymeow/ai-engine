# STUDY-MCP.md — AI Engine MCP: state, strategy, and improvement backlog

> **Living planning doc.** MCP + chatbot/agentic is AI Engine's core focus, so this is refined
> incrementally: target **at least one shipped (or proposed) MCP improvement every 3–4 days, surfaced via `/pulse`**.
> Each pulse: pick the highest-value unchecked item that fits the available time, ship it production-safe,
> and append a dated line to the Progress Log. Read `STRATEGY.md` first for the broader posture.

## Why this matters

WordPress is standardizing on the **Abilities API** (in core since 6.9, Feb 2026) plus the official
**MCP Adapter** (`wordpress/mcp-adapter`, now canonical), and **WP 7.0 ships an AI Client**. AI Engine's job
is to be the **safe, production-ready, extensible home for MCP on WordPress**, and to stay interoperable
with that core direction.

## Positioning (frame from strength — we are NOT a limited toolset)

- **~90 tools** across: posts, terms, media, users, comments, options, counts, plugin management,
  theme management (incl. file read/write/alter), Polylang, 27 WooCommerce tools, and a guarded `wp_db_query`.
- **Modern server**: OAuth 2.1 (PKCE + Dynamic Client Registration), bearer token, streamable HTTP,
  `.well-known` discovery, and a WAF-aware self-test diagnostic.
- **Production-safe by design**: curated, capability-gated tools. No arbitrary PHP eval / arbitrary filesystem.
  That dangerous "do anything" model is the dev-only competitor lane (e.g. Novamira), not ours.

## Strategic context

- Abilities API in core (WP 6.9); `wordpress/mcp-adapter` is the canonical package (typed DTOs). WP 7.0 ships the AI Client.
- Competitor watch: **Novamira** — dev-only RCE MCP server, built on the Abilities API, NOT in the wp.org repo.
  Their only real lead is Gutenberg page authoring. (See memory `reference_novamira_mcp_competitor`.)
- Competitor watch: **WPVibe / `vibe-ai`** — Awesome Motive (SeedProd). Cloud-RELAY MCP server: their plugin
  ships the site's Application Password to their Cloudflare infra and all AI traffic flows through them.
  2k installs vs our 100k (2026-07), but the WPBeginner/SEJ/YouTuber machine plus an eventual in-admin
  cross-promo push across the Awesome Motive family is the real threat. Their leads: near-zero-friction
  onboarding (magic link, ~60s, works with ChatGPT), user-VISIBLE safety UX (dry-run previews, approval
  gates, audit log), and a theme-builder demo that films well. Our counters: self-hosted (credentials never
  leave the site, no middleman reading content), free with no monthly caps, ~90 tools vs 27, full platform.
  (See memory `reference_wpvibe_competitor`.)

## Improvement backlog (pick from here each /pulse)

### A. Product capability — user-demanded, safe, on-brand
- [~] **Gutenberg block authoring** — `wp_write_blocks` IMPLEMENTED (2026-07-02) in `labs/mcp-core.php`
      (free tier). 12 core block types (paragraph, heading, list, quote, image, buttons, group,
      columns, separator, spacer, code, html), replace/append/prepend modes, no partial writes.
      Design in `STUDY-MCP-GUTENBERG.md`. VALIDATED against the live WP editor on ai.nekod.net:
      24/24 blocks valid across all 15 core types (one fix: image figcaption class is
      `wp-element-caption`, not `wp-block-image__caption`). Remaining: a live end-to-end MCP call to
      confirm the write path. The #1 forum ask and Novamira's only real lead. Biggest single product win.
      Layered plan (Novamira source read 2026-07-02, see memory `reference_novamira_mcp_competitor` for their
      queue + hidden-editor-iframe finalizer mechanism):
      1. **Server-side curated core blocks** — deterministic PHP renderers for ~15 stable core blocks
         (paragraph, heading, list, image, columns, group, buttons, cover, quote, media-text, separator,
         spacer, table, embed, gallery). We control the exact save-output HTML per block version, so output
         validates. Headless, production-safe, no browser step. Covers 90% of "write me a page".
      2. **Block patterns tools** — `wp_list_block_patterns` (registry + theme patterns) and insert-pattern
         with text/image slot replacement. Patterns are pre-validated theme markup: instant on-brand pages,
         zero validation risk, and it makes the THEME do the design work. Nobody ships this; cheap win.
      3. *(optional, later)* **Browser finalizer** for arbitrary third-party blocks, only if demand shows:
         serialize-on-demand via an admin tab running `wp.blocks` (we already have an admin React app to
         host it). Novamira needed this as their PRIMARY path because they refuse to curate; for us it is
         an edge-case add-on.
- [ ] **MCP Skills / playbooks** — let the site owner write short markdown playbooks (stored on-site,
      managed in settings) exposed to agents via MCP prompts/resources and auto-suggested by description.
      Production-safe, teaches agents site conventions ("posts use this category structure", "products
      are formatted like X"). Concept validated by Novamira's Skills; clean-room design.
- [x] **Block patterns tools** — DONE 2026-07-02 (free tier). `wp_list_block_patterns` (read: search/
      category filter, compact metadata, optional content) + `wp_insert_block_pattern` (write:
      append/replace/prepend a registered pattern into a post). Pre-validated theme/core markup, so
      inserting is on-brand and always editor-valid; compose a page from several patterns, then swap
      text with `wp_alter_post`. Verified on ai.nekod.net (214 patterns; 5 sampled across categories
      parse with 0 invalid blocks).
- [ ] **Global Styles / theme colors** — read/write the `wp_global_styles` entry (palette, typography, spacing)
      without touching theme files. Answers the recurring "change my theme colors" question.
- [ ] **Navigation menus** — list/create/edit menus and assign to locations.
- [ ] **Widgets / block areas / template parts** — for "build my homepage" workflows.

### B. Query power — reduce risky raw-SQL fallback
- [ ] **Structured filters on `wp_get_posts`** — `meta_query`, `tax_query`, real `orderby`, so agents stop
      dropping to `wp_db_query` for "products over $50, published, newest first".

### C. Reliability / polish — "rock-solid, well updated"
- [ ] **Read caps** — clamp `limit` on `wp_get_posts` / `wp_get_media` / `wp_get_users` / `wp_get_comments`
      (Polylang already clamps to 100; core tools accept `limit: 10000`).
- [ ] **Token-bloat controls** — meta exclude / cap on `wp_get_post_snapshot` (the gallery problem, for meta).
- [ ] **Ignored-param sweep** — audit every read tool for accepted-but-silently-ignored or
      expected-but-missing params; wire them up or document them. (This session fixed 3 such bugs.)
- [ ] **Bulk writes** — batch post / meta / term update (only WooCommerce has batch today).
- [ ] **SSE fail-fast** — when no API key is configured, SSE should error clearly instead of hanging.
      (Largely moot once legacy SSE is removed; see memory `project_mcp_sse_removal`, ~2026-07-01.)

### D. Onboarding / framing
- [ ] **One-click `.mcpb` bundle** for Claude Desktop (removes the copy-paste step; Novamira ships this).
- [ ] **Auto health-check on enable** — run the self-test proactively, surface WAF / `.well-known` issues
      before the user hits a failed connect.
- [ ] **Simplify auth paths** and finish the legacy SSE removal (scheduled ~2026-07-01).
- [ ] **Connection wizard** — a "Connect your AI" flow in the MCP settings: pick your client (Claude,
      Claude Code, ChatGPT, Cursor), get the exact steps/URL/token for that client, run the self-test
      inline. WPVibe's magic-link onboarding is their #1 lead; this closes most of the gap without
      becoming a cloud middleman.
- [ ] **Visible safety UX** — productize what we already enforce: an opt-in "approval mode" that holds
      destructive tool calls (delete, option writes, user changes) for one-click confirmation, and an
      "Agent Activity" view over the existing event logs (who connected, which tools ran, what changed).
      We ARE the production-safe option; today the user can't SEE that. WPVibe markets exactly this.

### E. Strategic — future-proofing
- [ ] **Abilities bridge** — register AI Engine's tools as core Abilities so they're discoverable by the
      official MCP Adapter and WP 7's AI Client, while keeping our own server for curation / OAuth / WP 6.0+
      back-compat. This is the `/labs/wp7-integration/

## Caveats

- The tool inventory and gap list were partly sourced from exploration agents — **verify the specific
  file/line before implementing any item**.
- Every change stays production-safe and backward-compatible (REST / shortcode / DB schemas are sacred).

## Progress log

- **2026-06-21** — Initial study written. This session also shipped MCP fixes: `author` / `author_name` /
  `author__not_in` filters (posts, media, comments), `content_format=prose` reads, `wp_update_option`
  JSON-array decode, `wp_get_option` `raw` flag, and the generic `mwai_mcp_mutate` write hook.
- **2026-07-02** — Shipped Gutenberg authoring (`wp_write_blocks`, 12 block types, editor-validated
  24/24) and block patterns (`wp_list_block_patterns` + `wp_insert_block_pattern`), both free tier in
  `labs/mcp-core.php`. This closes Novamira's one real product lead, headless and production-safe. Next:
  live end-to-end MCP smoke test, then Global Styles / theme colors.
- **2026-07-02** — Competitive deep-dive (Novamira + WPVibe). Added WPVibe to the watch list and two new
  backlog items derived from their leads: Connection wizard and Visible safety UX. Confirmed: Novamira
  still not on wp.org (480 stars, tiny release downloads); WPVibe at 2k installs / 86 dl-day baseline vs
  our 100k / ~2,192, but backed by Awesome Motive's marketing machine. Verdict: the fight right now is
  narrative (share of "WordPress MCP" content), not installs. Gutenberg block authoring remains the top
  product item — it is what both competitors' demos are made of.
