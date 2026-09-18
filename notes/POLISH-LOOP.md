# Polish loop

Started 2026-09-16 15:20 (Athens). Runs every 20 minutes while Jordy is away. Each run takes the next
area in the rotation, looks at it on ai.nekod.net, measures instead of guessing, fixes what is
small and safe, builds, verifies live, commits on master (never pushes) and logs it here.

One full rotation was completed on 2026-09-16 at 20:15, sixteen areas, fifteen fixes. The second
pass starts again at the Dashboard and should go deeper: the obvious things are done, so it is
worth chasing states that are harder to reach (errors, slow networks, long values, empty installs)
rather than re-reading the same screens.

## History was gathered on 2026-09-16 22:05

Jordy saw 65 unpushed commits and asked for fewer. The 46 commits this loop had made (half of
them "Logged the ... polish pass" notes, which were noise) were replayed in order as five:

- `40696784` the first rotation of screen polish
- `b208a926` the raw shortcode leak on public pages
- `da9159bd` the neko-ui companion changes and the outline prompt
- `8786490d` the robots_txt fatal, kept on its own because a customer is waiting for it
- `ffe561fb` edited images inheriting their title

The nineteen commits that came before the loop were not touched and keep their original hashes.
Proof the squash lost nothing: the tree hash is `cd74cf93` before and after, and
`git diff polish-backup-20260916` is empty. That tag is the safety net and can be deleted once
the new history is accepted.

**The robots_txt fix moved from `67becbef` to `8786490d`.** The support thread for HelpScout
3451536590 recorded the old hash, so the Meow Apps session was told.

From now on: one commit per area, and the notes go in with the fix instead of getting their own.

## Decided by Jordy, 2026-09-16 20:30

He answered the whole backlog in one go. These now take priority over the second rotation, and
the loop works through them in this order. Nothing here is a question any more, so do not ask
again, just do them one per run with the usual measure, build, verify live, commit.

1. ~~neko-ui, all four~~ DONE 2026-09-16 20:50, see iteration 17.
2. ~~Front end errors are for editors only.~~ ALREADY TRUE since 2026-07-24. My finding was
   wrong, see iteration 18.
3. ~~Ban em dashes in the Content Studio prompts.~~ DONE 2026-09-16 21:20, see iteration 19.
4. ~~An edited image inherits its parent's title.~~ DONE 2026-09-16 21:55, see iteration 21.
5. ~~Drop the Status column from MCP Logs.~~ DONE 2026-09-16 22:20, see iteration 22.
6. ~~Escape closes the popup chatbot.~~ DONE 2026-09-16 22:35, see iteration 23.
7. ~~A hidden tab opens Modules and explains.~~ DONE 2026-09-16 22:50, see iteration 24.
8. ~~All four tidy-ups.~~ DONE 2026-09-16 23:05, see iteration 25. Two of the four i18n
   strings were kept on purpose, see below.

Still not asked, because it needs measuring before it is a question: every admin page loads the
whole block editor stack, about 40 scripts, because `Forms.js` is always imported by `Settings.js`.
Measure what a dynamic import would actually save, then propose.

## Rotation

Dashboard, Modules, Chatbots builder, Chatbot front end, Discussions, Insights and Queries,
Knowledge, Image Studio, Playground, Content Studio, Workspace, Settings tabs (AI, Chatbot,
Workspace, MCP, Orchestration, Files and Media, PHP API, REST API, Add-ons, Others), Dev Tools,
Templates and presets, AI Forms, the classic screens.

## Do not touch

- Versions, the changelog, anything Nekofy owns.
- The three studios rebuilt last night, beyond genuine bugs: no redesigns.
- Names users depend on: REST routes, shortcode attributes, option keys, hooks.
- Anything destructive on the test site without a backup first.

## Findings log

(newest last)

### 1. Dashboard (2026-09-16 15:20)

Checked: console, network, horizontal overflow, the greeting, every link and tile.

- No console errors. No `wp-json` request at all: the screen renders from the options already
  localized into the page, so there is nothing to debounce or cache here.
- No horizontal overflow (`scrollWidth === clientWidth === 1363`).
- The greeting is correct: `new Date().getHours()` is the browser hour, 15 in Athens, so
  "Good afternoon" is right. No bug.
- The `Lato` Google Font and the four chatbot theme CSS files loaded on the admin page do not
  come from us: nothing in the plugin enqueues them.
- Nothing fixed, nothing was broken.

### 2. Modules (2026-09-16 15:35)

Checked: console, network, overflow, the copy of all 22 module descriptions, the feature cards,
checkbox markup.

- **Fixed**: a model that is missing from an environment warned eight times per page load, and
  each warning dumped the whole `options` object, which still holds the API keys in clear for an
  admin. Console output gets pasted into support threads and screenshots. Now: one warning per
  model per page load, clearer sentence, and only the list of available model ids.
  `app/js/helpers-admin.js`, verified live (8 warnings before, 1 after).
- Feature cards keep their 10px radius and carry `will-change: transform`, so last night's fix is
  live. The original artifact was a GPU rasterization glitch during the click scale, which a JPEG
  screenshot cannot confirm either way.
- The test site has `mistral-small-latest` set on an environment whose model list no longer
  contains it. That is site data, not a plugin bug, but it is what surfaced the warning.
- Module descriptions read well, no em dashes, no truncation, no overflow.

### 3. Chatbots builder (2026-09-16 15:47)

Checked: console, every network request, the accordion titles, the icon picker, the preview pane.

- **Fixed**: Functions, MCP Servers and Tools rendered their title with a flex `gap: 8px` while
  every other section puts the hint inside the small as `" Hint"`, which measures 3.13px. Those
  three sat more than twice as far from their title as the rest. Now 4px, and the three copies of
  that markup share one small `CategoryTitle` component. Measured before (8px) and after (4px).
- **Fixed**: the 20 icons in the picker had no `alt`, so the tooltip and screen readers fell back
  to the file path. They now read "chat color blue" and the like.
- No console errors, and no REST call at all on this tab.
- The preview pane looking empty is correct: the default chatbot is a popup, so the preview shows
  the bubble in the corner, with the caption explaining it is the real chatbot.
- Twenty icon SVGs are fetched on load even with every section collapsed. `loading="lazy"` does
  not help (see below), so it is only marked for later, not claimed as a win.

### 4. Chatbot front end (2026-09-16 16:05)

Checked on the home page, popup and inline: console, the trigger, the open animation, the window
position, focus, the tab order, every focusable element.

- **Fixed**: the bubble image was inline, so the text baseline left 7.3px of empty but clickable
  space under it. The trigger box sat at its configured 30px from the bottom while the icon people
  actually see sat at 37.3px. Now the trigger is exactly 64x64 with no dead strip, in all four
  themes (`themes/sass/_common.scss`, recompiled with `pnpm sass`, one line per theme file).
- **Fixed**: the send button was an icon with no `aria-label` and no tooltip, so screen readers
  announced a nameless button. It now says Send, or Clear the conversation in clear mode, and the
  tooltip only appears on the themes that show an icon rather than a word.
  While doing it I found my first attempt was wrong and measured it: the ChatGPT theme renders an
  arrow even when `textSend` is set, so "has text" had to come from the rendered content, not from
  the setting. `buttonContent` now reports whether it drew a word or an icon.
- The rest of the front end is in good shape: real buttons with aria-labels for the starters and
  the window controls, the trigger is a proper `role="button"` with a tabindex, and the input takes
  focus when the window opens.
- Window and bubble alignment are consistent: both sit 30px from the edges once the 15px scrollbar
  is subtracted from `innerWidth`. No bug.
- No console messages at all on the front end.

### 5. Discussions (2026-09-16 16:25)

Checked: console, network, the table, the selected pane, the destructive confirmations, the column
filters, a discussion holding a deleted image.

- **Fixed**: the table passed `emptyMessage={null}`, which overrides NekoTable's own default, so a
  site with no discussions yet and a filter that matches nothing both showed a completely blank
  panel. Both cases now explain themselves. The same bug was in Queries, one file away, so it was
  fixed in the same commit. Verified live by filtering on a string that matches nothing: the panel
  used to be empty, it now reads "No discussion matches your filters."
- The Delete All and Delete Selected confirmations are genuinely good already: they say the scope,
  that filters and pagination are ignored, the real total fetched from the server, and they point
  at Export first.
- A discussion whose uploaded image was deleted degrades to "Image not available" rather than a
  broken image. One 404 is spent finding out, which is unavoidable.
- Auto Refresh is off by default and polls every 5 seconds only when switched on. Nothing wasteful.
- Selecting a row costs no request at all, the conversation is already in the list payload.

### 6. Insights and Queries (2026-09-16 16:50)

Checked: console, network, both views, the column widths and clamping, the tooltips, the activity
chart, the scope filter.

- **Fixed**: the Scope filter offered only Chatbot, Form and Playground while the plugin writes at
  least ten scopes, so there was no way to ask "what did the Workspace cost me" or to isolate the
  Copilot. The list is now built from `SCOPE_LABELS`, which gained every scope the PHP actually
  writes (`admin-tools`, `copilot`, `text-rewrite`, `advisor`, `discussions`, `embeddings-title`).
  The labels are identical to what the fallback title-casing already produced, so nothing is
  renamed. Verified live: filtering on Workspace returns 410 rows, which was impossible before.
- **Fixed**: the Scope cell only had a tooltip when the row carried a session, which is exactly
  the case where the label is clamped. It now always names the scope.
- No console messages. Two REST calls on load (`logs/list`, `logs/activity_daily`), no polling.
- The activity chart bars all carry a readable tooltip ("Aug 18: 3"). Good as is.
- Measured the truncation: "Admin Tools" needs 73.5px in a 73px line, so `line-clamp: 1` hides
  the second word and paints "Admin...". It misses by half a pixel. See the backlog.

### 7. Knowledge (2026-09-16 17:10)

Checked: console, network, the table, the row actions, the Build Knowledge panel, the old tab URL.

- **Fixed**: `nekoTab=embeddings` and `nekoTab=queries` silently opened the Dashboard. Those were
  the shipped URLs until the tabs were renamed to Knowledge and Insights (commit f3103c9b), so
  every old bookmark, blog link and support thread pointing at them landed on the wrong screen with
  no explanation. The legacy names are now translated before the tabs read the URL. Verified live:
  the address bar rewrites to `nekoTab=knowledge` and the right tab opens.
- **Fixed**: in Build Knowledge, Push All and its post type select were `flex: 0 0 55%` and
  `0 0 45%` with an 8px gap between them, so the pair ran exactly 8px past Create New and Upload
  PDF. Measured 1214 against 1206 before, all four controls end at 1206 now.
- The row actions are well done: the tooltip changes with the kind of embedding ("Delete and
  ignore this post from sync" for a synced post, "Delete this embedding" for a manual one).
- No console messages, no wasted requests.
- The repeated header row at the bottom of this table is not a bug: it is NekoTable's default and
  most screens use it. See the backlog.

### 8. Image Studio (2026-09-16 17:35)

Checked: console, the composer, every icon button, the versions rail, the Media Library panel, the
responsive rules. No redesign, only genuine bugs.

- **Fixed**: the prompt box starts one line tall and only grows once there is text in it, so the
  edit placeholder, which needs 57px in a 38px box, had its second half cut off. Measured every
  candidate against the real font and width: the edit one is now "Describe a change: warmer light,
  no car..." (267px in 326px) and the mask one "Describe what goes in the painted area..." (263px).
  The mask placeholder had only 2.8px of slack before, so it was one narrow window away from the
  same problem.
- **Fixed**: the wrench in the AI Engine header, the one button there with no label, had no
  tooltip and no accessible name. It now says Settings. That header is on every screen of the
  plugin, so this one was worth more than the studio.
- Everything else in the studio names itself properly: "Start something new", "Generate (Cmd
  Enter)", "Remove from the Studio", "Discard this version".
- No console messages.
- Could not test a narrow window: `resize_window` reports success but the viewport stays at 1288,
  so the 960px and 1200px breakpoints in `StyledStudio.js` are unverified. They exist and read
  correctly, but nobody has seen them work.

### 9. Playground (2026-09-16 17:55)

Checked: console, requests, every icon button, all placeholders, the page height, and the compare
flow with two lanes.

- **Fixed**: comparing two models sliced the select labels in half. Each lane header gives its
  selects about 115px for the label, the label wraps by default, so "Default environment" became
  two lines of 18.2px inside a 27px box with overflow hidden and the second line was cut through
  the middle. Now one line with a real ellipsis, vertically centred. The label is a flex box by
  default, which `text-overflow` does not apply to, so the rule makes it a block as well. Scoped
  to `.mwai-lane-head`, where the options are always plain text.
- Every icon button here already names itself ("Tuning", "Send (Enter)").
- No console messages. No REST call on load at all.
- Checked the same placeholder clipping that bit the Image Studio: none of the three fields here
  clip.
- The page scrolls 72px, but that is WordPress's own admin sidebar being taller than the window,
  not our content: `.neko-page` ends exactly at the bottom of the viewport and `#wpfooter` is
  correctly hidden. Nothing to fix.
- Also verified, and it is not a bug: `ImageGenerator.js` links to `edit.php?page=...` for a page
  registered under `tools.php`. WordPress resolves a registered slug whatever the parent file is,
  and redirects. Left alone.

### 10. Content Studio (2026-09-16 18:15)

Checked: console, placeholders, icon buttons, the page height, the four steps and their states,
the tone and length chips.

- **Fixed**: the Draft step said "0 of 4 sections written. Pick one to rewrite or edit it." when
  nothing had been written. There is nothing to rewrite on a first visit. It now reads "Nothing
  written yet. Pick a section to write it, or use Write missing for all of them." and only offers
  rewriting once a section exists.
- The chip hover fix Jordy reported in the night is in place and correct: a selected chip keeps
  white text on hover (`StyledContentStudio.js:142`), and its sub-label keeps its own colour.
- No console messages, no clipped placeholders, every icon button named, no horizontal overflow.
- The page scrolls, but the left panel scrolls internally as designed (583px container, 774px of
  content) and `.neko-page` ends exactly at the viewport. The document height comes from the
  WordPress admin menu, which is 1026px tall on this screen. Nothing to fix.
- The step states are right: Brief and Outline show a check, Publish stays disabled while no
  section is written.

### 11. Workspace (2026-09-16 18:35)

Checked: console, every button, the placeholders, the folders, the search, the Agents tab, the
model picker, the page height.

- **Fixed**: a search that matches nothing said "No conversations yet", which reads as if the
  account were empty when it simply did not match. It now says so properly.
- **Fixed**: the model list mixed two naming conventions. Every 4.5 and 5 generation model reads
  "Claude Sonnet 4.5", "Claude Opus 5", but Haiku alone read "Claude-4.5 Haiku", the old style
  from the 3.x era. It is a display name only, the model id is untouched, so nothing stored
  changes. Now "Claude Haiku 4.5", which is also Anthropic's own name for it.
- This is the best built screen in the plugin so far: **263 icon only buttons and every single one
  has a title or an aria-label**. No console messages, no clipped fields, no horizontal overflow,
  and the document height matches the window exactly, so nothing scrolls that should not.
- The Agents tab, which is not built yet, has a real coming soon state with an illustration and a
  sentence explaining what it will do. No dead end.
- The empty folder says "No conversations in this folder yet." Good as is.

### 12. Settings tabs (2026-09-16 18:55)

Checked: all eleven sub-tabs, console, the copy across the whole admin bundle.

- **Fixed**: em dashes in user-visible wording. Rather than reading each screen, the whole source
  was searched for the character. Seven were real copy, not comments:
  the Custom environment help in Settings → AI, the OpenAI Vector Store warning in Knowledge, two
  strings in the PDF upload modal, and three of the example prompts offered in the Image and Video
  generators. Verified live: the Settings page now renders zero em dashes.
  `i18n.js` was already clean, so the translated strings were never the problem.
- The MCP tab is in good shape: OAuth and Bearer explained side by side, the two gotchas people
  hit with ChatGPT called out, and the Connected Apps rows read cleanly.
- The Others tab explains its disabled controls rather than just greying them out ("Enable the
  Forms module to use the Forms Editor"). Good.
- No console messages on any sub-tab.
- Nothing was written to the settings during this pass, on purpose.

### 13. Dev Tools (2026-09-16 19:15)

Checked: console, the Tasks Manager table, the Files Manager table, the Actions panel, every icon
button.

- **Fixed**: task names and descriptions were chopped mid-word. The column is 137px and the table
  inherits `word-break: break-all` from NekoTable, so it read "Sync Remot / e URLs" and
  "Re-creates e / mbeddings th / at are stale". The cell now uses the same `StyledCell` the
  Discussions and Insights tables already use, which keeps words whole. Verified on the element
  itself, not just the screenshot: the cell is now `word-break: normal`.
- The Files Manager below it keeps breaking anywhere, and that is right: those are long hashes
  with no spaces, so they have to break somewhere.
- 58 icon buttons, all named. No console messages.
- The Actions panel explains what each button does before you press it. Good.

### 14. Templates and presets (2026-09-16 19:35)

Checked: the classic Content Generator with its Template panel, the edit mode, the confirmations,
and every admin screen for unsubstituted placeholders.

- **Fixed**: the Language help read "AI supports all languages with varying quality. **%s**." The
  string ends with a placeholder meant for a link, and nothing ever filled it. The url and the
  label were already sitting in `i18n.js` right underneath, unused, and the file already has a
  `formatWithLink` helper. It now reads "...varying quality. Learn more" with a working link to
  the FAQ. That selector is shared, so the Content, Images and Videos generators all benefit.
- Swept every other screen for the same class of bug by scanning the rendered text for `%s` and
  `%d`: the classic generator was the only one. Four i18n strings with placeholders are never used
  at all, see the backlog.
- The Templates panel itself is correct: Rename and Delete are properly disabled on the Default
  Template (they look enabled at a glance because a disabled red button is still red, but they
  measure opacity 0.4 and `cursor: not-allowed`), and both Delete and Reset All go through a
  confirmation that says the change affects everyone on the site.
- The EDIT switch that resisted three attempts during the night shift does work. It needs a full
  pointer sequence (pointerdown, mousedown, pointerup, mouseup, click) to be driven from a script,
  which is a test harness quirk, not a bug.
- No console messages anywhere in this pass.

### 15. AI Forms (2026-09-16 19:55)

The Forms module is off on the test site, so the admin tab does not exist. Rather than switch a
module on behind Jordy's back, the front end was checked instead, which turned out to be where the
real problem was.

- **Fixed, and this is the worst thing found so far**: with the module off, a public page built
  with AI Forms printed its **raw shortcodes to visitors**, url-encoded prompts and internal ids
  included, for example `env_id="y9yq50zc"` and the whole prompt text. A module that is switched
  off never registers its shortcodes, so WordPress falls back to printing them as text. The same
  applies to `mwai_chatbot`, `mwai_discussions`, `mwai_form` and the stats shortcodes whenever
  their module is off. `Meow_MWAI_Core` now registers any of the plugin's shortcodes that nothing
  else claimed, as a no-op, late on `init`. The page in question went from a wall of markup to
  just its three headings.
  Checked for regressions rather than assuming: a page whose module IS on still runs its shortcode
  and still prints its own "chatbot not found" error, and the site-wide popup still renders. Only
  genuinely unregistered tags are touched.
- `nekoTab=forms` silently opens the Dashboard when the module is off, the same silent fallback
  fixed in iteration 7 for the renamed tabs. See the backlog: this one is a design decision.
- No console messages.

### 16. The classic screens (2026-09-16 20:15)

Which ones are actually reachable: the Content Generator via `?classic=1`, and that is it on this
site. The Videos Generator page answers "Sorry, you are not allowed to access this page" because
`module_generator_videos` is off, and the old Image Generator screen is no longer rendered at all
(see the open question in NIGHT-APPS-REDESIGN.md about deleting it).

- **Fixed**: the Bulk Generate tab showed a progress bar reading **0%** next to a disabled
  Generate button before anything had started, which looks like a run that began and stalled. It
  now appears only while a run is going. This is a consistency fix, not a design call: the
  Knowledge screen already does exactly this, with the comment "Progress Bar - Only show when
  active".
- No console messages, no horizontal overflow, no clipped placeholders, every icon button named.
- Checked and NOT a bug: the Template panel shows Undo and Save on a freshly loaded page. It only
  does that after something has actually changed. Switching to the Bulk tab sets `mode` on the
  working template, which is a genuine change, so the buttons are right to appear. A clean load
  with no clicks shows neither.

### 17. Decision 1: the four neko-ui fixes (2026-09-16 20:50)

Done in `~/plugins/neko-ui` on `ui-2026`, commit `cb1abea`, plus one line in AI Engine. All four
verified live on ai.nekod.net after rebuilding.

- **Checkboxes are reachable and operable from the keyboard.** The clickable node now carries
  `role="checkbox"`, `aria-checked` (with `mixed` for indeterminate), `aria-disabled`, a tabindex,
  a Space and Enter handler, and a focus ring, since a div gets none of that for free. Verified on
  the Modules tab: 22 checkboxes exposed correctly, and Space then Enter toggled one that writes
  nothing (Discussions Auto Refresh) from false to true and back.
- **A closed accordion builds nothing.** On the Chatbots builder the icon requests dropped from
  **22 to 3** on page load. Opening a section renders it, expands to its real height (measured
  589px) and loads its 25 images then.
- **Tables keep words whole.** The `word-break: break-all` default became `normal` with
  `overflow-wrap: anywhere`, so a value with no spaces still breaks. The Files Manager, which is
  all hashes, opts back in with the new `breakAnywhere` prop. Verified both on Dev Tools: the task
  names read properly, the hashes still wrap.
- **An empty table says "0 results".** Verified by filtering Discussions to nothing.

Worth recording: **the accordion change was wrong the first time and the verification caught it.**
Rendering on first open meant the resize observer never saw the content appear, so the section
opened to 15px of padding and looked empty. It needed an explicit measure once the content is
mounted. Had I trusted the build and the icon count, I would have shipped a broken accordion to
every Meow Apps plugin.

Not verified from here: Code Engine and SEO Engine also use neko-ui. Nothing in these four changes
is plugin-specific, but someone should click through those two before this reaches users.

### 18. Decision 2: front end errors (2026-09-16 21:10). NO CODE CHANGE, MY FINDING WAS WRONG

**Correction.** In iteration 15 I reported that a public page shows "AI Engine: Chatbot 'x' not
found" to visitors, and Jordy decided it should be editors only. It already was, and had been
since 2026-07-24, commit b83122ae, whose message is literally "Showed chatbot configuration errors
only to editors instead of printing them publicly". Both call sites in `chatbot.php` (1326 and
1543) log the problem and then return the text only when `current_user_can( 'edit_posts' )`.

The mistake: I read that message on the front end while logged in as an administrator and
concluded visitors see it, without ever checking as a logged out visitor. Verified properly this
time with a cookie-free request: the public HTML contains zero occurrences of "AI Engine:" and the
chatbot still renders.

Checked the neighbours while correcting it, since the same reasoning error could hide elsewhere:
`shortcode_render_form` returns an empty string on every failure path and gates unpublished forms
on `read_post`, and the forms and stats shortcodes never return error text. Nothing leaks.

Lesson for the rest of the loop, worth repeating: **anything about what "visitors" see has to be
checked logged out.** Being an administrator changes what the page renders.

### 19. Decision 3: em dashes in the Content Studio prompts (2026-09-16 21:20)

Narrower than expected, and better for it. Three of the four prompts already asked for no em
dashes: the section writer ("Do not use em dashes: prefer commas, colons or separate sentences"),
the excerpt and the five title suggestions. Only the **outline** prompt was missing it, which is
exactly where the em dashes in the test project came from. One line added there, same wording as
the writer so they cannot drift apart.

Verified without spending anything: `window.fetch` was patched to capture the request body and
reject it, so the real outgoing payload could be read with no call reaching the provider. The
body contains `"instructions":"You are an experienced editor who plans clear, useful web
articles. Do not use em dashes: prefer commas, colons or separate sentences, they read more
human."` The saved project survived, since the request never completed.

Not verified, and it cannot be cheaply: whether the model actually obeys. One sample would not
prove much either way. The instruction is now on every prompt that produces prose.

### 20. Out of band: the 3.7.8 fatal with XML Sitemap & Google News (2026-09-16 21:45)

Came in from the Meow Apps session, reported by a Pro customer (HelpScout 3451536590). Jumped the
queue because it takes a whole site down, front end included.

Mechanism, confirmed in the source rather than taken on trust: `get_ai_crawler_access()` runs
`apply_filters( 'robots_txt', ... )` when the site has no physical robots.txt, and it is reached
from `populate_dynamic_options()`, which runs while plugins are still being included.
xml-sitemap-feed hooks `robots_txt` and calls `$wp_rewrite->using_permalinks()`. `$wp_rewrite`
does not exist that early, so the call fatals. Shipped in d8d6dd10, released in 3.7.8.

**Fix**: one guard at the top of `get_ai_crawler_access()`, return null unless
`did_action( 'wp_loaded' )`. Deliberately small, per Jordy: the value only feeds the Modules tab
and the Dashboard card, both rendered long after `wp_loaded`, both JS consumers already handle
null, and `populate_dynamic_options()` recomputes on every `get_all_options()` call, so an early
null is never cached. Nothing else changed.

**Proved it, before and after, on this machine.** The test site does not have that plugin, so a
temporary mu-plugin reproduced it: a `robots_txt` hook calling `$wp_rewrite->using_permalinks()`.
- With the fix stashed: "Fatal error: Uncaught Error: Call to a member function using_permalinks()
  on null", the same error the customer reported.
- With the fix restored, transient deleted so the filter really runs: admin loads, no fatal,
  `seo_robots` still computed from the virtual robots.txt with all 8 bots.
The mu-plugin was deleted and the transient cleared afterwards. Nothing left behind.

Worth keeping in mind: xml-sitemap-feed is only the plugin that noticed. Handing control to any
third-party filter during plugin bootstrap is the real hazard, and this file already carried a
comment about not calling user functions there.

### 21. Decision 4: edited images inherit the parent's title (2026-09-16 21:55)

`saveVersion` always titled a version after the prompt and built the filename from it. For a new
image that is fine, the prompt describes the picture. For an edit or a variation the prompt is an
instruction, so the Media Library filled up with entries called "Create a fresh variation of this
image. Keep the subject, framing" and filenames to match.

Now a version with a parent takes the parent's title, and the filename is slugified from that. A
brand new image still takes its prompt. The instruction is untouched in the `mwai_prompt` meta,
and Suggest still rewrites both fields. The parent title is captured at enqueue time, while the
parent is the current image, rather than looked up later from a closure that could be stale.

Verified without spending a cent and without creating anything: `window.fetch` was patched to
return a stubbed success for the image endpoint and to capture then reject the `create_image`
call, so the exact payload could be read.
- Editing v1 of the Cyclades poster sent `title: "Cyclades 2026 - poster-vintage v2"`,
  `filename: "cyclades-2026-poster-vintage-v2.png"`, with `prompt: "make the sky a bit warmer"`
  still carried separately. Before, both would have been the instruction.
- A new image still sends `title: "a red bicycle on a beach at sunset"` and the matching
  filename, so the create path is unchanged.
No attachment was created, the version list is the same as before, and the patches went away with
the reload.

Note for later: existing images keep their old titles, this only affects new ones. The Cyclades
image on the test site is still called "...poster-vintage v2" with an em dash in it, which is my
own test data from the night shift rather than anything the plugin generated.

### 22. Decision 5: the MCP Logs Status column (2026-09-16 22:20)

Jordy's call, not the muted check that was recommended, and he was right: a column that is empty
on every row of a healthy site was not earning its 64px.

The column is gone and the tool name carries the state. A call that succeeded reads as plain
monospace text. A call that was denied or that failed takes the colour it used to have in the
badge (amber for denied, red for failed), gets the same lock or cross icon inline, and the
tooltip now holds both the tool name and the reason, for example
"wp_update_post / Denied: Access denied: your WordPress account is not al...".

Verified on real rows rather than assuming, both halves:
- page one, all successes, five columns (Time, User, Client, Tool, Duration), no Status, every
  tool name plain.
- page three, where the denied calls live, five rows flagged in `rgb(217, 119, 6)` with the lock
  icon and the full reason in the title.

Tool names on the test site are things like `wp_update_post`, which are short, so the extra width
went to Client and Tool without anything clamping.

### 23. Decision 6: Escape closes the popup chatbot (2026-09-16 22:35)

The handler sits on the chatbot root rather than on the document, which is what makes the "focus
is inside it" rule true by construction: React only fires it when the key came from inside the
chatbot, so Escape is never stolen from the rest of the page. It is ignored while `busy` or
`isUploading`, so it cannot look like a streaming answer was thrown away, and nothing touches the
input, so what was typed is still there when the window is reopened.

The close itself reuses the shrink animation. That logic was written inline on the mobile header
button with the comment "same as ChatbotHeader", so it existed twice already; it is now a
`closeWindow` callback used by both the button and Escape, rather than a third copy.

Verified live on the home page, all three behaviours:
- open, "half typed message" in the input, Escape from the textarea: the window closed and the
  text was still "half typed message".
- open, Escape dispatched from a paragraph of the page: the window stayed open. Checked that it
  was genuinely open first, because the first run of this test was ambiguous.
- the ChatbotHeader copy of the close logic was left alone, it is a different file and out of
  scope for this change.

### 24. Decision 7: a hidden tab explains itself (2026-09-16 22:50)

A link to a tab whose module is off used to open the Dashboard silently, which is a dead end for
anyone following a link from the documentation. Now it opens the Modules tab with a line saying
which module to switch on, right above the switches.

`MODULE_TABS` maps the nine gated tabs to their option and to the name the module goes by on the
Modules tab, so the message can say "the AI Forms module" rather than "module_forms". The check
runs in the component body, before the tabs read the URL, and reads the localized options rather
than the options state, because the state has not been through a render at that point. The old
legacy rename now lives in the same function, so a URL is resolved once: legacy name first, then
the module check.

Verified all four paths live:
- `nekoTab=forms` with the module off: URL rewritten to `nekoTab=modules`, Modules tab active,
  message reads "That tab is hidden because the AI Forms module is off."
- `nekoTab=knowledge` with the module on: opens Knowledge, no message.
- `nekoTab=embeddings`, the legacy name: still opens Knowledge, no message.
- `nekoTab=modules` on its own: no message.
No console errors on any of them.

Known gap, small and deliberate: the Forms tab also needs `forms_editor`, so a site with the
module on and the editor off still lands on the Dashboard without an explanation. Handling the
second condition would mean teaching the map about compound gates for one tab, which is not worth
it today.

### 25. Decision 8: the four tidy-ups (2026-09-16 23:05)

One commit, as asked.

**Unused i18n strings: deleted two of four, kept two on purpose.** The instruction was to check
first whether a screen had lost its text by accident, and two of them had.
- Deleted `MCP_INTRO`: it describes the SSE era ("For Claude, which cannot handle SSE directly"),
  and SSE was removed in June. The MCP tab has a newer intro written inline. Superseded.
- Deleted `LEGACY_MODELS_INTRO`: about legacy fine-tuning deprecated in January 2024, on a module
  that is itself scheduled for removal.
- **Kept `ASSISTANTS_INTRO`** and its `_URL` and `_LINK_TEXT` companions: the Assistants section
  has no intro at all now. That reads like text dropped when Assistants moved into Settings, not
  like a cleanup. Deleting it would throw away the only copy.
- **Kept `ALERT_CONTENTAWARE_BUT_NO_CONTENT`**: no equivalent warning exists anywhere in the code,
  so the check behind it looks like it was lost rather than replaced. Worth deciding whether the
  warning should come back before the string goes.

**Em dashes in code comments**: swept, and two of them were not comments at all.
- `EditorAssistant.js:1190` is **user-visible copy** in the editor sidebar ("Ask me to edit your
  post — rewrite paragraphs..."). The earlier sweep missed it because it only looked in
  `screens/` and `components/`, not `modules/`.
- `EditorAssistant.js:23` is inside the **system prompt** sent to the model, so it was teaching
  the model the punctuation Jordy bans, exactly like the Content Studio outline prompt.
The standalone "—" used as a no-value marker in a table cell is left alone: typography, not prose.

**One table look**: the nine remaining tables now pass `variant="compact"` like Discussions and
Insights, so no table repeats its header row under the rows. Verified on Knowledge (4 header
cells instead of 8, no tfoot) and on both Dev Tools tables.

**Scope column**: `minmax(90px, 124px)` became `minmax(100px, 124px)`. "Admin Tools" now measures
18px on one line and is no longer clipped, which was the half-pixel miss found in iteration 6.

### 26. Dashboard, second pass (2026-09-16 23:20)

Second rotation, so this went at the states the first pass did not reach: what the screen claims
when something is wrong, long values, and clipping.

- **Fixed**: the subtitle pluralised providers but not modules, so a site with one module on read
  "1 modules on". Same family as the "0 result" fix in neko-ui. The plural case still reads
  "6 providers, 15 modules on" after the change; the singular is not reachable on this site
  without switching modules off, so it was not observed live, only the line beside it that it was
  copied from.
- The headline is honest about bad states, which is what I came to check: no providers gives
  "Welcome. Let's connect your first AI provider", a provider with a problem gives "One provider
  needs a look", and only a healthy site gets "Everything is running". It does not claim things
  are fine when they are not.
- Nothing clips anywhere on the screen, all 15 chart bars carry a tooltip, and every link points
  somewhere real.
- No console messages, and still not a single REST call: the screen renders from the options
  already in the page.

Not fixed, and not ours to fix: "AI visibility, score". The payload really does contain
`period: "score"` for that tile, sent by SEO Engine, and AI Engine joins label and period with a
comma, which reads correctly for its sibling "AI bot visits, 7 days". Patching a heuristic into
our renderer to guess which periods are really periods would be worse than the wart. The one word
change belongs in SEO Engine: send no period for a score, or send "out of 100".

### 27. Modules, second pass (2026-09-16 23:30)

The first pass only looked at the screen as it is. This time the question was what happens when
saving a module fails, which is reachable without breaking anything: `window.fetch` was patched to
reject the call to `settings/update`, so the request never left the browser.

- **Fixed**: a failed save reported the generic sentence and threw the real reason away. The code
  had the message in hand and even gated on it (`if (err.message)`) before showing a modal that
  did not include it. Two things were wrong with that: the reason is usually the one line that
  tells someone what to do next ("cURL error 28", "your session has expired"), and an error
  without a message produced **no feedback at all**, so a save that silently failed looked exactly
  like a save that worked while the switch had already snapped back. The modal now always appears
  and carries the reason when there is one.
- Verified with two simulated failures: one carrying "cURL error 28: Operation timed out", which
  now shows on screen, and one with an empty message, which still produces a modal. The checkbox
  reverted to its real value in both cases, so the screen never claimed a module was on when it
  was not. Nothing was written: Library Search is still off after a reload, and every console
  error from the test says "simulated".
- The rest of the error state was already good and is worth keeping: the modal points at the
  console and the PHP error logs, with links.
- The keyboard support added to neko-ui earlier works on a real module switch: Space on the
  checkbox triggered the save.

Not verified, again: the rounded corner artifact on the feature cards. The cause is now clearly
identified in the CSS (`border-radius: 10px` with `overflow: hidden` and a transform on hover and
active, which is the classic corner rasterisation case) and `will-change: transform` is the
standard cure and is live. Whether the artifact still appears depends on the GPU, and a screenshot
is captured through a different path, so it cannot settle it. Jordy can tell in a second on his
own machine.

### 28. Chatbots builder, second pass (2026-09-16 23:35)

Carried the question from the Modules pass across the plugin: what happens when a save fails.
Found the same class of problem twice more, one of them worse than the original.

- **Fixed, and this is the serious one**: none of the four saves on the Chatbots screen had any
  error handling. `updateChatbots()` throws when the server refuses the write, and each caller did
  `setBusyAction(true)`, `await updateChatbots(...)`, `setBusyAction(false)` with no try, catch or
  finally. So a refused save left the screen **stuck busy forever** with nothing on screen to say
  why, and the change looked applied. `deleteCurrentChatbot` was worse still: it moves the
  selection before the save, so a failed delete made a chatbot look gone while it was still on the
  server. All four now go through one `saveChatbots()` that always clears busy, shows a red "Your
  changes were not saved" banner with the reason, and returns null so the caller stops instead of
  carrying on as if it had worked.
- **Fixed**: `refreshOptions` in Settings had the same `if (err.message)` gate as the save path
  from the last pass, so a failed refresh could say nothing at all and leave the screen showing
  settings the site no longer has.
- Verified live by rejecting the call to `settings/chatbots`: the banner reads "Your changes were
  not saved. The reply sent by the server is broken.", the screen stays usable, and after a reload
  there are still 8 chatbots, nothing was added, and the banner is gone. Every console error from
  the test says "simulated".
- Worth noting the side effect of the accordion change from earlier: with every section closed the
  builder now renders no form fields at all until one is opened, which is why the checkbox sweep
  found zero controls here at first.

### 29. Chatbot front end, second pass (2026-09-16 23:50)

Same question again, now on the part visitors actually touch: what a failed message looks like.
The answer was mostly "very good", and the two things found were next to it rather than in it.

What is already right, and worth not breaking: on a failed reply the chatbot clears busy, removes
the thinking bubble, keeps the text for a retry, shows the server's message when it is meant for a
visitor, and swaps in a generic sentence when the error is a runtime bug whose text would mean
nothing ("data is not defined" from someone's custom filter). Verified live by rejecting the call:
the message appeared, no thinking bubble was left, and the send button came back.

- **Fixed**: the reply actions were unreachable by keyboard. Copy, Delete, Retry on an error, and
  Copy, Download, Print on a normal reply are all divs with an onClick, so nobody navigating by
  keyboard could use any of them, and two of them (Copy and Download on normal replies) had no
  title either, so there was no tooltip and nothing for a screen reader. They share one
  `actionProps` helper now: role, tabindex, a name, and Enter or Space. No styling changed, which
  matters because every theme restyles these.
- **Fixed**: a failed message left an empty assistant bubble in the saved history. The error path
  removes the placeholder from the screen but never saved that, unlike the Stop path right above
  it, so after a reload the conversation showed an empty bubble with the bot's avatar, 30px tall.
  Verified by failing a message, reloading, and checking that the newest failure leaves nothing
  behind. The two older empty bubbles in the test conversation were from runs before the fix.
- Cleaned up afterwards: the test conversations were cleared from this browser's local storage.
  The same sweep also reset two admin view preferences (`mwai-admin-chatbotKey` and
  `mwai-admin-discussions`), which only decide which tab was last open.

### 30. Discussions, second pass (2026-09-17 00:15)

Carried the same question here: what the destructive actions look like when they fail. Both of
them failed badly, in the quietest way possible.

- **Fixed**: `onConfirmDelete` was a `try` with a `finally` and no `catch`. Measured by rejecting
  `discussions/delete` with 1 row selected: the confirmation closed, the busy state cleared, the
  discussion stayed in the list, the checkbox stayed ticked, and not one word appeared anywhere on
  the screen. The only trace was nekoFetch's own console line. To anyone using it that reads as
  "the Delete button is broken". There is now a catch that shows a red "Nothing was deleted."
  banner above the table with the server's reason under it, and leaves the selection alone so the
  action can simply be tried again. Verified live: banner correct, row still selected, and after
  restoring fetch and reloading the table still reads 273 results, so nothing was deleted by the
  test.
- **Fixed**: the export reported failures through `alert()`, a browser modal on top of a modal,
  and left the progress bar frozen at whatever fraction it died on, which reads as "finished".
  It now shows the reason inside the export modal itself and resets the progress to 0, so the bar
  does not claim work that did not happen. Verified live by rejecting `discussions/list`: the
  modal reads "The export could not be finished, so no file was created." with the reason under
  it, 0%, and Export JSON is ready for another try. No browser dialog.
- Two new strings, `DISCUSSIONS.DELETE_FAILED` and `DISCUSSIONS.EXPORT_FAILED`.
- Console is clean on a normal load of the screen.
- Note for a later pass: the same missing-catch shape is worth checking on the Queries screen,
  which has the same Delete All and Delete Selected pair through the same modal.

### 31. Insights and Queries, second pass (2026-09-17 00:35)

The suspicion logged at the end of the last run was right, and checking it first paid off.

- **Fixed**: `onConfirmDelete` in `Queries.js` had exactly the same missing `catch` as Discussions.
  Measured the same way, by rejecting `system/logs/delete` with one row selected: the modal closed,
  the log stayed in the table, the row stayed ticked, nothing was said. Same fix, same shape: a red
  "Nothing was deleted." banner above the table with the reason under it, selection left alone.
  Verified live, then restored fetch and reloaded: still 3139 logs and 691 queries, so the test
  deleted nothing. The only console errors during the test were my own simulation, including the
  new "AI Engine: the logs could not be deleted." line.
- Worth noting the contrast: the export modal on this screen was already doing it properly, with an
  inline error and a real `setError`. It was the better-built of the two all along, which is why
  only the delete needed touching.
- **Fixed**: the copy around the three external links. Measured first rather than assumed: of 24
  links with `target="_blank"` on the screen, 21 are same-site "User #1" links where an external
  marker would be wrong, and exactly 3 are genuinely external. All 3 lacked the ↗ the rest of the
  plugin uses. Two also read badly: "If you want to apply variable amount of credits, click here."
  (missing article, and the only "click here" left in the whole admin) and "You are also always
  welcome to discuss about it in the Discord Server". They now read "If you want to give different
  users different amounts of credits, see the documentation on limits ↗" and "You are also very
  welcome to talk it over on our Discord server ↗", and the cost link is "read Cost & Usage
  Calculation ↗" instead of "check this:".
- **Not a finding, worth recording so it is not re-raised**: every docs link in the plugin points
  at `ai.thehiddendocs.com`. That looks like a staging host at a glance, and I nearly "fixed" it.
  It is the real AI Engine documentation site and is used consistently in 15 or so places. Leave
  it alone.

### 32. Knowledge (2026-09-17 00:55)

Different kind of find this time: a wasted request rather than a silent failure.

- **Fixed**: the Knowledge screen fetched the whole vector list twice on every visit and threw
  the first answer away. Measured, not guessed: `vectors/list` was POSTed twice on a clean load,
  and pulling the two React Query keys out of the cache showed exactly why. The query key is the
  stringified `queryParams`, and the initial state disagreed with what the effects settle on in
  four places:
  - `debugMode: false` in the initial state, but `useState(null)` for the real value
  - no `title` or `ref` keys at all, while the filters effect always adds them (as `[]`)
  - `sort.accessor: 'updated'`, which **no code path ever produces**. The real default is
    `created` for edit mode and `score` for query mode.

  So the guard that was meant to stop the redundant update ("Only update if values actually
  changed") could never pass on first run. The initial state is now built from the same sources
  the effects use, all of which are known at mount: `queryMode` comes from localStorage,
  `environments` from the options prop, so even `isOaiVS` is correct on the first render.
  Verified live: two requests down to one, and the single remaining cache key is byte for byte
  the one that used to win, so the screen ends up in exactly the same state it did before. Still
  4 results, console clean.
- Also verified the branches the change touches: with Query Mode on, the list is not fetched at
  all until you search (correct, and the empty state reads "Type a question above and hit AI
  Search to find the matching embeddings"), and sorting still works after the change, producing a
  fresh `updated` key on demand.
- Testing note worth keeping: clicking a NekoTable sort caret needs the full pointer sequence.
  A plain `.click()` does nothing, and I nearly recorded "sorting is broken" because of it. That
  is the second time this has caught me.

### 33. Image Studio, second pass (2026-09-17 01:15)

This screen is the best built in the plugin and most of the pass was confirming that rather than
finding fault. Worth writing down so it does not get "improved" later: every icon button has a
name (zero nameless buttons on the whole screen), the shortcuts are discoverable through the
tooltips that use them ("Brush (B)", "Compare (C)", "Generate (⌘ Enter)"), Escape genuinely does
what the lightbox tooltip promises, every async path calls `setError`, the error banner is
dismissable, and the two destructive modals say plainly what survives and what does not. The load
is two requests with no duplicates.

- **Fixed**: a failed generation took the user's prompt with it. `submit()` empties the composer
  as soon as the job is queued, and the job only fails later, so a provider hiccup or a rate limit
  left an error banner, an empty box and a disabled Generate button. The careful prompt was simply
  gone. Measured by rejecting `/ai/image_edit` in the browser, so nothing was generated and nothing
  was billed: banner correct, composer empty, button disabled. `runJob`'s catch now puts the text
  back, but only when the composer is still empty, so anything typed in the meantime is left alone.
  Both halves verified live: the prompt came back after a failure, and when I typed something new
  before the failure landed, the new text was kept and the old one was not forced back in.
  Confirmed afterwards that the sources still read 4 and 2 versions, so the test created nothing.
- This is the same courtesy the chatbot front end already gets, and which iteration 29 singled out
  as the best failure handling in the codebase. The Studio was the one place still throwing the
  text away.
- **Could not test here**: narrow window. `resize_window` reports success but `window.innerWidth`
  stays 1409, so the responsive path is unverified by measurement. Reading the CSS,
  `StyledStudio.js` does handle it: three columns, 200/260 under 1200px, single column under
  960px. Someone on a real narrow window should confirm.

### 34. Playground (2026-09-17 01:40)

Checked the failure path first, expecting the Image Studio bug again. It is not there: the
Playground puts the typed message into the transcript as a user turn before sending, so a failure
never costs you your text. Two smaller things were wrong, both the same idea: a failed reply was
being dressed up as a reply.

- **Fixed**: a failed reply showed a lone "0.0s" under the error. The meta row renders whenever
  `totalMs` exists, and a failure still has a duration, so the only thing on the row was how long
  it took to fail, which tells the reader nothing. The row is now skipped when a message failed
  with no content and no usage. Deliberately still shown for a stopped reply, where the elapsed
  time and the partial text are both real.
- **Fixed**: "Copy as Markdown" pasted the error as the model's words. `${m.content || m.error}`
  meant a transcript read "**gpt-5.6-sol:** Rate limit reached", which is actively misleading the
  moment it is pasted into a bug report or a forum thread. It is now an italic parenthetical, and
  a stopped reply keeps both its partial text and the note, since both are true.
- Verified both live at zero cost by stubbing `/ai/completions` in the browser, first rejecting it
  and then returning a fake success, so no provider was ever contacted. The two bubbles side by
  side: the failed one shows the error and nothing else, the successful one still shows
  "0.0s 12 → 14 $0.0001". The success path is untouched, which was the thing worth proving.
- Checked and found fine, worth not re-raising: the load is a single request, the empty state names
  the model and its per-million prices, the stats under the sidebar are labelled ("session cost",
  "tokens", "replies") and correctly do not count a failed reply, compare mode relabels the
  composer to "Send the same message to every model", the preset gets an unsaved-changes dot, and
  the web search checkbox warns that it costs more per reply.
- Not a finding after checking: Clear has no confirmation, but conversations are not persisted at
  all (only `mwai_playground_preset` is stored), so a reload does the same thing. A confirmation
  would be friction for nothing.

### 35. Content Studio (2026-09-17 02:00) — nothing worth fixing

First quiet iteration in a while. Everything probed was already handled, several times with a
comment explaining a past fix, so this entry is mostly a record of what not to re-raise.

Checked and correct:
- One request on load (`helpers/post_types`), clean console throughout.
- 22 buttons, zero without an accessible name; zero unlabelled inputs.
- Outline reordering: the first section's "Move up" and the last one's "Move down" are properly
  disabled, every icon button has a title.
- "New article" confirms, and the wording says exactly what is lost and what survives ("cleared
  from this browser. Posts you already created stay in WordPress.").
- Failure handling is the strongest part. `writeSection` restores the previous text on failure,
  leaves a stopped section empty so "Write missing" picks it up again rather than keeping half a
  paragraph, records a per-section error, and rethrows so the loop stops instead of grinding
  through the remaining sections. The per-section error is rendered, not just stored.
  `rewriteSection` does the same restore, which matters because it streams into the live section.

Two things I nearly "fixed" and should not have:
- **Em dashes in the outline text on screen.** They are in a project generated before the prompts
  were fixed and kept in localStorage. Both the writer and the outline prompts already say "Do not
  use em dashes", and the outline one carries a comment saying it was the prompt left out and
  where they kept showing up. Nothing to do.
- **The disabled "Publish" step has no tooltip explaining what unlocks it.** I was about to add a
  `title`, then tested it: Chrome does not show native tooltips on a disabled form control, so the
  attribute would have done nothing at all. Verified by setting a title on the live element and
  hovering, no tooltip. Doing it properly needs a wrapper element or `aria-disabled` plus a click
  guard, which is more surgery than a four step wizard with a greyed last step warrants. Recorded
  under "Worth doing, not urgent" rather than half done.

Lesson worth keeping: a `title` on a `disabled` button is a no-op. If a disabled control needs to
explain itself, the explanation has to live on something that is not disabled.

### 36. Workspace (2026-09-17 02:20)

- **Fixed**: deleting a conversation failed silently. `deleteDiscussion` is `async` with no catch,
  and the sidebar calls `onDelete(row.chatId)` without awaiting it, so a failure became an
  unhandled promise rejection: the conversation stayed in the list, the refresh never ran, and
  nothing was said. Measured properly rather than assumed, with the rejection captured through an
  `unhandledrejection` listener while `discussions/delete` was rejected in the browser. This is the
  same family as Discussions and Queries, and it matters more here because of the standing rule
  that a Workspace app should never leave the user guessing.
- The fix needed somewhere to put the message. ChatPane already had a notice strip with a 5 second
  auto clear (`flashNotice`), used for image save failures and attachment limits, but it was local
  state so nothing outside the chat could reach it. Lifted it to WorkspaceApp and passed `notice`
  and `flashNotice` down, so the four existing ChatPane uses are unchanged and anything failing
  away from the chat now has a home. Added a cleanup for the timer on unmount, which the original
  did not have.
- Verified live, both directions: the delete failure shows "The database is read only right now"
  in the strip with no unhandled rejection, and calling `flashNotice` through the prop ChatPane now
  receives still renders its own notices. Afterwards, 50 conversations, nothing deleted. The only
  console errors are the new deliberate "Workspace: could not delete the conversation." line.
- Testing note: the two step delete arms for 2500ms and my tool round trip is longer than that, so
  clicking twice through the browser just re-armed it. Reached the handler through the row's React
  props instead, which tests the real path. Same trick needed for the notice itself, which clears
  after 5 seconds: a MutationObserver recorded it rather than trying to catch it in a screenshot.
- Checked and correct: two requests on load with no duplicates, the ⌘K shortcut genuinely works
  and is captured before WordPress's own command palette can see it (verified, the palette stayed
  closed and the composer took focus), search has a real empty state, the two step delete is a
  proper confirmation with a changing tooltip, and a failed message shows a red bubble while
  keeping the user's text in the transcript.

### 37. Settings tabs (2026-09-17 02:35)

- **Fixed (neko-ui, commit 2c99c0e)**: the whole Settings sub-navigation was mouse only. The eleven
  section links (AI, Chatbot, Workspace, Knowledge, MCP, Orchestration, Files & Media, PHP API,
  REST API, Add-ons, Others) are `NekoQuickLinks`, which renders a styled `<span>` with an onClick
  and nothing else: no role, no tabindex, no key handling. Measured on the live page: 18 such spans,
  every one of them `role: null, tabindex: null`. Someone navigating by keyboard could not reach a
  single Settings section.
- They are now `role="button"`, `tabIndex={0}`, Enter and Space, `aria-current` on the active one,
  and a `:focus-visible` ring (white on the inversed variant used over the blue header). Kept as
  buttons rather than the ARIA tab pattern on purpose: `NekoQuickLinks` is also used for filters
  and counters, not only for tabs, and a real tablist would need roving tabindex and arrow keys,
  which is a bigger change than this warrants.
- Verified live on two different users of the component: Settings (Enter moved to the MCP section
  and the MCP panel rendered) and Insights (Space switched Query Logs to MCP Logs, table headers
  changed to Client, Tool, Duration). The focus ring is visible on the blue header.
- **Also fixed**: an em dash in a `Links.js` comment, since the rule covers comments and the file
  was being edited anyway.

Two hours of confusion worth writing down, because it will happen again:
- The plugin aliases `@neko-ui` to `../neko-ui/` and compiles it from source, and a cacheGroup
  puts it in `app/vendor.js`, not `app/index.js`. So a neko-ui change never shows up in index.js
  and grepping the wrong bundle says "the change did not land".
- Worse, `classes/admin.php:364` derives one `$cache_buster` for every script from the mtime of
  `app/index.js` alone. A change that only touches vendor.js leaves index.js byte identical,
  webpack skips rewriting it, the version query string does not move, and the browser keeps
  serving the old vendor.js forever. There is a built-in escape hatch for exactly this:
  add `?mwai_cache=1` to the admin URL. Use it after any neko-ui change.
- Also had to `rm -rf node_modules/.cache` once, the webpack filesystem cache had gone stale on
  the hardlinked neko-ui file.

Checked and correct: the four external links in the PHP API and REST API sections do carry ↗, it
just lives inside the i18n strings (`PHP_API_FUNCTIONS_TEXT` and friends), so grepping the JSX for
an arrow gives a false positive. Verified in `app/i18n.js` before concluding anything.

### 38. Dev Tools (2026-09-17 02:55) — found a real one, did not fix it

Found the largest waste this loop has turned up, diagnosed it precisely, attempted a fix, could
not explain the result, and reverted. Nothing shipped. The diagnosis below is the deliverable.

**The Dev Tools screen sends about one REST request per second, forever.** Measured three times:
48, 47 and 48 `helpers/cron_events` calls per minute, for as long as the tab is open, each one
booting WordPress. On the 148-request snapshot that first caught my eye, all but a handful were
this one endpoint. It keeps going with the Heartbeat panel collapsed, which it is by default, so
nobody is even looking at what it fetches.

The mechanism, confirmed by capturing eight consecutive response bodies:
- `cron_events` returns `next_run_human` and `last_run_human`, freshly worded every call
  ("In 2 seconds" then "In 1 second", "3 seconds ago" then "4 seconds ago"). The machine fields
  `next_run` and `last_run` were identical across all eight. Every payload was distinct, 8 of 8.
- So React Query's structural sharing cannot keep the old reference, `tasksRunner` is a new object
  every time, and the effect at `TasksManager.js:335` that depends on it re-runs.
- That effect ends by scheduling `refetchCronEvents()`, with the delay clamped to a 500ms floor.
  The midpoint it aims at (`last_run + interval/2`) has almost always passed by the time the
  answer arrives, so the clamp applies, the refetch fires, a new object comes back, and it
  schedules itself again. A self-feeding loop.
- Worth noting what the panel actually renders: the runner name, the `schedule` string
  ("Every 5 Seconds") and a Run now button. It never displays the human strings that drive the
  loop, and there is no countdown. The per-second traffic feeds nothing visible.

**Why nothing was shipped.** I tried two changes: depending on a stable signature built from
`hook|schedule|next_run|last_run` instead of the whole object, and replacing the 500ms clamp with
"aim at the midpoint of a later cycle". Measured result was zero calls per minute, which sounds
like success, but my own arithmetic on the live data said it should still fire every 500ms for a
5 second runner, and I could not reconcile the two. A fix I cannot explain is a fix I cannot
trust, particularly one that could silently freeze the heartbeat instead of pacing it. Reverted
both edits, rebuilt, and confirmed the original behaviour is back at 48 calls per minute.

### 39. Templates and presets, plus Jordy's dashboard notes (2026-09-17 03:20)

- **Fixed**: deleting a Playground preset looked like it worked even when it failed.
  `persistPresets` catches its own error and flashes it, but returned nothing, so `deletePreset`
  ran `applyPreset(fallback)` regardless and the screen jumped back to Default Template while the
  preset was still on the server. Proven end to end: created a throwaway preset, rejected the
  `system/templates` POST, watched the selector switch to Default Template, then reloaded and
  found the preset still in the list. `persistPresets` now returns whether the write landed and
  `deletePreset` only moves on when it did. Verified both ways afterwards, and the throwaway
  preset was deleted for real as part of the check, so nothing was left behind.
- Checked and correct: `usePresets` already saves the whole category rather than a subset, which
  is what the option shape requires, and the Image Studio renders its `presetError`.

Jordy came back mid-run with notes on the Dashboard. All done in the same commit as he asked for
fewer, larger commits:

- Dropped "Your keys stay on this site. Each tile opens its settings." from the Providers card.
- Dropped "Last fourteen days. Details has costs, tokens and providers." from the week card, and
  put the two end dates under the sparkline instead ("Sep 4" on the left, "Sep 17" on the right),
  which was his suggestion and says the same thing without a sentence to read.
- Moved "Switch on what you need" from the top of Modules to the bottom, and corrected it: it
  claimed turning a module off hides its tab, which is not true for every module. It now reads
  "Turning one off only puts its screens and options away, nothing is deleted." Measured at 92%
  down the page.
- The AI visibility card: the two bare numbers now have something to look at. A score out of 100
  gets a thin meter bar under it, and when SEO Engine has no numbers to show the card keeps its
  shape with a shimmering grey placeholder instead of collapsing to a wall of pills. Checked the
  placeholder's rendering by injecting the markup on the live card, since this test site has
  crawling discouraged and never reaches that branch.
- Also stopped "score" being printed as if it were a period: the tile read "AI visibility, score".
  The real fix is on the SEO Engine side, noted in the Desktop file.
- Jordy's wider point, that this card is still the least attractive thing on the Dashboard while
  everything above it has a chart, is only partly addressed. The meter and the placeholder help,
  but a real redesign is his call, not mine.

Open questions for Jordy were collected into `~/Desktop/ai-engine-questions-for-jordy.md`.

### 40. AI Forms (2026-09-17 03:45)

The module is off on this test site, so the first thing the area does is hit the hidden-tab
message from iteration 26. That turned out to contain a bug of my own.

- **Fixed**: the hidden-tab message named a module that does not exist. `MODULE_TABS` carried
  hardcoded English names, and the forms entry said "AI Forms" while both the tab and the switch
  on the Modules tab are called "Forms". So the message said "That tab is hidden because the AI
  Forms module is off. Switch it on below" and sent the reader looking for a switch with a
  different name. Worse, all nine names were English literals inside an otherwise translated
  sentence, so on a translated site every one of them would have been wrong. They now come from
  the same i18n keys the Modules switches use (`i18n.COMMON.FORMS` and friends), which fixes the
  mismatch and the translation gap in one go. Verified live on two tabs: forms now reads "the
  Forms module is off" with a matching "Forms" switch on the page, and finetunes still reads
  "the Finetunes module is off".
- **Fixed**: on the Forms screen, every row's trash button spun while a single form was being
  deleted. `busyDelete` was one shared boolean passed to all of them. It is now the id being
  deleted, so only that row shows as busy. Not verified live, deliberately: proving it needs an
  actual delete, and those are Jordy's forms. The change is a one-line comparison.
- **Fixed**: "You can disable this tab in Settings > Others > Interface" now uses the arrow the
  rest of the plugin uses for paths, "Settings → Others → Interface". Verified live.
- Checked and correct: the screen has a real empty state ("No forms yet. Create one to get
  started."), the delete confirmation says it cannot be undone, and errors render through
  `NekoMessage`.
- **Process note worth keeping**: my first read of this area was wrong. I loaded the forms tab,
  saw it land on Chatbots with no message, and nearly logged "the hidden-tab fix has regressed".
  Re-testing showed it works perfectly; the first query had simply run before the app finished
  booting. Two readings before a conclusion, especially a conclusion about my own earlier work.
- Turning the module on to look at the screen was a settings change, so the options were
  snapshotted before and after. `module_forms` is back to `false` and the only difference between
  the two snapshots is usage statistics (one gpt-6-astra query, 248 prompt tokens), which is the
  Dev Mode Ping Example task running on its own schedule, not anything this pass sent.

### 41. Classic screens, and Jordy's link (2026-09-17 04:05)

Last area of the rotation. The classic Content Generator is in better shape than its age suggests.

Checked and correct: two requests on load with no duplicates, 11 buttons and zero without a name,
zero unlabelled inputs, the staged flow gates properly (Generate unlocks the moment a topic is
typed, the rest unlock as content appears), and a failed generation shows an Error modal with the
reason and leaves the button usable. Verified the failure by rejecting `/ai/completions` in the
browser, so nothing was generated or billed.

The one thing wrong here is the plugin-wide one already in the backlog: five greyed buttons on
arrival with nothing to explain them, and a `title` on a disabled button shows no tooltip.

- **Done, at Jordy's request**: a link to the classic generator at the bottom of the Brief panel
  in the Content Studio. One already existed, but it sat in the actions row beside the primary
  button labelled only "Bulk generation", which never told anyone it leads to the older screen.
  It is now a quiet footnote under the button: "Prefer the older screen? The classic generator is
  still here, with bulk generation from a list of topics." Verified live: below the actions row,
  and the href resolves to `tools.php?page=mwai_content_generator&classic=1`, which does load the
  classic screen with its Bulk Generate tab.
- **A false finding I caught before writing it up.** While checking that link I measured the
  classic screen from `tools.php` and concluded the Bulk Generate tab was missing there, which
  would have made the old link a broken promise. It was my regex: I matched `/Generate$/` against
  element text, and the bulk link renders as "Bulk Generate (0)" with the count in a child span,
  so it never matched. Re-measuring through the quick links themselves showed both tabs present
  on both URLs. Second time this run that a measurement, not the plugin, was the thing at fault.

That completes one full pass of the rotation.

### 42. Dashboard, second pass (2026-09-17 04:30)

Second time round the rotation. Deliberately stayed away from the cards changed an hour ago and
looked at the ideas card, which had not been examined before.

- **Fixed**: the Dashboard suggested things already done. "Set a spending limit" showed on a site
  that already has limits enabled, because its condition only checked that the Insights module is
  on. The moderation idea three lines below already does this properly
  (`o.module_chatbots && !o.module_moderation`), so the pattern existed and this one just missed
  it. Now gated on `!o.limits?.enabled`. Verified live: the idea disappeared from this site, which
  also confirms limits really are enabled here.
- **Fixed, and the more interesting one**: the card promised three ideas and often gave fewer.
  Removing the limits idea dropped the pool by one and the card immediately rendered **two**
  ideas under a line still reading "Three ideas a day". The picker walked the pool with a stride
  of 5 (`(start + k * 5) % pool.length`) and then filtered duplicates out, so whenever the stride
  collided with the pool size it silently returned fewer. Checked properly rather than by eye: a
  pool of 10 can only ever reach two distinct entries, and a pool of 5 reaches **one**. Across
  pool sizes 1 to 13 and 400 seeds each, the old picker came up short 800 times; the replacement
  (consecutive entries from the seeded start, capped at the pool size) is never short and never
  duplicates. Verified live: three distinct ideas.
- The footer now says One idea, Two ideas or Three ideas to match, because a site with a single
  module on genuinely has fewer to give.
- Checked and correct: 16 buttons with none unnamed, no clickable elements the keyboard cannot
  reach, and every link resolves to a real destination with the right parameters
  (`page=mwai_images_generator`, `page=mwseo_settings`, `nekoTab=insights` for limits).

The Workspace iOS session reported the same silent-background-save pattern on their side and
reached the same conclusion independently. Both are now in the Desktop file as one decision for
Jordy rather than two.

### 43. Modules (2026-09-17 04:55)

Stayed off the intro sentence moved earlier tonight and looked at the switches themselves.

- **Fixed (neko-ui, commit c96f58c)**: every switch on the Modules tab announced itself as
  "Enable" and nothing else. Measured: 22 checkboxes, all keyboard reachable since the earlier
  Checkbox fix, but the accessible name of each was "Enable" plus its description, never the
  module. Walking up the DOM showed why: the name ("Chatbot", "Knowledge") lives in the
  NekoSettings head five levels above the control, with nothing tying the two together. So
  tabbing the page meant hearing "Enable, checkbox, checked" twenty-two times.
  `NekoSettings` now gives its head an id and labels its content as a group with it, which names
  the control without changing a pixel. Verified live: 22 of 22 checkboxes now sit inside a named
  group, and the names read Chatbot, Workspace, Knowledge, Library Search, AI Assistant, AI
  Copilot, Generators, Transcription.
  Because this touches every settings row in the plugin, it was checked beyond the Modules tab:
  the Settings tab shows 7 groups named Name, Type, API Key, Environment, Model, Streaming, with
  no duplicate ids anywhere on the page and no group pointing at a missing label. Layout unchanged
  on both.
- **Fixed**: the Heartbeat's "Run now" button did nothing at all. Found by accident, in console
  output left over from the Dev Tools pass: "Failed to run Tasks Runner: The Tasks Runner cannot
  be triggered manually." `classes/rest.php:618` refuses both runner hooks with a 403 on purpose,
  and the click handler only had a `console.error`, so pressing the button produced no visible
  response whatsoever. It now shows the reason the server gave, under the row. Verified live.

### 44. Chatbots builder (2026-09-17 05:15)

- **Fixed (neko-ui, commit c9dafaa)**: the entire Chatbots builder could not be opened without a
  mouse. Every setting on that screen lives behind an accordion (Chatbot, AI Model, File Uploads,
  Knowledge & Context, Functions, MCP Servers, Tools & Capabilities, Thresholds, Appearance,
  Popup, UI Builder, Advanced, Shortcodes), and `CollapsableCategory` renders its title as a
  styled div with an onClick and nothing else: no role, no tabindex, no key handling. Measured on
  the live page before touching anything: 12 clickable elements with no keyboard route, all of
  them accordion titles.
  They are now `role="button"` with a tabindex, Enter and Space, a focus ring, and `aria-expanded`
  so a screen reader can say whether a section is open before entering it. Verified end to end:
  14 headers, all focusable, and pressing Enter on "AI Model" flipped `aria-expanded` to true and
  rendered its fields, with the section laid out exactly as before.
  Checked the other consumers too, since this component is used well beyond the builder: the three
  Dev Tools accordions (Heartbeat, Logs Console, PHP Error Logs) still open on a mouse click and
  report their state correctly. No console warnings.
- **Fixed**: the round green "add a chatbot" button had no name at all, in either of the two
  places it is rendered (the select layout and the tabs layout). Hovering said nothing and a
  screen reader had nothing to read. Both now carry "Add a new chatbot". Verified: zero nameless
  buttons left on the screen.

Worth noting as a pattern across the last few passes: three separate components in this library
were built as clickable divs (quick links, settings rows, accordion titles). The plugin's own
code was fine each time; the gap was always one level down in neko-ui, and each fix reached far
more screens than the one being examined.

### 45. Chatbot front end, third pass, and the neko-ui sweep (2026-09-17 05:40)

Did the audit promised at the end of the last pass instead of waiting to trip over a fourth
clickable div. Grepped neko-ui for elements with an onClick that are not a button or a link and
carry no role. Five hits, two of them real:

- `Switch.js`, a **form control** rendered as a bare span. Fixed (neko-ui, commit 208bf6f).
- `Table.js` `.neko-column-action`, the sort and filter carets. Real, backlogged below.
- `Paging.js`, the pager controls. Real, backlogged below.
- `Checkbox.js` already had key handling from the earlier pass, and `Button.js` `.stop-section`
  sits inside a real button. Neither needs anything.

- **Fixed (neko-ui)**: `NekoSwitch` could only be thrown with a mouse and announced itself as
  nothing at all. Measured on the Chatbots builder: the Chatbots/Themes switch, which flips the
  entire screen, had no role, no tabindex and no state. It is now `role="switch"` with
  `aria-checked`, a tabindex, Enter and Space, and a focus ring. Verified end to end: focusing it
  and pressing Space actually switched the builder from Chatbots to Themes, and pressing it again
  put it back.
  One thing caught in verification rather than in review: the first version set
  `aria-label` from the on/off labels, which are empty on switches that label themselves from
  outside, and an empty `aria-label` wipes out an accessible name instead of adding one. It now
  falls back to no attribute at all. Checked both shapes afterwards: the Chatbots/Themes switch
  carries no aria-label, and the Knowledge switches carry "No", their state label.

- **Fixed (front end)**: a visitor using a keyboard could not attach a file to a chatbot at all.
  The real `<input type="file">` is `display: none`, so it is not focusable, and the visible
  control that opens it was a plain div with an onClick: no role, no tabindex, no name. It now
  answers Enter and Space and reads as "Attach a file", or "Attach another file" once something
  is attached. The small counter badge that clears attachments had the same problem and now reads
  "Remove the attached file".
  Verified that the control takes focus and carries its name. Deliberately did **not** press
  Enter on it: that opens the operating system file picker, which blocks the browser session, so
  the activation path itself is reasoned rather than measured.

### 46. Discussions, third pass (2026-09-17 06:05)

- **Fixed**: every Workspace conversation was labelled "Custom" with a cog icon. The Chatbot
  column falls back to "Custom" for any botId not in the chatbots list, and `mwai_workspace` is
  never in that list because the Workspace is not a chatbot you configure. Measured from the
  query cache rather than the screen: 4 of 10 conversations on this site carry
  `botId: "mwai_workspace"`, and all four read "Custom", which hid where they actually came from.
  They now read "Workspace" with a message icon and a "From the Workspace" tooltip. Verified live:
  four cells reading Workspace, zero reading Custom.
- **Fixed**: Escape closes the Full Screen view and nothing said so. The Image Studio lightbox
  ("Close (Esc)") and the Playground stop button ("Stop (Esc)") already word it that way, so the
  Back button now reads "Back (Esc)". Confirmed Escape genuinely works before advertising it.

Three things checked that turned out to be fine, worth recording so they are not re-raised:
- The row checkboxes looked unreachable to my keyboard sweep, but that was the outer wrapper: the
  focusable element with `role="checkbox"` sits inside, from the earlier Checkbox fix.
- **Auto Refresh cannot be tested in this environment, and looked broken until I checked why.**
  With it ticked, zero `discussions/list` calls arrived in 22 seconds where the 5 second interval
  should have produced four. The cause is the automation tab: `document.hidden` is true, and React
  Query deliberately skips interval refetches in a background tab. Not a bug, and the comment
  above the query already says exactly this. Anyone testing this needs a real foreground window.
- One request on load, no duplicates, no nameless buttons, and nothing overflowing in the
  Information panel.

Fourth false positive avoided this run, and this one nearly shipped: I first wrote the Workspace
label with `icon="chat"`. There is no `chat` preset in NekoIcon, so it would have logged a warning
and rendered a HelpCircle placeholder in the table. Checked the preset list before building and
used `message` instead.

### 47. Insights and Queries, third pass (2026-09-17 06:30)

- **Fixed**: the price tooltip contradicted the number next to it. Every Gemini row on this site
  reads "No price", and hovering said "Both token count and price are estimated, no data from the
  provider" on a row plainly showing **8,884 tokens**. `Queries.js:326` threw away the row's real
  accuracy whenever the price was missing (`hasPrice ? (x.accuracy || 'none') : 'estimated'`),
  which was meant to force the red bullet but took the explanation with it. The bullet still goes
  red, deliberately, but when there is a real token count and only the price is missing the
  tooltip now reads "Token count recorded, but no price is known for this model, so no cost was
  calculated". Verified live: 3 no-price rows with the new wording, bullet still red
  (rgb(227, 49, 54)), and priced rows untouched.
- Measured from the query cache rather than the screen: the three rows carry
  `accuracy: "none"`, `price: null`, `units: 8884 / 8466 / 31`. So both the old message and the
  overridden one contradicted the data. The wording now describes what is actually known.
- Checked and fine: 19 buttons with none unnamed, and the Scope column already reads "Workspace",
  "Discussions", "Admin Tools" and "Chatbot" properly, so the labelling gap found in Discussions
  does not exist here.

### 48. Costs follow-up, and Knowledge (2026-09-17 07:00)

**Checked the caveat I had attached to my own advice**, rather than leaving it hanging. I had told
Jordy that OpenAI and Anthropic return tokens but not dollars, flagged as worth confirming. It is
correct, but the check also showed my recommendation was too simple, so the Desktop file was
corrected rather than left to go stale:
- OpenAI returns `prompt_tokens_details.cached_tokens`, and `input_tokens_details.cached_tokens`
  plus `cache_write_tokens` on the Responses API.
- Anthropic returns `cache_read_input_tokens` at **0.1x** input **and**
  `cache_creation_input_tokens` at **1.25x**, a premium, with a nested TTL breakdown.
- So the pricing error runs **both ways**: later turns over-report, first turns under-report, and
  the two partly cancel in a monthly total, which is how this stayed invisible.
- `constants/models.php` has a single `cached` key, documented beside the Claude entries as the
  read rate. **There is no cache-write rate at all**, so this is new pricing data to maintain, not
  just wiring. The revised recommendation splits it into three steps and notes that capturing the
  counts is worth doing on its own, because they are lost forever today.

**Knowledge**: 24 buttons, none unnamed, nothing clickable that the keyboard cannot reach.

- **Fixed**: the Build Knowledge panel can render **"Push All (undefined)"**. Seen for real, not
  theorised: the WordPress session expired mid-pass and the button went from "Push All (6)" to
  "Push All (undefined)". The label was gated on `!isLoadingCount`, but a query that **errors** is
  not loading either, and its data is `undefined`, which a template string prints literally. It
  now shows the count only when there is a number, and formats it with thousands separators.
  Checked every state side by side rather than just the one I saw: loading and loaded are
  unchanged, the error case goes from "Push All (undefined)" to "Push All ", and a `null` count,
  which I had not seen, went from "Push All (null)" to the same clean label.
  **Not verified in the browser**: the session expired and I will not enter Jordy's password, so
  the fix is proven by a state table and a build, not live. Worth a glance next pass.

Two environment notes for whoever picks this up:
- A "Leave site?" dialog started blocking navigation away from the Insights tab. It is not ours:
  `beforeunload` appears nowhere in the plugin source, the built bundles or neko-ui, and Gutenberg
  reported no dirty state (`isEditedPostDirty: false`, 0 dirty entity records). Left unresolved
  and not chased further, since it is most likely the harness or another plugin.
- Opening a second tab redirected to `wp-login.php` with `reauth=1`, which is what surfaced the
  expired session. In-page tab switching still worked on the authenticated tab.

### 49. Chatbot front end, as a real visitor (2026-09-17 07:25)

**The WordPress session is expired and I will not log in**, so every admin screen is unmeasurable
for now. Rather than make unverified edits and call them polish, this pass went where measurement
still works: the public front end, logged out. That turned out to be the better test anyway. It is
the chatbot's actual audience, and iteration 15's false finding came precisely from testing it
while logged in as administrator.

- **Fixed**: the popup trigger never said whether the chat was open. It is a well-built control
  otherwise (role, tabindex, label, click and key handling all present), but with no
  `aria-expanded` it reads identically whether the chat is open or closed. Now bound to the
  chatbot's own `open` state. Verified as a logged-out visitor: "false" on arrival, and pressing
  Enter on the trigger opened the window (`mwai-open`) and flipped it to "true".
- **Fixed**: the "Close tip" control claimed `role="button"` while having no tabindex and no key
  handling, so it promised keyboard operability it did not deliver. It now has both.
  **Not verified live**: the icon tip was not showing on this page, so this one rests on reading
  the component rather than a measurement.
- Verified the iteration 45 upload fix survives for a real visitor: role button, tabindex 0,
  "Attach a file".

The visitor keyboard journey is now complete and every stop is named: the two shortcut buttons,
Attach a file, the composer, Send, and the trigger itself. The only clickable left without a
keyboard route is `.mwai-input`, the wrapper that focuses the textarea, which is benign because
the textarea inside it is focusable.

Also measured, and clean: a silent console for a visitor, and only four plugin assets on a public
page (theme CSS, chatbot.js, two SVGs), with no stray REST calls and no admin bundles leaking to
the front end.

**A timing trap worth recording**: after pressing Enter I read `aria-expanded` and got "false",
and nearly recorded the fix as not working. React had simply not re-rendered yet. Reading it again
a moment later showed "true". Two reads before a conclusion, especially when the first one
disagrees with what the screen shows.

### 50. The em dash sweep (2026-09-17 07:50)

The session is still expired, so admin screens remain unmeasurable and the public front end was
done last pass. Rather than ship unverified UI changes, this iteration took the backlog item that
needs no browser and is fully verifiable by grep: the deliberate em dash pass the notes have been
asking for.

- **Fixed, and the one that actually matters**: a **user-facing** error string in
  `premium/embeddings.php` read "The file was only partially uploaded — likely a network
  interruption." Anyone whose upload is cut short sees that. It was the only em dash in shipped UI
  copy, and it was hiding in a list of comments.
- Cleaned 26 em dashes out of prose comments across 16 files, plus two MCP tool descriptions that
  models read and may quote back.

**Deliberately left alone**, because they are not prose:
- `classes/modules/discussions.php:257` is `rtrim( $title, '.!?:;,—–-–' )`, a character list.
  Removing the em dash would change behaviour: titles ending in one would keep it.
- Two log-line separators in `mcp-plugin.php` and `mcp-theme.php` (`date('c') . ' — ' . $msg`).
  A delimiter, not a sentence.
- All five JS occurrences. Four are the "no value" marker in a table cell, and
  `WorkspaceMobile.js:129` is a regex that must keep matching em dashes in real device names.
  The earlier backlog note was right about this.

**Two things worth recording about the method:**
- A blanket " — " to ", " replacement produced comma splices in about half the lines ("Skip these
  models, they don't speak the schema"). I read every replaced line and hand-corrected 18 of them
  to a colon, a full stop, or a conjunction. CLAUDE.md warns against mechanical mass replace, and
  this is exactly why.
- **`pcf fix` reformatted unrelated code.** On `xai.php` it expanded single-line `if (...) { ... }`
  statements into multi-line blocks, adding 13 lines of churn to what should have been a
  two-line comment change. Reverted that file and redid its two comments by hand. Worth
  remembering: run `pcf` on a file you have only touched cosmetically and it may reformat the rest
  of it. The final diff was checked line by line to confirm nothing but comments and the two
  intended strings changed.

Verified: `php -l` passes on all 16 files, the diff contains no structural changes, and the
JS bundles still build.

### 51. Chatbot front end, a second configuration (2026-09-17 08:20)

Still logged out, so admin stays unmeasurable. Went to a public page carrying a different chatbot
setup (the OSX-themed popup on /chatbot-with-discussions/) rather than repeat the one already
covered.

- **Fixed**: closing the chat threw the visitor's focus away. Escape closes the popup correctly,
  but focus landed on `<body>`, so someone who opened the chat with the keyboard, typed, and
  pressed Escape had to tab through the entire page to reach it again. `closeWindow()` now returns
  focus to the trigger that opened it, on both the animated and the instant path, scoped to that
  chatbot's own root (`mwai-chatbot-{id}`) because a page can carry more than one. Verified end to
  end on a real visitor session: before, focus was "BODY (focus lost)"; after, it is back on
  `.mwai-icon-container`.
- Confirmed the iteration 49 `aria-expanded` fix on this second, differently themed chatbot too:
  false when closed, true when open, false again after Escape.

Checked and correct on this configuration: the macOS window buttons all carry names (Close,
Minimize, Maximize), the header is a labelled toolbar, the upload control keeps its name from the
iteration 45 fix, and nothing clickable inside the chatbot lacks a keyboard route.

**A false positive caught before it was written down**: my control sweep reported two images with
empty accessible names inside the shortcut buttons. They are WordPress emoji images, and checking
`alt` (which my extraction had not looked at) showed "👋" and "🤫", with the avatar carrying
"AI Avatar". Nothing wrong. That is the fifth time this loop that the extraction, not the plugin,
was the thing at fault.

**Timing, again**: a real `Escape` keypress between tool calls did not reliably reach the chatbot,
and the first two reads after it showed a half-closed state that looked like a regression.
Dispatching the keydown from inside the chatbot in a single call, then reading once the 330ms
close animation had finished, gave the clean before and after. Worth remembering that anything
behind an animation needs the read deferred past it.

### 52. Multi-upload chatbot, public (2026-09-17 08:45) — nothing worth fixing

Third iteration with the admin session expired, so this went to the multi-upload chatbot on
/multi-upload-stack-test/ (`multiple: true` on the file input), a configuration not covered before.

Everything checked came back correct, so this entry is a record of what not to re-raise:
- Nothing clickable inside the chatbot lacks a keyboard route, apart from `.mwai-input`, the
  wrapper that focuses the textarea, which is benign because the textarea inside it is focusable.
- Every control is named: the macOS window buttons, the labelled header toolbar, the upload
  control, and the four Copy and Delete pairs on the stored replies, all carrying role and
  tabindex from the iteration 29 and 45 fixes.
- Links inside replies are rendered with `rel="noopener noreferrer"` alongside `target="_blank"`,
  and the image lightbox opens with `'noopener'`. Correct for a visitor-facing surface.
- Conversation history in the visitor's browser is small (6.4KB across all keys) with no sign of
  unbounded growth.

**Two false positives caught before writing them down**, which is most of what this pass produced:
- The submit button reported its accessible name as **"Clear"**, which looked like a mislabelled
  Send. Typing into the composer flipped it to "Send": with history present and an empty box it
  offers to clear the conversation, and both states are correctly labelled. Deliberate, not a bug.
- The emoji images inside the shortcut buttons again showed empty names, for the same reason as
  last pass: my extraction reads aria-label, title and text but not `alt`, and the alts are
  "👋" and "🤫". Same false positive twice now, so it is written here as a standing note.

**A technique that did not work, recorded so it is not retried blindly**: to exercise the
attachment UI without opening an OS file dialog, I injected a fake FileList. Assigning
`input.files` from a `DataTransfer` silently failed in this context (the input stayed empty), and
calling the component's `onChange` directly with a synthetic event produced no upload request
either. The attachment chips UI therefore remains untested. It probably needs a genuine file
selection, which means a human at the keyboard.

Streak of iterations finding nothing worth fixing: 1.

### 53. The block chatbot page, and a lesson about my own signals (2026-09-17 09:10)

Fourth iteration with the session expired. Took the block chatbot page (/sample-page/), which
turned out to be the most interesting public surface so far, and then spent most of the iteration
chasing my own tail. No code shipped. What follows is worth more than a fix.

**Real finding, measured**: that page renders the **same chatbot twice, with the same DOM id**.
Two elements carry `id="mwai-chatbot-default"`, stacked at the same coordinates (1195, 791), each
with its own trigger, and `document.getElementById` naturally answers with the first. Duplicate
ids are invalid HTML, but the specific reason it matters here is that **my own focus fix from
iteration 51 looks the trigger up by id**, so on a page like this closing the second chatbot would
move focus to the first one's trigger. Documented in the backlog rather than fixed, for the reason
below.

**Where I went wrong, in order:**
1. Wrote a proper fix: `forwardRef` on `TransitionBlock` so the chatbot could find its own trigger
   through its own root node instead of a document-wide id lookup. Correct in principle.
2. Could not make Escape close the chatbot on the two-chatbot page, then could not make it close
   on the single-chatbot page either, where it had worked in iteration 51.
3. Concluded my change had caused a regression, and reverted it.
4. **Re-ran the same test on the reverted build. It behaved identically.** So the change was never
   the cause, and I reverted a sound improvement on a false signal.

The actual cause is the test method, not the plugin: a dispatched `KeyboardEvent` for Escape
reaches the handler in some sequences and not others, and I still cannot say which. Iteration 51's
success was dispatched at the top level of a tool call; today's failures were inside `setTimeout`.
That difference should not matter, which is exactly why I should not have treated it as evidence
about the product.

**What this means for the loop**: "it stopped working after my change" is not a regression signal
unless the pre-change build is retested the same way. I had the known-good build available the
whole time and only used it after reverting. Do that first next time, it is one build.

The code is exactly as committed in iteration 51, which was verified working end to end.

Streak of iterations finding nothing worth shipping: 2.

### 54. Stopping the loop (2026-09-17 09:35)

Third iteration in a row without shipping code. Per the loop's own rule, saying so and stopping.

**The reason is environmental, not that the plugin has run out of problems.** Two things have to
be true for this loop to work, and neither is right now:
- The admin has been unreachable since the WordPress session expired five iterations ago. Every
  admin screen in the rotation is unmeasurable, and I will not log in as Jordy.
- On the public side, driving the chatbot reliably has stopped working. Dispatched clicks and key
  events reach React in some sequences and not others, and real clicks are now missing the trigger
  despite the coordinate scaling being accounted for (the frame is 0.922x CSS pixels here).

**What I did learn, and it is the useful part: my own measurement was wrong.**
`className.includes('mwai-open')` also matches **`mwai-opening`**. Several "the chat is open"
readings across the last few iterations were therefore unreliable, and that false signal is what
sent me chasing a non-existent regression in iteration 53.

Reading the real React state instead of the class list showed the chatbot sitting in
`opening: true, open: false` for more than three seconds after a dispatched click, which explains
cleanly why Escape never fired: `onRootKeyDown` requires `open`. Whether a real user can reach
that stuck state I could not establish, because I could not land a reliable real click. Recorded
in the backlog as a lead with exactly that caveat rather than as a bug.

**Checking the damage to earlier conclusions**: iteration 51's fix is still properly verified. Its
key assertion was `focusReturnedToTrigger`, a direct element identity comparison
(`document.activeElement === trigger`), which does not touch the class string at all. The
`mwai-open` substring flaw affects the surrounding context lines, not that result.

**Where things stand for whoever picks this up:**
- 51 iterations of findings are logged above. The backlog below has the open items, the largest
  being the Dev Tools polling loop, the cost pipeline, and the disabled-control tooltips.
- Two fixes are shipped but verified only by reasoning and a build, not live: "Push All
  (undefined)" on Knowledge, and the "Close tip" keyboard handler on the chatbot trigger.
- The loop is worth restarting the moment there is a WordPress session again. Log in at
  ai.nekod.net first, then confirm those two.

### 55. AI Forms, front end, with the module switched off (2026-09-17 11:30)

Restarted on Jordy's word, with his new emphasis: mainly testing, visual checks as well. The admin
is still unreachable, and this time I checked that properly rather than by the cookie: reading
`document.cookie` for `wordpress_logged_in` is meaningless, because WordPress sets that cookie
httpOnly, so the check returns false whether or not you are logged in. Fetching an admin URL and
looking at where it lands is the honest test. It lands on `wp-login.php`. Logged out, confirmed.

So: AI Forms, which is in the rotation, has never been tested, and is entirely public.

**What the page actually looked like, which is the whole point of looking.** `/ai-forms/` rendered
**three solid black bars** and nothing else. Measured: `.mwai-form-container`, 675x30, background
`rgb(33,33,33)`, three empty children, no text.

**The cause, traced rather than guessed.** `module_forms` is `false` on this site, so
`MeowPro_MWAI_Forms` is never constructed (`premium/core.php:45` gates on it) and none of the
`mwai-form-*` shortcodes are registered. My own earlier fix, `neutralize_orphan_shortcodes`, was
already catching the worst of that: it renders unregistered AI Engine shortcodes as nothing instead
of printing raw markup with ids and url-encoded prompts to visitors. But it stopped one step short.
The **container block** is static saved markup, so it survives, and `themes/chatgpt.css:1118` gives
`.mwai-form-container` a padding and `--mwai-backgroundSecondaryColor`. Empty container, full
paint. Three of them.

**Fixed** in `classes/core.php`: a `render_block_ai-engine/form-container` filter that drops the
container when everything inside it is a shortcode we neutralized and nothing else would show.
The ordering is what makes it work and is worth remembering: `do_blocks` is priority 9 on
`the_content`, `do_shortcode` is 11, so at filter time the inner shortcodes are still raw text.
When AI Forms is on, its tags are not in the orphan list, their text survives the strip, and the
container is kept untouched.

**Verified in both directions**, because only one of them is the safe one:
- Live, module off: containers 0, black bars 0, and the "Speech" and "Vision" headings that sit
  between the containers are still there.
- Through `wp eval` against the real object, five cases: plain orphan form dropped; form plus a
  heading kept; form plus an image kept; module simulated on, kept; nothing orphaned at all, kept.
- No regression elsewhere: diffed the full served HTML of `/sample-page/` and
  `/chatbot-with-discussions/` with and without the change (`git stash`, curl, `git stash pop`).
  Identical apart from the per-request encrypted `shortcutId` values.

**Things I checked and did not fix, because they were not broken:**
- The chatbot pages look empty in a screenshot because that chatbot is in window mode. The floating
  trigger is there at bottom right. Not a bug.
- `[mwai_discussions id="chatbot-grok"]` renders nothing for visitors. That is deliberate and
  correct: the bot id does not exist, the error goes to `error_log` (confirmed in the log) and is
  shown only to people who can edit posts.
- `premium/forms.js` loading with no `?ver=` cache buster on `/ai-form-prefill-test/` is a bare
  hardcoded `<script src>` in that test page's own content, not plugin output.
- `resize_window` re-tested rather than trusted from my notes: it still reports success and leaves
  `innerWidth` at 1700. Narrow-viewport testing is genuinely unavailable through this tool.

### 56. The chatbot at phone width, at last (2026-09-17 12:05)

Admin still logged out, checked the honest way again (fetch an admin URL, see where it lands:
`wp-login.php`). Front end again.

**I found a way to test narrow width.** Every previous iteration recorded that `resize_window` does
nothing here, so "try a narrow window" has been skipped fifteen times. An iframe is a real viewport:
media queries evaluate against it. Two iframes on one page at 390x720 and 320x720, both loading the
chatbot page, gave a genuine phone layout I could both measure and photograph. Confirmed before
trusting it: `iframe.contentWindow.innerWidth` is 390, and `matchMedia('(max-width: 760px)')`
matches. This is the technique to use from now on.

**What the narrow layout actually looks like: good.** No horizontal overflow at either width
(`scrollWidth - clientWidth` is 0). Header, greeting, shortcuts and input all sit correctly, the
chat goes full screen as intended, and a 161 character unbroken URL wraps cleanly
(`overflow-wrap: break-word`) without pushing anything sideways.

**One thing I got wrong by looking and had to correct by measuring.** In the screenshot the 390
input looked borderless and the 320 input had a rounded blue pill, so I wrote down "inconsistent
input styling between breakpoints". Measuring killed it: both are h45, radius 26px, margin
10px 15px, identical. The only difference was the border colour, because the 320 one had the
textarea focused. That is the focus ring doing its job, which is a good result, not a bug.

**The real find: the composer grows without limit.** Pasting 3000 characters into a 1100x760
desktop viewport gives a 1388px tall textarea, a conversation of height 0, and a send button
1078px below the bottom of a `position: fixed` window, so it cannot be scrolled to. Full detail,
the cause, who is exposed, and a fix I verified live are in "Needs Jordy" below.

**I did not ship the fix, deliberately.** It works, I measured it working, and it is two lines. But
it changes the composer of every chatbot on every site, and the cap is a number somebody has to
choose. That is a design decision on the most used component in the plugin, which is exactly what
the backlog is for. The work is done so the decision is one word.

**A bonus: an old lead turned out to be my own instrument.** The "chatbot stuck in `opening`"
suspicion from iteration 54 is closed. `handleOpen` puts `setOpen(true)` inside a
`requestAnimationFrame`, and this tab is `document.hidden`, where Chrome never runs rAF. Proved it:
a rAF scheduled in the page did not fire in 1200ms while a `setTimeout` did, and the chat opened
the instant a screenshot forced a paint. Two iterations of suspicion, no bug. Worth remembering
that anything behind rAF is untestable from a hidden tab and will always look stuck.

### 57. The four chatbot themes, side by side at phone width (2026-09-17 12:40)

Admin still logged out (fetch lands on `wp-login.php`). Front end. Only the ChatGPT theme had ever
been looked at in 56 iterations, so: all four, at 360 wide, in four iframes on one screen.

**Technique, because the obvious version does not work.** Swapping the stylesheet href and renaming
the class on the container fails: React re-renders on the next state change and puts
`mwai-chatgpt-theme` straight back, so the page ends up with the new stylesheet and nothing
matching it, and renders as raw unstyled HTML. I nearly wrote that up as "three themes are broken".
What works is leaving the class alone and rewriting the CSS instead: fetch the theme file, replace
`mwai-<theme>-theme` with `mwai-chatgpt-theme` throughout, inject it as a `<style>`, and remove the
real stylesheet link. React cannot undo that.

Second gotcha, same family as iteration 56: the first screenshot after opening only forces the
paint that lets rAF run, so it catches the window mid animation and everything looks half
transparent. Take a second screenshot.

**Two things I "saw" that measurement killed:**
- The ●●● bubble sitting over the open chat in three themes looked like the trigger failing to hide.
  It is not: `triggerVisible` is false and the trigger box is 0x0 in **all four** themes. The bubble
  belongs to the *second* chatbot on that page, the known duplicate `mwai-chatbot-default`.
- The full width send bar under the input in Messages and Foundation looked like a flex row wrapping
  at narrow width. It is not: those two themes set `flex-direction: column` on `.mwai-input` on
  purpose. ChatGPT and Timeless use `row` with a small square button. A design difference, not a
  break.

**My contrast measurements were wrong the first time and I nearly reported them.** The helper
ignored the alpha channel, so `rgba(255,255,255,0.4)` was treated as opaque white and produced
ratios of exactly 1.0. Rewrote it to composite every translucent layer up the tree over a white
base. Header ratios are still not trustworthy where the header uses a gradient (Timeless), because
`backgroundColor` does not see gradients, so those are discarded rather than reported.

**What the sound numbers say.** Message text is comfortable everywhere: 11.33 ChatGPT, 18.1
Messages, 18.9 Timeless, 9.3 Foundation. The one real signal is the shortcut chips, in the backlog
below.

**A finding that reversed itself, which is the useful part.** Messages and Timeless tint the
success and warning chips; ChatGPT and Foundation do not. My first reading was "two themes
implement one of three variants, that is an oversight". Reading the source said otherwise. Both
`chatgpt.scss:166` and `foundation.scss:92` carry the same comment: *prompt suggestions gains
nothing from being colour-coded, and tinting each chip only hurt legibility, so success / warning /
info render as plain chips*. Someone already made this decision deliberately, by eye, and reached
the conclusion I reached by measurement. So there is nothing to add to those two themes. The open
question is the other two, which still tint.

### 58. Chatbot error and loading states (2026-09-17 13:20)

Admin still logged out. Front end. Error and loading states are named in the brief and had never
been tested, and they can be tested for nothing by stubbing `window.fetch` so no request reaches a
provider. Four shapes, on `/chatbot-with-discussions/`.

**The error handling is genuinely good, better than I expected.**
- HTTP 500 with a JSON body: the server's message is shown in a red bordered block, the input is
  re-enabled, the user's own message is kept. Nobody is stranded.
- A PHP fatal returned as HTML with status 200, which is what a broken plugin or a security layer
  actually does in the wild: it does **not** dump the fatal to the visitor, and it does not show a
  raw parse error either. It says *"Your server replied with something that is not a valid AI reply.
  A plugin, a theme or a security layer is probably interfering with the REST API. Check your PHP
  error logs."* That is the right message for the person who can fix it, without leaking the server
  path to a visitor. Whoever wrote that did a good job.

**The waiting state is also good.** With the request hung, the submit button turns into a spinner
with a live elapsed timer (watched it go 0:20, then 0:40) and the reply bubble shows a typing
cursor. This is the opposite of leaving someone guessing, and it is worth keeping in mind next time
that rule comes up.

**What is missing is the way out.** No timeout, no abort, no Stop button, at 43 seconds and
counting. Written up in "Needs Jordy" above, along with the reason it is not a one line fix.

**No wasted requests.** A single chatbot page makes **zero** mwai calls on load and zero on open;
the session starts on the first message. One message costs exactly one `start_session` and one
`chats/submit`.

**Third false positive of the session, caught before reporting.** I first measured `start_session`
being called twice and nearly filed it as a wasted request. It was my own instrument: I had
installed a second `fetch` wrapper on top of the first without reloading, so every call was logged
once per layer. The giveaway was the log array holding a mixture of strings and objects, the two
wrappers having different push shapes. Reloading and installing exactly one wrapper gave one call.
Worth a rule: when stubbing `fetch`, reload first and guard with a flag, because a stale wrapper
survives anything short of navigation.

**And a wrong conclusion I caught by widening a grep.** I searched `ChatbotContext`,
`DiscussionsContext` and `workspace` for anything passing an abort `signal`, found none, and
concluded the plumbing did not exist. It does, in `app/js/components/chat/`, which I had not looked
in. The correct finding was almost the opposite of the first one: the capability is built and
working, it is simply not surfaced in the public chatbot.

### 59. Stopping the testing loop (2026-09-17 13:45)

Checked the session once more: still `wp-login.php`. Tenth iteration with no admin. Stopping, and
the cron is deleted.

**The rule says stop after three iterations that find nothing. That is not quite what happened, so
here is the honest version.** Iterations 56, 57 and 58 each found something real:
- the composer growing past the window and taking the send button off screen,
- the shortcut chips in two themes sitting at 2.78:1 and 2.16:1,
- no way for a visitor to stop a reply, with a hung server locking the composer until reload.

None of them shipped, and that is the actual reason to stop. Every one is a design decision that is
Jordy's: a number for the composer cap, a palette for the chips, a new control plus a truncate call
for the stop button. I can measure all of it. I cannot decide any of it. A loop that can only
produce backlog entries has stopped being a polish loop.

The second reason is reach. The admin has been unreachable for ten iterations, so Dashboard,
Modules, Chatbots builder, Discussions, Insights, Knowledge, Image Studio, Playground, Content
Studio, Workspace, the Settings tabs, Dev Tools and AI Forms in the admin are all untestable. What
is left public is the chatbot front end, which has now had seven passes, plus AI Forms markup and
the themes. That surface is worked out.

**What was genuinely gained in this run (55 to 58)**, beyond the backlog:
- One shipped fix: the orphan AI Form container no longer paints a black bar when the module is off.
- Narrow width is testable after all, through iframes. Sixteen iterations had recorded it as
  impossible because `resize_window` silently does nothing.
- Three false positives caught before they became commits, and one old lead closed as an artifact.
  The pattern in every case was the same: the instrument was wrong, not the plugin. A hidden tab
  never runs `requestAnimationFrame`. A contrast helper that ignores alpha returns 1.0. A second
  `fetch` wrapper logs every call twice. A grep that misses a directory proves nothing.
- Confirmation that the error and waiting states are in good shape, which is worth knowing.

**To restart**: log in at ai.nekod.net, then take the admin rotation from the top. Before anything
else, confirm the two fixes that shipped without live verification, listed at the end of iteration
54. The three decisions waiting are in "Needs Jordy" directly below; the composer cap is the one I
would do first.

## Backlog

### Needs Jordy

- **A guest cannot keep a stopped reply, and only Jordy can decide whether they should.** The Stop
  button shipped in e2f232f1 aborts for everyone, but the second half, saving the half finished turn
  so it survives a reload, goes through `/mwai-ui/v1/discussions/truncate`, and that handler starts
  with `$userId = get_current_user_id(); if ( !$userId ) return 401`
  (`classes/modules/discussions.php`). So on a public chatbot the save only works for logged in
  visitors. For a guest the call returns 401, the catch swallows it, and the stopped reply stays on
  screen until they reload. Nothing breaks, it just quietly does less.

  I did not touch it, because relaxing the auth on a write endpoint that edits stored discussions is
  a security decision, not a polish one. **Recommendation**: leave it. A guest's discussion is
  already keyed by session rather than user, so allowing guest writes here means trusting a
  client-supplied `chatId`, and the ownership guard just above only protects rows that already have
  a `userId`. If you do want guests covered, it wants a proper look at how `chatId` is issued and
  verified, not a one line change.

- ~~A visitor cannot stop a chatbot reply.~~ **Done 2026-09-17 (e2f232f1).** Jordy's design: the
  busy pill itself becomes the Stop, so nothing new appears in the layout. Hover or keyboard focus
  swaps the timer for a stop square; clicking aborts and then saves the partial turn. One thing to
  know, below.

  **Original finding kept for context.**
  Measured by stubbing `chats/submit` to return a promise that never settles. At 2.5s and again at
  43s: input `disabled`, submit button stuck on `mwai-busy`, no error, no timeout, and nothing
  matching `[class*=stop]` anywhere in the DOM. The elapsed timer just keeps counting. The only way
  out is reloading the page, which on a real site means losing the conversation in progress.

  **Almost all of the work is already done, which is why this is worth your time.**
  `useChatSession.js:494` already creates an `AbortController`, passes `abortController.signal` into
  `mwaiFetch` at line 508, and exports a working `stopGeneration` at line 696. The comment on line 61
  even says it is there to let a Stop button cancel the request. The public chatbot uses this very
  hook (`ChatbotContext.js:386`), it just never destructures `stopGeneration`, never puts it in
  `actions` (line 810), and never renders a control. **Workspace is the only consumer**
  (`WorkspaceApp.js:418`).

  **The part that makes it more than a button, and why I did not just do it.** Workspace's `onStop`
  aborts and *then* persists the partial turn, with this comment: *the server only stores completed
  turns, so without this the stopped turn would vanish on reload*. A public chatbot with Discussions
  switched on has exactly the same problem, so adding a bare Stop button would quietly introduce
  that data loss for visitors. It needs the truncate call too, and a decision about what a guest's
  stopped turn should do.

  **Recommendation**: do it, reusing the Workspace pattern whole rather than a simplified version.
  Swap the submit arrow for a stop square while `busy`, which is where users now expect it and what
  Workspace already does (`ChatPane.js:993`). Worth pairing with the composer cap below, since both
  are about the same input area.

- ~~Messages and Timeless still tint the shortcut chips.~~ **Done 2026-09-17 (8bd4ddf3).** Option A:
  success, warning and info now use the theme's own neutral surface, measured at 18.1:1, and danger
  keeps its tint. Carries across the decision already documented in chatgpt.scss and
  foundation.scss.

  **Original finding kept for context.** Measured, white label on the chip background:
  - success `#4CAF50` at 13px: **2.78:1**
  - warning `#FF9800` at 13px: **2.16:1**

  WCAG AA wants 4.5:1 for text that size, and 3.0:1 even for large or bold text. Both fail, and the
  orange fails badly. For comparison the untinted chips are 11.33:1 in ChatGPT and 9.3:1 in
  Foundation.

  **The decision has already been made, just not carried across.** `chatgpt.scss:166` and
  `foundation.scss:92` both say: *prompt suggestions gains nothing from being colour-coded, and
  tinting each chip only hurt legibility, so success / warning / info render as plain chips.* Those
  two themes keep a tint for `danger` only, and as a border plus text colour rather than a filled
  background, which reads fine.

  **Recommendation**: apply the same treatment to `messages.scss:92-110` and `timeless.scss:158-176`,
  so all four themes agree. That is carrying an existing documented decision rather than inventing a
  new one, which is why I think it is the right call. It is still a visible change to two shipped
  themes, so it is your yes, not mine. If you would rather keep them coloured, the smaller fix is to
  darken the two fills until they pass. Checked against white: `#2E7D32` gives 5.13 and `#8D5A00`
  gives 5.84, both clear. Note that the obvious amber `#B26500` lands on 4.42 and does **not** clear
  4.5, which is worth knowing before anyone picks a colour by eye. Either way I can do it in one
  pass with `pnpm sass`.

- ~~The chatbot composer grows without limit.~~ **Done 2026-09-17 (73c2a70c).** `max-height: 210px`
  plus `overflow-y: auto` in the shared mixin, so all four themes get it from one place. Verified on
  a 390x720 phone with 3000 characters pasted: input 210px and scrolling, conversation back to
  429px, send button visible.

  **Original finding kept for context.** This is the most serious thing the loop has found. I have a fix that works and did not
  ship it, because it changes the composer on every chatbot on every site and the cap is a number
  somebody has to choose. Measured, not guessed, in a real 1100x760 viewport with 3000 characters
  pasted in:
  - textarea height 1388px, conversation height **0**, send button **1078px below the bottom of the
    viewport**.
  - The window is `position: fixed`, so there is nothing to scroll. The button is simply gone.
  - Enter still sends, so the chat is not strictly dead, but nothing on screen says so.

  **Why it happens**: `ChatbotInput.js:59` uses `TextAreaAutosize` with no `maxRows`, and the shared
  mixin `input-textarea-base` (`themes/sass/_common.scss:81`) sets `overflow: hidden` with no
  max-height. The library caps height only if you pass `maxRows`, and it never touches `overflow`,
  so `maxRows` alone would hide the text instead of scrolling it. Both halves are needed.

  **Who is exposed**: the default `textInputMaxLength` is 512 (`constants/init.php:14`), and at 512
  the layout still holds (measured at 320px wide: input 538px, conversation 112px, send button on
  screen). So a default chatbot is safe. Exposed are the Editor Assistant, which ships
  `textInputMaxLength => 16384` (`classes/modules/editor-assistant.php:127`), and any site owner who
  raises the limit in the chatbot params. Workspace is **not** affected: it has its own plain
  textarea (`ChatPane.js:948`), no autosize.

  **Recommendation, already verified live.** Two lines in the shared mixin, so all four themes get
  it from one place, then `pnpm sass`:
  ```scss
  max-height: 210px;   // about ten rows
  overflow-y: auto;    // replaces overflow: hidden
  ```
  Injected exactly that into the live page with 3000 characters in the box: textarea capped at
  210px with a working scrollbar, input 221px instead of 1388px, **send button back on screen**.
  The number is the only real decision. 210px is roughly ten rows and matches what other chat UIs
  do. A proportional cap would adapt better to short windows (with the fix the conversation was
  still only 37px on a small desktop window), but percentages inside this flex column need testing
  that I could not finish. Pick the fixed value unless you want the proportional one, and I will
  do it.

- **External link markers are applied to about half the links, and the rule for the other half is
  not mine to pick.** Counted across `app/js`: 37 links with `target="_blank"` carry a marker,
  either the `↗` character or a `<ExternalLink />` icon, and 40 carry nothing. The 40 are not one
  problem, which is why I did not sweep them:
  - **Genuinely external and unmarked**: Unsplash, Pexels, OpenAI pricing, the OpenAI deprecations
    page, gravatar, the Finetunes tutorials, "Offbeat Japan". These look like plain oversights.
  - **Internal links that merely open in a new tab**: `VIEW` and `EDIT` on a generated post,
    `USER #id`, `#refId` on an embedding, a filename in Assistants. Marking these would be wrong,
    since the reader never leaves the site.
  - **A few my regex caught by mistake**, such as a fragment of `handleImageError` in
    `ChatbotReply.js`. The real count of oversights is smaller than 40.

  **Recommendation**: mark only the first group, and take the decision once about whether
  "external" means "off this site" or "opens a new tab", because the two rules disagree on roughly
  fifteen links. Worth noting the codebase already uses **two** markers for the same idea, the
  `↗` character and the `ExternalLink` icon, so picking one is part of the job. Half an hour, all
  of it judgement, none of it safe to do while you are asleep.

- **Is AI Forms switched off on the test site on purpose?** `module_forms` is `false`, which is why
  the whole AI Forms surface is untestable and why iteration 55's bug was visible at all. It may
  simply be Jordy's choice. But it is worth one look, because we have been here before: Workspace
  silently switched itself off for two months through the `proOptions` force-reset on unregistered
  sites. If AI Forms went off the same way rather than by hand, that is a bug, not a setting. I did
  not flip it: changing a module toggle means writing `mwai_options`, and that is exactly the write
  the memories say never to do casually.

- **Duplicated form container blocks share one DOM id.** All three containers on `/ai-forms/` carry
  `id="mwai-form-container-xs83gq9bt"`, so the id is copied rather than regenerated when the block
  is duplicated in the editor. Same family as the duplicate `mwai-chatbot-default` id below, and the
  same two consequences: invalid HTML, and anything selecting by id silently gets the first copy.
  The fix is a judgement call about block behaviour (regenerate on duplicate, which changes the
  saved markup of existing pages), so it is here rather than done.

- **The same chatbot embedded twice produces two elements with the same DOM id.** Measured on
  /sample-page/ (the block chatbot page): two nodes with `id="mwai-chatbot-default"`, at identical
  coordinates, each with its own trigger. `ChatbotUI` builds the id from
  `mwai-chatbot-${customId || botId}`, so any page embedding one chatbot twice hits it.

  Two consequences, one cosmetic and one real:
  - Invalid HTML, and any CSS or third-party script targeting that id gets whichever copy is first.
  - **`ChatbotUI.js:523` (`restoreFocusToTrigger`, added in iteration 51) uses
    `document.getElementById`**, so on such a page closing the second chatbot returns focus to the
    first one's trigger. The fix works correctly on every single-chatbot page, which is the normal
    case, but it is wrong here.

  Recommendation, in order of preference:
  1. Make `TransitionBlock` forward a ref, give `ChatbotUI` a `rootRef`, and look the trigger up
     with `rootRef.current.querySelector('.mwai-icon-container')`. I wrote exactly this, could not
     verify it (see iteration 53), and reverted rather than ship it blind. It is about six lines
     and removes the id dependency entirely.
  2. Separately, decide whether the id should be made unique per instance. That is the more
     correct answer for the HTML, but it changes a selector people may already target in custom
     CSS, so it is your call rather than mine.

  Worth doing together, since the second makes the first unnecessary.

- **Costs, the whole picture.** Jordy asked for a proper look after the Gemini finding, noting that
  costs used to be hard to calculate but providers now sometimes return them, and that the
  Workspace should show cost in the discussion. Written up in full at
  `~/Desktop/ai-engine-costs.md`. Four findings, all verified in the code and against live data:
  1. `record_tokens_usage()` takes a provider-returned price, and **only `open-router.php:182`
     ever passes one**. That engine is the reference implementation, accuracy handling included.
  2. **Cache-aware pricing is missing entirely, and the error runs both ways.** The `cached` rate
     is defined on 12 models and read by nothing, and no engine captures cached token counts.
     Checked against the provider docs afterwards, which corrected my first draft: OpenAI returns
     `cached_tokens` and `cache_write_tokens`, Anthropic returns `cache_read_input_tokens` at 0.1x
     **and** `cache_creation_input_tokens` at **1.25x**. So later turns over-report and first
     turns under-report, and `constants/models.php` has no cache-write rate to express the second
     one. The two errors partly cancel in a monthly total, which is how this has stayed invisible.
  3. Gemini records no price at all (see the separate entry above).
  4. **Per-conversation cost cannot be computed server-side**: the logs table has no chatId, only
     `session` and a provider `refId`. The Workspace's cost display is React state accumulated
     from live replies, so it shows nothing after a reload or on an older conversation.
     Recommended order: add a `chatId` column, expose a per-discussion total and show it in the
     Discussions Information panel too, then make the Workspace read that instead of counting
     locally. Doing the last step alone would just relocate a fragile number.

  Nothing implemented. This pipeline feeds statistics and spending limits, so a wrong guess
  misreports money.

- **Gemini queries record no usage accuracy, and no price at all.** Found in iteration 47 while
  fixing the tooltip that reported it wrongly. The symptom is measurable: query log rows for
  `gemini-3.8-flash` and `gemini-2.5-pro` arrive with `accuracy: "none"` and `price: null` while
  carrying a real token count (8,884 on one of them). Every Google query on this site therefore
  contributes nothing to the cost totals, and the Limits feature counts dollars.

  What I established, and where I stopped:
  - `classes/engines/google.php:1810` records tokens and then explicitly sets
    `'accuracy' => 'tokens'` and calls `set_usage_accuracy('tokens')`.
  - `classes/engines/google-interactions.php:673` records the same tokens through
    `record_tokens_usage()` and calls `set_usage($recorded)` with **no accuracy step at all**.
    Interactions is the default Google engine now, so this is the path most Gemini traffic takes.
  - `classes/services/usage-stats.php:367` already returns
    `'accuracy' => $price > 0 ? 'price' : 'estimated'`, so the value reaching the log should be
    "estimated", not "none". Something between there and `rest.php:2635` is dropping it, and I
    did not chase it further.

  I have not touched any of it. This is the usage pipeline that feeds statistics and spending
  limits, so a wrong guess there misreports money rather than a tooltip. The user-visible symptom
  is fixed already.

  Recommendation: mirror what `google.php` does in `google-interactions.php` so Gemini rows report
  a token-based accuracy, then look separately at whether Gemini pricing can be supplied at all.
  Google's models endpoint does not return prices, which is presumably why there is no
  `MWAI_GOOGLE_MODELS` constant the way there is for OpenAI, so "no price" may be the honest
  answer until someone maintains a price table by hand. Worth deciding, because right now a site
  running mostly Gemini sees a cost of zero.

- **The Heartbeat's "Run now" button can never work.** `classes/rest.php:618` deliberately refuses
  `mwai_tasks_internal_run` and `mwai_tasks_internal_dev_run` with a 403 ("they should only run
  via cron"), and that button's only job is to call one of those two hooks. It is the sole caller
  of `runCronEvent` in the component, so there is no other hook it serves.

  I have made the refusal visible rather than silent, which was the safe half. The question left
  is whether a button whose every press is an error should be there at all.

  Recommendation: drop it from the Heartbeat row. The panel is a status readout (name, schedule)
  and the runner genuinely is automatic, so there is nothing for a button to do. The alternative,
  letting the REST route run it for real, would undo a guard that looks deliberate, so I did not
  touch it. Removing a visible control is your call, not mine.

- **Dev Tools polls `cron_events` about once a second, forever.** Full diagnosis in iteration 38
  above, including the captured payloads that prove the mechanism. Measured at 48 calls per minute,
  three times, with the Heartbeat panel closed. Each one is a REST request that boots WordPress.

  Not done autonomously because the fix is a redesign of how this screen stays fresh, not a
  one-liner, and getting it wrong swaps a noisy screen for a silently stale one. Two things are
  tangled together: an effect that re-runs on cosmetic string churn, and a timeout that always
  lands on its 500ms floor because the midpoint it aims at is already past.

  Recommendation, in order:
  1. Stop the server sending churn the UI does not use. `next_run_human` and `last_run_human` are
     not rendered anywhere in the heartbeat panel; it shows `schedule` and `is_running` only. If
     they are dropped, or the UI stops receiving them, structural sharing preserves the reference
     and the loop cannot start. This is the smallest change with the widest effect, but it touches
     a REST response shape, so it is yours to approve.
  2. Give the `cronEvents` query a plain `refetchInterval` (15 to 30 seconds feels right, and React
     Query pauses it when the tab is in the background) and delete the self-scheduling midpoint
     effect entirely. The periodic refresh is what the code comment says it wants; the hand-rolled
     timeout chain is what made it pathological.
  3. Whatever is chosen, verify by counting: open Dev Tools, count `cron_events` for sixty seconds,
     and check the Heartbeat panel still reflects a run after Run now.

- **AI Engine's OAuth discovery answers for other plugins' MCP servers.** Reported through the
  Meow Apps session (Rank Math MCP + AI Engine on cinevision-solutions.com). Confirmed in the
  source, not taken on trust.

  `labs/mcp-oauth.php` hooks `parse_request` at priority 1, and
  `handle_host_root_wellknown()` matches by prefix:
  `strpos( $path, '/.well-known/oauth-protected-resource' ) === 0`, then calls `emit_json()`,
  which ends in `exit`. So any path starting with that prefix is answered with AI Engine's
  metadata and nothing else ever runs. A client asking for
  `/.well-known/oauth-protected-resource/wp-json/rank-math/mcp` is told to authenticate against
  our authorize endpoint.

  What makes it worth fixing even though the workaround is one checkbox: **the failure is
  silent**. The other plugin's OAuth does not error, it just authenticates against the wrong
  server, so the user only sees "it does not work" with nothing to go on.

  Gated on `module_mcp`, which is off by default, so it only affects people who turned MCP on.
  Landed in e6b236fc.

  Recommendation, which matches what the Meow Apps session suggested:
  1. Claim the path only when the suffix after the prefix is empty (the bare host-root shape,
     genuinely ambiguous and probably ours) or matches our own resource path. Our resource is
     `rest_url( 'mcp/v1/http' )`, so the RFC 9728 shape for us is
     `/.well-known/oauth-protected-resource/wp-json/mcp/v1/http`.
  2. When it is someone else's suffix, `return` instead of `exit`, so WordPress and the other
     plugin can answer.
  3. Log the declined path when `$this->logging` is on. Given the silent symptom, the log line is
     half the value of the fix.

  Not done autonomously on purpose: this changes which URLs we answer at a protocol level, and
  getting it wrong breaks AI Engine's own MCP OAuth for everyone with the module on, which is far
  worse than the coexistence bug it fixes. It wants a deliberate change with the MCP smoke tests
  run against it. No fix or date was promised to the customer, who has been told to switch the
  module off meanwhile.


All cleared on 2026-09-16 20:30, see "Decided by Jordy" at the top.

### Worth doing, not urgent

- ~~Lead: the chatbot can sit in `opening` without ever reaching `open`.~~ **Closed in iteration 56,
  it was my measuring instrument, not the plugin.** `ChatbotTrigger.handleOpen` puts `setOpen(true)`
  inside a `requestAnimationFrame`. The automation tab reports `document.hidden === true`, and
  Chrome does not run rAF callbacks in a hidden tab. Proved it directly: a rAF scheduled in the page
  did not fire within 1200ms while a `setTimeout` in the same page did. The chat then reached
  `open: true` the moment something forced a paint, which taking a screenshot does. A real user
  clicking a trigger is by definition looking at a visible tab, so the frame arrives immediately.
  Nothing to fix. Keep the mechanism in mind though: anything gated behind rAF is untestable from
  a hidden tab, and will look stuck.

- **Two neko-ui controls are still mouse only**, found in the sweep in iteration 45 and left alone
  because each needs a decision rather than an attribute:
  - `Table.js` `.neko-column-action`, the sort and filter caret on every table header. Sorting and
    filtering a table is currently impossible without a mouse. It is also the thing that needs a
    full pointer sequence to drive in tests, which has produced two false findings in this loop
    already. The question is whether it should become a real button inside the header cell, which
    changes the header markup, or whether the whole header should be the control.
  - `Paging.js`, the pager. Current page, next and previous are clickable spans and divs. Making
    them buttons is easy, but the component also has the "0 result" and "1/0" oddities already in
    this backlog, so it wants one pass that fixes the lot rather than three separate visits.

- `WorkspaceApp.js` still has around seven `.catch(() => {})` on background saves: preferences,
  prompt deletion, discussion truncate after a Stop, folder assignment. They are all
  fire-and-forget writes behind an optimistic local update, so a failure means the screen shows one
  thing and the server holds another until the next reload. Now that `flashNotice` is available at
  app level the plumbing exists to surface them. Worth one deliberate pass deciding which of these
  a user needs to hear about (losing a renamed folder matters, a theme preference probably does
  not) rather than mechanically wiring all seven.

- Disabled controls across the plugin cannot explain themselves, because a `title` on a disabled
  button shows no tooltip in Chrome (measured, see iteration 35). The Content Studio stepper is the
  clearest case: "Publish" is greyed until a draft exists and says nothing about why. `canGo()`
  already knows the reason for each step, so the text is free; only the delivery is the problem.
  Worth deciding once, for the whole plugin: either wrap disabled controls in a titled span, or
  switch them to `aria-disabled` with a click guard so they stay hoverable. Not worth doing one
  screen at a time.

- `Embeddings.js` still reports failures through `alert()` and asks the force-delete question
  through `confirm()` (`onDeleteEmbedding`, `onIgnorePost`, `onConfirmDelete`). Everywhere else in
  the plugin now uses an inline message. Two caveats before touching it: the `confirm()` is load
  bearing, because declining it is what cancels a forced local delete, so it needs a real two
  button modal rather than a banner; and the 'selected' branch of `onConfirmDelete` awaits
  `onDeleteEmbedding` without a catch, relying on the inner `finally` to clear busy. That works
  today but it is a thread worth pulling deliberately, not in passing.
- `Embeddings.js` has around a dozen `console.log` calls that fire during normal use ("Embedding
  Added", "Embeddings deleted.", "Remote vectors retrieved.", "Push All: N posts to sync"), plus
  two `console.error` lines that are developer notes rather than errors ("We should update the
  vectors data with the deleted embeddings."). None of them appear on a plain page load, so this
  is noise during actions rather than on arrival. Worth one deliberate sweep that decides which
  are genuinely useful for support and drops the rest.

- The Discussions export walks the table 20 rows at a time (`ExportModal.js`,
  `retrieveAllDiscussions`, `limit: 20`). The test site has 273 discussions, so exporting it is 15
  round trips; a busy site with 20,000 would be a thousand. Raising the page size would make the
  export far quicker, but it also makes each response much bigger, and these rows carry full
  message JSON, so the right number depends on how large discussions get in practice rather than
  on taste. Worth measuring a real payload before picking one. The stop condition
  (`res.chats.length < 2`) is also odd: with a page size of 20 it only ever triggers on a last
  page of 0 or 1, so most exports spend one extra request discovering an empty page.

- ~~Em dashes in code comments~~ **Done, iteration 50.** Also found and fixed the only one in user-facing copy (a partial-upload error). The three deliberate keeps are listed there.
- Four i18n strings are defined but never used anywhere: `ASSISTANTS_INTRO`, `MCP_INTRO`,
  `ALERT_CONTENTAWARE_BUT_NO_CONTENT`, `LEGACY_MODELS_INTRO`. They cost translators work for
  nothing. Worth deleting in a tidy-up pass, but check first whether a screen lost its intro text
  by accident rather than on purpose, in particular `MCP_INTRO`.
- **`word-break: break-all` is NekoTable's default and it has now been worked around three times**
  (Discussions, Insights, and the Tasks Manager) with the same `StyledCell`. It is right for the
  Files Manager, where the values are long hashes, and wrong nearly everywhere else: any table with
  a narrow column and real sentences in it will chop words in half. The remaining candidates are
  Assistants, Finetunes, Forms and Search. Worth deciding once: either flip the default in neko-ui
  and let the hash table opt back in, or apply `StyledCell` to the rest.
- The plugin now has two table looks. Discussions and Insights pass `variant="compact"`, which
  drops the header row NekoTable repeats under the rows; Knowledge, Assistants, Finetunes, Forms,
  Search, Files and Tasks keep the default and show it. Neither is wrong, but a reader notices.
  Worth picking one and applying it everywhere, in one deliberate pass.
- Two small things in neko-ui's `NekoPaging`, seen on an empty Discussions table: it reads
  "0 result" instead of "0 results" (`src/misc/Paging.js:181` has `total > 0 ? 's' : ''`, which
  should be `total !== 1`), and the page counter shows "1/0" when there is nothing to page
  through. Both are one-liners, but they live in the shared library.
- Every AI Engine admin page loads the full block editor stack (`wp-block-editor`, `wp-editor`,
  `wp-format-library`, `wp-block-library`, plus `wp_enqueue_media()`): about 40 extra scripts on
  screens that never show an editor. `classes/admin.php:399` says it is because `Forms.js` is
  always imported by `Settings.js`. Lazy-loading the forms editor behind a dynamic import would
  make every settings screen noticeably lighter. Worth measuring before touching.
- `classes/admin.php:394-395`: `$forms_module_enabled` and `$load_forms_editor` are computed and
  never used. Dead since the "always load on AI Engine pages" branch above replaced them.
- `app/js/components/DashboardCards.js:329` renders `{t.label}{t.period ? ", " + t.period : ""}`,
  which reads "AI visibility, score". The data comes from SEO Engine's `seo_stats`, so the label
  is not ours to fix from this repo.

### 60. Regression pass before pushing the three fixes (2026-09-17 17:40)

Jordy asked for a lot of testing before these went out. Roughly 75 assertions driven against the
real React UI on the live site, with `fetch` stubbed so nothing reached a provider. **It found two
real bugs, one of which I had introduced an hour earlier.**

**Bug 1, mine: a double click on Send cancelled the message it had just sent.** Making the submit
button stay enabled while busy is what lets it offer Stop, but it also means the second click of a
double click lands on a button that has already become Stop. Before the change the button was
disabled while busy, so a double click was harmless. Caught by asserting that two fast clicks
produce one request and **zero** aborts. Fixed two ways: a click only stops when the button is
actually showing Stop, and never within 600ms of a send. Re-tested with double and triple clicks.

The fix created a second problem that the tests also caught: the pointer is usually already resting
on the button when the reply starts, and no `mouseenter` fires in that case, so Stop would never
appear for the most common case of all. `onMouseMove` covers it, so the smallest movement reveals
Stop.

**Bug 2: in the Messages theme the busy spinner kept turning behind the stop square.** The theme
draws it with `.mwai-<name>-theme .mwai-input .mwai-input-submit::before { display: inline-block
!important }`. My override had `!important` too, and still lost, because **when two declarations
are both !important it is specificity that decides**, and theirs had three classes to my two.
Adding `!important` harder does nothing. Matching their depth does.

**What was checked.** Idle, typing, sending, the reply arriving, busy, hover, unhover, keyboard
focus, stopping, sending again after a stop, double and triple clicks, Enter and Shift+Enter, the
error path, and the height cap growing, capping at 210px, scrolling and shrinking back. Then the
same busy and stop behaviour across all four themes, the chips in all four (worst ratio 9.3:1,
none below 4.5), nine admin screens for fatals and console errors, and the Workspace composer to
confirm it did **not** inherit the cap (`max-height: none`). The cap only ever matches
`.mwai-input .mwai-input-text textarea`, so AI Forms fields and the Workspace are out of scope by
construction.

**Two test failures that were the harness, not the plugin**, both worth remembering:
- `element.focus()` changes `document.activeElement` but fires **no focus event** when the tab is
  hidden, which it always is here. The focus path had to be verified by dispatching `focusin`
  directly. Same family as the `requestAnimationFrame` trap from iteration 56.
- Clearing `localStorage` after the iframe has loaded is too late: the chatbot has already restored
  the saved conversation, and the shortcut chips are gone because a conversation is in progress.
  Clear it in the parent before creating the frames.

### 61. Overnight pass 1: Modules (2026-09-17 23:05)

First pass of the overnight run. Modules, measured rather than eyeballed.

**Fixed**: the showcase banner read **"What can Engine do?"**. Everywhere else in the admin the
product is "AI Engine", and this was the only place using a bare "Engine" as the name
(`FeatureShowcase.js:234`, confirmed by grepping every title/label in `app/js`). Now "What can AI
Engine do?". Verified live.

**Checked and clean**: no horizontal overflow (`scrollWidth - clientWidth` is 0), no console errors,
and the copy holds up across all 114 lines of the screen: no em dashes, no double spaces, no long
sentence left without its final punctuation.

**Two measurements that looked like findings and were not**, recorded so the next pass does not
chase them:
- Four truncated elements. All four are WordPress's own `screen-reader-text` in the admin bar,
  clipped to 1px on purpose for screen readers. Not ours, and not a defect.
- The "Enable" labels measure 12 to 26px above the centre of their checkbox container. That is
  correct: the container is 54 to 82px tall because it holds the label **and** the description
  below it, so a label sitting near the top is the intended layout. The instrument was wrong for
  this structure, not the screen.

**Also confirmed the off-centre label bug from the Playground is not systemic.** Only
`StyledWorkbench.js:177` overrides `.neko-select-option-label`; nothing else in `app/js` or
`premium/js` touches it, so no other screen inherits the 27px-box-with-an-18.2px-line problem.

### 62. Overnight pass 2: Knowledge (2026-09-17 23:20) — nothing to fix

Empty state, no environment selected. The screen behaves well and I changed nothing.

**One pending verification is now closed.** The Push All button reads **"Push All (6)"**. That was
shipped in iteration 54 on reasoning plus a build, never seen live, and listed in the handover as
unverified. It is correct now, and `undefined` appears nowhere on the screen. One item left from
that pair: the "Close tip" keyboard handler on the chatbot trigger, which needs the public chatbot.

**Measured clean**: zero mwai requests on load (nothing fetched before an environment is picked),
no horizontal overflow, no truncated text anywhere in the plugin's own markup, no console errors,
no em dashes across the 40 lines of copy.

**The empty state is doing its job.** Every action that cannot work without an environment is
genuinely disabled rather than merely styled that way: Create New, Push All, Upload PDF, add
embedding and refresh all report `disabled = true` with `cursor: not-allowed` and a reduced opacity.

**A false alarm, caught before it became a commit.** Enabled buttons measure `cursor: default`,
which looks like a missing pointer on every button in the plugin. It is not: NekoUI sets the cursor
inside `&:not([disabled]):hover` (`neko-ui/src/button/Button.js:312`), so the idle computed value is
`default` by design. Hovering a real button with the pointer and reading it again gives `pointer`.
Third time tonight that the measurement, not the plugin, was the thing at fault.

**Not touched, already in the backlog**: every disabled button here carries a `title` explaining
what it does, and Chrome shows no tooltip for a disabled control, so none of that help is
reachable. That is the plugin-wide decision already recorded under "Needs Jordy".

### 63. Overnight pass 3: the public chatbot trigger (2026-09-17 23:40) — nothing to fix

**The last unverified fix from iteration 54 is now confirmed live**, so that pair is closed.

No chatbot on the site has an `iconText`, so the tip and its close button never render, which is
why this went unverified for so long. Rather than rewrite Jordy's chatbot config overnight to
create the conditions, I mounted an extra chatbot purely client side: read the server rendered
`data-params` out of the page HTML with `fetch` and `DOMParser` (the live DOM no longer has them,
React consumes the attributes on mount), added `iconText` and a zero delay, appended a fresh
container and called `mwaiInitialize()`. Nothing on the site changed.

**Close tip, all three paths work:**

| path | result |
| --- | --- |
| `Enter` | closes the tip |
| `Space` | closes the tip |
| mouse click | still closes the tip, no regression |

Attributes are right too: `role="button"`, `tabindex="0"`, `aria-label="Close tip"`.

**The trigger's `aria-expanded` is correct as well**: `false` while closed, `true` once the window
is open, matching the `mwai-open` class.

**A reminder the hidden tab will keep handing out**: clicking the trigger left `aria-expanded` at
`false` and the chat closed, which reads exactly like the fix failing. It is the
`requestAnimationFrame` trap from iteration 56: `handleOpen` sets `open` inside a rAF and this tab
never paints on its own. One screenshot to force a frame, and both flipped to true. Anything gated
behind rAF needs a forced paint before it can be measured here.

**Running count: two passes in a row with nothing to change** (Knowledge, and this one). One more
empty pass and the loop stops early, as agreed.

### 64. Overnight pass 4: Content Studio (2026-09-18 00:05) — nothing to fix, loop stopped

**The screen is in good shape.** 35 lines of copy with no em dashes, zero truncated text, no
horizontal overflow, no console errors, and **zero mwai requests on load**. The stepper does its
job: Outline, Draft and Publish are genuinely `disabled` until the Brief is done, and "Plan the
outline" stays disabled until there is a topic.

**Jordy's request from earlier is live and reads well.** At the bottom of the Brief: "Prefer the
older screen? The classic generator is still here, with bulk generation from a list of topics."

**Found one thing worth recording, not worth doing tonight**: external link markers are on about
half the links. Written up in the backlog above with the three categories and a recommendation.

**Two more instrument errors, both caught**: `[id^=mwai-admin]` matches nothing on this screen, so
the first sweep measured an empty root and reported a flawless page made of zero lines. And the
link audit first counted 41 unmarked because it only looked for the `↗` character, missing every
link that uses the `<ExternalLink />` icon instead. Re-ran against `#wpbody-content` and against
both markers.

**Stopping the loop here.** Three passes in a row (Knowledge, the chatbot trigger, Content Studio)
found nothing that could be changed safely and obviously. That is not the same as the plugin being
finished: this pass found a real inconsistency, and the backlog has several more. What is left
needs a decision rather than a fix, and those are Jordy's.
