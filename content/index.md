# Scope Planner

Estimate a whole sprint on one screen, review exactly what will change, then publish every
estimate to Jira in one pass.

Scope Planner is a Jira Cloud app for teams that estimate in batches instead of one issue at a
time. Pick a scope, fill in the estimates in a single table, keep it as a private draft while you
think, share it with the team when you are ready, and publish it to Jira's own estimate fields when
the numbers are agreed.

It runs entirely on Atlassian's infrastructure, built on Atlassian Forge. There are no external
servers, no data egress, and no tracking of any kind — the app declares no external network
permissions, so the Forge platform itself blocks outbound calls. The only personal data it stores
is Atlassian account IDs.

## How it works

1. **Choose a scope** — a board and sprint, a project, or your own JQL.
2. **Estimate in one table** — story points on a numeric or T-shirt scale, or time estimates.
   Inline edits, bulk fill, and running totals as you go.
3. **Keep a draft** — private while you work; share it and it becomes the team draft everyone
   reads. Teammates merge their numbers into it through a row-by-row review, so nobody overwrites
   anyone by accident. Drafts do not touch Jira — nothing is written until you decide.
4. **Review and publish** — Sprint Preview shows exactly what will change before anything is
   written, and every write executes with your own Jira permissions.

## What's free and what's paid

| Free with the app | Pro subscription |
| :-- | :-- |
| The estimation table — inline and bulk editing, numeric and T-shirt scales, time estimates | **Publishing estimates to Jira** (and retrying a failed publish) |
| Private drafts and team-shared drafts | CSV export |
| Totals, breakdown, and column visibility | Per-assignee workload with capacity warnings |
| Sprint Preview — see what a publish would change | Estimation history per issue |
| | Auto-calculated target velocity from closed sprints |

Pro features are unlocked by a subscription or an active evaluation obtained through the Atlassian
Marketplace, which handles all billing. Without one you can still estimate and keep drafts — you
just cannot write the estimates into Jira. Your drafts are never deleted by a licence change.

## Documentation

- **[User guide](/guide/)** — setup, every feature, and troubleshooting.
- **[Privacy policy](/privacy/)** — what the app processes, and what it deliberately does not.
- **[Terms of use](/terms/)** — licensing, responsibilities, warranty and liability.

Site administrators: the app needs one-time configuration of which Jira fields hold your estimates.
The user guide covers it, including the auto-detect helper.

## Contact

Questions, bug reports, and feature requests: **[support@dsplugins.dev](mailto:support@dsplugins.dev)**

Support is provided on a reasonable-effort basis. There is no guaranteed response time — see the
[terms of use](/terms/).
