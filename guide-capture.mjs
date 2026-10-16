#!/usr/bin/env node
/**
 * Captures the user guide's screens that the app repo's listing pipeline does not take: the admin
 * page, its Detect Fields result, and the Scope Builder.
 *
 *   node guide-capture.mjs /path/to/scope-planner      → .work/raw/*.png (gitignored)
 *   node shots.mjs /path/to/scope-planner              → crops them into assets/static/guide/
 *
 * READ-ONLY, deliberately: it clicks only 🔍 Detect Fields (reads Jira's field list), the Scope
 * Builder button and its project <select> — never Apply to form, Save, a sprint, or anything
 * else that writes. So unlike the listing's capture.mjs it needs no reseed and is safe to run
 * against the live staging app; it still drives that app, so not during someone's manual pass.
 *
 * It borrows the listing pipeline's helpers (scripts/listing-assets/lib.mjs): the saved E2E
 * session of user A (a Jira admin on the dev site), the staging install on the PAY demo board,
 * and the hiding of everything that is not the product (ribbon, "Stg" lozenge, cookie banner).
 */
import fs from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const APP_REPO = process.argv[2] || process.env.SCOPE_PLANNER_PATH || join(ROOT, '..', 'scope-planner');
const { launch, openApp, hideEnvLozenge, hideCookieBanner, frameOf, SITE, HOST_CSS } = await import(
  join(APP_REPO, 'scripts', 'listing-assets', 'lib.mjs')
);
// manifest.yml's app.id and the staging environment — e2e/helpers/adminConfig.ts has the why.
const ADMIN = `${SITE}/jira/apps/d879d74f-6f4f-469b-b533-2bb5e54aa36a/38d5d62c-dbcd-417d-8345-4f650c408a17`;
const OUT = join(ROOT, '.work', 'raw');
fs.mkdirSync(OUT, { recursive: true });

const { browser, page } = await launch({ width: 1520, height: 1400, dsf: 2 });
const shot = async (name) => {
  await page.mouse.move(5, page.viewportSize().height - 5);
  await page.waitForTimeout(400);
  await page.screenshot({ path: join(OUT, `${name}.png`) });
  console.log('📸', name);
};
let failed = false;
try {
  // The admin page, in a window tall enough for the whole form.
  await page.setViewportSize({ width: 1520, height: 2400 });
  await page.goto(ADMIN, { waitUntil: 'domcontentloaded' });
  await page.addStyleTag({ content: HOST_CSS }).catch(() => {});
  const admin = frameOf(page);
  await admin.locator('#acv-detect-btn').waitFor({ state: 'visible', timeout: 60000 });
  await hideCookieBanner(page);
  await hideEnvLozenge(page);
  await page.waitForTimeout(1500);
  await shot('admin-page');
  await admin.locator('#acv-detect-btn').click();
  await admin.locator('.acv-detect-result').waitFor({ state: 'visible', timeout: 60000 });
  await page.waitForTimeout(1200);
  await shot('admin-detect');

  // The Scope Builder with the demo project chosen and its sprints listed; Escape, nothing picked.
  await page.setViewportSize({ width: 1520, height: 1400 });
  const app = await openApp(page);
  await hideEnvLozenge(page);
  await app.locator('#ev-scope-builder-btn').click();
  await app.locator('#sb-project-select option').nth(1).waitFor({ state: 'attached', timeout: 30000 });
  const projects = await app.locator('#sb-project-select option').allTextContents();
  const pay = projects.find((p) => /Payments Platform/.test(p));
  if (!pay) throw new Error(`no Payments Platform project among ${JSON.stringify(projects)}`);
  await app.locator('#sb-project-select').selectOption({ label: pay });
  await app.locator('#sb-backlog-btn').waitFor({ state: 'visible', timeout: 30000 });
  await page.waitForTimeout(2500);
  await shot('scope-builder');
  await page.keyboard.press('Escape');
} catch (e) {
  failed = true;
  console.error('✗', e.message.split('\n')[0]);
  await page.screenshot({ path: join(OUT, 'ERR.png') }).catch(() => {});
} finally {
  await browser.close();
}
process.exit(failed ? 1 : 0);
