#!/usr/bin/env node
/**
 * Tells IndexNow (Bing, Yandex, Seznam) that the site's pages changed. Run it after a deploy is live:
 * the service fetches the key file from the site, so a ping before the deploy is refused.
 * The URLs are the published sitemap's and the key file is the one build.mjs wrote into public/.
 */
import { readdirSync, readFileSync } from 'node:fs';

const HOST = 'dsplugins.dev';
const keyFile = readdirSync('public').find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error('✗ No IndexNow key file in public/ — run npm run build.');
  process.exit(1);
}
const key = readFileSync(`public/${keyFile}`, 'utf8').trim();
const urlList = [...readFileSync('public/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${keyFile}`, urlList }),
});
console.log(`${res.ok ? '✓' : '✗'} IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`);
process.exit(res.ok ? 0 : 1);
