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

## Improvement backlog (pick from here each /pulse)

### A. Product capability — user-demanded, safe, on-brand
- [ ] **Gutenberg block authoring** — a `wp_write_blocks`-style tool (block-spec in → valid layout out).
      The #1 forum ask and Novamira's only real lead. Biggest single product win.
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

### E. Strategic — future-proofing
- [ ] **Abilities bridge** — register AI Engine's tools as core Abilities so they're discoverable by the
      official MCP Adapter and WP 7's AI Client, while keeping our own server for curation / OAuth / WP 6.0+
      back-compat. This is the `/labs/wp7-integration/` plan.

## Caveats

- The tool inventory and gap list were partly sourced from exploration agents — **verify the specific
  file/line before implementing any item**.
- Every change stays production-safe and backward-compatible (REST / shortcode / DB schemas are sacred).

## Progress log

- **2026-06-21** — Initial study written. This session also shipped MCP fixes: `author` / `author_name` /
  `author__not_in` filters (posts, media, comments), `content_format=prose` reads, `wp_update_option`
  JSON-array decode, `wp_get_option` `raw` flag, and the generic `mwai_mcp_mutate` write hook.
