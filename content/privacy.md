# Scope Planner — Privacy Policy

_Last updated: 16 October 2026_

Scope Planner is a Jira Cloud app built on Atlassian Forge. It runs entirely on Atlassian's
infrastructure and has **no servers, storage, or network egress outside Atlassian**. The app's
manifest declares no external permissions, so the Forge platform itself blocks any outbound call —
this is enforced by Atlassian, not merely promised by us.

**In short:** the app stores your estimation drafts and preferences inside your own Atlassian site,
identifies people only by their Atlassian account ID, sends nothing anywhere, uses no analytics or
cookies, and deletes a person's private data automatically when their Atlassian account is deleted.

## Who we are

Scope Planner is developed and published on the Atlassian Marketplace by **DSPlugins** ("we",
"the developer"). Contact: **support@dsplugins.dev**.

## Roles

For data protection purposes, the customer operating the Atlassian site remains the **controller**
of all data the app touches. Atlassian hosts and processes that data on its infrastructure under
the customer's existing agreements with Atlassian. The developer operates no infrastructure of its
own and receives no copies of customer data.

## What data the app processes

* **Jira issue data** (summaries, estimates, sprints, boards, assignees, labels, components) is
  read via Jira's APIs to display and update estimates. It is processed inside your Atlassian site
  and shown only to users who already have permission to see those issues. All reads and writes
  execute **as the acting user**, so Jira's own permission scheme always applies.
* **Estimation drafts** you create are stored in Atlassian Forge hosted storage, scoped to your
  Jira site. A draft contains issue keys, estimate values, the JQL text defining the scope,
  timestamps, an optional **name** you may give it, and the Atlassian **account ID** of its author.
  The JQL text and the name are stored **exactly as you type them**, so they hold whatever you put
  in them — see "What the app does NOT do" below.
* **Team (shared) drafts and publish records** additionally store the account ID of the user who
  last shared, merged into or published them, so teammates can see attribution. Where the app
  shows that person — "Shared by …" on the copy screen, "Updated by …" beside a team draft — it
  resolves the account ID to a **display name** by asking Jira **as you**, so you only ever see
  names you already have permission to see. The name is displayed, never stored.
* **A team draft also stores the Jira project keys its scope touches.** These are derived by the
  app itself when you share the draft, by running your scope's query **as you**, and they are what
  decide who may see the draft afterwards (see below). They are project identifiers, not personal
  data.
* **User preferences** (estimation scales, column visibility, target velocity) are stored per
  account ID.
* **Site settings** (which Jira fields hold estimates, default scales, how long drafts are kept)
  are stored once per site and can be changed only by Jira administrators. They contain no personal
  data.
* **A short-lived permissions cache** records, per account ID and for five minutes, which Jira
  projects that account may browse. It holds project keys only and is deleted along with everything
  else when an account is erased.
* **Velocity figures** (Pro): auto-calculated sprint velocity is derived from closed sprints and
  cached in Forge storage per board for up to 6 hours. The cache holds aggregate numbers only — no
  issue content and no personal data.
* **Estimation history** (Pro) is read live from Jira issue changelogs each time it is shown. The
  app does **not** store estimation history itself.
* **License status** — the app receives from Atlassian only whether the site's subscription is
  active or in trial. Billing runs entirely through the Atlassian Marketplace; the app and its
  developer never see payment details, invoices, or billing contacts.

### Who can see a team draft

**Anyone who can browse every Jira project the draft's scope touches.** They do not have to have
opened that scope, and they do not have to have a draft of their own.

⚠️ **What this widens is the scope description, and it is worth being explicit about.** Sharing a
draft makes its **name** and its **JQL text** — both free text you typed — readable by that whole
group, not only by people who had already worked on the scope. The app tells you this on the
review screen before you share.

Two things are unchanged:

* **Private drafts remain private.** They are stored under a key containing your own account ID and
  are unreadable by anyone else, at any layer.
* **Issue data is still governed by Jira.** Every read runs as the acting user, so being able to see
  that a draft exists never grants sight of an issue you could not already open.

Because a JQL string can name a person (`assignee = "alex@example.com"`), the retention period is
the control that limits how long that text is exposed — see "Data retention and deletion" below.

## What the app does NOT do

* No data ever leaves Atlassian's infrastructure — the app declares no external network
  permissions, so the platform itself blocks outbound calls.
* No display names or avatars are stored — the app identifies people by Atlassian account ID
  only, and display names are fetched live from Jira when shown. One exception is worth stating
  plainly: the **JQL text is stored exactly as you typed it**, so if you write a person's name or
  email address into a filter (for example `assignee = "alex@example.com"`), that text is stored
  with the draft or publish record until it expires or is deleted.
* No analytics, tracking, cookies, or advertising.
* No sale or sharing of any data with third parties, and no use of your data to train AI models.
* No issue content in logs. Application logs available to the developer for troubleshooting
  contain technical diagnostics only (and, for GDPR processing records, the account ID being
  deleted or anonymized) — never issue summaries, estimates, or other Jira content.

## CSV export (Pro)

The CSV export is generated inside your own browser and saved directly to your device when you
explicitly request it. The app transmits nothing anywhere in the process; what you then do with
the exported file is under your control and your organisation's policies.

## Sub-processors

**Atlassian** is the only party that hosts or processes data for the app: Forge compute, Forge
hosted storage and the Jira APIs, under your organisation's agreements with Atlassian. The developer
uses no other sub-processor, hosting provider or service.

## Data retention and deletion

* Private drafts, team drafts and publish records all expire automatically on the same
  administrator-configurable clock (30 days by default). A **private** draft can also be deleted
  at any time by its owner, and only by its owner. A **team** draft is a team object and can be
  deleted from within the app by any user who can see it, not only the person who shared it.
* Publish records are additionally overwritten by any subsequent publish of the same scope.
* The velocity cache expires after at most 6 hours; the permissions cache after 5 minutes.
* When an Atlassian account is deleted or anonymized, the app's GDPR handlers automatically
  delete that user's private data (drafts, preferences, and the permissions cache described above)
  and anonymize their account ID in any team or published records. A team draft is not deleted with
  its author's account — it belongs to the team — so the free text inside it (its name, its JQL) is
  limited by the retention period rather than by erasure.
* Uninstalling the app removes its Forge storage per Atlassian's platform policy.

## Data residency

All data the app stores lives in Atlassian Forge hosted storage, so it follows the data residency
location of your Atlassian site, and moves with it if your site's data is migrated to another
location. The app stores no data anywhere else.

**In scope for data residency:** private drafts, team drafts, publish records, user preferences,
site settings, the velocity cache and the permissions cache — that is, everything listed under
"What data the app processes" that the app stores. **Out of scope:** nothing the app stores is out
of scope. Two things the app does not store sit outside it: Jira issue data itself, held by Jira
under Jira's own data residency; and the app's Forge logs — technical diagnostics only and, for GDPR
processing records, the account ID being deleted or anonymized (see "What the app does NOT do") —
which Atlassian keeps in its own logging, and for which the app makes no data residency commitment.

## Security

* The app runs only on Atlassian Forge and calls only your own Jira site's APIs; outbound network
  access is blocked by the platform.
* Every Jira read and write runs with the acting user's own Jira permissions, so the app cannot be
  used to see or change anything that user could not see or change in Jira directly.
* The app's site settings can be changed only by Jira administrators; the server rejects anyone
  else.
* To report a security issue, write to the contact below. We acknowledge reports and fix
  confirmed vulnerabilities as a priority.

## Permissions

The app requests the minimum Jira scopes needed to read issues, boards, and sprints, write
estimate fields, and store drafts (`read:jira-work`, `write:jira-work`, `read:jira-user`,
`read:board-scope:jira-software`, `read:board-scope.admin:jira-software`, `read:project:jira`,
`read:sprint:jira-software`, `storage:app`). All Jira writes happen **as the acting user**, so
Jira's own permission scheme always applies.

`read:board-scope.admin:jira-software` is used for a single read: the app compares the board's own
estimation field against the field an administrator configured, so it can warn you when the two
disagree. It reads board configuration only — no issue content, no user data, and nothing is
written with it.

## Your rights

Because your organisation is the controller, requests to access, correct, export or erase personal
data are best made to your Jira site administrator, who has control over your Atlassian site and
the accounts on it. Deleting or anonymizing an Atlassian account triggers the app's automatic
erasure described above. You can also delete your own private drafts at any time from the app's
**🗂 Drafts** screen. If you need help with a request, contact us.

The app is a business tool for Jira users and is not directed at children.

## Changes to this policy

This policy may be updated when the app's functionality changes. The "Last updated" date above
reflects the current revision; material changes will be noted in the app's release notes on the
Atlassian Marketplace. Continued use of the app after a change constitutes acceptance of the
updated policy.

## Contact

Questions about this policy or your data: **support@dsplugins.dev**
