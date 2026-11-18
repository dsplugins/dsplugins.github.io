# Story points in Jira: how to turn them on, add them and find a missing field

_Last updated: 18 November 2026_

**Short answer:** Jira keeps story points in a number field: **Story Points** in company-managed
spaces, **Story point estimate** in team-managed ones. Turn estimation on for the board or the space,
then type a number into that field on each work item, in the backlog or in the work item view. When
the field is missing, the cause is almost always one of four: estimation is off, the field does not
apply to that work type, it is hidden from the work item's layout, or the work item is a sub-task.

Jira now calls projects *spaces* and issues *work items*; this article uses the new names, and the
old ones mean the same thing. What story points are *for*, and why they are not hours, is in [story
points vs. time estimates](/articles/story-points-vs-time-estimates/).

## What story points are in Jira

Atlassian describes story points as a measure of effort relative to other work, one that ["doesn't
correlate to any amount of time"](https://support.atlassian.com/jira-software-cloud/docs/what-are-story-points/).
A 3 is roughly three times a 1 for the same team, not three hours.

In Jira they are an ordinary number field, and two details trip teams up:

- **Two fields for two kinds of space.** Company-managed spaces use **Story Points**; team-managed
  spaces use **Story point estimate**. A board reads exactly one field for its estimates, so a value in
  the other one is stored but ignored by the board's reports.
- **Estimation belongs to Scrum.** In company-managed spaces only Scrum boards have estimation
  settings, and the sprint totals and the velocity report come with them.

## How to turn story points on

### Company-managed: the board's settings

1. Next to the board's name in the sidebar, select **More actions (•••)**, then **Board settings**.
2. Select **Estimation**.
3. In **Estimation method**, choose **Story Points**.

You need to be an administrator of the board or of its space ([Atlassian's
guide](https://support.atlassian.com/jira-software-cloud/docs/configure-estimation-and-tracking/)).
The **Time tracking** option on the same page only decides how progress is tracked during the sprint.

### Team-managed: the Estimation feature

1. Next to the space name in the sidebar, select **More actions (•••)**, then **Space settings**.
2. Select **Features** and turn on **Estimation**.
3. Choose **Story points**.

Jira then adds **Story point estimate** to every standard work type; epics need it added by hand
([Atlassian's guide](https://support.atlassian.com/jira-software-cloud/docs/enable-estimation/)).
Turning estimation off later hides the values without deleting them, and they come back when it is
turned on again.

## How to add story points to a work item

- **In the backlog:** select a work item and type the number into its story points field. Atlassian
  [expects estimating to happen here](https://support.atlassian.com/jira-software-cloud/docs/estimate-an-issue/),
  before the sprint starts.
- **In the work item view:** open the work item and fill in the field among its details.

The value must be a number, and decimals such as 0.5 are allowed. Each value is saved to Jira as soon
as you enter it. In the backlog, each sprint's header then adds the estimates up by status: to do,
in progress and done. That is the quickest check of how full a sprint is. There is no single combined
total, so add the three.

The same value on many work items at once is a bulk change. Different values on many work items is a
different job, covered in [how to bulk-edit story points](/articles/bulk-edit-story-points-in-jira/).

## Why the Story Points field is missing

Work through these in order. The first three cover nearly every case.

1. **Estimation is off (team-managed).** **Story point estimate** exists only while the Estimation
   feature is on with story points chosen. Turn it on as above.
2. **The field does not apply to this work type (company-managed).** By default, Story Points applies
   to stories and epics only, so bugs and tasks do not have it ([Atlassian's
   guide](https://support.atlassian.com/jira-software-cloud/docs/what-are-story-points/)). A Jira
   administrator widens it under **Settings → Work items → Fields**: on the field, **More actions
   (•••) → Contexts and default value**, then add the work types and spaces ([field
   contexts](https://support.atlassian.com/jira-cloud-administration/docs/add-a-context-to-a-custom-field/)).
3. **The field is hidden or not on the layout.** Open a work item, select **Configure**, then **Work
   item view**, and check that Story Points is not under *Hidden fields*. If it is not offered at all,
   it is missing from the work type's screen, and adding it there takes a site administrator
   ([field layout](https://support.atlassian.com/jira-software-cloud/docs/configure-field-layout-in-the-work-item/)).
4. **It is a sub-task.** Sub-tasks do not have the field by default, and Atlassian
   [advises against estimating on them](https://support.atlassian.com/jira-software-cloud/docs/estimate-an-issue/):
   estimate the story, and track its sub-tasks in time.

**Let Jira tell you.** A Jira administrator can open the work item, select **More actions (•••) →
Find your field**, pick the story points field, and Jira lists what is blocking it ([Atlassian's
guide](https://support.atlassian.com/jira-cloud-administration/docs/find-missing-fields-in-your-spaces-and-work-items/)).

**One more trap: the field is there, but the board reads another one.** A site often has more than one
number field that looks like story points, Story Points and Story point estimate at least. If the
values are filled in but the board's badges and velocity stay empty, compare the field with the
board's estimation setting, as described in [which field the board
uses](/articles/story-points-vs-time-estimates/#which-one-the-board-uses).

## Finding story points with JQL

Field names that contain spaces go in quotes:

| You want | JQL |
| :-- | :-- |
| Unestimated work in open sprints (company-managed) | `sprint in openSprints() AND "Story Points" is EMPTY` |
| The same in a team-managed space | `sprint in openSprints() AND "Story point estimate" is EMPTY` |
| Items big enough to split | `sprint in openSprints() AND "Story Points" >= 13` |
| Estimated stories only, no bugs or sub-tasks | `issuetype = Story AND "Story Points" is not EMPTY` |

JQL finds work items; it does not add up their points. For a total over any search, export it and
sum the column in a spreadsheet, as in [velocity per
assignee](/articles/velocity-per-assignee-in-jira/#method-1-export-a-search-and-add-it-up). For
finished sprints, the Sprint Report and the [Velocity Chart](/articles/sprint-velocity-in-jira/)
already show what was committed and completed.

## What a 3, a 5 or an 8 means

Points only mean something next to each other: a 5 is a little more work than a 3 and a little less
than an 8, for the same team. Most teams anchor the scale on one well-understood [baseline
story](https://scrum-poker.dev/guides/baseline-story) and size everything against it, often with
[planning poker](https://scrum-poker.dev/planning-poker-guide), so that nobody anchors on the first
number said aloud. A point has no fixed number of hours, and [here is
why](/articles/story-points-vs-time-estimates/#how-many-hours-is-a-story-point).

## Estimating a whole sprint's story points at once

[Scope Planner](/) is a Jira Cloud app that loads a sprint, a backlog or any JQL into one table, with
story points, original and remaining time in every row. It is on the
[Atlassian Marketplace](https://marketplace.atlassian.com/apps/2134578868?utm_source=dsplugins.dev&utm_medium=referral&utm_campaign=website&utm_content=story-points-in-jira), with a free trial.

It also catches the field problems above:

- **🔍 Detect Fields**, on the app's admin page, finds the fields on your site that can hold story
  points and asks which one to use when more than one fits.
- **A work type outside the field's context** gets a disabled cell instead of a failed write, and a
  banner above the table names those work types.
- **A board that estimates on a different field** gets a warning, so the numbers do not go into a
  field the board ignores.

Estimating, drafts and Sprint Preview are free; publishing the estimates to Jira is part of **Pro** —
see [Free and Pro](/#pricing). The [user guide](/guide/#3-first-time-setup-jira-admins) covers the
setup.

## Frequently asked questions

### What are story points in Jira?

A number that sizes a work item relative to other work, not in hours. Jira stores it in the Story
Points field in company-managed spaces and in Story point estimate in team-managed ones, and a Scrum
board uses it for sprint planning and velocity.

### How do I add story points in Jira?

Turn estimation on for the board (company-managed: Board settings → Estimation) or for the space
(team-managed: Space settings → Features → Estimation). Then type a number into the story points field
of each work item, in the backlog or in the work item view.

### Why can't I see the Story Points field in Jira?

Usually estimation is off, the field's context leaves out that work type, or the field is hidden from
the work item's layout. A Jira administrator can open the work item and use More actions → Find your
field to see which.

### How do I enable story points in a team-managed space?

Select More actions (•••) next to the space name, then Space settings → Features, turn on Estimation
and choose Story points. Jira adds the Story point estimate field to every standard work type.

### Can sub-tasks have story points in Jira?

Not by default: the field applies to stories and epics. A Jira administrator can extend its context,
but Atlassian recommends estimating the story and tracking its sub-tasks in time.

### How do I see the total story points of a sprint?

In the backlog, the sprint's header adds up its estimates for to do, in progress and done. After the
sprint, the Sprint Report and the Velocity Chart show what was committed and what was completed.
