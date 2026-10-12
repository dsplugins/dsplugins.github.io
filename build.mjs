#!/usr/bin/env node
/**
 * Renders content/*.md into public/ as a small static site for GitLab Pages.
 *
 * Design notes, because two of these pages are legal documents:
 *
 *  - `public/` is COMMITTED, and the Pages job only publishes it. A build that needs the network
 *    at deploy time is a build that can 404 your privacy policy during an Atlassian review.
 *    `npm run check` in CI re-renders and diffs, so committed output can't silently drift.
 *  - Every `.md` link in the sources is rewritten via LINK_MAP, and an unmapped one is a BUILD
 *    FAILURE rather than a dead link shipped to a reviewer. The sources live in the app repo and
 *    link to each other by filename; those filenames don't exist here.
 *  - No external requests in the output: no CDN, no fonts, no analytics. The privacy policy
 *    promises no tracking, so the page that says so must not load a tracker.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';

const ROOT = dirname(fileURLToPath(import.meta.url));
const CONTENT = join(ROOT, 'content');
const OUT = join(ROOT, 'public');

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

/** content file → output dir, nav label, and whether it appears in the nav. */
const PAGES = [
  { src: 'index.md', out: '.', label: 'Home', nav: true },
  { src: 'guide.md', out: 'guide', label: 'User guide', nav: true },
  { src: 'privacy.md', out: 'privacy', label: 'Privacy', nav: true },
  { src: 'terms.md', out: 'terms', label: 'Terms', nav: true },
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

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** First `# heading` becomes <title>; it is not duplicated into a meta description. */
function extractTitle(source, fallback) {
  const m = source.match(/^#\s+(.+?)\s*$/m);
  return m ? m[1].replace(/[*_`]/g, '') : fallback;
}

function layout({ title, bodyHtml, here, depth }) {
  const base = depth === 0 ? '' : '../'.repeat(depth);
  const nav = PAGES.filter((p) => p.nav)
    .map((p) => {
      const href = p.out === '.' ? '/' : `/${p.out}/`;
      const current = p.out === here;
      return current
        ? `<a href="${href}" aria-current="page">${p.label}</a>`
        : `<a href="${href}">${p.label}</a>`;
    })
    .join('\n        ');
  const year = new Date().getUTCFullYear();
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<link rel="stylesheet" href="${base}style.css">
</head>
<body>
  <header class="site">
    <a class="brand" href="/">dsplugins</a>
    <nav>
        ${nav}
    </nav>
  </header>
  <main>
${bodyHtml}
  </main>
  <footer class="site">
    <p>&copy; ${year} dsplugins &middot; <a href="/privacy/">Privacy</a> &middot;
       <a href="/terms/">Terms</a> &middot;
       <a href="mailto:support@dsplugins.dev">support@dsplugins.dev</a></p>
    <p class="fineprint">Scope Planner is a Jira Cloud app built on Atlassian Forge. Jira and
       Atlassian are trademarks of Atlassian Pty Ltd, used here only to identify the platform the
       app runs on.</p>
  </footer>
</body>
</html>
`;
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const known = new Set(PAGES.map((p) => p.src));
for (const f of readdirSync(CONTENT)) {
  if (f.endsWith('.md') && !known.has(f)) {
    console.error(`✗ content/${f} is not listed in PAGES — it would not be published.`);
    process.exit(1);
  }
}

for (const page of PAGES) {
  const source = readFileSync(join(CONTENT, page.src), 'utf8');
  const bodyHtml = md.render(source, { page: page.src });
  const title = extractTitle(source, 'dsplugins');
  const dir = page.out === '.' ? OUT : join(OUT, page.out);
  mkdirSync(dir, { recursive: true });
  writeFileSync(
    join(dir, 'index.html'),
    layout({ title, bodyHtml, here: page.out, depth: page.out === '.' ? 0 : 1 }),
  );
}

if (unmapped.length) {
  console.error('✗ Unmapped .md links — add them to LINK_MAP in build.mjs:');
  for (const u of unmapped) console.error(`    ${u.page} → ${u.href}`);
  process.exit(1);
}

writeFileSync(join(OUT, 'style.css'), readFileSync(join(ROOT, 'assets', 'style.css')));
// Pages serves 404.html for unknown paths.
writeFileSync(
  join(OUT, '404.html'),
  layout({
    title: 'Not found — dsplugins',
    bodyHtml: '    <h1>Not found</h1>\n    <p>That page does not exist. Try the navigation above.</p>',
    here: null,
    depth: 0,
  }),
);

console.log(`✓ built ${PAGES.length} pages + 404 into public/`);
