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

- [~] **1. Pre-release smoke gate for the chatbot/engine path.** Highest leverage. The `labs/tests`
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
  **Slice three TODO**: RAG-through-chat (needs an embeddings-wired chatbot fixture on ai.nekod.net),
  image, and PDF-in-chat. The script prints these as SKIP so the coverage gap stays visible.
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
