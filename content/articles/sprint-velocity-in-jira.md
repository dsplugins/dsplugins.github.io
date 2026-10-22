# How to calculate sprint velocity in Jira

_Last updated: 22 October 2026_

Velocity is the amount of work a team actually finishes in a sprint, usually measured in story
points. Averaged over a few sprints, it tells you how much to plan into the next one. This article
shows how to read it in Jira, how to turn it into a planning number, and the mistakes that make it
misleading.

## What counts

- **Only finished work.** An issue counts toward the sprint in which it was completed. Work started
  but not done counts for nothing in that sprint.
- **Only estimated work.** An issue without story points adds zero, however big it was.
- **The board's estimation field.** Velocity is computed from the one field the board estimates with
  (its **Estimation** settings). Points typed into another field are invisible to it.

## Reading it in Jira

On a Scrum board, open **Reports** and choose the **Velocity report**. For each recent sprint it
shows two bars:

- **Commitment** — the estimates of the issues in the sprint when it started;
- **Completed** — the estimates of the issues finished by the time it closed.

The gap between them is the useful part. A team that always commits far more than it completes is
planning on hope, not on velocity.

## Turning it into a planning number

Take the **Completed** values of the last few sprints — five is a common choice — and average them:

| Sprint | Completed |
| :-- | --: |
| Sprint 20 | 34 |
| Sprint 21 | 41 |
| Sprint 22 | 29 |
| Sprint 23 | 38 |
| Sprint 24 | 36 |
| **Average** | **35.6** |

Plan the next sprint at about that total, then adjust for what you know: holidays, a new teammate,
an unusual amount of support work. Use the average, not the best sprint.

## Mistakes that distort velocity

- **Changing estimates after the work is done.** Re-pointing a finished issue rewrites history, and
  the average stops describing the team.
- **Comparing teams.** Points are relative to the team that assigned them; one team's 40 is not
  another's.
- **Counting half-done work.** Splitting an unfinished issue and crediting the "done half" inflates
  the number. Carry the issue over and let it count when it is finished.
- **Too few sprints.** One or two sprints are noise. Wait for four or five before trusting the
  average.

## Planning against velocity in one table

[Scope Planner](/) shows the sprint total next to a target velocity while you estimate, so you see
the sprint overflow before you start it, not halfway through.

- The totals bar shows the sprint's story points and, when a target velocity is set, a capacity
  indicator that highlights when the draft total goes over it.
- With **Pro**, **✨ Auto-calculate** fills the target from the average of the board's last five
  completed sprints — no number to maintain by hand.
- Also with **Pro**, the **Workload** tab shows each assignee's points and flags anyone above 1.5×
  the team average, so you can rebalance before the sprint starts.

The estimation table, drafts and totals are free; target velocity, workload and publishing to Jira
are **Pro** — see [Free and Pro](/#pricing) and [Preferences](/guide/#10-preferences-per-user) in the
user guide.
