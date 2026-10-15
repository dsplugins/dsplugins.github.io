#!/usr/bin/env node
/**
 * Renders content/ into public/ as a small static site for GitHub Pages.
 *
 * Design notes, because two of these pages are legal documents:
 *
 *  - `public/` is COMMITTED, and the Pages job only publishes it. A build that needs the network
 *    at deploy time is a build that can 404 your privacy policy during an Atlassian review.
 *    The `check` CI job re-renders and diffs, so committed output can't silently drift.
 *  - Every `.md` link in the sources is rewritten via LINK_MAP, and an unmapped one is a BUILD
 *    FAILURE rather than a dead link shipped to a reviewer. The sources live in the app repo and
 *    link to each other by filename; those filenames don't exist here.
 *  - No external requests in the output: no CDN, no fonts, no analytics, no scripts. The privacy
 *    policy promises no tracking, so the page that says so must not load a tracker.
 *  - The landing page is `content/index.html`, a hand-written body fragment: its sections do not
 *    fit Markdown. The other pages are Markdown synced from the app repo (`sync.sh`) and are
 *    rendered unchanged — the layout only adds heading anchors and an "On this page" index.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';

const ROOT = dirname(fileURLToPath(import.meta.url));
const CONTENT = join(ROOT, 'content');
const ASSETS = join(ROOT, 'assets');
const OUT = join(ROOT, 'public');
const ORIGIN = 'https://dsplugins.dev';

/** Source filename → published path. Extend when a page is added. */
const LINK_MAP = {
  'PRIVACY.md': '/privacy/',
  '../PRIVACY.md': '/privacy/',
  'TERMS.md': '/terms/',
  '../TERMS.md': '/terms/',
  'USER_GUIDE.md': '/guide/',
  'docs/USER_GUIDE.md': '/guide/',
  '../docs/USER_GUIDE.md': '/guide/',
};

/**
 * content file → output dir, nav label, <title>, meta description, and the eyebrow shown above a
 * document's heading. `title` is optional for Markdown pages: their first `# heading` is used.
 */
const PAGES = [
  {
    src: 'index.html',
    out: '.',
    label: 'Scope Planner',
    title: 'Scope Planner – Bulk Sprint Estimation for Jira | DSPlugins',
    description:
      'Estimate a whole sprint on one screen, review exactly what will change, then publish every estimate to Jira in one pass. Runs on Atlassian Forge: no external servers, no data egress, no tracking.',
  },
  {
    src: 'guide.md',
    out: 'guide',
    label: 'User guide',
    eyebrow: 'Documentation',
    description:
      'Scope Planner user guide: setup, the estimation table, drafts, Sprint Preview, publishing, licensing and troubleshooting.',
  },
  {
    src: 'support.md',
    out: 'support',
    label: 'Support',
    eyebrow: 'Help',
    description:
      'Scope Planner support: email support@dsplugins.dev, support hours, the first-reply target and what to include in a message.',
  },
  {
    src: 'privacy.md',
    out: 'privacy',
    label: 'Privacy',
    eyebrow: 'Legal',
    description:
      'Scope Planner privacy policy: what the app processes, where it is stored, and what it deliberately does not do.',
  },
  {
    src: 'terms.md',
    out: 'terms',
    label: 'Terms',
    eyebrow: 'Legal',
    description: 'Scope Planner terms of use: licensing, responsibilities, warranty and liability.',
  },
];

const md = new MarkdownIt({ html: false, linkify: true, typographer: true });

// Rewrite .md hrefs at the token level — safer than regexing rendered HTML, and it lets an
// unmapped link fail loudly instead of shipping.
const unmapped = [];
const defaultLinkOpen =
  md.renderer.rules.link_open ||
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const hrefIndex = token.attrIndex('href');
  if (hrefIndex >= 0) {
    const href = token.attrs[hrefIndex][1];
    if (/\.md($|[#?])/i.test(href)) {
      const [path, hash = ''] = href.split(/(?=[#?])/);
      const mapped = LINK_MAP[path];
      if (mapped) {
        token.attrs[hrefIndex][1] = mapped + hash;
      } else {
        unmapped.push({ page: env.page, href });
      }
    }
  }
  return defaultLinkOpen(tokens, idx, options, env, self);
};

/**
 * GitHub-compatible heading slugs, so a `#section` link written against the source on GitHub or
 * GitLab still lands here: lowercase, drop everything but letters, digits, spaces and hyphens,
 * then spaces → hyphens. Duplicates get `-1`, `-2`, … like GitHub's.
 */
function slugify(text, seen) {
  const base = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s/g, '-');
  let slug = base || 'section';
  for (let n = 1; seen.has(slug); n += 1) slug = `${base}-${n}`;
  seen.add(slug);
  return slug;
}

// Give h2/h3 an id and a hover anchor, and collect the h2s into env.toc for the page index.
md.core.ruler.push('heading_ids', (state) => {
  const seen = new Set();
  const toc = [];
  const { tokens } = state;
  for (let i = 0; i < tokens.length; i += 1) {
    const t = tokens[i];
    if (t.type !== 'heading_open' || (t.tag !== 'h2' && t.tag !== 'h3')) continue;
    const inline = tokens[i + 1];
    const text = inline.children
      .filter((c) => c.type === 'text' || c.type === 'code_inline')
      .map((c) => c.content)
      .join('');
    const id = slugify(text, seen);
    t.attrSet('id', id);
    t.meta = { anchor: id };
    if (t.tag === 'h2') toc.push({ id, text: text.trim() });
  }
  state.env.toc = toc;
});
md.renderer.rules.heading_close = (tokens, idx, options, _env, self) => {
  const open = tokens[idx - 2];
  const anchor = open?.meta?.anchor
    ? `<a class="anchor" href="#${open.meta.anchor}" aria-label="Link to this section">#</a>`
    : '';
  return anchor + self.renderToken(tokens, idx, options);
};

// Wide tables scroll inside their own framed box; the page body never scrolls sideways.
md.renderer.rules.table_open = () => '<div class="table-wrap"><table>\n';
md.renderer.rules.table_close = () => '</table></div>\n';

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** First `# heading` of a Markdown page. */
function extractTitle(source, fallback) {
  const m = source.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].replace(/[*_`]/g, '') : fallback;
}

const hrefOf = (p) => (p.out === '.' ? '/' : `/${p.out}/`);

/**
 * The partner logo (app repo: docs/branding/partner-logo-144.svg), inlined so the header costs no
 * request. The aura is flattened to a translucent disc: a gradient needs an id, and the mark
 * appears twice per page. At 28px the difference is invisible.
 */
const PARTNER_MARK = `<svg class="mark" viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="14" fill="#0F172A"/>
        <circle cx="32" cy="32" r="19" fill="#FBBF24" opacity=".2"/>
        <g fill="#FBBF24"><circle cx="32" cy="32" r="11"/>${[0, 45, 90, 135, 180, 225, 270, 315]
          .map((a) => `<path d="M32,16.5 L30.2,6 A1.8,1.8 0 0 1 33.8,6 Z" transform="rotate(${a} 32 32)"/>`)
          .join('')}</g>
      </svg>`;

function layout({ page, title, description, mainHtml, here }) {
  const links = PAGES.map((p) => {
    const current = p.out === here ? ' aria-current="page"' : '';
    return `<a href="${hrefOf(p)}"${current}>${p.label}</a>`;
  });
  const year = new Date().getUTCFullYear();
  const canonical = page ? `${ORIGIN}${hrefOf(page)}` : null;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#4f46e5">
${canonical ? `<link rel="canonical" href="${canonical}">\n` : ''}<meta property="og:type" content="website">
<meta property="og:site_name" content="DSPlugins">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
${canonical ? `<meta property="og:url" content="${canonical}">\n` : ''}<meta property="og:image" content="${ORIGIN}/assets/og-banner.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css">
</head>
<body${here === '.' ? ' class="home"' : ''}>
  <a class="skip" href="#main">Skip to content</a>
  <header class="site">
    <div class="wrap bar">
      <a class="brand" href="/" aria-label="DSPlugins — home">
      ${PARTNER_MARK}
        <span>DSPlugins</span>
      </a>
      <nav class="nav" aria-label="Site">
        ${links.join('\n        ')}
      </nav>
      <a class="btn btn-sm header-cta" href="mailto:support@dsplugins.dev">Contact</a>
      <details class="menu">
        <summary aria-label="Menu"><span></span></summary>
        <nav aria-label="Site (mobile)">
          ${links.join('\n          ')}
          <a href="mailto:support@dsplugins.dev">support@dsplugins.dev</a>
        </nav>
      </details>
    </div>
  </header>
  <main id="main">
${mainHtml}
  </main>
  <footer class="site">
    <div class="wrap">
      <div class="foot-grid">
        <div class="foot-brand">
          <a class="brand" href="/">
          ${PARTNER_MARK}
            <span>DSPlugins</span>
          </a>
          <p>Focused apps for Jira Cloud that keep your data where it already lives. Built on
             Atlassian Forge — no external servers, no data egress, no tracking.</p>
        </div>
        <div>
          <h2>Product</h2>
          <a href="/">Scope Planner</a>
          <a href="/guide/">User guide</a>
          <a href="/#pricing">Free and Pro</a>
          <a href="https://www.youtube.com/watch?v=Fwu-1fwdugA" target="_blank" rel="noopener noreferrer">Demo video ↗</a>
        </div>
        <div>
          <h2>Help</h2>
          <a href="/support/">Support</a>
          <a href="mailto:support@dsplugins.dev">support@dsplugins.dev</a>
        </div>
        <div>
          <h2>Legal</h2>
          <a href="/privacy/">Privacy policy</a>
          <a href="/terms/">Terms of use</a>
        </div>
      </div>
      <div class="foot-base">
        <p>&copy; ${year} DSPlugins &middot; This site sets no cookies and loads nothing from
           anywhere else.</p>
        <p class="fineprint">Scope Planner is a Jira Cloud app built on Atlassian Forge. Jira and
           Atlassian are trademarks of Atlassian Pty Ltd, used here only to identify the platform the
           app runs on.</p>
      </div>
    </div>
  </footer>
</body>
</html>
`;
}

/** A synced Markdown document: a header band, an "On this page" index, then the prose. */
function documentMain({ page, bodyHtml, toc }) {
  let rest = bodyHtml;
  const h1 = rest.match(/^\s*<h1>([\s\S]*?)<\/h1>\n?/);
  const heading = h1 ? h1[1] : escapeHtml(page.label);
  if (h1) rest = rest.slice(h1[0].length);
  // "_Last updated: …_" directly under the heading belongs in the header band, not the prose.
  let meta = '';
  const updated = rest.match(/^\s*<p><em>(Last updated[^<]*)<\/em><\/p>\n?/);
  if (updated) {
    meta = `\n        <p class="doc-meta">${updated[1]}</p>`;
    rest = rest.slice(updated[0].length);
  }
  const tocList = `<ol>
            ${toc.map((t) => `<li><a href="#${t.id}">${escapeHtml(t.text)}</a></li>`).join('\n            ')}
          </ol>`;
  // Two copies of the index, one per breakpoint: a sticky sidebar that is always open, and a
  // collapsed <details> above the prose on narrow screens. One <details> cannot be open on one
  // and closed on the other without a script.
  const aside = toc.length
    ? `
      <aside class="toc" aria-label="On this page">
        <nav class="toc-side">
          <p class="toc-title">On this page</p>
          ${tocList}
        </nav>
        <details class="toc-fold">
          <summary>On this page</summary>
          ${tocList}
        </details>
      </aside>`
    : '';
  return `    <div class="doc-head">
      <div class="wrap">
        <p class="eyebrow">Scope Planner &middot; ${escapeHtml(page.eyebrow)}</p>
        <h1>${heading}</h1>${meta}
      </div>
    </div>
    <div class="wrap doc${toc.length ? '' : ' no-toc'}">${aside}
      <article class="prose">
${rest}
        <p class="to-top"><a href="#main">Back to top ↑</a></p>
      </article>
    </div>`;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const known = new Set(PAGES.map((p) => p.src));
for (const f of readdirSync(CONTENT)) {
  if (/\.(md|html)$/.test(f) && !known.has(f)) {
    console.error(`✗ content/${f} is not listed in PAGES — it would not be published.`);
    process.exit(1);
  }
}

for (const page of PAGES) {
  const source = readFileSync(join(CONTENT, page.src), 'utf8');
  let mainHtml;
  let title = page.title;
  if (page.src.endsWith('.html')) {
    mainHtml = source;
  } else {
    const env = { page: page.src };
    const bodyHtml = md.render(source, env);
    title ??= `${extractTitle(source, page.label)} | DSPlugins`;
    mainHtml = documentMain({ page, bodyHtml, toc: env.toc });
  }
  const dir = page.out === '.' ? OUT : join(OUT, page.out);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'index.html'),
    layout({ page, title, description: page.description, mainHtml, here: page.out }),
  );
}

if (unmapped.length) {
  console.error('✗ Unmapped .md links — add them to LINK_MAP in build.mjs:');
  for (const u of unmapped) console.error(`    ${u.page} → ${u.href}`);
  process.exit(1);
}

writeFileSync(join(OUT, 'style.css'), readFileSync(join(ASSETS, 'style.css')));
cpSync(join(ASSETS, 'static'), join(OUT, 'assets'), { recursive: true });
// Pages serves 404.html for unknown paths, at any depth — hence absolute asset URLs everywhere.
writeFileSync(
  join(OUT, '404.html'),
  layout({
    page: null,
    title: 'Page not found | DSPlugins',
    description: 'That page does not exist.',
    mainHtml: `    <section class="not-found wrap">
      <p class="eyebrow">Error 404</p>
      <h1>This page isn’t here.</h1>
      <p class="lede">The link may be old, or the address mistyped. These will get you back on track:</p>
      <div class="actions">
        <a class="btn" href="/">Scope Planner home</a>
        <a class="btn btn-ghost" href="/guide/">User guide</a>
        <a class="btn btn-ghost" href="/support/">Support</a>
      </div>
    </section>`,
    here: null,
  }),
);

console.log(`✓ built ${PAGES.length} pages + 404 into public/`);
