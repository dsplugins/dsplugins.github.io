# Story points vs. time estimates in Jira

_Last updated: 22 October 2026_

Jira lets a team estimate in two units: **story points**, a relative size, and **time**, in hours,
days and weeks. They live in different fields, a board uses one of them for its reports, and many
teams end up using both without having decided to. This article explains what each one is for and
how to keep them from contradicting each other.

## What each field is

**Story points** are a number on a scale the team agrees on. A 5 means "about as much as the other
5s", not "five hours". Jira stores them in a number field — usually **Story Points** in
company-managed projects and **Story point estimate** in team-managed ones.

**Time estimates** are Jira's time tracking fields:

- **Original Estimate** — how long the work was expected to take when it was planned;
- **Remaining Estimate** — how much is left now; it goes down as people log work.

Jira writes durations as `1w 2d 4h 30m`. By default a day is 8 hours and a week is 5 days; a Jira
administrator can change both in the site's time tracking settings, so check yours before you
convert anything by hand.

## Which one the board uses

A Scrum board reads **one** estimation field for its badges, its velocity report and its burndown,
chosen in the board's **Estimation** settings — story points or original time estimate. A value in
the other field is still stored and still shown on the issue, but the board's reports ignore it.

That is the most common reason a team "estimated everything" and the velocity chart still shows
nothing: the numbers went into a field the board does not read.

## When to use which

**Story points suit sprint planning.** Sizes are compared with each other, not with the clock, so
the conversation is "is this bigger than that?" — quicker to agree on than hours, and less personal.
Over a few sprints the team's completed points per sprint (its velocity) becomes a reliable guide to
how much to plan.

**Time suits tracking work in progress.** Remaining Estimate answers "how much is left on this
issue?" during the sprint, and logged work answers "where did the time go?" afterwards.

**Using both is common and fine** — points at planning, time during the sprint — as long as the
board's estimation field is the one you plan with.

## Picking a scale for story points

Most teams use a scale whose steps widen as items grow, because the uncertainty does too:

| Scale | Values | Good for |
| :-- | :-- | :-- |
| Fibonacci | 1, 2, 3, 5, 8, 13, 21… | The classic; big items look visibly uncertain |
| Modified Fibonacci | 0.25, 0.5, 1, 2, 3, 5, 8, 13, 20, 40, 100 | The planning-poker deck; rounds the large values |
| Powers of 2 | 1, 2, 4, 8, 16, 32, 64 | Teams that think in "twice as big" |
| Linear | 1–10 | Small, well-understood items |
| T-shirt sizes | XS, S, M, L, XL, XXL | Early backlog refinement, before numbers mean much |

T-shirt sizes are not numbers, so Jira cannot add them up. They need their own field, and a team
that wants velocity eventually maps them to points.

## Estimating both in one place

[Scope Planner](/) puts story points, **Original** and **Remaining** in the same row of one table,
for a whole sprint, a backlog or any JQL.

- Pick your story-points scale in **⚙️ Preferences**; the cells offer that scale's values.
- Type time as a Jira duration (`1d 2h`, `1w`) or as a bare number in the unit you chose.
- Totals for points and both time fields update as you type.
- If the board estimates on a different field than the app is configured to use, the app warns
  you, so the numbers do not go into a field the board ignores.

Estimating and drafts are free; publishing the estimates to Jira is part of **Pro** — see
[Free and Pro](/#pricing). The [user guide](/guide/#5-the-estimation-table) covers every cell type.
