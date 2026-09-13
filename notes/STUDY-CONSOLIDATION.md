# STUDY-CONSOLIDATION.md — AI Engine consolidation roadmap

> **Living planning doc.** Born 2026-06-29 from a strategic review (chatbot + MCP + WP7) after the
> Gemini Interactions engine shipped in 3.5.6 with four silent regressions nobody caught until we
> drove the live API by hand. The lesson: **product breadth is outrunning verification, docs, and UX.**
> This phase is **consolidation, not another feature wave** — done little by little, one item per
> few pulses, surfaced via `/pulse`. Read `STRATEGY.md` and `STUDY-MCP.md` first for posture.

## Core principle

Do **not** freeze chatbot features (unrealistic for a solo continuous shipper). Instead put a
**verification gate** and a **param schema** in front of new work, so features stop adding unverified
surface. Consolidate the main paths incrementally behind that gate. The threat is not competitors;
it is complexity outrunning verification.

## The evidence this is needed

3.5.6 shipped the Gemini Interactions engine as the **default** for all Google users with: dropped RAG/
content-aware context, dropped chat history (restored discussions), broken PDF-in-chat, and a broken
connection test. All four were invisible to code review and the test suite; only live API driving caught
them. Fixed in commit `f93d978e`. This is the proof, not a hypothetical.

## Backlog (ranked — pull the highest-value item that fits the time)

- [x] **1. Pre-release smoke gate for the chatbot/engine path.** Highest leverage. The `labs/tests`
  harness we used would have caught every 3.5.6 regression. Make a runnable battery (text, history,
  context/RAG, image, function-call non-stream + stream, file/PDF) across each provider env, run before
  any release. This is the structural fix for the failure mode above.
  **Slice one DONE 2026-07-02**: `node labs/tests/test-smoke.js` drives every configured AI env through
  CONNECT (/ai/test_connection), TEXT, HISTORY (messages array), and STREAM (SSE live + end events),
  which covers the 3.5.6 connection-test and dropped-history classes directly. Models are picked
  dynamically from settings (overridable via `smoke.models` in query-api.local.conf). First live run:
  6 envs (OpenAI, Anthropic, Google, OpenRouter, OVH, Mistral), all green, exit code wired for CI-style
  use. Run before any `pnpm zip`.
  **Slice two DONE 2026-07-03**: FUNC (non-stream via /simpleChatbotQuery) + FUNCSTRM (streamed via
  mwai-ui/v1/chats/submit with a guest nonce from /start_session) run function calling through the real
  chatbot pipeline against fixture bots (botId starting with "smoke", mapped per env; smoke-openai +
  smoke-anthropic created on ai.nekod.net, wired to the Code Engine "[Test] Get Magic Word" snippet).
  Validated against the real regression: with the 84ecb22b Sonnet 5 fix reverted, FUNCSTRM fails with
  the exact user-reported "each thinking block must contain thinking" error; with the fix, all green.
  Checks retry once so transient provider slowness (OVH) doesn't fail the gate.
  **Slice three, MCP round-trip DONE 2026-07-23**: `node labs/tests/test-smoke.js mcp` (also runs on
  full runs) drives the real MCP Streamable HTTP transport (bearer self-discovered from settings):
  MCPINIT handshake, then wp_create_post/wp_update_post_meta with nested-array + unicode meta read
  back per-key and deep-compared (a double-serialized value is called out explicitly), block-JSON
  `\u` escapes + shortcode + unicode content through wp_get_post, fixture post force-deleted after.
  Covers the corruption classes Dave Hilditch's PSA documented (f3a2f4fd/fcda9415, cb806da4,
  600d86eb; window was 2.8.5 → 3.5.9). Validated against the real bug: with `maybe_serialize()`
  reintroduced in wp_update_post_meta, METAUPD fails with "DOUBLE-SERIALIZED"; with the fix, all green.
  **Slice three, RAG-through-chat DONE 2026-07-24**: RAGCHAT drives /simpleChatbotQuery on the
  smoke-rag fixture bot (wired to the new Internal (WordPress DB) vector env, intern01 on
  ai.nekod.net) and expects a fact that only exists in the knowledge base. Validated against a
  simulated dropped-context regression.
  **Slice three, files-in-chat DONE 2026-09-03**: IMAGE (test-data/gotokuji.jpg, reply must say
  "cat") and PDF (test-data/invoice-slices.pdf, reply must contain the invoice number) run on the
  same smoke-* fixture bot as FUNC, through /simpleFileUpload + /simpleChatbotQuery with fileIds.
  SKIP when the settings model list says the bot's model lacks the vision/files tag. Item closed:
  every regression class from 3.5.6 now has a check. `node labs/tests/test-smoke.js` before any
  `pnpm zip`. Fixture bots live on ai.nekod.net and can vanish with a settings reset; recreate
  smoke-openai / smoke-anthropic (function 17, maxTokens 4096) and smoke-rag (intern01) if the
  gate prints SKIP for FUNC/RAGCHAT.
- [ ] **2. Gemini external MCP consumption.** OpenAI (`openai.php:~403`) and Anthropic (`anthropic.php`)
  consume `$query->mcpServers`; the new default Google engine (`google-interactions.php`) does NOT — it
  only wires Google's built-in tools. MCP is the core moat, so the default Google engine being unable to
  use it is a real gap. Best shape: a provider-neutral MCP-to-function bridge. See
  `project_gemini_no_external_mcp` memory.
- [ ] **3. Schema-driven chatbot params.** Replace the manual `MWAI_CHATBOT_FRONT_PARAMS` /
  `MWAI_CHATBOT_SERVER_PARAMS` + 4-location sync (documented as a footgun in CLAUDE.md) with one
  schema-driven model. Shrinks the regression surface; more ROI than a full `chat_submit()` rewrite.
- [ ] **4. MCP capability governance + onboarding.** MCP = remote admin automation, not "just a chatbot
  feature." Role presets, mutating-tool audit log default-on (easy off), per-client/tool allowlists, and
  onboarding that makes the admin power level unmistakable. `require_approval => never` (openai.php:440,
  realtime.php:387) makes server-side allowlists + warnings more important.
- [ ] **5. Chatbot hygiene pass.** Remove/guard the `[ERROR]` test path (`ChatbotContext.js:985`); narrow
  the `eval()` function-action surface (`ChatbotContext.js:589`, `:840`); audit the error-HTML
  `dangerouslySetInnerHTML` rendering with a tight sanitize pass.
- [ ] **6. WP7 directory reconciliation.** `STRATEGY.md` says WP7 code lives in `/labs/wp7-integration/`,
  but the actual files are flat `labs/wpai-*.php`. Reconcile the doc or move the files before this area
  grows. Cheap; do it before the WP7 surface expands.
- [ ] **7. (Longer-term) Incremental `chat_submit()` / `ChatbotContext` decomposition.** Split the
  monster submission pipeline behind the smoke gate — incrementally, NOT a big-bang rewrite (the rewrite
  is itself a regression risk). Only after items 1 and 3 land.

## Already-decided (the review re-derived these — confirmations, not new work)

- Deprioritize Realtime + Assistants unless users are loudly asking (`feedback_deprioritized_bugs`).
- MCP URL-token fallback is temporary; re-eval after 2026-12-27 (`project_mcp_url_token_revisit`).
- WP7 = stable connector layer for a moving framework; Abilities bridge planned (`project_wp7_mcp_eta`).
- Keep **image-only** behavior for image-gen Gemini models this release (no inferring mixed text+image
  from chat text — it would risk the verified image fix).

## Progress Log

- 2026-06-29: Roadmap created from the chatbot/MCP/WP7 strategic review. Baseline established; nothing
  ticked yet. Context: Gemini Interactions hardening (commit f93d978e) just closed the regressions that
  motivated this.
- 2026-07-02: Item 1 slice one shipped. `labs/tests/test-smoke.js` gates CONNECT/TEXT/HISTORY/STREAM
  across all 6 AI envs in one command (~2 min, all green on first full run). Slice two (RAG, function
  calling, PDF) needs site fixtures and is listed as SKIP in the gate output.
- 2026-07-03: Item 1 slice two shipped. FUNC + FUNCSTRM cover function calling (non-stream + streamed)
  through the real chatbot pipeline via smoke-* fixture bots. Proven against the same-day Sonnet 5
  streaming bug (84ecb22b): gate fails with the fix reverted, passes with it. Full run: 27 passed,
  0 failed, 9 skipped (envs without fixture bots). Retry-once added for flaky providers.
- 2026-07-23: Item 1 slice three (MCP round-trip) shipped. `node labs/tests/test-smoke.js mcp` drives
  the real Streamable HTTP transport: MCPINIT, METAREAD, METAUPD, CONTENT, MCPCLEAN. Validated against
  the real bug (maybe_serialize reintroduced fails METAUPD with DOUBLE-SERIALIZED). Covers the
  2.8.5 to 3.5.9 meta/content corruption classes from Dave Hilditch's PSA.
- 2026-07-24: Item 1 slice three (RAG through chat) shipped. RAGCHAT on the smoke-rag fixture bot,
  wired to the Internal (WordPress DB) env intern01. Validated against a simulated dropped-context
  regression.
- 2026-09-03: Item 1 CLOSED. IMAGE + PDF checks shipped (the last two SKIP lines are gone). The
  fixture bots had been wiped from ai.nekod.net since July (every FUNC/RAGCHAT was silently SKIP);
  recreated, and the note above says how to do it again. Full run: OpenAI 8/8, Anthropic 8/8,
  RAG 1/1, MCP 5/5. First catch of the new slice: a fixture bot with maxTokens 128000 on Haiku
  4.5 400s at Anthropic ("max_tokens: 128000 > 64000"), the same thing a user hits when switching
  a chatbot to a smaller Claude model. Fixed by capping max_tokens to the model's
  maxCompletionTokens in `anthropic.php` (max_tokens_for). Next: item 3 (schema-driven chatbot
  params) or item 2 (Gemini external MCP), Jordy's pick.
- 2026-09-12: Item 1 gained IMAGEFU / PDFFU (a second turn on the same chatId without re-sending the
  file). Written first to reproduce the Discord report that Claude "forgets" an uploaded image on the
  next question: FAIL on Anthropic, PASS on OpenAI/Google (server-side state). Fixed by tagging uploads
  with query_chatId and re-attaching a discussion's live files on every turn of a stateless engine
  (chatbot.php + files.php get_chat_files). Gate now 12/12 on OpenAI, Anthropic, Google. Gotcha found on
  the way: discussions store Anthropic's msg_ id as previousResponseId, so "has an id" must not be read
  as "has server-side history"; gate on is_stateful_conversation_id() instead.
