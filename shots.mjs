#!/usr/bin/env node
/**
 * Cuts the site's product screenshots out of raw captures.
 *
 *   node shots.mjs /path/to/scope-planner      (or SCOPE_PLANNER_PATH=… node shots.mjs)
 *
 * Two sets. The landing page's (assets/static/shots/) come straight from the app repo's listing
 * captures, region for region. The user guide's (assets/static/guide/) are closer crops of the
 * same captures plus three this repo takes itself with guide-capture.mjs (the admin page, Detect
 * Fields, the Scope Builder — into the gitignored .work/raw/); build.mjs places them in the guide.
 *
 * The app repo's listing pipeline (scripts/listing-assets/) captures the live demo board at 2×
 * into the gitignored `.work/raw/`, and `specs.json` names the region of each capture that its
 * listing images use. This takes the same regions, without the listing's framing and headline,
 * and writes them as lossless WebP at 2× into assets/static/shots/ — committed, like public/, so
 * the site never needs the app repo to build. Re-run after the listing assets are re-captured.
 *
 * Needs ImageMagick (`convert`) with WebP support. Lossless, because these are UI captures: at
 * the size of quality-80 lossy it keeps every edge of the text crisp. 2× only: a lossless 1×
 * copy came out about as heavy as the 2× (downscaling smooths the edges lossless compresses
 * well), so it would save nothing, and the screenshot viewer needs the 2× anyway.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, mkdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const APP = process.argv[2] || process.env.SCOPE_PLANNER_PATH || join(ROOT, '..', 'scope-planner');
const SPECS = join(APP, 'scripts', 'listing-assets', 'specs.json');
const RAW = join(APP, 'scripts', 'listing-assets', '.work', 'raw');
const OUT = join(ROOT, 'assets', 'static', 'shots');
const GUIDE_OUT = join(ROOT, 'assets', 'static', 'guide');
const SITE_RAW = join(ROOT, '.work', 'raw');
const SCALE = 2; // the raw captures are taken at deviceScaleFactor 2; spec regions are CSS px

/** The listing images the landing page shows — content/index.html refers to them by name. */
const WANT = [
  'highlight-1-whole-sprint',
  'highlight-2-review-before-jira',
  'highlight-3-spot-overload',
  'screenshot-1b-scales',
  'screenshot-1c-bulk',
  'screenshot-1d-breakdown',
  'screenshot-2c-team-draft',
  'screenshot-2d-publish',
  'screenshot-3b-velocity',
  'screenshot-3c-history',
  'screenshot-3d-csv-columns',
];

/**
 * The guide's crops: source capture and region in CSS px (every capture is 2×). `listing:` is the
 * app repo's scripts/listing-assets/.work/, `site:` is this repo's .work/raw/ (guide-capture.mjs).
 */
const GUIDE = [
  { name: 'sprint-menu', src: 'listing:probe-menu', region: { x: 230, y: 195, w: 715, h: 150 } },
  { name: 'admin-page', src: 'site:admin-page', region: { x: 360, y: 124, w: 790, h: 1290 } },
  { name: 'admin-detect', src: 'site:admin-detect', region: { x: 360, y: 124, w: 790, h: 640 } },
  { name: 'scope-builder', src: 'site:scope-builder', region: { x: 360, y: 228, w: 1120, h: 360 } },
  { name: 'sp-picker', src: 'listing:raw/h1-table', region: { x: 360, y: 740, w: 1120, h: 170 } },
  { name: 'status-bar', src: 'listing:raw/2b-draft', region: { x: 360, y: 228, w: 1120, h: 125 } },
  { name: 'drafts-screen', src: 'listing:raw/2e-drafts', region: { x: 360, y: 190, w: 1120, h: 215 } },
  { name: 'publish-result', src: 'listing:raw/2d-published', region: { x: 360, y: 190, w: 1120, h: 215 } },
  { name: 'overview', src: 'listing:raw/2b-draft', region: { x: 335, y: 55, w: 1185, h: 455 } },
  { name: 'time-cells', src: 'listing:raw/h1-table', region: { x: 1035, y: 390, w: 445, h: 230 } },
  { name: 'draft-rows', src: 'listing:raw/h1-table', region: { x: 360, y: 410, w: 1120, h: 320 } },
  { name: 'publish-flow', src: 'listing:raw/h2-preview', region: { x: 360, y: 205, w: 1120, h: 100 } },
  { name: 'drafts-visibility', src: 'listing:raw/2e-drafts', region: { x: 360, y: 190, w: 1120, h: 105 } },
  { name: 'share-button', src: 'listing:raw/h1-table', region: { x: 1120, y: 228, w: 360, h: 100 } },
  { name: 'copy-team', src: 'listing:raw/2c-team', region: { x: 360, y: 205, w: 1120, h: 150 } },
  { name: 'team-updated', src: 'listing:raw/2c-team', region: { x: 360, y: 250, w: 480, h: 45 } },
  { name: 'export-csv', src: 'listing:raw/h1-table', region: { x: 360, y: 320, w: 680, h: 45 } },
  { name: 'pro-badges', src: 'listing:raw/h3-workload', region: { x: 360, y: 293, w: 1120, h: 235 } },
  { name: 'retention', src: 'site:admin-page', region: { x: 360, y: 1060, w: 790, h: 170 } },
  { name: 'on-no-screen', src: 'site:admin-detect', region: { x: 420, y: 360, w: 700, h: 370 } },
  // Two crops stacked, to set one copy beside the other.
  { name: 'private-vs-team', parts: [
    { src: 'listing:raw/2b-draft', region: { x: 360, y: 228, w: 1120, h: 95 } },
    { src: 'listing:raw/2c-team', region: { x: 360, y: 205, w: 1120, h: 95 } },
  ] },
  { name: 'delete-faces', parts: [
    { src: 'listing:raw/h2-preview', region: { x: 800, y: 205, w: 680, h: 50 } },
    { src: 'listing:raw/2d-publish', region: { x: 800, y: 205, w: 680, h: 50 } },
  ] },
];

if (!existsSync(SPECS) || !existsSync(RAW)) {
  console.error(`✗ No listing captures under ${APP}`);
  console.error('  usage: node shots.mjs /path/to/scope-planner — after its scripts/listing-assets/ capture');
  process.exit(1);
}

const specs = new Map(JSON.parse(readFileSync(SPECS, 'utf8')).map((s) => [s.name, s]));
mkdirSync(OUT, { recursive: true });

for (const name of WANT) {
  const spec = specs.get(name);
  if (!spec) {
    console.error(`✗ ${name} is not in ${SPECS}`);
    process.exit(1);
  }
  const { x, y, w, h } = spec.region;
  const src = join(RAW, `${spec.raw}.png`);
  const crop = `${w * SCALE}x${h * SCALE}+${x * SCALE}+${y * SCALE}`;
  const webp = ['-define', 'webp:lossless=true', '-define', 'webp:method=6'];
  const out = join(OUT, `${name}.webp`);
  execFileSync('convert', [src, '-crop', crop, '+repage', '-strip', ...webp, out]);
  console.log(`✓ ${name}.webp — ${w}×${h} CSS px, ${Math.round(statSync(out).size / 1024)} KB`);
}

mkdirSync(GUIDE_OUT, { recursive: true });
const capture = (name, src) => {
  const [where, file] = src.split(':');
  const path = where === 'site' ? join(SITE_RAW, `${file}.png`) : join(APP, 'scripts', 'listing-assets', '.work', `${file}.png`);
  if (!existsSync(path)) {
    console.error(`✗ ${name}: no capture at ${path}` + (where === 'site' ? ' — run guide-capture.mjs first' : ''));
    process.exit(1);
  }
  return path;
};
const cropArgs = (path, { x, y, w, h }) => [path, '-crop', `${w * SCALE}x${h * SCALE}+${x * SCALE}+${y * SCALE}`, '+repage'];
const WEBP = ['-strip', '-define', 'webp:lossless=true', '-define', 'webp:method=6'];

for (const { name, src, region, parts } of GUIDE) {
  const out = join(GUIDE_OUT, `${name}.webp`);
  if (parts) {
    // Each crop in its own group, a white 24px (CSS) band between them, stacked top to bottom.
    const w = parts[0].region.w;
    const args = [];
    parts.forEach((part, i) => {
      if (i) args.push('(', '-size', `${w * SCALE}x${24 * SCALE}`, 'xc:white', ')');
      args.push('(', ...cropArgs(capture(name, part.src), part.region), ')');
    });
    execFileSync('convert', [...args, '-append', ...WEBP, out]);
    const h = parts.reduce((sum, part) => sum + part.region.h, 24 * (parts.length - 1));
    console.log(`✓ guide/${name}.webp — ${w}×${h} CSS px (${parts.length} stacked), ${Math.round(statSync(out).size / 1024)} KB`);
  } else {
    execFileSync('convert', [...cropArgs(capture(name, src), region), ...WEBP, out]);
    console.log(`✓ guide/${name}.webp — ${region.w}×${region.h} CSS px, ${Math.round(statSync(out).size / 1024)} KB`);
  }
}
