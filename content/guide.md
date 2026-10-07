# Scope Planner — User Guide

This guide explains every feature of Scope Planner from an end-user perspective. It covers the
free (Basic) features, the Pro features, and the one-time admin setup.

---

## 1. What Scope Planner does

Scope Planner turns sprint estimation into a single-screen, spreadsheet-style workflow:

1. **Load a scope** — a sprint, a backlog, or any JQL query.
2. **Estimate** — type or click values for Story Points, Original Estimate, and Remaining
   Estimate; edit rows one at a time or in bulk.
3. **Draft** — your work auto-saves as a *private draft* nobody else sees. Optionally *share*
   the draft with the team.
4. **Preview** — see exactly what will change, side by side with the current Jira values.
5. **Publish** *(Pro)* — write the estimates back to the real Jira fields in one action.

Nothing touches your Jira issues until you explicitly publish.

**New here? The five-minute path:**

1. *Jira admin, once:* open the app's admin page and press **🔍 Detect Fields**, then **Save** (§3).
2. Open a Scrum board → **⋯** → **Scope Planner**. The current sprint loads.
3. Click a Story Points cell and pick a value; repeat down the table. It saves itself.
4. **🚀 Sprint Preview** — check what will change.
5. **✅ Apply Estimates to Jira** *(Pro, or during the free trial)*.

---

## 2. Opening the app

Scope Planner appears in three places inside Jira:

| Entry point | Where to find it | What loads |
| :-- | :-- | :-- |
| **Board action** | On a Scrum board: the **⋯ (more actions)** menu → *Scope Planner* | All sprints on the board's active view |
| **Sprint action** | On a sprint's own **⋯** menu → *Scope Planner* | That one sprint |
| **Project page** | The project's tabs above the board → **More** → *Scope Planner* | The project's open sprints |

In each case the app pre-fills a matching JQL query and loads the issues immediately. There is
also a separate **admin configuration page** (see §3) for Jira administrators.

---

## 3. First-time setup (Jira admins)

Until a Story Points field is configured, every user sees an **onboarding banner** explaining
that setup is needed (admins see inline steps; other users are told to ask an admin).

If the app cannot load its settings at all — a network or service hiccup — it says exactly that on
its own screen and offers **Retry**, instead of claiming the app is unconfigured. Your drafts and
settings are untouched while that screen is up.

Open the admin page (the ⚙️ Preferences panel inside the app shows admins a direct link with
step-by-step navigation), then:

1. **✨ Auto-detect Field Mappings** — click **🔍 Detect Fields**. The app scans your Jira
   instance's fields and suggests mappings for each role. When several fields match, a dropdown
   lets you pick; badges mark each suggestion as *detected*, *fallback* (Jira's built-in field
   used because nothing better matched), or *none*. Review and click **Apply to form** — nothing
   is saved until you press Save.
2. **Field Mappings** — confirm or hand-edit:
   - **Story Points field** (required, numeric) — the app's core column. Usually
     `customfield_10016` ("Story point estimate") or similar. **Save** refuses a text or
     dropdown field here: the app writes numbers into it, and such a field would read as changed
     in Jira on every row.
   - **Epic field** (optional) — enables the Epic column and epic grouping.
   - **T-Shirt Size field** (optional, a *text* field or a *single-select* dropdown) — required
     only if your team estimates in T-shirt sizes. A dropdown needs the six sizes as its options,
     spelled exactly `XS`, `S`, `M`, `L`, `XL`, `XXL`: Jira refuses any value that is not one of a
     dropdown's options. The numeric SP field cannot be reused for this.
   - **Original / Remaining Estimate fields** — default to Jira's built-in time-tracking
     fields; only change these if your site uses custom ones.
   - **Start Date / Team / Sprint fields** (optional) — enable the corresponding table columns.
3. **Default Estimation Scales** — what people see before they choose for themselves: a Story
   Points scale and a time-stepping unit. A team that estimates in T-shirt sizes should not have to
   set that up one person at a time. Two rules worth knowing: anyone who picks a scale in their own
   Preferences keeps it, and changing this later does not move them; and **T-Shirt Sizes cannot be
   chosen here until a T-shirt field is mapped above** — defaulting a whole site onto a scale it
   cannot publish would make every cell accept a size and every publish fail.
4. **Draft retention** — `draftTtlDays`, default 30 days; expired drafts are deleted
   automatically.
5. **Save**. Only users with Jira admin permission can save this page — the server rejects
   anyone else.

> **Why some cells are disabled:** a Story Points cell is disabled when that issue type is outside
> the Story Points field's **context** in Jira — Jira would refuse the write, so the app does not
> let you type one. That's Jira configuration, not an app error. A field that is in context but
> missing from the issue type's **edit screen** stays editable here and publishes fine; it just
> cannot be edited from the issue view. Either way a banner above the table names the issue types.

---

## 4. Choosing your scope

- **JQL bar** — type any JQL and press Enter. Errors from Jira are shown inline.
- **🗂️ Scope Builder** — a JQL-free picker: choose a project, then either a specific sprint
  (active and future sprints are listed, grouped by state) or **Plan the backlog**. The builder
  writes the JQL for you and runs it. Projects without Scrum boards show "no sprints" but can
  still plan their backlog.
- **Automatic scope** — when opened from a board/sprint/project, the matching scope is
  pre-loaded (see §2).

After the first page of results, the app **automatically loads every remaining page** so
totals, select-all, CSV export, and the Sprint Preview always cover the full scope. A counter
shows progress ("Loading N of ~M…"). For safety the auto-load stops at **1,000 issues** with a
warning to narrow your JQL — estimation scopes are meant to be sprint-sized.

---

## 5. The estimation table

Each issue is one row. Columns include Issue key (clickable link), Priority, Summary, Assignee,
Status, and the estimation columns; more columns (Epic, Parent, Labels, Components, Due/Start
date, Team, Sprint) can be toggled via the **⚙️ Columns** menu (§8).

### Editing Story Points (numeric scales)

- **Click the value** → an input opens, together with a row of preset chips for your scale
  (e.g. Fibonacci). Type a number and press **Enter** to commit, click a chip to set it
  instantly, or press **Esc** to cancel.
- **Clicking a chip applies the value and closes the chip row**, so it stops covering the rows
  below. Picked the wrong one? Click back into the field to bring the chips up again.
- **Stepper (+/−)** → snaps to the next/previous value *of your scale* (from 6, Fibonacci steps
  up to 8 and down to 5 — not ±1). At the top of a scale, stepping up leaves the value where it
  is rather than inventing one.

### Editing Story Points (T-Shirt scale)

With the T-Shirt scale selected (§10), SP cells show **XS S M L XL XXL** chips instead — click
to select. Requires the admin-configured T-shirt field.

⚠️ **Sizes and points are two different Jira fields**, and the scale chooses which one the column
shows. So a numeric estimate in your draft does not appear while you are on the T-shirt scale — the
chips have nowhere to put it — and it is not marked as an edit there either. Nothing is lost:
hover the cell and it tells you what the draft holds, the Story Points total still counts it, and
Sprint Preview still lists it as a change to publish. Switch back to a numeric scale to see or
change it. The reverse is not true: a size shows up as `M` in a numeric cell, because a numeric
cell can display any text.

### Editing time estimates (Original / Remaining)

- Type a **bare number** — it's interpreted in your chosen time unit (hours by default, see
  §10), e.g. `4` → 4 hours.
- Or type a **Jira duration string**: `1d 2h 30m`, `1w`, `90m`. Conversions use Jira's
  standard workday: **1d = 8h, 1w = 5d**.
- The stepper steps by your chosen unit (15m / 1h / 1d).

### Draft values vs. current values

A cell you typed shows **your value**; every other cell shows **what Jira holds now**. Your edits
never change Jira until you publish.

The app re-reads Jira every 30 seconds while the table is open. When a colleague changes an estimate
in Jira, a cell you have not typed follows it — and its background **flashes briefly**, so a number
that moved by itself is visibly an arrival rather than a silent edit. A cell you typed never moves
by itself: it keeps your value, and only its highlight tells you whether that still differs from
Jira.

The **list of issues** is fixed when the search runs: an issue added to or removed from the sprint
shows up (or goes) the next time you run the search or reload. An estimate you typed on an issue
that has since left the scope stays in your draft — Sprint Preview lists it (§11).

**Undoing an edit.** Click an edited Story Points cell and the quick-pick palette opens with a **↺**
button at the end of it — it appears only on a cell you have actually changed, and puts Jira's
value straight back, with no need to click away first. It tells you what it will restore if you
hover it.

Two other ways do the same thing: clear the field and press Enter (or click away), or click the
**selected** chip again to un-select it. On the T-shirt scale the selected chip is the way — its
sizes sit in the cell itself rather than in a palette. Clearing the field works in every scale:
Story Points, Original and Remaining.

However you undo it — or if you simply type the number that was already there — a row with nothing
left different from Jira stops counting in *rows differ from Jira*. The draft itself stays until you
delete it, reading **0 rows differ from Jira** once nothing is left.

Undo returns the cell to **what Jira holds now** — the same number an untyped cell beside it would
show. If a teammate changed the issue in Jira since you opened the scope, that is their number.

To undo across many issues at once, select them and use **Delete Estimates ▾** in the bulk bar; it
does exactly the same thing to every selected row.

Cells you have actually changed are **highlighted**, so you can see at a glance what a publish
would write. The highlight tracks the *value*, not the act of typing: set a cell back to the
number Jira already holds and the highlight clears, because publishing it would change nothing.
Sprint Preview marks the same rows the same way.

### Estimation history *(Pro)*

Every numeric SP cell carries a faint **⏱** button next to the value (it brightens when you point
at it). Click it to see who changed the issue's estimates, when, and from/to what — sourced from
the Jira changelog. One history popover is open at a time; press **Esc** or click anywhere outside
it to dismiss. The T-shirt scale has no ⏱: its cell is six chips wide with no room for one.

---

## 6. Bulk actions

Tick the checkbox of **one or more rows** (or use the header select-all) and the bulk action bar
appears above the table. For each of SP / Original / Remaining you can:

- **Apply** one value to every selected issue, or
- **Clear** your value from every selected issue — **Delete Estimates ▾** → *Clear All*, *Clear 🎯
  Story Points*, *Clear ⏱ Original* or *Clear ⏳ Remaining*. Each cell then shows what Jira holds
  again, exactly as ↺ does for one cell (§5).

Each bulk action asks for confirmation before applying. Bulk-apply also works on rows whose
inline cell is disabled (e.g. issue types without the SP field) — useful for pre-staging values.

---

## 7. Totals & breakdown

The **totals bar** (bottom) always shows full-scope totals: Σ Story Points, Σ Original,
Σ Remaining, the issue count, and — when a target velocity is set (§10) — a **capacity**
indicator that highlights when the draft total exceeds it.

Expand the **totals panel** for:

- **Breakdown tab** — totals grouped by **Epic**, **Assignee**, **Label** (an issue's first
  label) or **Type**, using the *Group by* buttons. Issues without a value group under
  "No epic" / "No assignee" / "No label".
- **Workload tab** *(Pro)* — always per-assignee, so it has no *Group by* control. Shows each
  person's Story Point total with a proportional bar and an **overload flag**: an assignee is
  flagged when their SP exceeds 1.5× the average of all assignees with work. Unassigned work is
  listed but never flagged and never skews the average.

  The two tabs look similar when Breakdown is grouped by Assignee — the difference is that
  Workload adds the bar, the avatar and the overload comparison.

---

## 8. Column visibility & CSV columns

The **⚙️ Columns** menu has two independent checkboxes per column:

- **Visible** — show/hide the column in the table.
- **CSV** — include/exclude the column in CSV exports.

Choices are saved **per user** and persist across sessions. Columns whose Jira field isn't
configured (Team, Sprint, Start Date, and the estimation columns) don't appear in the menu at
all until an admin maps the field.

---

## 9. Drafts: private, team, and the lifecycle between them

**Two sentences, and the rest of this section follows from them:**

> Your **private draft** is visible only to you. The **team draft** is visible to everyone who can
> browse the projects your scope touches. Only the private draft can be edited — changes reach the
> team draft whole, through a review screen.

### 9.1 A draft has a status, and it changes

`private → team → published`. Each step is the *same draft* moving on, not a copy left behind. When
you share a draft it **becomes** the team draft; when you publish, it **becomes** published. That is
why nothing here talks about your draft being deleted: the numbers went somewhere, they were not
thrown away.

### 9.2 The status bar

The badge names **the copy you are looking at**:

| Badge | Meaning |
| :-- | :-- |
| ○ Unsaved | Nothing of yours is saved yet (auto-save fires ~1s after you stop typing) |
| ● Private Draft | Your work is saved server-side, visible only to you |
| ◈ Shared Draft | The table is showing the **team draft**, read-only |

Beside it, the toolbar describes **only the copy on screen**:

| Chip | Meaning |
| :-- | :-- |
| N rows · M values differ from Jira | How many rows of the copy on screen differ from **Jira now**, and how many cells — exactly the highlighted ones. **0 rows differ from Jira** while a draft exists and nothing in it differs; no chip when there is no draft and nothing differs |
| Updated by *name* · 2m ago | *(while reading the team draft)* who last wrote it, and when — *Updated by you* if it was you |

The **other** copy is announced by the buttons that act on it, not by a chip:

- **◈ View Team Draft** appears once a team draft exists; **● Back to My Draft** takes you home.
- **↑ Merge into Team Draft…** is greyed out while the team draft already has your values — hover it
  and it says so: *"The team draft already has your values"*.
- **⤓ Copy Team Draft to Mine** (in **Manage ▾**) and **📋 Copy to My Private Draft** are greyed out
  while your table already shows every value in the team draft: *"Your table already matches the
  team draft"*.

Each of these is live exactly when the screen it opens would have something on it.

⚠️ **The count follows Jira.** *rows differ from Jira* is against what Jira holds now, so it moves
when Jira does — a colleague publishing your number makes your row level, a colleague publishing a
different one makes it differ. That is the point: it says what publishing this copy would change.

⚠️ **How you know a publish landed:** the numbers you published are in the table, no longer
highlighted. With *Publish and delete this draft* ticked — the default — the draft goes and its
*rows differ from Jira* chip with it, so the draft going away is expected and tells you nothing on
its own. Left unticked, the draft stays and reads **0 rows differ from Jira** (§11).

### 9.3 Reading the team draft

**◈ View Team Draft** shows it in the same table you estimate in — read-only. Nothing you type there
goes anywhere, because the team draft is read-only for *everyone*, including whoever shared it: the
only way it changes is somebody merging into it, or deleting it and sharing anew. Rows the team draft does not estimate show Jira's
values, just as in your own copy.

To change it, use **📋 Copy to My Private Draft**, edit your own copy, and push your changes back
with **↑ Merge into Team Draft…**.

While you are reading it, the totals, the workload panel and a CSV export all describe **the team
draft** — what you are looking at is what gets counted and exported.

**If a teammate changes the team draft while you are reading it**, the newer version appears on
its own within half a minute — the cells that changed flash, and *Updated by* names who wrote it.
Nothing of yours is in it, so there is nothing to lose by it moving.

**If a teammate publishes or deletes the team draft while you have it open**, your table leaves
read-only mode on its own within half a minute — the copy you were reading no longer exists. Every
cell you have not typed shows what Jira holds now, including what was just published; your own
values stay exactly as you typed them.

### 9.4 ⚠️ Who can see a team draft

**Everyone who can browse every project your scope touches.** They do not need to have opened the
scope, and they do not need a draft of their own — that is the point, and it is what makes sharing
with a colleague possible at all.

Two consequences worth stating plainly:

- **Your scope's name and its JQL text become visible to those people.** Not just the numbers: the
  label you gave the draft and the query itself. You are told this on the review screen before you
  share.
- **A scope spanning several projects needs access to ALL of them.** If your scope is
  `project in (WEB, API)`, a colleague who can browse only WEB will **not** see it in their Drafts
  list — not even partially. This is deliberate: showing it would reveal that a scope reaching into
  API exists, to someone who cannot see API. If you want a draft a WEB-only colleague can find, give
  it a WEB-only scope.

Your **private** draft is unaffected by any of this. Nobody else can see it, ever.

### 9.5 Sharing, and merging

**↑ Share with Team** turns your private draft into the team draft. If nobody has shared one for
this scope yet, it happens immediately — there is nothing to review.

⚠️ **Sharing MOVES your draft — it does not copy it.** The moment you share, your draft *becomes*
the team draft: the table switches to it, read-only, and your own side is empty again (**○
Unsaved**). Nothing is lost and nothing is published; the numbers are the ones everyone is now
looking at. To have a working copy of your own again, take one back:

- **📋 Copy to My Private Draft** while you are reading the team draft, or
- **Manage ▾ → ⤓ Copy Team Draft to Mine** once you are back on your own side
  (**● Back to My Draft**).

This is the one status change most often read as data loss. It is not one.

If a team draft already exists, the button reads **↑ Merge into Team Draft…** and opens the
**↑ Merge into Team Draft** screen: row by row, the estimates **you typed** and what the team draft shows on the same rows
today — its own value, or Jira's where it has none. Every differing row has a tick box, and only
the rows you leave ticked are handed over, and only the fields you typed; everything else keeps
whatever the team draft holds today. **Merging never removes anything** from the team draft: rows
only the team estimated are not even on the screen. The *Team draft after merging* column shows
the result as you tick. Your private draft then closes and you continue on the team draft. It
refuses if somebody else changed the draft while you were reading; if
that happens you can look again, or **Merge Anyway** now that you have seen their version.

While the team draft already has every value you typed, **↑ Merge into Team Draft…** is greyed out:
there is nothing to hand over. Change an estimate and it becomes available; change it back and it
greys out again.

### 9.6 Copying the team draft into yours

**Manage ▾ → ⤓ Copy Team Draft to Mine** lists the estimates **the team draft has**, row by row,
against what **your table shows** on the same rows — your value, or Jira's where you have none.
(While you are *reading* the team draft, the same act is the **📋 Copy to My Private Draft** button
on the toolbar itself.) If your draft is empty there is nothing to review, so it just copies.

| Row | Meaning |
| :-- | :-- |
| ⇄ Replaces mine | Your table shows a different number there |
| ＋ Adds to mine | Your table shows nothing there — you have no value, and neither does Jira |

Rows where both already agree are hidden by default (toggle **Unchanged** to see them) and have no
checkbox. Every other row starts **checked**; untick anything you don't want. A ticked row takes
only the fields the team estimated — your other fields on that row stay. **Copying never removes
anything:** rows only you estimated are not on the screen at all, so no tick can reach them.

**Copying only ever changes your own private draft — it never writes to Jira**, and it does not take
the team draft away from anyone. There is a box offering to delete it afterwards; it is **off** by
default, because wanting your own copy does not imply wanting to remove everyone else's.

Who shared it is shown on this screen ("Shared by *name*" / "Shared by you"). While you read the
team draft, the status bar names who last updated it (*Updated by name · 2m ago*).

### 9.7 Staying in sync

The app checks every 30 seconds while the main screen or the copy screen is open.

- **On the main screen**, a newer team draft simply appears — the cells that changed flash, and
  *Updated by* names the new writer. There is nothing of yours in it to protect, so there is nothing
  to click.
- **On the copy screen**, it does **not** change under you — you are in the middle of a decision.
  An inline notice says it changed, and pulling it in resets your selection so you re-check it
  against the fresh values.
- **On the merge screen** there is no check while it is open. If the team draft changed since you
  opened it, pressing **↑ Merge into Team Draft** is refused — nothing is overwritten — and the screen
  shows the newer version; only then does **↑ Merge Anyway** appear.
- **Jira** is re-read too: cells you have not typed follow it, flashing as they change (§5).

If a teammate **publishes** the scope after your last edit, a banner tells you your draft predates
their publish, with **Compare in Preview**, **Discard my draft** and **Keep editing**.

### 9.8 Deleting

Delete lives in the toolbar's **Manage ▾** menu and deletes **whichever copy you are looking at** —
and it **says which on its face**: **🗑 Delete My Draft** on your own copy, **🗑 Delete Team Draft**
while you are reading the team's. The confirmation repeats it:

- On your own draft: only yours goes. Nobody can delete anyone else's private draft.
- On the team draft: it goes **for everyone**, and the dialog says so. Private drafts — yours and
  your teammates' — are untouched, and so is anything already in Jira.

Anyone can delete a team draft. It is a team object, not the property of whoever shared it. The same
button is available from Sprint Preview and from the copy screen, so you can decide a draft's fate
from wherever you happened to be looking at it.

Retention: drafts expire after the admin-configured period (default 30 days). **Renew** in the
Drafts list resets that clock.

### 9.9 Finding drafts again — the **🗂 Drafts** screen

Lists your private drafts across every scope, plus every team draft you can see (§9.4). Each team row
shows the projects that decide its visibility. From here you can **Open** (a team row opens read-only),
**Rename**, **Renew** and **Delete**.

Each row says how far that draft is from Jira *now* — *N rows · M values differ from Jira*, the
same words as the status bar. The list refreshes itself every 30 seconds while it is open, so the
numbers follow Jira; it waits while you are typing a new name or answering a delete prompt.

**📋 Copy Last Published:** if a scope was published before, Sprint Preview can start a new draft
from the last published values instead of from scratch.

---

## 10. Preferences (per user)

These start from whatever the admin set as the site default (§3) and become yours the moment you
change one — after that the site default no longer reaches you, even if an admin changes it.

The ⚙️ button next to the title opens **Preferences**:

- **🎯 Story Points Scale** — controls the preset chips and stepper behavior:

  | Scale | Values |
  | :-- | :-- |
  | Fibonacci | `0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89` |
  | Modified Fibonacci *(default)* | `0, 0.25, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100` |
  | Powers of 2 | `0, 1, 2, 4, 8, 16, 32, 64` |
  | Linear | `0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10` |
  | T-Shirt Sizes | `XS, S, M, L, XL, XXL` |

  Modified Fibonacci is the standard Planning Poker deck: it adds fractions at the bottom for
  trivial work, and deliberately *rounds* at the top (20, 40, 100 rather than 21, 34, 55, 89)
  because that precision is not meaningful on large items. T-Shirt requires the admin field
  mapping.
- **⏱ Time Estimate Stepping** — Minutes (±15m), Hours (±1h, default), or Days (±1d). Also
  sets how bare numbers you type into time cells are interpreted.
- **🚀 Target Velocity** *(Pro)* — your team's SP-per-sprint target; powers the capacity
  indicator in the totals bar. **✨ Auto-calculate** fills it with the average completed SP of
  the board's last 5 completed sprints (only available when the app was opened from a board or
  sprint, since that's what identifies the board).

---

## 11. Sprint Preview & publishing

Scope Planner has three review screens that share the same table shape. **Sprint Preview**,
below, compares a draft **against Jira** and is the only one that writes to Jira. **⤓ Copy Team
Draft** (§9.6) compares the **team draft against your table** and writes only to your own draft.
**↑ Merge into Team Draft** (§9.5) compares **your draft against the team draft** and writes only
to the team draft.

**🚀 Sprint Preview** shows every issue with **Draft** and **Current** values side by side,
plus totals. **Current** is what Jira holds right now — the screen re-reads it as it opens. A row
whose draft differs from Jira is marked, and its delta column shows `—` rather than `0` when the
two agree. Every differing row is an estimate you typed, and every one starts **ticked**: if a
colleague has put a different number into Jira since, it is right there under *Current*, with its
delta — leave the box ticked to overwrite it, untick it to keep theirs. **T-shirt sizes do not add to the Story Points total** —
they publish to the T-shirt field, not the numeric one, so the total counts that issue's
existing Story Points and the total keeps matching what a publish will actually produce. It also lists draft estimates for issues that have **left the scope** since you
estimated them (marked "not in current scope results") — so nothing is silently dropped or
silently published. Like every differing row they start ticked, and a publish writes them to
those issues; untick one to leave that issue alone.

**🚀 Sprint Preview publishes the copy the table is showing**, and says at the top which one that
is:

- From your own draft — *🚀 Sprint Preview*. This is what most publishes are.
- While reading the team draft (§9.3) — *🚀 Publish Team Draft*. Available to anyone who can see
  it, including someone who has estimated nothing themselves; that is the point of sharing one. It
  refuses outright if a teammate changed the draft while you were reviewing, and nothing is
  written to Jira in that case.

The screen also offers **📋 Copy…** (the team draft into yours, or the last published values back
into yours) and **🗑 Delete My Draft**, so you can decide a draft's fate without going back first.

**Publish** *(Pro)* writes the previewed estimates to Jira:

- Story Points → the mapped SP field (or the T-shirt field for T-shirt values).
- Original/Remaining → Jira's time-tracking fields.
- Writes happen **with your own Jira permissions** — you can't change issues you couldn't edit
  yourself in Jira.

The result screen reports per-issue success/failure **and why each failure happened** — Jira's own
message, listed once per distinct reason with the issues it affected, so a single misconfiguration
reads as one problem rather than one line per row. Hovering the ❌ on a row shows the same text.
On **partial failure** (a permissions issue, a workflow restriction, a deleted issue) nothing is
lost: every draft stays alive, and a **Retry** button re-attempts just the failed issues.

⚠️ **Read the reason before pressing Retry.** If the cause is configuration — a field that isn't on
the issue's edit screen, say — retrying produces exactly the same result until an admin fixes it.

**Before you publish**, the screen warns you about T-shirt sizes Jira will refuse, naming the issue
types involved, so you find out before the write rather than after it.

**Publishing deletes the draft it published.** The box — *"Publish and delete this draft"* — is
**ticked by default**, because publishing is the end of a draft's life: the numbers are in Jira,
which is where they were going. Untick it if you mean to keep working on the draft afterwards: it
stays, reading **0 rows differ from Jira**, and the result banner reminds you that **🗑 Delete My
Draft** removes it when you are done.

If you publish only **some** rows, there is **no box**: the draft stays, with the rows you left out,
and nothing you did not publish can be deleted from this screen. A draft is only ever deleted
because you asked — this box, **🗑 Delete**, or the draft's expiry. On a **partial failure nothing
closes at all** — the draft has to still be there for Retry to finish the job.

When a publish does delete the draft, your estimates are not lost — they are in Jira, and
**📋 Copy Last Published** in Sprint Preview pulls them back into a fresh draft. Two things do not
come back: the draft's **name**, and, once the published record expires with the drafts (§3), the
shortcut itself.

Because the draft does go away on the normal path, what tells you the publish landed is the table
itself: the rows you published now show their new values, and the *rows differ from Jira* chip is
gone with the draft. Every other row shows what Jira holds, as always — within half a minute of any
change to it.

A teammate's private drafts are **never** touched by your publish — they get the "superseded"
banner instead (§9).

---

## 12. CSV export *(Pro)*

The **Export CSV** button in the totals bar downloads the full loaded scope (not just the
visible page) as `scope-planner-export-YYYY-MM-DD.csv`. Estimation columns export both
*Current* and *Draft* values. Which columns are included is controlled per user via the Columns
menu (§8). Exports are hardened against spreadsheet formula injection (cells starting with `=`,
`+`, `-`, `@` are neutralized). The button is disabled while pages are still loading, so an
export is always full-scope.

---

## 13. Licensing

| State | Behavior |
| :-- | :-- |
| **Active** | All features available |
| **Trial** | **Everything works, including all Pro features.** An informational banner reminds you to add a license before the trial ends |
| **Expired / no license** | Banner shown; Pro features locked. Estimating, drafts, shared drafts, Sprint Preview and totals keep working — your drafts are never lost |

Pro features are: publishing to Jira (and retrying failed publishes), CSV export, the per-assignee
workload view, estimation history, and auto-calculated target velocity.

Locked Pro features show an upgrade dialog explaining which feature needs a license — including
the publish button in Sprint Preview.

The features that talk to the server — **publishing, retrying a publish, estimation history and
auto-calculated velocity** — are enforced server-side; for those the UI gate is a courtesy, not the
security boundary. **CSV export and the workload view are UI-gated only**, because both are
computed in your browser from issues the app has already loaded for you: there is no separate
server call to withhold, and the underlying data is issue data you can already see in Jira.

---

## 14. Data, privacy & GDPR

- Drafts, preferences, and publish records live in **Atlassian Forge storage inside your Jira
  site** — no external servers, no data egress (see [PRIVACY.md](../PRIVACY.md)). Drafts *and*
  publish records expire on the same administrator-configured clock (30 days by default).
- The app identifies people by Atlassian account ID only — it never stores display names or
  avatars. The one thing to know: your **JQL is stored exactly as you typed it**, so a filter like
  `assignee = "alex@example.com"` keeps that text with the draft or publish record until it
  expires.
- When a user is deleted from Jira, their private drafts and preferences are hard-deleted
  automatically; their attribution on shared/published records is anonymized. User
  anonymization in Jira triggers the same reference cleanup.

---

## 15. Troubleshooting

| Symptom | Cause / fix |
| :-- | :-- |
| SP column empty for everyone, banner at top | Story Points field not configured — a Jira admin must complete §3 |
| One issue's SP cell disabled | That issue type is outside the Story Points field's context in Jira — a Jira admin adds it. The banner above the table names the types |
| *"N of M issues can't store a Story Points value"* | Same cause, counted: those issue types are outside the field's context. A publish to them would fail, so their cells are disabled |
| *"N of M issues have the Story Points field hidden"* | The field is in context but not on those issue types' edit screen. Estimating and publishing work; only the issue view cannot edit it until an admin adds the field to the screen |
| *"This board estimates on a different field"* | The board (**Board settings → Estimation**) uses another field than the Story Points field Scope Planner is set to, so the column looks empty and what you publish does not count toward the board's velocity. An admin makes one match the other — or dismisses the warning if the difference is intended |
| T-Shirt scale greyed out in Preferences | No T-shirt field mapped by the admin |
| "Narrow your JQL" warning | Scope exceeded 1,000 issues; auto-load stopped — refine the query |
| Publish partially failed | Read the reason in the result banner (or hover the ❌), fix the cause (permissions, workflow, a field missing from the issue's edit screen), then press Retry |
| "Jira will not accept" warning before publishing | The T-shirt field isn't on the edit screen for those issue types — an admin has to add it; the rest of the publish is unaffected |
| Auto-calculate velocity disabled | Open the app from a board or sprint (it needs board context) |
| Publish button shows upgrade dialog | No active license — publishing is a Pro feature. A *trial* publishes normally; if you're on a trial and still see this, the license state didn't reach the app — reload |

---

## 16. Getting help

Write to **dsplugins@gmail.com**. To get an answer in one round, include:

- what you did, what you expected, and what happened instead — a screenshot helps most;
- which screen you were on (estimation table, Sprint Preview, 🗂 Drafts, admin page);
- for a failed publish, the reason text from the result banner.

Please do not send issue content you would not want to share outside your organisation — a
description of the problem is almost always enough. Support is provided on a reasonable-effort
basis (see the [terms of use](../TERMS.md)).
