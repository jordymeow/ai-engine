# Release risk pass, 3.7.8 to next

Not a polish loop. The goal is a version stable enough to hand to Nekofy, so the only question in
every pass is: **does something that worked in 3.7.8 still work now?**

Decided with Jordy on 2026-09-17:
- **Scope**: everything unreleased since the `3.7.8` tag. 33 commits, 156 source files.
- **What I fix without asking**: a clear regression (worked in 3.7.8, broken now), data loss, a
  permission or privacy leak, a fatal, a console error on a normal path.
- **What I only write down here**: design calls, behaviour changes that may well be intentional,
  and anything I cannot verify. With evidence, and a screenshot when it is visual.
- **What I do not do**: improve anything. A stabilisation pass that keeps adding code is how a
  freeze never happens.

## How to test for a regression, specifically

Reading the diff is not enough, and neither is "it looks fine now". Where it is possible, compare
against 3.7.8 rather than against my expectations:

```
git stash push <files>        # or: git worktree/checkout of the 3.7.8 file
curl / drive the UI, capture
git stash pop
```

Two traps already paid for, both from the automation tab being hidden:
- `requestAnimationFrame` never fires, so anything behind it looks permanently stuck. A screenshot
  forces a paint.
- `element.focus()` moves `document.activeElement` but fires **no focus event**. Dispatch `focusin`
  to test a focus handler.
- And a third, mine: never stack two `fetch` wrappers without reloading, or every call is counted
  twice.

## Risk rotation, highest first

Ordered by what could actually hurt a user, not by how much the code changed.

1. ~~**MCP Editor Access and OAuth**~~ **TESTED, clean (pass 1).** (`labs/mcp.php` +280, `labs/mcp-oauth.php` +76,
   `labs/mcp-core.php` +116). A new permission tier that lets Editors connect with their own
   account. Wrong gate here means someone reaching content they should not. Also the OAuth grant
   cleanup, which deletes token rows.
2. ~~**Models API**~~ **TESTED, clean (pass 2).** (`premium/models-api.php`, 537 new lines). A brand new authenticated REST
   surface with its own key. Never shipped before, so nothing can regress, but a new public
   endpoint is the worst place for a mistake.
3. ~~**`classes/rest.php`**~~ **TESTED, clean (pass 3).** (+125). The single REST controller for everything. Any route that changed
   shape breaks integrations silently.
4. ~~**Image and media route hardening**~~ **TESTED, clean (pass 3, same diff).** (`classes/query/image.php`, media routes). Deliberately made
   stricter: "refuse anything that isn't your own draft". Stricter permission checks are the classic
   way to break a legitimate workflow.
5. ~~**Limits in Absolute mode**~~ **TESTED, clean (pass 4).** (`premium/statistics.php` +37). A counting fix. If the new maths is
   wrong in the other direction, limits stop working instead of tripping early.
6. ~~**Studios rebuild**~~ **TESTED, clean (pass 5).** (Images, Playground, Content). Three screens rewritten, sharing one new
   presets system.
7. ~~**Discussions and Insights redesign**, plus Connected Apps~~ **TESTED, clean (pass 6).**
8. ~~**Engines**~~ **TESTED, one RISK (pass 7).** (`anthropic`, `openai`, `chatml`, `custom`, `google-interactions`, `xai`,
   `engines/core`, `reply.php`). Mostly the em dash comment sweep, but `reply.php` and
   `engines/core.php` carry real changes too, so the diff needs reading rather than trusting.
9. ~~**Module off behaviour**~~ **TESTED, clean (pass 8).** (`classes/core.php`): `neutralize_orphan_shortcodes` and
   `hide_orphan_form_container`. Both change what renders on a public page.
10. ~~**The chatbot front end**~~ **TESTED, clean (pass 8).** Composer cap, stop button, chips. Already had ~75 assertions in
    iteration 60, so this is a re-confirm rather than a hunt.

## Findings

Severity: **BLOCKER** (do not ship), **RISK** (Jordy decides), **NOTE** (fine, worth knowing).

### Pass 1: MCP Editor Access and OAuth (2026-09-17 18:10) — tested, nothing to fix

The riskiest thing in the release, and it holds up. Nothing found, and I went looking properly
rather than reading the diff and nodding.

**The gate is built the right way round.** `can_access_mcp()` checks `manage_options`, not the
`administrator` role name, and says in a comment why. `user_can_authorize()` defaults to
`manage_options` and only widens to `edit_others_posts` when `mcp_oauth_editors` is on, which
defaults to **false**. Every request re-checks `user_can_authorize()`, so demoting a user, or
turning Editor Access back off, refuses their existing token on the next call instead of waiting
for it to expire.

**Tested for real, as the Editor.** Drove `limited_session_refusal()` with
`wp_set_current_user( 19 )` (the `mcp_editor_test` Editor) across thirteen tools:

| refused (10) | allowed (3) |
| --- | --- |
| `wp_update_option`, `wp_get_option`, `wp_db_query`, `wp_list_plugins`, `wp_create_user`, `wp_update_user`, `wp_get_users`, `wp_install_plugin`, `wp_update_theme`, `wp_delete_post` | `wp_create_post`, `wp_get_posts`, `wp_upload_media` |

Defence is in two layers, not one: the tools **list** is filtered to `LIMITED_SESSION_TOOLS` so a
limited client never sees the others, and each call is refused again on the way in. The allow-list
itself is content only (posts, terms, comments, media, blocks, vision and image). No options, no
DB, no users, no plugins, no themes, and **no deletion of anything**.

**A false alarm I raised and then killed, worth recording so nobody re-raises it.** Calling
`limited_session_refusal()` directly with `limited_session = false` refuses things for an
administrator, which looks like a serious bug. It is not: the method is private, it is called from
exactly one place (line 1362) already inside `if ( $this->limited_session )`, and it deliberately
does not re-check the flag. Testing a guarded private method outside its guard proves nothing.

**NOTE, not a regression, and pre-existing in 3.7.8**: `current_user_can( 'administrator' )` still
appears in `premium/mcp-database.php`, `mcp-theme.php`, `mcp-plugin.php`, `mcp-wpml.php`,
`mcp-polylang.php` and `classes/core.php:300`. A role name is not a capability, so an
admin-equivalent account (a custom role holding `manage_options`) is refused by those tools. We
fixed exactly this on the OAuth consent screen on 2026-07-28 and the same pattern is still in the
dangerous-tool gates. Being too strict there fails safe, which is why it is a NOTE and not a fix:
changing capability checks is not something to do during a freeze. Worth a deliberate pass after
the release.

**NOTE**: `mwai_image` is on the Editor allow-list, so an Editor can spend API credit generating
images. Fine if Editors are trusted staff, which they normally are, but it is a cost surface rather
than a security one and you may want to know it exists.

### Pass 2: Models API (2026-09-17 18:35) — tested, nothing to fix

A brand new authenticated REST surface, so nothing can regress, but it is the worst place in the
release for a mistake. Driven live against `mwai-openai/v1`, not read.

**Authentication holds.** `hash_equals` for the comparison, and an unset site key refuses rather
than admits, which is the failure people actually get wrong.

| request | status |
| --- | --- |
| no Authorization header | **401** |
| wrong key | **401** |
| `Bearer ` with nothing after it | **401** |
| the real key | **200**, model list |

**No secret comes back.** Pulled the full 41KB `/models` body and searched it for each of the six
provider API keys configured on this site: none present, and no `apikey` / `secret` / `token`
fields either. The provider key only ever goes upstream in `upstream_headers()`, which is where it
belongs.

**The model id cannot steer the request.** `upstream_base()` is a hardcoded switch on
`$env['type']`, so the destination can only be a known provider or the site owner's own configured
endpoint. Confirmed with a traversal attempt: `"model": "../../etc/passwd"` returns a clean 404
`model_not_found` with no path disclosure. A missing model returns 400, an unknown one 404, all in
OpenAI's error shape.

**The rest of the gates are right too**: the module is registered only when `module_models_api` is
on (`premium/core.php:56`) and that option defaults to false; the key is 24 bytes from
`crypto.getRandomValues` hex-encoded, so 192 bits, not a timestamp hash; and limits are genuinely
enforced on this path through `apply_filters( 'mwai_ai_allowed', ... )` at line 200, which I had
assumed was missing until I looked.

**Checked because it has burned us before**: generating the key calls `updateOption`, which spreads
the whole options object (`{ ...options, [id]: value }`) and posts the complete set. A full
read-modify-write, not a partial POST, so it cannot wipe the envs.

**NOTE, by design, worth knowing**: anyone holding this key can spend the site's AI credit, and the
calls run as the site administrator. That is the same posture as the Public API and it is what makes
Insights attribute them, but the blast radius of a leaked key is "your provider bill", so the key
deserves the same care as a provider key.

### Pass 3: classes/rest.php and the media hardening (2026-09-17 19:00) — tested, nothing to fix

These are one diff, so they were tested together. The worry with the single REST controller is a
route quietly changing shape; the worry with the hardening is a stricter check refusing a
legitimate user.

**Nothing was removed or renamed, which is the backward compatibility question that matters.**
Extracted every `register_rest_route()` from both tags across the seven files that register routes:

| | routes |
| --- | --- |
| 3.7.8 | 93 |
| now | 97 |
| removed | **0** |
| added | the 4 Models API routes, already covered in pass 2 |

No existing integration loses an endpoint. The only response shape change anywhere in the diff is a
**new** 403 on `create_post`, which did not exist before, so nothing that used to succeed now
returns a different body.

**The new media guard does not refuse anyone it should not.** Reproduced `is_user_draft_media()`
exactly and evaluated the real condition, `!$isDraft && !$editable`, for both an administrator and
an Editor against three real library attachments:

| | 537 | 456 | 455 |
| --- | --- | --- | --- |
| admin | allowed (own draft) | allowed (`edit_post`) | allowed (`edit_post`) |
| editor | allowed (`edit_post`) | allowed (`edit_post`) | allowed (`edit_post`) |

The guard only bites when someone can neither edit the attachment nor owns it as a draft, which is
a Subscriber or Contributor, and is the point of the change.

**`create_post` still works, live, end to end**, and its new capability check fails cleanly:
default type 200, explicit `page` 200, `postType: "not_a_real_type"` a clean **403** with a real
message and no fatal. The two posts this created (547, 548) were deleted afterwards and verified
gone, so the test site is as it was.

**NOTE, pre-existing in 3.7.8, not a regression, but real**:
`rest_helpers_update_media_metadata` builds its update from `$params['title'] ?? ''` and writes
`post_title`, `post_content` and `post_excerpt` unconditionally. A caller that sends only one field
**blanks the other two**. Identical in 3.7.8, so it is not this release's problem and I did not
touch it, and it is why I tested the guard by evaluating it rather than by calling the route. Worth
fixing deliberately later: read the current values first, or only write the keys that were sent.

### Pass 4: Limits in Absolute mode (2026-09-17 19:25) — tested, nothing to fix

The fix replaces `DAY(time) = DAY(now)` with `time >= period_start(timeFrame)`. The worry was the
new maths being wrong the other way, so limits stop tripping at all, which a site owner would only
discover on their provider bill.

**The old bug was real and worse than the commit message suggests.** Ran both SQL forms against the
live logs table, 5496 rows spanning 2026-05-11 to now:

| frame | old counted | new counts | period start |
| --- | --- | --- | --- |
| hour | **129** | **0** | 15:00:00 |
| day | 30 | 13 | 00:00:00 |
| week | 1950 | 1948 | Mon 14th |
| month | 2434 | 2434 | 1st |
| year | 5496 | 5496 | Jan 1st |

`HOUR(time) = HOUR(now)` was matching hour 15 on **every day of four months**, so an hourly limit
saw 129 queries when the real answer was 0. Month and year look identical only because the log
history is all within 2026; on a site with two years of logs the month figure would have been
double.

**It does not under-count, which was the thing to prove.** Called `query_stats()` itself, both
modes, four time frames, and compared each against raw SQL:

| frame | absolute | rolling |
| --- | --- | --- |
| hour | 0 = 0 | 0 = 0 |
| day | 13 = 13 | 20 = 20 |
| week | 1948 = 1948 | 2103 = 2103 |
| month | 2434 = 2434 | 2505 = 2505 |

Eight out of eight match. Nothing returns a spuriously low number, so a configured limit still
trips.

**Checked the clock, because a boundary bug here would be invisible.** `period_start()` uses PHP's
`date()`, and the log row's own time column is written with `date()` too (line 719), so both sides
are the same clock and the period boundary lands where it should.

**NOTE, pre-existing in 3.7.8, charts only, not limits**: this box has PHP on UTC and MySQL three
hours ahead (`date()` said 15:50:58 while `NOW()` said 18:50:58). Three queries in
`stats_logs_activity`, `stats_logs_activity_daily` and `stats_logs_activity_daily_by_model` compare
the `time` column against MySQL `NOW()` rather than a PHP timestamp, so on any install where the two
disagree the Insights activity charts show a window shifted by the offset. Unchanged since 3.7.8
(three occurrences in both), and it does not touch the limits path, so it is out of scope for the
freeze. Worth fixing later by passing a PHP timestamp in, exactly as `period_start()` now does.

### Pass 5: Studios rebuild, Images / Playground / Content (2026-09-17 19:50) — tested, nothing to fix

Three screens rewritten around one new presets system. Rendering was the obvious worry and the
wrong one: the real risk was whether setups saved under 3.7.8 survived the rewrite.

**They did, and the storage did not move.** The new shared module
(`app/js/components/presets.js`) reads and writes the same site-wide `mwai_templates` option
through the same `/system/templates` route, and the route's handler is **byte identical** to
3.7.8 (`git diff` on the templates handler is empty). The stored shape is unchanged too: a list of
`{ category, templates }` groups.

Served live, as admin, all four categories:

| category | status | stored | served |
| --- | --- | --- | --- |
| contentGenerator | 200 | 0 | falls back to built-in defaults |
| imagesGenerator | 200 | 6 | 6, names intact (Cyberpunk Shibuya, Kanji, Neko News) |
| playground | 200 | 5 | 5, names intact (SEO Optimizer, Text Corrector) |
| videosGenerator | 200 | 0 | falls back to built-in defaults |

`withDefaults()` merges each stored preset over its category default, so a preset written by an
older version cannot read `undefined` for a field added since. That is the right shape for a format
change and it is why nothing was lost.

**All three screens drive correctly**, admin session, real data, no console errors and no fatals:
Image Studio shows its version history (v1 original through v5, including a saved brush edit) with
the media library fields; Content Studio shows the Brief → Outline → Draft → Publish stepper and its
empty state; the Playground shows the Preset dropdown populated with "Default Template", Save and
Save as new, parameters, tools and the cost counters.

**No admin URL moved.** Extracted every `mwai_*` page slug registered in `classes/admin.php` from
both tags and diffed them: identical. A bookmark from 3.7.8 still lands.

**A wrong turn worth writing down**: `?page=mwai_settings&nekoTab=playground` shows the Dashboard,
which looked like the Playground tab had been lost. It has not: the Playground is its own page at
`tools.php?page=mwai_dashboard`, and the Settings tab list (Dashboard, Modules, Chatbots,
Discussions, Knowledge, Insights, Settings, Dev Tools, License) has never contained it. An unknown
`nekoTab` falling back to the first tab is the existing behaviour, not a regression.

### Pass 6: Discussions, Insights and Connected Apps (2026-09-17 20:15) — tested, nothing to fix

Two table screens rewritten, and one change that **deletes rows**. The deletion got the attention.

**The OAuth cleanup cannot take a live grant.** Its predicate is `access_expires < now AND
( revoked <> 0 OR refresh_expires IS NULL OR refresh_expires < now )`. Ran it as a SELECT against
the real table, 556 rows, and classified every row it would remove:

| | |
| --- | --- |
| rows it would delete | 554 |
| of those, still usable | **0** |
| live grants the UI lists | 2 |
| live grants in the delete set | **0** |

The 554 are genuinely dead: access tokens that expired in May and June, now September. The edge
case worth naming is the one row with `revoked = 0` and `refresh_expires IS NULL` whose access
token expired yesterday. It looks alive at a glance and is not: with no refresh token and an expired
access token it can never authenticate again, so removing it is right. `revoked` also turns out to
hold `2` for rotated grants, not just 0 and 1, and `revoked <> 0` covers that correctly.

**Connected Apps and the cleanup agree.** `/mcp/v1/oauth/apps` returns exactly the two live grants
(ChatGPT and Claude, both refreshing until 2026-10-04) and hides the 554 dead ones, which is the
behaviour the commit describes.

**Both redesigned screens drive on real data, no console errors, no fatals.** Discussions lists 279
results with one-line previews, chatbot badges, paging, Export and Delete All, and clicking a row
fills the detail pane with readable ASSISTANT and USER bubbles plus an Information panel, no raw
JSON anywhere. Insights lists 20 query rows with tokens and price, the activity chart (700 queries
over 31 days, broken down by provider), and the Limits panel.

**Worth knowing for pass 4's sake**: this site actually has Limits enabled with **Absolute: Yes** on
a Month timeframe, so the counting fix I verified earlier is live here rather than theoretical.

**Checked and dismissed**: both live grants show no last use, which looked like the "keeps last use
across refreshes" claim failing. It is not: 370 of the 556 rows carry a `last_used` value, so the
tracking works. These two were created on 2026-09-04 and have not been used since.

### Pass 7: Engines and reply.php (2026-09-17 20:40) — one RISK, nothing to fix

**Most of this area is not a risk at all.** Separating comment churn from code, `reply.php`,
`google-interactions.php`, `xai.php` and `premium/google.php` have **zero** non-comment changes.
The register's worry about `reply.php` was wrong: it is pure em dash sweep. Only five files carry
real changes, and four are additive:

| file | real change |
| --- | --- |
| `chatml.php` | sends `quality` on an image body, only when the model declares `qualities`, in a try/catch. No-op when unset. |
| `openai.php`, `anthropic.php` | add `supports_mcp_servers() { return true; }` |
| `core.php` | adds the base `supports_mcp_servers() { return false; }` |
| `custom.php` | chat models from a Custom server now get the `functions` tag as well as `core`/`chat` |

**The engines demonstrably work.** 2103 queries in the last seven days on this code, across OpenAI
(`gpt-6-astra`, `gpt-5.6-luna`, `gpt-5-mini`), Anthropic (`claude-haiku-4-5`, `claude-sonnet-5`),
Google (`gemini-3.8-flash`, `gemini-3.5-flash`) and OpenRouter (`stepfun/step-3.7-flash`). `php -l`
clean on every changed file.

**RISK (Jordy decided 2026-09-17: ship as is, revisit after the release): the MCP support gate refuses more engines than the message admits.** `classes/core.php:343`
now **throws** when a query carries `mcpServers` and the engine does not declare support. Only
`openai` and `anthropic` declare it. Everything else inherits `false` from the base class:
`chatml`, `custom`, `google`, `google-interactions`, `mistral`, `open-router`, `ovh`, `perplexity`,
`replicate`, `xai`.

The intent is right and the old behaviour was genuinely bad, per the comment: the model got no tools
and invented the results, table included. But it is a hard exception with **no filter to override
it**, and the case it catches by accident is a **Custom (OpenAI compatible) environment pointed at
a proxy in front of OpenAI**, which would have worked in 3.7.8 and now cannot run at all. Same for
anyone whose xAI or OpenRouter setup did work.

Measured blast radius on this site: **zero**. Six environments configured (openai, anthropic,
google, openrouter, ovh, mistral) and **no chatbot requests MCP servers at all**, so nothing here
changes behaviour. The exposure is only for users in the wild with both a non OpenAI/Anthropic
environment and MCP servers switched on.

Not fixed, because adding an escape hatch is a feature, not a regression fix, and the refusal is
deliberate. Jordy's call, asked with options.

### Pass 8: Module off behaviour, and the chatbot front end (2026-09-17 21:05) — tested, nothing to fix

My own changes from the polish loop, so tested with more suspicion, not less.

**The ordering risk in `neutralize_orphan_shortcodes` is not real, and I checked rather than
assumed.** It runs on `init` at priority 99 and registers `__return_empty_string` for any AI Engine
shortcode still unregistered by then. If a live module registered later, the neutralizer would
shadow a working shortcode and content would vanish from public pages. Checked every tag against
its module's actual state:

| shortcode | registered | neutralized | module |
| --- | --- | --- | --- |
| `mwai_chatbot`, `mwai_discussions` | yes | **no** | chatbots on |
| `mwai_stats`, `mwai_stats_current` | yes | **no** | statistics on |
| `mwai_form`, `mwai-form-*` (6) | yes | yes | forms **off** |

Live modules wrongly neutralized: **0**. Modules register in their constructors, well before
`init:99`, so the ordering holds.

**The public surface is healthy.** Six public pages fetched and parsed: raw shortcode text **0** on
every one, empty form bars **0**, the chatbot container present, no fatals. The single form
container that survives is on `/ai-form-prefill-test/`, which is correct: that container holds a
real button, so `hide_orphan_form_container` deliberately keeps it.

**A false pass I caught.** The first run of that check reported clean on all six, and was
meaningless: a `sed` locale error left the extracted body empty, so "0 raw shortcodes" was counting
an empty string. Re-ran with a real parser and body lengths of 36KB to 73KB. Worth remembering that
a green result from a command that printed an error is not a green result.

**The chatbot front end needs no separate pass.** It had roughly 75 assertions yesterday, and the
whole suite was re-run today after the double click fix: state machine, composer cap growing,
capping at 210px, scrolling and shrinking back, busy and stop across all four themes, chips, Enter
and Shift+Enter, the error path. Chatbots render on all six public pages here.

---

## Verdict: GO

All ten areas tested. **Zero blockers. No regression found in 33 commits and 156 source files.**

**What the passes actually proved**, rather than "it looked fine":
- **No REST route was removed or renamed.** 93 routes in 3.7.8, 97 now, the four new ones being the
  Models API. No integration loses an endpoint, and the only changed response shape is a 403 that
  did not exist before.
- **No admin URL moved.** Every `mwai_*` page slug is identical, so bookmarks still land.
- **No data was lost or can be lost.** Presets survived the studios rewrite in the same option and
  the same shape; the OAuth cleanup would delete 554 rows and **zero** of them are usable, with no
  overlap against the two live grants.
- **The new permission tiers hold.** An Editor in an MCP limited session is refused all ten
  dangerous tools and allowed three content ones, with the tool list filtered as well as the calls;
  the new media guard refuses nobody who can already edit.
- **The new public endpoint is sound.** Timing-safe key comparison, an unset key refuses rather than
  admits, no provider key in any response, no way to steer the upstream URL, and limits enforced.
- **A real bug was fixed, not just claimed.** The hourly limit counted 129 queries where the true
  answer was 0.
- **The engines run.** 2103 queries in seven days across four providers on this exact code.

**The one thing to know before shipping**, decided and accepted: the MCP support gate throws for
every engine except OpenAI and Anthropic, with no filter to override it. Nobody on the test site is
affected. A user with a Custom (OpenAI compatible) environment in front of OpenAI **and** MCP
servers switched on will stop working, and their error message will not explain why. Revisit after
the release.

**Where this testing is weak, stated plainly so nobody over-reads the GO:**
- Everything was exercised on one site, with one set of data, on PHP 8 and a single WordPress
  version. No multisite, no PHP 7.4, no other themes.
- The Models API chat path was tested for auth, errors and leakage, never with a real completion,
  so its streaming and usage recording are unproven by me.
- The MCP Editor flow was tested by driving the refusal logic as the Editor, not by completing a
  real OAuth handshake from Claude Desktop as an Editor.
- Four NOTES below are pre-existing problems I deliberately did not fix during a freeze:
  `current_user_can( 'administrator' )` in five dangerous-tool gates, the blanking behaviour in
  `rest_helpers_update_media_metadata`, the PHP/MySQL clock skew in the Insights activity charts,
  and `mwai_image` sitting on the Editor allow-list.
