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

The site's own domain is **`dsplugins.dev`** (bought 2026-10-11). Until its DNS is in place it is
served at `https://dsplugins.github.io`, which redirects to the custom domain once that is set.

| Page | URL |
| :-- | :-- |
| Landing | `https://dsplugins.dev/` |
| User guide | `https://dsplugins.dev/guide/` |
| Support | `https://dsplugins.dev/support/` — hours and the first-reply target; the Marketplace profile's *Support Channels* link and *Hours of Operation* SLA link point here |
| **Privacy policy** | `https://dsplugins.dev/privacy/` |
| **Terms of use** | `https://dsplugins.dev/terms/` |

The two in bold are the ones the listing form asks for; the guide is the listing's required
documentation URL.

## First-time setup — done

The `dsplugins` GitHub account (a personal account, not an organization) and this public repo
exist, Pages publishes from **GitHub Actions**, and the four pages have served at
`https://dsplugins.github.io` since 2026-10-08.

## Custom domain `dsplugins.dev`

In this order — GitHub's own advice, so that no other repository can claim the domain in between:

1. **Verify the domain for the account:** signed in as `dsplugins`, `https://github.com/settings/pages`
   → *Add a domain* → `dsplugins.dev`; add the TXT record GitHub shows at the registrar; *Verify*.
2. **Set it on this repo:** Settings → Pages → *Custom domain* = `dsplugins.dev` → Save. No `CNAME`
   file: with an Actions workflow GitHub ignores one and takes the domain from the setting.
3. **DNS at the registrar:**

   | Type | Name | Value |
   | :-- | :-- | :-- |
   | A | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (four records) |
   | AAAA | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` (four records) |
   | CNAME | `www` | `dsplugins.github.io` |

   No proxying (Cloudflare's orange cloud off) — GitHub must issue the certificate itself.
4. When Settings → Pages shows the DNS check passing, tick **Enforce HTTPS** (up to 24 h). `.dev` is
   HSTS-preloaded: browsers refuse plain HTTP, so the site is unreachable on the domain until the
   certificate exists.
5. Open the URLs above in a private window.

The mail records (MX, SPF, DKIM, DMARC) for `support@dsplugins.dev` live on the same domain — see
the app repo's `docs/PUBLISHING.md` step 2Г. They do not conflict with the records above.

## Editing

**The app repo is the source of truth for privacy, terms and the user guide.** Edit them there,
then:

```bash
bash sync.sh /path/to/scope-planner   # copies PRIVACY.md, TERMS.md, docs/USER_GUIDE.md
npm run build                         # renders content/ → public/
git add -A && git commit -m "docs: sync policies from app repo"
```

The landing page (`content/index.html`) has no upstream — edit it here. It is hand-written HTML,
a body fragment the build wraps in the site layout, because its sections (hero, feature rows, plans,
FAQ) do not fit Markdown. Its wording follows the app repo's `docs/branding/listing-copy.md`: every
claim a shipped feature, named as on screen.

⚠️ **`content/index.html` states the free/Pro feature split** — the *Free and Pro* section and every
`badge-pro`. It must match `TERMS.md` §2 and what the app actually gates server-side. Getting this
wrong tells buyers a paid feature is free; it happened once already and was caught before listing.

## Screenshots

The hero's product picture is drawn in HTML/CSS. Everything below it — the three feature rows and
the *See it in Jira* gallery — is **real screenshots** in `assets/static/shots/`, cut by
`shots.mjs` from the app repo's raw listing captures (`scripts/listing-assets/.work/raw/`, using
the regions in its `specs.json`), without the listing's framing:

```bash
node shots.mjs /path/to/scope-planner   # → assets/static/shots/*.webp (lossless, 2×)
npm run build
```

Re-run after the listing is re-captured. The gallery's captions are `listing-copy.md` §3, verbatim.

**These captures show the demo teammates' avatars — Unsplash portraits of real people** (the app
repo's `docs/MARKETPLACE.md` §6a has their provenance). The app repo keeps them out of its own git
on purpose; publishing them here, in a public repo, was **the owner's decision on 2026-10-16**:
the Unsplash License covers the use, the faces render at ~24 px, and the same images are public in
the Marketplace listing anyway. If that changes, swapping the avatars for generated portraits and
re-capturing (§6a, option 3) cleans the listing and this site together.

## How the build works

`public/` is **committed**, and the `pages` CI job only publishes it. That is deliberate: a build
requiring npm at deploy time is a build that can take the privacy policy offline during a review.
The `check:site` job re-renders and diffs, so committed output cannot drift from `content/`.

`build.mjs` rewrites every `.md` link through `LINK_MAP` (the sources link to each other by
filename, and those filenames do not exist here) and **fails the build** on an unmapped one rather
than shipping a dead link. It emits no external requests — no CDN, no web fonts, no analytics, no
scripts. The privacy policy promises no tracking, so the page saying so must not load a tracker;
the site footer says so too.

The Markdown pages are rendered unchanged; the layout only adds GitHub-compatible heading ids with
hover anchors, an *On this page* index built from the `##` headings (a sticky sidebar on wide
screens, a collapsed `<details>` on narrow ones), and a framed scroll box around tables. A
`_Last updated: …_` line directly under the title moves into the page header.

`assets/style.css` is the whole design: colour tokens with a dark scheme, then components. Files in
`assets/static/` are copied to `/assets/` — the favicon (the partner mark) and `og-banner.png`, the
social-preview image (a copy of the app repo's `docs/branding/banner-1120x548.png`). Asset URLs are
absolute, because Pages serves `404.html` at whatever depth the missing path was.

```bash
npm install
npm run build     # → public/
npm run serve     # → http://localhost:8137
```

## Contact address

**`support@dsplugins.dev` is the only contact address on the published site** (since 2026-10-12) —
the same address the listing, the policies and the guide give. Atlassian refuses a Gmail address for
a paid app, mixing addresses across the listing, the policies and the site looks careless to a
reviewer, and no personal address belongs on a public storefront.

`dsplugins@gmail.com` remains only as a login: the GitHub account that owns this repo, and so the git
commit metadata here, since this repo is public. It must not reappear in `content/` or `build.mjs`.

## Still to do

- Link the Marketplace listing from the landing page once it is approved and has a public URL.
