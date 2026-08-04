# dsplugins.github.io

Public site for **dsplugins**: the Scope Planner landing page, user guide, privacy policy and terms
of use. Static, self-contained, served by GitHub Pages.

It exists because the Atlassian Marketplace listing **requires a public Privacy Policy URL** (and
either a Terms/EULA URL or acceptance of Atlassian's standard EULA). Those documents live in the
private app repo; this repo is how they become publicly reachable.

## Why this is a separate repo

The app repo is private and should stay that way. Pages served from a private repo is not publicly
readable — on GitHub it needs a paid plan and stays visibility-restricted — which would make the
policy URLs unreachable for an Atlassian reviewer, the opposite of the requirement. A public repo
avoids that failure mode entirely, and a repo named `<namespace>.github.io` serves at the namespace
root.

## Published URLs

| Page | URL |
| :-- | :-- |
| Landing | `https://dsplugins.github.io/` |
| User guide | `https://dsplugins.github.io/guide/` |
| **Privacy policy** | `https://dsplugins.github.io/privacy/` |
| **Terms of use** | `https://dsplugins.github.io/terms/` |

The two in bold are the ones the listing form asks for.

## First-time setup

1. Create a GitHub organization named `dsplugins`.
2. Inside it create a **public** repo named exactly `dsplugins.github.io`, empty.
3. Push this repo to it (`main` is the default branch).
4. Settings → Pages → **Source: GitHub Actions**. Wait for the `Pages` workflow to go green.
5. Open the four URLs above and check they load in a private browser window — signed out is the
   state a Marketplace reviewer will be in.

## Editing

**The app repo is the source of truth for privacy, terms and the user guide.** Edit them there,
then:

```bash
bash sync.sh /path/to/scope-planner   # copies PRIVACY.md, TERMS.md, docs/USER_GUIDE.md
npm run build                         # renders content/ → public/
git add -A && git commit -m "docs: sync policies from app repo"
```

The landing page (`content/index.md`) has no upstream — edit it here.

⚠️ **`content/index.md` states the free/Pro feature split.** It must match `TERMS.md` §2 and what
the app actually gates server-side. Getting this wrong tells buyers a paid feature is free; it
happened once already and was caught before listing.

## How the build works

`public/` is **committed**, and the `pages` CI job only publishes it. That is deliberate: a build
requiring npm at deploy time is a build that can take the privacy policy offline during a review.
The `check:site` job re-renders and diffs, so committed output cannot drift from `content/`.

`build.mjs` rewrites every `.md` link through `LINK_MAP` (the sources link to each other by
filename, and those filenames do not exist here) and **fails the build** on an unmapped one rather
than shipping a dead link. It emits no external requests — no CDN, no web fonts, no analytics.
The privacy policy promises no tracking, so the page saying so must not load a tracker.

```bash
npm install
npm run build     # → public/
npm run serve     # → http://localhost:8137
```

## Contact address

**`dsplugins@gmail.com` is the only email address that may appear anywhere in this repo or the
published site** — it matches the Atlassian vendor account that owns the app. No personal address
belongs on a public storefront, and mixing addresses across the listing, the policies and the site
looks careless to a reviewer. That includes git commit metadata here, since this repo is public.

## Still to do

- Link the Marketplace listing from the landing page once it is approved and has a public URL.
