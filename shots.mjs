#!/usr/bin/env node
/**
 * Cuts the landing page's product screenshots out of the app repo's raw listing captures.
 *
 *   node shots.mjs /path/to/scope-planner      (or SCOPE_PLANNER_PATH=… node shots.mjs)
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
