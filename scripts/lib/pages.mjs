// The pages the sweeps check, derived from the BUILD (dist/sitemap-0.xml) instead of a hand-kept
// list: a new page is covered the moment it exists. /404.html is not in a sitemap, so it is added.
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

export function sitemapPages(root) {
  const file = path.join(root, 'dist/sitemap-0.xml');
  if (!existsSync(file)) {
    console.error(`${file} not found. Run "npm run build" first: the pages to check are read from the built sitemap.`);
    process.exit(2);
  }
  const xml = readFileSync(file, 'utf8');
  const pages = [...xml.matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
  if (!pages.length) { console.error('No <loc> entries in dist/sitemap-0.xml'); process.exit(2); }
  return [...pages.sort(), '/404.html'];
}
