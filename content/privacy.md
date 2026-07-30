# Scope Planner — Privacy Policy

_Last updated: 28 July 2026_

Scope Planner is a Jira Cloud app built on Atlassian Forge. It runs entirely on Atlassian's
infrastructure and has **no servers, storage, or network egress outside Atlassian**. The app's
manifest declares no external permissions, so the Forge platform itself blocks any outbound call —
this is enforced by Atlassian, not merely promised by us.

## Roles

For data protection purposes, the customer operating the Atlassian site remains the **controller**
of all data the app touches. Atlassian hosts and processes that data on its infrastructure under
the customer's existing agreements with Atlassian. The app's developer operates no infrastructure
of their own and receives no copies of customer data.

## What data the app processes

* **Jira issue data** (summaries, estimates, sprints, boards, assignees, labels, components) is
  read via Jira's APIs to display and update estimates. It is processed inside your Atlassian site
  and shown only to users who already have permission to see those issues. All reads and writes
  execute **as the acting user**, so Jira's own permission scheme always applies.
* **Estimation drafts** you create are stored in Atlassian Forge hosted storage, scoped to your
  Jira site. A draft contains issue keys, estimate values, the JQL text defining the scope,
  timestamps, and the Atlassian **account ID** of its author.
* **Shared drafts and publish records** additionally store the account ID of the user who shared
  or published them, so teammates can see attribution.
* **User preferences** (estimation scales, column visibility, target velocity) are stored per
  account ID.
* **Velocity figures** (Pro): auto-calculated sprint velocity is derived from closed sprints and
  cached in Forge storage per board for up to 6 hours. The cache holds aggregate numbers only —
  no issue content and no personal data.
* **Estimation history** (Pro) is read live from Jira issue changelogs each time it is shown.
  The app does **not** store estimation history itself.
* **License status** — the app receives from Atlassian only whether the site's subscription is
  active or in trial. Billing runs entirely through the Atlassian Marketplace; the app and its
  developer never see payment details, invoices, or billing contacts.

## What the app does NOT do

* No data ever leaves Atlassian's infrastructure — the app declares no external network
  permissions, so the platform itself blocks outbound calls.
* No names, email addresses, or avatars are stored — only Atlassian account IDs. Display names
  are fetched live from Jira when shown.
* No analytics, tracking, cookies, or advertising.
* No sharing of any data with third parties.
* No issue content in logs. Application logs available to the developer for troubleshooting
  contain technical diagnostics only (and, for GDPR processing records, the account ID being
  deleted or anonymized) — never issue summaries, estimates, or other Jira content.

## CSV export (Pro)

The CSV export is generated inside your own browser and saved directly to your device when you
explicitly request it. The app transmits nothing anywhere in the process; what you then do with
the exported file is under your control and your organisation's policies.

## Data retention and deletion

* Private and shared drafts expire automatically (administrator-configurable, 30 days by
  default) and can be deleted by their owners at any time from within the app.
* Publish records are overwritten by subsequent publishes of the same scope.
* The velocity cache expires automatically after at most 6 hours.
* When an Atlassian account is deleted or anonymized, the app's GDPR handlers automatically
  delete that user's private data (drafts, preferences) and anonymize their account ID in any
  shared or published records.
* Uninstalling the app removes its Forge storage per Atlassian's platform policy.

## Data residency

Because all app data lives in Atlassian Forge hosted storage, it follows the data-residency
behaviour of the host Atlassian site as provided by the Forge platform.

## Permissions

The app requests the minimum Jira scopes needed to read issues, boards, and sprints, write
estimate fields, and store drafts (`read:jira-work`, `write:jira-work`, `read:jira-user`,
`read:board-scope:jira-software`, `read:project:jira`, `read:sprint:jira-software`,
`storage:app`). All Jira writes happen **as the acting user**, so Jira's own permission scheme
always applies.

## Changes to this policy

This policy may be updated when the app's functionality changes. The "Last updated" date above
reflects the current revision; material changes will be noted in the app's release notes on the
Atlassian Marketplace. Continued use of the app after a change constitutes acceptance of the
updated policy.

## Contact

Questions about this policy or your data: **dsplugins@gmail.com**
