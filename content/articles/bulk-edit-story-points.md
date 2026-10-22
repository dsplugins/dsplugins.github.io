# How to bulk-edit story points in Jira

_Last updated: 22 October 2026_

Sprint planning usually ends with twenty or thirty issues that each need a number. Jira Cloud gives
you two built-in ways to set story points, and they solve different problems: one sets the **same**
value on many issues, the other sets a **different** value on one issue at a time. This article walks
through both, then shows a third way that estimates a whole sprint in one table.

## Before you start: which field holds your story points

Jira has more than one story-points field, and editing the wrong one is the most common reason an
estimate "doesn't show up" on the board.

- **Company-managed projects** usually estimate with the **Story Points** field.
- **Team-managed projects** usually estimate with **Story point estimate**.

A Scrum board reads exactly one field — the one chosen in the board's **Estimation** settings — for
its badges, its velocity report and its burndown. Set a value in another field and the board ignores
it. If you are not sure, open the board settings and check before you edit anything.

## Option 1: the same value on many issues — Jira's bulk change

Use this when a batch of issues genuinely shares one estimate: a set of 1-point copy fixes, or
clearing the estimate from issues that moved back to the backlog.

1. Search for the issues. JQL makes this precise, for example
   `sprint in openSprints() AND "Story Points" is EMPTY` — use the field name your board estimates
   with.
2. From the search results, start a **bulk change** and choose **Edit issues**.
3. Tick the story-points field, enter the value, and confirm.

Two things can stop you here: bulk change needs the **Make bulk changes** global permission, and the
field has to be on the issues' edit screen. If either is missing, ask a Jira administrator.

What bulk change cannot do is give each issue its own value. That is the actual job of estimation,
so for a sprint it covers only the easy part.

## Option 2: a different value on each issue — one at a time

The backlog and the issue view let you edit the estimate of the issue in front of you. It works,
and it is how most teams estimate — but it scales badly:

- every issue is an open, read, type, close cycle;
- you lose sight of the other issues, so it is hard to keep sizes consistent ("is this bigger than
  the one we called a 5?");
- you do not see the sprint total until you are done;
- every number is written to Jira immediately, so a half-finished planning session leaves
  half-estimated issues on the board.

## Option 3: the whole sprint in one table

[Scope Planner](/) is a Jira Cloud app that loads a sprint, a backlog or any JQL into one editable
table, so you estimate every issue where you can see all of them.

- **Different values, inline.** Click a story-points cell and pick from your scale — Fibonacci,
  Modified Fibonacci, Powers of 2, Linear or T-shirt sizes — or type a number. Original and
  remaining time sit in the same row.
- **The same value, in bulk.** Tick several rows and the bulk bar applies one value to all of them,
  or clears a batch, after a confirmation. See [Bulk actions](/guide/#6-bulk-actions) in the user
  guide.
- **Totals as you go.** The sprint total updates with every edit and breaks down by epic, assignee,
  label or type.
- **Nothing reaches Jira until you decide.** Every edit lands in a private draft. You can share it
  with the team, and **Sprint Preview** shows exactly what would change, issue by issue, before
  anything is written.

Estimating, drafts, totals and Sprint Preview are free. Publishing the estimates to Jira in one pass
is a **Pro** feature, alongside per-assignee workload, estimation history, auto-calculated velocity
and CSV export — see [Free and Pro](/#pricing).

## Which one to use

| You want to… | Use |
| :-- | :-- |
| Give many issues the same number, or clear them | Jira's bulk change, or Scope Planner's bulk bar |
| Estimate one issue you are already looking at | The issue view |
| Estimate a whole sprint or backlog, compare sizes and watch the total | A table: Scope Planner |
| Agree on the numbers before Jira changes | Scope Planner's drafts and Sprint Preview |

Whichever way you choose, check the board's estimation field first. It decides whether the numbers
you type ever reach the board.
