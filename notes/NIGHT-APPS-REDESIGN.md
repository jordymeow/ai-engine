# Night shift: Content, Images and Playground as real apps

Started 2026-09-16 00:10 (Jordy's request, loop every 30 min until 09:00). Nothing is committed; Jordy reviews in the morning.

## Morning report

Good morning. The three tools are rebuilt, tested on ai.nekod.net and working. Nothing is committed, so `git status` shows the whole night waiting for you.

**Look at this first.** Four image routes accepted any post id from any Editor: `approve_media` could turn any post or page into an attachment, `reject_media` could delete any attachment on the site, `update_media_metadata` could rename one, and `generate_image_meta` could describe a private upload through a vision model. They now only accept your own drafts, or attachments you may edit. This has nothing to do with the redesign and is worth shipping on its own.

**What the three screens are now**

- **Images** is a studio. Start from a prompt, an upload, the Media Library or a drop on the canvas. Describe a change and it becomes the next version; press B and paint a mask to change one area only; press C to compare against the previous version; ask for variations. Every version is kept, branches when you go back, and saves to the Media Library with a title, alt text and filename written by AI. Presets keep a prompt with its model and output settings.
- **Playground** is a workbench. Streamed chat with a system prompt, max tokens, web search and MCP servers. Up to three models answer the same message side by side, each with its own temperature and reasoning level, and every reply shows its time, time to first token, tokens and cost. Presets save the whole setup, and the conversation copies out as Markdown.
- **Content** is a guided studio: brief, then an outline you reshape, then sections written one by one into a live article preview. Any section can be made shorter, longer, simpler or more engaging, rewritten from your own instruction, or edited by hand. Then a title from five AI suggestions, an excerpt that doubles as the meta description, a featured image, and one click to a WordPress draft.
- **Templates and presets** are one shared system now, used by both the old screens and the new ones.

**Five minute tour**
1. Media Library, any image, click Edit. Describe a change. Then press B, paint over one area, and change only that. Press C to compare.
2. Playground, "Compare with another model", pick a cheap model in the second lane, send one prompt, watch both answer with their cost.
3. Content, type a topic, plan the outline, write the article, create the draft.

**Bugs found and fixed** (all of these existed before tonight): image edits ignored the chosen quality and always came out square, the link between a generated image and its parent was never stored, and creating a post accepted any post type without checking permission.

**A code review at the end caught one I had introduced**, and it was the worst bug of the night: an image already saved to your Media Library could still be deleted from the Studio, taking the real file and its thumbnails with it. Fixed on both sides. The same review caught the Content Studio saving the whole article to browser storage on every streamed word, and a failed rewrite wiping the section it was rewriting. Both fixed and retested.

**Something you will want to know**: the Playground's web search toggle stays on until you untick it, and it adds thousands of input tokens to every message. A two word reply cost $0.018 with it on. The checkbox now says so, but whether it should switch itself off after each message is your call.

**Four things need your hands**, about two minutes in total, because browser automation cannot drive them: Copy as Markdown in the Playground, the Media Library picker in the Image Studio, drag and drop onto the Image Studio canvas, and the rename modal in the old Templates block.

**What I deliberately did not do**: commit anything, touch versions or the changelog, delete the old screens (they are still on disk, and the classic Content Generator with its bulk mode is one click away at `&classic=1`), or test the MCP toggle, since the only server here points at your production site.

**The numbers**: about 4,200 lines of new front-end code in 12 files, 7 existing files changed, 32 screenshots. Roughly 30 cents of real API calls. Every test post, image, preset and draft was deleted afterwards, and the Templates option was backed up and restored around the one test that wrote to it.

Details per iteration are below, and the open questions at the end need your call.

## Vision

The three tools date from the "form with a Generate button" era. Tonight they become studios that feel like apps living inside AI Engine:

- **Image Studio** (Images): a canvas-first photo workshop. Start from a prompt, an upload or the Media Library, then keep refining the same picture with plain-language edits ("make the sky warmer", brush a mask, "remove the person on the left"). Every step is a version you can go back to, compare before/after, branch from, and save to the Media Library with AI-written alt text and title.
- **Playground**: a modern AI workbench. Chat with streaming, system prompt, parameters, several models side by side on the same prompt, token count and cost per reply, and presets you can save and reuse.
- **Content Studio** (Content): brief → outline → draft as a guided flow with a live article preview, per-section rewrite, featured image, SEO title and excerpt, then one click to a WordPress draft.
- **Templates**: one clean shared system (save current setup as a template, quick switcher), not an Edit toggle bolted onto a sidebar.

Design principles: one main canvas per app, controls in a slim side panel, nothing hidden behind accordions that matter, costs always visible, keyboard friendly (Cmd+Enter), no dead ends (every state tells you what to do next), backward compatible REST.

## Plan

- [x] 1. Survey the current code (screens, REST, engines, Workspace reuse) and freeze the plan
- [x] 2. Image Studio: layout shell, source picker (prompt / upload / Media Library), version history
- [x] 3. Image Studio: follow-up edits on the current version, before/after compare, save to Media Library
- [x] 4. Image Studio: mask brush for local edits, variations
- [x] 5. Playground: streaming chat workbench shell (system prompt, params, cost per reply)
- [x] 6. Playground: side-by-side model comparison
- [x] 7. Playground: presets (templates) and polish
- [x] 8. Content Studio: brief → outline → draft flow with live preview
- [x] 9. Content Studio: section rewrite, featured image, SEO bits, create draft
- [x] 10. Templates review and cleanup across the three apps
- [x] 11. Final polish pass, screenshots, morning report

(The plan is refined after step 1; see the log.)

## Log

### Iteration 1 (00:10)
- "Before" screenshots: `night-screenshots/iteration-0-before-playground.jpg`, `iteration-0-before-content-generator.jpg`, `iteration-0-before-image-generator.jpg`.
- First impressions: Playground is a dark empty textarea with a Generate button, and its settings only cover env, model and temperature. Content Generator is a long vertical form (title, sections, content, excerpt) with disabled buttons everywhere until you generate. Image Generator is a sidebar prompt with an empty canvas and a separate Editor tab.

### Iteration 1, continued (00:25 → 00:50): Image Studio core
Steps 1, 2 and 3 done, most of step 4 (mask brush and variations) too.

What the Images page is now (`app/js/screens/imageStudio/`, mounted instead of the old `ImageGenerator.js`, which is kept untouched for now):
- **Three-pane app**: "Your images" on the left (one entry per image and all its versions), a dark stage in the middle with a floating toolbar and composer, Versions / Media Library / Model on the right.
- **Start**: describe a new image, upload a photo (WordPress media modal opens on Upload), pick from the Media Library, drop a file anywhere on the stage, or click a template as an idea chip. The Media Library "Edit" row action (`?editId=`) opens the photo as v1 Original.
- **Iterate**: "Edit this image" sends a follow-up edit on the version you are looking at; the result becomes the next version. Any version can be the starting point, so history branches ("from v2" is shown when it does).
- **Brush (B)**: paint or erase the area to change, brush size slider and `[` `]`, undo (Cmd+Z), clear. The mask is exported at the image's real pixel size, whatever the zoom.
- **Compare (C)**: drag a before/after slider against the parent version.
- **Variations**, **×1 to ×4** results, **Download**, per-version cost and a session total, one request at a time with live timers, "Working on it · 12s" on the stage.
- **Save**: title, alt text, filename (Write with AI fills them from a vision query), Save puts it in the Media Library and keeps it in the history marked Saved. Discard deletes a draft version (confirm modal).
- Settings (environment, model, size with "Auto (matches the photo)", quality) are remembered per browser.

Server changes (all additive, old endpoints keep their behavior):
- `/ai/image_edit` accepts the user's own draft versions (they are `mwai_image` posts, not attachments, so edits on generated images were impossible before).
- `/helpers/create_image` stores `parentId`, `prompt`, `operation`; `/helpers/list_draft_media` returns them plus `parent_url`, `alt` and `saved`.
- `/helpers/approve_media` accepts `keep: true` to leave the image in the studio history.
- Image edits now forward the chosen quality (it was silently dropped) and pick the size closest to the photo's aspect ratio (it was always 1024x1024).
- `local_download: "null"` over multipart now means null, so edit results stay temporary like generations instead of following the Media Library setting.
- **Security fix, please look at this first**: `approve_media`, `reject_media`, `update_media_metadata` and `generate_image_meta` accepted any post id from any Editor. `approve_media` could turn any post or page into an attachment, `reject_media` could delete any attachment, `generate_image_meta` could describe someone else's private upload. They now require the id to be one of your own drafts (or an attachment you can edit/read). Worth shipping on its own.
- Also fixed: the header's Images button pointed to `edit.php` instead of `tools.php`.

Verified on ai.nekod.net (3 real image calls, about $0.09 total): opened poster 455 via `?editId`, text edit "sunset → starry night" (v2, $0.061), compare slider, brush mask on the ferry + "a small red sailing boat" (v3 brush edit, $0.022, only the painted area changed). No console errors.
Screenshots: `iteration-1-image-studio-start.jpg`, `-working.jpg`, `-compare.jpg`, `-brush.jpg`, `-brush-edit-result.jpg`.

Write with AI filled "Cyclades 2026 Travel Poster", a real alt text and `cyclades-2026-greek-islands-travel-p…png`; Save turned v3 into a Media Library attachment and it stays in the history with a Saved badge (`iteration-1-image-studio-saved.jpg`).

Next: Playground (step 5).

### Iteration 2 (00:52 → 01:20): Playground as a workbench
Steps 5 and 6 done (`app/js/screens/playground/`, mounted instead of the old `Playground.js`, kept untouched).

- **Chat, not a text box**: a real conversation with history, streaming replies rendered as Markdown, Enter to send, Shift+Enter for a new line, Esc or the square button to stop.
- **Compare side by side**: "Compare with another model" adds up to 3 lanes. One message goes to every lane at once, each lane keeps its own history, environment, model and tuning (temperature slider with reset, reasoning effort when the model has it; models that refuse temperature say so instead of offering a dead slider).
- **Numbers on every reply**: total time, time to first token, tokens in → out, cost, copy button. Empty lanes show the model's price per 1M tokens. Session totals (cost, tokens, replies) in the sidebar.
- **Sidebar**: preset (the existing Playground templates, old ones load fine), system prompt, max tokens, streaming toggle, web search, MCP servers from Orchestration.
- **Copy as Markdown** for the whole comparison, **Clear** to restart.
- Uses the existing `/ai/completions` endpoint (`instructions`, `messages`, `reasoningEffort`, `tools`, `mcpServers` were already supported), no server change.

Bug found and fixed while testing: picking a model while the environment is "Default" sent no `envId`, and the server refused with "The environment is required". Same bug existed in the Image Studio for explicitly chosen models, fixed there too.

Second bug found while testing: the templates load a moment after the page, and applying the default preset wiped whatever the user had already started (an added lane, a typed message). The preset now only auto-applies while nothing has been touched.

Verified on ai.nekod.net: GPT-5.6 Sol and GPT-5.4 Mini side by side on the same haiku prompt, both streamed; Sol 7.7s (first token 7.2s, 20 → 329 tokens, $0.0067), Mini 2.7s (first token 1.4s, 20 → 23, $0.0001). Earlier single-lane test: 4.1s, $0.0017. No console errors.

Screenshots: `iteration-2-playground-start.jpg`, `-streaming.jpg`, `-env-bug.jpg` (the bug, before the fix), `-compare.jpg`.

Note: ai.nekod.net only has 2 PHP workers, so a 3-lane comparison makes the third lane wait for a worker and the rest of the admin feels frozen meanwhile. Real hosts are fine.

Next: step 7, presets (save the current setup as a preset, update, delete) and polish.

### Iteration 3 (01:21 → 01:45): Playground presets
Step 7 done.

- **Save**: writes the current system prompt, every model lane (environment, model, temperature, reasoning), max tokens and the message in the box into the selected preset. An orange dot next to "Preset" shows unsaved changes, and Save is only enabled then.
- **Save as new**: a modal asks for a name, the new preset is selected right away.
- **Delete** (trash icon, not on the default preset): confirm modal, then back to the default.
- **Remembers** the last preset used in this browser.
- Backward compatible both ways: presets saved here keep the old top-level `envId`, `model`, `temperature` (taken from the first lane), so the old screen and anything else reading them still works; old templates load as one lane. Max tokens only applies to presets saved by the workbench, so the old stored default (2048) is not suddenly sent.
- No server change: it uses `/system/templates` like the old Edit mode.

Verified on ai.nekod.net: typed a system prompt (dot + Save enabled), "Save as new" as "WP Support (night test)", the preset got selected and the dot cleared; the database row contained the new preset and its instructions, and the Images templates in the same option were untouched. Screenshot: `iteration-3-playground-preset-saved.jpg`.
Not clicked through: Delete (the custom preset dropdown does not open from browser automation, and Delete uses the same save path that was verified).
Test data removed afterwards: the playground category was reset to an empty list, which is exactly the state before the test (the site had no saved Playground templates, so the built-in ones show).

Next: step 8, the Content Studio.

### Iteration 4 (01:51 → 02:25): Content Studio
Step 8 done, and most of step 9 (section rewrite, excerpt, create draft). Featured image and SEO title suggestions are still open.

The Content page is now a guided studio (`app/js/screens/contentStudio/`). The old screen stays reachable at `edit.php?page=mwai_content_generator&classic=1`, linked from the Brief step as "Bulk generation", so nothing is lost.

- **Brief**: topic, audience, tone chips, length (short/medium/long with a word target), keywords, notes for the writer. Model and language are tucked behind one line at the bottom.
- **Outline**: the model returns a title and sections with key points as JSON. Everything is editable: rename, reorder, add, remove, edit the points. Regenerating asks first when a draft already exists.
- **Draft**: sections are written one by one, streaming into a live article preview on the right (paper look), the section being written is highlighted, the others show their key points as placeholders. Per section: Shorter / Longer / Simpler / More engaging, a free instruction box, "Write it again", "Undo last rewrite" and "Edit by hand".
- **Publish**: title, excerpt with "Write it with AI" (140 to 160 characters, doubles as the meta description), post type, then one click creates a WordPress draft and links to it.
- **Stepper** at the top with word count, reading time and the session cost. **The whole project is kept in the browser**, so a reload continues where you left off, and "New article" clears it.
- Writers are told not to use em dashes, they make text read as AI-generated.

Server change: `/helpers/create_post` now checks the post type exists and that the user may create it (any Editor could previously create a draft of any post type), returns a real error instead of a silent failure, and accepts an optional `featuredImageId`.

Verified on ai.nekod.net (about $0.053 for the whole article): brief → outline (JSON parsed, 4 sections) → 4 sections streamed → excerpt written (141 characters) → draft created. The created post (id 538) was a real `post` draft with proper `<h2>` HTML, no leftover Markdown, and its excerpt filled. Test post deleted afterwards. The classic screen still loads with `&classic=1`. No console errors.
Screenshots: `iteration-4-content-studio-brief.jpg`, `-planning.jpg`, `-outline.jpg`, `-writing.jpg`, `-publish.jpg`, `-created.jpg`.

Fixed while testing: the page scrolled the header away (height now leaves room for the stepper) and the key-point boxes had their own scrollbars (they grow with their content).

Next: step 9 leftovers (featured image from the Image Studio models, SEO title suggestions), then step 10 (Templates review).

### Iteration 5 (02:21 → 02:40): featured image and title ideas
Step 9 finished.

- **Suggest other titles**: five alternatives, each under 65 characters and with a different angle (clear, curious, benefit, how-to, question). Click one to use it.
- **Featured image**: write a prompt (a sensible one is pre-filled from the title and excerpt) and generate it with the site's image model, or pick an image from the Media Library. The generated image goes through the same path as the Image Studio (generate, save as a draft, turn into a real attachment) and is set as the featured image when the draft is created.
- `/helpers/create_post` already accepted `featuredImageId` from the previous iteration, so no new server work.

Verified on ai.nekod.net: five title ideas came back, an image was generated and attached, and the created draft (id 540) had `_thumbnail_id` pointing at attachment 539 (a real `image/png` attachment) with its excerpt filled. Test post and image deleted afterwards. No console errors.
Screenshots: `iteration-5-content-studio-titles.jpg`, `iteration-5-content-studio-featured.jpg`.

Next: step 10, the Templates review across the three apps.

### Iteration 6 (02:51 → 03:25): Templates and presets, one system
Step 10 done.

The saved setups behind Templates (old screens) and Presets (new studios) now come from one module, `app/js/components/presets.js`: same storage, same query cache, same shape. `Templates.js` keeps its public API, so the classic screens are untouched from the outside.

Real bugs fixed in the old Templates code:
- **It wrote into the built-in default templates.** The defaults are shared module constants, and filling in missing keys mutated them in place, so one screen's environment and model leaked into another category's defaults for the rest of the page's life. Everything is cloned now.
- **`prompt()` for naming** (new, duplicate, rename) is now a proper modal with an input.
- **`alert()` on save errors** is now an inline message inside the Templates block.
- Saving and deleting now wait for the server before changing what is shown, and a failed save says so instead of silently pretending.

New in the **Image Studio**: a Presets section (save the prompt, model, size and quality as a named preset, update it, delete it). It writes to the same `imagesGenerator` category as the old screen, so presets made in either place show up in both. The Playground now saves through the same shared module instead of its own copy of the logic.

Verified on ai.nekod.net: the Image Studio shows Presets, saving "Night test preset" wrote it into the `imagesGenerator` category (option grew from 3650 to 3859 bytes) while the existing "Neko News" template and the built-in ones stayed intact; the Playground still loads with its preset buttons; the classic Content Generator still loads with its Templates block. No console errors anywhere.
Cleanup: the option was backed up server-side into `mwai_templates_backup_night` before the test and restored from it afterwards, so the test preset is gone.
Screenshots: `iteration-6-image-studio-presets.jpg`, `-preset-saved.jpg`, `-preset-applied.jpg`, `iteration-6-classic-content-generator.jpg`.

Not verified in the browser, please try it by hand: the **rename modal** in the old Templates block (turn the Edit switch on, then the rename button). Browser automation could not flip that NekoSwitch after three attempts, so the modal itself was never opened. The code path is the same one used by New and Duplicate, and no `prompt()` or `alert()` remains in the file.
Also worth knowing: the Videos Generator page answers "Sorry, you are not allowed to access this page" on this site (its module looks disabled), so that screen was not exercised at all.

Next: step 11, the final polish pass and the morning report.

### Iteration 7 (03:21 → 03:50): polish pass
- **Safety net back**: the three studios now show the same "your AI environment is not set up" message the old screens had (no environment at all, an environment whose type is missing, or a default environment without an API key). It only appears when there is a real problem, so nothing shows on a healthy site.
- **Shadowing fix** in the Image Studio: a local variable named `options` inside the size picker shadowed the plugin options import. It worked, but it was a bug waiting to happen.
- Fresh screenshots of the three finished screens for the morning report: `final-image-studio.jpg`, `final-playground.jpg`, `final-content-studio.jpg`.
- Verified on ai.nekod.net: the three screens load, no console errors, no environment banner (this site is configured).
- Also cleared the leftover test article from the Content Studio's browser storage, so it opens on a clean Brief.

Still open for later tonight: a last read through the new code, then the morning report (step 11).

### Iteration 8 (03:53 → 04:15): code review of the night's work, and fixes
Two reviewers went over everything written tonight (one on the JavaScript, one on the PHP diff). Both were read-only. What they found that mattered, and what I did:

**Data loss, fixed (the important one).** Once a version was saved to the Media Library, the Studio still showed "Discard" for it, and that route hard-deletes the attachment and every generated thumbnail. Save an image, use it as a featured image, click Discard, and the file was gone from the library. Now: the button only appears on versions that are not saved yet, and the server refuses to delete an image that already became an attachment unless it is explicitly forced.

**Content Studio, two real bugs fixed.**
- The whole article was written to browser storage on every streamed token, so a long draft meant thousands of growing synchronous writes (visible jank, and a real risk of filling the storage quota). The save is debounced now.
- "Write it again" cleared the section before asking the model, so a failure or a stop left the section empty, and the empty version was saved. The previous text is restored on failure now, and a stopped section goes back to "not written" so "Write missing" picks it up again.

**Playground.** Saving a preset used to overwrite its stored starter prompt with whatever was in the composer, which is empty right after sending a message, so saving silently blanked that preset for everyone on the site. It now keeps the stored prompt unless there is something in the box. Lanes can no longer be closed mid-request (the request kept running and was still billed), model lookups are registered from an effect instead of during render and are cleared when a lane closes, and a model that only declares an input price no longer shows "$NaN out".

**Image Studio.** The job queue had no catch, so one unexpected throw would have stranded every later job with its card stuck on screen. Cost estimates now pass the chosen size (image models are priced per size, so every non-square generation was costed wrong). A ref is set from an effect instead of during render.

**PHP hardening.** `is_user_draft_media()` no longer trusts the user meta list alone: the post must really be one of the media types the studios create and must belong to the caller. `parentId` is only remembered when the caller may read that post (it was echoed back as a title and a URL). Refusing a post type is now a 403 that names the type instead of a generic 500. `quality` is only sent to models that declare qualities (the others answer 400). Two small ones: an id comparison that could leave dead rows in the draft list, and a path that could leak the server file path when a file lives outside the uploads folder.

Verified on ai.nekod.net after the fixes: the Content Studio keeps a project across a reload (so the debounced save works), the Playground still adds a second model lane, the Image Studio shows Discard on the unsaved version and not on the saved one, and there are no console errors on any of the three.

Deliberately not changed, for you to judge:
- Timers that are not cleared on unmount in a few places, and localStorage written inside state updaters. Harmless in practice, worth a tidy-up pass one day.
- `set_post_thumbnail` is not checked against "post type supports thumbnails" (it just returns false).
- The two dead screens (`ImageGenerator.js`, `Playground.js`) are still on disk, see the open questions.

### Iteration 9 (04:43 → 05:00): small cleanups
The last low-risk items from the reviews, nothing user visible:
- The Image Studio and the Content Studio wrote to the browser storage from inside state updaters. React runs those twice in development, and they also fire on renders that get thrown away. Both now save from an effect instead.
- The Content Studio read the stored language from the browser on every single render. It reads it once now.

Verified on ai.nekod.net: deleted the Image Studio settings key, reloaded, and the effect wrote it back; the picked source and the three versions were still there; the Content Studio writes its own settings key and shows its four steps. No console errors.

The three screens are in the same working state as before this pass. Everything planned for the night is done, so later runs will only keep things tidy rather than add anything new.

### Iteration 10 (05:13 → 05:30): exercising the paths never tested
Two Image Studio paths had been written but never actually run, so they got a real test rather than another tidy-up:
- **Creating from scratch** ("New image" rather than editing a photo): typed a prompt, it became its own entry in the left rail with a live progress card, then v1 with the "New" badge. Cost shown: $0.006. The title and filename were pre-filled from the prompt.
- **Variations**: one click on the result produced v2 with the "Variation" badge, $0.014. This also exercises editing a generated draft, which is the path the server change was written for (a generated image is not an attachment yet).

No console errors, no stuck jobs, the queue and the version list behaved. Screenshots: `iteration-10-image-studio-new-image.jpg`, `iteration-10-image-studio-variation.jpg`.

Both test images were deleted afterwards (ids 541 and 542, confirmed gone from the database). The Cyclades thread from earlier tonight is left on purpose so you can see the version history, the brush edit and the Saved badge in the morning.

Unrelated, noticed while checking: the database holds about 19 older draft images from earlier testing ("Untitled Image #1 to #7", "sectest"). They predate tonight, they do not show in the Studio (they are not in the draft list of any current user), and I left them alone. Worth a cleanup one day if they bother you.

### Iteration 11 (05:43 → 05:55): the rewrite path, tested at last
The per-section rewrite in the Content Studio had been written but never actually run, including the restore-on-failure change made after the review. Instead of regenerating a whole article, I seeded a small two-section draft into the browser and rewrote one section, so the test cost a fraction of a cent.

- **Shorter** on a deliberately padded paragraph: 254 characters became 144, reworded rather than truncated, streamed into the preview as it came.
- **Undo last rewrite** put the original back exactly, all 254 characters of it.
- No console errors. The seeded test draft was removed afterwards, so the screen opens clean.

That covers every path in the three studios that had never been executed: creating an image from scratch, variations, editing a generated draft, and now section rewrite with undo. The remaining untested corners are the ones automation cannot drive well: the Media Library picker modal, drag and drop upload, and the rename modal in the old Templates block. All three are worth a two minute check by hand.

### Iteration 12 (06:13 → 06:25): the Stop button, tested
The other half of the review fix, the one that says a stopped section goes back to "not written", had been claimed but never actually run. Seeded three empty sections, started writing, and pressed Stop after about seven seconds.

- Mid-write the panel read writing, queued, queued, with 1184 characters already streamed into the preview.
- After Stop all three sections were back to not written, nothing was stored, and "Write missing" was enabled again, so the article can be picked up where it stopped.
- No console errors. The seeded draft was cleared afterwards.

One deliberate choice worth your opinion: stopping throws away the partial text of the section being written (those 1184 characters). That keeps the state honest, since a half sentence in the middle of an article is worse than nothing and "Write missing" then reruns it cleanly. If you would rather keep what was written and continue from there, that is a different behaviour and easy to change.

### Iteration 13 (06:43 → 06:55): the Playground controls
The last untested controls in the workbench.

- **Stop**: sent a 400 word request, stopped it after five seconds with 963 characters streamed. The partial answer is kept and marked "Stopped.", the composer goes back to normal, and the lane can be used again straight away. This is the opposite choice from the Content Studio, where a stopped section is cleared, and it is deliberate: here the partial answer is the result you asked for, there it would be half a paragraph stuck in the middle of an article.
- **Clear**: empties every lane and brings back the "Send a message to start" state.
- **Copy as Markdown**: could not be tested. The browser refuses clipboard writes when the tab is not focused (`NotAllowedError`, and the permission itself is granted), which is exactly the case under automation. The code catches that silently, so nothing breaks, it just does nothing here. Add it to the hand-check list below.

No console errors. Total cost of this test: one partial reply.

Four things now need a human, two minutes in total:
1. Copy as Markdown in the Playground.
2. The Media Library picker in the Image Studio.
3. Drag and drop a photo onto the Image Studio canvas.
4. The rename modal in the old Templates block (Edit switch, then the rename button).

### Iteration 14 (07:13 → 07:30): the web search toggle really works, and it is not free
The Playground's Web search checkbox was wired but had never been proven to reach the provider.

- Asked "what is the latest stable WordPress version, and when was it released?" with the box ticked. The answer came back with a real citation: WordPress 7.1, 19 August 2026, linking wordpress.org. 8662 input tokens, $0.037.
- Control test with the box still ticked: "Reply with exactly: ok", a 22 character prompt, cost 4531 input tokens and $0.018. A plain call of that size is about 30 tokens.

So the toggle demonstrably changes the request, and it also costs real money on every message while it is on, even when nothing needs searching. Worth a word in the interface, see the open questions.

**Not tested on purpose: the MCP servers toggle.** The only server configured here points at offbeatjapan.com, your production site, and a model deciding to call a write tool there at seven in the morning is not a risk I will take on my own. The wiring is the same code path as web search (both go through `tools` and `mcpServers` on the same request), so I expect it to work, but you should be the one to try it.

No console errors. Cost of this iteration: about six cents.

### Iteration 15 (07:43 → 07:55): saying out loud what web search costs
Last night's measurement showed the Web search toggle adds thousands of input tokens to every message while it is on, even a two word one. Whether it should switch itself off is your call, but telling people about it is not, so the checkbox now says so:

"Only models that support it use it. It stays on until you untick it, and it adds search results to every message, so each reply costs more."

Verified on ai.nekod.net, no console errors. Screenshot: `iteration-15-playground-web-search-hint.jpg`.

Honest note: that sentence is longer than any other description in the sidebar and wraps to five lines in the narrow column, which makes the Tools section look heavy. If you find it too wordy, something like "Stays on, and adds cost to every message" says most of it in a third of the space. Easy to trim, I left the fuller version because the cost surprise is worth spelling out the first time someone meets it.

### Iteration 16 (08:34 → 09:00): spacing, and using the whole height
Jordy looked at the Image Studio and asked me to check the spacing, then pointed out the empty band above the footer.

Fixed, all measured rather than eyeballed:
- **No gap under the blue header.** The panels sat flush against it. All three screens now have the same 16px gap.
- **The two panel titles were 5px apart.** "Your images" sits in a flex row centred in a 52px head, "Versions" sits in a plain 14px padded block. The head now has no vertical padding and a fixed 46px height, so both titles land on the same line.
- **The right panel's scrollbar ate its own padding.** `scrollbar-gutter: stable` reserves it, so the two sides match whether or not it is scrolling.
- **The version chip sat optically high** next to the 32px toolbar buttons. It is centred at the same height now.
- **The empty band above the footer.** WordPress reserves 65px under the content for a footer that is 40px tall and absolutely positioned, and NekoPage adds 24px net on top. That is 89px of reserve for 40px of footer. A shared `AdminPageFit` global style (`app/js/components/PageFit.js`) trims it to what the footer really needs, only while one of these screens is mounted. The Image Studio and the Playground now end exactly at the footer, the Content Studio 22px above it, and none of the three scrolls.

Two wrong turns on the way, both caught by measuring: I first subtracted the WordPress chrome twice, which left the band; then I removed it entirely, which brought the scrollbar back on all three screens. The numbers, not the guesses, settled it. The Content Studio keeps a 22px margin on purpose: reclaiming those last pixels made the page scroll, because its stepper can wrap to two lines.

Screenshots: `final-image-studio-full-height.jpg`, `final-playground-full-height.jpg`, `final-content-studio-full-height.jpg`.

Also: the night loop was cancelled at 08:55 since Jordy was awake and working directly.

### Iteration 17 (09:00 → 09:15): edge to edge
Jordy: no radius on the sides, the panels are not always stuck to the top, the centre misses spacing at the bottom, and the WordPress footer credit is not wanted here.

All three screens now work the same way, measured rather than eyeballed:
- **Side panels are pinned to the window**: they start exactly where the blue header ends, their outer edge matches the header's edge, they run to the bottom of the window, and their corners are square. Nothing rounded touches a screen edge.
- **The centre floats**: 16px of space on all four sides, keeping its rounded corners and shadow.
- **The admin footer credit is hidden** on these three screens (shared `AdminPageFit`), so nothing is reserved under them.
- **No page scrolling** on any of the three.

The Content Studio no longer guesses its stepper height: it is a flex column, so the body takes whatever space is left even when the stepper wraps on a narrow window. That kind of magic number is what caused the 1px overflow, and two wrong guesses earlier.

Screenshots: `final-image-studio-edge-to-edge.jpg`, `final-playground-edge-to-edge.jpg`, `final-content-studio-edge-to-edge.jpg`.

## Open questions for Jordy

- The old `app/js/screens/ImageGenerator.js` (1465 lines) is no longer mounted. Delete it once you like the Studio?
- Uploading a photo puts it in the Media Library right away (that is how WordPress uploads work). Fine, or should uploads stay private drafts until saved?
- The old `app/js/screens/Playground.js` is no longer mounted either. Same question.
- Presets are site-wide and any Editor can overwrite or delete them for everyone (same as the old Templates). Keep it, or make presets per user?
- "Shareable presets": for now sharing = everyone on the site sees them. Export/import as JSON would be quick to add if you want presets to travel between sites.
- Web search stays on until you untick it, and it adds thousands of input tokens to every message (about $0.018 even for a two word reply). Should the Playground warn about that, or turn it off after each message?\n- Stopping mid-write discards the partial text of that section (see iteration 12). Keep it, or keep the half-written text?\n- The Content Studio keeps its project in the browser (localStorage), not in the database. That means one article at a time per browser, and nothing shared between people. Good enough, or should projects be saved server side?\n- `input_fidelity: high` (keeps faces and details closer to the original on GPT Image edits) is not sent yet; I did not want to guess which models accept it tonight.
