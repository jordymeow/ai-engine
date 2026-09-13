# Dashboard + Modules tabs redesign (exploration, 2026-09-12 evening)

Jordy's brief: the Dashboard and Modules tabs repeat each other (which modules are on), overwhelm a
new user, and are not sexy; Usage could look much nicer. Make them impressive, appeasing, surprising.
Rules for this pass: one improvement per 45-minute iteration, build, verify in Chrome, log here.
NOTHING is committed. Jordy reviews tomorrow morning; anything he dislikes is a `git checkout` away.

Before screenshots: `notes/dashboard-redesign-before-1.jpg` (Dashboard, assistant dismissed) and
`notes/dashboard-redesign-before-2.jpg` (Active Modules grid + Usage tiles).

## Diagnosis (iteration 1)

- Dashboard, assistant dismissed: a tall Environments list (six rows), then a 14-card "Active
  Modules" grid, then Usage on the right. The modules grid is the Modules tab again, minus the
  switches. Three blocks compete; nothing is the hero.
- Dashboard, assistant shown: the assistant dominates, and the right column stacks Usage +
  Environments + modules again.
- Modules tab: a three-card marketing showcase, a "Pick the features" notice, then six blocks each
  with an intro paragraph and a list of switches. Roughly 500 words before the first switch on a
  fresh install.
- Usage: solid data, generic look: value label on every bar, dotted grid, five stat tiles in the
  SaaS-card style, a small donut.

## Direction

Spend the boldness in one place: the Dashboard opens with a calm **Pulse** band that says in one
plain sentence what the site's AI did this week, with a 14-day activity ribbon under it. Everything
else steps back: providers become one compact row of marks with a health dot; the module grid
becomes a single line of "on" chips with a Manage link; Usage keeps its numbers but loses the
clutter. The Modules tab keeps the showcase (it is the free acquisition channel to the product
sites, 3.7.3) but slimmer, and every block intro shrinks to one line.

Tokens (kept inside NekoUI's world, no new fonts): base #2a303c on white, quiet gray #6b7280,
the plugin blue #0d7df2 for the single accent, provider brand colours only inside the ribbon and
the donut, one radius (10px) for surfaces, 6px for chips. No gradients as decoration, no all-caps
labels, no numbered markers.

## Plan (13 iterations)

1. Diagnosis, plan, `useUsageSummary` hook, Pulse band on the Dashboard.
2. Environments list to a compact provider row with a health dot.
3. Active Modules grid to a one-line "on" chip strip.
4. Usage chart declutter (labels, grid, bars).
5. Usage tiles to one facts line, nicer donut.
6. Modules tab: slimmer showcase.
7. Modules tab: block intros to one line, drop the notice box.
8. One orchestrated reveal for the Pulse ribbon (reduced motion respected).
9. Contrast, focus rings, dark-scheme check.
10. Empty states for a fresh site.
11. Narrow widths.
12. Polish, after-screenshots.
13. Final review and summary for Jordy.

## Log

### Iteration 1 (started 20:40): the Pulse band
- New `app/js/helpers/useUsageSummary.js`: a small always-daily summary hook (14-day series with
  provider split, this week vs last week, price/queries/tokens) so surfaces other than UsageWidget
  can speak about usage without re-deriving prices.
- New `app/js/components/DashboardPulse.js`, mounted above the Dashboard columns in Settings.js.
  One sentence ("This week your site ran 239 AI queries on OpenAI, Anthropic and Google, for
  $5.43."), a 14-day ribbon of provider-coloured bars, three quiet facts with week-over-week
  deltas. Empty and no-provider states have their own sentences.
- Screenshot: `notes/dashboard-redesign-it1-pulse.jpg`.
- Self-critique: it does give the tab a first thing to read, and the ribbon is the first place the
  provider colours mean something. Two things to fix later: the tokens fact repeats the Usage
  headline right below it (iteration 4/5 will make Usage lean on the Pulse instead), and the empty
  day tracks read as boxes; lightened them a touch for the next build.

### Iteration 2 (00:10): providers as one row
- `EnvironmentsPanel` gained a `compact` prop: the six full-width rows become wrapping chips
  (logo mark, provider name, the default star, a "no API key" badge when relevant, click goes to
  Settings → AI as before). The Dashboard passes `compact`; the Settings screen keeps the rows.
- The block went from ~430px tall to ~110px, and the deprecation notice for the Fast model is now
  the first thing under the chips instead of being pushed below the fold.
- Screenshot: `notes/dashboard-redesign-it2-providers.jpg`.
- Self-critique: the chips read well and the star still says which one is default. The orange
  warning box is now the loudest thing in the column; fine, it is the one actionable item. Next
  target is the Active Modules grid below it, which is the duplication Jordy named.

### Iteration 3 (00:56): "What's on" instead of the Active Modules grid
- `ModulesOverview` no longer renders 14 cards of 104px each. It is now a block titled "What's
  on" with one wrapping line of chips (icon, name, PRO badge where relevant) and a "Manage
  modules" link at the end of the line. Chips still deep-link to their tab, or to Modules.
- Dropped the "14 modules active. Click any card…" instruction paragraph: the chips explain
  themselves, and the count was noise.
- With iterations 2 and 3 together, the whole left column (providers, the one warning, what's
  on) now fits in one screen next to Usage. Before, it needed two and a half screens.
- Screenshot: `notes/dashboard-redesign-it3-whats-on.jpg`.
- Self-critique: this removes the duplication Jordy named without hiding anything. The
  Dashboard now says "here is what runs", the Modules tab is where you change it. Next: Usage.

### Iteration 4 (01:45): a quieter Usage chart
- `UsageWidget`: the chart lost its framed grey box and sits on the white surface; five dashed
  gridlines became three solid hairlines (baseline, half, top) with only two axis labels; the
  value label now appears on the peak bar only, every bar carries a tooltip with the total and
  the per-provider split; bars are a little wider with softer corners; zero days are a faint stub
  instead of a stub plus a "0".
- Screenshot: `notes/dashboard-redesign-it4-usage-chart.png`.
- Self-critique: seven labels and a dotted grid were the "spreadsheet" feeling Jordy meant.
  With one label the eye goes to the shape first. The headline (632,959 tokens this week) is now
  the same fact the Pulse shows three centimetres above; iteration 5 resolves that by making the
  Usage block about the breakdown (per day, per provider, per query) rather than the total.

### Iteration 5 (02:35): Usage facts on one line
- `UsageWidget`: the four grey stat tiles (peak, average, per query, discussions) are now one
  facts line under the chart, numbers with their meaning in plain words ("586,999 peak, Sat
  Sep 12", "90,423 tokens a day", "$0.03 per query", "85 discussions this week, 242 in all").
  The provider tile became a small donut with its legend on one line, separated by a hairline.
  The headline number dropped from 38px to 30px and the "Avg" pill moved into the facts line.
- Result: the whole Dashboard, Pulse included, is now one screen at 1456×825. Before this pass
  it was two and a half.
- Screenshot: `notes/dashboard-redesign-it5-usage-facts.jpg`.
- Self-critique: the tab finally has one hierarchy: Pulse says what happened, the two columns
  say what runs and how it breaks down. The remaining repetition (tokens total in both the
  Pulse and the Usage headline) is now small and arguably useful, since Usage lets you switch the
  metric; leaving it. Also tweaked: a provider under 1% shows "<1%" instead of "0%" (next build).

### Iteration 6 (03:30): Modules tab, the showcase in one row
- `FeatureShowcase`: the three gradient "ways" cards lost their paragraph and "Learn more ↗"
  line (the text lives in the tooltip, the whole card is the link), the intro sentence is
  gone, and the grid of fourteen mini module tiles under them is gone: it was a third listing
  of the modules on a tab whose whole job is listing modules with their switches. Footer links
  (tour, compare, docs) stay: they are the free channel to the product sites. The unused mini
  catalog, tints and url helpers were removed from the file (39 lines).
- Chrome's window was hidden (display asleep) so no screenshot this round; the DOM check
  confirms the new structure. Screenshot to be taken when the window is visible again.
- Self-critique: the showcase keeps its one bold element (the three gradient cards) and stops
  competing with the switches below it. Next: the "Pick the features" notice box and the six
  block intros.

### Iteration 7 (04:55): Modules tab, fewer words before the first switch
- Settings.js, Modules tab: the bordered "Pick the features you want to use…" notice box is
  now one quiet line on the blue ("Switch on what you need. Off hides the tab, nothing is
  deleted."). The six block intros went from two or three sentences to one short line each
  ("Chatbots for your visitors, grounded in your own content." / "Let Claude, ChatGPT and
  other agents work on this site, and let your chatbots use outside tools." / …). Roughly 180
  words removed from the tab; the switches start about 300px higher.
- Still no screenshot: the Chrome window reports zero width (display asleep). Build verified,
  bundle contains the new copy.
- Self-critique: the MCP block used to carry the best explanation on the page (server vs
  orchestration vs public API); it now sits in the switch descriptions, which is where someone
  hovering a switch actually reads it. If it feels too thin tomorrow, that one line can grow back.

### Iteration 8 (06:00): the one reveal
- `DashboardPulse`: the fourteen ribbon bars grow from the baseline on load, 28ms apart, a
  550ms ease-out each, starting 120ms after mount. That is the only motion on the tab and it
  happens once. `prefers-reduced-motion: reduce` turns it off.
- No other entrance effects were added anywhere (no fade-and-slide on cards, no hover lifts):
  one orchestrated moment reads as designed, scattered ones read as generated.

### Iteration 9 (06:55): what the eye and the screen reader get
- `UsageWidget`: the chart is now `role="img"` with an aria-label that reads the total and each
  period's value ("632,959 tokens this week, Mon Sep 7 3,285, …"); the SVG itself is hidden from
  assistive tech. Bar tooltips stay for mouse users.
- `DashboardPulse`: the week-over-week deltas use darker green/red (#15803d / #b91c1c) so the
  12px text passes contrast on white; the ribbon already had a role and label.
- Everything clickable added this pass (provider chips, module chips, Manage link) has a
  visible focus style, and the Pulse itself has nothing to focus, by design.

## Morning pivot (08:00): Jordy's review of the night pass

Verdict: noisier, not sleeker. The Pulse band took too much room, Usage was still ugly, the
tab tried to show everything. What he wants: sleek, welcoming, details behind a click, SEO on
the Dashboard (and pushing SEO Engine), Environments kept visible, the Workspace card named
"Workspace" with "Your alternative to AI apps".

### v2 (08:00 to 08:35): the Dashboard as a place to arrive
- Removed: `DashboardPulse.js`; the modules chip strip (ModulesOverview back to its original,
  and no longer shown on the Dashboard at all); the two-column Environments/Usage layout;
  the Setup Assistant as a permanent column.
- New `DashboardWelcome.js`: "Good morning. Everything is running." (or "One thing needs your
  attention." / "Welcome. Let's connect your first AI provider."), one "Next:" link while
  something is pending, an "All steps" link that opens the full Setup Assistant on demand, and
  three actions on the right: Open Workspace, New chatbot, Connect Claude.
- New `DashboardCards.js`: three equal cards. Providers (the compact chips, default star,
  Manage). This week (queries, delta, spend, a fourteen-day sparkline, and Details, which opens
  the full UsageWidget in a modal). SEO (SEO Engine's tiles when it is installed, a short pitch
  and "Get SEO Engine, free" when it is not, robots.txt status in the footer). The big
  deprecated-model warning no longer renders inside the card; the welcome line carries it.
- Modules tab: SEO block removed (it lives on the Dashboard now); showcase card renamed
  Workspace / Your alternative to AI apps; the slimmer showcase and one-line intros from the
  night stay.
- Kept from the night: `useUsageSummary` hook, compact provider chips, the decluttered
  UsageWidget (now only visible inside the modal).
- Screenshots: `notes/dashboard-redesign-v2-dashboard.jpg`,
  `notes/dashboard-redesign-v2-usage-modal.jpg`, `notes/dashboard-redesign-v2-modules.jpg`.
- Still uncommitted. Open questions for Jordy: greeting with or without the user's first
  name; whether "Connect Claude" should say "Connect an AI agent"; whether the SEO card should
  show a live number even without SEO Engine (there is none to show honestly).

### v3 (08:40 to 09:05): bento, and "Today you could…"
Jordy on v2: greeting fine; Providers should be a bento, it is the core, and any
misconfiguration must show there; SEO card should be sexier with or without SEO Engine; the
"Next: … All steps" line was boring; the three buttons top right should become a section
proposing things to do, different every day.
- Welcome line: greeting + one status sentence + "6 providers, 16 modules on" and a quiet
  "Setup steps" link only while something is pending. Buttons gone.
- Bento grid (2fr / 1fr): **Providers** spans the wide column with one tile per environment
  (brand-coloured logo, name, default star, and a role line: "Default, GPT-5.6 Luna",
  "Fast, …", "Ready", or the problem in amber: "No API key yet", "Fast: X is deprecated",
  "Add-on missing"). A tile with a problem gets an amber border. **This week** unchanged.
  **Today you could…** three ideas drawn from a pool of twelve, filtered by what is switched
  on, rotated by the date so the trio changes daily and stays put all day. **AI and search
  visibility** shows AI crawler chips from the site's own robots.txt (GPTBot, ClaudeBot,
  PerplexityBot… green or red), SEO Engine's numbers when installed, a one-line pitch and
  "Get SEO Engine, free" when not.
- Screenshot: `notes/dashboard-redesign-v3-bento.jpg`.

### Outcome (09:20)
Jordy: "Much better, much cleaner." Committed as is. Only two screenshots are kept in the
repo: `dashboard-redesign-before-1.jpg` (the old Dashboard) and `dashboard-redesign-v3-bento.jpg`
(what shipped); the night's intermediate pictures were deleted with their dead ends.
Open for a later pass: the SEO card title, and whether provider tiles should name the model
each environment is set to even when it is neither the default nor the fast one.
