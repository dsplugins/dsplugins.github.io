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

---

## 2. Opening the app

Scope Planner appears in three places inside Jira:

| Entry point | Where to find it | What loads |
| :-- | :-- | :-- |
| **Board action** | On a Scrum board: the **⋯ (more actions)** menu → *Scope Planner* | All sprints on the board's active view |
| **Sprint action** | On a sprint's own **⋯** menu → *Scope Planner* | That one sprint |
| **Project page** | Project sidebar → **Apps** → *Scope Planner* | The project's open sprints |

In each case the app pre-fills a matching JQL query and loads the issues immediately. There is
also a separate **admin configuration page** (see §3) for Jira administrators.

---

## 3. First-time setup (Jira admins)

Until a Story Points field is configured, every user sees an **onboarding banner** explaining
that setup is needed (admins see inline steps; other users are told to ask an admin).

Open the admin page (the ⚙️ Preferences panel inside the app shows admins a direct link with
step-by-step navigation), then:

1. **✨ Auto-detect Field Mappings** — click **🔍 Detect Fields**. The app scans your Jira
   instance's fields and suggests mappings for each role. When several fields match, a dropdown
   lets you pick; badges mark each suggestion as *detected*, *fallback* (Jira's built-in field
   used because nothing better matched), or *none*. Review and click **Apply to form** — nothing
   is saved until you press Save.
2. **Field Mappings** — confirm or hand-edit:
   - **Story Points field** (required, numeric) — the app's core column. Usually
     `customfield_10016` ("Story point estimate") or similar.
   - **Epic field** (optional) — enables the Epic column and epic grouping.
   - **T-Shirt Size field** (optional, must be a *text* field) — required only if your team
     estimates in T-shirt sizes. The numeric SP field cannot be reused for this.
   - **Original / Remaining Estimate fields** — default to Jira's built-in time-tracking
     fields; only change these if your site uses custom ones.
   - **Start Date / Team / Sprint fields** (optional) — enable the corresponding table columns.
3. **Defaults & retention** — default estimation scale for new users and **draft retention**
   (`draftTtlDays`, default 30 days; expired drafts are deleted automatically).
4. **Save**. Only users with Jira admin permission can save this page — the server rejects
   anyone else.

> **Why some cells are disabled:** a cell is editable only if the mapped field is actually on
> that issue type's screen in Jira. An issue type without the Story Points field shows a
> disabled SP cell — that's Jira configuration, not an app error.

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
- **Stepper (+/−)** → snaps to the next/previous value *of your scale* (from 6, Fibonacci steps
  up to 8 and down to 5 — not ±1). At the top of a scale, stepping up leaves the value where it
  is rather than inventing one.

### Editing Story Points (T-Shirt scale)

With the T-Shirt scale selected (§10), SP cells show **XS S M L XL XXL** chips instead — click
to select. Requires the admin-configured T-shirt field.

### Editing time estimates (Original / Remaining)

- Type a **bare number** — it's interpreted in your chosen time unit (hours by default, see
  §10), e.g. `4` → 4 hours.
- Or type a **Jira duration string**: `1d 2h 30m`, `1w`, `90m`. Conversions use Jira's
  standard workday: **1d = 8h, 1w = 5d**.
- The stepper steps by your chosen unit (15m / 1h / 1d).

### Draft values vs. current values

An edited cell shows your **draft value**; unedited cells show the current Jira value. Clearing
a draft value reverts the cell to whatever is currently in Jira (or `—` if the issue was never
estimated). Your edits never change Jira until you publish.

### Estimation history *(Pro)*

Hover a numeric SP cell and click the **⏱** button to see who changed the issue's estimates,
when, and from/to what — sourced from the Jira changelog. One history popover is open at a
time; press **Esc** or click anywhere outside it to dismiss.

---

## 6. Bulk actions

Tick the checkboxes of **two or more rows** (or use the header select-all) and the bulk action
bar activates. For each of SP / Original / Remaining you can:

- **Apply** one value to every selected issue, or
- **Clear** the draft value from every selected issue.

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

## 9. Drafts: private, shared, and the team lifecycle

The **draft status bar** shows where your work stands:

| Badge | Meaning |
| :-- | :-- |
| ○ Unsaved | Edits not yet auto-saved (auto-save fires ~1s after you stop typing) |
| ● Private Draft | Your work is saved server-side, visible only to you |
| ◈ Shared Draft | A team-shared draft exists for this scope |

**Private drafts** are keyed to you + the exact scope (the JQL text). Coming back to the same
board/sprint later restores your draft. Drafts expire after the admin-configured retention
period (default 30 days).

**Share with the team:** *Promote* your private draft to a **shared draft**. Teammates opening
the same scope see it, with attribution and timestamp. If someone else already shared a draft
for this scope you get a **conflict dialog**: *Override Shared Draft* (replace theirs) or
*Keep Existing*.

**Adopt Shared** copies the team draft into *your* working copy (and private draft) — this is
the intended way to publish what a teammate shared, because preview and publish always operate
on **your own** working copy.

**Staying in sync:** the app checks every 30 seconds. If a teammate updates the shared draft
while you're viewing it, a **"🔄 Updated by a teammate"** pill appears — click to pull in their
version (the app never replaces what you're looking at without you asking). If a teammate
**publishes** the scope after your last edit, a banner tells you your draft predates their
publish, with **Review** (opens Sprint Preview), **Discard my draft**, and **Dismiss** options.

**Deleting:** the ⋯ menu offers **Discard My Draft** (your private draft only — nobody can
discard anyone else's) and **Remove Shared Draft** (removes the team draft *for everyone*;
shows who created it and asks for confirmation; private drafts are untouched).

**Copy from published:** if a scope was published before, you can start a new draft from the
last published values instead of from scratch.

---

## 10. Preferences (per user)

The ⚙️ button next to the title opens **Preferences**:

- **🎯 Story Points Scale** — Fibonacci, Modified Fibonacci (default), Powers of 2, Linear, or
  T-Shirt Sizes. Controls the preset chips and stepper behavior. T-Shirt requires the admin
  field mapping.
- **⏱ Time Estimate Stepping** — Minutes (±15m), Hours (±1h, default), or Days (±1d). Also
  sets how bare numbers you type into time cells are interpreted.
- **🚀 Target Velocity** *(Pro)* — your team's SP-per-sprint target; powers the capacity
  indicator in the totals bar. **✨ Auto-calculate** fills it with the average completed SP of
  the board's last 5 completed sprints (only available when the app was opened from a board or
  sprint, since that's what identifies the board).

---

## 11. Sprint Preview & publishing

**📋 Sprint Preview** shows every issue with **Draft** and **Current** values side by side,
plus totals. It also lists draft estimates for issues that have **left the scope** since you
estimated them (marked "not in current scope results") — so nothing is silently dropped or
silently published.

**Publish** *(Pro)* writes all your draft estimates to Jira:

- Story Points → the mapped SP field (or the T-shirt text field for T-shirt values).
- Original/Remaining → Jira's time-tracking fields.
- Writes happen **with your own Jira permissions** — you can't change issues you couldn't edit
  yourself in Jira.

The result screen reports per-issue success/failure. On **partial failure** (a permissions
issue, a workflow restriction, a deleted issue) nothing is lost: your drafts stay alive, and a
**Retry** button re-attempts just the failed issues. Once everything succeeds, the source
drafts (your private draft and the shared draft, if you published one) are cleaned up
automatically. A teammate's private drafts are **never** deleted by your publish — they get the
"superseded" banner instead (§9).

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
  site** — no external servers, no data egress (see [PRIVACY.md](../PRIVACY.md)).
- The app stores Atlassian account IDs only — never names or emails.
- When a user is deleted from Jira, their private drafts, presets, and preferences are
  hard-deleted automatically; their attribution on shared/published records is anonymized. User
  anonymization in Jira triggers the same reference cleanup.

---

## 15. Troubleshooting

| Symptom | Cause / fix |
| :-- | :-- |
| SP column empty for everyone, banner at top | Story Points field not configured — a Jira admin must complete §3 |
| One issue's SP cell disabled | That issue type doesn't have the SP field on its screen in Jira |
| T-Shirt scale greyed out in Preferences | No T-shirt field mapped by the admin |
| "Narrow your JQL" warning | Scope exceeded 1,000 issues; auto-load stopped — refine the query |
| Publish partially failed | Check the per-issue error, fix the cause (permissions, workflow), press Retry |
| Auto-calculate velocity disabled | Open the app from a board or sprint (it needs board context) |
| Publish button shows upgrade dialog | No active license — publishing is a Pro feature. A *trial* publishes normally; if you're on a trial and still see this, the license state didn't reach the app — reload |
