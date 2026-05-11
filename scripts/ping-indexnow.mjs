#!/usr/bin/env node
/**
 * Pings IndexNow with the full list of URLs from the just-built sitemap.
 * Notifies Bing, Yandex, Naver, Seznam, and Yep that the site has changed —
 * one POST does the fan-out. Wired into npm's `postdeploy` lifecycle hook
 * so it runs automatically after every `npm run deploy`.
 *
 * IndexNow protocol: https://www.indexnow.org/documentation
 *
 * The IndexNow spec requires a validation file at public/<KEY>.txt whose
 * filename AND body both equal the key string. Search engines fetch that
 * URL to verify ownership before accepting URL submissions. Since the
 * filename is the key by spec, the value lives in two physically required
 * spots: this constant and that file (filename + content are the same
 * thing). To rotate the key: change the constant below AND rename the
 * file in public/ AND update its body. Nothing else needs to change —
 * robots.txt is not part of the IndexNow spec.
 */

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITEMAP_PATH = join(ROOT, 'dist', 'sitemap-0.xml');

const HOST = 'abuobaydatajjarrah.com';
const KEY = 'a7086f9c3bb2b9788cbc9836ceddd3df';
const ENDPOINT = 'https://api.indexnow.org/IndexNow';

async function main() {
  let sitemap;
  try {
    sitemap = await readFile(SITEMAP_PATH, 'utf8');
  } catch {
    console.log(`[indexnow] no sitemap at ${SITEMAP_PATH} — skipping ping`);
    return;
  }

  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) {
    console.log('[indexnow] sitemap had zero <loc> entries — skipping ping');
    return;
  }

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    // 200 OK = accepted. 202 Accepted = accepted but still being validated.
    // 4xx/5xx = something off, log but don't fail the deploy.
    if (res.ok) {
      console.log(`[indexnow] pinged ${urls.length} URLs — HTTP ${res.status}`);
    } else {
      const body = await res.text();
      console.warn(`[indexnow] ping returned HTTP ${res.status}: ${body.slice(0, 300)}`);
    }
  } catch (err) {
    console.warn(`[indexnow] ping failed: ${err.message} (deploy still considered successful)`);
  }
}

main();
