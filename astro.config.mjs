import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

// Optional per-route lastmod map (path -> YYYY-MM-DD). Routes not listed get
// no lastmod at all (never the build date).
let lastmodMap = {};
try {
  lastmodMap = JSON.parse(readFileSync(new URL('./src/data/lastmod.json', import.meta.url), 'utf8'));
} catch {
  lastmodMap = {};
}

export default defineConfig({
  site: 'https://www.zoebnomi.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      serialize(item) {
        const pathname = new URL(item.url).pathname;
        // No lastmod entry -> omit it rather than claim the build date.
        if (lastmodMap[pathname]) item.lastmod = new Date(lastmodMap[pathname]).toISOString();
        return item;
      },
    }),
  ],
  build: {
    format: 'directory',
  },
});
